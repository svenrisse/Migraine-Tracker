import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import { api } from "../utils/api";

export default function List() {
  const router = useRouter();
  const { data: authData } = useSession();

  if (!authData && typeof window !== "undefined") {
    void router.push("/");
  }

  const { data } = api.event.listEvents.useQuery();

  const events = data?.map((event) => {
    return (
      <>
        <div>this is a event</div>
        <div>{event.startTime.toLocaleDateString()}</div>
      </>
    );
  });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#059669] to-[#115e59]">
        <div>{events}</div>
      </main>
      <Navbar focused="list" />
    </>
  );
}
