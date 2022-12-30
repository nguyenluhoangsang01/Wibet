import React from "react";
import Breadcrumbs from "../../components/Breadcrumbs";
import Heading from "../../components/Heading";
import { createMatchRoutes } from "../../constants";

const MatchCreate = () => {
  return (
    <div>
      {/* Breadcrumbs */}
      <Breadcrumbs routes={createMatchRoutes} />
      {/* Heading */}
      <Heading title={createMatchRoutes[2].name} />
    </div>
  );
};

export default MatchCreate;
