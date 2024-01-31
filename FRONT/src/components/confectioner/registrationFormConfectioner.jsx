import React, { useState } from "react";
import confectionerImg from "./../../assets/forms/confectioner_vector.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import FormNavigation from "../navigations/formNavigation";
const RegistrationForm = () => {
  const navigate = useNavigate();
  const [loginVal, setLoginVal] = useState(false);
  const [passwordVal, setPasswordVal] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginValidStyles, setLoginValidStyles] = useState({
    borderBottom: "1px solid black",
  });
  const [passwordValidStyles, setPasswordValidStyles] = useState({
    borderBottom: "1px solid black",
  });

  const validatePass = (pass) => {
    const latinLetterRegex = /[a-zA-Z]/;
    const digitRegex = /\d/;
    const symbolRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/^-]/;

    const hasLatinLetter = latinLetterRegex.test(pass);
    const hasDigit = digitRegex.test(pass);
    const hasSymbol = symbolRegex.test(pass);

    return hasLatinLetter && hasDigit && hasSymbol;
  };
  const changeLogin = (value) => {
    const trimmedValue = value.trim().slice(0, 15);
    setLogin(trimmedValue);
  };
  const changePassword = (value) => {
    const trimmedValue = value.trim().slice(0, 15);
    setPassword(trimmedValue);
  };
  const loginValidation = () => {
    const regex = /^[a-zA-Z0-9\s]+$/;
    if (login.length > 0) {
      if (login.length > 3) {
        if (!regex.test(login)) {
          setLoginError("*В логине допустимы только цифры и латинские буквы");
          setLoginValidStyles({ borderBottom: "1px solid red" });
          setLoginVal(false);
        } else {
          setLoginValidStyles({ borderBottom: "2px solid green" });
          setLoginVal(true);

          setLoginError("");
        }
      } else {
        setLoginError("*Минимальная длина логина: 3 символов");
        setLoginValidStyles({ borderBottom: "1px solid red" });
        setLoginVal(false);
      }
    } else {
      setLoginValidStyles({ borderBottom: "1px solid black" });
      setLoginVal(false);

      setLoginError("");
    }
  };
  const passwordValidation = () => {
    const regex = /^[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/^-]+$/;
    const minLength = 5;
    if (password.length > 0) {
      if (password.length < minLength) {
        setPasswordError("*Минимальная длина пароля: 5 символов");
        setPasswordValidStyles({ borderBottom: "1px solid red" });
        setPasswordVal(false);
      } else {
        if (!regex.test(password)) {
          setPasswordError(
            "*В пароле допустимы только цифры, знаки и латинские буквы"
          );
          setPasswordVal(false);
          setPasswordValidStyles({ borderBottom: "1px solid red" });
        } else {
          if (validatePass(password)) {
            setPasswordVal(true);
            setPasswordValidStyles({ borderBottom: "2px solid green" });
            setPasswordError("");
          } else {
            setPasswordValidStyles({ borderBottom: "1px solid red" });
            setPasswordVal(false);
            setPasswordError("В пароле должны быть: символ, буква,цифра");
          }
        }
      }
    } else {
      setPasswordVal(false);
      setPasswordValidStyles({ borderBottom: "1px solid black" });
      setPasswordError("");
    }
  };
  const registr = async () => {
    if (loginVal && passwordVal) {
      try {
        await axios.post("http://localhost:5000/auth/registration", {
          username: login,
          password: password,
          role: "CONFECTIONER",
        });
        alert("Успешно зарегистрированы!");
        navigate("/confectioner/auth");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          const errorMessage = error.response.data.message;
          setPasswordError(errorMessage);
        } else {
          console.error(error);
        }
      }
    } else {
      setPasswordError("Невалидные значения");
    }
  };
  return (
    <div className="wrapper wrapper-form">
      <FormNavigation></FormNavigation>
      <h2 className="a6">Регистрация</h2>
      <div className="form-item">
        <img src={confectionerImg} className="form-item-img animation" alt="" />
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
              onBlur={loginValidation}
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
              onBlur={passwordValidation}
            />
            <label>Пароль</label>
          </div>
          <button className="animation a6 button" onClick={registr}>
            Регистрация
          </button>

          <div className="error-container">
            <span className="error">{loginError}</span>
            <span className="error">{passwordError}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
