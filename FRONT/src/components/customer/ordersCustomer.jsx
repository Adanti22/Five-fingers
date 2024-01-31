import axios from "axios";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import HomeNavigationCustomer from "../navigations/homeNavigationCustomer";
import { Link } from "react-router-dom";
const OrdersCustomer = () => {
  const token = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("id");
  const [currentOrder, setCurrentOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [respondedConfectioners, setResponded] = useState([]);
  const [responseTransform, setResponseTrasnform] = useState({
    display: "none",
    transform: "translateY(-100%)",
  });
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        navigate("/");
      } else {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          navigate("/");
          return;
        }
        try {
          console.log("asd");
          const response = await axios.get(
            `http://localhost:5000/auth/customer-orders/${userId}`
          );
          console.log(response.data.orders);
          setOrders(response.data.orders);
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "completed";
      case "InProgress":
        return "developing";
      case "Refused":
        return "rejected";
      case "AwaitingResponses":
        return "searching";
      case "AwaitingConfResponse":
        return "waiting";
      default:
        return "";
    }

    /*     switch (status) {
      case "AwaitingResponses":
        return "Ожидаем откликов";
      case "ResponsesReceived":
        return "Есть отклики";
      case "InProgress":
        return "Заказ выполняется";
      case "AwaitingConfResponse":
        return "Ожидаем ответа кондитера";
      case "Refused":
        return "Кондитер отказался от предложения";
    } */
  };
  const getStatus = (status) => {
    switch (status) {
      case "AwaitingResponses":
        return "Ожидаем откликов";
      case "ResponsesReceived":
        return "Есть отклики";
      case "InProgress":
        return "Заказ выполняется";
      case "AwaitingConfResponse":
        return "Ожидаем ответа кондитера";
      case "Refused":
        return "Кондитер отказался от предложения";
      case "Completed":
        return "Заказ выполнен";
    }
  };
  const openResponses = async (confectioners, orderId) => {
    setResponseTrasnform({ display: "flex", transform: "translateY(0)" });
    console.log(confectioners);
    console.log(orderId);
    setCurrentOrder(orderId);
    try {
      console.log("asd");
      for (const conf of confectioners) {
        const response = await axios.get(
          `http://localhost:5000/auth/users/${conf.confectioner}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);

        // Используем колбэк для выполнения действий после установки состояния
        setResponded((prevResponded) => {
          const newResponded = [...prevResponded, response.data];
          console.log(newResponded); // Здесь массив должен быть не пустым
          return newResponded;
        });
      }
    } catch (error) {
      console.error(error);
    }
    console.log(respondedConfectioners); // Здесь массив, скорее всего, будет пустым
  };
  const closeResponses = () => {
    setResponded([]);
    setCurrentOrder(null);
    setResponseTrasnform({ transform: "translateY(-100%)" });
  };
  const confirmOrder = async (confId, orderId) => {
    console.log(confId);
    console.log(orderId);
    try {
      const response = await axios.put(
        `http://localhost:5000/auth/customer-res`,
        {
          orderId: orderId,
          confectionerId: confId,
          confectionerStatus: "InProgress",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Кондитер взялся за работу!");
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
    // /
    /* const response = await axios.put(
  'http://localhost:5000/customer-res',
);
 */
  };
  const confirmCompleted = async (orderId) => {
    console.log(orderId);
    try {
      const response = await axios.put(
        `http://localhost:5000/auth/finishing-order `,
        {
          orderId: orderId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
    /* */
  };
  return (
    <div className="wrapper wrapper-orders">
      <HomeNavigationCustomer></HomeNavigationCustomer>
      <div className="responses" style={responseTransform}>
        <div className="responses-back"></div>
        <div className="responses-content">
          <h2>Откликнувшиеся кондитеры:</h2>
          <span className="close-item" onClick={closeResponses}>
            X
          </span>
          {respondedConfectioners.map((item) => {
            return (
              <div key={item._id} className="user-item">
                <div className="user-info-categories">
                  {item.specialization.map((i) => (
                    <div className="categories-item">{i}</div>
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
                      <div
                        className="button"
                        onClick={() => confirmOrder(item._id, currentOrder)}
                      >
                        Подтвердить
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* {confectioners.map((item, key) => {
          if (!item.imgLink) {
            return null;
          }
          if (!item.roles.includes("CONFECTIONER")) {
            return null;
          }
         
        })} */}
      </div>
      <div className="orders-container">
        {orders.map((item) => {
          return (
            <div className="order-item" key={item._id}>
              <div className="order-content">
                <h2 className="order-title">{item.data.orderName}</h2>
                {item.typeOfOrder === "OPEN" ? (
                  <h2 className="order-title">Открытый заказ</h2>
                ) : (
                  <h2 className="order-title">Закрытый заказ</h2>
                )}

                <div className={`status ${getStatusClass(item.Status)}`}>
                  Статус заказа: <span>{getStatus(item.Status)}</span>
                </div>

                {item.Status === "ResponsesReceived" ? (
                  <button
                    className="button"
                    style={{ width: "auto" }}
                    onClick={() => openResponses(item.confectioners, item._id)}
                  >
                    Посмотреть отклики
                  </button>
                ) : (
                  ""
                )}
                {item.Status === "InProgress" ? (
                  <button
                    className="button"
                    style={{ width: "auto " }}
                    onClick={() => confirmCompleted(item._id)}
                  >
                    Подтвердить завершенность заказа
                  </button>
                ) : (
                  ""
                )}

                <p className="order-info-item">
                  Описание: "<span>{item.data.description}</span>"
                </p>
                <p className="order-info-item warning">
                  Нельзя использовать:{" "}
                  <span>{item.data.prohibitedIngredients}</span>
                </p>
                <div className="order-info-item-wrap">
                  <p>
                    Надпись на изделии: "<span>{item.data.inscription}</span>"
                  </p>

                  <p>
                    Предлагаемая цена: <span>{item.data.price} тг</span>
                  </p>
                  <p>
                    Вес изделия: <span>{item.data.weight} кг</span>
                  </p>
                  <p>
                    Количество: <span>{item.data.count} кг</span>
                  </p>
                  <p>Срок выполнения: {item.data.date}</p>
                </div>
                {/* <div className="order-date">
                  <span></span>
                </div> */}
              </div>
              <img src={item.data.img} alt="" className="item-img" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersCustomer;
