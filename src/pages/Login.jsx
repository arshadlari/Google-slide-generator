export default function Login() {
  const handleSignIn = () => {
    window.location.href = "/api/auth";
  };

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
      <h1>Welcome</h1>
      <p>Please sign in to continue</p>
      <button
        onClick={handleSignIn}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          backgroundColor: "#4285f4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
