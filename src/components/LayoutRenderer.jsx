import React from "react";
import ImageUploader from "./ImageUploader";

const emuToPx = (emu) => emu / 9525;
const ptToPx = (pt) => pt * (96 / 72);

export default function LayoutRenderer({ instructions, slide, onUpdateInput }) {
  console.log("instructions", instructions);
  const elements = {};

  instructions.elements.forEach((item) => {
    const { id, type, slideId, position, fill, textStyle } = item;
    const { x, y, width, height, scaleX, scaleY } = position;

    elements[id] = {
      type: type ?? item.elementType,
      style: {
        position: "absolute",
        width: `${emuToPx(width * scaleX)}px`,
        height:
          type === "LINE" || item.elementType === "LINE"
            ? `${emuToPx(item.weight)}px`
            : `${emuToPx(height * scaleY)}px`,
        left: `${emuToPx(x)}px`,
        top: `${emuToPx(y)}px`,
        resize: "auto",
        overflow: "auto",
        fieldSizing: "content",
        textAlign: textStyle?.paragraphStyle?.alignment || "left",
        background:
          type === "LINE" || item.elementType === "LINE"
            ? item.lineFill?.color || "transparent"
            : fill?.color || "transparent",
        border: "none",
        outline: "none",
        color: textStyle?.color || "#000",
        fontSize: `${ptToPx(textStyle?.fontSize)}px`,
        fontFamily:
          textStyle?.fontFamily || "Sorts Mill Goudy, Open Sans, sans-serif",
        backgroundImage: `url(${item.imageUrl})`,
      },
      text: textStyle?.text || "",
    };
  });
  const pageProperties = instructions.pageProperties;

  console.log("elements", elements);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: pageProperties?.backgroundColor || "transparent",
      }}
    >
      {Object.entries(elements).map(([id, el]) => {
        {
          if (el.type === "TEXT_BOX") {
            return (
              <textarea
                key={id}
                className={id}
                style={el.style}
                placeholder={el.text}
                value={slide.inputs[id]}
                onChange={(e) => {
                  onUpdateInput(id, e.target.value);
                }}
              />
            );
          }
          if (el.type === "IMAGE") {
            return (
              <ImageUploader
                key={id}
                imgStyle={el.style}
                onImageChange={(imageUrl) => {
                  onUpdateInput(id, imageUrl);
                }}
                imageUrl={slide.inputs[id]}
              />
            );
          }

          return <div style={el.style}></div>;
        }
      })}
    </div>
  );
}
