import instruction from "./8085instr.json" assert { type: "json" };
import { opp_cache, opp_log, opp_logClear } from "./globals.js";
import { HexNumber } from "./hexnum.js";
import { RAM } from "./ram.js";
import { MP8085ExeEngine } from "./executionEngine.js";
class Reg8085 {
  constructor() {
    this.A = "00";
    this.B = "00";
    this.C = "00";
    this.D = "00";
    this.E = "00";
    this.H = "00";
    this.L = "00";
    this.PC = "";
    this.SP = "FFFF";
  }
  reset() {
    this.A = "00";
    this.B = "00";
    this.C = "00";
    this.D = "00";
    this.E = "00";
    this.H = "00";
    this.L = "00";
    this.PC = "";
    this.SP = "FFFF";
  }
}

class MP8085 extends MP8085ExeEngine {
  constructor(ram_size, address_bus_size) {
    super();
    this.mp_state = "start";
    this.screen_selected = false;
    this.ram = new RAM(ram_size, address_bus_size);
    this.registers = new Reg8085();
    this.htm_screen = document.querySelector(".screen");
    this.htm_text = document.querySelector(".screen .text");
    this.htm_input = document.querySelector(".screen .input");
    this.htm_reset_btn = document.querySelector("#reset-btn");
    this.htm_power_btn = document.querySelector(".power-switch");
    this.htm_power_led = document.querySelector(".power-led");
  }
  position_screen(text = null, input = null) {
    if (text != null) {
      this.htm_text.style.left = text + "px";
    }
    if (input != null) {
      this.htm_input.style.left = input + "px";
    }
  }
  power(to_state = null) {
    if (to_state == null) to_state = this.mp_state != "off" ? "off" : "on";

    if (to_state == "on") {
      this.htm_power_btn.style.left = "812px";
      this.htm_power_led.style.display = "";
      this.htm_text.innerHTML = "STARTING...";
      setTimeout(() => {
        this.start();
      }, 700);

      return 1;
    } else if (to_state == "off") {
      this.htm_power_led.style.display = "none";
      this.htm_power_btn.style.left = "785px";
      this.htm_text.innerHTML = "";
      this.htm_input.innerHTML = "";
      this.mp_state = "off";

      return 0;
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

    // check if given instruction is correct
    if (!this.validateInstr(raw_code)) {
      this.wrongInput("instr");
      return;
    }

    this.htm_input.innerHTML = "";
    let code = MP8085.instrMemorySplit(raw_code);
    this.htm_text.innerHTML = HexNumber.add(ram_adr, code.length);

    code.forEach((instr, num) => {
      this.ram.memory_map[HexNumber.add(ram_adr, num)] = instr;
    });
  }
  backspaceInp() {
    this.htm_input.innerHTML = this.htm_input.innerHTML.slice(
      0,
      this.htm_input.innerHTML.length - 1
    );
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
    if (ram_adr in this.ram.memory_map) {
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
    if (data.length == 0) {
      data = null;
    } else if (data.length == 1) {
      data = "0" + data;
    }

    let ram_adr = this.htm_text.innerHTML.slice(0, 4).toUpperCase();

    if (data != null) this.ram.memory_map[ram_adr] = data.toUpperCase();
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
    this.registers.PC = this.htm_input.innerHTML.toUpperCase();
    // reset
    this.htm_input.innerHTML = "";
    opp_logClear();

    this.execEngine();

    this.htm_text.innerHTML = "EXECUTING";
  }
  // UTILITY FUNCTIONS
  /**
   * This functions detects the type of value(given as string).
   * @param {string} value takes a string value to classifies what tyoe of value it is
   * @returns returns a string code for value type detedted.
   */
  static datatype(value) {
    if (/^[0-9A-F]{2}$/.test(value)) {
      return "2BH";
    } else if (/^[0-9A-F]{4}$/.test(value)) {
      return "4BH";
    } else if (/^[ABCDEHL]$/.test(value)) {
      return "reg";
    } else {
      return "unknown";
    }
  }
  /**
   * This function validates weather a instruction is valid or not.
   * @param {string} instr - string instruction to be checked
   * @returns Returns a `boolean` about validity of instruction string
   */
  validateInstr(instr) {
    instr = instr.split(/,\s*|\s+/);

    let operator = instr[0];
    let operand = instr.slice(1);

    if (!(operator in instruction)) {
      console.log("WRONG_OPERATOR");
      return false;
    }

    for (let i = 0; i < operand.length; i++) {
      let optype = MP8085.datatype(operand[i]);
      if (optype != instruction[operator].argType[i]) {
        console.log("WRONG_OPERAND");
        return false;
      }
    }
    return true;
  }
  /**
   * Checks validity of 4 bit hex address
   * @param {string} address hex address to be checked
   * @returns returns a boolean if the checked value is 4BH (4 bit Hex Number)
   */
  validateAdrs(address) {
    if (MP8085.datatype(address) != "4BH") {
      return false;
    } else {
      return true;
    }
  }
  /**
   * Shows error message in MP
   * @param {"instr" | "asmcode"} place_of_error Place where error occured
   */
  wrongInput(place_of_error) {
    this.mp_state = "error";

    switch (place_of_error) {
      // at instruction input
      case "instr":
        this.htm_input.innerHTML = "WRONG INPUT";
        setTimeout(() => {
          this.mp_state = "inp assm";
          this.htm_input.innerHTML = "";
        }, 1000);
        break;
      // at asmcode address input
      case "asmcode":
        this.htm_input.innerHTML = "WRONG ADDRESS";
        setTimeout(() => {
          this.mp_state = "inp ramAdr";
          this.htm_input.innerHTML = "";
        }, 1000);
        break;

      default:
        break;
    }
  }
  static instrMemorySplit(raw_instr) {
    raw_instr = raw_instr.trim();
    let instr = raw_instr.split(/[\s,]+/);

    const instrInfo = instruction[instr[0]];

    if (instrInfo.bytes == 1) {
      return [raw_instr];
    }
    if (instrInfo.bytes >= 2 && instrInfo.arguments == 2) {
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
  static checkValidInstructionChar(inst) {
    if (/^[0-9a-zA-Z\s,]+$/.test(inst) && inst != "Enter") {
      return true;
    } else {
      return false;
    }
  }
  keyboardToMP(key) {
    if (this.mp_state == "start") {
      if (key == "1") {
        this.codeOption();
      } else if (key.toUpperCase() == "M") {
        this.inpDataAdr();
      } else if (key.toUpperCase() == "G") {
        this.inpExecAdr();
      }
    } else if (this.mp_state == "code option") {
      if (key.toUpperCase() == "A") {
        this.ramAddress();
      }
    } else if (this.mp_state == "inp ramAdr") {
      if (HexNumber.isValidDigit(key) && this.htm_input.innerHTML.length < 4) {
        this.htm_input.append(key);
      } else if (key == "Enter") {
        // check if given address is correct
        if (!this.validateAdrs(this.htm_input.innerHTML)) {
          this.wrongInput("asmcode");
          return;
        }
        this.startCodeInp();
      } else if (key == "\\") {
        this.backspaceInp();
      }
    } else if (this.mp_state == "inp assm") {
      if (
        MP8085.checkValidInstructionChar(key) &&
        this.htm_input.innerHTML.length <= 16
      ) {
        this.htm_input.append(key);
      } else if (key == "Enter") {
        this.inpCode();
      } else if (key == "\\") {
        this.backspaceInp();
      }
    } else if (this.mp_state == "inp dataAdr") {
      if (HexNumber.isValidDigit(key) && this.htm_input.innerHTML.length < 4) {
        this.htm_input.append(key);
      } else if (key == "Enter") {
        this.startDataInp();
      } else if (key == "\\") {
        this.backspaceInp();
      }
    } else if (this.mp_state == "inp data") {
      if (HexNumber.isValidDigit(key) && this.htm_input.innerHTML.length < 2) {
        this.htm_input.append(key);
      } else if (key == "Enter") {
        this.inpData();
      } else if (key == "\\") {
        this.backspaceInp();
      }
    } else if (this.mp_state == "inp execAdr") {
      if (HexNumber.isValidDigit(key) && this.htm_input.innerHTML.length < 4) {
        this.htm_input.append(key);
      } else if (key == "$") {
        this.execute();
      } else if (key == "\\") {
        this.backspaceInp();
      }
    }
  }
}

export { MP8085 };
