import React from "react";
import { Button } from "reactbulma";
import { Route, Link } from "react-router-dom";

const ButtonLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match }) => (
      <Button className={match ? "is-active" : ""}>
        <Link to={to}>{label}</Link>
      </Button>
    )}
  />
);

export default ButtonLink;
