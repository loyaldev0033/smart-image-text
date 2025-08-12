import { axiosGet } from "@/api";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const linkedinUrlRegex =
  /^https:\/\/(www\.)?linkedin\.com\/(in\/)?[\w\-._~:/?#[\]@!$&'()*+,;=]+\/?$/i;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function checkLinkedInProfile(url: string) {
  try {
    const response = await axiosGet(url);
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error: any) {
    if (error?.response && error?.response?.status === 404) {
      console.error("Profile does not exist");
    } else {
      console.error("An error occurred:", error?.message);
    }
    return false;
  }
}
