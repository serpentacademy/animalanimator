/*!
 * Smilodon skull - interactive anatomy viewer  v1.0.0
 * Mount:  <div class="smilodon-viewer" data-glb="URL/smilodon-skull.glb"></div>
 *         <script src="URL/smilodon-skull-viewer.js" defer></script>
 * If data-glb is omitted, the GLB is loaded from the same folder as this script.
 * The UI lives in a Shadow DOM, so WordPress theme CSS cannot restyle it.
 * Requires <model-viewer> (loaded automatically from Google's CDN if absent).
 */
(function () {
  'use strict';

  var SCRIPT = document.currentScript;
  var BASE = SCRIPT && SCRIPT.src ? SCRIPT.src.replace(/[^\/]*(\?.*)?$/, '') : '';
  var MV_SRC = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js';
  var D = {"alt":"3D skull of the sabertooth cat Smilodon fatalis with numbered anatomical landmarks","camera":{"orbit":"38deg 76deg 92%","target":"0m -0.04m 0m","fov":"30deg"},"bone":[0.88,0.85,0.8,1.0],"xray":{"group":"senses","bone":[0.5,0.62,0.72,0.11],"glow":{"_":0.62,"cerebrum":0.3,"nasal":0.5}},"colors":{"teeth":"#F4B860","senses":"#5ED6E6","skull":"#A996F2"},"groups":[{"key":"teeth","label":"Teeth","color":"#F4B860","title":"26 teeth, two of them sabers","intro":"Smilodon fatalis carried I 3/3, C 1/1, P 2/1, M 1/1. Tap a number on the skull, or a name below, to inspect each tooth."},{"key":"senses","label":"Senses & brain","color":"#5ED6E6","title":"How Smilodon sensed its world","intro":"X-ray view: the bone turns to glass and schematic soft tissue lights up - smell in green, sight in blue, hearing in violet. Soft tissue does not fossilise; these shapes sit in the cavities that once held it."},{"key":"skull","label":"Skull & jaw","color":"#A996F2","title":"The architecture behind the bite","intro":"Where the muscles anchored and how the jaw swung open. The model is posed with the jaw at about 88 degrees."}],"hotspots":[{"key":"inc_up","group":"teeth","n":1,"label":"Upper incisors (I1-I3)","note":"Six incisors set in a forward arc, the outer I3 almost canine-sized. With the sabers in the way, these did much of the gripping and meat-stripping.","pos":[0.0918,0.4488,0.9633],"nrm":[0.1476,-0.0984,0.9841],"internal":false,"organ":null,"orbit":"8.5deg 95.6deg 82%","target":"0.05m 0.247m 0.53m"},{"key":"canine_up","group":"teeth","n":2,"label":"Upper canine - the saber","note":"A flattened, finely serrated blade. The whole tooth, root included, could reach about 28 cm. Thin in cross-section, it was built to slice soft tissue, not to hit bone.","pos":[0.3214,0.05,0.8345],"nrm":[0.9285,0.0,0.3714],"internal":false,"organ":null,"orbit":"68.2deg 90.0deg 82%","target":"0.177m 0.028m 0.459m"},{"key":"p4_up","group":"teeth","n":3,"label":"Upper carnassial (P4)","note":"The shearing blade of the upper jaw: three cusps in a row (parastyle, paracone, metacone). A small P3 sits just in front; M1 is a vestige.","pos":[0.3926,0.3061,0.3122],"nrm":[0.9275,-0.3246,0.1855],"internal":false,"organ":null,"orbit":"78.7deg 98.0deg 82%","target":"0.216m 0.168m 0.172m"},{"key":"inc_low","group":"teeth","n":4,"label":"Lower incisors & canine","note":"Three incisors per side plus a small lower canine that sits in the same row, so the front of the jaw works as one gripping comb.","pos":[0.0811,-0.9489,0.15],"nrm":[0.094,-0.3289,0.9397],"internal":false,"organ":null,"orbit":"5.7deg 98.0deg 82%","target":"0.045m -0.522m 0.083m"},{"key":"p4_low","group":"teeth","n":5,"label":"Lower premolar (p4)","note":"The only lower premolar in most Smilodon fatalis; p3 is usually lost. It guides food back toward the carnassial.","pos":[0.234,-0.455,0.0065],"nrm":[0.3304,0.0,0.9439],"internal":false,"organ":null,"orbit":"19.3deg 90.0deg 82%","target":"0.129m -0.25m 0.004m"},{"key":"m1_low","group":"teeth","n":6,"label":"Lower carnassial (m1)","note":"Two blades and nothing else - no grinding heel. It scissors past the upper P4 to cut flesh into swallowable pieces.","pos":[0.224,-0.34,-0.0046],"nrm":[0.3304,0.0,0.9439],"internal":false,"organ":null,"orbit":"19.3deg 90.0deg 82%","target":"0.123m -0.187m -0.003m"},{"key":"nasal","group":"senses","n":1,"label":"Nasal cavity - smell","note":"Air enters through the nasal aperture and passes scroll-like turbinate bones lined with olfactory epithelium, where odour molecules are detected.","pos":[0.0,0.6814,0.7537],"nrm":[0.0,0.12,1.0],"internal":false,"organ":"nasal","orbit":"0.0deg 83.2deg 82%","target":"0.0m 0.375m 0.415m"},{"key":"bulb","group":"senses","n":2,"label":"Olfactory bulbs","note":"The first processing station for smell, at the very front of the brain. Nerve fibres reach them through the sieve-like cribriform plate.","pos":[0.046,0.66,-0.015],"nrm":[1,0,0],"internal":true,"organ":"bulb","orbit":"90.0deg 80.0deg 82%","target":"0.025m 0.363m -0.008m"},{"key":"eye","group":"senses","n":3,"label":"Orbit & eye - sight","note":"Forward-facing orbits give overlapping fields of view and depth perception, like living cats. The optic nerves cross at the chiasm below the brain.","pos":[0.4,0.715,0.21],"nrm":[0.9345,0.1402,0.3271],"internal":false,"organ":"eye","orbit":"70.7deg 81.9deg 82%","target":"0.22m 0.393m 0.116m"},{"key":"vcortex","group":"senses","n":4,"label":"Visual cortex","note":"Where sight is processed: the rear, upper part of each cerebral hemisphere, fed by pathways running back from the optic chiasm.","pos":[0.1,0.6388,-0.5656],"nrm":[0.0,0.6,-0.8],"internal":true,"organ":"vcortex","orbit":"90.0deg 80.0deg 82%","target":"0.055m 0.351m -0.311m"},{"key":"infraorb","group":"senses","n":5,"label":"Infraorbital foramen - touch","note":"The opening for the infraorbital nerve, which carries touch from the whisker pads - vital for placing a bite in close quarters.","pos":[0.2563,0.62,0.4256],"nrm":[0.7828,0.0,0.6222],"internal":false,"organ":null,"orbit":"51.5deg 90.0deg 82%","target":"0.141m 0.341m 0.234m"},{"key":"ear","group":"senses","n":6,"label":"Inner ear - hearing & balance","note":"Sealed inside the dense petrosal bone: the cochlea turns sound into signals and the semicircular canals track head motion.","pos":[0.255,0.33,-0.36],"nrm":[1,0,0],"internal":true,"organ":"ear","orbit":"90.0deg 80.0deg 82%","target":"0.14m 0.182m -0.198m"},{"key":"cerebellum","group":"senses","n":7,"label":"Cerebellum","note":"Below the back of the skull roof. It coordinates timing and balance - every lunge, twist and head strike runs through it.","pos":[0.0,0.5,-0.675],"nrm":[1,0,0],"internal":true,"organ":"cerebellum","orbit":"90.0deg 80.0deg 82%","target":"0.0m 0.275m -0.371m"},{"key":"sag_crest","group":"skull","n":1,"label":"Sagittal crest","note":"A midline ridge anchoring the temporalis muscles that close the jaw.","pos":[0.0,0.9972,-0.4512],"nrm":[0.0,0.995,-0.0995],"internal":false,"organ":null,"orbit":"180.0deg 45.0deg 82%","target":"0.0m 0.548m -0.248m"},{"key":"zygo","group":"skull","n":2,"label":"Zygomatic arch","note":"The cheekbone bridge. The masseter muscle hangs from its lower edge down to the outer face of the jaw.","pos":[0.6024,0.4688,-0.02],"nrm":[0.995,-0.0995,-0.0],"internal":false,"organ":null,"orbit":"90.0deg 95.7deg 82%","target":"0.331m 0.258m -0.011m"},{"key":"tmj","group":"skull","n":3,"label":"Jaw joint (glenoid fossa)","note":"Set low on the skull, this hinge lets the jaw drop far enough for the sabers to clear it - a gape often estimated at well over 90 degrees, far wider than a lion's.","pos":[0.3421,0.0018,-0.21],"nrm":[0.9889,0.1483,-0.0],"internal":false,"organ":null,"orbit":"90.0deg 81.5deg 82%","target":"0.188m 0.001m -0.116m"},{"key":"coronoid","group":"skull","n":4,"label":"Coronoid process","note":"Unusually small. A tall coronoid would overstretch the temporalis at full gape, so sabertooths traded closing leverage for opening range.","pos":[0.1998,-0.0688,0.0072],"nrm":[0.796,0.0995,0.597],"internal":false,"organ":null,"orbit":"53.1deg 84.3deg 82%","target":"0.11m -0.038m 0.004m"},{"key":"mastoid","group":"skull","n":5,"label":"Mastoid process","note":"Enlarged in Smilodon. Neck muscles anchored here pulled the head downward, driving the sabers with the power of the neck rather than the jaw.","pos":[0.3726,0.2762,-0.4538],"nrm":[0.8962,-0.3137,-0.3137],"internal":false,"organ":null,"orbit":"109.3deg 98.0deg 82%","target":"0.205m 0.152m -0.25m"},{"key":"occ_cond","group":"skull","n":6,"label":"Occipital condyles","note":"The paired knuckles that sit on the first neck vertebra, flanking the foramen magnum where the spinal cord leaves the skull.","pos":[0.1222,0.4261,-0.8295],"nrm":[0.1855,-0.3246,-0.9275],"internal":false,"organ":null,"orbit":"168.7deg 98.0deg 82%","target":"0.067m 0.234m -0.456m"},{"key":"flange","group":"skull","n":7,"label":"Mandibular flange","note":"A modest downward flange at the front of the chin, lying next to the saber tips when the mouth is closed.","pos":[0.1392,-0.8423,-0.2234],"nrm":[0.9407,-0.1881,-0.2822],"internal":false,"organ":null,"orbit":"106.7deg 98.0deg 82%","target":"0.077m -0.463m -0.123m"},{"key":"mental","group":"skull","n":8,"label":"Mental foramen","note":"A small opening for the nerve and vessels supplying the chin and lower lip.","pos":[0.1657,-0.7,-0.1812],"nrm":[0.995,0.0,-0.0995],"internal":false,"organ":null,"orbit":"95.7deg 90.0deg 82%","target":"0.091m -0.385m -0.1m"}]};

  // ------------------------------------------------------------------ utils --
  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }
  function deg(r) { return r * 180 / Math.PI; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  var ICON = {
    spin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6v12M16 6v12" /></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5l11 6.5-11 6.5z" /></svg>',
    reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" /><path d="M4 4.5v4h4" /></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 6l-6 6 6 6" /></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 6l6 6-6 6" /></svg>'
  };

  function loadModelViewer() {
    if (window.customElements && customElements.get('model-viewer')) return Promise.resolve();
    if (!document.querySelector('script[data-smx-mv]')) {
      var s = el('script', { type: 'module', src: MV_SRC, 'data-smx-mv': '1' });
      document.head.appendChild(s);
    }
    return customElements.whenDefined('model-viewer');
  }

  // ------------------------------------------------------------------ styles --
  var CSS = ":host{display:block;max-width:760px;margin:2rem auto;color:#EEE8DC;\nfont-family:\"DM Sans\",Inter,system-ui,-apple-system,\"Segoe UI\",Roboto,sans-serif;\n-webkit-font-smoothing:antialiased;line-height:1.5}\n*{box-sizing:border-box}\nbutton{all:unset;box-sizing:border-box;cursor:pointer;-webkit-tap-highlight-color:transparent}\nbutton:focus-visible{outline:2px solid #EEE8DC;outline-offset:3px}\n.wrap{background:#0A0D11;border:1px solid #1B2129;border-radius:20px;padding:14px;\nbox-shadow:0 30px 60px -30px rgba(0,0,0,.7)}\n/* ---- tabs: one segmented control, colour-keyed ---- */\n.tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:4px;padding:4px;\nbackground:#11161C;border:1px solid #1B2129;border-radius:14px;margin-bottom:12px}\n.tab{display:flex;align-items:center;justify-content:center;gap:8px;padding:9px 6px;\nborder-radius:10px;font-size:13.5px;font-weight:500;color:#8F98A3;text-align:center;\ntransition:background .2s ease,color .2s ease;white-space:nowrap}\n.tab i{width:7px;height:7px;border-radius:50%;background:var(--c);opacity:.55;flex:none;\ntransition:opacity .2s ease,box-shadow .2s ease}\n.tab em{font-style:normal;font-size:11px;color:#5E6773;font-variant-numeric:tabular-nums}\n.tab:hover{color:#D6D0C4}\n.tab[aria-selected=\"true\"]{background:#1A2027;color:#F4EFE6}\n.tab[aria-selected=\"true\"] i{opacity:1;box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 22%,transparent)}\n.tab[aria-selected=\"true\"] em{color:var(--c)}\n/* ---- square stage ---- */\n.stage{position:relative;aspect-ratio:1/1;width:100%;border-radius:14px;overflow:hidden;\nbackground:radial-gradient(70% 60% at 50% 42%,#18202A 0%,#0E1318 55%,#090C10 100%)}\n.stage::after{content:\"\";position:absolute;inset:0;pointer-events:none;border-radius:14px;\nbox-shadow:inset 0 0 0 1px rgba(255,255,255,.04),inset 0 0 90px rgba(0,0,0,.55)}\n.stage.xray{background:radial-gradient(70% 60% at 50% 42%,#10222A 0%,#0A141A 55%,#070B0E 100%)}\nmodel-viewer{width:100%;height:100%;display:block;background:transparent;\n--poster-color:transparent;--min-hotspot-opacity:1;--progress-bar-color:transparent}\n.bar{position:absolute;left:18%;right:18%;top:50%;height:2px;background:rgba(255,255,255,.08);\nborder-radius:2px;overflow:hidden;transition:opacity .4s ease}\n.bar span{display:block;height:100%;width:0;background:var(--c,#F4B860)}\n.bar.done{opacity:0;visibility:hidden;transition:opacity .4s ease,visibility 0s linear .4s}\n.loading{position:absolute;left:0;right:0;top:calc(50% + 14px);text-align:center;font-size:12px;\nletter-spacing:.08em;color:#6F7883;pointer-events:none;transition:opacity .4s ease}\n.stage.ready .loading{opacity:0;visibility:hidden;transition:opacity .4s ease,visibility 0s linear .4s}\n.stage.failed .loading{opacity:1;color:#E8A08C}\n.badge{position:absolute;left:12px;top:12px;font-size:10.5px;letter-spacing:.12em;text-transform:uppercase;\ncolor:#8FE3EE;background:rgba(9,20,26,.72);border:1px solid rgba(94,214,230,.25);\npadding:5px 9px;border-radius:999px;opacity:0;transform:translateY(-4px);\ntransition:opacity .3s ease,transform .3s ease;pointer-events:none}\n.stage.xray .badge{opacity:1;transform:none}\n.hud{position:absolute;right:10px;bottom:10px;display:flex;gap:6px}\n.icon{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;\nbackground:rgba(14,19,25,.78);border:1px solid #242C36;color:#C9C3B8;\ntransition:border-color .2s ease,color .2s ease}\n.icon:hover{border-color:#3A4450;color:#fff}\n.icon svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8;\nstroke-linecap:round;stroke-linejoin:round}\n.icon.sm{width:30px;height:30px}\n.icon.sm svg{width:15px;height:15px}\n.hint{position:absolute;left:12px;bottom:17px;font-size:11px;color:#65707B;pointer-events:none;\ntransition:opacity .5s ease}\n.stage.touched .hint{opacity:0}\n/* ---- hotspots ---- */\n.hs{position:relative;width:0;height:0;display:block;transition:opacity .25s ease}\n.hs.off{opacity:0;visibility:hidden;pointer-events:none}\n.hs.on{z-index:10}\n.hs .dot{position:absolute;left:-12px;top:-12px;width:24px;height:24px;border-radius:50%;\ndisplay:grid;place-items:center;font-size:11px;font-weight:600;color:var(--c);\nbackground:rgba(8,11,15,.82);border:1.5px solid var(--c);\nbox-shadow:0 0 0 3px rgba(8,11,15,.35),0 0 14px -2px var(--c);\nfont-variant-numeric:tabular-nums;transition:transform .18s ease,background .18s ease,color .18s ease}\n.hs:hover .dot{transform:scale(1.12)}\n.hs.on .dot{background:var(--c);color:#0A0D11;transform:scale(1.15);\nbox-shadow:0 0 0 5px color-mix(in srgb,var(--c) 25%,transparent),0 0 22px var(--c)}\n.hs .tag{position:absolute;left:18px;top:-13px;white-space:nowrap;font-size:12px;font-weight:500;\ncolor:#F4EFE6;background:rgba(10,13,17,.9);border:1px solid color-mix(in srgb,var(--c) 45%,#1B2129);\npadding:4px 9px;border-radius:999px;opacity:0;transform:translateX(-4px);pointer-events:none;\ntransition:opacity .2s ease,transform .2s ease}\n.hs.left .tag{left:auto;right:18px;transform:translateX(4px)}\n.hs.on .tag{opacity:1;transform:none}\n@media (hover:hover){.hs:hover .tag{opacity:1;transform:none}}\n/* ---- info panel ---- */\n.info{margin-top:12px;padding:14px 16px 15px;border-radius:14px;background:#0F1419;\nborder:1px solid #1B2129;border-left:2px solid var(--c);min-height:132px}\n.info-top{display:flex;align-items:center;justify-content:space-between;gap:10px}\n.eyebrow{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--c);font-weight:600}\n.nav{display:flex;gap:6px}\n.title{font-size:18px;font-weight:600;letter-spacing:-.01em;color:#F4EFE6;margin:6px 0 4px;line-height:1.25}\n.note{margin:0;font-size:14px;color:#A3ABB5;line-height:1.6}\n/* ---- chips ---- */\n.chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px}\n.chip{display:inline-flex;align-items:center;gap:7px;font-size:12.5px;color:#A3ABB5;\npadding:5px 11px 5px 5px;border-radius:999px;background:#11161C;border:1px solid #1B2129;\ntransition:border-color .2s ease,color .2s ease,background .2s ease}\n.chip span{width:19px;height:19px;border-radius:50%;display:grid;place-items:center;font-size:10.5px;\nfont-weight:600;color:var(--c);box-shadow:inset 0 0 0 1px var(--c);font-variant-numeric:tabular-nums}\n.chip:hover{color:#EEE8DC;border-color:#2A333D}\n.chip[aria-pressed=\"true\"]{color:#F4EFE6;border-color:var(--c);background:#161C23}\n.chip[aria-pressed=\"true\"] span{background:var(--c);color:#0A0D11}\n@media (max-width:520px){\n:host{margin:1.4rem auto}\n.wrap{padding:10px;border-radius:16px}\n.tab{font-size:12px;gap:6px;padding:9px 4px}\n.tab em{display:none}\n.title{font-size:16.5px}\n.note{font-size:13.5px}\n.info{min-height:150px}\n.hint{display:none}\n}\n@media (prefers-reduced-motion:reduce){*{transition:none!important}}";

  // ------------------------------------------------------------------ viewer --
  function Viewer(host) {
    this.host = host;
    this.glb = host.getAttribute('data-glb') || (BASE + 'smilodon-skull.glb');
    this.group = host.getAttribute('data-group') || D.groups[0].key;
    this.active = null;
    this.xray = false;
    this.orgMats = [];
    this.boneMats = [];
    this.build();
  }

  Viewer.prototype.build = function () {
    var self = this;
    var root = this.host.attachShadow ? this.host.attachShadow({ mode: 'open' }) : this.host;
    this.root = root;
    root.appendChild(el('style', null, CSS));

    var wrap = el('div', { class: 'wrap' });
    root.appendChild(wrap);

    // tabs
    var tabs = el('div', { class: 'tabs', role: 'tablist', 'aria-label': 'Anatomy groups' });
    D.groups.forEach(function (g) {
      var n = D.hotspots.filter(function (h) { return h.group === g.key; }).length;
      var b = el('button', { type: 'button', role: 'tab', class: 'tab', 'data-group': g.key,
        style: '--c:' + g.color, 'aria-selected': 'false' },
        '<i></i><span>' + esc(g.label) + '</span><em>' + n + '</em>');
      tabs.appendChild(b);
    });
    wrap.appendChild(tabs);

    // stage
    var stage = el('div', { class: 'stage' });
    var mv = el('model-viewer', {
      src: this.glb, alt: D.alt, 'camera-controls': '', 'touch-action': 'pan-y',
      'interaction-prompt': 'none', 'shadow-intensity': '0', exposure: '1.05',
      'tone-mapping': 'neutral', 'environment-image': 'neutral',
      'auto-rotate': '', 'auto-rotate-delay': '3000', 'rotation-per-second': '10deg',
      'camera-orbit': D.camera.orbit, 'camera-target': D.camera.target,
      'min-camera-orbit': 'auto 12deg auto', 'max-camera-orbit': 'auto 168deg auto',
      'field-of-view': D.camera.fov, loading: 'eager', reveal: 'auto'
    });
    this.mv = mv;
    this.spots = {};
    D.hotspots.forEach(function (h) {
      var b = el('button', {
        type: 'button', class: 'hs', slot: 'hotspot-' + h.key, 'data-key': h.key,
        'data-group': h.group, 'data-position': h.pos.join(' ') ,
        'data-normal': h.nrm.join(' '), 'data-visibility-attribute': 'visible',
        style: '--c:' + D.colors[h.group], 'aria-label': h.label
      }, '<span class="dot">' + h.n + '</span><span class="tag">' + esc(h.label) + '</span>');
      mv.appendChild(b);
      self.spots[h.key] = { h: h, el: b };
    });
    var bar = el('div', { slot: 'progress-bar', class: 'bar' }, '<span></span>');
    mv.appendChild(bar);
    stage.appendChild(mv);

    stage.appendChild(el('div', { class: 'badge', 'aria-hidden': 'true' }, 'X-ray &middot; schematic soft tissue'));
    var hud = el('div', { class: 'hud' });
    hud.appendChild(el('button', { type: 'button', class: 'icon', 'data-act': 'spin', 'aria-label': 'Pause rotation' }, ICON.spin));
    hud.appendChild(el('button', { type: 'button', class: 'icon', 'data-act': 'reset', 'aria-label': 'Reset view' }, ICON.reset));
    stage.appendChild(hud);
    stage.appendChild(el('div', { class: 'hint', 'aria-hidden': 'true' }, 'Drag to rotate &middot; pinch or scroll to zoom'));
    stage.appendChild(el('div', { class: 'loading', 'aria-hidden': 'true' }, 'Loading 3D skull&hellip;'));
    wrap.appendChild(stage);
    this.stage = stage;

    // info panel
    var info = el('div', { class: 'info', 'aria-live': 'polite' },
      '<div class="info-top"><span class="eyebrow"></span>' +
      '<span class="nav"><button type="button" class="icon sm" data-act="prev" aria-label="Previous structure">' + ICON.prev + '</button>' +
      '<button type="button" class="icon sm" data-act="next" aria-label="Next structure">' + ICON.next + '</button></span></div>' +
      '<div class="title"></div><p class="note"></p>');
    wrap.appendChild(info);
    this.info = info;

    var chips = el('div', { class: 'chips' });
    wrap.appendChild(chips);
    this.chips = chips;

    // ---- events
    wrap.addEventListener('click', function (e) {
      var t = e.target.closest('[data-group].tab');
      if (t) { self.setGroup(t.getAttribute('data-group')); return; }
      var hs = e.target.closest('.hs');
      if (hs) { self.select(hs.getAttribute('data-key'), false); return; }
      var c = e.target.closest('.chip');
      if (c) { self.select(c.getAttribute('data-key'), true); return; }
      var a = e.target.closest('[data-act]');
      if (!a) return;
      var act = a.getAttribute('data-act');
      if (act === 'spin') self.toggleSpin();
      if (act === 'reset') self.reset();
      if (act === 'prev') self.step(-1);
      if (act === 'next') self.step(1);
    });
    tabs.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      var i = D.groups.map(function (g) { return g.key; }).indexOf(self.group);
      i = (i + (e.key === 'ArrowRight' ? 1 : -1) + D.groups.length) % D.groups.length;
      self.setGroup(D.groups[i].key);
      tabs.querySelector('[data-group="' + D.groups[i].key + '"]').focus();
    });

    mv.addEventListener('progress', function (e) {
      var p = e.detail.totalProgress;
      bar.firstChild.style.width = (p * 100) + '%';
      if (p >= 0.999) bar.classList.add('done');
    });
    mv.addEventListener('load', function () {
      stage.classList.add('ready');
      bar.classList.add('done');
      setTimeout(function () { bar.style.display = 'none'; stage.querySelector('.loading').style.display = 'none'; }, 450);
      self.collectMaterials();
      self.applyXray();
      self.update();
    });
    mv.addEventListener('error', function () {
      stage.classList.add('ready');
      stage.querySelector('.loading').textContent = '3D model could not be loaded.';
      stage.classList.add('failed');
    });
    var queued = false;
    mv.addEventListener('camera-change', function () {
      if (queued) return;
      queued = true;
      requestAnimationFrame(function () { queued = false; self.update(); });
    });
    var sx = 0, sy = 0;
    mv.addEventListener('pointerdown', function (e) {
      sx = e.clientX; sy = e.clientY;
      stage.classList.add('touched');
    });
    mv.addEventListener('pointerup', function (e) {
      if (Math.hypot(e.clientX - sx, e.clientY - sy) < 5 && !e.target.closest('.hs')) self.select(null);
    });
    window.addEventListener('resize', function () { self.update(); });

    this.setGroup(this.group, true);
  };

  Viewer.prototype.collectMaterials = function () {
    var self = this;
    if (!this.mv.model) return;
    this.mv.model.materials.forEach(function (m) {
      var n = m.name || '';
      if (n.indexOf('bone_') === 0) self.boneMats.push(m);
      if (n.indexOf('org_') === 0) {
        self.orgMats.push({ key: n.slice(4), m: m, base: m.emissiveFactor.slice(0, 3) });
      }
    });
  };

  Viewer.prototype.applyXray = function () {
    var on = this.xray;
    this.stage.classList.toggle('xray', on);
    if (!this.mv.model) return;
    this.boneMats.forEach(function (m) {
      m.setAlphaMode(on ? 'BLEND' : 'OPAQUE');
      m.pbrMetallicRoughness.setBaseColorFactor(on ? D.xray.bone : D.bone);
    });
    this.orgMats.forEach(function (o) {
      var c = o.m.pbrMetallicRoughness.baseColorFactor;
      o.m.pbrMetallicRoughness.setBaseColorFactor([c[0], c[1], c[2], on ? 1 : 0]);
    });
    this.pulse();
  };

  Viewer.prototype.pulse = function () {
    var self = this;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (!this.xray || !this.orgMats.length) return;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    var last = 0;
    function tick(t) {
      if (!self.xray) return;
      self._raf = requestAnimationFrame(tick);
      if (t - last < 40) return;
      last = t;
      var sel = self.active && self.spots[self.active].h.organ;
      self.orgMats.forEach(function (o) {
        var k, rest = D.xray.glow[o.key] || D.xray.glow._;
        if (!sel) k = rest;
        else if (o.key === sel) k = reduce ? 1 : 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(t / 260));
        else k = rest * 0.35;
        o.m.setEmissiveFactor([o.base[0] * k, o.base[1] * k, o.base[2] * k]);
      });
    }
    this._raf = requestAnimationFrame(tick);
  };

  Viewer.prototype.setGroup = function (key, first) {
    var self = this;
    this.group = key;
    this.active = null;
    var g = D.groups.filter(function (x) { return x.key === key; })[0];
    this.root.querySelectorAll('.tab').forEach(function (t) {
      var on = t.getAttribute('data-group') === key;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    this.stage.style.setProperty('--c', g.color);
    this.chips.innerHTML = '';
    D.hotspots.filter(function (h) { return h.group === key; }).forEach(function (h) {
      self.chips.appendChild(el('button', { type: 'button', class: 'chip', 'data-key': h.key,
        style: '--c:' + g.color, 'aria-pressed': 'false' },
        '<span>' + h.n + '</span>' + esc(h.label)));
    });
    this.xray = key === D.xray.group;
    this.applyXray();
    this.renderInfo();
    if (!first) this.reset(true);
    this.update();
  };

  Viewer.prototype.select = function (key, moveCamera) {
    this.active = key;
    var self = this;
    Object.keys(this.spots).forEach(function (k) {
      self.spots[k].el.classList.toggle('on', k === key);
    });
    this.chips.querySelectorAll('.chip').forEach(function (c) {
      c.setAttribute('aria-pressed', c.getAttribute('data-key') === key ? 'true' : 'false');
    });
    this.renderInfo();
    if (key && moveCamera) this.focus(key);
    this.update();
  };

  Viewer.prototype.step = function (dir) {
    var list = D.hotspots.filter(function (h) { return h.group === this.group; }, this);
    var i = list.map(function (h) { return h.key; }).indexOf(this.active);
    i = i < 0 ? (dir > 0 ? 0 : list.length - 1) : (i + dir + list.length) % list.length;
    this.select(list[i].key, true);
  };

  Viewer.prototype.renderInfo = function () {
    var g = D.groups.filter(function (x) { return x.key === this.group; }, this)[0];
    var eb = this.info.querySelector('.eyebrow');
    var ti = this.info.querySelector('.title');
    var no = this.info.querySelector('.note');
    this.info.style.setProperty('--c', g.color);
    if (!this.active) {
      eb.textContent = g.label;
      ti.textContent = g.title;
      no.textContent = g.intro;
      this.info.classList.remove('has');
      return;
    }
    var h = this.spots[this.active].h;
    var list = D.hotspots.filter(function (x) { return x.group === h.group; });
    eb.textContent = g.label + ' ' + String.fromCharCode(183) + ' ' + h.n + ' of ' + list.length;
    ti.textContent = h.label;
    no.textContent = h.note;
    this.info.classList.add('has');
  };

  Viewer.prototype.stopSpin = function () {
    this.mv.removeAttribute('auto-rotate');
    var b = this.root.querySelector('[data-act="spin"]');
    b.innerHTML = ICON.play; b.setAttribute('aria-label', 'Resume rotation');
  };

  Viewer.prototype.toggleSpin = function () {
    var b = this.root.querySelector('[data-act="spin"]');
    if (this.mv.hasAttribute('auto-rotate')) { this.stopSpin(); }
    else {
      this.mv.setAttribute('auto-rotate', '');
      b.innerHTML = ICON.spin; b.setAttribute('aria-label', 'Pause rotation');
    }
  };

  Viewer.prototype.focus = function (key) {
    var h = this.spots[key].h;
    this.stopSpin();
    this.mv.cameraTarget = h.target;
    this.mv.cameraOrbit = h.orbit;
  };

  Viewer.prototype.reset = function (keepSelection) {
    if (!keepSelection) this.select(null);
    this.mv.cameraTarget = D.camera.target;
    this.mv.cameraOrbit = D.camera.orbit;
    if (this.mv.resetTurntableRotation) this.mv.resetTurntableRotation();
  };

  // facing test + label side; model-viewer's own occlusion test cannot be used for
  // the internal landmarks, which sit inside the (ghosted) bone
  Viewer.prototype.update = function () {
    var mv = this.mv, self = this;
    if (!mv.getCameraOrbit) return;
    var o = mv.getCameraOrbit(), c = mv.getCameraTarget();
    var sp = Math.sin(o.phi);
    var cam = [c.x + o.radius * sp * Math.sin(o.theta), c.y + o.radius * Math.cos(o.phi),
               c.z + o.radius * sp * Math.cos(o.theta)];
    var r = this.stage.getBoundingClientRect();
    Object.keys(this.spots).forEach(function (k) {
      var s = self.spots[k], h = s.h, show = h.group === self.group;
      if (show && !h.internal) {
        var v = [cam[0] - h.pos[0], cam[1] - h.pos[1], cam[2] - h.pos[2]];
        var L = Math.hypot(v[0], v[1], v[2]) || 1;
        show = (v[0] * h.nrm[0] + v[1] * h.nrm[1] + v[2] * h.nrm[2]) / L > 0.08;
      }
      if (show && h.internal) show = self.xray;
      s.el.classList.toggle('off', !show);
      if (show) {
        var b = s.el.getBoundingClientRect();
        s.el.classList.toggle('left', b.left - r.left > r.width * 0.58);
      }
    });
  };

  function boot() {
    var hosts = document.querySelectorAll('.smilodon-viewer:not([data-smx-ready])');
    if (!hosts.length) return;
    loadModelViewer().then(function () {
      hosts.forEach(function (h) {
        h.setAttribute('data-smx-ready', '1');
        new Viewer(h);
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
