import{host as dt,KEYBINDS_AREA as ct,PALETTE_AREA as mt,ROUTES_AREA as pt,SIDEBAR_NAV_AREA as ft,STATUSBAR_AREAS as gt}from"@hermes/plugin-sdk";import{host as pe,useValue as je}from"@hermes/plugin-sdk";var Y="/rewind";import{jsx as Ke,jsxs as We}from"react/jsx-runtime";function fe(){let e=je(pe.state.activeSessionId);return We("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{pe.navigate(Y)},title:"Open Session Rewind",children:[Ke("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as Ee,useValue as Ie}from"@hermes/plugin-sdk";import{useEffect as oe,useState as b}from"react";function ee(e,t,s){return e.rest(t,{method:"POST",body:s})}async function ge(e){return(await e.rest("/sessions?limit=100")).items}async function ce(e,t,s=null){let a=s===null?"":`&before_seq=${s}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${a}`)}async function be(e,t,s,a){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${s-1}&before_seq=${a+1}`)).items}function xe(e,t){return e.rest(`/events/${t}`)}function he(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function ve(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function we(e,t){return ee(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function ye(e,t,s,a=null){let f=a===null?"":`&before_ts=${a}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(s)}${f}`)}function _e(e,t){return ee(e,"/forks/prepare",t)}function ke(e,t,s){return ee(e,`/forks/${encodeURIComponent(t)}/commit`,s)}function Ne(e,t){return ee(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Se(e,t,s){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(s)}`)}function Re(e,t){return ee(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function te(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function re(e){return e.toLocaleString()}function ae(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Je=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function P(e){let t=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",s=Je.exec(t),a=s?.[1];if(s===null||a===void 0)return t;let f=Ye(a);return f===void 0?t:t.replace(s[0],f)}function Ye(e){try{let t=JSON.parse(e);return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}catch{return}}function j(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as q,useTheme as Qe}from"@hermes/plugin-sdk";import{useEffect as me,useRef as Ce,useState as M}from"react";function Ge(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(s=>{if(typeof s!="object"||s===null||!("text"in s))return"";let a=s.text;return typeof a=="string"?a:""}).join("").trim():""}function Pe(e,t){let s=(e??[]).filter(u=>(u.role==="user"||u.role==="assistant")&&Ge(u).length>0&&typeof u.row_id=="number"),a=-1;for(let u=0;u<s.length;u+=1){let w=s[u];if(w===void 0)continue;let d=w.timestamp;w.role==="user"&&typeof d=="number"&&d<=t+.5&&(a=u)}if(a<=0)return null;let f=s[a-1]?.row_id;return typeof f=="number"&&f>0?f:null}import{jsx as m,jsxs as v}from"react/jsx-runtime";var Xe=["python -m pytest -q","npm test","cargo test","go test ./..."],Ze=350;function ne(e,t){return t.catch(s=>{throw new Error(`${e}: ${P(s)}`)})}function et(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(s=>!s.hasAttribute("disabled"))}function tt(e,t){let s=et(e),a=s[0],f=s[s.length-1];if(e===null||a===void 0||f===void 0)return;let u=document.activeElement;if(!e.contains(u)){t.preventDefault(),a.focus();return}t.shiftKey&&u===a?(t.preventDefault(),f.focus()):!t.shiftKey&&u===f&&(t.preventDefault(),a.focus())}var rt=`
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
`;function Te({ctx:e,session:t,event:s,onClose:a,onCreated:f}){let u=Qe().resolvedMode==="light",[w,d]=M(t.model??""),[C,D]=M(""),[p,$]=M(""),[i,B]=M(null),[I,T]=M(null),[R,y]=M(null),[F,A]=M(null),[L,h]=M(null),N=R!==null,z=Ce(null),G=Ce(()=>{});me(()=>{let l=document.activeElement;return z.current?.focus(),()=>{l?.focus()}},[]),me(()=>{let l=c=>{if(c.key==="Escape"&&!N){a();return}if(c.key==="Tab"){tt(z.current,c);return}c.key==="Enter"&&(c.metaKey||c.ctrlKey)&&!N&&(c.preventDefault(),G.current())};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[N,a]),me(()=>{let l=p.trim();if(i===null||l===""){T(null);return}let c=!1,_=e.setTimeout(()=>{Se(e,i.branch_id,l).then(S=>{c||T(S)}).catch(()=>{c||T(null)})},Ze);return()=>{c=!0,_()}},[e,i,p]);let W=async()=>{let l=await q.request("session.active_list",{}),c=Array.isArray(l.sessions)?l.sessions:[],_=c.find(S=>S.session_key===t.session_id)?.id??c.find(S=>S.id===t.session_id)?.id;if(_===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let S=await q.request("session.title",{session_id:_});return{runtimeId:_,storedId:S.session_key??t.stored_session_id}}catch{return{runtimeId:_,storedId:t.stored_session_id}}},H=async()=>{y("prepare"),A(null),h(null);try{let l=await W(),c=await _e(e,{session_id:t.session_id,stored_session_id:l.storedId,event_id:s.id,model:w.trim()||null,provider:null,prompt:C.trim()||null,verify_cmd:p.trim()||null});B(c),D(c.prompt),c.verify_presets.length>0&&p.trim()===""&&$(c.verify_presets[0]??""),c.model!==null&&d(c.model)}catch(l){A(P(l))}finally{y(null)}},J=async()=>{if(i!==null){y("run"),A(null),h(null);try{let l=await W(),c=l.runtimeId,_=`\u21BA ${t.title??j(t.session_id)}`,S=null;if(c!==void 0)try{let k=await q.request("session.history",{session_id:c});S=Pe(k.messages,i.fork_before_ts)}catch{S=null}let V,U,se=!1;if(S!==null&&c!==void 0){let k=await ne("could not branch the session",q.request("session.branch",{session_id:c,through_message_id:S}));V=k.session_id,U=k.stored_session_id}else{let k={source:"desktop",title:_};i.worktree_path!==null&&(k.cwd=i.worktree_path),l.storedId!==null&&(k.parent_session_id=l.storedId);let g=await ne("could not create the branch session",q.request("session.create",k));V=g.session_id,U=g.stored_session_id,se=!0}if(se&&i.worktree_path!==null){let k=()=>q.request("session.cwd.set",{session_id:V,cwd:i.worktree_path});try{await ne("could not attach the isolated workspace",k())}catch(g){throw g instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${P(g)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(w.trim()&&w.trim()!==(t.model??""))try{let k=await q.request("config.set",{key:"model",value:w.trim(),session_id:V,confirm_expensive_model:!1});k.confirm_required===!0&&h(k.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{h("The branch was created, but the model switch failed; the rerun uses the current model.")}let ie=C.trim()||i.prompt;await ne("could not record the branch",ke(e,i.branch_id,{child_session_id:U,child_stored_session_id:U,model:w.trim()||null,provider:null,prompt:ie,verify_cmd:p.trim()||null})),await ne("could not start the rerun",q.request("prompt.submit",{session_id:V,text:ie})),f(i.branch_id),q.openSession(U,{intent:"tab"}),a()}catch(l){A(P(l))}finally{y(null)}}};G.current=()=>{i===null?H():J()};let Q=i===null?"not prepared":i.fidelity,X=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return v("div",{className:u?"rw-overlay rw-light":"rw-overlay",onMouseDown:l=>{l.target===l.currentTarget&&!N&&a()},children:[m("style",{children:rt}),v("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:z,children:[v("header",{className:"rw-header",children:[v("div",{className:"rw-heading",children:[m("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),v("div",{className:"rw-subtitle",children:[te(s.ts)," \xB7 ",s.preview||"user turn"]})]}),m("button",{type:"button",className:"rw-close",onClick:a,disabled:N,"aria-label":"Close",children:"\xD7"})]}),v("div",{className:"rw-body",children:[F!==null?m("div",{className:"rw-banner rw-banner-error",role:"alert",children:F}):null,L!==null?m("div",{className:"rw-banner rw-banner-warn",role:"status",children:L}):null,v("section",{className:"rw-card",children:[v("div",{className:"rw-card-head",children:[m("span",{className:"rw-card-title",children:"Checkpoint"}),m("span",{className:X,children:Q==="full"?"workspace ready":Q})]}),v("div",{className:"rw-chips",children:[v("span",{className:"rw-chip",children:["history rows ",i===null?"\u2014":i.fork_row_count]}),v("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?v("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?m("div",{className:"rw-path",children:i.worktree_path}):m("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?m("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?m("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&t.ended_at!==null?m("div",{className:"rw-note rw-note-muted",children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}):null,i!==null&&i.fork_row_count===0?m("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),v("div",{className:"rw-grid",children:[v("label",{className:"rw-field",children:[m("span",{className:"rw-label",children:"Model"}),m("input",{className:"rw-input",value:w,onChange:l=>{d(l.target.value)},placeholder:"provider/model"}),m("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),v("label",{className:"rw-field",children:[m("span",{className:"rw-label",children:"Verify command"}),m("input",{className:"rw-input",value:p,onChange:l=>{$(l.target.value)},placeholder:"python -m pytest -q"}),m("div",{className:"rw-chips",children:(i?.verify_presets.length?i.verify_presets:Xe).map(l=>m("button",{type:"button",className:"rw-preset",onClick:()=>{$(l)},disabled:N,children:l},l))}),m("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),I!==null&&I.command===p.trim()?m("span",{className:"rw-resolved",children:I.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${I.resolved}`}):null]})]}),v("label",{className:"rw-field",children:[m("span",{className:"rw-label",children:"Prompt for the rerun"}),m("textarea",{className:"rw-textarea",value:C,onChange:l=>{D(l.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),m("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),v("footer",{className:"rw-footer",children:[m("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),v("div",{className:"rw-actions",children:[m("button",{type:"button",className:"rw-button",onClick:a,disabled:N,children:"Cancel"}),i===null?m("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{H()},disabled:N,children:R==="prepare"?"Preparing...":"Prepare branch"}):m("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{J()},disabled:N,children:R==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{Fragment as qe,jsx as n,jsxs as o}from"react/jsx-runtime";var nt=new Set(["done","failed","cleaned","discarded"]);function ot(e){return ae(Math.max(0,(e.last_ts-e.ts)*1e3))}function st({event:e,selected:t,onSelect:s}){return o("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:s,children:[n("span",{className:`w-16 shrink-0 uppercase ${$e(e.kind,e.status)}`,children:De(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:ae(e.duration_ms)})]})}var it=new Set(["api_request","llm_call"]);function at({turn:e,expanded:t,events:s,loading:a,selectedEventId:f,onToggle:u,onFork:w,onSelectEvent:d}){let C=(s??[]).filter(p=>!it.has(p.kind)),D=(s??[]).length-C.length;return o("div",{className:"border-b border-(--ui-border) pb-1",children:[o("div",{className:"flex items-center gap-2",children:[o("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:u,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:te(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),o("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?o("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:ot(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:w,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:a?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):o(qe,{children:[C.map(p=>n(st,{event:p,selected:f===p.id,onSelect:()=>{d(p)}},p.id)),D>0?o("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function De(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function $e(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Fe(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function K({label:e,value:t}){return o("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function lt({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):o("div",{className:"flex flex-col gap-2",children:[o("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${$e(e.kind,e.status)}`,children:De(e.kind)}),o("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),o("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${ae(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function ut({ctx:e,branchId:t,refreshTick:s,onClose:a,onRefresh:f}){let[u,w]=b(null),[d,C]=b(null),[D,p]=b(!1),[$,i]=b(null);oe(()=>{let y=!1,F=null,A=async()=>{try{let h=await we(e,t);if(y)return!0;w(h),i(null);let N=h.branch.child_session_id;if(N!==null){let z=await ye(e,h.branch.parent_session_id,N,h.branch.fork_before_ts);y||C(z)}else C(null);return nt.has(h.branch.state)}catch(h){return y||i(P(h)),!1}},L=async()=>{let h=await A();!y&&!h&&(F=e.setTimeout(()=>{L()},2500))};return L(),()=>{y=!0,F!==null&&F()}},[e,t,s]);let B=async()=>{p(!0),i(null);try{await Ne(e,t),f()}catch(y){i(P(y))}finally{p(!1)}},I=async()=>{p(!0),i(null);try{await Re(e,t),f()}catch(y){i(P(y))}finally{p(!1)}};if(u===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let T=u.branch,R=u.run;return o("div",{className:"flex flex-col gap-2",children:[o("div",{className:"flex items-center justify-between gap-2",children:[o("div",{className:"flex items-center gap-2 text-xs",children:[o("span",{className:"font-medium",children:["Branch ",j(T.id)]}),n("span",{className:`uppercase ${Fe(T.state)}`,children:T.state}),R!==null&&R.verify_exit!==null?o("span",{className:R.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",R.verify_exit]}):null]}),o("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{B()},disabled:D||!T.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{I()},disabled:D||T.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:a,children:"Hide"})]})]}),$!==null?n("div",{className:"text-xs text-red-500",children:$}):null,d!==null?o("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[o("div",{className:"rounded border border-(--ui-border) p-2",children:[o("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",d.left?.frozen_at?` \xB7 frozen ${te(d.left.frozen_at)}`:""]}),n(K,{label:"outcome",value:d.left?.outcome??"unknown"}),n(K,{label:"tokens",value:d.left===null?"n/a":re(d.left.tokens_in+d.left.tokens_out)}),n(K,{label:"tool errors",value:d.left===null?"n/a":String(d.left.tool_errors)})]}),o("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(K,{label:"outcome",value:d.right?.outcome??"running"}),n(K,{label:"verify",value:d.right?.verify_exit===null||d.right?.verify_exit===void 0?"not run":`exit ${d.right.verify_exit}`}),n(K,{label:"tokens",value:d.right===null?"n/a":re(d.right.tokens_in+d.right.tokens_out)}),n(K,{label:"tool errors",value:d.right===null?"n/a":String(d.right.tool_errors)})]}),o("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",d.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),R!==null&&R.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:R.verify_out}):null,u.prompt!==null?o("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:u.prompt})]}):null]})}function Ae({ctx:e}){let t=Ie(Ee.state.activeSessionId),s=Ie(Ee.state.focusedStoredSessionId),[a,f]=b([]),[u,w]=b(null),[d,C]=b([]),[D,p]=b(!1),[$,i]=b(!1),[B,I]=b(null),[T,R]=b({}),[y,F]=b([]),[A,L]=b([]),[h,N]=b(null),[z,G]=b(null),[W,H]=b(null),[J,Q]=b(null),[X,l]=b(0),[c,_]=b(null),[S,V]=b(0),[U,se]=b(!1),[ie,k]=b(!1);oe(()=>e.onEvent("*",()=>{V(r=>r+1)}),[e]),oe(()=>{let r=!1,x=async()=>{try{let E=await ge(e);if(r)return;f(E),se(!0),_(null),w(Z=>Z!==null&&E.some(ue=>ue.session_id===Z)?Z:t??E[0]?.session_id??null)}catch(E){r||_(P(E))}};x();let O=e.setInterval(()=>{x()},1e4);return()=>{r=!0,O()}},[e,t,X,S]),oe(()=>{if(u===null){C([]),k(!1),p(!1),F([]),L([]);return}let r=!1,x=async()=>{try{let[E,Z,ue]=await Promise.all([ce(e,u),he(e,u),ve(e,u)]);if(r)return;C(Ve=>{let Ue=new Set(E.items.map(de=>de.seq)),Oe=Ve.filter(de=>!Ue.has(de.seq));return[...E.items,...Oe]}),p(E.has_more),k(!0),F(Z),L(ue),_(null)}catch(E){r||_(P(E))}};x();let O=e.setInterval(()=>{x()},1e4);return()=>{r=!0,O()}},[e,u,X,S]),oe(()=>{if(h===null){G(null);return}let r=!1;return xe(e,h).then(x=>{r||G(x)}).catch(x=>{r||_(P(x))}),()=>{r=!0}},[e,h]);let g=a.find(r=>r.session_id===u)??null,Me=g!==null&&g.ended_at===null&&(g.session_id===t||g.session_id===s),Be=r=>{w(r.session_id),N(null),H(null),I(null),R({})},le=()=>{l(r=>r+1)},ze=r=>{if(B===r.id){I(null);return}I(r.id),T[r.id]===void 0&&be(e,r.session_id,r.seq,r.seq_to).then(x=>{R(O=>({...O,[r.id]:x}))}).catch(x=>{_(P(x))})},He=async()=>{let r=d[d.length-1];if(!(u===null||r===void 0)){i(!0);try{let x=await ce(e,u,r.seq);C(O=>[...O,...x.items]),p(x.has_more)}catch(x){_(P(x))}finally{i(!1)}}};return o("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[o("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[o("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),o("div",{className:"flex items-center gap-3 text-xs",children:[g!==null?n("span",{className:"text-(--ui-text-tertiary)",children:g.model??"unknown model"}):null,Me?o("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"live"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:le,children:"Refresh"})]})]}),c!==null?n("div",{className:"text-xs text-red-500",children:c}):null,o("div",{className:"flex min-h-0 flex-1 gap-3",children:[o("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[o("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),U?a.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):a.map(r=>o("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${u===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Be(r)},children:[o("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??j(r.session_id)})]}),o("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),o("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",re(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id)):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]}),A.length>0?o("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),A.map(r=>o("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${W===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{H(r.id)},children:[o("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:j(r.id)}),n("span",{className:`uppercase ${Fe(r.state)}`,children:r.state})]}),o("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),o("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[g!==null?o("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[o("div",{children:[o("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:g.title??j(g.session_id)}),y.length>0?o("span",{className:"text-xs text-(--ui-text-tertiary)",children:[y.length," snapshots"]}):null]}),o("div",{className:"text-xs text-(--ui-text-tertiary)",children:[g.model??"unknown model"," \xB7 ",g.event_count," events \xB7 ",re(g.tokens_in+g.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,o("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:g===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):ie?d.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):o(qe,{children:[d.map(r=>n(at,{turn:r,expanded:B===r.id,events:T[r.id]??null,loading:B===r.id&&T[r.id]===void 0,selectedEventId:h,onToggle:()=>{ze(r)},onFork:()=>{g!==null&&Q({session:g,event:r})},onSelectEvent:x=>{N(x.id)}},r.id)),D?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{He()},disabled:$,children:$?"Loading...":"Load earlier turns"}):o("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[d.length," turns \xB7 start of the recording"]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(lt,{detail:z})})]})]})]}),W!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(ut,{ctx:e,branchId:W,refreshTick:X,onClose:()=>{H(null)},onRefresh:le})}):null,J!==null?n(Te,{ctx:e,session:J.session,event:J.event,onClose:()=>{Q(null)},onCreated:r=>{H(r),le()}}):null]})}import{jsx as Le}from"react/jsx-runtime";var bt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{dt.navigate(Y)};e.registerMany([{id:"page",area:pt,data:{path:Y},render:()=>Le(Ae,{ctx:e})},{id:"nav",area:ft,data:{path:Y,label:"Rewind",codicon:"history"}},{id:"palette-open",area:mt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:ct,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:gt.right,order:130,render:()=>Le(fe,{})}])}},Ut=bt;export{Ut as default};
