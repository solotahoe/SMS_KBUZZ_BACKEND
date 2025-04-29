import cron from 'node-cron';
import SubscriptionModel from '../models/Susbscription.js';

export const initCronJobs = () => {
  // Checking for expired subscriptions daily at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      const now = new Date();
      
      // 1. Find subscriptions that just expired
      const expiredSubscriptions = await SubscriptionModel.find({
        endDate: { $lte: now },
        status: 'active'
      }).populate('user', 'email name');

      // 2. Update their status
      await SubscriptionModel.updateMany(
        { _id: { $in: expiredSubscriptions.map(s => s._id) } },
        { $set: { status: 'expired' } }
      );

      // 3. Send  email/sms notifications
     

      console.log(`Updated ${expiredSubscriptions.length} expired subscriptions`);

    } catch (error) {
      console.error('Cron job error:', error);
    }
  });


};

