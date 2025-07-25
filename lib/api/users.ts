import { useQuery } from "@tanstack/react-query";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  phone: string;
  birthDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const fetchUsers = async (
  page: number,
  limit: number,
): Promise<{ data: User[]; total: number }> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/users?limit=${limit}&page=${page}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar os usuários");
  }

  return response.json();
};

export function useUsers(page: number, limit: number) {
  return useQuery({
    queryKey: ["users", page, limit],
    queryFn: () => fetchUsers(page, limit),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 3,
  });
}
