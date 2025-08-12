import { PLATFORM } from "@/constants/platform";

export const getDeviceID = () => {
  const a = localStorage.getItem("DeviceID");
  if (a) {
    return a;
  }
  const newDeviceId = `${Math.random() * 10e16}`;
  localStorage.setItem("DeviceID", newDeviceId);
  return newDeviceId;
};

export const getDevicePlatform = () => {
  const width = window.innerWidth;
  if (width <= 767) {
    return PLATFORM.ANDROID;
  }
  return PLATFORM.WEB;
};

export const getRandomHash = (length: number) => {
  let result = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
