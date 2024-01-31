import React, { useEffect, useState } from "react";
import HomeNavigation from "../navigations/homeNavigationCustomer";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const HomePageCustomer = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/");
      } else {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          navigate("/");
          return;
        }
        try {
          const response = await axios.get("http://localhost:5000/auth/users", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(response.data);
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, []);

  const categories = [
    "Пекарь-кондитер",
    "Кондитер-технолог",
    "Шоколатье",
    "Конфетчик",
    "Леденщик",
    "Веган-кондитер",
    "ПП-кондитер",
  ];

  const confs = [
    {
      name: "Кондитер 1",
      age: 20,
      experience: 1999,
      priceFrom: 2000,
      rating: 4.6,
      img: "https://agzamov.com/img/agzamov1.jpg",
      categories: ["Пекарь-кондитер", "Кондитер-технолог"],
      info: "Ренат Агзамов родился 13 апреля 1981 года в Сочи. С детства интересовался искусством приготовления пищи, свой первый кекс испек в 7 лет. После окончания школы в Сочи отучился в местном кулинарном училище. Параллельно с этим вместе с младшим братом серьезно занимался спортом, даже завоевал титул чемпиона России по боксу. Однако со спортивной карьерой завязал, сделав выбор в сторону кондитерского мастерства.",
    },
    {
      name: "Кондитер 2",
      age: 30,
      experience: 1999,
      priceFrom: 2000,
      rating: 4.7,
      img: "https://agzamov.com/img/agzamov1.jpg",
      categories: ["ПП-кондитер", "Веган-кондитер"],
      info: "«Моя бабушка посвящала меня в свои кулинарные секреты. Да и мой отец, в прошлом шеф-повар вагона-ресторана, всегда готовил. Я вырос в атмосфере большой любви к приготовлению пищи. Когда мне было 5-6 лет, отец нас с братом приучал правильно пользоваться ножами и другими кухонными инструментами. Это у нас семейное»",
    },
    {
      name: "Ренат Агзамов",
      age: 32,
      experience: 1999,
      priceFrom: 2500,
      rating: 4.7,
      img: "https://agzamov.com/img/agzamov1.jpg",
      categories: [
        "ПП-кондитер",
        "Веган-кондитер",
        "Пекарь-кондитер",
        "Кондитер-технолог",
        "Шоколатье",
        "Конфетчик",
        "Леденщик",
        "Веган-кондитер",
        "ПП-кондитер",
      ],
      info: "«Моя бабушка посвящала меня в свои кулинарные секреты. Да и мой отец, в прошлом шеф-повар вагона-ресторана, всегда готовил. Я вырос в атмосфере большой любви к приготовлению пищи. Когда мне было 5-6 лет, отец нас с братом приучал правильно пользоваться ножами и другими кухонными инструментами. Это у нас семейное»",
    },
  ];

  const sendOrder = (id) => {
    console.log(id);
    navigate(`/order/form/${id}`);
  };

  return (
    <div className="wrapper wrapper-home home-customer">
      <HomeNavigation></HomeNavigation>
      <div className="users-container">
        {users.map((item, key) => {
          // Проверяем наличие фотографии
          if (!item.imgLink) {
            return null;
          }
          if (!item.roles.includes("CONFECTIONER")) {
            return null;
          }
          return (
            <div key={item._id} className="user-item">
              <div className="user-info-categories">
                {item.specialization.map((i) => (
                  <div className="categories-item" key={i}>
                    {i}
                  </div>
                ))}
              </div>
              <div className="user-info">
                <div className="user-info-main">
                  <div className="user-info-title">
                    <h3 className="user-title">{item.name}</h3>
                    <img src={item.imgLink} alt="" />
                  </div>
                  <div className="user-info-about">{item.description}</div>
                </div>

                <div className="user-info-footer">
                  <div className="footer-info">
                    <span>Возраст: {item.age}</span>
                    <span>Цены от: {item.price} ТГ</span>
                    <span>Стаж: {item.experience} </span>
                  </div>
                  <div className="footer-btns">
                    <div className="button" onClick={() => sendOrder(item._id)}>
                      Отправить заказ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {/* {confs.map((item, key) => {
          return (
            <div key={key} className="user-item">
              <div className="user-info-categories">
                {item.categories.map((i, k) => {
                  return (
                    <div key={k} className="categories-item">
                      {i}
                    </div>
                  );
                })}
              </div>
              <div className="user-info">
                <div className="user-info-main">
                  <div className="user-info-title">
                    <h3 className="user-title">{item.name}</h3>
                    <img src={item.img} alt="" />
                  </div>
                  <div className="user-info-about">{item.info}</div>
                </div>

                <div className="user-info-footer">
                  <div className="footer-info">
                    <span>Работает с: {item.experience}</span>
                    <span>Рейтинг: {item.rating}</span>
                    <span>Цены от: {item.priceFrom} ТГ</span>
                  </div>
                  <div className="footer-btns">
                    <button className="button">Перейти</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })} */}
      </div>
    </div>
  );
};

export default HomePageCustomer;
