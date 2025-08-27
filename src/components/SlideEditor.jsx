import React, { useEffect, useRef } from "react";
import { themeManager } from "../design-system/ThemeManager.js";
import { layoutRegister, data } from "./layoutRegister.js";
import LayoutRenderer from "./LayoutRenderer.jsx";
import FieldRenderer from "./FieldRenderer.jsx";

const SlideEditor = ({
  slide,
  onUpdateContentModel,
  onUpdateInput,
  onSlideThemeSelect,
  currentSlideTheme,
  onUpdateLayout,
}) => {
  const slidePreviewRef = useRef(null);
  const editorContainerRef = useRef(null);

  // Apply theme to content inputs when slide changes or theme changes
  useEffect(() => {
    if (slide && editorContainerRef.current) {
      // Apply theme only to the content editor section
      const contentEditor =
        editorContainerRef.current.querySelector(".content-editor");
      if (contentEditor) {
        contentEditor.setAttribute("data-slide-id", slide.slideId);
        themeManager.applyThemeToSlideElement(contentEditor, slide.slideId);
      }
    }
  }, [slide, currentSlideTheme]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      if (
        slide &&
        editorContainerRef.current &&
        (event.detail.type === "presentation" ||
          (event.detail.type === "slide" &&
            event.detail.slideId === slide.slideId))
      ) {
        // Apply theme only to the content editor section
        const contentEditor =
          editorContainerRef.current.querySelector(".content-editor");
        if (contentEditor) {
          contentEditor.setAttribute("data-slide-id", slide.slideId);
          themeManager.applyThemeToSlideElement(contentEditor, slide.slideId);
        }
      }
    };

    document.addEventListener("themeChanged", handleThemeChange);
    return () =>
      document.removeEventListener("themeChanged", handleThemeChange);
  }, [slide]);

  if (!slide) {
    return (
      <div className="slide-editor-empty">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No Slide Selected</h3>
          <p>Select a slide from the left panel to start editing</p>
        </div>
      </div>
    );
  }

  return (
    <div className="slide-editor" ref={editorContainerRef}>
      <div className="editor-header">
        <div className="slide-actions">
          <h2>Slide Content</h2>
          {onSlideThemeSelect && (
            <button
              className="slide-theme-btn"
              onClick={onSlideThemeSelect}
              title={`Current theme: ${currentSlideTheme?.name || "Inherited"}`}
            >
              🎨 Theme
            </button>
          )}
        </div>
      </div>

      <div className="layout-selector">
        <label className="section-label">content Model</label>
        <div className="layout-dropdown-wrapper">
          <select
            className="layout-dropdown"
            value={slide.contentModel}
            onChange={(e) => onUpdateContentModel(e.target.value)}
          >
            <option value="">Select a content model...</option>
            {layoutRegister.map((option) => (
              <option key={option.key} value={option.key}>
                {option.name}
              </option>
            ))}
            {data.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {slide.contentModel && (
        <div className="content-editor">
          <label className="section-label">Content</label>
          <div className="layout-content">
            {layoutRegister
              .find((item) => item.key === slide.contentModel)
              ?.component({
                slide: slide,
                onUpdateInput: onUpdateInput,
                currentSlideTheme: currentSlideTheme,
              })}

            {data.find((item) => item.id === slide.contentModel) && (
              <FieldRenderer
                contentModelInfo={
                  data.find((item) => item.id === slide.contentModel) || []
                }
                slide={slide}
                onUpdateLayout={onUpdateLayout}
                onUpdateInput={onUpdateInput}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideEditor;
