import{host as ct,KEYBINDS_AREA as mt,PALETTE_AREA as pt,ROUTES_AREA as ft,SIDEBAR_NAV_AREA as gt,STATUSBAR_AREAS as bt}from"@hermes/plugin-sdk";import{host as be,useValue as Oe}from"@hermes/plugin-sdk";var X="/rewind";import{jsx as je,jsxs as Ke}from"react/jsx-runtime";function xe(){let e=Oe(be.state.activeSessionId);return Ke("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{be.navigate(X)},title:"Open Session Rewind",children:[je("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as rt,useValue as nt}from"@hermes/plugin-sdk";import{useEffect as ie,useState as f}from"react";function re(e,t,o){return e.rest(t,{method:"POST",body:o})}async function he(e){return(await e.rest("/sessions?limit=100")).items}async function me(e,t,o=null){let a=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${a}`)}async function ve(e,t,o,a){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${a+1}`)).items}function we(e,t){return e.rest(`/events/${t}`)}function ye(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function _e(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function ke(e,t){return re(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function Ne(e,t,o,a=null){let l=a===null?"":`&before_ts=${a}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${l}`)}function Se(e,t){return re(e,"/forks/prepare",t)}function Re(e,t,o){return re(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function Pe(e,t){return re(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Te(e,t,o){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(o)}`)}function Ce(e,t){return re(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function ne(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function oe(e){return e.toLocaleString()}function le(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var We=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function R(e){let t=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",o=We.exec(t),a=o?.[1];if(o===null||a===void 0)return t;let l=Je(a);return l===void 0?t:t.replace(o[0],l)}function Je(e){try{let t=JSON.parse(e);return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}catch{return}}function K(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as q,useTheme as Ge}from"@hermes/plugin-sdk";import{useEffect as pe,useRef as Ie,useState as z}from"react";function Ye(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let a=o.text;return typeof a=="string"?a:""}).join("").trim():""}function Ee(e,t){let o=(e??[]).filter(c=>(c.role==="user"||c.role==="assistant")&&Ye(c).length>0&&typeof c.row_id=="number"),a=-1;for(let c=0;c<o.length;c+=1){let w=o[c];if(w===void 0)continue;let m=w.timestamp;w.role==="user"&&typeof m=="number"&&m<=t+.5&&(a=c)}if(a<=0)return null;let l=o[a-1]?.row_id;return typeof l=="number"&&l>0?l:null}import{jsx as p,jsxs as x}from"react/jsx-runtime";var Qe=["python -m pytest -q","npm test","cargo test","go test ./..."],Xe=350;function se(e,t){return t.catch(o=>{throw new Error(`${e}: ${R(o)}`)})}function Ze(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function et(e,t){let o=Ze(e),a=o[0],l=o[o.length-1];if(e===null||a===void 0||l===void 0)return;let c=document.activeElement;if(!e.contains(c)){t.preventDefault(),a.focus();return}t.shiftKey&&c===a?(t.preventDefault(),l.focus()):!t.shiftKey&&c===l&&(t.preventDefault(),a.focus())}var tt=`
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
`;function De({ctx:e,session:t,event:o,onClose:a,onCreated:l}){let c=Ge().resolvedMode==="light",[w,m]=z(t.model??""),[T,C]=z(""),[g,F]=z(""),[i,H]=z(null),[I,P]=z(null),[k,h]=z(null),[A,L]=z(null),[D,v]=z(null),N=k!==null,B=Ie(null),J=Ie(()=>{});pe(()=>{let u=document.activeElement;return B.current?.focus(),()=>{u?.focus()}},[]),pe(()=>{let u=d=>{if(d.key==="Escape"&&!N){a();return}if(d.key==="Tab"){et(B.current,d);return}d.key==="Enter"&&(d.metaKey||d.ctrlKey)&&!N&&(d.preventDefault(),J.current())};return window.addEventListener("keydown",u),()=>{window.removeEventListener("keydown",u)}},[N,a]),pe(()=>{let u=g.trim();if(i===null||u===""){P(null);return}let d=!1,E=e.setTimeout(()=>{Te(e,i.branch_id,u).then(S=>{d||P(S)}).catch(()=>{d||P(null)})},Xe);return()=>{d=!0,E()}},[e,i,g]);let V=async()=>{let u=await q.request("session.active_list",{}),d=Array.isArray(u.sessions)?u.sessions:[],E=d.find(S=>S.session_key===t.session_id)?.id??d.find(S=>S.id===t.session_id)?.id;if(E===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let S=await q.request("session.title",{session_id:E});return{runtimeId:E,storedId:S.session_key??t.stored_session_id}}catch{return{runtimeId:E,storedId:t.stored_session_id}}},Y=async()=>{h("prepare"),L(null),v(null);try{let u=await V(),d=await Se(e,{session_id:t.session_id,stored_session_id:u.storedId,event_id:o.id,model:w.trim()||null,provider:null,prompt:T.trim()||null,verify_cmd:g.trim()||null});H(d),C(d.prompt),d.verify_presets.length>0&&g.trim()===""&&F(d.verify_presets[0]??""),d.model!==null&&m(d.model)}catch(u){L(R(u))}finally{h(null)}},Z=async()=>{if(i!==null){h("run"),L(null),v(null);try{let u=await V(),d=u.runtimeId,E=`\u21BA ${t.title??K(t.session_id)}`,S=null;if(d!==void 0)try{let y=await q.request("session.history",{session_id:d});S=Ee(y.messages,i.fork_before_ts)}catch{S=null}let U,O,ae=!1;if(S!==null&&d!==void 0){let y=await se("could not branch the session",q.request("session.branch",{session_id:d,through_message_id:S}));U=y.session_id,O=y.stored_session_id}else{let y={source:"desktop",title:E};i.worktree_path!==null&&(y.cwd=i.worktree_path),u.storedId!==null&&(y.parent_session_id=u.storedId);let M=await se("could not create the branch session",q.request("session.create",y));U=M.session_id,O=M.stored_session_id,ae=!0}if(ae&&i.worktree_path!==null){let y=()=>q.request("session.cwd.set",{session_id:U,cwd:i.worktree_path});try{await se("could not attach the isolated workspace",y())}catch(M){throw M instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${R(M)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(w.trim()&&w.trim()!==(t.model??""))try{let y=await q.request("config.set",{key:"model",value:w.trim(),session_id:U,confirm_expensive_model:!1});y.confirm_required===!0&&v(y.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{v("The branch was created, but the model switch failed; the rerun uses the current model.")}let Q=T.trim()||i.prompt;await se("could not record the branch",Re(e,i.branch_id,{child_session_id:O,child_stored_session_id:O,model:w.trim()||null,provider:null,prompt:Q,verify_cmd:g.trim()||null})),await se("could not start the rerun",q.request("prompt.submit",{session_id:U,text:Q})),l(i.branch_id),q.openSession(O,{intent:"tab"}),a()}catch(u){L(R(u))}finally{h(null)}}};J.current=()=>{i===null?Y():Z()};let G=i===null?"not prepared":i.fidelity,ue=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return x("div",{className:c?"rw-overlay rw-light":"rw-overlay",onMouseDown:u=>{u.target===u.currentTarget&&!N&&a()},children:[p("style",{children:tt}),x("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:B,children:[x("header",{className:"rw-header",children:[x("div",{className:"rw-heading",children:[p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),x("div",{className:"rw-subtitle",children:[ne(o.ts)," \xB7 ",o.preview||"user turn"]})]}),p("button",{type:"button",className:"rw-close",onClick:a,disabled:N,"aria-label":"Close",children:"\xD7"})]}),x("div",{className:"rw-body",children:[A!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:A}):null,D!==null?p("div",{className:"rw-banner rw-banner-warn",role:"status",children:D}):null,x("section",{className:"rw-card",children:[x("div",{className:"rw-card-head",children:[p("span",{className:"rw-card-title",children:"Checkpoint"}),p("span",{className:ue,children:G==="full"?"workspace ready":G})]}),x("div",{className:"rw-chips",children:[x("span",{className:"rw-chip",children:["history rows ",i===null?"\u2014":i.fork_row_count]}),x("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?x("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?p("div",{className:"rw-path",children:i.worktree_path}):p("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?p("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?p("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&t.ended_at!==null?p("div",{className:"rw-note rw-note-muted",children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}):null,i!==null&&i.fork_row_count===0?p("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),x("div",{className:"rw-grid",children:[x("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Model"}),p("input",{className:"rw-input",value:w,onChange:u=>{m(u.target.value)},placeholder:"provider/model"}),p("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),x("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:g,onChange:u=>{F(u.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(i?.verify_presets.length?i.verify_presets:Qe).map(u=>p("button",{type:"button",className:"rw-preset",onClick:()=>{F(u)},disabled:N,children:u},u))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),I!==null&&I.command===g.trim()?p("span",{className:"rw-resolved",children:I.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${I.resolved}`}):null]})]}),x("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),p("textarea",{className:"rw-textarea",value:T,onChange:u=>{C(u.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),p("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),x("footer",{className:"rw-footer",children:[p("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),x("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:a,disabled:N,children:"Cancel"}),i===null?p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{Y()},disabled:N,children:k==="prepare"?"Preparing...":"Prepare branch"}):p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{Z()},disabled:N,children:k==="run"?"Forking...":"Fork & run"})]})]})]})]})}function fe(e,t,o){let a=new Set(t.map(c=>c.id)),l=o.filter(c=>c.session_id===e&&!a.has(c.id));return[...t,...l]}import{Fragment as Me,jsx as n,jsxs as s}from"react/jsx-runtime";var ot=new Set(["done","failed","cleaned","discarded"]);function st(e){return le(Math.max(0,(e.last_ts-e.ts)*1e3))}function it({event:e,selected:t,onSelect:o}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[n("span",{className:`w-16 shrink-0 uppercase ${Fe(e.kind,e.status)}`,children:$e(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:le(e.duration_ms)})]})}var at=new Set(["api_request","llm_call"]);function lt({turn:e,expanded:t,events:o,loading:a,selectedEventId:l,onToggle:c,onFork:w,onSelectEvent:m}){let T=(o??[]).filter(g=>!at.has(g.kind)),C=(o??[]).length-T.length;return s("div",{className:"border-b border-(--ui-border) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:c,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:ne(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),s("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?s("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:st(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:w,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:a?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s(Me,{children:[T.map(g=>n(it,{event:g,selected:l===g.id,onSelect:()=>{m(g)}},g.id)),C>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function $e(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function Fe(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Ae(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function W({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function ut({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${Fe(e.kind,e.status)}`,children:$e(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${le(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function dt({ctx:e,branchId:t,refreshTick:o,onClose:a,onRefresh:l}){let[c,w]=f(null),[m,T]=f(null),[C,g]=f(!1),[F,i]=f(null);ie(()=>{let h=!1,A=null,L=async()=>{try{let v=await ke(e,t);if(h)return!0;w(v),i(null);let N=v.branch.child_session_id;if(N!==null){let B=await Ne(e,v.branch.parent_session_id,N,v.branch.fork_before_ts);h||T(B)}else T(null);return ot.has(v.branch.state)}catch(v){return h||i(R(v)),!1}},D=async()=>{let v=await L();!h&&!v&&(A=e.setTimeout(()=>{D()},2500))};return D(),()=>{h=!0,A!==null&&A()}},[e,t,o]);let H=async()=>{g(!0),i(null);try{await Pe(e,t),l()}catch(h){i(R(h))}finally{g(!1)}},I=async()=>{g(!0),i(null);try{await Ce(e,t),l()}catch(h){i(R(h))}finally{g(!1)}};if(c===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let P=c.branch,k=c.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",K(P.id)]}),n("span",{className:`uppercase ${Ae(P.state)}`,children:P.state}),k!==null&&k.verify_exit!==null?s("span",{className:k.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",k.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{H()},disabled:C||!P.verify_cmd||!P.worktree_path,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{I()},disabled:C||!P.worktree_path,children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:a,children:"Hide"})]})]}),F!==null?n("div",{className:"text-xs text-red-500",children:F}):null,m!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[s("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",m.left?.frozen_at?` \xB7 frozen ${ne(m.left.frozen_at)}`:""]}),n(W,{label:"outcome",value:m.left?.outcome??"unknown"}),n(W,{label:"tokens",value:m.left===null?"n/a":oe(m.left.tokens_in+m.left.tokens_out)}),n(W,{label:"tool errors",value:m.left===null?"n/a":String(m.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(W,{label:"outcome",value:m.right?.outcome??"running"}),n(W,{label:"verify",value:m.right?.verify_exit===null||m.right?.verify_exit===void 0?"not run":`exit ${m.right.verify_exit}`}),n(W,{label:"tokens",value:m.right===null?"n/a":oe(m.right.tokens_in+m.right.tokens_out)}),n(W,{label:"tool errors",value:m.right===null?"n/a":String(m.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",m.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),k!==null&&k.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:k.verify_out}):null,c.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:c.prompt})]}):null]})}function Le({ctx:e}){let t=nt(rt.state.activeSessionId),[o,a]=f([]),[l,c]=f(null),[w,m]=f([]),[T,C]=f(!1),[g,F]=f(!1),[i,H]=f(null),[I,P]=f({}),[k,h]=f([]),[A,L]=f([]),[D,v]=f(null),[N,B]=f(null),[J,V]=f(null),[Y,Z]=f(null),[G,ue]=f(0),[u,d]=f(null),[E,S]=f(0),[U,O]=f(!1),[ae,Q]=f(!1),[y,M]=f(null);ie(()=>e.onEvent("*",()=>{S(r=>r+1)}),[e]),ie(()=>{let r=!1,b=async()=>{try{let $=await he(e);if(r)return;a($),O(!0),d(null),c(te=>te!==null&&$.some(ce=>ce.session_id===te)?te:t??$[0]?.session_id??null)}catch($){r||d(R($))}};b();let j=e.setInterval(()=>{b()},1e4);return()=>{r=!0,j()}},[e,t,G,E]),ie(()=>{if(l===null){m([]),Q(!1),C(!1),M(null),h([]),L([]);return}let r=!1,b=async()=>{try{let[$,te,ce]=await Promise.all([me(e,l),ye(e,l),_e(e,l)]);if(r)return;m(Ue=>fe(l,$.items,Ue)),C($.has_more),Q(!0),h(te),L(ce),M(null),d(null)}catch($){r||(Q(!0),M(R($)))}};b();let j=e.setInterval(()=>{b()},1e4);return()=>{r=!0,j()}},[e,l,G,E]),ie(()=>{if(D===null){B(null);return}let r=!1;return we(e,D).then(b=>{r||B(b)}).catch(b=>{r||d(R(b))}),()=>{r=!0}},[e,D]);let _=o.find(r=>r.session_id===l)??null,ge=_!==null&&_.ended_at===null,Be=ge&&_.session_id===t,ee=l===null?[]:w.filter(r=>r.session_id===l),ze=r=>{c(r.session_id),v(null),V(null),H(null),P({})},de=()=>{ue(r=>r+1)},He=r=>{if(i===r.id){H(null);return}H(r.id),I[r.id]===void 0&&ve(e,r.session_id,r.seq,r.seq_to).then(b=>{P(j=>({...j,[r.id]:b}))}).catch(b=>{d(R(b))})},Ve=async()=>{let r=ee[ee.length-1];if(!(l===null||r===void 0)){F(!0);try{let b=await me(e,l,r.seq);m(j=>fe(l,b.items,j)),C(b.has_more)}catch(b){d(R(b))}finally{F(!1)}}};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[_!==null?n("span",{className:"text-(--ui-text-tertiary)",children:_.model??"unknown model"}):null,ge?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),Be?"live":"running"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:de,children:"Refresh"})]})]}),u!==null?n("div",{className:"text-xs text-red-500",children:u}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),U?o.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):o.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${l===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{ze(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??K(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",oe(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id)):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]}),A.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),A.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${J===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{V(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:K(r.id)}),n("span",{className:`uppercase ${Ae(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[_!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:_.title??K(_.session_id)}),k.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[k.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[_.model??"unknown model"," \xB7 ",_.event_count," events \xB7 ",oe(_.tokens_in+_.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:_===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):ae?ee.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:y===null?"No user turns recorded yet for this session.":`The turns could not be loaded: ${y}`}):s(Me,{children:[ee.map(r=>n(lt,{turn:r,expanded:i===r.id,events:I[r.id]??null,loading:i===r.id&&I[r.id]===void 0,selectedEventId:D,onToggle:()=>{He(r)},onFork:()=>{_!==null&&Z({session:_,event:r})},onSelectEvent:b=>{v(b.id)}},r.id)),T?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Ve()},disabled:g,children:g?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[ee.length," turns \xB7 start of the recording"]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(ut,{detail:N})})]})]})]}),J!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(dt,{ctx:e,branchId:J,refreshTick:G,onClose:()=>{V(null)},onRefresh:de})}):null,Y!==null?n(De,{ctx:e,session:Y.session,event:Y.event,onClose:()=>{Z(null)},onCreated:r=>{V(r),de()}}):null]})}import{jsx as qe}from"react/jsx-runtime";var xt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{ct.navigate(X)};e.registerMany([{id:"page",area:ft,data:{path:X},render:()=>qe(Le,{ctx:e})},{id:"nav",area:gt,data:{path:X,label:"Rewind",codicon:"history"}},{id:"palette-open",area:pt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:mt,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:bt.right,order:130,render:()=>qe(xe,{})}])}},Kt=xt;export{Kt as default};
