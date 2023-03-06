import React, { memo } from "react";

const RuleWrappers = ({ heading, children }) => {
  return (
    <div>
      <h4 className="font-[arial] text-[24px] py-[10px] px-[15px] my-[20px] font-bold text-white bg-[#222] uppercase">
        {heading}
      </h4>

      <div className="font-[calibri] text-[18px] mb-[50px]">
        {children}
        <hr />
      </div>
    </div>
  );
};

export default memo(RuleWrappers);
