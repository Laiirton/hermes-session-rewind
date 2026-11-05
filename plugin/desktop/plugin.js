import{host as Tt,KEYBINDS_AREA as Et,PALETTE_AREA as It,ROUTES_AREA as Mt,SIDEBAR_NAV_AREA as $t,STATUSBAR_AREAS as Lt}from"@hermes/plugin-sdk";import{host as Re,useValue as rt}from"@hermes/plugin-sdk";var oe="/rewind";import{jsx as nt,jsxs as ot}from"react/jsx-runtime";function Ce(){let e=rt(Re.state.activeSessionId);return ot("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{Re.navigate(oe)},title:"Open Session Rewind",children:[nt("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as vt,useValue as bt}from"@hermes/plugin-sdk";import{useEffect as K,useRef as wt,useState as b}from"react";function ie(e,t,s){return e.rest(t,{method:"POST",body:s})}var ye=100;async function Pe(e){return(await e.rest(`/sessions?limit=${ye}`)).items}async function he(e,t,s=null){let m=s===null?"":`&before_seq=${s}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${m}`)}async function Te(e,t,s,m){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${s-1}&before_seq=${m+1}`)).items}function Ee(e,t){return e.rest(`/events/${t}`)}function Ie(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function Me(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function $e(e,t){return ie(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function Le(e,t,s,m=null){let u=m===null?"":`&before_ts=${m}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(s)}${u}`)}function De(e,t){return ie(e,"/forks/prepare",t)}function Fe(e,t,s){return ie(e,`/forks/${encodeURIComponent(t)}/commit`,s)}function ze(e,t){return ie(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Ae(e,t,s){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(s)}`)}function Be(e,t){return e.rest(`/forks/${encodeURIComponent(t)}/workspace`)}function _e(e,t){return ie(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function le(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ue(e){return e.toLocaleString()}function me(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var st=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function T(e){let t=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",s=st.exec(t),m=s?.[1];if(s===null||m===void 0)return t;let u=at(m);return u===void 0?t:t.replace(s[0],u)}function at(e){try{let t=JSON.parse(e);return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}catch{return}}function J(e,t=8){return e.length<=t?e:e.slice(0,t)}function M(e,t){return`${e} ${e===1?t:`${t}s`}`}function ke(e){return e===0?"passed":`failed (exit ${e})`}var it={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function fe(e){return e===null?"recording":it[e]??e}function qe(e){return e===null?"open at freeze":fe(e)}function He(e,t){return e===0?"":e>=t?`${t}+`:`${e}`}function lt(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Oe(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${lt(e)}`}function Ve(e,t){return t!==null?`The turns could not be loaded: ${t}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${M(e,"event")} but no user turn.`}function Ue(e){return e===null?"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.":`This workspace holds ${M(e,"uncommitted file")}. Deleting it removes them for good; the rerun conversation stays in the recording.`}import{host as V}from"@hermes/plugin-sdk";import{useCallback as dt,useEffect as ge,useRef as Ne,useState as U}from"react";function ut(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(s=>{if(typeof s!="object"||s===null||!("text"in s))return"";let m=s.text;return typeof m=="string"?m:""}).join("").trim():""}function We(e,t){let s=(e??[]).filter(d=>(d.role==="user"||d.role==="assistant")&&ut(d).length>0&&typeof d.row_id=="number"),m=-1;for(let d=0;d<s.length;d+=1){let L=s[d];if(L===void 0)continue;let p=L.timestamp;L.role==="user"&&typeof p=="number"&&p<=t+.5&&(m=d)}if(m<=0)return null;let u=s[m-1]?.row_id;return typeof u=="number"&&u>0?u:null}import{jsx as o,jsxs as g}from"react/jsx-runtime";var ct=["python -m pytest -q","npm test","cargo test","go test ./..."],pt=350;function de(e,t){return t.catch(s=>{throw new Error(`${e}: ${T(s)}`)})}function mt(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(s=>!s.hasAttribute("disabled"))}function ft(e,t){let s=mt(e),m=s[0],u=s[s.length-1];if(e===null||m===void 0||u===void 0)return;let d=document.activeElement;if(!e.contains(d)){t.preventDefault(),m.focus();return}t.shiftKey&&d===m?(t.preventDefault(),u.focus()):!t.shiftKey&&d===u&&(t.preventDefault(),m.focus())}var gt={rewind:"M3 12a9 9 0 1 0 3-6.7M3 4v5h5",branch:"M6 3v12M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM18 9a3 3 0 1 0-3-3M15 9v3a3 3 0 0 0 3 3h3",lock:"M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z",folder:"M3 7h6l2 2h10v11H3z",close:"M5 5l14 14M19 5L5 19",dot:"M12 12h.01"};function W({name:e,size:t=14}){return o("svg",{"aria-hidden":"true",className:"rw-icon",viewBox:"0 0 24 24",width:t,height:t,fill:"none",stroke:"currentColor",strokeWidth:1.75,strokeLinecap:"round",strokeLinejoin:"round",focusable:"false",children:o("path",{d:gt[e]})})}var xt=`
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
.rw-note .rw-icon {
  flex: none;
  margin-top: 2px;
  color: var(--ui-accent);
}
.rw-note-warn {
  color: var(--ui-yellow);
}
.rw-note-warn .rw-icon {
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
`;function Ke({ctx:e,session:t,event:s,onClose:m,onCreated:u}){let[d,L]=U(t.model??""),[p,F]=U(""),[y,w]=U(""),[c,E]=U(null),[N,I]=U(null),[P,q]=U(null),[j,z]=U(null),[h,_]=U(null),[Z,se]=U(!1),Q=Ne([]),l=P!==null,S=Ne(null),A=Ne(()=>{}),D=dt(()=>{l||(se(!0),Q.current.push(e.setTimeout(m,100)))},[l,e,m]);ge(()=>{let i=Q.current;return()=>{for(let x of i)x()}},[]),ge(()=>{let i=document.activeElement;return S.current?.focus(),()=>{i?.focus()}},[]),ge(()=>{let i=x=>{if(x.key==="Escape"&&!l){D();return}if(x.key==="Tab"){ft(S.current,x);return}x.key==="Enter"&&(x.metaKey||x.ctrlKey)&&!l&&(x.preventDefault(),A.current())};return window.addEventListener("keydown",i),()=>{window.removeEventListener("keydown",i)}},[l,D]),ge(()=>{let i=y.trim();if(c===null||i===""){I(null);return}let x=!1,$=e.setTimeout(()=>{Ae(e,c.branch_id,i).then(f=>{x||I(f)}).catch(()=>{x||I(null)})},pt);return()=>{x=!0,$()}},[e,c,y]);let C=async()=>{let i=await V.request("session.active_list",{}),x=Array.isArray(i.sessions)?i.sessions:[],$=x.find(f=>f.session_key===t.session_id)?.id??x.find(f=>f.id===t.session_id)?.id;if($===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let f=await V.request("session.title",{session_id:$});return{runtimeId:$,storedId:f.session_key??t.stored_session_id}}catch{return{runtimeId:$,storedId:t.stored_session_id}}},X=async()=>{q("prepare"),z(null),_(null);try{let i=await C(),x=await De(e,{session_id:t.session_id,stored_session_id:i.storedId,event_id:s.id,model:d.trim()||null,provider:null,prompt:p.trim()||null,verify_cmd:y.trim()||null});E(x),F(x.prompt),x.verify_presets.length>0&&y.trim()===""&&w(x.verify_presets[0]??""),x.model!==null&&L(x.model)}catch(i){z(T(i))}finally{q(null)}},ee=async()=>{if(c!==null){q("run"),z(null),_(null);try{let i=await C(),x=i.runtimeId,$=`\u21BA ${t.title??J(t.session_id)} \xB7 ${J(c.branch_id)}`,f=null;if(x!==void 0)try{let R=await V.request("session.history",{session_id:x});f=We(R.messages,c.fork_before_ts)}catch{f=null}let H,ne,Y=!1;if(f!==null&&x!==void 0){let R=await de("could not branch the session",V.request("session.branch",{session_id:x,through_message_id:f}));H=R.session_id,ne=R.stored_session_id}else{let R={source:"desktop",title:$};c.worktree_path!==null&&(R.cwd=c.worktree_path),i.storedId!==null&&(R.parent_session_id=i.storedId);let te=await de("could not create the branch session",V.request("session.create",R));H=te.session_id,ne=te.stored_session_id,Y=!0}if(Y&&c.worktree_path!==null){let R=()=>V.request("session.cwd.set",{session_id:H,cwd:c.worktree_path});try{await de("could not attach the isolated workspace",R())}catch(te){throw te instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${T(te)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(d.trim()&&d.trim()!==(t.model??""))try{let R=await V.request("config.set",{key:"model",value:d.trim(),session_id:H,confirm_expensive_model:!1});R.confirm_required===!0&&_(R.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{_("The branch was created, but the model switch failed; the rerun uses the current model.")}let pe=p.trim()||c.prompt;await de("could not record the branch",Fe(e,c.branch_id,{child_session_id:H,child_stored_session_id:ne,model:d.trim()||null,provider:null,prompt:pe,verify_cmd:y.trim()||null})),await de("could not start the rerun",V.request("prompt.submit",{session_id:H,text:pe})),u(c.branch_id),V.openSession(ne,{intent:"tab"}),m()}catch(i){z(T(i))}finally{q(null)}}};A.current=()=>{c===null?X():ee()};let k=c!==null,G=k?c.fidelity==="full"?"ok":"warn":"idle",xe=`rw-badge ${G==="ok"?"rw-badge-ok":G==="warn"?"rw-badge-warn":""}`,ce=k?c.fork_row_count>0?`${M(c.fork_row_count,"message")}`:"context pack":"\u2014",ve=k?c.worktree_path?"git worktree":"shared workspace":"\u2014",be=y.trim();return g("div",{className:"rw-overlay","data-closing":Z?"true":"false",onMouseDown:i=>{i.target===i.currentTarget&&D()},children:[o("style",{children:xt}),g("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title","aria-describedby":"rw-reassure",tabIndex:-1,ref:S,children:[g("header",{className:"rw-head",children:[o("span",{className:"rw-mark",children:o(W,{name:"rewind",size:16})}),g("div",{className:"rw-heading",children:[o("div",{className:"rw-eyebrow",children:"Session Rewind"}),o("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"})]}),o("button",{type:"button",className:"rw-close",onClick:D,disabled:l,"aria-label":"Close",children:o(W,{name:"close",size:15})})]}),g("div",{className:"rw-body",children:[g("div",{className:"rw-turn",children:[o("span",{className:"rw-turn-time",children:le(s.ts)}),o("span",{className:"rw-turn-text",children:s.preview||"user turn"})]}),j!==null?o("div",{className:"rw-banner rw-banner-error",role:"alert",children:j}):null,h!==null?o("div",{className:"rw-banner rw-banner-warn",role:"status",children:h}):null,g("section",{className:"rw-card",children:[g("div",{className:"rw-card-head",children:[g("span",{className:"rw-card-title",children:[o("span",{className:"rw-state-dot","data-tone":G==="idle"?void 0:G}),"Checkpoint"]}),o("span",{className:xe,children:k?G==="ok"?"workspace ready":"context pack":"not prepared"})]}),g("ul",{className:"rw-stats",children:[g("li",{className:"rw-stat",children:[o("span",{className:"rw-stat-label",children:"carries"}),o("span",{className:"rw-stat-value",children:ce})]}),g("li",{className:"rw-stat",children:[o("span",{className:"rw-stat-label",children:"verify timeout"}),o("span",{className:"rw-stat-value",children:k?`${c.verify_timeout_seconds}s`:"\u2014"})]}),g("li",{className:"rw-stat",children:[o("span",{className:"rw-stat-label",children:"isolation"}),o("span",{className:"rw-stat-value",children:ve})]})]}),k&&c.worktree_path?g("div",{className:"rw-path",children:[o("span",{className:"rw-path-text",title:c.worktree_path,children:c.worktree_path}),o("button",{type:"button",className:"rw-icon-button",onClick:()=>{e.os.revealPath(c.worktree_path??"")},disabled:l,"aria-label":"Reveal the isolated workspace",children:o(W,{name:"folder",size:13})}),c.snapshot_commit?g("span",{className:"rw-count",children:["snapshot ",c.snapshot_commit.slice(0,8)]}):null]}):g("div",{className:"rw-note",children:[o(W,{name:"branch"}),o("span",{children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."})]}),k&&c.fidelity!=="full"?g("div",{className:"rw-note rw-note-warn",children:[o(W,{name:"branch"}),o("span",{children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."})]}):null,k&&c.context_rows===null?g("div",{className:"rw-note rw-note-warn",children:[o(W,{name:"branch"}),o("span",{children:"The live transcript prefix is unavailable. The context pack is the only context."})]}):null,k&&t.ended_at!==null?g("div",{className:"rw-note",children:[o(W,{name:"branch"}),o("span",{children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."})]}):null,k&&c.fork_row_count===0&&t.ended_at===null?g("div",{className:"rw-note",children:[o(W,{name:"branch"}),o("span",{children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."})]}):null]}),g("div",{className:"rw-grid",children:[g("label",{className:"rw-field",children:[o("span",{className:"rw-label",children:"Model"}),o("input",{className:"rw-input",value:d,onChange:i=>{L(i.target.value)},placeholder:"provider/model"}),o("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),g("label",{className:"rw-field",children:[o("span",{className:"rw-label",children:"Verify command"}),o("input",{className:"rw-input",value:y,onChange:i=>{w(i.target.value)},placeholder:"python -m pytest -q"}),o("div",{className:"rw-chips",children:(c?.verify_presets.length?c.verify_presets:ct).map(i=>o("button",{type:"button",className:"rw-preset","aria-pressed":i===be,onClick:()=>{w(i)},disabled:l,children:i},i))}),o("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),N!==null&&N.command===y.trim()?o("span",{className:"rw-resolved",children:N.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${N.resolved}`}):null]})]}),g("label",{className:"rw-field",children:[g("span",{className:"rw-label-row",children:[o("span",{className:"rw-label",children:"Prompt for the rerun"}),g("span",{className:"rw-count","aria-live":"polite",children:[p.length," chars"]})]}),o("textarea",{className:"rw-textarea",value:p,onChange:i=>{F(i.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),o("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),g("footer",{className:"rw-footer",children:[g("span",{className:"rw-reassure",id:"rw-reassure",children:[o(W,{name:"lock",size:13}),o("span",{children:"Original session and workspace stay untouched."})]}),g("div",{className:"rw-actions",children:[o("button",{type:"button",className:"rw-button",onClick:D,disabled:l,children:"Cancel"}),k?g("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{ee()},disabled:l,"aria-busy":P==="run",children:[P==="run"?o("span",{className:"rw-spinner"}):null,P==="run"?"Forking":"Fork & run",P==="run"?null:o("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]}):g("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{X()},disabled:l,"aria-busy":P==="prepare",children:[P==="prepare"?o("span",{className:"rw-spinner"}):null,P==="prepare"?"Preparing":"Prepare branch",P==="prepare"?null:o("span",{className:"rw-kbd",children:"Ctrl \u21B5"})]})]})]})]})]})}function Se(e,t,s){let m=new Set(t.map(d=>d.id)),u=s.filter(d=>d.session_id===e&&!m.has(d.id));return[...t,...u]}import{Fragment as Qe,jsx as r,jsxs as a}from"react/jsx-runtime";var yt="[data-rw-confirm]";function je(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(yt)!==null}var ht=`
.rw-page :is(button, input, textarea, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--ui-accent, #4f8cff);
  outline-offset: 1px;
}
.rw-page button:not(:disabled) {
  cursor: pointer;
}
.rw-note-warn {
  background: color-mix(in srgb, var(--ui-yellow) 8%, transparent);
  border-color: color-mix(in srgb, var(--ui-yellow) 30%, transparent);
}
.rw-confirm {
  background: color-mix(in srgb, var(--ui-red) 8%, transparent);
  border-color: color-mix(in srgb, var(--ui-red) 32%, transparent);
}
.rw-confirm-delete {
  color: var(--ui-red);
  border-color: color-mix(in srgb, var(--ui-red) 45%, transparent);
}
.rw-page button:disabled {
  cursor: not-allowed;
}
`,_t=new Set(["done","failed","cleaned","discarded"]);function kt(e){return me(Math.max(0,(e.work_ts-e.ts)*1e3))}function Nt({event:e,selected:t,onSelect:s}){return a("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:s,children:[r("span",{title:e.kind,className:`w-20 shrink-0 truncate uppercase ${Ye(e.kind,e.status)}`,children:Ge(e.kind)}),r("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),r("span",{className:"w-14 shrink-0 text-right font-mono",children:me(e.duration_ms)})]})}var St=new Set(["api_request","llm_call"]);function Rt({turn:e,expanded:t,events:s,loading:m,selectedEventId:u,onToggle:d,onFork:L,onSelectEvent:p}){let F=(s??[]).filter(w=>!St.has(w.kind)),y=(s??[]).length-F.length;return a("div",{className:"border-b border-(--ui-stroke-tertiary) pb-1",children:[a("div",{className:"flex items-center gap-2",children:[a("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:d,"aria-expanded":t,children:[r("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),r("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:le(e.ts)}),r("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),r("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:M(e.tool_calls,"tool")}),e.tool_errors>0?r("span",{className:"shrink-0 text-xs text-(--ui-red)",children:M(e.tool_errors,"error")}):null,r("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:kt(e)})]}),r("button",{type:"button",className:"shrink-0 rounded border border-(--ui-stroke-secondary) px-2 py-0.5 text-xs",onClick:L,children:"Rewind"})]}),t?r("div",{className:"flex flex-col gap-0.5 pb-1",children:m?r("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):a(Qe,{children:[F.map(w=>r(Nt,{event:w,selected:u===w.id,onSelect:()=>{p(w)}},w.id)),y>0?a("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[M(e.api_requests,"model request")," \xB7",M(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Ge(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function Ye(e,t){return e==="tool_result"&&t==="error"?"text-(--ui-red)":e==="assistant_response"||e==="tool_result"?"text-(--ui-green)":e==="user_turn"?"text-(--ui-accent)":e==="tool_call"?"text-(--ui-purple)":e==="api_request"||e==="llm_call"?"text-(--ui-orange)":e==="compaction"?"text-(--ui-text-secondary)":"text-(--ui-text-tertiary)"}function Je(e){return e==="done"?"text-(--ui-green)":e==="failed"?"text-(--ui-red)":e==="running"?"text-(--ui-accent)":"text-(--ui-text-tertiary)"}function re({label:e,value:t}){return a("div",{className:"flex items-center justify-between gap-2",children:[r("span",{className:"text-(--ui-text-tertiary)",children:e}),r("span",{className:"font-mono tabular-nums",children:t})]})}function Ct({detail:e}){return e===null?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):a("div",{className:"flex flex-col gap-2",children:[a("div",{className:"flex items-center justify-between gap-2 text-xs",children:[r("span",{className:`font-medium ${Ye(e.kind,e.status)}`,children:Ge(e.kind)}),a("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),a("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${me(e.duration_ms)}`:""]}),r("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-stroke-tertiary) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function Pt({ctx:e,branchId:t,refreshTick:s,onClose:m,onRefresh:u}){let[d,L]=b(null),[p,F]=b(null),[y,w]=b(!1),[c,E]=b(null),[N,I]=b(null),P=wt(null);K(()=>{let l=!1,S=null,A=async()=>{try{let C=await $e(e,t);if(l)return!0;L(C),E(null);let X=C.branch.child_session_id;if(X!==null){let ee=await Le(e,C.branch.parent_session_id,X,C.branch.fork_before_ts);l||F(ee)}else F(null);return _t.has(C.branch.state)}catch(C){return l||E(T(C)),!1}},D=async()=>{let C=await A();!l&&!C&&(S=e.setTimeout(()=>{D()},2500))};return D(),()=>{l=!0,S!==null&&S()}},[e,t,s]);let q=async()=>{w(!0),E(null);try{await ze(e,t),u()}catch(l){E(T(l))}finally{w(!1)}},j=async l=>{w(!0),E(null),I(null);try{await _e(e,t),u()}catch(S){E(T(S)),I(l)}finally{w(!1)}},z=async()=>{w(!0),E(null);try{let l=await Be(e,t);l.uncommitted===0?(await _e(e,t),u()):I(l)}catch(l){E(T(l))}finally{w(!1)}};if(K(()=>{I(null)},[t]),K(()=>{if(N===null)return;let l=S=>{S.key==="Escape"&&je()&&I(null)};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[N]),K(()=>{if(N===null)return;let l=document.activeElement;return P.current?.focus(),()=>{l instanceof HTMLElement&&l.focus()}},[N]),d===null)return r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let h=d.branch,_=d.run,Z=_?.verify_exit??p?.right?.verify_exit??null,se=h.verify_cmd?h.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",Q=h.worktree_path?void 0:"This branch has no workspace left to remove.";return a("div",{className:"flex flex-col gap-2",children:[a("div",{className:"flex items-center justify-between gap-2",children:[a("div",{className:"flex items-center gap-2 text-xs",children:[a("span",{className:"font-medium",children:["Branch ",J(h.id)]}),r("span",{className:`uppercase ${Je(h.state)}`,children:h.state}),_!==null&&_.verify_exit!==null?a("span",{className:_.verify_exit===0?"text-(--ui-green)":"text-(--ui-red)",children:["verify ",ke(_.verify_exit)]}):null]}),a("div",{className:"flex items-center gap-2 text-xs",children:[r("button",{type:"button",className:"rounded border border-(--ui-stroke-secondary) px-2 py-1 disabled:opacity-50",title:se,onClick:()=>{q()},disabled:y||!h.verify_cmd||!h.worktree_path,children:"Verify"}),r("button",{type:"button",className:"rounded border border-(--ui-stroke-secondary) px-2 py-1 disabled:opacity-50",title:Q,onClick:()=>{z()},disabled:y||!h.worktree_path,children:"Cleanup"}),r("button",{type:"button",className:"rounded border border-(--ui-stroke-secondary) px-2 py-1",onClick:m,children:"Hide"})]})]}),d.shared_child?r("div",{className:"rw-note-warn rounded border p-2 text-xs text-(--ui-text-primary)",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,c!==null?r("div",{className:"text-xs text-(--ui-red)",children:c}):null,N!==null?a("div",{className:"rw-confirm rounded border p-2 text-xs",ref:P,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[r("div",{className:"mb-1 text-(--ui-text-primary)",children:Ue(N.uncommitted)}),r("div",{className:"mb-2 break-all text-(--ui-text-tertiary)",children:N.worktree_path}),a("div",{className:"flex items-center gap-2",children:[r("button",{type:"button",className:"rw-confirm-delete rounded border px-2 py-1 disabled:opacity-50",onClick:()=>{j(N)},disabled:y,children:"Delete workspace"}),r("button",{type:"button",className:"rounded border border-(--ui-stroke-secondary) px-2 py-1",onClick:()=>{I(null)},children:"Cancel"})]})]}):null,p!==null?a("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[a("div",{className:"rounded border border-(--ui-stroke-tertiary) p-2",children:[a("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",p.left?.frozen_at?` \xB7 frozen ${le(p.left.frozen_at)}`:""]}),r(re,{label:"outcome",value:p.left===null?"not recorded":qe(p.left.outcome)}),r(re,{label:"tokens",value:p.left===null?"n/a":ue(p.left.tokens_in+p.left.tokens_out)}),r(re,{label:"tool errors",value:p.left===null?"n/a":String(p.left.tool_errors)})]}),a("div",{className:"rounded border border-(--ui-stroke-tertiary) p-2",children:[r("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),r(re,{label:"outcome",value:p.right===null?"not recorded":fe(p.right.outcome)}),r(re,{label:"verify",value:Z===null?"not run":ke(Z)}),r(re,{label:"tokens",value:p.right===null?"n/a":ue(p.right.tokens_in+p.right.tokens_out)}),r(re,{label:"tool errors",value:p.right===null?"n/a":String(p.right.tool_errors)})]}),a("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",p.verdict]})]}):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:h.state==="cleaned"||h.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),_!==null&&_.verify_out?r("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-stroke-tertiary) p-2 font-mono text-xs",children:_.verify_out}):null,d.prompt!==null?a("details",{className:"text-xs text-(--ui-text-tertiary)",children:[r("summary",{children:"Prompt"}),r("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:d.prompt})]}):null]})}function Ze({ctx:e}){let t=bt(vt.state.activeSessionId),[s,m]=b([]),[u,d]=b(null),[L,p]=b([]),[F,y]=b(!1),[w,c]=b(!1),[E,N]=b(null),[I,P]=b({}),[q,j]=b([]),[z,h]=b([]),[_,Z]=b(null),[se,Q]=b(null),[l,S]=b(null),[A,D]=b(null),[C,X]=b(0),[ee,k]=b(null),[G,xe]=b(0),[ce,ve]=b(!1),[be,i]=b(!1),[x,$]=b(null);K(()=>{let n=null,v=e.onEvent("*",()=>{n===null&&(n=e.setTimeout(()=>{n=null,xe(O=>O+1)},1500))});return()=>{v(),n!==null&&n()}},[e]),K(()=>{if(l===null||A!==null)return;let n=v=>{v.key==="Escape"&&!je()&&S(null)};return window.addEventListener("keydown",n),()=>{window.removeEventListener("keydown",n)}},[l,A]),K(()=>{let n=!1,v=async()=>{try{let B=await Pe(e);if(n)return;m(B),ve(!0),k(null),d(ae=>ae!==null&&B.some(we=>we.session_id===ae)?ae:t??B[0]?.session_id??null)}catch(B){n||k(T(B))}};v();let O=e.setInterval(()=>{v()},1e4);return()=>{n=!0,O()}},[e,t,C,G]),K(()=>{if(u===null){p([]),i(!1),y(!1),$(null),j([]),h([]);return}let n=!1,v=async()=>{try{let[B,ae,we]=await Promise.all([he(e,u),Ie(e,u),Me(e,u)]);if(n)return;p(tt=>Se(u,B.items,tt)),y(B.has_more),i(!0),j(ae),h(we),$(null),k(null)}catch(B){n||(i(!0),$(T(B)))}};v();let O=e.setInterval(()=>{v()},1e4);return()=>{n=!0,O()}},[e,u,C,G]),K(()=>{if(_===null){Q(null);return}let n=!1;return Ee(e,_).then(v=>{n||Q(v)}).catch(v=>{n||k(T(v))}),()=>{n=!0}},[e,_]);let f=s.find(n=>n.session_id===u)??null,H=f!==null&&f.ended_at===null,ne=H&&f.session_id===t,Y=u===null?[]:L.filter(n=>n.session_id===u),pe=n=>{d(n.session_id),Z(null),S(null),N(null),P({}),p([]),i(!1),y(!1),$(null),j([]),h([])},R=()=>{X(n=>n+1)},te=n=>{if(E===n.id){N(null);return}N(n.id),I[n.id]===void 0&&Te(e,n.session_id,n.seq,n.seq_to).then(v=>{P(O=>({...O,[n.id]:v}))}).catch(v=>{k(T(v))})},et=async()=>{let n=Y[Y.length-1];if(!(u===null||n===void 0)){c(!0);try{let v=await he(e,u,n.seq);p(O=>Se(u,v.items,O)),y(v.has_more)}catch(v){k(T(v))}finally{c(!1)}}};return a("div",{className:"rw-page flex h-full flex-col gap-3 p-3 text-sm",children:[r("style",{children:ht}),a("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-stroke-tertiary) pb-2",children:[a("div",{children:[r("div",{className:"text-base font-medium",children:"Session Rewind"}),r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),a("div",{className:"flex items-center gap-3 text-xs",children:[f!==null?r("span",{className:"text-(--ui-text-tertiary)",children:f.model??"unknown model"}):null,H?a("span",{className:"flex items-center gap-1 text-(--ui-green)",children:[r("span",{className:"h-1.5 w-1.5 rounded-full bg-(--ui-green)"}),ne?"live":"running"]}):null,r("button",{type:"button",className:"rounded border border-(--ui-stroke-secondary) px-2 py-1",onClick:R,children:"Refresh"})]})]}),ee!==null?r("div",{className:"text-xs text-(--ui-red)",children:ee}):null,a("div",{className:"flex min-h-0 flex-1 gap-3",children:[r("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-stroke-tertiary) pr-2",children:a("div",{className:"flex flex-col gap-1",children:[a("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:["Sessions",ce?r("span",{className:"ml-1",children:He(s.length,ye)}):null]}),ce?s.length===0?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):s.map(n=>a("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${u===n.session_id?"border-(--ui-accent)":"border-(--ui-stroke-secondary)"}`,onClick:()=>{pe(n)},children:[a("span",{className:"flex items-center gap-1.5",children:[r("span",{className:`h-1.5 w-1.5 rounded-full ${n.ended_at===null?"bg-(--ui-green)":"bg-(--ui-text-tertiary)"}`}),r("span",{className:"truncate font-medium",children:n.title??J(n.session_id)})]}),a("span",{className:"truncate text-(--ui-text-tertiary)",children:[n.model??"unknown model"," \xB7 ",M(n.event_count,"event")]}),a("span",{className:"truncate text-(--ui-text-tertiary)",children:[fe(n.outcome)," \xB7"," ",ue(n.tokens_in+n.tokens_out)," tokens"]})]},n.session_id)):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]})}),a("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[f!==null?a("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-stroke-tertiary) pb-2",children:[a("div",{children:[a("div",{className:"flex items-center gap-2",children:[r("span",{className:"text-base font-medium",children:f.title??J(f.session_id)}),q.length>0?r("span",{className:"text-xs text-(--ui-text-tertiary)",children:M(q.length,"snapshot")}):null]}),a("div",{className:"text-xs text-(--ui-text-tertiary)",children:[f.model??"unknown model"," \xB7"," ",M(f.event_count,"event")," \xB7"," ",ue(f.tokens_in+f.tokens_out)," tokens",f.ended_at===null?` \xB7 ${Oe(f.last_event_at)}`:""]})]}),r("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,z.length>0?a("div",{className:"flex max-h-24 flex-wrap items-center gap-1 overflow-y-auto",children:[r("span",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),r("span",{className:"text-xs text-(--ui-text-tertiary)",children:z.length}),z.map(n=>a("button",{type:"button",className:`flex items-center gap-2 rounded border px-2 py-1 text-xs ${l===n.id?"border-(--ui-accent)":"border-(--ui-stroke-secondary)"}`,onClick:()=>{S(n.id)},children:[r("span",{className:"font-mono",children:J(n.id)}),r("span",{className:`uppercase ${Je(n.state)}`,children:n.state}),r("span",{className:"text-(--ui-text-tertiary)",children:n.fork_row_count>0?M(n.fork_row_count,"message"):"context pack"})]},n.id))]}):null,a("div",{className:"flex min-h-0 flex-1 gap-2",children:[r("div",{className:"min-w-0 flex-1 overflow-auto",children:f===null?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):be?Y.length===0?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:Ve(f.event_count,x)}):a(Qe,{children:[Y.map(n=>r(Rt,{turn:n,expanded:E===n.id,events:I[n.id]??null,loading:E===n.id&&I[n.id]===void 0,selectedEventId:_,onToggle:()=>{te(n)},onFork:()=>{f!==null&&D({session:f,event:n})},onSelectEvent:v=>{Z(v.id)}},n.id)),F?r("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-stroke-secondary) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{et()},disabled:w,children:w?"Loading...":"Load earlier turns"}):a("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[M(Y.length,"turn")," \xB7 start of the recording"]})]}):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),r("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-stroke-tertiary) pl-2",children:r(Ct,{detail:se})})]})]})]}),l!==null?r("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-stroke-tertiary) pt-2",children:r(Pt,{ctx:e,branchId:l,refreshTick:C,onClose:()=>{S(null)},onRefresh:R})}):null,A!==null?r(Ke,{ctx:e,session:A.session,event:A.event,onClose:()=>{D(null)},onCreated:n=>{S(n),R()}}):null]})}import{jsx as Xe}from"react/jsx-runtime";var Dt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{Tt.navigate(oe)};e.registerMany([{id:"page",area:Mt,data:{path:oe},render:()=>Xe(Ze,{ctx:e})},{id:"nav",area:$t,data:{path:oe,label:"Rewind",codicon:"history"}},{id:"palette-open",area:It,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:Et,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:Lt.right,order:130,render:()=>Xe(Ce,{})}])}},dr=Dt;export{dr as default};
