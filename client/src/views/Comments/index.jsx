import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { capitalize } from "../../helper";

const Comments = () => {
  const { pathname } = useLocation();

  // Set title
  useEffect(() => {
    document.title = capitalize(pathname.slice(1));
  }, [pathname]);

  return <div>Comments</div>;
};

export default Comments;
