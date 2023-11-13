import React, { createContext, useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login, register } from "@/services/auth.service.ts";
import { useToast } from "@/components/ui/use-toast.ts";

interface AuthContext {
  user: {} | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  signUp: (user: any) => Promise<void>;
  isLoadingLogin: boolean;
  isLoadingRegister: boolean;
}

const authContext = createContext({} as AuthContext);

export const ProvideAuth = ({ children }: { children: React.ReactNode }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext<AuthContext>(authContext);
};

const useProvideAuth = (): AuthContext => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: (user: { email: string; password: string }) => {
      return login(user);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (user: {
      firstname: string;
      lastname: string;
      email: string;
      plainPassword: string;
    }) => {
      return register(user);
    },
  });

  const signIn = async (email: string, password: string) => {
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      setToken(result.token); // FIXME: type
      localStorage.setItem("token", token);
      // TODO: set user
    } catch (error: any) {
      throw new Error(error);
    }
  };

  const signUp = async (user: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
  }) => {
    try {
      await registerMutation.mutateAsync({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        plainPassword: user.password,
      });
      toast({
        title: "Account created",
        description: "You can now login",
      });
    } catch (error: any) {
      toast({
        title: "An error occured",
        description: await error.response.text(),
        variant: "destructive",
      });
    }
  };

  const signOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
  };

  return {
    user,
    signIn,
    signUp,
    signOut,
    isLoadingLogin: loginMutation.isLoading,
    isLoadingRegister: registerMutation.isLoading,
  };
};
