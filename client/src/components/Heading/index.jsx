import React from "react";

const Heading = ({ title }) => {
  return (
    <h1 className="uppercase truncate max-w-[1140px] text-center text-[36px] font-[arial] font-bold mt-[20px] mb-[10px] mx-auto">
      {title}
    </h1>
  );
};

export default Heading;
