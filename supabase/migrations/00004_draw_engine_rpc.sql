-- ─── SPRINT 2 TASK 1: Official Group A / Group B Draw Engine RPC Function ──────

-- 1. Ensure Groups Helper Function (Creates Group A and Group B if missing)
CREATE OR REPLACE FUNCTION public.ensure_groups_exist(p_tournament_id UUID)
RETURNS TABLE (group_a_id UUID, group_b_id UUID, max_per_group INT) AS $$
DECLARE
  v_group_a UUID;
  v_group_b UUID;
  v_num_groups INT;
  v_teams_per_group INT;
BEGIN
  -- Read settings
  SELECT num_groups, teams_per_group INTO v_num_groups, v_teams_per_group
  FROM public.tournament_settings
  WHERE tournament_id = p_tournament_id;

  IF v_teams_per_group IS NULL OR v_teams_per_group < 1 THEN
    v_teams_per_group := 4;
  END IF;

  -- Ensure Group A exists
  SELECT id INTO v_group_a FROM public.groups
  WHERE tournament_id = p_tournament_id AND name = 'Group A';

  IF v_group_a IS NULL THEN
    INSERT INTO public.groups (tournament_id, name, max_teams)
    VALUES (p_tournament_id, 'Group A', v_teams_per_group)
    RETURNING id INTO v_group_a;
  END IF;

  -- Ensure Group B exists
  SELECT id INTO v_group_b FROM public.groups
  WHERE tournament_id = p_tournament_id AND name = 'Group B';

  IF v_group_b IS NULL THEN
    INSERT INTO public.groups (tournament_id, name, max_teams)
    VALUES (p_tournament_id, 'Group B', v_teams_per_group)
    RETURNING id INTO v_group_b;
  END IF;

  RETURN QUERY SELECT v_group_a, v_group_b, v_teams_per_group;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Atomic Single Team Draw RPC Function
CREATE OR REPLACE FUNCTION public.execute_draw_single_team(
  p_tournament_id UUID,
  p_team_id UUID,
  p_drawn_by UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_group_a UUID;
  v_group_b UUID;
  v_max_per_group INT;
  v_count_a INT;
  v_count_b INT;
  v_target_group UUID;
  v_target_group_name TEXT;
  v_drawn_position INT;
  v_team_name TEXT;
  v_total_eligible INT;
  v_total_drawn INT;
  v_timestamp TIMESTAMPTZ := NOW();
BEGIN
  -- 1. Concurrency Lock on Tournament Row to prevent race conditions
  PERFORM 1 FROM public.tournaments WHERE id = p_tournament_id FOR UPDATE;

  -- 2. Check if team exists and is active
  SELECT name INTO v_team_name FROM public.teams
  WHERE id = p_team_id AND tournament_id = p_tournament_id;

  IF v_team_name IS NULL THEN
    RAISE EXCEPTION 'Team ID % does not exist in tournament %', p_team_id, p_tournament_id;
  END IF;

  -- 3. Duplicate check (Idempotency & Double SPIN protection)
  IF EXISTS (
    SELECT 1 FROM public.draw_records
    WHERE tournament_id = p_tournament_id AND team_id = p_team_id
  ) THEN
    RAISE EXCEPTION 'Team "%" has already been drawn in this tournament.', v_team_name;
  END IF;

  -- 4. Ensure Group A and Group B exist
  SELECT group_a_id, group_b_id, max_per_group
  INTO v_group_a, v_group_b, v_max_per_group
  FROM public.ensure_groups_exist(p_tournament_id);

  -- 5. Count current allocations in Group A and Group B
  SELECT COUNT(*) INTO v_count_a FROM public.group_memberships WHERE group_id = v_group_a;
  SELECT COUNT(*) INTO v_count_b FROM public.group_memberships WHERE group_id = v_group_b;

  -- 6. Execute Official Allocation Algorithm
  IF v_count_a >= v_max_per_group AND v_count_b >= v_max_per_group THEN
    RAISE EXCEPTION 'Both Group A and Group B are full (capacity: % each).', v_max_per_group;
  ELSIF v_count_a >= v_max_per_group THEN
    v_target_group := v_group_b;
    v_target_group_name := 'Group B';
  ELSIF v_count_b >= v_max_per_group THEN
    v_target_group := v_group_a;
    v_target_group_name := 'Group A';
  ELSE
    -- Random allocation (50/50 probability)
    IF random() < 0.5 THEN
      v_target_group := v_group_a;
      v_target_group_name := 'Group A';
    ELSE
      v_target_group := v_group_b;
      v_target_group_name := 'Group B';
    END IF;
  END IF;

  -- 7. Calculate next draw order position
  SELECT COUNT(*) + 1 INTO v_drawn_position
  FROM public.draw_records
  WHERE tournament_id = p_tournament_id;

  -- 8. Atomic Database Persistence
  -- A. Group Membership
  INSERT INTO public.group_memberships (tournament_id, group_id, team_id, seed, allocated_at)
  VALUES (p_tournament_id, v_target_group, p_team_id, v_drawn_position, v_timestamp);

  -- B. Draw Record
  INSERT INTO public.draw_records (tournament_id, team_id, group_id, drawn_position, drawn_by, drawn_at)
  VALUES (p_tournament_id, p_team_id, v_target_group, v_drawn_position, p_drawn_by, v_timestamp);

  -- C. Draw Audit Log
  INSERT INTO public.draw_audit_logs (tournament_id, action, performed_by, payload, created_at)
  VALUES (
    p_tournament_id,
    'TEAM_DRAWN',
    p_drawn_by,
    jsonb_build_object(
      'team_id', p_team_id,
      'team_name', v_team_name,
      'group_id', v_target_group,
      'group_name', v_target_group_name,
      'drawn_position', v_drawn_position,
      'drawn_at', v_timestamp
    ),
    v_timestamp
  );

  -- 9. Check if all eligible teams are drawn to transition status to DRAW_COMPLETED
  SELECT COUNT(*) INTO v_total_eligible FROM public.teams WHERE tournament_id = p_tournament_id AND is_active = true;
  SELECT COUNT(*) INTO v_total_drawn FROM public.draw_records WHERE tournament_id = p_tournament_id;

  IF v_total_drawn >= v_total_eligible THEN
    UPDATE public.tournaments
    SET status = 'DRAW_COMPLETED', updated_at = v_timestamp
    WHERE id = p_tournament_id;
  ELSIF v_total_drawn > 0 THEN
    UPDATE public.tournaments
    SET status = 'DRAW_IN_PROGRESS', updated_at = v_timestamp
    WHERE id = p_tournament_id AND status IN ('DRAFT', 'REGISTRATION_OPEN', 'READY_FOR_DRAW');
  END IF;

  -- 10. Return JSON Result
  RETURN jsonb_build_object(
    'success', true,
    'tournament_id', p_tournament_id,
    'team_id', p_team_id,
    'team_name', v_team_name,
    'group_id', v_target_group,
    'group_name', v_target_group_name,
    'drawn_position', v_drawn_position,
    'drawn_at', v_timestamp,
    'is_draw_completed', v_total_drawn >= v_total_eligible
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execution permission to authenticated and anon client roles
GRANT EXECUTE ON FUNCTION public.execute_draw_single_team(UUID, UUID, UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.ensure_groups_exist(UUID) TO authenticated, anon;
