import { fetchUsers, getUserById } from "@/lib/api/users";
import { useQuery } from "@tanstack/react-query";

export function useUsers(page: number, limit: number) {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => fetchUsers(page, limit),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    retry: 3,
  });
}

export function useUserDetails(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
    retry: 2,
  });
}
