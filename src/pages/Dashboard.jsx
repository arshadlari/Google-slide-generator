import { useState, useEffect } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          window.location.href = "/";
        } else {
          setUser(data);
        }
      })
      .catch(() => {
        window.location.href = "/";
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Hello World!</h1>
      {user && (
        <div style={{ textAlign: "center" }}>
          <p>Welcome, {user.name}!</p>
          <img
            src={user.picture}
            alt="Profile"
            style={{ borderRadius: "50%", width: "80px", height: "80px" }}
          />
          <br />
          <button
            onClick={handleLogout}
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              fontSize: "14px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
