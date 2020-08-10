const express = require('express')
const app = express()
const cors = require('cors')
const port = 5000

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(cors());
app.use(bodyParser.json())
app.use(cookieParser());

const usersRouter = require('./routes/users')
const photosRouter = require('./routes/photos')

app.use('/api/users', usersRouter);
app.use('/api/photos', photosRouter);

app.get('/', (req, res) => res.send('No No No!'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
