import{host as _e,useValue as je}from"@hermes/plugin-sdk";import{host as De,useValue as $e}from"@hermes/plugin-sdk";import{useEffect as Z,useState as g}from"react";function Q(e,t,o){return e.rest(t,{method:"POST",body:o})}async function ie(e){return(await e.rest("/sessions?limit=100")).items}async function ne(e,t,o=null){let m=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${m}`)}async function oe(e,t,o,m){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${m+1}`)).items}function ae(e,t){return e.rest(`/events/${t}`)}function le(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function ue(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function de(e,t){return e.rest(`/branches/${encodeURIComponent(t)}`)}function ce(e,t,o){return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}`)}function me(e,t){return Q(e,"/forks/prepare",t)}function pe(e,t,o){return Q(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function fe(e,t){return Q(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function ge(e,t){return Q(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function X(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function J(e){return e.toLocaleString()}function Y(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}function R(e){return e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error"}function U(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as $}from"@hermes/plugin-sdk";import{useEffect as Ie,useState as A}from"react";import{jsx as c,jsxs as x}from"react/jsx-runtime";function Te(e){return new Promise(t=>{window.setTimeout(t,e)})}function Ee(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let m=o.text;return typeof m=="string"?m:""}).join("").trim():""}function qe(e,t){let o=(e??[]).filter(l=>(l.role==="user"||l.role==="assistant")&&Ee(l).length>0&&typeof l.row_id=="number"),m=-1;for(let l=0;l<o.length;l+=1){let b=o[l];if(b===void 0)continue;let u=b.timestamp;b.role==="user"&&typeof u=="number"&&u<=t+.5&&(m=l)}if(m<=0)return null;let p=o[m-1]?.row_id;return typeof p=="number"&&p>0?p:null}var Fe=`
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
`;function xe({ctx:e,session:t,event:o,onClose:m,onCreated:p}){let[l,b]=A(t.model??""),[u,q]=A(""),[N,v]=A(""),[i,S]=A(null),[B,F]=A(null),[I,w]=A(null),[_,T]=A(null),P=B!==null;Ie(()=>{let a=y=>{y.key==="Escape"&&!P&&m()};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[P,m]);let k=async()=>{let a=await $.request("session.active_list",{}),y=Array.isArray(a.sessions)?a.sessions:[],C=y.find(h=>h.session_key===t.session_id)?.id??y.find(h=>h.id===t.session_id)?.id;if(C===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let h=await $.request("session.title",{session_id:C});return{runtimeId:C,storedId:h.session_key??t.stored_session_id}}catch{return{runtimeId:C,storedId:t.stored_session_id}}},M=async()=>{F("prepare"),w(null),T(null);try{let a=await k(),y=await me(e,{session_id:t.session_id,stored_session_id:a.storedId,event_id:o.id,model:l.trim()||null,provider:null,prompt:u.trim()||null,verify_cmd:N.trim()||null});S(y),q(y.prompt),y.model!==null&&b(y.model)}catch(a){w(R(a))}finally{F(null)}},H=async()=>{if(i!==null){F("run"),w(null),T(null);try{let a=await k();if(a.runtimeId===void 0)throw new Error("The session is not live. Open it in Hermes Desktop and try again.");let y=`\u21BA ${t.title??U(t.session_id)}`,C=null;try{let d=await $.request("session.history",{session_id:a.runtimeId});C=qe(d.messages,i.fork_before_ts)}catch{C=null}let h,L,K=!1;if(C!==null){let d=await $.request("session.branch",{session_id:a.runtimeId,through_message_id:C});h=d.session_id,L=d.stored_session_id}else{let d={source:"desktop",title:y};i.worktree_path!==null&&(d.cwd=i.worktree_path),a.storedId!==null&&(d.parent_session_id=a.storedId);let W=await $.request("session.create",d);h=W.session_id,L=W.stored_session_id,K=!0}if(!K&&i.worktree_path!==null)try{await $.request("session.cwd.set",{session_id:h,cwd:i.worktree_path})}catch{await Te(400);try{await $.request("session.cwd.set",{session_id:h,cwd:i.worktree_path})}catch{T("The branch was created, but the isolated workspace could not be attached. The rerun will use the original workspace.")}}if(l.trim()&&l.trim()!==(t.model??""))try{let d=await $.request("config.set",{key:"model",value:l.trim(),session_id:h,confirm_expensive_model:!1});d.confirm_required===!0&&T(d.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{T("The branch was created, but the model switch failed; the rerun uses the current model.")}let D=u.trim()||i.prompt;await $.request("prompt.submit",{session_id:h,text:D}),await pe(e,i.branch_id,{child_session_id:L,child_stored_session_id:L,model:l.trim()||null,provider:null,prompt:D,verify_cmd:N.trim()||null}),p(i.branch_id),$.openSession(L,{intent:"tab"}),m()}catch(a){w(R(a))}finally{F(null)}}},V=i===null?"not prepared":i.fidelity,O=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return x("div",{className:"rw-overlay",onMouseDown:a=>{a.target===a.currentTarget&&!P&&m()},children:[c("style",{children:Fe}),x("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",children:[x("header",{className:"rw-header",children:[x("div",{className:"rw-heading",children:[c("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),x("div",{className:"rw-subtitle",children:[X(o.ts)," \xB7 ",o.preview||"user turn"]})]}),c("button",{type:"button",className:"rw-close",onClick:m,disabled:P,"aria-label":"Close",children:"\xD7"})]}),x("div",{className:"rw-body",children:[x("section",{className:"rw-card",children:[x("div",{className:"rw-card-head",children:[c("span",{className:"rw-card-title",children:"Checkpoint"}),c("span",{className:O,children:V==="full"?"workspace ready":V})]}),x("div",{className:"rw-chips",children:[x("span",{className:"rw-chip",children:["history rows ",i===null?"\u2014":i.fork_row_count]}),x("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?x("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?c("div",{className:"rw-path",children:i.worktree_path}):c("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?c("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?c("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&i.fork_row_count===0?c("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),x("div",{className:"rw-grid",children:[x("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Model"}),c("input",{className:"rw-input",value:l,onChange:a=>{b(a.target.value)},placeholder:"provider/model"}),c("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),x("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Verify command"}),c("input",{className:"rw-input",value:N,onChange:a=>{v(a.target.value)},placeholder:"python -m pytest -q"}),c("span",{className:"rw-help",children:"Runs in the restored workspace. Use the full interpreter path when needed."})]})]}),x("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Prompt for the rerun"}),c("textarea",{className:"rw-textarea",value:u,onChange:a=>{q(a.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),c("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]}),_!==null?c("div",{className:"rw-banner rw-banner-warn",role:"status",children:_}):null,I!==null?c("div",{className:"rw-banner rw-banner-error",role:"alert",children:I}):null]}),x("footer",{className:"rw-footer",children:[c("span",{className:"rw-hint",children:"The original session and workspace stay untouched."}),x("div",{className:"rw-actions",children:[c("button",{type:"button",className:"rw-button",onClick:m,disabled:P,children:"Cancel"}),i===null?c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{M()},disabled:P,children:B==="prepare"?"Preparing...":"Prepare branch"}):c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{H()},disabled:P,children:B==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{Fragment as ye,jsx as n,jsxs as s}from"react/jsx-runtime";function Be(e){return Y(Math.max(0,(e.last_ts-e.ts)*1e3))}function Me({event:e,selected:t,onSelect:o}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[n("span",{className:`w-16 shrink-0 uppercase ${ve(e.kind,e.status)}`,children:be(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:Y(e.duration_ms)})]})}var Le=new Set(["api_request","llm_call"]);function ze({turn:e,expanded:t,events:o,loading:m,selectedEventId:p,onToggle:l,onFork:b,onSelectEvent:u}){let q=(o??[]).filter(v=>!Le.has(v.kind)),N=(o??[]).length-q.length;return s("div",{className:"border-b border-(--ui-border) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:l,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:X(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),s("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?s("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:Be(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:b,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:m?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s(ye,{children:[q.map(v=>n(Me,{event:v,selected:p===v.id,onSelect:()=>{u(v)}},v.id)),N>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function be(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function ve(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function he(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function j({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function Ue({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${ve(e.kind,e.status)}`,children:be(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${Y(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function Ae({ctx:e,branchId:t,refreshTick:o,onClose:m,onRefresh:p}){let[l,b]=g(null),[u,q]=g(null),[N,v]=g(!1),[i,S]=g(null);Z(()=>{let _=!1,T=async()=>{try{let k=await de(e,t);if(_)return;b(k),S(null);let M=k.branch.child_session_id;if(M!==null){let H=await ce(e,k.branch.parent_session_id,M);_||q(H)}else q(null)}catch(k){_||S(R(k))}};T();let P=window.setInterval(()=>{T()},2500);return()=>{_=!0,window.clearInterval(P)}},[e,t,o]);let B=async()=>{v(!0),S(null);try{await fe(e,t),p()}catch(_){S(R(_))}finally{v(!1)}},F=async()=>{v(!0),S(null);try{await ge(e,t),p()}catch(_){S(R(_))}finally{v(!1)}};if(l===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let I=l.branch,w=l.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",U(I.id)]}),n("span",{className:`uppercase ${he(I.state)}`,children:I.state}),w!==null&&w.verify_exit!==null?s("span",{className:w.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",w.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{B()},disabled:N||!I.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{F()},disabled:N||I.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:m,children:"Hide"})]})]}),i!==null?n("div",{className:"text-xs text-red-500",children:i}):null,u!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Original"}),n(j,{label:"outcome",value:u.left?.outcome??"unknown"}),n(j,{label:"tokens",value:u.left===null?"n/a":J(u.left.tokens_in+u.left.tokens_out)}),n(j,{label:"tool errors",value:u.left===null?"n/a":String(u.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(j,{label:"outcome",value:u.right?.outcome??"running"}),n(j,{label:"tokens",value:u.right===null?"n/a":J(u.right.tokens_in+u.right.tokens_out)}),n(j,{label:"tool errors",value:u.right===null?"n/a":String(u.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",u.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),w!==null&&w.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:w.verify_out}):null,l.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:l.prompt})]}):null]})}function we({ctx:e}){let t=$e(De.state.activeSessionId),[o,m]=g([]),[p,l]=g(null),[b,u]=g([]),[q,N]=g(!1),[v,i]=g(!1),[S,B]=g(null),[F,I]=g({}),[w,_]=g([]),[T,P]=g([]),[k,M]=g(null),[H,V]=g(null),[O,a]=g(null),[y,C]=g(null),[h,L]=g(0),[K,D]=g(null);Z(()=>{let r=!1,f=async()=>{try{let E=await ie(e);if(r)return;m(E),D(null),l(G=>G!==null&&E.some(te=>te.session_id===G)?G:t??E[0]?.session_id??null)}catch(E){r||D(R(E))}};f();let z=window.setInterval(()=>{f()},4e3);return()=>{r=!0,window.clearInterval(z)}},[e,t,h]),Z(()=>{if(p===null){u([]),N(!1),_([]),P([]);return}let r=!1,f=async()=>{try{let[E,G,te]=await Promise.all([ne(e,p),le(e,p),ue(e,p)]);if(r)return;u(Pe=>{let Ce=new Set(E.items.map(re=>re.seq)),Re=Pe.filter(re=>!Ce.has(re.seq));return[...E.items,...Re]}),N(E.has_more),_(G),P(te),D(null)}catch(E){r||D(R(E))}};f();let z=window.setInterval(()=>{f()},2500);return()=>{r=!0,window.clearInterval(z)}},[e,p,h]),Z(()=>{if(k===null){V(null);return}let r=!1;return ae(e,k).then(f=>{r||V(f)}).catch(f=>{r||D(R(f))}),()=>{r=!0}},[e,k]);let d=o.find(r=>r.session_id===p)??null,W=d!==null&&d.ended_at===null&&d.session_id===t,ke=r=>{l(r.session_id),M(null),a(null),B(null),I({})},ee=()=>{L(r=>r+1)},Ne=r=>{if(S===r.id){B(null);return}B(r.id),F[r.id]===void 0&&oe(e,r.session_id,r.seq,r.seq_to).then(f=>{I(z=>({...z,[r.id]:f}))}).catch(f=>{D(R(f))})},Se=async()=>{let r=b[b.length-1];if(!(p===null||r===void 0)){i(!0);try{let f=await ne(e,p,r.seq);u(z=>[...z,...f.items]),N(f.has_more)}catch(f){D(R(f))}finally{i(!1)}}};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[d!==null?n("span",{className:"text-(--ui-text-tertiary)",children:d.model??"unknown model"}):null,W?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"live"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:ee,children:"Refresh"})]})]}),K!==null?n("div",{className:"text-xs text-red-500",children:K}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),o.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):o.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${p===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{ke(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??U(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",J(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id))]}),T.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),T.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${O===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{a(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:U(r.id)}),n("span",{className:`uppercase ${he(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[d!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:d.title??U(d.session_id)}),w.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[w.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[d.model??"unknown model"," \xB7 ",d.event_count," ","events \xB7"," ",J(d.tokens_in+d.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:d===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):b.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):s(ye,{children:[b.map(r=>n(ze,{turn:r,expanded:S===r.id,events:F[r.id]??null,loading:S===r.id&&F[r.id]===void 0,selectedEventId:k,onToggle:()=>{Ne(r)},onFork:()=>{d!==null&&C({session:d,event:r})},onSelectEvent:f=>{M(f.id)}},r.id)),q?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Se()},disabled:v,children:v?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[b.length," turns \xB7 start of the recording"]})]})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(Ue,{detail:H})})]})]})]}),O!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(Ae,{ctx:e,branchId:O,refreshTick:h,onClose:()=>{a(null)},onRefresh:ee})}):null,y!==null?n(xe,{ctx:e,session:y.session,event:y.event,onClose:()=>{C(null)},onCreated:r=>{a(r),ee()}}):null]})}import{jsx as se,jsxs as Oe}from"react/jsx-runtime";function He(){let e=je(_e.state.activeSessionId);return Oe("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{_e.navigate("/rewind")},title:"Open Session Rewind",children:[se("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}var Ve={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){e.register({id:"page",area:"routes",data:{path:"/rewind"},render:()=>se(we,{ctx:e})}),e.register({id:"nav",area:"sidebarNav",data:{path:"/rewind",label:"Rewind",codicon:"history"}}),e.register({id:"chip",area:"statusBar.right",order:130,render:()=>se(He,{})})}},ut=Ve;export{ut as default};
