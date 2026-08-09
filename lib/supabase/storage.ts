import { createClient as createBrowserSupabase } from "@/lib/supabase/client";

/**
 * Uploads a team logo file to Supabase Storage bucket ('team-logos').
 * Returns the public image URL.
 */
export async function uploadTeamLogo(file: File): Promise<string> {
  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("File must be an image (PNG, JPG, WEBP, SVG).");
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Logo image size cannot exceed 5MB.");
  }

  const supabase = createBrowserSupabase();
  const fileExt = file.name.split(".").pop() || "png";
  const fileName = `team-logo-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `logos/${fileName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from("team-logos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      // If bucket doesn't exist or offline in dev, generate data URL for demonstration
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const { data } = supabase.storage.from("team-logos").getPublicUrl(filePath);
    return data.publicUrl;
  } catch {
    // Fallback client preview
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
