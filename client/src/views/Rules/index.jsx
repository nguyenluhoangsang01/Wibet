import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { ruleRoutes } from "../../constants";

const Rules = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <Breadcrumbs routes={ruleRoutes} />
      <Heading title={pathname.slice(1)} />
    </div>
  );
};

export default Rules;
