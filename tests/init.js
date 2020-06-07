
const {sequelize} = require('../models/index');

(async () => {
    let result = await sequelize.sync({ force: true });
    console.log("Restarted server");
    process.exit();
})();
