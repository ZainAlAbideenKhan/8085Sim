import { HexNumber } from "./hexnum.js";

class MP8085ExeEngine {
  constructor() {}
  execEngine() {
    let instr_name = this.fetchInstrName();
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
        this.setStatusFlag();
        break;
      case "ADI":
        termination = this.ADI();
        this.setStatusFlag();
        break;
      case "SUB":
        termination = this.SUB();
        this.setStatusFlag();
        break;
      case "SUI":
        termination = this.SUI();
        this.setStatusFlag();
        break;
      case "INR":
        termination = this.INR();
        this.setStatusFlag();
        break;
      case "DCR":
        termination = this.DCR();
        this.setStatusFlag();
        break;
      case "INX":
        termination = this.INX();
        this.setStatusFlag();
        break;
      case "DCX":
        termination = this.DCX();
        this.setStatusFlag();
        break;
      case "DAD":
        termination = this.DAD();
        this.setStatusFlag();
        break;
      case "CMA":
        termination = this.CMA();
        this.setStatusFlag();
        break;
      case "CMP":
        termination = this.CMP();
        this.setStatusFlag();
        break;
      case "CPI":
        termination = this.CPI();
        this.setStatusFlag();
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
    this.inrPrgmCount();
    this.execEngine();
  }

  // utility
  setStatusFlag() {
    this.registers.flag.sign = opp_cache.S;
    this.registers.flag.zero = opp_cache.Z;
    this.registers.flag.auxCarry = opp_cache.AC;
    this.registers.flag.parity = opp_cache.P;
    this.registers.flag.carry = opp_cache.CY;
  }

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
    this.registers.PrgmCount = HexNumber.add(this.registers.PrgmCount, 1);
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

    return false;
  }
  MVI() {
    let reg = this.splitInstr()[1];
    this.inrPrgmCount();
    this.setReg(reg, this.fetchData());

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

    return false;
  }
  STA() {
    this.inrPrgmCount();
    let adr = this.fetchData();
    this.inrPrgmCount();
    adr = this.fetchData() + adr;
    this.ram.memory_map[adr] = this.registers.A;

    return false;
  }
  LHLD() {
    this.inrPrgmCount();
    let l_bit = this.fetchData();
    this.inrPrgmCount();
    let h_bit = this.fetchData();
    this.setReg("H", h_bit);
    this.setReg("L", l_bit);

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

    return false;
  }
  XCHG() {
    let temp = this.getReg("H");
    this.setReg("H", this.getReg("D"));
    this.setReg("D", temp);

    temp = this.getReg("L");
    this.setReg("L", this.getReg("E"));
    this.setReg("E", temp);

    return false;
  }
  ADD() {
    let reg = this.splitInstr()[1];
    let sum = this.getReg("A");
    sum = HexNumber.add(sum, this.getReg(reg));
    this.setReg("A", sum);

    return false;
  }
  ADI() {
    let num = this.splitInstr()[1];
    let sum = this.getReg("A");
    sum = HexNumber.add(sum, num);
    this.setReg("A", sum);

    return false;
  }
  SUB() {
    let reg = this.splitInstr()[1];
    let diff = this.getReg("A");
    diff = HexNumber.sub(diff, this.getReg(reg));
    this.setReg("A", diff);

    return false;
  }
  SUI() {
    let num = this.splitInstr()[1];
    let sum = this.getReg("A");
    sum = HexNumber.sub(sum, num);
    this.setReg("A", sum);

    return false;
  }
  INR() {
    let reg = this.splitInstr()[1];
    let inrc = HexNumber.add(this.getReg(reg), 1);
    this.setReg(reg, inrc);

    return false;
  }
  DCR() {
    let reg = this.splitInstr()[1];
    let inrc = HexNumber.sub(this.getReg(reg), 1);
    this.setReg(reg, inrc);

    return false;
  }
  INX() {
    let reg = this.splitInstr()[1];
    let num4byte;

    if (reg == "B") {
      num4byte = this.getReg("B") + this.getReg("C");
      num4byte = HexNumber.add(num4byte, 1);

      this.setReg("B", num4byte.slice(num4byte.length - 4, num4byte.length - 2));
      this.setReg("C", num4byte.slice(num4byte.length - 2, num4byte.length));
    } else if (reg == "D") {
      num4byte = this.getReg("D") + this.getReg("E");
      num4byte = HexNumber.add(num4byte, 1);
      
      this.setReg("D", num4byte.slice(num4byte.length - 4, num4byte.length - 2));
      this.setReg("E", num4byte.slice(num4byte.length - 2, num4byte.length));
    } else if (reg == "H") {
      num4byte = this.getReg("H") + this.getReg("L");
      num4byte = HexNumber.add(num4byte, 1);
      
      this.setReg("H", num4byte.slice(num4byte.length - 4, num4byte.length - 2));
      this.setReg("L", num4byte.slice(num4byte.length - 2, num4byte.length));
    }

    return false;
  }
  DCX() {
        let reg = this.splitInstr()[1];
    let num4byte;

    if (reg == "B") {
      num4byte = this.getReg("B") + this.getReg("C");
      num4byte = HexNumber.sub(num4byte, 1);

      this.setReg("B", num4byte.slice(num4byte.length - 4, num4byte.length - 2));
      this.setReg("C", num4byte.slice(num4byte.length - 2, num4byte.length));
    } else if (reg == "D") {
      num4byte = this.getReg("D") + this.getReg("E");
      num4byte = HexNumber.sub(num4byte, 1);
      
      this.setReg("D", num4byte.slice(num4byte.length - 4, num4byte.length - 2));
      this.setReg("E", num4byte.slice(num4byte.length - 2, num4byte.length));
    } else if (reg == "H") {
      num4byte = this.getReg("H") + this.getReg("L");
      num4byte = HexNumber.sub(num4byte, 1);
      
      this.setReg("H", num4byte.slice(num4byte.length - 4, num4byte.length - 2));
      this.setReg("L", num4byte.slice(num4byte.length - 2, num4byte.length));
    }

    return false;
  }
  DAD() {}
  CMA() {}
  CMP() {}
  CPI() {}
  JMP() {}
  JC() {}
  JNC() {}
  JZ() {}
  JNZ() {}
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
