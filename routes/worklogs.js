const express = require('express');
const knex = require('../db/knex');

const router = express.Router({ mergeParams: true });

router.get('/new', async (req, res, next) => {
  const ticketId = req.params.ticketId;
  const ticket = await knex('tickets')
    .where('id', '=', ticketId)
    .select('id', 'name')
    .first();

  res.render('new-worklog', { title: 'New worklog', ticket });
});

router.post('/new', async (req, res, next) => {
  const dto = req.body;

  if (!isWorklogValid(dto)) {
    res.render('error', {
      message: 'Worklog is not valid!'
    });
  } else {
    await knex('worklogs').insert({
      ...dto,
      ticket_id: req.params.ticketId,
      duration: createMillisecondsFromTimeString(dto.to) - createMillisecondsFromTimeString(dto.from)
    });
    res.redirect('/tickets');
  }
});

function isWorklogValid(dto) {
  return dto.from && dto.to;
}

function createMillisecondsFromTimeString(timeString) {
  return +timeString.split(':')[0] * 60 * 60 * 1000 + +timeString.split(':')[1] * 60 * 1000;
}

module.exports = router;
