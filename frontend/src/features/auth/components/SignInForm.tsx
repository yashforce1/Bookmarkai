import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { isLoading, login, guestLogin } = useLogin();
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await login({ email, password });
      // making elements
      setEmail("");
      setPassword("");

      // redirect
      navigate("/dashboard");
    } catch (error) {}
  }

  async function handleGuestLogin() {
    try {
      await guestLogin();
      navigate("/dashboard");
    } catch (error) {}
  }

  return (
    <div className="min-h-screen flex items-center justify-center from-slate-50 to-slate-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-slate-900">Sign In</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              className="w-full"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
              className="w-full"
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="my-5 flex items-center gap-3 text-slate-400">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs uppercase tracking-wide">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isLoading}
          size="lg"
          onClick={handleGuestLogin}
        >
          {isLoading ? "Entering as guest..." : "Continue as Guest"}
        </Button>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600">Don't have an account?</p>
          <Button
            variant="link"
            type="button"
            onClick={() => navigate('/sign-up')}
            className="text-primary font-semibold hover:underline"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
}
