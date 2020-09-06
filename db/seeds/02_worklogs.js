const worklogs = require("./assets/worklogs.json");

exports.seed = async (knex) => {
  await knex('worklogs').del();
  return knex('worklogs').insert(worklogs);
};
