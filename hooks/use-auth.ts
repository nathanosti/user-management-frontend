import { useState } from "react";
import {
  loginUser,
  logoutUser,
  LoginData,
  LoginResponse,
} from "../lib/api/auth";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { delay } from "@/lib/utils";

export function useAuth() {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

      await delay(1000);
      router.push("/");

      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao realizar login");
      throw new Error(err.message || "Erro ao realizar login");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await logoutUser();
      setUser({ name: "", email: "", avatar: "" });

      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Erro ao realizar logout");
    } finally {
      setIsLoading(false);
    }
  };

  return { user, login, logout, isLoading, error };
}
