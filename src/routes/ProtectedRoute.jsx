import { useQuery } from "@tanstack/react-query";
import { authenticateUser } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["authenticate"],
    queryFn: authenticateUser,
    retry: false,
  });
  if (isLoading) return <p>Loading...</p>;
  if (!data) navigate("/login");

  if (allowedRole === "admin" && !data.isAdmin) navigate(-1);
  return <>{children}</>;
}
