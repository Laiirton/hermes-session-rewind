import{host as et,KEYBINDS_AREA as tt,PALETTE_AREA as rt,ROUTES_AREA as nt,SIDEBAR_NAV_AREA as st,STATUSBAR_AREAS as ot}from"@hermes/plugin-sdk";import{host as ae,useValue as qe}from"@hermes/plugin-sdk";var K="/rewind";import{jsx as $e,jsxs as Me}from"react/jsx-runtime";function le(){let e=qe(ae.state.activeSessionId);return Me("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{ae.navigate(K)},title:"Open Session Rewind",children:[$e("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as je,useValue as Ke}from"@hermes/plugin-sdk";import{useEffect as X,useState as b}from"react";function te(e,t,o){return e.rest(t,{method:"POST",body:o})}async function ue(e){return(await e.rest("/sessions?limit=100")).items}async function ie(e,t,o=null){let u=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${u}`)}async function de(e,t,o,u){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${u+1}`)).items}function ce(e,t){return e.rest(`/events/${t}`)}function me(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function pe(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function fe(e,t){return e.rest(`/branches/${encodeURIComponent(t)}`)}function ge(e,t,o,u=null){let m=u===null?"":`&before_ts=${u}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${m}`)}function be(e,t){return te(e,"/forks/prepare",t)}function xe(e,t,o){return te(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function ve(e,t){return te(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function he(e,t){return te(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function J(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function Q(e){return e.toLocaleString()}function re(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}function T(e){return e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error"}function U(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as $}from"@hermes/plugin-sdk";import{useEffect as we,useRef as ye,useState as V}from"react";import{jsx as c,jsxs as x}from"react/jsx-runtime";var Be=["python -m pytest -q","npm test","cargo test","go test ./..."];function Le(e){return new Promise(t=>{window.setTimeout(t,e)})}function ze(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let u=o.text;return typeof u=="string"?u:""}).join("").trim():""}function He(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function Ue(e,t){let o=He(e),u=o[0],m=o[o.length-1];if(e===null||u===void 0||m===void 0)return;let d=document.activeElement;if(!e.contains(d)){t.preventDefault(),u.focus();return}t.shiftKey&&d===u?(t.preventDefault(),m.focus()):!t.shiftKey&&d===m&&(t.preventDefault(),u.focus())}function Ve(e,t){let o=(e??[]).filter(d=>(d.role==="user"||d.role==="assistant")&&ze(d).length>0&&typeof d.row_id=="number"),u=-1;for(let d=0;d<o.length;d+=1){let h=o[d];if(h===void 0)continue;let l=h.timestamp;h.role==="user"&&typeof l=="number"&&l<=t+.5&&(u=d)}if(u<=0)return null;let m=o[u-1]?.row_id;return typeof m=="number"&&m>0?m:null}var Oe=`
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
`;function _e({ctx:e,session:t,event:o,onClose:u,onCreated:m}){let[d,h]=V(t.model??""),[l,F]=V(""),[S,v]=V(""),[i,P]=V(null),[M,q]=V(null),[E,w]=V(null),[y,C]=V(null),N=M!==null,I=ye(null),_=ye(()=>{});we(()=>{let a=document.activeElement;return I.current?.focus(),()=>{a?.focus()}},[]),we(()=>{let a=f=>{if(f.key==="Escape"&&!N){u();return}if(f.key==="Tab"){Ue(I.current,f);return}f.key==="Enter"&&(f.metaKey||f.ctrlKey)&&!N&&(f.preventDefault(),_.current())};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[N,u]);let B=async()=>{let a=await $.request("session.active_list",{}),f=Array.isArray(a.sessions)?a.sessions:[],D=f.find(k=>k.session_key===t.session_id)?.id??f.find(k=>k.id===t.session_id)?.id;if(D===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let k=await $.request("session.title",{session_id:D});return{runtimeId:D,storedId:k.session_key??t.stored_session_id}}catch{return{runtimeId:D,storedId:t.stored_session_id}}},L=async()=>{q("prepare"),w(null),C(null);try{let a=await B(),f=await be(e,{session_id:t.session_id,stored_session_id:a.storedId,event_id:o.id,model:d.trim()||null,provider:null,prompt:l.trim()||null,verify_cmd:S.trim()||null});P(f),F(f.prompt),f.model!==null&&h(f.model)}catch(a){w(T(a))}finally{q(null)}},j=async()=>{if(i!==null){q("run"),w(null),C(null);try{let a=await B();if(a.runtimeId===void 0)throw new Error("The session is not live. Open it in Hermes Desktop and try again.");let f=`\u21BA ${t.title??U(t.session_id)}`,D=null;try{let p=await $.request("session.history",{session_id:a.runtimeId});D=Ve(p.messages,i.fork_before_ts)}catch{D=null}let k,R,Y=!1;if(D!==null){let p=await $.request("session.branch",{session_id:a.runtimeId,through_message_id:D});k=p.session_id,R=p.stored_session_id}else{let p={source:"desktop",title:f};i.worktree_path!==null&&(p.cwd=i.worktree_path),a.storedId!==null&&(p.parent_session_id=a.storedId);let ee=await $.request("session.create",p);k=ee.session_id,R=ee.stored_session_id,Y=!0}if(!Y&&i.worktree_path!==null)try{await $.request("session.cwd.set",{session_id:k,cwd:i.worktree_path})}catch{await Le(400);try{await $.request("session.cwd.set",{session_id:k,cwd:i.worktree_path})}catch{C("The branch was created, but the isolated workspace could not be attached. The rerun will use the original workspace.")}}if(d.trim()&&d.trim()!==(t.model??""))try{let p=await $.request("config.set",{key:"model",value:d.trim(),session_id:k,confirm_expensive_model:!1});p.confirm_required===!0&&C(p.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{C("The branch was created, but the model switch failed; the rerun uses the current model.")}let Z=l.trim()||i.prompt;await $.request("prompt.submit",{session_id:k,text:Z}),await xe(e,i.branch_id,{child_session_id:R,child_stored_session_id:R,model:d.trim()||null,provider:null,prompt:Z,verify_cmd:S.trim()||null}),m(i.branch_id),$.openSession(R,{intent:"tab"}),u()}catch(a){w(T(a))}finally{q(null)}}};_.current=()=>{i===null?L():j()};let z=i===null?"not prepared":i.fidelity,W=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return x("div",{className:"rw-overlay",onMouseDown:a=>{a.target===a.currentTarget&&!N&&u()},children:[c("style",{children:Oe}),x("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:I,children:[x("header",{className:"rw-header",children:[x("div",{className:"rw-heading",children:[c("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),x("div",{className:"rw-subtitle",children:[J(o.ts)," \xB7 ",o.preview||"user turn"]})]}),c("button",{type:"button",className:"rw-close",onClick:u,disabled:N,"aria-label":"Close",children:"\xD7"})]}),x("div",{className:"rw-body",children:[x("section",{className:"rw-card",children:[x("div",{className:"rw-card-head",children:[c("span",{className:"rw-card-title",children:"Checkpoint"}),c("span",{className:W,children:z==="full"?"workspace ready":z})]}),x("div",{className:"rw-chips",children:[x("span",{className:"rw-chip",children:["history rows ",i===null?"\u2014":i.fork_row_count]}),x("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?x("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?c("div",{className:"rw-path",children:i.worktree_path}):c("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?c("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?c("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&i.fork_row_count===0?c("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),x("div",{className:"rw-grid",children:[x("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Model"}),c("input",{className:"rw-input",value:d,onChange:a=>{h(a.target.value)},placeholder:"provider/model"}),c("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),x("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Verify command"}),c("input",{className:"rw-input",value:S,onChange:a=>{v(a.target.value)},placeholder:"python -m pytest -q"}),c("div",{className:"rw-chips",children:Be.map(a=>c("button",{type:"button",className:"rw-preset",onClick:()=>{v(a)},disabled:N,children:a},a))}),c("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),i!==null&&S.trim()!==""?c("span",{className:"rw-resolved",children:i.verify_resolved===null?"Not found on the gateway PATH. Use the full interpreter path.":`Resolves to ${i.verify_resolved}`}):null]})]}),x("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Prompt for the rerun"}),c("textarea",{className:"rw-textarea",value:l,onChange:a=>{F(a.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),c("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]}),y!==null?c("div",{className:"rw-banner rw-banner-warn",role:"status",children:y}):null,E!==null?c("div",{className:"rw-banner rw-banner-error",role:"alert",children:E}):null]}),x("footer",{className:"rw-footer",children:[c("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),x("div",{className:"rw-actions",children:[c("button",{type:"button",className:"rw-button",onClick:u,disabled:N,children:"Cancel"}),i===null?c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{L()},disabled:N,children:M==="prepare"?"Preparing...":"Prepare branch"}):c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{j()},disabled:N,children:M==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{Fragment as Pe,jsx as n,jsxs as s}from"react/jsx-runtime";var We=new Set(["done","failed","cleaned","discarded"]);function Ye(e){return re(Math.max(0,(e.last_ts-e.ts)*1e3))}function Ge({event:e,selected:t,onSelect:o}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[n("span",{className:`w-16 shrink-0 uppercase ${Ne(e.kind,e.status)}`,children:ke(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:re(e.duration_ms)})]})}var Je=new Set(["api_request","llm_call"]);function Qe({turn:e,expanded:t,events:o,loading:u,selectedEventId:m,onToggle:d,onFork:h,onSelectEvent:l}){let F=(o??[]).filter(v=>!Je.has(v.kind)),S=(o??[]).length-F.length;return s("div",{className:"border-b border-(--ui-border) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:d,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:J(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),s("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?s("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:Ye(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:h,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:u?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s(Pe,{children:[F.map(v=>n(Ge,{event:v,selected:m===v.id,onSelect:()=>{l(v)}},v.id)),S>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function ke(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function Ne(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Se(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function O({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function Xe({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${Ne(e.kind,e.status)}`,children:ke(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${re(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function Ze({ctx:e,branchId:t,refreshTick:o,onClose:u,onRefresh:m}){let[d,h]=b(null),[l,F]=b(null),[S,v]=b(!1),[i,P]=b(null);X(()=>{let y=!1,C=null,N=async()=>{try{let _=await fe(e,t);if(y)return!0;h(_),P(null);let B=_.branch.child_session_id;if(B!==null){let L=await ge(e,_.branch.parent_session_id,B,_.branch.fork_before_ts);y||F(L)}else F(null);return We.has(_.branch.state)}catch(_){return y||P(T(_)),!1}},I=async()=>{let _=await N();!y&&!_&&(C=e.setTimeout(()=>{I()},2500))};return I(),()=>{y=!0,C!==null&&C()}},[e,t,o]);let M=async()=>{v(!0),P(null);try{await ve(e,t),m()}catch(y){P(T(y))}finally{v(!1)}},q=async()=>{v(!0),P(null);try{await he(e,t),m()}catch(y){P(T(y))}finally{v(!1)}};if(d===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let E=d.branch,w=d.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",U(E.id)]}),n("span",{className:`uppercase ${Se(E.state)}`,children:E.state}),w!==null&&w.verify_exit!==null?s("span",{className:w.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",w.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{M()},disabled:S||!E.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{q()},disabled:S||E.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:u,children:"Hide"})]})]}),i!==null?n("div",{className:"text-xs text-red-500",children:i}):null,l!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[s("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",l.left?.frozen_at?` \xB7 frozen ${J(l.left.frozen_at)}`:""]}),n(O,{label:"outcome",value:l.left?.outcome??"unknown"}),n(O,{label:"tokens",value:l.left===null?"n/a":Q(l.left.tokens_in+l.left.tokens_out)}),n(O,{label:"tool errors",value:l.left===null?"n/a":String(l.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(O,{label:"outcome",value:l.right?.outcome??"running"}),n(O,{label:"verify",value:l.right?.verify_exit===null||l.right?.verify_exit===void 0?"not run":`exit ${l.right.verify_exit}`}),n(O,{label:"tokens",value:l.right===null?"n/a":Q(l.right.tokens_in+l.right.tokens_out)}),n(O,{label:"tool errors",value:l.right===null?"n/a":String(l.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",l.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),w!==null&&w.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:w.verify_out}):null,d.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:d.prompt})]}):null]})}function Re({ctx:e}){let t=Ke(je.state.activeSessionId),[o,u]=b([]),[m,d]=b(null),[h,l]=b([]),[F,S]=b(!1),[v,i]=b(!1),[P,M]=b(null),[q,E]=b({}),[w,y]=b([]),[C,N]=b([]),[I,_]=b(null),[B,L]=b(null),[j,z]=b(null),[W,a]=b(null),[f,D]=b(0),[k,R]=b(null),[Y,Z]=b(0);X(()=>e.onEvent("*",()=>{Z(r=>r+1)}),[e]),X(()=>{let r=!1,g=async()=>{try{let A=await ue(e);if(r)return;u(A),R(null),d(G=>G!==null&&A.some(se=>se.session_id===G)?G:t??A[0]?.session_id??null)}catch(A){r||R(T(A))}};g();let H=e.setInterval(()=>{g()},1e4);return()=>{r=!0,H()}},[e,t,f,Y]),X(()=>{if(m===null){l([]),S(!1),y([]),N([]);return}let r=!1,g=async()=>{try{let[A,G,se]=await Promise.all([ie(e,m),me(e,m),pe(e,m)]);if(r)return;l(De=>{let Ae=new Set(A.items.map(oe=>oe.seq)),Fe=De.filter(oe=>!Ae.has(oe.seq));return[...A.items,...Fe]}),S(A.has_more),y(G),N(se),R(null)}catch(A){r||R(T(A))}};g();let H=e.setInterval(()=>{g()},1e4);return()=>{r=!0,H()}},[e,m,f,Y]),X(()=>{if(I===null){L(null);return}let r=!1;return ce(e,I).then(g=>{r||L(g)}).catch(g=>{r||R(T(g))}),()=>{r=!0}},[e,I]);let p=o.find(r=>r.session_id===m)??null,ee=p!==null&&p.ended_at===null&&p.session_id===t,Te=r=>{d(r.session_id),_(null),z(null),M(null),E({})},ne=()=>{D(r=>r+1)},Ee=r=>{if(P===r.id){M(null);return}M(r.id),q[r.id]===void 0&&de(e,r.session_id,r.seq,r.seq_to).then(g=>{E(H=>({...H,[r.id]:g}))}).catch(g=>{R(T(g))})},Ie=async()=>{let r=h[h.length-1];if(!(m===null||r===void 0)){i(!0);try{let g=await ie(e,m,r.seq);l(H=>[...H,...g.items]),S(g.has_more)}catch(g){R(T(g))}finally{i(!1)}}};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[p!==null?n("span",{className:"text-(--ui-text-tertiary)",children:p.model??"unknown model"}):null,ee?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"live"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:ne,children:"Refresh"})]})]}),k!==null?n("div",{className:"text-xs text-red-500",children:k}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),o.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):o.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${m===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Te(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??U(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",Q(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id))]}),C.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),C.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${j===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{z(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:U(r.id)}),n("span",{className:`uppercase ${Se(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[p!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:p.title??U(p.session_id)}),w.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[w.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[p.model??"unknown model"," \xB7 ",p.event_count," events \xB7 ",Q(p.tokens_in+p.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:p===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):h.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):s(Pe,{children:[h.map(r=>n(Qe,{turn:r,expanded:P===r.id,events:q[r.id]??null,loading:P===r.id&&q[r.id]===void 0,selectedEventId:I,onToggle:()=>{Ee(r)},onFork:()=>{p!==null&&a({session:p,event:r})},onSelectEvent:g=>{_(g.id)}},r.id)),F?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Ie()},disabled:v,children:v?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[h.length," turns \xB7 start of the recording"]})]})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(Xe,{detail:B})})]})]})]}),j!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(Ze,{ctx:e,branchId:j,refreshTick:f,onClose:()=>{z(null)},onRefresh:ne})}):null,W!==null?n(_e,{ctx:e,session:W.session,event:W.event,onClose:()=>{a(null)},onCreated:r=>{z(r),ne()}}):null]})}import{jsx as Ce}from"react/jsx-runtime";var it={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{et.navigate(K)};e.registerMany([{id:"page",area:nt,data:{path:K},render:()=>Ce(Re,{ctx:e})},{id:"nav",area:st,data:{path:K,label:"Rewind",codicon:"history"}},{id:"palette-open",area:rt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:tt,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:ot.right,order:130,render:()=>Ce(le,{})}])}},It=it;export{It as default};
