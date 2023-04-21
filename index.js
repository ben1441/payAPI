const express = require('express');
const btt = require('./btt');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('server up and running!')
});

app.post('/btt/:op', async (req, res) => {
  try {
    res.status(200).send(await btt[req.params.op](req.body))
  } catch(e) {
    res.send('oops... An error occurred!')
  }
})

app.listen(5000, () => {
  console.log('app started on port 5000')
})
