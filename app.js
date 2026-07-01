/* ============ VVV — Elite Athletic Intelligence ============ */

/* ---------- STORAGE ---------- */
const DB = {
  load(k){ try{ return JSON.parse(localStorage.getItem('vvv_'+k)); }catch(e){ return null; } },
  save(k,v){ localStorage.setItem('vvv_'+k, JSON.stringify(v)); }
};

/* ---------- STATE ---------- */
let P = DB.load('profile') || { setupDone:false };
let SESS = DB.load('sessions') || [];
let MSESS = DB.load('muscu_sessions') || [];
let CUSTOM = DB.load('custom_progs') || [];
let PLAN = DB.load('run_plan') || null;
let GOALS = DB.load('daily_goals') || {};
let AGENDA = DB.load('agenda') || [];
let XP = DB.load('xp') || { total:0, level:1, name:'Recrue', pastGoalXP:0 };
let RECORDS = DB.load('records') || [];
let PREFS = DB.load('prefs') || {};
let WEIGHTLOG = DB.load('weightlog') || [];
let TRACKER = DB.load('tracker') || null;
let SESSLOG = DB.load('sesslog') || [];
let MUSCU_PR = DB.load('muscu_pr') || {};

function saveAll(){
  DB.save('profile',P); DB.save('sessions',SESS); DB.save('muscu_sessions',MSESS);
  DB.save('custom_progs',CUSTOM); DB.save('run_plan',PLAN); DB.save('daily_goals',GOALS);
  DB.save('agenda',AGENDA); DB.save('xp',XP);
  DB.save('records',RECORDS); DB.save('prefs',PREFS); DB.save('weightlog',WEIGHTLOG);
  DB.save('tracker',TRACKER); DB.save('sesslog',SESSLOG);
}

/* ============ INTERNATIONALISATION (FR / EN / AR) ============ */
const I18N={
  fr:{
    nav_home:'Accueil',nav_sport:'Sport',nav_stats:'Stats',nav_outils:'Outils',nav_profil:'Profil',
    home:'Accueil',sport:'Sport',stats:'Statistiques',outils:'Outils',profil:'Profil',
    sub_sport:'Course & Musculation',sub_stats:'Tes données réelles',sub_outils:'Calculs & timers',
    save:'Sauver',cancel:'Annuler',add:'Ajouter',edit:'Modifier',delete:'Supprimer',close:'Fermer',validate:'Valider',back:'Retour',seeAll:'Voir tout',
    running:'Course',muscu:'Musculation',coachIA:'Coach IA',myPlan:'Plan personnel',
    perfHistory:'Historique des performances',editInfos:'Modifier mes informations',
    objective:'Objectif',appearance:'Apparence',accentColor:'Couleur d\u2019accent',language:'Langue',
    notifsApp:'Notifications & app',trainReminders:'Rappels d\u2019entraînement',sounds:'Sons & vibrations',units:'Unités métriques (km)',
    dataPrivacy:'Données & confidentialité',exportData:'Exporter mes données (JSON)',importData:'Importer des données',resetApp:'Réinitialiser l\u2019application',
    photo:'Photo',bio:'Biographie',addPhoto:'Ajouter une photo',changePhoto:'Changer',removePhoto:'Supprimer',
    height:'Taille',weight:'Poids',age:'Âge',level:'Niveau',logout:'Déconnexion',
    levelGuide:'Comment choisir mon niveau ?',xpProgress:'Progression XP',coach:'Coach',
    todayGoals:'Objectifs du jour',weekLoad:'Charge de la semaine',sessions:'séances',form:'forme'
  },
  en:{
    nav_home:'Home',nav_sport:'Sport',nav_stats:'Stats',nav_outils:'Tools',nav_profil:'Profile',
    home:'Home',sport:'Sport',stats:'Statistics',outils:'Tools',profil:'Profile',
    sub_sport:'Running & Strength',sub_stats:'Your real data',sub_outils:'Calculators & timers',
    save:'Save',cancel:'Cancel',add:'Add',edit:'Edit',delete:'Delete',close:'Close',validate:'Confirm',back:'Back',seeAll:'See all',
    running:'Running',muscu:'Strength',coachIA:'AI Coach',myPlan:'Custom plan',
    perfHistory:'Performance history',editInfos:'Edit my information',
    objective:'Goal',appearance:'Appearance',accentColor:'Accent color',language:'Language',
    notifsApp:'Notifications & app',trainReminders:'Training reminders',sounds:'Sounds & vibration',units:'Metric units (km)',
    dataPrivacy:'Data & privacy',exportData:'Export my data (JSON)',importData:'Import data',resetApp:'Reset the app',
    photo:'Photo',bio:'Biography',addPhoto:'Add a photo',changePhoto:'Change',removePhoto:'Remove',
    height:'Height',weight:'Weight',age:'Age',level:'Level',logout:'Log out',
    levelGuide:'How to choose my level?',xpProgress:'XP progress',coach:'Coach',
    todayGoals:'Today\u2019s goals',weekLoad:'Weekly load',sessions:'sessions',form:'form'
  },
  ar:{
    nav_home:'الرئيسية',nav_sport:'رياضة',nav_stats:'إحصائيات',nav_outils:'أدوات',nav_profil:'الملف',
    home:'الرئيسية',sport:'الرياضة',stats:'الإحصائيات',outils:'الأدوات',profil:'الملف الشخصي',
    sub_sport:'الجري وكمال الأجسام',sub_stats:'بياناتك الحقيقية',sub_outils:'حاسبات ومؤقتات',
    save:'حفظ',cancel:'إلغاء',add:'إضافة',edit:'تعديل',delete:'حذف',close:'إغلاق',validate:'تأكيد',back:'رجوع',seeAll:'عرض الكل',
    running:'الجري',muscu:'كمال الأجسام',coachIA:'مدرب ذكي',myPlan:'خطة شخصية',
    perfHistory:'سجل الإنجازات',editInfos:'تعديل معلوماتي',
    objective:'الهدف',appearance:'المظهر',accentColor:'لون التمييز',language:'اللغة',
    notifsApp:'الإشعارات والتطبيق',trainReminders:'تذكيرات التدريب',sounds:'الأصوات والاهتزاز',units:'وحدات مترية (كم)',
    dataPrivacy:'البيانات والخصوصية',exportData:'تصدير بياناتي (JSON)',importData:'استيراد البيانات',resetApp:'إعادة ضبط التطبيق',
    photo:'الصورة',bio:'نبذة',addPhoto:'إضافة صورة',changePhoto:'تغيير',removePhoto:'حذف',
    height:'الطول',weight:'الوزن',age:'العمر',level:'المستوى',logout:'تسجيل الخروج',
    levelGuide:'كيف أختار مستواي؟',xpProgress:'تقدم النقاط',coach:'المدرب',
    todayGoals:'أهداف اليوم',weekLoad:'حمل الأسبوع',sessions:'حصص',form:'اللياقة'
  }
};
function curLang(){ return (P&&P.lang)||'fr'; }
function t(key){ const l=curLang(); return (I18N[l]&&I18N[l][key])||I18N.fr[key]||key; }
const LANGS=[['fr','🇫🇷','Français'],['en','🇬🇧','English'],['ar','🇩🇿','العربية']];
function setLang(l){
  P.lang=l; saveAll();
  document.documentElement.lang=l;
  document.documentElement.dir=(l==='ar')?'rtl':'ltr';
  applyNavLabels();
  // re-render la vue active
  const active=document.querySelector('.nb.on'); if(active) nav(active.dataset.s);
  toast('✓');
}
function applyNavLabels(){
  document.querySelectorAll('.nb').forEach(b=>{ const s=b.dataset.s; const sp=b.querySelector('span'); if(sp) sp.textContent=t('nav_'+s); });
}
/* ---------- RECORDS personnels ---------- */
function personalRecords(){
  // Combine les records manuels + ceux du profil (rétrocompat)
  const base=[
    {dist:'1500m',meters:1500,time:P.pb1500||''},
    {dist:'3000m',meters:3000,time:P.pb3k||''},
    {dist:'5000m',meters:5000,time:P.pb5k||''},
    {dist:'10km',meters:10000,time:P.pb10k||''}
  ];
  // Pour chaque distance, garde le meilleur entre profil et RECORDS manuels
  const map={};
  base.forEach(b=>{ if(b.time) map[b.dist]=b; });
  RECORDS.forEach(r=>{
    const cur=map[r.dist];
    if(!cur || parseTime(r.time)<parseTime(cur.time)) map[r.dist]={...r};
  });
  // Ajoute les distances custom de RECORDS non présentes
  RECORDS.forEach(r=>{ if(!map[r.dist]) map[r.dist]={...r}; });
  return Object.values(map);
}
function bestRecord(){
  const recs=personalRecords().filter(r=>r.time);
  if(!recs.length) return null;
  // meilleur = VDOT le plus élevé
  let best=null,bv=0;
  recs.forEach(r=>{ const v=vdotFromRace(r.meters||5000,parseTime(r.time)); if(v>bv){bv=v;best=r;} });
  return best;
}

/* ---------- MATH (Daniels) ---------- */
function parseTime(s){
  if(!s) return 0;
  const p = String(s).trim().split(':').map(Number);
  if(p.length===3) return p[0]*3600+p[1]*60+p[2];
  if(p.length===2) return p[0]*60+p[1];
  return p[0]||0;
}
function fmtTime(sec){
  sec=Math.round(sec);
  const h=Math.floor(sec/3600), m=Math.floor((sec%3600)/60), s=sec%60;
  if(h>0) return h+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  return m+':'+String(s).padStart(2,'0');
}
function vdotFromRace(d,t){
  const tm=t/60, v=d/tm;
  const vo2=-4.60+0.182258*v+0.000104*v*v;
  const pct=0.8+0.1894393*Math.exp(-0.012778*tm)+0.2989558*Math.exp(-0.1932605*tm);
  return vo2/pct;
}
function vVO2max(vdot){
  let v=300;
  for(let i=0;i<100;i++){
    const f=-4.60+0.182258*v+0.000104*v*v-vdot;
    v-=f/(0.182258+0.000208*v);
  }
  return v; // m/min
}
function predictTime(vdot,dist){
  let lo=30,hi=30000;
  for(let i=0;i<80;i++){
    const mid=(lo+hi)/2, tm=mid/60, vel=dist/tm;
    const vo2n=-4.60+0.182258*vel+0.000104*vel*vel;
    const pct=0.8+0.1894393*Math.exp(-0.012778*tm)+0.2989558*Math.exp(-0.1932605*tm);
    if(vo2n/pct<vdot) hi=mid; else lo=mid;
  }
  return Math.round((lo+hi)/2);
}
// pace sec/km from vVO2max % -> returns sec per km
function paceFromPct(vdot,pct){
  const v=vVO2max(vdot)*pct; // m/min
  return 60000/v; // sec per km
}
function spkToStr(spk){
  const m=Math.floor(spk/60), s=Math.round(spk%60);
  return m+':'+String(s).padStart(2,'0');
}
function getUserVDOT(){
  const fromRec=(typeof RECORDS!=='undefined')?computeVDOTfromRecords():computeVDOT();
  if(fromRec) return fromRec;
  return P.vdot||computeVDOT();
}
function computeVDOT(){
  const races=[];
  if(P.t5k) races.push([5000,parseTime(P.t5k)]);
  if(P.t3k) races.push([3000,parseTime(P.t3k)]);
  if(P.t1500) races.push([1500,parseTime(P.t1500)]);
  if(P.t10k) races.push([10000,parseTime(P.t10k)]);
  let best=0;
  races.forEach(r=>{ if(r[1]>0){ const v=vdotFromRace(r[0],r[1]); if(v>best) best=v; }});
  return best>0?Math.round(best*10)/10:0;
}

/* ---------- XP — SYSTÈME DÉRIVÉ (recalculé depuis les données réelles) ---------- */
/* Le total XP n'est JAMAIS stocké de façon cumulative : il est toujours
   recalculé depuis les sources réelles. Cocher/décocher un objectif met donc
   automatiquement à jour le total, ce qui corrige définitivement le bug. */
const LEVEL_NAMES=['Recrue','Coureur','Coureur+','Confirmé','Confirmé+','Athlète','Athlète+','Compétiteur','Expert','Élite','Maître','Champion','Légende','Mythique'];
const XP_RULES={ perKm:8, perRunSession:30, perMuscuSession:50, perMuscuSet:5, perMinTraining:0.5, perGoal:10, allGoalsBonus:50, perStreakDay:6, perRecord:40 };

function computeXPTotal(){
  let xp=0;
  // Distance
  xp += Math.round(totalKm()*XP_RULES.perKm);
  // Séances
  xp += SESS.length*XP_RULES.perRunSession;
  xp += MSESS.length*XP_RULES.perMuscuSession;
  // Séries muscu
  xp += MSESS.reduce((a,s)=>a+(s.sets||0),0)*XP_RULES.perMuscuSet;
  // Durée totale (running + muscu, en minutes)
  const totMin = SESS.reduce((a,s)=>a+(s.duration||0),0) + MSESS.reduce((a,s)=>a+(s.duration||0)/60,0);
  xp += Math.round(totMin*XP_RULES.perMinTraining);
  // Objectifs cochés AUJOURD'HUI (recalculé en direct → fix toggle)
  if(GOALS.list){
    const checked=GOALS.list.filter(g=>g.done).length;
    xp += checked*XP_RULES.perGoal;
    if(GOALS.list.length && GOALS.list.every(g=>g.done)) xp += XP_RULES.allGoalsBonus;
  }
  // Historique des objectifs des jours passés (figé)
  xp += (XP.pastGoalXP||0);
  // Régularité (meilleure série)
  xp += bestStreak()*XP_RULES.perStreakDay;
  // Records personnels renseignés
  xp += personalRecords().filter(r=>r.time).length*XP_RULES.perRecord;
  return Math.max(0,Math.round(xp));
}
function levelFromTotal(total){
  let lvl=1, need=200, acc=0;
  while(total>=acc+need){ acc+=need; lvl++; need=Math.round(need*1.22); }
  return { level:lvl, base:acc, next:acc+need, span:need, inLvl:total-acc };
}
function levelName(lvl){ return LEVEL_NAMES[Math.min(lvl-1,LEVEL_NAMES.length-1)]; }
/* Recalcule l'état XP, détecte une montée de niveau, déclenche animation */
function refreshXP(opts){
  const total=computeXPTotal();
  const info=levelFromTotal(total);
  const prevLevel=XP.level||1;
  XP.total=total; XP.level=info.level; XP.name=levelName(info.level);
  XP.next=info.next; XP.base=info.base; XP.span=info.span; XP.inLvl=info.inLvl;
  DB.save('xp',XP);
  if(opts&&opts.animate&&info.level>prevLevel){ levelUpAnimation(info.level); }
  return XP;
}
function xpProgress(){
  refreshXP();
  return { pct:Math.min(100,Math.round(XP.inLvl/XP.span*100)), inLvl:XP.inLvl, span:XP.span, next:XP.next };
}
/* Compat : addXP devient un simple déclencheur de recalcul + feedback */
function addXP(amount,reason){
  refreshXP({animate:true});
  sfx('xp');
  if(reason) toast('+'+amount+' XP · '+reason);
}
function bestStreak(){
  const set=new Set([...SESS,...MSESS].map(s=>s.date));
  if(!set.size) return 0;
  const dates=[...set].sort();
  let best=1,cur=1;
  for(let i=1;i<dates.length;i++){
    const prev=new Date(dates[i-1]), d=new Date(dates[i]);
    if(daysBetween(prev,d)===1){ cur++; best=Math.max(best,cur); } else cur=1;
  }
  return Math.max(best,streakDays());
}
/* ---------- LEVEL UP ANIMATION ---------- */
function levelUpAnimation(level){
  burst(); sfx('medal');
  const ov=document.createElement('div');
  ov.style.cssText='position:fixed;inset:0;z-index:13500;display:flex;align-items:center;justify-content:center;background:rgba(5,7,10,.86);backdrop-filter:blur(8px);animation:fade .3s';
  ov.innerHTML='<div style="text-align:center;animation:popIn .6s cubic-bezier(.34,1.56,.64,1)">'+
    '<div style="font-size:14px;letter-spacing:3px;color:var(--e);font-weight:700;font-family:Manrope">NIVEAU SUPÉRIEUR</div>'+
    '<div style="font-size:96px;margin:6px 0;filter:drop-shadow(0 0 20px var(--e))">⭐</div>'+
    '<div class="man" style="font-weight:800;font-size:54px;background:linear-gradient(135deg,var(--e),#9FD8FF);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent">Niv. '+level+'</div>'+
    '<div class="man" style="font-weight:700;font-size:22px;margin-top:4px">'+levelName(level)+'</div>'+
    '<div style="color:var(--muted);font-size:13px;margin-top:14px">Touche pour continuer</div></div>';
  ov.onclick=()=>ov.remove();
  document.body.appendChild(ov);
  setTimeout(()=>{ if(ov.parentNode)ov.remove(); },4000);
}

/* ---------- UTIL ---------- */
const $=s=>document.querySelector(s);
const $$=s=>document.querySelectorAll(s);
function todayKey(){ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function dateKey(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function daysBetween(a,b){ return Math.round((b-a)/86400000); }
function toast(m){ const t=$('#toast'); t.textContent=m; t.classList.add('on'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('on'),2200); }

/* ============ SONS PREMIUM (Web Audio, synthétisés, discrets) ============ */
let _actx=null;
function audioCtx(){ if(!_actx){ try{ _actx=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } } if(_actx.state==='suspended') _actx.resume(); return _actx; }
function soundsOn(){ return P.sounds!==false; }
// Débloque l'audio au premier geste utilisateur (politique navigateur)
document.addEventListener('pointerdown',function unlockAudio(){ try{ audioCtx(); }catch(e){} document.removeEventListener('pointerdown',unlockAudio); },{once:true});
// note: fréquence, durée, type, volume, délai, glide vers
function _note(freq,dur,type,vol,delay,toFreq){
  const ctx=audioCtx(); if(!ctx) return;
  const t0=ctx.currentTime+(delay||0);
  const o=ctx.createOscillator(), g=ctx.createGain();
  o.type=type||'sine'; o.frequency.setValueAtTime(freq,t0);
  if(toFreq) o.frequency.exponentialRampToValueAtTime(toFreq,t0+dur);
  g.gain.setValueAtTime(0,t0);
  g.gain.linearRampToValueAtTime(vol||0.18,t0+0.012);
  g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(t0); o.stop(t0+dur+0.02);
}
function sfx(name){
  if(!soundsOn()) return;
  switch(name){
    case 'tick': _note(880,0.05,'square',0.06); break;
    case 'start': _note(523,0.12,'sine',0.15); _note(784,0.16,'sine',0.15,0.1); break;
    case 'stop': _note(523,0.14,'sine',0.13); _note(392,0.2,'sine',0.13,0.1); break;
    case 'goal': _note(659,0.1,'sine',0.16); _note(880,0.18,'sine',0.16,0.09); break;
    case 'xp': _note(1046,0.08,'triangle',0.13); _note(1318,0.12,'triangle',0.13,0.07); break;
    case 'medal': _note(659,0.12,'sine',0.16); _note(880,0.12,'sine',0.16,0.1); _note(1318,0.25,'sine',0.18,0.2); break;
    case 'finish': [523,659,784,1046].forEach((f,i)=>_note(f,0.22,'sine',0.16,i*0.11)); break;
    case 'timer': for(let i=0;i<3;i++){ _note(1046,0.16,'sine',0.2,i*0.28); } break;
    case 'notif': _note(880,0.13,'sine',0.18); _note(1174,0.22,'sine',0.18,0.12); break;
    case 'tap': _note(660,0.04,'sine',0.07); break;
  }
}

/* ============ VRAIE ALARME (son répété + vibration + écran d'arrêt) ============ */
let _alarmIv=null, _alarmStart=0;
function alarmRing(){
  // motif d'alarme mélodique (joué en boucle), volume plus fort que les sfx
  if(soundsOn()){
    const seq=[[880,0],[1175,0.18],[880,0.36],[1175,0.54]];
    seq.forEach(([f,d])=>_note(f,0.16,'square',0.32,d));
    _note(660,0.5,'sine',0.18,0.74);
  }
  if(navigator.vibrate) navigator.vibrate([400,150,400,150,400]);
}
function startAlarm(title,msg){
  stopAlarm();
  _alarmStart=Date.now();
  try{ audioCtx(); }catch(e){}
  alarmRing();
  _alarmIv=setInterval(alarmRing,1300);
  // sécurité : arrêt automatique après 60 s
  setTimeout(()=>{ if(_alarmIv) stopAlarm(); },60000);
  notify(title||'⏰ Alarme',msg||'Le temps est écoulé !');
  showAlarmScreen(title||'⏰ Temps écoulé !',msg||'');
}
function stopAlarm(){
  if(_alarmIv){ clearInterval(_alarmIv); _alarmIv=null; }
  if(navigator.vibrate) navigator.vibrate(0);
  const o=$('#alarmOv'); if(o) o.remove();
}
function showAlarmScreen(title,msg){
  const old=$('#alarmOv'); if(old) old.remove();
  const ov=document.createElement('div'); ov.id='alarmOv';
  ov.style.cssText='position:fixed;inset:0;z-index:14000;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(5,7,10,.92);backdrop-filter:blur(8px);text-align:center;padding:24px;animation:fade .3s';
  ov.innerHTML='<div style="font-size:84px;animation:alarmShake .5s ease-in-out infinite">⏰</div>'+
    '<div class="man" style="font-weight:800;font-size:28px;margin-top:14px">'+title+'</div>'+
    (msg?'<div style="color:var(--muted);font-size:15px;margin-top:8px">'+msg+'</div>':'')+
    '<button class="btn" style="margin-top:28px;max-width:240px;font-size:17px;padding:16px" onclick="stopAlarm()">Arrêter l\u2019alarme</button>'+
    '<button class="btn ghost" style="margin-top:10px;max-width:240px" onclick="snoozeAlarm()">⏱ Rappel dans 5 min</button>';
  ov.onclick=(e)=>{ if(e.target===ov) {} };
  document.body.appendChild(ov);
}
function snoozeAlarm(){
  stopAlarm();
  toast('🔔 Rappel dans 5 min');
  setTimeout(()=>startAlarm('⏰ Rappel','5 minutes écoulées'),5*60*1000);
}

/* ============ NOTIFICATIONS & ACTIVITÉ EN ARRIÈRE-PLAN ============ */
let _wakeLock=null, _bgActivity=null;
function ensureNotifPerm(){ if('Notification'in window && Notification.permission==='default'){ try{ Notification.requestPermission(); }catch(e){} } }
function notify(title,body){
  if(P.notif===false) return;
  if('Notification'in window && Notification.permission==='granted'){
    try{ const n=new Notification(title,{body,icon:appIconDataURL(),badge:appIconDataURL(),tag:'vvv',renotify:true}); setTimeout(()=>n.close(),6000); return; }catch(e){}
  }
  sfx('notif');
}
let _bgNotif=null, _bgTick=null;
async function startBgActivity(type){
  _bgActivity={type,start:Date.now(),paused:false};
  try{ if('wakeLock'in navigator){ _wakeLock=await navigator.wakeLock.request('screen'); } }catch(e){}
  // Notification persistante mise à jour en continu
  if(P.notif!==false && 'Notification'in window && Notification.permission==='granted'){
    clearInterval(_bgTick);
    const update=()=>{
      if(!_bgActivity) return;
      let body;
      if(_bgActivity.type==='Minuteur'){ const left=(typeof timer!=='undefined'&&timer.endAt)?Math.max(0,Math.round((timer.endAt-Date.now())/1000)):0; body='⏳ Restant : '+fmtMS(left); }
      else { body='⏱ Écoulé : '+fmtTime((Date.now()-_bgActivity.start)/1000); }
      body+=' · '+(_bgActivity.paused?'⏸ En pause':'▶ En cours');
      try{ if(_bgNotif) _bgNotif.close(); _bgNotif=new Notification('VVV · '+_bgActivity.type,{body,icon:appIconDataURL(),tag:'vvv-activity',renotify:false,silent:true}); }catch(e){}
    };
    update(); _bgTick=setInterval(update,3000);
  }
}
function pauseBgActivity(p){ if(_bgActivity) _bgActivity.paused=p; }
function stopBgActivity(){
  _bgActivity=null; clearInterval(_bgTick);
  try{ if(_bgNotif){ _bgNotif.close(); _bgNotif=null; } }catch(e){}
  try{ if(_wakeLock){ _wakeLock.release(); _wakeLock=null; } }catch(e){}
}
// Réacquiert le wake lock au retour de veille si une activité tourne
document.addEventListener('visibilitychange',async()=>{
  if(document.visibilityState==='visible' && _bgActivity && !_wakeLock){
    try{ if('wakeLock'in navigator) _wakeLock=await navigator.wakeLock.request('screen'); }catch(e){}
  }
});
function appIconDataURL(){ return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%230A0D12'/%3E%3Ctext x='32' y='44' font-size='34' font-weight='800' fill='%233D7FFF' text-anchor='middle' font-family='sans-serif'%3EV%3C/text%3E%3C/svg%3E"; }
function ripple(e){
  const b=e.currentTarget, r=document.createElement('span'); r.className='ripple';
  const rect=b.getBoundingClientRect(), sz=Math.max(rect.width,rect.height);
  r.style.width=r.style.height=sz+'px';
  r.style.left=(e.clientX-rect.left-sz/2)+'px'; r.style.top=(e.clientY-rect.top-sz/2)+'px';
  b.appendChild(r); setTimeout(()=>r.remove(),600);
}
document.addEventListener('click',e=>{ const b=e.target.closest('.btn'); if(b) ripple.call(null,Object.assign(e,{currentTarget:b})); });

/* ---------- CONFETTI ---------- */
function burst(){
  const c=$('#confetti'), ctx=c.getContext('2d');
  c.width=innerWidth; c.height=innerHeight;
  const cols=['#3D7FFF','#F2B84B','#33D399','#FF5C6C','#9FD8FF','#A98CF0'];
  let parts=[];
  for(let i=0;i<120;i++) parts.push({x:innerWidth/2,y:innerHeight/3,vx:(Math.random()-.5)*16,vy:(Math.random()-1)*16,
    s:4+Math.random()*6,c:cols[i%cols.length],r:Math.random()*6,vr:(Math.random()-.5)*.4,life:1});
  let f=0;
  (function loop(){
    ctx.clearRect(0,0,c.width,c.height); f++;
    parts.forEach(p=>{ p.vy+=.5; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; p.life-=.012;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.globalAlpha=Math.max(0,p.life);
      ctx.fillStyle=p.c; ctx.fillRect(-p.s/2,-p.s/2,p.s,p.s*1.6); ctx.restore(); });
    if(f<110) requestAnimationFrame(loop); else ctx.clearRect(0,0,c.width,c.height);
  })();
}

/* ---------- OVERLAYS ---------- */
function openOv(id){ $('#'+id).classList.add('on'); }
function closeOv(id){ $('#'+id).classList.remove('on'); if(id==='ovLib'&&typeof _exDemoTimer!=='undefined'){ clearInterval(_exDemoTimer); } if((id==='ovProg'||id==='ovLive')&&typeof _exDemo2!=='undefined'&&_exDemo2){ clearInterval(_exDemo2); _exDemo2=null; } }

/* ============ WHEEL PICKER réutilisable ============ */
const PK_H=42;
function haptic(){ if(navigator.vibrate) navigator.vibrate(8); }
/* config: { title, cols:[{values:[], sel:idx, unit?, fmt?}], seps:[], onOk:(indices)=>{} } */
let _pkCfg=null;
function openPicker(cfg){
  _pkCfg=cfg;
  $('#pkTitle').textContent=cfg.title||'Choisir';
  const wrap=$('#pkWheels'); wrap.innerHTML='';
  cfg.cols.forEach((col,ci)=>{
    if(ci>0 && cfg.seps && cfg.seps[ci-1]!=null){ const s=document.createElement('div'); s.className='pk-sep'; s.textContent=cfg.seps[ci-1]; wrap.appendChild(s); }
    const c=document.createElement('div'); c.className='pkcol'+(col.wide?' wide':''); c.dataset.ci=ci;
    let inner='<div class="pk-pad"></div>';
    col.values.forEach((v,i)=>{ inner+='<div class="pkitem" data-i="'+i+'">'+(col.fmt?col.fmt(v):v)+'</div>'; });
    inner+='<div class="pk-pad"></div>';
    c.innerHTML=inner;
    wrap.appendChild(c);
    if(col.unit){ const u=document.createElement('div'); u.className='pk-unit'; u.textContent=col.unit; wrap.appendChild(u); }
    const items=c.querySelectorAll('.pkitem');
    col._last=col.sel;
    // Met à jour l'apparence selon la distance au centre (zoom progressif fluide)
    function paint(){
      const center=c.scrollTop/PK_H; // index flottant centré
      items.forEach((it,i)=>{
        const d=Math.abs(i-center);
        if(d<0.5) it.classList.add('sel'); else it.classList.remove('sel');
        const scale=Math.max(.7,1.18-d*0.22);
        const op=Math.max(.25,1-d*0.32);
        it.style.transform='scale('+scale.toFixed(3)+')';
        it.style.opacity=op.toFixed(2);
      });
    }
    // init position (après ouverture de l'overlay)
    requestAnimationFrame(()=>{ requestAnimationFrame(()=>{ c.scrollTop=col.sel*PK_H; paint(); }); });
    let raf,settle;
    c.addEventListener('scroll',()=>{
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(paint);
      const idx=Math.max(0,Math.min(col.values.length-1,Math.round(c.scrollTop/PK_H)));
      if(col._last!==idx){ col._last=idx; col.sel=idx; haptic(); }
      // snap uniquement quand le défilement s'arrête réellement
      clearTimeout(settle);
      settle=setTimeout(()=>{
        const target=Math.max(0,Math.min(col.values.length-1,Math.round(c.scrollTop/PK_H)));
        col.sel=target;
        if(Math.abs(c.scrollTop-target*PK_H)>1) c.scrollTo({top:target*PK_H,behavior:'smooth'});
        paint();
      },120);
    },{passive:true});
  });
  $('#pkOk').onclick=()=>{ const idx=cfg.cols.map(c=>c.sel); closeOv('ovPicker'); if(cfg.onOk)cfg.onOk(idx); };
  openOv('ovPicker');
}
/* Helpers de ranges */
function range(a,b,step){ const o=[]; step=step||1; for(let i=a;i<=b;i+=step)o.push(i); return o; }
/* Picker Temps h:mm:ss → secondes */
function pickTime(title,initSec,cb,withHours){
  initSec=initSec||0;
  const h=Math.floor(initSec/3600), m=Math.floor((initSec%3600)/60), s=Math.floor(initSec%60);
  const cols=[]; const seps=[];
  if(withHours!==false){ cols.push({values:range(0,9),sel:h,unit:'h'}); seps.push(':'); }
  cols.push({values:range(0,59),sel:m,unit:'min',fmt:v=>String(v).padStart(2,'0')}); seps.push(':');
  cols.push({values:range(0,59),sel:s,unit:'s',fmt:v=>String(v).padStart(2,'0')});
  openPicker({title:title||'Temps',cols,seps,onOk:idx=>{ let sec; if(withHours!==false){ sec=idx[0]*3600+idx[1]*60+idx[2]; } else { sec=idx[0]*60+idx[1]; } cb(sec); }});
}
/* Picker Allure mm:ss /km → sec/km */
function pickPace(title,initSpk,cb){
  initSpk=initSpk||270; const m=Math.floor(initSpk/60), s=Math.floor(initSpk%60);
  openPicker({title:title||'Allure',cols:[{values:range(2,12),sel:Math.max(0,m-2)},{values:range(0,59),sel:s,fmt:v=>String(v).padStart(2,'0'),unit:'/km'}],seps:[':'],onOk:idx=>cb((idx[0]+2)*60+idx[1])});
}
/* Picker Distance (km entiers + décimales) → km */
function pickDistance(title,initKm,cb){
  initKm=initKm||10; const whole=Math.floor(initKm), dec=Math.round((initKm-whole)*10);
  openPicker({title:title||'Distance',cols:[{values:range(0,99),sel:Math.min(99,whole)},{values:range(0,9),sel:dec,unit:'km'}],seps:['.'],onOk:idx=>cb(idx[0]+idx[1]/10)});
}
/* Picker entier simple */
function pickInt(title,min,max,init,unit,cb,step){
  step=step||1; const vals=range(min,max,step); const sel=Math.max(0,vals.indexOf(init)); 
  openPicker({title,cols:[{values:vals,sel:sel<0?0:sel,unit}],onOk:idx=>cb(vals[idx[0]])});
}
/* Picker Vitesse km/h (entier.décimale) */
function pickSpeed(title,init,cb){
  init=init||12; const whole=Math.floor(init), dec=Math.round((init-whole)*10);
  openPicker({title:title||'Vitesse',cols:[{values:range(1,40),sel:Math.max(0,whole-1)},{values:range(0,9),sel:dec,unit:'km/h'}],seps:['.'],onOk:idx=>cb((idx[0]+1)+idx[1]/10)});
}

/* ---------- NAV ---------- */
const TITLES={home:['Accueil',''],sport:['Sport','Running & Musculation'],stats:['Statistiques','Tes données réelles'],outils:['Outils','Calculs & timers'],profil:['Profil','']};
function nav(s){
  $$('.scr').forEach(el=>el.classList.remove('on'));
  $('#s-'+s).classList.add('on');
  $$('.nb').forEach(b=>b.classList.remove('on'));
  const btn=document.querySelector('.nb[data-s="'+s+'"]');
  btn.classList.add('on');
  const idx=[...$$('.nb')].indexOf(btn);
  $('#nav-pill').style.left='calc('+(idx*20)+'% + 8px)';
  const subs={home:'',sport:t('sub_sport'),stats:t('sub_stats'),outils:t('sub_outils'),profil:''};
  $('#tbTitle').textContent=t(s);
  $('#tbSub').textContent= s==='home'?greet():subs[s];
  const av=$('#tbAvatar'); if(av){ if(P.photo){ av.style.background='url('+P.photo+') center/cover'; av.textContent=''; } else { av.style.background='var(--ed)'; av.style.color='var(--e)'; av.style.fontWeight='800'; av.textContent=P.name?P.name[0].toUpperCase():'?'; } }
  $('#scroll').scrollTop=0;
  if(s==='home') renderHome();
  if(s==='sport') renderSport();
  if(s==='stats') renderStats();
  if(s==='outils') renderOutils();
  if(s==='profil') renderProfile();
}
$$('.nb').forEach(b=>b.onclick=()=>nav(b.dataset.s));
function greet(){ const h=new Date().getHours(); const l=curLang();
  const G={fr:[h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir'],en:[h<12?'Good morning':h<18?'Good afternoon':'Good evening'],ar:['مرحباً']};
  return (G[l]||G.fr)[0]+', '+(P.name||t('profil'))+' 👋'; }

/* ---------- INIT ---------- */
function boot(){
  applyTheme(); // applique le mode (clair/sombre) dès le démarrage
  checkConnectivity();
  if(P.notif!==false) ensureNotifPerm();
  $('#nav-pill').style.width='calc(20% - 0px)';
  $('#nav-pill').style.left='calc(0% + 8px)';
  if(!P.setupDone){ startOnboarding(); }
  else initApp();
}
function initApp(){
  $('#ob').classList.remove('on');
  applyTheme();
  document.documentElement.lang=curLang();
  document.documentElement.dir=(curLang()==='ar')?'rtl':'ltr';
  applyNavLabels();
  P.vdot=computeVDOTfromRecords()||computeVDOT();
  getDailyGoals();
  refreshXP();
  nav('home');
  // Reprise automatique d'une séance muscu interrompue
  setTimeout(maybeResumeLive,600);
}
function maybeResumeLive(){
  const snap=DB.load('live_active'); if(!snap||LIVE) return;
  const prog=allProgs().find(x=>x.id===snap.progId); if(!prog){ localStorage.removeItem('vvv_live_active'); return; }
  const mins=Math.round((Date.now()-snap.start)/60000);
  if(mins>180){ localStorage.removeItem('vvv_live_active'); return; } // trop vieux
  if(confirm('Une séance « '+prog.name+' » était en cours ('+mins+' min). Reprendre ?')){
    LIVE={prog,idx:snap.idx,start:snap.start,state:snap.state,tonnage:snap.tonnage,setsDone:snap.setsDone};
    renderLive(); openOv('ovLive'); liveTimer=setInterval(updateLiveTimer,500); startBgActivity('Séance : '+prog.name);
  } else { localStorage.removeItem('vvv_live_active'); }
}

/* ---------- ONBOARDING ---------- */
let obStep=1; const OB_MAX=7;
function startOnboarding(){
  $('#ob').classList.add('on');
  const prog=$('#obProg'); prog.innerHTML='';
  for(let i=1;i<=OB_MAX;i++){ const d=document.createElement('div'); if(i===1)d.classList.add('on'); prog.appendChild(d); }
  // pill selectors
  $('#ob_level').querySelectorAll('.pill').forEach(p=>p.onclick=()=>{ $('#ob_level').querySelectorAll('.pill').forEach(x=>x.classList.remove('on')); p.classList.add('on'); });
  $('#ob_days').querySelectorAll('.pill').forEach(p=>p.onclick=()=>p.classList.toggle('on'));
  OB_PERFS=[{dist:null,meters:null,timeS:null}];
  renderPerfRows();
  obShow(1);
}
/* ===== Étape Performances : lignes Distance | Temps ===== */
let OB_PERFS=[{dist:null,meters:null,timeS:null}];
function renderPerfRows(){
  const box=$('#ob_perfs'); if(!box) return;
  let h='';
  OB_PERFS.forEach((p,i)=>{
    h+='<div class="perfrow">';
    h+='<div class="perfcard" onclick="pickPerfDist('+i+')"><div class="pcl">🏁 Distance</div><div class="pcv '+(p.dist?'':'empty')+'">'+(p.dist||'Choisir')+'</div></div>';
    h+='<div class="perfcard" onclick="pickPerfTime('+i+')"><div class="pcl">⏱ Temps</div><div class="pcv '+(p.timeS!=null?'':'empty')+'">'+(p.timeS!=null?fmtTime(p.timeS):'Choisir')+'</div></div>';
    if(OB_PERFS.length>1) h+='<div class="perfdel" onclick="delPerfRow('+i+')">🗑</div>';
    h+='</div>';
  });
  box.innerHTML=h;
}
function addPerfRow(){ OB_PERFS.push({dist:null,meters:null,timeS:null}); renderPerfRows(); }
function openLevelGuide(){
  const lv=[
    ['🌱 Débutant','Tu cours depuis moins d\u2019un an. Tu t\u2019entraînes occasionnellement et tu découvres encore les bases.'],
    ['🏃 Intermédiaire','Tu cours régulièrement, participes parfois à des compétitions et maîtrises les principaux types de séances.'],
    ['⚡ Confirmé','Plusieurs années d\u2019entraînement, une pratique structurée et des objectifs chronométriques précis.'],
    ['🔥 Très avancé','Entraînement intensif, plusieurs compétitions par an, très bon niveau régional ou national.'],
    ['🏆 Élite','Athlète de haut niveau : performances nationales/internationales, entraînement quotidien à très gros volume.']
  ];
  let h=lv.map(x=>'<div class="card" style="margin-bottom:10px;padding:14px"><div style="font-weight:700;font-size:15px;margin-bottom:5px">'+x[0]+'</div><div style="font-size:13px;color:var(--muted);line-height:1.5">'+x[1]+'</div></div>').join('');
  h+='<button class="btn" onclick="closeOv(\'ovProg\')">Compris 👍</button>';
  $('#ovProgTitle').textContent='Comment choisir mon niveau ?'; $('#progBody').innerHTML=h;
  // place l'overlay au-dessus de l'onboarding
  $('#ovProg').style.zIndex='13700'; openOv('ovProg');
}
function delPerfRow(i){ OB_PERFS.splice(i,1); renderPerfRows(); }
function pickPerfDist(i){
  const names=REC_DISTANCES.map(d=>d[0]).concat(['Autre']);
  openPicker({title:'Distance',cols:[{values:names,sel:Math.max(0,names.indexOf(OB_PERFS[i].dist)),wide:true}],onOk:idx=>{
    const name=names[idx[0]];
    if(name==='Autre'){ pickDistance('Distance personnalisée',OB_PERFS[i].meters?OB_PERFS[i].meters/1000:5,km=>{ OB_PERFS[i].dist=(km>=1?km+' km':Math.round(km*1000)+' m'); OB_PERFS[i].meters=Math.round(km*1000); renderPerfRows(); }); }
    else { const d=REC_DISTANCES[idx[0]]; OB_PERFS[i].dist=d[0]; OB_PERFS[i].meters=d[1]; renderPerfRows(); }
  }});
}
function pickPerfTime(i){
  const m=OB_PERFS[i].meters||5000; const longRace=m>=15000;
  pickTime('Temps · '+(OB_PERFS[i].dist||''),OB_PERFS[i].timeS!=null?OB_PERFS[i].timeS:(m>=10000?2700:m>=5000?1200:300),v=>{ OB_PERFS[i].timeS=v; renderPerfRows(); },longRace);
}
function obShow(n){
  obStep=n;
  $$('.ob-step').forEach(s=>s.classList.toggle('on',+s.dataset.step===n));
  $('#obProg').querySelectorAll('div').forEach((d,i)=>d.classList.toggle('on',i<n));
  $('#obPrev').style.visibility=n===1?'hidden':'visible';
  $('#obNext').textContent=n===OB_MAX?'Terminer 🚀':'Continuer';
  $('#ob').scrollTop=0;
}
$('#obPrev').onclick=()=>{ if(obStep>1) obShow(obStep-1); };
$('#obNext').onclick=()=>{
  if(!obValidate(obStep)) return;
  if(obStep<OB_MAX) obShow(obStep+1);
  else finishOnboarding();
};
function obv(id){ const el=$('#'+id); return el.dataset.v!==undefined&&el.classList.contains('pkfield')?el.dataset.v:el.value; }
function setObPk(id,val,label){ const el=$('#'+id); el.dataset.v=val; el.textContent=label; el.classList.add('set'); }
function pickWeightOb(){ openPicker({title:'Poids (kg)',cols:[{values:range(30,200),sel:30},{values:range(0,9),sel:0,unit:'kg'}],seps:['.'],onOk:idx=>{ const w=(idx[0]+30)+idx[1]/10; setObPk('ob_w',w,w+' kg'); }}); }
function obValidate(n){
  if(n===2){ if(!$('#ob_name').value.trim()||!$('#ob_bday').value||!$('#ob_sex').value||!$('#ob_city').value.trim()){ toast('Remplis les champs requis'); return false; } }
  if(n===3){ if(!obv('ob_h')||!obv('ob_w')){ toast('Taille et poids requis'); return false; } }
  if(n===4){ if(!$('#ob_level').querySelector('.pill.on')){ toast('Choisis un niveau'); return false; } if(!obv('ob_km')){ toast('Choisis ton volume'); return false; } }
  if(n===5){ if(!$('#ob_goal').value.trim()||!$('#ob_compdate').value){ toast('Objectif et date requis'); return false; } }
  if(n===6){ const valid=OB_PERFS.filter(p=>p.meters&&p.timeS); if(!valid.length){ toast('Ajoute au moins une performance'); return false; } }
  if(n===7){ if(!$('#ob_days').querySelector('.pill.on')||!obv('ob_time')){ toast('Jours et temps requis'); return false; } }
  return true;
}
function finishOnboarding(){
  const days=[...$('#ob_days').querySelectorAll('.pill.on')].map(p=>+p.dataset.v);
  // Enregistre les performances saisies
  const valid=OB_PERFS.filter(p=>p.meters&&p.timeS!=null);
  RECORDS=valid.map(p=>({dist:p.dist,meters:p.meters,time:fmtTime(p.timeS),date:todayKey()}));
  const find=m=>{ const r=valid.find(x=>x.meters===m); return r?fmtTime(r.timeS):''; };
  P={
    setupDone:true,
    name:$('#ob_name').value.trim(), bday:$('#ob_bday').value, sex:$('#ob_sex').value, city:$('#ob_city').value.trim(),
    height:+obv('ob_h'), weight:+obv('ob_w'),
    level:$('#ob_level').querySelector('.pill.on').dataset.v, kmWeek:+obv('ob_km')||40,
    goal:$('#ob_goal').value.trim(), compDate:$('#ob_compdate').value,
    t5k:find(5000), t3k:find(3000), t1500:find(1500), t10k:find(10000),
    days, sessionTime:+obv('ob_time')||60, coach:$('#ob_coach').value.trim(),
    theme:'blue', pb5k:find(5000), pb1500:find(1500), pb10k:find(10000)
  };
  P.vdot=computeVDOTfromRecords()||computeVDOT();
  DB.save('profile',P); DB.save('records',RECORDS); DB.save('xp',XP);
  burst();
  setTimeout(initApp,400);
}

/* ---------- THEME ---------- */
const THEMES={blue:'#3D7FFF',violet:'#A98CF0',cyan:'#7FE0E8',green:'#33D399',orange:'#FF8A3D',pink:'#FF5C9E'};
function accentHex(){ return P.theme==='custom'?(P.customColor||'#3D7FFF'):(THEMES[P.theme]||'#3D7FFF'); }
function effectiveMode(){
  const m=P.mode||'dark';
  if(m==='auto') return (window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark';
  return m;
}
function applyTheme(){
  const c=accentHex();
  document.documentElement.style.setProperty('--e',c);
  const hex=c.replace('#','');
  const r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);
  document.documentElement.style.setProperty('--ed','rgba('+r+','+g+','+b+',.'+(effectiveMode()==='light'?'12':'16')+')');
  const mode=effectiveMode();
  document.documentElement.setAttribute('data-mode',mode);
  const meta=document.querySelector('meta[name="theme-color"]'); if(meta) meta.content=mode==='light'?'#F2F4F8':'#0A0D12';
}
function setTheme(t){ P.theme=t; saveAll(); applyTheme(); if($('#s-profil')&&$('#s-profil').classList.contains('on'))renderProfile(); }
function setMode(m){ P.mode=m; saveAll(); applyTheme(); if($('#s-profil')&&$('#s-profil').classList.contains('on'))renderProfile(); }
function toggleSounds(el){ P.sounds=(P.sounds===false); saveAll(); el.classList.toggle('on'); if(P.sounds!==false) sfx('goal'); }
async function toggleNotif(el){
  const turningOn = (P.notif===false) || P.notif===undefined ? true : false;
  if(turningOn){
    // Demande la permission système
    if('Notification'in window){
      let perm=Notification.permission;
      if(perm==='default'){ try{ perm=await Notification.requestPermission(); }catch(e){} }
      if(perm==='denied'){ toast('🔕 Notifications bloquées par le téléphone'); return; }
    } else { toast('Notifications non supportées'); return; }
    P.notif=true; el.classList.add('on'); saveAll();
    notify('🔔 Notifications activées','Tu recevras les rappels et l\u2019état de tes activités.');
    toast('Notifications activées ✓');
  } else {
    P.notif=false; el.classList.remove('on'); saveAll(); stopBgActivity(); toast('Notifications désactivées');
  }
}
/* Palette de couleur personnalisée */
const PALETTE=['#3D7FFF','#5B8DEF','#00C2FF','#1FD3B0','#33D399','#7BD938','#FFD23F','#FF8A3D','#FF6B35','#FF5C6C','#FF5C9E','#C159F0','#A98CF0','#7C5CFF','#E0E6F0','#9FD8FF','#F2B84B','#C97B4A'];
function openColorPicker(){
  let h='<div class="tip" style="margin-bottom:14px">Choisis ta couleur d\u2019accent.</div>';
  h+='<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-bottom:16px">';
  PALETTE.forEach(col=>{ const sel=(P.theme==='custom'&&P.customColor===col); h+='<div onclick="applyCustomColor(\''+col+'\')" style="aspect-ratio:1;border-radius:50%;background:'+col+';cursor:pointer;border:3px solid '+(sel?'var(--snow)':'transparent')+';box-shadow:0 0 0 1px var(--hair)"></div>'; });
  h+='</div>';
  h+='<div class="field"><label>Couleur sur-mesure</label><input type="color" id="customColorInp" value="'+(P.customColor||'#3D7FFF')+'" style="width:100%;height:48px;border:1px solid var(--hair);border-radius:12px;background:var(--s2);cursor:pointer"></div>';
  h+='<button class="btn" onclick="applyCustomColor(document.getElementById(\'customColorInp\').value)">✓ Appliquer</button>';
  $('#ovProgTitle').textContent='Palette de couleurs'; $('#progBody').innerHTML=h; $('#ovProg').style.zIndex='13700'; openOv('ovProg');
  const inp=$('#customColorInp'); if(inp) inp.oninput=()=>{ P.theme='custom'; P.customColor=inp.value; applyTheme(); };
}
function applyCustomColor(col){ P.theme='custom'; P.customColor=col; saveAll(); applyTheme(); closeOv('ovProg'); renderProfile(); toast('Couleur appliquée ✓'); }
// suit le thème du téléphone en mode auto
if(window.matchMedia){ try{ window.matchMedia('(prefers-color-scheme: light)').addEventListener('change',()=>{ if((P.mode||'dark')==='auto') applyTheme(); }); }catch(e){} }

/* ---------- EXERCISE LIBRARY (100+) ---------- */
const LIB=[
 // Pectoraux
 {name:'Bench Press',sets:4,reps:'12',muscles:['Pectoraux','Triceps'],anim:'🏋️',tip:'Garde les omoplates serrées et les pieds ancrés au sol.'},
 {name:'Decline Bench Press',sets:4,reps:'12',muscles:['Pectoraux bas'],anim:'🏋️',tip:'Cible le bas des pectoraux, descends contrôlé.'},
 {name:'Dumbbell Incline Bench Press',sets:4,reps:'12',muscles:['Pectoraux haut'],anim:'💪',tip:'Banc à 30°, amplitude complète.'},
 {name:'Lever Seated Fly',sets:3,reps:'8',muscles:['Pectoraux'],anim:'🦋',tip:'Serre les pectoraux en fin de mouvement, 1s de pause.'},
 {name:'Cable Crossover',sets:3,reps:'12-15',muscles:['Pectoraux'],anim:'🔀',tip:'Légère flexion du buste, contraction au centre.'},
 {name:'Push Up',sets:3,reps:'AMRAP',muscles:['Pectoraux','Triceps'],anim:'🤸',tip:'Gainage parfait, ne creuse pas le dos.'},
 {name:'Dumbbell Pullover',sets:3,reps:'12',muscles:['Pectoraux','Dos'],anim:'🛢️',tip:'Étire la cage thoracique, coudes semi-fléchis.'},
 // Dos
 {name:'Lever Lying T-bar Row',sets:3,reps:'10-12',muscles:['Dos','Trapèzes'],anim:'🚣',tip:'Tire avec les coudes, serre les omoplates.'},
 {name:'Straight Back Seated Row',sets:3,reps:'6-10',muscles:['Dos'],anim:'🚣',tip:'Dos droit, ne te penche pas en arrière.'},
 {name:'Bar Lateral Pulldown',sets:3,reps:'8-10',muscles:['Grand dorsal'],anim:'🪢',tip:'Tire la barre vers la poitrine, coudes vers le bas.'},
 {name:'Pull Up',sets:3,reps:'AMRAP',muscles:['Grand dorsal','Biceps'],anim:'🧗',tip:'Amplitude complète, contrôle la descente.'},
 {name:'Deadlift',sets:4,reps:'5',muscles:['Dos','Fessiers','Ischios'],anim:'🏋️',tip:'Dos neutre, pousse avec les jambes.'},
 {name:'Bent Over Row',sets:4,reps:'8-10',muscles:['Dos'],anim:'🚣',tip:'Buste à 45°, gainage permanent.'},
 {name:'Single Arm Dumbbell Row',sets:3,reps:'10-12',muscles:['Dos'],anim:'💪',tip:'Appui sur banc, tire le coude haut.'},
 {name:'Lever Reverse Fly',sets:3,reps:'12-15',muscles:['Arrière épaules','Dos'],anim:'🦋',tip:'Cible les deltoïdes postérieurs.'},
 // Biceps
 {name:'EZ-bar 21s',sets:4,reps:'21',muscles:['Biceps'],anim:'💪',tip:'7 bas + 7 haut + 7 complets, sans tricher.'},
 {name:'Hammer Curl',sets:4,reps:'6-12',muscles:['Biceps','Avant-bras'],anim:'🔨',tip:'Prise neutre, coudes fixes.'},
 {name:'Biceps Curl',sets:4,reps:'12',muscles:['Biceps'],anim:'💪',tip:'Pas de balancier, contraction complète.'},
 {name:'Lever Preacher Curl',sets:3,reps:'4-10',muscles:['Biceps'],anim:'🪑',tip:'Bras calés, descente lente.'},
 {name:'Concentration Curl',sets:3,reps:'10-12',muscles:['Biceps'],anim:'💪',tip:'Isole le biceps, coude contre la cuisse.'},
 {name:'Cable Curl',sets:3,reps:'12-15',muscles:['Biceps'],anim:'🪢',tip:'Tension continue tout le mouvement.'},
 // Triceps
 {name:'Skull Crusher',sets:4,reps:'12',muscles:['Triceps'],anim:'💀',tip:'Coudes fixes, descends vers le front.'},
 {name:'Elbow Dips',sets:3,reps:'6-8',muscles:['Triceps','Pectoraux'],anim:'🤸',tip:'Buste droit pour cibler triceps.'},
 {name:'Triceps Pushdown',sets:4,reps:'12',muscles:['Triceps'],anim:'🪢',tip:'Coudes collés au corps, extension complète.'},
 {name:'Overhead Triceps Extension',sets:3,reps:'12',muscles:['Triceps'],anim:'💪',tip:'Coudes vers le haut, étire bien.'},
 {name:'Close Grip Bench Press',sets:4,reps:'8-10',muscles:['Triceps','Pectoraux'],anim:'🏋️',tip:'Mains largeur épaules, coudes serrés.'},
 // Épaules
 {name:'Seated Shoulder Press',sets:4,reps:'8',muscles:['Épaules'],anim:'🏋️',tip:'Dos calé, pousse à la verticale.'},
 {name:'Lever Seated Shoulder Press',sets:3,reps:'10-12',muscles:['Épaules'],anim:'🪑',tip:'Trajectoire guidée, contrôle.'},
 {name:'Lateral Raise',sets:4,reps:'12',muscles:['Deltoïde latéral'],anim:'🦅',tip:'Monte aux épaules, pas plus haut.'},
 {name:'Front Raise',sets:4,reps:'12',muscles:['Deltoïde antérieur'],anim:'🙌',tip:'Pas de balancier, contrôle la descente.'},
 {name:'Cable Face Pull',sets:4,reps:'12-15',muscles:['Arrière épaules','Trapèzes'],anim:'🪢',tip:'Tire vers le visage, écarte les coudes.'},
 {name:'Arnold Press',sets:3,reps:'10',muscles:['Épaules'],anim:'🏋️',tip:'Rotation des poignets durant la montée.'},
 {name:'Upright Row',sets:3,reps:'12',muscles:['Épaules','Trapèzes'],anim:'⬆️',tip:'Tire la barre sous le menton, coudes hauts.'},
 {name:'Shrug',sets:4,reps:'15',muscles:['Trapèzes'],anim:'🤷',tip:'Hausse les épaules, pause en haut.'},
 // Jambes
 {name:'Lever Leg Extension',sets:4,reps:'8-12',muscles:['Quadriceps'],anim:'🦵',tip:'Extension complète, pause 1s en haut.'},
 {name:'Lever Seated Leg Extension',sets:3,reps:'12',muscles:['Quadriceps'],anim:'🦵',tip:'Contrôle la descente.'},
 {name:'Lever Lying Leg Curl',sets:4,reps:'6-12',muscles:['Ischios'],anim:'🦵',tip:'Bassin collé, ramène les talons aux fesses.'},
 {name:'Lever Kneeling Leg Curl',sets:3,reps:'10-12',muscles:['Ischios'],anim:'🦵',tip:'Isole l\u2019ischio, sans à-coup.'},
 {name:'Sled 45° Leg Wide Press',sets:4,reps:'8-12',muscles:['Quadriceps','Fessiers'],anim:'🛷',tip:'Pieds larges pour cibler l\u2019intérieur.'},
 {name:'Sled 45° Leg Press',sets:3,reps:'10-12',muscles:['Quadriceps','Fessiers'],anim:'🛷',tip:'Genoux dans l\u2019axe des pieds.'},
 {name:'Smith Squat',sets:3,reps:'10-12',muscles:['Quadriceps','Fessiers'],anim:'🏋️',tip:'Descends sous parallèle, dos droit.'},
 {name:'Back Squat',sets:5,reps:'5',muscles:['Quadriceps','Fessiers'],anim:'🏋️',tip:'Pousse le sol, respiration bloquée.'},
 {name:'Front Squat',sets:4,reps:'6-8',muscles:['Quadriceps'],anim:'🏋️',tip:'Coudes hauts, buste vertical.'},
 {name:'Bulgarian Split Squat',sets:3,reps:'10',muscles:['Quadriceps','Fessiers'],anim:'🦵',tip:'Pied arrière surélevé, genou avant stable.'},
 {name:'Dumbbell Split Squat',sets:3,reps:'10',muscles:['Quadriceps','Fessiers'],anim:'🦵',tip:'Buste droit, descente contrôlée.'},
 {name:'Walking Lunge',sets:3,reps:'12',muscles:['Quadriceps','Fessiers'],anim:'🚶',tip:'Grandes foulées, genou ne dépasse pas.'},
 {name:'Lever Seated Calf Raise',sets:4,reps:'12',muscles:['Mollets'],anim:'🦵',tip:'Amplitude max, étire en bas.'},
 {name:'Lever Seated One Leg Calf Raise',sets:3,reps:'15',muscles:['Mollets'],anim:'🦵',tip:'Une jambe à la fois, contraction max.'},
 {name:'Standing Calf Raise',sets:4,reps:'15',muscles:['Mollets'],anim:'🦵',tip:'Pause en haut, descente lente.'},
 {name:'Nordic Hamstring Curl',sets:3,reps:'6-8',muscles:['Ischios'],anim:'🦵',tip:'Excentrique lent, super protecteur pour le coureur.'},
 {name:'45° One Leg Hyperextension',sets:3,reps:'12',muscles:['Lombaires','Fessiers'],anim:'🔙',tip:'Dos neutre, contracte les fessiers.'},
 // Fessiers / hanches
 {name:'Hip Thrust',sets:3,reps:'10-12',muscles:['Fessiers'],anim:'🍑',tip:'Pause haute 1s, menton rentré.'},
 {name:'Lever Hip Thrust',sets:3,reps:'12',muscles:['Fessiers'],anim:'🍑',tip:'Extension complète des hanches.'},
 {name:'Lever Seated Hip Abduction',sets:3,reps:'12-15',muscles:['Fessiers','Abducteurs'],anim:'🦵',tip:'Écarte lentement, contrôle le retour.'},
 {name:'Lever Seated Hip Adduction',sets:3,reps:'12-15',muscles:['Adducteurs'],anim:'🦵',tip:'Serre les cuisses, ne lâche pas le retour.'},
 {name:'Glute Bridge',sets:3,reps:'15',muscles:['Fessiers'],anim:'🍑',tip:'Pousse avec les talons.'},
 {name:'Cable Kickback',sets:3,reps:'12-15',muscles:['Fessiers'],anim:'🦵',tip:'Jambe tendue vers l\u2019arrière, sans cambrer.'},
 // Abdos / Core
 {name:'Plank',sets:3,reps:'45s',muscles:['Abdominaux','Core'],anim:'🧘',tip:'Corps aligné, gainage constant.'},
 {name:'Hanging Leg Raise',sets:3,reps:'12',muscles:['Abdominaux'],anim:'🧗',tip:'Monte les jambes sans balancier.'},
 {name:'Cable Crunch',sets:3,reps:'15',muscles:['Abdominaux'],anim:'🪢',tip:'Enroule la colonne, pas les hanches.'},
 {name:'Russian Twist',sets:3,reps:'20',muscles:['Obliques'],anim:'🌀',tip:'Rotation contrôlée, gainage actif.'},
 {name:'Ab Wheel Rollout',sets:3,reps:'10',muscles:['Abdominaux','Core'],anim:'⚙️',tip:'Ne creuse jamais le bas du dos.'},
 // Avant-bras
 {name:'Wrist Curl',sets:3,reps:'15',muscles:['Avant-bras'],anim:'✊',tip:'Amplitude complète des poignets.'},
 {name:'Farmer Walk',sets:3,reps:'30m',muscles:['Avant-bras','Trapèzes','Core'],anim:'🚶',tip:'Posture droite, grip ferme.'}
];
/* ============================================================
   BIBLIOTHÈQUE ÉTENDUE — schéma riche (groupe, matériel, niveau,
   muscles primaires/secondaires, fiche tutoriel complète)
   ============================================================ */
const MUSCLE_GROUPS=['Tous','Pectoraux','Dos','Épaules','Trapèzes','Biceps','Triceps','Avant-bras','Abdominaux','Lombaires','Fessiers','Quadriceps','Ischios','Adducteurs','Abducteurs','Mollets','Cou','Corps entier'];
const EQUIPMENT=['Tous','Haltères','Barre','Machine','Poulie','Poids du corps','Élastique','Kettlebell'];
const LEVELS=['Débutant','Intermédiaire','Avancé'];
// Schéma compact : [nom, groupe, matériel, niveau, [primaires], [secondaires], emoji]
const XDATA=[
 // PECTORAUX
 ['Développé couché barre','Pectoraux','Barre','Intermédiaire',['Pectoraux'],['Triceps','Épaules'],'🏋️'],
 ['Développé incliné barre','Pectoraux','Barre','Intermédiaire',['Pectoraux haut'],['Épaules','Triceps'],'🏋️'],
 ['Développé décliné barre','Pectoraux','Barre','Intermédiaire',['Pectoraux bas'],['Triceps'],'🏋️'],
 ['Développé couché haltères','Pectoraux','Haltères','Intermédiaire',['Pectoraux'],['Triceps','Épaules'],'💪'],
 ['Développé incliné haltères','Pectoraux','Haltères','Intermédiaire',['Pectoraux haut'],['Épaules'],'💪'],
 ['Écarté couché haltères','Pectoraux','Haltères','Intermédiaire',['Pectoraux'],['Épaules'],'🦋'],
 ['Écarté incliné haltères','Pectoraux','Haltères','Intermédiaire',['Pectoraux haut'],[],'🦋'],
 ['Pec Deck (machine)','Pectoraux','Machine','Débutant',['Pectoraux'],[],'🦋'],
 ['Développé machine convergente','Pectoraux','Machine','Débutant',['Pectoraux'],['Triceps'],'🏋️'],
 ['Écarté poulie haute','Pectoraux','Poulie','Intermédiaire',['Pectoraux bas'],[],'🔀'],
 ['Écarté poulie basse','Pectoraux','Poulie','Intermédiaire',['Pectoraux haut'],[],'🔀'],
 ['Crossover poulie','Pectoraux','Poulie','Intermédiaire',['Pectoraux'],['Épaules'],'🔀'],
 ['Pompes','Pectoraux','Poids du corps','Débutant',['Pectoraux'],['Triceps','Abdominaux'],'🤸'],
 ['Pompes déclinées','Pectoraux','Poids du corps','Intermédiaire',['Pectoraux haut'],['Épaules'],'🤸'],
 ['Pompes diamant','Pectoraux','Poids du corps','Intermédiaire',['Triceps'],['Pectoraux'],'🤸'],
 ['Dips pectoraux','Pectoraux','Poids du corps','Avancé',['Pectoraux bas'],['Triceps'],'🤸'],
 ['Pullover haltère','Pectoraux','Haltères','Intermédiaire',['Pectoraux'],['Dos'],'🛢️'],
 ['Écarté élastique','Pectoraux','Élastique','Débutant',['Pectoraux'],[],'🦋'],
 // DOS
 ['Soulevé de terre','Dos','Barre','Avancé',['Dos','Lombaires'],['Fessiers','Ischios'],'🏋️'],
 ['Soulevé de terre roumain','Ischios','Barre','Intermédiaire',['Ischios'],['Fessiers','Lombaires'],'🏋️'],
 ['Rowing barre buste penché','Dos','Barre','Intermédiaire',['Dos'],['Biceps','Trapèzes'],'🚣'],
 ['Rowing T-bar','Dos','Machine','Intermédiaire',['Dos'],['Trapèzes','Biceps'],'🚣'],
 ['Rowing haltère unilatéral','Dos','Haltères','Débutant',['Dos'],['Biceps'],'💪'],
 ['Rowing poulie basse','Dos','Poulie','Débutant',['Dos'],['Biceps'],'🚣'],
 ['Tirage vertical poulie','Dos','Poulie','Débutant',['Grand dorsal'],['Biceps'],'🪢'],
 ['Tirage nuque','Dos','Poulie','Avancé',['Grand dorsal'],['Trapèzes'],'🪢'],
 ['Tractions pronation','Dos','Poids du corps','Avancé',['Grand dorsal'],['Biceps'],'🧗'],
 ['Tractions supination','Dos','Poids du corps','Avancé',['Grand dorsal'],['Biceps'],'🧗'],
 ['Pull-over poulie','Dos','Poulie','Intermédiaire',['Grand dorsal'],['Pectoraux'],'🪢'],
 ['Rowing machine assise','Dos','Machine','Débutant',['Dos'],['Biceps'],'🚣'],
 ['Rowing élastique','Dos','Élastique','Débutant',['Dos'],['Biceps'],'🪢'],
 ['Good Morning','Lombaires','Barre','Avancé',['Lombaires'],['Ischios','Fessiers'],'🔙'],
 ['Hyperextension lombaire','Lombaires','Poids du corps','Débutant',['Lombaires'],['Fessiers'],'🔙'],
 ['Superman au sol','Lombaires','Poids du corps','Débutant',['Lombaires'],['Fessiers'],'🦸'],
 // ÉPAULES
 ['Développé militaire barre','Épaules','Barre','Avancé',['Épaules'],['Triceps','Trapèzes'],'🏋️'],
 ['Développé haltères assis','Épaules','Haltères','Intermédiaire',['Épaules'],['Triceps'],'🏋️'],
 ['Développé Arnold','Épaules','Haltères','Intermédiaire',['Épaules'],['Triceps'],'🏋️'],
 ['Développé machine épaules','Épaules','Machine','Débutant',['Épaules'],['Triceps'],'🪑'],
 ['Élévations latérales','Épaules','Haltères','Débutant',['Deltoïde latéral'],[],'🦅'],
 ['Élévations latérales poulie','Épaules','Poulie','Intermédiaire',['Deltoïde latéral'],[],'🦅'],
 ['Élévations frontales','Épaules','Haltères','Débutant',['Deltoïde antérieur'],[],'🙌'],
 ['Oiseau (rear delt)','Épaules','Haltères','Débutant',['Arrière épaules'],['Trapèzes'],'🦋'],
 ['Face Pull poulie','Épaules','Poulie','Débutant',['Arrière épaules'],['Trapèzes'],'🪢'],
 ['Rowing menton','Épaules','Barre','Intermédiaire',['Épaules','Trapèzes'],[],'⬆️'],
 ['Élévations latérales élastique','Épaules','Élastique','Débutant',['Deltoïde latéral'],[],'🦅'],
 // TRAPÈZES
 ['Shrug barre','Trapèzes','Barre','Débutant',['Trapèzes'],[],'🤷'],
 ['Shrug haltères','Trapèzes','Haltères','Débutant',['Trapèzes'],[],'🤷'],
 ['Shrug machine','Trapèzes','Machine','Débutant',['Trapèzes'],[],'🤷'],
 // BICEPS
 ['Curl barre EZ','Biceps','Barre','Débutant',['Biceps'],['Avant-bras'],'💪'],
 ['Curl haltères','Biceps','Haltères','Débutant',['Biceps'],['Avant-bras'],'💪'],
 ['Curl marteau','Biceps','Haltères','Débutant',['Biceps','Avant-bras'],[],'🔨'],
 ['Curl incliné','Biceps','Haltères','Intermédiaire',['Biceps'],[],'💪'],
 ['Curl concentré','Biceps','Haltères','Débutant',['Biceps'],[],'💪'],
 ['Curl pupitre (Preacher)','Biceps','Barre','Intermédiaire',['Biceps'],[],'🪑'],
 ['Curl poulie basse','Biceps','Poulie','Débutant',['Biceps'],[],'🪢'],
 ['Curl araignée','Biceps','Haltères','Intermédiaire',['Biceps'],[],'🕷️'],
 ['21s biceps','Biceps','Barre','Intermédiaire',['Biceps'],[],'💪'],
 ['Curl élastique','Biceps','Élastique','Débutant',['Biceps'],[],'💪'],
 // TRICEPS
 ['Barre au front (Skull Crusher)','Triceps','Barre','Intermédiaire',['Triceps'],[],'💀'],
 ['Extension poulie haute','Triceps','Poulie','Débutant',['Triceps'],[],'🪢'],
 ['Extension poulie corde','Triceps','Poulie','Débutant',['Triceps'],[],'🪢'],
 ['Extension nuque haltère','Triceps','Haltères','Intermédiaire',['Triceps'],[],'💪'],
 ['Kickback haltère','Triceps','Haltères','Débutant',['Triceps'],[],'🦵'],
 ['Dips entre bancs','Triceps','Poids du corps','Débutant',['Triceps'],['Pectoraux'],'🤸'],
 ['Développé couché serré','Triceps','Barre','Intermédiaire',['Triceps'],['Pectoraux'],'🏋️'],
 ['Extension élastique','Triceps','Élastique','Débutant',['Triceps'],[],'🪢'],
 // AVANT-BRAS
 ['Curl poignets','Avant-bras','Barre','Débutant',['Avant-bras'],[],'✊'],
 ['Curl poignets inversé','Avant-bras','Barre','Débutant',['Avant-bras'],[],'✊'],
 ['Marche du fermier','Avant-bras','Haltères','Débutant',['Avant-bras','Trapèzes'],['Abdominaux'],'🚶'],
 ['Wrist roller','Avant-bras','Poids du corps','Intermédiaire',['Avant-bras'],[],'🌀'],
 // ABDOMINAUX
 ['Crunch','Abdominaux','Poids du corps','Débutant',['Abdominaux'],[],'🧘'],
 ['Crunch poulie','Abdominaux','Poulie','Intermédiaire',['Abdominaux'],[],'🪢'],
 ['Relevé de jambes suspendu','Abdominaux','Poids du corps','Avancé',['Abdominaux'],[],'🧗'],
 ['Relevé de jambes au sol','Abdominaux','Poids du corps','Débutant',['Abdominaux'],[],'🦵'],
 ['Planche','Abdominaux','Poids du corps','Débutant',['Abdominaux','Lombaires'],[],'🧘'],
 ['Planche latérale','Abdominaux','Poids du corps','Débutant',['Obliques'],[],'🧘'],
 ['Russian Twist','Abdominaux','Poids du corps','Intermédiaire',['Obliques'],[],'🌀'],
 ['Roulette abdominale','Abdominaux','Poids du corps','Avancé',['Abdominaux'],['Lombaires'],'⚙️'],
 ['Mountain Climbers','Abdominaux','Poids du corps','Débutant',['Abdominaux'],['Quadriceps'],'⛰️'],
 ['Vacuum abdominal','Abdominaux','Poids du corps','Intermédiaire',['Transverse'],[],'🌬️'],
 // FESSIERS
 ['Hip Thrust barre','Fessiers','Barre','Intermédiaire',['Fessiers'],['Ischios'],'🍑'],
 ['Hip Thrust machine','Fessiers','Machine','Débutant',['Fessiers'],[],'🍑'],
 ['Pont fessier','Fessiers','Poids du corps','Débutant',['Fessiers'],[],'🍑'],
 ['Kickback poulie','Fessiers','Poulie','Débutant',['Fessiers'],[],'🦵'],
 ['Abduction machine','Abducteurs','Machine','Débutant',['Abducteurs'],['Fessiers'],'🦵'],
 ['Adduction machine','Adducteurs','Machine','Débutant',['Adducteurs'],[],'🦵'],
 ['Fentes bulgares','Fessiers','Haltères','Intermédiaire',['Fessiers','Quadriceps'],[],'🦵'],
 ['Abduction élastique','Abducteurs','Élastique','Débutant',['Abducteurs'],[],'🦵'],
 // QUADRICEPS
 ['Squat barre','Quadriceps','Barre','Avancé',['Quadriceps','Fessiers'],['Lombaires'],'🏋️'],
 ['Front Squat','Quadriceps','Barre','Avancé',['Quadriceps'],['Abdominaux'],'🏋️'],
 ['Squat Smith','Quadriceps','Machine','Intermédiaire',['Quadriceps','Fessiers'],[],'🏋️'],
 ['Presse à cuisses','Quadriceps','Machine','Débutant',['Quadriceps','Fessiers'],[],'🛷'],
 ['Hack Squat','Quadriceps','Machine','Intermédiaire',['Quadriceps'],['Fessiers'],'🛷'],
 ['Leg Extension','Quadriceps','Machine','Débutant',['Quadriceps'],[],'🦵'],
 ['Fentes avant','Quadriceps','Haltères','Débutant',['Quadriceps','Fessiers'],[],'🚶'],
 ['Fentes marchées','Quadriceps','Haltères','Intermédiaire',['Quadriceps','Fessiers'],[],'🚶'],
 ['Goblet Squat','Quadriceps','Kettlebell','Débutant',['Quadriceps'],['Fessiers'],'🏋️'],
 ['Squat poids du corps','Quadriceps','Poids du corps','Débutant',['Quadriceps'],['Fessiers'],'🦵'],
 ['Wall Sit','Quadriceps','Poids du corps','Débutant',['Quadriceps'],[],'🧱'],
 // ISCHIOS
 ['Leg Curl allongé','Ischios','Machine','Débutant',['Ischios'],[],'🦵'],
 ['Leg Curl assis','Ischios','Machine','Débutant',['Ischios'],[],'🦵'],
 ['Nordic Curl','Ischios','Poids du corps','Avancé',['Ischios'],[],'🦵'],
 ['Soulevé jambes tendues haltères','Ischios','Haltères','Intermédiaire',['Ischios'],['Fessiers'],'🏋️'],
 // MOLLETS
 ['Mollets debout','Mollets','Machine','Débutant',['Mollets'],[],'🦵'],
 ['Mollets assis','Mollets','Machine','Débutant',['Mollets'],[],'🦵'],
 ['Mollets à la presse','Mollets','Machine','Débutant',['Mollets'],[],'🛷'],
 ['Mollets unilatéral haltère','Mollets','Haltères','Débutant',['Mollets'],[],'🦵'],
 // COU
 ['Extension de cou','Cou','Poids du corps','Intermédiaire',['Cou'],[],'🧣'],
 ['Flexion de cou','Cou','Poids du corps','Intermédiaire',['Cou'],[],'🧣'],
 // CORPS ENTIER
 ['Burpees','Corps entier','Poids du corps','Intermédiaire',['Corps entier'],['Pectoraux','Quadriceps'],'🤸'],
 ['Thruster','Corps entier','Barre','Avancé',['Quadriceps','Épaules'],['Fessiers'],'🏋️'],
 ['Clean & Press','Corps entier','Barre','Avancé',['Corps entier'],['Épaules','Dos'],'🏋️'],
 ['Kettlebell Swing','Corps entier','Kettlebell','Intermédiaire',['Fessiers','Dos'],['Ischios'],'🔔'],
 ['Snatch kettlebell','Corps entier','Kettlebell','Avancé',['Corps entier'],['Épaules'],'🔔'],
 ['Turkish Get-up','Corps entier','Kettlebell','Avancé',['Corps entier'],['Abdominaux'],'🔔']
];
// Construit la fiche tutoriel détaillée d'un exercice
/* ============ DÉMONSTRATIONS VIDÉO/GIF (free-exercise-db, domaine public) ============
   Source: github.com/yuhonas/free-exercise-db (The Unlicense — libre de droits).
   Chaque exercice a 2 images (0.jpg départ, 1.jpg fin) ; on les alterne pour
   créer une animation type GIF du mouvement. */
const EXDB_BASE='https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';
const EXDB_MAP={
 'Bench Press':'Barbell_Bench_Press_-_Medium_Grip','Développé couché barre':'Barbell_Bench_Press_-_Medium_Grip',
 'Développé incliné barre':'Barbell_Incline_Bench_Press_-_Medium_Grip','Développé incliné haltères':'Incline_Dumbbell_Press',
 'Développé couché haltères':'Dumbbell_Bench_Press','Decline Bench Press':'Decline_Barbell_Bench_Press','Développé décliné barre':'Decline_Barbell_Bench_Press',
 'Écarté couché haltères':'Dumbbell_Flyes','Écarté incliné haltères':'Incline_Dumbbell_Flyes','Lever Seated Fly':'Butterfly',
 'Pec Deck (machine)':'Butterfly','Cable Crossover':'Cable_Crossover','Crossover poulie':'Cable_Crossover','Écarté poulie haute':'Cable_Crossover',
 'Pompes':'Pushups','Push Up':'Pushups','Pompes diamant':'Push-Ups_-_Close_Triceps_Position','Pompes déclinées':'Decline_Push-Up',
 'Dips pectoraux':'Dips_-_Chest_Version','Dips pectoraux ':'Dips_-_Chest_Version','Pullover haltère':'Bent-Arm_Dumbbell_Pullover','Dumbbell Pullover':'Bent-Arm_Dumbbell_Pullover',
 'Soulevé de terre':'Barbell_Deadlift','Deadlift':'Barbell_Deadlift','Soulevé de terre roumain':'Romanian_Deadlift',
 'Rowing barre buste penché':'Bent_Over_Barbell_Row','Bent Over Row':'Bent_Over_Barbell_Row','Rowing T-bar':'T-Bar_Row_with_Handle','Lever Lying T-bar Row':'T-Bar_Row_with_Handle',
 'Rowing haltère unilatéral':'One-Arm_Dumbbell_Row','Single Arm Dumbbell Row':'One-Arm_Dumbbell_Row','Rowing poulie basse':'Seated_Cable_Rows','Straight Back Seated Row':'Seated_Cable_Rows','Rowing machine assise':'Seated_Cable_Rows',
 'Tirage vertical poulie':'Wide-Grip_Lat_Pulldown','Bar Lateral Pulldown':'Wide-Grip_Lat_Pulldown','Tirage nuque':'Wide-Grip_Rear_Pull-Up',
 'Tractions pronation':'Pullups','Pull Up':'Pullups','Tractions supination':'Chin-Up','Pull-over poulie':'Straight-Arm_Pulldown',
 'Good Morning':'Good_Morning','Hyperextension lombaire':'Hyperextensions_-_Back_Extensions','45° One Leg Hyperextension':'Hyperextensions_-_Back_Extensions','Superman au sol':'Superman',
 'Développé militaire barre':'Standing_Military_Press','Développé haltères assis':'Dumbbell_Shoulder_Press','Seated Shoulder Press':'Dumbbell_Shoulder_Press','Développé Arnold':'Arnold_Dumbbell_Press','Développé machine épaules':'Machine_Shoulder_(Military)_Press','Lever Seated Shoulder Press':'Machine_Shoulder_(Military)_Press',
 'Élévations latérales':'Side_Lateral_Raise','Lateral Raise':'Side_Lateral_Raise','Élévations latérales poulie':'Cable_Seated_Lateral_Raise',
 'Élévations frontales':'Front_Dumbbell_Raise','Front Raise':'Front_Dumbbell_Raise','Oiseau (rear delt)':'Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench','Lever Reverse Fly':'Reverse_Machine_Flyes',
 'Face Pull poulie':'Face_Pull','Cable Face Pull':'Face_Pull','Rowing menton':'Upright_Barbell_Row','Upright Row':'Upright_Barbell_Row',
 'Shrug barre':'Barbell_Shrug','Shrug haltères':'Dumbbell_Shrug',
 'Curl barre EZ':'Barbell_Curl','Biceps Curl':'Barbell_Curl','Curl haltères':'Dumbbell_Bicep_Curl','Curl marteau':'Hammer_Curls','Hammer Curl':'Hammer_Curls',
 'Curl incliné':'Incline_Dumbbell_Curl','Curl concentré':'Concentration_Curls','Curl pupitre (Preacher)':'Preacher_Curl','Lever Preacher Curl':'Preacher_Curl','Curl poulie basse':'Cable_Hammer_Curls_-_Rope_Attachment',
 'Barre au front (Skull Crusher)':'Lying_Triceps_Press','Skull Crusher':'Lying_Triceps_Press','Extension poulie haute':'Triceps_Pushdown','Triceps Pushdown':'Triceps_Pushdown','Extension poulie corde':'Triceps_Pushdown_-_Rope_Attachment',
 'Extension nuque haltère':'Seated_Triceps_Press','Kickback haltère':'Tricep_Dumbbell_Kickback','Dips entre bancs':'Bench_Dips','Elbow Dips':'Bench_Dips','Développé couché serré':'Close-Grip_Barbell_Bench_Press',
 'Curl poignets':'Palms-Down_Wrist_Curl_Over_A_Bench','Curl poignets inversé':'Palms-Up_Barbell_Wrist_Curl_Over_A_Bench','Marche du fermier':'Farmers_Walk','Farmer Walk':'Farmers_Walk',
 'Crunch':'Crunches','Crunch poulie':'Cable_Crunch','Cable Crunch':'Cable_Crunch','Relevé de jambes suspendu':'Hanging_Leg_Raise','Hanging Leg Raise':'Hanging_Leg_Raise','Relevé de jambes au sol':'Flat_Bench_Lying_Leg_Raise',
 'Planche':'Plank','Plank':'Plank','Russian Twist':'Russian_Twist','Roulette abdominale':'Ab_Roller','Ab Wheel Rollout':'Ab_Roller','Mountain Climbers':'Mountain_Climbers',
 'Hip Thrust barre':'Barbell_Hip_Thrust','Hip Thrust':'Barbell_Hip_Thrust','Lever Hip Thrust':'Barbell_Hip_Thrust','Pont fessier':'Butt_Lift_(Bridge)','Glute Bridge':'Butt_Lift_(Bridge)',
 'Abduction machine':'Thigh_Abductor','Lever Seated Hip Abduction':'Thigh_Abductor','Adduction machine':'Thigh_Adductor','Lever Seated Hip Adduction':'Thigh_Adductor','Fentes bulgares':'Dumbbell_Lunges','Bulgarian Split Squat':'Dumbbell_Lunges',
 'Squat barre':'Barbell_Full_Squat','Back Squat':'Barbell_Full_Squat','Front Squat':'Front_Barbell_Squat','Squat Smith':'Smith_Machine_Squat','Smith Squat':'Smith_Machine_Squat',
 'Presse à cuisses':'Leg_Press','Sled 45° Leg Press':'Leg_Press','Sled 45° Leg Wide Press':'Leg_Press','Hack Squat':'Hack_Squat','Leg Extension':'Leg_Extensions','Lever Leg Extension':'Leg_Extensions','Lever Seated Leg Extension':'Leg_Extensions',
 'Fentes avant':'Dumbbell_Lunges','Fentes marchées':'Dumbbell_Walking_Lunge','Walking Lunge':'Dumbbell_Walking_Lunge','Dumbbell Split Squat':'Dumbbell_Lunges','Goblet Squat':'Goblet_Squat','Squat poids du corps':'Bodyweight_Squat',
 'Leg Curl allongé':'Lying_Leg_Curls','Lever Lying Leg Curl':'Lying_Leg_Curls','Leg Curl assis':'Seated_Leg_Curl','Lever Kneeling Leg Curl':'Standing_Leg_Curl','Nordic Curl':'Lying_Leg_Curls','Nordic Hamstring Curl':'Lying_Leg_Curls','Soulevé jambes tendues haltères':'Stiff-Legged_Dumbbell_Deadlift',
 'Mollets debout':'Standing_Calf_Raises','Standing Calf Raise':'Standing_Calf_Raises','Mollets assis':'Seated_Calf_Raise','Lever Seated Calf Raise':'Seated_Calf_Raise','Lever Seated One Leg Calf Raise':'Seated_Calf_Raise','Mollets à la presse':'Calf_Press_On_The_Leg_Press_Machine',
 'Burpees':'Burpee','Thruster':'Thrusters','Clean & Press':'Clean_and_Press','Kettlebell Swing':'Kettlebell_One-Legged_Deadlift','EZ-bar 21s':'Barbell_Curl'
};
function exGif(name){
  const id=EXDB_MAP[name]; if(!id) return null;
  return [EXDB_BASE+id+'/0.jpg', EXDB_BASE+id+'/1.jpg'];
}
function exMeta(name){
  const d=XDATA.find(x=>x[0]===name);
  let base;
  if(d){ base={name:d[0],group:d[1],equip:d[2],level:d[3],primary:d[4],secondary:d[5],anim:d[6]}; }
  else { const o=LIB.find(e=>e.name===name); if(!o) return null;
    base={name:o.name,group:(o.muscles&&o.muscles[0])||'Corps entier',equip:'Machine',level:'Intermédiaire',primary:o.muscles||[],secondary:[],anim:o.anim||'🏋️',tip:o.tip}; }
  base.gif=exGif(name);
  return enrichFiche(base);
}
function enrichFiche(b){
  const g=b.group;
  const breathByGroup='Inspire pendant la phase négative (descente/étirement), expire pendant l\u2019effort (poussée/contraction).';
  // Génère une fiche complète et cohérente
  b.steps=[
    'Position de départ : installe-toi correctement, dos gainé, regard neutre.',
    'Contracte les muscles cibles avant de débuter le mouvement.',
    'Réalise la phase concentrique de façon contrôlée, sans à-coup.',
    'Marque une courte pause en contraction maximale.',
    'Reviens lentement en contrôlant la phase excentrique (2-3 s).'
  ];
  b.breathing=breathByGroup;
  b.mistakes=[
    'Utiliser une charge trop lourde au détriment de la technique.',
    'Manquer d\u2019amplitude (mouvement trop court).',
    'Prendre de l\u2019élan / tricher avec le dos.',
    'Aller trop vite et négliger la phase excentrique.'
  ];
  b.tips=[
    'Privilégie la connexion muscle-esprit : sens le muscle travailler.',
    'Reste sur 2-3 RIR (répétitions en réserve) pour progresser sainement.',
    b.tip||'Garde une exécution propre sur toutes les répétitions.'
  ];
  b.safety=[
    'Échauffe-toi avec des séries légères avant les séries lourdes.',
    'Garde le dos neutre, ne bloque jamais complètement les articulations.',
    'Arrête immédiatement en cas de douleur articulaire vive.'
  ];
  // variantes : autres exercices du même groupe
  b.variants=XDATA.filter(x=>x[1]===g && x[0]!==b.name).slice(0,4).map(x=>x[0]);
  return b;
}
// Liste unifiée (étendue + ancienne) sans doublons, pour le navigateur
function allExercises(){
  const names=new Set();
  const out=[];
  XDATA.forEach(x=>{ if(!names.has(x[0])){ names.add(x[0]); out.push({name:x[0],group:x[1],equip:x[2],level:x[3],primary:x[4],secondary:x[5],anim:x[6]}); } });
  LIB.forEach(o=>{ if(!names.has(o.name)){ names.add(o.name); out.push({name:o.name,group:(o.muscles&&o.muscles[0])||'Corps entier',equip:'Machine',level:'Intermédiaire',primary:o.muscles||[],secondary:[],anim:o.anim||'🏋️',tip:o.tip}); } });
  return out;
}
function findEx(name){ return LIB.find(e=>e.name===name) || (function(){ const d=XDATA.find(x=>x[0]===name); return d?{name:d[0],muscles:d[4],anim:d[6],tip:''}:null; })(); }
function ex(name,sets,reps){ const e=findEx(name)||{name,muscles:[],anim:'🏋️',tip:''}; return {name:e.name,sets,reps,muscles:e.muscles,anim:e.anim,tip:e.tip||''}; }

/* ---------- 6 DEFAULT PROGRAMS ---------- */
const PROGS=[
 {id:'A',name:'Poitrine & Triceps',color:'--e',ex:[ex('Decline Bench Press',4,'12'),ex('Bench Press',4,'12'),ex('Dumbbell Incline Bench Press',4,'12'),ex('Lever Seated Fly',3,'8'),ex('Skull Crusher',4,'12'),ex('Elbow Dips',3,'6-8'),ex('Triceps Pushdown',4,'12')]},
 {id:'B',name:'Dos & Biceps',color:'--e',ex:[ex('Lever Lying T-bar Row',3,'10-12'),ex('Straight Back Seated Row',3,'6-10'),ex('Bar Lateral Pulldown',3,'8-10'),ex('EZ-bar 21s',4,'21'),ex('Hammer Curl',4,'6-12'),ex('Biceps Curl',4,'12'),ex('Lever Preacher Curl',3,'4-10')]},
 {id:'C',name:'Épaules & Jambes',color:'--e',ex:[ex('Seated Shoulder Press',4,'8'),ex('Lever Seated Shoulder Press',3,'10-12'),ex('Lateral Raise',4,'12'),ex('Front Raise',4,'12'),ex('Cable Face Pull',4,'12-15'),ex('Lever Leg Extension',4,'8-12'),ex('Lever Lying Leg Curl',4,'6-12'),ex('Sled 45° Leg Wide Press',4,'8-12'),ex('Lever Seated Calf Raise',4,'12')]},
 {id:'D',name:'Jambes Fessiers',color:'--e',ex:[ex('Lever Seated Hip Abduction',3,'12-15'),ex('Sled 45° Leg Press',3,'10-12'),ex('Lever Seated Hip Adduction',3,'12-15'),ex('Hip Thrust',3,'10-12'),ex('45° One Leg Hyperextension',3,'12'),ex('Smith Squat',3,'10-12'),ex('Lever Hip Thrust',3,'12')]},
 {id:'E',name:'Jambes Ischio & Mollets',color:'--e',ex:[ex('Lever Hip Thrust',3,'12'),ex('Lever Leg Extension',3,'12-15'),ex('Lever Seated Leg Extension',3,'12'),ex('Dumbbell Split Squat',3,'10'),ex('Lever Kneeling Leg Curl',3,'10-12'),ex('Nordic Hamstring Curl',3,'6-8'),ex('Lever Seated One Leg Calf Raise',3,'15')]},
 {id:'F',name:'Dos Épaules & Bras',color:'--e',ex:[ex('Bar Lateral Pulldown',4,'8-10'),ex('Straight Back Seated Row',4,'6-10'),ex('Lever Lying T-bar Row',3,'10-12'),ex('Seated Shoulder Press',4,'8'),ex('Lever Seated Shoulder Press',3,'10'),ex('Cable Face Pull',3,'12'),ex('Hammer Curl',3,'6-12')]}
];
function allProgs(){ return [...PROGS,...CUSTOM]; }

/* ---------- RUN PLAN GENERATOR ---------- */
const TYPE_COLORS={EF:'--ok','Tempo':'--warn','Seuil':'--or','VMA':'--bad','Intervalle':'--bad','Récup':'--dim','Long':'--e','Course':'--e','Repos':'--dim'};

/* Assigne les types aux jours dispo en respectant les préférences utilisateur */
function assignTypesToDays(days,types,isLastWeek){
  const result=new Array(days.length).fill(null);
  const pool=[...types];
  const place=(prefDow,matchFn)=>{
    if(prefDow===undefined||prefDow===null||prefDow==='') return;
    const di=days.indexOf(+prefDow); if(di<0||result[di]) return;
    const ti=pool.findIndex(matchFn); if(ti<0) return;
    result[di]=pool.splice(ti,1)[0];
  };
  place(PREFS.longDay, t=>t==='Long');
  place(PREFS.fractioDay, t=>t==='VMA'||t==='Seuil');
  place(PREFS.recupDay, t=>t==='Récup');
  // remplit le reste
  for(let i=0;i<result.length;i++){ if(!result[i]) result[i]=pool.shift()||'EF'; }
  return result;
}

/* Construit une séance ULTRA détaillée (objectif, échauffement, corps, récup,
   allures, conseils, erreurs, pourquoi) — compréhensible par un débutant */
function buildSession(type,o){
  const{vdot,pEF,pTempo,pSeuil,pVMA,easyKm,wkKm,phase}=o;
  const P_EF=spkToStr(pEF), P_RC=spkToStr(pEF*1.06), P_TP=spkToStr(pTempo), P_SE=spkToStr(pSeuil), P_VM=spkToStr(pVMA);
  let km,pace,rpe,title,d={};
  if(type==='EF'){
    km=easyKm; pace=P_EF; rpe=3; title='Endurance Fondamentale';
    d={ objectif:'Développer ta base aérobie et ton endurance sans fatiguer l\u2019organisme.',
      warmup:'Pas d\u2019échauffement spécifique : les 10 premières minutes servent de mise en route progressive.',
      body:km+' km à allure facile ('+P_EF+'/km). Tu dois pouvoir parler en courant. Si tu es essoufflé, ralentis.',
      cooldown:'Marche 3 min puis quelques étirements doux des mollets et ischios.',
      paces:'Allure cible : '+P_EF+'/km (zone 2, ~70% FCmax).',
      recovery:'Aucune récup pendant : c\u2019est un effort continu et régulier.',
      tips:['Respire par le ventre, garde les épaules basses.','La régularité prime sur la vitesse.'],
      mistakes:['Courir trop vite « pour le plaisir » → tu accumules de la fatigue inutile.','Sauter cette séance car « trop facile » : c\u2019est 80% de ta progression.'],
      why:'80% du volume des meilleurs coureurs est en endurance fondamentale. Elle développe ton cœur, tes mitochondries et tes capillaires sans risque de blessure.' };
  } else if(type==='Récup'){
    km=Math.max(4,Math.round(easyKm*0.7)); pace=P_RC; rpe=2; title='Footing de récupération';
    d={ objectif:'Favoriser la récupération active après une séance dure.',
      warmup:'Aucun. Démarre très lentement.',
      body:km+' km en footing très souple à '+P_RC+'/km. Plus lent que d\u2019habitude, volontairement.',
      cooldown:'Étirements légers + automassage si tu as un rouleau.',
      paces:'Allure très lente : '+P_RC+'/km. Reste en zone 1.',
      recovery:'Effort continu mais minimal.',
      tips:['Si tu te sens cassé, remplace par 20 min de marche.','Hydrate-toi bien après.'],
      mistakes:['Transformer le footing récup en footing normal → tu ne récupères pas.'],
      why:'Le sang circule, évacue les déchets musculaires et accélère la récupération sans créer de stress.' };
  } else if(type==='Tempo'){
    km=Math.max(6,Math.round(easyKm)); pace=P_TP; rpe=6; title='Tempo Run';
    d={ objectif:'Habituer ton corps à tenir une allure soutenue et confortable sur la durée.',
      warmup:'15 min footing en '+P_EF+'/km + 3 lignes droites progressives.',
      body:'20 à 25 min en continu à '+P_TP+'/km (allure « confortablement difficile »).',
      cooldown:'10 min footing très lent + étirements.',
      paces:'Allure tempo : '+P_TP+'/km (~83% de ta VMA).',
      recovery:'Pas de récup : c\u2019est un bloc continu.',
      tips:['Tu dois pouvoir dire 2-3 mots, pas une phrase entière.','Garde une foulée fluide et relâchée.'],
      mistakes:['Partir trop vite et exploser au milieu.','Confondre tempo et sprint.'],
      why:'Le tempo améliore ton efficacité et repousse le seuil où l\u2019acide lactique s\u2019accumule.' };
  } else if(type==='Seuil'){
    km=Math.max(7,Math.round(easyKm*1.1)); pace=P_SE; rpe=7; title='Séance au Seuil';
    d={ objectif:'Repousser ton seuil lactique — le facteur n°1 de performance sur 5 km à semi.',
      warmup:'15-20 min footing '+P_EF+'/km + 4 lignes droites + gammes (montées de genoux, talons-fesses).',
      body:'4 à 5 × 1000 m à '+P_SE+'/km. Récup 1 min trot entre chaque répétition.',
      cooldown:'10 min footing lent + étirements complets.',
      paces:'Allure seuil : '+P_SE+'/km (~88% VMA).',
      recovery:'1 min de trot lent entre chaque 1000 m.',
      tips:['Toutes les répétitions doivent être à la même allure.','Concentre-toi sur la régularité, pas la première rép.'],
      mistakes:['Faire la 1ère trop vite et ralentir ensuite.','Récup trop courte → tu n\u2019y arrives plus.'],
      why:'Le seuil est l\u2019allure que tu peux tenir ~1h. L\u2019augmenter = courir plus vite plus longtemps.' };
  } else if(type==='VMA'){
    km=Math.max(6,Math.round(easyKm*0.95)); pace=P_VM; rpe=9; title='Séance VMA / Fractionné';
    d={ objectif:'Développer ta puissance aérobie maximale (VO2max) et ta vitesse de pointe.',
      warmup:'20 min footing + 5 lignes droites + 3 accélérations courtes. Échauffement OBLIGATOIRE.',
      body:'10 à 12 × 400 m à '+P_VM+'/km. Récup 200 m en trottinant (ou 1\u201930 marche).',
      cooldown:'10-15 min footing très lent : essentiel après l\u2019intensité.',
      paces:'Allure VMA : '+P_VM+'/km (~97-100% VMA). Rapide mais contrôlé.',
      recovery:'200 m de récup active entre chaque 400 m.',
      tips:['Vise la même allure sur toutes les répétitions.','Si tu ne tiens plus, arrête : mieux vaut 8 propres que 12 bâclées.'],
      mistakes:['Négliger l\u2019échauffement → blessure assurée.','Partir comme un sprinteur sur la 1ère.'],
      why:'La VMA est ton plafond de cylindrée. Plus elle est haute, plus toutes tes autres allures deviennent faciles.' };
  } else if(type==='Long'){
    km=Math.max(10,Math.round(wkKm*0.32)); pace=spkToStr(pEF*0.99); rpe=4; title='Sortie Longue';
    d={ objectif:'Construire ton endurance, ta résistance mentale et économiser ton énergie.',
      warmup:'Démarrage progressif sur les 10 premières minutes.',
      body:km+' km à allure endurance ('+spkToStr(pEF*0.99)+'/km). Tu peux finir un peu plus vite si tu te sens bien.',
      cooldown:'Marche 5 min + étirements + collation glucides/protéines dans les 30 min.',
      paces:'Allure : '+spkToStr(pEF*0.99)+'/km, stable.',
      recovery:'Continu. Ravitaille en eau si > 1h15.',
      tips:['Mange bien la veille.','Emporte de l\u2019eau et un gel si > 1h30.'],
      mistakes:['Partir trop vite et marcher à la fin.','Oublier de s\u2019alimenter sur les très longues.'],
      why:'La sortie longue augmente tes réserves de glycogène et apprend à ton corps à brûler les graisses.' };
  } else if(type==='Course'){
    km=5; pace=spkToStr(predictTime(vdot,5000)/5); rpe=10; title='🏆 Jour de Compétition';
    d={ objectif:'Réaliser ta meilleure performance — objectif : '+(P.goal||'ton record')+' !',
      warmup:'25-30 min : footing progressif + 5 lignes droites + 3 accélérations à allure course.',
      body:'5000 m à '+spkToStr(predictTime(vdot,5000)/5)+'/km. Gère : départ contrôlé, milieu solide, final tout donné.',
      cooldown:'15 min footing très lent dès l\u2019arrivée + étirements.',
      paces:'Allure objectif : '+spkToStr(predictTime(vdot,5000)/5)+'/km.',
      recovery:'—',
      tips:['Ne pars pas trop vite dans l\u2019euphorie.','Accroche un coureur de ton niveau.','Le dernier km, vide-toi.'],
      mistakes:['Partir 10 s/km trop vite → tu exploses au 3e km.','Mal dormir / mal manger la veille.'],
      why:'C\u2019est l\u2019aboutissement de toutes tes semaines de travail. Fais-toi confiance.' };
  } else {
    km=0; pace='—'; rpe=0; title='Repos complet';
    d={ objectif:'Laisser ton corps se reconstruire et progresser.',
      warmup:'—', body:'Repos total ou activité très douce (marche, mobilité).',
      cooldown:'—', paces:'—', recovery:'Journée OFF.',
      tips:['Dors 8h.','Hydrate-toi et mange équilibré.'],
      mistakes:['Culpabiliser de ne rien faire : le repos EST de l\u2019entraînement.'],
      why:'C\u2019est PENDANT le repos que ton corps assimile l\u2019entraînement et devient plus fort.' };
  }
  return {km,pace,rpe,title,detail:d};
}
/* ============================================================
   GÉNÉRATEUR DE PLAN — moteur scientifique périodisé
   Inspiré méthode norvégienne (double seuil, polarisation 80/20),
   périodisation classique + science moderne. Jamais 2 plans identiques.
   ============================================================ */
// PRNG seedé -> variété contrôlée et reproductible
function mulberry32(a){ return function(){ a|=0;a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return((t^t>>>14)>>>0)/4294967296; }; }
const PHASES=[
  {key:'PG', name:'Préparation générale', color:'--dim'},
  {key:'AERO', name:'Développement aérobie', color:'--ok'},
  {key:'VO2', name:'Développement VO₂max', color:'--bad'},
  {key:'SPE', name:'Développement spécifique', color:'--or'},
  {key:'PIC', name:'Pic de forme', color:'--e'},
  {key:'TAPER', name:'Affûtage', color:'--platine'}
];
function phaseDistribution(weeks){
  // proportions par phase, ajustées au nombre de semaines
  const prop=[0.18,0.24,0.20,0.20,0.10,0.08];
  let acc=0; const map=[];
  for(let i=0;i<PHASES.length;i++){
    let n=Math.max(i>=4?1:1,Math.round(weeks*prop[i]));
    map.push(n); acc+=n;
  }
  // ajuste pour matcher weeks exactement
  let diff=weeks-acc, i=1;
  while(diff!==0){ const idx=(i%4)+1; map[idx]+=Math.sign(diff); if(map[idx]<1)map[idx]=1; acc=map.reduce((a,b)=>a+b,0); diff=weeks-acc; i++; if(i>200)break; }
  const phaseByWeek=[]; let w=1;
  map.forEach((n,pi)=>{ for(let k=0;k<n;k++){ phaseByWeek[w++]=PHASES[pi]; } });
  for(;w<=weeks;w++) phaseByWeek[w]=PHASES[5];
  return phaseByWeek;
}
function generatePlan(){
  const vdot=getUserVDOT();
  if(!vdot){ toast('Profil incomplet : ajoute un chrono dans tes records'); return; }
  if(!P.compDate){ toast('Choisis une date de compétition'); return; }
  const days=(P.days&&P.days.length)?[...P.days].sort((a,b)=>a-b):[1,3,5,6];
  const today=new Date(); today.setHours(0,0,0,0);
  const comp=new Date(P.compDate); comp.setHours(0,0,0,0);
  let weeks=Math.max(2,Math.min(28,Math.ceil(daysBetween(today,comp)/7)));
  const phaseByWeek=phaseDistribution(weeks);
  // seed unique à chaque génération
  const seed=(Date.now()^Math.floor(Math.random()*1e9))>>>0;
  const rng=mulberry32(seed);
  const pick=arr=>arr[Math.floor(rng()*arr.length)];
  // allures
  const pace={ EF:paceFromPct(vdot,.70), RC:paceFromPct(vdot,.66), MAR:paceFromPct(vdot,.80),
    TEMPO:paceFromPct(vdot,.83), SEUIL:paceFromPct(vdot,.88), SPE:predictTime(vdot, raceMeters())/(raceMeters()/1000),
    VMAl:paceFromPct(vdot,.95), VMAc:paceFromPct(vdot,1.02), SPRINT:paceFromPct(vdot,1.10) };
  // volume : kmMin -> kmMax avec deload toutes 4 sem + taper
  const kmMin=P.kmWeekMin||P.kmWeek||35;
  const kmMax=P.kmWeekMax||Math.round((P.kmWeek||35)*1.6);
  const liked=(PREFS.likedTypes&&PREFS.likedTypes.length)?PREFS.likedTypes:null;
  const sessions=[]; let id=1;
  const goal=P.objGoal||'Record personnel';
  for(let w=1;w<=weeks;w++){
    const ph=phaseByWeek[w];
    const prog=(w-1)/(weeks-1||1);
    let wkKm;
    if(ph.key==='TAPER'){ const tp=(weeks-w); wkKm=Math.round(kmMax*(0.45+tp*0.12)); }
    else wkKm=Math.round(kmMin+(kmMax-kmMin)*Math.min(1,prog*1.25));
    const isDeload=(w%4===0)&&ph.key!=='TAPER'&&w<weeks-2;
    if(isDeload) wkKm=Math.round(wkKm*0.75);
    wkKm=Math.max(kmMin*0.7,Math.min(kmMax,wkKm));
    // composition de la semaine selon la phase
    const qualityCount=days.length>=5?(ph.key==='AERO'?2:ph.key==='PG'?1:3):(days.length>=4?2:1);
    const weekPlan=composeWeek(ph,days.length,qualityCount,isDeload,pick,rng,liked,w===weeks);
    const assigned=assignWeek(days,weekPlan);
    days.forEach((dow,di)=>{
      const d=new Date(today);
      d.setDate(today.getDate() + (w-1)*7 + ((dow - today.getDay()+7)%7));
      let type=assigned[di]||'EF';
      if(w===weeks && di===days.length-1) type='COURSE';
      const built=buildSessionV2(type,{vdot,pace,wkKm,nDays:days.length,phase:ph,rng,pick,isDeload,goal,w,weeks});
      const durMin=built.pace==='—'?0:Math.round(built.km*parseTime(built.pace)/60);
      sessions.push({ id:id++, week:w, phase:ph.name, phaseKey:ph.key, color:ph.color,
        date:dateKey(d), type:built.label, baseType:type, title:built.title,
        km:built.km, duration:durMin, pace:built.pace, rpe:built.rpe,
        desc:built.detail.objectif, detail:built.detail, deload:isDeload, done:false });
    });
  }
  PLAN={ created:todayKey(), vdot, weeks, seed, sessions, goal, race:P.objRace||'5 km' };
  DB.save('run_plan',PLAN);
  toast('🔥 Plan « '+(P.objRace||'course')+' » généré : '+weeks+' sem, '+sessions.length+' séances');
  burst(); renderSport();
}
function raceMeters(){ const m={'5 km':5000,'10 km':10000,'Semi-marathon':21097,'Marathon':42195,'Trail':21097,'Cross':8000,'Ultra':50000}; return m[P.objRace]||5000; }

/* ---------- CONFIGURATION DU PLAN (collecte des inputs avancés) ---------- */
const LIKED_TYPES=['VMA courte','VMA longue','Intervalles','Tempo','Seuil','Endurance fondamentale','Sortie longue','Double seuil','Fartlek','Côtes','Travail VO₂max','Travail à l\u2019allure spécifique','Récupération active'];
let setupTmp={};
function openPlanSetup(){
  setupTmp={
    objRace:P.objRace||'5 km', compDate:P.compDate||'', objProfile:P.objProfile||'Plate',
    objGoal:P.objGoal||'Record personnel', objTime:P.objTime||'',
    days:[...(P.days||[1,3,5,6])], kmWeekMin:P.kmWeekMin||P.kmWeek||35, kmWeekMax:P.kmWeekMax||Math.round((P.kmWeek||35)*1.6),
    likedTypes:[...((PREFS.likedTypes)||[])]
  };
  renderPlanSetup(); $('#ovProgTitle').textContent='Configurer mon plan'; openOv('ovProg');
}
function renderPlanSetup(){
  const s=setupTmp;
  const dn=['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  let h='<div class="field"><label>Course préparée</label><select class="inp" onchange="setupTmp.objRace=this.value">'+['5 km','10 km','Semi-marathon','Marathon','Ultra','Trail','Cross','Autre'].map(r=>'<option '+(s.objRace===r?'selected':'')+'>'+r+'</option>').join('')+'</select></div>';
  h+='<div class="field"><label>Date de la course</label><input class="inp" type="date" value="'+s.compDate+'" onchange="setupTmp.compDate=this.value"></div>';
  h+='<div class="field"><label>Profil du parcours</label><div class="pills">'+['Plate','Vallonnée','Montagne'].map(p=>'<div class="pill '+(s.objProfile===p?'on':'')+'" onclick="setupTmp.objProfile=\''+p+'\';renderPlanSetup()">'+p+'</div>').join('')+'</div></div>';
  h+='<div class="field"><label>Objectif</label><div class="pills">'+['Finir','Record personnel','Qualification','Podium','Victoire'].map(o=>'<div class="pill '+(s.objGoal===o?'on':'')+'" onclick="setupTmp.objGoal=\''+o+'\';renderPlanSetup()">'+o+'</div>').join('')+'</div></div>';
  h+='<div class="field"><label>Chrono visé (optionnel)</label><input class="inp" value="'+(s.objTime||'')+'" oninput="setupTmp.objTime=this.value" placeholder="ex: 18:30"></div>';
  h+='<div class="field"><label>Jours d\u2019entraînement</label><div class="pills">'+[1,2,3,4,5,6,0].map(d=>'<div class="pill '+(s.days.includes(d)?'on':'')+'" onclick="toggleSetupDay('+d+')">'+dn[d]+'</div>').join('')+'</div></div>';
  h+='<div class="row" style="gap:10px"><div class="field" style="flex:1"><label>Km/sem mini</label><input class="inp" type="number" value="'+s.kmWeekMin+'" oninput="setupTmp.kmWeekMin=+this.value"></div><div class="field" style="flex:1"><label>Km/sem maxi (pic)</label><input class="inp" type="number" value="'+s.kmWeekMax+'" oninput="setupTmp.kmWeekMax=+this.value"></div></div>';
  h+='<div class="field"><label>Séances préférées (le coach les privilégiera)</label><div class="pills">'+LIKED_TYPES.map(t=>'<div class="pill '+(s.likedTypes.includes(t)?'on':'')+'" onclick="toggleLiked(\''+t.replace(/'/g,"\\'")+'\')">'+t+'</div>').join('')+'</div></div>';
  h+='<button class="btn" onclick="confirmPlanSetup()">🔥 Générer mon plan</button>';
  $('#progBody').innerHTML=h;
}
function toggleSetupDay(d){ const i=setupTmp.days.indexOf(d); if(i>=0)setupTmp.days.splice(i,1); else setupTmp.days.push(d); renderPlanSetup(); }
function toggleLiked(t){ const i=setupTmp.likedTypes.indexOf(t); if(i>=0)setupTmp.likedTypes.splice(i,1); else setupTmp.likedTypes.push(t); renderPlanSetup(); }
function confirmPlanSetup(){
  const s=setupTmp;
  if(!s.compDate){ toast('Choisis une date de course'); return; }
  if(!s.days.length){ toast('Choisis au moins un jour'); return; }
  Object.assign(P,{objRace:s.objRace,compDate:s.compDate,objProfile:s.objProfile,objGoal:s.objGoal,objTime:s.objTime,days:s.days.sort((a,b)=>a-b),kmWeekMin:s.kmWeekMin,kmWeekMax:s.kmWeekMax});
  PREFS.likedTypes=s.likedTypes;
  saveAll(); closeOv('ovProg'); generatePlan();
}
// Compose la liste des types pour la semaine (variée, cohérente)
function composeWeek(ph,nDays,qCount,isDeload,pick,rng,liked,isRaceWeek){
  const easy=['EF','EF','RECUP'];
  let quality;
  if(ph.key==='PG') quality=['FARTLEK','COTES','TEMPO','LIGNES'];
  else if(ph.key==='AERO') quality=['TEMPO','SEUIL','PROGRESSIF','FARTLEK','COTES'];
  else if(ph.key==='VO2') quality=['VMAc','VMAl','VO2','INTERVAL','DBLSEUIL'];
  else if(ph.key==='SPE') quality=['SPE','SEUIL','VMAl','TEMPO_SPE','PROGRESSIF'];
  else if(ph.key==='PIC') quality=['VMAc','SPE','SEUIL'];
  else quality=['SPE_COURT','LIGNES','RECUP']; // taper
  if(liked){ // priorise les types aimés s'ils existent dans la phase
    const mapped=liked.map(likedToType).filter(Boolean);
    const inter=quality.filter(q=>mapped.includes(q));
    if(inter.length) quality=[...new Set([...inter,...quality])];
  }
  const week=[];
  // sortie longue (sauf taper deload léger)
  if(nDays>=3 && !isRaceWeek) week.push(ph.key==='TAPER'?'LONG_COURT':'LONG');
  // séances qualité
  let qn=Math.min(qCount,quality.length);
  const used=new Set();
  for(let i=0;i<qn;i++){ let t=pick(quality); let g=0; while(used.has(t)&&g<8){t=pick(quality);g++;} used.add(t); week.push(t); }
  // remplir le reste en endurance
  while(week.length<nDays) week.push(pick(easy));
  // mélange léger
  for(let i=week.length-1;i>0;i--){ const j=Math.floor(rng()*(i+1)); [week[i],week[j]]=[week[j],week[i]]; }
  return week;
}
function likedToType(l){ const m={'VMA courte':'VMAc','VMA longue':'VMAl','Intervalles':'INTERVAL','Tempo':'TEMPO','Seuil':'SEUIL','Endurance fondamentale':'EF','Sortie longue':'LONG','Double seuil':'DBLSEUIL','Fartlek':'FARTLEK','Côtes':'COTES','Travail VO₂max':'VO2','Travail à l\u2019allure spécifique':'SPE','Récupération active':'RECUP'}; return m[l]; }
// place les types sur les jours en respectant PREFS jour long/fractio/récup + espacement qualité
function assignWeek(days,weekPlan){
  const res=new Array(days.length).fill(null);
  const pool=[...weekPlan];
  const placePref=(prefDow,matchFn)=>{ if(prefDow===''||prefDow==null)return; const di=days.indexOf(+prefDow); if(di<0||res[di])return; const ti=pool.findIndex(matchFn); if(ti<0)return; res[di]=pool.splice(ti,1)[0]; };
  placePref(PREFS.longDay, t=>t.startsWith('LONG'));
  placePref(PREFS.fractioDay, t=>['VMAc','VMAl','VO2','INTERVAL','DBLSEUIL'].includes(t));
  placePref(PREFS.recupDay, t=>t==='RECUP');
  // place le reste en évitant 2 qualités consécutives si possible
  const isHard=t=>['VMAc','VMAl','VO2','INTERVAL','DBLSEUIL','SEUIL','SPE','TEMPO_SPE'].includes(t);
  const hard=pool.filter(isHard), easy=pool.filter(t=>!isHard(t));
  for(let i=0;i<res.length;i++){ if(res[i])continue;
    const prevHard=i>0&&res[i-1]&&isHard(res[i-1]);
    if(prevHard&&easy.length) res[i]=easy.shift();
    else if(hard.length) res[i]=hard.shift();
    else if(easy.length) res[i]=easy.shift();
    else res[i]='EF';
  }
  return res;
}
/* Construit une séance V2 ULTRA détaillée selon le type scientifique */
function buildSessionV2(type,o){
  const{vdot,pace,wkKm,nDays,phase,rng,pick,isDeload,goal,w,weeks}=o;
  const S=spkToStr;
  const easyKm=Math.max(5,Math.round(wkKm/nDays*0.95));
  const vary=(a,b)=>a+Math.round(rng()*(b-a)); // variabilité contrôlée
  let km,p,rpe,title,label,d={};
  const WU='15-20 min footing en '+S(pace.EF)+'/km + 4-5 lignes droites progressives + gammes (montées de genoux, talons-fesses, foulées bondissantes).';
  const CD='10-15 min footing très lent en '+S(pace.RC)+'/km + étirements doux.';
  switch(type){
    case 'EF':
      km=easyKm; p=S(pace.EF); rpe=3; label='EF'; title='Endurance Fondamentale';
      d={objectif:'Construire ta base aérobie — le socle de toute progression (80% du volume des élites).',warmup:'Mise en route progressive sur 10 min.',body:km+' km à allure facile ('+S(pace.EF)+'/km). Conversation possible en permanence.',paces:'Zone 2, ~70% FCmax — '+S(pace.EF)+'/km.',recovery:'Effort continu.',cooldown:'Quelques étirements des mollets et ischios.',tips:['Respire par le ventre.','La lenteur est volontaire et productive.'],mistakes:['Courir trop vite « par habitude ».'],why:'Développe le cœur, les capillaires et les mitochondries sans fatigue ni risque.'};
      break;
    case 'RECUP':
      km=Math.max(4,Math.round(easyKm*0.7)); p=S(pace.RC); rpe=2; label='Récup'; title='Récupération active';
      d={objectif:'Accélérer la récupération entre deux séances dures.',warmup:'Aucun.',body:km+' km très souple à '+S(pace.RC)+'/km.',paces:'Zone 1 — très lent.',recovery:'—',cooldown:'Automassage / mobilité.',tips:['Si très fatigué, remplace par 25 min de marche.'],mistakes:['Accélérer : tu sabotes la récup.'],why:'La circulation sanguine évacue les déchets et relance l\u2019adaptation.'};
      break;
    case 'LONG': case 'LONG_COURT':
      km=type==='LONG_COURT'?Math.round(wkKm*0.22):Math.round(wkKm*(phase.key==='SPE'?0.34:0.30));
      km=Math.max(8,km); p=S(pace.EF*0.99); rpe=4; label='Long'; title='Sortie Longue'+(phase.key==='SPE'?' progressive':'');
      d={objectif:'Développer l\u2019endurance, l\u2019économie de course et le mental.',warmup:'Départ progressif 10 min.',body:phase.key==='SPE'||phase.key==='PIC'?km+' km progressifs : 1ère moitié en '+S(pace.EF)+'/km, 2nde moitié en accélérant jusqu\u2019à '+S(pace.MAR)+'/km.':km+' km à allure endurance stable ('+S(pace.EF*0.99)+'/km).',paces:'EF '+S(pace.EF)+'/km → allure marathon '+S(pace.MAR)+'/km en fin.',recovery:'Continu, ravitaille si > 1h15.',cooldown:CD,tips:['Mange bien la veille.','Emporte eau + gel si > 1h30.'],mistakes:['Partir trop vite et marcher à la fin.'],why:'Augmente les réserves de glycogène et la capacité à utiliser les graisses.'};
      break;
    case 'TEMPO':
      km=Math.round(easyKm*1.1); p=S(pace.TEMPO); rpe=6; label='Tempo'; title='Tempo Run';
      const tmin=vary(20,30);
      d={objectif:'Améliorer l\u2019efficacité et l\u2019endurance à allure soutenue.',warmup:WU,body:tmin+' min en continu à '+S(pace.TEMPO)+'/km (« confortablement difficile »).',paces:'~83% VMA — '+S(pace.TEMPO)+'/km.',recovery:'Bloc continu.',cooldown:CD,tips:['Tu dois pouvoir dire 2-3 mots, pas une phrase.'],mistakes:['Partir trop vite et exploser.'],why:'Repousse le seuil d\u2019accumulation du lactate.'};
      break;
    case 'TEMPO_SPE':
      km=Math.round(easyKm*1.1); p=S(pace.SPE*1.02); rpe=6; label='Tempo spé'; title='Tempo allure spécifique';
      d={objectif:'Te familiariser avec l\u2019allure de ta course objectif ('+goal+').',warmup:WU,body:vary(2,3)+' × 2 km à allure spécifique '+S(pace.SPE)+'/km, récup 2 min.',paces:'Allure course : '+S(pace.SPE)+'/km.',recovery:'2 min trot entre blocs.',cooldown:CD,tips:['Mémorise les sensations de cette allure.'],mistakes:['Aller plus vite que l\u2019allure cible.'],why:'L\u2019allure spécifique doit devenir automatique le jour J.'};
      break;
    case 'SEUIL':
      const reps=vary(4,6); p=S(pace.SEUIL); km=Math.round(easyKm*1.2); rpe=7; label='Seuil'; title='Séance au Seuil';
      d={objectif:'Repousser le seuil lactique — facteur n°1 de performance.',warmup:WU,body:reps+' × 1000 m à '+S(pace.SEUIL)+'/km, récup 1 min trot.',paces:'~88% VMA — '+S(pace.SEUIL)+'/km.',recovery:'1 min trot entre chaque.',cooldown:CD,tips:['Toutes les reps à la même allure.'],mistakes:['Partir trop fort sur la 1ère.'],why:'Le seuil est l\u2019allure tenable ~1h ; l\u2019élever rend tout plus facile.'};
      break;
    case 'DBLSEUIL':
      p=S(pace.SEUIL); km=Math.round(easyKm*1.15); rpe=7; label='Double seuil'; title='Double Seuil (méthode norvégienne)';
      d={objectif:'Maximiser le volume au seuil sans fatigue excessive (clé norvégienne).',warmup:WU,body:'Matin : 5 × 6 min à '+S(pace.SEUIL*1.01)+'/km (récup 1 min). Soir : 10 × 400 m à '+S(pace.SEUIL)+'/km (récup 30 s). Reste sous-maximal.',paces:'Seuil contrôlé '+S(pace.SEUIL)+'/km — lactate ~2-4 mmol.',recovery:'Récup courte, intensité maîtrisée.',cooldown:CD,tips:['Ne jamais finir épuisé : tu dois pouvoir refaire la séance.'],mistakes:['Transformer le seuil en VMA.'],why:'Double dose de stimulus seuil pour une fatigue minimale — signature des Ingebrigtsen.'};
      break;
    case 'VMAc':
      const rc=vary(8,12); p=S(pace.VMAc); km=Math.round(easyKm); rpe=9; label='VMA courte'; title='VMA Courte';
      d={objectif:'Développer la vVO2max et la vitesse de pointe.',warmup:WU+' Échauffement OBLIGATOIRE.',body:rc+' × 300 m à '+S(pace.VMAc)+'/km, récup 1 min trot. (ou 30/30 : '+vary(12,16)+' × 30 s vite / 30 s lent).',paces:'~100-102% VMA.',recovery:'1 min trot / 30 s.',cooldown:CD,tips:['Même allure sur toutes les reps.'],mistakes:['Négliger l\u2019échauffement → blessure.'],why:'Stimule le VO₂max et l\u2019économie neuromusculaire.'};
      break;
    case 'VMAl': case 'VO2':
      const rl=vary(5,7); p=S(pace.VMAl); km=Math.round(easyKm*1.1); rpe=9; label=type==='VO2'?'VO₂max':'VMA longue'; title=type==='VO2'?'Séance VO₂max':'VMA Longue';
      d={objectif:'Élever le VO₂max — ta cylindrée maximale.',warmup:WU,body:rl+' × 1000 m à '+S(pace.VMAl)+'/km, récup 2-3 min trot. (ou '+vary(4,5)+' × 1200 m).',paces:'~95-98% VMA — '+S(pace.VMAl)+'/km.',recovery:'2-3 min trot.',cooldown:CD,tips:['Régularité avant tout.','Arrête si tu ne tiens plus l\u2019allure.'],mistakes:['Récup trop courte.'],why:'Le temps passé à ~90-100% VO₂max augmente ta puissance aérobie maximale.'};
      break;
    case 'INTERVAL':
      const ri=vary(6,10); p=S(pace.VMAl); km=Math.round(easyKm); rpe=8; label='Intervalles'; title='Intervalles mixtes';
      d={objectif:'Travail mixte vitesse-endurance.',warmup:WU,body:'Pyramide : 200-400-600-800-600-400-200 m à allures '+S(pace.VMAc)+' à '+S(pace.SEUIL)+'/km, récup = durée de l\u2019effort.',paces:'VMA → seuil.',recovery:'Récup active égale à l\u2019effort.',cooldown:CD,tips:['Gère l\u2019allure selon la distance.'],mistakes:['Tout faire à la même vitesse.'],why:'Combine plusieurs filières énergétiques.'};
      break;
    case 'SPE': case 'SPE_COURT':
      const reps2=type==='SPE_COURT'?vary(3,4):vary(4,6); p=S(pace.SPE); km=Math.round(easyKm*1.1); rpe=8; label='Allure spé'; title='Allure Spécifique '+(P.objRace||'');
      d={objectif:'Ancrer l\u2019allure exacte de ta course ('+goal+').',warmup:WU,body:reps2+' × 1000 m à allure course '+S(pace.SPE)+'/km, récup 90 s.',paces:'Allure objectif : '+S(pace.SPE)+'/km.',recovery:'90 s trot.',cooldown:CD,tips:['Cette allure doit devenir un réflexe.'],mistakes:['Aller plus vite par excès de confiance.'],why:'La spécificité prime à l\u2019approche de la course.'};
      break;
    case 'PROGRESSIF':
      km=Math.round(easyKm*1.2); p=S(pace.MAR); rpe=6; label='Progressif'; title='Run Progressif';
      d={objectif:'Apprendre à accélérer sur la fatigue.',warmup:'10 min '+S(pace.EF)+'/km.',body:km+' km en 3 paliers : '+S(pace.EF)+' → '+S(pace.MAR)+' → '+S(pace.TEMPO)+'/km.',paces:'EF → tempo.',recovery:'Continu.',cooldown:CD,tips:['Chaque palier un peu plus vite.'],mistakes:['Partir trop vite.'],why:'Renforce le mental et le négatif split.'};
      break;
    case 'FARTLEK':
      km=Math.round(easyKm*1.1); p=S(pace.TEMPO); rpe=6; label='Fartlek'; title='Fartlek (jeu d\u2019allures)';
      d={objectif:'Travail au ressenti, ludique et libre.',warmup:'15 min '+S(pace.EF)+'/km.',body:vary(8,12)+' × (1 min vite / 1 min lent) au ressenti, dans la nature.',paces:'Vite ≈ '+S(pace.VMAl)+'/km, lent ≈ '+S(pace.EF)+'/km.',recovery:'Récup active libre.',cooldown:CD,tips:['Joue avec le terrain.'],mistakes:['Trop structurer : laisse-toi aller.'],why:'Développe le VO₂max en s\u2019amusant et casse la routine.'};
      break;
    case 'COTES':
      km=Math.round(easyKm); p=S(pace.SEUIL); rpe=8; label='Côtes'; title='Séance de Côtes';
      d={objectif:'Développer puissance, force et économie de course.',warmup:WU,body:vary(8,12)+' × 30-45 s en côte (4-6%) à effort soutenu, récup en descente trot.',paces:'Effort à ~90%.',recovery:'Descente en récup.',cooldown:CD,tips:['Foulée courte et dynamique, regarde devant.'],mistakes:['Descendre trop vite (impact).'],why:'La côte = musculation spécifique sans impact traumatisant.'};
      break;
    case 'LIGNES':
      km=Math.round(easyKm*0.8); p=S(pace.EF); rpe=4; label='Lignes'; title='Footing + Lignes droites';
      d={objectif:'Entretenir la vitesse et la fraîcheur (idéal taper).',warmup:'10 min '+S(pace.EF)+'/km.',body:Math.round(km*0.7)+' km EF + '+vary(6,8)+' × 80-100 m en accélération progressive (sans forcer), récup marche.',paces:'EF + accélérations relâchées.',recovery:'Marche/trot entre lignes.',cooldown:'Étirements.',tips:['Reste relâché, ne sprinte pas.'],mistakes:['Forcer sur les lignes en période d\u2019affûtage.'],why:'Garde le système nerveux affûté sans fatigue.'};
      break;
    case 'COURSE':
      const m=raceMeters(); km=Math.round(m/1000); p=S(predictTime(vdot,m)/(m/1000)); rpe=10; label='Course'; title='🏆 Jour J — '+(P.objRace||'Compétition');
      d={objectif:'Réaliser ta meilleure performance — objectif : '+(P.objTime||goal)+' !',warmup:'25-30 min : footing progressif + lignes droites + 3 accélérations allure course.',body:km+' km à '+S(predictTime(vdot,m)/(m/1000))+'/km. Départ contrôlé, milieu solide, final tout donné.',paces:'Allure objectif : '+S(predictTime(vdot,m)/(m/1000))+'/km.',recovery:'—',cooldown:'15 min footing dès l\u2019arrivée + étirements.',tips:['Ne pars pas trop vite.','Accroche un coureur de ton niveau.'],mistakes:['Mal dormir / mal manger la veille.'],why:'L\u2019aboutissement de toute ta préparation. Fais-toi confiance !'};
      break;
    default:
      km=easyKm; p=S(pace.EF); rpe=3; label='EF'; title='Endurance';
      d={objectif:'Endurance.',warmup:'-',body:km+' km facile.',paces:S(pace.EF)+'/km',recovery:'-',cooldown:'-',tips:[],mistakes:[],why:'Base aérobie.'};
  }
  if(isDeload && km>0){ km=Math.round(km*0.8); d.objectif='🟢 SEMAINE ALLÉGÉE — '+d.objectif; }
  return {km,pace:p,rpe,title,label,detail:d};
}

/* ---------- HELPERS: real stats ---------- */
function weekStart(){ const d=new Date(); const dow=(d.getDay()+6)%7; d.setHours(0,0,0,0); d.setDate(d.getDate()-dow); return d; }
function sessThisWeek(){ const ws=weekStart(); return SESS.filter(s=>new Date(s.date)>=ws); }
function kmThisWeek(){ return sessThisWeek().reduce((a,s)=>a+(s.km||0),0); }
function totalKm(){ return SESS.reduce((a,s)=>a+(s.km||0),0); }
function totalTonnage(){ return MSESS.reduce((a,s)=>a+(s.tonnage||0),0); }
function runCountWeek(){ return sessThisWeek().length; }
function muscuCountWeek(){ const ws=weekStart(); return MSESS.filter(s=>new Date(s.date)>=ws).length; }
function totalSessions(){ return SESS.length+MSESS.length; }
function streakDays(){
  const set=new Set([...SESS,...MSESS].map(s=>s.date));
  let streak=0; let d=new Date(); d.setHours(0,0,0,0);
  if(!set.has(dateKey(d))){ d.setDate(d.getDate()-1); if(!set.has(dateKey(d))) return 0; }
  while(set.has(dateKey(d))){ streak++; d.setDate(d.getDate()-1); }
  return streak;
}
function planSessionToday(){ if(!PLAN) return null; return PLAN.sessions.find(s=>s.date===todayKey()); }
function formScore(){
  // simple: based on sessions done this week vs target & recent load
  const target=(P.days&&P.days.length)||4;
  const did=runCountWeek()+muscuCountWeek();
  return Math.min(100,Math.round(did/target*100));
}

/* ---------- DAILY GOALS ---------- */
function getDailyGoals(){
  const tk=todayKey();
  if(GOALS.date!==tk){
    // Banque les XP des objectifs cochés la veille avant de réinitialiser
    if(GOALS.list){
      const checked=GOALS.list.filter(g=>g.done).length;
      let earned=checked*XP_RULES.perGoal;
      if(GOALS.list.length && GOALS.list.every(g=>g.done)) earned+=XP_RULES.allGoalsBonus;
      XP.pastGoalXP=(XP.pastGoalXP||0)+earned;
      DB.save('xp',XP);
    }
    const list=[
      {id:'hydra',txt:'Boire 2L d\u2019eau',done:false},
      {id:'sleep',txt:'Dormir 8h cette nuit',done:false}
    ];
    const ps=planSessionToday();
    if(ps && ps.type!=='Repos') list.unshift({id:'plan',txt:'Faire : '+ps.title,done:false});
    else list.unshift({id:'mobility',txt:'10 min de mobilité',done:false});
    GOALS={date:tk,list};
    DB.save('daily_goals',GOALS);
  }
  return GOALS.list;
}
function toggleGoal(id){
  const g=GOALS.list.find(x=>x.id===id); if(!g) return;
  const wasAll=GOALS.list.every(x=>x.done);
  g.done=!g.done;
  DB.save('daily_goals',GOALS);
  // Recalcul COMPLET : cocher ajoute, décocher retire automatiquement
  refreshXP({animate:true});
  const isAll=GOALS.list.every(x=>x.done);
  if(g.done && isAll && !wasAll){ burst(); sfx('finish'); toast('🎉 Tous les objectifs ! +'+XP_RULES.allGoalsBonus+' XP'); }
  else if(g.done){ sfx('goal'); toast('+'+XP_RULES.perGoal+' XP'); }
  else toast('−'+XP_RULES.perGoal+' XP');
  renderHome();
}

/* ---------- RING SVG ---------- */
function ringSVG(size,pct,stroke,color,bg){
  const r=(size-stroke)/2, c=2*Math.PI*r, off=c*(1-Math.min(1,pct/100));
  return '<svg width="'+size+'" height="'+size+'" style="transform:rotate(-90deg)"><circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="'+(bg||'var(--s2)')+'" stroke-width="'+stroke+'"/><circle cx="'+size/2+'" cy="'+size/2+'" r="'+r+'" fill="none" stroke="'+color+'" stroke-width="'+stroke+'" stroke-linecap="round" stroke-dasharray="'+c+'" stroke-dashoffset="'+off+'" style="transition:stroke-dashoffset .8s ease"/></svg>';
}

/* ---------- RENDER HOME ---------- */
function renderHome(){
  const xp=xpProgress();
  const kmW=kmThisWeek(), kmTarget=P.kmWeek||40;
  const sessW=runCountWeek()+muscuCountWeek(), sessTarget=(P.days&&P.days.length)||4;
  const form=formScore();
  const vdot=getUserVDOT();
  const goals=getDailyGoals();
  const ps=planSessionToday();
  const compDays=P.compDate?daysBetween(new Date(),new Date(P.compDate)):null;

  let html='';
  // XP CARD
  html+='<div class="card stag" style="animation-delay:.02s;background:linear-gradient(135deg,var(--s1),rgba(31,47,80,.35));">'+
    '<div class="row"><div><div class="lab">Niveau '+XP.level+'</div><div class="man" style="font-weight:800;font-size:22px;margin-top:2px;">'+XP.name+'</div></div>'+
    '<div class="badge mono">'+XP.total+' XP</div></div>'+
    '<div class="pbar" style="margin-top:14px;"><div style="width:'+xp.pct+'%"></div></div>'+
    '<div class="row" style="margin-top:6px;"><span style="font-size:11px;color:var(--muted)" class="mono">'+xp.inLvl+' / '+xp.span+' XP</span><span style="font-size:11px;color:var(--muted)">Niv. '+(XP.level+1)+'</span></div></div>';

  // RINGS
  html+='<div class="card stag" style="animation-delay:.06s"><div class="card-t">📊 Charge de la semaine</div>'+
    '<div class="row" style="justify-content:space-around;align-items:center;">'+
    '<div class="ring-wrap" style="width:120px;height:120px;">'+ringSVG(120,Math.min(100,kmW/kmTarget*100),12,'var(--e)')+'<div class="ring-c"><div class="big">'+kmW.toFixed(0)+'</div><div class="sm">/ '+kmTarget+' km</div></div></div>'+
    '<div style="display:flex;flex-direction:column;gap:14px;">'+
      '<div class="ring-wrap" style="width:64px;height:64px;">'+ringSVG(64,Math.min(100,sessW/sessTarget*100),7,'var(--ok)')+'<div class="ring-c"><div class="big" style="font-size:15px">'+sessW+'</div><div class="sm" style="font-size:8px">séances</div></div></div>'+
      '<div class="ring-wrap" style="width:64px;height:64px;">'+ringSVG(64,form,7,'var(--or)')+'<div class="ring-c"><div class="big" style="font-size:15px">'+form+'</div><div class="sm" style="font-size:8px">forme</div></div></div>'+
    '</div></div></div>';

  // CHECKLIST
  html+='<div class="card stag" style="animation-delay:.10s"><div class="card-t">✅ Objectifs du jour</div>';
  goals.forEach(g=>{
    html+='<div class="chk '+(g.done?'done':'')+'" onclick="toggleGoal(\''+g.id+'\')"><div class="box"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg></div><div class="txt" style="font-size:14px;font-weight:500">'+g.txt+'</div></div>';
  });
  html+='</div>';

  // SESSION TODAY
  if(ps){
    const col='var('+(TYPE_COLORS[ps.type]||'--e')+')';
    html+='<div class="card stag" style="animation-delay:.14s"><div class="card-t">🏃 Séance du jour</div>'+
      '<div class="sess today" onclick="openRunSheet('+ps.id+')"><div class="row"><div><div style="font-weight:700;font-size:15px">'+ps.title+'</div>'+
      '<div style="color:var(--muted);font-size:12px;margin-top:3px">'+(ps.km?ps.km+' km · '+ps.pace+'/km · RPE '+ps.rpe:'Repos')+'</div></div>'+
      '<div class="badge" style="background:rgba(61,127,255,.18);color:'+col+'">'+ps.type+'</div></div></div></div>';
  }

  // WEEK TARGETS
  html+='<div class="card stag" style="animation-delay:.18s"><div class="card-t">🎯 Objectifs semaine</div>'+
    '<div style="margin-bottom:12px"><div class="row" style="margin-bottom:5px"><span style="font-size:13px">Kilomètres</span><span class="mono" style="font-size:13px;color:var(--muted)">'+kmW.toFixed(0)+' / '+kmTarget+'</span></div><div class="pbar"><div style="width:'+Math.min(100,kmW/kmTarget*100)+'%"></div></div></div>'+
    '<div><div class="row" style="margin-bottom:5px"><span style="font-size:13px">Séances</span><span class="mono" style="font-size:13px;color:var(--muted)">'+sessW+' / '+sessTarget+'</span></div><div class="pbar"><div style="width:'+Math.min(100,sessW/sessTarget*100)+'%;background:linear-gradient(90deg,var(--ok),#6FE0B0)"></div></div></div></div>';

  // WEEKLY DOTS
  html+='<div class="card stag" style="animation-delay:.22s"><div class="card-t">📅 Semainier</div><div class="week">'+weekDotsHTML()+'</div></div>';

  // EN BREF
  html+='<div class="card stag" style="animation-delay:.26s"><div class="card-t">⚡ En bref</div><div class="sgrid">'+
    '<div class="sbox"><div class="v">'+(vdot||'—')+'</div><div class="l">VDOT</div></div>'+
    '<div class="sbox"><div class="v" style="font-size:18px">'+(P.pb5k||'—')+'</div><div class="l">PB 5000m</div></div>'+
    '<div class="sbox"><div class="v">'+(compDays!==null?'J-'+compDays:'—')+'</div><div class="l">Compétition</div></div>'+
    '<div class="sbox"><div class="v">'+streakDays()+'</div><div class="l">Jours de série</div></div></div></div>';

  // RECENT RECORD
  const recent=[...SESS,...MSESS].sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
  if(recent){
    html+='<div class="card stag" style="animation-delay:.30s"><div class="card-t">🏅 Activité récente</div>'+
      '<div class="row"><div><div style="font-weight:700">'+(recent.title||recent.progName||'Séance')+'</div><div style="font-size:12px;color:var(--muted);margin-top:2px">'+fmtDate(recent.date)+'</div></div>'+
      '<div class="mono" style="color:var(--e);font-weight:700">'+(recent.km?recent.km+' km':(recent.tonnage?Math.round(recent.tonnage)+' kg':''))+'</div></div></div>';
  }

  // CARTE AGENDA
  const evts=[...AGENDA]; if(P.compDate) evts.push({date:P.compDate,title:'🏆 '+(P.goal||'Compétition')});
  const upcoming=evts.filter(e=>new Date(e.date)>=new Date(todayKey())).sort((a,b)=>new Date(a.date)-new Date(b.date))[0];
  html+='<div class="card stag" style="animation-delay:.34s"><div class="row" style="margin-bottom:10px"><div class="card-t" style="margin:0">'+ICN('calendar',18,'var(--e)')+' Agenda</div><span style="font-size:12px;color:var(--e);cursor:pointer" onclick="openTool(\'agenda\');nav(\'outils\')">Voir tout</span></div>';
  if(upcoming){ const dd=daysBetween(new Date(),new Date(upcoming.date)); html+='<div class="row"><div><div style="font-weight:700">'+upcoming.title+'</div><div style="font-size:12px;color:var(--muted);margin-top:2px">'+fmtDate(upcoming.date)+'</div></div><div class="badge">'+(dd<=0?'Aujourd\u2019hui':'J-'+dd)+'</div></div>'; }
  else html+='<div style="font-size:13px;color:var(--dim)">Aucun événement à venir.</div>';
  html+='</div>';
  // CARTE PRIÈRES
  try{ const pt=prayerTimes(); const order=['Fajr','Dhuhr','Asr','Maghrib','Isha']; const now=new Date(),nm=now.getHours()*60+now.getMinutes();
    let next=null,nextT=null; for(const p of order){ const[hh,mm]=pt[p].split(':').map(Number); if(hh*60+mm>nm){ next=p; nextT=pt[p]; break; } }
    if(!next){ next='Fajr (demain)'; nextT=pt.Fajr; }
    const[nh,nmm]=nextT.split(':').map(Number); let diff=(nh*60+nmm)-(nm); if(diff<0)diff+=1440; const cd=Math.floor(diff/60)+'h'+String(diff%60).padStart(2,'0');
    html+='<div class="card stag" style="animation-delay:.38s"><div class="row" style="margin-bottom:10px"><div class="card-t" style="margin:0">'+ICN('mosque',18,'var(--e)')+' Prochaine prière</div><span style="font-size:12px;color:var(--e);cursor:pointer" onclick="openTool(\'priere\');nav(\'outils\')">Voir tout</span></div>';
    html+='<div class="row"><div><div style="font-weight:700;font-size:16px">'+next+'</div><div style="font-size:12px;color:var(--muted);margin-top:2px">dans '+cd+'</div></div><div class="mono" style="font-size:24px;font-weight:700;color:var(--e)">'+nextT+'</div></div></div>';
  }catch(e){}
  $('#s-home').innerHTML=html;
}
function fmtDate(s){ const d=new Date(s); return d.toLocaleDateString('fr-FR',{weekday:'short',day:'numeric',month:'short'}); }
function weekDotsHTML(){
  const ws=weekStart(); const labels=['L','M','M','J','V','S','D']; let h='';
  const doneDates=new Set([...SESS,...MSESS].map(s=>s.date));
  const planDates=PLAN?new Set(PLAN.sessions.filter(s=>s.type!=='Repos').map(s=>s.date)):new Set();
  for(let i=0;i<7;i++){
    const d=new Date(ws); d.setDate(ws.getDate()+i); const k=dateKey(d);
    const isToday=k===todayKey();
    let cls='rest', label='';
    if(doneDates.has(k)){ cls='done'; label='✓'; }
    else if(planDates.has(k)){ cls='run'; label='•'; }
    else { label=''; }
    h+='<div class="wd '+(isToday?'today':'')+'"><div class="dl">'+labels[i]+'</div><div class="dot '+cls+'">'+label+'</div></div>';
  }
  return h;
}

/* ---------- SPORT ---------- */
let sportTab='run', runSub='ia';
function renderRunning(){
  let h='<div class="pills" style="margin-bottom:14px"><div class="pill '+(runSub==='ia'?'on':'')+'" onclick="runSub=\'ia\';renderSport()">🤖 Coach IA</div><div class="pill '+(runSub==='perso'?'on':'')+'" onclick="runSub=\'perso\';renderSport()">📋 Plan personnel</div></div>';
  if(runSub==='ia'){
    if(!PLAN){
      h+='<div class="card"><div class="empty"><div class="em-ic">🤖</div><div style="font-weight:700;margin-bottom:6px;color:var(--snow)">Coach IA — Plan scientifique</div><div style="font-size:13px;margin-bottom:16px">Génère un plan périodisé sur-mesure (méthode norvégienne + science moderne) basé sur ton VDOT ('+(getUserVDOT()||'?')+'), ton objectif, tes préférences et ta date de course. Chaque plan est unique.</div><button class="btn" onclick="openPlanSetup()">⚙️ Configurer & générer</button></div></div>';
    } else {
      const done=PLAN.sessions.filter(s=>s.done).length;
      h+='<div class="card"><div class="row"><div><div class="lab">Plan IA · VDOT '+PLAN.vdot+'</div><div class="man" style="font-weight:800;font-size:18px;margin-top:2px">'+PLAN.weeks+' semaines</div></div><div class="badge">'+done+'/'+PLAN.sessions.length+'</div></div>'+
        '<div class="pbar" style="margin-top:12px"><div style="width:'+(done/PLAN.sessions.length*100)+'%"></div></div>'+
        '<button class="btn ghost sm" style="margin-top:12px" onclick="if(confirm(\'Régénérer un nouveau plan ? Tes séances faites restent dans tes stats.\')){PLAN=null;openPlanSetup()}">🔄 Régénérer / reconfigurer</button></div>';
      // group by phase puis semaine
      let curPhase=null, curWeek=null;
      const tk=todayKey();
      PLAN.sessions.forEach(s=>{
        if(s.phase!==curPhase){ curPhase=s.phase; h+='<div class="phase-head" style="color:var('+(s.color||'--e')+')">▸ '+s.phase+'</div>'; }
        if(s.week!==curWeek){ curWeek=s.week; h+='<div class="lab" style="margin:8px 0 6px">Semaine '+s.week+(s.deload?' · 🟢 allégée':'')+'</div>'; }
        const isToday=s.date===tk;
        const col='var('+(s.color||'--e')+')';
        h+='<div class="sess '+(s.done?'done':'')+' '+(isToday?'today':'')+'" onclick="openRunSheet('+s.id+')"><div class="row"><div><div style="font-weight:700;font-size:14px">'+s.title+'</div><div style="color:var(--muted);font-size:12px;margin-top:3px">'+fmtDate(s.date)+(s.km?' · '+s.km+' km · '+s.pace+'/km':' · Repos')+'</div></div><div class="badge" style="background:rgba(61,127,255,.15);color:'+col+';font-size:11px">'+(s.type||'')+'</div></div></div>';
      });
    }
  } else {
    h+=renderPersoList();
  }
  return h;
}
/* ---------- PLAN PERSONNEL (fonctionnel) ---------- */
let curPerso=null;
function renderPersoList(){
  const persoPlans=CUSTOM.filter(p=>p.kind==='run');
  let h='<button class="btn" style="margin-bottom:14px" onclick="addPersoPlan()">＋ Nouveau plan personnel</button>';
  if(!persoPlans.length){ h+='<div class="card"><div class="empty"><div class="em-ic">📋</div><div style="font-weight:700;color:var(--snow);margin-bottom:6px">Crée ton plan sur-mesure</div><div style="font-size:13px">Ajoute tes propres séances, choisis les dates, types et allures. Tout se synchronise avec ton accueil et tes stats.</div></div></div>'; }
  else persoPlans.forEach((p)=>{
    const done=p.sessions.filter(s=>s.done).length;
    h+='<div class="card"><div class="row" onclick="openPerso(\''+p.id+'\')" style="cursor:pointer"><div><div style="font-weight:700;font-size:16px">'+p.name+'</div><div style="font-size:12px;color:var(--muted);margin-top:3px">'+p.sessions.length+' séances · '+done+' terminées</div></div><span style="color:var(--e);font-size:20px">›</span></div>'+
      '<div class="pbar" style="margin-top:10px"><div style="width:'+(p.sessions.length?done/p.sessions.length*100:0)+'%"></div></div>'+
      '<div class="row" style="gap:6px;margin-top:10px"><button class="btn ghost sm" onclick="dupPerso(\''+p.id+'\')">⎘ Dupliquer</button><button class="btn ghost sm" onclick="sharePlan(\''+p.name+'\')">↗ Partager</button><button class="btn ghost sm" style="color:var(--bad)" onclick="delPerso(\''+p.id+'\')">🗑</button></div></div>';
  });
  return h;
}
function addPersoPlan(){
  const n=prompt('Nom du plan :','Mon plan perso'); if(!n) return;
  const id='P'+Date.now();
  CUSTOM.push({id,kind:'run',name:n,sessions:[]}); saveAll(); openPerso(id);
}
function openPerso(id){ curPerso=id; renderSport(); setTimeout(()=>renderPersoDetail(),0); }
function renderSport(){
  let h='<div class="pills" style="margin:6px 0 16px"><div class="pill '+(sportTab==='run'?'on':'')+'" onclick="sportTab=\'run\';curPerso=null;renderSport()">🏃 Running</div><div class="pill '+(sportTab==='muscu'?'on':'')+'" onclick="sportTab=\'muscu\';renderSport()">🏋️ Musculation</div></div>';
  if(sportTab==='run' && runSub==='perso' && curPerso){ h+=persoDetailHTML(); }
  else h+= sportTab==='run'?renderRunning():renderMuscu();
  $('#s-sport').innerHTML=h;
}
function persoDetailHTML(){
  const p=CUSTOM.find(x=>x.id===curPerso); if(!p) return renderPersoList();
  const tk=todayKey();
  let h='<div class="row" style="margin-bottom:14px"><button class="x" onclick="curPerso=null;renderSport()">‹</button><div class="man" style="font-weight:800;font-size:18px">'+p.name+'</div><button class="x" onclick="renamePerso(\''+p.id+'\')">✏️</button></div>';
  h+='<button class="btn" style="margin-bottom:14px" onclick="addPersoSession()">＋ Ajouter une séance</button>';
  if(!p.sessions.length) h+='<div class="card"><div class="empty"><div class="em-ic">🏃</div><div style="font-size:13px">Aucune séance. Ajoute ta première !</div></div></div>';
  else {
    const sorted=[...p.sessions].sort((a,b)=>new Date(a.date)-new Date(b.date));
    sorted.forEach(s=>{
      const isToday=s.date===tk; const col='var('+(TYPE_COLORS[s.type]||'--e')+')';
      h+='<div class="sess '+(s.done?'done':'')+' '+(isToday?'today':'')+'"><div class="row" onclick="openPersoSheet('+s.id+')" style="cursor:pointer"><div><div style="font-weight:700;font-size:14px">'+s.title+'</div><div style="color:var(--muted);font-size:12px;margin-top:3px">'+fmtDate(s.date)+(s.km?' · '+s.km+' km · '+s.pace+'/km':'')+'</div></div><div class="badge" style="background:rgba(61,127,255,.15);color:'+col+';font-size:11px">'+s.type+'</div></div></div>';
    });
  }
  return h;
}
function renderPersoDetail(){}
function renamePerso(id){ const p=CUSTOM.find(x=>x.id===id); const n=prompt('Nom :',p.name); if(n){p.name=n;saveAll();renderSport();} }
function dupPerso(id){ const p=CUSTOM.find(x=>x.id===id); CUSTOM.push({...JSON.parse(JSON.stringify(p)),id:'P'+Date.now(),name:p.name+' (copie)'}); saveAll(); renderSport(); }
function delPerso(id){ if(!confirm('Supprimer ce plan ?'))return; CUSTOM=CUSTOM.filter(x=>x.id!==id); curPerso=null; saveAll(); renderSport(); }
let psType='EF';
function addPersoSession(){
  psType='EF';
  let h='<div class="field"><label>Titre</label><input class="inp" id="ps_title" placeholder="Footing du matin"></div>';
  h+='<div class="field"><label>Type</label><div class="pills" id="ps_types">'+['EF','Récup','Tempo','Seuil','VMA','Long','Course'].map(t=>'<div class="pill '+(t==='EF'?'on':'')+'" onclick="psType=\''+t+'\';document.querySelectorAll(\'#ps_types .pill\').forEach(x=>x.classList.remove(\'on\'));this.classList.add(\'on\')">'+t+'</div>').join('')+'</div></div>';
  h+='<div class="field"><label>Date</label><input class="inp" id="ps_date" type="date" value="'+todayKey()+'"></div>';
  h+='<div class="row" style="gap:10px"><div class="field" style="flex:1"><label>Distance (km)</label><input class="inp" id="ps_km" type="number" placeholder="8"></div><div class="field" style="flex:1"><label>Allure /km</label><input class="inp" id="ps_pace" placeholder="4:30"></div></div>';
  h+='<div class="field"><label>Description (optionnel)</label><textarea class="inp" id="ps_desc" rows="3" placeholder="Détails de la séance..."></textarea></div>';
  h+='<button class="btn" onclick="savePersoSession()">💾 Ajouter la séance</button>';
  $('#progBody').innerHTML=h; $('#ovProgTitle').textContent='Nouvelle séance'; openOv('ovProg');
}
function savePersoSession(){
  const p=CUSTOM.find(x=>x.id===curPerso); if(!p) return;
  const title=$('#ps_title').value.trim()||psType;
  const km=+$('#ps_km').value||0, pace=$('#ps_pace').value.trim()||'—';
  const durMin=(km&&pace!=='—')?Math.round(km*parseTime(pace)/60):0;
  p.sessions.push({id:Date.now(),title,type:psType,date:$('#ps_date').value,km,pace,duration:durMin,rpe:5,desc:$('#ps_desc').value.trim(),done:false});
  saveAll(); closeOv('ovProg'); renderSport(); toast('Séance ajoutée ✓');
}
let curPersoSess=null;
function openPersoSheet(sid){
  const p=CUSTOM.find(x=>x.id===curPerso); const s=p.sessions.find(x=>x.id===sid); if(!s)return;
  curPersoSess=sid;
  $('#sheetTitle').textContent=s.title;
  const col='var('+(TYPE_COLORS[s.type]||'--e')+')';
  let h='<div class="badge" style="background:rgba(61,127,255,.15);color:'+col+';margin-bottom:14px">'+s.type+' · '+fmtDate(s.date)+'</div>';
  if(s.km) h+='<div class="sgrid" style="margin-bottom:14px"><div class="sbox"><div class="v">'+s.km+'</div><div class="l">km</div></div><div class="sbox"><div class="v" style="font-size:18px">'+s.pace+'</div><div class="l">/km</div></div><div class="sbox"><div class="v">'+s.duration+'</div><div class="l">min</div></div></div>';
  if(s.desc) h+='<div class="tip" style="margin-bottom:14px">'+s.desc+'</div>';
  if(s.done) h+='<div class="badge" style="background:rgba(51,211,153,.18);color:var(--ok);width:100%;justify-content:center;padding:14px;border-radius:14px;margin-bottom:10px">✓ Terminée</div>';
  else h+='<button class="btn" style="margin-bottom:10px" onclick="markPersoDone()">✓ Marquer terminée</button>';
  h+='<button class="btn ghost sm" style="color:var(--bad)" onclick="delPersoSession()">🗑 Supprimer</button>';
  $('#sheetBody').innerHTML=h; openOv('ovSheet');
}
function markPersoDone(){
  const p=CUSTOM.find(x=>x.id===curPerso); const s=p.sessions.find(x=>x.id===curPersoSess); if(!s)return;
  s.done=true; SESS.push({date:s.date,title:s.title,km:s.km,pace:s.pace,type:s.type,duration:s.duration,rpe:s.rpe});
  saveAll(); refreshXP({animate:true}); closeOv('ovSheet'); renderSport();
  openSessionDebrief({date:s.date,title:s.title,km:s.km,pace:s.pace,type:s.type,duration:s.duration,plannedRpe:s.rpe});
}
function delPersoSession(){
  const p=CUSTOM.find(x=>x.id===curPerso); p.sessions=p.sessions.filter(x=>x.id!==curPersoSess);
  saveAll(); closeOv('ovSheet'); renderSport();
}
function sharePlan(n){ if(navigator.share) navigator.share({title:'VVV Plan',text:'Mon plan : '+n}); else toast('Partage non supporté'); }

/* ---------- QUESTIONNAIRE POST-SÉANCE + ANALYSE COACH IA ---------- */
let debriefData=null, debriefCtx=null;
function openSessionDebrief(ctx){
  debriefCtx=ctx;
  debriefData={ done:true, duration:ctx.duration||'', distance:ctx.km||'', pace:ctx.pace||'',
    rpe:5, pain:'Aucune', fatigue:3, weather:'☀️', feel:3, sleep:3, nutrition:3, note:'' };
  renderDebrief();
  openOv('ovProg'); $('#ovProgTitle').textContent='Bilan de séance';
}
function renderDebrief(){
  const d=debriefData;
  const scale=(key,label,icons)=>'<div class="field"><label>'+label+'</label><div class="pills">'+icons.map((ic,i)=>'<div class="pill '+(d[key]===i+1?'on':'')+'" onclick="debriefData.'+key+'='+(i+1)+';renderDebrief()">'+ic+'</div>').join('')+'</div></div>';
  let h='<div class="tip" style="margin-bottom:14px">📋 Réponds honnêtement : ton coach IA va analyser ta séance.</div>';
  h+='<div class="row" style="gap:10px"><div class="field" style="flex:1"><label>Durée (min)</label><input class="inp" type="number" value="'+(d.duration||'')+'" oninput="debriefData.duration=+this.value"></div><div class="field" style="flex:1"><label>Distance (km)</label><input class="inp" type="number" value="'+(d.distance||'')+'" oninput="debriefData.distance=+this.value"></div></div>';
  h+='<div class="field"><label>Allure moyenne /km</label><input class="inp" value="'+(d.pace||'')+'" oninput="debriefData.pace=this.value" placeholder="4:30"></div>';
  h+='<div class="field"><label>RPE — difficulté ressentie : '+d.rpe+'/10</label><input type="range" min="1" max="10" value="'+d.rpe+'" style="width:100%" oninput="debriefData.rpe=+this.value;renderDebrief()"></div>';
  h+='<div class="field"><label>Douleurs</label><div class="pills">'+['Aucune','Légères','Gênantes','Importantes'].map(p=>'<div class="pill '+(d.pain===p?'on':'')+'" onclick="debriefData.pain=\''+p+'\';renderDebrief()">'+p+'</div>').join('')+'</div></div>';
  h+=scale('fatigue','Fatigue',['😀','🙂','😐','😓','😵']);
  h+=scale('feel','Sensations',['😣','😕','😐','😊','🤩']);
  h+=scale('sleep','Sommeil de la nuit',['😴','😪','😐','🙂','💤']);
  h+=scale('nutrition','Alimentation du jour',['🍔','😐','🙂','🥗','💪']);
  h+='<div class="field"><label>Météo</label><div class="pills">'+['☀️','⛅','🌧️','💨','🥵','🥶'].map(w=>'<div class="pill '+(d.weather===w?'on':'')+'" onclick="debriefData.weather=\''+w+'\';renderDebrief()">'+w+'</div>').join('')+'</div></div>';
  h+='<div class="field"><label>Commentaire libre</label><textarea class="inp" rows="2" oninput="debriefData.note=this.value" placeholder="Comment t\u2019es-tu senti ?">'+(d.note||'')+'</textarea></div>';
  h+='<button class="btn" onclick="submitDebrief()">🧠 Analyser ma séance</button>';
  $('#progBody').innerHTML=h;
}
function submitDebrief(){
  const entry={...debriefData,date:debriefCtx.date,title:debriefCtx.title,type:debriefCtx.type,plannedRpe:debriefCtx.plannedRpe,ts:Date.now()};
  SESSLOG.push(entry); DB.save('sesslog',SESSLOG);
  const analysis=coachAnalyze(entry);
  renderCoachAnalysis(analysis);
}
function coachAnalyze(e){
  const pos=[],errs=[],tips=[],adjust=[];
  // Points positifs
  if(e.done) pos.push('Tu as terminé ta séance : la régularité est ta plus grande force. 💪');
  if(e.feel>=4) pos.push('Excellentes sensations — ton corps répond bien à l\u2019entraînement.');
  if(e.sleep>=4) pos.push('Bon sommeil : c\u2019est 50% de ta récupération, continue.');
  if(e.pain==='Aucune') pos.push('Aucune douleur signalée : ta technique et ta charge sont bien gérées.');
  if(e.nutrition>=4) pos.push('Alimentation au top, le carburant est là.');
  // Critiques / erreurs
  if(e.plannedRpe && e.rpe>=e.plannedRpe+2) errs.push('Ta séance a été bien plus dure que prévue (RPE '+e.rpe+' vs '+e.plannedRpe+' attendu). Tu es peut-être parti trop vite ou tu es fatigué.');
  if(e.plannedRpe && e.rpe<=e.plannedRpe-2 && e.type!=='EF' && e.type!=='Récup') errs.push('Séance trop facile (RPE '+e.rpe+') : tu peux probablement pousser un peu plus la prochaine fois.');
  if(e.pain==='Gênantes'||e.pain==='Importantes') errs.push('⚠️ Douleurs '+e.pain.toLowerCase()+' : ne les ignore pas. Une douleur articulaire qui persiste = repos.');
  if(e.sleep<=2) errs.push('Sommeil insuffisant : tes performances et ta récup vont en souffrir.');
  if(e.fatigue>=4) errs.push('Niveau de fatigue élevé : attention au surentraînement.');
  // Conseils
  if(e.sleep<=2) tips.push('Vise 8h de sommeil cette nuit, écran coupé 1h avant.');
  if(e.nutrition<=2) tips.push('Mange des glucides + protéines dans les 30 min après l\u2019effort.');
  tips.push('Bois au moins 0,5 L d\u2019eau dans l\u2019heure qui suit.');
  if(e.weather==='🥵') tips.push('Par forte chaleur, cours tôt le matin et hydrate-toi davantage.');
  // Ajustements prochaines séances
  if(e.pain==='Importantes'||e.fatigue>=5){ adjust.push('Prochaine séance : remplace-la par du repos ou un footing très léger.'); }
  else if(e.rpe>=9 && e.fatigue>=4){ adjust.push('Allège la prochaine séance dure de 48h pour bien récupérer.'); }
  else if(e.feel>=4 && e.rpe<=6){ adjust.push('Tu es en forme : on pourra augmenter légèrement le volume la semaine prochaine.'); }
  else adjust.push('Continue comme prévu, ton plan est bien calibré.');
  // Motivation
  const motiv=['Chaque séance te rapproche de ton objectif. 🔥','La discipline d\u2019aujourd\u2019hui est la victoire de demain.','Les champions sont faits de séances comme celle-ci.','Tu construis quelque chose de grand, brique par brique.'][Math.floor(Math.random()*4)];
  return {pos,errs,tips,adjust,motiv,e};
}
function renderCoachAnalysis(a){
  let h='<div style="text-align:center;margin-bottom:14px"><div style="font-size:40px">🧠</div><div class="man" style="font-weight:800;font-size:20px">Analyse du Coach</div><div style="font-size:12px;color:var(--muted)">'+a.e.title+'</div></div>';
  const blk=(icon,title,items,color)=>items.length?'<div class="card-t" style="margin-top:14px;'+(color?'color:'+color:'')+'">'+icon+' '+title+'</div>'+items.map(x=>'<div class="tip" style="margin-bottom:6px;'+(color?'border-color:'+color+'33;background:'+color+'11':'')+'">'+x+'</div>').join(''):'';
  h+=blk('✅','Points positifs',a.pos,'var(--ok)');
  h+=blk('⚠️','Critiques constructives',a.errs,'var(--warn)');
  h+=blk('💡','Conseils',a.tips,'');
  h+=blk('🔧','Ajustements à venir',a.adjust,'var(--e)');
  h+='<div style="background:linear-gradient(135deg,var(--ed),rgba(31,47,80,.3));border:1px solid var(--e);border-radius:14px;padding:14px;margin-top:16px;text-align:center"><div style="font-style:italic;font-size:15px">"'+a.motiv+'"</div></div>';
  h+='<button class="btn" style="margin-top:16px" onclick="closeOv(\'ovProg\');renderSport();nav(\'home\')">C\u2019est noté, Coach ! 💪</button>';
  $('#progBody').innerHTML=h; $('#ovProgTitle').textContent='Coach IA';
}

/* ---------- RUN SHEET ---------- */
let curRunId=null;
function openRunSheet(id){
  const s=PLAN?PLAN.sessions.find(x=>x.id===id):null; if(!s) return;
  curRunId=id;
  $('#sheetTitle').textContent=s.title;
  const col='var('+(TYPE_COLORS[s.type]||'--e')+')';
  let h='<div class="badge" style="background:rgba(61,127,255,.15);color:'+col+';margin-bottom:14px">'+s.type+' · '+fmtDate(s.date)+'</div>';
  if(s.km){
    h+='<div class="sgrid" style="margin-bottom:14px"><div class="sbox"><div class="v">'+s.km+'</div><div class="l">km</div></div><div class="sbox"><div class="v" style="font-size:18px">'+s.pace+'</div><div class="l">/km</div></div><div class="sbox"><div class="v">'+s.duration+'</div><div class="l">min</div></div><div class="sbox"><div class="v">'+s.rpe+'</div><div class="l">RPE /10</div></div></div>';
  }
  const dt=s.detail;
  if(dt){
    const sec=(icon,t,c)=>'<div class="card-t" style="margin-top:14px">'+icon+' '+t+'</div><div class="tip">'+c+'</div>';
    h+='<div style="background:linear-gradient(135deg,var(--ed),rgba(31,47,80,.3));border:1px solid var(--e);border-radius:14px;padding:12px;margin-bottom:6px"><div class="lab" style="color:var(--e)">🎯 Objectif</div><div style="font-size:14px;margin-top:4px;line-height:1.4">'+dt.objectif+'</div></div>';
    h+=sec('🔥','Échauffement',dt.warmup);
    h+=sec('💪','Corps de séance',dt.body);
    h+=sec('🏁','Allures',dt.paces);
    h+=sec('⏱','Temps de récupération',dt.recovery);
    h+=sec('🧊','Retour au calme',dt.cooldown);
    h+='<div class="card-t" style="margin-top:14px">✅ Conseils</div>'+dt.tips.map(t=>'<div class="tip" style="margin-bottom:6px">• '+t+'</div>').join('');
    h+='<div class="card-t" style="margin-top:14px;color:var(--bad)">⚠️ Erreurs à éviter</div>'+dt.mistakes.map(t=>'<div class="tip" style="margin-bottom:6px;border-color:rgba(255,92,108,.3);background:rgba(255,92,108,.08)">✗ '+t+'</div>').join('');
    h+='<div class="card-t" style="margin-top:14px">🧠 Pourquoi cette séance ?</div><div class="tip" style="margin-bottom:18px">'+dt.why+'</div>';
  } else {
    h+='<div class="card-t">💪 Corps de séance</div><div class="tip" style="margin-bottom:18px">'+s.desc+'</div>';
  }
  if(s.done) h+='<div class="badge" style="background:rgba(51,211,153,.18);color:var(--ok);width:100%;justify-content:center;padding:14px;border-radius:14px">✓ Séance terminée</div>';
  else if(s.type!=='Repos') h+='<button class="btn" onclick="markRunDone()">✓ Marquer terminée</button>';
  $('#sheetBody').innerHTML=h;
  openOv('ovSheet');
}
function markRunDone(){
  const s=PLAN.sessions.find(x=>x.id===curRunId); if(!s) return;
  s.done=true;
  SESS.push({date:s.date,title:s.title,km:s.km,pace:s.pace,type:s.type,duration:s.duration,rpe:s.rpe});
  saveAll(); refreshXP({animate:true}); closeOv('ovSheet'); renderSport();
  // Questionnaire intelligent post-séance (Prompt 2.4)
  openSessionDebrief({date:s.date,title:s.title,km:s.km,pace:s.pace,type:s.type,duration:s.duration,plannedRpe:s.rpe});
}

/* ---------- MUSCULATION ---------- */
function renderMuscu(){
  let h='';
  if(DB.load('live_paused')){ const sv=DB.load('live_paused'); h+='<div class="card" style="border-color:var(--warn);background:rgba(255,180,84,.08)"><div class="row"><div><div style="font-weight:700">⏸ Séance en pause</div><div style="font-size:12px;color:var(--muted)">'+sv.prog.name+'</div></div><button class="btn sm" style="width:auto;padding:8px 14px" onclick="resumeLive()">Reprendre</button></div></div>'; }
  h+='<div class="row" style="gap:10px;margin-bottom:14px"><button class="btn" onclick="openCreate()">＋ Créer</button><button class="btn ghost" onclick="openLibBrowse()">📚 Bibliothèque</button></div>';
  h+='<div class="lab" style="margin:6px 0 10px">Programmes par défaut</div>';
  PROGS.forEach((p,i)=>{
    h+='<div class="card" onclick="openProg(\''+p.id+'\')" style="cursor:pointer"><div class="row"><div><div class="badge" style="margin-bottom:8px">'+p.id+'</div><div style="font-weight:700;font-size:16px">'+p.name+'</div><div style="font-size:12px;color:var(--muted);margin-top:3px">'+p.ex.length+' exercices · '+p.ex.reduce((a,e)=>a+e.sets,0)+' séries</div></div><div style="font-size:28px">'+p.ex[0].anim+'</div></div></div>';
  });
  const custs=CUSTOM.filter(p=>p.kind==='muscu');
  if(custs.length){
    h+='<div class="lab" style="margin:16px 0 10px">Mes créations</div>';
    custs.forEach(p=>{
      h+='<div class="card"><div class="row"><div onclick="openProg(\''+p.id+'\')" style="flex:1"><div style="font-weight:700;font-size:16px">'+p.name+'</div><div style="font-size:12px;color:var(--muted);margin-top:3px">'+p.objective+' · '+p.ex.length+' exos</div></div><button class="x" onclick="delProg(\''+p.id+'\')">🗑</button></div></div>';
    });
  }
  return h;
}
function delProg(id){ if(!confirm('Supprimer ce programme ?'))return; CUSTOM=CUSTOM.filter(p=>p.id!==id); saveAll(); renderSport(); }
/* ===== VUE ROUTINE (style Hevy) ===== */
function exThumb(name,size){
  const g=exGif(name); size=size||64;
  if(g) return '<div style="width:'+size+'px;height:'+size+'px;border-radius:12px;background:#0c0f15 url('+g[0]+') center/cover;flex-shrink:0;border:1px solid var(--hair)"></div>';
  const e=findEx(name);
  return '<div style="width:'+size+'px;height:'+size+'px;border-radius:12px;background:var(--s2);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;border:1px solid var(--hair)">'+((e&&e.anim)||'🏋️')+'</div>';
}
function progDuration(p){ return p.ex.reduce((a,e)=>a+e.sets*1.8,0); } // estimation min
function openProg(id){
  const p=allProgs().find(x=>x.id===id); if(!p) return;
  $('#ovProgTitle').textContent='Routine';
  const totalSets=p.ex.reduce((a,e)=>a+(e.sets||0),0);
  const dur=Math.round(progDuration(p));
  const lvl=p.objective||'Intermédiaire';
  let h='<div class="row" style="margin-bottom:6px"><div class="man" style="font-weight:800;font-size:22px">'+(p.icon?p.icon+' ':'')+p.name+'</div></div>';
  h+='<div class="row" style="gap:8px;margin-bottom:14px"><span class="badge">'+lvl+'</span><span style="font-size:12px;color:var(--muted)">⏱ '+p.ex.length+' exercices</span></div>';
  // Carte stats
  h+='<div class="card" style="padding:0;overflow:hidden"><div style="display:flex;text-align:center">'+
    '<div style="flex:1;padding:14px 6px;border-right:1px solid var(--hair)"><div class="lab" style="margin:0 0 4px">Exercices</div><div class="man" style="font-weight:800;font-size:20px;color:var(--e)">'+p.ex.length+'</div></div>'+
    '<div style="flex:1;padding:14px 6px;border-right:1px solid var(--hair)"><div class="lab" style="margin:0 0 4px">Séries</div><div class="man" style="font-weight:800;font-size:20px">'+totalSets+'</div></div>'+
    '<div style="flex:1.3;padding:14px 6px"><div class="lab" style="margin:0 0 4px">Durée est.</div><div class="man" style="font-weight:800;font-size:20px">~'+dur+' min</div></div></div></div>';
  // Liste d'exercices avec vignette + numéro
  p.ex.forEach((e,i)=>{
    h+='<div class="card" style="padding:13px;margin-bottom:10px;cursor:pointer" onclick="openExDetail(\''+p.id+'\','+i+')"><div class="row" style="align-items:flex-start"><div style="position:relative;margin-right:12px">'+exThumb(e.name,64)+
      '<div style="position:absolute;top:-6px;left:-6px;width:22px;height:22px;border-radius:7px;background:var(--e);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800">'+(i+1)+'</div></div>'+
      '<div style="flex:1;min-width:0"><div style="font-weight:700;font-size:15px;line-height:1.25">'+e.name+'</div>'+
      '<div class="muscle-tags" style="margin-top:5px">'+(e.muscles||[]).slice(0,2).map(m=>'<span class="mtag">'+m+'</span>').join('')+'</div>'+
      '<div style="font-size:12px;color:var(--muted);margin-top:6px">'+e.sets+' séries · '+e.reps+' reps</div>'+
      '<div style="font-size:11px;color:var(--dim);margin-top:3px">⏱ ~'+Math.round(e.sets*1.8)+' min</div></div>'+
      '<span style="color:var(--dim);font-size:18px;align-self:center">›</span></div></div>';
  });
  h+='<button class="btn ghost" style="margin:4px 0 12px" onclick="openLibFor(addExToProg.bind(null,\''+p.id+'\'))">＋ Ajouter un exercice</button>';
  h+='<button class="btn" style="position:sticky;bottom:8px" onclick="startLive(\''+p.id+'\')">▶ Commencer l\u2019entraînement</button>';
  $('#progBody').innerHTML=h;
  openOv('ovProg');
}
function addExToProg(progId,e){
  const p=allProgs().find(x=>x.id===progId); if(!p)return;
  if(!p.kind){ toast('Les programmes par défaut ne sont pas modifiables'); return; }
  closeOv('ovLib'); openCfg(e,(cfg)=>{ p.ex.push(cfg); saveAll(); openProg(progId); });
}
/* ===== VUE EXERCICE DÉTAILLÉE (onglets) ===== */
let exDetailTab='exo', exDetailCtx=null;
function openExDetail(progId,idx){
  exDetailCtx={progId,idx}; exDetailTab='exo';
  renderExDetail();
}
function renderExDetail(){
  const p=allProgs().find(x=>x.id===exDetailCtx.progId); const e=p.ex[exDetailCtx.idx];
  const f=exMeta(e.name)||{primary:e.muscles||[],secondary:[],steps:[],tips:[],mistakes:[],safety:[],equip:'',level:''};
  $('#ovProgTitle').textContent=e.name;
  const g=exGif(e.name);
  let h='<div class="pills" style="margin-bottom:14px;overflow-x:auto;flex-wrap:nowrap">'+
    [['exo','Exercice'],['muscles','Muscles'],['instr','Instructions'],['tips','Conseils']].map(t=>'<div class="pill '+(exDetailTab===t[0]?'on':'')+'" onclick="exDetailTab=\''+t[0]+'\';renderExDetail()">'+t[1]+'</div>').join('')+'</div>';
  // Média animé
  if(g){
    h+='<div style="position:relative;background:#0c0f15;border:1px solid var(--hair);border-radius:16px;overflow:hidden;margin-bottom:14px"><img id="exDemo" src="'+g[0]+'" style="width:100%;display:block;aspect-ratio:16/11;object-fit:cover"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center" onclick="toggleExDemo()"><div id="exPlayBtn" style="width:56px;height:56px;border-radius:50%;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;font-size:22px;color:#fff;backdrop-filter:blur(4px)">▶</div></div></div>';
  } else {
    h+='<div style="background:linear-gradient(135deg,var(--s2),var(--s1));border:1px solid var(--hair);border-radius:16px;padding:36px;text-align:center;margin-bottom:14px"><div style="font-size:64px;animation:demoFloat 1.5s infinite">'+(e.anim||'🏋️')+'</div></div>';
  }
  if(exDetailTab==='exo'){
    h+='<div class="card"><div class="card-t">À propos de l\u2019exercice</div><div style="font-size:13px;color:var(--muted);line-height:1.55">Le <b style="color:var(--snow)">'+e.name+'</b> sollicite principalement '+((f.primary||[]).join(', ')||'plusieurs groupes musculaires')+(f.secondary&&f.secondary.length?', ainsi que '+f.secondary.join(', ')+' en secondaire':'')+'.</div></div>';
    // Repos
    h+='<div class="card"><div class="row"><div class="row" style="gap:10px"><span style="font-size:18px">⏱</span><div><div style="font-size:11px;color:var(--muted)">Repos entre les séries</div><div style="font-weight:700">'+(e.rest||90)+'s</div></div></div></div></div>';
    // mini stats
    const vol=(e.sets||3)*(parseInt(e.reps)||10)*(e.weight||0);
    h+='<div class="card" style="padding:0;overflow:hidden"><div style="display:flex;text-align:center"><div style="flex:1;padding:13px 4px;border-right:1px solid var(--hair)"><div class="lab" style="margin:0">Séries</div><div class="man" style="font-weight:800;font-size:18px">'+e.sets+'</div></div><div style="flex:1;padding:13px 4px;border-right:1px solid var(--hair)"><div class="lab" style="margin:0">Volume</div><div class="man" style="font-weight:800;font-size:18px">'+vol+' kg</div></div><div style="flex:1;padding:13px 4px"><div class="lab" style="margin:0">Durée</div><div class="man" style="font-weight:800;font-size:18px">~'+Math.round(e.sets*1.8)+'min</div></div></div></div>';
  } else if(exDetailTab==='muscles'){
    h+='<div class="card"><div class="card-t">🎯 Muscles principaux</div><div class="muscle-tags">'+(f.primary||[]).map(m=>'<span class="mtag" style="background:var(--ed);color:var(--e);border-color:var(--e)">'+m+'</span>').join('')+'</div>';
    if(f.secondary&&f.secondary.length) h+='<div class="card-t" style="margin-top:14px">Muscles secondaires</div><div class="muscle-tags">'+f.secondary.map(m=>'<span class="mtag">'+m+'</span>').join('')+'</div>';
    h+='</div>';
    if(f.equip) h+='<div class="card"><div class="row"><span class="lab">Matériel</span><span style="font-weight:600">'+f.equip+'</span></div></div>';
  } else if(exDetailTab==='instr'){
    h+='<div class="card"><div class="card-t">📋 Exécution</div>'+((f.steps&&f.steps.length)?f.steps.map((s,i)=>'<div class="tip" style="margin-bottom:6px"><b style="color:var(--e)">'+(i+1)+'.</b> '+s+'</div>').join(''):'<div style="font-size:13px;color:var(--muted)">Réalise le mouvement de façon contrôlée, amplitude complète.</div>')+'</div>';
    if(f.breathing) h+='<div class="card"><div class="card-t">🌬️ Respiration</div><div class="tip">'+f.breathing+'</div></div>';
  } else {
    if(f.tips&&f.tips.length) h+='<div class="card"><div class="card-t">✅ Conseils</div>'+f.tips.map(x=>'<div class="tip" style="margin-bottom:6px">'+x+'</div>').join('')+'</div>';
    if(f.mistakes&&f.mistakes.length) h+='<div class="card"><div class="card-t" style="color:var(--bad)">⚠️ Erreurs fréquentes</div>'+f.mistakes.map(x=>'<div class="tip" style="margin-bottom:6px;border-color:rgba(255,92,108,.3);background:rgba(255,92,108,.08)">✗ '+x+'</div>').join('')+'</div>';
    if(f.safety&&f.safety.length) h+='<div class="card"><div class="card-t">🛡️ Sécurité</div>'+f.safety.map(x=>'<div class="tip" style="margin-bottom:6px;border-color:rgba(51,211,153,.3);background:rgba(51,211,153,.08)">'+x+'</div>').join('')+'</div>';
  }
  h+='<div class="row" style="gap:10px;margin-top:8px"><button class="btn ghost" onclick="openProg(\''+exDetailCtx.progId+'\')">‹ Retour</button><button class="btn" onclick="startLive(\''+exDetailCtx.progId+'\','+exDetailCtx.idx+')">▶ Démarrer</button></div>';
  $('#progBody').innerHTML=h;
  openOv('ovProg');
}
let _exDemo2=null;
function toggleExDemo(){
  const g=exGif(allProgs().find(x=>x.id===exDetailCtx.progId).ex[exDetailCtx.idx].name); if(!g)return;
  const img=$('#exDemo'), btn=$('#exPlayBtn');
  if(_exDemo2){ clearInterval(_exDemo2); _exDemo2=null; if(btn)btn.textContent='▶'; return; }
  g.forEach(s=>{const im=new Image();im.src=s;}); let i=0;
  if(btn)btn.textContent='⏸';
  _exDemo2=setInterval(()=>{ const im=$('#exDemo'); if(!im){clearInterval(_exDemo2);_exDemo2=null;return;} i=1-i; im.src=g[i]; },650);
}

/* ---------- LIVE MUSCU SESSION ---------- */
let LIVE=null,liveTimer=null,restTimer=null;
function startLive(id,startIdx){
  const p=allProgs().find(x=>x.id===id); if(!p) return;
  if(_exDemo2){ clearInterval(_exDemo2); _exDemo2=null; }
  closeOv('ovProg');
  LIVE={prog:p,idx:startIdx||0,start:Date.now(),
    state:p.ex.map(e=>({weight:e.weight||20,reps:parseInt(e.reps)||10,sets:Array.from({length:e.sets},()=>false),log:[]})),
    tonnage:0,setsDone:0};
  renderLive(); openOv('ovLive');
  liveTimer=setInterval(updateLiveTimer,500);
  sfx('start'); startBgActivity('Séance : '+p.name);
}
function updateLiveTimer(){
  if(!LIVE) return;
  const el=$('#liveTime'); if(el) el.textContent=fmtTime((Date.now()-LIVE.start)/1000);
  // Sauvegarde continue → la séance survit même si l'app est fermée/rechargée
  persistLive();
}
function persistLive(){
  if(!LIVE) return;
  const snap={progId:LIVE.prog.id,idx:LIVE.idx,start:LIVE.start,state:LIVE.state,tonnage:LIVE.tonnage,setsDone:LIVE.setsDone};
  DB.save('live_active',snap);
}
function renderLive(){
  const p=LIVE.prog, e=p.ex[LIVE.idx], st=LIVE.state[LIVE.idx];
  if(!st.log||st.log.length!==st.sets.length){ st.log=st.sets.map((d,i)=>(st.log&&st.log[i])||{kg:e.weight||st.weight||20,reps:parseInt(e.reps)||st.reps||10,rpe:8,done:!!d}); }
  $('#liveTitle').textContent=e.name;
  const totalSets=p.ex.reduce((a,x)=>a+x.sets,0);
  const prog=LIVE.setsDone/totalSets*100;
  const g=exGif(e.name);
  // Header : temps + progression + pastilles
  let h='<div class="row" style="margin-bottom:10px"><span class="mono" id="liveTime" style="font-size:17px;font-weight:700;color:var(--e)">0:00</span><div style="display:flex;gap:6px"><button class="btn ghost sm" style="width:auto;padding:6px 10px" onclick="pauseLive()">⏸ Plus tard</button><span class="lab" style="align-self:center">'+(LIVE.idx+1)+'/'+p.ex.length+'</span></div></div>';
  h+='<div class="pbar" style="margin-bottom:12px"><div style="width:'+prog+'%"></div></div>';
  h+='<div style="display:flex;gap:5px;overflow-x:auto;margin-bottom:14px;padding-bottom:4px">';
  p.ex.forEach((ex2,i)=>{ const allDone=LIVE.state[i].sets.every(x=>x); const cur=i===LIVE.idx;
    h+='<div onclick="jumpLive('+i+')" style="flex-shrink:0;width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;cursor:pointer;border:1px solid '+(cur?'var(--e)':'var(--hair)')+';background:'+(cur?'var(--ed)':allDone?'rgba(51,211,153,.18)':'var(--s2)')+';color:'+(allDone?'var(--ok)':cur?'var(--e)':'var(--muted)')+'">'+(allDone&&!cur?'✓':(i+1))+'</div>'; });
  h+='</div>';
  // Média
  if(g){ h+='<div style="position:relative;background:#0c0f15;border:1px solid var(--hair);border-radius:14px;overflow:hidden;margin-bottom:12px"><img id="exDemo" src="'+g[0]+'" style="width:100%;display:block;aspect-ratio:16/10;object-fit:cover"><div onclick="toggleExDemoLive()" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center"><div id="exPlayBtn" style="width:50px;height:50px;border-radius:50%;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;backdrop-filter:blur(4px)">▶</div></div></div>'; }
  // Repos
  h+='<div class="card" style="padding:12px;margin-bottom:10px"><div class="row"><div class="row" style="gap:10px"><span style="font-size:16px">⏱</span><div><div style="font-size:11px;color:var(--muted)">Repos entre séries</div><div style="font-weight:700">'+(e.rest||90)+'s</div></div></div><span style="color:var(--e);font-size:12px;cursor:pointer" onclick="changeRest()">Modifier</span></div></div>';
  // Tableau Séries effectuées
  h+='<div class="card" style="padding:14px"><div class="card-t" style="margin-bottom:10px">Séries effectuées</div>';
  h+='<div style="display:grid;grid-template-columns:38px 1fr 1fr 1fr 44px;gap:6px;font-size:10px;color:var(--muted);font-weight:700;text-transform:uppercase;margin-bottom:8px;text-align:center"><div>Série</div><div>KG</div><div>RÉPS</div><div>RPE</div><div>✓</div></div>';
  st.log.forEach((s,i)=>{
    h+='<div style="display:grid;grid-template-columns:38px 1fr 1fr 1fr 44px;gap:6px;align-items:center;margin-bottom:7px">'+
      '<div style="text-align:center;font-weight:700;color:var(--muted)">'+(i+1)+'</div>'+
      '<input class="setcell" type="number" inputmode="decimal" value="'+s.kg+'" onchange="setLog('+i+',\'kg\',this.value)">'+
      '<input class="setcell" type="number" inputmode="numeric" value="'+s.reps+'" onchange="setLog('+i+',\'reps\',this.value)">'+
      '<input class="setcell" type="number" inputmode="numeric" value="'+s.rpe+'" onchange="setLog('+i+',\'rpe\',this.value)">'+
      '<div onclick="toggleSet('+i+')" style="width:34px;height:34px;border-radius:50%;margin:0 auto;cursor:pointer;display:flex;align-items:center;justify-content:center;background:'+(s.done?'var(--e)':'var(--s2)')+';border:1px solid '+(s.done?'var(--e)':'var(--hair)')+';color:#fff;font-size:15px">'+(s.done?'✓':'')+'</div></div>';
  });
  h+='<button class="btn ghost sm" style="margin-top:6px" onclick="addLiveSet()">＋ Ajouter une série</button></div>';
  // Notes
  h+='<div class="card" style="padding:14px"><div class="row" style="margin-bottom:6px"><span class="lab" style="margin:0">Notes (optionnel)</span><span style="color:var(--e)">✎</span></div><textarea class="inp" rows="2" placeholder="Comment s\u2019est passée cette série ?" oninput="LIVE.state['+LIVE.idx+'].note=this.value">'+(st.note||'')+'</textarea></div>';
  // Progression (mini graphe basé sur l'historique)
  h+=liveProgressChart(e.name);
  // Actions
  h+='<div class="row" style="gap:8px;margin-top:8px"><button class="btn ghost sm" onclick="liveNav(-1)" '+(LIVE.idx===0?'disabled style="opacity:.4"':'')+'>◀</button>';
  h+='<button class="btn ghost sm" onclick="skipExercise()">Passer</button>';
  if(LIVE.idx<p.ex.length-1) h+='<button class="btn sm" onclick="liveNav(1)">Exercice suivant ▶</button>';
  else h+='<button class="btn sm" onclick="finishLive()" style="background:linear-gradient(135deg,var(--e),#6FA0FF)">🏁 Terminer</button>';
  h+='</div>';
  h+='<button class="btn" style="margin-top:8px;background:var(--ok)" onclick="finishLive()">✓ Terminer l\u2019exercice</button>';
  $('#liveBody').innerHTML=h;
}
function liveProgressChart(name){
  // historique des volumes pour cet exercice
  const hist=(PREFS.exHist&&PREFS.exHist[name])||[];
  if(hist.length<2) return '<div class="card" style="padding:14px"><div class="card-t">Progression</div><div style="font-size:12px;color:var(--dim)">L\u2019historique de progression apparaîtra après quelques séances.</div></div>';
  const data=hist.slice(-8).map(x=>x.vol); const min=Math.min(...data),max=Math.max(...data),rng=(max-min)||1;
  const W=300,H=80; const pts=data.map((v,i)=>(i/(data.length-1)*W).toFixed(0)+','+(H-(v-min)/rng*H).toFixed(0));
  const best=Math.max(...hist.map(x=>x.vol)), avg=Math.round(hist.reduce((a,x)=>a+x.vol,0)/hist.length);
  const prog=hist.length>=2?Math.round((data[data.length-1]-data[0])/(data[0]||1)*100):0;
  let h='<div class="card" style="padding:14px"><div class="card-t">📈 Progression</div>';
  h+='<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:80px"><polyline points="'+pts.join(' ')+'" fill="none" stroke="var(--e)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  h+='<div style="display:flex;text-align:center;margin-top:8px"><div style="flex:1"><div class="lab" style="margin:0">Meilleur</div><div class="man" style="font-weight:700;font-size:14px">'+best+' kg</div></div><div style="flex:1"><div class="lab" style="margin:0">Moyen</div><div class="man" style="font-weight:700;font-size:14px">'+avg+' kg</div></div><div style="flex:1"><div class="lab" style="margin:0">Évolution</div><div class="man" style="font-weight:700;font-size:14px;color:'+(prog>=0?'var(--ok)':'var(--bad)')+'">'+(prog>=0?'+':'')+prog+'%</div></div></div></div>';
  return h;
}
function toggleExDemoLive(){
  const e=LIVE.prog.ex[LIVE.idx]; const g=exGif(e.name); if(!g)return;
  const btn=$('#exPlayBtn');
  if(_exDemo2){ clearInterval(_exDemo2); _exDemo2=null; if(btn)btn.textContent='▶'; return; }
  g.forEach(s=>{const im=new Image();im.src=s;}); let i=0; if(btn)btn.textContent='⏸';
  _exDemo2=setInterval(()=>{ const im=$('#exDemo'); if(!im){clearInterval(_exDemo2);_exDemo2=null;return;} i=1-i; im.src=g[i]; },650);
}
function setLog(i,k,v){ const st=LIVE.state[LIVE.idx]; st.log[i][k]=+v||0; if(k==='kg')st.weight=+v||st.weight; persistLive(); }
function changeRest(){ const e=LIVE.prog.ex[LIVE.idx]; pickInt('Repos (secondes)',15,300,e.rest||90,'s',v=>{ e.rest=v; renderLive(); },15); }
function addLiveSet(){ const st=LIVE.state[LIVE.idx]; const last=st.log[st.log.length-1]||{kg:20,reps:10,rpe:8}; st.sets.push(false); st.log.push({kg:last.kg,reps:last.reps,rpe:last.rpe,done:false}); renderLive(); }
function jumpLive(i){ LIVE.idx=i; renderLive(); }
function skipExercise(){ if(LIVE.idx<LIVE.prog.ex.length-1){ LIVE.idx++; renderLive(); toast('Exercice passé'); } else toast('Dernier exercice'); }
function pauseLive(){
  clearInterval(liveTimer);
  LIVE.savedElapsed=Date.now()-LIVE.start;
  DB.save('live_paused',LIVE); localStorage.removeItem('vvv_live_active');
  closeOv('ovLive'); LIVE=null; toast('Séance sauvegardée — reprends quand tu veux');
  stopBgActivity(); renderSport();
}
function resumeLive(){
  const saved=DB.load('live_paused'); if(!saved) return;
  LIVE=saved; LIVE.prog=allProgs().find(x=>x.id===saved.prog.id)||saved.prog;
  LIVE.start=Date.now()-(saved.savedElapsed||0);
  localStorage.removeItem('vvv_live_paused');
  renderLive(); openOv('ovLive'); liveTimer=setInterval(updateLiveTimer,500);
}
function liveAdj(k,v){ const st=LIVE.state[LIVE.idx]; st[k]=Math.max(0,st[k]+v); $(k==='weight'?'#lvW':'#lvR').textContent=st[k]; }
function toggleSet(i){
  const st=LIVE.state[LIVE.idx];
  if(!st.log) st.log=st.sets.map(()=>({kg:st.weight,reps:st.reps,rpe:8}));
  const s=st.log[i]||{kg:st.weight,reps:st.reps};
  st.sets[i]=!st.sets[i]; st.log[i].done=st.sets[i];
  const vol=(s.kg||0)*(s.reps||0);
  if(st.sets[i]){ LIVE.setsDone++; LIVE.tonnage+=vol; openRest(st.log[i].rest||LIVE.prog.ex[LIVE.idx].rest||90); sfx('tick'); toast('+5 XP'); }
  else { LIVE.setsDone--; LIVE.tonnage-=vol; }
  persistLive(); renderLive();
}
function validSet(){
  const st=LIVE.state[LIVE.idx];
  const idx=st.sets.findIndex(x=>!x);
  if(idx<0){ toast('Toutes les séries faites !'); return; }
  toggleSet(idx);
}
function openRest(secs){
  let t=secs||90; const total=t; const endAt=Date.now()+t*1000;
  const ov=document.createElement('div'); ov.className='ov on'; ov.id='restOv';
  ov.innerHTML='<div class="ov-card" style="text-align:center"><div class="card-t" style="justify-content:center">⏱ Repos</div><div class="ring-wrap" style="width:170px;height:170px;margin:10px auto"><span id="restRing"></span><div class="ring-c"><div class="big mono" id="restNum" style="font-size:38px">'+t+'</div><div class="sm">sec</div></div></div><div class="row" style="gap:10px"><button class="btn ghost" onclick="addRest(30)">+30s</button><button class="btn" onclick="skipRest()">Passer</button></div></div>';
  document.body.appendChild(ov);
  let extra=0;
  function tick(){
    t=Math.max(0,Math.round((endAt+extra*1000-Date.now())/1000));
    const rr=$('#restRing'); if(rr)rr.innerHTML=ringSVG(170,t/(total+extra)*100,12,'var(--e)');
    const rn=$('#restNum'); if(rn)rn.textContent=t;
    if(t<=0){ sfx('tick'); skipRest(); return; }
  }
  tick();
  restTimer=setInterval(tick,250);
  window._restAdd=(s)=>{ extra+=s; };
}
function addRest(s){ if(window._restAdd)window._restAdd(s); }
function skipRest(){ clearInterval(restTimer); const o=$('#restOv'); if(o)o.remove(); }
function liveNav(d){ LIVE.idx=Math.max(0,Math.min(LIVE.prog.ex.length-1,LIVE.idx+d)); renderLive(); }
function confirmCloseLive(){ if(confirm('Quitter la séance ? La progression sera perdue.')){ clearInterval(liveTimer); LIVE=null; localStorage.removeItem('vvv_live_active'); closeOv('ovLive'); stopBgActivity(); } }
function finishLive(){
  clearInterval(liveTimer); skipRest();
  const dur=Math.round((Date.now()-LIVE.start)/1000);
  const cal=Math.round(LIVE.tonnage*0.05+dur/60*6);
  const totalReps=LIVE.state.reduce((a,st,i)=>a+st.sets.filter(Boolean).length*st.reps,0);
  // PR : compare au meilleur tonnage par exercice (records charge)
  const prs=[];
  LIVE.state.forEach((st,i)=>{ if(st.sets.some(Boolean)){ const name=LIVE.prog.ex[i].name;
    const prev=MUSCU_PR[name]||0; if(st.weight>prev){ MUSCU_PR[name]=st.weight; prs.push(name+' : '+st.weight+'kg'); } }});
  DB.save('muscu_pr',MUSCU_PR);
  // progression vs séance précédente du même programme
  const prevSess=MSESS.filter(s=>s.progName===LIVE.prog.name).slice(-1)[0];
  const prevTon=prevSess?prevSess.tonnage:0;
  // muscles travaillés
  const muscles={}; LIVE.prog.ex.forEach((e,i)=>{ if(LIVE.state[i].sets.some(Boolean)) (e.muscles||[]).forEach(m=>muscles[m]=(muscles[m]||0)+1); });
  MSESS.push({date:todayKey(),progName:LIVE.prog.name,tonnage:LIVE.tonnage,sets:LIVE.setsDone,reps:totalReps,duration:dur,calories:cal,muscles:Object.keys(muscles)});
  // Historique par exercice (pour les graphiques de progression)
  if(!PREFS.exHist) PREFS.exHist={};
  LIVE.prog.ex.forEach((e,i)=>{ const st=LIVE.state[i]; if(st.sets.some(Boolean)){
    const vol=(st.log||[]).reduce((a,s)=>a+(s.done?(s.kg||0)*(s.reps||0):0),0);
    if(vol>0){ if(!PREFS.exHist[e.name])PREFS.exHist[e.name]=[]; PREFS.exHist[e.name].push({date:todayKey(),vol}); PREFS.exHist[e.name]=PREFS.exHist[e.name].slice(-30); }
  }});
  localStorage.removeItem('vvv_live_active');
  saveAll(); refreshXP({animate:true}); burst(); sfx('finish'); stopBgActivity();
  let h='<div class="popin" style="text-align:center;padding:6px 0"><div style="font-size:50px">🏆</div><div class="man" style="font-weight:800;font-size:22px;margin:8px 0">Séance terminée !</div></div>';
  h+='<div class="sgrid" style="margin-bottom:12px"><div class="sbox"><div class="v">'+Math.round(LIVE.tonnage)+'</div><div class="l">Tonnage (kg)</div></div><div class="sbox"><div class="v">'+fmtTime(dur)+'</div><div class="l">Durée</div></div><div class="sbox"><div class="v">'+LIVE.setsDone+'</div><div class="l">Séries</div></div><div class="sbox"><div class="v">'+totalReps+'</div><div class="l">Répétitions</div></div><div class="sbox"><div class="v">'+cal+'</div><div class="l">Calories</div></div><div class="sbox"><div class="v" style="color:var(--or)">'+prs.length+'</div><div class="l">Records battus</div></div></div>';
  // progression
  if(prevTon){ const diff=Math.round(LIVE.tonnage-prevTon); const up=diff>=0;
    h+='<div class="tip" style="margin-bottom:12px;'+(up?'border-color:rgba(51,211,153,.3);background:rgba(51,211,153,.08)':'')+'">'+(up?'📈 +':'📉 ')+diff+' kg de tonnage vs ta dernière séance '+LIVE.prog.name+'.</div>'; }
  // PR
  if(prs.length) h+='<div class="card-t">🥇 Nouveaux records</div>'+prs.map(p=>'<div class="tip" style="margin-bottom:6px;border-color:rgba(242,184,75,.4);background:rgba(242,184,75,.1)">⭐ '+p+'</div>').join('');
  // muscles schema
  if(Object.keys(muscles).length){ h+='<div class="card-t" style="margin-top:12px">💪 Muscles travaillés</div><div class="muscle-tags" style="margin-bottom:12px">'+Object.keys(muscles).map(m=>'<span class="mtag" style="background:var(--ed);color:var(--e);border-color:var(--e)">'+m+'</span>').join('')+'</div>'; }
  h+='<div class="badge" style="width:100%;justify-content:center;padding:14px;margin:6px 0 14px">+50 XP gagnés !</div>';
  h+='<button class="btn" onclick="closeOv(\'ovLive\');LIVE=null;renderSport()">Fermer</button>';
  $('#liveBody').innerHTML=h;
}

/* ---------- CREATE PROGRAM ---------- */
let newProg=null,libFilter='Tous',libCallback=null;
const PROG_ICONS=['💪','🏋️','🔥','⚡','🦾','🎯','🏆','🦵','🧗','🤸'];
const PROG_COLORS=[['--e','Bleu'],['--bad','Rouge'],['--ok','Vert'],['--or','Or'],['--maitre','Violet'],['--diamant','Cyan']];
function openCreate(){
  newProg={name:'',description:'',objective:'Masse',color:'--e',icon:'💪',ex:[]};
  renderCreate(); openOv('ovCreate');
}
function renderCreate(){
  let h='<div class="field"><label>Nom du programme</label><input class="inp" id="npName" value="'+newProg.name+'" oninput="newProg.name=this.value" placeholder="Mon programme"></div>';
  h+='<div class="field"><label>Description</label><textarea class="inp" rows="2" oninput="newProg.description=this.value" placeholder="Objectif, split, fréquence...">'+(newProg.description||'')+'</textarea></div>';
  h+='<div class="field"><label>Objectif</label><div class="pills">'+['Force','Masse','Endurance','Perte poids','Maintien'].map(o=>'<div class="pill '+(newProg.objective===o?'on':'')+'" onclick="newProg.objective=\''+o+'\';renderCreate()">'+o+'</div>').join('')+'</div></div>';
  h+='<div class="field"><label>Icône</label><div class="pills">'+PROG_ICONS.map(ic=>'<div class="pill '+(newProg.icon===ic?'on':'')+'" style="font-size:18px" onclick="newProg.icon=\''+ic+'\';renderCreate()">'+ic+'</div>').join('')+'</div></div>';
  h+='<div class="field"><label>Couleur</label><div class="pills">'+PROG_COLORS.map(c=>'<div class="pill '+(newProg.color===c[0]?'on':'')+'" onclick="newProg.color=\''+c[0]+'\';renderCreate()"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var('+c[0]+');margin-right:6px"></span>'+c[1]+'</div>').join('')+'</div></div>';
  h+='<div class="lab" style="margin:10px 0 8px">Exercices ('+newProg.ex.length+')</div>';
  if(!newProg.ex.length) h+='<div class="tip" style="margin-bottom:12px">Ajoute des exercices depuis la bibliothèque.</div>';
  newProg.ex.forEach((e,i)=>{
    h+='<div class="card" style="margin-bottom:8px;padding:12px"><div class="row"><div class="row" style="gap:8px"><span style="font-size:22px">'+e.anim+'</span><div><div style="font-weight:700;font-size:14px">'+e.name+'</div><div class="mono" style="font-size:12px;color:var(--e)">'+e.sets+'×'+e.reps+(e.rest?' · '+e.rest+'s':'')+'</div></div></div><button class="x" onclick="newProg.ex.splice('+i+',1);renderCreate()">🗑</button></div></div>';
  });
  h+='<button class="btn ghost" style="margin-bottom:12px" onclick="openLibFor(addToNewProg)">＋ Ajouter depuis la bibliothèque</button>';
  h+='<button class="btn" onclick="saveNewProg()">💾 Enregistrer le programme</button>';
  $('#createBody').innerHTML=h;
}
function addToNewProg(e){ closeOv('ovLib'); openCfg(e,(cfg)=>{ newProg.ex.push(cfg); renderCreate(); openOv('ovCreate'); }); }
function saveNewProg(){
  if(!newProg.name.trim()){ toast('Donne un nom'); return; }
  if(!newProg.ex.length){ toast('Ajoute des exercices'); return; }
  CUSTOM.push({id:'C'+Date.now(),kind:'muscu',name:newProg.name,description:newProg.description,objective:newProg.objective,color:newProg.color,icon:newProg.icon,ex:newProg.ex});
  saveAll(); closeOv('ovCreate'); renderSport(); toast('Programme créé ✓');
}

/* ---------- BIBLIOTHÈQUE PREMIUM ---------- */
let libFilterEquip='Tous', libFilterLevel='Tous', libSearch='', libBrowseMode=false;
function openLibFor(cb){ libCallback=cb; libBrowseMode=false; closeOv('ovCreate'); renderLib(); openOv('ovLib'); }
function openLibBrowse(){ libCallback=null; libBrowseMode=true; renderLib(); openOv('ovLib'); }
function renderLib(){
  let h='<input class="inp" style="margin-bottom:12px" placeholder="🔍 Rechercher un exercice..." value="'+libSearch+'" oninput="libSearch=this.value;renderLib();this.focus()">';
  h+='<div class="lab" style="margin-bottom:6px">Muscle</div><div class="pills" style="margin-bottom:10px;overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px">'+MUSCLE_GROUPS.map(m=>'<div class="pill '+(libFilter===m?'on':'')+'" onclick="libFilter=\''+m+'\';renderLib()">'+m+'</div>').join('')+'</div>';
  h+='<div class="lab" style="margin-bottom:6px">Matériel</div><div class="pills" style="margin-bottom:10px;overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px">'+EQUIPMENT.map(m=>'<div class="pill '+(libFilterEquip===m?'on':'')+'" onclick="libFilterEquip=\''+m+'\';renderLib()">'+m+'</div>').join('')+'</div>';
  h+='<div class="lab" style="margin-bottom:6px">Niveau</div><div class="pills" style="margin-bottom:14px">'+['Tous',...LEVELS].map(m=>'<div class="pill '+(libFilterLevel===m?'on':'')+'" onclick="libFilterLevel=\''+m+'\';renderLib()">'+m+'</div>').join('')+'</div>';
  const q=libSearch.toLowerCase().trim();
  const list=allExercises().filter(e=>{
    if(libFilter!=='Tous' && e.group!==libFilter && !(e.primary||[]).some(m=>m.includes(libFilter)||libFilter.includes(m))) return false;
    if(libFilterEquip!=='Tous' && e.equip!==libFilterEquip) return false;
    if(libFilterLevel!=='Tous' && e.level!==libFilterLevel) return false;
    if(q && !e.name.toLowerCase().includes(q)) return false;
    return true;
  });
  h+='<div class="lab" style="margin-bottom:8px">'+list.length+' exercice'+(list.length>1?'s':'')+'</div>';
  list.forEach(e=>{
    const lvCol=e.level==='Débutant'?'--ok':e.level==='Avancé'?'--bad':'--warn';
    h+='<div class="card" style="margin-bottom:8px;padding:12px"><div class="row"><div class="row" style="gap:10px;flex:1;cursor:pointer" onclick=\'openFiche("'+e.name.replace(/"/g,'&quot;')+'")\'><span style="font-size:24px">'+e.anim+'</span><div><div style="font-weight:700;font-size:14px">'+e.name+'</div><div style="font-size:11px;color:var(--muted);margin-top:2px">'+e.equip+' · <span style="color:var('+lvCol+')">'+e.level+'</span></div><div class="muscle-tags">'+(e.primary||[]).map(m=>'<span class="mtag">'+m+'</span>').join('')+'</div></div></div>'+(libBrowseMode?'<button class="x" onclick=\'openFiche("'+e.name.replace(/"/g,'&quot;')+'")\'>›</button>':'<button class="x" style="color:var(--e)" onclick=\'pickEx("'+e.name.replace(/"/g,'&quot;')+'")\'>＋</button>')+'</div></div>';
  });
  $('#libBody').innerHTML=h;
}
function pickEx(name){ const e=findEx(name); if(libCallback) libCallback(e); else openFiche(name); }
/* Fiche tutoriel complète */
function openFiche(name){
  const f=exMeta(name); if(!f) return;
  const lvCol=f.level==='Débutant'?'--ok':f.level==='Avancé'?'--bad':'--warn';
  let h='<div style="text-align:center;margin-bottom:14px"><div style="font-size:64px;animation:popIn .5s">'+f.anim+'</div><div class="man" style="font-weight:800;font-size:20px;margin-top:4px">'+f.name+'</div><div style="margin-top:8px;display:flex;gap:6px;justify-content:center;flex-wrap:wrap"><span class="badge">'+f.equip+'</span><span class="badge" style="background:var(--ed);color:var('+lvCol+')">'+f.level+'</span></div></div>';
  // visuel animé (placeholder élégant simulant un GIF/avatar)
  if(f.gif){
    // Démonstration animée réelle (2 frames alternées = mouvement)
    h+='<div style="position:relative;background:#fff;border:1px solid var(--hair);border-radius:18px;overflow:hidden;margin-bottom:14px">'+
      '<img id="exDemo" src="'+f.gif[0]+'" alt="démonstration" style="width:100%;display:block;aspect-ratio:5/4;object-fit:cover" onerror="this.parentNode.style.display=\'none\';document.getElementById(\'exDemoFallback\').style.display=\'block\'">'+
      '<div style="position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.7));padding:10px 12px 8px;display:flex;align-items:center;gap:6px;font-size:11px;color:#fff;font-weight:700"><span style="width:7px;height:7px;border-radius:50%;background:var(--e);animation:demoPulse 1s infinite"></span>DÉMONSTRATION DU MOUVEMENT</div></div>';
    h+='<div id="exDemoFallback" style="display:none;position:relative;background:linear-gradient(135deg,var(--s2),var(--s1));border:1px solid var(--hair);border-radius:18px;padding:34px 16px;text-align:center;margin-bottom:14px"><div style="font-size:68px;animation:demoFloat 1.5s ease-in-out infinite">'+f.anim+'</div><div style="font-size:11px;color:var(--dim);margin-top:8px">Démonstration du mouvement</div></div>';
    startExDemo(f.gif);
  } else {
    h+='<div style="position:relative;background:linear-gradient(135deg,var(--s2),var(--s1));border:1px solid var(--hair);border-radius:18px;padding:34px 16px;text-align:center;margin-bottom:14px;overflow:hidden">'+
      '<div style="position:absolute;inset:0;background:radial-gradient(circle at 50% 40%,var(--ed),transparent 70%)"></div>'+
      '<div style="position:relative;font-size:68px;animation:demoFloat 1.5s ease-in-out infinite;filter:drop-shadow(0 6px 14px rgba(0,0,0,.4))">'+f.anim+'</div>'+
      '<div style="position:relative;display:inline-flex;align-items:center;gap:6px;margin-top:12px;font-size:11px;color:var(--e);font-weight:700"><span style="width:7px;height:7px;border-radius:50%;background:var(--e);animation:demoPulse 1s infinite"></span>DÉMONSTRATION DU MOUVEMENT</div></div>';
  }
  h+='<div class="card-t">🎯 Muscles sollicités</div><div style="margin-bottom:12px"><div style="font-size:12px;color:var(--muted);margin-bottom:4px">Principaux</div><div class="muscle-tags">'+(f.primary||[]).map(m=>'<span class="mtag" style="background:var(--ed);color:var(--e);border-color:var(--e)">'+m+'</span>').join('')+'</div>'+((f.secondary&&f.secondary.length)?'<div style="font-size:12px;color:var(--muted);margin:8px 0 4px">Secondaires</div><div class="muscle-tags">'+f.secondary.map(m=>'<span class="mtag">'+m+'</span>').join('')+'</div>':'')+'</div>';
  h+='<div class="card-t">📋 Exécution étape par étape</div>'+f.steps.map((s,i)=>'<div class="tip" style="margin-bottom:6px"><b style="color:var(--e)">'+(i+1)+'.</b> '+s+'</div>').join('');
  h+='<div class="card-t" style="margin-top:14px">🌬️ Respiration</div><div class="tip">'+f.breathing+'</div>';
  h+='<div class="card-t" style="margin-top:14px;color:var(--bad)">⚠️ Erreurs fréquentes</div>'+f.mistakes.map(m=>'<div class="tip" style="margin-bottom:6px;border-color:rgba(255,92,108,.3);background:rgba(255,92,108,.08)">✗ '+m+'</div>').join('');
  h+='<div class="card-t" style="margin-top:14px">✅ Conseils du coach</div>'+f.tips.map(t=>'<div class="tip" style="margin-bottom:6px">'+t+'</div>').join('');
  h+='<div class="card-t" style="margin-top:14px">🛡️ Sécurité</div>'+f.safety.map(s=>'<div class="tip" style="margin-bottom:6px;border-color:rgba(51,211,153,.3);background:rgba(51,211,153,.08)">'+s+'</div>').join('');
  if(f.variants&&f.variants.length){ h+='<div class="card-t" style="margin-top:14px">🔁 Variantes</div><div class="pills">'+f.variants.map(v=>'<div class="pill" onclick=\'openFiche("'+v.replace(/"/g,'&quot;')+'")\'>'+v+'</div>').join('')+'</div>'; }
  if(libCallback) h+='<button class="btn" style="margin-top:18px" onclick=\'pickEx("'+f.name.replace(/"/g,'&quot;')+'")\'>＋ Ajouter au programme</button>';
  $('#libBody').innerHTML=h;
}
let _exDemoTimer=null;
function startExDemo(frames){
  clearInterval(_exDemoTimer);
  // précharge les 2 images
  frames.forEach(src=>{ const im=new Image(); im.src=src; });
  let i=0;
  _exDemoTimer=setInterval(()=>{
    const img=document.getElementById('exDemo');
    if(!img){ clearInterval(_exDemoTimer); return; }
    i=1-i; img.src=frames[i];
  },850);
}

/* ---------- CONFIG EXERCISE ---------- */
let cfgEx=null,cfgState=null,cfgCallback=null;
function openCfg(e,cb){
  cfgEx=e; cfgCallback=cb;
  cfgState={name:e.name,anim:e.anim,muscles:e.muscles,tip:e.tip,sets:e.sets||3,reps:String(e.reps||10),weight:20,rest:90,amrap:false,note:''};
  renderCfg(); openOv('ovCfg');
}
function renderCfg(){
  const s=cfgState;
  let h='<div style="text-align:center;margin-bottom:14px"><span style="font-size:40px">'+s.anim+'</span><div class="man" style="font-weight:800;font-size:18px;margin-top:4px">'+s.name+'</div></div>';
  h+='<div class="field"><label>Séries</label><div class="stepper"><button onclick="cfgAdj(\'sets\',-1)">−</button><span class="val" id="cfSets">'+s.sets+'</span><button onclick="cfgAdj(\'sets\',1)">+</button></div></div>';
  h+='<div class="field"><label>Répétitions</label><div class="pills" style="margin-bottom:8px">'+['6','8','10','12','15'].map(r=>'<div class="pill '+(s.reps===r&&!s.amrap?'on':'')+'" onclick="cfgState.reps=\''+r+'\';cfgState.amrap=false;renderCfg()">'+r+'</div>').join('')+'<div class="pill '+(s.amrap?'on':'')+'" onclick="cfgState.amrap=true;cfgState.reps=\'AMRAP\';renderCfg()">AMRAP</div></div></div>';
  h+='<div class="field"><label>Charge (kg)</label><div class="stepper"><button onclick="cfgAdj(\'weight\',-2.5)">−</button><button onclick="cfgAdj(\'weight\',-5)" style="font-size:12px">−5</button><span class="val" id="cfW">'+s.weight+'</span><button onclick="cfgAdj(\'weight\',5)" style="font-size:12px">+5</button><button onclick="cfgAdj(\'weight\',2.5)">+</button></div><div class="pills" style="margin-top:8px">'+[20,40,60,80,100].map(w=>'<div class="pill" onclick="cfgState.weight='+w+';renderCfg()">'+w+'kg</div>').join('')+'</div></div>';
  h+='<div class="field"><label>Repos</label><div class="pills">'+[60,90,120,180].map(r=>'<div class="pill '+(s.rest===r?'on':'')+'" onclick="cfgState.rest='+r+';renderCfg()">'+r+'s</div>').join('')+'</div></div>';
  h+='<div class="field"><label>Notes personnelles (optionnel)</label><textarea class="inp" rows="2" oninput="cfgState.note=this.value" placeholder="ex: bien serrer les omoplates">'+(s.note||'')+'</textarea></div>';
  h+='<button class="btn" onclick="saveCfg()">✓ Ajouter</button>';
  $('#cfgBody').innerHTML=h;
}
function cfgAdj(k,v){ cfgState[k]=Math.max(k==='weight'?0:1,cfgState[k]+v); renderCfg(); }
function saveCfg(){
  const s=cfgState;
  const cfg={name:s.name,anim:s.anim,muscles:s.muscles,tip:s.tip,sets:s.sets,reps:s.reps,weight:s.weight,rest:s.rest,note:s.note};
  closeOv('ovCfg'); if(cfgCallback) cfgCallback(cfg);
}

/* ---------- STATS ---------- */
let statsTab='bilan';
function renderStats(){
  let h='<div class="pills" style="margin:6px 0 16px;overflow-x:auto;flex-wrap:nowrap">'+
    [['bilan','Bilan'],['run','Run'],['muscu','Muscu'],['medals','Médailles']].map(t=>'<div class="pill '+(statsTab===t[0]?'on':'')+'" onclick="statsTab=\''+t[0]+'\';renderStats()">'+t[1]+'</div>').join('')+'</div>';
  if(statsTab==='bilan') h+=statsBilan();
  if(statsTab==='run') h+=statsRun();
  if(statsTab==='muscu') h+=statsMuscu();
  if(statsTab==='medals') h+=statsMedals();
  $('#s-stats').innerHTML=h;
}
function statsBilan(){
  let h='<div class="sgrid" style="margin-bottom:14px">'+
    '<div class="sbox"><div class="v">'+totalKm().toFixed(0)+'</div><div class="l">km courus</div></div>'+
    '<div class="sbox"><div class="v">'+(totalTonnage()/1000).toFixed(1)+'t</div><div class="l">Tonnage total</div></div>'+
    '<div class="sbox"><div class="v">'+totalSessions()+'</div><div class="l">Séances</div></div>'+
    '<div class="sbox"><div class="v">'+XP.level+'</div><div class="l">Niveau</div></div></div>';
  // heatmap 13 weeks
  h+='<div class="card"><div class="card-t">🔥 13 dernières semaines</div><div class="heat">'+heatmap13()+'</div><div class="row" style="margin-top:10px;font-size:11px;color:var(--dim)"><span>Moins</span><span>Plus</span></div></div>';
  // week vs target
  const kmW=kmThisWeek(),tg=P.kmWeek||40;
  h+='<div class="card"><div class="card-t">📊 Semaine vs cible</div><div class="row" style="margin-bottom:6px"><span style="font-size:13px">Cette semaine</span><span class="mono" style="color:var(--e)">'+kmW.toFixed(0)+' km</span></div><div class="pbar"><div style="width:'+Math.min(100,kmW/tg*100)+'%"></div></div><div style="font-size:12px;color:var(--muted);margin-top:8px">Cible : '+tg+' km · '+(kmW>=tg?'Objectif atteint ! 🎉':(tg-kmW).toFixed(0)+' km restants')+'</div></div>';
  return h;
}
function heatmap13(){
  const cells=13*7; const start=new Date(); start.setHours(0,0,0,0); start.setDate(start.getDate()-(cells-1));
  const map={}; [...SESS,...MSESS].forEach(s=>{ map[s.date]=(map[s.date]||0)+1; });
  let h='';
  for(let i=0;i<cells;i++){
    const d=new Date(start); d.setDate(start.getDate()+i); const c=map[dateKey(d)]||0;
    const op=c===0?0:Math.min(1,.3+c*.25);
    h+='<div style="background:'+(c?'rgba(61,127,255,'+op+')':'var(--s2)')+'"></div>';
  }
  return h;
}
function statsRun(){
  const vdot=getUserVDOT();
  let h='<div class="sgrid" style="margin-bottom:14px"><div class="sbox"><div class="v">'+(vdot||'—')+'</div><div class="l">VDOT réel</div></div><div class="sbox"><div class="v">'+SESS.length+'</div><div class="l">Séances run</div></div><div class="sbox"><div class="v">'+totalKm().toFixed(0)+'</div><div class="l">km totaux</div></div><div class="sbox"><div class="v">'+(SESS.reduce((a,s)=>a+(s.duration||0),0)/60).toFixed(1)+'h</div><div class="l">Temps total</div></div></div>';
  // zones
  if(vdot){
    const zones=[['EF',.70,'--ok'],['Tempo',.83,'--warn'],['Seuil',.88,'--or'],['VMA',.97,'--bad'],['Sprint',1.05,'--maitre']];
    h+='<div class="card"><div class="card-t">🎯 Zones d\u2019allure</div>';
    zones.forEach(z=>{ h+='<div class="zrow"><span class="zdot" style="background:var('+z[2]+')"></span><span class="zname">'+z[0]+'</span><span class="zval">'+spkToStr(paceFromPct(vdot,z[1]))+' /km</span></div>'; });
    h+='</div>';
    // predictions
    const dists=[['1500m',1500],['3000m',3000],['5000m',5000],['10km',10000],['Semi',21097],['Marathon',42195]];
    h+='<div class="card"><div class="card-t">🔮 Prédictions</div>';
    dists.forEach(d=>{ h+='<div class="zrow"><span class="zname">'+d[0]+'</span><span class="zval mono" style="color:var(--snow)">'+fmtTime(predictTime(vdot,d[1]))+'</span></div>'; });
    h+='</div>';
    // form/fatigue SVG
    h+='<div class="card"><div class="card-t">📈 Forme / Fatigue</div>'+formChart()+'</div>';
  }
  // records
  h+='<div class="card"><div class="card-t">🏅 Records personnels</div>'+
    [['5000m',P.pb5k],['3000m',P.pb3k],['1500m',P.pb1500],['10km',P.pb10k]].map(r=>'<div class="zrow"><span class="zname">'+r[0]+'</span><span class="zval mono" style="color:var(--snow)">'+(r[1]||'—')+'</span></div>').join('')+'</div>';
  return h;
}
function formChart(){
  // CTL (fitness, slow EWMA) vs ATL (fatigue, fast EWMA) over last 42 days using real km load
  const days=42; const arr=[];
  const end=new Date(); end.setHours(0,0,0,0);
  const load={}; SESS.forEach(s=>{ load[s.date]=(load[s.date]||0)+(s.km||0)*(s.rpe||5); });
  MSESS.forEach(s=>{ load[s.date]=(load[s.date]||0)+(s.tonnage||0)/100; });
  let ctl=0,atl=0; const ctlA=[],atlA=[];
  for(let i=days-1;i>=0;i--){ const d=new Date(end); d.setDate(end.getDate()-i); const l=load[dateKey(d)]||0;
    ctl=ctl+(l-ctl)/42; atl=atl+(l-atl)/7; ctlA.push(ctl); atlA.push(atl); }
  const max=Math.max(1,...ctlA,...atlA);
  const W=320,H=120;
  const path=a=>a.map((v,i)=>(i===0?'M':'L')+(i/(days-1)*W).toFixed(1)+' '+(H-v/max*H).toFixed(1)).join(' ');
  return '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:120px"><path d="'+path(ctlA)+'" fill="none" stroke="var(--e)" stroke-width="2.5"/><path d="'+path(atlA)+'" fill="none" stroke="var(--bad)" stroke-width="2" stroke-dasharray="4 3"/></svg>'+
    '<div class="row" style="margin-top:8px;font-size:11px"><span style="color:var(--e)">━ Forme (CTL)</span><span style="color:var(--bad)">┄ Fatigue (ATL)</span></div>';
}
function statsMuscu(){
  const pr=MSESS.reduce((a,s)=>Math.max(a,s.tonnage||0),0);
  let h='<div class="sgrid" style="margin-bottom:14px"><div class="sbox"><div class="v">'+MSESS.length+'</div><div class="l">Séances</div></div><div class="sbox"><div class="v">'+(totalTonnage()/1000).toFixed(1)+'t</div><div class="l">Tonnage</div></div><div class="sbox"><div class="v">'+Math.round(pr)+'</div><div class="l">PR (kg/séance)</div></div><div class="sbox"><div class="v">'+MSESS.reduce((a,s)=>a+(s.sets||0),0)+'</div><div class="l">Séries totales</div></div></div>';
  if(!MSESS.length) h+='<div class="card"><div class="empty"><div class="em-ic">🏋️</div><div style="font-size:13px">Lance ta première séance de muscu !</div></div></div>';
  else h+='<div class="card"><div class="card-t">📅 Dernières séances</div>'+MSESS.slice(-6).reverse().map(s=>'<div class="zrow"><div><div class="zname">'+s.progName+'</div><div style="font-size:11px;color:var(--dim)">'+fmtDate(s.date)+'</div></div><span class="zval mono">'+Math.round(s.tonnage)+' kg</span></div>').join('')+'</div>';
  return h;
}
/* ---------- MEDALS ---------- */
const TIERS=[['Bronze','--bronze'],['Argent','--argent'],['Or','--or'],['Platine','--platine'],['Diamant','--diamant'],['Maître','--maitre'],['Légende','--legende']];
const MEDAL_CATS=[
  {name:'Séances',icon:'🎽',val:()=>totalSessions(),thr:[10,25,50,100,200,350,500]},
  {name:'Régularité',icon:'🔥',val:()=>streakDays(),thr:[3,7,14,30,60,100,180],unit:'j'},
  {name:'Distance',icon:'🛣️',val:()=>totalKm(),thr:[25,50,100,250,500,1000,2000],unit:'km'}
];
function statsMedals(){
  let total=0;
  MEDAL_CATS.forEach(c=>{ const v=c.val(); c.thr.forEach(t=>{ if(v>=t) total++; }); });
  let h='<div class="card" style="text-align:center"><div class="man" style="font-weight:800;font-size:32px;color:var(--or)">'+total+'</div><div class="lab">médailles débloquées / 21</div></div>';
  MEDAL_CATS.forEach(c=>{
    const v=Math.floor(c.val());
    let tierIdx=-1; c.thr.forEach((t,i)=>{ if(v>=t)tierIdx=i; });
    const cur=tierIdx>=0?TIERS[tierIdx]:null;
    const next=tierIdx<6?c.thr[tierIdx+1]:null;
    const prevT=tierIdx>=0?c.thr[tierIdx]:0;
    const pct=next?Math.min(100,((v-prevT)/(next-prevT))*100):100;
    h+='<div class="card"><div class="row"><div class="row" style="gap:10px"><span style="font-size:26px">'+c.icon+'</span><div><div style="font-weight:700">'+c.name+'</div><div class="mono" style="font-size:12px;'+(cur?'color:var('+cur[1]+')':'color:var(--dim)')+'">'+(cur?cur[0]:'Aucun palier')+'</div></div></div><div class="mono" style="font-weight:700">'+v+(c.unit||'')+'</div></div>';
    // pips
    h+='<div class="row" style="gap:4px;margin:12px 0">';
    c.thr.forEach((t,i)=>{ const ok=v>=t; h+='<div style="flex:1;height:6px;border-radius:3px;background:'+(ok?'var('+TIERS[i][1]+')':'var(--s2)')+'"></div>'; });
    h+='</div>';
    if(next) h+='<div class="pbar"><div style="width:'+pct+'%"></div></div><div style="font-size:11px;color:var(--muted);margin-top:6px">Prochain : '+next+(c.unit||'')+' ('+TIERS[tierIdx+1][0]+')</div>';
    else h+='<div style="font-size:11px;color:var(--legende)">🏆 Palier maximal atteint !</div>';
    h+='</div>';
  });
  return h;
}

/* ---------- ICÔNES PREMIUM (SVG line, mode sombre) ---------- */
const ICONS={
  lab:'<path d="M9 3h6M10 3v6l-5 8a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-8V3"/><path d="M8 15h8"/>',
  health:'<path d="M3 12h4l2 5 4-12 2 7h6"/>',
  stopwatch:'<circle cx="12" cy="13" r="8"/><path d="M12 13V9M9 2h6M18 6l1.5-1.5"/>',
  convert:'<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
  note:'<path d="M5 3h11l4 4v14H5zM15 3v5h5"/><path d="M9 12h6M9 16h6"/>',
  lung:'<path d="M12 4v8M8 12c0-2-3-2-4 1s0 6 2 6 2-3 2-5zM16 12c0-2 3-2 4 1s0 6-2 6-2-3-2-5z"/>',
  scale:'<path d="M4 7h16M12 7V4M6 7l-2 7a4 4 0 0 0 8 0l-2-7M18 7l-2 7a4 4 0 0 0 8 0l-2-7" transform="translate(-2 0)"/>',
  water:'<path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>',
  fire:'<path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 2 2 2 0 0-2 0-3 0-4z"/>',
  run:'<circle cx="13" cy="4" r="2"/><path d="M5 21l3-6 4-2-2-5M12 8l4 2 2 4M7 12l-2 3"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M12 13V9"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4-4"/>',
  star:'<path d="M12 3l2.5 6 6.5.5-5 4 1.7 6.5L12 16l-5.7 4 1.7-6.5-5-4 6.5-.5z"/>',
  bell:'<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6zM10 20a2 2 0 0 0 4 0"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/>',
  mosque:'<path d="M4 21V11a8 8 0 0 1 16 0v10M12 3c-1.5 1-1.5 3 0 4M9 21v-4a3 3 0 0 1 6 0v4"/>'
};
function ICN(name,size,color){ const s=size||22; return '<svg viewBox="0 0 24 24" width="'+s+'" height="'+s+'" fill="none" stroke="'+(color||'currentColor')+'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+(ICONS[name]||'')+'</svg>'; }

/* ---------- OUTILS — HUB ÉPURÉ ---------- */
let outilsTab='home';
const TOOLS={
  aio:{name:'Performance Lab',sub:'Distance · Temps · Allure · Vitesse',icon:ICN('lab'),fn:'renderAIO'},
  sante:{name:'Tableau de bord Santé',sub:'Poids, IMC, sommeil, nutrition...',icon:ICN('health'),fn:'renderSanteTool'},
  chrono:{name:'Chronomètre',sub:'Tours, splits & statistiques',icon:ICN('stopwatch'),fn:'renderChrono'},
  convert:{name:'Convertisseur',sub:'Allure, distance, poids...',icon:ICN('convert'),fn:'renderConvertTool'},
  notes:{name:'Notes',sub:'Bloc-notes rapide',icon:ICN('note'),fn:'renderNotesTool'},
  // accessibles via recherche
  vdot:{name:'VDOT & VO₂max',sub:'Estimer ta cylindrée',icon:ICN('lung'),fn:'renderVDOTtool'},
  imc:{name:'IMC',sub:'Indice de masse corporelle',icon:ICN('scale'),fn:'renderIMC'},
  hydra:{name:'Hydratation',sub:'Tes besoins en eau',icon:ICN('water'),fn:'renderHydraTool'},
  bmr:{name:'Calories & Métabolisme',sub:'Besoins quotidiens',icon:ICN('fire'),fn:'renderBMRtool'},
  agenda:{name:'Agenda',sub:'Tous vos événements',icon:ICN('calendar'),fn:'renderAgenda',hidden:true},
  priere:{name:'Prières',sub:'Tous les horaires',icon:ICN('mosque'),fn:'renderPriere',hidden:true}
};
const MAIN_TOOLS=['aio','sante','chrono'];
const OTHER_TOOLS=['convert','notes'];
function toolFav(){ return PREFS.favTools||['aio','sante','chrono','convert']; }
function toggleFav(k){ let f=toolFav(); f=f.includes(k)?f.filter(x=>x!==k):[...f,k]; PREFS.favTools=f; saveAll(); renderOutils(); }
let toolSearch='';
function recentTools(){ return PREFS.recentTools||[]; }
function pushRecent(k){ let r=recentTools().filter(x=>x!==k); r.unshift(k); PREFS.recentTools=r.slice(0,4); saveAll(); }
function openTool(k){ pushRecent(k); outilsTab=k; renderOutils(); }
function renderOutils(){
  let h='';
  if(outilsTab==='home'){ h=outilsHome(); $('#s-outils').innerHTML=h; bindToolSearch(); return; }
  if(outilsTab==='_timer'){ renderOutilsTimer(); return; }
  const t=TOOLS[outilsTab]; if(!t){ outilsTab='home'; return renderOutils(); }
  h='<div class="row" style="margin-bottom:14px"><button class="x" onclick="outilsBack()">‹</button><div class="man" style="font-weight:800;font-size:17px;flex:1;text-align:center;margin:0 8px">'+t.name+'</div><button class="x" onclick="toggleFav(\''+outilsTab+'\')" style="color:'+(toolFav().includes(outilsTab)?'var(--or)':'var(--dim)')+'">★</button></div><div id="outBody"></div>';
  $('#s-outils').innerHTML=h;
  window[t.fn] && window[t.fn]();
}
let outilsFrom='home';
function outilsBack(){ outilsTab=outilsFrom||'home'; outilsFrom='home'; renderOutils(); }
function openTool(k){ pushRecent(k); outilsFrom=outilsTab; outilsTab=k; renderOutils(); $('#scroll').scrollTop=0; }
function bindToolSearch(){ const si=$('#toolSearchInp'); if(si){ si.oninput=()=>{ toolSearch=si.value; $('#s-outils').innerHTML=outilsHome(); bindToolSearch(); const el=$('#toolSearchInp'); el.focus(); el.setSelectionRange(toolSearch.length,toolSearch.length); }; } }
// VDOT badge réutilisable
function vdotBadge(){ const v=getUserVDOT()||'—'; return '<div onclick="openTool(\'vdot\')" style="width:54px;height:54px;border-radius:50%;border:2px solid var(--e);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;background:var(--ed)"><div class="mono" style="font-weight:800;font-size:15px;color:var(--e);line-height:1">'+v+'</div><div style="font-size:7px;color:var(--muted);letter-spacing:.5px">VDOT</div></div>'; }
function outilsHome(){
  let h='<div class="row" style="margin:2px 0 14px"><div class="man" style="font-weight:800;font-size:24px;letter-spacing:-.5px">Outils</div>'+vdotBadge()+'</div>';
  // Raccourcis rapides Chrono + Minuteur
  h+='<div style="display:flex;gap:10px;margin-bottom:16px"><div class="card" style="flex:1;padding:14px;margin:0;cursor:pointer;text-align:center" onclick="openTool(\'chrono\')"><div style="color:var(--e);display:flex;justify-content:center">'+ICN('stopwatch',26)+'</div><div style="font-weight:700;font-size:13px;margin-top:6px">Chronomètre</div></div><div class="card" style="flex:1;padding:14px;margin:0;cursor:pointer;text-align:center" onclick="openQuickTimer()"><div style="color:var(--warn);display:flex;justify-content:center">'+ICN('timer',26)+'</div><div style="font-weight:700;font-size:13px;margin-top:6px">Minuteur</div></div></div>';
  h+='<div class="searchbox"><span class="searchic">'+ICN('search',18,'var(--muted)')+'</span><input class="inp" id="toolSearchInp" style="padding-left:42px" placeholder="Rechercher un outil..." value="'+toolSearch+'"></div>';
  const q=toolSearch.toLowerCase().trim();
  if(q){
    const res=Object.entries(TOOLS).filter(([k,t])=>t.name.toLowerCase().includes(q));
    h+='<div class="lab" style="margin:14px 0 10px">'+res.length+' résultat(s)</div>';
    res.forEach(([k,t])=>{ h+=toolRow(k,t); });
    return h;
  }
  // FAVORIS
  const favs=toolFav().filter(k=>TOOLS[k]);
  h+='<div class="row" style="margin:18px 0 10px"><span class="lab">Favoris</span><span style="font-size:12px;color:var(--e);cursor:pointer" onclick="editFavs()">Modifier</span></div>';
  h+='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:22px">';
  favs.slice(0,8).forEach(k=>{ const t=TOOLS[k]; h+='<div class="favtile" onclick="openTool(\''+k+'\')"><div style="color:var(--e);display:flex;justify-content:center">'+t.icon+'</div><div class="favlab">'+favShort(t.name)+'</div></div>'; });
  h+='</div>';
  // OUTILS PRINCIPAUX
  h+='<div class="lab" style="margin:0 0 12px">Outils principaux</div>';
  MAIN_TOOLS.forEach(k=>{ const t=TOOLS[k];
    h+='<div class="card" style="padding:15px;margin-bottom:10px;cursor:pointer" onclick="openTool(\''+k+'\')"><div class="row"><div class="row" style="gap:14px"><div style="width:46px;height:46px;border-radius:13px;background:var(--ed);color:var(--e);display:flex;align-items:center;justify-content:center">'+t.icon+'</div><div style="flex:1"><div style="font-weight:700;font-size:15px">'+t.name+'</div><div style="font-size:12px;color:var(--muted);margin-top:2px">'+t.sub+'</div></div></div><span style="color:var(--dim);font-size:20px">›</span></div></div>';
  });
  // AUTRES OUTILS
  h+='<div class="lab" style="margin:18px 0 12px">Autres outils</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:9px">';
  OTHER_TOOLS.forEach(k=>{ const t=TOOLS[k]; h+='<div class="favtile" style="padding:12px 4px" onclick="openTool(\''+k+'\')"><div style="color:var(--e);display:flex;justify-content:center">'+t.icon+'</div><div class="favlab">'+favShort(t.name)+'</div></div>'; });
  h+='</div>';
  return h;
}
function favShort(n){ const m={'Performance Lab':'Perf. Lab','Tableau de bord Santé':'Santé','Chronomètre':'Chrono','Convertisseur':'Convert.','VDOT & VO₂max':'VDOT','Calories & Métabolisme':'Calories','Hydratation':'Eau'}; return m[n]||n; }
function editFavs(){
  let h='<div class="tip" style="margin-bottom:14px">Touche une étoile pour ajouter/retirer un outil de tes favoris.</div>';
  Object.entries(TOOLS).forEach(([k,t])=>{ h+=toolRow(k,t); });
  $('#settingsBody').innerHTML=h; $('#ovSettings').querySelector('h2').textContent='Modifier les favoris'; openOv('ovSettings');
}
function toolRow(k,t){ const fav=toolFav().includes(k);
  return '<div class="card" style="padding:13px;margin-bottom:8px"><div class="row"><div class="row" style="gap:13px;flex:1;cursor:pointer" onclick="openTool(\''+k+'\')"><div style="width:40px;height:40px;border-radius:11px;background:var(--s2);color:var(--e);display:flex;align-items:center;justify-content:center">'+t.icon+'</div><div><div style="font-weight:700;font-size:14px">'+t.name+'</div>'+(t.sub?'<div style="font-size:11px;color:var(--muted);margin-top:2px">'+t.sub+'</div>':'')+'</div></div><span onclick="event.stopPropagation();toggleFav(\''+k+'\')" style="color:'+(fav?'var(--or)':'var(--dim)')+';font-size:18px;cursor:pointer;padding:4px">★</span></div></div>'; }
function openQuickTimer(){ outilsFrom='home'; outilsTab='_timer'; renderOutilsTimer(); }
function renderOutilsTimer(){ $('#s-outils').innerHTML='<div class="row" style="margin-bottom:14px"><button class="x" onclick="outilsTab=\'home\';renderOutils()">‹</button><div class="man" style="font-weight:800;font-size:17px;flex:1;text-align:center">Minuteur</div><div style="width:34px"></div></div><div id="outBody"></div>'; renderTimer(); }

/* ============ TABLEAU DE BORD SANTÉ ============ */
function renderSanteTool(){
  const w=P.weight||62, ht=P.height||175;
  const imc=w/Math.pow(ht/100,2);
  let imcCat,imcCol; if(imc<18.5){imcCat='Maigreur';imcCol='--warn';}else if(imc<25){imcCat='Normal';imcCol='--ok';}else if(imc<30){imcCat='Surpoids';imcCol='--warn';}else{imcCat='Obésité';imcCol='--bad';}
  // dernier log santé / sommeil depuis SESSLOG (debriefs)
  const lastLog=SESSLOG[SESSLOG.length-1]||{};
  const bmr=Math.round((P.sex==='Femme')?(10*w+6.25*ht-5*(age()||25)-161):(10*w+6.25*ht-5*(age()||25)+5));
  const burned=SESS.slice(-7).reduce((a,s)=>a+(s.km||0)*0.9*w/1000*1000,0); // approx kcal 7j run
  const freq=runCountWeek()+muscuCountWeek();
  let h='';
  // POIDS
  const last=WEIGHTLOG[WEIGHTLOG.length-1], prev=WEIGHTLOG[WEIGHTLOG.length-2];
  const trend=last&&prev?(last.w-prev.w):0;
  h+='<div class="card"><div class="row"><div class="card-t" style="margin:0">⚖️ Poids</div><span style="font-size:12px;color:var(--e);cursor:pointer" onclick="addWeight()">＋ Ajouter</span></div>';
  h+='<div class="row" style="align-items:flex-end;margin-top:8px"><div class="man" style="font-size:36px;font-weight:800">'+(last?last.w:w)+'<span style="font-size:16px;color:var(--muted)"> kg</span></div>'+(trend?'<span class="mono" style="margin-left:10px;color:'+(trend<0?'var(--ok)':'var(--warn)')+'">'+(trend>0?'▲ +':'▼ ')+trend.toFixed(1)+' kg</span>':'')+'</div>';
  if(WEIGHTLOG.length>=2) h+='<div style="margin-top:12px">'+weightSparkline()+'</div>';
  h+='</div>';
  // IMC
  h+='<div class="card"><div class="row"><div><div class="card-t" style="margin:0">📐 IMC</div><div class="man" style="font-size:28px;font-weight:800;margin-top:6px;color:var('+imcCol+')">'+imc.toFixed(1)+'</div></div><div class="badge" style="background:var(--ed);color:var('+imcCol+')">'+imcCat+'</div></div>'+
    '<div class="pbar" style="margin-top:12px"><div style="width:'+Math.min(100,(imc/40)*100)+'%;background:var('+imcCol+')"></div></div></div>';
  // INDICATEURS — grille
  h+='<div class="sgrid" style="margin-bottom:14px">';
  h+='<div class="sbox"><div class="v" style="color:var(--e)">'+freq+'</div><div class="l">Séances / sem</div></div>';
  h+='<div class="sbox"><div class="v" style="color:var(--or)">'+bmr+'</div><div class="l">Métabolisme kcal</div></div>';
  h+='<div class="sbox"><div class="v" style="color:var(--bad)">'+Math.round(burned)+'</div><div class="l">Brûlées 7j (run)</div></div>';
  h+='<div class="sbox"><div class="v" style="color:var(--platine)">'+Math.round(w*35/100)/10+'L</div><div class="l">Eau / jour</div></div>';
  h+='</div>';
  // SOMMEIL / FATIGUE / RÉCUP (depuis derniers debriefs)
  const recent=SESSLOG.slice(-7);
  if(recent.length){
    const avg=(f)=>recent.reduce((a,x)=>a+(x[f]||0),0)/recent.length;
    const sleep=avg('sleep'),fatigue=avg('fatigue'),feel=avg('feel');
    h+='<div class="card"><div class="card-t">😴 Forme récente (7 dernières séances)</div>';
    h+=santeBar('Sommeil',sleep,5,'--platine');
    h+=santeBar('Énergie / sensations',feel,5,'--ok');
    h+=santeBar('Fatigue',fatigue,5,'--warn');
    // conseil intelligent
    let tip='Tout est équilibré, continue ainsi ! 💪';
    if(fatigue>=4) tip='⚠️ Fatigue élevée : privilégie le repos et le sommeil cette semaine.';
    else if(sleep<=2.5) tip='😴 Ton sommeil est insuffisant : vise 8h pour mieux récupérer.';
    else if(feel>=4) tip='🔥 Excellentes sensations : tu peux pousser un peu plus !';
    h+='<div class="tip" style="margin-top:12px">'+tip+'</div></div>';
  } else {
    h+='<div class="card"><div class="empty"><div class="em-ic">📋</div><div style="font-size:13px">Termine des séances avec leur bilan pour suivre ton sommeil, ta fatigue et ta récupération ici.</div></div></div>';
  }
  // NUTRITION (rappel macros indicatifs)
  const prot=Math.round(w*1.8), carbs=Math.round(w*5), lip=Math.round(w*1);
  h+='<div class="card"><div class="card-t">🍽️ Repères nutrition (athlète)</div>';
  h+='<div class="sgrid"><div class="sbox"><div class="v" style="font-size:18px;color:var(--ok)">'+prot+'g</div><div class="l">Protéines</div></div><div class="sbox"><div class="v" style="font-size:18px;color:var(--or)">'+carbs+'g</div><div class="l">Glucides</div></div><div class="sbox"><div class="v" style="font-size:18px;color:var(--warn)">'+lip+'g</div><div class="l">Lipides</div></div><div class="sbox"><div class="v" style="font-size:18px">'+Math.round(prot*4+carbs*4+lip*9)+'</div><div class="l">kcal cible</div></div></div></div>';
  $('#outBody').innerHTML=h;
}
function santeBar(label,val,max,col){ const pct=Math.min(100,val/max*100); const ic=['😣','😕','😐','🙂','🤩'][Math.max(0,Math.min(4,Math.round(val)-1))]||'—';
  return '<div style="margin-bottom:10px"><div class="row" style="margin-bottom:4px"><span style="font-size:13px">'+label+'</span><span style="font-size:13px">'+(val?ic+' '+val.toFixed(1)+'/'+max:'—')+'</span></div><div class="pbar"><div style="width:'+pct+'%;background:var('+col+')"></div></div></div>'; }
function weightSparkline(){
  const data=WEIGHTLOG.slice(-14).map(x=>x.w); if(data.length<2)return'';
  const min=Math.min(...data),max=Math.max(...data),rng=(max-min)||1; const W=300,H=60;
  const pts=data.map((v,i)=>(i/(data.length-1)*W).toFixed(1)+','+(H-(v-min)/rng*H).toFixed(1)).join(' ');
  return '<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:60px"><polyline points="'+pts+'" fill="none" stroke="var(--e)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function addWeight(){ const cur=P.weight||62; const whole=Math.floor(cur),dec=Math.round((cur-whole)*10);
  openPicker({title:'Ton poids (kg)',cols:[{values:range(30,200),sel:Math.max(0,whole-30)},{values:range(0,9),sel:dec,unit:'kg'}],seps:['.'],onOk:idx=>{ const w=(idx[0]+30)+idx[1]/10; WEIGHTLOG.push({date:todayKey(),w}); P.weight=w; saveAll(); renderSanteTool(); toast('Poids enregistré ✓'); }}); }

/* ============ PERFORMANCE LAB — calculateur intelligent ============ */
/* 4 valeurs : distance (km), time (s), pace (s/km), speed (km/h).
   L'utilisateur saisit 2 valeurs → les 2 autres se calculent.
   On mémorise l'ordre des saisies (recent[]) pour savoir lesquelles fixer. */
let LAB={dist:null,time:null,pace:null,speed:null,recent:[]};
let labTab='resultats';
function labSet(field,val){
  LAB[field]=val;
  LAB.recent=[field,...LAB.recent.filter(f=>f!==field)].slice(0,2);
  computeLab();
  renderAIO();
}
function computeLab(){
  const r=LAB.recent;
  if(r.length<2) return;
  const has=f=>LAB[f]!=null&&!isNaN(LAB[f])&&LAB[f]>0;
  const [a,b]=r;
  const set2=new Set([a,b]);
  // pace <-> speed sont liés : si l'un est saisi, dérive l'autre
  if(has('pace')&&!set2.has('speed')) LAB.speed=3600/LAB.pace;
  if(has('speed')&&!set2.has('pace')) LAB.pace=3600/LAB.speed;
  // Résoudre selon les 2 connus
  if(set2.has('dist')&&set2.has('time')&&has('dist')&&has('time')){ LAB.pace=LAB.time/LAB.dist; LAB.speed=3600/LAB.pace; }
  else if(set2.has('dist')&&set2.has('pace')&&has('dist')&&has('pace')){ LAB.time=LAB.pace*LAB.dist; LAB.speed=3600/LAB.pace; }
  else if(set2.has('dist')&&set2.has('speed')&&has('dist')&&has('speed')){ LAB.pace=3600/LAB.speed; LAB.time=LAB.pace*LAB.dist; }
  else if(set2.has('time')&&set2.has('pace')&&has('time')&&has('pace')){ LAB.dist=LAB.time/LAB.pace; LAB.speed=3600/LAB.pace; }
  else if(set2.has('time')&&set2.has('speed')&&has('time')&&has('speed')){ LAB.pace=3600/LAB.speed; LAB.dist=LAB.time/LAB.pace; }
}
function renderAIO(){
  const computed=f=>LAB.recent.length>=2 && !LAB.recent.includes(f) && LAB[f]!=null;
  let h='<div class="tip" style="margin-bottom:16px">Saisis <b>2 valeurs</b> que tu connais. Les 2 autres se calculent automatiquement. ✨</div>';
  h+=labField('Distance','📍','dist',LAB.dist!=null?LAB.dist.toFixed(2)+' km':'—',computed('dist'));
  h+=labField('Temps','⏱️','time',LAB.time!=null?fmtTime(LAB.time):'—',computed('time'));
  h+=labField('Allure','🏃','pace',LAB.pace!=null?spkToStr(LAB.pace)+' /km':'—',computed('pace'));
  h+=labField('Vitesse','⚡','speed',LAB.speed!=null?LAB.speed.toFixed(2)+' km/h':'—',computed('speed'));
  h+='<button class="btn ghost" style="margin-top:10px" onclick="resetLab()">↺ Réinitialiser</button>';
  // Bonus : splits + prédictions si distance & pace connus
  if(LAB.dist&&LAB.pace&&LAB.dist>=1){
    h+='<div class="card-t" style="margin-top:20px">📍 Temps de passage</div>';
    const n=Math.min(Math.floor(LAB.dist),42);
    for(let k=1;k<=n;k++){ const hi=[5,10,21,42].includes(k); h+='<div class="zrow" style="padding:9px 0"><span class="zname" style="'+(hi?'color:var(--e)':'')+'">km '+k+(hi?' ⭐':'')+'</span><span class="zval mono">'+fmtTime(LAB.pace*k)+'</span></div>'; }
    if(LAB.dist%1>0.01) h+='<div class="zrow" style="padding:9px 0"><span class="zname">'+LAB.dist.toFixed(2)+' km</span><span class="zval mono">'+fmtTime(LAB.time)+'</span></div>';
  }
  $('#outBody').innerHTML=h;
}
function labField(label,icon,field,val,isComputed){
  const filled=LAB[field]!=null;
  return '<div class="card" style="padding:14px;margin-bottom:9px;cursor:pointer;'+(isComputed?'border-color:var(--e);background:var(--ed)':'')+'" onclick="editLab(\''+field+'\')"><div class="row"><div class="row" style="gap:11px"><span style="font-size:19px">'+icon+'</span><div><div style="font-size:11px;color:var(--muted)">'+label+(isComputed?' · calculé':filled?'':' · à saisir')+'</div><div class="mono" style="font-weight:700;font-size:19px;margin-top:2px;color:'+(isComputed?'var(--e)':'var(--snow)')+'">'+val+'</div></div></div><span style="color:var(--dim);font-size:15px">'+(isComputed?'':'✎')+'</span></div></div>';
}
function editLab(field){
  if(field==='dist') pickDistance('Distance',LAB.dist||10,v=>labSet('dist',v));
  else if(field==='time') pickTime('Temps',LAB.time||1800,v=>labSet('time',v));
  else if(field==='pace') pickPace('Allure',LAB.pace||270,v=>labSet('pace',v));
  else if(field==='speed') pickSpeed('Vitesse',LAB.speed||12,v=>labSet('speed',v));
}
function resetLab(){ LAB={dist:null,time:null,pace:null,speed:null,recent:[]}; renderAIO(); }

/* ----- Nouveaux outils ----- */
function renderVDOTtool(){
  const vdot=getUserVDOT();
  let h='<div class="card" style="text-align:center"><div class="man" style="font-size:48px;font-weight:800;color:var(--e)">'+(vdot||'—')+'</div><div class="lab">VDOT (Jack Daniels)</div></div>';
  if(vdot){ const vo2=(vdot).toFixed(1);
    h+='<div class="card"><div class="card-t">Estimations physiologiques</div>'+
      '<div class="zrow"><span class="zname">VO₂max estimé</span><span class="zval mono">'+vo2+' ml/kg/min</span></div>'+
      '<div class="zrow"><span class="zname">Allure seuil lactique</span><span class="zval mono">'+spkToStr(paceFromPct(vdot,.88))+'/km</span></div>'+
      '<div class="zrow"><span class="zname">Allure marathon</span><span class="zval mono">'+spkToStr(paceFromPct(vdot,.80))+'/km</span></div>'+
      '<div class="zrow"><span class="zname">Allure semi</span><span class="zval mono">'+spkToStr(paceFromPct(vdot,.835))+'/km</span></div>'+
      '<div class="zrow"><span class="zname">Allure EF</span><span class="zval mono">'+spkToStr(paceFromPct(vdot,.70))+'/km</span></div></div>';
  }
  h+='<div class="tip">ℹ️ Ton VDOT se met à jour automatiquement depuis tes records. Ajoute tes chronos dans Profil → Records.</div>';
  $('#outBody').innerHTML=h;
}
let rmW=80,rmR=5;
function renderRMtool(){
  const rm=Math.round(rmW*(1+rmR/30)); // Epley
  let h='<div class="card"><div class="field"><label>Charge soulevée (kg)</label><div class="stepper"><button onclick="rmW=Math.max(0,rmW-2.5);renderRMtool()">−</button><span class="val">'+rmW+'</span><button onclick="rmW+=2.5;renderRMtool()">+</button></div></div>';
  h+='<div class="field"><label>Répétitions</label><div class="stepper"><button onclick="rmR=Math.max(1,rmR-1);renderRMtool()">−</button><span class="val">'+rmR+'</span><button onclick="rmR++;renderRMtool()">+</button></div></div></div>';
  h+='<div class="card" style="text-align:center"><div class="man" style="font-size:42px;font-weight:800;color:var(--e)">'+rm+' kg</div><div class="lab">1RM estimé (Epley)</div></div>';
  h+='<div class="card"><div class="card-t">% de ton 1RM</div>'+[[95,2],[90,4],[85,6],[80,8],[75,10],[70,12],[60,15]].map(x=>'<div class="zrow"><span class="zname">'+x[0]+'% · ~'+x[1]+' reps</span><span class="zval mono">'+Math.round(rm*x[0]/100)+' kg</span></div>').join('')+'</div>';
  $('#outBody').innerHTML=h;
}
let tonW=60,tonS=4,tonR=10;
function renderTonnageTool(){
  const ton=tonW*tonS*tonR;
  let h='<div class="card"><div class="field"><label>Charge (kg)</label><div class="stepper"><button onclick="tonW=Math.max(0,tonW-2.5);renderTonnageTool()">−</button><span class="val">'+tonW+'</span><button onclick="tonW+=2.5;renderTonnageTool()">+</button></div></div><div class="field"><label>Séries</label><div class="stepper"><button onclick="tonS=Math.max(1,tonS-1);renderTonnageTool()">−</button><span class="val">'+tonS+'</span><button onclick="tonS++;renderTonnageTool()">+</button></div></div><div class="field"><label>Reps</label><div class="stepper"><button onclick="tonR=Math.max(1,tonR-1);renderTonnageTool()">−</button><span class="val">'+tonR+'</span><button onclick="tonR++;renderTonnageTool()">+</button></div></div></div>';
  h+='<div class="card" style="text-align:center"><div class="man" style="font-size:42px;font-weight:800;color:var(--e)">'+ton+' kg</div><div class="lab">Tonnage total ('+tonS+'×'+tonR+'×'+tonW+'kg)</div></div>';
  $('#outBody').innerHTML=h;
}
function renderLoadTool(){
  // ACWR (acute:chronic workload ratio) sur charge km*rpe
  const load={}; SESS.forEach(s=>{load[s.date]=(load[s.date]||0)+(s.km||0)*(s.rpe||5);});
  const end=new Date(); end.setHours(0,0,0,0);
  let acute=0,chronic=0;
  for(let i=0;i<28;i++){ const d=new Date(end);d.setDate(end.getDate()-i); const l=load[dateKey(d)]||0; chronic+=l; if(i<7)acute+=l; }
  acute/=7; chronic/=28;
  const ratio=chronic>0?(acute/chronic):0;
  let status,col; if(ratio===0){status='Pas de données';col='--dim';} else if(ratio<0.8){status='Sous-charge';col='--platine';} else if(ratio<=1.3){status='Optimal ✓';col='--ok';} else if(ratio<=1.5){status='Élevé ⚠️';col='--warn';} else {status='Risque blessure 🚨';col='--bad';}
  let h='<div class="card" style="text-align:center"><div class="man" style="font-size:42px;font-weight:800;color:var('+col+')">'+ratio.toFixed(2)+'</div><div class="lab">Ratio Aigu/Chronique (ACWR)</div><div class="badge" style="margin-top:10px;background:var(--ed);color:var('+col+')">'+status+'</div></div>';
  h+='<div class="sgrid"><div class="sbox"><div class="v">'+Math.round(acute)+'</div><div class="l">Charge aiguë (7j)</div></div><div class="sbox"><div class="v">'+Math.round(chronic)+'</div><div class="l">Charge chronique (28j)</div></div></div>';
  h+='<div class="tip" style="margin-top:12px">💡 Zone optimale : 0,8–1,3. Au-dessus de 1,5, le risque de blessure augmente fortement.</div>';
  $('#outBody').innerHTML=h;
}
let calKm=10,calMin=50;
function renderCaloriesTool(){
  const w=P.weight||62; const cal=Math.round(0.9*w*calKm);
  let h='<div class="card"><div class="field"><label>Distance (km)</label><div class="stepper"><button onclick="calKm=Math.max(1,calKm-1);renderCaloriesTool()">−</button><span class="val">'+calKm+'</span><button onclick="calKm++;renderCaloriesTool()">+</button></div></div></div>';
  h+='<div class="card" style="text-align:center"><div class="man" style="font-size:42px;font-weight:800;color:var(--e)">'+cal+'</div><div class="lab">kcal brûlées (~'+w+'kg)</div></div>';
  $('#outBody').innerHTML=h;
}
function renderHydraTool(){
  const w=P.weight||62; const daily=Math.round(w*35); const perH=Math.round(0.5*1000);
  let h='<div class="card"><div class="card-t">💧 Besoins en eau</div><div class="zrow"><span class="zname">Quotidien (repos)</span><span class="zval mono">'+(daily/1000).toFixed(1)+' L</span></div><div class="zrow"><span class="zname">Par heure de course</span><span class="zval mono">0,4–0,8 L</span></div><div class="zrow"><span class="zname">Par forte chaleur (+/h)</span><span class="zval mono">+0,3 L</span></div></div><div class="tip">💡 Bois régulièrement par petites gorgées. Surveille la couleur de ton urine.</div>';
  $('#outBody').innerHTML=h;
}
let bmrSex=P.sex||'Homme';
function renderBMRtool(){
  const w=P.weight||62,ht=P.height||175,a=age()||25;
  const bmr=Math.round(bmrSex==='Femme'?(10*w+6.25*ht-5*a-161):(10*w+6.25*ht-5*a+5));
  let h='<div class="card" style="text-align:center"><div class="man" style="font-size:40px;font-weight:800;color:var(--e)">'+bmr+'</div><div class="lab">Métabolisme basal (kcal/j)</div></div>';
  h+='<div class="card"><div class="card-t">Besoins selon activité</div>'+[['Sédentaire',1.2],['Léger',1.375],['Modéré',1.55],['Intense',1.725],['Athlète',1.9]].map(x=>'<div class="zrow"><span class="zname">'+x[0]+'</span><span class="zval mono">'+Math.round(bmr*x[1])+' kcal</span></div>').join('')+'</div>';
  $('#outBody').innerHTML=h;
}
let cvVal=10,cvFrom='km',cvTo='miles';
function renderConvertTool(){
  const conv={km:1,miles:0.621371,m:1000,'min/km':1};
  let res;
  if(cvFrom==='km'&&cvTo==='miles') res=(cvVal*0.621371).toFixed(2)+' miles';
  else if(cvFrom==='miles'&&cvTo==='km') res=(cvVal/0.621371).toFixed(2)+' km';
  else res=cvVal;
  let h='<div class="card"><div class="field"><label>Valeur</label><input class="inp" type="number" value="'+cvVal+'" oninput="cvVal=+this.value;renderConvertTool()"></div>';
  h+='<div class="row" style="gap:10px"><div class="field" style="flex:1"><label>De</label><select class="inp" onchange="cvFrom=this.value;renderConvertTool()"><option '+(cvFrom==='km'?'selected':'')+'>km</option><option '+(cvFrom==='miles'?'selected':'')+'>miles</option></select></div><div class="field" style="flex:1"><label>Vers</label><select class="inp" onchange="cvTo=this.value;renderConvertTool()"><option '+(cvTo==='km'?'selected':'')+'>km</option><option '+(cvTo==='miles'?'selected':'')+'>miles</option></select></div></div></div>';
  h+='<div class="card" style="text-align:center"><div class="man" style="font-size:32px;font-weight:800;color:var(--e)">'+res+'</div></div>';
  $('#outBody').innerHTML=h;
}
let pgW=60,pgInc=2.5,pgWk=8;
function renderProgTool(){
  let h='<div class="card"><div class="field"><label>Charge actuelle (kg)</label><div class="stepper"><button onclick="pgW=Math.max(0,pgW-2.5);renderProgTool()">−</button><span class="val">'+pgW+'</span><button onclick="pgW+=2.5;renderProgTool()">+</button></div></div><div class="field"><label>Progression / semaine (kg)</label><div class="pills">'+[1.25,2.5,5].map(x=>'<div class="pill '+(pgInc===x?'on':'')+'" onclick="pgInc='+x+';renderProgTool()">+'+x+'</div>').join('')+'</div></div><div class="field"><label>Semaines</label><div class="stepper"><button onclick="pgWk=Math.max(1,pgWk-1);renderProgTool()">−</button><span class="val">'+pgWk+'</span><button onclick="pgWk++;renderProgTool()">+</button></div></div></div>';
  h+='<div class="card"><div class="card-t">Projection</div>';
  for(let i=1;i<=pgWk;i++){ h+='<div class="zrow"><span class="zname">Semaine '+i+'</span><span class="zval mono">'+(pgW+pgInc*i)+' kg</span></div>'; }
  h+='</div>';
  $('#outBody').innerHTML=h;
}
function renderReposTool(){
  const data=[['Force max (1-5 reps)','3-5 min'],['Hypertrophie (6-12)','60-90 s'],['Endurance (15+)','30-45 s'],['Puissance / explosif','2-3 min'],['Superset','0 s entre, 90 s après']];
  let h='<div class="card"><div class="card-t">⏱️ Temps de repos recommandés</div>'+data.map(d=>'<div class="zrow"><span class="zname">'+d[0]+'</span><span class="zval mono">'+d[1]+'</span></div>').join('')+'</div><div class="tip">💡 Plus la charge est lourde, plus le repos doit être long pour récupérer le système nerveux.</div>';
  $('#outBody').innerHTML=h;
}
let pomoState={phase:'work',left:25*60,running:false,iv:null,count:0};
function renderPomodoro(){
  const total=pomoState.phase==='work'?25*60:(pomoState.phase==='long'?15*60:5*60);
  const pct=pomoState.left/total*100;
  const col=pomoState.phase==='work'?'var(--bad)':'var(--ok)';
  const lab=pomoState.phase==='work'?'🍅 Focus':'☕ Pause';
  let h='<div class="card" style="text-align:center"><div class="badge" style="background:var(--ed);color:'+col+'">'+lab+'</div><div class="ring-wrap" style="width:180px;height:180px;margin:14px auto"><span id="pmRing">'+ringSVG(180,pct,12,col)+'</span><div class="ring-c"><div class="big mono" id="pmNum" style="font-size:36px">'+fmtMS(pomoState.left)+'</div></div></div>';
  h+='<div class="row" style="gap:10px"><button class="btn" onclick="pomoToggle()">'+(pomoState.running?'⏸ Pause':'▶ Start')+'</button><button class="btn ghost" onclick="pomoReset()">↺</button></div>';
  h+='<div style="margin-top:12px;font-size:12px;color:var(--muted)">Pomodoros complétés : '+pomoState.count+'</div></div>';
  $('#outBody').innerHTML=h;
}
function pomoToggle(){
  if(pomoState.running){ clearInterval(pomoState.iv); pomoState.running=false; renderPomodoro(); return; }
  pomoState.running=true; renderPomodoro();
  pomoState.iv=setInterval(()=>{
    pomoState.left--;
    const total=pomoState.phase==='work'?25*60:(pomoState.phase==='long'?15*60:5*60);
    const r=$('#pmRing'),n=$('#pmNum'); const col=pomoState.phase==='work'?'var(--bad)':'var(--ok)';
    if(r)r.innerHTML=ringSVG(180,pomoState.left/total*100,12,col); if(n)n.textContent=fmtMS(pomoState.left);
    if(pomoState.left<=0){ clearInterval(pomoState.iv); pomoState.running=false; burst();
      if(pomoState.phase==='work'){ pomoState.count++; pomoState.phase=(pomoState.count%4===0)?'long':'short'; toast('Pause méritée ! ☕'); }
      else { pomoState.phase='work'; toast('Au travail ! 🍅'); }
      pomoState.left=pomoState.phase==='work'?25*60:(pomoState.phase==='long'?15*60:5*60); renderPomodoro(); }
  },1000);
}
function pomoReset(){ clearInterval(pomoState.iv); pomoState={phase:'work',left:25*60,running:false,iv:null,count:pomoState.count}; renderPomodoro(); }
function renderNotesTool(){
  const notes=PREFS.quickNotes||'';
  let h='<div class="card"><div class="card-t">📝 Notes rapides</div><textarea class="inp" rows="12" id="qnotes" placeholder="Écris ici... (sauvegarde automatique)" oninput="PREFS.quickNotes=this.value;saveAll()">'+notes+'</textarea><div style="font-size:11px;color:var(--dim);margin-top:8px">💾 Sauvegarde automatique en local.</div></div>';
  $('#outBody').innerHTML=h;
}
let sleepH=8;
function renderSleepTool(){
  let h='<div class="card"><div class="field"><label>Heures de sommeil / nuit</label><div class="stepper"><button onclick="sleepH=Math.max(3,sleepH-.5);renderSleepTool()">−</button><span class="val">'+sleepH+'</span><button onclick="sleepH=Math.min(12,sleepH+.5);renderSleepTool()">+</button></div></div></div>';
  let status,col; if(sleepH<6){status='Insuffisant — récupération compromise';col='--bad';} else if(sleepH<7){status='Limite — vise plus';col='--warn';} else if(sleepH<=9){status='Optimal pour un athlète ✓';col='--ok';} else {status='Beaucoup — écoute ton corps';col='--platine';}
  h+='<div class="card" style="text-align:center"><div class="man" style="font-size:40px;font-weight:800;color:var('+col+')">'+sleepH+'h</div><div class="badge" style="background:var(--ed);color:var('+col+');margin-top:8px">'+status+'</div></div>';
  h+='<div class="card"><div class="card-t">😴 Cycles de sommeil</div><div class="tip">Un cycle dure ~90 min. Vise un réveil en fin de cycle : 6h, 7h30 ou 9h de sommeil. Couche-toi à heure régulière pour optimiser la récupération.</div></div>';
  $('#outBody').innerHTML=h;
}


/* ---------- CALCULATEUR ALLURE ---------- */
const DISTANCES={'800m':800,'1km':1000,'1500m':1500,'Mile':1609,'3km':3000,'5km':5000,'10km':10000,'15km':15000,'Semi':21097,'Marathon':42195};
let calc={dist:'5km',customKm:5,TH:{h:0,m:18,s:0},TP:{m:3,s:36},lastResult:null,penalty:0,negSplit:false};
function renderCalc(){
  const vdot=getUserVDOT();
  let h='<div class="row" style="margin-bottom:14px"><span class="lab">Calculateur d\u2019allure</span><span class="badge" onclick="nav(\'profil\')">VDOT '+(vdot||'?')+'</span></div>';
  h+='<div class="card"><div class="field"><label>Distance</label><select class="inp" id="calcDist" onchange="calc.dist=this.value;syncFromTime();renderCalc()">'+Object.keys(DISTANCES).concat(['Autre']).map(d=>'<option '+(calc.dist===d?'selected':'')+'>'+d+'</option>').join('')+'</select></div>';
  if(calc.dist==='Autre') h+='<div class="field"><label>Distance custom (km)</label><div class="stepper"><button onclick="calc.customKm=Math.max(.1,calc.customKm-.5);renderCalc()">−</button><span class="val">'+calc.customKm+'</span><button onclick="calc.customKm+=.5;renderCalc()">+</button></div></div>';
  // time wheels
  h+='<div class="field"><label>Temps (h : mm : ss)</label><div class="wheels">'+wheel('TH.h',0,9,calc.TH.h)+'<span class="wheel-sep">:</span>'+wheel('TH.m',0,59,calc.TH.m)+'<span class="wheel-sep">:</span>'+wheel('TH.s',0,59,calc.TH.s)+'</div></div>';
  h+='<div class="field"><label>Allure (min : sec /km)</label><div class="wheels">'+wheel('TP.m',2,12,calc.TP.m)+'<span class="wheel-sep">:</span>'+wheel('TP.s',0,59,calc.TP.s)+'</div></div>';
  // speed
  const spk=calc.TP.m*60+calc.TP.s; const kmh=spk>0?(3600/spk).toFixed(1):'0';
  h+='<div class="sbox" style="text-align:center;margin-bottom:12px"><div class="v" style="color:var(--e)">'+kmh+' km/h</div><div class="l">Vitesse</div></div>';
  h+='<div class="row" style="gap:8px"><button class="btn ghost sm" onclick="resetCalc()">Réinit.</button><button class="btn ghost sm" onclick="calc._adv=!calc._adv;renderCalc()">Avancé</button><button class="btn sm" onclick="doCalc()">Calculer</button></div>';
  if(calc._adv){
    h+='<hr class="hl"><div class="field"><label>Pénalité (sec/km)</label><div class="stepper"><button onclick="calc.penalty-=1;renderCalc()">−</button><span class="val">'+calc.penalty+'</span><button onclick="calc.penalty+=1;renderCalc()">+</button></div></div><div class="chk '+(calc.negSplit?'done':'')+'" onclick="calc.negSplit=!calc.negSplit;renderCalc()"><div class="box"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg></div><div class="txt">Negative split</div></div>';
  }
  h+='</div>';
  h+='<div id="calcResult"></div>';
  $('#outBody').innerHTML=h;
  attachWheels();
  if(calc.lastResult) renderCalcResult();
}
function wheel(key,min,max,sel){
  let h='<div class="wheel" data-key="'+key+'" data-min="'+min+'"><div class="wheel-pad"></div>';
  for(let i=min;i<=max;i++) h+='<div class="wi '+(i===sel?'sel':'')+'">'+String(i).padStart(2,'0')+'</div>';
  h+='<div class="wheel-pad"></div></div>';
  return h;
}
function attachWheels(){
  $$('.wheel').forEach(w=>{
    const key=w.dataset.key, min=+w.dataset.min;
    const sel=w.querySelector('.wi.sel');
    if(sel){ setTimeout(()=>{ w.scrollTop=sel.offsetTop-40; },30); }
    let t;
    w.onscroll=()=>{ clearTimeout(t); t=setTimeout(()=>{
      const idx=Math.round(w.scrollTop/40); const val=min+idx;
      w.querySelectorAll('.wi').forEach((wi,i)=>wi.classList.toggle('sel',i===idx));
      setWheelVal(key,val);
    },120); };
  });
}
function setWheelVal(key,val){
  const[a,b]=key.split('.'); calc[a][b]=val;
  if(a==='TH') syncFromTime(); else syncFromPace();
}
function curDist(){ return calc.dist==='Autre'?calc.customKm*1000:DISTANCES[calc.dist]; }
function syncFromTime(){
  const t=calc.TH.h*3600+calc.TH.m*60+calc.TH.s; const km=curDist()/1000;
  if(km>0&&t>0){ const spk=t/km; calc.TP.m=Math.floor(spk/60); calc.TP.s=Math.round(spk%60); }
}
function syncFromPace(){
  const spk=calc.TP.m*60+calc.TP.s; const km=curDist()/1000; const t=spk*km;
  calc.TH.h=Math.floor(t/3600); calc.TH.m=Math.floor((t%3600)/60); calc.TH.s=Math.round(t%60);
}
function resetCalc(){ calc.TH={h:0,m:18,s:0}; calc.TP={m:3,s:36}; calc.lastResult=null; renderCalc(); }
function doCalc(){
  const dist=curDist(); const spk=calc.TP.m*60+calc.TP.s+calc.penalty;
  calc.lastResult={dist,spk,resDist:5000};
  renderCalc();
}
let resultDist=5000;
function renderCalcResult(){
  const vdot=getUserVDOT();
  let h='<div class="card popin"><div class="card-t">Résultats</div>';
  h+='<div class="pills" style="margin-bottom:14px;overflow-x:auto;flex-wrap:nowrap">'+Object.entries(DISTANCES).map(([k,v])=>'<div class="pill '+(resultDist===v?'on':'')+'" onclick="resultDist='+v+';renderCalc()">'+k+'</div>').join('')+'</div>';
  const t=vdot?predictTime(vdot,resultDist):calc.lastResult.spk*resultDist/1000;
  const spk=t/(resultDist/1000); const kmh=(3600/spk).toFixed(1);
  h+='<div class="sgrid" style="margin-bottom:14px"><div class="sbox"><div class="v" style="font-size:18px">'+fmtTime(t)+'</div><div class="l">Temps prédit</div></div><div class="sbox"><div class="v" style="font-size:18px">'+spkToStr(spk)+'</div><div class="l">Allure /km</div></div><div class="sbox"><div class="v">'+kmh+'</div><div class="l">km/h</div></div><div class="sbox"><div class="v">'+(resultDist/1000)+'</div><div class="l">km</div></div></div>';
  // splits
  h+='<div class="lab" style="margin-bottom:8px">Splits km</div><div style="max-height:180px;overflow-y:auto">';
  const nk=Math.floor(resultDist/1000);
  for(let k=1;k<=nk;k++){ const hi=[5,10,21,42].includes(k); h+='<div class="zrow" style="padding:8px 0"><span class="zname" style="'+(hi?'color:var(--e)':'')+'">km '+k+(hi?' ⭐':'')+'</span><span class="zval mono">'+fmtTime(spk*k)+'</span></div>'; }
  h+='</div>';
  // actions
  h+='<div class="row" style="gap:8px;margin-top:14px"><button class="btn ghost sm" onclick="saveCalcResult()">💾</button><button class="btn ghost sm" onclick="copyCalc()">Copier</button><button class="btn ghost sm" onclick="shareCalc()">↗</button></div>';
  h+='<button class="btn sm" style="margin-top:8px" onclick="calcAsGoal()">🎯 Ajouter comme objectif</button></div>';
  $('#calcResult').innerHTML=h;
}
function saveCalcResult(){
  if(!calc.lastResult){ toast(`Lance un calcul d'abord`); return; }
  toast('Résultat enregistré ✓');
}
function copyCalc(){
  if(!calc.lastResult){ toast(`Lance un calcul d'abord`); return; }
  const t=predictTime(getUserVDOT(),resultDist);
  navigator.clipboard&&navigator.clipboard.writeText('VVV — '+(resultDist/1000)+'km en '+fmtTime(t));
  toast('Copié ✓');
}
function shareCalc(){
  const t=predictTime(getUserVDOT(),resultDist);
  const txt='Ma prédiction VVV : '+(resultDist/1000)+'km en '+fmtTime(t);
  if(navigator.share) navigator.share({title:'VVV',text:txt}); else toast('Partage non supporté');
}
function calcAsGoal(){ addXP(10,'objectif ajouté'); toast('Objectif ajouté ✓'); }

/* ---------- FC KARVONEN ---------- */
let fc={max:P.hrMax||190,rest:P.hrRest||60};
function renderFC(){
  let h='<div class="card"><div class="field"><label>FC max (bpm)</label><div class="stepper"><button onclick="fc.max--;renderFC()">−</button><span class="val">'+fc.max+'</span><button onclick="fc.max++;renderFC()">+</button></div></div>';
  h+='<div class="field"><label>FC repos (bpm)</label><div class="stepper"><button onclick="fc.rest--;renderFC()">−</button><span class="val">'+fc.rest+'</span><button onclick="fc.rest++;renderFC()">+</button></div></div></div>';
  const zones=[['Z1 Récupération',.5,.6,'--dim'],['Z2 Endurance',.6,.7,'--e'],['Z3 Tempo',.7,.8,'--diamant'],['Z4 Seuil',.8,.9,'--or'],['Z5 VO2max',.9,1,'--bad']];
  h+='<div class="card"><div class="card-t">Zones cardiaques (Karvonen)</div>';
  zones.forEach(z=>{ const lo=Math.round(fc.rest+(fc.max-fc.rest)*z[1]); const hi=Math.round(fc.rest+(fc.max-fc.rest)*z[2]);
    h+='<div class="zrow"><span class="zdot" style="background:var('+z[3]+')"></span><span class="zname">'+z[0]+'</span><span class="zval mono">'+lo+'–'+hi+'</span></div>'; });
  h+='</div>';
  $('#outBody').innerHTML=h;
}
/* ---------- IMC ---------- */
let imc={h:P.height||175,w:P.weight||62};
function renderIMC(){
  let h='<div class="card"><div class="field"><label>Taille (cm)</label><div class="stepper"><button onclick="imc.h--;renderIMC()">−</button><span class="val">'+imc.h+'</span><button onclick="imc.h++;renderIMC()">+</button></div></div>';
  h+='<div class="field"><label>Poids (kg)</label><div class="stepper"><button onclick="imc.w--;renderIMC()">−</button><span class="val">'+imc.w+'</span><button onclick="imc.w++;renderIMC()">+</button></div></div></div>';
  const v=imc.w/Math.pow(imc.h/100,2);
  let cat,col; if(v<18.5){cat='Maigreur';col='--warn';} else if(v<25){cat='Normal';col='--ok';} else if(v<30){cat='Surpoids';col='--warn';} else {cat='Obésité';col='--bad';}
  h+='<div class="card" style="text-align:center"><div class="man" style="font-weight:800;font-size:42px;color:var('+col+')">'+v.toFixed(1)+'</div><div class="badge" style="background:var(--ed);color:var('+col+')">'+cat+'</div></div>';
  $('#outBody').innerHTML=h;
}

/* ---------- CHRONO ---------- */
let chrono={running:false,start:0,elapsed:0,laps:[],raf:null};
function renderChrono(){
  const total=chrono.elapsed+(chrono.running?Date.now()-chrono.start:0);
  let h='<div class="card" style="text-align:center;padding:28px 16px;background:radial-gradient(circle at 50% 30%,rgba(61,127,255,.12),var(--s1))"><div class="mono" id="chDisp" style="font-size:54px;font-weight:700;letter-spacing:-2px;'+(chrono.running?'color:var(--e)':'')+'">'+fmtChrono(total)+'</div>';
  // Boutons
  h+='<div class="row" style="gap:14px;margin-top:24px;justify-content:center">';
  if(!chrono.running && total===0){
    h+='<div style="width:62px"></div><button class="btn" style="width:84px;height:84px;border-radius:50%;font-size:30px;flex:0;background:var(--ok)" onclick="chronoToggle()">▶</button><div style="width:62px"></div>';
  } else if(chrono.running){
    h+='<button class="chbtn" onclick="chronoLap()">Tour</button>';
    h+='<button class="btn" style="width:84px;height:84px;border-radius:50%;font-size:26px;flex:0;background:var(--warn)" onclick="chronoToggle()">⏸</button>';
    h+='<button class="chbtn" style="border-color:var(--bad);color:var(--bad)" onclick="chronoStop()">Stop</button>';
  } else {
    h+='<button class="chbtn" style="border-color:var(--bad);color:var(--bad)" onclick="chronoReset()">Reset</button>';
    h+='<button class="btn" style="width:84px;height:84px;border-radius:50%;font-size:30px;flex:0;background:var(--ok)" onclick="chronoToggle()">▶</button>';
    h+='<button class="chbtn" onclick="chronoLap()">Tour</button>';
  }
  h+='</div></div>';
  // Statistiques des tours
  if(chrono.laps.length){
    const best=Math.min(...chrono.laps), worst=Math.max(...chrono.laps), avg=chrono.laps.reduce((a,b)=>a+b,0)/chrono.laps.length;
    h+='<div class="sgrid" style="margin-bottom:12px"><div class="sbox"><div class="v" style="font-size:15px;color:var(--ok)">'+fmtChrono(best)+'</div><div class="l">Meilleur tour</div></div><div class="sbox"><div class="v" style="font-size:15px;color:var(--bad)">'+fmtChrono(worst)+'</div><div class="l">Plus lent</div></div><div class="sbox"><div class="v" style="font-size:15px">'+fmtChrono(avg)+'</div><div class="l">Moyenne</div></div><div class="sbox"><div class="v">'+chrono.laps.length+'</div><div class="l">Tours</div></div></div>';
    h+='<div class="card"><div class="row" style="margin-bottom:8px"><div class="card-t" style="margin:0">Tours</div><span style="font-size:12px;color:var(--e);cursor:pointer" onclick="exportLaps()">Exporter</span></div>';
    [...chrono.laps].reverse().forEach((l,ri)=>{ const i=chrono.laps.length-1-ri; const isBest=l===best&&chrono.laps.length>1, isWorst=l===worst&&chrono.laps.length>1;
      h+='<div class="zrow"><span class="zname">Tour '+(i+1)+(isBest?' <span style="color:var(--ok);font-size:11px">⚡ rapide</span>':isWorst?' <span style="color:var(--bad);font-size:11px">lent</span>':'')+'</span><span class="zval mono" style="'+(isBest?'color:var(--ok)':isWorst?'color:var(--bad)':'')+'">'+fmtChrono(l)+'</span></div>'; });
    h+='</div>';
  }
  $('#outBody').innerHTML=h;
}
function chronoStop(){ chrono.running=false; chrono.elapsed+=Date.now()-chrono.start; cancelAnimationFrame(chrono.raf); sfx('stop'); stopBgActivity(); renderChrono(); }
function chronoReset(){ chrono={running:false,start:0,elapsed:0,laps:[],raf:null}; renderChrono(); }
function exportLaps(){
  let txt='VVV Chronomètre\n'; chrono.laps.forEach((l,i)=>txt+='Tour '+(i+1)+' : '+fmtChrono(l)+'\n');
  if(navigator.share) navigator.share({title:'Chrono VVV',text:txt}); else { navigator.clipboard&&navigator.clipboard.writeText(txt); toast('Tours copiés ✓'); }
}
function fmtChrono(ms){ const t=Math.floor(ms); const m=Math.floor(t/60000),s=Math.floor((t%60000)/1000),cs=Math.floor((t%1000)/10); return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+'.'+String(cs).padStart(2,'0'); }
function chronoToggle(){
  if(chrono.running){ chrono.running=false; chrono.elapsed+=Date.now()-chrono.start; cancelAnimationFrame(chrono.raf); sfx('stop'); stopBgActivity(); }
  else { chrono.running=true; chrono.start=Date.now(); chronoTick(); sfx('start'); startBgActivity('Chronomètre'); }
  renderChrono();
}
function chronoTick(){ if(!chrono.running)return; const d=$('#chDisp'); if(d)d.textContent=fmtChrono(chrono.elapsed+Date.now()-chrono.start); chrono.raf=requestAnimationFrame(chronoTick); }
function chronoLap(){ const total=chrono.elapsed+(chrono.running?Date.now()-chrono.start:0); if(total<=0)return; const prev=chrono.laps.reduce((a,b)=>a+b,0); chrono.laps.push(total-prev); renderChrono(); }

/* ---------- MINUTEUR ---------- */
let timer={total:300,left:300,running:false,iv:null,m:5,s:0};
function renderTimer(){
  let h='<div class="card"><div class="pills" style="margin-bottom:14px">'+[['1:00',60],['3:00',180],['5:00',300],['10:00',600]].map(p=>'<div class="pill" onclick="setTimer('+p[1]+')">'+p[0]+'</div>').join('')+'</div>';
  if(!timer.running){
    h+='<div class="field"><label>Régler (min : sec)</label><div class="wheels">'+wheel('TM',0,59,timer.m)+'<span class="wheel-sep">:</span>'+wheel('TS',0,59,timer.s)+'</div></div>';
  }
  const pct=timer.total>0?timer.left/timer.total*100:0;
  const col=pct>50?'var(--e)':pct>20?'var(--warn)':'var(--bad)';
  h+='<div class="ring-wrap" style="width:180px;height:180px;margin:14px auto"><span id="tmRing">'+ringSVG(180,pct,12,col)+'</span><div class="ring-c"><div class="big mono" id="tmNum" style="font-size:36px">'+fmtMS(timer.left)+'</div></div></div>';
  h+='<div class="row" style="gap:10px"><button class="btn ghost" onclick="addTimer(60)">+1min</button><button class="btn" onclick="timerToggle()">'+(timer.running?'⏸ Pause':'▶ Start')+'</button><button class="btn ghost" onclick="resetTimer()">↺</button></div></div>';
  $('#outBody').innerHTML=h;
  if(!timer.running) attachWheels();
}
function fmtMS(s){ return String(Math.floor(s/60)).padStart(2,'0')+':'+String(Math.floor(s%60)).padStart(2,'0'); }
function setTimer(s){ timer.total=timer.left=s; timer.m=Math.floor(s/60); timer.s=s%60; if(timer.running){clearInterval(timer.iv);timer.running=false;} renderTimer(); }
// wheel sync for timer
const _origSetWheel=setWheelVal;
setWheelVal=function(key,val){ if(key==='TM'){timer.m=val;timer.total=timer.left=timer.m*60+timer.s;} else if(key==='TS'){timer.s=val;timer.total=timer.left=timer.m*60+timer.s;} else _origSetWheel(key,val); };
function addTimer(s){ timer.left+=s; timer.total=Math.max(timer.total,timer.left); const n=$('#tmNum'); if(n)n.textContent=fmtMS(timer.left); }
function timerToggle(){
  stopAlarm();
  if(timer.running){ clearInterval(timer.iv); timer.running=false; timer.endAt=null; stopBgActivity(); renderTimer(); return; }
  if(timer.left<=0){ timer.left=timer.total=timer.m*60+timer.s; }
  if(timer.left<=0){ toast('Règle une durée'); return; }
  timer.running=true; timer.endAt=Date.now()+timer.left*1000; sfx('start'); startBgActivity('Minuteur'); renderTimer();
  timer.iv=setInterval(()=>{
    // basé sur l'horloge → reste exact même en arrière-plan
    timer.left=Math.max(0,Math.round((timer.endAt-Date.now())/1000));
    const pct=timer.left/timer.total*100;
    const col=pct>50?'var(--e)':pct>20?'var(--warn)':'var(--bad)';
    const r=$('#tmRing'),n=$('#tmNum');
    if(r)r.innerHTML=ringSVG(180,pct,12,col); if(n)n.textContent=fmtMS(timer.left);
    if(timer.left<=0){ clearInterval(timer.iv); timer.running=false; timer.endAt=null; burst(); stopBgActivity(); startAlarm('⏰ Minuteur terminé','Le temps est écoulé !'); renderTimer(); }
  },250);
}
function resetTimer(){ clearInterval(timer.iv); timer.running=false; timer.endAt=null; stopAlarm(); stopBgActivity(); timer.left=timer.total=timer.m*60+timer.s||300; renderTimer(); }

/* ---------- AGENDA ---------- */
function renderAgenda(){
  let h='<button class="btn" style="margin-bottom:14px" onclick="addEvent()">＋ Ajouter un événement</button>';
  const evts=[...AGENDA].sort((a,b)=>new Date(a.date)-new Date(b.date));
  if(P.compDate) evts.unshift({date:P.compDate,title:'🏆 '+(P.goal||'Compétition'),fixed:true});
  if(!evts.length) h+='<div class="card"><div class="empty"><div class="em-ic">📅</div><div style="font-size:13px">Aucun événement</div></div></div>';
  else evts.forEach((e,i)=>{
    const dd=daysBetween(new Date(),new Date(e.date));
    h+='<div class="card"><div class="row"><div><div style="font-weight:700">'+e.title+'</div><div style="font-size:12px;color:var(--muted);margin-top:2px">'+fmtDate(e.date)+' · '+(dd>=0?'J-'+dd:'passé')+'</div></div>'+(e.fixed?'':'<button class="x" onclick="delEvent('+(i-(P.compDate?1:0))+')">🗑</button>')+'</div></div>';
  });
  $('#outBody').innerHTML=h;
}
function addEvent(){
  const t=prompt('Titre de l\u2019événement :'); if(!t)return;
  const d=prompt('Date (AAAA-MM-JJ) :',todayKey()); if(!d)return;
  AGENDA.push({title:t,date:d}); saveAll(); renderAgenda(); toast('Événement ajouté');
}
function delEvent(i){ AGENDA.splice(i,1); saveAll(); renderAgenda(); }

/* ---------- PRIÈRES (Béjaïa, UOIF) ---------- */
function renderPriere(){
  const times=prayerTimes();
  const now=new Date(); const nowMin=now.getHours()*60+now.getMinutes();
  const order=['Fajr','Dhuhr','Asr','Maghrib','Isha'];
  let activeIdx=-1;
  order.forEach((p,i)=>{ const[hh,mm]=times[p].split(':').map(Number); if(hh*60+mm<=nowMin) activeIdx=i; });
  let h='<div class="card"><div class="card-t">🕌 Prières · Béjaïa</div><div style="font-size:12px;color:var(--muted);margin-bottom:14px">Méthode UOIF · '+now.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})+'</div>';
  const icons={Fajr:'🌅',Dhuhr:'☀️',Asr:'🌤️',Maghrib:'🌇',Isha:'🌙'};
  order.forEach((p,i)=>{
    const act=i===activeIdx;
    h+='<div class="zrow" style="'+(act?'background:var(--ed);border-radius:12px;padding:11px 12px;margin:0 -4px':'')+'"><span style="font-size:18px">'+icons[p]+'</span><span class="zname" style="margin-left:8px;'+(act?'color:var(--e)':'')+'">'+p+'</span><span class="zval mono" style="'+(act?'color:var(--e);font-weight:700':'')+'">'+times[p]+'</span></div>';
  });
  h+='</div>';
  $('#outBody').innerHTML=h;
}
function prayerTimes(){
  const lat=36.75,lon=5.07,tz=1; // Algeria UTC+1
  const now=new Date();
  const N=Math.floor((now-new Date(now.getFullYear(),0,0))/86400000);
  const rad=Math.PI/180;
  // sun declination & equation of time
  const g=(357.529+0.98560028*N)*rad;
  const q=280.459+0.98564736*N;
  const L=(q+1.915*Math.sin(g)+0.020*Math.sin(2*g))*rad;
  const decl=Math.asin(0.39779*Math.sin(L));
  const eqt=(q/15)-(Math.atan2(Math.cos(23.44*rad)*Math.sin(L),Math.cos(L))/rad)/15;
  const Dhuhr=12+tz-lon/15-eqt;
  function hourAngle(angle){ const c=(Math.sin(-angle*rad)-Math.sin(lat*rad)*Math.sin(decl))/(Math.cos(lat*rad)*Math.cos(decl)); return Math.acos(Math.max(-1,Math.min(1,c)))/rad/15; }
  function asrAngle(){ const c=(Math.sin(Math.atan(1/(1+Math.tan(Math.abs(lat-decl/rad)*rad))))-Math.sin(lat*rad)*Math.sin(decl))/(Math.cos(lat*rad)*Math.cos(decl)); return Math.acos(Math.max(-1,Math.min(1,c)))/rad/15; }
  const fajr=Dhuhr-hourAngle(18);
  const sunrise=Dhuhr-hourAngle(0.833);
  const asr=Dhuhr+asrAngle();
  const maghrib=Dhuhr+hourAngle(0.833);
  const isha=Dhuhr+hourAngle(17);
  const f=t=>{ t=(t+24)%24; let hh=Math.floor(t),mm=Math.round((t-hh)*60); if(mm===60){hh++;mm=0;} return String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0'); };
  return {Fajr:f(fajr),Sunrise:f(sunrise),Dhuhr:f(Dhuhr+1/60),Asr:f(asr),Maghrib:f(maghrib),Isha:f(isha)};
}

/* ---------- PROFILE ---------- */
function age(){ if(!P.bday)return'—'; const d=new Date(P.bday); return Math.floor((Date.now()-d)/31557600000); }
function avatarHTML(size,fs){
  if(P.photo) return '<div style="width:'+size+'px;height:'+size+'px;border-radius:50%;background-image:url('+P.photo+');background-size:cover;background-position:center;margin:0 auto"></div>';
  return '<div style="width:'+size+'px;height:'+size+'px;border-radius:50%;background:linear-gradient(135deg,var(--e),var(--marineL));display:flex;align-items:center;justify-content:center;margin:0 auto;font-family:Manrope;font-weight:800;font-size:'+fs+'px">'+(P.name?P.name[0].toUpperCase():'?')+'</div>';
}
function renderProfile(){
  const xp=xpProgress();
  const sec=(label)=>'<div class="lab" style="margin:22px 0 10px">'+label+'</div>';
  // HEADER : photo + nom + bio
  let h='<div class="card stag" style="text-align:center;padding-top:20px"><div style="position:relative;width:92px;margin:0 auto 12px">'+avatarHTML(92,36)+
    '<div onclick="changePhoto()" style="position:absolute;bottom:0;right:0;width:30px;height:30px;border-radius:50%;background:var(--e);border:2px solid var(--bg);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px">📷</div></div>';
  h+='<div class="man" style="font-weight:800;font-size:22px">'+(P.name||'Athlète')+'</div><div class="badge" style="margin-top:8px">'+XP.name+' · '+t('level')+' '+XP.level+'</div>';
  h+='<div style="font-size:13px;color:var(--muted);margin-top:10px;line-height:1.5;font-style:'+(P.bio?'normal':'italic')+'">'+(P.bio||'Ajoute une biographie ✍️')+'</div>';
  h+='<div class="row" style="gap:8px;margin-top:14px;justify-content:center">'+
    (P.photo?'<button class="btn ghost sm" style="width:auto;padding:8px 14px" onclick="removePhoto()">🗑 '+t('removePhoto')+'</button>':'')+
    '<button class="btn ghost sm" style="width:auto;padding:8px 14px" onclick="editBio()">✍️ '+t('bio')+'</button></div></div>';
  // STATS
  h+='<div class="card stag" style="animation-delay:.05s"><div class="sgrid"><div class="sbox"><div class="v">'+(P.height||'—')+'</div><div class="l">'+t('height')+' (cm)</div></div><div class="sbox"><div class="v">'+(P.weight||'—')+'</div><div class="l">'+t('weight')+' (kg)</div></div><div class="sbox"><div class="v">'+age()+'</div><div class="l">'+t('age')+'</div></div><div class="sbox"><div class="v">'+(getUserVDOT()||'—')+'</div><div class="l">VDOT</div></div></div></div>';
  h+='<div class="card stag" style="animation-delay:.10s"><div class="row" style="margin-bottom:8px"><span class="lab">'+t('xpProgress')+'</span><span class="mono" style="color:var(--e)">'+XP.total+' XP</span></div><div class="pbar"><div style="width:'+xp.pct+'%"></div></div></div>';
  h+='<button class="btn stag" style="animation-delay:.15s" onclick="openProfileEdit()">✏️ '+t('editInfos')+'</button>';
  h+='<button class="btn ghost stag" style="margin-top:10px;animation-delay:.16s" onclick="openRecords()">🏅 '+t('perfHistory')+'</button>';
  // OBJECTIF
  h+=sec('🎯 '+t('objective'));
  h+='<div class="card stag"><div class="row"><div><div style="font-weight:700">'+(P.objRace||P.goal||'—')+'</div><div style="font-size:12px;color:var(--muted);margin-top:2px">'+(P.compDate?fmtDate(P.compDate):'—')+'</div></div><span style="color:var(--e);font-size:12px;cursor:pointer" onclick="nav(\'sport\');sportTab=\'run\';runSub=\'ia\';renderSport()">'+t('edit')+'</span></div></div>';
  // LANGUE
  h+=sec('🌍 '+t('language'));
  h+='<div class="card stag"><div class="pills">'+LANGS.map(l=>'<div class="pill '+(curLang()===l[0]?'on':'')+'" onclick="setLang(\''+l[0]+'\')">'+l[1]+' '+l[2]+'</div>').join('')+'</div></div>';
  // APPARENCE
  h+=sec('🎨 '+t('appearance'));
  // MODE sombre / clair / auto
  const mode=P.mode||'dark';
  h+='<div class="card stag"><div class="lab" style="margin-bottom:8px">Thème</div><div class="pills">'+
    [['dark','🌙 Sombre'],['light','☀️ Clair'],['auto','⚙️ Auto']].map(m=>'<div class="pill '+(mode===m[0]?'on':'')+'" onclick="setMode(\''+m[0]+'\')">'+m[1]+'</div>').join('')+'</div>';
  // COULEUR D'ACCENT + Autre (palette personnalisée)
  const custom=P.theme==='custom';
  h+='<div class="lab" style="margin:14px 0 8px">'+t('accentColor')+'</div><div class="pills">'+
    [['blue','Bleu','#3D7FFF'],['violet','Violet','#A98CF0'],['cyan','Cyan','#7FE0E8'],['green','Vert','#33D399'],['orange','Orange','#FF8A3D'],['pink','Rose','#FF5C9E']].map(c=>'<div class="pill '+(P.theme===c[0]?'on':'')+'" onclick="setTheme(\''+c[0]+'\')"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:'+c[2]+';margin-right:6px"></span>'+c[1]+'</div>').join('')+
    '<div class="pill '+(custom?'on':'')+'" onclick="openColorPicker()"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:'+(custom?P.customColor:'conic-gradient(red,orange,yellow,lime,cyan,blue,magenta,red)')+';margin-right:6px"></span>🎨 Autre</div></div></div>';
  // NOTIFICATIONS & SONS
  h+=sec('🔔 '+t('notifsApp'));
  h+='<div class="card stag"><div class="row" style="margin-bottom:14px"><span style="font-size:14px">'+t('trainReminders')+'</span><div class="toggle'+(P.notif!==false?' on':'')+'" onclick="toggleNotif(this)"></div></div>'+
    '<div class="row" style="margin-bottom:14px"><span style="font-size:14px">🔊 '+t('sounds')+'</span><div class="toggle'+(P.sounds!==false?' on':'')+'" onclick="toggleSounds(this)"></div></div>'+
    '<div class="row"><span style="font-size:14px">'+t('units')+'</span><div class="toggle on"></div></div></div>';
  // DONNÉES
  h+=sec('🔒 '+t('dataPrivacy'));
  h+='<div class="card stag"><button class="btn ghost sm" style="margin-bottom:8px" onclick="exportData()">📤 '+t('exportData')+'</button>';
  h+='<button class="btn ghost sm" style="margin-bottom:8px" onclick="importData()">📥 '+t('importData')+'</button>';
  h+='<button class="btn ghost sm" style="color:var(--bad)" onclick="resetAll()">🗑 '+t('resetApp')+'</button></div>';
  h+='<div style="text-align:center;color:var(--dim);font-size:12px;margin:20px 0">VVV — Elite Athletic Intelligence · v2.0</div>';
  $('#s-profil').innerHTML=h;
}
/* ---- Photo & Bio ---- */
function changePhoto(){
  // Propose galerie OU appareil photo
  let h='<div class="tip" style="margin-bottom:14px">Choisis ta photo de profil :</div>';
  h+='<button class="btn" style="margin-bottom:10px" onclick="pickPhotoSource(false)">🖼️ Depuis la galerie</button>';
  h+='<button class="btn ghost" style="margin-bottom:10px" onclick="pickPhotoSource(true)">📷 Prendre une photo</button>';
  if(P.photo) h+='<button class="btn ghost" style="color:var(--bad)" onclick="removePhoto();closeOv(\'ovProg\')">🗑 Supprimer la photo actuelle</button>';
  $('#ovProgTitle').textContent='Photo de profil'; $('#progBody').innerHTML=h; $('#ovProg').style.zIndex='13700'; openOv('ovProg');
}
function pickPhotoSource(useCamera){
  const inp=document.createElement('input'); inp.type='file'; inp.accept='image/*';
  if(useCamera) inp.capture='user'; // appareil photo. Sans capture = galerie
  inp.onchange=e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader();
    r.onload=()=>{ const img=new Image(); img.onload=()=>{ openCropper(img); }; img.src=r.result; };
    r.readAsDataURL(f); };
  inp.click();
}
/* Recadrage simple : zoom + déplacement avant validation */
let _crop=null;
const CROP_VIEW=300, CROP_DPR=Math.min(3,window.devicePixelRatio||2), CROP_OUT=512;
function openCropper(img){
  closeOv('ovProg');
  _crop={img,scale:1,x:0,y:0};
  let h='<div class="tip" style="margin-bottom:12px">Glisse pour déplacer, utilise le curseur pour zoomer.</div>';
  h+='<div id="cropStage" style="position:relative;width:'+CROP_VIEW+'px;height:'+CROP_VIEW+'px;max-width:100%;margin:0 auto 14px;border-radius:50%;overflow:hidden;background:#000;touch-action:none;border:2px solid var(--e)"><canvas id="cropCv" style="width:100%;height:100%;display:block"></canvas></div>';
  h+='<div class="field"><label>Zoom</label><input id="cropZoom" type="range" min="1" max="4" step="0.01" value="1" style="width:100%"></div>';
  h+='<button class="btn" onclick="applyCrop()">✓ Valider la photo</button>';
  $('#ovProgTitle').textContent='Recadrer'; $('#progBody').innerHTML=h; $('#ovProg').style.zIndex='13700'; openOv('ovProg');
  setTimeout(initCropper,40);
}
function drawCrop(){
  const c=$('#cropCv'); if(!c)return;
  const R=CROP_VIEW*CROP_DPR;
  if(c.width!==R){ c.width=R; c.height=R; }
  const ctx=c.getContext('2d'); ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high';
  const{img,scale,x,y}=_crop;
  ctx.clearRect(0,0,R,R); ctx.fillStyle='#000'; ctx.fillRect(0,0,R,R);
  const base=R/Math.min(img.width,img.height); const w=img.width*base*scale, hh=img.height*base*scale;
  ctx.drawImage(img,(R-w)/2+x*CROP_DPR,(R-hh)/2+y*CROP_DPR,w,hh);
}
function initCropper(){
  drawCrop();
  const z=$('#cropZoom'); if(z) z.oninput=()=>{ _crop.scale=+z.value; drawCrop(); };
  const stage=$('#cropStage'); if(!stage)return;
  let drag=false,lx=0,ly=0;
  stage.addEventListener('pointerdown',e=>{ drag=true; lx=e.clientX; ly=e.clientY; stage.setPointerCapture&&stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove',e=>{ if(!drag)return; _crop.x+=e.clientX-lx; _crop.y+=e.clientY-ly; lx=e.clientX; ly=e.clientY; drawCrop(); });
  window.addEventListener('pointerup',()=>drag=false);
}
function applyCrop(){
  // Rendu final haute résolution directement depuis l'image source (net, non pixelisé)
  const{img,scale,x,y}=_crop;
  const out=document.createElement('canvas'); out.width=CROP_OUT; out.height=CROP_OUT;
  const ctx=out.getContext('2d'); ctx.imageSmoothingEnabled=true; ctx.imageSmoothingQuality='high';
  ctx.fillStyle='#000'; ctx.fillRect(0,0,CROP_OUT,CROP_OUT);
  const base=CROP_OUT/Math.min(img.width,img.height); const w=img.width*base*scale, hh=img.height*base*scale;
  const ratio=CROP_OUT/CROP_VIEW; // remappe le déplacement de l'aperçu vers la sortie
  ctx.drawImage(img,(CROP_OUT-w)/2+x*ratio,(CROP_OUT-hh)/2+y*ratio,w,hh);
  P.photo=out.toDataURL('image/jpeg',0.9); saveAll(); closeOv('ovProg'); renderProfile(); toast('Photo mise à jour ✓'); sfx&&sfx('goal');
}
function removePhoto(){ delete P.photo; saveAll(); renderProfile(); toast('Photo supprimée'); }
function editBio(){ const v=prompt('Ta biographie :',P.bio||''); if(v!==null){ P.bio=v.trim().slice(0,160); saveAll(); renderProfile(); } }
function importData(){
  const inp=document.createElement('input'); inp.type='file'; inp.accept='.json';
  inp.onchange=e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader();
    r.onload=()=>{ try{ const d=JSON.parse(r.result); if(d.profile){P=d.profile;DB.save('profile',P);} if(d.sessions){SESS=d.sessions;DB.save('sessions',SESS);} if(d.muscu){MSESS=d.muscu;DB.save('muscu_sessions',MSESS);} if(d.xp){XP=d.xp;DB.save('xp',XP);} toast('Données importées ✓'); applyTheme(); renderProfile(); }catch(err){ toast('Fichier invalide'); } };
    r.readAsText(f); };
  inp.click();
}
/* ---------- HISTORIQUE DES PERFORMANCES (records illimités) ---------- */
const REC_DISTANCES=[['100 m',100],['200 m',200],['300 m',300],['400 m',400],['600 m',600],['800 m',800],['1000 m',1000],['1500 m',1500],['3000 m',3000],['5000 m',5000],['10 km',10000],['15 km',15000],['Semi-marathon',21097],['Marathon',42195],['Trail',0],['Cross',0]];
function openRecords(){
  let h='<button class="btn" style="margin-bottom:14px" onclick="addRecord()">＋ Ajouter une performance</button>';
  const recs=personalRecords();
  if(!recs.length) h+='<div class="card"><div class="empty"><div class="em-ic">🏅</div><div style="font-size:13px">Ajoute tes chronos : ils alimentent ton VDOT et ton plan.</div></div></div>';
  else {
    const sorted=[...RECORDS].sort((a,b)=>(a.meters||0)-(b.meters||0));
    sorted.forEach((r,i)=>{
      const v=r.meters?vdotFromRace(r.meters,parseTime(r.time)).toFixed(1):'—';
      h+='<div class="card" style="padding:13px"><div class="row"><div><div style="font-weight:700">'+r.dist+' · <span class="mono" style="color:var(--e)">'+r.time+'</span></div><div style="font-size:11px;color:var(--muted);margin-top:3px">'+(r.date?fmtDate(r.date):'')+(r.place?' · '+r.place:'')+(r.meters?' · VDOT '+v:'')+'</div></div><button class="x" onclick="delRecord('+i+')">🗑</button></div>'+(r.feel||r.hrAvg?'<div style="font-size:11px;color:var(--dim);margin-top:6px">'+(r.feel?r.feel:'')+(r.hrAvg?' · FC moy '+r.hrAvg:'')+(r.hrMax?' / max '+r.hrMax:'')+'</div>':'')+'</div>';
    });
    const best=bestRecord();
    if(best) h+='<div class="card" style="border-color:var(--or);text-align:center"><div class="lab" style="color:var(--or)">🏆 Meilleure perf</div><div class="man" style="font-weight:800;font-size:18px;margin-top:4px">'+best.dist+' — '+best.time+'</div><div style="font-size:12px;color:var(--muted)">VDOT '+vdotFromRace(best.meters,parseTime(best.time)).toFixed(1)+'</div></div>';
  }
  $('#profileEditBody').innerHTML=h; $('#ovProfile').querySelector('h2').textContent='Historique des performances'; openOv('ovProfile');
}
let recTmp={};
function addRecord(){
  // Étape 1 : choisir la distance via Wheel Picker
  const names=REC_DISTANCES.map(d=>d[0]).concat(['Autre']);
  openPicker({title:'Choisis la distance',cols:[{values:names,sel:9,wide:true}],onOk:idx=>{
    if(names[idx[0]]==='Autre'){ pickDistance('Distance personnalisée',5,km=>recordForm([(km>=1?km+' km':Math.round(km*1000)+' m'),Math.round(km*1000)])); }
    else recordForm(REC_DISTANCES[idx[0]]);
  }});
}
function recordForm(d){
  recTmp={dist:d[0],meters:d[1],timeS:d[1]>=21000?5400:(d[1]>=5000?1200:300),date:todayKey(),place:'',feel:''};
  let h='<div style="text-align:center;margin-bottom:16px"><div class="badge" style="font-size:14px;padding:8px 16px">🏁 '+d[0]+'</div></div>';
  h+='<div class="field"><label>Chrono *</label><div class="inp pkfield set" id="rc_time" onclick="pickTime(\'Chrono '+d[0]+'\',recTmp.timeS,v=>{recTmp.timeS=v;document.getElementById(\'rc_time\').textContent=fmtTime(v)},'+(d[1]>=15000?'true':'false')+')">'+fmtTime(recTmp.timeS)+'</div></div>';
  h+='<div class="field"><label>Date</label><input class="inp" id="rc_date" type="date" value="'+todayKey()+'"></div>';
  h+='<div class="field"><label>Lieu (optionnel)</label><input class="inp" id="rc_place" placeholder="Lieu de la course"></div>';
  h+='<div class="field"><label>Sensation (optionnel)</label><input class="inp" id="rc_feel" placeholder="Comment c\u2019était ?"></div>';
  h+='<button class="btn" onclick="saveRecord()">💾 Enregistrer cette performance</button>';
  h+='<button class="btn ghost" style="margin-top:10px" onclick="openRecords()">‹ Retour</button>';
  $('#profileEditBody').innerHTML=h;
}
function saveRecord(){
  const time=fmtTime(recTmp.timeS);
  RECORDS.push({dist:recTmp.dist,meters:recTmp.meters,time,date:$('#rc_date').value,place:$('#rc_place').value.trim(),feel:$('#rc_feel').value.trim()});
  if(recTmp.dist==='5000 m')P.pb5k=time; if(recTmp.dist==='3000 m')P.pb3k=time; if(recTmp.dist==='1500 m')P.pb1500=time; if(recTmp.dist==='10 km')P.pb10k=time;
  P.vdot=computeVDOTfromRecords();
  saveAll(); refreshXP({animate:true}); openRecords(); toast('Performance ajoutée ✓'); burst();
}
function delRecord(i){ const sorted=[...RECORDS].sort((a,b)=>(a.meters||0)-(b.meters||0)); const r=sorted[i]; RECORDS=RECORDS.filter(x=>x!==r); P.vdot=computeVDOTfromRecords(); saveAll(); openRecords(); }
function computeVDOTfromRecords(){
  let best=computeVDOT();
  RECORDS.forEach(r=>{ if(r.meters&&r.time){ const v=vdotFromRace(r.meters,parseTime(r.time)); if(v>best)best=v; }});
  return best>0?Math.round(best*10)/10:0;
}
function openProfileEdit(){
  $('#ovProfile').querySelector('h2').textContent='Modifier le profil';
  const f=(l,id,v,t)=>'<div class="field"><label>'+l+'</label><input class="inp" id="'+id+'" value="'+(v||'')+'" '+(t?'type="'+t+'"':'')+'></div>';
  let h=f('Prénom','pe_name',P.name)+f('Ville','pe_city',P.city)+f('Date de naissance','pe_bday',P.bday,'date')+
    f('Taille (cm)','pe_h',P.height,'number')+f('Poids (kg)','pe_w',P.weight,'number')+
    f('FC max','pe_hrmax',P.hrMax,'number')+f('FC repos','pe_hrrest',P.hrRest,'number')+
    f('Km / semaine','pe_km',P.kmWeek,'number')+f('Objectif','pe_goal',P.goal)+f('Date compétition','pe_comp',P.compDate,'date')+
    f('5000m','pe_5k',P.t5k)+f('3000m','pe_3k',P.t3k)+f('1500m','pe_1500',P.t1500)+f('10km','pe_10k',P.t10k)+f('Coach','pe_coach',P.coach);
  h+='<button class="btn" onclick="saveProfileEdit()">💾 Sauver</button>';
  $('#profileEditBody').innerHTML=h; openOv('ovProfile');
}
function saveProfileEdit(){
  P.name=$('#pe_name').value.trim()||P.name; P.city=$('#pe_city').value.trim(); P.bday=$('#pe_bday').value;
  P.height=+$('#pe_h').value||P.height; P.weight=+$('#pe_w').value||P.weight;
  P.hrMax=+$('#pe_hrmax').value||P.hrMax; P.hrRest=+$('#pe_hrrest').value||P.hrRest;
  P.kmWeek=+$('#pe_km').value||P.kmWeek; P.goal=$('#pe_goal').value.trim(); P.compDate=$('#pe_comp').value;
  P.t5k=$('#pe_5k').value.trim(); P.t3k=$('#pe_3k').value.trim(); P.t1500=$('#pe_1500').value.trim(); P.t10k=$('#pe_10k').value.trim();
  P.coach=$('#pe_coach').value.trim();
  P.pb5k=P.t5k; P.pb3k=P.t3k; P.pb1500=P.t1500; P.pb10k=P.t10k;
  P.vdot=computeVDOT();
  saveAll(); closeOv('ovProfile'); renderProfile(); toast('Profil mis à jour ✓');
}

/* ---------- SETTINGS ---------- */
function openSettings(){
  let h='<div class="card"><div class="card-t">🎨 Thème couleur</div><div class="pills">'+
    [['blue','Bleu','#3D7FFF'],['violet','Violet','#A98CF0'],['cyan','Cyan','#7FE0E8']].map(t=>'<div class="pill '+((P.theme||'blue')===t[0]?'on':'')+'" onclick="setTheme(\''+t[0]+'\')"><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:'+t[2]+';margin-right:6px"></span>'+t[1]+'</div>').join('')+'</div></div>';
  h+='<div class="card"><div class="row" style="margin-bottom:14px"><span>Mode sombre</span><div class="toggle on"></div></div>'+
    '<div class="row" style="margin-bottom:14px"><span>Unités métriques (km)</span><div class="toggle on"></div></div>'+
    '<div class="row"><span>Notifications</span><div class="toggle'+(P.notif?' on':'')+'" onclick="P.notif=!P.notif;saveAll();this.classList.toggle(\'on\')"></div></div></div>';
  h+='<div class="card"><div class="card-t">🔒 Données & confidentialité</div><button class="btn ghost sm" style="margin-bottom:8px" onclick="exportData()">📤 Exporter mes données (JSON)</button><button class="btn ghost sm" style="color:var(--bad)" onclick="resetAll()">🗑 Réinitialisation totale</button></div>';
  h+='<div style="text-align:center;color:var(--dim);font-size:12px">VVV v2.0 · Données locales uniquement</div>';
  $('#settingsBody').innerHTML=h; openOv('ovSettings');
}
function exportData(){
  const data={profile:P,sessions:SESS,muscu:MSESS,custom:CUSTOM,plan:PLAN,goals:GOALS,agenda:AGENDA,xp:XP};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='vvv-export.json'; a.click();
  toast('Export généré ✓');
}
function resetAll(){
  if(!confirm('Tout effacer ? Cette action est irréversible.'))return;
  if(!confirm('Vraiment sûr ? Toutes tes données seront perdues.'))return;
  localStorage.clear();
  location.reload();
}

/* ============ PWA : manifest + service worker (offline-first) ============ */
function setupPWA(){
  // Manifest dynamique
  try{
    const icon=appIconDataURL();
    const manifest={ name:'VVV — Elite Athletic Intelligence', short_name:'VVV', start_url:'.', scope:'.',
      display:'standalone', orientation:'portrait', background_color:'#0A0D12', theme_color:'#0A0D12',
      icons:[{src:icon,sizes:'192x192',type:'image/svg+xml',purpose:'any maskable'},{src:icon,sizes:'512x512',type:'image/svg+xml',purpose:'any maskable'}] };
    const blob=new Blob([JSON.stringify(manifest)],{type:'application/manifest+json'});
    const url=URL.createObjectURL(blob);
    let link=document.querySelector('link[rel="manifest"]'); if(!link){ link=document.createElement('link'); link.rel='manifest'; document.head.appendChild(link); }
    link.href=url;
  }catch(e){}
  // Service worker : cache la page courante pour fonctionner hors-ligne
  if('serviceWorker'in navigator && location.protocol.startsWith('http')){
    const swCode="const C='vvv-v2';self.addEventListener('install',e=>{self.skipWaiting()});self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.open(C).then(c=>c.match(e.request).then(r=>{const f=fetch(e.request).then(res=>{try{c.put(e.request,res.clone())}catch(x){}return res}).catch(()=>r);return r||f})))});";
    try{ const b=new Blob([swCode],{type:'text/javascript'}); navigator.serviceWorker.register(URL.createObjectURL(b)).catch(()=>{}); }catch(e){}
  }
}

/* ============ ÉTAT EN LIGNE / HORS LIGNE + SYNC ============ */
function checkConnectivity(){
  const online=navigator.onLine;
  if(online){ syncOnline(true); }
  else {
    const last=PREFS.lastOnline||Date.now();
    const days=Math.floor((Date.now()-last)/86400000);
    if(days>=3) setTimeout(()=>toast('📡 Hors ligne depuis '+days+' j — pense à te reconnecter'),1500);
  }
  return online;
}
/* Synchronisation silencieuse quand Internet est disponible */
function syncOnline(silent){
  if(!navigator.onLine) return;
  PREFS.lastOnline=Date.now();
  PREFS.lastSync=Date.now();
  // Recalcule/rafraîchit les données dépendantes de la date (prières, calendrier, J-X…)
  try{ if($('#s-home')&&$('#s-home').classList.contains('on')) renderHome(); }catch(e){}
  try{ if($('#s-outils')&&$('#s-outils').classList.contains('on')&&outilsTab==='priere') renderPriere(); }catch(e){}
  DB.save('prefs',PREFS);
  if(!silent) toast('🔄 Données synchronisées');
}
window.addEventListener('online',()=>{ toast('🟢 Connexion rétablie · synchronisation…'); syncOnline(false); });
window.addEventListener('offline',()=>{ toast('🔌 Mode hors ligne — tout reste accessible'); });
// Sync silencieuse périodique tant que l'app est ouverte
setInterval(()=>{ if(navigator.onLine) syncOnline(true); },5*60*1000);

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot); else boot();
setupPWA();
