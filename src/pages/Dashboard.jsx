import { useEffect, useState } from "react";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [presentations, setPresentations] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPresentationTitle, setNewPresentationTitle] = useState("");

  useEffect(() => {
    fetch("/api/auth?profile=true")
      .then((res) => res.json())
      .then((data) => {
        if (data?.email) setUser(data);
        else window.location.href = "/login";
      });
  }, []);

  const handleCreatePresentation = async () => {
    if (!newPresentationTitle.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newPresentationTitle }),
      });

      const data = await response.json();
      if (data.presentationId) {
        setPresentations((prev) => [...prev, data]);
        setNewPresentationTitle("");
        // Optionally open the new presentation
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error creating presentation:", error);
      alert("Failed to create presentation");
    } finally {
      setIsCreating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/login";
    }
  };

  if (!user) {
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

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
          borderBottom: "1px solid #e0e0e0",
          paddingBottom: "20px",
        }}
      >
        <h1>Google Slides Generator</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <img
            src={user.picture}
            alt="profile"
            width="40"
            height="40"
            style={{ borderRadius: "50%" }}
          />
          <span>Welcome, {user.name}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Create New Presentation */}
      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h2>Create New Presentation</h2>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            value={newPresentationTitle}
            onChange={(e) => setNewPresentationTitle(e.target.value)}
            placeholder="Enter presentation title..."
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "14px",
            }}
            onKeyPress={(e) => e.key === "Enter" && handleCreatePresentation()}
          />
          <button
            onClick={handleCreatePresentation}
            disabled={isCreating || !newPresentationTitle.trim()}
            style={{
              padding: "10px 20px",
              backgroundColor: isCreating ? "#ccc" : "#4285f4",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: isCreating ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            {isCreating ? "Creating..." : "Create Presentation"}
          </button>
        </div>
      </div>

      {/* Recent Presentations */}
      <div>
        <h2>Recent Presentations</h2>
        {presentations.length === 0 ? (
          <p style={{ color: "#666", fontStyle: "italic" }}>
            No presentations created yet. Create your first presentation above!
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "20px",
            }}
          >
            {presentations.map((presentation) => (
              <div
                key={presentation.presentationId}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h3 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                  {presentation.title}
                </h3>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: "12px",
                    color: "#666",
                  }}
                >
                  ID: {presentation.presentationId}
                </p>
                <a
                  href={presentation.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-block",
                    padding: "8px 16px",
                    backgroundColor: "#4285f4",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  Open in Google Slides
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
