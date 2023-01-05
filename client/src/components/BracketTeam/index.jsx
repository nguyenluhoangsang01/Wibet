import { Image } from "antd";
import React from "react";

const BracketTeam = ({ team }) => {
  return team ? (
    <div className="truncate flex items-center justify-center gap-1">
      <div className="w-[35px] h-[35px] bg-white rounded-md flex items-center justify-center p-1 shadow-inner shadow-[#ccc]">
        <Image src={team.flag} preview={false} alt={team.fullName} />
      </div>
      <span className="font-semibold font-[arial] text-[14px]">
        {team.fullName}
      </span>
    </div>
  ) : (
    <div className="truncate flex items-center justify-center gap-1">
      <div className="w-[35px] h-[35px] bg-white rounded-md flex items-center justify-center p-1 shadow-inner shadow-[#ccc]">
        <Image
          src="https://res.cloudinary.com/wibet/image/upload/v1672115166/img_aff_mecup2022_logo_cyykbh.png"
          preview={false}
          alt="default-flag"
        />
      </div>
      <span className="font-semibold font-[arial] text-[14px]">_________</span>
    </div>
  );
};

export default BracketTeam;
