class HexNumber {
  constructor() {
    this.num = "";
  }
  // utility
  static isValidDigit(d) {
    const hexRegex = /^(0x|0X)?[0-9a-fA-F]+$/;
    return hexRegex.test(d);
  }
  static toInt(a) {
    return parseInt(a, 16);
  }
  static toHex(a) {
    return a.toString(16).toUpperCase();
  }
  // Arithematic
  static add(a, b) {
    a = HexNumber.toInt(a);
    b = HexNumber.toInt(b);
    a += b;
    return HexNumber.toHex(a);
  }
}
export {HexNumber};