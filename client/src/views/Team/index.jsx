import React from "react";
import { useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { teamRoutes } from "../../constants";

const Team = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <Breadcrumbs routes={teamRoutes} />
      <Heading title={pathname.slice(1)} />
    </div>
  );
};

export default Team;
