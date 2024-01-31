import React, { useEffect, useState } from "react";
import HomeNavigationCustomer from "../navigations/homeNavigationCustomer";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

import Uploader from "../items/Uploader";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";
//

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const OrderForm = () => {
  const { confectionerId } = useParams();
  useEffect(() => {
    if (confectionerId) {
      console.log(`Form for order with id: ${id}`);
    } else {
      console.log("General order form");
    }
  }, [confectionerId]);
  const navigate = useNavigate();
  useEffect(() => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("accessToken");
    setToken(token);
    setId(userId);
    if (!userId) {
      navigate("/");
    } else {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        navigate("/");
        return;
      }
    }
  }, []);
  const [error, setError] = useState("");
  //values
  const [nameOfProduct, setNameOfProduct] = useState("");
  const [inscription, setNameInscription] = useState("");
  const [weight, setWeight] = useState("");
  const [count, setCount] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(dayjs());
  const [prohibitedIngredients, setProhibitedIngredients] = useState("");
  const [description, setDescription] = useState("");
  const [dateErrorStyle, setDateErrorStyle] = useState({ opacity: 0 });
  //
  const [imgUploaded, setImgUploaded] = useState(0);
  const [linkImg, setLink] = useState("");

  const [PIHeight, setPIHeight] = useState({ height: "auto" });

  const [descriptionHeight, setDescriptionHeight] = useState({
    height: "auto",
  });
  //img
  const [imgType, setType] = useState("Uploading"); /* Uploading */
  //Uploading

  const [uploadedFileName, setFileName] = useState("Файл не выбран");
  //link
  const [newToken, setToken] = useState("");
  const [id, setId] = useState("");
  const [linkStatus, setLinkStatus] = useState("empty");
  const checkDate = () => {
    const currentDate = dayjs();
    const selectedDate = date.format("YYYY-MM-DD");
    console.log(selectedDate);
    const isPastDate = dayjs(selectedDate).isBefore(currentDate, "day");
    if (isPastDate) {
      setDateErrorStyle({ opacity: 1 });
    } else {
      setDateErrorStyle({ opacity: 0 });
    }
  };
  const truncateString = (str) => {
    if (str.length > 25) {
      return str.slice(0, 25) + "...";
    }
    return str;
  };
  //effects
  // useEffect(() => {
  //   console.log(linkImg);
  //   if (linkImg !== "") {
  //     img.src = linkImg;
  //     if (img.complete && img.width > 0 && img.height > 0) {
  //       setLinkStatus("Right");
  //       console.log("asd");
  //     } else {
  //       setLinkStatus("Wrong");
  //     }
  //   } else {
  //     setLinkStatus("Empty");
  //   }
  // }, [linkImg]);
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

  /*   try {
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
            info: info,
          },
        }
      );
      console.log(response);
      alert("Данные успешно обновлены");
    } catch (error) {
      console.log(error);
    } */
  const makeOrder = async () => {
    // setError("Заполните все поля");
    if (confectionerId) {
      try {
        const response = await axios.post(
          `http://localhost:5000/auth/add-close-order`,
          {
            customer: id,
            data: {
              orderName: nameOfProduct,
              inscription: inscription,
              weight: weight,
              count: count,
              price: price,
              prohibitedIngredients: prohibitedIngredients,
              img: linkImg,
              description: description,
              date: date.format("YYYY-MM-DD"),
            },
            Status: "AwaitingConfResponse",
            confectioners: [
              {
                confectioner: confectionerId,
                confectionerStatus: "ResponseReceived",
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          }
        );
        alert(response.data.message);
        navigate("/customer/orders");
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const response = await axios.post(
          `http://localhost:5000/auth/add-open-order`,
          {
            customer: id,
            data: {
              orderName: nameOfProduct,
              inscription: inscription,
              weight: weight,
              count: count,
              price: price,
              prohibitedIngredients: prohibitedIngredients,
              img: linkImg,
              description: description,
              date: date.format("YYYY-MM-DD"),
            },
            Status: "AwaitingResponses",
            confectioners: [],
          },
          {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          }
        );
        alert(response.data.message);
        navigate("/customer/orders");
      } catch (e) {
        console.log(e);
      }
    }

    // newToken
    // id
  };

  return (
    <div className="wrapper wrapper-order-form">
      <HomeNavigationCustomer></HomeNavigationCustomer>
      <div className="form-container">
        <h2 className="order-form-title">Сделайте заказ!</h2>
        <div action="" className="form-item">
          <div className="form-item-form">
            <div className="user-box ">
              <input
                type="text"
                name=""
                className="form-field animation a3 input"
                required
                value={nameOfProduct}
                onChange={(e) => setNameOfProduct(e.target.value)}
              />
              <label>Название</label>
            </div>
            <div className="user-box">
              <input
                type="text"
                name=""
                className="form-field animation a4 input"
                required
                value={inscription}
                onChange={(e) => setNameInscription(e.target.value)}
              />
              <label>Надпись на изделии</label>
            </div>
            <div className="user-box">
              <input
                type="number"
                name=""
                className="form-field animation a4 input"
                required
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
              <label>Вес изделия (кг)</label>
            </div>
            <div className="user-box">
              <input
                type="number"
                name=""
                className="form-field animation a4 input"
                required
                value={count}
                onChange={(e) => setCount(e.target.value)}
              />
              <label>Количество</label>
            </div>
            <div className="user-box">
              <input
                type="number"
                name=""
                className="form-field animation a4 input"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
              <label>Предлагаемая цена</label>
            </div>
            <div className="date-box">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DateField"]}>
                  <DateField
                    label="День доставки (М/Д/Г)"
                    onBlur={checkDate}
                    value={date}
                    onChange={(value) => setDate(value)}
                  />
                </DemoContainer>
              </LocalizationProvider>
              <span style={dateErrorStyle}>Некорректная дата</span>
            </div>
          </div>
          <div className="form-item-form">
            <div className="img-container">
              <h3 style={{ textAlign: "center" }}>Добавьте изображение</h3>
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
                  onChange={(e) => setType(e.target.value)}
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
                {imgType === "Uploading" ? (
                  <div className="upload-wrapper">
                    <form
                      className="uploader"
                      action=""
                      onClick={() =>
                        document.querySelector("#order-img").click()
                      }
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="input-field"
                        id="order-img"
                        hidden
                        onChange={({ target: { files } }) => {
                          files[0] &&
                            setFileName(truncateString(files[0].name));
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
                          <p>Добавьте фото желаемого дизайна</p>
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
                        <img src={linkImg} className="link-img" />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="textareas">
              <div className="area-box">
                <textarea
                  className="textarea"
                  onChange={handleTextareaChange(
                    prohibitedIngredients,
                    setProhibitedIngredients,
                    setPIHeight
                  )}
                  onBlur={handleTextareaBlur(
                    prohibitedIngredients,
                    setPIHeight
                  )}
                  style={PIHeight}
                  required
                  value={prohibitedIngredients}
                ></textarea>
                <label>Запрещенные ингридиенты</label>
              </div>
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
          </div>
          <div className="btn-container">
            <button className="animation a6 button" onClick={makeOrder}>
              Отправить заказ
            </button>
            <span className="error">{error}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
/* {
   status: "Отказано",
   orderDate: "02-02-2023",
   deadlineDate: "02-12-2023",
   price: 13500,
   name: "Наполеон",
   weight: 3,
   color: "Черный",
   confId: 123,
   dontUseIngredients: "Арахис",
   description:
     "Торт на день рождения 10 лет. Сделайте как на фото, добавьте надпись посередине",
   text: "10 лет",
   design:
     "https://cupcake.com.ua/wp-content/uploads/2021/04/photo_2021-04-05_20-34-02.jpg",
 }, */
