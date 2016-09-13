const path = require('path');
const express = require('express');
const app = express();
const url = require('url');

var server = require('http').createServer();
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: server, path: "/quiz" });
var port = 3000;

//questions
const questions = require('./questions.json');

//[{user: "user1", ws: ws1}, {user: "user2", ws: ws2}, ///]
var connections = [];

function broadcast(message) {
  console.log(message);
  connections.forEach((con) => {
    con.ws.send(message);
  });
}

//wssはwebsocket全体のオブジェクト、wsは各クライアントに割り当てられたsocket
wss.on('connection', (ws) => {
  var location = url.parse(ws.upgradeReq.url, true);
  const name = location.query.name;
  const dept = location.query.dept;
  var answeredNum = 0;

  const user = dept + "_" + name;

  console.log("user: " + user + ', joined');
  connections.push({user: user, ws: ws});

  ws.on('close', () => {
    connections = connections.filter(con => con.ws !== ws);
    console.log(user + " exited!");
  });

  ws.on('message', message => {
    console.log("user: " + user + ', message: ', message);
    if(JSON.parse(message).answer !== undefined){
      const numObj = {answeredNum: ++ answeredNum};
      broadcast(JSON.stringify(numObj))
    }
  });

  console.log(user + " joined!");
});

app.use('/dist', express.static('dist'));
app.use('/public', express.static('public'));

app.post('/api/quizs/:num', (req, res) => {
  const quizNum = req.params.num;
  const obj = {quizNum: Number(quizNum)};
  broadcast(JSON.stringify(obj));
  res.status(200).json(obj);
});

app.get('/api/questions', (req, res) => {
  res.status(200).json(questions);
});

app.post('/api/answers/:num', (req, res) => {
  const answerNum = req.params.num;
  const obj = {answerNum: Number(answerNum)};
  const isCorrect = obj.answerNum % 2 === 0;
  broadcast(JSON.stringify({isCorrect: isCorrect}));
  res.status(200).json(obj);
});

//上位50位まで表示
app.get('/api/rankList', (req, res) => {
  const obj = [
    {rank: 1, name: "部署１ 山田", correctNum: 10, time: "10:00:00"},
    {rank: 2, name: "部署１ 山田2", correctNum: 9, time: "10:00:00"},
    {rank: 3, name: "部署１ 山田3", correctNum: 8, time: "10:00:00"},
    {rank: 4, name: "部署１ 山田4", correctNum: 7, time: "10:00:00"},
    {rank: 5, name: "部署１ 山田5", correctNum: 6, time: "10:00:00"},
    {rank: 6, name: "部署１ 山田1", correctNum: 5, time: "10:00:00"},
    {rank: 7, name: "部署１ 山田2", correctNum: 5, time: "10:00:00"},
    {rank: 8, name: "部署１ 山田3", correctNum: 5, time: "10:00:00"},
    {rank: 9, name: "部署１ 山田4", correctNum: 5, time: "10:00:00"},
    {rank: 10, name: "部署１ 山田5", correctNum: 5, time: "10:00:00"},
    {rank: 11, name: "部署１ 山田1", correctNum: 5, time: "10:00:00"},
    {rank: 12, name: "部署１ 山田2", correctNum: 5, time: "10:00:00"},
    {rank: 13, name: "部署１ 山田3", correctNum: 5, time: "10:00:00"},
    {rank: 14, name: "部署１ 山田4", correctNum: 5, time: "10:00:00"},
    {rank: 15, name: "部署１ 山田5", correctNum: 5, time: "10:00:00"},
    {rank: 16, name: "部署１ 山田1", correctNum: 5, time: "10:00:00"},
    {rank: 17, name: "部署１ 山田2", correctNum: 5, time: "10:00:00"},
    {rank: 18, name: "部署１ 山田3", correctNum: 5, time: "10:00:00"},
    {rank: 19, name: "部署１ 山田4", correctNum: 5, time: "10:00:00"},
    {rank: 20, name: "部署１ 山田5", correctNum: 5, time: "10:00:00"}
  ];
  res.status(200).json(obj);
});

app.get('/api/mostClicker', (req, res) => {
  const obj = {name: "開発 uryyyyyyy", num: 151};
  res.status(200).json(obj);
});

//react-routerでroutingするためにつけている。
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

server.on('request', app);
server.listen(port, () => console.log('Listening on ' + server.address().port));