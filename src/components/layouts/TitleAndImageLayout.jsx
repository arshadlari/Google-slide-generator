import React from "react";
import ImageUploader from "../ImageUploader";

const TitleAndImageLayout = ({ slide, onUpdateInput, currentSlideTheme }) => {
  const title = slide?.inputs?.TITLE || "";
  const imageUrl = slide?.inputs?.IMAGE || "";

  const handleTitleChange = (e) => {
    onUpdateInput("TITLE", e.target.value);
  };

  const handleImageUrlChange = (e) => {
    console.log("Image URL change triggered", e);
    onUpdateInput("IMAGE", e);
  };

  return (
    <div className="title-image-layout">
      <style jsx>{`
        .title-image-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
          width: 100%;
          height: 100%;
          background-color: ${currentSlideTheme?.colors?.background?.primary};
          color: ${currentSlideTheme?.colors?.text?.primary};
        }

        .title-image-layout .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .title-image-layout .field-label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .title-image-layout .title-input {
          padding: 5px;
          //   border: 1px solid #e5e7eb;
          font-size: 16px;
          background: none;
          transition: border-color 0.2s;
          text-align: left;
        }

        .title-image-layout .image-input {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
          cursor: pointer;
        }

        .title-image-layout .title-input:focus,
        .title-image-layout .image-input:focus {
          outline: none;
          border: 1px solid #e5e7eb;
          border-color: #3b82f6;
        }

        .title-image-layout .preview-section {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          background: #f9fafb;
        }

        .title-image-layout .preview-title {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .title-image-layout .preview-slide {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 30px;
          min-height: 200px;
        }

        .title-image-layout .preview-main-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 20px 0;
          border-bottom: 3px solid #10b981;
          padding-bottom: 10px;
        }

        .title-image-layout .preview-main-title:empty:before {
          content: "Your title will appear here";
          color: #9ca3af;
          font-style: italic;
          font-weight: 400;
        }

        .title-image-layout .preview-content {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .title-image-layout .preview-image-container {
          flex: 1;
          min-width: 200px;
          text-align: center;
        }

        .title-image-layout .preview-image {
          max-width: 100%;
          max-height: 200px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .title-image-layout .preview-image-placeholder {
          width: 100%;
          height: 150px;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          font-style: italic;
          background: #f9fafb;
        }

        @media (max-width: 768px) {
          .title-image-layout .preview-main-title {
            font-size: 1.5rem;
          }

          .title-image-layout .preview-content {
            flex-direction: column;
          }
        }
      `}</style>

      {/* Input Fields */}
      <div className="field-group">
        {/* <label className="field-label">Title</label> */}
        <input
          type="text"
          className="title-input"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter slide title..."
        />
      </div>

      {/* <div className="field-group">
        <label className="field-label">Image URL</label>
        <input
          type="text"
          className="image-url-input"
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="Enter image URL..."
        />
      </div> */}
      {/* TODO: Add image uploader */}
      <ImageUploader onImageChange={handleImageUrlChange} imageUrl={imageUrl} />

      {/* Preview */}
      {/* <div className="preview-section">
        <div className="preview-title">Preview</div>
        <div className="preview-slide">
          <h1 className="preview-main-title">{title}</h1>
          <div className="preview-content">
            <div className="preview-image-container">
              {image ? (
                <img src={image} alt="Slide" className="preview-image" />
              ) : (
                <div className="preview-image-placeholder">
                  🖼️ Your image will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

// Static method to get field configuration
TitleAndImageLayout.getFields = () => [
  { key: "TITLE", type: "text", label: "Title" },
  { key: "IMAGE", type: "text", label: "Image URL" },
];

export default TitleAndImageLayout;
