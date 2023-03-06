import React, { memo } from "react";
import { AiOutlineClose } from "react-icons/ai";

const SuccessMessage = ({ isUpdated, setIsUpdated, children }) => {
  return (
    isUpdated && (
      <div className="p-[15px] mb-[20px] font-[calibri] text-[18px] bg-[#dff0d8] text-[#3c763d] flex items-center justify-between">
        <span>{children}</span>

        <AiOutlineClose
          className="cursor-pointer text-xl transition hover:scale-105 active:scale-100"
          onClick={() => setIsUpdated(false)}
        />
      </div>
    )
  );
};

export default memo(SuccessMessage);
