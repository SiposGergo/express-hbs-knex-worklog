const tickets = require("./assets/tickets.json");

exports.seed = async (knex) => {
  await knex('tickets').del();
  return knex('tickets').insert(tickets);
};
