import{host as ae,useValue as Je,KEYBINDS_AREA as Qe,PALETTE_AREA as Xe,ROUTES_AREA as Ze,SIDEBAR_NAV_AREA as et,STATUSBAR_AREAS as tt}from"@hermes/plugin-sdk";import{host as He,useValue as Ue}from"@hermes/plugin-sdk";import{useEffect as Q,useState as b}from"react";function ee(e,t,i){return e.rest(t,{method:"POST",body:i})}async function ue(e){return(await e.rest("/sessions?limit=100")).items}async function oe(e,t,i=null){let u=i===null?"":`&before_seq=${i}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${u}`)}async function de(e,t,i,u){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${i-1}&before_seq=${u+1}`)).items}function ce(e,t){return e.rest(`/events/${t}`)}function me(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function pe(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function fe(e,t){return e.rest(`/branches/${encodeURIComponent(t)}`)}function ge(e,t,i,u=null){let m=u===null?"":`&before_ts=${u}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(i)}${m}`)}function be(e,t){return ee(e,"/forks/prepare",t)}function xe(e,t,i){return ee(e,`/forks/${encodeURIComponent(t)}/commit`,i)}function ve(e,t){return ee(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function he(e,t){return ee(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function G(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function J(e){return e.toLocaleString()}function te(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}function T(e){return e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error"}function U(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as $}from"@hermes/plugin-sdk";import{useEffect as we,useRef as ye,useState as V}from"react";import{jsx as c,jsxs as x}from"react/jsx-runtime";var qe=["python -m pytest -q","npm test","cargo test","go test ./..."];function Ae(e){return new Promise(t=>{window.setTimeout(t,e)})}function $e(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(i=>{if(typeof i!="object"||i===null||!("text"in i))return"";let u=i.text;return typeof u=="string"?u:""}).join("").trim():""}function Me(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(i=>!i.hasAttribute("disabled"))}function Be(e,t){let i=Me(e),u=i[0],m=i[i.length-1];if(e===null||u===void 0||m===void 0)return;let d=document.activeElement;if(!e.contains(d)){t.preventDefault(),u.focus();return}t.shiftKey&&d===u?(t.preventDefault(),m.focus()):!t.shiftKey&&d===m&&(t.preventDefault(),u.focus())}function Le(e,t){let i=(e??[]).filter(d=>(d.role==="user"||d.role==="assistant")&&$e(d).length>0&&typeof d.row_id=="number"),u=-1;for(let d=0;d<i.length;d+=1){let h=i[d];if(h===void 0)continue;let l=h.timestamp;h.role==="user"&&typeof l=="number"&&l<=t+.5&&(u=d)}if(u<=0)return null;let m=i[u-1]?.row_id;return typeof m=="number"&&m>0?m:null}var ze=`
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
`;function _e({ctx:e,session:t,event:i,onClose:u,onCreated:m}){let[d,h]=V(t.model??""),[l,q]=V(""),[S,v]=V(""),[o,P]=V(null),[M,A]=V(null),[E,w]=V(null),[y,C]=V(null),N=M!==null,I=ye(null),_=ye(()=>{});we(()=>{let a=document.activeElement;return I.current?.focus(),()=>{a?.focus()}},[]),we(()=>{let a=f=>{if(f.key==="Escape"&&!N){u();return}if(f.key==="Tab"){Be(I.current,f);return}f.key==="Enter"&&(f.metaKey||f.ctrlKey)&&!N&&(f.preventDefault(),_.current())};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[N,u]);let B=async()=>{let a=await $.request("session.active_list",{}),f=Array.isArray(a.sessions)?a.sessions:[],D=f.find(k=>k.session_key===t.session_id)?.id??f.find(k=>k.id===t.session_id)?.id;if(D===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let k=await $.request("session.title",{session_id:D});return{runtimeId:D,storedId:k.session_key??t.stored_session_id}}catch{return{runtimeId:D,storedId:t.stored_session_id}}},L=async()=>{A("prepare"),w(null),C(null);try{let a=await B(),f=await be(e,{session_id:t.session_id,stored_session_id:a.storedId,event_id:i.id,model:d.trim()||null,provider:null,prompt:l.trim()||null,verify_cmd:S.trim()||null});P(f),q(f.prompt),f.model!==null&&h(f.model)}catch(a){w(T(a))}finally{A(null)}},O=async()=>{if(o!==null){A("run"),w(null),C(null);try{let a=await B();if(a.runtimeId===void 0)throw new Error("The session is not live. Open it in Hermes Desktop and try again.");let f=`\u21BA ${t.title??U(t.session_id)}`,D=null;try{let p=await $.request("session.history",{session_id:a.runtimeId});D=Le(p.messages,o.fork_before_ts)}catch{D=null}let k,R,W=!1;if(D!==null){let p=await $.request("session.branch",{session_id:a.runtimeId,through_message_id:D});k=p.session_id,R=p.stored_session_id}else{let p={source:"desktop",title:f};o.worktree_path!==null&&(p.cwd=o.worktree_path),a.storedId!==null&&(p.parent_session_id=a.storedId);let Z=await $.request("session.create",p);k=Z.session_id,R=Z.stored_session_id,W=!0}if(!W&&o.worktree_path!==null)try{await $.request("session.cwd.set",{session_id:k,cwd:o.worktree_path})}catch{await Ae(400);try{await $.request("session.cwd.set",{session_id:k,cwd:o.worktree_path})}catch{C("The branch was created, but the isolated workspace could not be attached. The rerun will use the original workspace.")}}if(d.trim()&&d.trim()!==(t.model??""))try{let p=await $.request("config.set",{key:"model",value:d.trim(),session_id:k,confirm_expensive_model:!1});p.confirm_required===!0&&C(p.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{C("The branch was created, but the model switch failed; the rerun uses the current model.")}let X=l.trim()||o.prompt;await $.request("prompt.submit",{session_id:k,text:X}),await xe(e,o.branch_id,{child_session_id:R,child_stored_session_id:R,model:d.trim()||null,provider:null,prompt:X,verify_cmd:S.trim()||null}),m(o.branch_id),$.openSession(R,{intent:"tab"}),u()}catch(a){w(T(a))}finally{A(null)}}};_.current=()=>{o===null?L():O()};let z=o===null?"not prepared":o.fidelity,K=o===null?"rw-badge rw-badge-idle":o.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return x("div",{className:"rw-overlay",onMouseDown:a=>{a.target===a.currentTarget&&!N&&u()},children:[c("style",{children:ze}),x("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:I,children:[x("header",{className:"rw-header",children:[x("div",{className:"rw-heading",children:[c("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),x("div",{className:"rw-subtitle",children:[G(i.ts)," \xB7 ",i.preview||"user turn"]})]}),c("button",{type:"button",className:"rw-close",onClick:u,disabled:N,"aria-label":"Close",children:"\xD7"})]}),x("div",{className:"rw-body",children:[x("section",{className:"rw-card",children:[x("div",{className:"rw-card-head",children:[c("span",{className:"rw-card-title",children:"Checkpoint"}),c("span",{className:K,children:z==="full"?"workspace ready":z})]}),x("div",{className:"rw-chips",children:[x("span",{className:"rw-chip",children:["history rows ",o===null?"\u2014":o.fork_row_count]}),x("span",{className:"rw-chip",children:["verify timeout ",o===null?"\u2014":`${o.verify_timeout_seconds}s`]}),o?.snapshot_commit?x("span",{className:"rw-chip",children:["snapshot ",o.snapshot_commit.slice(0,8)]}):null]}),o?.worktree_path?c("div",{className:"rw-path",children:o.worktree_path}):c("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),o!==null&&o.fidelity!=="full"?c("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,o!==null&&o.context_rows===null?c("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,o!==null&&o.fork_row_count===0?c("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),x("div",{className:"rw-grid",children:[x("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Model"}),c("input",{className:"rw-input",value:d,onChange:a=>{h(a.target.value)},placeholder:"provider/model"}),c("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),x("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Verify command"}),c("input",{className:"rw-input",value:S,onChange:a=>{v(a.target.value)},placeholder:"python -m pytest -q"}),c("div",{className:"rw-chips",children:qe.map(a=>c("button",{type:"button",className:"rw-preset",onClick:()=>{v(a)},disabled:N,children:a},a))}),c("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),o!==null&&S.trim()!==""?c("span",{className:"rw-resolved",children:o.verify_resolved===null?"Not found on the gateway PATH. Use the full interpreter path.":`Resolves to ${o.verify_resolved}`}):null]})]}),x("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Prompt for the rerun"}),c("textarea",{className:"rw-textarea",value:l,onChange:a=>{q(a.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),c("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]}),y!==null?c("div",{className:"rw-banner rw-banner-warn",role:"status",children:y}):null,E!==null?c("div",{className:"rw-banner rw-banner-error",role:"alert",children:E}):null]}),x("footer",{className:"rw-footer",children:[c("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),x("div",{className:"rw-actions",children:[c("button",{type:"button",className:"rw-button",onClick:u,disabled:N,children:"Cancel"}),o===null?c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{L()},disabled:N,children:M==="prepare"?"Preparing...":"Prepare branch"}):c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{O()},disabled:N,children:M==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{Fragment as Pe,jsx as n,jsxs as s}from"react/jsx-runtime";var Ve=new Set(["done","failed","cleaned","discarded"]);function je(e){return te(Math.max(0,(e.last_ts-e.ts)*1e3))}function Oe({event:e,selected:t,onSelect:i}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:i,children:[n("span",{className:`w-16 shrink-0 uppercase ${Ne(e.kind,e.status)}`,children:ke(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:te(e.duration_ms)})]})}var Ke=new Set(["api_request","llm_call"]);function We({turn:e,expanded:t,events:i,loading:u,selectedEventId:m,onToggle:d,onFork:h,onSelectEvent:l}){let q=(i??[]).filter(v=>!Ke.has(v.kind)),S=(i??[]).length-q.length;return s("div",{className:"border-b border-(--ui-border) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:d,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:G(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),s("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?s("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:je(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:h,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:u?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s(Pe,{children:[q.map(v=>n(Oe,{event:v,selected:m===v.id,onSelect:()=>{l(v)}},v.id)),S>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function ke(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function Ne(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Se(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function j({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function Ye({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${Ne(e.kind,e.status)}`,children:ke(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${te(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function Ge({ctx:e,branchId:t,refreshTick:i,onClose:u,onRefresh:m}){let[d,h]=b(null),[l,q]=b(null),[S,v]=b(!1),[o,P]=b(null);Q(()=>{let y=!1,C=null,N=async()=>{try{let _=await fe(e,t);if(y)return!0;h(_),P(null);let B=_.branch.child_session_id;if(B!==null){let L=await ge(e,_.branch.parent_session_id,B,_.branch.fork_before_ts);y||q(L)}else q(null);return Ve.has(_.branch.state)}catch(_){return y||P(T(_)),!1}},I=async()=>{let _=await N();!y&&!_&&(C=e.setTimeout(()=>{I()},2500))};return I(),()=>{y=!0,C!==null&&C()}},[e,t,i]);let M=async()=>{v(!0),P(null);try{await ve(e,t),m()}catch(y){P(T(y))}finally{v(!1)}},A=async()=>{v(!0),P(null);try{await he(e,t),m()}catch(y){P(T(y))}finally{v(!1)}};if(d===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let E=d.branch,w=d.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",U(E.id)]}),n("span",{className:`uppercase ${Se(E.state)}`,children:E.state}),w!==null&&w.verify_exit!==null?s("span",{className:w.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",w.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{M()},disabled:S||!E.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{A()},disabled:S||E.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:u,children:"Hide"})]})]}),o!==null?n("div",{className:"text-xs text-red-500",children:o}):null,l!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[s("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",l.left?.frozen_at?` \xB7 frozen ${G(l.left.frozen_at)}`:""]}),n(j,{label:"outcome",value:l.left?.outcome??"unknown"}),n(j,{label:"tokens",value:l.left===null?"n/a":J(l.left.tokens_in+l.left.tokens_out)}),n(j,{label:"tool errors",value:l.left===null?"n/a":String(l.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(j,{label:"outcome",value:l.right?.outcome??"running"}),n(j,{label:"verify",value:l.right?.verify_exit===null||l.right?.verify_exit===void 0?"not run":`exit ${l.right.verify_exit}`}),n(j,{label:"tokens",value:l.right===null?"n/a":J(l.right.tokens_in+l.right.tokens_out)}),n(j,{label:"tool errors",value:l.right===null?"n/a":String(l.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",l.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),w!==null&&w.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:w.verify_out}):null,d.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:d.prompt})]}):null]})}function Re({ctx:e}){let t=Ue(He.state.activeSessionId),[i,u]=b([]),[m,d]=b(null),[h,l]=b([]),[q,S]=b(!1),[v,o]=b(!1),[P,M]=b(null),[A,E]=b({}),[w,y]=b([]),[C,N]=b([]),[I,_]=b(null),[B,L]=b(null),[O,z]=b(null),[K,a]=b(null),[f,D]=b(0),[k,R]=b(null),[W,X]=b(0);Q(()=>e.onEvent("*",()=>{X(r=>r+1)}),[e]),Q(()=>{let r=!1,g=async()=>{try{let F=await ue(e);if(r)return;u(F),R(null),d(Y=>Y!==null&&F.some(se=>se.session_id===Y)?Y:t??F[0]?.session_id??null)}catch(F){r||R(T(F))}};g();let H=e.setInterval(()=>{g()},1e4);return()=>{r=!0,H()}},[e,t,f,W]),Q(()=>{if(m===null){l([]),S(!1),y([]),N([]);return}let r=!1,g=async()=>{try{let[F,Y,se]=await Promise.all([oe(e,m),me(e,m),pe(e,m)]);if(r)return;l(Ie=>{let De=new Set(F.items.map(ie=>ie.seq)),Fe=Ie.filter(ie=>!De.has(ie.seq));return[...F.items,...Fe]}),S(F.has_more),y(Y),N(se),R(null)}catch(F){r||R(T(F))}};g();let H=e.setInterval(()=>{g()},1e4);return()=>{r=!0,H()}},[e,m,f,W]),Q(()=>{if(I===null){L(null);return}let r=!1;return ce(e,I).then(g=>{r||L(g)}).catch(g=>{r||R(T(g))}),()=>{r=!0}},[e,I]);let p=i.find(r=>r.session_id===m)??null,Z=p!==null&&p.ended_at===null&&p.session_id===t,Ce=r=>{d(r.session_id),_(null),z(null),M(null),E({})},ne=()=>{D(r=>r+1)},Te=r=>{if(P===r.id){M(null);return}M(r.id),A[r.id]===void 0&&de(e,r.session_id,r.seq,r.seq_to).then(g=>{E(H=>({...H,[r.id]:g}))}).catch(g=>{R(T(g))})},Ee=async()=>{let r=h[h.length-1];if(!(m===null||r===void 0)){o(!0);try{let g=await oe(e,m,r.seq);l(H=>[...H,...g.items]),S(g.has_more)}catch(g){R(T(g))}finally{o(!1)}}};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[p!==null?n("span",{className:"text-(--ui-text-tertiary)",children:p.model??"unknown model"}):null,Z?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"live"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:ne,children:"Refresh"})]})]}),k!==null?n("div",{className:"text-xs text-red-500",children:k}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),i.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):i.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${m===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Ce(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??U(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",J(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id))]}),C.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),C.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${O===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{z(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:U(r.id)}),n("span",{className:`uppercase ${Se(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[p!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:p.title??U(p.session_id)}),w.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[w.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[p.model??"unknown model"," \xB7 ",p.event_count," ","events \xB7"," ",J(p.tokens_in+p.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:p===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):h.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):s(Pe,{children:[h.map(r=>n(We,{turn:r,expanded:P===r.id,events:A[r.id]??null,loading:P===r.id&&A[r.id]===void 0,selectedEventId:I,onToggle:()=>{Te(r)},onFork:()=>{p!==null&&a({session:p,event:r})},onSelectEvent:g=>{_(g.id)}},r.id)),q?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Ee()},disabled:v,children:v?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[h.length," turns \xB7 start of the recording"]})]})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(Ye,{detail:B})})]})]})]}),O!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(Ge,{ctx:e,branchId:O,refreshTick:f,onClose:()=>{z(null)},onRefresh:ne})}):null,K!==null?n(_e,{ctx:e,session:K.session,event:K.event,onClose:()=>{a(null)},onCreated:r=>{z(r),ne()}}):null]})}import{jsx as le,jsxs as st}from"react/jsx-runtime";var re="/rewind";function rt(){let e=Je(ae.state.activeSessionId);return st("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{ae.navigate(re)},title:"Open Session Rewind",children:[le("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}var nt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{ae.navigate(re)};e.registerMany([{id:"page",area:Ze,data:{path:re},render:()=>le(Re,{ctx:e})},{id:"nav",area:et,data:{path:re,label:"Rewind",codicon:"history"}},{id:"palette-open",area:Xe,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:Qe,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:tt.right,order:130,render:()=>le(rt,{})}])}},_t=nt;export{_t as default};
