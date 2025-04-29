import planModel from "../models/Plan.js";

//create a plan
const createPlan = async (planData) => {
  try {
    // Create a plan
    const plan = new planModel(planData);
    await plan.save();

    return {
      success: true,
      user: plan.toObject({
        versionKey: false,
      }),
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

const getAllPlans = async () => {
  try {
    const plans = await planModel.find();
    const plansArray = plans.map((plan) =>
      plan.toObject({ versionKey: false })
    );
    return { success: true, plans: plansArray };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

//  update a user
const updatePlan = async (planId, updateData) => {
  try {
    const plan = await planModel.findByIdAndUpdate(planId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!plan) {
      return { success: false, error: "Plan not found" };
    }
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

//Delete a user
const deletePlan = async (planId) => {
  try {
    const user = await planModel.findByIdAndDelete(planId);
    if (!user) {
      return { success: false, error: "Plan not found" };
    }
    return { success: true, message: "Plan deleted successfully" };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export { createPlan, getAllPlans, updatePlan, deletePlan };
