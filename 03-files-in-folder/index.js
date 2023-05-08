const path = require('path');
const fsPromises = require('fs/promises');

const FOLDER_NAME = 'secret-folder';

const dirPath = path.join(__dirname, FOLDER_NAME);
fsPromises.readdir(dirPath, {withFileTypes: true, encoding: 'utf-8'})
  .then(async data => {
    const files = [];
    for (const entry of data) {
      if (!entry.isFile()) continue;
      const name = entry.name;
      const stats = await fsPromises.stat(path.join(dirPath, name));
      files.push([name, stats]);
    }
    return files;
  })
  .then((data) => {
    data.forEach(([name, stats]) => {
      const extension = path.extname(name).slice(1);
      const nameWithoutExtension = path.parse(name).name;
      size = stats.size + ' Bytes';
      console.log([nameWithoutExtension, extension, size].join(' - '))
    })
  })
  .catch(err => {
    console.error(err);
  })
