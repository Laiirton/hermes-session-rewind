import{host as Ir,KEYBINDS_AREA as Mr,PALETTE_AREA as Lr,ROUTES_AREA as Dr,SIDEBAR_NAV_AREA as $r,STATUSBAR_AREAS as Fr}from"@hermes/plugin-sdk";import{host as Re,useValue as or}from"@hermes/plugin-sdk";var oe="/rewind";import{jsx as ar,jsxs as ir}from"react/jsx-runtime";function Ce(){let e=or(Re.state.activeSessionId);return ir("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{Re.navigate(oe)},title:"Open Session Rewind",children:[ar("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as wr,useValue as yr}from"@hermes/plugin-sdk";import{useEffect as Z,useRef as kr,useState as v}from"react";function le(e,r,a){return e.rest(r,{method:"POST",body:a})}var xe=100;async function Pe(e){return(await e.rest(`/sessions?limit=${xe}`)).items}async function he(e,r,a=null){let p=a===null?"":`&before_seq=${a}`;return e.rest(`/sessions/${encodeURIComponent(r)}/turns?limit=40${p}`)}async function Te(e,r,a,p){return(await e.rest(`/sessions/${encodeURIComponent(r)}/events?limit=200&after_seq=${a-1}&before_seq=${p+1}`)).items}function Ee(e,r){return e.rest(`/events/${r}`)}function ze(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/snapshots`)}function Ie(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/branches`)}function Me(e,r){return le(e,`/branches/${encodeURIComponent(r)}/reconcile`,{})}function Le(e,r,a,p=null){let u=p===null?"":`&before_ts=${p}`;return e.rest(`/compare?left=${encodeURIComponent(r)}&right=${encodeURIComponent(a)}${u}`)}function De(e,r){return le(e,"/forks/prepare",r)}function $e(e,r,a){return le(e,`/forks/${encodeURIComponent(r)}/commit`,a)}function Fe(e,r){return le(e,`/forks/${encodeURIComponent(r)}/verify`,{})}function Ae(e,r,a){return e.rest(`/branches/${encodeURIComponent(r)}/verify-resolve?cmd=${encodeURIComponent(a)}`)}function qe(e,r){return e.rest(`/forks/${encodeURIComponent(r)}/workspace`)}function we(e,r){return le(e,`/forks/${encodeURIComponent(r)}/cleanup`,{})}function ue(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function de(e){return e.toLocaleString()}function me(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var sr=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function T(e){let r=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",a=sr.exec(r),p=a?.[1];if(a===null||p===void 0)return r;let u=lr(p);return u===void 0?r:r.replace(a[0],u)}function lr(e){try{let r=JSON.parse(e);return typeof r.detail=="string"&&r.detail.length>0?r.detail:void 0}catch{return}}function X(e,r=8){return e.length<=r?e:e.slice(0,r)}function M(e,r){return`${e} ${e===1?r:`${r}s`}`}function ye(e){return e===0?"passed":`failed (exit ${e})`}var ur={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function fe(e){return e===null?"recording":ur[e]??e}function ke(e){return e===null?"warn":e==="completed"?"ok":e==="failed"?"err":"idle"}function Be(e){return e===null?"open at freeze":fe(e)}function He(e,r){return e===0?"":e>=r?`${r}+`:`${e}`}function dr(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Oe(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${dr(e)}`}function Ve(e,r){return r!==null?`The turns could not be loaded: ${r}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${M(e,"event")} but no user turn.`}function Ue(e){return e===null?"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.":`This workspace holds ${M(e,"uncommitted file")}. Deleting it removes them for good; the rerun conversation stays in the recording.`}import{host as G}from"@hermes/plugin-sdk";import{useCallback as mr,useEffect as ge,useRef as _e,useState as Y}from"react";function cr(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let r=e.content;return typeof r=="string"?r.trim():Array.isArray(r)?r.map(a=>{if(typeof a!="object"||a===null||!("text"in a))return"";let p=a.text;return typeof p=="string"?p:""}).join("").trim():""}function We(e,r){let a=(e??[]).filter(d=>(d.role==="user"||d.role==="assistant")&&cr(d).length>0&&typeof d.row_id=="number"),p=-1;for(let d=0;d<a.length;d+=1){let I=a[d];if(I===void 0)continue;let s=I.timestamp;I.role==="user"&&typeof s=="number"&&s<=r+.5&&(p=d)}if(p<=0)return null;let u=a[p-1]?.row_id;return typeof u=="number"&&u>0?u:null}import{jsx as Ke}from"react/jsx-runtime";var pr={rewind:"M3 12a9 9 0 1 0 3-6.7M3 4v5h5",refresh:"M20 11a8 8 0 0 0-14 5l-2 2M4 13a8 8 0 0 0 14-5l2-2",branch:"M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0-3-3M15 9v3a3 3 0 0 0 3 3h3",lock:"M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",folder:"M3 7h6l2 2h10v11H3z",close:"M5 5l14 14M19 5L5 19",chevron:"M9 6l6 6-6 6",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01"};function L({name:e,size:r=14,className:a}){return Ke("svg",{"aria-hidden":"true",className:a,viewBox:"0 0 24 24",width:r,height:r,fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round",focusable:"false",children:Ke("path",{d:pr[e]})})}import{Fragment as hr,jsx as c,jsxs as h}from"react/jsx-runtime";var fr=["python -m pytest -q","npm test","cargo test","go test ./..."],gr=350;function ce(e,r){return r.catch(a=>{throw new Error(`${e}: ${T(a)}`)})}function vr(e){if(e===null)return[];let r=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(r).filter(a=>!a.hasAttribute("disabled"))}function br(e,r){let a=vr(e),p=a[0],u=a[a.length-1];if(e===null||p===void 0||u===void 0)return;let d=document.activeElement;if(!e.contains(d)){r.preventDefault(),p.focus();return}r.shiftKey&&d===p?(r.preventDefault(),u.focus()):!r.shiftKey&&d===u&&(r.preventDefault(),p.focus())}var xr=`
.rw-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal-backdrop, 120);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 28px 20px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(0.125rem);
  animation: rw-fade 140ms ease-out;
}
.rw-overlay[data-closing="true"] {
  animation: rw-fade 100ms ease-in reverse;
}
.rw-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(560px, 100%);
  max-height: calc(100vh - 56px);
  margin: auto 0;
  overflow: hidden;
  color: var(--ui-text-primary);
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: calc(var(--radius-scalar, 0.2) * 1rem);
  box-shadow: var(--shadow-md);
  animation: rw-rise 180ms cubic-bezier(0.22, 1, 0.36, 1);
}
.rw-overlay[data-closing="true"] .rw-panel {
  animation: rw-rise 100ms ease-in reverse;
}
@keyframes rw-fade {
  from {
    opacity: 0;
  }
}
@keyframes rw-rise {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.985);
  }
}
@media (prefers-reduced-motion: reduce) {
  .rw-overlay,
  .rw-panel,
  .rw-overlay[data-closing="true"],
  .rw-overlay[data-closing="true"] .rw-panel {
    animation: none;
  }
}
.rw-head {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  padding: 18px 48px 14px 18px;
}
.rw-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: var(--ui-accent);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .625rem);
}
.rw-heading {
  min-width: 0;
}
.rw-eyebrow {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-accent);
}
.rw-title {
  margin-top: 3px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.rw-panel .rw-close {
  position: absolute;
  top: 16px;
  right: 14px;
  z-index: 1;
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  color: var(--ui-text-tertiary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out;
}
.rw-panel .rw-close:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
}
.rw-panel .rw-close:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-panel:focus-visible {
  outline: none;
}
.rw-panel .rw-button:focus-visible,
.rw-panel .rw-close:focus-visible,
.rw-panel .rw-preset:focus-visible,
.rw-panel .rw-icon-button:focus-visible {
  outline: 2px solid var(--ui-stroke-primary);
  outline-offset: 2px;
}
.rw-input:focus-visible,
.rw-textarea:focus-visible {
  outline: none;
}
.rw-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 0 18px 18px;
  overflow-y: auto;
}
.rw-turn {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
  padding: 8px 10px;
  font-size: 12px;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rw-turn-time {
  flex: none;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-secondary);
}
.rw-turn-text {
  overflow: hidden;
  color: var(--ui-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rw-notes {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.rw-note {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--ui-text-secondary);
}
.rw-note svg {
  flex: none;
  margin-top: 2px;
  color: var(--ui-text-tertiary);
}
.rw-note-warn {
  color: var(--ui-yellow);
}
.rw-note-warn svg {
  color: var(--ui-yellow);
}
.rw-path {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  margin-top: 2px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rw-path-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: rtl;
  text-align: left;
}
.rw-panel .rw-icon-button {
  flex: none;
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  color: var(--ui-text-tertiary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out;
}
.rw-panel .rw-icon-button:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
}
.rw-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.rw-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.rw-label-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}
.rw-label {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
}
.rw-count {
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-variant-numeric: tabular-nums;
  font-size: 10px;
  color: var(--ui-text-tertiary);
}
.rw-input,
.rw-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 8px 10px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text-primary);
  outline: none;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: border-color 120ms ease-out, box-shadow 120ms ease-out;
}
.rw-input {
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
}
.rw-input:focus,
.rw-textarea:focus {
  border-color: var(--ui-stroke-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-stroke-primary) 20%, transparent);
}
.rw-textarea {
  min-height: 132px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  line-height: 1.55;
  resize: vertical;
}
.rw-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.rw-panel .rw-preset {
  padding: 3px 8px;
  font: inherit;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  color: var(--ui-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rw-panel .rw-preset:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
  border-color: var(--ui-stroke-secondary);
}
.rw-panel .rw-preset[aria-pressed="true"] {
  color: var(--ui-text-primary);
  background: color-mix(in srgb, var(--ui-accent) 14%, transparent);
  border-color: var(--ui-stroke-primary);
}
.rw-help {
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-text-tertiary);
}
.rw-resolved {
  display: flex;
  flex-direction: column;
  gap: 1px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 10px;
  line-height: 1.5;
  color: var(--ui-text-tertiary);
}
.rw-resolved-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  direction: rtl;
  text-align: left;
}
.rw-banner {
  padding: 9px 11px;
  font-size: 12px;
  line-height: 1.5;
  border: 1px solid transparent;
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rw-banner-warn {
  color: var(--ui-yellow);
  background: color-mix(in srgb, var(--ui-yellow) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-yellow) 30%, transparent);
}
.rw-banner-error {
  color: var(--ui-red);
  background: color-mix(in srgb, var(--ui-red) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-red) 30%, transparent);
}
.rw-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 13px 18px;
  background: var(--ui-bg-card);
  border-top: 1px solid var(--ui-stroke-tertiary);
}
.rw-reassure {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  font-size: 11px;
  line-height: 1.4;
  color: var(--ui-text-tertiary);
}
.rw-reassure .rw-icon {
  flex: none;
  color: var(--ui-green);
}
.rw-actions {
  display: flex;
  flex: none;
  gap: 8px;
}
.rw-panel .rw-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text-primary);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rw-panel .rw-button:hover:not(:disabled) {
  background: var(--ui-control-hover-background);
}
.rw-panel .rw-button:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-panel .rw-primary {
  font-weight: 600;
  color: var(--dt-primary-foreground, #fcfcfc);
  background: var(--dt-primary, var(--ui-accent));
  border-color: transparent;
}
.rw-panel .rw-primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--dt-primary, var(--ui-accent)) 88%, var(--ui-base));
}
.rw-kbd {
  padding: 1px 5px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 10px;
  line-height: 1.5;
  color: color-mix(in srgb, var(--dt-primary-foreground, #fcfcfc) 78%, transparent);
  background: color-mix(in srgb, var(--dt-primary-foreground, #fcfcfc) 18%, transparent);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rw-spinner {
  width: 12px;
  height: 12px;
  border: 2px solid color-mix(in srgb, var(--dt-primary-foreground, #fcfcfc) 35%, transparent);
  border-top-color: var(--dt-primary-foreground, #fcfcfc);
  border-radius: 999px;
  animation: rw-spin 700ms linear infinite;
}
@keyframes rw-spin {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  .rw-spinner {
    animation-duration: 2.4s;
  }
}
@media (max-width: 520px) {
  .rw-overlay {
    padding: 12px;
  }
  .rw-panel {
    max-height: calc(100vh - 24px);
  }
  .rw-grid {
    grid-template-columns: 1fr;
  }
  .rw-footer {
    align-items: flex-start;
    flex-direction: column;
  }
  .rw-actions {
    width: 100%;
  }
  .rw-actions .rw-button {
    flex: 1;
    justify-content: center;
  }
}
`;function je({ctx:e,session:r,event:a,onClose:p,onCreated:u}){let[d,I]=Y(r.model??""),[s,F]=Y(""),[w,x]=Y(""),[m,E]=Y(null),[y,z]=Y(null),[C,V]=Y(null),[J,A]=Y(null),[k,_]=Y(null),[U,ae]=Y(!1),ee=_e([]),l=C!==null,N=_e(null),q=_e(()=>{}),D=mr(()=>{l||(ae(!0),ee.current.push(e.setTimeout(p,100)))},[l,e,p]);ge(()=>{let i=ee.current;return()=>{for(let f of i)f()}},[]),ge(()=>{let i=document.activeElement;return N.current?.focus(),()=>{i?.focus()}},[]),ge(()=>{let i=f=>{if(f.key==="Escape"&&!l){D();return}if(f.key==="Tab"){br(N.current,f);return}f.key==="Enter"&&(f.metaKey||f.ctrlKey)&&!l&&(f.preventDefault(),q.current())};return window.addEventListener("keydown",i),()=>{window.removeEventListener("keydown",i)}},[l,D]),ge(()=>{let i=w.trim();if(m===null||i===""){z(null);return}let f=!1,H=e.setTimeout(()=>{Ae(e,m.branch_id,i).then(S=>{f||z(S)}).catch(()=>{f||z(null)})},gr);return()=>{f=!0,H()}},[e,m,w]);let R=async()=>{let i=await G.request("session.active_list",{}),f=Array.isArray(i.sessions)?i.sessions:[],H=f.find(S=>S.session_key===r.session_id)?.id??f.find(S=>S.id===r.session_id)?.id;if(H===void 0)return{runtimeId:void 0,storedId:r.stored_session_id};try{let S=await G.request("session.title",{session_id:H});return{runtimeId:H,storedId:S.session_key??r.stored_session_id}}catch{return{runtimeId:H,storedId:r.stored_session_id}}},re=async()=>{V("prepare"),A(null),_(null);try{let i=await R(),f=await De(e,{session_id:r.session_id,stored_session_id:i.storedId,event_id:a.id,model:d.trim()||null,provider:null,prompt:s.trim()||null,verify_cmd:w.trim()||null});E(f),F(f.prompt),f.verify_presets.length>0&&w.trim()===""&&x(f.verify_presets[0]??""),f.model!==null&&I(f.model)}catch(i){A(T(i))}finally{V(null)}},te=async()=>{if(m!==null){V("run"),A(null),_(null);try{let i=await R(),f=i.runtimeId,H=`\u21BA ${r.title??X(r.session_id)} \xB7 ${X(m.branch_id)}`,S=null;if(f!==void 0)try{let P=await G.request("session.history",{session_id:f});S=We(P.messages,m.fork_before_ts)}catch{S=null}let Q,K,b=!1;if(S!==null&&f!==void 0){let P=await ce("could not branch the session",G.request("session.branch",{session_id:f,through_message_id:S}));Q=P.session_id,K=P.stored_session_id}else{let P={source:"desktop",title:H};m.worktree_path!==null&&(P.cwd=m.worktree_path),i.storedId!==null&&(P.parent_session_id=i.storedId);let $=await ce("could not create the branch session",G.request("session.create",P));Q=$.session_id,K=$.stored_session_id,b=!0}if(b&&m.worktree_path!==null){let P=()=>G.request("session.cwd.set",{session_id:Q,cwd:m.worktree_path});try{await ce("could not attach the isolated workspace",P())}catch($){throw $ instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${T($)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(d.trim()&&d.trim()!==(r.model??""))try{let P=await G.request("config.set",{key:"model",value:d.trim(),session_id:Q,confirm_expensive_model:!1});P.confirm_required===!0&&_(P.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{_("The branch was created, but the model switch failed; the rerun uses the current model.")}let ie=s.trim()||m.prompt;await ce("could not record the branch",$e(e,m.branch_id,{child_session_id:Q,child_stored_session_id:K,model:d.trim()||null,provider:null,prompt:ie,verify_cmd:w.trim()||null})),await ce("could not start the rerun",G.request("prompt.submit",{session_id:Q,text:ie})),u(m.branch_id),G.openSession(K,{intent:"tab"}),p()}catch(i){A(T(i))}finally{V(null)}}};q.current=()=>{m===null?re():te()};let B=m!==null,pe=w.trim(),W=[];return B?(m.fidelity!=="full"&&W.push({warn:!0,text:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}),m.context_rows===null&&W.push({warn:!0,text:"The live transcript prefix is unavailable. The context pack is the only context."}),r.ended_at!==null&&W.push({warn:!1,text:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}),m.fork_row_count===0&&r.ended_at===null&&W.push({warn:!1,text:"This is the first turn. The rerun starts a fresh chat in the restored workspace."})):W.push({warn:!1,text:"Prepare reads the recorded context for this turn and drafts the rerun prompt. Nothing runs until you fork."}),h("div",{className:"rw-overlay","data-closing":U?"true":"false",onMouseDown:i=>{i.target===i.currentTarget&&D()},children:[c("style",{children:xr}),h("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title","aria-describedby":"rw-reassure",tabIndex:-1,ref:N,children:[h("header",{className:"rw-head",children:[c("span",{className:"rw-mark",children:c(L,{name:"rewind",size:16})}),h("div",{className:"rw-heading",children:[c("div",{className:"rw-eyebrow",children:"Session Rewind"}),c("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"})]}),c("button",{type:"button",className:"rw-close",onClick:D,disabled:l,"aria-label":"Close",children:c(L,{name:"close",size:15})})]}),h("div",{className:"rw-body",children:[h("div",{className:"rw-turn",children:[c("span",{className:"rw-turn-time",children:ue(a.ts)}),c("span",{className:"rw-turn-text",children:a.preview||"user turn"})]}),J!==null?c("div",{className:"rw-banner rw-banner-error",role:"alert",children:J}):null,k!==null?c("div",{className:"rw-banner rw-banner-warn",role:"status",children:k}):null,B&&m.worktree_path?h("div",{className:"rw-path",children:[c("span",{className:"rw-path-text",title:m.worktree_path,children:m.worktree_path}),c("button",{type:"button",className:"rw-icon-button",onClick:()=>{e.os.revealPath(m.worktree_path??"")},disabled:l,"aria-label":"Reveal the isolated workspace",children:c(L,{name:"folder",size:13})})]}):null,W.length>0?c("div",{className:"rw-notes",children:W.map(i=>h("div",{className:`rw-note${i.warn?" rw-note-warn":""}`,role:i.warn?"status":void 0,children:[c(L,{name:"info"}),c("span",{children:i.text})]},i.text))}):null,h("div",{className:"rw-grid",children:[h("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Model"}),c("input",{className:"rw-input",value:d,onChange:i=>{I(i.target.value)},placeholder:"provider/model"}),c("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),h("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Verify command"}),c("input",{className:"rw-input",value:w,onChange:i=>{x(i.target.value)},placeholder:"python -m pytest -q"}),c("div",{className:"rw-chips",children:(m?.verify_presets.length?m.verify_presets:fr).map(i=>c("button",{type:"button",className:"rw-preset","aria-pressed":i===pe,onClick:()=>{x(i)},disabled:l,children:i},i))}),c("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),y!==null&&y.command===w.trim()?c("span",{className:"rw-resolved",children:y.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":h(hr,{children:[c("span",{children:"Resolves to"}),c("span",{className:"rw-resolved-path",title:y.resolved,children:y.resolved})]})}):null]})]}),h("label",{className:"rw-field",children:[h("span",{className:"rw-label-row",children:[c("span",{className:"rw-label",children:"Prompt for the rerun"}),h("span",{className:"rw-count","aria-live":"polite",children:[s.length," chars"]})]}),c("textarea",{className:"rw-textarea",value:s,onChange:i=>{F(i.target.value)},placeholder:"Prepare the branch to draft the rerun prompt, or write your own."})]})]}),h("footer",{className:"rw-footer",children:[h("span",{className:"rw-reassure",id:"rw-reassure",children:[c(L,{name:"lock",size:13}),c("span",{children:"Original session and workspace stay untouched."})]}),h("div",{className:"rw-actions",children:[c("button",{type:"button",className:"rw-button",onClick:D,disabled:l,children:"Cancel"}),B?h("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{te()},disabled:l,"aria-busy":C==="run",children:[C==="run"?c("span",{className:"rw-spinner"}):null,C==="run"?"Forking":"Fork & run",C==="run"?null:c("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]}):h("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{re()},disabled:l,"aria-busy":C==="prepare",children:[C==="prepare"?c("span",{className:"rw-spinner"}):null,C==="prepare"?"Preparing":"Prepare branch",C==="prepare"?null:c("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]})]})]})]})]})}function Ne(e,r,a){let p=new Set(r.map(d=>d.id)),u=a.filter(d=>d.session_id===e&&!p.has(d.id));return[...r,...u]}import{Fragment as Se,jsx as t,jsxs as o}from"react/jsx-runtime";var _r="[data-rw-confirm]";function Ge(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(_r)!==null}var Nr=`
.rw-page :is(button, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--ui-stroke-primary);
  outline-offset: 1px;
}
.rw-page :is(input, textarea):focus-visible {
  outline: none;
}
.rw-page button {
  font: inherit;
  color: inherit;
  cursor: pointer;
  background: transparent;
  border: 0;
}
.rw-page button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.rp-shell {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  min-height: 0;
  padding: 22px 24px;
  font-size: 13px;
  color: var(--ui-text-primary);
}
.rp-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.rp-head-left {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  min-width: 0;
}
.rp-mark {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  color: var(--ui-accent);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .625rem);
}
.rp-title {
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
}
.rp-sub {
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.45;
  color: var(--ui-text-tertiary);
}
.rp-head-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: none;
}
.rp-pill {
  max-width: 220px;
  overflow: hidden;
  padding: 4px 10px;
  font-size: 11px;
  color: var(--ui-text-secondary);
  text-overflow: ellipsis;
  white-space: nowrap;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rp-live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--ui-green);
}
.rp-dot {
  width: 6px;
  height: 6px;
  flex: none;
  border-radius: 999px;
  background: currentColor;
}
.rp-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text-primary);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rp-button:hover:not(:disabled) {
  background: var(--ui-control-hover-background);
}
.rp-button-sm {
  padding: 3px 8px;
  font-size: 11px;
}
.rp-quiet {
  color: var(--ui-text-tertiary);
  background: transparent;
  border-color: transparent;
}
.rp-quiet:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
}
.rp-columns {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
}
.rp-side {
  width: 250px;
  flex: none;
  overflow-y: auto;
  padding-right: 18px;
  border-right: 1px solid var(--ui-stroke-tertiary);
}
.rp-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-width: 0;
}
.rp-eyebrow {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
}
.rp-eyebrow .rp-dot {
  width: 5px;
  height: 5px;
  background: var(--ui-stroke-primary);
}
.rp-eyebrow-count {
  margin-left: 3px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
}
.rp-cards {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.rp-session {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
  padding: 9px 11px;
  text-align: left;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .625rem);
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rp-session:hover {
  border-color: var(--ui-stroke-secondary);
}
.rp-session[aria-current="true"] {
  background: color-mix(in srgb, var(--ui-accent) 9%, var(--ui-bg-card));
  border-color: var(--ui-stroke-primary);
}
.rp-session-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
}
.rp-session-title > span:nth-child(2) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-meta {
  overflow: hidden;
  font-size: 11px;
  color: var(--ui-text-tertiary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-meta-dim {
  color: var(--ui-text-quaternary);
}
.rp-detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ui-stroke-tertiary);
}
.rp-detail-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.rp-detail-note {
  font-size: 11px;
  font-weight: 400;
  color: var(--ui-text-tertiary);
}
.rp-hint {
  flex: none;
  max-width: 190px;
  font-size: 11px;
  line-height: 1.45;
  text-align: right;
  color: var(--ui-text-tertiary);
}
.rp-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  max-height: 92px;
  overflow-y: auto;
}
.rp-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 9px;
  font-size: 11px;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rp-chip:hover {
  border-color: var(--ui-stroke-secondary);
}
.rp-chip[aria-current="true"] {
  border-color: var(--ui-stroke-primary);
  background: color-mix(in srgb, var(--ui-accent) 9%, var(--ui-bg-card));
}
.rp-chip-note {
  color: var(--ui-text-tertiary);
}
.rp-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 1px 7px;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ui-text-secondary);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rp-badge[data-tone="ok"] {
  color: var(--ui-green);
  background: color-mix(in srgb, var(--ui-green) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-green) 32%, transparent);
}
.rp-badge[data-tone="err"] {
  color: var(--ui-red);
  background: color-mix(in srgb, var(--ui-red) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-red) 32%, transparent);
}
.rp-badge[data-tone="run"] {
  color: var(--ui-accent);
  background: color-mix(in srgb, var(--ui-accent) 12%, transparent);
  border-color: color-mix(in srgb, var(--ui-accent) 34%, transparent);
}
.rp-mono {
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-variant-numeric: tabular-nums;
}
.rp-turns {
  display: flex;
  flex: 1;
  min-width: 0;
  overflow-y: auto;
}
.rp-turn {
  border-bottom: 1px solid var(--ui-stroke-tertiary);
}
.rp-turn-bar {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rp-turn-row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
  padding: 8px 6px;
  text-align: left;
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: background-color 120ms ease-out;
}
.rp-turn-row:hover {
  background: var(--ui-control-hover-background);
}
.rp-caret {
  display: inline-grid;
  place-items: center;
  width: 12px;
  flex: none;
  color: var(--ui-text-tertiary);
  transition: transform 140ms ease-out;
}
.rp-caret[data-open="true"] {
  transform: rotate(90deg);
}
.rp-turn-time {
  flex: none;
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-turn-preview {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-turn-stat {
  flex: none;
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-turn-duration {
  flex: none;
  width: 52px;
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-events {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: 0 6px 8px 30px;
}
.rp-event {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 3px 6px;
  font-size: 11px;
  text-align: left;
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: background-color 120ms ease-out;
}
.rp-event:hover {
  background: var(--ui-control-hover-background);
}
.rp-event[aria-current="true"] {
  background: color-mix(in srgb, var(--ui-accent) 12%, transparent);
}
.rp-event-kind {
  width: 62px;
  flex: none;
  overflow: hidden;
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-event-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--ui-text-tertiary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-event-time {
  width: 54px;
  flex: none;
  font-size: 11px;
  text-align: right;
}
.rp-aside-note {
  padding-left: 30px;
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-load-more {
  width: 100%;
  margin-top: 8px;
  padding: 6px;
  font-size: 11px;
  color: var(--ui-text-tertiary);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out;
}
.rp-load-more:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
}
.rp-tail {
  margin-top: 8px;
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-payload {
  width: 292px;
  flex: none;
  overflow-y: auto;
  padding-left: 18px;
  border-left: 1px solid var(--ui-stroke-tertiary);
}
.rp-panel {
  padding: 11px 12px;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .625rem);
}
.rp-panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}
.rp-card-label {
  margin-bottom: 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
}
.rp-card-label-accent {
  color: var(--ui-accent);
}
.rp-metrics {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 16px;
  align-items: baseline;
  font-size: 11px;
}
.rp-metric-label {
  color: var(--ui-text-tertiary);
}
.rp-tone-ok {
  color: var(--ui-green);
}
.rp-tone-err {
  color: var(--ui-red);
}
.rp-tone-warn {
  color: var(--ui-yellow);
}
.rp-metric-value {
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-variant-numeric: tabular-nums;
  text-align: right;
}
.rp-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.rp-verdict {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 9px 11px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--ui-text-secondary);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rp-verdict .rp-icon {
  flex: none;
  margin-top: 1px;
  color: var(--ui-text-tertiary);
}
.rp-verdict strong {
  font-weight: 600;
  color: var(--ui-text-primary);
}
.rp-pre {
  max-height: 132px;
  padding: 10px 12px;
  overflow: auto;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rp-disclosure {
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-disclosure summary {
  cursor: pointer;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}
.rp-disclosure .rp-pre {
  max-height: 128px;
  margin-top: 8px;
  border: 0;
  padding: 0;
  background: transparent;
}
.rp-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 9px 11px;
  font-size: 11px;
  line-height: 1.5;
  border: 1px solid transparent;
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rp-note-warn {
  color: var(--ui-yellow);
  background: color-mix(in srgb, var(--ui-yellow) 8%, transparent);
  border-color: color-mix(in srgb, var(--ui-yellow) 30%, transparent);
}
.rp-error {
  font-size: 11px;
  color: var(--ui-red);
}
.rp-confirm {
  padding: 10px 12px;
  background: color-mix(in srgb, var(--ui-red) 7%, transparent);
  border: 1px solid color-mix(in srgb, var(--ui-red) 32%, transparent);
  border-radius: calc(var(--radius-scalar, 0.2) * .625rem);
}
.rp-confirm-copy {
  margin-bottom: 4px;
  font-size: 12px;
  line-height: 1.45;
}
.rp-confirm-path {
  margin-bottom: 10px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  color: var(--ui-text-tertiary);
  word-break: break-all;
}
.rp-confirm-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rp-delete {
  color: var(--ui-red);
  border-color: color-mix(in srgb, var(--ui-red) 45%, transparent);
}
.rp-delete:hover:not(:disabled) {
  background: color-mix(in srgb, var(--ui-red) 14%, transparent);
}
.rp-branch-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}
.rp-branch-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
}
.rp-branch-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.rp-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rp-icon {
  flex: none;
}
@media (max-width: 900px) {
  .rp-columns {
    flex-direction: column;
  }
  .rp-side {
    width: auto;
    padding-right: 0;
    border-right: 0;
  }
  .rp-payload {
    width: auto;
    padding-left: 0;
    border-left: 0;
  }
}
@media (max-width: 560px) {
  .rp-compare {
    grid-template-columns: 1fr;
  }
  .rp-head-right .rp-pill {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .rp-caret {
    transition: none;
  }
}
`,Sr=new Set(["done","failed","cleaned","discarded"]);function Rr(e){return me(Math.max(0,(e.work_ts-e.ts)*1e3))}function Cr({event:e,selected:r,onSelect:a}){return o("button",{type:"button",className:"rp-event","aria-current":r?"true":void 0,onClick:a,children:[t("span",{title:e.kind,className:`rp-event-kind ${Ze(e.kind,e.status)}`,children:Ye(e.kind)}),t("span",{className:"rp-event-text",children:e.name??e.preview}),t("span",{className:"rp-event-time rp-mono",children:me(e.duration_ms)})]})}var Pr=new Set(["api_request","llm_call"]);function Tr({turn:e,expanded:r,events:a,loading:p,selectedEventId:u,onToggle:d,onFork:I,onSelectEvent:s}){let F=(a??[]).filter(x=>!Pr.has(x.kind)),w=(a??[]).length-F.length;return o("div",{className:"rp-turn",children:[o("div",{className:"rp-turn-bar",children:[o("button",{type:"button",className:"rp-turn-row",onClick:d,"aria-expanded":r,children:[t("span",{className:"rp-caret","data-open":r?"true":"false",children:t(L,{name:"chevron",size:12})}),t("span",{className:"rp-turn-time rp-mono",children:ue(e.ts)}),t("span",{className:"rp-turn-preview",children:e.preview||"User turn"}),t("span",{className:"rp-turn-stat",children:M(e.tool_calls,"tool")}),e.tool_errors>0?o("span",{className:"rp-badge","data-tone":"err",children:[t("span",{className:"rp-dot"}),M(e.tool_errors,"error")]}):null,t("span",{className:"rp-turn-duration rp-mono",children:Rr(e)})]}),o("button",{type:"button",className:"rp-button rp-button-sm",onClick:I,children:[t(L,{name:"rewind",size:12}),"Rewind"]})]}),r?t("div",{className:"rp-events",children:p?t("div",{className:"rp-aside-note",children:"Loading events..."}):o(Se,{children:[F.map(x=>t(Cr,{event:x,selected:u===x.id,onSelect:()=>{s(x)}},x.id)),w>0?o("div",{className:"rp-aside-note",children:[M(e.api_requests,"model request")," \xB7 ",M(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Ye(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function Ze(e,r){return e==="tool_result"&&r==="error"?"text-(--ui-red)":e==="assistant_response"||e==="tool_result"?"text-(--ui-green)":e==="user_turn"?"text-(--ui-accent)":e==="tool_call"?"text-(--ui-purple)":e==="api_request"||e==="llm_call"?"text-(--ui-orange)":e==="compaction"?"text-(--ui-text-secondary)":"text-(--ui-text-tertiary)"}function Je(e){return e==="done"?"ok":e==="failed"?"err":e==="running"?"run":"idle"}function ne({label:e,value:r,tone:a="idle"}){return o(Se,{children:[t("span",{className:"rp-metric-label",children:e}),t("span",{className:`rp-metric-value rp-tone-${a}`,children:r})]})}function Er({detail:e}){return e===null?t("div",{className:"rp-meta",children:"Select an event to inspect its payload."}):o("div",{className:"flex flex-col gap-2",children:[o("div",{className:"flex items-center justify-between gap-2 text-xs",children:[t("span",{className:`font-medium ${Ze(e.kind,e.status)}`,children:Ye(e.kind)}),o("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),o("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${me(e.duration_ms)}`:""]}),t("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-stroke-tertiary) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function zr({ctx:e,branchId:r,refreshTick:a,onClose:p,onRefresh:u}){let[d,I]=v(null),[s,F]=v(null),[w,x]=v(!1),[m,E]=v(null),[y,z]=v(null),C=kr(null);Z(()=>{let l=!1,N=null,q=async()=>{try{let R=await Me(e,r);if(l)return!0;I(R),E(null);let re=R.branch.child_session_id;if(re!==null){let te=await Le(e,R.branch.parent_session_id,re,R.branch.fork_before_ts);l||F(te)}else F(null);return Sr.has(R.branch.state)}catch(R){return l||E(T(R)),!1}},D=async()=>{let R=await q();!l&&!R&&(N=e.setTimeout(()=>{D()},2500))};return D(),()=>{l=!0,N!==null&&N()}},[e,r,a]);let V=async()=>{x(!0),E(null);try{await Fe(e,r),u()}catch(l){E(T(l))}finally{x(!1)}},J=async l=>{x(!0),E(null),z(null);try{await we(e,r),u()}catch(N){E(T(N)),z(l)}finally{x(!1)}},A=async()=>{x(!0),E(null);try{let l=await qe(e,r);l.uncommitted===0?(await we(e,r),u()):z(l)}catch(l){E(T(l))}finally{x(!1)}};if(Z(()=>{z(null)},[r]),Z(()=>{if(y===null)return;let l=N=>{N.key==="Escape"&&Ge()&&z(null)};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[y]),Z(()=>{if(y===null)return;let l=document.activeElement;return C.current?.focus(),()=>{l instanceof HTMLElement&&l.focus()}},[y]),d===null)return t("div",{className:"rp-meta",children:"Loading branch..."});let k=d.branch,_=d.run,U=_?.verify_exit??s?.right?.verify_exit??null,ae=k.verify_cmd?k.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",ee=k.worktree_path?void 0:"This branch has no workspace left to remove.";return o("div",{className:"rp-stack",children:[o("div",{className:"rp-branch-head",children:[o("div",{className:"rp-branch-title",children:[o("span",{children:["Branch ",X(k.id)]}),o("span",{className:"rp-badge","data-tone":Je(k.state),children:[t("span",{className:"rp-dot"}),k.state]}),_!==null&&_.verify_exit!==null?o("span",{className:"rp-badge","data-tone":_.verify_exit===0?"ok":"err",children:["verify ",ye(_.verify_exit)]}):null]}),o("div",{className:"rp-branch-actions",children:[t("button",{type:"button",className:"rp-button rp-button-sm",title:ae,onClick:()=>{V()},disabled:w||!k.verify_cmd||!k.worktree_path,children:"Verify"}),t("button",{type:"button",className:"rp-button rp-button-sm",title:ee,onClick:()=>{A()},disabled:w||!k.worktree_path,children:"Cleanup"}),t("button",{type:"button",className:"rp-button rp-button-sm rp-quiet",onClick:p,children:"Hide"})]})]}),d.shared_child?t("div",{className:"rp-note rp-note-warn",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,m!==null?t("div",{className:"rp-error",children:m}):null,y!==null?o("div",{className:"rp-confirm",ref:C,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[t("div",{className:"rp-confirm-copy",children:Ue(y.uncommitted)}),t("div",{className:"rp-confirm-path",children:y.worktree_path}),o("div",{className:"rp-confirm-actions",children:[t("button",{type:"button",className:"rp-button rp-button-sm rp-delete",onClick:()=>{J(y)},disabled:w,children:"Delete workspace"}),t("button",{type:"button",className:"rp-button rp-button-sm",onClick:()=>{z(null)},children:"Cancel"})]})]}):null,s!==null?o("div",{className:"rp-stack",children:[o("div",{className:"rp-compare",children:[o("div",{className:"rp-panel",children:[o("div",{className:"rp-card-label",children:["Original",s.left?.frozen_at?` \xB7 frozen ${ue(s.left.frozen_at)}`:""]}),o("div",{className:"rp-metrics",children:[t(ne,{label:"outcome",value:s.left===null?"not recorded":Be(s.left.outcome),tone:s.left===null?"idle":ke(s.left.outcome)}),t(ne,{label:"tokens",value:s.left===null?"n/a":de(s.left.tokens_in+s.left.tokens_out)}),t(ne,{label:"tool errors",value:s.left===null?"n/a":String(s.left.tool_errors),tone:s.left!==null&&s.left.tool_errors>0?"err":"idle"})]})]}),o("div",{className:"rp-panel",children:[t("div",{className:"rp-card-label rp-card-label-accent",children:"Rerun"}),o("div",{className:"rp-metrics",children:[t(ne,{label:"outcome",value:s.right===null?"not recorded":fe(s.right.outcome),tone:s.right===null?"idle":ke(s.right.outcome)}),t(ne,{label:"verify",value:U===null?"not run":ye(U),tone:U===null?"idle":U===0?"ok":"err"}),t(ne,{label:"tokens",value:s.right===null?"n/a":de(s.right.tokens_in+s.right.tokens_out)}),t(ne,{label:"tool errors",value:s.right===null?"n/a":String(s.right.tool_errors),tone:s.right!==null&&s.right.tool_errors>0?"err":"idle"})]})]})]}),o("div",{className:"rp-verdict",children:[t(L,{name:"info",size:13}),o("span",{children:[t("strong",{children:"Verdict"})," ",s.verdict]})]})]}):t("div",{className:"rp-meta",children:k.state==="cleaned"||k.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),_!==null&&_.verify_out?t("pre",{className:"rp-pre",children:_.verify_out}):null,d.prompt!==null?o("details",{className:"rp-panel rp-disclosure",children:[t("summary",{children:"Prompt"}),t("pre",{className:"rp-pre",children:d.prompt})]}):null]})}function Qe({ctx:e}){let r=yr(wr.state.activeSessionId),[a,p]=v([]),[u,d]=v(null),[I,s]=v([]),[F,w]=v(!1),[x,m]=v(!1),[E,y]=v(null),[z,C]=v({}),[V,J]=v([]),[A,k]=v([]),[_,U]=v(null),[ae,ee]=v(null),[l,N]=v(null),[q,D]=v(null),[R,re]=v(0),[te,B]=v(null),[pe,W]=v(0),[i,f]=v(!1),[H,S]=v(!1),[Q,K]=v(null);Z(()=>{let n=null,g=e.onEvent("*",()=>{n===null&&(n=e.setTimeout(()=>{n=null,W(j=>j+1)},1500))});return()=>{g(),n!==null&&n()}},[e]),Z(()=>{if(l===null||q!==null)return;let n=g=>{g.key==="Escape"&&!Ge()&&N(null)};return window.addEventListener("keydown",n),()=>{window.removeEventListener("keydown",n)}},[l,q]),Z(()=>{let n=!1,g=async()=>{try{let O=await Pe(e);if(n)return;p(O),f(!0),B(null),d(se=>se!==null&&O.some(be=>be.session_id===se)?se:r??O[0]?.session_id??null)}catch(O){n||B(T(O))}};g();let j=e.setInterval(()=>{g()},1e4);return()=>{n=!0,j()}},[e,r,R,pe]),Z(()=>{if(u===null){s([]),S(!1),w(!1),K(null),J([]),k([]);return}let n=!1,g=async()=>{try{let[O,se,be]=await Promise.all([he(e,u),ze(e,u),Ie(e,u)]);if(n)return;s(nr=>Ne(u,O.items,nr)),w(O.has_more),S(!0),J(se),k(be),K(null),B(null)}catch(O){n||(S(!0),K(T(O)))}};g();let j=e.setInterval(()=>{g()},1e4);return()=>{n=!0,j()}},[e,u,R,pe]),Z(()=>{if(_===null){ee(null);return}let n=!1;return Ee(e,_).then(g=>{n||ee(g)}).catch(g=>{n||B(T(g))}),()=>{n=!0}},[e,_]);let b=a.find(n=>n.session_id===u)??null,ie=b!==null&&b.ended_at===null,P=ie&&b.session_id===r,$=u===null?[]:I.filter(n=>n.session_id===u),er=n=>{d(n.session_id),U(null),N(null),y(null),C({}),s([]),S(!1),w(!1),K(null),J([]),k([])},ve=()=>{re(n=>n+1)},rr=n=>{if(E===n.id){y(null);return}y(n.id),z[n.id]===void 0&&Te(e,n.session_id,n.seq,n.seq_to).then(g=>{C(j=>({...j,[n.id]:g}))}).catch(g=>{B(T(g))})},tr=async()=>{let n=$[$.length-1];if(!(u===null||n===void 0)){m(!0);try{let g=await he(e,u,n.seq);s(j=>Ne(u,g.items,j)),w(g.has_more)}catch(g){B(T(g))}finally{m(!1)}}};return o("div",{className:"rw-page rp-shell",children:[t("style",{children:Nr}),o("header",{className:"rp-head",children:[o("div",{className:"rp-head-left",children:[t("span",{className:"rp-mark",children:t(L,{name:"rewind",size:16})}),o("div",{children:[t("div",{className:"rp-title",children:"Session Rewind"}),t("div",{className:"rp-sub",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]})]}),o("div",{className:"rp-head-right",children:[b!==null?t("span",{className:"rp-pill rp-mono",children:b.model??"unknown model"}):null,ie?o("span",{className:"rp-live",children:[t("span",{className:"rp-dot"}),P?"live":"running"]}):null,o("button",{type:"button",className:"rp-button",onClick:ve,children:[t(L,{name:"refresh",size:13}),"Refresh"]})]})]}),te!==null?t("div",{className:"rp-error",children:te}):null,o("div",{className:"rp-columns",children:[o("aside",{className:"rp-side",children:[o("div",{className:"rp-eyebrow",children:[t("span",{className:"rp-dot"}),"Sessions",i?t("span",{className:"rp-eyebrow-count",children:He(a.length,xe)}):null]}),i?a.length===0?t("div",{className:"rp-meta",children:"Start a chat and Rewind will record every turn."}):t("div",{className:"rp-cards",children:a.map(n=>o("button",{type:"button",className:"rp-session","aria-current":u===n.session_id?"true":void 0,onClick:()=>{er(n)},children:[o("span",{className:"rp-session-title",children:[t("span",{className:"rp-dot",style:{background:n.ended_at===null?"var(--ui-green)":"var(--ui-text-quaternary)"}}),t("span",{children:n.title??X(n.session_id)})]}),o("span",{className:"rp-meta",children:[n.model??"unknown model"," \xB7 ",M(n.event_count,"event")]}),o("span",{className:"rp-meta rp-meta-dim",children:[fe(n.outcome)," \xB7"," ",de(n.tokens_in+n.tokens_out)," tokens"]})]},n.session_id))}):t("div",{className:"rp-meta",children:"Loading sessions..."})]}),o("main",{className:"rp-main",children:[b!==null?o("div",{className:"rp-detail-head",children:[o("div",{className:"rp-stack",style:{gap:3},children:[o("div",{className:"rp-detail-title",children:[b.title??X(b.session_id),V.length>0?t("span",{className:"rp-detail-note",children:M(V.length,"snapshot")}):null]}),o("div",{className:"rp-meta",children:[b.model??"unknown model"," \xB7"," ",M(b.event_count,"event")," \xB7"," ",de(b.tokens_in+b.tokens_out)," tokens",b.ended_at===null?` \xB7 ${Oe(b.last_event_at)}`:""]})]}),t("div",{className:"rp-hint",children:"Select a user turn and choose Rewind."})]}):null,A.length>0?o("div",{children:[o("div",{className:"rp-eyebrow",children:[t("span",{className:"rp-dot"}),"Branches",t("span",{className:"rp-eyebrow-count",children:A.length})]}),t("div",{className:"rp-chips",children:A.map(n=>o("button",{type:"button",className:"rp-chip","aria-current":l===n.id?"true":void 0,onClick:()=>{N(n.id)},children:[t("span",{className:"rp-mono",children:X(n.id)}),o("span",{className:"rp-badge","data-tone":Je(n.state),children:[t("span",{className:"rp-dot"}),n.state]}),t("span",{className:"rp-chip-note",children:n.fork_row_count>0?M(n.fork_row_count,"message"):"context pack"})]},n.id))})]}):null,o("div",{className:"rp-columns",style:{gap:0},children:[t("div",{className:"rp-turns",children:o("div",{className:"rp-stack",style:{width:"100%"},children:[o("div",{className:"rp-eyebrow",children:[t("span",{className:"rp-dot"}),"Turns"]}),b===null?t("div",{className:"rp-meta",children:"Select a recorded session."}):H?$.length===0?t("div",{className:"rp-meta",children:Ve(b.event_count,Q)}):o(Se,{children:[$.map(n=>t(Tr,{turn:n,expanded:E===n.id,events:z[n.id]??null,loading:E===n.id&&z[n.id]===void 0,selectedEventId:_,onToggle:()=>{rr(n)},onFork:()=>{b!==null&&D({session:b,event:n})},onSelectEvent:g=>{U(g.id)}},n.id)),F?t("button",{type:"button",className:"rp-load-more",onClick:()=>{tr()},disabled:x,children:x?"Loading...":"Load earlier turns"}):o("div",{className:"rp-tail",children:[M($.length,"turn")," \xB7 start of the recording"]})]}):t("div",{className:"rp-meta",children:"Loading turns..."})]})}),o("div",{className:"rp-payload",children:[o("div",{className:"rp-eyebrow",children:[t("span",{className:"rp-dot"}),"Event payload"]}),t(Er,{detail:ae})]})]})]})]}),l!==null?t("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-stroke-tertiary) pt-2",children:t(zr,{ctx:e,branchId:l,refreshTick:R,onClose:()=>{N(null)},onRefresh:ve})}):null,q!==null?t(je,{ctx:e,session:q.session,event:q.event,onClose:()=>{D(null)},onCreated:n=>{N(n),ve()}}):null]})}import{jsx as Xe}from"react/jsx-runtime";var Ar={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let r=()=>{Ir.navigate(oe)};e.registerMany([{id:"page",area:Dr,data:{path:oe},render:()=>Xe(Qe,{ctx:e})},{id:"nav",area:$r,data:{path:oe,label:"Rewind",codicon:"history"}},{id:"palette-open",area:Lr,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:r}},{id:"keybind-open",area:Mr,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:r}},{id:"chip",area:Fr.right,order:130,render:()=>Xe(Ce,{})}])}},bt=Ar;export{bt as default};
