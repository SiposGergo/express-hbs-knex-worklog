
exports.up = function(knex) {
  return knex.schema.createTable('tickets', (table) => {
      table.increments();
      table.string('name').notNull();
      table.text('description')
      table.integer('estimation').notNull();
  }); 
};

exports.down = async function(knex) {
  await knex.schema.dropTable('tickets');
};
