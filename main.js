import { opp_cache, opp_log } from "./globals.js";
import { MP8085 } from "./microprocessor.js";
import { HexNumber } from "./hexnum.js";

function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// UI
document.querySelector(".size-selector").addEventListener("input", (event) => {
  let scale_val = event.target.value / 100;
  setKitScale(scale_val);
});
function setKitScale(scale_val) {
  // min
  scale_val = scale_val < 0.4 ? 0.4 : scale_val;
  // max
  // if (576 * scale_val > window.innerHeight * 0.8) {
  //   scale_val = (window.innerHeight * 0.8) / (576 * scale_val);
  //   console.log((window.innerHeight * 0.8) / (576 * scale_val));
  // }

  document.querySelector(".microprocessor8085").style.scale = scale_val;
  // set dimensions
  document.querySelector(".microprocessor8085").style.width = `${
    976 * scale_val
  }px`;
  document.querySelector(".microprocessor8085").style.height = `${
    576 * scale_val
  }px`;
}

document.querySelectorAll('input[name="screenColor"]').forEach((i) => {
  i.addEventListener("change", (event) => {
    let col = event.target.value;
    mp.htm_screen.style.backgroundColor = col;
  });
});
// for full screen
document.querySelector(".full-screen").addEventListener("click", (e) => {
  let element = document.querySelector("main");
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // IE/Edge
    element.msRequestFullscreen();
  }
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

window.onload = () => {
  // adjust microprocessor scale on load
  if (document.body.clientHeight > window.innerHeight * 0.8) {
    let scale_val = (window.innerHeight * 0.8) / document.body.clientHeight;
    setKitScale(scale_val);
    scale_val *= 100;
    document.querySelector(".size-selector").value = scale_val;
  }

  let mp = new MP8085(["0000", "FFFF"], "16Bits");
  window.mp = mp;

  // event listners
  mp.htm_reset_btn.addEventListener("click", function (event) {
    mp.registers.reset();
    opp_cache.reset();
    mp.start();
    event.target.blur();
  });

  mp.htm_power_btn.addEventListener("click", (event) => {
    mp.power();
  });

  // initialisation
  mp.start();
};