import React, { useState, useEffect, useRef } from "react";
import { layoutRegister, data } from "./layoutRegister.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOut,
  faUser,
  faXmark,
  faGear,
  faFile,
  faCaretDown,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

const Toolbar = ({
  onAddSlide,
  onAddSlideWithContentModel,
  onCreatePresentation,
  presentationUrl,
  isCreating,
  onBack,
  onLogout,
  userInfo,
  presentationTitle,
  onTitleChange,
  isEditable = false,
  onPresentationThemeSelect,
  currentTheme,
}) => {
  const [showContentModelDropdown, setShowContentModelDropdown] =
    useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowContentModelDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleContentModelSelect = (contentModel) => {
    onAddSlideWithContentModel(contentModel);
    setShowContentModelDropdown(false);
  };
  const [isOpen, setIsOpen] = useState(false);
  const username = userInfo?.name || "Guest";

  const initials = username
    ? username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : null;

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        {onBack && (
          <button
            className="toolbar-btn secondary"
            onClick={onBack}
            title="Back to presentations"
          >
            <span className="btn-icon">←</span>
            <span className="btn-text">Back</span>
          </button>
        )}
        <div className="add-slide-container" ref={dropdownRef}>
          <button
            className="toolbar-btn primary"
            onClick={onAddSlide}
            title="Add new slide"
          >
            <span className="btn-icon">+</span>
            <span className="btn-text">Add Slide</span>
          </button>
          <button
            className="toolbar-btn primary dropdown-toggle"
            onClick={() =>
              setShowContentModelDropdown(!showContentModelDropdown)
            }
            title="Add slide with specific content model"
          >
            <span className="btn-icon">
              {showContentModelDropdown ? (
                <FontAwesomeIcon icon={faChevronUp} />
              ) : (
                <FontAwesomeIcon icon={faChevronDown} />
              )}
            </span>
          </button>

          {showContentModelDropdown && (
            <div className="layout-dropdown-mini">
              <div className="dropdown-header">Choose Content Model</div>
              {layoutRegister.map((item) => {
                return (
                  <button
                    key={item.key}
                    className="dropdown-item"
                    onClick={() => handleContentModelSelect(item.key)}
                  >
                    <span className="layout-name">{item.name}</span>
                  </button>
                );
              })}
              {data.map((item) => {
                return (
                  <button
                    key={item.id}
                    className="dropdown-item"
                    onClick={() => handleContentModelSelect(item.id)}
                  >
                    <span className="layout-name">{item.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {onPresentationThemeSelect && (
          <button
            className="toolbar-btn theme"
            onClick={onPresentationThemeSelect}
            title={`Current theme: ${currentTheme?.name || "Default"}`}
          >
            <span className="btn-icon">🎨</span>
            <span className="btn-text">Theme</span>
          </button>
        )}
      </div>

      <div className="toolbar-center">
        {isEditable ? (
          <EditableTitle
            title={presentationTitle || "Untitled presentation"}
            onTitleChange={onTitleChange}
          />
        ) : (
          <div className="presentation-title">
            <h1>{presentationTitle || "Google Slides Generator"}</h1>
          </div>
        )}
      </div>

      <div className="toolbar-right">
        {presentationUrl && (
          <a
            href={presentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="toolbar-btn secondary"
          >
            <span className="btn-icon">🔗</span>
            <span className="btn-text">Open Presentation</span>
          </a>
        )}
        {onCreatePresentation && (
          <button
            className={`toolbar-btn primary ${isCreating ? "loading" : ""}`}
            onClick={onCreatePresentation}
            disabled={isCreating}
          >
            {isCreating ? (
              <>
                <span className="btn-icon spinning">
                  <FontAwesomeIcon icon={faGear} />
                </span>
                <span className="btn-text">Creating...</span>
              </>
            ) : (
              <>
                <span className="btn-icon">
                  <FontAwesomeIcon icon={faFile} />
                </span>
                <span className="btn-text">Generate Slides</span>
              </>
            )}
          </button>
        )}

        {onLogout && userInfo && (
          <>
            <div className="navbar-user">
              <div
                className="user-avatar"
                onClick={() => setIsOpen((prev) => !prev)}
                title={`Logged in as ${userInfo.name}`}
              >
                {username ? (
                  <span className="user-initials">{initials}</span>
                ) : (
                  <FontAwesomeIcon icon={faUser} />
                )}
              </div>

              {isOpen && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-close-btn"
                    onClick={() => setIsOpen(false)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                  <div className="dropdown-username">
                    {username && (
                      <>
                        <FontAwesomeIcon icon={faUser} />
                        {username}
                      </>
                    )}
                  </div>

                  <button className="dropdown-item" onClick={onLogout}>
                    <FontAwesomeIcon icon={faSignOut} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Editable Title Component with debouncing
const EditableTitle = ({ title, onTitleChange }) => {
  const [localTitle, setLocalTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);

    // Clear existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce timer
    debounceRef.current = setTimeout(() => {
      if (newTitle.trim() !== title && newTitle.trim() !== "") {
        setIsSaving(true);
        onTitleChange(newTitle.trim()).finally(() => {
          setIsSaving(false);
        });
      }
    }, 1000); // 1 second debounce
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFinishEditing();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setLocalTitle(title);
      setIsEditing(false);
    }
  };

  const handleFinishEditing = () => {
    setIsEditing(false);

    // Clear debounce and immediately save if there are changes
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (localTitle.trim() !== title && localTitle.trim() !== "") {
      setIsSaving(true);
      onTitleChange(localTitle.trim()).finally(() => {
        setIsSaving(false);
      });
    } else if (localTitle.trim() === "") {
      setLocalTitle(title); // Reset to original if empty
    }
  };

  return (
    <div className="editable-title">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          onBlur={handleFinishEditing}
          onKeyDown={handleKeyDown}
          className="title-input"
          maxLength={100}
        />
      ) : (
        <h1
          onClick={() => setIsEditing(true)}
          className="title-display"
          title="Click to edit title"
        >
          {localTitle}
          {isSaving && <span className="saving-indicator">💾</span>}
        </h1>
      )}
    </div>
  );
};

export default Toolbar;
