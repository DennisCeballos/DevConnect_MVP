import React, { createContext, useContext, useState, useEffect } from "react";
import { User, LoginCredentials, RegisterData } from "@/types";
import { api } from "@/services/api";
import { socketService } from "@/services/socket";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await api.getMe();
          setUser(userData);
          socketService.connect(token);
        } catch (error) {
          localStorage.removeItem("token");
          console.error("Auth init error:", error);
        }
      }
      setIsLoading(false);
    };

    initAuth();

    return () => {
      socketService.disconnect();
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { token, user: userData } = await api.login(credentials);
      localStorage.setItem("token", token);
      setUser(userData);
      socketService.connect(token);
      toast({
        title: "¡Bienvenido!",
        description: `Hola ${userData.name}`,
      });
    } catch (error) {
      toast({
        title: "Error al iniciar sesión",
        description: error instanceof Error ? error.message : "Credenciales inválidas",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const { token, user: userData } = await api.register(data);
      localStorage.setItem("token", token);
      setUser(userData);
      socketService.connect(token);
      toast({
        title: "¡Cuenta creada!",
        description: "Bienvenido a DevConnect",
      });
    } catch (error) {
      toast({
        title: "Error al registrar",
        description: error instanceof Error ? error.message : "No se pudo crear la cuenta",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    socketService.disconnect();
    toast({
      title: "Sesión cerrada",
      description: "Hasta pronto",
    });
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const updatedUser = await api.updateMe(data);
      setUser(updatedUser);
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios se guardaron correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: error instanceof Error ? error.message : "No se pudo actualizar el perfil",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
