var Excel = require('exceljs');

let rlength_session_id = 0;
let allLengthsArray = [];
let c = 0;

var workbook = new Excel.Workbook();
workbook.xlsx.readFile('./excelResult.xlsx')
  .then(function() {
    workbook.eachSheet((sheet, sheetNumber) => {
      sheet.eachRow((row, rowNumber) => {
        let length = row.getCell(11).value;
        if( length && typeof(length) !== "string" ) {
          allLengthsArray.push(length);
        }
      });
    });
    }).then(() => {
      var sum = 0;
      for( var i = 0; i < allLengthsArray.length ; i++ ){
        sum = sum + parseInt( allLengthsArray[i] );
      }
      var avg = sum / (allLengthsArray.length);
      var pagesRatio = 0.4;
      c = (-Math.log10(1 - pagesRatio)) / (1 / avg);

      console.log(c);
      console.log(avg);
    }).then(() => {
        workbook.eachSheet((sheet,sheetNumber) => {
          let allLines = sheet.rowCount;
          let sitting = 0;
          sheet.eachRow((row,rowNumber) => {
            if( rowNumber == 1 ) { return; }

            if( rowNumber != allLines ) {
              let nextRow = sheet.getRow(rowNumber+1);
              let onPageTime = row.getCell(11).value;
              let isSameUser = row.getCell(10).value === nextRow.getCell(10).value;
              let isNavigationSite = true;
              let isLastUser = onPageTime == 'null' ? true : false;
      
              if( !isLastUser && parseInt(onPageTime) > c ) {
                isNavigationSite = false;
              }

              if( !isSameUser || !isNavigationSite || onPageTime ) {
                sitting++;
              }
              row.getCell(13).value = sitting;   
            }
              row.commit();
            });
        });
    }).then(() => {
      console.log('HOTOVO');
      workbook.xlsx.writeFile('./excelResult.xlsx');
    });
