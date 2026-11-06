import{host as at,KEYBINDS_AREA as it,PALETTE_AREA as st,ROUTES_AREA as lt,SIDEBAR_NAV_AREA as ut,STATUSBAR_AREAS as dt}from"@hermes/plugin-sdk";import{host as He,useValue as Nr}from"@hermes/plugin-sdk";var ie="/rewind";import{jsx as Sr,jsxs as Cr}from"react/jsx-runtime";function Oe(){let e=Nr(He.state.activeSessionId);return Cr("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{He.navigate(ie)},title:"Open Session Rewind",children:[Sr("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as jr,useValue as Vr}from"@hermes/plugin-sdk";import{useEffect as j,useRef as Ur,useState as v}from"react";function me(e,r,t){return e.rest(r,{method:"POST",body:t})}var Ee=100;async function je(e){return(await e.rest(`/sessions?limit=${Ee}`)).items}async function Me(e,r,t=null){let s=t===null?"":`&before_seq=${t}`;return e.rest(`/sessions/${encodeURIComponent(r)}/turns?limit=40${s}`)}async function Ve(e,r,t,s){return(await e.rest(`/sessions/${encodeURIComponent(r)}/events?limit=200&after_seq=${t-1}&before_seq=${s+1}`)).items}function Ue(e,r){return e.rest(`/events/${r}`)}function We(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/snapshots`)}function Ke(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/branches`)}function Je(e,r){return me(e,`/branches/${encodeURIComponent(r)}/reconcile`,{})}function Ge(e,r,t,s=null){let l=s===null?"":`&before_ts=${s}`;return e.rest(`/compare?left=${encodeURIComponent(r)}&right=${encodeURIComponent(t)}${l}`)}function Ye(e,r){return me(e,"/forks/prepare",r)}function Ze(e,r,t){return me(e,`/forks/${encodeURIComponent(r)}/commit`,t)}function Qe(e,r){return me(e,`/forks/${encodeURIComponent(r)}/verify`,{})}function Xe(e,r,t){return e.rest(`/branches/${encodeURIComponent(r)}/verify-resolve?cmd=${encodeURIComponent(t)}`)}function er(e,r){return e.rest(`/forks/${encodeURIComponent(r)}/workspace`)}function ze(e,r){return me(e,`/forks/${encodeURIComponent(r)}/cleanup`,{})}function fe(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ge(e){return e.toLocaleString()}function we(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Rr=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function P(e){let r=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",t=Rr.exec(r),s=t?.[1];if(t===null||s===void 0)return r;let l=Pr(s);return l===void 0?r:r.replace(t[0],l)}function Pr(e){try{let r=JSON.parse(e);return typeof r.detail=="string"&&r.detail.length>0?r.detail:void 0}catch{return}}function Z(e,r=8){return e.length<=r?e:e.slice(0,r)}function $(e,r){return`${e} ${e===1?r:`${r}s`}`}function Ie(e){return e===0?"passed":`failed (exit ${e})`}var Tr={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function ye(e){return e===null?"recording":Tr[e]??e}function Le(e){return e===null?"warn":e==="completed"?"ok":e==="failed"?"err":"idle"}function rr(e){return e===null?"open at freeze":ye(e)}function tr(e,r){return e===0?"":e>=r?`${r}+`:`${e}`}function Er(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function nr(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${Er(e)}`}function or(e,r){return r!==null?`The turns could not be loaded: ${r}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${$(e,"event")} but no user turn.`}function ar(e){return e===null?"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.":`This workspace holds ${$(e,"uncommitted file")}. Deleting it removes them for good; the rerun conversation stays in the recording.`}import{host as A}from"@hermes/plugin-sdk";import{useCallback as Ir,useEffect as ve,useRef as De,useState as I}from"react";function Mr(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let r=e.content;return typeof r=="string"?r.trim():Array.isArray(r)?r.map(t=>{if(typeof t!="object"||t===null||!("text"in t))return"";let s=t.text;return typeof s=="string"?s:""}).join("").trim():""}function ir(e,r){let t=(e??[]).filter(u=>(u.role==="user"||u.role==="assistant")&&Mr(u).length>0&&typeof u.row_id=="number"),s=-1;for(let u=0;u<t.length;u+=1){let k=t[u];if(k===void 0)continue;let c=k.timestamp;k.role==="user"&&typeof c=="number"&&c<=r+.5&&(s=u)}if(s<=0)return null;let l=t[s-1]?.row_id;return typeof l=="number"&&l>0?l:null}var sr={providers:[],currentModel:null,currentProvider:null};function ke(e){return typeof e=="string"?e.trim():""}function lr(e){let r=ke(e);return r===""?null:r}function ur(e){if(e===null||typeof e!="object")return sr;let r=e.providers;if(!Array.isArray(r))return sr;let t=[];for(let s of r){if(s===null||typeof s!="object")continue;let l=s,u=ke(l.slug),k=Array.isArray(l.models)?l.models.map(ke).filter(c=>c!==""):[];u===""||k.length===0||t.push({slug:u,name:ke(l.name)||u,isCurrent:l.is_current===!0,models:k})}return{providers:t,currentModel:lr(e.model),currentProvider:lr(e.provider)}}function dr(e,r){return[...e.providers].sort((t,s)=>{let l=r!==null&&t.slug===r?0:1,u=r!==null&&s.slug===r?0:1;return l!==u?l-u:t.isCurrent!==s.isCurrent?t.isCurrent?-1:1:t.name.localeCompare(s.name)})}function pr(e,r){let t=r.trim().toLowerCase();if(t==="")return e;let s=[];for(let l of e){if(l.name.toLowerCase().includes(t)||l.slug.toLowerCase().includes(t)){s.push(l);continue}let u=l.models.filter(k=>k.toLowerCase().includes(t));u.length>0&&s.push({...l,models:u})}return s}function cr(e,r){let t=r===null?"":` --provider ${r}`;return`${e}${t} --session`}function mr(e,r,t,s){return e===""?!1:e!==(t??"")||r!==s}import{jsx as fr}from"react/jsx-runtime";var zr={rewind:"M3 12a9 9 0 1 0 3-6.7M3 4v5h5",refresh:"M20 11a8 8 0 0 0-14 5l-2 2M4 13a8 8 0 0 0 14-5l2-2",branch:"M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0-3-3M15 9v3a3 3 0 0 0 3 3h3",lock:"M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",folder:"M3 7h6l2 2h10v11H3z",close:"M5 5l14 14M19 5L5 19",chevron:"M9 6l6 6-6 6",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01",copy:"M9 9h11v11H9zM5 15V5a1 1 0 0 1 1-1h10",check:"M4 12l5 5L20 7"};function M({name:e,size:r=14,className:t}){return fr("svg",{"aria-hidden":"true",className:t,viewBox:"0 0 24 24",width:r,height:r,fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round",focusable:"false",children:fr("path",{d:zr[e]})})}import{Fragment as Br,jsx as p,jsxs as g}from"react/jsx-runtime";var Lr=["python -m pytest -q","npm test","cargo test","go test ./..."],Dr=350,Fr=400;function se(e,r){return r.catch(t=>{throw new Error(`${e}: ${P(t)}`)})}function $r(e){if(e===null)return[];let r=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(r).filter(t=>!t.hasAttribute("disabled"))}function Ar(e,r){let t=$r(e),s=t[0],l=t[t.length-1];if(e===null||s===void 0||l===void 0)return;let u=document.activeElement;if(!e.contains(u)){r.preventDefault(),s.focus();return}r.shiftKey&&u===s?(r.preventDefault(),l.focus()):!r.shiftKey&&u===l&&(r.preventDefault(),s.focus())}var qr=`
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
`;function gr({ctx:e,session:r,event:t,onClose:s,onCreated:l}){let[u,k]=I(""),[c,q]=I(null),[z,_]=I({providers:[],currentModel:null,currentProvider:null}),[Q,T]=I(!1),[w,R]=I(!1),[L,V]=I(""),[B,K]=I(""),[x,C]=I(""),[m,le]=I(null),[H,f]=I(null),[b,D]=I(null),[J,N]=I(null),[te,ne]=I(!1),U=De([]),E=b!==null,ue=De(null),de=De(()=>{}),X=Ir(()=>{E||(ne(!0),U.current.push(e.setTimeout(s,100)))},[E,e,s]);ve(()=>{let o=U.current;return()=>{for(let d of o)d()}},[]),ve(()=>{let o=document.activeElement;return ue.current?.focus(),()=>{o?.focus()}},[]),ve(()=>{let o=d=>{if(d.key==="Escape"&&!E){if(w){R(!1);return}X();return}if(d.key==="Tab"){Ar(ue.current,d);return}if(d.key==="Enter"&&(d.metaKey||d.ctrlKey)&&!E){if(w)return;d.preventDefault(),de.current()}};return window.addEventListener("keydown",o),()=>{window.removeEventListener("keydown",o)}},[E,X,w]),ve(()=>{let o=x.trim();if(m===null||o===""){f(null);return}let d=!1,h=e.setTimeout(()=>{Xe(e,m.branch_id,o).then(S=>{d||f(S)}).catch(()=>{d||f(null)})},Dr);return()=>{d=!0,h()}},[e,m,x]),ve(()=>{let o=!1;return A.request("model.options",{explicit_only:!0,include_unconfigured:!1}).then(d=>{if(o)return;let h=ur(d);_(h),T(h.providers.length===0)}).catch(()=>{o||T(!0)}),()=>{o=!0}},[]);let Se=dr(z,r.provider),W=pr(Se,L),xe=u.trim()===""?r.model??"":u.trim(),G=c??r.provider,y=G===null?"":z.providers.find(o=>o.slug===G)?.name??G,pe=(o,d)=>{k(d),q(o),R(!1),V("")},Ce=()=>{k(""),q(null),R(!1),V("")},Y=async()=>{let o=await A.request("session.active_list",{}),d=Array.isArray(o.sessions)?o.sessions:[],h=d.find(S=>S.session_key===r.session_id)?.id??d.find(S=>S.id===r.session_id)?.id;if(h===void 0)return{runtimeId:void 0,storedId:r.stored_session_id};try{let S=await A.request("session.title",{session_id:h});return{runtimeId:h,storedId:S.session_key??r.stored_session_id}}catch{return{runtimeId:h,storedId:r.stored_session_id}}},be=async()=>{D("prepare"),N(null);try{let o=await Y(),d=await Ye(e,{session_id:r.session_id,stored_session_id:o.storedId,event_id:t.id,model:u.trim()||null,provider:c,prompt:B.trim()||null,verify_cmd:x.trim()||null});le(d),K(d.prompt),d.verify_presets.length>0&&x.trim()===""&&C(d.verify_presets[0]??"")}catch(o){N(P(o))}finally{D(null)}},oe=async()=>{if(m!==null){D("run"),N(null);try{let o=await Y(),d=o.runtimeId,h=`\u21BA ${r.title??Z(r.session_id)} \xB7 ${Z(m.branch_id)}`,S=null;if(d!==void 0)try{let F=await A.request("session.history",{session_id:d});S=ir(F.messages,m.fork_before_ts)}catch{S=null}let O,ae,$e=!1;if(S!==null&&d!==void 0){let F=await se("could not branch the session",A.request("session.branch",{session_id:d,through_message_id:S}));O=F.session_id,ae=F.stored_session_id}else{let F={source:"desktop",title:h};m.worktree_path!==null&&(F.cwd=m.worktree_path),o.storedId!==null&&(F.parent_session_id=o.storedId);let ee=await se("could not create the branch session",A.request("session.create",F));O=ee.session_id,ae=ee.stored_session_id,$e=!0}if($e&&m.worktree_path!==null){let F=()=>A.request("session.cwd.set",{session_id:O,cwd:m.worktree_path});try{await se("could not attach the isolated workspace",F())}catch(ee){throw ee instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${P(ee)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(await se("could not open the rerun session",A.openSession(ae,{intent:"tab"})),mr(u.trim(),c,r.model,r.provider)){let F=cr(u.trim(),c),ee=()=>A.request("config.set",{key:"model",value:F,session_id:O,confirm_expensive_model:!1}),Pe=!1,Te=null,qe="";for(let Be=0;Be<2&&!Pe;Be+=1)try{let he=await ee();Pe=!0,Te=he.confirm_required===!0?he.confirm_message??null:null}catch(he){qe=P(he),await new Promise(_r=>{setTimeout(_r,Fr)})}Pe?Te!==null&&A.notify({kind:"info",message:Te,detail:`The rerun started before the switch could be confirmed; ${u.trim()} applies from the next turn.`}):A.notify({kind:"warning",message:`The rerun runs on ${r.model??"the session model"}, not ${u.trim()}.`,detail:qe})}let Ae=B.trim()||m.prompt;await se("could not record the branch",Ze(e,m.branch_id,{child_session_id:O,child_stored_session_id:ae,model:u.trim()||r.model,provider:c??r.provider,prompt:Ae,verify_cmd:x.trim()||null})),await se("could not start the rerun",A.request("prompt.submit",{session_id:O,text:Ae})),l(m.branch_id),s()}catch(o){N(P(o))}finally{D(null)}}};de.current=()=>{m===null?be():oe()};let ce=m!==null,Re=x.trim(),a=[];return ce?(m.fidelity!=="full"&&a.push({warn:!0,text:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}),m.context_rows===null&&a.push({warn:!0,text:"The live transcript prefix is unavailable. The context pack is the only context."}),r.ended_at!==null&&a.push({warn:!1,text:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}),m.fork_row_count===0&&r.ended_at===null&&a.push({warn:!1,text:"This is the first turn. The rerun starts a fresh chat in the restored workspace."})):a.push({warn:!1,text:"Prepare reads the recorded context for this turn and drafts the rerun prompt. Nothing runs until you fork."}),g("div",{className:"rw-overlay","data-closing":te?"true":"false",onMouseDown:o=>{o.target===o.currentTarget&&X()},children:[p("style",{children:qr}),g("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title","aria-describedby":"rw-reassure",tabIndex:-1,ref:ue,children:[g("header",{className:"rw-head",children:[p("span",{className:"rw-mark",children:p(M,{name:"rewind",size:16})}),g("div",{className:"rw-heading",children:[p("div",{className:"rw-eyebrow",children:"Session Rewind"}),p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"})]}),p("button",{type:"button",className:"rw-close",onClick:X,disabled:E,"aria-label":"Close",children:p(M,{name:"close",size:15})})]}),g("div",{className:"rw-body",children:[g("div",{className:"rw-turn",children:[p("span",{className:"rw-turn-time",children:fe(t.ts)}),p("span",{className:"rw-turn-text",children:t.preview||"user turn"})]}),J!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:J}):null,ce&&m.worktree_path?g("div",{className:"rw-path",children:[p("span",{className:"rw-path-text",title:m.worktree_path,children:m.worktree_path}),p("button",{type:"button",className:"rw-icon-button",onClick:()=>{e.os.revealPath(m.worktree_path??"")},disabled:E,"aria-label":"Reveal the isolated workspace",children:p(M,{name:"folder",size:13})})]}):null,a.length>0?p("div",{className:"rw-notes",children:a.map(o=>g("div",{className:`rw-note${o.warn?" rw-note-warn":""}`,role:o.warn?"status":void 0,children:[p(M,{name:"info"}),p("span",{children:o.text})]},o.text))}):null,g("div",{className:"rw-grid",children:[g("div",{className:"rw-field",children:[p("span",{className:"rw-label",id:"rw-model-label",children:"Model"}),g("button",{type:"button",className:`rw-trigger${w?" rw-trigger-open":""}`,onClick:()=>{R(!w)},disabled:E,"aria-haspopup":"listbox","aria-expanded":w,"aria-labelledby":"rw-model-label rw-model-value",children:[p("span",{className:"rw-trigger-text",id:"rw-model-value",children:xe===""?"Session model":xe}),y===""?null:p("span",{className:"rw-trigger-provider",children:y}),p("span",{className:"rw-trigger-caret","aria-hidden":"true","data-open":w,children:p(M,{name:"chevron",size:12})})]}),w?g("div",{className:"rw-picker",children:[p("input",{className:"rw-search",value:L,onChange:o=>{V(o.target.value)},onKeyDown:o=>{let d=W[0];o.key==="Enter"&&d!==void 0&&(o.preventDefault(),pe(d.slug,d.models[0]??""))},placeholder:"Search models","aria-label":"Search models",autoFocus:!0}),g("div",{className:"rw-picker-list",role:"listbox","aria-label":"Models",children:[g("button",{type:"button",className:"rw-option rw-option-keep",role:"option","aria-selected":u.trim()==="",onClick:Ce,children:["Keep the session model",r.model===null?null:p("span",{className:"rw-option-sub",children:r.model})]}),W.map(o=>g("div",{className:"rw-group",role:"group","aria-label":o.name,children:[g("div",{className:"rw-group-head",children:[p("span",{children:o.name}),p("span",{className:"rw-count",children:o.models.length})]}),o.models.map(d=>g("button",{type:"button",className:"rw-option",role:"option","aria-selected":d===u.trim()&&o.slug===c,onClick:()=>{pe(o.slug,d)},children:[p("span",{className:"rw-option-text",children:d}),d===r.model?p("span",{className:"rw-option-tag",children:"session"}):null]},d))]},o.slug)),W.length===0&&L.trim()!==""?p("button",{type:"button",className:"rw-option",role:"option",onClick:()=>{k(L.trim()),q(null),R(!1),V("")},children:g("span",{className:"rw-option-text",children:["Use \u201C",L.trim(),"\u201D as typed"]})}):null,W.length===0&&L.trim()===""?p("div",{className:"rw-picker-empty",children:"No configured provider offers a model."}):null]})]}):null,p("span",{className:"rw-help",children:Q?"Could not read the model list, so the rerun keeps the session model.":"Lists the providers configured in Hermes."})]}),g("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:x,onChange:o=>{C(o.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(m?.verify_presets.length?m.verify_presets:Lr).map(o=>p("button",{type:"button",className:"rw-preset","aria-pressed":o===Re,onClick:()=>{C(o)},disabled:E,children:o},o))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),H!==null&&H.command===x.trim()?p("span",{className:"rw-resolved",children:H.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":g(Br,{children:[p("span",{children:"Resolves to"}),p("span",{className:"rw-resolved-path",title:H.resolved,children:H.resolved})]})}):null]})]}),g("label",{className:"rw-field",children:[g("span",{className:"rw-label-row",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),g("span",{className:"rw-count","aria-live":"polite",children:[B.length," chars"]})]}),p("textarea",{className:"rw-textarea",value:B,onChange:o=>{K(o.target.value)},placeholder:"Prepare the branch to draft the rerun prompt, or write your own."})]})]}),g("footer",{className:"rw-footer",children:[g("span",{className:"rw-reassure",id:"rw-reassure",children:[p(M,{name:"lock",size:13}),p("span",{children:"Original session and workspace stay untouched."})]}),g("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:X,disabled:E,children:"Cancel"}),ce?g("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{oe()},disabled:E,"aria-busy":b==="run",children:[b==="run"?p("span",{className:"rw-spinner"}):null,b==="run"?"Forking":"Fork & run",b==="run"?null:p("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]}):g("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{be()},disabled:E,"aria-busy":b==="prepare",children:[b==="prepare"?p("span",{className:"rw-spinner"}):null,b==="prepare"?"Preparing":"Prepare branch",b==="prepare"?null:p("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]})]})]})]})]})}function Fe(e,r,t){let s=new Set(r.map(u=>u.id)),l=t.filter(u=>u.session_id===e&&!s.has(u.id));return[...r,...l]}function Hr(e){let r=e.trim();if(r.length<2)return!1;let t=r[0];return t==="{"&&r.endsWith("}")||t==="["&&r.endsWith("]")}function _e(e,r=0){if(r>=4)return e;if(Array.isArray(e))return e.map(t=>_e(t,r+1));if(e!==null&&typeof e=="object"){let t={};for(let[s,l]of Object.entries(e))t[s]=_e(l,r+1);return t}if(typeof e=="string"&&Hr(e))try{let t=JSON.parse(e);if(t!==null&&typeof t=="object")return _e(t,r+1)}catch{}return e}var Or=/(?<q>"(?:\\.|[^"\\])*")(?<c>\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\][,:]|\s+|./g;function vr(e){let r=[];for(let t of e.matchAll(Or)){let s=t[0],l=t.groups?.q,u=t.groups?.c;if(l!==void 0){r.push({text:l,type:u!==void 0?"key":"string"}),u!==void 0&&r.push({text:u,type:"punct"});continue}s==="true"||s==="false"?r.push({text:s,type:"bool"}):s==="null"?r.push({text:s,type:"null"}):/^-?\d/.test(s)?r.push({text:s,type:"number"}):r.push({text:s,type:"punct"})}return r}function xr(e){return JSON.stringify(_e(e),null,2)}import{Fragment as Ne,jsx as n,jsxs as i}from"react/jsx-runtime";var Wr="[data-rw-confirm]";function br(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(Wr)!==null}var Kr=`
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
`,Jr=new Set(["done","failed","cleaned","discarded"]);function Gr(e){return we(Math.max(0,(e.work_ts-e.ts)*1e3))}function Yr({event:e,selected:r,onSelect:t}){return i("button",{type:"button",className:"rp-event","aria-current":r?"true":void 0,onClick:t,children:[n("span",{title:e.kind,className:`rp-event-kind ${Xr(e.kind,e.status)}`,children:hr(e.kind)}),n("span",{className:"rp-event-text",children:e.name??e.preview}),n("span",{className:"rp-event-time rp-mono",children:we(e.duration_ms)})]})}var Zr=new Set(["api_request","llm_call"]);function Qr({turn:e,expanded:r,events:t,loading:s,selectedEventId:l,onToggle:u,onFork:k,onSelectEvent:c}){let q=(t??[]).filter(_=>!Zr.has(_.kind)),z=(t??[]).length-q.length;return i("div",{className:"rp-turn",children:[i("div",{className:"rp-turn-bar",children:[i("button",{type:"button",className:"rp-turn-row",onClick:u,"aria-expanded":r,children:[n("span",{className:"rp-caret","data-open":r?"true":"false",children:n(M,{name:"chevron",size:12})}),n("span",{className:"rp-turn-time rp-mono",children:fe(e.ts)}),n("span",{className:"rp-turn-preview",children:e.preview||"User turn"}),n("span",{className:"rp-turn-stat",children:$(e.tool_calls,"tool")}),e.tool_errors>0?i("span",{className:"rp-badge","data-tone":"err",children:[n("span",{className:"rp-dot"}),$(e.tool_errors,"error")]}):null,n("span",{className:"rp-turn-duration rp-mono",children:Gr(e)})]}),i("button",{type:"button",className:"rp-button rp-button-sm",onClick:k,children:[n(M,{name:"rewind",size:12}),"Rewind"]})]}),r?n("div",{className:"rp-events",children:s?n("div",{className:"rp-aside-note",children:"Loading events..."}):i(Ne,{children:[q.map(_=>n(Yr,{event:_,selected:l===_.id,onSelect:()=>{c(_)}},_.id)),z>0?i("div",{className:"rp-aside-note",children:[$(e.api_requests,"model request")," \xB7 ",$(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function hr(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function Xr(e,r){return e==="tool_result"&&r==="error"?"text-(--ui-red)":e==="assistant_response"||e==="tool_result"?"text-(--ui-green)":e==="user_turn"?"text-(--ui-accent)":e==="tool_call"?"text-(--ui-purple)":e==="api_request"||e==="llm_call"?"text-(--ui-orange)":e==="compaction"?"text-(--ui-text-secondary)":"text-(--ui-text-tertiary)"}function wr(e){return e==="done"?"ok":e==="failed"?"err":e==="running"?"run":"idle"}function re({label:e,value:r,tone:t="idle"}){return i(Ne,{children:[n("span",{className:"rp-metric-label",children:e}),n("span",{className:`rp-metric-value rp-tone-${t}`,children:r})]})}function et(e,r){return e==="tool_result"&&r==="error"?"var(--ui-red)":e==="assistant_response"||e==="tool_result"?"var(--ui-green)":e==="user_turn"?"var(--ui-accent)":e==="tool_call"?"var(--ui-purple)":e==="api_request"||e==="llm_call"?"var(--ui-orange)":e==="compaction"?"var(--ui-text-secondary)":"var(--ui-text-tertiary)"}function rt(e){return e===null?null:e==="error"?"err":e==="ok"?"ok":"run"}function tt({text:e,onCopy:r}){let[t,s]=v(!1);return j(()=>{if(!t)return;let l=window.setTimeout(()=>{s(!1)},1600);return()=>{window.clearTimeout(l)}},[t]),i("button",{type:"button",className:"rp-button rp-button-sm rp-quiet","aria-label":"Copy payload",onClick:()=>{try{r(e),s(!0)}catch{}},children:[n(M,{name:t?"check":"copy",size:12}),t?"Copied":"Copy"]})}function nt({detail:e,onCopy:r}){if(e===null)return i("div",{className:"rp-inspect-empty",children:[n(M,{name:"info",size:14}),n("span",{children:"Select an event to inspect its payload."})]});let t=xr(e.payload),s=rt(e.status);return i("div",{className:"rp-inspect",children:[i("div",{className:"rp-inspect-head",children:[i("span",{title:e.kind,className:"rp-inspect-kind",style:{color:et(e.kind,e.status)},children:[n("span",{className:"rp-dot"}),hr(e.kind)]}),n("span",{className:"rp-inspect-name",title:e.name??e.kind,children:e.name??e.kind}),s!==null?n("span",{className:"rp-badge","data-tone":s,children:e.status}):null]}),i("div",{className:"rp-inspect-meta",children:[i("span",{className:"rp-mono",children:["#",e.id]}),n("span",{className:"rp-inspect-sep",children:"\xB7"}),i("span",{className:"rp-mono",children:["seq ",e.seq]}),e.duration_ms!==null?i(Ne,{children:[n("span",{className:"rp-inspect-sep",children:"\xB7"}),n("span",{className:"rp-mono",title:`${e.duration_ms} ms`,children:we(e.duration_ms)})]}):null]}),i("div",{className:"rp-json-card",children:[i("div",{className:"rp-json-head",children:[n("span",{className:"rp-json-lang",children:"json"}),n(tt,{text:t,onCopy:r})]}),n("pre",{className:"rp-json",children:vr(t).map((l,u)=>n("span",{className:`rp-j-${l.type}`,children:l.text},u))})]})]})}function ot({ctx:e,branchId:r,refreshTick:t,onClose:s,onRefresh:l}){let[u,k]=v(null),[c,q]=v(null),[z,_]=v(!1),[Q,T]=v(null),[w,R]=v(null),L=Ur(null);j(()=>{let f=!1,b=null,D=async()=>{try{let N=await Je(e,r);if(f)return!0;k(N),T(null);let te=N.branch.child_session_id;if(te!==null){let ne=await Ge(e,N.branch.parent_session_id,te,N.branch.fork_before_ts);f||q(ne)}else q(null);return Jr.has(N.branch.state)}catch(N){return f||T(P(N)),!1}},J=async()=>{let N=await D();!f&&!N&&(b=e.setTimeout(()=>{J()},2500))};return J(),()=>{f=!0,b!==null&&b()}},[e,r,t]);let V=async()=>{_(!0),T(null);try{await Qe(e,r),l()}catch(f){T(P(f))}finally{_(!1)}},B=async f=>{_(!0),T(null),R(null);try{await ze(e,r),l()}catch(b){T(P(b)),R(f)}finally{_(!1)}},K=async()=>{_(!0),T(null);try{let f=await er(e,r);f.uncommitted===0?(await ze(e,r),l()):R(f)}catch(f){T(P(f))}finally{_(!1)}};if(j(()=>{R(null)},[r]),j(()=>{if(w===null)return;let f=b=>{b.key==="Escape"&&br()&&R(null)};return window.addEventListener("keydown",f),()=>{window.removeEventListener("keydown",f)}},[w]),j(()=>{if(w===null)return;let f=document.activeElement;return L.current?.focus(),()=>{f instanceof HTMLElement&&f.focus()}},[w]),u===null)return n("div",{className:"rp-meta",children:"Loading branch..."});let x=u.branch,C=u.run,m=C?.verify_exit??c?.right?.verify_exit??null,le=x.verify_cmd?x.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",H=x.worktree_path?void 0:"This branch has no workspace left to remove.";return i("div",{className:"rp-stack",children:[i("div",{className:"rp-branch-head",children:[i("div",{className:"rp-branch-title",children:[i("span",{children:["Branch ",Z(x.id)]}),i("span",{className:"rp-badge","data-tone":wr(x.state),children:[n("span",{className:"rp-dot"}),x.state]}),C!==null&&C.verify_exit!==null?i("span",{className:"rp-badge","data-tone":C.verify_exit===0?"ok":"err",children:["verify ",Ie(C.verify_exit)]}):null]}),i("div",{className:"rp-branch-actions",children:[n("button",{type:"button",className:"rp-button rp-button-sm",title:le,onClick:()=>{V()},disabled:z||!x.verify_cmd||!x.worktree_path,children:"Verify"}),n("button",{type:"button",className:"rp-button rp-button-sm",title:H,onClick:()=>{K()},disabled:z||!x.worktree_path,children:"Cleanup"}),n("button",{type:"button",className:"rp-button rp-button-sm rp-quiet",onClick:s,children:"Hide"})]})]}),u.shared_child?n("div",{className:"rp-note rp-note-warn",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,Q!==null?n("div",{className:"rp-error",children:Q}):null,w!==null?i("div",{className:"rp-confirm",ref:L,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[n("div",{className:"rp-confirm-copy",children:ar(w.uncommitted)}),n("div",{className:"rp-confirm-path",children:w.worktree_path}),i("div",{className:"rp-confirm-actions",children:[n("button",{type:"button",className:"rp-button rp-button-sm rp-delete",onClick:()=>{B(w)},disabled:z,children:"Delete workspace"}),n("button",{type:"button",className:"rp-button rp-button-sm",onClick:()=>{R(null)},children:"Cancel"})]})]}):null,c!==null?i("div",{className:"rp-stack",children:[i("div",{className:"rp-compare",children:[i("div",{className:"rp-panel",children:[i("div",{className:"rp-card-label",children:["Original",c.left?.frozen_at?` \xB7 frozen ${fe(c.left.frozen_at)}`:""]}),i("div",{className:"rp-metrics",children:[n(re,{label:"outcome",value:c.left===null?"not recorded":rr(c.left.outcome),tone:c.left===null?"idle":Le(c.left.outcome)}),n(re,{label:"tokens",value:c.left===null?"n/a":ge(c.left.tokens_in+c.left.tokens_out)}),n(re,{label:"tool errors",value:c.left===null?"n/a":String(c.left.tool_errors),tone:c.left!==null&&c.left.tool_errors>0?"err":"idle"})]})]}),i("div",{className:"rp-panel",children:[n("div",{className:"rp-card-label rp-card-label-accent",children:"Rerun"}),i("div",{className:"rp-metrics",children:[n(re,{label:"outcome",value:c.right===null?"not recorded":ye(c.right.outcome),tone:c.right===null?"idle":Le(c.right.outcome)}),n(re,{label:"verify",value:m===null?"not run":Ie(m),tone:m===null?"idle":m===0?"ok":"err"}),n(re,{label:"tokens",value:c.right===null?"n/a":ge(c.right.tokens_in+c.right.tokens_out)}),n(re,{label:"tool errors",value:c.right===null?"n/a":String(c.right.tool_errors),tone:c.right!==null&&c.right.tool_errors>0?"err":"idle"})]})]})]}),i("div",{className:"rp-verdict",children:[n(M,{name:"info",size:13}),i("span",{children:[n("strong",{children:"Verdict"})," ",c.verdict]})]})]}):n("div",{className:"rp-meta",children:x.state==="cleaned"||x.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),C!==null&&C.verify_out?n("pre",{className:"rp-pre",children:C.verify_out}):null,u.prompt!==null?i("details",{className:"rp-panel rp-disclosure",children:[n("summary",{children:"Prompt"}),n("pre",{className:"rp-pre",children:u.prompt})]}):null]})}function yr({ctx:e}){let r=Vr(jr.state.activeSessionId),[t,s]=v([]),[l,u]=v(null),[k,c]=v([]),[q,z]=v(!1),[_,Q]=v(!1),[T,w]=v(null),[R,L]=v({}),[V,B]=v([]),[K,x]=v([]),[C,m]=v(null),[le,H]=v(null),[f,b]=v(null),[D,J]=v(null),[N,te]=v(0),[ne,U]=v(null),[E,ue]=v(0),[de,X]=v(!1),[Se,W]=v(!1),[xe,G]=v(null);j(()=>{let a=null,o=e.onEvent("*",()=>{a===null&&(a=e.setTimeout(()=>{a=null,ue(d=>d+1)},1500))});return()=>{o(),a!==null&&a()}},[e]),j(()=>{if(f===null||D!==null)return;let a=o=>{o.key==="Escape"&&!br()&&b(null)};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[f,D]),j(()=>{let a=!1,o=async()=>{try{let h=await je(e);if(a)return;s(h),X(!0),U(null),u(S=>S!==null&&h.some(O=>O.session_id===S)?S:r??h[0]?.session_id??null)}catch(h){a||U(P(h))}};o();let d=e.setInterval(()=>{o()},1e4);return()=>{a=!0,d()}},[e,r,N,E]),j(()=>{if(l===null){c([]),W(!1),z(!1),G(null),B([]),x([]);return}let a=!1,o=async()=>{try{let[h,S,O]=await Promise.all([Me(e,l),We(e,l),Ke(e,l)]);if(a)return;c(ae=>Fe(l,h.items,ae)),z(h.has_more),W(!0),B(S),x(O),G(null),U(null)}catch(h){a||(W(!0),G(P(h)))}};o();let d=e.setInterval(()=>{o()},1e4);return()=>{a=!0,d()}},[e,l,N,E]),j(()=>{if(C===null){H(null);return}let a=!1;return Ue(e,C).then(o=>{a||H(o)}).catch(o=>{a||U(P(o))}),()=>{a=!0}},[e,C]);let y=t.find(a=>a.session_id===l)??null,pe=y!==null&&y.ended_at===null,Ce=pe&&y.session_id===r,Y=l===null?[]:k.filter(a=>a.session_id===l),be=a=>{u(a.session_id),m(null),b(null),w(null),L({}),c([]),W(!1),z(!1),G(null),B([]),x([])},oe=()=>{te(a=>a+1)},ce=a=>{if(T===a.id){w(null);return}w(a.id),R[a.id]===void 0&&Ve(e,a.session_id,a.seq,a.seq_to).then(o=>{L(d=>({...d,[a.id]:o}))}).catch(o=>{U(P(o))})},Re=async()=>{let a=Y[Y.length-1];if(!(l===null||a===void 0)){Q(!0);try{let o=await Me(e,l,a.seq);c(d=>Fe(l,o.items,d)),z(o.has_more)}catch(o){U(P(o))}finally{Q(!1)}}};return i("div",{className:"rw-page rp-shell",children:[n("style",{children:Kr}),i("header",{className:"rp-head",children:[i("div",{className:"rp-head-left",children:[n("span",{className:"rp-mark",children:n(M,{name:"rewind",size:16})}),i("div",{children:[n("div",{className:"rp-title",children:"Session Rewind"}),n("div",{className:"rp-sub",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]})]}),i("div",{className:"rp-head-right",children:[y!==null?n("span",{className:"rp-pill rp-mono",children:y.model??"unknown model"}):null,pe?i("span",{className:"rp-live",children:[n("span",{className:"rp-dot"}),Ce?"live":"running"]}):null,i("button",{type:"button",className:"rp-button",onClick:oe,children:[n(M,{name:"refresh",size:13}),"Refresh"]})]})]}),ne!==null?n("div",{className:"rp-error",children:ne}):null,i("div",{className:"rp-columns",children:[i("aside",{className:"rp-side",children:[i("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Sessions",de?n("span",{className:"rp-eyebrow-count",children:tr(t.length,Ee)}):null]}),de?t.length===0?n("div",{className:"rp-meta",children:"Start a chat and Rewind will record every turn."}):n("div",{className:"rp-cards",children:t.map(a=>i("button",{type:"button",className:"rp-session","aria-current":l===a.session_id?"true":void 0,onClick:()=>{be(a)},children:[i("span",{className:"rp-session-title",children:[n("span",{className:"rp-dot",style:{background:a.ended_at===null?"var(--ui-green)":"var(--ui-text-quaternary)"}}),n("span",{children:a.title??Z(a.session_id)})]}),i("span",{className:"rp-meta",children:[a.model??"unknown model"," \xB7 ",$(a.event_count,"event")]}),i("span",{className:"rp-meta rp-meta-dim",children:[ye(a.outcome)," \xB7"," ",ge(a.tokens_in+a.tokens_out)," tokens"]})]},a.session_id))}):n("div",{className:"rp-meta",children:"Loading sessions..."})]}),i("main",{className:"rp-main",children:[y!==null?i("div",{className:"rp-detail-head",children:[i("div",{className:"rp-stack",style:{gap:3},children:[i("div",{className:"rp-detail-title",children:[y.title??Z(y.session_id),V.length>0?n("span",{className:"rp-detail-note",children:$(V.length,"snapshot")}):null]}),i("div",{className:"rp-meta",children:[y.model??"unknown model"," \xB7"," ",$(y.event_count,"event")," \xB7"," ",ge(y.tokens_in+y.tokens_out)," tokens",y.ended_at===null?` \xB7 ${nr(y.last_event_at)}`:""]})]}),n("div",{className:"rp-hint",children:"Select a user turn and choose Rewind."})]}):null,K.length>0?i("div",{children:[i("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Branches",n("span",{className:"rp-eyebrow-count",children:K.length})]}),n("div",{className:"rp-chips",children:K.map(a=>i("button",{type:"button",className:"rp-chip","aria-current":f===a.id?"true":void 0,onClick:()=>{b(a.id)},children:[n("span",{className:"rp-mono",children:Z(a.id)}),i("span",{className:"rp-badge","data-tone":wr(a.state),children:[n("span",{className:"rp-dot"}),a.state]}),n("span",{className:"rp-chip-note",children:a.fork_row_count>0?$(a.fork_row_count,"message"):"context pack"})]},a.id))})]}):null,i("div",{className:"rp-columns",style:{gap:0},children:[n("div",{className:"rp-turns",children:i("div",{className:"rp-stack",style:{width:"100%"},children:[i("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Turns"]}),y===null?n("div",{className:"rp-meta",children:"Select a recorded session."}):Se?Y.length===0?n("div",{className:"rp-meta",children:or(y.event_count,xe)}):i(Ne,{children:[Y.map(a=>n(Qr,{turn:a,expanded:T===a.id,events:R[a.id]??null,loading:T===a.id&&R[a.id]===void 0,selectedEventId:C,onToggle:()=>{ce(a)},onFork:()=>{y!==null&&J({session:y,event:a})},onSelectEvent:o=>{m(o.id)}},a.id)),q?n("button",{type:"button",className:"rp-load-more",onClick:()=>{Re()},disabled:_,children:_?"Loading...":"Load earlier turns"}):i("div",{className:"rp-tail",children:[$(Y.length,"turn")," \xB7 start of the recording"]})]}):n("div",{className:"rp-meta",children:"Loading turns..."})]})}),i("div",{className:"rp-payload",children:[i("div",{className:"rp-eyebrow",children:[n("span",{className:"rp-dot"}),"Event payload"]}),n(nt,{detail:le,onCopy:a=>{e.os.writeClipboard(a)}})]})]})]})]}),f!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-stroke-tertiary) pt-2",children:n(ot,{ctx:e,branchId:f,refreshTick:N,onClose:()=>{b(null)},onRefresh:oe})}):null,D!==null?n(gr,{ctx:e,session:D.session,event:D.event,onClose:()=>{J(null)},onCreated:a=>{b(a),oe()}}):null]})}import{jsx as kr}from"react/jsx-runtime";var pt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let r=()=>{at.navigate(ie)};e.registerMany([{id:"page",area:lt,data:{path:ie},render:()=>kr(yr,{ctx:e})},{id:"nav",area:ut,data:{path:ie,label:"Rewind",codicon:"history"}},{id:"palette-open",area:st,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:r}},{id:"keybind-open",area:it,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:r}},{id:"chip",area:dt.right,order:130,render:()=>kr(Oe,{})}])}},Jt=pt;export{Jt as default};
