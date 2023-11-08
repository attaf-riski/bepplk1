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
      alamat: {
        type: Sequelize.STRING,
      },
      kabkota: {
        type: Sequelize.STRING,
      },
      provinsi: {
        type: Sequelize.STRING,
      },
      angkatan: {
        type: Sequelize.INTEGER,
      },
      jalurMasuk: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      noHp: {
        type: Sequelize.STRING,
      },
      dosenWaliNIP: {
        type: Sequelize.BIGINT,
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
