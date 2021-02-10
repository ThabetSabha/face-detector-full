import React, { useState } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";

const ProfileIcon = ({ signOut, avatars3key }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="tc">
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
        <DropdownToggle
          tag="span"
          onClick={toggleDropdown}
          data-toggle="dropdown"
          aria-expanded={toggleDropdown}
        >
          <img
            src={
              avatars3key
                ? `https://face-detector-avatars.s3.me-south-1.amazonaws.com/${avatars3key}`
                : "https://face-detector-avatars.s3.me-south-1.amazonaws.com/avatar.png"
            }
            className="br-100 h3 w3 dib ba"
            alt="avatar"
            style={{ objectFit: "cover" }}
          />
        </DropdownToggle>
        <DropdownMenu
          className="b--transparent shadow-5"
          style={{
            marginLeft: "-6rem",
            backgroundColor: "rgba(255, 255, 255, 0.5)",
          }}
        >
          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "black" }}
          >
            <DropdownItem>Profile</DropdownItem>
          </Link>

          <DropdownItem onClick={signOut}>Sign Out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ProfileIcon;
