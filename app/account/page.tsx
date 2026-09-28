import type { Metadata } from "next";
import { SignInForm } from "@/components/forms";

export const metadata: Metadata = { title: "Sign in" };

export default function AccountPage() {
  return (
    <main>
      <section className="acct">
        <div className="eyebrow">Account</div>
        <h1 className="h2">Sign in</h1>
        <SignInForm />
        <div className="acct-links">
          <a href="#">Forgot your password?</a>
          <a href="#">Create an account</a>
        </div>
      </section>
    </main>
  );
}
