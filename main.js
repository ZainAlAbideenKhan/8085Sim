import { opp_cache, opp_log } from "./globals.js";
import { MP8085 } from "./microprocessor.js";
import { HexNumber } from "./hexnum.js";

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

let mp = new MP8085();
window.mp = mp;

// UI
document.querySelector(".size-selector").addEventListener("input", (event) => {
  let scale_val = event.target.value / 100;
  scale_val = scale_val < 0.4 ? 0.4 : scale_val;
  document.querySelector(".microprocessor8085").style.scale = scale_val;
});

document.querySelectorAll('input[name="screenColor"]').forEach((i) => {
  i.addEventListener("change", (event) => {
    let col = event.target.value;
    mp.htm_screen.style.backgroundColor = col;
  });
});

mp.htm_reset_btn.addEventListener("click", function (event) {
  mp.registers.reset();
  opp_cache.reset();
  mp.start();
  event.target.blur();
});

mp.htm_power_btn.addEventListener("click", (event) => {
  mp.power();
});

if (isMobileDevice()) {
  document
    .querySelector(".enable-keyboard input")
    .addEventListener("input", (event) => {
      let key = event.target.value;
      if (key.length > 1) key = key[key.length - 1];
      if (key == ".") {
        key = "Enter";
      } else if (key == "/") {
        key = "\\";
      }
      mp.keyboardToMP(key);
      event.target.value = "";
    });
} else {
  window.addEventListener("keypress", (e) => {
    mp.keyboardToMP(e.key);
  });
  document.querySelector(".enable-keyboard input").remove();
}

// initialisation
mp.start();

export { mp };
