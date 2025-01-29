import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoginUserDetails } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["loggedInUser"],
    queryFn: getLoginUserDetails,
    retry: false,
    refetchOnWindowFocus: false,
  });

  const user = data?.data || null;

  return (
    <AuthContext.Provider value={{ user, isLoading, isError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
