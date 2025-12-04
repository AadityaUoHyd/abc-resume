import React from "react";

const RatingInput = ({
  value = 0,
  total = 5,
  onChange = () => {},
  color = "#9125E6",
  bgColor = "#E9D4FF",
}) => {
  // Convert 0–100 to 0–5 scale
  const displayValue = Math.round((value / 100) * total);

  const handleClick = (index) => {
    // Convert 0–5 scale back to 0–100 for DB
    const newValue = Math.round(((index + 1) / total) * 100);
    onChange(newValue);
  };

  return <div className="flex gap-3 cursor-pointer">
      {[...Array(total)].map((_, index) => {
        const isActive = index < displayValue;

        return (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className="w-4 h-4 rounded transition-all"
            style={{
              backgroundColor: isActive ? color : bgColor,
            }}
          ></div>
        );
      })}
    </div>
};

export default RatingInput;
