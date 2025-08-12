import { axiosPut, profileQueryKeys } from "@/api";
import { endpoints } from "@/constants/endpoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useFollowProfile(refetch?: () => void) {
  const queryClient = useQueryClient();
  const followProfileFn = async (id: string) => {
    return await axiosPut(endpoints.profile.followProfile(id));
  };

  return useMutation({
    mutationFn: followProfileFn,
    onSuccess: (_, variables) => {
      queryClient.refetchQueries({
        queryKey: profileQueryKeys.detail(variables),
      });
      refetch?.();
    },
    retry: 1,
  });
}
