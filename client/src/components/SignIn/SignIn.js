import React, { useState, useEffect } from 'react';
import { Redirect, Link } from "react-router-dom";


const SignIn = ({ loadUser,loggedIn }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [wrongInfo, setWrongInfo] = useState(false);


    useEffect(() => {       //to sumbit the singin form when user presses enter on any of the fields
        const input = document.getElementsByClassName("submitOnEnter");
        const submitForm = (event) => {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("submitButton").click();
            }

        }
        // Execute a function when the user releases a key on the keyboard
        input[0].addEventListener("keyup", submitForm);
        input[1].addEventListener("keyup", submitForm);
    }, [])

    const emailInput = (event) => {
        setEmail(event.target.value)
    }


    const passwordInput = (event) => {
        setPassword(event.target.value)
    }


    const onSubmit = () => {
        if (email && password) {    //only fetch when email and password length > 0
            fetch('signin', {
                method: 'post',
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify(
                    {
                        email: email,
                        password: password,
                    })
            })


                .then(res => res.json())                         //response is either ("wrong email or password") or user info



                .then(res => {
                    if (res.id) {       //if the res was user info then it has an id.
                        loadUser(res);
                    } else { console.log(res); setWrongInfo(true) }
                })

        }
        else {
            setWrongInfo(true)
            console.log("you need to enter username and password")
        }


    }


    return (
        <div>
            {loggedIn? //doing a successful sign in loads the user which sets the state to true which redircts to home.
                <Redirect
                    to={{
                        pathname: "/home",
                    }}
                /> :
                <article className="br2 shadow-1 ba dark-gray b--black-10 mv4 w-90 w-50-m w-25-l mw6 center">
                    <main className="pa4 black-80">
                        <div className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f2 fw6 ph0 mh0 center">Sign In</legend>
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f5" htmlFor="email-address">Email</label>
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
                                    <label className="db fw6 lh-copy f5" htmlFor="password">Password</label>
                                    <input className="submitOnEnter b pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100"
                                        type="password"
                                        name="password"
                                        id="password"
                                        onChange={passwordInput}
                                        required
                                    />
                                </div>
                            </fieldset>
                            {wrongInfo ?
                                <div className="center red f6 mb3">*Wrong email or password </div> :
                                <></>}
                            <div className="">
                                <input
                                    onClick={() => {
                                        onSubmit()
                                    }}
                                    id="submitButton"
                                    className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib mb1"
                                    type="submit"
                                    value="Sign in"
                                />
                            </div>
                            <div className="lh-copy mt4">
                                <p className="f6 mb0  grey  db"> don't have an account? </p>
                                <Link to="/register" className="f5 link dim black db pointer ma0 pa0">
                                    Register
                                    </Link>
                            </div>
                        </div>
                    </main>

                </article>
            }

        </div>
    )



}

export default SignIn;