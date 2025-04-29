import mongoose from "mongoose";

const plan = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    duration: { 
      type: Number,
      required: true,
      min: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  })
const planSchema = mongoose.model('Plan', plan)

export default planSchema;