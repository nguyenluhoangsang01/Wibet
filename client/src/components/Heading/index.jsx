import React, { memo } from "react";

const Heading = ({ title }) => {
  return (
    <h1 className="capitalize text-[36px] font-[arial] font-bold mt-[20px] mb-[10px] text-[#333]">
      {title}
    </h1>
  );
};

export default memo(Heading);
