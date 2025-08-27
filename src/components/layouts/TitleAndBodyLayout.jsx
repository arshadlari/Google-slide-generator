import React from "react";

const TitleAndBodyLayout = ({ slide, onUpdateInput, currentSlideTheme }) => {
  console.log("currentSlideTheme", currentSlideTheme);
  const title = slide?.inputs?.TITLE || "";
  const body = slide?.inputs?.BODY || "";

  const handleTitleChange = (e) => {
    onUpdateInput("TITLE", e.target.value);
  };

  const handleBodyChange = (e) => {
    onUpdateInput("BODY", e.target.value);
  };

  return (
    <div className="title-body-layout">
      <style jsx>{`
        .title-body-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
            padding: 20px;
          background-color: ${currentSlideTheme?.colors?.background?.primary};
          color: ${currentSlideTheme?.colors?.text?.primary};
        }

        .title-body-layout .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .title-body-layout .field-label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .title-body-layout .title-input {
          padding: 12px;
          border: 1px solid #e5e7eb;
          font-size: 16px;
          transition: border-color 0.2s;
          background: none;
          text-align: left;
          color: ${currentSlideTheme?.colors?.text?.primary};
        }

        .title-body-layout .body-textarea {
          padding: 12px;
          border: 1px solid #e5e7eb;
          background: none;
          text-align: left;
          font-size: 14px;
          min-height: 120px;
          resize: vertical;
          font-family: inherit;
          transition: border-color 0.2s;
          color: ${currentSlideTheme?.colors?.text?.primary};
        }

        .title-body-layout .title-input:focus,
        .title-body-layout .body-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .title-body-layout .preview-section {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          background: #f9fafb;
        }

        .title-body-layout .preview-title {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .title-body-layout .preview-slide {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 30px;
          min-height: 200px;
        }

        .title-body-layout .preview-main-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 20px 0;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 10px;
        }

        .title-body-layout .preview-main-title:empty:before {
          content: "Your title will appear here";
          color: #9ca3af;
          font-style: italic;
          font-weight: 400;
        }

        .title-body-layout .preview-body-content {
          font-size: 1rem;
          line-height: 1.6;
          color: #4b5563;
          margin: 0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .title-body-layout .preview-body-content:empty:before {
          content: "Your content will appear here";
          color: #9ca3af;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .title-body-layout .preview-main-title {
            font-size: 1.5rem;
          }

          .title-body-layout .preview-body-content {
            font-size: 0.9rem;
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
          placeholder="Title..."
        />
      </div>

      <div className="field-group">
        {/* <label className="field-label">Content</label> */}
        <textarea
          className="body-textarea"
          value={body}
          onChange={handleBodyChange}
          placeholder="Body Text..."
        />
      </div>
    </div>
  );
};

export default TitleAndBodyLayout;
