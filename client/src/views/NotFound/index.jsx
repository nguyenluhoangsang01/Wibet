import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  // Initial navigate
  const navigate = useNavigate();

  // Set title
  useEffect(() => {
    document.title = "Not Found (#404)";
  }, []);

  // Handle go home
  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div className="text-center bg-[#222222] -mx-[65px] -my-[20px] min-h-[calc(100vh-50px-60px)] flex items-center justify-center flex-col">
      <button
        onClick={handleGoHome}
        className="px-4 py-2 border-white rounded-lg text-white font-[calibri] text-[18px] border-[2px] transition hover:border-[#FFC107] hover:text-[#FFC107] mb-10"
      >
        Go Home
      </button>

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
