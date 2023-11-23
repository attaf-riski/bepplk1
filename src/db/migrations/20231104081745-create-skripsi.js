"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("skripsis", {
      NIM: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
      },
      nilai: {
        type: Sequelize.STRING,
      },
      tanggalSidang: {
        type: Sequelize.DATE,
      },
      lamaStudi: {
        type: Sequelize.INTEGER,
      },
      scanBeritaAcara: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("skripsis");
  },
};
