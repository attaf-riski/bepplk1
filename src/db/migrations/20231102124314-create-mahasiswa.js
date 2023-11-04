"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Mahasiswas", {
      NIM: {
        primaryKey: true,
        type: Sequelize.STRING,
      },
      nama: {
        type: Sequelize.STRING,
      },
      angkatan: {
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.STRING,
      },
      photo: {
        type: Sequelize.TEXT,
      },
      userId: {
        type: Sequelize.BIGINT,
      },
      dosenWaliId: {
        type: Sequelize.BIGINT,
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
    await queryInterface.dropTable("Mahasiswas");
  },
};
