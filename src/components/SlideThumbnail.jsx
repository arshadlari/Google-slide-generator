import React, { useEffect, useRef } from "react";
import { themeManager } from "../design-system/ThemeManager.js";
import { layoutRegister, data } from "./layoutRegister.js";
import LayoutRenderer from "./LayoutRenderer.jsx";
import FieldRenderer from "./FieldRenderer.jsx";

const SlideThumbnail = ({ slide, index, isActive, onClick, onDelete }) => {
  const thumbnailRef = useRef(null);
  const getSlidePreview = () => {
    if (!slide.layout) {
      return (
        <div className="slide-preview-empty">
          <div className="slide-number">{index + 1}</div>
          <div className="slide-placeholder">Select Layout</div>
        </div>
      );
    }

    // Dummy onUpdateInput function for thumbnail (non-interactive)
    const dummyOnUpdateInput = () => {};

    return (
      <div className="slide-preview-content thumbnail-content">
        <div className="slide-number">{index + 1}</div>
        <div
          className="thumbnail-layout-content"
          style={{
            width: "960px",
            height: "540px",
            overflow: "hidden",

            transform: "scale(0.2)",
            transformOrigin: "top left",
            pointerEvents: "none",
            // border: "2px solid white",
            // boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
            borderRadius: "20px",
            position: "absolute",
          }}
        >
          {/* Render static layouts from layoutRegister */}
          {layoutRegister
            .find((layout) => layout.key === slide.layout)
            ?.component({
              slide: slide,
              onUpdateInput: dummyOnUpdateInput,
              currentSlideTheme: null,
            })}

          {/* Render field-based layouts using FieldRenderer */}
          {data.find((item) => item.id === slide.contentModel) && (
            <FieldRenderer
              contentModelInfo={
                data.find((item) => item.id === slide.contentModel) || []
              }
              slide={slide}
              onUpdateLayout={() => {}}
              onUpdateInput={dummyOnUpdateInput}
            />
          )}
        </div>
      </div>
    );
  };

  // Apply theme when slide changes or theme changes
  useEffect(() => {
    if (slide && thumbnailRef.current) {
      thumbnailRef.current.setAttribute("data-slide-id", slide.slideId);
      themeManager.applyThemeToSlideElement(
        thumbnailRef.current,
        slide.slideId
      );
    }
  }, [slide]);

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = (event) => {
      if (
        slide &&
        thumbnailRef.current &&
        (event.detail.type === "presentation" ||
          (event.detail.type === "slide" &&
            event.detail.slideId === slide.slideId))
      ) {
        themeManager.applyThemeToSlideElement(
          thumbnailRef.current,
          slide.slideId
        );
      }
    };

    document.addEventListener("themeChanged", handleThemeChange);
    return () =>
      document.removeEventListener("themeChanged", handleThemeChange);
  }, [slide]);

  return (
    <div
      ref={thumbnailRef}
      className={`slide-thumbnail ${isActive ? "active" : ""}`}
      onClick={() => onClick(index)}
      data-slide-id={slide.slideId}
    >
      {getSlidePreview()}
      <button
        className="delete-slide-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
      >
        ×
      </button>
    </div>
  );
};

export default SlideThumbnail;
