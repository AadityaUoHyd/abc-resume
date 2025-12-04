import React, { useRef, useState, useEffect } from 'react'
import { User, Upload, Trash } from "lucide-react";

const ProfilePhotoSelector = ({image, setImage, preview, setPreview}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(preview || null);

  // Update local preview URL when preview prop changes
  useEffect(() => {
    setPreviewUrl(preview || null);
  }, [preview]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Update the image state (File object for upload)
      setImage(file);

      // Generate preview URL from the file
      const preview = URL.createObjectURL(file);
      if(setPreview){
        setPreview(preview) // Save blob URL to database for "Save & Exit" flow
      }
      setPreviewUrl(preview); // For local component preview
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);

    if(setPreview){
      setPreview(null) // Clear database preview URL when image is removed
    }
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };
  return (
   <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!image && !previewUrl ? (
        <div className="w-20 h-20 flex items-center justify-center bg-purple-50 rounded-full relative cursor-pointer">
          <User className="text-4xl text-purple-500" />

          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-linear-to-r from-purple-500/85 to-purple-700 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={onChooseFile}
          >
            <Upload />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={image ? (preview || previewUrl) : previewUrl}
            alt="profile photo"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
            onClick={handleRemoveImage}
          >
            <Trash />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfilePhotoSelector