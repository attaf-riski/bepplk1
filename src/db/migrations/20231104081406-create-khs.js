"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("khs", {
      semesterAktif: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
      },
      jumlahSksSemester: {
        type: Sequelize.INTEGER,
      },
      jumlahSksKumulatif: {
        type: Sequelize.INTEGER,
      },
      IPS: {
        type: Sequelize.FLOAT,
      },
      IPK: {
        type: Sequelize.FLOAT,
      },
      scanKHS: {
        type: Sequelize.STRING,
      },
      NIM: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
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
    await queryInterface.dropTable("khs");
  },
};
