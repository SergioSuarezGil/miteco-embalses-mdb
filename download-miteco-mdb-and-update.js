const fs = require('fs');
const path = require('path');
const https = require('https');
const AdmZip = require('adm-zip');

const ZIP_URL = 'https://www.miteco.gob.es/content/dam/miteco/es/agua/temas/evaluacion-de-los-recursos-hidricos/boletin-hidrologico/Historico-de-embalses/BD-Embalses.zip';
const LOCAL_ZIP = path.join(__dirname, 'bd-embalses/BD-Embalses.zip');
const OUTPUT_DIR = path.join(__dirname, 'bd-embalses');
const LAST_UPDATE_FILE = path.join(__dirname, 'last-update.json');

// Read last update
function getLastUpdateDate() {
  if (!fs.existsSync(LAST_UPDATE_FILE)) return null;
  const data = JSON.parse(fs.readFileSync(LAST_UPDATE_FILE, 'utf8'));
  return new Date(data.lastUpdate);
}

// Get remote Last-Modified header using https.get
function getRemoteLastModified(url) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method: 'HEAD' }, (res) => {
      const lastMod = res.headers['last-modified'];
      if (lastMod) {
        resolve(new Date(lastMod));
      } else {
        reject(new Error('Last-Modified header not found'));
      }
    });
    req.on('error', reject);
    req.end();
  });
}

// Download file via https and save
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download file: ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', reject);
  });
}

// Extract ZIP
function unzipFile(zipPath, outputDir) {
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(outputDir, true);
  console.log('✅ ZIP extracted');
}

// Save last update
function saveLastUpdate(date) {
  fs.writeFileSync(LAST_UPDATE_FILE, JSON.stringify({ lastUpdate: date.toISOString() }, null, 2));
  console.log(`📅 Updated last-update.json to ${date.toISOString()}`);
}

// Main flow
(async () => {
  const lastLocalDate = getLastUpdateDate();
  const remoteDate = await getRemoteLastModified(ZIP_URL);

  if (!lastLocalDate || remoteDate > lastLocalDate) {
    console.log('⬇️ New version detected.');
    console.log(`🗓️  Local version: ${lastLocalDate?.toISOString() || 'none'}`);
    console.log(`🆕 Remote version: ${remoteDate.toISOString()}`);

    await downloadFile(ZIP_URL, LOCAL_ZIP);
    console.log('📥 ZIP file downloaded');

    unzipFile(LOCAL_ZIP, OUTPUT_DIR);
    saveLastUpdate(remoteDate);
  } else {
    console.log('📦 No changes detected since last update.');
  }
})();