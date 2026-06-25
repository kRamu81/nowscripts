import { useQuery } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { url } from "../baseUrl";
import useLocalStorage, { clearLocalStorage } from "../hooks/useLocalStorage";
import { httpRequest } from "../interceptor/axiosInterceptor";

export type User = {
  avatar: string;
  bio: string;
  email: string;
  name: string;
  _id: string;
  role?: string;
  list: Array<any>;
};

type ContextType = {
  user: User | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout(): void;
  handleUser(user: User): void;
};

const Context = createContext<ContextType | undefined>(undefined);

type AuthProps = {
  children: ReactNode;
};

export default function Auth({ children }: AuthProps) {
  const [user, setUser] = useLocalStorage<User | undefined>("user", undefined);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          setIsLoading(false);
          setIsAuthenticated(false);
          return;
        }

        const res = await httpRequest.get(`${url}/auth/me`);
        if (res.data && res.data.user) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Auth verification failed", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }
    verifyAuth();
  }, []);

  async function logout() {
    try {
      const refreshTokenStr = localStorage.getItem("refresh_token");
      if (refreshTokenStr && refreshTokenStr !== "undefined") {
        const refresh_token = JSON.parse(refreshTokenStr);
        if (refresh_token) {
          await httpRequest.post(`${url}/auth/logout`, { refresh_token });
        }
      }
    } catch (err) {
      console.error("Logout failed to notify server", err);
    } finally {
      setUser(undefined);
      setIsAuthenticated(false);
      clearLocalStorage();
      window.location.href = "/";
    }
  }

  function handleUser(user: User) {
    setUser(user);
    setIsAuthenticated(true);
  }

  const contextValue: ContextType = {
    user,
    isAuthenticated,
    isLoading,
    logout,
    handleUser,
  } as const;
  
  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export function useAuth() {
  return useContext(Context) as ContextType;
}
