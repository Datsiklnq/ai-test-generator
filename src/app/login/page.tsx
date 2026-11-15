"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function LoginPage() {
  const { user, loading, signIn, signUp, logOut } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (creating) await signUp(email.trim(), password);
      else await signIn(email.trim(), password);
      router.push("/pages/generate-test-case");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <main className="min-h-screen bg-gray-900 p-10 text-center text-white">Checking sign-in...</main>;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-900 px-4 py-24 text-gray-100">
      <section className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-800 p-8">
        <h1 className="mb-2 text-2xl font-semibold text-white">{user ? "You are signed in" : creating ? "Create account" : "Sign in"}</h1>
        {user ? (
          <div className="space-y-4">
            <p className="text-gray-300">Signed in as {user.email}</p>
            <button className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium hover:bg-blue-700" onClick={() => router.push("/pages/generate-test-case")}>Continue to generator</button>
            <button className="w-full rounded-lg border border-gray-600 px-4 py-3" onClick={() => void logOut()}>Sign out</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-sm text-gray-300">Email
              <input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white" />
            </label>
            <label className="block text-sm text-gray-300">Password
              <input type="password" autoComplete={creating ? "new-password" : "current-password"} minLength={6} required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-600 bg-gray-900 p-3 text-white" />
            </label>
            {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
            <button disabled={busy} className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium hover:bg-blue-700 disabled:opacity-60">{busy ? "Please wait..." : creating ? "Create account" : "Sign in"}</button>
            <button type="button" className="w-full text-sm text-blue-300 hover:underline" onClick={() => { setCreating(!creating); setError(""); }}>
              {creating ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
          </form>
        )}
        <Link href="/" className="mt-6 block text-center text-sm text-gray-400 hover:text-white">Back to home</Link>
      </section>
    </main>
  );
}
