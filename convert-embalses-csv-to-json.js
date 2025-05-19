const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const results = [];
let lineCount = 0;

fs.createReadStream(path.join(__dirname, 'csv-json-embalses/BD-Embalses.csv'))
  .pipe(csv({ separator: ',', mapValues: ({ value }) => value.trim() }))
  .on('data', (data) => {
    lineCount++;

    data.AGUA_TOTAL = parseFloat(data.AGUA_TOTAL.replace(',', '.'));
    data.AGUA_ACTUAL = parseFloat(data.AGUA_ACTUAL.replace(',', '.'));
    data.ELECTRICO_FLAG = parseInt(data.ELECTRICO_FLAG, 10);

    results.push(data);
  })
  .on('end', () => {
    fs.writeFileSync('csv-json-embalses/embalses.json', JSON.stringify(results, null, 2), 'utf-8');
    console.log(`✅ File: embalses.json sucessfully created`);
    console.log(`📊 ${lineCount} processed lines`);
  });