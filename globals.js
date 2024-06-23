let opp_cache = {
  Z: false,
  S: false,
  P: false,
  AC: false,
  CY: false,
};

let opp_log = [];

window.printOppLog = function () {
  opp_log.forEach((i) => {
    console.log(i);
  });
};

window.opp_cache = opp_cache;
window.opp_log = opp_log;
