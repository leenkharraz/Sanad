import { redirect } from "next/navigation";

// Font size & appearance now live directly on the main Settings page
// (see AppTextDisplaySection) — this route is kept only for anyone with an
// old link or bookmark, and sends them straight there.
export default function DisplaySettingsRedirect() {
  redirect("/app/settings");
}
