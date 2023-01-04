import React from "react";

const RuleWrappers = ({ heading, children }) => {
  return (
    <div>
      <h4 className="font-[arial] text-[24px] py-[10px] px-[15px] my-[20px] font-bold text-white bg-black uppercase">
        {heading}
      </h4>

      <div className="font-[calibri] text-[18px]">{children}</div>
    </div>
  );
};

export default RuleWrappers;
