const fs = require('fs');

module.exports.readDirPromise = (foldername) => {
  filesList = []
  return new Promise((resolve, reject) => {
    fs.readdir(foldername, (err, files) => {
      if (err) {
        if (err.code == 'ENOENT') {
          resolve(0)
        }
        reject(err)
      }
      if (files != undefined) {
        files.forEach(ele => {
          filesList.push(ele)
        })
      }
      resolve(filesList)
    });
  })
}

module.exports.writeFilePromise = (filepathTemplate, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filepathTemplate, data, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports.readFilePromise = (filepathTemplate, type) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepathTemplate, type, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}