'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Profiles',
      [
        {
          id: 1,
          firstName: 'Williams',
          lastName: 'Doe',
          image: 'd2c60e1e-f2aa-40ad-8400-6820fdd2e478',
          gender: 'male',
          dateOfBirth: '12-03-1993',
          passion: ['Photography', 'Karaoke', 'Cooking', 'Video games'],
          getNotifications: true,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          firstName: 'Awele',
          lastName: 'Immanuel',
          image: '5e815d93-79b2-4615-a5d0-63ae000ba9ab',
          gender: 'male',
          dateOfBirth: '02-03-1987',
          passion: ['Running', 'Extreme', 'Music'],
          getNotifications: true,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Profiles', null, {});
  },
};
