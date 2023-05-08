const fsPromises = require('fs/promises');
const path = require('path');

const destFolderName = 'project-dist';
const destFolderPath = path.join(__dirname, destFolderName);

fsPromises.readdir(__dirname, {encoding: 'utf-8'})
  .then(data => {
    if (!data.includes(destFolderName)) {
      return fsPromises.mkdir(destFolderPath);
    }
  })
  .then(addCssBundle)
;

async function addCssBundle() {
  const stylesFolderPath = path.join(__dirname, 'styles');
  let styles = '';
  const cssFiles = await getCssFiles(stylesFolderPath);
  for (const file of cssFiles) {
    styles += await fsPromises.readFile(
      path.join(stylesFolderPath, file),
      {encoding: 'utf-8'}
    )
  }
  
  fsPromises.writeFile(path.join(destFolderPath, 'bundle.css'), styles)
}

async function getCssFiles(src) {
  let result;
  await fsPromises.readdir(src, {withFileTypes: true, encoding: 'utf-8'})
    .then(data => {
      result = data
        .filter(entry => {
          if (!entry.isFile()) return false;
          return path.extname(entry.name) === '.css'
        })
        .map(entry => entry.name);
    })
    .catch(err => {
      console.error(err);
    })
  ;
  return result;
}
