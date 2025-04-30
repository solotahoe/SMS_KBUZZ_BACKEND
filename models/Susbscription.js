import mongoose from "mongoose";

const subscription = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Plan",
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "expired"],
    default: "active",
  },
  paymentId: {
    type: String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const subscriptionSchema = mongoose.model("subscription", subscription);

export default subscriptionSchema;
