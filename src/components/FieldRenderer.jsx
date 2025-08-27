import React from "react";
import "./FieldRenderer.css";

const FieldRenderer = ({
  contentModelInfo,
  slide,
  onUpdateInput,
  onUpdateLayout,
}) => {
  if (!contentModelInfo || !Array.isArray(contentModelInfo.fields)) {
    console.warn("FieldRenderer: No valid fields found");
    return <div>No fields found</div>;
  }

  return (
    <>
      <div className="mapped-layouts">
        <label className="section-label">Mapped Layouts</label>
        <select
          className="layout-dropdown"
          value={slide.layout}
          onChange={(e) => onUpdateLayout(e.target.value)}
        >
          <option value="">Select a mapped layout...</option>
          {contentModelInfo.mapped_layouts.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div className="field-renderer">
        {contentModelInfo.fields.map((field) => {
          const { name, type, label, placeholder } = field;
          const value = slide.inputs[name] || "";

          const handleChange = (e) => {
            onUpdateInput(name, e.target.value);
          };

          switch (type) {
            case "text":
              return (
                <div key={name} className="field-group">
                  <label className="field-label">{label}</label>
                  <textarea
                    className="field-textarea"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              );

            default:
              return (
                <div key={name} className="field-group">
                  <label className="field-label">{label}</label>
                  <input
                    type="text"
                    className="field-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                  />
                </div>
              );
          }
        })}
      </div>
    </>
  );
};

export default FieldRenderer;
