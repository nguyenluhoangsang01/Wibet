import React from "react";

const Footer = () => {
  return (
    <footer className="h-[60px] bg-[#f5f5f5] border-t-[1px] border-t-[#ddd] flex items-center sticky bottom-0 w-full text-[16px]">
      <p className="px-4 sm:px-10 mx-auto md:mx-0">
        © wibet 2022 by{" "}
        <span className="text-[#428BCA] cursor-pointer">wsi-dev</span>
      </p>
    </footer>
  );
};

export default Footer;
