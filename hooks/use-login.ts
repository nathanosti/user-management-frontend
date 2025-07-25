import { useState } from "react";
import { loginUser, LoginData, LoginResponse } from "../lib/api/login";
import { useUser } from "@/contexts/UserContext";

export function useLogin() {
  const { setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await loginUser(data);

      setUser({
        name: response.user.name,
        email: response.user.email,
        avatar: response.user.avatar,
      });

      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao realizar login");
      throw new Error(err.message || "Erro ao realizar login");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
