export interface VenueFormInput {
  name: string;
  short_name: string;
  location?: string;
  capacity?: number | null;
  availability_start?: string; // e.g. "08:00"
  availability_end?: string;   // e.g. "18:00"
  is_active: boolean;
}

export type VenueValidationErrorMap = Partial<Record<keyof VenueFormInput, string>>;

export interface VenueValidationResult {
  isValid: boolean;
  errors: VenueValidationErrorMap;
}

/**
 * Validates Venue form inputs.
 */
export function validateVenueForm(input: Partial<VenueFormInput>): VenueValidationResult {
  const errors: VenueValidationErrorMap = {};

  // Name validation
  if (!input.name || !input.name.trim()) {
    errors.name = "Venue name is required.";
  } else if (input.name.trim().length < 2) {
    errors.name = "Venue name must be at least 2 characters.";
  } else if (input.name.trim().length > 100) {
    errors.name = "Venue name cannot exceed 100 characters.";
  }

  // Short Name validation
  if (!input.short_name || !input.short_name.trim()) {
    errors.short_name = "Short name is required (e.g. Central Pitch).";
  } else if (input.short_name.trim().length < 2) {
    errors.short_name = "Short name must be at least 2 characters.";
  }

  // Capacity validation
  if (input.capacity !== undefined && input.capacity !== null && input.capacity < 0) {
    errors.capacity = "Capacity cannot be negative.";
  }

  // Availability time range validation
  if (input.availability_start && input.availability_end) {
    if (input.availability_end <= input.availability_start) {
      errors.availability_end = "Availability end time must be after start time.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
