import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import exit from "./../../assets/items/exit.png";

const HomeNavigationConfectioner = () => {
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
          if (!response.data.name) {
            console.log(response.data);
            console.log(locate.pathname);
            if (locate.pathname === "/confectioner/personal/profile") {
            } else {
              alert("Необходимо заполнить профиль!");
              navigate("/confectioner/personal/profile");
            }
          }
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

      <Link to="/confectioner/personal/profile">
        <img
          className={
            locate.pathname === "/confectioner/personal/profile"
              ? "img-link img-active-link"
              : "img-link"
          }
          src={link}
          alt=""
        />
      </Link>
      <Link
        to="/home/confectioner"
        className={
          locate.pathname === "/home/confectioner" ? "active-link link" : "link"
        }
      >
        Главная
      </Link>
      <Link
        to="/confectioner/orders"
        className={
          locate.pathname === "/confectioner/orders"
            ? "active-link link"
            : "link"
        }
      >
        Ваши заказы
      </Link>
    </div>
  );
};

export default HomeNavigationConfectioner;
