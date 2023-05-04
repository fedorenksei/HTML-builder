const fs = require('fs');
const path = require('path');

const textFilePath = path.join(__dirname, 'text.txt');
const readableStream = fs.createReadStream(textFilePath, 'utf-8');
readableStream.on('data', (chunk) => {
  console.log(chunk);
});
