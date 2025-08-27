import React from "react";
import "./MethodologySlide.css";

const MethodologySlide = ({ slide, onUpdateInput }) => {
  return (
    <div className="methodology-slide">
      {/* Left Section */}
      <div className="left-panel">
        <input
          type="text"
          className="methodology-title-input"
          value={slide?.inputs?.LEFT_TITLE}
          placeholder="Our methodology"
          onChange={(e) => onUpdateInput("LEFT_TITLE", e.target.value)}
        />
        <textarea
          className="desc-input"
          value={slide?.inputs?.LEFT_DESC}
          placeholder="Enter your description here"
          onChange={(e) => onUpdateInput("LEFT_DESC", e.target.value)}
        />
      </div>

      {/* Right Section */}
      <div className="right-panel">
        {/* Group 1 */}
        <input
          type="text"
          placeholder="Develop the strategy"
          className="phase-subtitle-input"
          value={slide?.inputs?.RIGHT_GROUP1_TITLE}
          onChange={(e) => onUpdateInput("RIGHT_GROUP1_TITLE", e.target.value)}
        />

        <div className="phase-row">
          <input
            type="text"
            placeholder="Discover"
            className="phase-title-input"
            value={slide?.inputs?.RIGHT_GROUP1_SUBTITLE1}
            onChange={(e) =>
              onUpdateInput("RIGHT_GROUP1_SUBTITLE1", e.target.value)
            }
          />
          <div className="line"></div>
          <textarea
            placeholder="Discover phase details..."
            className="phase-text-input"
            value={slide?.inputs?.RIGHT_GROUP1_DESC1}
            onChange={(e) =>
              onUpdateInput("RIGHT_GROUP1_DESC1", e.target.value)
            }
          />
        </div>

        <div className="phase-row">
          <input
            type="text"
            placeholder="Define"
            className="phase-title-input"
            value={slide?.inputs?.RIGHT_GROUP1_SUBTITLE2}
            onChange={(e) =>
              onUpdateInput("RIGHT_GROUP1_SUBTITLE2", e.target.value)
            }
          />
          <div className="line"></div>
          <textarea
            placeholder="Define phase details..."
            className="phase-text-input"
            value={slide?.inputs?.RIGHT_GROUP1_DESC2}
            onChange={(e) =>
              onUpdateInput("RIGHT_GROUP1_DESC2", e.target.value)
            }
          />
        </div>

        {/* Group 2 */}
        <input
          type="text"
          placeholder="Execute the vision"
          className="phase-subtitle-input"
          value={slide?.inputs?.RIGHT_GROUP2_TITLE}
          onChange={(e) => onUpdateInput("RIGHT_GROUP2_TITLE", e.target.value)}
        />

        <div className="phase-row">
          <input
            type="text"
            placeholder="Design"
            className="phase-title-input"
            value={slide?.inputs?.RIGHT_GROUP2_SUBTITLE1}
            onChange={(e) =>
              onUpdateInput("RIGHT_GROUP2_SUBTITLE1", e.target.value)
            }
          />
          <div className="line"></div>
          <textarea
            placeholder="Design phase details..."
            className="phase-text-input"
            value={slide?.inputs?.RIGHT_GROUP2_DESC1}
            onChange={(e) =>
              onUpdateInput("RIGHT_GROUP2_DESC1", e.target.value)
            }
          />
        </div>

        <div className="phase-row">
          <input
            type="text"
            placeholder="Deploy"
            className="phase-title-input"
            value={slide?.inputs?.RIGHT_GROUP2_SUBTITLE2}
            onChange={(e) =>
              onUpdateInput("RIGHT_GROUP2_SUBTITLE2", e.target.value)
            }
          />
          <div className="line"></div>
          <textarea
            placeholder="Deploy phase details..."
            className="phase-text-input"
            value={slide?.inputs?.RIGHT_GROUP2_DESC2}
            onChange={(e) =>
              onUpdateInput("RIGHT_GROUP2_DESC2", e.target.value)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MethodologySlide;
