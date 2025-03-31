const cron = require('node-cron');
const Auth = require('../model/authModel');

const checkMembershipExpirations = async () => {
    try {
        const currentDate = new Date();

     
        const expiredUsers = await Auth.find({ membershipExpireDate: { $lt: currentDate }, membership: { $ne: "Free" } });

        for (const user of expiredUsers) {
            user.membership = "Free";
            user.membershipExpireDate = null;
            await user.save();
        }

        console.log(`Güncellenen kullanıcı sayısı: ${expiredUsers.length}`);
    } catch (error) {
        console.error("Üyelik süresi dolanları kontrol ederken hata oluştu:", error);
    }
};


cron.schedule('0 3 * * *', checkMembershipExpirations);

module.exports = checkMembershipExpirations;
