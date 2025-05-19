# miteco-embalses-mdb

## 🧩 Scripts Overview

### download-miteco-mdb-and-update.js

This script automates the process of retrieving the latest water reservoir data from Spain’s Ministry for the Ecological Transition (MITECO):

• 📅 Reads the last known update timestamp from last-update.json.

• 🌐 Sends a HEAD request to the official MITECO ZIP file to check if it has changed.

• 📥 Downloads the ZIP file only if the remote version is newer.

• 📦 Extracts the MDB database file (BD-Embalses.mdb) to the local directory.

• 📝 Updates the last-update.json file with the latest remote modification date.

Ensures you only download new data when it’s actually updated, saving bandwidth and keeping your dataset fresh.

### convert-csv-to-json.js

This script reads a local CSV file (previusly converted from the historical mdb) this containing historical data about Spanish reservoirs and converts it to a structured JSON format:

• 🔍 Parses each row of BD-Embalses.csv using csv-parser.

• 🔢 Normalizes numeric fields (replacing comma decimal separators with periods).

• ✅ Converts the result into a clean JSON array.

• 💾 Saves the output to embalses.json in the same folder.

• 📊 Logs the number of processed records to the console.

Ideal for preparing data extracted from the MDB or exported from Excel to a clean, readable JSON format ready for analysis or API consumption.

TODO: Create a MongoDB Database to save all of this data.

Example data:

```
 {
    "AMBITO_NOMBRE": "Tajo",
    "EMBALSE_NOMBRE": "Finisterre",
    "FECHA": "1994-03-08 00:00:00",
    "AGUA_TOTAL": 133,
    "AGUA_ACTUAL": 0,
    "ELECTRICO_FLAG": 0
  },
```
