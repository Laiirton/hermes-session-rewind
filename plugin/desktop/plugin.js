import{host as Jr,KEYBINDS_AREA as Qr,PALETTE_AREA as Xr,ROUTES_AREA as et,SIDEBAR_NAV_AREA as rt,STATUSBAR_AREAS as tt}from"@hermes/plugin-sdk";import{host as Be,useValue as kr}from"@hermes/plugin-sdk";var ie="/rewind";import{jsx as _r,jsxs as Nr}from"react/jsx-runtime";function He(){let e=kr(Be.state.activeSessionId);return Nr("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{Be.navigate(ie)},title:"Open Session Rewind",children:[_r("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as qr,useValue as Br}from"@hermes/plugin-sdk";import{useEffect as W,useRef as Hr,useState as x}from"react";function me(e,r,a){return e.rest(r,{method:"POST",body:a})}var Pe=100;async function Oe(e){return(await e.rest(`/sessions?limit=${Pe}`)).items}async function Te(e,r,a=null){let d=a===null?"":`&before_seq=${a}`;return e.rest(`/sessions/${encodeURIComponent(r)}/turns?limit=40${d}`)}async function Ve(e,r,a,d){return(await e.rest(`/sessions/${encodeURIComponent(r)}/events?limit=200&after_seq=${a-1}&before_seq=${d+1}`)).items}function Ue(e,r){return e.rest(`/events/${r}`)}function Ke(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/snapshots`)}function We(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/branches`)}function je(e,r){return me(e,`/branches/${encodeURIComponent(r)}/reconcile`,{})}function Ge(e,r,a,d=null){let s=d===null?"":`&before_ts=${d}`;return e.rest(`/compare?left=${encodeURIComponent(r)}&right=${encodeURIComponent(a)}${s}`)}function Ye(e,r){return me(e,"/forks/prepare",r)}function Ze(e,r,a){return me(e,`/forks/${encodeURIComponent(r)}/commit`,a)}function Je(e,r){return me(e,`/forks/${encodeURIComponent(r)}/verify`,{})}function Qe(e,r,a){return e.rest(`/branches/${encodeURIComponent(r)}/verify-resolve?cmd=${encodeURIComponent(a)}`)}function Xe(e,r){return e.rest(`/forks/${encodeURIComponent(r)}/workspace`)}function Ee(e,r){return me(e,`/forks/${encodeURIComponent(r)}/cleanup`,{})}function fe(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ge(e){return e.toLocaleString()}function we(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Sr=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function P(e){let r=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",a=Sr.exec(r),d=a?.[1];if(a===null||d===void 0)return r;let s=Cr(d);return s===void 0?r:r.replace(a[0],s)}function Cr(e){try{let r=JSON.parse(e);return typeof r.detail=="string"&&r.detail.length>0?r.detail:void 0}catch{return}}function J(e,r=8){return e.length<=r?e:e.slice(0,r)}function D(e,r){return`${e} ${e===1?r:`${r}s`}`}function Me(e){return e===0?"passed":`failed (exit ${e})`}var Rr={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function ye(e){return e===null?"recording":Rr[e]??e}function ze(e){return e===null?"warn":e==="completed"?"ok":e==="failed"?"err":"idle"}function er(e){return e===null?"open at freeze":ye(e)}function rr(e,r){return e===0?"":e>=r?`${r}+`:`${e}`}function Pr(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function tr(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${Pr(e)}`}function nr(e,r){return r!==null?`The turns could not be loaded: ${r}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${D(e,"event")} but no user turn.`}function or(e){return e===null?"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.":`This workspace holds ${D(e,"uncommitted file")}. Deleting it removes them for good; the rerun conversation stays in the recording.`}import{host as A}from"@hermes/plugin-sdk";import{useCallback as Mr,useEffect as ve,useRef as Ie,useState as I}from"react";function Tr(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let r=e.content;return typeof r=="string"?r.trim():Array.isArray(r)?r.map(a=>{if(typeof a!="object"||a===null||!("text"in a))return"";let d=a.text;return typeof d=="string"?d:""}).join("").trim():""}function ar(e,r){let a=(e??[]).filter(l=>(l.role==="user"||l.role==="assistant")&&Tr(l).length>0&&typeof l.row_id=="number"),d=-1;for(let l=0;l<a.length;l+=1){let k=a[l];if(k===void 0)continue;let p=k.timestamp;k.role==="user"&&typeof p=="number"&&p<=r+.5&&(d=l)}if(d<=0)return null;let s=a[d-1]?.row_id;return typeof s=="number"&&s>0?s:null}var ir={providers:[],currentModel:null,currentProvider:null};function ke(e){return typeof e=="string"?e.trim():""}function sr(e){let r=ke(e);return r===""?null:r}function lr(e){if(e===null||typeof e!="object")return ir;let r=e.providers;if(!Array.isArray(r))return ir;let a=[];for(let d of r){if(d===null||typeof d!="object")continue;let s=d,l=ke(s.slug),k=Array.isArray(s.models)?s.models.map(ke).filter(p=>p!==""):[];l===""||k.length===0||a.push({slug:l,name:ke(s.name)||l,isCurrent:s.is_current===!0,models:k})}return{providers:a,currentModel:sr(e.model),currentProvider:sr(e.provider)}}function ur(e,r){return[...e.providers].sort((a,d)=>{let s=r!==null&&a.slug===r?0:1,l=r!==null&&d.slug===r?0:1;return s!==l?s-l:a.isCurrent!==d.isCurrent?a.isCurrent?-1:1:a.name.localeCompare(d.name)})}function dr(e,r){let a=r.trim().toLowerCase();if(a==="")return e;let d=[];for(let s of e){if(s.name.toLowerCase().includes(a)||s.slug.toLowerCase().includes(a)){d.push(s);continue}let l=s.models.filter(k=>k.toLowerCase().includes(a));l.length>0&&d.push({...s,models:l})}return d}function cr(e,r){let a=r===null?"":` --provider ${r}`;return`${e}${a} --session`}function pr(e,r,a,d){return e===""?!1:e!==(a??"")||r!==d}import{jsx as mr}from"react/jsx-runtime";var Er={rewind:"M3 12a9 9 0 1 0 3-6.7M3 4v5h5",refresh:"M20 11a8 8 0 0 0-14 5l-2 2M4 13a8 8 0 0 0 14-5l2-2",branch:"M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0-3-3M15 9v3a3 3 0 0 0 3 3h3",lock:"M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",folder:"M3 7h6l2 2h10v11H3z",close:"M5 5l14 14M19 5L5 19",chevron:"M9 6l6 6-6 6",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01"};function z({name:e,size:r=14,className:a}){return mr("svg",{"aria-hidden":"true",className:a,viewBox:"0 0 24 24",width:r,height:r,fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round",focusable:"false",children:mr("path",{d:Er[e]})})}import{Fragment as Ar,jsx as c,jsxs as g}from"react/jsx-runtime";var zr=["python -m pytest -q","npm test","cargo test","go test ./..."],Ir=350,Lr=400;function se(e,r){return r.catch(a=>{throw new Error(`${e}: ${P(a)}`)})}function $r(e){if(e===null)return[];let r=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(r).filter(a=>!a.hasAttribute("disabled"))}function Fr(e,r){let a=$r(e),d=a[0],s=a[a.length-1];if(e===null||d===void 0||s===void 0)return;let l=document.activeElement;if(!e.contains(l)){r.preventDefault(),d.focus();return}r.shiftKey&&l===d?(r.preventDefault(),s.focus()):!r.shiftKey&&l===s&&(r.preventDefault(),d.focus())}var Dr=`
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
`;function fr({ctx:e,session:r,event:a,onClose:d,onCreated:s}){let[l,k]=I(""),[p,q]=I(null),[M,_]=I({providers:[],currentModel:null,currentProvider:null}),[Q,T]=I(!1),[w,R]=I(!1),[L,V]=I(""),[B,j]=I(""),[v,C]=I(""),[m,le]=I(null),[H,f]=I(null),[b,$]=I(null),[G,N]=I(null),[te,ne]=I(!1),U=Ie([]),E=b!==null,ue=Ie(null),de=Ie(()=>{}),X=Mr(()=>{E||(ne(!0),U.current.push(e.setTimeout(d,100)))},[E,e,d]);ve(()=>{let t=U.current;return()=>{for(let u of t)u()}},[]),ve(()=>{let t=document.activeElement;return ue.current?.focus(),()=>{t?.focus()}},[]),ve(()=>{let t=u=>{if(u.key==="Escape"&&!E){if(w){R(!1);return}X();return}if(u.key==="Tab"){Fr(ue.current,u);return}if(u.key==="Enter"&&(u.metaKey||u.ctrlKey)&&!E){if(w)return;u.preventDefault(),de.current()}};return window.addEventListener("keydown",t),()=>{window.removeEventListener("keydown",t)}},[E,X,w]),ve(()=>{let t=v.trim();if(m===null||t===""){f(null);return}let u=!1,h=e.setTimeout(()=>{Qe(e,m.branch_id,t).then(S=>{u||f(S)}).catch(()=>{u||f(null)})},Ir);return()=>{u=!0,h()}},[e,m,v]),ve(()=>{let t=!1;return A.request("model.options",{explicit_only:!0,include_unconfigured:!1}).then(u=>{if(t)return;let h=lr(u);_(h),T(h.providers.length===0)}).catch(()=>{t||T(!0)}),()=>{t=!0}},[]);let _e=ur(M,r.provider),K=dr(_e,L),xe=l.trim()===""?r.model??"":l.trim(),Y=p??r.provider,y=Y===null?"":M.providers.find(t=>t.slug===Y)?.name??Y,ce=(t,u)=>{k(u),q(t),R(!1),V("")},Ne=()=>{k(""),q(null),R(!1),V("")},Z=async()=>{let t=await A.request("session.active_list",{}),u=Array.isArray(t.sessions)?t.sessions:[],h=u.find(S=>S.session_key===r.session_id)?.id??u.find(S=>S.id===r.session_id)?.id;if(h===void 0)return{runtimeId:void 0,storedId:r.stored_session_id};try{let S=await A.request("session.title",{session_id:h});return{runtimeId:h,storedId:S.session_key??r.stored_session_id}}catch{return{runtimeId:h,storedId:r.stored_session_id}}},be=async()=>{$("prepare"),N(null);try{let t=await Z(),u=await Ye(e,{session_id:r.session_id,stored_session_id:t.storedId,event_id:a.id,model:l.trim()||null,provider:p,prompt:B.trim()||null,verify_cmd:v.trim()||null});le(u),j(u.prompt),u.verify_presets.length>0&&v.trim()===""&&C(u.verify_presets[0]??"")}catch(t){N(P(t))}finally{$(null)}},oe=async()=>{if(m!==null){$("run"),N(null);try{let t=await Z(),u=t.runtimeId,h=`\u21BA ${r.title??J(r.session_id)} \xB7 ${J(m.branch_id)}`,S=null;if(u!==void 0)try{let F=await A.request("session.history",{session_id:u});S=ar(F.messages,m.fork_before_ts)}catch{S=null}let O,ae,Fe=!1;if(S!==null&&u!==void 0){let F=await se("could not branch the session",A.request("session.branch",{session_id:u,through_message_id:S}));O=F.session_id,ae=F.stored_session_id}else{let F={source:"desktop",title:h};m.worktree_path!==null&&(F.cwd=m.worktree_path),t.storedId!==null&&(F.parent_session_id=t.storedId);let ee=await se("could not create the branch session",A.request("session.create",F));O=ee.session_id,ae=ee.stored_session_id,Fe=!0}if(Fe&&m.worktree_path!==null){let F=()=>A.request("session.cwd.set",{session_id:O,cwd:m.worktree_path});try{await se("could not attach the isolated workspace",F())}catch(ee){throw ee instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${P(ee)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(await se("could not open the rerun session",A.openSession(ae,{intent:"tab"})),pr(l.trim(),p,r.model,r.provider)){let F=cr(l.trim(),p),ee=()=>A.request("config.set",{key:"model",value:F,session_id:O,confirm_expensive_model:!1}),Ce=!1,Re=null,Ae="";for(let qe=0;qe<2&&!Ce;qe+=1)try{let he=await ee();Ce=!0,Re=he.confirm_required===!0?he.confirm_message??null:null}catch(he){Ae=P(he),await new Promise(yr=>{setTimeout(yr,Lr)})}Ce?Re!==null&&A.notify({kind:"info",message:Re,detail:`The rerun started before the switch could be confirmed; ${l.trim()} applies from the next turn.`}):A.notify({kind:"warning",message:`The rerun runs on ${r.model??"the session model"}, not ${l.trim()}.`,detail:Ae})}let De=B.trim()||m.prompt;await se("could not record the branch",Ze(e,m.branch_id,{child_session_id:O,child_stored_session_id:ae,model:l.trim()||r.model,provider:p??r.provider,prompt:De,verify_cmd:v.trim()||null})),await se("could not start the rerun",A.request("prompt.submit",{session_id:O,text:De})),s(m.branch_id),d()}catch(t){N(P(t))}finally{$(null)}}};de.current=()=>{m===null?be():oe()};let pe=m!==null,Se=v.trim(),o=[];return pe?(m.fidelity!=="full"&&o.push({warn:!0,text:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}),m.context_rows===null&&o.push({warn:!0,text:"The live transcript prefix is unavailable. The context pack is the only context."}),r.ended_at!==null&&o.push({warn:!1,text:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}),m.fork_row_count===0&&r.ended_at===null&&o.push({warn:!1,text:"This is the first turn. The rerun starts a fresh chat in the restored workspace."})):o.push({warn:!1,text:"Prepare reads the recorded context for this turn and drafts the rerun prompt. Nothing runs until you fork."}),g("div",{className:"rw-overlay","data-closing":te?"true":"false",onMouseDown:t=>{t.target===t.currentTarget&&X()},children:[c("style",{children:Dr}),g("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title","aria-describedby":"rw-reassure",tabIndex:-1,ref:ue,children:[g("header",{className:"rw-head",children:[c("span",{className:"rw-mark",children:c(z,{name:"rewind",size:16})}),g("div",{className:"rw-heading",children:[c("div",{className:"rw-eyebrow",children:"Session Rewind"}),c("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"})]}),c("button",{type:"button",className:"rw-close",onClick:X,disabled:E,"aria-label":"Close",children:c(z,{name:"close",size:15})})]}),g("div",{className:"rw-body",children:[g("div",{className:"rw-turn",children:[c("span",{className:"rw-turn-time",children:fe(a.ts)}),c("span",{className:"rw-turn-text",children:a.preview||"user turn"})]}),G!==null?c("div",{className:"rw-banner rw-banner-error",role:"alert",children:G}):null,pe&&m.worktree_path?g("div",{className:"rw-path",children:[c("span",{className:"rw-path-text",title:m.worktree_path,children:m.worktree_path}),c("button",{type:"button",className:"rw-icon-button",onClick:()=>{e.os.revealPath(m.worktree_path??"")},disabled:E,"aria-label":"Reveal the isolated workspace",children:c(z,{name:"folder",size:13})})]}):null,o.length>0?c("div",{className:"rw-notes",children:o.map(t=>g("div",{className:`rw-note${t.warn?" rw-note-warn":""}`,role:t.warn?"status":void 0,children:[c(z,{name:"info"}),c("span",{children:t.text})]},t.text))}):null,g("div",{className:"rw-grid",children:[g("div",{className:"rw-field",children:[c("span",{className:"rw-label",id:"rw-model-label",children:"Model"}),g("button",{type:"button",className:`rw-trigger${w?" rw-trigger-open":""}`,onClick:()=>{R(!w)},disabled:E,"aria-haspopup":"listbox","aria-expanded":w,"aria-labelledby":"rw-model-label rw-model-value",children:[c("span",{className:"rw-trigger-text",id:"rw-model-value",children:xe===""?"Session model":xe}),y===""?null:c("span",{className:"rw-trigger-provider",children:y}),c("span",{className:"rw-trigger-caret","aria-hidden":"true","data-open":w,children:c(z,{name:"chevron",size:12})})]}),w?g("div",{className:"rw-picker",children:[c("input",{className:"rw-search",value:L,onChange:t=>{V(t.target.value)},onKeyDown:t=>{let u=K[0];t.key==="Enter"&&u!==void 0&&(t.preventDefault(),ce(u.slug,u.models[0]??""))},placeholder:"Search models","aria-label":"Search models",autoFocus:!0}),g("div",{className:"rw-picker-list",role:"listbox","aria-label":"Models",children:[g("button",{type:"button",className:"rw-option rw-option-keep",role:"option","aria-selected":l.trim()==="",onClick:Ne,children:["Keep the session model",r.model===null?null:c("span",{className:"rw-option-sub",children:r.model})]}),K.map(t=>g("div",{className:"rw-group",role:"group","aria-label":t.name,children:[g("div",{className:"rw-group-head",children:[c("span",{children:t.name}),c("span",{className:"rw-count",children:t.models.length})]}),t.models.map(u=>g("button",{type:"button",className:"rw-option",role:"option","aria-selected":u===l.trim()&&t.slug===p,onClick:()=>{ce(t.slug,u)},children:[c("span",{className:"rw-option-text",children:u}),u===r.model?c("span",{className:"rw-option-tag",children:"session"}):null]},u))]},t.slug)),K.length===0&&L.trim()!==""?c("button",{type:"button",className:"rw-option",role:"option",onClick:()=>{k(L.trim()),q(null),R(!1),V("")},children:g("span",{className:"rw-option-text",children:["Use \u201C",L.trim(),"\u201D as typed"]})}):null,K.length===0&&L.trim()===""?c("div",{className:"rw-picker-empty",children:"No configured provider offers a model."}):null]})]}):null,c("span",{className:"rw-help",children:Q?"Could not read the model list, so the rerun keeps the session model.":"Lists the providers configured in Hermes."})]}),g("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Verify command"}),c("input",{className:"rw-input",value:v,onChange:t=>{C(t.target.value)},placeholder:"python -m pytest -q"}),c("div",{className:"rw-chips",children:(m?.verify_presets.length?m.verify_presets:zr).map(t=>c("button",{type:"button",className:"rw-preset","aria-pressed":t===Se,onClick:()=>{C(t)},disabled:E,children:t},t))}),c("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),H!==null&&H.command===v.trim()?c("span",{className:"rw-resolved",children:H.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":g(Ar,{children:[c("span",{children:"Resolves to"}),c("span",{className:"rw-resolved-path",title:H.resolved,children:H.resolved})]})}):null]})]}),g("label",{className:"rw-field",children:[g("span",{className:"rw-label-row",children:[c("span",{className:"rw-label",children:"Prompt for the rerun"}),g("span",{className:"rw-count","aria-live":"polite",children:[B.length," chars"]})]}),c("textarea",{className:"rw-textarea",value:B,onChange:t=>{j(t.target.value)},placeholder:"Prepare the branch to draft the rerun prompt, or write your own."})]})]}),g("footer",{className:"rw-footer",children:[g("span",{className:"rw-reassure",id:"rw-reassure",children:[c(z,{name:"lock",size:13}),c("span",{children:"Original session and workspace stay untouched."})]}),g("div",{className:"rw-actions",children:[c("button",{type:"button",className:"rw-button",onClick:X,disabled:E,children:"Cancel"}),pe?g("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{oe()},disabled:E,"aria-busy":b==="run",children:[b==="run"?c("span",{className:"rw-spinner"}):null,b==="run"?"Forking":"Fork & run",b==="run"?null:c("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]}):g("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{be()},disabled:E,"aria-busy":b==="prepare",children:[b==="prepare"?c("span",{className:"rw-spinner"}):null,b==="prepare"?"Preparing":"Prepare branch",b==="prepare"?null:c("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]})]})]})]})]})}function Le(e,r,a){let d=new Set(r.map(l=>l.id)),s=a.filter(l=>l.session_id===e&&!d.has(l.id));return[...r,...s]}import{Fragment as $e,jsx as n,jsxs as i}from"react/jsx-runtime";var Or="[data-rw-confirm]";function gr(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(Or)!==null}var Vr=`
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
`,Ur=new Set(["done","failed","cleaned","discarded"]);function Kr(e){return we(Math.max(0,(e.work_ts-e.ts)*1e3))}function Wr({event:e,selected:r,onSelect:a}){return i("button",{type:"button",className:"rp-event","aria-current":r?"true":void 0,onClick:a,children:[n("span",{title:e.kind,className:`rp-event-kind ${xr(e.kind,e.status)}`,children:vr(e.kind)}),n("span",{className:"rp-event-text",children:e.name??e.preview}),n("span",{className:"rp-event-time rp-mono",children:we(e.duration_ms)})]})}var jr=new Set(["api_request","llm_call"]);function Gr({turn:e,expanded:r,events:a,loading:d,selectedEventId:s,onToggle:l,onFork:k,onSelectEvent:p}){let q=(a??[]).filter(_=>!jr.has(_.kind)),M=(a??[]).length-q.length;return i("div",{className:"rp-turn",children:[i("div",{className:"rp-turn-bar",children:[i("button",{type:"button",className:"rp-turn-row",onClick:l,"aria-expanded":r,children:[n("span",{className:"rp-caret","data-open":r?"true":"false",children:n(z,{name:"chevron",size:12})}),n("span",{className:"rp-turn-time rp-mono",children:fe(e.ts)}),n("span",{className:"rp-turn-preview",children:e.preview||"User turn"}),n("span",{className:"rp-turn-stat",children:D(e.tool_calls,"tool")}),e.tool_errors>0?i("span",{className:"rp-badge","data-tone":"err",children:[n("span",{className:"rp-dot"}),D(e.tool_errors,"error")]}):null,n("span",{className:"rp-turn-duration rp-mono",children:Kr(e)})]}),i("button",{type:"button",className:"rp-button rp-button-sm",onClick:k,children:[n(z,{name:"rewind",size:12}),"Rewind"]})]}),r?n("div",{className:"rp-events",children:d?n("div",{className:"rp-aside-note",children:"Loading events..."}):i($e,{children:[q.map(_=>n(Wr,{event:_,selected:s===_.id,onSelect:()=>{p(_)}},_.id)),M>0?i("div",{className:"rp-aside-note",children:[D(e.api_requests,"model request")," \xB7 ",D(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function vr(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function xr(e,r){return e==="tool_result"&&r==="error"?"text-(--ui-red)":e==="assistant_response"||e==="tool_result"?"text-(--ui-green)":e==="user_turn"?"text-(--ui-accent)":e==="tool_call"?"text-(--ui-purple)":e==="api_request"||e==="llm_call"?"text-(--ui-orange)":e==="compaction"?"text-(--ui-text-secondary)":"text-(--ui-text-tertiary)"}function br(e){return e==="done"?"ok":e==="failed"?"err":e==="running"?"run":"idle"}function re({label:e,value:r,tone:a="idle"}){return i($e,{children:[n("span",{className:"rp-metric-label",children:e}),n("span",{className:`rp-metric-value rp-tone-${a}`,children:r})]})}function Yr({detail:e}){return e===null?n("div",{className:"rp-meta",children:"Select an event to inspect its payload."}):i("div",{className:"flex flex-col gap-2",children:[i("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${xr(e.kind,e.status)}`,children:vr(e.kind)}),i("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),i("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${we(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-stroke-tertiary) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function Zr({ctx:e,branchId:r,refreshTick:a,onClose:d,onRefresh:s}){let[l,k]=x(null),[p,q]=x(null),[M,_]=x(!1),[Q,T]=x(null),[w,R]=x(null),L=Hr(null);W(()=>{let f=!1,b=null,$=async()=>{try{let N=await je(e,r);if(f)return!0;k(N),T(null);let te=N.branch.child_session_id;if(te!==null){let ne=await Ge(e,N.branch.parent_session_id,te,N.branch.fork_before_ts);f||q(ne)}else q(null);return Ur.has(N.branch.state)}catch(N){return f||T(P(N)),!1}},G=async()=>{let N=await $();!f&&!N&&(b=e.setTimeout(()=>{G()},2500))};return G(),()=>{f=!0,b!==null&&b()}},[e,r,a]);let V=async()=>{_(!0),T(null);try{await Je(e,r),s()}catch(f){T(P(f))}finally{_(!1)}},B=async f=>{_(!0),T(null),R(null);try{await Ee(e,r),s()}catch(b){T(P(b)),R(f)}finally{_(!1)}},j=async()=>{_(!0),T(null);try{let f=await Xe(e,r);f.uncommitted===0?(await Ee(e,r),s()):R(f)}catch(f){T(P(f))}finally{_(!1)}};if(W(()=>{R(null)},[r]),W(()=>{if(w===null)return;let f=b=>{b.key==="Escape"&&gr()&&R(null)};return window.addEventListener("keydown",f),()=>{window.removeEventListener("keydown",f)}},[w]),W(()=>{if(w===null)return;let f=document.activeElement;return L.current?.focus(),()=>{f instanceof HTMLElement&&f.focus()}},[w]),l===null)return n("div",{className:"rp-meta",children:"Loading branch..."});let v=l.branch,C=l.run,m=C?.verify_exit??p?.right?.verify_exit??null,le=v.verify_cmd?v.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",H=v.worktree_path?void 0:"This branch has no workspace left to remove.";return i("div",{className:"rp-stack",children:[i("div",{className:"rp-branch-head",children:[i("div",{className:"rp-branch-title",children:[i("span",{children:["Branch ",J(v.id)]}),i("span",{className:"rp-badge","data-tone":br(v.state),children:[n("span",{className:"rp-dot"}),v.state]}),C!==null&&C.verify_exit!==null?i("span",{className:"rp-badge","data-tone":C.verify_exit===0?"ok":"err",children:["verify ",Me(C.verify_exit)]}):null]}),i("div",{className:"rp-branch-actions",children:[n("button",{type:"button",className:"rp-button rp-button-sm",title:le,onClick:()=>{V()},disabled:M||!v.verify_cmd||!v.worktree_path,children:"Verify"}),n("button",{type:"button",className:"rp-button rp-button-sm",title:H,onClick:()=>{j()},disabled:M||!v.worktree_path,children:"Cleanup"}),n("button",{type:"button",className:"rp-button rp-button-sm rp-quiet",onClick:d,children:"Hide"})]})]}),l.shared_child?n("div",{className:"rp-note rp-note-warn",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,Q!==null?n("div",{className:"rp-error",children:Q}):null,w!==null?i("div",{className:"rp-confirm",ref:L,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[n("div",{className:"rp-confirm-copy",children:or(w.uncommitted)}),n("div",{className:"rp-confirm-path",children:w.worktree_path}),i("div",{className:"rp-confirm-actions",children:[n("button",{type:"button",className:"rp-button rp-button-sm rp-delete",onClick:()=>{B(w)},disabled:M,children:"Delete workspace"}),n("button",{type:"button",className:"rp-button rp-button-sm",onClick:()=>{R(null)},children:"Cancel"})]})]}):null,p!==null?i("div",{className:"rp-stack",children:[i("div",{className:"rp-compare",children:[i("div",{className:"rp-panel",children:[i("div",{className:"rp-card-label",children:["Original",p.left?.frozen_at?` \xB7 frozen ${fe(p.left.frozen_at)}`:""]}),i("div",{className:"rp-metrics",children:[n(re,{label:"outcome",value:p.left===null?"not recorded":er(p.left.outcome),tone:p.left===null?"idle":ze(p.left.outcome)}),n(re,{label:"tokens",value:p.left===null?"n/a":ge(p.left.tokens_in+p.left.tokens_out)}),n(re,{label:"tool errors",value:p.left===null?"n/a":String(p.left.tool_errors),tone:p.left!==null&&p.left.tool_errors>0?"err":"idle"})]})]}),i("div",{className:"rp-panel",children:[n("div",{className:"rp-card-label rp-card-label-accent",children:"Rerun"}),i("div",{className:"rp-metrics",children:[n(re,{label:"outcome",value:p.right===null?"not recorded":ye(p.right.outcome),tone:p.right===null?"idle":ze(p.right.outcome)}),n(re,{label:"verify",value:m===null?"not run":Me(m),tone:m===null?"idle":m===0?"ok":"err"}),n(re,{label:"tokens",value:p.right===null?"n/a":ge(p.right.tokens_in+p.right.tokens_out)}),n(re,{label:"tool errors",value:p.right===null?"n/a":String(p.right.tool_errors),tone:p.right!==null&&p.right.tool_errors>0?"err":"idle"})]})]})]}),i("div",{className:"rp-verdict",children:[n(z,{name:"info",size:13}),i("span",{children:[n("strong",{children:"Verdict"})," ",p.verdict]})]})]}):n("div",{className:"rp-meta",children:v.state==="cleaned"||v.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),C!==null&&C.verify_out?n("pre",{className:"rp-pre",children:C.verify_out}):null,l.prompt!==null?i("details",{className:"rp-panel rp-disclosure",children:[n("summary",{children:"Prompt"}),n("pre",{className:"rp-pre",children:l.prompt})]}):null]})}function hr({ctx:e}){let r=Br(qr.state.activeSessionId),[a,d]=x([]),[s,l]=x(null),[k,p]=x([]),[q,M]=x(!1),[_,Q]=x(!1),[T,w]=x(null),[R,L]=x({}),[V,B]=x([]),[j,v]=x([]),[C,m]=x(null),[le,H]=x(null),[f,b]=x(null),[$,G]=x(null),[N,te]=x(0),[ne,U]=x(null),[E,ue]=x(0),[de,X]=x(!1),[_e,K]=x(!1),[xe,Y]=x(null);W(()=>{let o=null,t=e.onEvent("*",()=>{o===null&&(o=e.setTimeout(()=>{o=null,ue(u=>u+1)},1500))});return()=>{t(),o!==null&&o()}},[e]),W(()=>{if(f===null||$!==null)return;let o=t=>{t.key==="Escape"&&!gr()&&b(null)};return window.addEventListener("keydown",o),()=>{window.removeEventListener("keydown",o)}},[f,$]),W(()=>{let o=!1,t=async()=>{try{let h=await Oe(e);if(o)return;d(h),X(!0),U(null),l(S=>S!==null&&h.some(O=>O.session_id===S)?S:r??h[0]?.session_id??null)}catch(h){o||U(P(h))}};t();let u=e.setInterval(()=>{t()},1e4);return()=>{o=!0,u()}},[e,r,N,E]),W(()=>{if(s===null){p([]),K(!1),M(!1),Y(null),B([]),v([]);return}let o=!1,t=async()=>{try{let[h,S,O]=await Promise.all([Te(e,s),Ke(e,s),We(e,s)]);if(o)return;p(ae=>Le(s,h.items,ae)),M(h.has_more),K(!0),B(S),v(O),Y(null),U(null)}catch(h){o||(K(!0),Y(P(h)))}};t();let u=e.setInterval(()=>{t()},1e4);return()=>{o=!0,u()}},[e,s,N,E]),W(()=>{if(C===null){H(null);return}let o=!1;return Ue(e,C).then(t=>{o||H(t)}).catch(t=>{o||U(P(t))}),()=>{o=!0}},[e,C]);let y=a.find(o=>o.session_id===s)??null,ce=y!==null&&y.ended_at===null,Ne=ce&&y.session_id===r,Z=s===null?[]:k.filter(o=>o.session_id===s),be=o=>{l(o.session_id),m(null),b(null),w(null),L({}),p([]),K(!1),M(!1),Y(null),B([]),v([])},oe=()=>{te(o=>o+1)},pe=o=>{if(T===o.id){w(null);return}w(o.id),R[o.id]===void 0&&Ve(e,o.session_id,o.seq,o.seq_to).then(t=>{L(u=>({...u,[o.id]:t}))}).catch(t=>{U(P(t))})},Se=async()=>{let o=Z[Z.length-1];if(!(s===null||o===void 0)){Q(!0);try{let t=await Te(e,s,o.seq);p(u=>Le(s,t.items,u)),M(t.has_more)}catch(t){U(P(t))}finally{Q(!1)}}};return i("div",{className:"rw-page rp-shell",children:[n("style",{children:Vr}),i("header",{className:"rp-head",children:[i("div",{className:"rp-head-left",children:[n("span",{className:"rp-mark",children:n(z,{name:"rewind",size:16})}),i("div",{children:[n("div",{className:"rp-title",children:"Session Rewind"}),n("div",{className:"rp-sub",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]})]}),i("div",{className:"rp-head-right",children:[y!==null?n("span",{className:"rp-pill rp-mono",children:y.model??"unknown model"}):null,ce?i("span",{className:"rp-live",children:[n("span",{className:"rp-dot"}),Ne?"live":"running"]}):null,i("button",{type:"button",className:"rp-button",onClick:oe,children:[n(z,{name:"refresh",size:13}),"Refresh"]})]})]}),ne!==null?n("div",{className:"rp-error",children:ne}):null,i("div",{className:"rp-columns",children:[i("aside",{className:"rp-side",children:[i("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Sessions",de?n("span",{className:"rp-eyebrow-count",children:rr(a.length,Pe)}):null]}),de?a.length===0?n("div",{className:"rp-meta",children:"Start a chat and Rewind will record every turn."}):n("div",{className:"rp-cards",children:a.map(o=>i("button",{type:"button",className:"rp-session","aria-current":s===o.session_id?"true":void 0,onClick:()=>{be(o)},children:[i("span",{className:"rp-session-title",children:[n("span",{className:"rp-dot",style:{background:o.ended_at===null?"var(--ui-green)":"var(--ui-text-quaternary)"}}),n("span",{children:o.title??J(o.session_id)})]}),i("span",{className:"rp-meta",children:[o.model??"unknown model"," \xB7 ",D(o.event_count,"event")]}),i("span",{className:"rp-meta rp-meta-dim",children:[ye(o.outcome)," \xB7"," ",ge(o.tokens_in+o.tokens_out)," tokens"]})]},o.session_id))}):n("div",{className:"rp-meta",children:"Loading sessions..."})]}),i("main",{className:"rp-main",children:[y!==null?i("div",{className:"rp-detail-head",children:[i("div",{className:"rp-stack",style:{gap:3},children:[i("div",{className:"rp-detail-title",children:[y.title??J(y.session_id),V.length>0?n("span",{className:"rp-detail-note",children:D(V.length,"snapshot")}):null]}),i("div",{className:"rp-meta",children:[y.model??"unknown model"," \xB7"," ",D(y.event_count,"event")," \xB7"," ",ge(y.tokens_in+y.tokens_out)," tokens",y.ended_at===null?` \xB7 ${tr(y.last_event_at)}`:""]})]}),n("div",{className:"rp-hint",children:"Select a user turn and choose Rewind."})]}):null,j.length>0?i("div",{children:[i("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Branches",n("span",{className:"rp-eyebrow-count",children:j.length})]}),n("div",{className:"rp-chips",children:j.map(o=>i("button",{type:"button",className:"rp-chip","aria-current":f===o.id?"true":void 0,onClick:()=>{b(o.id)},children:[n("span",{className:"rp-mono",children:J(o.id)}),i("span",{className:"rp-badge","data-tone":br(o.state),children:[n("span",{className:"rp-dot"}),o.state]}),n("span",{className:"rp-chip-note",children:o.fork_row_count>0?D(o.fork_row_count,"message"):"context pack"})]},o.id))})]}):null,i("div",{className:"rp-columns",style:{gap:0},children:[n("div",{className:"rp-turns",children:i("div",{className:"rp-stack",style:{width:"100%"},children:[i("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Turns"]}),y===null?n("div",{className:"rp-meta",children:"Select a recorded session."}):_e?Z.length===0?n("div",{className:"rp-meta",children:nr(y.event_count,xe)}):i($e,{children:[Z.map(o=>n(Gr,{turn:o,expanded:T===o.id,events:R[o.id]??null,loading:T===o.id&&R[o.id]===void 0,selectedEventId:C,onToggle:()=>{pe(o)},onFork:()=>{y!==null&&G({session:y,event:o})},onSelectEvent:t=>{m(t.id)}},o.id)),q?n("button",{type:"button",className:"rp-load-more",onClick:()=>{Se()},disabled:_,children:_?"Loading...":"Load earlier turns"}):i("div",{className:"rp-tail",children:[D(Z.length,"turn")," \xB7 start of the recording"]})]}):n("div",{className:"rp-meta",children:"Loading turns..."})]})}),i("div",{className:"rp-payload",children:[i("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Event payload"]}),n(Yr,{detail:le})]})]})]})]}),f!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-stroke-tertiary) pt-2",children:n(Zr,{ctx:e,branchId:f,refreshTick:N,onClose:()=>{b(null)},onRefresh:oe})}):null,$!==null?n(fr,{ctx:e,session:$.session,event:$.event,onClose:()=>{G(null)},onCreated:o=>{b(o),oe()}}):null]})}import{jsx as wr}from"react/jsx-runtime";var nt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let r=()=>{Jr.navigate(ie)};e.registerMany([{id:"page",area:et,data:{path:ie},render:()=>wr(hr,{ctx:e})},{id:"nav",area:rt,data:{path:ie,label:"Rewind",codicon:"history"}},{id:"palette-open",area:Xr,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:r}},{id:"keybind-open",area:Qr,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:r}},{id:"chip",area:tt.right,order:130,render:()=>wr(He,{})}])}},At=nt;export{At as default};
