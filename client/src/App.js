import React, { useEffect, useState } from "react";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
import Particles from "react-particles-js";
import ImageLinkForm from "./components/imageLinkForm/ImageLinkForm";
import Rank from "./components/rank/Rank";
import FaceRecognetion from "./components/FaceRecognetion/FaceRecognetion";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/profile/profile.component";

//Particles config options
const particlesOptions = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 400,
      },
    },
  },
};

const App = () => {
  const location = useLocation();
  //app states
  const [input, setInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [faceBoxesLocations, setFaceBoxesLocations] = useState([]);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "0",
    name: "Guest",
    email: "",
    joined: "",
    entries: "0",
  });
  const [isChecking, setIsChecking] = useState(false);

  //recieves the bounding box info,  then calculates where it should be displayed.
  const calculateBoxLocation = (box) => {
    const image = document.getElementById("mainimg");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      bottom_row: (1 - box.bottom_row) * height,
      top_row: box.top_row * height,
      left_col: box.left_col * width,
      right_col: (1 - box.right_col) * width,
    };
  };

  const token = sessionStorage.getItem("token");

  const fetchUserProfile = async (userId, token) => {
    try {
      let res = await fetch(`profile/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      let data = await res.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token && !signedIn) {
      setIsChecking(true);
      fetch("signin", {
        method: "post",
        headers: { "Content-Type": "application/json", Authorization: token },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.id) {
            fetchUserProfile(data.id, token).then((profile) => {
              if (profile.email) {
                loadUser(profile);
                setIsChecking(false);
              }
            });
          } else {
            setIsChecking(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setIsChecking(false);
        });
    }
  }, [token, signedIn]);

  const onImageUrlChange = (event) => {
    setInput(event.target.value);
  };

  //passed to sign in; to load the user after sign in, and to Navigation to load intial state when using Signs out
  const loadUser = (data) => {
    setSignedIn(true);
    const { id, name, email, joined, entries } = data;
    setUser({
      id: id,
      name: name,
      email: email,
      joined: joined,
      entries: entries,
    });
    setImageUrl("");
  };

  //passed to nav component and called when sign out is pressed
  const signOut = () => {
    setUser({
      id: "0",
      name: "Guest",
      email: "",
      joined: "",
      entries: "0",
    });
    setSignedIn(false);
    setImageUrl("");
    fetch("signout", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: token },
    });
    sessionStorage.clear(); //to clear seassionStorage when we sign out
  };

  //When user submits the image
  const onButtonSubmit = () => {
    if(imageUrl !== input){
      setFaceBoxesLocations([])
      setImageUrl(input);
      if (input) {
        //returns face detection data from clarifai.
        fetch("imageurl", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: input,
          }),
        })
          .then((res) => res.json())
  
          .then((response) => {
            const BoundingBoxesArray = response.outputs[0].data.regions.map(
              (region) => region.region_info.bounding_box
            );
            // this gives us an array that has the bounding dimentions
            const Boxes = BoundingBoxesArray.map((box) =>
              calculateBoxLocation(box)
            );
            // this gives us an array "Boxes" that gets the calculated Pixel Locations by passing each box in the BoundingBoxesArray through the calculateBoxLocation function above.
            setFaceBoxesLocations(Boxes);
            // we wanna map through this to display a number of <div> each with a box inside.
          })
          .then((res) => {
            // we wanna fetch a put method to the server after recieving a response to get and update user entries.
            if (user.id !== "0") {
              //we don't want to update entries for guests (They have an id of 0).
              fetch("image", {
                method: "put",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: user.id,
                }),
              })
                .then((res) => res.json()) // the response is gonna be the number of entries the user has
                .then((count) => setUser({ ...user, entries: count }));
            }
          })
  
          .catch((err) => {
            console.log(err, "couldn't fetch image!");
          });
      }
    }
  };

  return (
    <main className="App">
      <Particles className="Particles" params={particlesOptions} />
      {isChecking ? (
        <h1>Loading...</h1>
      ) : (
        <>
          <Navigation signOut={signOut} />

          <Switch>
            <Route path="/signin">
              {signedIn ? ( //doing a successful sign in loads the user which sets the state to true which redircts to home.
                <Redirect
                  to={{
                    pathname: location.state?.from?.pathname || "home",
                  }}
                />
              ) : (
                <SignIn
                  loadUser={loadUser}
                  fetchUserProfile={fetchUserProfile}
                />
              )}
            </Route>

            <Route path="/register">
              {signedIn ? (
                <Redirect to={{ pathname: "/home" }} />
              ) : (
                <Register />
              )}
            </Route>

            <PrivateRoute path="/home" signedIn={signedIn}>
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm
                onButtonSubmit={onButtonSubmit}
                onInputChange={onImageUrlChange}
              />
              <FaceRecognetion
                imgSrc={imageUrl}
                faceBoxes={faceBoxesLocations}
              />
            </PrivateRoute>
            <PrivateRoute path="/profile" signedIn={signedIn}>
              <Profile user={user} loadUser={loadUser} token={token} />
            </PrivateRoute>
            <Route path="/">
              {signedIn ? (
                <Redirect to={{ pathname: "/home" }} />
              ) : (
                <div>
                  <Rank name={user.name} entries={user.entries} />
                  <ImageLinkForm
                    onButtonSubmit={onButtonSubmit}
                    onInputChange={onImageUrlChange}
                  />
                  <FaceRecognetion
                    imgSrc={imageUrl}
                    faceBoxes={faceBoxesLocations}
                  />
                </div>
              )}
            </Route>
          </Switch>
        </>
      )}
    </main>
  );
};

export default App;
