import React, { useState } from "react";
import Image from "next/image";

interface AvatarSettingsProps {
  onImageUpload?: (file: File | null) => void;
}

const AvatarSettings: React.FC<AvatarSettingsProps> = ({ onImageUpload }) => {
  interface ImageState {
    file: File;
    previewUrl: string;
  }

  const [image, setImage] = useState<ImageState | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files?.[0]) {
      const file = files[0];
      const previewUrl = URL.createObjectURL(file);

      setImage({ file, previewUrl });
      if (onImageUpload) {
        onImageUpload(file);
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    if (onImageUpload) {
      onImageUpload(null);
    }
  };

  return (
    <div className="avatar-settings">
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input
          accept="image/*"
          id="avatar-upload"
          style={{ display: "none" }}
          type="file"
          onChange={handleFileChange}
        />
        <label
          htmlFor="avatar-upload"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            background: "#0070f3",
            color: "#fff",
            borderRadius: "4px",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          {image ? "Change Image" : "Select Image"}
        </label>
      </div>
      {image ? (
        <div className="preview-container" style={{ textAlign: "center" }}>
          <Image
            alt="Preview"
            src={image.previewUrl}
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: "10px",
              margin: "0 auto",
            }}
          />
          <br />
          <button
            style={{
              padding: "5px 10px",
              background: "#ff6666",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            onClick={removeImage}
          >
            Remove Image
          </button>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "#999" }}>No image selected</p>
      )}
    </div>
  );
};

export default AvatarSettings;
