const express = require('express');
const app = express();

app.use(express.json());

let entries = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  const foundEntry = entries.find(entry => entry.id === String(id));
  if (foundEntry) {
    return res.json(foundEntry);
  } else {
    return res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  entries = entries.filter(entry => entry.id !== String(id));
  return res.status(204).end();
})
app.get('/api/persons', (req, res) => {
  return res.json(entries);
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;
  if (name == undefined || name === '' || number == undefined || number === '') {
    res.statusMessage = 'Request must include name and number';
    return res.status(400).end();
  }
  const newEntry = { name, number };
  newEntry.id = String(Math.floor(Math.random() * 1000000));
  entries.push(newEntry);
  return res.json(newEntry);
});


app.get('/info', (req, res) => {
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

  return res.send(`<p>There are ${entries.length} entries in the phonebook</p><p>${day} ${month} ${date.getDate()} ${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</p>`);
})

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Phonebook server running on port ${PORT}`);
})