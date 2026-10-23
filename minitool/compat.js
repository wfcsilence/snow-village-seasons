(() => {
  (function() {
    window.makeStreetRenderer = function(THREE) {
      var canvas = document.createElement("canvas"), gl = canvas.getContext("webgl", { alpha: true, antialias: false }) || canvas.getContext("experimental-webgl", { alpha: true, antialias: false });
      if (!gl) throw Error("WebGL unavailable");
      return new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: false });
    };
    if (!Array.prototype.flatMap) Array.prototype.flatMap = function(fn, scope) {
      return [].concat.apply([], this.map(fn, scope));
    };
    window.sceneViewport = { width: Math.max(innerWidth, innerHeight), height: Math.min(innerWidth, innerHeight), physicalWidth: innerWidth, rotated: innerHeight > innerWidth };
    window.landscapeStarted = false;
    window.streetRenderStopped = false;
    window.streetLowQuality = false;
    var pausedFrames = [], slow = 0, lowSlow = 0, previousFrame = 0;
    window.streetRAF = function(fn) {
      if (document.hidden) {
        if (pausedFrames.indexOf(fn) < 0) pausedFrames.push(fn);
        return 0;
      }
      return requestAnimationFrame(fn);
    };
    window.scenePoint = function(x, y) {
      var v = window.sceneViewport;
      return v.rotated ? { x: y, y: v.physicalWidth - x } : { x, y };
    };
    window.sceneEvent = function(e) {
      var p = window.scenePoint(e.clientX, e.clientY);
      return { clientX: p.x, clientY: p.y, pointerId: e.pointerId, pointerType: e.pointerType, button: e.button, buttons: e.buttons, shiftKey: e.shiftKey, deltaY: e.deltaY, preventDefault: function() {
        e.preventDefault();
      } };
    };
    window.sceneFallback = function(message) {
      var f = document.getElementById("fallback");
      f.hidden = false;
      f.querySelector("p").textContent = message;
    };
    window.sceneFallbackHide = function() {
      document.getElementById("fallback").hidden = true;
    };
    window.streetFrameBudget = function(now, dt, r, rain) {
      var elapsed = previousFrame ? now - previousFrame : 33;
      previousFrame = now;
      if (elapsed > 95) slow++;
      else slow = Math.max(0, slow - 1);
      if (slow > 45 && !window.streetLowQuality) {
        window.streetLowQuality = true;
        r.setPixelRatio(Math.min(1, Math.sqrt(1e6 / (window.sceneViewport.width * window.sceneViewport.height))));
        r.setSize(window.sceneViewport.width, window.sceneViewport.height);
        rain.setDrawRange(0, 260);
        slow = 0;
      }
      if (window.streetLowQuality && elapsed > 140) lowSlow++;
      else lowSlow = Math.max(0, lowSlow - 1);
      if (lowSlow > 75) {
        window.streetRenderStopped = true;
        if (window.__scene && window.__scene.audio.context) window.__scene.audio.context.suspend();
        window.sceneFallback("\u5F53\u524D\u8BBE\u5907\u6682\u65F6\u65E0\u6CD5\u6D41\u7545\u663E\u793A\u5B8C\u6574\u6A21\u578B\uFF0C\u5DF2\u663E\u793A\u6536\u85CF\u56FE\u3002");
      }
    };
    function layout() {
      var w = innerWidth, h = innerHeight, v = window.sceneViewport, stage = document.getElementById("landscape-stage");
      v.rotated = h > w;
      v.physicalWidth = w;
      v.width = Math.max(w, h);
      v.height = Math.min(w, h);
      stage.style.width = v.width + "px";
      stage.style.height = v.height + "px";
      stage.style.transform = v.rotated ? "translateX(" + w + "px) rotate(90deg)" : "translateZ(0)";
      stage.style.setProperty("--street-vw", v.width / 100 + "px");
      stage.style.setProperty("--street-vh", v.height / 100 + "px");
      stage.className = v.height < 650 ? "compact-landscape" : "";
      window.dispatchEvent(new Event("sceneorientationchange"));
    }
    var introTimer;
    function enter() {
      if (window.landscapeStarted) return;
      window.landscapeStarted = true;
      clearTimeout(introTimer);
      document.getElementById("rotate-guide").hidden = true;
      document.getElementById("landscape-stage").style.visibility = "visible";
      layout();
    }
    document.getElementById("rotate-continue").addEventListener("click", enter);
    layout();
    if (Math.min(innerWidth, innerHeight) < 650 || innerHeight > innerWidth) introTimer = setTimeout(enter, 3e3);
    else enter();
    window.addEventListener("resize", layout);
    window.addEventListener("orientationchange", layout);
    document.addEventListener("visibilitychange", function() {
      if (!document.hidden) {
        layout();
        previousFrame = 0;
        var pending = pausedFrames;
        pausedFrames = [];
        pending.forEach(function(fn) {
          requestAnimationFrame(fn);
        });
      } else if (window.__scene && window.__scene.audio.context) window.__scene.audio.context.suspend();
    });
    window.addEventListener("error", function(e) {
      if (!document.querySelector(".street-host canvas")) window.sceneFallback("\u4E09\u7EF4\u753B\u9762\u672A\u80FD\u542F\u52A8\uFF0C\u8BF7\u4F7F\u7528\u652F\u6301WebGL\u7684\u8BBE\u5907\u6253\u5F00\u3002");
    });
  })();
  window.saveStreetPostcard = async function(blob) {
    var api = window.xhs && window.xhs.miniTool;
    if (!api || typeof api.saveImageToPhotosAlbum !== "function") throw Error("\u9700\u8981\u5C0F\u5DE5\u5177\u76F8\u518C\u80FD\u529B");
    var data = await new Promise(function(resolve, reject) {
      var r = new FileReader();
      r.onload = function() {
        resolve(r.result);
      };
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
    var path = data;
    if (typeof api.writeTempFile === "function") {
      var temp = await api.writeTempFile({ data });
      path = temp.filePath;
    }
    return api.saveImageToPhotosAlbum({ filePath: path });
  };
  window.bindStreetMessage = function(field) {
    var key = "snow-village-personal-message", revision = 0, api = null, chain = Promise.resolve();
    field.value = "\u613F\u4F60\u8DEF\u8FC7\u8FD9\u91CC\u65F6\uFF0C\u603B\u6709\u4E00\u76CF\u6E29\u6696\u7684\u706F\uFF0C\u4E3A\u4F60\u4EAE\u7740\u3002";
    (async function() {
      var x = window.xhs, mini = x && x.miniTool, options = x && x.launchOptions;
      if (!options && mini && typeof mini.getLaunchOptions === "function") {
        try {
          options = await mini.getLaunchOptions();
        } catch (e) {
        }
      }
      var version = Math.floor(Number(options && options.miniToolEnv && options.miniToolEnv.buildVersion || 0) / 1e3);
      if (version >= 9460 && mini && typeof mini.getStorage === "function" && typeof mini.setStorage === "function") api = mini;
      var before = revision;
      try {
        var text;
        if (api) {
          var result = await api.getStorage({ key });
          text = result.data ? JSON.parse(result.data) : null;
        } else text = localStorage.getItem(key);
        if (before === revision && typeof text === "string") field.value = text;
      } catch (e) {
      }
    })();
    field.addEventListener("input", function() {
      revision++;
      var value = field.value;
      chain = chain.then(async function() {
        try {
          if (api) await api.setStorage({ key, data: JSON.stringify(value) });
          else localStorage.setItem(key, value);
          delete field.dataset.unsaved;
        } catch (e) {
          field.dataset.unsaved = "true";
        }
      });
    });
  };
})();
