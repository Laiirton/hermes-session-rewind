import{host as Et,KEYBINDS_AREA as Pt,PALETTE_AREA as Tt,ROUTES_AREA as Ct,SIDEBAR_NAV_AREA as It,STATUSBAR_AREAS as $t}from"@hermes/plugin-sdk";import{host as ye,useValue as tt}from"@hermes/plugin-sdk";var re="/rewind";import{jsx as rt,jsxs as nt}from"react/jsx-runtime";function _e(){let e=tt(ye.state.activeSessionId);return nt("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{ye.navigate(re)},title:"Open Session Rewind",children:[rt("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as gt,useValue as bt}from"@hermes/plugin-sdk";import{useEffect as W,useRef as xt,useState as x}from"react";function se(e,t,o){return e.rest(t,{method:"POST",body:o})}var fe=100;async function ke(e){return(await e.rest(`/sessions?limit=${fe}`)).items}async function ge(e,t,o=null){let u=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${u}`)}async function Ne(e,t,o,u){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${u+1}`)).items}function Se(e,t){return e.rest(`/events/${t}`)}function Re(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function Ee(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function Pe(e,t){return se(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function Te(e,t,o,u=null){let l=u===null?"":`&before_ts=${u}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${l}`)}function Ce(e,t){return se(e,"/forks/prepare",t)}function Ie(e,t,o){return se(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function $e(e,t){return se(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Le(e,t,o){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(o)}`)}function De(e,t){return e.rest(`/forks/${encodeURIComponent(t)}/workspace`)}function be(e,t){return se(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function ie(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ae(e){return e.toLocaleString()}function de(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var ot=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function E(e){let t=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",o=ot.exec(t),u=o?.[1];if(o===null||u===void 0)return t;let l=st(u);return l===void 0?t:t.replace(o[0],l)}function st(e){try{let t=JSON.parse(e);return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}catch{return}}function Y(e,t=8){return e.length<=t?e:e.slice(0,t)}function C(e,t){return`${e} ${e===1?t:`${t}s`}`}function xe(e){return e===0?"passed":`failed (exit ${e})`}var it={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function ce(e){return e===null?"recording":it[e]??e}function Me(e){return e===null?"open at freeze":ce(e)}function Ae(e,t){return e===0?"":e>=t?`${t}+`:`${e}`}function at(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Fe(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${at(e)}`}function Be(e,t){return t!==null?`The turns could not be loaded: ${t}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${C(e,"event")} but no user turn.`}function qe(e){return e===null?"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.":`This workspace holds ${C(e,"uncommitted file")}. Deleting it removes them for good; the rerun conversation stays in the recording.`}import{host as U,useTheme as ut}from"@hermes/plugin-sdk";import{useEffect as he,useRef as Oe,useState as Q}from"react";function lt(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let u=o.text;return typeof u=="string"?u:""}).join("").trim():""}function ze(e,t){let o=(e??[]).filter(c=>(c.role==="user"||c.role==="assistant")&&lt(c).length>0&&typeof c.row_id=="number"),u=-1;for(let c=0;c<o.length;c+=1){let y=o[c];if(y===void 0)continue;let m=y.timestamp;y.role==="user"&&typeof m=="number"&&m<=t+.5&&(u=c)}if(u<=0)return null;let l=o[u-1]?.row_id;return typeof l=="number"&&l>0?l:null}import{jsx as p,jsxs as w}from"react/jsx-runtime";var dt=["python -m pytest -q","npm test","cargo test","go test ./..."],ct=350;function le(e,t){return t.catch(o=>{throw new Error(`${e}: ${E(o)}`)})}function mt(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function pt(e,t){let o=mt(e),u=o[0],l=o[o.length-1];if(e===null||u===void 0||l===void 0)return;let c=document.activeElement;if(!e.contains(c)){t.preventDefault(),u.focus();return}t.shiftKey&&c===u?(t.preventDefault(),l.focus()):!t.shiftKey&&c===l&&(t.preventDefault(),u.focus())}var ft=`
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
`;function He({ctx:e,session:t,event:o,onClose:u,onCreated:l}){let c=ut().resolvedMode==="light",[y,m]=Q(t.model??""),[L,I]=Q(""),[g,z]=Q(""),[s,P]=Q(null),[S,O]=Q(null),[K,M]=Q(null),[j,h]=Q(null),[_,A]=Q(null),$=K!==null,G=Oe(null),f=Oe(()=>{});he(()=>{let a=document.activeElement;return G.current?.focus(),()=>{a?.focus()}},[]),he(()=>{let a=d=>{if(d.key==="Escape"&&!$){u();return}if(d.key==="Tab"){pt(G.current,d);return}d.key==="Enter"&&(d.metaKey||d.ctrlKey)&&!$&&(d.preventDefault(),f.current())};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[$,u]),he(()=>{let a=g.trim();if(s===null||a===""){O(null);return}let d=!1,D=e.setTimeout(()=>{Le(e,s.branch_id,a).then(T=>{d||O(T)}).catch(()=>{d||O(null)})},ct);return()=>{d=!0,D()}},[e,s,g]);let k=async()=>{let a=await U.request("session.active_list",{}),d=Array.isArray(a.sessions)?a.sessions:[],D=d.find(T=>T.session_key===t.session_id)?.id??d.find(T=>T.id===t.session_id)?.id;if(D===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let T=await U.request("session.title",{session_id:D});return{runtimeId:D,storedId:T.session_key??t.stored_session_id}}catch{return{runtimeId:D,storedId:t.stored_session_id}}},F=async()=>{M("prepare"),h(null),A(null);try{let a=await k(),d=await Ce(e,{session_id:t.session_id,stored_session_id:a.storedId,event_id:o.id,model:y.trim()||null,provider:null,prompt:L.trim()||null,verify_cmd:g.trim()||null});P(d),I(d.prompt),d.verify_presets.length>0&&g.trim()===""&&z(d.verify_presets[0]??""),d.model!==null&&m(d.model)}catch(a){h(E(a))}finally{M(null)}},J=async()=>{if(s!==null){M("run"),h(null),A(null);try{let a=await k(),d=a.runtimeId,D=`\u21BA ${t.title??Y(t.session_id)} \xB7 ${Y(s.branch_id)}`,T=null;if(d!==void 0)try{let R=await U.request("session.history",{session_id:d});T=ze(R.messages,s.fork_before_ts)}catch{T=null}let H,te,ue=!1;if(T!==null&&d!==void 0){let R=await le("could not branch the session",U.request("session.branch",{session_id:d,through_message_id:T}));H=R.session_id,te=R.stored_session_id}else{let R={source:"desktop",title:D};s.worktree_path!==null&&(R.cwd=s.worktree_path),a.storedId!==null&&(R.parent_session_id=a.storedId);let B=await le("could not create the branch session",U.request("session.create",R));H=B.session_id,te=B.stored_session_id,ue=!0}if(ue&&s.worktree_path!==null){let R=()=>U.request("session.cwd.set",{session_id:H,cwd:s.worktree_path});try{await le("could not attach the isolated workspace",R())}catch(B){throw B instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${E(B)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(y.trim()&&y.trim()!==(t.model??""))try{let R=await U.request("config.set",{key:"model",value:y.trim(),session_id:H,confirm_expensive_model:!1});R.confirm_required===!0&&A(R.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{A("The branch was created, but the model switch failed; the rerun uses the current model.")}let X=L.trim()||s.prompt;await le("could not record the branch",Ie(e,s.branch_id,{child_session_id:H,child_stored_session_id:te,model:y.trim()||null,provider:null,prompt:X,verify_cmd:g.trim()||null})),await le("could not start the rerun",U.request("prompt.submit",{session_id:H,text:X})),l(s.branch_id),U.openSession(te,{intent:"tab"}),u()}catch(a){h(E(a))}finally{M(null)}}};f.current=()=>{s===null?F():J()};let N=s===null?"not prepared":s.fidelity,ee=s===null?"rw-badge rw-badge-idle":s.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return w("div",{className:c?"rw-overlay rw-light":"rw-overlay",onMouseDown:a=>{a.target===a.currentTarget&&!$&&u()},children:[p("style",{children:ft}),w("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:G,children:[w("header",{className:"rw-header",children:[w("div",{className:"rw-heading",children:[p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),w("div",{className:"rw-subtitle",children:[ie(o.ts)," \xB7 ",o.preview||"user turn"]})]}),p("button",{type:"button",className:"rw-close",onClick:u,disabled:$,"aria-label":"Close",children:"\xD7"})]}),w("div",{className:"rw-body",children:[j!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:j}):null,_!==null?p("div",{className:"rw-banner rw-banner-warn",role:"status",children:_}):null,w("section",{className:"rw-card",children:[w("div",{className:"rw-card-head",children:[p("span",{className:"rw-card-title",children:"Checkpoint"}),p("span",{className:ee,children:N==="full"?"workspace ready":N})]}),w("div",{className:"rw-chips",children:[p("span",{className:"rw-chip",children:s===null?"carries \u2014":s.fork_row_count>0?`carries ${C(s.fork_row_count,"message")}`:"carries the context pack"}),w("span",{className:"rw-chip",children:["verify timeout ",s===null?"\u2014":`${s.verify_timeout_seconds}s`]}),s?.snapshot_commit?w("span",{className:"rw-chip",children:["snapshot ",s.snapshot_commit.slice(0,8)]}):null]}),s?.worktree_path?p("div",{className:"rw-path",children:s.worktree_path}):p("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),s!==null&&s.fidelity!=="full"?p("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,s!==null&&s.context_rows===null?p("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,s!==null&&t.ended_at!==null?p("div",{className:"rw-note rw-note-muted",children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}):null,s!==null&&s.fork_row_count===0&&t.ended_at===null?p("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),w("div",{className:"rw-grid",children:[w("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Model"}),p("input",{className:"rw-input",value:y,onChange:a=>{m(a.target.value)},placeholder:"provider/model"}),p("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),w("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:g,onChange:a=>{z(a.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(s?.verify_presets.length?s.verify_presets:dt).map(a=>p("button",{type:"button",className:"rw-preset",onClick:()=>{z(a)},disabled:$,children:a},a))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),S!==null&&S.command===g.trim()?p("span",{className:"rw-resolved",children:S.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${S.resolved}`}):null]})]}),w("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),p("textarea",{className:"rw-textarea",value:L,onChange:a=>{I(a.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),p("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),w("footer",{className:"rw-footer",children:[p("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),w("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:u,disabled:$,children:"Cancel"}),s===null?p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{F()},disabled:$,children:K==="prepare"?"Preparing...":"Prepare branch"}):p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{J()},disabled:$,children:K==="run"?"Forking...":"Fork & run"})]})]})]})]})}function ve(e,t,o){let u=new Set(t.map(c=>c.id)),l=o.filter(c=>c.session_id===e&&!u.has(c.id));return[...t,...l]}import{Fragment as Ge,jsx as r,jsxs as i}from"react/jsx-runtime";var ht="[data-rw-confirm]";function Ve(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(ht)!==null}var vt=`
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
`,wt=new Set(["done","failed","cleaned","discarded"]);function yt(e){return de(Math.max(0,(e.work_ts-e.ts)*1e3))}function _t({event:e,selected:t,onSelect:o}){return i("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[r("span",{title:e.kind,className:`w-20 shrink-0 truncate uppercase ${We(e.kind,e.status)}`,children:Ue(e.kind)}),r("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),r("span",{className:"w-14 shrink-0 text-right font-mono",children:de(e.duration_ms)})]})}var kt=new Set(["api_request","llm_call"]);function Nt({turn:e,expanded:t,events:o,loading:u,selectedEventId:l,onToggle:c,onFork:y,onSelectEvent:m}){let L=(o??[]).filter(g=>!kt.has(g.kind)),I=(o??[]).length-L.length;return i("div",{className:"border-b border-(--ui-border) pb-1",children:[i("div",{className:"flex items-center gap-2",children:[i("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:c,"aria-expanded":t,children:[r("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),r("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:ie(e.ts)}),r("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),r("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:C(e.tool_calls,"tool")}),e.tool_errors>0?r("span",{className:"shrink-0 text-xs text-red-500",children:C(e.tool_errors,"error")}):null,r("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:yt(e)})]}),r("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:y,children:"Rewind"})]}),t?r("div",{className:"flex flex-col gap-0.5 pb-1",children:u?r("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):i(Ge,{children:[L.map(g=>r(_t,{event:g,selected:l===g.id,onSelect:()=>{m(g)}},g.id)),I>0?i("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[C(e.api_requests,"model request")," \xB7",C(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Ue(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function We(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Ke(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function Z({label:e,value:t}){return i("div",{className:"flex items-center justify-between gap-2",children:[r("span",{className:"text-(--ui-text-tertiary)",children:e}),r("span",{className:"font-mono tabular-nums",children:t})]})}function St({detail:e}){return e===null?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):i("div",{className:"flex flex-col gap-2",children:[i("div",{className:"flex items-center justify-between gap-2 text-xs",children:[r("span",{className:`font-medium ${We(e.kind,e.status)}`,children:Ue(e.kind)}),i("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),i("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${de(e.duration_ms)}`:""]}),r("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function Rt({ctx:e,branchId:t,refreshTick:o,onClose:u,onRefresh:l}){let[c,y]=x(null),[m,L]=x(null),[I,g]=x(!1),[z,s]=x(null),[P,S]=x(null),O=xt(null);W(()=>{let f=!1,k=null,F=async()=>{try{let N=await Pe(e,t);if(f)return!0;y(N),s(null);let ee=N.branch.child_session_id;if(ee!==null){let a=await Te(e,N.branch.parent_session_id,ee,N.branch.fork_before_ts);f||L(a)}else L(null);return wt.has(N.branch.state)}catch(N){return f||s(E(N)),!1}},J=async()=>{let N=await F();!f&&!N&&(k=e.setTimeout(()=>{J()},2500))};return J(),()=>{f=!0,k!==null&&k()}},[e,t,o]);let K=async()=>{g(!0),s(null);try{await $e(e,t),l()}catch(f){s(E(f))}finally{g(!1)}},M=async f=>{g(!0),s(null),S(null);try{await be(e,t),l()}catch(k){s(E(k)),S(f)}finally{g(!1)}},j=async()=>{g(!0),s(null);try{let f=await De(e,t);f.uncommitted===0?(await be(e,t),l()):S(f)}catch(f){s(E(f))}finally{g(!1)}};if(W(()=>{S(null)},[t]),W(()=>{if(P===null)return;let f=k=>{k.key==="Escape"&&Ve()&&S(null)};return window.addEventListener("keydown",f),()=>{window.removeEventListener("keydown",f)}},[P]),W(()=>{if(P===null)return;let f=document.activeElement;return O.current?.focus(),()=>{f instanceof HTMLElement&&f.focus()}},[P]),c===null)return r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let h=c.branch,_=c.run,A=_?.verify_exit??m?.right?.verify_exit??null,$=h.verify_cmd?h.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",G=h.worktree_path?void 0:"This branch has no workspace left to remove.";return i("div",{className:"flex flex-col gap-2",children:[i("div",{className:"flex items-center justify-between gap-2",children:[i("div",{className:"flex items-center gap-2 text-xs",children:[i("span",{className:"font-medium",children:["Branch ",Y(h.id)]}),r("span",{className:`uppercase ${Ke(h.state)}`,children:h.state}),_!==null&&_.verify_exit!==null?i("span",{className:_.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify ",xe(_.verify_exit)]}):null]}),i("div",{className:"flex items-center gap-2 text-xs",children:[r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",title:$,onClick:()=>{K()},disabled:I||!h.verify_cmd||!h.worktree_path,children:"Verify"}),r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",title:G,onClick:()=>{j()},disabled:I||!h.worktree_path,children:"Cleanup"}),r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:u,children:"Hide"})]})]}),c.shared_child?r("div",{className:"rounded border border-amber-600/40 bg-amber-500/5 p-2 text-xs text-(--ui-text)",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,z!==null?r("div",{className:"text-xs text-red-500",children:z}):null,P!==null?i("div",{className:"rounded border border-red-500/50 bg-red-500/5 p-2 text-xs",ref:O,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[r("div",{className:"mb-1 text-(--ui-text-primary)",children:qe(P.uncommitted)}),r("div",{className:"mb-2 break-all text-(--ui-text-tertiary)",children:P.worktree_path}),i("div",{className:"flex items-center gap-2",children:[r("button",{type:"button",className:"rounded border border-red-500/60 px-2 py-1 text-red-500 disabled:opacity-50",onClick:()=>{M(P)},disabled:I,children:"Delete workspace"}),r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:()=>{S(null)},children:"Cancel"})]})]}):null,m!==null?i("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[i("div",{className:"rounded border border-(--ui-border) p-2",children:[i("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",m.left?.frozen_at?` \xB7 frozen ${ie(m.left.frozen_at)}`:""]}),r(Z,{label:"outcome",value:m.left===null?"not recorded":Me(m.left.outcome)}),r(Z,{label:"tokens",value:m.left===null?"n/a":ae(m.left.tokens_in+m.left.tokens_out)}),r(Z,{label:"tool errors",value:m.left===null?"n/a":String(m.left.tool_errors)})]}),i("div",{className:"rounded border border-(--ui-border) p-2",children:[r("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),r(Z,{label:"outcome",value:m.right===null?"not recorded":ce(m.right.outcome)}),r(Z,{label:"verify",value:A===null?"not run":xe(A)}),r(Z,{label:"tokens",value:m.right===null?"n/a":ae(m.right.tokens_in+m.right.tokens_out)}),r(Z,{label:"tool errors",value:m.right===null?"n/a":String(m.right.tool_errors)})]}),i("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",m.verdict]})]}):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:h.state==="cleaned"||h.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),_!==null&&_.verify_out?r("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:_.verify_out}):null,c.prompt!==null?i("details",{className:"text-xs text-(--ui-text-tertiary)",children:[r("summary",{children:"Prompt"}),r("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:c.prompt})]}):null]})}function je({ctx:e}){let t=bt(gt.state.activeSessionId),[o,u]=x([]),[l,c]=x(null),[y,m]=x([]),[L,I]=x(!1),[g,z]=x(!1),[s,P]=x(null),[S,O]=x({}),[K,M]=x([]),[j,h]=x([]),[_,A]=x(null),[$,G]=x(null),[f,k]=x(null),[F,J]=x(null),[N,ee]=x(0),[a,d]=x(null),[D,T]=x(0),[H,te]=x(!1),[ue,X]=x(!1),[R,B]=x(null);W(()=>{let n=null,b=e.onEvent("*",()=>{n===null&&(n=e.setTimeout(()=>{n=null,T(V=>V+1)},1500))});return()=>{b(),n!==null&&n()}},[e]),W(()=>{if(f===null||F!==null)return;let n=b=>{b.key==="Escape"&&!Ve()&&k(null)};return window.addEventListener("keydown",n),()=>{window.removeEventListener("keydown",n)}},[f,F]),W(()=>{let n=!1,b=async()=>{try{let q=await ke(e);if(n)return;u(q),te(!0),d(null),c(oe=>oe!==null&&q.some(pe=>pe.session_id===oe)?oe:t??q[0]?.session_id??null)}catch(q){n||d(E(q))}};b();let V=e.setInterval(()=>{b()},1e4);return()=>{n=!0,V()}},[e,t,N,D]),W(()=>{if(l===null){m([]),X(!1),I(!1),B(null),M([]),h([]);return}let n=!1,b=async()=>{try{let[q,oe,pe]=await Promise.all([ge(e,l),Re(e,l),Ee(e,l)]);if(n)return;m(et=>ve(l,q.items,et)),I(q.has_more),X(!0),M(oe),h(pe),B(null),d(null)}catch(q){n||(X(!0),B(E(q)))}};b();let V=e.setInterval(()=>{b()},1e4);return()=>{n=!0,V()}},[e,l,N,D]),W(()=>{if(_===null){G(null);return}let n=!1;return Se(e,_).then(b=>{n||G(b)}).catch(b=>{n||d(E(b))}),()=>{n=!0}},[e,_]);let v=o.find(n=>n.session_id===l)??null,we=v!==null&&v.ended_at===null,Ye=we&&v.session_id===t,ne=l===null?[]:y.filter(n=>n.session_id===l),Qe=n=>{c(n.session_id),A(null),k(null),P(null),O({}),m([]),X(!1),I(!1),B(null),M([]),h([])},me=()=>{ee(n=>n+1)},Xe=n=>{if(s===n.id){P(null);return}P(n.id),S[n.id]===void 0&&Ne(e,n.session_id,n.seq,n.seq_to).then(b=>{O(V=>({...V,[n.id]:b}))}).catch(b=>{d(E(b))})},Ze=async()=>{let n=ne[ne.length-1];if(!(l===null||n===void 0)){z(!0);try{let b=await ge(e,l,n.seq);m(V=>ve(l,b.items,V)),I(b.has_more)}catch(b){d(E(b))}finally{z(!1)}}};return i("div",{className:"rw-page flex h-full flex-col gap-3 p-3 text-sm",children:[r("style",{children:vt}),i("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[i("div",{children:[r("div",{className:"text-base font-medium",children:"Session Rewind"}),r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),i("div",{className:"flex items-center gap-3 text-xs",children:[v!==null?r("span",{className:"text-(--ui-text-tertiary)",children:v.model??"unknown model"}):null,we?i("span",{className:"flex items-center gap-1 text-emerald-500",children:[r("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),Ye?"live":"running"]}):null,r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:me,children:"Refresh"})]})]}),a!==null?r("div",{className:"text-xs text-red-500",children:a}):null,i("div",{className:"flex min-h-0 flex-1 gap-3",children:[r("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:i("div",{className:"flex flex-col gap-1",children:[i("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:["Sessions",H?r("span",{className:"ml-1",children:Ae(o.length,fe)}):null]}),H?o.length===0?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):o.map(n=>i("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${l===n.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Qe(n)},children:[i("span",{className:"flex items-center gap-1.5",children:[r("span",{className:`h-1.5 w-1.5 rounded-full ${n.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),r("span",{className:"truncate font-medium",children:n.title??Y(n.session_id)})]}),i("span",{className:"truncate text-(--ui-text-tertiary)",children:[n.model??"unknown model"," \xB7 ",C(n.event_count,"event")]}),i("span",{className:"truncate text-(--ui-text-tertiary)",children:[ce(n.outcome)," \xB7"," ",ae(n.tokens_in+n.tokens_out)," tokens"]})]},n.session_id)):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]})}),i("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[v!==null?i("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[i("div",{children:[i("div",{className:"flex items-center gap-2",children:[r("span",{className:"text-base font-medium",children:v.title??Y(v.session_id)}),K.length>0?r("span",{className:"text-xs text-(--ui-text-tertiary)",children:C(K.length,"snapshot")}):null]}),i("div",{className:"text-xs text-(--ui-text-tertiary)",children:[v.model??"unknown model"," \xB7"," ",C(v.event_count,"event")," \xB7"," ",ae(v.tokens_in+v.tokens_out)," tokens",v.ended_at===null?` \xB7 ${Fe(v.last_event_at)}`:""]})]}),r("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,j.length>0?i("div",{className:"flex max-h-24 flex-wrap items-center gap-1 overflow-y-auto",children:[r("span",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),r("span",{className:"text-xs text-(--ui-text-tertiary)",children:j.length}),j.map(n=>i("button",{type:"button",className:`flex items-center gap-2 rounded border px-2 py-1 text-xs ${f===n.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{k(n.id)},children:[r("span",{className:"font-mono",children:Y(n.id)}),r("span",{className:`uppercase ${Ke(n.state)}`,children:n.state}),r("span",{className:"text-(--ui-text-tertiary)",children:n.fork_row_count>0?C(n.fork_row_count,"message"):"context pack"})]},n.id))]}):null,i("div",{className:"flex min-h-0 flex-1 gap-2",children:[r("div",{className:"min-w-0 flex-1 overflow-auto",children:v===null?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):ue?ne.length===0?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:Be(v.event_count,R)}):i(Ge,{children:[ne.map(n=>r(Nt,{turn:n,expanded:s===n.id,events:S[n.id]??null,loading:s===n.id&&S[n.id]===void 0,selectedEventId:_,onToggle:()=>{Xe(n)},onFork:()=>{v!==null&&J({session:v,event:n})},onSelectEvent:b=>{A(b.id)}},n.id)),L?r("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Ze()},disabled:g,children:g?"Loading...":"Load earlier turns"}):i("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[C(ne.length,"turn")," \xB7 start of the recording"]})]}):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),r("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:r(St,{detail:$})})]})]})]}),f!==null?r("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:r(Rt,{ctx:e,branchId:f,refreshTick:N,onClose:()=>{k(null)},onRefresh:me})}):null,F!==null?r(He,{ctx:e,session:F.session,event:F.event,onClose:()=>{J(null)},onCreated:n=>{k(n),me()}}):null]})}import{jsx as Je}from"react/jsx-runtime";var Lt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{Et.navigate(re)};e.registerMany([{id:"page",area:Ct,data:{path:re},render:()=>Je(je,{ctx:e})},{id:"nav",area:It,data:{path:re,label:"Rewind",codicon:"history"}},{id:"palette-open",area:Tt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:Pt,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:$t.right,order:130,render:()=>Je(_e,{})}])}},lr=Lt;export{lr as default};
