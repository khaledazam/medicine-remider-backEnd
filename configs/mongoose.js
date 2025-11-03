const mongoose = require('mongoose');

mongoose.connect('');

const db = mongoose.connection;

db.on('error', (error) => console.log(`database error ${error}`));

db.once('open', () => console.log(`DB connect`))


module.exports = db;