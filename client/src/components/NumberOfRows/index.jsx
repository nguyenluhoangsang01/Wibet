import React, { memo } from "react";

const NumberOfRows = ({ children }) => {
  return (
    <p className="flex items-center gap-1 font-[calibri] text-[18px] text-[#333]">
      {children}
    </p>
  );
};

export default memo(NumberOfRows);
