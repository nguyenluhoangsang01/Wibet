import React from "react";

const Heading = ({ title }) => {
  return (
    <h1 className="capitalize text-[28px] md:text-[36px] font-[arial] font-bold mt-[20px] mb-[10px]">
      {title}
    </h1>
  );
};

export default Heading;
