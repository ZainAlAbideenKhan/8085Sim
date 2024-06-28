let opp_cache = {
  Z: false,
  S: false,
  P: false,
  AC: false,
  CY: false,
  reset: function() {
    this.Z = false;
    this.S = false;
    this.P = false;
    this.AC = false;
    this.CY = false;
  }
};

let opp_log = [];
function opp_logClear() {
  opp_log = [];
}

window.printOppLog = function () {
  opp_log.forEach((i) => {
    console.log(i);
  });
};

export {opp_cache, opp_log, opp_logClear};