import{host as gt,KEYBINDS_AREA as vt,PALETTE_AREA as xt,ROUTES_AREA as bt,SIDEBAR_NAV_AREA as ht,STATUSBAR_AREAS as wt}from"@hermes/plugin-sdk";import{host as Je,useValue as Lr}from"@hermes/plugin-sdk";var xe="/rewind";import{jsx as $r,jsxs as Fr}from"react/jsx-runtime";function Xe(){let e=Lr(Je.state.activeSessionId);return Fr("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{Je.navigate(xe)},title:"Open Session Rewind",children:[$r("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-(--ui-green)"}`}),"Rewind"]})}import{host as et,useValue as rt}from"@hermes/plugin-sdk";import{Fragment as tt,useEffect as j,useRef as Ke,useState as b}from"react";function Ne(e,r,n){return e.rest(r,{method:"POST",body:n})}var Be=100;async function Ye(e){return(await e.rest(`/sessions?limit=${Be}`)).items}async function He(e,r,n=null){let a=n===null?"":`&before_seq=${n}`;return e.rest(`/sessions/${encodeURIComponent(r)}/turns?limit=40${a}`)}async function Ge(e,r,n,a){return(await e.rest(`/sessions/${encodeURIComponent(r)}/events?limit=200&after_seq=${n-1}&before_seq=${a+1}`)).items}function Ze(e,r){return e.rest(`/events/${r}`)}function Qe(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/snapshots`)}function er(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/branches`)}function rr(e,r){return Ne(e,`/branches/${encodeURIComponent(r)}/reconcile`,{})}function tr(e,r,n,a=null){let i=a===null?"":`&before_ts=${a}`;return e.rest(`/compare?left=${encodeURIComponent(r)}&right=${encodeURIComponent(n)}${i}`)}function nr(e,r){return Ne(e,"/forks/prepare",r)}function or(e,r,n){return Ne(e,`/forks/${encodeURIComponent(r)}/commit`,n)}function ar(e,r){return Ne(e,`/forks/${encodeURIComponent(r)}/verify`,{})}function ir(e,r,n){return e.rest(`/branches/${encodeURIComponent(r)}/verify-resolve?cmd=${encodeURIComponent(n)}`)}function sr(e,r){return e.rest(`/forks/${encodeURIComponent(r)}/workspace`)}function Oe(e,r){return Ne(e,`/forks/${encodeURIComponent(r)}/cleanup`,{})}function se(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function be(e){return e.toLocaleString()}function lr(e){let r=Math.max(0,Math.round(Date.now()/1e3-e));if(r<60)return"just now";let n=Math.round(r/60);if(n<60)return`${n}m`;let a=Math.round(n/60);if(a<24)return`${a}h`;let i=Math.round(a/24);return i<30?`${i}d`:`${Math.round(i/30)}mo`}function ze(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Ar=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function R(e){let r=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",n=Ar.exec(r),a=n?.[1];if(n===null||a===void 0)return r;let i=qr(a);return i===void 0?r:r.replace(n[0],i)}function qr(e){try{let r=JSON.parse(e);return typeof r.detail=="string"&&r.detail.length>0?r.detail:void 0}catch{return}}function Z(e,r=8){return e.length<=r?e:e.slice(0,r)}function J(e,r){return`${e} ${e===1?r:`${r}s`}`}function je(e){return e===0?"passed":`failed (exit ${e})`}var Br={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function Se(e){return e===null?"recording":Br[e]??e}function Ce(e){return e===null?"warn":e==="completed"?"ok":e==="failed"?"err":"idle"}function ur(e){return e===null?"open at freeze":Se(e)}function pr(e,r){return e===0?"":e>=r?`${r}+`:`${e}`}function Hr(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function dr(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${Hr(e)}`}function cr(e,r){return r!==null?`The turns could not be loaded: ${r}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${J(e,"event")} but no user turn.`}function mr(e){return e===null?"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.":`This workspace holds ${J(e,"uncommitted file")}. Deleting it removes them for good; the rerun conversation stays in the recording.`}import{host as H}from"@hermes/plugin-sdk";import{useCallback as Wr,useEffect as Pe,useRef as We,useState as F}from"react";function Or(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let r=e.content;return typeof r=="string"?r.trim():Array.isArray(r)?r.map(n=>{if(typeof n!="object"||n===null||!("text"in n))return"";let a=n.text;return typeof a=="string"?a:""}).join("").trim():""}function fr(e,r){let n=(e??[]).filter(u=>(u.role==="user"||u.role==="assistant")&&Or(u).length>0&&typeof u.row_id=="number"),a=-1;for(let u=0;u<n.length;u+=1){let _=n[u];if(_===void 0)continue;let d=_.timestamp;_.role==="user"&&typeof d=="number"&&d<=r+.5&&(a=u)}if(a<=0)return null;let i=n[a-1]?.row_id;return typeof i=="number"&&i>0?i:null}var gr={providers:[],currentModel:null,currentProvider:null};function Ie(e){return typeof e=="string"?e.trim():""}function vr(e){let r=Ie(e);return r===""?null:r}function xr(e){if(e===null||typeof e!="object")return gr;let r=e.providers;if(!Array.isArray(r))return gr;let n=[];for(let a of r){if(a===null||typeof a!="object")continue;let i=a,u=Ie(i.slug),_=Array.isArray(i.models)?i.models.map(Ie).filter(d=>d!==""):[];u===""||_.length===0||n.push({slug:u,name:Ie(i.name)||u,isCurrent:i.is_current===!0,models:_})}return{providers:n,currentModel:vr(e.model),currentProvider:vr(e.provider)}}function br(e,r){return[...e.providers].sort((n,a)=>{let i=r!==null&&n.slug===r?0:1,u=r!==null&&a.slug===r?0:1;return i!==u?i-u:n.isCurrent!==a.isCurrent?n.isCurrent?-1:1:n.name.localeCompare(a.name)})}function hr(e,r){let n=r.trim().toLowerCase();if(n==="")return e;let a=[];for(let i of e){if(i.name.toLowerCase().includes(n)||i.slug.toLowerCase().includes(n)){a.push(i);continue}let u=i.models.filter(_=>_.toLowerCase().includes(n));u.length>0&&a.push({...i,models:u})}return a}function wr(e,r){let n=r===null?"":` --provider ${r}`;return`${e}${n} --session`}function yr(e,r,n,a){return e===""?!1:e!==(n??"")||r!==a}import{jsx as kr}from"react/jsx-runtime";var jr={rewind:"M3 12a9 9 0 1 0 3-6.7M3 4v5h5",refresh:"M20 11a8 8 0 0 0-14 5l-2 2M4 13a8 8 0 0 0 14-5l2-2",branch:"M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0-3-3M15 9v3a3 3 0 0 0 3 3h3",lock:"M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",folder:"M3 7h6l2 2h10v11H3z",close:"M5 5l14 14M19 5L5 19",chevron:"M9 6l6 6-6 6",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01",copy:"M9 9h11v11H9zM5 15V5a1 1 0 0 1 1-1h10",check:"M4 12l5 5L20 7",message:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",reply:"M9 14L4 9l5-5M20 20v-7a4 4 0 0 0-4-4H4",tool:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",inbox:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8",layers:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",event:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18"};function S({name:e,size:r=14,className:n}){return kr("svg",{"aria-hidden":"true",className:n,viewBox:"0 0 24 24",width:r,height:r,fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round",focusable:"false",children:kr("path",{d:jr[e]})})}import{Fragment as Gr,jsx as p,jsxs as x}from"react/jsx-runtime";var Vr=["python -m pytest -q","npm test","cargo test","go test ./..."],Ur=350,Kr=400;function he(e,r){return r.catch(n=>{throw new Error(`${e}: ${R(n)}`)})}function Jr(e){if(e===null)return[];let r=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(r).filter(n=>!n.hasAttribute("disabled"))}function Xr(e,r){let n=Jr(e),a=n[0],i=n[n.length-1];if(e===null||a===void 0||i===void 0)return;let u=document.activeElement;if(!e.contains(u)){r.preventDefault(),a.focus();return}r.shiftKey&&u===a?(r.preventDefault(),i.focus()):!r.shiftKey&&u===i&&(r.preventDefault(),a.focus())}var Yr=`
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
.rw-panel .rw-icon-button:focus-visible,
.rw-panel .rw-trigger:focus-visible,
.rw-panel .rw-option:focus-visible {
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
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 8px 10px;
  font-size: 12px;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rw-turn-icon {
  display: inline-flex;
  flex: none;
  color: var(--ui-accent);
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
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
}
.rw-count {
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-variant-numeric: tabular-nums;
  font-size: 10px;
  color: var(--ui-text-quaternary, var(--ui-text-tertiary));
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
  margin-top: auto;
  padding-top: 2px;
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-text-tertiary);
}
.rw-panel .rw-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  font: inherit;
  font-size: 12px;
  text-align: left;
  color: var(--ui-text-primary);
  cursor: pointer;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: border-color 120ms ease-out, background-color 120ms ease-out;
}
.rw-panel .rw-trigger:hover:not(:disabled) {
  background: var(--ui-control-hover-background);
}
.rw-panel .rw-trigger:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-panel .rw-trigger-open,
.rw-panel .rw-trigger-open:hover:not(:disabled) {
  background: var(--ui-bg-card);
  border-color: var(--ui-stroke-primary);
}
.rw-trigger-text {
  min-width: 0;
  overflow: hidden;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rw-trigger-provider {
  flex: none;
  padding: 1px 7px;
  font-size: 10px;
  color: var(--ui-text-secondary);
  background: color-mix(in srgb, var(--ui-accent) 9%, transparent);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rw-trigger-caret {
  display: inline-grid;
  flex: none;
  place-items: center;
  color: var(--ui-text-tertiary);
  transition: transform 140ms ease-out;
}
.rw-trigger-caret[data-open='true'] {
  transform: rotate(90deg);
}
.rw-picker {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .625rem);
}
.rw-search {
  box-sizing: border-box;
  width: 100%;
  padding: 7px 9px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text-primary);
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rw-search:focus {
  border-color: var(--ui-stroke-primary);
  outline: none;
}
.rw-picker-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  max-height: 236px;
  overflow-y: auto;
}
.rw-group-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 8px 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
  border-bottom: 1px solid var(--ui-stroke-tertiary);
}
.rw-panel .rw-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  font: inherit;
  font-size: 12px;
  text-align: left;
  color: var(--ui-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: color 120ms ease-out, background-color 120ms ease-out;
}
.rw-panel .rw-option:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
}
.rw-panel .rw-option[aria-selected='true'] {
  color: var(--ui-text-primary);
  background: color-mix(in srgb, var(--ui-accent) 14%, transparent);
}
.rw-option-text {
  min-width: 0;
  overflow: hidden;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rw-option-tag {
  flex: none;
  padding: 1px 6px;
  font-size: 10px;
  color: var(--ui-text-tertiary);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rw-panel .rw-option-keep {
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  margin-bottom: 4px;
  padding-bottom: 8px;
  border-radius: 0;
}
.rw-option-sub {
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rw-picker-empty {
  padding: 10px 8px;
  font-size: 11px;
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
`;function _r({ctx:e,session:r,event:n,onClose:a,onCreated:i}){let[u,_]=F(""),[d,W]=F(null),[D,y]=F({providers:[],currentModel:null,currentProvider:null}),[V,T]=F(!1),[k,P]=F(!1),[A,X]=F(""),[O,Q]=F(""),[h,C]=F(""),[f,ye]=F(null),[U,v]=F(null),[w,q]=F(null),[ee,N]=F(null),[ue,pe]=F(!1),Y=We([]),M=w!==null,ke=We(null),de=We(()=>{}),oe=Wr(()=>{M||(pe(!0),Y.current.push(e.setTimeout(a,100)))},[M,e,a]);Pe(()=>{let l=Y.current;return()=>{for(let c of l)c()}},[]),Pe(()=>{let l=document.activeElement;return ke.current?.focus(),()=>{l?.focus()}},[]),Pe(()=>{let l=c=>{if(c.key==="Escape"&&!M){if(k){P(!1);return}oe();return}if(c.key==="Tab"){Xr(ke.current,c);return}if(c.key==="Enter"&&(c.metaKey||c.ctrlKey)&&!M){if(k)return;c.preventDefault(),de.current()}};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[M,oe,k]),Pe(()=>{let l=h.trim();if(f===null||l===""){v(null);return}let c=!1,E=e.setTimeout(()=>{ir(e,f.branch_id,l).then(z=>{c||v(z)}).catch(()=>{c||v(null)})},Ur);return()=>{c=!0,E()}},[e,f,h]),Pe(()=>{let l=!1;return H.request("model.options",{explicit_only:!0,include_unconfigured:!1}).then(c=>{if(l)return;let E=xr(c);y(E),T(E.providers.length===0)}).catch(()=>{l||T(!0)}),()=>{l=!0}},[]);let Ae=br(D,r.provider),G=hr(Ae,A),Te=u.trim()===""?r.model??"":u.trim(),re=d??r.provider,ce=re===null?"":D.providers.find(l=>l.slug===re)?.name??re,_e=(l,c)=>{_(c),W(l),P(!1),X("")},ae=()=>{_(""),W(null),P(!1),X("")},ie=async()=>{let l=await H.request("session.active_list",{}),c=Array.isArray(l.sessions)?l.sessions:[],E=c.find(z=>z.session_key===r.session_id)?.id??c.find(z=>z.id===r.session_id)?.id;if(E===void 0)return{runtimeId:void 0,storedId:r.stored_session_id};try{let z=await H.request("session.title",{session_id:E});return{runtimeId:E,storedId:z.session_key??r.stored_session_id}}catch{return{runtimeId:E,storedId:r.stored_session_id}}},Me=async()=>{q("prepare"),N(null);try{let l=await ie(),c=await nr(e,{session_id:r.session_id,stored_session_id:l.storedId,event_id:n.id,model:u.trim()||null,provider:d,prompt:O.trim()||null,verify_cmd:h.trim()||null});ye(c),Q(c.prompt),c.verify_presets.length>0&&h.trim()===""&&C(c.verify_presets[0]??"")}catch(l){N(R(l))}finally{q(null)}},me=async()=>{if(f!==null){q("run"),N(null);try{let l=await ie(),c=l.runtimeId,E=`\u21BA ${r.title??Z(r.session_id)} \xB7 ${Z(f.branch_id)}`,z=null;if(c!==void 0)try{let I=await H.request("session.history",{session_id:c});z=fr(I.messages,f.fork_before_ts)}catch{z=null}let B,ge,ve=!1;if(z!==null&&c!==void 0){let I=await he("could not branch the session",H.request("session.branch",{session_id:c,through_message_id:z}));B=I.session_id,ge=I.stored_session_id}else{let I={source:"desktop",title:E};f.worktree_path!==null&&(I.cwd=f.worktree_path),l.storedId!==null&&(I.parent_session_id=l.storedId);let t=await he("could not create the branch session",H.request("session.create",I));B=t.session_id,ge=t.stored_session_id,ve=!0}if(ve&&f.worktree_path!==null){let I=()=>H.request("session.cwd.set",{session_id:B,cwd:f.worktree_path});try{await he("could not attach the isolated workspace",I())}catch(t){throw t instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${R(t)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(await he("could not open the rerun session",H.openSession(ge,{intent:"tab"})),yr(u.trim(),d,r.model,r.provider)){let I=wr(u.trim(),d),t=()=>H.request("config.set",{key:"model",value:I,session_id:B,confirm_expensive_model:!1}),m=!1,L=null,$="";for(let te=0;te<2&&!m;te+=1)try{let ne=await t();m=!0,L=ne.confirm_required===!0?ne.confirm_message??null:null}catch(ne){$=R(ne),await new Promise(qe=>{setTimeout(qe,Kr)})}m?L!==null&&H.notify({kind:"info",message:L,detail:`The rerun started before the switch could be confirmed; ${u.trim()} applies from the next turn.`}):H.notify({kind:"warning",message:`The rerun runs on ${r.model??"the session model"}, not ${u.trim()}.`,detail:$})}let Ee=O.trim()||f.prompt;await he("could not record the branch",or(e,f.branch_id,{child_session_id:B,child_stored_session_id:ge,model:u.trim()||r.model,provider:d??r.provider,prompt:Ee,verify_cmd:h.trim()||null})),await he("could not start the rerun",H.request("prompt.submit",{session_id:B,text:Ee})),i(f.branch_id),a()}catch(l){N(R(l))}finally{q(null)}}};de.current=()=>{f===null?Me():me()};let K=f!==null,fe=h.trim(),g=[];return K?(f.fidelity!=="full"&&g.push({warn:!0,text:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}),f.context_rows===null&&g.push({warn:!0,text:"The live transcript prefix is unavailable. The context pack is the only context."}),r.ended_at!==null&&g.push({warn:!1,text:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}),f.fork_row_count===0&&r.ended_at===null&&g.push({warn:!1,text:"This is the first turn. The rerun starts a fresh chat in the restored workspace."})):g.push({warn:!1,text:"Prepare reads the recorded context for this turn and drafts the rerun prompt. Nothing runs until you fork."}),x("div",{className:"rw-overlay","data-closing":ue?"true":"false",onMouseDown:l=>{l.target===l.currentTarget&&oe()},children:[p("style",{children:Yr}),x("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title","aria-describedby":"rw-reassure",tabIndex:-1,ref:ke,children:[x("header",{className:"rw-head",children:[p("span",{className:"rw-mark",children:p(S,{name:"rewind",size:16})}),x("div",{className:"rw-heading",children:[p("div",{className:"rw-eyebrow",children:"Session Rewind"}),p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"})]}),p("button",{type:"button",className:"rw-close",onClick:oe,disabled:M,"aria-label":"Close",children:p(S,{name:"close",size:15})})]}),x("div",{className:"rw-body",children:[x("div",{className:"rw-turn",children:[p("span",{className:"rw-turn-icon",children:p(S,{name:"message",size:12})}),p("span",{className:"rw-turn-time",children:se(n.ts)}),p("span",{className:"rw-turn-text",title:n.preview||"user turn",children:n.preview||"user turn"})]}),ee!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:ee}):null,K&&f.worktree_path?x("div",{className:"rw-path",children:[p("span",{className:"rw-path-text",title:f.worktree_path,children:f.worktree_path}),p("button",{type:"button",className:"rw-icon-button",onClick:()=>{e.os.revealPath(f.worktree_path??"")},disabled:M,"aria-label":"Reveal the isolated workspace",children:p(S,{name:"folder",size:13})})]}):null,g.length>0?p("div",{className:"rw-notes",children:g.map(l=>x("div",{className:`rw-note${l.warn?" rw-note-warn":""}`,role:l.warn?"status":void 0,children:[p(S,{name:"info"}),p("span",{children:l.text})]},l.text))}):null,x("div",{className:"rw-grid",children:[x("div",{className:"rw-field",children:[p("span",{className:"rw-label",id:"rw-model-label",children:"Model"}),x("button",{type:"button",className:`rw-trigger${k?" rw-trigger-open":""}`,onClick:()=>{P(!k)},disabled:M,"aria-haspopup":"listbox","aria-expanded":k,"aria-labelledby":"rw-model-label rw-model-value",children:[p("span",{className:"rw-trigger-text",id:"rw-model-value",children:Te===""?"Session model":Te}),ce===""?null:p("span",{className:"rw-trigger-provider",children:ce}),p("span",{className:"rw-trigger-caret","aria-hidden":"true","data-open":k,children:p(S,{name:"chevron",size:12})})]}),k?x("div",{className:"rw-picker",children:[p("input",{className:"rw-search",value:A,onChange:l=>{X(l.target.value)},onKeyDown:l=>{let c=G[0];l.key==="Enter"&&c!==void 0&&(l.preventDefault(),_e(c.slug,c.models[0]??""))},placeholder:"Search models","aria-label":"Search models",autoFocus:!0}),x("div",{className:"rw-picker-list",role:"listbox","aria-label":"Models",children:[x("button",{type:"button",className:"rw-option rw-option-keep",role:"option","aria-selected":u.trim()==="",onClick:ae,children:["Keep the session model",r.model===null?null:p("span",{className:"rw-option-sub",children:r.model})]}),G.map(l=>x("div",{className:"rw-group",role:"group","aria-label":l.name,children:[x("div",{className:"rw-group-head",children:[p("span",{children:l.name}),p("span",{className:"rw-count",children:l.models.length})]}),l.models.map(c=>x("button",{type:"button",className:"rw-option",role:"option","aria-selected":c===u.trim()&&l.slug===d,onClick:()=>{_e(l.slug,c)},children:[p("span",{className:"rw-option-text",children:c}),c===r.model?p("span",{className:"rw-option-tag",children:"session"}):null]},c))]},l.slug)),G.length===0&&A.trim()!==""?p("button",{type:"button",className:"rw-option",role:"option",onClick:()=>{_(A.trim()),W(null),P(!1),X("")},children:x("span",{className:"rw-option-text",children:["Use \u201C",A.trim(),"\u201D as typed"]})}):null,G.length===0&&A.trim()===""?p("div",{className:"rw-picker-empty",children:"No configured provider offers a model."}):null]})]}):null,p("span",{className:"rw-help",children:V?"Could not read the model list, so the rerun keeps the session model.":"Lists the providers configured in Hermes."})]}),x("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:h,onChange:l=>{C(l.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(f?.verify_presets.length?f.verify_presets:Vr).map(l=>p("button",{type:"button",className:"rw-preset","aria-pressed":l===fe,onClick:()=>{C(l)},disabled:M,children:l},l))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),U!==null&&U.command===h.trim()?p("span",{className:"rw-resolved",children:U.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":x(Gr,{children:[p("span",{children:"Resolves to"}),p("span",{className:"rw-resolved-path",title:U.resolved,children:U.resolved})]})}):null]})]}),x("label",{className:"rw-field",children:[x("span",{className:"rw-label-row",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),O.length>0?x("span",{className:"rw-count","aria-live":"polite",children:[O.length," chars"]}):null]}),p("textarea",{className:"rw-textarea",value:O,onChange:l=>{Q(l.target.value)},placeholder:"Prepare drafts this from the recorded turn \u2014 or write your own now."})]})]}),x("footer",{className:"rw-footer",children:[x("span",{className:"rw-reassure",id:"rw-reassure",children:[p(S,{name:"lock",size:13}),p("span",{children:"Original session and workspace stay untouched."})]}),x("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:oe,disabled:M,children:"Cancel"}),K?x("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{me()},disabled:M,"aria-busy":w==="run",children:[w==="run"?p("span",{className:"rw-spinner"}):null,w==="run"?"Forking":"Fork & run",w==="run"?null:p("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]}):x("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{Me()},disabled:M,"aria-busy":w==="prepare",children:[w==="prepare"?p("span",{className:"rw-spinner"}):null,w==="prepare"?"Preparing":"Prepare branch",w==="prepare"?null:p("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]})]})]})]})]})}function Ve(e,r,n){let a=new Set(r.map(u=>u.id)),i=n.filter(u=>u.session_id===e&&!a.has(u.id));return[...r,...i]}function Zr(e){let r=e.trim();if(r.length<2)return!1;let n=r[0];return n==="{"&&r.endsWith("}")||n==="["&&r.endsWith("]")}function De(e,r=0){if(r>=4)return e;if(Array.isArray(e))return e.map(n=>De(n,r+1));if(e!==null&&typeof e=="object"){let n={};for(let[a,i]of Object.entries(e))n[a]=De(i,r+1);return n}if(typeof e=="string"&&Zr(e))try{let n=JSON.parse(e);if(n!==null&&typeof n=="object")return De(n,r+1)}catch{}return e}var Qr=/(?<q>"(?:\\.|[^"\\])*")(?<c>\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\][,:]|\s+|./g;function Nr(e){let r=[];for(let n of e.matchAll(Qr)){let a=n[0],i=n.groups?.q,u=n.groups?.c;if(i!==void 0){r.push({text:i,type:u!==void 0?"key":"string"}),u!==void 0&&r.push({text:u,type:"punct"});continue}a==="true"||a==="false"?r.push({text:a,type:"bool"}):a==="null"?r.push({text:a,type:"null"}):/^-?\d/.test(a)?r.push({text:a,type:"number"}):r.push({text:a,type:"punct"})}return r}function Sr(e){return JSON.stringify(De(e),null,2)}var Ue=new Set(["api_request","llm_call"]);function Cr(e){let r=[],n=new Map;for(let a of e)if(!Ue.has(a.kind)){if(a.kind==="tool_call"&&a.tool_call_id!==null){let i={call:a,result:null};r.push(i),n.set(a.tool_call_id,i);continue}if(a.kind==="tool_result"&&a.tool_call_id!==null){let i=n.get(a.tool_call_id);if(i!==void 0){i.result=a;continue}}r.push({call:a,result:null})}return r}import{Fragment as Fe,jsx as o,jsxs as s}from"react/jsx-runtime";var nt="[data-rw-confirm]",Rr="hermes-session-rewind:payload-width",we=292;function $e(e){return Number.isFinite(e)?Math.min(560,Math.max(240,Math.round(e))):we}function ot(){try{let e=window.localStorage.getItem(Rr);return e===null?we:$e(Number(e))||we}catch{return we}}function Le(e){try{window.localStorage.setItem(Rr,String(e))}catch{}}function Tr(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(nt)!==null}var at=`
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
.rw-page ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.rw-page ::-webkit-scrollbar-track {
  background: transparent;
}
.rw-page ::-webkit-scrollbar-thumb {
  background: var(--ui-stroke-secondary);
  border-radius: 999px;
}
.rw-page ::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--ui-text-tertiary) 55%, transparent);
}
.rp-shell {
  display: flex;
  flex-direction: column;
  gap: 18px;
  height: 100%;
  min-height: 0;
  padding: 24px 28px;
  font-size: 13px;
  color: var(--ui-text-primary);
}
.rp-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--ui-stroke-tertiary);
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
  width: 36px;
  height: 36px;
  color: var(--ui-accent);
  background: color-mix(in srgb, var(--ui-accent) 10%, var(--ui-bg-card));
  border: 1px solid color-mix(in srgb, var(--ui-accent) 30%, var(--ui-stroke-tertiary));
  border-radius: calc(var(--radius-scalar, 0.2) * .75rem);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .75rem);
  transition: transform 120ms ease-out, box-shadow 120ms ease-out, border-color 120ms ease-out, background-color 120ms ease-out;
}
.rp-session:hover {
  border-color: var(--ui-stroke-secondary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.rp-session[aria-current="true"] {
  background: color-mix(in srgb, var(--ui-accent) 12%, var(--ui-bg-card));
  border-color: var(--ui-stroke-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}
.rp-session[aria-current="true"]::before {
  content: '';
  position: absolute;
  left: 0;
  top: 10%;
  bottom: 10%;
  width: 3px;
  border-radius: 0 2px 2px 0;
  background: var(--ui-accent);
}
.rp-session-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
}
.rp-session-title > span:nth-child(2) {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-session-when {
  flex: none;
  font-size: 10px;
  font-weight: 400;
  color: var(--ui-text-quaternary, var(--ui-text-tertiary));
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
.rp-empty {
  display: flex;
  align-items: center;
  gap: 6px;
}
.rp-empty svg {
  flex: none;
  color: var(--ui-text-quaternary, var(--ui-text-tertiary));
}
.rp-detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--ui-stroke-tertiary);
}
.rp-search {
  width: 100%;
  margin-bottom: 8px;
  padding: 5px 9px;
  font: inherit;
  font-size: 11px;
  color: var(--ui-text-primary);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: border-color 120ms ease-out;
}
.rp-search::placeholder {
  color: var(--ui-text-quaternary, var(--ui-text-tertiary));
}
.rp-search:focus {
  outline: none;
  border-color: var(--ui-stroke-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-stroke-primary) 20%, transparent);
}
.rp-stats {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 16px;
}
.rp-stat {
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
}
.rp-stat-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
}
.rp-stat-value {
  font-size: 11px;
  color: var(--ui-text-primary);
  font-variant-numeric: tabular-nums;
}
.rp-detail-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
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
.rp-turn-row[aria-expanded="true"] {
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
  min-width: 0;
  margin: 2px 0 8px;
  padding: 4px 6px 8px 30px;
  background: color-mix(in srgb, var(--ui-bg-card) 55%, transparent);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rp-event {
  position: relative;
  display: flex;
  align-items: center;
  align-self: stretch;
  gap: 8px;
  min-width: 0;
  padding: 4px 6px;
  font-size: 11px;
  text-align: left;
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
  transition: background-color 120ms ease-out;
}
.rp-event[data-depth="1"] {
  margin-left: 30px;
}
.rp-event[data-depth="1"]::before {
  content: '';
  position: absolute;
  left: -16px;
  top: -1px;
  bottom: -1px;
  width: 1px;
  background: var(--ui-stroke-tertiary);
}
.rp-event[data-depth="1"]::after {
  content: '';
  position: absolute;
  left: -16px;
  top: 50%;
  width: 12px;
  height: 1px;
  background: var(--ui-stroke-tertiary);
}
.rp-event:hover {
  background: var(--ui-control-hover-background);
}
.rp-event[aria-current="true"] {
  background: color-mix(in srgb, var(--ui-accent) 12%, transparent);
  box-shadow: inset 2px 0 0 var(--ui-accent);
}
.rp-event-icon {
  display: inline-flex;
  flex: none;
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
  color: var(--ui-text-tertiary);
}
.rp-event-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: var(--ui-text-tertiary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-event-name {
  margin-right: 6px;
  color: var(--ui-text-primary);
}
.rp-event-preview {
  color: var(--ui-text-quaternary, var(--ui-text-tertiary));
}
.rp-event .rp-badge {
  flex: none;
  padding: 0 6px;
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
  margin-top: 6px;
  padding: 2px 6px 0;
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-text-quaternary, var(--ui-text-tertiary));
}
.rp-payload {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: var(--rp-payload-width, 292px);
  flex: none;
  overflow-y: auto;
  margin-left: 4px;
  padding: 14px;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .75rem);
}
.rp-divider {
  position: relative;
  z-index: 1;
  width: 4px;
  flex: none;
  cursor: col-resize;
  touch-action: none;
  border-radius: 999px;
  background: transparent;
  transition: background-color 120ms ease-out;
}
.rp-divider:hover,
.rp-divider[data-dragging="true"] {
  background: color-mix(in srgb, var(--ui-accent) 60%, transparent);
}
.rp-divider:focus-visible {
  outline: none;
  background: color-mix(in srgb, var(--ui-accent) 45%, transparent);
}
.rp-inspect {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rp-inspect-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  padding: 20px 12px;
  font-size: 11px;
  text-align: center;
  color: var(--ui-text-tertiary);
}
.rp-inspect-empty svg {
  color: var(--ui-text-quaternary, var(--ui-text-tertiary));
}
.rp-inspect-head {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.rp-inspect-kind {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex: none;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.rp-inspect-kind .rp-dot {
  width: 6px;
  height: 6px;
}
.rp-inspect-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 12px;
  font-weight: 500;
  color: var(--ui-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rp-inspect-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: var(--ui-text-tertiary);
}
.rp-inspect-sep {
  color: var(--ui-text-quaternary, var(--ui-text-tertiary));
}
.rp-json-card {
  overflow: hidden;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rp-json-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 6px 4px 10px;
  border-bottom: 1px solid var(--ui-stroke-tertiary);
}
.rp-json-lang {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary);
}
.rp-json {
  margin: 0;
  max-height: 60vh;
  overflow: auto;
  padding: 10px 12px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  line-height: 1.55;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  tab-size: 2;
}
.rp-j-key {
  color: var(--ui-text-primary);
}
.rp-j-string {
  color: var(--ui-green);
}
.rp-j-number {
  color: var(--ui-orange);
}
.rp-j-bool {
  color: var(--ui-purple);
}
.rp-j-null {
  color: var(--ui-purple);
  font-style: italic;
}
.rp-j-punct {
  color: var(--ui-text-tertiary);
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
  letter-spacing: 0.12em;
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
  letter-spacing: 0.12em;
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
.rp-compare-wrap {
  max-height: 288px;
  flex: none;
  overflow-y: auto;
  padding-top: 8px;
  border-top: 1px solid var(--ui-stroke-tertiary);
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
    margin-left: 0;
    padding: 12px;
  }
  .rp-divider {
    display: none;
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
`,it=new Set(["done","failed","cleaned","discarded"]);function st(e){return ze(Math.max(0,(e.work_ts-e.ts)*1e3))}function Pr({event:e,nested:r=!1,selected:n,onSelect:a}){let i=!r&&e.name!==null;return s("button",{type:"button",className:"rp-event","data-depth":r?"1":"0","aria-current":n?"true":void 0,onClick:a,children:[o("span",{title:e.kind,className:"rp-event-icon",style:{color:zr(e.kind,e.status)},children:o(S,{name:ut(e.kind),size:12})}),o("span",{title:e.kind,className:"rp-event-kind",children:Mr(e.kind)}),s("span",{className:"rp-event-text",title:e.preview!==""?e.preview:void 0,children:[i?o("span",{className:"rp-event-name",children:e.name}):null,e.preview!==""?o("span",{className:"rp-event-preview",children:e.preview}):null]}),e.status==="error"?o("span",{className:"rp-badge","data-tone":"err",children:"error"}):null,o("span",{className:"rp-event-time rp-mono",children:ze(e.duration_ms)})]})}function lt({turn:e,expanded:r,events:n,loading:a,selectedEventId:i,onToggle:u,onFork:_,onSelectEvent:d}){let W=Cr(n??[]),D=(n??[]).filter(y=>Ue.has(y.kind)).length;return s("div",{className:"rp-turn",children:[s("div",{className:"rp-turn-bar",children:[s("button",{type:"button",className:"rp-turn-row",onClick:u,"aria-expanded":r,children:[o("span",{className:"rp-caret","data-open":r?"true":"false",children:o(S,{name:"chevron",size:12})}),o("span",{className:"rp-turn-time rp-mono",children:se(e.ts)}),o("span",{className:"rp-turn-preview",title:e.preview||"User turn",children:e.preview||"User turn"}),o("span",{className:"rp-turn-stat",children:J(e.tool_calls,"tool")}),e.tool_errors>0?s("span",{className:"rp-badge","data-tone":"err",children:[o("span",{className:"rp-dot"}),J(e.tool_errors,"error")]}):null,o("span",{className:"rp-turn-duration rp-mono",children:st(e)})]}),s("button",{type:"button",className:"rp-button rp-button-sm",onClick:_,children:[o(S,{name:"rewind",size:12}),"Rewind"]})]}),r?o("div",{className:"rp-events",children:a?o("div",{className:"rp-aside-note",children:"Loading events..."}):s(Fe,{children:[W.map(y=>s(tt,{children:[o(Pr,{event:y.call,selected:i===y.call.id,onSelect:()=>{d(y.call)}}),y.result!==null?o(Pr,{event:y.result,nested:!0,selected:i===y.result.id,onSelect:()=>{let V=y.result;V!==null&&d(V)}}):null]},y.call.id)),D>0?s("div",{className:"rp-aside-note",children:[J(e.api_requests,"model request")," \xB7 ",J(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Mr(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function ut(e){return e==="user_turn"?"message":e==="assistant_response"?"reply":e==="tool_call"?"tool":e==="tool_result"?"inbox":e==="api_request"||e==="llm_call"?"zap":e==="compaction"?"layers":"event"}function Er(e){return e==="done"?"ok":e==="failed"?"err":e==="running"?"run":"idle"}function Re({label:e,value:r,mono:n=!0,tone:a="idle"}){let i=a==="idle"?"":` rp-tone-${a}`;return s("span",{className:"rp-stat",children:[o("span",{className:"rp-stat-label",children:e}),o("span",{className:`rp-stat-value${n?" rp-mono":""}${i}`,children:r})]})}function le({label:e,value:r,tone:n="idle"}){return s(Fe,{children:[o("span",{className:"rp-metric-label",children:e}),o("span",{className:`rp-metric-value rp-tone-${n}`,children:r})]})}function zr(e,r){return e==="tool_result"&&r==="error"?"var(--ui-red)":e==="assistant_response"||e==="tool_result"?"var(--ui-green)":e==="user_turn"?"var(--ui-accent)":e==="tool_call"?"var(--ui-purple)":e==="api_request"||e==="llm_call"?"var(--ui-orange)":e==="compaction"?"var(--ui-text-secondary)":"var(--ui-text-tertiary)"}function pt(e){return e==="ok"?"var(--ui-green)":e==="err"?"var(--ui-red)":e==="warn"?"var(--ui-yellow)":"var(--ui-text-quaternary)"}function dt(e){return e===null?null:e==="error"?"err":e==="ok"?"ok":"run"}function ct({text:e,onCopy:r}){let[n,a]=b(!1);return j(()=>{if(!n)return;let i=window.setTimeout(()=>{a(!1)},1600);return()=>{window.clearTimeout(i)}},[n]),s("button",{type:"button",className:"rp-button rp-button-sm rp-quiet","aria-label":"Copy payload",onClick:()=>{try{r(e),a(!0)}catch{}},children:[o(S,{name:n?"check":"copy",size:12}),n?"Copied":"Copy"]})}function mt({detail:e,onCopy:r}){if(e===null)return s("div",{className:"rp-inspect-empty",children:[o(S,{name:"info",size:14}),o("span",{children:"Select an event to inspect its payload."})]});let n=Sr(e.payload),a=dt(e.status);return s("div",{className:"rp-inspect",children:[s("div",{className:"rp-inspect-head",children:[s("span",{title:e.kind,className:"rp-inspect-kind",style:{color:zr(e.kind,e.status)},children:[o("span",{className:"rp-dot"}),Mr(e.kind)]}),o("span",{className:"rp-inspect-name",title:e.name??e.kind,children:e.name??e.kind}),a!==null?o("span",{className:"rp-badge","data-tone":a,children:e.status}):null]}),s("div",{className:"rp-inspect-meta",children:[s("span",{className:"rp-mono",children:["#",e.id]}),o("span",{className:"rp-inspect-sep",children:"\xB7"}),s("span",{className:"rp-mono",children:["seq ",e.seq]}),e.duration_ms!==null?s(Fe,{children:[o("span",{className:"rp-inspect-sep",children:"\xB7"}),o("span",{className:"rp-mono",title:`${e.duration_ms} ms`,children:ze(e.duration_ms)})]}):null]}),s("div",{className:"rp-json-card",children:[s("div",{className:"rp-json-head",children:[o("span",{className:"rp-json-lang",children:"json"}),o(ct,{text:n,onCopy:r})]}),o("pre",{className:"rp-json",children:Nr(n).map((i,u)=>o("span",{className:`rp-j-${i.type}`,children:i.text},u))})]})]})}function ft({ctx:e,branchId:r,refreshTick:n,onClose:a,onRefresh:i}){let[u,_]=b(null),[d,W]=b(null),[D,y]=b(!1),[V,T]=b(null),[k,P]=b(null),A=Ke(null);j(()=>{let v=!1,w=null,q=async()=>{try{let N=await rr(e,r);if(v)return!0;_(N),T(null);let ue=N.branch.child_session_id;if(ue!==null){let pe=await tr(e,N.branch.parent_session_id,ue,N.branch.fork_before_ts);v||W(pe)}else W(null);return it.has(N.branch.state)}catch(N){return v||T(R(N)),!1}},ee=async()=>{let N=await q();!v&&!N&&(w=e.setTimeout(()=>{ee()},2500))};return ee(),()=>{v=!0,w!==null&&w()}},[e,r,n]);let X=async()=>{y(!0),T(null);try{await ar(e,r),i()}catch(v){T(R(v))}finally{y(!1)}},O=async v=>{y(!0),T(null),P(null);try{await Oe(e,r),i()}catch(w){T(R(w)),P(v)}finally{y(!1)}},Q=async()=>{y(!0),T(null);try{let v=await sr(e,r);v.uncommitted===0?(await Oe(e,r),i()):P(v)}catch(v){T(R(v))}finally{y(!1)}};if(j(()=>{P(null)},[r]),j(()=>{if(k===null)return;let v=w=>{w.key==="Escape"&&Tr()&&P(null)};return window.addEventListener("keydown",v),()=>{window.removeEventListener("keydown",v)}},[k]),j(()=>{if(k===null)return;let v=document.activeElement;return A.current?.focus(),()=>{v instanceof HTMLElement&&v.focus()}},[k]),u===null)return o("div",{className:"rp-meta",children:"Loading branch..."});let h=u.branch,C=u.run,f=C?.verify_exit??d?.right?.verify_exit??null,ye=h.verify_cmd?h.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",U=h.worktree_path?void 0:"This branch has no workspace left to remove.";return s("div",{className:"rp-stack",children:[s("div",{className:"rp-branch-head",children:[s("div",{className:"rp-branch-title",children:[s("span",{children:["Branch ",Z(h.id)]}),s("span",{className:"rp-badge","data-tone":Er(h.state),children:[o("span",{className:"rp-dot"}),h.state]}),C!==null&&C.verify_exit!==null?s("span",{className:"rp-badge","data-tone":C.verify_exit===0?"ok":"err",children:["verify ",je(C.verify_exit)]}):null]}),s("div",{className:"rp-branch-actions",children:[o("button",{type:"button",className:"rp-button rp-button-sm",title:ye,onClick:()=>{X()},disabled:D||!h.verify_cmd||!h.worktree_path,children:"Verify"}),o("button",{type:"button",className:"rp-button rp-button-sm",title:U,onClick:()=>{Q()},disabled:D||!h.worktree_path,children:"Cleanup"}),o("button",{type:"button",className:"rp-button rp-button-sm rp-quiet",onClick:a,children:"Hide"})]})]}),u.shared_child?o("div",{className:"rp-note rp-note-warn",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,V!==null?o("div",{className:"rp-error",children:V}):null,k!==null?s("div",{className:"rp-confirm",ref:A,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[o("div",{className:"rp-confirm-copy",children:mr(k.uncommitted)}),o("div",{className:"rp-confirm-path",children:k.worktree_path}),s("div",{className:"rp-confirm-actions",children:[o("button",{type:"button",className:"rp-button rp-button-sm rp-delete",onClick:()=>{O(k)},disabled:D,children:"Delete workspace"}),o("button",{type:"button",className:"rp-button rp-button-sm",onClick:()=>{P(null)},children:"Cancel"})]})]}):null,d!==null?s("div",{className:"rp-stack",children:[s("div",{className:"rp-compare",children:[s("div",{className:"rp-panel",children:[s("div",{className:"rp-card-label",children:["Original",d.left?.frozen_at?` \xB7 frozen ${se(d.left.frozen_at)}`:""]}),s("div",{className:"rp-metrics",children:[o(le,{label:"outcome",value:d.left===null?"not recorded":ur(d.left.outcome),tone:d.left===null?"idle":Ce(d.left.outcome)}),o(le,{label:"tokens",value:d.left===null?"n/a":be(d.left.tokens_in+d.left.tokens_out)}),o(le,{label:"tool errors",value:d.left===null?"n/a":String(d.left.tool_errors),tone:d.left!==null&&d.left.tool_errors>0?"err":"idle"})]})]}),s("div",{className:"rp-panel",children:[o("div",{className:"rp-card-label rp-card-label-accent",children:"Rerun"}),s("div",{className:"rp-metrics",children:[o(le,{label:"outcome",value:d.right===null?"not recorded":Se(d.right.outcome),tone:d.right===null?"idle":Ce(d.right.outcome)}),o(le,{label:"verify",value:f===null?"not run":je(f),tone:f===null?"idle":f===0?"ok":"err"}),o(le,{label:"tokens",value:d.right===null?"n/a":be(d.right.tokens_in+d.right.tokens_out)}),o(le,{label:"tool errors",value:d.right===null?"n/a":String(d.right.tool_errors),tone:d.right!==null&&d.right.tool_errors>0?"err":"idle"})]})]})]}),s("div",{className:"rp-verdict",children:[o(S,{name:"info",size:13}),s("span",{children:[o("strong",{children:"Verdict"})," ",d.verdict]})]})]}):o("div",{className:"rp-meta",children:h.state==="cleaned"||h.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),C!==null&&C.verify_out?o("pre",{className:"rp-pre",children:C.verify_out}):null,u.prompt!==null?s("details",{className:"rp-panel rp-disclosure",children:[o("summary",{children:"Prompt"}),o("pre",{className:"rp-pre",children:u.prompt})]}):null]})}function Ir({ctx:e}){let r=rt(et.state.activeSessionId),[n,a]=b([]),[i,u]=b(null),[_,d]=b([]),[W,D]=b(!1),[y,V]=b(!1),[T,k]=b(null),[P,A]=b({}),[X,O]=b([]),[Q,h]=b([]),[C,f]=b(null),[ye,U]=b(null),[v,w]=b(null),[q,ee]=b(null),[N,ue]=b(0),[pe,Y]=b(null),[M,ke]=b(0),[de,oe]=b(!1),[Ae,G]=b(!1),[Te,re]=b(null),[ce,_e]=b(""),[ae,ie]=b(ot),[Me,me]=b(!1),K=Ke(null),fe=Ke(ae);j(()=>{fe.current=ae},[ae]),j(()=>{let t=null,m=e.onEvent("*",()=>{t===null&&(t=e.setTimeout(()=>{t=null,ke(L=>L+1)},1500))});return()=>{m(),t!==null&&t()}},[e]),j(()=>{if(v===null||q!==null)return;let t=m=>{m.key==="Escape"&&!Tr()&&w(null)};return window.addEventListener("keydown",t),()=>{window.removeEventListener("keydown",t)}},[v,q]),j(()=>{let t=!1,m=async()=>{try{let $=await Ye(e);if(t)return;a($),oe(!0),Y(null),u(te=>te!==null&&$.some(ne=>ne.session_id===te)?te:r??$[0]?.session_id??null)}catch($){t||Y(R($))}};m();let L=e.setInterval(()=>{m()},1e4);return()=>{t=!0,L()}},[e,r,N,M]),j(()=>{if(i===null){d([]),G(!1),D(!1),re(null),O([]),h([]);return}let t=!1,m=async()=>{try{let[$,te,ne]=await Promise.all([He(e,i),Qe(e,i),er(e,i)]);if(t)return;d(qe=>Ve(i,$.items,qe)),D($.has_more),G(!0),O(te),h(ne),re(null),Y(null)}catch($){t||(G(!0),re(R($)))}};m();let L=e.setInterval(()=>{m()},1e4);return()=>{t=!0,L()}},[e,i,N,M]),j(()=>{if(C===null){U(null);return}let t=!1;return Ze(e,C).then(m=>{t||U(m)}).catch(m=>{t||Y(R(m))}),()=>{t=!0}},[e,C]);let g=n.find(t=>t.session_id===i)??null,l=ce.trim().toLowerCase(),c=l===""?n:n.filter(t=>`${t.title??""} ${t.model??""} ${t.session_id}`.toLowerCase().includes(l)),E=g!==null&&g.ended_at===null,z=E&&g.session_id===r,B=i===null?[]:_.filter(t=>t.session_id===i),ge=t=>{u(t.session_id),f(null),w(null),k(null),A({}),d([]),G(!1),D(!1),re(null),O([]),h([])},ve=()=>{ue(t=>t+1)},Ee=t=>{if(T===t.id){k(null);return}k(t.id),P[t.id]===void 0&&Ge(e,t.session_id,t.seq,t.seq_to).then(m=>{A(L=>({...L,[t.id]:m}))}).catch(m=>{Y(R(m))})},I=async()=>{let t=B[B.length-1];if(!(i===null||t===void 0)){V(!0);try{let m=await He(e,i,t.seq);d(L=>Ve(i,m.items,L)),D(m.has_more)}catch(m){Y(R(m))}finally{V(!1)}}};return s("div",{className:"rw-page rp-shell",children:[o("style",{children:at}),s("header",{className:"rp-head",children:[s("div",{className:"rp-head-left",children:[o("span",{className:"rp-mark",children:o(S,{name:"rewind",size:16})}),s("div",{children:[o("div",{className:"rp-title",children:"Session Rewind"}),o("div",{className:"rp-sub",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]})]}),s("div",{className:"rp-head-right",children:[g!==null?o("span",{className:"rp-pill rp-mono",title:g.model??void 0,children:g.model??"unknown model"}):null,E?s("span",{className:"rp-live",children:[o("span",{className:"rp-dot"}),z?"live":"running"]}):null,s("button",{type:"button",className:"rp-button",onClick:ve,children:[o(S,{name:"refresh",size:13}),"Refresh"]})]})]}),pe!==null?o("div",{className:"rp-error",children:pe}):null,s("div",{className:"rp-columns",children:[s("aside",{className:"rp-side",children:[s("div",{className:"rp-eyebrow",children:[o("span",{className:"rp-dot"}),"Sessions",de?o("span",{className:"rp-eyebrow-count",children:pr(c.length,Be)}):null]}),de&&n.length>0?o("input",{type:"text",className:"rp-search",placeholder:"Filter sessions...","aria-label":"Filter sessions",value:ce,onChange:t=>{_e(t.target.value)},onKeyDown:t=>{t.key==="Escape"&&ce!==""&&(_e(""),t.preventDefault(),t.stopPropagation())}}):null,de?n.length===0?s("div",{className:"rp-meta rp-empty",children:[o(S,{name:"info",size:13}),"Start a chat and Rewind will record every turn."]}):c.length===0?o("div",{className:"rp-meta",children:"No session matches the filter."}):o("div",{className:"rp-cards",children:c.map(t=>s("button",{type:"button",className:"rp-session","aria-current":i===t.session_id?"true":void 0,onClick:()=>{ge(t)},children:[s("span",{className:"rp-session-title",children:[o("span",{className:"rp-dot",style:{color:pt(Ce(t.outcome))}}),o("span",{title:t.title??Z(t.session_id),children:t.title??Z(t.session_id)}),o("span",{className:"rp-session-when",children:t.last_event_at!==null?lr(t.last_event_at):""})]}),s("span",{className:"rp-meta",children:[t.model??"unknown model"," \xB7 ",J(t.event_count,"event")]}),s("span",{className:"rp-meta rp-meta-dim",children:[Se(t.outcome)," \xB7"," ",be(t.tokens_in+t.tokens_out)," tokens"]})]},t.session_id))}):o("div",{className:"rp-meta",children:"Loading sessions..."})]}),s("main",{className:"rp-main",children:[g!==null?s("div",{className:"rp-detail-head",children:[s("div",{className:"rp-stack",style:{gap:5},children:[o("div",{className:"rp-detail-title",children:g.title??Z(g.session_id)}),s("div",{className:"rp-stats",children:[X.length>0?o(Re,{label:"snapshot",value:String(X.length)}):null,o(Re,{label:"events",value:be(g.event_count)}),o(Re,{label:"tokens",value:be(g.tokens_in+g.tokens_out)}),g.ended_at!==null?o(Re,{label:"window",value:`${se(g.started_at)} \u2192 ${se(g.ended_at)}`}):null,o(Re,{label:"outcome",value:Se(g.outcome),mono:!1,tone:Ce(g.outcome)})]}),s("div",{className:"rp-meta",children:[g.model??"unknown model",g.ended_at===null?` \xB7 ${dr(g.last_event_at)}`:""]})]}),o("div",{className:"rp-hint",children:"Select a user turn and choose Rewind."})]}):null,Q.length>0?s("div",{children:[s("div",{className:"rp-eyebrow",children:[o("span",{className:"rp-dot"}),"Branches",o("span",{className:"rp-eyebrow-count",children:Q.length})]}),o("div",{className:"rp-chips",children:Q.map(t=>s("button",{type:"button",className:"rp-chip","aria-current":v===t.id?"true":void 0,onClick:()=>{w(t.id)},children:[o("span",{className:"rp-mono",children:Z(t.id)}),s("span",{className:"rp-badge","data-tone":Er(t.state),children:[o("span",{className:"rp-dot"}),t.state]}),o("span",{className:"rp-chip-note",children:t.fork_row_count>0?J(t.fork_row_count,"message"):"context pack"})]},t.id))})]}):null,s("div",{className:"rp-columns",style:{gap:0,"--rp-payload-width":`${ae}px`},children:[o("div",{className:"rp-turns",children:s("div",{className:"rp-stack",style:{width:"100%"},children:[s("div",{className:"rp-eyebrow",children:[o("span",{className:"rp-dot"}),"Turns"]}),g===null?o("div",{className:"rp-meta",children:"Select a recorded session."}):Ae?B.length===0?o("div",{className:"rp-meta",children:cr(g.event_count,Te)}):s(Fe,{children:[B.map(t=>o(lt,{turn:t,expanded:T===t.id,events:P[t.id]??null,loading:T===t.id&&P[t.id]===void 0,selectedEventId:C,onToggle:()=>{Ee(t)},onFork:()=>{g!==null&&ee({session:g,event:t})},onSelectEvent:m=>{f(m.id)}},t.id)),W?o("button",{type:"button",className:"rp-load-more",onClick:()=>{I()},disabled:y,children:y?"Loading...":"Load earlier turns"}):s("div",{className:"rp-tail",children:[J(B.length,"turn")," \xB7 start of the recording"]})]}):o("div",{className:"rp-meta",children:"Loading turns..."})]})}),o("div",{role:"separator","aria-orientation":"vertical","aria-label":"Resize event payload panel",tabIndex:0,className:"rp-divider","data-dragging":Me?"true":void 0,onPointerDown:t=>{K.current={startX:t.clientX,startWidth:ae},me(!0),t.currentTarget.setPointerCapture(t.pointerId)},onPointerMove:t=>{let m=K.current;m!==null&&ie($e(m.startWidth-(t.clientX-m.startX)))},onPointerUp:t=>{K.current!==null&&(K.current=null,me(!1),Le(fe.current),t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId))},onPointerCancel:t=>{K.current!==null&&(K.current=null,me(!1),t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId))},onKeyDown:t=>{if(t.key==="ArrowLeft"){let m=$e(fe.current+16);ie(m),Le(m),t.preventDefault()}else if(t.key==="ArrowRight"){let m=$e(fe.current-16);ie(m),Le(m),t.preventDefault()}},onDoubleClick:()=>{ie(we),Le(we)}}),s("div",{className:"rp-payload",children:[s("div",{className:"rp-eyebrow",children:[o("span",{className:"rp-dot"}),"Event payload"]}),o(mt,{detail:ye,onCopy:t=>{e.os.writeClipboard(t)}})]})]})]})]}),v!==null?o("div",{className:"rp-compare-wrap",children:o(ft,{ctx:e,branchId:v,refreshTick:N,onClose:()=>{w(null)},onRefresh:ve})}):null,q!==null?o(_r,{ctx:e,session:q.session,event:q.event,onClose:()=>{ee(null)},onCreated:t=>{w(t),ve()}}):null]})}import{jsx as Dr}from"react/jsx-runtime";var yt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let r=()=>{gt.navigate(xe)};e.registerMany([{id:"page",area:bt,data:{path:xe},render:()=>Dr(Ir,{ctx:e})},{id:"nav",area:ht,data:{path:xe,label:"Rewind",codicon:"history"}},{id:"palette-open",area:xt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:r}},{id:"keybind-open",area:vt,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:r}},{id:"chip",area:wt.right,order:130,render:()=>Dr(Xe,{})}])}},sn=yt;export{sn as default};
