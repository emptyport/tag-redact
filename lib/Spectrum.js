export default class Spectrum {
  constructor(mz, intensity, precursor, charge, rt) {
    this.mz = mz;
    this.intensity = intensity;
    this.precursor = precursor;
    this.charge = charge;
    this.rt = rt;
  }
}