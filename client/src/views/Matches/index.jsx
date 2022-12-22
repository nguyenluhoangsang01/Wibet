import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { matchesRoutes } from "../../constants";

const Matches = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <Breadcrumbs routes={matchesRoutes} />
      <Heading title={pathname.slice(1)} />
    </div>
  );
};

export default Matches;
