import React from "react";

const Footer = () => {
  return (
    <footer className="h-[60px] uppercase bg-[#f3f1f1] border-b-4 border-b-[black] border-t-2 border-t-[#ccc] flex items-center">
      <div className="uppercase font-semibold transition px-4 sm:px-10 mx-auto md:mx-0">
        © wibet 2022 by{" "}
        <span className="text-[#067CCD] cursor-pointer">wsi-dev</span>
      </div>
    </footer>
  );
};

export default Footer;
