import React from "react";

const TwoColumnLayout = ({ slide, onUpdateInput }) => {
  const title = slide?.inputs?.TITLE || "";
  const leftColumn = slide?.inputs?.LEFT_COLUMN || "";
  const rightColumn = slide?.inputs?.RIGHT_COLUMN || "";

  const handleTitleChange = (e) => {
    onUpdateInput("TITLE", e.target.value);
  };

  const handleLeftColumnChange = (e) => {
    onUpdateInput("LEFT_COLUMN", e.target.value);
  };

  const handleRightColumnChange = (e) => {
    onUpdateInput("RIGHT_COLUMN", e.target.value);
  };

  return (
    <div className="two-column-layout">
      <style jsx>{`
        .two-column-layout {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 20px;
        }

        .two-column-layout .field-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .two-column-layout .columns-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .two-column-layout .field-label {
          font-weight: 600;
          color: #374151;
          font-size: 14px;
        }

        .two-column-layout .title-input {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: border-color 0.2s;
        }

        .two-column-layout .column-textarea {
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          min-height: 100px;
          resize: vertical;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .two-column-layout .title-input:focus,
        .two-column-layout .column-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .two-column-layout .preview-section {
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          background: #f9fafb;
        }

        .two-column-layout .preview-title {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .two-column-layout .preview-slide {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 30px;
          min-height: 200px;
        }

        .two-column-layout .preview-main-title {
          font-size: 1.8rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 20px 0;
          border-bottom: 3px solid #f59e0b;
          padding-bottom: 10px;
        }

        .two-column-layout .preview-main-title:empty:before {
          content: "Your title will appear here";
          color: #9ca3af;
          font-style: italic;
          font-weight: 400;
        }

        .two-column-layout .preview-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .two-column-layout .preview-column {
          font-size: 1rem;
          line-height: 1.6;
          color: #4b5563;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .two-column-layout .preview-column.left:empty:before {
          content: "Left column content will appear here";
          color: #9ca3af;
          font-style: italic;
        }

        .two-column-layout .preview-column.right:empty:before {
          content: "Right column content will appear here";
          color: #9ca3af;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .two-column-layout .columns-row {
            grid-template-columns: 1fr;
          }

          .two-column-layout .preview-main-title {
            font-size: 1.5rem;
          }

          .two-column-layout .preview-columns {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .two-column-layout .preview-column {
            font-size: 0.9rem;
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

      <div className="columns-row">
        <div className="field-group">
          <label className="field-label">Left Column</label>
          <textarea
            className="column-textarea"
            value={leftColumn}
            onChange={handleLeftColumnChange}
            placeholder="Enter left column content..."
          />
        </div>

        <div className="field-group">
          <label className="field-label">Right Column</label>
          <textarea
            className="column-textarea"
            value={rightColumn}
            onChange={handleRightColumnChange}
            placeholder="Enter right column content..."
          />
        </div>
      </div>

      {/* Preview */}
      {/* <div className="preview-section">
        <div className="preview-title">Preview</div>
        <div className="preview-slide">
          <h1 className="preview-main-title">{title}</h1>
          <div className="preview-columns">
            <div className="preview-column left">{leftColumn}</div>
            <div className="preview-column right">{rightColumn}</div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TwoColumnLayout;
