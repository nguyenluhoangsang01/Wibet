import React from "react";

const SuccessMessage = ({ children }) => {
  return (
    <div className="p-[15px] mb-[20px] font-[calibri] text-[18px] bg-[#dff0d8] text-[#3c763d]">
      {children}
    </div>
  );
};

export default SuccessMessage;
