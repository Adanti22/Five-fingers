import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
const FormNavigation = () => {
  const navigate = useLocation();
  return (
    <div className="navigation">
      <div className="nav-wrap animation">
        <h3>Для кондитеров</h3>
        <div className="nav-wrap-cont">
          <Link
            to="/confectioner/auth"
            className={
              navigate.pathname === "/confectioner/auth"
                ? "active__link link"
                : "link"
            }
          >
            Авторизация
          </Link>
          <Link
            to="/confectioner/registr"
            className={
              navigate.pathname === "/confectioner/registr"
                ? "active__link link"
                : "link"
            }
          >
            Регистрация
          </Link>
        </div>
      </div>
      <div className="nav-wrap animation">
        <h3>Для заказчиков</h3>
        <div className="nav-wrap-cont">
          <Link
            to="/customer/auth"
            className={
              navigate.pathname === "/customer/auth"
                ? "active__link link"
                : "link"
            }
          >
            Авторизация
          </Link>
          <Link
            to="/customer/registr"
            className={
              navigate.pathname === "/customer/registr"
                ? "active__link link"
                : "link"
            }
          >
            Регистрация
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FormNavigation;
