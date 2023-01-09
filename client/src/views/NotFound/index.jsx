import React, { useEffect } from "react";

const NotFound = () => {
  // Set title
  useEffect(() => {
    document.title = "Not Found (#404)";
  }, []);

  return (
    <div className="bg-black">
      <h1 className="text-center text-[#222222] text-[100px] leading-none shadow-black not-found">
        Not Found <br /> (#404)
      </h1>

      <div></div>
    </div>
  );
};

export default NotFound;
