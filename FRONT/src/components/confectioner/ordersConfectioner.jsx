import React, { useEffect, useState } from "react";
import HomeNavigationConfectioner from "../navigations/homeNavigationConfectioner";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
const OrdersConfectioner = () => {
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("accessToken");
  const [orders, setOrders] = useState([]);
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
          const response = await axios.get(
            `http://localhost:5000/auth/confectioner-orders/${userId}`
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
      case "Сделано":
        return "completed";
      case "В разработке":
        return "developing";
      case "Отказано":
        return "rejected";
      default:
        return "";
    }
  };
  const getStatus = (status) => {
    switch (status) {
      case "AwaitingResponse":
        return "Ожидаем ответа заказчика";
      case "ResponseReceived":
        return "Заказчик ожидает вашего ответа";
      case "InProgress":
        return "Заказ подтвержден! Беритесь за работу";
      case "Refused":
        return "Заказчик отказался от вашей кандидатуры";
      case "Completed":
        return "Заказ выполнен";
    }
  };

  const findConfectionerStatus = (confectionersArray, confectionerId) => {
    const confectioner = confectionersArray.find(
      (c) => c.confectioner === confectionerId
    );
    return confectioner ? getStatus(confectioner.confectionerStatus) : null;
  };
  const findConfectionerStatus2 = (confectionersArray, confectionerId) => {
    const confectioner = confectionersArray.find(
      (c) => c.confectioner === confectionerId
    );
    console.log(confectioner);
    return confectioner.confectionerStatus;
  };
  const confirm = async (id) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/auth/confectioner-confirm `,
        {
          orderId: id,
          confectionerId: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="wrapper wrapper-orders">
      <HomeNavigationConfectioner></HomeNavigationConfectioner>
      <div className="orders-container">
        {orders.map((item) => {
          return (
            <div className="order-item" key={item._id}>
              <div className="order-content">
                <h2 className="order-title">{item.data.orderName}</h2>
                <div className={`status ${getStatusClass(item.data.Status)}`}>
                  Статус:{" "}
                  <span>
                    {findConfectionerStatus(item.confectioners, userId)}
                  </span>
                </div>

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
                </div>
                <div className="order-date">
                  <span>Срок выполнения: {item.data.date}</span>
                </div>
                {findConfectionerStatus2(item.confectioners, userId) ===
                "ResponseReceived" ? (
                  <button className="button" onClick={() => confirm(item._id)}>
                    Согласиться
                  </button>
                ) : (
                  ""
                )}
              </div>
              <img src={item.data.img} alt="" className="item-img" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersConfectioner;
