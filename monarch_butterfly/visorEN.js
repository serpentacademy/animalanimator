/* ---------------------------------------------------------------------------
   Loading three.js
   three.js has no CDN of its own: the project ships through npm and recommends
   unpkg and jsDelivr, which serve that package as-is. The three files have been
   checked byte for byte on unpkg, jsDelivr and cdnjs and are identical.
   (cdnjs only publishes the core, not the examples/js loaders, so it cannot be
   used on its own.)

   Every file carries its SRI hash: if a CDN ever returned something different,
   the browser rejects it and the next URL in the list is tried automatically.

   TO DEPEND ON NOBODY ELSE: upload the three .js files to your own bucket and
   uncomment the matching line in each block. A <script src> needs no CORS.
--------------------------------------------------------------------------- */
(function(){
  var LIB = [
    { h: "sha384-vV17nr/rMaJqmeZkFUzXLpHdQ+ME5QHKdydaqqN+3Ga39RJlNrTatJxHwGV4ml2C",
      u: ["https://unpkg.com/three@0.147.0/build/three.min.js",
          "https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"
          /* , "https://storage.googleapis.com/YOUR-BUCKET/three/three.min.js" */ ] },
    { h: "sha384-FassWWYNEPQsuRQm+59KIMcDetEc30bNyE9yfx16Ok8lvoowyH81LtrPmLWltJMh",
      u: ["https://unpkg.com/three@0.147.0/examples/js/loaders/GLTFLoader.js",
          "https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/loaders/GLTFLoader.js"
          /* , "https://storage.googleapis.com/YOUR-BUCKET/three/GLTFLoader.js" */ ] },
    { h: "sha384-I0DMsfimAPIqWT8lF+oA997gRgdUi3jhidoTq3fN0zmn35smXZukD01FLnsPRU9i",
      u: ["https://unpkg.com/three@0.147.0/examples/js/controls/OrbitControls.js",
          "https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js"
          /* , "https://storage.googleapis.com/YOUR-BUCKET/three/OrbitControls.js" */ ] }
  ];

  function notice(t){
    var e = document.getElementById("mnxv-carga");
    if(e) e.textContent = t;
  }

  /* Chained and in order: GLTFLoader and OrbitControls need THREE to exist
     already, so they cannot be requested in parallel. */
  function one(i, j){
    if(i >= LIB.length){ start(); return; }
    if(j >= LIB[i].u.length){ notice("three.js could not be loaded"); return; }
    var s = document.createElement("script");
    s.src = LIB[i].u[j];
    s.integrity = LIB[i].h;
    s.crossOrigin = "anonymous";
    s.async = false;
    s.setAttribute("data-cfasync", "false");
    s.onload  = function(){ one(i + 1, 0); };
    s.onerror = function(){ s.parentNode && s.parentNode.removeChild(s); one(i, j + 1); };
    document.head.appendChild(s);
  }
  one(0, 0);

  function start(){

  var doc = document.getElementById('mnxv');
  var loading = document.getElementById('mnxv-carga');
  if(!doc || !window.THREE) return;
  var URL_GLB = doc.dataset.glb;
  var SCALE = 6;   /* the clips are authored at 1/6 of real speed */

  var CLIPS = [
    {id:'Monarca_Vuelo_Crucero',   n:'Cruising flight', hz:10.0,
     pie:'Cruising wingbeat at 10 Hz. The amplitude is 115 degrees and the abdomen '+
         'swings in antiphase with the wings to offset the pitching moment.'},
    {id:'Monarca_Planeo',          n:'Gliding', hz:0,
     pie:'The mode that makes the migration possible: wings almost static in a '+
         '13-degree dihedral, climbing on thermals at around 18 km/h (11 mph).'},
    {id:'Monarca_Despegue_InSitu', n:'Takeoff', hz:11.25,
     pie:'Takeoff with clap-and-fling. The legs push through the first 30 % of the '+
         'cycle: that thrust, not lift, is what breaks contact with the ground.'}
  ];

  var wrap = document.getElementById('mnxv-lienzo');
  var renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  wrap.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1.618, 0.05, 400);
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; controls.dampingFactor = 0.06;
  controls.enablePan = false; controls.autoRotate = true; controls.autoRotateSpeed = 0.9;

  var key  = new THREE.DirectionalLight(0xffdeb2, 4.2);
  var rim  = new THREE.DirectionalLight(0xffb44f, 3.4);
  var fill = new THREE.DirectionalLight(0x7080ff, 0.70);
  var amb  = new THREE.AmbientLight(0x2a2740, 0.55);
  key.position.set(-3.2,4.6,4.4);
  rim.position.set(2.9,2.4,-3.8);
  fill.position.set(3.6,-1.6,2.6);
  scene.add(key, rim, fill, amb);
  var chiaro = true;

  var mixer=null, root=null, actions={}, current=null, backdrop=null;
  var clock = new THREE.Clock();
  var play = true, dragging = false, idx = 0;

  function fit(){
    camera.aspect = wrap.clientWidth / Math.max(wrap.clientHeight,1);
    camera.updateProjectionMatrix();
    renderer.setSize(wrap.clientWidth, wrap.clientHeight, false);
  }
  window.addEventListener('resize', fit);

  new THREE.GLTFLoader().load(URL_GLB, function(gltf){
    root = gltf.scene; scene.add(root);
    var drop = [];
    root.traverse(function(o){
      if(o.isLight) drop.push(o);
      if(o.name === 'Fondo_Cupula'){
        backdrop = o;
        var fm = Array.isArray(o.material)? o.material : [o.material];
        fm.forEach(function(m){ if(m && 'emissiveIntensity' in m) m.emissiveIntensity = 0.78; });
      }
      if(o.isMesh){
        o.frustumCulled = false;
        var mm = Array.isArray(o.material)? o.material : [o.material];
        mm.forEach(function(m){ if(m) m.side = THREE.DoubleSide; });
      }
    });
    drop.forEach(function(l){ if(l.parent) l.parent.remove(l); });

    var box = new THREE.Box3();
    root.traverse(function(o){
      if(o.isMesh && o !== backdrop && o.name.indexOf('Sphere')<0){
        o.geometry.computeBoundingBox();
        box.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));
      }
    });
    var c = box.getCenter(new THREE.Vector3());
    var t = box.getSize(new THREE.Vector3());
    var radius = 0.5*Math.sqrt(t.x*t.x + t.y*t.y + t.z*t.z);
    controls.target.copy(c);
    var d = radius / Math.tan(THREE.MathUtils.degToRad(camera.fov*0.5)) * 1.95;
    camera.position.set(c.x + d*0.58, c.y + d*0.26, c.z + d*0.77);
    controls.minDistance = radius*1.2; controls.maxDistance = radius*14;
    controls.update();

    mixer = new THREE.AnimationMixer(root);
    gltf.animations.forEach(function(cl){ actions[cl.name] = mixer.clipAction(cl); });
    buttons(); pick(0);
    loading.classList.add('fuera');
    fit();
  }, undefined, function(){
    loading.textContent = 'The 3D model could not be loaded';
  });

  var cont = document.getElementById('mnxv-clips'), bts = [];
  function buttons(){
    CLIPS.forEach(function(c,i){
      if(!actions[c.id]) return;
      var b = document.createElement('button');
      b.className='mnxv-b'; b.type='button'; b.textContent=c.n;
      b.setAttribute('aria-pressed','false');
      b.onclick = function(){ pick(i); };
      cont.appendChild(b); bts.push(b);
    });
  }
  function pick(i){
    var a = actions[CLIPS[i].id]; if(!a) return;
    if(current && current !== a) current.fadeOut(0.18);
    a.reset(); a.setLoop(THREE.LoopRepeat, Infinity); a.fadeIn(0.18).play();
    current = a; idx = i;
    bts.forEach(function(b,k){ b.setAttribute('aria-pressed', k===i?'true':'false'); });
    document.getElementById('mnxv-pie').textContent = CLIPS[i].pie;
    speed();
  }

  var sv = document.getElementById('mnxv-vel'), lv = document.getElementById('mnxv-velval');
  function speed(){
    var f = sv.value/100;
    if(mixer) mixer.timeScale = play ? f*SCALE : 0;
    var hz = CLIPS[idx].hz;
    lv.textContent = hz ? ('×'+f.toFixed(2)+'  '+(hz*f).toFixed(1)+' Hz')
                        : ('×'+f.toFixed(2));
  }
  sv.addEventListener('input', speed);

  var bp = document.getElementById('mnxv-play');
  bp.onclick = function(){
    play = !play; bp.textContent = play ? 'Pause' : 'Play';
    bp.setAttribute('aria-pressed', play?'true':'false'); speed();
  };

  var st = document.getElementById('mnxv-t');
  st.addEventListener('input', function(){
    if(!current) return;
    dragging = true;
    current.time = current.getClip().duration * (st.value/1000);
    mixer.update(0);
  });
  st.addEventListener('change', function(){ dragging = false; });

  var bg = document.getElementById('mnxv-giro');
  bg.onclick = function(){
    controls.autoRotate = !controls.autoRotate;
    bg.setAttribute('aria-pressed', controls.autoRotate?'true':'false');
  };

  var bl = document.getElementById('mnxv-luz');
  bl.onclick = function(){
    chiaro = !chiaro;
    if(chiaro){
      key.intensity=4.2; key.color.setHex(0xffdeb2);
      rim.intensity=3.4; fill.intensity=0.70;
      amb.intensity=0.55; amb.color.setHex(0x2a2740);
      renderer.toneMappingExposure = 1.0;
    }else{
      key.intensity=2.6; key.color.setHex(0xffffff);
      rim.intensity=1.9; fill.intensity=1.6;
      amb.intensity=1.8; amb.color.setHex(0x9aa0b5);
      renderer.toneMappingExposure = 1.0;
    }
    bl.textContent = chiaro ? 'Chiaroscuro' : 'Neutral';
    bl.setAttribute('aria-pressed', chiaro?'true':'false');
  };

  var hud = document.getElementById('mnxv-hud');
  function loop(){
    requestAnimationFrame(loop);
    var dt = clock.getDelta();
    if(mixer && !dragging) mixer.update(dt);
    if(current && !dragging){
      var dur = current.getClip().duration;
      st.value = Math.round(1000 * ((current.time % dur) / dur));
      hud.innerHTML = '<b>'+CLIPS[idx].n+'</b> &nbsp; '+
                      ((current.time/SCALE)*1000).toFixed(0)+' ms';
    }
    controls.update();
    renderer.render(scene, camera);
  }
  fit(); speed(); loop();
  }
})();
