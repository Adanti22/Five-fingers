import React, { useState } from "react";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";

const Uploader = () => {
  const [img, setImg] = useState(0);
  const [fileName, setFileName] = useState("Файл не выбран");

/*   const [imgUploaded, setImgUploaded] = useState(0);
  const [uploadedFileName, setFileName] = useState("Файл не выбран"); */
  const truncateString = (str) => {
    if (str.length > 25) {
      return str.slice(0, 25) + "...";
    }
    return str;
  };
  return (
    <div className="upload-wrapper">
      <form
        className="uploader"
        action=""
        onClick={() => document.querySelector(".input-field").click()}
      >
        <input
          type="file"
          accept="image/*"
          className="input-field"
          hidden
          onChange={({ target: { files } }) => {
            files[0] && setFileName(truncateString(files[0].name));
            if (files) {
              setImg(URL.createObjectURL(files[0]));
            }
          }}
        />
        {img ? (
          <img
            src={img}
            className="img"
            width={300}
            height={300}
            style={{ objectFit: "cover" }}
            alt={fileName}
          />
        ) : (
          <>
            <MdCloudUpload color="orange" size={60} />
            <p>Добавьте фото желаемого дизайна</p>
          </>
        )}
      </form>
      <div className="uploaded-row">
        <AiFillFileImage size={30} color="orangered"></AiFillFileImage>
        <div className="uploaded-row-info">
          <span>{fileName}</span>
          <MdDelete
            size={30}
            onClick={() => {
              setFileName("Файл не выбран");
              setImg("");
            }}
            className="delete-item"
          ></MdDelete>
        </div>
      </div>
    </div>
  );
};

export default Uploader;
