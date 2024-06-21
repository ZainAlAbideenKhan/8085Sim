import { MP8085 } from "./microprocessor.js";
import { HexNumber } from "./hexnum.js";

let mp = new MP8085();
// for testing
window.mp = mp;
// initialisation
mp.start();

mp.htm_reset_btn.addEventListener("click", function () {
  mp.start();
  alert("microprocessor reset, click on its screen to deselect reset button.");
});
window.addEventListener("keypress", (e) => {
  if (mp.mp_state == "start") {
    if (e.key == "1") {
      mp.codeOption();
    } else if (e.key.toUpperCase() == "M") {
      mp.inpDataAdr();
    } else if (e.key.toUpperCase() == "G") {
      mp.inpExecAdr();
    }
  } else if (mp.mp_state == "code option") {
    if (e.key.toUpperCase() == "A") {
      mp.ramAddress();
    }
  } else if (mp.mp_state == "inp ramAdr") {
    if (HexNumber.isValidDigit(e.key) && mp.htm_input.innerHTML.length < 4) {
      mp.htm_input.append(e.key);
    } else if (e.key == "Enter") {
      mp.startCodeInp();
    }
  } else if (mp.mp_state == "inp assm") {
    if (
      MP8085.checkValidInstructionChar(e.key) &&
      mp.htm_input.innerHTML.length <= 16
    ) {
      mp.htm_input.append(e.key);
    } else if (e.key == "Enter") {
      mp.inpCode();
    }
  } else if (mp.mp_state == "inp dataAdr") {
    if (HexNumber.isValidDigit(e.key) && mp.htm_input.innerHTML.length < 4) {
      mp.htm_input.append(e.key);
    } else if (e.key == "Enter") {
      mp.startDataInp();
    }
  } else if (mp.mp_state == "inp data") {
    if (HexNumber.isValidDigit(e.key) && mp.htm_input.innerHTML.length < 2) {
      mp.htm_input.append(e.key);
    } else if (e.key == "Enter") {
      mp.inpData();
    }
  } else if (mp.mp_state == "inp execAdr") {
    if (HexNumber.isValidDigit(e.key) && mp.htm_input.innerHTML.length < 4) {
      mp.htm_input.append(e.key);
    } else if (e.key == "$") {
      mp.execute();
    }
  }
});
