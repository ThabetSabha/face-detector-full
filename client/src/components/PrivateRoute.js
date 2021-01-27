import React from "react";
import { Route, Redirect } from "react-router-dom";

//this is to guard the "home" route and prevent unlogged users from logging in.
export default function PrivateRoute({
  signedIn,
  foundUser,
  children,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        signedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
