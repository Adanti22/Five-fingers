const Router = require("express");
const router = new Router();
const { check } = require("express-validator");
const controller = require("./authController");
const authMiddleware = require("./middleware/authMiddleware");
router.post(
  "/registration",
  [
    check("username", "Длина логина = от 3 до 15").isLength({
      min: 3,
      max: 15,
    }),
    check("password", "Длина пароля = от 4 до 15").isLength({
      min: 4,
      max: 15,
    }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", authMiddleware, controller.getUsers);
router.put("/update-user/:userId", controller.updateUser);
router.get("/users/:userId", authMiddleware, controller.getUserById);
router.post("/add-open-order", authMiddleware, controller.addOpenOrder);
router.post("/add-close-order", authMiddleware, controller.addCloseOrder);
router.put("/confectioner-req", authMiddleware, controller.confectionerReq);
router.put("/customer-res", authMiddleware, controller.customerResponse);
router.put("/finishing-order", authMiddleware, controller.finishingOrder);
router.put(
  "/confectioner-confirm",
  authMiddleware,
  controller.confectionerConfirm
);

router.get("/customer-orders/:customerId", controller.getOrdersByIdCustomer);
router.get(
  "/confectioner-orders/:confectionerId",
  controller.getOrdersByConfectionerId
);

router.get("/orders", controller.getOrders);

/*  */
module.exports = router;
/* {"username":"customer","password":"customer"} */
/* {
  "customer": "657e6c07246677682b4ff463", // ObjectId пользователя-заказчика
  "Status": "AwaitingResponses", // Статус заказа
  "data": {
    "data":"aaa"
  }
} */
