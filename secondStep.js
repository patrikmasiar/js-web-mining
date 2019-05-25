var fs = require('fs'),
  readline = require('readline'),
  stream = require('stream');

var inputFile = fs.createReadStream('./week.log');
var outputFile = fs.createWriteStream('./filteredOutput.log');
outputFile.readable = true;
outputFile.writable = true;

var numberOfLines = 0;

var readLine = readline.createInterface({
  input: inputFile,
  output: outputFile,
  terminal: false
});

readLine.on('line', function(inputLine) {
  var bannedIpsRegex = new RegExp('(.*)'+fs.readFileSync('./bannedIps.txt')+'(.*\n?)','g');
  if(!inputLine.match(bannedIpsRegex) && !inputLine.match(/((.*)((qqq )([4-5][0-9][0-9]))(.*\n?))|((.*)([/][^/]*)([.])(js|jpg|jpeg|css|png|flv|gif|ico|jpeg|swf|rss|xml|cur|bmp|spider|ico)(.*\n?))|((.*)((crawl)|(spider)|(bot))(.*\n?))|((.*)(qqq "-" qqq)(.*\n?))/g)) {
    console.log(++numberOfLines);
    outputFile.write(inputLine+'\n');
  }
}).on('close',function(){
  console.log('HOTOVO');
  outputFile.close();
});
