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

app.get('/api/persons/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const response = await Entry.findById(id);
    if (response === null) {
      res.status(404).end();
    } else {
      res.json(response);
    }
  } catch(e) {
    next(e);
  }
});

app.delete('/api/persons/:id', async (req, res, next) => {
  const id = req.params.id;
  try {
    const response = await Entry.findByIdAndDelete(id);
    if (response === null) {
      res.status(404).json({ error: 'Invalid ID' });
    } else {
      res.status(204).end();
    }
  } catch(e) {
    next(e);
  }
});

app.get('/api/persons', async (req, res, next) => {
  try {
    const results = await Entry.find({});
    res.json(results);
  } catch (e) {
    next(e);
  }
});


app.post('/api/persons', async (req, res, next) => {
  const { name, number } = req.body;
  // if (name == undefined || name === '' || number == undefined || number === '') {
  //   return res.status(400).send('Request must include name and number');
  // }
  try {
    const response = await Entry.findOne({ name });
    if (response === null) {
      const newEntry = new Entry({ name, number });
      const respuesta = await newEntry.save();
      res.json({ newEntry: true, entry: respuesta });
    } else {
      const respuesta = await Entry.findByIdAndUpdate(response._id,
        { name, number }, { new: true, runValidators: true, context: 'query' });
      res.json({ newEntry: false, entry: respuesta });
    }
  } catch (e) {
    next(e);
  }
});



app.get('/info', async (req, res, next) => {
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

  try {
    const response = await Entry.find({});
    res.send(`<p>There are ${response.length} entries in the phonebook</p><p>${day} ${month} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</p>`);
  } catch(e) {
    next(e);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Unknown endpoint' });
})

app.use((e, req, res, next) => {
  console.error(e);
  if (e.name === 'CastError') {
    res.status(400).json({ error: 'Malformatted ID'});
  } else if (e.name === 'ValidationError') {
    res.status(400).json({ error: e.message });
  } else {
    next(e);
  }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Phonebook server running on port ${PORT}`);
})