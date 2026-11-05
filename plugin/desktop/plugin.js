import{host as dt,KEYBINDS_AREA as ct,PALETTE_AREA as mt,ROUTES_AREA as pt,SIDEBAR_NAV_AREA as ft,STATUSBAR_AREAS as gt}from"@hermes/plugin-sdk";import{host as pe,useValue as Ue}from"@hermes/plugin-sdk";var G="/rewind";import{jsx as Oe,jsxs as je}from"react/jsx-runtime";function fe(){let e=Ue(pe.state.activeSessionId);return je("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{pe.navigate(G)},title:"Open Session Rewind",children:[Oe("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as tt,useValue as rt}from"@hermes/plugin-sdk";import{useEffect as oe,useState as b}from"react";function ee(e,t,s){return e.rest(t,{method:"POST",body:s})}async function ge(e){return(await e.rest("/sessions?limit=100")).items}async function ce(e,t,s=null){let l=s===null?"":`&before_seq=${s}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${l}`)}async function be(e,t,s,l){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${s-1}&before_seq=${l+1}`)).items}function xe(e,t){return e.rest(`/events/${t}`)}function he(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function ve(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function we(e,t){return ee(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function ye(e,t,s,l=null){let c=l===null?"":`&before_ts=${l}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(s)}${c}`)}function _e(e,t){return ee(e,"/forks/prepare",t)}function ke(e,t,s){return ee(e,`/forks/${encodeURIComponent(t)}/commit`,s)}function Ne(e,t){return ee(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Se(e,t,s){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(s)}`)}function Re(e,t){return ee(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function te(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function re(e){return e.toLocaleString()}function ie(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Ke=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function S(e){let t=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",s=Ke.exec(t),l=s?.[1];if(s===null||l===void 0)return t;let c=We(l);return c===void 0?t:t.replace(s[0],c)}function We(e){try{let t=JSON.parse(e);return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}catch{return}}function j(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as q,useTheme as Ye}from"@hermes/plugin-sdk";import{useEffect as me,useRef as Ce,useState as B}from"react";function Je(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(s=>{if(typeof s!="object"||s===null||!("text"in s))return"";let l=s.text;return typeof l=="string"?l:""}).join("").trim():""}function Pe(e,t){let s=(e??[]).filter(f=>(f.role==="user"||f.role==="assistant")&&Je(f).length>0&&typeof f.row_id=="number"),l=-1;for(let f=0;f<s.length;f+=1){let x=s[f];if(x===void 0)continue;let d=x.timestamp;x.role==="user"&&typeof d=="number"&&d<=t+.5&&(l=f)}if(l<=0)return null;let c=s[l-1]?.row_id;return typeof c=="number"&&c>0?c:null}import{jsx as p,jsxs as v}from"react/jsx-runtime";var Ge=["python -m pytest -q","npm test","cargo test","go test ./..."],Qe=350;function ne(e,t){return t.catch(s=>{throw new Error(`${e}: ${S(s)}`)})}function Xe(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(s=>!s.hasAttribute("disabled"))}function Ze(e,t){let s=Xe(e),l=s[0],c=s[s.length-1];if(e===null||l===void 0||c===void 0)return;let f=document.activeElement;if(!e.contains(f)){t.preventDefault(),l.focus();return}t.shiftKey&&f===l?(t.preventDefault(),c.focus()):!t.shiftKey&&f===c&&(t.preventDefault(),l.focus())}var et=`
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
`;function Te({ctx:e,session:t,event:s,onClose:l,onCreated:c}){let f=Ye().resolvedMode==="light",[x,d]=B(t.model??""),[P,C]=B(""),[g,$]=B(""),[i,z]=B(null),[I,R]=B(null),[_,w]=B(null),[F,A]=B(null),[D,y]=B(null),k=_!==null,L=Ce(null),W=Ce(()=>{});me(()=>{let a=document.activeElement;return L.current?.focus(),()=>{a?.focus()}},[]),me(()=>{let a=u=>{if(u.key==="Escape"&&!k){l();return}if(u.key==="Tab"){Ze(L.current,u);return}u.key==="Enter"&&(u.metaKey||u.ctrlKey)&&!k&&(u.preventDefault(),W.current())};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[k,l]),me(()=>{let a=g.trim();if(i===null||a===""){R(null);return}let u=!1,T=e.setTimeout(()=>{Se(e,i.branch_id,a).then(N=>{u||R(N)}).catch(()=>{u||R(null)})},Qe);return()=>{u=!0,T()}},[e,i,g]);let H=async()=>{let a=await q.request("session.active_list",{}),u=Array.isArray(a.sessions)?a.sessions:[],T=u.find(N=>N.session_key===t.session_id)?.id??u.find(N=>N.id===t.session_id)?.id;if(T===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let N=await q.request("session.title",{session_id:T});return{runtimeId:T,storedId:N.session_key??t.stored_session_id}}catch{return{runtimeId:T,storedId:t.stored_session_id}}},J=async()=>{w("prepare"),A(null),y(null);try{let a=await H(),u=await _e(e,{session_id:t.session_id,stored_session_id:a.storedId,event_id:s.id,model:x.trim()||null,provider:null,prompt:P.trim()||null,verify_cmd:g.trim()||null});z(u),C(u.prompt),u.verify_presets.length>0&&g.trim()===""&&$(u.verify_presets[0]??""),u.model!==null&&d(u.model)}catch(a){A(S(a))}finally{w(null)}},Q=async()=>{if(i!==null){w("run"),A(null),y(null);try{let a=await H(),u=a.runtimeId,T=`\u21BA ${t.title??j(t.session_id)}`,N=null;if(u!==void 0)try{let m=await q.request("session.history",{session_id:u});N=Pe(m.messages,i.fork_before_ts)}catch{N=null}let V,U,se=!1;if(N!==null&&u!==void 0){let m=await ne("could not branch the session",q.request("session.branch",{session_id:u,through_message_id:N}));V=m.session_id,U=m.stored_session_id}else{let m={source:"desktop",title:T};i.worktree_path!==null&&(m.cwd=i.worktree_path),a.storedId!==null&&(m.parent_session_id=a.storedId);let M=await ne("could not create the branch session",q.request("session.create",m));V=M.session_id,U=M.stored_session_id,se=!0}if(se&&i.worktree_path!==null){let m=()=>q.request("session.cwd.set",{session_id:V,cwd:i.worktree_path});try{await ne("could not attach the isolated workspace",m())}catch(M){throw M instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${S(M)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(x.trim()&&x.trim()!==(t.model??""))try{let m=await q.request("config.set",{key:"model",value:x.trim(),session_id:V,confirm_expensive_model:!1});m.confirm_required===!0&&y(m.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{y("The branch was created, but the model switch failed; the rerun uses the current model.")}let X=P.trim()||i.prompt;await ne("could not record the branch",ke(e,i.branch_id,{child_session_id:U,child_stored_session_id:U,model:x.trim()||null,provider:null,prompt:X,verify_cmd:g.trim()||null})),await ne("could not start the rerun",q.request("prompt.submit",{session_id:V,text:X})),c(i.branch_id),q.openSession(U,{intent:"tab"}),l()}catch(a){A(S(a))}finally{w(null)}}};W.current=()=>{i===null?J():Q()};let Y=i===null?"not prepared":i.fidelity,ae=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return v("div",{className:f?"rw-overlay rw-light":"rw-overlay",onMouseDown:a=>{a.target===a.currentTarget&&!k&&l()},children:[p("style",{children:et}),v("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:L,children:[v("header",{className:"rw-header",children:[v("div",{className:"rw-heading",children:[p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),v("div",{className:"rw-subtitle",children:[te(s.ts)," \xB7 ",s.preview||"user turn"]})]}),p("button",{type:"button",className:"rw-close",onClick:l,disabled:k,"aria-label":"Close",children:"\xD7"})]}),v("div",{className:"rw-body",children:[F!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:F}):null,D!==null?p("div",{className:"rw-banner rw-banner-warn",role:"status",children:D}):null,v("section",{className:"rw-card",children:[v("div",{className:"rw-card-head",children:[p("span",{className:"rw-card-title",children:"Checkpoint"}),p("span",{className:ae,children:Y==="full"?"workspace ready":Y})]}),v("div",{className:"rw-chips",children:[v("span",{className:"rw-chip",children:["history rows ",i===null?"\u2014":i.fork_row_count]}),v("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?v("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?p("div",{className:"rw-path",children:i.worktree_path}):p("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?p("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?p("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&t.ended_at!==null?p("div",{className:"rw-note rw-note-muted",children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}):null,i!==null&&i.fork_row_count===0?p("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),v("div",{className:"rw-grid",children:[v("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Model"}),p("input",{className:"rw-input",value:x,onChange:a=>{d(a.target.value)},placeholder:"provider/model"}),p("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),v("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:g,onChange:a=>{$(a.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(i?.verify_presets.length?i.verify_presets:Ge).map(a=>p("button",{type:"button",className:"rw-preset",onClick:()=>{$(a)},disabled:k,children:a},a))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),I!==null&&I.command===g.trim()?p("span",{className:"rw-resolved",children:I.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${I.resolved}`}):null]})]}),v("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),p("textarea",{className:"rw-textarea",value:P,onChange:a=>{C(a.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),p("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),v("footer",{className:"rw-footer",children:[p("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),v("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:l,disabled:k,children:"Cancel"}),i===null?p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{J()},disabled:k,children:_==="prepare"?"Preparing...":"Prepare branch"}):p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{Q()},disabled:k,children:_==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{Fragment as Fe,jsx as n,jsxs as o}from"react/jsx-runtime";var nt=new Set(["done","failed","cleaned","discarded"]);function ot(e){return ie(Math.max(0,(e.last_ts-e.ts)*1e3))}function st({event:e,selected:t,onSelect:s}){return o("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:s,children:[n("span",{className:`w-16 shrink-0 uppercase ${Ie(e.kind,e.status)}`,children:Ee(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:ie(e.duration_ms)})]})}var it=new Set(["api_request","llm_call"]);function at({turn:e,expanded:t,events:s,loading:l,selectedEventId:c,onToggle:f,onFork:x,onSelectEvent:d}){let P=(s??[]).filter(g=>!it.has(g.kind)),C=(s??[]).length-P.length;return o("div",{className:"border-b border-(--ui-border) pb-1",children:[o("div",{className:"flex items-center gap-2",children:[o("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:f,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:te(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),o("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?o("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:ot(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:x,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:l?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):o(Fe,{children:[P.map(g=>n(st,{event:g,selected:c===g.id,onSelect:()=>{d(g)}},g.id)),C>0?o("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function Ee(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function Ie(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function De(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function K({label:e,value:t}){return o("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function lt({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):o("div",{className:"flex flex-col gap-2",children:[o("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${Ie(e.kind,e.status)}`,children:Ee(e.kind)}),o("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),o("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${ie(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function ut({ctx:e,branchId:t,refreshTick:s,onClose:l,onRefresh:c}){let[f,x]=b(null),[d,P]=b(null),[C,g]=b(!1),[$,i]=b(null);oe(()=>{let w=!1,F=null,A=async()=>{try{let y=await we(e,t);if(w)return!0;x(y),i(null);let k=y.branch.child_session_id;if(k!==null){let L=await ye(e,y.branch.parent_session_id,k,y.branch.fork_before_ts);w||P(L)}else P(null);return nt.has(y.branch.state)}catch(y){return w||i(S(y)),!1}},D=async()=>{let y=await A();!w&&!y&&(F=e.setTimeout(()=>{D()},2500))};return D(),()=>{w=!0,F!==null&&F()}},[e,t,s]);let z=async()=>{g(!0),i(null);try{await Ne(e,t),c()}catch(w){i(S(w))}finally{g(!1)}},I=async()=>{g(!0),i(null);try{await Re(e,t),c()}catch(w){i(S(w))}finally{g(!1)}};if(f===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let R=f.branch,_=f.run;return o("div",{className:"flex flex-col gap-2",children:[o("div",{className:"flex items-center justify-between gap-2",children:[o("div",{className:"flex items-center gap-2 text-xs",children:[o("span",{className:"font-medium",children:["Branch ",j(R.id)]}),n("span",{className:`uppercase ${De(R.state)}`,children:R.state}),_!==null&&_.verify_exit!==null?o("span",{className:_.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",_.verify_exit]}):null]}),o("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{z()},disabled:C||!R.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{I()},disabled:C||R.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:l,children:"Hide"})]})]}),$!==null?n("div",{className:"text-xs text-red-500",children:$}):null,d!==null?o("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[o("div",{className:"rounded border border-(--ui-border) p-2",children:[o("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",d.left?.frozen_at?` \xB7 frozen ${te(d.left.frozen_at)}`:""]}),n(K,{label:"outcome",value:d.left?.outcome??"unknown"}),n(K,{label:"tokens",value:d.left===null?"n/a":re(d.left.tokens_in+d.left.tokens_out)}),n(K,{label:"tool errors",value:d.left===null?"n/a":String(d.left.tool_errors)})]}),o("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(K,{label:"outcome",value:d.right?.outcome??"running"}),n(K,{label:"verify",value:d.right?.verify_exit===null||d.right?.verify_exit===void 0?"not run":`exit ${d.right.verify_exit}`}),n(K,{label:"tokens",value:d.right===null?"n/a":re(d.right.tokens_in+d.right.tokens_out)}),n(K,{label:"tool errors",value:d.right===null?"n/a":String(d.right.tool_errors)})]}),o("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",d.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),_!==null&&_.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:_.verify_out}):null,f.prompt!==null?o("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:f.prompt})]}):null]})}function $e({ctx:e}){let t=rt(tt.state.activeSessionId),[s,l]=b([]),[c,f]=b(null),[x,d]=b([]),[P,C]=b(!1),[g,$]=b(!1),[i,z]=b(null),[I,R]=b({}),[_,w]=b([]),[F,A]=b([]),[D,y]=b(null),[k,L]=b(null),[W,H]=b(null),[J,Q]=b(null),[Y,ae]=b(0),[a,u]=b(null),[T,N]=b(0),[V,U]=b(!1),[se,X]=b(!1);oe(()=>e.onEvent("*",()=>{N(r=>r+1)}),[e]),oe(()=>{let r=!1,h=async()=>{try{let E=await ge(e);if(r)return;l(E),U(!0),u(null),f(Z=>Z!==null&&E.some(ue=>ue.session_id===Z)?Z:t??E[0]?.session_id??null)}catch(E){r||u(S(E))}};h();let O=e.setInterval(()=>{h()},1e4);return()=>{r=!0,O()}},[e,t,Y,T]),oe(()=>{if(c===null){d([]),X(!1),C(!1),w([]),A([]);return}let r=!1,h=async()=>{try{let[E,Z,ue]=await Promise.all([ce(e,c),he(e,c),ve(e,c)]);if(r)return;d(ze=>{let He=new Set(E.items.map(de=>de.seq)),Ve=ze.filter(de=>!He.has(de.seq));return[...E.items,...Ve]}),C(E.has_more),X(!0),w(Z),A(ue),u(null)}catch(E){r||u(S(E))}};h();let O=e.setInterval(()=>{h()},1e4);return()=>{r=!0,O()}},[e,c,Y,T]),oe(()=>{if(D===null){L(null);return}let r=!1;return xe(e,D).then(h=>{r||L(h)}).catch(h=>{r||u(S(h))}),()=>{r=!0}},[e,D]);let m=s.find(r=>r.session_id===c)??null,M=m!==null&&m.ended_at===null,qe=M&&m.session_id===t,Le=r=>{f(r.session_id),y(null),H(null),z(null),R({})},le=()=>{ae(r=>r+1)},Me=r=>{if(i===r.id){z(null);return}z(r.id),I[r.id]===void 0&&be(e,r.session_id,r.seq,r.seq_to).then(h=>{R(O=>({...O,[r.id]:h}))}).catch(h=>{u(S(h))})},Be=async()=>{let r=x[x.length-1];if(!(c===null||r===void 0)){$(!0);try{let h=await ce(e,c,r.seq);d(O=>[...O,...h.items]),C(h.has_more)}catch(h){u(S(h))}finally{$(!1)}}};return o("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[o("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[o("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),o("div",{className:"flex items-center gap-3 text-xs",children:[m!==null?n("span",{className:"text-(--ui-text-tertiary)",children:m.model??"unknown model"}):null,M?o("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),qe?"live":"running"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:le,children:"Refresh"})]})]}),a!==null?n("div",{className:"text-xs text-red-500",children:a}):null,o("div",{className:"flex min-h-0 flex-1 gap-3",children:[o("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[o("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),V?s.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):s.map(r=>o("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${c===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Le(r)},children:[o("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??j(r.session_id)})]}),o("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),o("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",re(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id)):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]}),F.length>0?o("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),F.map(r=>o("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${W===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{H(r.id)},children:[o("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:j(r.id)}),n("span",{className:`uppercase ${De(r.state)}`,children:r.state})]}),o("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),o("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[m!==null?o("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[o("div",{children:[o("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:m.title??j(m.session_id)}),_.length>0?o("span",{className:"text-xs text-(--ui-text-tertiary)",children:[_.length," snapshots"]}):null]}),o("div",{className:"text-xs text-(--ui-text-tertiary)",children:[m.model??"unknown model"," \xB7 ",m.event_count," events \xB7 ",re(m.tokens_in+m.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,o("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:m===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):se?x.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):o(Fe,{children:[x.map(r=>n(at,{turn:r,expanded:i===r.id,events:I[r.id]??null,loading:i===r.id&&I[r.id]===void 0,selectedEventId:D,onToggle:()=>{Me(r)},onFork:()=>{m!==null&&Q({session:m,event:r})},onSelectEvent:h=>{y(h.id)}},r.id)),P?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Be()},disabled:g,children:g?"Loading...":"Load earlier turns"}):o("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[x.length," turns \xB7 start of the recording"]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(lt,{detail:k})})]})]})]}),W!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(ut,{ctx:e,branchId:W,refreshTick:Y,onClose:()=>{H(null)},onRefresh:le})}):null,J!==null?n(Te,{ctx:e,session:J.session,event:J.event,onClose:()=>{Q(null)},onCreated:r=>{H(r),le()}}):null]})}import{jsx as Ae}from"react/jsx-runtime";var bt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{dt.navigate(G)};e.registerMany([{id:"page",area:pt,data:{path:G},render:()=>Ae($e,{ctx:e})},{id:"nav",area:ft,data:{path:G,label:"Rewind",codicon:"history"}},{id:"palette-open",area:mt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:ct,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:gt.right,order:130,render:()=>Ae(fe,{})}])}},Ut=bt;export{Ut as default};
