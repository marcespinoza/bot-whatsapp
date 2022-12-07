const venom = require('venom-bot');
const xl = require('excel4node');
const wb = new xl.Workbook();
const ws = wb.addWorksheet('Worksheet Name'); 
const { google } = require("googleapis");


venom
  .create({
    session: 'session-name', //name of session
    multidevice: true // for version not multidevice use false.(default: true)
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage(async (message) => {
  
  
  });
}

  async function showWelcomeButtons(){

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });
    
      // Create client instance for auth
      const client = await auth.getClient();
    
      // Instance of Google Sheets API
      const googleSheets = google.sheets({ version: "v4", auth: client });
    
      const spreadsheetId = "1927xBquC0QfIBcOHXZ93LfXGbz1RRENP9e3nWXQP3n4";
    
      // Get metadata about spreadsheet
      const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
      });
    
      // Read rows from spreadsheet
      const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "inscriptos!A:A",
      });
    
      //Write row(s) to spreadsheet
      await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "inscriptos!A:F",
        valueInputOption: "USER_ENTERED",
        resource: {
          values: {values:['marcelo']},
        },
      });
    
      console.log("Successfully submitted! Thank you!"+getRows.data);
  }

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
