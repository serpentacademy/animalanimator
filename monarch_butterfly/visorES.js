/* ---------------------------------------------------------------------------
   Carga de three.js
   three.js no tiene CDN propio: el proyecto distribuye por npm y recomienda
   unpkg y jsDelivr, que sirven ese paquete tal cual. Comprobado que los tres
   archivos son identicos byte a byte en unpkg, jsDelivr y cdnjs.
   (cdnjs solo publica el nucleo, no los cargadores de examples/js, por eso no
   sirve por si solo.)

   Cada archivo lleva su hash SRI: si un CDN devolviera algo distinto, el
   navegador lo rechaza y se pasa automaticamente al siguiente de la lista.

   PARA NO DEPENDER DE TERCEROS: sube los tres .js a tu bucket y descomenta la
   linea correspondiente de cada bloque. Un <script src> no necesita CORS.
--------------------------------------------------------------------------- */
(function(){
  var LIB = [
    { h: "sha384-vV17nr/rMaJqmeZkFUzXLpHdQ+ME5QHKdydaqqN+3Ga39RJlNrTatJxHwGV4ml2C",
      u: ["https://unpkg.com/three@0.147.0/build/three.min.js",
          "https://cdn.jsdelivr.net/npm/three@0.147.0/build/three.min.js"
          /* , "https://storage.googleapis.com/TU-BUCKET/three/three.min.js" */ ] },
    { h: "sha384-FassWWYNEPQsuRQm+59KIMcDetEc30bNyE9yfx16Ok8lvoowyH81LtrPmLWltJMh",
      u: ["https://unpkg.com/three@0.147.0/examples/js/loaders/GLTFLoader.js",
          "https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/loaders/GLTFLoader.js"
          /* , "https://storage.googleapis.com/TU-BUCKET/three/GLTFLoader.js" */ ] },
    { h: "sha384-I0DMsfimAPIqWT8lF+oA997gRgdUi3jhidoTq3fN0zmn35smXZukD01FLnsPRU9i",
      u: ["https://unpkg.com/three@0.147.0/examples/js/controls/OrbitControls.js",
          "https://cdn.jsdelivr.net/npm/three@0.147.0/examples/js/controls/OrbitControls.js"
          /* , "https://storage.googleapis.com/TU-BUCKET/three/OrbitControls.js" */ ] }
  ];

  function aviso(t){
    var e = document.getElementById("mnxv-carga");
    if(e) e.textContent = t;
  }

  /* En cadena y en orden: GLTFLoader y OrbitControls necesitan que THREE ya
     exista, asi que no se pueden pedir en paralelo. */
  function uno(i, j){
    if(i >= LIB.length){ arrancar(); return; }
    if(j >= LIB[i].u.length){ aviso("No se pudo cargar three.js"); return; }
    var s = document.createElement("script");
    s.src = LIB[i].u[j];
    s.integrity = LIB[i].h;
    s.crossOrigin = "anonymous";
    s.async = false;
    s.setAttribute("data-cfasync", "false");
    s.onload  = function(){ uno(i + 1, 0); };
    s.onerror = function(){ s.parentNode && s.parentNode.removeChild(s); uno(i, j + 1); };
    document.head.appendChild(s);
  }
  uno(0, 0);

  function arrancar(){

  var doc = document.getElementById('mnxv');
  var carga = document.getElementById('mnxv-carga');
  if(!doc || !window.THREE) return;
  var URL_GLB = doc.dataset.glb;
  var ESCALA = 6;   /* los clips estan escritos a 1/6 de la velocidad real */

  var CLIPS = [
    {id:'Monarca_Vuelo_Crucero',   n:'Vuelo de crucero', hz:10.0,
     pie:'Batido de crucero a 10 Hz. La amplitud es de 115° y el abdomen oscila en '+
         'antifase con las alas para compensar el momento de cabeceo.'},
    {id:'Monarca_Planeo',          n:'Planeo', hz:0,
     pie:'El modo que hace posible la migración: alas casi estáticas en un diedro '+
         'de 13°, ascendiendo en térmicas a unos 18 km/h.'},
    {id:'Monarca_Despegue_InSitu', n:'Despegue', hz:11.25,
     pie:'Despegue con clap-and-fling. Las patas empujan durante el primer 30 % del '+
         'ciclo: ese impulso, y no la sustentación, es lo que la separa del suelo.'}
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

  var clave  = new THREE.DirectionalLight(0xffdeb2, 4.2);
  var contra = new THREE.DirectionalLight(0xffb44f, 3.4);
  var relleno= new THREE.DirectionalLight(0x7080ff, 0.70);
  var amb    = new THREE.AmbientLight(0x2a2740, 0.55);
  clave.position.set(-3.2,4.6,4.4);
  contra.position.set(2.9,2.4,-3.8);
  relleno.position.set(3.6,-1.6,2.6);
  scene.add(clave, contra, relleno, amb);
  var chiaro = true;

  var mixer=null, root=null, acciones={}, actual=null, fondo=null;
  var reloj = new THREE.Clock();
  var play = true, arrastrando = false, idx = 0;

  function enc(){
    camera.aspect = wrap.clientWidth / Math.max(wrap.clientHeight,1);
    camera.updateProjectionMatrix();
    renderer.setSize(wrap.clientWidth, wrap.clientHeight, false);
  }
  window.addEventListener('resize', enc);

  new THREE.GLTFLoader().load(URL_GLB, function(gltf){
    root = gltf.scene; scene.add(root);
    var quitar = [];
    root.traverse(function(o){
      if(o.isLight) quitar.push(o);
      if(o.name === 'Fondo_Cupula'){
        fondo = o;
        var fm = Array.isArray(o.material)? o.material : [o.material];
        fm.forEach(function(m){ if(m && 'emissiveIntensity' in m) m.emissiveIntensity = 0.78; });
      }
      if(o.isMesh){
        o.frustumCulled = false;
        var mm = Array.isArray(o.material)? o.material : [o.material];
        mm.forEach(function(m){ if(m) m.side = THREE.DoubleSide; });
      }
    });
    quitar.forEach(function(l){ if(l.parent) l.parent.remove(l); });

    var caja = new THREE.Box3();
    root.traverse(function(o){
      if(o.isMesh && o !== fondo && o.name.indexOf('Sphere')<0){
        o.geometry.computeBoundingBox();
        caja.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));
      }
    });
    var c = caja.getCenter(new THREE.Vector3());
    var t = caja.getSize(new THREE.Vector3());
    var radio = 0.5*Math.sqrt(t.x*t.x + t.y*t.y + t.z*t.z);
    controls.target.copy(c);
    var d = radio / Math.tan(THREE.MathUtils.degToRad(camera.fov*0.5)) * 1.95;
    camera.position.set(c.x + d*0.58, c.y + d*0.26, c.z + d*0.77);
    controls.minDistance = radio*1.2; controls.maxDistance = radio*14;
    controls.update();

    mixer = new THREE.AnimationMixer(root);
    gltf.animations.forEach(function(cl){ acciones[cl.name] = mixer.clipAction(cl); });
    botones(); poner(0);
    carga.classList.add('fuera');
    enc();
  }, undefined, function(){
    carga.textContent = 'No se pudo cargar el modelo 3D';
  });

  var cont = document.getElementById('mnxv-clips'), bts = [];
  function botones(){
    CLIPS.forEach(function(c,i){
      if(!acciones[c.id]) return;
      var b = document.createElement('button');
      b.className='mnxv-b'; b.type='button'; b.textContent=c.n;
      b.setAttribute('aria-pressed','false');
      b.onclick = function(){ poner(i); };
      cont.appendChild(b); bts.push(b);
    });
  }
  function poner(i){
    var a = acciones[CLIPS[i].id]; if(!a) return;
    if(actual && actual !== a) actual.fadeOut(0.18);
    a.reset(); a.setLoop(THREE.LoopRepeat, Infinity); a.fadeIn(0.18).play();
    actual = a; idx = i;
    bts.forEach(function(b,k){ b.setAttribute('aria-pressed', k===i?'true':'false'); });
    document.getElementById('mnxv-pie').textContent = CLIPS[i].pie;
    vel();
  }

  var sv = document.getElementById('mnxv-vel'), lv = document.getElementById('mnxv-velval');
  function vel(){
    var f = sv.value/100;
    if(mixer) mixer.timeScale = play ? f*ESCALA : 0;
    var hz = CLIPS[idx].hz;
    lv.textContent = hz ? ('×'+f.toFixed(2)+'  '+(hz*f).toFixed(1)+' Hz')
                        : ('×'+f.toFixed(2));
  }
  sv.addEventListener('input', vel);

  var bp = document.getElementById('mnxv-play');
  bp.onclick = function(){
    play = !play; bp.textContent = play ? 'Pausa' : 'Reproducir';
    bp.setAttribute('aria-pressed', play?'true':'false'); vel();
  };

  var st = document.getElementById('mnxv-t');
  st.addEventListener('input', function(){
    if(!actual) return;
    arrastrando = true;
    actual.time = actual.getClip().duration * (st.value/1000);
    mixer.update(0);
  });
  st.addEventListener('change', function(){ arrastrando = false; });

  var bg = document.getElementById('mnxv-giro');
  bg.onclick = function(){
    controls.autoRotate = !controls.autoRotate;
    bg.setAttribute('aria-pressed', controls.autoRotate?'true':'false');
  };

  var bl = document.getElementById('mnxv-luz');
  bl.onclick = function(){
    chiaro = !chiaro;
    if(chiaro){
      clave.intensity=4.2; clave.color.setHex(0xffdeb2);
      contra.intensity=3.4; relleno.intensity=0.70;
      amb.intensity=0.55; amb.color.setHex(0x2a2740);
      renderer.toneMappingExposure = 1.0;
    }else{
      clave.intensity=2.6; clave.color.setHex(0xffffff);
      contra.intensity=1.9; relleno.intensity=1.6;
      amb.intensity=1.8; amb.color.setHex(0x9aa0b5);
      renderer.toneMappingExposure = 1.0;
    }
    bl.textContent = chiaro ? 'Claroscuro' : 'Neutra';
    bl.setAttribute('aria-pressed', chiaro?'true':'false');
  };

  var hud = document.getElementById('mnxv-hud');
  function bucle(){
    requestAnimationFrame(bucle);
    var dt = reloj.getDelta();
    if(mixer && !arrastrando) mixer.update(dt);
    if(actual && !arrastrando){
      var dur = actual.getClip().duration;
      st.value = Math.round(1000 * ((actual.time % dur) / dur));
      hud.innerHTML = '<b>'+CLIPS[idx].n+'</b> &nbsp; '+
                      ((actual.time/ESCALA)*1000).toFixed(0)+' ms';
    }
    controls.update();
    renderer.render(scene, camera);
  }
  enc(); vel(); bucle();
  }
})();