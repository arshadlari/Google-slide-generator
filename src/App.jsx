import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    fetch("/api/auth?profile=true")
      .then((res) => res.json())
      .then((data) => {
        if (data?.email) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      })
      .catch(() => {
        navigate("/login");
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, [navigate]);

  if (isChecking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return null;
}
