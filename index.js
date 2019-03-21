const spectrumReader = require('./lib/spectrumReader');

module.exports.redact = (
  {
    fileList=[],
    outputPath='',
    msLevel=2,
    tolerance=20,
    toleranceUnits='ppm',
    foldChange=2,
    reporters=[],
    controls=[]
  }
  =
  {
    fileList: [],
    outputPath: '',
    msLevel: 2,
    tolerance: 20,
    toleranceUnits: 'ppm',
    foldChange: 2,
    reporters: [],
    controls: []
  }) => {
    console.log(fileList);
    fileList.map(file => {
      let processor = spectrumReader.processor(file);
    })
}