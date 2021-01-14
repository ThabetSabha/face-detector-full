import React, { useEffect, useState } from "react";
import "./App.css";
import Navigation from "./components/navigation/Navigation";
import Particles from "react-particles-js";
import ImageLinkForm from "./components/imageLinkForm/ImageLinkForm";
import Rank from "./components/rank/Rank";
import FaceRecognetion from "./components/FaceRecognetion/FaceRecognetion";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import { Route, Switch, Redirect } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";

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

  const loggedInUser = sessionStorage.getItem("user");
  const foundUser = JSON.parse(loggedInUser);

  useEffect(() => {
    //if the user just signed in, after mounting user would be stored in session storage
    if (signedIn) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      //if the user isn't signed in, but is stored in the session storage, load the user and sign in
      if (loggedInUser) {
        loadUser(foundUser);
      }
    }
  });

  const onImageUrlChange = (event) => {
    setInput(event.target.value);
  };

  //passed to sign in; to load the user after sign in, and to Navigation to load intial state when using Sign out or guest
  const loadUser = (data) => {
    const { id, name, email, joined, entries } = data;
    setUser({
      id: id,
      name: name,
      email: email,
      joined: joined,
      entries: entries,
    });
    setSignedIn(true);
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
  };

  //When user submits the image
  const onButtonSubmit = () => {
    setImageUrl(input);
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
  };

  return (
    <main className="App">
      <Particles className="Particles" params={particlesOptions} />

      <Navigation signOut={signOut} />

      <Switch>
        <Route path="/signin">
          <SignIn loadUser={loadUser} loggedIn={signedIn} />
        </Route>

        <Route path="/register">
          {signedIn ? <Redirect to={{ pathname: "/home" }} /> : <Register />}
        </Route>

        <PrivateRoute path="/home" signedIn={signedIn} foundUser={foundUser}>
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onButtonSubmit={onButtonSubmit}
            onInputChange={onImageUrlChange}
          />
          <FaceRecognetion imgSrc={imageUrl} faceBoxes={faceBoxesLocations} />
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
    </main>
  );
};

export default App;
