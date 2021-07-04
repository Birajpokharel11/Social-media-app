const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const morgan = require('morgan');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
//db connection
// mongoose
//   .connect('mongodb+srv://biraj1234:biraj1234@nodeapi.kb0ap.mongodb.net/test', {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
//   })
//   .then(console.log('connected to mango database'));

// mongoose.connection.on('error', (err) => {
//   console.log(`DB connection error: ${err.message}`);
// });

mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log('DB Connected yo'));

mongoose.connection.on('error', (err) => {
  console.log(`DB connection error: ${err.message}`);
});
//routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
//apiDocs
app.get('/', (req, res) => {
  fs.readFile('docs/apiDocs.json', (err, data) => {
    if (err) {
      res.status(400).json({
        error: err
      });
    }
    const docs = JSON.parse(data);
    res.json(docs);
  });
});

app.use(morgan('dev')); //shhows request
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
app.use('/', postRoutes); ///user routes from express routes
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json('error: Unauthorized access...');
  }
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`A Node Js API is listening on port: ${port}`);
});
