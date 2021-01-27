import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./profile.styles.css";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const Profile = ({ user, loadUser, token }) => {
  const [userInfo, setUserInfo] = useState({
    name: user.name,
    age: user.age,
    entries: user.entries,
    joined: user.joined,
  });
  const [redirct, setRedirect] = useState(false);

  const { name, entries, joined } = userInfo;

  const onInputChange = (event) => {
    let value = event.target.value;
    let fieldName = event.target.name;
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  const onSubmit = () => {
    if (name && name !== user.name) {
      fetch(`/profile/${user.id}`, {
        method: "put",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify({
          formInput: {
            name: name,
          },
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data === "success") {
            loadUser({ ...user, name: name });
            setRedirect(true);
          } else {
            console.log("error changing user info");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      {redirct ? <Redirect to="/home" /> : null}
      <div className="profile-main" style={{ marginTop: "-2rem" }}>
        <article className="br2 shadow-1 ba dark-gray b--black-10 mv4 w-90 w-60-m w-60-l mw6 center">
          <main className="pa4 black-80 w-80">
            <h1 style={{ textAlign: "center", overflow: "hidden" }}>
              {name
                ? capitalizeFirstLetter(name)
                : capitalizeFirstLetter(user.name)}
            </h1>
            <p className="b">{`Images submitted: ${entries}`}</p>
            <p>{`Member since: ${new Date(joined).toLocaleDateString()}`}</p>
            <hr
              style={{
                backgroundColor: "black",
                height: "1px",
                border: "none",
                margin: "2rem",
              }}
            />
            <label className="db fw6 lh-copy f5 ma1" htmlFor="user-name">
              Edit Name:
            </label>
            <input
              maxLength="30"
              onChange={onInputChange}
              type="text"
              name="name"
              id="user-name"
              className="profile-input pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100 mb3 "
              placeholder="eg: John"
            ></input>
            <div className="mt4">
              <input
                onClick={onSubmit}
                id="submitButton"
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f8 dib mb1 w-40"
                type="submit"
                value="Save"
              />
            </div>
          </main>
        </article>
      </div>
    </>
  );
};

export default Profile;
