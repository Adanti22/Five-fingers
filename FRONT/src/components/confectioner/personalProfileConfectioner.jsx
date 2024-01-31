import React, { useEffect, useState } from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import HomeNavigationConfectioner from "../navigations/homeNavigationConfectioner";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
//assets
import currentImg from "./../../assets/main/confectioner1.jpg";
import closedEye from "./../../assets/items/closed-eye.png";
import openedEye from "./../../assets/items/opened-eye.png";

const PersonalProfileConfectioner = () => {
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
          setSpec(response.data.specialization || []);
          setPrice(response.data.price || "");
          setDescription(response.data.description || "");
          setExperience(response.data.experience || "");
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, []);
  const [id, setId] = useState("");
  const [newToken, setToken] = useState("");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [login, setLogin] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [typeImg, setTypeImg] = useState("Link");
  const [imgUploaded, setImgUploaded] = useState(0);
  const [linkImg, setLink] = useState("");
  const [password, setPassword] = useState("");
  const [uploadedFileName, setFileName] = useState("Файл не выбран");
  const [linkStatus, setLinkStatus] = useState("empty");
  const [showPassword, setShowPassword] = useState(false);
  const [specialization, setSpec] = useState([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [experience, setExperience] = useState("");
  const [descriptionHeight, setDescriptionHeight] = useState({
    height: "auto",
  });
  const truncateString = (str) => {
    if (str.length > 25) {
      return str.slice(0, 25) + "...";
    }
    return str;
  };

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
    console.log(linkStatus);
    if (name && age && price && experience && description) {
      if (name.length < 3) {
        setError("Имя должно быть не короче 3 символов");
        return;
      }
      if (age > 100 || age < 10) {
        setError("Некорректный возраст");
        return;
      }
      if (!linkStatus === "right") {
        setError("Укажите валидную ссылку для фото");
        return;
      }
      if (specialization.length == 0) {
        setError("Укажите вашу специализацию");
        return;
      }

      const regex = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/^-]+$/;
      const minLength = 5;
      const validatePass = (pass) => {
        const latinLetterRegex = /[a-zA-Z]/;
        const digitRegex = /\d/;
        const symbolRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/^-]/;

        const hasLatinLetter = latinLetterRegex.test(pass);
        const hasDigit = digitRegex.test(pass);
        const hasSymbol = symbolRegex.test(pass);

        return hasLatinLetter && hasDigit && hasSymbol;
      };
      if (password.length > 0) {
        if (password.length < minLength) {
          setError("*Минимальная длина пароля: 5 символов");
        } else {
          if (!regex.test(password)) {
            setError(
              "*В пароле допустимы только цифры, знаки и латинские буквы"
            );
          } else {
            if (validatePass(password)) {
              setError("");
            } else {
              setError("В пароле должны быть: символ, буква,цифра");
            }
          }
        }
      } else {
        setError("Введите пароль");
        return;
      }
    } else {
      setError("Заполните поля");
      return;
    }

    try {
      /* username
password
name
roles
age
imgLink
specialization
price
description
experience */
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
            specialization: specialization,
            price: price,
            description: description,
            experience: experience,
          },
        }
      );
      console.log(response);
      alert("Данные успешно обновлены");
      navigate("/home/confectioner");
    } catch (error) {
      console.log(error);
    }
  };
  const specs = [
    "Пекарь-кондитер",
    "Кондитер-технолог",
    "Шоколатье",
    "Конфетчик",
    "Леденщик",
    "Веган-кондитер",
    "ПП-кондитер",
    "Декоратор-художник",
  ];
  const handleAutocompleteChange = (event, values) => {
    setSpec(values);
  };
  const handleTextareaChange = (value, setValue, setHeight) => (e) => {
    setValue(e.target.value);
    setHeight({ height: "auto" });
    const newHeight = e.target.scrollHeight + "px";
    setHeight({ height: newHeight });
  };

  const handleTextareaBlur = (value, setHeight) => () => {
    if (value.trim() === "") {
      setHeight({ height: "auto" });
    }
  };
  return (
    <div className="wrapper profile-wrapper">
      <HomeNavigationConfectioner></HomeNavigationConfectioner>
      <div className="profile-container">
        <h2 className="profile-title">Ваш профиль</h2>
        <div className="profile-items">
          <div className="input-box">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Имя</label>
          </div>
          <div className="input-box">
            <input
              type="number"
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <label>Возраст</label>
          </div>
          <div className="input-box">
            <input
              required
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
            <label>Логин</label>
          </div>
          <div className="input-pass input-box">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Пароль</label>
            <img
              src={showPassword ? openedEye : closedEye}
              onClick={() => setShowPassword(!showPassword)}
              alt=""
            />
          </div>
          <div className="input-box">
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(+e.target.value)}
            />
            <label>Цены от:</label>
          </div>
          <div className="input-box">
            <input
              type="number"
              required
              value={experience}
              onChange={(e) => setExperience(+e.target.value)}
            />
            <label>Стаж</label>
          </div>
          {/* <input
            type="text"
            placeholder="Специализация (через запятую)"
            value={specialization}
            onChange={(e) => setSpec(e.target.value)}
          />

          <input
            type="text"
            placeholder="Информация о вас"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          /> */}
          <Stack
            spacing={2}
            sx={{
              width: 500,
              borderBottom: "none",
              position: "relative",
              background: "transparent",
            }}
          >
            <Autocomplete
              multiple
              id="tags-filled"
              options={specs.map((option) => option)}
              value={specialization}
              style={{
                borderBottom: "none",
                background: "transparent",

                outline: "none",
              }}
              freeSolo
              onChange={handleAutocompleteChange}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    style={{
                      background: "transparent",
                      border: "1px solid orangered",
                    }}
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="Ваша специализация"
                  style={{
                    background: "transparent",
                    border: "1px solid orangered",
                  }}
                  placeholder="я:"
                />
              )}
            />
          </Stack>
          <div className="area-box">
            <textarea
              className="textarea"
              onChange={handleTextareaChange(
                description,
                setDescription,
                setDescriptionHeight
              )}
              onBlur={handleTextareaBlur(description, setDescriptionHeight)}
              style={descriptionHeight}
              required
              value={description}
            ></textarea>
            <label>Дополнительная информация</label>
          </div>
        </div>
        <div className="img-container">
          <h3 style={{ textAlign: "center" }}>Аватар</h3>
          <FormControl
            style={{
              width: "100%",
            }}
          >
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              defaultValue="Link"
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
                  />
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
                  />
                  <label>Ссылка на изображение</label>
                  {linkStatus === "Wrong" && (
                    <span className="error link-error">
                      Некорректная ссылка
                    </span>
                  )}

                  {linkStatus === "Right" && (
                    <img
                      src={
                        linkImg.length > 10
                          ? linkImg
                          : "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
                      }
                      className="link-img"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <button className="button" onClick={updateData}>
          Изменить
        </button>
        <span style={{ color: "red" }}>{error}</span>
      </div>
    </div>
  );
};

export default PersonalProfileConfectioner;
