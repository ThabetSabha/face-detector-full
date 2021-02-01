import React, { useState } from "react";

const ImageInput = ({ setImageData }) => {
  const [inputStatus, setInputStatus] = useState("");

  // When run this checks if file is valid, then calls createImage
  const updateAvatar = async (e) => {
    let input = e.target;
    const curFiles = input.files;
    if (curFiles.length === 0) {
      setInputStatus("No files currently selected for upload");
      setImageData(null);
    } else {
      let file = curFiles[0];
      if (file.size > 1048576) {
        setInputStatus("Please make sure the file is under 1MB");
        setImageData(null);
      } else {
        if (validFileType(file)) {
          setInputStatus(
            `File name ${file.name}, file size ${returnFileSize(file.size)}.`
          );
          createImage(file);
        } else {
          setInputStatus(
            `File name ${file.name}: Not a valid file type. Update your selection.`
          );
          setImageData(null);
        }
      }
    }
  };

  //takes a file and then calls the setAvatar(fromProps) byt passing the blob from the file and the file.
  const createImage = (file) => {
    let reader = new FileReader();
    reader.onload = (e) => {
      setImageData({ image: e.target.result, file });
    };
    reader.readAsDataURL(file);
  };

  const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
  ];

  function validFileType(file) {
    return fileTypes.includes(file.type);
  }

  function returnFileSize(number) {
    if (number < 1024) {
      return number + "bytes";
    } else if (number >= 1024 && number < 1048576) {
      return (number / 1024).toFixed(1) + "KB";
    } else if (number >= 1048576) {
      return (number / 1048576).toFixed(1) + "MB";
    }
  }

  return (
    <>
      <div
        className=" pv0 input-reset ba b--black bg-transparent pointer f8 dib mb1 w-100 flex"
        style={{ overflow: "hidden", alignItems: "center" }}
      >
        <label
          htmlFor="avatar"
          className="pointer w-100 ma0 "
          style={{ height: "35px" }}
        >
          Choose a profile picture:
        </label>
        <input
          type="file"
          id="avatar"
          name="avatar"
          accept="image/jpeg, image/jpg, image/png"
          onChange={updateAvatar}
          style={{ display: "none" }}
        />
      </div>
      <div className="ml2" style={{ fontSize: "12px " }}>
        {inputStatus}
      </div>
    </>
  );
};

export default ImageInput;
