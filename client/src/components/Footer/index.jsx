import React from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();

  return (
    <footer className="h-[60px] bg-[#f5f5f5] border-t-[1px] border-t-[#ddd] text-[16px]">
      <p className="max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-[1140px] mx-auto leading-[59px]">
        © Wibet 2022 by{" "}
        <Link to={pathname} className="text-[#428BCA]">
          wsi-dev
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
