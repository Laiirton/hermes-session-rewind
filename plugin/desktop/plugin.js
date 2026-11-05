import{host as lt,KEYBINDS_AREA as ut,PALETTE_AREA as dt,ROUTES_AREA as ct,SIDEBAR_NAV_AREA as mt,STATUSBAR_AREAS as pt}from"@hermes/plugin-sdk";import{host as pe,useValue as He}from"@hermes/plugin-sdk";var G="/rewind";import{jsx as Ve,jsxs as Ue}from"react/jsx-runtime";function fe(){let e=He(pe.state.activeSessionId);return Ue("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{pe.navigate(G)},title:"Open Session Rewind",children:[Ve("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as Ze,useValue as et}from"@hermes/plugin-sdk";import{useEffect as oe,useState as b}from"react";function ee(e,t,o){return e.rest(t,{method:"POST",body:o})}async function ge(e){return(await e.rest("/sessions?limit=100")).items}async function de(e,t,o=null){let a=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${a}`)}async function be(e,t,o,a){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${a+1}`)).items}function xe(e,t){return e.rest(`/events/${t}`)}function he(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function ve(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function we(e,t){return ee(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function ye(e,t,o,a=null){let c=a===null?"":`&before_ts=${a}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${c}`)}function _e(e,t){return ee(e,"/forks/prepare",t)}function ke(e,t,o){return ee(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function Ne(e,t){return ee(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Se(e,t,o){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(o)}`)}function Re(e,t){return ee(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function te(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function re(e){return e.toLocaleString()}function ie(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Oe=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function S(e){let t=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",o=Oe.exec(t),a=o?.[1];if(o===null||a===void 0)return t;let c=je(a);return c===void 0?t:t.replace(o[0],c)}function je(e){try{let t=JSON.parse(e);return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}catch{return}}function j(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as L,useTheme as We}from"@hermes/plugin-sdk";import{useEffect as ce,useRef as Ce,useState as B}from"react";function Ke(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let a=o.text;return typeof a=="string"?a:""}).join("").trim():""}function Pe(e,t){let o=(e??[]).filter(f=>(f.role==="user"||f.role==="assistant")&&Ke(f).length>0&&typeof f.row_id=="number"),a=-1;for(let f=0;f<o.length;f+=1){let x=o[f];if(x===void 0)continue;let d=x.timestamp;x.role==="user"&&typeof d=="number"&&d<=t+.5&&(a=f)}if(a<=0)return null;let c=o[a-1]?.row_id;return typeof c=="number"&&c>0?c:null}import{jsx as p,jsxs as v}from"react/jsx-runtime";var Je=["python -m pytest -q","npm test","cargo test","go test ./..."],Ye=350;function ne(e,t){return t.catch(o=>{throw new Error(`${e}: ${S(o)}`)})}function Ge(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function Qe(e,t){let o=Ge(e),a=o[0],c=o[o.length-1];if(e===null||a===void 0||c===void 0)return;let f=document.activeElement;if(!e.contains(f)){t.preventDefault(),a.focus();return}t.shiftKey&&f===a?(t.preventDefault(),c.focus()):!t.shiftKey&&f===c&&(t.preventDefault(),a.focus())}var Xe=`
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
`;function Te({ctx:e,session:t,event:o,onClose:a,onCreated:c}){let f=We().resolvedMode==="light",[x,d]=B(t.model??""),[P,C]=B(""),[g,$]=B(""),[i,z]=B(null),[E,R]=B(null),[_,w]=B(null),[F,A]=B(null),[I,y]=B(null),k=_!==null,M=Ce(null),W=Ce(()=>{});ce(()=>{let l=document.activeElement;return M.current?.focus(),()=>{l?.focus()}},[]),ce(()=>{let l=u=>{if(u.key==="Escape"&&!k){a();return}if(u.key==="Tab"){Qe(M.current,u);return}u.key==="Enter"&&(u.metaKey||u.ctrlKey)&&!k&&(u.preventDefault(),W.current())};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[k,a]),ce(()=>{let l=g.trim();if(i===null||l===""){R(null);return}let u=!1,T=e.setTimeout(()=>{Se(e,i.branch_id,l).then(N=>{u||R(N)}).catch(()=>{u||R(null)})},Ye);return()=>{u=!0,T()}},[e,i,g]);let H=async()=>{let l=await L.request("session.active_list",{}),u=Array.isArray(l.sessions)?l.sessions:[],T=u.find(N=>N.session_key===t.session_id)?.id??u.find(N=>N.id===t.session_id)?.id;if(T===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let N=await L.request("session.title",{session_id:T});return{runtimeId:T,storedId:N.session_key??t.stored_session_id}}catch{return{runtimeId:T,storedId:t.stored_session_id}}},J=async()=>{w("prepare"),A(null),y(null);try{let l=await H(),u=await _e(e,{session_id:t.session_id,stored_session_id:l.storedId,event_id:o.id,model:x.trim()||null,provider:null,prompt:P.trim()||null,verify_cmd:g.trim()||null});z(u),C(u.prompt),u.verify_presets.length>0&&g.trim()===""&&$(u.verify_presets[0]??""),u.model!==null&&d(u.model)}catch(l){A(S(l))}finally{w(null)}},Q=async()=>{if(i!==null){w("run"),A(null),y(null);try{let l=await H(),u=l.runtimeId,T=`\u21BA ${t.title??j(t.session_id)}`,N=null;if(u!==void 0)try{let m=await L.request("session.history",{session_id:u});N=Pe(m.messages,i.fork_before_ts)}catch{N=null}let V,U,se=!1;if(N!==null&&u!==void 0){let m=await ne("could not branch the session",L.request("session.branch",{session_id:u,through_message_id:N}));V=m.session_id,U=m.stored_session_id}else{let m={source:"desktop",title:T};i.worktree_path!==null&&(m.cwd=i.worktree_path),l.storedId!==null&&(m.parent_session_id=l.storedId);let q=await ne("could not create the branch session",L.request("session.create",m));V=q.session_id,U=q.stored_session_id,se=!0}if(se&&i.worktree_path!==null){let m=()=>L.request("session.cwd.set",{session_id:V,cwd:i.worktree_path});try{await ne("could not attach the isolated workspace",m())}catch(q){throw q instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${S(q)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(x.trim()&&x.trim()!==(t.model??""))try{let m=await L.request("config.set",{key:"model",value:x.trim(),session_id:V,confirm_expensive_model:!1});m.confirm_required===!0&&y(m.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{y("The branch was created, but the model switch failed; the rerun uses the current model.")}let X=P.trim()||i.prompt;await ne("could not record the branch",ke(e,i.branch_id,{child_session_id:U,child_stored_session_id:U,model:x.trim()||null,provider:null,prompt:X,verify_cmd:g.trim()||null})),await ne("could not start the rerun",L.request("prompt.submit",{session_id:V,text:X})),c(i.branch_id),L.openSession(U,{intent:"tab"}),a()}catch(l){A(S(l))}finally{w(null)}}};W.current=()=>{i===null?J():Q()};let Y=i===null?"not prepared":i.fidelity,ae=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return v("div",{className:f?"rw-overlay rw-light":"rw-overlay",onMouseDown:l=>{l.target===l.currentTarget&&!k&&a()},children:[p("style",{children:Xe}),v("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:M,children:[v("header",{className:"rw-header",children:[v("div",{className:"rw-heading",children:[p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),v("div",{className:"rw-subtitle",children:[te(o.ts)," \xB7 ",o.preview||"user turn"]})]}),p("button",{type:"button",className:"rw-close",onClick:a,disabled:k,"aria-label":"Close",children:"\xD7"})]}),v("div",{className:"rw-body",children:[F!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:F}):null,I!==null?p("div",{className:"rw-banner rw-banner-warn",role:"status",children:I}):null,v("section",{className:"rw-card",children:[v("div",{className:"rw-card-head",children:[p("span",{className:"rw-card-title",children:"Checkpoint"}),p("span",{className:ae,children:Y==="full"?"workspace ready":Y})]}),v("div",{className:"rw-chips",children:[v("span",{className:"rw-chip",children:["history rows ",i===null?"\u2014":i.fork_row_count]}),v("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?v("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?p("div",{className:"rw-path",children:i.worktree_path}):p("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?p("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?p("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&t.ended_at!==null?p("div",{className:"rw-note rw-note-muted",children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}):null,i!==null&&i.fork_row_count===0?p("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),v("div",{className:"rw-grid",children:[v("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Model"}),p("input",{className:"rw-input",value:x,onChange:l=>{d(l.target.value)},placeholder:"provider/model"}),p("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),v("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:g,onChange:l=>{$(l.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(i?.verify_presets.length?i.verify_presets:Je).map(l=>p("button",{type:"button",className:"rw-preset",onClick:()=>{$(l)},disabled:k,children:l},l))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),E!==null&&E.command===g.trim()?p("span",{className:"rw-resolved",children:E.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${E.resolved}`}):null]})]}),v("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),p("textarea",{className:"rw-textarea",value:P,onChange:l=>{C(l.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),p("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),v("footer",{className:"rw-footer",children:[p("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),v("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:a,disabled:k,children:"Cancel"}),i===null?p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{J()},disabled:k,children:_==="prepare"?"Preparing...":"Prepare branch"}):p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{Q()},disabled:k,children:_==="run"?"Forking...":"Fork & run"})]})]})]})]})}function me(e,t){let o=new Set(e.map(a=>a.id));return[...e,...t.filter(a=>!o.has(a.id))]}import{Fragment as Fe,jsx as n,jsxs as s}from"react/jsx-runtime";var tt=new Set(["done","failed","cleaned","discarded"]);function rt(e){return ie(Math.max(0,(e.last_ts-e.ts)*1e3))}function nt({event:e,selected:t,onSelect:o}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[n("span",{className:`w-16 shrink-0 uppercase ${Ie(e.kind,e.status)}`,children:Ee(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:ie(e.duration_ms)})]})}var ot=new Set(["api_request","llm_call"]);function st({turn:e,expanded:t,events:o,loading:a,selectedEventId:c,onToggle:f,onFork:x,onSelectEvent:d}){let P=(o??[]).filter(g=>!ot.has(g.kind)),C=(o??[]).length-P.length;return s("div",{className:"border-b border-(--ui-border) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:f,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:te(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),s("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?s("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:rt(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:x,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:a?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s(Fe,{children:[P.map(g=>n(nt,{event:g,selected:c===g.id,onSelect:()=>{d(g)}},g.id)),C>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function Ee(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function Ie(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function De(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function K({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function it({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${Ie(e.kind,e.status)}`,children:Ee(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${ie(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function at({ctx:e,branchId:t,refreshTick:o,onClose:a,onRefresh:c}){let[f,x]=b(null),[d,P]=b(null),[C,g]=b(!1),[$,i]=b(null);oe(()=>{let w=!1,F=null,A=async()=>{try{let y=await we(e,t);if(w)return!0;x(y),i(null);let k=y.branch.child_session_id;if(k!==null){let M=await ye(e,y.branch.parent_session_id,k,y.branch.fork_before_ts);w||P(M)}else P(null);return tt.has(y.branch.state)}catch(y){return w||i(S(y)),!1}},I=async()=>{let y=await A();!w&&!y&&(F=e.setTimeout(()=>{I()},2500))};return I(),()=>{w=!0,F!==null&&F()}},[e,t,o]);let z=async()=>{g(!0),i(null);try{await Ne(e,t),c()}catch(w){i(S(w))}finally{g(!1)}},E=async()=>{g(!0),i(null);try{await Re(e,t),c()}catch(w){i(S(w))}finally{g(!1)}};if(f===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let R=f.branch,_=f.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",j(R.id)]}),n("span",{className:`uppercase ${De(R.state)}`,children:R.state}),_!==null&&_.verify_exit!==null?s("span",{className:_.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",_.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{z()},disabled:C||!R.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{E()},disabled:C||R.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:a,children:"Hide"})]})]}),$!==null?n("div",{className:"text-xs text-red-500",children:$}):null,d!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[s("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",d.left?.frozen_at?` \xB7 frozen ${te(d.left.frozen_at)}`:""]}),n(K,{label:"outcome",value:d.left?.outcome??"unknown"}),n(K,{label:"tokens",value:d.left===null?"n/a":re(d.left.tokens_in+d.left.tokens_out)}),n(K,{label:"tool errors",value:d.left===null?"n/a":String(d.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(K,{label:"outcome",value:d.right?.outcome??"running"}),n(K,{label:"verify",value:d.right?.verify_exit===null||d.right?.verify_exit===void 0?"not run":`exit ${d.right.verify_exit}`}),n(K,{label:"tokens",value:d.right===null?"n/a":re(d.right.tokens_in+d.right.tokens_out)}),n(K,{label:"tool errors",value:d.right===null?"n/a":String(d.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",d.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),_!==null&&_.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:_.verify_out}):null,f.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:f.prompt})]}):null]})}function $e({ctx:e}){let t=et(Ze.state.activeSessionId),[o,a]=b([]),[c,f]=b(null),[x,d]=b([]),[P,C]=b(!1),[g,$]=b(!1),[i,z]=b(null),[E,R]=b({}),[_,w]=b([]),[F,A]=b([]),[I,y]=b(null),[k,M]=b(null),[W,H]=b(null),[J,Q]=b(null),[Y,ae]=b(0),[l,u]=b(null),[T,N]=b(0),[V,U]=b(!1),[se,X]=b(!1);oe(()=>e.onEvent("*",()=>{N(r=>r+1)}),[e]),oe(()=>{let r=!1,h=async()=>{try{let D=await ge(e);if(r)return;a(D),U(!0),u(null),f(Z=>Z!==null&&D.some(ue=>ue.session_id===Z)?Z:t??D[0]?.session_id??null)}catch(D){r||u(S(D))}};h();let O=e.setInterval(()=>{h()},1e4);return()=>{r=!0,O()}},[e,t,Y,T]),oe(()=>{if(c===null){d([]),X(!1),C(!1),w([]),A([]);return}let r=!1,h=async()=>{try{let[D,Z,ue]=await Promise.all([de(e,c),he(e,c),ve(e,c)]);if(r)return;d(ze=>me(D.items,ze)),C(D.has_more),X(!0),w(Z),A(ue),u(null)}catch(D){r||u(S(D))}};h();let O=e.setInterval(()=>{h()},1e4);return()=>{r=!0,O()}},[e,c,Y,T]),oe(()=>{if(I===null){M(null);return}let r=!1;return xe(e,I).then(h=>{r||M(h)}).catch(h=>{r||u(S(h))}),()=>{r=!0}},[e,I]);let m=o.find(r=>r.session_id===c)??null,q=m!==null&&m.ended_at===null,Le=q&&m.session_id===t,Me=r=>{f(r.session_id),y(null),H(null),z(null),R({})},le=()=>{ae(r=>r+1)},qe=r=>{if(i===r.id){z(null);return}z(r.id),E[r.id]===void 0&&be(e,r.session_id,r.seq,r.seq_to).then(h=>{R(O=>({...O,[r.id]:h}))}).catch(h=>{u(S(h))})},Be=async()=>{let r=x[x.length-1];if(!(c===null||r===void 0)){$(!0);try{let h=await de(e,c,r.seq);d(O=>me(h.items,O)),C(h.has_more)}catch(h){u(S(h))}finally{$(!1)}}};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[m!==null?n("span",{className:"text-(--ui-text-tertiary)",children:m.model??"unknown model"}):null,q?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),Le?"live":"running"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:le,children:"Refresh"})]})]}),l!==null?n("div",{className:"text-xs text-red-500",children:l}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),V?o.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):o.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${c===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Me(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??j(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",re(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id)):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]}),F.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),F.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${W===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{H(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:j(r.id)}),n("span",{className:`uppercase ${De(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[m!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:m.title??j(m.session_id)}),_.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[_.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[m.model??"unknown model"," \xB7 ",m.event_count," events \xB7 ",re(m.tokens_in+m.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:m===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):se?x.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):s(Fe,{children:[x.map(r=>n(st,{turn:r,expanded:i===r.id,events:E[r.id]??null,loading:i===r.id&&E[r.id]===void 0,selectedEventId:I,onToggle:()=>{qe(r)},onFork:()=>{m!==null&&Q({session:m,event:r})},onSelectEvent:h=>{y(h.id)}},r.id)),P?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Be()},disabled:g,children:g?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[x.length," turns \xB7 start of the recording"]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(it,{detail:k})})]})]})]}),W!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(at,{ctx:e,branchId:W,refreshTick:Y,onClose:()=>{H(null)},onRefresh:le})}):null,J!==null?n(Te,{ctx:e,session:J.session,event:J.event,onClose:()=>{Q(null)},onCreated:r=>{H(r),le()}}):null]})}import{jsx as Ae}from"react/jsx-runtime";var ft={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{lt.navigate(G)};e.registerMany([{id:"page",area:ct,data:{path:G},render:()=>Ae($e,{ctx:e})},{id:"nav",area:mt,data:{path:G,label:"Rewind",codicon:"history"}},{id:"palette-open",area:dt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:ut,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:pt.right,order:130,render:()=>Ae(fe,{})}])}},Ut=ft;export{Ut as default};
