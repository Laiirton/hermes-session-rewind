import{host as Ht,KEYBINDS_AREA as Ot,PALETTE_AREA as jt,ROUTES_AREA as Wt,SIDEBAR_NAV_AREA as Ut,STATUSBAR_AREAS as Kt}from"@hermes/plugin-sdk";import{host as ur,useValue as lt}from"@hermes/plugin-sdk";var Se="/rewind";import{jsx as ut,jsxs as pt}from"react/jsx-runtime";function pr(){let e=lt(ur.state.activeSessionId);return pt("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{ur.navigate(Se)},title:"Open Session Rewind",children:[ut("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-(--ui-green)"}`}),"Rewind"]})}import{host as $t,useValue as Bt}from"@hermes/plugin-sdk";import{useEffect as we,useRef as rt,useState as N}from"react";function Ce(e,r,t){return e.rest(r,{method:"POST",body:t})}var rr=100;async function cr(e){return(await e.rest(`/sessions?limit=${rr}`)).items}async function tr(e,r,t=null){let o=t===null?"":`&before_seq=${t}`;return e.rest(`/sessions/${encodeURIComponent(r)}/turns?limit=40${o}`)}async function dr(e,r,t,o){return(await e.rest(`/sessions/${encodeURIComponent(r)}/events?limit=200&after_seq=${t-1}&before_seq=${o+1}`)).items}function mr(e,r){return e.rest(`/events/${r}`)}async function fr(e,r,t,o=30,a,l){let y=new URLSearchParams({q:t,session_id:r,limit:String(o)});return a&&y.set("kind",a),l&&y.set("tool_name",l),e.rest(`/search?${y.toString()}`)}function gr(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/snapshots`)}function vr(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/branches`)}function xr(e,r){return Ce(e,`/branches/${encodeURIComponent(r)}/reconcile`,{})}function br(e,r,t,o=null){let a=o===null?"":`&before_ts=${o}`;return e.rest(`/compare?left=${encodeURIComponent(r)}&right=${encodeURIComponent(t)}${a}`)}function hr(e,r){return Ce(e,"/forks/prepare",r)}function wr(e,r,t){return Ce(e,`/forks/${encodeURIComponent(r)}/commit`,t)}function yr(e,r){return Ce(e,`/forks/${encodeURIComponent(r)}/verify`,{})}function kr(e,r,t){return e.rest(`/branches/${encodeURIComponent(r)}/verify-resolve?cmd=${encodeURIComponent(t)}`)}function _r(e,r){return e.rest(`/forks/${encodeURIComponent(r)}/workspace`)}function nr(e,r){return Ce(e,`/forks/${encodeURIComponent(r)}/cleanup`,{})}function Nr(e,r){return e.rest(`/sessions/${encodeURIComponent(r)}/bookmarks`)}function Sr(e,r,t,o=null){return Ce(e,"/bookmarks",{session_id:r,event_id:o,label:t})}function me(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function be(e){return e.toLocaleString()}function Cr(e){let r=Math.max(0,Math.round(Date.now()/1e3-e));if(r<60)return"just now";let t=Math.round(r/60);if(t<60)return`${t}m`;let o=Math.round(t/60);if(o<24)return`${o}h`;let a=Math.round(o/24);return a<30?`${a}d`:`${Math.round(a/30)}mo`}function je(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Pr=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function M(e){let r=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",t=Pr.exec(r),o=t?.[1];if(t===null||o===void 0)return r;let a=ct(o);return a===void 0?r:r.replace(t[0],a)}function ct(e){try{let r=JSON.parse(e);if(typeof r.detail=="string"&&r.detail.length>0)return r.detail;if(r.detail!==null&&typeof r.detail=="object"){let t=r.detail;return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}return}catch{return}}function Rr(e){let r=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",o=Pr.exec(r)?.[1],a=M(e),l=null,y=null;if(o===void 0)return{detail:a,claimReason:l,claimedBranchId:y};try{let S=JSON.parse(o).detail;S!==null&&typeof S=="object"&&(typeof S.detail=="string"&&S.detail.length>0&&(a=`could not record the branch: ${S.detail}`),typeof S.reason=="string"&&(l=S.reason),typeof S.claimed_branch_id=="string"&&(y=S.claimed_branch_id))}catch{}return{detail:a,claimReason:l,claimedBranchId:y}}function Er(e){return`The chat app returned the rerun session of branch ${e} \u2014 the same title already existed there, so nothing new was created. Close that tab, then rewind again; the next attempt opens a fresh rerun session.`}function Z(e,r=8){return e.length<=r?e:e.slice(0,r)}function ee(e,r){return`${e} ${e===1?r:`${r}s`}`}function or(e){return e===0?"passed":`failed (exit ${e})`}var dt={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function Pe(e){return e===null?"recording":dt[e]??e}function Re(e){return e===null?"warn":e==="completed"?"ok":e==="failed"?"err":"idle"}function Tr(e){return e===null?"open at freeze":Pe(e)}function Mr(e,r){return e===0?"":e>=r?`${r}+`:`${e}`}function mt(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}var We="Recording \u2014 no end-of-session signal was captured yet, so Rewind cannot tell whether this session is still open. If its window is gone, the rerun still starts normally and carries the recorded context.";function zr(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${mt(e)}`}function Ir(e,r){return r!==null?`The turns could not be loaded: ${r}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${ee(e,"event")} but no user turn.`}function Dr(e,r=0){if(e===null||r===null)return"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.";let t=[];return e>0&&t.push(`${e} uncommitted file${e===1?"":"s"}`),r>0&&t.push(`${r} commit${r===1?"":"s"} not on any branch`),t.length===0?"This workspace holds nothing uncommitted. Deleting it removes only the checkout; the rerun conversation stays in the recording.":`This workspace holds ${t.join(" and ")}. Deleting it removes ${t.length===1?"it":"them"} for good; the rerun conversation stays in the recording.`}import{host as K}from"@hermes/plugin-sdk";import{useCallback as vt,useEffect as Be,useLayoutEffect as xt,useRef as Ae,useState as j}from"react";function ft(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let r=e.content;return typeof r=="string"?r.trim():Array.isArray(r)?r.map(t=>{if(typeof t!="object"||t===null||!("text"in t))return"";let o=t.text;return typeof o=="string"?o:""}).join("").trim():""}function Lr(e,r){let t=(e??[]).filter(l=>(l.role==="user"||l.role==="assistant")&&ft(l).length>0&&typeof l.row_id=="number"),o=-1;for(let l=0;l<t.length;l+=1){let y=t[l];if(y===void 0)continue;let p=y.timestamp;y.role==="user"&&typeof p=="number"&&p<=r+.5&&(o=l)}if(o<=0)return null;let a=t[o-1]?.row_id;return typeof a=="number"&&a>0?a:null}var $r={providers:[],currentModel:null,currentProvider:null};function Ue(e){return typeof e=="string"?e.trim():""}function Br(e){let r=Ue(e);return r===""?null:r}function Ar(e){if(e===null||typeof e!="object")return $r;let r=e.providers;if(!Array.isArray(r))return $r;let t=[];for(let o of r){if(o===null||typeof o!="object")continue;let a=o,l=Ue(a.slug),y=Array.isArray(a.models)?a.models.map(Ue).filter(p=>p!==""):[];l===""||y.length===0||t.push({slug:l,name:Ue(a.name)||l,isCurrent:a.is_current===!0,models:y})}return{providers:t,currentModel:Br(e.model),currentProvider:Br(e.provider)}}function Fr(e,r){return[...e.providers].sort((t,o)=>{let a=r!==null&&t.slug===r?0:1,l=r!==null&&o.slug===r?0:1;return a!==l?a-l:t.isCurrent!==o.isCurrent?t.isCurrent?-1:1:t.name.localeCompare(o.name)})}function qr(e,r){let t=r.trim().toLowerCase();if(t==="")return e;let o=[];for(let a of e){if(a.name.toLowerCase().includes(t)||a.slug.toLowerCase().includes(t)){o.push(a);continue}let l=a.models.filter(y=>y.toLowerCase().includes(t));l.length>0&&o.push({...a,models:l})}return o}function Hr(e,r){let t=r===null?"":` --provider ${r}`;return`${e}${t} --session`}function Or(e,r,t,o){return e===""?!1:e!==(t??"")||r!==o}import{jsx as jr}from"react/jsx-runtime";var gt={rewind:"M3 12a9 9 0 1 0 3-6.7M3 4v5h5",refresh:"M20 11a8 8 0 0 0-14 5l-2 2M4 13a8 8 0 0 0 14-5l2-2",branch:"M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0-3-3M15 9v3a3 3 0 0 0 3 3h3",lock:"M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",folder:"M3 7h6l2 2h10v11H3z",close:"M5 5l14 14M19 5L5 19",chevron:"M9 6l6 6-6 6",info:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v6M12 7.5h.01",copy:"M9 9h11v11H9zM5 15V5a1 1 0 0 1 1-1h10",check:"M4 12l5 5L20 7",message:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",reply:"M9 14L4 9l5-5M20 20v-7a4 4 0 0 0-4-4H4",tool:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",inbox:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8",layers:"M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",event:"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18"};function T({name:e,size:r=14,className:t}){return jr("svg",{"aria-hidden":"true",className:t,viewBox:"0 0 24 24",width:r,height:r,fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round",focusable:"false",children:jr("path",{d:gt[e]})})}import{Fragment as Nt,jsx as d,jsxs as _}from"react/jsx-runtime";var bt=["python -m pytest -q","npm test","cargo test","go test ./..."],ht=350,wt=400;function Ee(e,r){return r.catch(t=>{throw new Error(`${e}: ${M(t)}`)})}function yt(e){if(e===null)return[];let r=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(r).filter(t=>!t.hasAttribute("disabled"))}function kt(e,r){let t=yt(e),o=t[0],a=t[t.length-1];if(e===null||o===void 0||a===void 0)return;let l=document.activeElement;if(!e.contains(l)){r.preventDefault(),o.focus();return}r.shiftKey&&l===o?(r.preventDefault(),a.focus()):!r.shiftKey&&l===a&&(r.preventDefault(),o.focus())}var _t=`
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
  z-index: 5;
  overscroll-behavior: contain;
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
`;function Wr({ctx:e,session:r,event:t,onClose:o,onCreated:a}){let[l,y]=j(""),[p,S]=j(null),[L,w]=j({providers:[],currentModel:null,currentProvider:null}),[z,P]=j(!1),[k,x]=j(!1),[W,J]=j(null),se=Ae(null),re=Ae(null);xt(()=>{if(!k){J(null);return}let s=()=>{let $=se.current;if($===null)return;let f=$.getBoundingClientRect(),ce=window.innerHeight-f.bottom;if(ce<260){J({bottom:window.innerHeight-f.top+6,left:f.left,width:f.width,maxHeight:Math.max(200,Math.round(f.top-12))});return}J({top:f.bottom+6,left:f.left,width:f.width,maxHeight:Math.min(320,Math.round(ce-12))})};s();let c=$=>{let f=$.target;re.current!==null&&f instanceof Node&&re.current.contains(f)||s()},D=e.addEventListener(window,"scroll",c,{capture:!0}),R=e.addEventListener(window,"resize",s);return()=>{D(),R()}},[e,k]);let[C,E]=j(""),[A,ye]=j(""),[U,b]=j(""),[g,te]=j(null),[V,I]=j(null),[F,ne]=j(null),[X,le]=j(null),[Xe,Ie]=j(!1),Fe=Ae([]),q=F!==null,ue=Ae(null),qe=Ae(()=>{}),Y=vt(()=>{q||(Ie(!0),Fe.current.push(e.setTimeout(o,100)))},[q,e,o]);Be(()=>{let s=Fe.current;return()=>{for(let c of s)c()}},[]),Be(()=>{let s=document.activeElement;return ue.current?.focus(),()=>{s?.focus()}},[]),Be(()=>{let s=c=>{if(c.key==="Escape"&&!q){if(k){x(!1);return}Y();return}if(c.key==="Tab"){kt(ue.current,c);return}if(c.key==="Enter"&&(c.metaKey||c.ctrlKey)&&!q){if(k)return;c.preventDefault(),qe.current()}};return window.addEventListener("keydown",s),()=>{window.removeEventListener("keydown",s)}},[q,Y,k]),Be(()=>{let s=U.trim();if(g===null||s===""){I(null);return}let c=!1,D=e.setTimeout(()=>{kr(e,g.branch_id,s).then(R=>{c||I(R)}).catch(()=>{c||I(null)})},ht);return()=>{c=!0,D()}},[e,g,U]),Be(()=>{let s=!1;return K.request("model.options",{explicit_only:!0,include_unconfigured:!1}).then(c=>{if(s)return;let D=Ar(c);w(D),P(D.providers.length===0)}).catch(()=>{s||P(!0)}),()=>{s=!0}},[]);let De=Fr(L,r.provider),fe=qr(De,C),oe=l.trim()===""?r.model??"":l.trim(),ge=p??r.provider,pe=ge===null?"":L.providers.find(s=>s.slug===ge)?.name??ge,ke=(s,c)=>{y(c),S(s),x(!1),E("")},Ye=()=>{y(""),S(null),x(!1),E("")},ve=async()=>{let s=await K.request("session.active_list",{}),c=Array.isArray(s.sessions)?s.sessions:[],D=c.find(R=>R.session_key===r.session_id)?.id??c.find(R=>R.id===r.session_id)?.id;if(D===void 0)return{runtimeId:void 0,storedId:r.stored_session_id};try{let R=await K.request("session.title",{session_id:D});return{runtimeId:D,storedId:R.session_key??r.stored_session_id}}catch{return{runtimeId:D,storedId:r.stored_session_id}}},_e=async()=>{ne("prepare"),le(null);try{let s=await ve(),c=await hr(e,{session_id:r.session_id,stored_session_id:s.storedId,event_id:t.id,model:l.trim()||null,provider:p,prompt:A.trim()||null,verify_cmd:U.trim()||null});te(c),ye(c.prompt),c.verify_presets.length>0&&U.trim()===""&&b(c.verify_presets[0]??"")}catch(s){le(M(s))}finally{ne(null)}},He=async()=>{if(g!==null){ne("run"),le(null);try{let s=await ve(),c=s.runtimeId,D=`\u21BA ${r.title??Z(r.session_id)} \xB7 ${Z(g.branch_id)}`,R=null;if(c!==void 0)try{let B=await K.request("session.history",{session_id:c});R=Lr(B.messages,g.fork_before_ts)}catch{R=null}let $,f;if(R!==null&&c!==void 0){let B=await Ee("could not branch the session",K.request("session.branch",{session_id:c,through_message_id:R}));$=B.session_id,f=B.stored_session_id}else{let B={source:"desktop",title:D};g.worktree_path!==null&&(B.cwd=g.worktree_path),s.storedId!==null&&(B.parent_session_id=s.storedId);let Q=await Ee("could not create the branch session",K.request("session.create",B));$=Q.session_id,f=Q.stored_session_id}if(g.worktree_path!==null){let B=()=>K.request("session.cwd.set",{session_id:$,cwd:g.worktree_path});try{await Ee("could not attach the isolated workspace",B())}catch(Q){throw Q instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${M(Q)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(await Ee("could not open the rerun session",K.openSession(f,{intent:"tab"})),Or(l.trim(),p,r.model,r.provider)){let B=Hr(l.trim(),p),Q=()=>K.request("config.set",{key:"model",value:B,session_id:$,confirm_expensive_model:!1}),Le=!1,ae=null,Ne="";for(let Oe=0;Oe<2&&!Le;Oe+=1)try{let de=await Q();Le=!0,ae=de.confirm_required===!0?de.confirm_message??null:null}catch(de){Ne=M(de),await new Promise(Ze=>{setTimeout(Ze,wt)})}Le?ae!==null&&K.notify({kind:"info",message:ae,detail:`The rerun started before the switch could be confirmed; ${l.trim()} applies from the next turn.`}):K.notify({kind:"warning",message:`The rerun runs on ${r.model??"the session model"}, not ${l.trim()}.`,detail:Ne})}let ce=A.trim()||g.prompt;await Ee("could not record the branch",wr(e,g.branch_id,{child_session_id:$,child_stored_session_id:f,model:l.trim()||r.model,provider:p??r.provider,prompt:ce,verify_cmd:U.trim()||null})),await Ee("could not start the rerun",K.request("prompt.submit",{session_id:$,text:ce})),a(g.branch_id),o()}catch(s){let c=Rr(s);c.claimReason==="child_already_claimed"&&c.claimedBranchId!==null?le(Er(c.claimedBranchId)):le(c.detail)}finally{ne(null)}}};qe.current=()=>{g===null?_e():He()};let xe=g!==null,Qe=U.trim(),H=[];return xe?(g.fidelity!=="full"&&H.push({warn:!0,text:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}),g.context_rows===null&&H.push({warn:!0,text:"The live transcript prefix is unavailable. The context pack is the only context."}),r.ended_at!==null?H.push({warn:!1,text:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}):H.push({warn:!1,text:We}),g.fork_row_count===0&&r.ended_at===null&&H.push({warn:!1,text:"This is the first turn. The rerun starts a fresh chat in the restored workspace."})):H.push({warn:!1,text:"Prepare reads the recorded context for this turn and drafts the rerun prompt. Nothing runs until you fork."}),_("div",{className:"rw-overlay","data-closing":Xe?"true":"false",onMouseDown:s=>{s.target===s.currentTarget&&Y()},children:[d("style",{children:_t}),_("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title","aria-describedby":"rw-reassure",tabIndex:-1,ref:ue,children:[_("header",{className:"rw-head",children:[d("span",{className:"rw-mark",children:d(T,{name:"rewind",size:16})}),_("div",{className:"rw-heading",children:[d("div",{className:"rw-eyebrow",children:"Session Rewind"}),d("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"})]}),d("button",{type:"button",className:"rw-close",onClick:Y,disabled:q,"aria-label":"Close",children:d(T,{name:"close",size:15})})]}),_("div",{className:"rw-body",children:[_("div",{className:"rw-turn",children:[d("span",{className:"rw-turn-icon",children:d(T,{name:"message",size:12})}),d("span",{className:"rw-turn-time",children:me(t.ts)}),d("span",{className:"rw-turn-text",title:t.preview||"user turn",children:t.preview||"user turn"})]}),X!==null?d("div",{className:"rw-banner rw-banner-error",role:"alert",children:X}):null,xe&&g.worktree_path?_("div",{className:"rw-path",children:[d("span",{className:"rw-path-text",title:g.worktree_path,children:g.worktree_path}),d("button",{type:"button",className:"rw-icon-button",onClick:()=>{e.os.revealPath(g.worktree_path??"")},disabled:q,"aria-label":"Reveal the isolated workspace",children:d(T,{name:"folder",size:13})})]}):null,H.length>0?d("div",{className:"rw-notes",children:H.map(s=>_("div",{className:`rw-note${s.warn?" rw-note-warn":""}`,role:s.warn?"status":void 0,children:[d(T,{name:"info"}),d("span",{children:s.text})]},s.text))}):null,_("div",{className:"rw-grid",children:[_("div",{className:"rw-field",children:[d("span",{className:"rw-label",id:"rw-model-label",children:"Model"}),_("button",{type:"button",ref:se,className:`rw-trigger${k?" rw-trigger-open":""}`,onClick:()=>{x(!k)},disabled:q,"aria-haspopup":"listbox","aria-expanded":k,"aria-labelledby":"rw-model-label rw-model-value",children:[d("span",{className:"rw-trigger-text",id:"rw-model-value",children:oe===""?"Session model":oe}),pe===""?null:d("span",{className:"rw-trigger-provider",children:pe}),d("span",{className:"rw-trigger-caret","aria-hidden":"true","data-open":k,children:d(T,{name:"chevron",size:12})})]}),k?_("div",{className:"rw-picker",ref:re,style:W??void 0,children:[d("input",{className:"rw-search",value:C,onChange:s=>{E(s.target.value)},onKeyDown:s=>{let c=fe[0];s.key==="Enter"&&c!==void 0&&(s.preventDefault(),ke(c.slug,c.models[0]??""))},placeholder:"Search models","aria-label":"Search models",autoFocus:!0}),_("div",{className:"rw-picker-list",role:"listbox","aria-label":"Models",children:[_("button",{type:"button",className:"rw-option rw-option-keep",role:"option","aria-selected":l.trim()==="",onClick:Ye,children:["Keep the session model",r.model===null?null:d("span",{className:"rw-option-sub",children:r.model})]}),fe.map(s=>_("div",{className:"rw-group",role:"group","aria-label":s.name,children:[_("div",{className:"rw-group-head",children:[d("span",{children:s.name}),d("span",{className:"rw-count",children:s.models.length})]}),s.models.map(c=>_("button",{type:"button",className:"rw-option",role:"option","aria-selected":c===l.trim()&&s.slug===p,onClick:()=>{ke(s.slug,c)},children:[d("span",{className:"rw-option-text",children:c}),c===r.model?d("span",{className:"rw-option-tag",children:"session"}):null]},c))]},s.slug)),fe.length===0&&C.trim()!==""?d("button",{type:"button",className:"rw-option",role:"option",onClick:()=>{y(C.trim()),S(null),x(!1),E("")},children:_("span",{className:"rw-option-text",children:["Use \u201C",C.trim(),"\u201D as typed"]})}):null,fe.length===0&&C.trim()===""?d("div",{className:"rw-picker-empty",children:"No configured provider offers a model."}):null]})]}):null,d("span",{className:"rw-help",children:z?"Could not read the model list, so the rerun keeps the session model.":"Lists the providers configured in Hermes."})]}),_("label",{className:"rw-field",children:[d("span",{className:"rw-label",children:"Verify command"}),d("input",{className:"rw-input",value:U,onChange:s=>{b(s.target.value)},placeholder:"python -m pytest -q"}),d("div",{className:"rw-chips",children:(g?.verify_presets.length?g.verify_presets:bt).map(s=>d("button",{type:"button",className:"rw-preset","aria-pressed":s===Qe,onClick:()=>{b(s)},disabled:q,children:s},s))}),d("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),V!==null&&V.command===U.trim()?d("span",{className:"rw-resolved",children:V.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":_(Nt,{children:[d("span",{children:"Resolves to"}),d("span",{className:"rw-resolved-path",title:V.resolved,children:V.resolved})]})}):null]})]}),_("label",{className:"rw-field",children:[_("span",{className:"rw-label-row",children:[d("span",{className:"rw-label",children:"Prompt for the rerun"}),A.length>0?_("span",{className:"rw-count","aria-live":"polite",children:[A.length," chars"]}):null]}),d("textarea",{className:"rw-textarea",value:A,onChange:s=>{ye(s.target.value)},placeholder:"Prepare drafts this from the recorded turn \u2014 or write your own now."})]})]}),_("footer",{className:"rw-footer",children:[_("span",{className:"rw-reassure",id:"rw-reassure",children:[d(T,{name:"lock",size:13}),d("span",{children:"Original session and workspace stay untouched."})]}),_("div",{className:"rw-actions",children:[d("button",{type:"button",className:"rw-button",onClick:Y,disabled:q,children:"Cancel"}),xe?_("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{He()},disabled:q,"aria-busy":F==="run",children:[F==="run"?d("span",{className:"rw-spinner"}):null,F==="run"?"Forking":"Fork & run",F==="run"?null:d("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]}):_("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{_e()},disabled:q,"aria-busy":F==="prepare",children:[F==="prepare"?d("span",{className:"rw-spinner"}):null,F==="prepare"?"Preparing":"Prepare branch",F==="prepare"?null:d("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]})]})]})]})]})}function ar(e,r,t){let o=new Set(r.map(l=>l.id)),a=t.filter(l=>l.session_id===e&&!o.has(l.id));return[...r,...a]}var Ur=`
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
.rp-search-filters {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 6px;
  align-items: center;
  margin-bottom: 8px;
}
.rp-search-filters .rp-search {
  margin-bottom: 0;
}
.rp-filter, .rp-filter-input {
  padding: 5px 6px;
  font: inherit;
  font-size: 11px;
  color: var(--ui-text-primary);
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: calc(var(--radius-scalar, 0.2) * .5rem);
}
.rp-filter:focus, .rp-filter-input:focus {
  outline: none;
  border-color: var(--ui-stroke-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-stroke-primary) 20%, transparent);
}
.rp-filter-input::placeholder {
  color: var(--ui-text-quaternary, var(--ui-text-tertiary));
}
.rp-bookmark-row {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-top: 8px;
}
.rp-bookmark-row .rp-filter-input {
  flex: 1;
}
.rp-bookmarks {
  margin-top: 8px;
  display: grid;
  gap: 4px;
}
.rp-bookmark {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--ui-text-secondary);
}
.rp-bookmark-label {
  font-weight: 600;
  color: var(--ui-text-primary);
}
@media (prefers-reduced-motion: reduce) {
  .rw-page * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
@media (prefers-contrast: more) {
  .rw-page {
    --ui-text-tertiary: var(--ui-text-secondary);
    --ui-stroke-tertiary: var(--ui-stroke-secondary, var(--ui-stroke-primary));
  }
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
.rp-diff {
  margin-top: 12px;
}
.rp-diff-list {
  display: grid;
  gap: 4px;
  margin-top: 8px;
}
.rp-diff-entry {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 11px;
  color: var(--ui-text-secondary);
}
.rp-diff-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
`;import{Fragment as Pt,useEffect as Te,useRef as Rt,useState as ie}from"react";function St(e){let r=e.trim();if(r.length<2)return!1;let t=r[0];return t==="{"&&r.endsWith("}")||t==="["&&r.endsWith("]")}function Ke(e,r=0){if(r>=4)return e;if(Array.isArray(e))return e.map(t=>Ke(t,r+1));if(e!==null&&typeof e=="object"){let t={};for(let[o,a]of Object.entries(e))t[o]=Ke(a,r+1);return t}if(typeof e=="string"&&St(e))try{let t=JSON.parse(e);if(t!==null&&typeof t=="object")return Ke(t,r+1)}catch{}return e}var Ct=/(?<q>"(?:\\.|[^"\\])*")(?<c>\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\][,:]|\s+|./g;function Kr(e){let r=[];for(let t of e.matchAll(Ct)){let o=t[0],a=t.groups?.q,l=t.groups?.c;if(a!==void 0){r.push({text:a,type:l!==void 0?"key":"string"}),l!==void 0&&r.push({text:l,type:"punct"});continue}o==="true"||o==="false"?r.push({text:o,type:"bool"}):o==="null"?r.push({text:o,type:"null"}):/^-?\d/.test(o)?r.push({text:o,type:"number"}):r.push({text:o,type:"punct"})}return r}function Vr(e){return JSON.stringify(Ke(e),null,2)}var ir=new Set(["api_request","llm_call"]);function Gr(e){let r=[],t=new Map;for(let o of e)if(!ir.has(o.kind)){if(o.kind==="tool_call"&&o.tool_call_id!==null){let a={call:o,result:null};r.push(a),t.set(o.tool_call_id,a);continue}if(o.kind==="tool_result"&&o.tool_call_id!==null){let a=t.get(o.tool_call_id);if(a!==void 0){a.result=o;continue}}r.push({call:o,result:null})}return r}import{Fragment as lr,jsx as i,jsxs as m}from"react/jsx-runtime";var Et=new Set(["done","failed","cleaned","discarded"]),Tt="[data-rw-confirm]";function Mt(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(Tt)!==null}function zt(e){return je(Math.max(0,(e.work_ts-e.ts)*1e3))}function Ve({event:e,nested:r=!1,selected:t,onSelect:o}){let a=!r&&e.name!==null;return m("button",{type:"button",className:"rp-event","data-depth":r?"1":"0","aria-current":t?"true":void 0,onClick:o,children:[i("span",{title:e.kind,className:"rp-event-icon",style:{color:Yr(e.kind,e.status)},children:i(T,{name:It(e.kind),size:12})}),i("span",{title:e.kind,className:"rp-event-kind",children:Xr(e.kind)}),m("span",{className:"rp-event-text",title:e.preview!==""?e.preview:void 0,children:[a?i("span",{className:"rp-event-name",children:e.name}):null,e.preview!==""?i("span",{className:"rp-event-preview",children:e.preview}):null]}),e.status==="error"?i("span",{className:"rp-badge","data-tone":"err",children:"error"}):null,i("span",{className:"rp-event-time rp-mono",children:je(e.duration_ms)})]})}function Jr({turn:e,expanded:r,events:t,loading:o,selectedEventId:a,onToggle:l,onFork:y,onSelectEvent:p}){let S=Gr(t??[]),L=(t??[]).filter(w=>ir.has(w.kind)).length;return m("div",{className:"rp-turn",children:[m("div",{className:"rp-turn-bar",children:[m("button",{type:"button",className:"rp-turn-row",onClick:l,"aria-expanded":r,"aria-label":r?`Collapse turn ${e.seq}`:`Expand turn ${e.seq}`,onKeyDown:w=>{if(w.key==="ArrowDown"||w.key==="ArrowUp"){w.preventDefault();let z=Array.from(document.querySelectorAll(".rp-turn-row")),P=z.indexOf(w.currentTarget);P!==-1&&(w.key==="ArrowDown"?z[P+1]:z[P-1])?.focus()}},children:[i("span",{className:"rp-caret","data-open":r?"true":"false",children:i(T,{name:"chevron",size:12})}),i("span",{className:"rp-turn-time rp-mono",children:me(e.ts)}),i("span",{className:"rp-turn-preview",title:e.preview||"User turn",children:e.preview||"User turn"}),i("span",{className:"rp-turn-stat",children:ee(e.tool_calls,"tool")}),e.tool_errors>0?m("span",{className:"rp-badge","data-tone":"err",children:[i("span",{className:"rp-dot"}),ee(e.tool_errors,"error")]}):null,i("span",{className:"rp-turn-duration rp-mono",children:zt(e)})]}),m("button",{type:"button",className:"rp-button rp-button-sm",onClick:y,children:[i(T,{name:"rewind",size:12}),"Rewind"]})]}),r?i("div",{className:"rp-events",children:o?i("div",{className:"rp-aside-note",children:"Loading events..."}):m(lr,{children:[S.map(w=>m(Pt,{children:[i(Ve,{event:w.call,selected:a===w.call.id,onSelect:()=>{p(w.call)}}),w.result!==null?i(Ve,{event:w.result,nested:!0,selected:a===w.result.id,onSelect:()=>{let z=w.result;z!==null&&p(z)}}):null]},w.call.id)),L>0?m("div",{className:"rp-aside-note",children:[ee(e.api_requests,"model request")," \xC3\u201A\xC2\xB7 ",ee(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Xr(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function It(e){return e==="user_turn"?"message":e==="assistant_response"?"reply":e==="tool_call"?"tool":e==="tool_result"?"inbox":e==="api_request"||e==="llm_call"?"zap":e==="compaction"?"layers":"event"}function sr(e){return e==="done"?"ok":e==="failed"?"err":e==="running"?"run":"idle"}function Me({label:e,value:r,mono:t=!0,tone:o="idle"}){let a=o==="idle"?"":` rp-tone-${o}`;return m("span",{className:"rp-stat",children:[i("span",{className:"rp-stat-label",children:e}),i("span",{className:`rp-stat-value${t?" rp-mono":""}${a}`,children:r})]})}function he({label:e,value:r,tone:t="idle"}){return m(lr,{children:[i("span",{className:"rp-metric-label",children:e}),i("span",{className:`rp-metric-value rp-tone-${t}`,children:r})]})}function Yr(e,r){return e==="tool_result"&&r==="error"?"var(--ui-red)":e==="assistant_response"||e==="tool_result"?"var(--ui-green)":e==="user_turn"?"var(--ui-accent)":e==="tool_call"?"var(--ui-purple)":e==="api_request"||e==="llm_call"?"var(--ui-orange)":e==="compaction"?"var(--ui-text-secondary)":"var(--ui-text-tertiary)"}function Qr(e){return e==="ok"?"var(--ui-green)":e==="err"?"var(--ui-red)":e==="warn"?"var(--ui-yellow)":"var(--ui-text-quaternary)"}function Dt(e){return e===null?null:e==="error"?"err":e==="ok"?"ok":"run"}function Lt({text:e,onCopy:r}){let[t,o]=ie(!1);return Te(()=>{if(!t)return;let a=window.setTimeout(()=>{o(!1)},1600);return()=>{window.clearTimeout(a)}},[t]),m("button",{type:"button",className:"rp-button rp-button-sm rp-quiet","aria-label":"Copy payload",onClick:()=>{try{r(e),o(!0)}catch{}},children:[i(T,{name:t?"check":"copy",size:12}),t?"Copied":"Copy"]})}function Zr({ctx:e,sessionId:r,detail:t,onCopy:o}){let[a,l]=ie([]),[y,p]=ie(""),[S,L]=ie(!1);if(Te(()=>{if(r===null){l([]);return}let x=!1;return Nr(e,r).then(W=>{x||l(W)}).catch(()=>{}),()=>{x=!0}},[e,r]),t===null)return m("div",{className:"rp-inspect-empty",children:[i(T,{name:"info",size:14}),i("span",{children:"Select an event to inspect its payload."})]});let w=Vr(t.payload),z=Dt(t.status),P=a.filter(x=>x.event_id===t.id),k=async()=>{let x=y.trim();if(!(x===""||r===null)){L(!0);try{let W=await Sr(e,r,x,t.id);l(J=>[W,...J]),p("")}catch{}finally{L(!1)}}};return m("div",{className:"rp-inspect",children:[m("div",{className:"rp-inspect-head",children:[m("span",{title:t.kind,className:"rp-inspect-kind",style:{color:Yr(t.kind,t.status)},children:[i("span",{className:"rp-dot"}),Xr(t.kind)]}),i("span",{className:"rp-inspect-name",title:t.name??t.kind,children:t.name??t.kind}),z!==null?i("span",{className:"rp-badge","data-tone":z,children:t.status}):null]}),m("div",{className:"rp-inspect-meta",children:[m("span",{className:"rp-mono",children:["#",t.id]}),i("span",{className:"rp-inspect-sep",children:"\xC3\u201A\xC2\xB7"}),m("span",{className:"rp-mono",children:["seq ",t.seq]}),t.duration_ms!==null?m(lr,{children:[i("span",{className:"rp-inspect-sep",children:"\xC3\u201A\xC2\xB7"}),i("span",{className:"rp-mono",title:`${t.duration_ms} ms`,children:je(t.duration_ms)})]}):null]}),m("div",{className:"rp-bookmark-row",children:[i("input",{type:"text",className:"rp-filter-input",placeholder:"Bookmark label","aria-label":"Bookmark label",value:y,disabled:r===null,onChange:x=>{p(x.target.value)},onKeyDown:x=>{x.key==="Enter"&&k()}}),i("button",{type:"button",className:"rp-button rp-button-sm",disabled:S||y.trim()===""||r===null,onClick:()=>{k()},children:S?"Saving...":"Bookmark"})]}),a.length>0?i("div",{className:"rp-bookmarks",children:a.map(x=>m("div",{className:"rp-bookmark",children:[i("span",{className:"rp-bookmark-label",children:x.label}),x.event_id!==null?m("span",{className:"rp-mono",children:["#",x.event_id]}):null,x.event_id===t.id?i("span",{className:"rp-badge","data-tone":"ok",children:"here"}):null]},x.id))}):null,(P.length>0,null),m("div",{className:"rp-json-card",children:[m("div",{className:"rp-json-head",children:[i("span",{className:"rp-json-lang",children:"json"}),i(Lt,{text:w,onCopy:o})]}),i("pre",{className:"rp-json",children:Kr(w).map((x,W)=>i("span",{className:`rp-j-${x.type}`,children:x.text},W))})]})]})}function et({ctx:e,branchId:r,refreshTick:t,onClose:o,onRefresh:a}){let[l,y]=ie(null),[p,S]=ie(null),[L,w]=ie(!1),[z,P]=ie(null),[k,x]=ie(null),W=Rt(null);Te(()=>{let b=!1,g=null,te=async()=>{try{let I=await xr(e,r);if(b)return!0;y(I),P(null);let F=I.branch.child_session_id;if(F!==null){let ne=await br(e,I.branch.parent_session_id,F,I.branch.fork_before_ts);b||S(ne)}else S(null);return Et.has(I.branch.state)}catch(I){return b||P(M(I)),!1}},V=async()=>{let I=await te();!b&&!I&&(g=e.setTimeout(()=>{V()},2500))};return V(),()=>{b=!0,g!==null&&g()}},[e,r,t]);let J=async()=>{w(!0),P(null);try{await yr(e,r),a()}catch(b){P(M(b))}finally{w(!1)}},se=async b=>{w(!0),P(null),x(null);try{await nr(e,r),a()}catch(g){P(M(g)),x(b)}finally{w(!1)}},re=async()=>{w(!0),P(null);try{let b=await _r(e,r);b.uncommitted===0&&(b.orphan_commits??0)===0?(await nr(e,r),a()):x(b)}catch(b){P(M(b))}finally{w(!1)}};if(Te(()=>{x(null)},[r]),Te(()=>{if(k===null)return;let b=g=>{g.key==="Escape"&&Mt()&&x(null)};return window.addEventListener("keydown",b),()=>{window.removeEventListener("keydown",b)}},[k]),Te(()=>{if(k===null)return;let b=document.activeElement;return W.current?.focus(),()=>{b instanceof HTMLElement&&b.focus()}},[k]),l===null)return i("div",{className:"rp-meta",children:"Loading branch..."});let C=l.branch,E=l.run,A=E?.verify_exit??p?.right?.verify_exit??null,ye=C.verify_cmd?C.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",U=C.worktree_path?void 0:"This branch has no workspace left to remove.";return m("div",{className:"rp-stack",children:[m("div",{className:"rp-branch-head",children:[m("div",{className:"rp-branch-title",children:[m("span",{children:["Branch ",Z(C.id)]}),m("span",{className:"rp-badge","data-tone":sr(C.state),children:[i("span",{className:"rp-dot"}),C.state]}),E!==null&&E.verify_exit!==null?m("span",{className:"rp-badge","data-tone":E.verify_exit===0?"ok":"err",children:["verify ",or(E.verify_exit)]}):null]}),m("div",{className:"rp-branch-actions",children:[i("button",{type:"button",className:"rp-button rp-button-sm",title:ye,onClick:()=>{J()},disabled:L||!C.verify_cmd||!C.worktree_path,children:"Verify"}),i("button",{type:"button",className:"rp-button rp-button-sm",title:U,onClick:()=>{re()},disabled:L||!C.worktree_path,children:"Cleanup"}),i("button",{type:"button",className:"rp-button rp-button-sm rp-quiet",onClick:o,children:"Hide"})]})]}),l.shared_child?i("div",{className:"rp-note rp-note-warn",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,z!==null?i("div",{className:"rp-error",children:z}):null,k!==null?m("div",{className:"rp-confirm",ref:W,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[i("div",{className:"rp-confirm-copy",children:Dr(k.uncommitted,k.orphan_commits??0)}),i("div",{className:"rp-confirm-path",children:k.worktree_path}),m("div",{className:"rp-confirm-actions",children:[i("button",{type:"button",className:"rp-button rp-button-sm rp-delete",onClick:()=>{se(k)},disabled:L,children:"Delete workspace"}),i("button",{type:"button",className:"rp-button rp-button-sm",onClick:()=>{x(null)},children:"Cancel"})]})]}):null,p!==null?m("div",{className:"rp-stack",children:[m("div",{className:"rp-compare",children:[m("div",{className:"rp-panel",children:[m("div",{className:"rp-card-label",children:["Original",p.left?.frozen_at?` \xC3\u201A\xC2\xB7 frozen ${me(p.left.frozen_at)}`:""]}),m("div",{className:"rp-metrics",children:[i(he,{label:"outcome",value:p.left===null?"not recorded":Tr(p.left.outcome),tone:p.left===null?"idle":Re(p.left.outcome)}),i(he,{label:"tokens",value:p.left===null?"n/a":be(p.left.tokens_in+p.left.tokens_out)}),i(he,{label:"tool errors",value:p.left===null?"n/a":String(p.left.tool_errors),tone:p.left!==null&&p.left.tool_errors>0?"err":"idle"})]})]}),m("div",{className:"rp-panel",children:[i("div",{className:"rp-card-label rp-card-label-accent",children:"Rerun"}),m("div",{className:"rp-metrics",children:[i(he,{label:"outcome",value:p.right===null?"not recorded":Pe(p.right.outcome),tone:p.right===null?"idle":Re(p.right.outcome)}),i(he,{label:"verify",value:A===null?"not run":or(A),tone:A===null?"idle":A===0?"ok":"err"}),i(he,{label:"tokens",value:p.right===null?"n/a":be(p.right.tokens_in+p.right.tokens_out)}),i(he,{label:"tool errors",value:p.right===null?"n/a":String(p.right.tool_errors),tone:p.right!==null&&p.right.tool_errors>0?"err":"idle"})]})]})]}),m("div",{className:"rp-verdict",children:[i(T,{name:"info",size:13}),m("span",{children:[i("strong",{children:"Verdict"})," ",p.verdict]})]}),p.diff&&p.diff.length>0?m("div",{className:"rp-panel rp-diff",children:[i("div",{className:"rp-card-label",children:"Workspace diff"}),p.diff_stat?i("pre",{className:"rp-pre",children:p.diff_stat}):null,i("div",{className:"rp-diff-list",children:p.diff.map(b=>m("div",{className:"rp-diff-entry",children:[i("span",{className:"rp-diff-path",children:b.path}),m("span",{className:"rp-mono",children:["+",b.additions," -",b.deletions]})]},b.path))})]}):null]}):i("div",{className:"rp-meta",children:C.state==="cleaned"||C.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),E!==null&&E.verify_out?i("pre",{className:"rp-pre",children:E.verify_out}):null,l.prompt!==null?m("details",{className:"rp-panel rp-disclosure",children:[i("summary",{children:"Prompt"}),i("pre",{className:"rp-pre",children:l.prompt})]}):null]})}import{Fragment as tt,jsx as u,jsxs as h}from"react/jsx-runtime";var At="[data-rw-confirm]",nt="hermes-session-rewind:payload-width",ze=292;function Je(e){return Number.isFinite(e)?Math.min(560,Math.max(240,Math.round(e))):ze}function Ft(){try{let e=window.localStorage.getItem(nt);return e===null?ze:Je(Number(e))||ze}catch{return ze}}function Ge(e){try{window.localStorage.setItem(nt,String(e))}catch{}}function qt(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(At)!==null}function ot({ctx:e}){let r=Bt($t.state.activeSessionId),[t,o]=N([]),[a,l]=N(null),[y,p]=N([]),[S,L]=N(!1),[w,z]=N(!1),[P,k]=N(null),[x,W]=N({}),[J,se]=N([]),[re,C]=N([]),[E,A]=N(null),[ye,U]=N(null),[b,g]=N(null),[te,V]=N(null),[I,F]=N(0),[ne,X]=N(null),[le,Xe]=N(0),[Ie,Fe]=N(!1),[q,ue]=N(!1),[qe,Y]=N(null),[De,fe]=N(""),[oe,ge]=N(""),[pe,ke]=N(null),[Ye,ve]=N(!1),[_e,He]=N(""),[xe,Qe]=N(""),[H,s]=N(Ft),[c,D]=N(!1),R=rt(null),$=rt(H);we(()=>{$.current=H},[H]),we(()=>{let n=null,v=e.onEvent("*",()=>{n===null&&(n=e.setTimeout(()=>{n=null,Xe(G=>G+1)},1500))});return()=>{v(),n!==null&&n()}},[e]),we(()=>{if(b===null||te!==null)return;let n=v=>{v.key==="Escape"&&!qt()&&g(null)};return window.addEventListener("keydown",n),()=>{window.removeEventListener("keydown",n)}},[b,te]),we(()=>{let n=!1,v=async()=>{try{let O=await cr(e);if(n)return;o(O),Fe(!0),X(null),l($e=>$e!==null&&O.some(er=>er.session_id===$e)?$e:r??O[0]?.session_id??null)}catch(O){n||X(M(O))}};v();let G=e.setInterval(()=>{v()},1e4);return()=>{n=!0,G()}},[e,r,I,le]),we(()=>{if(a===null){p([]),ue(!1),L(!1),Y(null),se([]),C([]);return}let n=!1,v=async()=>{try{let[O,$e,er]=await Promise.all([tr(e,a),gr(e,a),vr(e,a)]);if(n)return;p(st=>ar(a,O.items,st)),L(O.has_more),ue(!0),se($e),C(er),Y(null),X(null)}catch(O){n||(ue(!0),Y(M(O)))}};v();let G=e.setInterval(()=>{v()},1e4);return()=>{n=!0,G()}},[e,a,I,le]),we(()=>{if(E===null){U(null);return}let n=!1;return mr(e,E).then(v=>{n||U(v)}).catch(v=>{n||X(M(v))}),()=>{n=!0}},[e,E]),we(()=>{let n=oe.trim();if(n.length<2||a===null){ke(null),ve(!1);return}let v=!1;ve(!0);let G=e.setTimeout(()=>{fr(e,a,n,30,_e||null,xe||null).then(O=>{v||(ke(O.items),ve(!1))}).catch(O=>{v||(ve(!1),X(M(O)))})},200);return()=>{v=!0,G()}},[e,oe,_e,xe,a]);let f=t.find(n=>n.session_id===a)??null,ce=De.trim().toLowerCase(),B=ce===""?t:t.filter(n=>`${n.title??""} ${n.model??""} ${n.session_id}`.toLowerCase().includes(ce)),Q=f!==null&&f.ended_at===null,Le=Q&&f.session_id===r,ae=a===null?[]:y.filter(n=>n.session_id===a),Ne=oe.trim().length>=2,Oe=n=>{l(n.session_id),A(null),g(null),k(null),W({}),p([]),ue(!1),L(!1),Y(null),se([]),C([]),ge(""),ke(null)},de=()=>{F(n=>n+1)},Ze=n=>{if(P===n.id){k(null);return}k(n.id),x[n.id]===void 0&&dr(e,n.session_id,n.seq,n.seq_to).then(v=>{W(G=>({...G,[n.id]:v}))}).catch(v=>{X(M(v))})},it=async()=>{let n=ae[ae.length-1];if(!(a===null||n===void 0)){z(!0);try{let v=await tr(e,a,n.seq);p(G=>ar(a,v.items,G)),L(v.has_more)}catch(v){X(M(v))}finally{z(!1)}}};return h("div",{className:"rw-page rp-shell",children:[u("style",{children:Ur}),h("header",{className:"rp-head",children:[h("div",{className:"rp-head-left",children:[u("span",{className:"rp-mark",children:u(T,{name:"rewind",size:16})}),h("div",{children:[u("div",{className:"rp-title",children:"Session Rewind"}),u("div",{className:"rp-sub",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]})]}),h("div",{className:"rp-head-right",children:[f!==null?u("span",{className:"rp-pill rp-mono",title:f.model??void 0,children:f.model??"unknown model"}):null,Q?h("span",{className:"rp-live",children:[u("span",{className:"rp-dot"}),Le?"live":"running"]}):null,h("button",{type:"button",className:"rp-button",onClick:de,children:[u(T,{name:"refresh",size:13}),"Refresh"]})]})]}),ne!==null?u("div",{className:"rp-error",children:ne}):null,h("div",{className:"rp-columns",children:[h("aside",{className:"rp-side",children:[h("div",{className:"rp-eyebrow",children:[u("span",{className:"rp-dot"}),"Sessions",Ie?u("span",{className:"rp-eyebrow-count",children:Mr(B.length,rr)}):null]}),Ie&&t.length>0?u("input",{type:"text",className:"rp-search",placeholder:"Filter sessions...","aria-label":"Filter sessions",value:De,onChange:n=>{fe(n.target.value)},onKeyDown:n=>{n.key==="Escape"&&De!==""&&(fe(""),n.preventDefault(),n.stopPropagation())}}):null,Ie?t.length===0?h("div",{className:"rp-meta rp-empty",children:[u(T,{name:"info",size:13}),"Start a chat and Rewind will record every turn."]}):B.length===0?u("div",{className:"rp-meta",children:"No session matches the filter."}):u("div",{className:"rp-cards",children:B.map(n=>h("button",{type:"button",className:"rp-session","aria-current":a===n.session_id?"true":void 0,onClick:()=>{Oe(n)},children:[h("span",{className:"rp-session-title",children:[u("span",{className:"rp-dot",style:{color:Qr(Re(n.outcome))}}),u("span",{title:n.title??Z(n.session_id),children:n.title??Z(n.session_id)}),u("span",{className:"rp-session-when",children:n.last_event_at!==null?Cr(n.last_event_at):""})]}),h("span",{className:"rp-meta",children:[n.model??"unknown model"," \xC3\u201A\xC2\xB7 ",ee(n.event_count,"event")]}),h("span",{className:"rp-meta rp-meta-dim",children:[Pe(n.outcome)," \xC3\u201A\xC2\xB7"," ",be(n.tokens_in+n.tokens_out)," tokens"]})]},n.session_id))}):u("div",{className:"rp-meta",children:"Loading sessions..."})]}),h("main",{className:"rp-main",children:[f!==null?h("div",{className:"rp-detail-head",children:[h("div",{className:"rp-stack",style:{gap:5},children:[u("div",{className:"rp-detail-title",children:f.title??Z(f.session_id)}),h("div",{className:"rp-stats",children:[J.length>0?u(Me,{label:"snapshot",value:String(J.length)}):null,u(Me,{label:"events",value:be(f.event_count)}),u(Me,{label:"tokens",value:be(f.tokens_in+f.tokens_out)}),f.ended_at!==null?u(Me,{label:"window",value:`${me(f.started_at)} - ${me(f.ended_at)}`}):null,u(Me,{label:"outcome",value:Pe(f.outcome),mono:!1,tone:Re(f.outcome)})]}),h("div",{className:"rp-meta",children:[f.model??"unknown model",f.ended_at===null?u("span",{title:We,children:` \xC3\u201A\xC2\xB7 ${zr(f.last_event_at)}`}):""]})]}),u("div",{className:"rp-hint",children:"Select a user turn and choose Rewind."})]}):null,re.length>0?h("div",{children:[h("div",{className:"rp-eyebrow",children:[u("span",{className:"rp-dot"}),"Branches",u("span",{className:"rp-eyebrow-count",children:re.length})]}),u("div",{className:"rp-chips",children:re.map(n=>h("button",{type:"button",className:"rp-chip","aria-current":b===n.id?"true":void 0,onClick:()=>{g(n.id)},children:[u("span",{className:"rp-mono",children:Z(n.id)}),h("span",{className:"rp-badge","data-tone":sr(n.state),children:[u("span",{className:"rp-dot"}),n.state]}),u("span",{className:"rp-chip-note",children:n.fork_row_count>0?ee(n.fork_row_count,"message"):"context pack"})]},n.id))})]}):null,h("div",{className:"rp-columns",style:{gap:0,"--rp-payload-width":`${H}px`},children:[u("div",{className:"rp-turns",children:h("div",{className:"rp-stack",style:{width:"100%"},children:[h("div",{className:"rp-eyebrow",children:[u("span",{className:"rp-dot"}),Ne?"Search results":"Turns",Ne&&pe!==null?u("span",{className:"rp-eyebrow-count",children:pe.length}):null]}),f===null?u("div",{className:"rp-meta",children:"Select a recorded session."}):h(tt,{children:[h("div",{className:"rp-search-filters",role:"search","aria-label":"Event search",children:[u("input",{type:"text",role:"searchbox",className:"rp-search",placeholder:"Search events...","aria-label":"Search events","aria-describedby":"rp-search-kind-note",value:oe,onChange:n=>{ge(n.target.value)},onKeyDown:n=>{n.key==="Escape"&&oe!==""&&(ge(""),n.preventDefault(),n.stopPropagation())}}),h("select",{className:"rp-filter","aria-label":"Event kind",value:_e,onChange:n=>{He(n.target.value)},children:[u("option",{value:"",children:"all kinds"}),u("option",{value:"user_turn",children:"user_turn"}),u("option",{value:"tool_call",children:"tool_call"}),u("option",{value:"tool_result",children:"tool_result"}),u("option",{value:"llm_call",children:"llm_call"}),u("option",{value:"api_request",children:"api_request"}),u("option",{value:"turn_end",children:"turn_end"})]}),u("input",{type:"text",className:"rp-filter-input",placeholder:"tool name","aria-label":"Tool name",value:xe,onChange:n=>{Qe(n.target.value)}})]}),u("span",{id:"rp-search-kind-note",className:"rp-meta",style:{display:"none"},children:"Kind and tool filters narrow the search."}),Ne?Ye?u("div",{className:"rp-meta",children:"Searching..."}):pe===null||pe.length===0?h("div",{className:"rp-meta",children:["No event matches \xC3\xA2\xE2\u201A\xAC\xC5\u201C",oe.trim(),"\xC3\xA2\xE2\u201A\xAC\xC2\x9D."]}):u("div",{className:"rp-events rp-search-results",children:pe.map(n=>u(Ve,{event:n,selected:E===n.id,onSelect:()=>{A(n.id)}},n.id))}):q?ae.length===0?u("div",{className:"rp-meta",children:Ir(f.event_count,qe)}):h(tt,{children:[ae.map(n=>u(Jr,{turn:n,expanded:P===n.id,events:x[n.id]??null,loading:P===n.id&&x[n.id]===void 0,selectedEventId:E,onToggle:()=>{Ze(n)},onFork:()=>{f!==null&&V({session:f,event:n})},onSelectEvent:v=>{A(v.id)}},n.id)),S?u("button",{type:"button",className:"rp-load-more",onClick:()=>{it()},disabled:w,children:w?"Loading...":"Load earlier turns"}):h("div",{className:"rp-tail",children:[ee(ae.length,"turn")," \xC3\u201A\xC2\xB7 start of the recording"]})]}):u("div",{className:"rp-meta",children:"Loading turns..."})]})]})}),u("div",{role:"separator","aria-orientation":"vertical","aria-label":"Resize event payload panel",tabIndex:0,className:"rp-divider","data-dragging":c?"true":void 0,onPointerDown:n=>{R.current={startX:n.clientX,startWidth:H},D(!0),n.currentTarget.setPointerCapture(n.pointerId)},onPointerMove:n=>{let v=R.current;v!==null&&s(Je(v.startWidth-(n.clientX-v.startX)))},onPointerUp:n=>{R.current!==null&&(R.current=null,D(!1),Ge($.current),n.currentTarget.hasPointerCapture(n.pointerId)&&n.currentTarget.releasePointerCapture(n.pointerId))},onPointerCancel:n=>{R.current!==null&&(R.current=null,D(!1),n.currentTarget.hasPointerCapture(n.pointerId)&&n.currentTarget.releasePointerCapture(n.pointerId))},onKeyDown:n=>{if(n.key==="ArrowLeft"){let v=Je($.current+16);s(v),Ge(v),n.preventDefault()}else if(n.key==="ArrowRight"){let v=Je($.current-16);s(v),Ge(v),n.preventDefault()}},onDoubleClick:()=>{s(ze),Ge(ze)}}),h("div",{className:"rp-payload",children:[h("div",{className:"rp-eyebrow",children:[u("span",{className:"rp-dot"}),"Event payload"]}),u(Zr,{ctx:e,sessionId:a,detail:ye,onCopy:n=>{e.os.writeClipboard(n)}})]})]})]})]}),b!==null?u("div",{className:"rp-compare-wrap",children:u(et,{ctx:e,branchId:b,refreshTick:I,onClose:()=>{g(null)},onRefresh:de})}):null,te!==null?u(Wr,{ctx:e,session:te.session,event:te.event,onClose:()=>{V(null)},onCreated:n=>{g(n),de()}}):null]})}import{jsx as at}from"react/jsx-runtime";var Vt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let r=()=>{Ht.navigate(Se)};e.registerMany([{id:"page",area:Wt,data:{path:Se},render:()=>at(ot,{ctx:e})},{id:"nav",area:Ut,data:{path:Se,label:"Rewind",codicon:"history"}},{id:"palette-open",area:jt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:r}},{id:"keybind-open",area:Ot,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:r}},{id:"chip",area:Kt.right,order:130,render:()=>at(pr,{})}])}},On=Vt;export{On as default};
