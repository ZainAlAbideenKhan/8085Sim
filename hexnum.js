class BinNumber {
  static toNearestByte(a) {
    if (a.length % 8 == 0) return a;
    let remain_len = 8 - (a.length % 8);
    a = "0".repeat(remain_len) + a;
    return a;
  }
  static HextoBin(a) {
    a = HexNumber.toInt(a);
    a = a.toString(2);
    return BinNumber.toNearestByte(a);
  }
  static toInt(a) {
    return parseInt(a, 2);
  }
  // binary bit by bit addition
  static add(a, b) {
    a = a.split("").reverse();
    b = b.split("").reverse();

    let carry = 0;
    let count1 = 0;
    for (let i = 0; i < b.length; i++) {
      let bit_sum = parseInt(a[i]) + parseInt(b[i]) + carry;
      carry = parseInt(bit_sum / 2);
      bit_sum %= 2;
      a[i] = bit_sum;
      if (bit_sum) count1++;
    }
    a = a.reverse().join("");

    // set flags
    if (carry) {
      opp_cache.CY = true;
    } else {
      opp_cache.CY = false;
    }
    if (a[4] == "1") {
      opp_cache.AC = true;
    } else {
      opp_cache.AC = false;
    }

    if (count1 == 0) {
      opp_cache.Z = true;
    } else {
      opp_cache.Z == false;
    }

    if (a[0] == "1") {
      opp_cache.S = true;
    } else {
      opp_cache.S = false;
    }

    if (count1 % 2 == 0) {
      opp_cache.P = true;
    } else {
      opp_cache.P = false;
    }

    return a;
  }
  // binary compliments
  static compliment(num, compliment = 1) {
    if (compliment > 2 && compliment < 1) {
      console.error(
        `cannot perform ${compliment} compliment on Binary numnber`
      );
      return num;
    }

    num = num.split("");
    // 1's compliment of num
    num.forEach((i, idx) => {
      num[idx] = i == "0" ? "1" : "0";
    });
    num = num.join("");

    if (compliment == 2) {
      // 2's compliment of num
      num = BinNumber.add(num, "00000001");
    }
    return num;
  }
  // binary compliment subtraction method
  static sub(a, b) {
    let comp_b = BinNumber.compliment(b, 2);
    let diff = BinNumber.add(a, comp_b);

    if (BinNumber.toInt(a) < BinNumber.toInt(b)) {
      opp_cache.CY = true;
    } else {
      opp_cache.CY = false;
    }
    if (a[4] != "1") {
      opp_cache.AC = true;
    } else {
      opp_cache.AC = false;
    }
    return diff;
  }
}

class HexNumber {
  // utility
  static isValidDigit(d) {
    const Regex = /^(0x|0X)?[0-9a-fA-F]+$/;
    return Regex.test(d);
  }
  static toInt(a) {
    return parseInt(a, 16);
  }
  static toHex(a) {
    return a.toString(16).toUpperCase();
  }
  static BintoHex(a) {
    // let orig_len = a.length;
    a = BinNumber.toInt(a);
    return HexNumber.toHex(a);
  }
  static truncateHex(a, dig) {
    if (dig >= a.length) return a;
    return a.slice(a.length - dig, a.length);
  }
  // Arithematic
  // special subtract 1 for address
  static decHex(a) {
    a = HexNumber.toInt(a);
    if (a == 0) {
      opp_cache.CY = false;
      return "FF";
    }
    return HexNumber.toHex(a - 1);
  }
  // special addition for PrgmCounter
  static addHex(a, b) {
    a = HexNumber.toInt(a);
    b = HexNumber.toInt(b);
    return HexNumber.toHex(a + b);
  }

  static add(a, b) {
    a = BinNumber.HextoBin(a);
    b = BinNumber.HextoBin(b);
    let result = BinNumber.add(a, b);

    result = HexNumber.BintoHex(result);
    HexNumber.truncateHex(result, 2);
    return result;
  }
  static sub(a, b) {
    a = BinNumber.HextoBin(a);
    b = BinNumber.HextoBin(b);
    let result = BinNumber.sub(a, b);
    result = HexNumber.BintoHex(result);

    HexNumber.truncateHex(result, 2);
    return result;
  }
}

export { HexNumber };
