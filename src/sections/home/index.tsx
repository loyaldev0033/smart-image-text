"use client";

import { LockIcon, FileTextIcon, ShieldIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useBoolean } from "@/hooks/use-boolean";
import SignModal from "@/components/modal/sign-modal";
import { useSession } from "next-auth/react";
import { useTransitionRouter } from "@/lib/view-transition";

export default function HomeSection() {
  const searchParams = useSearchParams();
  const [isWriting, setIsWriting] = useState(false);
  const signModalOpen = useBoolean();
  const router = useTransitionRouter();



  return (
    <div>
      <SignModal
        isOpen={signModalOpen.value}
        onClose={signModalOpen.onFalse}
      />
      <section className="py-20 bg-gray-700 flex flex-col gap-12 items-center border-b-4 border-gray-400">
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-2 text-center">
            You worked with them.
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 text-center">
            Say what it was like—anonymously.
          </h1>
        </div>
        <div className="flex items-center flex-col gap-4">
          <button
            className="font-bold px-8 py-4 bg-white text-gray-700 text-xl rounded-full"
            onClick={() => setIsWriting(true)}
          >
            Write a Review{" "}
          </button>
          <div className="flex flex-col items-center text-white">
            <p className="text-center text-sm">
              Posting anonymously without an account costs $1. Why?
            </p>
            <p className="text-center text-sm">
              Because bots don&apos;t have credit cards.
            </p>
            <p className="text-center text-sm">
              Or create an account to post for free - still anonymously.
            </p>
          </div>
        </div>
      </section>
      <section className="py-20 flex flex-col items-center">
        <div className="flex flex-col gap-12 border-2 p-12 rounded-lg shadow-lg w-5xl text-gray-600">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-4xl font-bold text-gray-800 leading-tight mb-2 text-center">
              Want to know what others said?
            </h1>
            <p className="text-center text-xl">Viewing is gated for trust.</p>
          </div>
          <div className="flex flex-col gap-5 items-center">
            <p className="flex items-center gap-2">
              <LockIcon className="w-6 h-6" />
              Login required to view
            </p>
            <p className="flex items-center gap-2">
              <FileTextIcon className="w-6 h-6" />
              Everyone accepts the terms
            </p>
            <p className="flex items-center gap-2">
              <ShieldIcon className="w-6 h-6" />
              AI reviews every post
            </p>
          </div>
          <div className="flex flex-col gap-8 items-center">
            <p>
              Structured insight into what it&apos;s actually like to work with
              someone.
            </p>
            <button
              className="bg-gray-800 text-white px-12 py-4 border-4 border-gray-600 rounded-full text-lg font-bold"
            >
              Enter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
