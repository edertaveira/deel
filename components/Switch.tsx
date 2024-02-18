"use client";
import { SrvRecord } from "dns";
import React, { useState } from "react";

interface SwitchProps {
  label: string;
  onChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ label, onChange }) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleChange = () => {
    const nextChecked = !checked;
    setChecked(nextChecked);
    onChange(nextChecked);
  };

  return (
    <div className="w-full max-w-md mx-auto flex my-2">
      <label htmlFor="toggle" className="flex cursor-pointer">
        <div className="relative">
          <input
            id="toggle"
            type="checkbox"
            className="hidden"
            checked={checked}
            onChange={handleChange}
          />
          <div
            className={`toggle__line w-8 h-4 bg-gray-400 rounded-full shadow-inner ${
              checked ? "bg-green-500" : "bg-gray-400"
            } `}
          ></div>
          <div
            className={`toggle__dot absolute w-4 h-4 bg-white rounded-full shadow inset-y-0 left-0 ${
              checked ? "transform translate-x-full" : "bg-gray-400"
            } `}
          ></div>
        </div>
        <span className="ml-2 text-sm font-semibold text-gray-700">
          {label}
        </span>
      </label>
    </div>
  );
};

export default Switch;
