import React, { useEffect, useState } from "react";
import HomeNavigationCustomer from "../navigations/homeNavigationCustomer";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { AiFillFileImage } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
//assets
import currentImg from "./../../assets/main/confectioner1.jpg";
import closedEye from "./../../assets/items/closed-eye.png";
import openedEye from "./../../assets/items/opened-eye.png";

const personalProfileCustomer = () => {
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("id");
      setToken(token);
      setId(userId);
      if (!token) {
        navigate("/");
      } else {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          navigate("/");
          return;
        }
        try {
          const response = await axios.get(
            `http://localhost:5000/auth/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data);
          setLogin(response.data.username || "");
          setAge(response.data.age || "");
          setName(response.data.name || "");
          setLink(response.data.imgLink || "");
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, []);
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [newToken, setToken] = useState("");
  const [name, setName] = useState("");
  const [login, setLogin] = useState("");
  const [age, setAge] = useState("");
  const [userImg, setUserImg] = useState("");
  const [error, setError] = useState("");
  const [typeImg, setTypeImg] = useState("Uploading");
  const [imgUploaded, setImgUploaded] = useState(0);
  const [linkImg, setLink] = useState("");
  const [password, setPassword] = useState("");
  const [uploadedFileName, setFileName] = useState("Файл не выбран");
  const [linkStatus, setLinkStatus] = useState("empty");
  const [profileDate, setProfileDate] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const truncateString = (str) => {
    if (str.length > 25) {
      return str.slice(0, 25) + "...";
    }
    return str;
  };
  useEffect(() => {
    setProfileDate({ img: currentImg });
  }, []);
  useEffect(() => {
    const img = new Image();
    const handleLoad = () => {
      if (img.width > 0 && img.height > 0) {
        setLinkStatus("Right");
      } else {
        setLinkStatus("Wrong");
      }
    };
    const handleError = () => {
      setLinkStatus("Wrong");
    };

    if (linkImg !== "") {
      img.addEventListener("load", handleLoad);
      img.addEventListener("error", handleError);
      img.src = linkImg;
      return () => {
        img.removeEventListener("load", handleLoad);
        img.removeEventListener("error", handleError);
      };
    } else {
      setLinkStatus("Empty");
    }
  }, [linkImg]);
  //img

  const updateData = async () => {
    const data = {
      username: login,
    };
    console.log(data);
    console.log(newToken);
    console.log(id);
    const config = {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    };
    try {
      const response = await axios.put(
        `http://localhost:5000/auth/update-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
          updatedUserData: {
            username: login,
            age: age,
            name: name,
            imgLink: linkImg,
            password: password,
          },
        }
      );
      console.log(response);
      alert("Данные успешно обновлены");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="wrapper profile-wrapper">
      <HomeNavigationCustomer></HomeNavigationCustomer>
      <div className="profile-container">
        <h2 className="profile-title">Ваш профиль</h2>
        <div className="profile-items">
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          ></input>
          <input
            type="number"
            placeholder="Возраст"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          ></input>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          ></input>
          <div className="input-pass">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <img
              src={showPassword ? openedEye : closedEye}
              onClick={() => setShowPassword(!showPassword)}
              alt=""
            />
          </div>
        </div>
        <div className="img-container">
          <h3 style={{ textAlign: "center" }}>Аватар</h3>
          {/* <img
            src={
              linkImg
                ? linkImg
                : "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
            }
            alt=""
            className="avatar"
          /> */}
          <FormControl
            style={{
              width: "100%",
            }}
          >
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              defaultValue="Uploading"
              name="row-radio-buttons-group"
              onChange={(e) => setTypeImg(e.target.value)}
              style={{
                padding: 10,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <FormControlLabel
                value="Uploading"
                control={<Radio style={{ color: "orange" }} />}
                label="Напрямую"
              />
              <FormControlLabel
                value="Link"
                control={<Radio style={{ color: "orange" }} />}
                label="Через ссылку"
              />
            </RadioGroup>
          </FormControl>
          <div className="img-main">
            {typeImg === "Uploading" ? (
              <div className="upload-wrapper">
                <form
                  className="uploader"
                  action=""
                  onClick={() => document.querySelector("#profile-img").click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    id="profile-img"
                    className="input-field"
                    hidden
                    onChange={({ target: { files } }) => {
                      files[0] && setFileName(truncateString(files[0].name));
                      if (files) {
                        setImgUploaded(URL.createObjectURL(files[0]));
                      }
                    }}
                  ></input>
                  {imgUploaded ? (
                    <img
                      src={imgUploaded}
                      className="img"
                      width={300}
                      height={300}
                      alt={uploadedFileName}
                    />
                  ) : (
                    <>
                      <MdCloudUpload color="orange" size={60} />
                      <p>Ваше изображение</p>
                    </>
                  )}
                </form>
                <div className="uploaded-row">
                  <AiFillFileImage
                    size={30}
                    color="orangered"
                  ></AiFillFileImage>
                  <div className="uploaded-row-info">
                    <span>{uploadedFileName}</span>
                    <MdDelete
                      size={30}
                      onClick={() => {
                        setFileName("Файл не выбран");
                        setImgUploaded("");
                      }}
                      className="delete-item"
                    ></MdDelete>
                  </div>
                </div>
              </div>
            ) : (
              <div className="loading-wrapper">
                <div className="user-box">
                  <input
                    type="text"
                    name=""
                    value={linkImg}
                    onChange={(e) => setLink(e.target.value)}
                    className="form-field animation a4 input"
                    required
                  ></input>
                  <label>Ссылка на изображение</label>
                  {linkStatus === "Wrong" && (
                    <span className="error link-error">
                      Некорректная ссылка
                    </span>
                  )}
                  {linkStatus === "Right" && (
                    <img
                      src={linkImg}
                      className="link-img"
                      value={userImg}
                      onChange={(e) => setUserImg(e.target.value)}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <button onClick={updateData} className="button">
          Изменить
        </button>
        <span>{error}</span>
      </div>
    </div>
  );
};

export default personalProfileCustomer;
