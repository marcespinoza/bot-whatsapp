const headingColumnNames = [
    "Name",
    "Email",
    "Mobile",
]
const data = [
    {
      "name":"Shadab Shaikh",
      "email":"shadab@gmail.com",
      "mobile":"1234567890"
    }
  ]

let headingColumnIndex = 1;
headingColumnNames.forEach(heading => {
    ws.cell(1, headingColumnIndex++)
        .string(heading)
});
let rowIndex = 2;
data.forEach( record => {
    let columnIndex = 1;
    Object.keys(record ).forEach(columnName =>{
        ws.cell(rowIndex,columnIndex++)
            .string(record [columnName])
    });
    rowIndex++;
});
wb.write('filename.xlsx');