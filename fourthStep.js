var Excel = require('exceljs');

var workbook = new Excel.Workbook();
workbook.xlsx.readFile('./excelResult.xlsx').then(function() {
    workbook.eachSheet((sheet,sheetNumber) => {

      let totalLines = sheet.rowCount;
      let sitting = 0;
      var oneHour = 3600;
      sheet.eachRow((row, rowNumber) => {
        if( rowNumber == 1 ) { return; }

        if( rowNumber != totalLines ) {
          row.getCell(11).value = 'null';
          let nextRow = sheet.getRow(rowNumber + 1);
          let isSameUser = row.getCell(10).value === nextRow.getCell(10).value;
          let timeDifference = nextRow.getCell(9).value - row.getCell(9).value;
          let isSameSession = timeDifference <= oneHour;

          if( isSameUser && isSameSession ) {
            row.getCell(11).value = timeDifference;
          } else {
              sitting++;
          }
        }

        row.getCell(12).value = sitting;
        row.commit();

      });
    });
}).then(() => {
  console.log('HOTOVO');
  workbook.xlsx.writeFile('./excelResult.xlsx');
})
