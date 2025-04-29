import subscriptionModel from "../models/Susbscription.js";
import planModel from "../models/Plan.js";
import userModel from "../models/User.js";

//create a a subscription
const createSubscription = async (subData) => {
    try {
      const { userId, planId } = subData;

    // Check if user and plan exist
    const [user, plan] = await Promise.all([
      userModel.findById(userId),
      planModel.findById(planId)
    ]);

    if (!user || !plan) {
      return res.status(404).json({
        success: false,
        message: "User or Plan not found"
      });
    }

     // Calculate dates
     const startDate = new Date();
     const endDate = new Date();
     endDate.setDate(startDate.getDate() + plan.duration);

      // Create a plan
      const sub = new subscriptionModel(
        {
          user: userId,
          plan: planId,
          startDate,
          endDate,
          paymentId: `pay_${Math.random().toString(36).substring(2, 15)}`,
        }
      );
      await sub.save();
      const subscriptionData = sub.toObject({
        versionKey: false
    });
      return {
        success: true,
        data:subscriptionData,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  };

  export { createSubscription};
  