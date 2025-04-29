import userModel from "../models/User.js";
import bcrypt from "bcrypt";
import {
  validateUserCredentials,
  generateAuthToken,
} from "../utils/authUtils.js";

const loginUser = async (loginData) => {
  //   console.log({ loginData });
  try {
    const { email, password } = loginData;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format",
      });
    }

    // Verify credentials
    const result = await validateUserCredentials(email, password);
    // console.log({result})
    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    // Generate JWT token
    const token = generateAuthToken(result.user);
    //  console.log(token)
    // Send response
    return {
      success: true,
      token,
      user: result.user,
    };
  } catch (error) {
    return {
      success: false,
      message: "Server error during authentication",
    };
  }
};

//create a user
const createUser = async (userData) => {
  try {
    const { password, ...userDataWithoutPassword } = userData;
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user with hashed password
    const user = new userModel({
      ...userDataWithoutPassword,
      password: hashedPassword,
    });

    await user.save();
    // Remove password from the returned user object
    const userWithoutPassword = user.toObject({
      versionKey: false,
    });
    delete userWithoutPassword.password;

    return {
      success: true,
      user: userWithoutPassword,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// get all users
const getAllUsersWithSubscriptions = async () => {
  try {
    const users = await userModel.aggregate([
      {
        $lookup: {
          from: 'subscriptions',
          localField: '_id',
          foreignField: 'user',
          as: 'subscriptions'
        }
      },
      {
        $unwind: {
          path: '$subscriptions',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'plans',
          localField: 'subscriptions.plan',
          foreignField: '_id',
          as: 'subscriptions.planDetails'
        }
      },
      {
        $addFields: {
          'subscriptions.plan': {
            $ifNull: [
              { $arrayElemAt: ['$subscriptions.planDetails', 0] },
              { name: 'Plan Deleted', price: 0, duration: 0 } // Fallback for deleted plans
            ]
          }
        }
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          email: { $first: '$email' },
          createdAt: { $first: '$createdAt' },
          subscriptions: {
            $push: {
              $cond: [
                { $ifNull: ['$subscriptions._id', false] },
                {
                  _id: '$subscriptions._id',
                  startDate: '$subscriptions.startDate',
                  endDate: '$subscriptions.endDate',
                  status: '$subscriptions.status',
                  paymentId: '$subscriptions.paymentId',
                  createdAt: '$subscriptions.createdAt',
                  plan: '$subscriptions.plan'
                },
                '$$REMOVE' // Remove null subscriptions
              ]
            }
          }
        }
      },
      {
        $project: {
          password: 0,
          __v: 0,
          'subscriptions.planDetails': 0,
          'subscriptions.plan.__v': 0
        }
      },
      {
        $sort: { createdAt: -1 } // Sort by newest users first
      }
    ]);

    return { 
      success: true, 
      users: users.map(user => ({
        ...user,
        subscriptions: user.subscriptions || [] // Ensure subscriptions is always an array
      }))
    };
  } catch (error) {
    console.error('Aggregation error:', error);
    return { 
      success: false, 
      error: 'Failed to fetch user data',
      details: error.message 
    };
  }
};
// get a single user
const getUserById = async (userId) => {
  try {
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return { success: false, error: "User not found" };
    }
    return { success: true, user: user.toObject({ versionKey: false }) };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

//  update a user
const updateUser = async (userId, updateData) => {
  try {
    // If password is being updated, hash it first
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true, runValidators: true })
      .select("-password");

    if (!user) {
      return { success: false, error: "User not found" };
    }
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

//Delete a user
const deleteUser = async (userId) => {
  try {
    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Input validation middleware
const validateUserInput = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "Name, email, and password are required",
    });
  }

  // email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }

  next();
};

export {
  createUser,
  getAllUsersWithSubscriptions,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  validateUserInput,
};
