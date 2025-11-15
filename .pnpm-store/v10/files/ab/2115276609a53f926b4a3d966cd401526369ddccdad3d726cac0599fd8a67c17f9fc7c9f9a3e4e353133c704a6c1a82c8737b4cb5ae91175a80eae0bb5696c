

var express = require('express')
var app = express()
var fs = require('fs')

var input = fs.readFileSync('./tmp/input.txt')
var index = fs.readFileSync('./index.html').toString()

app.get('/d3.js', function(req, res){
  res.header('Content-Type', 'text/javascript')
  fs.createReadStream('./node_modules/d3/d3.js').pipe(res)
})

app.get('/', function(req, res){
  res.header('Content-Type', 'text/html')
  res.send(index.replace('{{data}}', input))
})

app.listen(9081)