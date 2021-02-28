import React from "react";
import Tilt from "react-tilt";
import logo from "./logo.png";

const Logo = () => {
  return (
    <div className="ml4 mt0">
      <Tilt
        className="Tilt br2"
        options={{ max: 40 }}
        style={{ height: 150, width: 150 }}
      >
        <div className="Tilt-inner" style={{ display: "flex" }}>
          <img
            className="pointer"
            height="70px"
            width="70px"
            alt="logo"
            src={logo}
          />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
