const fs = require('fs');
const path = require('path');
const { stdin } = process;

const GREETING = 'Hi! Type anything here and it will be in a new file result.txt';
const GOODBYE = 'Good bye and happy coding!';
const FILE_NAME = 'result.txt';

const textFilePath = path.join(__dirname, FILE_NAME);

fs.writeFile(textFilePath, '', err => {
  if (err) {
    console.error(err);
  }
});

console.log(GREETING);

stdin.on('data', data => {
  const text = data.toString();
  if (text.trim() === 'exit') {
    process.exit();
  }
  fs.appendFile(textFilePath, text,
    err => {
      if (err) {
        console.error(err);
        process.exit();
      }
    }
  );
});

process.on('SIGINT', () => {
  console.log();
  process.exit();
});

process.on('exit', () => {
  console.log(GOODBYE);
});
