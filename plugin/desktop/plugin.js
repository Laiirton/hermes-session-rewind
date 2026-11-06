import{host as ct,KEYBINDS_AREA as mt,PALETTE_AREA as ft,ROUTES_AREA as gt,SIDEBAR_NAV_AREA as vt,STATUSBAR_AREAS as xt}from"@hermes/plugin-sdk";import{host as Ue,useValue as Ir}from"@hermes/plugin-sdk";var ce="/rewind";import{jsx as Dr,jsxs as Lr}from"react/jsx-runtime";function Ke(){let e=Ir(Ue.state.activeSessionId);return Lr("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{Ue.navigate(ce)},title:"Open Session Rewind",children:[Dr("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as Zr,useValue as Qr}from"@hermes/plugin-sdk";import{Fragment as et,useEffect as O,useRef as je,useState as x}from"react";function he(e,r,t){return e.rest(r,{method:"POST",body:t})}var Le=100;async function Je(e){return(await e.rest(`/sessions?limit=${Le}`)).items}async function Ae(e,r,t=null){let a=t===null?"":`&before_seq=${t}`;return e.rest(`/sessions/${encodeURIComponent(r)}/turns?limit=40${a}`)}async function Xe(e,r,t,a){return(await e.rest(`/sessions/${encodeURIComponent(r)}/events?limit=200&after_seq=${t-1}&before_seq=${a+1}`)).items}function Ye(e,r){return e.rest(`/events/${r}`)}function Ge(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/snapshots`)}function Ze(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/branches`)}function Qe(e,r){return he(e,`/branches/${encodeURIComponent(r)}/reconcile`,{})}function er(e,r,t,a=null){let i=a===null?"":`&before_ts=${a}`;return e.rest(`/compare?left=${encodeURIComponent(r)}&right=${encodeURIComponent(t)}${i}`)}function rr(e,r){return he(e,"/forks/prepare",r)}function tr(e,r,t){return he(e,`/forks/${encodeURIComponent(r)}/commit`,t)}function nr(e,r){return he(e,`/forks/${encodeURIComponent(r)}/verify`,{})}function or(e,r,t){return e.rest(`/branches/${encodeURIComponent(r)}/verify-resolve?cmd=${encodeURIComponent(t)}`)}function ar(e,r){return e.rest(`/forks/${encodeURIComponent(r)}/workspace`)}function Fe(e,r){return he(e,`/forks/${encodeURIComponent(r)}/cleanup`,{})}function we(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ye(e){return e.toLocaleString()}function Ce(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Ar=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function R(e){let r=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",t=Ar.exec(r),a=t?.[1];if(t===null||a===void 0)return r;let i=Fr(a);return i===void 0?r:r.replace(t[0],i)}function Fr(e){try{let r=JSON.parse(e);return typeof r.detail=="string"&&r.detail.length>0?r.detail:void 0}catch{return}}function ne(e,r=8){return e.length<=r?e:e.slice(0,r)}function B(e,r){return`${e} ${e===1?r:`${r}s`}`}function $e(e){return e===0?"passed":`failed (exit ${e})`}var $r={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function Pe(e){return e===null?"recording":$r[e]??e}function qe(e){return e===null?"warn":e==="completed"?"ok":e==="failed"?"err":"idle"}function ir(e){return e===null?"open at freeze":Pe(e)}function sr(e,r){return e===0?"":e>=r?`${r}+`:`${e}`}function qr(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function lr(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${qr(e)}`}function ur(e,r){return r!==null?`The turns could not be loaded: ${r}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${B(e,"event")} but no user turn.`}function dr(e){return e===null?"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.":`This workspace holds ${B(e,"uncommitted file")}. Deleting it removes them for good; the rerun conversation stays in the recording.`}import{host as H}from"@hermes/plugin-sdk";import{useCallback as Or,useEffect as ke,useRef as Be,useState as A}from"react";function Br(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let r=e.content;return typeof r=="string"?r.trim():Array.isArray(r)?r.map(t=>{if(typeof t!="object"||t===null||!("text"in t))return"";let a=t.text;return typeof a=="string"?a:""}).join("").trim():""}function pr(e,r){let t=(e??[]).filter(u=>(u.role==="user"||u.role==="assistant")&&Br(u).length>0&&typeof u.row_id=="number"),a=-1;for(let u=0;u<t.length;u+=1){let N=t[u];if(N===void 0)continue;let d=N.timestamp;N.role==="user"&&typeof d=="number"&&d<=r+.5&&(a=u)}if(a<=0)return null;let i=t[a-1]?.row_id;return typeof i=="number"&&i>0?i:null}var cr={providers:[],currentModel:null,currentProvider:null};function Re(e){return typeof e=="string"?e.trim():""}function mr(e){let r=Re(e);return r===""?null:r}function fr(e){if(e===null||typeof e!="object")return cr;let r=e.providers;if(!Array.isArray(r))return cr;let t=[];for(let a of r){if(a===null||typeof a!="object")continue;let i=a,u=Re(i.slug),N=Array.isArray(i.models)?i.models.map(Re).filter(d=>d!==""):[];u===""||N.length===0||t.push({slug:u,name:Re(i.name)||u,isCurrent:i.is_current===!0,models:N})}return{providers:t,currentModel:mr(e.model),currentProvider:mr(e.provider)}}function gr(e,r){return[...e.providers].sort((t,a)=>{let i=r!==null&&t.slug===r?0:1,u=r!==null&&a.slug===r?0:1;return i!==u?i-u:t.isCurrent!==a.isCurrent?t.isCurrent?-1:1:t.name.localeCompare(a.name)})}function vr(e,r){let t=r.trim().toLowerCase();if(t==="")return e;let a=[];for(let i of e){if(i.name.toLowerCase().includes(t)||i.slug.toLowerCase().includes(t)){a.push(i);continue}let u=i.models.filter(N=>N.toLowerCase().includes(t));u.length>0&&a.push({...i,models:u})}return a}function xr(e,r){let t=r===null?"":` --provider ${r}`;return`${e}${t} --session`}function br(e,r,t,a){return e===""?!1:e!==(t??"")||r!==a}import{jsx as hr}from"react/jsx-runtime";var Hr={rewind:"M3 12a9 9 0 1 0 3-6.7M3 4v5h5",refresh:"M20 11a8 8 0 0 0-14 5l-2 2M4 13a8 8 0 0 0 14-5l2-2",branch:"M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0-3-3M15 9v3a3 3 0 0 0 3 3h3",lock:"M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",folder:"M3 7h6l2 2h10v11H3z",close:"M5 5l14 14M19 5L5 19",chevron:"M9 6l6 6-6 6",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01",copy:"M9 9h11v11H9zM5 15V5a1 1 0 0 1 1-1h10",check:"M4 12l5 5L20 7",message:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",reply:"M9 14L4 9l5-5M20 20v-7a4 4 0 0 0-4-4H4",tool:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",inbox:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8",layers:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",event:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18"};function T({name:e,size:r=14,className:t}){return hr("svg",{"aria-hidden":"true",className:t,viewBox:"0 0 24 24",width:r,height:r,fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round",focusable:"false",children:hr("path",{d:Hr[e]})})}import{Fragment as Xr,jsx as p,jsxs as v}from"react/jsx-runtime";var jr=["python -m pytest -q","npm test","cargo test","go test ./..."],Wr=350,Vr=400;function me(e,r){return r.catch(t=>{throw new Error(`${e}: ${R(t)}`)})}function Ur(e){if(e===null)return[];let r=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(r).filter(t=>!t.hasAttribute("disabled"))}function Kr(e,r){let t=Ur(e),a=t[0],i=t[t.length-1];if(e===null||a===void 0||i===void 0)return;let u=document.activeElement;if(!e.contains(u)){r.preventDefault(),a.focus();return}r.shiftKey&&u===a?(r.preventDefault(),i.focus()):!r.shiftKey&&u===i&&(r.preventDefault(),a.focus())}var Jr=`
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
  font-size: 11px;
  color: var(--ui-text-tertiary);
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
  letter-spacing: 0.08em;
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
`;function wr({ctx:e,session:r,event:t,onClose:a,onCreated:i}){let[u,N]=A(""),[d,j]=A(null),[D,y]=A({providers:[],currentModel:null,currentProvider:null}),[W,M]=A(!1),[_,P]=A(!1),[F,K]=A(""),[V,Z]=A(""),[b,C]=A(""),[f,ge]=A(null),[U,g]=A(null),[h,$]=A(null),[Q,S]=A(null),[ue,de]=A(!1),J=Be([]),E=h!==null,ve=Be(null),xe=Be(()=>{}),oe=Or(()=>{E||(de(!0),J.current.push(e.setTimeout(a,100)))},[E,e,a]);ke(()=>{let l=J.current;return()=>{for(let c of l)c()}},[]),ke(()=>{let l=document.activeElement;return ve.current?.focus(),()=>{l?.focus()}},[]),ke(()=>{let l=c=>{if(c.key==="Escape"&&!E){if(_){P(!1);return}oe();return}if(c.key==="Tab"){Kr(ve.current,c);return}if(c.key==="Enter"&&(c.metaKey||c.ctrlKey)&&!E){if(_)return;c.preventDefault(),xe.current()}};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[E,oe,_]),ke(()=>{let l=b.trim();if(f===null||l===""){g(null);return}let c=!1,z=e.setTimeout(()=>{or(e,f.branch_id,l).then(I=>{c||g(I)}).catch(()=>{c||g(null)})},Wr);return()=>{c=!0,z()}},[e,f,b]),ke(()=>{let l=!1;return H.request("model.options",{explicit_only:!0,include_unconfigured:!1}).then(c=>{if(l)return;let z=fr(c);y(z),M(z.providers.length===0)}).catch(()=>{l||M(!0)}),()=>{l=!0}},[]);let Ie=gr(D,r.provider),X=vr(Ie,F),_e=u.trim()===""?r.model??"":u.trim(),ee=d??r.provider,re=ee===null?"":D.providers.find(l=>l.slug===ee)?.name??ee,ae=(l,c)=>{N(c),j(l),P(!1),K("")},De=()=>{N(""),j(null),P(!1),K("")},pe=async()=>{let l=await H.request("session.active_list",{}),c=Array.isArray(l.sessions)?l.sessions:[],z=c.find(I=>I.session_key===r.session_id)?.id??c.find(I=>I.id===r.session_id)?.id;if(z===void 0)return{runtimeId:void 0,storedId:r.stored_session_id};try{let I=await H.request("session.title",{session_id:z});return{runtimeId:z,storedId:I.session_key??r.stored_session_id}}catch{return{runtimeId:z,storedId:r.stored_session_id}}},Y=async()=>{$("prepare"),S(null);try{let l=await pe(),c=await rr(e,{session_id:r.session_id,stored_session_id:l.storedId,event_id:t.id,model:u.trim()||null,provider:d,prompt:V.trim()||null,verify_cmd:b.trim()||null});ge(c),Z(c.prompt),c.verify_presets.length>0&&b.trim()===""&&C(c.verify_presets[0]??"")}catch(l){S(R(l))}finally{$(null)}},ie=async()=>{if(f!==null){$("run"),S(null);try{let l=await pe(),c=l.runtimeId,z=`\u21BA ${r.title??ne(r.session_id)} \xB7 ${ne(f.branch_id)}`,I=null;if(c!==void 0)try{let w=await H.request("session.history",{session_id:c});I=pr(w.messages,f.fork_before_ts)}catch{I=null}let te,n,m=!1;if(I!==null&&c!==void 0){let w=await me("could not branch the session",H.request("session.branch",{session_id:c,through_message_id:I}));te=w.session_id,n=w.stored_session_id}else{let w={source:"desktop",title:z};f.worktree_path!==null&&(w.cwd=f.worktree_path),l.storedId!==null&&(w.parent_session_id=l.storedId);let L=await me("could not create the branch session",H.request("session.create",w));te=L.session_id,n=L.stored_session_id,m=!0}if(m&&f.worktree_path!==null){let w=()=>H.request("session.cwd.set",{session_id:te,cwd:f.worktree_path});try{await me("could not attach the isolated workspace",w())}catch(L){throw L instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${R(L)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(await me("could not open the rerun session",H.openSession(n,{intent:"tab"})),br(u.trim(),d,r.model,r.provider)){let w=xr(u.trim(),d),L=()=>H.request("config.set",{key:"model",value:w,session_id:te,confirm_expensive_model:!1}),se=!1,be=null,We="";for(let Ve=0;Ve<2&&!se;Ve+=1)try{let Se=await L();se=!0,be=Se.confirm_required===!0?Se.confirm_message??null:null}catch(Se){We=R(Se),await new Promise(zr=>{setTimeout(zr,Vr)})}se?be!==null&&H.notify({kind:"info",message:be,detail:`The rerun started before the switch could be confirmed; ${u.trim()} applies from the next turn.`}):H.notify({kind:"warning",message:`The rerun runs on ${r.model??"the session model"}, not ${u.trim()}.`,detail:We})}let q=V.trim()||f.prompt;await me("could not record the branch",tr(e,f.branch_id,{child_session_id:te,child_stored_session_id:n,model:u.trim()||r.model,provider:d??r.provider,prompt:q,verify_cmd:b.trim()||null})),await me("could not start the rerun",H.request("prompt.submit",{session_id:te,text:q})),i(f.branch_id),a()}catch(l){S(R(l))}finally{$(null)}}};xe.current=()=>{f===null?Y():ie()};let k=f!==null,Ne=b.trim(),G=[];return k?(f.fidelity!=="full"&&G.push({warn:!0,text:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}),f.context_rows===null&&G.push({warn:!0,text:"The live transcript prefix is unavailable. The context pack is the only context."}),r.ended_at!==null&&G.push({warn:!1,text:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}),f.fork_row_count===0&&r.ended_at===null&&G.push({warn:!1,text:"This is the first turn. The rerun starts a fresh chat in the restored workspace."})):G.push({warn:!1,text:"Prepare reads the recorded context for this turn and drafts the rerun prompt. Nothing runs until you fork."}),v("div",{className:"rw-overlay","data-closing":ue?"true":"false",onMouseDown:l=>{l.target===l.currentTarget&&oe()},children:[p("style",{children:Jr}),v("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title","aria-describedby":"rw-reassure",tabIndex:-1,ref:ve,children:[v("header",{className:"rw-head",children:[p("span",{className:"rw-mark",children:p(T,{name:"rewind",size:16})}),v("div",{className:"rw-heading",children:[p("div",{className:"rw-eyebrow",children:"Session Rewind"}),p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"})]}),p("button",{type:"button",className:"rw-close",onClick:oe,disabled:E,"aria-label":"Close",children:p(T,{name:"close",size:15})})]}),v("div",{className:"rw-body",children:[v("div",{className:"rw-turn",children:[p("span",{className:"rw-turn-time",children:we(t.ts)}),p("span",{className:"rw-turn-text",children:t.preview||"user turn"})]}),Q!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:Q}):null,k&&f.worktree_path?v("div",{className:"rw-path",children:[p("span",{className:"rw-path-text",title:f.worktree_path,children:f.worktree_path}),p("button",{type:"button",className:"rw-icon-button",onClick:()=>{e.os.revealPath(f.worktree_path??"")},disabled:E,"aria-label":"Reveal the isolated workspace",children:p(T,{name:"folder",size:13})})]}):null,G.length>0?p("div",{className:"rw-notes",children:G.map(l=>v("div",{className:`rw-note${l.warn?" rw-note-warn":""}`,role:l.warn?"status":void 0,children:[p(T,{name:"info"}),p("span",{children:l.text})]},l.text))}):null,v("div",{className:"rw-grid",children:[v("div",{className:"rw-field",children:[p("span",{className:"rw-label",id:"rw-model-label",children:"Model"}),v("button",{type:"button",className:`rw-trigger${_?" rw-trigger-open":""}`,onClick:()=>{P(!_)},disabled:E,"aria-haspopup":"listbox","aria-expanded":_,"aria-labelledby":"rw-model-label rw-model-value",children:[p("span",{className:"rw-trigger-text",id:"rw-model-value",children:_e===""?"Session model":_e}),re===""?null:p("span",{className:"rw-trigger-provider",children:re}),p("span",{className:"rw-trigger-caret","aria-hidden":"true","data-open":_,children:p(T,{name:"chevron",size:12})})]}),_?v("div",{className:"rw-picker",children:[p("input",{className:"rw-search",value:F,onChange:l=>{K(l.target.value)},onKeyDown:l=>{let c=X[0];l.key==="Enter"&&c!==void 0&&(l.preventDefault(),ae(c.slug,c.models[0]??""))},placeholder:"Search models","aria-label":"Search models",autoFocus:!0}),v("div",{className:"rw-picker-list",role:"listbox","aria-label":"Models",children:[v("button",{type:"button",className:"rw-option rw-option-keep",role:"option","aria-selected":u.trim()==="",onClick:De,children:["Keep the session model",r.model===null?null:p("span",{className:"rw-option-sub",children:r.model})]}),X.map(l=>v("div",{className:"rw-group",role:"group","aria-label":l.name,children:[v("div",{className:"rw-group-head",children:[p("span",{children:l.name}),p("span",{className:"rw-count",children:l.models.length})]}),l.models.map(c=>v("button",{type:"button",className:"rw-option",role:"option","aria-selected":c===u.trim()&&l.slug===d,onClick:()=>{ae(l.slug,c)},children:[p("span",{className:"rw-option-text",children:c}),c===r.model?p("span",{className:"rw-option-tag",children:"session"}):null]},c))]},l.slug)),X.length===0&&F.trim()!==""?p("button",{type:"button",className:"rw-option",role:"option",onClick:()=>{N(F.trim()),j(null),P(!1),K("")},children:v("span",{className:"rw-option-text",children:["Use \u201C",F.trim(),"\u201D as typed"]})}):null,X.length===0&&F.trim()===""?p("div",{className:"rw-picker-empty",children:"No configured provider offers a model."}):null]})]}):null,p("span",{className:"rw-help",children:W?"Could not read the model list, so the rerun keeps the session model.":"Lists the providers configured in Hermes."})]}),v("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:b,onChange:l=>{C(l.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(f?.verify_presets.length?f.verify_presets:jr).map(l=>p("button",{type:"button",className:"rw-preset","aria-pressed":l===Ne,onClick:()=>{C(l)},disabled:E,children:l},l))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),U!==null&&U.command===b.trim()?p("span",{className:"rw-resolved",children:U.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":v(Xr,{children:[p("span",{children:"Resolves to"}),p("span",{className:"rw-resolved-path",title:U.resolved,children:U.resolved})]})}):null]})]}),v("label",{className:"rw-field",children:[v("span",{className:"rw-label-row",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),v("span",{className:"rw-count","aria-live":"polite",children:[V.length," chars"]})]}),p("textarea",{className:"rw-textarea",value:V,onChange:l=>{Z(l.target.value)},placeholder:"Prepare the branch to draft the rerun prompt, or write your own."})]})]}),v("footer",{className:"rw-footer",children:[v("span",{className:"rw-reassure",id:"rw-reassure",children:[p(T,{name:"lock",size:13}),p("span",{children:"Original session and workspace stay untouched."})]}),v("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:oe,disabled:E,children:"Cancel"}),k?v("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{ie()},disabled:E,"aria-busy":h==="run",children:[h==="run"?p("span",{className:"rw-spinner"}):null,h==="run"?"Forking":"Fork & run",h==="run"?null:p("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]}):v("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{Y()},disabled:E,"aria-busy":h==="prepare",children:[h==="prepare"?p("span",{className:"rw-spinner"}):null,h==="prepare"?"Preparing":"Prepare branch",h==="prepare"?null:p("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]})]})]})]})]})}function He(e,r,t){let a=new Set(r.map(u=>u.id)),i=t.filter(u=>u.session_id===e&&!a.has(u.id));return[...r,...i]}function Yr(e){let r=e.trim();if(r.length<2)return!1;let t=r[0];return t==="{"&&r.endsWith("}")||t==="["&&r.endsWith("]")}function Te(e,r=0){if(r>=4)return e;if(Array.isArray(e))return e.map(t=>Te(t,r+1));if(e!==null&&typeof e=="object"){let t={};for(let[a,i]of Object.entries(e))t[a]=Te(i,r+1);return t}if(typeof e=="string"&&Yr(e))try{let t=JSON.parse(e);if(t!==null&&typeof t=="object")return Te(t,r+1)}catch{}return e}var Gr=/(?<q>"(?:\\.|[^"\\])*")(?<c>\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\][,:]|\s+|./g;function yr(e){let r=[];for(let t of e.matchAll(Gr)){let a=t[0],i=t.groups?.q,u=t.groups?.c;if(i!==void 0){r.push({text:i,type:u!==void 0?"key":"string"}),u!==void 0&&r.push({text:u,type:"punct"});continue}a==="true"||a==="false"?r.push({text:a,type:"bool"}):a==="null"?r.push({text:a,type:"null"}):/^-?\d/.test(a)?r.push({text:a,type:"number"}):r.push({text:a,type:"punct"})}return r}function kr(e){return JSON.stringify(Te(e),null,2)}var Oe=new Set(["api_request","llm_call"]);function _r(e){let r=[],t=new Map;for(let a of e)if(!Oe.has(a.kind)){if(a.kind==="tool_call"&&a.tool_call_id!==null){let i={call:a,result:null};r.push(i),t.set(a.tool_call_id,i);continue}if(a.kind==="tool_result"&&a.tool_call_id!==null){let i=t.get(a.tool_call_id);if(i!==void 0){i.result=a;continue}}r.push({call:a,result:null})}return r}import{Fragment as ze,jsx as o,jsxs as s}from"react/jsx-runtime";var rt="[data-rw-confirm]",Sr="hermes-session-rewind:payload-width",fe=292;function Ee(e){return Number.isFinite(e)?Math.min(560,Math.max(240,Math.round(e))):fe}function tt(){try{let e=window.localStorage.getItem(Sr);return e===null?fe:Ee(Number(e))||fe}catch{return fe}}function Me(e){try{window.localStorage.setItem(Sr,String(e))}catch{}}function Cr(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(rt)!==null}var nt=`
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
  min-width: 0;
  padding: 0 6px 8px 30px;
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
  margin-top: 8px;
  font-size: 11px;
  color: var(--ui-text-tertiary);
}
.rp-payload {
  width: var(--rp-payload-width, 292px);
  flex: none;
  overflow-y: auto;
  padding-left: 18px;
  border-left: 1px solid var(--ui-stroke-tertiary);
}
.rp-divider {
  position: relative;
  z-index: 1;
  width: 5px;
  flex: none;
  margin-left: -3px;
  cursor: col-resize;
  touch-action: none;
  border-radius: 999px;
  transition: background-color 120ms ease-out;
}
.rp-divider:hover,
.rp-divider[data-dragging="true"] {
  background: color-mix(in srgb, var(--ui-accent) 45%, transparent);
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
  letter-spacing: 0.11em;
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
  letter-spacing: 0.14em;
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
`,ot=new Set(["done","failed","cleaned","discarded"]);function at(e){return Ce(Math.max(0,(e.work_ts-e.ts)*1e3))}function Nr({event:e,nested:r=!1,selected:t,onSelect:a}){let i=!r&&e.name!==null;return s("button",{type:"button",className:"rp-event","data-depth":r?"1":"0","aria-current":t?"true":void 0,onClick:a,children:[o("span",{title:e.kind,className:"rp-event-icon",style:{color:Tr(e.kind,e.status)},children:o(T,{name:st(e.kind),size:12})}),o("span",{title:e.kind,className:"rp-event-kind",children:Pr(e.kind)}),s("span",{className:"rp-event-text",children:[i?o("span",{className:"rp-event-name",children:e.name}):null,e.preview!==""?o("span",{className:"rp-event-preview",children:e.preview}):null]}),e.status==="error"?o("span",{className:"rp-badge","data-tone":"err",children:"error"}):null,o("span",{className:"rp-event-time rp-mono",children:Ce(e.duration_ms)})]})}function it({turn:e,expanded:r,events:t,loading:a,selectedEventId:i,onToggle:u,onFork:N,onSelectEvent:d}){let j=_r(t??[]),D=(t??[]).filter(y=>Oe.has(y.kind)).length;return s("div",{className:"rp-turn",children:[s("div",{className:"rp-turn-bar",children:[s("button",{type:"button",className:"rp-turn-row",onClick:u,"aria-expanded":r,children:[o("span",{className:"rp-caret","data-open":r?"true":"false",children:o(T,{name:"chevron",size:12})}),o("span",{className:"rp-turn-time rp-mono",children:we(e.ts)}),o("span",{className:"rp-turn-preview",children:e.preview||"User turn"}),o("span",{className:"rp-turn-stat",children:B(e.tool_calls,"tool")}),e.tool_errors>0?s("span",{className:"rp-badge","data-tone":"err",children:[o("span",{className:"rp-dot"}),B(e.tool_errors,"error")]}):null,o("span",{className:"rp-turn-duration rp-mono",children:at(e)})]}),s("button",{type:"button",className:"rp-button rp-button-sm",onClick:N,children:[o(T,{name:"rewind",size:12}),"Rewind"]})]}),r?o("div",{className:"rp-events",children:a?o("div",{className:"rp-aside-note",children:"Loading events..."}):s(ze,{children:[j.map(y=>s(et,{children:[o(Nr,{event:y.call,selected:i===y.call.id,onSelect:()=>{d(y.call)}}),y.result!==null?o(Nr,{event:y.result,nested:!0,selected:i===y.result.id,onSelect:()=>{let W=y.result;W!==null&&d(W)}}):null]},y.call.id)),D>0?s("div",{className:"rp-aside-note",children:[B(e.api_requests,"model request")," \xB7 ",B(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Pr(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function st(e){return e==="user_turn"?"message":e==="assistant_response"?"reply":e==="tool_call"?"tool":e==="tool_result"?"inbox":e==="api_request"||e==="llm_call"?"zap":e==="compaction"?"layers":"event"}function Rr(e){return e==="done"?"ok":e==="failed"?"err":e==="running"?"run":"idle"}function le({label:e,value:r,tone:t="idle"}){return s(ze,{children:[o("span",{className:"rp-metric-label",children:e}),o("span",{className:`rp-metric-value rp-tone-${t}`,children:r})]})}function Tr(e,r){return e==="tool_result"&&r==="error"?"var(--ui-red)":e==="assistant_response"||e==="tool_result"?"var(--ui-green)":e==="user_turn"?"var(--ui-accent)":e==="tool_call"?"var(--ui-purple)":e==="api_request"||e==="llm_call"?"var(--ui-orange)":e==="compaction"?"var(--ui-text-secondary)":"var(--ui-text-tertiary)"}function lt(e){return e===null?null:e==="error"?"err":e==="ok"?"ok":"run"}function ut({text:e,onCopy:r}){let[t,a]=x(!1);return O(()=>{if(!t)return;let i=window.setTimeout(()=>{a(!1)},1600);return()=>{window.clearTimeout(i)}},[t]),s("button",{type:"button",className:"rp-button rp-button-sm rp-quiet","aria-label":"Copy payload",onClick:()=>{try{r(e),a(!0)}catch{}},children:[o(T,{name:t?"check":"copy",size:12}),t?"Copied":"Copy"]})}function dt({detail:e,onCopy:r}){if(e===null)return s("div",{className:"rp-inspect-empty",children:[o(T,{name:"info",size:14}),o("span",{children:"Select an event to inspect its payload."})]});let t=kr(e.payload),a=lt(e.status);return s("div",{className:"rp-inspect",children:[s("div",{className:"rp-inspect-head",children:[s("span",{title:e.kind,className:"rp-inspect-kind",style:{color:Tr(e.kind,e.status)},children:[o("span",{className:"rp-dot"}),Pr(e.kind)]}),o("span",{className:"rp-inspect-name",title:e.name??e.kind,children:e.name??e.kind}),a!==null?o("span",{className:"rp-badge","data-tone":a,children:e.status}):null]}),s("div",{className:"rp-inspect-meta",children:[s("span",{className:"rp-mono",children:["#",e.id]}),o("span",{className:"rp-inspect-sep",children:"\xB7"}),s("span",{className:"rp-mono",children:["seq ",e.seq]}),e.duration_ms!==null?s(ze,{children:[o("span",{className:"rp-inspect-sep",children:"\xB7"}),o("span",{className:"rp-mono",title:`${e.duration_ms} ms`,children:Ce(e.duration_ms)})]}):null]}),s("div",{className:"rp-json-card",children:[s("div",{className:"rp-json-head",children:[o("span",{className:"rp-json-lang",children:"json"}),o(ut,{text:t,onCopy:r})]}),o("pre",{className:"rp-json",children:yr(t).map((i,u)=>o("span",{className:`rp-j-${i.type}`,children:i.text},u))})]})]})}function pt({ctx:e,branchId:r,refreshTick:t,onClose:a,onRefresh:i}){let[u,N]=x(null),[d,j]=x(null),[D,y]=x(!1),[W,M]=x(null),[_,P]=x(null),F=je(null);O(()=>{let g=!1,h=null,$=async()=>{try{let S=await Qe(e,r);if(g)return!0;N(S),M(null);let ue=S.branch.child_session_id;if(ue!==null){let de=await er(e,S.branch.parent_session_id,ue,S.branch.fork_before_ts);g||j(de)}else j(null);return ot.has(S.branch.state)}catch(S){return g||M(R(S)),!1}},Q=async()=>{let S=await $();!g&&!S&&(h=e.setTimeout(()=>{Q()},2500))};return Q(),()=>{g=!0,h!==null&&h()}},[e,r,t]);let K=async()=>{y(!0),M(null);try{await nr(e,r),i()}catch(g){M(R(g))}finally{y(!1)}},V=async g=>{y(!0),M(null),P(null);try{await Fe(e,r),i()}catch(h){M(R(h)),P(g)}finally{y(!1)}},Z=async()=>{y(!0),M(null);try{let g=await ar(e,r);g.uncommitted===0?(await Fe(e,r),i()):P(g)}catch(g){M(R(g))}finally{y(!1)}};if(O(()=>{P(null)},[r]),O(()=>{if(_===null)return;let g=h=>{h.key==="Escape"&&Cr()&&P(null)};return window.addEventListener("keydown",g),()=>{window.removeEventListener("keydown",g)}},[_]),O(()=>{if(_===null)return;let g=document.activeElement;return F.current?.focus(),()=>{g instanceof HTMLElement&&g.focus()}},[_]),u===null)return o("div",{className:"rp-meta",children:"Loading branch..."});let b=u.branch,C=u.run,f=C?.verify_exit??d?.right?.verify_exit??null,ge=b.verify_cmd?b.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",U=b.worktree_path?void 0:"This branch has no workspace left to remove.";return s("div",{className:"rp-stack",children:[s("div",{className:"rp-branch-head",children:[s("div",{className:"rp-branch-title",children:[s("span",{children:["Branch ",ne(b.id)]}),s("span",{className:"rp-badge","data-tone":Rr(b.state),children:[o("span",{className:"rp-dot"}),b.state]}),C!==null&&C.verify_exit!==null?s("span",{className:"rp-badge","data-tone":C.verify_exit===0?"ok":"err",children:["verify ",$e(C.verify_exit)]}):null]}),s("div",{className:"rp-branch-actions",children:[o("button",{type:"button",className:"rp-button rp-button-sm",title:ge,onClick:()=>{K()},disabled:D||!b.verify_cmd||!b.worktree_path,children:"Verify"}),o("button",{type:"button",className:"rp-button rp-button-sm",title:U,onClick:()=>{Z()},disabled:D||!b.worktree_path,children:"Cleanup"}),o("button",{type:"button",className:"rp-button rp-button-sm rp-quiet",onClick:a,children:"Hide"})]})]}),u.shared_child?o("div",{className:"rp-note rp-note-warn",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,W!==null?o("div",{className:"rp-error",children:W}):null,_!==null?s("div",{className:"rp-confirm",ref:F,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[o("div",{className:"rp-confirm-copy",children:dr(_.uncommitted)}),o("div",{className:"rp-confirm-path",children:_.worktree_path}),s("div",{className:"rp-confirm-actions",children:[o("button",{type:"button",className:"rp-button rp-button-sm rp-delete",onClick:()=>{V(_)},disabled:D,children:"Delete workspace"}),o("button",{type:"button",className:"rp-button rp-button-sm",onClick:()=>{P(null)},children:"Cancel"})]})]}):null,d!==null?s("div",{className:"rp-stack",children:[s("div",{className:"rp-compare",children:[s("div",{className:"rp-panel",children:[s("div",{className:"rp-card-label",children:["Original",d.left?.frozen_at?` \xB7 frozen ${we(d.left.frozen_at)}`:""]}),s("div",{className:"rp-metrics",children:[o(le,{label:"outcome",value:d.left===null?"not recorded":ir(d.left.outcome),tone:d.left===null?"idle":qe(d.left.outcome)}),o(le,{label:"tokens",value:d.left===null?"n/a":ye(d.left.tokens_in+d.left.tokens_out)}),o(le,{label:"tool errors",value:d.left===null?"n/a":String(d.left.tool_errors),tone:d.left!==null&&d.left.tool_errors>0?"err":"idle"})]})]}),s("div",{className:"rp-panel",children:[o("div",{className:"rp-card-label rp-card-label-accent",children:"Rerun"}),s("div",{className:"rp-metrics",children:[o(le,{label:"outcome",value:d.right===null?"not recorded":Pe(d.right.outcome),tone:d.right===null?"idle":qe(d.right.outcome)}),o(le,{label:"verify",value:f===null?"not run":$e(f),tone:f===null?"idle":f===0?"ok":"err"}),o(le,{label:"tokens",value:d.right===null?"n/a":ye(d.right.tokens_in+d.right.tokens_out)}),o(le,{label:"tool errors",value:d.right===null?"n/a":String(d.right.tool_errors),tone:d.right!==null&&d.right.tool_errors>0?"err":"idle"})]})]})]}),s("div",{className:"rp-verdict",children:[o(T,{name:"info",size:13}),s("span",{children:[o("strong",{children:"Verdict"})," ",d.verdict]})]})]}):o("div",{className:"rp-meta",children:b.state==="cleaned"||b.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),C!==null&&C.verify_out?o("pre",{className:"rp-pre",children:C.verify_out}):null,u.prompt!==null?s("details",{className:"rp-panel rp-disclosure",children:[o("summary",{children:"Prompt"}),o("pre",{className:"rp-pre",children:u.prompt})]}):null]})}function Mr({ctx:e}){let r=Qr(Zr.state.activeSessionId),[t,a]=x([]),[i,u]=x(null),[N,d]=x([]),[j,D]=x(!1),[y,W]=x(!1),[M,_]=x(null),[P,F]=x({}),[K,V]=x([]),[Z,b]=x([]),[C,f]=x(null),[ge,U]=x(null),[g,h]=x(null),[$,Q]=x(null),[S,ue]=x(0),[de,J]=x(null),[E,ve]=x(0),[xe,oe]=x(!1),[Ie,X]=x(!1),[_e,ee]=x(null),[re,ae]=x(tt),[De,pe]=x(!1),Y=je(null),ie=je(re);O(()=>{ie.current=re},[re]),O(()=>{let n=null,m=e.onEvent("*",()=>{n===null&&(n=e.setTimeout(()=>{n=null,ve(q=>q+1)},1500))});return()=>{m(),n!==null&&n()}},[e]),O(()=>{if(g===null||$!==null)return;let n=m=>{m.key==="Escape"&&!Cr()&&h(null)};return window.addEventListener("keydown",n),()=>{window.removeEventListener("keydown",n)}},[g,$]),O(()=>{let n=!1,m=async()=>{try{let w=await Je(e);if(n)return;a(w),oe(!0),J(null),u(L=>L!==null&&w.some(se=>se.session_id===L)?L:r??w[0]?.session_id??null)}catch(w){n||J(R(w))}};m();let q=e.setInterval(()=>{m()},1e4);return()=>{n=!0,q()}},[e,r,S,E]),O(()=>{if(i===null){d([]),X(!1),D(!1),ee(null),V([]),b([]);return}let n=!1,m=async()=>{try{let[w,L,se]=await Promise.all([Ae(e,i),Ge(e,i),Ze(e,i)]);if(n)return;d(be=>He(i,w.items,be)),D(w.has_more),X(!0),V(L),b(se),ee(null),J(null)}catch(w){n||(X(!0),ee(R(w)))}};m();let q=e.setInterval(()=>{m()},1e4);return()=>{n=!0,q()}},[e,i,S,E]),O(()=>{if(C===null){U(null);return}let n=!1;return Ye(e,C).then(m=>{n||U(m)}).catch(m=>{n||J(R(m))}),()=>{n=!0}},[e,C]);let k=t.find(n=>n.session_id===i)??null,Ne=k!==null&&k.ended_at===null,G=Ne&&k.session_id===r,l=i===null?[]:N.filter(n=>n.session_id===i),c=n=>{u(n.session_id),f(null),h(null),_(null),F({}),d([]),X(!1),D(!1),ee(null),V([]),b([])},z=()=>{ue(n=>n+1)},I=n=>{if(M===n.id){_(null);return}_(n.id),P[n.id]===void 0&&Xe(e,n.session_id,n.seq,n.seq_to).then(m=>{F(q=>({...q,[n.id]:m}))}).catch(m=>{J(R(m))})},te=async()=>{let n=l[l.length-1];if(!(i===null||n===void 0)){W(!0);try{let m=await Ae(e,i,n.seq);d(q=>He(i,m.items,q)),D(m.has_more)}catch(m){J(R(m))}finally{W(!1)}}};return s("div",{className:"rw-page rp-shell",children:[o("style",{children:nt}),s("header",{className:"rp-head",children:[s("div",{className:"rp-head-left",children:[o("span",{className:"rp-mark",children:o(T,{name:"rewind",size:16})}),s("div",{children:[o("div",{className:"rp-title",children:"Session Rewind"}),o("div",{className:"rp-sub",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]})]}),s("div",{className:"rp-head-right",children:[k!==null?o("span",{className:"rp-pill rp-mono",children:k.model??"unknown model"}):null,Ne?s("span",{className:"rp-live",children:[o("span",{className:"rp-dot"}),G?"live":"running"]}):null,s("button",{type:"button",className:"rp-button",onClick:z,children:[o(T,{name:"refresh",size:13}),"Refresh"]})]})]}),de!==null?o("div",{className:"rp-error",children:de}):null,s("div",{className:"rp-columns",children:[s("aside",{className:"rp-side",children:[s("div",{className:"rp-eyebrow",children:[o("span",{className:"rp-dot"}),"Sessions",xe?o("span",{className:"rp-eyebrow-count",children:sr(t.length,Le)}):null]}),xe?t.length===0?o("div",{className:"rp-meta",children:"Start a chat and Rewind will record every turn."}):o("div",{className:"rp-cards",children:t.map(n=>s("button",{type:"button",className:"rp-session","aria-current":i===n.session_id?"true":void 0,onClick:()=>{c(n)},children:[s("span",{className:"rp-session-title",children:[o("span",{className:"rp-dot",style:{background:n.ended_at===null?"var(--ui-green)":"var(--ui-text-quaternary)"}}),o("span",{children:n.title??ne(n.session_id)})]}),s("span",{className:"rp-meta",children:[n.model??"unknown model"," \xB7 ",B(n.event_count,"event")]}),s("span",{className:"rp-meta rp-meta-dim",children:[Pe(n.outcome)," \xB7"," ",ye(n.tokens_in+n.tokens_out)," tokens"]})]},n.session_id))}):o("div",{className:"rp-meta",children:"Loading sessions..."})]}),s("main",{className:"rp-main",children:[k!==null?s("div",{className:"rp-detail-head",children:[s("div",{className:"rp-stack",style:{gap:3},children:[s("div",{className:"rp-detail-title",children:[k.title??ne(k.session_id),K.length>0?o("span",{className:"rp-detail-note",children:B(K.length,"snapshot")}):null]}),s("div",{className:"rp-meta",children:[k.model??"unknown model"," \xB7"," ",B(k.event_count,"event")," \xB7"," ",ye(k.tokens_in+k.tokens_out)," tokens",k.ended_at===null?` \xB7 ${lr(k.last_event_at)}`:""]})]}),o("div",{className:"rp-hint",children:"Select a user turn and choose Rewind."})]}):null,Z.length>0?s("div",{children:[s("div",{className:"rp-eyebrow",children:[o("span",{className:"rp-dot"}),"Branches",o("span",{className:"rp-eyebrow-count",children:Z.length})]}),o("div",{className:"rp-chips",children:Z.map(n=>s("button",{type:"button",className:"rp-chip","aria-current":g===n.id?"true":void 0,onClick:()=>{h(n.id)},children:[o("span",{className:"rp-mono",children:ne(n.id)}),s("span",{className:"rp-badge","data-tone":Rr(n.state),children:[o("span",{className:"rp-dot"}),n.state]}),o("span",{className:"rp-chip-note",children:n.fork_row_count>0?B(n.fork_row_count,"message"):"context pack"})]},n.id))})]}):null,s("div",{className:"rp-columns",style:{gap:0,"--rp-payload-width":`${re}px`},children:[o("div",{className:"rp-turns",children:s("div",{className:"rp-stack",style:{width:"100%"},children:[s("div",{className:"rp-eyebrow",children:[o("span",{className:"rp-dot"}),"Turns"]}),k===null?o("div",{className:"rp-meta",children:"Select a recorded session."}):Ie?l.length===0?o("div",{className:"rp-meta",children:ur(k.event_count,_e)}):s(ze,{children:[l.map(n=>o(it,{turn:n,expanded:M===n.id,events:P[n.id]??null,loading:M===n.id&&P[n.id]===void 0,selectedEventId:C,onToggle:()=>{I(n)},onFork:()=>{k!==null&&Q({session:k,event:n})},onSelectEvent:m=>{f(m.id)}},n.id)),j?o("button",{type:"button",className:"rp-load-more",onClick:()=>{te()},disabled:y,children:y?"Loading...":"Load earlier turns"}):s("div",{className:"rp-tail",children:[B(l.length,"turn")," \xB7 start of the recording"]})]}):o("div",{className:"rp-meta",children:"Loading turns..."})]})}),o("div",{role:"separator","aria-orientation":"vertical","aria-label":"Resize event payload panel",tabIndex:0,className:"rp-divider","data-dragging":De?"true":void 0,onPointerDown:n=>{Y.current={startX:n.clientX,startWidth:re},pe(!0),n.currentTarget.setPointerCapture(n.pointerId)},onPointerMove:n=>{let m=Y.current;m!==null&&ae(Ee(m.startWidth-(n.clientX-m.startX)))},onPointerUp:n=>{Y.current!==null&&(Y.current=null,pe(!1),Me(ie.current),n.currentTarget.hasPointerCapture(n.pointerId)&&n.currentTarget.releasePointerCapture(n.pointerId))},onPointerCancel:n=>{Y.current!==null&&(Y.current=null,pe(!1),n.currentTarget.hasPointerCapture(n.pointerId)&&n.currentTarget.releasePointerCapture(n.pointerId))},onKeyDown:n=>{if(n.key==="ArrowLeft"){let m=Ee(ie.current+16);ae(m),Me(m),n.preventDefault()}else if(n.key==="ArrowRight"){let m=Ee(ie.current-16);ae(m),Me(m),n.preventDefault()}},onDoubleClick:()=>{ae(fe),Me(fe)}}),s("div",{className:"rp-payload",children:[s("div",{className:"rp-eyebrow",children:[o("span",{className:"rp-dot"}),"Event payload"]}),o(dt,{detail:ge,onCopy:n=>{e.os.writeClipboard(n)}})]})]})]})]}),g!==null?o("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-stroke-tertiary) pt-2",children:o(pt,{ctx:e,branchId:g,refreshTick:S,onClose:()=>{h(null)},onRefresh:z})}):null,$!==null?o(wr,{ctx:e,session:$.session,event:$.event,onClose:()=>{Q(null)},onCreated:n=>{h(n),z()}}):null]})}import{jsx as Er}from"react/jsx-runtime";var bt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let r=()=>{ct.navigate(ce)};e.registerMany([{id:"page",area:gt,data:{path:ce},render:()=>Er(Mr,{ctx:e})},{id:"nav",area:vt,data:{path:ce,label:"Rewind",codicon:"history"}},{id:"palette-open",area:ft,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:r}},{id:"keybind-open",area:mt,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:r}},{id:"chip",area:xt.right,order:130,render:()=>Er(Ke,{})}])}},nn=bt;export{nn as default};
