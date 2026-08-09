import { createBrowserClient } from "@supabase/ssr";
import fs from "fs";
import path from "path";

const envFile = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8");
const envVars: Record<string, string> = {};
envFile.split("\n").forEach((line) => {
  const [k, ...v] = line.trim().split("=");
  if (k && v.length) envVars[k] = v.join("=");
});

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Testing Supabase connection with URL:", url);

if (!url || !key) {
  console.error("Missing env vars!");
  process.exit(1);
}

const supabase = createBrowserClient(url, key);

async function test() {
  const { data: tData, error: tErr } = await supabase.from("tournaments").select("*");
  console.log("Tournaments query result:", { count: tData?.length, error: tErr });

  const { data: vData, error: vErr } = await supabase.from("venues").select("*");
  console.log("Venues query result:", { count: vData?.length, error: vErr });

  const { data: tmData, error: tmErr } = await supabase.from("teams").select("*");
  console.log("Teams query result:", { count: tmData?.length, error: tmErr });
}

test().catch(console.error);
