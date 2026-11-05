import{host as zr,KEYBINDS_AREA as Mr,PALETTE_AREA as Ir,ROUTES_AREA as Lr,SIDEBAR_NAV_AREA as $r,STATUSBAR_AREAS as Dr}from"@hermes/plugin-sdk";import{host as Pe,useValue as or}from"@hermes/plugin-sdk";var oe="/rewind";import{jsx as ar,jsxs as ir}from"react/jsx-runtime";function Te(){let e=or(Pe.state.activeSessionId);return ir("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{Pe.navigate(oe)},title:"Open Session Rewind",children:[ar("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as hr,useValue as wr}from"@hermes/plugin-sdk";import{useEffect as j,useRef as yr,useState as x}from"react";function se(e,r,a){return e.rest(r,{method:"POST",body:a})}var we=100;async function Ee(e){return(await e.rest(`/sessions?limit=${we}`)).items}async function ye(e,r,a=null){let m=a===null?"":`&before_seq=${a}`;return e.rest(`/sessions/${encodeURIComponent(r)}/turns?limit=40${m}`)}async function ze(e,r,a,m){return(await e.rest(`/sessions/${encodeURIComponent(r)}/events?limit=200&after_seq=${a-1}&before_seq=${m+1}`)).items}function Me(e,r){return e.rest(`/events/${r}`)}function Ie(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/snapshots`)}function Le(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/branches`)}function $e(e,r){return se(e,`/branches/${encodeURIComponent(r)}/reconcile`,{})}function De(e,r,a,m=null){let d=m===null?"":`&before_ts=${m}`;return e.rest(`/compare?left=${encodeURIComponent(r)}&right=${encodeURIComponent(a)}${d}`)}function Fe(e,r){return se(e,"/forks/prepare",r)}function Ae(e,r,a){return se(e,`/forks/${encodeURIComponent(r)}/commit`,a)}function qe(e,r){return se(e,`/forks/${encodeURIComponent(r)}/verify`,{})}function Be(e,r,a){return e.rest(`/branches/${encodeURIComponent(r)}/verify-resolve?cmd=${encodeURIComponent(a)}`)}function He(e,r){return e.rest(`/forks/${encodeURIComponent(r)}/workspace`)}function ke(e,r){return se(e,`/forks/${encodeURIComponent(r)}/cleanup`,{})}function le(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ue(e){return e.toLocaleString()}function me(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var sr=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function E(e){let r=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",a=sr.exec(r),m=a?.[1];if(a===null||m===void 0)return r;let d=lr(m);return d===void 0?r:r.replace(a[0],d)}function lr(e){try{let r=JSON.parse(e);return typeof r.detail=="string"&&r.detail.length>0?r.detail:void 0}catch{return}}function J(e,r=8){return e.length<=r?e:e.slice(0,r)}function I(e,r){return`${e} ${e===1?r:`${r}s`}`}function _e(e){return e===0?"passed":`failed (exit ${e})`}var ur={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function fe(e){return e===null?"recording":ur[e]??e}function Ne(e){return e===null?"warn":e==="completed"?"ok":e==="failed"?"err":"idle"}function Oe(e){return e===null?"open at freeze":fe(e)}function Ve(e,r){return e===0?"":e>=r?`${r}+`:`${e}`}function dr(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Ue(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${dr(e)}`}function We(e,r){return r!==null?`The turns could not be loaded: ${r}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${I(e,"event")} but no user turn.`}function Ke(e){return e===null?"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.":`This workspace holds ${I(e,"uncommitted file")}. Deleting it removes them for good; the rerun conversation stays in the recording.`}import{host as W}from"@hermes/plugin-sdk";import{useCallback as mr,useEffect as ge,useRef as Se,useState as K}from"react";function pr(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let r=e.content;return typeof r=="string"?r.trim():Array.isArray(r)?r.map(a=>{if(typeof a!="object"||a===null||!("text"in a))return"";let m=a.text;return typeof m=="string"?m:""}).join("").trim():""}function je(e,r){let a=(e??[]).filter(p=>(p.role==="user"||p.role==="assistant")&&pr(p).length>0&&typeof p.row_id=="number"),m=-1;for(let p=0;p<a.length;p+=1){let $=a[p];if($===void 0)continue;let s=$.timestamp;$.role==="user"&&typeof s=="number"&&s<=r+.5&&(m=p)}if(m<=0)return null;let d=a[m-1]?.row_id;return typeof d=="number"&&d>0?d:null}import{jsx as Ge}from"react/jsx-runtime";var cr={rewind:"M3 12a9 9 0 1 0 3-6.7M3 4v5h5",refresh:"M20 11a8 8 0 0 0-14 5l-2 2M4 13a8 8 0 0 0 14-5l2-2",branch:"M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0-3-3M15 9v3a3 3 0 0 0 3 3h3",lock:"M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",folder:"M3 7h6l2 2h10v11H3z",close:"M5 5l14 14M19 5L5 19",chevron:"M9 6l6 6-6 6",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01"};function P({name:e,size:r=14,className:a}){return Ge("svg",{"aria-hidden":"true",className:a,viewBox:"0 0 24 24",width:r,height:r,fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round",focusable:"false",children:Ge("path",{d:cr[e]})})}import{jsx as i,jsxs as g}from"react/jsx-runtime";var fr=["python -m pytest -q","npm test","cargo test","go test ./..."],gr=350;function de(e,r){return r.catch(a=>{throw new Error(`${e}: ${E(a)}`)})}function vr(e){if(e===null)return[];let r=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(r).filter(a=>!a.hasAttribute("disabled"))}function br(e,r){let a=vr(e),m=a[0],d=a[a.length-1];if(e===null||m===void 0||d===void 0)return;let p=document.activeElement;if(!e.contains(p)){r.preventDefault(),m.focus();return}r.shiftKey&&p===m?(r.preventDefault(),d.focus()):!r.shiftKey&&p===d&&(r.preventDefault(),m.focus())}var xr=`
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
  border-radius: 14px;
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
  border-radius: 10px;
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
.rw-close {
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
  border-radius: 8px;
  transition: color 120ms ease-out, background-color 120ms ease-out;
}
.rw-close:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
}
.rw-close:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-panel:focus-visible {
  outline: none;
}
.rw-button:focus-visible,
.rw-close:focus-visible,
.rw-preset:focus-visible,
.rw-icon-button:focus-visible {
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
  border-radius: 8px;
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
.rw-card {
  padding: 12px;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 10px;
}
.rw-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}
.rw-card-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.11em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
}
.rw-state-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--ui-text-tertiary);
}
.rw-state-dot[data-tone="ok"] {
  background: var(--ui-green);
}
.rw-state-dot[data-tone="warn"] {
  background: var(--ui-yellow);
}
.rw-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  font-size: 11px;
  line-height: 1.6;
  color: var(--ui-text-secondary);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 999px;
}
.rw-badge-ok {
  color: var(--ui-green);
  background: color-mix(in srgb, var(--ui-green) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-green) 32%, transparent);
}
.rw-badge-warn {
  color: var(--ui-yellow);
  background: color-mix(in srgb, var(--ui-yellow) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-yellow) 32%, transparent);
}
.rw-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  margin: 0 0 10px;
  padding: 0;
  list-style: none;
  background: var(--ui-stroke-tertiary);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 8px;
  overflow: hidden;
}
.rw-stat {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  padding: 8px 10px;
  background: var(--ui-bg-card);
}
.rw-stat-label {
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
}
.rw-stat-value {
  overflow: hidden;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  color: var(--ui-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
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
  color: var(--ui-accent);
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
.rw-icon-button {
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
  border-radius: 6px;
  transition: color 120ms ease-out, background-color 120ms ease-out;
}
.rw-icon-button:hover:not(:disabled) {
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
  border-radius: 8px;
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
.rw-preset {
  padding: 3px 8px;
  font: inherit;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  color: var(--ui-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 6px;
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rw-preset:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
  border-color: var(--ui-stroke-secondary);
}
.rw-preset[aria-pressed="true"] {
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
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 10px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  color: var(--ui-text-tertiary);
}
.rw-banner {
  padding: 9px 11px;
  font-size: 12px;
  line-height: 1.5;
  border: 1px solid transparent;
  border-radius: 8px;
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
.rw-button {
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
  border-radius: 8px;
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rw-button:hover:not(:disabled) {
  background: var(--ui-control-hover-background);
}
.rw-button:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-primary {
  font-weight: 600;
  color: var(--dt-primary-foreground, #fcfcfc);
  background: var(--dt-primary, var(--ui-accent));
  border-color: transparent;
}
.rw-primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--dt-primary, var(--ui-accent)) 88%, var(--ui-base));
}
.rw-kbd {
  padding: 1px 5px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 10px;
  line-height: 1.5;
  color: color-mix(in srgb, var(--dt-primary-foreground, #fcfcfc) 78%, transparent);
  background: color-mix(in srgb, var(--dt-primary-foreground, #fcfcfc) 18%, transparent);
  border-radius: 4px;
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
  .rw-grid,
  .rw-stats {
    grid-template-columns: 1fr;
  }
  .rw-stats {
    gap: 6px;
    background: transparent;
    border: 0;
  }
  .rw-stat {
    border: 1px solid var(--ui-stroke-tertiary);
    border-radius: 8px;
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
`;function Ye({ctx:e,session:r,event:a,onClose:m,onCreated:d}){let[p,$]=K(r.model??""),[s,F]=K(""),[w,h]=K(""),[c,z]=K(null),[N,M]=K(null),[T,H]=K(null),[G,A]=K(null),[y,k]=K(null),[O,ae]=K(!1),Q=Se([]),u=T!==null,S=Se(null),q=Se(()=>{}),D=mr(()=>{u||(ae(!0),Q.current.push(e.setTimeout(m,100)))},[u,e,m]);ge(()=>{let l=Q.current;return()=>{for(let v of l)v()}},[]),ge(()=>{let l=document.activeElement;return S.current?.focus(),()=>{l?.focus()}},[]),ge(()=>{let l=v=>{if(v.key==="Escape"&&!u){D();return}if(v.key==="Tab"){br(S.current,v);return}v.key==="Enter"&&(v.metaKey||v.ctrlKey)&&!u&&(v.preventDefault(),q.current())};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[u,D]),ge(()=>{let l=w.trim();if(c===null||l===""){M(null);return}let v=!1,L=e.setTimeout(()=>{Be(e,c.branch_id,l).then(f=>{v||M(f)}).catch(()=>{v||M(null)})},gr);return()=>{v=!0,L()}},[e,c,w]);let C=async()=>{let l=await W.request("session.active_list",{}),v=Array.isArray(l.sessions)?l.sessions:[],L=v.find(f=>f.session_key===r.session_id)?.id??v.find(f=>f.id===r.session_id)?.id;if(L===void 0)return{runtimeId:void 0,storedId:r.stored_session_id};try{let f=await W.request("session.title",{session_id:L});return{runtimeId:L,storedId:f.session_key??r.stored_session_id}}catch{return{runtimeId:L,storedId:r.stored_session_id}}},X=async()=>{H("prepare"),A(null),k(null);try{let l=await C(),v=await Fe(e,{session_id:r.session_id,stored_session_id:l.storedId,event_id:a.id,model:p.trim()||null,provider:null,prompt:s.trim()||null,verify_cmd:w.trim()||null});z(v),F(v.prompt),v.verify_presets.length>0&&w.trim()===""&&h(v.verify_presets[0]??""),v.model!==null&&$(v.model)}catch(l){A(E(l))}finally{H(null)}},ee=async()=>{if(c!==null){H("run"),A(null),k(null);try{let l=await C(),v=l.runtimeId,L=`\u21BA ${r.title??J(r.session_id)} \xB7 ${J(c.branch_id)}`,f=null;if(v!==void 0)try{let R=await W.request("session.history",{session_id:v});f=je(R.messages,c.fork_before_ts)}catch{f=null}let V,ne,Z=!1;if(f!==null&&v!==void 0){let R=await de("could not branch the session",W.request("session.branch",{session_id:v,through_message_id:f}));V=R.session_id,ne=R.stored_session_id}else{let R={source:"desktop",title:L};c.worktree_path!==null&&(R.cwd=c.worktree_path),l.storedId!==null&&(R.parent_session_id=l.storedId);let re=await de("could not create the branch session",W.request("session.create",R));V=re.session_id,ne=re.stored_session_id,Z=!0}if(Z&&c.worktree_path!==null){let R=()=>W.request("session.cwd.set",{session_id:V,cwd:c.worktree_path});try{await de("could not attach the isolated workspace",R())}catch(re){throw re instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${E(re)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(p.trim()&&p.trim()!==(r.model??""))try{let R=await W.request("config.set",{key:"model",value:p.trim(),session_id:V,confirm_expensive_model:!1});R.confirm_required===!0&&k(R.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{k("The branch was created, but the model switch failed; the rerun uses the current model.")}let ce=s.trim()||c.prompt;await de("could not record the branch",Ae(e,c.branch_id,{child_session_id:V,child_stored_session_id:ne,model:p.trim()||null,provider:null,prompt:ce,verify_cmd:w.trim()||null})),await de("could not start the rerun",W.request("prompt.submit",{session_id:V,text:ce})),d(c.branch_id),W.openSession(ne,{intent:"tab"}),m()}catch(l){A(E(l))}finally{H(null)}}};q.current=()=>{c===null?X():ee()};let _=c!==null,Y=_?c.fidelity==="full"?"ok":"warn":"idle",ve=`rw-badge ${Y==="ok"?"rw-badge-ok":Y==="warn"?"rw-badge-warn":""}`,pe=_?c.fork_row_count>0?`${I(c.fork_row_count,"message")}`:"context pack":"\u2014",be=_?c.worktree_path?"git worktree":"shared workspace":"\u2014",xe=w.trim();return g("div",{className:"rw-overlay","data-closing":O?"true":"false",onMouseDown:l=>{l.target===l.currentTarget&&D()},children:[i("style",{children:xr}),g("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title","aria-describedby":"rw-reassure",tabIndex:-1,ref:S,children:[g("header",{className:"rw-head",children:[i("span",{className:"rw-mark",children:i(P,{name:"rewind",size:16})}),g("div",{className:"rw-heading",children:[i("div",{className:"rw-eyebrow",children:"Session Rewind"}),i("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"})]}),i("button",{type:"button",className:"rw-close",onClick:D,disabled:u,"aria-label":"Close",children:i(P,{name:"close",size:15})})]}),g("div",{className:"rw-body",children:[g("div",{className:"rw-turn",children:[i("span",{className:"rw-turn-time",children:le(a.ts)}),i("span",{className:"rw-turn-text",children:a.preview||"user turn"})]}),G!==null?i("div",{className:"rw-banner rw-banner-error",role:"alert",children:G}):null,y!==null?i("div",{className:"rw-banner rw-banner-warn",role:"status",children:y}):null,g("section",{className:"rw-card",children:[g("div",{className:"rw-card-head",children:[g("span",{className:"rw-card-title",children:[i("span",{className:"rw-state-dot","data-tone":Y==="idle"?void 0:Y}),"Checkpoint"]}),i("span",{className:ve,children:_?Y==="ok"?"workspace ready":"context pack":"not prepared"})]}),g("ul",{className:"rw-stats",children:[g("li",{className:"rw-stat",children:[i("span",{className:"rw-stat-label",children:"carries"}),i("span",{className:"rw-stat-value",children:pe})]}),g("li",{className:"rw-stat",children:[i("span",{className:"rw-stat-label",children:"verify timeout"}),i("span",{className:"rw-stat-value",children:_?`${c.verify_timeout_seconds}s`:"\u2014"})]}),g("li",{className:"rw-stat",children:[i("span",{className:"rw-stat-label",children:"isolation"}),i("span",{className:"rw-stat-value",children:be})]})]}),_&&c.worktree_path?g("div",{className:"rw-path",children:[i("span",{className:"rw-path-text",title:c.worktree_path,children:c.worktree_path}),i("button",{type:"button",className:"rw-icon-button",onClick:()=>{e.os.revealPath(c.worktree_path??"")},disabled:u,"aria-label":"Reveal the isolated workspace",children:i(P,{name:"folder",size:13})}),c.snapshot_commit?g("span",{className:"rw-count",children:["snapshot ",c.snapshot_commit.slice(0,8)]}):null]}):g("div",{className:"rw-note",children:[i(P,{name:"branch"}),i("span",{children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."})]}),_&&c.fidelity!=="full"?g("div",{className:"rw-note rw-note-warn",children:[i(P,{name:"branch"}),i("span",{children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."})]}):null,_&&c.context_rows===null?g("div",{className:"rw-note rw-note-warn",children:[i(P,{name:"branch"}),i("span",{children:"The live transcript prefix is unavailable. The context pack is the only context."})]}):null,_&&r.ended_at!==null?g("div",{className:"rw-note",children:[i(P,{name:"branch"}),i("span",{children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."})]}):null,_&&c.fork_row_count===0&&r.ended_at===null?g("div",{className:"rw-note",children:[i(P,{name:"branch"}),i("span",{children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."})]}):null]}),g("div",{className:"rw-grid",children:[g("label",{className:"rw-field",children:[i("span",{className:"rw-label",children:"Model"}),i("input",{className:"rw-input",value:p,onChange:l=>{$(l.target.value)},placeholder:"provider/model"}),i("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),g("label",{className:"rw-field",children:[i("span",{className:"rw-label",children:"Verify command"}),i("input",{className:"rw-input",value:w,onChange:l=>{h(l.target.value)},placeholder:"python -m pytest -q"}),i("div",{className:"rw-chips",children:(c?.verify_presets.length?c.verify_presets:fr).map(l=>i("button",{type:"button",className:"rw-preset","aria-pressed":l===xe,onClick:()=>{h(l)},disabled:u,children:l},l))}),i("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),N!==null&&N.command===w.trim()?i("span",{className:"rw-resolved",children:N.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${N.resolved}`}):null]})]}),g("label",{className:"rw-field",children:[g("span",{className:"rw-label-row",children:[i("span",{className:"rw-label",children:"Prompt for the rerun"}),g("span",{className:"rw-count","aria-live":"polite",children:[s.length," chars"]})]}),i("textarea",{className:"rw-textarea",value:s,onChange:l=>{F(l.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),i("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),g("footer",{className:"rw-footer",children:[g("span",{className:"rw-reassure",id:"rw-reassure",children:[i(P,{name:"lock",size:13}),i("span",{children:"Original session and workspace stay untouched."})]}),g("div",{className:"rw-actions",children:[i("button",{type:"button",className:"rw-button",onClick:D,disabled:u,children:"Cancel"}),_?g("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{ee()},disabled:u,"aria-busy":T==="run",children:[T==="run"?i("span",{className:"rw-spinner"}):null,T==="run"?"Forking":"Fork & run",T==="run"?null:i("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]}):g("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{X()},disabled:u,"aria-busy":T==="prepare",children:[T==="prepare"?i("span",{className:"rw-spinner"}):null,T==="prepare"?"Preparing":"Prepare branch",T==="prepare"?null:i("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]})]})]})]})]})}function Re(e,r,a){let m=new Set(r.map(p=>p.id)),d=a.filter(p=>p.session_id===e&&!m.has(p.id));return[...r,...d]}import{Fragment as Ce,jsx as t,jsxs as o}from"react/jsx-runtime";var kr="[data-rw-confirm]";function Ze(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(kr)!==null}var _r=`
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
  gap: 14px;
  height: 100%;
  min-height: 0;
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
  border-radius: 10px;
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
  border-radius: 999px;
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
  border-radius: 8px;
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
  width: 238px;
  flex: none;
  overflow-y: auto;
  padding-right: 14px;
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
  border-radius: 10px;
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
  border-radius: 8px;
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
  border-radius: 999px;
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
  border-radius: 8px;
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
  border-radius: 6px;
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
  border-radius: 8px;
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
  width: 288px;
  flex: none;
  overflow-y: auto;
  padding-left: 14px;
  border-left: 1px solid var(--ui-stroke-tertiary);
}
.rp-panel {
  padding: 11px 12px;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 10px;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 8px;
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
  border-radius: 10px;
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
`,Nr=new Set(["done","failed","cleaned","discarded"]);function Sr(e){return me(Math.max(0,(e.work_ts-e.ts)*1e3))}function Rr({event:e,selected:r,onSelect:a}){return o("button",{type:"button",className:"rp-event","aria-current":r?"true":void 0,onClick:a,children:[t("span",{title:e.kind,className:`rp-event-kind ${Qe(e.kind,e.status)}`,children:Je(e.kind)}),t("span",{className:"rp-event-text",children:e.name??e.preview}),t("span",{className:"rp-event-time rp-mono",children:me(e.duration_ms)})]})}var Cr=new Set(["api_request","llm_call"]);function Pr({turn:e,expanded:r,events:a,loading:m,selectedEventId:d,onToggle:p,onFork:$,onSelectEvent:s}){let F=(a??[]).filter(h=>!Cr.has(h.kind)),w=(a??[]).length-F.length;return o("div",{className:"rp-turn",children:[o("div",{className:"rp-turn-bar",children:[o("button",{type:"button",className:"rp-turn-row",onClick:p,"aria-expanded":r,children:[t("span",{className:"rp-caret","data-open":r?"true":"false",children:t(P,{name:"chevron",size:12})}),t("span",{className:"rp-turn-time rp-mono",children:le(e.ts)}),t("span",{className:"rp-turn-preview",children:e.preview||"User turn"}),t("span",{className:"rp-turn-stat",children:I(e.tool_calls,"tool")}),e.tool_errors>0?o("span",{className:"rp-badge","data-tone":"err",children:[t("span",{className:"rp-dot"}),I(e.tool_errors,"error")]}):null,t("span",{className:"rp-turn-duration rp-mono",children:Sr(e)})]}),o("button",{type:"button",className:"rp-button rp-button-sm",onClick:$,children:[t(P,{name:"rewind",size:12}),"Rewind"]})]}),r?t("div",{className:"rp-events",children:m?t("div",{className:"rp-aside-note",children:"Loading events..."}):o(Ce,{children:[F.map(h=>t(Rr,{event:h,selected:d===h.id,onSelect:()=>{s(h)}},h.id)),w>0?o("div",{className:"rp-aside-note",children:[I(e.api_requests,"model request")," \xB7 ",I(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Je(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function Qe(e,r){return e==="tool_result"&&r==="error"?"text-(--ui-red)":e==="assistant_response"||e==="tool_result"?"text-(--ui-green)":e==="user_turn"?"text-(--ui-accent)":e==="tool_call"?"text-(--ui-purple)":e==="api_request"||e==="llm_call"?"text-(--ui-orange)":e==="compaction"?"text-(--ui-text-secondary)":"text-(--ui-text-tertiary)"}function Xe(e){return e==="done"?"ok":e==="failed"?"err":e==="running"?"run":"idle"}function te({label:e,value:r,tone:a="idle"}){return o(Ce,{children:[t("span",{className:"rp-metric-label",children:e}),t("span",{className:`rp-metric-value rp-tone-${a}`,children:r})]})}function Tr({detail:e}){return e===null?t("div",{className:"rp-meta",children:"Select an event to inspect its payload."}):o("div",{className:"flex flex-col gap-2",children:[o("div",{className:"flex items-center justify-between gap-2 text-xs",children:[t("span",{className:`font-medium ${Qe(e.kind,e.status)}`,children:Je(e.kind)}),o("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),o("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${me(e.duration_ms)}`:""]}),t("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-stroke-tertiary) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function Er({ctx:e,branchId:r,refreshTick:a,onClose:m,onRefresh:d}){let[p,$]=x(null),[s,F]=x(null),[w,h]=x(!1),[c,z]=x(null),[N,M]=x(null),T=yr(null);j(()=>{let u=!1,S=null,q=async()=>{try{let C=await $e(e,r);if(u)return!0;$(C),z(null);let X=C.branch.child_session_id;if(X!==null){let ee=await De(e,C.branch.parent_session_id,X,C.branch.fork_before_ts);u||F(ee)}else F(null);return Nr.has(C.branch.state)}catch(C){return u||z(E(C)),!1}},D=async()=>{let C=await q();!u&&!C&&(S=e.setTimeout(()=>{D()},2500))};return D(),()=>{u=!0,S!==null&&S()}},[e,r,a]);let H=async()=>{h(!0),z(null);try{await qe(e,r),d()}catch(u){z(E(u))}finally{h(!1)}},G=async u=>{h(!0),z(null),M(null);try{await ke(e,r),d()}catch(S){z(E(S)),M(u)}finally{h(!1)}},A=async()=>{h(!0),z(null);try{let u=await He(e,r);u.uncommitted===0?(await ke(e,r),d()):M(u)}catch(u){z(E(u))}finally{h(!1)}};if(j(()=>{M(null)},[r]),j(()=>{if(N===null)return;let u=S=>{S.key==="Escape"&&Ze()&&M(null)};return window.addEventListener("keydown",u),()=>{window.removeEventListener("keydown",u)}},[N]),j(()=>{if(N===null)return;let u=document.activeElement;return T.current?.focus(),()=>{u instanceof HTMLElement&&u.focus()}},[N]),p===null)return t("div",{className:"rp-meta",children:"Loading branch..."});let y=p.branch,k=p.run,O=k?.verify_exit??s?.right?.verify_exit??null,ae=y.verify_cmd?y.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",Q=y.worktree_path?void 0:"This branch has no workspace left to remove.";return o("div",{className:"rp-stack",children:[o("div",{className:"rp-branch-head",children:[o("div",{className:"rp-branch-title",children:[o("span",{children:["Branch ",J(y.id)]}),o("span",{className:"rp-badge","data-tone":Xe(y.state),children:[t("span",{className:"rp-dot"}),y.state]}),k!==null&&k.verify_exit!==null?o("span",{className:"rp-badge","data-tone":k.verify_exit===0?"ok":"err",children:["verify ",_e(k.verify_exit)]}):null]}),o("div",{className:"rp-branch-actions",children:[t("button",{type:"button",className:"rp-button rp-button-sm",title:ae,onClick:()=>{H()},disabled:w||!y.verify_cmd||!y.worktree_path,children:"Verify"}),t("button",{type:"button",className:"rp-button rp-button-sm",title:Q,onClick:()=>{A()},disabled:w||!y.worktree_path,children:"Cleanup"}),t("button",{type:"button",className:"rp-button rp-button-sm rp-quiet",onClick:m,children:"Hide"})]})]}),p.shared_child?t("div",{className:"rp-note rp-note-warn",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,c!==null?t("div",{className:"rp-error",children:c}):null,N!==null?o("div",{className:"rp-confirm",ref:T,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[t("div",{className:"rp-confirm-copy",children:Ke(N.uncommitted)}),t("div",{className:"rp-confirm-path",children:N.worktree_path}),o("div",{className:"rp-confirm-actions",children:[t("button",{type:"button",className:"rp-button rp-button-sm rp-delete",onClick:()=>{G(N)},disabled:w,children:"Delete workspace"}),t("button",{type:"button",className:"rp-button rp-button-sm",onClick:()=>{M(null)},children:"Cancel"})]})]}):null,s!==null?o("div",{className:"rp-stack",children:[o("div",{className:"rp-compare",children:[o("div",{className:"rp-panel",children:[o("div",{className:"rp-card-label",children:["Original",s.left?.frozen_at?` \xB7 frozen ${le(s.left.frozen_at)}`:""]}),o("div",{className:"rp-metrics",children:[t(te,{label:"outcome",value:s.left===null?"not recorded":Oe(s.left.outcome),tone:s.left===null?"idle":Ne(s.left.outcome)}),t(te,{label:"tokens",value:s.left===null?"n/a":ue(s.left.tokens_in+s.left.tokens_out)}),t(te,{label:"tool errors",value:s.left===null?"n/a":String(s.left.tool_errors),tone:s.left!==null&&s.left.tool_errors>0?"err":"idle"})]})]}),o("div",{className:"rp-panel",children:[t("div",{className:"rp-card-label rp-card-label-accent",children:"Rerun"}),o("div",{className:"rp-metrics",children:[t(te,{label:"outcome",value:s.right===null?"not recorded":fe(s.right.outcome),tone:s.right===null?"idle":Ne(s.right.outcome)}),t(te,{label:"verify",value:O===null?"not run":_e(O),tone:O===null?"idle":O===0?"ok":"err"}),t(te,{label:"tokens",value:s.right===null?"n/a":ue(s.right.tokens_in+s.right.tokens_out)}),t(te,{label:"tool errors",value:s.right===null?"n/a":String(s.right.tool_errors),tone:s.right!==null&&s.right.tool_errors>0?"err":"idle"})]})]})]}),o("div",{className:"rp-verdict",children:[t(P,{name:"info",size:13}),o("span",{children:[t("strong",{children:"Verdict"})," ",s.verdict]})]})]}):t("div",{className:"rp-meta",children:y.state==="cleaned"||y.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),k!==null&&k.verify_out?t("pre",{className:"rp-pre",children:k.verify_out}):null,p.prompt!==null?o("details",{className:"rp-panel rp-disclosure",children:[t("summary",{children:"Prompt"}),t("pre",{className:"rp-pre",children:p.prompt})]}):null]})}function er({ctx:e}){let r=wr(hr.state.activeSessionId),[a,m]=x([]),[d,p]=x(null),[$,s]=x([]),[F,w]=x(!1),[h,c]=x(!1),[z,N]=x(null),[M,T]=x({}),[H,G]=x([]),[A,y]=x([]),[k,O]=x(null),[ae,Q]=x(null),[u,S]=x(null),[q,D]=x(null),[C,X]=x(0),[ee,_]=x(null),[Y,ve]=x(0),[pe,be]=x(!1),[xe,l]=x(!1),[v,L]=x(null);j(()=>{let n=null,b=e.onEvent("*",()=>{n===null&&(n=e.setTimeout(()=>{n=null,ve(U=>U+1)},1500))});return()=>{b(),n!==null&&n()}},[e]),j(()=>{if(u===null||q!==null)return;let n=b=>{b.key==="Escape"&&!Ze()&&S(null)};return window.addEventListener("keydown",n),()=>{window.removeEventListener("keydown",n)}},[u,q]),j(()=>{let n=!1,b=async()=>{try{let B=await Ee(e);if(n)return;m(B),be(!0),_(null),p(ie=>ie!==null&&B.some(he=>he.session_id===ie)?ie:r??B[0]?.session_id??null)}catch(B){n||_(E(B))}};b();let U=e.setInterval(()=>{b()},1e4);return()=>{n=!0,U()}},[e,r,C,Y]),j(()=>{if(d===null){s([]),l(!1),w(!1),L(null),G([]),y([]);return}let n=!1,b=async()=>{try{let[B,ie,he]=await Promise.all([ye(e,d),Ie(e,d),Le(e,d)]);if(n)return;s(nr=>Re(d,B.items,nr)),w(B.has_more),l(!0),G(ie),y(he),L(null),_(null)}catch(B){n||(l(!0),L(E(B)))}};b();let U=e.setInterval(()=>{b()},1e4);return()=>{n=!0,U()}},[e,d,C,Y]),j(()=>{if(k===null){Q(null);return}let n=!1;return Me(e,k).then(b=>{n||Q(b)}).catch(b=>{n||_(E(b))}),()=>{n=!0}},[e,k]);let f=a.find(n=>n.session_id===d)??null,V=f!==null&&f.ended_at===null,ne=V&&f.session_id===r,Z=d===null?[]:$.filter(n=>n.session_id===d),ce=n=>{p(n.session_id),O(null),S(null),N(null),T({}),s([]),l(!1),w(!1),L(null),G([]),y([])},R=()=>{X(n=>n+1)},re=n=>{if(z===n.id){N(null);return}N(n.id),M[n.id]===void 0&&ze(e,n.session_id,n.seq,n.seq_to).then(b=>{T(U=>({...U,[n.id]:b}))}).catch(b=>{_(E(b))})},tr=async()=>{let n=Z[Z.length-1];if(!(d===null||n===void 0)){c(!0);try{let b=await ye(e,d,n.seq);s(U=>Re(d,b.items,U)),w(b.has_more)}catch(b){_(E(b))}finally{c(!1)}}};return o("div",{className:"rw-page rp-shell",children:[t("style",{children:_r}),o("header",{className:"rp-head",children:[o("div",{className:"rp-head-left",children:[t("span",{className:"rp-mark",children:t(P,{name:"rewind",size:16})}),o("div",{children:[t("div",{className:"rp-title",children:"Session Rewind"}),t("div",{className:"rp-sub",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]})]}),o("div",{className:"rp-head-right",children:[f!==null?t("span",{className:"rp-pill rp-mono",children:f.model??"unknown model"}):null,V?o("span",{className:"rp-live",children:[t("span",{className:"rp-dot"}),ne?"live":"running"]}):null,o("button",{type:"button",className:"rp-button",onClick:R,children:[t(P,{name:"refresh",size:13}),"Refresh"]})]})]}),ee!==null?t("div",{className:"rp-error",children:ee}):null,o("div",{className:"rp-columns",children:[o("aside",{className:"rp-side",children:[o("div",{className:"rp-eyebrow",children:[t("span",{className:"rp-dot"}),"Sessions",pe?t("span",{className:"rp-eyebrow-count",children:Ve(a.length,we)}):null]}),pe?a.length===0?t("div",{className:"rp-meta",children:"Start a chat and Rewind will record every turn."}):t("div",{className:"rp-cards",children:a.map(n=>o("button",{type:"button",className:"rp-session","aria-current":d===n.session_id?"true":void 0,onClick:()=>{ce(n)},children:[o("span",{className:"rp-session-title",children:[t("span",{className:"rp-dot",style:{background:n.ended_at===null?"var(--ui-green)":"var(--ui-text-quaternary)"}}),t("span",{children:n.title??J(n.session_id)})]}),o("span",{className:"rp-meta",children:[n.model??"unknown model"," \xB7 ",I(n.event_count,"event")]}),o("span",{className:"rp-meta rp-meta-dim",children:[fe(n.outcome)," \xB7"," ",ue(n.tokens_in+n.tokens_out)," tokens"]})]},n.session_id))}):t("div",{className:"rp-meta",children:"Loading sessions..."})]}),o("main",{className:"rp-main",children:[f!==null?o("div",{className:"rp-detail-head",children:[o("div",{className:"rp-stack",style:{gap:3},children:[o("div",{className:"rp-detail-title",children:[f.title??J(f.session_id),H.length>0?t("span",{className:"rp-detail-note",children:I(H.length,"snapshot")}):null]}),o("div",{className:"rp-meta",children:[f.model??"unknown model"," \xB7"," ",I(f.event_count,"event")," \xB7"," ",ue(f.tokens_in+f.tokens_out)," tokens",f.ended_at===null?` \xB7 ${Ue(f.last_event_at)}`:""]})]}),t("div",{className:"rp-hint",children:"Select a user turn and choose Rewind."})]}):null,A.length>0?o("div",{children:[o("div",{className:"rp-eyebrow",children:[t("span",{className:"rp-dot"}),"Branches",t("span",{className:"rp-eyebrow-count",children:A.length})]}),t("div",{className:"rp-chips",children:A.map(n=>o("button",{type:"button",className:"rp-chip","aria-current":u===n.id?"true":void 0,onClick:()=>{S(n.id)},children:[t("span",{className:"rp-mono",children:J(n.id)}),o("span",{className:"rp-badge","data-tone":Xe(n.state),children:[t("span",{className:"rp-dot"}),n.state]}),t("span",{className:"rp-chip-note",children:n.fork_row_count>0?I(n.fork_row_count,"message"):"context pack"})]},n.id))})]}):null,o("div",{className:"rp-columns",style:{gap:0},children:[t("div",{className:"rp-turns",children:o("div",{className:"rp-stack",style:{width:"100%"},children:[o("div",{className:"rp-eyebrow",children:[t("span",{className:"rp-dot"}),"Turns"]}),f===null?t("div",{className:"rp-meta",children:"Select a recorded session."}):xe?Z.length===0?t("div",{className:"rp-meta",children:We(f.event_count,v)}):o(Ce,{children:[Z.map(n=>t(Pr,{turn:n,expanded:z===n.id,events:M[n.id]??null,loading:z===n.id&&M[n.id]===void 0,selectedEventId:k,onToggle:()=>{re(n)},onFork:()=>{f!==null&&D({session:f,event:n})},onSelectEvent:b=>{O(b.id)}},n.id)),F?t("button",{type:"button",className:"rp-load-more",onClick:()=>{tr()},disabled:h,children:h?"Loading...":"Load earlier turns"}):o("div",{className:"rp-tail",children:[I(Z.length,"turn")," \xB7 start of the recording"]})]}):t("div",{className:"rp-meta",children:"Loading turns..."})]})}),o("div",{className:"rp-payload",children:[o("div",{className:"rp-eyebrow",children:[t("span",{className:"rp-dot"}),"Event payload"]}),t(Tr,{detail:ae})]})]})]})]}),u!==null?t("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-stroke-tertiary) pt-2",children:t(Er,{ctx:e,branchId:u,refreshTick:C,onClose:()=>{S(null)},onRefresh:R})}):null,q!==null?t(Ye,{ctx:e,session:q.session,event:q.event,onClose:()=>{D(null)},onCreated:n=>{S(n),R()}}):null]})}import{jsx as rr}from"react/jsx-runtime";var Fr={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let r=()=>{zr.navigate(oe)};e.registerMany([{id:"page",area:Lr,data:{path:oe},render:()=>rr(er,{ctx:e})},{id:"nav",area:$r,data:{path:oe,label:"Rewind",codicon:"history"}},{id:"palette-open",area:Ir,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:r}},{id:"keybind-open",area:Mr,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:r}},{id:"chip",area:Dr.right,order:130,render:()=>rr(Te,{})}])}},vt=Fr;export{vt as default};
