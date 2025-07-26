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

export interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const fetchUsers = async (
  page: number,
  limit: number,
): Promise<UsersResponse> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/users?limit=${limit}&page=${page}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar os usuários");
  }

  const result = await response.json();

  return {
    data: result.data,
    meta: result.meta,
  };
};
