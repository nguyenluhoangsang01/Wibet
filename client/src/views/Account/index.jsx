import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { accountRoutesB } from "../../constants";

const Account = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <Breadcrumbs routes={accountRoutesB} />
      <Heading title={pathname.slice(1)} />
    </div>
  );
};

export default Account;
