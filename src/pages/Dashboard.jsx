import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth?profile=true")
      .then(res => res.json())
      .then(data => {
        if (data?.email) setUser(data);
        else window.location.href = "/login";
      });
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>
      {user ? (
        <>
          <p>Welcome, {user.name}</p>
          <img src={user.picture} alt="profile" width="80" />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
