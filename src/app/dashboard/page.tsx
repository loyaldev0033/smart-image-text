import DashboardSection from "@/sections/dashboard";
import { Metadata } from "next";

export default function Dashboard() {
  return <DashboardSection />;
}

export const metadata: Metadata = {
  title: "Dashboard | NextJS, ShadCN",
};
