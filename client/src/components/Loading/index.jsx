import React from "react";

const Loading = ({ color }) => {
  return (
    <div className={`bg-[${color}] w-6 h-6 rounded-full animate-ping`}></div>
  );
};

export default Loading;
