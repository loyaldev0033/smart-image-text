"use client";

import React, { useEffect } from "react";
import { MailOpen } from "lucide-react";
import { useTransitionRouter } from "@/lib/view-transition/use-transition-router";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

type EmptyStateProps = {
  message: string;
  subMessage: string;
};

// Components
const EmptyState: React.FC<EmptyStateProps> = ({ message, subMessage }) => (
  <div className="flex w-full justify-center items-center py-10">
    <div className="flex flex-col w-full md:gap-1 gap-2 justify-center items-center">
      <MailOpen />
      <div className="rounded-lg p-8 text-center">
        <p className="text-gray-600 mb-2">{message}</p>
        <p className="text-sm text-gray-500">{subMessage}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const router = useTransitionRouter();
  const searchParams = useSearchParams();

  // const { status: authenticationStatus } = useSession();

  return (
    <div className="py-8">
      <h3>This is NextJS, ShadCN UI</h3>
    </div>
  );
};

export default Dashboard;
