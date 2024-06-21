import { HexNumber } from "./hexnum.js";

class MP8085ExeEngine {
  constructor() {}
  execEngine() {
    let instr_name = this.fetchInstrName();
    if (instr_name == null) return;
    let termination = false;

    this.resolveReg_M();

    switch (instr_name) {
      case "MOV":
        termination = this.MOV();
        break;
      case "MVI":
        termination = this.MVI();
        break;
      case "LXI":
        termination = this.LXI();
        break;
      case "LDA":
        termination = this.LDA();
        break;
      case "STA":
        termination = this.STA();
        break;
      case "LHLD":
        termination = this.LHLD();
        break;
      case "SHLD":
        termination = this.SHLD();
        break;
      case "LDAX":
        termination = this.LDAX();
        break;
      case "STAX":
        termination = this.STAX();
        break;
      case "XCHG":
        termination = this.XCHG();
        break;
      case "ADD":
        termination = this.ADD();
        break;
      case "ADI":
        termination = this.ADI();
        break;
      case "SUB":
        termination = this.SUB();
        break;
      case "SUI":
        termination = this.SUI();
        break;
      case "INR":
        termination = this.INR();
        break;
      case "DCR":
        termination = this.DCR();
        break;
      case "INX":
        termination = this.INX();
        break;
      case "DCX":
        termination = this.DCX();
        break;
      case "DAD":
        termination = this.DAD();
        break;
      case "CMA":
        termination = this.CMA();
        break;
      case "CMP":
        termination = this.CMP();
        break;
      case "CPI":
        termination = this.CPI();
        break;
      case "JMP":
        termination = this.JMP();
        break;
      case "JC":
        termination = this.JC();
        break;
      case "JNC":
        termination = this.JNC();
        break;
      case "JZ":
        termination = this.JZ();
        break;
      case "JNZ":
        termination = this.JNZ();
        break;
      case "CALL":
        termination = this.CALL();
        break;
      case "RET":
        termination = this.RET();
        break;
      case "RST":
        termination = this.RST();
        break;
      case "PUSH":
        termination = this.PUSH();
        break;
      case "POP":
        termination = this.POP();
        break;
      case "IN":
        termination = this.IN();
        break;
      case "OUT":
        termination = this.OUT();
        break;
      case "HLT":
        termination = this.HLT();
        break;
      default:
        termination = true;
        break;
    }
    if (termination) return;
    this.execEngine();
  }

  // utility
  resolveReg_M() {
    let a = this.getReg("L");
    a = this.getReg("H") + a;
    a = this.fetchData(a);
    this.setReg("M", a);
  }

  fetchInstrName() {
    if (this.registers.PrgmCount in this.ram.memory_map) {
      let instr = this.ram.memory_map[this.registers.PrgmCount];
      return instr.split(" ")[0];
    } else return null;
  }

  inrPrgmCount() {
    this.registers.PrgmCount = HexNumber.addHex(this.registers.PrgmCount, 1);
  }

  setPrgmCount(adr) {
    this.registers.PrgmCount = adr;
  }

  fetchData(adr = null) {
    if (adr != null) {
      if (adr in this.ram.memory_map) {
        return this.ram.memory_map[adr];
      } else {
        return "00";
      }
    } else if (this.registers.PrgmCount in this.ram.memory_map) {
      let data = this.ram.memory_map[this.registers.PrgmCount];
      return data;
    } else return null;
  }

  storeData(adr, data) {
    this.ram.memory_map[adr] = data;
  }

  splitInstr() {
    let instr = this.ram.memory_map[this.registers.PrgmCount];
    instr = instr.split(/[\s,]+/);
    return instr;
  }

  setReg(reg, data) {
    this.registers[reg] = data;
  }

  getReg(reg) {
    return this.registers[reg];
  }

  // instruction

  MOV() {
    let instr = this.splitInstr();
    this.registers[instr[1]] = this.registers[instr[2]];

    this.inrPrgmCount();
    return false;
  }
  MVI() {
    let reg = this.splitInstr()[1];
    this.inrPrgmCount();
    this.setReg(reg, this.fetchData());

    this.inrPrgmCount();
    return false;
  }
  LXI() {
    let reg = this.splitInstr()[1];
    this.inrPrgmCount();

    if (reg == "B") {
      this.setReg("C", this.fetchData());
    } else if (reg == "D") {
      this.setReg("E", this.fetchData());
    } else if (reg == "H") {
      this.setReg("L", this.fetchData());
    }

    this.inrPrgmCount();
    this.setReg(reg, this.fetchData());

    this.inrPrgmCount();
    return false;
  }
  LDA() {
    this.inrPrgmCount();
    let adr = this.fetchData();
    this.inrPrgmCount();
    adr = this.fetchData() + adr;
    if (adr in this.ram.memory_map) {
      this.setReg("A", this.ram.memory_map[adr]);
    } else {
      this.setReg("A", "00");
    }

    this.inrPrgmCount();
    return false;
  }
  STA() {
    this.inrPrgmCount();
    let adr = this.fetchData();
    this.inrPrgmCount();
    adr = this.fetchData() + adr;
    this.ram.memory_map[adr] = this.registers.A;

    this.inrPrgmCount();
    return false;
  }
  LHLD() {
    this.inrPrgmCount();
    let l_bit = this.fetchData();
    this.inrPrgmCount();
    let h_bit = this.fetchData();
    this.setReg("H", h_bit);
    this.setReg("L", l_bit);

    this.inrPrgmCount();
    return false;
  }
  SHLD() {
    let h_bit = this.getReg("H");
    let l_bit = this.getReg("L");

    this.inrPrgmCount();
    let adr_Lbit = this.fetchData();
    this.storeData(adr_Lbit, l_bit);

    this.inrPrgmCount();
    let adr_Hbit = this.fetchData();
    this.storeData(adr_Hbit, h_bit);

    this.inrPrgmCount();
    return false;
  }
  LDAX() {
    let reg = this.splitInstr()[1];
    let h_bit;
    let l_bit;

    if (reg == "B") {
      h_bit = this.getReg("B");
      l_bit = this.getReg("C");
    } else if (reg == "D") {
      h_bit = this.getReg("D");
      l_bit = this.getReg("E");
    }

    let data = this.fetchData(h_bit + l_bit);
    this.setReg("A", data);

    this.inrPrgmCount();
    return false;
  }
  STAX() {
    let reg = this.splitInstr()[1];
    let h_bit;
    let l_bit;

    if (reg == "B") {
      h_bit = this.getReg("B");
      l_bit = this.getReg("C");
    } else if (reg == "D") {
      h_bit = this.getReg("D");
      l_bit = this.getReg("E");
    }

    let data = this.getReg("A");
    this.storeData(h_bit + l_bit, data);

    this.inrPrgmCount();
    return false;
  }
  XCHG() {
    let temp = this.getReg("H");
    this.setReg("H", this.getReg("D"));
    this.setReg("D", temp);

    temp = this.getReg("L");
    this.setReg("L", this.getReg("E"));
    this.setReg("E", temp);

    this.inrPrgmCount();
    return false;
  }
  ADD() {
    let reg = this.splitInstr()[1];
    let sum = this.getReg("A");
    sum = HexNumber.add(sum, this.getReg(reg));
    this.setReg("A", sum);

    this.inrPrgmCount();
    return false;
  }
  ADI() {
    let sum = this.getReg("A");
    this.inrPrgmCount();
    let num = this.splitInstr()[0];
    sum = HexNumber.add(sum, num);
    this.setReg("A", sum);

    this.inrPrgmCount();
    return false;
  }
  SUB() {
    let reg = this.splitInstr()[1];
    let diff = this.getReg("A");
    diff = HexNumber.sub(diff, this.getReg(reg));
    this.setReg("A", diff);

    this.inrPrgmCount();
    return false;
  }
  SUI() {
    let sum = this.getReg("A");
    this.inrPrgmCount();
    let num = this.splitInstr()[0];
    sum = HexNumber.sub(sum, num);
    this.setReg("A", sum);

    this.inrPrgmCount();
    return false;
  }
  INR() {
    let reg = this.splitInstr()[1];
    let inrc = HexNumber.add(this.getReg(reg), 1);
    this.setReg(reg, inrc);

    this.inrPrgmCount();
    return false;
  }
  DCR() {
    let reg = this.splitInstr()[1];
    let dcrc = HexNumber.sub(this.getReg(reg), 1);
    this.setReg(reg, dcrc);

    this.inrPrgmCount();
    return false;
  }
  INX() {
    let reg = this.splitInstr()[1];

    if (reg == "B") {
      let regL = this.getReg("C");
      regL = HexNumber.add(regL, "01");

      if (regL == "00") {
        let regH = this.getReg("B");
        regH = HexNumber.add(regH, "01");
        this.setReg("B", regH);
      }

      this.setReg("C", regL);
    } else if (reg == "D") {
      let regL = this.getReg("E");
      regL = HexNumber.add(regL, "01");

      if (regL == "00") {
        let regH = this.getReg("D");
        regH = HexNumber.add(regH, "01");
        this.setReg("D", regH);
      }

      this.setReg("E", regL);
    } else if (reg == "H") {
      let regL = this.getReg("L");
      regL = HexNumber.add(regL, "01");

      if (regL == "00") {
        let regH = this.getReg("H");
        regH = HexNumber.add(regH, "01");
        this.setReg("H", regH);
      }

      this.setReg("L", regL);
    }

    this.inrPrgmCount();
    return false;
  }
  DCX() {
    let reg = this.splitInstr()[1];

    if (reg == "B") {
      let regL = this.getReg("C");
      regL = HexNumber.decHex(regL);

      if (regL == "FF") {
        let regH = this.getReg("B");
        regH = HexNumber.sub(regH, "01");
        this.setReg("B", regH);
      }

      this.setReg("C", regL);
    } else if (reg == "D") {
      let regL = this.getReg("E");
      regL = HexNumber.decHex(regL, "01");

      if (regL == "FF") {
        let regH = this.getReg("D");
        regH = HexNumber.sub(regH, "01");
        this.setReg("D", regH);
      }

      this.setReg("E", regL);
    } else if (reg == "H") {
      let regL = this.getReg("L");
      regL = HexNumber.decHex(regL, "01");

      if (regL == "FF") {
        let regH = this.getReg("H");
        regH = HexNumber.sub(regH, "01");
        this.setReg("H", regH);
      }

      this.setReg("L", regL);
    }

    this.inrPrgmCount();
    return false;
  }
  DAD() {}
  CMA() {}
  CMP() {}
  CPI() {}
  JMP() {
    this.inrPrgmCount();
    let l_bit = this.splitInstr()[0]
    this.inrPrgmCount();
    let h_bit = this.splitInstr()[0];
    this.setPrgmCount(h_bit + l_bit);

    return false;
  }
  JC() {
    if(opp_cache.CY) {
      this.inrPrgmCount();
      let l_bit = this.splitInstr()[0]
      this.inrPrgmCount();
      let h_bit = this.splitInstr()[0];
      this.setPrgmCount(h_bit + l_bit);
    } else {
      this.inrPrgmCount();
    }

    return false;
  }
  JNC() {
    if(!opp_cache.CY) {
      this.inrPrgmCount();
      let l_bit = this.splitInstr()[0]
      this.inrPrgmCount();
      let h_bit = this.splitInstr()[0];
      this.setPrgmCount(h_bit + l_bit);
    } else {
      this.inrPrgmCount();
    }
  }
  JZ() {
    if(opp_cache.Z) {
      this.inrPrgmCount();
      let l_bit = this.splitInstr()[0]
      this.inrPrgmCount();
      let h_bit = this.splitInstr()[0];
      this.setPrgmCount(h_bit + l_bit);
    } else {
      this.inrPrgmCount();
    }

    return false;
  }
  JNZ() {
    if(!opp_cache.Z) {
      this.inrPrgmCount();
      let l_bit = this.splitInstr()[0]
      this.inrPrgmCount();
      let h_bit = this.splitInstr()[0];
      this.setPrgmCount(h_bit + l_bit);
    } else {
      this.inrPrgmCount();
    }

    return false;
  }
  CALL() {}
  RET() {}
  RST() {}
  PUSH() {}
  POP() {}
  IN() {}
  OUT() {}
  HLT() {
    return true;
  }
}

export { MP8085ExeEngine };
