import{host as xt,KEYBINDS_AREA as ht,PALETTE_AREA as wt,ROUTES_AREA as vt,SIDEBAR_NAV_AREA as yt,STATUSBAR_AREAS as _t}from"@hermes/plugin-sdk";import{host as we,useValue as We}from"@hermes/plugin-sdk";var Z="/rewind";import{jsx as Ge,jsxs as Je}from"react/jsx-runtime";function ve(){let e=We(we.state.activeSessionId);return Je("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{we.navigate(Z)},title:"Open Session Rewind",children:[Ge("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as it,useValue as at}from"@hermes/plugin-sdk";import{useEffect as ee,useState as f}from"react";function oe(e,t,o){return e.rest(t,{method:"POST",body:o})}async function ye(e){return(await e.rest("/sessions?limit=100")).items}async function fe(e,t,o=null){let a=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${a}`)}async function _e(e,t,o,a){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${a+1}`)).items}function ke(e,t){return e.rest(`/events/${t}`)}function Ne(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function Se(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function Re(e,t){return oe(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function Pe(e,t,o,a=null){let l=a===null?"":`&before_ts=${a}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${l}`)}function Te(e,t){return oe(e,"/forks/prepare",t)}function Ce(e,t,o){return oe(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function Ee(e,t){return oe(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Ie(e,t,o){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(o)}`)}function $e(e,t){return oe(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function se(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ie(e){return e.toLocaleString()}function ue(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Ye=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function R(e){let t=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",o=Ye.exec(t),a=o?.[1];if(o===null||a===void 0)return t;let l=Qe(a);return l===void 0?t:t.replace(o[0],l)}function Qe(e){try{let t=JSON.parse(e);return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}catch{return}}function G(e,t=8){return e.length<=t?e:e.slice(0,t)}function T(e,t){return`${e} ${e===1?t:`${t}s`}`}function ge(e){return e===0?"passed":`failed (exit ${e})`}var Xe={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function de(e){return e===null?"recording":Xe[e]??e}import{host as H,useTheme as et}from"@hermes/plugin-sdk";import{useEffect as be,useRef as Le,useState as K}from"react";function Ze(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let a=o.text;return typeof a=="string"?a:""}).join("").trim():""}function De(e,t){let o=(e??[]).filter(c=>(c.role==="user"||c.role==="assistant")&&Ze(c).length>0&&typeof c.row_id=="number"),a=-1;for(let c=0;c<o.length;c+=1){let y=o[c];if(y===void 0)continue;let m=y.timestamp;y.role==="user"&&typeof m=="number"&&m<=t+.5&&(a=c)}if(a<=0)return null;let l=o[a-1]?.row_id;return typeof l=="number"&&l>0?l:null}import{jsx as p,jsxs as v}from"react/jsx-runtime";var tt=["python -m pytest -q","npm test","cargo test","go test ./..."],rt=350;function ae(e,t){return t.catch(o=>{throw new Error(`${e}: ${R(o)}`)})}function nt(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function ot(e,t){let o=nt(e),a=o[0],l=o[o.length-1];if(e===null||a===void 0||l===void 0)return;let c=document.activeElement;if(!e.contains(c)){t.preventDefault(),a.focus();return}t.shiftKey&&c===a?(t.preventDefault(),l.focus()):!t.shiftKey&&c===l&&(t.preventDefault(),a.focus())}var st=`
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
  color: var(--ui-text, #ececf1);
  background: var(--ui-bg, #15161a);
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
  color: var(--ui-text, #ececf1);
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
  color: var(--ui-text, #ececf1);
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
  color: var(--ui-text, #ececf1);
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
  color: var(--ui-text, #ececf1);
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
`;function Ae({ctx:e,session:t,event:o,onClose:a,onCreated:l}){let c=et().resolvedMode==="light",[y,m]=K(t.model??""),[C,E]=K(""),[g,B]=K(""),[s,j]=K(null),[L,x]=K(null),[k,A]=K(null),[U,q]=K(null),[w,I]=K(null),P=k!==null,z=Le(null),h=Le(()=>{});be(()=>{let u=document.activeElement;return z.current?.focus(),()=>{u?.focus()}},[]),be(()=>{let u=d=>{if(d.key==="Escape"&&!P){a();return}if(d.key==="Tab"){ot(z.current,d);return}d.key==="Enter"&&(d.metaKey||d.ctrlKey)&&!P&&(d.preventDefault(),h.current())};return window.addEventListener("keydown",u),()=>{window.removeEventListener("keydown",u)}},[P,a]),be(()=>{let u=g.trim();if(s===null||u===""){x(null);return}let d=!1,D=e.setTimeout(()=>{Ie(e,s.branch_id,u).then(S=>{d||x(S)}).catch(()=>{d||x(null)})},rt);return()=>{d=!0,D()}},[e,s,g]);let $=async()=>{let u=await H.request("session.active_list",{}),d=Array.isArray(u.sessions)?u.sessions:[],D=d.find(S=>S.session_key===t.session_id)?.id??d.find(S=>S.id===t.session_id)?.id;if(D===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let S=await H.request("session.title",{session_id:D});return{runtimeId:D,storedId:S.session_key??t.stored_session_id}}catch{return{runtimeId:D,storedId:t.stored_session_id}}},F=async()=>{A("prepare"),q(null),I(null);try{let u=await $(),d=await Te(e,{session_id:t.session_id,stored_session_id:u.storedId,event_id:o.id,model:y.trim()||null,provider:null,prompt:C.trim()||null,verify_cmd:g.trim()||null});j(d),E(d.prompt),d.verify_presets.length>0&&g.trim()===""&&B(d.verify_presets[0]??""),d.model!==null&&m(d.model)}catch(u){q(R(u))}finally{A(null)}},te=async()=>{if(s!==null){A("run"),q(null),I(null);try{let u=await $(),d=u.runtimeId,D=`\u21BA ${t.title??G(t.session_id)}`,S=null;if(d!==void 0)try{let N=await H.request("session.history",{session_id:d});S=De(N.messages,s.fork_before_ts)}catch{S=null}let O,Q,le=!1;if(S!==null&&d!==void 0){let N=await ae("could not branch the session",H.request("session.branch",{session_id:d,through_message_id:S}));O=N.session_id,Q=N.stored_session_id}else{let N={source:"desktop",title:D};s.worktree_path!==null&&(N.cwd=s.worktree_path),u.storedId!==null&&(N.parent_session_id=u.storedId);let V=await ae("could not create the branch session",H.request("session.create",N));O=V.session_id,Q=V.stored_session_id,le=!0}if(le&&s.worktree_path!==null){let N=()=>H.request("session.cwd.set",{session_id:O,cwd:s.worktree_path});try{await ae("could not attach the isolated workspace",N())}catch(V){throw V instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${R(V)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(y.trim()&&y.trim()!==(t.model??""))try{let N=await H.request("config.set",{key:"model",value:y.trim(),session_id:O,confirm_expensive_model:!1});N.confirm_required===!0&&I(N.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{I("The branch was created, but the model switch failed; the rerun uses the current model.")}let X=C.trim()||s.prompt;await ae("could not record the branch",Ce(e,s.branch_id,{child_session_id:O,child_stored_session_id:Q,model:y.trim()||null,provider:null,prompt:X,verify_cmd:g.trim()||null})),await ae("could not start the rerun",H.request("prompt.submit",{session_id:O,text:X})),l(s.branch_id),H.openSession(Q,{intent:"tab"}),a()}catch(u){q(R(u))}finally{A(null)}}};h.current=()=>{s===null?F():te()};let Y=s===null?"not prepared":s.fidelity,ce=s===null?"rw-badge rw-badge-idle":s.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return v("div",{className:c?"rw-overlay rw-light":"rw-overlay",onMouseDown:u=>{u.target===u.currentTarget&&!P&&a()},children:[p("style",{children:st}),v("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:z,children:[v("header",{className:"rw-header",children:[v("div",{className:"rw-heading",children:[p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),v("div",{className:"rw-subtitle",children:[se(o.ts)," \xB7 ",o.preview||"user turn"]})]}),p("button",{type:"button",className:"rw-close",onClick:a,disabled:P,"aria-label":"Close",children:"\xD7"})]}),v("div",{className:"rw-body",children:[U!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:U}):null,w!==null?p("div",{className:"rw-banner rw-banner-warn",role:"status",children:w}):null,v("section",{className:"rw-card",children:[v("div",{className:"rw-card-head",children:[p("span",{className:"rw-card-title",children:"Checkpoint"}),p("span",{className:ce,children:Y==="full"?"workspace ready":Y})]}),v("div",{className:"rw-chips",children:[p("span",{className:"rw-chip",children:s===null?"carries \u2014":s.fork_row_count>0?`carries ${T(s.fork_row_count,"message")}`:"carries the context pack"}),v("span",{className:"rw-chip",children:["verify timeout ",s===null?"\u2014":`${s.verify_timeout_seconds}s`]}),s?.snapshot_commit?v("span",{className:"rw-chip",children:["snapshot ",s.snapshot_commit.slice(0,8)]}):null]}),s?.worktree_path?p("div",{className:"rw-path",children:s.worktree_path}):p("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),s!==null&&s.fidelity!=="full"?p("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,s!==null&&s.context_rows===null?p("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,s!==null&&t.ended_at!==null?p("div",{className:"rw-note rw-note-muted",children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}):null,s!==null&&s.fork_row_count===0&&t.ended_at===null?p("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),v("div",{className:"rw-grid",children:[v("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Model"}),p("input",{className:"rw-input",value:y,onChange:u=>{m(u.target.value)},placeholder:"provider/model"}),p("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),v("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:g,onChange:u=>{B(u.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(s?.verify_presets.length?s.verify_presets:tt).map(u=>p("button",{type:"button",className:"rw-preset",onClick:()=>{B(u)},disabled:P,children:u},u))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),L!==null&&L.command===g.trim()?p("span",{className:"rw-resolved",children:L.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${L.resolved}`}):null]})]}),v("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),p("textarea",{className:"rw-textarea",value:C,onChange:u=>{E(u.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),p("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),v("footer",{className:"rw-footer",children:[p("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),v("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:a,disabled:P,children:"Cancel"}),s===null?p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{F()},disabled:P,children:k==="prepare"?"Preparing...":"Prepare branch"}):p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{te()},disabled:P,children:k==="run"?"Forking...":"Fork & run"})]})]})]})]})}function xe(e,t,o){let a=new Set(t.map(c=>c.id)),l=o.filter(c=>c.session_id===e&&!a.has(c.id));return[...t,...l]}import{Fragment as ze,jsx as r,jsxs as i}from"react/jsx-runtime";var lt=`
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
`,ut=new Set(["done","failed","cleaned","discarded"]);function dt(e){return ue(Math.max(0,(e.work_ts-e.ts)*1e3))}function ct(e,t){return t!==null?`The turns could not be loaded: ${t}`:e.event_count===0?"No user turns recorded yet for this session.":`The recording holds ${T(e.event_count,"event")} but no user turns came back. Choose Refresh.`}function mt({event:e,selected:t,onSelect:o}){return i("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[r("span",{title:e.kind,className:`w-20 shrink-0 truncate uppercase ${Me(e.kind,e.status)}`,children:Fe(e.kind)}),r("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),r("span",{className:"w-14 shrink-0 text-right font-mono",children:ue(e.duration_ms)})]})}var pt=new Set(["api_request","llm_call"]);function ft({turn:e,expanded:t,events:o,loading:a,selectedEventId:l,onToggle:c,onFork:y,onSelectEvent:m}){let C=(o??[]).filter(g=>!pt.has(g.kind)),E=(o??[]).length-C.length;return i("div",{className:"border-b border-(--ui-border) pb-1",children:[i("div",{className:"flex items-center gap-2",children:[i("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:c,"aria-expanded":t,children:[r("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),r("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:se(e.ts)}),r("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),r("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:T(e.tool_calls,"tool")}),e.tool_errors>0?r("span",{className:"shrink-0 text-xs text-red-500",children:T(e.tool_errors,"error")}):null,r("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:dt(e)})]}),r("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:y,children:"Rewind"})]}),t?r("div",{className:"flex flex-col gap-0.5 pb-1",children:a?r("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):i(ze,{children:[C.map(g=>r(mt,{event:g,selected:l===g.id,onSelect:()=>{m(g)}},g.id)),E>0?i("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[T(e.api_requests,"model request")," \xB7",T(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Fe(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function Me(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Be(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function J({label:e,value:t}){return i("div",{className:"flex items-center justify-between gap-2",children:[r("span",{className:"text-(--ui-text-tertiary)",children:e}),r("span",{className:"font-mono tabular-nums",children:t})]})}function gt({detail:e}){return e===null?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):i("div",{className:"flex flex-col gap-2",children:[i("div",{className:"flex items-center justify-between gap-2 text-xs",children:[r("span",{className:`font-medium ${Me(e.kind,e.status)}`,children:Fe(e.kind)}),i("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),i("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${ue(e.duration_ms)}`:""]}),r("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function bt({ctx:e,branchId:t,refreshTick:o,onClose:a,onRefresh:l}){let[c,y]=f(null),[m,C]=f(null),[E,g]=f(!1),[B,s]=f(null);ee(()=>{let w=!1,I=null,P=async()=>{try{let h=await Re(e,t);if(w)return!0;y(h),s(null);let $=h.branch.child_session_id;if($!==null){let F=await Pe(e,h.branch.parent_session_id,$,h.branch.fork_before_ts);w||C(F)}else C(null);return ut.has(h.branch.state)}catch(h){return w||s(R(h)),!1}},z=async()=>{let h=await P();!w&&!h&&(I=e.setTimeout(()=>{z()},2500))};return z(),()=>{w=!0,I!==null&&I()}},[e,t,o]);let j=async()=>{g(!0),s(null);try{await Ee(e,t),l()}catch(w){s(R(w))}finally{g(!1)}},L=async()=>{g(!0),s(null);try{await $e(e,t),l()}catch(w){s(R(w))}finally{g(!1)}};if(c===null)return r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let x=c.branch,k=c.run,A=k?.verify_exit??m?.right?.verify_exit??null,U=x.verify_cmd?x.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",q=x.worktree_path?void 0:"This branch has no workspace left to remove.";return i("div",{className:"flex flex-col gap-2",children:[i("div",{className:"flex items-center justify-between gap-2",children:[i("div",{className:"flex items-center gap-2 text-xs",children:[i("span",{className:"font-medium",children:["Branch ",G(x.id)]}),r("span",{className:`uppercase ${Be(x.state)}`,children:x.state}),k!==null&&k.verify_exit!==null?i("span",{className:k.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify ",ge(k.verify_exit)]}):null]}),i("div",{className:"flex items-center gap-2 text-xs",children:[r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",title:U,onClick:()=>{j()},disabled:E||!x.verify_cmd||!x.worktree_path,children:"Verify"}),r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",title:q,onClick:()=>{L()},disabled:E||!x.worktree_path,children:"Cleanup"}),r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:a,children:"Hide"})]})]}),c.shared_child?r("div",{className:"rounded border border-amber-600/40 bg-amber-500/5 p-2 text-xs text-(--ui-text)",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,B!==null?r("div",{className:"text-xs text-red-500",children:B}):null,m!==null?i("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[i("div",{className:"rounded border border-(--ui-border) p-2",children:[i("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",m.left?.frozen_at?` \xB7 frozen ${se(m.left.frozen_at)}`:""]}),r(J,{label:"outcome",value:m.left===null?"unknown":de(m.left.outcome)}),r(J,{label:"tokens",value:m.left===null?"n/a":ie(m.left.tokens_in+m.left.tokens_out)}),r(J,{label:"tool errors",value:m.left===null?"n/a":String(m.left.tool_errors)})]}),i("div",{className:"rounded border border-(--ui-border) p-2",children:[r("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),r(J,{label:"outcome",value:m.right===null?"running":de(m.right.outcome)}),r(J,{label:"verify",value:A===null?"not run":ge(A)}),r(J,{label:"tokens",value:m.right===null?"n/a":ie(m.right.tokens_in+m.right.tokens_out)}),r(J,{label:"tool errors",value:m.right===null?"n/a":String(m.right.tool_errors)})]}),i("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",m.verdict]})]}):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:x.state==="cleaned"||x.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),k!==null&&k.verify_out?r("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:k.verify_out}):null,c.prompt!==null?i("details",{className:"text-xs text-(--ui-text-tertiary)",children:[r("summary",{children:"Prompt"}),r("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:c.prompt})]}):null]})}function qe({ctx:e}){let t=at(it.state.activeSessionId),[o,a]=f([]),[l,c]=f(null),[y,m]=f([]),[C,E]=f(!1),[g,B]=f(!1),[s,j]=f(null),[L,x]=f({}),[k,A]=f([]),[U,q]=f([]),[w,I]=f(null),[P,z]=f(null),[h,$]=f(null),[F,te]=f(null),[Y,ce]=f(0),[u,d]=f(null),[D,S]=f(0),[O,Q]=f(!1),[le,X]=f(!1),[N,V]=f(null);ee(()=>e.onEvent("*",()=>{S(n=>n+1)}),[e]),ee(()=>{if(h===null||F!==null)return;let n=b=>{b.key==="Escape"&&$(null)};return window.addEventListener("keydown",n),()=>{window.removeEventListener("keydown",n)}},[h,F]),ee(()=>{let n=!1,b=async()=>{try{let M=await ye(e);if(n)return;a(M),Q(!0),d(null),c(ne=>ne!==null&&M.some(pe=>pe.session_id===ne)?ne:t??M[0]?.session_id??null)}catch(M){n||d(R(M))}};b();let W=e.setInterval(()=>{b()},1e4);return()=>{n=!0,W()}},[e,t,Y,D]),ee(()=>{if(l===null){m([]),X(!1),E(!1),V(null),A([]),q([]);return}let n=!1,b=async()=>{try{let[M,ne,pe]=await Promise.all([fe(e,l),Ne(e,l),Se(e,l)]);if(n)return;m(je=>xe(l,M.items,je)),E(M.has_more),X(!0),A(ne),q(pe),V(null),d(null)}catch(M){n||(X(!0),V(R(M)))}};b();let W=e.setInterval(()=>{b()},1e4);return()=>{n=!0,W()}},[e,l,Y,D]),ee(()=>{if(w===null){z(null);return}let n=!1;return ke(e,w).then(b=>{n||z(b)}).catch(b=>{n||d(R(b))}),()=>{n=!0}},[e,w]);let _=o.find(n=>n.session_id===l)??null,he=_!==null&&_.ended_at===null,He=he&&_.session_id===t,re=l===null?[]:y.filter(n=>n.session_id===l),Ue=n=>{c(n.session_id),I(null),$(null),j(null),x({})},me=()=>{ce(n=>n+1)},Oe=n=>{if(s===n.id){j(null);return}j(n.id),L[n.id]===void 0&&_e(e,n.session_id,n.seq,n.seq_to).then(b=>{x(W=>({...W,[n.id]:b}))}).catch(b=>{d(R(b))})},Ke=async()=>{let n=re[re.length-1];if(!(l===null||n===void 0)){B(!0);try{let b=await fe(e,l,n.seq);m(W=>xe(l,b.items,W)),E(b.has_more)}catch(b){d(R(b))}finally{B(!1)}}};return i("div",{className:"rw-page flex h-full flex-col gap-3 p-3 text-sm",children:[r("style",{children:lt}),i("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[i("div",{children:[r("div",{className:"text-base font-medium",children:"Session Rewind"}),r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),i("div",{className:"flex items-center gap-3 text-xs",children:[_!==null?r("span",{className:"text-(--ui-text-tertiary)",children:_.model??"unknown model"}):null,he?i("span",{className:"flex items-center gap-1 text-emerald-500",children:[r("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),He?"live":"running"]}):null,r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:me,children:"Refresh"})]})]}),u!==null?r("div",{className:"text-xs text-red-500",children:u}):null,i("div",{className:"flex min-h-0 flex-1 gap-3",children:[r("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:i("div",{className:"flex flex-col gap-1",children:[r("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),O?o.length===0?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):o.map(n=>i("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${l===n.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Ue(n)},children:[i("span",{className:"flex items-center gap-1.5",children:[r("span",{className:`h-1.5 w-1.5 rounded-full ${n.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),r("span",{className:"truncate font-medium",children:n.title??G(n.session_id)})]}),i("span",{className:"truncate text-(--ui-text-tertiary)",children:[n.model??"unknown model"," \xB7 ",T(n.event_count,"event")]}),i("span",{className:"truncate text-(--ui-text-tertiary)",children:[de(n.outcome)," \xB7"," ",ie(n.tokens_in+n.tokens_out)," tokens"]})]},n.session_id)):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]})}),i("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[_!==null?i("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[i("div",{children:[i("div",{className:"flex items-center gap-2",children:[r("span",{className:"text-base font-medium",children:_.title??G(_.session_id)}),k.length>0?r("span",{className:"text-xs text-(--ui-text-tertiary)",children:T(k.length,"snapshot")}):null]}),i("div",{className:"text-xs text-(--ui-text-tertiary)",children:[_.model??"unknown model"," \xB7"," ",T(_.event_count,"event")," \xB7"," ",ie(_.tokens_in+_.tokens_out)," tokens"]})]}),r("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,U.length>0?i("div",{className:"flex max-h-24 flex-wrap items-center gap-1 overflow-y-auto",children:[r("span",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),r("span",{className:"text-xs text-(--ui-text-tertiary)",children:U.length}),U.map(n=>i("button",{type:"button",className:`flex items-center gap-2 rounded border px-2 py-1 text-xs ${h===n.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{$(n.id)},children:[r("span",{className:"font-mono",children:G(n.id)}),r("span",{className:`uppercase ${Be(n.state)}`,children:n.state}),r("span",{className:"text-(--ui-text-tertiary)",children:n.fork_row_count>0?T(n.fork_row_count,"message"):"context pack"})]},n.id))]}):null,i("div",{className:"flex min-h-0 flex-1 gap-2",children:[r("div",{className:"min-w-0 flex-1 overflow-auto",children:_===null?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):le?re.length===0?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:ct(_,N)}):i(ze,{children:[re.map(n=>r(ft,{turn:n,expanded:s===n.id,events:L[n.id]??null,loading:s===n.id&&L[n.id]===void 0,selectedEventId:w,onToggle:()=>{Oe(n)},onFork:()=>{_!==null&&te({session:_,event:n})},onSelectEvent:b=>{I(b.id)}},n.id)),C?r("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Ke()},disabled:g,children:g?"Loading...":"Load earlier turns"}):i("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[T(re.length,"turn")," \xB7 start of the recording"]})]}):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),r("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:r(gt,{detail:P})})]})]})]}),h!==null?r("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:r(bt,{ctx:e,branchId:h,refreshTick:Y,onClose:()=>{$(null)},onRefresh:me})}):null,F!==null?r(Ae,{ctx:e,session:F.session,event:F.event,onClose:()=>{te(null)},onCreated:n=>{$(n),me()}}):null]})}import{jsx as Ve}from"react/jsx-runtime";var kt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{xt.navigate(Z)};e.registerMany([{id:"page",area:vt,data:{path:Z},render:()=>Ve(qe,{ctx:e})},{id:"nav",area:yt,data:{path:Z,label:"Rewind",codicon:"history"}},{id:"palette-open",area:wt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:ht,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:_t.right,order:130,render:()=>Ve(ve,{})}])}},Xt=kt;export{Xt as default};
