'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.addColumn('reviews', 'product_family_id', {
     type: Sequelize.INTEGER,
     allowNull:false,
     references: {
       model: 'product_families',
       key: 'id'
     },
     onUpdate: 'CASCADE',
     onDelete: 'CASCADE'
   });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('reviews','family_id');
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
