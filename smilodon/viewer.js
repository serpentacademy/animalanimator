// Smilodon viewer. ES module; serves multiple instances with isolated styles.
const CDN = new URL('./vendor/',import.meta.url).href;
const dependencies = Promise.all([
  import(`${CDN}three.module.js`),
  import(`${CDN}GLTFLoader.js`),
  import(`${CDN}OrbitControls.js`),
]);

class SmilodonViewer extends HTMLElement {
  connectedCallback() {
    if (this.started) return;
    this.started = true;
    this.abort = new AbortController();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;contain:content;color:#eee8dc;font:14px/1.4 system-ui,sans-serif;background:#0c1015;border:1px solid #29313a;border-radius:20px;overflow:hidden}
        *{box-sizing:border-box}.stage{height:clamp(360px,64vw,690px);position:relative;background:radial-gradient(ellipse at 50% 65%,#26313b,#0c1015 72%)}
        canvas{display:block;width:100%;height:100%;touch-action:none}.heading{position:absolute;top:28px;left:30px;pointer-events:none}.eyebrow{color:#bd9d6b;font-size:10px;letter-spacing:.25em;text-transform:uppercase}.heading h2{font-family:Georgia,serif;font-size:clamp(28px,5vw,52px);font-weight:400;margin:5px 0}.heading p{margin:0;color:#929da8;font-size:12px}
        .status{position:absolute;left:30px;bottom:22px;color:#a9b3bc;font-size:12px;max-width:80%}.tools{display:flex;gap:10px;padding:18px 24px;border-top:1px solid #27303a;flex-wrap:wrap;align-items:center;background:#11171e}
        button,select{font:inherit;color:#d5dce1;border:1px solid #38434e;background:#1b252f;border-radius:8px;padding:9px 14px;cursor:pointer}button[aria-pressed=true]{background:#c5a574;color:#101419;border-color:#c5a574}button:hover,select:hover{border-color:#c5a574}button:focus-visible,select:focus-visible,input:focus-visible{outline:2px solid #eed6ad;outline-offset:3px}button:disabled{opacity:.4;cursor:wait}
        .divider{flex:1}.label{color:#98a5b1;font-size:12px}.timeline{width:100%;accent-color:#c5a574;cursor:pointer}.credits{padding:0 24px 16px;color:#6e7c88;font-size:11px;background:#11171e}.error{color:#ffc19d}
        @media(max-width:560px){.heading{left:20px;top:20px}.tools{padding:14px;gap:7px}button,select{padding:8px 10px;font-size:12px}.credits{padding-left:14px}.divider{display:none}.status{left:20px}}
      </style>
      <div class="stage"><div class="heading"><div class="eyebrow">Pleistocene • Motion study</div><h2>Smilodon</h2><p>Weight. Contact. Intent.</p></div><div class="status" role="status" aria-live="polite">Loading the specimen…</div></div>
      <div class="tools" aria-label="Animation controls">
        <button data-clip="Idle" disabled aria-pressed="false">Idle</button><button data-clip="Walk" disabled aria-pressed="true">Walk</button><button data-clip="Run" disabled aria-pressed="false">Run</button><button data-clip="Bite" disabled aria-pressed="false">Bite</button>
        <span class="divider"></span><button id="pause" disabled>Pause</button><label class="label">Speed <select id="speed"><option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="1.5">1.5×</option></select></label><button id="skull" aria-pressed="true">Skull</button><button id="reset">Reset view</button>
        <input class="timeline" id="timeline" type="range" min="0" max="1000" value="0" aria-label="Animation position">
      </div><div class="credits">Drag to orbit · Scroll to zoom · Research-informed artistic reconstruction</div>`;
    this.init().catch(e => {
      if (!this.isConnected) return;
      const status = this.shadowRoot.querySelector('.status');
      status.classList.add('error');
      status.textContent = `Unable to load viewer. ${e.message}. Check the model URL and cross-origin access.`;
      console.error('Smilodon viewer:', e);
    });
  }

  async init() {
    const [THREE, { GLTFLoader }, { OrbitControls }] = await dependencies;
    if (!this.isConnected) return;
    const $ = s => this.shadowRoot.querySelector(s);
    const stage = $('.stage');
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer = renderer;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.domElement.setAttribute('aria-label', 'Interactive animated Smilodon model');
    stage.prepend(renderer.domElement);
    const scene = new THREE.Scene(); this.scene = scene;
    const camera = new THREE.PerspectiveCamera(34, 1, .01, 30);
    const controls = new OrbitControls(camera, renderer.domElement); this.controls = controls;
    controls.enableDamping = true; controls.minDistance = 1.1; controls.maxDistance = 3.6;
    controls.maxPolarAngle = Math.PI * .49; controls.enablePan = false;
    const reset = () => { camera.position.set(...(stage.clientWidth<600?[2.45,.82,1.85]:[1.13,.76,1.82])); controls.target.set(0,.32,0); controls.update(); };
    reset();
    scene.add(new THREE.HemisphereLight(0xc5d9eb,0x242329,1.7));
    const key = new THREE.DirectionalLight(0xffdfb1,3.1); key.position.set(1,2,2); key.castShadow = true;
    key.shadow.mapSize.set(2048,2048); Object.assign(key.shadow.camera,{left:-1.1,right:1.1,top:1.1,bottom:-1.1,near:.1,far:6}); key.shadow.bias=-.00015;key.shadow.normalBias=.001;key.shadow.radius=5;key.shadow.blurSamples=8;scene.add(key);
    const rim = new THREE.DirectionalLight(0x7ab5eb,2.5);rim.position.set(-1,1,-1);scene.add(rim);
    const fill = new THREE.DirectionalLight(0xffefcf,.45);fill.position.set(1,.4,-.3);scene.add(fill);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(8,8),new THREE.ShadowMaterial({color:0x000000,opacity:.45}));ground.rotation.x=-Math.PI/2;ground.position.y=-.006;ground.receiveShadow=true;scene.add(ground);
    const ring = new THREE.Mesh(new THREE.RingGeometry(.69,.692,128),new THREE.MeshBasicMaterial({color:0xb49261,transparent:true,opacity:.24,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=-.004;scene.add(ring);
    // Sparse dust, with motion disabled when reduced motion is requested.
    const points = new Float32Array(90*3);
    for(let i=0;i<90;i++){points[i*3]=(Math.random()-.5)*2.8;points[i*3+1]=Math.random()*1.5;points[i*3+2]=(Math.random()-.5)*1.6;}
    const dustGeo=new THREE.BufferGeometry();dustGeo.setAttribute('position',new THREE.BufferAttribute(points,3));
    const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xd9bb84,size:.0025,transparent:true,opacity:.3,depthWrite:false}));scene.add(dust);
    const resize=()=>{const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();if(!this.didInitialResize){reset();this.didInitialResize=true;}};
    this.resizeObserver=new ResizeObserver(resize);this.resizeObserver.observe(stage);resize();
    const src=this.getAttribute('src') || new URL('./smilodon.glb',import.meta.url).href;
    const gltf=await new GLTFLoader().loadAsync(src, event=>{if(event.total)$('.status').textContent=`Loading specimen · ${Math.round(event.loaded/event.total*100)}%`;});
    if(!this.isConnected){gltf.scene.traverse(o=>{o.geometry?.dispose();});return;}
    const model=gltf.scene;scene.add(model);this.model=model;
    model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
    const mixer=new THREE.AnimationMixer(model);this.mixer=mixer;
    const clips=new Map(gltf.animations.map(c=>[c.name,c]));
    for(const name of ['Idle','Walk','Run','Bite'])if(!clips.has(name))throw new Error(`Missing ${name} animation`);
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    let paused=reduced,active,name='Walk',speed=1,visible=true;
    const play = n => {
      if(paused)mixer.stopAllAction();
      const next=mixer.clipAction(clips.get(n));
      if(active && active!==next)active.fadeOut(.10);
      next.reset().setEffectiveWeight(1).setEffectiveTimeScale(1);
      next.setLoop(n==='Bite'?THREE.LoopOnce:THREE.LoopRepeat,Infinity);next.clampWhenFinished=n==='Bite';
      next.play();if(paused)next.stopFading().setEffectiveWeight(1);else next.fadeIn(.10);mixer.update(0);active=next;name=n;
      this.shadowRoot.querySelectorAll('[data-clip]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.clip===n)));
      $('.status').textContent=n==='Bite'?'Brace → open → bite → recover':n==='Run'?'Fast gallop · 2 strides / second':`${n} cycle · Drag to explore`;
    };
    play('Run');
    const on=(node,type,fn)=>node.addEventListener(type,fn,{signal:this.abort.signal});
    this.shadowRoot.querySelectorAll('[data-clip]').forEach(b=>{b.disabled=false;on(b,'click',()=>play(b.dataset.clip));});
    $('#pause').disabled=false;$('#pause').textContent=paused?'Play':'Pause';
    on($('#pause'),'click',()=>{paused=!paused;$('#pause').textContent=paused?'Play':'Pause';});
    on($('#speed'),'change',e=>speed=Number(e.target.value));
    on($('#timeline'),'input',e=>{paused=true;$('#pause').textContent='Play';mixer.stopAllAction();active.reset().play().stopFading().setEffectiveWeight(1);active.paused=false;active.time=Number(e.target.value)/1000*clips.get(name).duration;mixer.update(0);});
    on($('#skull'),'click',()=>{const show=$('#skull').getAttribute('aria-pressed')!=='true';model.traverse(o=>{if(o.isMesh&&o.name.includes('Smilodon_Skull'))o.visible=show;});$('#skull').setAttribute('aria-pressed',String(show));});
    on($('#reset'),'click',reset);
    on(document,'visibilitychange',()=>visible=!document.hidden);
    this.intersection=new IntersectionObserver(entries=>{this.inView=entries[0].isIntersecting;});this.intersection.observe(this);this.inView=true;
    let previous=performance.now();
    renderer.setAnimationLoop(now=>{
      const dt=Math.min((now-previous)/1000,.05);previous=now;
      if(!visible||!this.inView)return;
      if(!paused){mixer.update(dt*speed);$('#timeline').value=String(active.time/clips.get(name).duration*1000);}
      if(!reduced&&!paused)dust.rotation.y+=dt*.013;
      controls.update();renderer.render(scene,camera);
    });
    this.dataset.ready='true';
    this.dispatchEvent(new CustomEvent('smilodon-ready',{detail:{animations:[...clips.keys()]}}));
  }

  disconnectedCallback() {
    this.abort?.abort();this.resizeObserver?.disconnect();this.intersection?.disconnect();
    this.renderer?.setAnimationLoop(null);this.controls?.dispose();this.mixer?.stopAllAction();
    const textures=new Set();
    this.scene?.traverse(o=>{o.geometry?.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material]))if(m){Object.values(m).forEach(v=>{if(v?.isTexture)textures.add(v);});m.dispose();}});
    textures.forEach(t=>t.dispose());this.renderer?.dispose();
  }
}
if(!customElements.get('smilodon-viewer'))customElements.define('smilodon-viewer',SmilodonViewer);
