import { Navigate, useOutlet } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { checkAuth } from "../../api/auth";

export const ProtectedRoute = () => {
  const outlet = useOutlet();

  const { isAuth, signin, signout } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const query = async () => {
      try {
        setIsLoading(true);

        await checkAuth();
        signin();
      } catch (error) {
        signout();
      } finally {
        setIsLoading(false);
      }
    };

    query();
  }, []);

  if (isLoading) {
    return "Loader...";
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return outlet;
};
