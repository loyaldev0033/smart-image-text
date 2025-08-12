import { Metadata } from "next";
import ClientEditor from "./ClientEditor";

export default function EditorPage() {
  return <ClientEditor />;
}

export const metadata: Metadata = {
  title: "Image Text Composer",
};