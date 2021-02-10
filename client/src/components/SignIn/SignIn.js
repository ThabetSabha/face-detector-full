import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignIn = ({ loadUser, fetchUserProfile }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const emailInput = (event) => {
    setEmail(event.target.value);
  };

  const passwordInput = (event) => {
    setPassword(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      //only fetch when email and password length > 0
      setErrorMessage(null);
      fetch("signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase(),
          password: password,
        }),
      })
        .then((res) => res.json()) //response is either ("wrong email or password") or user info

        .then((data) => {
          if (data.userId) {
            //if the res was user info then it has an id.
            //1- Store token in session storage
            const { token, userId } = data;
            window.sessionStorage.setItem("token", token);
            //2- fetch user profie then load user.
            fetchUserProfile(userId, token).then((profile) => {
              if (profile.email) {
                loadUser(profile);
              } else {
                setErrorMessage("*Wrong email or password");
              }
            });
          } else {
            setErrorMessage("*Wrong email or password");
          }
        });
    } else {
      setErrorMessage("*Make sure all the fields are filled.");
    }
  };

  return (
    <div>
      <form
        className="br2 shadow-1 ba dark-gray b--black-10 mv4 w-90 w-50-m w-25-l mw6 center"
        onSubmit={onSubmit}
      >
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f2 fw6 ph0 mh0 center">Sign In</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f5" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="submitOnEnter pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={emailInput}
                  required
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f5" htmlFor="password">
                  Password
                </label>
                <input
                  className="submitOnEnter b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={passwordInput}
                  required
                />
              </div>
            </fieldset>
            <div className="center red f6 mb3">{errorMessage}</div>
            <div>
              <input
                id="submitButton"
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib mb1"
                type="submit"
                value="Sign in"
              />
            </div>
            <div className="lh-copy mt4">
              <p className="f6 mb0  grey  db"> don't have an account? </p>
              <Link
                to="/register"
                className="f5 link dim black db pointer ma0 pa0"
              >
                Register
              </Link>
            </div>
          </div>
        </main>
      </form>
    </div>
  );
};

export default SignIn;
