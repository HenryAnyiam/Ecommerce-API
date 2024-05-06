const cron = require("node-cron");
const User = require("../models/user.model");
const TwoFactorAuth = require("../models/twoFactorAuth.model");
const sendVerification = require("./user.verification");


exports.cronJob = () => {
  return new Promise((resolve, reject) => {
    cron.schedule("0 0 * * *", async () => {
      try {
	const olderDays = new Date();
	olderDays.setHours(olderDays.getHours() - 72);
	const pastDay = new Date();
	pastDay.setHours(pastDay.getHours() - 24);
	const unverifiedUsersEmail = await User.findAll({
	  where: {
	    updatedAt: {
	      [Op.gt]: pastDay
	    },
	    emailVerify: false,
	  },
	  include: [{ model: TwoFactorAuth }],
	});
        await Promise.all(
	  unverifiedUsersEmail.map(async (user) => {
	    const userDate = new Date(user.updatedAt);
	    if (olderDays >= userDate) {
	      await user.delete();
	    } else {
	      await sendVerification.sendTotpToEmail(user.email, user.TwoFactorAuth.secret);
	    }
	  })
	);
        resolve();
      } catch (e) {
	reject(e);
      }
    });
  });
}
