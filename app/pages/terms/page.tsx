import type { Metadata } from "next";
import { PolicyPage } from "@/components/policy-page";

export const metadata: Metadata = { title: "Terms of service" };
export const revalidate = 3600;

export default function TermsPage() {
  return <PolicyPage kind="termsOfService" title="Terms of service" />;
}
