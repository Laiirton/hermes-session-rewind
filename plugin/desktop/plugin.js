import{host as _t,KEYBINDS_AREA as kt,PALETTE_AREA as Nt,ROUTES_AREA as St,SIDEBAR_NAV_AREA as Rt,STATUSBAR_AREAS as Tt}from"@hermes/plugin-sdk";import{host as ve,useValue as Xe}from"@hermes/plugin-sdk";var Z="/rewind";import{jsx as Ze,jsxs as et}from"react/jsx-runtime";function ye(){let e=Xe(ve.state.activeSessionId);return et("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{ve.navigate(Z)},title:"Open Session Rewind",children:[Ze("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as mt,useValue as pt}from"@hermes/plugin-sdk";import{useEffect as ee,useState as g}from"react";function oe(e,t,o){return e.rest(t,{method:"POST",body:o})}var fe=100;async function _e(e){return(await e.rest(`/sessions?limit=${fe}`)).items}async function ge(e,t,o=null){let a=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${a}`)}async function ke(e,t,o,a){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${a+1}`)).items}function Ne(e,t){return e.rest(`/events/${t}`)}function Se(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function Re(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function Te(e,t){return oe(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function Pe(e,t,o,a=null){let l=a===null?"":`&before_ts=${a}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${l}`)}function Ee(e,t){return oe(e,"/forks/prepare",t)}function Ce(e,t,o){return oe(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function Ie(e,t){return oe(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function $e(e,t,o){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(o)}`)}function Le(e,t){return oe(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function se(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ie(e){return e.toLocaleString()}function ue(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var tt=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function R(e){let t=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",o=tt.exec(t),a=o?.[1];if(o===null||a===void 0)return t;let l=rt(a);return l===void 0?t:t.replace(o[0],l)}function rt(e){try{let t=JSON.parse(e);return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}catch{return}}function j(e,t=8){return e.length<=t?e:e.slice(0,t)}function P(e,t){return`${e} ${e===1?t:`${t}s`}`}function be(e){return e===0?"passed":`failed (exit ${e})`}var nt={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function de(e){return e===null?"recording":nt[e]??e}function De(e){return e===null?"open at freeze":de(e)}function Ae(e,t){return e===0?"":e>=t?`${t}+`:`${e}`}function ot(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Me(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${ot(e)}`}function Fe(e,t){return t!==null?`The turns could not be loaded: ${t}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${P(e,"event")} but no user turn.`}import{host as U,useTheme as it}from"@hermes/plugin-sdk";import{useEffect as xe,useRef as qe,useState as G}from"react";function st(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let a=o.text;return typeof a=="string"?a:""}).join("").trim():""}function Be(e,t){let o=(e??[]).filter(c=>(c.role==="user"||c.role==="assistant")&&st(c).length>0&&typeof c.row_id=="number"),a=-1;for(let c=0;c<o.length;c+=1){let _=o[c];if(_===void 0)continue;let m=_.timestamp;_.role==="user"&&typeof m=="number"&&m<=t+.5&&(a=c)}if(a<=0)return null;let l=o[a-1]?.row_id;return typeof l=="number"&&l>0?l:null}import{jsx as p,jsxs as y}from"react/jsx-runtime";var at=["python -m pytest -q","npm test","cargo test","go test ./..."],lt=350;function ae(e,t){return t.catch(o=>{throw new Error(`${e}: ${R(o)}`)})}function ut(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function dt(e,t){let o=ut(e),a=o[0],l=o[o.length-1];if(e===null||a===void 0||l===void 0)return;let c=document.activeElement;if(!e.contains(c)){t.preventDefault(),a.focus();return}t.shiftKey&&c===a?(t.preventDefault(),l.focus()):!t.shiftKey&&c===l&&(t.preventDefault(),a.focus())}var ct=`
.rw-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 28px 20px;
  overflow-y: auto;
  background: rgba(4, 6, 9, 0.72);
  backdrop-filter: blur(3px);
}
.rw-panel {
  display: flex;
  flex-direction: column;
  width: min(760px, 100%);
  max-height: calc(100vh - 56px);
  margin: auto 0;
  overflow: hidden;
  color: var(--ui-text-primary, #ececf1);
  background: var(--ui-panel-background, var(--ui-bg-elevated, #15161a));
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.14));
  border-radius: 14px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.62);
}
.rw-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px 16px;
  border-bottom: 1px solid var(--ui-border, rgba(255, 255, 255, 0.1));
}
.rw-heading {
  min-width: 0;
}
.rw-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
}
.rw-subtitle {
  max-width: 560px;
  margin-top: 4px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1.45;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rw-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex: none;
  padding: 0;
  font: inherit;
  font-size: 18px;
  line-height: 1;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.14));
  border-radius: 8px;
}
.rw-close:hover:not(:disabled) {
  color: var(--ui-text-primary, #ececf1);
  background: rgba(255, 255, 255, 0.06);
}
.rw-panel:focus-visible {
  outline: none;
}
.rw-button:focus-visible,
.rw-close:focus-visible,
.rw-preset:focus-visible {
  outline: 2px solid var(--ui-accent, #6ea8fe);
  outline-offset: 2px;
}
.rw-input:focus-visible,
.rw-textarea:focus-visible {
  outline: none;
}
.rw-close:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 20px;
  overflow-y: auto;
}
.rw-card {
  padding: 14px;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
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
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-badge {
  padding: 2px 8px;
  font-size: 11px;
  line-height: 1.6;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.14));
  border-radius: 999px;
}
.rw-badge-idle {
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-badge-ok {
  color: #3fb950;
  background: rgba(63, 185, 80, 0.08);
  border-color: rgba(63, 185, 80, 0.35);
}
.rw-badge-warn {
  color: #e3b341;
  background: rgba(227, 179, 65, 0.08);
  border-color: rgba(227, 179, 65, 0.35);
}
.rw-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.rw-chip {
  padding: 3px 8px;
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 6px;
}
.rw-preset {
  padding: 3px 8px;
  font: inherit;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.12));
  border-radius: 6px;
}
.rw-preset:hover {
  color: var(--ui-text-primary, #ececf1);
  border-color: var(--ui-accent, #6ea8fe);
}
.rw-resolved {
  margin-top: 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-path {
  margin-top: 10px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 1.5;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
  word-break: break-all;
}
.rw-note {
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.5;
  color: #e3b341;
}
.rw-note-muted {
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.rw-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.rw-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-input,
.rw-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 9px 10px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text-primary, #ececf1);
  outline: none;
  background: rgba(0, 0, 0, 0.24);
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.14));
  border-radius: 8px;
}
.rw-input {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
.rw-input:focus,
.rw-textarea:focus {
  border-color: var(--ui-accent, #6ea8fe);
  box-shadow: 0 0 0 3px rgba(110, 168, 254, 0.16);
}
.rw-textarea {
  min-height: 170px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  line-height: 1.55;
  resize: vertical;
}
.rw-help {
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-banner {
  padding: 9px 11px;
  font-size: 12px;
  line-height: 1.5;
  border: 1px solid transparent;
  border-radius: 8px;
}
.rw-banner-warn {
  color: #e3b341;
  background: rgba(227, 179, 65, 0.08);
  border-color: rgba(227, 179, 65, 0.35);
}
.rw-banner-error {
  color: #ff7b72;
  background: rgba(255, 123, 114, 0.08);
  border-color: rgba(255, 123, 114, 0.35);
}
.rw-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  background: rgba(0, 0, 0, 0.16);
  border-top: 1px solid var(--ui-border, rgba(255, 255, 255, 0.1));
}
.rw-hint {
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-text-tertiary, rgba(236, 236, 241, 0.56));
}
.rw-actions {
  display: flex;
  flex: none;
  gap: 8px;
}
.rw-button {
  padding: 8px 14px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text-primary, #ececf1);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-border, rgba(255, 255, 255, 0.14));
  border-radius: 8px;
}
.rw-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
}
.rw-button:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-primary {
  font-weight: 600;
  color: #08111f;
  background: var(--ui-accent, #6ea8fe);
  border-color: transparent;
}
.rw-primary:hover:not(:disabled) {
  background: var(--ui-accent, #6ea8fe);
  filter: brightness(1.08);
}
.rw-light {
  background: rgba(24, 26, 30, 0.32);
}
.rw-light .rw-panel {
  color: #1c1f24;
  background: #f6f7f9;
  border-color: rgba(0, 0, 0, 0.14);
  box-shadow: 0 24px 70px rgba(15, 18, 22, 0.24);
}
.rw-light .rw-header {
  border-bottom-color: rgba(0, 0, 0, 0.1);
}
.rw-light .rw-subtitle,
.rw-light .rw-card-title,
.rw-light .rw-chip,
.rw-light .rw-path,
.rw-light .rw-label,
.rw-light .rw-help,
.rw-light .rw-hint,
.rw-light .rw-badge-idle,
.rw-light .rw-resolved {
  color: rgba(28, 31, 36, 0.62);
}
.rw-light .rw-note.rw-note-muted {
  color: rgba(28, 31, 36, 0.62);
}
.rw-light .rw-close {
  color: rgba(28, 31, 36, 0.62);
  border-color: rgba(0, 0, 0, 0.14);
}
.rw-light .rw-close:hover:not(:disabled) {
  color: #1c1f24;
  background: rgba(0, 0, 0, 0.06);
}
.rw-light .rw-card {
  background: rgba(0, 0, 0, 0.035);
  border-color: rgba(0, 0, 0, 0.1);
}
.rw-light .rw-badge {
  border-color: rgba(0, 0, 0, 0.14);
}
.rw-light .rw-badge-ok {
  color: #1a7f37;
  background: rgba(26, 127, 55, 0.08);
  border-color: rgba(26, 127, 55, 0.32);
}
.rw-light .rw-badge-warn,
.rw-light .rw-note,
.rw-light .rw-banner-warn {
  color: #9a6700;
}
.rw-light .rw-banner-warn {
  background: rgba(154, 103, 0, 0.08);
  border-color: rgba(154, 103, 0, 0.3);
}
.rw-light .rw-banner-error {
  color: #cf222e;
  background: rgba(207, 34, 46, 0.07);
  border-color: rgba(207, 34, 46, 0.3);
}
.rw-light .rw-chip {
  border-color: rgba(0, 0, 0, 0.12);
}
.rw-light .rw-preset {
  color: rgba(28, 31, 36, 0.72);
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.14);
}
.rw-light .rw-preset:hover {
  color: #1c1f24;
  background: rgba(0, 0, 0, 0.05);
  border-color: #1f6feb;
}
.rw-light .rw-input,
.rw-light .rw-textarea {
  color: #1c1f24;
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.16);
}
.rw-light .rw-input:focus,
.rw-light .rw-textarea:focus {
  border-color: #1f6feb;
  box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.22);
}
.rw-light .rw-footer {
  background: rgba(0, 0, 0, 0.03);
  border-top-color: rgba(0, 0, 0, 0.1);
}
.rw-light .rw-button {
  color: #1c1f24;
  border-color: rgba(0, 0, 0, 0.16);
}
.rw-light .rw-button:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
}
.rw-light .rw-primary {
  color: #ffffff;
  background: #1f6feb;
}
.rw-light .rw-primary:hover:not(:disabled) {
  background: #1a63d8;
}
@media (max-width: 620px) {
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
  }
}
`;function ze({ctx:e,session:t,event:o,onClose:a,onCreated:l}){let c=it().resolvedMode==="light",[_,m]=G(t.model??""),[C,E]=G(""),[b,z]=G(""),[s,W]=G(null),[A,x]=G(null),[k,I]=G(null),[K,M]=G(null),[v,$]=G(null),T=k!==null,O=qe(null),h=qe(()=>{});xe(()=>{let u=document.activeElement;return O.current?.focus(),()=>{u?.focus()}},[]),xe(()=>{let u=d=>{if(d.key==="Escape"&&!T){a();return}if(d.key==="Tab"){dt(O.current,d);return}d.key==="Enter"&&(d.metaKey||d.ctrlKey)&&!T&&(d.preventDefault(),h.current())};return window.addEventListener("keydown",u),()=>{window.removeEventListener("keydown",u)}},[T,a]),xe(()=>{let u=b.trim();if(s===null||u===""){x(null);return}let d=!1,D=e.setTimeout(()=>{$e(e,s.branch_id,u).then(S=>{d||x(S)}).catch(()=>{d||x(null)})},lt);return()=>{d=!0,D()}},[e,s,b]);let L=async()=>{let u=await U.request("session.active_list",{}),d=Array.isArray(u.sessions)?u.sessions:[],D=d.find(S=>S.session_key===t.session_id)?.id??d.find(S=>S.id===t.session_id)?.id;if(D===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let S=await U.request("session.title",{session_id:D});return{runtimeId:D,storedId:S.session_key??t.stored_session_id}}catch{return{runtimeId:D,storedId:t.stored_session_id}}},F=async()=>{I("prepare"),M(null),$(null);try{let u=await L(),d=await Ee(e,{session_id:t.session_id,stored_session_id:u.storedId,event_id:o.id,model:_.trim()||null,provider:null,prompt:C.trim()||null,verify_cmd:b.trim()||null});W(d),E(d.prompt),d.verify_presets.length>0&&b.trim()===""&&z(d.verify_presets[0]??""),d.model!==null&&m(d.model)}catch(u){M(R(u))}finally{I(null)}},te=async()=>{if(s!==null){I("run"),M(null),$(null);try{let u=await L(),d=u.runtimeId,D=`\u21BA ${t.title??j(t.session_id)} \xB7 ${j(s.branch_id)}`,S=null;if(d!==void 0)try{let N=await U.request("session.history",{session_id:d});S=Be(N.messages,s.fork_before_ts)}catch{S=null}let V,X,le=!1;if(S!==null&&d!==void 0){let N=await ae("could not branch the session",U.request("session.branch",{session_id:d,through_message_id:S}));V=N.session_id,X=N.stored_session_id}else{let N={source:"desktop",title:D};s.worktree_path!==null&&(N.cwd=s.worktree_path),u.storedId!==null&&(N.parent_session_id=u.storedId);let B=await ae("could not create the branch session",U.request("session.create",N));V=B.session_id,X=B.stored_session_id,le=!0}if(le&&s.worktree_path!==null){let N=()=>U.request("session.cwd.set",{session_id:V,cwd:s.worktree_path});try{await ae("could not attach the isolated workspace",N())}catch(B){throw B instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${R(B)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(_.trim()&&_.trim()!==(t.model??""))try{let N=await U.request("config.set",{key:"model",value:_.trim(),session_id:V,confirm_expensive_model:!1});N.confirm_required===!0&&$(N.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{$("The branch was created, but the model switch failed; the rerun uses the current model.")}let J=C.trim()||s.prompt;await ae("could not record the branch",Ce(e,s.branch_id,{child_session_id:V,child_stored_session_id:X,model:_.trim()||null,provider:null,prompt:J,verify_cmd:b.trim()||null})),await ae("could not start the rerun",U.request("prompt.submit",{session_id:V,text:J})),l(s.branch_id),U.openSession(X,{intent:"tab"}),a()}catch(u){M(R(u))}finally{I(null)}}};h.current=()=>{s===null?F():te()};let Q=s===null?"not prepared":s.fidelity,ce=s===null?"rw-badge rw-badge-idle":s.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return y("div",{className:c?"rw-overlay rw-light":"rw-overlay",onMouseDown:u=>{u.target===u.currentTarget&&!T&&a()},children:[p("style",{children:ct}),y("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:O,children:[y("header",{className:"rw-header",children:[y("div",{className:"rw-heading",children:[p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),y("div",{className:"rw-subtitle",children:[se(o.ts)," \xB7 ",o.preview||"user turn"]})]}),p("button",{type:"button",className:"rw-close",onClick:a,disabled:T,"aria-label":"Close",children:"\xD7"})]}),y("div",{className:"rw-body",children:[K!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:K}):null,v!==null?p("div",{className:"rw-banner rw-banner-warn",role:"status",children:v}):null,y("section",{className:"rw-card",children:[y("div",{className:"rw-card-head",children:[p("span",{className:"rw-card-title",children:"Checkpoint"}),p("span",{className:ce,children:Q==="full"?"workspace ready":Q})]}),y("div",{className:"rw-chips",children:[p("span",{className:"rw-chip",children:s===null?"carries \u2014":s.fork_row_count>0?`carries ${P(s.fork_row_count,"message")}`:"carries the context pack"}),y("span",{className:"rw-chip",children:["verify timeout ",s===null?"\u2014":`${s.verify_timeout_seconds}s`]}),s?.snapshot_commit?y("span",{className:"rw-chip",children:["snapshot ",s.snapshot_commit.slice(0,8)]}):null]}),s?.worktree_path?p("div",{className:"rw-path",children:s.worktree_path}):p("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),s!==null&&s.fidelity!=="full"?p("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,s!==null&&s.context_rows===null?p("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,s!==null&&t.ended_at!==null?p("div",{className:"rw-note rw-note-muted",children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}):null,s!==null&&s.fork_row_count===0&&t.ended_at===null?p("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),y("div",{className:"rw-grid",children:[y("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Model"}),p("input",{className:"rw-input",value:_,onChange:u=>{m(u.target.value)},placeholder:"provider/model"}),p("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),y("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:b,onChange:u=>{z(u.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(s?.verify_presets.length?s.verify_presets:at).map(u=>p("button",{type:"button",className:"rw-preset",onClick:()=>{z(u)},disabled:T,children:u},u))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),A!==null&&A.command===b.trim()?p("span",{className:"rw-resolved",children:A.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${A.resolved}`}):null]})]}),y("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),p("textarea",{className:"rw-textarea",value:C,onChange:u=>{E(u.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),p("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),y("footer",{className:"rw-footer",children:[p("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),y("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:a,disabled:T,children:"Cancel"}),s===null?p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{F()},disabled:T,children:k==="prepare"?"Preparing...":"Prepare branch"}):p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{te()},disabled:T,children:k==="run"?"Forking...":"Fork & run"})]})]})]})]})}function he(e,t,o){let a=new Set(t.map(c=>c.id)),l=o.filter(c=>c.session_id===e&&!a.has(c.id));return[...t,...l]}import{Fragment as Ke,jsx as n,jsxs as i}from"react/jsx-runtime";var ft=`
.rw-page :is(button, input, textarea, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--ui-accent, #4f8cff);
  outline-offset: 1px;
}
.rw-page button:not(:disabled) {
  cursor: pointer;
}
.rw-page button:disabled {
  cursor: not-allowed;
}
`,gt=new Set(["done","failed","cleaned","discarded"]);function bt(e){return ue(Math.max(0,(e.work_ts-e.ts)*1e3))}function xt({event:e,selected:t,onSelect:o}){return i("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[n("span",{title:e.kind,className:`w-20 shrink-0 truncate uppercase ${Ve(e.kind,e.status)}`,children:Oe(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:ue(e.duration_ms)})]})}var ht=new Set(["api_request","llm_call"]);function wt({turn:e,expanded:t,events:o,loading:a,selectedEventId:l,onToggle:c,onFork:_,onSelectEvent:m}){let C=(o??[]).filter(b=>!ht.has(b.kind)),E=(o??[]).length-C.length;return i("div",{className:"border-b border-(--ui-border) pb-1",children:[i("div",{className:"flex items-center gap-2",children:[i("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:c,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:se(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),n("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:P(e.tool_calls,"tool")}),e.tool_errors>0?n("span",{className:"shrink-0 text-xs text-red-500",children:P(e.tool_errors,"error")}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:bt(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:_,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:a?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):i(Ke,{children:[C.map(b=>n(xt,{event:b,selected:l===b.id,onSelect:()=>{m(b)}},b.id)),E>0?i("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[P(e.api_requests,"model request")," \xB7",P(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Oe(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function Ve(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function He(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function Y({label:e,value:t}){return i("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function vt({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):i("div",{className:"flex flex-col gap-2",children:[i("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${Ve(e.kind,e.status)}`,children:Oe(e.kind)}),i("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),i("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${ue(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function yt({ctx:e,branchId:t,refreshTick:o,onClose:a,onRefresh:l}){let[c,_]=g(null),[m,C]=g(null),[E,b]=g(!1),[z,s]=g(null);ee(()=>{let v=!1,$=null,T=async()=>{try{let h=await Te(e,t);if(v)return!0;_(h),s(null);let L=h.branch.child_session_id;if(L!==null){let F=await Pe(e,h.branch.parent_session_id,L,h.branch.fork_before_ts);v||C(F)}else C(null);return gt.has(h.branch.state)}catch(h){return v||s(R(h)),!1}},O=async()=>{let h=await T();!v&&!h&&($=e.setTimeout(()=>{O()},2500))};return O(),()=>{v=!0,$!==null&&$()}},[e,t,o]);let W=async()=>{b(!0),s(null);try{await Ie(e,t),l()}catch(v){s(R(v))}finally{b(!1)}},A=async()=>{b(!0),s(null);try{await Le(e,t),l()}catch(v){s(R(v))}finally{b(!1)}};if(c===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let x=c.branch,k=c.run,I=k?.verify_exit??m?.right?.verify_exit??null,K=x.verify_cmd?x.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",M=x.worktree_path?void 0:"This branch has no workspace left to remove.";return i("div",{className:"flex flex-col gap-2",children:[i("div",{className:"flex items-center justify-between gap-2",children:[i("div",{className:"flex items-center gap-2 text-xs",children:[i("span",{className:"font-medium",children:["Branch ",j(x.id)]}),n("span",{className:`uppercase ${He(x.state)}`,children:x.state}),k!==null&&k.verify_exit!==null?i("span",{className:k.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify ",be(k.verify_exit)]}):null]}),i("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",title:K,onClick:()=>{W()},disabled:E||!x.verify_cmd||!x.worktree_path,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",title:M,onClick:()=>{A()},disabled:E||!x.worktree_path,children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:a,children:"Hide"})]})]}),c.shared_child?n("div",{className:"rounded border border-amber-600/40 bg-amber-500/5 p-2 text-xs text-(--ui-text)",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,z!==null?n("div",{className:"text-xs text-red-500",children:z}):null,m!==null?i("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[i("div",{className:"rounded border border-(--ui-border) p-2",children:[i("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",m.left?.frozen_at?` \xB7 frozen ${se(m.left.frozen_at)}`:""]}),n(Y,{label:"outcome",value:m.left===null?"not recorded":De(m.left.outcome)}),n(Y,{label:"tokens",value:m.left===null?"n/a":ie(m.left.tokens_in+m.left.tokens_out)}),n(Y,{label:"tool errors",value:m.left===null?"n/a":String(m.left.tool_errors)})]}),i("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(Y,{label:"outcome",value:m.right===null?"not recorded":de(m.right.outcome)}),n(Y,{label:"verify",value:I===null?"not run":be(I)}),n(Y,{label:"tokens",value:m.right===null?"n/a":ie(m.right.tokens_in+m.right.tokens_out)}),n(Y,{label:"tool errors",value:m.right===null?"n/a":String(m.right.tool_errors)})]}),i("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",m.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:x.state==="cleaned"||x.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),k!==null&&k.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:k.verify_out}):null,c.prompt!==null?i("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:c.prompt})]}):null]})}function Ue({ctx:e}){let t=pt(mt.state.activeSessionId),[o,a]=g([]),[l,c]=g(null),[_,m]=g([]),[C,E]=g(!1),[b,z]=g(!1),[s,W]=g(null),[A,x]=g({}),[k,I]=g([]),[K,M]=g([]),[v,$]=g(null),[T,O]=g(null),[h,L]=g(null),[F,te]=g(null),[Q,ce]=g(0),[u,d]=g(null),[D,S]=g(0),[V,X]=g(!1),[le,J]=g(!1),[N,B]=g(null);ee(()=>{let r=null,f=e.onEvent("*",()=>{r===null&&(r=e.setTimeout(()=>{r=null,S(H=>H+1)},1500))});return()=>{f(),r!==null&&r()}},[e]),ee(()=>{if(h===null||F!==null)return;let r=f=>{f.key==="Escape"&&L(null)};return window.addEventListener("keydown",r),()=>{window.removeEventListener("keydown",r)}},[h,F]),ee(()=>{let r=!1,f=async()=>{try{let q=await _e(e);if(r)return;a(q),X(!0),d(null),c(ne=>ne!==null&&q.some(pe=>pe.session_id===ne)?ne:t??q[0]?.session_id??null)}catch(q){r||d(R(q))}};f();let H=e.setInterval(()=>{f()},1e4);return()=>{r=!0,H()}},[e,t,Q,D]),ee(()=>{if(l===null){m([]),J(!1),E(!1),B(null),I([]),M([]);return}let r=!1,f=async()=>{try{let[q,ne,pe]=await Promise.all([ge(e,l),Se(e,l),Re(e,l)]);if(r)return;m(Qe=>he(l,q.items,Qe)),E(q.has_more),J(!0),I(ne),M(pe),B(null),d(null)}catch(q){r||(J(!0),B(R(q)))}};f();let H=e.setInterval(()=>{f()},1e4);return()=>{r=!0,H()}},[e,l,Q,D]),ee(()=>{if(v===null){O(null);return}let r=!1;return Ne(e,v).then(f=>{r||O(f)}).catch(f=>{r||d(R(f))}),()=>{r=!0}},[e,v]);let w=o.find(r=>r.session_id===l)??null,we=w!==null&&w.ended_at===null,Ge=we&&w.session_id===t,re=l===null?[]:_.filter(r=>r.session_id===l),We=r=>{c(r.session_id),$(null),L(null),W(null),x({}),m([]),J(!1),E(!1),B(null),I([]),M([])},me=()=>{ce(r=>r+1)},Je=r=>{if(s===r.id){W(null);return}W(r.id),A[r.id]===void 0&&ke(e,r.session_id,r.seq,r.seq_to).then(f=>{x(H=>({...H,[r.id]:f}))}).catch(f=>{d(R(f))})},Ye=async()=>{let r=re[re.length-1];if(!(l===null||r===void 0)){z(!0);try{let f=await ge(e,l,r.seq);m(H=>he(l,f.items,H)),E(f.has_more)}catch(f){d(R(f))}finally{z(!1)}}};return i("div",{className:"rw-page flex h-full flex-col gap-3 p-3 text-sm",children:[n("style",{children:ft}),i("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[i("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),i("div",{className:"flex items-center gap-3 text-xs",children:[w!==null?n("span",{className:"text-(--ui-text-tertiary)",children:w.model??"unknown model"}):null,we?i("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),Ge?"live":"running"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:me,children:"Refresh"})]})]}),u!==null?n("div",{className:"text-xs text-red-500",children:u}):null,i("div",{className:"flex min-h-0 flex-1 gap-3",children:[n("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:i("div",{className:"flex flex-col gap-1",children:[i("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:["Sessions",V?n("span",{className:"ml-1",children:Ae(o.length,fe)}):null]}),V?o.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):o.map(r=>i("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${l===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{We(r)},children:[i("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??j(r.session_id)})]}),i("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",P(r.event_count,"event")]}),i("span",{className:"truncate text-(--ui-text-tertiary)",children:[de(r.outcome)," \xB7"," ",ie(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id)):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]})}),i("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[w!==null?i("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[i("div",{children:[i("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:w.title??j(w.session_id)}),k.length>0?n("span",{className:"text-xs text-(--ui-text-tertiary)",children:P(k.length,"snapshot")}):null]}),i("div",{className:"text-xs text-(--ui-text-tertiary)",children:[w.model??"unknown model"," \xB7"," ",P(w.event_count,"event")," \xB7"," ",ie(w.tokens_in+w.tokens_out)," tokens",w.ended_at===null?` \xB7 ${Me(w.last_event_at)}`:""]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,K.length>0?i("div",{className:"flex max-h-24 flex-wrap items-center gap-1 overflow-y-auto",children:[n("span",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),n("span",{className:"text-xs text-(--ui-text-tertiary)",children:K.length}),K.map(r=>i("button",{type:"button",className:`flex items-center gap-2 rounded border px-2 py-1 text-xs ${h===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{L(r.id)},children:[n("span",{className:"font-mono",children:j(r.id)}),n("span",{className:`uppercase ${He(r.state)}`,children:r.state}),n("span",{className:"text-(--ui-text-tertiary)",children:r.fork_row_count>0?P(r.fork_row_count,"message"):"context pack"})]},r.id))]}):null,i("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:w===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):le?re.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:Fe(w.event_count,N)}):i(Ke,{children:[re.map(r=>n(wt,{turn:r,expanded:s===r.id,events:A[r.id]??null,loading:s===r.id&&A[r.id]===void 0,selectedEventId:v,onToggle:()=>{Je(r)},onFork:()=>{w!==null&&te({session:w,event:r})},onSelectEvent:f=>{$(f.id)}},r.id)),C?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Ye()},disabled:b,children:b?"Loading...":"Load earlier turns"}):i("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[P(re.length,"turn")," \xB7 start of the recording"]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(vt,{detail:T})})]})]})]}),h!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(yt,{ctx:e,branchId:h,refreshTick:Q,onClose:()=>{L(null)},onRefresh:me})}):null,F!==null?n(ze,{ctx:e,session:F.session,event:F.event,onClose:()=>{te(null)},onCreated:r=>{L(r),me()}}):null]})}import{jsx as je}from"react/jsx-runtime";var Pt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{_t.navigate(Z)};e.registerMany([{id:"page",area:St,data:{path:Z},render:()=>je(Ue,{ctx:e})},{id:"nav",area:Rt,data:{path:Z,label:"Rewind",codicon:"history"}},{id:"palette-open",area:Nt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:kt,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:Tt.right,order:130,render:()=>je(ye,{})}])}},nr=Pt;export{nr as default};
