"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pkls", {
      NIM: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
      },
      nilai: {
        type: Sequelize.FLOAT,
      },
      scanBeritaAcara: {
        type: Sequelize.STRING,
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      tanggalSidang: {
        type: Sequelize.DATE,
      },
      semesterLulus: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("pkls");
  },
};
