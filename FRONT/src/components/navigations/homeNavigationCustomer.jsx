import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import React, { useEffect, useState } from "react";
import exit from "./../../assets/items/exit.png";
const homeNavigationCustomer = () => {
  const navigate = useNavigate();
  const locate = useLocation();
  useEffect(() => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("accessToken");
    if (!userId) {
      navigate("/");
    } else {
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        navigate("/");
        return;
      }
      const getPict = async () => {
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

          setLink(
            response.data.imgLink ||
              "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
          );
        } catch (error) {
          console.error(error);
        }
      };
      getPict();
    }
  }, []);
  const [link, setLink] = useState(
    "https://cdn-icons-png.flaticon.com/512/9131/9131529.png"
  );
  const exitFunc = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <div className="home__navigation">
      <img className="exit" src={exit} onClick={exitFunc}></img>
      <Link to="/customer/personal/profile">
        <img
          className={
            locate.pathname === "/customer/personal/profile"
              ? "img-link img-active-link"
              : "img-link"
          }
          src={link}
          alt=""
        />
      </Link>
      <Link
        to="/home/customer"
        className={
          locate.pathname === "/home/customer" ? "active-link link" : "link"
        }
      >
        Главная
      </Link>
      <Link
        to="/customer/orders"
        className={
          locate.pathname === "/customer/orders" ? "active-link link" : "link"
        }
      >
        Заказы
      </Link>
      <Link
        to="/order/form"
        className={
          locate.pathname.startsWith("/order/form")
            ? "active-link link"
            : "link"
        }
      >
        Форма заказа
      </Link>
    </div>
  );
};

export default homeNavigationCustomer;

/* 
1)Профиль
2)Главная страница
3)Заказы
 */
