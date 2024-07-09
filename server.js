const path = require('path');
const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');

const errorHandler = require('./middleware/err');
const connectDB = require('./config/db');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const multer = require('multer');


//Lod env vars
dotenv.config({path: './config/.env'});
//Craete app
const app = express();
//Connect to DB
connectDB();
//Middleware to parse JSON requests
app.use(express.json());
//Cookie parser when login user the token is saved in the server and send to http client
app.use(cookieParser());

//Prevent attects
app.use(mongoSanitize()); // Sanitize data for privent NoSql injection attack
app.use(helmet()); // Set security headers
app.use(xss()); // Prevent XSS attacks

//Enable CORS
app.use(cors());
app.all('*', function (req, res, next) {
  if (!req.get('Origin')) return next();
  res.set('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.set(
    'Access-Control-Allow-Headers',
    'X-Requested-With,Content-Type,authorization'
  );
  next();
});

app.all('*',async(req,res,next)=>{
  console.log("in");
  setInterval(async() => {
  const Customer = require('./models/customer');
  const Meeting = require('./models/meeting');

  const sendMessage= require('./controllers/sendMessage').sendMessage;
  console.log("in");
  const meetings = await Meeting.find();
  meetings.map(async(m) => {
    const now = new Date(Date.now); now.setHours(0);now.setMinutes(0); now.setSeconds(0);now.setMilliseconds(0);
    const date = new Date(m.date); date.setHours(0);date.setMinutes(0); date.setSeconds(0);date.setMilliseconds(0);
    const diff = Math.abs((now-date)/(1000 * 60 * 60 * 24));
    const c = await Customer.findOne({id: m.customer.split(' ')[0]});
    if(c && (diff = 10 || diff == 5 || diff == 1)){
      const body = {
        text: `תזכורת: ל-${c.firstname +" " + c.lastname} בעל ת.ז. ${c.id} יש לך פגישה צילום עוד ${m.newborn == true ? " ניובורן" : ""}${diff} ימים\nבתאריך: ${day +"/" + month + "/" + year}`,
        from: `fatom`,
        to: c.phone,
      }
      sendMessage(body);
    }
  })
  next();
}, 1000 * 3600 *24);
next();
})

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Route middleware
app.get('/', (req, res) => { console.log("erver is up and running");res.send('Server is up and running'); });
const customer = require('./routes/customer');
const meeting = require('./routes/meeting');
app.use('/api/customer', customer);
app.use('/api/meeting',meeting);

//must be after routes call
//for catch 500-400 errors
app.use(errorHandler);

const httpServer = http.createServer(app)
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;
httpServer.listen(
  PORT,
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`.blue.bold)
);

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  httpServer.close(() => process.exit(1));
});
