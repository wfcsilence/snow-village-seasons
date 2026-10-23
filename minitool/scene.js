(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  window.streetCurrentScene = "original";
  window.streetScenes = {};
  window.streetAppendStyle = function(style, id) {
    style.media = "not all";
    document.head.appendChild(style);
    const scope = "#street-" + id;
    function scopeRules(rules) {
      for (const rule of Array.from(rules || [])) {
        if (rule.selectorText) {
          rule.selectorText = rule.selectorText.split(",").map((selector) => {
            selector = selector.trim();
            return selector.indexOf("body") === 0 ? scope + selector.slice(4) : scope + " " + selector;
          }).join(",");
        } else if (rule.cssRules) scopeRules(rule.cssRules);
      }
    }
    if (style.sheet) scopeRules(style.sheet.cssRules);
    style.media = "all";
    return style;
  };
  window.streetInitSnow = function() {
    (() => {
      "use strict";
      var _a, _b, _c;
      const sceneHost = document.getElementById("street-snow");
      const snowChineseLabels = { "\u307B\u3057\u306E  MART  \u2022  24 H": "\u96EA\u4E61\u5C0F\u4ED3\u4E70", "\u81EA \u52D5": "\u63A8\u95E8 \xB7 \u6696\u548C", "\u304A\u5F01\u5F53": "\u5BB6\u5E38\u996D", "\u304A\u3067\u3093  \u2022  COFFEE": "\u8C46\u6D46\xB7\u70ED\u7CA5", "\u304A\u3067\u3093\u30FB\u8089\u307E\u3093": "\u70ED\u6C64 \xB7 \u8C46\u5305", "\u3042\u3064\u3042\u3064 \u304A\u3067\u3093": "\u70ED\u4E4E\u5BB6\u5E38\u6C64", "\u6708\u520A": "\u4E61\u6751\u751F\u6D3B", "\u65B0\u767A\u58F2": "\u521A\u51FA\u9505", "\u3042\u3063\u305F\u304B": "\u70ED\u4E4E\u7684", "\u3064\u3081\u305F\u3044": "\u51B0\u9547\u996E\u6599", "\u7F36": "\u5564\u9152\u74F6", "PET": "\u5851\u6599\u74F6", "STAFF ONLY": "\u95F2\u4EBA\u514D\u8FDB", "DRINKS": "\u725B\u5976 \xB7 \u996E\u6599", "\u3012": "\u4FE1", "\u96E8\u3084\u3069\u308A": "\u907F\u96EA", "\u3072\u306A\u305F": "\u6652\u592A\u9633", "\u590F\u306E\u591C": "\u96EA\u4E61\u591C\u8BDD", "\u79CB\u306E\u65E5": "\u51AC\u65E5\u5C0F\u8BB0", "\u8857\u89D2\u4FBF\u308A": "\u6751\u91CC\u6D88\u606F", "\u79CB\u306E\u4FBF\u308A": "\u51AC\u65E5\u6765\u4FE1", "\u6A2A\u65AD\u6B69\u9053": "\u6751\u53E3\u6162\u884C", "\u661F\u6708\u901A\u308A": "\u96EA\u4E61\u6751\u8DEF", "\u884C\u304D\u6B62\u307E\u308A": "\u4E61\u95F4\u5C0F\u8DEF", "\u3088\u3046\u3053\u305D": "\u8FDB\u5C4B\u6696\u548C", "\u304A\u5F01\u5F53 \u304A\u6E21\u3057\u53E3": "\u4E1C\u5317\u5927\u4E71\u7096", "\u6E96\u5099\u4E2D": "\u7A0D\u7B49\u4E00\u4F1A\u513F", "\u5915\u6620\u3048": "\u96EA\u591C", "\u5915\u66AE\u308C\u4FBF\u308A": "\u96EA\u4E61\u6765\u4FE1", "\u3072\u3068\u4F11\u307F": "\u6B47\u6B47\u811A" };
      let isSunny = false, weatherBlend = 0, isDusk = false, weatherMode = "rain", frontCuriosity = -100, dogCuriosity = -100, takeoutVariant = "bento", singleTapTimer = null, focusTween = null;
      const weatherLabels = [];
      const scene = new THREE.Scene();
      const renderer = window.makeStreetRenderer(THREE);
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(2e6 / (window.sceneViewport.width * window.sceneViewport.height))));
      renderer.setSize(window.sceneViewport.width, window.sceneViewport.height);
      renderer.shadowMap.enabled = false;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      sceneHost.appendChild(renderer.domElement);
      renderer.domElement.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        window.streetRenderStopped = true;
        if (window.__scene && window.__scene.audio.context) window.__scene.audio.context.suspend();
        window.sceneFallback("\u4E09\u7EF4\u753B\u9762\u6682\u65F6\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u9875\u9762\u6062\u590D\u3002");
      });
      renderer.domElement.addEventListener("webglcontextrestored", () => {
        window.streetRenderStopped = false;
        window.sceneFallbackHide();
      });
      const camera = new THREE.PerspectiveCamera(36, window.sceneViewport.width / window.sceneViewport.height, 0.1, 100);
      const world = new THREE.Group();
      scene.add(world);
      const gradient = new THREE.DataTexture(new Uint8Array([68, 68, 68, 255, 118, 118, 118, 255, 184, 184, 184, 255, 242, 242, 242, 255]), 4, 1, THREE.RGBAFormat);
      gradient.needsUpdate = true;
      gradient.minFilter = gradient.magFilter = THREE.NearestFilter;
      const mats = /* @__PURE__ */ new Map();
      function mat(c, em = 0) {
        const key = c + ":" + em;
        if (!mats.has(key)) mats.set(key, new THREE.MeshToonMaterial({ color: c, gradientMap: gradient, emissive: em ? c : 0, emissiveIntensity: em }));
        return mats.get(key);
      }
      const ink = new THREE.LineBasicMaterial({ color: 1319735, transparent: true, opacity: 0.7 });
      function box(x, y, z, w, h, d, c, edge = true, em = 0, parent = world) {
        const g = new THREE.BoxGeometry(w, h, d), o = new THREE.Mesh(g, mat(c, em));
        o.position.set(x, y, z);
        o.castShadow = true;
        o.receiveShadow = true;
        parent.add(o);
        if (edge) {
          o.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), ink));
        }
        return o;
      }
      function cyl(x, y, z, r, h, c, n = 12, parent = world) {
        const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, n), mat(c));
        o.position.set(x, y, z);
        o.castShadow = true;
        o.receiveShadow = true;
        parent.add(o);
        return o;
      }
      function line(points, c = 2504007, width = 1, parent = world) {
        const o = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(...p))), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.9 }));
        parent.add(o);
        return o;
      }
      function rod(a, b, r, c, parent = world) {
        const p = new THREE.Vector3(...a), q = new THREE.Vector3(...b), o = cyl(0, 0, 0, r, p.distanceTo(q), c, 10, parent);
        o.position.copy(p.add(q).multiplyScalar(0.5));
        o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).normalize());
        return o;
      }
      function texture(w, h, draw) {
        const cv = document.createElement("canvas");
        const scale = Math.min(1, 512 / Math.max(w, h));
        cv.width = Math.max(1, Math.round(w * scale));
        cv.height = Math.max(1, Math.round(h * scale));
        draw(cv.getContext("2d"), cv.width, cv.height);
        const t = new THREE.CanvasTexture(cv);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        return t;
      }
      const isCyberEdition = true;
      const sceneEnglishLabels = { "\u307B\u3057\u306E  MART  \u2022  24 H": "HOSHITSUKI MART \u2022 24 H", "\u81EA \u52D5": "AUTO", "\u304A\u5F01\u5F53": "BENTO", "\u304A\u3067\u3093  \u2022  COFFEE": "ODEN & COFFEE", "\u304A\u3067\u3093\u30FB\u8089\u307E\u3093": "ODEN & BUNS", "\u3042\u3064\u3042\u3064 \u304A\u3067\u3093": "HOT ODEN", "\u6708\u520A": "READ", "\u65B0\u767A\u58F2": "NEW", "\u3042\u3063\u305F\u304B": "HOT", "\u3064\u3081\u305F\u3044": "COLD", "\u7F36": "CANS", "\u3012": "MAIL", "\u96E8\u3084\u3069\u308A": "SHELTER", "\u3072\u306A\u305F": "SUNNY SPOT", "\u590F\u306E\u591C": "SUMMER NIGHT", "\u79CB\u306E\u65E5": "AUTUMN DAY", "\u8857\u89D2\u4FBF\u308A": "STREET NEWS", "\u79CB\u306E\u4FBF\u308A": "AUTUMN NEWS", "\u6A2A\u65AD\u6B69\u9053": "CROSSWALK", "\u661F\u6708\u901A\u308A": "HOSHITSUKI ST.", "\u884C\u304D\u6B62\u307E\u308A": "LOCAL ACCESS", "\u3088\u3046\u3053\u305D": "WELCOME", "\u304A\u5F01\u5F53 \u304A\u6E21\u3057\u53E3": "BENTO PICKUP", "\u6E96\u5099\u4E2D": "PREPARING", "\u5915\u6620\u3048": "AFTERGLOW", "\u5915\u66AE\u308C\u4FBF\u308A": "EVENING NEWS", "\u3072\u3068\u4F11\u307F": "TAKE A BREAK", "\u661F \u6708   MART  /  2077": "HOSHITSUKI MART / 2077" };
      function sceneEnglish(text) {
        return snowChineseLabels[text] || text;
      }
      function plaque(x, y, z, w, h, text, bg, fg, size = 80, parent = world) {
        const sourceText = text;
        text = sceneEnglish(text);
        const t = texture(1024, Math.max(64, Math.min(1024, Math.round(1024 * h / w))), (c, W, H) => {
          c.fillStyle = bg;
          c.fillRect(0, 0, W, H);
          c.fillStyle = fg;
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.font = "700 ".concat(Math.min(H * 0.68, 1024 / (text.length * 0.65)), 'px "Yu Gothic", "Microsoft YaHei", sans-serif');
          let measured = c.measureText(text).width;
          if (measured > W * 0.86) {
            c.font = "700 ".concat(Math.min(H * 0.68, 1024 / (text.length * 0.65)) * (W * 0.86 / measured), 'px "Yu Gothic", "Microsoft YaHei", sans-serif');
          }
          c.fillText(text, W / 2, H / 2);
        });
        const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t }));
        o.position.set(x, y, z);
        t.userData.displayText = text;
        t.userData.labelPalette = { bg, fg };
        o.userData.text = sourceText;
        o.userData.displayText = text;
        parent.add(o);
        return o;
      }
      function seasonalPlaque(x, y, z, w, h, rainText, sunText, bg, fg, size = 80, parent = world) {
        const label2 = plaque(x, y, z, w, h, rainText, bg, fg, size, parent);
        const sunny = plaque(0, 0, 0, w, h, sunText, bg, fg, size, parent);
        parent.remove(sunny);
        sunny.geometry.dispose();
        sunny.material.dispose();
        label2.userData.weatherTexts = [rainText, sunText];
        label2.userData.weatherMaps = [label2.material.map, sunny.material.map];
        weatherLabels.push(label2);
        return label2;
      }
      const floorY = 0.27;
      box(0, -0.1, 0, 12, 0.65, 12, 3426136);
      box(0, 0.235, 0, 11.94, 0.03, 11.94, 2506577, false);
      const asphalt = texture(1024, 1024, (c, w, h) => {
        c.fillStyle = "#263e52";
        c.fillRect(0, 0, w, h);
        let seed2 = 91;
        function rnd2() {
          seed2 = seed2 * 1664525 + 1013904223 >>> 0;
          return seed2 / 4294967296;
        }
        for (let i = 0; i < 32e3; i++) {
          let v = 60 + rnd2() * 45;
          c.fillStyle = "rgba(".concat(v, ",").concat(v + 15, ",").concat(v + 24, ",.16)");
          c.fillRect(rnd2() * w, rnd2() * h, 1 + rnd2() * 3, 1);
        }
        for (let i = 0; i < 140; i++) {
          c.strokeStyle = "rgba(110,150,178,.09)";
          c.beginPath();
          let x = rnd2() * w, y = rnd2() * h;
          c.ellipse(x, y, rnd2() * 50 + 5, rnd2() * 8 + 2, 0, 0, 7);
          c.stroke();
        }
      });
      const street = new THREE.Mesh(new THREE.PlaneGeometry(11.9, 11.9), new THREE.MeshStandardMaterial({ map: asphalt, color: 11585759, roughness: 0.24, metalness: 0.48 }));
      street.rotation.x = -Math.PI / 2;
      street.position.y = 0.26;
      street.receiveShadow = true;
      world.add(street);
      function rampWidth(x) {
        return Math.min(THREE.MathUtils.clamp((x - 2.18) / 0.22, 0, 1), THREE.MathUtils.clamp((3.72 - x) / 0.16, 0, 1));
      }
      function rampDrop(x, z) {
        return 0.23 * rampWidth(x) * THREE.MathUtils.clamp((z - 1.75) / 0.795, 0, 1);
      }
      const sidewalkExtension = new THREE.Mesh(new THREE.BoxGeometry(9.67, 0.25, 8.6, 100, 1, 100), mat(5400696));
      sidewalkExtension.position.set(-1.115, 0.385, -1.65);
      sidewalkExtension.name = "continuous-sidewalk";
      sidewalkExtension.receiveShadow = true;
      world.add(sidewalkExtension);
      {
        const p = sidewalkExtension.geometry.attributes.position;
        for (let i = 0; i < p.count; i++) if (p.getY(i) > 0) p.setY(i, p.getY(i) - rampDrop(p.getX(i) - 1.115, p.getZ(i) - 1.65));
        p.needsUpdate = true;
        sidewalkExtension.geometry.computeVertexNormals();
      }
      const pavementTiles = [], tileStep = 0.72, tileOriginX = -5.35, tileOriginZ = -4.75;
      const pavingBounds = { left: -5.95, right: 3.58, back: -5.95, front: 2.545 };
      for (let ix = -1; ix < 14; ix++) for (let iz = -2; iz < 12; iz++) {
        const cx = tileOriginX + ix * tileStep, cz = tileOriginZ + iz * tileStep;
        const x0 = Math.max(cx - 0.345, pavingBounds.left), x1 = Math.min(cx + 0.345, pavingBounds.right), z0 = Math.max(cz - 0.345, pavingBounds.back), z1 = Math.min(cz + 0.345, pavingBounds.front);
        if (x1 - x0 < 0.015 || z1 - z0 < 0.015) continue;
        const tile = box((x0 + x1) / 2, 0.518, (z0 + z1) / 2, x1 - x0, 0.012, z1 - z0, 7043973, false);
        const p = tile.geometry.attributes.position;
        for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) - rampDrop(p.getX(i) + tile.position.x, p.getZ(i) + tile.position.z));
        p.needsUpdate = true;
        tile.geometry.computeVertexNormals();
        tile.name = "aligned-paving-tile";
        tile.userData.grid = [ix, iz];
        pavementTiles.push(tile);
      }
      const curbParts = [];
      const curbCuts = [-5.95];
      for (let x = -5.45; x < 3.86; x += 0.5) curbCuts.push(x);
      curbCuts.push(2.18, 2.4, 3.56, 3.72, 3.86);
      curbCuts.sort((a, b) => a - b);
      for (let i = 0; i < curbCuts.length - 1; i++) {
        const x0 = curbCuts[i], x1 = curbCuts[i + 1];
        if (x1 - x0 < 1e-3) continue;
        const curb = box((x0 + x1) / 2, 0.43, 2.68, x1 - x0, 0.28, 0.27, 10070189, false);
        const p = curb.geometry.attributes.position;
        for (let j = 0; j < p.count; j++) if (p.getY(j) > 0) p.setY(j, p.getY(j) - 0.276 * rampWidth(p.getX(j) + curb.position.x));
        p.needsUpdate = true;
        curb.geometry.computeVertexNormals();
        curb.add(new THREE.LineSegments(new THREE.EdgesGeometry(curb.geometry), ink));
        curb.name = "crossing-curb";
        curbParts.push(curb);
      }
      for (let z = -5.95; z < 2.545; z += 0.5) {
        const d = Math.min(0.5, 2.545 - z);
        curbParts.push(box(3.72, 0.43, z + d / 2, 0.28, 0.28, d, 10070189));
      }
      const farRoadCurb = new THREE.Group();
      farRoadCurb.name = "opposite-road-edge-curb";
      world.add(farRoadCurb);
      const farCuts = [-5.95, 2.18, 2.4, 3.56, 3.72, 5.95];
      for (let x = -5.45; x < 5.95; x += 0.5) farCuts.push(x);
      farCuts.sort((a, b) => a - b);
      for (let i = 0; i < farCuts.length - 1; i++) {
        const a = farCuts[i], b = farCuts[i + 1];
        if (b - a < 1e-3) continue;
        const curb = box((a + b) / 2, 0.43, 5.82, b - a, 0.28, 0.27, 10070189, false, 0, farRoadCurb), points = curb.geometry.attributes.position;
        for (let j = 0; j < points.count; j++) if (points.getY(j) > 0) points.setY(j, points.getY(j) - 0.276 * rampWidth(points.getX(j) + curb.position.x));
        points.needsUpdate = true;
        curb.geometry.computeVertexNormals();
        curb.add(new THREE.LineSegments(new THREE.EdgesGeometry(curb.geometry), ink));
      }
      const edgeDecorations = [];
      for (const x of [-5.1, -2.6, 0.2, 4.75]) {
        const g = new THREE.Group();
        g.name = "weather-road-edge-stud";
        g.position.set(x, 0.576, 5.82);
        farRoadCurb.add(g);
        box(0, 0, 0, 0.14, 0.012, 0.095, 5400696, true, 0, g);
        const variants = {};
        for (const mode of ["rain", "sunny", "dusk", "cyber"]) {
          const v = new THREE.Group();
          v.name = "edge-stud-" + mode;
          g.add(v);
          variants[mode] = v;
        }
        const rainStud = box(0, 0.01, 0, 0.1, 9e-3, 0.045, 11130589, false, 0, variants.rain);
        rainStud.material = new THREE.MeshBasicMaterial({ color: 11130589, transparent: true, opacity: 0.55 });
        cyl(0, 0.011, 0, 0.035, 9e-3, 12887929, 12, variants.sunny);
        for (const a of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
          const ray = box(Math.cos(a) * 0.049, 0.011, Math.sin(a) * 0.034, 0.018, 7e-3, 9e-3, 12887929, false, 0, variants.sunny);
          ray.rotation.y = -a;
        }
        for (const x2 of [-0.032, 0.032]) {
          const amber = box(x2, 0.011, 0, 0.024, 0.01, 0.047, 14857604, false, 0, variants.dusk);
          amber.material = new THREE.MeshBasicMaterial({ color: 14857604, transparent: true, opacity: 0.6 });
          const cyan = box(x2, 0.011, 0, 0.025, 9e-3, 0.05, 8047322, false, 0, variants.cyber);
          cyan.material = new THREE.MeshBasicMaterial({ color: 8047322, transparent: true, opacity: 0.7 });
        }
        edgeDecorations.push(variants);
      }
      function animateEdgeDecorations() {
        const mode = weatherMode === "cyber" ? "cyber" : isDusk ? "dusk" : isSunny ? "sunny" : "rain";
        edgeDecorations.forEach((variants) => Object.keys(variants).forEach((k) => variants[k].visible = k === mode));
      }
      box(-1.15, 0.59, -1.55, 6.9, 0.18, 4.6, 15062456);
      box(-3.7625, 2.03, -3.8, 1.675, 2.8, 0.13, 14145219);
      box(-0.455, 2.03, -3.8, 2.84, 2.8, 0.13, 14145219);
      box(-2.4, 1.02, -3.8, 1.05, 0.78, 0.13, 14145219);
      box(-2.4, 2.89, -3.8, 1.05, 1.08, 0.13, 14145219);
      box(2.1775, 2.03, -3.8, 0.245, 2.8, 0.13, 14145219);
      box(1.51, 3.14, -3.8, 1.09, 0.58, 0.13, 14145219);
      const leftWallSections = new THREE.Group();
      leftWallSections.name = "left-wall-around-vent-opening";
      world.add(leftWallSections);
      box(-4.55, 2.03, -3.385, 0.14, 2.8, 0.93, 12241350, true, 0, leftWallSections);
      box(-4.55, 2.03, -0.585, 0.14, 2.8, 2.47, 12241350, true, 0, leftWallSections);
      box(-4.55, 1.125, -2.37, 0.14, 0.99, 1.1, 12241350, true, 0, leftWallSections);
      box(-4.55, 2.875, -2.37, 0.14, 1.11, 1.1, 12241350, true, 0, leftWallSections);
      box(-1.15, 3.61, -1.57, 7.15, 0.22, 4.85, 7900306);
      box(-1.15, 3.79, -1.57, 7.35, 0.14, 5.02, 3953763);
      for (let z = -3.8; z < 0.8; z += 0.38) box(-1.15, 3.87, z, 7.1, 0.014, 0.025, 7045255, false);
      box(-1.15, 3.38, 0.89, 7.45, 0.43, 0.46, 15788242);
      box(-1.15, 3.23, 1.08, 7.45, 0.065, 0.12, 7394994, false, 0.35);
      box(-1.15, 3.53, 1.08, 7.45, 0.045, 0.12, 16100720, false, 0.4);
      const sign = plaque(-1.15, 3.4, 1.126, 6.65, 0.29, "\u307B\u3057\u306E  MART  \u2022  24 H", "#f5efd9", "#247d75", 90);
      const frontAwning = box(-1.15, 2.99, 1.3, 7.5, 0.16, 1, 5400953);
      frontAwning.name = "shaded-front-awning";
      frontAwning.material = mat(5400953).clone();
      frontAwning.material.onBeforeCompile = (shader) => {
        const chunk = THREE.ShaderChunk.lights_fragment_begin.replace("getPointLightInfo( pointLight, geometryPosition, directLight );", "getPointLightInfo( pointLight, geometryPosition, directLight ); directLight.color *= ( inverseTransformDirection( geometryNormal, viewMatrix ).y > -0.1 ? 0.0 : 1.0 );");
        const corrected = chunk.replace("getSpotLightInfo( spotLight, geometryPosition, directLight );", "getSpotLightInfo( spotLight, geometryPosition, directLight ); directLight.color *= ( inverseTransformDirection( geometryNormal, viewMatrix ).y > -0.1 ? 0.0 : 1.0 );");
        shader.fragmentShader = shader.fragmentShader.replace("#include <lights_fragment_begin>", corrected);
      };
      frontAwning.material.customProgramCacheKey = () => "awning-without-top-and-rim-hotspots";
      box(-1.15, 2.89, 1.34, 7.35, 0.035, 0.9, 16767906, false, 0.8);
      for (let x of [-4.53, -2.12, -0.32, 2.31]) box(x, 1.77, 0.77, 0.055, 2.48, 0.065, 4479844);
      box(-3.325, 0.76, 0.77, 2.41, 0.12, 0.11, 5137516);
      box(0.995, 0.76, 0.77, 2.63, 0.12, 0.11, 5137516);
      box(-1.15, 2.98, 0.77, 6.9, 0.11, 0.11, 5137516);
      const glass = new THREE.MeshPhysicalMaterial({ color: 14868413, transparent: true, opacity: 0.12, roughness: 0.14, metalness: 0.1, side: THREE.DoubleSide, depthWrite: false });
      function pane(x, y, z, w, h, rot = 0, parent = world) {
        let o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glass);
        o.position.set(x, y, z);
        o.rotation.y = rot;
        parent.add(o);
        return o;
      }
      pane(-3.325, 1.86, 0.8, 2.35, 2.13);
      pane(0.995, 1.86, 0.8, 2.57, 2.13);
      pane(2.31, 2.11, -1.5, 4.62, 2.72, Math.PI / 2);
      for (let z = -3.65; z < 0.9; z += 1.5) box(2.34, 2.025, z, 0.075, 2.96, 0.065, 4413281);
      box(2.34, 0.77, -1.45, 0.08, 0.12, 4.4, 5269618);
      box(2.34, 2.97, -1.45, 0.08, 0.12, 4.4, 5269618);
      const rightRoofHeader = box(2.34, 3.49, -1.45, 0.09, 0.1, 4.62, 4413281);
      rightRoofHeader.name = "continuous-right-roof-header";
      const shellSeals = new THREE.Group();
      shellSeals.name = "continuous-shell-junctions";
      world.add(shellSeals);
      box(-1.15, 3.465, -3.8, 6.96, 0.17, 0.16, 14145219, true, 0, shellSeals);
      box(-4.55, 3.465, -1.55, 0.16, 0.17, 4.65, 12241350, true, 0, shellSeals);
      box(-1.15, 3.285, 0.77, 6.96, 0.53, 0.13, 7900306, true, 0, shellSeals);
      box(-4.55, 2.07, 0.735, 0.15, 2.96, 0.2, 4479844, true, 0, shellSeals);
      box(2.32, 2.075, 0.78, 0.105, 2.97, 0.105, 4413281, true, 0, shellSeals);
      box(2.32, 2.075, -3.765, 0.105, 2.97, 0.18, 4413281, true, 0, shellSeals);
      box(2.34, 0.765, -1.5, 0.09, 0.13, 4.62, 5269618, true, 0, shellSeals);
      const doors = [];
      for (let i = 0; i < 2; i++) {
        let g = new THREE.Group();
        g.position.set(-1.22 + (i ? 0.44 : -0.44), 0, 0.825);
        world.add(g);
        pane(0, 1.85, 0, 0.84, 2.16, 0, g);
        box(0, 0.77, 0, 0.84, 0.08, 0.07, 6586758, true, 0, g);
        box(0, 2.94, 0, 0.84, 0.06, 0.07, 6586758, true, 0, g);
        for (let x of [-0.42, 0.42]) box(x, 1.85, 0, 0.04, 2.2, 0.07, 6586758, true, 0, g);
        box(i ? -0.27 : 0.27, 1.65, 0.04, 0.035, 0.38, 0.04, 14801333, true, 0, g);
        plaque(0, 1.45, 0.048, 0.48, 0.1, "\u81EA \u52D5", "#f0ead3", "#417f76", 100, g);
        doors.push(g);
      }
      box(-1.22, 0.62, 1.12, 1.6, 0.025, 0.72, 3161671);
      for (let i = 0; i < 8; i++) box(-1.88 + i * 0.18, 0.637, 1.12, 0.03, 8e-3, 0.65, 5662053, false);
      for (let x = -4.1; x < 2; x += 0.6) for (let z = -3.4; z < 0.7; z += 0.6) box(x, 0.694, z, 0.575, 8e-3, 0.575, 14800045, false);
      for (let z of [-2.7, -0.5]) {
        box(-1.2, 3.43, z, 5.75, 0.035, 0.17, 16774087, false, 1.3);
      }
      const refrigeratorDoors = [], refrigeratorLeaves = [];
      for (let k = 0; k < 3; k++) {
        const x = [-3.92, -1.35, -0.25][k], g = new THREE.Group();
        g.name = "refrigerator-hollow-cabinet";
        world.add(g);
        box(x, 1.65, -3.7, 1.05, 1.91, 0.055, 3495015, true, 0, g);
        for (const side of [-1, 1]) box(x + side * 0.51, 1.65, -3.33, 0.035, 1.91, 0.72, 3495015, true, 0, g);
        for (const y of [0.71, 2.59]) box(x, y, -3.33, 1.05, 0.045, 0.72, 3495015, true, 0, g);
        box(x, 1.68, -3.66, 0.96, 1.61, 0.018, k === 2 ? 15316601 : 9884365, false, 0.35, g);
        for (const y of [1.04, 1.43, 1.84, 2.24]) {
          box(x, y, -3.32, 0.94, 0.04, 0.55, 15196870, true, 0, g);
          for (let j = 0; j < 5; j++) {
            const xx = x - 0.36 + j * 0.18;
            if (k === 2) {
              box(xx, y + 0.08, -3.28, 0.165, 0.12, 0.34, 13022606, false, 0, g);
              box(xx, y + 0.15, -3.28, 0.16, 0.015, 0.33, 15327945, false, 0, g);
              box(xx - 0.03, y + 0.164, -3.25, 0.06, 0.014, 0.13, 11570512, false, 0, g);
              box(xx + 0.04, y + 0.164, -3.25, 0.04, 0.014, 0.13, 7771755, false, 0, g);
            } else if (k === 0 && j % 2) {
              box(xx, y + 0.13, -3.23, 0.13, 0.22, 0.13, 15328469, false, 0, g);
              box(xx, y + 0.25, -3.23, 0.14, 0.02, 0.14, 12043964, false, 0, g);
            } else {
              const bottle = cyl(xx, y + 0.14, -3.23, 0.059, 0.21, k === 0 ? 15656917 : [6721428, 8939082, 10587218, 7511689, 8951204][j], 8, g);
              bottle.name = k === 0 ? "milk-bottle" : "drink-bottle";
              cyl(xx, y + 0.26, -3.23, 0.036, 0.025, k === 0 ? 10139830 : 12040610, 8, g);
              box(xx, y + 0.15, -3.166, 0.09, 0.05, 8e-3, 16774359, false, 0, g);
            }
          }
        }
        const doorPartsStart = g.children.length;
        const door = pane(x, 1.66, -2.968, 0.96, 1.77, 0, g);
        door.name = "refrigerator-glass-door";
        refrigeratorDoors.push(door);
        for (const side of [-1, 1]) box(x + side * 0.48, 1.66, -2.95, 0.028, 1.8, 0.035, 3757155, true, 0, g);
        for (const y of [0.76, 2.56]) box(x, y, -2.95, 0.98, 0.03, 0.035, 3757155, true, 0, g);
        box(x + 0.39, 1.76, -2.92, 0.025, 0.45, 0.035, 3757155, true, 0, g);
        const leaf = new THREE.Group();
        leaf.position.set(x - 0.48, 0, -2.948);
        leaf.name = "refrigerator-hinged-leaf";
        leaf.userData.open = false;
        leaf.userData.amount = 0;
        g.add(leaf);
        g.updateMatrixWorld(true);
        g.children.slice(doorPartsStart).filter((o) => o !== leaf).forEach((o) => leaf.attach(o));
        refrigeratorLeaves.push(leaf);
        box(x, 2.65, -3.17, 1.04, 0.19, 0.08, 15330772, false, 0.5, g);
        plaque(x, 2.65, -3.12, 0.91, 0.11, ["\u725B\u5976 \xB7 \u9178\u5976", "\u9152\u6C34 \xB7 \u996E\u6599", "\u70ED\u76D2\u996D"][k], "#ecf0d9", "#30626a", 90, g);
      }
      const shelfUnits = [];
      function shelf(x, z, w) {
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        g.name = "stocked-open-shelf";
        world.add(g);
        shelfUnits.push(g);
        box(0, 1.28, 0, w, 1.12, 0.035, 11842976, true, 0, g);
        for (let side of [-1, 1]) box(side * w / 2, 1.28, 0, 0.035, 1.12, 0.65, 13223596, true, 0, g);
        const colors = [15649657, 15372933, 9615264, 13018555, 15064257];
        [0.91, 1.29, 1.68].forEach((y, level) => {
          box(0, y, 0, w + 0.08, 0.055, 0.73, 15983030, true, 0, g);
          for (let j = 0; j < 9; j++) for (let side of [-1, 1]) {
            const xx = -w * 0.43 + j * w * 0.107, d = side * 0.23, color = colors[(j + level * 2) % 5];
            let product;
            if (level < 2 && j % 3 === 0) {
              product = cyl(xx, y + 0.145, d, 0.058, 0.235, color, 10, g);
              cyl(xx, y + 0.273, d, 0.04, 0.023, 13883333, 8, g);
            } else {
              const h = level === 0 ? 0.19 : level === 1 ? 0.245 : 0.22;
              product = box(xx, y + 0.028 + h / 2, d, 0.14, h, 0.13, color, false, 0, g);
            }
            product.name = "shelf-product";
            product.userData.shelfLevel = level;
            box(xx, y + 0.145, d + side * 0.072, 0.103, 0.06, 9e-3, 16774102, false, 0, g);
          }
          for (let side of [-1, 1]) {
            box(0, y - 0.05, side * 0.379, w, 0.085, 0.01, 16052192, false, 0, g);
            for (let j = 0; j < 9; j++) box(-w * 0.44 + j * w * 0.11, y - 0.05, side * 0.386, 0.085, 0.034, 4e-3, 13527637, false, 0, g);
          }
        });
      }
      shelf(-2.7, -1.9, 2.25);
      shelf(-2.7, -0.65, 2.25);
      box(0.88, 1.08, -0.78, 1.97, 0.8, 0.68, 12823428);
      box(0.88, 1.51, -0.78, 2.1, 0.08, 0.77, 16050898);
      box(0.88, 1.12, -0.417, 1.84, 0.33, 0.017, 6719359);
      plaque(0.88, 1.12, -0.403, 1.38, 0.13, "\u304A\u3067\u3093  \u2022  COFFEE", "#66877f", "#f4ebd2", 70);
      box(0.41, 1.7, -0.78, 0.39, 0.29, 0.28, 3359822);
      let reg = box(0.41, 1.87, -0.74, 0.4, 0.23, 0.055, 3230043);
      reg.rotation.x = -0.3;
      box(0.41, 1.87, -0.699, 0.3, 0.14, 6e-3, 9164225, false, 0.5);
      box(1.54, 1.81, -0.78, 0.37, 0.54, 0.35, 3556945);
      box(1.54, 1.91, -0.585, 0.23, 0.18, 0.015, 9684407, false, 0.4);
      const cupProfile = [[0, 0], [0.045, 0], [0.057, 0.09], [0.046, 0.09], [0.035, 0.014], [0, 0.014]].map(([r, y]) => new THREE.Vector2(r, y));
      const coffeeCup = new THREE.Mesh(new THREE.LatheGeometry(cupProfile, 24), mat(16774101));
      coffeeCup.position.set(1.54, 1.57, -0.57);
      coffeeCup.castShadow = true;
      world.add(coffeeCup);
      box(0.92, 1.63, -0.76, 0.49, 0.14, 0.37, 13350256);
      for (let x of [0.79, 0.94, 1.08]) for (let z of [-0.86, -0.67]) cyl(x, 1.72, z, 0.054, 0.07, 14467218, 8);
      pane(0.94, 1.82, -0.54, 0.53, 0.2);
      box(1.51, 1.05, -2.29, 1.27, 0.71, 0.74, 15064529);
      box(1.51, 1.43, -2.29, 1.32, 0.09, 0.8, 9488321);
      plaque(1.51, 1.03, -1.907, 0.96, 0.17, "\u304A\u3067\u3093\u30FB\u8089\u307E\u3093", "#e4ddd0", "#a06443", 70);
      const odenCounter = new THREE.Group();
      odenCounter.name = "hot-oden-display";
      world.add(odenCounter);
      box(1.32, 1.54, -2.31, 0.84, 0.12, 0.61, 10201761, true, 0, odenCounter);
      box(1.32, 1.608, -2.31, 0.76, 0.012, 0.53, 10911301, false, 0.08, odenCounter);
      for (let x of [1.185, 1.455]) box(x, 1.638, -2.31, 0.018, 0.07, 0.55, 13946795, true, 0, odenCounter);
      box(1.32, 1.638, -2.31, 0.8, 0.07, 0.018, 13946795, true, 0, odenCounter);
      for (let col = 0; col < 3; col++) for (let row = 0; row < 2; row++) {
        const x = 1.05 + col * 0.27, z = -2.445 + row * 0.27;
        if (col === 0) {
          cyl(x, 1.659, z, 0.073, 0.085, 15848865, 14, odenCounter);
          cyl(x, 1.705, z, 0.045, 5e-3, 15058065, 12, odenCounter);
        } else if (col === 1) {
          const egg = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), mat(row ? 15255181 : 16048564));
          egg.position.set(x, 1.674, z);
          egg.scale.set(0.065, 0.075, 0.052);
          odenCounter.add(egg);
        } else {
          const tofu = box(x, 1.669, z, 0.115, 0.09, 0.12, row ? 14069362 : 15385998, true, 0, odenCounter);
          tofu.rotation.y = 0.28;
        }
      }
      cyl(1.96, 1.558, -2.33, 0.135, 0.135, 13148780, 16, odenCounter);
      cyl(1.96, 1.628, -2.33, 0.14, 0.016, 14926475, 16, odenCounter);
      const bunsGroup = new THREE.Group();
      bunsGroup.name = "steamer-buns";
      odenCounter.add(bunsGroup);
      bunsGroup.visible = false;
      for (let i = 0; i < 3; i++) {
        let a = i * Math.PI * 2 / 3, bun = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 8), mat(16771779));
        bun.scale.y = 0.82;
        bun.position.set(1.96 + Math.cos(a) * 0.06, 1.675, -2.33 + Math.sin(a) * 0.06);
        bunsGroup.add(bun);
      }
      const bunLid = new THREE.Group();
      bunLid.name = "bamboo-steamer-lid";
      bunLid.position.set(1.96, 1.636, -2.47);
      odenCounter.add(bunLid);
      cyl(0, 0.06, 0.14, 0.146, 0.11, 13346160, 20, bunLid);
      const lidTop = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.149, 0.04, 20), mat(14728580));
      lidTop.position.set(0, 0.131, 0.14);
      lidTop.castShadow = true;
      bunLid.add(lidTop);
      for (let i = 0; i < 5; i++) box(-0.086 + i * 0.043, 0.154, 0.14, 0.01, 6e-3, 0.14, 12885867, false, 0, bunLid);
      const lidHandle = new THREE.Mesh(new THREE.TorusGeometry(0.025, 8e-3, 6, 16, Math.PI), mat(11833183));
      lidHandle.position.set(0, 0.155, 0.14);
      bunLid.add(lidHandle);
      for (let x of [0.9, 2.16]) rod([x, 1.48, -2.59], [x, 1.99, -2.59], 0.018, 7440255, odenCounter);
      box(1.53, 2, -2.59, 1.3, 0.12, 0.07, 10706755, true, 0, odenCounter);
      plaque(1.53, 2, -2.547, 1.14, 0.09, "\u3042\u3064\u3042\u3064 \u304A\u3067\u3093", "#a35f43", "#ffedc5", 75, odenCounter);
      pane(1.53, 1.78, -1.98, 1.25, 0.37, 0, odenCounter);
      rod([1.09, 1.65, -1.96], [1.38, 1.65, -2.03], 0.012, 12634298, odenCounter);
      rod([1.09, 1.65, -1.96], [1.37, 1.65, -1.98], 0.012, 12634298, odenCounter);
      box(-4.21, 1.19, 0.08, 0.37, 0.98, 0.66, 6388864);
      for (let i = 0; i < 4; i++) {
        let p = box(-4.2, 1.02 + i * 0.2, 0.43, 0.29, 0.23, 0.025, [14988448, 10075585, 15784080, 10985929][i]);
        p.rotation.x = -0.25;
        plaque(-4.2, 1.06 + i * 0.2, 0.45, 0.2, 0.065, ["\u4E61\u6751\u751F\u6D3B", "\u519C\u6C11\u65E5\u62A5", "\u6545\u4E8B\u4F1A", "\u5065\u5EB7\u62A5"][i], "#ecdac1", "#3d6477", 95);
      }
      const staffLeafStart = world.children.length;
      const staffDoor = box(1.51, 1.77, -3.8, 1.01, 2.12, 0.14, 11186842);
      staffDoor.name = "shared-service-door";
      for (let z of [-3.715, -3.885]) {
        let label2 = plaque(1.51, 2.1, z, 0.8, 0.19, "STAFF ONLY", "#aab29a", "#fff1cc", 65);
        if (z < -3.8) label2.rotation.y = Math.PI;
        box(1.85, 1.64, z, 0.06, 0.065, 0.045, 14797210);
      }
      const staffLeaf = world.children.slice(staffLeafStart);
      const staffHinge = new THREE.Group();
      staffHinge.position.set(1.005, 0, -3.8);
      world.add(staffHinge);
      world.updateMatrixWorld(true);
      staffLeaf.forEach((o) => staffHinge.attach(o));
      for (let y of [1.08, 2.5]) cyl(1.005, y, -3.8, 0.034, 0.16, 12824456, 10);
      for (let x of [0.975, 2.045]) box(x, 1.78, -3.8, 0.055, 2.2, 0.2, 6189421);
      box(1.51, 2.89, -3.8, 1.13, 0.08, 0.2, 6189421);
      box(1.51, 0.64, -4.13, 1.32, 0.22, 0.64, 8753547);
      box(1.51, 3.01, -3.99, 0.5, 0.1, 0.24, 6912110);
      box(1.51, 2.95, -4.01, 0.4, 0.018, 0.19, 16764558, false, 1.1);
      box(-2.4, 3.075, -3.9, 1.32, 0.43, 0.045, 5798253);
      for (const [x, text] of [[-2.73, "\u65B0\u767A\u58F2"], [-2.07, "\u3042\u3063\u305F\u304B"]]) {
        const p = plaque(x, 3.16, -3.93, 0.52, 0.16, text, "#e8dab8", "#8b7155", 80);
        p.rotation.y = Math.PI;
      }
      const vendingCans = [], vendingPalettes = { rain: [7445430, 8301225, 9344180, 7183507], sunny: [15187058, 14654588, 14208923, 11912603], dusk: [12818566, 12095135, 13217161, 9801894] };
      function vendingPalette() {
        return vendingPalettes[weatherMode];
      }
      box(-5.03, 1.4, 0.78, 0.79, 1.79, 0.75, 11192011);
      box(-5.03, 2.36, 0.78, 0.85, 0.12, 0.81, 4217968);
      box(-5.03, 1.66, 1.166, 0.62, 1.01, 0.026, 2506581);
      box(-5.03, 1.67, 1.19, 0.53, 0.88, 0.016, 10344919, false, 0.65);
      for (let y of [1.37, 1.64, 1.9]) for (let i = 0; i < 4; i++) {
        const can = cyl(-5.23 + i * 0.135, y, 1.22, 0.046, 0.16, vendingPalette()[i], 8);
        can.material = can.material.clone();
        can.userData.slot = i;
        vendingCans.push(can);
        box(-5.23 + i * 0.135, y - 0.13, 1.232, 0.076, 0.03, 0.014, 14151139, false, 0.4);
      }
      box(-5.03, 0.84, 1.17, 0.48, 0.2, 0.035, 2309454);
      box(-4.76, 1.21, 1.2, 0.075, 0.15, 0.035, 3427933);
      plaque(-5.03, 2.24, 1.2, 0.6, 0.1, "\u3064\u3081\u305F\u3044", "#f1e9cb", "#46897d", 100);
      const rearBins = [];
      for (let i = 0; i < 2; i++) {
        const bin = new THREE.Group();
        bin.position.set(-4.91, 0.524, -2.69 + i * 0.64);
        bin.rotation.y = -Math.PI / 2;
        bin.name = i ? "left-wall-pet-bin" : "left-wall-can-bin";
        world.add(bin);
        rearBins.push(bin);
        box(0, 0.045, 0, 0.45, 0.09, 0.49, 9085860, true, 0, bin);
        for (const side of [-1, 1]) {
          box(side * 0.211, 0.425, 0, 0.028, 0.69, 0.49, 9085860, true, 0, bin);
          box(0, 0.425, side * 0.231, 0.394, 0.69, 0.028, 9085860, true, 0, bin);
        }
        box(0, 0.095, 0, 0.388, 0.024, 0.423, 3164243, false, 0, bin);
        for (const side of [-1, 1]) {
          box(side * 0.211, 0.777, 0, 0.034, 0.026, 0.49, 5270647, true, 0, bin);
          box(0, 0.777, side * 0.231, 0.394, 0.026, 0.028, 5270647, true, 0, bin);
        }
        box(0, 0.7, 0.253, 0.2, 0.1, 0.018, 2440785, true, 0, bin);
        plaque(0, 0.46, 0.253, 0.27, 0.1, i ? "PET" : "\u7F36", "#8aa3a4", "#e0e9d1", 100, bin);
        const hinge = new THREE.Group();
        hinge.position.set(0, 0.8, -0.27);
        hinge.name = "recycling-bin-lid-hinge";
        bin.add(hinge);
        box(0, 0.03, 0.27, 0.48, 0.1, 0.54, 5270647, true, 0, hinge);
        rod([-0.19, 0, 0], [0.19, 0, 0], 0.025, 3362395, hinge);
        bin.userData.hinge = hinge;
        bin.userData.open = false;
        bin.userData.amount = 0;
        bin.userData.category = i ? "PET" : "CANS";
        const contents = new THREE.Group();
        contents.name = i ? "sorted-pet-bottles" : "sorted-drink-cans";
        bin.add(contents);
        bin.userData.contents = contents;
        for (let j = 0; j < 5; j++) {
          const g = new THREE.Group();
          g.position.set((j % 2 ? 1 : -1) * 0.087, 0.4 + j % 3 * 0.043, -0.11 + Math.floor(j / 2) * 0.1);
          g.rotation.set((j % 3 - 1) * 0.18, 0, (j % 2 ? 1 : -1) * 0.18);
          contents.add(g);
          if (i) {
            const bottle = cyl(0, 0, 0, 0.053, 0.27, isCyberEdition ? 9357011 : 11524307, 12, g);
            bottle.name = "recycled-pet-bottle";
            bottle.material = bottle.material.clone();
            bottle.material.transparent = true;
            bottle.material.opacity = 0.68;
            cyl(0, 0.151, 0, 0.029, 0.034, isCyberEdition ? 12227021 : 9549219, 10, g);
            box(0, -0.015, 0.051, 0.072, 0.062, 5e-3, isCyberEdition ? 10789596 : 15918524, false, 0, g);
          } else {
            const can = cyl(0, 0, 0, 0.06, 0.18, [11910067, isCyberEdition ? 8437707 : 14003591, isCyberEdition ? 11835077 : 10338225][j % 3], 12, g);
            can.name = "recycled-drink-can";
            cyl(0, 0.094, 0, 0.059, 0.012, 12898503, 12, g);
            box(0, 0.102, 0, 0.027, 6e-3, 0.018, 5532021, false, 0, g);
          }
        }
      }
      const umbrellas = [];
      const umbrellaRack = new THREE.Group();
      umbrellaRack.name = "rain-umbrella-rack";
      world.add(umbrellaRack);
      const umbrellaPartsStart = world.children.length;
      for (let x of [-0.01, 0.7]) rod([x, 0.62, 1.62], [x, 1.19, 1.62], 0.023, 5797762);
      for (let y of [0.7, 1.12]) {
        rod([-0.01, y, 1.62], [0.7, y, 1.62], 0.025, 5797762);
        rod([-0.01, y, 1.94], [0.7, y, 1.94], 0.025, 5797762);
      }
      for (let i = 0; i < 4; i++) {
        const umbrellaStart = world.children.length;
        let x = 0.07 + i * 0.16;
        rod([x, 0.67, 1.8], [x, 1.42, 1.8], 0.016, 10395560);
        let points = [];
        for (let j = 0; j <= 12; j++) {
          let a = j / 12 * Math.PI;
          points.push([x + 0.065 * Math.cos(a), 1.42 + 0.065 * Math.sin(a), 1.8]);
        }
        line(points, 12699843);
        let u = new THREE.Mesh(new THREE.ConeGeometry(0.061, 0.61, 8), mat([9219269, 11969716, 13222565, 7573403][i]));
        u.position.set(x, 0.99, 1.8);
        world.add(u);
        const group = new THREE.Group();
        group.name = "individual-rain-umbrella";
        group.userData.index = i;
        group.userData.raised = false;
        world.add(group);
        world.children.slice(umbrellaStart).filter((o) => o !== group).forEach((o) => group.add(o));
        umbrellas.push(group);
      }
      world.children.slice(umbrellaPartsStart).forEach((o) => umbrellaRack.add(o));
      const bike = new THREE.Group();
      world.add(bike);
      bike.position.set(-0.6, 0.524, -4.25);
      bike.rotation.y = 0;
      function wheel(x) {
        const t = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.039, 7, 30), mat(2504776));
        t.position.set(x, 0.47, 0);
        bike.add(t);
        const rim2 = new THREE.Mesh(new THREE.TorusGeometry(0.385, 0.015, 6, 30), mat(10533050));
        rim2.position.copy(t.position);
        bike.add(rim2);
        for (let j = 0; j < 12; j++) {
          let a = j * Math.PI / 6;
          rod([x, 0.47, 0], [x + 0.38 * Math.cos(a), 0.47 + 0.38 * Math.sin(a), 0], 4e-3, 11189695, bike);
        }
      }
      wheel(-0.64);
      wheel(0.69);
      for (let [a, b] of [[[-0.64, 0.47, 0], [-0.13, 0.51, 0]], [[-0.64, 0.47, 0], [-0.3, 1.09, 0]], [[-0.3, 1.09, 0], [-0.13, 0.51, 0]], [[-0.13, 0.51, 0], [0.36, 1.03, 0]], [[0.36, 1.03, 0], [-0.3, 1.09, 0]], [[0.36, 1.03, 0], [0.69, 0.47, 0]]]) rod(a, b, 0.027, 11258297, bike);
      rod([-0.3, 1.09, 0], [-0.33, 1.22, 0], 0.025, 9808553, bike);
      box(-0.35, 1.23, 0, 0.28, 0.07, 0.16, 3095878, true, 0, bike);
      rod([0.36, 1.03, 0], [0.36, 1.37, 0], 0.021, 12305852, bike);
      rod([0.36, 1.37, -0.2], [0.36, 1.37, 0.2], 0.024, 12962238, bike);
      box(0.63, 1.21, 0, 0.38, 0.3, 0.32, 5467769, true, 0, bike);
      for (let i = 0; i < 5; i++) rod([0.45 + i * 0.08, 1.08, 0.165], [0.45 + i * 0.08, 1.37, 0.165], 7e-3, 10268590, bike);
      bike.updateMatrixWorld(true);
      const bikeBounds = new THREE.Box3().setFromObject(bike);
      bike.position.y += 0.524 - bikeBounds.min.y;
      const flowerPots = [];
      const entranceDecor = new THREE.Group();
      entranceDecor.name = "entrance-flowers-and-postbox";
      world.add(entranceDecor);
      function flowerPot(x, z, scale = 1) {
        const g = new THREE.Group();
        g.position.set(x, 0.524, z);
        g.scale.setScalar(scale);
        entranceDecor.add(g);
        flowerPots.push(g);
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.115, 0.25, 12), mat(12157026));
        pot.position.y = 0.125;
        pot.castShadow = true;
        g.add(pot);
        cyl(0, 0.255, 0, 0.166, 0.035, 13145974, 12, g);
        cyl(0, 0.278, 0, 0.139, 0.012, 6773318, 12, g);
        const plantStart = g.children.length;
        const colors = [14724533, 15783868, 12369618];
        for (let i = 0; i < 7; i++) {
          const a = i * 2.399, r = i ? 0.095 : 0, h = 0.43 + i % 3 * 0.055, xx = Math.cos(a) * r, zz = Math.sin(a) * r;
          rod([0, 0.27, 0], [xx, h, zz], 9e-3, 6589301, g);
          for (let side of [-1, 1]) {
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), mat(7510912));
            leaf.position.set(xx + side * 0.035, h - 0.11, zz);
            leaf.scale.set(0.067, 0.014, 0.029);
            leaf.rotation.z = side * 0.4;
            g.add(leaf);
          }
          for (let p = 0; p < 5; p++) {
            let angle = p * Math.PI * 2 / 5;
            const petal = new THREE.Mesh(new THREE.SphereGeometry(0.031, 8, 6), mat(colors[i % 3]));
            petal.position.set(xx + Math.cos(angle) * 0.035, h, zz + Math.sin(angle) * 0.035);
            petal.scale.y = 0.55;
            g.add(petal);
          }
          cyl(xx, h + 6e-3, zz, 0.019, 0.012, 14268783, 8, g);
        }
        const plants = g.children.slice(plantStart), blooms = new THREE.Group();
        blooms.position.y = 0.265;
        g.add(blooms);
        g.updateMatrixWorld(true);
        plants.forEach((o) => blooms.attach(o));
        g.userData.blooms = blooms;
        g.userData.swayAt = -100;
        return g;
      }
      flowerPot(-4.15, -4.35, 1.05);
      flowerPot(-3.4, -4.35, 0.9);
      const sunnyFlowerRack = new THREE.Group();
      sunnyFlowerRack.name = "sunny-entrance-flower-rack";
      sunnyFlowerRack.position.z = -0.77;
      world.add(sunnyFlowerRack);
      box(0.345, 0.773, 1.8, 0.9, 0.055, 0.4, 10587503, true, 0, sunnyFlowerRack);
      box(0.345, 0.566, 1.8, 0.84, 0.035, 0.35, 9207915, true, 0, sunnyFlowerRack);
      for (const x of [-0.055, 0.745]) for (const z of [1.64, 1.96]) box(x, 0.648, z, 0.038, 0.248, 0.038, 7834493, true, 0, sunnyFlowerRack);
      for (let i = 0; i < 3; i++) {
        const pot = flowerPot(0.055 + i * 0.29, 1.8, 0.55);
        pot.position.y = 0.801;
        sunnyFlowerRack.add(pot);
      }
      const postbox = new THREE.Group();
      postbox.position.set(2.315, 0.524, 1.67);
      postbox.name = "red-postbox";
      entranceDecor.add(postbox);
      cyl(0, 0.045, 0, 0.17, 0.09, 7561047, 12, postbox);
      cyl(0, 0.282, 0, 0.066, 0.475, 10376526, 12, postbox);
      cyl(0, 0.74, 0, 0.21, 0.49, 11951186, 16, postbox);
      const postCap = new THREE.Mesh(new THREE.SphereGeometry(0.21, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(13137251));
      postCap.position.y = 0.985;
      postCap.castShadow = true;
      postbox.add(postCap);
      box(0, 0.825, 0.207, 0.255, 0.042, 0.022, 4998468, true, 0, postbox);
      box(0, 0.848, 0.22, 0.28, 0.018, 0.055, 14191216, true, 0, postbox);
      plaque(0, 0.689, 0.215, 0.17, 0.15, "\u3012", "#b65c52", "#fff0d2", 80, postbox);
      plaque(0, 0.555, 0.215, 0.23, 0.075, "POST", "#b65c52", "#f0ddba", 80, postbox);
      const rearWallSign = new THREE.Group();
      rearWallSign.position.set(-3.95, 2.43, -3.89);
      rearWallSign.rotation.y = Math.PI;
      world.add(rearWallSign);
      box(0, 0, 0, 0.37, 0.26, 0.04, 10124898, true, 0, rearWallSign);
      seasonalPlaque(0, 0, 0.026, 0.32, 0.2, "\u96E8\u3084\u3069\u308A", "\u3072\u306A\u305F", "#dfca9e", "#6a8274", 80, rearWallSign);
      const wallPlanter = new THREE.Group();
      wallPlanter.position.set(-3.85, 1.74, -3.98);
      wallPlanter.rotation.y = -Math.PI / 2;
      wallPlanter.scale.z = 2.1;
      entranceDecor.add(wallPlanter);
      box(-0.03, 0, 0, 0.24, 0.19, 0.48, 10125412, true, 0, wallPlanter);
      rod([0.11, 0.25, -0.16], [-0.12, 0.09, -0.16], 0.012, 5271145, wallPlanter);
      rod([0.11, 0.25, 0.16], [-0.12, 0.09, 0.16], 0.012, 5271145, wallPlanter);
      for (let i = 0; i < 9; i++) {
        const z = -0.18 + i * 0.045, leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 9, 6), mat(i % 2 ? 8166262 : 9217415));
        leaf.position.set(-0.1 - i % 3 * 0.026, 0.12 - i % 2 * 0.05, z);
        leaf.scale.set(0.12, 0.07, 0.06);
        wallPlanter.add(leaf);
      }
      const wallVentExterior = new THREE.Group();
      wallVentExterior.name = "left-wall-exterior-air-unit";
      world.add(wallVentExterior);
      const wallVentInterior = new THREE.Group();
      wallVentInterior.name = "left-wall-interior-air-return";
      world.add(wallVentInterior);
      const wallVentSlats = [];
      let wallVentOpen = false, wallVentAmount = 0;
      for (const [group, x, depth] of [[wallVentExterior, -4.66, 0.3], [wallVentInterior, -4.46, 0.07]]) {
        for (const side of [-1, 1]) {
          box(x, 1.97 + side * 0.365, -2.37, depth, 0.05, 1.2, 12633532, true, 0, group);
          box(x, 1.97, -2.37 + side * 0.575, depth, 0.68, 0.05, 12633532, true, 0, group);
        }
      }
      for (let k = 0; k < 5; k++) {
        const blade = box(-4.55, 1.97 + (k - 2) * 0.136, -2.37, 0.016, 0.14, 1.1, 9217189, true, 0, wallVentExterior);
        blade.name = "shared-wall-vent-louver";
        wallVentSlats.push(blade);
      }
      box(-5.05, 1.95, -3.83, 0.8, 1.23, 0.1, 4940910);
      seasonalPlaque(-5.05, 2.17, -3.77, 0.65, 0.53, "\u590F\u306E\u591C", "\u79CB\u306E\u65E5", "#d7c2a0", "#638d8d", 108);
      seasonalPlaque(-5.05, 1.58, -3.77, 0.65, 0.47, "\u8857\u89D2\u4FBF\u308A", "\u79CB\u306E\u4FBF\u308A", "#bab6b1", "#647782", 92);
      for (let item of [[2.17, 0.53, "\u590F\u306E\u591C", "#d7c2a0"], [1.58, 0.47, "\u8857\u89D2\u4FBF\u308A", "#bab6b1"]]) {
        let label2 = seasonalPlaque(-5.05, item[0], -3.891, 0.69, item[1], item[2], item[2] === "\u590F\u306E\u591C" ? "\u79CB\u306E\u65E5" : "\u79CB\u306E\u4FBF\u308A", item[3], "#526d6b", 80);
        label2.rotation.y = Math.PI;
      }
      const crossingBars = [];
      for (let i = 0; i < 7; i++) {
        const bar = box(2.98, 0.278, 3.02 + i * 0.41, 1.16, 0.013, 0.23, 11847366, false);
        bar.name = "painted-crossing-stripe";
        crossingBars.push(bar);
      }
      const roadCenterLine = new THREE.Group();
      roadCenterLine.name = "road-white-center-line";
      world.add(roadCenterLine);
      for (const [a, b] of [[-5.82, 2.35], [3.61, 5.82]]) box((a + b) / 2, 0.281, 4.36, b - a, 0.012, 0.055, 15131086, false, 0, roadCenterLine);
      const drains = [];
      for (let x of [-5.35, -3.1, -0.85, 1.4]) {
        const g = new THREE.Group();
        g.position.set(x, 0, 2.92);
        g.name = "storm-drain";
        world.add(g);
        drains.push(g);
        box(0, 0.291, 0, 0.85, 0.028, 0.19, 1650497, true, 0, g);
        for (let j = 0; j < 9; j++) box(-0.35 + j * 0.087, 0.31, 0, 0.025, 0.012, 0.15, 7508119, false, 0, g);
      }
      const railPartsStart = world.children.length;
      for (let z of [-4.8, -3.6, 0, 1.2]) {
        cyl(4.08, 1.024, z, 0.047, 1, 9942970);
        cyl(4.08, 1.554, z, 0.058, 0.07, 12505287);
      }
      for (let pair of [[-4.8, -3.6], [0, 1.2]]) for (let y of [1.034, 1.394]) rod([4.08, y, pair[0]], [4.08, y, pair[1]], 0.037, 10929347);
      const railParts = world.children.slice(railPartsStart);
      railParts.forEach((o) => o.position.x -= 0.6);
      const polePartsStart = world.children.length;
      cyl(4.14, 3.01, -4.47, 0.13, 5.5, 5464948, 12);
      for (let y of [1, 1.3, 4.7]) cyl(4.14, y, -4.47, 0.145, 0.08, 2637394);
      rod([3.46, 5.35, -4.47], [4.81, 5.35, -4.47], 0.06, 4674660);
      for (let x of [3.57, 3.92, 4.31, 4.67]) cyl(x, 5.48, -4.47, 0.067, 0.19, 11714496, 8);
      for (let j = 0; j < 3; j++) {
        let pts = [];
        for (let i = 0; i <= 32; i++) {
          let t = i / 32;
          pts.push([4.1 - j * 0.28 - (8.9 - j * 0.12) * t, 5.6 - 0.8 * Math.sin(Math.PI * t), -4.47 + 0.11 * j + 0.3 * t]);
        }
        line(pts, 1583936);
      }
      box(4.14, 4.31, -4.47, 0.42, 0.64, 0.37, 8492952);
      for (let i = 0; i < 4; i++) box(4.14, 4.12 + i * 0.12, -4.268, 0.34, 0.022, 0.01, 3953510, false);
      const poleParts = world.children.slice(polePartsStart);
      const utilityPole = new THREE.Group();
      utilityPole.name = "sidewalk-utility-pole";
      world.add(utilityPole);
      world.updateMatrixWorld(true);
      poleParts.forEach((o) => utilityPole.attach(o));
      utilityPole.position.set(-0.87, 0.264, 0);
      const signals = [], pedestrianFaces = [], vehicleFaces = [], signalHeads = [], crossingSignal = new THREE.Group();
      crossingSignal.name = "crosswalk-edge-signal";
      crossingSignal.position.set(3.77, 0.26, 5.55);
      crossingSignal.scale.setScalar(0.74);
      world.add(crossingSignal);
      cyl(0, 1.46, 0, 0.055, 2.92, 5269366, 12, crossingSignal);
      cyl(0, 0.05, 0, 0.12, 0.1, 7901583, 12, crossingSignal);
      rod([0, 2.84, 0], [-0.64, 2.84, 0], 0.04, 5402232, crossingSignal);
      function pedestrianTexture(walking) {
        return texture(256, 256, (c, W, H) => {
          c.fillStyle = "#fff";
          c.strokeStyle = "#fff";
          c.lineWidth = 23;
          c.lineCap = "round";
          c.lineJoin = "round";
          c.beginPath();
          c.arc(128, 48, 21, 0, Math.PI * 2);
          c.fill();
          c.beginPath();
          if (walking) {
            c.moveTo(130, 86);
            c.lineTo(122, 143);
            c.lineTo(81, 205);
            c.moveTo(124, 141);
            c.lineTo(172, 207);
            c.moveTo(128, 91);
            c.lineTo(88, 129);
            c.lineTo(65, 126);
            c.moveTo(128, 97);
            c.lineTo(159, 127);
            c.lineTo(187, 134);
          } else {
            c.moveTo(128, 89);
            c.lineTo(128, 148);
            c.moveTo(107, 100);
            c.lineTo(102, 151);
            c.moveTo(149, 100);
            c.lineTo(154, 151);
            c.moveTo(116, 145);
            c.lineTo(111, 211);
            c.moveTo(140, 145);
            c.lineTo(145, 211);
          }
          c.stroke();
        });
      }
      const pedestrianHead = new THREE.Group();
      pedestrianHead.position.set(-0.64, 2.43, 0);
      crossingSignal.add(pedestrianHead);
      signalHeads.push(pedestrianHead);
      box(0, 0, 0, 0.4, 0.83, 0.24, 3164757, true, 0, pedestrianHead);
      const crossingNamePlate = box(0, -0.56, 0, 0.67, 0.15, 0.26, 3427930, true, 0, pedestrianHead);
      crossingNamePlate.name = "supported-crosswalk-nameplate";
      for (const x of [-0.19, 0.19]) rod([x, -0.405, 0], [x, -0.51, 0], 0.015, 7901583, pedestrianHead);
      for (const side of [1, -1]) {
        const face2 = new THREE.Group();
        face2.rotation.y = side === 1 ? 0 : Math.PI;
        pedestrianHead.add(face2);
        const pair = [];
        for (let i = 0; i < 2; i++) {
          const y = i === 0 ? -0.2 : 0.19;
          const backing = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.32), mat(1650491));
          backing.position.set(0, y, 0.127);
          face2.add(backing);
          const icon = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.27), new THREE.MeshBasicMaterial({ map: pedestrianTexture(i === 0), color: i === 0 ? 8314816 : 15961486, transparent: true, depthWrite: false }));
          icon.position.set(0, y, 0.14);
          icon.name = (i === 0 ? "pedestrian-green" : "pedestrian-red") + (side === 1 ? "" : "-opposite");
          face2.add(icon);
          pair.push(icon);
          box(0, y + 0.175, 0.16, 0.35, 0.035, 0.18, 3427930, true, 0, face2);
        }
        pedestrianFaces.push(pair);
        if (side === 1) signals.push(...pair);
        plaque(0, -0.56, 0.142, 0.62, 0.1, "\u6A2A\u65AD\u6B69\u9053", "#344e5a", "#d9dcc8", 80, face2);
      }
      rod([0, 2.91, 0], [0, 2.91, -1.6], 0.04, 5402232, crossingSignal);
      const vehicleHead = new THREE.Group();
      vehicleHead.position.set(0, 2.91, -1.6);
      vehicleHead.rotation.y = Math.PI / 2;
      crossingSignal.add(vehicleHead);
      signalHeads.push(vehicleHead);
      box(0, 0, 0, 0.87, 0.34, 0.24, 3164757, true, 0, vehicleHead);
      for (const side of [1, -1]) {
        const face2 = new THREE.Group();
        face2.rotation.y = side === 1 ? 0 : Math.PI;
        vehicleHead.add(face2);
        const lamps = [];
        for (let i = 0; i < 3; i++) {
          const x = (i - 1) * 0.265;
          const rim2 = new THREE.Mesh(new THREE.CircleGeometry(0.112, 24), mat(1519160));
          rim2.position.set(x, 0, 0.126);
          face2.add(rim2);
          const lamp2 = new THREE.Mesh(new THREE.CircleGeometry(0.085, 24), new THREE.MeshBasicMaterial({ color: [15961486, 15779961, 8314816][i] }));
          lamp2.position.set(x, 0, 0.139);
          lamp2.name = ["vehicle-red", "vehicle-amber", "vehicle-green"][i] + (side === 1 ? "" : "-opposite");
          face2.add(lamp2);
          lamps.push(lamp2);
          box(x, 0.137, 0.16, 0.245, 0.03, 0.17, 3427930, true, 0, face2);
        }
        vehicleFaces.push(lamps);
      }
      const pawPrints = [];
      function pawTexture(dog2) {
        return texture(128, 128, (c, W, H) => {
          c.clearRect(0, 0, W, H);
          c.fillStyle = "#3d555b";
          c.strokeStyle = "#c4b79b";
          c.lineWidth = 2.5;
          function pad(x, y, rx, ry, a = 0) {
            c.beginPath();
            c.ellipse(x, y, rx, ry, a, 0, Math.PI * 2);
            c.fill();
            c.stroke();
          }
          pad(64, 80, dog2 ? 23 : 24, dog2 ? 23 : 18);
          for (const [x, y, a] of [[29, 55, -0.38], [50, 32, -0.12], [78, 32, 0.12], [99, 55, 0.38]]) {
            pad(x, y, dog2 ? 10 : 11, dog2 ? 15 : 12, a);
            if (dog2) {
              c.beginPath();
              c.moveTo(x - 2, y - 19);
              c.lineTo(x, y - 24);
              c.lineTo(x + 2, y - 19);
              c.stroke();
            }
          }
        });
      }
      for (let trail = 0; trail < 2; trail++) {
        const map = pawTexture(trail === 1);
        for (let i = 0; i < 12; i++) {
          const size = trail === 0 ? 0.18 : 0.23;
          const material = new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
          const paw = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material);
          paw.rotation.x = -Math.PI / 2;
          paw.rotation.z = trail === 0 ? 0 : Math.PI;
          paw.position.set((trail === 0 ? 2.65 : 3.2) + (i % 2 === 0 ? -0.06 : 0.06), 0.278 + trail * 1e-3, trail === 0 ? 5.46 - i * 0.235 : 2.87 + i * 0.235);
          paw.name = trail === 0 ? "cat-crossing-paw" : "dog-crossing-paw";
          paw.userData.delay = 0.2 + i * 0.29 + trail * 0.55;
          paw.visible = false;
          world.add(paw);
          pawPrints.push(paw);
        }
      }
      function animatePawPrints(elapsed, dt) {
        for (const paw of pawPrints) {
          const age = elapsed - paw.userData.delay;
          const alpha = !isDusk && walkGreen && age >= 0 ? Math.min(1, age / 0.18) * Math.max(0, 1 - Math.max(0, age - 1.55) / 2) * 0.82 : 0;
          paw.material.opacity = THREE.MathUtils.damp(paw.material.opacity, alpha, 12, dt);
          paw.visible = paw.material.opacity > 8e-3;
        }
      }
      let signalPhase = "walk", walkGreen = true, signalSince = performance.now() / 1e3, signalManualClicks = 0, queueAligned = true, queueFadeStart = -100;
      function enterSignalPhase(phase, t) {
        signalPhase = phase;
        walkGreen = phase === "walk";
        signalSince = t;
        if (walkGreen) queueAligned = false;
      }
      function setWalkSignal(green, t, manual = false) {
        if (isDusk) return;
        if (manual) signalManualClicks++;
        if (signalPhase === "amber") return;
        enterSignalPhase(green ? "amber" : "drive", t);
      }
      function animateTrafficAndSignal(t, dt) {
        if (isDusk) {
          animateDuskTraffic(t, dt);
          return;
        }
        if (signalPhase === "amber") {
          if (t - signalSince >= 3) enterSignalPhase("walk", t);
        } else if (t - signalSince >= (walkGreen ? 8 : 10)) setWalkSignal(!walkGreen, t);
        const elapsed = t - signalSince;
        animatePawPrints(elapsed, dt);
        if (walkGreen && !queueAligned && elapsed >= 0.22) {
          queueAligned = true;
          queueFadeStart = t;
          trafficMaterials.forEach((m) => m.uniforms.head.value = m.uniforms.speed.value > 0 ? (1.8 + 5.8) / 11.6 : (4.2 + 5.8) / 11.6);
        }
        for (const m of trafficMaterials) {
          const u = m.uniforms;
          u.time.value = t;
          if (walkGreen) {
            if (queueAligned) {
              u.alpha.value = THREE.MathUtils.clamp((t - queueFadeStart) / 0.28, 0, 1);
            } else {
              u.head.value = THREE.MathUtils.euclideanModulo(u.head.value + u.speed.value * dt * 0.3, 1);
              u.alpha.value = Math.max(0, 1 - elapsed / 0.22);
            }
            u.motion.value = THREE.MathUtils.damp(u.motion.value, 0, 12, dt);
          } else {
            u.head.value = THREE.MathUtils.euclideanModulo(u.head.value + u.speed.value * dt, 1);
            u.alpha.value = THREE.MathUtils.damp(u.alpha.value, 1, 12, dt);
            u.motion.value = THREE.MathUtils.damp(u.motion.value, 1, 8, dt);
          }
        }
        const blink = walkGreen && elapsed > 6 && Math.sin(t * 9) < 0;
        for (const pair of pedestrianFaces) {
          pair[0].material.color.setHex(8314816).multiplyScalar(walkGreen ? blink ? 0.22 : 1 : 0.09);
          pair[1].material.color.setHex(15961486).multiplyScalar(walkGreen ? 0.09 : signalPhase === "amber" && Math.sin(elapsed * Math.PI * 4) < 0 ? 0.22 : 1);
        }
        for (const lamps of vehicleFaces) {
          lamps[0].material.color.setHex(15961486).multiplyScalar(signalPhase === "walk" ? 1 : 0.09);
          lamps[1].material.color.setHex(15779961).multiplyScalar(signalPhase === "amber" ? 1 : 0.07);
          lamps[2].material.color.setHex(8314816).multiplyScalar(signalPhase === "drive" ? 1 : 0.09);
        }
      }
      cyl(3.3, 1.434, 1.88, 0.046, 1.82, 10533047);
      const rs = plaque(3.3, 2.204, 1.91, 0.75, 0.26, "\u661F\u6708\u901A\u308A", "#4b8895", "#e7eed5", 85);
      box(3.3, 2.204, 1.9, 0.8, 0.3, 0.036, 4154490);
      rs.position.z = 1.925;
      cyl(-4.87, 2.02, 2.19, 0.065, 3.46, 3953251);
      rod([-4.87, 3.72, 2.19], [-4.2, 3.86, 2.19], 0.054, 5730431);
      box(-4.2, 3.81, 2.19, 0.44, 0.14, 0.3, 3953251);
      box(-4.2, 3.735, 2.19, 0.36, 0.02, 0.24, 16771255, false, 1.6);
      const hemisphere = new THREE.HemisphereLight(15258806, 3748936, 1.12);
      scene.add(hemisphere);
      const shopLights = [];
      const moon = new THREE.DirectionalLight(11910868, 1.12);
      moon.position.set(-3, 10, 5);
      moon.castShadow = true;
      moon.shadow.mapSize.set(2048, 2048);
      moon.shadow.camera.left = -9;
      moon.shadow.camera.right = 9;
      moon.shadow.camera.top = 9;
      moon.shadow.camera.bottom = -9;
      moon.shadow.normalBias = 0.035;
      scene.add(moon);
      for (let [x, y, z, col, pow, dist] of [[-1, 2.35, -1.2, 16758614, 13, 8], [-1, 2.7, 1.4, 16759656, 8, 7], [-4.2, 3.55, 2.19, 16761214, 8, 7], [-5, 1.8, 1.6, 16766370, 3, 4]]) {
        const light = new THREE.PointLight(col, pow, dist, 2);
        light.position.set(x, y, z);
        light.userData.nightPower = pow;
        shopLights.push(light);
        scene.add(light);
      }
      const wetGlows = [], puddles = [];
      function glow(x, z, w, d, color) {
        const t = texture(256, 256, (c, W, H) => {
          let g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
          g.addColorStop(0, color);
          g.addColorStop(0.3, color);
          g.addColorStop(1, "transparent");
          c.fillStyle = g;
          c.fillRect(0, 0, W, H);
        });
        let o = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0.33, depthWrite: false, blending: THREE.AdditiveBlending }));
        o.rotation.x = -Math.PI / 2;
        o.position.set(x, 0.302, z);
        world.add(o);
        wetGlows.push(o);
        return o;
      }
      glow(-1, 3.6, 6.7, 3.6, "#eec18b");
      glow(-4.65, 2.45, 2, 3.5, "#e6b77c");
      glow(2.9, 3.1, 2.4, 3.4, "#bda6aa");
      let seed = 66;
      function rnd() {
        seed = seed * 1664525 + 1013904223 >>> 0;
        return seed / 4294967296;
      }
      for (let i = 0; i < 95; i++) {
        let x = -5.7 + rnd() * 11.4, z = 2.85 + rnd() * 2.8;
        const geo = new THREE.CircleGeometry(0.12 + rnd() * 0.48, 24);
        geo.rotateX(-Math.PI / 2);
        const o = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: i % 3 ? 9155780 : 15714197, transparent: true, opacity: 0.04 + rnd() * 0.1, depthWrite: false }));
        o.position.set(x, 0.29, z);
        o.scale.z = 0.15 + rnd() * 0.23;
        world.add(o);
        puddles.push(o);
      }
      const trafficMaterials = [];
      function lightTrail(x, z, length, width, turn, color, phase, speed) {
        const material = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { head: { value: speed > 0 ? (1.8 + 5.8) / 11.6 : (4.2 + 5.8) / 11.6 }, motion: { value: 0 }, alpha: { value: 1 }, time: { value: 0 }, tint: { value: new THREE.Color(color) }, phase: { value: phase }, speed: { value: speed } }, vertexShader: "varying vec2 uv0;void main(){uv0=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}", fragmentShader: "varying vec2 uv0;uniform float time,phase,speed,head,motion,alpha;uniform vec3 tint;void main(){float d= speed>0.?fract(head-uv0.x+1.):fract(uv0.x-head+1.);float tail=exp(-d*17.)*(1.-smoothstep(.22,.38,d));float y=abs(uv0.y-.5);float halo=exp(-y*y*14.)*.21+exp(-y*y*180.)*.34;float edge=smoothstep(0.,.07,uv0.x)*(1.-smoothstep(.93,1.,uv0.x));float headDist=min(abs(head-uv0.x),1.-abs(head-uv0.x));float headGlow=exp(-pow(headDist/.036,2.)-y*y*22.)*.42;gl_FragColor=vec4(tint*1.6,(tail*halo*.15+headGlow)*edge*alpha);}" });
        let mesh = new THREE.Mesh(new THREE.PlaneGeometry(length, width), material);
        mesh.name = "traffic-light-reflection";
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = turn;
        mesh.position.set(x, 0.325, z);
        world.add(mesh);
        trafficMaterials.push(material);
      }
      for (let pair = 0; pair < 2; pair++) {
        lightTrail(0, 3.72 + (pair - 0.5) * 0.44, 11.6, 1.24, 0, 16768934, 0.16, 0.105);
        lightTrail(0, 5 + (pair - 0.5) * 0.4, 11.6, 1.14, 0, 16747375, 0.7, -0.085);
      }
      const count = 520, rainPos = new Float32Array(count * 6), drops = [];
      for (let i = 0; i < count; i++) drops.push({ x: rnd() * 11.6 - 5.8, y: rnd() * 7 + 0.3, z: rnd() * 11.6 - 5.8, s: 1.7 + rnd() * 1.4 });
      const rainGeo = new THREE.BufferGeometry();
      rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
      const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: 11258844, transparent: true, opacity: 0.22, depthWrite: false }));
      rain.name = "gentle-rain";
      world.add(rain);
      const drips = [];
      for (let i = 0; i < 8; i++) {
        let o = line([[0, 0, 0], [0, -0.13, 0]], 12968926);
        o.material.opacity = 0.47;
        drips.push({ o, x: -4.8 + rnd() * 7.4, y: rnd() * 2.5 });
      }
      const rings = [];
      for (let i = 0; i < 14; i++) {
        const o = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 32), new THREE.MeshBasicMaterial({ color: i % 3 ? 10275286 : 15455403, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false }));
        o.rotation.x = -Math.PI / 2;
        let x = rnd() * 11 - 5.5, z = rnd() * 11 - 5.5;
        let y = x < 3.58 && z < 2.6 ? 0.535 : 0.32;
        o.position.set(x, y, z);
        world.add(o);
        rings.push({ o, phase: rnd(), speed: 0.18 + rnd() * 0.2 });
      }
      const trails = [];
      for (let i = 0; i < 22; i++) {
        let o = line([[0, 0, 0], [5e-3, -0.1, 0], [5e-3, -0.18, 0]], 11589070);
        o.material.opacity = 0.2;
        let x = -4.4 + rnd() * 6.6;
        if (x > -2.15 && x < -0.29) x = -3.2;
        trails.push({ o, x, y: rnd() * 2.1 });
      }
      const exhaustPartsStart = world.children.length;
      box(-2.85, 4.13, -2.62, 1.24, 0.53, 0.83, 9545386);
      box(-2.85, 4.42, -2.62, 1.34, 0.055, 0.92, 5402492);
      for (let j = 0; j < 9; j++) box(-3.34 + j * 0.12, 4.13, -2.193, 0.036, 0.37, 0.012, 3954791, false);
      for (let xx of [-3.14, -2.56]) {
        let vent = new THREE.Mesh(new THREE.CircleGeometry(0.21, 24), mat(3231329));
        vent.rotation.x = -Math.PI / 2;
        vent.position.set(xx, 4.454, -2.62);
        world.add(vent);
        for (let k = 0; k < 5; k++) box(xx, 4.46, -2.79 + k * 0.085, 0.39, 0.012, 0.016, 9151657, false);
      }
      const roofExhaust = new THREE.Group();
      roofExhaust.name = "interactive-rooftop-exhaust";
      world.add(roofExhaust);
      world.children.slice(exhaustPartsStart).filter((o) => o !== roofExhaust).forEach((o) => roofExhaust.add(o));
      rod([-2.23, 3.96, -2.62], [-0.35, 3.96, -2.62], 0.035, 10991283);
      const roofDrain = new THREE.Group();
      roofDrain.name = "continuous-roof-unit-condensate-drain";
      world.add(roofDrain);
      const drainPath = [[-0.35, 3.96, -2.62], [-0.35, 3.96, -4.17], [-0.35, 3.45, -4.17], [-0.35, 3.28, -3.98], [-0.35, 0.61, -3.98], [-0.35, 0.56, -4.1]];
      for (let i = 1; i < drainPath.length; i++) rod(drainPath[i - 1], drainPath[i], 0.035, 10991283, roofDrain);
      for (const p of drainPath.slice(1, -1)) {
        const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), mat(10991283));
        elbow.position.set(...p);
        roofDrain.add(elbow);
      }
      for (const y of [0.95, 2.02, 3]) {
        rod([-0.35, y, -3.88], [-0.35, y, -3.98], 0.018, 6388859, roofDrain);
        box(-0.35, y, -4.02, 0.105, 0.055, 0.023, 7441803, true, 0, roofDrain);
      }
      box(-0.35, 0.537, -4.1, 0.2, 0.025, 0.19, 5006952, true, 0, roofDrain);
      for (let i = 0; i < 4; i++) box(-0.415 + i * 0.043, 0.554, -4.1, 0.018, 9e-3, 0.15, 10136224, false, 0, roofDrain);
      rod([-4.79, 3.6, 0.78], [2.49, 3.6, 0.78], 0.056, 7442328);
      box(-4.71, 2.7, -0.32, 0.13, 0.82, 0.79, 5140858);
      let sideSign = plaque(-4.785, 2.71, -0.32, 0.71, 0.65, "24 H", "#e8e2bf", "#388d80", 95);
      sideSign.rotation.y = -Math.PI / 2;
      let staffTarget = 0, staffAmount = 0, bikeLightOn = false, coffeeUntil = 0, coffeeFull = false, coffeeStarted = -100, coffeeFill = 0, bunLidTarget = 0, bunLidAmount = 0, chimeImpulse = -100;
      const serviceSpill = glow(1.51, -4.75, 1.35, 1.7, "#ffc67f");
      serviceSpill.position.y = 0.54;
      serviceSpill.material.opacity = 0;
      const serviceLight = new THREE.SpotLight(16760953, 0, 3.4, 0.67, 0.85, 1.6);
      serviceLight.position.set(1.51, 2.1, -3.65);
      scene.add(serviceLight);
      const serviceAim = new THREE.Object3D();
      serviceAim.position.set(1.51, 0.53, -4.9);
      scene.add(serviceAim);
      serviceLight.target = serviceAim;
      let drinkState = "empty", drinkStart = 0, selectedCan = 0;
      const interactionTargets = [], interactionRipples = [];
      for (const group of [wallVentExterior, wallVentInterior]) group.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "wallVent";
          interactionTargets.push(o);
        }
      });
      rearBins.forEach((bin) => bin.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "recyclingBin";
          o.userData.bin = bin;
          interactionTargets.push(o);
        }
      }));
      for (const leaf of refrigeratorLeaves) leaf.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "fridge";
          o.userData.fridgeLeaf = leaf;
          interactionTargets.push(o);
        }
      });
      const pickMaterial = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
      function hitBox(action, x, y, z, w, h, d, parent = world) {
        const hit = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), pickMaterial);
        hit.position.set(x, y, z);
        hit.userData.action = action;
        parent.add(hit);
        interactionTargets.push(hit);
        return hit;
      }
      hitBox("staff", 1.51, 1.77, -3.8, 1.08, 2.16, 0.3);
      staffHinge.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "staff";
          interactionTargets.push(o);
        }
      });
      const vendHit = hitBox("vend", -5.03, 1.69, 1.23, 0.68, 1.06, 0.16);
      const takeHit = hitBox("take", -5.03, 0.85, 1.24, 0.53, 0.29, 0.18);
      const coffeeHit = hitBox("coffee", 1.54, 1.82, -0.7, 0.63, 0.78, 0.69);
      hitBox("bao", 1.96, 1.725, -2.33, 0.37, 0.23, 0.39);
      bunLid.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "bao";
          interactionTargets.push(o);
        }
      });
      const bikeHit = hitBox("bike", 0, 0.81, 0, 2.15, 1.6, 0.62, bike);
      const drink = cyl(-5.03, 0.84, 1.218, 0.057, 0.2, 15187320, 12);
      drink.rotation.z = Math.PI / 2;
      drink.visible = false;
      drink.material = drink.material.clone();
      const drinkBand = box(0, 0, 0, 0.09, 0.052, 0.119, 16774619, false, 0, drink);
      drink.traverse((o) => {
        if (o.material) {
          o.material = o.material.clone();
          o.material.transparent = true;
          o.material.opacity = 0;
          o.material.depthWrite = false;
        }
      });
      function drinkOpacity(value) {
        drink.traverse((o) => {
          if (o.material) o.material.opacity = value;
        });
      }
      box(-5.03, 0.736, 1.232, 0.54, 0.025, 0.18, 5797248);
      box(-5.03, 0.952, 1.232, 0.54, 0.023, 0.18, 5797248);
      for (let x of [-5.3, -4.76]) box(x, 0.844, 1.232, 0.025, 0.19, 0.18, 5797248);
      const selectionLights = [];
      for (let i = 0; i < 4; i++) {
        let o = box(-5.23 + i * 0.135, 1.235, 1.258, 0.079, 0.026, 0.019, 16767102, false, 0.6);
        o.material = o.material.clone();
        selectionLights.push(o);
      }
      const vaporTexture = texture(64, 64, (c, W, H) => {
        let g = c.createRadialGradient(W / 2, H / 2, 1, W / 2, H / 2, W / 2);
        g.addColorStop(0, "rgba(255,240,211,.55)");
        g.addColorStop(0.4, "rgba(255,240,211,.26)");
        g.addColorStop(1, "rgba(255,240,211,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      const steam = [];
      for (let i = 0; i < 16; i++) {
        let o = new THREE.Sprite(new THREE.SpriteMaterial({ map: vaporTexture, transparent: true, opacity: 0, depthWrite: false }));
        o.position.set(1.54, 1.7, -0.57);
        world.add(o);
        steam.push(o);
      }
      const odenSteam = [];
      for (let i = 0; i < 7; i++) {
        const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: vaporTexture, transparent: true, opacity: 0.08, depthWrite: false }));
        world.add(p);
        odenSteam.push(p);
      }
      const coffeeSurface = new THREE.Mesh(new THREE.CircleGeometry(0.043, 16), mat(16774360));
      coffeeSurface.rotation.x = -Math.PI / 2;
      coffeeSurface.position.set(1.54, 1.589, -0.57);
      coffeeSurface.visible = false;
      world.add(coffeeSurface);
      const coffeeStream = cyl(1.54, 1.727, -0.57, 6e-3, 0.144, 16774360, 8);
      coffeeStream.visible = false;
      const bunSteam = [];
      for (let i = 0; i < 3; i++) {
        const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: vaporTexture, transparent: true, opacity: 0, depthWrite: false }));
        world.add(p);
        bunSteam.push(p);
      }
      const lamp = cyl(0.76, 1.14, 0, 0.055, 0.13, 4675938, 12, bike);
      lamp.rotation.z = Math.PI / 2;
      const lampLens = new THREE.Mesh(new THREE.CircleGeometry(0.046, 16), new THREE.MeshBasicMaterial({ color: 11184524 }));
      lampLens.rotation.y = Math.PI / 2;
      lampLens.position.set(0.831, 1.14, 0);
      bike.add(lampLens);
      const bikeSpot = new THREE.SpotLight(16766618, 0, 4, 0.44, 0.9, 1.6);
      bikeSpot.position.set(0.84, 1.14, 0);
      bike.add(bikeSpot);
      const bikeAim = new THREE.Object3D();
      bikeAim.position.set(3.4, -0.02, 0);
      bike.add(bikeAim);
      bikeSpot.target = bikeAim;
      const bikeReflection = glow(0.7, -4.4, 1.9, 0.6, "#ffd7a0");
      bikeReflection.position.y = 0.54;
      bikeReflection.visible = false;
      const chime = new THREE.Group();
      chime.position.set(-3.78, 2.88, 1.69);
      world.add(chime);
      rod([0, 0, 0], [0, -0.19, 0], 8e-3, 13026469, chime);
      const bell = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshToonMaterial({ color: 10275259, gradientMap: gradient, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
      bell.position.y = -0.32;
      chime.add(bell);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.01, 6, 28), mat(13744257));
      rim.rotation.x = Math.PI / 2;
      rim.position.y = -0.32;
      chime.add(rim);
      rod([0, -0.22, 0], [0, -0.55, 0], 5e-3, 13946028, chime);
      box(0, -0.645, 0, 0.084, 0.205, 0.012, 15783341, true, 0, chime);
      const chimeSun = new THREE.Group();
      chimeSun.name = "wind-chime-sun";
      chime.add(chimeSun);
      for (const side of [1, -1]) {
        const sun = new THREE.Mesh(new THREE.CircleGeometry(0.023, 24), new THREE.MeshBasicMaterial({ color: 12029524 }));
        sun.position.set(0, -0.68, side * 9e-3);
        if (side < 0) sun.rotation.y = Math.PI;
        chimeSun.add(sun);
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4;
          line([[Math.cos(a) * 0.031, -0.68 + Math.sin(a) * 0.031, side * 0.01], [Math.cos(a) * 0.044, -0.68 + Math.sin(a) * 0.044, side * 0.01]], 12029524, 1, chimeSun);
        }
      }
      chimeSun.scale.setScalar(0.63);
      chimeSun.position.y = -0.645 + 0.68 * 0.63;
      const chimeRain = new THREE.Group();
      chimeRain.name = "wind-chime-raindrop";
      chime.add(chimeRain);
      {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.032);
        shape.bezierCurveTo(-8e-3, 0.013, -0.025, -2e-3, -0.023, -0.017);
        shape.bezierCurveTo(-0.02, -0.042, 0.02, -0.042, 0.023, -0.017);
        shape.bezierCurveTo(0.025, -2e-3, 8e-3, 0.013, 0, 0.032);
        for (const side of [1, -1]) {
          const drop = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: 7051422 }));
          drop.position.set(0, -0.64, side * 8e-3);
          if (side < 0) drop.rotation.y = Math.PI;
          chimeRain.add(drop);
        }
      }
      hitBox("chime", 0, -0.4, 0, 0.5, 0.88, 0.44, chime);
      let rainBedGain = null, rainSwellGain = null, nextBird = 0, cityBedGain = null, carAudioGain = null, musicGain = null, nextMusicNote = 0, musicStep = 0, musicNoteCount = 0, carPassCount = 0, lastTrafficAudioOpen = null, lastTrafficAudioSunny = null;
      const activePasses = /* @__PURE__ */ new Set();
      let audioContext = null, audioMaster = null, audioAnalyser = null, audioMuted = false, nextCar = 0, nextRainTap = 0, rainTapCount = 0;
      let soundEvents = 0;
      const soundCounts = {};
      let ambientNoise = null;
      function audioNoise(ctx) {
        const n = ctx.sampleRate * 16, buffer = ctx.createBuffer(2, n, ctx.sampleRate);
        let seed2 = 7199;
        for (let ch = 0; ch < 2; ch++) {
          let data = buffer.getChannelData(ch);
          for (let i = 0; i < n; i++) {
            seed2 ^= seed2 << 13;
            seed2 ^= seed2 >>> 17;
            seed2 ^= seed2 << 5;
            data[i] = ((seed2 >>> 0) / 4294967296 * 2 - 1) * (0.86 + 0.14 * Math.sin(i / ctx.sampleRate * 2.1 + ch));
          }
        }
        return buffer;
      }
      function ensureAudio() {
        try {
          if (!audioContext) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            audioContext = new Ctx();
            audioMaster = audioContext.createGain();
            audioMaster.gain.value = 1e-4;
            const limiter = audioContext.createDynamicsCompressor();
            limiter.threshold.value = -13;
            limiter.knee.value = 15;
            limiter.ratio.value = 5;
            limiter.attack.value = 0.015;
            limiter.release.value = 0.3;
            audioAnalyser = audioContext.createAnalyser();
            audioAnalyser.fftSize = 2048;
            audioMaster.connect(limiter);
            limiter.connect(audioAnalyser);
            audioAnalyser.connect(audioContext.destination);
            ambientNoise = audioNoise(audioContext);
            const rain2 = audioContext.createBufferSource();
            rain2.buffer = ambientNoise;
            rain2.loop = true;
            const high = audioContext.createBiquadFilter();
            high.type = "highpass";
            high.frequency.value = 1e3;
            const low = audioContext.createBiquadFilter();
            low.type = "lowpass";
            low.frequency.value = 3800;
            const rainGain = audioContext.createGain();
            rainBedGain = rainGain;
            rainGain.gain.value = isSunny ? 1e-4 : 0.018;
            rain2.connect(high);
            high.connect(low);
            low.connect(rainGain);
            rainGain.connect(audioMaster);
            rain2.start();
            const city = audioContext.createBufferSource();
            city.buffer = ambientNoise;
            city.loop = true;
            city.playbackRate.value = 0.71;
            const cityFilter = audioContext.createBiquadFilter();
            cityFilter.type = "lowpass";
            cityFilter.frequency.value = 390;
            const cityGain = audioContext.createGain();
            cityBedGain = cityGain;
            cityGain.gain.value = signalPhase === "walk" ? 1e-4 : isSunny ? 4e-3 : 0.07;
            city.connect(cityFilter);
            cityFilter.connect(cityGain);
            cityGain.connect(audioMaster);
            city.start();
            const swell = audioContext.createOscillator();
            swell.frequency.value = 0.073;
            const swellGain = audioContext.createGain();
            rainSwellGain = swellGain;
            swellGain.gain.value = isSunny ? 0 : 3e-3;
            swell.connect(swellGain);
            swellGain.connect(rainGain.gain);
            swell.start();
            carAudioGain = audioContext.createGain();
            carAudioGain.gain.value = signalPhase === "walk" ? 0 : 1;
            carAudioGain.connect(audioMaster);
            initDayMusic();
            audioMaster.gain.exponentialRampToValueAtTime(0.7, audioContext.currentTime + 0.15);
            nextCar = audioContext.currentTime + 0.6;
            nextRainTap = audioContext.currentTime + 0.3;
          }
          if (audioContext.state === "suspended" && !document.hidden && window.streetCurrentScene === "snow") audioContext.resume().catch(() => {
          });
        } catch (_) {
        }
      }
      function tone(freq, start, duration, volume = 0.08, kind = "sine") {
        if (!audioContext) return;
        const o = audioContext.createOscillator(), g = audioContext.createGain();
        o.type = kind;
        o.frequency.value = freq;
        g.gain.setValueAtTime(1e-4, start);
        g.gain.exponentialRampToValueAtTime(volume, start + 0.012);
        g.gain.exponentialRampToValueAtTime(1e-4, start + duration);
        o.connect(g);
        g.connect(audioMaster);
        o.start(start);
        o.stop(start + duration + 0.03);
        o.onended = () => {
          o.disconnect();
          g.disconnect();
        };
      }
      function noiseTick(start, duration, volume, frequency) {
        if (!audioContext) return;
        const n = audioContext.createBufferSource(), filter = audioContext.createBiquadFilter(), g = audioContext.createGain();
        n.buffer = ambientNoise;
        filter.type = "bandpass";
        filter.frequency.value = frequency;
        filter.Q.value = 0.8;
        g.gain.setValueAtTime(1e-4, start);
        g.gain.exponentialRampToValueAtTime(volume, start + 8e-3);
        g.gain.exponentialRampToValueAtTime(1e-4, start + duration);
        n.connect(filter);
        filter.connect(g);
        g.connect(audioMaster);
        n.start(start, 3, duration + 0.03);
        n.onended = () => {
          n.disconnect();
          filter.disconnect();
          g.disconnect();
        };
      }
      function meow(start) {
        const ctx = audioContext, voice = ctx.createOscillator(), gain = ctx.createGain(), vibrato = ctx.createOscillator(), depth = ctx.createGain();
        const real = new Float32Array(10), imag = new Float32Array([0, 1, 0.48, 0.26, 0.14, 0.075, 0.04, 0.02, 0.01, 5e-3]);
        voice.setPeriodicWave(ctx.createPeriodicWave(real, imag));
        voice.frequency.setValueAtTime(460, start);
        voice.frequency.exponentialRampToValueAtTime(720, start + 0.11);
        voice.frequency.exponentialRampToValueAtTime(650, start + 0.3);
        voice.frequency.exponentialRampToValueAtTime(430, start + 0.58);
        voice.frequency.exponentialRampToValueAtTime(350, start + 0.76);
        vibrato.frequency.value = 7.1;
        depth.gain.value = 8;
        vibrato.connect(depth);
        depth.connect(voice.frequency);
        gain.gain.setValueAtTime(1e-4, start);
        gain.gain.exponentialRampToValueAtTime(0.13, start + 0.055);
        gain.gain.exponentialRampToValueAtTime(0.105, start + 0.33);
        gain.gain.exponentialRampToValueAtTime(1e-4, start + 0.79);
        gain.connect(audioMaster);
        const filters = [];
        for (let [freq, end, level, q] of [[800, 510, 0.7, 1.7], [1550, 960, 0.33, 2.8], [2700, 1750, 0.1, 3]]) {
          let f = ctx.createBiquadFilter(), g = ctx.createGain();
          f.type = "bandpass";
          f.Q.value = q;
          f.frequency.setValueAtTime(freq, start);
          f.frequency.exponentialRampToValueAtTime(end, start + 0.7);
          g.gain.value = level;
          voice.connect(f);
          f.connect(g);
          g.connect(gain);
          filters.push(f, g);
        }
        voice.start(start);
        vibrato.start(start);
        voice.stop(start + 0.82);
        vibrato.stop(start + 0.82);
        voice.onended = () => {
          voice.disconnect();
          vibrato.disconnect();
          depth.disconnect();
          filters.forEach((n) => n.disconnect());
          gain.disconnect();
        };
      }
      function dogWhimper(start) {
        const ctx = audioContext;
        for (const [offset, length, base, peak, level] of [[0, 0.43, 335, 495, 0.095], [0.51, 0.57, 310, 440, 0.075]]) {
          const at = start + offset, voice = ctx.createOscillator(), vibrato = ctx.createOscillator(), depth = ctx.createGain(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
          voice.setPeriodicWave(ctx.createPeriodicWave(new Float32Array(6), new Float32Array([0, 1, 0.3, 0.14, 0.055, 0.018])));
          voice.frequency.setValueAtTime(base, at);
          voice.frequency.exponentialRampToValueAtTime(peak, at + length * 0.32);
          voice.frequency.exponentialRampToValueAtTime(base * 0.82, at + length);
          vibrato.frequency.value = 8.5;
          depth.gain.value = 6;
          vibrato.connect(depth);
          depth.connect(voice.frequency);
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(1450, at);
          filter.frequency.exponentialRampToValueAtTime(820, at + length);
          filter.Q.value = 0.85;
          gain.gain.setValueAtTime(1e-4, at);
          gain.gain.exponentialRampToValueAtTime(level, at + 0.055);
          gain.gain.exponentialRampToValueAtTime(level * 0.65, at + length * 0.55);
          gain.gain.exponentialRampToValueAtTime(1e-4, at + length);
          voice.connect(filter);
          filter.connect(gain);
          gain.connect(audioMaster);
          voice.start(at);
          vibrato.start(at);
          voice.stop(at + length + 0.025);
          vibrato.stop(at + length + 0.025);
          voice.onended = () => {
            voice.disconnect();
            vibrato.disconnect();
            depth.disconnect();
            filter.disconnect();
            gain.disconnect();
          };
        }
      }
      function bodyImpact(start, duration, volume) {
        if (!audioContext) return;
        const o = audioContext.createOscillator(), g = audioContext.createGain();
        o.frequency.setValueAtTime(118, start);
        o.frequency.exponentialRampToValueAtTime(49, start + duration);
        g.gain.setValueAtTime(1e-4, start);
        g.gain.exponentialRampToValueAtTime(volume, start + 9e-3);
        g.gain.exponentialRampToValueAtTime(1e-4, start + duration);
        o.connect(g);
        g.connect(audioMaster);
        o.start(start);
        o.stop(start + duration + 0.025);
        o.onended = () => {
          o.disconnect();
          g.disconnect();
        };
      }
      function carHorn(t) {
        const ctx = audioContext, env = ctx.createGain(), filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1250;
        filter.Q.value = 0.45;
        env.gain.setValueAtTime(1e-4, t);
        env.gain.linearRampToValueAtTime(0.105, t + 0.018);
        env.gain.setValueAtTime(0.095, t + 0.22);
        env.gain.exponentialRampToValueAtTime(1e-4, t + 0.34);
        env.connect(filter);
        filter.connect(audioMaster);
        const wave = ctx.createPeriodicWave(new Float32Array(5), new Float32Array([0, 1, 0.27, 0.08, 0.025]));
        let remaining = 2;
        for (const f of [400, 500]) {
          const o = ctx.createOscillator();
          o.setPeriodicWave(wave);
          o.frequency.value = f;
          o.connect(env);
          o.start(t);
          o.stop(t + 0.36);
          o.onended = () => {
            o.disconnect();
            if (--remaining === 0) {
              env.disconnect();
              filter.disconnect();
            }
          };
        }
      }
      function playSound(kind, opening) {
        if (!audioContext) return;
        soundEvents++;
        soundCounts[kind] = (soundCounts[kind] || 0) + 1;
        const t = audioContext.currentTime + 0.012;
        if (kind === "horn") carHorn(t);
        else if (kind === "meow") meow(t);
        else if (kind === "dog") dogWhimper(t);
        else if (kind === "pigeon") playPigeonSound(t);
        else if (kind === "wallVent") {
          noiseTick(t, 0.055, 0.065, 2100);
          noiseTick(t + 0.035, 0.38, 0.045, opening ? 900 : 720);
          noiseTick(t + 0.32, 0.045, 0.055, 1600);
          tone(opening ? 310 : 260, t + 0.05, 0.26, 0.012, "triangle");
        } else if (kind === "drone" && typeof playCyberDroneSound === "function") playCyberDroneSound(t);
        else if (kind === "door") {
          tone(784, t, 0.65, 0.105);
          tone(1568, t, 0.35, 0.018);
          tone(622.25, t + 0.22, 0.9, 0.09);
          tone(1244.5, t + 0.22, 0.5, 0.015);
        } else if (kind === "chime") {
          [1760, 2817, 3917, 5165].forEach((f, i) => tone(f, t + i * 0.023, 1.7 - i * 0.22, 0.065 / (1 + i * 0.8)));
          tone(2112, t + 0.32, 1.15, 0.025);
        } else if (kind === "vend") {
          tone(880, t, 0.12, 0.055);
          tone(1174.66, t + 0.12, 0.18, 0.045);
          noiseTick(t + 0.18, 0.22, 0.11, 280);
          tone(132, t + 0.2, 0.19, 0.04);
        } else if (kind === "take" || kind === "switch") noiseTick(t, 0.09, 0.055, kind === "take" ? 1200 : 2600);
        else if (kind === "coffee") noiseTick(t, 1.3, 0.07, 2200);
        else if (kind === "cookpot") {
          if (opening === "blocked") {
            noiseTick(t, 0.045, 0.085, 1400);
            tone(610, t, 0.11, 0.025);
            noiseTick(t + 0.07, 0.035, 0.06, 1100);
          } else if (opening) {
            noiseTick(t, 0.075, 0.1, 950);
            tone(720, t + 0.012, 0.24, 0.04);
            tone(1150, t + 0.016, 0.13, 0.014);
            noiseTick(t + 0.075, 0.23, 0.035, 2400);
          } else {
            noiseTick(t, 0.055, 0.13, 850);
            tone(540, t + 0.01, 0.17, 0.045);
            tone(890, t + 0.014, 0.11, 0.015);
          }
        } else if (kind === "umbrella") {
          noiseTick(t, opening ? 0.24 : 0.18, 0.105, opening ? 1700 : 1300);
          noiseTick(t + 0.07, 0.05, 0.07, 700);
          if (!opening) {
            noiseTick(t + 0.17, 0.04, 0.09, 1100);
            tone(390, t + 0.17, 0.1, 0.022);
          }
        } else if (kind === "bao") {
          noiseTick(t, 0.14, 0.095, opening ? 850 : 650);
          noiseTick(t + 0.08, 0.06, 0.065, 1200);
          if (opening) noiseTick(t + 0.11, 0.34, 0.045, 3100);
          else tone(270, t + 0.08, 0.12, 0.028);
        } else if (kind === "carDoor") {
          if (opening) {
            noiseTick(t, 0.035, 0.33, 2100);
            noiseTick(t + 0.055, 0.065, 0.27, 720);
            noiseTick(t + 0.09, 0.16, 0.18, 220);
            bodyImpact(t + 0.06, 0.15, 0.075);
          } else {
            noiseTick(t, 0.055, 0.37, 1200);
            noiseTick(t + 0.018, 0.24, 0.32, 190);
            bodyImpact(t + 0.02, 0.25, 0.17);
            noiseTick(t + 0.09, 0.035, 0.16, 1900);
          }
        } else if (kind === "postbox") {
          noiseTick(t, 0.03, 0.31, 2350);
          noiseTick(t + 0.09, 0.045, 0.27, 940);
          noiseTick(t + 0.14, 0.14, 0.19, 310);
          [431, 709, 1127, 1693].forEach((f, i) => tone(f, t + 0.09, 0.23 - i * 0.04, 0.024 / (i + 1)));
        } else if (kind === "leaves") noiseTick(t, 0.25, 0.035, 1800);
        else if (kind === "takeout") {
          tone(880, t, 0.19, 0.05);
          tone(1174.66, t + 0.13, 0.24, 0.04);
          noiseTick(t + 0.12, 0.3, 0.04, 900);
        } else if (kind === "puddle") {
          tone(340, t, 0.12, 0.027);
          noiseTick(t, 0.18, 0.035, 1300);
        }
      }
      function rainTap(start) {
        const ctx = audioContext, n = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), g = ctx.createGain(), pan = ctx.createStereoPanner();
        n.buffer = ambientNoise;
        filter.type = "bandpass";
        filter.frequency.value = 1300 + Math.random() * 1e3;
        filter.Q.value = 0.55;
        const duration = 0.065 + Math.random() * 0.06;
        g.gain.setValueAtTime(1e-4, start);
        g.gain.exponentialRampToValueAtTime(0.035 + Math.random() * 0.025, start + 4e-3);
        g.gain.exponentialRampToValueAtTime(1e-4, start + duration);
        pan.pan.value = Math.random() * 1.4 - 0.7;
        n.connect(filter);
        filter.connect(g);
        g.connect(pan);
        pan.connect(audioMaster);
        n.start(start, Math.random() * 10, duration + 0.02);
        n.onended = () => {
          n.disconnect();
          filter.disconnect();
          g.disconnect();
          pan.disconnect();
        };
        rainTapCount++;
      }
      function passCar(t) {
        if (!carAudioGain || signalPhase !== "drive" && !isDusk) return;
        carPassCount++;
        const n = audioContext.createBufferSource(), filter = audioContext.createBiquadFilter(), g = audioContext.createGain(), pan = audioContext.createStereoPanner();
        n.buffer = ambientNoise;
        n.playbackRate.value = 0.82;
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(260, t);
        filter.frequency.exponentialRampToValueAtTime(1250, t + 4.2);
        filter.frequency.exponentialRampToValueAtTime(240, t + 9.2);
        g.gain.setValueAtTime(1e-4, t);
        g.gain.exponentialRampToValueAtTime(0.095, t + 4.2);
        g.gain.exponentialRampToValueAtTime(1e-4, t + 9.2);
        const direction = Math.sin(t * 7) > 0 ? 1 : -1;
        pan.pan.setValueAtTime(-0.85 * direction, t);
        pan.pan.linearRampToValueAtTime(0.85 * direction, t + 9.2);
        n.connect(filter);
        filter.connect(g);
        g.connect(pan);
        pan.connect(carAudioGain);
        activePasses.add(n);
        n.start(t, 1, 8);
        n.onended = () => {
          activePasses.delete(n);
          n.disconnect();
          filter.disconnect();
          g.disconnect();
          pan.disconnect();
        };
      }
      document.addEventListener("visibilitychange", () => {
        if (!audioContext) return;
        if (document.hidden) audioContext.suspend().catch(() => {
        });
        else if (window.streetCurrentScene === "snow") audioContext.resume().catch(() => {
        });
      });
      addEventListener("keydown", (e) => {
        if (window.streetCurrentScene === "snow" && e.code === "KeyM" && !e.repeat && audioContext) {
          audioMuted = !audioMuted;
          audioMaster.gain.cancelScheduledValues(audioContext.currentTime);
          audioMaster.gain.setTargetAtTime(audioMuted ? 1e-4 : 0.7, audioContext.currentTime, 0.08);
        }
      });
      const cat = new THREE.Group();
      cat.position.set(-2.87, 0.526, 1.4);
      cat.rotation.y = -0.12;
      world.add(cat);
      let catReact = -100, lastMeow = -100;
      function catBall(x, y, z, sx, sy, sz, color, parent = cat) {
        const o = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mat(color));
        o.position.set(x, y, z);
        o.scale.set(sx, sy, sz);
        o.castShadow = true;
        parent.add(o);
        return o;
      }
      catBall(0, 0.25, -0.03, 0.22, 0.255, 0.19, 14261088);
      catBall(0, 0.22, 0.098, 0.142, 0.195, 0.103, 15916988);
      const catHead = new THREE.Group();
      catHead.position.set(0, 0.54, 0.025);
      cat.add(catHead);
      catBall(0, 0, 0, 0.205, 0.183, 0.17, 14789230, catHead);
      for (let x of [-0.135, 0.135]) {
        let ear = new THREE.Mesh(new THREE.ConeGeometry(0.088, 0.17, 3), mat(13800538));
        ear.position.set(x, 0.169, -0.015);
        ear.rotation.y = x < 0 ? -0.16 : 0.16;
        catHead.add(ear);
        const shape = new THREE.Shape();
        shape.moveTo(-0.04, -0.035);
        shape.lineTo(0, 0.065);
        shape.lineTo(0.04, -0.035);
        shape.closePath();
        let pink = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat(14197402));
        pink.position.set(x, 0.178, 0.032);
        catHead.add(pink);
      }
      const catEyes = [];
      for (let x of [-0.079, 0.079]) {
        catBall(x, -0.015, 0.149, 0.028, 0.037, 0.019, 3359545, catHead);
        const eye = catBall(x, -0.015, 0.165, 0.012, 0.028, 6e-3, 1386547, catHead);
        catEyes.push(eye);
        catBall(x - 6e-3, -5e-3, 0.171, 6e-3, 7e-3, 3e-3, 16774358, catHead);
      }
      for (let x of [-0.053, 0.053]) catBall(x, -0.078, 0.143, 0.071, 0.048, 0.047, 16115144, catHead);
      catBall(0, -0.057, 0.187, 0.022, 0.014, 0.014, 12746876, catHead);
      line([[0, -0.07, 0.185], [0, -0.092, 0.185], [-0.022, -0.106, 0.179]], 7757394, 1, catHead);
      line([[0, -0.092, 0.185], [0.022, -0.106, 0.179]], 7757394, 1, catHead);
      for (let side of [-1, 1]) for (let j = 0; j < 3; j++) line([[side * 0.095, -0.07 - j * 0.013, 0.169], [side * 0.255, -0.06 - j * 0.028, 0.15]], 12891036, 1, catHead);
      for (let x of [-0.055, 0, 0.055]) {
        let stripe = catBall(x, 0.11, 0.124, 0.017, 0.055, 9e-3, 12089668, catHead);
        stripe.rotation.z = x * 5;
      }
      catBall(-0.115, 0.071, 0.14, 0.075, 0.07, 0.11, 16049093);
      const catPaw = catBall(0.115, 0.071, 0.14, 0.075, 0.07, 0.11, 16049093);
      const catTail = new THREE.Group();
      catTail.position.set(-0.17, 0.14, -0.06);
      cat.add(catTail);
      const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.18, -0.06, -0.13), new THREE.Vector3(-0.28, -0.075, 0.06), new THREE.Vector3(-0.2, -0.07, 0.25), new THREE.Vector3(-0.05, -0.06, 0.25)]);
      const tail = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.046, 8, false), mat(13142864));
      catTail.add(tail);
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.136, 0.014, 8, 24), mat(7576981));
      collar.rotation.x = Math.PI / 2;
      collar.position.set(0, 0.42, 0.027);
      cat.add(collar);
      catBall(0, 0.407, 0.169, 0.026, 0.028, 0.02, 15123324);
      hitBox("cat", 0, 0.39, 0.02, 0.73, 0.88, 0.65, cat);
      function animateSoundAndCat(t) {
        if (weatherMode === "rain" && audioContext && audioContext.state === "running" && audioContext.currentTime > nextRainTap) {
          rainTap(audioContext.currentTime + 0.01);
          nextRainTap = audioContext.currentTime + 0.65 + Math.random() * 1.25;
        }
        if (audioContext && audioContext.state === "running" && (signalPhase === "drive" || isDusk) && audioContext.currentTime > nextCar) {
          passCar(audioContext.currentTime + 0.02);
          nextCar = audioContext.currentTime + (isDusk ? 22 : 10) + Math.random() * (isDusk ? 10 : 4);
        }
        const age = t - catReact, active = age >= 0 && age < 2.7;
        const envelope = active ? Math.sin(Math.PI * age / 2.7) : 0;
        catHead.rotation.y = envelope * Math.sin(age * 3) * 0.32;
        catHead.rotation.z = -envelope * 0.11;
        catHead.rotation.x = -envelope * 0.14;
        catPaw.position.y = 0.071 + envelope * Math.max(0, Math.sin(age * 3.1)) * 0.11;
        catPaw.rotation.x = -envelope * 0.3;
        catTail.rotation.y = (active ? 0.23 : 0.025) * Math.sin(active ? age * 7 : t * 0.8);
        cat.scale.y = 1 + Math.sin(t * 2.1) * 6e-3;
        let blink = t % 6.7 > 6.48 || active && age > 0.35 && age < 0.58;
        catEyes.forEach((o) => o.scale.y = blink ? 4e-3 : 0.028);
      }
      const rippleGeometry = new THREE.RingGeometry(0.92, 1, 40);
      function splash(point, t) {
        if (interactionRipples.length >= 8) {
          const old = interactionRipples.shift();
          old.meshes.forEach((o) => {
            world.remove(o);
            o.material.dispose();
          });
        }
        const meshes = [];
        for (let i = 0; i < 4; i++) {
          let o = new THREE.Mesh(rippleGeometry, new THREE.MeshBasicMaterial({ color: 16769453, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
          o.rotation.x = -Math.PI / 2;
          o.position.set(point.x, 0.34, point.z);
          world.add(o);
          meshes.push(o);
        }
        interactionRipples.push({ meshes, start: t });
      }
      function pickScene(e) {
        const r = { left: 0, top: 0, width: window.sceneViewport.width, height: window.sceneViewport.height };
        doorRay.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera);
        const effective = (o) => {
          let p = o;
          while (p) {
            if (!p.visible) return false;
            p = p.parent;
          }
          return true;
        };
        const candidates = [...interactionTargets.filter(effective), doorHit], seen = new Set(candidates);
        scene.traverse((o) => {
          if (!o.isMesh || seen.has(o) || o.material.visible === false) return;
          let p = o;
          while (p) {
            if (!p.visible) return;
            p = p.parent;
          }
          const m = o.material;
          if (m.transparent || m.blending === THREE.AdditiveBlending) return;
          candidates.push(o);
        });
        const hits = doorRay.intersectObjects(candidates, false);
        if (!hits.length) return null;
        let hit = hits[0];
        const outsidePickup = camera.position.z < -3.8;
        if (outsidePickup && takeoutAmount < 0.8 && (hit.object === pickupHit || hit.object.material === glass || hit.object.userData.action === "cookpot")) {
          hit = __spreadProps(__spreadValues({}, hit), { object: pickupHit });
        } else if (takeoutAmount >= 0.8 && (hit.object === pickupHit || hit.object.material === glass)) {
          const potHit = hits.find((h) => h.object.userData.action === "cookpot");
          if (potHit) hit = potHit;
        }
        if (hit.object.userData.action) return hit;
        if (hit.object === street && !isSunny) {
          hit.object.userData.action = "puddle";
          return hit;
        }
        return null;
      }
      function actOnScene(e) {
        const hit = pickScene(e);
        if (!hit) return;
        const t = performance.now() / 1e3, action = hit.object.userData.action;
        vy = vp = 0;
        if (action === "fogSmile") {
          fogSmileAt = t;
        } else if (action === "wallVent") {
          wallVentOpen = !wallVentOpen;
          playSound("wallVent", wallVentOpen);
        } else if (action === "recyclingBin") {
          const bin = hit.object.userData.bin;
          bin.userData.open = !bin.userData.open;
        } else if (action === "clockMode") {
          setClockMode(!clockIs12);
          playSound("switch");
        } else if (action === "fridge") {
          const leaf = hit.object.userData.fridgeLeaf;
          leaf.userData.open = !leaf.userData.open;
          playSound("switch");
        } else if (action === "front") {
          doorTarget = doorTarget ? 0 : 1;
          if (doorTarget) playSound("door");
          else playSound("switch");
        } else if (action === "staff") {
          staffTarget = staffTarget ? 0 : 1;
          if (staffTarget) playSound("door");
          else playSound("switch");
        } else if (action === "vend" && drinkState === "empty") {
          selectedCan = THREE.MathUtils.clamp(Math.round((hit.point.x + 5.23) / 0.135), 0, 3);
          drink.material.color.setHex(vendingPalette()[selectedCan]);
          drinkStart = t;
          drinkState = "appearing";
          drinkOpacity(0);
          drink.position.set(-5.03, 0.84, 1.218);
          drink.rotation.z = Math.PI / 2;
          drink.visible = true;
          playSound("vend");
        } else if (action === "take" && drinkState === "ready") {
          drinkState = "disappearing";
          drinkStart = t;
          playSound("take");
        } else if (action === "coffee") {
          if (coffeeFull) {
            coffeeFull = false;
            coffeeUntil = 0;
            playSound("take");
          } else {
            coffeeStarted = t;
            coffeeFull = true;
            coffeeUntil = t + 5;
            playSound("coffee");
          }
        } else if (action === "bao") {
          bunLidTarget = bunLidTarget ? 0 : 1;
          playSound("bao", bunLidTarget === 1);
        } else if (action === "bike") {
          bikeLightOn = !bikeLightOn;
          bikeSpot.intensity = bikeLightOn ? 4.8 : 0;
          lampLens.material.color.setHex(bikeLightOn ? 16770218 : 11184524);
          bikeReflection.visible = bikeLightOn && !isSunny;
          playSound("switch");
        } else if (action === "chime") {
          chimeImpulse = t;
          playSound("chime");
        } else if (action === "puddle" && !isSunny) {
          splash(hit.point, t);
          playSound("puddle");
        } else if (action === "pigeon") {
          if (t - pigeonReact > 1.1) playSound("pigeon");
          pigeonReact = t;
        } else if (action === "carLights") toggleCarLights();
        else if (action === "carDoor") {
          carDoorTarget = carDoorTarget ? 0 : 1;
          playSound("carDoor", carDoorTarget === 1);
        } else if (action === "postbox") {
          letterTarget = letterTarget ? 0 : 1;
          playSound("postbox");
        } else if (action === "letter") openSceneLetter();
        else if (action === "pedestrianSignal") {
          setWalkSignal(!walkGreen, t, true);
          playSound("switch");
        } else if (action === "flower") {
          hit.object.userData.flower.userData.swayAt = t;
        } else if (action === "cookpot") {
          if ((takeoutTarget || windowPending) && takeoutVariant === "note") {
            cookJiggleAt = t;
            cookLidTarget = 0;
            playSound("cookpot", "blocked");
          } else {
            cookLidTarget = cookLidTarget ? 0 : 1;
            playSound("cookpot", cookLidTarget === 1);
          }
        } else if (action === "umbrella") {
          const u = hit.object.userData.umbrella, raise = !u.userData.raised;
          umbrellas.forEach((other) => other.userData.raised = raise && other === u);
          playSound("umbrella", raise);
        } else if (action === "pinwheel") {
          hit.object.userData.pinwheel.userData.boostAt = t;
        } else if (action === "exhaust") {
          smokeBurstAt = t;
        } else if (action === "dog") {
          if (t - dogCuriosity > 0.9) playSound("dog");
          dogCuriosity = t;
        } else if (action === "takeout") {
          requestPickup(t);
        } else if (action === "cat") {
          catReact = t;
          if (t - lastMeow > 0.9) {
            playSound("meow");
            lastMeow = t;
          }
        }
      }
      function animateInteractions(t, dt) {
        wallVentAmount = THREE.MathUtils.damp(wallVentAmount, wallVentOpen ? 1 : 0, 6, dt);
        wallVentSlats.forEach((blade) => blade.rotation.z = wallVentAmount * Math.PI * 5 / 12);
        rearBins.forEach((bin) => {
          bin.userData.amount = THREE.MathUtils.damp(bin.userData.amount, bin.userData.open ? 1 : 0, 7, dt);
          bin.userData.hinge.rotation.x = -bin.userData.amount * Math.PI / 3;
        });
        for (const leaf of refrigeratorLeaves) {
          leaf.userData.amount = THREE.MathUtils.damp(leaf.userData.amount, leaf.userData.open ? 1 : 0, 6, dt);
          leaf.rotation.y = -leaf.userData.amount * Math.PI / 6;
        }
        letterAmount = THREE.MathUtils.damp(letterAmount, letterTarget, 7, dt);
        mailEnvelope.visible = letterAmount > 0.03;
        mailEnvelope.position.z = 0.22 + letterAmount * 0.12;
        mailEnvelope.rotation.z = -letterAmount * 0.055;
        mailEnvelope.traverse((o) => {
          if (o.material && o.material !== pickMaterial) o.material.opacity = letterAmount;
        });
        if (drinkState === "appearing") {
          const p = THREE.MathUtils.clamp((t - drinkStart) / 0.4, 0, 1);
          drinkOpacity(p * p * (3 - 2 * p));
          if (p === 1) drinkState = "ready";
        } else if (drinkState === "disappearing") {
          const p = THREE.MathUtils.clamp((t - drinkStart) / 0.325, 0, 1);
          drinkOpacity(1 - p * p * (3 - 2 * p));
          if (p === 1) {
            drink.visible = false;
            drinkState = "empty";
          }
        }
        flowerPots.forEach((p) => {
          const a2 = t - p.userData.swayAt, e = a2 >= 0 && a2 < 4 ? Math.exp(-a2 * 0.9) : 0;
          p.userData.blooms.rotation.z = Math.sin(a2 * 9) * e * 0.16;
          p.userData.blooms.rotation.x = Math.sin(a2 * 7) * e * 0.08;
        });
        if (windowPending && cookLidAmount < 0.025) {
          takeoutVariant = windowPending.variant;
          windowPending = null;
          takeoutTarget = 1;
          noteShownAt = -1;
          cookLidTarget = takeoutVariant === "bento" ? 1 : 0;
        }
        takeoutAmount = THREE.MathUtils.damp(takeoutAmount, takeoutTarget, 4.5, dt);
        takeoutPanes[0].rotation.y = takeoutAmount * 1.31;
        takeoutPanes[1].rotation.y = -takeoutAmount * 1.31;
        const serve = THREE.MathUtils.smoothstep(takeoutAmount, 0.2, 1);
        bento.visible = takeoutVariant === "bento" && serve > 0.01;
        if (takeoutVariant === "note" && takeoutAmount > 0.85 && noteShownAt < 0) noteShownAt = t;
        const noteAlpha = takeoutVariant === "note" && takeoutTarget ? serve * (noteShownAt < 0 ? 1 : THREE.MathUtils.clamp(1 - (t - noteShownAt - 1) / 0.65, 0, 1)) : 0;
        preparingNote.visible = noteAlpha > 8e-3;
        preparingNote.material.opacity = noteAlpha;
        bento.position.z = -3.63 - serve * 0.57;
        bento.position.y = 1.508 + Math.sin(serve * Math.PI) * 0.025;
        bento.traverse((o) => {
          if (o.material) o.material.opacity = serve;
        });
        coffeeFill = coffeeFull ? THREE.MathUtils.clamp((t - coffeeStarted) / 1.2, 0, 1) : 0;
        coffeeSurface.visible = coffeeFill > 0.02;
        coffeeSurface.position.y = 1.589 + coffeeFill * 0.058;
        coffeeStream.visible = coffeeFull && coffeeFill < 1;
        bunLidAmount = THREE.MathUtils.damp(bunLidAmount, bunLidTarget, 6, dt);
        bunLid.rotation.x = -bunLidAmount * Math.PI * 0.44;
        bunsGroup.visible = bunLidAmount > 0.15;
        bunSteam.forEach((p, i) => {
          const age = (t * 0.4 + i / 3) % 1;
          p.position.set(1.96 + Math.sin(age * 5 + i) * 0.025, 1.73 + age * 0.4, -2.33);
          p.scale.setScalar(0.06 + age * 0.13);
          p.material.opacity = Math.sin(age * Math.PI) * 0.18 * bunLidAmount;
        });
        carDoorAmount = THREE.MathUtils.damp(carDoorAmount, carDoorTarget, 6, dt);
        driverHinge.rotation.y = -carDoorAmount * Math.PI * 34 / 180;
        odenSteam.forEach((p, i) => {
          const age = (t * 0.28 + i / odenSteam.length) % 1;
          p.position.set(1.05 + i % 3 * 0.27 + Math.sin(age * 6 + i) * 0.023, 1.73 + age * 0.34, -2.3 + Math.sin(i * 3) * 0.09);
          p.scale.setScalar(0.055 + age * 0.12);
          p.material.opacity = Math.sin(age * Math.PI) * 0.13;
        });
        staffAmount = THREE.MathUtils.damp(staffAmount, staffTarget, 6, dt);
        staffHinge.rotation.y = staffAmount * Math.PI * 95 / 180;
        serviceSpill.material.opacity = staffAmount * 0.36;
        serviceLight.intensity = staffAmount * 3.4;
        selectionLights.forEach((o, i) => {
          o.material.emissiveIntensity = drinkState !== "empty" && i === selectedCan ? 1.15 + Math.sin(t * 8) * 0.3 : 0.25;
        });
        steam.forEach((o, i) => {
          let age = (t * 0.62 + i / steam.length) % 1;
          o.position.set(1.54 + Math.sin(age * 7 + i) * 0.035, 1.68 + age * 0.65, -0.57 + Math.cos(age * 5 + i) * 0.025);
          o.scale.setScalar(0.065 + age * 0.21);
          o.material.rotation = Math.sin(t + i) * 0.3;
          o.material.opacity = coffeeFill > 0.3 && coffeeUntil > t ? Math.sin(age * Math.PI) * 0.37 * Math.min(1, coffeeUntil - t) : 0;
        });
        const a = t - chimeImpulse;
        chime.rotation.z = Math.sin(t * 1.8) * 0.018 + (a < 8 ? Math.sin(a * 9) * 0.34 * Math.exp(-a * 0.55) : 0);
        chime.rotation.x = Math.sin(t * 1.4) * 0.012;
        for (let i = interactionRipples.length - 1; i >= 0; i--) {
          const effect = interactionRipples[i], age = t - effect.start;
          effect.meshes.forEach((o, j) => {
            let p = (age - j * 0.17) / 1.5;
            o.visible = !isSunny && p > 0 && p < 1;
            if (o.visible) {
              o.scale.setScalar(0.025 + p * 0.65);
              o.material.opacity = (1 - p) * 0.43;
            }
          });
          if (age > 2.1) {
            effect.meshes.forEach((o) => {
              world.remove(o);
              o.material.dispose();
            });
            interactionRipples.splice(i, 1);
          }
        }
      }
      box(4.91, 0.71, -5.73, 2.1, 0.88, 0.16, 9016207);
      box(4.91, 1.18, -5.73, 2.14, 0.07, 0.2, 11383976);
      for (let x of [4.07, 5.75]) box(x, 0.77, -5.638, 0.11, 0.075, 0.014, 14333817, false, 0.08);
      const culdesacSign = new THREE.Group();
      culdesacSign.name = "wall-mounted-culdesac-sign";
      culdesacSign.position.set(4.91, 1.45, -5.73);
      world.add(culdesacSign);
      for (const x of [-0.42, 0.42]) rod([x, -0.27, 0], [x, -0.07, 0], 0.024, 8492431, culdesacSign);
      box(0, 0, 0, 1.32, 0.32, 0.065, 4679285, true, 0, culdesacSign);
      plaque(0, 0, 0.038, 1.2, 0.24, "\u884C\u304D\u6B62\u307E\u308A", "#476675", "#f4e4bd", 80, culdesacSign);
      const welcomeSign = plaque(0, 0, -0.038, 1.2, 0.24, "\u3088\u3046\u3053\u305D", "#476675", "#e6dfbe", 80, culdesacSign);
      welcomeSign.rotation.y = Math.PI;
      box(4.74, 0.32, -4.63, 1.1, 0.12, 0.16, 10198413);
      const parkingBay = new THREE.Group();
      parkingBay.name = "culdesac-parking-bay";
      world.add(parkingBay);
      for (let x of [3.93, 5.77]) box(x, 0.278, -2.275, 0.032, 0.014, 5.55, 9544093, false, 0, parkingBay);
      for (let z of [-5.05, 0.5]) box(4.85, 0.278, z, 1.84, 0.014, 0.032, 9544093, false, 0, parkingBay);
      const parkingMark = plaque(4.85, 0.289, 0.05, 0.54, 0.54, "P", "#304a5b", "#b4c8be", 160, parkingBay);
      parkingMark.rotation.x = -Math.PI / 2;
      const wallCredits = new THREE.Group();
      wallCredits.name = "rear-wall-credits";
      world.add(wallCredits);
      for (let [y, h, text] of [[0.88, 0.23, "wfcsilence"], [0.57, 0.19, "2026\xB710"]]) {
        const p = plaque(4.91, y, -5.818, 1.77, h, text, "rgba(0,0,0,0)", "#f0e5c9", 80, wallCredits);
        p.rotation.y = Math.PI;
        p.material.transparent = true;
        p.material.depthWrite = false;
        p.material.opacity = 0.8;
        const old = p.material.map;
        p.material.map = texture(1024, Math.round(1024 * h / 1.77), (c, W, H) => {
          c.fillStyle = "#d5cebe";
          c.textAlign = "center";
          c.textBaseline = "middle";
          let px = H * 0.76;
          c.font = (text === "wfcsilence" ? "italic 500 " : "500 ") + px + 'px Georgia, "Palatino Linotype", "Times New Roman", serif';
          const width = c.measureText(text).width;
          if (width > W * 0.86) c.font = (text === "wfcsilence" ? "italic 500 " : "500 ") + px * W * 0.86 / width + "px Georgia, serif";
          c.fillText(text, W / 2, H / 2);
        });
        old.dispose();
        p.userData.font = "Georgia serif";
      }
      const parkedCar = new THREE.Group();
      parkedCar.position.set(4.74, 0.26, -2.82);
      parkedCar.scale.set(1.23, 1.42, 1.56);
      parkedCar.name = "parked-compact-car";
      world.add(parkedCar);
      const carWindows = [];
      const paint = 12965061;
      let carLightsOn = false, carDoorTarget = 0, carDoorAmount = 0;
      box(0, 0.31, 0, 1.13, 0.13, 2.58, 5466224, true, 0, parkedCar);
      box(0, 0.515, 1.015, 1.13, 0.29, 0.55, paint, true, 0, parkedCar);
      box(0, 0.665, 1.015, 1.1, 0.06, 0.55, 13753547, true, 0, parkedCar);
      box(0, 0.49, -0.74, 1.13, 0.32, 1.1, paint, true, 0, parkedCar);
      box(-0.52, 0.51, 0.255, 0.09, 0.34, 0.91, paint, true, 0, parkedCar);
      box(0, 0.295, 0.07, 1.16, 0.11, 2.51, 5992051, true, 0, parkedCar);
      function carQuad(points, color, parent = parkedCar, basic = false) {
        let geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute([].concat.apply([], points), 3));
        geo.setIndex([0, 1, 2, 0, 2, 3]);
        geo.computeVertexNormals();
        let material = basic ? new THREE.MeshBasicMaterial({ color: 9157585, side: THREE.DoubleSide, transparent: true, opacity: 0.32, depthWrite: false }) : new THREE.MeshToonMaterial({ color, gradientMap: gradient, side: THREE.DoubleSide });
        let m = new THREE.Mesh(geo, material);
        m.castShadow = !basic;
        if (basic) {
          m.name = "transparent-car-glass";
          carWindows.push(m);
        }
        parent.add(m);
        m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), ink));
        return m;
      }
      function carFrame(outer, inner, color, parent = parkedCar) {
        for (let i = 0; i < 4; i++) {
          const j = (i + 1) % 4;
          carQuad([outer[i], outer[j], inner[j], inner[i]], color, parent);
        }
      }
      const profile = [[-1.16, 0.73], [-0.78, 1.15], [0.35, 1.15], [0.77, 0.73]];
      carFrame([[-0.505, 0.73, 0.77], [-0.505, 1.15, 0.35], [-0.505, 1.15, -0.17], [-0.505, 0.73, -0.17]], [[-0.505, 0.79, 0.61], [-0.505, 1.095, 0.29], [-0.505, 1.095, -0.12], [-0.505, 0.79, -0.12]], paint);
      for (let side of [-1, 1]) carFrame([[side * 0.505, 0.73, -1.16], [side * 0.505, 1.15, -0.78], [side * 0.505, 1.15, -0.17], [side * 0.505, 0.73, -0.17]], [[side * 0.505, 0.79, -1.02], [side * 0.505, 1.095, -0.74], [side * 0.505, 1.095, -0.18], [side * 0.505, 0.79, -0.18]], paint);
      for (let i = 1; i < 2; i++) {
        const [z1, y1] = profile[i], [z2, y2] = profile[i + 1];
        carQuad([[-0.505, y1, z1], [0.505, y1, z1], [0.505, y2, z2], [-0.505, y2, z2]], i === 1 ? 14081998 : paint);
      }
      const windshield = carQuad([[-0.447, 0.785, 0.731], [0.447, 0.785, 0.731], [0.447, 1.111, 0.405], [-0.447, 1.111, 0.405]], 5406618, parkedCar, true);
      windshield.name = "one-piece-blue-windshield";
      const rearWindshield = carQuad([[-0.435, 0.785, -1.1243], [-0.435, 1.111, -0.8293], [0.435, 1.111, -0.8293], [0.435, 0.785, -1.1243]], 4615036, parkedCar, true);
      rearWindshield.name = "one-piece-rear-windshield";
      carFrame([[-0.505, 0.73, 0.77], [0.505, 0.73, 0.77], [0.505, 1.15, 0.35], [-0.505, 1.15, 0.35]], [[-0.447, 0.785, 0.731], [0.447, 0.785, 0.731], [0.447, 1.111, 0.405], [-0.447, 1.111, 0.405]], paint);
      carFrame([[-0.505, 0.73, -1.16], [-0.505, 1.15, -0.78], [0.505, 1.15, -0.78], [0.505, 0.73, -1.16]], [[-0.435, 0.785, -1.1243], [-0.435, 1.111, -0.8293], [0.435, 1.111, -0.8293], [0.435, 0.785, -1.1243]], paint);
      carQuad([[-0.514, 0.79, 0.61], [-0.514, 1.095, 0.29], [-0.514, 1.095, -0.12], [-0.514, 0.79, -0.12]], 4615036, parkedCar, true);
      for (let side of [-1, 1]) {
        const x = side * 0.514;
        carQuad([[x, 0.79, -0.18], [x, 1.095, -0.18], [x, 1.095, -0.74], [x, 0.79, -1.02]], 4615036, parkedCar, true);
        box(x, 0.696, -0.7, 0.014, 0.013, 0.9, 7441289, false, 0, parkedCar);
      }
      for (let x of [-0.25, 0.25]) {
        box(x, 0.46, 0.02, 0.35, 0.15, 0.37, 4545637, true, 0, parkedCar);
        const back = box(x, 0.72, -0.19, 0.35, 0.47, 0.11, 4216672, true, 0, parkedCar);
        back.rotation.x = -0.1;
        box(x, 0.99, -0.2, 0.2, 0.14, 0.1, 4545637, true, 0, parkedCar);
      }
      box(0, 0.6, -0.7, 0.82, 0.15, 0.36, 4545637, true, 0, parkedCar);
      box(0, 0.74, -0.93, 0.82, 0.2, 0.1, 4216672, true, 0, parkedCar);
      box(0, 0.76, 0.55, 0.87, 0.12, 0.22, 3822429, true, 0, parkedCar);
      const steering = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.014, 7, 20), mat(2572106));
      steering.position.set(0.25, 0.8, 0.39);
      steering.rotation.x = -0.3;
      parkedCar.add(steering);
      const driverHinge = new THREE.Group();
      driverHinge.position.set(0.525, 0, 0.7);
      parkedCar.add(driverHinge);
      box(0, 0.565, -0.43, 0.042, 0.39, 0.86, paint, true, 0, driverHinge);
      carFrame([[0, 0.745, 0], [0, 1.15, -0.35], [0, 1.15, -0.86], [0, 0.745, -0.86]], [[0, 0.79, -0.09], [0, 1.095, -0.41], [0, 1.095, -0.82], [0, 0.79, -0.82]], paint, driverHinge);
      carQuad([[0.024, 0.79, -0.09], [0.024, 1.095, -0.41], [0.024, 1.095, -0.82], [0.024, 0.79, -0.82]], 4615036, driverHinge, true);
      box(0.033, 0.735, -0.75, 0.026, 0.035, 0.13, 6387579, true, 0, driverHinge);
      box(-0.032, 0.64, -0.43, 0.018, 0.16, 0.68, 5138027, true, 0, driverHinge);
      box(0.073, 0.831, -0.21, 0.19, 0.11, 0.2, paint, true, 0, driverHinge);
      box(0.085, 0.836, -0.314, 0.13, 0.065, 8e-3, 7902876, false, 0, driverHinge);
      box(-0.598, 0.831, 0.49, 0.19, 0.11, 0.2, paint, true, 0, parkedCar);
      box(-0.61, 0.836, 0.386, 0.13, 0.065, 8e-3, 7902876, false, 0, parkedCar);
      const carLenses = [], carRearLenses = [];
      for (let side of [-1, 1]) {
        for (let z of [-0.85, 0.86]) {
          const tire = new THREE.Mesh(new THREE.TorusGeometry(0.178, 0.036, 9, 28), mat(2505284));
          tire.rotation.y = Math.PI / 2;
          tire.position.set(side * 0.535, 0.215, z);
          tire.castShadow = true;
          parkedCar.add(tire);
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.131, 0.131, 0.035, 16), mat(10202797));
          hub.rotation.z = Math.PI / 2;
          hub.position.set(side * 0.558, 0.215, z);
          parkedCar.add(hub);
          for (let j = 0; j < 5; j++) {
            let a = j * Math.PI * 2 / 5;
            rod([side * 0.58, 0.215, z], [side * 0.58, 0.215 + Math.cos(a) * 0.105, z + Math.sin(a) * 0.105], 8e-3, 6124672, parkedCar);
          }
        }
        const lens = box(side * 0.405, 0.586, 1.299, 0.255, 0.115, 0.03, 14933434, true, 0, parkedCar);
        lens.material = new THREE.MeshBasicMaterial({ color: 12303527 });
        carLenses.push(lens);
        box(side * 0.473, 0.575, 1.316, 0.05, 0.075, 0.012, 13871981, false, 0, parkedCar);
        const rear = box(side * 0.455, 0.558, -1.303, 0.16, 0.16, 0.026, 10380641, true, 0, parkedCar);
        rear.material = new THREE.MeshBasicMaterial({ color: 9131348 });
        carRearLenses.push(rear);
      }
      box(0, 0.495, 1.306, 0.47, 0.1, 0.025, 3690328, true, 0, parkedCar);
      for (let y of [0.47, 0.5, 0.53]) box(0, y, 1.324, 0.43, 0.01, 8e-3, 9084316, false, 0, parkedCar);
      plaque(0, 0.366, 1.335, 0.33, 0.137, "06\xB728", "#e5ce87", "#40565b", 75, parkedCar);
      const rearPlate = plaque(0, 0.426, -1.325, 0.33, 0.137, "06\xB728", "#e5ce87", "#40565b", 75, parkedCar);
      rearPlate.rotation.y = Math.PI;
      box(0, 1.18, -0.23, 1.03, 0.035, 1.12, 13753802, true, 0, parkedCar);
      parkedCar.updateMatrixWorld(true);
      const carBounds = new THREE.Box3().setFromObject(parkedCar);
      parkedCar.position.y += 0.26 - carBounds.min.y;
      parkedCar.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "carLights";
          interactionTargets.push(o);
        }
      });
      driverHinge.traverse((o) => {
        if (o.isMesh) o.userData.action = "carDoor";
      });
      hitBox("carDoor", 0.028, 0.745, -0.43, 0.12, 0.83, 0.91, driverHinge);
      const carSpots = [], carReflections = [];
      for (let side of [-1, 1]) {
        const spot = new THREE.SpotLight(16769453, 0, 5.6, 0.35, 0.92, 1.5);
        spot.position.set(side * 0.405, 0.586, 1.34);
        parkedCar.add(spot);
        const aim = new THREE.Object3D();
        aim.position.set(side * 0.6, -0.07, 4.2);
        parkedCar.add(aim);
        spot.target = aim;
        carSpots.push(spot);
        const reflection = glow(4.74 + side * 0.5, 0.55, 0.8, 2.7, "#ffe1ad");
        reflection.position.y = 0.335;
        reflection.visible = false;
        carReflections.push(reflection);
      }
      function toggleCarLights() {
        carLightsOn = !carLightsOn;
        carLenses.forEach((o) => o.material.color.setHex(carLightsOn ? 16773833 : 12303527));
        carRearLenses.forEach((o) => o.material.color.setHex(carLightsOn ? 14908778 : 9131348));
        carSpots.forEach((o) => o.intensity = carLightsOn ? 4 : 0);
        carReflections.forEach((o) => o.visible = carLightsOn && !isSunny);
        playSound("horn");
      }
      const takeoutGroup = new THREE.Group();
      takeoutGroup.name = "rear-takeout-window";
      world.add(takeoutGroup);
      for (let x of [-2.925, -1.875]) box(x, 1.88, -3.8, 0.055, 0.99, 0.21, 5600879, true, 0, takeoutGroup);
      for (let y of [1.41, 2.35]) box(-2.4, y, -3.8, 1.1, 0.055, 0.21, 5600879, true, 0, takeoutGroup);
      box(-2.4, 1.415, -4.03, 1.14, 0.08, 0.7, 10718571, true, 0, takeoutGroup);
      box(-2.4, 1.461, -4.03, 1.16, 0.018, 0.72, 14930862, true, 0, takeoutGroup);
      const takeoutPanes = [];
      for (let i = 0; i < 2; i++) {
        const g = new THREE.Group(), offset = i ? -0.25 : 0.25;
        g.position.set(i ? -1.895 : -2.905, 0, -3.947);
        g.name = "outward-casement-window";
        takeoutGroup.add(g);
        pane(offset, 1.91, 0, 0.465, 0.76, 0, g);
        for (const x of [-0.235, 0.235]) box(offset + x, 1.91, 0, 0.026, 0.79, 0.045, 6719356, true, 0, g);
        for (const y of [1.515, 2.305]) box(offset, y, 0, 0.49, 0.025, 0.045, 6719356, true, 0, g);
        box(offset + (i ? -0.19 : 0.19), 1.8, -0.03, 0.022, 0.16, 0.033, 14272417, true, 0, g);
        for (const y of [1.58, 2.23]) cyl(0, y, 0, 0.022, 0.085, 10991011, 10, g);
        takeoutPanes.push(g);
      }
      const pickupSign = plaque(-2.4, 2.96, -3.93, 1.18, 0.14, "\u304A\u5F01\u5F53 \u304A\u6E21\u3057\u53E3", "#58796d", "#f6e6be", 80, takeoutGroup);
      pickupSign.rotation.y = Math.PI;
      const rearAwning = new THREE.Group();
      rearAwning.position.set(-2.4, 2.62, -4.18);
      rearAwning.rotation.x = -0.1;
      takeoutGroup.add(rearAwning);
      box(0, 0, 0, 1.68, 0.06, 0.77, 6586227, true, 0, rearAwning);
      for (let i = 0; i < 10; i++) {
        const color = i % 2 ? 14143659 : 7837578;
        box(-0.756 + i * 0.168, 0.038, 0, 0.165, 0.012, 0.75, color, false, 0, rearAwning);
        box(-0.756 + i * 0.168, -0.06, -0.389, 0.165, 0.13, 0.025, color, false, 0, rearAwning);
      }
      box(-2.4, 2.53, -4.12, 1.12, 0.025, 0.14, 16766106, false, 0.5, takeoutGroup);
      for (let x of [-3.08, -1.72]) rod([x, 2.33, -3.9], [x, 2.52, -4.45], 0.018, 7112059, takeoutGroup);
      const bento = new THREE.Group();
      bento.name = "takeout-bento";
      bento.position.set(-2.4, 1.508, -3.63);
      world.add(bento);
      bento.visible = false;
      box(0, 0, 0, 0.4, 0.055, 0.28, 5462350, true, 0, bento);
      box(0, 0.031, 0, 0.375, 0.015, 0.256, 13021836, false, 0, bento);
      box(-0.092, 0.05, 0, 0.17, 0.035, 0.226, 15786429, false, 0, bento);
      box(0.087, 0.052, -0.064, 0.15, 0.043, 0.09, 14193008, false, 0, bento);
      for (let i = 0; i < 3; i++) {
        let rice = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), mat(16773328));
        rice.scale.set(1.4, 0.4, 0.8);
        rice.position.set(-0.136 + i * 0.044, 0.071, -0.052 + i * 0.05);
        bento.add(rice);
        box(0.04 + i * 0.036, 0.057, 0.04, 0.03, 0.045, 0.08, 15058030, false, 0, bento);
      }
      const plum = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), mat(11887448));
      plum.position.set(-0.09, 0.073, 0.01);
      bento.add(plum);
      for (let i = 0; i < 3; i++) {
        const veg = new THREE.Mesh(new THREE.SphereGeometry(0.023, 9, 6), mat(8034160));
        veg.position.set(0.137 - i * 0.017, 0.058, 0.08 + i * 0.012);
        bento.add(veg);
      }
      bento.traverse((o) => {
        if (o.material) {
          o.material = o.material.clone();
          o.material.transparent = true;
          o.material.opacity = 0;
          o.material.depthWrite = false;
        }
      });
      let takeoutTarget = 0, takeoutAmount = 0, takeoutClicks = 0, windowPending = null, noteShownAt = -1, cookJiggleAt = -100;
      function requestPickup(t) {
        takeoutClicks++;
        cookLidTarget = 0;
        noteShownAt = -1;
        if (takeoutTarget || windowPending) {
          takeoutTarget = 0;
          windowPending = null;
          playSound("take");
          return;
        }
        takeoutVariant = Math.random() < 0.55 ? "bento" : "note";
        windowPending = { variant: takeoutVariant };
        playSound("takeout");
      }
      hitBox("postbox", 0, 0.65, 0, 0.51, 1.25, 0.56, postbox);
      postbox.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "postbox";
          if (!interactionTargets.includes(o)) interactionTargets.push(o);
        }
      });
      const mailEnvelope = new THREE.Group();
      mailEnvelope.name = "postbox-letter";
      mailEnvelope.position.set(0, 0.84, 0.22);
      postbox.add(mailEnvelope);
      mailEnvelope.visible = false;
      box(0, 0, 0, 0.255, 0.16, 0.012, 15787209, true, 0, mailEnvelope);
      line([[-0.122, 0.073, 9e-3], [0, -0.011, 9e-3], [0.122, 0.073, 9e-3]], 10722439, 1, mailEnvelope);
      line([[-0.122, -0.071, 9e-3], [-0.048, -0.021, 9e-3]], 11643028, 1, mailEnvelope);
      line([[0.122, -0.071, 9e-3], [0.048, -0.021, 9e-3]], 11643028, 1, mailEnvelope);
      const mailSeal = new THREE.Mesh(new THREE.CircleGeometry(0.013, 16), mat(12088675));
      mailSeal.position.set(0, -0.011, 0.011);
      mailEnvelope.add(mailSeal);
      box(0.087, 0.038, 0.01, 0.036, 0.044, 4e-3, 10401966, false, 0, mailEnvelope);
      for (let i = 0; i < 2; i++) box(-0.05, -0.04 - i * 0.018, 0.011, 0.075, 3e-3, 2e-3, 10918528, false, 0, mailEnvelope);
      mailEnvelope.traverse((o) => {
        if (o.material) {
          o.material = o.material.clone();
          o.material.transparent = true;
          o.material.opacity = 0;
          o.material.depthWrite = false;
        }
        if (o.isMesh) {
          o.userData.action = "letter";
          interactionTargets.push(o);
        }
      });
      hitBox("letter", 0, 0, 8e-3, 0.29, 0.2, 0.045, mailEnvelope);
      let letterTarget = 0, letterAmount = 0;
      const letterStyle = document.createElement("style");
      letterStyle.textContent = "\n .scene-letter{padding:0;border:1px solid #d7c7a7;border-radius:3px;width:720px;max-width:calc(calc(var(--street-vw) * 100) - 28px);max-height:calc(var(--street-vh) * 88);color:#5c5648;background:#f6eddb;box-shadow:0 24px 100px rgba(6,13,25,0.7020);overflow:hidden}\n .scene-letter::backdrop{background:rgba(16,27,45,0.7020);backdrop-filter:blur(5px)}\n .letter-scroll{max-height:calc(var(--street-vh) * 88);overflow:auto;overscroll-behavior:contain;padding:48px 54px 35px;background:radial-gradient(ellipse at 0 0,rgba(255,249,235,0.5333),transparent 70%),repeating-linear-gradient(0deg,rgba(158,135,96,0.0157) 0px,rgba(158,135,96,0.0157) 1px,transparent 1px,transparent 5px);font:16px/1.9 Georgia,'Noto Serif SC','Songti SC',SimSun,serif;scrollbar-width:thin;scrollbar-color:#bbae94 transparent}\n .letter-close{position:absolute;right:12px;top:10px;padding:7px 10px;color:#7c7667;background:rgba(246,237,219,0.9294);border:0;border-radius:2px;font:13px Georgia,serif;cursor:pointer;z-index:1}.letter-close:hover{color:#3e5e56;background:#e8e0ce}.letter-close:focus{outline:2px solid #7d9b8c;outline-offset:2px}\n .letter-eyebrow{font:12px/1.5 Georgia,serif;letter-spacing:.18em;color:#8b9d8b;margin:0 0 15px}.scene-letter h1{font-size:26px;line-height:1.5;font-weight:500;letter-spacing:.03em;margin:0 0 13px;color:#4f665b}.letter-intro{margin:0 0 26px;color:#8a7d65;font-size:15px}.letter-steps{padding:0;margin:0;list-style:none;counter-reset:letter-step}.letter-steps li{position:relative;padding:0 0 19px 35px;border-left:1px solid #d9ccb0;margin-left:11px;counter-increment:letter-step}.letter-steps li:before{content:counter(letter-step,decimal-leading-zero);position:absolute;left:-13px;top:3px;background:#f6eddb;color:#a3977e;font:12px/25px Georgia,serif;width:26px;text-align:center}.letter-steps strong{display:block;color:#66796c;font-weight:600;font-size:16px;margin:0 0 3px}.letter-substep{font:11px/1.8 Georgia,serif;color:#9a9e8c;letter-spacing:.04em}.letter-steps p+p{margin-top:7px}.letter-steps p{margin:0;font-size:14px;color:#756d5b}.letter-signoff{border-top:1px solid #d9ccb0;text-align:right;padding-top:18px;margin:12px 0 0;color:#8a927e;font-style:italic;font-size:15px}.letter-signoff small{display:block;font-style:normal;letter-spacing:.15em;font-size:11px;color:#ab9c80}\n @media(max-width:520px){.letter-scroll{padding:46px 25px 28px}.scene-letter h1{font-size:22px}.letter-steps li{padding-left:25px}.letter-steps p{font-size:14px}.letter-intro{font-size:14px}}\n @media(prefers-reduced-motion:no-preference){.scene-letter[open]{animation:letter-unfold .3s ease-out}@keyframes letter-unfold{from{opacity:0;transform:translateY(16px) rotate(-1deg)}to{opacity:1;transform:none}}}\n";
      window.streetAppendStyle(letterStyle, "snow");
      const letterDialog = document.createElement("dialog");
      letterDialog.className = "scene-letter";
      letterDialog.setAttribute("aria-labelledby", "scene-letter-title");
      letterDialog.innerHTML = '\n <button class="letter-close" type="button" aria-label="\u6536\u8D77\u4FE1\u7EB8">\u6536\u8D77 \xD7</button>\n <article class="letter-scroll"><p class="letter-eyebrow">\u661F\u6708\u901A\u308A \xB7 SCENE NOTES</p><h1 id="scene-letter-title">\u5BC4\u7ED9\u4E0B\u4E00\u675F\u8DEF\u8FC7\u7684\u5149</h1>\n <p class="letter-intro">\u719F\u6089\u7684\u8857\u89D2\u6362\u4E0A\u4E86\u9713\u8679\uFF0C\u800C\u7559\u7ED9\u8DEF\u8FC7\u4E4B\u4EBA\u7684\u6E29\u67D4\uFF0C\u4ECD\u5728\u539F\u5904\u3002</p>\n <ol class="letter-steps">\n<li><strong>\u8857\u89D2\uFF0C\u5728\u51E0\u5341\u5E74\u4EE5\u540E</strong><p>\u5982\u679C\u4F60\u8FD8\u8BB0\u5F97\u90A3\u95F4\u4EAE\u7740\u6696\u706F\u7684\u5C0F\u5E97\uFF0C\u5C31\u6CBF\u7740\u540C\u4E00\u6761\u8DEF\u518D\u8D70\u4E00\u904D\u5427\u3002\u96E8\u591C\u3001\u6674\u663C\u4E0E\u9EC4\u660F\u90FD\u88AB\u59A5\u5E16\u5730\u6536\u85CF\u7740\uFF0C\u800C\u7B2C\u56DB\u675F\u5149\uFF0C\u4F1A\u5E26\u4F60\u62B5\u8FBE2077\u5E74\u7684\u661F\u6708\u8857\u89D2\u3002\u623F\u5C4B\u548C\u80E1\u540C\u8FD8\u5728\u539F\u6765\u7684\u4F4D\u7F6E\uFF0C\u5929\u7A7A\u5374\u66F4\u6DF1\u3001\u66F4\u8FDC\uFF0C\u50CF\u4E00\u5C01\u7EC8\u4E8E\u9001\u8FBE\u7684\u84DD\u8272\u6765\u4FE1\u3002</p><p>\u98CE\u94C3\u4E5F\u8FD8\u5728\u3002\u73BB\u7483\u4E0B\u7684\u7EB8\u7B7E\u66FF\u98CE\u7559\u4E0B\u77ED\u77ED\u7684\u505C\u987F\uFF0C\u95E8\u524D\u7684\u80FD\u6E90\u68D2\u5219\u4E00\u6839\u63A5\u4E00\u6839\uFF0C\u7B49\u5019\u4E0B\u4E00\u4F4D\u591C\u884C\u4EBA\u3002\u672A\u6765\u6709\u4E86\u65B0\u7684\u5F62\u72B6\uFF0C\u6709\u4E9B\u6E29\u67D4\u5374\u4E0D\u5FC5\u66F4\u65B0\u3002</p></li>\n<li><strong>\u4E3A\u4F60\u4FDD\u7559\u4E00\u76CF\u706F\uFF0C\u4E5F\u4FDD\u7559\u65F6\u95F4</strong><p>\u8F7B\u89E6\u8857\u8FB9\u7684\u7EC8\u7AEF\uFF0C\u6574\u95F4\u5C0F\u5E97\u4F1A\u4ECE\u9752\u84DD\u6E10\u67D3\u6210\u7C89\u8272\uFF1A\u6A90\u4E0B\u706F\u6761\u4E0E\u5B57\u724C\uFF0C\u4E00\u8D77\u6362\u4E0A\u53E6\u4E00\u79CD\u5FC3\u60C5\uFF1B\u7167\u5728\u8857\u89D2\u7684\u5149\u3001\u6BCF\u4E2A\u5B57\u7684\u5927\u5C0F\u548C\u542B\u4E49\uFF0C\u90FD\u7559\u5728\u539F\u5904\u3002\u8FC7\u4E00\u4F1A\u513F\uFF0C\u84DD\u8272\u7684\u591C\u53C8\u8F7B\u8F7B\u56DE\u6765\uFF0C\u50CF\u6F6E\u6C34\u9000\u5230\u8857\u9053\u53E6\u4E00\u7AEF\u3002</p><p>\u4FA7\u9762\u768424H\u724C\u85CF\u7740\u4E00\u4E2A\u5C0F\u673A\u5173\uFF0C\u78B0\u4E00\u4E0B\uFF0C\u65F6\u95F4\u5C31\u6362\u4E00\u79CD\u65B9\u5F0F\u966A\u4F60\u3002\u65E0\u8BBA\u4F60\u8D70\u8FDB\u54EA\u4E00\u7247\u5929\u7A7A\uFF0C\u955C\u5934\u4F1A\u8BB0\u4F4F\u4F60\u7684\u76EE\u5149\uFF1B\u82E5\u60F3\u91CD\u65B0\u5F00\u59CB\uFF0C\u5DE6\u4E0B\u89D2\u7684\u4E00\u6B21\u8F7B\u89E6\uFF0C\u4F1A\u8BA9\u8857\u89D2\u5728\u77ED\u6682\u7684\u6697\u573A\u540E\uFF0C\u50CF\u521D\u89C1\u65F6\u90A3\u6837\u4F9D\u6B21\u9192\u6765\u3002</p></li>\n<li><strong>\u505C\u5728\u5DF7\u53E3\u7684\uFF0C\u4E0D\u53EA\u662F\u5F52\u9014</strong><p>\u5C0F\u8F7F\u8F66\u540E\u6765\u5B66\u4F1A\u4E86\u60AC\u6D6E\uFF0C\u4ECD\u505C\u5728\u90A3\u6761\u719F\u6089\u7684\u80E1\u540C\u91CC\u3002\u900F\u660E\u9A7E\u9A76\u8231\u4E0B\u6709\u5B89\u7A33\u7684\u5EA7\u6905\uFF0C\u4FA7\u95E8\u5411\u4E0A\u5C55\u5F00\uFF0C\u56DB\u675F\u6DE1\u84DD\u6C14\u6D41\u5728\u8F66\u5E95\u4EAE\u8D77\uFF0C\u50CF\u4E3A\u4E00\u6BB5\u5C1A\u672A\u542F\u7A0B\u7684\u65C5\u884C\u8BD5\u7740\u70B9\u706B\u3002</p><p>\u540E\u95E8\u65C1\u7684\u6469\u6258\u8F66\u6536\u8D77\u4E86\u65E7\u65F6\u4EE3\u7684\u8F6E\u8F90\uFF0C\u8D29\u5356\u673A\u91CC\u4E5F\u76DB\u7740\u516D\u8FB9\u5F62\u7684\u5FAE\u5149\u3002\u4F60\u4ECD\u80FD\u542C\u89C1\u9E23\u7B1B\uFF0C\u4ECD\u80FD\u4ECE\u53D6\u8D27\u53E3\u62FF\u8D70\u4E00\u74F6\u996E\u6599\u3002\u518D\u9065\u8FDC\u7684\u57CE\u5E02\uFF0C\u4E5F\u9700\u8981\u8FD9\u4E9B\u8BA9\u4EBA\u5B89\u5FC3\u7684\u5C0F\u4E8B\u3002</p></li>\n<li><strong>\u6709\u4EBA\u628A\u8BAF\u53F7\u7559\u5728\u591C\u7A7A\u91CC</strong><p>\u65E0\u4EBA\u673A\u4ECE\u5C4B\u9876\u524D\u4FA7\u8D77\u98DE\uFF0C\u60AC\u505C\u7247\u523B\uFF0C\u53C8\u964D\u56DE\u5145\u7535\u5EA7\u3002\u4E09\u53F6\u98CE\u6247\u5728\u7A7A\u6C14\u51C0\u5316\u673A\u91CC\u7F13\u7F13\u8F6C\u52A8\uFF0C\u767D\u96FE\u8D8A\u8FC7\u5C4B\u9876\uFF0C\u8BA9\u591C\u8272\u6709\u4E86\u53EF\u4EE5\u547C\u5438\u7684\u8D77\u4F0F\u3002</p><p>\u5408\u6210\u5668\u7684\u65CB\u5F8B\u5F88\u8F7B\uFF0C\u5076\u5C14\u54CD\u8D77\u4E00\u58F0\u7535\u5B50\u56DE\u97F3\u3002\u8DEF\u53E3\u7684\u5C0F\u673A\u5668\u4EBA\u4ECD\u8BA4\u771F\u7B49\u5F85\u7EA2\u7EFF\u706F\uFF0C\u6CBF\u8857\u7684\u900F\u660E\u62A4\u680F\u3001\u7BA1\u7EBF\u548C\u6392\u6C34\u683C\u6805\u5404\u5B88\u7740\u81EA\u5DF1\u7684\u5C97\u4F4D\u3002\u672A\u6765\u4E0D\u662F\u4E00\u7247\u55A7\u95F9\uFF0C\u5B83\u4E5F\u4F1A\u5728\u6DF1\u591C\u4F4E\u58F0\u8BF4\u8BDD\u3002</p></li>\n<li><strong>\u79D1\u6280\u5F88\u8FDC\uFF0C\u665A\u996D\u5F88\u8FD1</strong><p>\u540E\u4FA7\u7684\u900F\u660E\u53D6\u9910\u8231\u4F1A\u5411\u4E0A\u6253\u5F00\uFF0C\u628A\u4E00\u4EFD\u4FBF\u5F53\u7F13\u7F13\u9001\u5230\u6258\u76D8\u524D\u3002\u6709\u65F6\u5C4F\u5E55\u53EA\u4EAE\u8D77PREPARING\uFF0C\u7136\u540E\u6E10\u6E10\u6DE1\u53BB\u2014\u2014\u4E5F\u8BB8\u53A8\u623F\u91CC\u7684\u4EBA\u6B63\u66FF\u4F60\u591A\u7559\u4E00\u70B9\u70ED\u6C14\u3002\u65C1\u8FB9\u7684STANDBY\u4E5F\u6362\u4E0A\u4E00\u5757\u66F4\u6E05\u695A\u7684\u5C4F\u5E55\uFF0C\u7B49\u4F60\u9760\u8FD1\u65F6\uFF0C\u4E00\u773C\u5C31\u80FD\u8BFB\u61C2\u3002\u9505\u6CBF\u7684\u84DD\u5149\u4E0E\u7C89\u5149\uFF0C\u6084\u6084\u544A\u8BC9\u4F60\u6B64\u523B\u662F\u5426\u9002\u5408\u63ED\u76D6\u3002</p><p>\u5496\u5561\u676F\u4ECD\u80FD\u6CE8\u6EE1\uFF0C\u4E5F\u80FD\u6E05\u7A7A\uFF1B\u900F\u660E\u7F69\u4E0B\u7684\u5305\u5B50\u4E0D\u4F1A\u968F\u706F\u5149\u6D88\u5931\u3002\u51B0\u67DC\u95E8\u8F7B\u8F7B\u63A8\u5F0030\u5EA6\uFF0C\u51C9\u610F\u4E0E\u996E\u6599\u90FD\u7559\u5728\u5404\u81EA\u7684\u4F4D\u7F6E\u3002\u5927\u95E8\u6ED1\u5F00\u65F6\uFF0C\u5730\u57AB\u8FB9\u7F18\u968F\u4E4B\u4EAE\u8D77\uFF0C\u50CF\u4E00\u53E5\u6CA1\u6709\u8BF4\u51FA\u53E3\u7684\u201C\u4F60\u6765\u4E86\u201D\u3002</p></li>\n<li><strong>\u5728\u73BB\u7483\u91CC\u517B\u82B1\uFF0C\u5728\u5899\u8FB9\u5B58\u4E00\u5C0F\u6BB5\u5149</strong><p>\u540E\u95E8\u7684\u82B1\u88AB\u6536\u8FDB\u65E0\u8272\u73BB\u7483\u7F69\uFF0C\u50A8\u6C34\u5C42\u6258\u7740\u771F\u5B9E\u7684\u6839\u4E0E\u53F6\uFF0C\u706F\u6761\u4ECE\u540E\u4E0A\u65B9\u7167\u4E0B\u6765\u3002\u73BB\u7483\u73B0\u5728\u7559\u7740\u66F4\u6E05\u695A\u7684\u8F6E\u5ED3\uFF0C\u8BA9\u4F60\u770B\u89C1\u8FD9\u4E2A\u5C0F\u5C0F\u57F9\u517B\u8231\uFF0C\u4E5F\u770B\u89C1\u91CC\u9762\u4ECD\u5728\u7EE7\u7EED\u7684\u751F\u957F\u3002</p><p>\u539F\u5148\u82B1\u7BEE\u7684\u4F4D\u7F6E\uFF0C\u6362\u6210\u4E86\u4E09\u683C\u58C1\u6302\u80FD\u6E90\u7535\u6C60\u8231\u3002\u70B9\u4E00\u683C\uFF0C\u5B83\u5C31\u8F7B\u8F7B\u9001\u51FA\uFF1B\u518D\u70B9\u6536\u56DE\uFF0C\u6362\u53E6\u4E00\u683C\u65F6\uFF0C\u5148\u524D\u7684\u4F1A\u81EA\u52A8\u5F52\u4F4D\u3002\u8231\u540D\u8F7B\u8F7B\u60AC\u5728\u4E0A\u65B9\uFF0C\u4E0D\u6321\u4F4F\u4EFB\u4F55\u4E00\u683C\u661F\u5149\uFF0C\u50CF\u8FD9\u5EA7\u57CE\u5E02\u628A\u5907\u7528\u7684\u661F\u5149\uFF0C\u4E00\u6B21\u53EA\u501F\u7ED9\u4E00\u4E2A\u4EBA\u3002</p></li>\n<li><strong>\u4E24\u79CD\u989C\u8272\uFF0C\u5954\u5411\u76F8\u53CD\u7684\u8FDC\u65B9</strong><p>\u9752\u84DD\u8272\u7684\u8F66\u706F\u5F80\u8FD9\u4E00\u8FB9\u6765\uFF0C\u7C89\u7D2B\u8272\u7684\u8F66\u706F\u5F80\u53E6\u4E00\u8FB9\u53BB\u3002\u6BCF\u4E00\u5BF9\u706F\u90FD\u6709\u76F8\u540C\u7684\u989C\u8272\uFF0C\u5730\u9762\u7684\u6298\u89D2\u5BFC\u5149\u7EBF\u4E5F\u671D\u5411\u76F8\u53CD\u65B9\u5411\uFF0C\u5728\u6591\u9A6C\u7EBF\u524D\u5B89\u9759\u8BA9\u5F00\u3002\u6D45\u84DD\u8272\u7684\u534A\u900F\u660E\u957F\u6761\u60AC\u5728\u8DEF\u9762\u4E0A\uFF0C\u50CF\u901A\u5F80\u53E6\u4E00\u6BB5\u73B0\u5B9E\u7684\u5149\u6865\uFF1B\u9A6C\u8DEF\u53E6\u4E00\u8FB9\uFF0C\u4E5F\u6709\u540C\u8272\u7684\u8DEF\u574E\u63A5\u4F4F\u811A\u6B65\u3002\u7EC6\u5C0F\u7684\u8DEF\u9489\u5728\u96E8\u591C\u6620\u7740\u51B7\u5149\uFF0C\u6674\u5929\u50CF\u4E00\u679A\u6696\u91D1\u8272\u592A\u9633\uFF0C\u9EC4\u660F\u7559\u4E0B\u7425\u73C0\u8272\uFF0C\u5230\u4E86\u9713\u8679\u591C\u4FBF\u4EAE\u8D77\u6D45\u9752\u8272\u3002</p><p>\u8DEF\u724C\u5199\u7740HOSHITSUKI ST.\uFF0C\u5496\u5561\u53F0\u5199\u7740ODEN &amp; COFFEE\u3002\u82F1\u6587\u6807\u8BC6\u88AB\u5B89\u653E\u5728\u6070\u597D\u7684\u8FB9\u6846\u91CC\u3002\u90A3\u4E9B\u539F\u672C\u7EB7\u4E71\u7684\u7EBF\u4E0E\u5B57\uFF0C\u6700\u540E\u90FD\u8BA9\u51FA\u4E00\u70B9\u7A7A\u767D\uFF0C\u7559\u7ED9\u591C\u665A\uFF0C\u4E5F\u7559\u7ED9\u4F60\u3002</p></li>\n<li><strong>\u8857\u89D2\u4E5F\u6709\u81EA\u5DF1\u7684\u5C0F\u79E9\u5E8F</strong><p>\u5899\u5916\u7684\u56DE\u6536\u7BB1\u85CF\u7740\u559D\u7A7A\u7684\u7F50\u5B50\u4E0E\u900F\u660E\u996E\u6599\u74F6\uFF0C\u8F7B\u8F7B\u6380\u8D77\u76D6\u5B50\uFF0C\u4FBF\u770B\u89C1\u8DEF\u8FC7\u8FD9\u91CC\u7684\u65E5\u5E38\u3002\u5899\u95F4\u7684\u4E00\u5C42\u767E\u53F6\u7247\u4F34\u7740\u7EC6\u5FAE\u6469\u64E6\u58F0\u8F7B\u8F7B\u7FFB\u5F00\uFF0C\u900F\u51FA\u5C0F\u5E97\u7684\u706F\u706B\uFF0C\u50CF\u8857\u89D2\u5B89\u9759\u800C\u7EF5\u957F\u7684\u547C\u5438\u3002\u82E5\u60F3\u56DE\u5230\u521D\u89C1\uFF0C\u5DE6\u4E0B\u89D2\u7684\u4E00\u6B21\u8F7B\u89E6\uFF0C\u4F1A\u8BA9\u773C\u524D\u7684\u5929\u6C14\u5728\u77ED\u6682\u6DE1\u573A\u540E\uFF0C\u91CD\u65B0\u5B89\u9759\u4E0B\u6765\uFF1B\u7559\u7ED9\u67D0\u4E2A\u4EBA\u7684\u8BDD\uFF0C\u4ECD\u5728\u4FE1\u91CC\u3002</p></li><li><strong>\u96E8\u4E0E\u5149\uFF0C\u90FD\u6084\u6084\u7559\u4E0B\u75D5\u8FF9</strong><p>\u96E8\u591C\u7684\u73BB\u7483\u5076\u5C14\u8499\u8D77\u4E00\u7247\u96FE\uFF0C\u8F7B\u8F7B\u70B9\u5B83\uFF0C\u6307\u5C16\u4F1A\u4E00\u7B14\u4E00\u7B14\u64E6\u51FA\u900F\u660E\u7684\u7B11\u8138\uFF0C\u968F\u540E\u53C8\u6162\u6162\u8499\u4E0A\u6C34\u6C7D\uFF1B\u5C4B\u6A90\u6512\u591F\u96E8\u6C34\uFF0C\u4FBF\u843D\u4E0B\u4E00\u5C0F\u4E32\u6C34\u6EF4\u3002\u6674\u5929\u7684\u65E5\u5149\u7F13\u7F13\u632A\u52A8\uFF0C\u74F6\u8EAB\u95EA\u8FC7\u5FAE\u5149\uFF0C\u767D\u9E3D\u4E0D\u65F6\u843D\u4E0B\u4E00\u6839\u7FBD\u6BDB\uFF0C\u4ECE\u96E8\u68DA\u5916\u6CBF\uFF0C\u8F7B\u8F7B\u4E58\u98CE\u98DE\u5411\u7A7A\u4E2D\u3002</p><p>\u9EC4\u660F\u7684\u706F\u6309\u533A\u57DF\u4F9D\u6B21\u9192\u6765\uFF0C\u7A97\u8FB9\u7559\u7740\u6700\u540E\u4E00\u7F15\u5915\u9633\u3002\u5C0F\u72D7\u7761\u68A6\u4E2D\u7684\u547C\u5438\u5F88\u8F7B\uFF0C\u70B9\u4E00\u4E0B\uFF0C\u5B83\u5148\u4F38\u4E2A\u61D2\u8170\uFF0C\u518D\u56DE\u5230\u81EA\u5DF1\u7684\u5C0F\u68A6\u91CC\u3002\u6309\u4E0B\u76F8\u673A\uFF0C\u5148\u770B\u770B\u8FD9\u4E00\u523B\u7684\u660E\u4FE1\u7247\uFF0C\u518D\u51B3\u5B9A\u662F\u5426\u6536\u85CF\u3002\u5361\u7247\u4E0A\u4F1A\u7559\u4E0B\u5F53\u524D\u5929\u7A7A\u7684\u7EAA\u5FF5\u90AE\u6233\uFF1A\u96E8\u6EF4\u3001\u7FBD\u6BDB\u3001\u843D\u65E5\uFF0C\u6216\u4E00\u9897\u6CBF\u8F68\u9053\u65C5\u884C\u7684\u661F\u3002</p></li><li><strong>\u8FD9\u5C01\u4FE1\uFF0C\u4E0D\u5FC5\u6709\u6536\u4EF6\u5730\u5740</strong><p>\u90AE\u7B52\u9001\u51FA\u7684\u5DF2\u4E0D\u518D\u662F\u7EB8\u7247\uFF0C\u800C\u662F\u4E00\u679A\u5FAE\u5FAE\u60AC\u8D77\u7684\u7535\u5B50\u4FE1\u7B3A\u3002\u70B9\u5F00\u5B83\uFF0C\u56DB\u89D2\u7684\u7EC6\u5149\u4F1A\u56F4\u4F4F\u8FD9\u5C01\u4FE1\uFF0C\u50CF\u4ECE\u57CE\u5E02\u53E6\u4E00\u7AEF\u63A5\u901A\u4E86\u4E00\u6247\u5F88\u5C0F\u7684\u7A97\u3002</p><p>\u5982\u679C\u4F60\u613F\u610F\uFF0C\u5C31\u5728\u672B\u5C3E\u7559\u4E0B\u4E00\u53E5\u8BDD\u5427\u3002\u53EF\u4EE5\u9001\u7ED9\u67D0\u4E2A\u4EBA\uFF0C\u4E5F\u53EF\u4EE5\u9001\u7ED9\u8BB8\u591A\u5E74\u540E\u7684\u81EA\u5DF1\u3002\u7B49\u4E0B\u4E00\u675F\u5149\u8DEF\u8FC7\u661F\u6708\u8857\u89D2\uFF0C\u8FD9\u91CC\u603B\u6709\u4E00\u76CF\u706F\uFF0C\u8FD8\u8BB0\u5F97\u8981\u4E3A\u8C01\u4EAE\u7740\u3002</p></li></ol><label class="personal-label" for="personal-message">\u7559\u7ED9\u67D0\u4E2A\u4EBA\u7684\u8BDD</label><textarea id="personal-message" class="personal-message" rows="3" maxlength="600" aria-label="\u79C1\u4EBA\u7559\u8A00" placeholder="\u5728\u8FD9\u91CC\u5199\u4E0B\u4E00\u53E5\u795D\u798F\u2026\u2026"></textarea><p class="letter-signoff">wfcsilence<small>2026\xB710 \xB7 \u661F\u6708\u901A\u308A</small></p></article>';
      sceneHost.appendChild(letterDialog);
      {
        const overlay = document.createElement("div");
        overlay.className = "landscape-letter-backdrop";
        overlay.hidden = true;
        sceneHost.appendChild(overlay);
        overlay.addEventListener("click", () => letterDialog.close());
        letterDialog.showModal = function() {
          this.setAttribute("open", "");
          overlay.hidden = false;
          document.getElementById("street-modes").style.pointerEvents = "none";
        };
        letterDialog.close = function() {
          this.removeAttribute("open");
          overlay.hidden = true;
          document.getElementById("street-modes").style.pointerEvents = "";
          this.dispatchEvent(new Event("close"));
        };
      }
      letterDialog.querySelector("button").addEventListener("click", () => letterDialog.close());
      letterDialog.addEventListener("click", (e) => {
        if (e.target === letterDialog) letterDialog.close();
      });
      letterDialog.addEventListener("close", () => {
        renderer.domElement.focus({ preventScroll: true });
      });
      function openSceneLetter() {
        if (!letterDialog.open) {
          letterDialog.showModal();
          letterDialog.querySelector(".letter-scroll").scrollTop = 0;
          requestAnimationFrame(() => {
            if (letterDialog.open) letterDialog.querySelector(".letter-scroll").scrollTop = 0;
          });
          playSound("take");
          vy = vp = 0;
        }
      }
      hitBox("pedestrianSignal", 0, 0, 0, 0.48, 0.89, 0.33, pedestrianHead);
      hitBox("pedestrianSignal", 0, 0, 0, 0.93, 0.41, 0.33, vehicleHead);
      crossingSignal.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "pedestrianSignal";
          interactionTargets.push(o);
        }
      });
      for (const pot of flowerPots) {
        const hit = hitBox("flower", 0, 0.43, 0, 0.42, 0.55, 0.42, pot);
        hit.userData.flower = pot;
        pot.userData.blooms.traverse((o) => {
          if (o.isMesh) {
            o.userData.action = "flower";
            o.userData.flower = pot;
            interactionTargets.push(o);
          }
        });
      }
      const pickupHit = hitBox("takeout", -2.4, 1.9, -3.94, 1.12, 1.03, 0.3);
      takeoutGroup.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "takeout";
          interactionTargets.push(o);
        }
      });
      bento.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "takeout";
          interactionTargets.push(o);
        }
      });
      let yaw = 0.65, pitch = 0.43, distance = 21.7, vy = 0, vp = 0, target = new THREE.Vector3(0, 1.4, 0), pointers = /* @__PURE__ */ new Map(), gesture = null;
      const el = renderer.domElement;
      el.tabIndex = 0;
      el.setAttribute("aria-label", "\u53EF\u65CB\u8F6C\u7684\u96E8\u591C\u4FBF\u5229\u5E97\u6A21\u578B");
      el.style.touchAction = "none";
      let doorTarget = 0, doorAmount = 0, tapStart = null;
      const doorRay = new THREE.Raycaster();
      const doorHit = new THREE.Mesh(new THREE.PlaneGeometry(2.65, 2.8), new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }));
      doorHit.position.set(-1.22, 1.8, 1);
      world.add(doorHit);
      doorHit.userData.action = "front";
      el.addEventListener("pointerdown", (nativeEvent) => {
        const e = window.sceneEvent(nativeEvent);
        focusTween = null;
        ensureAudio();
        tapStart = pointers.size ? null : { x: e.clientX, y: e.clientY, id: e.pointerId };
        el.setPointerCapture(e.pointerId);
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        vy = vp = 0;
        gesture = null;
      });
      el.addEventListener("pointermove", (nativeEvent) => {
        const e = window.sceneEvent(nativeEvent);
        if (!pointers.has(e.pointerId)) {
          el.style.cursor = pickScene(e) ? "pointer" : "grab";
          return;
        }
        const old = pointers.get(e.pointerId);
        const dx = e.clientX - old.x, dy = e.clientY - old.y;
        if (tapStart && Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y) > 7) tapStart = null;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.size === 2) {
          let a = [...pointers.values()];
          let len = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
          if (gesture) distance = THREE.MathUtils.clamp(distance * gesture / len, 4.5, 85);
          gesture = len;
        } else if (e.shiftKey || e.buttons === 2) {
          const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
          target.addScaledVector(right, -dx * distance * 12e-4);
          target.y = THREE.MathUtils.clamp(target.y + dy * distance * 12e-4, -0.5, 4);
        } else {
          yaw -= dx * 5e-3;
          pitch = THREE.MathUtils.clamp(pitch + dy * 4e-3, 0.16, 1.3);
          vy = -dx * 45e-5;
          vp = dy * 3e-4;
        }
      });
      for (let event of ["pointerup", "pointercancel"]) el.addEventListener(event, (nativeEvent) => {
        const e = window.sceneEvent(nativeEvent);
        if (event === "pointerup" && tapStart && tapStart.id === e.pointerId && e.button === 0 && !e.shiftKey) {
          clearTimeout(singleTapTimer);
          const tap = { clientX: e.clientX, clientY: e.clientY };
          singleTapTimer = setTimeout(() => actOnScene(tap), 300);
        }
        tapStart = null;
        pointers.delete(e.pointerId);
        gesture = null;
      });
      el.addEventListener("contextmenu", (e) => e.preventDefault());
      el.addEventListener("wheel", (e) => {
        focusTween = null;
        e.preventDefault();
        distance = THREE.MathUtils.clamp(distance * Math.exp(e.deltaY * 1e-3), 4.5, 85);
      }, { passive: false });
      el.addEventListener("dblclick", (nativeEvent) => {
        const e = window.sceneEvent(nativeEvent);
        clearTimeout(singleTapTimer);
        focusObject(e);
      });
      function resize() {
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, window.streetLowQuality ? 1 : 1.5, Math.sqrt((window.streetLowQuality ? 1e6 : 2e6) / (window.sceneViewport.width * window.sceneViewport.height))));
        camera.aspect = window.sceneViewport.width / window.sceneViewport.height;
        camera.updateProjectionMatrix();
        renderer.setSize(window.sceneViewport.width, window.sceneViewport.height);
      }
      addEventListener("resize", resize);
      addEventListener("sceneorientationchange", () => {
        resize();
        resizeClouds();
      });
      const dryAsphalt = texture(1024, 1024, (c, W, H) => {
        c.fillStyle = "#68777a";
        c.fillRect(0, 0, W, H);
        let seed2 = 441;
        for (let i = 0; i < 26e3; i++) {
          seed2 = seed2 * 1664525 + 1013904223 >>> 0;
          const x = seed2 / 4294967296 * W;
          seed2 = seed2 * 1664525 + 1013904223 >>> 0;
          const y = seed2 / 4294967296 * H;
          c.fillStyle = i % 2 ? "rgba(212,211,186,0.0824)" : "rgba(52,76,82,0.0941)";
          c.fillRect(x, y, 1.5, 1.5);
        }
      });
      const wetAsphalt = street.material.map, wetRoadColor = street.material.color.clone();
      const nightEmissives = [];
      mats.forEach((m) => {
        if (m.emissiveIntensity > 0) nightEmissives.push({ m, power: m.emissiveIntensity });
      });
      const pigeon = new THREE.Group();
      pigeon.position.set(2.36, 3.075, 1.56);
      pigeon.rotation.y = 0;
      pigeon.scale.set(0.64, 0.75, 0.7);
      pigeon.name = "sunny-awning-pigeon";
      world.add(pigeon);
      let pigeonReact = -100;
      function birdBall(x, y, z, sx, sy, sz, color, parent = pigeon) {
        const o = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), mat(color));
        o.position.set(x, y, z);
        o.scale.set(sx, sy, sz);
        o.castShadow = true;
        parent.add(o);
        return o;
      }
      birdBall(0, 0.29, -0.025, 0.14, 0.23, 0.26, 15855843);
      birdBall(0, 0.44, 0.085, 0.092, 0.17, 0.105, 14148063);
      const pigeonHead = new THREE.Group();
      pigeonHead.position.set(0, 0.565, 0.16);
      pigeon.add(pigeonHead);
      birdBall(0, 0, 0, 0.112, 0.12, 0.125, 16184296, pigeonHead);
      for (const side of [-1, 1]) {
        birdBall(side * 0.112, 0.012, 0.057, 0.017, 0.021, 0.018, 2308418, pigeonHead);
        birdBall(side * 0.12, 0.019, 0.066, 5e-3, 6e-3, 6e-3, 16777197, pigeonHead);
      }
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.105, 5), mat(13147002));
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, -0.025, 0.156);
      pigeonHead.add(beak);
      birdBall(0, -4e-3, 0.112, 0.032, 0.021, 0.022, 15131350, pigeonHead);
      for (const side of [-1, 1]) {
        rod([side * 0.065, 0.02, 5e-3], [side * 0.065, 0.14, -0.01], 0.012, 13012600, pigeon);
        for (const dx of [-0.037, 0, 0.037]) rod([side * 0.065, 0.02, 5e-3], [side * 0.065 + dx, 0.015, 0.1], 9e-3, 13012600, pigeon);
      }
      for (let i = 0; i < 5; i++) {
        const tail2 = birdBall((i - 2) * 0.035, 0.17, -0.24, 0.032, 0.035, 0.17, i % 2 ? 14542048 : 15855328);
        tail2.rotation.x = 0.27;
        tail2.rotation.y = (i - 2) * 0.09;
      }
      const pigeonWings = [];
      for (const side of [-1, 1]) {
        const wing = new THREE.Group();
        wing.position.set(side * 0.115, 0.38, -0.015);
        wing.userData.side = side;
        pigeon.add(wing);
        birdBall(side * 0.025, -0.09, -0.015, 0.065, 0.18, 0.155, 15001824, wing);
        for (let i = 0; i < 5; i++) {
          const feather = birdBall(side * (0.02 + i * 8e-3), -0.13 - i * 0.013, -0.12 + i * 0.047, 0.027, 0.145 - i * 7e-3, 0.033, i % 2 ? 16118245 : 13950425, wing);
          feather.rotation.z = -side * 0.1;
        }
        pigeonWings.push(wing);
      }
      hitBox("pigeon", 0, 0.34, 0, 0.63, 0.76, 0.79, pigeon);
      pigeon.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "pigeon";
          if (!interactionTargets.includes(o)) interactionTargets.push(o);
        }
      });
      function initDayMusic() {
        musicGain = audioContext.createGain();
        musicGain.gain.value = isSunny ? 0.5 : 0;
        const soft = audioContext.createBiquadFilter();
        soft.type = "lowpass";
        soft.frequency.value = 850;
        soft.Q.value = 0.35;
        musicGain.connect(soft);
        soft.connect(audioMaster);
        const reverb = audioContext.createConvolver(), tail2 = audioContext.createGain();
        tail2.gain.value = 0.18;
        const buffer = audioContext.createBuffer(2, Math.floor(audioContext.sampleRate * 3.2), audioContext.sampleRate);
        let seed2 = 981;
        for (let c = 0; c < 2; c++) {
          const d = buffer.getChannelData(c);
          for (let i = 0; i < d.length; i++) {
            seed2 = seed2 * 1664525 + 1013904223 >>> 0;
            d[i] = (seed2 / 4294967296 * 2 - 1) * Math.pow(1 - i / d.length, 3) * 0.38;
          }
        }
        reverb.buffer = buffer;
        soft.connect(reverb);
        reverb.connect(tail2);
        tail2.connect(audioMaster);
        nextMusicNote = audioContext.currentTime + 0.15;
      }
      function musicVoice(midi, t, hold, volume, pad = false) {
        const ctx = audioContext, freq = 440 * Math.pow(2, (midi - 69) / 12), env = ctx.createGain(), pan = ctx.createStereoPanner();
        env.gain.setValueAtTime(1e-5, t);
        env.gain.linearRampToValueAtTime(volume, t + (pad ? 1.8 : 0.95));
        env.gain.linearRampToValueAtTime(volume * 0.72, t + hold * 0.62);
        env.gain.exponentialRampToValueAtTime(1e-5, t + hold);
        pan.pan.value = Math.sin(midi * 1.71) * 0.17;
        env.connect(pan);
        pan.connect(musicGain);
        const partials = [[1, 0.57, -2.5], [1, 0.43, 2.5], [2, 0.025, 0]];
        let remaining = partials.length;
        for (const [ratio, amount, detune] of partials) {
          const o = ctx.createOscillator(), level = ctx.createGain();
          o.type = "sine";
          o.frequency.value = freq * ratio;
          o.detune.value = detune;
          level.gain.value = amount;
          o.connect(level);
          level.connect(env);
          o.start(t);
          o.stop(t + hold + 0.06);
          o.onended = () => {
            o.disconnect();
            level.disconnect();
            if (--remaining === 0) {
              env.disconnect();
              pan.disconnect();
            }
          };
        }
        musicNoteCount++;
      }
      const dayMelody = [64, 67, 69, null, 67, 64, 62, null, 60, 64, 67, null, 65, 64, 60, null, 62, 65, 69, null, 67, 65, 62, null, 59, 62, 67, null, 65, 62, 60, null];
      const dayChords = [[48, 55, 59], [45, 52, 55], [41, 48, 52], [43, 50, 55]];
      function animateDayMusicAndTraffic() {
        if (!audioContext || audioContext.state !== "running") return;
        const now = audioContext.currentTime, open = signalPhase !== "walk";
        if (lastTrafficAudioOpen !== open || lastTrafficAudioSunny !== isSunny) {
          const wasOpen = lastTrafficAudioOpen;
          lastTrafficAudioOpen = open;
          lastTrafficAudioSunny = isSunny;
          for (const gain of [carAudioGain.gain, cityBedGain.gain]) {
            if (gain.cancelAndHoldAtTime) gain.cancelAndHoldAtTime(now);
            else {
              gain.cancelScheduledValues(now);
              gain.setValueAtTime(gain.value, now);
            }
          }
          if (open) {
            carAudioGain.gain.linearRampToValueAtTime(isSunny ? 0.24 : 1, now + 0.2);
            cityBedGain.gain.linearRampToValueAtTime(isSunny ? 4e-3 : 0.07, now + 0.2);
            if (!wasOpen) nextCar = now + 0.45;
          } else {
            carAudioGain.gain.linearRampToValueAtTime(0, now + 0.12);
            cityBedGain.gain.linearRampToValueAtTime(0, now + 0.12);
            for (const source of activePasses) {
              try {
                source.stop(now + 0.15);
              } catch (_) {
              }
            }
          }
        }
        if (isSunny && musicGain) {
          if (nextMusicNote < now - 0.4) nextMusicNote = now + 0.08;
          while (nextMusicNote < now + 0.22) {
            const step = musicStep % dayMelody.length, note = dayMelody[step];
            if (note !== null) musicVoice(note, nextMusicNote, 5.8, 0.03);
            if (step % 8 === 0) {
              for (const n of dayChords[Math.floor(step / 8) % 4]) musicVoice(n, nextMusicNote, 13.2, 8e-3, true);
            }
            nextMusicNote += 1.6;
            musicStep++;
          }
        }
      }
      function playPigeonSound(start) {
        if (!audioContext) return;
        const ctx = audioContext;
        for (const [offset, duration, pitch2, volume] of [[0, 0.19, 440, 0.08], [0.24, 0.28, 385, 0.095], [0.6, 0.31, 350, 0.072]]) {
          const at = start + offset, voice = ctx.createOscillator(), gain = ctx.createGain(), filter = ctx.createBiquadFilter();
          voice.setPeriodicWave(ctx.createPeriodicWave(new Float32Array(5), new Float32Array([0, 1, 0.48, 0.22, 0.085])));
          voice.frequency.setValueAtTime(pitch2 * 0.9, at);
          voice.frequency.exponentialRampToValueAtTime(pitch2, at + duration * 0.22);
          voice.frequency.exponentialRampToValueAtTime(pitch2 * 0.88, at + duration);
          filter.type = "lowpass";
          filter.frequency.value = 2400;
          filter.Q.value = 0.55;
          gain.gain.setValueAtTime(1e-4, at);
          gain.gain.exponentialRampToValueAtTime(volume, at + 0.035);
          gain.gain.exponentialRampToValueAtTime(volume * 0.7, at + duration * 0.5);
          gain.gain.exponentialRampToValueAtTime(1e-4, at + duration);
          voice.connect(filter);
          filter.connect(gain);
          gain.connect(audioMaster);
          voice.start(at);
          voice.stop(at + duration + 0.025);
          voice.onended = () => {
            voice.disconnect();
            filter.disconnect();
            gain.disconnect();
          };
        }
      }
      const weatherStyle = document.createElement("style");
      weatherStyle.textContent = '\nbody{transition:background 1s ease;background:radial-gradient(ellipse at 50% 43%,#384153 0%,#17263b 65%,#101c2e 100%)}\nbody[data-weather="sunny"]{background:radial-gradient(ellipse at 50% 40%,#f8f0d8 0%,#d7e8e8 56%,#a9cbd8 100%)}\n.weather-switch{position:fixed;right:24px;top:22px;z-index:3;display:flex;gap:4px;padding:5px;border:1px solid rgba(196,213,210,0.1490);border-radius:30px;background:rgba(20,35,54,0.5020);backdrop-filter:blur(14px);box-shadow:0 5px 20px rgba(9,20,35,0.0706);transition:background .8s,border-color .8s}\n.weather-switch button{display:grid;align-items:center;justify-items:center;width:39px;height:39px;padding:9px;border:0;border-radius:50%;background:transparent;color:#8ca4b0;cursor:pointer;transition:background .3s,color .3s,transform .2s}.weather-switch button:hover{transform:translateY(-1px);color:#f9e4b8}.weather-switch button[aria-pressed="true"]{background:rgba(197,222,220,0.1412);color:#dbece3}.weather-switch svg{width:21px;height:21px;pointer-events:none}.weather-switch button:focus{outline:2px solid #d3b371;outline-offset:3px}\nbody[data-weather="sunny"] .weather-switch{background:rgba(255,249,231,0.6588);border-color:rgba(122,155,155,0.1882)}body[data-weather="sunny"] .weather-switch button{color:#7e9da4}body[data-weather="sunny"] .weather-switch button[aria-pressed="true"]{background:rgba(230,197,127,0.2824);color:#ac8037}\n@media(max-width:520px){.weather-switch{top:14px;right:14px;padding:4px}.weather-switch button{width:36px;height:36px;padding:8px}}\n';
      window.streetAppendStyle(weatherStyle, "snow");
      const weatherButtons = document.createElement("div");
      weatherButtons.className = "weather-switch";
      weatherButtons.setAttribute("role", "group");
      weatherButtons.setAttribute("aria-label", "\u5207\u6362\u5929\u6C14");
      weatherButtons.innerHTML = '<button type="button" data-mode="rain" aria-label="\u96E8\u591C" title="\u96E8\u591C" aria-pressed="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8C10 6.5 5.3 11 5.3 15.1a6.7 6.7 0 0 0 13.4 0C18.7 11 14 6.5 12 2.8Z"/><path d="M8.4 15.5a3.7 3.7 0 0 0 3.5 3.3"/></svg></button><button type="button" data-mode="sunny" aria-label="\u6674\u5929" title="\u6674\u5929" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg></button>';
      sceneHost.appendChild(weatherButtons);
      function setWeather(sunny) {
        isSunny = sunny;
        sceneHost.dataset.weather = sunny ? "sunny" : "rain";
        weatherButtons.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === "sunny" === sunny)));
        rain.visible = !sunny;
        [...drips, ...trails, ...rings].forEach((d) => d.o.visible = !sunny);
        puddles.forEach((o) => o.visible = !sunny);
        wetGlows.forEach((o) => o.visible = !sunny);
        world.children.filter((o) => o.name === "traffic-light-reflection").forEach((o) => o.visible = true);
        serviceSpill.visible = !sunny;
        bikeReflection.visible = !sunny && bikeLightOn;
        carReflections.forEach((o) => o.visible = !sunny && carLightsOn);
        interactionRipples.forEach((r) => r.meshes.forEach((o) => o.visible = !sunny));
        weatherLabels.forEach((o) => {
          o.material.map = o.userData.weatherMaps[sunny ? 1 : 0];
          o.userData.text = o.userData.weatherTexts[sunny ? 1 : 0];
          o.material.needsUpdate = true;
        });
        vendingCans.forEach((can) => can.material.color.setHex(vendingPalette()[can.userData.slot]));
        drink.material.color.setHex(vendingPalette()[selectedCan]);
        umbrellaRack.visible = !sunny;
        sunnyFlowerRack.visible = sunny;
        cat.visible = !sunny;
        pigeon.visible = sunny;
        chimeSun.visible = sunny;
        chimeRain.visible = !sunny;
        street.material.map = sunny ? dryAsphalt : wetAsphalt;
        street.material.roughness = sunny ? 0.94 : 0.24;
        street.material.metalness = sunny ? 0.035 : 0.48;
        street.material.color.copy(sunny ? new THREE.Color(12963802) : wetRoadColor);
        street.material.needsUpdate = true;
        if (audioContext) {
          rainBedGain == null ? void 0 : rainBedGain.gain.setTargetAtTime(sunny ? 1e-4 : 0.018, audioContext.currentTime, 0.3);
          rainSwellGain == null ? void 0 : rainSwellGain.gain.setTargetAtTime(sunny ? 0 : 3e-3, audioContext.currentTime, 0.3);
          musicGain == null ? void 0 : musicGain.gain.setTargetAtTime(sunny ? 0.5 : 0, audioContext.currentTime, 0.65);
          nextMusicNote = audioContext.currentTime + 0.2;
          nextRainTap = audioContext.currentTime + 0.8;
          nextBird = audioContext.currentTime + 3;
        }
      }
      weatherButtons.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button) return;
        ensureAudio();
        setWeather(button.dataset.mode);
      });
      function animateWeather(t, dt) {
        animateDayMusicAndTraffic();
        weatherBlend = THREE.MathUtils.damp(weatherBlend, isSunny ? 1 : 0, 3.3, dt);
        const mix = weatherBlend;
        hemisphere.color.copy(new THREE.Color(15258806)).lerp(new THREE.Color(13429229), mix);
        hemisphere.groundColor.copy(new THREE.Color(3748936)).lerp(new THREE.Color(13089173), mix);
        hemisphere.intensity = 1.12 + mix * 1.05;
        moon.color.copy(new THREE.Color(11910868)).lerp(new THREE.Color(16770996), mix);
        moon.intensity = 1.12 + mix * 1.5;
        moon.position.set(-3 - mix * 1.5, 10, 5 - mix * 7);
        renderer.toneMappingExposure = 1.12 - mix * 0.09;
        shopLights.forEach((o, i) => o.intensity = o.userData.nightPower * (1 - mix * (i === 0 ? 0.77 : 1)));
        nightEmissives.forEach(({ m, power }) => m.emissiveIntensity = power * (1 - mix * 0.94));
        serviceLight.intensity = staffAmount * 3.4 * (1 - mix * 0.9);
        const age = t - pigeonReact, active = age >= 0 && age < 2.8, envelope = active ? Math.sin(Math.PI * age / 2.8) : 0;
        for (const wing of pigeonWings) wing.rotation.z = wing.userData.side * (0.1 + envelope * (0.68 + 0.65 * Math.sin(age * 17)));
        pigeon.position.y = 3.075 + envelope * Math.max(0, Math.sin(age * 17)) * 0.035;
        pigeonHead.rotation.y = Math.sin(t * 0.65) * 0.13 + envelope * 0.22;
        pigeonHead.rotation.x = Math.sin(t * 1.6) * 0.025;
        pigeon.scale.y = 0.75 * (1 + Math.sin(t * 2.2) * 5e-3);
        if (isSunny && audioContext && audioContext.state === "running" && audioContext.currentTime > nextBird) {
          const n = audioContext.currentTime + 0.02;
          tone(1800, n, 0.1, 8e-3);
          tone(2400, n + 0.14, 0.15, 6e-3);
          nextBird = n + 8 + Math.random() * 8;
        }
      }
      setWeather(false);
      const cookStove = new THREE.Group();
      cookStove.position.set(-2.4, 0.694, -3.23);
      cookStove.name = "pickup-window-cookstove";
      world.add(cookStove);
      box(0, 0.385, 0, 0.82, 0.77, 0.64, 11975077, true, 0, cookStove);
      box(0, 0.79, 0, 0.87, 0.055, 0.69, 14933187, true, 0, cookStove);
      box(0, 0.51, 0.329, 0.59, 0.4, 0.016, 8296080, true, 0, cookStove);
      box(0, 0.68, 0.35, 0.28, 0.023, 0.022, 11844003, true, 0, cookStove);
      for (const x of [-0.24, 0.24]) {
        const dial = cyl(x, 0.745, 0.351, 0.039, 0.025, 4677220, 12, cookStove);
        dial.rotation.x = Math.PI / 2;
      }
      const burner = new THREE.Mesh(new THREE.TorusGeometry(0.174, 0.015, 7, 32), mat(12160598, 0.6));
      burner.rotation.x = -Math.PI / 2;
      burner.position.y = 0.834;
      cookStove.add(burner);
      for (const a of [0, Math.PI / 2]) {
        const grate = box(0, 0.849, 0, 0.43, 0.018, 0.024, 4216411, true, 0, cookStove);
        grate.rotation.y = a;
      }
      const cookPot = new THREE.Group();
      cookPot.position.set(-2.4, 1.558, -3.23);
      cookPot.name = "simmering-vegetable-pot";
      world.add(cookPot);
      const cookProfile = [[0, 0], [0.174, 0], [0.202, 0.03], [0.202, 0.229], [0.19, 0.25], [0.174, 0.235], [0.174, 0.035], [0, 0.035]].map((p) => new THREE.Vector2(...p));
      const vessel = new THREE.Mesh(new THREE.LatheGeometry(cookProfile, 32), mat(7112072));
      vessel.castShadow = true;
      cookPot.add(vessel);
      const potRim = new THREE.Mesh(new THREE.TorusGeometry(0.188, 0.012, 8, 32), mat(12108726));
      potRim.rotation.x = Math.PI / 2;
      potRim.position.y = 0.242;
      cookPot.add(potRim);
      for (const x of [-0.245, 0.245]) box(x, 0.17, 0, 0.1, 0.045, 0.065, 4545885, true, 0, cookPot);
      const cookFood = new THREE.Group();
      cookFood.position.y = 0.205;
      cookPot.add(cookFood);
      const broth = new THREE.Mesh(new THREE.CircleGeometry(0.172, 32), mat(13210953));
      broth.rotation.x = -Math.PI / 2;
      cookFood.add(broth);
      for (let i = 0; i < 10; i++) {
        const a = i * 2.399, r = 0.04 + i % 3 * 0.035, food = birdBall(Math.cos(a) * r, 0.013, Math.sin(a) * r, 0.03, 0.017, 0.025, [13995096, 9284212, 15258775][i % 3], cookFood);
        food.rotation.y = a;
      }
      const cookingBubbles = [];
      for (let i = 0; i < 5; i++) {
        const bubble = birdBall(Math.cos(i * 2.4) * 0.1, 8e-3, Math.sin(i * 2.4) * 0.1, 0.013, 9e-3, 0.013, 15058826, cookFood);
        cookingBubbles.push(bubble);
      }
      const cookLid = new THREE.Group();
      cookLid.position.set(-0.207, 0.255, 0);
      cookPot.add(cookLid);
      const lid = cyl(0.207, 8e-3, 0, 0.211, 0.038, 8559255, 32, cookLid);
      const lidCap = birdBall(0.207, 0.027, 0, 0.198, 0.046, 0.198, 9676704, cookLid);
      cyl(0.207, 0.081, 0, 0.037, 0.046, 4545885, 12, cookLid);
      let cookLidTarget = 0, cookLidAmount = 0;
      const cookSteam = [];
      for (let i = 0; i < 4; i++) {
        const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: vaporTexture, transparent: true, opacity: 0, depthWrite: false }));
        world.add(p);
        cookSteam.push(p);
      }
      cookPot.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "cookpot";
          interactionTargets.push(o);
        }
      });
      hitBox("cookpot", 0, 0.22, 0, 0.53, 0.45, 0.53, cookPot);
      function animateCookpot(t, dt) {
        cookLidAmount = THREE.MathUtils.damp(cookLidAmount, cookLidTarget, 5, dt);
        const jiggleAge = t - cookJiggleAt;
        const jiggle = jiggleAge >= 0 && jiggleAge < 0.65 ? Math.sin(jiggleAge * 29) * Math.exp(-jiggleAge * 6) * 0.045 : 0;
        cookLid.rotation.x = 0;
        cookLid.rotation.z = cookLidAmount * 1.75 + jiggle;
        cookingBubbles.forEach((o, i) => {
          const a = (t * 0.65 + i * 0.23) % 1;
          const size = 0.4 + Math.sin(a * Math.PI) * 0.65;
          o.scale.set(0.013 * size, 9e-3 * size, 0.013 * size);
          o.position.y = 9e-3 + Math.sin(a * Math.PI) * 0.015;
        });
        cookSteam.forEach((o, i) => {
          const a = (t * 0.36 + i * 0.25) % 1;
          o.position.set(-2.4 + Math.sin(a * 6 + i) * 0.045, 1.82 + a * 0.58, -3.23 + Math.cos(a * 5 + i) * 0.04);
          o.scale.setScalar(0.05 + a * 0.18);
          o.material.opacity = Math.sin(a * Math.PI) * 0.2 * cookLidAmount;
        });
      }
      const dog = new THREE.Group();
      dog.position.set(-0.2, 0.524, -5.05);
      dog.rotation.y = Math.PI / 2;
      dog.name = "sleeping-alley-dog";
      world.add(dog);
      birdBall(0, 0.17, -0.07, 0.27, 0.15, 0.4, 13280379, dog);
      birdBall(0, 0.13, 0.25, 0.19, 0.09, 0.23, 15059879, dog);
      for (const x of [-0.13, 0.13]) birdBall(x, 0.045, 0.39, 0.07, 0.04, 0.17, 15325112, dog);
      const dogHead = new THREE.Group();
      dogHead.position.set(0, 0.23, 0.29);
      dog.add(dogHead);
      birdBall(0, 0, 0, 0.17, 0.15, 0.17, 14268561, dogHead);
      birdBall(0, -0.065, 0.14, 0.11, 0.07, 0.11, 15785924, dogHead);
      birdBall(0, -0.035, 0.23, 0.044, 0.029, 0.024, 4477003, dogHead);
      for (const side of [-1, 1]) {
        const ear = birdBall(side * 0.15, -0.04, -0.025, 0.06, 0.13, 0.1, 10057304, dogHead);
        ear.rotation.z = side * 0.18;
        line([[side * 0.062, 0.018, 0.151], [side * 0.095, 0.012, 0.142], [side * 0.12, 0.02, 0.12]], 5131842, 1, dogHead);
      }
      const dogEyes = [];
      for (const side of [-1, 1]) {
        const eye = birdBall(side * 0.085, 0.018, 0.147, 0.017, 0.02, 0.01, 3688256, dogHead);
        eye.visible = false;
        dogEyes.push(eye);
      }
      const dogTail = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.045, 8, 20, Math.PI * 1.4), mat(11635559));
      dogTail.rotation.x = Math.PI / 2;
      dogTail.position.set(0.16, 0.12, -0.39);
      dog.add(dogTail);
      hitBox("dog", 0, 0.17, 0, 0.65, 0.42, 1.1, dog);
      const preparingNote = plaque(-2.4, 1.91, -4.075, 0.52, 0.26, "\u6E96\u5099\u4E2D", "#f3e5c4", "#637e6e", 80);
      preparingNote.rotation.y = Math.PI;
      preparingNote.material.transparent = true;
      preparingNote.visible = false;
      preparingNote.userData.action = "takeout";
      interactionTargets.push(preparingNote);
      const moreStyle = document.createElement("style");
      moreStyle.textContent = '\nbody[data-weather="sunny"]{background:radial-gradient(ellipse at 50% 35%,#e5f0dd 0%,#9ad4ee 48%,#66b1da 100%)}body[data-weather="dusk"]{background:radial-gradient(ellipse at 23% 60%,#fbd6a2 0%,#d8a8a1 45%,#8f91ad 100%)}\n.scene-clock{position:fixed;left:25px;top:23px;padding:9px 14px;border:1px solid rgba(196,213,210,0.1490);border-radius:12px;background:rgba(20,35,54,0.4196);backdrop-filter:blur(12px);z-index:3;color:rgba(208,219,209,0.7020);font:13px/1.6 Georgia,\'Yu Mincho\',\'Microsoft YaHei\',serif;letter-spacing:.09em;pointer-events:none;font-variant-numeric:tabular-nums}body[data-weather="sunny"] .scene-clock{color:rgba(82,110,115,0.7882);background:rgba(255,248,227,0.6000);border-color:rgba(120,152,155,0.1882)}body[data-weather="dusk"] .scene-clock{color:rgba(108,85,92,0.7686);background:rgba(252,230,198,0.5059);border-color:rgba(120,92,105,0.1490)}\nbody[data-weather="dusk"] .weather-switch{background:rgba(251,226,191,0.5333);border-color:rgba(120,92,105,0.1882)}body[data-weather="dusk"] .weather-switch button{color:#8c737b}body[data-weather="dusk"] .weather-switch button[aria-pressed="true"]{color:#976b3c;background:rgba(232,191,129,0.2392)}\n.personal-label{display:block;margin:22px 0 8px;color:#7c8e7e;font-size:14px}.personal-message{display:block;box-sizing:border-box;width:100%;resize:vertical;border:1px solid #d9ccb0;border-radius:2px;background:rgba(255,248,232,0.3608);color:#756d5b;padding:12px 14px;font:14px/1.9 Georgia,\'Songti SC\',SimSun,serif;outline:none}.personal-message:focus{border-color:#9cab94}.personal-message::placeholder{color:#b3a88d}\n.photo-button{position:fixed;right:25px;bottom:23px;z-index:3;width:45px;height:45px;border-radius:50%;border:1px solid rgba(196,213,210,0.1490);background:rgba(20,35,54,0.5020);color:#d4e2d8;display:grid;align-items:center;justify-items:center;cursor:pointer;backdrop-filter:blur(12px);transition:transform .2s,background .4s}.photo-button:hover{transform:translateY(-2px)}.photo-button svg{width:22px;height:22px}.photo-button:focus{outline:2px solid #d3b371;outline-offset:3px}body[data-weather="sunny"] .photo-button,body[data-weather="dusk"] .photo-button{background:rgba(255,246,223,0.6000);color:#7b8270;border-color:rgba(139,157,139,0.2000)}.photo-button[data-done="true"]{background:#a1b99f;color:#fff8de}\n@media(max-width:520px){.scene-clock{left:14px;top:18px;padding:7px 10px;font-size:10px;letter-spacing:.015em;max-width:calc(calc(var(--street-vw) * 100) - 160px)}.photo-button{right:15px;bottom:16px;width:40px;height:40px}.weather-switch button{width:32px;height:34px}}\n';
      window.streetAppendStyle(moreStyle, "snow");
      const duskButton = document.createElement("button");
      duskButton.type = "button";
      duskButton.dataset.mode = "dusk";
      duskButton.setAttribute("aria-label", "\u96E8\u540E\u9EC4\u660F");
      duskButton.setAttribute("title", "\u96E8\u540E\u9EC4\u660F");
      duskButton.setAttribute("aria-pressed", "false");
      duskButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 16h18M5 20h14M7 16a5 5 0 0 1 10 0M12 3v3M4 8l2 2m14-2-2 2"/></svg>';
      weatherButtons.appendChild(duskButton);
      let clockIs12 = false;
      const clockSignMaps = [sideSign.material.map, texture(512, 512, (c, W, H) => {
        c.fillStyle = "#e8e2bf";
        c.fillRect(0, 0, W, H);
        c.fillStyle = "#388d80";
        c.font = "700 175px sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("12 H", W / 2, H / 2);
      })];
      sideSign.userData.action = "clockMode";
      interactionTargets.push(sideSign);
      hitBox("clockMode", -4.79, 2.71, -0.32, 0.18, 0.82, 0.83);
      function setClockMode(value) {
        clockIs12 = !!value;
        sideSign.material.map = clockSignMaps[clockIs12 ? 1 : 0];
        sideSign.material.needsUpdate = true;
        sideSign.userData.text = clockIs12 ? "12 H" : "24 H";
        updateClock();
      }
      const clock = document.createElement("time");
      clock.className = "scene-clock";
      clock.setAttribute("aria-label", "\u5F53\u524D\u65E5\u671F\u548C\u65F6\u95F4");
      sceneHost.appendChild(clock);
      function updateClock() {
        const d = /* @__PURE__ */ new Date(), pad = (n) => String(n).padStart(2, "0");
        clock.textContent = "".concat(d.getFullYear(), "\u5E74").concat(pad(d.getMonth() + 1), "\u6708").concat(pad(d.getDate()), "\u65E5 ").concat(clockIs12 ? (d.getHours() < 12 ? "\u4E0A\u5348 " : "\u4E0B\u5348 ") + pad(d.getHours() % 12 || 12) : pad(d.getHours()), ":").concat(pad(d.getMinutes()));
        clock.dateTime = d.toISOString();
      }
      updateClock();
      let clockTimer = setInterval(updateClock, 1e3);
      document.addEventListener("visibilitychange", () => {
        clearInterval(clockTimer);
        if (!document.hidden) clockTimer = setInterval(updateClock, 1e3);
      });
      const personalMessage = letterDialog.querySelector("#personal-message");
      window.bindStreetMessage(personalMessage);
      for (const label2 of weatherLabels) {
        const rainText = label2.userData.weatherTexts[0], text = rainText === "\u590F\u306E\u591C" ? "\u5915\u6620\u3048" : rainText === "\u8857\u89D2\u4FBF\u308A" ? "\u5915\u66AE\u308C\u4FBF\u308A" : "\u3072\u3068\u4F11\u307F";
        const g = label2.geometry.parameters, temp = plaque(0, 0, 0, g.width, g.height, text, "#d7c2a0", "#657a71", 80);
        world.remove(temp);
        temp.geometry.dispose();
        temp.material.dispose();
        label2.userData.weatherTexts[2] = text;
        label2.userData.weatherMaps[2] = temp.material.map;
      }
      const roofMistTexture = texture(128, 128, (c, W, H) => {
        const g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
        g.addColorStop(0, "rgba(255,255,251,.95)");
        g.addColorStop(0.38, "rgba(255,255,251,.60)");
        g.addColorStop(1, "rgba(255,255,251,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      let smokeBurstAt = -100;
      const roofMist = [];
      for (let i = 0; i < 28; i++) {
        const o = new THREE.Sprite(new THREE.SpriteMaterial({ map: roofMistTexture, transparent: true, opacity: 0, depthWrite: false, color: 16119021 }));
        o.name = i < 8 ? "ambient-rooftop-mist" : "clicked-rooftop-mist";
        world.add(o);
        roofMist.push(o);
      }
      roofExhaust.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "exhaust";
          interactionTargets.push(o);
        }
      });
      hitBox("exhaust", -2.85, 4.24, -2.62, 1.36, 0.74, 0.94);
      function animateRoofMist(t) {
        roofMist.forEach((o, i) => {
          const burst = i >= 8, j = burst ? i - 8 : i, age = burst ? (t - smokeBurstAt - j * 0.055) / 3.1 : (t % 7.6 - j % 4 * 0.42) / 3.8;
          const active = age >= 0 && age < 1;
          o.visible = active;
          if (active) {
            o.position.set((j % 2 ? -3.14 : -2.56) + age * (burst ? 0.3 : 0.2) + Math.sin(age * 4 + j) * 0.04, 4.48 + age * (burst ? 1.35 : 0.95), -2.62 - Math.sin(age * 3 + j) * 0.1);
            o.scale.setScalar((burst ? 0.16 : 0.12) + age * (burst ? 0.8 : 0.54));
            o.material.opacity = Math.sin(age * Math.PI) * (burst ? 0.4 : isSunny ? 0.23 : 0.28);
            o.material.rotation = Math.sin(t * 0.5 + j) * 0.18;
          }
        });
      }
      for (const u of umbrellas) {
        u.traverse((o) => {
          if (o.isMesh) {
            o.userData.action = "umbrella";
            o.userData.umbrella = u;
            interactionTargets.push(o);
          }
        });
        const hit = hitBox("umbrella", 0.07 + u.userData.index * 0.16, 1.1, 1.8, 0.14, 0.86, 0.15, u);
        hit.userData.umbrella = u;
      }
      const pinwheelStand = new THREE.Group();
      pinwheelStand.name = "twilight-paper-pinwheels";
      world.add(pinwheelStand);
      box(0.345, 0.575, 1.05, 0.92, 0.1, 0.28, 10193004, true, 0, pinwheelStand);
      box(0.345, 0.63, 1.05, 0.83, 0.015, 0.2, 7241836, false, 0, pinwheelStand);
      const pinwheels = [];
      for (let i = 0; i < 3; i++) {
        const g = new THREE.Group();
        g.position.set(0.05 + i * 0.295, 1.17, 1.05);
        g.userData.boostAt = -100;
        g.userData.gustAt = -100;
        g.userData.nextGust = performance.now() / 1e3 + 2 + i * 2;
        g.userData.speed = 0;
        g.name = "clickable-paper-pinwheel";
        pinwheelStand.add(g);
        rod([0, -0.54, 0], [0, 0, 0], 0.01, 11246972, g);
        const rotor = new THREE.Group();
        g.add(rotor);
        g.userData.rotor = rotor;
        for (let j = 0; j < 4; j++) {
          const blade = new THREE.Shape();
          blade.moveTo(0.012, 0.012);
          blade.lineTo(0.024, 0.14);
          blade.quadraticCurveTo(0.11, 0.15, 0.135, 0.06);
          blade.lineTo(0.043, 0.035);
          blade.closePath();
          const mesh = new THREE.Mesh(new THREE.ShapeGeometry(blade), new THREE.MeshToonMaterial({ color: [[13938040, 14141856], [12358294, 14727082], [9546400, 13026720]][i][j % 2], gradientMap: gradient, side: THREE.DoubleSide }));
          mesh.rotation.z = j * Math.PI / 2;
          mesh.castShadow = true;
          rotor.add(mesh);
          const fold = line([[0.015, 0.015, 3e-3], [0.115, 0.09, 3e-3]], 9010796, 1, rotor);
          fold.rotation.z = j * Math.PI / 2;
        }
        const hub = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), mat(15324846));
        hub.position.z = 0.014;
        rotor.add(hub);
        pinwheels.push(g);
        g.traverse((o) => {
          if (o.isMesh) {
            o.userData.action = "pinwheel";
            o.userData.pinwheel = g;
            interactionTargets.push(o);
          }
        });
        const hit = hitBox("pinwheel", 0, 0, 0, 0.32, 0.32, 0.12, g);
        hit.userData.pinwheel = g;
      }
      function animateFrontDiscoveries(t, dt) {
        umbrellas.forEach((u) => u.position.y = THREE.MathUtils.damp(u.position.y, u.userData.raised ? 0.46 : 0, 7, dt));
        for (const p of pinwheels) {
          const u = p.userData;
          if (t >= u.nextGust) {
            u.gustAt = t;
            u.gustDuration = 2.4 + Math.random() * 2.1;
            u.gustStrength = 0.8 + Math.random() * 1.4;
            u.nextGust = t + 6 + Math.random() * 8;
          }
          const age = t - u.gustAt, wind = age >= 0 && age < u.gustDuration ? Math.sin(age / u.gustDuration * Math.PI) * u.gustStrength : 0;
          u.speed = THREE.MathUtils.damp(u.speed, wind, 3, dt);
          const burst = Math.pow(Math.max(0, 1 - (t - u.boostAt) / 3.6), 2) * 25;
          u.rotor.rotation.z -= dt * (u.speed + burst);
        }
      }
      const originalSetWeather = setWeather;
      setWeather = function(mode) {
        var _a2;
        const m = typeof mode === "boolean" ? mode ? "sunny" : "rain" : mode;
        weatherMode = m;
        isDusk = m === "dusk";
        originalSetWeather(m === "sunny");
        sceneHost.dataset.weather = m;
        weatherButtons.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
        dog.visible = isDusk;
        pinwheelStand.visible = isDusk;
        sunnyFlowerRack.visible = isSunny;
        if (isDusk) weatherLabels.forEach((o) => {
          o.material.map = o.userData.weatherMaps[2];
          o.userData.text = o.userData.weatherTexts[2];
          o.material.needsUpdate = true;
        });
        if (isDusk) {
          rain.visible = false;
          cat.visible = false;
          pigeon.visible = false;
          chimeRain.visible = true;
          chimeSun.visible = false;
          drips.forEach((d, i) => d.o.visible = i < 2);
          rings.forEach((d) => d.o.visible = false);
          trails.forEach((d) => d.o.visible = false);
          umbrellaRack.visible = false;
          sunnyFlowerRack.visible = false;
          signalPhase = "dusk";
          walkGreen = false;
          pawPrints.forEach((o) => {
            o.visible = false;
            o.material.opacity = 0;
          });
          if (audioContext) {
            rainBedGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.3);
            rainSwellGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.3);
          }
          nextCar = ((_a2 = audioContext == null ? void 0 : audioContext.currentTime) != null ? _a2 : 0) + 4;
        } else {
          enterSignalPhase("walk", performance.now() / 1e3);
        }
        world.children.filter((o) => o.name === "traffic-light-reflection").forEach((o, i) => o.visible = !isDusk || i % 2 === 0);
      };
      function animateDuskTraffic(t, dt) {
        for (const m of trafficMaterials) {
          const u = m.uniforms;
          u.head.value = THREE.MathUtils.euclideanModulo(u.head.value + u.speed.value * dt * 0.55, 1);
          u.alpha.value = 0.65;
          u.motion.value = 0.4;
        }
        for (const lamps of vehicleFaces) {
          lamps[0].material.color.setHex(15961486).multiplyScalar(0.08);
          lamps[1].material.color.setHex(15779961);
          lamps[2].material.color.setHex(8314816).multiplyScalar(0.08);
        }
        for (const pair of pedestrianFaces) {
          pair[0].material.color.setHex(8314816).multiplyScalar(0.08);
          pair[1].material.color.setHex(15961486);
        }
        pawPrints.forEach((o) => {
          o.visible = false;
          o.material.opacity = 0;
        });
      }
      let savedFocusView = null;
      function focusObject(e) {
        if (savedFocusView) {
          const back = savedFocusView;
          savedFocusView = null;
          const shortest = Math.atan2(Math.sin(back.yaw - yaw), Math.cos(back.yaw - yaw));
          focusTween = { start: performance.now() / 1e3, from: target.clone(), to: back.target.clone(), fromDistance: distance, distance: back.distance, fromYaw: yaw, yaw: yaw + shortest, fromPitch: pitch, pitch: back.pitch };
          vy = vp = 0;
          return;
        }
        const hit = pickScene(e), action = hit == null ? void 0 : hit.object.userData.action;
        if (!action || action === "puddle") return;
        const map = { carLights: parkedCar, carDoor: parkedCar, chime, coffee: coffeeCup, cat, pigeon, dog, bike, postbox, letter: postbox, staff: staffHinge, takeout: takeoutGroup, cookpot: cookPot, umbrella: hit == null ? void 0 : hit.object.userData.umbrella, pinwheel: hit == null ? void 0 : hit.object.userData.pinwheel, flower: hit == null ? void 0 : hit.object.userData.flower };
        const object = map[action];
        savedFocusView = { target: target.clone(), distance, yaw, pitch };
        let to = hit.point.clone(), d = 6;
        if (object) {
          const sphere = new THREE.Box3().setFromObject(object).getBoundingSphere(new THREE.Sphere());
          to = sphere.center;
          d = THREE.MathUtils.clamp(sphere.radius * 3.7, 4.5, 10.5);
        }
        focusTween = { start: performance.now() / 1e3, from: target.clone(), to, fromDistance: distance, distance: d, fromYaw: yaw, yaw, fromPitch: pitch, pitch: 0.43 };
        vy = vp = 0;
      }
      function updateFocus(t) {
        if (!focusTween) return;
        const f = focusTween, p = THREE.MathUtils.clamp((t - f.start) / 1.15, 0, 1), k = 1 - Math.pow(1 - p, 3);
        target.lerpVectors(f.from, f.to, k);
        distance = THREE.MathUtils.lerp(f.fromDistance, f.distance, k);
        yaw = THREE.MathUtils.lerp(f.fromYaw, f.yaw, k);
        pitch = THREE.MathUtils.lerp(f.fromPitch, f.pitch, k);
        if (p === 1) focusTween = null;
      }
      function animateDiscoveries(t, dt) {
        animateEdgeDecorations();
        animateFrontDiscoveries(t, dt);
        animateAir(t);
        animateRoofMist(t);
        animateCookpot(t, dt);
        pickupHit.visible = takeoutAmount < 0.8;
        if (isSunny) {
          hemisphere.intensity = 2.25;
          hemisphere.color.setHex(14215660);
          hemisphere.groundColor.setHex(13812385);
          moon.intensity = 2.35;
          moon.color.setHex(16769965);
          renderer.toneMappingExposure = 1.02;
        }
        if (isDusk) {
          hemisphere.intensity = 1.12;
          hemisphere.color.setHex(15517111);
          hemisphere.groundColor.setHex(7627379);
          moon.position.set(-9, 3.5, 5);
          moon.color.setHex(16759144);
          moon.intensity = 2.1;
          renderer.toneMappingExposure = 1.06;
          shopLights.forEach((o, i) => o.intensity = o.userData.nightPower * (i < 2 ? 0.68 : 0.48));
          nightEmissives.forEach(({ m, power }) => m.emissiveIntensity = power * 0.7);
        }
        const look = Math.max(0, 1 - (t - frontCuriosity) / 3);
        if (cat.visible) {
          const sleepPhase = t % 29, sleep = sleepPhase > 19 ? Math.sin((sleepPhase - 19) / 10 * Math.PI) : 0;
          catHead.rotation.x += sleep * 0.34 - look * 0.12;
          catHead.rotation.z += sleep * 0.13;
          catHead.rotation.y += look * 0.4;
          if (sleep > 0.4) catEyes.forEach((o) => o.scale.y = 4e-3);
        }
        if (pigeon.visible) {
          const phase = t % 27, preen = phase > 20 ? Math.sin((phase - 20) / 7 * Math.PI) : 0;
          pigeonHead.rotation.x += preen * 0.7 + look * 0.12;
          pigeonHead.rotation.y -= preen * 0.7 + look * 0.35;
        }
        const a = t - dogCuriosity, e = a >= 0 && a < 3.5 ? Math.sin(a / 3.5 * Math.PI) : 0;
        dogEyes.forEach((o) => o.visible = e > 0.1);
        dogHead.rotation.x = -e * 0.38;
        dogHead.rotation.y = -e * 0.3;
        dog.scale.y = 1 + Math.sin(t * 1.6) * 9e-3;
        dogTail.rotation.z = e * Math.sin(a * 5) * 0.12;
      }
      const photoButton = document.createElement("button");
      photoButton.className = "photo-button";
      photoButton.type = "button";
      photoButton.setAttribute("aria-label", "\u4FDD\u5B58\u7EAA\u5FF5\u660E\u4FE1\u7247");
      photoButton.title = "\u4FDD\u5B58\u7EAA\u5FF5\u660E\u4FE1\u7247";
      photoButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M8 6l1.5-2h5L16 6h4v14H4V6Z"/><circle cx="12" cy="12.8" r="4"/></svg>';
      sceneHost.appendChild(photoButton);
      async function createPostcard() {
        renderer.render(scene, camera);
        const cv = document.createElement("canvas"), W = 1800, margin = 44, imageW = W - margin * 2, imageH = Math.round(imageW * window.sceneViewport.height / window.sceneViewport.width);
        cv.width = W;
        cv.height = imageH + margin + 145;
        const c = cv.getContext("2d");
        c.fillStyle = "#f6efdf";
        c.fillRect(0, 0, cv.width, cv.height);
        const colors = weatherMode === "sunny" ? ["#e5f0dd", "#9ad4ee", "#66b1da"] : isDusk ? ["#fbd6a2", "#d8a8a1", "#8f91ad"] : ["#384153", "#17263b", "#101c2e"];
        const g = c.createRadialGradient(W * 0.5, imageH * 0.4, 0, W * 0.5, imageH * 0.4, W * 0.7);
        g.addColorStop(0, colors[0]);
        g.addColorStop(0.6, colors[1]);
        g.addColorStop(1, colors[2]);
        c.fillStyle = g;
        c.fillRect(margin, margin, imageW, imageH);
        paintClouds(cloudCanvas.getContext("2d"), cloudCanvas.width, cloudCanvas.height, performance.now() / 1e3);
        c.drawImage(cloudCanvas, margin, margin, imageW, imageH);
        c.drawImage(renderer.domElement, margin, margin, imageW, imageH);
        c.fillStyle = "#899486";
        c.font = '24px Georgia,"Microsoft YaHei",serif';
        c.textAlign = "right";
        c.fillText(isCyberEdition ? "\u96EA\u4E61\u5C0F\u4ED3\u4E70 \xB7 2026\xB710" : "\u661F\u6708\u901A\u308A \xB7 2026\xB710", W - margin, cv.height - 45);
        c.textAlign = "left";
        c.font = '18px Georgia,"Microsoft YaHei",serif';
        c.fillStyle = "#aa9c85";
        c.fillText({ rain: "\u96E8\u591C", sunny: "\u6674\u663C", dusk: "\u9EC4\u660F", snow: "\u96EA\u4E61\u665A\u706F" }[weatherMode], margin, cv.height - 45);
        drawScenePostmark(c, W - 94, cv.height - 102, weatherMode);
        return new Promise((resolve) => cv.toBlob(resolve, "image/png"));
      }
      const postcardStyle = document.createElement("style");
      postcardStyle.textContent = '\n.postcard-preview{border:1px solid #d0c4a9;border-radius:18px;padding:20px;background:#f5efdf;color:#625e51;box-shadow:0 24px 90px rgba(0,0,0,0.4000);width:880px;max-width:calc(calc(var(--street-vw) * 100) - 48px);max-height:calc(calc(var(--street-vh) * 100) - 48px);box-sizing:border-box;overflow:auto;font:14px/1.5 Georgia,\'Microsoft YaHei\',serif}\n.postcard-preview::backdrop{background:rgba(11,23,42,0.7686);backdrop-filter:blur(5px)}\n.postcard-preview h2{margin:0 0 12px;font-size:17px;font-weight:400;letter-spacing:.12em}\n.postcard-preview img{display:block;max-width:100%;max-height:calc(calc(var(--street-vh) * 100) - 190px);width:auto;height:auto;margin:0 auto;object-fit:contain;border-radius:3px}\n.postcard-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:16px}\n.postcard-actions button{min-height:44px;padding:8px 18px;border:1px solid rgba(168,157,130,0.2431);border-radius:10px;background:#e4dcc6;color:inherit;font:inherit;cursor:pointer}\n.postcard-actions button:last-child{background:#667c72;color:#fffaf0}\n.postcard-preview[data-cyber="true"]{background:rgba(16,31,48,0.9216);color:#b8e4e7;border-color:rgba(116,207,219,0.4588);box-shadow:0 0 40px rgba(75,159,171,0.1686)}\n.postcard-preview[data-cyber="true"] button{background:#234254;color:#c8f1f3;border-color:rgba(115,180,202,0.3333)}\n';
      window.streetAppendStyle(postcardStyle, "snow");
      const postcardPreview = document.createElement("dialog");
      postcardPreview.className = "postcard-preview";
      postcardPreview.dataset.cyber = String(isCyberEdition);
      postcardPreview.setAttribute("aria-label", "\u660E\u4FE1\u7247\u9884\u89C8");
      const postcardTitle = document.createElement("h2");
      postcardTitle.textContent = "\u660E\u4FE1\u7247\u9884\u89C8";
      postcardPreview.appendChild(postcardTitle);
      const postcardImage = document.createElement("img");
      postcardImage.alt = "\u5F53\u524D\u89D2\u5EA6\u4E0E\u5929\u6C14\u7684\u661F\u6708\u8857\u89D2\u7EAA\u5FF5\u660E\u4FE1\u7247";
      postcardPreview.appendChild(postcardImage);
      const postcardActions = document.createElement("div");
      postcardActions.className = "postcard-actions";
      postcardPreview.appendChild(postcardActions);
      const postcardBack = document.createElement("button");
      postcardBack.type = "button";
      postcardBack.textContent = "\u8FD4\u56DE\u8857\u89D2";
      postcardActions.appendChild(postcardBack);
      const postcardDownload = document.createElement("button");
      postcardDownload.type = "button";
      postcardDownload.textContent = "\u4E0B\u8F7D\u660E\u4FE1\u7247";
      postcardActions.appendChild(postcardDownload);
      sceneHost.appendChild(postcardPreview);
      {
        const overlay = document.createElement("div");
        overlay.className = "landscape-letter-backdrop";
        overlay.hidden = true;
        sceneHost.appendChild(overlay);
        overlay.addEventListener("click", closePostcardPreview);
        postcardPreview.showModal = function() {
          this.setAttribute("open", "");
          overlay.hidden = false;
          document.getElementById("street-modes").style.pointerEvents = "none";
        };
        postcardPreview.close = function() {
          this.removeAttribute("open");
          overlay.hidden = true;
          document.getElementById("street-modes").style.pointerEvents = "";
          this.dispatchEvent(new Event("close"));
        };
      }
      let postcardBlob = null, postcardURL = null, postcardFilename = "", postcardCaptureId = 0;
      function releasePostcard() {
        if (postcardURL) URL.revokeObjectURL(postcardURL);
        postcardURL = null;
        postcardBlob = null;
        postcardImage.src = "";
      }
      function closePostcardPreview() {
        postcardCaptureId++;
        if (postcardPreview.open) postcardPreview.close();
        releasePostcard();
      }
      async function previewPostcard() {
        const capture = ++postcardCaptureId, mode = weatherMode;
        photoButton.disabled = true;
        try {
          const blob = await createPostcard();
          if (capture !== postcardCaptureId || mode !== weatherMode) return;
          if (!blob) throw Error("Unable to create postcard");
          releasePostcard();
          postcardBlob = blob;
          postcardURL = URL.createObjectURL(blob);
          postcardFilename = "\u661F\u6708\u901A\u308A-".concat(mode, "-\u660E\u4FE1\u7247.png");
          postcardImage.src = postcardURL;
          postcardPreview.showModal();
          postcardDownload.focus();
        } finally {
          photoButton.disabled = false;
        }
      }
      postcardBack.addEventListener("click", closePostcardPreview);
      postcardPreview.addEventListener("close", () => {
        if (!postcardPreview.open) releasePostcard();
      });
      postcardPreview.addEventListener("click", (e) => {
        if (e.target === postcardPreview) {
          const r = postcardPreview.getBoundingClientRect();
          if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closePostcardPreview();
        }
      });
      postcardDownload.textContent = "\u4FDD\u5B58\u5230\u76F8\u518C";
      postcardDownload.addEventListener("click", async () => {
        if (!postcardBlob || postcardDownload.disabled) return;
        postcardDownload.disabled = true;
        try {
          await window.saveStreetPostcard(postcardBlob);
          postcardDownload.textContent = "\u5DF2\u4FDD\u5B58\u5230\u76F8\u518C";
          photoButton.dataset.done = "true";
          setTimeout(() => {
            postcardDownload.textContent = "\u4FDD\u5B58\u5230\u76F8\u518C";
            delete photoButton.dataset.done;
          }, 1800);
        } catch (e) {
          alert("\u660E\u4FE1\u7247\u672A\u4FDD\u5B58\uFF0C\u8BF7\u5728\u5C0F\u5DE5\u5177\u4E2D\u6388\u6743\u76F8\u518C\u540E\u91CD\u8BD5\u3002");
        } finally {
          postcardDownload.disabled = false;
        }
      });
      photoButton.addEventListener("click", async () => {
        try {
          await previewPostcard();
        } catch (error) {
          console.warn("Postcard preview failed", error);
        }
      });
      setWeather("rain");
      const airLeaves = [];
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, -0.15);
      leafShape.bezierCurveTo(-0.14, -0.06, -0.1, 0.1, 0, 0.17);
      leafShape.bezierCurveTo(0.1, 0.07, 0.12, -0.07, 0, -0.15);
      const leafGeometry = new THREE.ShapeGeometry(leafShape);
      for (let i = 0; i < 5; i++) {
        const g = new THREE.Group();
        g.name = "sunny-drifting-leaf";
        const leaf = new THREE.Mesh(leafGeometry, new THREE.MeshToonMaterial({ color: [11054707, 13086067, 9347451, 11973756, 11188365][i], gradientMap: gradient, side: THREE.DoubleSide, transparent: true, opacity: 0, depthWrite: false }));
        g.add(leaf);
        const vein = line([[0, -0.12, 2e-3], [0, 0.13, 2e-3]], 8227940, 1, g);
        vein.material.depthWrite = false;
        g.scale.setScalar(0.62 + i % 3 * 0.1);
        world.add(g);
        g.visible = false;
        airLeaves.push(g);
      }
      const cloudCanvas = document.createElement("canvas");
      cloudCanvas.setAttribute("aria-hidden", "true");
      Object.assign(cloudCanvas.style, { position: "fixed", top: "0", right: "0", bottom: "0", left: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "0" });
      sceneHost.insertBefore(cloudCanvas, renderer.domElement);
      renderer.domElement.style.position = "relative";
      renderer.domElement.style.zIndex = "1";
      function resizeClouds() {
        cloudCanvas.width = window.sceneViewport.width;
        cloudCanvas.height = window.sceneViewport.height;
      }
      resizeClouds();
      addEventListener("resize", resizeClouds);
      function paintClouds(c, W, H, t) {
        c.clearRect(0, 0, W, H);
        const rgb = weatherMode === "rain" ? "23,32,49" : isDusk ? "240,205,190" : "255,255,249", strength = weatherMode === "rain" ? 0.34 : isDusk ? 0.24 : 0.47;
        const clusters = [[0.16, 0.2, 0.31, 0.07], [0.81, 0.28, 0.28, 0.061], [0.1, 0.7, 0.26, 0.065]];
        c.save();
        c.filter = "blur(11px)";
        for (let j = 0; j < clusters.length; j++) {
          const [cx, cy, w, h] = clusters[j], drift = THREE.MathUtils.euclideanModulo(cx + t * 145e-5 * (j ? 0.75 : 1) + 0.3, 1.6) - 0.3 - cx;
          for (let i = 0; i < 5; i++) {
            c.save();
            c.translate((cx + drift + (i - 2) * w * 0.15) * W, (cy + Math.sin(i * 1.8 + j) * h * 0.2) * H);
            c.scale(w * W * (0.28 + i % 2 * 0.05), h * H * (0.85 + i % 3 * 0.15));
            const gradient2 = c.createRadialGradient(0, 0, 0.1, 0, 0, 1);
            gradient2.addColorStop(0, "rgba(".concat(rgb, ",").concat(strength, ")"));
            gradient2.addColorStop(0.5, "rgba(".concat(rgb, ",").concat(strength * 0.65, ")"));
            gradient2.addColorStop(1, "rgba(".concat(rgb, ",0)"));
            c.fillStyle = gradient2;
            c.beginPath();
            c.arc(0, 0, 1, 0, Math.PI * 2);
            c.fill();
            c.restore();
          }
        }
        c.restore();
      }
      let lastCloudPaint = -100;
      let previousAirTime = null;
      function spawnLeaf(g, t) {
        g.userData.flight = { born: t, life: 11 + Math.random() * 10, nextGust: t + 0.4 + Math.random(), vx: (Math.random() < 0.5 ? -1 : 1) * (0.28 + Math.random() * 0.4), vz: (Math.random() - 0.5) * 0.19, vy: -0.025 - Math.random() * 0.07, spin: new THREE.Vector3((Math.random() - 0.5) * 1.7, (Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 1.6) };
        g.position.set(-5.3 + Math.random() * 10.6, 1.7 + Math.random() * 2.4, 2.95 + Math.random() * 2.3);
      }
      function animateAir(t) {
        const dt = previousAirTime === null ? 0 : Math.min(0.12, Math.max(0, t - previousAirTime));
        previousAirTime = t;
        airLeaves.forEach((g, i) => {
          let f = g.userData.flight;
          if (!f) {
            spawnLeaf(g, t - i * 0.7);
            f = g.userData.flight;
          }
          if (!isSunny) {
            g.visible = false;
            return;
          }
          if (t > f.born + f.life) {
            g.visible = false;
            if (!f.wake) f.wake = t + 2 + Math.random() * 5;
            if (t >= f.wake) spawnLeaf(g, t);
            return;
          }
          g.visible = true;
          if (t >= f.nextGust) {
            f.vx = THREE.MathUtils.clamp(f.vx + (Math.random() - 0.5) * 0.6, -0.65, 0.65);
            f.vz = (Math.random() - 0.5) * 0.35;
            f.vy = (Math.random() - 0.65) * 0.18;
            f.nextGust = t + 0.6 + Math.random() * 1.7;
          }
          g.position.x += dt * (f.vx + Math.sin(t * 1.1 + i) * 0.11);
          g.position.z += dt * (f.vz + Math.sin(t * 0.8 + i) * 0.08);
          g.position.y += dt * (f.vy + Math.sin(t * 1.5 + i) * 0.12);
          if (g.position.x < -5.6 || g.position.x > 5.6) {
            g.position.x = THREE.MathUtils.clamp(g.position.x, -5.6, 5.6);
            f.vx = -f.vx;
          }
          if (g.position.z < 2.85 || g.position.z > 5.5) {
            g.position.z = THREE.MathUtils.clamp(g.position.z, 2.85, 5.5);
            f.vz = -f.vz;
          }
          g.position.y = THREE.MathUtils.clamp(g.position.y, 0.8, 4.6);
          g.rotation.x += f.spin.x * dt;
          g.rotation.y += f.spin.y * dt;
          g.rotation.z += f.spin.z * dt;
          const fade = Math.max(0, Math.min(1, (t - f.born) / 0.8, (f.born + f.life - t) / 1.2));
          g.children[0].material.opacity = 0.76 * fade;
          g.children[1].material.opacity = 0.55 * fade;
        });
        if (t - lastCloudPaint > 0.09) {
          paintClouds(cloudCanvas.getContext("2d"), cloudCanvas.width, cloudCanvas.height, t);
          lastCloudPaint = t;
        }
      }
      let fogSmileAt = -100, lastAtmosphereMode = "", duskArrivalAt = -100, duskSequenceAt = -100, nextDuskSequence = 0, nextFeatherAt = Infinity, featherAt = -100;
      const fogMap = texture(256, 256, () => {
      });
      let fogErasure = -1, fogDrawProgress = 0, lastFogPaint = -100;
      function paintWindowFog(erasure, progress = 0) {
        const c = fogMap.image.getContext("2d"), W = 256, H = 256;
        c.clearRect(0, 0, W, H);
        c.globalCompositeOperation = "source-over";
        const glow2 = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.5);
        for (const [offset, alpha] of [[0, 0.85], [0.2, 0.73], [0.42, 0.4], [0.63, 0.16], [0.82, 0.035], [1, 0]]) glow2.addColorStop(offset, "rgba(211,232,228,".concat(alpha, ")"));
        c.fillStyle = glow2;
        c.fillRect(0, 0, W, H);
        if (erasure > 0) {
          c.save();
          c.globalCompositeOperation = "destination-out";
          c.strokeStyle = "rgba(0,0,0,".concat(erasure, ")");
          c.lineWidth = W * 0.052;
          c.lineCap = "round";
          for (let i = 0; i < 2; i++) {
            const amount = THREE.MathUtils.smoothstep(progress, i ? 0.26 : 0.02, i ? 0.43 : 0.19);
            if (amount <= 0) continue;
            const x = i ? 0.585 : 0.415;
            c.beginPath();
            c.moveTo(W * x, H * 0.385);
            c.lineTo(W * x, H * (0.385 + 0.045 * amount));
            c.stroke();
          }
          const mouth = THREE.MathUtils.smoothstep(progress, 0.5, 1);
          if (mouth > 0) {
            c.beginPath();
            c.arc(W * 0.5, H * 0.49, W * 0.18, 0.12, 0.12 + (Math.PI - 0.24) * mouth);
            c.stroke();
          }
          c.restore();
        }
        fogMap.needsUpdate = true;
        fogErasure = erasure;
        fogDrawProgress = progress;
      }
      paintWindowFog(0);
      const windowFog = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ map: fogMap, transparent: true, opacity: 0, depthWrite: false }));
      windowFog.position.set(-3.25, 2.05, 0.817);
      windowFog.name = "rain-window-breath-fog";
      world.add(windowFog);
      const fogHit = hitBox("fogSmile", -3.25, 2.05, 0.83, 1.45, 1.45, 0.025);
      fogHit.name = "rain-fog-click-area";
      const awningBurst = [];
      for (let i = 0; i < 6; i++) {
        const o = line([[0, 0, 0], [0, -0.1, 0]], 12640220);
        o.name = "occasional-awning-water-drop";
        o.material = o.material.clone();
        o.material.opacity = 0;
        world.add(o);
        awningBurst.push(o);
      }
      const roofBead = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), new THREE.MeshBasicMaterial({ color: 10077134, transparent: true, opacity: 0, depthWrite: false }));
      roofBead.rotation.x = -Math.PI / 2;
      roofBead.position.set(2.55, 3.077, 1.72);
      roofBead.name = "awning-water-bead";
      world.add(roofBead);
      const beamMap = texture(128, 256, (c, W, H) => {
        const g = c.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, "rgba(255,211,136,0)");
        g.addColorStop(0.4, "rgba(255,218,157,.5)");
        g.addColorStop(1, "rgba(255,211,136,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      const sunbeam = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.9), new THREE.MeshBasicMaterial({ map: beamMap, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      sunbeam.rotation.x = -Math.PI / 2;
      sunbeam.rotation.z = -0.22;
      sunbeam.position.set(0.5, 0.709, -1.05);
      sunbeam.name = "last-sunbeam-on-shop-floor";
      world.add(sunbeam);
      const starMap = texture(64, 64, (c, W, H) => {
        const g = c.createRadialGradient(32, 32, 0, 32, 32, 30);
        g.addColorStop(0, "rgba(255,253,225,.9)");
        g.addColorStop(0.25, "rgba(255,245,211,.25)");
        g.addColorStop(1, "rgba(255,245,211,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        c.strokeStyle = "rgba(255,252,222,.7)";
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(32, 8);
        c.lineTo(32, 56);
        c.moveTo(16, 32);
        c.lineTo(48, 32);
        c.stroke();
      });
      const bottleGlints = [];
      for (const x of [-3.92, -1.35, -0.25]) {
        const o = new THREE.Sprite(new THREE.SpriteMaterial({ map: starMap, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
        o.position.set(x + 0.18, 1.61, -3.15);
        o.scale.set(0.095, 0.095, 1);
        o.name = "sunny-bottle-glint";
        world.add(o);
        bottleGlints.push(o);
      }
      const featherShape = new THREE.Shape();
      featherShape.moveTo(0, -0.1);
      featherShape.bezierCurveTo(-0.055, -0.035, -0.04, 0.065, 0, 0.12);
      featherShape.bezierCurveTo(0.04, 0.055, 0.055, -0.02, 0, -0.1);
      const pigeonFeather = new THREE.Group();
      pigeonFeather.name = "pigeon-falling-feather";
      world.add(pigeonFeather);
      const plume = new THREE.Mesh(new THREE.ShapeGeometry(featherShape), new THREE.MeshBasicMaterial({ color: 15920864, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
      pigeonFeather.add(plume);
      const quill = line([[0, -0.12, 1e-3], [0, 0.1, 1e-3]], 12962747, 1, pigeonFeather);
      quill.material = quill.material.clone();
      quill.material.transparent = true;
      const sunsetGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.85), new THREE.MeshBasicMaterial({ map: beamMap, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      sunsetGlass.rotation.y = Math.PI / 2;
      sunsetGlass.position.set(2.318, 2.02, -1.4);
      sunsetGlass.name = "dusk-last-light-in-window";
      world.add(sunsetGlass);
      const duskFixtures = world.children.filter((o) => o.isMesh && o.material.emissiveIntensity > 0 && o.position.y > 3.35 && o.position.y < 3.5 && o.position.z < 0.5 && o.position.z > -3);
      duskFixtures.forEach((o) => {
        o.material = o.material.clone();
        o.userData.atmospherePower = o.material.emissiveIntensity;
      });
      const dogFrontPaws = dog.children.filter((o) => o.isMesh && o.position.y < 0.1 && o.position.z > 0.38);
      dogFrontPaws.forEach((o) => o.userData.restZ = o.position.z);
      function animateWeatherStories(t, dt) {
        if (lastAtmosphereMode !== weatherMode) {
          lastAtmosphereMode = weatherMode;
          fogSmileAt = -100;
          featherAt = -100;
          nextFeatherAt = t + 8 + Math.random() * 10;
          if (isDusk) {
            duskArrivalAt = t;
            nextDuskSequence = t + 35;
            duskSequenceAt = -100;
          }
        }
        const rainy = weatherMode === "rain", sunny = weatherMode === "sunny", dusk = weatherMode === "dusk";
        const smileAge = t - fogSmileAt, drawProgress = THREE.MathUtils.clamp(smileAge / 1.65, 0, 1), erasure = smileAge >= 0 ? 1 - THREE.MathUtils.smoothstep(smileAge, 3.3, 8) : 0;
        windowFog.visible = rainy;
        windowFog.material.opacity = rainy ? 0.48 + Math.sin(t * 0.15) * 0.025 : 0;
        fogHit.visible = rainy;
        if (rainy && (Math.abs(erasure - fogErasure) > 4e-3 || Math.abs(drawProgress - fogDrawProgress) > 5e-3) && t - lastFogPaint > 0.04) {
          paintWindowFog(erasure, drawProgress);
          lastFogPaint = t;
        }
        roofBead.visible = rainy;
        roofBead.material.opacity = rainy ? 0.1 + 0.12 * (t % 19) / 19 : 0;
        roofBead.scale.setScalar(0.35 + 0.65 * (t % 19) / 19);
        awningBurst.forEach((o, i) => {
          const a = t % 19 - 15 - i * 0.1;
          o.visible = rainy && a >= 0 && a < 0.82;
          o.position.set(2.53 + i * 8e-3, 2.96 - a * 2.9, 1.79);
          o.material.opacity = o.visible ? Math.sin(a / 0.82 * Math.PI) * 0.44 : 0;
        });
        sunsetGlass.visible = dusk;
        sunsetGlass.material.opacity = dusk ? 0.07 : 0;
        if (sunny) {
          moon.position.set(-4.5 + Math.sin(t * 9e-3) * 2.4, 10 + Math.sin(t * 7e-3) * 0.5, -2 + Math.sin(t * 6e-3) * 2);
        }
        sunbeam.visible = sunny || dusk;
        sunbeam.material.opacity = dusk ? 0.17 : sunny ? 0.065 : 0;
        sunbeam.position.x = dusk ? 0.72 : 0.48 + Math.sin(t * 9e-3) * 0.2;
        sunbeam.rotation.z = dusk ? -0.22 : -0.22 + Math.sin(t * 9e-3) * 0.06;
        bottleGlints.forEach((o, i) => {
          const a = (t + i * 19) % 67;
          o.visible = sunny && a > 1 && a < 3.5;
          o.material.opacity = o.visible ? Math.sin((a - 1) / 2.5 * Math.PI) * 0.42 : 0;
        });
        if (sunny && t >= nextFeatherAt) {
          if (Math.random() < 0.85) featherAt = t;
          nextFeatherAt = t + 14 + Math.random() * 16;
        }
        const featherAge = t - featherAt;
        pigeonFeather.visible = sunny && featherAge >= 0 && featherAge < 12;
        if (pigeonFeather.visible) {
          const lift = Math.max(0, featherAge - 0.6), flutter = Math.sin(featherAge * 3) * 0.035;
          pigeonFeather.position.set(2.57 + lift * 0.15 + flutter, 3.23 + lift * 0.105 + Math.sin(featherAge * 2.4) * 0.025, 1.84 + lift * 0.18);
          pigeonFeather.rotation.set(-Math.PI / 2 + Math.sin(featherAge * 2) * 0.35, lift * 0.3, flutter * 3 + lift * 0.22);
          plume.material.opacity = quill.material.opacity = Math.min(1, featherAge / 0.4, Math.max(0, (12 - featherAge) / 2)) * 0.85;
        }
        if (!isCyberEdition) {
          duskFixtures.forEach((o, i) => {
            o.material.emissiveIntensity = o.userData.atmospherePower * (dusk ? 0.7 : 1 - weatherBlend * 0.94);
            if (dusk) {
              const first = THREE.MathUtils.smoothstep(t - duskArrivalAt, i * 0.8, i * 0.8 + 1.4), a = t - duskSequenceAt - i * 0.65, wave = a > 0 && a < 2.8 ? Math.sin(a / 2.8 * Math.PI) : 0;
              o.material.emissiveIntensity *= (0.45 + 0.55 * first) * (1 - 0.25 * wave);
            }
          });
        }
        if (dusk) {
          if (t >= nextDuskSequence) {
            duskSequenceAt = t;
            nextDuskSequence = t + 48;
          }
          shopLights.forEach((o, i) => {
            const first = THREE.MathUtils.smoothstep(t - duskArrivalAt, i * 0.55, i * 0.55 + 1.3), a = t - duskSequenceAt - i * 0.55, wave = a > 0 && a < 2.6 ? Math.sin(a / 2.6 * Math.PI) : 0;
            o.intensity *= (0.45 + 0.55 * first) * (1 - 0.22 * wave);
          });
          const age = t - dogCuriosity, stretch = age >= 0 && age < 3.8 ? Math.sin(age / 3.8 * Math.PI) : 0;
          dog.scale.y = 1 + Math.sin(t * 1.6) * 0.012 - stretch * 0.035;
          dog.scale.z = 1 + stretch * 0.065;
          dogHead.position.set(0, 0.23 - stretch * 0.04, 0.29 + stretch * 0.055);
          dogHead.rotation.x += stretch * 0.27;
          dogFrontPaws.forEach((o) => o.position.z = o.userData.restZ + stretch * 0.12);
        } else {
          dog.scale.z = 1;
          dogHead.position.set(0, 0.23, 0.29);
          dogFrontPaws.forEach((o) => o.position.z = o.userData.restZ);
        }
      }
      [windowFog, fogHit, roofBead, ...awningBurst, sunbeam, ...bottleGlints, pigeonFeather, sunsetGlass].forEach((o) => o.visible = false);
      const postcardStampKinds = { rain: "raindrop", sunny: "feather", dusk: "sunset", cyber: "orbital-star" };
      function drawScenePostmark(c, x, y, mode) {
        const color = { rain: "#6e9ba6", sunny: "#aa9b72", dusk: "#bf8e7a", cyber: "#72b8cb" }[mode] || "#7c9ba5";
        c.save();
        c.translate(x, y);
        c.rotate(-0.14);
        c.globalAlpha = 0.72;
        c.strokeStyle = color;
        c.fillStyle = color;
        c.lineWidth = 1.3;
        c.beginPath();
        c.arc(0, 0, 28, 0, Math.PI * 2);
        c.stroke();
        c.beginPath();
        c.arc(0, 0, 24, 0, Math.PI * 2);
        c.stroke();
        if (mode === "rain") {
          c.beginPath();
          c.moveTo(0, -14);
          c.bezierCurveTo(-6, -5, -12, 0, -9, 7);
          c.bezierCurveTo(-5, 17, 10, 14, 10, 5);
          c.bezierCurveTo(10, -1, 4, -7, 0, -14);
          c.stroke();
        } else if (mode === "sunny") {
          c.beginPath();
          c.moveTo(-9, 13);
          c.lineTo(9, -14);
          c.bezierCurveTo(-9, -14, -15, 3, -9, 13);
          c.bezierCurveTo(6, 15, 17, -2, 9, -14);
          c.stroke();
          for (let i = 0; i < 4; i++) {
            c.beginPath();
            c.moveTo(-5 + i * 3, 7 - i * 4);
            c.lineTo(4 + i * 2, 7 - i * 4);
            c.stroke();
          }
        } else if (mode === "dusk") {
          c.beginPath();
          c.arc(0, 2, 11, Math.PI, Math.PI * 2);
          c.stroke();
          for (const y2 of [3, 8, 13]) {
            c.beginPath();
            c.moveTo(-15, y2);
            c.lineTo(15, y2);
            c.stroke();
          }
          for (const a of [-2.6, -1.57, -0.55]) {
            c.beginPath();
            c.moveTo(Math.cos(a) * 15, 2 + Math.sin(a) * 15);
            c.lineTo(Math.cos(a) * 19, 2 + Math.sin(a) * 19);
            c.stroke();
          }
        } else {
          c.save();
          c.rotate(-0.45);
          c.scale(1, 0.44);
          c.beginPath();
          c.arc(0, 0, 18, 0, Math.PI * 2);
          c.stroke();
          c.restore();
          c.beginPath();
          for (let i = 0; i < 8; i++) {
            const a = -Math.PI / 2 + i * Math.PI / 4, r = i % 2 ? 4 : 10;
            if (i) c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            else c.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          c.closePath();
          c.stroke();
          c.beginPath();
          c.arc(16, -7, 2, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
      }
      const originalRestTransforms = [];
      if (!isCyberEdition) world.traverse((o) => originalRestTransforms.push({ o, p: o.position.clone(), q: o.quaternion.clone(), s: o.scale.clone(), visible: o.visible }));
      let originalResetPending = false;
      const originalResetButton = document.createElement("button"), originalResetCurtain = document.createElement("div");
      function restoreOriginalState() {
        const mode = weatherMode, t = performance.now() / 1e3;
        originalRestTransforms.forEach(({ o, p, q, s, visible }) => {
          o.position.copy(p);
          o.quaternion.copy(q);
          o.scale.copy(s);
          o.visible = visible;
        });
        clearTimeout(singleTapTimer);
        pointers.clear();
        gesture = null;
        tapStart = null;
        focusTween = null;
        savedFocusView = null;
        target.set(0, 1.4, 0);
        yaw = 0.65;
        pitch = 0.43;
        distance = 21.7;
        vy = vp = 0;
        doorTarget = doorAmount = staffTarget = staffAmount = carDoorTarget = carDoorAmount = 0;
        carLightsOn = false;
        bikeLightOn = false;
        coffeeFull = false;
        coffeeFill = 0;
        coffeeUntil = 0;
        coffeeStarted = -100;
        bunLidTarget = bunLidAmount = 0;
        refrigeratorLeaves.forEach((leaf) => {
          leaf.userData.open = false;
          leaf.userData.amount = 0;
          leaf.rotation.y = 0;
        });
        wallVentOpen = false;
        wallVentAmount = 0;
        wallVentSlats.forEach((blade) => blade.rotation.z = 0);
        rearBins.forEach((bin) => {
          bin.userData.open = false;
          bin.userData.amount = 0;
          bin.userData.hinge.rotation.x = 0;
        });
        cookLidTarget = cookLidAmount = 0;
        cookJiggleAt = -100;
        takeoutTarget = takeoutAmount = 0;
        windowPending = null;
        takeoutVariant = "bento";
        noteShownAt = -1;
        takeoutClicks = 0;
        letterTarget = letterAmount = 0;
        letterDialog.close();
        closePostcardPreview();
        drinkState = "empty";
        drink.visible = false;
        drinkOpacity(0);
        carSpots.forEach((o) => o.intensity = 0);
        carReflections.forEach((o) => o.visible = false);
        carLenses.forEach((o) => o.material.color.setHex(12303527));
        carRearLenses.forEach((o) => o.material.color.setHex(9131348));
        bikeSpot.intensity = 0;
        lampLens.material.color.setHex(11184524);
        bikeReflection.visible = false;
        flowerPots.forEach((o) => o.userData.swayAt = -100);
        umbrellas.forEach((u) => {
          u.userData.raised = false;
          u.position.y = 0;
        });
        pinwheels.forEach((p) => {
          p.userData.boostAt = p.userData.gustAt = -100;
          p.userData.speed = 0;
          p.userData.nextGust = t + 2 + p.position.x * 2;
        });
        airLeaves.forEach((leaf) => delete leaf.userData.flight);
        interactionRipples.forEach((r) => r.meshes.forEach((o) => {
          world.remove(o);
          o.material.dispose();
        }));
        interactionRipples.length = 0;
        chimeImpulse = smokeBurstAt = catReact = pigeonReact = frontCuriosity = dogCuriosity = -100;
        fogSmileAt = featherAt = -100;
        lastAtmosphereMode = "";
        paintWindowFog(0);
        setClockMode(false);
        enterSignalPhase("walk", t);
        signalManualClicks = 0;
        activePasses.forEach((n) => {
          try {
            n.stop();
          } catch (_) {
          }
        });
        nextCar = (audioContext ? audioContext.currentTime : 0) + 4;
        setWeather(mode);
        weatherBlend = mode === "sunny" ? 1 : 0;
      }
      function resetOriginalScene() {
        if (isCyberEdition || originalResetPending) return;
        originalResetPending = true;
        originalResetButton.disabled = true;
        originalResetCurtain.classList.add("active");
        setTimeout(() => {
          restoreOriginalState();
          originalResetCurtain.classList.remove("active");
        }, 480);
        setTimeout(() => {
          originalResetPending = false;
          originalResetButton.disabled = false;
        }, 1050);
      }
      if (!isCyberEdition) {
        const style = document.createElement("style");
        style.textContent = '.scene-reset{position:fixed;left:25px;bottom:23px;z-index:4;width:45px;height:45px;padding:11px;border-radius:50%;border:1px solid rgba(196,213,210,0.1490);background:rgba(20,35,54,0.5020);color:#d4e2d8;display:grid;align-items:center;justify-items:center;cursor:pointer;backdrop-filter:blur(12px)}.scene-reset svg{width:22px;height:22px}.scene-reset:disabled{opacity:.4}.scene-reset:focus{outline:2px solid #d3b371;outline-offset:3px}body[data-weather="sunny"] .scene-reset,body[data-weather="dusk"] .scene-reset{background:rgba(255,246,223,0.6000);color:#7b8270;border-color:rgba(139,157,139,0.2000)}.scene-reset-curtain{position:fixed;top:0;right:0;bottom:0;left:0;z-index:115;background:#081526;opacity:0;pointer-events:none;transition:opacity .46s ease}.scene-reset-curtain.active{opacity:1;pointer-events:auto}body[data-weather="sunny"] .scene-reset-curtain,body[data-weather="dusk"] .scene-reset-curtain{background:#f2e6d1}@media(max-width:520px){.scene-reset{left:15px;bottom:16px;width:42px;height:42px}}';
        window.streetAppendStyle(style, "snow");
        originalResetButton.className = "scene-reset cyber-reset";
        originalResetButton.type = "button";
        originalResetButton.title = "\u91CD\u7F6E\u8857\u89D2";
        originalResetButton.setAttribute("aria-label", "\u91CD\u7F6E\u8857\u89D2");
        originalResetButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10a8 8 0 1 1 1.5 7M4 4v6h6"/></svg>';
        originalResetCurtain.className = "scene-reset-curtain";
        originalResetCurtain.setAttribute("aria-hidden", "true");
        sceneHost.appendChild(originalResetButton);
        sceneHost.appendChild(originalResetCurtain);
        originalResetButton.addEventListener("click", () => {
          ensureAudio();
          playSound("switch");
          resetOriginalScene();
        });
      }
      weatherMode = "snow";
      isSunny = false;
      isDusk = false;
      weatherBlend = 0;
      sceneHost.dataset.weather = "snow";
      weatherButtons.remove();
      const snowTown = new THREE.Group();
      snowTown.name = "\u96EA\u4E61\u665A\u706F";
      world.add(snowTown);
      const snowStatic = new THREE.Group();
      snowStatic.name = "village-static";
      snowTown.add(snowStatic);
      const snowShop = new THREE.Group();
      snowShop.name = "\u96EA\u4E61\u5C0F\u4ED3\u4E70-original-interior";
      snowShop.position.set(0.9, 0, 0.35);
      snowTown.add(snowShop);
      const snowLegacy = new THREE.Group();
      snowLegacy.name = "hidden-ordinary-exterior";
      world.add(snowLegacy);
      const snowExcluded = /* @__PURE__ */ new Set([cat, dog, pigeon, wallPlanter, umbrellaRack, sunnyFlowerRack, pinwheelStand, rain, roofDrain, roofExhaust, windowFog, fogHit, sunbeam, sunsetGlass, pigeonFeather]);
      world.updateMatrixWorld(true);
      for (const object of world.children.slice().filter((o) => ![snowTown, snowLegacy].includes(o))) {
        const b = new THREE.Box3().setFromObject(object), floor = object.isMesh && Math.abs(object.position.y - 0.59) < 1e-3 && object.geometry.parameters.width === 6.9;
        const inside = !b.isEmpty() && b.min.x >= -4.96 && b.max.x <= 2.68 && b.min.z >= -4.12 && b.max.z <= 1.85 && b.min.y >= 0.6 && b.max.y <= 4.05;
        (snowExcluded.has(object) ? snowLegacy : inside || floor ? snowShop : snowLegacy).add(object);
      }
      snowLegacy.visible = false;
      for (const o of [postbox, chime, chimeRain, doorHit, staffDoor, staffHinge, rearAwning, pickupSign, pickupHit, takeoutGroup, bento, preparingNote, wallVentExterior, wallVentInterior, ...rearBins, ...steam, ...bunSteam, ...odenSteam, ...cookSteam]) if (o.parent === snowLegacy) snowShop.add(o);
      if (mailEnvelope.parent === snowLegacy) snowShop.add(mailEnvelope);
      snowShop.add(windowFog);
      snowShop.add(fogHit);
      windowFog.visible = fogHit.visible = true;
      windowFog.material.opacity = 0.2;
      cat.visible = dog.visible = pigeon.visible = false;
      chimeSun.visible = false;
      shopLights.forEach((o) => {
        snowShop.add(o);
        o.intensity = o.userData.nightPower * 0.85;
        o.distance = 8;
      });
      snowShop.add(serviceLight);
      snowShop.add(serviceAim);
      const snowFloor = 0.28, snowWhite = 15134193, snowShade = 13162723, wood = 6771527, brick = 9990761;
      hemisphere.color.setHex(11126239);
      hemisphere.groundColor.setHex(6582400);
      hemisphere.intensity = 0.68;
      moon.color.setHex(12112360);
      moon.intensity = 0.65;
      moon.position.set(-12, 19, 10);
      moon.shadow.camera.left = -21;
      moon.shadow.camera.right = 21;
      moon.shadow.camera.top = 21;
      moon.shadow.camera.bottom = -21;
      moon.shadow.camera.far = 65;
      moon.shadow.bias = -15e-5;
      camera.far = 150;
      camera.updateProjectionMatrix();
      renderer.toneMappingExposure = 1.15;
      ink.color.setHex(4082264);
      ink.opacity = 0.3;
      glass.opacity = 0.105;
      frontAwning.material.color.setHex(7170915);
      function sb(x, y, z, w, h, d, c, parent = snowStatic, em = 0) {
        return box(x, y, z, w, h, d, c, false, em, parent);
      }
      function sc(x, y, z, r, h, c, parent = snowStatic, n = 12) {
        return cyl(x, y, z, r, h, c, n, parent);
      }
      const snowSphere = new THREE.SphereGeometry(1, 12, 8);
      function ball(x, y, z, sx, sy, sz, c, parent = snowStatic) {
        const o = new THREE.Mesh(snowSphere, mat(c));
        o.position.set(x, y, z);
        o.scale.set(sx, sy, sz);
        o.castShadow = true;
        o.receiveShadow = true;
        parent.add(o);
        return o;
      }
      function label(x, y, z, w, h, text, parent = snowStatic, bg = "#ede0b8", fg = "#65483c") {
        return plaque(x, y, z, w, h, text, bg, fg, 80, parent);
      }
      let snowSeed = 8234;
      function sr() {
        snowSeed = snowSeed * 1664525 + 1013904223 >>> 0;
        return snowSeed / 4294967296;
      }
      const snowTargets = [];
      function snowBind(root, action) {
        root.traverse((o) => {
          if (o.isMesh) {
            o.userData.snowAction = action;
            snowTargets.push(o);
          }
        });
        return root;
      }
      function snowHit(action, x, y, z, w, h, d, parent = snowTown) {
        const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), pickMaterial);
        o.position.set(x, y, z);
        o.userData.snowAction = action;
        snowTargets.push(o);
        parent.add(o);
        return o;
      }
      function roof(cx, z, w, d, eave, rise, parent = snowStatic) {
        const sh = new THREE.Shape();
        sh.moveTo(-w / 2, 0);
        sh.lineTo(0, rise);
        sh.lineTo(w / 2, 0);
        sh.closePath();
        const g = new THREE.ExtrudeGeometry(sh, { depth: d, bevelEnabled: false });
        const shell = new THREE.Mesh(g, mat(5924204));
        shell.position.set(cx, eave, z - d / 2);
        shell.castShadow = true;
        parent.add(shell);
        const half = w / 2, len = Math.hypot(half, rise), a = Math.atan2(rise, half);
        for (const side of [-1, 1]) {
          const cap = sb(cx + side * w / 4, eave + rise / 2 + 0.1, z, len + 0.13, 0.19, d + 0.18, snowWhite, parent);
          cap.rotation.z = -side * a;
        }
        for (let i = 0; i < Math.ceil(w * 2.8); i++) {
          const x = cx - w / 2 + i * 0.35;
          ball(x, eave + 0.065, z + d / 2 + 0.065, 0.23 + sr() * 0.08, 0.07 + sr() * 0.06, 0.12 + sr() * 0.06, snowWhite, parent);
        }
        return shell;
      }
      const houseWindows = [], chimneyPuffs = [], snowChimneys = [];
      const puffMap = texture(64, 64, (c, W, H) => {
        const g = c.createRadialGradient(32, 32, 0, 32, 32, 30);
        g.addColorStop(0, "rgba(235,237,235,.6)");
        g.addColorStop(1, "rgba(235,237,235,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      function smoke(x, y, z, parent = snowTown) {
        for (let i = 0; i < 5; i++) {
          const o = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffMap, transparent: true, opacity: 0, depthWrite: false }));
          o.userData.origin = new THREE.Vector3(x, y, z);
          o.userData.phase = i / 5;
          parent.add(o);
          chimneyPuffs.push(o);
        }
      }
      const townRadius = 20, roadY = 0.318, riverX = 5.6, riverWidth = 2.1, roadZ = 7;
      const snowLayout = { residence: { x: -11, z: -4.5, scale: 1.3, yaw: 0 }, repair: { x: -9.4, z: 12.6, scale: 1.1, yaw: Math.PI / 2 }, grain: { x: 0, z: -12, scale: 0.95, yaw: 0 }, bakery: { x: 12.15, z: -2.5, scale: 1.35, yaw: 0 }, woodshed: { x: -7.8, z: -12.5, scale: 1.05, yaw: 0 } };
      const roads = [], roadSegments = [], roadNodes = /* @__PURE__ */ new Map(), roadLinks = /* @__PURE__ */ new Map(), roadsideBanks = [], townTrees = [], lampObjects = [], bridges = [];
      function road(x, z, w, d) {
        roads.push({ x, z, w, d });
      }
      function onRoad(x, z, margin = 0) {
        return roads.some((r) => Math.abs(x - r.x) <= r.w / 2 + margin && Math.abs(z - r.z) <= r.d / 2 + margin);
      }
      function nodeKey(p) {
        return p.map((v) => Number(v.toFixed(3))).join(",");
      }
      function connect(points, width = 1.25) {
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1], b = points[i], dx = Math.abs(a[0] - b[0]), dz = Math.abs(a[1] - b[1]);
          if (dx > 1e-3 && dz > 1e-3) throw Error("Diagonal footpath");
          road((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, dx + width, dz + width);
          roadSegments.push({ a, b, width });
          for (const [p, q] of [[a, b], [b, a]]) {
            const k = nodeKey(p), j = nodeKey(q);
            roadNodes.set(k, p);
            roadNodes.set(j, q);
            if (!roadLinks.has(k)) roadLinks.set(k, []);
            roadLinks.get(k).push({ key: j, length: Math.hypot(dx, dz) });
          }
        }
      }
      connect([[-18.4, 7], [-12, 7], [-6.4, 7], [-0.32, 7], [4.1, 7], [7.1, 7], [8.2, 7], [12, 7], [18.4, 7]], 3.2);
      connect([[-6.4, 7], [-6.4, 5.2], [-6.4, 4.3], [-6.4, 2.5], [-6.4, -4.7], [-6.4, -7.5]]);
      connect([[-0.32, 1.65], [-0.32, 4.3], [-0.32, 7]], 1.55);
      connect([[-6.4, 4.3], [-0.32, 4.3], [2.9, 4.3], [2.9, 3.5], [4.1, 3.5], [7.1, 3.5], [8.2, 3.5], [8.2, 5.2], [8.2, 7]]);
      connect([[8.2, 3.5], [8.2, 1.6], [8.2, -7.5], [7.1, -7.5], [4.1, -7.5], [2.4, -7.5], [0, -7.5], [-6.4, -7.5]]);
      connect([[0, -7.5], [0, -9.25]]);
      connect([[2.4, -7.5], [2.4, -4.7], [2.4, -3.9]]);
      connect([[-6.4, -4.7], [-1.5, -4.7], [2.4, -4.7]]);
      connect([[-1.5, -4.7], [-1.5, -4.1]]);
      connect([[-11, -1.3], [-11, 2.5], [-6.4, 2.5]]);
      connect([[-12, 5.2], [-6.4, 5.2]]);
      connect([[-12, 5.2], [-12, 7]]);
      connect([[8.2, 5.2], [12, 5.2], [12, 7]]);
      connect([[8.2, 1.1], [14.418, 1.1], [14.418, 0.62]]);
      connect([[-5.55, 7], [-5.55, 11.1], [-5.55, 12.6], [-7.25, 12.6]]);
      connect([[-6.4, -7.5], [-7.8, -7.5], [-7.8, -10.9]], 1);
      connect([[-11, -1.3], [-11, -2.3]], 1);
      connect([[-5.55, 12.6], [-5.55, 16.8], [-0.7, 16.8], [-0.7, 17.05]], 1);
      connect([[14.418, 0.62], [14.418, 0.18]], 1.1);
      function clipPoly(poly, test, intersect) {
        const out = [];
        for (let i = 0; i < poly.length; i++) {
          const a = poly[i], b = poly[(i + 1) % poly.length], aa = test(a), bb = test(b);
          if (aa) out.push(a);
          if (aa !== bb) out.push(intersect(a, b));
        }
        return out;
      }
      function clipX(poly, x, less) {
        return clipPoly(poly, (p) => less ? p.x <= x : p.x >= x, (a, b) => a.clone().lerp(b, (x - a.x) / (b.x - a.x)));
      }
      function flatPolygon(poly, y, color, parent = snowStatic) {
        const faces = THREE.ShapeUtils.triangulateShape(poly, []), data = [];
        for (const face2 of faces) for (const j of face2) data.push(poly[j].x, y, poly[j].y);
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(data, 3));
        g.computeVertexNormals();
        const m = mat(color).clone();
        m.side = THREE.DoubleSide;
        const o = new THREE.Mesh(g, m);
        o.receiveShadow = true;
        parent.add(o);
        return o;
      }
      const perimeter = Array.from({ length: 160 }, (_, i) => new THREE.Vector2(Math.sin(i / 160 * Math.PI * 2) * townRadius, Math.cos(i / 160 * Math.PI * 2) * townRadius));
      const riverLeft = riverX - riverWidth / 2, riverRight = riverX + riverWidth / 2;
      function riverCenter(z) {
        let weight = 1;
        for (const [bz, half] of [[-7.5, 0.675], [3.5, 0.675], [7, 1.6]]) weight *= THREE.MathUtils.smoothstep(Math.abs(z - bz), half + 0.1, half + 1.35);
        return riverX + Math.sin(z * 0.32 + 0.8) * 0.6 * weight;
      }
      function riverEdges(z) {
        const limit = Math.sqrt(Math.max(0, townRadius * townRadius - z * z));
        return { left: THREE.MathUtils.clamp(riverCenter(z) - riverWidth / 2, -limit, limit), right: THREE.MathUtils.clamp(riverCenter(z) + riverWidth / 2, -limit, limit), limit };
      }
      const v4LandVertices = [];
      function v4LandQuad(a, b, c, d) {
        for (const p of [a, b, c, a, c, d]) v4LandVertices.push(p[0], 0.28, p[1]);
      }
      for (let i = 0; i < 400; i++) {
        const z0 = -20 + i * 0.1, z1 = z0 + 0.1, a = riverEdges(z0), b = riverEdges(z1);
        v4LandQuad([-a.limit, z0], [a.left, z0], [b.left, z1], [-b.limit, z1]);
        v4LandQuad([a.right, z0], [a.limit, z0], [b.limit, z1], [b.right, z1]);
      }
      const v4LandGeo = new THREE.BufferGeometry();
      v4LandGeo.setAttribute("position", new THREE.Float32BufferAttribute(v4LandVertices, 3));
      v4LandGeo.computeVertexNormals();
      const v4LandMat = mat(snowWhite).clone();
      v4LandMat.side = THREE.DoubleSide;
      const snowGround = new THREE.Mesh(v4LandGeo, v4LandMat);
      snowGround.receiveShadow = true;
      snowStatic.add(snowGround);
      const landSide = new THREE.Mesh(new THREE.CylinderGeometry(townRadius, townRadius - 0.12, 0.7, 128, 1, true), mat(11781588));
      landSide.position.y = -0.07;
      snowStatic.add(landSide);
      function v4RiverEnd(sign2) {
        let lo = 18, hi = 20;
        for (let i = 0; i < 40; i++) {
          const m = (lo + hi) / 2;
          if (Math.sqrt(Math.max(0, 400 - m * m)) > riverCenter(sign2 * m) - riverWidth / 2) lo = m;
          else hi = m;
        }
        return sign2 * (lo + hi) / 2;
      }
      const riverStart = v4RiverEnd(-1), riverEnd = v4RiverEnd(1), v4BankLeft = [], v4BankRight = [];
      for (let i = 0; i <= 400; i++) {
        const z = THREE.MathUtils.lerp(riverStart, riverEnd, i / 400), e = riverEdges(z);
        v4BankLeft.push(new THREE.Vector2(e.left, z));
        v4BankRight.push(new THREE.Vector2(e.right, z));
      }
      const icePoly = [...v4BankLeft, ...v4BankRight.slice().reverse()], iceHoleCenter = new THREE.Vector2(riverCenter(16.3), 16.3), iceHoleRadius = 0.54;
      const iceHoleOutline = [];
      for (let i = 0; i < 64; i++) {
        const a = -i / 64 * Math.PI * 2, r = 0.56 * (1 + 0.13 * Math.sin(a * 3) + 0.08 * Math.cos(a * 5) + 0.045 * Math.sin(a * 9));
        iceHoleOutline.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r * 0.86));
      }
      const v3IceShape = new THREE.Shape(icePoly), v3Hole = new THREE.Path(iceHoleOutline.map((p) => p.clone().add(iceHoleCenter)));
      v3Hole.closePath();
      v3IceShape.holes.push(v3Hole);
      const v3IceGeo = new THREE.ShapeGeometry(v3IceShape, 48), ip = v3IceGeo.attributes.position, uv = [];
      for (let i = 0; i < ip.count; i++) {
        const x = ip.getX(i), z = ip.getY(i);
        ip.setXYZ(i, x, -0.11, z);
        uv.push((x - riverCenter(z) + riverWidth / 2) / riverWidth, (z + townRadius) / (townRadius * 2));
      }
      v3IceGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      v3IceGeo.computeVertexNormals();
      const iceTexture = texture(512, 2048, (c, W, H) => {
        const g = c.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, "#5d91a8");
        g.addColorStop(0.38, "#a6cfdf");
        g.addColorStop(0.7, "#86b8cd");
        g.addColorStop(1, "#d0e6ec");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        let seed2 = 923;
        function rand() {
          seed2 = seed2 * 16807 % 2147483647;
          return seed2 / 2147483647;
        }
        for (let i = 0; i < 26; i++) {
          let x = rand() * W, y = rand() * H;
          c.strokeStyle = i % 3 ? "rgba(231,250,255,.80)" : "rgba(43,92,119,.48)";
          c.lineWidth = i % 3 ? 1.8 : 2.6;
          c.beginPath();
          c.moveTo(x, y);
          for (let j = 0; j < 7; j++) {
            x += (rand() - 0.48) * 95;
            y += 15 + rand() * 46;
            c.lineTo(x, y);
            if (j === 3) {
              c.lineTo(x + 65, y + 26);
              c.moveTo(x, y);
            }
          }
          c.stroke();
        }
        for (let i = 0; i < 160; i++) {
          c.strokeStyle = "rgba(240,252,255,.16)";
          c.beginPath();
          c.ellipse(rand() * W, rand() * H, 3 + rand() * 12, 1 + rand() * 3, 0, 0, Math.PI * 2);
          c.stroke();
        }
      });
      const riverIce = new THREE.Mesh(v3IceGeo, new THREE.MeshPhysicalMaterial({ map: iceTexture, color: 12707565, roughness: 0.24, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.18, side: THREE.DoubleSide }));
      riverIce.name = "deep-cracked-ice-river";
      riverIce.receiveShadow = true;
      snowStatic.add(riverIce);
      const v3RiverBed = flatPolygon(icePoly, -0.43, 3431536);
      for (const edge of [v4BankLeft, v4BankRight]) {
        const data = [];
        for (let i = 1; i < edge.length; i++) {
          const a = edge[i - 1], b = edge[i];
          for (const p of [[a.x, 0.28, a.y], [b.x, -0.43, b.y], [b.x, 0.28, b.y], [a.x, 0.28, a.y], [a.x, -0.43, a.y], [b.x, -0.43, b.y]]) data.push(...p);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(data, 3));
        geo.computeVertexNormals();
        const m = mat(10401736).clone();
        m.side = THREE.DoubleSide;
        const bank = new THREE.Mesh(geo, m);
        bank.name = "curved-river-bank";
        snowStatic.add(bank);
      }
      const v3Base = new THREE.Mesh(new THREE.CylinderGeometry(townRadius - 0.12, townRadius - 0.12, 0.08, 128), mat(8231085));
      v3Base.position.y = -0.47;
      snowStatic.add(v3Base);
      function bridge(kind, z) {
        const g = new THREE.Group();
        g.name = kind + "-bridge";
        g.position.set(riverX, 0, z);
        snowStatic.add(g);
        const span = 4.1, depth = kind === "modern" ? 3.2 : 1.35;
        if (kind === "modern") {
          sb(0, 0.255, 0, span, 0.14, depth, 9082525, g);
          sb(0, 0.322, 0, span, 0.025, depth, 11977934, g);
          for (const s of [-1, 1]) {
            for (let i = 0; i < 7; i++) sb(-span / 2 + i * span / 6, 0.78, s * (depth / 2 + 0.1), 0.06, 0.84, 0.06, 6847367, g);
            for (const y of [0.6, 1.15]) sb(0, y, s * (depth / 2 + 0.1), span, 0.045, 0.06, 10991033, g);
          }
          for (const x of [-1.55, 1.55]) sb(x, 0.1, 0, 0.28, 0.38, 2.85, 9412005, g);
        } else if (kind === "wood") {
          for (let i = 0; i < 18; i++) sb(-span / 2 + i * span / 17, 0.388, 0, 0.23, 0.075, depth, 9993821, g);
          for (const s of [-1, 1]) {
            for (const x of [-1.95, -0.65, 0.65, 1.95]) sb(x, 0.78, s * 0.72, 0.08, 0.79, 0.08, wood, g);
            sb(0, 1.14, s * 0.72, span, 0.07, 0.08, 10125923, g);
          }
          for (const x of [-2.35, 2.35]) {
            const ramp = sb(x, 0.357, 0, 0.65, 0.07, depth, 11846088, g);
            ramp.rotation.z = (x < 0 ? 1 : -1) * 0.13;
          }
        } else {
          for (let i = 0; i < 20; i++) {
            const t = (i + 0.5) / 20, x = (t - 0.5) * span, y = 0.32 + 0.4 * Math.sin(t * Math.PI);
            sb(x, y - 0.055, 0, span / 20 + 0.01, 0.12, depth, 10202030, g);
            for (const s of [-1, 1]) sb(x, y + 0.21, s * 0.73, span / 20 + 0.01, 0.43, 0.18, 9215136, g);
          }
          for (const s of [-1, 1]) for (let i = 0; i < 18; i++) {
            const t = (i + 0.5) / 18, x = (t - 0.5) * span, y = 0.22 + 0.37 * Math.sin(t * Math.PI), o = sb(x, y - 0.15, s * 0.6, 0.23, 0.24, 0.22, 8426391, g);
            o.rotation.z = Math.cos(t * Math.PI) * 0.28;
          }
        }
        const r = { kind, z, root: g, span, depth };
        bridges.push(r);
        return r;
      }
      bridge("modern", 7);
      bridge("wood", 3.5);
      bridge("stone", -7.5);
      function walkHeight(x, z) {
        if (Math.abs(x - riverX) < 2.75) {
          if (Math.abs(z - 3.5) < 0.7) {
            const d = Math.abs(x - riverX);
            return d < 2.05 ? 0.428 : THREE.MathUtils.lerp(0.428, roadY, (d - 2.05) / 0.7);
          }
          if (Math.abs(z + 7.5) < 0.75 && Math.abs(x - riverX) <= 2.05) return 0.325 + 0.4 * Math.sin((x - riverX + 2.05) / 4.1 * Math.PI);
        }
        if (Math.abs(x + 0.32) < 0.7 && z < 2.9 && z > -0.2) {
          if (z > 2.775) return THREE.MathUtils.lerp(0.318, 0.415, (2.9 - z) / 0.125);
          if (z > 2.65) return 0.415;
          if (z > 2.495) return THREE.MathUtils.lerp(0.415, 0.545, (2.65 - z) / 0.155);
          if (z > 2.25) return 0.545;
          if (z > 2.125) return THREE.MathUtils.lerp(0.545, 0.57, (2.25 - z) / 0.125);
          if (z > 1.95) return 0.57;
          if (z > 1.83) return THREE.MathUtils.lerp(0.57, 0.645, (1.95 - z) / 0.12);
          if (z > 1.2) return 0.645;
          if (z > 1.1) return THREE.MathUtils.lerp(0.645, 0.7, (1.2 - z) / 0.1);
          return 0.7;
        }
        if (Math.abs(x + 11) < 0.9 && z < -1.3 && z > -3.5) {
          if (z > -1.406) return THREE.MathUtils.lerp(0.318, 0.4485, (-1.3 - z) / 0.106);
          if (z > -1.55) return 0.4485;
          if (z > -1.692) return THREE.MathUtils.lerp(0.4485, 0.7345, (-1.55 - z) / 0.142);
          if (z > -2.13) return 0.7345;
          if (z > -2.26) return THREE.MathUtils.lerp(0.7345, 0.796, (-2.13 - z) / 0.13);
          return 0.796;
        }
        if (Math.abs(x - 14.418) < 0.75 && z < 0.62 && z > -2.3) {
          const q = z + 0.5;
          if (q > 0.925) return THREE.MathUtils.lerp(0.318, 0.46, (1.12 - q) / 0.195);
          if (q > 0.75) return 0.46;
          if (q > 0.575) return THREE.MathUtils.lerp(0.46, 0.63, (0.75 - q) / 0.175);
          if (q > 0.35) return 0.63;
          if (q > 0.28) return THREE.MathUtils.lerp(0.63, 0.8, (0.35 - q) / 0.07);
          return 0.8;
        }
        if (Math.abs(x) < 0.9 && z < -9.25 && z > -11.6) {
          if (z > -9.739) return THREE.MathUtils.lerp(0.318, 0.514, (-9.25 - z) / 0.489);
          if (z > -9.85) return 0.514;
          if (z > -9.9765) return THREE.MathUtils.lerp(0.514, 0.733, (-9.85 - z) / 0.1265);
          if (z > -10.2) return 0.733;
          if (z > -10.328) return THREE.MathUtils.lerp(0.733, 0.882, (-10.2 - z) / 0.128);
          return 0.882;
        }
        return roadY;
      }
      function findRoute(a, b) {
        var _a2;
        const closest = (p) => [...roadNodes.entries()].sort((u2, v) => Math.hypot(u2[1][0] - p[0], u2[1][1] - p[1]) - Math.hypot(v[1][0] - p[0], v[1][1] - p[1]))[0][0];
        const from = closest(a), to = closest(b), dist = /* @__PURE__ */ new Map([[from, 0]]), prev2 = /* @__PURE__ */ new Map(), q = new Set(roadNodes.keys());
        while (q.size) {
          let u2 = [...q].sort((x, y) => {
            var _a3, _b2;
            return ((_a3 = dist.get(x)) != null ? _a3 : Infinity) - ((_b2 = dist.get(y)) != null ? _b2 : Infinity);
          })[0];
          q.delete(u2);
          if (u2 === to) break;
          for (const edge of roadLinks.get(u2) || []) {
            const d = dist.get(u2) + edge.length;
            if (d < ((_a2 = dist.get(edge.key)) != null ? _a2 : Infinity)) {
              dist.set(edge.key, d);
              prev2.set(edge.key, u2);
            }
          }
        }
        const out = [roadNodes.get(to)];
        let u = to;
        while (u !== from && prev2.has(u)) {
          u = prev2.get(u);
          out.unshift(roadNodes.get(u));
        }
        if (u !== from) throw Error("Disconnected village route");
        if (Math.hypot(out[0][0] - a[0], out[0][1] - a[1]) > 0.01) out.unshift(a);
        if (Math.hypot(out[out.length - 1][0] - b[0], out[out.length - 1][1] - b[1]) > 0.01) out.push(b);
        return out;
      }
      function buildUnifiedRoads() {
        const xs = [...new Set(roads.flatMap((r) => [r.x - r.w / 2, r.x + r.w / 2]).concat([riverLeft, riverRight]))].sort((a, b) => a - b), zs = [...new Set(roads.flatMap((r) => [r.z - r.d / 2, r.z + r.d / 2]))].sort((a, b) => a - b), vertices = [];
        for (let i = 1; i < xs.length; i++) for (let j = 1; j < zs.length; j++) {
          const x = (xs[i] + xs[i - 1]) / 2, z = (zs[j] + zs[j - 1]) / 2;
          if (!onRoad(x, z) || x > riverLeft && x < riverRight || Math.hypot(x, z) > 19.8) continue;
          const z0 = zs[j - 1], z1 = zs[j], limit = Math.sqrt(Math.max(0, 19.93 ** 2 - Math.max(z0 * z0, z1 * z1))), x0 = Math.max(xs[i - 1], -limit), x1 = Math.min(xs[i], limit);
          if (x1 <= x0) continue;
          vertices.push(x0, roadY, z0, x1, roadY, z1, x1, roadY, z0, x0, roadY, z0, x0, roadY, z1, x1, roadY, z1);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geo.computeVertexNormals();
        const mesh = new THREE.Mesh(geo, mat(9215914));
        mesh.name = "continuous-connected-roads";
        mesh.receiveShadow = true;
        snowStatic.add(mesh);
        return mesh;
      }
      function snowbank(x, z, sx, sz, h = 0.22) {
        return ball(x, 0.28 + h * 0.15, z, sx, h, sz, snowWhite);
      }
      function foot(x, z, angle = 0, bear2 = false, parent = snowStatic) {
        const g = new THREE.Group();
        g.position.set(x, walkHeight(x, z) + 4e-3, z);
        g.rotation.y = angle;
        parent.add(g);
        ball(0, 0, 0, bear2 ? 0.16 : 0.065, 7e-3, bear2 ? 0.22 : 0.15, 9414069, g);
        if (bear2) for (let k = 0; k < 4; k++) ball(-0.13 + k * 0.085, 0, 0.2, 0.04, 6e-3, 0.05, 9414069, g);
        return g;
      }
      for (const o of snowShop.children.slice()) if (o.position.x < -4.63 && o.position.z > 0.3) o.removeFromParent();
      for (const o of vendingCans) o.removeFromParent();
      postbox.visible = false;
      mailEnvelope.visible = false;
      chime.visible = false;
      roof(-1.15, -1.57, 7.55, 5.38, 3.96, 1.3, snowShop);
      chimney(snowShop, 0.95, -2.1, 5.25);
      const removedWinterStripes = [];
      for (const o of snowShop.children.slice()) if (o.isMesh && Math.abs(o.position.x + 1.15) < 1e-3 && Math.abs(o.position.z - 1.08) < 1e-3 && [3.23, 3.53].some((y) => Math.abs(o.position.y - y) < 1e-3)) {
        removedWinterStripes.push(o);
        o.removeFromParent();
      }
      sign.position.set(-1.15, 3.57, 1.171);
      sign.scale.set(1, 1, 1);
      sign.geometry.dispose();
      sign.geometry = new THREE.PlaneGeometry(4.25, 0.54);
      sign.material = new THREE.MeshBasicMaterial({ map: texture(1024, 160, (c, W, H) => {
        c.fillStyle = "#ddcba1";
        c.fillRect(0, 0, W, H);
        c.strokeStyle = "#9d7954";
        c.lineWidth = 9;
        c.strokeRect(6, 6, W - 12, H - 12);
        c.fillStyle = "#7a3d2e";
        c.font = '700 122px "Microsoft YaHei",sans-serif';
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("\u96EA\u4E61\u5C0F\u4ED3\u4E70", W / 2, H / 2 + 4);
      }) });
      sign.userData.text = sign.userData.displayText = "\u96EA\u4E61\u5C0F\u4ED3\u4E70";
      const snowSignBack = sb(-1.15, 3.57, 1.145, 4.4, 0.6, 0.04, 8349521, snowShop);
      const signReliefs = [];
      for (const x of [-4, 1.7]) {
        const g = new THREE.Group();
        g.name = "carved-snowflake-fret-relief";
        g.position.set(x, 3.57, 1.128);
        snowShop.add(g);
        const c = 14930602;
        for (let j = 0; j < 6; j++) {
          const a = j * Math.PI / 3, dx = Math.cos(a), dy = Math.sin(a);
          rod([0, 0, 0.02], [dx * 0.155, dy * 0.155, 0.02], 0.014, c, g);
          for (const side of [-1, 1]) {
            const b = a + side * 0.67;
            rod([dx * 0.105, dy * 0.105, 0.02], [dx * 0.105 - Math.cos(b) * 0.055, dy * 0.105 - Math.sin(b) * 0.055, 0.02], 0.01, c, g);
          }
        }
        for (const side of [-1, 1]) for (const up of [-1, 1]) {
          sb(side * 0.42, up * 0.155, 0.018, 0.18, 0.02, 0.035, c, g);
          sb(side * 0.5, up * 0.1, 0.018, 0.02, 0.13, 0.035, c, g);
          sb(side * 0.39, up * 0.09, 0.018, 0.12, 0.018, 0.035, c, g);
          sb(side * 0.34, up * 0.065, 0.018, 0.018, 0.065, 0.035, c, g);
        }
        signReliefs.push(g);
      }
      const icicleMat = new THREE.MeshPhysicalMaterial({ color: 13231861, transparent: true, opacity: 0.78, roughness: 0.19, depthWrite: false }), icicles = [];
      for (const [i, x] of [-4.6, -4.12, -3.8, -2.85, -2.55, -0.18, 0.35, 1.45, 2.15].entries()) {
        const h = 0.15 + i % 4 * 0.075, o = new THREE.Mesh(new THREE.ConeGeometry(0.034, h, 6), icicleMat);
        o.rotation.z = Math.PI;
        o.position.set(x, 3.02 - h / 2, 1.84);
        snowShop.add(o);
        icicles.push(o);
      }
      sb(-1.15, 3.11, 1.32, 7.55, 0.14, 1.05, snowWhite, snowShop);
      for (const [x, w] of [[-3.325, 2.35], [0.995, 2.57]]) {
        sb(x, 0.99, 0.83, w, 0.47, 0.13, 12893606, snowShop);
        for (const dx of [-w * 0.48, 0, w * 0.48]) sb(x + dx, 1.98, 0.855, 0.09, 1.99, 0.1, 6845545, snowShop);
      }
      sb(2.34, 1, -1.5, 0.13, 0.47, 4.62, 11974563, snowShop);
      for (const z of [-3, -1.5, 0]) sb(2.365, 2, z, 0.11, 1.99, 0.09, 6845545, snowShop);
      const cottonLeaves = [];
      for (const [i, door] of doors.entries()) {
        const shift = i === 0 ? 0.42 : -0.42;
        for (const child of door.children) child.position.x += shift;
        door.position.x = i === 0 ? -2.08 : -0.36;
        door.userData.closedX = door.position.x;
        const pad = new THREE.Group();
        pad.position.x = shift;
        pad.name = "one-piece-quilt-with-single-window";
        door.add(pad);
        const quilt = 6449996;
        sb(0, 1.37, 0.06, 0.8, 1.14, 0.055, quilt, pad);
        sb(0, 2.59, 0.06, 0.8, 0.5, 0.055, quilt, pad);
        for (const x of [-0.345, 0.345]) sb(x, 2.14, 0.06, 0.11, 0.4, 0.055, quilt, pad);
        const p = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.36), new THREE.MeshPhysicalMaterial({ color: 14806247, transparent: true, opacity: 0.1, roughness: 0.18, side: THREE.DoubleSide, depthWrite: false }));
        p.position.set(0, 2.14, 0.095);
        pad.add(p);
        for (const yy of [1.94, 2.34]) sb(0, yy, 0.1, 0.63, 0.025, 0.015, 12037769, pad);
        for (const xx of [-0.31, 0.31]) sb(xx, 2.14, 0.1, 0.025, 0.4, 0.015, 12037769, pad);
        for (let j = 0; j < 4; j++) sb(-0.29 + j * 0.19, 1.36, 0.092, 8e-3, 0.98, 8e-3, 9212528, pad);
        cottonLeaves.push(pad);
      }
      function verticalLabel(x, y, z, w, h, text, parent = snowStatic, bg = "#a64c39", fg = "#ead29a") {
        const tex = texture(128, 768, (c, W, H) => {
          c.fillStyle = bg;
          c.fillRect(0, 0, W, H);
          c.fillStyle = fg;
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.font = '700 95px "Microsoft YaHei",sans-serif';
          [...text].forEach((s, i) => c.fillText(s, W / 2, H * (i + 0.5) / text.length));
        });
        const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex }));
        o.position.set(x, y, z);
        o.userData.text = text;
        parent.add(o);
        return o;
      }
      for (const [x, t] of [[-2.24, "\u745E\u96EA\u8FCE\u6625"], [-0.21, "\u51FA\u5165\u5E73\u5B89"]]) verticalLabel(x, 1.92, 0.91, 0.18, 1.65, t, snowShop);
      const lanterns = [], lanternLights = [], lanternRibs = [];
      for (const x of [-4.25, 2.02]) {
        const g = new THREE.Group();
        g.position.set(x, 2.63, 1.53);
        snowShop.add(g);
        rod([0, 0.42, 0], [0, 0.17, 0], 0.013, 9139540, g);
        const shade = ball(0, 0, 0, 0.275, 0.285, 0.275, 14292008, g);
        shade.name = "lit-red-lantern-paper";
        shade.material = shade.material.clone();
        shade.material.color.setHex(7475977);
        shade.material.emissive.setHex(16725019);
        shade.material.emissiveIntensity = 0.62;
        shade.material.toneMapped = false;
        const ribMaterial = new THREE.MeshBasicMaterial({ color: 15184977, toneMapped: false });
        for (let i = 0; i < 12; i++) {
          const a = (i + 0.5) * Math.PI / 6, points = [];
          for (let j = 0; j <= 32; j++) {
            const t = 0.4 + j / 32 * (Math.PI - 0.8), r = 0.28 * Math.sin(t);
            points.push(new THREE.Vector3(Math.sin(a) * r, 0.289 * Math.cos(t), Math.cos(a) * r));
          }
          const rib = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 32, 45e-4, 5, false), ribMaterial);
          rib.name = "golden-lantern-rib";
          g.add(rib);
          lanternRibs.push(rib);
        }
        const warmLight = new THREE.PointLight(16730416, 1.1, 3, 2);
        warmLight.position.set(0, -0.02, 0.08);
        g.add(warmLight);
        lanternLights.push(warmLight);
        for (const y of [-0.25, 0.25]) sc(0, y, 0, 0.13, 0.055, 12621909, g);
        rod([0, -0.27, 0], [0, -0.49, 0], 0.014, 12161618, g);
        label(0, 0, 0.289, 0.16, 0.19, "\u798F", g, "#db351d", "#ffe0a0");
        lanterns.push(g);
      }
      sb(-1.15, 0.49, 1.15, 7.02, 0.16, 1.25, 10789518, snowShop);
      sb(-1.22, 0.45, 1.9, 1.85, 0.19, 0.49, 10658720, snowShop);
      sb(-1.22, 0.35, 2.25, 2, 0.13, 0.35, 11712181, snowShop);
      for (const [x, z, sx, sz] of [[-4.15, 1.87, 0.53, 0.18], [-2.6, 2.36, 0.42, 0.17], [0.5, 2.37, 0.49, 0.16], [2, 2.22, 0.48, 0.21], [-3.2, 1.85, 0.24, 0.13]]) ball(x, 0.59, z, sx, 0.025, sz, snowWhite, snowShop);
      const produceRows = [["\u571F\u8C46", "\u80E1\u841D\u535C", "\u5730\u74DC", "\u897F\u7EA2\u67FF"], ["\u767D\u83DC", "\u841D\u535C", "\u8304\u5B50", "\u751F\u83DC"], ["\u82F9\u679C", "\u6A58\u5B50", "\u68A8\u5B50", "\u9999\u8549"]];
      const shelfCategories = [];
      for (const unit of shelfUnits) {
        unit.clear();
        const fresh = unit.position.z > -1, w = fresh ? 2.16 : 2.25, products = [];
        unit.name = fresh ? "front-fruit-vegetable-shelf" : "rear-noodle-ham-seed-shelf";
        sb(0, 1.28, 0, w, 1.12, 0.035, 11842976, unit);
        for (const side of [-1, 1]) sb(side * w / 2, 1.28, 0, 0.035, 1.12, 0.65, 13223596, unit);
        for (const [level, y] of [0.91, 1.29, 1.68].entries()) {
          sb(0, y, 0, w + 0.08, 0.055, 0.73, 15983030, unit);
          for (const side of [-1, 1]) {
            sb(0, y - 0.05, side * 0.379, w, 0.085, 0.01, 16052192, unit);
            for (let col = 0; col < (fresh ? 4 : 3); col++) {
              const cx = fresh ? (col - 1.5) * 0.54 : (col - 1) * 0.74, tray = new THREE.Group();
              tray.position.set(cx, y + 0.03, side * 0.205);
              unit.add(tray);
              const kind = fresh ? produceRows[level][col] : ["\u65B9\u4FBF\u9762", "\u706B\u817F\u80A0", "\u74DC\u5B50"][(col + level) % 3];
              tray.name = "shelf-goods-" + kind;
              Object.assign(tray.userData, { category: kind, level, side, column: col });
              products.push(tray);
              if (fresh) {
                sb(0, 0.025, 0, 0.5, 0.045, 0.3, 12031847, tray);
                for (const z of [-0.145, 0.145]) sb(0, 0.065, z, 0.5, 0.075, 0.018, 10781785, tray);
                for (let j = 0; j < 3; j++) {
                  const xx = (j - 1) * 0.15;
                  if (kind === "\u82F9\u679C" || kind === "\u6A58\u5B50") {
                    ball(xx, 0.12, 0, 0.075, 0.07, 0.074, kind === "\u82F9\u679C" ? 12407617 : 15310916, tray);
                    rod([xx, 0.18, 0], [xx + 9e-3, 0.205, 0], 6e-3, 6969147, tray);
                  } else if (kind === "\u767D\u83DC") {
                    ball(xx, 0.15, 0, 0.078, 0.115, 0.07, 11978887, tray);
                    for (const dx of [-0.052, 0, 0.052]) ball(xx + dx, 0.15, 0.028, 0.027, 0.11, 0.049, dx ? 8494177 : 14211485, tray);
                  } else if (kind === "\u841D\u535C") {
                    ball(xx, 0.115, 0, 0.042, 0.085, 0.1, 15262152, tray);
                    for (const dx of [-0.025, 0, 0.025]) rod([xx, 0.19, 0], [xx + dx, 0.255, 0.02], 0.012, 7902044, tray);
                  } else if (kind === "\u80E1\u841D\u535C") {
                    const carrot2 = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.22, 8), mat(13929021));
                    carrot2.rotation.x = Math.PI / 2;
                    carrot2.position.set(xx, 0.09, 0);
                    tray.add(carrot2);
                    for (const dx of [-0.018, 0.018]) rod([xx, 0.09, -0.1], [xx + dx, 0.13, -0.15], 9e-3, 7244117, tray);
                  } else if (kind === "\u68A8\u5B50") {
                    ball(xx, 0.11, 0, 0.065, 0.066, 0.062, 14008177, tray);
                    ball(xx, 0.17, 0, 0.039, 0.05, 0.039, 14008177, tray);
                    rod([xx, 0.207, 0], [xx + 9e-3, 0.237, -8e-3], 6e-3, 7758143, tray);
                  } else if (kind === "\u9999\u8549") {
                    for (let k = 0; k < 3; k++) {
                      const points = [];
                      for (let n = 0; n <= 8; n++) {
                        const a = -1 + n / 8 * 2;
                        points.push(new THREE.Vector3(xx + Math.sin(a) * 0.077, 0.11 + (1 - Math.cos(a)) * 0.07, k * 0.035 - 0.035));
                      }
                      const banana = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 12, 0.016, 6, false), mat(14728532));
                      tray.add(banana);
                      for (const end of [points[0], points[8]]) ball(end.x, end.y, end.z, 9e-3, 0.011, 9e-3, 8416062, tray);
                    }
                  } else if (kind === "\u8304\u5B50") {
                    const eggplant = ball(xx, 0.105, 0, 0.041, 0.046, 0.11, 5849191, tray);
                    eggplant.rotation.y = 0.12 * (j - 1);
                    ball(xx, 0.117, -0.095, 0.034, 0.024, 0.027, 7574106, tray);
                    rod([xx, 0.12, -0.1], [xx + 0.012, 0.15, -0.134], 8e-3, 6653007, tray);
                  } else if (kind === "\u751F\u83DC") {
                    ball(xx, 0.11, 0, 0.064, 0.062, 0.061, 10533488, tray);
                    for (let k = 0; k < 5; k++) {
                      const a = k * Math.PI * 2 / 5;
                      const leaf = ball(xx + Math.sin(a) * 0.036, 0.127, Math.cos(a) * 0.035, 0.035, 0.067, 0.029, k % 2 ? 9219681 : 11782525, tray);
                      leaf.rotation.z = -Math.sin(a) * 0.38;
                    }
                  } else if (kind === "\u5730\u74DC") {
                    const tuber = ball(xx, 0.105, 0, 0.049, 0.049, 0.115, j % 2 ? 10838608 : 11562580, tray);
                    tuber.rotation.y = (j - 1) * 0.2;
                    for (const z of [-0.072, 0.057]) ball(xx + 0.012, 0.149, z, 7e-3, 3e-3, 0.013, 13736562, tray);
                  } else if (kind === "\u897F\u7EA2\u67FF") {
                    ball(xx, 0.113, 0, 0.067, 0.058, 0.065, 13521728, tray);
                    for (let k = 0; k < 5; k++) {
                      const a = k * Math.PI * 2 / 5;
                      rod([xx, 0.174, 0], [xx + Math.sin(a) * 0.035, 0.168, Math.cos(a) * 0.035], 6e-3, 6652236, tray);
                    }
                    rod([xx, 0.174, 0], [xx + 6e-3, 0.195, 0], 6e-3, 6652236, tray);
                  } else ball(xx, 0.105, 0, 0.085, 0.061, 0.069, j % 2 ? 11506016 : 12689773, tray);
                }
              } else for (let j = 0; j < 3; j++) {
                const xx = (j - 1) * 0.215;
                if (kind === "\u706B\u817F\u80A0") {
                  for (let k = 0; k < 3; k++) {
                    const sausage = sc(xx, 0.055 + k * 0.065, 0, 0.031, 0.245, 12015940, tray);
                    sausage.rotation.x = Math.PI / 2;
                    sb(xx, 0.055 + k * 0.065, 0, 0.065, 0.045, 0.08, 15123071, tray);
                  }
                } else {
                  sb(xx, 0.115, 0, kind === "\u65B9\u4FBF\u9762" ? 0.195 : 0.17, 0.22, 0.14, kind === "\u65B9\u4FBF\u9762" ? j % 2 ? 13208387 : 12148033 : 7562061, tray);
                  sb(xx, 0.123, side * 0.073, kind === "\u65B9\u4FBF\u9762" ? 0.16 : 0.13, 0.1, 7e-3, kind === "\u65B9\u4FBF\u9762" ? 15257225 : 13284491, tray);
                  if (kind === "\u65B9\u4FBF\u9762") {
                    for (let k = 0; k < 3; k++) sb(xx, 0.095 + k * 0.025, side * 0.079, 0.11, 9e-3, 4e-3, 13081429, tray);
                  } else for (const dx of [-0.025, 0.025]) {
                    const seed2 = ball(xx + dx, 0.123, side * 0.08, 0.012, 0.033, 4e-3, 7168589, tray);
                    seed2.rotation.z = dx < 0 ? -0.22 : 0.22;
                  }
                }
              }
              if (fresh) {
                const tag = label(cx, y - 0.05, side * 0.388, 0.46, 0.065, kind, unit, "#f4efe0", "#86583e");
                if (side < 0) tag.rotation.y = Math.PI;
              }
            }
          }
        }
        const header = new THREE.Group();
        header.name = "centered-shelf-category-board";
        header.position.set(0, 1.995, 0);
        unit.add(header);
        const headerWidth = fresh ? 2.02 : 2.12, title = fresh ? "\u65B0\u9C9C\u6C34\u679C \xB7 \u65F6\u4EE4\u852C\u83DC" : "\u74DC\u5B50\xB7\u7EA2\u80A0\xB7\u65B9\u4FBF\u9762";
        sb(0, 0, 0, headerWidth, 0.16, 0.03, 15785912, header);
        for (const side of [-1, 1]) {
          const tag = label(0, 0, side * 0.017, headerWidth - 0.04, 0.13, title, header, "#f0dfb8", "#8b5840");
          if (side < 0) tag.rotation.y = Math.PI;
        }
        for (const x of [-headerWidth / 2 + 0.06, headerWidth / 2 - 0.06]) rod([x, 1.82, 0], [x, 2.055, 0], 0.012, 10262396, unit);
        shelfCategories.push({ root: unit, fresh, products, header });
      }
      label(1.54, 2.13, -0.58, 0.42, 0.12, "\u70ED\u8C46\u6D46", snowShop, "#ede5c9", "#7b5a42");
      const sugarJar = new THREE.Group();
      sugarJar.name = "sugar-jar";
      sugarJar.position.set(1.88, 1.58, -0.73);
      snowShop.add(sugarJar);
      sc(0, 0.12, 0, 0.087, 0.24, 15065033, sugarJar);
      sc(0, 0.253, 0, 0.095, 0.035, 10719080, sugarJar);
      label(0, 0.13, 0.09, 0.12, 0.1, "\u7CD6", sugarJar, "#e7d9b4", "#6f5d46");
      rod([0.035, 0.25, 0], [0.1, 0.34, 0.01], 8e-3, 11973531, sugarJar);
      const eggPot = new THREE.Group();
      eggPot.name = "corn-porridge-pot";
      eggPot.position.set(0.93, 1.57, -0.76);
      snowShop.add(eggPot);
      sc(0, 0.11, 0, 0.255, 0.19, 7503480, eggPot);
      sc(0, 0.207, 0, 0.243, 0.02, 14667672, eggPot);
      for (let i = 0; i < 27; i++) {
        const a = i * 2.399, r = Math.sqrt(i / 27) * 0.21;
        ball(Math.sin(a) * r, 0.223, Math.cos(a) * r, 0.015, 0.011, 0.019, i % 3 ? 15456672 : 13481845, eggPot);
      }
      for (const side of [-1, 1]) sb(side * 0.3, 0.15, 0, 0.12, 0.045, 0.07, 5463641, eggPot);
      label(0, 0.105, 0.264, 0.31, 0.095, "\u5927\u78B4\u7CA5", eggPot, "#66786e", "#eadfbd");
      odenCounter.children.slice().forEach((o) => {
        if (![bunsGroup, bunLid].includes(o)) o.removeFromParent();
      });
      bunsGroup.visible = bunLid.visible = false;
      const breakfast = new THREE.Group();
      breakfast.name = "neat-fresh-breakfast";
      snowShop.add(breakfast);
      sb(1.37, 1.51, -2.31, 1.6, 0.1, 0.73, 12035197, breakfast);
      for (let i = 0; i < 5; i++) {
        const x = 0.75 + i * 0.31;
        sb(x, 1.58, -2.31, 0.285, 0.035, 0.62, 14867138, breakfast);
        for (let j = 0; j < 3; j++) {
          const z = -2.51 + j * 0.19;
          if (i === 0) {
            ball(x, 1.66, z, 0.062, 0.08, 0.06, 9986106, breakfast);
          } else if (i === 1) {
            ball(x, 1.66, z, 0.078, 0.075, 0.077, 15655109, breakfast);
            for (let k = 0; k < 4; k++) {
              const a = k * Math.PI / 2;
              rod([x, 1.735, z], [x + Math.sin(a) * 0.035, 1.72, z + Math.cos(a) * 0.035], 5e-3, 13087884, breakfast);
            }
          } else if (i === 2) {
            sc(x, 1.64, z, 0.088, 0.075, 13013840, breakfast);
            for (let k = 0; k < 7; k++) ball(x + Math.sin(k * 2.4) * 0.052, 1.681, z + Math.cos(k * 2.4) * 0.052, 8e-3, 3e-3, 5e-3, 15325354, breakfast);
          } else if (i === 3) {
            ball(x, 1.67, z, 0.069, 0.08, 0.069, 14008195, breakfast);
          } else for (const dx of [-0.03, 0.03]) ball(x + dx, 1.65, z, 0.025, 0.035, 0.08, 12814915, breakfast);
        }
      }
      const breakfastBanner = new THREE.Group();
      breakfastBanner.name = "breakfast-new-arrivals-banner";
      breakfastBanner.position.set(1.37, 2, -2.54);
      breakfast.add(breakfastBanner);
      sb(0, 0, 0, 1.7, 0.2, 0.055, 9529678, breakfastBanner);
      label(0, 0, 0.031, 1.63, 0.16, "\u5305\u5B50\u3001\u70E7\u997C\u3001\u6CB9\u6761\u65B0\u4E0A\u5E02", breakfastBanner, "#91694e", "#f1e4bc");
      const breakfastSupports = [];
      for (const x of [0.59, 2.15]) breakfastSupports.push(rod([x, 1.56, -2.54], [x, 2.075, -2.54], 0.016, 7440255, breakfast));
      function fruitCrate(x, z, name, color) {
        const g = new THREE.Group();
        g.name = "winter-fruit-" + name;
        g.position.set(x, 0.57, z);
        snowShop.add(g);
        sb(0, 0.07, 0, 0.85, 0.13, 0.6, wood, g);
        for (const s of [-1, 1]) {
          sb(s * 0.42, 0.22, 0, 0.04, 0.29, 0.65, wood, g);
          sb(0, 0.22, s * 0.3, 0.85, 0.29, 0.035, wood, g);
        }
        for (let i = 0; i < 9; i++) {
          const xx = -0.27 + i % 3 * 0.27, zz = -0.19 + Math.floor(i / 3) * 0.19;
          ball(xx, 0.33, zz, 0.11, name === "\u51BB\u68A8" ? 0.11 : 0.072, 0.11, color, g);
          if (name === "\u51BB\u68A8") rod([xx, 0.42, zz], [xx + 0.012, 0.49, zz - 8e-3], 9e-3, 6969400, g);
          else for (let k = 0; k < 4; k++) {
            const a = k * Math.PI / 2;
            ball(xx + Math.sin(a) * 0.04, 0.405, zz + Math.cos(a) * 0.04, 0.05, 0.01, 0.025, 7105091, g);
          }
        }
        label(0, 0.22, 0.326, 0.7, 0.15, name + "  \xA53", g, "#d2b78b", "#664b36");
        return g;
      }
      const fruitCrates = [fruitCrate(-3.75, 1.32, "\u51BB\u68A8", 6901820), fruitCrate(1.57, 1.32, "\u51BB\u67FF\u5B50", 13205317)];
      const iceFreezer = new THREE.Group();
      iceFreezer.name = "popsicle-chest";
      iceFreezer.position.set(-5.35, 0.28, 1.45);
      snowShop.add(iceFreezer);
      sb(0, 0.105, 0, 0.98, 0.21, 0.69, 11849417, iceFreezer);
      for (const x of [-0.45, 0.45]) sb(x, 0.54, 0, 0.08, 0.86, 0.69, 11849417, iceFreezer);
      for (const z of [-0.305, 0.305]) sb(0, 0.54, z, 0.88, 0.86, 0.08, 11849417, iceFreezer);
      sb(0, 0.22, 0, 0.81, 0.035, 0.51, 15002076, iceFreezer);
      for (let i = 0; i < 12; i++) {
        const x = -0.3 + i % 4 * 0.2, z = -0.19 + Math.floor(i / 4) * 0.18;
        sb(x, 0.63, z, 0.1, 0.39, 0.08, i % 3 ? 15128749 : 14137227, iceFreezer);
        sb(x, 0.4, z, 0.024, 0.15, 0.022, 12163948, iceFreezer);
      }
      label(0, 0.48, 0.354, 0.78, 0.18, "\u8001\u51B0\u68CD", iceFreezer, "#bdd5ca", "#456d69");
      const freezerLid = new THREE.Group();
      freezerLid.position.set(0, 0.94, -0.33);
      freezerLid.userData.snowDynamic = true;
      iceFreezer.add(freezerLid);
      for (const x of [-0.485, 0.485]) sb(x, 0.025, 0.33, 0.07, 0.08, 0.75, 15264220, freezerLid);
      for (const z of [-0.01, 0.67]) sb(0, 0.025, z, 0.9, 0.08, 0.07, 15264220, freezerLid);
      const freezerGlass = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.025, 0.61), new THREE.MeshPhysicalMaterial({ color: 12705237, transparent: true, opacity: 0.2, roughness: 0.12, clearcoat: 0.75, depthWrite: false }));
      freezerGlass.name = "clear-freezer-glass-lid";
      freezerGlass.position.set(0, 0.025, 0.33);
      freezerLid.add(freezerGlass);
      for (const x of [-0.14, 0.14]) sb(x, 0.052, 0.6, 0.035, 0.04, 0.035, 6983563, freezerLid);
      sb(0, 0.085, 0.6, 0.34, 0.04, 0.035, 6983563, freezerLid);
      snowBind(iceFreezer, "icecream");
      const popsicle = new THREE.Group();
      popsicle.name = "popsicle";
      popsicle.position.set(0, 0.57, 0);
      popsicle.userData.snowDynamic = true;
      iceFreezer.add(popsicle);
      sb(0, 0, 0, 0.027, 0.19, 0.018, 12821617, popsicle);
      const oldMilkIce = sb(0, 0.19, 0, 0.14, 0.28, 0.065, 15786943, popsicle);
      oldMilkIce.name = "rectangular-old-milk-popsicle";
      popsicle.visible = false;
      let freezerOpen = false, freezerAmount = 0;
      const freezerCycle = { phase: "closed", at: 0, lift: 0 };
      snowBind(popsicle, "takeIcecream");
      snowTown.add(bike);
      bike.position.set(0.45, 0.28, -3.86);
      bike.rotation.y = 0;
      bike.traverse((o) => {
        if (o.isMesh && o.material && !o.material.map) {
          o.material = o.material.clone();
          if (o.material.color.getHex() === 11258297) o.material.color.setHex(6913136);
        }
      });
      snowShop.add(windowFog);
      snowShop.add(fogHit);
      windowFog.visible = fogHit.visible = true;
      windowFog.material.opacity = 0.2;
      const villageBuildings = {}, villageMechanisms = { repairOpen: false, repairAmount: 0, grainOpen: false, grainAmount: 0, hearthOpen: false, hearthAmount: 0, ovenOpen: false, ovenAmount: 0, wheelAt: -100, woodAt: -100, homeOpen: false, homeAmount: 0, deliOpen: false, deliAmount: 0 };
      function villageRoot(key, name, x, z, w, d, rotation = 0) {
        const g = new THREE.Group();
        const cfg = snowLayout[key];
        g.position.set(cfg.x, 0, cfg.z);
        g.scale.setScalar(cfg.scale);
        g.rotation.y = cfg.yaw;
        g.name = name;
        g.userData.buildingKind = key;
        g.userData.footprint = [w, d];
        snowStatic.add(g);
        villageBuildings[key] = { root: g, name, width: w, depth: d };
        return g;
      }
      function villageShell(g, w, d, h, c, rearWindow = false) {
        sb(0, 0.43, 0, w + 0.15, 0.3, d + 0.15, 8355448, g);
        sb(-w / 2, h / 2 + 0.5, 0, 0.11, h, d, c, g);
        sb(w / 2, h / 2 + 0.5, 0, 0.11, h, d, c, g);
        if (!rearWindow) sb(0, h / 2 + 0.5, -d / 2, w, h, 0.11, c, g);
        sb(0, 0.59, 0, w, 0.045, d, 11969674, g);
      }
      function villageWindowWall(parent, { x = 0, z = 0, width, height, y, color, windowWidth, windowHeight, windowY = y, rotation = 0, curtain = false }) {
        const g = new THREE.Group();
        g.name = "wall-with-real-window-opening";
        g.position.set(x, 0, z);
        g.rotation.y = rotation;
        parent.add(g);
        const bottom = y - height / 2, top = y + height / 2, lower = windowY - windowHeight / 2, upper = windowY + windowHeight / 2, side = (width - windowWidth) / 2;
        for (const s of [-1, 1]) sb(s * (windowWidth + side) / 2, y, 0, side, height, 0.13, color, g);
        sb(0, (bottom + lower) / 2, 0, windowWidth, lower - bottom, 0.13, color, g);
        sb(0, (upper + top) / 2, 0, windowWidth, top - upper, 0.13, color, g);
        const window2 = villageWindow(g, 0, windowY, 0.095, windowWidth, windowHeight, { curtain, glassOnly: true });
        window2.name = "new-building-window";
        return window2;
      }
      function monoRoof(g, w, d, y, rise, c = 6583669) {
        const a = Math.atan2(rise, d), length = Math.hypot(d, rise);
        for (const [dy, h, color] of [[0, 0.1, c], [0.14, 0.19, snowWhite]]) {
          const o = sb(0, y + dy, 0, w + 0.38, h, length + 0.35, color, g);
          o.rotation.x = -a;
        }
        for (let i = 0; i < 9; i++) {
          const x = -w / 2 + i * w / 8;
          ball(x, y + rise / 2 + 0.15, d / 2 + 0.11, 0.21, 0.08, 0.14, snowWhite, g);
        }
      }
      function chimney(g, x, z, y) {
        const root = new THREE.Group();
        root.name = "interactive-chimney";
        g.add(root);
        sb(x, y - 0.48, z, 0.37, 1.05, 0.4, 8939869, root);
        for (const dx of [-0.19, 0.19]) sb(x + dx, y + 0.08, z, 0.07, 0.17, 0.48, 9270630, root);
        for (const dz of [-0.2, 0.2]) sb(x, y + 0.08, z + dz, 0.32, 0.17, 0.07, 9270630, root);
        const opening = sb(x, y + 0.04, z, 0.28, 0.014, 0.3, 2371898, root);
        opening.material = new THREE.MeshBasicMaterial({ color: 2371898 });
        for (const dx of [-0.2, 0.2]) sb(x + dx, y + 0.18, z, 0.07, 0.035, 0.48, snowWhite, root);
        smoke(x, y + 0.22, z, g);
        const q = { root, parent: g, origin: new THREE.Vector3(x, y + 0.25, z), at: -100, puffs: [] };
        for (let i = 0; i < 7; i++) {
          const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffMap, transparent: true, opacity: 0, depthWrite: false }));
          g.add(p);
          q.puffs.push(p);
        }
        snowBind(root, "chimney");
        root.traverse((o) => o.userData.chimney = q);
        snowChimneys.push(q);
        return root;
      }
      function villageWindow(g, x, y, z, w, h, { curtain = true, glassOnly = false } = {}) {
        const root = new THREE.Group();
        root.userData.snowWindow = { width: w, height: h };
        root.position.set(x, y, z);
        g.add(root);
        for (const xx of [-w / 2, w / 2]) sb(xx, 0, 0, 0.055, h + 0.1, 0.09, 8025189, root);
        for (const yy of [-h / 2, h / 2]) sb(0, yy, 0, w + 0.08, 0.055, 0.09, 8025189, root);
        sb(0, 0, 0.035, 0.035, h, 0.04, 9733228, root);
        sb(0, 0, 0.038, w, 0.035, 0.04, 9733228, root);
        sb(0, -h / 2 - 0.05, 0.04, w + 0.23, 0.12, 0.25, snowWhite, root);
        const pane2 = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshPhysicalMaterial({ color: 16177068, transparent: true, opacity: glassOnly ? 0.12 : 0.21, roughness: 0.2, depthWrite: false, side: THREE.DoubleSide }));
        pane2.position.z = 0.01;
        root.add(pane2);
        if (curtain) {
          const curtains = new THREE.Group();
          curtains.userData.snowDynamic = true;
          curtains.userData.open = false;
          curtains.userData.amount = 0;
          curtains.userData.width = w;
          root.add(curtains);
          for (const side of [-1, 1]) {
            const panel = sb(side * w * 0.25, 0, -0.055, w * 0.5, h * 0.99, 0.025, 11832432, curtains);
            panel.userData.side = side;
          }
          houseWindows.push(curtains);
          snowHit("window", 0, 0, 0.08, w, h, 0.08, root).userData.window = curtains;
        }
        return root;
      }
      function villageDoors(g, width, height, z, action, color) {
        const leaves = [];
        for (const side of [-1, 1]) {
          const pivot = new THREE.Group();
          pivot.position.set(side * width / 2, 0.55, z);
          pivot.userData.snowDynamic = true;
          g.add(pivot);
          const cx = -side * width / 4;
          sb(cx, height / 2, 0, width / 2 - 0.025, height, 0.075, color, pivot);
          for (let j = 0; j < 5; j++) sb(cx - width * 0.2 + j * width * 0.1, height / 2, 0.046, 0.013, height - 0.07, 0.012, 9009505, pivot);
          sb(cx, height * 0.73, 0.05, width * 0.39, 0.07, 0.025, 7040612, pivot);
          sb(cx, height * 0.22, 0.05, width * 0.39, 0.07, 0.025, 7040612, pivot);
          sb(-side * 0.09, height * 0.49, 0.064, 0.035, 0.22, 0.035, 12956043, pivot);
          snowBind(pivot, action);
          leaves.push({ root: pivot, side });
        }
        return leaves;
      }
      const residence = villageRoot("residence", "\u897F\u9662\u7095\u623F", -8.7, -4.7, 4.4, 3.3, 0.12);
      residence.scale.x *= 1.15;
      villageShell(residence, 4.4, 3.3, 2.05, 9991530, true);
      villageBuildings.residence.rearWindow = villageWindowWall(residence, { z: -1.65, width: 4.4, height: 2.05, y: 1.525, color: 9991530, windowWidth: 1.75, windowHeight: 0.95, windowY: 1.68, rotation: Math.PI, curtain: true });
      sb(0, 0.85, 1.65, 4.4, 0.58, 0.11, 9991530, residence);
      sb(0, 2.39, 1.65, 4.4, 0.32, 0.11, 9991530, residence);
      for (const [x, w] of [[-2.04, 0.33], [-0.57, 0.39], [0.57, 0.39], [2.04, 0.33]]) sb(x, 1.65, 1.65, w, 1.1, 0.11, 9991530, residence);
      roof(0, 0, 4.95, 3.83, 2.65, 0.9, residence);
      chimney(residence, 1.28, -0.41, 3.9);
      for (let y = 0.71; y < 2.5; y += 0.24) {
        sb(-2.26, y, 0, 0.012, 0.012, 3.2, 11374977, residence);
        if (y < 1.205 || y > 2.155) sb(0, y, -1.73, 4.35, 0.012, 8e-3, 11374977, residence);
        else for (const s of [-1, 1]) sb(s * 1.55, y, -1.73, 1.25, 0.012, 8e-3, 11374977, residence);
      }
      villageWindow(residence, -1.3, 1.68, 1.72, 1.05, 1);
      villageWindow(residence, 1.3, 1.68, 1.72, 1.05, 1, { curtain: true, glassOnly: true });
      label(0, 2.34, 1.75, 1.04, 0.17, "\u4E94\u798F\u4E34\u95E8", residence, "#a04a3b", "#e2c18c");
      for (const side of [-1, 1]) verticalLabel(side * 0.585, 1.43, 1.755, 0.14, 1.4, side < 0 ? "\u5E73\u5B89\u559C\u4E50" : "\u5C81\u5C81\u5E38\u5B89", residence, "#a04a3b", "#e2c18c");
      const homeDoor = new THREE.Group();
      homeDoor.position.set(-0.45, 0.49, 1.74);
      homeDoor.userData.snowDynamic = true;
      residence.add(homeDoor);
      sb(0.45, 0.87, 0, 0.9, 1.74, 0.045, 8680288, homeDoor);
      const homeFuCloth = sb(0.45, 1, 0.029, 0.33, 0.33, 0.012, 10766647, homeDoor);
      homeFuCloth.rotation.z = Math.PI / 4;
      const homeFu = label(0.45, 1, 0.04, 0.25, 0.25, "\u798F", homeDoor, "transparent", "#e6c48c");
      homeFu.rotation.z = Math.PI;
      snowBind(homeDoor, "homeDoor");
      villageBuildings.residence.entryDoor = homeDoor;
      sb(0, 2.25, 1.65, 0.9, 0.04, 0.13, 9991530, residence);
      sb(0, 0.455, 1.95, 1.46, 0.22, 0.42, 10988195, residence);
      sb(0, 0.28, 2.27, 1.58, 0.13, 0.22, 11712430, residence);
      sb(-1.24, 0.83, 0.35, 1.57, 0.52, 1.5, 12098424, residence);
      sb(-1.24, 1.11, 0.32, 1.54, 0.1, 1.42, 10646115, residence);
      for (const x of [-1.62, -1.06, -0.6]) sb(x, 1.17, -0.13, 0.25, 0.03, 0.37, 12952202, residence);
      sb(-1.65, 1.23, 0.71, 0.48, 0.15, 0.26, 13088146, residence);
      const hearth = new THREE.Group();
      hearth.position.set(1.28, 0.56, -0.3);
      residence.add(hearth);
      sb(0, 0.52, 0, 0.76, 1.04, 0.67, 8483688, hearth);
      sb(0, 1.08, 0, 0.89, 0.09, 0.78, 6186597, hearth);
      sc(0, 1.53, -0.11, 0.075, 0.84, 6843237, hearth);
      const hearthFire = sb(0, 0.62, 0.347, 0.48, 0.43, 0.025, 15114851, hearth, 1.25);
      const hearthDoor = new THREE.Group();
      hearthDoor.position.set(-0.29, 0.62, 0.38);
      hearthDoor.userData.snowDynamic = true;
      hearth.add(hearthDoor);
      sb(0.29, 0, 0, 0.59, 0.53, 0.055, 5661023, hearthDoor);
      sb(0.48, 0, 0.045, 0.035, 0.17, 0.035, 11704946, hearthDoor);
      snowBind(hearthDoor, "hearth");
      const homeLamp = new THREE.PointLight(16760700, 2.4, 4.6, 2);
      homeLamp.position.set(-0.5, 1.8, 0.2);
      residence.add(homeLamp);
      villageBuildings.residence.hearth = hearth;
      villageBuildings.residence.door = hearthDoor;
      const repair = villageRoot("repair", "\u540E\u8857\u4FEE\u7406\u94FA", -4.3, -10.55, 4.8, 3.2, -0.06);
      repair.scale.y *= 1.15;
      repair.position.y = 0.33 - 0.6125 * repair.scale.y;
      villageShell(repair, 4.8, 3.2, 1.95, 8360593);
      for (let x = -2.38; x < 2.4; x += 0.25) sb(x, 1.53, -1.67, 0.025, 1.92, 0.018, 10594977, repair);
      sb(-2.16, 1.51, 1.6, 0.47, 1.92, 0.11, 8360593, repair);
      sb(2.16, 1.51, 1.6, 0.47, 1.92, 0.11, 8360593, repair);
      sb(0, 2.35, 1.6, 4.8, 0.32, 0.11, 8360593, repair);
      monoRoof(repair, 4.8, 3.2, 2.7, 0.48);
      sb(0, 2.67, 1.6, 4.8, 0.43, 0.11, 8360593, repair);
      for (const x of [-2.4, 2.4]) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute([x, 2.44, -1.6, x, 2.44, 1.6, x, 2.94, 1.6, x, 2.46, -1.6], 3));
        geo.setIndex([0, 1, 2, 0, 2, 3]);
        geo.computeVertexNormals();
        const material = mat(8360593).clone();
        material.side = THREE.DoubleSide;
        repair.add(new THREE.Mesh(geo, material));
      }
      const repairShutter = new THREE.Group();
      repairShutter.position.set(0, 0.55, 1.7);
      repairShutter.userData.snowDynamic = true;
      repair.add(repairShutter);
      for (let j = 0; j < 15; j++) sb(0, (j + 0.5) * 1.86 / 15, 0, 3.76, 1.86 / 15 - 8e-3, 0.065, j % 2 ? 7569786 : 8622474, repairShutter);
      sb(0, 0.1, 0.06, 0.4, 0.05, 0.035, 12760719, repairShutter);
      snowBind(repairShutter, "repairDoor");
      const repairDoors = [{ root: repairShutter, side: 0 }];
      const repairRoll = sc(0, 2.53, 1.72, 0.15, 3.85, 7899008, repair);
      repairRoll.rotation.z = Math.PI / 2;
      snowBind(repairRoll, "repairDoor");
      const repairSign = label(0, 2.79, 1.82, 1.74, 0.14, "\u8865\u80CE \xB7 \u4FEE\u7406", repair, "#cfbf95", "#465957");
      snowBind(repairSign, "repairDoor");
      const repairLamp = new THREE.PointLight(16766368, 0.22, 4.6, 2);
      repairLamp.position.set(-0.4, 2, 0.1);
      repair.add(repairLamp);
      sb(-0.4, 2.24, 0.1, 0.36, 0.06, 0.22, 16766884, repair, 0.7);
      sb(-1.48, 1.05, -0.85, 1.55, 0.13, 0.7, 10979937, repair);
      for (const x of [-2, -0.94]) sb(x, 0.8, -0.85, 0.09, 0.5, 0.46, 7106920, repair);
      sb(-1.4, 1.66, -1.48, 1.65, 0.91, 0.07, 6977391, repair);
      for (let j = 0; j < 5; j++) {
        const x = -2.04 + j * 0.3;
        rod([x, 1.4, -1.39], [x, 1.89, -1.39], 0.023, 12696486, repair);
        if (j % 2) sb(x, 1.89, -1.39, 0.16, 0.075, 0.04, 10390378, repair);
        else {
          const o = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.016, 6, 12, Math.PI * 1.5), mat(12696486));
          o.position.set(x, 1.94, -1.37);
          repair.add(o);
        }
      }
      const repairBike = new THREE.Group();
      repairBike.name = "cargo-tricycle";
      repairBike.position.set(0.55, 0.58, 0.05);
      repair.add(repairBike);
      const repairWheels = [];
      for (const [x, z] of [[-0.46, -0.48], [0.46, -0.48], [0, 0.7]]) {
        const wheel2 = new THREE.Group();
        wheel2.position.set(x, 0.32, z);
        wheel2.userData.snowDynamic = true;
        repairBike.add(wheel2);
        const tire = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.042, 7, 22), mat(3688528));
        tire.rotation.y = Math.PI / 2;
        wheel2.add(tire);
        for (let j = 0; j < 9; j++) {
          const a = j * Math.PI / 4.5;
          rod([0, 0, 0], [0, Math.cos(a) * 0.28, Math.sin(a) * 0.28], 7e-3, 10989730, wheel2);
        }
        snowBind(wheel2, "repairWheel");
        repairWheels.push(wheel2);
      }
      sb(0, 0.61, -0.51, 0.96, 0.11, 0.8, 8033414, repairBike);
      for (const x of [-0.49, 0.49]) sb(x, 0.82, -0.51, 0.06, 0.34, 0.83, 8033414, repairBike);
      sb(0, 0.82, -0.93, 0.98, 0.34, 0.06, 8033414, repairBike);
      rod([0, 0.36, 0.7], [0, 0.86, 0.44], 0.035, 9085331, repairBike);
      rod([0, 0.86, 0.44], [0, 0.9, -0.04], 0.027, 9085331, repairBike);
      sb(0, 0.96, -0.04, 0.3, 0.09, 0.29, 6774608, repairBike);
      rod([-0.27, 1.02, 0.53], [0.27, 1.02, 0.53], 0.026, 11974564, repairBike);
      for (const x of [1.75, 2]) {
        const tire = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.065, 7, 20), mat(4608339));
        tire.position.set(x, 0.64, -0.9);
        repair.add(tire);
      }
      label(-1.47, 1.15, -0.47, 0.67, 0.14, "\u4FEE\u4FEE\u8FD8\u80FD\u9A91", repair, "#d7c5a2", "#67543c");
      villageBuildings.repair.doors = repairDoors;
      villageBuildings.repair.wheels = repairWheels;
      const grain = villageRoot("grain", "\u4E1C\u9662\u7CAE\u4ED3", 2.4, -10.3, 4.1, 3.3, -0.11);
      grain.scale.x *= 1.35;
      for (const x of [-1.7, 0, 1.7]) for (const z of [-1.25, 1.25]) sb(x, 0.54, z, 0.42, 0.52, 0.43, 9203812, grain);
      sb(0, 0.84, 0, 4.35, 0.16, 3.52, 9205595, grain);
      villageBuildings.grain.sideWindows = [];
      for (const side of [-1, 1]) villageBuildings.grain.sideWindows.push(villageWindowWall(grain, { x: side * 2.05, width: 3.3, height: 2.03, y: 1.93, color: 10191972, windowWidth: 2, windowHeight: 1.25, rotation: side * Math.PI / 2 }));
      sb(0, 1.93, -1.65, 4.1, 2.03, 0.13, 10191972, grain);
      for (let j = 0; j < 10; j++) {
        const y = 1 + j * 0.2;
        if (y < 1.305 || y > 2.555) {
          sb(-2.13, y, 0, 0.015, 0.022, 3.3, 6839112, grain);
          sb(2.13, y, 0, 0.015, 0.022, 3.3, 6839112, grain);
        } else for (const side of [-1, 1]) for (const end of [-1, 1]) sb(side * 2.13, y, end * 1.325, 0.015, 0.022, 0.65, 6839112, grain);
        sb(0, y, -1.73, 4.1, 0.022, 0.015, 6839112, grain);
      }
      sb(-1.75, 1.95, 1.65, 0.6, 2.03, 0.12, 10191972, grain);
      sb(1.75, 1.95, 1.65, 0.6, 2.03, 0.12, 10191972, grain);
      sb(0, 2.89, 1.65, 4.1, 0.32, 0.12, 10191972, grain);
      roof(0, 0, 4.65, 3.86, 3.12, 1.1, grain);
      const grainDoors = villageDoors(grain, 2.85, 1.76, 1.75, "grainDoor", 10124371);
      grainDoors.forEach(({ root }) => root.position.y = 0.94);
      sb(0, 0.43, 2.14, 1.8, 0.22, 0.48, 10725279, grain);
      sb(0, 0.66, 1.95, 1.65, 0.22, 0.36, 11645863, grain);
      label(0, 3.6, 1.951, 1.6, 0.2, "\u4E1C\u9662\u7CAE\u4ED3", grain, "#c6b28a", "#6f573a");
      const grainLamp = new THREE.PointLight(16764042, 0.15, 4.4, 2);
      grainLamp.position.set(0, 2.5, 0);
      grain.add(grainLamp);
      sb(0, 2.76, 0, 0.28, 0.08, 0.18, 16765595, grain, 0.6);
      const loft = label(0, 3.4, 1.69, 0.45, 0.37, "\u4E30", grain, "#977957", "#d9c69b");
      for (let j = 0; j < 8; j++) {
        const x = j % 2 ? -1.3 : 1.25, z = -0.95 + Math.floor(j / 2) * 0.52;
        ball(x, 1.2, z, 0.35, 0.38, 0.3, 12823932, grain);
        sc(x, 1.55, z, 0.12, 0.06, 10718563, grain);
      }
      sb(0, 1.06, -0.97, 0.96, 0.2, 0.65, 7628877, grain);
      for (let j = 0; j < 10; j++) ball(-0.36 + j % 4 * 0.23, 1.25, -1.12 + Math.floor(j / 4) * 0.19, 0.12, 0.09, 0.1, 13214313, grain);
      villageBuildings.grain.doors = grainDoors;
      const bakery = villageRoot("bakery", "\u96EA\u4E61\u719F\u98DF\u5E97", 8.8, -2.6, 4.7, 3, -0.12);
      villageShell(bakery, 4.7, 3, 2.04, 12892833);
      sb(-0.62, 0.93, 1.5, 3.22, 0.76, 0.11, 12892833, bakery);
      sb(-0.62, 2.41, 1.5, 3.22, 0.29, 0.11, 12892833, bakery);
      sb(-2.27, 1.68, 1.5, 0.18, 1.02, 0.12, 12892833, bakery);
      sb(1.06, 1.68, 1.5, 0.18, 1.02, 0.12, 12892833, bakery);
      sb(2.27, 1.53, 1.5, 0.18, 1.94, 0.12, 12892833, bakery);
      roof(0, 0, 5.18, 3.55, 2.65, 0.63, bakery);
      chimney(bakery, -1.66, -0.8, 3.7);
      villageWindow(bakery, -0.62, 1.77, 1.58, 2.99, 0.9, { curtain: false, glassOnly: true });
      const deliDoor = new THREE.Group();
      deliDoor.position.set(2.14, 0.55, 1.53);
      deliDoor.userData.snowDynamic = true;
      bakery.add(deliDoor);
      sb(-0.46, 0.85, 0, 0.92, 1.7, 0.065, 8878684, deliDoor);
      snowBind(deliDoor, "deliDoor");
      villageBuildings.bakery.entryDoor = deliDoor;
      label(-0.46, 1.2, 0.043, 0.55, 0.2, "\u6B63\u5B97", deliDoor, "#ceb88b", "#82593b");
      label(-0.45, 2.47, 1.67, 2.75, 0.26, "\u5364\u5473 \xB7 \u719F\u98DF", bakery, "#d9bd8c", "#7a4534");
      sb(-0.62, 1.25, 0.98, 2.81, 0.13, 0.78, 10848864, bakery);
      for (let j = 0; j < 7; j++) {
        const xx = -1.62 + j * 0.33;
        ball(xx, 1.39, 0.9, 0.14, 0.09, 0.2, [10248511, 10646096, 8539186][j % 3], bakery);
        if (j % 2 === 0) rod([xx, 1.42, 0.76], [xx + 0.05, 1.43, 0.66], 0.035, 12822144, bakery);
      }
      for (let j = 0; j < 5; j++) sb(-1.42 + j * 0.4, 1.38, 1.13, 0.24, 0.07, 0.19, j % 2 ? 12023634 : 11964525, bakery);
      const bakeryOven = new THREE.Group();
      bakeryOven.position.set(-0.86, 0.56, -0.65);
      bakery.add(bakeryOven);
      bakeryOven.name = "hollow-roasting-oven";
      bakeryOven.userData.snowDynamic = true;
      for (const side of [-1, 1]) sb(side * 0.645, 0.7, 0, 0.19, 1.4, 0.92, 10188385, bakeryOven);
      sb(0, 0.2575, 0, 1.1, 0.515, 0.92, 10188385, bakeryOven);
      sb(0, 1.2825, 0, 1.1, 0.235, 0.92, 10188385, bakeryOven);
      sb(0, 0.84, -0.435, 1.1, 0.65, 0.05, 6576971, bakeryOven);
      sb(0, 0.6, 0, 1.02, 0.035, 0.72, 6910051, bakeryOven);
      sb(0, 0.83, -0.4, 0.95, 0.48, 0.012, 12749388, bakeryOven, 0.3);
      const roastMeats = new THREE.Group();
      roastMeats.name = "meat-inside-oven";
      bakeryOven.add(roastMeats);
      for (let j = 0; j < 4; j++) {
        ball(-0.36 + j * 0.24, 0.7, 0.1, 0.09, 0.065, 0.14, 10906437, roastMeats);
        rod([-0.36 + j * 0.24, 0.73, 0.19], [-0.36 + j * 0.24, 0.75, 0.26], 0.018, 13350283, roastMeats);
      }
      villageBuildings.bakery.roastingOven = bakeryOven;
      villageBuildings.bakery.roastMeats = roastMeats;
      const ovenDoor = new THREE.Group();
      ovenDoor.position.set(0, 0.5, 0.51);
      ovenDoor.userData.snowDynamic = true;
      bakeryOven.add(ovenDoor);
      sb(0, 0.33, 0, 1.22, 0.65, 0.06, 6712160, ovenDoor);
      sb(0, 0.36, 0.052, 0.41, 0.05, 0.045, 11575677, ovenDoor);
      snowBind(ovenDoor, "oven");
      const foodLamp = new THREE.PointLight(16761220, 2.7, 4.3, 2);
      foodLamp.position.set(-0.6, 1.85, 0.45);
      bakery.add(foodLamp);
      const annex = new THREE.Group();
      annex.name = "deli-kitchen";
      annex.position.set(2.88, 0, -0.15);
      bakery.add(annex);
      sb(-0.48, 1.18, 0, 0.1, 1.3, 2.4, 10983289, annex);
      sb(0.48, 1.18, 0, 0.1, 1.3, 2.4, 10983289, annex);
      sb(0, 1.18, -1.2, 0.96, 1.3, 0.1, 10983289, annex);
      sb(0, 0.67, 1.2, 0.96, 0.28, 0.1, 10983289, annex);
      sb(0, 1.83, 1.2, 0.96, 0.22, 0.1, 10983289, annex);
      for (const x of [-0.43, 0.43]) sb(x, 1.28, 1.2, 0.12, 0.98, 0.1, 10983289, annex);
      monoRoof(annex, 1.22, 2.65, 2.07, 0.32, 7961192);
      villageWindow(annex, 0, 1.28, 1.26, 0.72, 0.78, { curtain: false, glassOnly: true });
      label(0, 1.81, 1.28, 0.7, 0.12, "\u540E\u53A8", annex, "#c4b18c", "#74563a");
      sb(0, 1, 0.58, 0.7, 0.08, 0.65, 12367259, annex);
      sc(0, 1.12, 0.58, 0.22, 0.16, 7831931, annex);
      villageBuildings.bakery.oven = ovenDoor;
      const woodshed = villageRoot("woodshed", "\u897F\u8FB9\u67F4\u706B\u68DA", -12.45, 0, 2.1, 2.15, 0.19);
      sb(0, 0.43, 0, 2.3, 0.23, 2.3, 9341307, woodshed);
      for (const x of [-1.04, 1.04]) for (const z of [-1.02, 1.02]) {
        const top = 2.1 - 0.05 / Math.cos(Math.atan2(0.36, 2.45)) + z * 0.36 / 2.45;
        const post = sb(x, (0.545 + top) / 2, z, 0.095, top - 0.545, 0.095, wood, woodshed);
        post.name = "roof-touching-woodshed-post";
      }
      sb(0, 1.18, -1.02, 2.1, 1.35, 0.07, 9468763, woodshed);
      for (let j = 0; j < 6; j++) sb(-1.02, 1.16, -0.86 + j * 0.34, 0.065, 1.15, 0.13, 9600352, woodshed);
      monoRoof(woodshed, 2.38, 2.45, 2.1, 0.36, 7042669);
      label(0, 1.91, 1.13, 1.06, 0.18, "\u67F4\u706B\u68DA", woodshed, "#c4b18a", "#665439");
      for (let layer = 0; layer < 5; layer++) for (let j = 0; j < 6; j++) {
        const o = sc(-0.76 + j * 0.28, 0.65 + layer * 0.19, -0.43, 0.105, 0.79, 10386771, woodshed);
        o.rotation.x = Math.PI / 2;
      }
      const woodBundle = new THREE.Group();
      woodBundle.position.set(0, 0.66, 0.5);
      woodBundle.userData.snowDynamic = true;
      woodshed.add(woodBundle);
      for (let j = 0; j < 5; j++) {
        const o = sc(-0.52 + j * 0.26, j % 2 ? 0.14 : 0, 0, 0.1, 0.77, 10781528, woodBundle);
        o.rotation.x = Math.PI / 2;
      }
      rod([-0.58, 0.16, 0], [0.58, 0.16, 0], 0.016, 11903357, woodBundle);
      snowBind(woodBundle, "woodBundle");
      villageBuildings.woodshed.bundle = woodBundle;
      function villageBuildingAction(action, t) {
        const pairs = { repairDoor: "repairOpen", grainDoor: "grainOpen", hearth: "hearthOpen", oven: "ovenOpen", homeDoor: "homeOpen", deliDoor: "deliOpen" };
        if (pairs[action]) {
          villageMechanisms[pairs[action]] = !villageMechanisms[pairs[action]];
          return true;
        }
        if (action === "repairWheel") {
          villageMechanisms.wheelAt = t;
          return true;
        }
        if (action === "woodBundle") {
          villageMechanisms.woodAt = t;
          return true;
        }
        return false;
      }
      function animateVillageBuildings(t, dt) {
        const v = villageMechanisms;
        for (const [a2, b] of [["repairAmount", "repairOpen"], ["grainAmount", "grainOpen"], ["hearthAmount", "hearthOpen"], ["ovenAmount", "ovenOpen"], ["homeAmount", "homeOpen"], ["deliAmount", "deliOpen"]]) v[a2] = THREE.MathUtils.damp(v[a2], v[b] ? 1 : 0, 4, dt);
        repairShutter.position.y = 0.55 + v.repairAmount * 1.86;
        repairShutter.scale.y = Math.max(0.03, 1 - v.repairAmount * 0.97);
        grainDoors.forEach(({ root, side }) => root.rotation.y = side * v.grainAmount * 1.33);
        homeDoor.rotation.y = -v.homeAmount * 1.5;
        deliDoor.rotation.y = v.deliAmount * 1.5;
        hearthDoor.rotation.y = -v.hearthAmount * 1.28;
        ovenDoor.rotation.x = v.ovenAmount * 1.42;
        homeLamp.intensity = 2 + v.hearthAmount * 0.8;
        repairLamp.intensity = 0.22 + v.repairAmount * 3.3;
        grainLamp.intensity = 0.15 + v.grainAmount * 3;
        const wa = t - v.wheelAt;
        if (wa >= 0 && wa < 6) repairWheels.forEach((o) => o.rotation.x += dt * 5.5 * Math.pow(1 - wa / 6, 2));
        const a = t - v.woodAt, p = a >= 0 && a < 5 ? Math.sin(a / 5 * Math.PI) : 0;
        woodBundle.position.z = 0.5 + p * 0.38;
        woodBundle.position.y = 0.66 + p * 0.17;
      }
      function resetVillageBuildings() {
        for (const k of ["repairOpen", "grainOpen", "hearthOpen", "ovenOpen", "homeOpen", "deliOpen"]) villageMechanisms[k] = false;
        for (const k of ["repairAmount", "grainAmount", "hearthAmount", "ovenAmount", "homeAmount", "deliAmount"]) villageMechanisms[k] = 0;
        villageMechanisms.wheelAt = villageMechanisms.woodAt = -100;
        repairShutter.position.y = 0.55;
        repairShutter.scale.y = 1;
        grainDoors.forEach(({ root }) => root.rotation.y = 0);
        homeDoor.rotation.y = deliDoor.rotation.y = hearthDoor.rotation.y = ovenDoor.rotation.x = 0;
        woodBundle.position.set(0, 0.6, 0.5);
        repairWheels.forEach((o) => o.rotation.x = 0);
      }
      function fenceLine(a, b, height = 0.8, parent = snowStatic, color = 8484702) {
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(len / 0.56);
        for (let i = 0; i <= n; i++) {
          const x = THREE.MathUtils.lerp(a[0], b[0], i / n), z = THREE.MathUtils.lerp(a[1], b[1], i / n);
          sb(x, 0.28 + height / 2, z, 0.075, height, 0.075, color, parent);
          ball(x, 0.3 + height, z, 0.085, 0.04, 0.085, snowWhite, parent);
        }
        for (const y of [0.53, height + 0.18]) rod([a[0], y, a[1]], [b[0], y, b[1]], 0.026, color, parent);
      }
      fenceLine([-14.289, -2.355], [-15.1, -2.355]);
      fenceLine([-15.1, -2.355], [-15.1, 3.35]);
      fenceLine([-15.1, 3.35], [-7.3, 3.35]);
      fenceLine([-7.711, -2.355], [-7.3, -2.355]);
      fenceLine([-7.3, -2.355], [-7.3, 1.8]);
      for (let j = 0; j < 9; j++) {
        const x = -2 + j * 0.5;
        if (Math.abs(x) < 0.8) continue;
        for (let k = 0; k < 3; k++) {
          const chili = ball(x, 2.48 - k * 0.14, 1.85, 0.035, 0.13, 0.035, 10768952, residence);
          chili.rotation.z = 0.2 * Math.sin(j + k);
        }
        if (j % 2) {
          for (let k = 0; k < 3; k++) ball(x + 0.14, 2.3 - k * 0.11, 1.87, 0.065, 0.065, 0.05, 14143666, residence);
        }
      }
      for (let layer = 0; layer < 4; layer++) for (let i = 0; i < 6; i++) {
        const o = sc(-9.8 + i * 0.25, 0.45 + layer * 0.17, -14.45, 0.1, 0.67, 10189649);
        o.rotation.x = Math.PI / 2;
      }
      const snowman = new THREE.Group();
      snowman.position.set(-8.1, 0.29, 1.4);
      snowTown.add(snowman);
      ball(0, 0.43, 0, 0.49, 0.46, 0.47, snowWhite, snowman);
      ball(0.02, 1, 0, 0.35, 0.34, 0.34, snowWhite, snowman);
      ball(0.04, 1.48, 0.02, 0.25, 0.25, 0.25, snowWhite, snowman);
      for (const x of [-0.05, 0.14]) ball(x, 1.54, 0.24, 0.026, 0.028, 0.019, 3752267, snowman);
      const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.22, 7), mat(13471061));
      carrot.rotation.x = Math.PI / 2;
      carrot.position.set(0.045, 1.45, 0.32);
      snowman.add(carrot);
      for (const y of [0.82, 1.02, 1.18]) ball(0.01, y, 0.33, 0.035, 0.035, 0.025, 5002071, snowman);
      sc(0, 1.22, 0, 0.34, 0.09, 10903117, snowman);
      sb(0.16, 1.06, 0.32, 0.14, 0.37, 0.04, 10903117, snowman);
      const snowHat = new THREE.Group();
      snowHat.position.set(0.04, 1.68, 0.02);
      snowHat.rotation.z = 0.16;
      snowman.add(snowHat);
      sc(0, 0, 0, 0.29, 0.065, 6315616, snowHat);
      sc(0, 0.14, 0, 0.2, 0.23, 6315616, snowHat);
      rod([-0.25, 1.02, 0], [-0.69, 1.27, 0.03], 0.025, wood, snowman);
      rod([0.26, 1.02, 0], [0.73, 1.32, 0], 0.025, wood, snowman);
      snowBind(snowman, "snowman");
      const shovel = new THREE.Group();
      shovel.position.set(-3.5, 0.31, 2.7);
      shovel.rotation.z = -0.24;
      snowTown.add(shovel);
      sb(0, 0.08, 0, 0.45, 0.24, 0.055, 8293008, shovel);
      rod([0, 0.18, 0], [0, 1.35, 0], 0.027, 10584671, shovel);
      sb(0, 1.35, 0, 0.25, 0.045, 0.045, 7233616, shovel);
      snowBind(shovel, "shovel");
      const stop = new THREE.Group();
      stop.name = "\u6751\u53E3\u73ED\u8F66\u7AD9";
      stop.position.set(-12, 0.28, 4.15);
      snowStatic.add(stop);
      for (const x of [-1.7, 1.7]) for (const z of [-0.48, 0.48]) sb(x, 1.23, z, 0.12, 2.46, 0.12, wood, stop);
      sb(0, 1.14, -0.49, 3.5, 1.95, 0.08, 9208177, stop);
      roof(0, 0, 3.95, 1.85, 2.63, 0.48, stop);
      sb(0, 0.56, 0, 2.9, 0.14, 0.53, 9598295, stop);
      for (const x of [-1.15, 1.15]) sb(x, 0.28, 0, 0.09, 0.56, 0.36, wood, stop);
      label(0, 2.32, 0.6, 2.05, 0.29, "\u96EA\u4E61 \xB7 \u6751\u53E3\u7AD9", stop, "#d8c7a1", "#624e41");
      label(0, 1.4, -0.435, 2.9, 0.22, "\u9996\u73ED 5:30\u3000\u672B\u73ED 18:30", stop, "#e0d7c3", "#655e53");
      snowHit("bus", 0, 1.25, 0.65, 3.5, 2.1, 0.12, stop);
      const notice = new THREE.Group();
      notice.name = "\u6751\u53E3\u516C\u544A\u680F";
      notice.position.set(12, 0.28, 4.15);
      snowStatic.add(notice);
      for (const x of [-1.35, 1.35]) sb(x, 1.22, 0, 0.12, 2.44, 0.12, wood, notice);
      sb(0, 1.6, 0, 2.8, 1.28, 0.1, 8096371, notice);
      roof(0, 0, 3.35, 0.9, 2.43, 0.25, notice);
      label(0, 2.33, 0.12, 1.75, 0.22, "\u96EA\u4E61 \xB7 \u516C\u544A\u680F", notice, "#d9c59d", "#66543a");
      for (const [x, t] of [[-0.84, "\u6751\u91CC\u6D88\u606F"], [0, "\u96EA\u4E61\u6765\u4FE1"], [0.84, "\u90BB\u91CC\u4E92\u52A9"]]) {
        const p = label(x, 1.65, 0.061, 0.69, 0.82, t, notice, "#e8ddc2", "#756a51");
        p.rotation.z = x * 0.04;
        ball(x, 2.04, 0.08, 0.025, 0.025, 0.018, 10705987, notice);
      }
      snowBind(notice, "notice");
      let villageSteamer, steamerLid, steamerOpen = false, steamerAmount = 0;
      {
        villageSteamer = new THREE.Group();
        villageSteamer.name = "edamame-peanut-stove";
        villageSteamer.position.set(9.45, 0.28, 0.15);
        snowTown.add(villageSteamer);
        sb(0, 0.29, 0, 0.88, 0.58, 0.79, 9205600, villageSteamer);
        for (let j = 0; j < 3; j++) sb(0, 0.12 + j * 0.17, 0.402, 0.86, 0.012, 6e-3, 12232073, villageSteamer);
        sb(0, 0.59, 0, 0.94, 0.055, 0.84, 5594968, villageSteamer);
        sb(0, 0.28, 0.405, 0.34, 0.22, 0.02, 4279108, villageSteamer);
        sb(0, 0.26, 0.42, 0.23, 0.1, 8e-3, 13275738, villageSteamer, 0.6);
        const potBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.35, 0.3, 24, 1, true), mat(7109744));
        potBowl.position.y = 0.8;
        villageSteamer.add(potBowl);
        sc(0, 0.655, 0, 0.35, 0.025, 6846058, villageSteamer);
        for (const x of [-0.48, 0.48]) {
          const h = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.018, 6, 14), mat(4675404));
          h.position.set(x, 0.86, 0);
          h.rotation.y = Math.PI / 2;
          villageSteamer.add(h);
        }
        const broth2 = new THREE.Mesh(new THREE.CircleGeometry(0.395, 28), new THREE.MeshPhysicalMaterial({ color: 12172418, transparent: true, opacity: 0.87, roughness: 0.27 }));
        broth2.rotation.x = -Math.PI / 2;
        broth2.position.y = 0.875;
        villageSteamer.add(broth2);
        for (let i = 0; i < 24; i++) {
          const a = i * 2.399, r = 0.31 * Math.sqrt((i + 0.5) / 24), x = Math.sin(a) * r, z = Math.cos(a) * r;
          if (i % 2) {
            const bean = ball(x, 0.898, z, 0.035, 0.025, 0.1, 8492630, villageSteamer);
            bean.rotation.y = a;
            for (const dz of [-0.04, 0.025]) ball(x + Math.sin(a) * dz, 0.918, z + Math.cos(a) * dz, 0.026, 0.012, 0.026, 10399077, villageSteamer);
          } else {
            for (const dz of [-0.027, 0.027]) ball(x + Math.sin(a) * dz, 0.9, z + Math.cos(a) * dz, 0.039, 0.027, 0.04, 12755568, villageSteamer);
          }
        }
        steamerLid = new THREE.Group();
        steamerLid.position.set(0, 0.96, -0.43);
        steamerLid.userData.snowDynamic = true;
        villageSteamer.add(steamerLid);
        sc(0, 0, 0.43, 0.45, 0.045, 8952202, steamerLid);
        ball(0, 0.035, 0.43, 0.405, 0.065, 0.405, 9544079, steamerLid);
        sb(0, 0.125, 0.43, 0.17, 0.055, 0.06, 4611148, steamerLid);
        snowBind(villageSteamer, "steamer");
        label(0, 0.43, 0.414, 0.67, 0.14, "\u6C34\u716E\u6BDB\u8C46\xB7\u82B1\u751F", villageSteamer, "#c5b58b", "#5c6448");
      }
      const frozenStall = new THREE.Group();
      frozenStall.name = "recognizable-frozen-meats";
      frozenStall.position.set(16.4, 0.28, 0.6);
      snowStatic.add(frozenStall);
      sb(0, 0.75, 0, 1.9, 0.13, 0.85, 9994081, frozenStall);
      for (const x of [-0.78, 0.78]) sb(x, 0.38, 0, 0.09, 0.75, 0.65, wood, frozenStall);
      for (let i = 0; i < 3; i++) {
        const x = -0.72 + i * 0.43;
        ball(x, 0.91, 0, 0.18, 0.11, 0.24, [11096389, 13274241, 10906720][i], frozenStall);
        ball(x - 0.02, 0.985, -0.02, 0.14, 0.035, 0.19, 14862001, frozenStall);
        for (let k = 0; k < 3; k++) {
          const stripe = ball(x - 0.09 + k * 0.07, 0.999, 0.02, 0.015, 8e-3, 0.16, 11561304, frozenStall);
          stripe.rotation.y = 0.3;
        }
        if (i === 2) {
          rod([x - 0.1, 0.94, 0.1], [x + 0.08, 1.02, 0.24], 0.027, 14143414, frozenStall);
        }
      }
      const goose = new THREE.Group();
      goose.name = "frozen-goose";
      goose.position.set(0.65, 0.91, 0);
      goose.rotation.y = 0.4;
      frozenStall.add(goose);
      ball(0, 0.03, 0, 0.17, 0.12, 0.26, 14667692, goose);
      for (const side of [-1, 1]) {
        ball(side * 0.15, 0.065, -0.01, 0.05, 0.065, 0.17, 13154455, goose);
        rod([side * 0.08, 0.02, -0.21], [side * 0.1, 0.05, -0.32], 0.025, 12359024, goose);
      }
      rod([0, 0.08, 0.19], [0, 0.23, 0.27], 0.045, 14206369, goose);
      ball(0, 0.25, 0.29, 0.063, 0.064, 0.08, 14534820, goose);
      ball(0, 0.235, 0.38, 0.045, 0.022, 0.056, 12027991, goose);
      for (const x of [-1, 1]) sb(x, 1.65, -0.39, 0.065, 2.7, 0.065, wood, frozenStall);
      sb(0, 2.8, -0.39, 2.05, 0.08, 0.08, wood, frozenStall);
      for (let i = 0; i < 6; i++) {
        const x = -0.75 + i * 0.3;
        rod([x, 2.74, -0.39], [x, 2.53, -0.39], 9e-3, 12428412, frozenStall);
        for (let j = 0; j < 2; j++) {
          sc(x, 2.35 - j * 0.35, -0.39, 0.062, 0.3, i % 2 ? 9193782 : 10315079, frozenStall, 12);
          ball(x, 2.5 - j * 0.35, -0.39, 0.062, 0.046, 0.062, 10315079, frozenStall);
          ball(x, 2.2 - j * 0.35, -0.39, 0.062, 0.046, 0.062, 10315079, frozenStall);
          rod([x, 2.2 - j * 0.35, -0.39], [x, 2.16 - j * 0.35, -0.39], 0.012, 13677964, frozenStall);
        }
      }
      label(0, 0.67, 0.455, 1.84, 0.17, "\u725B\u8089\xB7\u732A\u8089\xB7\u7F8A\u8089\xB7\u5927\u9E45", frozenStall, "#cbb68b", "#6b4d37");
      label(0, 2.83, -0.33, 1.5, 0.18, "\u9999\u80A0\xB7\u5E72\u80A0", frozenStall, "#cbb68b", "#6b4d37");
      const field = { x: -0.5, z: 13.5, w: 8.5, d: 5.4 };
      sb(field.x, 0.29, field.z, field.w, 0.04, field.d, 3155748);
      for (let i = 0; i < 15; i++) {
        const x = field.x - field.w / 2 + 0.25 + i * 0.57;
        sb(x, 0.325, field.z, 0.16, 0.03, field.d - 0.2, 4601644);
        for (let j = 0; j < 3; j++) ball(x, 0.34, field.z - 1.8 + j * 1.7, 0.1, 0.035, 0.48, snowWhite);
      }
      const scarecrow = new THREE.Group();
      scarecrow.name = "scarecrow";
      scarecrow.position.set(-0.4, 0.32, 13.5);
      snowTown.add(scarecrow);
      rod([0, 0, 0], [0, 2.55, 0], 0.045, wood, scarecrow);
      rod([-1, 1.65, 0], [1, 1.65, 0], 0.035, wood, scarecrow);
      sb(0, 1.55, 0, 0.58, 0.75, 0.25, 9339504, scarecrow);
      for (const s of [-1, 1]) {
        const sleeve = sb(s * 0.49, 1.67, 0, 0.56, 0.27, 0.28, 9339504, scarecrow);
        sleeve.rotation.z = s * 0.1;
      }
      ball(0, 2.15, 0, 0.23, 0.27, 0.19, 11838074, scarecrow);
      sc(0, 2.4, 0, 0.39, 0.065, 10586971, scarecrow);
      sc(0, 2.48, 0, 0.24, 0.16, 10586971, scarecrow);
      for (const x of [-0.075, 0.075]) ball(x, 2.18, 0.178, 0.027, 0.028, 0.015, 5001544, scarecrow);
      snowBind(scarecrow, "scarecrow");
      function pine(x, z, h) {
        if (x > 15.5 && z > -6 && z < 3 || onRoad(x, z, h * 0.24 + 0.2) || Math.abs(x - riverX) < 1.7 || Math.hypot(x, z) > 19.25) return;
        const g = new THREE.Group();
        g.position.set(x, 0.28, z);
        g.name = "red-pine-or-fir";
        snowStatic.add(g);
        sc(0, h * 0.36, 0, 0.1, h * 0.72, 7955793, g, 7);
        for (let j = 0; j < 3; j++) {
          const r = h * (0.24 - j * 0.05), y = h * (0.36 + j * 0.22), hh = h * 0.42;
          for (const [c, s, dy] of [[5401700, 1, 0], [snowWhite, 0.9, 0.18]]) {
            const o = new THREE.Mesh(new THREE.ConeGeometry(r * s, hh * s, 9), mat(c));
            o.position.y = y + dy;
            g.add(o);
          }
        }
        townTrees.push({ x, z, radius: h * 0.24, root: g });
      }
      for (const [x, z, h] of [[-16, -7.8, 4.6], [-15, -11.8, 4], [-12.6, -13.8, 4.5], [-8.8, -15.4, 4.3], [-4.5, -16.3, 4.1], [2.9, -17.3, 4.2], [8.8, -15.2, 4.6], [16, -9.5, 4], [17.3, -5, 3.9], [17.2, 0, 3.4], [-17.5, -2, 3.9], [-16.4, 2.2, 3], [-16.6, 8.1, 3], [15.1, 9.6, 3], [-13.1, 11.6, 5.9]]) pine(x, z, h);
      const winterWireSnow = new THREE.Group();
      winterWireSnow.name = "winter-wire-snow";
      winterWireSnow.userData.winterOnly = true;
      snowStatic.add(winterWireSnow);
      const powerPoles = [];
      for (const [x, z] of [[-13, -7.3], [13.1, -5.6]]) {
        const g = new THREE.Group();
        g.name = "snowy-power-pole";
        g.position.set(x, 0.28, z);
        snowStatic.add(g);
        sc(0, 2.95, 0, 0.11, 5.9, 9209723, g);
        sb(0, 5.63, 0, 1.25, 0.12, 0.15, 8550494, g);
        sb(0, 5.72, 0, 1.26, 0.06, 0.17, snowWhite, g);
        for (const xx of [-0.48, 0.48]) {
          sc(xx, 5.82, 0, 0.07, 0.27, 7966350, g);
          ball(xx, 5.98, 0, 0.09, 0.04, 0.09, snowWhite, g);
        }
        powerPoles.push(g);
      }
      for (const side of [-1, 1]) {
        const a = new THREE.Vector3(-13 + side * 0.48, 6.15, -7.3), b = new THREE.Vector3(13.1 + side * 0.48, 6.15, -5.6), pts = [];
        for (let i = 0; i <= 48; i++) {
          const u = i / 48, p = a.clone().lerp(b, u);
          p.y -= Math.sin(u * Math.PI) * 1.05;
          pts.push(p);
        }
        const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.016, 4, false), mat(4279381));
        wire.name = "sagging-overhead-wire";
        snowStatic.add(wire);
        for (let i = 3; i < 46; i += 7) {
          const p = pts[i];
          rod([p.x, p.y + 0.02, p.z], [pts[i + 2].x, pts[i + 2].y + 0.02, pts[i + 2].z], 0.023, snowWhite, winterWireSnow);
        }
      }
      const villageLeafTreeLayout = [[-17, -4, 4.5, true], [-14.9, -9.4, 4.2, true], [-10.7, -14.6, 4.6, true], [-2.5, -17.7, 4.4, true], [9.6, -16.1, 4.5, true], [17, -6.8, 4, true], [-17, 9.4, 4.2, true], [12, 10.3, 3.8, false]];
      const villageLeafTrees = [];
      for (const [x, z, h, birch] of villageLeafTreeLayout) {
        const root = new THREE.Group();
        root.name = birch ? "seasonal-birch" : "seasonal-shade-tree";
        root.position.set(x, 0.28, z);
        snowStatic.add(root);
        sc(0, h * 0.42, 0, birch ? 0.085 : 0.13, h * 0.84, birch ? 14011826 : 9008986, root);
        if (birch) for (let j = 0; j < 8; j++) sb((j % 2 ? 1 : -1) * 0.065, 0.45 + j * h * 0.09, 0.026, 0.055, 0.025, 0.07, 7760728, root);
        for (let i = 0; i < 6; i++) {
          const a = i * 2.4, r = i % 2 ? 0.5 : 0.32, tip = [Math.sin(a) * r, h * 0.76, Math.cos(a) * r];
          rod([0, h * 0.48, 0], tip, 0.035, 9075038, root);
          rod(tip, [tip[0] * 1.5, h * (0.88 + i % 3 * 0.025), tip[2] * 1.5], 0.018, 9075038, root);
        }
        villageLeafTrees.push({ root, x, z, h, birch });
      }
      pine(-10.6, -11.4, 3.5);
      pine(-5.2, -13.2, 3.8);
      pine(-7, -15.7, 3.8);
      const buildingPads = [{ x: 11.8, z: 12.7, w: 7, d: 6.2 }, { x: -0.7, z: 18, w: 2.5, d: 2.2 }, { x: -0.4, z: 9.45, w: 4.9, d: 1.3 }, { x: -0.25, z: -1.2, w: 8.8, d: 6.6 }, ...Object.entries(villageBuildings).map(([key, b]) => {
        const cfg = snowLayout[key];
        return { x: cfg.x, z: cfg.z, w: (b.width + 0.7) * cfg.scale, d: (b.depth + 1) * cfg.scale };
      })];
      function nearBuilding(x, z, r = 0.2) {
        return buildingPads.some((b) => Math.abs(x - b.x) < b.w / 2 + r && Math.abs(z - b.z) < b.d / 2 + r);
      }
      const bankKeys = /* @__PURE__ */ new Set();
      for (const s of roadSegments) {
        const dx = s.b[0] - s.a[0], dz = s.b[1] - s.a[1], len = Math.hypot(dx, dz), nx = -dz / len, nz = dx / len;
        for (let d = 0; d < len; d += 0.61) for (const side of [-1, 1]) {
          const x = s.a[0] + dx * d / len + nx * side * (s.width / 2 + 0.46), z = s.a[1] + dz * d / len + nz * side * (s.width / 2 + 0.32), key = Math.round(x * 2) + "," + Math.round(z * 2);
          if (bankKeys.has(key) || onRoad(x, z, 0.4) || nearBuilding(x, z, 0.15) || Math.abs(x - riverX) < 1.6 || Math.hypot(x, z) > 19.35) continue;
          bankKeys.add(key);
          snowbank(x, z, 0.26 + sr() * 0.12, 0.23 + sr() * 0.1, 0.11 + sr() * 0.09);
          roadsideBanks.push({ x, z, radius: 0.38 });
        }
      }
      for (let i = 0; i < 42; i++) {
        const a = sr() * Math.PI * 2, r = 17.5 + sr() * 1.7, x = Math.sin(a) * r, z = Math.cos(a) * r;
        if (onRoad(x, z, 1.7) || nearBuilding(x, z, 1) || Math.abs(x - riverX) < 1.8) continue;
        snowbank(x, z, 0.8 + sr() * 0.8, 0.6 + sr() * 0.8, 0.25 + sr() * 0.5);
        if (i % 3 === 0) for (let j = 0; j < 3; j++) rod([x, 0.35, z], [x + (j - 1) * 0.22, 0.7 + sr() * 0.25, z + 0.16], 0.013, 8485480);
      }
      for (let z = -18; z < 18; z += 0.65) for (const s of [-1, 1]) {
        const x = riverCenter(z) + s * 1.28;
        if (onRoad(x, z, 0.35) || Math.hypot(x, z) > 19.6 || bridges.some((b) => Math.abs(b.z - z) < b.depth / 2 + 0.55)) continue;
        snowbank(x, z, 0.24, 0.45, 0.18 + sr() * 0.1);
      }
      const lampPool = texture(128, 128, (c, W, H) => {
        const g = c.createRadialGradient(64, 64, 0, 64, 64, 63);
        g.addColorStop(0, "rgba(255,216,151,.22)");
        g.addColorStop(0.5, "rgba(255,216,151,.10)");
        g.addColorStop(1, "rgba(255,216,151,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      function townLamp(x, z, tall = false) {
        const h = tall ? 5.3 : 1.05, g = new THREE.Group();
        g.position.set(x, 0.31, z);
        snowStatic.add(g);
        sc(0, h / 2, 0, tall ? 0.055 : 0.045, h, 6517879, g);
        if (tall) rod([0, h - 0.12, 0], [0, h + 0.12, 0.92], 0.055, 6517879, g);
        sb(0, h, tall ? 0.92 : 0, tall ? 0.48 : 0.26, 0.11, tall ? 0.38 : 0.24, 6649199, g);
        sb(0, h - 0.06, tall ? 0.92 : 0, tall ? 0.3 : 0.17, 0.06, tall ? 0.24 : 0.17, 16766620, g, 0.9);
        const light = tall ? new THREE.SpotLight(16765595, 25, 9, 0.62, 0.7, 2) : new THREE.PointLight(16765595, 1.1, 2.7, 2);
        light.position.set(0, h - 0.1, tall ? 0.92 : 0);
        g.add(light);
        if (tall) {
          const target2 = new THREE.Object3D();
          target2.position.set(0, 0, 0.92);
          g.add(target2);
          light.target = target2;
        }
        const pool = new THREE.Mesh(new THREE.PlaneGeometry(tall ? 5 : 1.7, tall ? 5 : 1.7), new THREE.MeshBasicMaterial({ map: lampPool, transparent: true, depthWrite: false }));
        pool.rotation.x = -Math.PI / 2;
        pool.position.set(0, 0.015, tall ? 0.92 : 0);
        g.add(pool);
        lampObjects.push({ root: g, light, height: h, x, z });
      }
      townLamp(-15.3, 5.02, true);
      townLamp(14.5, 5.02, true);
      for (const [x, z] of [[-7.22, 4.4], [-1.3, 3.5], [9.05, -5.5], [2.75, -8.25], [-5.55, -6.55], [9.05, 4.25]]) townLamp(x, z);
      const roadMesh = buildUnifiedRoads();
      const winterRoadSurface = new THREE.Group();
      winterRoadSurface.name = "ploughed-winter-road";
      winterRoadSurface.userData.winterOnly = true;
      snowStatic.add(winterRoadSurface);
      const winterRoadPoly = clipPoly(clipPoly(perimeter, (p) => p.y >= 5.405, (a, b) => a.clone().lerp(b, (5.405 - a.y) / (b.y - a.y))), (p) => p.y <= 8.595, (a, b) => a.clone().lerp(b, (8.595 - a.y) / (b.y - a.y)));
      flatPolygon(winterRoadPoly, roadY + 4e-3, 6848141, winterRoadSurface);
      for (let x = -17.5; x < 18; x += 2.2) if (Math.abs(x - riverX) > 2.2) sb(x, roadY + 7e-3, 7, 0.86, 3e-3, 0.05, 14209203, winterRoadSurface);
      const skyline = document.createElement("canvas");
      skyline.width = 1600;
      skyline.height = 900;
      const sky = skyline.getContext("2d");
      function skylineShape(color, baseline, peak, seed2, forest = false) {
        sky.fillStyle = color;
        sky.beginPath();
        sky.moveTo(0, baseline);
        const count2 = forest ? 130 : 14;
        for (let i = 0; i <= count2; i++) {
          const x = i / count2 * 1600, y = baseline - peak * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.62 + seed2) * Math.cos(i * 0.19 + seed2)));
          if (forest) {
            sky.lineTo(x - 9, baseline);
            sky.lineTo(x, y);
            sky.lineTo(x + 9, baseline - 8);
          } else sky.lineTo(x, y);
        }
        sky.lineTo(1600, baseline + 100);
        sky.lineTo(0, baseline + 100);
        sky.closePath();
        sky.fill();
      }
      sky.filter = "blur(6px)";
      skylineShape("rgba(20,40,60,.65)", 430, 240, 2);
      skylineShape("rgba(19,41,58,.66)", 460, 150, 5);
      sky.filter = "blur(2.8px)";
      skylineShape("rgba(15,39,45,.71)", 505, 120, 9, true);
      skylineShape("rgba(13,33,40,.75)", 540, 96, 4, true);
      sky.filter = "none";
      sky.globalCompositeOperation = "destination-in";
      const mask = sky.createLinearGradient(0, 0, 0, 900);
      mask.addColorStop(0, "#fff");
      mask.addColorStop(0.48, "#fff");
      mask.addColorStop(0.58, "rgba(255,255,255,0)");
      mask.addColorStop(1, "rgba(255,255,255,0)");
      sky.fillStyle = mask;
      sky.fillRect(0, 0, 1600, 900);
      sky.globalCompositeOperation = "source-over";
      paintClouds = function(c, W, H, t) {
        const g = c.createRadialGradient(W * 0.48, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.75);
        g.addColorStop(0, "#53677d");
        g.addColorStop(0.55, "#2b4059");
        g.addColorStop(1, "#13283f");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        c.drawImage(skyline, 0, 0, W, H);
      };
      paintClouds(cloudCanvas.getContext("2d"), cloudCanvas.width, cloudCanvas.height, 0);
      roadNodes.clear();
      roadLinks.clear();
      const splitPoints = roadSegments.map((s) => [s.a, s.b]);
      for (let i = 0; i < roadSegments.length; i++) for (let j = i + 1; j < roadSegments.length; j++) {
        const a = roadSegments[i], b = roadSegments[j], av = Math.abs(a.a[0] - a.b[0]) < 1e-3, bv = Math.abs(b.a[0] - b.b[0]) < 1e-3;
        const inside = (p, s) => p[0] >= Math.min(s.a[0], s.b[0]) - 1e-3 && p[0] <= Math.max(s.a[0], s.b[0]) + 1e-3 && p[1] >= Math.min(s.a[1], s.b[1]) - 1e-3 && p[1] <= Math.max(s.a[1], s.b[1]) + 1e-3;
        if (av !== bv) {
          const p = av ? [a.a[0], b.a[1]] : [b.a[0], a.a[1]];
          if (inside(p, a) && inside(p, b)) {
            splitPoints[i].push(p);
            splitPoints[j].push(p);
          }
        } else for (const p of [a.a, a.b, b.a, b.b]) if (inside(p, a) && inside(p, b)) {
          splitPoints[i].push(p);
          splitPoints[j].push(p);
        }
      }
      splitPoints.forEach((points, i) => {
        const unique = [...new Map(points.map((p) => [nodeKey(p), p])).values()].sort((a, b) => Math.abs(roadSegments[i].a[0] - roadSegments[i].b[0]) < 1e-3 ? a[1] - b[1] : a[0] - b[0]);
        for (let j = 1; j < unique.length; j++) {
          const a = unique[j - 1], b = unique[j];
          for (const [p, q] of [[a, b], [b, a]]) {
            const k = nodeKey(p), v = nodeKey(q);
            roadNodes.set(k, p);
            roadNodes.set(v, q);
            if (!roadLinks.has(k)) roadLinks.set(k, []);
            roadLinks.get(k).push({ key: v, length: Math.hypot(q[0] - p[0], q[1] - p[1]) });
          }
        }
      });
      for (const z of [12.1, 13.1]) for (let x = -7.1; x < -5.65; x += 0.17) {
        const track = sb(x, 0.321, z, 0.13, 4e-3, 0.035, 8623517);
        track.name = "thin-tricycle-track";
      }
      sb(14.418, 0.39, 0.25, 1.3, 0.14, 0.35, 11252650);
      sb(14.418, 0.54, -0.1, 1.2, 0.18, 0.35, 12106666);
      sb(14.418, 0.72, -0.32, 1.1, 0.12, 0.2, 12698031);
      function fadeable(root) {
        const cache = /* @__PURE__ */ new Map(), items = [];
        root.traverse((o) => {
          if (!o.material) return;
          const list = Array.isArray(o.material) ? o.material : [o.material];
          const copy = list.map((m) => {
            if (!cache.has(m.uuid)) {
              const clone = m.clone();
              cache.set(m.uuid, clone);
              items.push({ m: clone, opacity: m.opacity, transparent: m.transparent, depthWrite: m.depthWrite });
            }
            return cache.get(m.uuid);
          });
          o.material = Array.isArray(o.material) ? copy : copy[0];
        });
        root.userData.fadeItems = items;
        root.userData.alpha = 1;
        return root;
      }
      function setAlpha(root, a) {
        a = THREE.MathUtils.clamp(a, 0, 1);
        root.visible = a > 1e-3;
        if (root.userData.alpha === a) return;
        root.userData.alpha = a;
        for (const q of root.userData.fadeItems || []) {
          q.m.opacity = q.opacity * a;
          q.m.transparent = q.transparent || a < 0.999;
          q.m.depthWrite = a < 0.999 ? false : q.depthWrite;
        }
      }
      function angleToward(a, b) {
        return a + Math.atan2(Math.sin(b - a), Math.cos(b - a));
      }
      const cave = new THREE.Group();
      cave.name = "fenced-bear-cave";
      cave.position.set(12.3, 0.28, -12);
      snowStatic.add(cave);
      ball(12.3, 0.6, -14.25, 2.65, 1.95, 1.12, snowShade);
      ball(12.3, 1.1, -14.32, 2.55, 1.55, 1.04, snowWhite);
      for (let i = 0; i < 9; i++) {
        const a = i / 8 * Math.PI, xx = Math.cos(a) * 1.42, yy = Math.sin(a) * 1.72;
        ball(xx, yy + 0.24, 0, 0.64, 0.64, 0.72, i % 2 ? 8227476 : 8950939, cave);
        if (i > 0 && i < 8) ball(xx, yy + 0.86, -0.02, 0.58, 0.2, 0.68, snowWhite, cave);
      }
      const darkCave = sb(0, 0.94, -0.67, 2.12, 1.85, 0.08, 1649208, cave);
      darkCave.material = new THREE.MeshBasicMaterial({ color: 1649208 });
      snowHit("bear", 0, 1.02, 0.44, 2.7, 2.15, 0.4, cave);
      for (let i = 0; i < 9; i++) foot(12.3 + (i % 2 ? -0.29 : 0.28), -11.5 + i * 0.3, 0, true);
      fenceLine([9.25, -8.2], [15.4, -8.2], 0.65, snowStatic, 9141085);
      for (const side of [-1, 1]) for (let j = 0; j < 3; j++) {
        ball(side * 1.45, 0.85, -0.65 - j * 0.55, 0.62, 1, 0.62, 8556954, cave);
        ball(side * 1.45, 1.8, -0.65 - j * 0.55, 0.67, 0.22, 0.65, snowWhite, cave);
      }
      for (let j = 0; j < 3; j++) {
        ball(0, 2, -0.55 - j * 0.55, 1.3, 0.48, 0.62, 8162197, cave);
        ball(0, 2.35, -0.55 - j * 0.55, 1.4, 0.21, 0.66, snowWhite, cave);
      }
      ball(0, 1.1, -2.1, 1.55, 1.35, 0.65, 7044746, cave);
      const bear = new THREE.Group();
      bear.name = "\u68D5\u718A";
      snowTown.add(bear);
      ball(0, 0.84, 0, 0.5, 0.58, 0.78, 9990228, bear);
      const bearHead = new THREE.Group();
      bearHead.position.set(0, 1.14, 0.57);
      bear.add(bearHead);
      ball(0, 0, 0, 0.42, 0.4, 0.4, 10845017, bearHead);
      ball(0, -0.13, 0.34, 0.25, 0.17, 0.2, 11242086, bearHead);
      ball(0, -0.09, 0.51, 0.1, 0.067, 0.065, 3487288, bearHead);
      for (const x of [-0.29, 0.29]) {
        ball(x, 0.32, -0.02, 0.13, 0.14, 0.11, 9990228, bearHead);
        ball(x * 0.68, 0.06, 0.32, 0.029, 0.032, 0.019, 2567730, bearHead);
      }
      const bearLegs = [];
      for (const x of [-0.32, 0.32]) for (const z of [-0.45, 0.45]) {
        const leg = new THREE.Group();
        leg.position.set(x, 0.6, z);
        bear.add(leg);
        ball(0, -0.22, 0, 0.16, 0.32, 0.18, 9003590, leg);
        ball(0, -0.49, 0.09, 0.19, 0.11, 0.25, 9332552, leg);
        bearLegs.push(leg);
      }
      snowBind(bear, "bear");
      fadeable(bear);
      setAlpha(bear, 0);
      const bearState = { phase: "hidden", at: 0, z: -0.75, fromZ: -0.75, fromYaw: 0, yaw: 0 };
      function callBear(t) {
        if (bearState.phase === "hidden") {
          Object.assign(bearState, { phase: "out", at: t, z: -0.75, fromZ: -0.75, yaw: 0 });
        } else if (!["turn", "in"].includes(bearState.phase)) {
          Object.assign(bearState, { phase: "turn", at: t, fromZ: bearState.z, fromYaw: bearState.yaw });
        }
      }
      function animateBear(t, dt) {
        const s = bearState, a = t - s.at;
        if (s.phase === "hidden") {
          setAlpha(bear, 0);
          return;
        }
        if (s.phase === "out") {
          s.z = THREE.MathUtils.lerp(-0.75, 1.65, THREE.MathUtils.smoothstep(a, 0, 5));
          s.yaw = 0;
          if (a >= 5) {
            s.phase = "wait";
            s.at = t;
          }
        } else if (s.phase === "wait") {
          bearHead.rotation.y = Math.sin(a * 1.2) * 0.1;
          if (a > 6) Object.assign(s, { phase: "turn", at: t, fromZ: s.z, fromYaw: s.yaw });
        } else if (s.phase === "turn") {
          s.yaw = THREE.MathUtils.lerp(s.fromYaw, angleToward(s.fromYaw, Math.PI), THREE.MathUtils.smoothstep(a, 0, 2.4));
          if (a >= 2.4) Object.assign(s, { phase: "in", at: t, fromZ: s.z });
        } else if (s.phase === "in") {
          s.z = THREE.MathUtils.lerp(s.fromZ, -0.75, THREE.MathUtils.smoothstep(a, 0, 5));
          if (a >= 5) s.phase = "hidden";
        }
        bear.position.set(12.3, 0.28, -12 + s.z);
        bear.rotation.y = s.yaw;
        bearLegs.forEach((o, i) => o.rotation.x = ["out", "in"].includes(s.phase) ? Math.sin(t * 3.7 + i * Math.PI) * 0.2 : 0);
        setAlpha(bear, s.phase === "hidden" ? 0 : THREE.MathUtils.smoothstep(s.z, -0.7, 0.25));
      }
      function face(parent, x, y, z, { female = false, driver: driver2 = false } = {}) {
        const h = new THREE.Group();
        h.name = female ? "grandma-face" : "grandpa-face";
        h.position.set(x, y, z);
        parent.add(h);
        ball(0, 0, 0, 0.17, 0.21, 0.16, 13216392, h);
        for (const xx of [-0.057, 0.057]) {
          ball(xx, 0.025, 0.148, 0.014, 0.018, 9e-3, 3161152, h);
          ball(xx, 0.069, 0.14, 0.03, 8e-3, 8e-3, 6708048, h);
        }
        ball(0, -0.012, 0.167, 0.023, 0.035, 0.028, 12755326, h);
        line([[-0.038, -0.075, 0.148], [0, -0.082, 0.16], [0.038, -0.075, 0.148]], 7561042, 1, h);
        if (female) {
          ball(0, -0.03, -0.105, 0.18, 0.205, 0.12, 10446421, h);
          ball(0, -0.18, -0.07, 0.15, 0.08, 0.1, 10446421, h);
          ball(0, 0.1, -0.02, 0.2, 0.16, 0.18, 10446421, h);
          for (const s of [-1, 1]) ball(s * 0.16, -0.035, -0.015, 0.07, 0.22, 0.15, 10446421, h);
          ball(0, -0.2, 0.05, 0.14, 0.06, 0.1, 10446421, h);
          for (const xx of [-0.11, 0.11]) ball(xx, -0.035, 0.148, 0.026, 0.015, 8e-3, 12749944, h);
        } else {
          sc(0, 0.19, 0, 0.2, 0.085, 6252646, h);
          sb(0, 0.15, 0.12, 0.35, 0.035, 0.17, 6844778, h);
          for (const xx of [-0.03, 0.03]) ball(xx, -0.047, 0.164, 0.032, 0.012, 0.012, 12960179, h);
        }
        return h;
      }
      function villager(female = false) {
        const root = new THREE.Group();
        root.name = female ? "\u8D2D\u7269\u7684\u5927\u5988" : "\u5750\u8F66\u7684\u5927\u7237";
        snowTown.add(root);
        const coat = female ? 10119003 : 7833470;
        ball(0, 1, 0, 0.26, 0.37, 0.2, coat, root);
        const head = face(root, 0, 1.48, 0.025, { female });
        sc(0, 1.29, 0, 0.2, 0.1, female ? 11568748 : 10191715, root);
        const legs = [], arms = [];
        for (const s of [-1, 1]) {
          const hip = new THREE.Group();
          hip.position.set(s * 0.125, 0.79, 0);
          root.add(hip);
          sb(0, -0.21, 0, 0.16, 0.42, 0.17, 5070181, hip);
          const knee = new THREE.Group();
          knee.position.y = -0.4;
          hip.add(knee);
          sb(0, -0.16, 0, 0.15, 0.33, 0.17, 5070181, knee);
          sb(0, -0.34, 0.055, 0.19, 0.13, 0.31, 4016462, knee);
          legs.push({ hip, knee });
          const arm = new THREE.Group();
          arm.position.set(s * 0.23, 1.18, 0);
          root.add(arm);
          rod([0, 0, 0], [s * 0.07, -0.41, 0.04], 0.064, coat, arm);
          ball(s * 0.07, -0.43, 0.04, 0.055, 0.065, 0.05, 12559235, arm);
          arms.push(arm);
        }
        const bag = new THREE.Group();
        bag.position.set(0.37, 0.6, 0.02);
        root.add(bag);
        sb(0, 0, 0, 0.3, 0.27, 0.24, female ? 12559490 : 10195576, bag);
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.012, 6, 14, Math.PI), mat(7958101));
        handle.position.y = 0.14;
        bag.add(handle);
        const breath = [];
        for (let i = 0; i < 3; i++) {
          const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffMap, transparent: true, opacity: 0, depthWrite: false }));
          root.add(p);
          breath.push(p);
        }
        fadeable(root);
        setAlpha(root, 0);
        return { root, head, legs, arms, bag, breath, stage: "hidden", at: 0, route: null, lastStep: -1, inside: false, female };
      }
      const grandma = villager(true), grandpa = villager(false), breadPerson = grandma, busPerson = grandpa;
      function beginWalk(p, points, t, next) {
        const route = [points[0]];
        for (let i = 1; i < points.length; i++) if (Math.hypot(points[i][0] - route[route.length - 1][0], points[i][1] - route[route.length - 1][1]) > 0.02) route.push(points[i]);
        p.route = { points: route, index: 1, from: route[0], start: t, phase: "turn", next, speed: p.female ? 1 : 1.08 };
        p.stage = "walking";
        p.inside = false;
      }
      function animateWalker(p, t, dt) {
        const r = p.route;
        let moving = false;
        if (p.stage === "walking" && r) {
          if (r.index >= r.points.length) {
            p.route = null;
            p.stage = r.next;
            p.at = t;
          } else {
            const a = r.points[r.index - 1], b = r.points[r.index], yawGoal = Math.atan2(b[0] - a[0], b[1] - a[1]);
            if (r.phase === "turn") {
              p.root.rotation.y += Math.atan2(Math.sin(yawGoal - p.root.rotation.y), Math.cos(yawGoal - p.root.rotation.y)) * Math.min(1, dt * 6);
              if (t - r.start > 0.55) {
                r.phase = "walk";
                r.start = t;
              }
            } else {
              const len = Math.hypot(b[0] - a[0], b[1] - a[1]), u = Math.min(1, (t - r.start) * r.speed / len);
              p.root.position.set(THREE.MathUtils.lerp(a[0], b[0], u), 0, THREE.MathUtils.lerp(a[1], b[1], u));
              moving = true;
              if (u >= 1) {
                r.index++;
                r.phase = "turn";
                r.start = t;
              }
            }
          }
        }
        let floor = walkHeight(p.root.position.x, p.root.position.z);
        if (Math.abs(p.root.position.x + 11.09) < 0.6 && p.root.position.z > 5.2 && p.root.position.z < 6.8 && busState.phase !== "hidden") floor = 0.318 + THREE.MathUtils.smoothstep(p.root.position.z, 5.2, 6.4) * 0.57;
        p.inside = Math.abs(p.root.position.x + 0.32) < 0.85 && p.root.position.z < 1.1 && p.root.position.z > -3.5 || Math.abs(p.root.position.x + 11) < 0.75 && p.root.position.z < -2.3 || Math.abs(p.root.position.x - 14.418) < 0.75 && p.root.position.z < -0.35 || Math.abs(p.root.position.x) < 0.9 && p.root.position.z < -10 || Math.abs(p.root.position.x + 11.09) < 0.6 && p.root.position.z > 5.9 && busState.phase !== "hidden";
        p.root.position.y = floor + 8e-3 + (moving ? Math.abs(Math.sin(t * 5.2)) * 0.016 : 0);
        for (let i = 0; i < 2; i++) {
          const phase = t * 5.2 + i * Math.PI;
          p.legs[i].hip.rotation.x = moving ? Math.sin(phase) * 0.35 : THREE.MathUtils.damp(p.legs[i].hip.rotation.x, 0, 8, dt);
          p.legs[i].knee.rotation.x = moving ? Math.max(0, -Math.sin(phase)) * 0.44 : 0;
          p.arms[i].rotation.x = moving ? -Math.sin(phase) * 0.15 : 0;
        }
        if (moving && !p.inside && p.root.visible) {
          const step = Math.floor(t * 5.2 / Math.PI);
          if (step !== p.lastStep) {
            p.lastStep = step;
            snowFootstep(6e-3);
            stampWalkerSnow(p, t, step);
          }
        }
        const breathPhase = (t + (p.female ? 2.2 : 0)) % 8.5;
        p.breath.forEach((o, i) => {
          const a = breathPhase - i * 0.16;
          o.visible = !p.inside && p.root.visible && a >= 0 && a < 1.9;
          const k = Math.max(0, a) / 1.9;
          o.position.set(Math.sin(p.root.rotation.y) * 0, 1.45 + k * 0.17, 0.22 + k * 0.25);
          o.scale.setScalar(0.04 + k * 0.22);
          o.material.opacity = o.visible ? Math.sin(k * Math.PI) * 0.19 : 0;
        });
      }
      function setPersonPosition(p, x, z, yaw2 = 0) {
        p.root.position.set(x, walkHeight(x, z), z);
        p.root.rotation.y = yaw2;
      }
      const shopEntry = [-0.32, 1.65], shopInside = [-0.32, 0.06], homeEntry = [-11, -1.3], homeInside = [-11, -3.1], deliEntry = [14.418, 0.62], deliInside = [14.418, -1.8], grainEntry = [0, -9.25], grainInside = [0, -11.2], stopEntry = [-12, 5.2];
      const grandmaState = { next: performance.now() / 1e3 + 12 }, grandpaState = { hasRidden: false };
      const bus = new THREE.Group();
      bus.name = "transparent-window-minibus";
      snowTown.add(bus);
      const busLength = 4.9, busWidth = 2.3, busSafeX = Math.sqrt((townRadius - 0.18) ** 2 - (roadZ + busWidth / 2 + 0.08) ** 2) - busLength / 2;
      sb(0, 0.48, 0, 2.24, 0.18, 4.84, 7244168, bus);
      sb(-1.1, 0.91, 0, 0.12, 0.68, 4.8, 13093045, bus);
      sb(1.1, 0.91, -0.99, 0.12, 0.68, 2.82, 13093045, bus);
      sb(1.1, 0.91, 1.97, 0.12, 0.68, 0.83, 13093045, bus);
      for (const z of [-2.39, 2.39]) sb(0, 0.93, z, 2.27, 0.73, 0.12, 13093045, bus);
      sb(0, 2.38, 0, 2.38, 0.18, 4.95, snowWhite, bus);
      for (const s of [-1, 1]) for (const z of [-2.35, -1.55, -0.75, 0.05, 0.45, 1.45, 2.35]) sb(s * 1.1, 1.77, z, 0.08, 1.04, 0.065, 6914954, bus);
      const busGlass = new THREE.MeshPhysicalMaterial({ color: 10932444, transparent: true, opacity: 0.2, roughness: 0.12, side: THREE.DoubleSide, depthWrite: false });
      function busPane(x, y, z, w, h, ry = 0) {
        const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), busGlass);
        o.position.set(x, y, z);
        o.rotation.y = ry;
        bus.add(o);
        return o;
      }
      busPane(0, 1.77, 2.46, 2.18, 0.64);
      busPane(0, 1.77, -2.46, 2.18, 0.64, Math.PI);
      for (const s of [-1, 1]) for (const z of [-1.94, -1.15, -0.36, 1.94]) busPane(s * 1.165, 1.77, z, 0.76, 0.64, Math.PI / 2);
      for (const x of [-0.67, 0.67]) for (const z of [-1.58, -0.49, 0.48]) {
        sb(x, 0.78, z, 0.6, 0.14, 0.57, 8485474, bus);
        sb(x, 1.14, z - 0.23, 0.6, 0.64, 0.12, 8485474, bus);
      }
      sb(-0.5, 0.82, 1.45, 0.65, 0.17, 0.59, 7305067, bus);
      sb(-0.5, 1.18, 1.2, 0.65, 0.65, 0.13, 7305067, bus);
      const driver = face(bus, -0.5, 1.7, 1.48, { driver: true });
      sb(-0.5, 1.18, 1.5, 0.43, 0.58, 0.3, 8227456, bus);
      const busSteering = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.022, 7, 18), mat(5135457));
      busSteering.position.set(-0.5, 1.24, 1.95);
      busSteering.rotation.x = 0.65;
      bus.add(busSteering);
      sb(0, 1.17, 2.02, 2.05, 0.13, 0.36, 8030083, bus);
      for (const s of [-1, 1]) for (const z of [-1.45, 1.45]) {
        const w = sc(s * 1.12, 0.41, z, 0.4, 0.15, 3490893, bus);
        w.rotation.z = Math.PI / 2;
        const hub = sc(s * 1.21, 0.41, z, 0.2, 0.018, 12172462, bus);
        hub.rotation.z = Math.PI / 2;
      }
      for (const x of [-0.75, 0.75]) sb(x, 0.92, 2.465, 0.33, 0.19, 0.025, 16767903, bus, 0.8);
      label(0, 2.2, 2.47, 1.42, 0.19, "\u96EA\u4E61\u73ED\u8F66", bus, "#d2c8a6", "#516765");
      const busDoors = [];
      for (const s of [-1, 1]) {
        const d = new THREE.Group();
        d.position.set(1.18, 0.54, 0.91 + s * 0.255);
        bus.add(d);
        sb(0, 0.23, 0, 0.045, 0.46, 0.49, 7177867, d);
        sb(0, 1.44, 0, 0.045, 0.28, 0.49, 7177867, d);
        for (const zz of [-0.23, 0.23]) sb(0, 0.96, zz, 0.045, 0.94, 0.035, 7177867, d);
        const g = new THREE.Mesh(new THREE.PlaneGeometry(0.41, 0.76), busGlass);
        g.rotation.y = Math.PI / 2;
        g.position.set(0.027, 0.99, 0);
        d.add(g);
        busDoors.push({ root: d, side: s, rest: 0.91 + s * 0.255 });
      }
      sb(1.25, 0.39, 0.91, 0.41, 0.1, 1.03, 9214872, bus);
      for (const z of [0.43, 1.2]) busPane(-1.165, 1.77, z, 0.76, 0.64, Math.PI / 2);
      busPane(1.165, 1.77, 0.25, 0.34, 0.64, Math.PI / 2);
      for (const side of [-1, 1]) for (const [z, len] of side < 0 ? [[0, 4.8]] : [[-0.98, 2.84], [1.94, 0.92]]) {
        sb(side * 1.1, 1.35, z, 0.12, 0.22, len, 13093045, bus);
        sb(side * 1.1, 2.2, z, 0.12, 0.22, len, 13093045, bus);
      }
      for (const z of [-2.4, 2.4]) {
        sb(0, 1.35, z, 2.27, 0.22, 0.12, 13093045, bus);
        sb(0, 2.2, z, 2.27, 0.22, 0.12, 13093045, bus);
      }
      for (const [x, z, female] of [[0.67, -1.58, true], [-0.67, -0.49, false]]) {
        face(bus, x, 1.63, z, { female });
        sb(x, 1.21, z, 0.39, 0.54, 0.28, female ? 9856850 : 7175557, bus);
        for (const dx of [-0.12, 0.12]) {
          sb(x + dx, 0.91, z + 0.15, 0.14, 0.13, 0.36, 5135463, bus);
          sb(x + dx, 0.69, z + 0.29, 0.14, 0.4, 0.13, 5135463, bus);
        }
      }
      bus.rotation.y = Math.PI / 2;
      snowBind(bus, "bus");
      fadeable(bus);
      setAlpha(bus, 0);
      const busState = { phase: "hidden", at: 0, next: performance.now() / 1e3 + 28, x: -busSafeX, door: 0, boarding: false, trip: 0 };
      function startBus(t) {
        if (busState.phase === "hidden") Object.assign(busState, { phase: "arrive", at: t, x: -busSafeX, trip: busState.trip + 1 });
      }
      function animateBus(t, dt) {
        const s = busState, a = t - s.at;
        if (s.phase === "hidden" && t >= s.next) {
          startBus(t);
          return;
        }
        if (s.phase === "arrive") {
          s.x = THREE.MathUtils.lerp(-busSafeX, -12, THREE.MathUtils.smoothstep(a, 0, 5));
          if (a >= 5) {
            s.phase = "stop";
            s.at = t;
            s.departRequested = false;
          }
        } else if (s.phase === "stop") {
          s.x = -12;
          s.door = THREE.MathUtils.damp(s.door, s.departRequested ? 0 : 1, 6, dt);
          if (s.departRequested && grandpa.stage === "hidden" || a > 16 && !s.boarding && grandpa.stage !== "busEntered" && grandpa.stage !== "busFade") {
            s.phase = "close";
            s.at = t;
          }
        } else if (s.phase === "close") {
          s.door = THREE.MathUtils.damp(s.door, 0, 6, dt);
          if (s.door < 0.02) {
            s.phase = "leave";
            s.at = t;
          }
        } else if (s.phase === "leave") {
          s.x = THREE.MathUtils.lerp(-12, busSafeX, THREE.MathUtils.smoothstep(a, 0, 23));
          if (a > 23) {
            s.phase = "hidden";
            s.next = t + 64;
          }
        }
        bus.position.set(s.x, 0.32, 7);
        for (const d of busDoors) d.root.position.z = d.rest + d.side * s.door * 0.4;
        const alpha = s.phase === "hidden" ? 0 : Math.min(THREE.MathUtils.smoothstep(s.x, -busSafeX, -busSafeX + 1.25), 1 - THREE.MathUtils.smoothstep(s.x, busSafeX - 1.25, busSafeX));
        setAlpha(bus, alpha);
      }
      const dogRoot = new THREE.Group();
      dogRoot.name = "yard-local-dog";
      snowTown.add(dogRoot);
      ball(0, 0.55, 0, 0.25, 0.27, 0.48, 10123342, dogRoot);
      const yardDogHead = new THREE.Group();
      yardDogHead.name = "turning-dog-head";
      yardDogHead.position.set(0, 0.78, 0.36);
      yardDogHead.userData.snowDynamic = true;
      dogRoot.add(yardDogHead);
      ball(0, 0.01, 0, 0.24, 0.25, 0.24, 11635802, yardDogHead);
      ball(0, -0.09, 0.21, 0.14, 0.11, 0.17, 13019771, yardDogHead);
      ball(0, -0.06, 0.35, 0.07, 0.05, 0.045, 3424327, yardDogHead);
      for (const x of [-0.12, 0.12]) {
        ball(x, 0.06, 0.19, 0.019, 0.024, 0.012, 2700858, yardDogHead);
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.25, 3), mat(9136455));
        ear.position.set(x * 1.3, 0.27, -0.04);
        yardDogHead.add(ear);
      }
      const dogLegs = [];
      for (const x of [-0.16, 0.16]) for (const z of [-0.26, 0.26]) {
        const leg = sb(x, 0.25, z, 0.12, 0.47, 0.13, 9991500, dogRoot);
        dogLegs.push(leg);
      }
      const yardDogTail = new THREE.Group();
      yardDogTail.position.set(0, 0.62, -0.4);
      dogRoot.add(yardDogTail);
      rod([0, 0, 0], [0, 0.3, -0.24], 0.045, 10123342, yardDogTail);
      snowBind(dogRoot, "yardDog");
      let dogAt = -100;
      const dogState = { phase: "inside", at: 0, yaw: 0 };
      const sparrows = [];
      for (let i = 0; i < 9; i++) {
        const root = new THREE.Group();
        snowTown.add(root);
        ball(0, 0.07, 0, 0.075, 0.07, 0.11, 12688224, root);
        ball(0, 0.14, 0.075, 0.055, 0.055, 0.055, 11635538, root);
        ball(0, 0.135, 0.124, 0.02, 0.012, 0.035, 11575677, root);
        for (const x of [-0.023, 0.023]) ball(x, 0.15, 0.113, 7e-3, 9e-3, 5e-3, 3095872, root);
        const wings = [];
        for (const s of [-1, 1]) {
          const w = ball(s * 0.07, 0.08, 0, 0.09, 0.018, 0.07, 11109714, root);
          wings.push(w);
        }
        const home = [-3.8 + sr() * 6.4, 11.4 + sr() * 3.8], perch = [-13.1 + (sr() - 0.5) * 0.35, 11.6 + (sr() - 0.5) * 0.35];
        sparrows.push({ root, wings, home, perch, index: i });
      }
      let sparrowsAt = -100, scarecrowAt = -100;
      const sparrowCycleDuration = 14.25;
      function animateYardAndField(t, dt) {
        animateV3Dog(t, dt);
        const shakeAge = t - scarecrowAt, shake = shakeAge >= 0 && shakeAge < 2 ? Math.exp(-shakeAge * 2) * (1 - THREE.MathUtils.smoothstep(shakeAge, 1.2, 2)) : 0;
        scarecrow.rotation.z = Math.sin(shakeAge * 9) * 0.08 * shake;
        scarecrow.rotation.x = Math.sin(shakeAge * 7) * 0.025 * shake;
        for (const b of sparrows) {
          const a = t - sparrowsAt, duration = 3.8 + b.index * 0.05;
          let u = 0, fly = false, hidden = false;
          if (a >= 0 && a < duration) {
            u = THREE.MathUtils.smoothstep(a, 0, duration);
            fly = true;
          } else if (a >= duration && a < 10) {
            u = 1;
            hidden = b.destination === "tree";
          } else if (a >= 10 && a < 10 + duration) {
            u = 1 - THREE.MathUtils.smoothstep(a, 10, 10 + duration);
            fly = true;
          }
          const p = v4BirdCurve(b, u);
          b.root.visible = !hidden;
          b.root.position.copy(p);
          const tangent = v4BirdTangent(b, u);
          b.root.rotation.y = fly ? Math.atan2(tangent.x * (a < 10 ? 1 : -1), tangent.z * (a < 10 ? 1 : -1)) : b.destination === "roof" && u === 1 ? Math.PI * 0.5 : Math.sin(t * 0.5 + b.index) * 0.7;
          b.root.rotation.x = !fly ? Math.max(0, Math.sin(t * 3 + b.index)) * 0.2 : 0;
          b.wings.forEach((o, i) => o.rotation.z = fly ? Math.sin(t * 23 + b.index) * (i ? -0.9 : 0.9) : 0);
        }
      }
      const snowAudio = { ready: false, nextNote: 0, note: 0, wind: null, leaves: null, fire: null, footsteps: 0 };
      function initSnowAudio() {
        if (snowAudio.ready || !audioContext || !audioMaster) return;
        snowAudio.ready = true;
        function bed(type, freq, gain, rate) {
          const source = audioContext.createBufferSource();
          source.buffer = ambientNoise;
          source.loop = true;
          source.playbackRate.value = rate;
          const filter = audioContext.createBiquadFilter();
          filter.type = type;
          filter.frequency.value = freq;
          const g = audioContext.createGain();
          g.gain.value = gain;
          source.connect(filter);
          filter.connect(g);
          g.connect(audioMaster);
          source.start();
          return g;
        }
        snowAudio.wind = bed("lowpass", 450, 0.01, 0.65);
        snowAudio.leaves = bed("bandpass", 1600, 28e-4, 0.83);
        snowAudio.fire = bed("lowpass", 950, 25e-4, 1.31);
        snowAudio.nextNote = audioContext.currentTime + 2;
      }
      function snowFootstep(volume = 6e-3) {
        if ((audioContext == null ? void 0 : audioContext.state) === "running") {
          noiseTick(audioContext.currentTime + 0.01, 0.16, volume, 1050);
          snowAudio.footsteps++;
        }
      }
      function animateSnowAudio(t) {
        var _a2, _b2, _c2;
        if (!audioContext || audioContext.state !== "running") return;
        initSnowAudio();
        const now = audioContext.currentTime;
        for (const g of [rainBedGain, rainSwellGain, cityBedGain, carAudioGain, musicGain]) g == null ? void 0 : g.gain.setTargetAtTime(0, now, 0.2);
        (_a2 = snowAudio.wind) == null ? void 0 : _a2.gain.setTargetAtTime(8e-3 + Math.sin(t * 0.11) * 2e-3, now, 0.5);
        (_b2 = snowAudio.leaves) == null ? void 0 : _b2.gain.setTargetAtTime(18e-4 + Math.max(0, Math.sin(t * 0.17)) * 13e-4, now, 0.5);
        (_c2 = snowAudio.fire) == null ? void 0 : _c2.gain.setTargetAtTime(2e-3 + Math.max(0, Math.sin(t * 1.3) * Math.cos(t * 2.1)) * 2e-3, now, 0.2);
        if (now > snowAudio.nextNote) {
          const notes = [196, 246.94, 293.66, 369.99, 329.63, 246.94, 220, 293.66], f = notes[snowAudio.note++ % notes.length];
          softSnowNote(f, now + 0.02, 7e-3);
          softSnowNote(f * 2, now + 0.1, 16e-4);
          snowAudio.nextNote = now + 3.8 + snowAudio.note % 3 * 0.65;
        }
      }
      function softSnowNote(f, at, volume) {
        const o = audioContext.createOscillator(), g = audioContext.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(1e-4, at);
        g.gain.exponentialRampToValueAtTime(volume, at + 0.38);
        g.gain.exponentialRampToValueAtTime(1e-4, at + 4.8);
        o.connect(g);
        g.connect(audioMaster);
        o.start(at);
        o.stop(at + 4.9);
        o.onended = () => {
          o.disconnect();
          g.disconnect();
        };
      }
      function v5Stage(p, stage, t) {
        p.stage = stage;
        p.at = t;
      }
      function animateGrandma(t, dt) {
        const p = grandma;
        if (p.stage === "hidden" && t >= grandmaState.next) {
          setPersonPosition(p, ...homeInside, 0);
          v5Stage(p, "homeAppear", t);
          p.inside = true;
        }
        const a = t - p.at;
        switch (p.stage) {
          case "homeAppear":
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) {
              villageMechanisms.homeOpen = true;
              v5Stage(p, "homeOpen", t);
            }
            break;
          case "homeOpen":
            if (villageMechanisms.homeAmount > 0.94) beginWalk(p, [homeInside, homeEntry], t, "homeExited");
            break;
          case "homeExited":
            villageMechanisms.homeOpen = false;
            beginWalk(p, findRoute(homeEntry, deliEntry), t, "deliWaiting");
            break;
          case "deliWaiting":
            villageMechanisms.deliOpen = true;
            if (villageMechanisms.deliAmount > 0.94) beginWalk(p, [deliEntry, deliInside], t, "deliEntered");
            break;
          case "deliEntered":
            p.inside = true;
            villageMechanisms.deliOpen = false;
            if (villageMechanisms.deliAmount < 0.025) v5Stage(p, "deliFade", t);
            break;
          case "deliFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 8) v5Stage(p, "deliAppear", t);
            break;
          case "deliAppear":
            p.inside = true;
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) {
              villageMechanisms.deliOpen = true;
              v5Stage(p, "deliLeave", t);
            }
            break;
          case "deliLeave":
            if (villageMechanisms.deliAmount > 0.94) beginWalk(p, [deliInside, deliEntry], t, "deliExited");
            break;
          case "deliExited":
            villageMechanisms.deliOpen = false;
            beginWalk(p, findRoute(deliEntry, shopEntry), t, "shopWaiting");
            break;
          case "shopWaiting":
            doorTarget = 1;
            if (doorAmount > 0.95) beginWalk(p, [shopEntry, shopInside], t, "shopEntered");
            break;
          case "shopEntered":
            p.inside = true;
            doorTarget = 0;
            if (doorAmount < 0.025) v5Stage(p, "shopFade", t);
            break;
          case "shopFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 10) v5Stage(p, "shopAppear", t);
            break;
          case "shopAppear":
            p.inside = true;
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) {
              doorTarget = 1;
              p.bag.visible = true;
              v5Stage(p, "shopLeave", t);
            }
            break;
          case "shopLeave":
            if (doorAmount > 0.95) beginWalk(p, [shopInside, shopEntry], t, "shopExited");
            break;
          case "shopExited":
            doorTarget = 0;
            beginWalk(p, findRoute(shopEntry, homeEntry), t, "homeWaiting");
            break;
          case "homeWaiting":
            villageMechanisms.homeOpen = true;
            if (villageMechanisms.homeAmount > 0.94) beginWalk(p, [homeEntry, homeInside], t, "homeEntered");
            break;
          case "homeEntered":
            p.inside = true;
            villageMechanisms.homeOpen = false;
            if (villageMechanisms.homeAmount < 0.025) v5Stage(p, "homeFade", t);
            break;
          case "homeFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 1) {
              v5Stage(p, "hidden", t);
              grandmaState.next = t + 24;
            }
            break;
        }
        animateWalker(p, t, dt);
      }
      const grandpaHomeInside = [-10.48, -3.4];
      function animateGrandpa(t, dt) {
        const p = grandpa, b = busState;
        if (p.stage === "hidden" && b.phase === "stop" && b.door > 0.95 && !grandpaState.hasRidden) {
          setPersonPosition(p, -11.09, 6.45, Math.PI);
          setAlpha(p.root, 0);
          v5Stage(p, "busAppear", t);
          p.inside = true;
          grandpaState.hasRidden = true;
        }
        const a = t - p.at;
        switch (p.stage) {
          case "busAppear":
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) beginWalk(p, [[-11.09, 6.45], [-11.09, 5.78], stopEntry], t, "toGrain");
            break;
          case "toGrain":
            beginWalk(p, findRoute(stopEntry, grainEntry), t, "grainWaiting");
            break;
          case "grainWaiting":
            villageMechanisms.grainOpen = true;
            if (villageMechanisms.grainAmount > 0.94) beginWalk(p, [grainEntry, grainInside], t, "grainEntered");
            break;
          case "grainEntered":
            p.inside = true;
            villageMechanisms.grainOpen = false;
            if (villageMechanisms.grainAmount < 0.025) v5Stage(p, "grainFade", t);
            break;
          case "grainFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 9) v5Stage(p, "grainAppear", t);
            break;
          case "grainAppear":
            p.inside = true;
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) {
              villageMechanisms.grainOpen = true;
              v5Stage(p, "grainLeave", t);
            }
            break;
          case "grainLeave":
            if (villageMechanisms.grainAmount > 0.94) beginWalk(p, [grainInside, grainEntry], t, "grainExited");
            break;
          case "grainExited":
            villageMechanisms.grainOpen = false;
            beginWalk(p, findRoute(grainEntry, homeEntry), t, "homeWaiting");
            break;
          case "homeWaiting":
            villageMechanisms.homeOpen = true;
            if (villageMechanisms.homeAmount > 0.94) beginWalk(p, [homeEntry, grandpaHomeInside], t, "homeEntered");
            break;
          case "homeEntered":
            p.inside = true;
            villageMechanisms.homeOpen = false;
            if (villageMechanisms.homeAmount < 0.025) v5Stage(p, "homeFade", t);
            break;
          case "homeFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 7) v5Stage(p, "homeAppear", t);
            break;
          case "homeAppear":
            p.inside = true;
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) {
              villageMechanisms.homeOpen = true;
              v5Stage(p, "homeLeave", t);
            }
            break;
          case "homeLeave":
            if (villageMechanisms.homeAmount > 0.94) beginWalk(p, [grandpaHomeInside, homeEntry], t, "homeExited");
            break;
          case "homeExited":
            villageMechanisms.homeOpen = false;
            beginWalk(p, findRoute(homeEntry, stopEntry), t, "waitBus");
            break;
          case "waitBus":
            if (b.phase === "stop" && b.door > 0.95) {
              b.boarding = true;
              beginWalk(p, [stopEntry, [-11.09, 5.78], [-11.09, 6.45]], t, "busEntered");
            }
            break;
          case "busEntered":
            p.inside = true;
            b.boarding = false;
            b.departRequested = true;
            if (b.door < 0.025) v5Stage(p, "busFade", t);
            break;
          case "busFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 1) {
              v5Stage(p, "hidden", t);
              grandpaState.hasRidden = false;
            }
            break;
        }
        animateWalker(p, t, dt);
      }
      function keepHomeDoorClear() {
        const residents = [grandma, grandpa];
        if (residents.some((p) => p.stage === "homeFade" && p.root.userData.alpha > 1e-3 || p.stage === "homeAppear" && p.root.userData.alpha < 0.999)) {
          villageMechanisms.homeOpen = false;
          return;
        }
        if (residents.some((p) => {
          var _a2;
          return ["homeOpen", "homeWaiting", "homeLeave"].includes(p.stage) || p.stage === "walking" && ["homeEntered", "homeExited"].includes((_a2 = p.route) == null ? void 0 : _a2.next);
        })) villageMechanisms.homeOpen = true;
      }
      const v3Seals = new THREE.Group();
      v3Seals.name = "aligned-shop-wall-joints";
      snowShop.add(v3Seals);
      for (const o of snowShop.children.slice()) {
        const p = o.position;
        if (o.isMesh && (Math.abs(p.x - 0.92) < 1e-3 && Math.abs(p.y - 1.63) < 1e-3 || p.x >= 0.78 && p.x <= 1.09 && Math.abs(p.y - 1.72) < 1e-3 || Math.abs(p.x - 0.94) < 1e-3 && Math.abs(p.y - 1.82) < 1e-3)) o.removeFromParent();
      }
      const v3SoyFixtures = new THREE.Group();
      v3SoyFixtures.name = "front-soymilk-porridge";
      v3SoyFixtures.position.z = 0;
      v3SoyFixtures.userData.snowDynamic = true;
      snowShop.add(v3SoyFixtures);
      for (const o of snowShop.children.slice()) {
        const p = o.position;
        if (o.isMesh && (Math.abs(p.x - 0.41) < 1e-3 && p.y > 1.6 && p.y < 2.05 || Math.abs(p.x - 1.54) < 1e-3 && (Math.abs(p.y - 1.81) < 1e-3 || Math.abs(p.y - 1.91) < 1e-3) || o.userData.text === "\u70ED\u8C46\u6D46")) v3SoyFixtures.add(o);
        if (["\u8C46\u6D46\xB7\u70ED\u7CA5", "\u70ED\u6C64 \xB7 \u8C46\u5305", "\u304A\u3067\u3093\u30FB\u8089\u307E\u3093"].includes(o.userData.text)) o.removeFromParent();
        if (o.isMesh && Math.abs(p.x - 1.51) < 1e-3 && Math.abs(p.z + 2.29) < 1e-3) {
          if (Math.abs(p.y - 1.05) < 1e-3) {
            o.position.set(1.37, 1.08, -2.29);
            o.geometry = new THREE.BoxGeometry(1.6, 0.8, 0.74);
          } else if (Math.abs(p.y - 1.43) < 1e-3) {
            o.position.set(1.37, 1.51, -2.29);
            o.geometry = new THREE.BoxGeometry(1.7, 0.08, 0.8);
          }
        }
      }
      for (const o of [coffeeCup, coffeeSurface, coffeeStream, coffeeHit, sugarJar, eggPot, ...steam]) v3SoyFixtures.add(o);
      breakfast.position.set(0, 0.09, 0);
      for (const o of breakfast.children) if (o.position.y > 1.6 && o.position.y < 1.8) o.position.y += 0.014;
      label(0.88, 1.12, -0.39, 1.38, 0.15, "\u8C46\u6D46\xB7\u70ED\u7CA5", snowShop, "#66877f", "#f4ebd2");
      label(1.37, 1.12, -1.9, 1.5, 0.16, "\u65B0\u9C9C\u65E9\u9910", snowShop, "#66877f", "#f4ebd2");
      sb(2.34, 3.25, -1.5, 0.15, 0.53, 4.65, 12241337, v3Seals);
      sb(-4.55, 3.72, -1.55, 0.17, 0.52, 4.66, 12241350, v3Seals);
      sb(-1.15, 3.72, -3.8, 7.02, 0.52, 0.17, 14145219, v3Seals);
      sb(2.34, 3.73, -1.5, 0.15, 0.5, 4.65, 12241337, v3Seals);
      sb(-1.15, 3.77, 0.89, 7.45, 0.42, 0.46, 15788242, v3Seals);
      for (const x of [-4.55, 2.34]) for (const z of [-3.8, 0.8]) sb(x, 2.08, z, 0.18, 2.99, 0.18, 7438454, v3Seals);
      for (const child of residence.children.slice()) if (child.isMesh && Math.abs(child.position.y - 0.85) < 1e-3 && ((_a = child.geometry.parameters) == null ? void 0 : _a.width) === 4.4) child.removeFromParent();
      for (const x of [-1.33, 1.33]) sb(x, 0.85, 1.65, 1.74, 0.58, 0.13, 9991530, residence);
      for (const z of [-1.65, 1.65]) sb(0, 2.6, z, 4.51, 0.16, 0.15, 9991530, residence);
      for (const x of [-2.2, 2.2]) sb(x, 2.6, 0, 0.15, 0.16, 3.35, 9991530, residence);
      sc(1.28, 2.72, -0.41, 0.075, 1.55, 6843237, residence);
      homeFu.material.transparent = true;
      homeFu.material.depthWrite = false;
      for (const x of [-2.05, 2.05]) sb(x, 3.035, 0, 0.15, 0.23, 3.4, 10191972, grain);
      for (const z of [-1.65, 1.65]) sb(0, 3.035, z, 4.22, 0.23, 0.15, 10191972, grain);
      for (const x of [-2.35, 2.35]) sb(x, 2.6, 0, 0.15, 0.18, 3.1, 12892833, bakery);
      for (const z of [-1.5, 1.5]) sb(0, 2.6, z, 4.81, 0.18, 0.15, 12892833, bakery);
      sb(1.68, 2.43, 1.5, 1.15, 0.39, 0.15, 12892833, bakery);
      for (const x of [1.17, 2.19]) sb(x, 1.4, 1.52, 0.1, 1.78, 0.14, 9338980, bakery);
      const kitchenRoofAngle = Math.atan2(0.32, 2.65), kitchenUnder = (z) => 2.07 - 0.05 / Math.cos(kitchenRoofAngle) + z * 0.32 / 2.65;
      for (const x of [-0.48, 0.48]) {
        const x0 = x - 0.05, x1 = x + 0.05, z0 = -1.2, z1 = 1.2, y0 = 1.82, a = kitchenUnder(z0), b = kitchenUnder(z1), v = [[x0, y0, z0], [x1, y0, z0], [x1, a, z0], [x0, a, z0], [x0, y0, z1], [x1, y0, z1], [x1, b, z1], [x0, b, z1]], data = [];
        for (const face2 of [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [3, 2, 6, 7], [0, 3, 7, 4], [1, 5, 6, 2]]) for (const j of [0, 2, 1, 0, 3, 2]) data.push(...v[face2[j]]);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(data, 3));
        geo.computeVertexNormals();
        const cap = new THREE.Mesh(geo, mat(10983289));
        cap.name = "fitted-kitchen-wall-cap";
        annex.add(cap);
      }
      for (const [z, bottom] of [[-1.2, 1.83], [1.2, 1.94]]) {
        const top = kitchenUnder(z);
        sb(0, (bottom + top) / 2, z, 0.96, top - bottom, 0.1, 10983289, annex);
      }
      repairBike.position.y += 0.065;
      for (const o of repair.children) if (((_b = o.geometry) == null ? void 0 : _b.type) === "TorusGeometry" && o.position.x > 1.7) o.position.y = 1.02;
      for (const o of grain.children) {
        if (o.geometry === snowSphere && Math.abs(o.position.y - 1.2) < 1e-3) o.position.y += 0.11;
        else if (((_c = o.geometry) == null ? void 0 : _c.type) === "CylinderGeometry" && Math.abs(o.position.y - 1.55) < 1e-3) o.position.y += 0.11;
      }
      const v3GrainStock = new THREE.Group();
      v3GrainStock.name = "grain-vegetables-tools";
      grain.add(v3GrainStock);
      for (const [x, z] of [[-1.35, -1.1], [1.35, -1.1]]) {
        sb(x, 1.48, z, 0.67, 0.42, 0.68, 10189652, v3GrainStock);
        for (let j = 0; j < 4; j++) sb(x, 1.33 + j * 0.11, z + 0.35, 0.67, 0.025, 0.025, 7429187, v3GrainStock);
        for (let j = 0; j < 8; j++) {
          const a = j * 2.4;
          ball(x + Math.sin(a) * 0.21, 1.75, z + Math.cos(a) * 0.21, 0.1, 0.07, 0.09, x < 0 ? 11836260 : 9083496, v3GrainStock);
        }
      }
      for (const x of [-1.55, 1.55]) {
        sc(x, 1.18, 0.65, 0.26, 0.52, 9399373, v3GrainStock);
        for (const y of [1, 1.37]) sc(x, y, 0.65, 0.272, 0.035, 6645851, v3GrainStock);
        sc(x, 1.46, 0.65, 0.26, 0.045, 11111010, v3GrainStock);
      }
      sb(0, 1.65, -1.4, 0.8, 0.16, 0.26, 9337179, v3GrainStock);
      for (let j = 0; j < 5; j++) ball(-0.31 + j * 0.15, 1.79, -1.4, 0.055, 0.16, 0.055, 13741145, v3GrainStock);
      rod([-1.85, 0.95, -0.4], [-1.72, 2.15, -0.85], 0.022, 12034425, v3GrainStock);
      sb(-1.85, 0.98, -0.4, 0.25, 0.31, 0.055, 7964298, v3GrainStock);
      label(0, 2.14, -1.56, 0.84, 0.17, "\u6742\u7CAE \xB7 \u79CB\u83DC", v3GrainStock, "#a38d67", "#e5d3a8");
      rearBins.forEach((bin, i) => {
        bin.position.y = 0.28;
        bin.userData.category = i ? "PET" : "BEER";
      });
      rearBins[0].userData.contents.clear();
      for (let j = 0; j < 5; j++) {
        const g = new THREE.Group();
        g.position.set((j % 2 ? 1 : -1) * 0.08, 0.31, -0.11 + Math.floor(j / 2) * 0.1);
        g.rotation.z = (j % 2 ? 1 : -1) * 0.15;
        rearBins[0].userData.contents.add(g);
        sc(0, 0, 0, 0.046, 0.26, 6977872, g);
        sc(0, 0.17, 0, 0.024, 0.095, 6977872, g);
        sc(0, 0.225, 0, 0.026, 0.025, 11182971, g);
        sb(0, -0.01, 0.047, 0.062, 0.09, 4e-3, 13023373, g);
      }
      rearBins[0].userData.contents.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "recyclingBin";
          o.userData.bin = rearBins[0];
          interactionTargets.push(o);
        }
      });
      const kennel = new THREE.Group();
      kennel.name = "large-enterable-doghouse";
      kennel.position.set(-13.95, 0.28, -0.35);
      kennel.rotation.y = Math.PI / 2;
      kennel.scale.y = 1.15;
      snowStatic.add(kennel);
      sb(0, 0.04, 0, 1.56, 0.08, 1.85, 10719343, kennel);
      for (const x of [-0.76, 0.76]) sb(x, 0.67, 0, 0.1, 1.26, 1.85, 10059868, kennel);
      sb(0, 0.67, -0.88, 1.56, 1.26, 0.1, 10059868, kennel);
      for (const x of [-0.62, 0.62]) sb(x, 0.65, 0.89, 0.31, 1.22, 0.1, 10059868, kennel);
      sb(0, 1.25, 0.89, 1.56, 0.14, 0.1, 10059868, kennel);
      roof(0, 0, 1.86, 2.05, 1.33, 0.46, kennel);
      label(0, 1.43, 1.04, 0.49, 0.15, "\u65FA\u8D22", kennel, "#bb9e70", "#6f5239");
      snowBind(kennel, "yardDog");
      function animateV3Dog(t, dt) {
        const s = dogState, a = t - s.at;
        let z = 0, yaw2 = 0;
        dogRoot.visible = true;
        if (s.phase === "out") {
          z = THREE.MathUtils.lerp(0, 1.55, THREE.MathUtils.smoothstep(a, 0, 3));
          if (a >= 3) {
            s.phase = "wait";
            s.at = t;
          }
        } else if (s.phase === "wait") {
          z = 1.55;
          if (a > 8) {
            s.phase = "turn";
            s.at = t;
          }
        } else if (s.phase === "turn") {
          z = 1.55;
          yaw2 = Math.PI * THREE.MathUtils.smoothstep(a, 0, 1.8);
          if (a >= 1.8) {
            s.phase = "in";
            s.at = t;
          }
        } else if (s.phase === "in") {
          yaw2 = Math.PI;
          z = THREE.MathUtils.lerp(1.55, 0, THREE.MathUtils.smoothstep(a, 0, 3));
          if (a >= 3) s.phase = "inside";
        }
        const heading = kennel.rotation.y;
        dogRoot.position.set(kennel.position.x + Math.sin(heading) * z, 0.37, kennel.position.z + Math.cos(heading) * z);
        dogRoot.rotation.y = heading + yaw2;
        dogLegs.forEach((o, i) => o.rotation.x = ["out", "in"].includes(s.phase) ? Math.sin(t * 5 + i * Math.PI) * 0.18 : 0);
        yardDogTail.rotation.y = Math.sin(t * (s.phase === "inside" ? 1.2 : 7)) * 0.18;
        s.yaw = yaw2;
      }
      function animateV3Freezer(t, dt) {
        const s = freezerCycle;
        freezerAmount = THREE.MathUtils.damp(freezerAmount, freezerOpen ? 1 : 0, 5, dt);
        freezerLid.rotation.x = -freezerAmount * 1.4;
        if (s.phase === "opening" && freezerAmount > 0.97) {
          s.phase = "rising";
          s.at = t;
        }
        if (s.phase === "rising") {
          s.lift = THREE.MathUtils.damp(s.lift, 1, 5, dt);
          if (s.lift > 0.98) s.phase = "ready";
        } else if (s.phase === "taking") {
          if (t - s.at >= 0.75) {
            popsicle.visible = false;
            s.phase = "closing";
            freezerOpen = false;
          }
        } else if (s.phase === "closing" && freezerAmount < 0.012) {
          s.phase = "closed";
          s.lift = 0;
        }
        const take = s.phase === "taking" ? THREE.MathUtils.clamp((t - s.at) / 0.75, 0, 1) : 0;
        setAlpha(popsicle, ["rising", "ready", "taking"].includes(s.phase) && s.lift > 0.012 ? 1 - take : 0);
        popsicle.position.set(0, 0.33 + s.lift * 0.95 + take * 0.25, take * 0.65);
        popsicle.rotation.z = Math.sin(t * 1.8) * 0.025 * s.lift;
      }
      fadeable(popsicle);
      setAlpha(popsicle, 0);
      const iceHoleWater = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(iceHoleOutline), 48), new THREE.MeshPhysicalMaterial({ color: 2379106, roughness: 0.08, metalness: 0.18, transparent: true, opacity: 0.79, side: THREE.DoubleSide, depthWrite: false }));
      iceHoleWater.rotation.x = Math.PI / 2;
      iceHoleWater.position.set(iceHoleCenter.x, -0.165, iceHoleCenter.y);
      snowTown.add(iceHoleWater);
      snowBind(iceHoleWater, "koi");
      const v4RimPoints = iceHoleOutline.map((p) => new THREE.Vector3(p.x + iceHoleCenter.x, -0.105, p.y + iceHoleCenter.y));
      const v3IceRim = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v4RimPoints, true), 96, 0.024, 6, true), new THREE.MeshPhysicalMaterial({ color: 13232365, roughness: 0.17, metalness: 0.1 }));
      snowStatic.add(v3IceRim);
      for (let i = 0; i < 10; i++) {
        const p = iceHoleOutline[i * 6], o = ball(iceHoleCenter.x + p.x * 1.08, -0.092, iceHoleCenter.y + p.y * 1.08, 0.045, 0.013, 0.025, 14019052);
        o.rotation.y = i * 0.8;
      }
      const koi = new THREE.Group();
      koi.name = "breathing-red-white-koi";
      snowTown.add(koi);
      ball(0, 0, 0, 0.1, 0.1, 0.27, 15130568, koi);
      ball(-0.025, 0.075, 0.02, 0.065, 0.035, 0.11, 13129531, koi);
      ball(0.025, 0.03, 0.19, 0.075, 0.065, 0.08, 13129531, koi);
      for (const x of [-0.068, 0.068]) ball(x, 0.046, 0.19, 0.011, 0.012, 0.012, 2635579, koi);
      const v3KoiMouth = new THREE.Mesh(new THREE.TorusGeometry(0.028, 7e-3, 5, 12), mat(14072994));
      v3KoiMouth.position.set(0, 0.02, 0.265);
      koi.add(v3KoiMouth);
      const v3KoiTail = new THREE.Group();
      v3KoiTail.position.z = -0.23;
      koi.add(v3KoiTail);
      for (const side of [-1, 1]) {
        const fin = ball(side * 0.055, 0, -0.06, 0.07, 0.012, 0.1, 13207403, v3KoiTail);
        fin.rotation.y = side * 0.6;
        const pectoral = ball(side * 0.11, -0.015, 0.05, 0.08, 0.01, 0.1, 14135947, koi);
        pectoral.rotation.y = side * 0.55;
      }
      koi.visible = false;
      const koiState = { phase: "hidden", at: 0, next: performance.now() / 1e3 + 14 }, v3Ripples = [];
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.11, 0.118, 40), new THREE.MeshBasicMaterial({ color: 12048610, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(iceHoleCenter.x, -0.153, iceHoleCenter.y);
        snowTown.add(ring);
        v3Ripples.push(ring);
      }
      koi.traverse((o) => {
        if (o.isMesh) {
          o.material = o.material.clone();
          o.material.emissive.copy(o.material.color);
          o.material.emissiveIntensity = 0.48;
          o.castShadow = false;
        }
      });
      function animateV3Details(t, dt) {
        for (const q of snowChimneys) {
          const age2 = t - q.at;
          q.puffs.forEach((p, i) => {
            const a = age2 - i * 0.075, u = a / 2.8;
            p.visible = a >= 0 && u < 1;
            p.position.copy(q.origin);
            p.position.y += Math.max(0, u) * 1.8;
            p.position.x += Math.sin(i * 2.4) * Math.max(0, u) * 0.43;
            p.position.z += Math.cos(i * 2.4) * Math.max(0, u) * 0.32;
            p.scale.setScalar(0.23 + Math.max(0, u) * 1.05);
            p.material.opacity = p.visible ? Math.sin(u * Math.PI) * 0.58 : 0;
          });
        }
        const s = koiState;
        if (s.phase === "hidden" && t > s.next) {
          s.phase = "surface";
          s.at = t;
        }
        const age = t - s.at;
        if (s.phase === "surface") {
          koi.visible = true;
          const u = THREE.MathUtils.smoothstep(age, 0, 2) * (1 - THREE.MathUtils.smoothstep(age, 5.5, 8));
          koi.position.set(iceHoleCenter.x + Math.sin(age * 0.65) * 0.07, -0.53 + u * 0.37, iceHoleCenter.y + Math.cos(age * 0.55) * 0.05);
          koi.rotation.x = -0.45 * u;
          koi.rotation.y = Math.sin(age * 0.35) * 0.35;
          v3KoiTail.rotation.y = Math.sin(age * 5) * 0.2;
          v3KoiMouth.scale.setScalar(1 + Math.sin(age * 4) * 0.22);
          if (age > 8) {
            s.phase = "hidden";
            s.next = t + 22 + (Math.sin(t) * 0.5 + 0.5) * 12;
            koi.visible = false;
          }
        } else koi.visible = false;
        v3Ripples.forEach((r, i) => {
          const u = (age + i * 0.55) % 2 / 2;
          r.visible = s.phase === "surface" && age > 1.4 && age < 7;
          r.scale.setScalar(0.6 + u * 3.6);
          r.material.opacity = r.visible ? (1 - u) * 0.25 : 0;
        });
      }
      for (const b of sparrows) if (Math.abs(b.home[0] + 0.4) < 1.25 && Math.abs(b.home[1] - 13.5) < 0.65) b.home[1] = 12.45;
      for (const b of sparrows) {
        b.root.name = "golden-brown-sparrow";
        b.destination = b.index < 4 ? "roof" : "tree";
        let end;
        if (b.destination === "roof") {
          const x = -8.3 - b.index * 0.45, z = [11.15, 12.1, 13.1, 13.8][b.index], localZ = (x - repair.position.x) / repair.scale.z, y = repair.position.y + (2.7 + localZ * 0.48 / 3.2 + 0.245) * repair.scale.y;
          end = new THREE.Vector3(x, y + 0.025, z);
        } else end = new THREE.Vector3(-13.1 + (b.index - 6) * 0.09, 3.85 + b.index % 2 * 0.12, 11.6 + Math.sin(b.index) * 0.12);
        b.perch = [end.x, end.z];
        const start = new THREE.Vector3(b.home[0], 0.34, b.home[1]);
        b.flightCurve = new THREE.CubicBezierCurve3(start, new THREE.Vector3(start.x - 0.35, 6.1, start.z + (end.z - start.z) * 0.12), new THREE.Vector3(end.x + 2.25, 6.5, end.z + 0.1), end);
      }
      function v4BirdCurve(b, u) {
        return b.flightCurve.getPoint(u);
      }
      function v4BirdTangent(b, u) {
        return b.flightCurve.getTangent(u);
      }
      function v4Bench(x, z, yaw2 = 0) {
        const g = new THREE.Group();
        g.name = "snow-covered-roadside-bench";
        g.position.set(x, 0.28, z);
        g.rotation.y = yaw2;
        snowStatic.add(g);
        for (const xx of [-0.7, 0.7]) {
          sb(xx, 0.27, 0, 0.09, 0.54, 0.38, 6648172, g);
          sb(xx, 0.83, -0.23, 0.07, 0.73, 0.07, 6648172, g);
        }
        for (let j = 0; j < 3; j++) {
          sb(0, 0.57, -0.16 + j * 0.16, 1.85, 0.075, 0.14, 9598037, g);
          sb(0, 0.83 + j * 0.14, -0.25, 1.85, 0.115, 0.06, 9598037, g);
        }
        ball(-0.42, 0.619, -0.01, 0.39, 0.016, 0.18, snowWhite, g);
        ball(0.61, 0.62, 0.04, 0.25, 0.014, 0.13, snowWhite, g);
        ball(0, 1.185, -0.25, 0.88, 0.017, 0.065, snowWhite, g);
        return g;
      }
      const fieldBench = v4Bench(-1.5, 9.45, Math.PI), fieldBench2 = v4Bench(0.7, 9.45, Math.PI), parkBench = v4Bench(10.4, 9.15, Math.PI), parkBench2 = v4Bench(12.6, 9.15, Math.PI);
      const well = new THREE.Group();
      well.name = "black-soil-field-well";
      well.position.set(-0.7, 0.28, 18);
      snowStatic.add(well);
      for (let layer = 0; layer < 3; layer++) for (let j = 0; j < 14; j++) {
        const a = (j + layer % 2 * 0.5) / 14 * Math.PI * 2, o = sb(Math.cos(a) * 0.56, 0.12 + layer * 0.2, Math.sin(a) * 0.56, 0.24, 0.19, 0.21, j % 3 ? 9016216 : 10331556, well);
        o.rotation.y = -a;
      }
      const v4WellWater = new THREE.Mesh(new THREE.CircleGeometry(0.44, 32), new THREE.MeshPhysicalMaterial({ color: 2904158, roughness: 0.15, metalness: 0.1 }));
      v4WellWater.rotation.x = -Math.PI / 2;
      v4WellWater.position.y = 0.16;
      well.add(v4WellWater);
      for (const side of [-1, 1]) sb(side * 0.67, 1.12, 0, 0.1, 2.24, 0.12, wood, well);
      rod([-0.77, 1.67, 0], [0.77, 1.67, 0], 0.06, 9139284, well);
      rod([0.8, 1.67, 0], [0.8, 1.39, 0], 0.025, 7240053, well);
      rod([0.8, 1.39, 0], [0.99, 1.39, 0], 0.028, wood, well);
      roof(0, 0, 1.92, 1.4, 2.25, 0.3, well);
      for (let j = 0; j < 9; j++) {
        const a = j / 9 * Math.PI * 2;
        ball(Math.cos(a) * 0.55, 0.65, Math.sin(a) * 0.55, 0.16, 0.025, 0.12, snowWhite, well);
      }
      const v4WellBucket = new THREE.Group();
      v4WellBucket.position.set(0, 0.45, 0);
      v4WellBucket.userData.snowDynamic = true;
      well.add(v4WellBucket);
      sc(0, 0, 0, 0.15, 0.26, 8887196, v4WellBucket);
      const v4BucketHandle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.012, 5, 16, Math.PI), mat(11055265));
      v4BucketHandle.position.y = 0.13;
      v4WellBucket.add(v4BucketHandle);
      const v4WellRope = rod([0, 0.7, 0], [0, 1.67, 0], 0.012, 10259303, well);
      v4WellRope.userData.snowDynamic = true;
      label(0, 0.4, 0.69, 0.51, 0.16, "\u8001\u6C34\u4E95", well, "#bfae89", "#655039");
      snowBind(well, "well");
      const recreation = new THREE.Group();
      recreation.name = "snowy-village-exercise-corner";
      snowStatic.add(recreation);
      const v4Swing = new THREE.Group();
      v4Swing.name = "village-swing";
      v4Swing.position.set(9.8, 0.28, 14.4);
      recreation.add(v4Swing);
      for (const side of [-1, 1]) for (const z of [-0.75, 0.75]) rod([side * 1.25, 0, z], [side * 1.25, 2.6, 0], 0.065, 7308153, v4Swing);
      rod([-1.4, 2.6, 0], [1.4, 2.6, 0], 0.075, 7308153, v4Swing);
      ball(0, 2.68, 0, 1.4, 0.045, 0.09, snowWhite, v4Swing);
      const swingPivot = new THREE.Group();
      swingPivot.position.y = 2.53;
      swingPivot.userData.snowDynamic = true;
      v4Swing.add(swingPivot);
      for (const x of [-0.4, 0.4]) rod([x, 0, 0], [x, -1.78, 0], 0.014, 10463651, swingPivot);
      sb(0, -1.8, 0, 1.02, 0.09, 0.43, 10254419, swingPivot);
      ball(-0.25, -1.738, 0.02, 0.24, 0.017, 0.15, snowWhite, swingPivot);
      ball(0.31, -1.737, -0.06, 0.15, 0.014, 0.11, snowWhite, swingPivot);
      snowBind(v4Swing, "swing");
      const v4Seesaw = new THREE.Group();
      v4Seesaw.name = "village-seesaw";
      v4Seesaw.position.set(10.3, 0.28, 11.6);
      recreation.add(v4Seesaw);
      for (const x of [-0.27, 0.27]) rod([x, 0, -0.3], [0, 0.72, 0], 0.065, 6519926, v4Seesaw);
      for (const x of [-0.27, 0.27]) rod([x, 0, 0.3], [0, 0.72, 0], 0.065, 6519926, v4Seesaw);
      const seesawPivot = new THREE.Group();
      seesawPivot.position.y = 0.72;
      seesawPivot.userData.snowDynamic = true;
      v4Seesaw.add(seesawPivot);
      sb(0, 0, 0, 3.3, 0.12, 0.23, 10189910, seesawPivot);
      for (const side of [-1, 1]) {
        sb(side * 1.38, 0.08, 0, 0.49, 0.08, 0.45, 10906448, seesawPivot);
        rod([side * 1.1, 0.05, 0], [side * 1.1, 0.48, 0], 0.023, 7442310, seesawPivot);
        rod([side * 1.1, 0.48, -0.15], [side * 1.1, 0.48, 0.15], 0.022, 7442310, seesawPivot);
        ball(side * 1.4, 0.138, -0.03, 0.21, 0.016, 0.17, snowWhite, seesawPivot);
      }
      snowBind(v4Seesaw, "seesaw");
      const v4Fitness = new THREE.Group();
      v4Fitness.name = "elderly-fitness-equipment";
      v4Fitness.position.set(13.9, 0.28, 10.8);
      recreation.add(v4Fitness);
      for (const x of [-0.45, 0.45]) sc(x, 0.035, 0, 0.34, 0.07, 6848376, v4Fitness);
      sc(0, 0.92, -0.32, 0.065, 1.84, 7441795, v4Fitness);
      rod([-0.63, 1.14, -0.15], [0.63, 1.14, -0.15], 0.035, 7441795, v4Fitness);
      const twistDisc = new THREE.Group();
      twistDisc.userData.snowDynamic = true;
      twistDisc.position.set(-0.45, 0.09, 0);
      v4Fitness.add(twistDisc);
      sc(0, 0, 0, 0.29, 0.07, 10985866, twistDisc);
      sb(0, 0.04, 0, 0.42, 9e-3, 0.03, 7703419, twistDisc);
      ball(0.12, 0.046, -0.1, 0.11, 0.01, 0.1, snowWhite, twistDisc);
      snowBind(twistDisc, "fitness");
      const v4HandWheels = [];
      for (const [x, y, z] of [[0.48, 1.52, -0.31], [-0.35, 1.51, -0.31]]) {
        const wheel2 = new THREE.Group();
        wheel2.position.set(x, y, z);
        wheel2.userData.snowDynamic = true;
        v4Fitness.add(wheel2);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.025, 7, 24), mat(10203036));
        wheel2.add(ring);
        for (let j = 0; j < 3; j++) {
          const a = j * Math.PI * 2 / 3;
          rod([0, 0, 0], [Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0], 0.014, 10203036, wheel2);
        }
        rod([0.23, 0, 0], [0.23, 0, 0.1], 0.02, 11580835, wheel2);
        v4HandWheels.push(wheel2);
      }
      ball(0, 1.87, -0.32, 0.12, 0.025, 0.11, snowWhite, v4Fitness);
      snowBind(v4Fitness, "fitness");
      const pullUpBar = new THREE.Group();
      pullUpBar.name = "snowy-single-pull-up-bar";
      pullUpBar.position.set(13.3, 0.28, 13.5);
      recreation.add(pullUpBar);
      for (const x of [-0.75, 0.75]) {
        sc(x, 0.035, 0, 0.14, 0.07, 6913397, pullUpBar);
        sc(x, 1.18, 0, 0.055, 2.36, 8296844, pullUpBar);
        ball(x, 2.38, 0, 0.065, 0.025, 0.065, snowWhite, pullUpBar);
      }
      rod([-0.9, 2.36, 0], [0.9, 2.36, 0], 0.045, 8296844, pullUpBar);
      rod([-0.68, 2.406, 0], [0.45, 2.406, 0], 0.023, snowWhite, pullUpBar);
      pullUpBar.userData.footprint = [1.8, 0.3];
      const iceSled = new THREE.Group();
      iceSled.name = "bridge-to-bridge-ice-sled";
      iceSled.userData.snowDynamic = true;
      snowTown.add(iceSled);
      for (const x of [-0.23, 0.23]) {
        rod([x, 0.025, -0.49], [x, 0.025, 0.42], 0.023, 7899530, iceSled);
        rod([x, 0.025, 0.42], [x, 0.08, 0.54], 0.021, 7899530, iceSled);
        for (const z of [-0.3, 0.3]) rod([x, 0.025, z], [x, 0.12, z], 0.018, 7899530, iceSled);
      }
      for (let j = 0; j < 4; j++) sb(0, 0.115, -0.33 + j * 0.22, 0.62, 0.045, 0.18, 11241304, iceSled);
      for (const side of [-1, 1]) rod([side * 0.16, 0.16, -0.3], [side * 0.18, 0.16, 0.32], 0.014, 10258534, iceSled);
      sb(0, 0.175, -0.39, 0.59, 0.055, 0.07, 9794383, iceSled);
      ball(-0.18, 0.15, -0.25, 0.1, 9e-3, 0.08, snowWhite, iceSled);
      snowBind(iceSled, "iceSled");
      snowBind(riverIce, "iceSled");
      const iceSledState = { phase: "idle", at: 0, z: 3.5, from: 3.5, to: -7.5, side: "wood", yaw: Math.PI, fromYaw: Math.PI }, v4Motion = { swing: -100, seesaw: -100, fitness: -100, well: -100 };
      function snowV4Action(action, t) {
        if (action === "iceSled") {
          const s = iceSledState;
          if (s.phase === "idle") {
            s.from = s.z;
            s.to = s.side === "wood" ? -7.5 : 3.5;
            s.fromYaw = s.yaw;
            s.phase = "turn";
            s.at = t;
          }
          return true;
        }
        if (Object.prototype.hasOwnProperty.call(v4Motion, action)) {
          v4Motion[action] = t;
          return true;
        }
        return false;
      }
      function animateV4(t, dt) {
        for (const [key, root, axis, amplitude, speed] of [["swing", swingPivot, "x", 0.21, 1.9], ["seesaw", seesawPivot, "z", 0.15, 2.2], ["fitness", twistDisc, "y", 0.8, 2]]) {
          const a2 = t - v4Motion[key], envelope = a2 >= 0 && a2 < 14 ? Math.sin(Math.min(1, a2 / 0.65) * Math.PI / 2) * Math.exp(-a2 * 0.12) : 0;
          root.rotation[axis] = Math.sin(a2 * speed) * amplitude * envelope;
        }
        const fa = t - v4Motion.fitness;
        v4HandWheels.forEach((w, i) => w.rotation.z = fa >= 0 && fa < 14 ? Math.sin(fa * 1.7 + i) * 0.9 * Math.exp(-fa * 0.12) : 0);
        const wa = t - v4Motion.well, lift = wa >= 0 && wa < 6 ? Math.sin(wa / 6 * Math.PI) * 0.7 : 0;
        v4WellBucket.position.y = 0.45 + lift;
        v4WellRope.scale.y = Math.max(0.05, (0.97 - lift) / 0.97);
        v4WellRope.position.y = 1.185 + lift / 2;
        const s = iceSledState, a = t - s.at, forward = s.to > s.from;
        let desired = (forward ? 0 : Math.PI) + Math.atan2((riverCenter(s.z + 0.01) - riverCenter(s.z - 0.01)) / 0.02, 1);
        if (s.phase === "turn") {
          s.yaw = THREE.MathUtils.lerp(s.fromYaw, angleToward(s.fromYaw, desired), THREE.MathUtils.smoothstep(a, 0, 0.75));
          if (a >= 0.75) {
            s.phase = "slide";
            s.at = t;
          }
        } else if (s.phase === "slide") {
          s.z = THREE.MathUtils.lerp(s.from, s.to, THREE.MathUtils.smoothstep(a, 0, 7.5));
          s.yaw = desired;
          if (a >= 7.5) {
            s.phase = "idle";
            s.side = s.to < 0 ? "stone" : "wood";
          }
        }
        iceSled.position.set(riverCenter(s.z), -0.105, s.z);
        iceSled.rotation.y = s.yaw;
      }
      function resetV4() {
        Object.assign(iceSledState, { phase: "idle", at: 0, z: 3.5, from: 3.5, to: -7.5, side: "wood", yaw: Math.PI, fromYaw: Math.PI });
        for (const k of Object.keys(v4Motion)) v4Motion[k] = -100;
        swingPivot.rotation.x = seesawPivot.rotation.z = twistDisc.rotation.y = 0;
      }
      animateV4(performance.now() / 1e3, 0);
      animateV3Dog(performance.now() / 1e3, 0);
      const snowBootMap = texture(128, 256, (c, W, H) => {
        c.clearRect(0, 0, W, H);
        c.beginPath();
        c.moveTo(40, 220);
        c.bezierCurveTo(24, 212, 25, 167, 31, 139);
        c.bezierCurveTo(24, 100, 24, 43, 48, 27);
        c.bezierCurveTo(82, 9, 106, 39, 102, 89);
        c.lineTo(94, 159);
        c.lineTo(91, 215);
        c.quadraticCurveTo(67, 234, 40, 220);
        c.closePath();
        c.fillStyle = "rgba(59,82,103,.65)";
        c.fill();
        c.lineWidth = 4;
        c.strokeStyle = "rgba(66,91,111,.26)";
        c.stroke();
        c.beginPath();
        c.moveTo(37, 210);
        c.bezierCurveTo(30, 170, 38, 150, 34, 128);
        c.bezierCurveTo(29, 75, 33, 41, 48, 32);
        c.strokeStyle = "rgba(218,232,239,.30)";
        c.lineWidth = 3;
        c.stroke();
        c.strokeStyle = "rgba(58,83,103,.25)";
        c.lineWidth = 5;
        for (const y of [77, 108, 184, 203]) {
          c.beginPath();
          c.moveTo(44, y);
          c.lineTo(84, y - 4);
          c.stroke();
        }
      });
      const snowTyreMap = texture(64, 128, (c, W, H) => {
        const g = c.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, "rgba(101,122,137,0)");
        g.addColorStop(0.16, "rgba(101,122,137,.28)");
        g.addColorStop(0.5, "rgba(101,122,137,.38)");
        g.addColorStop(0.84, "rgba(101,122,137,.28)");
        g.addColorStop(1, "rgba(101,122,137,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        c.strokeStyle = "rgba(69,94,111,.18)";
        c.lineWidth = 3;
        for (let y = 8; y < H; y += 24) {
          c.beginPath();
          c.moveTo(13, y - 5);
          c.lineTo(32, y + 3);
          c.lineTo(51, y - 5);
          c.stroke();
        }
      });
      function snowTracePool(name, limit, w, h, map, lifetime) {
        const geometry = new THREE.PlaneGeometry(w, h), alphas = new Float32Array(limit), born = new Float64Array(limit);
        born.fill(-Infinity);
        geometry.setAttribute("snowTraceAlpha", new THREE.InstancedBufferAttribute(alphas, 1));
        const material = new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, color: 16777215, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
        material.onBeforeCompile = (shader) => {
          shader.vertexShader = "attribute float snowTraceAlpha; varying float vSnowTraceAlpha;\n" + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvSnowTraceAlpha=snowTraceAlpha;");
          shader.fragmentShader = "varying float vSnowTraceAlpha;\n" + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.a *= vSnowTraceAlpha;");
        };
        material.customProgramCacheKey = () => "snow-trace-opacity-v1";
        const mesh = new THREE.InstancedMesh(geometry, material, limit);
        mesh.name = name;
        mesh.count = 0;
        mesh.frustumCulled = false;
        mesh.renderOrder = 2;
        snowTown.add(mesh);
        return { mesh, alphas, born, lifetime, limit, cursor: 0, total: 0, active: 0 };
      }
      const snowTraces = { footprints: snowTracePool("fresh-walking-impressions", 256, 0.225, 0.36, snowBootMap, 46), tyres: snowTracePool("shallow-minibus-wheel-ruts", 512, 0.17, 0.3, snowTyreMap, 64), busRearX: NaN };
      const snowTraceDummy = new THREE.Object3D();
      function stampSnowTrace(pool, x, z, yaw2, t, y, opacity = 0.75) {
        if (Math.hypot(x, z) > 19.72) return;
        const i = pool.cursor;
        pool.cursor = (i + 1) % pool.limit;
        pool.total++;
        pool.born[i] = t;
        pool.alphas[i] = opacity;
        snowTraceDummy.position.set(x, y, z);
        snowTraceDummy.rotation.set(-Math.PI / 2, 0, yaw2 + Math.PI);
        snowTraceDummy.scale.set(1, 1, 1);
        snowTraceDummy.updateMatrix();
        pool.mesh.setMatrixAt(i, snowTraceDummy.matrix);
        pool.mesh.count = Math.min(pool.total, pool.limit);
        pool.mesh.instanceMatrix.needsUpdate = true;
        pool.mesh.geometry.attributes.snowTraceAlpha.needsUpdate = true;
      }
      function stampWalkerSnow(p, t, step) {
        if (p.inside || !p.root.visible || p.root.userData.alpha < 0.9) return;
        const yaw2 = p.root.rotation.y, side = step % 2 ? -0.125 : 0.125, x = p.root.position.x + Math.cos(yaw2) * side + Math.sin(yaw2) * 0.055, z = p.root.position.z - Math.sin(yaw2) * side + Math.cos(yaw2) * 0.055;
        if (Math.abs(x - riverCenter(z)) < riverWidth / 2 + 0.15 || bridges.some((b) => b.kind !== "modern" && Math.abs(x - riverX) < b.span / 2 + 0.1 && Math.abs(z - b.z) < b.depth / 2 + 0.08) || Math.abs(x + 11.09) < 0.6 && z > 5.65) return;
        stampSnowTrace(snowTraces.footprints, x, z, yaw2, t, walkHeight(x, z) + 0.01, 0.75);
      }
      function animateSnowTraces(t) {
        const rear = bus.position.x - 1.45, s = snowTraces;
        if (!["arrive", "leave"].includes(busState.phase) || !bus.visible || bus.userData.alpha < 0.25) s.busRearX = NaN;
        else if (!Number.isFinite(s.busRearX) || rear < s.busRearX || rear - s.busRearX > 1.8) s.busRearX = rear;
        else {
          while (rear - s.busRearX >= 0.28) {
            const x = s.busRearX + 0.14;
            for (const z of [roadZ - 1.12, roadZ + 1.12]) {
              const e = riverEdges(z);
              if (x < e.left || x > e.right) stampSnowTrace(s.tyres, x, z, Math.PI / 2, t, roadY + 8e-3, 0.55);
            }
            s.busRearX += 0.28;
          }
        }
        for (const pool of [s.footprints, s.tyres]) {
          let active = 0;
          for (let i = 0; i < pool.mesh.count; i++) {
            const age = t - pool.born[i], cover = age >= 0 ? Math.pow(1 - THREE.MathUtils.smoothstep(age, 3, pool.lifetime), 1.65) : 0;
            pool.alphas[i] = cover * (pool === s.footprints ? 0.75 : 0.55);
            if (pool.alphas[i] > 2e-3) active++;
          }
          pool.active = active;
          pool.mesh.geometry.attributes.snowTraceAlpha.needsUpdate = true;
        }
      }
      function clearSnowTraces() {
        snowTraces.busRearX = NaN;
        for (const p of [snowTraces.footprints, snowTraces.tyres]) {
          p.cursor = p.total = p.active = 0;
          p.mesh.count = 0;
          p.born.fill(-Infinity);
          p.alphas.fill(0);
          p.mesh.geometry.attributes.snowTraceAlpha.needsUpdate = true;
        }
      }
      Object.assign(snowTraces, { update: animateSnowTraces, clear: clearSnowTraces });
      const softLanternMap = texture(128, 128, (c, W, H) => {
        const g = c.createRadialGradient(W / 2, H / 2, 3, W / 2, H / 2, W * 0.48);
        g.addColorStop(0, "rgba(255,216,157,.32)");
        g.addColorStop(0.42, "rgba(255,216,157,.16)");
        g.addColorStop(0.74, "rgba(255,216,157,.05)");
        g.addColorStop(1, "rgba(255,216,157,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      const softWindowMap = texture(128, 128, (c, W, H) => {
        c.clearRect(0, 0, W, H);
        for (let y = 0; y < H; y++) {
          const v = y / H, width = 0.24 + 0.2 * v, fade = Math.sin(v * Math.PI) * 0.3;
          for (let x = 0; x < W; x++) {
            const u = x / W - 0.5, edge = 1 - THREE.MathUtils.smoothstep(Math.abs(u), width - 0.09, width), bar = Math.abs(u) < 0.014 ? 0.34 : 1;
            c.fillStyle = "rgba(255,222,169," + fade * edge * bar + ")";
            c.fillRect(x, y, 1, 1);
          }
        }
      });
      function softSnowHeight(x, z) {
        const lx = x - snowShop.position.x, lz = z - snowShop.position.z;
        if (lx >= -4.66 && lx <= 2.36 && lz >= 0.525 && lz <= 1.775) return 0.57;
        if (lx >= -2.145 && lx <= -0.295 && lz >= 1.655 && lz <= 2.145) return 0.545;
        if (lx >= -2.22 && lx <= -0.22 && lz >= 2.075 && lz <= 2.425) return 0.415;
        return onRoad(x, z) ? walkHeight(x, z) : 0.28;
      }
      function snowSpill(x, z, rx, rz, map, opacity, name) {
        const xs = [x - rx, x + rx], zs = [z - rz, z + rz], data = [], uv2 = [];
        for (let i = 1; i < 9; i++) {
          xs.push(x - rx + 2 * rx * i / 9);
          zs.push(z - rz + 2 * rz * i / 9);
        }
        for (const v of [-4.66, 2.36, -2.145, -0.295, -2.22, -0.22]) if (v + snowShop.position.x > x - rx && v + snowShop.position.x < x + rx) xs.push(v + snowShop.position.x);
        for (const v of [0.525, 1.775, 1.655, 2.145, 2.075, 2.425]) if (v + snowShop.position.z > z - rz && v + snowShop.position.z < z + rz) zs.push(v + snowShop.position.z);
        for (const r of roads) {
          for (const v of [r.x - r.w / 2, r.x + r.w / 2]) if (v > x - rx && v < x + rx) xs.push(v);
          for (const v of [r.z - r.d / 2, r.z + r.d / 2]) if (v > z - rz && v < z + rz) zs.push(v);
        }
        const xx = [...new Set(xs)].sort((a, b) => a - b), zz = [...new Set(zs)].sort((a, b) => a - b);
        for (let i = 1; i < xx.length; i++) for (let j = 1; j < zz.length; j++) {
          const ax = xx[i - 1], bx = xx[i], az = zz[j - 1], bz = zz[j], y = softSnowHeight((ax + bx) / 2, (az + bz) / 2) + 6e-3;
          for (const p of [[ax, az], [bx, bz], [bx, az], [ax, az], [ax, bz], [bx, bz]]) {
            data.push(p[0], y, p[1]);
            uv2.push((p[0] - x + rx) / (2 * rx), (p[1] - z + rz) / (2 * rz));
          }
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(data, 3));
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv2, 2));
        geo.computeVertexNormals();
        const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map, color: map === softWindowMap ? 16761214 : 16777215, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
        mesh.name = name;
        mesh.renderOrder = 1;
        snowTown.add(mesh);
        return mesh;
      }
      const softSnowLights = { lanternPools: [], windowPools: [] };
      snowShop.updateMatrixWorld(true);
      for (const [i, g] of lanterns.entries()) {
        const p = g.getWorldPosition(new THREE.Vector3());
        lanternLights[i].color.setHex(16759939);
        lanternLights[i].intensity = 0.76;
        lanternLights[i].distance = 3.4;
        softSnowLights.lanternPools.push(snowSpill(p.x, p.z + 0.12, 0.94, 0.86, softLanternMap, 0.5, "lantern-warm-spill-on-snow"));
      }
      snowTown.updateMatrixWorld(true);
      const snowyWindows = [];
      snowStatic.traverse((o) => {
        if (o.userData.snowWindow) snowyWindows.push(o);
      });
      for (const root of snowyWindows) {
        const p = root.getWorldPosition(new THREE.Vector3()), scale = root.getWorldScale(new THREE.Vector3()), w = root.userData.snowWindow.width * scale.x, curtain = root.children.find((o) => o.userData.width);
        const mesh = snowSpill(p.x, p.z + 0.65, Math.min(1.7, w * 0.56), 0.63, softWindowMap, curtain ? 0.35 : 0.46, "window-light-on-snow");
        softSnowLights.windowPools.push({ mesh, curtain, source: root });
      }
      for (const [x, w] of [[-3.325, 2.35], [0.995, 2.57]]) {
        const mesh = snowSpill(x + snowShop.position.x, 1.65 + snowShop.position.z, w * 0.38, 0.64, softWindowMap, 0.37, "shop-window-light-on-porch");
        softSnowLights.windowPools.push({ mesh, curtain: null, source: snowShop });
      }
      function animateSoftSnowLights() {
        for (const q of softSnowLights.windowPools) if (q.curtain) q.mesh.material.opacity = 0.35 + q.curtain.userData.amount * 0.3;
      }
      function mergeSnowStatic(root) {
        root.updateMatrixWorld(true);
        const groups = /* @__PURE__ */ new Map(), objects = [];
        root.traverse((o) => {
          if (!o.isMesh || o.material.transparent || o.material.visible === false || o.userData.snowAction || o.userData.action || o.userData.snowDynamic || interactionTargets.includes(o) || Array.isArray(o.material)) return;
          let p = o.parent;
          while (p && p !== root) {
            if (p.userData.snowAction || p.userData.snowDynamic) return;
            p = p.parent;
          }
          const key = o.material.uuid;
          let a = groups.get(key);
          if (!a) groups.set(key, a = []);
          a.push(o);
        });
        for (const meshes of groups.values()) {
          if (meshes.length < 2) continue;
          const inverse = new THREE.Matrix4().copy(root.matrixWorld).invert(), geos = meshes.map((o) => {
            const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
            g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, o.matrixWorld));
            return g;
          });
          const geo = new THREE.BufferGeometry();
          for (const name of ["position", "normal", "uv"]) {
            if (!geos.every((g) => g.attributes[name])) continue;
            const size = geos[0].attributes[name].itemSize, total = geos.reduce((n, g) => n + g.attributes[name].array.length, 0), data = new Float32Array(total);
            let offset = 0;
            for (const g of geos) {
              data.set(g.attributes[name].array, offset);
              offset += g.attributes[name].array.length;
            }
            geo.setAttribute(name, new THREE.BufferAttribute(data, size));
          }
          geo.computeBoundingSphere();
          const merged = new THREE.Mesh(geo, meshes[0].material);
          merged.name = "snow-static-batch";
          merged.castShadow = true;
          merged.receiveShadow = true;
          root.add(merged);
          for (const o of meshes) o.removeFromParent();
          geos.forEach((g) => g.dispose());
        }
      }
      for (const o of [...doors, staffHinge, staffDoor, chime, postbox, mailEnvelope, ...refrigeratorLeaves, ...takeoutPanes, bento, preparingNote, bunsGroup, bunLid, cookPot, cookLid, coffeeCup, coffeeSurface, coffeeStream, ...wallVentSlats, ...rearBins.map((o2) => o2.userData.hinge), bike]) o.userData.snowDynamic = true;
      mergeSnowStatic(snowStatic);
      mergeSnowStatic(snowShop);
      let shovelAt = -100, snowmanAt = -100;
      function snowAction(action, t = performance.now() / 1e3, object = null) {
        if (snowV4Action(action, t, object) || villageBuildingAction(action, t)) return;
        if (action === "bear") callBear(t);
        else if (action === "notice") openSceneLetter();
        else if (action === "icecream") {
          if (freezerCycle.phase === "closed") {
            freezerCycle.phase = "opening";
            freezerCycle.at = t;
            freezerOpen = true;
          } else if (freezerCycle.phase === "ready") {
            freezerCycle.phase = "taking";
            freezerCycle.at = t;
          }
        } else if (action === "takeIcecream" && freezerCycle.phase === "ready") {
          freezerCycle.phase = "taking";
          freezerCycle.at = t;
        } else if (action === "chimney" && (object == null ? void 0 : object.userData.chimney)) {
          object.userData.chimney.at = t;
        } else if (action === "koi") {
          koiState.next = t;
        } else if (action === "scarecrow") {
          scarecrowAt = t;
          if (t - sparrowsAt >= sparrowCycleDuration) sparrowsAt = t;
        } else if (action === "yardDog") {
          dogAt = t;
          if (dogState.phase === "inside") {
            dogState.phase = "out";
            dogState.at = t;
          } else if (dogState.phase === "wait") {
            dogState.phase = "turn";
            dogState.at = t;
          }
          if ((audioContext == null ? void 0 : audioContext.state) === "running") playSound("dog");
        } else if (action === "window" && (object == null ? void 0 : object.userData.window)) {
          object.userData.window.userData.open = !object.userData.window.userData.open;
          object.userData.window.userData.closeAt = t + 7;
        } else if (action === "snowman") snowmanAt = t;
        else if (action === "shovel") shovelAt = t;
        else if (action === "steamer") steamerOpen = !steamerOpen;
        else if (action === "bus") startBus(t);
      }
      const originalSnowAction = actOnScene;
      actOnScene = function(e) {
        const h = pickScene(e);
        if (!h) return;
        if (h.object.userData.snowAction) {
          vy = vp = 0;
          ensureAudio();
          snowAction(h.object.userData.snowAction, performance.now() / 1e3, h.object);
        } else originalSnowAction(e);
      };
      pickScene = function(e) {
        const r = { left: 0, top: 0, width: window.sceneViewport.width, height: window.sceneViewport.height };
        doorRay.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera);
        const active = (o) => {
          for (let p = o; p; p = p.parent) if (!p.visible) return false;
          return true;
        };
        const candidates = [...snowTargets, ...interactionTargets, doorHit].filter(active), seen = new Set(candidates);
        scene.traverse((o) => {
          if (!o.isMesh || seen.has(o) || !active(o) || o.material.visible === false || o.material.transparent) return;
          candidates.push(o);
        });
        const h = doorRay.intersectObjects(candidates, false)[0];
        return h && (h.object.userData.action || h.object.userData.snowAction) ? h : null;
      };
      const ordinarySnowFocus = focusObject;
      focusObject = function(e) {
        if (savedFocusView) return ordinarySnowFocus(e);
        const h = pickScene(e);
        if (!(h == null ? void 0 : h.object.userData.snowAction)) return ordinarySnowFocus(e);
        savedFocusView = { target: target.clone(), distance, yaw, pitch };
        focusTween = { start: performance.now() / 1e3, from: target.clone(), to: h.point.clone(), fromDistance: distance, distance: h.object.userData.snowAction === "bear" ? 9 : 7, fromYaw: yaw, yaw, fromPitch: pitch, pitch: 0.4 };
        vy = vp = 0;
      };
      const flakeCount = 2100, flakeData = new Float32Array(flakeCount * 3), flakeSpeeds = new Float32Array(flakeCount);
      for (let i = 0; i < flakeCount; i++) {
        flakeData[i * 3] = (sr() - 0.5) * 42;
        flakeData[i * 3 + 1] = 0.4 + sr() * 14;
        flakeData[i * 3 + 2] = (sr() - 0.5) * 42;
        flakeSpeeds[i] = 0.32 + sr() * 0.38;
      }
      const snowParticleGeo = new THREE.BufferGeometry();
      snowParticleGeo.setAttribute("position", new THREE.BufferAttribute(flakeData, 3));
      const flakeMap = texture(32, 32, (c, W, H) => {
        const g = c.createRadialGradient(16, 16, 0, 16, 16, 15);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.4, "rgba(255,255,255,.85)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      const snowfall = new THREE.Points(snowParticleGeo, new THREE.PointsMaterial({ map: flakeMap, color: 15398143, size: 0.105, transparent: true, opacity: 0.88, depthWrite: false }));
      snowfall.name = "more-visible-snowfall";
      snowTown.add(snowfall);
      const shelterBounds = [{ x: -0.25, z: -1.2, w: 8.4, d: 6.5, y: 5.6 }, ...Object.entries(villageBuildings).map(([key, b]) => {
        const q = snowLayout[key], w = (b.width + 0.6) * b.root.scale.x, d = (b.depth + 0.6) * b.root.scale.z, c = Math.abs(Math.cos(q.yaw)), s = Math.abs(Math.sin(q.yaw));
        return { x: q.x, z: q.z, w: w * c + d * s, d: d * c + w * s, y: key === "residence" ? 4.9 : key === "bakery" ? 4.8 : key === "grain" ? 4.2 : key === "repair" ? 4.3 : 3.5 };
      })];
      function animateSnowflakes(t, dt) {
        for (let i = 0; i < flakeCount; i++) {
          let k = i * 3;
          flakeData[k] += Math.sin(t * 0.25 + i) * dt * 0.07;
          flakeData[k + 1] -= dt * flakeSpeeds[i];
          let roof2 = 0.29;
          for (const b of shelterBounds) if (Math.abs(flakeData[k] - b.x) < b.w / 2 && Math.abs(flakeData[k + 2] - b.z) < b.d / 2) {
            roof2 = b.y;
            break;
          }
          if (flakeData[k + 1] < roof2) {
            flakeData[k + 1] = 13 + sr() * 2;
            flakeData[k] = (sr() - 0.5) * 42;
            flakeData[k + 2] = (sr() - 0.5) * 42;
          }
        }
        snowParticleGeo.attributes.position.needsUpdate = true;
      }
      function animateSnowTown(t, dt) {
        animateVillageBuildings(t, dt);
        animateInteractions(t, dt);
        animateCookpot(t, dt);
        animateSnowflakes(t, dt);
        animateBus(t, dt);
        animateGrandma(t, dt);
        animateGrandpa(t, dt);
        keepHomeDoorClear();
        animateBear(t, dt);
        animateYardAndField(t, dt);
        animateSnowAudio(t);
        animateV3Details(t, dt);
        animateV4(t, dt);
        animateSnowTraces(t);
        animateSoftSnowLights();
        doorAmount = THREE.MathUtils.damp(doorAmount, doorTarget, 6, dt);
        doors.forEach((o, i) => {
          o.position.x = o.userData.closedX;
          o.rotation.y = (i === 0 ? -1 : 1) * doorAmount * 1.38;
        });
        animateV3Freezer(t, dt);
        steamerAmount = THREE.MathUtils.damp(steamerAmount, steamerOpen ? 1 : 0, 4, dt);
        steamerLid.rotation.x = -steamerAmount * 1.25;
        const sa = t - shovelAt, sweep = sa >= 0 && sa < 3 ? Math.sin(sa / 3 * Math.PI) : 0;
        shovel.rotation.z = -0.24 + sweep * 0.6;
        shovel.position.z = 2.7 + sweep * 0.55;
        const ma = t - snowmanAt;
        snowHat.rotation.z = snowmanAt < 0 ? 0.16 : 0.16 * (1 - THREE.MathUtils.smoothstep(ma, 0, 0.6));
        houseWindows.forEach((o) => {
          if (t > o.userData.closeAt) o.userData.open = false;
          o.userData.amount = THREE.MathUtils.damp(o.userData.amount, o.userData.open ? 1 : 0, 5, dt);
          for (const panel of o.children) {
            const u = o.userData.amount, w = o.userData.width;
            panel.scale.x = 1 - u * 0.8;
            panel.position.x = panel.userData.side * w * (0.25 + u * 0.2);
          }
        });
        chimneyPuffs.forEach((o, i) => {
          const a = (t * 0.075 + o.userData.phase) % 1;
          o.position.copy(o.userData.origin);
          o.position.x += a * 0.65 + Math.sin(t * 0.1 + i) * 0.05;
          o.position.y += a * 1.7;
          o.scale.setScalar(0.22 + a * 0.85);
          o.material.opacity = Math.sin(a * Math.PI) * 0.17;
        });
        const fogAge = t - fogSmileAt, progress = THREE.MathUtils.clamp(fogAge / 1.65, 0, 1), alpha = fogAge >= 0 ? 1 - THREE.MathUtils.smoothstep(fogAge, 3.3, 8) : 0;
        if (t - lastFogPaint > 0.05 && (Math.abs(alpha - fogErasure) > 5e-3 || Math.abs(progress - fogDrawProgress) > 5e-3)) {
          paintWindowFog(alpha, progress);
          lastFogPaint = t;
        }
        bunsGroup.visible = bunLid.visible = false;
        chime.visible = postbox.visible = mailEnvelope.visible = false;
        serviceLight.intensity = staffAmount * 1.6;
        if (t - lastCloudPaint > 0.2) {
          paintClouds(cloudCanvas.getContext("2d"), cloudCanvas.width, cloudCanvas.height, t);
          lastCloudPaint = t;
        }
      }
      const oldSnowStamp = drawScenePostmark;
      drawScenePostmark = function(c, x, y, mode) {
        if (mode !== "snow") return oldSnowStamp(c, x, y, mode);
        c.save();
        c.translate(x, y);
        c.strokeStyle = "#8e9da4";
        c.globalAlpha = 0.8;
        c.lineWidth = 1.3;
        for (const r of [24, 28]) {
          c.beginPath();
          c.arc(0, 0, r, 0, Math.PI * 2);
          c.stroke();
        }
        for (let i = 0; i < 6; i++) {
          c.save();
          c.rotate(i * Math.PI / 3);
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(0, -16);
          c.moveTo(0, -9);
          c.lineTo(-4, -13);
          c.moveTo(0, -9);
          c.lineTo(4, -13);
          c.stroke();
          c.restore();
        }
        c.restore();
      };
      letterDialog.querySelector(".letter-eyebrow").textContent = "\u96EA\u4E61\u516C\u544A\u680F \xB7 \u51AC\u591C\u6765\u4FE1";
      letterDialog.querySelector("h1").textContent = "\u96EA\u8FD8\u5728\u4E0B\uFF0C\u5E97\u8FD8\u4EAE\u7740";
      letterDialog.querySelector(".letter-intro").textContent = "\u5C71\u6797\u56F4\u7740\u5C0F\u9547\uFF0C\u8FDB\u5C4B\u559D\u7897\u70ED\u8C46\u6D46\u3002";
      letterDialog.querySelector(".letter-steps").innerHTML = "<li><strong>\u88AB\u5C71\u6797\u56F4\u4F4F\u7684\u51AC\u591C</strong><p>\u7EA2\u677E\u4E0E\u51B7\u6749\u5728\u8FDC\u5C71\u524D\u53E0\u8D77\u6DF1\u6D45\u7684\u8F6E\u5ED3\uFF0C\u96EA\u82B1\u6162\u6162\u843D\u4E0B\u3002\u516C\u8DEF\u8FB9\u7684\u706F\u7167\u7740\u79EF\u96EA\uFF0C\u51B0\u5C01\u7684\u5C0F\u6CB3\u4E0A\uFF0C\u4E00\u5EA7\u8F66\u6865\u548C\u4E24\u5EA7\u5C0F\u6865\u628A\u5C0F\u9547\u8FDE\u5728\u4E00\u8D77\u3002</p></li><li><strong>\u70ED\u4E4E\u7684\u65E9\u9910\u4E0E\u5BB6\u5E38\u5473</strong><p>\u5C0F\u4ED3\u4E70\u91CC\u6709\u8C46\u6D46\u3001\u5364\u9E21\u86CB\u3001\u5305\u5B50\u3001\u6CB9\u6761\u548C\u70ED\u7CA5\uFF0C\u51BB\u68A8\u7B50\u65C1\u6446\u7740\u51B0\u68CD\u67DC\u3002\u8FC7\u4E86\u6728\u6865\uFF0C\u719F\u98DF\u5E97\u91CC\u6302\u7740\u9999\u80A0\uFF0C\u95E8\u524D\u7684\u9178\u83DC\u7F38\u7559\u4F4F\u4E86\u51AC\u5929\u7684\u5473\u9053\u3002</p></li><li><strong>\u6709\u4EBA\u6765\uFF0C\u6709\u4EBA\u56DE\u5BB6</strong><p>\u5927\u5988\u63D0\u7740\u888B\u5B50\u53BB\u4E70\u4E1C\u897F\uFF0C\u5927\u7237\u4ECE\u73ED\u8F66\u4E0B\u6765\uFF0C\u5230\u7CAE\u4ED3\u529E\u70B9\u4E8B\u3002\u8FDB\u5C4B\u540E\u5148\u5173\u4E0A\u95E8\uFF0C\u6696\u548C\u4E00\u4F1A\u513F\u518D\u51FA\u53D1\u3002\u7095\u623F\u6A90\u4E0B\u6302\u7740\u8FA3\u6912\u548C\u5927\u849C\uFF0C\u9662\u91CC\u7684\u571F\u72D7\u770B\u7740\u96EA\u4EBA\uFF1B\u519C\u7530\u91CC\u7684\u9EBB\u96C0\u88AB\u7A3B\u8349\u4EBA\u60CA\u8D77\uFF0C\u8F6C\u4E00\u5708\u8FD8\u4F1A\u56DE\u6765\u3002</p></li><li><strong>\u6797\u8FB9\u4E0E\u8FDC\u65B9</strong><p>\u6728\u6805\u680F\u540E\u7684\u718A\u6D1E\u7559\u7740\u638C\u5370\uFF0C\u68D5\u718A\u6162\u6162\u8D70\u51FA\u6765\uFF0C\u95FB\u4E00\u95FB\u96EA\u91CC\u7684\u6C14\u606F\uFF0C\u518D\u8F6C\u8EAB\u56DE\u6D1E\u3002\u98CE\u58F0\u3001\u7089\u706B\u4E0E\u6811\u53F6\u7684\u8F7B\u54CD\u91CC\uFF0C\u8FD8\u6709\u4E00\u6BB5\u5F88\u8F7B\u7684\u66F2\u5B50\u3002</p></li><li><strong>\u7559\u7ED9\u5BB6\u4E61\u7684\u4E00\u53E5\u8BDD</strong><p>\u5982\u679C\u4ECA\u665A\u4E5F\u4E0B\u96EA\u4E86\uFF0C\u613F\u4F60\u56DE\u5BB6\u7684\u90A3\u6761\u8DEF\u4E0A\uFF0C\u4E00\u76F4\u6709\u706F\u3002</p></li>";
      letterDialog.querySelector(".letter-signoff small").textContent = "2026\xB710 \xB7 \u96EA\u4E61\u5C0F\u4ED3\u4E70";
      function resetSnowScene() {
        clearSnowTraces();
        resetVillageBuildings();
        clearTimeout(singleTapTimer);
        pointers.clear();
        gesture = tapStart = focusTween = savedFocusView = null;
        target.set(0, 1.2, 0);
        yaw = 0.34;
        pitch = 0.59;
        distance = 67;
        vy = vp = 0;
        doorTarget = doorAmount = staffTarget = staffAmount = 0;
        coffeeFull = false;
        coffeeFill = coffeeUntil = 0;
        coffeeStarted = -100;
        bunLidTarget = bunLidAmount = cookLidTarget = cookLidAmount = 0;
        letterTarget = letterAmount = 0;
        letterDialog.close();
        closePostcardPreview();
        takeoutTarget = takeoutAmount = 0;
        windowPending = null;
        takeoutVariant = "bento";
        freezerOpen = steamerOpen = false;
        freezerAmount = steamerAmount = 0;
        Object.assign(freezerCycle, { phase: "closed", at: 0, lift: 0 });
        freezerLid.rotation.x = 0;
        popsicle.visible = false;
        dogState.phase = "inside";
        animateV3Dog(performance.now() / 1e3, 0);
        resetV4();
        snowChimneys.forEach((q) => q.at = -100);
        koiState.phase = "hidden";
        koiState.next = performance.now() / 1e3 + 14;
        snowmanAt = shovelAt = fogSmileAt = dogAt = sparrowsAt = scarecrowAt = -100;
        scarecrow.rotation.set(0, 0, 0);
        snowHat.rotation.z = 0.16;
        bearState.phase = "hidden";
        setAlpha(bear, 0);
        for (const p of [grandma, grandpa]) {
          p.stage = "hidden";
          p.route = null;
          p.inside = false;
          setAlpha(p.root, 0);
        }
        const t = performance.now() / 1e3;
        grandmaState.next = t + 12;
        grandpaState.hasRidden = false;
        Object.assign(busState, { phase: "hidden", next: t + 28, door: 0, boarding: false, departRequested: false });
        setAlpha(bus, 0);
        houseWindows.forEach((o) => o.userData.open = false);
        refrigeratorLeaves.forEach((o) => {
          o.userData.open = false;
          o.userData.amount = 0;
        });
        rearBins.forEach((o) => {
          o.userData.open = false;
          o.userData.amount = 0;
        });
        wallVentOpen = false;
        setClockMode(false);
      }
      const snowAPI = { leafTrees: villageLeafTrees, wireSnow: winterWireSnow, shopSign: sign, shopSignBack: snowSignBack, signReliefs, removedWinterStripes, lanterns, lanternLights, fieldBench, fieldBench2, parkBench, parkBench2, pullUpBar, get flockAt() {
        return sparrowsAt;
      }, get scarecrowAt() {
        return scarecrowAt;
      }, riverCenter, riverEdges, iceHoleOutline, fruitCrates, repairRoll, repairSign, well, recreation, swingPivot, seesawPivot, twistDisc, iceSled, iceSledState, v4BirdCurve, chimneys: snowChimneys, powerPoles, kennel, dogState, freezerCycle, koi, koiState, iceHole: iceHoleWater, update: animateSnowTown, buildings: villageBuildings, mechanisms: villageMechanisms, town: snowTown, shop: snowShop, legacy: snowLegacy, ground: snowGround, cave, bear, bearLegs, bearState, icicles, snowfall, snowman, shovel, steamer: villageSteamer, houseWindows, bus, busState, breadPerson, busPerson, grandma, grandpa, freezer: iceFreezer, freezerLid, popsicle, eggPot, breakfast, notice, field, scarecrow, sparrows, dog: dogRoot, bridges, river: riverIce, roads, roadSegments, roadNodes, roadLinks, roadMesh, roadsideBanks, trees: townTrees, lamps: lampObjects, audio: snowAudio, walkHeight, onRoad, findRoute, targets: snowTargets, action: snowAction, reset: resetSnowScene, get bearActive() {
        return bearState.phase !== "hidden";
      }, get breadActive() {
        return grandma.stage !== "hidden";
      }, get busActive() {
        return busState.phase !== "hidden";
      }, get steamerOpen() {
        return steamerOpen;
      }, get freezerOpen() {
        return freezerOpen;
      }, startBread() {
        grandmaState.next = performance.now() / 1e3;
      }, startBus() {
        startBus(performance.now() / 1e3);
      } };
      Object.assign(snowAPI, { breakfastBanner, breakfastSupports, shelfCategories, lanternRibs, snowTraces, softSnowLights });
      const snowStyle = document.createElement("style");
      snowStyle.textContent = ".scene-reset{position:fixed;left:25px;bottom:23px;z-index:4;width:45px;height:45px;padding:11px;border-radius:50%;border:1px solid rgba(196,213,210,0.2510);background:rgba(39,61,83,0.7020);color:#e7e0ce;display:grid;align-items:center;justify-items:center;cursor:pointer;backdrop-filter:blur(12px)}.scene-reset svg{width:22px;height:22px}.scene-clock{background:rgba(39,61,83,0.5412);color:#eee3cc}.photo-button{background:rgba(39,61,83,0.7020);color:#eee3cc}@media(max-width:600px){.scene-reset{left:15px;bottom:16px}}";
      window.streetAppendStyle(snowStyle, "snow");
      const snowResetButton = document.createElement("button");
      snowResetButton.className = "scene-reset";
      snowResetButton.type = "button";
      snowResetButton.title = "\u91CD\u7F6E\u96EA\u4E61";
      snowResetButton.setAttribute("aria-label", "\u91CD\u7F6E\u96EA\u4E61");
      snowResetButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 10a8 8 0 1 1 1.5 7M4 4v6h6"/></svg>';
      sceneHost.appendChild(snowResetButton);
      snowResetButton.addEventListener("click", resetSnowScene);
      target.set(0, 1.2, 0);
      yaw = 0.34;
      pitch = 0.59;
      distance = 67;
      let prev = performance.now();
      function animate(now) {
        window.streetRAF(animate);
        if (document.hidden || !window.landscapeStarted || window.streetRenderStopped) return;
        if (now - prev < 33) return;
        if (window.streetCurrentScene !== "snow") return;
        const t = now / 1e3, dt = Math.min(Math.max(0, (now - prev) / 1e3), 0.1);
        prev = now;
        updateFocus(t);
        if (!pointers.size) {
          yaw += vy;
          pitch = THREE.MathUtils.clamp(pitch + vp, 0.16, 1.3);
          vy *= 0.94;
          vp *= 0.94;
        }
        const responsive = Math.max(1, 1.28 / (window.sceneViewport.width / window.sceneViewport.height));
        camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * distance * responsive, target.y + Math.sin(pitch) * distance * responsive, target.z + Math.cos(yaw) * Math.cos(pitch) * distance * responsive);
        camera.lookAt(target);
        animateSnowTown(t, dt);
        renderer.render(scene, camera);
        window.streetFrameBudget(now, dt, renderer, rainGeo);
      }
      window.streetRAF(animate);
      window.__scene = { setWeather, unlockAudio: ensureAudio, restoreView(view) {
        yaw = view.yaw;
        pitch = view.pitch;
        distance = view.distance;
        target.fromArray(view.target);
        vy = vp = 0;
        focusTween = null;
        savedFocusView = null;
        const r = Math.max(1, 1.28 / (window.sceneViewport.width / window.sceneViewport.height));
        camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * distance * r, target.y + Math.sin(pitch) * distance * r, target.z + Math.cos(yaw) * Math.cos(pitch) * distance * r);
        camera.lookAt(target);
        renderer.render(scene, camera);
      }, snow: snowAPI, reset: resetSnowScene, resetButton: snowResetButton, get resetting() {
        return false;
      }, stopInteractionAudio() {
        if (typeof stopCyberDroneSound === "function") stopCyberDroneSound();
      }, stories: { fog: windowFog, fogHit, get erasure() {
        return fogErasure;
      }, get drawProgress() {
        return fogDrawProgress;
      }, drips: awningBurst, roofBead, sunsetGlass, beam: sunbeam, glints: bottleGlints, feather: pigeonFeather, fixtures: duskFixtures, stampKinds: postcardStampKinds, drawStamp: drawScenePostmark, get nextFeatherAt() {
        return nextFeatherAt;
      }, get featherAt() {
        return featherAt;
      } }, leftWallSections, wallVentSlats, get wallVentOpen() {
        return wallVentOpen;
      }, get wallVentAmount() {
        return wallVentAmount;
      }, wallVentExterior, wallVentInterior, farRoadCurb, edgeDecorations, refrigeratorLeaves, refrigeratorDoors, sideSign, setClockMode, get clockIs12() {
        return clockIs12;
      }, umbrellas, pinwheelStand, pinwheels, roofExhaust, get smokeBurstAt() {
        return smokeBurstAt;
      }, airLeaves, cloudCanvas, get viewState() {
        return { yaw, pitch, distance, target: target.toArray() };
      }, get hasSavedFocus() {
        return savedFocusView !== null;
      }, roofDrain, roofMist, pickupSign, requestPickup, get windowPending() {
        return windowPending;
      }, get noteShownAt() {
        return noteShownAt;
      }, get cookLidAmount() {
        return cookLidAmount;
      }, shellSeals, frontAwning, rightRoofHeader, cookStove, cookPot, cookLid, cookFood, cookSteam, pickupHit, get cookLidTarget() {
        return cookLidTarget;
      }, get weatherMode() {
        return weatherMode;
      }, get isDusk() {
        return isDusk;
      }, dog, dogHead, preparingNote, clock, personalMessage, createPostcard, previewPostcard, closePostcardPreview, postcardPreview, postcardImage, postcardDownload, photoButton, get takeoutVariant() {
        return takeoutVariant;
      }, get focused() {
        return focusTween !== null;
      }, get viewDistance() {
        return distance;
      }, get frontCuriosity() {
        return frontCuriosity;
      }, get dogCuriosity() {
        return dogCuriosity;
      }, umbrellaRack, sunnyFlowerRack, vendingCans, vendingPalettes, crossingNamePlate, weatherLabels, culdesacSign, welcomeSign, roadCenterLine, get music() {
        return { notes: musicNoteCount, gain: musicGain == null ? void 0 : musicGain.gain.value, step: musicStep };
      }, get trafficAudio() {
        return { passes: carPassCount, gain: carAudioGain == null ? void 0 : carAudioGain.gain.value, cityGain: cityBedGain == null ? void 0 : cityBedGain.gain.value, active: activePasses.size };
      }, get isSunny() {
        return isSunny;
      }, get weatherBlend() {
        return weatherBlend;
      }, weatherButtons, pigeon, pigeonWings, chimeRain, wetGlows, puddles, rain, drips, trails, hemisphere, moon, shopLights, get pigeonReact() {
        return pigeonReact;
      }, mailEnvelope, letterDialog, get letterTarget() {
        return letterTarget;
      }, get letterAmount() {
        return letterAmount;
      }, pawPrints, get signalPhase() {
        return signalPhase;
      }, curbParts, get walkGreen() {
        return walkGreen;
      }, get signalSince() {
        return signalSince;
      }, get signalManualClicks() {
        return signalManualClicks;
      }, drains, crossingSignal, signals, pedestrianFaces, vehicleFaces, signalHeads, chimeSun, flowerPots, takeoutGroup, takeoutPanes, rearAwning, bento, get takeoutTarget() {
        return takeoutTarget;
      }, get takeoutClicks() {
        return takeoutClicks;
      }, rearBins, rearWallSign, wallPlanter, coffeeCup, coffeeSurface, coffeeStream, bunsGroup, bunLid, bunSteam, get coffeeFull() {
        return coffeeFull;
      }, get coffeeFill() {
        return coffeeFill;
      }, get bunLidTarget() {
        return bunLidTarget;
      }, entranceDecor, postbox, parkingBay, wallCredits, pavementTiles, pavingBounds, rearWindshield, carWindows, windshield, driverHinge, carSpots, carReflections, shelfUnits, odenCounter, odenSteam, get carLightsOn() {
        return carLightsOn;
      }, get carDoorTarget() {
        return carDoorTarget;
      }, parkedCar, sidewalkExtension, utilityPole, railParts, cat, catHead, catPaw, catTail, get catReact() {
        return catReact;
      }, get audio() {
        return { context: audioContext, analyser: audioAnalyser, master: audioMaster, events: soundEvents, counts: __spreadValues({}, soundCounts), muted: audioMuted, rainTapCount };
      }, scene, renderer, camera, doors, rings, bike, staffDoor, trafficMaterials, doorHit, staffHinge, chime, drink, steam, interactionTargets, interactionRipples, bikeSpot, bikeReflection, get staffTarget() {
        return staffTarget;
      }, get bikeLightOn() {
        return bikeLightOn;
      }, get coffeeUntil() {
        return coffeeUntil;
      }, get drinkState() {
        return drinkState;
      }, get chimeImpulse() {
        return chimeImpulse;
      }, get doorTarget() {
        return doorTarget;
      }, setView(a, b = 0.43, d = 56) {
        yaw = a;
        pitch = b;
        distance = d;
        vy = vp = 0;
        target.set(0, 1.4, 0);
      } };
    })();
  };
  window.streetInitSummer = function() {
    (() => {
      "use strict";
      var _a, _b, _c;
      const sceneHost = document.getElementById("street-summer");
      const snowChineseLabels = { "\u307B\u3057\u306E  MART  \u2022  24 H": "\u96EA\u4E61\u5C0F\u4ED3\u4E70", "\u81EA \u52D5": "\u63A8\u95E8 \xB7 \u6696\u548C", "\u304A\u5F01\u5F53": "\u5BB6\u5E38\u996D", "\u304A\u3067\u3093  \u2022  COFFEE": "\u8C46\u6D46\xB7\u70ED\u7CA5", "\u304A\u3067\u3093\u30FB\u8089\u307E\u3093": "\u70ED\u6C64 \xB7 \u8C46\u5305", "\u3042\u3064\u3042\u3064 \u304A\u3067\u3093": "\u70ED\u4E4E\u5BB6\u5E38\u6C64", "\u6708\u520A": "\u4E61\u6751\u751F\u6D3B", "\u65B0\u767A\u58F2": "\u521A\u51FA\u9505", "\u3042\u3063\u305F\u304B": "\u70ED\u4E4E\u7684", "\u3064\u3081\u305F\u3044": "\u51B0\u9547\u996E\u6599", "\u7F36": "\u5564\u9152\u74F6", "PET": "\u5851\u6599\u74F6", "STAFF ONLY": "\u95F2\u4EBA\u514D\u8FDB", "DRINKS": "\u725B\u5976 \xB7 \u996E\u6599", "\u3012": "\u4FE1", "\u96E8\u3084\u3069\u308A": "\u907F\u96EA", "\u3072\u306A\u305F": "\u6652\u592A\u9633", "\u590F\u306E\u591C": "\u96EA\u4E61\u591C\u8BDD", "\u79CB\u306E\u65E5": "\u51AC\u65E5\u5C0F\u8BB0", "\u8857\u89D2\u4FBF\u308A": "\u6751\u91CC\u6D88\u606F", "\u79CB\u306E\u4FBF\u308A": "\u51AC\u65E5\u6765\u4FE1", "\u6A2A\u65AD\u6B69\u9053": "\u6751\u53E3\u6162\u884C", "\u661F\u6708\u901A\u308A": "\u96EA\u4E61\u6751\u8DEF", "\u884C\u304D\u6B62\u307E\u308A": "\u4E61\u95F4\u5C0F\u8DEF", "\u3088\u3046\u3053\u305D": "\u8FDB\u5C4B\u6696\u548C", "\u304A\u5F01\u5F53 \u304A\u6E21\u3057\u53E3": "\u4E1C\u5317\u5927\u4E71\u7096", "\u6E96\u5099\u4E2D": "\u7A0D\u7B49\u4E00\u4F1A\u513F", "\u5915\u6620\u3048": "\u96EA\u591C", "\u5915\u66AE\u308C\u4FBF\u308A": "\u96EA\u4E61\u6765\u4FE1", "\u3072\u3068\u4F11\u307F": "\u6B47\u6B47\u811A" };
      let isSunny = false, weatherBlend = 0, isDusk = false, weatherMode = "rain", frontCuriosity = -100, dogCuriosity = -100, takeoutVariant = "bento", singleTapTimer = null, focusTween = null;
      const weatherLabels = [];
      const scene = new THREE.Scene();
      const renderer = window.makeStreetRenderer(THREE);
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(2e6 / (window.sceneViewport.width * window.sceneViewport.height))));
      renderer.setSize(window.sceneViewport.width, window.sceneViewport.height);
      renderer.shadowMap.enabled = false;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      sceneHost.appendChild(renderer.domElement);
      renderer.domElement.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        window.streetRenderStopped = true;
        if (window.__scene && window.__scene.audio.context) window.__scene.audio.context.suspend();
        window.sceneFallback("\u4E09\u7EF4\u753B\u9762\u6682\u65F6\u4E2D\u65AD\uFF0C\u8BF7\u91CD\u65B0\u6253\u5F00\u9875\u9762\u6062\u590D\u3002");
      });
      renderer.domElement.addEventListener("webglcontextrestored", () => {
        window.streetRenderStopped = false;
        window.sceneFallbackHide();
      });
      const camera = new THREE.PerspectiveCamera(36, window.sceneViewport.width / window.sceneViewport.height, 0.1, 100);
      const world = new THREE.Group();
      scene.add(world);
      const gradient = new THREE.DataTexture(new Uint8Array([68, 68, 68, 255, 118, 118, 118, 255, 184, 184, 184, 255, 242, 242, 242, 255]), 4, 1, THREE.RGBAFormat);
      gradient.needsUpdate = true;
      gradient.minFilter = gradient.magFilter = THREE.NearestFilter;
      const mats = /* @__PURE__ */ new Map();
      function mat(c, em = 0) {
        const key = c + ":" + em;
        if (!mats.has(key)) mats.set(key, new THREE.MeshToonMaterial({ color: c, gradientMap: gradient, emissive: em ? c : 0, emissiveIntensity: em }));
        return mats.get(key);
      }
      const ink = new THREE.LineBasicMaterial({ color: 1319735, transparent: true, opacity: 0.7 });
      function box(x, y, z, w, h, d, c, edge = true, em = 0, parent = world) {
        const g = new THREE.BoxGeometry(w, h, d), o = new THREE.Mesh(g, mat(c, em));
        o.position.set(x, y, z);
        o.castShadow = true;
        o.receiveShadow = true;
        parent.add(o);
        if (edge) {
          o.add(new THREE.LineSegments(new THREE.EdgesGeometry(g), ink));
        }
        return o;
      }
      function cyl(x, y, z, r, h, c, n = 12, parent = world) {
        const o = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, n), mat(c));
        o.position.set(x, y, z);
        o.castShadow = true;
        o.receiveShadow = true;
        parent.add(o);
        return o;
      }
      function line(points, c = 2504007, width = 1, parent = world) {
        const o = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map((p) => new THREE.Vector3(...p))), new THREE.LineBasicMaterial({ color: c, transparent: true, opacity: 0.9 }));
        parent.add(o);
        return o;
      }
      function rod(a, b, r, c, parent = world) {
        const p = new THREE.Vector3(...a), q = new THREE.Vector3(...b), o = cyl(0, 0, 0, r, p.distanceTo(q), c, 10, parent);
        o.position.copy(p.add(q).multiplyScalar(0.5));
        o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(...b).sub(new THREE.Vector3(...a)).normalize());
        return o;
      }
      function texture(w, h, draw) {
        const cv = document.createElement("canvas");
        const scale = Math.min(1, 512 / Math.max(w, h));
        cv.width = Math.max(1, Math.round(w * scale));
        cv.height = Math.max(1, Math.round(h * scale));
        draw(cv.getContext("2d"), cv.width, cv.height);
        const t = new THREE.CanvasTexture(cv);
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 4;
        return t;
      }
      const isCyberEdition = true;
      const sceneEnglishLabels = { "\u307B\u3057\u306E  MART  \u2022  24 H": "HOSHITSUKI MART \u2022 24 H", "\u81EA \u52D5": "AUTO", "\u304A\u5F01\u5F53": "BENTO", "\u304A\u3067\u3093  \u2022  COFFEE": "ODEN & COFFEE", "\u304A\u3067\u3093\u30FB\u8089\u307E\u3093": "ODEN & BUNS", "\u3042\u3064\u3042\u3064 \u304A\u3067\u3093": "HOT ODEN", "\u6708\u520A": "READ", "\u65B0\u767A\u58F2": "NEW", "\u3042\u3063\u305F\u304B": "HOT", "\u3064\u3081\u305F\u3044": "COLD", "\u7F36": "CANS", "\u3012": "MAIL", "\u96E8\u3084\u3069\u308A": "SHELTER", "\u3072\u306A\u305F": "SUNNY SPOT", "\u590F\u306E\u591C": "SUMMER NIGHT", "\u79CB\u306E\u65E5": "AUTUMN DAY", "\u8857\u89D2\u4FBF\u308A": "STREET NEWS", "\u79CB\u306E\u4FBF\u308A": "AUTUMN NEWS", "\u6A2A\u65AD\u6B69\u9053": "CROSSWALK", "\u661F\u6708\u901A\u308A": "HOSHITSUKI ST.", "\u884C\u304D\u6B62\u307E\u308A": "LOCAL ACCESS", "\u3088\u3046\u3053\u305D": "WELCOME", "\u304A\u5F01\u5F53 \u304A\u6E21\u3057\u53E3": "BENTO PICKUP", "\u6E96\u5099\u4E2D": "PREPARING", "\u5915\u6620\u3048": "AFTERGLOW", "\u5915\u66AE\u308C\u4FBF\u308A": "EVENING NEWS", "\u3072\u3068\u4F11\u307F": "TAKE A BREAK", "\u661F \u6708   MART  /  2077": "HOSHITSUKI MART / 2077" };
      function sceneEnglish(text) {
        return snowChineseLabels[text] || text;
      }
      function plaque(x, y, z, w, h, text, bg, fg, size = 80, parent = world) {
        const sourceText = text;
        text = sceneEnglish(text);
        const t = texture(1024, Math.max(64, Math.min(1024, Math.round(1024 * h / w))), (c, W, H) => {
          c.fillStyle = bg;
          c.fillRect(0, 0, W, H);
          c.fillStyle = fg;
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.font = "700 ".concat(Math.min(H * 0.68, 1024 / (text.length * 0.65)), 'px "Yu Gothic", "Microsoft YaHei", sans-serif');
          let measured = c.measureText(text).width;
          if (measured > W * 0.86) {
            c.font = "700 ".concat(Math.min(H * 0.68, 1024 / (text.length * 0.65)) * (W * 0.86 / measured), 'px "Yu Gothic", "Microsoft YaHei", sans-serif');
          }
          c.fillText(text, W / 2, H / 2);
        });
        const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t }));
        o.position.set(x, y, z);
        t.userData.displayText = text;
        t.userData.labelPalette = { bg, fg };
        o.userData.text = sourceText;
        o.userData.displayText = text;
        parent.add(o);
        return o;
      }
      function seasonalPlaque(x, y, z, w, h, rainText, sunText, bg, fg, size = 80, parent = world) {
        const label2 = plaque(x, y, z, w, h, rainText, bg, fg, size, parent);
        const sunny = plaque(0, 0, 0, w, h, sunText, bg, fg, size, parent);
        parent.remove(sunny);
        sunny.geometry.dispose();
        sunny.material.dispose();
        label2.userData.weatherTexts = [rainText, sunText];
        label2.userData.weatherMaps = [label2.material.map, sunny.material.map];
        weatherLabels.push(label2);
        return label2;
      }
      const floorY = 0.27;
      box(0, -0.1, 0, 12, 0.65, 12, 3426136);
      box(0, 0.235, 0, 11.94, 0.03, 11.94, 2506577, false);
      const asphalt = texture(1024, 1024, (c, w, h) => {
        c.fillStyle = "#263e52";
        c.fillRect(0, 0, w, h);
        let seed2 = 91;
        function rnd2() {
          seed2 = seed2 * 1664525 + 1013904223 >>> 0;
          return seed2 / 4294967296;
        }
        for (let i = 0; i < 32e3; i++) {
          let v = 60 + rnd2() * 45;
          c.fillStyle = "rgba(".concat(v, ",").concat(v + 15, ",").concat(v + 24, ",.16)");
          c.fillRect(rnd2() * w, rnd2() * h, 1 + rnd2() * 3, 1);
        }
        for (let i = 0; i < 140; i++) {
          c.strokeStyle = "rgba(110,150,178,.09)";
          c.beginPath();
          let x = rnd2() * w, y = rnd2() * h;
          c.ellipse(x, y, rnd2() * 50 + 5, rnd2() * 8 + 2, 0, 0, 7);
          c.stroke();
        }
      });
      const street = new THREE.Mesh(new THREE.PlaneGeometry(11.9, 11.9), new THREE.MeshStandardMaterial({ map: asphalt, color: 11585759, roughness: 0.24, metalness: 0.48 }));
      street.rotation.x = -Math.PI / 2;
      street.position.y = 0.26;
      street.receiveShadow = true;
      world.add(street);
      function rampWidth(x) {
        return Math.min(THREE.MathUtils.clamp((x - 2.18) / 0.22, 0, 1), THREE.MathUtils.clamp((3.72 - x) / 0.16, 0, 1));
      }
      function rampDrop(x, z) {
        return 0.23 * rampWidth(x) * THREE.MathUtils.clamp((z - 1.75) / 0.795, 0, 1);
      }
      const sidewalkExtension = new THREE.Mesh(new THREE.BoxGeometry(9.67, 0.25, 8.6, 100, 1, 100), mat(5400696));
      sidewalkExtension.position.set(-1.115, 0.385, -1.65);
      sidewalkExtension.name = "continuous-sidewalk";
      sidewalkExtension.receiveShadow = true;
      world.add(sidewalkExtension);
      {
        const p = sidewalkExtension.geometry.attributes.position;
        for (let i = 0; i < p.count; i++) if (p.getY(i) > 0) p.setY(i, p.getY(i) - rampDrop(p.getX(i) - 1.115, p.getZ(i) - 1.65));
        p.needsUpdate = true;
        sidewalkExtension.geometry.computeVertexNormals();
      }
      const pavementTiles = [], tileStep = 0.72, tileOriginX = -5.35, tileOriginZ = -4.75;
      const pavingBounds = { left: -5.95, right: 3.58, back: -5.95, front: 2.545 };
      for (let ix = -1; ix < 14; ix++) for (let iz = -2; iz < 12; iz++) {
        const cx = tileOriginX + ix * tileStep, cz = tileOriginZ + iz * tileStep;
        const x0 = Math.max(cx - 0.345, pavingBounds.left), x1 = Math.min(cx + 0.345, pavingBounds.right), z0 = Math.max(cz - 0.345, pavingBounds.back), z1 = Math.min(cz + 0.345, pavingBounds.front);
        if (x1 - x0 < 0.015 || z1 - z0 < 0.015) continue;
        const tile = box((x0 + x1) / 2, 0.518, (z0 + z1) / 2, x1 - x0, 0.012, z1 - z0, 7043973, false);
        const p = tile.geometry.attributes.position;
        for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) - rampDrop(p.getX(i) + tile.position.x, p.getZ(i) + tile.position.z));
        p.needsUpdate = true;
        tile.geometry.computeVertexNormals();
        tile.name = "aligned-paving-tile";
        tile.userData.grid = [ix, iz];
        pavementTiles.push(tile);
      }
      const curbParts = [];
      const curbCuts = [-5.95];
      for (let x = -5.45; x < 3.86; x += 0.5) curbCuts.push(x);
      curbCuts.push(2.18, 2.4, 3.56, 3.72, 3.86);
      curbCuts.sort((a, b) => a - b);
      for (let i = 0; i < curbCuts.length - 1; i++) {
        const x0 = curbCuts[i], x1 = curbCuts[i + 1];
        if (x1 - x0 < 1e-3) continue;
        const curb = box((x0 + x1) / 2, 0.43, 2.68, x1 - x0, 0.28, 0.27, 10070189, false);
        const p = curb.geometry.attributes.position;
        for (let j = 0; j < p.count; j++) if (p.getY(j) > 0) p.setY(j, p.getY(j) - 0.276 * rampWidth(p.getX(j) + curb.position.x));
        p.needsUpdate = true;
        curb.geometry.computeVertexNormals();
        curb.add(new THREE.LineSegments(new THREE.EdgesGeometry(curb.geometry), ink));
        curb.name = "crossing-curb";
        curbParts.push(curb);
      }
      for (let z = -5.95; z < 2.545; z += 0.5) {
        const d = Math.min(0.5, 2.545 - z);
        curbParts.push(box(3.72, 0.43, z + d / 2, 0.28, 0.28, d, 10070189));
      }
      const farRoadCurb = new THREE.Group();
      farRoadCurb.name = "opposite-road-edge-curb";
      world.add(farRoadCurb);
      const farCuts = [-5.95, 2.18, 2.4, 3.56, 3.72, 5.95];
      for (let x = -5.45; x < 5.95; x += 0.5) farCuts.push(x);
      farCuts.sort((a, b) => a - b);
      for (let i = 0; i < farCuts.length - 1; i++) {
        const a = farCuts[i], b = farCuts[i + 1];
        if (b - a < 1e-3) continue;
        const curb = box((a + b) / 2, 0.43, 5.82, b - a, 0.28, 0.27, 10070189, false, 0, farRoadCurb), points = curb.geometry.attributes.position;
        for (let j = 0; j < points.count; j++) if (points.getY(j) > 0) points.setY(j, points.getY(j) - 0.276 * rampWidth(points.getX(j) + curb.position.x));
        points.needsUpdate = true;
        curb.geometry.computeVertexNormals();
        curb.add(new THREE.LineSegments(new THREE.EdgesGeometry(curb.geometry), ink));
      }
      const edgeDecorations = [];
      for (const x of [-5.1, -2.6, 0.2, 4.75]) {
        const g = new THREE.Group();
        g.name = "weather-road-edge-stud";
        g.position.set(x, 0.576, 5.82);
        farRoadCurb.add(g);
        box(0, 0, 0, 0.14, 0.012, 0.095, 5400696, true, 0, g);
        const variants = {};
        for (const mode of ["rain", "sunny", "dusk", "cyber"]) {
          const v = new THREE.Group();
          v.name = "edge-stud-" + mode;
          g.add(v);
          variants[mode] = v;
        }
        const rainStud = box(0, 0.01, 0, 0.1, 9e-3, 0.045, 11130589, false, 0, variants.rain);
        rainStud.material = new THREE.MeshBasicMaterial({ color: 11130589, transparent: true, opacity: 0.55 });
        cyl(0, 0.011, 0, 0.035, 9e-3, 12887929, 12, variants.sunny);
        for (const a of [0, Math.PI / 2, Math.PI, Math.PI * 1.5]) {
          const ray = box(Math.cos(a) * 0.049, 0.011, Math.sin(a) * 0.034, 0.018, 7e-3, 9e-3, 12887929, false, 0, variants.sunny);
          ray.rotation.y = -a;
        }
        for (const x2 of [-0.032, 0.032]) {
          const amber = box(x2, 0.011, 0, 0.024, 0.01, 0.047, 14857604, false, 0, variants.dusk);
          amber.material = new THREE.MeshBasicMaterial({ color: 14857604, transparent: true, opacity: 0.6 });
          const cyan = box(x2, 0.011, 0, 0.025, 9e-3, 0.05, 8047322, false, 0, variants.cyber);
          cyan.material = new THREE.MeshBasicMaterial({ color: 8047322, transparent: true, opacity: 0.7 });
        }
        edgeDecorations.push(variants);
      }
      function animateEdgeDecorations() {
        const mode = weatherMode === "cyber" ? "cyber" : isDusk ? "dusk" : isSunny ? "sunny" : "rain";
        edgeDecorations.forEach((variants) => Object.keys(variants).forEach((k) => variants[k].visible = k === mode));
      }
      box(-1.15, 0.59, -1.55, 6.9, 0.18, 4.6, 15062456);
      box(-3.7625, 2.03, -3.8, 1.675, 2.8, 0.13, 14145219);
      box(-0.455, 2.03, -3.8, 2.84, 2.8, 0.13, 14145219);
      box(-2.4, 1.02, -3.8, 1.05, 0.78, 0.13, 14145219);
      box(-2.4, 2.89, -3.8, 1.05, 1.08, 0.13, 14145219);
      box(2.1775, 2.03, -3.8, 0.245, 2.8, 0.13, 14145219);
      box(1.51, 3.14, -3.8, 1.09, 0.58, 0.13, 14145219);
      const leftWallSections = new THREE.Group();
      leftWallSections.name = "left-wall-around-vent-opening";
      world.add(leftWallSections);
      box(-4.55, 2.03, -3.385, 0.14, 2.8, 0.93, 12241350, true, 0, leftWallSections);
      box(-4.55, 2.03, -0.585, 0.14, 2.8, 2.47, 12241350, true, 0, leftWallSections);
      box(-4.55, 1.125, -2.37, 0.14, 0.99, 1.1, 12241350, true, 0, leftWallSections);
      box(-4.55, 2.875, -2.37, 0.14, 1.11, 1.1, 12241350, true, 0, leftWallSections);
      box(-1.15, 3.61, -1.57, 7.15, 0.22, 4.85, 7900306);
      box(-1.15, 3.79, -1.57, 7.35, 0.14, 5.02, 3953763);
      for (let z = -3.8; z < 0.8; z += 0.38) box(-1.15, 3.87, z, 7.1, 0.014, 0.025, 7045255, false);
      box(-1.15, 3.38, 0.89, 7.45, 0.43, 0.46, 15788242);
      box(-1.15, 3.23, 1.08, 7.45, 0.065, 0.12, 7394994, false, 0.35);
      box(-1.15, 3.53, 1.08, 7.45, 0.045, 0.12, 16100720, false, 0.4);
      const sign = plaque(-1.15, 3.4, 1.126, 6.65, 0.29, "\u307B\u3057\u306E  MART  \u2022  24 H", "#f5efd9", "#247d75", 90);
      const frontAwning = box(-1.15, 2.99, 1.3, 7.5, 0.16, 1, 5400953);
      frontAwning.name = "shaded-front-awning";
      frontAwning.material = mat(5400953).clone();
      frontAwning.material.onBeforeCompile = (shader) => {
        const chunk = THREE.ShaderChunk.lights_fragment_begin.replace("getPointLightInfo( pointLight, geometryPosition, directLight );", "getPointLightInfo( pointLight, geometryPosition, directLight ); directLight.color *= ( inverseTransformDirection( geometryNormal, viewMatrix ).y > -0.1 ? 0.0 : 1.0 );");
        const corrected = chunk.replace("getSpotLightInfo( spotLight, geometryPosition, directLight );", "getSpotLightInfo( spotLight, geometryPosition, directLight ); directLight.color *= ( inverseTransformDirection( geometryNormal, viewMatrix ).y > -0.1 ? 0.0 : 1.0 );");
        shader.fragmentShader = shader.fragmentShader.replace("#include <lights_fragment_begin>", corrected);
      };
      frontAwning.material.customProgramCacheKey = () => "awning-without-top-and-rim-hotspots";
      box(-1.15, 2.89, 1.34, 7.35, 0.035, 0.9, 16767906, false, 0.8);
      for (let x of [-4.53, -2.12, -0.32, 2.31]) box(x, 1.77, 0.77, 0.055, 2.48, 0.065, 4479844);
      box(-3.325, 0.76, 0.77, 2.41, 0.12, 0.11, 5137516);
      box(0.995, 0.76, 0.77, 2.63, 0.12, 0.11, 5137516);
      box(-1.15, 2.98, 0.77, 6.9, 0.11, 0.11, 5137516);
      const glass = new THREE.MeshPhysicalMaterial({ color: 14868413, transparent: true, opacity: 0.12, roughness: 0.14, metalness: 0.1, side: THREE.DoubleSide, depthWrite: false });
      function pane(x, y, z, w, h, rot = 0, parent = world) {
        let o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), glass);
        o.position.set(x, y, z);
        o.rotation.y = rot;
        parent.add(o);
        return o;
      }
      pane(-3.325, 1.86, 0.8, 2.35, 2.13);
      pane(0.995, 1.86, 0.8, 2.57, 2.13);
      pane(2.31, 2.11, -1.5, 4.62, 2.72, Math.PI / 2);
      for (let z = -3.65; z < 0.9; z += 1.5) box(2.34, 2.025, z, 0.075, 2.96, 0.065, 4413281);
      box(2.34, 0.77, -1.45, 0.08, 0.12, 4.4, 5269618);
      box(2.34, 2.97, -1.45, 0.08, 0.12, 4.4, 5269618);
      const rightRoofHeader = box(2.34, 3.49, -1.45, 0.09, 0.1, 4.62, 4413281);
      rightRoofHeader.name = "continuous-right-roof-header";
      const shellSeals = new THREE.Group();
      shellSeals.name = "continuous-shell-junctions";
      world.add(shellSeals);
      box(-1.15, 3.465, -3.8, 6.96, 0.17, 0.16, 14145219, true, 0, shellSeals);
      box(-4.55, 3.465, -1.55, 0.16, 0.17, 4.65, 12241350, true, 0, shellSeals);
      box(-1.15, 3.285, 0.77, 6.96, 0.53, 0.13, 7900306, true, 0, shellSeals);
      box(-4.55, 2.07, 0.735, 0.15, 2.96, 0.2, 4479844, true, 0, shellSeals);
      box(2.32, 2.075, 0.78, 0.105, 2.97, 0.105, 4413281, true, 0, shellSeals);
      box(2.32, 2.075, -3.765, 0.105, 2.97, 0.18, 4413281, true, 0, shellSeals);
      box(2.34, 0.765, -1.5, 0.09, 0.13, 4.62, 5269618, true, 0, shellSeals);
      const doors = [];
      for (let i = 0; i < 2; i++) {
        let g = new THREE.Group();
        g.position.set(-1.22 + (i ? 0.44 : -0.44), 0, 0.825);
        world.add(g);
        pane(0, 1.85, 0, 0.84, 2.16, 0, g);
        box(0, 0.77, 0, 0.84, 0.08, 0.07, 6586758, true, 0, g);
        box(0, 2.94, 0, 0.84, 0.06, 0.07, 6586758, true, 0, g);
        for (let x of [-0.42, 0.42]) box(x, 1.85, 0, 0.04, 2.2, 0.07, 6586758, true, 0, g);
        box(i ? -0.27 : 0.27, 1.65, 0.04, 0.035, 0.38, 0.04, 14801333, true, 0, g);
        plaque(0, 1.45, 0.048, 0.48, 0.1, "\u81EA \u52D5", "#f0ead3", "#417f76", 100, g);
        doors.push(g);
      }
      box(-1.22, 0.62, 1.12, 1.6, 0.025, 0.72, 3161671);
      for (let i = 0; i < 8; i++) box(-1.88 + i * 0.18, 0.637, 1.12, 0.03, 8e-3, 0.65, 5662053, false);
      for (let x = -4.1; x < 2; x += 0.6) for (let z = -3.4; z < 0.7; z += 0.6) box(x, 0.694, z, 0.575, 8e-3, 0.575, 14800045, false);
      for (let z of [-2.7, -0.5]) {
        box(-1.2, 3.43, z, 5.75, 0.035, 0.17, 16774087, false, 1.3);
      }
      const refrigeratorDoors = [], refrigeratorLeaves = [];
      for (let k = 0; k < 3; k++) {
        const x = [-3.92, -1.35, -0.25][k], g = new THREE.Group();
        g.name = "refrigerator-hollow-cabinet";
        world.add(g);
        box(x, 1.65, -3.7, 1.05, 1.91, 0.055, 3495015, true, 0, g);
        for (const side of [-1, 1]) box(x + side * 0.51, 1.65, -3.33, 0.035, 1.91, 0.72, 3495015, true, 0, g);
        for (const y of [0.71, 2.59]) box(x, y, -3.33, 1.05, 0.045, 0.72, 3495015, true, 0, g);
        box(x, 1.68, -3.66, 0.96, 1.61, 0.018, k === 2 ? 15316601 : 9884365, false, 0.35, g);
        for (const y of [1.04, 1.43, 1.84, 2.24]) {
          box(x, y, -3.32, 0.94, 0.04, 0.55, 15196870, true, 0, g);
          for (let j = 0; j < 5; j++) {
            const xx = x - 0.36 + j * 0.18;
            if (k === 2) {
              box(xx, y + 0.08, -3.28, 0.165, 0.12, 0.34, 13022606, false, 0, g);
              box(xx, y + 0.15, -3.28, 0.16, 0.015, 0.33, 15327945, false, 0, g);
              box(xx - 0.03, y + 0.164, -3.25, 0.06, 0.014, 0.13, 11570512, false, 0, g);
              box(xx + 0.04, y + 0.164, -3.25, 0.04, 0.014, 0.13, 7771755, false, 0, g);
            } else if (k === 0 && j % 2) {
              box(xx, y + 0.13, -3.23, 0.13, 0.22, 0.13, 15328469, false, 0, g);
              box(xx, y + 0.25, -3.23, 0.14, 0.02, 0.14, 12043964, false, 0, g);
            } else {
              const bottle = cyl(xx, y + 0.14, -3.23, 0.059, 0.21, k === 0 ? 15656917 : [6721428, 8939082, 10587218, 7511689, 8951204][j], 8, g);
              bottle.name = k === 0 ? "milk-bottle" : "drink-bottle";
              cyl(xx, y + 0.26, -3.23, 0.036, 0.025, k === 0 ? 10139830 : 12040610, 8, g);
              box(xx, y + 0.15, -3.166, 0.09, 0.05, 8e-3, 16774359, false, 0, g);
            }
          }
        }
        const doorPartsStart = g.children.length;
        const door = pane(x, 1.66, -2.968, 0.96, 1.77, 0, g);
        door.name = "refrigerator-glass-door";
        refrigeratorDoors.push(door);
        for (const side of [-1, 1]) box(x + side * 0.48, 1.66, -2.95, 0.028, 1.8, 0.035, 3757155, true, 0, g);
        for (const y of [0.76, 2.56]) box(x, y, -2.95, 0.98, 0.03, 0.035, 3757155, true, 0, g);
        box(x + 0.39, 1.76, -2.92, 0.025, 0.45, 0.035, 3757155, true, 0, g);
        const leaf = new THREE.Group();
        leaf.position.set(x - 0.48, 0, -2.948);
        leaf.name = "refrigerator-hinged-leaf";
        leaf.userData.open = false;
        leaf.userData.amount = 0;
        g.add(leaf);
        g.updateMatrixWorld(true);
        g.children.slice(doorPartsStart).filter((o) => o !== leaf).forEach((o) => leaf.attach(o));
        refrigeratorLeaves.push(leaf);
        box(x, 2.65, -3.17, 1.04, 0.19, 0.08, 15330772, false, 0.5, g);
        plaque(x, 2.65, -3.12, 0.91, 0.11, ["\u725B\u5976 \xB7 \u9178\u5976", "\u6C7D\u6C34\xB7\u683C\u74E6\u65AF\xB7\u51B0\u5564\u9152", "\u70ED\u76D2\u996D"][k], "#ecf0d9", "#30626a", 90, g);
      }
      const shelfUnits = [];
      function shelf(x, z, w) {
        const g = new THREE.Group();
        g.position.set(x, 0, z);
        g.name = "stocked-open-shelf";
        world.add(g);
        shelfUnits.push(g);
        box(0, 1.28, 0, w, 1.12, 0.035, 11842976, true, 0, g);
        for (let side of [-1, 1]) box(side * w / 2, 1.28, 0, 0.035, 1.12, 0.65, 13223596, true, 0, g);
        const colors = [15649657, 15372933, 9615264, 13018555, 15064257];
        [0.91, 1.29, 1.68].forEach((y, level) => {
          box(0, y, 0, w + 0.08, 0.055, 0.73, 15983030, true, 0, g);
          for (let j = 0; j < 9; j++) for (let side of [-1, 1]) {
            const xx = -w * 0.43 + j * w * 0.107, d = side * 0.23, color = colors[(j + level * 2) % 5];
            let product;
            if (level < 2 && j % 3 === 0) {
              product = cyl(xx, y + 0.145, d, 0.058, 0.235, color, 10, g);
              cyl(xx, y + 0.273, d, 0.04, 0.023, 13883333, 8, g);
            } else {
              const h = level === 0 ? 0.19 : level === 1 ? 0.245 : 0.22;
              product = box(xx, y + 0.028 + h / 2, d, 0.14, h, 0.13, color, false, 0, g);
            }
            product.name = "shelf-product";
            product.userData.shelfLevel = level;
            box(xx, y + 0.145, d + side * 0.072, 0.103, 0.06, 9e-3, 16774102, false, 0, g);
          }
          for (let side of [-1, 1]) {
            box(0, y - 0.05, side * 0.379, w, 0.085, 0.01, 16052192, false, 0, g);
            for (let j = 0; j < 9; j++) box(-w * 0.44 + j * w * 0.11, y - 0.05, side * 0.386, 0.085, 0.034, 4e-3, 13527637, false, 0, g);
          }
        });
      }
      shelf(-2.7, -1.9, 2.25);
      shelf(-2.7, -0.65, 2.25);
      box(0.88, 1.08, -0.78, 1.97, 0.8, 0.68, 12823428);
      box(0.88, 1.51, -0.78, 2.1, 0.08, 0.77, 16050898);
      box(0.88, 1.12, -0.417, 1.84, 0.33, 0.017, 6719359);
      plaque(0.88, 1.12, -0.403, 1.38, 0.13, "\u304A\u3067\u3093  \u2022  COFFEE", "#66877f", "#f4ebd2", 70);
      box(0.41, 1.7, -0.78, 0.39, 0.29, 0.28, 3359822);
      let reg = box(0.41, 1.87, -0.74, 0.4, 0.23, 0.055, 3230043);
      reg.rotation.x = -0.3;
      box(0.41, 1.87, -0.699, 0.3, 0.14, 6e-3, 9164225, false, 0.5);
      box(1.54, 1.81, -0.78, 0.37, 0.54, 0.35, 3556945);
      box(1.54, 1.91, -0.585, 0.23, 0.18, 0.015, 9684407, false, 0.4);
      const cupProfile = [[0, 0], [0.045, 0], [0.057, 0.09], [0.046, 0.09], [0.035, 0.014], [0, 0.014]].map(([r, y]) => new THREE.Vector2(r, y));
      const coffeeCup = new THREE.Mesh(new THREE.LatheGeometry(cupProfile, 24), mat(16774101));
      coffeeCup.position.set(1.54, 1.57, -0.57);
      coffeeCup.castShadow = true;
      world.add(coffeeCup);
      box(0.92, 1.63, -0.76, 0.49, 0.14, 0.37, 13350256);
      for (let x of [0.79, 0.94, 1.08]) for (let z of [-0.86, -0.67]) cyl(x, 1.72, z, 0.054, 0.07, 14467218, 8);
      pane(0.94, 1.82, -0.54, 0.53, 0.2);
      box(1.51, 1.05, -2.29, 1.27, 0.71, 0.74, 15064529);
      box(1.51, 1.43, -2.29, 1.32, 0.09, 0.8, 9488321);
      plaque(1.51, 1.03, -1.907, 0.96, 0.17, "\u304A\u3067\u3093\u30FB\u8089\u307E\u3093", "#e4ddd0", "#a06443", 70);
      const odenCounter = new THREE.Group();
      odenCounter.name = "hot-oden-display";
      world.add(odenCounter);
      box(1.32, 1.54, -2.31, 0.84, 0.12, 0.61, 10201761, true, 0, odenCounter);
      box(1.32, 1.608, -2.31, 0.76, 0.012, 0.53, 10911301, false, 0.08, odenCounter);
      for (let x of [1.185, 1.455]) box(x, 1.638, -2.31, 0.018, 0.07, 0.55, 13946795, true, 0, odenCounter);
      box(1.32, 1.638, -2.31, 0.8, 0.07, 0.018, 13946795, true, 0, odenCounter);
      for (let col = 0; col < 3; col++) for (let row = 0; row < 2; row++) {
        const x = 1.05 + col * 0.27, z = -2.445 + row * 0.27;
        if (col === 0) {
          cyl(x, 1.659, z, 0.073, 0.085, 15848865, 14, odenCounter);
          cyl(x, 1.705, z, 0.045, 5e-3, 15058065, 12, odenCounter);
        } else if (col === 1) {
          const egg = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 10), mat(row ? 15255181 : 16048564));
          egg.position.set(x, 1.674, z);
          egg.scale.set(0.065, 0.075, 0.052);
          odenCounter.add(egg);
        } else {
          const tofu = box(x, 1.669, z, 0.115, 0.09, 0.12, row ? 14069362 : 15385998, true, 0, odenCounter);
          tofu.rotation.y = 0.28;
        }
      }
      cyl(1.96, 1.558, -2.33, 0.135, 0.135, 13148780, 16, odenCounter);
      cyl(1.96, 1.628, -2.33, 0.14, 0.016, 14926475, 16, odenCounter);
      const bunsGroup = new THREE.Group();
      bunsGroup.name = "steamer-buns";
      odenCounter.add(bunsGroup);
      bunsGroup.visible = false;
      for (let i = 0; i < 3; i++) {
        let a = i * Math.PI * 2 / 3, bun = new THREE.Mesh(new THREE.SphereGeometry(0.058, 12, 8), mat(16771779));
        bun.scale.y = 0.82;
        bun.position.set(1.96 + Math.cos(a) * 0.06, 1.675, -2.33 + Math.sin(a) * 0.06);
        bunsGroup.add(bun);
      }
      const bunLid = new THREE.Group();
      bunLid.name = "bamboo-steamer-lid";
      bunLid.position.set(1.96, 1.636, -2.47);
      odenCounter.add(bunLid);
      cyl(0, 0.06, 0.14, 0.146, 0.11, 13346160, 20, bunLid);
      const lidTop = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.149, 0.04, 20), mat(14728580));
      lidTop.position.set(0, 0.131, 0.14);
      lidTop.castShadow = true;
      bunLid.add(lidTop);
      for (let i = 0; i < 5; i++) box(-0.086 + i * 0.043, 0.154, 0.14, 0.01, 6e-3, 0.14, 12885867, false, 0, bunLid);
      const lidHandle = new THREE.Mesh(new THREE.TorusGeometry(0.025, 8e-3, 6, 16, Math.PI), mat(11833183));
      lidHandle.position.set(0, 0.155, 0.14);
      bunLid.add(lidHandle);
      for (let x of [0.9, 2.16]) rod([x, 1.48, -2.59], [x, 1.99, -2.59], 0.018, 7440255, odenCounter);
      box(1.53, 2, -2.59, 1.3, 0.12, 0.07, 10706755, true, 0, odenCounter);
      plaque(1.53, 2, -2.547, 1.14, 0.09, "\u3042\u3064\u3042\u3064 \u304A\u3067\u3093", "#a35f43", "#ffedc5", 75, odenCounter);
      pane(1.53, 1.78, -1.98, 1.25, 0.37, 0, odenCounter);
      rod([1.09, 1.65, -1.96], [1.38, 1.65, -2.03], 0.012, 12634298, odenCounter);
      rod([1.09, 1.65, -1.96], [1.37, 1.65, -1.98], 0.012, 12634298, odenCounter);
      box(-4.21, 1.19, 0.08, 0.37, 0.98, 0.66, 6388864);
      for (let i = 0; i < 4; i++) {
        let p = box(-4.2, 1.02 + i * 0.2, 0.43, 0.29, 0.23, 0.025, [14988448, 10075585, 15784080, 10985929][i]);
        p.rotation.x = -0.25;
        plaque(-4.2, 1.06 + i * 0.2, 0.45, 0.2, 0.065, ["\u4E61\u6751\u751F\u6D3B", "\u519C\u6C11\u65E5\u62A5", "\u6545\u4E8B\u4F1A", "\u5065\u5EB7\u62A5"][i], "#ecdac1", "#3d6477", 95);
      }
      const staffLeafStart = world.children.length;
      const staffDoor = box(1.51, 1.77, -3.8, 1.01, 2.12, 0.14, 11186842);
      staffDoor.name = "shared-service-door";
      for (let z of [-3.715, -3.885]) {
        let label2 = plaque(1.51, 2.1, z, 0.8, 0.19, "STAFF ONLY", "#aab29a", "#fff1cc", 65);
        if (z < -3.8) label2.rotation.y = Math.PI;
        box(1.85, 1.64, z, 0.06, 0.065, 0.045, 14797210);
      }
      const staffLeaf = world.children.slice(staffLeafStart);
      const staffHinge = new THREE.Group();
      staffHinge.position.set(1.005, 0, -3.8);
      world.add(staffHinge);
      world.updateMatrixWorld(true);
      staffLeaf.forEach((o) => staffHinge.attach(o));
      for (let y of [1.08, 2.5]) cyl(1.005, y, -3.8, 0.034, 0.16, 12824456, 10);
      for (let x of [0.975, 2.045]) box(x, 1.78, -3.8, 0.055, 2.2, 0.2, 6189421);
      box(1.51, 2.89, -3.8, 1.13, 0.08, 0.2, 6189421);
      box(1.51, 0.64, -4.13, 1.32, 0.22, 0.64, 8753547);
      box(1.51, 3.01, -3.99, 0.5, 0.1, 0.24, 6912110);
      box(1.51, 2.95, -4.01, 0.4, 0.018, 0.19, 16764558, false, 1.1);
      box(-2.4, 3.075, -3.9, 1.32, 0.43, 0.045, 5798253);
      for (const [x, text] of [[-2.73, "\u65B0\u767A\u58F2"], [-2.07, "\u3042\u3063\u305F\u304B"]]) {
        const p = plaque(x, 3.16, -3.93, 0.52, 0.16, text, "#e8dab8", "#8b7155", 80);
        p.rotation.y = Math.PI;
      }
      const vendingCans = [], vendingPalettes = { rain: [7445430, 8301225, 9344180, 7183507], sunny: [15187058, 14654588, 14208923, 11912603], dusk: [12818566, 12095135, 13217161, 9801894] };
      function vendingPalette() {
        return vendingPalettes[weatherMode];
      }
      box(-5.03, 1.4, 0.78, 0.79, 1.79, 0.75, 11192011);
      box(-5.03, 2.36, 0.78, 0.85, 0.12, 0.81, 4217968);
      box(-5.03, 1.66, 1.166, 0.62, 1.01, 0.026, 2506581);
      box(-5.03, 1.67, 1.19, 0.53, 0.88, 0.016, 10344919, false, 0.65);
      for (let y of [1.37, 1.64, 1.9]) for (let i = 0; i < 4; i++) {
        const can = cyl(-5.23 + i * 0.135, y, 1.22, 0.046, 0.16, vendingPalette()[i], 8);
        can.material = can.material.clone();
        can.userData.slot = i;
        vendingCans.push(can);
        box(-5.23 + i * 0.135, y - 0.13, 1.232, 0.076, 0.03, 0.014, 14151139, false, 0.4);
      }
      box(-5.03, 0.84, 1.17, 0.48, 0.2, 0.035, 2309454);
      box(-4.76, 1.21, 1.2, 0.075, 0.15, 0.035, 3427933);
      plaque(-5.03, 2.24, 1.2, 0.6, 0.1, "\u3064\u3081\u305F\u3044", "#f1e9cb", "#46897d", 100);
      const rearBins = [];
      for (let i = 0; i < 2; i++) {
        const bin = new THREE.Group();
        bin.position.set(-4.91, 0.524, -2.69 + i * 0.64);
        bin.rotation.y = -Math.PI / 2;
        bin.name = i ? "left-wall-pet-bin" : "left-wall-can-bin";
        world.add(bin);
        rearBins.push(bin);
        box(0, 0.045, 0, 0.45, 0.09, 0.49, 9085860, true, 0, bin);
        for (const side of [-1, 1]) {
          box(side * 0.211, 0.425, 0, 0.028, 0.69, 0.49, 9085860, true, 0, bin);
          box(0, 0.425, side * 0.231, 0.394, 0.69, 0.028, 9085860, true, 0, bin);
        }
        box(0, 0.095, 0, 0.388, 0.024, 0.423, 3164243, false, 0, bin);
        for (const side of [-1, 1]) {
          box(side * 0.211, 0.777, 0, 0.034, 0.026, 0.49, 5270647, true, 0, bin);
          box(0, 0.777, side * 0.231, 0.394, 0.026, 0.028, 5270647, true, 0, bin);
        }
        box(0, 0.7, 0.253, 0.2, 0.1, 0.018, 2440785, true, 0, bin);
        plaque(0, 0.46, 0.253, 0.27, 0.1, i ? "PET" : "\u7F36", "#8aa3a4", "#e0e9d1", 100, bin);
        const hinge = new THREE.Group();
        hinge.position.set(0, 0.8, -0.27);
        hinge.name = "recycling-bin-lid-hinge";
        bin.add(hinge);
        box(0, 0.03, 0.27, 0.48, 0.1, 0.54, 5270647, true, 0, hinge);
        rod([-0.19, 0, 0], [0.19, 0, 0], 0.025, 3362395, hinge);
        bin.userData.hinge = hinge;
        bin.userData.open = false;
        bin.userData.amount = 0;
        bin.userData.category = i ? "PET" : "CANS";
        const contents = new THREE.Group();
        contents.name = i ? "sorted-pet-bottles" : "sorted-drink-cans";
        bin.add(contents);
        bin.userData.contents = contents;
        for (let j = 0; j < 5; j++) {
          const g = new THREE.Group();
          g.position.set((j % 2 ? 1 : -1) * 0.087, 0.4 + j % 3 * 0.043, -0.11 + Math.floor(j / 2) * 0.1);
          g.rotation.set((j % 3 - 1) * 0.18, 0, (j % 2 ? 1 : -1) * 0.18);
          contents.add(g);
          if (i) {
            const bottle = cyl(0, 0, 0, 0.053, 0.27, isCyberEdition ? 9357011 : 11524307, 12, g);
            bottle.name = "recycled-pet-bottle";
            bottle.material = bottle.material.clone();
            bottle.material.transparent = true;
            bottle.material.opacity = 0.68;
            cyl(0, 0.151, 0, 0.029, 0.034, isCyberEdition ? 12227021 : 9549219, 10, g);
            box(0, -0.015, 0.051, 0.072, 0.062, 5e-3, isCyberEdition ? 10789596 : 15918524, false, 0, g);
          } else {
            const can = cyl(0, 0, 0, 0.06, 0.18, [11910067, isCyberEdition ? 8437707 : 14003591, isCyberEdition ? 11835077 : 10338225][j % 3], 12, g);
            can.name = "recycled-drink-can";
            cyl(0, 0.094, 0, 0.059, 0.012, 12898503, 12, g);
            box(0, 0.102, 0, 0.027, 6e-3, 0.018, 5532021, false, 0, g);
          }
        }
      }
      const umbrellas = [];
      const umbrellaRack = new THREE.Group();
      umbrellaRack.name = "rain-umbrella-rack";
      world.add(umbrellaRack);
      const umbrellaPartsStart = world.children.length;
      for (let x of [-0.01, 0.7]) rod([x, 0.62, 1.62], [x, 1.19, 1.62], 0.023, 5797762);
      for (let y of [0.7, 1.12]) {
        rod([-0.01, y, 1.62], [0.7, y, 1.62], 0.025, 5797762);
        rod([-0.01, y, 1.94], [0.7, y, 1.94], 0.025, 5797762);
      }
      for (let i = 0; i < 4; i++) {
        const umbrellaStart = world.children.length;
        let x = 0.07 + i * 0.16;
        rod([x, 0.67, 1.8], [x, 1.42, 1.8], 0.016, 10395560);
        let points = [];
        for (let j = 0; j <= 12; j++) {
          let a = j / 12 * Math.PI;
          points.push([x + 0.065 * Math.cos(a), 1.42 + 0.065 * Math.sin(a), 1.8]);
        }
        line(points, 12699843);
        let u = new THREE.Mesh(new THREE.ConeGeometry(0.061, 0.61, 8), mat([9219269, 11969716, 13222565, 7573403][i]));
        u.position.set(x, 0.99, 1.8);
        world.add(u);
        const group = new THREE.Group();
        group.name = "individual-rain-umbrella";
        group.userData.index = i;
        group.userData.raised = false;
        world.add(group);
        world.children.slice(umbrellaStart).filter((o) => o !== group).forEach((o) => group.add(o));
        umbrellas.push(group);
      }
      world.children.slice(umbrellaPartsStart).forEach((o) => umbrellaRack.add(o));
      const bike = new THREE.Group();
      world.add(bike);
      bike.position.set(-0.6, 0.524, -4.25);
      bike.rotation.y = 0;
      function wheel(x) {
        const t = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.039, 7, 30), mat(2504776));
        t.position.set(x, 0.47, 0);
        bike.add(t);
        const rim2 = new THREE.Mesh(new THREE.TorusGeometry(0.385, 0.015, 6, 30), mat(10533050));
        rim2.position.copy(t.position);
        bike.add(rim2);
        for (let j = 0; j < 12; j++) {
          let a = j * Math.PI / 6;
          rod([x, 0.47, 0], [x + 0.38 * Math.cos(a), 0.47 + 0.38 * Math.sin(a), 0], 4e-3, 11189695, bike);
        }
      }
      wheel(-0.64);
      wheel(0.69);
      for (let [a, b] of [[[-0.64, 0.47, 0], [-0.13, 0.51, 0]], [[-0.64, 0.47, 0], [-0.3, 1.09, 0]], [[-0.3, 1.09, 0], [-0.13, 0.51, 0]], [[-0.13, 0.51, 0], [0.36, 1.03, 0]], [[0.36, 1.03, 0], [-0.3, 1.09, 0]], [[0.36, 1.03, 0], [0.69, 0.47, 0]]]) rod(a, b, 0.027, 11258297, bike);
      rod([-0.3, 1.09, 0], [-0.33, 1.22, 0], 0.025, 9808553, bike);
      box(-0.35, 1.23, 0, 0.28, 0.07, 0.16, 3095878, true, 0, bike);
      rod([0.36, 1.03, 0], [0.36, 1.37, 0], 0.021, 12305852, bike);
      rod([0.36, 1.37, -0.2], [0.36, 1.37, 0.2], 0.024, 12962238, bike);
      box(0.63, 1.21, 0, 0.38, 0.3, 0.32, 5467769, true, 0, bike);
      for (let i = 0; i < 5; i++) rod([0.45 + i * 0.08, 1.08, 0.165], [0.45 + i * 0.08, 1.37, 0.165], 7e-3, 10268590, bike);
      bike.updateMatrixWorld(true);
      const bikeBounds = new THREE.Box3().setFromObject(bike);
      bike.position.y += 0.524 - bikeBounds.min.y;
      const flowerPots = [];
      const entranceDecor = new THREE.Group();
      entranceDecor.name = "entrance-flowers-and-postbox";
      world.add(entranceDecor);
      function flowerPot(x, z, scale = 1) {
        const g = new THREE.Group();
        g.position.set(x, 0.524, z);
        g.scale.setScalar(scale);
        entranceDecor.add(g);
        flowerPots.push(g);
        const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.115, 0.25, 12), mat(12157026));
        pot.position.y = 0.125;
        pot.castShadow = true;
        g.add(pot);
        cyl(0, 0.255, 0, 0.166, 0.035, 13145974, 12, g);
        cyl(0, 0.278, 0, 0.139, 0.012, 6773318, 12, g);
        const plantStart = g.children.length;
        const colors = [14724533, 15783868, 12369618];
        for (let i = 0; i < 7; i++) {
          const a = i * 2.399, r = i ? 0.095 : 0, h = 0.43 + i % 3 * 0.055, xx = Math.cos(a) * r, zz = Math.sin(a) * r;
          rod([0, 0.27, 0], [xx, h, zz], 9e-3, 6589301, g);
          for (let side of [-1, 1]) {
            const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 8, 6), mat(7510912));
            leaf.position.set(xx + side * 0.035, h - 0.11, zz);
            leaf.scale.set(0.067, 0.014, 0.029);
            leaf.rotation.z = side * 0.4;
            g.add(leaf);
          }
          for (let p = 0; p < 5; p++) {
            let angle = p * Math.PI * 2 / 5;
            const petal = new THREE.Mesh(new THREE.SphereGeometry(0.031, 8, 6), mat(colors[i % 3]));
            petal.position.set(xx + Math.cos(angle) * 0.035, h, zz + Math.sin(angle) * 0.035);
            petal.scale.y = 0.55;
            g.add(petal);
          }
          cyl(xx, h + 6e-3, zz, 0.019, 0.012, 14268783, 8, g);
        }
        const plants = g.children.slice(plantStart), blooms = new THREE.Group();
        blooms.position.y = 0.265;
        g.add(blooms);
        g.updateMatrixWorld(true);
        plants.forEach((o) => blooms.attach(o));
        g.userData.blooms = blooms;
        g.userData.swayAt = -100;
        return g;
      }
      flowerPot(-4.15, -4.35, 1.05);
      flowerPot(-3.4, -4.35, 0.9);
      const sunnyFlowerRack = new THREE.Group();
      sunnyFlowerRack.name = "sunny-entrance-flower-rack";
      sunnyFlowerRack.position.z = -0.77;
      world.add(sunnyFlowerRack);
      box(0.345, 0.773, 1.8, 0.9, 0.055, 0.4, 10587503, true, 0, sunnyFlowerRack);
      box(0.345, 0.566, 1.8, 0.84, 0.035, 0.35, 9207915, true, 0, sunnyFlowerRack);
      for (const x of [-0.055, 0.745]) for (const z of [1.64, 1.96]) box(x, 0.648, z, 0.038, 0.248, 0.038, 7834493, true, 0, sunnyFlowerRack);
      for (let i = 0; i < 3; i++) {
        const pot = flowerPot(0.055 + i * 0.29, 1.8, 0.55);
        pot.position.y = 0.801;
        sunnyFlowerRack.add(pot);
      }
      const postbox = new THREE.Group();
      postbox.position.set(2.315, 0.524, 1.67);
      postbox.name = "red-postbox";
      entranceDecor.add(postbox);
      cyl(0, 0.045, 0, 0.17, 0.09, 7561047, 12, postbox);
      cyl(0, 0.282, 0, 0.066, 0.475, 10376526, 12, postbox);
      cyl(0, 0.74, 0, 0.21, 0.49, 11951186, 16, postbox);
      const postCap = new THREE.Mesh(new THREE.SphereGeometry(0.21, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(13137251));
      postCap.position.y = 0.985;
      postCap.castShadow = true;
      postbox.add(postCap);
      box(0, 0.825, 0.207, 0.255, 0.042, 0.022, 4998468, true, 0, postbox);
      box(0, 0.848, 0.22, 0.28, 0.018, 0.055, 14191216, true, 0, postbox);
      plaque(0, 0.689, 0.215, 0.17, 0.15, "\u3012", "#b65c52", "#fff0d2", 80, postbox);
      plaque(0, 0.555, 0.215, 0.23, 0.075, "POST", "#b65c52", "#f0ddba", 80, postbox);
      const rearWallSign = new THREE.Group();
      rearWallSign.position.set(-3.95, 2.43, -3.89);
      rearWallSign.rotation.y = Math.PI;
      world.add(rearWallSign);
      box(0, 0, 0, 0.37, 0.26, 0.04, 10124898, true, 0, rearWallSign);
      seasonalPlaque(0, 0, 0.026, 0.32, 0.2, "\u96E8\u3084\u3069\u308A", "\u3072\u306A\u305F", "#dfca9e", "#6a8274", 80, rearWallSign);
      const wallPlanter = new THREE.Group();
      wallPlanter.position.set(-3.85, 1.74, -3.98);
      wallPlanter.rotation.y = -Math.PI / 2;
      wallPlanter.scale.z = 2.1;
      entranceDecor.add(wallPlanter);
      box(-0.03, 0, 0, 0.24, 0.19, 0.48, 10125412, true, 0, wallPlanter);
      rod([0.11, 0.25, -0.16], [-0.12, 0.09, -0.16], 0.012, 5271145, wallPlanter);
      rod([0.11, 0.25, 0.16], [-0.12, 0.09, 0.16], 0.012, 5271145, wallPlanter);
      for (let i = 0; i < 9; i++) {
        const z = -0.18 + i * 0.045, leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 9, 6), mat(i % 2 ? 8166262 : 9217415));
        leaf.position.set(-0.1 - i % 3 * 0.026, 0.12 - i % 2 * 0.05, z);
        leaf.scale.set(0.12, 0.07, 0.06);
        wallPlanter.add(leaf);
      }
      const wallVentExterior = new THREE.Group();
      wallVentExterior.name = "left-wall-exterior-air-unit";
      world.add(wallVentExterior);
      const wallVentInterior = new THREE.Group();
      wallVentInterior.name = "left-wall-interior-air-return";
      world.add(wallVentInterior);
      const wallVentSlats = [];
      let wallVentOpen = false, wallVentAmount = 0;
      for (const [group, x, depth] of [[wallVentExterior, -4.66, 0.3], [wallVentInterior, -4.46, 0.07]]) {
        for (const side of [-1, 1]) {
          box(x, 1.97 + side * 0.365, -2.37, depth, 0.05, 1.2, 12633532, true, 0, group);
          box(x, 1.97, -2.37 + side * 0.575, depth, 0.68, 0.05, 12633532, true, 0, group);
        }
      }
      for (let k = 0; k < 5; k++) {
        const blade = box(-4.55, 1.97 + (k - 2) * 0.136, -2.37, 0.016, 0.14, 1.1, 9217189, true, 0, wallVentExterior);
        blade.name = "shared-wall-vent-louver";
        wallVentSlats.push(blade);
      }
      box(-5.05, 1.95, -3.83, 0.8, 1.23, 0.1, 4940910);
      seasonalPlaque(-5.05, 2.17, -3.77, 0.65, 0.53, "\u590F\u306E\u591C", "\u79CB\u306E\u65E5", "#d7c2a0", "#638d8d", 108);
      seasonalPlaque(-5.05, 1.58, -3.77, 0.65, 0.47, "\u8857\u89D2\u4FBF\u308A", "\u79CB\u306E\u4FBF\u308A", "#bab6b1", "#647782", 92);
      for (let item of [[2.17, 0.53, "\u590F\u306E\u591C", "#d7c2a0"], [1.58, 0.47, "\u8857\u89D2\u4FBF\u308A", "#bab6b1"]]) {
        let label2 = seasonalPlaque(-5.05, item[0], -3.891, 0.69, item[1], item[2], item[2] === "\u590F\u306E\u591C" ? "\u79CB\u306E\u65E5" : "\u79CB\u306E\u4FBF\u308A", item[3], "#526d6b", 80);
        label2.rotation.y = Math.PI;
      }
      const crossingBars = [];
      for (let i = 0; i < 7; i++) {
        const bar = box(2.98, 0.278, 3.02 + i * 0.41, 1.16, 0.013, 0.23, 11847366, false);
        bar.name = "painted-crossing-stripe";
        crossingBars.push(bar);
      }
      const roadCenterLine = new THREE.Group();
      roadCenterLine.name = "road-white-center-line";
      world.add(roadCenterLine);
      for (const [a, b] of [[-5.82, 2.35], [3.61, 5.82]]) box((a + b) / 2, 0.281, 4.36, b - a, 0.012, 0.055, 15131086, false, 0, roadCenterLine);
      const drains = [];
      for (let x of [-5.35, -3.1, -0.85, 1.4]) {
        const g = new THREE.Group();
        g.position.set(x, 0, 2.92);
        g.name = "storm-drain";
        world.add(g);
        drains.push(g);
        box(0, 0.291, 0, 0.85, 0.028, 0.19, 1650497, true, 0, g);
        for (let j = 0; j < 9; j++) box(-0.35 + j * 0.087, 0.31, 0, 0.025, 0.012, 0.15, 7508119, false, 0, g);
      }
      const railPartsStart = world.children.length;
      for (let z of [-4.8, -3.6, 0, 1.2]) {
        cyl(4.08, 1.024, z, 0.047, 1, 9942970);
        cyl(4.08, 1.554, z, 0.058, 0.07, 12505287);
      }
      for (let pair of [[-4.8, -3.6], [0, 1.2]]) for (let y of [1.034, 1.394]) rod([4.08, y, pair[0]], [4.08, y, pair[1]], 0.037, 10929347);
      const railParts = world.children.slice(railPartsStart);
      railParts.forEach((o) => o.position.x -= 0.6);
      const polePartsStart = world.children.length;
      cyl(4.14, 3.01, -4.47, 0.13, 5.5, 5464948, 12);
      for (let y of [1, 1.3, 4.7]) cyl(4.14, y, -4.47, 0.145, 0.08, 2637394);
      rod([3.46, 5.35, -4.47], [4.81, 5.35, -4.47], 0.06, 4674660);
      for (let x of [3.57, 3.92, 4.31, 4.67]) cyl(x, 5.48, -4.47, 0.067, 0.19, 11714496, 8);
      for (let j = 0; j < 3; j++) {
        let pts = [];
        for (let i = 0; i <= 32; i++) {
          let t = i / 32;
          pts.push([4.1 - j * 0.28 - (8.9 - j * 0.12) * t, 5.6 - 0.8 * Math.sin(Math.PI * t), -4.47 + 0.11 * j + 0.3 * t]);
        }
        line(pts, 1583936);
      }
      box(4.14, 4.31, -4.47, 0.42, 0.64, 0.37, 8492952);
      for (let i = 0; i < 4; i++) box(4.14, 4.12 + i * 0.12, -4.268, 0.34, 0.022, 0.01, 3953510, false);
      const poleParts = world.children.slice(polePartsStart);
      const utilityPole = new THREE.Group();
      utilityPole.name = "sidewalk-utility-pole";
      world.add(utilityPole);
      world.updateMatrixWorld(true);
      poleParts.forEach((o) => utilityPole.attach(o));
      utilityPole.position.set(-0.87, 0.264, 0);
      const signals = [], pedestrianFaces = [], vehicleFaces = [], signalHeads = [], crossingSignal = new THREE.Group();
      crossingSignal.name = "crosswalk-edge-signal";
      crossingSignal.position.set(3.77, 0.26, 5.55);
      crossingSignal.scale.setScalar(0.74);
      world.add(crossingSignal);
      cyl(0, 1.46, 0, 0.055, 2.92, 5269366, 12, crossingSignal);
      cyl(0, 0.05, 0, 0.12, 0.1, 7901583, 12, crossingSignal);
      rod([0, 2.84, 0], [-0.64, 2.84, 0], 0.04, 5402232, crossingSignal);
      function pedestrianTexture(walking) {
        return texture(256, 256, (c, W, H) => {
          c.fillStyle = "#fff";
          c.strokeStyle = "#fff";
          c.lineWidth = 23;
          c.lineCap = "round";
          c.lineJoin = "round";
          c.beginPath();
          c.arc(128, 48, 21, 0, Math.PI * 2);
          c.fill();
          c.beginPath();
          if (walking) {
            c.moveTo(130, 86);
            c.lineTo(122, 143);
            c.lineTo(81, 205);
            c.moveTo(124, 141);
            c.lineTo(172, 207);
            c.moveTo(128, 91);
            c.lineTo(88, 129);
            c.lineTo(65, 126);
            c.moveTo(128, 97);
            c.lineTo(159, 127);
            c.lineTo(187, 134);
          } else {
            c.moveTo(128, 89);
            c.lineTo(128, 148);
            c.moveTo(107, 100);
            c.lineTo(102, 151);
            c.moveTo(149, 100);
            c.lineTo(154, 151);
            c.moveTo(116, 145);
            c.lineTo(111, 211);
            c.moveTo(140, 145);
            c.lineTo(145, 211);
          }
          c.stroke();
        });
      }
      const pedestrianHead = new THREE.Group();
      pedestrianHead.position.set(-0.64, 2.43, 0);
      crossingSignal.add(pedestrianHead);
      signalHeads.push(pedestrianHead);
      box(0, 0, 0, 0.4, 0.83, 0.24, 3164757, true, 0, pedestrianHead);
      const crossingNamePlate = box(0, -0.56, 0, 0.67, 0.15, 0.26, 3427930, true, 0, pedestrianHead);
      crossingNamePlate.name = "supported-crosswalk-nameplate";
      for (const x of [-0.19, 0.19]) rod([x, -0.405, 0], [x, -0.51, 0], 0.015, 7901583, pedestrianHead);
      for (const side of [1, -1]) {
        const face2 = new THREE.Group();
        face2.rotation.y = side === 1 ? 0 : Math.PI;
        pedestrianHead.add(face2);
        const pair = [];
        for (let i = 0; i < 2; i++) {
          const y = i === 0 ? -0.2 : 0.19;
          const backing = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.32), mat(1650491));
          backing.position.set(0, y, 0.127);
          face2.add(backing);
          const icon = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 0.27), new THREE.MeshBasicMaterial({ map: pedestrianTexture(i === 0), color: i === 0 ? 8314816 : 15961486, transparent: true, depthWrite: false }));
          icon.position.set(0, y, 0.14);
          icon.name = (i === 0 ? "pedestrian-green" : "pedestrian-red") + (side === 1 ? "" : "-opposite");
          face2.add(icon);
          pair.push(icon);
          box(0, y + 0.175, 0.16, 0.35, 0.035, 0.18, 3427930, true, 0, face2);
        }
        pedestrianFaces.push(pair);
        if (side === 1) signals.push(...pair);
        plaque(0, -0.56, 0.142, 0.62, 0.1, "\u6A2A\u65AD\u6B69\u9053", "#344e5a", "#d9dcc8", 80, face2);
      }
      rod([0, 2.91, 0], [0, 2.91, -1.6], 0.04, 5402232, crossingSignal);
      const vehicleHead = new THREE.Group();
      vehicleHead.position.set(0, 2.91, -1.6);
      vehicleHead.rotation.y = Math.PI / 2;
      crossingSignal.add(vehicleHead);
      signalHeads.push(vehicleHead);
      box(0, 0, 0, 0.87, 0.34, 0.24, 3164757, true, 0, vehicleHead);
      for (const side of [1, -1]) {
        const face2 = new THREE.Group();
        face2.rotation.y = side === 1 ? 0 : Math.PI;
        vehicleHead.add(face2);
        const lamps = [];
        for (let i = 0; i < 3; i++) {
          const x = (i - 1) * 0.265;
          const rim2 = new THREE.Mesh(new THREE.CircleGeometry(0.112, 24), mat(1519160));
          rim2.position.set(x, 0, 0.126);
          face2.add(rim2);
          const lamp2 = new THREE.Mesh(new THREE.CircleGeometry(0.085, 24), new THREE.MeshBasicMaterial({ color: [15961486, 15779961, 8314816][i] }));
          lamp2.position.set(x, 0, 0.139);
          lamp2.name = ["vehicle-red", "vehicle-amber", "vehicle-green"][i] + (side === 1 ? "" : "-opposite");
          face2.add(lamp2);
          lamps.push(lamp2);
          box(x, 0.137, 0.16, 0.245, 0.03, 0.17, 3427930, true, 0, face2);
        }
        vehicleFaces.push(lamps);
      }
      const pawPrints = [];
      function pawTexture(dog2) {
        return texture(128, 128, (c, W, H) => {
          c.clearRect(0, 0, W, H);
          c.fillStyle = "#3d555b";
          c.strokeStyle = "#c4b79b";
          c.lineWidth = 2.5;
          function pad(x, y, rx, ry, a = 0) {
            c.beginPath();
            c.ellipse(x, y, rx, ry, a, 0, Math.PI * 2);
            c.fill();
            c.stroke();
          }
          pad(64, 80, dog2 ? 23 : 24, dog2 ? 23 : 18);
          for (const [x, y, a] of [[29, 55, -0.38], [50, 32, -0.12], [78, 32, 0.12], [99, 55, 0.38]]) {
            pad(x, y, dog2 ? 10 : 11, dog2 ? 15 : 12, a);
            if (dog2) {
              c.beginPath();
              c.moveTo(x - 2, y - 19);
              c.lineTo(x, y - 24);
              c.lineTo(x + 2, y - 19);
              c.stroke();
            }
          }
        });
      }
      for (let trail = 0; trail < 2; trail++) {
        const map = pawTexture(trail === 1);
        for (let i = 0; i < 12; i++) {
          const size = trail === 0 ? 0.18 : 0.23;
          const material = new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
          const paw = new THREE.Mesh(new THREE.PlaneGeometry(size, size), material);
          paw.rotation.x = -Math.PI / 2;
          paw.rotation.z = trail === 0 ? 0 : Math.PI;
          paw.position.set((trail === 0 ? 2.65 : 3.2) + (i % 2 === 0 ? -0.06 : 0.06), 0.278 + trail * 1e-3, trail === 0 ? 5.46 - i * 0.235 : 2.87 + i * 0.235);
          paw.name = trail === 0 ? "cat-crossing-paw" : "dog-crossing-paw";
          paw.userData.delay = 0.2 + i * 0.29 + trail * 0.55;
          paw.visible = false;
          world.add(paw);
          pawPrints.push(paw);
        }
      }
      function animatePawPrints(elapsed, dt) {
        for (const paw of pawPrints) {
          const age = elapsed - paw.userData.delay;
          const alpha = !isDusk && walkGreen && age >= 0 ? Math.min(1, age / 0.18) * Math.max(0, 1 - Math.max(0, age - 1.55) / 2) * 0.82 : 0;
          paw.material.opacity = THREE.MathUtils.damp(paw.material.opacity, alpha, 12, dt);
          paw.visible = paw.material.opacity > 8e-3;
        }
      }
      let signalPhase = "walk", walkGreen = true, signalSince = performance.now() / 1e3, signalManualClicks = 0, queueAligned = true, queueFadeStart = -100;
      function enterSignalPhase(phase, t) {
        signalPhase = phase;
        walkGreen = phase === "walk";
        signalSince = t;
        if (walkGreen) queueAligned = false;
      }
      function setWalkSignal(green, t, manual = false) {
        if (isDusk) return;
        if (manual) signalManualClicks++;
        if (signalPhase === "amber") return;
        enterSignalPhase(green ? "amber" : "drive", t);
      }
      function animateTrafficAndSignal(t, dt) {
        if (isDusk) {
          animateDuskTraffic(t, dt);
          return;
        }
        if (signalPhase === "amber") {
          if (t - signalSince >= 3) enterSignalPhase("walk", t);
        } else if (t - signalSince >= (walkGreen ? 8 : 10)) setWalkSignal(!walkGreen, t);
        const elapsed = t - signalSince;
        animatePawPrints(elapsed, dt);
        if (walkGreen && !queueAligned && elapsed >= 0.22) {
          queueAligned = true;
          queueFadeStart = t;
          trafficMaterials.forEach((m) => m.uniforms.head.value = m.uniforms.speed.value > 0 ? (1.8 + 5.8) / 11.6 : (4.2 + 5.8) / 11.6);
        }
        for (const m of trafficMaterials) {
          const u = m.uniforms;
          u.time.value = t;
          if (walkGreen) {
            if (queueAligned) {
              u.alpha.value = THREE.MathUtils.clamp((t - queueFadeStart) / 0.28, 0, 1);
            } else {
              u.head.value = THREE.MathUtils.euclideanModulo(u.head.value + u.speed.value * dt * 0.3, 1);
              u.alpha.value = Math.max(0, 1 - elapsed / 0.22);
            }
            u.motion.value = THREE.MathUtils.damp(u.motion.value, 0, 12, dt);
          } else {
            u.head.value = THREE.MathUtils.euclideanModulo(u.head.value + u.speed.value * dt, 1);
            u.alpha.value = THREE.MathUtils.damp(u.alpha.value, 1, 12, dt);
            u.motion.value = THREE.MathUtils.damp(u.motion.value, 1, 8, dt);
          }
        }
        const blink = walkGreen && elapsed > 6 && Math.sin(t * 9) < 0;
        for (const pair of pedestrianFaces) {
          pair[0].material.color.setHex(8314816).multiplyScalar(walkGreen ? blink ? 0.22 : 1 : 0.09);
          pair[1].material.color.setHex(15961486).multiplyScalar(walkGreen ? 0.09 : signalPhase === "amber" && Math.sin(elapsed * Math.PI * 4) < 0 ? 0.22 : 1);
        }
        for (const lamps of vehicleFaces) {
          lamps[0].material.color.setHex(15961486).multiplyScalar(signalPhase === "walk" ? 1 : 0.09);
          lamps[1].material.color.setHex(15779961).multiplyScalar(signalPhase === "amber" ? 1 : 0.07);
          lamps[2].material.color.setHex(8314816).multiplyScalar(signalPhase === "drive" ? 1 : 0.09);
        }
      }
      cyl(3.3, 1.434, 1.88, 0.046, 1.82, 10533047);
      const rs = plaque(3.3, 2.204, 1.91, 0.75, 0.26, "\u661F\u6708\u901A\u308A", "#4b8895", "#e7eed5", 85);
      box(3.3, 2.204, 1.9, 0.8, 0.3, 0.036, 4154490);
      rs.position.z = 1.925;
      cyl(-4.87, 2.02, 2.19, 0.065, 3.46, 3953251);
      rod([-4.87, 3.72, 2.19], [-4.2, 3.86, 2.19], 0.054, 5730431);
      box(-4.2, 3.81, 2.19, 0.44, 0.14, 0.3, 3953251);
      box(-4.2, 3.735, 2.19, 0.36, 0.02, 0.24, 16771255, false, 1.6);
      const hemisphere = new THREE.HemisphereLight(15258806, 3748936, 1.12);
      scene.add(hemisphere);
      const shopLights = [];
      const moon = new THREE.DirectionalLight(11910868, 1.12);
      moon.position.set(-3, 10, 5);
      moon.castShadow = true;
      moon.shadow.mapSize.set(2048, 2048);
      moon.shadow.camera.left = -9;
      moon.shadow.camera.right = 9;
      moon.shadow.camera.top = 9;
      moon.shadow.camera.bottom = -9;
      moon.shadow.normalBias = 0.035;
      scene.add(moon);
      for (let [x, y, z, col, pow, dist] of [[-1, 2.35, -1.2, 16758614, 13, 8], [-1, 2.7, 1.4, 16759656, 8, 7], [-4.2, 3.55, 2.19, 16761214, 8, 7], [-5, 1.8, 1.6, 16766370, 3, 4]]) {
        const light = new THREE.PointLight(col, pow, dist, 2);
        light.position.set(x, y, z);
        light.userData.nightPower = pow;
        shopLights.push(light);
        scene.add(light);
      }
      const wetGlows = [], puddles = [];
      function glow(x, z, w, d, color) {
        const t = texture(256, 256, (c, W, H) => {
          let g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
          g.addColorStop(0, color);
          g.addColorStop(0.3, color);
          g.addColorStop(1, "transparent");
          c.fillStyle = g;
          c.fillRect(0, 0, W, H);
        });
        let o = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0.33, depthWrite: false, blending: THREE.AdditiveBlending }));
        o.rotation.x = -Math.PI / 2;
        o.position.set(x, 0.302, z);
        world.add(o);
        wetGlows.push(o);
        return o;
      }
      glow(-1, 3.6, 6.7, 3.6, "#eec18b");
      glow(-4.65, 2.45, 2, 3.5, "#e6b77c");
      glow(2.9, 3.1, 2.4, 3.4, "#bda6aa");
      let seed = 66;
      function rnd() {
        seed = seed * 1664525 + 1013904223 >>> 0;
        return seed / 4294967296;
      }
      for (let i = 0; i < 95; i++) {
        let x = -5.7 + rnd() * 11.4, z = 2.85 + rnd() * 2.8;
        const geo = new THREE.CircleGeometry(0.12 + rnd() * 0.48, 24);
        geo.rotateX(-Math.PI / 2);
        const o = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: i % 3 ? 9155780 : 15714197, transparent: true, opacity: 0.04 + rnd() * 0.1, depthWrite: false }));
        o.position.set(x, 0.29, z);
        o.scale.z = 0.15 + rnd() * 0.23;
        world.add(o);
        puddles.push(o);
      }
      const trafficMaterials = [];
      function lightTrail(x, z, length, width, turn, color, phase, speed) {
        const material = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, uniforms: { head: { value: speed > 0 ? (1.8 + 5.8) / 11.6 : (4.2 + 5.8) / 11.6 }, motion: { value: 0 }, alpha: { value: 1 }, time: { value: 0 }, tint: { value: new THREE.Color(color) }, phase: { value: phase }, speed: { value: speed } }, vertexShader: "varying vec2 uv0;void main(){uv0=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}", fragmentShader: "varying vec2 uv0;uniform float time,phase,speed,head,motion,alpha;uniform vec3 tint;void main(){float d= speed>0.?fract(head-uv0.x+1.):fract(uv0.x-head+1.);float tail=exp(-d*17.)*(1.-smoothstep(.22,.38,d));float y=abs(uv0.y-.5);float halo=exp(-y*y*14.)*.21+exp(-y*y*180.)*.34;float edge=smoothstep(0.,.07,uv0.x)*(1.-smoothstep(.93,1.,uv0.x));float headDist=min(abs(head-uv0.x),1.-abs(head-uv0.x));float headGlow=exp(-pow(headDist/.036,2.)-y*y*22.)*.42;gl_FragColor=vec4(tint*1.6,(tail*halo*.15+headGlow)*edge*alpha);}" });
        let mesh = new THREE.Mesh(new THREE.PlaneGeometry(length, width), material);
        mesh.name = "traffic-light-reflection";
        mesh.rotation.x = -Math.PI / 2;
        mesh.rotation.z = turn;
        mesh.position.set(x, 0.325, z);
        world.add(mesh);
        trafficMaterials.push(material);
      }
      for (let pair = 0; pair < 2; pair++) {
        lightTrail(0, 3.72 + (pair - 0.5) * 0.44, 11.6, 1.24, 0, 16768934, 0.16, 0.105);
        lightTrail(0, 5 + (pair - 0.5) * 0.4, 11.6, 1.14, 0, 16747375, 0.7, -0.085);
      }
      const count = 520, rainPos = new Float32Array(count * 6), drops = [];
      for (let i = 0; i < count; i++) drops.push({ x: rnd() * 11.6 - 5.8, y: rnd() * 7 + 0.3, z: rnd() * 11.6 - 5.8, s: 1.7 + rnd() * 1.4 });
      const rainGeo = new THREE.BufferGeometry();
      rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
      const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: 11258844, transparent: true, opacity: 0.22, depthWrite: false }));
      rain.name = "gentle-rain";
      world.add(rain);
      const drips = [];
      for (let i = 0; i < 8; i++) {
        let o = line([[0, 0, 0], [0, -0.13, 0]], 12968926);
        o.material.opacity = 0.47;
        drips.push({ o, x: -4.8 + rnd() * 7.4, y: rnd() * 2.5 });
      }
      const rings = [];
      for (let i = 0; i < 14; i++) {
        const o = new THREE.Mesh(new THREE.RingGeometry(0.96, 1, 32), new THREE.MeshBasicMaterial({ color: i % 3 ? 10275286 : 15455403, transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false }));
        o.rotation.x = -Math.PI / 2;
        let x = rnd() * 11 - 5.5, z = rnd() * 11 - 5.5;
        let y = x < 3.58 && z < 2.6 ? 0.535 : 0.32;
        o.position.set(x, y, z);
        world.add(o);
        rings.push({ o, phase: rnd(), speed: 0.18 + rnd() * 0.2 });
      }
      const trails = [];
      for (let i = 0; i < 22; i++) {
        let o = line([[0, 0, 0], [5e-3, -0.1, 0], [5e-3, -0.18, 0]], 11589070);
        o.material.opacity = 0.2;
        let x = -4.4 + rnd() * 6.6;
        if (x > -2.15 && x < -0.29) x = -3.2;
        trails.push({ o, x, y: rnd() * 2.1 });
      }
      const exhaustPartsStart = world.children.length;
      box(-2.85, 4.13, -2.62, 1.24, 0.53, 0.83, 9545386);
      box(-2.85, 4.42, -2.62, 1.34, 0.055, 0.92, 5402492);
      for (let j = 0; j < 9; j++) box(-3.34 + j * 0.12, 4.13, -2.193, 0.036, 0.37, 0.012, 3954791, false);
      for (let xx of [-3.14, -2.56]) {
        let vent = new THREE.Mesh(new THREE.CircleGeometry(0.21, 24), mat(3231329));
        vent.rotation.x = -Math.PI / 2;
        vent.position.set(xx, 4.454, -2.62);
        world.add(vent);
        for (let k = 0; k < 5; k++) box(xx, 4.46, -2.79 + k * 0.085, 0.39, 0.012, 0.016, 9151657, false);
      }
      const roofExhaust = new THREE.Group();
      roofExhaust.name = "interactive-rooftop-exhaust";
      world.add(roofExhaust);
      world.children.slice(exhaustPartsStart).filter((o) => o !== roofExhaust).forEach((o) => roofExhaust.add(o));
      rod([-2.23, 3.96, -2.62], [-0.35, 3.96, -2.62], 0.035, 10991283);
      const roofDrain = new THREE.Group();
      roofDrain.name = "continuous-roof-unit-condensate-drain";
      world.add(roofDrain);
      const drainPath = [[-0.35, 3.96, -2.62], [-0.35, 3.96, -4.17], [-0.35, 3.45, -4.17], [-0.35, 3.28, -3.98], [-0.35, 0.61, -3.98], [-0.35, 0.56, -4.1]];
      for (let i = 1; i < drainPath.length; i++) rod(drainPath[i - 1], drainPath[i], 0.035, 10991283, roofDrain);
      for (const p of drainPath.slice(1, -1)) {
        const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.036, 10, 8), mat(10991283));
        elbow.position.set(...p);
        roofDrain.add(elbow);
      }
      for (const y of [0.95, 2.02, 3]) {
        rod([-0.35, y, -3.88], [-0.35, y, -3.98], 0.018, 6388859, roofDrain);
        box(-0.35, y, -4.02, 0.105, 0.055, 0.023, 7441803, true, 0, roofDrain);
      }
      box(-0.35, 0.537, -4.1, 0.2, 0.025, 0.19, 5006952, true, 0, roofDrain);
      for (let i = 0; i < 4; i++) box(-0.415 + i * 0.043, 0.554, -4.1, 0.018, 9e-3, 0.15, 10136224, false, 0, roofDrain);
      rod([-4.79, 3.6, 0.78], [2.49, 3.6, 0.78], 0.056, 7442328);
      box(-4.71, 2.7, -0.32, 0.13, 0.82, 0.79, 5140858);
      let sideSign = plaque(-4.785, 2.71, -0.32, 0.71, 0.65, "24 H", "#e8e2bf", "#388d80", 95);
      sideSign.rotation.y = -Math.PI / 2;
      let staffTarget = 0, staffAmount = 0, bikeLightOn = false, coffeeUntil = 0, coffeeFull = false, coffeeStarted = -100, coffeeFill = 0, bunLidTarget = 0, bunLidAmount = 0, chimeImpulse = -100;
      const serviceSpill = glow(1.51, -4.75, 1.35, 1.7, "#ffc67f");
      serviceSpill.position.y = 0.54;
      serviceSpill.material.opacity = 0;
      const serviceLight = new THREE.SpotLight(16760953, 0, 3.4, 0.67, 0.85, 1.6);
      serviceLight.position.set(1.51, 2.1, -3.65);
      scene.add(serviceLight);
      const serviceAim = new THREE.Object3D();
      serviceAim.position.set(1.51, 0.53, -4.9);
      scene.add(serviceAim);
      serviceLight.target = serviceAim;
      let drinkState = "empty", drinkStart = 0, selectedCan = 0;
      const interactionTargets = [], interactionRipples = [];
      for (const group of [wallVentExterior, wallVentInterior]) group.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "wallVent";
          interactionTargets.push(o);
        }
      });
      rearBins.forEach((bin) => bin.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "recyclingBin";
          o.userData.bin = bin;
          interactionTargets.push(o);
        }
      }));
      for (const leaf of refrigeratorLeaves) leaf.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "fridge";
          o.userData.fridgeLeaf = leaf;
          interactionTargets.push(o);
        }
      });
      const pickMaterial = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
      function hitBox(action, x, y, z, w, h, d, parent = world) {
        const hit = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), pickMaterial);
        hit.position.set(x, y, z);
        hit.userData.action = action;
        parent.add(hit);
        interactionTargets.push(hit);
        return hit;
      }
      hitBox("staff", 1.51, 1.77, -3.8, 1.08, 2.16, 0.3);
      staffHinge.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "staff";
          interactionTargets.push(o);
        }
      });
      const vendHit = hitBox("vend", -5.03, 1.69, 1.23, 0.68, 1.06, 0.16);
      const takeHit = hitBox("take", -5.03, 0.85, 1.24, 0.53, 0.29, 0.18);
      const coffeeHit = hitBox("coffee", 1.54, 1.82, -0.7, 0.63, 0.78, 0.69);
      hitBox("bao", 1.96, 1.725, -2.33, 0.37, 0.23, 0.39);
      bunLid.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "bao";
          interactionTargets.push(o);
        }
      });
      const bikeHit = hitBox("bike", 0, 0.81, 0, 2.15, 1.6, 0.62, bike);
      const drink = cyl(-5.03, 0.84, 1.218, 0.057, 0.2, 15187320, 12);
      drink.rotation.z = Math.PI / 2;
      drink.visible = false;
      drink.material = drink.material.clone();
      const drinkBand = box(0, 0, 0, 0.09, 0.052, 0.119, 16774619, false, 0, drink);
      drink.traverse((o) => {
        if (o.material) {
          o.material = o.material.clone();
          o.material.transparent = true;
          o.material.opacity = 0;
          o.material.depthWrite = false;
        }
      });
      function drinkOpacity(value) {
        drink.traverse((o) => {
          if (o.material) o.material.opacity = value;
        });
      }
      box(-5.03, 0.736, 1.232, 0.54, 0.025, 0.18, 5797248);
      box(-5.03, 0.952, 1.232, 0.54, 0.023, 0.18, 5797248);
      for (let x of [-5.3, -4.76]) box(x, 0.844, 1.232, 0.025, 0.19, 0.18, 5797248);
      const selectionLights = [];
      for (let i = 0; i < 4; i++) {
        let o = box(-5.23 + i * 0.135, 1.235, 1.258, 0.079, 0.026, 0.019, 16767102, false, 0.6);
        o.material = o.material.clone();
        selectionLights.push(o);
      }
      const vaporTexture = texture(64, 64, (c, W, H) => {
        let g = c.createRadialGradient(W / 2, H / 2, 1, W / 2, H / 2, W / 2);
        g.addColorStop(0, "rgba(255,240,211,.55)");
        g.addColorStop(0.4, "rgba(255,240,211,.26)");
        g.addColorStop(1, "rgba(255,240,211,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      const steam = [];
      for (let i = 0; i < 16; i++) {
        let o = new THREE.Sprite(new THREE.SpriteMaterial({ map: vaporTexture, transparent: true, opacity: 0, depthWrite: false }));
        o.position.set(1.54, 1.7, -0.57);
        world.add(o);
        steam.push(o);
      }
      const odenSteam = [];
      for (let i = 0; i < 7; i++) {
        const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: vaporTexture, transparent: true, opacity: 0.08, depthWrite: false }));
        world.add(p);
        odenSteam.push(p);
      }
      const coffeeSurface = new THREE.Mesh(new THREE.CircleGeometry(0.043, 16), mat(16774360));
      coffeeSurface.rotation.x = -Math.PI / 2;
      coffeeSurface.position.set(1.54, 1.589, -0.57);
      coffeeSurface.visible = false;
      world.add(coffeeSurface);
      const coffeeStream = cyl(1.54, 1.727, -0.57, 6e-3, 0.144, 16774360, 8);
      coffeeStream.visible = false;
      const bunSteam = [];
      for (let i = 0; i < 3; i++) {
        const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: vaporTexture, transparent: true, opacity: 0, depthWrite: false }));
        world.add(p);
        bunSteam.push(p);
      }
      const lamp = cyl(0.76, 1.14, 0, 0.055, 0.13, 4675938, 12, bike);
      lamp.rotation.z = Math.PI / 2;
      const lampLens = new THREE.Mesh(new THREE.CircleGeometry(0.046, 16), new THREE.MeshBasicMaterial({ color: 11184524 }));
      lampLens.rotation.y = Math.PI / 2;
      lampLens.position.set(0.831, 1.14, 0);
      bike.add(lampLens);
      const bikeSpot = new THREE.SpotLight(16766618, 0, 4, 0.44, 0.9, 1.6);
      bikeSpot.position.set(0.84, 1.14, 0);
      bike.add(bikeSpot);
      const bikeAim = new THREE.Object3D();
      bikeAim.position.set(3.4, -0.02, 0);
      bike.add(bikeAim);
      bikeSpot.target = bikeAim;
      const bikeReflection = glow(0.7, -4.4, 1.9, 0.6, "#ffd7a0");
      bikeReflection.position.y = 0.54;
      bikeReflection.visible = false;
      const chime = new THREE.Group();
      chime.position.set(-3.78, 2.88, 1.69);
      world.add(chime);
      rod([0, 0, 0], [0, -0.19, 0], 8e-3, 13026469, chime);
      const bell = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshToonMaterial({ color: 10275259, gradientMap: gradient, transparent: true, opacity: 0.8, side: THREE.DoubleSide }));
      bell.position.y = -0.32;
      chime.add(bell);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.01, 6, 28), mat(13744257));
      rim.rotation.x = Math.PI / 2;
      rim.position.y = -0.32;
      chime.add(rim);
      rod([0, -0.22, 0], [0, -0.55, 0], 5e-3, 13946028, chime);
      box(0, -0.645, 0, 0.084, 0.205, 0.012, 15783341, true, 0, chime);
      const chimeSun = new THREE.Group();
      chimeSun.name = "wind-chime-sun";
      chime.add(chimeSun);
      for (const side of [1, -1]) {
        const sun = new THREE.Mesh(new THREE.CircleGeometry(0.023, 24), new THREE.MeshBasicMaterial({ color: 12029524 }));
        sun.position.set(0, -0.68, side * 9e-3);
        if (side < 0) sun.rotation.y = Math.PI;
        chimeSun.add(sun);
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4;
          line([[Math.cos(a) * 0.031, -0.68 + Math.sin(a) * 0.031, side * 0.01], [Math.cos(a) * 0.044, -0.68 + Math.sin(a) * 0.044, side * 0.01]], 12029524, 1, chimeSun);
        }
      }
      chimeSun.scale.setScalar(0.63);
      chimeSun.position.y = -0.645 + 0.68 * 0.63;
      const chimeRain = new THREE.Group();
      chimeRain.name = "wind-chime-raindrop";
      chime.add(chimeRain);
      {
        const shape = new THREE.Shape();
        shape.moveTo(0, 0.032);
        shape.bezierCurveTo(-8e-3, 0.013, -0.025, -2e-3, -0.023, -0.017);
        shape.bezierCurveTo(-0.02, -0.042, 0.02, -0.042, 0.023, -0.017);
        shape.bezierCurveTo(0.025, -2e-3, 8e-3, 0.013, 0, 0.032);
        for (const side of [1, -1]) {
          const drop = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: 7051422 }));
          drop.position.set(0, -0.64, side * 8e-3);
          if (side < 0) drop.rotation.y = Math.PI;
          chimeRain.add(drop);
        }
      }
      hitBox("chime", 0, -0.4, 0, 0.5, 0.88, 0.44, chime);
      let rainBedGain = null, rainSwellGain = null, nextBird = 0, cityBedGain = null, carAudioGain = null, musicGain = null, nextMusicNote = 0, musicStep = 0, musicNoteCount = 0, carPassCount = 0, lastTrafficAudioOpen = null, lastTrafficAudioSunny = null;
      const activePasses = /* @__PURE__ */ new Set();
      let audioContext = null, audioMaster = null, audioAnalyser = null, audioMuted = false, nextCar = 0, nextRainTap = 0, rainTapCount = 0;
      let soundEvents = 0;
      const soundCounts = {};
      let ambientNoise = null;
      function audioNoise(ctx) {
        const n = ctx.sampleRate * 16, buffer = ctx.createBuffer(2, n, ctx.sampleRate);
        let seed2 = 7199;
        for (let ch = 0; ch < 2; ch++) {
          let data = buffer.getChannelData(ch);
          for (let i = 0; i < n; i++) {
            seed2 ^= seed2 << 13;
            seed2 ^= seed2 >>> 17;
            seed2 ^= seed2 << 5;
            data[i] = ((seed2 >>> 0) / 4294967296 * 2 - 1) * (0.86 + 0.14 * Math.sin(i / ctx.sampleRate * 2.1 + ch));
          }
        }
        return buffer;
      }
      function ensureAudio() {
        try {
          if (!audioContext) {
            const Ctx = window.AudioContext || window.webkitAudioContext;
            if (!Ctx) return;
            audioContext = new Ctx();
            audioMaster = audioContext.createGain();
            audioMaster.gain.value = 1e-4;
            const limiter = audioContext.createDynamicsCompressor();
            limiter.threshold.value = -13;
            limiter.knee.value = 15;
            limiter.ratio.value = 5;
            limiter.attack.value = 0.015;
            limiter.release.value = 0.3;
            audioAnalyser = audioContext.createAnalyser();
            audioAnalyser.fftSize = 2048;
            audioMaster.connect(limiter);
            limiter.connect(audioAnalyser);
            audioAnalyser.connect(audioContext.destination);
            ambientNoise = audioNoise(audioContext);
            const rain2 = audioContext.createBufferSource();
            rain2.buffer = ambientNoise;
            rain2.loop = true;
            const high = audioContext.createBiquadFilter();
            high.type = "highpass";
            high.frequency.value = 1e3;
            const low = audioContext.createBiquadFilter();
            low.type = "lowpass";
            low.frequency.value = 3800;
            const rainGain = audioContext.createGain();
            rainBedGain = rainGain;
            rainGain.gain.value = isSunny ? 1e-4 : 0.018;
            rain2.connect(high);
            high.connect(low);
            low.connect(rainGain);
            rainGain.connect(audioMaster);
            rain2.start();
            const city = audioContext.createBufferSource();
            city.buffer = ambientNoise;
            city.loop = true;
            city.playbackRate.value = 0.71;
            const cityFilter = audioContext.createBiquadFilter();
            cityFilter.type = "lowpass";
            cityFilter.frequency.value = 390;
            const cityGain = audioContext.createGain();
            cityBedGain = cityGain;
            cityGain.gain.value = signalPhase === "walk" ? 1e-4 : isSunny ? 4e-3 : 0.07;
            city.connect(cityFilter);
            cityFilter.connect(cityGain);
            cityGain.connect(audioMaster);
            city.start();
            const swell = audioContext.createOscillator();
            swell.frequency.value = 0.073;
            const swellGain = audioContext.createGain();
            rainSwellGain = swellGain;
            swellGain.gain.value = isSunny ? 0 : 3e-3;
            swell.connect(swellGain);
            swellGain.connect(rainGain.gain);
            swell.start();
            carAudioGain = audioContext.createGain();
            carAudioGain.gain.value = signalPhase === "walk" ? 0 : 1;
            carAudioGain.connect(audioMaster);
            initDayMusic();
            audioMaster.gain.exponentialRampToValueAtTime(0.7, audioContext.currentTime + 0.15);
            nextCar = audioContext.currentTime + 0.6;
            nextRainTap = audioContext.currentTime + 0.3;
          }
          if (audioContext.state === "suspended" && !document.hidden && window.streetCurrentScene === "summer") audioContext.resume().catch(() => {
          });
        } catch (_) {
        }
      }
      function tone(freq, start, duration, volume = 0.08, kind = "sine") {
        if (!audioContext) return;
        const o = audioContext.createOscillator(), g = audioContext.createGain();
        o.type = kind;
        o.frequency.value = freq;
        g.gain.setValueAtTime(1e-4, start);
        g.gain.exponentialRampToValueAtTime(volume, start + 0.012);
        g.gain.exponentialRampToValueAtTime(1e-4, start + duration);
        o.connect(g);
        g.connect(audioMaster);
        o.start(start);
        o.stop(start + duration + 0.03);
        o.onended = () => {
          o.disconnect();
          g.disconnect();
        };
      }
      function noiseTick(start, duration, volume, frequency) {
        if (!audioContext) return;
        const n = audioContext.createBufferSource(), filter = audioContext.createBiquadFilter(), g = audioContext.createGain();
        n.buffer = ambientNoise;
        filter.type = "bandpass";
        filter.frequency.value = frequency;
        filter.Q.value = 0.8;
        g.gain.setValueAtTime(1e-4, start);
        g.gain.exponentialRampToValueAtTime(volume, start + 8e-3);
        g.gain.exponentialRampToValueAtTime(1e-4, start + duration);
        n.connect(filter);
        filter.connect(g);
        g.connect(audioMaster);
        n.start(start, 3, duration + 0.03);
        n.onended = () => {
          n.disconnect();
          filter.disconnect();
          g.disconnect();
        };
      }
      function meow(start) {
        const ctx = audioContext, voice = ctx.createOscillator(), gain = ctx.createGain(), vibrato = ctx.createOscillator(), depth = ctx.createGain();
        const real = new Float32Array(10), imag = new Float32Array([0, 1, 0.48, 0.26, 0.14, 0.075, 0.04, 0.02, 0.01, 5e-3]);
        voice.setPeriodicWave(ctx.createPeriodicWave(real, imag));
        voice.frequency.setValueAtTime(460, start);
        voice.frequency.exponentialRampToValueAtTime(720, start + 0.11);
        voice.frequency.exponentialRampToValueAtTime(650, start + 0.3);
        voice.frequency.exponentialRampToValueAtTime(430, start + 0.58);
        voice.frequency.exponentialRampToValueAtTime(350, start + 0.76);
        vibrato.frequency.value = 7.1;
        depth.gain.value = 8;
        vibrato.connect(depth);
        depth.connect(voice.frequency);
        gain.gain.setValueAtTime(1e-4, start);
        gain.gain.exponentialRampToValueAtTime(0.13, start + 0.055);
        gain.gain.exponentialRampToValueAtTime(0.105, start + 0.33);
        gain.gain.exponentialRampToValueAtTime(1e-4, start + 0.79);
        gain.connect(audioMaster);
        const filters = [];
        for (let [freq, end, level, q] of [[800, 510, 0.7, 1.7], [1550, 960, 0.33, 2.8], [2700, 1750, 0.1, 3]]) {
          let f = ctx.createBiquadFilter(), g = ctx.createGain();
          f.type = "bandpass";
          f.Q.value = q;
          f.frequency.setValueAtTime(freq, start);
          f.frequency.exponentialRampToValueAtTime(end, start + 0.7);
          g.gain.value = level;
          voice.connect(f);
          f.connect(g);
          g.connect(gain);
          filters.push(f, g);
        }
        voice.start(start);
        vibrato.start(start);
        voice.stop(start + 0.82);
        vibrato.stop(start + 0.82);
        voice.onended = () => {
          voice.disconnect();
          vibrato.disconnect();
          depth.disconnect();
          filters.forEach((n) => n.disconnect());
          gain.disconnect();
        };
      }
      function dogWhimper(start) {
        const ctx = audioContext;
        for (const [offset, length, base, peak, level] of [[0, 0.43, 335, 495, 0.095], [0.51, 0.57, 310, 440, 0.075]]) {
          const at = start + offset, voice = ctx.createOscillator(), vibrato = ctx.createOscillator(), depth = ctx.createGain(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
          voice.setPeriodicWave(ctx.createPeriodicWave(new Float32Array(6), new Float32Array([0, 1, 0.3, 0.14, 0.055, 0.018])));
          voice.frequency.setValueAtTime(base, at);
          voice.frequency.exponentialRampToValueAtTime(peak, at + length * 0.32);
          voice.frequency.exponentialRampToValueAtTime(base * 0.82, at + length);
          vibrato.frequency.value = 8.5;
          depth.gain.value = 6;
          vibrato.connect(depth);
          depth.connect(voice.frequency);
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(1450, at);
          filter.frequency.exponentialRampToValueAtTime(820, at + length);
          filter.Q.value = 0.85;
          gain.gain.setValueAtTime(1e-4, at);
          gain.gain.exponentialRampToValueAtTime(level, at + 0.055);
          gain.gain.exponentialRampToValueAtTime(level * 0.65, at + length * 0.55);
          gain.gain.exponentialRampToValueAtTime(1e-4, at + length);
          voice.connect(filter);
          filter.connect(gain);
          gain.connect(audioMaster);
          voice.start(at);
          vibrato.start(at);
          voice.stop(at + length + 0.025);
          vibrato.stop(at + length + 0.025);
          voice.onended = () => {
            voice.disconnect();
            vibrato.disconnect();
            depth.disconnect();
            filter.disconnect();
            gain.disconnect();
          };
        }
      }
      function bodyImpact(start, duration, volume) {
        if (!audioContext) return;
        const o = audioContext.createOscillator(), g = audioContext.createGain();
        o.frequency.setValueAtTime(118, start);
        o.frequency.exponentialRampToValueAtTime(49, start + duration);
        g.gain.setValueAtTime(1e-4, start);
        g.gain.exponentialRampToValueAtTime(volume, start + 9e-3);
        g.gain.exponentialRampToValueAtTime(1e-4, start + duration);
        o.connect(g);
        g.connect(audioMaster);
        o.start(start);
        o.stop(start + duration + 0.025);
        o.onended = () => {
          o.disconnect();
          g.disconnect();
        };
      }
      function carHorn(t) {
        const ctx = audioContext, env = ctx.createGain(), filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1250;
        filter.Q.value = 0.45;
        env.gain.setValueAtTime(1e-4, t);
        env.gain.linearRampToValueAtTime(0.105, t + 0.018);
        env.gain.setValueAtTime(0.095, t + 0.22);
        env.gain.exponentialRampToValueAtTime(1e-4, t + 0.34);
        env.connect(filter);
        filter.connect(audioMaster);
        const wave = ctx.createPeriodicWave(new Float32Array(5), new Float32Array([0, 1, 0.27, 0.08, 0.025]));
        let remaining = 2;
        for (const f of [400, 500]) {
          const o = ctx.createOscillator();
          o.setPeriodicWave(wave);
          o.frequency.value = f;
          o.connect(env);
          o.start(t);
          o.stop(t + 0.36);
          o.onended = () => {
            o.disconnect();
            if (--remaining === 0) {
              env.disconnect();
              filter.disconnect();
            }
          };
        }
      }
      function playSound(kind, opening) {
        if (!audioContext) return;
        soundEvents++;
        soundCounts[kind] = (soundCounts[kind] || 0) + 1;
        const t = audioContext.currentTime + 0.012;
        if (kind === "horn") carHorn(t);
        else if (kind === "meow") meow(t);
        else if (kind === "dog") dogWhimper(t);
        else if (kind === "pigeon") playPigeonSound(t);
        else if (kind === "wallVent") {
          noiseTick(t, 0.055, 0.065, 2100);
          noiseTick(t + 0.035, 0.38, 0.045, opening ? 900 : 720);
          noiseTick(t + 0.32, 0.045, 0.055, 1600);
          tone(opening ? 310 : 260, t + 0.05, 0.26, 0.012, "triangle");
        } else if (kind === "drone" && typeof playCyberDroneSound === "function") playCyberDroneSound(t);
        else if (kind === "door") {
          tone(784, t, 0.65, 0.105);
          tone(1568, t, 0.35, 0.018);
          tone(622.25, t + 0.22, 0.9, 0.09);
          tone(1244.5, t + 0.22, 0.5, 0.015);
        } else if (kind === "chime") {
          [1760, 2817, 3917, 5165].forEach((f, i) => tone(f, t + i * 0.023, 1.7 - i * 0.22, 0.065 / (1 + i * 0.8)));
          tone(2112, t + 0.32, 1.15, 0.025);
        } else if (kind === "vend") {
          tone(880, t, 0.12, 0.055);
          tone(1174.66, t + 0.12, 0.18, 0.045);
          noiseTick(t + 0.18, 0.22, 0.11, 280);
          tone(132, t + 0.2, 0.19, 0.04);
        } else if (kind === "take" || kind === "switch") noiseTick(t, 0.09, 0.055, kind === "take" ? 1200 : 2600);
        else if (kind === "coffee") noiseTick(t, 1.3, 0.07, 2200);
        else if (kind === "cookpot") {
          if (opening === "blocked") {
            noiseTick(t, 0.045, 0.085, 1400);
            tone(610, t, 0.11, 0.025);
            noiseTick(t + 0.07, 0.035, 0.06, 1100);
          } else if (opening) {
            noiseTick(t, 0.075, 0.1, 950);
            tone(720, t + 0.012, 0.24, 0.04);
            tone(1150, t + 0.016, 0.13, 0.014);
            noiseTick(t + 0.075, 0.23, 0.035, 2400);
          } else {
            noiseTick(t, 0.055, 0.13, 850);
            tone(540, t + 0.01, 0.17, 0.045);
            tone(890, t + 0.014, 0.11, 0.015);
          }
        } else if (kind === "umbrella") {
          noiseTick(t, opening ? 0.24 : 0.18, 0.105, opening ? 1700 : 1300);
          noiseTick(t + 0.07, 0.05, 0.07, 700);
          if (!opening) {
            noiseTick(t + 0.17, 0.04, 0.09, 1100);
            tone(390, t + 0.17, 0.1, 0.022);
          }
        } else if (kind === "bao") {
          noiseTick(t, 0.14, 0.095, opening ? 850 : 650);
          noiseTick(t + 0.08, 0.06, 0.065, 1200);
          if (opening) noiseTick(t + 0.11, 0.34, 0.045, 3100);
          else tone(270, t + 0.08, 0.12, 0.028);
        } else if (kind === "carDoor") {
          if (opening) {
            noiseTick(t, 0.035, 0.33, 2100);
            noiseTick(t + 0.055, 0.065, 0.27, 720);
            noiseTick(t + 0.09, 0.16, 0.18, 220);
            bodyImpact(t + 0.06, 0.15, 0.075);
          } else {
            noiseTick(t, 0.055, 0.37, 1200);
            noiseTick(t + 0.018, 0.24, 0.32, 190);
            bodyImpact(t + 0.02, 0.25, 0.17);
            noiseTick(t + 0.09, 0.035, 0.16, 1900);
          }
        } else if (kind === "postbox") {
          noiseTick(t, 0.03, 0.31, 2350);
          noiseTick(t + 0.09, 0.045, 0.27, 940);
          noiseTick(t + 0.14, 0.14, 0.19, 310);
          [431, 709, 1127, 1693].forEach((f, i) => tone(f, t + 0.09, 0.23 - i * 0.04, 0.024 / (i + 1)));
        } else if (kind === "leaves") noiseTick(t, 0.25, 0.035, 1800);
        else if (kind === "takeout") {
          tone(880, t, 0.19, 0.05);
          tone(1174.66, t + 0.13, 0.24, 0.04);
          noiseTick(t + 0.12, 0.3, 0.04, 900);
        } else if (kind === "puddle") {
          tone(340, t, 0.12, 0.027);
          noiseTick(t, 0.18, 0.035, 1300);
        }
      }
      function rainTap(start) {
        const ctx = audioContext, n = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), g = ctx.createGain(), pan = ctx.createStereoPanner();
        n.buffer = ambientNoise;
        filter.type = "bandpass";
        filter.frequency.value = 1300 + Math.random() * 1e3;
        filter.Q.value = 0.55;
        const duration = 0.065 + Math.random() * 0.06;
        g.gain.setValueAtTime(1e-4, start);
        g.gain.exponentialRampToValueAtTime(0.035 + Math.random() * 0.025, start + 4e-3);
        g.gain.exponentialRampToValueAtTime(1e-4, start + duration);
        pan.pan.value = Math.random() * 1.4 - 0.7;
        n.connect(filter);
        filter.connect(g);
        g.connect(pan);
        pan.connect(audioMaster);
        n.start(start, Math.random() * 10, duration + 0.02);
        n.onended = () => {
          n.disconnect();
          filter.disconnect();
          g.disconnect();
          pan.disconnect();
        };
        rainTapCount++;
      }
      function passCar(t) {
        if (!carAudioGain || signalPhase !== "drive" && !isDusk) return;
        carPassCount++;
        const n = audioContext.createBufferSource(), filter = audioContext.createBiquadFilter(), g = audioContext.createGain(), pan = audioContext.createStereoPanner();
        n.buffer = ambientNoise;
        n.playbackRate.value = 0.82;
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(260, t);
        filter.frequency.exponentialRampToValueAtTime(1250, t + 4.2);
        filter.frequency.exponentialRampToValueAtTime(240, t + 9.2);
        g.gain.setValueAtTime(1e-4, t);
        g.gain.exponentialRampToValueAtTime(0.095, t + 4.2);
        g.gain.exponentialRampToValueAtTime(1e-4, t + 9.2);
        const direction = Math.sin(t * 7) > 0 ? 1 : -1;
        pan.pan.setValueAtTime(-0.85 * direction, t);
        pan.pan.linearRampToValueAtTime(0.85 * direction, t + 9.2);
        n.connect(filter);
        filter.connect(g);
        g.connect(pan);
        pan.connect(carAudioGain);
        activePasses.add(n);
        n.start(t, 1, 8);
        n.onended = () => {
          activePasses.delete(n);
          n.disconnect();
          filter.disconnect();
          g.disconnect();
          pan.disconnect();
        };
      }
      document.addEventListener("visibilitychange", () => {
        if (!audioContext) return;
        if (document.hidden) audioContext.suspend().catch(() => {
        });
        else if (window.streetCurrentScene === "summer") audioContext.resume().catch(() => {
        });
      });
      addEventListener("keydown", (e) => {
        if (window.streetCurrentScene === "summer" && e.code === "KeyM" && !e.repeat && audioContext) {
          audioMuted = !audioMuted;
          audioMaster.gain.cancelScheduledValues(audioContext.currentTime);
          audioMaster.gain.setTargetAtTime(audioMuted ? 1e-4 : 0.7, audioContext.currentTime, 0.08);
        }
      });
      const cat = new THREE.Group();
      cat.position.set(-2.87, 0.526, 1.4);
      cat.rotation.y = -0.12;
      world.add(cat);
      let catReact = -100, lastMeow = -100;
      function catBall(x, y, z, sx, sy, sz, color, parent = cat) {
        const o = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), mat(color));
        o.position.set(x, y, z);
        o.scale.set(sx, sy, sz);
        o.castShadow = true;
        parent.add(o);
        return o;
      }
      catBall(0, 0.25, -0.03, 0.22, 0.255, 0.19, 14261088);
      catBall(0, 0.22, 0.098, 0.142, 0.195, 0.103, 15916988);
      const catHead = new THREE.Group();
      catHead.position.set(0, 0.54, 0.025);
      cat.add(catHead);
      catBall(0, 0, 0, 0.205, 0.183, 0.17, 14789230, catHead);
      for (let x of [-0.135, 0.135]) {
        let ear = new THREE.Mesh(new THREE.ConeGeometry(0.088, 0.17, 3), mat(13800538));
        ear.position.set(x, 0.169, -0.015);
        ear.rotation.y = x < 0 ? -0.16 : 0.16;
        catHead.add(ear);
        const shape = new THREE.Shape();
        shape.moveTo(-0.04, -0.035);
        shape.lineTo(0, 0.065);
        shape.lineTo(0.04, -0.035);
        shape.closePath();
        let pink = new THREE.Mesh(new THREE.ShapeGeometry(shape), mat(14197402));
        pink.position.set(x, 0.178, 0.032);
        catHead.add(pink);
      }
      const catEyes = [];
      for (let x of [-0.079, 0.079]) {
        catBall(x, -0.015, 0.149, 0.028, 0.037, 0.019, 3359545, catHead);
        const eye = catBall(x, -0.015, 0.165, 0.012, 0.028, 6e-3, 1386547, catHead);
        catEyes.push(eye);
        catBall(x - 6e-3, -5e-3, 0.171, 6e-3, 7e-3, 3e-3, 16774358, catHead);
      }
      for (let x of [-0.053, 0.053]) catBall(x, -0.078, 0.143, 0.071, 0.048, 0.047, 16115144, catHead);
      catBall(0, -0.057, 0.187, 0.022, 0.014, 0.014, 12746876, catHead);
      line([[0, -0.07, 0.185], [0, -0.092, 0.185], [-0.022, -0.106, 0.179]], 7757394, 1, catHead);
      line([[0, -0.092, 0.185], [0.022, -0.106, 0.179]], 7757394, 1, catHead);
      for (let side of [-1, 1]) for (let j = 0; j < 3; j++) line([[side * 0.095, -0.07 - j * 0.013, 0.169], [side * 0.255, -0.06 - j * 0.028, 0.15]], 12891036, 1, catHead);
      for (let x of [-0.055, 0, 0.055]) {
        let stripe = catBall(x, 0.11, 0.124, 0.017, 0.055, 9e-3, 12089668, catHead);
        stripe.rotation.z = x * 5;
      }
      catBall(-0.115, 0.071, 0.14, 0.075, 0.07, 0.11, 16049093);
      const catPaw = catBall(0.115, 0.071, 0.14, 0.075, 0.07, 0.11, 16049093);
      const catTail = new THREE.Group();
      catTail.position.set(-0.17, 0.14, -0.06);
      cat.add(catTail);
      const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(-0.18, -0.06, -0.13), new THREE.Vector3(-0.28, -0.075, 0.06), new THREE.Vector3(-0.2, -0.07, 0.25), new THREE.Vector3(-0.05, -0.06, 0.25)]);
      const tail = new THREE.Mesh(new THREE.TubeGeometry(curve, 24, 0.046, 8, false), mat(13142864));
      catTail.add(tail);
      const collar = new THREE.Mesh(new THREE.TorusGeometry(0.136, 0.014, 8, 24), mat(7576981));
      collar.rotation.x = Math.PI / 2;
      collar.position.set(0, 0.42, 0.027);
      cat.add(collar);
      catBall(0, 0.407, 0.169, 0.026, 0.028, 0.02, 15123324);
      hitBox("cat", 0, 0.39, 0.02, 0.73, 0.88, 0.65, cat);
      function animateSoundAndCat(t) {
        if (weatherMode === "rain" && audioContext && audioContext.state === "running" && audioContext.currentTime > nextRainTap) {
          rainTap(audioContext.currentTime + 0.01);
          nextRainTap = audioContext.currentTime + 0.65 + Math.random() * 1.25;
        }
        if (audioContext && audioContext.state === "running" && (signalPhase === "drive" || isDusk) && audioContext.currentTime > nextCar) {
          passCar(audioContext.currentTime + 0.02);
          nextCar = audioContext.currentTime + (isDusk ? 22 : 10) + Math.random() * (isDusk ? 10 : 4);
        }
        const age = t - catReact, active = age >= 0 && age < 2.7;
        const envelope = active ? Math.sin(Math.PI * age / 2.7) : 0;
        catHead.rotation.y = envelope * Math.sin(age * 3) * 0.32;
        catHead.rotation.z = -envelope * 0.11;
        catHead.rotation.x = -envelope * 0.14;
        catPaw.position.y = 0.071 + envelope * Math.max(0, Math.sin(age * 3.1)) * 0.11;
        catPaw.rotation.x = -envelope * 0.3;
        catTail.rotation.y = (active ? 0.23 : 0.025) * Math.sin(active ? age * 7 : t * 0.8);
        cat.scale.y = 1 + Math.sin(t * 2.1) * 6e-3;
        let blink = t % 6.7 > 6.48 || active && age > 0.35 && age < 0.58;
        catEyes.forEach((o) => o.scale.y = blink ? 4e-3 : 0.028);
      }
      const rippleGeometry = new THREE.RingGeometry(0.92, 1, 40);
      function splash(point, t) {
        if (interactionRipples.length >= 8) {
          const old = interactionRipples.shift();
          old.meshes.forEach((o) => {
            world.remove(o);
            o.material.dispose();
          });
        }
        const meshes = [];
        for (let i = 0; i < 4; i++) {
          let o = new THREE.Mesh(rippleGeometry, new THREE.MeshBasicMaterial({ color: 16769453, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
          o.rotation.x = -Math.PI / 2;
          o.position.set(point.x, 0.34, point.z);
          world.add(o);
          meshes.push(o);
        }
        interactionRipples.push({ meshes, start: t });
      }
      function pickScene(e) {
        const r = { left: 0, top: 0, width: window.sceneViewport.width, height: window.sceneViewport.height };
        doorRay.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera);
        const effective = (o) => {
          let p = o;
          while (p) {
            if (!p.visible) return false;
            p = p.parent;
          }
          return true;
        };
        const candidates = [...interactionTargets.filter(effective), doorHit], seen = new Set(candidates);
        scene.traverse((o) => {
          if (!o.isMesh || seen.has(o) || o.material.visible === false) return;
          let p = o;
          while (p) {
            if (!p.visible) return;
            p = p.parent;
          }
          const m = o.material;
          if (m.transparent || m.blending === THREE.AdditiveBlending) return;
          candidates.push(o);
        });
        const hits = doorRay.intersectObjects(candidates, false);
        if (!hits.length) return null;
        let hit = hits[0];
        const outsidePickup = camera.position.z < -3.8;
        if (outsidePickup && takeoutAmount < 0.8 && (hit.object === pickupHit || hit.object.material === glass || hit.object.userData.action === "cookpot")) {
          hit = __spreadProps(__spreadValues({}, hit), { object: pickupHit });
        } else if (takeoutAmount >= 0.8 && (hit.object === pickupHit || hit.object.material === glass)) {
          const potHit = hits.find((h) => h.object.userData.action === "cookpot");
          if (potHit) hit = potHit;
        }
        if (hit.object.userData.action) return hit;
        if (hit.object === street && !isSunny) {
          hit.object.userData.action = "puddle";
          return hit;
        }
        return null;
      }
      function actOnScene(e) {
        const hit = pickScene(e);
        if (!hit) return;
        const t = performance.now() / 1e3, action = hit.object.userData.action;
        vy = vp = 0;
        if (action === "fogSmile") {
          fogSmileAt = t;
        } else if (action === "wallVent") {
          wallVentOpen = !wallVentOpen;
          playSound("wallVent", wallVentOpen);
        } else if (action === "recyclingBin") {
          const bin = hit.object.userData.bin;
          bin.userData.open = !bin.userData.open;
        } else if (action === "clockMode") {
          setClockMode(!clockIs12);
          playSound("switch");
        } else if (action === "fridge") {
          const leaf = hit.object.userData.fridgeLeaf;
          leaf.userData.open = !leaf.userData.open;
          playSound("switch");
        } else if (action === "front") {
          doorTarget = doorTarget ? 0 : 1;
          if (doorTarget) playSound("door");
          else playSound("switch");
        } else if (action === "staff") {
          staffTarget = staffTarget ? 0 : 1;
          if (staffTarget) playSound("door");
          else playSound("switch");
        } else if (action === "vend" && drinkState === "empty") {
          selectedCan = THREE.MathUtils.clamp(Math.round((hit.point.x + 5.23) / 0.135), 0, 3);
          drink.material.color.setHex(vendingPalette()[selectedCan]);
          drinkStart = t;
          drinkState = "appearing";
          drinkOpacity(0);
          drink.position.set(-5.03, 0.84, 1.218);
          drink.rotation.z = Math.PI / 2;
          drink.visible = true;
          playSound("vend");
        } else if (action === "take" && drinkState === "ready") {
          drinkState = "disappearing";
          drinkStart = t;
          playSound("take");
        } else if (action === "coffee") {
          if (coffeeFull) {
            coffeeFull = false;
            coffeeUntil = 0;
            playSound("take");
          } else {
            coffeeStarted = t;
            coffeeFull = true;
            coffeeUntil = t + 5;
            playSound("coffee");
          }
        } else if (action === "bao") {
          bunLidTarget = bunLidTarget ? 0 : 1;
          playSound("bao", bunLidTarget === 1);
        } else if (action === "bike") {
          bikeLightOn = !bikeLightOn;
          bikeSpot.intensity = bikeLightOn ? 4.8 : 0;
          lampLens.material.color.setHex(bikeLightOn ? 16770218 : 11184524);
          bikeReflection.visible = bikeLightOn && !isSunny;
          playSound("switch");
        } else if (action === "chime") {
          chimeImpulse = t;
          playSound("chime");
        } else if (action === "puddle" && !isSunny) {
          splash(hit.point, t);
          playSound("puddle");
        } else if (action === "pigeon") {
          if (t - pigeonReact > 1.1) playSound("pigeon");
          pigeonReact = t;
        } else if (action === "carLights") toggleCarLights();
        else if (action === "carDoor") {
          carDoorTarget = carDoorTarget ? 0 : 1;
          playSound("carDoor", carDoorTarget === 1);
        } else if (action === "postbox") {
          letterTarget = letterTarget ? 0 : 1;
          playSound("postbox");
        } else if (action === "letter") openSceneLetter();
        else if (action === "pedestrianSignal") {
          setWalkSignal(!walkGreen, t, true);
          playSound("switch");
        } else if (action === "flower") {
          hit.object.userData.flower.userData.swayAt = t;
        } else if (action === "cookpot") {
          if ((takeoutTarget || windowPending) && takeoutVariant === "note") {
            cookJiggleAt = t;
            cookLidTarget = 0;
            playSound("cookpot", "blocked");
          } else {
            cookLidTarget = cookLidTarget ? 0 : 1;
            playSound("cookpot", cookLidTarget === 1);
          }
        } else if (action === "umbrella") {
          const u = hit.object.userData.umbrella, raise = !u.userData.raised;
          umbrellas.forEach((other) => other.userData.raised = raise && other === u);
          playSound("umbrella", raise);
        } else if (action === "pinwheel") {
          hit.object.userData.pinwheel.userData.boostAt = t;
        } else if (action === "exhaust") {
          smokeBurstAt = t;
        } else if (action === "dog") {
          if (t - dogCuriosity > 0.9) playSound("dog");
          dogCuriosity = t;
        } else if (action === "takeout") {
          requestPickup(t);
        } else if (action === "cat") {
          catReact = t;
          if (t - lastMeow > 0.9) {
            playSound("meow");
            lastMeow = t;
          }
        }
      }
      function animateInteractions(t, dt) {
        wallVentAmount = THREE.MathUtils.damp(wallVentAmount, wallVentOpen ? 1 : 0, 6, dt);
        wallVentSlats.forEach((blade) => blade.rotation.z = wallVentAmount * Math.PI * 5 / 12);
        rearBins.forEach((bin) => {
          bin.userData.amount = THREE.MathUtils.damp(bin.userData.amount, bin.userData.open ? 1 : 0, 7, dt);
          bin.userData.hinge.rotation.x = -bin.userData.amount * Math.PI / 3;
        });
        for (const leaf of refrigeratorLeaves) {
          leaf.userData.amount = THREE.MathUtils.damp(leaf.userData.amount, leaf.userData.open ? 1 : 0, 6, dt);
          leaf.rotation.y = -leaf.userData.amount * Math.PI / 6;
        }
        letterAmount = THREE.MathUtils.damp(letterAmount, letterTarget, 7, dt);
        mailEnvelope.visible = letterAmount > 0.03;
        mailEnvelope.position.z = 0.22 + letterAmount * 0.12;
        mailEnvelope.rotation.z = -letterAmount * 0.055;
        mailEnvelope.traverse((o) => {
          if (o.material && o.material !== pickMaterial) o.material.opacity = letterAmount;
        });
        if (drinkState === "appearing") {
          const p = THREE.MathUtils.clamp((t - drinkStart) / 0.4, 0, 1);
          drinkOpacity(p * p * (3 - 2 * p));
          if (p === 1) drinkState = "ready";
        } else if (drinkState === "disappearing") {
          const p = THREE.MathUtils.clamp((t - drinkStart) / 0.325, 0, 1);
          drinkOpacity(1 - p * p * (3 - 2 * p));
          if (p === 1) {
            drink.visible = false;
            drinkState = "empty";
          }
        }
        flowerPots.forEach((p) => {
          const a2 = t - p.userData.swayAt, e = a2 >= 0 && a2 < 4 ? Math.exp(-a2 * 0.9) : 0;
          p.userData.blooms.rotation.z = Math.sin(a2 * 9) * e * 0.16;
          p.userData.blooms.rotation.x = Math.sin(a2 * 7) * e * 0.08;
        });
        if (windowPending && cookLidAmount < 0.025) {
          takeoutVariant = windowPending.variant;
          windowPending = null;
          takeoutTarget = 1;
          noteShownAt = -1;
          cookLidTarget = takeoutVariant === "bento" ? 1 : 0;
        }
        takeoutAmount = THREE.MathUtils.damp(takeoutAmount, takeoutTarget, 4.5, dt);
        takeoutPanes[0].rotation.y = takeoutAmount * 1.31;
        takeoutPanes[1].rotation.y = -takeoutAmount * 1.31;
        const serve = THREE.MathUtils.smoothstep(takeoutAmount, 0.2, 1);
        bento.visible = takeoutVariant === "bento" && serve > 0.01;
        if (takeoutVariant === "note" && takeoutAmount > 0.85 && noteShownAt < 0) noteShownAt = t;
        const noteAlpha = takeoutVariant === "note" && takeoutTarget ? serve * (noteShownAt < 0 ? 1 : THREE.MathUtils.clamp(1 - (t - noteShownAt - 1) / 0.65, 0, 1)) : 0;
        preparingNote.visible = noteAlpha > 8e-3;
        preparingNote.material.opacity = noteAlpha;
        bento.position.z = -3.63 - serve * 0.57;
        bento.position.y = 1.508 + Math.sin(serve * Math.PI) * 0.025;
        bento.traverse((o) => {
          if (o.material) o.material.opacity = serve;
        });
        coffeeFill = coffeeFull ? THREE.MathUtils.clamp((t - coffeeStarted) / 1.2, 0, 1) : 0;
        coffeeSurface.visible = coffeeFill > 0.02;
        coffeeSurface.position.y = 1.589 + coffeeFill * 0.058;
        coffeeStream.visible = coffeeFull && coffeeFill < 1;
        bunLidAmount = THREE.MathUtils.damp(bunLidAmount, bunLidTarget, 6, dt);
        bunLid.rotation.x = -bunLidAmount * Math.PI * 0.44;
        bunsGroup.visible = bunLidAmount > 0.15;
        bunSteam.forEach((p, i) => {
          const age = (t * 0.4 + i / 3) % 1;
          p.position.set(1.96 + Math.sin(age * 5 + i) * 0.025, 1.73 + age * 0.4, -2.33);
          p.scale.setScalar(0.06 + age * 0.13);
          p.material.opacity = Math.sin(age * Math.PI) * 0.18 * bunLidAmount;
        });
        carDoorAmount = THREE.MathUtils.damp(carDoorAmount, carDoorTarget, 6, dt);
        driverHinge.rotation.y = -carDoorAmount * Math.PI * 34 / 180;
        odenSteam.forEach((p, i) => {
          const age = (t * 0.28 + i / odenSteam.length) % 1;
          p.position.set(1.05 + i % 3 * 0.27 + Math.sin(age * 6 + i) * 0.023, 1.73 + age * 0.34, -2.3 + Math.sin(i * 3) * 0.09);
          p.scale.setScalar(0.055 + age * 0.12);
          p.material.opacity = Math.sin(age * Math.PI) * 0.13;
        });
        staffAmount = THREE.MathUtils.damp(staffAmount, staffTarget, 6, dt);
        staffHinge.rotation.y = staffAmount * Math.PI * 95 / 180;
        serviceSpill.material.opacity = staffAmount * 0.36;
        serviceLight.intensity = staffAmount * 3.4;
        selectionLights.forEach((o, i) => {
          o.material.emissiveIntensity = drinkState !== "empty" && i === selectedCan ? 1.15 + Math.sin(t * 8) * 0.3 : 0.25;
        });
        steam.forEach((o, i) => {
          let age = (t * 0.62 + i / steam.length) % 1;
          o.position.set(1.54 + Math.sin(age * 7 + i) * 0.035, 1.68 + age * 0.65, -0.57 + Math.cos(age * 5 + i) * 0.025);
          o.scale.setScalar(0.065 + age * 0.21);
          o.material.rotation = Math.sin(t + i) * 0.3;
          o.material.opacity = coffeeFill > 0.3 && coffeeUntil > t ? Math.sin(age * Math.PI) * 0.37 * Math.min(1, coffeeUntil - t) : 0;
        });
        const a = t - chimeImpulse;
        chime.rotation.z = Math.sin(t * 1.8) * 0.018 + (a < 8 ? Math.sin(a * 9) * 0.34 * Math.exp(-a * 0.55) : 0);
        chime.rotation.x = Math.sin(t * 1.4) * 0.012;
        for (let i = interactionRipples.length - 1; i >= 0; i--) {
          const effect = interactionRipples[i], age = t - effect.start;
          effect.meshes.forEach((o, j) => {
            let p = (age - j * 0.17) / 1.5;
            o.visible = !isSunny && p > 0 && p < 1;
            if (o.visible) {
              o.scale.setScalar(0.025 + p * 0.65);
              o.material.opacity = (1 - p) * 0.43;
            }
          });
          if (age > 2.1) {
            effect.meshes.forEach((o) => {
              world.remove(o);
              o.material.dispose();
            });
            interactionRipples.splice(i, 1);
          }
        }
      }
      box(4.91, 0.71, -5.73, 2.1, 0.88, 0.16, 9016207);
      box(4.91, 1.18, -5.73, 2.14, 0.07, 0.2, 11383976);
      for (let x of [4.07, 5.75]) box(x, 0.77, -5.638, 0.11, 0.075, 0.014, 14333817, false, 0.08);
      const culdesacSign = new THREE.Group();
      culdesacSign.name = "wall-mounted-culdesac-sign";
      culdesacSign.position.set(4.91, 1.45, -5.73);
      world.add(culdesacSign);
      for (const x of [-0.42, 0.42]) rod([x, -0.27, 0], [x, -0.07, 0], 0.024, 8492431, culdesacSign);
      box(0, 0, 0, 1.32, 0.32, 0.065, 4679285, true, 0, culdesacSign);
      plaque(0, 0, 0.038, 1.2, 0.24, "\u884C\u304D\u6B62\u307E\u308A", "#476675", "#f4e4bd", 80, culdesacSign);
      const welcomeSign = plaque(0, 0, -0.038, 1.2, 0.24, "\u3088\u3046\u3053\u305D", "#476675", "#e6dfbe", 80, culdesacSign);
      welcomeSign.rotation.y = Math.PI;
      box(4.74, 0.32, -4.63, 1.1, 0.12, 0.16, 10198413);
      const parkingBay = new THREE.Group();
      parkingBay.name = "culdesac-parking-bay";
      world.add(parkingBay);
      for (let x of [3.93, 5.77]) box(x, 0.278, -2.275, 0.032, 0.014, 5.55, 9544093, false, 0, parkingBay);
      for (let z of [-5.05, 0.5]) box(4.85, 0.278, z, 1.84, 0.014, 0.032, 9544093, false, 0, parkingBay);
      const parkingMark = plaque(4.85, 0.289, 0.05, 0.54, 0.54, "P", "#304a5b", "#b4c8be", 160, parkingBay);
      parkingMark.rotation.x = -Math.PI / 2;
      const wallCredits = new THREE.Group();
      wallCredits.name = "rear-wall-credits";
      world.add(wallCredits);
      for (let [y, h, text] of [[0.88, 0.23, "wfcsilence"], [0.57, 0.19, "2026\xB710"]]) {
        const p = plaque(4.91, y, -5.818, 1.77, h, text, "rgba(0,0,0,0)", "#f0e5c9", 80, wallCredits);
        p.rotation.y = Math.PI;
        p.material.transparent = true;
        p.material.depthWrite = false;
        p.material.opacity = 0.8;
        const old = p.material.map;
        p.material.map = texture(1024, Math.round(1024 * h / 1.77), (c, W, H) => {
          c.fillStyle = "#d5cebe";
          c.textAlign = "center";
          c.textBaseline = "middle";
          let px = H * 0.76;
          c.font = (text === "wfcsilence" ? "italic 500 " : "500 ") + px + 'px Georgia, "Palatino Linotype", "Times New Roman", serif';
          const width = c.measureText(text).width;
          if (width > W * 0.86) c.font = (text === "wfcsilence" ? "italic 500 " : "500 ") + px * W * 0.86 / width + "px Georgia, serif";
          c.fillText(text, W / 2, H / 2);
        });
        old.dispose();
        p.userData.font = "Georgia serif";
      }
      const parkedCar = new THREE.Group();
      parkedCar.position.set(4.74, 0.26, -2.82);
      parkedCar.scale.set(1.23, 1.42, 1.56);
      parkedCar.name = "parked-compact-car";
      world.add(parkedCar);
      const carWindows = [];
      const paint = 12965061;
      let carLightsOn = false, carDoorTarget = 0, carDoorAmount = 0;
      box(0, 0.31, 0, 1.13, 0.13, 2.58, 5466224, true, 0, parkedCar);
      box(0, 0.515, 1.015, 1.13, 0.29, 0.55, paint, true, 0, parkedCar);
      box(0, 0.665, 1.015, 1.1, 0.06, 0.55, 13753547, true, 0, parkedCar);
      box(0, 0.49, -0.74, 1.13, 0.32, 1.1, paint, true, 0, parkedCar);
      box(-0.52, 0.51, 0.255, 0.09, 0.34, 0.91, paint, true, 0, parkedCar);
      box(0, 0.295, 0.07, 1.16, 0.11, 2.51, 5992051, true, 0, parkedCar);
      function carQuad(points, color, parent = parkedCar, basic = false) {
        let geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute([].concat.apply([], points), 3));
        geo.setIndex([0, 1, 2, 0, 2, 3]);
        geo.computeVertexNormals();
        let material = basic ? new THREE.MeshBasicMaterial({ color: 9157585, side: THREE.DoubleSide, transparent: true, opacity: 0.32, depthWrite: false }) : new THREE.MeshToonMaterial({ color, gradientMap: gradient, side: THREE.DoubleSide });
        let m = new THREE.Mesh(geo, material);
        m.castShadow = !basic;
        if (basic) {
          m.name = "transparent-car-glass";
          carWindows.push(m);
        }
        parent.add(m);
        m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), ink));
        return m;
      }
      function carFrame(outer, inner, color, parent = parkedCar) {
        for (let i = 0; i < 4; i++) {
          const j = (i + 1) % 4;
          carQuad([outer[i], outer[j], inner[j], inner[i]], color, parent);
        }
      }
      const profile = [[-1.16, 0.73], [-0.78, 1.15], [0.35, 1.15], [0.77, 0.73]];
      carFrame([[-0.505, 0.73, 0.77], [-0.505, 1.15, 0.35], [-0.505, 1.15, -0.17], [-0.505, 0.73, -0.17]], [[-0.505, 0.79, 0.61], [-0.505, 1.095, 0.29], [-0.505, 1.095, -0.12], [-0.505, 0.79, -0.12]], paint);
      for (let side of [-1, 1]) carFrame([[side * 0.505, 0.73, -1.16], [side * 0.505, 1.15, -0.78], [side * 0.505, 1.15, -0.17], [side * 0.505, 0.73, -0.17]], [[side * 0.505, 0.79, -1.02], [side * 0.505, 1.095, -0.74], [side * 0.505, 1.095, -0.18], [side * 0.505, 0.79, -0.18]], paint);
      for (let i = 1; i < 2; i++) {
        const [z1, y1] = profile[i], [z2, y2] = profile[i + 1];
        carQuad([[-0.505, y1, z1], [0.505, y1, z1], [0.505, y2, z2], [-0.505, y2, z2]], i === 1 ? 14081998 : paint);
      }
      const windshield = carQuad([[-0.447, 0.785, 0.731], [0.447, 0.785, 0.731], [0.447, 1.111, 0.405], [-0.447, 1.111, 0.405]], 5406618, parkedCar, true);
      windshield.name = "one-piece-blue-windshield";
      const rearWindshield = carQuad([[-0.435, 0.785, -1.1243], [-0.435, 1.111, -0.8293], [0.435, 1.111, -0.8293], [0.435, 0.785, -1.1243]], 4615036, parkedCar, true);
      rearWindshield.name = "one-piece-rear-windshield";
      carFrame([[-0.505, 0.73, 0.77], [0.505, 0.73, 0.77], [0.505, 1.15, 0.35], [-0.505, 1.15, 0.35]], [[-0.447, 0.785, 0.731], [0.447, 0.785, 0.731], [0.447, 1.111, 0.405], [-0.447, 1.111, 0.405]], paint);
      carFrame([[-0.505, 0.73, -1.16], [-0.505, 1.15, -0.78], [0.505, 1.15, -0.78], [0.505, 0.73, -1.16]], [[-0.435, 0.785, -1.1243], [-0.435, 1.111, -0.8293], [0.435, 1.111, -0.8293], [0.435, 0.785, -1.1243]], paint);
      carQuad([[-0.514, 0.79, 0.61], [-0.514, 1.095, 0.29], [-0.514, 1.095, -0.12], [-0.514, 0.79, -0.12]], 4615036, parkedCar, true);
      for (let side of [-1, 1]) {
        const x = side * 0.514;
        carQuad([[x, 0.79, -0.18], [x, 1.095, -0.18], [x, 1.095, -0.74], [x, 0.79, -1.02]], 4615036, parkedCar, true);
        box(x, 0.696, -0.7, 0.014, 0.013, 0.9, 7441289, false, 0, parkedCar);
      }
      for (let x of [-0.25, 0.25]) {
        box(x, 0.46, 0.02, 0.35, 0.15, 0.37, 4545637, true, 0, parkedCar);
        const back = box(x, 0.72, -0.19, 0.35, 0.47, 0.11, 4216672, true, 0, parkedCar);
        back.rotation.x = -0.1;
        box(x, 0.99, -0.2, 0.2, 0.14, 0.1, 4545637, true, 0, parkedCar);
      }
      box(0, 0.6, -0.7, 0.82, 0.15, 0.36, 4545637, true, 0, parkedCar);
      box(0, 0.74, -0.93, 0.82, 0.2, 0.1, 4216672, true, 0, parkedCar);
      box(0, 0.76, 0.55, 0.87, 0.12, 0.22, 3822429, true, 0, parkedCar);
      const steering = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.014, 7, 20), mat(2572106));
      steering.position.set(0.25, 0.8, 0.39);
      steering.rotation.x = -0.3;
      parkedCar.add(steering);
      const driverHinge = new THREE.Group();
      driverHinge.position.set(0.525, 0, 0.7);
      parkedCar.add(driverHinge);
      box(0, 0.565, -0.43, 0.042, 0.39, 0.86, paint, true, 0, driverHinge);
      carFrame([[0, 0.745, 0], [0, 1.15, -0.35], [0, 1.15, -0.86], [0, 0.745, -0.86]], [[0, 0.79, -0.09], [0, 1.095, -0.41], [0, 1.095, -0.82], [0, 0.79, -0.82]], paint, driverHinge);
      carQuad([[0.024, 0.79, -0.09], [0.024, 1.095, -0.41], [0.024, 1.095, -0.82], [0.024, 0.79, -0.82]], 4615036, driverHinge, true);
      box(0.033, 0.735, -0.75, 0.026, 0.035, 0.13, 6387579, true, 0, driverHinge);
      box(-0.032, 0.64, -0.43, 0.018, 0.16, 0.68, 5138027, true, 0, driverHinge);
      box(0.073, 0.831, -0.21, 0.19, 0.11, 0.2, paint, true, 0, driverHinge);
      box(0.085, 0.836, -0.314, 0.13, 0.065, 8e-3, 7902876, false, 0, driverHinge);
      box(-0.598, 0.831, 0.49, 0.19, 0.11, 0.2, paint, true, 0, parkedCar);
      box(-0.61, 0.836, 0.386, 0.13, 0.065, 8e-3, 7902876, false, 0, parkedCar);
      const carLenses = [], carRearLenses = [];
      for (let side of [-1, 1]) {
        for (let z of [-0.85, 0.86]) {
          const tire = new THREE.Mesh(new THREE.TorusGeometry(0.178, 0.036, 9, 28), mat(2505284));
          tire.rotation.y = Math.PI / 2;
          tire.position.set(side * 0.535, 0.215, z);
          tire.castShadow = true;
          parkedCar.add(tire);
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.131, 0.131, 0.035, 16), mat(10202797));
          hub.rotation.z = Math.PI / 2;
          hub.position.set(side * 0.558, 0.215, z);
          parkedCar.add(hub);
          for (let j = 0; j < 5; j++) {
            let a = j * Math.PI * 2 / 5;
            rod([side * 0.58, 0.215, z], [side * 0.58, 0.215 + Math.cos(a) * 0.105, z + Math.sin(a) * 0.105], 8e-3, 6124672, parkedCar);
          }
        }
        const lens = box(side * 0.405, 0.586, 1.299, 0.255, 0.115, 0.03, 14933434, true, 0, parkedCar);
        lens.material = new THREE.MeshBasicMaterial({ color: 12303527 });
        carLenses.push(lens);
        box(side * 0.473, 0.575, 1.316, 0.05, 0.075, 0.012, 13871981, false, 0, parkedCar);
        const rear = box(side * 0.455, 0.558, -1.303, 0.16, 0.16, 0.026, 10380641, true, 0, parkedCar);
        rear.material = new THREE.MeshBasicMaterial({ color: 9131348 });
        carRearLenses.push(rear);
      }
      box(0, 0.495, 1.306, 0.47, 0.1, 0.025, 3690328, true, 0, parkedCar);
      for (let y of [0.47, 0.5, 0.53]) box(0, y, 1.324, 0.43, 0.01, 8e-3, 9084316, false, 0, parkedCar);
      plaque(0, 0.366, 1.335, 0.33, 0.137, "06\xB728", "#e5ce87", "#40565b", 75, parkedCar);
      const rearPlate = plaque(0, 0.426, -1.325, 0.33, 0.137, "06\xB728", "#e5ce87", "#40565b", 75, parkedCar);
      rearPlate.rotation.y = Math.PI;
      box(0, 1.18, -0.23, 1.03, 0.035, 1.12, 13753802, true, 0, parkedCar);
      parkedCar.updateMatrixWorld(true);
      const carBounds = new THREE.Box3().setFromObject(parkedCar);
      parkedCar.position.y += 0.26 - carBounds.min.y;
      parkedCar.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "carLights";
          interactionTargets.push(o);
        }
      });
      driverHinge.traverse((o) => {
        if (o.isMesh) o.userData.action = "carDoor";
      });
      hitBox("carDoor", 0.028, 0.745, -0.43, 0.12, 0.83, 0.91, driverHinge);
      const carSpots = [], carReflections = [];
      for (let side of [-1, 1]) {
        const spot = new THREE.SpotLight(16769453, 0, 5.6, 0.35, 0.92, 1.5);
        spot.position.set(side * 0.405, 0.586, 1.34);
        parkedCar.add(spot);
        const aim = new THREE.Object3D();
        aim.position.set(side * 0.6, -0.07, 4.2);
        parkedCar.add(aim);
        spot.target = aim;
        carSpots.push(spot);
        const reflection = glow(4.74 + side * 0.5, 0.55, 0.8, 2.7, "#ffe1ad");
        reflection.position.y = 0.335;
        reflection.visible = false;
        carReflections.push(reflection);
      }
      function toggleCarLights() {
        carLightsOn = !carLightsOn;
        carLenses.forEach((o) => o.material.color.setHex(carLightsOn ? 16773833 : 12303527));
        carRearLenses.forEach((o) => o.material.color.setHex(carLightsOn ? 14908778 : 9131348));
        carSpots.forEach((o) => o.intensity = carLightsOn ? 4 : 0);
        carReflections.forEach((o) => o.visible = carLightsOn && !isSunny);
        playSound("horn");
      }
      const takeoutGroup = new THREE.Group();
      takeoutGroup.name = "rear-takeout-window";
      world.add(takeoutGroup);
      for (let x of [-2.925, -1.875]) box(x, 1.88, -3.8, 0.055, 0.99, 0.21, 5600879, true, 0, takeoutGroup);
      for (let y of [1.41, 2.35]) box(-2.4, y, -3.8, 1.1, 0.055, 0.21, 5600879, true, 0, takeoutGroup);
      box(-2.4, 1.415, -4.03, 1.14, 0.08, 0.7, 10718571, true, 0, takeoutGroup);
      box(-2.4, 1.461, -4.03, 1.16, 0.018, 0.72, 14930862, true, 0, takeoutGroup);
      const takeoutPanes = [];
      for (let i = 0; i < 2; i++) {
        const g = new THREE.Group(), offset = i ? -0.25 : 0.25;
        g.position.set(i ? -1.895 : -2.905, 0, -3.947);
        g.name = "outward-casement-window";
        takeoutGroup.add(g);
        pane(offset, 1.91, 0, 0.465, 0.76, 0, g);
        for (const x of [-0.235, 0.235]) box(offset + x, 1.91, 0, 0.026, 0.79, 0.045, 6719356, true, 0, g);
        for (const y of [1.515, 2.305]) box(offset, y, 0, 0.49, 0.025, 0.045, 6719356, true, 0, g);
        box(offset + (i ? -0.19 : 0.19), 1.8, -0.03, 0.022, 0.16, 0.033, 14272417, true, 0, g);
        for (const y of [1.58, 2.23]) cyl(0, y, 0, 0.022, 0.085, 10991011, 10, g);
        takeoutPanes.push(g);
      }
      const pickupSign = plaque(-2.4, 2.96, -3.93, 1.18, 0.14, "\u304A\u5F01\u5F53 \u304A\u6E21\u3057\u53E3", "#58796d", "#f6e6be", 80, takeoutGroup);
      pickupSign.rotation.y = Math.PI;
      const rearAwning = new THREE.Group();
      rearAwning.position.set(-2.4, 2.62, -4.18);
      rearAwning.rotation.x = -0.1;
      takeoutGroup.add(rearAwning);
      box(0, 0, 0, 1.68, 0.06, 0.77, 6586227, true, 0, rearAwning);
      for (let i = 0; i < 10; i++) {
        const color = i % 2 ? 14143659 : 7837578;
        box(-0.756 + i * 0.168, 0.038, 0, 0.165, 0.012, 0.75, color, false, 0, rearAwning);
        box(-0.756 + i * 0.168, -0.06, -0.389, 0.165, 0.13, 0.025, color, false, 0, rearAwning);
      }
      box(-2.4, 2.53, -4.12, 1.12, 0.025, 0.14, 16766106, false, 0.5, takeoutGroup);
      for (let x of [-3.08, -1.72]) rod([x, 2.33, -3.9], [x, 2.52, -4.45], 0.018, 7112059, takeoutGroup);
      const bento = new THREE.Group();
      bento.name = "takeout-bento";
      bento.position.set(-2.4, 1.508, -3.63);
      world.add(bento);
      bento.visible = false;
      box(0, 0, 0, 0.4, 0.055, 0.28, 5462350, true, 0, bento);
      box(0, 0.031, 0, 0.375, 0.015, 0.256, 13021836, false, 0, bento);
      box(-0.092, 0.05, 0, 0.17, 0.035, 0.226, 15786429, false, 0, bento);
      box(0.087, 0.052, -0.064, 0.15, 0.043, 0.09, 14193008, false, 0, bento);
      for (let i = 0; i < 3; i++) {
        let rice = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), mat(16773328));
        rice.scale.set(1.4, 0.4, 0.8);
        rice.position.set(-0.136 + i * 0.044, 0.071, -0.052 + i * 0.05);
        bento.add(rice);
        box(0.04 + i * 0.036, 0.057, 0.04, 0.03, 0.045, 0.08, 15058030, false, 0, bento);
      }
      const plum = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), mat(11887448));
      plum.position.set(-0.09, 0.073, 0.01);
      bento.add(plum);
      for (let i = 0; i < 3; i++) {
        const veg = new THREE.Mesh(new THREE.SphereGeometry(0.023, 9, 6), mat(8034160));
        veg.position.set(0.137 - i * 0.017, 0.058, 0.08 + i * 0.012);
        bento.add(veg);
      }
      bento.traverse((o) => {
        if (o.material) {
          o.material = o.material.clone();
          o.material.transparent = true;
          o.material.opacity = 0;
          o.material.depthWrite = false;
        }
      });
      let takeoutTarget = 0, takeoutAmount = 0, takeoutClicks = 0, windowPending = null, noteShownAt = -1, cookJiggleAt = -100;
      function requestPickup(t) {
        takeoutClicks++;
        cookLidTarget = 0;
        noteShownAt = -1;
        if (takeoutTarget || windowPending) {
          takeoutTarget = 0;
          windowPending = null;
          playSound("take");
          return;
        }
        takeoutVariant = Math.random() < 0.55 ? "bento" : "note";
        windowPending = { variant: takeoutVariant };
        playSound("takeout");
      }
      hitBox("postbox", 0, 0.65, 0, 0.51, 1.25, 0.56, postbox);
      postbox.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "postbox";
          if (!interactionTargets.includes(o)) interactionTargets.push(o);
        }
      });
      const mailEnvelope = new THREE.Group();
      mailEnvelope.name = "postbox-letter";
      mailEnvelope.position.set(0, 0.84, 0.22);
      postbox.add(mailEnvelope);
      mailEnvelope.visible = false;
      box(0, 0, 0, 0.255, 0.16, 0.012, 15787209, true, 0, mailEnvelope);
      line([[-0.122, 0.073, 9e-3], [0, -0.011, 9e-3], [0.122, 0.073, 9e-3]], 10722439, 1, mailEnvelope);
      line([[-0.122, -0.071, 9e-3], [-0.048, -0.021, 9e-3]], 11643028, 1, mailEnvelope);
      line([[0.122, -0.071, 9e-3], [0.048, -0.021, 9e-3]], 11643028, 1, mailEnvelope);
      const mailSeal = new THREE.Mesh(new THREE.CircleGeometry(0.013, 16), mat(12088675));
      mailSeal.position.set(0, -0.011, 0.011);
      mailEnvelope.add(mailSeal);
      box(0.087, 0.038, 0.01, 0.036, 0.044, 4e-3, 10401966, false, 0, mailEnvelope);
      for (let i = 0; i < 2; i++) box(-0.05, -0.04 - i * 0.018, 0.011, 0.075, 3e-3, 2e-3, 10918528, false, 0, mailEnvelope);
      mailEnvelope.traverse((o) => {
        if (o.material) {
          o.material = o.material.clone();
          o.material.transparent = true;
          o.material.opacity = 0;
          o.material.depthWrite = false;
        }
        if (o.isMesh) {
          o.userData.action = "letter";
          interactionTargets.push(o);
        }
      });
      hitBox("letter", 0, 0, 8e-3, 0.29, 0.2, 0.045, mailEnvelope);
      let letterTarget = 0, letterAmount = 0;
      const letterStyle = document.createElement("style");
      letterStyle.textContent = "\n .scene-letter{padding:0;border:1px solid #d7c7a7;border-radius:3px;width:720px;max-width:calc(calc(var(--street-vw) * 100) - 28px);max-height:calc(var(--street-vh) * 88);color:#5c5648;background:#f6eddb;box-shadow:0 24px 100px rgba(6,13,25,0.7020);overflow:hidden}\n .scene-letter::backdrop{background:rgba(16,27,45,0.7020);backdrop-filter:blur(5px)}\n .letter-scroll{max-height:calc(var(--street-vh) * 88);overflow:auto;overscroll-behavior:contain;padding:48px 54px 35px;background:radial-gradient(ellipse at 0 0,rgba(255,249,235,0.5333),transparent 70%),repeating-linear-gradient(0deg,rgba(158,135,96,0.0157) 0px,rgba(158,135,96,0.0157) 1px,transparent 1px,transparent 5px);font:16px/1.9 Georgia,'Noto Serif SC','Songti SC',SimSun,serif;scrollbar-width:thin;scrollbar-color:#bbae94 transparent}\n .letter-close{position:absolute;right:12px;top:10px;padding:7px 10px;color:#7c7667;background:rgba(246,237,219,0.9294);border:0;border-radius:2px;font:13px Georgia,serif;cursor:pointer;z-index:1}.letter-close:hover{color:#3e5e56;background:#e8e0ce}.letter-close:focus{outline:2px solid #7d9b8c;outline-offset:2px}\n .letter-eyebrow{font:12px/1.5 Georgia,serif;letter-spacing:.18em;color:#8b9d8b;margin:0 0 15px}.scene-letter h1{font-size:26px;line-height:1.5;font-weight:500;letter-spacing:.03em;margin:0 0 13px;color:#4f665b}.letter-intro{margin:0 0 26px;color:#8a7d65;font-size:15px}.letter-steps{padding:0;margin:0;list-style:none;counter-reset:letter-step}.letter-steps li{position:relative;padding:0 0 19px 35px;border-left:1px solid #d9ccb0;margin-left:11px;counter-increment:letter-step}.letter-steps li:before{content:counter(letter-step,decimal-leading-zero);position:absolute;left:-13px;top:3px;background:#f6eddb;color:#a3977e;font:12px/25px Georgia,serif;width:26px;text-align:center}.letter-steps strong{display:block;color:#66796c;font-weight:600;font-size:16px;margin:0 0 3px}.letter-substep{font:11px/1.8 Georgia,serif;color:#9a9e8c;letter-spacing:.04em}.letter-steps p+p{margin-top:7px}.letter-steps p{margin:0;font-size:14px;color:#756d5b}.letter-signoff{border-top:1px solid #d9ccb0;text-align:right;padding-top:18px;margin:12px 0 0;color:#8a927e;font-style:italic;font-size:15px}.letter-signoff small{display:block;font-style:normal;letter-spacing:.15em;font-size:11px;color:#ab9c80}\n @media(max-width:520px){.letter-scroll{padding:46px 25px 28px}.scene-letter h1{font-size:22px}.letter-steps li{padding-left:25px}.letter-steps p{font-size:14px}.letter-intro{font-size:14px}}\n @media(prefers-reduced-motion:no-preference){.scene-letter[open]{animation:letter-unfold .3s ease-out}@keyframes letter-unfold{from{opacity:0;transform:translateY(16px) rotate(-1deg)}to{opacity:1;transform:none}}}\n";
      window.streetAppendStyle(letterStyle, "summer");
      const letterDialog = document.createElement("dialog");
      letterDialog.className = "scene-letter";
      letterDialog.setAttribute("aria-labelledby", "scene-letter-title");
      letterDialog.innerHTML = '\n <button class="letter-close" type="button" aria-label="\u6536\u8D77\u4FE1\u7EB8">\u6536\u8D77 \xD7</button>\n <article class="letter-scroll"><p class="letter-eyebrow">\u661F\u6708\u901A\u308A \xB7 SCENE NOTES</p><h1 id="scene-letter-title">\u5BC4\u7ED9\u4E0B\u4E00\u675F\u8DEF\u8FC7\u7684\u5149</h1>\n <p class="letter-intro">\u719F\u6089\u7684\u8857\u89D2\u6362\u4E0A\u4E86\u9713\u8679\uFF0C\u800C\u7559\u7ED9\u8DEF\u8FC7\u4E4B\u4EBA\u7684\u6E29\u67D4\uFF0C\u4ECD\u5728\u539F\u5904\u3002</p>\n <ol class="letter-steps">\n<li><strong>\u8857\u89D2\uFF0C\u5728\u51E0\u5341\u5E74\u4EE5\u540E</strong><p>\u5982\u679C\u4F60\u8FD8\u8BB0\u5F97\u90A3\u95F4\u4EAE\u7740\u6696\u706F\u7684\u5C0F\u5E97\uFF0C\u5C31\u6CBF\u7740\u540C\u4E00\u6761\u8DEF\u518D\u8D70\u4E00\u904D\u5427\u3002\u96E8\u591C\u3001\u6674\u663C\u4E0E\u9EC4\u660F\u90FD\u88AB\u59A5\u5E16\u5730\u6536\u85CF\u7740\uFF0C\u800C\u7B2C\u56DB\u675F\u5149\uFF0C\u4F1A\u5E26\u4F60\u62B5\u8FBE2077\u5E74\u7684\u661F\u6708\u8857\u89D2\u3002\u623F\u5C4B\u548C\u80E1\u540C\u8FD8\u5728\u539F\u6765\u7684\u4F4D\u7F6E\uFF0C\u5929\u7A7A\u5374\u66F4\u6DF1\u3001\u66F4\u8FDC\uFF0C\u50CF\u4E00\u5C01\u7EC8\u4E8E\u9001\u8FBE\u7684\u84DD\u8272\u6765\u4FE1\u3002</p><p>\u98CE\u94C3\u4E5F\u8FD8\u5728\u3002\u73BB\u7483\u4E0B\u7684\u7EB8\u7B7E\u66FF\u98CE\u7559\u4E0B\u77ED\u77ED\u7684\u505C\u987F\uFF0C\u95E8\u524D\u7684\u80FD\u6E90\u68D2\u5219\u4E00\u6839\u63A5\u4E00\u6839\uFF0C\u7B49\u5019\u4E0B\u4E00\u4F4D\u591C\u884C\u4EBA\u3002\u672A\u6765\u6709\u4E86\u65B0\u7684\u5F62\u72B6\uFF0C\u6709\u4E9B\u6E29\u67D4\u5374\u4E0D\u5FC5\u66F4\u65B0\u3002</p></li>\n<li><strong>\u4E3A\u4F60\u4FDD\u7559\u4E00\u76CF\u706F\uFF0C\u4E5F\u4FDD\u7559\u65F6\u95F4</strong><p>\u8F7B\u89E6\u8857\u8FB9\u7684\u7EC8\u7AEF\uFF0C\u6574\u95F4\u5C0F\u5E97\u4F1A\u4ECE\u9752\u84DD\u6E10\u67D3\u6210\u7C89\u8272\uFF1A\u6A90\u4E0B\u706F\u6761\u4E0E\u5B57\u724C\uFF0C\u4E00\u8D77\u6362\u4E0A\u53E6\u4E00\u79CD\u5FC3\u60C5\uFF1B\u7167\u5728\u8857\u89D2\u7684\u5149\u3001\u6BCF\u4E2A\u5B57\u7684\u5927\u5C0F\u548C\u542B\u4E49\uFF0C\u90FD\u7559\u5728\u539F\u5904\u3002\u8FC7\u4E00\u4F1A\u513F\uFF0C\u84DD\u8272\u7684\u591C\u53C8\u8F7B\u8F7B\u56DE\u6765\uFF0C\u50CF\u6F6E\u6C34\u9000\u5230\u8857\u9053\u53E6\u4E00\u7AEF\u3002</p><p>\u4FA7\u9762\u768424H\u724C\u85CF\u7740\u4E00\u4E2A\u5C0F\u673A\u5173\uFF0C\u78B0\u4E00\u4E0B\uFF0C\u65F6\u95F4\u5C31\u6362\u4E00\u79CD\u65B9\u5F0F\u966A\u4F60\u3002\u65E0\u8BBA\u4F60\u8D70\u8FDB\u54EA\u4E00\u7247\u5929\u7A7A\uFF0C\u955C\u5934\u4F1A\u8BB0\u4F4F\u4F60\u7684\u76EE\u5149\uFF1B\u82E5\u60F3\u91CD\u65B0\u5F00\u59CB\uFF0C\u5DE6\u4E0B\u89D2\u7684\u4E00\u6B21\u8F7B\u89E6\uFF0C\u4F1A\u8BA9\u8857\u89D2\u5728\u77ED\u6682\u7684\u6697\u573A\u540E\uFF0C\u50CF\u521D\u89C1\u65F6\u90A3\u6837\u4F9D\u6B21\u9192\u6765\u3002</p></li>\n<li><strong>\u505C\u5728\u5DF7\u53E3\u7684\uFF0C\u4E0D\u53EA\u662F\u5F52\u9014</strong><p>\u5C0F\u8F7F\u8F66\u540E\u6765\u5B66\u4F1A\u4E86\u60AC\u6D6E\uFF0C\u4ECD\u505C\u5728\u90A3\u6761\u719F\u6089\u7684\u80E1\u540C\u91CC\u3002\u900F\u660E\u9A7E\u9A76\u8231\u4E0B\u6709\u5B89\u7A33\u7684\u5EA7\u6905\uFF0C\u4FA7\u95E8\u5411\u4E0A\u5C55\u5F00\uFF0C\u56DB\u675F\u6DE1\u84DD\u6C14\u6D41\u5728\u8F66\u5E95\u4EAE\u8D77\uFF0C\u50CF\u4E3A\u4E00\u6BB5\u5C1A\u672A\u542F\u7A0B\u7684\u65C5\u884C\u8BD5\u7740\u70B9\u706B\u3002</p><p>\u540E\u95E8\u65C1\u7684\u6469\u6258\u8F66\u6536\u8D77\u4E86\u65E7\u65F6\u4EE3\u7684\u8F6E\u8F90\uFF0C\u8D29\u5356\u673A\u91CC\u4E5F\u76DB\u7740\u516D\u8FB9\u5F62\u7684\u5FAE\u5149\u3002\u4F60\u4ECD\u80FD\u542C\u89C1\u9E23\u7B1B\uFF0C\u4ECD\u80FD\u4ECE\u53D6\u8D27\u53E3\u62FF\u8D70\u4E00\u74F6\u996E\u6599\u3002\u518D\u9065\u8FDC\u7684\u57CE\u5E02\uFF0C\u4E5F\u9700\u8981\u8FD9\u4E9B\u8BA9\u4EBA\u5B89\u5FC3\u7684\u5C0F\u4E8B\u3002</p></li>\n<li><strong>\u6709\u4EBA\u628A\u8BAF\u53F7\u7559\u5728\u591C\u7A7A\u91CC</strong><p>\u65E0\u4EBA\u673A\u4ECE\u5C4B\u9876\u524D\u4FA7\u8D77\u98DE\uFF0C\u60AC\u505C\u7247\u523B\uFF0C\u53C8\u964D\u56DE\u5145\u7535\u5EA7\u3002\u4E09\u53F6\u98CE\u6247\u5728\u7A7A\u6C14\u51C0\u5316\u673A\u91CC\u7F13\u7F13\u8F6C\u52A8\uFF0C\u767D\u96FE\u8D8A\u8FC7\u5C4B\u9876\uFF0C\u8BA9\u591C\u8272\u6709\u4E86\u53EF\u4EE5\u547C\u5438\u7684\u8D77\u4F0F\u3002</p><p>\u5408\u6210\u5668\u7684\u65CB\u5F8B\u5F88\u8F7B\uFF0C\u5076\u5C14\u54CD\u8D77\u4E00\u58F0\u7535\u5B50\u56DE\u97F3\u3002\u8DEF\u53E3\u7684\u5C0F\u673A\u5668\u4EBA\u4ECD\u8BA4\u771F\u7B49\u5F85\u7EA2\u7EFF\u706F\uFF0C\u6CBF\u8857\u7684\u900F\u660E\u62A4\u680F\u3001\u7BA1\u7EBF\u548C\u6392\u6C34\u683C\u6805\u5404\u5B88\u7740\u81EA\u5DF1\u7684\u5C97\u4F4D\u3002\u672A\u6765\u4E0D\u662F\u4E00\u7247\u55A7\u95F9\uFF0C\u5B83\u4E5F\u4F1A\u5728\u6DF1\u591C\u4F4E\u58F0\u8BF4\u8BDD\u3002</p></li>\n<li><strong>\u79D1\u6280\u5F88\u8FDC\uFF0C\u665A\u996D\u5F88\u8FD1</strong><p>\u540E\u4FA7\u7684\u900F\u660E\u53D6\u9910\u8231\u4F1A\u5411\u4E0A\u6253\u5F00\uFF0C\u628A\u4E00\u4EFD\u4FBF\u5F53\u7F13\u7F13\u9001\u5230\u6258\u76D8\u524D\u3002\u6709\u65F6\u5C4F\u5E55\u53EA\u4EAE\u8D77PREPARING\uFF0C\u7136\u540E\u6E10\u6E10\u6DE1\u53BB\u2014\u2014\u4E5F\u8BB8\u53A8\u623F\u91CC\u7684\u4EBA\u6B63\u66FF\u4F60\u591A\u7559\u4E00\u70B9\u70ED\u6C14\u3002\u65C1\u8FB9\u7684STANDBY\u4E5F\u6362\u4E0A\u4E00\u5757\u66F4\u6E05\u695A\u7684\u5C4F\u5E55\uFF0C\u7B49\u4F60\u9760\u8FD1\u65F6\uFF0C\u4E00\u773C\u5C31\u80FD\u8BFB\u61C2\u3002\u9505\u6CBF\u7684\u84DD\u5149\u4E0E\u7C89\u5149\uFF0C\u6084\u6084\u544A\u8BC9\u4F60\u6B64\u523B\u662F\u5426\u9002\u5408\u63ED\u76D6\u3002</p><p>\u5496\u5561\u676F\u4ECD\u80FD\u6CE8\u6EE1\uFF0C\u4E5F\u80FD\u6E05\u7A7A\uFF1B\u900F\u660E\u7F69\u4E0B\u7684\u5305\u5B50\u4E0D\u4F1A\u968F\u706F\u5149\u6D88\u5931\u3002\u51B0\u67DC\u95E8\u8F7B\u8F7B\u63A8\u5F0030\u5EA6\uFF0C\u51C9\u610F\u4E0E\u996E\u6599\u90FD\u7559\u5728\u5404\u81EA\u7684\u4F4D\u7F6E\u3002\u5927\u95E8\u6ED1\u5F00\u65F6\uFF0C\u5730\u57AB\u8FB9\u7F18\u968F\u4E4B\u4EAE\u8D77\uFF0C\u50CF\u4E00\u53E5\u6CA1\u6709\u8BF4\u51FA\u53E3\u7684\u201C\u4F60\u6765\u4E86\u201D\u3002</p></li>\n<li><strong>\u5728\u73BB\u7483\u91CC\u517B\u82B1\uFF0C\u5728\u5899\u8FB9\u5B58\u4E00\u5C0F\u6BB5\u5149</strong><p>\u540E\u95E8\u7684\u82B1\u88AB\u6536\u8FDB\u65E0\u8272\u73BB\u7483\u7F69\uFF0C\u50A8\u6C34\u5C42\u6258\u7740\u771F\u5B9E\u7684\u6839\u4E0E\u53F6\uFF0C\u706F\u6761\u4ECE\u540E\u4E0A\u65B9\u7167\u4E0B\u6765\u3002\u73BB\u7483\u73B0\u5728\u7559\u7740\u66F4\u6E05\u695A\u7684\u8F6E\u5ED3\uFF0C\u8BA9\u4F60\u770B\u89C1\u8FD9\u4E2A\u5C0F\u5C0F\u57F9\u517B\u8231\uFF0C\u4E5F\u770B\u89C1\u91CC\u9762\u4ECD\u5728\u7EE7\u7EED\u7684\u751F\u957F\u3002</p><p>\u539F\u5148\u82B1\u7BEE\u7684\u4F4D\u7F6E\uFF0C\u6362\u6210\u4E86\u4E09\u683C\u58C1\u6302\u80FD\u6E90\u7535\u6C60\u8231\u3002\u70B9\u4E00\u683C\uFF0C\u5B83\u5C31\u8F7B\u8F7B\u9001\u51FA\uFF1B\u518D\u70B9\u6536\u56DE\uFF0C\u6362\u53E6\u4E00\u683C\u65F6\uFF0C\u5148\u524D\u7684\u4F1A\u81EA\u52A8\u5F52\u4F4D\u3002\u8231\u540D\u8F7B\u8F7B\u60AC\u5728\u4E0A\u65B9\uFF0C\u4E0D\u6321\u4F4F\u4EFB\u4F55\u4E00\u683C\u661F\u5149\uFF0C\u50CF\u8FD9\u5EA7\u57CE\u5E02\u628A\u5907\u7528\u7684\u661F\u5149\uFF0C\u4E00\u6B21\u53EA\u501F\u7ED9\u4E00\u4E2A\u4EBA\u3002</p></li>\n<li><strong>\u4E24\u79CD\u989C\u8272\uFF0C\u5954\u5411\u76F8\u53CD\u7684\u8FDC\u65B9</strong><p>\u9752\u84DD\u8272\u7684\u8F66\u706F\u5F80\u8FD9\u4E00\u8FB9\u6765\uFF0C\u7C89\u7D2B\u8272\u7684\u8F66\u706F\u5F80\u53E6\u4E00\u8FB9\u53BB\u3002\u6BCF\u4E00\u5BF9\u706F\u90FD\u6709\u76F8\u540C\u7684\u989C\u8272\uFF0C\u5730\u9762\u7684\u6298\u89D2\u5BFC\u5149\u7EBF\u4E5F\u671D\u5411\u76F8\u53CD\u65B9\u5411\uFF0C\u5728\u6591\u9A6C\u7EBF\u524D\u5B89\u9759\u8BA9\u5F00\u3002\u6D45\u84DD\u8272\u7684\u534A\u900F\u660E\u957F\u6761\u60AC\u5728\u8DEF\u9762\u4E0A\uFF0C\u50CF\u901A\u5F80\u53E6\u4E00\u6BB5\u73B0\u5B9E\u7684\u5149\u6865\uFF1B\u9A6C\u8DEF\u53E6\u4E00\u8FB9\uFF0C\u4E5F\u6709\u540C\u8272\u7684\u8DEF\u574E\u63A5\u4F4F\u811A\u6B65\u3002\u7EC6\u5C0F\u7684\u8DEF\u9489\u5728\u96E8\u591C\u6620\u7740\u51B7\u5149\uFF0C\u6674\u5929\u50CF\u4E00\u679A\u6696\u91D1\u8272\u592A\u9633\uFF0C\u9EC4\u660F\u7559\u4E0B\u7425\u73C0\u8272\uFF0C\u5230\u4E86\u9713\u8679\u591C\u4FBF\u4EAE\u8D77\u6D45\u9752\u8272\u3002</p><p>\u8DEF\u724C\u5199\u7740HOSHITSUKI ST.\uFF0C\u5496\u5561\u53F0\u5199\u7740ODEN &amp; COFFEE\u3002\u82F1\u6587\u6807\u8BC6\u88AB\u5B89\u653E\u5728\u6070\u597D\u7684\u8FB9\u6846\u91CC\u3002\u90A3\u4E9B\u539F\u672C\u7EB7\u4E71\u7684\u7EBF\u4E0E\u5B57\uFF0C\u6700\u540E\u90FD\u8BA9\u51FA\u4E00\u70B9\u7A7A\u767D\uFF0C\u7559\u7ED9\u591C\u665A\uFF0C\u4E5F\u7559\u7ED9\u4F60\u3002</p></li>\n<li><strong>\u8857\u89D2\u4E5F\u6709\u81EA\u5DF1\u7684\u5C0F\u79E9\u5E8F</strong><p>\u5899\u5916\u7684\u56DE\u6536\u7BB1\u85CF\u7740\u559D\u7A7A\u7684\u7F50\u5B50\u4E0E\u900F\u660E\u996E\u6599\u74F6\uFF0C\u8F7B\u8F7B\u6380\u8D77\u76D6\u5B50\uFF0C\u4FBF\u770B\u89C1\u8DEF\u8FC7\u8FD9\u91CC\u7684\u65E5\u5E38\u3002\u5899\u95F4\u7684\u4E00\u5C42\u767E\u53F6\u7247\u4F34\u7740\u7EC6\u5FAE\u6469\u64E6\u58F0\u8F7B\u8F7B\u7FFB\u5F00\uFF0C\u900F\u51FA\u5C0F\u5E97\u7684\u706F\u706B\uFF0C\u50CF\u8857\u89D2\u5B89\u9759\u800C\u7EF5\u957F\u7684\u547C\u5438\u3002\u82E5\u60F3\u56DE\u5230\u521D\u89C1\uFF0C\u5DE6\u4E0B\u89D2\u7684\u4E00\u6B21\u8F7B\u89E6\uFF0C\u4F1A\u8BA9\u773C\u524D\u7684\u5929\u6C14\u5728\u77ED\u6682\u6DE1\u573A\u540E\uFF0C\u91CD\u65B0\u5B89\u9759\u4E0B\u6765\uFF1B\u7559\u7ED9\u67D0\u4E2A\u4EBA\u7684\u8BDD\uFF0C\u4ECD\u5728\u4FE1\u91CC\u3002</p></li><li><strong>\u96E8\u4E0E\u5149\uFF0C\u90FD\u6084\u6084\u7559\u4E0B\u75D5\u8FF9</strong><p>\u96E8\u591C\u7684\u73BB\u7483\u5076\u5C14\u8499\u8D77\u4E00\u7247\u96FE\uFF0C\u8F7B\u8F7B\u70B9\u5B83\uFF0C\u6307\u5C16\u4F1A\u4E00\u7B14\u4E00\u7B14\u64E6\u51FA\u900F\u660E\u7684\u7B11\u8138\uFF0C\u968F\u540E\u53C8\u6162\u6162\u8499\u4E0A\u6C34\u6C7D\uFF1B\u5C4B\u6A90\u6512\u591F\u96E8\u6C34\uFF0C\u4FBF\u843D\u4E0B\u4E00\u5C0F\u4E32\u6C34\u6EF4\u3002\u6674\u5929\u7684\u65E5\u5149\u7F13\u7F13\u632A\u52A8\uFF0C\u74F6\u8EAB\u95EA\u8FC7\u5FAE\u5149\uFF0C\u767D\u9E3D\u4E0D\u65F6\u843D\u4E0B\u4E00\u6839\u7FBD\u6BDB\uFF0C\u4ECE\u96E8\u68DA\u5916\u6CBF\uFF0C\u8F7B\u8F7B\u4E58\u98CE\u98DE\u5411\u7A7A\u4E2D\u3002</p><p>\u9EC4\u660F\u7684\u706F\u6309\u533A\u57DF\u4F9D\u6B21\u9192\u6765\uFF0C\u7A97\u8FB9\u7559\u7740\u6700\u540E\u4E00\u7F15\u5915\u9633\u3002\u5C0F\u72D7\u7761\u68A6\u4E2D\u7684\u547C\u5438\u5F88\u8F7B\uFF0C\u70B9\u4E00\u4E0B\uFF0C\u5B83\u5148\u4F38\u4E2A\u61D2\u8170\uFF0C\u518D\u56DE\u5230\u81EA\u5DF1\u7684\u5C0F\u68A6\u91CC\u3002\u6309\u4E0B\u76F8\u673A\uFF0C\u5148\u770B\u770B\u8FD9\u4E00\u523B\u7684\u660E\u4FE1\u7247\uFF0C\u518D\u51B3\u5B9A\u662F\u5426\u6536\u85CF\u3002\u5361\u7247\u4E0A\u4F1A\u7559\u4E0B\u5F53\u524D\u5929\u7A7A\u7684\u7EAA\u5FF5\u90AE\u6233\uFF1A\u96E8\u6EF4\u3001\u7FBD\u6BDB\u3001\u843D\u65E5\uFF0C\u6216\u4E00\u9897\u6CBF\u8F68\u9053\u65C5\u884C\u7684\u661F\u3002</p></li><li><strong>\u8FD9\u5C01\u4FE1\uFF0C\u4E0D\u5FC5\u6709\u6536\u4EF6\u5730\u5740</strong><p>\u90AE\u7B52\u9001\u51FA\u7684\u5DF2\u4E0D\u518D\u662F\u7EB8\u7247\uFF0C\u800C\u662F\u4E00\u679A\u5FAE\u5FAE\u60AC\u8D77\u7684\u7535\u5B50\u4FE1\u7B3A\u3002\u70B9\u5F00\u5B83\uFF0C\u56DB\u89D2\u7684\u7EC6\u5149\u4F1A\u56F4\u4F4F\u8FD9\u5C01\u4FE1\uFF0C\u50CF\u4ECE\u57CE\u5E02\u53E6\u4E00\u7AEF\u63A5\u901A\u4E86\u4E00\u6247\u5F88\u5C0F\u7684\u7A97\u3002</p><p>\u5982\u679C\u4F60\u613F\u610F\uFF0C\u5C31\u5728\u672B\u5C3E\u7559\u4E0B\u4E00\u53E5\u8BDD\u5427\u3002\u53EF\u4EE5\u9001\u7ED9\u67D0\u4E2A\u4EBA\uFF0C\u4E5F\u53EF\u4EE5\u9001\u7ED9\u8BB8\u591A\u5E74\u540E\u7684\u81EA\u5DF1\u3002\u7B49\u4E0B\u4E00\u675F\u5149\u8DEF\u8FC7\u661F\u6708\u8857\u89D2\uFF0C\u8FD9\u91CC\u603B\u6709\u4E00\u76CF\u706F\uFF0C\u8FD8\u8BB0\u5F97\u8981\u4E3A\u8C01\u4EAE\u7740\u3002</p></li></ol><label class="personal-label" for="personal-message">\u7559\u7ED9\u67D0\u4E2A\u4EBA\u7684\u8BDD</label><textarea id="personal-message" class="personal-message" rows="3" maxlength="600" aria-label="\u79C1\u4EBA\u7559\u8A00" placeholder="\u5728\u8FD9\u91CC\u5199\u4E0B\u4E00\u53E5\u795D\u798F\u2026\u2026"></textarea><p class="letter-signoff">wfcsilence<small>2026\xB710 \xB7 \u661F\u6708\u901A\u308A</small></p></article>';
      sceneHost.appendChild(letterDialog);
      {
        const overlay = document.createElement("div");
        overlay.className = "landscape-letter-backdrop";
        overlay.hidden = true;
        sceneHost.appendChild(overlay);
        overlay.addEventListener("click", () => letterDialog.close());
        letterDialog.showModal = function() {
          this.setAttribute("open", "");
          overlay.hidden = false;
          document.getElementById("street-modes").style.pointerEvents = "none";
        };
        letterDialog.close = function() {
          this.removeAttribute("open");
          overlay.hidden = true;
          document.getElementById("street-modes").style.pointerEvents = "";
          this.dispatchEvent(new Event("close"));
        };
      }
      letterDialog.querySelector("button").addEventListener("click", () => letterDialog.close());
      letterDialog.addEventListener("click", (e) => {
        if (e.target === letterDialog) letterDialog.close();
      });
      letterDialog.addEventListener("close", () => {
        renderer.domElement.focus({ preventScroll: true });
      });
      function openSceneLetter() {
        if (!letterDialog.open) {
          letterDialog.showModal();
          letterDialog.querySelector(".letter-scroll").scrollTop = 0;
          requestAnimationFrame(() => {
            if (letterDialog.open) letterDialog.querySelector(".letter-scroll").scrollTop = 0;
          });
          playSound("take");
          vy = vp = 0;
        }
      }
      hitBox("pedestrianSignal", 0, 0, 0, 0.48, 0.89, 0.33, pedestrianHead);
      hitBox("pedestrianSignal", 0, 0, 0, 0.93, 0.41, 0.33, vehicleHead);
      crossingSignal.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "pedestrianSignal";
          interactionTargets.push(o);
        }
      });
      for (const pot of flowerPots) {
        const hit = hitBox("flower", 0, 0.43, 0, 0.42, 0.55, 0.42, pot);
        hit.userData.flower = pot;
        pot.userData.blooms.traverse((o) => {
          if (o.isMesh) {
            o.userData.action = "flower";
            o.userData.flower = pot;
            interactionTargets.push(o);
          }
        });
      }
      const pickupHit = hitBox("takeout", -2.4, 1.9, -3.94, 1.12, 1.03, 0.3);
      takeoutGroup.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "takeout";
          interactionTargets.push(o);
        }
      });
      bento.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "takeout";
          interactionTargets.push(o);
        }
      });
      let yaw = 0.65, pitch = 0.43, distance = 21.7, vy = 0, vp = 0, target = new THREE.Vector3(0, 1.4, 0), pointers = /* @__PURE__ */ new Map(), gesture = null;
      const el = renderer.domElement;
      el.tabIndex = 0;
      el.setAttribute("aria-label", "\u53EF\u65CB\u8F6C\u7684\u96E8\u591C\u4FBF\u5229\u5E97\u6A21\u578B");
      el.style.touchAction = "none";
      let doorTarget = 0, doorAmount = 0, tapStart = null;
      const doorRay = new THREE.Raycaster();
      const doorHit = new THREE.Mesh(new THREE.PlaneGeometry(2.65, 2.8), new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide }));
      doorHit.position.set(-1.22, 1.8, 1);
      world.add(doorHit);
      doorHit.userData.action = "front";
      el.addEventListener("pointerdown", (nativeEvent) => {
        const e = window.sceneEvent(nativeEvent);
        focusTween = null;
        ensureAudio();
        tapStart = pointers.size ? null : { x: e.clientX, y: e.clientY, id: e.pointerId };
        el.setPointerCapture(e.pointerId);
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        vy = vp = 0;
        gesture = null;
      });
      el.addEventListener("pointermove", (nativeEvent) => {
        const e = window.sceneEvent(nativeEvent);
        if (!pointers.has(e.pointerId)) {
          el.style.cursor = pickScene(e) ? "pointer" : "grab";
          return;
        }
        const old = pointers.get(e.pointerId);
        const dx = e.clientX - old.x, dy = e.clientY - old.y;
        if (tapStart && Math.hypot(e.clientX - tapStart.x, e.clientY - tapStart.y) > 7) tapStart = null;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (pointers.size === 2) {
          let a = [...pointers.values()];
          let len = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
          if (gesture) distance = THREE.MathUtils.clamp(distance * gesture / len, 4.5, 85);
          gesture = len;
        } else if (e.shiftKey || e.buttons === 2) {
          const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
          target.addScaledVector(right, -dx * distance * 12e-4);
          target.y = THREE.MathUtils.clamp(target.y + dy * distance * 12e-4, -0.5, 4);
        } else {
          yaw -= dx * 5e-3;
          pitch = THREE.MathUtils.clamp(pitch + dy * 4e-3, 0.16, 1.3);
          vy = -dx * 45e-5;
          vp = dy * 3e-4;
        }
      });
      for (let event of ["pointerup", "pointercancel"]) el.addEventListener(event, (nativeEvent) => {
        const e = window.sceneEvent(nativeEvent);
        if (event === "pointerup" && tapStart && tapStart.id === e.pointerId && e.button === 0 && !e.shiftKey) {
          clearTimeout(singleTapTimer);
          const tap = { clientX: e.clientX, clientY: e.clientY };
          singleTapTimer = setTimeout(() => actOnScene(tap), 300);
        }
        tapStart = null;
        pointers.delete(e.pointerId);
        gesture = null;
      });
      el.addEventListener("contextmenu", (e) => e.preventDefault());
      el.addEventListener("wheel", (e) => {
        focusTween = null;
        e.preventDefault();
        distance = THREE.MathUtils.clamp(distance * Math.exp(e.deltaY * 1e-3), 4.5, 85);
      }, { passive: false });
      el.addEventListener("dblclick", (nativeEvent) => {
        const e = window.sceneEvent(nativeEvent);
        clearTimeout(singleTapTimer);
        focusObject(e);
      });
      function resize() {
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, window.streetLowQuality ? 1 : 1.5, Math.sqrt((window.streetLowQuality ? 1e6 : 2e6) / (window.sceneViewport.width * window.sceneViewport.height))));
        camera.aspect = window.sceneViewport.width / window.sceneViewport.height;
        camera.updateProjectionMatrix();
        renderer.setSize(window.sceneViewport.width, window.sceneViewport.height);
      }
      addEventListener("resize", resize);
      addEventListener("sceneorientationchange", () => {
        resize();
        resizeClouds();
      });
      const dryAsphalt = texture(1024, 1024, (c, W, H) => {
        c.fillStyle = "#68777a";
        c.fillRect(0, 0, W, H);
        let seed2 = 441;
        for (let i = 0; i < 26e3; i++) {
          seed2 = seed2 * 1664525 + 1013904223 >>> 0;
          const x = seed2 / 4294967296 * W;
          seed2 = seed2 * 1664525 + 1013904223 >>> 0;
          const y = seed2 / 4294967296 * H;
          c.fillStyle = i % 2 ? "rgba(212,211,186,0.0824)" : "rgba(52,76,82,0.0941)";
          c.fillRect(x, y, 1.5, 1.5);
        }
      });
      const wetAsphalt = street.material.map, wetRoadColor = street.material.color.clone();
      const nightEmissives = [];
      mats.forEach((m) => {
        if (m.emissiveIntensity > 0) nightEmissives.push({ m, power: m.emissiveIntensity });
      });
      const pigeon = new THREE.Group();
      pigeon.position.set(2.36, 3.075, 1.56);
      pigeon.rotation.y = 0;
      pigeon.scale.set(0.64, 0.75, 0.7);
      pigeon.name = "sunny-awning-pigeon";
      world.add(pigeon);
      let pigeonReact = -100;
      function birdBall(x, y, z, sx, sy, sz, color, parent = pigeon) {
        const o = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), mat(color));
        o.position.set(x, y, z);
        o.scale.set(sx, sy, sz);
        o.castShadow = true;
        parent.add(o);
        return o;
      }
      birdBall(0, 0.29, -0.025, 0.14, 0.23, 0.26, 15855843);
      birdBall(0, 0.44, 0.085, 0.092, 0.17, 0.105, 14148063);
      const pigeonHead = new THREE.Group();
      pigeonHead.position.set(0, 0.565, 0.16);
      pigeon.add(pigeonHead);
      birdBall(0, 0, 0, 0.112, 0.12, 0.125, 16184296, pigeonHead);
      for (const side of [-1, 1]) {
        birdBall(side * 0.112, 0.012, 0.057, 0.017, 0.021, 0.018, 2308418, pigeonHead);
        birdBall(side * 0.12, 0.019, 0.066, 5e-3, 6e-3, 6e-3, 16777197, pigeonHead);
      }
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.032, 0.105, 5), mat(13147002));
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, -0.025, 0.156);
      pigeonHead.add(beak);
      birdBall(0, -4e-3, 0.112, 0.032, 0.021, 0.022, 15131350, pigeonHead);
      for (const side of [-1, 1]) {
        rod([side * 0.065, 0.02, 5e-3], [side * 0.065, 0.14, -0.01], 0.012, 13012600, pigeon);
        for (const dx of [-0.037, 0, 0.037]) rod([side * 0.065, 0.02, 5e-3], [side * 0.065 + dx, 0.015, 0.1], 9e-3, 13012600, pigeon);
      }
      for (let i = 0; i < 5; i++) {
        const tail2 = birdBall((i - 2) * 0.035, 0.17, -0.24, 0.032, 0.035, 0.17, i % 2 ? 14542048 : 15855328);
        tail2.rotation.x = 0.27;
        tail2.rotation.y = (i - 2) * 0.09;
      }
      const pigeonWings = [];
      for (const side of [-1, 1]) {
        const wing = new THREE.Group();
        wing.position.set(side * 0.115, 0.38, -0.015);
        wing.userData.side = side;
        pigeon.add(wing);
        birdBall(side * 0.025, -0.09, -0.015, 0.065, 0.18, 0.155, 15001824, wing);
        for (let i = 0; i < 5; i++) {
          const feather = birdBall(side * (0.02 + i * 8e-3), -0.13 - i * 0.013, -0.12 + i * 0.047, 0.027, 0.145 - i * 7e-3, 0.033, i % 2 ? 16118245 : 13950425, wing);
          feather.rotation.z = -side * 0.1;
        }
        pigeonWings.push(wing);
      }
      hitBox("pigeon", 0, 0.34, 0, 0.63, 0.76, 0.79, pigeon);
      pigeon.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "pigeon";
          if (!interactionTargets.includes(o)) interactionTargets.push(o);
        }
      });
      function initDayMusic() {
        musicGain = audioContext.createGain();
        musicGain.gain.value = isSunny ? 0.5 : 0;
        const soft = audioContext.createBiquadFilter();
        soft.type = "lowpass";
        soft.frequency.value = 850;
        soft.Q.value = 0.35;
        musicGain.connect(soft);
        soft.connect(audioMaster);
        const reverb = audioContext.createConvolver(), tail2 = audioContext.createGain();
        tail2.gain.value = 0.18;
        const buffer = audioContext.createBuffer(2, Math.floor(audioContext.sampleRate * 3.2), audioContext.sampleRate);
        let seed2 = 981;
        for (let c = 0; c < 2; c++) {
          const d = buffer.getChannelData(c);
          for (let i = 0; i < d.length; i++) {
            seed2 = seed2 * 1664525 + 1013904223 >>> 0;
            d[i] = (seed2 / 4294967296 * 2 - 1) * Math.pow(1 - i / d.length, 3) * 0.38;
          }
        }
        reverb.buffer = buffer;
        soft.connect(reverb);
        reverb.connect(tail2);
        tail2.connect(audioMaster);
        nextMusicNote = audioContext.currentTime + 0.15;
      }
      function musicVoice(midi, t, hold, volume, pad = false) {
        const ctx = audioContext, freq = 440 * Math.pow(2, (midi - 69) / 12), env = ctx.createGain(), pan = ctx.createStereoPanner();
        env.gain.setValueAtTime(1e-5, t);
        env.gain.linearRampToValueAtTime(volume, t + (pad ? 1.8 : 0.95));
        env.gain.linearRampToValueAtTime(volume * 0.72, t + hold * 0.62);
        env.gain.exponentialRampToValueAtTime(1e-5, t + hold);
        pan.pan.value = Math.sin(midi * 1.71) * 0.17;
        env.connect(pan);
        pan.connect(musicGain);
        const partials = [[1, 0.57, -2.5], [1, 0.43, 2.5], [2, 0.025, 0]];
        let remaining = partials.length;
        for (const [ratio, amount, detune] of partials) {
          const o = ctx.createOscillator(), level = ctx.createGain();
          o.type = "sine";
          o.frequency.value = freq * ratio;
          o.detune.value = detune;
          level.gain.value = amount;
          o.connect(level);
          level.connect(env);
          o.start(t);
          o.stop(t + hold + 0.06);
          o.onended = () => {
            o.disconnect();
            level.disconnect();
            if (--remaining === 0) {
              env.disconnect();
              pan.disconnect();
            }
          };
        }
        musicNoteCount++;
      }
      const dayMelody = [64, 67, 69, null, 67, 64, 62, null, 60, 64, 67, null, 65, 64, 60, null, 62, 65, 69, null, 67, 65, 62, null, 59, 62, 67, null, 65, 62, 60, null];
      const dayChords = [[48, 55, 59], [45, 52, 55], [41, 48, 52], [43, 50, 55]];
      function animateDayMusicAndTraffic() {
        if (!audioContext || audioContext.state !== "running") return;
        const now = audioContext.currentTime, open = signalPhase !== "walk";
        if (lastTrafficAudioOpen !== open || lastTrafficAudioSunny !== isSunny) {
          const wasOpen = lastTrafficAudioOpen;
          lastTrafficAudioOpen = open;
          lastTrafficAudioSunny = isSunny;
          for (const gain of [carAudioGain.gain, cityBedGain.gain]) {
            if (gain.cancelAndHoldAtTime) gain.cancelAndHoldAtTime(now);
            else {
              gain.cancelScheduledValues(now);
              gain.setValueAtTime(gain.value, now);
            }
          }
          if (open) {
            carAudioGain.gain.linearRampToValueAtTime(isSunny ? 0.24 : 1, now + 0.2);
            cityBedGain.gain.linearRampToValueAtTime(isSunny ? 4e-3 : 0.07, now + 0.2);
            if (!wasOpen) nextCar = now + 0.45;
          } else {
            carAudioGain.gain.linearRampToValueAtTime(0, now + 0.12);
            cityBedGain.gain.linearRampToValueAtTime(0, now + 0.12);
            for (const source of activePasses) {
              try {
                source.stop(now + 0.15);
              } catch (_) {
              }
            }
          }
        }
        if (isSunny && musicGain) {
          if (nextMusicNote < now - 0.4) nextMusicNote = now + 0.08;
          while (nextMusicNote < now + 0.22) {
            const step = musicStep % dayMelody.length, note = dayMelody[step];
            if (note !== null) musicVoice(note, nextMusicNote, 5.8, 0.03);
            if (step % 8 === 0) {
              for (const n of dayChords[Math.floor(step / 8) % 4]) musicVoice(n, nextMusicNote, 13.2, 8e-3, true);
            }
            nextMusicNote += 1.6;
            musicStep++;
          }
        }
      }
      function playPigeonSound(start) {
        if (!audioContext) return;
        const ctx = audioContext;
        for (const [offset, duration, pitch2, volume] of [[0, 0.19, 440, 0.08], [0.24, 0.28, 385, 0.095], [0.6, 0.31, 350, 0.072]]) {
          const at = start + offset, voice = ctx.createOscillator(), gain = ctx.createGain(), filter = ctx.createBiquadFilter();
          voice.setPeriodicWave(ctx.createPeriodicWave(new Float32Array(5), new Float32Array([0, 1, 0.48, 0.22, 0.085])));
          voice.frequency.setValueAtTime(pitch2 * 0.9, at);
          voice.frequency.exponentialRampToValueAtTime(pitch2, at + duration * 0.22);
          voice.frequency.exponentialRampToValueAtTime(pitch2 * 0.88, at + duration);
          filter.type = "lowpass";
          filter.frequency.value = 2400;
          filter.Q.value = 0.55;
          gain.gain.setValueAtTime(1e-4, at);
          gain.gain.exponentialRampToValueAtTime(volume, at + 0.035);
          gain.gain.exponentialRampToValueAtTime(volume * 0.7, at + duration * 0.5);
          gain.gain.exponentialRampToValueAtTime(1e-4, at + duration);
          voice.connect(filter);
          filter.connect(gain);
          gain.connect(audioMaster);
          voice.start(at);
          voice.stop(at + duration + 0.025);
          voice.onended = () => {
            voice.disconnect();
            filter.disconnect();
            gain.disconnect();
          };
        }
      }
      const weatherStyle = document.createElement("style");
      weatherStyle.textContent = '\nbody{transition:background 1s ease;background:radial-gradient(ellipse at 50% 43%,#384153 0%,#17263b 65%,#101c2e 100%)}\nbody[data-weather="sunny"]{background:radial-gradient(ellipse at 50% 40%,#f8f0d8 0%,#d7e8e8 56%,#a9cbd8 100%)}\n.weather-switch{position:fixed;right:24px;top:22px;z-index:3;display:flex;gap:4px;padding:5px;border:1px solid rgba(196,213,210,0.1490);border-radius:30px;background:rgba(20,35,54,0.5020);backdrop-filter:blur(14px);box-shadow:0 5px 20px rgba(9,20,35,0.0706);transition:background .8s,border-color .8s}\n.weather-switch button{display:grid;align-items:center;justify-items:center;width:39px;height:39px;padding:9px;border:0;border-radius:50%;background:transparent;color:#8ca4b0;cursor:pointer;transition:background .3s,color .3s,transform .2s}.weather-switch button:hover{transform:translateY(-1px);color:#f9e4b8}.weather-switch button[aria-pressed="true"]{background:rgba(197,222,220,0.1412);color:#dbece3}.weather-switch svg{width:21px;height:21px;pointer-events:none}.weather-switch button:focus{outline:2px solid #d3b371;outline-offset:3px}\nbody[data-weather="sunny"] .weather-switch{background:rgba(255,249,231,0.6588);border-color:rgba(122,155,155,0.1882)}body[data-weather="sunny"] .weather-switch button{color:#7e9da4}body[data-weather="sunny"] .weather-switch button[aria-pressed="true"]{background:rgba(230,197,127,0.2824);color:#ac8037}\n@media(max-width:520px){.weather-switch{top:14px;right:14px;padding:4px}.weather-switch button{width:36px;height:36px;padding:8px}}\n';
      window.streetAppendStyle(weatherStyle, "summer");
      const weatherButtons = document.createElement("div");
      weatherButtons.className = "weather-switch";
      weatherButtons.setAttribute("role", "group");
      weatherButtons.setAttribute("aria-label", "\u5207\u6362\u5929\u6C14");
      weatherButtons.innerHTML = '<button type="button" data-mode="rain" aria-label="\u96E8\u591C" title="\u96E8\u591C" aria-pressed="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.8C10 6.5 5.3 11 5.3 15.1a6.7 6.7 0 0 0 13.4 0C18.7 11 14 6.5 12 2.8Z"/><path d="M8.4 15.5a3.7 3.7 0 0 0 3.5 3.3"/></svg></button><button type="button" data-mode="sunny" aria-label="\u6674\u5929" title="\u6674\u5929" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4m0-14.2-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg></button>';
      sceneHost.appendChild(weatherButtons);
      function setWeather(sunny) {
        isSunny = sunny;
        sceneHost.dataset.weather = sunny ? "sunny" : "rain";
        weatherButtons.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === "sunny" === sunny)));
        rain.visible = !sunny;
        [...drips, ...trails, ...rings].forEach((d) => d.o.visible = !sunny);
        puddles.forEach((o) => o.visible = !sunny);
        wetGlows.forEach((o) => o.visible = !sunny);
        world.children.filter((o) => o.name === "traffic-light-reflection").forEach((o) => o.visible = true);
        serviceSpill.visible = !sunny;
        bikeReflection.visible = !sunny && bikeLightOn;
        carReflections.forEach((o) => o.visible = !sunny && carLightsOn);
        interactionRipples.forEach((r) => r.meshes.forEach((o) => o.visible = !sunny));
        weatherLabels.forEach((o) => {
          o.material.map = o.userData.weatherMaps[sunny ? 1 : 0];
          o.userData.text = o.userData.weatherTexts[sunny ? 1 : 0];
          o.material.needsUpdate = true;
        });
        vendingCans.forEach((can) => can.material.color.setHex(vendingPalette()[can.userData.slot]));
        drink.material.color.setHex(vendingPalette()[selectedCan]);
        umbrellaRack.visible = !sunny;
        sunnyFlowerRack.visible = sunny;
        cat.visible = !sunny;
        pigeon.visible = sunny;
        chimeSun.visible = sunny;
        chimeRain.visible = !sunny;
        street.material.map = sunny ? dryAsphalt : wetAsphalt;
        street.material.roughness = sunny ? 0.94 : 0.24;
        street.material.metalness = sunny ? 0.035 : 0.48;
        street.material.color.copy(sunny ? new THREE.Color(12963802) : wetRoadColor);
        street.material.needsUpdate = true;
        if (audioContext) {
          rainBedGain == null ? void 0 : rainBedGain.gain.setTargetAtTime(sunny ? 1e-4 : 0.018, audioContext.currentTime, 0.3);
          rainSwellGain == null ? void 0 : rainSwellGain.gain.setTargetAtTime(sunny ? 0 : 3e-3, audioContext.currentTime, 0.3);
          musicGain == null ? void 0 : musicGain.gain.setTargetAtTime(sunny ? 0.5 : 0, audioContext.currentTime, 0.65);
          nextMusicNote = audioContext.currentTime + 0.2;
          nextRainTap = audioContext.currentTime + 0.8;
          nextBird = audioContext.currentTime + 3;
        }
      }
      weatherButtons.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button) return;
        ensureAudio();
        setWeather(button.dataset.mode);
      });
      function animateWeather(t, dt) {
        animateDayMusicAndTraffic();
        weatherBlend = THREE.MathUtils.damp(weatherBlend, isSunny ? 1 : 0, 3.3, dt);
        const mix = weatherBlend;
        hemisphere.color.copy(new THREE.Color(15258806)).lerp(new THREE.Color(13429229), mix);
        hemisphere.groundColor.copy(new THREE.Color(3748936)).lerp(new THREE.Color(13089173), mix);
        hemisphere.intensity = 1.12 + mix * 1.05;
        moon.color.copy(new THREE.Color(11910868)).lerp(new THREE.Color(16770996), mix);
        moon.intensity = 1.12 + mix * 1.5;
        moon.position.set(-3 - mix * 1.5, 10, 5 - mix * 7);
        renderer.toneMappingExposure = 1.12 - mix * 0.09;
        shopLights.forEach((o, i) => o.intensity = o.userData.nightPower * (1 - mix * (i === 0 ? 0.77 : 1)));
        nightEmissives.forEach(({ m, power }) => m.emissiveIntensity = power * (1 - mix * 0.94));
        serviceLight.intensity = staffAmount * 3.4 * (1 - mix * 0.9);
        const age = t - pigeonReact, active = age >= 0 && age < 2.8, envelope = active ? Math.sin(Math.PI * age / 2.8) : 0;
        for (const wing of pigeonWings) wing.rotation.z = wing.userData.side * (0.1 + envelope * (0.68 + 0.65 * Math.sin(age * 17)));
        pigeon.position.y = 3.075 + envelope * Math.max(0, Math.sin(age * 17)) * 0.035;
        pigeonHead.rotation.y = Math.sin(t * 0.65) * 0.13 + envelope * 0.22;
        pigeonHead.rotation.x = Math.sin(t * 1.6) * 0.025;
        pigeon.scale.y = 0.75 * (1 + Math.sin(t * 2.2) * 5e-3);
        if (isSunny && audioContext && audioContext.state === "running" && audioContext.currentTime > nextBird) {
          const n = audioContext.currentTime + 0.02;
          tone(1800, n, 0.1, 8e-3);
          tone(2400, n + 0.14, 0.15, 6e-3);
          nextBird = n + 8 + Math.random() * 8;
        }
      }
      setWeather(false);
      const cookStove = new THREE.Group();
      cookStove.position.set(-2.4, 0.694, -3.23);
      cookStove.name = "pickup-window-cookstove";
      world.add(cookStove);
      box(0, 0.385, 0, 0.82, 0.77, 0.64, 11975077, true, 0, cookStove);
      box(0, 0.79, 0, 0.87, 0.055, 0.69, 14933187, true, 0, cookStove);
      box(0, 0.51, 0.329, 0.59, 0.4, 0.016, 8296080, true, 0, cookStove);
      box(0, 0.68, 0.35, 0.28, 0.023, 0.022, 11844003, true, 0, cookStove);
      for (const x of [-0.24, 0.24]) {
        const dial = cyl(x, 0.745, 0.351, 0.039, 0.025, 4677220, 12, cookStove);
        dial.rotation.x = Math.PI / 2;
      }
      const burner = new THREE.Mesh(new THREE.TorusGeometry(0.174, 0.015, 7, 32), mat(12160598, 0.6));
      burner.rotation.x = -Math.PI / 2;
      burner.position.y = 0.834;
      cookStove.add(burner);
      for (const a of [0, Math.PI / 2]) {
        const grate = box(0, 0.849, 0, 0.43, 0.018, 0.024, 4216411, true, 0, cookStove);
        grate.rotation.y = a;
      }
      const cookPot = new THREE.Group();
      cookPot.position.set(-2.4, 1.558, -3.23);
      cookPot.name = "simmering-vegetable-pot";
      world.add(cookPot);
      const cookProfile = [[0, 0], [0.174, 0], [0.202, 0.03], [0.202, 0.229], [0.19, 0.25], [0.174, 0.235], [0.174, 0.035], [0, 0.035]].map((p) => new THREE.Vector2(...p));
      const vessel = new THREE.Mesh(new THREE.LatheGeometry(cookProfile, 32), mat(7112072));
      vessel.castShadow = true;
      cookPot.add(vessel);
      const potRim = new THREE.Mesh(new THREE.TorusGeometry(0.188, 0.012, 8, 32), mat(12108726));
      potRim.rotation.x = Math.PI / 2;
      potRim.position.y = 0.242;
      cookPot.add(potRim);
      for (const x of [-0.245, 0.245]) box(x, 0.17, 0, 0.1, 0.045, 0.065, 4545885, true, 0, cookPot);
      const cookFood = new THREE.Group();
      cookFood.position.y = 0.205;
      cookPot.add(cookFood);
      const broth = new THREE.Mesh(new THREE.CircleGeometry(0.172, 32), mat(13210953));
      broth.rotation.x = -Math.PI / 2;
      cookFood.add(broth);
      for (let i = 0; i < 10; i++) {
        const a = i * 2.399, r = 0.04 + i % 3 * 0.035, food = birdBall(Math.cos(a) * r, 0.013, Math.sin(a) * r, 0.03, 0.017, 0.025, [13995096, 9284212, 15258775][i % 3], cookFood);
        food.rotation.y = a;
      }
      const cookingBubbles = [];
      for (let i = 0; i < 5; i++) {
        const bubble = birdBall(Math.cos(i * 2.4) * 0.1, 8e-3, Math.sin(i * 2.4) * 0.1, 0.013, 9e-3, 0.013, 15058826, cookFood);
        cookingBubbles.push(bubble);
      }
      const cookLid = new THREE.Group();
      cookLid.position.set(-0.207, 0.255, 0);
      cookPot.add(cookLid);
      const lid = cyl(0.207, 8e-3, 0, 0.211, 0.038, 8559255, 32, cookLid);
      const lidCap = birdBall(0.207, 0.027, 0, 0.198, 0.046, 0.198, 9676704, cookLid);
      cyl(0.207, 0.081, 0, 0.037, 0.046, 4545885, 12, cookLid);
      let cookLidTarget = 0, cookLidAmount = 0;
      const cookSteam = [];
      for (let i = 0; i < 4; i++) {
        const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: vaporTexture, transparent: true, opacity: 0, depthWrite: false }));
        world.add(p);
        cookSteam.push(p);
      }
      cookPot.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "cookpot";
          interactionTargets.push(o);
        }
      });
      hitBox("cookpot", 0, 0.22, 0, 0.53, 0.45, 0.53, cookPot);
      function animateCookpot(t, dt) {
        cookLidAmount = THREE.MathUtils.damp(cookLidAmount, cookLidTarget, 5, dt);
        const jiggleAge = t - cookJiggleAt;
        const jiggle = jiggleAge >= 0 && jiggleAge < 0.65 ? Math.sin(jiggleAge * 29) * Math.exp(-jiggleAge * 6) * 0.045 : 0;
        cookLid.rotation.x = 0;
        cookLid.rotation.z = cookLidAmount * 1.75 + jiggle;
        cookingBubbles.forEach((o, i) => {
          const a = (t * 0.65 + i * 0.23) % 1;
          const size = 0.4 + Math.sin(a * Math.PI) * 0.65;
          o.scale.set(0.013 * size, 9e-3 * size, 0.013 * size);
          o.position.y = 9e-3 + Math.sin(a * Math.PI) * 0.015;
        });
        cookSteam.forEach((o, i) => {
          const a = (t * 0.36 + i * 0.25) % 1;
          o.position.set(-2.4 + Math.sin(a * 6 + i) * 0.045, 1.82 + a * 0.58, -3.23 + Math.cos(a * 5 + i) * 0.04);
          o.scale.setScalar(0.05 + a * 0.18);
          o.material.opacity = Math.sin(a * Math.PI) * 0.2 * cookLidAmount;
        });
      }
      const dog = new THREE.Group();
      dog.position.set(-0.2, 0.524, -5.05);
      dog.rotation.y = Math.PI / 2;
      dog.name = "sleeping-alley-dog";
      world.add(dog);
      birdBall(0, 0.17, -0.07, 0.27, 0.15, 0.4, 13280379, dog);
      birdBall(0, 0.13, 0.25, 0.19, 0.09, 0.23, 15059879, dog);
      for (const x of [-0.13, 0.13]) birdBall(x, 0.045, 0.39, 0.07, 0.04, 0.17, 15325112, dog);
      const dogHead = new THREE.Group();
      dogHead.position.set(0, 0.23, 0.29);
      dog.add(dogHead);
      birdBall(0, 0, 0, 0.17, 0.15, 0.17, 14268561, dogHead);
      birdBall(0, -0.065, 0.14, 0.11, 0.07, 0.11, 15785924, dogHead);
      birdBall(0, -0.035, 0.23, 0.044, 0.029, 0.024, 4477003, dogHead);
      for (const side of [-1, 1]) {
        const ear = birdBall(side * 0.15, -0.04, -0.025, 0.06, 0.13, 0.1, 10057304, dogHead);
        ear.rotation.z = side * 0.18;
        line([[side * 0.062, 0.018, 0.151], [side * 0.095, 0.012, 0.142], [side * 0.12, 0.02, 0.12]], 5131842, 1, dogHead);
      }
      const dogEyes = [];
      for (const side of [-1, 1]) {
        const eye = birdBall(side * 0.085, 0.018, 0.147, 0.017, 0.02, 0.01, 3688256, dogHead);
        eye.visible = false;
        dogEyes.push(eye);
      }
      const dogTail = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.045, 8, 20, Math.PI * 1.4), mat(11635559));
      dogTail.rotation.x = Math.PI / 2;
      dogTail.position.set(0.16, 0.12, -0.39);
      dog.add(dogTail);
      hitBox("dog", 0, 0.17, 0, 0.65, 0.42, 1.1, dog);
      const preparingNote = plaque(-2.4, 1.91, -4.075, 0.52, 0.26, "\u6E96\u5099\u4E2D", "#f3e5c4", "#637e6e", 80);
      preparingNote.rotation.y = Math.PI;
      preparingNote.material.transparent = true;
      preparingNote.visible = false;
      preparingNote.userData.action = "takeout";
      interactionTargets.push(preparingNote);
      const moreStyle = document.createElement("style");
      moreStyle.textContent = '\nbody[data-weather="sunny"]{background:radial-gradient(ellipse at 50% 35%,#e5f0dd 0%,#9ad4ee 48%,#66b1da 100%)}body[data-weather="dusk"]{background:radial-gradient(ellipse at 23% 60%,#fbd6a2 0%,#d8a8a1 45%,#8f91ad 100%)}\n.scene-clock{position:fixed;left:25px;top:23px;padding:9px 14px;border:1px solid rgba(196,213,210,0.1490);border-radius:12px;background:rgba(20,35,54,0.4196);backdrop-filter:blur(12px);z-index:3;color:rgba(208,219,209,0.7020);font:13px/1.6 Georgia,\'Yu Mincho\',\'Microsoft YaHei\',serif;letter-spacing:.09em;pointer-events:none;font-variant-numeric:tabular-nums}body[data-weather="sunny"] .scene-clock{color:rgba(82,110,115,0.7882);background:rgba(255,248,227,0.6000);border-color:rgba(120,152,155,0.1882)}body[data-weather="dusk"] .scene-clock{color:rgba(108,85,92,0.7686);background:rgba(252,230,198,0.5059);border-color:rgba(120,92,105,0.1490)}\nbody[data-weather="dusk"] .weather-switch{background:rgba(251,226,191,0.5333);border-color:rgba(120,92,105,0.1882)}body[data-weather="dusk"] .weather-switch button{color:#8c737b}body[data-weather="dusk"] .weather-switch button[aria-pressed="true"]{color:#976b3c;background:rgba(232,191,129,0.2392)}\n.personal-label{display:block;margin:22px 0 8px;color:#7c8e7e;font-size:14px}.personal-message{display:block;box-sizing:border-box;width:100%;resize:vertical;border:1px solid #d9ccb0;border-radius:2px;background:rgba(255,248,232,0.3608);color:#756d5b;padding:12px 14px;font:14px/1.9 Georgia,\'Songti SC\',SimSun,serif;outline:none}.personal-message:focus{border-color:#9cab94}.personal-message::placeholder{color:#b3a88d}\n.photo-button{position:fixed;right:25px;bottom:23px;z-index:3;width:45px;height:45px;border-radius:50%;border:1px solid rgba(196,213,210,0.1490);background:rgba(20,35,54,0.5020);color:#d4e2d8;display:grid;align-items:center;justify-items:center;cursor:pointer;backdrop-filter:blur(12px);transition:transform .2s,background .4s}.photo-button:hover{transform:translateY(-2px)}.photo-button svg{width:22px;height:22px}.photo-button:focus{outline:2px solid #d3b371;outline-offset:3px}body[data-weather="sunny"] .photo-button,body[data-weather="dusk"] .photo-button{background:rgba(255,246,223,0.6000);color:#7b8270;border-color:rgba(139,157,139,0.2000)}.photo-button[data-done="true"]{background:#a1b99f;color:#fff8de}\n@media(max-width:520px){.scene-clock{left:14px;top:18px;padding:7px 10px;font-size:10px;letter-spacing:.015em;max-width:calc(calc(var(--street-vw) * 100) - 160px)}.photo-button{right:15px;bottom:16px;width:40px;height:40px}.weather-switch button{width:32px;height:34px}}\n';
      window.streetAppendStyle(moreStyle, "summer");
      const duskButton = document.createElement("button");
      duskButton.type = "button";
      duskButton.dataset.mode = "dusk";
      duskButton.setAttribute("aria-label", "\u96E8\u540E\u9EC4\u660F");
      duskButton.setAttribute("title", "\u96E8\u540E\u9EC4\u660F");
      duskButton.setAttribute("aria-pressed", "false");
      duskButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M3 16h18M5 20h14M7 16a5 5 0 0 1 10 0M12 3v3M4 8l2 2m14-2-2 2"/></svg>';
      weatherButtons.appendChild(duskButton);
      let clockIs12 = false;
      const clockSignMaps = [sideSign.material.map, texture(512, 512, (c, W, H) => {
        c.fillStyle = "#e8e2bf";
        c.fillRect(0, 0, W, H);
        c.fillStyle = "#388d80";
        c.font = "700 175px sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("12 H", W / 2, H / 2);
      })];
      sideSign.userData.action = "clockMode";
      interactionTargets.push(sideSign);
      hitBox("clockMode", -4.79, 2.71, -0.32, 0.18, 0.82, 0.83);
      function setClockMode(value) {
        clockIs12 = !!value;
        sideSign.material.map = clockSignMaps[clockIs12 ? 1 : 0];
        sideSign.material.needsUpdate = true;
        sideSign.userData.text = clockIs12 ? "12 H" : "24 H";
        updateClock();
      }
      const clock = document.createElement("time");
      clock.className = "scene-clock";
      clock.setAttribute("aria-label", "\u5F53\u524D\u65E5\u671F\u548C\u65F6\u95F4");
      sceneHost.appendChild(clock);
      function updateClock() {
        const d = /* @__PURE__ */ new Date(), pad = (n) => String(n).padStart(2, "0");
        clock.textContent = "".concat(d.getFullYear(), "\u5E74").concat(pad(d.getMonth() + 1), "\u6708").concat(pad(d.getDate()), "\u65E5 ").concat(clockIs12 ? (d.getHours() < 12 ? "\u4E0A\u5348 " : "\u4E0B\u5348 ") + pad(d.getHours() % 12 || 12) : pad(d.getHours()), ":").concat(pad(d.getMinutes()));
        clock.dateTime = d.toISOString();
      }
      updateClock();
      let clockTimer = setInterval(updateClock, 1e3);
      document.addEventListener("visibilitychange", () => {
        clearInterval(clockTimer);
        if (!document.hidden) clockTimer = setInterval(updateClock, 1e3);
      });
      const personalMessage = letterDialog.querySelector("#personal-message");
      window.bindStreetMessage(personalMessage);
      for (const label2 of weatherLabels) {
        const rainText = label2.userData.weatherTexts[0], text = rainText === "\u590F\u306E\u591C" ? "\u5915\u6620\u3048" : rainText === "\u8857\u89D2\u4FBF\u308A" ? "\u5915\u66AE\u308C\u4FBF\u308A" : "\u3072\u3068\u4F11\u307F";
        const g = label2.geometry.parameters, temp = plaque(0, 0, 0, g.width, g.height, text, "#d7c2a0", "#657a71", 80);
        world.remove(temp);
        temp.geometry.dispose();
        temp.material.dispose();
        label2.userData.weatherTexts[2] = text;
        label2.userData.weatherMaps[2] = temp.material.map;
      }
      const roofMistTexture = texture(128, 128, (c, W, H) => {
        const g = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
        g.addColorStop(0, "rgba(255,255,251,.95)");
        g.addColorStop(0.38, "rgba(255,255,251,.60)");
        g.addColorStop(1, "rgba(255,255,251,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      let smokeBurstAt = -100;
      const roofMist = [];
      for (let i = 0; i < 28; i++) {
        const o = new THREE.Sprite(new THREE.SpriteMaterial({ map: roofMistTexture, transparent: true, opacity: 0, depthWrite: false, color: 16119021 }));
        o.name = i < 8 ? "ambient-rooftop-mist" : "clicked-rooftop-mist";
        world.add(o);
        roofMist.push(o);
      }
      roofExhaust.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "exhaust";
          interactionTargets.push(o);
        }
      });
      hitBox("exhaust", -2.85, 4.24, -2.62, 1.36, 0.74, 0.94);
      function animateRoofMist(t) {
        roofMist.forEach((o, i) => {
          const burst = i >= 8, j = burst ? i - 8 : i, age = burst ? (t - smokeBurstAt - j * 0.055) / 3.1 : (t % 7.6 - j % 4 * 0.42) / 3.8;
          const active = age >= 0 && age < 1;
          o.visible = active;
          if (active) {
            o.position.set((j % 2 ? -3.14 : -2.56) + age * (burst ? 0.3 : 0.2) + Math.sin(age * 4 + j) * 0.04, 4.48 + age * (burst ? 1.35 : 0.95), -2.62 - Math.sin(age * 3 + j) * 0.1);
            o.scale.setScalar((burst ? 0.16 : 0.12) + age * (burst ? 0.8 : 0.54));
            o.material.opacity = Math.sin(age * Math.PI) * (burst ? 0.4 : isSunny ? 0.23 : 0.28);
            o.material.rotation = Math.sin(t * 0.5 + j) * 0.18;
          }
        });
      }
      for (const u of umbrellas) {
        u.traverse((o) => {
          if (o.isMesh) {
            o.userData.action = "umbrella";
            o.userData.umbrella = u;
            interactionTargets.push(o);
          }
        });
        const hit = hitBox("umbrella", 0.07 + u.userData.index * 0.16, 1.1, 1.8, 0.14, 0.86, 0.15, u);
        hit.userData.umbrella = u;
      }
      const pinwheelStand = new THREE.Group();
      pinwheelStand.name = "twilight-paper-pinwheels";
      world.add(pinwheelStand);
      box(0.345, 0.575, 1.05, 0.92, 0.1, 0.28, 10193004, true, 0, pinwheelStand);
      box(0.345, 0.63, 1.05, 0.83, 0.015, 0.2, 7241836, false, 0, pinwheelStand);
      const pinwheels = [];
      for (let i = 0; i < 3; i++) {
        const g = new THREE.Group();
        g.position.set(0.05 + i * 0.295, 1.17, 1.05);
        g.userData.boostAt = -100;
        g.userData.gustAt = -100;
        g.userData.nextGust = performance.now() / 1e3 + 2 + i * 2;
        g.userData.speed = 0;
        g.name = "clickable-paper-pinwheel";
        pinwheelStand.add(g);
        rod([0, -0.54, 0], [0, 0, 0], 0.01, 11246972, g);
        const rotor = new THREE.Group();
        g.add(rotor);
        g.userData.rotor = rotor;
        for (let j = 0; j < 4; j++) {
          const blade = new THREE.Shape();
          blade.moveTo(0.012, 0.012);
          blade.lineTo(0.024, 0.14);
          blade.quadraticCurveTo(0.11, 0.15, 0.135, 0.06);
          blade.lineTo(0.043, 0.035);
          blade.closePath();
          const mesh = new THREE.Mesh(new THREE.ShapeGeometry(blade), new THREE.MeshToonMaterial({ color: [[13938040, 14141856], [12358294, 14727082], [9546400, 13026720]][i][j % 2], gradientMap: gradient, side: THREE.DoubleSide }));
          mesh.rotation.z = j * Math.PI / 2;
          mesh.castShadow = true;
          rotor.add(mesh);
          const fold = line([[0.015, 0.015, 3e-3], [0.115, 0.09, 3e-3]], 9010796, 1, rotor);
          fold.rotation.z = j * Math.PI / 2;
        }
        const hub = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), mat(15324846));
        hub.position.z = 0.014;
        rotor.add(hub);
        pinwheels.push(g);
        g.traverse((o) => {
          if (o.isMesh) {
            o.userData.action = "pinwheel";
            o.userData.pinwheel = g;
            interactionTargets.push(o);
          }
        });
        const hit = hitBox("pinwheel", 0, 0, 0, 0.32, 0.32, 0.12, g);
        hit.userData.pinwheel = g;
      }
      function animateFrontDiscoveries(t, dt) {
        umbrellas.forEach((u) => u.position.y = THREE.MathUtils.damp(u.position.y, u.userData.raised ? 0.46 : 0, 7, dt));
        for (const p of pinwheels) {
          const u = p.userData;
          if (t >= u.nextGust) {
            u.gustAt = t;
            u.gustDuration = 2.4 + Math.random() * 2.1;
            u.gustStrength = 0.8 + Math.random() * 1.4;
            u.nextGust = t + 6 + Math.random() * 8;
          }
          const age = t - u.gustAt, wind = age >= 0 && age < u.gustDuration ? Math.sin(age / u.gustDuration * Math.PI) * u.gustStrength : 0;
          u.speed = THREE.MathUtils.damp(u.speed, wind, 3, dt);
          const burst = Math.pow(Math.max(0, 1 - (t - u.boostAt) / 3.6), 2) * 25;
          u.rotor.rotation.z -= dt * (u.speed + burst);
        }
      }
      const originalSetWeather = setWeather;
      setWeather = function(mode) {
        var _a2;
        const m = typeof mode === "boolean" ? mode ? "sunny" : "rain" : mode;
        weatherMode = m;
        isDusk = m === "dusk";
        originalSetWeather(m === "sunny");
        sceneHost.dataset.weather = m;
        weatherButtons.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mode === m)));
        dog.visible = isDusk;
        pinwheelStand.visible = isDusk;
        sunnyFlowerRack.visible = isSunny;
        if (isDusk) weatherLabels.forEach((o) => {
          o.material.map = o.userData.weatherMaps[2];
          o.userData.text = o.userData.weatherTexts[2];
          o.material.needsUpdate = true;
        });
        if (isDusk) {
          rain.visible = false;
          cat.visible = false;
          pigeon.visible = false;
          chimeRain.visible = true;
          chimeSun.visible = false;
          drips.forEach((d, i) => d.o.visible = i < 2);
          rings.forEach((d) => d.o.visible = false);
          trails.forEach((d) => d.o.visible = false);
          umbrellaRack.visible = false;
          sunnyFlowerRack.visible = false;
          signalPhase = "dusk";
          walkGreen = false;
          pawPrints.forEach((o) => {
            o.visible = false;
            o.material.opacity = 0;
          });
          if (audioContext) {
            rainBedGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.3);
            rainSwellGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.3);
          }
          nextCar = ((_a2 = audioContext == null ? void 0 : audioContext.currentTime) != null ? _a2 : 0) + 4;
        } else {
          enterSignalPhase("walk", performance.now() / 1e3);
        }
        world.children.filter((o) => o.name === "traffic-light-reflection").forEach((o, i) => o.visible = !isDusk || i % 2 === 0);
      };
      function animateDuskTraffic(t, dt) {
        for (const m of trafficMaterials) {
          const u = m.uniforms;
          u.head.value = THREE.MathUtils.euclideanModulo(u.head.value + u.speed.value * dt * 0.55, 1);
          u.alpha.value = 0.65;
          u.motion.value = 0.4;
        }
        for (const lamps of vehicleFaces) {
          lamps[0].material.color.setHex(15961486).multiplyScalar(0.08);
          lamps[1].material.color.setHex(15779961);
          lamps[2].material.color.setHex(8314816).multiplyScalar(0.08);
        }
        for (const pair of pedestrianFaces) {
          pair[0].material.color.setHex(8314816).multiplyScalar(0.08);
          pair[1].material.color.setHex(15961486);
        }
        pawPrints.forEach((o) => {
          o.visible = false;
          o.material.opacity = 0;
        });
      }
      let savedFocusView = null;
      function focusObject(e) {
        if (savedFocusView) {
          const back = savedFocusView;
          savedFocusView = null;
          const shortest = Math.atan2(Math.sin(back.yaw - yaw), Math.cos(back.yaw - yaw));
          focusTween = { start: performance.now() / 1e3, from: target.clone(), to: back.target.clone(), fromDistance: distance, distance: back.distance, fromYaw: yaw, yaw: yaw + shortest, fromPitch: pitch, pitch: back.pitch };
          vy = vp = 0;
          return;
        }
        const hit = pickScene(e), action = hit == null ? void 0 : hit.object.userData.action;
        if (!action || action === "puddle") return;
        const map = { carLights: parkedCar, carDoor: parkedCar, chime, coffee: coffeeCup, cat, pigeon, dog, bike, postbox, letter: postbox, staff: staffHinge, takeout: takeoutGroup, cookpot: cookPot, umbrella: hit == null ? void 0 : hit.object.userData.umbrella, pinwheel: hit == null ? void 0 : hit.object.userData.pinwheel, flower: hit == null ? void 0 : hit.object.userData.flower };
        const object = map[action];
        savedFocusView = { target: target.clone(), distance, yaw, pitch };
        let to = hit.point.clone(), d = 6;
        if (object) {
          const sphere = new THREE.Box3().setFromObject(object).getBoundingSphere(new THREE.Sphere());
          to = sphere.center;
          d = THREE.MathUtils.clamp(sphere.radius * 3.7, 4.5, 10.5);
        }
        focusTween = { start: performance.now() / 1e3, from: target.clone(), to, fromDistance: distance, distance: d, fromYaw: yaw, yaw, fromPitch: pitch, pitch: 0.43 };
        vy = vp = 0;
      }
      function updateFocus(t) {
        if (!focusTween) return;
        const f = focusTween, p = THREE.MathUtils.clamp((t - f.start) / 1.15, 0, 1), k = 1 - Math.pow(1 - p, 3);
        target.lerpVectors(f.from, f.to, k);
        distance = THREE.MathUtils.lerp(f.fromDistance, f.distance, k);
        yaw = THREE.MathUtils.lerp(f.fromYaw, f.yaw, k);
        pitch = THREE.MathUtils.lerp(f.fromPitch, f.pitch, k);
        if (p === 1) focusTween = null;
      }
      function animateDiscoveries(t, dt) {
        animateEdgeDecorations();
        animateFrontDiscoveries(t, dt);
        animateAir(t);
        animateRoofMist(t);
        animateCookpot(t, dt);
        pickupHit.visible = takeoutAmount < 0.8;
        if (isSunny) {
          hemisphere.intensity = 2.25;
          hemisphere.color.setHex(14215660);
          hemisphere.groundColor.setHex(13812385);
          moon.intensity = 2.35;
          moon.color.setHex(16769965);
          renderer.toneMappingExposure = 1.02;
        }
        if (isDusk) {
          hemisphere.intensity = 1.12;
          hemisphere.color.setHex(15517111);
          hemisphere.groundColor.setHex(7627379);
          moon.position.set(-9, 3.5, 5);
          moon.color.setHex(16759144);
          moon.intensity = 2.1;
          renderer.toneMappingExposure = 1.06;
          shopLights.forEach((o, i) => o.intensity = o.userData.nightPower * (i < 2 ? 0.68 : 0.48));
          nightEmissives.forEach(({ m, power }) => m.emissiveIntensity = power * 0.7);
        }
        const look = Math.max(0, 1 - (t - frontCuriosity) / 3);
        if (cat.visible) {
          const sleepPhase = t % 29, sleep = sleepPhase > 19 ? Math.sin((sleepPhase - 19) / 10 * Math.PI) : 0;
          catHead.rotation.x += sleep * 0.34 - look * 0.12;
          catHead.rotation.z += sleep * 0.13;
          catHead.rotation.y += look * 0.4;
          if (sleep > 0.4) catEyes.forEach((o) => o.scale.y = 4e-3);
        }
        if (pigeon.visible) {
          const phase = t % 27, preen = phase > 20 ? Math.sin((phase - 20) / 7 * Math.PI) : 0;
          pigeonHead.rotation.x += preen * 0.7 + look * 0.12;
          pigeonHead.rotation.y -= preen * 0.7 + look * 0.35;
        }
        const a = t - dogCuriosity, e = a >= 0 && a < 3.5 ? Math.sin(a / 3.5 * Math.PI) : 0;
        dogEyes.forEach((o) => o.visible = e > 0.1);
        dogHead.rotation.x = -e * 0.38;
        dogHead.rotation.y = -e * 0.3;
        dog.scale.y = 1 + Math.sin(t * 1.6) * 9e-3;
        dogTail.rotation.z = e * Math.sin(a * 5) * 0.12;
      }
      const photoButton = document.createElement("button");
      photoButton.className = "photo-button";
      photoButton.type = "button";
      photoButton.setAttribute("aria-label", "\u4FDD\u5B58\u7EAA\u5FF5\u660E\u4FE1\u7247");
      photoButton.title = "\u4FDD\u5B58\u7EAA\u5FF5\u660E\u4FE1\u7247";
      photoButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" aria-hidden="true"><path d="M8 6l1.5-2h5L16 6h4v14H4V6Z"/><circle cx="12" cy="12.8" r="4"/></svg>';
      sceneHost.appendChild(photoButton);
      async function createPostcard() {
        renderer.render(scene, camera);
        const cv = document.createElement("canvas"), W = 1800, margin = 44, imageW = W - margin * 2, imageH = Math.round(imageW * window.sceneViewport.height / window.sceneViewport.width);
        cv.width = W;
        cv.height = imageH + margin + 145;
        const c = cv.getContext("2d");
        c.fillStyle = "#f6efdf";
        c.fillRect(0, 0, cv.width, cv.height);
        const colors = weatherMode === "sunny" ? ["#e5f0dd", "#9ad4ee", "#66b1da"] : isDusk ? ["#fbd6a2", "#d8a8a1", "#8f91ad"] : ["#384153", "#17263b", "#101c2e"];
        const g = c.createRadialGradient(W * 0.5, imageH * 0.4, 0, W * 0.5, imageH * 0.4, W * 0.7);
        g.addColorStop(0, colors[0]);
        g.addColorStop(0.6, colors[1]);
        g.addColorStop(1, colors[2]);
        c.fillStyle = g;
        c.fillRect(margin, margin, imageW, imageH);
        paintClouds(cloudCanvas.getContext("2d"), cloudCanvas.width, cloudCanvas.height, performance.now() / 1e3);
        c.drawImage(cloudCanvas, margin, margin, imageW, imageH);
        c.drawImage(renderer.domElement, margin, margin, imageW, imageH);
        c.fillStyle = "#899486";
        c.font = '24px Georgia,"Microsoft YaHei",serif';
        c.textAlign = "right";
        c.fillText(isCyberEdition ? "\u96EA\u4E61\u5C0F\u4ED3\u4E70 \xB7 2026\xB710" : "\u661F\u6708\u901A\u308A \xB7 2026\xB710", W - margin, cv.height - 45);
        c.textAlign = "left";
        c.font = '18px Georgia,"Microsoft YaHei",serif';
        c.fillStyle = "#aa9c85";
        c.fillText({ rain: "\u96E8\u591C", sunny: "\u6674\u663C", dusk: "\u9EC4\u660F", snow: "\u5C71\u6751\u7EB3\u51C9\u591C" }[weatherMode], margin, cv.height - 45);
        drawScenePostmark(c, W - 94, cv.height - 102, weatherMode);
        return new Promise((resolve) => cv.toBlob(resolve, "image/png"));
      }
      const postcardStyle = document.createElement("style");
      postcardStyle.textContent = '\n.postcard-preview{border:1px solid #d0c4a9;border-radius:18px;padding:20px;background:#f5efdf;color:#625e51;box-shadow:0 24px 90px rgba(0,0,0,0.4000);width:880px;max-width:calc(calc(var(--street-vw) * 100) - 48px);max-height:calc(calc(var(--street-vh) * 100) - 48px);box-sizing:border-box;overflow:auto;font:14px/1.5 Georgia,\'Microsoft YaHei\',serif}\n.postcard-preview::backdrop{background:rgba(11,23,42,0.7686);backdrop-filter:blur(5px)}\n.postcard-preview h2{margin:0 0 12px;font-size:17px;font-weight:400;letter-spacing:.12em}\n.postcard-preview img{display:block;max-width:100%;max-height:calc(calc(var(--street-vh) * 100) - 190px);width:auto;height:auto;margin:0 auto;object-fit:contain;border-radius:3px}\n.postcard-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:16px}\n.postcard-actions button{min-height:44px;padding:8px 18px;border:1px solid rgba(168,157,130,0.2431);border-radius:10px;background:#e4dcc6;color:inherit;font:inherit;cursor:pointer}\n.postcard-actions button:last-child{background:#667c72;color:#fffaf0}\n.postcard-preview[data-cyber="true"]{background:rgba(16,31,48,0.9216);color:#b8e4e7;border-color:rgba(116,207,219,0.4588);box-shadow:0 0 40px rgba(75,159,171,0.1686)}\n.postcard-preview[data-cyber="true"] button{background:#234254;color:#c8f1f3;border-color:rgba(115,180,202,0.3333)}\n';
      window.streetAppendStyle(postcardStyle, "summer");
      const postcardPreview = document.createElement("dialog");
      postcardPreview.className = "postcard-preview";
      postcardPreview.dataset.cyber = String(isCyberEdition);
      postcardPreview.setAttribute("aria-label", "\u660E\u4FE1\u7247\u9884\u89C8");
      const postcardTitle = document.createElement("h2");
      postcardTitle.textContent = "\u660E\u4FE1\u7247\u9884\u89C8";
      postcardPreview.appendChild(postcardTitle);
      const postcardImage = document.createElement("img");
      postcardImage.alt = "\u5F53\u524D\u89D2\u5EA6\u4E0E\u5929\u6C14\u7684\u661F\u6708\u8857\u89D2\u7EAA\u5FF5\u660E\u4FE1\u7247";
      postcardPreview.appendChild(postcardImage);
      const postcardActions = document.createElement("div");
      postcardActions.className = "postcard-actions";
      postcardPreview.appendChild(postcardActions);
      const postcardBack = document.createElement("button");
      postcardBack.type = "button";
      postcardBack.textContent = "\u8FD4\u56DE\u8857\u89D2";
      postcardActions.appendChild(postcardBack);
      const postcardDownload = document.createElement("button");
      postcardDownload.type = "button";
      postcardDownload.textContent = "\u4E0B\u8F7D\u660E\u4FE1\u7247";
      postcardActions.appendChild(postcardDownload);
      sceneHost.appendChild(postcardPreview);
      {
        const overlay = document.createElement("div");
        overlay.className = "landscape-letter-backdrop";
        overlay.hidden = true;
        sceneHost.appendChild(overlay);
        overlay.addEventListener("click", closePostcardPreview);
        postcardPreview.showModal = function() {
          this.setAttribute("open", "");
          overlay.hidden = false;
          document.getElementById("street-modes").style.pointerEvents = "none";
        };
        postcardPreview.close = function() {
          this.removeAttribute("open");
          overlay.hidden = true;
          document.getElementById("street-modes").style.pointerEvents = "";
          this.dispatchEvent(new Event("close"));
        };
      }
      let postcardBlob = null, postcardURL = null, postcardFilename = "", postcardCaptureId = 0;
      function releasePostcard() {
        if (postcardURL) URL.revokeObjectURL(postcardURL);
        postcardURL = null;
        postcardBlob = null;
        postcardImage.src = "";
      }
      function closePostcardPreview() {
        postcardCaptureId++;
        if (postcardPreview.open) postcardPreview.close();
        releasePostcard();
      }
      async function previewPostcard() {
        const capture = ++postcardCaptureId, mode = weatherMode;
        photoButton.disabled = true;
        try {
          const blob = await createPostcard();
          if (capture !== postcardCaptureId || mode !== weatherMode) return;
          if (!blob) throw Error("Unable to create postcard");
          releasePostcard();
          postcardBlob = blob;
          postcardURL = URL.createObjectURL(blob);
          postcardFilename = "\u661F\u6708\u901A\u308A-".concat(mode, "-\u660E\u4FE1\u7247.png");
          postcardImage.src = postcardURL;
          postcardPreview.showModal();
          postcardDownload.focus();
        } finally {
          photoButton.disabled = false;
        }
      }
      postcardBack.addEventListener("click", closePostcardPreview);
      postcardPreview.addEventListener("close", () => {
        if (!postcardPreview.open) releasePostcard();
      });
      postcardPreview.addEventListener("click", (e) => {
        if (e.target === postcardPreview) {
          const r = postcardPreview.getBoundingClientRect();
          if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closePostcardPreview();
        }
      });
      postcardDownload.textContent = "\u4FDD\u5B58\u5230\u76F8\u518C";
      postcardDownload.addEventListener("click", async () => {
        if (!postcardBlob || postcardDownload.disabled) return;
        postcardDownload.disabled = true;
        try {
          await window.saveStreetPostcard(postcardBlob);
          postcardDownload.textContent = "\u5DF2\u4FDD\u5B58\u5230\u76F8\u518C";
          photoButton.dataset.done = "true";
          setTimeout(() => {
            postcardDownload.textContent = "\u4FDD\u5B58\u5230\u76F8\u518C";
            delete photoButton.dataset.done;
          }, 1800);
        } catch (e) {
          alert("\u660E\u4FE1\u7247\u672A\u4FDD\u5B58\uFF0C\u8BF7\u5728\u5C0F\u5DE5\u5177\u4E2D\u6388\u6743\u76F8\u518C\u540E\u91CD\u8BD5\u3002");
        } finally {
          postcardDownload.disabled = false;
        }
      });
      photoButton.addEventListener("click", async () => {
        try {
          await previewPostcard();
        } catch (error) {
          console.warn("Postcard preview failed", error);
        }
      });
      setWeather("rain");
      const airLeaves = [];
      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, -0.15);
      leafShape.bezierCurveTo(-0.14, -0.06, -0.1, 0.1, 0, 0.17);
      leafShape.bezierCurveTo(0.1, 0.07, 0.12, -0.07, 0, -0.15);
      const leafGeometry = new THREE.ShapeGeometry(leafShape);
      for (let i = 0; i < 5; i++) {
        const g = new THREE.Group();
        g.name = "sunny-drifting-leaf";
        const leaf = new THREE.Mesh(leafGeometry, new THREE.MeshToonMaterial({ color: [11054707, 13086067, 9347451, 11973756, 11188365][i], gradientMap: gradient, side: THREE.DoubleSide, transparent: true, opacity: 0, depthWrite: false }));
        g.add(leaf);
        const vein = line([[0, -0.12, 2e-3], [0, 0.13, 2e-3]], 8227940, 1, g);
        vein.material.depthWrite = false;
        g.scale.setScalar(0.62 + i % 3 * 0.1);
        world.add(g);
        g.visible = false;
        airLeaves.push(g);
      }
      const cloudCanvas = document.createElement("canvas");
      cloudCanvas.setAttribute("aria-hidden", "true");
      Object.assign(cloudCanvas.style, { position: "fixed", top: "0", right: "0", bottom: "0", left: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: "0" });
      sceneHost.insertBefore(cloudCanvas, renderer.domElement);
      renderer.domElement.style.position = "relative";
      renderer.domElement.style.zIndex = "1";
      function resizeClouds() {
        cloudCanvas.width = window.sceneViewport.width;
        cloudCanvas.height = window.sceneViewport.height;
      }
      resizeClouds();
      addEventListener("resize", resizeClouds);
      function paintClouds(c, W, H, t) {
        c.clearRect(0, 0, W, H);
        const rgb = weatherMode === "rain" ? "23,32,49" : isDusk ? "240,205,190" : "255,255,249", strength = weatherMode === "rain" ? 0.34 : isDusk ? 0.24 : 0.47;
        const clusters = [[0.16, 0.2, 0.31, 0.07], [0.81, 0.28, 0.28, 0.061], [0.1, 0.7, 0.26, 0.065]];
        c.save();
        c.filter = "blur(11px)";
        for (let j = 0; j < clusters.length; j++) {
          const [cx, cy, w, h] = clusters[j], drift = THREE.MathUtils.euclideanModulo(cx + t * 145e-5 * (j ? 0.75 : 1) + 0.3, 1.6) - 0.3 - cx;
          for (let i = 0; i < 5; i++) {
            c.save();
            c.translate((cx + drift + (i - 2) * w * 0.15) * W, (cy + Math.sin(i * 1.8 + j) * h * 0.2) * H);
            c.scale(w * W * (0.28 + i % 2 * 0.05), h * H * (0.85 + i % 3 * 0.15));
            const gradient2 = c.createRadialGradient(0, 0, 0.1, 0, 0, 1);
            gradient2.addColorStop(0, "rgba(".concat(rgb, ",").concat(strength, ")"));
            gradient2.addColorStop(0.5, "rgba(".concat(rgb, ",").concat(strength * 0.65, ")"));
            gradient2.addColorStop(1, "rgba(".concat(rgb, ",0)"));
            c.fillStyle = gradient2;
            c.beginPath();
            c.arc(0, 0, 1, 0, Math.PI * 2);
            c.fill();
            c.restore();
          }
        }
        c.restore();
      }
      let lastCloudPaint = -100;
      let previousAirTime = null;
      function spawnLeaf(g, t) {
        g.userData.flight = { born: t, life: 11 + Math.random() * 10, nextGust: t + 0.4 + Math.random(), vx: (Math.random() < 0.5 ? -1 : 1) * (0.28 + Math.random() * 0.4), vz: (Math.random() - 0.5) * 0.19, vy: -0.025 - Math.random() * 0.07, spin: new THREE.Vector3((Math.random() - 0.5) * 1.7, (Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 1.6) };
        g.position.set(-5.3 + Math.random() * 10.6, 1.7 + Math.random() * 2.4, 2.95 + Math.random() * 2.3);
      }
      function animateAir(t) {
        const dt = previousAirTime === null ? 0 : Math.min(0.12, Math.max(0, t - previousAirTime));
        previousAirTime = t;
        airLeaves.forEach((g, i) => {
          let f = g.userData.flight;
          if (!f) {
            spawnLeaf(g, t - i * 0.7);
            f = g.userData.flight;
          }
          if (!isSunny) {
            g.visible = false;
            return;
          }
          if (t > f.born + f.life) {
            g.visible = false;
            if (!f.wake) f.wake = t + 2 + Math.random() * 5;
            if (t >= f.wake) spawnLeaf(g, t);
            return;
          }
          g.visible = true;
          if (t >= f.nextGust) {
            f.vx = THREE.MathUtils.clamp(f.vx + (Math.random() - 0.5) * 0.6, -0.65, 0.65);
            f.vz = (Math.random() - 0.5) * 0.35;
            f.vy = (Math.random() - 0.65) * 0.18;
            f.nextGust = t + 0.6 + Math.random() * 1.7;
          }
          g.position.x += dt * (f.vx + Math.sin(t * 1.1 + i) * 0.11);
          g.position.z += dt * (f.vz + Math.sin(t * 0.8 + i) * 0.08);
          g.position.y += dt * (f.vy + Math.sin(t * 1.5 + i) * 0.12);
          if (g.position.x < -5.6 || g.position.x > 5.6) {
            g.position.x = THREE.MathUtils.clamp(g.position.x, -5.6, 5.6);
            f.vx = -f.vx;
          }
          if (g.position.z < 2.85 || g.position.z > 5.5) {
            g.position.z = THREE.MathUtils.clamp(g.position.z, 2.85, 5.5);
            f.vz = -f.vz;
          }
          g.position.y = THREE.MathUtils.clamp(g.position.y, 0.8, 4.6);
          g.rotation.x += f.spin.x * dt;
          g.rotation.y += f.spin.y * dt;
          g.rotation.z += f.spin.z * dt;
          const fade = Math.max(0, Math.min(1, (t - f.born) / 0.8, (f.born + f.life - t) / 1.2));
          g.children[0].material.opacity = 0.76 * fade;
          g.children[1].material.opacity = 0.55 * fade;
        });
        if (t - lastCloudPaint > 0.09) {
          paintClouds(cloudCanvas.getContext("2d"), cloudCanvas.width, cloudCanvas.height, t);
          lastCloudPaint = t;
        }
      }
      let fogSmileAt = -100, lastAtmosphereMode = "", duskArrivalAt = -100, duskSequenceAt = -100, nextDuskSequence = 0, nextFeatherAt = Infinity, featherAt = -100;
      const fogMap = texture(256, 256, () => {
      });
      let fogErasure = -1, fogDrawProgress = 0, lastFogPaint = -100;
      function paintWindowFog(erasure, progress = 0) {
        const c = fogMap.image.getContext("2d"), W = 256, H = 256;
        c.clearRect(0, 0, W, H);
        c.globalCompositeOperation = "source-over";
        const glow2 = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.5);
        for (const [offset, alpha] of [[0, 0.85], [0.2, 0.73], [0.42, 0.4], [0.63, 0.16], [0.82, 0.035], [1, 0]]) glow2.addColorStop(offset, "rgba(211,232,228,".concat(alpha, ")"));
        c.fillStyle = glow2;
        c.fillRect(0, 0, W, H);
        if (erasure > 0) {
          c.save();
          c.globalCompositeOperation = "destination-out";
          c.strokeStyle = "rgba(0,0,0,".concat(erasure, ")");
          c.lineWidth = W * 0.052;
          c.lineCap = "round";
          for (let i = 0; i < 2; i++) {
            const amount = THREE.MathUtils.smoothstep(progress, i ? 0.26 : 0.02, i ? 0.43 : 0.19);
            if (amount <= 0) continue;
            const x = i ? 0.585 : 0.415;
            c.beginPath();
            c.moveTo(W * x, H * 0.385);
            c.lineTo(W * x, H * (0.385 + 0.045 * amount));
            c.stroke();
          }
          const mouth = THREE.MathUtils.smoothstep(progress, 0.5, 1);
          if (mouth > 0) {
            c.beginPath();
            c.arc(W * 0.5, H * 0.49, W * 0.18, 0.12, 0.12 + (Math.PI - 0.24) * mouth);
            c.stroke();
          }
          c.restore();
        }
        fogMap.needsUpdate = true;
        fogErasure = erasure;
        fogDrawProgress = progress;
      }
      paintWindowFog(0);
      const windowFog = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ map: fogMap, transparent: true, opacity: 0, depthWrite: false }));
      windowFog.position.set(-3.25, 2.05, 0.817);
      windowFog.name = "rain-window-breath-fog";
      world.add(windowFog);
      const fogHit = hitBox("fogSmile", -3.25, 2.05, 0.83, 1.45, 1.45, 0.025);
      fogHit.name = "rain-fog-click-area";
      const awningBurst = [];
      for (let i = 0; i < 6; i++) {
        const o = line([[0, 0, 0], [0, -0.1, 0]], 12640220);
        o.name = "occasional-awning-water-drop";
        o.material = o.material.clone();
        o.material.opacity = 0;
        world.add(o);
        awningBurst.push(o);
      }
      const roofBead = new THREE.Mesh(new THREE.CircleGeometry(0.05, 16), new THREE.MeshBasicMaterial({ color: 10077134, transparent: true, opacity: 0, depthWrite: false }));
      roofBead.rotation.x = -Math.PI / 2;
      roofBead.position.set(2.55, 3.077, 1.72);
      roofBead.name = "awning-water-bead";
      world.add(roofBead);
      const beamMap = texture(128, 256, (c, W, H) => {
        const g = c.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, "rgba(255,211,136,0)");
        g.addColorStop(0.4, "rgba(255,218,157,.5)");
        g.addColorStop(1, "rgba(255,211,136,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      const sunbeam = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 2.9), new THREE.MeshBasicMaterial({ map: beamMap, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      sunbeam.rotation.x = -Math.PI / 2;
      sunbeam.rotation.z = -0.22;
      sunbeam.position.set(0.5, 0.709, -1.05);
      sunbeam.name = "last-sunbeam-on-shop-floor";
      world.add(sunbeam);
      const starMap = texture(64, 64, (c, W, H) => {
        const g = c.createRadialGradient(32, 32, 0, 32, 32, 30);
        g.addColorStop(0, "rgba(255,253,225,.9)");
        g.addColorStop(0.25, "rgba(255,245,211,.25)");
        g.addColorStop(1, "rgba(255,245,211,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        c.strokeStyle = "rgba(255,252,222,.7)";
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(32, 8);
        c.lineTo(32, 56);
        c.moveTo(16, 32);
        c.lineTo(48, 32);
        c.stroke();
      });
      const bottleGlints = [];
      for (const x of [-3.92, -1.35, -0.25]) {
        const o = new THREE.Sprite(new THREE.SpriteMaterial({ map: starMap, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
        o.position.set(x + 0.18, 1.61, -3.15);
        o.scale.set(0.095, 0.095, 1);
        o.name = "sunny-bottle-glint";
        world.add(o);
        bottleGlints.push(o);
      }
      const featherShape = new THREE.Shape();
      featherShape.moveTo(0, -0.1);
      featherShape.bezierCurveTo(-0.055, -0.035, -0.04, 0.065, 0, 0.12);
      featherShape.bezierCurveTo(0.04, 0.055, 0.055, -0.02, 0, -0.1);
      const pigeonFeather = new THREE.Group();
      pigeonFeather.name = "pigeon-falling-feather";
      world.add(pigeonFeather);
      const plume = new THREE.Mesh(new THREE.ShapeGeometry(featherShape), new THREE.MeshBasicMaterial({ color: 15920864, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
      pigeonFeather.add(plume);
      const quill = line([[0, -0.12, 1e-3], [0, 0.1, 1e-3]], 12962747, 1, pigeonFeather);
      quill.material = quill.material.clone();
      quill.material.transparent = true;
      const sunsetGlass = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.85), new THREE.MeshBasicMaterial({ map: beamMap, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      sunsetGlass.rotation.y = Math.PI / 2;
      sunsetGlass.position.set(2.318, 2.02, -1.4);
      sunsetGlass.name = "dusk-last-light-in-window";
      world.add(sunsetGlass);
      const duskFixtures = world.children.filter((o) => o.isMesh && o.material.emissiveIntensity > 0 && o.position.y > 3.35 && o.position.y < 3.5 && o.position.z < 0.5 && o.position.z > -3);
      duskFixtures.forEach((o) => {
        o.material = o.material.clone();
        o.userData.atmospherePower = o.material.emissiveIntensity;
      });
      const dogFrontPaws = dog.children.filter((o) => o.isMesh && o.position.y < 0.1 && o.position.z > 0.38);
      dogFrontPaws.forEach((o) => o.userData.restZ = o.position.z);
      function animateWeatherStories(t, dt) {
        if (lastAtmosphereMode !== weatherMode) {
          lastAtmosphereMode = weatherMode;
          fogSmileAt = -100;
          featherAt = -100;
          nextFeatherAt = t + 8 + Math.random() * 10;
          if (isDusk) {
            duskArrivalAt = t;
            nextDuskSequence = t + 35;
            duskSequenceAt = -100;
          }
        }
        const rainy = weatherMode === "rain", sunny = weatherMode === "sunny", dusk = weatherMode === "dusk";
        const smileAge = t - fogSmileAt, drawProgress = THREE.MathUtils.clamp(smileAge / 1.65, 0, 1), erasure = smileAge >= 0 ? 1 - THREE.MathUtils.smoothstep(smileAge, 3.3, 8) : 0;
        windowFog.visible = rainy;
        windowFog.material.opacity = rainy ? 0.48 + Math.sin(t * 0.15) * 0.025 : 0;
        fogHit.visible = rainy;
        if (rainy && (Math.abs(erasure - fogErasure) > 4e-3 || Math.abs(drawProgress - fogDrawProgress) > 5e-3) && t - lastFogPaint > 0.04) {
          paintWindowFog(erasure, drawProgress);
          lastFogPaint = t;
        }
        roofBead.visible = rainy;
        roofBead.material.opacity = rainy ? 0.1 + 0.12 * (t % 19) / 19 : 0;
        roofBead.scale.setScalar(0.35 + 0.65 * (t % 19) / 19);
        awningBurst.forEach((o, i) => {
          const a = t % 19 - 15 - i * 0.1;
          o.visible = rainy && a >= 0 && a < 0.82;
          o.position.set(2.53 + i * 8e-3, 2.96 - a * 2.9, 1.79);
          o.material.opacity = o.visible ? Math.sin(a / 0.82 * Math.PI) * 0.44 : 0;
        });
        sunsetGlass.visible = dusk;
        sunsetGlass.material.opacity = dusk ? 0.07 : 0;
        if (sunny) {
          moon.position.set(-4.5 + Math.sin(t * 9e-3) * 2.4, 10 + Math.sin(t * 7e-3) * 0.5, -2 + Math.sin(t * 6e-3) * 2);
        }
        sunbeam.visible = sunny || dusk;
        sunbeam.material.opacity = dusk ? 0.17 : sunny ? 0.065 : 0;
        sunbeam.position.x = dusk ? 0.72 : 0.48 + Math.sin(t * 9e-3) * 0.2;
        sunbeam.rotation.z = dusk ? -0.22 : -0.22 + Math.sin(t * 9e-3) * 0.06;
        bottleGlints.forEach((o, i) => {
          const a = (t + i * 19) % 67;
          o.visible = sunny && a > 1 && a < 3.5;
          o.material.opacity = o.visible ? Math.sin((a - 1) / 2.5 * Math.PI) * 0.42 : 0;
        });
        if (sunny && t >= nextFeatherAt) {
          if (Math.random() < 0.85) featherAt = t;
          nextFeatherAt = t + 14 + Math.random() * 16;
        }
        const featherAge = t - featherAt;
        pigeonFeather.visible = sunny && featherAge >= 0 && featherAge < 12;
        if (pigeonFeather.visible) {
          const lift = Math.max(0, featherAge - 0.6), flutter = Math.sin(featherAge * 3) * 0.035;
          pigeonFeather.position.set(2.57 + lift * 0.15 + flutter, 3.23 + lift * 0.105 + Math.sin(featherAge * 2.4) * 0.025, 1.84 + lift * 0.18);
          pigeonFeather.rotation.set(-Math.PI / 2 + Math.sin(featherAge * 2) * 0.35, lift * 0.3, flutter * 3 + lift * 0.22);
          plume.material.opacity = quill.material.opacity = Math.min(1, featherAge / 0.4, Math.max(0, (12 - featherAge) / 2)) * 0.85;
        }
        if (!isCyberEdition) {
          duskFixtures.forEach((o, i) => {
            o.material.emissiveIntensity = o.userData.atmospherePower * (dusk ? 0.7 : 1 - weatherBlend * 0.94);
            if (dusk) {
              const first = THREE.MathUtils.smoothstep(t - duskArrivalAt, i * 0.8, i * 0.8 + 1.4), a = t - duskSequenceAt - i * 0.65, wave = a > 0 && a < 2.8 ? Math.sin(a / 2.8 * Math.PI) : 0;
              o.material.emissiveIntensity *= (0.45 + 0.55 * first) * (1 - 0.25 * wave);
            }
          });
        }
        if (dusk) {
          if (t >= nextDuskSequence) {
            duskSequenceAt = t;
            nextDuskSequence = t + 48;
          }
          shopLights.forEach((o, i) => {
            const first = THREE.MathUtils.smoothstep(t - duskArrivalAt, i * 0.55, i * 0.55 + 1.3), a = t - duskSequenceAt - i * 0.55, wave = a > 0 && a < 2.6 ? Math.sin(a / 2.6 * Math.PI) : 0;
            o.intensity *= (0.45 + 0.55 * first) * (1 - 0.22 * wave);
          });
          const age = t - dogCuriosity, stretch = age >= 0 && age < 3.8 ? Math.sin(age / 3.8 * Math.PI) : 0;
          dog.scale.y = 1 + Math.sin(t * 1.6) * 0.012 - stretch * 0.035;
          dog.scale.z = 1 + stretch * 0.065;
          dogHead.position.set(0, 0.23 - stretch * 0.04, 0.29 + stretch * 0.055);
          dogHead.rotation.x += stretch * 0.27;
          dogFrontPaws.forEach((o) => o.position.z = o.userData.restZ + stretch * 0.12);
        } else {
          dog.scale.z = 1;
          dogHead.position.set(0, 0.23, 0.29);
          dogFrontPaws.forEach((o) => o.position.z = o.userData.restZ);
        }
      }
      [windowFog, fogHit, roofBead, ...awningBurst, sunbeam, ...bottleGlints, pigeonFeather, sunsetGlass].forEach((o) => o.visible = false);
      const postcardStampKinds = { rain: "raindrop", sunny: "feather", dusk: "sunset", cyber: "orbital-star" };
      function drawScenePostmark(c, x, y, mode) {
        const color = { rain: "#6e9ba6", sunny: "#aa9b72", dusk: "#bf8e7a", cyber: "#72b8cb" }[mode] || "#7c9ba5";
        c.save();
        c.translate(x, y);
        c.rotate(-0.14);
        c.globalAlpha = 0.72;
        c.strokeStyle = color;
        c.fillStyle = color;
        c.lineWidth = 1.3;
        c.beginPath();
        c.arc(0, 0, 28, 0, Math.PI * 2);
        c.stroke();
        c.beginPath();
        c.arc(0, 0, 24, 0, Math.PI * 2);
        c.stroke();
        if (mode === "rain") {
          c.beginPath();
          c.moveTo(0, -14);
          c.bezierCurveTo(-6, -5, -12, 0, -9, 7);
          c.bezierCurveTo(-5, 17, 10, 14, 10, 5);
          c.bezierCurveTo(10, -1, 4, -7, 0, -14);
          c.stroke();
        } else if (mode === "sunny") {
          c.beginPath();
          c.moveTo(-9, 13);
          c.lineTo(9, -14);
          c.bezierCurveTo(-9, -14, -15, 3, -9, 13);
          c.bezierCurveTo(6, 15, 17, -2, 9, -14);
          c.stroke();
          for (let i = 0; i < 4; i++) {
            c.beginPath();
            c.moveTo(-5 + i * 3, 7 - i * 4);
            c.lineTo(4 + i * 2, 7 - i * 4);
            c.stroke();
          }
        } else if (mode === "dusk") {
          c.beginPath();
          c.arc(0, 2, 11, Math.PI, Math.PI * 2);
          c.stroke();
          for (const y2 of [3, 8, 13]) {
            c.beginPath();
            c.moveTo(-15, y2);
            c.lineTo(15, y2);
            c.stroke();
          }
          for (const a of [-2.6, -1.57, -0.55]) {
            c.beginPath();
            c.moveTo(Math.cos(a) * 15, 2 + Math.sin(a) * 15);
            c.lineTo(Math.cos(a) * 19, 2 + Math.sin(a) * 19);
            c.stroke();
          }
        } else {
          c.save();
          c.rotate(-0.45);
          c.scale(1, 0.44);
          c.beginPath();
          c.arc(0, 0, 18, 0, Math.PI * 2);
          c.stroke();
          c.restore();
          c.beginPath();
          for (let i = 0; i < 8; i++) {
            const a = -Math.PI / 2 + i * Math.PI / 4, r = i % 2 ? 4 : 10;
            if (i) c.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            else c.moveTo(Math.cos(a) * r, Math.sin(a) * r);
          }
          c.closePath();
          c.stroke();
          c.beginPath();
          c.arc(16, -7, 2, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
      }
      const originalRestTransforms = [];
      if (!isCyberEdition) world.traverse((o) => originalRestTransforms.push({ o, p: o.position.clone(), q: o.quaternion.clone(), s: o.scale.clone(), visible: o.visible }));
      let originalResetPending = false;
      const originalResetButton = document.createElement("button"), originalResetCurtain = document.createElement("div");
      function restoreOriginalState() {
        const mode = weatherMode, t = performance.now() / 1e3;
        originalRestTransforms.forEach(({ o, p, q, s, visible }) => {
          o.position.copy(p);
          o.quaternion.copy(q);
          o.scale.copy(s);
          o.visible = visible;
        });
        clearTimeout(singleTapTimer);
        pointers.clear();
        gesture = null;
        tapStart = null;
        focusTween = null;
        savedFocusView = null;
        target.set(0, 1.4, 0);
        yaw = 0.65;
        pitch = 0.43;
        distance = 21.7;
        vy = vp = 0;
        doorTarget = doorAmount = staffTarget = staffAmount = carDoorTarget = carDoorAmount = 0;
        carLightsOn = false;
        bikeLightOn = false;
        coffeeFull = false;
        coffeeFill = 0;
        coffeeUntil = 0;
        coffeeStarted = -100;
        bunLidTarget = bunLidAmount = 0;
        refrigeratorLeaves.forEach((leaf) => {
          leaf.userData.open = false;
          leaf.userData.amount = 0;
          leaf.rotation.y = 0;
        });
        wallVentOpen = false;
        wallVentAmount = 0;
        wallVentSlats.forEach((blade) => blade.rotation.z = 0);
        rearBins.forEach((bin) => {
          bin.userData.open = false;
          bin.userData.amount = 0;
          bin.userData.hinge.rotation.x = 0;
        });
        cookLidTarget = cookLidAmount = 0;
        cookJiggleAt = -100;
        takeoutTarget = takeoutAmount = 0;
        windowPending = null;
        takeoutVariant = "bento";
        noteShownAt = -1;
        takeoutClicks = 0;
        letterTarget = letterAmount = 0;
        letterDialog.close();
        closePostcardPreview();
        drinkState = "empty";
        drink.visible = false;
        drinkOpacity(0);
        carSpots.forEach((o) => o.intensity = 0);
        carReflections.forEach((o) => o.visible = false);
        carLenses.forEach((o) => o.material.color.setHex(12303527));
        carRearLenses.forEach((o) => o.material.color.setHex(9131348));
        bikeSpot.intensity = 0;
        lampLens.material.color.setHex(11184524);
        bikeReflection.visible = false;
        flowerPots.forEach((o) => o.userData.swayAt = -100);
        umbrellas.forEach((u) => {
          u.userData.raised = false;
          u.position.y = 0;
        });
        pinwheels.forEach((p) => {
          p.userData.boostAt = p.userData.gustAt = -100;
          p.userData.speed = 0;
          p.userData.nextGust = t + 2 + p.position.x * 2;
        });
        airLeaves.forEach((leaf) => delete leaf.userData.flight);
        interactionRipples.forEach((r) => r.meshes.forEach((o) => {
          world.remove(o);
          o.material.dispose();
        }));
        interactionRipples.length = 0;
        chimeImpulse = smokeBurstAt = catReact = pigeonReact = frontCuriosity = dogCuriosity = -100;
        fogSmileAt = featherAt = -100;
        lastAtmosphereMode = "";
        paintWindowFog(0);
        setClockMode(false);
        enterSignalPhase("walk", t);
        signalManualClicks = 0;
        activePasses.forEach((n) => {
          try {
            n.stop();
          } catch (_) {
          }
        });
        nextCar = (audioContext ? audioContext.currentTime : 0) + 4;
        setWeather(mode);
        weatherBlend = mode === "sunny" ? 1 : 0;
      }
      function resetOriginalScene() {
        if (isCyberEdition || originalResetPending) return;
        originalResetPending = true;
        originalResetButton.disabled = true;
        originalResetCurtain.classList.add("active");
        setTimeout(() => {
          restoreOriginalState();
          originalResetCurtain.classList.remove("active");
        }, 480);
        setTimeout(() => {
          originalResetPending = false;
          originalResetButton.disabled = false;
        }, 1050);
      }
      if (!isCyberEdition) {
        const style = document.createElement("style");
        style.textContent = '.scene-reset{position:fixed;left:25px;bottom:23px;z-index:4;width:45px;height:45px;padding:11px;border-radius:50%;border:1px solid rgba(196,213,210,0.1490);background:rgba(20,35,54,0.5020);color:#d4e2d8;display:grid;align-items:center;justify-items:center;cursor:pointer;backdrop-filter:blur(12px)}.scene-reset svg{width:22px;height:22px}.scene-reset:disabled{opacity:.4}.scene-reset:focus{outline:2px solid #d3b371;outline-offset:3px}body[data-weather="sunny"] .scene-reset,body[data-weather="dusk"] .scene-reset{background:rgba(255,246,223,0.6000);color:#7b8270;border-color:rgba(139,157,139,0.2000)}.scene-reset-curtain{position:fixed;top:0;right:0;bottom:0;left:0;z-index:115;background:#081526;opacity:0;pointer-events:none;transition:opacity .46s ease}.scene-reset-curtain.active{opacity:1;pointer-events:auto}body[data-weather="sunny"] .scene-reset-curtain,body[data-weather="dusk"] .scene-reset-curtain{background:#f2e6d1}@media(max-width:520px){.scene-reset{left:15px;bottom:16px;width:42px;height:42px}}';
        window.streetAppendStyle(style, "summer");
        originalResetButton.className = "scene-reset cyber-reset";
        originalResetButton.type = "button";
        originalResetButton.title = "\u91CD\u7F6E\u8857\u89D2";
        originalResetButton.setAttribute("aria-label", "\u91CD\u7F6E\u8857\u89D2");
        originalResetButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10a8 8 0 1 1 1.5 7M4 4v6h6"/></svg>';
        originalResetCurtain.className = "scene-reset-curtain";
        originalResetCurtain.setAttribute("aria-hidden", "true");
        sceneHost.appendChild(originalResetButton);
        sceneHost.appendChild(originalResetCurtain);
        originalResetButton.addEventListener("click", () => {
          ensureAudio();
          playSound("switch");
          resetOriginalScene();
        });
      }
      weatherMode = "summer";
      isSunny = false;
      isDusk = false;
      weatherBlend = 0;
      sceneHost.dataset.weather = "summer";
      weatherButtons.remove();
      const snowTown = new THREE.Group();
      snowTown.name = "\u5C71\u6751\u7EB3\u51C9\u591C";
      world.add(snowTown);
      const snowStatic = new THREE.Group();
      snowStatic.name = "village-static";
      snowTown.add(snowStatic);
      const snowShop = new THREE.Group();
      snowShop.name = "\u96EA\u4E61\u5C0F\u4ED3\u4E70-original-interior";
      snowShop.position.set(0.9, 0, 0.35);
      snowTown.add(snowShop);
      const snowLegacy = new THREE.Group();
      snowLegacy.name = "hidden-ordinary-exterior";
      world.add(snowLegacy);
      const snowExcluded = /* @__PURE__ */ new Set([cat, dog, pigeon, wallPlanter, umbrellaRack, sunnyFlowerRack, pinwheelStand, rain, roofDrain, roofExhaust, windowFog, fogHit, sunbeam, sunsetGlass, pigeonFeather]);
      world.updateMatrixWorld(true);
      for (const object of world.children.slice().filter((o) => ![snowTown, snowLegacy].includes(o))) {
        const b = new THREE.Box3().setFromObject(object), floor = object.isMesh && Math.abs(object.position.y - 0.59) < 1e-3 && object.geometry.parameters.width === 6.9;
        const inside = !b.isEmpty() && b.min.x >= -4.96 && b.max.x <= 2.68 && b.min.z >= -4.12 && b.max.z <= 1.85 && b.min.y >= 0.6 && b.max.y <= 4.05;
        (snowExcluded.has(object) ? snowLegacy : inside || floor ? snowShop : snowLegacy).add(object);
      }
      snowLegacy.visible = false;
      for (const o of [postbox, chime, chimeRain, doorHit, staffDoor, staffHinge, rearAwning, pickupSign, pickupHit, takeoutGroup, bento, preparingNote, wallVentExterior, wallVentInterior, ...rearBins, ...steam, ...bunSteam, ...odenSteam, ...cookSteam]) if (o.parent === snowLegacy) snowShop.add(o);
      if (mailEnvelope.parent === snowLegacy) snowShop.add(mailEnvelope);
      snowShop.add(windowFog);
      snowShop.add(fogHit);
      windowFog.visible = fogHit.visible = true;
      windowFog.material.opacity = 0.2;
      cat.visible = dog.visible = pigeon.visible = false;
      chimeSun.visible = false;
      shopLights.forEach((o) => {
        snowShop.add(o);
        o.intensity = o.userData.nightPower * 0.85;
        o.distance = 8;
      });
      snowShop.add(serviceLight);
      snowShop.add(serviceAim);
      const snowFloor = 0.28, snowWhite = 15134193, snowShade = 8293488, wood = 6771527, brick = 9990761;
      hemisphere.color.setHex(11126239);
      hemisphere.groundColor.setHex(6582400);
      hemisphere.intensity = 0.68;
      moon.color.setHex(12112360);
      moon.intensity = 0.65;
      moon.position.set(-12, 19, 10);
      moon.shadow.camera.left = -21;
      moon.shadow.camera.right = 21;
      moon.shadow.camera.top = 21;
      moon.shadow.camera.bottom = -21;
      moon.shadow.camera.far = 65;
      moon.shadow.bias = -15e-5;
      camera.far = 150;
      camera.updateProjectionMatrix();
      renderer.toneMappingExposure = 1.15;
      ink.color.setHex(4082264);
      ink.opacity = 0.3;
      glass.opacity = 0.105;
      frontAwning.material.color.setHex(7170915);
      function sb(x, y, z, w, h, d, c, parent = snowStatic, em = 0) {
        const o = box(x, y, z, w, h, d, c, false, em, parent);
        if (c === snowWhite) {
          o.visible = false;
          o.userData.winterOnly = true;
        }
        return o;
      }
      function sc(x, y, z, r, h, c, parent = snowStatic, n = 12) {
        return cyl(x, y, z, r, h, c, n, parent);
      }
      const snowSphere = new THREE.SphereGeometry(1, 12, 8);
      function ball(x, y, z, sx, sy, sz, c, parent = snowStatic) {
        const o = new THREE.Mesh(snowSphere, mat(c));
        o.position.set(x, y, z);
        o.scale.set(sx, sy, sz);
        o.castShadow = true;
        o.receiveShadow = true;
        parent.add(o);
        if (c === snowWhite) {
          o.visible = false;
          o.userData.winterOnly = true;
        }
        return o;
      }
      function label(x, y, z, w, h, text, parent = snowStatic, bg = "#ede0b8", fg = "#65483c") {
        return plaque(x, y, z, w, h, text, bg, fg, 80, parent);
      }
      let snowSeed = 8234;
      function sr() {
        snowSeed = snowSeed * 1664525 + 1013904223 >>> 0;
        return snowSeed / 4294967296;
      }
      const snowTargets = [];
      function snowBind(root, action) {
        root.traverse((o) => {
          if (o.isMesh) {
            o.userData.snowAction = action;
            snowTargets.push(o);
          }
        });
        return root;
      }
      function snowHit(action, x, y, z, w, h, d, parent = snowTown) {
        const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), pickMaterial);
        o.position.set(x, y, z);
        o.userData.snowAction = action;
        snowTargets.push(o);
        parent.add(o);
        return o;
      }
      function roof(cx, z, w, d, eave, rise, parent = snowStatic) {
        const shape = new THREE.Shape();
        shape.moveTo(-w / 2, 0);
        shape.lineTo(0, rise);
        shape.lineTo(w / 2, 0);
        shape.closePath();
        const shell = new THREE.Mesh(new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false }), mat(6910566));
        shell.position.set(cx, eave, z - d / 2);
        shell.castShadow = true;
        parent.add(shell);
        const len = Math.hypot(w / 2, rise), angle = Math.atan2(rise, w / 2);
        for (const side of [-1, 1]) {
          const panel = sb(cx + side * w / 4, eave + rise / 2 + 0.02, z, len + 0.1, 0.055, d + 0.14, 6912880, parent);
          panel.rotation.z = -side * angle;
          for (let j = 0; j < Math.ceil(d / 0.48); j++) {
            const seam = sb(cx + side * w / 4, eave + rise / 2 + 0.055, z - d / 2 + j * 0.48, len + 0.08, 0.018, 0.018, 9016454, parent);
            seam.rotation.z = -side * angle;
          }
        }
        return shell;
      }
      const houseWindows = [], chimneyPuffs = [], snowChimneys = [];
      const puffMap = texture(64, 64, (c, W, H) => {
        const g = c.createRadialGradient(32, 32, 0, 32, 32, 30);
        g.addColorStop(0, "rgba(235,237,235,.6)");
        g.addColorStop(1, "rgba(235,237,235,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      function smoke(x, y, z, parent = snowTown) {
        for (let i = 0; i < 5; i++) {
          const o = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffMap, transparent: true, opacity: 0, depthWrite: false }));
          o.userData.origin = new THREE.Vector3(x, y, z);
          o.userData.phase = i / 5;
          parent.add(o);
          chimneyPuffs.push(o);
        }
      }
      const townRadius = 20, roadY = 0.318, riverX = 5.6, riverWidth = 2.1, roadZ = 7;
      const snowLayout = { residence: { x: -11, z: -4.5, scale: 1.3, yaw: 0 }, repair: { x: -9.4, z: 12.6, scale: 1.1, yaw: Math.PI / 2 }, grain: { x: 0, z: -12, scale: 0.95, yaw: 0 }, bakery: { x: 12.15, z: -2.5, scale: 1.35, yaw: 0 }, woodshed: { x: -7.8, z: -12.5, scale: 1.05, yaw: 0 } };
      const roads = [], roadSegments = [], roadNodes = /* @__PURE__ */ new Map(), roadLinks = /* @__PURE__ */ new Map(), roadsideBanks = [], townTrees = [], lampObjects = [], bridges = [];
      function road(x, z, w, d) {
        roads.push({ x, z, w, d });
      }
      function onRoad(x, z, margin = 0) {
        return roads.some((r) => Math.abs(x - r.x) <= r.w / 2 + margin && Math.abs(z - r.z) <= r.d / 2 + margin);
      }
      function nodeKey(p) {
        return p.map((v) => Number(v.toFixed(3))).join(",");
      }
      function connect(points, width = 1.25) {
        for (let i = 1; i < points.length; i++) {
          const a = points[i - 1], b = points[i], dx = Math.abs(a[0] - b[0]), dz = Math.abs(a[1] - b[1]);
          if (dx > 1e-3 && dz > 1e-3) throw Error("Diagonal footpath");
          road((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, dx + width, dz + width);
          roadSegments.push({ a, b, width });
          for (const [p, q] of [[a, b], [b, a]]) {
            const k = nodeKey(p), j = nodeKey(q);
            roadNodes.set(k, p);
            roadNodes.set(j, q);
            if (!roadLinks.has(k)) roadLinks.set(k, []);
            roadLinks.get(k).push({ key: j, length: Math.hypot(dx, dz) });
          }
        }
      }
      connect([[-18.4, 7], [-12, 7], [-6.4, 7], [-0.32, 7], [4.1, 7], [7.1, 7], [8.2, 7], [12, 7], [18.4, 7]], 3.2);
      connect([[-6.4, 7], [-6.4, 5.2], [-6.4, 4.3], [-6.4, 2.5], [-6.4, -4.7], [-6.4, -7.5]]);
      connect([[-0.32, 1.65], [-0.32, 4.3], [-0.32, 7]], 1.55);
      connect([[-6.4, 4.3], [-0.32, 4.3], [2.9, 4.3], [2.9, 3.5], [4.1, 3.5], [7.1, 3.5], [8.2, 3.5], [8.2, 5.2], [8.2, 7]]);
      connect([[8.2, 3.5], [8.2, 1.6], [8.2, -7.5], [7.1, -7.5], [4.1, -7.5], [2.4, -7.5], [0, -7.5], [-6.4, -7.5]]);
      connect([[0, -7.5], [0, -9.25]]);
      connect([[2.4, -7.5], [2.4, -4.7], [2.4, -3.9]]);
      connect([[-6.4, -4.7], [-1.5, -4.7], [2.4, -4.7]]);
      connect([[-1.5, -4.7], [-1.5, -4.1]]);
      connect([[-11, -1.3], [-11, 2.5], [-6.4, 2.5]]);
      connect([[-12, 5.2], [-6.4, 5.2]]);
      connect([[-12, 5.2], [-12, 7]]);
      connect([[8.2, 5.2], [12, 5.2], [12, 7]]);
      connect([[8.2, 1.1], [14.418, 1.1], [14.418, 0.62]]);
      connect([[-5.55, 7], [-5.55, 11.1], [-5.55, 12.6], [-7.25, 12.6]]);
      connect([[-6.4, -7.5], [-7.8, -7.5], [-7.8, -10.9]], 1);
      connect([[-11, -1.3], [-11, -2.3]], 1);
      connect([[-5.55, 12.6], [-5.55, 16.8], [-0.7, 16.8], [-0.7, 17.05]], 1);
      connect([[14.418, 0.62], [14.418, 0.18]], 1.1);
      function clipPoly(poly, test, intersect) {
        const out = [];
        for (let i = 0; i < poly.length; i++) {
          const a = poly[i], b = poly[(i + 1) % poly.length], aa = test(a), bb = test(b);
          if (aa) out.push(a);
          if (aa !== bb) out.push(intersect(a, b));
        }
        return out;
      }
      function clipX(poly, x, less) {
        return clipPoly(poly, (p) => less ? p.x <= x : p.x >= x, (a, b) => a.clone().lerp(b, (x - a.x) / (b.x - a.x)));
      }
      function flatPolygon(poly, y, color, parent = snowStatic) {
        const faces = THREE.ShapeUtils.triangulateShape(poly, []), data = [];
        for (const face2 of faces) for (const j of face2) data.push(poly[j].x, y, poly[j].y);
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(data, 3));
        g.computeVertexNormals();
        const m = mat(color).clone();
        m.side = THREE.DoubleSide;
        const o = new THREE.Mesh(g, m);
        o.receiveShadow = true;
        parent.add(o);
        return o;
      }
      const perimeter = Array.from({ length: 160 }, (_, i) => new THREE.Vector2(Math.sin(i / 160 * Math.PI * 2) * townRadius, Math.cos(i / 160 * Math.PI * 2) * townRadius));
      const riverLeft = riverX - riverWidth / 2, riverRight = riverX + riverWidth / 2;
      function riverCenter(z) {
        let weight = 1;
        for (const [bz, half] of [[-7.5, 0.675], [3.5, 0.675], [7, 1.6]]) weight *= THREE.MathUtils.smoothstep(Math.abs(z - bz), half + 0.1, half + 1.35);
        return riverX + Math.sin(z * 0.32 + 0.8) * 0.6 * weight;
      }
      function riverEdges(z) {
        const limit = Math.sqrt(Math.max(0, townRadius * townRadius - z * z));
        return { left: THREE.MathUtils.clamp(riverCenter(z) - riverWidth / 2, -limit, limit), right: THREE.MathUtils.clamp(riverCenter(z) + riverWidth / 2, -limit, limit), limit };
      }
      const v4LandVertices = [];
      function v4LandQuad(a, b, c, d) {
        for (const p of [a, b, c, a, c, d]) v4LandVertices.push(p[0], 0.28, p[1]);
      }
      for (let i = 0; i < 400; i++) {
        const z0 = -20 + i * 0.1, z1 = z0 + 0.1, a = riverEdges(z0), b = riverEdges(z1);
        v4LandQuad([-a.limit, z0], [a.left, z0], [b.left, z1], [-b.limit, z1]);
        v4LandQuad([a.right, z0], [a.limit, z0], [b.limit, z1], [b.right, z1]);
      }
      const v4LandGeo = new THREE.BufferGeometry();
      v4LandGeo.setAttribute("position", new THREE.Float32BufferAttribute(v4LandVertices, 3));
      v4LandGeo.computeVertexNormals();
      const v4LandMat = mat(snowWhite).clone();
      v4LandMat.side = THREE.DoubleSide;
      const snowGround = new THREE.Mesh(v4LandGeo, v4LandMat);
      snowGround.receiveShadow = true;
      snowStatic.add(snowGround);
      const landSide = new THREE.Mesh(new THREE.CylinderGeometry(townRadius, townRadius - 0.12, 0.7, 128, 1, true), mat(7630169));
      landSide.position.y = -0.07;
      snowStatic.add(landSide);
      function v4RiverEnd(sign2) {
        let lo = 18, hi = 20;
        for (let i = 0; i < 40; i++) {
          const m = (lo + hi) / 2;
          if (Math.sqrt(Math.max(0, 400 - m * m)) > riverCenter(sign2 * m) - riverWidth / 2) lo = m;
          else hi = m;
        }
        return sign2 * (lo + hi) / 2;
      }
      const riverStart = v4RiverEnd(-1), riverEnd = v4RiverEnd(1), v4BankLeft = [], v4BankRight = [];
      for (let i = 0; i <= 400; i++) {
        const z = THREE.MathUtils.lerp(riverStart, riverEnd, i / 400), e = riverEdges(z);
        v4BankLeft.push(new THREE.Vector2(e.left, z));
        v4BankRight.push(new THREE.Vector2(e.right, z));
      }
      const icePoly = [...v4BankLeft, ...v4BankRight.slice().reverse()], iceHoleCenter = new THREE.Vector2(riverCenter(16.3), 16.3), iceHoleRadius = 0.54;
      const iceHoleOutline = [];
      for (let i = 0; i < 64; i++) {
        const a = -i / 64 * Math.PI * 2, r = 0.56 * (1 + 0.13 * Math.sin(a * 3) + 0.08 * Math.cos(a * 5) + 0.045 * Math.sin(a * 9));
        iceHoleOutline.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r * 0.86));
      }
      const v3IceShape = new THREE.Shape(icePoly), v3Hole = new THREE.Path(iceHoleOutline.map((p) => p.clone().add(iceHoleCenter)));
      v3Hole.closePath();
      const v3IceGeo = new THREE.ShapeGeometry(v3IceShape, 48), ip = v3IceGeo.attributes.position, uv = [];
      for (let i = 0; i < ip.count; i++) {
        const x = ip.getX(i), z = ip.getY(i);
        ip.setXYZ(i, x, -0.11, z);
        uv.push((x - riverCenter(z) + riverWidth / 2) / riverWidth, (z + townRadius) / (townRadius * 2));
      }
      v3IceGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
      v3IceGeo.computeVertexNormals();
      const iceTexture = texture(512, 2048, (c, W, H) => {
        const g = c.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, "#5d91a8");
        g.addColorStop(0.38, "#a6cfdf");
        g.addColorStop(0.7, "#86b8cd");
        g.addColorStop(1, "#d0e6ec");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        let seed2 = 923;
        function rand() {
          seed2 = seed2 * 16807 % 2147483647;
          return seed2 / 2147483647;
        }
        for (let i = 0; i < 26; i++) {
          let x = rand() * W, y = rand() * H;
          c.strokeStyle = i % 3 ? "rgba(231,250,255,.80)" : "rgba(43,92,119,.48)";
          c.lineWidth = i % 3 ? 1.8 : 2.6;
          c.beginPath();
          c.moveTo(x, y);
          for (let j = 0; j < 7; j++) {
            x += (rand() - 0.48) * 95;
            y += 15 + rand() * 46;
            c.lineTo(x, y);
            if (j === 3) {
              c.lineTo(x + 65, y + 26);
              c.moveTo(x, y);
            }
          }
          c.stroke();
        }
        for (let i = 0; i < 160; i++) {
          c.strokeStyle = "rgba(240,252,255,.16)";
          c.beginPath();
          c.ellipse(rand() * W, rand() * H, 3 + rand() * 12, 1 + rand() * 3, 0, 0, Math.PI * 2);
          c.stroke();
        }
      });
      const riverIce = new THREE.Mesh(v3IceGeo, new THREE.MeshPhysicalMaterial({ map: iceTexture, color: 12707565, roughness: 0.24, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.18, side: THREE.DoubleSide }));
      riverIce.name = "deep-cracked-ice-river";
      riverIce.receiveShadow = true;
      snowStatic.add(riverIce);
      const v3RiverBed = flatPolygon(icePoly, -0.43, 3431536);
      for (const edge of [v4BankLeft, v4BankRight]) {
        const data = [];
        for (let i = 1; i < edge.length; i++) {
          const a = edge[i - 1], b = edge[i];
          for (const p of [[a.x, 0.28, a.y], [b.x, -0.43, b.y], [b.x, 0.28, b.y], [a.x, 0.28, a.y], [a.x, -0.43, a.y], [b.x, -0.43, b.y]]) data.push(...p);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(data, 3));
        geo.computeVertexNormals();
        const m = mat(8161647).clone();
        m.side = THREE.DoubleSide;
        const bank = new THREE.Mesh(geo, m);
        bank.name = "curved-river-bank";
        snowStatic.add(bank);
      }
      const v3Base = new THREE.Mesh(new THREE.CylinderGeometry(townRadius - 0.12, townRadius - 0.12, 0.08, 128), mat(8231085));
      v3Base.position.y = -0.47;
      snowStatic.add(v3Base);
      function bridge(kind, z) {
        const g = new THREE.Group();
        g.name = kind + "-bridge";
        g.position.set(riverX, 0, z);
        snowStatic.add(g);
        const span = 4.1, depth = kind === "modern" ? 3.2 : 1.35;
        if (kind === "modern") {
          sb(0, 0.255, 0, span, 0.14, depth, 9082525, g);
          sb(0, 0.322, 0, span, 0.025, depth, 11977934, g);
          for (const s of [-1, 1]) {
            for (let i = 0; i < 7; i++) sb(-span / 2 + i * span / 6, 0.78, s * (depth / 2 + 0.1), 0.06, 0.84, 0.06, 6847367, g);
            for (const y of [0.6, 1.15]) sb(0, y, s * (depth / 2 + 0.1), span, 0.045, 0.06, 10991033, g);
          }
          for (const x of [-1.55, 1.55]) sb(x, 0.1, 0, 0.28, 0.38, 2.85, 9412005, g);
        } else if (kind === "wood") {
          for (let i = 0; i < 18; i++) sb(-span / 2 + i * span / 17, 0.388, 0, 0.23, 0.075, depth, 9993821, g);
          for (const s of [-1, 1]) {
            for (const x of [-1.95, -0.65, 0.65, 1.95]) sb(x, 0.78, s * 0.72, 0.08, 0.79, 0.08, wood, g);
            sb(0, 1.14, s * 0.72, span, 0.07, 0.08, 10125923, g);
          }
          for (const x of [-2.35, 2.35]) {
            const ramp = sb(x, 0.357, 0, 0.65, 0.07, depth, 11846088, g);
            ramp.rotation.z = (x < 0 ? 1 : -1) * 0.13;
          }
        } else {
          for (let i = 0; i < 20; i++) {
            const t = (i + 0.5) / 20, x = (t - 0.5) * span, y = 0.32 + 0.4 * Math.sin(t * Math.PI);
            sb(x, y - 0.055, 0, span / 20 + 0.01, 0.12, depth, 10202030, g);
            for (const s of [-1, 1]) sb(x, y + 0.21, s * 0.73, span / 20 + 0.01, 0.43, 0.18, 9215136, g);
          }
          for (const s of [-1, 1]) for (let i = 0; i < 18; i++) {
            const t = (i + 0.5) / 18, x = (t - 0.5) * span, y = 0.22 + 0.37 * Math.sin(t * Math.PI), o = sb(x, y - 0.15, s * 0.6, 0.23, 0.24, 0.22, 8426391, g);
            o.rotation.z = Math.cos(t * Math.PI) * 0.28;
          }
        }
        const r = { kind, z, root: g, span, depth };
        bridges.push(r);
        return r;
      }
      bridge("modern", 7);
      bridge("wood", 3.5);
      bridge("stone", -7.5);
      function walkHeight(x, z) {
        if (Math.abs(x - riverX) < 2.75) {
          if (Math.abs(z - 3.5) < 0.7) {
            const d = Math.abs(x - riverX);
            return d < 2.05 ? 0.428 : THREE.MathUtils.lerp(0.428, roadY, (d - 2.05) / 0.7);
          }
          if (Math.abs(z + 7.5) < 0.75 && Math.abs(x - riverX) <= 2.05) return 0.325 + 0.4 * Math.sin((x - riverX + 2.05) / 4.1 * Math.PI);
        }
        if (Math.abs(x + 0.32) < 0.7 && z < 2.9 && z > -0.2) {
          if (z > 2.775) return THREE.MathUtils.lerp(0.318, 0.415, (2.9 - z) / 0.125);
          if (z > 2.65) return 0.415;
          if (z > 2.495) return THREE.MathUtils.lerp(0.415, 0.545, (2.65 - z) / 0.155);
          if (z > 2.25) return 0.545;
          if (z > 2.125) return THREE.MathUtils.lerp(0.545, 0.57, (2.25 - z) / 0.125);
          if (z > 1.95) return 0.57;
          if (z > 1.83) return THREE.MathUtils.lerp(0.57, 0.645, (1.95 - z) / 0.12);
          if (z > 1.2) return 0.645;
          if (z > 1.1) return THREE.MathUtils.lerp(0.645, 0.7, (1.2 - z) / 0.1);
          return 0.7;
        }
        if (Math.abs(x + 11) < 0.9 && z < -1.3 && z > -3.5) {
          if (z > -1.406) return THREE.MathUtils.lerp(0.318, 0.4485, (-1.3 - z) / 0.106);
          if (z > -1.55) return 0.4485;
          if (z > -1.692) return THREE.MathUtils.lerp(0.4485, 0.7345, (-1.55 - z) / 0.142);
          if (z > -2.13) return 0.7345;
          if (z > -2.26) return THREE.MathUtils.lerp(0.7345, 0.796, (-2.13 - z) / 0.13);
          return 0.796;
        }
        if (Math.abs(x - 14.418) < 0.75 && z < 0.62 && z > -2.3) {
          const q = z + 0.5;
          if (q > 0.925) return THREE.MathUtils.lerp(0.318, 0.46, (1.12 - q) / 0.195);
          if (q > 0.75) return 0.46;
          if (q > 0.575) return THREE.MathUtils.lerp(0.46, 0.63, (0.75 - q) / 0.175);
          if (q > 0.35) return 0.63;
          if (q > 0.28) return THREE.MathUtils.lerp(0.63, 0.8, (0.35 - q) / 0.07);
          return 0.8;
        }
        if (Math.abs(x) < 0.9 && z < -9.25 && z > -11.6) {
          if (z > -9.739) return THREE.MathUtils.lerp(0.318, 0.514, (-9.25 - z) / 0.489);
          if (z > -9.85) return 0.514;
          if (z > -9.9765) return THREE.MathUtils.lerp(0.514, 0.733, (-9.85 - z) / 0.1265);
          if (z > -10.2) return 0.733;
          if (z > -10.328) return THREE.MathUtils.lerp(0.733, 0.882, (-10.2 - z) / 0.128);
          return 0.882;
        }
        return roadY;
      }
      function findRoute(a, b) {
        var _a2;
        const closest = (p) => [...roadNodes.entries()].sort((u2, v) => Math.hypot(u2[1][0] - p[0], u2[1][1] - p[1]) - Math.hypot(v[1][0] - p[0], v[1][1] - p[1]))[0][0];
        const from = closest(a), to = closest(b), dist = /* @__PURE__ */ new Map([[from, 0]]), prev2 = /* @__PURE__ */ new Map(), q = new Set(roadNodes.keys());
        while (q.size) {
          let u2 = [...q].sort((x, y) => {
            var _a3, _b2;
            return ((_a3 = dist.get(x)) != null ? _a3 : Infinity) - ((_b2 = dist.get(y)) != null ? _b2 : Infinity);
          })[0];
          q.delete(u2);
          if (u2 === to) break;
          for (const edge of roadLinks.get(u2) || []) {
            const d = dist.get(u2) + edge.length;
            if (d < ((_a2 = dist.get(edge.key)) != null ? _a2 : Infinity)) {
              dist.set(edge.key, d);
              prev2.set(edge.key, u2);
            }
          }
        }
        const out = [roadNodes.get(to)];
        let u = to;
        while (u !== from && prev2.has(u)) {
          u = prev2.get(u);
          out.unshift(roadNodes.get(u));
        }
        if (u !== from) throw Error("Disconnected village route");
        if (Math.hypot(out[0][0] - a[0], out[0][1] - a[1]) > 0.01) out.unshift(a);
        if (Math.hypot(out[out.length - 1][0] - b[0], out[out.length - 1][1] - b[1]) > 0.01) out.push(b);
        return out;
      }
      function buildUnifiedRoads() {
        const xs = [...new Set(roads.flatMap((r) => [r.x - r.w / 2, r.x + r.w / 2]).concat([riverLeft, riverRight]))].sort((a, b) => a - b), zs = [...new Set(roads.flatMap((r) => [r.z - r.d / 2, r.z + r.d / 2]))].sort((a, b) => a - b), vertices = [];
        for (let i = 1; i < xs.length; i++) for (let j = 1; j < zs.length; j++) {
          const x = (xs[i] + xs[i - 1]) / 2, z = (zs[j] + zs[j - 1]) / 2;
          if (!onRoad(x, z) || x > riverLeft && x < riverRight || Math.hypot(x, z) > 19.8) continue;
          const z0 = zs[j - 1], z1 = zs[j], limit = Math.sqrt(Math.max(0, 19.93 ** 2 - Math.max(z0 * z0, z1 * z1))), x0 = Math.max(xs[i - 1], -limit), x1 = Math.min(xs[i], limit);
          if (x1 <= x0) continue;
          vertices.push(x0, roadY, z0, x1, roadY, z1, x1, roadY, z0, x0, roadY, z0, x0, roadY, z1, x1, roadY, z1);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geo.computeVertexNormals();
        const mesh = new THREE.Mesh(geo, mat(10855311));
        mesh.name = "continuous-connected-roads";
        mesh.receiveShadow = true;
        snowStatic.add(mesh);
        return mesh;
      }
      function snowbank(x, z, sx, sz, h = 0.22) {
        return ball(x, 0.28 + h * 0.15, z, sx, h, sz, snowWhite);
      }
      function foot(x, z, angle = 0, bear2 = false, parent = snowStatic) {
        const g = new THREE.Group();
        g.position.set(x, (onRoad(x, z) ? walkHeight(x, z) : 0.28) + 4e-3, z);
        g.rotation.y = angle;
        parent.add(g);
        ball(0, 0, 0, bear2 ? 0.16 : 0.065, 7e-3, bear2 ? 0.22 : 0.15, 7826259, g);
        if (bear2) for (let k = 0; k < 4; k++) ball(-0.13 + k * 0.085, 0, 0.2, 0.04, 6e-3, 0.05, 7826259, g);
        return g;
      }
      for (const o of snowShop.children.slice()) if (o.position.x < -4.63 && o.position.z > 0.3) o.removeFromParent();
      for (const o of vendingCans) o.removeFromParent();
      postbox.visible = false;
      mailEnvelope.visible = false;
      chime.visible = false;
      roof(-1.15, -1.57, 7.55, 5.38, 3.96, 1.3, snowShop);
      chimney(snowShop, 0.95, -2.1, 5.25);
      const removedWinterStripes = [];
      for (const o of snowShop.children.slice()) if (o.isMesh && Math.abs(o.position.x + 1.15) < 1e-3 && Math.abs(o.position.z - 1.08) < 1e-3 && [3.23, 3.53].some((y) => Math.abs(o.position.y - y) < 1e-3)) {
        removedWinterStripes.push(o);
        o.removeFromParent();
      }
      sign.position.set(-1.15, 3.57, 1.171);
      sign.scale.set(1, 1, 1);
      sign.geometry.dispose();
      sign.geometry = new THREE.PlaneGeometry(4.25, 0.54);
      sign.material = new THREE.MeshBasicMaterial({ map: texture(1024, 160, (c, W, H) => {
        c.fillStyle = "#ddcba1";
        c.fillRect(0, 0, W, H);
        c.strokeStyle = "#9d7954";
        c.lineWidth = 9;
        c.strokeRect(6, 6, W - 12, H - 12);
        c.fillStyle = "#7a3d2e";
        c.font = '700 122px "Microsoft YaHei",sans-serif';
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("\u96EA\u4E61\u5C0F\u4ED3\u4E70", W / 2, H / 2 + 4);
      }) });
      sign.userData.text = sign.userData.displayText = "\u96EA\u4E61\u5C0F\u4ED3\u4E70";
      const snowSignBack = sb(-1.15, 3.57, 1.145, 4.4, 0.6, 0.04, 8349521, snowShop);
      const signReliefs = [];
      for (const x of [-4, 1.7]) {
        const g = new THREE.Group();
        g.name = "carved-snowflake-fret-relief";
        g.position.set(x, 3.57, 1.128);
        snowShop.add(g);
        const c = 14930602;
        for (let j = 0; j < 6; j++) {
          const a = j * Math.PI / 3, dx = Math.cos(a), dy = Math.sin(a);
          rod([0, 0, 0.02], [dx * 0.155, dy * 0.155, 0.02], 0.014, c, g);
          for (const side of [-1, 1]) {
            const b = a + side * 0.67;
            rod([dx * 0.105, dy * 0.105, 0.02], [dx * 0.105 - Math.cos(b) * 0.055, dy * 0.105 - Math.sin(b) * 0.055, 0.02], 0.01, c, g);
          }
        }
        for (const side of [-1, 1]) for (const up of [-1, 1]) {
          sb(side * 0.42, up * 0.155, 0.018, 0.18, 0.02, 0.035, c, g);
          sb(side * 0.5, up * 0.1, 0.018, 0.02, 0.13, 0.035, c, g);
          sb(side * 0.39, up * 0.09, 0.018, 0.12, 0.018, 0.035, c, g);
          sb(side * 0.34, up * 0.065, 0.018, 0.018, 0.065, 0.035, c, g);
        }
        signReliefs.push(g);
      }
      const icicleMat = new THREE.MeshPhysicalMaterial({ color: 13231861, transparent: true, opacity: 0.78, roughness: 0.19, depthWrite: false }), icicles = [];
      for (const [i, x] of [-4.6, -4.12, -3.8, -2.85, -2.55, -0.18, 0.35, 1.45, 2.15].entries()) {
        const h = 0.15 + i % 4 * 0.075, o = new THREE.Mesh(new THREE.ConeGeometry(0.034, h, 6), icicleMat);
        o.rotation.z = Math.PI;
        o.position.set(x, 3.02 - h / 2, 1.84);
        snowShop.add(o);
        icicles.push(o);
      }
      sb(-1.15, 3.11, 1.32, 7.55, 0.14, 1.05, snowWhite, snowShop);
      for (const [x, w] of [[-3.325, 2.35], [0.995, 2.57]]) {
        sb(x, 0.99, 0.83, w, 0.47, 0.13, 12893606, snowShop);
        for (const dx of [-w * 0.48, 0, w * 0.48]) sb(x + dx, 1.98, 0.855, 0.09, 1.99, 0.1, 6845545, snowShop);
      }
      sb(2.34, 1, -1.5, 0.13, 0.47, 4.62, 11974563, snowShop);
      for (const z of [-3, -1.5, 0]) sb(2.365, 2, z, 0.11, 1.99, 0.09, 6845545, snowShop);
      const cottonLeaves = [];
      for (const [i, door] of doors.entries()) {
        const shift = i === 0 ? 0.42 : -0.42;
        for (const child of door.children) child.position.x += shift;
        door.position.x = i === 0 ? -2.08 : -0.36;
        door.userData.closedX = door.position.x;
        const pad = new THREE.Group();
        pad.position.x = shift;
        pad.name = "one-piece-quilt-with-single-window";
        door.add(pad);
        const quilt = 6449996;
        sb(0, 1.37, 0.06, 0.8, 1.14, 0.055, quilt, pad);
        sb(0, 2.59, 0.06, 0.8, 0.5, 0.055, quilt, pad);
        for (const x of [-0.345, 0.345]) sb(x, 2.14, 0.06, 0.11, 0.4, 0.055, quilt, pad);
        const p = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.36), new THREE.MeshPhysicalMaterial({ color: 14806247, transparent: true, opacity: 0.1, roughness: 0.18, side: THREE.DoubleSide, depthWrite: false }));
        p.position.set(0, 2.14, 0.095);
        pad.add(p);
        for (const yy of [1.94, 2.34]) sb(0, yy, 0.1, 0.63, 0.025, 0.015, 12037769, pad);
        for (const xx of [-0.31, 0.31]) sb(xx, 2.14, 0.1, 0.025, 0.4, 0.015, 12037769, pad);
        for (let j = 0; j < 4; j++) sb(-0.29 + j * 0.19, 1.36, 0.092, 8e-3, 0.98, 8e-3, 9212528, pad);
        cottonLeaves.push(pad);
      }
      function verticalLabel(x, y, z, w, h, text, parent = snowStatic, bg = "#b17254", fg = "#ead29a") {
        const tex = texture(128, 768, (c, W, H) => {
          c.fillStyle = bg;
          c.fillRect(0, 0, W, H);
          c.fillStyle = fg;
          c.textAlign = "center";
          c.textBaseline = "middle";
          c.font = '700 95px "Microsoft YaHei",sans-serif';
          [...text].forEach((s, i) => c.fillText(s, W / 2, H * (i + 0.5) / text.length));
        });
        const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex }));
        o.position.set(x, y, z);
        o.userData.text = text;
        parent.add(o);
        return o;
      }
      for (const [x, t] of [[-2.24, "\u745E\u96EA\u8FCE\u6625"], [-0.21, "\u51FA\u5165\u5E73\u5B89"]]) verticalLabel(x, 1.92, 0.91, 0.18, 1.65, t, snowShop);
      const lanterns = [], lanternLights = [], lanternRibs = [];
      for (const x of [-4.25, 2.02]) {
        const g = new THREE.Group();
        g.position.set(x, 2.63, 1.53);
        snowShop.add(g);
        rod([0, 0.42, 0], [0, 0.17, 0], 0.013, 9139540, g);
        const shade = ball(0, 0, 0, 0.275, 0.285, 0.275, 14292008, g);
        shade.name = "lit-red-lantern-paper";
        shade.material = shade.material.clone();
        shade.material.color.setHex(7475977);
        shade.material.emissive.setHex(16725019);
        shade.material.emissiveIntensity = 0.62;
        shade.material.toneMapped = false;
        const ribMaterial = new THREE.MeshBasicMaterial({ color: 15184977, toneMapped: false });
        for (let i = 0; i < 12; i++) {
          const a = (i + 0.5) * Math.PI / 6, points = [];
          for (let j = 0; j <= 32; j++) {
            const t = 0.4 + j / 32 * (Math.PI - 0.8), r = 0.28 * Math.sin(t);
            points.push(new THREE.Vector3(Math.sin(a) * r, 0.289 * Math.cos(t), Math.cos(a) * r));
          }
          const rib = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 32, 45e-4, 5, false), ribMaterial);
          rib.name = "golden-lantern-rib";
          g.add(rib);
          lanternRibs.push(rib);
        }
        const warmLight = new THREE.PointLight(16730416, 1.1, 3, 2);
        warmLight.position.set(0, -0.02, 0.08);
        g.add(warmLight);
        lanternLights.push(warmLight);
        for (const y of [-0.25, 0.25]) sc(0, y, 0, 0.13, 0.055, 12621909, g);
        rod([0, -0.27, 0], [0, -0.49, 0], 0.014, 12161618, g);
        label(0, 0, 0.289, 0.16, 0.19, "\u798F", g, "#db351d", "#ffe0a0");
        lanterns.push(g);
      }
      sb(-1.15, 0.49, 1.15, 7.02, 0.16, 1.25, 10789518, snowShop);
      sb(-1.22, 0.45, 1.9, 1.85, 0.19, 0.49, 10658720, snowShop);
      sb(-1.22, 0.35, 2.25, 2, 0.13, 0.35, 11712181, snowShop);
      for (const [x, z, sx, sz] of [[-4.15, 1.87, 0.53, 0.18], [-2.6, 2.36, 0.42, 0.17], [0.5, 2.37, 0.49, 0.16], [2, 2.22, 0.48, 0.21], [-3.2, 1.85, 0.24, 0.13]]) ball(x, 0.59, z, sx, 0.025, sz, snowWhite, snowShop);
      const produceRows = [["\u571F\u8C46", "\u80E1\u841D\u535C", "\u5730\u74DC", "\u897F\u7EA2\u67FF"], ["\u767D\u83DC", "\u841D\u535C", "\u8304\u5B50", "\u751F\u83DC"], ["\u82F9\u679C", "\u6A58\u5B50", "\u68A8\u5B50", "\u9999\u8549"]];
      const shelfCategories = [];
      for (const unit of shelfUnits) {
        unit.clear();
        const fresh = unit.position.z > -1, w = fresh ? 2.16 : 2.25, products = [];
        unit.name = fresh ? "front-fruit-vegetable-shelf" : "rear-noodle-ham-seed-shelf";
        sb(0, 1.28, 0, w, 1.12, 0.035, 11842976, unit);
        for (const side of [-1, 1]) sb(side * w / 2, 1.28, 0, 0.035, 1.12, 0.65, 13223596, unit);
        for (const [level, y] of [0.91, 1.29, 1.68].entries()) {
          sb(0, y, 0, w + 0.08, 0.055, 0.73, 15983030, unit);
          for (const side of [-1, 1]) {
            sb(0, y - 0.05, side * 0.379, w, 0.085, 0.01, 16052192, unit);
            for (let col = 0; col < (fresh ? 4 : 3); col++) {
              const cx = fresh ? (col - 1.5) * 0.54 : (col - 1) * 0.74, tray = new THREE.Group();
              tray.position.set(cx, y + 0.03, side * 0.205);
              unit.add(tray);
              const kind = fresh ? produceRows[level][col] : ["\u65B9\u4FBF\u9762", "\u706B\u817F\u80A0", "\u74DC\u5B50"][(col + level) % 3];
              tray.name = "shelf-goods-" + kind;
              Object.assign(tray.userData, { category: kind, level, side, column: col });
              products.push(tray);
              if (fresh) {
                sb(0, 0.025, 0, 0.5, 0.045, 0.3, 12031847, tray);
                for (const z of [-0.145, 0.145]) sb(0, 0.065, z, 0.5, 0.075, 0.018, 10781785, tray);
                for (let j = 0; j < 3; j++) {
                  const xx = (j - 1) * 0.15;
                  if (kind === "\u82F9\u679C" || kind === "\u6A58\u5B50") {
                    ball(xx, 0.12, 0, 0.075, 0.07, 0.074, kind === "\u82F9\u679C" ? 12407617 : 15310916, tray);
                    rod([xx, 0.18, 0], [xx + 9e-3, 0.205, 0], 6e-3, 6969147, tray);
                  } else if (kind === "\u767D\u83DC") {
                    ball(xx, 0.15, 0, 0.078, 0.115, 0.07, 11978887, tray);
                    for (const dx of [-0.052, 0, 0.052]) ball(xx + dx, 0.15, 0.028, 0.027, 0.11, 0.049, dx ? 8494177 : 14211485, tray);
                  } else if (kind === "\u841D\u535C") {
                    ball(xx, 0.115, 0, 0.042, 0.085, 0.1, 15262152, tray);
                    for (const dx of [-0.025, 0, 0.025]) rod([xx, 0.19, 0], [xx + dx, 0.255, 0.02], 0.012, 7902044, tray);
                  } else if (kind === "\u80E1\u841D\u535C") {
                    const carrot2 = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.22, 8), mat(13929021));
                    carrot2.rotation.x = Math.PI / 2;
                    carrot2.position.set(xx, 0.09, 0);
                    tray.add(carrot2);
                    for (const dx of [-0.018, 0.018]) rod([xx, 0.09, -0.1], [xx + dx, 0.13, -0.15], 9e-3, 7244117, tray);
                  } else if (kind === "\u68A8\u5B50") {
                    ball(xx, 0.11, 0, 0.065, 0.066, 0.062, 14008177, tray);
                    ball(xx, 0.17, 0, 0.039, 0.05, 0.039, 14008177, tray);
                    rod([xx, 0.207, 0], [xx + 9e-3, 0.237, -8e-3], 6e-3, 7758143, tray);
                  } else if (kind === "\u9999\u8549") {
                    for (let k = 0; k < 3; k++) {
                      const points = [];
                      for (let n = 0; n <= 8; n++) {
                        const a = -1 + n / 8 * 2;
                        points.push(new THREE.Vector3(xx + Math.sin(a) * 0.077, 0.11 + (1 - Math.cos(a)) * 0.07, k * 0.035 - 0.035));
                      }
                      const banana = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 12, 0.016, 6, false), mat(14728532));
                      tray.add(banana);
                      for (const end of [points[0], points[8]]) ball(end.x, end.y, end.z, 9e-3, 0.011, 9e-3, 8416062, tray);
                    }
                  } else if (kind === "\u8304\u5B50") {
                    const eggplant = ball(xx, 0.105, 0, 0.041, 0.046, 0.11, 5849191, tray);
                    eggplant.rotation.y = 0.12 * (j - 1);
                    ball(xx, 0.117, -0.095, 0.034, 0.024, 0.027, 7574106, tray);
                    rod([xx, 0.12, -0.1], [xx + 0.012, 0.15, -0.134], 8e-3, 6653007, tray);
                  } else if (kind === "\u751F\u83DC") {
                    ball(xx, 0.11, 0, 0.064, 0.062, 0.061, 10533488, tray);
                    for (let k = 0; k < 5; k++) {
                      const a = k * Math.PI * 2 / 5;
                      const leaf = ball(xx + Math.sin(a) * 0.036, 0.127, Math.cos(a) * 0.035, 0.035, 0.067, 0.029, k % 2 ? 9219681 : 11782525, tray);
                      leaf.rotation.z = -Math.sin(a) * 0.38;
                    }
                  } else if (kind === "\u5730\u74DC") {
                    const tuber = ball(xx, 0.105, 0, 0.049, 0.049, 0.115, j % 2 ? 10838608 : 11562580, tray);
                    tuber.rotation.y = (j - 1) * 0.2;
                    for (const z of [-0.072, 0.057]) ball(xx + 0.012, 0.149, z, 7e-3, 3e-3, 0.013, 13736562, tray);
                  } else if (kind === "\u897F\u7EA2\u67FF") {
                    ball(xx, 0.113, 0, 0.067, 0.058, 0.065, 13521728, tray);
                    for (let k = 0; k < 5; k++) {
                      const a = k * Math.PI * 2 / 5;
                      rod([xx, 0.174, 0], [xx + Math.sin(a) * 0.035, 0.168, Math.cos(a) * 0.035], 6e-3, 6652236, tray);
                    }
                    rod([xx, 0.174, 0], [xx + 6e-3, 0.195, 0], 6e-3, 6652236, tray);
                  } else ball(xx, 0.105, 0, 0.085, 0.061, 0.069, j % 2 ? 11506016 : 12689773, tray);
                }
              } else for (let j = 0; j < 3; j++) {
                const xx = (j - 1) * 0.215;
                if (kind === "\u706B\u817F\u80A0") {
                  for (let k = 0; k < 3; k++) {
                    const sausage = sc(xx, 0.055 + k * 0.065, 0, 0.031, 0.245, 12015940, tray);
                    sausage.rotation.x = Math.PI / 2;
                    sb(xx, 0.055 + k * 0.065, 0, 0.065, 0.045, 0.08, 15123071, tray);
                  }
                } else {
                  sb(xx, 0.115, 0, kind === "\u65B9\u4FBF\u9762" ? 0.195 : 0.17, 0.22, 0.14, kind === "\u65B9\u4FBF\u9762" ? j % 2 ? 13208387 : 12148033 : 7562061, tray);
                  sb(xx, 0.123, side * 0.073, kind === "\u65B9\u4FBF\u9762" ? 0.16 : 0.13, 0.1, 7e-3, kind === "\u65B9\u4FBF\u9762" ? 15257225 : 13284491, tray);
                  if (kind === "\u65B9\u4FBF\u9762") {
                    for (let k = 0; k < 3; k++) sb(xx, 0.095 + k * 0.025, side * 0.079, 0.11, 9e-3, 4e-3, 13081429, tray);
                  } else for (const dx of [-0.025, 0.025]) {
                    const seed2 = ball(xx + dx, 0.123, side * 0.08, 0.012, 0.033, 4e-3, 7168589, tray);
                    seed2.rotation.z = dx < 0 ? -0.22 : 0.22;
                  }
                }
              }
              if (fresh) {
                const tag = label(cx, y - 0.05, side * 0.388, 0.46, 0.065, kind, unit, "#f4efe0", "#86583e");
                if (side < 0) tag.rotation.y = Math.PI;
              }
            }
          }
        }
        const header = new THREE.Group();
        header.name = "centered-shelf-category-board";
        header.position.set(0, 1.995, 0);
        unit.add(header);
        const headerWidth = fresh ? 2.02 : 2.12, title = fresh ? "\u65B0\u9C9C\u6C34\u679C \xB7 \u65F6\u4EE4\u852C\u83DC" : "\u74DC\u5B50\xB7\u7EA2\u80A0\xB7\u65B9\u4FBF\u9762";
        sb(0, 0, 0, headerWidth, 0.16, 0.03, 15785912, header);
        for (const side of [-1, 1]) {
          const tag = label(0, 0, side * 0.017, headerWidth - 0.04, 0.13, title, header, "#f0dfb8", "#8b5840");
          if (side < 0) tag.rotation.y = Math.PI;
        }
        for (const x of [-headerWidth / 2 + 0.06, headerWidth / 2 - 0.06]) rod([x, 1.82, 0], [x, 2.055, 0], 0.012, 10262396, unit);
        shelfCategories.push({ root: unit, fresh, products, header });
      }
      label(1.54, 2.13, -0.58, 0.42, 0.12, "\u70ED\u8C46\u6D46", snowShop, "#ede5c9", "#7b5a42");
      const sugarJar = new THREE.Group();
      sugarJar.name = "sugar-jar";
      sugarJar.position.set(1.88, 1.58, -0.73);
      snowShop.add(sugarJar);
      sc(0, 0.12, 0, 0.087, 0.24, 15065033, sugarJar);
      sc(0, 0.253, 0, 0.095, 0.035, 10719080, sugarJar);
      label(0, 0.13, 0.09, 0.12, 0.1, "\u7CD6", sugarJar, "#e7d9b4", "#6f5d46");
      rod([0.035, 0.25, 0], [0.1, 0.34, 0.01], 8e-3, 11973531, sugarJar);
      const eggPot = new THREE.Group();
      eggPot.name = "corn-porridge-pot";
      eggPot.position.set(0.93, 1.57, -0.76);
      snowShop.add(eggPot);
      sc(0, 0.11, 0, 0.255, 0.19, 7503480, eggPot);
      sc(0, 0.207, 0, 0.243, 0.02, 14667672, eggPot);
      for (let i = 0; i < 27; i++) {
        const a = i * 2.399, r = Math.sqrt(i / 27) * 0.21;
        ball(Math.sin(a) * r, 0.223, Math.cos(a) * r, 0.015, 0.011, 0.019, i % 3 ? 15456672 : 13481845, eggPot);
      }
      for (const side of [-1, 1]) sb(side * 0.3, 0.15, 0, 0.12, 0.045, 0.07, 5463641, eggPot);
      label(0, 0.105, 0.264, 0.31, 0.095, "\u5927\u78B4\u7CA5", eggPot, "#66786e", "#eadfbd");
      odenCounter.children.slice().forEach((o) => {
        if (![bunsGroup, bunLid].includes(o)) o.removeFromParent();
      });
      bunsGroup.visible = bunLid.visible = false;
      const breakfast = new THREE.Group();
      breakfast.name = "neat-fresh-breakfast";
      snowShop.add(breakfast);
      sb(1.37, 1.51, -2.31, 1.6, 0.1, 0.73, 12035197, breakfast);
      for (let i = 0; i < 6; i++) {
        const x = 0.7 + i * 0.26;
        sb(x, 1.58, -2.31, 0.24, 0.035, 0.62, 14867138, breakfast);
        for (let j = 0; j < 3; j++) {
          const z = -2.51 + j * 0.19;
          if (i === 0) {
            ball(x, 1.66, z, 0.062, 0.08, 0.06, 9986106, breakfast);
          } else if (i === 1) {
            ball(x, 1.66, z, 0.078, 0.075, 0.077, 15655109, breakfast);
            for (let k = 0; k < 4; k++) {
              const a = k * Math.PI / 2;
              rod([x, 1.735, z], [x + Math.sin(a) * 0.035, 1.72, z + Math.cos(a) * 0.035], 5e-3, 13087884, breakfast);
            }
          } else if (i === 2) {
            sc(x, 1.64, z, 0.088, 0.075, 13013840, breakfast);
            for (let k = 0; k < 7; k++) ball(x + Math.sin(k * 2.4) * 0.052, 1.681, z + Math.cos(k * 2.4) * 0.052, 8e-3, 3e-3, 5e-3, 15325354, breakfast);
          } else if (i === 3) {
            ball(x, 1.67, z, 0.069, 0.08, 0.069, 14008195, breakfast);
          } else if (i === 5) {
            const corn = sc(x, 1.65, z, 0.048, 0.15, 14793822, breakfast);
            corn.rotation.x = Math.PI / 2;
            for (let k = 0; k < 5; k++) ball(x, 1.7, z - 0.06 + k * 0.03, 0.035, 9e-3, 9e-3, 15783043, breakfast);
          } else for (const dx of [-0.03, 0.03]) ball(x + dx, 1.65, z, 0.025, 0.035, 0.08, 12814915, breakfast);
        }
      }
      const breakfastBanner = new THREE.Group();
      breakfastBanner.name = "breakfast-new-arrivals-banner";
      breakfastBanner.position.set(1.37, 2, -2.54);
      breakfast.add(breakfastBanner);
      sb(0, 0, 0, 1.7, 0.2, 0.055, 9529678, breakfastBanner);
      label(0, 0, 0.031, 1.63, 0.16, "\u716E\u82DE\u7C73\u3001\u8336\u53F6\u86CB\u65B0\u4E0A\u5E02", breakfastBanner, "#91694e", "#f1e4bc");
      const breakfastSupports = [];
      for (const x of [0.59, 2.15]) breakfastSupports.push(rod([x, 1.56, -2.54], [x, 2.075, -2.54], 0.016, 7440255, breakfast));
      function fruitCrate(x, z, name, color) {
        const g = new THREE.Group();
        g.name = "winter-fruit-" + name;
        g.position.set(x, 0.57, z);
        snowShop.add(g);
        sb(0, 0.07, 0, 0.85, 0.13, 0.6, wood, g);
        for (const s of [-1, 1]) {
          sb(s * 0.42, 0.22, 0, 0.04, 0.29, 0.65, wood, g);
          sb(0, 0.22, s * 0.3, 0.85, 0.29, 0.035, wood, g);
        }
        for (let i = 0; i < 9; i++) {
          const xx = -0.27 + i % 3 * 0.27, zz = -0.19 + Math.floor(i / 3) * 0.19;
          ball(xx, 0.33, zz, 0.11, name === "\u51BB\u68A8" ? 0.11 : 0.072, 0.11, color, g);
          if (name === "\u51BB\u68A8") rod([xx, 0.42, zz], [xx + 0.012, 0.49, zz - 8e-3], 9e-3, 6969400, g);
          else for (let k = 0; k < 4; k++) {
            const a = k * Math.PI / 2;
            ball(xx + Math.sin(a) * 0.04, 0.405, zz + Math.cos(a) * 0.04, 0.05, 0.01, 0.025, 7105091, g);
          }
        }
        label(0, 0.22, 0.326, 0.7, 0.15, name + "  \xA53", g, "#d2b78b", "#664b36");
        return g;
      }
      const fruitCrates = [fruitCrate(-3.75, 1.32, "\u51BB\u68A8", 6901820), fruitCrate(1.57, 1.32, "\u51BB\u67FF\u5B50", 13205317)];
      const iceFreezer = new THREE.Group();
      iceFreezer.name = "popsicle-chest";
      iceFreezer.position.set(-5.35, 0.28, 1.45);
      snowShop.add(iceFreezer);
      sb(0, 0.105, 0, 0.98, 0.21, 0.69, 11849417, iceFreezer);
      for (const x of [-0.45, 0.45]) sb(x, 0.54, 0, 0.08, 0.86, 0.69, 11849417, iceFreezer);
      for (const z of [-0.305, 0.305]) sb(0, 0.54, z, 0.88, 0.86, 0.08, 11849417, iceFreezer);
      sb(0, 0.22, 0, 0.81, 0.035, 0.51, 15002076, iceFreezer);
      for (let i = 0; i < 12; i++) {
        const x = -0.3 + i % 4 * 0.2, z = -0.19 + Math.floor(i / 4) * 0.18;
        sb(x, 0.63, z, 0.1, 0.39, 0.08, i % 3 ? 15128749 : 14137227, iceFreezer);
        sb(x, 0.4, z, 0.024, 0.15, 0.022, 12163948, iceFreezer);
      }
      label(0, 0.48, 0.354, 0.78, 0.18, "\u8001\u51B0\u68CD", iceFreezer, "#bdd5ca", "#456d69");
      const freezerLid = new THREE.Group();
      freezerLid.position.set(0, 0.94, -0.33);
      freezerLid.userData.snowDynamic = true;
      iceFreezer.add(freezerLid);
      for (const x of [-0.485, 0.485]) sb(x, 0.025, 0.33, 0.07, 0.08, 0.75, 15264220, freezerLid);
      for (const z of [-0.01, 0.67]) sb(0, 0.025, z, 0.9, 0.08, 0.07, 15264220, freezerLid);
      const freezerGlass = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.025, 0.61), new THREE.MeshPhysicalMaterial({ color: 12705237, transparent: true, opacity: 0.2, roughness: 0.12, clearcoat: 0.75, depthWrite: false }));
      freezerGlass.name = "clear-freezer-glass-lid";
      freezerGlass.position.set(0, 0.025, 0.33);
      freezerLid.add(freezerGlass);
      for (const x of [-0.14, 0.14]) sb(x, 0.052, 0.6, 0.035, 0.04, 0.035, 6983563, freezerLid);
      sb(0, 0.085, 0.6, 0.34, 0.04, 0.035, 6983563, freezerLid);
      snowBind(iceFreezer, "icecream");
      const popsicle = new THREE.Group();
      popsicle.name = "popsicle";
      popsicle.position.set(0, 0.57, 0);
      popsicle.userData.snowDynamic = true;
      iceFreezer.add(popsicle);
      sb(0, 0, 0, 0.027, 0.19, 0.018, 12821617, popsicle);
      const oldMilkIce = sb(0, 0.19, 0, 0.14, 0.28, 0.065, 15786943, popsicle);
      oldMilkIce.name = "rectangular-old-milk-popsicle";
      popsicle.visible = false;
      let freezerOpen = false, freezerAmount = 0;
      const freezerCycle = { phase: "closed", at: 0, lift: 0 };
      snowBind(popsicle, "takeIcecream");
      snowTown.add(bike);
      bike.position.set(0.45, 0.28, -3.86);
      bike.rotation.y = 0;
      bike.traverse((o) => {
        if (o.isMesh && o.material && !o.material.map) {
          o.material = o.material.clone();
          if (o.material.color.getHex() === 11258297) o.material.color.setHex(6913136);
        }
      });
      snowShop.add(windowFog);
      snowShop.add(fogHit);
      windowFog.visible = fogHit.visible = true;
      windowFog.material.opacity = 0.2;
      const villageBuildings = {}, villageMechanisms = { repairOpen: false, repairAmount: 0, grainOpen: false, grainAmount: 0, hearthOpen: false, hearthAmount: 0, ovenOpen: false, ovenAmount: 0, wheelAt: -100, woodAt: -100, homeOpen: false, homeAmount: 0, deliOpen: false, deliAmount: 0 };
      function villageRoot(key, name, x, z, w, d, rotation = 0) {
        const g = new THREE.Group();
        const cfg = snowLayout[key];
        g.position.set(cfg.x, 0, cfg.z);
        g.scale.setScalar(cfg.scale);
        g.rotation.y = cfg.yaw;
        g.name = name;
        g.userData.buildingKind = key;
        g.userData.footprint = [w, d];
        snowStatic.add(g);
        villageBuildings[key] = { root: g, name, width: w, depth: d };
        return g;
      }
      function villageShell(g, w, d, h, c, rearWindow = false) {
        sb(0, 0.43, 0, w + 0.15, 0.3, d + 0.15, 8355448, g);
        sb(-w / 2, h / 2 + 0.5, 0, 0.11, h, d, c, g);
        sb(w / 2, h / 2 + 0.5, 0, 0.11, h, d, c, g);
        if (!rearWindow) sb(0, h / 2 + 0.5, -d / 2, w, h, 0.11, c, g);
        sb(0, 0.59, 0, w, 0.045, d, 11969674, g);
      }
      function villageWindowWall(parent, { x = 0, z = 0, width, height, y, color, windowWidth, windowHeight, windowY = y, rotation = 0, curtain = false }) {
        const g = new THREE.Group();
        g.name = "wall-with-real-window-opening";
        g.position.set(x, 0, z);
        g.rotation.y = rotation;
        parent.add(g);
        const bottom = y - height / 2, top = y + height / 2, lower = windowY - windowHeight / 2, upper = windowY + windowHeight / 2, side = (width - windowWidth) / 2;
        for (const s of [-1, 1]) sb(s * (windowWidth + side) / 2, y, 0, side, height, 0.13, color, g);
        sb(0, (bottom + lower) / 2, 0, windowWidth, lower - bottom, 0.13, color, g);
        sb(0, (upper + top) / 2, 0, windowWidth, top - upper, 0.13, color, g);
        const window2 = villageWindow(g, 0, windowY, 0.095, windowWidth, windowHeight, { curtain, glassOnly: true });
        window2.name = "new-building-window";
        return window2;
      }
      function monoRoof(g, w, d, y, rise, c = 6583669) {
        const a = Math.atan2(rise, d), length = Math.hypot(d, rise);
        for (const [dy, h, color] of [[0, 0.1, c]]) {
          const o = sb(0, y + dy, 0, w + 0.38, h, length + 0.35, color, g);
          o.rotation.x = -a;
        }
        for (let i = 0; i < 9; i++) {
          const x = -w / 2 + i * w / 8;
          ball(x, y + rise / 2 + 0.15, d / 2 + 0.11, 0.21, 0.08, 0.14, snowWhite, g);
        }
      }
      function chimney(g, x, z, y) {
        const root = new THREE.Group();
        root.name = "interactive-chimney";
        g.add(root);
        sb(x, y - 0.48, z, 0.37, 1.05, 0.4, 8939869, root);
        for (const dx of [-0.19, 0.19]) sb(x + dx, y + 0.08, z, 0.07, 0.17, 0.48, 9270630, root);
        for (const dz of [-0.2, 0.2]) sb(x, y + 0.08, z + dz, 0.32, 0.17, 0.07, 9270630, root);
        const opening = sb(x, y + 0.04, z, 0.28, 0.014, 0.3, 2371898, root);
        opening.material = new THREE.MeshBasicMaterial({ color: 2371898 });
        for (const dx of [-0.2, 0.2]) sb(x + dx, y + 0.18, z, 0.07, 0.035, 0.48, snowWhite, root);
        smoke(x, y + 0.22, z, g);
        const q = { root, parent: g, origin: new THREE.Vector3(x, y + 0.25, z), at: -100, puffs: [] };
        for (let i = 0; i < 7; i++) {
          const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffMap, transparent: true, opacity: 0, depthWrite: false }));
          g.add(p);
          q.puffs.push(p);
        }
        snowBind(root, "chimney");
        root.traverse((o) => o.userData.chimney = q);
        snowChimneys.push(q);
        return root;
      }
      function villageWindow(g, x, y, z, w, h, { curtain = true, glassOnly = false } = {}) {
        const root = new THREE.Group();
        root.userData.snowWindow = { width: w, height: h };
        root.position.set(x, y, z);
        g.add(root);
        for (const xx of [-w / 2, w / 2]) sb(xx, 0, 0, 0.055, h + 0.1, 0.09, 8025189, root);
        for (const yy of [-h / 2, h / 2]) sb(0, yy, 0, w + 0.08, 0.055, 0.09, 8025189, root);
        sb(0, 0, 0.035, 0.035, h, 0.04, 9733228, root);
        sb(0, 0, 0.038, w, 0.035, 0.04, 9733228, root);
        sb(0, -h / 2 - 0.05, 0.04, w + 0.23, 0.12, 0.25, snowWhite, root);
        const pane2 = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshPhysicalMaterial({ color: 16177068, transparent: true, opacity: glassOnly ? 0.12 : 0.21, roughness: 0.2, depthWrite: false, side: THREE.DoubleSide }));
        pane2.position.z = 0.01;
        root.add(pane2);
        if (curtain) {
          const curtains = new THREE.Group();
          curtains.userData.snowDynamic = true;
          curtains.userData.open = false;
          curtains.userData.amount = 0;
          curtains.userData.width = w;
          root.add(curtains);
          for (const side of [-1, 1]) {
            const panel = sb(side * w * 0.25, 0, -0.055, w * 0.5, h * 0.99, 0.025, 11832432, curtains);
            panel.userData.side = side;
          }
          houseWindows.push(curtains);
          snowHit("window", 0, 0, 0.08, w, h, 0.08, root).userData.window = curtains;
        }
        return root;
      }
      function villageDoors(g, width, height, z, action, color) {
        const leaves2 = [];
        for (const side of [-1, 1]) {
          const pivot = new THREE.Group();
          pivot.position.set(side * width / 2, 0.55, z);
          pivot.userData.snowDynamic = true;
          g.add(pivot);
          const cx = -side * width / 4;
          sb(cx, height / 2, 0, width / 2 - 0.025, height, 0.075, color, pivot);
          for (let j = 0; j < 5; j++) sb(cx - width * 0.2 + j * width * 0.1, height / 2, 0.046, 0.013, height - 0.07, 0.012, 9009505, pivot);
          sb(cx, height * 0.73, 0.05, width * 0.39, 0.07, 0.025, 7040612, pivot);
          sb(cx, height * 0.22, 0.05, width * 0.39, 0.07, 0.025, 7040612, pivot);
          sb(-side * 0.09, height * 0.49, 0.064, 0.035, 0.22, 0.035, 12956043, pivot);
          snowBind(pivot, action);
          leaves2.push({ root: pivot, side });
        }
        return leaves2;
      }
      const residence = villageRoot("residence", "\u897F\u9662\u7095\u623F", -8.7, -4.7, 4.4, 3.3, 0.12);
      residence.scale.x *= 1.15;
      villageShell(residence, 4.4, 3.3, 2.05, 9991530, true);
      villageBuildings.residence.rearWindow = villageWindowWall(residence, { z: -1.65, width: 4.4, height: 2.05, y: 1.525, color: 9991530, windowWidth: 1.75, windowHeight: 0.95, windowY: 1.68, rotation: Math.PI, curtain: true });
      sb(0, 0.85, 1.65, 4.4, 0.58, 0.11, 9991530, residence);
      sb(0, 2.39, 1.65, 4.4, 0.32, 0.11, 9991530, residence);
      for (const [x, w] of [[-2.04, 0.33], [-0.57, 0.39], [0.57, 0.39], [2.04, 0.33]]) sb(x, 1.65, 1.65, w, 1.1, 0.11, 9991530, residence);
      roof(0, 0, 4.95, 3.83, 2.65, 0.9, residence);
      chimney(residence, 1.28, -0.41, 3.9);
      for (let y = 0.71; y < 2.5; y += 0.24) {
        sb(-2.26, y, 0, 0.012, 0.012, 3.2, 11374977, residence);
        if (y < 1.205 || y > 2.155) sb(0, y, -1.73, 4.35, 0.012, 8e-3, 11374977, residence);
        else for (const s of [-1, 1]) sb(s * 1.55, y, -1.73, 1.25, 0.012, 8e-3, 11374977, residence);
      }
      villageWindow(residence, -1.3, 1.68, 1.72, 1.05, 1);
      villageWindow(residence, 1.3, 1.68, 1.72, 1.05, 1, { curtain: true, glassOnly: true });
      label(0, 2.34, 1.75, 1.04, 0.17, "\u4E94\u798F\u4E34\u95E8", residence, "#aa7054", "#e2c18c");
      for (const side of [-1, 1]) verticalLabel(side * 0.585, 1.43, 1.755, 0.14, 1.4, side < 0 ? "\u5E73\u5B89\u559C\u4E50" : "\u5C81\u5C81\u5E38\u5B89", residence, "#aa7054", "#e2c18c");
      const homeDoor = new THREE.Group();
      homeDoor.position.set(-0.45, 0.49, 1.74);
      homeDoor.userData.snowDynamic = true;
      residence.add(homeDoor);
      sb(0.45, 0.87, 0, 0.9, 1.74, 0.045, 8680288, homeDoor);
      const homeFuCloth = sb(0.45, 1, 0.029, 0.33, 0.33, 0.012, 10766647, homeDoor);
      homeFuCloth.rotation.z = Math.PI / 4;
      const homeFu = label(0.45, 1, 0.04, 0.25, 0.25, "\u798F", homeDoor, "transparent", "#e6c48c");
      homeFu.rotation.z = Math.PI;
      snowBind(homeDoor, "homeDoor");
      villageBuildings.residence.entryDoor = homeDoor;
      sb(0, 2.25, 1.65, 0.9, 0.04, 0.13, 9991530, residence);
      sb(0, 0.455, 1.95, 1.46, 0.22, 0.42, 10988195, residence);
      sb(0, 0.28, 2.27, 1.58, 0.13, 0.22, 11712430, residence);
      sb(-1.24, 0.83, 0.35, 1.57, 0.52, 1.5, 12098424, residence);
      sb(-1.24, 1.11, 0.32, 1.54, 0.1, 1.42, 10646115, residence);
      for (const x of [-1.62, -1.06, -0.6]) sb(x, 1.17, -0.13, 0.25, 0.03, 0.37, 12952202, residence);
      sb(-1.65, 1.23, 0.71, 0.48, 0.15, 0.26, 13088146, residence);
      const hearth = new THREE.Group();
      hearth.position.set(1.28, 0.56, -0.3);
      residence.add(hearth);
      sb(0, 0.52, 0, 0.76, 1.04, 0.67, 8483688, hearth);
      sb(0, 1.08, 0, 0.89, 0.09, 0.78, 6186597, hearth);
      sc(0, 1.53, -0.11, 0.075, 0.84, 6843237, hearth);
      const hearthFire = sb(0, 0.62, 0.347, 0.48, 0.43, 0.025, 15114851, hearth, 1.25);
      const hearthDoor = new THREE.Group();
      hearthDoor.position.set(-0.29, 0.62, 0.38);
      hearthDoor.userData.snowDynamic = true;
      hearth.add(hearthDoor);
      sb(0.29, 0, 0, 0.59, 0.53, 0.055, 5661023, hearthDoor);
      sb(0.48, 0, 0.045, 0.035, 0.17, 0.035, 11704946, hearthDoor);
      snowBind(hearthDoor, "hearth");
      const homeLamp = new THREE.PointLight(16760700, 2.4, 4.6, 2);
      homeLamp.position.set(-0.5, 1.8, 0.2);
      residence.add(homeLamp);
      villageBuildings.residence.hearth = hearth;
      villageBuildings.residence.door = hearthDoor;
      const repair = villageRoot("repair", "\u540E\u8857\u4FEE\u7406\u94FA", -4.3, -10.55, 4.8, 3.2, -0.06);
      repair.scale.y *= 1.15;
      repair.position.y = 0.33 - 0.6125 * repair.scale.y;
      villageShell(repair, 4.8, 3.2, 1.95, 8360593);
      for (let x = -2.38; x < 2.4; x += 0.25) sb(x, 1.53, -1.67, 0.025, 1.92, 0.018, 10594977, repair);
      sb(-2.16, 1.51, 1.6, 0.47, 1.92, 0.11, 8360593, repair);
      sb(2.16, 1.51, 1.6, 0.47, 1.92, 0.11, 8360593, repair);
      sb(0, 2.35, 1.6, 4.8, 0.32, 0.11, 8360593, repair);
      monoRoof(repair, 4.8, 3.2, 2.7, 0.48);
      sb(0, 2.67, 1.6, 4.8, 0.43, 0.11, 8360593, repair);
      for (const x of [-2.4, 2.4]) {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute([x, 2.44, -1.6, x, 2.44, 1.6, x, 2.94, 1.6, x, 2.46, -1.6], 3));
        geo.setIndex([0, 1, 2, 0, 2, 3]);
        geo.computeVertexNormals();
        const material = mat(8360593).clone();
        material.side = THREE.DoubleSide;
        repair.add(new THREE.Mesh(geo, material));
      }
      const repairShutter = new THREE.Group();
      repairShutter.position.set(0, 0.55, 1.7);
      repairShutter.userData.snowDynamic = true;
      repair.add(repairShutter);
      for (let j = 0; j < 15; j++) sb(0, (j + 0.5) * 1.86 / 15, 0, 3.76, 1.86 / 15 - 8e-3, 0.065, j % 2 ? 7569786 : 8622474, repairShutter);
      sb(0, 0.1, 0.06, 0.4, 0.05, 0.035, 12760719, repairShutter);
      snowBind(repairShutter, "repairDoor");
      const repairDoors = [{ root: repairShutter, side: 0 }];
      const repairRoll = sc(0, 2.53, 1.72, 0.15, 3.85, 7899008, repair);
      repairRoll.rotation.z = Math.PI / 2;
      snowBind(repairRoll, "repairDoor");
      const repairSign = label(0, 2.79, 1.82, 1.74, 0.14, "\u8865\u80CE \xB7 \u4FEE\u7406", repair, "#cfbf95", "#465957");
      snowBind(repairSign, "repairDoor");
      const repairLamp = new THREE.PointLight(16766368, 0.22, 4.6, 2);
      repairLamp.position.set(-0.4, 2, 0.1);
      repair.add(repairLamp);
      sb(-0.4, 2.24, 0.1, 0.36, 0.06, 0.22, 16766884, repair, 0.7);
      sb(-1.48, 1.05, -0.85, 1.55, 0.13, 0.7, 10979937, repair);
      for (const x of [-2, -0.94]) sb(x, 0.8, -0.85, 0.09, 0.5, 0.46, 7106920, repair);
      sb(-1.4, 1.66, -1.48, 1.65, 0.91, 0.07, 6977391, repair);
      for (let j = 0; j < 5; j++) {
        const x = -2.04 + j * 0.3;
        rod([x, 1.4, -1.39], [x, 1.89, -1.39], 0.023, 12696486, repair);
        if (j % 2) sb(x, 1.89, -1.39, 0.16, 0.075, 0.04, 10390378, repair);
        else {
          const o = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.016, 6, 12, Math.PI * 1.5), mat(12696486));
          o.position.set(x, 1.94, -1.37);
          repair.add(o);
        }
      }
      const repairBike = new THREE.Group();
      repairBike.name = "cargo-tricycle";
      repairBike.position.set(0.55, 0.58, 0.05);
      repair.add(repairBike);
      const repairWheels = [];
      for (const [x, z] of [[-0.46, -0.48], [0.46, -0.48], [0, 0.7]]) {
        const wheel2 = new THREE.Group();
        wheel2.position.set(x, 0.32, z);
        wheel2.userData.snowDynamic = true;
        repairBike.add(wheel2);
        const tire = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.042, 7, 22), mat(3688528));
        tire.rotation.y = Math.PI / 2;
        wheel2.add(tire);
        for (let j = 0; j < 9; j++) {
          const a = j * Math.PI / 4.5;
          rod([0, 0, 0], [0, Math.cos(a) * 0.28, Math.sin(a) * 0.28], 7e-3, 10989730, wheel2);
        }
        snowBind(wheel2, "repairWheel");
        repairWheels.push(wheel2);
      }
      sb(0, 0.61, -0.51, 0.96, 0.11, 0.8, 8033414, repairBike);
      for (const x of [-0.49, 0.49]) sb(x, 0.82, -0.51, 0.06, 0.34, 0.83, 8033414, repairBike);
      sb(0, 0.82, -0.93, 0.98, 0.34, 0.06, 8033414, repairBike);
      rod([0, 0.36, 0.7], [0, 0.86, 0.44], 0.035, 9085331, repairBike);
      rod([0, 0.86, 0.44], [0, 0.9, -0.04], 0.027, 9085331, repairBike);
      sb(0, 0.96, -0.04, 0.3, 0.09, 0.29, 6774608, repairBike);
      rod([-0.27, 1.02, 0.53], [0.27, 1.02, 0.53], 0.026, 11974564, repairBike);
      for (const x of [1.75, 2]) {
        const tire = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.065, 7, 20), mat(4608339));
        tire.position.set(x, 0.64, -0.9);
        repair.add(tire);
      }
      label(-1.47, 1.15, -0.47, 0.67, 0.14, "\u4FEE\u4FEE\u8FD8\u80FD\u9A91", repair, "#d7c5a2", "#67543c");
      villageBuildings.repair.doors = repairDoors;
      villageBuildings.repair.wheels = repairWheels;
      const grain = villageRoot("grain", "\u4E1C\u9662\u7CAE\u4ED3", 2.4, -10.3, 4.1, 3.3, -0.11);
      grain.scale.x *= 1.35;
      for (const x of [-1.7, 0, 1.7]) for (const z of [-1.25, 1.25]) sb(x, 0.54, z, 0.42, 0.52, 0.43, 9203812, grain);
      sb(0, 0.84, 0, 4.35, 0.16, 3.52, 9205595, grain);
      villageBuildings.grain.sideWindows = [];
      for (const side of [-1, 1]) villageBuildings.grain.sideWindows.push(villageWindowWall(grain, { x: side * 2.05, width: 3.3, height: 2.03, y: 1.93, color: 10191972, windowWidth: 2, windowHeight: 1.25, rotation: side * Math.PI / 2 }));
      sb(0, 1.93, -1.65, 4.1, 2.03, 0.13, 10191972, grain);
      for (let j = 0; j < 10; j++) {
        const y = 1 + j * 0.2;
        if (y < 1.305 || y > 2.555) {
          sb(-2.13, y, 0, 0.015, 0.022, 3.3, 6839112, grain);
          sb(2.13, y, 0, 0.015, 0.022, 3.3, 6839112, grain);
        } else for (const side of [-1, 1]) for (const end of [-1, 1]) sb(side * 2.13, y, end * 1.325, 0.015, 0.022, 0.65, 6839112, grain);
        sb(0, y, -1.73, 4.1, 0.022, 0.015, 6839112, grain);
      }
      sb(-1.75, 1.95, 1.65, 0.6, 2.03, 0.12, 10191972, grain);
      sb(1.75, 1.95, 1.65, 0.6, 2.03, 0.12, 10191972, grain);
      sb(0, 2.89, 1.65, 4.1, 0.32, 0.12, 10191972, grain);
      roof(0, 0, 4.65, 3.86, 3.12, 1.1, grain);
      const grainDoors = villageDoors(grain, 2.85, 1.76, 1.75, "grainDoor", 10124371);
      grainDoors.forEach(({ root }) => root.position.y = 0.94);
      sb(0, 0.43, 2.14, 1.8, 0.22, 0.48, 10725279, grain);
      sb(0, 0.66, 1.95, 1.65, 0.22, 0.36, 11645863, grain);
      label(0, 3.6, 1.951, 1.6, 0.2, "\u4E1C\u9662\u7CAE\u4ED3", grain, "#c6b28a", "#6f573a");
      const grainLamp = new THREE.PointLight(16764042, 0.15, 4.4, 2);
      grainLamp.position.set(0, 2.5, 0);
      grain.add(grainLamp);
      sb(0, 2.76, 0, 0.28, 0.08, 0.18, 16765595, grain, 0.6);
      const loft = label(0, 3.4, 1.69, 0.45, 0.37, "\u4E30", grain, "#977957", "#d9c69b");
      for (let j = 0; j < 8; j++) {
        const x = j % 2 ? -1.3 : 1.25, z = -0.95 + Math.floor(j / 2) * 0.52;
        ball(x, 1.2, z, 0.35, 0.38, 0.3, 12823932, grain);
        sc(x, 1.55, z, 0.12, 0.06, 10718563, grain);
      }
      sb(0, 1.06, -0.97, 0.96, 0.2, 0.65, 7628877, grain);
      for (let j = 0; j < 10; j++) ball(-0.36 + j % 4 * 0.23, 1.25, -1.12 + Math.floor(j / 4) * 0.19, 0.12, 0.09, 0.1, 13214313, grain);
      villageBuildings.grain.doors = grainDoors;
      const bakery = villageRoot("bakery", "\u96EA\u4E61\u719F\u98DF\u5E97", 8.8, -2.6, 4.7, 3, -0.12);
      villageShell(bakery, 4.7, 3, 2.04, 12892833);
      sb(-0.62, 0.93, 1.5, 3.22, 0.76, 0.11, 12892833, bakery);
      sb(-0.62, 2.41, 1.5, 3.22, 0.29, 0.11, 12892833, bakery);
      sb(-2.27, 1.68, 1.5, 0.18, 1.02, 0.12, 12892833, bakery);
      sb(1.06, 1.68, 1.5, 0.18, 1.02, 0.12, 12892833, bakery);
      sb(2.27, 1.53, 1.5, 0.18, 1.94, 0.12, 12892833, bakery);
      roof(0, 0, 5.18, 3.55, 2.65, 0.63, bakery);
      chimney(bakery, -1.66, -0.8, 3.7);
      villageWindow(bakery, -0.62, 1.77, 1.58, 2.99, 0.9, { curtain: false, glassOnly: true });
      const deliDoor = new THREE.Group();
      deliDoor.position.set(2.14, 0.55, 1.53);
      deliDoor.userData.snowDynamic = true;
      bakery.add(deliDoor);
      sb(-0.46, 0.85, 0, 0.92, 1.7, 0.065, 8878684, deliDoor);
      snowBind(deliDoor, "deliDoor");
      villageBuildings.bakery.entryDoor = deliDoor;
      label(-0.46, 1.2, 0.043, 0.55, 0.2, "\u6B63\u5B97", deliDoor, "#ceb88b", "#82593b");
      label(-0.45, 2.47, 1.67, 2.75, 0.26, "\u5364\u5473 \xB7 \u719F\u98DF", bakery, "#d9bd8c", "#7a4534");
      sb(-0.62, 1.25, 0.98, 2.81, 0.13, 0.78, 10848864, bakery);
      for (let j = 0; j < 7; j++) {
        const xx = -1.62 + j * 0.33;
        ball(xx, 1.39, 0.9, 0.14, 0.09, 0.2, [10248511, 10646096, 8539186][j % 3], bakery);
        if (j % 2 === 0) rod([xx, 1.42, 0.76], [xx + 0.05, 1.43, 0.66], 0.035, 12822144, bakery);
      }
      for (let j = 0; j < 5; j++) sb(-1.42 + j * 0.4, 1.38, 1.13, 0.24, 0.07, 0.19, j % 2 ? 12023634 : 11964525, bakery);
      const bakeryOven = new THREE.Group();
      bakeryOven.position.set(-0.86, 0.56, -0.65);
      bakery.add(bakeryOven);
      bakeryOven.name = "hollow-roasting-oven";
      bakeryOven.userData.snowDynamic = true;
      for (const side of [-1, 1]) sb(side * 0.645, 0.7, 0, 0.19, 1.4, 0.92, 10188385, bakeryOven);
      sb(0, 0.2575, 0, 1.1, 0.515, 0.92, 10188385, bakeryOven);
      sb(0, 1.2825, 0, 1.1, 0.235, 0.92, 10188385, bakeryOven);
      sb(0, 0.84, -0.435, 1.1, 0.65, 0.05, 6576971, bakeryOven);
      sb(0, 0.6, 0, 1.02, 0.035, 0.72, 6910051, bakeryOven);
      sb(0, 0.83, -0.4, 0.95, 0.48, 0.012, 12749388, bakeryOven, 0.3);
      const roastMeats = new THREE.Group();
      roastMeats.name = "meat-inside-oven";
      bakeryOven.add(roastMeats);
      for (let j = 0; j < 4; j++) {
        ball(-0.36 + j * 0.24, 0.7, 0.1, 0.09, 0.065, 0.14, 10906437, roastMeats);
        rod([-0.36 + j * 0.24, 0.73, 0.19], [-0.36 + j * 0.24, 0.75, 0.26], 0.018, 13350283, roastMeats);
      }
      villageBuildings.bakery.roastingOven = bakeryOven;
      villageBuildings.bakery.roastMeats = roastMeats;
      const ovenDoor = new THREE.Group();
      ovenDoor.position.set(0, 0.5, 0.51);
      ovenDoor.userData.snowDynamic = true;
      bakeryOven.add(ovenDoor);
      sb(0, 0.33, 0, 1.22, 0.65, 0.06, 6712160, ovenDoor);
      sb(0, 0.36, 0.052, 0.41, 0.05, 0.045, 11575677, ovenDoor);
      snowBind(ovenDoor, "oven");
      const foodLamp = new THREE.PointLight(16761220, 2.7, 4.3, 2);
      foodLamp.position.set(-0.6, 1.85, 0.45);
      bakery.add(foodLamp);
      const annex = new THREE.Group();
      annex.name = "deli-kitchen";
      annex.position.set(2.88, 0, -0.15);
      bakery.add(annex);
      sb(-0.48, 1.18, 0, 0.1, 1.3, 2.4, 10983289, annex);
      sb(0.48, 1.18, 0, 0.1, 1.3, 2.4, 10983289, annex);
      sb(0, 1.18, -1.2, 0.96, 1.3, 0.1, 10983289, annex);
      sb(0, 0.67, 1.2, 0.96, 0.28, 0.1, 10983289, annex);
      sb(0, 1.83, 1.2, 0.96, 0.22, 0.1, 10983289, annex);
      for (const x of [-0.43, 0.43]) sb(x, 1.28, 1.2, 0.12, 0.98, 0.1, 10983289, annex);
      monoRoof(annex, 1.22, 2.65, 2.07, 0.32, 7961192);
      villageWindow(annex, 0, 1.28, 1.26, 0.72, 0.78, { curtain: false, glassOnly: true });
      label(0, 1.81, 1.28, 0.7, 0.12, "\u540E\u53A8", annex, "#c4b18c", "#74563a");
      sb(0, 1, 0.58, 0.7, 0.08, 0.65, 12367259, annex);
      sc(0, 1.12, 0.58, 0.22, 0.16, 7831931, annex);
      villageBuildings.bakery.oven = ovenDoor;
      const woodshed = villageRoot("woodshed", "\u897F\u8FB9\u67F4\u706B\u68DA", -12.45, 0, 2.1, 2.15, 0.19);
      sb(0, 0.43, 0, 2.3, 0.23, 2.3, 9341307, woodshed);
      for (const x of [-1.04, 1.04]) for (const z of [-1.02, 1.02]) {
        const top = 2.1 - 0.05 / Math.cos(Math.atan2(0.36, 2.45)) + z * 0.36 / 2.45;
        const post = sb(x, (0.545 + top) / 2, z, 0.095, top - 0.545, 0.095, wood, woodshed);
        post.name = "roof-touching-woodshed-post";
      }
      sb(0, 1.18, -1.02, 2.1, 1.35, 0.07, 9468763, woodshed);
      for (let j = 0; j < 6; j++) sb(-1.02, 1.16, -0.86 + j * 0.34, 0.065, 1.15, 0.13, 9600352, woodshed);
      monoRoof(woodshed, 2.38, 2.45, 2.1, 0.36, 7042669);
      label(0, 1.91, 1.13, 1.06, 0.18, "\u67F4\u706B\u68DA", woodshed, "#c4b18a", "#665439");
      for (let layer = 0; layer < 5; layer++) for (let j = 0; j < 6; j++) {
        const o = sc(-0.76 + j * 0.28, 0.65 + layer * 0.19, -0.43, 0.105, 0.79, 10386771, woodshed);
        o.rotation.x = Math.PI / 2;
      }
      const woodBundle = new THREE.Group();
      woodBundle.position.set(0, 0.66, 0.5);
      woodBundle.userData.snowDynamic = true;
      woodshed.add(woodBundle);
      for (let j = 0; j < 5; j++) {
        const o = sc(-0.52 + j * 0.26, j % 2 ? 0.14 : 0, 0, 0.1, 0.77, 10781528, woodBundle);
        o.rotation.x = Math.PI / 2;
      }
      rod([-0.58, 0.16, 0], [0.58, 0.16, 0], 0.016, 11903357, woodBundle);
      snowBind(woodBundle, "woodBundle");
      villageBuildings.woodshed.bundle = woodBundle;
      function villageBuildingAction(action, t) {
        const pairs = { repairDoor: "repairOpen", grainDoor: "grainOpen", hearth: "hearthOpen", oven: "ovenOpen", homeDoor: "homeOpen", deliDoor: "deliOpen" };
        if (pairs[action]) {
          villageMechanisms[pairs[action]] = !villageMechanisms[pairs[action]];
          return true;
        }
        if (action === "repairWheel") {
          villageMechanisms.wheelAt = t;
          return true;
        }
        if (action === "woodBundle") {
          villageMechanisms.woodAt = t;
          return true;
        }
        return false;
      }
      function animateVillageBuildings(t, dt) {
        const v = villageMechanisms;
        for (const [a2, b] of [["repairAmount", "repairOpen"], ["grainAmount", "grainOpen"], ["hearthAmount", "hearthOpen"], ["ovenAmount", "ovenOpen"], ["homeAmount", "homeOpen"], ["deliAmount", "deliOpen"]]) v[a2] = THREE.MathUtils.damp(v[a2], v[b] ? 1 : 0, 4, dt);
        repairShutter.position.y = 0.55 + v.repairAmount * 1.86;
        repairShutter.scale.y = Math.max(0.03, 1 - v.repairAmount * 0.97);
        grainDoors.forEach(({ root, side }) => root.rotation.y = side * v.grainAmount * 1.33);
        homeDoor.rotation.y = -v.homeAmount * 1.5;
        deliDoor.rotation.y = v.deliAmount * 1.5;
        hearthDoor.rotation.y = -v.hearthAmount * 1.28;
        ovenDoor.rotation.x = v.ovenAmount * 1.42;
        homeLamp.intensity = 2 + v.hearthAmount * 0.8;
        repairLamp.intensity = 0.22 + v.repairAmount * 3.3;
        grainLamp.intensity = 0.15 + v.grainAmount * 3;
        const wa = t - v.wheelAt;
        if (wa >= 0 && wa < 6) repairWheels.forEach((o) => o.rotation.x += dt * 5.5 * Math.pow(1 - wa / 6, 2));
        const a = t - v.woodAt, p = a >= 0 && a < 5 ? Math.sin(a / 5 * Math.PI) : 0;
        woodBundle.position.z = 0.5 + p * 0.38;
        woodBundle.position.y = 0.66 + p * 0.17;
      }
      function resetVillageBuildings() {
        for (const k of ["repairOpen", "grainOpen", "hearthOpen", "ovenOpen", "homeOpen", "deliOpen"]) villageMechanisms[k] = false;
        for (const k of ["repairAmount", "grainAmount", "hearthAmount", "ovenAmount", "homeAmount", "deliAmount"]) villageMechanisms[k] = 0;
        villageMechanisms.wheelAt = villageMechanisms.woodAt = -100;
        repairShutter.position.y = 0.55;
        repairShutter.scale.y = 1;
        grainDoors.forEach(({ root }) => root.rotation.y = 0);
        homeDoor.rotation.y = deliDoor.rotation.y = hearthDoor.rotation.y = ovenDoor.rotation.x = 0;
        woodBundle.position.set(0, 0.6, 0.5);
        repairWheels.forEach((o) => o.rotation.x = 0);
      }
      function fenceLine(a, b, height = 0.8, parent = snowStatic, color = 8484702) {
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(len / 0.56);
        for (let i = 0; i <= n; i++) {
          const x = THREE.MathUtils.lerp(a[0], b[0], i / n), z = THREE.MathUtils.lerp(a[1], b[1], i / n);
          sb(x, 0.28 + height / 2, z, 0.075, height, 0.075, color, parent);
          ball(x, 0.3 + height, z, 0.085, 0.04, 0.085, snowWhite, parent);
        }
        for (const y of [0.53, height + 0.18]) rod([a[0], y, a[1]], [b[0], y, b[1]], 0.026, color, parent);
      }
      fenceLine([-14.289, -2.355], [-15.1, -2.355]);
      fenceLine([-15.1, -2.355], [-15.1, 3.35]);
      fenceLine([-15.1, 3.35], [-7.3, 3.35]);
      fenceLine([-7.711, -2.355], [-7.3, -2.355]);
      fenceLine([-7.3, -2.355], [-7.3, 1.8]);
      const homeSausageStrings = [];
      for (const side of [-1, 1]) {
        const strand = new THREE.Group();
        strand.name = "linked-dried-sausage-string";
        strand.position.set(side * 2.02, 2.63, 1.87);
        residence.add(strand);
        homeSausageStrings.push(strand);
        for (let j = 0; j < 4; j++) {
          const y = -0.11 - j * 0.235;
          sc(0, y, 0, 0.037, 0.19, 9525569, strand);
          for (const dy of [-0.095, 0.095]) ball(0, y + dy, 0, 0.037, 0.023, 0.037, 9525569, strand);
          rod([0, y - 0.113, 0], [0, y - 0.14, 0], 9e-3, 11836530, strand);
        }
        rod([0, 0.02, 0], [0, -0.015, 0], 9e-3, 11836530, strand);
      }
      for (let layer = 0; layer < 4; layer++) for (let i = 0; i < 6; i++) {
        const o = sc(-9.8 + i * 0.25, 0.45 + layer * 0.17, -14.45, 0.1, 0.67, 10189649);
        o.rotation.x = Math.PI / 2;
      }
      const snowman = new THREE.Group();
      snowman.position.set(-8.1, 0.29, 1.4);
      snowTown.add(snowman);
      ball(0, 0.43, 0, 0.49, 0.46, 0.47, snowWhite, snowman);
      ball(0.02, 1, 0, 0.35, 0.34, 0.34, snowWhite, snowman);
      ball(0.04, 1.48, 0.02, 0.25, 0.25, 0.25, snowWhite, snowman);
      for (const x of [-0.05, 0.14]) ball(x, 1.54, 0.24, 0.026, 0.028, 0.019, 3752267, snowman);
      const carrot = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.22, 7), mat(13471061));
      carrot.rotation.x = Math.PI / 2;
      carrot.position.set(0.045, 1.45, 0.32);
      snowman.add(carrot);
      for (const y of [0.82, 1.02, 1.18]) ball(0.01, y, 0.33, 0.035, 0.035, 0.025, 5002071, snowman);
      sc(0, 1.22, 0, 0.34, 0.09, 10903117, snowman);
      sb(0.16, 1.06, 0.32, 0.14, 0.37, 0.04, 10903117, snowman);
      const snowHat = new THREE.Group();
      snowHat.position.set(0.04, 1.68, 0.02);
      snowHat.rotation.z = 0.16;
      snowman.add(snowHat);
      sc(0, 0, 0, 0.29, 0.065, 6315616, snowHat);
      sc(0, 0.14, 0, 0.2, 0.23, 6315616, snowHat);
      rod([-0.25, 1.02, 0], [-0.69, 1.27, 0.03], 0.025, wood, snowman);
      rod([0.26, 1.02, 0], [0.73, 1.32, 0], 0.025, wood, snowman);
      snowBind(snowman, "snowman");
      const shovel = new THREE.Group();
      shovel.position.set(-3.5, 0.31, 2.7);
      shovel.rotation.z = -0.24;
      snowTown.add(shovel);
      sb(0, 0.08, 0, 0.45, 0.24, 0.055, 8293008, shovel);
      rod([0, 0.18, 0], [0, 1.35, 0], 0.027, 10584671, shovel);
      sb(0, 1.35, 0, 0.25, 0.045, 0.045, 7233616, shovel);
      snowBind(shovel, "shovel");
      const stop = new THREE.Group();
      stop.name = "\u6751\u53E3\u73ED\u8F66\u7AD9";
      stop.position.set(-12, 0.28, 4.15);
      snowStatic.add(stop);
      for (const x of [-1.7, 1.7]) for (const z of [-0.48, 0.48]) sb(x, 1.23, z, 0.12, 2.46, 0.12, wood, stop);
      sb(0, 1.14, -0.49, 3.5, 1.95, 0.08, 9208177, stop);
      roof(0, 0, 3.95, 1.85, 2.63, 0.48, stop);
      sb(0, 0.56, 0, 2.9, 0.14, 0.53, 9598295, stop);
      for (const x of [-1.15, 1.15]) sb(x, 0.28, 0, 0.09, 0.56, 0.36, wood, stop);
      label(0, 2.32, 0.6, 2.05, 0.29, "\u96EA\u4E61 \xB7 \u6751\u53E3\u7AD9", stop, "#d8c7a1", "#624e41");
      label(0, 1.4, -0.435, 2.9, 0.22, "\u9996\u73ED 5:30\u3000\u672B\u73ED 18:30", stop, "#e0d7c3", "#655e53");
      snowHit("bus", 0, 1.25, 0.65, 3.5, 2.1, 0.12, stop);
      const notice = new THREE.Group();
      notice.name = "\u6751\u53E3\u516C\u544A\u680F";
      notice.position.set(12, 0.28, 4.15);
      snowStatic.add(notice);
      for (const x of [-1.35, 1.35]) sb(x, 1.22, 0, 0.12, 2.44, 0.12, wood, notice);
      sb(0, 1.6, 0, 2.8, 1.28, 0.1, 8096371, notice);
      roof(0, 0, 3.35, 0.9, 2.43, 0.25, notice);
      label(0, 2.33, 0.12, 1.75, 0.22, "\u96EA\u4E61 \xB7 \u516C\u544A\u680F", notice, "#d9c59d", "#66543a");
      for (const [x, t] of [[-0.84, "\u6751\u91CC\u6D88\u606F"], [0, "\u96EA\u4E61\u6765\u4FE1"], [0.84, "\u90BB\u91CC\u4E92\u52A9"]]) {
        const p = label(x, 1.65, 0.061, 0.69, 0.82, t, notice, "#e8ddc2", "#756a51");
        p.rotation.z = x * 0.04;
        ball(x, 2.04, 0.08, 0.025, 0.025, 0.018, 10705987, notice);
      }
      snowBind(notice, "notice");
      let villageSteamer, steamerLid, steamerOpen = false, steamerAmount = 0;
      {
        villageSteamer = new THREE.Group();
        villageSteamer.name = "edamame-peanut-stove";
        villageSteamer.position.set(9.45, 0.28, 0.15);
        snowTown.add(villageSteamer);
        sb(0, 0.29, 0, 0.88, 0.58, 0.79, 9205600, villageSteamer);
        for (let j = 0; j < 3; j++) sb(0, 0.12 + j * 0.17, 0.402, 0.86, 0.012, 6e-3, 12232073, villageSteamer);
        sb(0, 0.59, 0, 0.94, 0.055, 0.84, 5594968, villageSteamer);
        sb(0, 0.28, 0.405, 0.34, 0.22, 0.02, 4279108, villageSteamer);
        sb(0, 0.26, 0.42, 0.23, 0.1, 8e-3, 13275738, villageSteamer, 0.6);
        const potBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.35, 0.3, 24, 1, true), mat(7109744));
        potBowl.position.y = 0.8;
        villageSteamer.add(potBowl);
        sc(0, 0.655, 0, 0.35, 0.025, 6846058, villageSteamer);
        for (const x of [-0.48, 0.48]) {
          const h = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.018, 6, 14), mat(4675404));
          h.position.set(x, 0.86, 0);
          h.rotation.y = Math.PI / 2;
          villageSteamer.add(h);
        }
        const broth2 = new THREE.Mesh(new THREE.CircleGeometry(0.395, 28), new THREE.MeshPhysicalMaterial({ color: 12172418, transparent: true, opacity: 0.87, roughness: 0.27 }));
        broth2.rotation.x = -Math.PI / 2;
        broth2.position.y = 0.875;
        villageSteamer.add(broth2);
        for (let i = 0; i < 24; i++) {
          const a = i * 2.399, r = 0.31 * Math.sqrt((i + 0.5) / 24), x = Math.sin(a) * r, z = Math.cos(a) * r;
          if (i % 2) {
            const bean = ball(x, 0.898, z, 0.035, 0.025, 0.1, 8492630, villageSteamer);
            bean.rotation.y = a;
            for (const dz of [-0.04, 0.025]) ball(x + Math.sin(a) * dz, 0.918, z + Math.cos(a) * dz, 0.026, 0.012, 0.026, 10399077, villageSteamer);
          } else {
            for (const dz of [-0.027, 0.027]) ball(x + Math.sin(a) * dz, 0.9, z + Math.cos(a) * dz, 0.039, 0.027, 0.04, 12755568, villageSteamer);
          }
        }
        steamerLid = new THREE.Group();
        steamerLid.position.set(0, 0.96, -0.43);
        steamerLid.userData.snowDynamic = true;
        villageSteamer.add(steamerLid);
        sc(0, 0, 0.43, 0.45, 0.045, 8952202, steamerLid);
        ball(0, 0.035, 0.43, 0.405, 0.065, 0.405, 9544079, steamerLid);
        sb(0, 0.125, 0.43, 0.17, 0.055, 0.06, 4611148, steamerLid);
        snowBind(villageSteamer, "steamer");
        label(0, 0.43, 0.414, 0.67, 0.14, "\u6C34\u716E\u6BDB\u8C46\xB7\u82B1\u751F", villageSteamer, "#c5b58b", "#5c6448");
      }
      const frozenStall = new THREE.Group();
      frozenStall.name = "recognizable-frozen-meats";
      frozenStall.position.set(16.4, 0.28, 0.6);
      snowStatic.add(frozenStall);
      sb(0, 0.75, 0, 1.9, 0.13, 0.85, 9994081, frozenStall);
      for (const x of [-0.78, 0.78]) sb(x, 0.38, 0, 0.09, 0.75, 0.65, wood, frozenStall);
      for (let i = 0; i < 3; i++) {
        const x = -0.72 + i * 0.43;
        ball(x, 0.91, 0, 0.18, 0.11, 0.24, [11096389, 13274241, 10906720][i], frozenStall);
        ball(x - 0.02, 0.985, -0.02, 0.14, 0.035, 0.19, 14862001, frozenStall);
        for (let k = 0; k < 3; k++) {
          const stripe = ball(x - 0.09 + k * 0.07, 0.999, 0.02, 0.015, 8e-3, 0.16, 11561304, frozenStall);
          stripe.rotation.y = 0.3;
        }
        if (i === 2) {
          rod([x - 0.1, 0.94, 0.1], [x + 0.08, 1.02, 0.24], 0.027, 14143414, frozenStall);
        }
      }
      const goose = new THREE.Group();
      goose.name = "frozen-goose";
      goose.position.set(0.65, 0.91, 0);
      goose.rotation.y = 0.4;
      frozenStall.add(goose);
      ball(0, 0.03, 0, 0.17, 0.12, 0.26, 14667692, goose);
      for (const side of [-1, 1]) {
        ball(side * 0.15, 0.065, -0.01, 0.05, 0.065, 0.17, 13154455, goose);
        rod([side * 0.08, 0.02, -0.21], [side * 0.1, 0.05, -0.32], 0.025, 12359024, goose);
      }
      rod([0, 0.08, 0.19], [0, 0.23, 0.27], 0.045, 14206369, goose);
      ball(0, 0.25, 0.29, 0.063, 0.064, 0.08, 14534820, goose);
      ball(0, 0.235, 0.38, 0.045, 0.022, 0.056, 12027991, goose);
      for (const x of [-1, 1]) sb(x, 1.65, -0.39, 0.065, 2.7, 0.065, wood, frozenStall);
      sb(0, 2.8, -0.39, 2.05, 0.08, 0.08, wood, frozenStall);
      for (let i = 0; i < 6; i++) {
        const x = -0.75 + i * 0.3;
        rod([x, 2.74, -0.39], [x, 2.53, -0.39], 9e-3, 12428412, frozenStall);
        for (let j = 0; j < 2; j++) {
          sc(x, 2.35 - j * 0.35, -0.39, 0.062, 0.3, i % 2 ? 9193782 : 10315079, frozenStall, 12);
          ball(x, 2.5 - j * 0.35, -0.39, 0.062, 0.046, 0.062, 10315079, frozenStall);
          ball(x, 2.2 - j * 0.35, -0.39, 0.062, 0.046, 0.062, 10315079, frozenStall);
          rod([x, 2.2 - j * 0.35, -0.39], [x, 2.16 - j * 0.35, -0.39], 0.012, 13677964, frozenStall);
        }
      }
      label(0, 0.67, 0.455, 1.84, 0.17, "\u725B\u8089\xB7\u732A\u8089\xB7\u7F8A\u8089\xB7\u5927\u9E45", frozenStall, "#cbb68b", "#6b4d37");
      label(0, 2.83, -0.33, 1.5, 0.18, "\u9999\u80A0\xB7\u5E72\u80A0", frozenStall, "#cbb68b", "#6b4d37");
      const field = { x: -0.5, z: 13.5, w: 8.5, d: 5.4 };
      sb(field.x, 0.29, field.z, field.w, 0.04, field.d, 3155748);
      for (let i = 0; i < 15; i++) {
        const x = field.x - field.w / 2 + 0.25 + i * 0.57;
        sb(x, 0.325, field.z, 0.16, 0.03, field.d - 0.2, 4601644);
        for (let j = 0; j < 3; j++) ball(x, 0.34, field.z - 1.8 + j * 1.7, 0.1, 0.035, 0.48, snowWhite);
      }
      const scarecrow = new THREE.Group();
      scarecrow.name = "scarecrow";
      scarecrow.position.set(-0.4, 0.32, 13.5);
      snowTown.add(scarecrow);
      rod([0, 0, 0], [0, 2.55, 0], 0.045, wood, scarecrow);
      rod([-1, 1.65, 0], [1, 1.65, 0], 0.035, wood, scarecrow);
      sb(0, 1.55, 0, 0.58, 0.75, 0.25, 9339504, scarecrow);
      for (const s of [-1, 1]) {
        const sleeve = sb(s * 0.49, 1.67, 0, 0.56, 0.27, 0.28, 9339504, scarecrow);
        sleeve.rotation.z = s * 0.1;
      }
      ball(0, 2.15, 0, 0.23, 0.27, 0.19, 11838074, scarecrow);
      sc(0, 2.4, 0, 0.39, 0.065, 10586971, scarecrow);
      sc(0, 2.48, 0, 0.24, 0.16, 10586971, scarecrow);
      for (const x of [-0.075, 0.075]) ball(x, 2.18, 0.178, 0.027, 0.028, 0.015, 5001544, scarecrow);
      snowBind(scarecrow, "scarecrow");
      function pine(x, z, h) {
        if (x > 15.5 && z > -6 && z < 3 || onRoad(x, z, h * 0.24 + 0.2) || Math.abs(x - riverX) < 1.7 || Math.hypot(x, z) > 19.25) return;
        const g = new THREE.Group();
        g.position.set(x, 0.28, z);
        g.name = "red-pine-or-fir";
        snowStatic.add(g);
        sc(0, h * 0.36, 0, 0.1, h * 0.72, 7955793, g, 7);
        for (let j = 0; j < 3; j++) {
          const r = h * (0.24 - j * 0.05), y = h * (0.36 + j * 0.22), hh = h * 0.42;
          for (const [c, s, dy] of [[5401700, 1, 0]]) {
            const o = new THREE.Mesh(new THREE.ConeGeometry(r * s, hh * s, 9), mat(c));
            o.position.y = y + dy;
            g.add(o);
          }
        }
        townTrees.push({ x, z, radius: h * 0.24, root: g });
      }
      for (const [x, z, h] of [[-16, -7.8, 4.6], [-15, -11.8, 4], [-12.6, -13.8, 4.5], [-8.8, -15.4, 4.3], [-4.5, -16.3, 4.1], [2.9, -17.3, 4.2], [8.8, -15.2, 4.6], [16, -9.5, 4], [17.3, -5, 3.9], [17.2, 0, 3.4], [-17.5, -2, 3.9], [-16.4, 2.2, 3], [-16.6, 8.1, 3], [15.1, 9.6, 3], [-13.1, 11.6, 5.9]]) pine(x, z, h);
      const winterWireSnow = new THREE.Group();
      winterWireSnow.name = "winter-wire-snow";
      winterWireSnow.userData.winterOnly = true;
      snowStatic.add(winterWireSnow);
      const powerPoles = [];
      for (const [x, z] of [[-13, -7.3], [13.1, -5.6]]) {
        const g = new THREE.Group();
        g.name = "snowy-power-pole";
        g.position.set(x, 0.28, z);
        snowStatic.add(g);
        sc(0, 2.95, 0, 0.11, 5.9, 9209723, g);
        sb(0, 5.63, 0, 1.25, 0.12, 0.15, 8550494, g);
        sb(0, 5.72, 0, 1.26, 0.06, 0.17, snowWhite, g);
        for (const xx of [-0.48, 0.48]) {
          sc(xx, 5.82, 0, 0.07, 0.27, 7966350, g);
          ball(xx, 5.98, 0, 0.09, 0.04, 0.09, snowWhite, g);
        }
        powerPoles.push(g);
      }
      for (const side of [-1, 1]) {
        const a = new THREE.Vector3(-13 + side * 0.48, 6.15, -7.3), b = new THREE.Vector3(13.1 + side * 0.48, 6.15, -5.6), pts = [];
        for (let i = 0; i <= 48; i++) {
          const u = i / 48, p = a.clone().lerp(b, u);
          p.y -= Math.sin(u * Math.PI) * 1.05;
          pts.push(p);
        }
        const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.016, 4, false), mat(4279381));
        wire.name = "sagging-overhead-wire";
        snowStatic.add(wire);
        for (let i = 3; i < 46; i += 7) {
          const p = pts[i];
          rod([p.x, p.y + 0.02, p.z], [pts[i + 2].x, pts[i + 2].y + 0.02, pts[i + 2].z], 0.023, snowWhite, winterWireSnow);
        }
      }
      const villageLeafTreeLayout = [[-17, -4, 4.5, true], [-14.9, -9.4, 4.2, true], [-10.7, -14.6, 4.6, true], [-2.5, -17.7, 4.4, true], [9.6, -16.1, 4.5, true], [17, -6.8, 4, true], [-17, 9.4, 4.2, true], [12, 10.3, 3.8, false]];
      const villageLeafTrees = [];
      for (const [x, z, h, birch] of villageLeafTreeLayout) {
        const root = new THREE.Group();
        root.name = birch ? "seasonal-birch" : "seasonal-shade-tree";
        root.position.set(x, 0.28, z);
        snowStatic.add(root);
        sc(0, h * 0.42, 0, birch ? 0.085 : 0.13, h * 0.84, birch ? 14011826 : 9008986, root);
        if (birch) for (let j = 0; j < 8; j++) sb((j % 2 ? 1 : -1) * 0.065, 0.45 + j * h * 0.09, 0.026, 0.055, 0.025, 0.07, 7760728, root);
        for (let i = 0; i < 6; i++) {
          const a = i * 2.4, r = i % 2 ? 0.5 : 0.32, tip = [Math.sin(a) * r, h * 0.76, Math.cos(a) * r];
          rod([0, h * 0.48, 0], tip, 0.035, 9075038, root);
          rod(tip, [tip[0] * 1.5, h * (0.88 + i % 3 * 0.025), tip[2] * 1.5], 0.018, 9075038, root);
        }
        villageLeafTrees.push({ root, x, z, h, birch });
      }
      pine(-10.6, -11.4, 3.5);
      pine(-5.2, -13.2, 3.8);
      pine(-7, -15.7, 3.8);
      const buildingPads = [{ x: 11.8, z: 12.7, w: 7, d: 6.2 }, { x: -0.7, z: 18, w: 2.5, d: 2.2 }, { x: -0.4, z: 9.45, w: 4.9, d: 1.3 }, { x: -0.25, z: -1.2, w: 8.8, d: 6.6 }, ...Object.entries(villageBuildings).map(([key, b]) => {
        const cfg = snowLayout[key];
        return { x: cfg.x, z: cfg.z, w: (b.width + 0.7) * cfg.scale, d: (b.depth + 1) * cfg.scale };
      })];
      function nearBuilding(x, z, r = 0.2) {
        return buildingPads.some((b) => Math.abs(x - b.x) < b.w / 2 + r && Math.abs(z - b.z) < b.d / 2 + r);
      }
      const bankKeys = /* @__PURE__ */ new Set();
      for (const s of roadSegments) {
        const dx = s.b[0] - s.a[0], dz = s.b[1] - s.a[1], len = Math.hypot(dx, dz), nx = -dz / len, nz = dx / len;
        for (let d = 0; d < len; d += 0.61) for (const side of [-1, 1]) {
          const x = s.a[0] + dx * d / len + nx * side * (s.width / 2 + 0.46), z = s.a[1] + dz * d / len + nz * side * (s.width / 2 + 0.32), key = Math.round(x * 2) + "," + Math.round(z * 2);
          if (bankKeys.has(key) || onRoad(x, z, 0.4) || nearBuilding(x, z, 0.15) || Math.abs(x - riverX) < 1.6 || Math.hypot(x, z) > 19.35) continue;
          bankKeys.add(key);
          snowbank(x, z, 0.26 + sr() * 0.12, 0.23 + sr() * 0.1, 0.11 + sr() * 0.09);
          roadsideBanks.push({ x, z, radius: 0.38 });
        }
      }
      for (let i = 0; i < 42; i++) {
        const a = sr() * Math.PI * 2, r = 17.5 + sr() * 1.7, x = Math.sin(a) * r, z = Math.cos(a) * r;
        if (onRoad(x, z, 1.7) || nearBuilding(x, z, 1) || Math.abs(x - riverX) < 1.8) continue;
        snowbank(x, z, 0.8 + sr() * 0.8, 0.6 + sr() * 0.8, 0.25 + sr() * 0.5);
        if (i % 3 === 0) for (let j = 0; j < 3; j++) rod([x, 0.35, z], [x + (j - 1) * 0.22, 0.7 + sr() * 0.25, z + 0.16], 0.013, 8485480);
      }
      for (let z = -18; z < 18; z += 0.65) for (const s of [-1, 1]) {
        const x = riverCenter(z) + s * 1.28;
        if (onRoad(x, z, 0.35) || Math.hypot(x, z) > 19.6 || bridges.some((b) => Math.abs(b.z - z) < b.depth / 2 + 0.55)) continue;
        snowbank(x, z, 0.24, 0.45, 0.18 + sr() * 0.1);
      }
      const lampPool = texture(128, 128, (c, W, H) => {
        const g = c.createRadialGradient(64, 64, 0, 64, 64, 63);
        g.addColorStop(0, "rgba(255,216,151,.22)");
        g.addColorStop(0.5, "rgba(255,216,151,.10)");
        g.addColorStop(1, "rgba(255,216,151,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      function townLamp(x, z, tall = false) {
        const h = tall ? 5.3 : 1.05, g = new THREE.Group();
        g.position.set(x, 0.31, z);
        snowStatic.add(g);
        sc(0, h / 2, 0, tall ? 0.055 : 0.045, h, 6517879, g);
        if (tall) rod([0, h - 0.12, 0], [0, h + 0.12, 0.92], 0.055, 6517879, g);
        sb(0, h, tall ? 0.92 : 0, tall ? 0.48 : 0.26, 0.11, tall ? 0.38 : 0.24, 6649199, g);
        sb(0, h - 0.06, tall ? 0.92 : 0, tall ? 0.3 : 0.17, 0.06, tall ? 0.24 : 0.17, 16766620, g, 0.9);
        const light = tall ? new THREE.SpotLight(16765595, 25, 9, 0.62, 0.7, 2) : new THREE.PointLight(16765595, 1.1, 2.7, 2);
        light.position.set(0, h - 0.1, tall ? 0.92 : 0);
        g.add(light);
        if (tall) {
          const target2 = new THREE.Object3D();
          target2.position.set(0, 0, 0.92);
          g.add(target2);
          light.target = target2;
        }
        const pool = new THREE.Mesh(new THREE.PlaneGeometry(tall ? 5 : 1.7, tall ? 5 : 1.7), new THREE.MeshBasicMaterial({ map: lampPool, transparent: true, depthWrite: false }));
        pool.rotation.x = -Math.PI / 2;
        pool.position.set(0, 0.015, tall ? 0.92 : 0);
        g.add(pool);
        lampObjects.push({ root: g, light, height: h, x, z });
      }
      townLamp(-15.3, 5.02, true);
      townLamp(14.5, 5.02, true);
      for (const [x, z] of [[-7.22, 4.4], [-1.3, 3.5], [9.05, -5.5], [2.75, -8.25], [-5.55, -6.55], [9.05, 4.25]]) townLamp(x, z);
      const roadMesh = buildUnifiedRoads();
      const winterRoadSurface = new THREE.Group();
      winterRoadSurface.name = "ploughed-winter-road";
      winterRoadSurface.userData.winterOnly = true;
      snowStatic.add(winterRoadSurface);
      const winterRoadPoly = clipPoly(clipPoly(perimeter, (p) => p.y >= 5.405, (a, b) => a.clone().lerp(b, (5.405 - a.y) / (b.y - a.y))), (p) => p.y <= 8.595, (a, b) => a.clone().lerp(b, (8.595 - a.y) / (b.y - a.y)));
      flatPolygon(winterRoadPoly, roadY + 4e-3, 6848141, winterRoadSurface);
      for (let x = -17.5; x < 18; x += 2.2) if (Math.abs(x - riverX) > 2.2) sb(x, roadY + 7e-3, 7, 0.86, 3e-3, 0.05, 14209203, winterRoadSurface);
      const skyline = document.createElement("canvas");
      skyline.width = 1600;
      skyline.height = 900;
      const sky = skyline.getContext("2d");
      function skylineShape(color, baseline, peak, seed2, forest = false) {
        sky.fillStyle = color;
        sky.beginPath();
        sky.moveTo(0, baseline);
        const count2 = forest ? 130 : 14;
        for (let i = 0; i <= count2; i++) {
          const x = i / count2 * 1600, y = baseline - peak * (0.35 + 0.65 * Math.abs(Math.sin(i * 0.62 + seed2) * Math.cos(i * 0.19 + seed2)));
          if (forest) {
            sky.lineTo(x - 9, baseline);
            sky.lineTo(x, y);
            sky.lineTo(x + 9, baseline - 8);
          } else sky.lineTo(x, y);
        }
        sky.lineTo(1600, baseline + 100);
        sky.lineTo(0, baseline + 100);
        sky.closePath();
        sky.fill();
      }
      sky.filter = "blur(6px)";
      skylineShape("rgba(20,40,60,.65)", 430, 240, 2);
      skylineShape("rgba(19,41,58,.66)", 460, 150, 5);
      sky.filter = "blur(2.8px)";
      skylineShape("rgba(15,39,45,.71)", 505, 120, 9, true);
      skylineShape("rgba(13,33,40,.75)", 540, 96, 4, true);
      sky.filter = "none";
      sky.globalCompositeOperation = "destination-in";
      const mask = sky.createLinearGradient(0, 0, 0, 900);
      mask.addColorStop(0, "#fff");
      mask.addColorStop(0.48, "#fff");
      mask.addColorStop(0.58, "rgba(255,255,255,0)");
      mask.addColorStop(1, "rgba(255,255,255,0)");
      sky.fillStyle = mask;
      sky.fillRect(0, 0, 1600, 900);
      sky.globalCompositeOperation = "source-over";
      paintClouds = function(c, W, H, t) {
        const g = c.createRadialGradient(W * 0.48, H * 0.45, 0, W * 0.5, H * 0.45, W * 0.75);
        g.addColorStop(0, "#53677d");
        g.addColorStop(0.55, "#2b4059");
        g.addColorStop(1, "#13283f");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        c.drawImage(skyline, 0, 0, W, H);
      };
      paintClouds(cloudCanvas.getContext("2d"), cloudCanvas.width, cloudCanvas.height, 0);
      roadNodes.clear();
      roadLinks.clear();
      const splitPoints = roadSegments.map((s) => [s.a, s.b]);
      for (let i = 0; i < roadSegments.length; i++) for (let j = i + 1; j < roadSegments.length; j++) {
        const a = roadSegments[i], b = roadSegments[j], av = Math.abs(a.a[0] - a.b[0]) < 1e-3, bv = Math.abs(b.a[0] - b.b[0]) < 1e-3;
        const inside = (p, s) => p[0] >= Math.min(s.a[0], s.b[0]) - 1e-3 && p[0] <= Math.max(s.a[0], s.b[0]) + 1e-3 && p[1] >= Math.min(s.a[1], s.b[1]) - 1e-3 && p[1] <= Math.max(s.a[1], s.b[1]) + 1e-3;
        if (av !== bv) {
          const p = av ? [a.a[0], b.a[1]] : [b.a[0], a.a[1]];
          if (inside(p, a) && inside(p, b)) {
            splitPoints[i].push(p);
            splitPoints[j].push(p);
          }
        } else for (const p of [a.a, a.b, b.a, b.b]) if (inside(p, a) && inside(p, b)) {
          splitPoints[i].push(p);
          splitPoints[j].push(p);
        }
      }
      splitPoints.forEach((points, i) => {
        const unique = [...new Map(points.map((p) => [nodeKey(p), p])).values()].sort((a, b) => Math.abs(roadSegments[i].a[0] - roadSegments[i].b[0]) < 1e-3 ? a[1] - b[1] : a[0] - b[0]);
        for (let j = 1; j < unique.length; j++) {
          const a = unique[j - 1], b = unique[j];
          for (const [p, q] of [[a, b], [b, a]]) {
            const k = nodeKey(p), v = nodeKey(q);
            roadNodes.set(k, p);
            roadNodes.set(v, q);
            if (!roadLinks.has(k)) roadLinks.set(k, []);
            roadLinks.get(k).push({ key: v, length: Math.hypot(q[0] - p[0], q[1] - p[1]) });
          }
        }
      });
      for (const z of [12.1, 13.1]) for (let x = -7.1; x < -5.65; x += 0.17) {
        const track = sb(x, 0.321, z, 0.13, 4e-3, 0.035, 8623517);
        track.name = "thin-tricycle-track";
      }
      sb(14.418, 0.39, 0.25, 1.3, 0.14, 0.35, 11252650);
      sb(14.418, 0.54, -0.1, 1.2, 0.18, 0.35, 12106666);
      sb(14.418, 0.72, -0.32, 1.1, 0.12, 0.2, 12698031);
      function fadeable(root) {
        const cache = /* @__PURE__ */ new Map(), items = [];
        root.traverse((o) => {
          if (!o.material) return;
          const list = Array.isArray(o.material) ? o.material : [o.material];
          const copy = list.map((m) => {
            if (!cache.has(m.uuid)) {
              const clone = m.clone();
              cache.set(m.uuid, clone);
              items.push({ m: clone, opacity: m.opacity, transparent: m.transparent, depthWrite: m.depthWrite });
            }
            return cache.get(m.uuid);
          });
          o.material = Array.isArray(o.material) ? copy : copy[0];
        });
        root.userData.fadeItems = items;
        root.userData.alpha = 1;
        return root;
      }
      function setAlpha(root, a) {
        a = THREE.MathUtils.clamp(a, 0, 1);
        root.visible = a > 1e-3;
        if (root.userData.alpha === a) return;
        root.userData.alpha = a;
        for (const q of root.userData.fadeItems || []) {
          q.m.opacity = q.opacity * a;
          q.m.transparent = q.transparent || a < 0.999;
          q.m.depthWrite = a < 0.999 ? false : q.depthWrite;
        }
      }
      function angleToward(a, b) {
        return a + Math.atan2(Math.sin(b - a), Math.cos(b - a));
      }
      const cave = new THREE.Group();
      cave.name = "fenced-bear-cave";
      cave.position.set(12.3, 0.28, -12);
      snowStatic.add(cave);
      ball(12.3, 0.6, -14.25, 2.65, 1.95, 1.12, snowShade);
      ball(12.3, 1.1, -14.32, 2.55, 1.55, 1.04, snowWhite);
      for (let i = 0; i < 9; i++) {
        const a = i / 8 * Math.PI, xx = Math.cos(a) * 1.42, yy = Math.sin(a) * 1.72;
        ball(xx, yy + 0.24, 0, 0.64, 0.64, 0.72, i % 2 ? 8227476 : 8950939, cave);
        if (i > 0 && i < 8) ball(xx, yy + 0.86, -0.02, 0.58, 0.2, 0.68, snowWhite, cave);
      }
      const darkCave = sb(0, 0.94, -0.67, 2.12, 1.85, 0.08, 1649208, cave);
      darkCave.material = new THREE.MeshBasicMaterial({ color: 1649208 });
      snowHit("bear", 0, 1.02, 0.44, 2.7, 2.15, 0.4, cave);
      for (let i = 0; i < 9; i++) foot(12.3 + (i % 2 ? -0.29 : 0.28), -11.5 + i * 0.3, 0, true);
      fenceLine([9.25, -8.2], [15.4, -8.2], 0.65, snowStatic, 9141085);
      for (const side of [-1, 1]) for (let j = 0; j < 3; j++) {
        ball(side * 1.45, 0.85, -0.65 - j * 0.55, 0.62, 1, 0.62, 8556954, cave);
        ball(side * 1.45, 1.8, -0.65 - j * 0.55, 0.67, 0.22, 0.65, snowWhite, cave);
      }
      for (let j = 0; j < 3; j++) {
        ball(0, 2, -0.55 - j * 0.55, 1.3, 0.48, 0.62, 8162197, cave);
        ball(0, 2.35, -0.55 - j * 0.55, 1.4, 0.21, 0.66, snowWhite, cave);
      }
      ball(0, 1.1, -2.1, 1.55, 1.35, 0.65, 7044746, cave);
      const bear = new THREE.Group();
      bear.name = "\u68D5\u718A";
      snowTown.add(bear);
      ball(0, 0.84, 0, 0.5, 0.58, 0.78, 9990228, bear);
      const bearHead = new THREE.Group();
      bearHead.position.set(0, 1.14, 0.57);
      bear.add(bearHead);
      ball(0, 0, 0, 0.42, 0.4, 0.4, 10845017, bearHead);
      ball(0, -0.13, 0.34, 0.25, 0.17, 0.2, 11242086, bearHead);
      ball(0, -0.09, 0.51, 0.1, 0.067, 0.065, 3487288, bearHead);
      for (const x of [-0.29, 0.29]) {
        ball(x, 0.32, -0.02, 0.13, 0.14, 0.11, 9990228, bearHead);
        ball(x * 0.68, 0.06, 0.32, 0.029, 0.032, 0.019, 2567730, bearHead);
      }
      const bearLegs = [];
      for (const x of [-0.32, 0.32]) for (const z of [-0.45, 0.45]) {
        const leg = new THREE.Group();
        leg.position.set(x, 0.6, z);
        bear.add(leg);
        ball(0, -0.22, 0, 0.16, 0.32, 0.18, 9003590, leg);
        ball(0, -0.49, 0.09, 0.19, 0.11, 0.25, 9332552, leg);
        bearLegs.push(leg);
      }
      snowBind(bear, "bear");
      fadeable(bear);
      setAlpha(bear, 0);
      const bearState = { phase: "hidden", at: 0, z: -0.75, fromZ: -0.75, fromYaw: 0, yaw: 0 };
      function callBear(t) {
        if (bearState.phase === "hidden") {
          Object.assign(bearState, { phase: "out", at: t, z: -0.75, fromZ: -0.75, yaw: 0 });
        } else if (!["turn", "in"].includes(bearState.phase)) {
          Object.assign(bearState, { phase: "turn", at: t, fromZ: bearState.z, fromYaw: bearState.yaw });
        }
      }
      function animateBear(t, dt) {
        const s = bearState, a = t - s.at;
        if (s.phase === "hidden") {
          setAlpha(bear, 0);
          return;
        }
        if (s.phase === "out") {
          s.z = THREE.MathUtils.lerp(-0.75, 1.65, THREE.MathUtils.smoothstep(a, 0, 5));
          s.yaw = 0;
          if (a >= 5) {
            s.phase = "wait";
            s.at = t;
          }
        } else if (s.phase === "wait") {
          bearHead.rotation.y = Math.sin(a * 1.2) * 0.1;
          if (a > 6) Object.assign(s, { phase: "turn", at: t, fromZ: s.z, fromYaw: s.yaw });
        } else if (s.phase === "turn") {
          s.yaw = THREE.MathUtils.lerp(s.fromYaw, angleToward(s.fromYaw, Math.PI), THREE.MathUtils.smoothstep(a, 0, 2.4));
          if (a >= 2.4) Object.assign(s, { phase: "in", at: t, fromZ: s.z });
        } else if (s.phase === "in") {
          s.z = THREE.MathUtils.lerp(s.fromZ, -0.75, THREE.MathUtils.smoothstep(a, 0, 5));
          if (a >= 5) s.phase = "hidden";
        }
        bear.position.set(12.3, 0.28, -12 + s.z);
        bear.rotation.y = s.yaw;
        bearLegs.forEach((o, i) => o.rotation.x = ["out", "in"].includes(s.phase) ? Math.sin(t * 3.7 + i * Math.PI) * 0.2 : 0);
        setAlpha(bear, s.phase === "hidden" ? 0 : THREE.MathUtils.smoothstep(s.z, -0.7, 0.25));
      }
      function face(parent, x, y, z, { female = false, driver: driver2 = false } = {}) {
        const h = new THREE.Group();
        h.name = female ? "grandma-face" : "grandpa-face";
        h.position.set(x, y, z);
        parent.add(h);
        ball(0, 0, 0, 0.17, 0.21, 0.16, 13216392, h);
        for (const xx of [-0.057, 0.057]) {
          ball(xx, 0.025, 0.148, 0.014, 0.018, 9e-3, 3161152, h);
          ball(xx, 0.069, 0.14, 0.03, 8e-3, 8e-3, 6708048, h);
        }
        ball(0, -0.012, 0.167, 0.023, 0.035, 0.028, 12755326, h);
        line([[-0.038, -0.075, 0.148], [0, -0.082, 0.16], [0.038, -0.075, 0.148]], 7561042, 1, h);
        if (female) {
          ball(0, 0.025, -0.105, 0.18, 0.15, 0.12, 5326654, h);
          ball(0, 0.1, -0.02, 0.2, 0.16, 0.18, 5326654, h);
          for (const s of [-1, 1]) ball(s * 0.16, 0.025, -0.015, 0.07, 0.15, 0.15, 5326654, h);
          for (const xx of [-0.11, 0.11]) ball(xx, -0.035, 0.148, 0.026, 0.015, 8e-3, 12749944, h);
        } else {
          sc(0, 0.19, 0, 0.2, 0.085, 6252646, h);
          sb(0, 0.15, 0.12, 0.35, 0.035, 0.17, 6844778, h);
          for (const xx of [-0.03, 0.03]) ball(xx, -0.047, 0.164, 0.032, 0.012, 0.012, 12960179, h);
        }
        return h;
      }
      function villager(female = false) {
        const root = new THREE.Group();
        root.name = female ? "\u8D2D\u7269\u7684\u5927\u5988" : "\u5750\u8F66\u7684\u5927\u7237";
        snowTown.add(root);
        const coat = female ? 12358783 : 10137264;
        ball(0, 1, 0, 0.26, 0.37, 0.2, coat, root);
        const head = face(root, 0, 1.48, 0.025, { female });
        sc(0, 1.29, 0, 0.105, 0.1, 13216392, root);
        const legs = [], arms = [];
        for (const s of [-1, 1]) {
          const hip = new THREE.Group();
          hip.position.set(s * 0.125, 0.79, 0);
          root.add(hip);
          sb(0, -0.21, 0, 0.16, 0.42, 0.17, 5070181, hip);
          const knee = new THREE.Group();
          knee.position.y = -0.4;
          hip.add(knee);
          sb(0, -0.16, 0, 0.15, 0.33, 0.17, 5070181, knee);
          sb(0, -0.34, 0.055, 0.19, 0.13, 0.31, 4016462, knee);
          legs.push({ hip, knee });
          const arm = new THREE.Group();
          arm.position.set(s * 0.23, 1.18, 0);
          root.add(arm);
          rod([0, 0, 0], [s * 0.045, -0.21, 0.02], 0.072, coat, arm);
          rod([s * 0.045, -0.21, 0.02], [s * 0.07, -0.41, 0.04], 0.052, 13216392, arm);
          ball(s * 0.07, -0.43, 0.04, 0.055, 0.065, 0.05, 12559235, arm);
          arms.push(arm);
        }
        const bag = new THREE.Group();
        bag.position.set(0.37, 0.6, 0.02);
        root.add(bag);
        if (female) {
          sc(0, -0.025, 0, 0.16, 0.24, 12032880, bag);
          for (let j = 0; j < 5; j++) sb(-0.12 + j * 0.06, -0.025, 0.135, 9e-3, 0.22, 0.012, 9731160, bag);
          ball(-0.055, 0.11, 0, 0.045, 0.045, 0.045, 10531694, bag);
          ball(0.055, 0.12, 0, 0.04, 0.055, 0.04, 7902813, bag);
        } else sb(0, 0, 0, 0.3, 0.27, 0.24, 10195576, bag);
        const handle = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.012, 6, 14, Math.PI), mat(7958101));
        handle.position.y = 0.14;
        bag.add(handle);
        const breath = [];
        for (let i = 0; i < 3; i++) {
          const p = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffMap, transparent: true, opacity: 0, depthWrite: false }));
          root.add(p);
          breath.push(p);
        }
        fadeable(root);
        setAlpha(root, 0);
        return { root, head, legs, arms, bag, breath, stage: "hidden", at: 0, route: null, lastStep: -1, inside: false, female };
      }
      const grandma = villager(true), grandpa = villager(false), breadPerson = grandma, busPerson = grandpa;
      function beginWalk(p, points, t, next) {
        const route = [points[0]];
        for (let i = 1; i < points.length; i++) if (Math.hypot(points[i][0] - route[route.length - 1][0], points[i][1] - route[route.length - 1][1]) > 0.02) route.push(points[i]);
        p.route = { points: route, index: 1, from: route[0], start: t, phase: "turn", next, speed: p.female ? 1 : 1.08 };
        p.stage = "walking";
        p.inside = false;
      }
      function animateWalker(p, t, dt) {
        const r = p.route;
        let moving = false;
        if (p.stage === "walking" && r) {
          if (r.index >= r.points.length) {
            p.route = null;
            p.stage = r.next;
            p.at = t;
          } else {
            const a = r.points[r.index - 1], b = r.points[r.index], yawGoal = Math.atan2(b[0] - a[0], b[1] - a[1]);
            if (r.phase === "turn") {
              p.root.rotation.y += Math.atan2(Math.sin(yawGoal - p.root.rotation.y), Math.cos(yawGoal - p.root.rotation.y)) * Math.min(1, dt * 6);
              if (t - r.start > 0.55) {
                r.phase = "walk";
                r.start = t;
              }
            } else {
              const len = Math.hypot(b[0] - a[0], b[1] - a[1]), u = Math.min(1, (t - r.start) * r.speed / len);
              p.root.position.set(THREE.MathUtils.lerp(a[0], b[0], u), 0, THREE.MathUtils.lerp(a[1], b[1], u));
              moving = true;
              if (u >= 1) {
                r.index++;
                r.phase = "turn";
                r.start = t;
              }
            }
          }
        }
        let floor = walkHeight(p.root.position.x, p.root.position.z);
        if (Math.abs(p.root.position.x + 11.09) < 0.6 && p.root.position.z > 5.2 && p.root.position.z < 6.8 && busState.phase !== "hidden") floor = 0.318 + THREE.MathUtils.smoothstep(p.root.position.z, 5.2, 6.4) * 0.57;
        p.inside = Math.abs(p.root.position.x + 0.32) < 0.85 && p.root.position.z < 1.1 && p.root.position.z > -3.5 || Math.abs(p.root.position.x + 11) < 0.75 && p.root.position.z < -2.3 || Math.abs(p.root.position.x - 14.418) < 0.75 && p.root.position.z < -0.35 || Math.abs(p.root.position.x) < 0.9 && p.root.position.z < -10 || Math.abs(p.root.position.x + 11.09) < 0.6 && p.root.position.z > 5.9 && busState.phase !== "hidden";
        p.root.position.y = floor + 8e-3 + (moving ? Math.abs(Math.sin(t * 5.2)) * 0.016 : 0);
        for (let i = 0; i < 2; i++) {
          const phase = t * 5.2 + i * Math.PI;
          p.legs[i].hip.rotation.x = moving ? Math.sin(phase) * 0.35 : THREE.MathUtils.damp(p.legs[i].hip.rotation.x, 0, 8, dt);
          p.legs[i].knee.rotation.x = moving ? Math.max(0, -Math.sin(phase)) * 0.44 : 0;
          p.arms[i].rotation.x = moving ? -Math.sin(phase) * 0.15 : 0;
        }
        if (moving && !p.inside && p.root.visible) {
          const step = Math.floor(t * 5.2 / Math.PI);
          if (step !== p.lastStep) {
            p.lastStep = step;
            snowFootstep(6e-3);
            stampWalkerSnow(p, t, step);
          }
        }
        const breathPhase = (t + (p.female ? 2.2 : 0)) % 8.5;
        p.breath.forEach((o, i) => {
          const a = breathPhase - i * 0.16;
          o.visible = !p.inside && p.root.visible && a >= 0 && a < 1.9;
          const k = Math.max(0, a) / 1.9;
          o.position.set(Math.sin(p.root.rotation.y) * 0, 1.45 + k * 0.17, 0.22 + k * 0.25);
          o.scale.setScalar(0.04 + k * 0.22);
          o.material.opacity = o.visible ? Math.sin(k * Math.PI) * 0.19 : 0;
        });
      }
      function setPersonPosition(p, x, z, yaw2 = 0) {
        p.root.position.set(x, walkHeight(x, z), z);
        p.root.rotation.y = yaw2;
      }
      const shopEntry = [-0.32, 1.65], shopInside = [-0.32, 0.06], homeEntry = [-11, -1.3], homeInside = [-11, -3.1], deliEntry = [14.418, 0.62], deliInside = [14.418, -1.8], grainEntry = [0, -9.25], grainInside = [0, -11.2], stopEntry = [-12, 5.2];
      const grandmaState = { next: performance.now() / 1e3 + 12 }, grandpaState = { hasRidden: false };
      const bus = new THREE.Group();
      bus.name = "transparent-window-minibus";
      snowTown.add(bus);
      const busLength = 4.9, busWidth = 2.3, busSafeX = Math.sqrt((townRadius - 0.18) ** 2 - (roadZ + busWidth / 2 + 0.08) ** 2) - busLength / 2;
      sb(0, 0.48, 0, 2.24, 0.18, 4.84, 7244168, bus);
      sb(-1.1, 0.91, 0, 0.12, 0.68, 4.8, 13093045, bus);
      sb(1.1, 0.91, -0.99, 0.12, 0.68, 2.82, 13093045, bus);
      sb(1.1, 0.91, 1.97, 0.12, 0.68, 0.83, 13093045, bus);
      for (const z of [-2.39, 2.39]) sb(0, 0.93, z, 2.27, 0.73, 0.12, 13093045, bus);
      sb(0, 2.38, 0, 2.38, 0.18, 4.95, 14604474, bus);
      for (const s of [-1, 1]) for (const z of [-2.35, -1.55, -0.75, 0.05, 0.45, 1.45, 2.35]) sb(s * 1.1, 1.77, z, 0.08, 1.04, 0.065, 6914954, bus);
      const busGlass = new THREE.MeshPhysicalMaterial({ color: 10932444, transparent: true, opacity: 0.2, roughness: 0.12, side: THREE.DoubleSide, depthWrite: false });
      function busPane(x, y, z, w, h, ry = 0) {
        const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), busGlass);
        o.position.set(x, y, z);
        o.rotation.y = ry;
        bus.add(o);
        return o;
      }
      busPane(0, 1.77, 2.46, 2.18, 0.64);
      busPane(0, 1.77, -2.46, 2.18, 0.64, Math.PI);
      for (const s of [-1, 1]) for (const z of [-1.94, -1.15, -0.36, 1.94]) busPane(s * 1.165, 1.77, z, 0.76, 0.64, Math.PI / 2);
      for (const x of [-0.67, 0.67]) for (const z of [-1.58, -0.49, 0.48]) {
        sb(x, 0.78, z, 0.6, 0.14, 0.57, 8485474, bus);
        sb(x, 1.14, z - 0.23, 0.6, 0.64, 0.12, 8485474, bus);
      }
      sb(-0.5, 0.82, 1.45, 0.65, 0.17, 0.59, 7305067, bus);
      sb(-0.5, 1.18, 1.2, 0.65, 0.65, 0.13, 7305067, bus);
      const driver = face(bus, -0.5, 1.7, 1.48, { driver: true });
      sb(-0.5, 1.18, 1.5, 0.43, 0.58, 0.3, 8227456, bus);
      const busSteering = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.022, 7, 18), mat(5135457));
      busSteering.position.set(-0.5, 1.24, 1.95);
      busSteering.rotation.x = 0.65;
      bus.add(busSteering);
      sb(0, 1.17, 2.02, 2.05, 0.13, 0.36, 8030083, bus);
      for (const s of [-1, 1]) for (const z of [-1.45, 1.45]) {
        const w = sc(s * 1.12, 0.41, z, 0.4, 0.15, 3490893, bus);
        w.rotation.z = Math.PI / 2;
        const hub = sc(s * 1.21, 0.41, z, 0.2, 0.018, 12172462, bus);
        hub.rotation.z = Math.PI / 2;
      }
      for (const x of [-0.75, 0.75]) sb(x, 0.92, 2.465, 0.33, 0.19, 0.025, 16767903, bus, 0.8);
      label(0, 2.2, 2.47, 1.42, 0.19, "\u96EA\u4E61\u73ED\u8F66", bus, "#d2c8a6", "#516765");
      const busDoors = [];
      for (const s of [-1, 1]) {
        const d = new THREE.Group();
        d.position.set(1.18, 0.54, 0.91 + s * 0.255);
        bus.add(d);
        sb(0, 0.23, 0, 0.045, 0.46, 0.49, 7177867, d);
        sb(0, 1.44, 0, 0.045, 0.28, 0.49, 7177867, d);
        for (const zz of [-0.23, 0.23]) sb(0, 0.96, zz, 0.045, 0.94, 0.035, 7177867, d);
        const g = new THREE.Mesh(new THREE.PlaneGeometry(0.41, 0.76), busGlass);
        g.rotation.y = Math.PI / 2;
        g.position.set(0.027, 0.99, 0);
        d.add(g);
        busDoors.push({ root: d, side: s, rest: 0.91 + s * 0.255 });
      }
      sb(1.25, 0.39, 0.91, 0.41, 0.1, 1.03, 9214872, bus);
      for (const z of [0.43, 1.2]) busPane(-1.165, 1.77, z, 0.76, 0.64, Math.PI / 2);
      busPane(1.165, 1.77, 0.25, 0.34, 0.64, Math.PI / 2);
      for (const side of [-1, 1]) for (const [z, len] of side < 0 ? [[0, 4.8]] : [[-0.98, 2.84], [1.94, 0.92]]) {
        sb(side * 1.1, 1.35, z, 0.12, 0.22, len, 13093045, bus);
        sb(side * 1.1, 2.2, z, 0.12, 0.22, len, 13093045, bus);
      }
      for (const z of [-2.4, 2.4]) {
        sb(0, 1.35, z, 2.27, 0.22, 0.12, 13093045, bus);
        sb(0, 2.2, z, 2.27, 0.22, 0.12, 13093045, bus);
      }
      for (const [x, z, female] of [[0.67, -1.58, true], [-0.67, -0.49, false]]) {
        face(bus, x, 1.63, z, { female });
        sb(x, 1.21, z, 0.39, 0.54, 0.28, female ? 9856850 : 7175557, bus);
        for (const dx of [-0.12, 0.12]) {
          sb(x + dx, 0.91, z + 0.15, 0.14, 0.13, 0.36, 5135463, bus);
          sb(x + dx, 0.69, z + 0.29, 0.14, 0.4, 0.13, 5135463, bus);
        }
      }
      bus.rotation.y = Math.PI / 2;
      snowBind(bus, "bus");
      fadeable(bus);
      setAlpha(bus, 0);
      const busState = { phase: "hidden", at: 0, next: performance.now() / 1e3 + 28, x: -busSafeX, door: 0, boarding: false, trip: 0 };
      function startBus(t) {
        if (busState.phase === "hidden") Object.assign(busState, { phase: "arrive", at: t, x: -busSafeX, trip: busState.trip + 1 });
      }
      function animateBus(t, dt) {
        const s = busState, a = t - s.at;
        if (s.phase === "hidden" && t >= s.next) {
          startBus(t);
          return;
        }
        if (s.phase === "arrive") {
          s.x = THREE.MathUtils.lerp(-busSafeX, -12, THREE.MathUtils.smoothstep(a, 0, 5));
          if (a >= 5) {
            s.phase = "stop";
            s.at = t;
            s.departRequested = false;
          }
        } else if (s.phase === "stop") {
          s.x = -12;
          s.door = THREE.MathUtils.damp(s.door, s.departRequested ? 0 : 1, 6, dt);
          if (s.departRequested && grandpa.stage === "hidden" || a > 16 && !s.boarding && grandpa.stage !== "busEntered" && grandpa.stage !== "busFade") {
            s.phase = "close";
            s.at = t;
          }
        } else if (s.phase === "close") {
          s.door = THREE.MathUtils.damp(s.door, 0, 6, dt);
          if (s.door < 0.02) {
            s.phase = "leave";
            s.at = t;
          }
        } else if (s.phase === "leave") {
          s.x = THREE.MathUtils.lerp(-12, busSafeX, THREE.MathUtils.smoothstep(a, 0, 23));
          if (a > 23) {
            s.phase = "hidden";
            s.next = t + 64;
          }
        }
        bus.position.set(s.x, 0.32, 7);
        for (const d of busDoors) d.root.position.z = d.rest + d.side * s.door * 0.4;
        const alpha = s.phase === "hidden" ? 0 : Math.min(THREE.MathUtils.smoothstep(s.x, -busSafeX, -busSafeX + 1.25), 1 - THREE.MathUtils.smoothstep(s.x, busSafeX - 1.25, busSafeX));
        setAlpha(bus, alpha);
      }
      const dogRoot = new THREE.Group();
      dogRoot.name = "yard-local-dog";
      snowTown.add(dogRoot);
      ball(0, 0.55, 0, 0.25, 0.27, 0.48, 10123342, dogRoot);
      const yardDogHead = new THREE.Group();
      yardDogHead.name = "turning-dog-head";
      yardDogHead.position.set(0, 0.78, 0.36);
      yardDogHead.userData.snowDynamic = true;
      dogRoot.add(yardDogHead);
      ball(0, 0.01, 0, 0.24, 0.25, 0.24, 11635802, yardDogHead);
      ball(0, -0.09, 0.21, 0.14, 0.11, 0.17, 13019771, yardDogHead);
      ball(0, -0.06, 0.35, 0.07, 0.05, 0.045, 3424327, yardDogHead);
      for (const x of [-0.12, 0.12]) {
        ball(x, 0.06, 0.19, 0.019, 0.024, 0.012, 2700858, yardDogHead);
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.25, 3), mat(9136455));
        ear.position.set(x * 1.3, 0.27, -0.04);
        yardDogHead.add(ear);
      }
      const dogLegs = [];
      for (const x of [-0.16, 0.16]) for (const z of [-0.26, 0.26]) {
        const leg = sb(x, 0.25, z, 0.12, 0.47, 0.13, 9991500, dogRoot);
        dogLegs.push(leg);
      }
      const yardDogTail = new THREE.Group();
      yardDogTail.position.set(0, 0.62, -0.4);
      dogRoot.add(yardDogTail);
      rod([0, 0, 0], [0, 0.3, -0.24], 0.045, 10123342, yardDogTail);
      snowBind(dogRoot, "yardDog");
      let dogAt = -100;
      const dogState = { phase: "inside", at: 0, yaw: 0 };
      const sparrows = [];
      for (let i = 0; i < 9; i++) {
        const root = new THREE.Group();
        snowTown.add(root);
        ball(0, 0.07, 0, 0.075, 0.07, 0.11, 12688224, root);
        ball(0, 0.14, 0.075, 0.055, 0.055, 0.055, 11635538, root);
        ball(0, 0.135, 0.124, 0.02, 0.012, 0.035, 11575677, root);
        for (const x of [-0.023, 0.023]) ball(x, 0.15, 0.113, 7e-3, 9e-3, 5e-3, 3095872, root);
        const wings = [];
        for (const s of [-1, 1]) {
          const w = ball(s * 0.07, 0.08, 0, 0.09, 0.018, 0.07, 11109714, root);
          wings.push(w);
        }
        const home = [-3.8 + sr() * 6.4, 11.4 + sr() * 3.8], perch = [-13.1 + (sr() - 0.5) * 0.35, 11.6 + (sr() - 0.5) * 0.35];
        sparrows.push({ root, wings, home, perch, index: i });
      }
      let sparrowsAt = -100, scarecrowAt = -100;
      const sparrowCycleDuration = 14.25;
      function animateYardAndField(t, dt) {
        animateV3Dog(t, dt);
        const shakeAge = t - scarecrowAt, shake = shakeAge >= 0 && shakeAge < 2 ? Math.exp(-shakeAge * 2) * (1 - THREE.MathUtils.smoothstep(shakeAge, 1.2, 2)) : 0;
        scarecrow.rotation.z = Math.sin(shakeAge * 9) * 0.08 * shake;
        scarecrow.rotation.x = Math.sin(shakeAge * 7) * 0.025 * shake;
        for (const b of sparrows) {
          const a = t - sparrowsAt, duration = 3.8 + b.index * 0.05;
          let u = 0, fly = false, hidden = false;
          if (a >= 0 && a < duration) {
            u = THREE.MathUtils.smoothstep(a, 0, duration);
            fly = true;
          } else if (a >= duration && a < 10) {
            u = 1;
            hidden = b.destination === "tree";
          } else if (a >= 10 && a < 10 + duration) {
            u = 1 - THREE.MathUtils.smoothstep(a, 10, 10 + duration);
            fly = true;
          }
          const p = v4BirdCurve(b, u);
          b.root.visible = !hidden;
          b.root.position.copy(p);
          const tangent = v4BirdTangent(b, u);
          b.root.rotation.y = fly ? Math.atan2(tangent.x * (a < 10 ? 1 : -1), tangent.z * (a < 10 ? 1 : -1)) : b.destination === "roof" && u === 1 ? Math.PI * 0.5 : Math.sin(t * 0.5 + b.index) * 0.7;
          b.root.rotation.x = !fly ? Math.max(0, Math.sin(t * 3 + b.index)) * 0.2 : 0;
          b.wings.forEach((o, i) => o.rotation.z = fly ? Math.sin(t * 23 + b.index) * (i ? -0.9 : 0.9) : 0);
        }
      }
      const snowAudio = { ready: false, nextNote: 0, note: 0, wind: null, leaves: null, fire: null, footsteps: 0 };
      function initSnowAudio() {
        if (snowAudio.ready || !audioContext || !audioMaster) return;
        snowAudio.ready = true;
        function bed(type, freq, gain, rate) {
          const source = audioContext.createBufferSource();
          source.buffer = ambientNoise;
          source.loop = true;
          source.playbackRate.value = rate;
          const filter = audioContext.createBiquadFilter();
          filter.type = type;
          filter.frequency.value = freq;
          const g = audioContext.createGain();
          g.gain.value = gain;
          source.connect(filter);
          filter.connect(g);
          g.connect(audioMaster);
          source.start();
          return g;
        }
        snowAudio.wind = bed("lowpass", 450, 0.01, 0.65);
        snowAudio.leaves = bed("bandpass", 1600, 28e-4, 0.83);
        snowAudio.fire = bed("lowpass", 950, 25e-4, 1.31);
        snowAudio.nextNote = audioContext.currentTime + 2;
      }
      function snowFootstep(volume = 6e-3) {
        if ((audioContext == null ? void 0 : audioContext.state) === "running") {
          noiseTick(audioContext.currentTime + 0.01, 0.16, volume, 1050);
          snowAudio.footsteps++;
        }
      }
      function animateSnowAudio(t) {
        var _a2, _b2, _c2;
        if (!audioContext || audioContext.state !== "running") return;
        initSnowAudio();
        const now = audioContext.currentTime;
        for (const g of [rainBedGain, rainSwellGain, cityBedGain, carAudioGain, musicGain]) g == null ? void 0 : g.gain.setTargetAtTime(0, now, 0.2);
        (_a2 = snowAudio.wind) == null ? void 0 : _a2.gain.setTargetAtTime(8e-3 + Math.sin(t * 0.11) * 2e-3, now, 0.5);
        (_b2 = snowAudio.leaves) == null ? void 0 : _b2.gain.setTargetAtTime(18e-4 + Math.max(0, Math.sin(t * 0.17)) * 13e-4, now, 0.5);
        (_c2 = snowAudio.fire) == null ? void 0 : _c2.gain.setTargetAtTime(2e-3 + Math.max(0, Math.sin(t * 1.3) * Math.cos(t * 2.1)) * 2e-3, now, 0.2);
        if (now > snowAudio.nextNote) {
          const notes = [196, 246.94, 293.66, 369.99, 329.63, 246.94, 220, 293.66], f = notes[snowAudio.note++ % notes.length];
          softSnowNote(f, now + 0.02, 7e-3);
          softSnowNote(f * 2, now + 0.1, 16e-4);
          snowAudio.nextNote = now + 3.8 + snowAudio.note % 3 * 0.65;
        }
      }
      function softSnowNote(f, at, volume) {
        const o = audioContext.createOscillator(), g = audioContext.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(1e-4, at);
        g.gain.exponentialRampToValueAtTime(volume, at + 0.38);
        g.gain.exponentialRampToValueAtTime(1e-4, at + 4.8);
        o.connect(g);
        g.connect(audioMaster);
        o.start(at);
        o.stop(at + 4.9);
        o.onended = () => {
          o.disconnect();
          g.disconnect();
        };
      }
      function v5Stage(p, stage, t) {
        p.stage = stage;
        p.at = t;
      }
      function animateGrandma(t, dt) {
        const p = grandma;
        if (p.stage === "hidden" && t >= grandmaState.next) {
          setPersonPosition(p, ...homeInside, 0);
          v5Stage(p, "homeAppear", t);
          p.inside = true;
        }
        const a = t - p.at;
        switch (p.stage) {
          case "homeAppear":
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) {
              villageMechanisms.homeOpen = true;
              v5Stage(p, "homeOpen", t);
            }
            break;
          case "homeOpen":
            if (villageMechanisms.homeAmount > 0.94) beginWalk(p, [homeInside, homeEntry], t, "homeExited");
            break;
          case "homeExited":
            villageMechanisms.homeOpen = false;
            beginWalk(p, findRoute(homeEntry, deliEntry), t, "deliWaiting");
            break;
          case "deliWaiting":
            villageMechanisms.deliOpen = true;
            if (villageMechanisms.deliAmount > 0.94) beginWalk(p, [deliEntry, deliInside], t, "deliEntered");
            break;
          case "deliEntered":
            p.inside = true;
            villageMechanisms.deliOpen = false;
            if (villageMechanisms.deliAmount < 0.025) v5Stage(p, "deliFade", t);
            break;
          case "deliFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 8) v5Stage(p, "deliAppear", t);
            break;
          case "deliAppear":
            p.inside = true;
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) {
              villageMechanisms.deliOpen = true;
              v5Stage(p, "deliLeave", t);
            }
            break;
          case "deliLeave":
            if (villageMechanisms.deliAmount > 0.94) beginWalk(p, [deliInside, deliEntry], t, "deliExited");
            break;
          case "deliExited":
            villageMechanisms.deliOpen = false;
            beginWalk(p, findRoute(deliEntry, shopEntry), t, "shopWaiting");
            break;
          case "shopWaiting":
            doorTarget = 1;
            if (doorAmount > 0.95) beginWalk(p, [shopEntry, shopInside], t, "shopEntered");
            break;
          case "shopEntered":
            p.inside = true;
            doorTarget = 0;
            if (doorAmount < 0.025) v5Stage(p, "shopFade", t);
            break;
          case "shopFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 10) v5Stage(p, "shopAppear", t);
            break;
          case "shopAppear":
            p.inside = true;
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) {
              doorTarget = 1;
              p.bag.visible = true;
              v5Stage(p, "shopLeave", t);
            }
            break;
          case "shopLeave":
            if (doorAmount > 0.95) beginWalk(p, [shopInside, shopEntry], t, "shopExited");
            break;
          case "shopExited":
            doorTarget = 0;
            beginWalk(p, findRoute(shopEntry, homeEntry), t, "homeWaiting");
            break;
          case "homeWaiting":
            villageMechanisms.homeOpen = true;
            if (villageMechanisms.homeAmount > 0.94) beginWalk(p, [homeEntry, homeInside], t, "homeEntered");
            break;
          case "homeEntered":
            p.inside = true;
            villageMechanisms.homeOpen = false;
            if (villageMechanisms.homeAmount < 0.025) v5Stage(p, "homeFade", t);
            break;
          case "homeFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 1) {
              v5Stage(p, "hidden", t);
              grandmaState.next = t + 24;
            }
            break;
        }
        animateWalker(p, t, dt);
      }
      const grandpaHomeInside = [-10.48, -3.4];
      function animateGrandpa(t, dt) {
        const p = grandpa, b = busState;
        if (p.stage === "hidden" && b.phase === "stop" && b.door > 0.95 && !grandpaState.hasRidden) {
          setPersonPosition(p, -11.09, 6.45, Math.PI);
          setAlpha(p.root, 0);
          v5Stage(p, "busAppear", t);
          p.inside = true;
          grandpaState.hasRidden = true;
        }
        const a = t - p.at;
        switch (p.stage) {
          case "busAppear":
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) beginWalk(p, [[-11.09, 6.45], [-11.09, 5.78], stopEntry], t, "toGrain");
            break;
          case "toGrain":
            beginWalk(p, findRoute(stopEntry, grainEntry), t, "grainWaiting");
            break;
          case "grainWaiting":
            villageMechanisms.grainOpen = true;
            if (villageMechanisms.grainAmount > 0.94) beginWalk(p, [grainEntry, grainInside], t, "grainEntered");
            break;
          case "grainEntered":
            p.inside = true;
            villageMechanisms.grainOpen = false;
            if (villageMechanisms.grainAmount < 0.025) v5Stage(p, "grainFade", t);
            break;
          case "grainFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 9) v5Stage(p, "grainAppear", t);
            break;
          case "grainAppear":
            p.inside = true;
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) {
              villageMechanisms.grainOpen = true;
              v5Stage(p, "grainLeave", t);
            }
            break;
          case "grainLeave":
            if (villageMechanisms.grainAmount > 0.94) beginWalk(p, [grainInside, grainEntry], t, "grainExited");
            break;
          case "grainExited":
            villageMechanisms.grainOpen = false;
            beginWalk(p, findRoute(grainEntry, homeEntry), t, "homeWaiting");
            break;
          case "homeWaiting":
            villageMechanisms.homeOpen = true;
            if (villageMechanisms.homeAmount > 0.94) beginWalk(p, [homeEntry, grandpaHomeInside], t, "homeEntered");
            break;
          case "homeEntered":
            p.inside = true;
            villageMechanisms.homeOpen = false;
            if (villageMechanisms.homeAmount < 0.025) v5Stage(p, "homeFade", t);
            break;
          case "homeFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 7) v5Stage(p, "homeAppear", t);
            break;
          case "homeAppear":
            p.inside = true;
            setAlpha(p.root, Math.min(1, a));
            if (a > 1) {
              villageMechanisms.homeOpen = true;
              v5Stage(p, "homeLeave", t);
            }
            break;
          case "homeLeave":
            if (villageMechanisms.homeAmount > 0.94) beginWalk(p, [grandpaHomeInside, homeEntry], t, "homeExited");
            break;
          case "homeExited":
            villageMechanisms.homeOpen = false;
            beginWalk(p, findRoute(homeEntry, stopEntry), t, "waitBus");
            break;
          case "waitBus":
            if (b.phase === "stop" && b.door > 0.95) {
              b.boarding = true;
              beginWalk(p, [stopEntry, [-11.09, 5.78], [-11.09, 6.45]], t, "busEntered");
            }
            break;
          case "busEntered":
            p.inside = true;
            b.boarding = false;
            b.departRequested = true;
            if (b.door < 0.025) v5Stage(p, "busFade", t);
            break;
          case "busFade":
            setAlpha(p.root, 1 - Math.min(1, a));
            if (a > 1) {
              v5Stage(p, "hidden", t);
              grandpaState.hasRidden = false;
            }
            break;
        }
        animateWalker(p, t, dt);
      }
      function keepHomeDoorClear() {
        const residents = [grandma, grandpa];
        if (residents.some((p) => p.stage === "homeFade" && p.root.userData.alpha > 1e-3 || p.stage === "homeAppear" && p.root.userData.alpha < 0.999)) {
          villageMechanisms.homeOpen = false;
          return;
        }
        if (residents.some((p) => {
          var _a2;
          return ["homeOpen", "homeWaiting", "homeLeave"].includes(p.stage) || p.stage === "walking" && ["homeEntered", "homeExited"].includes((_a2 = p.route) == null ? void 0 : _a2.next);
        })) villageMechanisms.homeOpen = true;
      }
      const v3Seals = new THREE.Group();
      v3Seals.name = "aligned-shop-wall-joints";
      snowShop.add(v3Seals);
      for (const o of snowShop.children.slice()) {
        const p = o.position;
        if (o.isMesh && (Math.abs(p.x - 0.92) < 1e-3 && Math.abs(p.y - 1.63) < 1e-3 || p.x >= 0.78 && p.x <= 1.09 && Math.abs(p.y - 1.72) < 1e-3 || Math.abs(p.x - 0.94) < 1e-3 && Math.abs(p.y - 1.82) < 1e-3)) o.removeFromParent();
      }
      const v3SoyFixtures = new THREE.Group();
      v3SoyFixtures.name = "front-soymilk-porridge";
      v3SoyFixtures.position.z = 0;
      v3SoyFixtures.userData.snowDynamic = true;
      snowShop.add(v3SoyFixtures);
      for (const o of snowShop.children.slice()) {
        const p = o.position;
        if (o.isMesh && (Math.abs(p.x - 0.41) < 1e-3 && p.y > 1.6 && p.y < 2.05 || Math.abs(p.x - 1.54) < 1e-3 && (Math.abs(p.y - 1.81) < 1e-3 || Math.abs(p.y - 1.91) < 1e-3) || o.userData.text === "\u70ED\u8C46\u6D46")) v3SoyFixtures.add(o);
        if (["\u8C46\u6D46\xB7\u70ED\u7CA5", "\u70ED\u6C64 \xB7 \u8C46\u5305", "\u304A\u3067\u3093\u30FB\u8089\u307E\u3093"].includes(o.userData.text)) o.removeFromParent();
        if (o.isMesh && Math.abs(p.x - 1.51) < 1e-3 && Math.abs(p.z + 2.29) < 1e-3) {
          if (Math.abs(p.y - 1.05) < 1e-3) {
            o.position.set(1.37, 1.08, -2.29);
            o.geometry = new THREE.BoxGeometry(1.6, 0.8, 0.74);
          } else if (Math.abs(p.y - 1.43) < 1e-3) {
            o.position.set(1.37, 1.51, -2.29);
            o.geometry = new THREE.BoxGeometry(1.7, 0.08, 0.8);
          }
        }
      }
      for (const o of [coffeeCup, coffeeSurface, coffeeStream, coffeeHit, sugarJar, eggPot, ...steam]) v3SoyFixtures.add(o);
      breakfast.position.set(0, 0.09, 0);
      for (const o of breakfast.children) if (o.position.y > 1.6 && o.position.y < 1.8) o.position.y += 0.014;
      label(0.88, 1.12, -0.39, 1.38, 0.15, "\u8C46\u6D46\xB7\u70ED\u7CA5", snowShop, "#66877f", "#f4ebd2");
      label(1.37, 1.12, -1.9, 1.5, 0.16, "\u65B0\u9C9C\u65E9\u9910", snowShop, "#66877f", "#f4ebd2");
      sb(2.34, 3.25, -1.5, 0.15, 0.53, 4.65, 12241337, v3Seals);
      sb(-4.55, 3.72, -1.55, 0.17, 0.52, 4.66, 12241350, v3Seals);
      sb(-1.15, 3.72, -3.8, 7.02, 0.52, 0.17, 14145219, v3Seals);
      sb(2.34, 3.73, -1.5, 0.15, 0.5, 4.65, 12241337, v3Seals);
      sb(-1.15, 3.77, 0.89, 7.45, 0.42, 0.46, 15788242, v3Seals);
      for (const x of [-4.55, 2.34]) for (const z of [-3.8, 0.8]) sb(x, 2.08, z, 0.18, 2.99, 0.18, 7438454, v3Seals);
      for (const child of residence.children.slice()) if (child.isMesh && Math.abs(child.position.y - 0.85) < 1e-3 && ((_a = child.geometry.parameters) == null ? void 0 : _a.width) === 4.4) child.removeFromParent();
      for (const x of [-1.33, 1.33]) sb(x, 0.85, 1.65, 1.74, 0.58, 0.13, 9991530, residence);
      for (const z of [-1.65, 1.65]) sb(0, 2.6, z, 4.51, 0.16, 0.15, 9991530, residence);
      for (const x of [-2.2, 2.2]) sb(x, 2.6, 0, 0.15, 0.16, 3.35, 9991530, residence);
      sc(1.28, 2.72, -0.41, 0.075, 1.55, 6843237, residence);
      homeFu.material.transparent = true;
      homeFu.material.depthWrite = false;
      for (const x of [-2.05, 2.05]) sb(x, 3.035, 0, 0.15, 0.23, 3.4, 10191972, grain);
      for (const z of [-1.65, 1.65]) sb(0, 3.035, z, 4.22, 0.23, 0.15, 10191972, grain);
      for (const x of [-2.35, 2.35]) sb(x, 2.6, 0, 0.15, 0.18, 3.1, 12892833, bakery);
      for (const z of [-1.5, 1.5]) sb(0, 2.6, z, 4.81, 0.18, 0.15, 12892833, bakery);
      sb(1.68, 2.43, 1.5, 1.15, 0.39, 0.15, 12892833, bakery);
      for (const x of [1.17, 2.19]) sb(x, 1.4, 1.52, 0.1, 1.78, 0.14, 9338980, bakery);
      const kitchenRoofAngle = Math.atan2(0.32, 2.65), kitchenUnder = (z) => 2.07 - 0.05 / Math.cos(kitchenRoofAngle) + z * 0.32 / 2.65;
      for (const x of [-0.48, 0.48]) {
        const x0 = x - 0.05, x1 = x + 0.05, z0 = -1.2, z1 = 1.2, y0 = 1.82, a = kitchenUnder(z0), b = kitchenUnder(z1), v = [[x0, y0, z0], [x1, y0, z0], [x1, a, z0], [x0, a, z0], [x0, y0, z1], [x1, y0, z1], [x1, b, z1], [x0, b, z1]], data = [];
        for (const face2 of [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [3, 2, 6, 7], [0, 3, 7, 4], [1, 5, 6, 2]]) for (const j of [0, 2, 1, 0, 3, 2]) data.push(...v[face2[j]]);
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(data, 3));
        geo.computeVertexNormals();
        const cap = new THREE.Mesh(geo, mat(10983289));
        cap.name = "fitted-kitchen-wall-cap";
        annex.add(cap);
      }
      for (const [z, bottom] of [[-1.2, 1.83], [1.2, 1.94]]) {
        const top = kitchenUnder(z);
        sb(0, (bottom + top) / 2, z, 0.96, top - bottom, 0.1, 10983289, annex);
      }
      repairBike.position.y += 0.065;
      for (const o of repair.children) if (((_b = o.geometry) == null ? void 0 : _b.type) === "TorusGeometry" && o.position.x > 1.7) o.position.y = 1.02;
      for (const o of grain.children) {
        if (o.geometry === snowSphere && Math.abs(o.position.y - 1.2) < 1e-3) o.position.y += 0.11;
        else if (((_c = o.geometry) == null ? void 0 : _c.type) === "CylinderGeometry" && Math.abs(o.position.y - 1.55) < 1e-3) o.position.y += 0.11;
      }
      const v3GrainStock = new THREE.Group();
      v3GrainStock.name = "grain-vegetables-tools";
      grain.add(v3GrainStock);
      for (const [x, z] of [[-1.35, -1.1], [1.35, -1.1]]) {
        sb(x, 1.48, z, 0.67, 0.42, 0.68, 10189652, v3GrainStock);
        for (let j = 0; j < 4; j++) sb(x, 1.33 + j * 0.11, z + 0.35, 0.67, 0.025, 0.025, 7429187, v3GrainStock);
        for (let j = 0; j < 8; j++) {
          const a = j * 2.4;
          ball(x + Math.sin(a) * 0.21, 1.75, z + Math.cos(a) * 0.21, 0.1, 0.07, 0.09, x < 0 ? 11836260 : 9083496, v3GrainStock);
        }
      }
      for (const x of [-1.55, 1.55]) {
        sc(x, 1.18, 0.65, 0.26, 0.52, 9399373, v3GrainStock);
        for (const y of [1, 1.37]) sc(x, y, 0.65, 0.272, 0.035, 6645851, v3GrainStock);
        sc(x, 1.46, 0.65, 0.26, 0.045, 11111010, v3GrainStock);
      }
      sb(0, 1.65, -1.4, 0.8, 0.16, 0.26, 9337179, v3GrainStock);
      for (let j = 0; j < 5; j++) ball(-0.31 + j * 0.15, 1.79, -1.4, 0.055, 0.16, 0.055, 13741145, v3GrainStock);
      rod([-1.85, 0.95, -0.4], [-1.72, 2.15, -0.85], 0.022, 12034425, v3GrainStock);
      sb(-1.85, 0.98, -0.4, 0.25, 0.31, 0.055, 7964298, v3GrainStock);
      label(0, 2.14, -1.56, 0.84, 0.17, "\u6742\u7CAE \xB7 \u79CB\u83DC", v3GrainStock, "#a38d67", "#e5d3a8");
      rearBins.forEach((bin, i) => {
        bin.position.y = 0.28;
        bin.userData.category = i ? "PET" : "BEER";
      });
      rearBins[0].userData.contents.clear();
      for (let j = 0; j < 5; j++) {
        const g = new THREE.Group();
        g.position.set((j % 2 ? 1 : -1) * 0.08, 0.31, -0.11 + Math.floor(j / 2) * 0.1);
        g.rotation.z = (j % 2 ? 1 : -1) * 0.15;
        rearBins[0].userData.contents.add(g);
        sc(0, 0, 0, 0.046, 0.26, 6977872, g);
        sc(0, 0.17, 0, 0.024, 0.095, 6977872, g);
        sc(0, 0.225, 0, 0.026, 0.025, 11182971, g);
        sb(0, -0.01, 0.047, 0.062, 0.09, 4e-3, 13023373, g);
      }
      rearBins[0].userData.contents.traverse((o) => {
        if (o.isMesh) {
          o.userData.action = "recyclingBin";
          o.userData.bin = rearBins[0];
          interactionTargets.push(o);
        }
      });
      const kennel = new THREE.Group();
      kennel.name = "large-enterable-doghouse";
      kennel.position.set(-13.95, 0.28, -0.35);
      kennel.rotation.y = Math.PI / 2;
      kennel.scale.y = 1.15;
      snowStatic.add(kennel);
      sb(0, 0.04, 0, 1.56, 0.08, 1.85, 10719343, kennel);
      for (const x of [-0.76, 0.76]) sb(x, 0.67, 0, 0.1, 1.26, 1.85, 10059868, kennel);
      sb(0, 0.67, -0.88, 1.56, 1.26, 0.1, 10059868, kennel);
      for (const x of [-0.62, 0.62]) sb(x, 0.65, 0.89, 0.31, 1.22, 0.1, 10059868, kennel);
      sb(0, 1.25, 0.89, 1.56, 0.14, 0.1, 10059868, kennel);
      roof(0, 0, 1.86, 2.05, 1.33, 0.46, kennel);
      label(0, 1.43, 1.04, 0.49, 0.15, "\u65FA\u8D22", kennel, "#bb9e70", "#6f5239");
      snowBind(kennel, "yardDog");
      function animateV3Dog(t, dt) {
        const s = dogState, a = t - s.at;
        let z = 0, yaw2 = 0;
        dogRoot.visible = true;
        if (s.phase === "out") {
          z = THREE.MathUtils.lerp(0, 1.55, THREE.MathUtils.smoothstep(a, 0, 3));
          if (a >= 3) {
            s.phase = "wait";
            s.at = t;
          }
        } else if (s.phase === "wait") {
          z = 1.55;
          if (a > 8) {
            s.phase = "turn";
            s.at = t;
          }
        } else if (s.phase === "turn") {
          z = 1.55;
          yaw2 = Math.PI * THREE.MathUtils.smoothstep(a, 0, 1.8);
          if (a >= 1.8) {
            s.phase = "in";
            s.at = t;
          }
        } else if (s.phase === "in") {
          yaw2 = Math.PI;
          z = THREE.MathUtils.lerp(1.55, 0, THREE.MathUtils.smoothstep(a, 0, 3));
          if (a >= 3) s.phase = "inside";
        }
        const heading = kennel.rotation.y;
        dogRoot.position.set(kennel.position.x + Math.sin(heading) * z, 0.37, kennel.position.z + Math.cos(heading) * z);
        dogRoot.rotation.y = heading + yaw2;
        dogLegs.forEach((o, i) => o.rotation.x = ["out", "in"].includes(s.phase) ? Math.sin(t * 5 + i * Math.PI) * 0.18 : 0);
        yardDogTail.rotation.y = Math.sin(t * (s.phase === "inside" ? 1.2 : 7)) * 0.18;
        s.yaw = yaw2;
      }
      function animateV3Freezer(t, dt) {
        const s = freezerCycle;
        freezerAmount = THREE.MathUtils.damp(freezerAmount, freezerOpen ? 1 : 0, 5, dt);
        freezerLid.rotation.x = -freezerAmount * 1.4;
        if (s.phase === "opening" && freezerAmount > 0.97) {
          s.phase = "rising";
          s.at = t;
        }
        if (s.phase === "rising") {
          s.lift = THREE.MathUtils.damp(s.lift, 1, 5, dt);
          if (s.lift > 0.98) s.phase = "ready";
        } else if (s.phase === "taking") {
          if (t - s.at >= 0.75) {
            popsicle.visible = false;
            s.phase = "closing";
            freezerOpen = false;
          }
        } else if (s.phase === "closing" && freezerAmount < 0.012) {
          s.phase = "closed";
          s.lift = 0;
        }
        const take = s.phase === "taking" ? THREE.MathUtils.clamp((t - s.at) / 0.75, 0, 1) : 0;
        setAlpha(popsicle, ["rising", "ready", "taking"].includes(s.phase) && s.lift > 0.012 ? 1 - take : 0);
        popsicle.position.set(0, 0.33 + s.lift * 0.95 + take * 0.25, take * 0.65);
        popsicle.rotation.z = Math.sin(t * 1.8) * 0.025 * s.lift;
      }
      fadeable(popsicle);
      setAlpha(popsicle, 0);
      const iceHoleWater = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(iceHoleOutline), 48), new THREE.MeshPhysicalMaterial({ color: 2379106, roughness: 0.08, metalness: 0.18, transparent: true, opacity: 0.79, side: THREE.DoubleSide, depthWrite: false }));
      iceHoleWater.rotation.x = Math.PI / 2;
      iceHoleWater.position.set(iceHoleCenter.x, -0.165, iceHoleCenter.y);
      snowTown.add(iceHoleWater);
      const v4RimPoints = iceHoleOutline.map((p) => new THREE.Vector3(p.x + iceHoleCenter.x, -0.105, p.y + iceHoleCenter.y));
      const v3IceRim = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v4RimPoints, true), 96, 0.024, 6, true), new THREE.MeshPhysicalMaterial({ color: 13232365, roughness: 0.17, metalness: 0.1 }));
      snowStatic.add(v3IceRim);
      const koi = new THREE.Group();
      koi.name = "breathing-red-white-koi";
      snowTown.add(koi);
      ball(0, 0, 0, 0.1, 0.1, 0.27, 15130568, koi);
      ball(-0.025, 0.075, 0.02, 0.065, 0.035, 0.11, 13129531, koi);
      ball(0.025, 0.03, 0.19, 0.075, 0.065, 0.08, 13129531, koi);
      for (const x of [-0.068, 0.068]) ball(x, 0.046, 0.19, 0.011, 0.012, 0.012, 2635579, koi);
      const v3KoiMouth = new THREE.Mesh(new THREE.TorusGeometry(0.028, 7e-3, 5, 12), mat(14072994));
      v3KoiMouth.position.set(0, 0.02, 0.265);
      koi.add(v3KoiMouth);
      const v3KoiTail = new THREE.Group();
      v3KoiTail.position.z = -0.23;
      koi.add(v3KoiTail);
      for (const side of [-1, 1]) {
        const fin = ball(side * 0.055, 0, -0.06, 0.07, 0.012, 0.1, 13207403, v3KoiTail);
        fin.rotation.y = side * 0.6;
        const pectoral = ball(side * 0.11, -0.015, 0.05, 0.08, 0.01, 0.1, 14135947, koi);
        pectoral.rotation.y = side * 0.55;
      }
      koi.visible = false;
      const koiState = { phase: "hidden", at: 0, next: performance.now() / 1e3 + 14 }, v3Ripples = [];
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(new THREE.RingGeometry(0.11, 0.118, 40), new THREE.MeshBasicMaterial({ color: 12048610, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(iceHoleCenter.x, -0.153, iceHoleCenter.y);
        snowTown.add(ring);
        v3Ripples.push(ring);
      }
      koi.traverse((o) => {
        if (o.isMesh) {
          o.material = o.material.clone();
          o.material.emissive.copy(o.material.color);
          o.material.emissiveIntensity = 0.48;
          o.castShadow = false;
        }
      });
      function animateV3Details(t, dt) {
        for (const q of snowChimneys) {
          const age2 = t - q.at;
          q.puffs.forEach((p, i) => {
            const a = age2 - i * 0.075, u = a / 2.8;
            p.visible = a >= 0 && u < 1;
            p.position.copy(q.origin);
            p.position.y += Math.max(0, u) * 1.8;
            p.position.x += Math.sin(i * 2.4) * Math.max(0, u) * 0.43;
            p.position.z += Math.cos(i * 2.4) * Math.max(0, u) * 0.32;
            p.scale.setScalar(0.23 + Math.max(0, u) * 1.05);
            p.material.opacity = p.visible ? Math.sin(u * Math.PI) * 0.58 : 0;
          });
        }
        const s = koiState;
        if (s.phase === "hidden" && t > s.next) {
          s.phase = "surface";
          s.at = t;
        }
        const age = t - s.at;
        if (s.phase === "surface") {
          koi.visible = true;
          const u = THREE.MathUtils.smoothstep(age, 0, 2) * (1 - THREE.MathUtils.smoothstep(age, 5.5, 8));
          koi.position.set(iceHoleCenter.x + Math.sin(age * 0.65) * 0.07, -0.53 + u * 0.37, iceHoleCenter.y + Math.cos(age * 0.55) * 0.05);
          koi.rotation.x = -0.45 * u;
          koi.rotation.y = Math.sin(age * 0.35) * 0.35;
          v3KoiTail.rotation.y = Math.sin(age * 5) * 0.2;
          v3KoiMouth.scale.setScalar(1 + Math.sin(age * 4) * 0.22);
          if (age > 8) {
            s.phase = "hidden";
            s.next = t + 22 + (Math.sin(t) * 0.5 + 0.5) * 12;
            koi.visible = false;
          }
        } else koi.visible = false;
        v3Ripples.forEach((r, i) => {
          const u = (age + i * 0.55) % 2 / 2;
          r.visible = s.phase === "surface" && age > 1.4 && age < 7;
          r.scale.setScalar(0.6 + u * 3.6);
          r.material.opacity = r.visible ? (1 - u) * 0.25 : 0;
        });
      }
      for (const b of sparrows) if (Math.abs(b.home[0] + 0.4) < 1.25 && Math.abs(b.home[1] - 13.5) < 0.65) b.home[1] = 12.45;
      for (const b of sparrows) {
        b.root.name = "golden-brown-sparrow";
        b.destination = b.index < 4 ? "roof" : "tree";
        let end;
        if (b.destination === "roof") {
          const x = -8.3 - b.index * 0.45, z = [11.15, 12.1, 13.1, 13.8][b.index], localZ = (x - repair.position.x) / repair.scale.z, y = repair.position.y + (2.7 + localZ * 0.48 / 3.2 + 0.245) * repair.scale.y;
          end = new THREE.Vector3(x, y + 0.025, z);
        } else end = new THREE.Vector3(-13.1 + (b.index - 6) * 0.09, 3.85 + b.index % 2 * 0.12, 11.6 + Math.sin(b.index) * 0.12);
        b.perch = [end.x, end.z];
        const start = new THREE.Vector3(b.home[0], 0.34, b.home[1]);
        b.flightCurve = new THREE.CubicBezierCurve3(start, new THREE.Vector3(start.x - 0.35, 6.1, start.z + (end.z - start.z) * 0.12), new THREE.Vector3(end.x + 2.25, 6.5, end.z + 0.1), end);
      }
      function v4BirdCurve(b, u) {
        return b.flightCurve.getPoint(u);
      }
      function v4BirdTangent(b, u) {
        return b.flightCurve.getTangent(u);
      }
      function v4Bench(x, z, yaw2 = 0) {
        const g = new THREE.Group();
        g.name = "snow-covered-roadside-bench";
        g.position.set(x, 0.28, z);
        g.rotation.y = yaw2;
        snowStatic.add(g);
        for (const xx of [-0.7, 0.7]) {
          sb(xx, 0.22, 0, 0.09, 0.44, 0.38, 6648172, g);
          sb(xx, 0.73, -0.23, 0.07, 0.73, 0.07, 6648172, g);
        }
        for (let j = 0; j < 3; j++) {
          sb(0, 0.47, -0.16 + j * 0.16, 1.85, 0.075, 0.14, 9598037, g);
          sb(0, 0.73 + j * 0.14, -0.25, 1.85, 0.115, 0.06, 9598037, g);
        }
        ball(-0.42, 0.619, -0.01, 0.39, 0.016, 0.18, snowWhite, g);
        ball(0.61, 0.62, 0.04, 0.25, 0.014, 0.13, snowWhite, g);
        ball(0, 1.185, -0.25, 0.88, 0.017, 0.065, snowWhite, g);
        return g;
      }
      const fieldBench = v4Bench(-1.5, 9.45, Math.PI), fieldBench2 = v4Bench(0.7, 9.45, Math.PI), parkBench = v4Bench(10.4, 9.15, Math.PI), parkBench2 = v4Bench(12.6, 9.15, Math.PI);
      const well = new THREE.Group();
      well.name = "black-soil-field-well";
      well.position.set(-0.7, 0.28, 18);
      snowStatic.add(well);
      for (let layer = 0; layer < 3; layer++) for (let j = 0; j < 14; j++) {
        const a = (j + layer % 2 * 0.5) / 14 * Math.PI * 2, o = sb(Math.cos(a) * 0.56, 0.12 + layer * 0.2, Math.sin(a) * 0.56, 0.24, 0.19, 0.21, j % 3 ? 9016216 : 10331556, well);
        o.rotation.y = -a;
      }
      const v4WellWater = new THREE.Mesh(new THREE.CircleGeometry(0.44, 32), new THREE.MeshPhysicalMaterial({ color: 2904158, roughness: 0.15, metalness: 0.1 }));
      v4WellWater.rotation.x = -Math.PI / 2;
      v4WellWater.position.y = 0.16;
      well.add(v4WellWater);
      for (const side of [-1, 1]) sb(side * 0.67, 1.12, 0, 0.1, 2.24, 0.12, wood, well);
      rod([-0.77, 1.67, 0], [0.77, 1.67, 0], 0.06, 9139284, well);
      rod([0.8, 1.67, 0], [0.8, 1.39, 0], 0.025, 7240053, well);
      rod([0.8, 1.39, 0], [0.99, 1.39, 0], 0.028, wood, well);
      roof(0, 0, 1.92, 1.4, 2.25, 0.3, well);
      for (let j = 0; j < 9; j++) {
        const a = j / 9 * Math.PI * 2;
        ball(Math.cos(a) * 0.55, 0.65, Math.sin(a) * 0.55, 0.16, 0.025, 0.12, snowWhite, well);
      }
      const v4WellBucket = new THREE.Group();
      v4WellBucket.position.set(0, 0.45, 0);
      v4WellBucket.userData.snowDynamic = true;
      well.add(v4WellBucket);
      sc(0, 0, 0, 0.15, 0.26, 8887196, v4WellBucket);
      const v4BucketHandle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.012, 5, 16, Math.PI), mat(11055265));
      v4BucketHandle.position.y = 0.13;
      v4WellBucket.add(v4BucketHandle);
      const v4WellRope = rod([0, 0.7, 0], [0, 1.67, 0], 0.012, 10259303, well);
      v4WellRope.userData.snowDynamic = true;
      label(0, 0.4, 0.69, 0.51, 0.16, "\u8001\u6C34\u4E95", well, "#bfae89", "#655039");
      snowBind(well, "well");
      const recreation = new THREE.Group();
      recreation.name = "snowy-village-exercise-corner";
      snowStatic.add(recreation);
      const v4Swing = new THREE.Group();
      v4Swing.name = "village-swing";
      v4Swing.position.set(9.8, 0.28, 14.4);
      recreation.add(v4Swing);
      for (const side of [-1, 1]) for (const z of [-0.75, 0.75]) rod([side * 1.25, 0, z], [side * 1.25, 2.6, 0], 0.065, 7308153, v4Swing);
      rod([-1.4, 2.6, 0], [1.4, 2.6, 0], 0.075, 7308153, v4Swing);
      ball(0, 2.68, 0, 1.4, 0.045, 0.09, snowWhite, v4Swing);
      const swingPivot = new THREE.Group();
      swingPivot.position.y = 2.53;
      swingPivot.userData.snowDynamic = true;
      v4Swing.add(swingPivot);
      for (const x of [-0.4, 0.4]) rod([x, 0, 0], [x, -1.78, 0], 0.014, 10463651, swingPivot);
      sb(0, -1.8, 0, 1.02, 0.09, 0.43, 10254419, swingPivot);
      ball(-0.25, -1.738, 0.02, 0.24, 0.017, 0.15, snowWhite, swingPivot);
      ball(0.31, -1.737, -0.06, 0.15, 0.014, 0.11, snowWhite, swingPivot);
      snowBind(v4Swing, "swing");
      const v4Seesaw = new THREE.Group();
      v4Seesaw.name = "village-seesaw";
      v4Seesaw.position.set(10.3, 0.28, 11.6);
      recreation.add(v4Seesaw);
      for (const x of [-0.27, 0.27]) rod([x, 0, -0.3], [0, 0.72, 0], 0.065, 6519926, v4Seesaw);
      for (const x of [-0.27, 0.27]) rod([x, 0, 0.3], [0, 0.72, 0], 0.065, 6519926, v4Seesaw);
      const seesawPivot = new THREE.Group();
      seesawPivot.position.y = 0.72;
      seesawPivot.userData.snowDynamic = true;
      v4Seesaw.add(seesawPivot);
      sb(0, 0, 0, 3.3, 0.12, 0.23, 10189910, seesawPivot);
      for (const side of [-1, 1]) {
        sb(side * 1.38, 0.08, 0, 0.49, 0.08, 0.45, 10906448, seesawPivot);
        rod([side * 1.1, 0.05, 0], [side * 1.1, 0.48, 0], 0.023, 7442310, seesawPivot);
        rod([side * 1.1, 0.48, -0.15], [side * 1.1, 0.48, 0.15], 0.022, 7442310, seesawPivot);
        ball(side * 1.4, 0.138, -0.03, 0.21, 0.016, 0.17, snowWhite, seesawPivot);
      }
      snowBind(v4Seesaw, "seesaw");
      const v4Fitness = new THREE.Group();
      v4Fitness.name = "elderly-fitness-equipment";
      v4Fitness.position.set(13.9, 0.28, 10.8);
      recreation.add(v4Fitness);
      for (const x of [-0.45, 0.45]) sc(x, 0.035, 0, 0.34, 0.07, 6848376, v4Fitness);
      sc(0, 0.92, -0.32, 0.065, 1.84, 7441795, v4Fitness);
      rod([-0.63, 1.14, -0.15], [0.63, 1.14, -0.15], 0.035, 7441795, v4Fitness);
      const twistDisc = new THREE.Group();
      twistDisc.userData.snowDynamic = true;
      twistDisc.position.set(-0.45, 0.09, 0);
      v4Fitness.add(twistDisc);
      sc(0, 0, 0, 0.29, 0.07, 10985866, twistDisc);
      sb(0, 0.04, 0, 0.42, 9e-3, 0.03, 7703419, twistDisc);
      ball(0.12, 0.046, -0.1, 0.11, 0.01, 0.1, snowWhite, twistDisc);
      snowBind(twistDisc, "fitness");
      const v4HandWheels = [];
      for (const [x, y, z] of [[0.48, 1.52, -0.31], [-0.35, 1.51, -0.31]]) {
        const wheel2 = new THREE.Group();
        wheel2.position.set(x, y, z);
        wheel2.userData.snowDynamic = true;
        v4Fitness.add(wheel2);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.025, 7, 24), mat(10203036));
        wheel2.add(ring);
        for (let j = 0; j < 3; j++) {
          const a = j * Math.PI * 2 / 3;
          rod([0, 0, 0], [Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0], 0.014, 10203036, wheel2);
        }
        rod([0.23, 0, 0], [0.23, 0, 0.1], 0.02, 11580835, wheel2);
        v4HandWheels.push(wheel2);
      }
      ball(0, 1.87, -0.32, 0.12, 0.025, 0.11, snowWhite, v4Fitness);
      snowBind(v4Fitness, "fitness");
      const pullUpBar = new THREE.Group();
      pullUpBar.name = "snowy-single-pull-up-bar";
      pullUpBar.position.set(13.3, 0.28, 13.5);
      recreation.add(pullUpBar);
      for (const x of [-0.75, 0.75]) {
        sc(x, 0.035, 0, 0.14, 0.07, 6913397, pullUpBar);
        sc(x, 1.18, 0, 0.055, 2.36, 8296844, pullUpBar);
        ball(x, 2.38, 0, 0.065, 0.025, 0.065, snowWhite, pullUpBar);
      }
      rod([-0.9, 2.36, 0], [0.9, 2.36, 0], 0.045, 8296844, pullUpBar);
      rod([-0.68, 2.406, 0], [0.45, 2.406, 0], 0.023, snowWhite, pullUpBar);
      pullUpBar.userData.footprint = [1.8, 0.3];
      const iceSled = new THREE.Group();
      iceSled.name = "bridge-to-bridge-ice-sled";
      iceSled.userData.snowDynamic = true;
      snowTown.add(iceSled);
      for (const x of [-0.23, 0.23]) {
        rod([x, 0.025, -0.49], [x, 0.025, 0.42], 0.023, 7899530, iceSled);
        rod([x, 0.025, 0.42], [x, 0.08, 0.54], 0.021, 7899530, iceSled);
        for (const z of [-0.3, 0.3]) rod([x, 0.025, z], [x, 0.12, z], 0.018, 7899530, iceSled);
      }
      for (let j = 0; j < 4; j++) sb(0, 0.115, -0.33 + j * 0.22, 0.62, 0.045, 0.18, 11241304, iceSled);
      for (const side of [-1, 1]) rod([side * 0.16, 0.16, -0.3], [side * 0.18, 0.16, 0.32], 0.014, 10258534, iceSled);
      sb(0, 0.175, -0.39, 0.59, 0.055, 0.07, 9794383, iceSled);
      ball(-0.18, 0.15, -0.25, 0.1, 9e-3, 0.08, snowWhite, iceSled);
      snowBind(iceSled, "iceSled");
      snowBind(riverIce, "iceSled");
      const iceSledState = { phase: "idle", at: 0, z: 3.5, from: 3.5, to: -7.5, side: "wood", yaw: Math.PI, fromYaw: Math.PI }, v4Motion = { swing: -100, seesaw: -100, fitness: -100, well: -100 };
      function snowV4Action(action, t) {
        if (action === "iceSled") {
          const s = iceSledState;
          if (s.phase === "idle") {
            s.from = s.z;
            s.to = s.side === "wood" ? -7.5 : 3.5;
            s.fromYaw = s.yaw;
            s.phase = "turn";
            s.at = t;
          }
          return true;
        }
        if (Object.prototype.hasOwnProperty.call(v4Motion, action)) {
          v4Motion[action] = t;
          return true;
        }
        return false;
      }
      function animateV4(t, dt) {
        for (const [key, root, axis, amplitude, speed] of [["swing", swingPivot, "x", 0.21, 1.9], ["seesaw", seesawPivot, "z", 0.15, 2.2], ["fitness", twistDisc, "y", 0.8, 2]]) {
          const a2 = t - v4Motion[key], envelope = a2 >= 0 && a2 < 14 ? Math.sin(Math.min(1, a2 / 0.65) * Math.PI / 2) * Math.exp(-a2 * 0.12) : 0;
          root.rotation[axis] = Math.sin(a2 * speed) * amplitude * envelope;
        }
        const fa = t - v4Motion.fitness;
        v4HandWheels.forEach((w, i) => w.rotation.z = fa >= 0 && fa < 14 ? Math.sin(fa * 1.7 + i) * 0.9 * Math.exp(-fa * 0.12) : 0);
        const wa = t - v4Motion.well, lift = wa >= 0 && wa < 6 ? Math.sin(wa / 6 * Math.PI) * 0.7 : 0;
        v4WellBucket.position.y = 0.45 + lift;
        v4WellRope.scale.y = Math.max(0.05, (0.97 - lift) / 0.97);
        v4WellRope.position.y = 1.185 + lift / 2;
        const s = iceSledState, a = t - s.at, forward = s.to > s.from;
        let desired = (forward ? 0 : Math.PI) + Math.atan2((riverCenter(s.z + 0.01) - riverCenter(s.z - 0.01)) / 0.02, 1);
        if (s.phase === "turn") {
          s.yaw = THREE.MathUtils.lerp(s.fromYaw, angleToward(s.fromYaw, desired), THREE.MathUtils.smoothstep(a, 0, 0.75));
          if (a >= 0.75) {
            s.phase = "slide";
            s.at = t;
          }
        } else if (s.phase === "slide") {
          s.z = THREE.MathUtils.lerp(s.from, s.to, THREE.MathUtils.smoothstep(a, 0, 14));
          s.yaw = desired;
          if (a >= 14) {
            s.phase = "idle";
            s.side = s.to < 0 ? "stone" : "wood";
          }
        }
        iceSled.position.set(riverCenter(s.z), -0.105, s.z);
        iceSled.rotation.y = s.yaw;
      }
      function resetV4() {
        Object.assign(iceSledState, { phase: "idle", at: 0, z: 3.5, from: 3.5, to: -7.5, side: "wood", yaw: Math.PI, fromYaw: Math.PI });
        for (const k of Object.keys(v4Motion)) v4Motion[k] = -100;
        swingPivot.rotation.x = seesawPivot.rotation.z = twistDisc.rotation.y = 0;
      }
      animateV4(performance.now() / 1e3, 0);
      animateV3Dog(performance.now() / 1e3, 0);
      const snowBootMap = texture(128, 256, (c, W, H) => {
        c.clearRect(0, 0, W, H);
        c.beginPath();
        c.moveTo(40, 220);
        c.bezierCurveTo(24, 212, 25, 167, 31, 139);
        c.bezierCurveTo(24, 100, 24, 43, 48, 27);
        c.bezierCurveTo(82, 9, 106, 39, 102, 89);
        c.lineTo(94, 159);
        c.lineTo(91, 215);
        c.quadraticCurveTo(67, 234, 40, 220);
        c.closePath();
        c.fillStyle = "rgba(59,82,103,.65)";
        c.fill();
        c.lineWidth = 4;
        c.strokeStyle = "rgba(66,91,111,.26)";
        c.stroke();
        c.beginPath();
        c.moveTo(37, 210);
        c.bezierCurveTo(30, 170, 38, 150, 34, 128);
        c.bezierCurveTo(29, 75, 33, 41, 48, 32);
        c.strokeStyle = "rgba(218,232,239,.30)";
        c.lineWidth = 3;
        c.stroke();
        c.strokeStyle = "rgba(58,83,103,.25)";
        c.lineWidth = 5;
        for (const y of [77, 108, 184, 203]) {
          c.beginPath();
          c.moveTo(44, y);
          c.lineTo(84, y - 4);
          c.stroke();
        }
      });
      const snowTyreMap = texture(64, 128, (c, W, H) => {
        const g = c.createLinearGradient(0, 0, W, 0);
        g.addColorStop(0, "rgba(101,122,137,0)");
        g.addColorStop(0.16, "rgba(101,122,137,.28)");
        g.addColorStop(0.5, "rgba(101,122,137,.38)");
        g.addColorStop(0.84, "rgba(101,122,137,.28)");
        g.addColorStop(1, "rgba(101,122,137,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
        c.strokeStyle = "rgba(69,94,111,.18)";
        c.lineWidth = 3;
        for (let y = 8; y < H; y += 24) {
          c.beginPath();
          c.moveTo(13, y - 5);
          c.lineTo(32, y + 3);
          c.lineTo(51, y - 5);
          c.stroke();
        }
      });
      function snowTracePool(name, limit, w, h, map, lifetime) {
        const geometry = new THREE.PlaneGeometry(w, h), alphas = new Float32Array(limit), born = new Float64Array(limit);
        born.fill(-Infinity);
        geometry.setAttribute("snowTraceAlpha", new THREE.InstancedBufferAttribute(alphas, 1));
        const material = new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, color: 16777215, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
        material.onBeforeCompile = (shader) => {
          shader.vertexShader = "attribute float snowTraceAlpha; varying float vSnowTraceAlpha;\n" + shader.vertexShader;
          shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvSnowTraceAlpha=snowTraceAlpha;");
          shader.fragmentShader = "varying float vSnowTraceAlpha;\n" + shader.fragmentShader;
          shader.fragmentShader = shader.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\ndiffuseColor.a *= vSnowTraceAlpha;");
        };
        material.customProgramCacheKey = () => "snow-trace-opacity-v1";
        const mesh = new THREE.InstancedMesh(geometry, material, limit);
        mesh.name = name;
        mesh.count = 0;
        mesh.frustumCulled = false;
        mesh.renderOrder = 2;
        snowTown.add(mesh);
        return { mesh, alphas, born, lifetime, limit, cursor: 0, total: 0, active: 0 };
      }
      const snowTraces = { footprints: snowTracePool("fresh-walking-impressions", 256, 0.225, 0.36, snowBootMap, 46), tyres: snowTracePool("shallow-minibus-wheel-ruts", 512, 0.17, 0.3, snowTyreMap, 64), busRearX: NaN };
      const snowTraceDummy = new THREE.Object3D();
      function stampSnowTrace(pool, x, z, yaw2, t, y, opacity = 0.75) {
        if (Math.hypot(x, z) > 19.72) return;
        const i = pool.cursor;
        pool.cursor = (i + 1) % pool.limit;
        pool.total++;
        pool.born[i] = t;
        pool.alphas[i] = opacity;
        snowTraceDummy.position.set(x, y, z);
        snowTraceDummy.rotation.set(-Math.PI / 2, 0, yaw2 + Math.PI);
        snowTraceDummy.scale.set(1, 1, 1);
        snowTraceDummy.updateMatrix();
        pool.mesh.setMatrixAt(i, snowTraceDummy.matrix);
        pool.mesh.count = Math.min(pool.total, pool.limit);
        pool.mesh.instanceMatrix.needsUpdate = true;
        pool.mesh.geometry.attributes.snowTraceAlpha.needsUpdate = true;
      }
      function stampWalkerSnow(p, t, step) {
        if (p.inside || !p.root.visible || p.root.userData.alpha < 0.9) return;
        const yaw2 = p.root.rotation.y, side = step % 2 ? -0.125 : 0.125, x = p.root.position.x + Math.cos(yaw2) * side + Math.sin(yaw2) * 0.055, z = p.root.position.z - Math.sin(yaw2) * side + Math.cos(yaw2) * 0.055;
        if (Math.abs(x - riverCenter(z)) < riverWidth / 2 + 0.15 || bridges.some((b) => b.kind !== "modern" && Math.abs(x - riverX) < b.span / 2 + 0.1 && Math.abs(z - b.z) < b.depth / 2 + 0.08) || Math.abs(x + 11.09) < 0.6 && z > 5.65) return;
        stampSnowTrace(snowTraces.footprints, x, z, yaw2, t, walkHeight(x, z) + 0.01, 0.75);
      }
      function animateSnowTraces(t) {
        const rear = bus.position.x - 1.45, s = snowTraces;
        if (!["arrive", "leave"].includes(busState.phase) || !bus.visible || bus.userData.alpha < 0.25) s.busRearX = NaN;
        else if (!Number.isFinite(s.busRearX) || rear < s.busRearX || rear - s.busRearX > 1.8) s.busRearX = rear;
        else {
          while (rear - s.busRearX >= 0.28) {
            const x = s.busRearX + 0.14;
            for (const z of [roadZ - 1.12, roadZ + 1.12]) {
              const e = riverEdges(z);
              if (x < e.left || x > e.right) stampSnowTrace(s.tyres, x, z, Math.PI / 2, t, roadY + 8e-3, 0.55);
            }
            s.busRearX += 0.28;
          }
        }
        for (const pool of [s.footprints, s.tyres]) {
          let active = 0;
          for (let i = 0; i < pool.mesh.count; i++) {
            const age = t - pool.born[i], cover = age >= 0 ? Math.pow(1 - THREE.MathUtils.smoothstep(age, 3, pool.lifetime), 1.65) : 0;
            pool.alphas[i] = cover * (pool === s.footprints ? 0.75 : 0.55);
            if (pool.alphas[i] > 2e-3) active++;
          }
          pool.active = active;
          pool.mesh.geometry.attributes.snowTraceAlpha.needsUpdate = true;
        }
      }
      function clearSnowTraces() {
        snowTraces.busRearX = NaN;
        for (const p of [snowTraces.footprints, snowTraces.tyres]) {
          p.cursor = p.total = p.active = 0;
          p.mesh.count = 0;
          p.born.fill(-Infinity);
          p.alphas.fill(0);
          p.mesh.geometry.attributes.snowTraceAlpha.needsUpdate = true;
        }
      }
      Object.assign(snowTraces, { update: animateSnowTraces, clear: clearSnowTraces });
      const softLanternMap = texture(128, 128, (c, W, H) => {
        const g = c.createRadialGradient(W / 2, H / 2, 3, W / 2, H / 2, W * 0.48);
        g.addColorStop(0, "rgba(255,216,157,.32)");
        g.addColorStop(0.42, "rgba(255,216,157,.16)");
        g.addColorStop(0.74, "rgba(255,216,157,.05)");
        g.addColorStop(1, "rgba(255,216,157,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      const softWindowMap = texture(128, 128, (c, W, H) => {
        c.clearRect(0, 0, W, H);
        for (let y = 0; y < H; y++) {
          const v = y / H, width = 0.24 + 0.2 * v, fade = Math.sin(v * Math.PI) * 0.3;
          for (let x = 0; x < W; x++) {
            const u = x / W - 0.5, edge = 1 - THREE.MathUtils.smoothstep(Math.abs(u), width - 0.09, width), bar = Math.abs(u) < 0.014 ? 0.34 : 1;
            c.fillStyle = "rgba(255,222,169," + fade * edge * bar + ")";
            c.fillRect(x, y, 1, 1);
          }
        }
      });
      function softSnowHeight(x, z) {
        const lx = x - snowShop.position.x, lz = z - snowShop.position.z;
        if (lx >= -4.66 && lx <= 2.36 && lz >= 0.525 && lz <= 1.775) return 0.57;
        if (lx >= -2.145 && lx <= -0.295 && lz >= 1.655 && lz <= 2.145) return 0.545;
        if (lx >= -2.22 && lx <= -0.22 && lz >= 2.075 && lz <= 2.425) return 0.415;
        return onRoad(x, z) ? walkHeight(x, z) : 0.28;
      }
      function snowSpill(x, z, rx, rz, map, opacity, name) {
        const xs = [x - rx, x + rx], zs = [z - rz, z + rz], data = [], uv2 = [];
        for (let i = 1; i < 9; i++) {
          xs.push(x - rx + 2 * rx * i / 9);
          zs.push(z - rz + 2 * rz * i / 9);
        }
        for (const v of [-4.66, 2.36, -2.145, -0.295, -2.22, -0.22]) if (v + snowShop.position.x > x - rx && v + snowShop.position.x < x + rx) xs.push(v + snowShop.position.x);
        for (const v of [0.525, 1.775, 1.655, 2.145, 2.075, 2.425]) if (v + snowShop.position.z > z - rz && v + snowShop.position.z < z + rz) zs.push(v + snowShop.position.z);
        for (const r of roads) {
          for (const v of [r.x - r.w / 2, r.x + r.w / 2]) if (v > x - rx && v < x + rx) xs.push(v);
          for (const v of [r.z - r.d / 2, r.z + r.d / 2]) if (v > z - rz && v < z + rz) zs.push(v);
        }
        const xx = [...new Set(xs)].sort((a, b) => a - b), zz = [...new Set(zs)].sort((a, b) => a - b);
        for (let i = 1; i < xx.length; i++) for (let j = 1; j < zz.length; j++) {
          const ax = xx[i - 1], bx = xx[i], az = zz[j - 1], bz = zz[j], y = softSnowHeight((ax + bx) / 2, (az + bz) / 2) + 6e-3;
          for (const p of [[ax, az], [bx, bz], [bx, az], [ax, az], [ax, bz], [bx, bz]]) {
            data.push(p[0], y, p[1]);
            uv2.push((p[0] - x + rx) / (2 * rx), (p[1] - z + rz) / (2 * rz));
          }
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.Float32BufferAttribute(data, 3));
        geo.setAttribute("uv", new THREE.Float32BufferAttribute(uv2, 2));
        geo.computeVertexNormals();
        const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map, color: map === softWindowMap ? 16761214 : 16777215, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false }));
        mesh.name = name;
        mesh.renderOrder = 1;
        snowTown.add(mesh);
        return mesh;
      }
      const softSnowLights = { lanternPools: [], windowPools: [] };
      snowShop.updateMatrixWorld(true);
      for (const [i, g] of lanterns.entries()) {
        const p = g.getWorldPosition(new THREE.Vector3());
        lanternLights[i].color.setHex(16759939);
        lanternLights[i].intensity = 0.76;
        lanternLights[i].distance = 3.4;
        softSnowLights.lanternPools.push(snowSpill(p.x, p.z + 0.12, 0.94, 0.86, softLanternMap, 0.5, "lantern-warm-spill-on-snow"));
      }
      snowTown.updateMatrixWorld(true);
      const snowyWindows = [];
      snowStatic.traverse((o) => {
        if (o.userData.snowWindow) snowyWindows.push(o);
      });
      for (const root of snowyWindows) {
        const p = root.getWorldPosition(new THREE.Vector3()), scale = root.getWorldScale(new THREE.Vector3()), w = root.userData.snowWindow.width * scale.x, curtain = root.children.find((o) => o.userData.width);
        const mesh = snowSpill(p.x, p.z + 0.65, Math.min(1.7, w * 0.56), 0.63, softWindowMap, curtain ? 0.35 : 0.46, "window-light-on-snow");
        softSnowLights.windowPools.push({ mesh, curtain, source: root });
      }
      for (const [x, w] of [[-3.325, 2.35], [0.995, 2.57]]) {
        const mesh = snowSpill(x + snowShop.position.x, 1.65 + snowShop.position.z, w * 0.38, 0.64, softWindowMap, 0.37, "shop-window-light-on-porch");
        softSnowLights.windowPools.push({ mesh, curtain: null, source: snowShop });
      }
      function animateSoftSnowLights() {
        for (const q of softSnowLights.windowPools) if (q.curtain) q.mesh.material.opacity = 0.35 + q.curtain.userData.amount * 0.3;
      }
      function mergeSnowStatic(root) {
        root.updateMatrixWorld(true);
        const groups = /* @__PURE__ */ new Map(), objects = [];
        root.traverse((o) => {
          if (!o.visible || !o.isMesh || o.material.transparent || o.material.visible === false || o.userData.snowAction || o.userData.action || o.userData.snowDynamic || interactionTargets.includes(o) || Array.isArray(o.material)) return;
          let p = o.parent;
          while (p && p !== root) {
            if (!p.visible || p.userData.snowAction || p.userData.snowDynamic) return;
            p = p.parent;
          }
          const key = o.material.uuid;
          let a = groups.get(key);
          if (!a) groups.set(key, a = []);
          a.push(o);
        });
        for (const meshes of groups.values()) {
          if (meshes.length < 2) continue;
          const inverse = new THREE.Matrix4().copy(root.matrixWorld).invert(), geos = meshes.map((o) => {
            const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
            g.applyMatrix4(new THREE.Matrix4().multiplyMatrices(inverse, o.matrixWorld));
            return g;
          });
          const geo = new THREE.BufferGeometry();
          for (const name of ["position", "normal", "uv"]) {
            if (!geos.every((g) => g.attributes[name])) continue;
            const size = geos[0].attributes[name].itemSize, total = geos.reduce((n, g) => n + g.attributes[name].array.length, 0), data = new Float32Array(total);
            let offset = 0;
            for (const g of geos) {
              data.set(g.attributes[name].array, offset);
              offset += g.attributes[name].array.length;
            }
            geo.setAttribute(name, new THREE.BufferAttribute(data, size));
          }
          geo.computeBoundingSphere();
          const merged = new THREE.Mesh(geo, meshes[0].material);
          merged.name = "snow-static-batch";
          merged.castShadow = true;
          merged.receiveShadow = true;
          root.add(merged);
          for (const o of meshes) o.removeFromParent();
          geos.forEach((g) => g.dispose());
        }
      }
      const summer = { season: "summer", fanAt: -100, dragonflies: [], gardenLeaves: [], fans: [], puddles: [], fireflyTime: { value: 0 }, audioEvents: { frogs: 0, insects: 0, distantDog: 0 }, boatState: iceSledState };
      hemisphere.color.setHex(16771795);
      hemisphere.groundColor.setHex(9016425);
      hemisphere.intensity = 1.06;
      moon.color.setHex(16764820);
      moon.intensity = 1.05;
      renderer.toneMappingExposure = 1.19;
      snowGround.material = new THREE.MeshToonMaterial({ color: 8887913, gradientMap: gradient, side: THREE.DoubleSide });
      landSide.material = mat(7630169);
      v3Base.material = mat(6446926);
      for (const q of [...icicles, snowman, shovel, v3IceRim, iceHoleWater, iceSled, windowFog, fogHit]) q.visible = false;
      snowShop.remove(windowFog, fogHit);
      snowman.userData.winterOnly = true;
      shovel.userData.winterOnly = true;
      const summerWinterParts = [];
      snowTown.traverse((o) => {
        var _a2, _b2, _c2;
        if (((_a2 = o.geometry) == null ? void 0 : _a2.type) === "CylinderGeometry" && ((_c2 = (_b2 = o.material) == null ? void 0 : _b2.color) == null ? void 0 : _c2.getHex()) === snowWhite) {
          o.visible = false;
          o.userData.winterOnly = true;
        }
        if (o.userData.winterOnly) summerWinterParts.push(o);
      });
      summer.winterParts = summerWinterParts;
      const summerWaterMap = texture(128, 512, (c, W, H) => {
        c.fillStyle = "#61958c";
        c.fillRect(0, 0, W, H);
        for (let i = 0; i < 42; i++) {
          const x = i * 37 % W, y = i * 71 % H;
          c.strokeStyle = i % 3 ? "rgba(183,213,177,.27)" : "rgba(40,85,84,.22)";
          c.lineWidth = i % 3 ? 1.3 : 3;
          c.beginPath();
          c.moveTo(x - 12, y);
          c.quadraticCurveTo(x + 6, y + 4, x + 25, y);
          c.stroke();
        }
      });
      summerWaterMap.wrapS = summerWaterMap.wrapT = THREE.RepeatWrapping;
      summerWaterMap.repeat.set(1, 7);
      riverIce.material = new THREE.MeshPhysicalMaterial({ map: summerWaterMap, color: 11127741, emissive: 2644047, emissiveIntensity: 0.28, transparent: true, opacity: 0.62, roughness: 0.23, metalness: 0.13, clearcoat: 0.8, side: THREE.DoubleSide, depthWrite: false });
      riverIce.name = "flowing-summer-river";
      summer.water = riverIce;
      for (let i = 0; i < 56; i++) {
        const z = -17 + i * 0.62, x = riverCenter(z) + (i % 2 ? -0.78 : 0.78);
        if (bridges.some((b) => Math.abs(z - b.z) < b.depth / 2 + 0.5) || Math.hypot(x, z) > 19.3) continue;
        ball(x, -0.27, z, 0.15, 0.08, 0.2, i % 3 ? 9736050 : 11116932);
        for (let j = 0; j < 3; j++) rod([x, -0.18, z], [x + (j - 1) * 0.07, 0.24 + i % 3 * 0.07, z + 0.04], 9e-3, 7245144);
      }
      const asphaltPoly = clipPoly(clipPoly(perimeter, (p) => p.y >= 5.41, (a, b) => a.clone().lerp(b, (5.41 - a.y) / (b.y - a.y))), (p) => p.y <= 8.59, (a, b) => a.clone().lerp(b, (8.59 - a.y) / (b.y - a.y)));
      flatPolygon(asphaltPoly, roadY + 7e-3, 8028795);
      for (let x = -17; x < 18; x += 2.2) if (Math.abs(x - riverX) > 2.4) sb(x, roadY + 9e-3, 7, 0.85, 2e-3, 0.045, 13025953);
      for (const [x, z, rx, rz] of [[-5.6, 3.8, 0.65, 0.2], [2.7, -5.5, 0.45, 0.18], [9, 4.8, 0.55, 0.17], [-4.5, 8.05, 0.7, 0.18]]) {
        const p = new THREE.Mesh(new THREE.CircleGeometry(1, 24), new THREE.MeshPhysicalMaterial({ color: 7313811, transparent: true, opacity: 0.36, roughness: 0.13, metalness: 0.22, depthWrite: false }));
        p.rotation.x = -Math.PI / 2;
        p.scale.set(rx, rz, 1);
        p.position.set(x, roadY + 0.011, z);
        snowTown.add(p);
        summer.puddles.push(p);
      }
      for (const [x, z, w, d] of [[-9.4, 7.8, 0.9, 0.34], [-2.1, 6.15, 1.2, 0.32], [10.9, 7.7, 0.72, 0.4]]) sb(x, roadY + 0.01, z, w, 3e-3, d, 7305073);
      const tyrePump = new THREE.Group();
      tyrePump.position.set(1.85, 0.62, 2.1);
      repair.add(tyrePump);
      sb(0, 0.025, 0, 0.3, 0.05, 0.19, 7569266, tyrePump);
      sc(0, 0.27, 0, 0.045, 0.49, 9280133, tyrePump);
      rod([0, 0.48, 0], [0, 0.66, 0], 0.014, 12106917, tyrePump);
      sb(0, 0.66, 0, 0.32, 0.04, 0.04, 7239786, tyrePump);
      const hose = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.03, 0.44, 0), new THREE.Vector3(0.25, 0.34, 0.04), new THREE.Vector3(0.25, 0.08, 0.13), new THREE.Vector3(0.06, 0.06, 0.14)]), 16, 0.01, 5, false), mat(5332049));
      tyrePump.add(hose);
      for (const y of [0.69, 0.8]) {
        const tyre = new THREE.Mesh(new THREE.TorusGeometry(0.25, 0.048, 7, 20), mat(4542280));
        tyre.rotation.x = Math.PI / 2;
        tyre.position.set(-1.85, y, 2.12);
        tyre.name = "clear-of-roller-door-tyre";
        tyre.userData.snowDynamic = true;
        repair.add(tyre);
      }
      for (const tree of villageLeafTrees) {
        const { root, h } = tree;
        for (let i = 0; i < 6; i++) {
          const a = i * 2.4, r = i % 2 ? 0.5 : 0.32;
          ball(Math.sin(a) * r, h * (0.73 + i % 3 * 0.09), Math.cos(a) * r, h * 0.24, h * 0.24, h * 0.22, [6585937, 7901530, 9150052][i % 3], root);
        }
      }
      summer.shadeTree = villageLeafTrees.find((t) => !t.birch).root;
      const summerGrassMaterials = [7113041, 9217896].map((color) => new THREE.MeshToonMaterial({ color, gradientMap: gradient, side: THREE.DoubleSide }));
      for (let i = 0; i < 220; i++) {
        const a = sr() * Math.PI * 2, r = 3 + sr() * 16, x = Math.sin(a) * r, z = Math.cos(a) * r;
        if (Math.hypot(x - 12.3, z + 11.8) < 2.7 || onRoad(x, z, 0.4) || nearBuilding(x, z, 0.22) || Math.abs(x - riverCenter(z)) < 1.6 || Math.abs(x - field.x) < field.w / 2 + 0.3 && Math.abs(z - field.z) < field.d / 2 + 0.3) continue;
        for (let j = 0; j < 3; j++) {
          const blade = new THREE.Mesh(new THREE.PlaneGeometry(0.045, 0.22 + sr() * 0.15), summerGrassMaterials[i % 2]);
          blade.position.set(x + (j - 1) * 0.05, 0.4, z);
          blade.rotation.y = j * 1.9;
          snowStatic.add(blade);
        }
        if (i % 5 === 0) {
          sc(x, 0.47, z, 8e-3, 0.35, 7639120);
          ball(x, 0.66, z, 0.042, 0.024, 0.04, i % 3 ? 14073723 : 12818592);
        }
      }
      const summerCrops = new THREE.Group();
      summerCrops.name = "corn-and-bean-field";
      summerCrops.position.set(field.x, 0.33, field.z);
      summerCrops.userData.snowDynamic = true;
      snowTown.add(summerCrops);
      summer.crops = summerCrops;
      const cornLeafGeo = new THREE.BufferGeometry();
      cornLeafGeo.setAttribute("position", new THREE.Float32BufferAttribute([0, 0, 0, -0.065, 0.18, 0.035, -0.055, 0.38, 0.07, 0, 0.64, 0.1, 0.055, 0.36, 0.07, 0.05, 0.15, 0.025], 3));
      cornLeafGeo.setIndex([0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5]);
      cornLeafGeo.computeVertexNormals();
      const stalks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.017, 0.025, 1, 5), mat(6586955), 70), leaves = new THREE.InstancedMesh(cornLeafGeo, new THREE.MeshToonMaterial({ color: 8823636, gradientMap: gradient, side: THREE.DoubleSide }), 280), cobs = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 7, 5), mat(13153377), 42), cropDummy = new THREE.Object3D();
      summerCrops.add(stalks, leaves, cobs);
      let si = 0, li = 0, ci = 0;
      for (let row = 0; row < 7; row++) for (let col = 0; col < 10; col++) {
        const x = -3.8 + col * 0.83, z = -2.15 + row * 0.7, h = row < 2 ? 0.48 : 1.22 + sr() * 0.38;
        cropDummy.position.set(x, h / 2, z);
        cropDummy.rotation.set(0, 0, 0);
        cropDummy.scale.set(1, h, 1);
        cropDummy.updateMatrix();
        stalks.setMatrixAt(si++, cropDummy.matrix);
        for (let j = 0; j < 4; j++) {
          cropDummy.position.set(x, h * (0.28 + j * 0.14), z);
          cropDummy.rotation.set(0.3 + j * 0.11, j * 2.4, (j % 2 ? 1 : -1) * 0.85);
          cropDummy.scale.set(row < 2 ? 1.6 : 1, row < 2 ? 0.42 : 1, 1);
          cropDummy.updateMatrix();
          leaves.setMatrixAt(li++, cropDummy.matrix);
        }
        if (row >= 2 && ci < 42) {
          cropDummy.position.set(x + 0.045, h * 0.63, z);
          cropDummy.rotation.set(0.2, 0, 0.25);
          cropDummy.scale.set(0.045, 0.16, 0.045);
          cropDummy.updateMatrix();
          cobs.setMatrixAt(ci++, cropDummy.matrix);
        }
      }
      cobs.count = ci;
      const garden = new THREE.Group();
      garden.name = "home-bean-cucumber-garden";
      snowStatic.add(garden);
      summer.garden = garden;
      sb(-13.2, 0.305, 1.9, 1.8, 0.045, 1.65, 5325872, garden);
      for (const x of [-13.9, -12.5]) for (const z of [1.25, 2.55]) rod([x, 0.32, z], [x, 2.4, z], 0.025, 10194277, garden);
      for (const z of [1.25, 1.9, 2.55]) rod([-14, 2.4, z], [-12.4, 2.4, z], 0.022, 10194277, garden);
      for (let i = 0; i < 9; i++) {
        const x = -13.86 + i % 3 * 0.64, z = 1.3 + Math.floor(i / 3) * 0.57;
        rod([x, 0.34, z], [x, 2.35, z], 0.011, 7046477, garden);
        for (let k = 0; k < 4; k++) {
          const leaf = ball(x + (k % 2 ? -0.1 : 0.1), 0.6 + k * 0.43, z, 0.13, 0.032, 0.1, 7968850, garden);
          leaf.rotation.z = k % 2 ? 0.4 : -0.4;
          if (i % 4 === 0 && k === 3) {
            leaf.userData.snowDynamic = true;
            summer.gardenLeaves.push(leaf);
          }
        }
        const fruit = ball(x + 0.055, 1.3, z + 0.04, 0.033, 0.17, 0.032, i % 2 ? 6849613 : 4683600, garden);
        fruit.rotation.z = 0.16;
      }
      const onionBed = new THREE.Group();
      onionBed.name = "enlarged-scallion-plot";
      onionBed.position.set(-8.85, 0, 0.95);
      garden.add(onionBed);
      summer.onionBed = onionBed;
      sb(0, 0.305, 0, 2, 0.045, 1.5, 5325872, onionBed);
      for (let i = 0; i < 35; i++) {
        const x = -0.84 + i % 7 * 0.28, z = -0.58 + Math.floor(i / 7) * 0.28;
        for (let k = 0; k < 3; k++) rod([x, 0.33, z], [x + (k - 1) * 0.035, 0.64, z + 0.025], 9e-3, 7379025, onionBed);
      }
      const homeFlowerbed = new THREE.Group();
      homeFlowerbed.name = "window-side-flowerbed";
      homeFlowerbed.position.set(-8.85, 0, -0.95);
      snowStatic.add(homeFlowerbed);
      summer.flowerbed = homeFlowerbed;
      sb(0, 0.31, 0, 2.2, 0.055, 1.2, 5851446, homeFlowerbed);
      for (const x of [-1.14, 1.14]) sb(x, 0.37, 0, 0.065, 0.14, 1.32, 10259312, homeFlowerbed);
      for (const z of [-0.64, 0.64]) sb(0, 0.37, z, 2.34, 0.14, 0.065, 10259312, homeFlowerbed);
      for (let i = 0; i < 24; i++) {
        const x = -0.95 + i % 8 * 0.27, z = -0.39 + Math.floor(i / 8) * 0.38, y = 0.6 + i % 3 * 0.055;
        rod([x, 0.35, z], [x, y, z], 8e-3, 7506260, homeFlowerbed);
        for (const side of [-1, 1]) {
          const leaf = ball(x + side * 0.045, y - 0.12, z, 0.065, 0.018, 0.026, 8099418, homeFlowerbed);
          leaf.rotation.z = side * 0.35;
        }
        for (let j = 0; j < 6; j++) {
          const a = j * Math.PI / 3;
          ball(x + Math.sin(a) * 0.043, y, z + Math.cos(a) * 0.043, 0.036, 0.015, 0.027, [13608302, 13078425, 14076320][i % 3], homeFlowerbed);
        }
        ball(x, y + 0.013, z, 0.025, 0.015, 0.025, 13018455, homeFlowerbed);
      }
      function summerMelon(x, y, z, r, parent, cut = false) {
        if (!cut) {
          ball(x, y, z, r, r * 0.85, r, 7902031, parent);
          for (let i = 0; i < 8; i++) {
            const a = i * Math.PI / 4, pts = [];
            for (let j = 0; j <= 12; j++) {
              const t = 0.25 + j / 12 * (Math.PI - 0.5);
              pts.push(new THREE.Vector3(x + Math.sin(a) * r * Math.sin(t) * 1.012, y + r * 0.86 * Math.cos(t), z + Math.cos(a) * r * Math.sin(t) * 1.012));
            }
            const stripe = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, 8e-3, 4, false), mat(4549956));
            parent.add(stripe);
          }
        } else {
          ball(x, y, z, r, r * 0.45, r, 6325321, parent);
          const disk = new THREE.Mesh(new THREE.CircleGeometry(r * 0.92, 20), mat(13987673));
          disk.rotation.x = -Math.PI / 2;
          disk.position.set(x, y + r * 0.42, z);
          parent.add(disk);
          for (let i = 0; i < 7; i++) {
            const a = i * 2.4;
            ball(x + Math.sin(a) * r * 0.58, y + r * 0.43, z + Math.cos(a) * r * 0.58, 9e-3, 3e-3, 0.016, 5196086, parent);
          }
        }
      }
      for (const [i, g] of fruitCrates.entries()) {
        g.clear();
        sb(0, 0.07, 0, 0.85, 0.13, 0.6, wood, g);
        for (const z of [-0.3, 0.3]) sb(0, 0.19, z, 0.85, 0.21, 0.035, 10191966, g);
        if (!i) for (let j = 0; j < 3; j++) summerMelon(-0.26 + j * 0.26, 0.28, 0, 0.135, g);
        else for (let j = 0; j < 9; j++) {
          const x = -0.26 + j % 3 * 0.26, z = -0.18 + Math.floor(j / 3) * 0.18, r = 0.082;
          const melon = ball(x, 0.245, z, r, 0.073, r, 14075278, g);
          melon.name = "small-muskmelon";
          for (let k = 0; k < 5; k++) {
            const a = k * Math.PI * 2 / 5;
            rod([x + Math.sin(a) * r * 0.96, 0.22, z + Math.cos(a) * r * 0.96], [x + Math.sin(a) * r * 0.55, 0.303, z + Math.cos(a) * r * 0.55], 25e-4, 15193514, g);
          }
        }
        g.name = i ? "muskmelon-crate" : "watermelon-crate";
        label(0, 0.18, 0.326, 0.7, 0.15, i ? "\u9999\u751C\u9999\u74DC" : "\u6C99\u74E4\u897F\u74DC", g, "#d2b78b", "#664b36");
      }
      for (const pad of cottonLeaves) {
        pad.clear();
        pad.name = "summer-mesh-screen-curtain";
        const meshMap = texture(128, 128, (c, W, H) => {
          c.clearRect(0, 0, W, H);
          c.strokeStyle = "rgba(67,87,75,.32)";
          c.lineWidth = 1;
          for (let k = 0; k < W; k += 6) {
            c.beginPath();
            c.moveTo(k, 0);
            c.lineTo(k, H);
            c.moveTo(0, k);
            c.lineTo(W, k);
            c.stroke();
          }
        });
        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.78, 1.98), new THREE.MeshBasicMaterial({ map: meshMap, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false }));
        screen.position.set(0, 1.8, 0.07);
        pad.add(screen);
        for (const x of [-0.39, 0.39]) sb(x, 1.8, 0.08, 0.025, 2, 0.025, 7705472, pad);
        sb(0, 2.8, 0.08, 0.8, 0.04, 0.035, 7705472, pad);
      }
      frontAwning.material = mat(10726794).clone();
      frontAwning.material.map = texture(128, 128, (c, W, H) => {
        for (let i = 0; i < 8; i++) {
          c.fillStyle = i % 2 ? "#d8cfaa" : "#789180";
          c.fillRect(i * 16, 0, 16, H);
        }
      });
      const summerTable = new THREE.Group();
      summerTable.position.set(-3.65, 0.28, 2.6);
      snowShop.add(summerTable);
      summer.table = summerTable;
      sb(0, 0.63, 0, 1.4, 0.08, 0.72, 10125402, summerTable);
      for (const x of [-0.57, 0.57]) for (const z of [-0.25, 0.25]) sb(x, 0.31, z, 0.055, 0.62, 0.055, wood, summerTable);
      summerMelon(-0.34, 0.73, 0, 0.19, summerTable, true);
      sc(0.31, 0.78, 0.1, 0.08, 0.21, 14800570, summerTable);
      const mugHandle = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 5, 12), mat(14141864));
      mugHandle.position.set(0.4, 0.8, 0.1);
      summerTable.add(mugHandle);
      label(0, 0.53, 0.378, 1.18, 0.15, "\u51B0\u68CD\xB7\u6C7D\u6C34\xB7\u5207\u897F\u74DC", summerTable, "#d0bd8b", "#5e6244");
      for (const z of [-0.25, 0.25]) {
        sc(-0.98, 0.34, z, 0.23, 0.07, 10849893, summerTable);
        for (const dx of [-0.12, 0.12]) sb(-0.98 + dx, 0.16, z, 0.035, 0.32, 0.25, wood, summerTable);
      }
      const tablePalm = palmFan(summerTable, 0.08, 0.682, -0.15);
      tablePalm.rotation.x = -Math.PI / 2;
      tablePalm.userData.tableFan = true;
      summer.windowLeaves = [];
      for (const curtains of houseWindows) {
        curtains.userData.open = true;
        curtains.userData.amount = 0.72;
        curtains.userData.closeAt = Infinity;
        curtains.visible = false;
        const root = curtains.parent, w = curtains.userData.width;
        for (const side of [-1, 1]) {
          const hinge = new THREE.Group();
          hinge.userData.snowDynamic = true;
          hinge.position.set(side * w / 2, 0, 0.075);
          root.add(hinge);
          const cx = -side * w / 4;
          const glass2 = new THREE.Mesh(new THREE.PlaneGeometry(w / 2, 0.95), new THREE.MeshPhysicalMaterial({ color: 14476493, transparent: true, opacity: 0.1, roughness: 0.18, side: THREE.DoubleSide, depthWrite: false }));
          glass2.position.x = cx;
          hinge.add(glass2);
          for (const xx of [cx - w / 4, cx + w / 4]) sb(xx, 0, 5e-3, 0.023, 0.98, 0.025, 9079659, hinge);
          for (const yy of [-0.49, 0.49]) sb(cx, yy, 5e-3, w / 2, 0.023, 0.025, 9079659, hinge);
          summer.windowLeaves.push({ hinge, side, curtains });
        }
      }
      const fan = new THREE.Group();
      fan.position.set(-2.55, 0.28, 2.55);
      snowShop.add(fan);
      summer.fan = fan;
      sc(0, 0.04, 0, 0.25, 0.08, 7310718, fan);
      sc(0, 0.45, 0, 0.032, 0.82, 8230792, fan);
      const fanHead = new THREE.Group();
      fanHead.position.set(0, 0.99, 0);
      fanHead.userData.snowDynamic = true;
      fan.add(fanHead);
      const fanRotor = new THREE.Group();
      fanRotor.userData.snowDynamic = true;
      fanHead.add(fanRotor);
      for (let j = 0; j < 3; j++) {
        const a = j * Math.PI * 2 / 3, blade = ball(Math.sin(a) * 0.12, Math.cos(a) * 0.12, 0, 0.068, 0.17, 0.015, 11450016, fanRotor);
        blade.rotation.z = -a;
      }
      for (const z of [-0.085, 0.085]) {
        for (const r of [0.12, 0.23, 0.325]) {
          const hoop = new THREE.Mesh(new THREE.TorusGeometry(r, 7e-3, 5, 32), mat(7505789));
          hoop.position.z = z;
          fanHead.add(hoop);
        }
        for (let j = 0; j < 16; j++) {
          const a = j * Math.PI / 8;
          rod([0, 0, z], [Math.sin(a) * 0.325, Math.cos(a) * 0.325, z], 45e-4, 7505789, fanHead);
        }
      }
      for (let j = 0; j < 16; j++) {
        const a = j * Math.PI / 8;
        rod([Math.sin(a) * 0.325, Math.cos(a) * 0.325, -0.085], [Math.sin(a) * 0.325, Math.cos(a) * 0.325, 0.085], 5e-3, 7505789, fanHead);
      }
      ball(0, 0, 0.1, 0.045, 0.045, 0.018, 12041379, fanHead);
      sc(0, 0, -0.14, 0.085, 0.12, 7310718, fanHead).rotation.x = Math.PI / 2;
      snowBind(fan, "summerFan");
      Object.assign(summer, { fanHead, fanRotor, fanOn: true });
      function palmFan(parent, x, y, z) {
        const g = new THREE.Group();
        g.position.set(x, y, z);
        g.userData.snowDynamic = true;
        parent.add(g);
        const p = new THREE.Mesh(new THREE.CircleGeometry(0.16, 12), new THREE.MeshBasicMaterial({ color: 13481864, side: THREE.DoubleSide }));
        p.scale.y = 1.2;
        g.add(p);
        rod([0, -0.12, 0], [0, -0.33, 0], 0.012, 10256471, g);
        for (let j = 0; j < 5; j++) line([[0, -0.13, 3e-3], [(j - 2) * 0.055, 0.12, 3e-3]], 11309931, 1, g);
        summer.fans.push(g);
        return g;
      }
      summer.walkerFan = palmFan(grandpa.arms[0], -0.07, -0.18, 0.09);
      summer.walkerFan.name = "right-hand-palm-fan";
      const seated = villager(false);
      setAlpha(seated.root, 1);
      seated.root.position.set(12.6, 0.085, 9.12);
      const seatedTorso = seated.root.children[0];
      seatedTorso.position.y = 1.1;
      seatedTorso.scale.y = 0.3;
      seated.root.rotation.y = Math.PI;
      seated.legs.forEach((q) => {
        q.hip.rotation.x = -1.15;
        q.knee.rotation.x = 1.15;
      });
      seated.bag.position.set(0.7, 0.33, 0.42);
      seated.breath.forEach((o) => o.visible = false);
      palmFan(seated.arms[0], -0.07, -0.18, 0.09);
      summer.seated = seated;
      {
        const meatCover = new THREE.Group();
        meatCover.name = "glass-covered-meat-counter";
        frozenStall.add(meatCover);
        summer.meatCover = meatCover;
        const meatGlass = new THREE.MeshPhysicalMaterial({ color: 14805205, transparent: true, opacity: 0.12, roughness: 0.12, side: THREE.DoubleSide, depthWrite: false });
        for (const z of [-0.45, 0.45]) {
          const pane2 = new THREE.Mesh(new THREE.PlaneGeometry(1.96, 0.64), meatGlass);
          pane2.position.set(0, 1.14, z);
          meatCover.add(pane2);
        }
        for (const x of [-0.98, 0.98]) {
          const pane2 = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.64), meatGlass);
          pane2.position.set(x, 1.14, 0);
          pane2.rotation.y = Math.PI / 2;
          meatCover.add(pane2);
          for (const z of [-0.45, 0.45]) rod([x, 0.82, z], [x, 1.46, z], 0.014, 8885121, meatCover);
        }
        const meatTop = new THREE.Mesh(new THREE.PlaneGeometry(1.96, 0.9), meatGlass);
        meatTop.rotation.x = -Math.PI / 2;
        meatTop.position.y = 1.46;
        meatCover.add(meatTop);
        for (const z of [-0.45, 0.45]) rod([-0.98, 1.46, z], [0.98, 1.46, z], 0.014, 8885121, meatCover);
        Object.assign(summer, { stove: villageSteamer, potLid: steamerLid, potOpen: false, potAmount: 0 });
        snowBind(villageSteamer, "summerPot");
        const bucketWall = v4WellBucket.children[0];
        bucketWall.geometry = new THREE.CylinderGeometry(0.15, 0.15, 0.26, 20, 1, true);
        bucketWall.material = bucketWall.material.clone();
        bucketWall.material.side = THREE.DoubleSide;
        sc(0, -0.122, 0, 0.145, 0.014, 8887196, v4WellBucket);
        const bucketWater = new THREE.Mesh(new THREE.CircleGeometry(0.142, 24), new THREE.MeshPhysicalMaterial({ color: 7511700, roughness: 0.14, metalness: 0.16 }));
        bucketWater.rotation.x = -Math.PI / 2;
        bucketWater.position.y = 0.102;
        v4WellBucket.add(bucketWater);
        summer.bucketWater = bucketWater;
        const waterGlint = new THREE.Mesh(new THREE.RingGeometry(0.075, 0.08, 24, 1, 0, 1.7), new THREE.MeshBasicMaterial({ color: 13230807, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
        waterGlint.rotation.x = -Math.PI / 2;
        waterGlint.position.set(-0.012, 0.104, 0);
        v4WellBucket.add(waterGlint);
        for (const l of lanterns) {
          const paper = l.getObjectByName("lit-red-lantern-paper");
          paper.material = new THREE.MeshBasicMaterial({ color: 13984585, toneMapped: false });
          const fu = l.children.find((o) => {
            var _a2;
            return ((_a2 = o.geometry) == null ? void 0 : _a2.type) === "PlaneGeometry";
          });
          if (fu) {
            fu.material = fu.material.clone();
            fu.material.map = texture(128, 160, (c, W, H) => {
              c.fillStyle = "#d56349";
              c.fillRect(0, 0, W, H);
              c.fillStyle = "#e1bb78";
              c.font = "bold 96px Microsoft YaHei";
              c.textAlign = "center";
              c.textBaseline = "middle";
              c.fillText("\u798F", W / 2, H / 2 + 3);
            });
            fu.material.toneMapped = false;
          }
        }
        lanternLights.forEach((l) => l.intensity = 0.4);
        summer.swallows = [];
        summer.swallowFlights = [];
        for (let i = 0; i < 5; i++) {
          const g = new THREE.Group();
          g.name = "perched-swallow";
          let x, z, y;
          if (i < 4) {
            const u = 0.2 + i * 0.17;
            x = -13 + 26.1 * u + 0.48;
            z = -7.3 + 1.7 * u;
            y = 6.15 - Math.sin(u * Math.PI) * 1.05;
          } else {
            x = 13.6;
            z = 13.5;
            y = 0.28 + 2.36;
          }
          g.position.set(x, y + 0.055, z);
          g.userData.snowDynamic = true;
          const wings = [];
          snowStatic.add(g);
          ball(0, 0.045, 0, 0.055, 0.07, 0.11, 3161923, g);
          ball(0, 0.105, 0.06, 0.046, 0.046, 0.046, 3161411, g);
          ball(0, 0.035, 0.045, 0.038, 0.045, 0.055, 14735291, g);
          ball(0, 0.081, 0.097, 0.03, 0.018, 0.013, 11233360, g);
          const beak2 = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.047, 5), mat(13085289));
          beak2.rotation.x = Math.PI / 2;
          beak2.position.set(0, 0.102, 0.123);
          beak2.name = "swallow-beak";
          g.add(beak2);
          for (const side of [-1, 1]) {
            const eye = ball(side * 0.034, 0.121, 0.089, 8e-3, 9e-3, 6e-3, 1121056, g);
            eye.name = "swallow-eye";
            ball(side * 0.035, 0.124, 0.093, 25e-4, 25e-4, 2e-3, 15130056, g);
            const pivot = new THREE.Group();
            pivot.position.set(side * 0.045, 0.052, -0.018);
            g.add(pivot);
            const wing = ball(side * 0.02, 0, -0.02, 0.023, 0.045, 0.093, 2504766, pivot);
            wing.rotation.z = -side * 0.22;
            wings.push({ pivot, mesh: wing, side });
            rod([side * 0.025, 0.015, -0.06], [side * 0.065, -0.025, -0.22], 0.014, 2504766, g);
            rod([side * 0.025, 0.025, 0.025], [side * 0.025, -0.05, 0.025], 6e-3, 7760979, g);
          }
          const state = { root: g, home: g.position.clone(), side: i % 2 ? 1 : -1, at: -100, active: false, landingYaw: 0, wings };
          snowBind(g, "swallow");
          snowHit("swallow", 0, 0.07, 0, 0.3, 0.23, 0.38, g);
          g.traverse((o) => o.userData.swallow = state);
          summer.swallowFlights.push(state);
          summer.swallows.push(g);
        }
        summer.fish = [];
        koi.visible = false;
        koi.removeFromParent();
        iceHoleWater.removeFromParent();
        v3IceRim.removeFromParent();
        v3Ripples.forEach((r) => r.removeFromParent());
        for (let i = 0; i < 16; i++) {
          let fin = function(points, name) {
            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.Float32BufferAttribute([].concat.apply([], points), 3));
            geo.setIndex([0, 1, 2, 0, 2, 3]);
            geo.computeVertexNormals();
            const m = new THREE.Mesh(geo, new THREE.MeshToonMaterial({ color: finColors[kind], gradientMap: gradient, side: THREE.DoubleSide }));
            m.name = name;
            return m;
          };
          const kind = i % 4, fish = new THREE.Group(), names = ["\u7EA2\u767D\u9526\u9CA4", "\u91D1\u9CAB\u9C7C", "\u9752\u80CC\u9CA4\u9C7C", "\u7EC6\u8EAB\u767D\u6761"], bodyColors = [14932928, 13344843, 8228217, 12372155], finColors = [13013363, 12161873, 8886660, 11058610], width = [0.1, 0.115, 0.11, 0.065][kind], height = [0.075, 0.09, 0.085, 0.055][kind], length = [0.25, 0.23, 0.28, 0.3][kind];
          fish.name = names[kind] + "-" + i;
          fish.userData.snowDynamic = true;
          fish.scale.setScalar(0.72 + i % 3 * 0.1);
          snowTown.add(fish);
          const body = ball(0, 0, 0, width, height, length, bodyColors[kind], fish);
          body.name = "upright-fish-body";
          body.material = body.material.clone();
          body.material.emissive.copy(body.material.color);
          body.material.emissiveIntensity = 0.22;
          ball(0, -height * 0.38, 5e-3, width * 0.83, height * 0.47, length * 0.86, kind === 1 ? 14534540 : 13882810, fish);
          if (kind === 0) {
            ball(-0.026, height * 0.82, 0.015, 0.045, 0.012, 0.092, 12082242, fish);
            ball(0.021, height * 0.71, length * 0.53, 0.045, 0.019, 0.055, 12082242, fish);
          }
          if (kind === 2) ball(0, height * 0.88, -0.01, width * 0.7, 0.013, length * 0.68, 6058596, fish);
          const dorsal = fin([[0, height * 0.82, 0.04], [0, height + 0.055, -0.04], [0, height + 0.025, -length * 0.62], [0, height * 0.78, -length * 0.68]], "vertical-dorsal-fin");
          fish.add(dorsal);
          const tail2 = new THREE.Group();
          tail2.name = "vertical-fish-tail";
          tail2.position.z = -length * 0.88;
          fish.add(tail2);
          ball(0, 0, -0.02, width * 0.35, height * 0.45, 0.065, bodyColors[kind], tail2);
          tail2.add(fin([[0, 0, -0.02], [0, 0.085, -0.15], [0, 0, -0.105], [0, -0.085, -0.15]], "forked-tail-fin"));
          const fins = [];
          for (const side of [-1, 1]) {
            const p = fin([[side * width * 0.72, -0.018, 0.055], [side * (width + 0.075), -0.03, -5e-3], [side * (width + 0.04), -0.03, -0.08], [side * width * 0.68, -0.018, -0.035]], "pectoral-fin");
            fish.add(p);
            fins.push(p);
          }
          const eyes = [];
          for (const side of [-1, 1]) {
            const x = side * width * 0.68, y = height * 0.48, z = length * 0.66;
            ball(x, y, z, 0.018, 0.018, 0.016, kind === 1 ? 14403455 : 14012339, fish);
            const eye = ball(x + side * 0.011, y + 4e-3, z + 3e-3, 0.01, 0.011, 0.01, 1517611, fish);
            eye.name = side < 0 ? "fish-left-eye" : "fish-right-eye";
            eye.material = new THREE.MeshBasicMaterial({ color: 1517611 });
            eyes.push(eye);
            ball(x + side * 0.014, y + 8e-3, z + 8e-3, 3e-3, 3e-3, 3e-3, 15000783, fish);
          }
          const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.016, 45e-4, 5, 12), mat(kind === 0 ? 13345419 : 11512198));
          mouth.name = "fish-mouth";
          mouth.position.set(0, 5e-3, length * 0.98);
          fish.add(mouth);
          const ripple = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.112, 28), new THREE.MeshBasicMaterial({ color: 14738890, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
          ripple.rotation.x = -Math.PI / 2;
          snowTown.add(ripple);
          summer.fish.push({ root: fish, kind, eyes, tail: tail2, fins, mouth, ripple, heading: NaN, z: -15.5 + i * 2.05, phase: i * 2.399, cycle: 24 + i % 4 * 3, surfacing: false });
        }
      }
      const boat = new THREE.Group();
      boat.name = "summer-bridge-to-bridge-boat";
      boat.userData.snowDynamic = true;
      snowTown.add(boat);
      summer.boat = boat;
      sb(0, 0.09, 0, 0.65, 0.06, 1.22, 9729614, boat);
      for (const x of [-0.33, 0.33]) {
        const side = sb(x, 0.19, 0, 0.055, 0.22, 1.18, 10256473, boat);
        side.rotation.z = x < 0 ? -0.16 : 0.16;
      }
      for (const z of [-0.61, 0.61]) sb(0, 0.16, z, 0.64, 0.15, 0.055, 10717792, boat);
      for (const z of [-0.25, 0.28]) sb(0, 0.22, z, 0.61, 0.05, 0.13, 11836016, boat);
      rod([-0.17, 0.27, -0.4], [0.17, 0.27, 0.4], 0.014, 10125399, boat);
      snowBind(boat, "iceSled");
      for (let i = 0; i < 3; i++) {
        const g = new THREE.Group();
        g.userData.snowDynamic = true;
        snowTown.add(g);
        rod([0, 0, -0.15], [0, 0, 0.15], 0.012, 7441536, g);
        for (const side of [-1, 1]) for (const z of [-0.04, 0.05]) {
          const wing = new THREE.Mesh(new THREE.PlaneGeometry(0.23, 0.055), new THREE.MeshBasicMaterial({ color: 13228222, transparent: true, opacity: 0.48, side: THREE.DoubleSide, depthWrite: false }));
          wing.rotation.x = -Math.PI / 2;
          wing.position.set(side * 0.1, 0, z);
          g.add(wing);
        }
        summer.dragonflies.push(g);
      }
      const fireflyData = new Float32Array(28 * 3), fireflyPhase = new Float32Array(28);
      for (let i = 0; i < 28; i++) {
        const z = -12 + sr() * 27;
        fireflyData[i * 3] = riverCenter(z) + (i % 2 ? 1 : -1) * (1.4 + sr() * 1.5);
        fireflyData[i * 3 + 1] = 0.5 + sr() * 1.15;
        fireflyData[i * 3 + 2] = z;
        fireflyPhase[i] = sr() * Math.PI * 2;
      }
      const fireflyGeo = new THREE.BufferGeometry();
      fireflyGeo.setAttribute("position", new THREE.BufferAttribute(fireflyData, 3));
      fireflyGeo.setAttribute("phase", new THREE.BufferAttribute(fireflyPhase, 1));
      const fireflyMat = new THREE.ShaderMaterial({ uniforms: { time: summer.fireflyTime }, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, vertexShader: "attribute float phase; uniform float time; varying float glow; void main(){vec3 p=position; p.x+=sin(time*.35+phase)*.18; p.y+=sin(time*.6+phase)*.11; vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=clamp(70./-mv.z,1.5,5.); glow=pow(max(0.,sin(time*1.4+phase)),3.);}", fragmentShader: "varying float glow; void main(){float r=length(gl_PointCoord-.5); gl_FragColor=vec4(1.,.86,.42,(1.-smoothstep(.05,.5,r))*glow*.7);}" });
      summer.fireflies = new THREE.Points(fireflyGeo, fireflyMat);
      snowTown.add(summer.fireflies);
      const summerSky = document.createElement("canvas");
      summerSky.width = 1600;
      summerSky.height = 900;
      {
        const c = summerSky.getContext("2d"), g = c.createLinearGradient(0, 0, 0, 900);
        g.addColorStop(0, "#8ba7be");
        g.addColorStop(0.24, "#d3b3ad");
        g.addColorStop(0.4, "#f6c992");
        g.addColorStop(0.78, "#91a180");
        g.addColorStop(1, "#5a7b65");
        c.fillStyle = g;
        c.fillRect(0, 0, 1600, 900);
        c.filter = "blur(3px)";
        for (let layer = 0; layer < 3; layer++) {
          c.fillStyle = ["#9aa69b", "#7f9783", "#668773"][layer];
          c.beginPath();
          c.moveTo(0, 900);
          for (let i = 0; i <= 20; i++) c.lineTo(i * 80, 400 + layer * 66 - Math.abs(Math.sin(i * 0.61 + layer) * Math.cos(i * 0.27)) * 135);
          c.lineTo(1600, 900);
          c.fill();
        }
        c.filter = "none";
        c.fillStyle = "#577b60";
        c.beginPath();
        c.moveTo(0, 900);
        for (let i = 0; i <= 150; i++) {
          const x = i * 1600 / 150, y = 610 + Math.sin(i * 0.27) * 35;
          c.lineTo(x - 7, y + 26);
          c.lineTo(x, y - 30 - i % 4 * 8);
          c.lineTo(x + 7, y + 26);
        }
        c.lineTo(1600, 900);
        c.fill();
      }
      paintClouds = function(c, W, H, t) {
        c.drawImage(summerSky, 0, 0, W, H);
      };
      paintClouds(cloudCanvas.getContext("2d"), cloudCanvas.width, cloudCanvas.height, 0);
      for (const o of [...doors, staffHinge, staffDoor, chime, postbox, mailEnvelope, ...refrigeratorLeaves, ...takeoutPanes, bento, preparingNote, bunsGroup, bunLid, cookPot, cookLid, coffeeCup, coffeeSurface, coffeeStream, ...wallVentSlats, ...rearBins.map((o2) => o2.userData.hinge), bike]) o.userData.snowDynamic = true;
      mergeSnowStatic(snowStatic);
      mergeSnowStatic(snowShop);
      let shovelAt = -100, snowmanAt = -100;
      function snowAction(action, t = performance.now() / 1e3, object = null) {
        if (snowV4Action(action, t, object) || villageBuildingAction(action, t)) return;
        if (action === "bear") callBear(t);
        else if (action === "notice") openSceneLetter();
        else if (action === "icecream") {
          if (freezerCycle.phase === "closed") {
            freezerCycle.phase = "opening";
            freezerCycle.at = t;
            freezerOpen = true;
          } else if (freezerCycle.phase === "ready") {
            freezerCycle.phase = "taking";
            freezerCycle.at = t;
          }
        } else if (action === "takeIcecream" && freezerCycle.phase === "ready") {
          freezerCycle.phase = "taking";
          freezerCycle.at = t;
        } else if (action === "chimney" && (object == null ? void 0 : object.userData.chimney)) {
          object.userData.chimney.at = t;
        } else if (action === "koi") {
          koiState.next = t;
        } else if (action === "scarecrow") {
          scarecrowAt = t;
          if (t - sparrowsAt >= sparrowCycleDuration) sparrowsAt = t;
        } else if (action === "yardDog") {
          dogAt = t;
          if (dogState.phase === "inside") {
            dogState.phase = "out";
            dogState.at = t;
          } else if (dogState.phase === "wait") {
            dogState.phase = "turn";
            dogState.at = t;
          }
          if ((audioContext == null ? void 0 : audioContext.state) === "running") playSound("dog");
        } else if (action === "window" && (object == null ? void 0 : object.userData.window)) {
          object.userData.window.userData.open = !object.userData.window.userData.open;
          object.userData.window.userData.closeAt = t + 7;
        } else if (action === "snowman") snowmanAt = t;
        else if (action === "shovel") shovelAt = t;
        else if (action === "steamer") steamerOpen = !steamerOpen;
        else if (action === "bus") startBus(t);
      }
      const originalSnowAction = actOnScene;
      actOnScene = function(e) {
        const h = pickScene(e);
        if (!h) return;
        if (h.object.userData.snowAction) {
          vy = vp = 0;
          ensureAudio();
          snowAction(h.object.userData.snowAction, performance.now() / 1e3, h.object);
        } else originalSnowAction(e);
      };
      pickScene = function(e) {
        const r = { left: 0, top: 0, width: window.sceneViewport.width, height: window.sceneViewport.height };
        doorRay.setFromCamera(new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1), camera);
        const active = (o) => {
          for (let p = o; p; p = p.parent) if (!p.visible) return false;
          return true;
        };
        const candidates = [...snowTargets, ...interactionTargets, doorHit].filter(active), seen = new Set(candidates);
        scene.traverse((o) => {
          if (!o.isMesh || seen.has(o) || !active(o) || o.material.visible === false || o.material.transparent) return;
          candidates.push(o);
        });
        const h = doorRay.intersectObjects(candidates, false)[0];
        return h && (h.object.userData.action || h.object.userData.snowAction) ? h : null;
      };
      const ordinarySnowFocus = focusObject;
      focusObject = function(e) {
        if (savedFocusView) return ordinarySnowFocus(e);
        const h = pickScene(e);
        if (!(h == null ? void 0 : h.object.userData.snowAction)) return ordinarySnowFocus(e);
        savedFocusView = { target: target.clone(), distance, yaw, pitch };
        focusTween = { start: performance.now() / 1e3, from: target.clone(), to: h.point.clone(), fromDistance: distance, distance: h.object.userData.snowAction === "bear" ? 9 : 7, fromYaw: yaw, yaw, fromPitch: pitch, pitch: 0.4 };
        vy = vp = 0;
      };
      const flakeCount = 2100, flakeData = new Float32Array(flakeCount * 3), flakeSpeeds = new Float32Array(flakeCount);
      for (let i = 0; i < flakeCount; i++) {
        flakeData[i * 3] = (sr() - 0.5) * 42;
        flakeData[i * 3 + 1] = 0.4 + sr() * 14;
        flakeData[i * 3 + 2] = (sr() - 0.5) * 42;
        flakeSpeeds[i] = 0.32 + sr() * 0.38;
      }
      const snowParticleGeo = new THREE.BufferGeometry();
      snowParticleGeo.setAttribute("position", new THREE.BufferAttribute(flakeData, 3));
      const flakeMap = texture(32, 32, (c, W, H) => {
        const g = c.createRadialGradient(16, 16, 0, 16, 16, 15);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.4, "rgba(255,255,255,.85)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        c.fillStyle = g;
        c.fillRect(0, 0, W, H);
      });
      const snowfall = new THREE.Points(snowParticleGeo, new THREE.PointsMaterial({ map: flakeMap, color: 15398143, size: 0.105, transparent: true, opacity: 0.88, depthWrite: false }));
      snowfall.name = "more-visible-snowfall";
      snowTown.add(snowfall);
      const shelterBounds = [{ x: -0.25, z: -1.2, w: 8.4, d: 6.5, y: 5.6 }, ...Object.entries(villageBuildings).map(([key, b]) => {
        const q = snowLayout[key], w = (b.width + 0.6) * b.root.scale.x, d = (b.depth + 0.6) * b.root.scale.z, c = Math.abs(Math.cos(q.yaw)), s = Math.abs(Math.sin(q.yaw));
        return { x: q.x, z: q.z, w: w * c + d * s, d: d * c + w * s, y: key === "residence" ? 4.9 : key === "bakery" ? 4.8 : key === "grain" ? 4.2 : key === "repair" ? 4.3 : 3.5 };
      })];
      function animateSnowflakes(t, dt) {
        for (let i = 0; i < flakeCount; i++) {
          let k = i * 3;
          flakeData[k] += Math.sin(t * 0.25 + i) * dt * 0.07;
          flakeData[k + 1] -= dt * flakeSpeeds[i];
          let roof2 = 0.29;
          for (const b of shelterBounds) if (Math.abs(flakeData[k] - b.x) < b.w / 2 && Math.abs(flakeData[k + 2] - b.z) < b.d / 2) {
            roof2 = b.y;
            break;
          }
          if (flakeData[k + 1] < roof2) {
            flakeData[k + 1] = 13 + sr() * 2;
            flakeData[k] = (sr() - 0.5) * 42;
            flakeData[k + 2] = (sr() - 0.5) * 42;
          }
        }
        snowParticleGeo.attributes.position.needsUpdate = true;
      }
      function animateSnowTown(t, dt) {
        animateVillageBuildings(t, dt);
        animateInteractions(t, dt);
        animateCookpot(t, dt);
        animateSnowflakes(t, dt);
        animateBus(t, dt);
        animateGrandma(t, dt);
        animateGrandpa(t, dt);
        keepHomeDoorClear();
        animateBear(t, dt);
        animateYardAndField(t, dt);
        animateSnowAudio(t);
        animateV3Details(t, dt);
        animateV4(t, dt);
        animateSnowTraces(t);
        animateSoftSnowLights();
        doorAmount = THREE.MathUtils.damp(doorAmount, doorTarget, 6, dt);
        doors.forEach((o, i) => {
          o.position.x = o.userData.closedX;
          o.rotation.y = (i === 0 ? -1 : 1) * doorAmount * 1.38;
        });
        animateV3Freezer(t, dt);
        steamerAmount = THREE.MathUtils.damp(steamerAmount, steamerOpen ? 1 : 0, 4, dt);
        steamerLid.rotation.x = -steamerAmount * 1.25;
        const sa = t - shovelAt, sweep = sa >= 0 && sa < 3 ? Math.sin(sa / 3 * Math.PI) : 0;
        shovel.rotation.z = -0.24 + sweep * 0.6;
        shovel.position.z = 2.7 + sweep * 0.55;
        const ma = t - snowmanAt;
        snowHat.rotation.z = snowmanAt < 0 ? 0.16 : 0.16 * (1 - THREE.MathUtils.smoothstep(ma, 0, 0.6));
        houseWindows.forEach((o) => {
          if (t > o.userData.closeAt) o.userData.open = false;
          o.userData.amount = THREE.MathUtils.damp(o.userData.amount, o.userData.open ? 1 : 0, 5, dt);
          for (const panel of o.children) {
            const u = o.userData.amount, w = o.userData.width;
            panel.scale.x = 1 - u * 0.8;
            panel.position.x = panel.userData.side * w * (0.25 + u * 0.2);
          }
        });
        chimneyPuffs.forEach((o, i) => {
          const a = (t * 0.075 + o.userData.phase) % 1;
          o.position.copy(o.userData.origin);
          o.position.x += a * 0.65 + Math.sin(t * 0.1 + i) * 0.05;
          o.position.y += a * 1.7;
          o.scale.setScalar(0.22 + a * 0.85);
          o.material.opacity = Math.sin(a * Math.PI) * 0.17;
        });
        const fogAge = t - fogSmileAt, progress = THREE.MathUtils.clamp(fogAge / 1.65, 0, 1), alpha = fogAge >= 0 ? 1 - THREE.MathUtils.smoothstep(fogAge, 3.3, 8) : 0;
        if (t - lastFogPaint > 0.05 && (Math.abs(alpha - fogErasure) > 5e-3 || Math.abs(progress - fogDrawProgress) > 5e-3)) {
          paintWindowFog(alpha, progress);
          lastFogPaint = t;
        }
        bunsGroup.visible = bunLid.visible = false;
        chime.visible = postbox.visible = mailEnvelope.visible = false;
        serviceLight.intensity = staffAmount * 1.6;
        if (t - lastCloudPaint > 0.2) {
          paintClouds(cloudCanvas.getContext("2d"), cloudCanvas.width, cloudCanvas.height, t);
          lastCloudPaint = t;
        }
      }
      const oldSnowStamp = drawScenePostmark;
      drawScenePostmark = function(c, x, y, mode) {
        if (mode !== "summer") return oldSnowStamp(c, x, y, mode);
        c.save();
        c.translate(x, y);
        c.strokeStyle = "#8e9da4";
        c.globalAlpha = 0.8;
        c.lineWidth = 1.3;
        for (const r of [24, 28]) {
          c.beginPath();
          c.arc(0, 0, r, 0, Math.PI * 2);
          c.stroke();
        }
        for (let i = 0; i < 6; i++) {
          c.save();
          c.rotate(i * Math.PI / 3);
          c.beginPath();
          c.moveTo(0, 0);
          c.lineTo(0, -16);
          c.moveTo(0, -9);
          c.lineTo(-4, -13);
          c.moveTo(0, -9);
          c.lineTo(4, -13);
          c.stroke();
          c.restore();
        }
        c.restore();
      };
      letterDialog.querySelector(".letter-eyebrow").textContent = "\u96EA\u4E61\u516C\u544A\u680F \xB7 \u51AC\u591C\u6765\u4FE1";
      letterDialog.querySelector("h1").textContent = "\u96EA\u8FD8\u5728\u4E0B\uFF0C\u5E97\u8FD8\u4EAE\u7740";
      letterDialog.querySelector(".letter-intro").textContent = "\u5C71\u6797\u56F4\u7740\u5C0F\u9547\uFF0C\u8FDB\u5C4B\u559D\u7897\u70ED\u8C46\u6D46\u3002";
      letterDialog.querySelector(".letter-steps").innerHTML = "<li><strong>\u88AB\u5C71\u6797\u56F4\u4F4F\u7684\u51AC\u591C</strong><p>\u7EA2\u677E\u4E0E\u51B7\u6749\u5728\u8FDC\u5C71\u524D\u53E0\u8D77\u6DF1\u6D45\u7684\u8F6E\u5ED3\uFF0C\u96EA\u82B1\u6162\u6162\u843D\u4E0B\u3002\u516C\u8DEF\u8FB9\u7684\u706F\u7167\u7740\u79EF\u96EA\uFF0C\u51B0\u5C01\u7684\u5C0F\u6CB3\u4E0A\uFF0C\u4E00\u5EA7\u8F66\u6865\u548C\u4E24\u5EA7\u5C0F\u6865\u628A\u5C0F\u9547\u8FDE\u5728\u4E00\u8D77\u3002</p></li><li><strong>\u70ED\u4E4E\u7684\u65E9\u9910\u4E0E\u5BB6\u5E38\u5473</strong><p>\u5C0F\u4ED3\u4E70\u91CC\u6709\u8C46\u6D46\u3001\u5364\u9E21\u86CB\u3001\u5305\u5B50\u3001\u6CB9\u6761\u548C\u70ED\u7CA5\uFF0C\u51BB\u68A8\u7B50\u65C1\u6446\u7740\u51B0\u68CD\u67DC\u3002\u8FC7\u4E86\u6728\u6865\uFF0C\u719F\u98DF\u5E97\u91CC\u6302\u7740\u9999\u80A0\uFF0C\u95E8\u524D\u7684\u9178\u83DC\u7F38\u7559\u4F4F\u4E86\u51AC\u5929\u7684\u5473\u9053\u3002</p></li><li><strong>\u6709\u4EBA\u6765\uFF0C\u6709\u4EBA\u56DE\u5BB6</strong><p>\u5927\u5988\u63D0\u7740\u888B\u5B50\u53BB\u4E70\u4E1C\u897F\uFF0C\u5927\u7237\u4ECE\u73ED\u8F66\u4E0B\u6765\uFF0C\u5230\u7CAE\u4ED3\u529E\u70B9\u4E8B\u3002\u8FDB\u5C4B\u540E\u5148\u5173\u4E0A\u95E8\uFF0C\u6696\u548C\u4E00\u4F1A\u513F\u518D\u51FA\u53D1\u3002\u7095\u623F\u6A90\u4E0B\u6302\u7740\u8FA3\u6912\u548C\u5927\u849C\uFF0C\u9662\u91CC\u7684\u571F\u72D7\u770B\u7740\u96EA\u4EBA\uFF1B\u519C\u7530\u91CC\u7684\u9EBB\u96C0\u88AB\u7A3B\u8349\u4EBA\u60CA\u8D77\uFF0C\u8F6C\u4E00\u5708\u8FD8\u4F1A\u56DE\u6765\u3002</p></li><li><strong>\u6797\u8FB9\u4E0E\u8FDC\u65B9</strong><p>\u6728\u6805\u680F\u540E\u7684\u718A\u6D1E\u7559\u7740\u638C\u5370\uFF0C\u68D5\u718A\u6162\u6162\u8D70\u51FA\u6765\uFF0C\u95FB\u4E00\u95FB\u96EA\u91CC\u7684\u6C14\u606F\uFF0C\u518D\u8F6C\u8EAB\u56DE\u6D1E\u3002\u98CE\u58F0\u3001\u7089\u706B\u4E0E\u6811\u53F6\u7684\u8F7B\u54CD\u91CC\uFF0C\u8FD8\u6709\u4E00\u6BB5\u5F88\u8F7B\u7684\u66F2\u5B50\u3002</p></li><li><strong>\u7559\u7ED9\u5BB6\u4E61\u7684\u4E00\u53E5\u8BDD</strong><p>\u5982\u679C\u4ECA\u665A\u4E5F\u4E0B\u96EA\u4E86\uFF0C\u613F\u4F60\u56DE\u5BB6\u7684\u90A3\u6761\u8DEF\u4E0A\uFF0C\u4E00\u76F4\u6709\u706F\u3002</p></li>";
      letterDialog.querySelector(".letter-signoff small").textContent = "2026\xB710 \xB7 \u96EA\u4E61\u5C0F\u4ED3\u4E70";
      function resetSnowScene() {
        clearSnowTraces();
        resetVillageBuildings();
        clearTimeout(singleTapTimer);
        pointers.clear();
        gesture = tapStart = focusTween = savedFocusView = null;
        target.set(0, 1.2, 0);
        yaw = 0.34;
        pitch = 0.59;
        distance = 67;
        vy = vp = 0;
        doorTarget = doorAmount = staffTarget = staffAmount = 0;
        coffeeFull = false;
        coffeeFill = coffeeUntil = 0;
        coffeeStarted = -100;
        bunLidTarget = bunLidAmount = cookLidTarget = cookLidAmount = 0;
        letterTarget = letterAmount = 0;
        letterDialog.close();
        closePostcardPreview();
        takeoutTarget = takeoutAmount = 0;
        windowPending = null;
        takeoutVariant = "bento";
        freezerOpen = steamerOpen = false;
        freezerAmount = steamerAmount = 0;
        Object.assign(freezerCycle, { phase: "closed", at: 0, lift: 0 });
        freezerLid.rotation.x = 0;
        popsicle.visible = false;
        dogState.phase = "inside";
        animateV3Dog(performance.now() / 1e3, 0);
        resetV4();
        snowChimneys.forEach((q) => q.at = -100);
        koiState.phase = "hidden";
        koiState.next = performance.now() / 1e3 + 14;
        snowmanAt = shovelAt = fogSmileAt = dogAt = sparrowsAt = scarecrowAt = -100;
        scarecrow.rotation.set(0, 0, 0);
        snowHat.rotation.z = 0.16;
        bearState.phase = "hidden";
        setAlpha(bear, 0);
        for (const p of [grandma, grandpa]) {
          p.stage = "hidden";
          p.route = null;
          p.inside = false;
          setAlpha(p.root, 0);
        }
        const t = performance.now() / 1e3;
        grandmaState.next = t + 12;
        grandpaState.hasRidden = false;
        Object.assign(busState, { phase: "hidden", next: t + 28, door: 0, boarding: false, departRequested: false });
        setAlpha(bus, 0);
        houseWindows.forEach((o) => o.userData.open = false);
        refrigeratorLeaves.forEach((o) => {
          o.userData.open = false;
          o.userData.amount = 0;
        });
        rearBins.forEach((o) => {
          o.userData.open = false;
          o.userData.amount = 0;
        });
        wallVentOpen = false;
        setClockMode(false);
      }
      const snowAPI = { leafTrees: villageLeafTrees, wireSnow: winterWireSnow, shopSign: sign, shopSignBack: snowSignBack, signReliefs, removedWinterStripes, lanterns, lanternLights, fieldBench, fieldBench2, parkBench, parkBench2, pullUpBar, get flockAt() {
        return sparrowsAt;
      }, get scarecrowAt() {
        return scarecrowAt;
      }, riverCenter, riverEdges, iceHoleOutline, fruitCrates, repairRoll, repairSign, well, recreation, swingPivot, seesawPivot, twistDisc, iceSled, iceSledState, v4BirdCurve, chimneys: snowChimneys, powerPoles, kennel, dogState, freezerCycle, koi, koiState, iceHole: iceHoleWater, update: animateSnowTown, buildings: villageBuildings, mechanisms: villageMechanisms, town: snowTown, shop: snowShop, legacy: snowLegacy, ground: snowGround, cave, bear, bearLegs, bearState, icicles, snowfall, snowman, shovel, steamer: villageSteamer, houseWindows, bus, busState, breadPerson, busPerson, grandma, grandpa, freezer: iceFreezer, freezerLid, popsicle, eggPot, breakfast, notice, field, scarecrow, sparrows, dog: dogRoot, bridges, river: riverIce, roads, roadSegments, roadNodes, roadLinks, roadMesh, roadsideBanks, trees: townTrees, lamps: lampObjects, audio: snowAudio, walkHeight, onRoad, findRoute, targets: snowTargets, action: snowAction, reset: resetSnowScene, get bearActive() {
        return bearState.phase !== "hidden";
      }, get breadActive() {
        return grandma.stage !== "hidden";
      }, get busActive() {
        return busState.phase !== "hidden";
      }, get steamerOpen() {
        return steamerOpen;
      }, get freezerOpen() {
        return freezerOpen;
      }, startBread() {
        grandmaState.next = performance.now() / 1e3;
      }, startBus() {
        startBus(performance.now() / 1e3);
      } };
      Object.assign(snowAPI, { breakfastBanner, breakfastSupports, shelfCategories, lanternRibs, snowTraces, softSnowLights });
      const snowStyle = document.createElement("style");
      snowStyle.textContent = ".scene-reset{position:fixed;left:25px;bottom:23px;z-index:4;width:45px;height:45px;padding:11px;border-radius:50%;border:1px solid rgba(196,213,210,0.2510);background:rgba(39,61,83,0.7020);color:#e7e0ce;display:grid;align-items:center;justify-items:center;cursor:pointer;backdrop-filter:blur(12px)}.scene-reset svg{width:22px;height:22px}.scene-clock{background:rgba(39,61,83,0.5412);color:#eee3cc}.photo-button{background:rgba(39,61,83,0.7020);color:#eee3cc}@media(max-width:600px){.scene-reset{left:15px;bottom:16px}}";
      window.streetAppendStyle(snowStyle, "summer");
      const snowResetButton = document.createElement("button");
      snowResetButton.className = "scene-reset";
      snowResetButton.type = "button";
      snowResetButton.title = "\u91CD\u7F6E\u96EA\u4E61";
      snowResetButton.setAttribute("aria-label", "\u91CD\u7F6E\u96EA\u4E61");
      snowResetButton.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 10a8 8 0 1 1 1.5 7M4 4v6h6"/></svg>';
      sceneHost.appendChild(snowResetButton);
      snowResetButton.addEventListener("click", resetSnowScene);
      snowfall.visible = false;
      animateSnowflakes = function() {
      };
      animateSnowTraces = function() {
      };
      snowTraces.clear();
      snowTraces.footprints.mesh.visible = snowTraces.tyres.mesh.visible = false;
      for (const q of summerWinterParts) q.visible = false;
      for (const q of chimneyPuffs) q.material.opacity = 0;
      dogRoot.scale.set(1, 1, 1);
      summer.dogHead = yardDogHead;
      summer.dogTail = yardDogTail;
      const summerBaseDog = animateV3Dog;
      animateV3Dog = function(t, dt) {
        summerBaseDog(t, dt);
        const a = t - summer.fanAt, u = a >= 0 && a < 4 ? Math.sin(a / 4 * Math.PI) : 0;
        dogRoot.position.set(kennel.position.x + 1.7, 0.32, kennel.position.z);
        dogRoot.rotation.y = Math.PI / 2;
        yardDogHead.rotation.y = Math.sin(t * 2.2) * 0.32 * u;
        yardDogHead.rotation.z = Math.sin(t * 1.7) * 0.12 * u;
        yardDogTail.rotation.y = Math.sin(t * (3 + u * 4)) * (0.12 + u * 0.42);
        dogLegs.forEach((leg) => leg.rotation.x = 0);
      };
      function animateSummerSwallows(t, dt) {
        for (const s of summer.swallowFlights) {
          const age = t - s.at, flight = s.active && age >= 0, u = flight ? THREE.MathUtils.clamp((age - 0.35) / 7, 0, 1) : 0, a = u * Math.PI * 2, lift = Math.sin(u * Math.PI) * 1.5 + (1 - Math.cos(a)) * 0.2, envelope = flight ? THREE.MathUtils.smoothstep(lift, 0.04, 0.25) * (1 - THREE.MathUtils.smoothstep(age, 7.1, 8.05)) : 0;
          if (flight) {
            s.root.position.set(s.home.x + s.side * 1.2 * (1 - Math.cos(a)), s.home.y + lift, s.home.z - 0.9 * Math.sin(a));
            let desired;
            if (age < 0.35) desired = Math.PI * THREE.MathUtils.smoothstep(age, 0, 0.35);
            else if (age > 7.35) desired = 0;
            else {
              desired = Math.atan2(s.side * 1.2 * Math.sin(a), -0.9 * Math.cos(a));
              s.landingYaw = desired;
            }
            const delta = Math.atan2(Math.sin(desired - s.root.rotation.y), Math.cos(desired - s.root.rotation.y));
            if (age > 7.35) {
              if (!Number.isFinite(s.settleYaw)) s.settleYaw = s.root.rotation.y;
              const end = Math.atan2(Math.sin(-s.settleYaw), Math.cos(-s.settleYaw));
              s.root.rotation.y = s.settleYaw + end * THREE.MathUtils.smoothstep(age, 7.35, 8.05);
            } else s.root.rotation.y += delta * (1 - Math.exp(-Math.max(0, dt) * 10));
            s.root.rotation.z = Math.sin(a) * 0.1 * envelope;
            if (age >= 8.05) {
              s.active = false;
              s.root.position.copy(s.home);
              s.root.rotation.set(0, 0, 0);
            }
          } else {
            s.root.position.copy(s.home);
            s.root.rotation.set(0, 0, 0);
          }
          for (const w of s.wings) {
            w.pivot.rotation.z = w.side * Math.sin(t * 19) * 0.85 * envelope;
            w.mesh.position.x = w.side * (0.02 + 0.09 * envelope);
            w.mesh.scale.set(0.023 + 0.1 * envelope, 0.045 - 0.03 * envelope, 0.093 - 0.02 * envelope);
            w.mesh.rotation.z = -w.side * 0.22 * (1 - envelope);
          }
        }
      }
      const summerBaseAnimate = animateSnowTown;
      animateSnowTown = function(t, dt) {
        summerBaseAnimate(t, dt);
        snowfall.visible = false;
        windowFog.visible = fogHit.visible = false;
        snowman.visible = shovel.visible = iceSled.visible = iceHoleWater.visible = v3IceRim.visible = false;
        for (const p of [grandma, grandpa]) p.breath.forEach((o) => o.visible = false);
        summerWaterMap.offset.y = -t * 0.01;
        summerCrops.rotation.z = Math.sin(t * 0.7) * 5e-3;
        summer.gardenLeaves.forEach((leaf, i) => leaf.rotation.z = -0.4 + Math.sin(t * 0.8 + i) * 0.06);
        summer.fanHead.rotation.y = Math.sin(t * 0.45) * 0.48;
        summer.fanRotor.rotation.z = summer.fanOn ? t * 15 : summer.fanRotor.rotation.z;
        for (const [i, f] of summer.fans.entries()) if (!f.userData.tableFan) f.rotation.y = Math.sin(t * 2 + i) * 0.28;
        for (const [i, g] of summer.dragonflies.entries()) {
          g.position.set(riverCenter(5 + i * 5) + Math.sin(t * 0.43 + i) * 1.2, 1.15 + Math.sin(t * 0.72 + i) * 0.18, 5 + i * 5 + Math.cos(t * 0.36 + i) * 0.6);
        }
        summer.fireflyTime.value = t;
        animateSummerSwallows(t, dt);
        for (const q of summer.windowLeaves) {
          q.hinge.rotation.y = q.side * q.curtains.userData.amount * 1.18;
          q.curtains.visible = false;
        }
        boat.position.set(riverCenter(iceSledState.z), -0.11 + Math.sin(t * 1.2) * 8e-3, iceSledState.z);
        boat.rotation.y = iceSledState.yaw;
        boat.rotation.z = Math.sin(t * 0.8) * 0.018;
        for (const [i, pad] of cottonLeaves.entries()) pad.rotation.z = Math.sin(t * 1.1 + i) * 0.012;
        chimneyPuffs.forEach((p) => p.material.opacity = 0);
        koi.visible = false;
        v3Ripples.forEach((r) => r.visible = false);
        summer.potAmount = THREE.MathUtils.damp(summer.potAmount, summer.potOpen ? 1 : 0, 4, dt);
        summer.potLid.rotation.x = -summer.potAmount * 1.25;
        for (const f of summer.fish) {
          const phase = t * 0.19 + f.phase, z = f.z + Math.sin(phase) * 0.85, x = riverCenter(z) + Math.sin(phase * 0.73 + f.phase) * 0.48;
          const cycle = ((t + f.phase * 3) % f.cycle + f.cycle) % f.cycle, breath = THREE.MathUtils.smoothstep(cycle, 0, 1.6) * (1 - THREE.MathUtils.smoothstep(cycle, 3.2, 5.2));
          f.surfacing = breath > 0.5;
          const dz = Math.cos(phase) * 0.85, riverSlope = (riverCenter(z + 0.01) - riverCenter(z - 0.01)) / 0.02, dx = riverSlope * dz + Math.cos(phase * 0.73 + f.phase) * 0.48 * 0.73, desired = Math.atan2(dx, dz);
          if (!Number.isFinite(f.heading)) f.heading = desired;
          else f.heading += Math.atan2(Math.sin(desired - f.heading), Math.cos(desired - f.heading)) * (1 - Math.exp(-Math.max(0, dt) * 5));
          f.root.position.set(x, -0.29 + breath * 0.15, z);
          f.root.rotation.set(-breath * 0.14, f.heading, 0, "YXZ");
          f.mouth.scale.setScalar(1 + breath * (0.15 + Math.sin(t * 4) * 0.08));
          f.tail.rotation.y = Math.sin(t * 5 + f.phase) * 0.26;
          f.fins.forEach((fin, i) => fin.rotation.z = Math.sin(t * 3 + f.phase) * (i ? 1 : -1) * 0.08);
          f.ripple.position.set(x + Math.sin(f.heading) * 0.14, -0.1, z + Math.cos(f.heading) * 0.14);
          f.ripple.visible = breath > 0.35;
          const u = cycle % 1.6 / 1.6;
          f.ripple.scale.setScalar(0.6 + u * 2.5);
          f.ripple.material.opacity = (1 - u) * breath * 0.24;
        }
      };
      const summerBaseAction = snowAction;
      snowAction = function(action, t = performance.now() / 1e3, object = null) {
        if (action === "swallow") {
          const s = object == null ? void 0 : object.userData.swallow;
          if (s && !s.active) {
            s.active = true;
            s.at = t;
            s.landingYaw = 0;
            s.settleYaw = NaN;
            if ((audioContext == null ? void 0 : audioContext.state) === "running") {
              const at = audioContext.currentTime;
              summerSound(2400, at, 0.08, 12e-4);
              summerSound(3100, at + 0.11, 0.06, 9e-4);
            }
          }
          return;
        }
        if (action === "summerPot") {
          summer.potOpen = !summer.potOpen;
          return;
        }
        if (action === "summerFan") {
          summer.fanOn = !summer.fanOn;
          return;
        }
        if (action === "yardDog") {
          summer.fanAt = t;
          return;
        }
        if (action === "window" && (object == null ? void 0 : object.userData.window)) {
          const c = object.userData.window;
          c.userData.open = !c.userData.open;
          c.userData.closeAt = Infinity;
          return;
        }
        summerBaseAction(action, t, object);
      };
      initSnowAudio = function() {
        if (snowAudio.ready || !audioContext || !audioMaster) return;
        snowAudio.ready = true;
        function bed(freq, gain) {
          const s = audioContext.createBufferSource(), f = audioContext.createBiquadFilter(), g = audioContext.createGain();
          s.buffer = ambientNoise;
          s.loop = true;
          f.type = "bandpass";
          f.frequency.value = freq;
          f.Q.value = 1.2;
          g.gain.value = gain;
          s.connect(f);
          f.connect(g);
          g.connect(audioMaster);
          s.start();
          return g;
        }
        snowAudio.wind = bed(360, 3e-3);
        snowAudio.leaves = bed(1700, 16e-4);
        summer.insects = bed(4200, 6e-4);
        snowAudio.nextNote = audioContext.currentTime + 2;
        summer.nextFrog = audioContext.currentTime + 5;
        summer.nextDog = audioContext.currentTime + 32;
      };
      function summerSound(f, at, duration, volume, type = "sine") {
        const o = audioContext.createOscillator(), g = audioContext.createGain();
        o.type = type;
        o.frequency.setValueAtTime(f, at);
        o.frequency.exponentialRampToValueAtTime(f * 0.72, at + duration);
        g.gain.setValueAtTime(1e-4, at);
        g.gain.exponentialRampToValueAtTime(volume, at + 0.025);
        g.gain.exponentialRampToValueAtTime(1e-4, at + duration);
        o.connect(g);
        g.connect(audioMaster);
        o.start(at);
        o.stop(at + duration + 0.02);
        o.onended = () => {
          o.disconnect();
          g.disconnect();
        };
      }
      animateSnowAudio = function(t) {
        var _a2;
        if (!audioContext || audioContext.state !== "running") return;
        initSnowAudio();
        const at = audioContext.currentTime;
        for (const g of [rainBedGain, rainSwellGain, cityBedGain, carAudioGain, musicGain]) g == null ? void 0 : g.gain.setTargetAtTime(0, at, 0.2);
        if (at > snowAudio.nextNote) {
          softSnowNote([196, 246.94, 293.66, 329.63, 246.94, 220][snowAudio.note++ % 6], at + 0.02, 4e-3);
          snowAudio.nextNote = at + 5.4;
        }
        if (at > summer.nextFrog) {
          summerSound(210, at, 0.24, 25e-4, "triangle");
          summerSound(195, at + 0.35, 0.27, 18e-4, "triangle");
          summer.nextFrog = at + 8 + (Math.sin(t) * 0.5 + 0.5) * 7;
          summer.audioEvents.frogs++;
        }
        if (at > summer.nextDog) {
          summerSound(180, at, 0.13, 15e-4, "triangle");
          summerSound(150, at + 0.21, 0.16, 12e-4, "triangle");
          summer.nextDog = at + 45;
          summer.audioEvents.distantDog++;
        }
        (_a2 = summer.insects) == null ? void 0 : _a2.gain.setTargetAtTime(4e-4 + Math.max(0, Math.sin(t * 0.27)) * 5e-4, at, 0.5);
        summer.audioEvents.insects++;
      };
      snowFootstep = function(volume = 6e-3) {
        if ((audioContext == null ? void 0 : audioContext.state) === "running") {
          noiseTick(audioContext.currentTime + 0.01, 0.08, volume * 0.3, 700);
          snowAudio.footsteps++;
        }
      };
      letterDialog.querySelector(".letter-eyebrow").textContent = "\u5C71\u6751\u7EB3\u51C9\u591C \xB7 \u590F\u591C\u6765\u4FE1";
      letterDialog.querySelector("h1").textContent = "\u5929\u8FD8\u6CA1\u9ED1\uFF0C\u5E97\u91CC\u7684\u706F\u5148\u4EAE\u4E86";
      letterDialog.querySelector(".letter-intro").textContent = "\u5207\u4E00\u5757\u897F\u74DC\uFF0C\u542C\u6865\u4E0B\u6D41\u6C34\u548C\u8FDC\u5904\u86D9\u9E23\u3002";
      letterDialog.querySelector(".letter-steps").innerHTML = "<li><strong>\u8FD8\u662F\u8BB0\u5FC6\u91CC\u7684\u90A3\u95F4\u5C0F\u4ED3\u4E70</strong><p>\u7EA2\u706F\u7B3C\u7559\u5728\u5C4B\u6A90\u4E0B\uFF0C\u6625\u8054\u88AB\u590F\u5929\u6652\u5F97\u6D45\u4E86\u4E00\u70B9\u3002\u7EB1\u95E8\u5E18\u8F7B\u8F7B\u6446\uFF0C\u65E7\u7535\u98CE\u6247\u6162\u6162\u8F6C\u5934\uFF0C\u51B0\u68CD\u67DC\u91CC\u85CF\u7740\u7AE5\u5E74\u7684\u51C9\u3002\u684C\u4E0A\u7684\u642A\u74F7\u7F38\u65C1\uFF0C\u897F\u74DC\u5207\u597D\u4E86\u3002</p></li><li><strong>\u9662\u91CC\u957F\u7740\u8C46\u89D2\u548C\u9EC4\u74DC</strong><p>\u8C46\u89D2\u85E4\u6500\u8FC7\u7AF9\u67B6\uFF0C\u5C0F\u8471\u6392\u6210\u51E0\u884C\uFF0C\u571F\u72D7\u8DB4\u5728\u9634\u51C9\u91CC\u3002\u70B9\u4E00\u4E0B\uFF0C\u5B83\u4FBF\u8F7B\u8F7B\u8F6C\u5934\u3001\u6447\u6447\u5C3E\u5DF4\u3002\u7530\u91CC\u7684\u7389\u7C73\u548C\u8C46\u82D7\u968F\u98CE\u8F7B\u8F7B\u6643\uFF0C\u9EBB\u96C0\u8EB2\u5728\u7530\u5784\u95F4\u3002</p></li><li><strong>\u6D41\u6C34\u4ECE\u4E09\u5EA7\u6865\u4E0B\u7ECF\u8FC7</strong><p>\u51B0\u6CB3\u53D8\u6210\u9752\u7EFF\u7684\u5C0F\u6CB3\uFF0C\u6D45\u5904\u9732\u51FA\u5375\u77F3\uFF0C\u4E24\u5CB8\u6709\u6C34\u8349\u3002\u70B9\u4E00\u4E0B\u6C34\u9762\uFF0C\u5C0F\u6728\u8239\u4ECE\u6728\u6865\u4E0B\u9A76\u5F80\u77F3\u6865\uFF0C\u518D\u70B9\u5C31\u8FD4\u56DE\uFF1B\u9526\u9CA4\u5076\u5C14\u6E38\u5230\u6C34\u9762\uFF0C\u8424\u706B\u866B\u5728\u6CB3\u5CB8\u5FFD\u660E\u5FFD\u6697\u3002</p></li><li><strong>\u6709\u4EBA\u4E58\u51C9\uFF0C\u6709\u4EBA\u56DE\u5BB6</strong><p>\u5927\u5988\u63D0\u7740\u7BEE\u5B50\uFF0C\u4ECE\u719F\u98DF\u5E97\u4E70\u5230\u4FBF\u5229\u5E97\uFF1B\u5927\u7237\u5750\u73ED\u8F66\u6765\u529E\u4E8B\uFF0C\u957F\u6905\u4E0A\u7684\u8001\u4EBA\u6447\u7740\u84B2\u6247\u3002\u866B\u9E23\u3001\u86D9\u58F0\u548C\u5FAE\u98CE\uFF0C\u966A\u5C0F\u9547\u6162\u6162\u5165\u591C\u3002</p></li><li><strong>\u7559\u7ED9\u5BB6\u4E61\u7684\u4E00\u53E5\u8BDD</strong><p>\u5982\u679C\u4F60\u4E5F\u8BB0\u5F97\u8FD9\u6837\u7684\u590F\u5929\uFF0C\u5C31\u628A\u4E00\u53E5\u8BDD\u7559\u5728\u8FD9\u91CC\u5427\u3002</p></li>";
      letterDialog.querySelector(".letter-signoff small").textContent = "2026 \xB7 \u661F\u6708\u8857\u89D2 \xB7 \u5C71\u6751\u7EB3\u51C9\u591C";
      drawScenePostmark = function(c, x, y) {
        c.save();
        c.translate(x, y);
        c.strokeStyle = "#7b9880";
        c.fillStyle = "#7b9880";
        c.lineWidth = 1.2;
        for (const r of [24, 28]) {
          c.beginPath();
          c.arc(0, 0, r, 0, Math.PI * 2);
          c.stroke();
        }
        c.font = '20px "Microsoft YaHei",sans-serif';
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText("\u590F", 0, 0);
        c.restore();
      };
      Object.assign(snowAPI, { season: "summer", summer, water: riverIce, boat, summerAction: snowAction, update: animateSnowTown });
      const summerBaseReset = resetSnowScene;
      resetSnowScene = function() {
        summerBaseReset();
        summer.fanAt = -100;
        summer.fanOn = true;
        summer.potOpen = false;
        summer.potAmount = 0;
        summer.potLid.rotation.x = 0;
        for (const s of summer.swallowFlights) {
          s.active = false;
          s.at = -100;
          s.landingYaw = 0;
          s.settleYaw = NaN;
        }
        animateSummerSwallows(performance.now() / 1e3, 0);
        for (const c of houseWindows) {
          c.userData.open = true;
          c.userData.closeAt = Infinity;
        }
      };
      snowAPI.reset = resetSnowScene;
      animateSnowTown(performance.now() / 1e3, 0);
      target.set(0, 1.2, 0);
      yaw = 0.34;
      pitch = 0.59;
      distance = 67;
      let prev = performance.now();
      function animate(now) {
        window.streetRAF(animate);
        if (document.hidden || !window.landscapeStarted || window.streetRenderStopped) return;
        if (now - prev < 33) return;
        if (window.streetCurrentScene !== "summer") return;
        const t = now / 1e3, dt = Math.min(Math.max(0, (now - prev) / 1e3), 0.1);
        prev = now;
        updateFocus(t);
        if (!pointers.size) {
          yaw += vy;
          pitch = THREE.MathUtils.clamp(pitch + vp, 0.16, 1.3);
          vy *= 0.94;
          vp *= 0.94;
        }
        const responsive = Math.max(1, 1.28 / (window.sceneViewport.width / window.sceneViewport.height));
        camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * distance * responsive, target.y + Math.sin(pitch) * distance * responsive, target.z + Math.cos(yaw) * Math.cos(pitch) * distance * responsive);
        camera.lookAt(target);
        animateSnowTown(t, dt);
        renderer.render(scene, camera);
        window.streetFrameBudget(now, dt, renderer, rainGeo);
      }
      window.streetRAF(animate);
      window.__scene = { setWeather, unlockAudio: ensureAudio, restoreView(view) {
        yaw = view.yaw;
        pitch = view.pitch;
        distance = view.distance;
        target.fromArray(view.target);
        vy = vp = 0;
        focusTween = null;
        savedFocusView = null;
        const r = Math.max(1, 1.28 / (window.sceneViewport.width / window.sceneViewport.height));
        camera.position.set(target.x + Math.sin(yaw) * Math.cos(pitch) * distance * r, target.y + Math.sin(pitch) * distance * r, target.z + Math.cos(yaw) * Math.cos(pitch) * distance * r);
        camera.lookAt(target);
        renderer.render(scene, camera);
      }, snow: snowAPI, summer: snowAPI, reset: resetSnowScene, resetButton: snowResetButton, get resetting() {
        return false;
      }, stopInteractionAudio() {
        if (typeof stopCyberDroneSound === "function") stopCyberDroneSound();
      }, stories: { fog: windowFog, fogHit, get erasure() {
        return fogErasure;
      }, get drawProgress() {
        return fogDrawProgress;
      }, drips: awningBurst, roofBead, sunsetGlass, beam: sunbeam, glints: bottleGlints, feather: pigeonFeather, fixtures: duskFixtures, stampKinds: postcardStampKinds, drawStamp: drawScenePostmark, get nextFeatherAt() {
        return nextFeatherAt;
      }, get featherAt() {
        return featherAt;
      } }, leftWallSections, wallVentSlats, get wallVentOpen() {
        return wallVentOpen;
      }, get wallVentAmount() {
        return wallVentAmount;
      }, wallVentExterior, wallVentInterior, farRoadCurb, edgeDecorations, refrigeratorLeaves, refrigeratorDoors, sideSign, setClockMode, get clockIs12() {
        return clockIs12;
      }, umbrellas, pinwheelStand, pinwheels, roofExhaust, get smokeBurstAt() {
        return smokeBurstAt;
      }, airLeaves, cloudCanvas, get viewState() {
        return { yaw, pitch, distance, target: target.toArray() };
      }, get hasSavedFocus() {
        return savedFocusView !== null;
      }, roofDrain, roofMist, pickupSign, requestPickup, get windowPending() {
        return windowPending;
      }, get noteShownAt() {
        return noteShownAt;
      }, get cookLidAmount() {
        return cookLidAmount;
      }, shellSeals, frontAwning, rightRoofHeader, cookStove, cookPot, cookLid, cookFood, cookSteam, pickupHit, get cookLidTarget() {
        return cookLidTarget;
      }, get weatherMode() {
        return weatherMode;
      }, get isDusk() {
        return isDusk;
      }, dog, dogHead, preparingNote, clock, personalMessage, createPostcard, previewPostcard, closePostcardPreview, postcardPreview, postcardImage, postcardDownload, photoButton, get takeoutVariant() {
        return takeoutVariant;
      }, get focused() {
        return focusTween !== null;
      }, get viewDistance() {
        return distance;
      }, get frontCuriosity() {
        return frontCuriosity;
      }, get dogCuriosity() {
        return dogCuriosity;
      }, umbrellaRack, sunnyFlowerRack, vendingCans, vendingPalettes, crossingNamePlate, weatherLabels, culdesacSign, welcomeSign, roadCenterLine, get music() {
        return { notes: musicNoteCount, gain: musicGain == null ? void 0 : musicGain.gain.value, step: musicStep };
      }, get trafficAudio() {
        return { passes: carPassCount, gain: carAudioGain == null ? void 0 : carAudioGain.gain.value, cityGain: cityBedGain == null ? void 0 : cityBedGain.gain.value, active: activePasses.size };
      }, get isSunny() {
        return isSunny;
      }, get weatherBlend() {
        return weatherBlend;
      }, weatherButtons, pigeon, pigeonWings, chimeRain, wetGlows, puddles, rain, drips, trails, hemisphere, moon, shopLights, get pigeonReact() {
        return pigeonReact;
      }, mailEnvelope, letterDialog, get letterTarget() {
        return letterTarget;
      }, get letterAmount() {
        return letterAmount;
      }, pawPrints, get signalPhase() {
        return signalPhase;
      }, curbParts, get walkGreen() {
        return walkGreen;
      }, get signalSince() {
        return signalSince;
      }, get signalManualClicks() {
        return signalManualClicks;
      }, drains, crossingSignal, signals, pedestrianFaces, vehicleFaces, signalHeads, chimeSun, flowerPots, takeoutGroup, takeoutPanes, rearAwning, bento, get takeoutTarget() {
        return takeoutTarget;
      }, get takeoutClicks() {
        return takeoutClicks;
      }, rearBins, rearWallSign, wallPlanter, coffeeCup, coffeeSurface, coffeeStream, bunsGroup, bunLid, bunSteam, get coffeeFull() {
        return coffeeFull;
      }, get coffeeFill() {
        return coffeeFill;
      }, get bunLidTarget() {
        return bunLidTarget;
      }, entranceDecor, postbox, parkingBay, wallCredits, pavementTiles, pavingBounds, rearWindshield, carWindows, windshield, driverHinge, carSpots, carReflections, shelfUnits, odenCounter, odenSteam, get carLightsOn() {
        return carLightsOn;
      }, get carDoorTarget() {
        return carDoorTarget;
      }, parkedCar, sidewalkExtension, utilityPole, railParts, cat, catHead, catPaw, catTail, get catReact() {
        return catReact;
      }, get audio() {
        return { context: audioContext, analyser: audioAnalyser, master: audioMaster, events: soundEvents, counts: __spreadValues({}, soundCounts), muted: audioMuted, rainTapCount };
      }, scene, renderer, camera, doors, rings, bike, staffDoor, trafficMaterials, doorHit, staffHinge, chime, drink, steam, interactionTargets, interactionRipples, bikeSpot, bikeReflection, get staffTarget() {
        return staffTarget;
      }, get bikeLightOn() {
        return bikeLightOn;
      }, get coffeeUntil() {
        return coffeeUntil;
      }, get drinkState() {
        return drinkState;
      }, get chimeImpulse() {
        return chimeImpulse;
      }, get doorTarget() {
        return doorTarget;
      }, setView(a, b = 0.43, d = 56) {
        yaw = a;
        pitch = b;
        distance = d;
        vy = vp = 0;
        target.set(0, 1.4, 0);
      } };
    })();
  };
  window.streetApp = { mode: "rain", transitioning: false, setMode: function(mode) {
    if (!["snow", "summer"].includes(mode)) return;
    if (this.transitioning) return;
    const old = window.__scene;
    if (old && old.stopInteractionAudio) old.stopInteractionAudio();
    if (old && old.closePostcardPreview) old.closePostcardPreview();
    if (old && (old.resetting || old.cyber && old.cyber.resetting)) return;
    let view = old ? old.viewState : null;
    const app = this;
    const oldLarge = old && ["moon", "snow", "summer"].includes(old.weatherMode), newLarge = ["moon", "snow", "summer"].includes(mode);
    if (view && oldLarge !== newLarge) {
      const factor = newLarge ? 56 / 21.7 : 21.7 / 56;
      view = __spreadProps(__spreadValues({}, view), { distance: view.distance * factor, target: [view.target[0] * factor, view.target[1] + (newLarge ? -0.4 : 0.4), view.target[2] * factor] });
    }
    const apply = function() {
      if (old && old.audio.context) old.audio.context.suspend().catch(() => {
      });
      const id = mode === "summer" ? "summer" : mode === "snow" ? "snow" : mode === "moon" ? "moon" : mode === "cyber" ? "cyber" : "original";
      window.streetCurrentScene = id;
      if (!window.streetScenes[id]) {
        if (id === "summer") window.streetInitSummer();
        else if (id === "snow") window.streetInitSnow();
        else if (id === "moon") window.streetInitMoon();
        else if (id === "cyber") window.streetInitCyber();
        else window.streetInitOriginal();
        window.streetScenes[id] = window.__scene;
      }
      const active = window.streetScenes[id];
      window.__scene = active;
      if (id === "original") active.setWeather(mode);
      if (old) active.setClockMode(old.clockIs12);
      if (view) active.restoreView(view);
      for (const hostId of ["snow", "summer"]) document.getElementById("street-" + hostId).hidden = id !== hostId;
      document.querySelectorAll("#street-modes button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mode === mode)));
      document.body.dataset.weather = mode;
      app.mode = mode;
      if ((mode === "cyber" || mode === "moon" || mode === "snow" || mode === "summer") && !active.audio.muted) active.unlockAudio();
      if (active.audio.context && !document.hidden && !active.audio.muted) active.audio.context.resume().catch(() => {
      });
    };
    apply();
  } };
  document.querySelectorAll("#street-modes button").forEach((button) => button.addEventListener("click", () => window.streetApp.setMode(button.dataset.mode)));
  window.streetApp.setMode("summer");
})();
