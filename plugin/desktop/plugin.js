import{host as tt,KEYBINDS_AREA as rt,PALETTE_AREA as nt,ROUTES_AREA as st,SIDEBAR_NAV_AREA as ot,STATUSBAR_AREAS as it}from"@hermes/plugin-sdk";import{host as le,useValue as qe}from"@hermes/plugin-sdk";var W="/rewind";import{jsx as Me,jsxs as Be}from"react/jsx-runtime";function ue(){let e=qe(le.state.activeSessionId);return Be("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{le.navigate(W)},title:"Open Session Rewind",children:[Me("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as Ke,useValue as We}from"@hermes/plugin-sdk";import{useEffect as te,useState as g}from"react";function X(e,t,o){return e.rest(t,{method:"POST",body:o})}async function de(e){return(await e.rest("/sessions?limit=100")).items}async function ae(e,t,o=null){let u=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${u}`)}async function ce(e,t,o,u){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${u+1}`)).items}function me(e,t){return e.rest(`/events/${t}`)}function pe(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function fe(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function be(e,t){return X(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function ge(e,t,o,u=null){let p=u===null?"":`&before_ts=${u}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${p}`)}function xe(e,t){return X(e,"/forks/prepare",t)}function ve(e,t,o){return X(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function he(e,t){return X(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function we(e,t){return X(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function Z(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function ee(e){return e.toLocaleString()}function ne(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}function S(e){return e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error"}function V(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as M}from"@hermes/plugin-sdk";import{useEffect as ye,useRef as _e,useState as O}from"react";import{jsx as m,jsxs as x}from"react/jsx-runtime";var Le=["python -m pytest -q","npm test","cargo test","go test ./..."];function Y(e,t){return t.catch(o=>{throw new Error(`${e}: ${S(o)}`)})}function ze(e){return new Promise(t=>{window.setTimeout(t,e)})}function He(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let u=o.text;return typeof u=="string"?u:""}).join("").trim():""}function Ue(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function Ve(e,t){let o=Ue(e),u=o[0],p=o[o.length-1];if(e===null||u===void 0||p===void 0)return;let d=document.activeElement;if(!e.contains(d)){t.preventDefault(),u.focus();return}t.shiftKey&&d===u?(t.preventDefault(),p.focus()):!t.shiftKey&&d===p&&(t.preventDefault(),u.focus())}function Oe(e,t){let o=(e??[]).filter(d=>(d.role==="user"||d.role==="assistant")&&He(d).length>0&&typeof d.row_id=="number"),u=-1;for(let d=0;d<o.length;d+=1){let h=o[d];if(h===void 0)continue;let l=h.timestamp;h.role==="user"&&typeof l=="number"&&l<=t+.5&&(u=d)}if(u<=0)return null;let p=o[u-1]?.row_id;return typeof p=="number"&&p>0?p:null}var je=`
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
`;function ke({ctx:e,session:t,event:o,onClose:u,onCreated:p}){let[d,h]=O(t.model??""),[l,A]=O(""),[R,v]=O(""),[i,C]=O(null),[q,F]=O(null),[T,w]=O(null),[y,E]=O(null),k=q!==null,I=_e(null),_=_e(()=>{});ye(()=>{let a=document.activeElement;return I.current?.focus(),()=>{a?.focus()}},[]),ye(()=>{let a=f=>{if(f.key==="Escape"&&!k){u();return}if(f.key==="Tab"){Ve(I.current,f);return}f.key==="Enter"&&(f.metaKey||f.ctrlKey)&&!k&&(f.preventDefault(),_.current())};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[k,u]);let B=async()=>{let a=await M.request("session.active_list",{}),f=Array.isArray(a.sessions)?a.sessions:[],D=f.find(N=>N.session_key===t.session_id)?.id??f.find(N=>N.id===t.session_id)?.id;if(D===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let N=await M.request("session.title",{session_id:D});return{runtimeId:D,storedId:N.session_key??t.stored_session_id}}catch{return{runtimeId:D,storedId:t.stored_session_id}}},L=async()=>{F("prepare"),w(null),E(null);try{let a=await B(),f=await xe(e,{session_id:t.session_id,stored_session_id:a.storedId,event_id:o.id,model:d.trim()||null,provider:null,prompt:l.trim()||null,verify_cmd:R.trim()||null});C(f),A(f.prompt),f.model!==null&&h(f.model)}catch(a){w(S(a))}finally{F(null)}},K=async()=>{if(i!==null){F("run"),w(null),E(null);try{let a=await B();if(a.runtimeId===void 0)throw new Error("The session is not live. Open it in Hermes Desktop and try again.");let f=`\u21BA ${t.title??V(t.session_id)}`,D=null;try{let c=await M.request("session.history",{session_id:a.runtimeId});D=Oe(c.messages,i.fork_before_ts)}catch{D=null}let N,P,J=!1;if(D!==null){let c=await Y("could not branch the session",M.request("session.branch",{session_id:a.runtimeId,through_message_id:D}));N=c.session_id,P=c.stored_session_id}else{let c={source:"desktop",title:f};i.worktree_path!==null&&(c.cwd=i.worktree_path),a.storedId!==null&&(c.parent_session_id=a.storedId);let H=await Y("could not create the branch session",M.request("session.create",c));N=H.session_id,P=H.stored_session_id,J=!0}if(!J&&i.worktree_path!==null){let c=()=>M.request("session.cwd.set",{session_id:N,cwd:i.worktree_path});try{await Y("could not attach the isolated workspace",c())}catch{await ze(400);try{await Y("could not attach the isolated workspace",c())}catch(H){throw H instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${S(H)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}}if(d.trim()&&d.trim()!==(t.model??""))try{let c=await M.request("config.set",{key:"model",value:d.trim(),session_id:N,confirm_expensive_model:!1});c.confirm_required===!0&&E(c.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{E("The branch was created, but the model switch failed; the rerun uses the current model.")}let re=l.trim()||i.prompt;await Y("could not start the rerun",M.request("prompt.submit",{session_id:N,text:re})),await Y("could not record the branch",ve(e,i.branch_id,{child_session_id:P,child_stored_session_id:P,model:d.trim()||null,provider:null,prompt:re,verify_cmd:R.trim()||null})),p(i.branch_id),M.openSession(P,{intent:"tab"}),u()}catch(a){w(S(a))}finally{F(null)}}};_.current=()=>{i===null?L():K()};let z=i===null?"not prepared":i.fidelity,G=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return x("div",{className:"rw-overlay",onMouseDown:a=>{a.target===a.currentTarget&&!k&&u()},children:[m("style",{children:je}),x("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:I,children:[x("header",{className:"rw-header",children:[x("div",{className:"rw-heading",children:[m("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),x("div",{className:"rw-subtitle",children:[Z(o.ts)," \xB7 ",o.preview||"user turn"]})]}),m("button",{type:"button",className:"rw-close",onClick:u,disabled:k,"aria-label":"Close",children:"\xD7"})]}),x("div",{className:"rw-body",children:[x("section",{className:"rw-card",children:[x("div",{className:"rw-card-head",children:[m("span",{className:"rw-card-title",children:"Checkpoint"}),m("span",{className:G,children:z==="full"?"workspace ready":z})]}),x("div",{className:"rw-chips",children:[x("span",{className:"rw-chip",children:["history rows ",i===null?"\u2014":i.fork_row_count]}),x("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?x("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?m("div",{className:"rw-path",children:i.worktree_path}):m("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?m("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?m("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&i.fork_row_count===0?m("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),x("div",{className:"rw-grid",children:[x("label",{className:"rw-field",children:[m("span",{className:"rw-label",children:"Model"}),m("input",{className:"rw-input",value:d,onChange:a=>{h(a.target.value)},placeholder:"provider/model"}),m("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),x("label",{className:"rw-field",children:[m("span",{className:"rw-label",children:"Verify command"}),m("input",{className:"rw-input",value:R,onChange:a=>{v(a.target.value)},placeholder:"python -m pytest -q"}),m("div",{className:"rw-chips",children:Le.map(a=>m("button",{type:"button",className:"rw-preset",onClick:()=>{v(a)},disabled:k,children:a},a))}),m("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),i!==null&&R.trim()!==""?m("span",{className:"rw-resolved",children:i.verify_resolved===null?"Not found on the gateway PATH. Use the full interpreter path.":`Resolves to ${i.verify_resolved}`}):null]})]}),x("label",{className:"rw-field",children:[m("span",{className:"rw-label",children:"Prompt for the rerun"}),m("textarea",{className:"rw-textarea",value:l,onChange:a=>{A(a.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),m("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]}),y!==null?m("div",{className:"rw-banner rw-banner-warn",role:"status",children:y}):null,T!==null?m("div",{className:"rw-banner rw-banner-error",role:"alert",children:T}):null]}),x("footer",{className:"rw-footer",children:[m("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),x("div",{className:"rw-actions",children:[m("button",{type:"button",className:"rw-button",onClick:u,disabled:k,children:"Cancel"}),i===null?m("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{L()},disabled:k,children:q==="prepare"?"Preparing...":"Prepare branch"}):m("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{K()},disabled:k,children:q==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{Fragment as Ce,jsx as n,jsxs as s}from"react/jsx-runtime";var Ye=new Set(["done","failed","cleaned","discarded"]);function Ge(e){return ne(Math.max(0,(e.last_ts-e.ts)*1e3))}function Je({event:e,selected:t,onSelect:o}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[n("span",{className:`w-16 shrink-0 uppercase ${Se(e.kind,e.status)}`,children:Ne(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:ne(e.duration_ms)})]})}var Qe=new Set(["api_request","llm_call"]);function Xe({turn:e,expanded:t,events:o,loading:u,selectedEventId:p,onToggle:d,onFork:h,onSelectEvent:l}){let A=(o??[]).filter(v=>!Qe.has(v.kind)),R=(o??[]).length-A.length;return s("div",{className:"border-b border-(--ui-border) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:d,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:Z(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),s("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?s("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:Ge(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:h,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:u?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s(Ce,{children:[A.map(v=>n(Je,{event:v,selected:p===v.id,onSelect:()=>{l(v)}},v.id)),R>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function Ne(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function Se(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Re(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function j({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function Ze({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${Se(e.kind,e.status)}`,children:Ne(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${ne(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function et({ctx:e,branchId:t,refreshTick:o,onClose:u,onRefresh:p}){let[d,h]=g(null),[l,A]=g(null),[R,v]=g(!1),[i,C]=g(null);te(()=>{let y=!1,E=null,k=async()=>{try{let _=await be(e,t);if(y)return!0;h(_),C(null);let B=_.branch.child_session_id;if(B!==null){let L=await ge(e,_.branch.parent_session_id,B,_.branch.fork_before_ts);y||A(L)}else A(null);return Ye.has(_.branch.state)}catch(_){return y||C(S(_)),!1}},I=async()=>{let _=await k();!y&&!_&&(E=e.setTimeout(()=>{I()},2500))};return I(),()=>{y=!0,E!==null&&E()}},[e,t,o]);let q=async()=>{v(!0),C(null);try{await he(e,t),p()}catch(y){C(S(y))}finally{v(!1)}},F=async()=>{v(!0),C(null);try{await we(e,t),p()}catch(y){C(S(y))}finally{v(!1)}};if(d===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let T=d.branch,w=d.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",V(T.id)]}),n("span",{className:`uppercase ${Re(T.state)}`,children:T.state}),w!==null&&w.verify_exit!==null?s("span",{className:w.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",w.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{q()},disabled:R||!T.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{F()},disabled:R||T.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:u,children:"Hide"})]})]}),i!==null?n("div",{className:"text-xs text-red-500",children:i}):null,l!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[s("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",l.left?.frozen_at?` \xB7 frozen ${Z(l.left.frozen_at)}`:""]}),n(j,{label:"outcome",value:l.left?.outcome??"unknown"}),n(j,{label:"tokens",value:l.left===null?"n/a":ee(l.left.tokens_in+l.left.tokens_out)}),n(j,{label:"tool errors",value:l.left===null?"n/a":String(l.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(j,{label:"outcome",value:l.right?.outcome??"running"}),n(j,{label:"verify",value:l.right?.verify_exit===null||l.right?.verify_exit===void 0?"not run":`exit ${l.right.verify_exit}`}),n(j,{label:"tokens",value:l.right===null?"n/a":ee(l.right.tokens_in+l.right.tokens_out)}),n(j,{label:"tool errors",value:l.right===null?"n/a":String(l.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",l.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),w!==null&&w.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:w.verify_out}):null,d.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:d.prompt})]}):null]})}function Pe({ctx:e}){let t=We(Ke.state.activeSessionId),[o,u]=g([]),[p,d]=g(null),[h,l]=g([]),[A,R]=g(!1),[v,i]=g(!1),[C,q]=g(null),[F,T]=g({}),[w,y]=g([]),[E,k]=g([]),[I,_]=g(null),[B,L]=g(null),[K,z]=g(null),[G,a]=g(null),[f,D]=g(0),[N,P]=g(null),[J,re]=g(0);te(()=>e.onEvent("*",()=>{re(r=>r+1)}),[e]),te(()=>{let r=!1,b=async()=>{try{let $=await de(e);if(r)return;u($),P(null),d(Q=>Q!==null&&$.some(oe=>oe.session_id===Q)?Q:t??$[0]?.session_id??null)}catch($){r||P(S($))}};b();let U=e.setInterval(()=>{b()},1e4);return()=>{r=!0,U()}},[e,t,f,J]),te(()=>{if(p===null){l([]),R(!1),y([]),k([]);return}let r=!1,b=async()=>{try{let[$,Q,oe]=await Promise.all([ae(e,p),pe(e,p),fe(e,p)]);if(r)return;l($e=>{let Ae=new Set($.items.map(ie=>ie.seq)),Fe=$e.filter(ie=>!Ae.has(ie.seq));return[...$.items,...Fe]}),R($.has_more),y(Q),k(oe),P(null)}catch($){r||P(S($))}};b();let U=e.setInterval(()=>{b()},1e4);return()=>{r=!0,U()}},[e,p,f,J]),te(()=>{if(I===null){L(null);return}let r=!1;return me(e,I).then(b=>{r||L(b)}).catch(b=>{r||P(S(b))}),()=>{r=!0}},[e,I]);let c=o.find(r=>r.session_id===p)??null,H=c!==null&&c.ended_at===null&&c.session_id===t,Ee=r=>{d(r.session_id),_(null),z(null),q(null),T({})},se=()=>{D(r=>r+1)},Ie=r=>{if(C===r.id){q(null);return}q(r.id),F[r.id]===void 0&&ce(e,r.session_id,r.seq,r.seq_to).then(b=>{T(U=>({...U,[r.id]:b}))}).catch(b=>{P(S(b))})},De=async()=>{let r=h[h.length-1];if(!(p===null||r===void 0)){i(!0);try{let b=await ae(e,p,r.seq);l(U=>[...U,...b.items]),R(b.has_more)}catch(b){P(S(b))}finally{i(!1)}}};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[c!==null?n("span",{className:"text-(--ui-text-tertiary)",children:c.model??"unknown model"}):null,H?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"live"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:se,children:"Refresh"})]})]}),N!==null?n("div",{className:"text-xs text-red-500",children:N}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),o.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):o.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${p===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Ee(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??V(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",ee(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id))]}),E.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),E.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${K===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{z(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:V(r.id)}),n("span",{className:`uppercase ${Re(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[c!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:c.title??V(c.session_id)}),w.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[w.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[c.model??"unknown model"," \xB7 ",c.event_count," events \xB7 ",ee(c.tokens_in+c.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:c===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):h.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):s(Ce,{children:[h.map(r=>n(Xe,{turn:r,expanded:C===r.id,events:F[r.id]??null,loading:C===r.id&&F[r.id]===void 0,selectedEventId:I,onToggle:()=>{Ie(r)},onFork:()=>{c!==null&&a({session:c,event:r})},onSelectEvent:b=>{_(b.id)}},r.id)),A?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{De()},disabled:v,children:v?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[h.length," turns \xB7 start of the recording"]})]})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(Ze,{detail:B})})]})]})]}),K!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(et,{ctx:e,branchId:K,refreshTick:f,onClose:()=>{z(null)},onRefresh:se})}):null,G!==null?n(ke,{ctx:e,session:G.session,event:G.event,onClose:()=>{a(null)},onCreated:r=>{z(r),se()}}):null]})}import{jsx as Te}from"react/jsx-runtime";var at={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{tt.navigate(W)};e.registerMany([{id:"page",area:st,data:{path:W},render:()=>Te(Pe,{ctx:e})},{id:"nav",area:ot,data:{path:W,label:"Rewind",codicon:"history"}},{id:"palette-open",area:nt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:rt,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:it.right,order:130,render:()=>Te(ue,{})}])}},Dt=at;export{Dt as default};
