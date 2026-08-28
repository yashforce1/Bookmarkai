
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

console.log('🔗 Backend URL:', API_BASE_URL);

export interface signUpData {
  email: string;
  name: string;
  password: string;
}

export interface signInData {
  email: string;
  password: string;
}

export interface authResponse {
  message: string;
  token:string;
  data: {
    name: string;
    email: string;
  };
}

export const authApi = {
  // signup Api
  signUp: async (data: signUpData): Promise<authResponse> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || error.message || "Signup Failded");
    }
    return res.json();
  },

  // signin Api
  SignIn: async (data: signInData): Promise<authResponse> => {
    const res = await fetch(`${API_BASE_URL}/api/v1/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || error.message || "Sign in Failed");
    }
    return res.json();
  },
};
