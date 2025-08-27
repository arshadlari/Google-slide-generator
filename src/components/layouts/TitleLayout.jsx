import React from "react";

const TitleLayout = ({ slide, onUpdateInput }) => {
  const title = slide?.inputs?.title || "";

  const handleTitleChange = (e) => {
    onUpdateInput("title", e.target.value);
  };

  return (
    <div className="title-layout">
      <style jsx>{`
        .title-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
        }

        .title-layout .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .title-layout .field-label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .title-layout .title-input {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .title-layout .title-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .title-layout .preview-section {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          background: #f9fafb;
        }

        .title-layout .preview-title {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .title-layout .preview-slide {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          padding: 40px 20px;
          text-align: center;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .title-layout .preview-main-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          margin: 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          word-wrap: break-word;
          max-width: 100%;
        }

        .title-layout .preview-main-title:empty:before {
          content: "Your title will appear here";
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
          font-weight: 400;
        }

        @media (max-width: 768px) {
          .title-layout .preview-main-title {
            font-size: 2rem;
          }
        }
      `}</style>

      {/* Input Fields */}
      <div className="field-group">
        <label className="field-label">Title</label>
        <input
          type="text"
          className="title-input"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter slide title..."
        />
      </div>
    </div>
  );
};

export default TitleLayout;
