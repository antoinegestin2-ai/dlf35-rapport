let menus=[];fetch('menus.json').then(r=>r.json()).then(x=>{menus=x;render()}).catch(()=>render());
const KEY='dlf35_v2_essai';const COVER_FIELDS=[['address','Adresse de l’intervention'],['date','Date de l’intervention'],['ref','Nos références'],['mandant','Mandant'],['devis','Numéro de devis'],['refmandant','Référence mandat'],['assurance','Assurance'],['refassurance','Référence assurance'],['technician','Technicien']];const SECTIONS=[['summary','Synthèse'],['remarks','Remarques'],['advice','Conseils et préconisations']];const coverOn=r=>r.coverEnabled||(r.coverEnabled=Object.fromEntries(COVER_FIELDS.map(([k])=>[k,true])));const sectionOn=r=>r.sectionEnabled||(r.sectionEnabled={summary:true,remarks:true,advice:true});const empty=()=>({id:Date.now(),date:new Date().toISOString().slice(0,10),address:'',ref:'26-',mandant:'',refmandant:'',devis:'',assurance:'',refassurance:'',technician:'',coverPhotos:[],damage:[{title:'Dommage n°1',description:'',place:'',room:'',visual:'',photos:[],investigations:[{method:'',place:'',room:'',observations:'',photos:[]}]}],summary:'',remarks:'',advice:'',notes:'',attachments:[],archived:false,coverEnabled:Object.fromEntries(COVER_FIELDS.map(([k])=>[k,!['devis','refmandant','assurance','refassurance'].includes(k)])),sectionEnabled:{summary:true,remarks:false,advice:false},declaredEnabled:false});let store;try{store=JSON.parse(localStorage.getItem(KEY))||{items:[],current:null}}catch{store={items:[],current:null}}let page='home',di=0,ii=0,editor=null;const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(store))}catch{alert('Stockage local saturé. Réduisez les photos ou exportez votre dossier.')}};const cur=()=>store.items.find(x=>x.id===store.current);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));const field=(label,value,fn,type='text')=>`<label>${label}<${type==='textarea'?'textarea':'input'} ${type==='textarea'?'':'type="'+type+'"'} data-bind="${fn}">${type==='textarea'?esc(value):''}${type==='textarea'?'':'</input>'}</${type==='textarea'?'textarea':'input'}>`;const inp=(label,value,path,type='text')=>`<label>${label}<input type="${type}" value="${esc(value)}" data-bind="${path}"></label>`;const ta=(label,value,path)=>`<label>${label}<textarea data-bind="${path}">${esc(value)}</textarea></label>`;
const btn=(label,call,cls='secondary')=>`<button class="${cls}" onclick="${call}">${label}</button>`;
function render(){const r=cur(),nav=[['home','Interventions'],['identity','Présentation'],['damage','Dommages'],['investigation','Investigations'],['end','Synthèse'],['files','Dossier'],['preview','Aperçu']];document.getElementById('tabs').innerHTML=nav.map(([id,name])=>btn(name,`go('${id}')`,page===id?'active':'secondary')).join('');document.getElementById('app').innerHTML=!r&&page!=='home'?'<div class="panel">Créez une intervention pour commencer.</div>':views[page](r);document.querySelectorAll('[data-formula]').forEach(el=>el.addEventListener('input',e=>{const r=cur();r.formulationEdits ||= {};r.formulationEdits[e.target.dataset.formula]=e.target.value;save()}));document.querySelectorAll('[data-bind]').forEach(el=>el.addEventListener('input',e=>{let path=e.target.dataset.bind.split('.'),obj=cur();for(let i=0;i<path.length-1;i++)obj=obj[path[i]];obj[path.at(-1)]=e.target.value;save()}));}
function go(x){page=x;render()}function toggleCover(k,checked){coverOn(cur())[k]=checked;save();render()}function toggleDeclared(checked){cur().declaredEnabled=checked;save();render()}function toggleSection(k,checked){sectionOn(cur())[k]=checked;save();render()}function create(){let x=empty();store.items.unshift(x);store.current=x.id;save();go('files')}function openR(id){store.current=id;di=0;ii=0;go('identity')}function archive(){cur().archived=!cur().archived;save();render()}function addD(sub=false){let x=cur();let n=x.damage.length+1;x.damage.push({title:sub?`Sous-dommage ${di+1}.${x.damage.filter(y=>y.title.startsWith('Sous-dommage')).length+1}`:`Dommage n°${x.damage.filter(y=>!y.title.startsWith('Sous-dommage')).length+1}`,description:'',place:'',room:'',visual:'',photos:[],investigations:[{method:'',place:'',room:'',observations:'',photos:[]}]});di=n-1;ii=0;save();go('damage')}function addI(){let d=cur().damage[di];d.investigations.push({method:'',place:'',room:'',observations:'',photos:[]});ii=d.investigations.length-1;save();render()}function setD(i){di=i;ii=0;render()}function setI(i){ii=i;render()}function delD(){if(cur().damage.length===1)return alert('Conservez au moins un dommage.');if(!confirm('Supprimer ce dommage ?'))return;cur().damage.splice(di,1);di=0;save();render()}
const MENU_LABELS={1:'Procédé de l’inspection visuelle des dommages',4:'Dégradations et constatations visuelles',5:'Mesures et hygrométrie des dommages',8:'Procédé des investigations',10:'Résultat des investigations',14:'Synthèse des constatations',15:'Remarques particulières',17:'Conseils et préconisations'};
function phrase(menu,path){const values=(menus[menu]||[]).map((v,i)=>({v,i})).filter(x=>x.v&&x.v.trim()&&x.v.trim()!=='CHOISIR');const r=cur();if(!r.formulationEdits)r.formulationEdits={};const key=path+'__'+menu;const val=r.formulationEdits[key]||'';const label=MENU_LABELS[menu]||'Formulation de la matrice';return `<div class="card"><label for="menu_${menu}">${esc(label)}</label><select id="menu_${menu}" onchange="insertPhrase(${menu},'${path}',this.value)"><option value="">Sélectionner une formulation de la matrice…</option>${values.map(x=>`<option value="${x.i}">${esc(x.v.slice(0,125))}</option>`).join('')}</select><label for="edit_${menu}">Modifier cette formulation uniquement</label><textarea id="edit_${menu}" data-formula="${esc(key)}" placeholder="Aucun texte sélectionné">${esc(val)}</textarea></div>`}
function insertPhrase(m,path,i){if(i==='')return;const r=cur();r.formulationEdits ||= {};r.formulationEdits[path+'__'+m]=menus[m][+i];save();render()}
function textFor(r,path,base){return [base,...Object.entries(r.formulationEdits||{}).filter(([k,v])=>k.startsWith(path+'__')&&String(v||'').trim()).sort(([a],[b])=>Number(a.split('__').pop())-Number(b.split('__').pop())).map(([,v])=>v)].filter(v=>String(v||'').trim()).join('\n')}
function photos(arrPath,photos){return `<div class="card"><b>Photographies (${photos.length})</b><p class="muted">Ajoutez des photos, puis annotez-les avec des flèches, rectangles ou cercles.</p><input type="file" accept="image/*" multiple onchange="addPhotos(event,'${arrPath}')"><div class="photo-grid">${photos.map((p,i)=>`<div class="photo"><img src="${p.data}"><div class="row">${btn('Annoter',`editPhoto('${arrPath}',${i})`)}${btn('Retirer',`removePhoto('${arrPath}',${i})`,'danger')}</div></div>`).join('')}</div></div>`}function resolve(path){return path.split('.').reduce((a,k)=>a[k],cur())}function addPhotos(e,path){let fs=[...e.target.files];Promise.all(fs.map(f=>new Promise(res=>{let img=new Image(),reader=new FileReader();reader.onload=()=>{img.onload=()=>{let c=document.createElement('canvas'),scale=Math.min(1,1400/img.width,1400/img.height);c.width=img.width*scale;c.height=img.height*scale;c.getContext('2d').drawImage(img,0,0,c.width,c.height);res({data:c.toDataURL('image/jpeg',.78),original:c.toDataURL('image/jpeg',.78),name:f.name})};img.src=reader.result};reader.readAsDataURL(f)}))).then(xs=>{resolve(path).push(...xs);save();render()})}function removePhoto(path,i){resolve(path).splice(i,1);save();render()}
function editPhoto(path,i){editor={path,i,mode:'arrow',start:null,original:resolve(path)[i].data};let p=document.createElement('div');p.id='editmodal';p.style='position:fixed;inset:0;background:#172b34ed;z-index:50;overflow:auto;padding:12px;color:white';p.innerHTML=`<div style="max-width:900px;margin:auto"><h3>Annoter la photo</h3><div class="row">${btn('Flèche',"editor.mode='arrow'",'secondary')}${btn('Rectangle',"editor.mode='rect'",'secondary')}${btn('Cercle',"editor.mode='circle'",'secondary')}${btn('Annuler les traits',"resetCanvas()",'secondary')}${btn('Enregistrer',"saveCanvas()")}${btn('Fermer',"document.getElementById('editmodal').remove()",'danger')}</div><p class="muted">Faites glisser votre doigt ou votre souris sur l'image.</p><canvas id="drawing" style="width:100%;background:white;touch-action:none"></canvas></div>`;document.body.appendChild(p);let im=new Image();im.onload=()=>{let c=document.getElementById('drawing');c.width=im.width;c.height=im.height;c.getContext('2d').drawImage(im,0,0);c.onpointerdown=e=>{let b=c.getBoundingClientRect();editor.start=[(e.clientX-b.left)*c.width/b.width,(e.clientY-b.top)*c.height/b.height];c.setPointerCapture(e.pointerId)};c.onpointerup=e=>{if(!editor.start)return;let b=c.getBoundingClientRect(),x=(e.clientX-b.left)*c.width/b.width,y=(e.clientY-b.top)*c.height/b.height,[sx,sy]=editor.start,ctx=c.getContext('2d');ctx.strokeStyle='#ed2424';ctx.fillStyle='#ed2424';ctx.lineWidth=Math.max(3,c.width/250);if(editor.mode==='rect')ctx.strokeRect(sx,sy,x-sx,y-sy);else if(editor.mode==='circle'){ctx.beginPath();ctx.ellipse((sx+x)/2,(sy+y)/2,Math.max(1,Math.abs(x-sx)/2),Math.max(1,Math.abs(y-sy)/2),0,0,Math.PI*2);ctx.stroke()}else{ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(x,y);ctx.stroke();let a=Math.atan2(y-sy,x-sx),l=ctx.lineWidth*5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-l*Math.cos(a-.55),y-l*Math.sin(a-.55));ctx.lineTo(x-l*Math.cos(a+.55),y-l*Math.sin(a+.55));ctx.closePath();ctx.fill()}editor.start=null}};im.src=editor.original}function resetCanvas(){let im=new Image();im.onload=()=>{let c=document.getElementById('drawing');c.getContext('2d').clearRect(0,0,c.width,c.height);c.getContext('2d').drawImage(im,0,0)};im.src=editor.original}function saveCanvas(){let item=resolve(editor.path)[editor.i];if(!item.original)item.original=editor.original;item.data=document.getElementById('drawing').toDataURL('image/jpeg',.85);save();document.getElementById('editmodal').remove();render()}
const views={home:()=>`<div class="panel"><h2>Dossiers d’intervention</h2><p class="muted">Prototype installable sur iPhone après publication HTTPS. Données locales uniquement : ne pas saisir de dossiers clients réels.</p>${btn('＋ Créer un dossier d’intervention','create()','')}${store.items.map(x=>`<div class="card"><b>${esc(x.ref)} — ${esc(x.address||'Sans adresse')}</b><p class="muted">${esc(x.date)} · ${esc(x.mandant||'Mandant non renseigné')} · ${x.archived?'Archivée':'En cours'}</p>${btn('Ouvrir',`openR(${x.id})`)} ${btn(x.archived?'Archivée':'En cours',`store.current=${x.id};archive()`,'secondary')}</div>`).join('')||'<p>Aucune intervention créée.</p>'}</div>`,identity:r=>`<div class="panel"><h2>Page de garde — lignes facultatives</h2><p class="muted">Décochez une ligne pour la retirer complètement du rapport. Les valeurs saisies restent enregistrées.</p><div class="card"><b>Lignes affichées dans le rapport</b><div class="grid">${COVER_FIELDS.map(([k,l])=>`<label style="font-size:14px"><input type="checkbox" style="width:auto;margin-right:8px" ${coverOn(r)[k]?'checked':''} onchange="toggleCover('${k}',this.checked)">${l}</label>`).join('')}</div></div><div class="grid">${inp('Adresse de l’intervention',r.address,'address')}${inp('Date de l’intervention',r.date,'date','date')}${inp('Nos références',r.ref,'ref')}${inp('Mandant',r.mandant,'mandant')}${inp('Référence devis (facultatif)',r.devis,'devis')}${inp('Référence mandant (facultatif)',r.refmandant,'refmandant')}${inp('Assurance (facultatif)',r.assurance,'assurance')}${inp('Référence assurance (facultatif)',r.refassurance,'refassurance')}${inp('Intervention réalisée par',r.technician,'technician')}</div>${photos('coverPhotos',r.coverPhotos||[])}${btn('Continuer vers les dommages',"go('damage')",'')}</div>`,damage:r=>{let d=r.damage[di];return `<div class="panel"><h2>Dommages</h2><div class="card"><label><input type="checkbox" style="width:auto;margin-right:8px" ${r.declaredEnabled===true?'checked':''} onchange="toggleDeclared(this.checked)">Inclure la rubrique « Dommages déclarés » dans le rapport</label><p class="muted">Décochez pour commencer directement au Dommage n°1. Aucune page vide ne sera créée.</p></div><div class="row">${r.damage.map((x,i)=>btn(esc(x.title),`setD(${i})`,i===di?'active':'secondary'))}</div><div class="row" style="margin-top:10px">${btn('＋ Dommage',"addD(false)")}${btn('＋ Sous-dommage',"addD(true)")}${btn('Supprimer',"delD()",'danger')}</div><div class="heading">${esc(d.title.toUpperCase())}</div>${inp('Titre du dommage',d.title,`damage.${di}.title`)}${r.declaredEnabled===true?ta('Dommage déclaré',d.description,`damage.${di}.description`):'<p class="muted">Rubrique « Dommages déclarés » masquée. Vous commencez directement au Dommage n°1.</p>'}<h3>Visualisation des dommages</h3>${inp('Logement / bâtiment',d.place,`damage.${di}.place`)}${inp('Pièce',d.room,`damage.${di}.room`)}${photos(`damage.${di}.photos`,d.photos)}<h3>Procédé de l’inspection visuelle des dommages — choix de la matrice</h3>${phrase(1,`damage.${di}.visual`)}${phrase(4,`damage.${di}.visual`)}${phrase(5,`damage.${di}.visual`)}${ta('Constatations visuelles — texte libre et modifiable',d.visual,`damage.${di}.visual`)}${btn('Passer aux investigations',"go('investigation')",'')}</div>`},investigation:r=>{let d=r.damage[di],v=d.investigations[ii];return `<div class="panel"><h2>Investigations au droit des dommages</h2><label>Dommage concerné</label><select onchange="di=+this.value;ii=0;render()">${r.damage.map((x,i)=>`<option value="${i}" ${i===di?'selected':''}>${esc(x.title)}</option>`).join('')}</select><div class="row" style="margin-top:12px">${d.investigations.map((x,i)=>btn(`Investigation ${i+1}`,`setI(${i})`,i===ii?'active':'secondary'))}${btn('＋ Ajouter',"addI()")}</div>${inp('Logement / localisation',v.place,`damage.${di}.investigations.${ii}.place`)}${inp('Pièce / zone',v.room,`damage.${di}.investigations.${ii}.room`)}${phrase(8,`damage.${di}.investigations.${ii}.method`)}${ta('Méthode employée',v.method,`damage.${di}.investigations.${ii}.method`)}${photos(`damage.${di}.investigations.${ii}.photos`,v.photos)}${phrase(10,`damage.${di}.investigations.${ii}.observations`)}${ta('Constatations',v.observations,`damage.${di}.investigations.${ii}.observations`)}${btn('Passer à la synthèse',"go('end')",'')}</div>`},end:r=>`<div class="panel"><h2>Rubriques facultatives</h2><p class="muted">Une rubrique décochée n'apparaît pas dans le Word, même si elle contient du texte.</p><div class="card">${SECTIONS.map(([k,l])=>`<label><input type="checkbox" style="width:auto;margin-right:8px" ${sectionOn(r)[k]?'checked':''} onchange="toggleSection('${k}',this.checked)">Inclure : ${l}</label>`).join('')}</div>${phrase(14,'summary')}${ta('Synthèse des constatations',r.summary,'summary')}${phrase(15,'remarks')}${ta('Remarques particulières',r.remarks,'remarks')}${phrase(17,'advice')}${ta('Conseils et préconisations',r.advice,'advice')}${btn('Continuer vers le dossier',"go('files')",'')}</div>`,files:r=>`<div class="panel"><h2>Dossier de l'intervention</h2><p class="muted">Le dossier est créé avant la rédaction. Son futur rapport est présent dès maintenant en brouillon. Ajoutez des photos, notes et fiches de liaison puis ouvrez la présentation.</p><div class="card">📁 Dossier ${esc(r.ref||r.id)}<div style="margin-top:8px">📄 Rapport DLF35 — brouillon<br>📷 Photographies<br>📎 Fiches de liaison<br>📝 Notes internes<br>🕘 Historique (à développer)</div></div>${btn('Rédiger le rapport',"go('identity')",'')}${ta('Notes internes / suivi',r.notes,'notes')}<h3>Fiches de liaison signées et autres pièces</h3><p class="muted">Importer une photo ou un document PDF. Les fichiers sont enregistrés localement pour cette démonstration.</p><input type="file" multiple accept="image/*,application/pdf" onchange="attach(event)"><div>${r.attachments.map((x,i)=>`<div class="card">📎 ${esc(x.name)} ${btn('Supprimer',`cur().attachments.splice(${i},1);save();render()`,'danger')}</div>`).join('')}</div></div>`,preview:r=>`<div class="panel toolbar"><h2>Fin du rapport — aperçus</h2><p class="muted">Aperçu dans l’application. Pour voir le document Word issu de la matrice DLF35, utilisez « Aperçu Word ».</p><div class="row">${btn('Aperçu dans l’application',"go('preview')",'')}${btn('Aperçu Word','previewWordOnIphone()','secondary')}</div></div><div class="panel"><div class="report" id="report">${reportHtml(r)}</div></div>`};
function reportHtml(r){
 const fmt=t=>esc(t||'').replace(/\n/g,'<br>');
 const line=(label,val,key)=>coverOn(r)[key]&&String(val||'').trim()?`<tr><td class="coverlabel">${label}</td><td>${fmt(val)}</td></tr>`:'';
 const pic=ps=>!ps||!ps.length?'':`<table class="photos" cellspacing="0" cellpadding="0"><tbody>${Array.from({length:Math.ceil(ps.length/2)},(_,i)=>`<tr>${[ps[i*2],ps[i*2+1]].map(p=>`<td width="50%">${p?`<img width="285" src="${p.data}" alt="Photographie de l'intervention">`:''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
 const block=(title,body)=>`<div class="report-heading">${title}</div>${body}`;
 const header=`<div class="coverhead"><div class="coverlogos"><img src="logo-dlf35.png" alt="DLF35"><img src="logo-brs.png" alt="Groupe BRS"></div><div class="covercontact">3 rue Jacqueline Auriol – Airparc 3<br>35136 ST JACQUES DE LA LANDE<br><br><b>Tél : 02 96 88 06 86<br>Mail : secretariat@dlf35.com</b></div></div><div class="legal">Sarl au capital de 21.000 €<br>Siren : Rennes B 477 783 393</div>`;
 const cover=`<table class="covertable" cellspacing="0" cellpadding="0">${line('Adresse de l’intervention',r.address,'address')}${line('Date de l’intervention',r.date,'date')}${line('Nos références',r.ref,'ref')}${line('Numéro de devis',r.devis,'devis')}${line('Mandant',r.mandant,'mandant')}${line('Référence mandat',r.refmandant,'refmandant')}${line('Assurance',r.assurance,'assurance')}${line('Référence assurance',r.refassurance,'refassurance')}${line('Intervention réalisée par',r.technician,'technician')}</table>`;
 const declarations=r.damage.filter(d=>String(d.description||'').trim());const declared=r.declaredEnabled===true&&declarations.length?block('DOMMAGES DÉCLARÉS',declarations.map(d=>`<p><b>${fmt(d.title)}</b> : ${fmt(d.description)}</p>`).join('')):'';
 const damage=r.damage.map((d,di)=>{const visual=textFor(r,`damage.${di}.visual`,d.visual);const investigations=(d.investigations||[]).map((v,i)=>{const method=textFor(r,`damage.${di}.investigations.${i}.method`,v.method),obs=textFor(r,`damage.${di}.investigations.${i}.observations`,v.observations);return [v.place,v.room,method,obs,(v.photos||[]).length].some(Boolean)?`<div class="investigation">${v.place||v.room?`<p><u>${fmt([v.place,v.room].filter(Boolean).join(' — '))}</u></p>`:''}${method?`<p>${fmt(method)}</p>`:''}${pic(v.photos)}${obs?`<p>${fmt(obs)}</p>`:''}</div>`:''}).join('');if(![visual,d.place,d.room,investigations,(d.photos||[]).length].some(Boolean))return '';return block(fmt(d.title||`Dommage n°${di+1}`).toUpperCase(),`<h3>Visualisation des dommages</h3>${d.place||d.room?`<p><u>${fmt([d.place,d.room].filter(Boolean).join(' — '))}</u></p>`:''}${pic(d.photos)}${visual?`<p>${fmt(visual)}</p>`:''}${investigations?block('INVESTIGATIONS AU-DROIT DES DOMMAGES',investigations):''}`)}).join('');
 return `<div class="word-report"><div class="report-page coverpage">${header}${block('RAPPORT D’INVESTIGATIONS',cover)}</div><div class="report-page">${block('RECHERCHES DE FUITES',declared+damage)}${sectionOn(r).summary&&r.summary?block('SYNTHÈSE DES CONSTATATIONS',`<p>${fmt(r.summary)}</p>`):''}${sectionOn(r).remarks&&r.remarks?block('REMARQUES PARTICULIÈRES',`<p>${fmt(r.remarks)}</p>`):''}${sectionOn(r).advice&&r.advice?block('CONSEILS ET PRÉCONISATIONS',`<p>${fmt(r.advice)}</p>`):''}<p class="report-footer">Restant à votre disposition pour des renseignements complémentaires.</p></div></div>`;
}
function attach(e){[...e.target.files].forEach(f=>{let rd=new FileReader();rd.onload=()=>{cur().attachments.push({name:f.name,data:rd.result});save();render()};rd.readAsDataURL(f)})}function exportJson(){let blob=new Blob([JSON.stringify(cur(),null,2)],{type:'application/json'});download(blob,`${cur().ref||'intervention'}-dossier.json`)}function download(blob,name){let a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000)}// Véritable document Office Open XML (DOCX), partage natif iOS.
function xmlEscape(v){return String(v??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')}
function crc32(data){let c=-1;for(let b of data){c^=b;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0)}return(c^-1)>>>0}
function zipOffice(entries){const enc=new TextEncoder(),locals=[],central=[];let offset=0;const u16=(v)=>[v&255,(v>>>8)&255],u32=(v)=>[v&255,(v>>>8)&255,(v>>>16)&255,(v>>>24)&255];for(const [name,raw] of entries){const nm=enc.encode(name),dat=typeof raw==='string'?enc.encode(raw):raw,crc=crc32(dat),local=new Uint8Array([...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(dat.length),...u32(dat.length),...u16(nm.length),...u16(0),...nm,...dat]);locals.push(local);central.push(new Uint8Array([...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(dat.length),...u32(dat.length),...u16(nm.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset),...nm]));offset+=local.length}const cdsize=central.reduce((n,a)=>n+a.length,0),end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(entries.length),...u16(entries.length),...u32(cdsize),...u32(offset),...u16(0)]);const parts=[...locals,...central,end],total=parts.reduce((n,a)=>n+a.length,0),out=new Uint8Array(total);let pos=0;for(const a of parts){out.set(a,pos);pos+=a.length}return out}
function wordParagraph(value,style=''){const lines=String(value??'').split(/\n/);return lines.map(t=>`<w:p><w:pPr>${style==='title'?'<w:pStyle w:val="Heading1"/>':style==='subtitle'?'<w:pStyle w:val="Heading2"/>':''}<w:spacing w:after="120"/></w:pPr><w:r><w:t xml:space="preserve">${xmlEscape(t)}</w:t></w:r></w:p>`).join('')}
function docxBytes(r){let parts=[],media=[],rels=[],imageId=1;const para=(text,style)=>{if(String(text??'').trim())parts.push(wordParagraph(text,style))};const image=(photo)=>{let raw=photo?.data||photo?.src||photo?.url||photo;if(typeof raw!=='string'||!raw.startsWith('data:image/'))return;let match=raw.match(/^data:image\/(png|jpeg|jpg);base64,(.*)$/);if(!match)return;let ext=match[1]==='png'?'png':'jpeg',bytes;try{bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0))}catch(e){return}let id=imageId++,filename=`image${id}.${ext}`;media.push([`word/media/${filename}`,bytes]);rels.push(`<Relationship Id="rId${id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/${filename}"/>`);parts.push(`<w:p><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="4300000" cy="2800000"/><wp:docPr id="${id}" name="Photo ${id}"/><a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:nvPicPr><pic:cNvPr id="${id}" name="Photo ${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rId${id}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="4300000" cy="2800000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`)};
const photos=(arr)=>{for(const x of arr||[])image(x)};
para('DLF35 — RAPPORT DE RECHERCHE DE FUITE','title');const cf=coverOn(r);for(const [key,label] of COVER_FIELDS)if(cf[key]&&r[key])para(label+' : '+r[key]);photos(r.coverPhotos);
if(r.declaredEnabled!==false){para('DOMMAGES DÉCLARÉS','title');for(const d of r.damage||[])if(d.description)para(`${d.title} : ${d.description}`)}
for(const d of r.damage||[]){para(d.title||'Dommage','title');para('VISUALISATION DES DOMMAGES','subtitle');para([d.place,d.room].filter(Boolean).join(' — '));photos(d.photos);para(d.visual);for(const v of d.investigations||[]){para('INVESTIGATIONS AU DROIT DES DOMMAGES','subtitle');para([v.place,v.room].filter(Boolean).join(' — '));para(v.method);photos(v.photos);para(v.observations)}}
const sections=sectionOn(r);if(sections.summary&&r.summary){para('SYNTHÈSE DES CONSTATATIONS','title');para(r.summary)}if(sections.remarks&&r.remarks){para('REMARQUES PARTICULIÈRES','title');para(r.remarks)}if(sections.advice&&r.advice){para('CONSEILS ET PRÉCONISATIONS','title');para(r.advice)}
const document=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${parts.join('')}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>`;
const contentTypes=`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;
const entries=[['[Content_Types].xml',contentTypes],['_rels/.rels',`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`],['word/document.xml',document],['word/_rels/document.xml.rels',`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${rels.join('')}</Relationships>`],...media];return zipOffice(entries)}
// V12: genuine original DLF35 Word matrix, with its existing logos, styles and cover tables.
function readStoredDocx(bytes){const entries=[];const dv=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);let p=0,dec=new TextDecoder();while(p+30<bytes.length&&dv.getUint32(p,true)===0x04034b50){let flags=dv.getUint16(p+6,true),method=dv.getUint16(p+8,true),size=dv.getUint32(p+18,true),nl=dv.getUint16(p+26,true),xl=dv.getUint16(p+28,true);if(flags&8||method!==0)throw Error('Format de matrice non pris en charge');let name=dec.decode(bytes.subarray(p+30,p+30+nl)),begin=p+30+nl+xl;entries.push([name,bytes.slice(begin,begin+size)]);p=begin+size}return entries}
function docxFromMatrix(r,entries){
 const enc=new TextEncoder(),dec=new TextDecoder(),map=new Map(entries),NS='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
 const doc=new DOMParser().parseFromString(dec.decode(map.get('word/document.xml')),'application/xml');
 if(doc.querySelector('parsererror'))throw Error('Matrice Word XML invalide');
 const els=(node,tag)=>Array.from(node.getElementsByTagNameNS(NS,tag));
 const body=els(doc,'body')[0],tables=Array.from(body.children).filter(n=>n.localName==='tbl');
 if(tables.length<10)throw Error('Matrice originale incomplète');
 const element=(tag)=>doc.createElementNS(NS,'w:'+tag);
 const text=node=>els(node,'t').map(x=>x.textContent).join('');
 const clearControls=node=>{for(const sdt of [...els(node,'sdt')].reverse())if(sdt.parentNode)sdt.parentNode.removeChild(sdt)};
 const setCell=(cell,value,keepLabel=false)=>{
   clearControls(cell);
   const ps=els(cell,'p');let p=ps[0];if(!p){p=element('p');cell.appendChild(p)}
   if(!keepLabel){for(const t of els(cell,'t'))t.textContent='';}
   const valueString=String(value??'').trim();if(!valueString)return;
   const lines=valueString.split(/\n/);
   lines.forEach((line,i)=>{
     const target=i===0?p:p.cloneNode(false);
     if(i>0)cell.appendChild(target);
     const run=element('r'),rpr=element('rPr'),font=element('rFonts');
     font.setAttributeNS(NS,'w:ascii','Arial');font.setAttributeNS(NS,'w:hAnsi','Arial');rpr.appendChild(font);
     const sz=element('sz');sz.setAttributeNS(NS,'w:val','20');rpr.appendChild(sz);run.appendChild(rpr);
     const t=element('t');t.setAttribute('xml:space','preserve');t.textContent=(keepLabel&&i===0?'  ':'')+line;run.appendChild(t);target.appendChild(run);
   });
 };
 // Cover is rebuilt from the validated white-cell Word table, not overlaid on old text.
 const cover=tables[2],rows=els(cover,'tr');
 const coverItems=[['Adresse de l’intervention :','address',true],['Date de l’intervention :','date',true],['Nos références :','ref',true],['Référence devis :','devis',false],['Mandant :','mandant',false],['Référence mandant :','refmandant',false],['Assurance :','assurance',false],['Référence assurance :','refassurance',false],['Intervention réalisée par :','technician',true]];
 const prototype=rows.find(row=>Array.from(row.children).filter(n=>n.localName==='tc').length===2);
 if(!prototype)throw Error('Aucune ligne à deux colonnes dans la matrice');
 const templateRow=prototype.cloneNode(true);
 for(const row of rows)row.parentNode.removeChild(row);
 for(const [label,key,required] of coverItems){
   const enabled=required||coverOn(r)[key]!==false;
   const value=String(r[key]||'').trim();
   if(!enabled||(!required&&!value))continue;
   const row=templateRow.cloneNode(true);
   const cells=Array.from(row.children).filter(n=>n.localName==='tc');
   setCell(cells[0],label);setCell(cells[1],key==='date'&&/^\d{4}-\d{2}-\d{2}$/.test(value)?value.slice(8,10)+'/'+value.slice(5,7)+'/'+value.slice(0,4):value);
   for(const cell of cells){
     for(const shd of els(cell,'shd'))shd.parentNode.removeChild(shd);
     for(const child of Array.from(cell.children))if(child.localName==='tcPr'){
       for(const shd of els(child,'shd'))shd.parentNode.removeChild(shd);const white=element('shd');white.setAttributeNS(NS,'w:fill','FFFFFF');child.appendChild(white);
     }
   }
   cover.appendChild(row);
 }
 // Remove all source-only content after RECHERCHES DE FUITES. The original
 // photograph placeholders, Word instructions and unused sample text must not leak.
 const sourceHeader=tables[4],sourceInv=tables[6];
 // Supprimer les cadres photographiques/paragraphes parasites de la page de garde.
 let coverNode=cover.nextSibling;while(coverNode&&coverNode!==tables[3]){let next=coverNode.nextSibling;if(coverNode.nodeType===1)body.removeChild(coverNode);coverNode=next}

 const section=Array.from(body.children).find(n=>n.localName==='sectPr');
 let node=tables[3].nextSibling;while(node&&node!==section){const next=node.nextSibling;body.removeChild(node);node=next}
 const add=node=>body.insertBefore(node,section||null);
 // La première page reste indépendante des dommages, même lorsque le contenu est court.
 const pageStart=element('p'),pagePr=element('pPr'),pageBreak=element('pageBreakBefore');pagePr.appendChild(pageBreak);pageStart.appendChild(pagePr);body.insertBefore(pageStart,tables[3]);
 const addParagraph=(value)=>{
   if(!String(value||'').trim())return;
   for(const line of String(value).split(/\n/)){
     if(!line.trim())continue;
     const p=element('p'),ppr=element('pPr'),spacing=element('spacing');
     spacing.setAttributeNS(NS,'w:after','85');ppr.appendChild(spacing);const widow=element('widowControl');ppr.appendChild(widow);p.appendChild(ppr);
     const run=element('r'),rpr=element('rPr'),font=element('rFonts');
     font.setAttributeNS(NS,'w:ascii','Arial');font.setAttributeNS(NS,'w:hAnsi','Arial');rpr.appendChild(font);
     const size=element('sz');size.setAttributeNS(NS,'w:val','18');rpr.appendChild(size);run.appendChild(rpr);
     const t=element('t');t.setAttribute('xml:space','preserve');t.textContent=line;run.appendChild(t);p.appendChild(run);add(p);
   }
 };
 const banner=(source,label,newPage=false)=>{
   const table=source.cloneNode(true);
   const ts=els(table,'t');if(ts.length){ts[0].textContent=label;for(const t of ts.slice(1))t.textContent=''}
   clearControls(table);const separator=element('p');add(separator);if(newPage){const first=els(table,'p')[0];if(first){let ppr=els(first,'pPr')[0];if(!ppr){ppr=element('pPr');first.insertBefore(ppr,first.firstChild)}ppr.appendChild(element('pageBreakBefore'));}}add(table);
 };
 const relPath='word/_rels/document.xml.rels',relNS='http://schemas.openxmlformats.org/package/2006/relationships';
 const relDoc=new DOMParser().parseFromString(dec.decode(map.get(relPath)),'application/xml');
 const relRoot=relDoc.documentElement;let nextRel=1;for(const el of Array.from(relRoot.children)){const m=(el.getAttribute('Id')||'').match(/^rId(\d+)$/);if(m)nextRel=Math.max(nextRel,+m[1]+1)}
 let photoNumber=0;
 const addPhoto=(photo)=>{
   const match=String(photo?.data||'').match(/^data:image\/(png|jpeg|jpg);base64,([\s\S]+)$/);
   if(!match)return null;
   const ext=match[1]==='png'?'png':'jpeg';let bytes;
   try{bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0))}catch{return null}
   const id=++photoNumber,rid='rId'+nextRel++,target='dlf35-photo-'+id+'.'+ext;
   map.set('word/media/'+target,bytes);
   const rel=relDoc.createElementNS(relNS,'Relationship');
   rel.setAttribute('Id',rid);rel.setAttribute('Type','http://schemas.openxmlformats.org/officeDocument/2006/relationships/image');
   rel.setAttribute('Target','media/'+target);relRoot.appendChild(rel);
   const xml=`<w:p xmlns:w="${NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:pPr><w:keepTogether/><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="3300000" cy="2450000"/><wp:docPr id="${id+500}" name="Photographie ${id}"/><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${id+500}" name="Photographie ${id}"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="3300000" cy="2450000"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`;
   return doc.importNode(new DOMParser().parseFromString(xml,'application/xml').documentElement,true);
 };
 const addPhotos=(photos)=>{
   const nodes=(photos||[]).map(addPhoto).filter(Boolean);
   if(!nodes.length)return;
   const tbl=element('tbl'),pr=element('tblPr'),width=element('tblW');
   width.setAttributeNS(NS,'w:w','9500');width.setAttributeNS(NS,'w:type','dxa');pr.appendChild(width);
   const borders=element('tblBorders');
   for(const side of ['top','bottom','left','right','insideH','insideV']){const b=element(side);b.setAttributeNS(NS,'w:val','nil');borders.appendChild(b)}
   pr.appendChild(borders);tbl.appendChild(pr);
   const grid=element('tblGrid');
   for(let i=0;i<2;i++){const col=element('gridCol');col.setAttributeNS(NS,'w:w','4750');grid.appendChild(col)}
   tbl.appendChild(grid);
   for(let i=0;i<nodes.length;i+=2){
     const tr=element('tr');
     for(let j=0;j<2;j++){
       const tc=element('tc'),tcPr=element('tcPr'),tcW=element('tcW');
       tcW.setAttributeNS(NS,'w:w','4750');tcW.setAttributeNS(NS,'w:type','dxa');tcPr.appendChild(tcW);tc.appendChild(tcPr);
       tc.appendChild(nodes[i+j]||element('p'));tr.appendChild(tc);
     }
     tbl.appendChild(tr);
   }
   add(tbl);
 };
 const damages=r.damage||[];
 if(r.declaredEnabled===true){
   const descriptions=damages.map(d=>d.description).filter(x=>String(x||'').trim());
   if(descriptions.length){addParagraph('Dommages déclarés :');for(const v of descriptions)addParagraph(v)}
 }
 for(let di=0;di<damages.length;di++){
   const d=damages[di];
   const visual=textFor(r,`damage.${di}.visual`,d.visual);
   const invs=(d.investigations||[]).map((v,i)=>({v,i,method:textFor(r,`damage.${di}.investigations.${i}.method`,v.method),observations:textFor(r,`damage.${di}.investigations.${i}.observations`,v.observations)}))
     .filter(x=>[x.method,x.observations,x.v.place,x.v.room].some(y=>String(y||'').trim())||(x.v.photos||[]).length);
   if(![visual,d.place,d.room].some(x=>String(x||'').trim())&&!(d.photos||[]).length&&!invs.length)continue;
   banner(sourceHeader,d.title||`Dommage n°${di+1}`);
   addParagraph([d.place,d.room].filter(Boolean).join(' — '));
   if(visual||(d.photos||[]).length){addParagraph('Visualisation des dommages :');addPhotos(d.photos);addParagraph(visual)}
   // Never retain blank blue picture placeholders. Actual image placement in
   // matrix cells requires a separate relationship-preserving image engine.
   // Les photos ne sont pas encore exportées dans cet essai : ne pas inventer de contenu.
   if(invs.length){banner(sourceInv,'INVESTIGATIONS\nAU-DROIT DES DOMMAGES',true);
     for(const {v,method,observations} of invs){
       addParagraph([v.place,v.room].filter(Boolean).join(' — '));addParagraph(method);addPhotos(v.photos);addParagraph(observations);
       // Aucun emplacement de photo vide n'est ajouté.
     }
   }
 }
 const sec=sectionOn(r);
 if(sec.summary&&String(r.summary||'').trim()){banner(tables[8],'SYNTHÈSE DES CONSTATATIONS');addParagraph(textFor(r,'summary',r.summary))}
 if(sec.remarks&&String(r.remarks||'').trim()){banner(tables[9],'Remarque(s) particulière(s)');addParagraph(textFor(r,'remarks',r.remarks))}
 if(sec.advice&&String(r.advice||'').trim())addParagraph('Conseils : '+textFor(r,'advice',r.advice));
 map.set('word/document.xml',enc.encode(new XMLSerializer().serializeToString(doc)));map.set(relPath,enc.encode(new XMLSerializer().serializeToString(relDoc)));
 return zipOffice([...map.entries()]);
}
let matrixPromise=null;async function wordFile(){const r=cur();if(!r){alert('Créez d’abord un dossier.');return null}if(!matrixPromise)matrixPromise=fetch('./matrice-dlf35.docx').then(x=>{if(!x.ok)throw Error('Matrice Word introuvable : '+x.status);return x.arrayBuffer()}).then(b=>readStoredDocx(new Uint8Array(b))).catch(e=>{matrixPromise=null;throw e});const entries=await matrixPromise;return new File([docxFromMatrix(r,entries)],`${(r.ref||'Rapport').replace(/[^a-z0-9_-]/gi,'_')}-DLF35.docx`,{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})}
function wordShareStatus(message){
 let el=document.getElementById('word-share-status');
 if(!el){el=document.createElement('div');el.id='word-share-status';el.setAttribute('role','status');el.style.cssText='position:fixed;bottom:14px;left:12px;right:12px;z-index:9999;background:#fff;border:2px solid #166b85;border-radius:12px;padding:16px;box-shadow:0 3px 24px #0004;max-width:650px;margin:auto;white-space:pre-wrap';document.body.appendChild(el)}
 el.textContent=message+'\n';let b=document.createElement('button');b.textContent='Fermer';b.style.marginTop='12px';b.onclick=()=>el.remove();el.appendChild(b)
}
async function openInWord(){
 // The only path from this button is the OS share sheet. No anchor, download or redirect.
 let file;
 try{file=await wordFile()}catch(e){wordShareStatus('Erreur de génération DOCX : '+e.message);return}
 if(!file)return;
 const data={files:[file],title:'Rapport DLF35',text:'Ouvrir le rapport DLF35 dans Microsoft Word'};
 if(!navigator.share){wordShareStatus('Le partage de fichiers n’est pas disponible dans ce navigateur. Aucun téléchargement lancé. Essayez Safari sur iPhone.');return}
 if(navigator.canShare && !navigator.canShare({files:[file]})){wordShareStatus('iOS refuse le partage de ce fichier ('+Math.round(file.size/1024)+' Ko). Aucun téléchargement lancé. Le bouton de copie reste disponible séparément.');return}
 try{document.getElementById('word-share-status')?.remove();await navigator.share(data)}
 catch(e){if(e.name==='AbortError'){document.getElementById('word-share-status')?.remove();return}wordShareStatus('Partage impossible : '+e.name+' — '+e.message+'\nAucun téléchargement automatique. Le navigateur décide quelles applications sont proposées.')} 
}
// Experimental local preview: iOS may preview a DOCX Blob URL or download it.
// A reliable iOS Quick Look page requires an HTTPS-served DOCX with correct headers.
async function previewWordOnIphone(){
 let tab=null;
 try{
  // Open during the click gesture to avoid popup blockers on iOS.
  tab=window.open('about:blank','_blank');
  const file=await wordFile();if(!file){if(tab)tab.close();return}
  const url=URL.createObjectURL(file);
  if(tab){tab.location.replace(url)}
  else{wordShareStatus('Le navigateur a bloqué le nouvel onglet. Autorisez les fenêtres surgissantes, ou utilisez « Ouvrir directement dans Word ».');URL.revokeObjectURL(url);return}
  // Do not revoke immediately: iOS needs time to read the Blob.
  setTimeout(()=>URL.revokeObjectURL(url),120000);
 }catch(e){if(tab)tab.close();wordShareStatus('Aperçu impossible : '+e.message+'\nSur certains iPhone, les URL locales DOCX provoquent un téléchargement. L’aperçu exact de la capture nécessite un document servi depuis une URL HTTPS.');}
}
async function exportWord(){try{const file=await wordFile();if(file)download(file,file.name)}catch(e){wordShareStatus("Erreur Word : "+e.message)}}
render();
