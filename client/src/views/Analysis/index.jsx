import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { capitalize } from "../../helper";

const Analysis = () => {
  const { pathname } = useLocation();

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  return <div>Analysis</div>;
};

export default Analysis;
