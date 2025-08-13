import { Link } from "@/components/view-transition";
import Image from "next/image";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      {/* <Image
        src="/images/404.png" // <-- Replace with the correct path to your image
        alt="Not Found"
        width={200}
        height={150}
        priority
      /> */}
      <h1 className="mt-6 text-3xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-lg text-gray-600">
        Oops! The page you are looking for does not exist.
      </p>
      <div className="mt-4 underline underline-offset-4 text-primary">
        <Link href="/">Return Home</Link>
      </div>
    </div>
  );
}
