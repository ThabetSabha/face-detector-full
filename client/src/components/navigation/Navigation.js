import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import Logo from "../logo/Logo";

const Navigation = ({ signOut }) => {
  return (
    <nav
      className="tr mt3"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <Link to="/" className="w-20">
        <Logo />
      </Link>

      <div
        className="pa3 mb5"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <Switch>
          {/* SignIn Nav */}
          <Route path="/signin">
            <Link to="/" style={{ textDecoration: "none" }}>
              <p className="black underline ma0 f3 link dim pointer">Guest</p>
            </Link>
          </Route>
          {/* Register Nav */}
          <Route path="/register">
            <Link to="/signin" style={{ textDecoration: "none" }}>
              <p className="black underline ma0 mr3 f3 link dim pointer">
                Sign In
              </p>
            </Link>
            <Link to="/" style={{ textDecoration: "none" }}>
              <p className="black underline ma0 ml3  f3 link dim pointer">
                Guest
              </p>
            </Link>
          </Route>
          {/* Profile Nav */}
          <Route path="/profile">
            <Link to="/home" style={{ textDecoration: "none" }}>
              <p className="black underline ma0 mr3 f3 link dim pointer">
                Home
              </p>
            </Link>
            <Link
              to="/"
              style={{ textDecoration: "none" }}
              onClick={() => {
                signOut();
              }}
            >
              <p className="black underline ma0 ml3 f3 link dim pointer">
                Sign Out
              </p>
            </Link>
          </Route>
          {/* Home Nav */}
          <Route path="/home">
            <Link to="/profile" style={{ textDecoration: "none" }}>
              <p className="black underline ma0 mr3 f3 link dim pointer">
                Profile
              </p>
            </Link>
            <Link to="/" style={{ textDecoration: "none" }}>
              <p
                onClick={() => {
                  signOut();
                  sessionStorage.clear(); //to clear seassionStorage when we sign out
                }}
                className="black underline ma0 ml3 f3 link dim pointer"
              >
                Sign Out
              </p>
            </Link>
          </Route>
          {/* Guest Nav */}
          <Route path="/">
            <Link to="/signin" style={{ textDecoration: "none" }}>
              <p className="black underline ma0 mr3 f3 link dim pointer">
                Sign In
              </p>
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              <p className="black underline ma0 ml3  f3 link dim pointer">
                Register
              </p>
            </Link>
          </Route>
        </Switch>
      </div>
    </nav>
  );
};

export default Navigation;
