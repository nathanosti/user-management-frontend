import { useState } from "react";
import { loginUser, LoginData, LoginResponse } from "../api/login";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await loginUser(data);
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
