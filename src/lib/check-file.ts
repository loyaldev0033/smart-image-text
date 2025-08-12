export const checkFileExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-cache",
    });
    return response.ok;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
};
