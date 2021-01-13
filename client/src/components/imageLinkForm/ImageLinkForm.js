import React from "react";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div className="">
      <p className="f3">
        {"This website uses an API to detects faces, give it a try!"}
      </p>

      <div
        style={{
          backgroundColor: "rgb(100,100,100,0.2)",
          minWidth: "300px",
          display: "flex",
          flexWrap: "wrap",
        }}
        className=" w-40 center pa4 pt3 br3 shadow-5"
      >
        <label
          htmlFor="imageUrlInput"
          style={{ textAlign: "left", fontSize: "1.1rem" }}
          className="w-100 mb3 "
        >
          Insert the image URL here :
        </label>
        <div style={{ display: "flex", width: "100%" }}>
          <input
            id="imageUrlInput"
            name="imageUrlInput"
            placeholder="eg: https://i.pinimg.com/face.jpg"
            type="text"
            className="f4 pa2 center w-70"
            onChange={onInputChange}
          ></input>
          <button
            className="w-30 f4 link ph3 grow pv2"
            onClick={onButtonSubmit}
            style={{ minWidth: "100px" }}
          >
            {" "}
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
