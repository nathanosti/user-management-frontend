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

interface CreateUserPayload {
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  avatar?: string;
  isActive?: boolean;
  role?: string;
  password: string;
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

export const getUserById = async (id: string): Promise<User> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: "GET",
    headers: {
      Accept: "*/*",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.log({ errorBody });

    if (response.status === 403) {
      const error = new Error(errorBody.message || "Acesso negado");
      (error as any).status = 403;
      throw error;
    }

    throw new Error(errorBody.message);
  }

  const user: User = await response.json();
  return user;
};

interface UpdateUserPayload {
  id: string;
  data: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>;
}

export const updateUser = async ({
  id,
  data,
}: UpdateUserPayload): Promise<User> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro ao atualizar usuário");
  }

  const updatedUser: User = await response.json();
  return updatedUser;
};

export const createUser = async (data: CreateUserPayload): Promise<User> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const payload = {
    ...data,
    birthDate: data.birthDate
      ? new Date(`${data.birthDate}T00:00:00`).toISOString()
      : undefined,
    isActive: data.isActive ?? true,
    role: data.role ?? "MEMBER",
  };

  const response = await fetch(`${apiUrl}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json();

    if (response.status === 400) {
      throw new Error(errorBody.message || "Dados inválidos.");
    }

    if (response.status === 409) {
      throw new Error("E-mail já está em uso.");
    }

    throw new Error(errorBody.message || "Erro ao criar usuário.");
  }

  const user: User = await response.json();
  return user;
};
