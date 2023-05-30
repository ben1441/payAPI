const express = require('express');
const btt = require('./btt');
const matic = require('./matic');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('server up and running!')
});

app.post('/matic/:op', async (req, res) => {
  try {
    res.status(200).send(await matic[req.params.op](req.body))
  } catch(e) {
    res.status(500).send(e || 'oops... An error occurred!')
    console.log(e)
  }
});

app.post('/btt/:op', async (req, res) => {
  try {
    res.status(200).send(await btt[req.params.op](req.body))
  } catch(e) {
    res.status(500).send(e || 'oops... An error occurred!')
    console.log(e)
  }
})

app.listen(5000, () => {
  console.log('app started on port 5000')
})
