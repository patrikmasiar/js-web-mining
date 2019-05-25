var Excel = require('exceljs');

var workbook = new Excel.Workbook();
workbook.xlsx.readFile('./excelResult.xlsx').then(function() {
    workbook.eachSheet((sheet,sheetNumber) => {

      let totalLines = sheet.rowCount;
      let sttq = 0;
      var q = 27.5;
      sheet.eachRow((row, rowNumber) => {
        if( rowNumber == 1 ) { return; }

        if( rowNumber != totalLines ) {
          row.getCell(14).value = 'null';
          let nextRow = sheet.getRow(rowNumber + 1);
          let isSameUser = row.getCell(10).value === nextRow.getCell(10).value;
          let timeDifference = nextRow.getCell(9).value - row.getCell(9).value;
          let isSameSession = timeDifference <= q;

          if( isSameUser && isSameSession ) {
            row.getCell(14).value = timeDifference;
          } else {
              sttq++;
          }
        }

        row.getCell(15).value = sttq;
        row.commit();

      });
    });
}).then(() => {
  console.log('HOTOVO');
  workbook.xlsx.writeFile('./excelResult.xlsx');
})
