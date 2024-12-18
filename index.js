require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const Entry = require('./models/entry');

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('dist'));

app.get('/api/persons/:id', (req, res, next) => {
  const { id } = req.params;
  return Entry.findById(id)
    .then(response => {
      if (response === null) {
        return res.status(404).end();
      } else {
        return res.json(response);
      }
    })
    .catch(e => next(e));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  return Entry.findByIdAndDelete(id)
    .then(response => {
      if (response === null) {
        return res.status(404).json({ error: 'Invalid ID'});
      } else {
        return res.status(204).end();
      }
    })
    .catch(e => next(e));
})
app.get('/api/persons', (req, res, next) => {
  return Entry.find({})
    .then(results => res.json(results))
    .catch(e => next(e));
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;
  if (name == undefined || name === '' || number == undefined || number === '') {
    return res.status(400).send('Request must include name and number');
  }
  return Entry.findOne({ name })
    .then(response => {
      if (response === null) {
        const newEntry = new Entry({ name, number });
        newEntry.save()
          .then(respuesta => res.json( { newEntry: true, entry: respuesta }));
      } else {
        Entry.findByIdAndUpdate(response._id, { name, number }, { new: true })
          .then(respuesta => res.json({ newEntry: false, entry: respuesta }));
      }
    })
    .catch(e => next(e));
});


app.get('/info', (req, res, next) => {
  const date = new Date();
  const dayNum = date.getDay();
  let day;
  if (dayNum === 0) {
    day = 'Sun';
  } else if (dayNum === 1) {
    day = 'Mon';
  } else if (dayNum === 2) {
    day = 'Tue';
  } else if (dayNum === 3) {
    day = 'Wed';
  } else if (dayNum === 4) {
    day = 'Thur';
  } else if (dayNum === 5) {
    day = 'Fri';
  } else if (dayNum === 6) {
    day = 'Sat';
  }
  const monthNum = date.getMonth();
  let month;
  if (monthNum === 0) {
    month = 'Jan';
  } else if (monthNum === 1) {
    month = 'Feb';
  } else if (monthNum === 2) {
    month = 'Mar';
  } else if (monthNum === 3) {
    month = 'Apr';
  } else if (monthNum === 4) {
    month = 'May';
  } else if (monthNum === 5) {
    month = 'Jun';
  } else if (monthNum === 6) {
    month = 'Jul';
  } else if (monthNum === 7) {
    month = 'Aug';
  } else if (monthNum === 8) {
    month = 'Sep';
  } else if (monthNum === 9) {
    month = 'Oct';
  } else if (monthNum === 10) {
    month = 'Nov';
  } else if (monthNum === 11) {
    month = 'Dec';
  }
  return Entry.find({})
          .then(response => {
              return res.send(`<p>There are ${response.length} entries in the phonebook</p><p>${day} ${month} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</p>`);
          })
          .catch(e => next(e));
})

app.use((req, res) => {
  return res.status(404).json({ error: 'Unknown endpoint' });
})

app.use((e, req, res, next) => {
  console.error(e);
  if (e.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted ID'});
  } else {
    return next(e);
  }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Phonebook server running on port ${PORT}`);
})