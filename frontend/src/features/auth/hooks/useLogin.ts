import { useState } from "react";
import { authApi, type signInData } from "../services/auth.api";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {login: saveAuth} = useAuth(); // login from context

  const login = async (data: signInData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authApi.SignIn(data);
      
      saveAuth(res.token,res.data);
      
      toast.success("Account logged in successfully!");
      return res;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login Failed!";
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return { isLoading, error, login };
};
