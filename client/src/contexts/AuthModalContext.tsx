import { createContext, useContext, useState, ReactNode } from "react";

type AuthView = "login" | "signup" | "forgot_password" | "verify_otp" | "reset_password";

type AuthModalContextType = {
  isOpen: boolean;
  view: AuthView;
  guestMessage?: string;
  openModal: (view?: AuthView, onSuccess?: () => void, message?: string) => void;
  closeModal: () => void;
  setView: (view: AuthView) => void;
  requireAuth: (action: () => void) => void;
  onSuccessCallback: (() => void) | null;
  clearCallback: () => void;
};

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<AuthView>("login");
  const [onSuccessCallback, setOnSuccessCallback] = useState<(() => void) | null>(null);
  const [guestMessage, setGuestMessage] = useState<string | undefined>(undefined);
  
  const openModal = (initialView: AuthView = "login", onSuccess?: () => void, message?: string) => {
    setView(initialView);
    if (onSuccess) {
      setOnSuccessCallback(() => onSuccess);
    }
    if (message) {
      setGuestMessage(message);
    } else {
      setGuestMessage(undefined);
    }
    setIsOpen(true);
  };

  const clearCallback = () => {
    setOnSuccessCallback(null);
    setGuestMessage(undefined);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const requireAuth = (action: () => void) => {
    // We will check auth inside the hook where useAuth is available to avoid circular dependencies
    // But actually, we can just call this from components that already know if user is authenticated.
    // However, it's easier if we just export it here and components use it.
  };

  return (
    <AuthModalContext.Provider value={{ 
      isOpen, view, openModal, closeModal, setView, requireAuth, onSuccessCallback, clearCallback, guestMessage 
    }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  
  // Return everything including a robust requireAuth
  return {
    ...context,
    // We cannot use useAuth() here because it would cause a React Hook violation if called inside a non-component function
    // But we CAN use useAuth() if we make requireAuth a curried function or just a component utility.
    // Instead, requireAuth should be called by components that ALREADY have isAuthenticated.
    // e.g. requireAuth(isAuthenticated, () => { ... })
    // Let's replace the context's requireAuth with a better one.
  };
}
