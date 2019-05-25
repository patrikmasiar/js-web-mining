var fs = require('fs'),
  readline = require('readline'),
  stream = require('stream'),
  Excel = require('exceljs'),
  moment = require('moment')
  backwardsStream = require('fs-backwards-stream');
  lineReader = require('reverse-line-reader');

var inputFile = backwardsStream('./week.log');
var outputFile = fs.createWriteStream('./outputFile1.log');
outputFile.readable = true;
outputFile.writable = true;

var readLine = readline.createInterface({
  input: inputFile,
  output: outputFile,
  terminal: false
});

var numberOfLines = 0;
var workbook = new Excel.Workbook();
var sheet = workbook.addWorksheet('sheet');

sheet.columns = [
  { header: 'IP', key: 'ip'}, // index 0
  { header: 'Cookie', key: 'cookie' }, // index 1
  { header: 'DTime', key: 'dtime' }, // index 2
  { header: 'StatusCode', key: 'status_code' }, // index 3
  { header: 'URL', key: 'url' }, // index 4
  { header: 'Agent', key: 'agent' }, // index 5
  { header: 'RequestMethod', key: 'request_method' }, // index 6
  { header: 'Referrer', key: 'referrer' }, // index 7
  { header: 'UnixTime', key: 'unix_time' }, // index 8
  { header: 'UserId', key: 'user_id' }, // index 9
  { header: 'Length', key: 'length' }, // index 10
  { header: 'STT', key: 'sitting' },// index 11
  { header: 'RLength', key: 'r_length' },// index 12
  { header: 'QLength', key: 'q_length' }, //index 13
  { header: 'STT_Q', key: 'stt_q' },// index 14
  { header: 'SLength', key: 's_length' },// index 15
  { header: 'stt_s', key: 'stt_s' }, // index 16
];

// DEFINE ARRAYS
var usersArray = [];
var timesOnPageArray = [];
var userSittings = [];

lineReader.eachLine('./filteredOutput.log', function(inputLine) {
  if( inputLine != undefined && inputLine.length > 3 ) {
    numberOfLines++;
    console.log(numberOfLines);
    var tempArr = inputLine.split(' qqq ');
    var front = tempArr[0].split(' ');
    tempArr.shift();
    var tempArr2 = front.concat(tempArr);
    var mr = tempArr2[3].split(" /");
    var finalArray = tempArr2.concat(mr);
    finalArray.splice(3,1);

    var datetime = inputLine.substring(inputLine.lastIndexOf("23/Sep/2013:"), inputLine.lastIndexOf(" +0200")).split('/').join('-').replace(':',' ');
    var timestamp =  (Date.parse(datetime)/1000)+7200;
    //console.log(timestamp)
    finalArray.push(timestamp);

    var userIp = finalArray[0];
    var userAgent = finalArray[5];
    let ipAndAgent = userIp + userAgent;

    if( usersArray.indexOf(ipAndAgent) == -1 ) {
      usersArray.push(ipAndAgent);
      userSittings.push(1);
    }

    finalArray.push(usersArray.indexOf(ipAndAgent));

    sheet.addRow(finalArray);
  }
}).then(function () {
  console.log('HOTOVO');
  workbook.xlsx.writeFile("./excelResult.xlsx");
});
