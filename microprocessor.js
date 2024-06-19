import instruction from './instruction.json' assert { type: 'json' };
import {HexNumber} from "./hexnum.js";
import {RAM} from "./ram.js";
import {MP8085ExeEngine} from "./executionEngine.js";
class Reg8085 {
  constructor() {
    this.A = "00";
    this.B = "00";
    this.C = "00";
    this.D = "00";
    this.E = "00";
    this.H = "00";
    this.L = "00";
    this.PrgmCount = "";
  }
}

class MP8085 extends MP8085ExeEngine {
  constructor() {
    super();
    this.mp_state = "start";
    this.screen_selected = false;
    this.ram = new RAM();
    this.registers = new Reg8085();
    this.htm_screen = document.querySelector(".screen");
    this.htm_text = document.querySelector(".screen .text");
    this.htm_input = document.querySelector(".screen .input");
    this.htm_reset_btn = document.querySelector("#reset-btn");
  }
  position_screen(text = null, input = null) {
    if(text != null) {
      this.htm_text.style.left = text + "px";
    }
    if(input != null) {
      this.htm_input.style.left = input + "px";
    }
  }
  start() {
    this.position_screen(50, 4);
    this.htm_text.innerHTML = "STUDENT-85";
    this.htm_input.innerHTML = "";
    this.mp_state = "start";
  }
  codeOption() {
    this.position_screen(50, 4);
    this.htm_text.innerHTML = "A-ASSEM C-LIST";
    this.htm_input.innerHTML = "";
    this.mp_state = "code option";
  }
  ramAddress() {
    this.position_screen(4, 140);
    this.htm_text.innerHTML = "RAM ADR:";
    this.htm_input.innerHTML = "";
    this.mp_state = "inp ramAdr";
  }
  startCodeInp() {
    let ram_adr = this.htm_input.innerHTML.toUpperCase();
    // FLAG: check ram address here
    this.htm_text.innerHTML = ram_adr;
    this.htm_input.innerHTML = "";
    this.mp_state = "inp assm";
    this.position_screen(null, 100);
  }
  inpCode() {
    let ram_adr = this.htm_text.innerHTML.toUpperCase();
    let raw_code = this.htm_input.innerHTML.toUpperCase();
    this.htm_input.innerHTML = "";

    let code = MP8085.instrMemorySplit(raw_code);
    this.htm_text.innerHTML = HexNumber.add(ram_adr, code.length);

    code.forEach((instr, num) => {
      this.ram.memory_map[HexNumber.add(ram_adr, num)] = instr;
    });
  }
  inpDataAdr() {
    this.position_screen(4, 23);
    this.htm_text.innerHTML = "M";
    this.htm_input.innerHTML = "";
    this.mp_state = "inp dataAdr";
  }
  startDataInp() {
    this.position_screen(4, 137);
    let ram_adr = this.htm_input.innerHTML;
    let old_data;
    if(ram_adr in this.ram.memory_map) {
      old_data = this.ram.memory_map[ram_adr];
    } else {
      old_data = "00";
    }

    this.htm_text.innerHTML = `${ram_adr}:${old_data}-`;
    this.htm_input.innerHTML = "";
    this.mp_state = "inp data";
  }
  inpData() {
    let data = this.htm_input.innerHTML.slice(0, 2);
    if(data.length == 0) {
      data = "00";
    } else if(data.length == 1) {
      data = "0" + data;
    }

    let ram_adr = this.htm_text.innerHTML.slice(0, 4).toUpperCase();

    this.ram.memory_map[ram_adr] = data;
    this.htm_input.innerHTML = HexNumber.add(ram_adr, 1);
    
    this.mp_state = "inp data";
    this.startDataInp();
  }
  inpExecAdr() {
    this.position_screen(4, 23);
    this.htm_text.innerHTML = "G";
    this.htm_input.innerHTML = "";
    this.mp_state = "inp execAdr";
  }
  execute() {
    this.registers.PrgmCount = this.htm_input.innerHTML.toUpperCase();
    // reset
    this.htm_input.innerHTML = "";

    this.execEngine();

    this.htm_text.innerHTML = "EXECUTING";
  }
  // utility
  static instrMemorySplit(raw_instr) {
    raw_instr = raw_instr.trim();
    let instr = raw_instr.split(/[\s,]+/);
    
    const instrInfo = instruction[instr[0]];
  
    if(instrInfo.bytes == 1) {
      return [raw_instr];
    } 
    if(instrInfo.bytes >= 2 && instrInfo.arguments == 2) {
      instr[0] += ` ${instr[1]}`;
      instr.splice(1, 1);
    }
    if (instrInfo.bytes == 3) {
      let h_bit = instr[1].slice(0, 2);
      let l_bit = instr[1].slice(2);
      instr[1] = l_bit;
      instr.push(h_bit);
    }
 
    return instr;
  }
  static checkValidInstructionChar(inst){
    if(/^[0-9a-zA-Z\s,]+$/.test(inst) && inst != "Enter") {
      return true;
    } else {
      return false;
    }
  }
}

export {MP8085};