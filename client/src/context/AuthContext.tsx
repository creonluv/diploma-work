import React, { createContext, useContext, useState, ReactNode } from "react";

type AuthContextType = {
  isAuth: boolean;
  signin: () => void;
  signout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuth, setIsAuth] = useState(false);

  const signin = () => setIsAuth(true);
  const signout = () => setIsAuth(false);

  return (
    <AuthContext.Provider value={{ isAuth, signin, signout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
};
