import React, { useEffect, useState } from 'react';
import './App.css';
import Navigation from "./components/navigation/Navigation";
import Particles from 'react-particles-js';
import ImageLinkForm from './components/imageLinkForm/ImageLinkForm';
import Rank from './components/rank/Rank';
import FaceRecognetion from './components/FaceRecognetion/FaceRecognetion';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import { Route, Switch, Redirect } from "react-router-dom";
import PrivateRoute from './components/PrivateRoute';


const particlesOptions = {
  particles: {
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 400
      }
    }
  }
}





const App = () => {

  const [input, setInput] = useState('');        //app states
  const [imageUrl, setImageUrl] = useState('');
  const [box, setBox] = useState([]);
  const [signedIn, setSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "0",
    name: 'Guest',
    email: '',
    joined: '',
    entries: '0',
  });


  const calculateBoxLocation = (box) => {                 //recieves the bounding box array from the server, then calculates where the box should display.
    const image = document.getElementById("mainimg");
    const width = Number(image.width);
    const height = Number(image.height);
    return ({
      bottom_row: ((1 - box.bottom_row) * height),
      top_row: (box.top_row * height),
      left_col: (box.left_col * width),
      right_col: ((1 - box.right_col) * width),
    })

  }

  const loggedInUser = sessionStorage.getItem("user");
  const foundUser = JSON.parse(loggedInUser);

  useEffect(() => {
    if (signedIn) //if the user just signed in, after mounting user would be stored in session storage
    { sessionStorage.setItem('user', JSON.stringify(user)) }
    else {
      if (loggedInUser) { loadUser(foundUser) }     //if the user isn't signed in, but is stored in the session storage, load the user and sign in
    };       //useEffect works in a way that everytime the component updates, what's inside it gets run.
  })


  const onInputChange = (event) => {
    setInput(event.target.value)
  }

  const loadUser = (data) => {            //passed to sign in; to load the user after sign in, and to Navigation to load intial state when using Sign out or guest  
    const { id, name, email, joined, entries } = data;
    setUser({
      id: id,
      name: name,
      email: email,
      joined: joined,
      entries: entries,
    })
    setSignedIn(true)
    setImageUrl("");
  }

  const signOut = () => {        //called when sign out is pressed in Navigation Component
    setUser({
      id: "0",
      name: 'Guest',
      email: '',
      joined: '',
      entries: '0',
    })
    setSignedIn(false);
    setImageUrl("");
  }

  const onButtonSubmit = () => {
    setImageUrl(input);
    fetch("imageurl",        //returns face detection data from clarifai.
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          {
            input: input
          })
      }
    )
      .then(res =>res.json())
     
      .then(response => {
        const BoundingBoxesArray = response.outputs[0].data.regions.map(region => region.region_info.bounding_box);
        // this gives us an array that has the bounding dimentions
        const Boxes = BoundingBoxesArray.map(box => calculateBoxLocation(box));
        // this gives us an array "Boxes" that has the calculated Pixel Locations by passing each box in the array through the calculateBoxLocation function above.
        setBox(Boxes);
        // we wanna map through this to display a number of <div> each with a box inside.
        // console.log(box);

      })
      .then(res => {               // we wanna fetch a put method to server after recieving a response to get and update entries.
        if (user.id !== '0') {              //we don't want to update entries for guests (They have an id of 0).
          fetch("image",
            {
              method: "put",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(
                {
                  id: user.id

                })
            }
          )
            .then(res => res.json())                          // the response is gonna be the number of entries the user has
            .then(count => setUser({ ...user, entries: count }));
          //or  setUser(Object.assign(user, { entries: count }))
        }
      })


      .catch(err => {
        console.log(err, "couldn't fetch image!");
      });
  }


  return (

    <main className="App">

      <Particles className="Particles"
        params={particlesOptions} />

      <Navigation signOut={signOut} />

      <Switch>

        <Route path="/signin">


          <SignIn loadUser={loadUser} loggedIn={signedIn} />



        </Route>

        <Route path="/register">
          {signedIn ?
            <Redirect to={{ pathname: "/home" }} />
            :
            <Register />
          }


        </Route>

        <PrivateRoute path="/home" signedIn={signedIn} foundUser={foundUser}>
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm onButtonSubmit={onButtonSubmit} onInputChange={onInputChange} />
          <FaceRecognetion imgSrc={imageUrl} box={box} />

        </PrivateRoute>

        <Route path="/">

          {signedIn ?
            <Redirect to={{ pathname: "/home" }} />
            : <div>
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm onButtonSubmit={onButtonSubmit} onInputChange={onInputChange} />
              <FaceRecognetion imgSrc={imageUrl} box={box} />
            </div>
          }

        </Route>
      </Switch>

    </main>
  );
}



export default App;
