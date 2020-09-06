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
    await knex('worklogs').insert({ ...dto, ticket_id: req.params.ticketId });
    res.redirect('/tickets');
  }
});

function isWorklogValid(dto) {
  return dto.from && dto.to;
}

module.exports = router;
