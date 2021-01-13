import React from 'react';
import {
    Link,
    Route, Switch
} from "react-router-dom";
import Logo from "../logo/Logo";


const Navigation = ({ signOut }) => {

    return (
        <nav className="tr mt3" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/" className="w-20"><Logo /></Link>
            <Switch>
                <Route path="/signin">

                    <div className="mb5 pa3" style={{ display: 'flex', justifyContent: 'flex-end' }}>

                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <p className="black underline ma0 f3 link dim pointer">
                                Guest
                        </p>
                        </Link>
                    </div>
                </Route>
                <Route path="/register">
                    <div className="mb5 pa3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to="/signin" style={{ textDecoration: 'none' }}>
                            <p className="black underline ma0 mr3 f3 link dim pointer">
                                Sign In
                        </p>
                        </Link>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <p className="black underline ma0 ml3  f3 link dim pointer">
                                Guest
                        </p>
                        </Link>
                    </div>
                </Route>
                <Route path="/home">
                    <div className="mb5 pa3" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <p
                                onClick={() => {
                                    signOut();
                                    sessionStorage.clear()            //to clear seassionStorage when we sign out
                                }}
                                className="black underline ma0 f3 link dim pointer">
                                Sign Out
                    </p>
                        </Link>
                    </div>
                </Route>
                <Route path="/">
                    <div>
                        <div className="pa3 mb5" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Link to="/signin" style={{ textDecoration: 'none' }}>
                                <p className="black underline ma0 mr3 f3 link dim pointer">
                                    Sign In
                        </p>
                            </Link>
                            <Link to="/register" style={{ textDecoration: 'none' }}>
                                <p className="black underline ma0 ml3  f3 link dim pointer">
                                    Register
                            </p>
                            </Link>
                        </div>
                    </div>
                </Route>
            </Switch>

        </nav>
    )
}


export default Navigation;