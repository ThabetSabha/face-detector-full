import React, { useState } from "react";
import { Redirect } from "react-router-dom";

const Register = () => {
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { email, name, password, confirmPassword } = registerInfo;

  const [registered, setRegistered] = useState(false);

  const [errorMessage, setErrorMessage] = useState(null);

  const onInputChange = (event) => {
    let value = event.target.value;
    let fieldName = event.target.name;
    setRegisterInfo({ ...registerInfo, [fieldName]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (email && password && name && confirmPassword) {
      //to check if the fields aren't empty
      setErrorMessage(null);
      if (password !== confirmPassword) {
        setErrorMessage("*Passwords don't match");
        return;
      }
      fetch("register", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
          avatars3key: "avatar.png",
        }),
      })
        .then((res) => res.json()) //either returns user info, or "email already exists."

        .then((res) => {
          if (res.id) {
            setRegistered(true);
          } else {
            setErrorMessage("*Email already exists");
          } //which display the div saying email already exists
        });
    } else {
      setErrorMessage("*Make sure all fields are filled.");
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
                  <label className="db fw6 lh-copy f5" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white submitOnEnter"
                    type="name"
                    name="name"
                    id="name"
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div className="mt3">
                  <label className="db fw6 lh-copy f5" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white submitOnEnter"
                    type="email"
                    name="email"
                    id="email"
                    onChange={onInputChange}
                    required
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
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div className="mt3">
                  <label
                    className="db fw6 lh-copy f5"
                    htmlFor="confirmPassword"
                  >
                    Confirm Password
                  </label>
                  <input
                    className="b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white submitOnEnter"
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    onChange={onInputChange}
                    required
                  />
                </div>
              </fieldset>
              <div className="center red f6 mb3">{errorMessage}</div>
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
