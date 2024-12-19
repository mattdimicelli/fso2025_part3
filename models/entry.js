const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery',false);

(async () => {
  try {
    await mongoose.connect(url);
    console.log('connected to MongoDB')
  } catch(e) {
    console.log('error connecting to MongoDB:', e.message)
  }
})();


const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
  }
});

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;


