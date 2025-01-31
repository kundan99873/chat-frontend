import { useQuery } from "@tanstack/react-query";
import { authenticateUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ProtectedRoute({ children, allowedRole }) {
  const [refreshToken, setRefreshToken] = useState(false);

  const navigate = useNavigate();
  const { data: refrshToken, isFetching } = useQuery({
    queryKey: "authenticate",
    queryFn: authenticateUser,
    retry: false,
  });

  console.log(refreshToken);
  const { data, isLoading } = useQuery({
    queryKey: ["authenticate"],
    queryFn: authenticateUser,
    retry: false,
    // enabled: !!refreshToken,
  });

  if (isLoading) return <p>Loading...</p>;
  if (!data) navigate("/login");

  if (allowedRole === "admin" && !data.isAdmin) navigate(-1);
  return <>{children}</>;
}
