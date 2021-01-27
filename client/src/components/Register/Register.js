import React, { useState } from "react";
import { Redirect } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userExists, setUserExists] = useState(false); //email exists alert
  const [registered, setRegistered] = useState(false); //empty fields alert
  const [emptyFields, setEmptyFields] = useState(false); //to redirect to signin if true

  const nameInput = (event) => {
    setName(event.target.value);
  };

  const emailInput = (event) => {
    setEmail(event.target.value);
  };

  const passwordInput = (event) => {
    setPassword(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (email && password && name) {
      //to check if the fields aren't empty
      setEmptyFields(false);
      fetch("register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
        }),
      })
        .then((res) => res.json()) //either returns user info, or "email already exists."

        .then((res) => {
          if (res.id) {
            setRegistered(true);
          } else {
            setUserExists(true);
          } //which display the div saying email already exists
        });
    } else {
      setUserExists(false);
      setEmptyFields(true);
    }
  };

  return (
    <div>
      {registered ? ( //when registering the state becomes true, which redirects to signin
        <Redirect
          to={{
            pathname: "/signin",
          }}
        />
      ) : (
        <form
          className="br2 shadow-1 ba dark-gray b--black-10 mv4 w-90 w-50-m w-25-l mw6 center"
          onSubmit={onSubmit}
        >
          <article className="pa4 black-80">
            <div action="sign-up_submit" method="get" acceptCharset="utf-8">
              <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                <legend className="f2 fw6 ph0 mh0 center">Register</legend>

                <div className="mt3">
                  <label className="db fw6 lh-copy f5" htmlFor="Name">
                    Name
                  </label>
                  <input
                    className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white submitOnEnter"
                    type="Name"
                    name="Name"
                    id="Name"
                    onChange={nameInput}
                  />
                </div>
                <div className="mt3">
                  <label className="db fw6 lh-copy f5" htmlFor="email-address">
                    Email
                  </label>
                  <input
                    className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white submitOnEnter"
                    type="email"
                    name="email-address"
                    id="email-address"
                    onChange={emailInput}
                  />
                </div>
                <div className="mt3">
                  <label className="db fw6 lh-copy f5" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white submitOnEnter"
                    type="password"
                    name="password"
                    id="password"
                    onChange={passwordInput}
                  />
                </div>
              </fieldset>
              {userExists ? (
                <div className="center red f6 mb3">*Email already exists </div>
              ) : (
                <></>
              )}
              {emptyFields ? (
                <div className="center red f6 mb3">
                  *Make sure all fields are filled.{" "}
                </div>
              ) : (
                <></>
              )}
              <div className="mt3">
                <input
                  className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6"
                  id="submitButton"
                  type="submit"
                  value="Register"
                />
              </div>
            </div>
          </article>
        </form>
      )}
    </div>
  );
};

export default Register;
