import{host as rt,KEYBINDS_AREA as nt,PALETTE_AREA as st,ROUTES_AREA as ot,SIDEBAR_NAV_AREA as it,STATUSBAR_AREAS as at}from"@hermes/plugin-sdk";import{host as le,useValue as Le}from"@hermes/plugin-sdk";var Y="/rewind";import{jsx as ze,jsxs as He}from"react/jsx-runtime";function ue(){let e=Le(le.state.activeSessionId);return He("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{le.navigate(Y)},title:"Open Session Rewind",children:[ze("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as Ne,useValue as Se}from"@hermes/plugin-sdk";import{useEffect as re,useState as b}from"react";function Z(e,t,o){return e.rest(t,{method:"POST",body:o})}async function de(e){return(await e.rest("/sessions?limit=100")).items}async function ae(e,t,o=null){let d=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${d}`)}async function ce(e,t,o,d){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${d+1}`)).items}function me(e,t){return e.rest(`/events/${t}`)}function pe(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function fe(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function be(e,t){return Z(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function ge(e,t,o,d=null){let g=d===null?"":`&before_ts=${d}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${g}`)}function xe(e,t){return Z(e,"/forks/prepare",t)}function ve(e,t,o){return Z(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function he(e,t){return Z(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function we(e,t){return Z(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function ee(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function te(e){return e.toLocaleString()}function ne(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}function N(e){return e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error"}function U(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as B}from"@hermes/plugin-sdk";import{useEffect as ye,useRef as _e,useState as V}from"react";import{jsx as c,jsxs as v}from"react/jsx-runtime";var Ue=["python -m pytest -q","npm test","cargo test","go test ./..."];function G(e,t){return t.catch(o=>{throw new Error(`${e}: ${N(o)}`)})}function Ve(e){return new Promise(t=>{window.setTimeout(t,e)})}function Oe(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let d=o.text;return typeof d=="string"?d:""}).join("").trim():""}function je(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function Ke(e,t){let o=je(e),d=o[0],g=o[o.length-1];if(e===null||d===void 0||g===void 0)return;let i=document.activeElement;if(!e.contains(i)){t.preventDefault(),d.focus();return}t.shiftKey&&i===d?(t.preventDefault(),g.focus()):!t.shiftKey&&i===g&&(t.preventDefault(),d.focus())}function We(e,t){let o=(e??[]).filter(i=>(i.role==="user"||i.role==="assistant")&&Oe(i).length>0&&typeof i.row_id=="number"),d=-1;for(let i=0;i<o.length;i+=1){let S=o[i];if(S===void 0)continue;let u=S.timestamp;S.role==="user"&&typeof u=="number"&&u<=t+.5&&(d=i)}if(d<=0)return null;let g=o[d-1]?.row_id;return typeof g=="number"&&g>0?g:null}var Ye=`
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
`;function ke({ctx:e,session:t,event:o,onClose:d,onCreated:g}){let[i,S]=V(t.model??""),[u,C]=V(""),[E,x]=V(""),[a,I]=V(null),[q,A]=V(null),[T,y]=V(null),[_,D]=V(null),k=q!==null,M=_e(null),h=_e(()=>{});ye(()=>{let l=document.activeElement;return M.current?.focus(),()=>{l?.focus()}},[]),ye(()=>{let l=p=>{if(p.key==="Escape"&&!k){d();return}if(p.key==="Tab"){Ke(M.current,p);return}p.key==="Enter"&&(p.metaKey||p.ctrlKey)&&!k&&(p.preventDefault(),h.current())};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[k,d]);let L=async()=>{let l=await B.request("session.active_list",{}),p=Array.isArray(l.sessions)?l.sessions:[],R=p.find(P=>P.session_key===t.session_id)?.id??p.find(P=>P.id===t.session_id)?.id;if(R===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let P=await B.request("session.title",{session_id:R});return{runtimeId:R,storedId:P.session_key??t.stored_session_id}}catch{return{runtimeId:R,storedId:t.stored_session_id}}},j=async()=>{A("prepare"),y(null),D(null);try{let l=await L(),p=await xe(e,{session_id:t.session_id,stored_session_id:l.storedId,event_id:o.id,model:i.trim()||null,provider:null,prompt:u.trim()||null,verify_cmd:E.trim()||null});I(p),C(p.prompt),p.model!==null&&S(p.model)}catch(l){y(N(l))}finally{A(null)}},J=async()=>{if(a!==null){A("run"),y(null),D(null);try{let l=await L();if(l.runtimeId===void 0)throw new Error("The session is not live. Open it in Hermes Desktop and try again.");let p=`\u21BA ${t.title??U(t.session_id)}`,R=null;try{let w=await B.request("session.history",{session_id:l.runtimeId});R=We(w.messages,a.fork_before_ts)}catch{R=null}let P,z,F=!1;if(R!==null){let w=await G("could not branch the session",B.request("session.branch",{session_id:l.runtimeId,through_message_id:R}));P=w.session_id,z=w.stored_session_id}else{let w={source:"desktop",title:p};a.worktree_path!==null&&(w.cwd=a.worktree_path),l.storedId!==null&&(w.parent_session_id=l.storedId);let m=await G("could not create the branch session",B.request("session.create",w));P=m.session_id,z=m.stored_session_id,F=!0}if(!F&&a.worktree_path!==null){let w=()=>B.request("session.cwd.set",{session_id:P,cwd:a.worktree_path});try{await G("could not attach the isolated workspace",w())}catch{await Ve(400);try{await G("could not attach the isolated workspace",w())}catch(m){throw m instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${N(m)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}}if(i.trim()&&i.trim()!==(t.model??""))try{let w=await B.request("config.set",{key:"model",value:i.trim(),session_id:P,confirm_expensive_model:!1});w.confirm_required===!0&&D(w.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{D("The branch was created, but the model switch failed; the rerun uses the current model.")}let Q=u.trim()||a.prompt;await G("could not start the rerun",B.request("prompt.submit",{session_id:P,text:Q})),await G("could not record the branch",ve(e,a.branch_id,{child_session_id:z,child_stored_session_id:z,model:i.trim()||null,provider:null,prompt:Q,verify_cmd:E.trim()||null})),g(a.branch_id),B.openSession(z,{intent:"tab"}),d()}catch(l){y(N(l))}finally{A(null)}}};h.current=()=>{a===null?j():J()};let K=a===null?"not prepared":a.fidelity,W=a===null?"rw-badge rw-badge-idle":a.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return v("div",{className:"rw-overlay",onMouseDown:l=>{l.target===l.currentTarget&&!k&&d()},children:[c("style",{children:Ye}),v("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:M,children:[v("header",{className:"rw-header",children:[v("div",{className:"rw-heading",children:[c("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),v("div",{className:"rw-subtitle",children:[ee(o.ts)," \xB7 ",o.preview||"user turn"]})]}),c("button",{type:"button",className:"rw-close",onClick:d,disabled:k,"aria-label":"Close",children:"\xD7"})]}),v("div",{className:"rw-body",children:[v("section",{className:"rw-card",children:[v("div",{className:"rw-card-head",children:[c("span",{className:"rw-card-title",children:"Checkpoint"}),c("span",{className:W,children:K==="full"?"workspace ready":K})]}),v("div",{className:"rw-chips",children:[v("span",{className:"rw-chip",children:["history rows ",a===null?"\u2014":a.fork_row_count]}),v("span",{className:"rw-chip",children:["verify timeout ",a===null?"\u2014":`${a.verify_timeout_seconds}s`]}),a?.snapshot_commit?v("span",{className:"rw-chip",children:["snapshot ",a.snapshot_commit.slice(0,8)]}):null]}),a?.worktree_path?c("div",{className:"rw-path",children:a.worktree_path}):c("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),a!==null&&a.fidelity!=="full"?c("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,a!==null&&a.context_rows===null?c("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,a!==null&&a.fork_row_count===0?c("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),v("div",{className:"rw-grid",children:[v("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Model"}),c("input",{className:"rw-input",value:i,onChange:l=>{S(l.target.value)},placeholder:"provider/model"}),c("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),v("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Verify command"}),c("input",{className:"rw-input",value:E,onChange:l=>{x(l.target.value)},placeholder:"python -m pytest -q"}),c("div",{className:"rw-chips",children:Ue.map(l=>c("button",{type:"button",className:"rw-preset",onClick:()=>{x(l)},disabled:k,children:l},l))}),c("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),a!==null&&E.trim()!==""?c("span",{className:"rw-resolved",children:a.verify_resolved===null?"Not found on the gateway PATH. Use the full interpreter path.":`Resolves to ${a.verify_resolved}`}):null]})]}),v("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Prompt for the rerun"}),c("textarea",{className:"rw-textarea",value:u,onChange:l=>{C(l.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),c("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]}),_!==null?c("div",{className:"rw-banner rw-banner-warn",role:"status",children:_}):null,T!==null?c("div",{className:"rw-banner rw-banner-error",role:"alert",children:T}):null]}),v("footer",{className:"rw-footer",children:[c("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),v("div",{className:"rw-actions",children:[c("button",{type:"button",className:"rw-button",onClick:d,disabled:k,children:"Cancel"}),a===null?c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{j()},disabled:k,children:q==="prepare"?"Preparing...":"Prepare branch"}):c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{J()},disabled:k,children:q==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{Fragment as Ee,jsx as n,jsxs as s}from"react/jsx-runtime";var Ge=new Set(["done","failed","cleaned","discarded"]);function Je(e){return ne(Math.max(0,(e.last_ts-e.ts)*1e3))}function Qe({event:e,selected:t,onSelect:o}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[n("span",{className:`w-16 shrink-0 uppercase ${Pe(e.kind,e.status)}`,children:Re(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:ne(e.duration_ms)})]})}var Xe=new Set(["api_request","llm_call"]);function Ze({turn:e,expanded:t,events:o,loading:d,selectedEventId:g,onToggle:i,onFork:S,onSelectEvent:u}){let C=(o??[]).filter(x=>!Xe.has(x.kind)),E=(o??[]).length-C.length;return s("div",{className:"border-b border-(--ui-border) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:i,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:ee(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),s("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?s("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:Je(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:S,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:d?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s(Ee,{children:[C.map(x=>n(Qe,{event:x,selected:g===x.id,onSelect:()=>{u(x)}},x.id)),E>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function Re(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function Pe(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Ce(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function O({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function et({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${Pe(e.kind,e.status)}`,children:Re(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${ne(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function tt({ctx:e,branchId:t,refreshTick:o,onClose:d,onRefresh:g}){let[i,S]=b(null),[u,C]=b(null),[E,x]=b(!1),[a,I]=b(null);re(()=>{let _=!1,D=null,k=async()=>{try{let h=await be(e,t);if(_)return!0;S(h),I(null);let L=h.branch.child_session_id;if(L!==null){let j=await ge(e,h.branch.parent_session_id,L,h.branch.fork_before_ts);_||C(j)}else C(null);return Ge.has(h.branch.state)}catch(h){return _||I(N(h)),!1}},M=async()=>{let h=await k();!_&&!h&&(D=e.setTimeout(()=>{M()},2500))};return M(),()=>{_=!0,D!==null&&D()}},[e,t,o]);let q=async()=>{x(!0),I(null);try{await he(e,t),g()}catch(_){I(N(_))}finally{x(!1)}},A=async()=>{x(!0),I(null);try{await we(e,t),g()}catch(_){I(N(_))}finally{x(!1)}};if(i===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let T=i.branch,y=i.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",U(T.id)]}),n("span",{className:`uppercase ${Ce(T.state)}`,children:T.state}),y!==null&&y.verify_exit!==null?s("span",{className:y.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",y.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{q()},disabled:E||!T.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{A()},disabled:E||T.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:d,children:"Hide"})]})]}),a!==null?n("div",{className:"text-xs text-red-500",children:a}):null,u!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[s("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",u.left?.frozen_at?` \xB7 frozen ${ee(u.left.frozen_at)}`:""]}),n(O,{label:"outcome",value:u.left?.outcome??"unknown"}),n(O,{label:"tokens",value:u.left===null?"n/a":te(u.left.tokens_in+u.left.tokens_out)}),n(O,{label:"tool errors",value:u.left===null?"n/a":String(u.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(O,{label:"outcome",value:u.right?.outcome??"running"}),n(O,{label:"verify",value:u.right?.verify_exit===null||u.right?.verify_exit===void 0?"not run":`exit ${u.right.verify_exit}`}),n(O,{label:"tokens",value:u.right===null?"n/a":te(u.right.tokens_in+u.right.tokens_out)}),n(O,{label:"tool errors",value:u.right===null?"n/a":String(u.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",u.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),y!==null&&y.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:y.verify_out}):null,i.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:i.prompt})]}):null]})}function Te({ctx:e}){let t=Se(Ne.state.activeSessionId),o=Se(Ne.state.focusedStoredSessionId),[d,g]=b([]),[i,S]=b(null),[u,C]=b([]),[E,x]=b(!1),[a,I]=b(!1),[q,A]=b(null),[T,y]=b({}),[_,D]=b([]),[k,M]=b([]),[h,L]=b(null),[j,J]=b(null),[K,W]=b(null),[l,p]=b(null),[R,P]=b(0),[z,F]=b(null),[Q,w]=b(0);re(()=>e.onEvent("*",()=>{w(r=>r+1)}),[e]),re(()=>{let r=!1,f=async()=>{try{let $=await de(e);if(r)return;g($),F(null),S(X=>X!==null&&$.some(oe=>oe.session_id===X)?X:t??$[0]?.session_id??null)}catch($){r||F(N($))}};f();let H=e.setInterval(()=>{f()},1e4);return()=>{r=!0,H()}},[e,t,R,Q]),re(()=>{if(i===null){C([]),x(!1),D([]),M([]);return}let r=!1,f=async()=>{try{let[$,X,oe]=await Promise.all([ae(e,i),pe(e,i),fe(e,i)]);if(r)return;C(qe=>{let Me=new Set($.items.map(ie=>ie.seq)),Be=qe.filter(ie=>!Me.has(ie.seq));return[...$.items,...Be]}),x($.has_more),D(X),M(oe),F(null)}catch($){r||F(N($))}};f();let H=e.setInterval(()=>{f()},1e4);return()=>{r=!0,H()}},[e,i,R,Q]),re(()=>{if(h===null){J(null);return}let r=!1;return me(e,h).then(f=>{r||J(f)}).catch(f=>{r||F(N(f))}),()=>{r=!0}},[e,h]);let m=d.find(r=>r.session_id===i)??null,De=m!==null&&m.ended_at===null&&(m.session_id===t||m.session_id===o),$e=r=>{S(r.session_id),L(null),W(null),A(null),y({})},se=()=>{P(r=>r+1)},Ae=r=>{if(q===r.id){A(null);return}A(r.id),T[r.id]===void 0&&ce(e,r.session_id,r.seq,r.seq_to).then(f=>{y(H=>({...H,[r.id]:f}))}).catch(f=>{F(N(f))})},Fe=async()=>{let r=u[u.length-1];if(!(i===null||r===void 0)){I(!0);try{let f=await ae(e,i,r.seq);C(H=>[...H,...f.items]),x(f.has_more)}catch(f){F(N(f))}finally{I(!1)}}};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[m!==null?n("span",{className:"text-(--ui-text-tertiary)",children:m.model??"unknown model"}):null,De?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"live"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:se,children:"Refresh"})]})]}),z!==null?n("div",{className:"text-xs text-red-500",children:z}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),d.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):d.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${i===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{$e(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??U(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",te(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id))]}),k.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),k.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${K===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{W(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:U(r.id)}),n("span",{className:`uppercase ${Ce(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[m!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:m.title??U(m.session_id)}),_.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[_.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[m.model??"unknown model"," \xB7 ",m.event_count," events \xB7 ",te(m.tokens_in+m.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:m===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):u.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):s(Ee,{children:[u.map(r=>n(Ze,{turn:r,expanded:q===r.id,events:T[r.id]??null,loading:q===r.id&&T[r.id]===void 0,selectedEventId:h,onToggle:()=>{Ae(r)},onFork:()=>{m!==null&&p({session:m,event:r})},onSelectEvent:f=>{L(f.id)}},r.id)),E?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Fe()},disabled:a,children:a?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[u.length," turns \xB7 start of the recording"]})]})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(et,{detail:j})})]})]})]}),K!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(tt,{ctx:e,branchId:K,refreshTick:R,onClose:()=>{W(null)},onRefresh:se})}):null,l!==null?n(ke,{ctx:e,session:l.session,event:l.event,onClose:()=>{p(null)},onCreated:r=>{W(r),se()}}):null]})}import{jsx as Ie}from"react/jsx-runtime";var lt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{rt.navigate(Y)};e.registerMany([{id:"page",area:ot,data:{path:Y},render:()=>Ie(Te,{ctx:e})},{id:"nav",area:it,data:{path:Y,label:"Rewind",codicon:"history"}},{id:"palette-open",area:st,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:nt,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:at.right,order:130,render:()=>Ie(ue,{})}])}},$t=lt;export{$t as default};
