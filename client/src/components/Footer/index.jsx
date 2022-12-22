import React from "react";

const Footer = () => {
  return (
    <footer className="h-[50px] uppercase bg-black text-white flex items-center">
      <div className="uppercase font-semibold transition px-4 sm:px-10 mx-auto md:mx-0">
        © wibet 2022 by{" "}
        <span className="text-[#067CCD] cursor-pointer">wsi-dev</span>
      </div>
    </footer>
  );
};

export default Footer;
