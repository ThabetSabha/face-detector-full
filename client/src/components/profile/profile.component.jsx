import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import "./profile.styles.css";
import ImageInput from "../ImageInput/image-input.component";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const Profile = ({ user, loadUser, token }) => {
  const [userInfo, setUserInfo] = useState({
    name: user.name,
    age: user.age,
    entries: user.entries,
    joined: user.joined,
    avatars3key: user.avatars3key,
  });

  const [redirct, setRedirect] = useState(false);

  const { name, entries, joined, avatars3key } = userInfo;

  const [imageData, setImageData] = useState(null);

  //This is the endpoint for a lambda function that can be used to upload avatars to s3 bucket
  //** has CORS to only allow access to "https://demo-face-detector.herokuapp.com/" so it won't work in dev.
  //Lambda function used is in lambdas folder in src.
  const lambdaUploadAvatarEndpoint =
    "https://k5lzx1wej1.execute-api.me-south-1.amazonaws.com/default/upload-avatar";

  const uploadAvatarToS3 = async () => {
    const { image, file } = imageData;
    try {
      //fetch the serverless function to get a presigned s3 URL
      const lambdaRes = await fetch(`${lambdaUploadAvatarEndpoint}`, {
        method: "post",
        body: JSON.stringify({
          keyID: 1,
        })
      });
      const lambdaResData = await lambdaRes.json();
      const imageUploadUrl = lambdaResData.uploadURL;
      const imageUploadName = lambdaResData.photoFilename;

      //turn file into blobData
      let binary = atob(image.split(",")[1]);
      let array = [];
      for (var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
      }
      let blobData = new Blob([new Uint8Array(array)], { type: "image/jpeg" });

      //fetch the presigned url with blobData (store file in S3)
      await fetch(`${imageUploadUrl}`, {
        method: "put",
        headers: { "Content-Type": `${file.type}` },
        body: blobData,
      });

      setUserInfo({
        ...userInfo,
        avatars3key: imageUploadName,
      });

      return imageUploadName;
    } catch (error) {
      console.log(error);
    }
  };

  const onInputChange = (event) => {
    let value = event.target.value;
    let fieldName = event.target.name;
    setUserInfo({ ...userInfo, [fieldName]: value });
  };

  //When Submitting, validate input, then check if an image should be uploaded, then send new data to server
  const onSubmit = async () => {
    let formAvatarS3Key;
    let formName;
    let oldAvatarKey;
    if (
      (!name && !imageData?.image) ||
      (!imageData?.image && name === user.name)
    ) {
      return;
    }

    if (imageData?.image) {
      oldAvatarKey = user.avatars3key;
      formAvatarS3Key = await uploadAvatarToS3();
    }

    if (name && name.toLowerCase() !== user.name.toLowerCase()) {
      formName = name;
    }

    fetch(`/profile/${user.id}`, {
      method: "put",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({
        formInput: {
          name: formName,
          avatars3key: formAvatarS3Key,
        },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data === "success") {
          if (oldAvatarKey && oldAvatarKey !== "avatar.png") {
            deleteOldAvatar(oldAvatarKey);
          }
          let avatar = formAvatarS3Key ? formAvatarS3Key : avatars3key;
          loadUser({ ...user, name, avatars3key: avatar });
          setRedirect(true);
        } else {
          console.log("error changing user info");
        }
      })
      .catch((err) => console.log(err));
  };

  //fetches an aws lambda fucntion that deletes the s3 object with the specified key.
  //** has CORS configured to only allow access to "https://demo-face-detector.herokuapp.com/" so it won't work in dev.
  //Lambda function used is in lambdas folder in src.
  const deleteOldAvatar = (key) => {
    fetch(
      "https://q0c1sv05il.execute-api.me-south-1.amazonaws.com/default/delete-avater",
      {
        method: "post",
        body: JSON.stringify({
          deleteKey: key,
        }),
      }
    );
  };

  return (
    <>
      {redirct ? <Redirect to="/home" /> : null}
      <div className="profile-main" style={{ marginTop: "-2rem" }}>
        <article className="br2 shadow-1 ba dark-gray b--black-10 mv4 w-90 w-60-m w-60-l mw6 center">
          <main className="pa4 black-80 w-80">
            <img
              src={`https://face-detector-avatars.s3.me-south-1.amazonaws.com/${user.avatars3key}`}
              className="br-100 h3 w3 dib"
              alt="avatar"
              style={{ objectFit: "cover" }}
            />
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
              className="profile-input pa2 input-reset ba b--black bg-transparent hover-bg-black hover-white w-100 mb3"
              placeholder="eg: John"
            ></input>
            <ImageInput setImageData={setImageData} />
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
