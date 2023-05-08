const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

fsPromises.readdir(__dirname, {encoding: 'utf-8'})
  .then(data => {
    if (data.includes('files-copy')) {
      // todo: use fs.rmdir() instead
      return fsPromises.rmdir(path.join(__dirname, 'files-copy'), {recursive: true})
    }
  })
  .then(() => {
    copyDir(
      path.join(__dirname, 'files'), 
      path.join(__dirname, 'files-copy')
    );
  })
;

async function copyDir(srcPath, destPath) {
  const entries = await getEntries(srcPath);
  await fsPromises.mkdir(destPath, {recursive: true});
  entries.forEach(entry => {
    const entrySrcPath = path.join(srcPath, entry.name);
    const entryDestPath = path.join(destPath, entry.name);
    if (entry.isDirectory) {
      copyDir(entrySrcPath, entryDestPath);
      return
    }
    fsPromises.copyFile(entrySrcPath, entryDestPath);
  });
}

async function getEntries(src) {
  let result;
  await fsPromises.readdir(src, {withFileTypes: true, encoding: 'utf-8'})
    .then(data => {
      result = data.map(entry => ({
        name: entry.name,
        isDirectory: entry.isDirectory()
      }));
    })
    .catch(err => {
      console.error(err);
    })
  ;
  return result;
}
