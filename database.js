const mongoose = require('mongoose');
require('dotenv/config');

mongoose
  .connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log('DB is connected!!'))
  .catch((err) => console.log(err));
