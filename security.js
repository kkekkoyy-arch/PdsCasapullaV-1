(function () {
  "use strict";

  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }

  var demo = document.getElementById("demo");
  if (demo) {
    var localHost = location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.protocol === "file:";
    demo.hidden = !localHost;
  }

  var IDLE_LIMIT = 30 * 60 * 1000;
  var idleSince = Date.now();
  var warningShown = false;

  function active() {
    idleSince = Date.now();
    warningShown = false;
  }

  ["mousedown", "mousemove", "keydown", "touchstart", "scroll"].forEach(function (eventName) {
    window.addEventListener(eventName, active, { passive: true });
  });

  setInterval(function () {
    var elapsed = Date.now() - idleSince;
    if (elapsed >= IDLE_LIMIT) {
      var app = document.getElementById("app");
      var out = document.getElementById("out");
      if (app && !app.classList.contains("hide") && out) {
        out.click();
      }
    } else if (elapsed >= IDLE_LIMIT - 60000 && !warningShown) {
      warningShown = true;
      var toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.textContent = "Protezione: disconnessione automatica tra 1 minuto.";
      document.body.appendChild(toast);
      setTimeout(function () { toast.remove(); }, 5000);
    }
  }, 10000);

  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) active();
  });
})();
