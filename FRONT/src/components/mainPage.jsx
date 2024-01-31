import React, { useEffect, useState } from "react";
import logo1 from "./../assets/Logo/logo__1.png";
import header from "./../assets/main/header4.png";
import img from "./../assets/main/header4.png";
import list__img from "./../assets/main/cake.png";
import section__2__img from "./../assets/main/woman_with_cake3.png";
import section__3__img from "./../assets/main/woman_with_cake.png";
import section__4__img from "./../assets/main/confectioner_stock22.png";
import section__5__img from "./../assets/main/confectioner_stock1.png";
import { Link } from "react-router-dom";
import confectioner from "./../assets/main/confectioner.png";
import customer from "./../assets/main/customer.jpg";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();
  const [formType, setFormType] = useState("");

  const [PopUpStyles, setPopUpStyles] = useState({
    top: "-100%",
  });
  const [PopOpacityStyles, setPopOpacityStyles] = useState({
    opacity: 0,
    display: "none",
  });
  const [popStyles, setPopStyles] = useState({ display: "none" });
  useEffect(() => {}, []);
  const popUpFunc = () => {
    setPopStyles({ display: "flex" });
    setPopOpacityStyles({ opacity: 0.9, display: "block" });
    setTimeout(() => {
      setPopUpStyles({ top: "50%" });
    }, 100);
  };
  const popCloseFunc = () => {
    setPopUpStyles({ top: "-100%" });
    setPopOpacityStyles({ opacity: 0, display: "none" });
    setTimeout(() => {
      setPopStyles({ display: "none" });
    }, 1000);
  };
  const navigation = (type) => {
    /* /customer/auth
/customer/registr
/confectioner/auth
/confectioner/registr */
    if (type == "confectioner") {
      if (formType == "Авторизация") {
        navigate("/confectioner/auth");
      } else if (formType == "Регистрация") {
        console.log(formType);
        navigate("/confectioner/registr");
      }
    } else {
      if (formType == "Авторизация") {
        navigate("/customer/auth");
      } else if (formType == "Регистрация") {
        navigate("/customer/registr");
      }
    }
  };

  return (
    <div className="wrapper">
      <div className="pop-up" style={popStyles}>
        <div
          className="pop-back"
          onClick={popCloseFunc}
          style={PopOpacityStyles}
        ></div>
        <div className="pop-content" style={PopUpStyles}>
          <div
            className="pop-item pop-item_confectioner"
            onClick={() => navigation("confectioner")}
          >
            <div className="pop-item-back"></div>
            <h3>
              {formType} <br /> для кондитеров
            </h3>
          </div>
          <div
            className="pop-item pop-item_customer"
            onClick={() => navigation("customer")}
          >
            <div className="pop-item-back"></div>
            <h3>
              {formType} <br /> для заказчиков
            </h3>
          </div>
        </div>
      </div>
      <button
        className="button header-btn"
        onClick={() => {
          popUpFunc();
          setFormType("Авторизация");
        }}
      >
        Войти
      </button>
      <main className="main">
        <header className="header main__page__header"></header>
        <section className="section section-right section__1">
          <div className="section-text">
            <h2>
              Добро пожаловать на <br />
              <span className="bold-text"> Five Fingers</span> – место, где ваши
              сладкие мечты становятся реальностью!
            </h2>
            <img src="" alt="" />
          </div>
          <div className="logo__1__container">
            <img src={logo1} alt="" className="logo__1__img" />
          </div>
        </section>
        <section className="section section-left section__2 .top-translate">
          <div className="section-img section_br">
            <img src={section__2__img} alt="" />
          </div>
          <div className="section-text">
            <h2>Особые моменты, особые десерты!</h2>
            <ul>
              <li>У вашего близкого человека скоро день рождения?</li>
              <li>
                Вы планируете приобрести сладкое изделие для особого события?
              </li>
              <li>У вас много дел, но сами приготовить торт – проблема? </li>
              <li>А может вы просто любите сладкое?</li>
            </ul>
          </div>
        </section>
        <section className="section  section__3 .top-translate">
          <div className="section-text">
            <h2>
              На <span className="bold-text"> Five Fingers</span> вы найдете
              много талантливых кондитеров.
            </h2>
            <p className="section-paragraph">
              Они готовы взяться за любые ваши заказы!
            </p>
          </div>
          <div className="section-img">
            <img src={section__3__img} alt="" />
          </div>
        </section>
        <section className="section section__4 top-translate">
          <div className="section-img-conf">
            <img src={section__4__img} alt="" />
          </div>
          <div className="section-text">
            <h2>Вы мастер по созданию сладких шедевров?</h2>
            <p className="section-paragraph">
              <span className="bold-text">Five Fingers</span> - место, где ваш
              талант признается. Размещайте свои работы, грамоты и достижения на
              своей странице, чтобы потенциальные заказчики могли оценить ваш
              профессионализм.
            </p>
          </div>
        </section>
        <section className="section  section__5 top-translate">
          <div className="section-text">
            <h2> Новые возможности для роста</h2>
            <p className="section-paragraph">
              У вас есть уникальный стиль или крутые идеи? Откликайтесь на
              заказы, предлагайте свои творческие решения!
            </p>
          </div>
          <div className="section-img-conf">
            <img src={section__5__img} alt="" />
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="footer-item">
          <h2>Еще не с нами? Присоединяйтесь!</h2>
          <button
            onClick={() => {
              popUpFunc();
              setFormType("Регистрация");
            }}
            className="button"
          >
            Регистрация
          </button>
        </div>
      </footer>
    </div>
  );
};
/*
          <Link to="/customer/registration" className="link">
</Link>
/ */
export default Main;

/* Для кондитеров:
👩‍🍳 Ваше искусство – в центре внимания: Вы мастер по созданию сладких шедевров? "Five Fingers" - место, где ваш талант признается. Размещайте свои работы, грамоты и достижения на своей странице, чтобы потенциальные заказчики могли оценить ваш профессионализм.

💼 Новые возможности для роста: У вас есть уникальный стиль или вкусовые изыски? Откликайтесь на заказы, предлагайте свои творческие решения и расширяйте свой круг общения в мире сладких удовольствий.

🌐 Глобальное сообщество талантов: "Five Fingers" объединяет кондитеров со всего мира. Здесь вы можете делиться опытом, получать вдохновение и участвовать в создании неповторимых вкусовых впечатлений для клиентов.

Наши преимущества:
🤝 Простота взаимодействия: Легкость создания и оформления заказов, интуитивный интерфейс и быстрые отклики.
🌈 Разнообразие стилей: От традиционных до авангардных – каждый найдет свой вкус.
⭐ Доверие и качество: Каждый кондитер проходит проверку, и их работы оценивают наши заказчики.
Гарантии:
🔐 Безопасность данных: Ваши личные данные и финансовая информация под защитой.

🌐 Глобальное покрытие: Мы предоставляем возможность заказчикам и кондитерам со всего мира.

📈 Постоянное развитие: Мы постоянно совершенствуем нашу платформу, добавляя новые функции и улучшая пользовательский опыт.

Еще не с нами? Присоединяйтесь к "Five Fingers" – месту, где встречаются настоящие сладкоежки и мастера кондитерского искусства!
 */
