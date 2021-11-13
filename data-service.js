const Sequelize = require("sequelize");

const sequelize = new Sequelize("d947snkq2o197u", "xtllnkmnzbuozk", "57e90752cf30d9d1e7be4a2ae1004dfef539cbc2e8473c3d7659536c89c22c36", {
    host: "ec2-3-214-3-162.compute-1.amazonaws.com",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: {raw: true}
});

// Define a model
const Comic = sequelize.define("Comic", {
    comicID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    comicViewed: Sequelize.INTEGER,
});

module.exports = {
    initialize: function () {
        return new Promise((reslove, reject) => {
            sequelize.sync()
                .then(() => {
                    reslove();
                }).catch((err) => {
                    reject(err);
                });
        });
    },
    comicUpdate: function (comicData) {
        return new Promise(function (resolve, reject) {
            sequelize.sync().then(function () {
                Comic.findAll({
                    where: {
                        comicID: comicData.num
                    }
                }).then(function (data) {
                    if (data == "") {
                        Comic.create({
                            comicID: comicData.num,
                            comicViewed: 1,
                        }).then((data) => {
                            resolve(data);
                        }).catch((err) => {
                            reject(err);
                        });
                    } else {
                        Comic.update({
                            comicViewed: data[0].comicViewed + 1
                        }, {
                            where: { comicID: data[0].comicID }
                        }).then(() => {
                            resolve();
                        }).catch((err) => {
                            reject(err);
                        });
                    }
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    },
    getViewedCount: function (comicData) { 
        return new Promise(function (resolve, reject) {
            sequelize.sync().then(function () {
                Comic.findAll({
                    where: {
                        comicID: comicData.num
                    }
                }).then(function (data) {
                    resolve(data);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
};