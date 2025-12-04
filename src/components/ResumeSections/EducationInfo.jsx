import React from "react";

const EducationInfo = ({ degree, institution, duration, percentage, division }) => {
  return <div className="mb-5">
      <h3 className={`text-[15px] font-semibold text-gray-900`}>{degree}</h3>
      <p className="text-sm text-gray-700 font-medium">{institution}</p>
      <p className="text-xs text-gray-500 font-medium italic mt-0.5">
        {duration}
      </p>
      {percentage && (
        <p className="text-xs text-gray-600 font-medium mt-0.5">
          Grade: {percentage}
        </p>
      )}
      {division && (
        <p className="text-xs text-gray-600 font-medium mt-0.5">
          Division: {division}
        </p>
      )}
    </div>
};

export default EducationInfo;
