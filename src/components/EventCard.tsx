import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import { createId } from "@paralleldrive/cuid2";
import { BsFillTrashFill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";
import Modal from "react-modal";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import MedicationCard from "~/components/MedicationCard";

export default function EventCard({
  event,
}: {
  event: RouterOutputs["event"]["getEvent"] | undefined;
}) {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const utils = api.useContext();

  const { mutateAsync, isLoading } = api.event.deleteEvent.useMutation({
    onSuccess: () => {
      closeModal(), utils.event.invalidate();
    },
  });

  function handleDeleteClick(id: string, e: React.SyntheticEvent) {
    e.preventDefault();
    e.stopPropagation();
    mutateAsync({ id: id });
  }

  const questions = event?.questions.map((question) => {
    return <div key={createId()}>{question}</div>;
  });

  const eventMedications = event?.medications.map((medication) => {
    return (
      <MedicationCard
        key={medication.id}
        medication={medication}
        id={medication.id}
        showDelete={false}
      />
    );
  });

  return (
    <div className="rounded-md bg-gray-50 p-2">
      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col items-center rounded-lg border-2 border-cyan-900 px-2 py-1">
          <div>{event?.startTime.toLocaleDateString()}</div>
          <div className="text-sm">
            {event?.startTime.toLocaleTimeString().slice(0, 5)}
          </div>
        </div>
        <div className="font-bold"> - </div>
        <div>
          {event?.endTime ? (
            <div className="flex flex-col items-center rounded-lg border-2 border-cyan-900 px-2 py-1">
              <div>{event?.endTime?.toLocaleDateString()}</div>
              <div className="text-sm">
                {event.endTime.toLocaleTimeString().slice(0, 5)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-lg border-2 border-cyan-900 px-2 py-1  text-gray-500">
              No End Time
            </div>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <h4>Type:</h4>
        {event?.type ? (
          <div>{event.type}</div>
        ) : (
          <div className="text-gray-500">None</div>
        )}
      </div>
      <div className="flex gap-2">
        <h4>Pain:</h4>
        {event?.painScale ? (
          <div>{event.painScale}</div>
        ) : (
          <div className="text-gray-500">None</div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <h4 className="text-sm text-gray-500">Medications:</h4>

        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-1">{eventMedications}</div>
        </div>
      </div>
      <div>
        <h4>Questions answered with yes:</h4>
        <div>{questions}</div>
      </div>
      <div className="flex gap-2">
        <h4>Note:</h4>
        {event?.notes ? (
          <p>{event.notes}</p>
        ) : (
          <div className="text-gray-500">None</div>
        )}
      </div>
      <div className="flex">
        <button onClick={openModal}>
          <BsFillTrashFill size="1.5rem" className="cursor-pointer" />
        </button>
        <Link href={`/edit/${event && event.id}`}>
          <AiFillEdit size={"1.5rem"} />
        </Link>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="fixed inset-x-0 top-1/2 mx-auto flex w-2/3 flex-col items-center rounded-lg border-0 bg-slate-300 py-8 md:w-5/12 lg:w-1/4 lg:py-12 xl:w-1/5 2xl:w-1/6"
        appElement={document.getElementById("__next") as HTMLElement}
      >
        <h2 className="mb-5 text-lg font-bold">Are you sure?</h2>
        <div className="flex items-center">
          {!isLoading && (
            <button
              className="mr-5 w-20 rounded-xl bg-cyan-900 py-2 font-bold text-white active:bg-cyan-700"
              onClick={() => closeModal()}
            >
              Cancel
            </button>
          )}
          <button
            className="w-20 rounded-xl bg-red-400 py-2 text-center font-bold text-white active:bg-red-300"
            onClick={(e) =>
              handleDeleteClick(
                event && typeof event.id === "string" ? event.id : "",
                e
              )
            }
          >
            <div className="flex items-center justify-center">
              {isLoading ? (
                <TailSpin height="1.5rem" width="2rem" color="white" />
              ) : (
                <span>Delete</span>
              )}
            </div>
          </button>
        </div>
      </Modal>
    </div>
  );
}
