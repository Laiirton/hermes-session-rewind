import{host as _t,KEYBINDS_AREA as Nt,PALETTE_AREA as St,ROUTES_AREA as Ct,SIDEBAR_NAV_AREA as Pt,STATUSBAR_AREAS as Rt}from"@hermes/plugin-sdk";import{host as rr,useValue as jr}from"@hermes/plugin-sdk";var we="/rewind";import{jsx as Wr,jsxs as Vr}from"react/jsx-runtime";function tr(){let e=jr(rr.state.activeSessionId);return Vr("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{rr.navigate(we)},title:"Open Session Rewind",children:[Wr("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-(--ui-green)"}`}),"Rewind"]})}import{host as lt,useValue as ut}from"@hermes/plugin-sdk";import{Fragment as pt,useEffect as H,useRef as Ze,useState as g}from"react";function Ee(e,r,o){return e.rest(r,{method:"POST",body:o})}var Ue=100;async function nr(e){return(await e.rest(`/sessions?limit=${Ue}`)).items}async function Ke(e,r,o=null){let a=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(r)}/turns?limit=40${a}`)}async function or(e,r,o,a){return(await e.rest(`/sessions/${encodeURIComponent(r)}/events?limit=200&after_seq=${o-1}&before_seq=${a+1}`)).items}function ar(e,r){return e.rest(`/events/${r}`)}async function ir(e,r,o,a=30){let i=new URLSearchParams({q:o,session_id:r,limit:String(a)});return e.rest(`/search?${i.toString()}`)}function sr(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/snapshots`)}function lr(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/branches`)}function ur(e,r){return Ee(e,`/branches/${encodeURIComponent(r)}/reconcile`,{})}function pr(e,r,o,a=null){let i=a===null?"":`&before_ts=${a}`;return e.rest(`/compare?left=${encodeURIComponent(r)}&right=${encodeURIComponent(o)}${i}`)}function cr(e,r){return Ee(e,"/forks/prepare",r)}function dr(e,r,o){return Ee(e,`/forks/${encodeURIComponent(r)}/commit`,o)}function mr(e,r){return Ee(e,`/forks/${encodeURIComponent(r)}/verify`,{})}function fr(e,r,o){return e.rest(`/branches/${encodeURIComponent(r)}/verify-resolve?cmd=${encodeURIComponent(o)}`)}function gr(e,r){return e.rest(`/forks/${encodeURIComponent(r)}/workspace`)}function Je(e,r){return Ee(e,`/forks/${encodeURIComponent(r)}/cleanup`,{})}function le(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ye(e){return e.toLocaleString()}function vr(e){let r=Math.max(0,Math.round(Date.now()/1e3-e));if(r<60)return"just now";let o=Math.round(r/60);if(o<60)return`${o}m`;let a=Math.round(o/60);if(a<24)return`${a}h`;let i=Math.round(a/24);return i<30?`${i}d`:`${Math.round(i/30)}mo`}function Ae(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Ur=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function R(e){let r=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",o=Ur.exec(r),a=o?.[1];if(o===null||a===void 0)return r;let i=Kr(a);return i===void 0?r:r.replace(o[0],i)}function Kr(e){try{let r=JSON.parse(e);return typeof r.detail=="string"&&r.detail.length>0?r.detail:void 0}catch{return}}function ee(e,r=8){return e.length<=r?e:e.slice(0,r)}function X(e,r){return`${e} ${e===1?r:`${r}s`}`}function Xe(e){return e===0?"passed":`failed (exit ${e})`}var Jr={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function Me(e){return e===null?"recording":Jr[e]??e}function ze(e){return e===null?"warn":e==="completed"?"ok":e==="failed"?"err":"idle"}function xr(e){return e===null?"open at freeze":Me(e)}function br(e,r){return e===0?"":e>=r?`${r}+`:`${e}`}function Xr(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function hr(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${Xr(e)}`}function wr(e,r){return r!==null?`The turns could not be loaded: ${r}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${X(e,"event")} but no user turn.`}function yr(e){return e===null?"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.":`This workspace holds ${X(e,"uncommitted file")}. Deleting it removes them for good; the rerun conversation stays in the recording.`}import{host as B}from"@hermes/plugin-sdk";import{useCallback as Qr,useEffect as Ie,useRef as Ye,useState as F}from"react";function Yr(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let r=e.content;return typeof r=="string"?r.trim():Array.isArray(r)?r.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let a=o.text;return typeof a=="string"?a:""}).join("").trim():""}function kr(e,r){let o=(e??[]).filter(u=>(u.role==="user"||u.role==="assistant")&&Yr(u).length>0&&typeof u.row_id=="number"),a=-1;for(let u=0;u<o.length;u+=1){let N=o[u];if(N===void 0)continue;let c=N.timestamp;N.role==="user"&&typeof c=="number"&&c<=r+.5&&(a=u)}if(a<=0)return null;let i=o[a-1]?.row_id;return typeof i=="number"&&i>0?i:null}var _r={providers:[],currentModel:null,currentProvider:null};function qe(e){return typeof e=="string"?e.trim():""}function Nr(e){let r=qe(e);return r===""?null:r}function Sr(e){if(e===null||typeof e!="object")return _r;let r=e.providers;if(!Array.isArray(r))return _r;let o=[];for(let a of r){if(a===null||typeof a!="object")continue;let i=a,u=qe(i.slug),N=Array.isArray(i.models)?i.models.map(qe).filter(c=>c!==""):[];u===""||N.length===0||o.push({slug:u,name:qe(i.name)||u,isCurrent:i.is_current===!0,models:N})}return{providers:o,currentModel:Nr(e.model),currentProvider:Nr(e.provider)}}function Cr(e,r){return[...e.providers].sort((o,a)=>{let i=r!==null&&o.slug===r?0:1,u=r!==null&&a.slug===r?0:1;return i!==u?i-u:o.isCurrent!==a.isCurrent?o.isCurrent?-1:1:o.name.localeCompare(a.name)})}function Pr(e,r){let o=r.trim().toLowerCase();if(o==="")return e;let a=[];for(let i of e){if(i.name.toLowerCase().includes(o)||i.slug.toLowerCase().includes(o)){a.push(i);continue}let u=i.models.filter(N=>N.toLowerCase().includes(o));u.length>0&&a.push({...i,models:u})}return a}function Rr(e,r){let o=r===null?"":` --provider ${r}`;return`${e}${o} --session`}function Tr(e,r,o,a){return e===""?!1:e!==(o??"")||r!==a}import{jsx as Er}from"react/jsx-runtime";var Gr={rewind:"M3 12a9 9 0 1 0 3-6.7M3 4v5h5",refresh:"M20 11a8 8 0 0 0-14 5l-2 2M4 13a8 8 0 0 0 14-5l2-2",branch:"M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0-3-3M15 9v3a3 3 0 0 0 3 3h3",lock:"M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",folder:"M3 7h6l2 2h10v11H3z",close:"M5 5l14 14M19 5L5 19",chevron:"M9 6l6 6-6 6",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01",copy:"M9 9h11v11H9zM5 15V5a1 1 0 0 1 1-1h10",check:"M4 12l5 5L20 7",message:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",reply:"M9 14L4 9l5-5M20 20v-7a4 4 0 0 0-4-4H4",tool:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",inbox:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8",layers:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",event:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18"};function P({name:e,size:r=14,className:o}){return Er("svg",{"aria-hidden":"true",className:o,viewBox:"0 0 24 24",width:r,height:r,fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round",focusable:"false",children:Er("path",{d:Gr[e]})})}import{Fragment as at,jsx as p,jsxs as b}from"react/jsx-runtime";var Zr=["python -m pytest -q","npm test","cargo test","go test ./..."],et=350,rt=400;function ke(e,r){return r.catch(o=>{throw new Error(`${e}: ${R(o)}`)})}function tt(e){if(e===null)return[];let r=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(r).filter(o=>!o.hasAttribute("disabled"))}function nt(e,r){let o=tt(e),a=o[0],i=o[o.length-1];if(e===null||a===void 0||i===void 0)return;let u=document.activeElement;if(!e.contains(u)){r.preventDefault(),a.focus();return}r.shiftKey&&u===a?(r.preventDefault(),i.focus()):!r.shiftKey&&u===i&&(r.preventDefault(),a.focus())}var ot=`
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
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 2;
  max-height: 320px;
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
`;function Mr({ctx:e,session:r,event:o,onClose:a,onCreated:i}){let[u,N]=F(""),[c,V]=F(null),[L,y]=F({providers:[],currentModel:null,currentProvider:null}),[U,E]=F(!1),[k,T]=F(!1),[A,Y]=F(""),[O,re]=F(""),[h,S]=F(""),[f,Ne]=F(null),[K,v]=F(null),[w,q]=F(null),[te,C]=F(null),[pe,ce]=F(!1),J=Ye([]),M=w!==null,Se=Ye(null),de=Ye(()=>{}),ie=Qr(()=>{M||(ce(!0),J.current.push(e.setTimeout(a,100)))},[M,e,a]);Ie(()=>{let l=J.current;return()=>{for(let d of l)d()}},[]),Ie(()=>{let l=document.activeElement;return Se.current?.focus(),()=>{l?.focus()}},[]),Ie(()=>{let l=d=>{if(d.key==="Escape"&&!M){if(k){T(!1);return}ie();return}if(d.key==="Tab"){nt(Se.current,d);return}if(d.key==="Enter"&&(d.metaKey||d.ctrlKey)&&!M){if(k)return;d.preventDefault(),de.current()}};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[M,ie,k]),Ie(()=>{let l=h.trim();if(f===null||l===""){v(null);return}let d=!1,z=e.setTimeout(()=>{fr(e,f.branch_id,l).then(_=>{d||v(_)}).catch(()=>{d||v(null)})},et);return()=>{d=!0,z()}},[e,f,h]),Ie(()=>{let l=!1;return B.request("model.options",{explicit_only:!0,include_unconfigured:!1}).then(d=>{if(l)return;let z=Sr(d);y(z),E(z.providers.length===0)}).catch(()=>{l||E(!0)}),()=>{l=!0}},[]);let je=Cr(L,r.provider),G=Pr(je,A),$e=u.trim()===""?r.model??"":u.trim(),ne=c??r.provider,me=ne===null?"":L.providers.find(l=>l.slug===ne)?.name??ne,Ce=(l,d)=>{N(d),V(l),T(!1),Y("")},oe=()=>{N(""),V(null),T(!1),Y("")},fe=async()=>{let l=await B.request("session.active_list",{}),d=Array.isArray(l.sessions)?l.sessions:[],z=d.find(_=>_.session_key===r.session_id)?.id??d.find(_=>_.id===r.session_id)?.id;if(z===void 0)return{runtimeId:void 0,storedId:r.stored_session_id};try{let _=await B.request("session.title",{session_id:z});return{runtimeId:z,storedId:_.session_key??r.stored_session_id}}catch{return{runtimeId:z,storedId:r.stored_session_id}}},ae=async()=>{q("prepare"),C(null);try{let l=await fe(),d=await cr(e,{session_id:r.session_id,stored_session_id:l.storedId,event_id:o.id,model:u.trim()||null,provider:c,prompt:O.trim()||null,verify_cmd:h.trim()||null});Ne(d),re(d.prompt),d.verify_presets.length>0&&h.trim()===""&&S(d.verify_presets[0]??"")}catch(l){C(R(l))}finally{q(null)}},ge=async()=>{if(f!==null){q("run"),C(null);try{let l=await fe(),d=l.runtimeId,z=`\u21BA ${r.title??ee(r.session_id)} \xB7 ${ee(f.branch_id)}`,_=null;if(d!==void 0)try{let I=await B.request("session.history",{session_id:d});_=kr(I.messages,f.fork_before_ts)}catch{_=null}let j,x,Re=!1;if(_!==null&&d!==void 0){let I=await ke("could not branch the session",B.request("session.branch",{session_id:d,through_message_id:_}));j=I.session_id,x=I.stored_session_id}else{let I={source:"desktop",title:z};f.worktree_path!==null&&(I.cwd=f.worktree_path),l.storedId!==null&&(I.parent_session_id=l.storedId);let Q=await ke("could not create the branch session",B.request("session.create",I));j=Q.session_id,x=Q.stored_session_id,Re=!0}if(Re&&f.worktree_path!==null){let I=()=>B.request("session.cwd.set",{session_id:j,cwd:f.worktree_path});try{await ke("could not attach the isolated workspace",I())}catch(Q){throw Q instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${R(Q)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(await ke("could not open the rerun session",B.openSession(x,{intent:"tab"})),Tr(u.trim(),c,r.model,r.provider)){let I=Rr(u.trim(),c),Q=()=>B.request("config.set",{key:"model",value:I,session_id:j,confirm_expensive_model:!1}),Z=!1,se=null,Fe="";for(let be=0;be<2&&!Z;be+=1)try{let he=await Q();Z=!0,se=he.confirm_required===!0?he.confirm_message??null:null}catch(he){Fe=R(he),await new Promise(We=>{setTimeout(We,rt)})}Z?se!==null&&B.notify({kind:"info",message:se,detail:`The rerun started before the switch could be confirmed; ${u.trim()} applies from the next turn.`}):B.notify({kind:"warning",message:`The rerun runs on ${r.model??"the session model"}, not ${u.trim()}.`,detail:Fe})}let xe=O.trim()||f.prompt;await ke("could not record the branch",dr(e,f.branch_id,{child_session_id:j,child_stored_session_id:x,model:u.trim()||r.model,provider:c??r.provider,prompt:xe,verify_cmd:h.trim()||null})),await ke("could not start the rerun",B.request("prompt.submit",{session_id:j,text:xe})),i(f.branch_id),a()}catch(l){C(R(l))}finally{q(null)}}};de.current=()=>{f===null?ae():ge()};let Pe=f!==null,ve=h.trim(),$=[];return Pe?(f.fidelity!=="full"&&$.push({warn:!0,text:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}),f.context_rows===null&&$.push({warn:!0,text:"The live transcript prefix is unavailable. The context pack is the only context."}),r.ended_at!==null&&$.push({warn:!1,text:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}),f.fork_row_count===0&&r.ended_at===null&&$.push({warn:!1,text:"This is the first turn. The rerun starts a fresh chat in the restored workspace."})):$.push({warn:!1,text:"Prepare reads the recorded context for this turn and drafts the rerun prompt. Nothing runs until you fork."}),b("div",{className:"rw-overlay","data-closing":pe?"true":"false",onMouseDown:l=>{l.target===l.currentTarget&&ie()},children:[p("style",{children:ot}),b("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title","aria-describedby":"rw-reassure",tabIndex:-1,ref:Se,children:[b("header",{className:"rw-head",children:[p("span",{className:"rw-mark",children:p(P,{name:"rewind",size:16})}),b("div",{className:"rw-heading",children:[p("div",{className:"rw-eyebrow",children:"Session Rewind"}),p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"})]}),p("button",{type:"button",className:"rw-close",onClick:ie,disabled:M,"aria-label":"Close",children:p(P,{name:"close",size:15})})]}),b("div",{className:"rw-body",children:[b("div",{className:"rw-turn",children:[p("span",{className:"rw-turn-icon",children:p(P,{name:"message",size:12})}),p("span",{className:"rw-turn-time",children:le(o.ts)}),p("span",{className:"rw-turn-text",title:o.preview||"user turn",children:o.preview||"user turn"})]}),te!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:te}):null,Pe&&f.worktree_path?b("div",{className:"rw-path",children:[p("span",{className:"rw-path-text",title:f.worktree_path,children:f.worktree_path}),p("button",{type:"button",className:"rw-icon-button",onClick:()=>{e.os.revealPath(f.worktree_path??"")},disabled:M,"aria-label":"Reveal the isolated workspace",children:p(P,{name:"folder",size:13})})]}):null,$.length>0?p("div",{className:"rw-notes",children:$.map(l=>b("div",{className:`rw-note${l.warn?" rw-note-warn":""}`,role:l.warn?"status":void 0,children:[p(P,{name:"info"}),p("span",{children:l.text})]},l.text))}):null,b("div",{className:"rw-grid",children:[b("div",{className:"rw-field",children:[p("span",{className:"rw-label",id:"rw-model-label",children:"Model"}),b("button",{type:"button",className:`rw-trigger${k?" rw-trigger-open":""}`,onClick:()=>{T(!k)},disabled:M,"aria-haspopup":"listbox","aria-expanded":k,"aria-labelledby":"rw-model-label rw-model-value",children:[p("span",{className:"rw-trigger-text",id:"rw-model-value",children:$e===""?"Session model":$e}),me===""?null:p("span",{className:"rw-trigger-provider",children:me}),p("span",{className:"rw-trigger-caret","aria-hidden":"true","data-open":k,children:p(P,{name:"chevron",size:12})})]}),k?b("div",{className:"rw-picker",children:[p("input",{className:"rw-search",value:A,onChange:l=>{Y(l.target.value)},onKeyDown:l=>{let d=G[0];l.key==="Enter"&&d!==void 0&&(l.preventDefault(),Ce(d.slug,d.models[0]??""))},placeholder:"Search models","aria-label":"Search models",autoFocus:!0}),b("div",{className:"rw-picker-list",role:"listbox","aria-label":"Models",children:[b("button",{type:"button",className:"rw-option rw-option-keep",role:"option","aria-selected":u.trim()==="",onClick:oe,children:["Keep the session model",r.model===null?null:p("span",{className:"rw-option-sub",children:r.model})]}),G.map(l=>b("div",{className:"rw-group",role:"group","aria-label":l.name,children:[b("div",{className:"rw-group-head",children:[p("span",{children:l.name}),p("span",{className:"rw-count",children:l.models.length})]}),l.models.map(d=>b("button",{type:"button",className:"rw-option",role:"option","aria-selected":d===u.trim()&&l.slug===c,onClick:()=>{Ce(l.slug,d)},children:[p("span",{className:"rw-option-text",children:d}),d===r.model?p("span",{className:"rw-option-tag",children:"session"}):null]},d))]},l.slug)),G.length===0&&A.trim()!==""?p("button",{type:"button",className:"rw-option",role:"option",onClick:()=>{N(A.trim()),V(null),T(!1),Y("")},children:b("span",{className:"rw-option-text",children:["Use \u201C",A.trim(),"\u201D as typed"]})}):null,G.length===0&&A.trim()===""?p("div",{className:"rw-picker-empty",children:"No configured provider offers a model."}):null]})]}):null,p("span",{className:"rw-help",children:U?"Could not read the model list, so the rerun keeps the session model.":"Lists the providers configured in Hermes."})]}),b("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:h,onChange:l=>{S(l.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(f?.verify_presets.length?f.verify_presets:Zr).map(l=>p("button",{type:"button",className:"rw-preset","aria-pressed":l===ve,onClick:()=>{S(l)},disabled:M,children:l},l))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),K!==null&&K.command===h.trim()?p("span",{className:"rw-resolved",children:K.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":b(at,{children:[p("span",{children:"Resolves to"}),p("span",{className:"rw-resolved-path",title:K.resolved,children:K.resolved})]})}):null]})]}),b("label",{className:"rw-field",children:[b("span",{className:"rw-label-row",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),O.length>0?b("span",{className:"rw-count","aria-live":"polite",children:[O.length," chars"]}):null]}),p("textarea",{className:"rw-textarea",value:O,onChange:l=>{re(l.target.value)},placeholder:"Prepare drafts this from the recorded turn \u2014 or write your own now."})]})]}),b("footer",{className:"rw-footer",children:[b("span",{className:"rw-reassure",id:"rw-reassure",children:[p(P,{name:"lock",size:13}),p("span",{children:"Original session and workspace stay untouched."})]}),b("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:ie,disabled:M,children:"Cancel"}),Pe?b("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{ge()},disabled:M,"aria-busy":w==="run",children:[w==="run"?p("span",{className:"rw-spinner"}):null,w==="run"?"Forking":"Fork & run",w==="run"?null:p("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]}):b("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{ae()},disabled:M,"aria-busy":w==="prepare",children:[w==="prepare"?p("span",{className:"rw-spinner"}):null,w==="prepare"?"Preparing":"Prepare branch",w==="prepare"?null:p("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]})]})]})]})]})}function Ge(e,r,o){let a=new Set(r.map(u=>u.id)),i=o.filter(u=>u.session_id===e&&!a.has(u.id));return[...r,...i]}function it(e){let r=e.trim();if(r.length<2)return!1;let o=r[0];return o==="{"&&r.endsWith("}")||o==="["&&r.endsWith("]")}function Be(e,r=0){if(r>=4)return e;if(Array.isArray(e))return e.map(o=>Be(o,r+1));if(e!==null&&typeof e=="object"){let o={};for(let[a,i]of Object.entries(e))o[a]=Be(i,r+1);return o}if(typeof e=="string"&&it(e))try{let o=JSON.parse(e);if(o!==null&&typeof o=="object")return Be(o,r+1)}catch{}return e}var st=/(?<q>"(?:\\.|[^"\\])*")(?<c>\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\][,:]|\s+|./g;function zr(e){let r=[];for(let o of e.matchAll(st)){let a=o[0],i=o.groups?.q,u=o.groups?.c;if(i!==void 0){r.push({text:i,type:u!==void 0?"key":"string"}),u!==void 0&&r.push({text:u,type:"punct"});continue}a==="true"||a==="false"?r.push({text:a,type:"bool"}):a==="null"?r.push({text:a,type:"null"}):/^-?\d/.test(a)?r.push({text:a,type:"number"}):r.push({text:a,type:"punct"})}return r}function Ir(e){return JSON.stringify(Be(e),null,2)}var Qe=new Set(["api_request","llm_call"]);function Dr(e){let r=[],o=new Map;for(let a of e)if(!Qe.has(a.kind)){if(a.kind==="tool_call"&&a.tool_call_id!==null){let i={call:a,result:null};r.push(i),o.set(a.tool_call_id,i);continue}if(a.kind==="tool_result"&&a.tool_call_id!==null){let i=o.get(a.tool_call_id);if(i!==void 0){i.result=a;continue}}r.push({call:a,result:null})}return r}import{Fragment as Le,jsx as n,jsxs as s}from"react/jsx-runtime";var ct="[data-rw-confirm]",Lr="hermes-session-rewind:payload-width",_e=292;function Oe(e){return Number.isFinite(e)?Math.min(560,Math.max(240,Math.round(e))):_e}function dt(){try{let e=window.localStorage.getItem(Lr);return e===null?_e:Oe(Number(e))||_e}catch{return _e}}function He(e){try{window.localStorage.setItem(Lr,String(e))}catch{}}function $r(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(ct)!==null}var mt=`
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
`,ft=new Set(["done","failed","cleaned","discarded"]);function gt(e){return Ae(Math.max(0,(e.work_ts-e.ts)*1e3))}function er({event:e,nested:r=!1,selected:o,onSelect:a}){let i=!r&&e.name!==null;return s("button",{type:"button",className:"rp-event","data-depth":r?"1":"0","aria-current":o?"true":void 0,onClick:a,children:[n("span",{title:e.kind,className:"rp-event-icon",style:{color:qr(e.kind,e.status)},children:n(P,{name:xt(e.kind),size:12})}),n("span",{title:e.kind,className:"rp-event-kind",children:Fr(e.kind)}),s("span",{className:"rp-event-text",title:e.preview!==""?e.preview:void 0,children:[i?n("span",{className:"rp-event-name",children:e.name}):null,e.preview!==""?n("span",{className:"rp-event-preview",children:e.preview}):null]}),e.status==="error"?n("span",{className:"rp-badge","data-tone":"err",children:"error"}):null,n("span",{className:"rp-event-time rp-mono",children:Ae(e.duration_ms)})]})}function vt({turn:e,expanded:r,events:o,loading:a,selectedEventId:i,onToggle:u,onFork:N,onSelectEvent:c}){let V=Dr(o??[]),L=(o??[]).filter(y=>Qe.has(y.kind)).length;return s("div",{className:"rp-turn",children:[s("div",{className:"rp-turn-bar",children:[s("button",{type:"button",className:"rp-turn-row",onClick:u,"aria-expanded":r,children:[n("span",{className:"rp-caret","data-open":r?"true":"false",children:n(P,{name:"chevron",size:12})}),n("span",{className:"rp-turn-time rp-mono",children:le(e.ts)}),n("span",{className:"rp-turn-preview",title:e.preview||"User turn",children:e.preview||"User turn"}),n("span",{className:"rp-turn-stat",children:X(e.tool_calls,"tool")}),e.tool_errors>0?s("span",{className:"rp-badge","data-tone":"err",children:[n("span",{className:"rp-dot"}),X(e.tool_errors,"error")]}):null,n("span",{className:"rp-turn-duration rp-mono",children:gt(e)})]}),s("button",{type:"button",className:"rp-button rp-button-sm",onClick:N,children:[n(P,{name:"rewind",size:12}),"Rewind"]})]}),r?n("div",{className:"rp-events",children:a?n("div",{className:"rp-aside-note",children:"Loading events..."}):s(Le,{children:[V.map(y=>s(pt,{children:[n(er,{event:y.call,selected:i===y.call.id,onSelect:()=>{c(y.call)}}),y.result!==null?n(er,{event:y.result,nested:!0,selected:i===y.result.id,onSelect:()=>{let U=y.result;U!==null&&c(U)}}):null]},y.call.id)),L>0?s("div",{className:"rp-aside-note",children:[X(e.api_requests,"model request")," \xB7 ",X(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Fr(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function xt(e){return e==="user_turn"?"message":e==="assistant_response"?"reply":e==="tool_call"?"tool":e==="tool_result"?"inbox":e==="api_request"||e==="llm_call"?"zap":e==="compaction"?"layers":"event"}function Ar(e){return e==="done"?"ok":e==="failed"?"err":e==="running"?"run":"idle"}function De({label:e,value:r,mono:o=!0,tone:a="idle"}){let i=a==="idle"?"":` rp-tone-${a}`;return s("span",{className:"rp-stat",children:[n("span",{className:"rp-stat-label",children:e}),n("span",{className:`rp-stat-value${o?" rp-mono":""}${i}`,children:r})]})}function ue({label:e,value:r,tone:o="idle"}){return s(Le,{children:[n("span",{className:"rp-metric-label",children:e}),n("span",{className:`rp-metric-value rp-tone-${o}`,children:r})]})}function qr(e,r){return e==="tool_result"&&r==="error"?"var(--ui-red)":e==="assistant_response"||e==="tool_result"?"var(--ui-green)":e==="user_turn"?"var(--ui-accent)":e==="tool_call"?"var(--ui-purple)":e==="api_request"||e==="llm_call"?"var(--ui-orange)":e==="compaction"?"var(--ui-text-secondary)":"var(--ui-text-tertiary)"}function bt(e){return e==="ok"?"var(--ui-green)":e==="err"?"var(--ui-red)":e==="warn"?"var(--ui-yellow)":"var(--ui-text-quaternary)"}function ht(e){return e===null?null:e==="error"?"err":e==="ok"?"ok":"run"}function wt({text:e,onCopy:r}){let[o,a]=g(!1);return H(()=>{if(!o)return;let i=window.setTimeout(()=>{a(!1)},1600);return()=>{window.clearTimeout(i)}},[o]),s("button",{type:"button",className:"rp-button rp-button-sm rp-quiet","aria-label":"Copy payload",onClick:()=>{try{r(e),a(!0)}catch{}},children:[n(P,{name:o?"check":"copy",size:12}),o?"Copied":"Copy"]})}function yt({detail:e,onCopy:r}){if(e===null)return s("div",{className:"rp-inspect-empty",children:[n(P,{name:"info",size:14}),n("span",{children:"Select an event to inspect its payload."})]});let o=Ir(e.payload),a=ht(e.status);return s("div",{className:"rp-inspect",children:[s("div",{className:"rp-inspect-head",children:[s("span",{title:e.kind,className:"rp-inspect-kind",style:{color:qr(e.kind,e.status)},children:[n("span",{className:"rp-dot"}),Fr(e.kind)]}),n("span",{className:"rp-inspect-name",title:e.name??e.kind,children:e.name??e.kind}),a!==null?n("span",{className:"rp-badge","data-tone":a,children:e.status}):null]}),s("div",{className:"rp-inspect-meta",children:[s("span",{className:"rp-mono",children:["#",e.id]}),n("span",{className:"rp-inspect-sep",children:"\xB7"}),s("span",{className:"rp-mono",children:["seq ",e.seq]}),e.duration_ms!==null?s(Le,{children:[n("span",{className:"rp-inspect-sep",children:"\xB7"}),n("span",{className:"rp-mono",title:`${e.duration_ms} ms`,children:Ae(e.duration_ms)})]}):null]}),s("div",{className:"rp-json-card",children:[s("div",{className:"rp-json-head",children:[n("span",{className:"rp-json-lang",children:"json"}),n(wt,{text:o,onCopy:r})]}),n("pre",{className:"rp-json",children:zr(o).map((i,u)=>n("span",{className:`rp-j-${i.type}`,children:i.text},u))})]})]})}function kt({ctx:e,branchId:r,refreshTick:o,onClose:a,onRefresh:i}){let[u,N]=g(null),[c,V]=g(null),[L,y]=g(!1),[U,E]=g(null),[k,T]=g(null),A=Ze(null);H(()=>{let v=!1,w=null,q=async()=>{try{let C=await ur(e,r);if(v)return!0;N(C),E(null);let pe=C.branch.child_session_id;if(pe!==null){let ce=await pr(e,C.branch.parent_session_id,pe,C.branch.fork_before_ts);v||V(ce)}else V(null);return ft.has(C.branch.state)}catch(C){return v||E(R(C)),!1}},te=async()=>{let C=await q();!v&&!C&&(w=e.setTimeout(()=>{te()},2500))};return te(),()=>{v=!0,w!==null&&w()}},[e,r,o]);let Y=async()=>{y(!0),E(null);try{await mr(e,r),i()}catch(v){E(R(v))}finally{y(!1)}},O=async v=>{y(!0),E(null),T(null);try{await Je(e,r),i()}catch(w){E(R(w)),T(v)}finally{y(!1)}},re=async()=>{y(!0),E(null);try{let v=await gr(e,r);v.uncommitted===0?(await Je(e,r),i()):T(v)}catch(v){E(R(v))}finally{y(!1)}};if(H(()=>{T(null)},[r]),H(()=>{if(k===null)return;let v=w=>{w.key==="Escape"&&$r()&&T(null)};return window.addEventListener("keydown",v),()=>{window.removeEventListener("keydown",v)}},[k]),H(()=>{if(k===null)return;let v=document.activeElement;return A.current?.focus(),()=>{v instanceof HTMLElement&&v.focus()}},[k]),u===null)return n("div",{className:"rp-meta",children:"Loading branch..."});let h=u.branch,S=u.run,f=S?.verify_exit??c?.right?.verify_exit??null,Ne=h.verify_cmd?h.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",K=h.worktree_path?void 0:"This branch has no workspace left to remove.";return s("div",{className:"rp-stack",children:[s("div",{className:"rp-branch-head",children:[s("div",{className:"rp-branch-title",children:[s("span",{children:["Branch ",ee(h.id)]}),s("span",{className:"rp-badge","data-tone":Ar(h.state),children:[n("span",{className:"rp-dot"}),h.state]}),S!==null&&S.verify_exit!==null?s("span",{className:"rp-badge","data-tone":S.verify_exit===0?"ok":"err",children:["verify ",Xe(S.verify_exit)]}):null]}),s("div",{className:"rp-branch-actions",children:[n("button",{type:"button",className:"rp-button rp-button-sm",title:Ne,onClick:()=>{Y()},disabled:L||!h.verify_cmd||!h.worktree_path,children:"Verify"}),n("button",{type:"button",className:"rp-button rp-button-sm",title:K,onClick:()=>{re()},disabled:L||!h.worktree_path,children:"Cleanup"}),n("button",{type:"button",className:"rp-button rp-button-sm rp-quiet",onClick:a,children:"Hide"})]})]}),u.shared_child?n("div",{className:"rp-note rp-note-warn",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,U!==null?n("div",{className:"rp-error",children:U}):null,k!==null?s("div",{className:"rp-confirm",ref:A,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[n("div",{className:"rp-confirm-copy",children:yr(k.uncommitted)}),n("div",{className:"rp-confirm-path",children:k.worktree_path}),s("div",{className:"rp-confirm-actions",children:[n("button",{type:"button",className:"rp-button rp-button-sm rp-delete",onClick:()=>{O(k)},disabled:L,children:"Delete workspace"}),n("button",{type:"button",className:"rp-button rp-button-sm",onClick:()=>{T(null)},children:"Cancel"})]})]}):null,c!==null?s("div",{className:"rp-stack",children:[s("div",{className:"rp-compare",children:[s("div",{className:"rp-panel",children:[s("div",{className:"rp-card-label",children:["Original",c.left?.frozen_at?` \xB7 frozen ${le(c.left.frozen_at)}`:""]}),s("div",{className:"rp-metrics",children:[n(ue,{label:"outcome",value:c.left===null?"not recorded":xr(c.left.outcome),tone:c.left===null?"idle":ze(c.left.outcome)}),n(ue,{label:"tokens",value:c.left===null?"n/a":ye(c.left.tokens_in+c.left.tokens_out)}),n(ue,{label:"tool errors",value:c.left===null?"n/a":String(c.left.tool_errors),tone:c.left!==null&&c.left.tool_errors>0?"err":"idle"})]})]}),s("div",{className:"rp-panel",children:[n("div",{className:"rp-card-label rp-card-label-accent",children:"Rerun"}),s("div",{className:"rp-metrics",children:[n(ue,{label:"outcome",value:c.right===null?"not recorded":Me(c.right.outcome),tone:c.right===null?"idle":ze(c.right.outcome)}),n(ue,{label:"verify",value:f===null?"not run":Xe(f),tone:f===null?"idle":f===0?"ok":"err"}),n(ue,{label:"tokens",value:c.right===null?"n/a":ye(c.right.tokens_in+c.right.tokens_out)}),n(ue,{label:"tool errors",value:c.right===null?"n/a":String(c.right.tool_errors),tone:c.right!==null&&c.right.tool_errors>0?"err":"idle"})]})]})]}),s("div",{className:"rp-verdict",children:[n(P,{name:"info",size:13}),s("span",{children:[n("strong",{children:"Verdict"})," ",c.verdict]})]})]}):n("div",{className:"rp-meta",children:h.state==="cleaned"||h.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),S!==null&&S.verify_out?n("pre",{className:"rp-pre",children:S.verify_out}):null,u.prompt!==null?s("details",{className:"rp-panel rp-disclosure",children:[n("summary",{children:"Prompt"}),n("pre",{className:"rp-pre",children:u.prompt})]}):null]})}function Br({ctx:e}){let r=ut(lt.state.activeSessionId),[o,a]=g([]),[i,u]=g(null),[N,c]=g([]),[V,L]=g(!1),[y,U]=g(!1),[E,k]=g(null),[T,A]=g({}),[Y,O]=g([]),[re,h]=g([]),[S,f]=g(null),[Ne,K]=g(null),[v,w]=g(null),[q,te]=g(null),[C,pe]=g(0),[ce,J]=g(null),[M,Se]=g(0),[de,ie]=g(!1),[je,G]=g(!1),[$e,ne]=g(null),[me,Ce]=g(""),[oe,fe]=g(""),[ae,ge]=g(null),[Pe,ve]=g(!1),[$,l]=g(dt),[d,z]=g(!1),_=Ze(null),j=Ze($);H(()=>{j.current=$},[$]),H(()=>{let t=null,m=e.onEvent("*",()=>{t===null&&(t=e.setTimeout(()=>{t=null,Se(W=>W+1)},1500))});return()=>{m(),t!==null&&t()}},[e]),H(()=>{if(v===null||q!==null)return;let t=m=>{m.key==="Escape"&&!$r()&&w(null)};return window.addEventListener("keydown",t),()=>{window.removeEventListener("keydown",t)}},[v,q]),H(()=>{let t=!1,m=async()=>{try{let D=await nr(e);if(t)return;a(D),ie(!0),J(null),u(Te=>Te!==null&&D.some(Ve=>Ve.session_id===Te)?Te:r??D[0]?.session_id??null)}catch(D){t||J(R(D))}};m();let W=e.setInterval(()=>{m()},1e4);return()=>{t=!0,W()}},[e,r,C,M]),H(()=>{if(i===null){c([]),G(!1),L(!1),ne(null),O([]),h([]);return}let t=!1,m=async()=>{try{let[D,Te,Ve]=await Promise.all([Ke(e,i),sr(e,i),lr(e,i)]);if(t)return;c(Or=>Ge(i,D.items,Or)),L(D.has_more),G(!0),O(Te),h(Ve),ne(null),J(null)}catch(D){t||(G(!0),ne(R(D)))}};m();let W=e.setInterval(()=>{m()},1e4);return()=>{t=!0,W()}},[e,i,C,M]),H(()=>{if(S===null){K(null);return}let t=!1;return ar(e,S).then(m=>{t||K(m)}).catch(m=>{t||J(R(m))}),()=>{t=!0}},[e,S]),H(()=>{let t=oe.trim();if(t.length<2||i===null){ge(null),ve(!1);return}let m=!1;ve(!0);let W=e.setTimeout(()=>{ir(e,i,t).then(D=>{m||(ge(D.items),ve(!1))}).catch(D=>{m||(ve(!1),J(R(D)))})},200);return()=>{m=!0,W()}},[e,oe,i]);let x=o.find(t=>t.session_id===i)??null,Re=me.trim().toLowerCase(),xe=Re===""?o:o.filter(t=>`${t.title??""} ${t.model??""} ${t.session_id}`.toLowerCase().includes(Re)),I=x!==null&&x.ended_at===null,Q=I&&x.session_id===r,Z=i===null?[]:N.filter(t=>t.session_id===i),se=oe.trim().length>=2,Fe=t=>{u(t.session_id),f(null),w(null),k(null),A({}),c([]),G(!1),L(!1),ne(null),O([]),h([]),fe(""),ge(null)},be=()=>{pe(t=>t+1)},he=t=>{if(E===t.id){k(null);return}k(t.id),T[t.id]===void 0&&or(e,t.session_id,t.seq,t.seq_to).then(m=>{A(W=>({...W,[t.id]:m}))}).catch(m=>{J(R(m))})},We=async()=>{let t=Z[Z.length-1];if(!(i===null||t===void 0)){U(!0);try{let m=await Ke(e,i,t.seq);c(W=>Ge(i,m.items,W)),L(m.has_more)}catch(m){J(R(m))}finally{U(!1)}}};return s("div",{className:"rw-page rp-shell",children:[n("style",{children:mt}),s("header",{className:"rp-head",children:[s("div",{className:"rp-head-left",children:[n("span",{className:"rp-mark",children:n(P,{name:"rewind",size:16})}),s("div",{children:[n("div",{className:"rp-title",children:"Session Rewind"}),n("div",{className:"rp-sub",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]})]}),s("div",{className:"rp-head-right",children:[x!==null?n("span",{className:"rp-pill rp-mono",title:x.model??void 0,children:x.model??"unknown model"}):null,I?s("span",{className:"rp-live",children:[n("span",{className:"rp-dot"}),Q?"live":"running"]}):null,s("button",{type:"button",className:"rp-button",onClick:be,children:[n(P,{name:"refresh",size:13}),"Refresh"]})]})]}),ce!==null?n("div",{className:"rp-error",children:ce}):null,s("div",{className:"rp-columns",children:[s("aside",{className:"rp-side",children:[s("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Sessions",de?n("span",{className:"rp-eyebrow-count",children:br(xe.length,Ue)}):null]}),de&&o.length>0?n("input",{type:"text",className:"rp-search",placeholder:"Filter sessions...","aria-label":"Filter sessions",value:me,onChange:t=>{Ce(t.target.value)},onKeyDown:t=>{t.key==="Escape"&&me!==""&&(Ce(""),t.preventDefault(),t.stopPropagation())}}):null,de?o.length===0?s("div",{className:"rp-meta rp-empty",children:[n(P,{name:"info",size:13}),"Start a chat and Rewind will record every turn."]}):xe.length===0?n("div",{className:"rp-meta",children:"No session matches the filter."}):n("div",{className:"rp-cards",children:xe.map(t=>s("button",{type:"button",className:"rp-session","aria-current":i===t.session_id?"true":void 0,onClick:()=>{Fe(t)},children:[s("span",{className:"rp-session-title",children:[n("span",{className:"rp-dot",style:{color:bt(ze(t.outcome))}}),n("span",{title:t.title??ee(t.session_id),children:t.title??ee(t.session_id)}),n("span",{className:"rp-session-when",children:t.last_event_at!==null?vr(t.last_event_at):""})]}),s("span",{className:"rp-meta",children:[t.model??"unknown model"," \xB7 ",X(t.event_count,"event")]}),s("span",{className:"rp-meta rp-meta-dim",children:[Me(t.outcome)," \xB7"," ",ye(t.tokens_in+t.tokens_out)," tokens"]})]},t.session_id))}):n("div",{className:"rp-meta",children:"Loading sessions..."})]}),s("main",{className:"rp-main",children:[x!==null?s("div",{className:"rp-detail-head",children:[s("div",{className:"rp-stack",style:{gap:5},children:[n("div",{className:"rp-detail-title",children:x.title??ee(x.session_id)}),s("div",{className:"rp-stats",children:[Y.length>0?n(De,{label:"snapshot",value:String(Y.length)}):null,n(De,{label:"events",value:ye(x.event_count)}),n(De,{label:"tokens",value:ye(x.tokens_in+x.tokens_out)}),x.ended_at!==null?n(De,{label:"window",value:`${le(x.started_at)} \u2192 ${le(x.ended_at)}`}):null,n(De,{label:"outcome",value:Me(x.outcome),mono:!1,tone:ze(x.outcome)})]}),s("div",{className:"rp-meta",children:[x.model??"unknown model",x.ended_at===null?` \xB7 ${hr(x.last_event_at)}`:""]})]}),n("div",{className:"rp-hint",children:"Select a user turn and choose Rewind."})]}):null,re.length>0?s("div",{children:[s("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Branches",n("span",{className:"rp-eyebrow-count",children:re.length})]}),n("div",{className:"rp-chips",children:re.map(t=>s("button",{type:"button",className:"rp-chip","aria-current":v===t.id?"true":void 0,onClick:()=>{w(t.id)},children:[n("span",{className:"rp-mono",children:ee(t.id)}),s("span",{className:"rp-badge","data-tone":Ar(t.state),children:[n("span",{className:"rp-dot"}),t.state]}),n("span",{className:"rp-chip-note",children:t.fork_row_count>0?X(t.fork_row_count,"message"):"context pack"})]},t.id))})]}):null,s("div",{className:"rp-columns",style:{gap:0,"--rp-payload-width":`${$}px`},children:[n("div",{className:"rp-turns",children:s("div",{className:"rp-stack",style:{width:"100%"},children:[s("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),se?"Search results":"Turns",se&&ae!==null?n("span",{className:"rp-eyebrow-count",children:ae.length}):null]}),x===null?n("div",{className:"rp-meta",children:"Select a recorded session."}):s(Le,{children:[n("input",{type:"text",className:"rp-search",placeholder:"Search events in this session...","aria-label":"Search events",value:oe,onChange:t=>{fe(t.target.value)},onKeyDown:t=>{t.key==="Escape"&&oe!==""&&(fe(""),t.preventDefault(),t.stopPropagation())}}),se?Pe?n("div",{className:"rp-meta",children:"Searching..."}):ae===null||ae.length===0?s("div",{className:"rp-meta",children:["No event matches \u201C",oe.trim(),"\u201D."]}):n("div",{className:"rp-events rp-search-results",children:ae.map(t=>n(er,{event:t,selected:S===t.id,onSelect:()=>{f(t.id)}},t.id))}):je?Z.length===0?n("div",{className:"rp-meta",children:wr(x.event_count,$e)}):s(Le,{children:[Z.map(t=>n(vt,{turn:t,expanded:E===t.id,events:T[t.id]??null,loading:E===t.id&&T[t.id]===void 0,selectedEventId:S,onToggle:()=>{he(t)},onFork:()=>{x!==null&&te({session:x,event:t})},onSelectEvent:m=>{f(m.id)}},t.id)),V?n("button",{type:"button",className:"rp-load-more",onClick:()=>{We()},disabled:y,children:y?"Loading...":"Load earlier turns"}):s("div",{className:"rp-tail",children:[X(Z.length,"turn")," \xB7 start of the recording"]})]}):n("div",{className:"rp-meta",children:"Loading turns..."})]})]})}),n("div",{role:"separator","aria-orientation":"vertical","aria-label":"Resize event payload panel",tabIndex:0,className:"rp-divider","data-dragging":d?"true":void 0,onPointerDown:t=>{_.current={startX:t.clientX,startWidth:$},z(!0),t.currentTarget.setPointerCapture(t.pointerId)},onPointerMove:t=>{let m=_.current;m!==null&&l(Oe(m.startWidth-(t.clientX-m.startX)))},onPointerUp:t=>{_.current!==null&&(_.current=null,z(!1),He(j.current),t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId))},onPointerCancel:t=>{_.current!==null&&(_.current=null,z(!1),t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId))},onKeyDown:t=>{if(t.key==="ArrowLeft"){let m=Oe(j.current+16);l(m),He(m),t.preventDefault()}else if(t.key==="ArrowRight"){let m=Oe(j.current-16);l(m),He(m),t.preventDefault()}},onDoubleClick:()=>{l(_e),He(_e)}}),s("div",{className:"rp-payload",children:[s("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Event payload"]}),n(yt,{detail:Ne,onCopy:t=>{e.os.writeClipboard(t)}})]})]})]})]}),v!==null?n("div",{className:"rp-compare-wrap",children:n(kt,{ctx:e,branchId:v,refreshTick:C,onClose:()=>{w(null)},onRefresh:be})}):null,q!==null?n(Mr,{ctx:e,session:q.session,event:q.event,onClose:()=>{te(null)},onCreated:t=>{w(t),be()}}):null]})}import{jsx as Hr}from"react/jsx-runtime";var Tt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let r=()=>{_t.navigate(we)};e.registerMany([{id:"page",area:Ct,data:{path:we},render:()=>Hr(Br,{ctx:e})},{id:"nav",area:Pt,data:{path:we,label:"Rewind",codicon:"history"}},{id:"palette-open",area:St,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:r}},{id:"keybind-open",area:Nt,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:r}},{id:"chip",area:Rt.right,order:130,render:()=>Hr(tr,{})}])}},gn=Tt;export{gn as default};
