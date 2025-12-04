import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ value, onChange, label, placeholder, type, options }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return <div>
      <label className="text-[13px] text-slate-800">{label}</label>

      <div className="input-box">
        {type === "select" ? (
          <select
            className="w-full bg-transparent outline-none"
            value={value}
            onChange={(e) => onChange(e)}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={
              type == "password" ? (showPassword ? "text" : "password") : type
            }
            placeholder={placeholder}
            className="w-full bg-transparent outline-none"
            value={value}
            onChange={(e) => onChange(e)}
          />
        )}

        {type === "password" && (
          <>
            {showPassword ? (
              <Eye
                size={22}
                className="text-primary cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            ) : (
              <EyeOff
                size={22}
                className="text-slate-400 cursor-pointer"
                onClick={() => toggleShowPassword()}
              />
            )}
          </>
        )}
      </div>
    </div>
};

export default Input;
