export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  accessToken: string;
  refreshToken: string;
}

export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Falha ao realizar login");
  }

  return response.json();
}

export async function logoutUser() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const response = await fetch(`${apiUrl}/auth/logout`, {
    method: "POST",
    headers: {
      Accept: "*/*",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Falha ao realizar logout");
  }

  return response.json();
}
