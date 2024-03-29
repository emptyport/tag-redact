const base64 = require('base64-js');
const pako = require('pako');
const readChunk = require('read-chunk');
const xmlConvert = require('xml-js');
const fs = require('fs');

function getFilesizeInBytes(filename) {
  let stats = fs.statSync(filename);
  let fileSizeInBytes = stats["size"];
  return fileSizeInBytes;
}

function getChunk(filename, start, length) {
  return readChunk.sync(filename, start, length).toString();
}

function getIndex(filename) {
  let fileSize = getFilesizeInBytes(filename);
  let readLength = 1024

  let chunk = getChunk(filename, fileSize-readLength, readLength);
  let startIndex = chunk.indexOf('<indexList ');
  while(startIndex===-1) {
    readLength += 1024*1024;
    chunk = getChunk(filename, fileSize-readLength, readLength);
    startIndex = chunk.indexOf('<indexList ');
  }
  let indexStart = chunk.indexOf('<index name="spectrum">');
  let indexEnd = chunk.indexOf('</index>')+8;
  
  let index = chunk.substring(indexStart, indexEnd);
  let parsedIndex = JSON.parse(xmlConvert.xml2json(index, {compact: true, spaces: 2}));
  let indexList = parsedIndex['index']['offset'].map((entry) => {
    return {
      id: entry._attributes.idRef,
      offset: parseInt(entry._text)
    };
  });
  indexList.push({
    id: 'eof',
    offset: fileSize
  });
  
  return indexList;
}

function decodeData(raw, bitType, isCompressed) {
  let buffer = base64.toByteArray(raw);
  if (isCompressed) {
    buffer = pako.inflate(buffer);
  }

  if (bitType === '32') {
    return new Float32Array(buffer.buffer);
  }
  else if (bitType === '64') {
    return new Float64Array(buffer.buffer);
  }
  else {
    return [];
  }
}

function getMSLevel(cvParam) {
  for(let i=0; i<cvParam.length; i++) {
    let item = cvParam[i];
    if(item._attributes.name === 'ms level') {
      let msLevel = parseInt(item._attributes.value);
      return msLevel;
    }
  }
  return -1;
}

function* processor(filename) {
  let msTwo = {};
  let msThree = {};

  let index = getIndex(filename);
  for(let i=0; i<index.length-1; i++) {
    let chunk = getChunk(filename, index[i].offset, index[i+1].offset-index[i].offset);
    let startIndex = chunk.indexOf('<spectrum ');
    let endIndex = chunk.indexOf('</spectrum>')+11;
    let rawSpectrum = chunk.substring(startIndex, endIndex);
    let parsedSpectrum = xmlConvert.xml2json(rawSpectrum, {compact: true, spaces: 2});

    let spectrum = JSON.parse(parsedSpectrum).spectrum;
    let msLevel = getMSLevel(spectrum.cvParam);

    switch(msLevel) {
      case 1:
        if(Object.keys(msThree).length > 0) {
          msTwo = mergeReporters(msTwo, msThree)
        }

        msTwo = {};
        msThree = {};
        break;
      case 2:
        msTwo[spectrum._attributes.id] = spectrum;
        break;
      case 3:
        msThree[spectrum._attributes.id] = spectrum;
        break;
      default:
        break;
    }





    yield 1;
    

  }
  return;
}
  
module.exports.processor = processor;