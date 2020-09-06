const knex = require("../knex");

exports.up = function(knex) {
  return knex.schema.createTable("worklogs", table => {
      table.increments();
      table.string('from');
      table.string('to');
      table.integer('ticket_id').unsigned().references('id').inTable('tickets');
  })
};

exports.down = async function (knex){
    await knex.schema.dropTable('worklogs');
}
