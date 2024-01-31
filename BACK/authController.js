const User = require("./models/User");
const Role = require("./models/Role");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const Order = require("./models/Order");

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, { expiresIn: "24h" });
};
const { secret } = require("./config");
class authController {
  async addOpenOrder(req, res) {
    try {
      const { customer, confectioners, Status, data } = req.body;
      const newOrder = new Order({
        customer,
        confectioners,
        Status,
        data,

        typeOfOrder: "OPEN",
      });
      await newOrder.save();
      return res.json({ message: "Успешно добавлен" });
    } catch (error) {
      console.log("asd");
      console.log(error);
    }
  }
  async addCloseOrder(req, res) {
    try {
      const { customer, confectioners, Status, data } = req.body;
      const newOrder = new Order({
        customer,
        confectioners,
        Status,
        data,

        typeOfOrder: "CLOSE",
      });
      await newOrder.save();
      return res.json({ message: "Успешно добавлен" });
    } catch (error) {
      console.log("asd");
      console.log(error);
    }
  }
  async confectionerReq(req, res) {
    try {
      const { orderId, confectionerId } = req.body;
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(400).json({ message: "Заказа не существует" });
      }
      const existingConfectioner = order.confectioners.find(
        (c) => c.confectioner.toString() === confectionerId
      );

      if (existingConfectioner) {
        return res
          .status(400)
          .json({ message: "Кондитер уже откликался на этот заказ" });
      }
      if (order.Status === "Completed" || order.Status === "InProgress") {
        return res.status(400).json({ message: "Заказ неактуален" });
      }
      order.confectioners.push({
        confectioner: confectionerId,
        confectionerStatus: "AwaitingResponse",
      });

      if (order.Status !== "ResponsesReceived") {
        order.Status = "ResponsesReceived";
      }

      await order.save();
      return res.json({ message: "Успешно" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  }

  async customerResponse(req, res) {
    try {
      const { orderId, confectionerId, confectionerStatus } = req.body;
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Заказ не найден" });
      }
      const confectionerInOrder = order.confectioners.find(
        (confectioner) =>
          confectioner.confectioner.toString() === confectionerId
      );

      if (!confectionerInOrder) {
        return res.status(404).json({ message: "Кондитер в заказе не найден" });
      }

      if (confectionerInOrder.Status === "") {
        return res.status(404).json({ message: "Кондитер в заказе не найден" });
      }
      if (confectionerInOrder.confectionerStatus !== "AwaitingResponse") {
        return res.status(400).json({ message: "Неверный статус кондитера" });
      }
      confectionerInOrder.confectionerStatus = confectionerStatus;

      if (
        confectionerStatus === "InProgress" ||
        confectionerStatus === "Completed"
      ) {
        order.Status = confectionerStatus;
      }
      if (confectionerStatus === "InProgress") {
        order.confectioners.forEach((otherConfectioner) => {
          if (
            otherConfectioner.confectioner.toString() !== confectionerId &&
            otherConfectioner.confectionerStatus === "AwaitingResponse"
          ) {
            otherConfectioner.confectionerStatus = "Refused";
          }
        });
      }
      await order.save();

      return res.json({ message: "Успешно" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }
  async confectionerConfirm(req, res) {
    try {
      const { orderId, confectionerId } = req.body;
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Заказ не найден" });
      }
      const confectionerInOrder = order.confectioners.find(
        (confectioner) =>
          confectioner.confectioner.toString() === confectionerId
      );

      if (!confectionerInOrder) {
        return res.status(404).json({ message: "Кондитер в заказе не найден" });
      }

      confectionerInOrder.confectionerStatus = "InProgress";

      order.Status = "InProgress";

      await order.save();

      return res.json({ message: "Успешно" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }
  async finishingOrder(req, res) {
    try {
      const { orderId } = req.body;
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Заказ не найден" });
      }
      const inProgressConfectioner = order.confectioners.find(
        (confectioner) => confectioner.confectionerStatus === "InProgress"
      );
      if (!inProgressConfectioner) {
        return res
          .status(400)
          .json({ message: "Кондитер сейчас не выполняет заказ" });
      }
      inProgressConfectioner.confectionerStatus = "Completed";
      order.Status = "Completed";

      await order.save();

      return res.json({ message: "Заказ успешно завершен" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Внутренняя ошибка сервера" });
    }
  }
  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Ошибка при регистрации", errors });
      }
      const { username, password, role } = req.body;
      console.log(role);
      const rolesFromDB = await Role.find();
      const validRoles = rolesFromDB.map((role) => role.value);
      console.log(validRoles);
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: "Неверная роль" });
      }
      const candidate = await User.findOne({ username });
      if (candidate) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким именем уже существует" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: role });
      const user = new User({
        username,
        password: hashPassword,
        roles: [userRole.value],
      });
      await user.save();
      return res.json({ message: "Пользователь успешно зарегистрирован" });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Registration error" });
    }
  }
  // async login(req, res) {
  //   try {
  //     const { username, password } = req.body;
  //     const user = await User.findOne({ username });
  //     if (!user) {
  //       return res.status(400).json({
  //         message: `Пользователь "${username}" не найден`,
  //       });
  //     }
  //     const validPassword = bcrypt.compareSync(password, user.password);
  //     if (!validPassword) {
  //       return res.status(400).json({ message: `Неверный пароль` });
  //     }
  //     const token = generateAccessToken(user._id, user.roles);
  //     return res.json({ token });
  //   } catch (e) {
  //     console.log(e);
  //     res.status(400).json({ message: "Login error" });
  //   }
  // }
  async login(req, res) {
    try {
      const { username, password, role } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({
          message: `Пользователь с логином "${username}" не найден`,
        });
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.status(400).json({ message: `Неверный пароль` });
      }

      if (user.roles.indexOf(role) === -1) {
        return res.status(400).json({
          message: `Пользователь с логином "${username}" не является ${role}`,
        });
      }

      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token, userId: user._id });
    } catch (e) {
      console.error(e);
      res.status(400).json({ message: "Login error" });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await User.find();
      console.log(users);
      res.json(users);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Request error" });
    }
  }
  async getUserById(req, res) {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      return res.json(user);
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ message: "Ошибка при получении данных пользователя" });
    }
  }
  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { updatedUserData } = req.body;
      console.log(updatedUserData);
      if (Object.keys(updatedUserData).length === 0) {
        return res.status(400).json({ message: "Нет данных для обновления" });
      }
      if (updatedUserData.password) {
        const hashPassword = bcrypt.hashSync(updatedUserData.password, 7);
        updatedUserData.password = hashPassword;
      }
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updatedUserData },
        { new: true }
      );
      res.json({ message: "Данные успешно обновлены", user: updatedUser });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "Ошибка обновления данных" });
    }
  }
  async getOrders(req, res) {
    try {
      const orders = await Order.find();
      res.json({ orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getOrdersByConfectionerId(req, res) {
    try {
      const { confectionerId } = req.params;

      if (!confectionerId) {
        return res.status(400).json({ message: "Confectioner ID is required" });
      }

      const orders = await Order.find({
        "confectioners.confectioner": confectionerId,
      });
      res.json({ orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async getOrdersByIdCustomer(req, res) {
    try {
      const { customerId } = req.params;
      if (!customerId) {
        return res.status(400).json({ message: "Необходимо айди" });
      }
      const orders = await Order.find({ customer: customerId });
      res.json({ orders });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = new authController();

/*   async confectionerReq(req, res) {
    try {
      const { orderId, confectionerId } = req.body;

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(400).json({ message: "Заказа не существует" });
      }
      const existingConfectioner = order.confectioners.find(
        (c) => c.confectioner.toString() === confectionerId
      );

      if (existingConfectioner) {
        return res
          .status(400)
          .json({ message: "Кондитер уже откликался на этот заказ" });
      }
      if (order.Status === "Completed" || order.Status === "InProgress") {
        return res.status(400).json({ message: "Заказ неактуален" });
      }
      // Если кондитер еще не откликался, добавить его в массив confectioners
      order.confectioners.push({
        confectioner: confectionerId,
        confectionerStatus: "AwaitingResponse",
      });

      // Если это первый отклик, изменить статус заказа на "ResponsesReceived"
      if (order.Status !== "ResponsesReceived") {
        order.Status = "ResponsesReceived";
      }

      // Сохранить обновленный заказ в базе данных
      await order.save();
      return res.json({ message: "Успешно" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ошибка сервера" });
    }
  } */
