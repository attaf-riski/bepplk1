"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("irs", {
      semesterAktif: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      jumlahSks: {
        type: Sequelize.INTEGER,
      },
      scanIRS: {
        type: Sequelize.STRING,
      },
      NIM: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("irs");
  },
};
