import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { throw new Error("AuthContext not initialized") },
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      console.log('Initializing auth with token:', token ? 'Token exists' : 'No token');
      
      if (!token) {
        console.log('No token found, clearing user state');
        setUser(null);
        if (window.location.pathname !== '/login') {
          console.log('Redirecting to login due to missing token');
          window.location.href = '/login';
        }
        return;
      }

      try {
        console.log('Setting up API headers with token');
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        console.log('Fetching user profile');
        const response = await api.get("/auth/me");
        console.log('User profile fetched:', response.data);
        setUser(response.data);
      } catch (error: any) {
        console.error('Auth initialization error:', error.response?.data || error.message);
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
        if (window.location.pathname !== '/login') {
          console.log('Redirecting to login due to auth error');
          window.location.href = '/login';
        }
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const response = await api.post("/auth/login", {
        username: email,
        password: password
      });
      console.log('Login response:', response.data);
      
      const { access_token } = response.data;
      if (!access_token) {
        console.error('Login failed: No access token received');
        throw new Error('No access token received');
      }
      
      console.log('Storing token in localStorage');
      localStorage.setItem("token", access_token);
      
      console.log('Setting up API headers with token');
      api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      
      console.log('Fetching user profile');
      const userResponse = await api.get("/auth/me");
      console.log('User profile fetched:', userResponse.data);
      
      if (!userResponse.data.role) {
        console.error('Login failed: User role not found');
        throw new Error('User role not found');
      }
      
      setUser(userResponse.data);
      console.log('Auth context updated with user data');
      
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      localStorage.removeItem("token");
      delete api.defaults.headers.common["Authorization"];
      setUser(null);
      throw new Error(error.response?.data?.detail || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
