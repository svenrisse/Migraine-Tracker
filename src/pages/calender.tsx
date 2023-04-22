import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Navbar from "~/components/Navbar";
import Calendar from "react-calendar";
import { eachDayOfInterval, isSameDay } from "date-fns";
import { api } from "../utils/api";
import type { View } from "react-calendar/dist/cjs/shared/types";

export default function Calender() {
  function tileClassName({ date, view }: { view: View; date: Date }) {
    if (
      dates &&
      firstDates &&
      view == "month" &&
      firstDates.find((dDate) => isSameDay(dDate as Date, date))
    ) {
      return "bg-red-500";
    }

    if (
      dates &&
      view === "month" &&
      dates.flat().find((dDate) => isSameDay(dDate, date))
    ) {
      return "bg-cyan-700";
    }
  }

  function handleDayClick(value: Date) {
    console.log(value);
  }

  const router = useRouter();
  const { data: authData, status } = useSession();

  if (!authData && typeof window !== "undefined" && status !== "loading") {
    void router.push("/");
  }

  const { data } = api.event.listEvents.useQuery();

  const dates = data?.map((event) => {
    return event.endTime
      ? eachDayOfInterval({
          start: event.startTime,
          end: event.endTime,
        })
      : eachDayOfInterval({
          start: event.startTime,
          end: event.startTime,
        });
  });

  const firstDates = dates?.map((d) => {
    return d[0];
  });

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0ea5e9] to-[#0e7490]">
        <div className="w-11/12 rounded-lg bg-slate-200 px-2 py-4">
          <Calendar
            tileClassName={tileClassName}
            onClickDay={(value) => handleDayClick(value)}
            next2Label={null}
            prev2Label={null}
          />
        </div>
      </main>
      <Navbar focused="calender" />
    </>
  );
}