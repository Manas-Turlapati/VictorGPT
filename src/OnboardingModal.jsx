import React, { useState, useEffect } from "react";
import "./OnboardingModal.css";

const AVATAR_STYLE = "identicon"; // DiceBear style for GitHub-like pixel art

function OnboardingModal({ onComplete }) {
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Generate 5 random seeds for the avatars
    const newAvatars = Array.from({ length: 5 }).map(() => {
      const seed = Math.random().toString(36).substring(7);
      return `https://api.dicebear.com/7.x/${AVATAR_STYLE}/svg?seed=${seed}`;
    });
    setAvatars(newAvatars);
    setSelectedAvatar(newAvatars[0]);
    
    // Auto-fill existing username if present (e.g. from registration)
    const existingUsername = localStorage.getItem("username");
    if (existingUsername && existingUsername !== "test") {
      setUsername(existingUsername);
    }
  }, []);

  const handleSave = () => {
    if (!username.trim()) {
      setError("Please enter a username.");
      return;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("avatarUrl", selectedAvatar);
    onComplete();
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-modal">
        <h2>Welcome to VictorGPT!</h2>
        <p>Let's set up your profile.</p>

        <div className="form-group">
          <label>Pick an Avatar</label>
          <div className="avatar-grid">
            {avatars.map((url, idx) => (
              <img
                key={idx}
                src={url}
                alt="Avatar option"
                className={`avatar-option ${selectedAvatar === url ? "selected" : ""}`}
                onClick={() => setSelectedAvatar(url)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Choose a Username</label>
          <input
            type="text"
            className="username-input"
            placeholder="e.g., CoolHacker99"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
          />
          {error && <div className="error-text">{error}</div>}
        </div>

        <button className="onboarding-submit" onClick={handleSave}>
          Get Started
        </button>
      </div>
    </div>
  );
}

export default OnboardingModal;
