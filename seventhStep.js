var Excel = require('exceljs');

var workbook = new Excel.Workbook();
workbook.xlsx.readFile('./excelResult.xlsx').then(function() {
    workbook.eachSheet((sheet,sheetNumber) => {

      let totalLines = sheet.rowCount;
      let slength = 0;
      var tenMinutes = 600;
      sheet.eachRow((row, rowNumber) => {
        if( rowNumber == 1 ) { return; }

        if( rowNumber != totalLines ) {
          row.getCell(16).value = 'null';
          let nextRow = sheet.getRow(rowNumber + 1);
          let isSameUser = row.getCell(10).value === nextRow.getCell(10).value;
          let timeDifference = nextRow.getCell(9).value - row.getCell(9).value;
          let isSameSession = timeDifference <= tenMinutes;

          if( isSameUser && isSameSession ) {
            row.getCell(16).value = timeDifference;
          } else {
              slength++;
          }
        }

        row.getCell(17).value = slength;
        row.commit();

      });
    });
}).then(() => {
  console.log('HOTOVO');
  workbook.xlsx.writeFile('./excelResult.xlsx');
})
