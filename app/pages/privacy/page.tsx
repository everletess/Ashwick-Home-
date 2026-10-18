import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = { title: "Privacy policy" };
export const revalidate = 3600;

export default function PrivacyPage() {
  return <PolicyPage kind="privacyPolicy" title="Privacy policy" />;
}
