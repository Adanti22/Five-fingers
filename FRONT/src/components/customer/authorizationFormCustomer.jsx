import React, { useEffect, useState } from "react";
import customerImg from "./../../assets/forms/customer_vector.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import FormNavigation from "../navigations/formNavigation";
const AuthorizationFormCustomer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loginValidStyles, setLoginValidStyles] = useState({
    borderBottom: "1px solid black",
  });
  const [passwordValidStyles, setPasswordValidStyles] = useState({
    borderBottom: "1px solid black",
  });

  const changeLogin = (value) => {
    const trimmedValue = value.trim().slice(0, 15);
    setLogin(trimmedValue);
  };
  const changePassword = (value) => {
    const trimmedValue = value.trim().slice(0, 15);
    setPassword(trimmedValue);
  };
  const logIn = async () => {
    if (login && password) {
      try {
        const response = await axios.post("http://localhost:5000/auth/login", {
          username: login,
          password: password,
          role: "CUSTOMER",
        });
        const token = response.data.token;
        const id = response.data.userId;
        localStorage.setItem("id", id);
        localStorage.setItem("accessToken", token);
        navigate("/home/customer");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          const errorMessage = error.response.data.message;
          setError(errorMessage);
        } else {
          console.error(error);
        }
      }
    } else {
      setLoginValidStyles({
        borderBottom: "1px solid red",
      });
      setPasswordValidStyles({
        borderBottom: "1px solid red",
      });
      setError("Заполните поля");
    }
  };
  return (
    <div className="wrapper wrapper-form">
      <FormNavigation></FormNavigation>
      <h2 className="a6">Авторизация</h2>
      <div className="form-item">
        <img src={customerImg} className="form-item-img animation" alt="" />
        <div className="form-item-form form-item-width">
          <div className="user-box">
            <input
              type="text"
              name=""
              className="form-field animation a3"
              required
              style={loginValidStyles}
              value={login}
              onChange={(e) => changeLogin(e.target.value)}
            />
            <label>Логин</label>
          </div>
          <div className="user-box">
            <input
              type="password"
              name=""
              className="form-field animation a4"
              required
              value={password}
              onChange={(e) => changePassword(e.target.value)}
              style={passwordValidStyles}
            />
            <label>Пароль</label>
          </div>
          <button className="animation a6 button" onClick={logIn}>
            Войти
          </button>

          <div className="error-container">{error}</div>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationFormCustomer;
