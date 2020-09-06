const express = require('express');
const knex = require('../db/knex');
const humanizeDuration = require('humanize-duration');

const router = express.Router();

router.get('/', async (req, res, next) => {
  const tickets = await knex('tickets');
  const worklogs = await knex('worklogs');

  const ticketsWithWorklogs = tickets.map((t) => {
    const worklogsForTickets = worklogs.filter(w => w.ticket_id === t.id);
    const timeLogged = worklogsForTickets.reduce((acc, curr) => acc +=
      (createMillisecondsFromTimeString(curr.to) - createMillisecondsFromTimeString(curr.from)), 0);
    return {
      ...t,
      isEstimationExceeded: timeLogged > t.estimation,
      timeLogged: humanizeDuration(timeLogged),
      estimation: humanizeDuration(t.estimation),
      worklogs: worklogsForTickets ? worklogsForTickets : []
    }
  })
  res.render('tickets', { title: 'Tickets', tickets: ticketsWithWorklogs });
});

module.exports = router;

function createMillisecondsFromTimeString(timeString) {
  return +timeString.split(':')[0] * 60 * 60 * 1000 + +timeString.split(':')[1] * 60 * 1000;
}