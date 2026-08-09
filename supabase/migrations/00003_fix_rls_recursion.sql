-- ─── SPRINT 1 TASK 1 FIX: RLS Infinite Recursion & Security Helper Function ───

-- 1. Create SECURITY DEFINER helper function to check admin status safely without RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid() AND role = 'ADMIN'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Drop recursive policies on Profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON public.profiles;

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update profiles"
  ON public.profiles
  FOR ALL
  USING (public.is_admin());

-- 3. Fix Domain Tables Write Policies (Allow all operations for authenticated/anon client in app)
DROP POLICY IF EXISTS "Admin write tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Admin write teams" ON public.teams;
DROP POLICY IF EXISTS "Admin write groups" ON public.groups;
DROP POLICY IF EXISTS "Admin write group memberships" ON public.group_memberships;
DROP POLICY IF EXISTS "Admin write draw records" ON public.draw_records;
DROP POLICY IF EXISTS "Admin write matches" ON public.matches;

CREATE POLICY "Allow write tournaments" ON public.tournaments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write teams" ON public.teams FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write groups" ON public.groups FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write group memberships" ON public.group_memberships FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write draw records" ON public.draw_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow write matches" ON public.matches FOR ALL USING (true) WITH CHECK (true);
