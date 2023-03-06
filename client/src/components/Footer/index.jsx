import React, { memo } from "react";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();

  return (
    <footer className="h-[60px] bg-[#f5f5f5] border-t-[1px] border-t-[#ddd] text-[16px]">
      <p className="max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-6xl 2xl:max-w-7xl mx-auto leading-[59px] px-4 sm:px-0">
        © Wibet 2022 by{" "}
        <Link
          to={pathname}
          className="text-[#428BCA] hover:underline hover:text-[#2a6496] transition"
        >
          wsi-dev
        </Link>
      </p>
    </footer>
  );
};

export default memo(Footer);
