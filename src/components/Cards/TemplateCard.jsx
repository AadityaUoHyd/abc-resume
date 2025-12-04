import React from "react";
import { Lock } from "lucide-react";

const TemplateCard = ({ 
  thumbnailImg, 
  isSelected, 
  onSelect, 
  isLocked = false, 
  onLockedClick 
}) => {
  const handleClick = () => {
    if (isLocked) {
      onLockedClick && onLockedClick();
    } else {
      onSelect();
    }
  };

  return (
    <div
      className={`h-auto md:h-[300px] flex flex-col items-center justify-between bg-white rounded-lg border border-gray-200 hover:border-purple-300 overflow-hidden cursor-pointer relative
        ${isSelected ? "border-purple-500 border-2" : ""}`}
      onClick={handleClick}
    >
      {thumbnailImg ? (
        <img 
          src={thumbnailImg} 
          alt="" 
          className={`w-[100%] rounded ${isLocked ? "blur-sm" : ""}`} 
        />
      ) : (
        <div></div>
      )}
      
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <Lock className="text-gray-600 text-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateCard;
