import{host as Nt,KEYBINDS_AREA as St,PALETTE_AREA as Ct,ROUTES_AREA as Pt,SIDEBAR_NAV_AREA as Rt,STATUSBAR_AREAS as Mt}from"@hermes/plugin-sdk";import{host as rr,useValue as jr}from"@hermes/plugin-sdk";var he="/rewind";import{jsx as Wr,jsxs as Vr}from"react/jsx-runtime";function tr(){let e=jr(rr.state.activeSessionId);return Vr("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{rr.navigate(he)},title:"Open Session Rewind",children:[Wr("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-(--ui-green)"}`}),"Rewind"]})}import{host as ut,useValue as pt}from"@hermes/plugin-sdk";import{Fragment as ct,useEffect as O,useRef as Ze,useState as v}from"react";function Re(e,r,o){return e.rest(r,{method:"POST",body:o})}var Ke=100;async function nr(e){return(await e.rest(`/sessions?limit=${Ke}`)).items}async function Je(e,r,o=null){let a=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(r)}/turns?limit=40${a}`)}async function or(e,r,o,a){return(await e.rest(`/sessions/${encodeURIComponent(r)}/events?limit=200&after_seq=${o-1}&before_seq=${a+1}`)).items}function ar(e,r){return e.rest(`/events/${r}`)}async function ir(e,r,o,a=30){let i=new URLSearchParams({q:o,session_id:r,limit:String(a)});return e.rest(`/search?${i.toString()}`)}function sr(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/snapshots`)}function lr(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/branches`)}function ur(e,r){return Re(e,`/branches/${encodeURIComponent(r)}/reconcile`,{})}function pr(e,r,o,a=null){let i=a===null?"":`&before_ts=${a}`;return e.rest(`/compare?left=${encodeURIComponent(r)}&right=${encodeURIComponent(o)}${i}`)}function cr(e,r){return Re(e,"/forks/prepare",r)}function dr(e,r,o){return Re(e,`/forks/${encodeURIComponent(r)}/commit`,o)}function mr(e,r){return Re(e,`/forks/${encodeURIComponent(r)}/verify`,{})}function fr(e,r,o){return e.rest(`/branches/${encodeURIComponent(r)}/verify-resolve?cmd=${encodeURIComponent(o)}`)}function gr(e,r){return e.rest(`/forks/${encodeURIComponent(r)}/workspace`)}function Xe(e,r){return Re(e,`/forks/${encodeURIComponent(r)}/cleanup`,{})}function fe(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function we(e){return e.toLocaleString()}function vr(e){let r=Math.max(0,Math.round(Date.now()/1e3-e));if(r<60)return"just now";let o=Math.round(r/60);if(o<60)return`${o}m`;let a=Math.round(o/60);if(a<24)return`${a}h`;let i=Math.round(a/24);return i<30?`${i}d`:`${Math.round(i/30)}mo`}function Ae(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Ur=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function P(e){let r=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",o=Ur.exec(r),a=o?.[1];if(o===null||a===void 0)return r;let i=Kr(a);return i===void 0?r:r.replace(o[0],i)}function Kr(e){try{let r=JSON.parse(e);return typeof r.detail=="string"&&r.detail.length>0?r.detail:void 0}catch{return}}function Z(e,r=8){return e.length<=r?e:e.slice(0,r)}function X(e,r){return`${e} ${e===1?r:`${r}s`}`}function Ye(e){return e===0?"passed":`failed (exit ${e})`}var Jr={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function Me(e){return e===null?"recording":Jr[e]??e}function Ee(e){return e===null?"warn":e==="completed"?"ok":e==="failed"?"err":"idle"}function xr(e){return e===null?"open at freeze":Me(e)}function br(e,r){return e===0?"":e>=r?`${r}+`:`${e}`}function Xr(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function hr(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${Xr(e)}`}function wr(e,r){return r!==null?`The turns could not be loaded: ${r}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${X(e,"event")} but no user turn.`}function yr(e){return e===null?"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.":`This workspace holds ${X(e,"uncommitted file")}. Deleting it removes them for good; the rerun conversation stays in the recording.`}import{host as H}from"@hermes/plugin-sdk";import{useCallback as Qr,useEffect as Te,useLayoutEffect as Zr,useRef as Be,useState as L}from"react";function Yr(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let r=e.content;return typeof r=="string"?r.trim():Array.isArray(r)?r.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let a=o.text;return typeof a=="string"?a:""}).join("").trim():""}function kr(e,r){let o=(e??[]).filter(u=>(u.role==="user"||u.role==="assistant")&&Yr(u).length>0&&typeof u.row_id=="number"),a=-1;for(let u=0;u<o.length;u+=1){let N=o[u];if(N===void 0)continue;let d=N.timestamp;N.role==="user"&&typeof d=="number"&&d<=r+.5&&(a=u)}if(a<=0)return null;let i=o[a-1]?.row_id;return typeof i=="number"&&i>0?i:null}var _r={providers:[],currentModel:null,currentProvider:null};function qe(e){return typeof e=="string"?e.trim():""}function Nr(e){let r=qe(e);return r===""?null:r}function Sr(e){if(e===null||typeof e!="object")return _r;let r=e.providers;if(!Array.isArray(r))return _r;let o=[];for(let a of r){if(a===null||typeof a!="object")continue;let i=a,u=qe(i.slug),N=Array.isArray(i.models)?i.models.map(qe).filter(d=>d!==""):[];u===""||N.length===0||o.push({slug:u,name:qe(i.name)||u,isCurrent:i.is_current===!0,models:N})}return{providers:o,currentModel:Nr(e.model),currentProvider:Nr(e.provider)}}function Cr(e,r){return[...e.providers].sort((o,a)=>{let i=r!==null&&o.slug===r?0:1,u=r!==null&&a.slug===r?0:1;return i!==u?i-u:o.isCurrent!==a.isCurrent?o.isCurrent?-1:1:o.name.localeCompare(a.name)})}function Pr(e,r){let o=r.trim().toLowerCase();if(o==="")return e;let a=[];for(let i of e){if(i.name.toLowerCase().includes(o)||i.slug.toLowerCase().includes(o)){a.push(i);continue}let u=i.models.filter(N=>N.toLowerCase().includes(o));u.length>0&&a.push({...i,models:u})}return a}function Rr(e,r){let o=r===null?"":` --provider ${r}`;return`${e}${o} --session`}function Mr(e,r,o,a){return e===""?!1:e!==(o??"")||r!==a}import{jsx as Er}from"react/jsx-runtime";var Gr={rewind:"M3 12a9 9 0 1 0 3-6.7M3 4v5h5",refresh:"M20 11a8 8 0 0 0-14 5l-2 2M4 13a8 8 0 0 0 14-5l2-2",branch:"M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0-3-3M15 9v3a3 3 0 0 0 3 3h3",lock:"M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",folder:"M3 7h6l2 2h10v11H3z",close:"M5 5l14 14M19 5L5 19",chevron:"M9 6l6 6-6 6",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01",copy:"M9 9h11v11H9zM5 15V5a1 1 0 0 1 1-1h10",check:"M4 12l5 5L20 7",message:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",reply:"M9 14L4 9l5-5M20 20v-7a4 4 0 0 0-4-4H4",tool:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",inbox:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8",layers:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",event:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18"};function C({name:e,size:r=14,className:o}){return Er("svg",{"aria-hidden":"true",className:o,viewBox:"0 0 24 24",width:r,height:r,fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round",focusable:"false",children:Er("path",{d:Gr[e]})})}import{Fragment as it,jsx as c,jsxs as x}from"react/jsx-runtime";var et=["python -m pytest -q","npm test","cargo test","go test ./..."],rt=350,tt=400;function ye(e,r){return r.catch(o=>{throw new Error(`${e}: ${P(o)}`)})}function nt(e){if(e===null)return[];let r=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(r).filter(o=>!o.hasAttribute("disabled"))}function ot(e,r){let o=nt(e),a=o[0],i=o[o.length-1];if(e===null||a===void 0||i===void 0)return;let u=document.activeElement;if(!e.contains(u)){r.preventDefault(),a.focus();return}r.shiftKey&&u===a?(r.preventDefault(),i.focus()):!r.shiftKey&&u===i&&(r.preventDefault(),a.focus())}var at=`
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
  position: relative;
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
  position: fixed;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .625rem);
  box-shadow: var(--shadow-md);
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
`;function Tr({ctx:e,session:r,event:o,onClose:a,onCreated:i}){let[u,N]=L(""),[d,V]=L(null),[D,w]=L({providers:[],currentModel:null,currentProvider:null}),[U,E]=L(!1),[b,R]=L(!1),[le,ee]=L(null),re=Be(null);Zr(()=>{if(!b){ee(null);return}let l=()=>{let S=re.current;if(S===null)return;let _=S.getBoundingClientRect(),J=window.innerHeight-_.bottom;if(J<260){ee({bottom:window.innerHeight-_.top+6,left:_.left,width:_.width,maxHeight:Math.max(200,Math.round(_.top-12))});return}ee({top:_.bottom+6,left:_.left,width:_.width,maxHeight:Math.min(320,Math.round(J-12))})};l();let m=e.addEventListener(window,"scroll",l,{capture:!0}),g=e.addEventListener(window,"resize",l);return()=>{m(),g()}},[e,b]);let[A,y]=L(""),[k,j]=L(""),[q,te]=L(""),[p,T]=L(null),[$,Y]=L(null),[h,G]=L(null),[ue,B]=L(null),[Le,We]=L(!1),ve=Be([]),z=h!==null,_e=Be(null),pe=Be(()=>{}),ce=Qr(()=>{z||(We(!0),ve.current.push(e.setTimeout(a,100)))},[z,e,a]);Te(()=>{let l=ve.current;return()=>{for(let m of l)m()}},[]),Te(()=>{let l=document.activeElement;return _e.current?.focus(),()=>{l?.focus()}},[]),Te(()=>{let l=m=>{if(m.key==="Escape"&&!z){if(b){R(!1);return}ce();return}if(m.key==="Tab"){ot(_e.current,m);return}if(m.key==="Enter"&&(m.metaKey||m.ctrlKey)&&!z){if(b)return;m.preventDefault(),pe.current()}};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[z,ce,b]),Te(()=>{let l=q.trim();if(p===null||l===""){Y(null);return}let m=!1,g=e.setTimeout(()=>{fr(e,p.branch_id,l).then(S=>{m||Y(S)}).catch(()=>{m||Y(null)})},rt);return()=>{m=!0,g()}},[e,p,q]),Te(()=>{let l=!1;return H.request("model.options",{explicit_only:!0,include_unconfigured:!1}).then(m=>{if(l)return;let g=Sr(m);w(g),E(g.providers.length===0)}).catch(()=>{l||E(!0)}),()=>{l=!0}},[]);let xe=Cr(D,r.provider),ne=Pr(xe,A),Ne=u.trim()===""?r.model??"":u.trim(),K=d??r.provider,be=K===null?"":D.providers.find(l=>l.slug===K)?.name??K,oe=(l,m)=>{N(m),V(l),R(!1),y("")},Se=()=>{N(""),V(null),R(!1),y("")},De=async()=>{let l=await H.request("session.active_list",{}),m=Array.isArray(l.sessions)?l.sessions:[],g=m.find(S=>S.session_key===r.session_id)?.id??m.find(S=>S.id===r.session_id)?.id;if(g===void 0)return{runtimeId:void 0,storedId:r.stored_session_id};try{let S=await H.request("session.title",{session_id:g});return{runtimeId:g,storedId:S.session_key??r.stored_session_id}}catch{return{runtimeId:g,storedId:r.stored_session_id}}},de=async()=>{G("prepare"),B(null);try{let l=await De(),m=await cr(e,{session_id:r.session_id,stored_session_id:l.storedId,event_id:o.id,model:u.trim()||null,provider:d,prompt:k.trim()||null,verify_cmd:q.trim()||null});T(m),j(m.prompt),m.verify_presets.length>0&&q.trim()===""&&te(m.verify_presets[0]??"")}catch(l){B(P(l))}finally{G(null)}},ae=async()=>{if(p!==null){G("run"),B(null);try{let l=await De(),m=l.runtimeId,g=`\u21BA ${r.title??Z(r.session_id)} \xB7 ${Z(p.branch_id)}`,S=null;if(m!==void 0)try{let M=await H.request("session.history",{session_id:m});S=kr(M.messages,p.fork_before_ts)}catch{S=null}let _,J,$e=!1;if(S!==null&&m!==void 0){let M=await ye("could not branch the session",H.request("session.branch",{session_id:m,through_message_id:S}));_=M.session_id,J=M.stored_session_id}else{let M={source:"desktop",title:g};p.worktree_path!==null&&(M.cwd=p.worktree_path),l.storedId!==null&&(M.parent_session_id=l.storedId);let Q=await ye("could not create the branch session",H.request("session.create",M));_=Q.session_id,J=Q.stored_session_id,$e=!0}if($e&&p.worktree_path!==null){let M=()=>H.request("session.cwd.set",{session_id:_,cwd:p.worktree_path});try{await ye("could not attach the isolated workspace",M())}catch(Q){throw Q instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${P(Q)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(await ye("could not open the rerun session",H.openSession(J,{intent:"tab"})),Mr(u.trim(),d,r.model,r.provider)){let M=Rr(u.trim(),d),Q=()=>H.request("config.set",{key:"model",value:M,session_id:_,confirm_expensive_model:!1}),me=!1,Ce=null,Fe="";for(let t=0;t<2&&!me;t+=1)try{let f=await Q();me=!0,Ce=f.confirm_required===!0?f.confirm_message??null:null}catch(f){Fe=P(f),await new Promise(F=>{setTimeout(F,tt)})}me?Ce!==null&&H.notify({kind:"info",message:Ce,detail:`The rerun started before the switch could be confirmed; ${u.trim()} applies from the next turn.`}):H.notify({kind:"warning",message:`The rerun runs on ${r.model??"the session model"}, not ${u.trim()}.`,detail:Fe})}let se=k.trim()||p.prompt;await ye("could not record the branch",dr(e,p.branch_id,{child_session_id:_,child_stored_session_id:J,model:u.trim()||r.model,provider:d??r.provider,prompt:se,verify_cmd:q.trim()||null})),await ye("could not start the rerun",H.request("prompt.submit",{session_id:_,text:se})),i(p.branch_id),a()}catch(l){B(P(l))}finally{G(null)}}};pe.current=()=>{p===null?de():ae()};let ie=p!==null,Ve=q.trim(),W=[];return ie?(p.fidelity!=="full"&&W.push({warn:!0,text:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}),p.context_rows===null&&W.push({warn:!0,text:"The live transcript prefix is unavailable. The context pack is the only context."}),r.ended_at!==null&&W.push({warn:!1,text:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}),p.fork_row_count===0&&r.ended_at===null&&W.push({warn:!1,text:"This is the first turn. The rerun starts a fresh chat in the restored workspace."})):W.push({warn:!1,text:"Prepare reads the recorded context for this turn and drafts the rerun prompt. Nothing runs until you fork."}),x("div",{className:"rw-overlay","data-closing":Le?"true":"false",onMouseDown:l=>{l.target===l.currentTarget&&ce()},children:[c("style",{children:at}),x("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title","aria-describedby":"rw-reassure",tabIndex:-1,ref:_e,children:[x("header",{className:"rw-head",children:[c("span",{className:"rw-mark",children:c(C,{name:"rewind",size:16})}),x("div",{className:"rw-heading",children:[c("div",{className:"rw-eyebrow",children:"Session Rewind"}),c("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"})]}),c("button",{type:"button",className:"rw-close",onClick:ce,disabled:z,"aria-label":"Close",children:c(C,{name:"close",size:15})})]}),x("div",{className:"rw-body",children:[x("div",{className:"rw-turn",children:[c("span",{className:"rw-turn-icon",children:c(C,{name:"message",size:12})}),c("span",{className:"rw-turn-time",children:fe(o.ts)}),c("span",{className:"rw-turn-text",title:o.preview||"user turn",children:o.preview||"user turn"})]}),ue!==null?c("div",{className:"rw-banner rw-banner-error",role:"alert",children:ue}):null,ie&&p.worktree_path?x("div",{className:"rw-path",children:[c("span",{className:"rw-path-text",title:p.worktree_path,children:p.worktree_path}),c("button",{type:"button",className:"rw-icon-button",onClick:()=>{e.os.revealPath(p.worktree_path??"")},disabled:z,"aria-label":"Reveal the isolated workspace",children:c(C,{name:"folder",size:13})})]}):null,W.length>0?c("div",{className:"rw-notes",children:W.map(l=>x("div",{className:`rw-note${l.warn?" rw-note-warn":""}`,role:l.warn?"status":void 0,children:[c(C,{name:"info"}),c("span",{children:l.text})]},l.text))}):null,x("div",{className:"rw-grid",children:[x("div",{className:"rw-field",children:[c("span",{className:"rw-label",id:"rw-model-label",children:"Model"}),x("button",{type:"button",ref:re,className:`rw-trigger${b?" rw-trigger-open":""}`,onClick:()=>{R(!b)},disabled:z,"aria-haspopup":"listbox","aria-expanded":b,"aria-labelledby":"rw-model-label rw-model-value",children:[c("span",{className:"rw-trigger-text",id:"rw-model-value",children:Ne===""?"Session model":Ne}),be===""?null:c("span",{className:"rw-trigger-provider",children:be}),c("span",{className:"rw-trigger-caret","aria-hidden":"true","data-open":b,children:c(C,{name:"chevron",size:12})})]}),b?x("div",{className:"rw-picker",style:le??void 0,children:[c("input",{className:"rw-search",value:A,onChange:l=>{y(l.target.value)},onKeyDown:l=>{let m=ne[0];l.key==="Enter"&&m!==void 0&&(l.preventDefault(),oe(m.slug,m.models[0]??""))},placeholder:"Search models","aria-label":"Search models",autoFocus:!0}),x("div",{className:"rw-picker-list",role:"listbox","aria-label":"Models",children:[x("button",{type:"button",className:"rw-option rw-option-keep",role:"option","aria-selected":u.trim()==="",onClick:Se,children:["Keep the session model",r.model===null?null:c("span",{className:"rw-option-sub",children:r.model})]}),ne.map(l=>x("div",{className:"rw-group",role:"group","aria-label":l.name,children:[x("div",{className:"rw-group-head",children:[c("span",{children:l.name}),c("span",{className:"rw-count",children:l.models.length})]}),l.models.map(m=>x("button",{type:"button",className:"rw-option",role:"option","aria-selected":m===u.trim()&&l.slug===d,onClick:()=>{oe(l.slug,m)},children:[c("span",{className:"rw-option-text",children:m}),m===r.model?c("span",{className:"rw-option-tag",children:"session"}):null]},m))]},l.slug)),ne.length===0&&A.trim()!==""?c("button",{type:"button",className:"rw-option",role:"option",onClick:()=>{N(A.trim()),V(null),R(!1),y("")},children:x("span",{className:"rw-option-text",children:["Use \u201C",A.trim(),"\u201D as typed"]})}):null,ne.length===0&&A.trim()===""?c("div",{className:"rw-picker-empty",children:"No configured provider offers a model."}):null]})]}):null,c("span",{className:"rw-help",children:U?"Could not read the model list, so the rerun keeps the session model.":"Lists the providers configured in Hermes."})]}),x("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Verify command"}),c("input",{className:"rw-input",value:q,onChange:l=>{te(l.target.value)},placeholder:"python -m pytest -q"}),c("div",{className:"rw-chips",children:(p?.verify_presets.length?p.verify_presets:et).map(l=>c("button",{type:"button",className:"rw-preset","aria-pressed":l===Ve,onClick:()=>{te(l)},disabled:z,children:l},l))}),c("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),$!==null&&$.command===q.trim()?c("span",{className:"rw-resolved",children:$.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":x(it,{children:[c("span",{children:"Resolves to"}),c("span",{className:"rw-resolved-path",title:$.resolved,children:$.resolved})]})}):null]})]}),x("label",{className:"rw-field",children:[x("span",{className:"rw-label-row",children:[c("span",{className:"rw-label",children:"Prompt for the rerun"}),k.length>0?x("span",{className:"rw-count","aria-live":"polite",children:[k.length," chars"]}):null]}),c("textarea",{className:"rw-textarea",value:k,onChange:l=>{j(l.target.value)},placeholder:"Prepare drafts this from the recorded turn \u2014 or write your own now."})]})]}),x("footer",{className:"rw-footer",children:[x("span",{className:"rw-reassure",id:"rw-reassure",children:[c(C,{name:"lock",size:13}),c("span",{children:"Original session and workspace stay untouched."})]}),x("div",{className:"rw-actions",children:[c("button",{type:"button",className:"rw-button",onClick:ce,disabled:z,children:"Cancel"}),ie?x("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{ae()},disabled:z,"aria-busy":h==="run",children:[h==="run"?c("span",{className:"rw-spinner"}):null,h==="run"?"Forking":"Fork & run",h==="run"?null:c("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]}):x("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{de()},disabled:z,"aria-busy":h==="prepare",children:[h==="prepare"?c("span",{className:"rw-spinner"}):null,h==="prepare"?"Preparing":"Prepare branch",h==="prepare"?null:c("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]})]})]})]})]})}function Ge(e,r,o){let a=new Set(r.map(u=>u.id)),i=o.filter(u=>u.session_id===e&&!a.has(u.id));return[...r,...i]}function st(e){let r=e.trim();if(r.length<2)return!1;let o=r[0];return o==="{"&&r.endsWith("}")||o==="["&&r.endsWith("]")}function He(e,r=0){if(r>=4)return e;if(Array.isArray(e))return e.map(o=>He(o,r+1));if(e!==null&&typeof e=="object"){let o={};for(let[a,i]of Object.entries(e))o[a]=He(i,r+1);return o}if(typeof e=="string"&&st(e))try{let o=JSON.parse(e);if(o!==null&&typeof o=="object")return He(o,r+1)}catch{}return e}var lt=/(?<q>"(?:\\.|[^"\\])*")(?<c>\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\][,:]|\s+|./g;function zr(e){let r=[];for(let o of e.matchAll(lt)){let a=o[0],i=o.groups?.q,u=o.groups?.c;if(i!==void 0){r.push({text:i,type:u!==void 0?"key":"string"}),u!==void 0&&r.push({text:u,type:"punct"});continue}a==="true"||a==="false"?r.push({text:a,type:"bool"}):a==="null"?r.push({text:a,type:"null"}):/^-?\d/.test(a)?r.push({text:a,type:"number"}):r.push({text:a,type:"punct"})}return r}function Ir(e){return JSON.stringify(He(e),null,2)}var Qe=new Set(["api_request","llm_call"]);function Lr(e){let r=[],o=new Map;for(let a of e)if(!Qe.has(a.kind)){if(a.kind==="tool_call"&&a.tool_call_id!==null){let i={call:a,result:null};r.push(i),o.set(a.tool_call_id,i);continue}if(a.kind==="tool_result"&&a.tool_call_id!==null){let i=o.get(a.tool_call_id);if(i!==void 0){i.result=a;continue}}r.push({call:a,result:null})}return r}import{Fragment as Ie,jsx as n,jsxs as s}from"react/jsx-runtime";var dt="[data-rw-confirm]",Dr="hermes-session-rewind:payload-width",ke=292;function je(e){return Number.isFinite(e)?Math.min(560,Math.max(240,Math.round(e))):ke}function mt(){try{let e=window.localStorage.getItem(Dr);return e===null?ke:je(Number(e))||ke}catch{return ke}}function Oe(e){try{window.localStorage.setItem(Dr,String(e))}catch{}}function $r(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(dt)!==null}var ft=`
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
.rp-search-results {
  margin-top: 6px;
  padding-left: 6px;
  padding-right: 6px;
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
`,gt=new Set(["done","failed","cleaned","discarded"]);function vt(e){return Ae(Math.max(0,(e.work_ts-e.ts)*1e3))}function er({event:e,nested:r=!1,selected:o,onSelect:a}){let i=!r&&e.name!==null;return s("button",{type:"button",className:"rp-event","data-depth":r?"1":"0","aria-current":o?"true":void 0,onClick:a,children:[n("span",{title:e.kind,className:"rp-event-icon",style:{color:qr(e.kind,e.status)},children:n(C,{name:bt(e.kind),size:12})}),n("span",{title:e.kind,className:"rp-event-kind",children:Fr(e.kind)}),s("span",{className:"rp-event-text",title:e.preview!==""?e.preview:void 0,children:[i?n("span",{className:"rp-event-name",children:e.name}):null,e.preview!==""?n("span",{className:"rp-event-preview",children:e.preview}):null]}),e.status==="error"?n("span",{className:"rp-badge","data-tone":"err",children:"error"}):null,n("span",{className:"rp-event-time rp-mono",children:Ae(e.duration_ms)})]})}function xt({turn:e,expanded:r,events:o,loading:a,selectedEventId:i,onToggle:u,onFork:N,onSelectEvent:d}){let V=Lr(o??[]),D=(o??[]).filter(w=>Qe.has(w.kind)).length;return s("div",{className:"rp-turn",children:[s("div",{className:"rp-turn-bar",children:[s("button",{type:"button",className:"rp-turn-row",onClick:u,"aria-expanded":r,children:[n("span",{className:"rp-caret","data-open":r?"true":"false",children:n(C,{name:"chevron",size:12})}),n("span",{className:"rp-turn-time rp-mono",children:fe(e.ts)}),n("span",{className:"rp-turn-preview",title:e.preview||"User turn",children:e.preview||"User turn"}),n("span",{className:"rp-turn-stat",children:X(e.tool_calls,"tool")}),e.tool_errors>0?s("span",{className:"rp-badge","data-tone":"err",children:[n("span",{className:"rp-dot"}),X(e.tool_errors,"error")]}):null,n("span",{className:"rp-turn-duration rp-mono",children:vt(e)})]}),s("button",{type:"button",className:"rp-button rp-button-sm",onClick:N,children:[n(C,{name:"rewind",size:12}),"Rewind"]})]}),r?n("div",{className:"rp-events",children:a?n("div",{className:"rp-aside-note",children:"Loading events..."}):s(Ie,{children:[V.map(w=>s(ct,{children:[n(er,{event:w.call,selected:i===w.call.id,onSelect:()=>{d(w.call)}}),w.result!==null?n(er,{event:w.result,nested:!0,selected:i===w.result.id,onSelect:()=>{let U=w.result;U!==null&&d(U)}}):null]},w.call.id)),D>0?s("div",{className:"rp-aside-note",children:[X(e.api_requests,"model request")," \xB7 ",X(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Fr(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function bt(e){return e==="user_turn"?"message":e==="assistant_response"?"reply":e==="tool_call"?"tool":e==="tool_result"?"inbox":e==="api_request"||e==="llm_call"?"zap":e==="compaction"?"layers":"event"}function Ar(e){return e==="done"?"ok":e==="failed"?"err":e==="running"?"run":"idle"}function ze({label:e,value:r,mono:o=!0,tone:a="idle"}){let i=a==="idle"?"":` rp-tone-${a}`;return s("span",{className:"rp-stat",children:[n("span",{className:"rp-stat-label",children:e}),n("span",{className:`rp-stat-value${o?" rp-mono":""}${i}`,children:r})]})}function ge({label:e,value:r,tone:o="idle"}){return s(Ie,{children:[n("span",{className:"rp-metric-label",children:e}),n("span",{className:`rp-metric-value rp-tone-${o}`,children:r})]})}function qr(e,r){return e==="tool_result"&&r==="error"?"var(--ui-red)":e==="assistant_response"||e==="tool_result"?"var(--ui-green)":e==="user_turn"?"var(--ui-accent)":e==="tool_call"?"var(--ui-purple)":e==="api_request"||e==="llm_call"?"var(--ui-orange)":e==="compaction"?"var(--ui-text-secondary)":"var(--ui-text-tertiary)"}function ht(e){return e==="ok"?"var(--ui-green)":e==="err"?"var(--ui-red)":e==="warn"?"var(--ui-yellow)":"var(--ui-text-quaternary)"}function wt(e){return e===null?null:e==="error"?"err":e==="ok"?"ok":"run"}function yt({text:e,onCopy:r}){let[o,a]=v(!1);return O(()=>{if(!o)return;let i=window.setTimeout(()=>{a(!1)},1600);return()=>{window.clearTimeout(i)}},[o]),s("button",{type:"button",className:"rp-button rp-button-sm rp-quiet","aria-label":"Copy payload",onClick:()=>{try{r(e),a(!0)}catch{}},children:[n(C,{name:o?"check":"copy",size:12}),o?"Copied":"Copy"]})}function kt({detail:e,onCopy:r}){if(e===null)return s("div",{className:"rp-inspect-empty",children:[n(C,{name:"info",size:14}),n("span",{children:"Select an event to inspect its payload."})]});let o=Ir(e.payload),a=wt(e.status);return s("div",{className:"rp-inspect",children:[s("div",{className:"rp-inspect-head",children:[s("span",{title:e.kind,className:"rp-inspect-kind",style:{color:qr(e.kind,e.status)},children:[n("span",{className:"rp-dot"}),Fr(e.kind)]}),n("span",{className:"rp-inspect-name",title:e.name??e.kind,children:e.name??e.kind}),a!==null?n("span",{className:"rp-badge","data-tone":a,children:e.status}):null]}),s("div",{className:"rp-inspect-meta",children:[s("span",{className:"rp-mono",children:["#",e.id]}),n("span",{className:"rp-inspect-sep",children:"\xB7"}),s("span",{className:"rp-mono",children:["seq ",e.seq]}),e.duration_ms!==null?s(Ie,{children:[n("span",{className:"rp-inspect-sep",children:"\xB7"}),n("span",{className:"rp-mono",title:`${e.duration_ms} ms`,children:Ae(e.duration_ms)})]}):null]}),s("div",{className:"rp-json-card",children:[s("div",{className:"rp-json-head",children:[n("span",{className:"rp-json-lang",children:"json"}),n(yt,{text:o,onCopy:r})]}),n("pre",{className:"rp-json",children:zr(o).map((i,u)=>n("span",{className:`rp-j-${i.type}`,children:i.text},u))})]})]})}function _t({ctx:e,branchId:r,refreshTick:o,onClose:a,onRefresh:i}){let[u,N]=v(null),[d,V]=v(null),[D,w]=v(!1),[U,E]=v(null),[b,R]=v(null),le=Ze(null);O(()=>{let p=!1,T=null,$=async()=>{try{let h=await ur(e,r);if(p)return!0;N(h),E(null);let G=h.branch.child_session_id;if(G!==null){let ue=await pr(e,h.branch.parent_session_id,G,h.branch.fork_before_ts);p||V(ue)}else V(null);return gt.has(h.branch.state)}catch(h){return p||E(P(h)),!1}},Y=async()=>{let h=await $();!p&&!h&&(T=e.setTimeout(()=>{Y()},2500))};return Y(),()=>{p=!0,T!==null&&T()}},[e,r,o]);let ee=async()=>{w(!0),E(null);try{await mr(e,r),i()}catch(p){E(P(p))}finally{w(!1)}},re=async p=>{w(!0),E(null),R(null);try{await Xe(e,r),i()}catch(T){E(P(T)),R(p)}finally{w(!1)}},A=async()=>{w(!0),E(null);try{let p=await gr(e,r);p.uncommitted===0?(await Xe(e,r),i()):R(p)}catch(p){E(P(p))}finally{w(!1)}};if(O(()=>{R(null)},[r]),O(()=>{if(b===null)return;let p=T=>{T.key==="Escape"&&$r()&&R(null)};return window.addEventListener("keydown",p),()=>{window.removeEventListener("keydown",p)}},[b]),O(()=>{if(b===null)return;let p=document.activeElement;return le.current?.focus(),()=>{p instanceof HTMLElement&&p.focus()}},[b]),u===null)return n("div",{className:"rp-meta",children:"Loading branch..."});let y=u.branch,k=u.run,j=k?.verify_exit??d?.right?.verify_exit??null,q=y.verify_cmd?y.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",te=y.worktree_path?void 0:"This branch has no workspace left to remove.";return s("div",{className:"rp-stack",children:[s("div",{className:"rp-branch-head",children:[s("div",{className:"rp-branch-title",children:[s("span",{children:["Branch ",Z(y.id)]}),s("span",{className:"rp-badge","data-tone":Ar(y.state),children:[n("span",{className:"rp-dot"}),y.state]}),k!==null&&k.verify_exit!==null?s("span",{className:"rp-badge","data-tone":k.verify_exit===0?"ok":"err",children:["verify ",Ye(k.verify_exit)]}):null]}),s("div",{className:"rp-branch-actions",children:[n("button",{type:"button",className:"rp-button rp-button-sm",title:q,onClick:()=>{ee()},disabled:D||!y.verify_cmd||!y.worktree_path,children:"Verify"}),n("button",{type:"button",className:"rp-button rp-button-sm",title:te,onClick:()=>{A()},disabled:D||!y.worktree_path,children:"Cleanup"}),n("button",{type:"button",className:"rp-button rp-button-sm rp-quiet",onClick:a,children:"Hide"})]})]}),u.shared_child?n("div",{className:"rp-note rp-note-warn",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,U!==null?n("div",{className:"rp-error",children:U}):null,b!==null?s("div",{className:"rp-confirm",ref:le,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[n("div",{className:"rp-confirm-copy",children:yr(b.uncommitted)}),n("div",{className:"rp-confirm-path",children:b.worktree_path}),s("div",{className:"rp-confirm-actions",children:[n("button",{type:"button",className:"rp-button rp-button-sm rp-delete",onClick:()=>{re(b)},disabled:D,children:"Delete workspace"}),n("button",{type:"button",className:"rp-button rp-button-sm",onClick:()=>{R(null)},children:"Cancel"})]})]}):null,d!==null?s("div",{className:"rp-stack",children:[s("div",{className:"rp-compare",children:[s("div",{className:"rp-panel",children:[s("div",{className:"rp-card-label",children:["Original",d.left?.frozen_at?` \xB7 frozen ${fe(d.left.frozen_at)}`:""]}),s("div",{className:"rp-metrics",children:[n(ge,{label:"outcome",value:d.left===null?"not recorded":xr(d.left.outcome),tone:d.left===null?"idle":Ee(d.left.outcome)}),n(ge,{label:"tokens",value:d.left===null?"n/a":we(d.left.tokens_in+d.left.tokens_out)}),n(ge,{label:"tool errors",value:d.left===null?"n/a":String(d.left.tool_errors),tone:d.left!==null&&d.left.tool_errors>0?"err":"idle"})]})]}),s("div",{className:"rp-panel",children:[n("div",{className:"rp-card-label rp-card-label-accent",children:"Rerun"}),s("div",{className:"rp-metrics",children:[n(ge,{label:"outcome",value:d.right===null?"not recorded":Me(d.right.outcome),tone:d.right===null?"idle":Ee(d.right.outcome)}),n(ge,{label:"verify",value:j===null?"not run":Ye(j),tone:j===null?"idle":j===0?"ok":"err"}),n(ge,{label:"tokens",value:d.right===null?"n/a":we(d.right.tokens_in+d.right.tokens_out)}),n(ge,{label:"tool errors",value:d.right===null?"n/a":String(d.right.tool_errors),tone:d.right!==null&&d.right.tool_errors>0?"err":"idle"})]})]})]}),s("div",{className:"rp-verdict",children:[n(C,{name:"info",size:13}),s("span",{children:[n("strong",{children:"Verdict"})," ",d.verdict]})]})]}):n("div",{className:"rp-meta",children:y.state==="cleaned"||y.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),k!==null&&k.verify_out?n("pre",{className:"rp-pre",children:k.verify_out}):null,u.prompt!==null?s("details",{className:"rp-panel rp-disclosure",children:[n("summary",{children:"Prompt"}),n("pre",{className:"rp-pre",children:u.prompt})]}):null]})}function Br({ctx:e}){let r=pt(ut.state.activeSessionId),[o,a]=v([]),[i,u]=v(null),[N,d]=v([]),[V,D]=v(!1),[w,U]=v(!1),[E,b]=v(null),[R,le]=v({}),[ee,re]=v([]),[A,y]=v([]),[k,j]=v(null),[q,te]=v(null),[p,T]=v(null),[$,Y]=v(null),[h,G]=v(0),[ue,B]=v(null),[Le,We]=v(0),[ve,z]=v(!1),[_e,pe]=v(!1),[ce,xe]=v(null),[ne,Ne]=v(""),[K,be]=v(""),[oe,Se]=v(null),[De,de]=v(!1),[ae,ie]=v(mt),[Ve,W]=v(!1),l=Ze(null),m=Ze(ae);O(()=>{m.current=ae},[ae]),O(()=>{let t=null,f=e.onEvent("*",()=>{t===null&&(t=e.setTimeout(()=>{t=null,We(F=>F+1)},1500))});return()=>{f(),t!==null&&t()}},[e]),O(()=>{if(p===null||$!==null)return;let t=f=>{f.key==="Escape"&&!$r()&&T(null)};return window.addEventListener("keydown",t),()=>{window.removeEventListener("keydown",t)}},[p,$]),O(()=>{let t=!1,f=async()=>{try{let I=await nr(e);if(t)return;a(I),z(!0),B(null),u(Pe=>Pe!==null&&I.some(Ue=>Ue.session_id===Pe)?Pe:r??I[0]?.session_id??null)}catch(I){t||B(P(I))}};f();let F=e.setInterval(()=>{f()},1e4);return()=>{t=!0,F()}},[e,r,h,Le]),O(()=>{if(i===null){d([]),pe(!1),D(!1),xe(null),re([]),y([]);return}let t=!1,f=async()=>{try{let[I,Pe,Ue]=await Promise.all([Je(e,i),sr(e,i),lr(e,i)]);if(t)return;d(Or=>Ge(i,I.items,Or)),D(I.has_more),pe(!0),re(Pe),y(Ue),xe(null),B(null)}catch(I){t||(pe(!0),xe(P(I)))}};f();let F=e.setInterval(()=>{f()},1e4);return()=>{t=!0,F()}},[e,i,h,Le]),O(()=>{if(k===null){te(null);return}let t=!1;return ar(e,k).then(f=>{t||te(f)}).catch(f=>{t||B(P(f))}),()=>{t=!0}},[e,k]),O(()=>{let t=K.trim();if(t.length<2||i===null){Se(null),de(!1);return}let f=!1;de(!0);let F=e.setTimeout(()=>{ir(e,i,t).then(I=>{f||(Se(I.items),de(!1))}).catch(I=>{f||(de(!1),B(P(I)))})},200);return()=>{f=!0,F()}},[e,K,i]);let g=o.find(t=>t.session_id===i)??null,S=ne.trim().toLowerCase(),_=S===""?o:o.filter(t=>`${t.title??""} ${t.model??""} ${t.session_id}`.toLowerCase().includes(S)),J=g!==null&&g.ended_at===null,$e=J&&g.session_id===r,se=i===null?[]:N.filter(t=>t.session_id===i),M=K.trim().length>=2,Q=t=>{u(t.session_id),j(null),T(null),b(null),le({}),d([]),pe(!1),D(!1),xe(null),re([]),y([]),be(""),Se(null)},me=()=>{G(t=>t+1)},Ce=t=>{if(E===t.id){b(null);return}b(t.id),R[t.id]===void 0&&or(e,t.session_id,t.seq,t.seq_to).then(f=>{le(F=>({...F,[t.id]:f}))}).catch(f=>{B(P(f))})},Fe=async()=>{let t=se[se.length-1];if(!(i===null||t===void 0)){U(!0);try{let f=await Je(e,i,t.seq);d(F=>Ge(i,f.items,F)),D(f.has_more)}catch(f){B(P(f))}finally{U(!1)}}};return s("div",{className:"rw-page rp-shell",children:[n("style",{children:ft}),s("header",{className:"rp-head",children:[s("div",{className:"rp-head-left",children:[n("span",{className:"rp-mark",children:n(C,{name:"rewind",size:16})}),s("div",{children:[n("div",{className:"rp-title",children:"Session Rewind"}),n("div",{className:"rp-sub",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]})]}),s("div",{className:"rp-head-right",children:[g!==null?n("span",{className:"rp-pill rp-mono",title:g.model??void 0,children:g.model??"unknown model"}):null,J?s("span",{className:"rp-live",children:[n("span",{className:"rp-dot"}),$e?"live":"running"]}):null,s("button",{type:"button",className:"rp-button",onClick:me,children:[n(C,{name:"refresh",size:13}),"Refresh"]})]})]}),ue!==null?n("div",{className:"rp-error",children:ue}):null,s("div",{className:"rp-columns",children:[s("aside",{className:"rp-side",children:[s("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Sessions",ve?n("span",{className:"rp-eyebrow-count",children:br(_.length,Ke)}):null]}),ve&&o.length>0?n("input",{type:"text",className:"rp-search",placeholder:"Filter sessions...","aria-label":"Filter sessions",value:ne,onChange:t=>{Ne(t.target.value)},onKeyDown:t=>{t.key==="Escape"&&ne!==""&&(Ne(""),t.preventDefault(),t.stopPropagation())}}):null,ve?o.length===0?s("div",{className:"rp-meta rp-empty",children:[n(C,{name:"info",size:13}),"Start a chat and Rewind will record every turn."]}):_.length===0?n("div",{className:"rp-meta",children:"No session matches the filter."}):n("div",{className:"rp-cards",children:_.map(t=>s("button",{type:"button",className:"rp-session","aria-current":i===t.session_id?"true":void 0,onClick:()=>{Q(t)},children:[s("span",{className:"rp-session-title",children:[n("span",{className:"rp-dot",style:{color:ht(Ee(t.outcome))}}),n("span",{title:t.title??Z(t.session_id),children:t.title??Z(t.session_id)}),n("span",{className:"rp-session-when",children:t.last_event_at!==null?vr(t.last_event_at):""})]}),s("span",{className:"rp-meta",children:[t.model??"unknown model"," \xB7 ",X(t.event_count,"event")]}),s("span",{className:"rp-meta rp-meta-dim",children:[Me(t.outcome)," \xB7"," ",we(t.tokens_in+t.tokens_out)," tokens"]})]},t.session_id))}):n("div",{className:"rp-meta",children:"Loading sessions..."})]}),s("main",{className:"rp-main",children:[g!==null?s("div",{className:"rp-detail-head",children:[s("div",{className:"rp-stack",style:{gap:5},children:[n("div",{className:"rp-detail-title",children:g.title??Z(g.session_id)}),s("div",{className:"rp-stats",children:[ee.length>0?n(ze,{label:"snapshot",value:String(ee.length)}):null,n(ze,{label:"events",value:we(g.event_count)}),n(ze,{label:"tokens",value:we(g.tokens_in+g.tokens_out)}),g.ended_at!==null?n(ze,{label:"window",value:`${fe(g.started_at)} \u2192 ${fe(g.ended_at)}`}):null,n(ze,{label:"outcome",value:Me(g.outcome),mono:!1,tone:Ee(g.outcome)})]}),s("div",{className:"rp-meta",children:[g.model??"unknown model",g.ended_at===null?` \xB7 ${hr(g.last_event_at)}`:""]})]}),n("div",{className:"rp-hint",children:"Select a user turn and choose Rewind."})]}):null,A.length>0?s("div",{children:[s("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Branches",n("span",{className:"rp-eyebrow-count",children:A.length})]}),n("div",{className:"rp-chips",children:A.map(t=>s("button",{type:"button",className:"rp-chip","aria-current":p===t.id?"true":void 0,onClick:()=>{T(t.id)},children:[n("span",{className:"rp-mono",children:Z(t.id)}),s("span",{className:"rp-badge","data-tone":Ar(t.state),children:[n("span",{className:"rp-dot"}),t.state]}),n("span",{className:"rp-chip-note",children:t.fork_row_count>0?X(t.fork_row_count,"message"):"context pack"})]},t.id))})]}):null,s("div",{className:"rp-columns",style:{gap:0,"--rp-payload-width":`${ae}px`},children:[n("div",{className:"rp-turns",children:s("div",{className:"rp-stack",style:{width:"100%"},children:[s("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),M?"Search results":"Turns",M&&oe!==null?n("span",{className:"rp-eyebrow-count",children:oe.length}):null]}),g===null?n("div",{className:"rp-meta",children:"Select a recorded session."}):s(Ie,{children:[n("input",{type:"text",className:"rp-search",placeholder:"Search events in this session...","aria-label":"Search events",value:K,onChange:t=>{be(t.target.value)},onKeyDown:t=>{t.key==="Escape"&&K!==""&&(be(""),t.preventDefault(),t.stopPropagation())}}),M?De?n("div",{className:"rp-meta",children:"Searching..."}):oe===null||oe.length===0?s("div",{className:"rp-meta",children:["No event matches \u201C",K.trim(),"\u201D."]}):n("div",{className:"rp-events rp-search-results",children:oe.map(t=>n(er,{event:t,selected:k===t.id,onSelect:()=>{j(t.id)}},t.id))}):_e?se.length===0?n("div",{className:"rp-meta",children:wr(g.event_count,ce)}):s(Ie,{children:[se.map(t=>n(xt,{turn:t,expanded:E===t.id,events:R[t.id]??null,loading:E===t.id&&R[t.id]===void 0,selectedEventId:k,onToggle:()=>{Ce(t)},onFork:()=>{g!==null&&Y({session:g,event:t})},onSelectEvent:f=>{j(f.id)}},t.id)),V?n("button",{type:"button",className:"rp-load-more",onClick:()=>{Fe()},disabled:w,children:w?"Loading...":"Load earlier turns"}):s("div",{className:"rp-tail",children:[X(se.length,"turn")," \xB7 start of the recording"]})]}):n("div",{className:"rp-meta",children:"Loading turns..."})]})]})}),n("div",{role:"separator","aria-orientation":"vertical","aria-label":"Resize event payload panel",tabIndex:0,className:"rp-divider","data-dragging":Ve?"true":void 0,onPointerDown:t=>{l.current={startX:t.clientX,startWidth:ae},W(!0),t.currentTarget.setPointerCapture(t.pointerId)},onPointerMove:t=>{let f=l.current;f!==null&&ie(je(f.startWidth-(t.clientX-f.startX)))},onPointerUp:t=>{l.current!==null&&(l.current=null,W(!1),Oe(m.current),t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId))},onPointerCancel:t=>{l.current!==null&&(l.current=null,W(!1),t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId))},onKeyDown:t=>{if(t.key==="ArrowLeft"){let f=je(m.current+16);ie(f),Oe(f),t.preventDefault()}else if(t.key==="ArrowRight"){let f=je(m.current-16);ie(f),Oe(f),t.preventDefault()}},onDoubleClick:()=>{ie(ke),Oe(ke)}}),s("div",{className:"rp-payload",children:[s("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Event payload"]}),n(kt,{detail:q,onCopy:t=>{e.os.writeClipboard(t)}})]})]})]})]}),p!==null?n("div",{className:"rp-compare-wrap",children:n(_t,{ctx:e,branchId:p,refreshTick:h,onClose:()=>{T(null)},onRefresh:me})}):null,$!==null?n(Tr,{ctx:e,session:$.session,event:$.event,onClose:()=>{Y(null)},onCreated:t=>{T(t),me()}}):null]})}import{jsx as Hr}from"react/jsx-runtime";var Et={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let r=()=>{Nt.navigate(he)};e.registerMany([{id:"page",area:Pt,data:{path:he},render:()=>Hr(Br,{ctx:e})},{id:"nav",area:Rt,data:{path:he,label:"Rewind",codicon:"history"}},{id:"palette-open",area:Ct,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:r}},{id:"keybind-open",area:St,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:r}},{id:"chip",area:Mt.right,order:130,render:()=>Hr(tr,{})}])}},vn=Et;export{vn as default};
