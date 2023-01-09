import React, { useEffect } from "react";

const NotFound = () => {
  // Set title
  useEffect(() => {
    document.title = "Not Found (#404)";
  }, []);

  return (
    <div className="text-center bg-[#222222] -mx-[40px] -my-[20px] h-[calc(100vh-50px-60px)] flex items-center justify-center flex-col">
      <h1 className="text-[#222222] text-[100px] leading-none not-found">
        Not Found <br /> (#404)
      </h1>

      <h3 className="text-[#fff] text-[20px] mt-[30px] mx-auto mb-[30px] font-[calibri] font-bold">
        Wibet Alert
      </h3>

      <h3 className="text-[#fff] text-[20px] mt-0 mx-auto mb-[30px] font-[calibri]">
        Impostor detected !!!
        <br />
        Page not found.
      </h3>
    </div>
  );
};

export default NotFound;
