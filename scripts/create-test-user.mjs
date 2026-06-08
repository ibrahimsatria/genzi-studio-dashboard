#!/usr/bin/env node
// Creates a test user via the Supabase Auth REST API.
// Reads NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY from .env.local.

import { readFile } from "node:fs/promises";

const env = Object.fromEntries(
  (await readFile(".env.local", "utf8"))
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!URL || !ANON) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const email = process.argv[2] || `test+${Date.now()}@example.com`;
const password = process.argv[3] || "TestPassword12345!";

const res = await fetch(`${URL}/auth/v1/signup`, {
  method: "POST",
  headers: { "Content-Type": "application/json", apikey: ANON },
  body: JSON.stringify({ email, password }),
});
const data = await res.json();

if (!res.ok) {
  console.error("Sign up failed:", res.status, data);
  process.exit(1);
}

console.log("✓ Created user:", email);
console.log("  password:", password);
if (data.user?.confirmed_at == null && data.session == null) {
  console.warn(
    "⚠ Email confirmation is enabled — log into Supabase Dashboard → Authentication and disable it for local testing, OR confirm via the email link.",
  );
}
