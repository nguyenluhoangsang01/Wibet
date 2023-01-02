import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { ruleRoutes } from "../../constants";
import { capitalize } from "../../helper";

const Rules = () => {
  const { pathname } = useLocation();

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  return (
    <div>
      <Breadcrumbs routes={ruleRoutes} />
      <Heading title={pathname.slice(1)} />
    </div>
  );
};

export default Rules;
