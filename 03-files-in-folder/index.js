const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const { log, error } = require('console');

const FOLDER_NAME = 'secret-folder';

const dirPath = path.join(__dirname, FOLDER_NAME);
fsPromises.readdir(dirPath, {withFileTypes: true, encoding: 'utf-8'})
  .then(data => {
    for (const entry of data) {
      if (!entry.isFile()) continue;
      const name = entry.name;
      const extension = path.extname(name).slice(1);
      const nameWithoutExtension = path.parse(name).name;
      let size;
      fs.stat(
        path.join(dirPath, name), 
        (error, stats) => {
          if (error) {
            log(error);
            return;
          }
          size = stats.size + ' Bytes';
          console.log([nameWithoutExtension, extension, size].join(' - '))
        }
      );
    }
  })
