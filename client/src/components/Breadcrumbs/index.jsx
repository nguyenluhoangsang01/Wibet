import { Breadcrumb } from "antd";
import React, { memo } from "react";
import { Link } from "react-router-dom";

const { Item } = Breadcrumb;

const Breadcrumbs = ({ routes }) => {
  return (
    <Breadcrumb className="font-[calibri] text-[18px] w-full rounded-2xl h-[40px] flex items-center px-[15px] py-[8px] mb-5 bg-[#f3f1f1] capitalize">
      {routes?.map((route) => (
        <Item key={route.name}>
          {route.path ? (
            <Link
              to={route.path}
              className="!text-[#428bca] transition hover:underline"
            >
              {route.name}
            </Link>
          ) : (
            <span className="!text-[#999999]">{route.name}</span>
          )}
        </Item>
      ))}
    </Breadcrumb>
  );
};

export default memo(Breadcrumbs);
