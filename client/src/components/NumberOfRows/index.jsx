import React from "react";

const NumberOfRows = ({ children }) => {
  return (
    <p className="flex items-center gap-1 font-[calibri] text-[18px]">
      {children}
    </p>
  );
};

export default NumberOfRows;
