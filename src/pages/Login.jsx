export default function Login() {
  const handleLogin = () => {
    window.location.href = "/api/auth"; // Redirects to serverless login handler
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginTop:"100px" }}>
      <h1>Login Page</h1>
      <button 
        onClick={handleLogin} 
        style={{ padding:"10px 20px", fontSize:"16px", cursor:"pointer" }}
      >
        Sign in with Google
      </button>
    </div>
  );
}
