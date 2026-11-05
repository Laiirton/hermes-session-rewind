import{host as dt,KEYBINDS_AREA as ct,PALETTE_AREA as mt,ROUTES_AREA as pt,SIDEBAR_NAV_AREA as ft,STATUSBAR_AREAS as gt}from"@hermes/plugin-sdk";import{host as ge,useValue as Ue}from"@hermes/plugin-sdk";var X="/rewind";import{jsx as Oe,jsxs as je}from"react/jsx-runtime";function be(){let e=Ue(ge.state.activeSessionId);return je("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{ge.navigate(X)},title:"Open Session Rewind",children:[Oe("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as tt,useValue as rt}from"@hermes/plugin-sdk";import{useEffect as se,useState as f}from"react";function te(e,t,o){return e.rest(t,{method:"POST",body:o})}async function xe(e){return(await e.rest("/sessions?limit=100")).items}async function ce(e,t,o=null){let a=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${a}`)}async function he(e,t,o,a){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${a+1}`)).items}function ve(e,t){return e.rest(`/events/${t}`)}function we(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function ye(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function _e(e,t){return te(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function ke(e,t,o,a=null){let c=a===null?"":`&before_ts=${a}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${c}`)}function Ne(e,t){return te(e,"/forks/prepare",t)}function Se(e,t,o){return te(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function Re(e,t){return te(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Pe(e,t,o){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(o)}`)}function Te(e,t){return te(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function re(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ne(e){return e.toLocaleString()}function ae(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Ke=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function R(e){let t=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",o=Ke.exec(t),a=o?.[1];if(o===null||a===void 0)return t;let c=We(a);return c===void 0?t:t.replace(o[0],c)}function We(e){try{let t=JSON.parse(e);return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}catch{return}}function K(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as q,useTheme as Ye}from"@hermes/plugin-sdk";import{useEffect as me,useRef as Ee,useState as z}from"react";function Je(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let a=o.text;return typeof a=="string"?a:""}).join("").trim():""}function Ce(e,t){let o=(e??[]).filter(p=>(p.role==="user"||p.role==="assistant")&&Je(p).length>0&&typeof p.row_id=="number"),a=-1;for(let p=0;p<o.length;p+=1){let b=o[p];if(b===void 0)continue;let d=b.timestamp;b.role==="user"&&typeof d=="number"&&d<=t+.5&&(a=p)}if(a<=0)return null;let c=o[a-1]?.row_id;return typeof c=="number"&&c>0?c:null}import{jsx as m,jsxs as h}from"react/jsx-runtime";var Ge=["python -m pytest -q","npm test","cargo test","go test ./..."],Qe=350;function oe(e,t){return t.catch(o=>{throw new Error(`${e}: ${R(o)}`)})}function Xe(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function Ze(e,t){let o=Xe(e),a=o[0],c=o[o.length-1];if(e===null||a===void 0||c===void 0)return;let p=document.activeElement;if(!e.contains(p)){t.preventDefault(),a.focus();return}t.shiftKey&&p===a?(t.preventDefault(),c.focus()):!t.shiftKey&&p===c&&(t.preventDefault(),a.focus())}var et=`
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
`;function Ie({ctx:e,session:t,event:o,onClose:a,onCreated:c}){let p=Ye().resolvedMode==="light",[b,d]=z(t.model??""),[T,C]=z(""),[g,F]=z(""),[i,H]=z(null),[I,P]=z(null),[k,v]=z(null),[A,L]=z(null),[D,w]=z(null),N=k!==null,B=Ee(null),J=Ee(()=>{});me(()=>{let l=document.activeElement;return B.current?.focus(),()=>{l?.focus()}},[]),me(()=>{let l=u=>{if(u.key==="Escape"&&!N){a();return}if(u.key==="Tab"){Ze(B.current,u);return}u.key==="Enter"&&(u.metaKey||u.ctrlKey)&&!N&&(u.preventDefault(),J.current())};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[N,a]),me(()=>{let l=g.trim();if(i===null||l===""){P(null);return}let u=!1,E=e.setTimeout(()=>{Pe(e,i.branch_id,l).then(S=>{u||P(S)}).catch(()=>{u||P(null)})},Qe);return()=>{u=!0,E()}},[e,i,g]);let V=async()=>{let l=await q.request("session.active_list",{}),u=Array.isArray(l.sessions)?l.sessions:[],E=u.find(S=>S.session_key===t.session_id)?.id??u.find(S=>S.id===t.session_id)?.id;if(E===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let S=await q.request("session.title",{session_id:E});return{runtimeId:E,storedId:S.session_key??t.stored_session_id}}catch{return{runtimeId:E,storedId:t.stored_session_id}}},Y=async()=>{v("prepare"),L(null),w(null);try{let l=await V(),u=await Ne(e,{session_id:t.session_id,stored_session_id:l.storedId,event_id:o.id,model:b.trim()||null,provider:null,prompt:T.trim()||null,verify_cmd:g.trim()||null});H(u),C(u.prompt),u.verify_presets.length>0&&g.trim()===""&&F(u.verify_presets[0]??""),u.model!==null&&d(u.model)}catch(l){L(R(l))}finally{v(null)}},Z=async()=>{if(i!==null){v("run"),L(null),w(null);try{let l=await V(),u=l.runtimeId,E=`\u21BA ${t.title??K(t.session_id)}`,S=null;if(u!==void 0)try{let y=await q.request("session.history",{session_id:u});S=Ce(y.messages,i.fork_before_ts)}catch{S=null}let U,O,ie=!1;if(S!==null&&u!==void 0){let y=await oe("could not branch the session",q.request("session.branch",{session_id:u,through_message_id:S}));U=y.session_id,O=y.stored_session_id}else{let y={source:"desktop",title:E};i.worktree_path!==null&&(y.cwd=i.worktree_path),l.storedId!==null&&(y.parent_session_id=l.storedId);let M=await oe("could not create the branch session",q.request("session.create",y));U=M.session_id,O=M.stored_session_id,ie=!0}if(ie&&i.worktree_path!==null){let y=()=>q.request("session.cwd.set",{session_id:U,cwd:i.worktree_path});try{await oe("could not attach the isolated workspace",y())}catch(M){throw M instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${R(M)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(b.trim()&&b.trim()!==(t.model??""))try{let y=await q.request("config.set",{key:"model",value:b.trim(),session_id:U,confirm_expensive_model:!1});y.confirm_required===!0&&w(y.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{w("The branch was created, but the model switch failed; the rerun uses the current model.")}let Q=T.trim()||i.prompt;await oe("could not record the branch",Se(e,i.branch_id,{child_session_id:O,child_stored_session_id:O,model:b.trim()||null,provider:null,prompt:Q,verify_cmd:g.trim()||null})),await oe("could not start the rerun",q.request("prompt.submit",{session_id:U,text:Q})),c(i.branch_id),q.openSession(O,{intent:"tab"}),a()}catch(l){L(R(l))}finally{v(null)}}};J.current=()=>{i===null?Y():Z()};let G=i===null?"not prepared":i.fidelity,le=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return h("div",{className:p?"rw-overlay rw-light":"rw-overlay",onMouseDown:l=>{l.target===l.currentTarget&&!N&&a()},children:[m("style",{children:et}),h("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:B,children:[h("header",{className:"rw-header",children:[h("div",{className:"rw-heading",children:[m("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),h("div",{className:"rw-subtitle",children:[re(o.ts)," \xB7 ",o.preview||"user turn"]})]}),m("button",{type:"button",className:"rw-close",onClick:a,disabled:N,"aria-label":"Close",children:"\xD7"})]}),h("div",{className:"rw-body",children:[A!==null?m("div",{className:"rw-banner rw-banner-error",role:"alert",children:A}):null,D!==null?m("div",{className:"rw-banner rw-banner-warn",role:"status",children:D}):null,h("section",{className:"rw-card",children:[h("div",{className:"rw-card-head",children:[m("span",{className:"rw-card-title",children:"Checkpoint"}),m("span",{className:le,children:G==="full"?"workspace ready":G})]}),h("div",{className:"rw-chips",children:[h("span",{className:"rw-chip",children:["history rows ",i===null?"\u2014":i.fork_row_count]}),h("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?h("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?m("div",{className:"rw-path",children:i.worktree_path}):m("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?m("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?m("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&t.ended_at!==null?m("div",{className:"rw-note rw-note-muted",children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}):null,i!==null&&i.fork_row_count===0?m("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),h("div",{className:"rw-grid",children:[h("label",{className:"rw-field",children:[m("span",{className:"rw-label",children:"Model"}),m("input",{className:"rw-input",value:b,onChange:l=>{d(l.target.value)},placeholder:"provider/model"}),m("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),h("label",{className:"rw-field",children:[m("span",{className:"rw-label",children:"Verify command"}),m("input",{className:"rw-input",value:g,onChange:l=>{F(l.target.value)},placeholder:"python -m pytest -q"}),m("div",{className:"rw-chips",children:(i?.verify_presets.length?i.verify_presets:Ge).map(l=>m("button",{type:"button",className:"rw-preset",onClick:()=>{F(l)},disabled:N,children:l},l))}),m("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),I!==null&&I.command===g.trim()?m("span",{className:"rw-resolved",children:I.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${I.resolved}`}):null]})]}),h("label",{className:"rw-field",children:[m("span",{className:"rw-label",children:"Prompt for the rerun"}),m("textarea",{className:"rw-textarea",value:T,onChange:l=>{C(l.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),m("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),h("footer",{className:"rw-footer",children:[m("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),h("div",{className:"rw-actions",children:[m("button",{type:"button",className:"rw-button",onClick:a,disabled:N,children:"Cancel"}),i===null?m("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{Y()},disabled:N,children:k==="prepare"?"Preparing...":"Prepare branch"}):m("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{Z()},disabled:N,children:k==="run"?"Forking...":"Fork & run"})]})]})]})]})}function pe(e,t){let o=new Set(e.map(a=>a.id));return[...e,...t.filter(a=>!o.has(a.id))]}import{Fragment as Le,jsx as n,jsxs as s}from"react/jsx-runtime";var nt=new Set(["done","failed","cleaned","discarded"]);function ot(e){return ae(Math.max(0,(e.last_ts-e.ts)*1e3))}function st({event:e,selected:t,onSelect:o}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[n("span",{className:`w-16 shrink-0 uppercase ${$e(e.kind,e.status)}`,children:De(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:ae(e.duration_ms)})]})}var it=new Set(["api_request","llm_call"]);function at({turn:e,expanded:t,events:o,loading:a,selectedEventId:c,onToggle:p,onFork:b,onSelectEvent:d}){let T=(o??[]).filter(g=>!it.has(g.kind)),C=(o??[]).length-T.length;return s("div",{className:"border-b border-(--ui-border) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:p,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:re(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),s("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?s("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:ot(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:b,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:a?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s(Le,{children:[T.map(g=>n(st,{event:g,selected:c===g.id,onSelect:()=>{d(g)}},g.id)),C>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function De(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function $e(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Fe(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function W({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function lt({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${$e(e.kind,e.status)}`,children:De(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${ae(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function ut({ctx:e,branchId:t,refreshTick:o,onClose:a,onRefresh:c}){let[p,b]=f(null),[d,T]=f(null),[C,g]=f(!1),[F,i]=f(null);se(()=>{let v=!1,A=null,L=async()=>{try{let w=await _e(e,t);if(v)return!0;b(w),i(null);let N=w.branch.child_session_id;if(N!==null){let B=await ke(e,w.branch.parent_session_id,N,w.branch.fork_before_ts);v||T(B)}else T(null);return nt.has(w.branch.state)}catch(w){return v||i(R(w)),!1}},D=async()=>{let w=await L();!v&&!w&&(A=e.setTimeout(()=>{D()},2500))};return D(),()=>{v=!0,A!==null&&A()}},[e,t,o]);let H=async()=>{g(!0),i(null);try{await Re(e,t),c()}catch(v){i(R(v))}finally{g(!1)}},I=async()=>{g(!0),i(null);try{await Te(e,t),c()}catch(v){i(R(v))}finally{g(!1)}};if(p===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let P=p.branch,k=p.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",K(P.id)]}),n("span",{className:`uppercase ${Fe(P.state)}`,children:P.state}),k!==null&&k.verify_exit!==null?s("span",{className:k.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",k.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{H()},disabled:C||!P.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{I()},disabled:C||P.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:a,children:"Hide"})]})]}),F!==null?n("div",{className:"text-xs text-red-500",children:F}):null,d!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[s("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",d.left?.frozen_at?` \xB7 frozen ${re(d.left.frozen_at)}`:""]}),n(W,{label:"outcome",value:d.left?.outcome??"unknown"}),n(W,{label:"tokens",value:d.left===null?"n/a":ne(d.left.tokens_in+d.left.tokens_out)}),n(W,{label:"tool errors",value:d.left===null?"n/a":String(d.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(W,{label:"outcome",value:d.right?.outcome??"running"}),n(W,{label:"verify",value:d.right?.verify_exit===null||d.right?.verify_exit===void 0?"not run":`exit ${d.right.verify_exit}`}),n(W,{label:"tokens",value:d.right===null?"n/a":ne(d.right.tokens_in+d.right.tokens_out)}),n(W,{label:"tool errors",value:d.right===null?"n/a":String(d.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",d.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),k!==null&&k.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:k.verify_out}):null,p.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:p.prompt})]}):null]})}function Ae({ctx:e}){let t=rt(tt.state.activeSessionId),[o,a]=f([]),[c,p]=f(null),[b,d]=f([]),[T,C]=f(!1),[g,F]=f(!1),[i,H]=f(null),[I,P]=f({}),[k,v]=f([]),[A,L]=f([]),[D,w]=f(null),[N,B]=f(null),[J,V]=f(null),[Y,Z]=f(null),[G,le]=f(0),[l,u]=f(null),[E,S]=f(0),[U,O]=f(!1),[ie,Q]=f(!1),[y,M]=f(null);se(()=>e.onEvent("*",()=>{S(r=>r+1)}),[e]),se(()=>{let r=!1,x=async()=>{try{let $=await xe(e);if(r)return;a($),O(!0),u(null),p(ee=>ee!==null&&$.some(de=>de.session_id===ee)?ee:t??$[0]?.session_id??null)}catch($){r||u(R($))}};x();let j=e.setInterval(()=>{x()},1e4);return()=>{r=!0,j()}},[e,t,G,E]),se(()=>{if(c===null){d([]),Q(!1),C(!1),M(null),v([]),L([]);return}let r=!1,x=async()=>{try{let[$,ee,de]=await Promise.all([ce(e,c),we(e,c),ye(e,c)]);if(r)return;d(Ve=>pe($.items,Ve)),C($.has_more),Q(!0),v(ee),L(de),M(null),u(null)}catch($){r||(Q(!0),M(R($)))}};x();let j=e.setInterval(()=>{x()},1e4);return()=>{r=!0,j()}},[e,c,G,E]),se(()=>{if(D===null){B(null);return}let r=!1;return ve(e,D).then(x=>{r||B(x)}).catch(x=>{r||u(R(x))}),()=>{r=!0}},[e,D]);let _=o.find(r=>r.session_id===c)??null,fe=_!==null&&_.ended_at===null,qe=fe&&_.session_id===t,Be=r=>{p(r.session_id),w(null),V(null),H(null),P({})},ue=()=>{le(r=>r+1)},ze=r=>{if(i===r.id){H(null);return}H(r.id),I[r.id]===void 0&&he(e,r.session_id,r.seq,r.seq_to).then(x=>{P(j=>({...j,[r.id]:x}))}).catch(x=>{u(R(x))})},He=async()=>{let r=b[b.length-1];if(!(c===null||r===void 0)){F(!0);try{let x=await ce(e,c,r.seq);d(j=>pe(x.items,j)),C(x.has_more)}catch(x){u(R(x))}finally{F(!1)}}};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[_!==null?n("span",{className:"text-(--ui-text-tertiary)",children:_.model??"unknown model"}):null,fe?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),qe?"live":"running"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:ue,children:"Refresh"})]})]}),l!==null?n("div",{className:"text-xs text-red-500",children:l}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),U?o.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):o.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${c===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Be(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??K(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",ne(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id)):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]}),A.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),A.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${J===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{V(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:K(r.id)}),n("span",{className:`uppercase ${Fe(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[_!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:_.title??K(_.session_id)}),k.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[k.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[_.model??"unknown model"," \xB7 ",_.event_count," events \xB7 ",ne(_.tokens_in+_.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:_===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):ie?b.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:y===null?"No user turns recorded yet for this session.":`The turns could not be loaded: ${y}`}):s(Le,{children:[b.map(r=>n(at,{turn:r,expanded:i===r.id,events:I[r.id]??null,loading:i===r.id&&I[r.id]===void 0,selectedEventId:D,onToggle:()=>{ze(r)},onFork:()=>{_!==null&&Z({session:_,event:r})},onSelectEvent:x=>{w(x.id)}},r.id)),T?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{He()},disabled:g,children:g?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[b.length," turns \xB7 start of the recording"]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(lt,{detail:N})})]})]})]}),J!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(ut,{ctx:e,branchId:J,refreshTick:G,onClose:()=>{V(null)},onRefresh:ue})}):null,Y!==null?n(Ie,{ctx:e,session:Y.session,event:Y.event,onClose:()=>{Z(null)},onCreated:r=>{V(r),ue()}}):null]})}import{jsx as Me}from"react/jsx-runtime";var bt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{dt.navigate(X)};e.registerMany([{id:"page",area:pt,data:{path:X},render:()=>Me(Ae,{ctx:e})},{id:"nav",area:ft,data:{path:X,label:"Rewind",codicon:"history"}},{id:"palette-open",area:mt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:ct,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:gt.right,order:130,render:()=>Me(be,{})}])}},jt=bt;export{jt as default};
