import { Image } from "antd";
import React from "react";
import { sizeInMb } from "../../helper";

const RenderFile = ({ file: { format, name, size } }) => {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={`https://res.cloudinary.com/wibet/image/upload/v1672469773/${
          format === "jpeg" || format === "jpg" ? "jpg" : "png"
        }-icon.png`}
        alt={name}
        preview={false}
        width={50}
        className="object-cover"
      />
      <span className="font-semibold">{name}</span>
      <span>{sizeInMb(size)}</span>
    </div>
  );
};

export default RenderFile;
