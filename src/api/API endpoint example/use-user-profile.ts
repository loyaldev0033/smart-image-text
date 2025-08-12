import { axiosGet, profileQueryKeys } from "@/api";
import { endpoints } from "@/constants/endpoints";
import { useQuery } from "@tanstack/react-query";

export function useUserProfile() {
  const getProfileFn = async () => {
    return await axiosGet(`${endpoints.profile.base}/me`);
  };

  return useQuery({
    queryKey: profileQueryKeys.me(),
    queryFn: getProfileFn,
    retry: 1,
  });
}
