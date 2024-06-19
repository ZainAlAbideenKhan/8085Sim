import { HexNumber } from "./hexnum.js";

class MP8085ExeEngine {
  constructor() {
    this.W = 0;
    this.Z = 0;
  }
  execEngine() {
    let instr_name = this.fetchInstrName();
    let termination = false;
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
    if(termination) return;
    this.execEngine();
  }

  // utility

  fetchInstrName() {
    if (this.registers.PrgmCount in this.ram.memory_map) {
      let instr = this.ram.memory_map[this.registers.PrgmCount];
      return instr.split(" ")[0];
    } else return null;
  }

  // instruction

  MOV() {
    let instr = this.ram.memory_map[this.registers.PrgmCount];
    instr = instr.split(/[\s,]+/);
    this.registers[instr[1]] = this.registers[instr[2]];

    this.registers.PrgmCount = HexNumber.add(this.registers.PrgmCount, 1);
    return false;
  }
  MVI() {}
  LXI() {}
  LDA() {}
  STA() {}
  LHLD() {}
  SHLD() {}
  LDAX() {}
  STAX() {}
  XCHG() {}
  ADD() {}
  ADI() {}
  SUB() {}
  SUI() {}
  INR() {}
  DCR() {}
  INX() {}
  DCX() {}
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
