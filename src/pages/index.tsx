import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { TailSpin } from "react-loader-spinner";

export default function Home() {
  const { data: authData, status } = useSession();
  const router = useRouter();

  if (authData && typeof window !== "undefined") {
    void router.push("/dashboard");
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div className="flex w-3/4 flex-col items-center rounded-xl bg-slate-200">
          <h1 className="py-8 text-xl font-bold">Migraine-Tracker</h1>
          {status === "loading" ? (
            <>
              <TailSpin />
              <p>Loading...</p>
            </>
          ) : (
            <>
              <p>Please sign in to continue</p>
              <div className="py-4">
                <button
                  className="rounded-xl bg-emerald-200 px-6 py-3 text-lg font-bold"
                  onClick={() => void signIn()}
                >
                  Signin
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
