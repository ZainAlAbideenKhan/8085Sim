import { opp_cache, opp_log } from "./globals.js";
import { HexNumber } from "./hexnum.js";

class MP8085ExeEngine {
  constructor() {}
  execEngine() {
    let instr_name = this.fetchInstrName();
    if (instr_name == null) return;
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
    if (termination) return;
    this.execEngine();
  }

  // utility

  getLowerPairNm(regH) {
    if (regH == "B") {
      return "C";
    } else if (regH == "D") {
      return "E";
    } else if (regH == "H") {
      return "L";
    } else return null;
  }

  fetchInstrName() {
    if (this.registers.PC in this.ram.memory_map) {
      let instr = this.ram.memory_map[this.registers.PC];
      return instr.split(" ")[0];
    } else return null;
  }

  inrPrgmCount() {
    this.registers.PC = HexNumber.addHex(this.registers.PC, 1);
  }

  setPrgmCount(adr) {
    this.registers.PC = adr;
  }

  fetchData(adr = null) {
    if (adr != null) {
      if (adr in this.ram.memory_map) {
        return this.ram.memory_map[adr];
      } else {
        return "00";
      }
    } else if (this.registers.PC in this.ram.memory_map) {
      let data = this.ram.memory_map[this.registers.PC];
      return data;
    } else return null;
  }

  storeData(adr, data) {
    this.ram.memory_map[adr] = data;
  }

  splitInstr() {
    let instr = this.ram.memory_map[this.registers.PC];
    instr = instr.split(/[\s,]+/);
    return instr;
  }

  setReg(reg, data) {
    if (reg == "M") {
      let adr = this.getReg("H") + this.getReg("L");
      this.storeData(adr, data);
    } else {
      this.registers[reg] = data;
    }
  }

  getReg(reg) {
    if (reg == "M") {
      let adr = this.getReg("H") + this.getReg("L");
      return this.fetchData(adr);
    } else {
      return this.registers[reg];
    }
  }

  loadStackPtr(adr = null) {
    if(adr == null) {
      adr = this.registers.PC;
      this.inrPrgmCount(); //moved forward next address will dealth in below code
    }
    let data = this.fetchData(adr);
    this.registers.SP = data;
    adr = HexNumber.addHex(adr, 1);
    data = this.fetchData(adr);
    this.registers.SP = data + this.registers.SP;
  }

  // instruction

  MOV() {
    let instr = this.splitInstr();
    this.setReg(instr[1], this.getReg(instr[2]));
    this.inrPrgmCount();

    opp_log.push(`${instr[1]} <- ${instr[2]}(${this.getReg(instr[2])})`);

    return false;
  }
  MVI() {
    let reg = this.splitInstr()[1];
    this.inrPrgmCount();
    this.setReg(reg, this.fetchData());

    opp_log.push(`${reg} <- ${this.fetchData()}`);

    this.inrPrgmCount();
    return false;
  }
  LXI() {
    
    let reg = this.splitInstr()[1];
    this.inrPrgmCount();
    
    // code for Stack pointer
    if(reg == "SP") {
      this.loadStackPtr();
      this.inrPrgmCount();
      this.inrPrgmCount();
      return false;
    }

    let log_data = [];

    if (reg == "B") {
      this.setReg("C", this.fetchData());

      log_data.push("C", this.fetchData());
    } else if (reg == "D") {
      this.setReg("E", this.fetchData());

      log_data.push("E", this.fetchData());
    } else if (reg == "H") {
      this.setReg("L", this.fetchData());

      log_data.push("L", this.fetchData());
    }

    this.inrPrgmCount();
    this.setReg(reg, this.fetchData());

    opp_log.push(`${reg}${log_data[0]} <- ${this.fetchData()}${log_data[1]}`);
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

    opp_log.push(`A <- ${this.getReg("A")}`);

    this.inrPrgmCount();
    return false;
  }
  STA() {
    this.inrPrgmCount();
    let adr = this.fetchData();
    this.inrPrgmCount();
    adr = this.fetchData() + adr;
    this.ram.memory_map[adr] = this.registers.A;

    opp_log.push(`[${adr}] <- A(${this.getReg("A")})`);

    this.inrPrgmCount();
    return false;
  }
  LHLD() {
    this.inrPrgmCount();
    let adr = this.fetchData();
    this.inrPrgmCount();
    adr = this.fetchData() + adr;

    this.setReg("L", this.fetchData(adr));
    opp_log.push(`L <- [${adr}](${this.fetchData(adr)})`);
    
    adr = HexNumber.addHex(adr, 1);
    this.setReg("H", this.fetchData(adr));
    opp_log.push(`H <- [${adr}](${this.fetchData(adr)})`);

    this.inrPrgmCount();
    return false;
  }
  SHLD() {
    let h_bit = this.getReg("H");
    let l_bit = this.getReg("L");

    this.inrPrgmCount();
    let adr = this.fetchData();
    this.inrPrgmCount();
    adr = this.fetchData() + adr;
    opp_log.push(`[${adr}] <- L(${l_bit})`);
    this.storeData(adr, l_bit);

    adr = HexNumber.addHex(adr, "1");
    this.storeData(adr, h_bit);
    opp_log.push(`[${adr}] <- H(${h_bit})`);

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

    opp_log.push(
      `A <- [${reg}${reg == "B" ? "C" : "E"}(${h_bit + l_bit})](${data})`
    );

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

    opp_log.push(
      `[${reg}${reg == "B" ? "C" : "E"}(${h_bit + l_bit})] <- A(${data})`
    );

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

    opp_log.push(`A <- A(${this.getReg("A")}) + ${reg}(${this.getReg(reg)})`);

    this.inrPrgmCount();
    return false;
  }
  ADI() {
    let sum = this.getReg("A");
    this.inrPrgmCount();
    let num = this.splitInstr()[0];
    sum = HexNumber.add(sum, num);
    this.setReg("A", sum);

    opp_log.push(`A <- A(${this.getReg("A")}) + ${num}`);

    this.inrPrgmCount();
    return false;
  }
  SUB() {
    let reg = this.splitInstr()[1];
    let diff = this.getReg("A");
    diff = HexNumber.sub(diff, this.getReg(reg));
    this.setReg("A", diff);

    opp_log.push(`A <- A(${this.getReg("A")}) - ${reg}(${this.getReg(reg)})`);

    this.inrPrgmCount();
    return false;
  }
  SUI() {
    let sum = this.getReg("A");
    this.inrPrgmCount();
    let num = this.splitInstr()[0];
    sum = HexNumber.sub(sum, num);
    this.setReg("A", sum);

    opp_log.push(`A <- A(${this.getReg("A")}) - ${num}`);

    this.inrPrgmCount();
    return false;
  }
  INR() {
    let reg = this.splitInstr()[1];
    let inrc = HexNumber.add(this.getReg(reg), "01");
    this.setReg(reg, inrc);

    opp_log.push(`${reg}(${this.getReg(reg)})++`);

    this.inrPrgmCount();
    return false;
  }
  DCR() {
    let reg = this.splitInstr()[1];
    let dcrc = HexNumber.sub(this.getReg(reg), "01");
    this.setReg(reg, dcrc);

    opp_log.push(`${reg}(${this.getReg(reg)})--`);

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
      opp_log.push(`BC(${this.getReg("B") + this.getReg("C")})++`);
    } else if (reg == "D") {
      let regL = this.getReg("E");
      regL = HexNumber.add(regL, "01");

      if (regL == "00") {
        let regH = this.getReg("D");
        regH = HexNumber.add(regH, "01");
        this.setReg("D", regH);
      }

      this.setReg("E", regL);
      opp_log.push(`DE(${this.getReg("D") + this.getReg("E")})++`);
    } else if (reg == "H") {
      let regL = this.getReg("L");
      regL = HexNumber.add(regL, "01");

      if (regL == "00") {
        let regH = this.getReg("H");
        regH = HexNumber.add(regH, "01");
        this.setReg("H", regH);
      }

      this.setReg("L", regL);
      opp_log.push(`HL(${this.getReg("H") + this.getReg("L")})++`);
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
      opp_log.push(`BC(${this.getReg("B") + this.getReg("C")})--`);
    } else if (reg == "D") {
      let regL = this.getReg("E");
      regL = HexNumber.decHex(regL, "01");

      if (regL == "FF") {
        let regH = this.getReg("D");
        regH = HexNumber.sub(regH, "01");
        this.setReg("D", regH);
      }

      this.setReg("E", regL);
      opp_log.push(`DE(${this.getReg("D") + this.getReg("E")})--`);
    } else if (reg == "H") {
      let regL = this.getReg("L");
      regL = HexNumber.decHex(regL, "01");

      if (regL == "FF") {
        let regH = this.getReg("H");
        regH = HexNumber.sub(regH, "01");
        this.setReg("H", regH);
      }

      this.setReg("L", regL);
      opp_log.push(`HL(${this.getReg("H") + this.getReg("L")})--`);
    }

    this.inrPrgmCount();
    return false;
  }
  DAD() {
    let regH = this.splitInstr()[1];
    let regL = this.getLowerPairNm(regH);

    let l_sum = HexNumber.add(this.getReg(regL), this.getReg("L"));
    let h_sum;
    if (opp_cache.CY) h_sum = HexNumber.add(this.getReg("H"), "01");
    h_sum = HexNumber.add(this.getReg(regH), h_sum);

    opp_log.push(
      `HL <- HL(${this.getReg("H") + this.getReg("L")}) + ${
        this.getReg(regH) + this.getReg(regL)
      }`
    );

    this.setReg("H", h_sum);
    this.setReg("L", l_sum);

    this.inrPrgmCount();
    return 0;
  }
  CMA() {
    let a = this.getReg("A");
    a = HexNumber.binCompliment(a, "01");
    this.setReg("A", a);

    opp_log.push(`A <- Ā(${a})`);
    this.inrPrgmCount();
    return 0;
  }
  CMP() {
    let reg = this.splitInstr()[1];
    HexNumber.sub(this.getReg("A"), this.getReg(reg));

    opp_log.push(`COMPARE A WITH ${reg}(${this.getReg(reg)})`);
    this.inrPrgmCount();
    return 0;
  }
  CPI() {
    let opr = this.splitInstr()[1];
    HexNumber.sub(this.getReg("A"), opr);

    opp_log.push(`COMPARE A WITH ${opr}`);
    this.inrPrgmCount();
    return 0;
  }
  JMP() {
    this.inrPrgmCount();
    let l_bit = this.splitInstr()[0];
    this.inrPrgmCount();
    let h_bit = this.splitInstr()[0];
    this.setPrgmCount(h_bit + l_bit);

    opp_log.push(`JUMP TO ${h_bit + l_bit}`);
    return false;
  }
  JC() {
    if (opp_cache.CY) {
      this.inrPrgmCount();
      let l_bit = this.splitInstr()[0];
      this.inrPrgmCount();
      let h_bit = this.splitInstr()[0];
      this.setPrgmCount(h_bit + l_bit);

      opp_log.push(`CY = 1, JUMP ${h_bit + l_bit}`);
    } else {
      opp_log.push("CY!= 1, JUMP IGNORED");
      this.inrPrgmCount();
      this.inrPrgmCount();
      this.inrPrgmCount();
    }

    return false;
  }
  JNC() {
    if (!opp_cache.CY) {
      this.inrPrgmCount();
      let l_bit = this.splitInstr()[0];
      this.inrPrgmCount();
      let h_bit = this.splitInstr()[0];
      this.setPrgmCount(h_bit + l_bit);

      opp_log.push(`CY = 0, JUMP TO ${h_bit + l_bit}`);
    } else {
      opp_log.push("CY!= 0, JUMP IGNORED");
      this.inrPrgmCount();
      this.inrPrgmCount();
      this.inrPrgmCount();
    }

    return false;
  }
  JZ() {
    if (opp_cache.Z) {
      this.inrPrgmCount();
      let l_bit = this.splitInstr()[0];
      this.inrPrgmCount();
      let h_bit = this.splitInstr()[0];
      this.setPrgmCount(h_bit + l_bit);

      opp_log.push(`Z = 1, JUMP TO ${h_bit + l_bit}`);
    } else {
      opp_log.push("Z != 1, JUMP IGNORED");
      this.inrPrgmCount();
      this.inrPrgmCount();
      this.inrPrgmCount();
    }

    return false;
  }
  JNZ() {
    if (!opp_cache.Z) {
      this.inrPrgmCount();
      let l_bit = this.splitInstr()[0];
      this.inrPrgmCount();
      let h_bit = this.splitInstr()[0];
      this.setPrgmCount(h_bit + l_bit);

      opp_log.push(`Z = 0, JUMP TO ${h_bit + l_bit}`);
    } else {
      opp_log.push("Z != 0, JUMP IGNORED");
      this.inrPrgmCount();
      this.inrPrgmCount();
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
    opp_log.push("HAULT");
    return true;
  }
}

export { MP8085ExeEngine };