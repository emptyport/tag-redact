const spectrumReader = require('./lib/spectrumReader');

module.exports.redact = (
  {
    fileList=[],
    outputPath='',
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
    tolerance: 20,
    toleranceUnits: 'ppm',
    foldChange: 2,
    reporters: [],
    controls: []
  }) => {
    console.log(fileList);
    fileList.map(file => {
      let processor = spectrumReader.processor(file);
      let result = processor.next();
      while(!result.done) {
        result = processor.next();
      }
    })
}