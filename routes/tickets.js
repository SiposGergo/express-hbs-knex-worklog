const express = require('express');
const knex = require('../db/knex');
const humanizeDuration = require('humanize-duration');
const router = express.Router();

router.get('/', async (req, res, next) => {
  const tickets = await knex('tickets')
    .leftJoin("worklogs", "tickets.id", "=", "worklogs.ticket_id")
    .count("worklogs.id as numberOfWorklogs")
    .sum("worklogs.duration as timeLogged")
    .select("tickets.*")
    .groupBy("tickets.name", "tickets.id", "tickets.estimation");

  const humanizedTickets = tickets.map((t) => ({
    ...t,
    isEstimationExceeded: t.timeLogged > t.estimation,
    timeLogged: humanizeDuration(t.timeLogged),
    estimation: humanizeDuration(t.estimation)
  }));

  res.render('tickets', { title: 'Tickets', tickets: humanizedTickets });
});

module.exports = router;

