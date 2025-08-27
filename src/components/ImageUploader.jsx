import { useState, useRef, useEffect } from "react";

export default function ImageUploader({ onImageChange, imageUrl, imgStyle }) {
  const [imageSrc, setImageSrc] = useState(imageUrl);
  const [urlInput, setUrlInput] = useState(imageUrl);

  // Sync internal state with prop changes (for initial load or parent updates)
  useEffect(() => {
    setImageSrc(imageUrl);
    if (!imageUrl) {
      setUrlInput(""); // Clear input when no image
    }
  }, [imageUrl]);

  console.log("style", imgStyle);

  const handleUrlLoad = () => {
    if (urlInput.trim()) {
      const newImageUrl = urlInput.trim();
      setImageSrc(newImageUrl);
      onImageChange(newImageUrl); // Notify parent when Load Image is clicked
      setUrlInput("");
    }
  };

  const handleDelete = () => {
    setImageSrc(null);
    onImageChange(null); // Notify parent when Delete is clicked
  };

  return (
    // <div style={styles.container}>
    <div
      style={{
        position: "absolute",
        width: imgStyle?.width,
        height: imgStyle?.height,
        border: "1px solid rgb(218, 220, 224)",
        left: imgStyle?.left,
        top: imgStyle?.top,
      }}
    >
      {!imageSrc ? (
        <div style={{ display: imageSrc ? "none" : "block" }}>
          {/* URL Input */}
          <div style={{ ...styles.urlBox }}>
            <input
              type="text"
              placeholder="Enter image URL"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                // Don't call onImageChange here - only when Load Image is clicked
              }}
              style={styles.urlInput}
            />
            <button style={styles.loadButton} onClick={handleUrlLoad}>
              Load Image
            </button>
          </div>
        </div>
      ) : (
        <>
          <div
            style={{
              ...styles.preview,

              // top: imgStyle?.top,
              // left: imgStyle?.left,
            }}
          >
            <img
              src={imageSrc}
              alt="Uploaded"
              style={{
                width: imgStyle.width,
                height: imgStyle.height,
                objectFit: "cover",
              }}
            />
            <button onClick={handleDelete} style={styles.deleteBtn}>
              X
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    border: "1px solid #dadce0",
    padding: "10px",
  },
  urlBox: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    padding: "5px",
  },
  urlInput: { flex: 1, padding: "5px", width: "100%" },
  loadButton: {
    background: "#007bff",
    color: "#fff",
    border: "1px solid #5f54fa",
    padding: "6px 12px",
    cursor: "pointer",
  },
  preview: {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",
    border: "none",
  },

  deleteBtn: {
    position: "absolute",
    top: "5px",
    right: "5px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    padding: "3px 6px",
    fontSize: "12px",
    cursor: "pointer",
    opacity: 0.8,
  },
};
