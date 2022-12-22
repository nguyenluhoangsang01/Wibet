import { Breadcrumb } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const { Item } = Breadcrumb;

const Breadcrumbs = ({ routes }) => {
  return (
    <Breadcrumb className="w-full rounded-2xl h-[40px] flex items-center px-4 mb-4 bg-[#f3f1f1]">
      {routes?.map((route) => (
        <Item key={route.name}>
          {route.path ? (
            <Link
              to={route.path}
              className="capitalize text-base font-medium !text-[#067CCD]"
            >
              {route.name}
            </Link>
          ) : (
            <span className="capitalize text-base font-medium">
              {route.name}
            </span>
          )}
        </Item>
      ))}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
