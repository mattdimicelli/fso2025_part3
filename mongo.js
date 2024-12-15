const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('must supply password');
  process.exit(1);
}

if (process.argv.length === 4 || process.argv.length > 5) {
  console.log('invalid number of arguments');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://matthewdimicelli:${password}@cluster0.rtzoz.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery',false);

mongoose.connect(url).then(() => {
  const entrySchema = new mongoose.Schema({
    name: String,
    number: String,
  });

  const Entry = mongoose.model('Entry', entrySchema);

  if (process.argv.length === 3) {
    console.log('getting all entries')
    Entry.find({})
    .then(entries => {
      entries.forEach(entry => console.log(`${entry.name}: ${entry.number}`));
      mongoose.connection.close();
    });
  } else {
    console.log('posting new entry')
    new Entry({ name: process.argv[3], number: process.argv[4]}).save()
    .then((result) => {
      console.log(result);
      console.log('entry saved');
      mongoose.connection.close();
    })
  }
})









