import { Metadata } from "next";
import HomeSection from "@/sections/home";

export default function Home() {
  return <HomeSection />;
}

export const metadata: Metadata = {
  title: "Home | NextJS, ShadCN",
};
