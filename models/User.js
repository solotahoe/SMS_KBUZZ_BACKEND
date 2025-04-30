import mongoose from "mongoose";

const user = new mongoose.Schema({
        name: {
          type: String,
          required: true
        },
        email: {
          type: String,
          required: true,
          unique: true,
          validate: {
            validator: (v) => /^\S+@\S+\.\S+$/.test(v),
            message: "Invalid email format"
          },
          index: true
        },
        password: {
          type: String,
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }    
})
const userSchema = mongoose.model('User', user)

export default userSchema;