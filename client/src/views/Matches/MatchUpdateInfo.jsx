import React from "react";
import { useLocation } from "react-router-dom";

const MatchUpdateInfo = () => {
  // Initial location
  const {
    state: { match },
  } = useLocation();

  console.log(match);

  return <div>MatchUpdateInfo</div>;
};

export default MatchUpdateInfo;
