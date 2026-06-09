import { redirect } from "next/navigation";

// The overview/home lives at /dashboard. This alias makes the obvious deep link
// /dashboard/overview (and refreshes on it) resolve instead of 404-ing.
export default function OverviewRedirect() {
  redirect("/dashboard");
}
