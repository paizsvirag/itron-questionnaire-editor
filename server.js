'use strict';

const express = require('express'),
  path = require('path'),
  app = express(),
  fs = require('fs'),
  PORT = 3000;

app.use(express.static(__dirname));
app.use('/static', express.static('static'));

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './static/index.html'));
});

app.get('/questions', (req, res) => {
  res.sendFile(path.join(__dirname, 'source/questions.json'));
});

app.post('/create-questions', (req, res) => {
  let question = req.body.question;
  let answer = req.body.answer;
  let id = req.body.id;
  let creationDate = req.body.creationDate;
  let rawData = fs.readFileSync('source/questions.json');
  let questions = JSON.parse(rawData);
  let newQuestion = {
    "id": id,
    "question": question,
    "answer": answer,
    "creationDate": creationDate,
  }
  let results = questions.push(newQuestion);
  let parsedResults = JSON.stringify(questions);
  console.log(parsedResults, questions);
  fs.writeFileSync('source/questions.json', parsedResults, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
  res.json({
    results
  });
})

app.put('/questions/:id', (req, res) => {
  const id = req.params.id;
  let rawData = fs.readFileSync('source/questions.json');
  let questions = JSON.parse(rawData);
  let foundQuestion = questions.filter( resQuestion => id == resQuestion.id)[0];
  foundQuestion.question = req.body.question;
  foundQuestion.answer = req.body.answer;
  let results = questions.map( elem => elem.id != id ? elem : foundQuestion );
  let parsedResults = JSON.stringify(results);
  fs.writeFileSync('source/questions.json', parsedResults, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
  res.json({
    results
  });
})

app.delete('/questions/:id', (req, res) => {
  const id = req.params.id;
  let rawData = fs.readFileSync('source/questions.json');
  let questions = JSON.parse(rawData);
  let results = questions.filter( resQuestion => id != resQuestion.id);
  let parsedResults = JSON.stringify(results);
  fs.writeFileSync('source/questions.json', parsedResults, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
  res.json({
    results
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});