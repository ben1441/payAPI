const express = require('express');
const matic = require('./matic');
const btt = require('./btt');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('server up and running!')
});

app.post('/matic/:op', async (req, res) => {
  res.send(await matic[req.params.op](req.body));
})

app.post('/btt/:op', async (req, res) => {
  res.status(200).send(await btt[req.params.op](req.body))
})

app.listen(5000, () => {
  console.log('app started on port 5000')
})
