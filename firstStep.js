var fs = require('fs'),
  readline = require('readline'),
  stream = require('stream');

var inputFile = fs.createReadStream('./week.log');
var outputFile = fs.createWriteStream('./outputFile.log');
outputFile.readable = true;
outputFile.writable = true;

var numberOfLines = 0;

var readLine = readline.createInterface({
  input: inputFile,
  output: outputFile,
  terminal: false
});

var bannedIpsArray = [];

readLine.on('line', function(inputLine) {
  var ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gm
  if( inputLine.match(/((.*)(robots.txt)(.*\n?))/g) ) {
    var bannedIp = ipRegex.exec(inputLine)[0];
    if( !(bannedIpsArray.indexOf(bannedIp) > 0) ){
      console.log(++numberOfLines);
      bannedIpsArray.push(bannedIp);
      fs.appendFileSync('./bannedIps.txt', '(' + bannedIp + ')'+'|');
    }
  }
}).on('close',function(){
  console.log('HOTOVO');
  outputFile.close();
})
