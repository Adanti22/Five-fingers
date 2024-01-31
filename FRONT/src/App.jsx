import { useEffect, useState } from "react";
import reactLogo from "./assets/Logo/logo__1.png";
import viteLogo from "./assets/Logo/logo__2.png";
import "./App.scss";
import Main from "./components/mainPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./components/errors/internetConnection";
import AuthorizationFormCustomer from "./components/customer/authorizationFormCustomer.jsx";
import RegistrationFormCustomer from "./components/customer/registrationFormCustomer.jsx";
import AuthorizationFormConfectioner from "./components/confectioner/authorizationFormConfectioner.jsx";
import RegistrationFormConfectioner from "./components/confectioner/registrationFormConfectioner.jsx";
import HomePageCustomer from "./components/customer/homePageCustomer.jsx";
import HomePageConfectioner from "./components/confectioner/homePageConfectioner.jsx";
import PersonalProfileCustomer from "./components/customer/personalProfileCustomer.jsx";
import PersonalProfileConfectioner from "./components/confectioner/personalProfileConfectioner.jsx";
import OrdersCustomer from "./components/customer/ordersCustomer.jsx";
import OrdersConfectioner from "./components/confectioner/ordersConfectioner.jsx";
import OrderForm from "./components/customer/orderForm.jsx";
function App() {
  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]');
    link.setAttribute("href", viteLogo);
    document.title = "Five Fingers";
  }, []);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/home/customer" element={<HomePageCustomer />} />
          <Route path="/home/confectioner" element={<HomePageConfectioner />} />
          <Route path="*" element={<ErrorPage />} />
          <Route
            path="/customer/auth"
            element={<AuthorizationFormCustomer />}
          />
          <Route
            path="/customer/registr"
            element={<RegistrationFormCustomer />}
          />
          <Route
            path="/confectioner/auth"
            element={<AuthorizationFormConfectioner />}
          />
          <Route
            path="/confectioner/registr"
            element={<RegistrationFormConfectioner />}
          />
          <Route
            path="/customer/personal/profile"
            element={<PersonalProfileCustomer />}
          />
          <Route
            path="/confectioner/personal/profile"
            element={<PersonalProfileConfectioner />}
          />
          <Route path="/customer/orders" element={<OrdersCustomer />} />

          <Route path="/confectioner/orders" element={<OrdersConfectioner />} />

          <Route path="/order/form" element={<OrderForm />} />
          <Route path="/order/form/:confectionerId" element={<OrderForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
