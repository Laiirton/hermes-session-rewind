import{host as ut,KEYBINDS_AREA as dt,PALETTE_AREA as ct,ROUTES_AREA as mt,SIDEBAR_NAV_AREA as pt,STATUSBAR_AREAS as ft}from"@hermes/plugin-sdk";import{host as pe,useValue as je}from"@hermes/plugin-sdk";var G="/rewind";import{jsx as Ke,jsxs as We}from"react/jsx-runtime";function fe(){let e=je(pe.state.activeSessionId);return We("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{pe.navigate(G)},title:"Open Session Rewind",children:[Ke("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as Ee,useValue as Ie}from"@hermes/plugin-sdk";import{useEffect as oe,useState as f}from"react";function te(e,t,i){return e.rest(t,{method:"POST",body:i})}async function ge(e){return(await e.rest("/sessions?limit=100")).items}async function ce(e,t,i=null){let l=i===null?"":`&before_seq=${i}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${l}`)}async function be(e,t,i,l){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${i-1}&before_seq=${l+1}`)).items}function xe(e,t){return e.rest(`/events/${t}`)}function he(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function ve(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function we(e,t){return te(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function ye(e,t,i,l=null){let b=l===null?"":`&before_ts=${l}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(i)}${b}`)}function _e(e,t){return te(e,"/forks/prepare",t)}function ke(e,t,i){return te(e,`/forks/${encodeURIComponent(t)}/commit`,i)}function Ne(e,t){return te(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Se(e,t,i){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(i)}`)}function Re(e,t){return te(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function re(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ne(e){return e.toLocaleString()}function ae(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}function P(e){return e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error"}function j(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as q,useTheme as Ge}from"@hermes/plugin-sdk";import{useEffect as me,useRef as Ce,useState as B}from"react";function Ye(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(i=>{if(typeof i!="object"||i===null||!("text"in i))return"";let l=i.text;return typeof l=="string"?l:""}).join("").trim():""}function Pe(e,t){let i=(e??[]).filter(u=>(u.role==="user"||u.role==="assistant")&&Ye(u).length>0&&typeof u.row_id=="number"),l=-1;for(let u=0;u<i.length;u+=1){let w=i[u];if(w===void 0)continue;let d=w.timestamp;w.role==="user"&&typeof d=="number"&&d<=t+.5&&(l=u)}if(l<=0)return null;let b=i[l-1]?.row_id;return typeof b=="number"&&b>0?b:null}import{jsx as c,jsxs as v}from"react/jsx-runtime";var Je=["python -m pytest -q","npm test","cargo test","go test ./..."],Qe=350;function J(e,t){return t.catch(i=>{throw new Error(`${e}: ${P(i)}`)})}function Xe(e){return new Promise(t=>{window.setTimeout(t,e)})}function Ze(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(i=>!i.hasAttribute("disabled"))}function et(e,t){let i=Ze(e),l=i[0],b=i[i.length-1];if(e===null||l===void 0||b===void 0)return;let u=document.activeElement;if(!e.contains(u)){t.preventDefault(),l.focus();return}t.shiftKey&&u===l?(t.preventDefault(),b.focus()):!t.shiftKey&&u===b&&(t.preventDefault(),l.focus())}var tt=`
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
`;function Te({ctx:e,session:t,event:i,onClose:l,onCreated:b}){let u=Ge().resolvedMode==="light",[w,d]=B(t.model??""),[C,D]=B(""),[p,$]=B(""),[s,z]=B(null),[I,T]=B(null),[R,y]=B(null),[F,A]=B(null),[M,x]=B(null),S=R!==null,H=Ce(null),Q=Ce(()=>{});me(()=>{let a=document.activeElement;return H.current?.focus(),()=>{a?.focus()}},[]),me(()=>{let a=m=>{if(m.key==="Escape"&&!S){l();return}if(m.key==="Tab"){et(H.current,m);return}m.key==="Enter"&&(m.metaKey||m.ctrlKey)&&!S&&(m.preventDefault(),Q.current())};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[S,l]),me(()=>{let a=p.trim();if(s===null||a===""){T(null);return}let m=!1,h=e.setTimeout(()=>{Se(e,s.branch_id,a).then(_=>{m||T(_)}).catch(()=>{m||T(null)})},Qe);return()=>{m=!0,h()}},[e,s,p]);let W=async()=>{let a=await q.request("session.active_list",{}),m=Array.isArray(a.sessions)?a.sessions:[],h=m.find(_=>_.session_key===t.session_id)?.id??m.find(_=>_.id===t.session_id)?.id;if(h===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let _=await q.request("session.title",{session_id:h});return{runtimeId:h,storedId:_.session_key??t.stored_session_id}}catch{return{runtimeId:h,storedId:t.stored_session_id}}},V=async()=>{y("prepare"),A(null),x(null);try{let a=await W(),m=await _e(e,{session_id:t.session_id,stored_session_id:a.storedId,event_id:i.id,model:w.trim()||null,provider:null,prompt:C.trim()||null,verify_cmd:p.trim()||null});z(m),D(m.prompt),m.verify_presets.length>0&&p.trim()===""&&$(m.verify_presets[0]??""),m.model!==null&&d(m.model)}catch(a){A(P(a))}finally{y(null)}},Y=async()=>{if(s!==null){y("run"),A(null),x(null);try{let a=await W();if(a.runtimeId===void 0)throw new Error("The session is not live. Open it in Hermes Desktop and try again.");let m=`\u21BA ${t.title??j(t.session_id)}`,h=null;try{let k=await q.request("session.history",{session_id:a.runtimeId});h=Pe(k.messages,s.fork_before_ts)}catch{h=null}let _,U,se=!1;if(h!==null){let k=await J("could not branch the session",q.request("session.branch",{session_id:a.runtimeId,through_message_id:h}));_=k.session_id,U=k.stored_session_id}else{let k={source:"desktop",title:m};s.worktree_path!==null&&(k.cwd=s.worktree_path),a.storedId!==null&&(k.parent_session_id=a.storedId);let L=await J("could not create the branch session",q.request("session.create",k));_=L.session_id,U=L.stored_session_id,se=!0}if(!se&&s.worktree_path!==null){let k=()=>q.request("session.cwd.set",{session_id:_,cwd:s.worktree_path});try{await J("could not attach the isolated workspace",k())}catch{await Xe(400);try{await J("could not attach the isolated workspace",k())}catch(L){throw L instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${P(L)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}}if(w.trim()&&w.trim()!==(t.model??""))try{let k=await q.request("config.set",{key:"model",value:w.trim(),session_id:_,confirm_expensive_model:!1});k.confirm_required===!0&&x(k.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{x("The branch was created, but the model switch failed; the rerun uses the current model.")}let ie=C.trim()||s.prompt;await J("could not start the rerun",q.request("prompt.submit",{session_id:_,text:ie})),await J("could not record the branch",ke(e,s.branch_id,{child_session_id:U,child_stored_session_id:U,model:w.trim()||null,provider:null,prompt:ie,verify_cmd:p.trim()||null})),b(s.branch_id),q.openSession(U,{intent:"tab"}),l()}catch(a){A(P(a))}finally{y(null)}}};Q.current=()=>{s===null?V():Y()};let X=s===null?"not prepared":s.fidelity,Z=s===null?"rw-badge rw-badge-idle":s.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return v("div",{className:u?"rw-overlay rw-light":"rw-overlay",onMouseDown:a=>{a.target===a.currentTarget&&!S&&l()},children:[c("style",{children:tt}),v("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:H,children:[v("header",{className:"rw-header",children:[v("div",{className:"rw-heading",children:[c("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),v("div",{className:"rw-subtitle",children:[re(i.ts)," \xB7 ",i.preview||"user turn"]})]}),c("button",{type:"button",className:"rw-close",onClick:l,disabled:S,"aria-label":"Close",children:"\xD7"})]}),v("div",{className:"rw-body",children:[v("section",{className:"rw-card",children:[v("div",{className:"rw-card-head",children:[c("span",{className:"rw-card-title",children:"Checkpoint"}),c("span",{className:Z,children:X==="full"?"workspace ready":X})]}),v("div",{className:"rw-chips",children:[v("span",{className:"rw-chip",children:["history rows ",s===null?"\u2014":s.fork_row_count]}),v("span",{className:"rw-chip",children:["verify timeout ",s===null?"\u2014":`${s.verify_timeout_seconds}s`]}),s?.snapshot_commit?v("span",{className:"rw-chip",children:["snapshot ",s.snapshot_commit.slice(0,8)]}):null]}),s?.worktree_path?c("div",{className:"rw-path",children:s.worktree_path}):c("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),s!==null&&s.fidelity!=="full"?c("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,s!==null&&s.context_rows===null?c("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,s!==null&&s.fork_row_count===0?c("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),v("div",{className:"rw-grid",children:[v("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Model"}),c("input",{className:"rw-input",value:w,onChange:a=>{d(a.target.value)},placeholder:"provider/model"}),c("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),v("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Verify command"}),c("input",{className:"rw-input",value:p,onChange:a=>{$(a.target.value)},placeholder:"python -m pytest -q"}),c("div",{className:"rw-chips",children:(s?.verify_presets.length?s.verify_presets:Je).map(a=>c("button",{type:"button",className:"rw-preset",onClick:()=>{$(a)},disabled:S,children:a},a))}),c("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),I!==null&&I.command===p.trim()?c("span",{className:"rw-resolved",children:I.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${I.resolved}`}):null]})]}),v("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Prompt for the rerun"}),c("textarea",{className:"rw-textarea",value:C,onChange:a=>{D(a.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),c("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]}),M!==null?c("div",{className:"rw-banner rw-banner-warn",role:"status",children:M}):null,F!==null?c("div",{className:"rw-banner rw-banner-error",role:"alert",children:F}):null]}),v("footer",{className:"rw-footer",children:[c("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),v("div",{className:"rw-actions",children:[c("button",{type:"button",className:"rw-button",onClick:l,disabled:S,children:"Cancel"}),s===null?c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{V()},disabled:S,children:R==="prepare"?"Preparing...":"Prepare branch"}):c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{Y()},disabled:S,children:R==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{Fragment as qe,jsx as n,jsxs as o}from"react/jsx-runtime";var rt=new Set(["done","failed","cleaned","discarded"]);function nt(e){return ae(Math.max(0,(e.last_ts-e.ts)*1e3))}function ot({event:e,selected:t,onSelect:i}){return o("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:i,children:[n("span",{className:`w-16 shrink-0 uppercase ${$e(e.kind,e.status)}`,children:De(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:ae(e.duration_ms)})]})}var st=new Set(["api_request","llm_call"]);function it({turn:e,expanded:t,events:i,loading:l,selectedEventId:b,onToggle:u,onFork:w,onSelectEvent:d}){let C=(i??[]).filter(p=>!st.has(p.kind)),D=(i??[]).length-C.length;return o("div",{className:"border-b border-(--ui-border) pb-1",children:[o("div",{className:"flex items-center gap-2",children:[o("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:u,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:re(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),o("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?o("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:nt(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:w,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:l?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):o(qe,{children:[C.map(p=>n(ot,{event:p,selected:b===p.id,onSelect:()=>{d(p)}},p.id)),D>0?o("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function De(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function $e(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Fe(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function K({label:e,value:t}){return o("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function at({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):o("div",{className:"flex flex-col gap-2",children:[o("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${$e(e.kind,e.status)}`,children:De(e.kind)}),o("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),o("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${ae(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function lt({ctx:e,branchId:t,refreshTick:i,onClose:l,onRefresh:b}){let[u,w]=f(null),[d,C]=f(null),[D,p]=f(!1),[$,s]=f(null);oe(()=>{let y=!1,F=null,A=async()=>{try{let x=await we(e,t);if(y)return!0;w(x),s(null);let S=x.branch.child_session_id;if(S!==null){let H=await ye(e,x.branch.parent_session_id,S,x.branch.fork_before_ts);y||C(H)}else C(null);return rt.has(x.branch.state)}catch(x){return y||s(P(x)),!1}},M=async()=>{let x=await A();!y&&!x&&(F=e.setTimeout(()=>{M()},2500))};return M(),()=>{y=!0,F!==null&&F()}},[e,t,i]);let z=async()=>{p(!0),s(null);try{await Ne(e,t),b()}catch(y){s(P(y))}finally{p(!1)}},I=async()=>{p(!0),s(null);try{await Re(e,t),b()}catch(y){s(P(y))}finally{p(!1)}};if(u===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let T=u.branch,R=u.run;return o("div",{className:"flex flex-col gap-2",children:[o("div",{className:"flex items-center justify-between gap-2",children:[o("div",{className:"flex items-center gap-2 text-xs",children:[o("span",{className:"font-medium",children:["Branch ",j(T.id)]}),n("span",{className:`uppercase ${Fe(T.state)}`,children:T.state}),R!==null&&R.verify_exit!==null?o("span",{className:R.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",R.verify_exit]}):null]}),o("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{z()},disabled:D||!T.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{I()},disabled:D||T.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:l,children:"Hide"})]})]}),$!==null?n("div",{className:"text-xs text-red-500",children:$}):null,d!==null?o("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[o("div",{className:"rounded border border-(--ui-border) p-2",children:[o("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",d.left?.frozen_at?` \xB7 frozen ${re(d.left.frozen_at)}`:""]}),n(K,{label:"outcome",value:d.left?.outcome??"unknown"}),n(K,{label:"tokens",value:d.left===null?"n/a":ne(d.left.tokens_in+d.left.tokens_out)}),n(K,{label:"tool errors",value:d.left===null?"n/a":String(d.left.tool_errors)})]}),o("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(K,{label:"outcome",value:d.right?.outcome??"running"}),n(K,{label:"verify",value:d.right?.verify_exit===null||d.right?.verify_exit===void 0?"not run":`exit ${d.right.verify_exit}`}),n(K,{label:"tokens",value:d.right===null?"n/a":ne(d.right.tokens_in+d.right.tokens_out)}),n(K,{label:"tool errors",value:d.right===null?"n/a":String(d.right.tool_errors)})]}),o("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",d.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),R!==null&&R.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:R.verify_out}):null,u.prompt!==null?o("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:u.prompt})]}):null]})}function Ae({ctx:e}){let t=Ie(Ee.state.activeSessionId),i=Ie(Ee.state.focusedStoredSessionId),[l,b]=f([]),[u,w]=f(null),[d,C]=f([]),[D,p]=f(!1),[$,s]=f(!1),[z,I]=f(null),[T,R]=f({}),[y,F]=f([]),[A,M]=f([]),[x,S]=f(null),[H,Q]=f(null),[W,V]=f(null),[Y,X]=f(null),[Z,a]=f(0),[m,h]=f(null),[_,U]=f(0),[se,ie]=f(!1),[k,L]=f(!1);oe(()=>e.onEvent("*",()=>{U(r=>r+1)}),[e]),oe(()=>{let r=!1,g=async()=>{try{let E=await ge(e);if(r)return;b(E),ie(!0),h(null),w(ee=>ee!==null&&E.some(ue=>ue.session_id===ee)?ee:t??E[0]?.session_id??null)}catch(E){r||h(P(E))}};g();let O=e.setInterval(()=>{g()},1e4);return()=>{r=!0,O()}},[e,t,Z,_]),oe(()=>{if(u===null){C([]),L(!1),p(!1),F([]),M([]);return}let r=!1,g=async()=>{try{let[E,ee,ue]=await Promise.all([ce(e,u),he(e,u),ve(e,u)]);if(r)return;C(Ve=>{let Ue=new Set(E.items.map(de=>de.seq)),Oe=Ve.filter(de=>!Ue.has(de.seq));return[...E.items,...Oe]}),p(E.has_more),L(!0),F(ee),M(ue),h(null)}catch(E){r||h(P(E))}};g();let O=e.setInterval(()=>{g()},1e4);return()=>{r=!0,O()}},[e,u,Z,_]),oe(()=>{if(x===null){Q(null);return}let r=!1;return xe(e,x).then(g=>{r||Q(g)}).catch(g=>{r||h(P(g))}),()=>{r=!0}},[e,x]);let N=l.find(r=>r.session_id===u)??null,Le=N!==null&&N.ended_at===null&&(N.session_id===t||N.session_id===i),Be=r=>{w(r.session_id),S(null),V(null),I(null),R({})},le=()=>{a(r=>r+1)},ze=r=>{if(z===r.id){I(null);return}I(r.id),T[r.id]===void 0&&be(e,r.session_id,r.seq,r.seq_to).then(g=>{R(O=>({...O,[r.id]:g}))}).catch(g=>{h(P(g))})},He=async()=>{let r=d[d.length-1];if(!(u===null||r===void 0)){s(!0);try{let g=await ce(e,u,r.seq);C(O=>[...O,...g.items]),p(g.has_more)}catch(g){h(P(g))}finally{s(!1)}}};return o("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[o("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[o("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),o("div",{className:"flex items-center gap-3 text-xs",children:[N!==null?n("span",{className:"text-(--ui-text-tertiary)",children:N.model??"unknown model"}):null,Le?o("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"live"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:le,children:"Refresh"})]})]}),m!==null?n("div",{className:"text-xs text-red-500",children:m}):null,o("div",{className:"flex min-h-0 flex-1 gap-3",children:[o("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[o("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),se?l.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):l.map(r=>o("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${u===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Be(r)},children:[o("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??j(r.session_id)})]}),o("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),o("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",ne(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id)):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]}),A.length>0?o("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),A.map(r=>o("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${W===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{V(r.id)},children:[o("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:j(r.id)}),n("span",{className:`uppercase ${Fe(r.state)}`,children:r.state})]}),o("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),o("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[N!==null?o("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[o("div",{children:[o("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:N.title??j(N.session_id)}),y.length>0?o("span",{className:"text-xs text-(--ui-text-tertiary)",children:[y.length," snapshots"]}):null]}),o("div",{className:"text-xs text-(--ui-text-tertiary)",children:[N.model??"unknown model"," \xB7 ",N.event_count," events \xB7 ",ne(N.tokens_in+N.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,o("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:N===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):k?d.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):o(qe,{children:[d.map(r=>n(it,{turn:r,expanded:z===r.id,events:T[r.id]??null,loading:z===r.id&&T[r.id]===void 0,selectedEventId:x,onToggle:()=>{ze(r)},onFork:()=>{N!==null&&X({session:N,event:r})},onSelectEvent:g=>{S(g.id)}},r.id)),D?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{He()},disabled:$,children:$?"Loading...":"Load earlier turns"}):o("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[d.length," turns \xB7 start of the recording"]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(at,{detail:H})})]})]})]}),W!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(lt,{ctx:e,branchId:W,refreshTick:Z,onClose:()=>{V(null)},onRefresh:le})}):null,Y!==null?n(Te,{ctx:e,session:Y.session,event:Y.event,onClose:()=>{X(null)},onCreated:r=>{V(r),le()}}):null]})}import{jsx as Me}from"react/jsx-runtime";var gt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{ut.navigate(G)};e.registerMany([{id:"page",area:mt,data:{path:G},render:()=>Me(Ae,{ctx:e})},{id:"nav",area:pt,data:{path:G,label:"Rewind",codicon:"history"}},{id:"palette-open",area:ct,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:dt,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:ft.right,order:130,render:()=>Me(fe,{})}])}},Vt=gt;export{Vt as default};
