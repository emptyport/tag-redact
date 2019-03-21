const mgfReader = require('./mgfReader');
const mzmlReader = require('./mzmlReader');

function processor(filename) {
  let extension = filename.substr(filename.lastIndexOf('.'), filename.length);

  if(extension.toLowerCase() === '.mgf') {
    return mgfReader.processor(filename);
  }
  if(extension.toLowerCase() === '.mzml') {
    return mzmlReader.processor(filename);
  }

  return undefined;
}

module.exports.processor = processor;