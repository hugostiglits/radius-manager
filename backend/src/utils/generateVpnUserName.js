const fs = require('node:fs');
const path = require('node:path');
const { randomInt } = require('node:crypto');

const dictionaryPath = path.join(
  __dirname,
  '../../data/eff_large_wordlist.txt'
);

const words = fs.readFileSync(dictionaryPath, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.split('\t')[1]?.trim())
  .filter((word) => /^[a-z]+$/.test(word));

if (words.length < 1000) {
  throw new Error('VPN wordlist is missing or incomplete');
}

function generateVpnUsername(siteUsername) {
  if (typeof siteUsername !== 'string' || !siteUsername.trim()) {
    throw new Error('Site username is required');
  }

  const word = words[randomInt(words.length)];
  return `${siteUsername}_${word}`;
}

function generateVpnPassphrase() {
    return Array.from(
        { length: 6 },
        () => words[randomInt(words.length)]
    ).join('-');
}



module.exports = {
    generateVpnUsername,
    generateVpnPassphrase,
};