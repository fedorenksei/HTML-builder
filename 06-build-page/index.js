const fsPromises = require('fs/promises');
const path = require('path');

const destFolderName = 'project-dist';
const destFolderPath = path.join(__dirname, destFolderName);

fsPromises.readdir(__dirname, {encoding: 'utf-8'})
  .then(data => {
    if (data.includes(destFolderName)) {
      // todo: use fs.rmdir() instead
      return fsPromises.rmdir(destFolderPath, {recursive: true})
    }
  })
  .then(() => {return fsPromises.mkdir(destFolderPath);})
  .then(buildPage)
;

function buildPage() {
  addHtml();
  addCssBundle();
  copyDir(
    path.join(__dirname, 'assets'), 
    path.join(destFolderPath, 'assets')
  );
}

async function addHtml() {
  const componentsFolderPath = path.join(__dirname, 'components');
  const files = await getFilesWithExtension(componentsFolderPath, 'html');
  let template = await fsPromises.readFile(path.join(__dirname, 'template.html'), {encoding: 'utf-8'});
  for (const file of files) {
    const name = path.parse(file).name;
    const placeholder = `{{${name}}}`;
    if (!template.indexOf(placeholder) === -1) continue;
    const component = await fsPromises.readFile(
      path.join(componentsFolderPath, file),
      {encoding: 'utf-8'}
    );
    template = template.replace(placeholder, component);
  }
  fsPromises.writeFile(path.join(destFolderPath, 'index.html'), template);
}

async function addCssBundle() {
  const stylesFolderPath = path.join(__dirname, 'styles');
  let styles = '';
  const cssFiles = await getFilesWithExtension(stylesFolderPath, 'css');
  for (const file of cssFiles) {
    styles += await fsPromises.readFile(
      path.join(stylesFolderPath, file),
      {encoding: 'utf-8'}
    )
  }
  
  fsPromises.writeFile(path.join(destFolderPath, 'style.css'), styles)
}

async function getFilesWithExtension(src, ext) {
  let result;
  await fsPromises.readdir(src, {withFileTypes: true, encoding: 'utf-8'})
    .then(data => {
      result = data
        .filter(entry => {
          if (!entry.isFile()) return false;
          return path.extname(entry.name).replace('.', '') === ext;
        })
        .map(entry => entry.name);
    })
    .catch(err => {
      console.error(err);
    })
  ;
  return result;
}

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
