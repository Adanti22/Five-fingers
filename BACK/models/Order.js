const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  typeOfOrder: { type: String, enum: ["OPEN", "CLOSE"], required: true },
  customer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  confectioners: [
    {
      confectioner: { type: Schema.Types.ObjectId, ref: "User" },
      confectionerStatus: {
        type: String,
        enum: [
          "AwaitingResponse",
          "Refused",
          "InProgress",
          "Completed",
          "ResponseReceived",
        ],
      },
    },
  ],
  Status: {
    type: String,
    enum: [
      "AwaitingResponses",
      "ResponsesReceived",
      "InProgress",
      "Completed",
      "AwaitingConfResponse",
      "Refused",
    ],
    required: true,
  },
  data: { type: Object },
});

const Order = model("Order", orderSchema);

module.exports = Order;
