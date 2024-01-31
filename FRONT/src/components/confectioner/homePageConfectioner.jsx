import React, { useEffect, useState } from "react";
import HomeNavigationConfectioner from "../navigations/homeNavigationConfectioner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePageConfectioner = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const userId = localStorage.getItem("id");
    setId(userId);
    const getOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/auth/orders");
        console.log(response.data.orders);
        setOrders(response.data.orders);
      } catch (error) {
        console.log(error);
      }
    };
    getOrders();
  }, []);
  const isConfectionerInArray = (id, confectionerArray) => {
    return confectionerArray.some((obj) => obj.confectioner === id);
  };
  const response = async (orderId) => {
    //
    const token = localStorage.getItem("accessToken");

    console.log(id);
    console.log(orderId);

    try {
      const response = await axios.put(
        "http://localhost:5000/auth/confectioner-req",
        {
          orderId,
          confectionerId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      alert("Ожидайте ответа заказчика");
      navigate("/confectioner/orders");
    } catch (error) {
      console.error(error);
    }
  };
  /*  */
  return (
    <div className="wrapper wrapper-orders">
      <HomeNavigationConfectioner></HomeNavigationConfectioner>
      <div className="orders-container">
        {orders.map((item) =>
        
          item.Status === "AwaitingResponses" ||
          item.Status === "ResponsesReceived" ? (
            <div className="order-item" key={item._id}>
              <div className="order-content">
                <h2 className="order-title">{item.data.orderName}</h2>
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
                    Количество: <span>{item.data.count} </span>
                  </p>
                </div>
                <div className="order-date">
                  <span>Срок выполнения: {item.data.date}</span>
                </div>
                {isConfectionerInArray(id, item.confectioners) ? (
                  <span>Вы уже откликнулись на это заказ</span>
                ) : (
                  <button className="button" onClick={() => response(item._id)}>
                    Откликнуться
                  </button>
                )}
              </div>
              <img src={item.data.img} alt="" className="item-img" />
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default HomePageConfectioner;
