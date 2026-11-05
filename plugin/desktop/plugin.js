import{host as _e,useValue as je}from"@hermes/plugin-sdk";import{host as De,useValue as Be}from"@hermes/plugin-sdk";import{useEffect as Z,useState as g}from"react";function Q(e,t,a){return e.rest(t,{method:"POST",body:a})}async function oe(e){return(await e.rest("/sessions?limit=100")).items}async function ne(e,t,a=null){let m=a===null?"":`&before_seq=${a}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${m}`)}async function ie(e,t,a,m){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${a-1}&before_seq=${m+1}`)).items}function ae(e,t){return e.rest(`/events/${t}`)}function le(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function ue(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function de(e,t){return e.rest(`/branches/${encodeURIComponent(t)}`)}function ce(e,t,a,m=null){let p=m===null?"":`&before_ts=${m}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(a)}${p}`)}function me(e,t){return Q(e,"/forks/prepare",t)}function pe(e,t,a){return Q(e,`/forks/${encodeURIComponent(t)}/commit`,a)}function fe(e,t){return Q(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function ge(e,t){return Q(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function J(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function W(e){return e.toLocaleString()}function X(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}function R(e){return e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error"}function A(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as D}from"@hermes/plugin-sdk";import{useEffect as Ie,useState as U}from"react";import{jsx as u,jsxs as x}from"react/jsx-runtime";var Te=["python -m pytest -q","npm test","cargo test","go test ./..."];function Ee(e){return new Promise(t=>{window.setTimeout(t,e)})}function Fe(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(a=>{if(typeof a!="object"||a===null||!("text"in a))return"";let m=a.text;return typeof m=="string"?m:""}).join("").trim():""}function qe(e,t){let a=(e??[]).filter(d=>(d.role==="user"||d.role==="assistant")&&Fe(d).length>0&&typeof d.row_id=="number"),m=-1;for(let d=0;d<a.length;d+=1){let v=a[d];if(v===void 0)continue;let l=v.timestamp;v.role==="user"&&typeof l=="number"&&l<=t+.5&&(m=d)}if(m<=0)return null;let p=a[m-1]?.row_id;return typeof p=="number"&&p>0?p:null}var $e=`
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
`;function xe({ctx:e,session:t,event:a,onClose:m,onCreated:p}){let[d,v]=U(t.model??""),[l,F]=U(""),[N,b]=U(""),[o,P]=U(null),[B,q]=U(null),[I,w]=U(null),[_,T]=U(null),S=B!==null;Ie(()=>{let i=y=>{y.key==="Escape"&&!S&&m()};return window.addEventListener("keydown",i),()=>{window.removeEventListener("keydown",i)}},[S,m]);let k=async()=>{let i=await D.request("session.active_list",{}),y=Array.isArray(i.sessions)?i.sessions:[],C=y.find(h=>h.session_key===t.session_id)?.id??y.find(h=>h.id===t.session_id)?.id;if(C===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let h=await D.request("session.title",{session_id:C});return{runtimeId:C,storedId:h.session_key??t.stored_session_id}}catch{return{runtimeId:C,storedId:t.stored_session_id}}},M=async()=>{q("prepare"),w(null),T(null);try{let i=await k(),y=await me(e,{session_id:t.session_id,stored_session_id:i.storedId,event_id:a.id,model:d.trim()||null,provider:null,prompt:l.trim()||null,verify_cmd:N.trim()||null});P(y),F(y.prompt),y.model!==null&&v(y.model)}catch(i){w(R(i))}finally{q(null)}},j=async()=>{if(o!==null){q("run"),w(null),T(null);try{let i=await k();if(i.runtimeId===void 0)throw new Error("The session is not live. Open it in Hermes Desktop and try again.");let y=`\u21BA ${t.title??A(t.session_id)}`,C=null;try{let c=await D.request("session.history",{session_id:i.runtimeId});C=qe(c.messages,o.fork_before_ts)}catch{C=null}let h,z,K=!1;if(C!==null){let c=await D.request("session.branch",{session_id:i.runtimeId,through_message_id:C});h=c.session_id,z=c.stored_session_id}else{let c={source:"desktop",title:y};o.worktree_path!==null&&(c.cwd=o.worktree_path),i.storedId!==null&&(c.parent_session_id=i.storedId);let Y=await D.request("session.create",c);h=Y.session_id,z=Y.stored_session_id,K=!0}if(!K&&o.worktree_path!==null)try{await D.request("session.cwd.set",{session_id:h,cwd:o.worktree_path})}catch{await Ee(400);try{await D.request("session.cwd.set",{session_id:h,cwd:o.worktree_path})}catch{T("The branch was created, but the isolated workspace could not be attached. The rerun will use the original workspace.")}}if(d.trim()&&d.trim()!==(t.model??""))try{let c=await D.request("config.set",{key:"model",value:d.trim(),session_id:h,confirm_expensive_model:!1});c.confirm_required===!0&&T(c.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{T("The branch was created, but the model switch failed; the rerun uses the current model.")}let $=l.trim()||o.prompt;await D.request("prompt.submit",{session_id:h,text:$}),await pe(e,o.branch_id,{child_session_id:z,child_stored_session_id:z,model:d.trim()||null,provider:null,prompt:$,verify_cmd:N.trim()||null}),p(o.branch_id),D.openSession(z,{intent:"tab"}),m()}catch(i){w(R(i))}finally{q(null)}}},V=o===null?"not prepared":o.fidelity,O=o===null?"rw-badge rw-badge-idle":o.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return x("div",{className:"rw-overlay",onMouseDown:i=>{i.target===i.currentTarget&&!S&&m()},children:[u("style",{children:$e}),x("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",children:[x("header",{className:"rw-header",children:[x("div",{className:"rw-heading",children:[u("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),x("div",{className:"rw-subtitle",children:[J(a.ts)," \xB7 ",a.preview||"user turn"]})]}),u("button",{type:"button",className:"rw-close",onClick:m,disabled:S,"aria-label":"Close",children:"\xD7"})]}),x("div",{className:"rw-body",children:[x("section",{className:"rw-card",children:[x("div",{className:"rw-card-head",children:[u("span",{className:"rw-card-title",children:"Checkpoint"}),u("span",{className:O,children:V==="full"?"workspace ready":V})]}),x("div",{className:"rw-chips",children:[x("span",{className:"rw-chip",children:["history rows ",o===null?"\u2014":o.fork_row_count]}),x("span",{className:"rw-chip",children:["verify timeout ",o===null?"\u2014":`${o.verify_timeout_seconds}s`]}),o?.snapshot_commit?x("span",{className:"rw-chip",children:["snapshot ",o.snapshot_commit.slice(0,8)]}):null]}),o?.worktree_path?u("div",{className:"rw-path",children:o.worktree_path}):u("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),o!==null&&o.fidelity!=="full"?u("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,o!==null&&o.context_rows===null?u("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,o!==null&&o.fork_row_count===0?u("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),x("div",{className:"rw-grid",children:[x("label",{className:"rw-field",children:[u("span",{className:"rw-label",children:"Model"}),u("input",{className:"rw-input",value:d,onChange:i=>{v(i.target.value)},placeholder:"provider/model"}),u("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),x("label",{className:"rw-field",children:[u("span",{className:"rw-label",children:"Verify command"}),u("input",{className:"rw-input",value:N,onChange:i=>{b(i.target.value)},placeholder:"python -m pytest -q"}),u("div",{className:"rw-chips",children:Te.map(i=>u("button",{type:"button",className:"rw-preset",onClick:()=>{b(i)},disabled:S,children:i},i))}),u("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),o!==null&&N.trim()!==""?u("span",{className:"rw-resolved",children:o.verify_resolved===null?"Not found on the gateway PATH. Use the full interpreter path.":`Resolves to ${o.verify_resolved}`}):null]})]}),x("label",{className:"rw-field",children:[u("span",{className:"rw-label",children:"Prompt for the rerun"}),u("textarea",{className:"rw-textarea",value:l,onChange:i=>{F(i.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),u("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]}),_!==null?u("div",{className:"rw-banner rw-banner-warn",role:"status",children:_}):null,I!==null?u("div",{className:"rw-banner rw-banner-error",role:"alert",children:I}):null]}),x("footer",{className:"rw-footer",children:[u("span",{className:"rw-hint",children:"The original session and workspace stay untouched."}),x("div",{className:"rw-actions",children:[u("button",{type:"button",className:"rw-button",onClick:m,disabled:S,children:"Cancel"}),o===null?u("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{M()},disabled:S,children:B==="prepare"?"Preparing...":"Prepare branch"}):u("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{j()},disabled:S,children:B==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{Fragment as ye,jsx as n,jsxs as s}from"react/jsx-runtime";function Me(e){return X(Math.max(0,(e.last_ts-e.ts)*1e3))}function ze({event:e,selected:t,onSelect:a}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:a,children:[n("span",{className:`w-16 shrink-0 uppercase ${ve(e.kind,e.status)}`,children:be(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:X(e.duration_ms)})]})}var Le=new Set(["api_request","llm_call"]);function Ae({turn:e,expanded:t,events:a,loading:m,selectedEventId:p,onToggle:d,onFork:v,onSelectEvent:l}){let F=(a??[]).filter(b=>!Le.has(b.kind)),N=(a??[]).length-F.length;return s("div",{className:"border-b border-(--ui-border) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:d,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:J(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),s("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?s("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:Me(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:v,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:m?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s(ye,{children:[F.map(b=>n(ze,{event:b,selected:p===b.id,onSelect:()=>{l(b)}},b.id)),N>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function be(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function ve(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function he(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function H({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function Ue({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${ve(e.kind,e.status)}`,children:be(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${X(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function He({ctx:e,branchId:t,refreshTick:a,onClose:m,onRefresh:p}){let[d,v]=g(null),[l,F]=g(null),[N,b]=g(!1),[o,P]=g(null);Z(()=>{let _=!1,T=async()=>{try{let k=await de(e,t);if(_)return;v(k),P(null);let M=k.branch.child_session_id;if(M!==null){let j=await ce(e,k.branch.parent_session_id,M,k.branch.fork_before_ts);_||F(j)}else F(null)}catch(k){_||P(R(k))}};T();let S=window.setInterval(()=>{T()},2500);return()=>{_=!0,window.clearInterval(S)}},[e,t,a]);let B=async()=>{b(!0),P(null);try{await fe(e,t),p()}catch(_){P(R(_))}finally{b(!1)}},q=async()=>{b(!0),P(null);try{await ge(e,t),p()}catch(_){P(R(_))}finally{b(!1)}};if(d===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let I=d.branch,w=d.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",A(I.id)]}),n("span",{className:`uppercase ${he(I.state)}`,children:I.state}),w!==null&&w.verify_exit!==null?s("span",{className:w.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",w.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{B()},disabled:N||!I.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{q()},disabled:N||I.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:m,children:"Hide"})]})]}),o!==null?n("div",{className:"text-xs text-red-500",children:o}):null,l!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[s("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",l.left?.frozen_at?` \xB7 frozen ${J(l.left.frozen_at)}`:""]}),n(H,{label:"outcome",value:l.left?.outcome??"unknown"}),n(H,{label:"tokens",value:l.left===null?"n/a":W(l.left.tokens_in+l.left.tokens_out)}),n(H,{label:"tool errors",value:l.left===null?"n/a":String(l.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(H,{label:"outcome",value:l.right?.outcome??"running"}),n(H,{label:"verify",value:l.right?.verify_exit===null||l.right?.verify_exit===void 0?"not run":`exit ${l.right.verify_exit}`}),n(H,{label:"tokens",value:l.right===null?"n/a":W(l.right.tokens_in+l.right.tokens_out)}),n(H,{label:"tool errors",value:l.right===null?"n/a":String(l.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",l.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),w!==null&&w.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:w.verify_out}):null,d.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:d.prompt})]}):null]})}function we({ctx:e}){let t=Be(De.state.activeSessionId),[a,m]=g([]),[p,d]=g(null),[v,l]=g([]),[F,N]=g(!1),[b,o]=g(!1),[P,B]=g(null),[q,I]=g({}),[w,_]=g([]),[T,S]=g([]),[k,M]=g(null),[j,V]=g(null),[O,i]=g(null),[y,C]=g(null),[h,z]=g(0),[K,$]=g(null);Z(()=>{let r=!1,f=async()=>{try{let E=await oe(e);if(r)return;m(E),$(null),d(G=>G!==null&&E.some(te=>te.session_id===G)?G:t??E[0]?.session_id??null)}catch(E){r||$(R(E))}};f();let L=window.setInterval(()=>{f()},4e3);return()=>{r=!0,window.clearInterval(L)}},[e,t,h]),Z(()=>{if(p===null){l([]),N(!1),_([]),S([]);return}let r=!1,f=async()=>{try{let[E,G,te]=await Promise.all([ne(e,p),le(e,p),ue(e,p)]);if(r)return;l(Pe=>{let Ce=new Set(E.items.map(re=>re.seq)),Re=Pe.filter(re=>!Ce.has(re.seq));return[...E.items,...Re]}),N(E.has_more),_(G),S(te),$(null)}catch(E){r||$(R(E))}};f();let L=window.setInterval(()=>{f()},2500);return()=>{r=!0,window.clearInterval(L)}},[e,p,h]),Z(()=>{if(k===null){V(null);return}let r=!1;return ae(e,k).then(f=>{r||V(f)}).catch(f=>{r||$(R(f))}),()=>{r=!0}},[e,k]);let c=a.find(r=>r.session_id===p)??null,Y=c!==null&&c.ended_at===null&&c.session_id===t,ke=r=>{d(r.session_id),M(null),i(null),B(null),I({})},ee=()=>{z(r=>r+1)},Ne=r=>{if(P===r.id){B(null);return}B(r.id),q[r.id]===void 0&&ie(e,r.session_id,r.seq,r.seq_to).then(f=>{I(L=>({...L,[r.id]:f}))}).catch(f=>{$(R(f))})},Se=async()=>{let r=v[v.length-1];if(!(p===null||r===void 0)){o(!0);try{let f=await ne(e,p,r.seq);l(L=>[...L,...f.items]),N(f.has_more)}catch(f){$(R(f))}finally{o(!1)}}};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[c!==null?n("span",{className:"text-(--ui-text-tertiary)",children:c.model??"unknown model"}):null,Y?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"live"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:ee,children:"Refresh"})]})]}),K!==null?n("div",{className:"text-xs text-red-500",children:K}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),a.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):a.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${p===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{ke(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??A(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",W(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id))]}),T.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),T.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${O===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{i(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:A(r.id)}),n("span",{className:`uppercase ${he(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[c!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:c.title??A(c.session_id)}),w.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[w.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[c.model??"unknown model"," \xB7 ",c.event_count," ","events \xB7"," ",W(c.tokens_in+c.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:c===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):v.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):s(ye,{children:[v.map(r=>n(Ae,{turn:r,expanded:P===r.id,events:q[r.id]??null,loading:P===r.id&&q[r.id]===void 0,selectedEventId:k,onToggle:()=>{Ne(r)},onFork:()=>{c!==null&&C({session:c,event:r})},onSelectEvent:f=>{M(f.id)}},r.id)),F?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Se()},disabled:b,children:b?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[v.length," turns \xB7 start of the recording"]})]})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(Ue,{detail:j})})]})]})]}),O!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(He,{ctx:e,branchId:O,refreshTick:h,onClose:()=>{i(null)},onRefresh:ee})}):null,y!==null?n(xe,{ctx:e,session:y.session,event:y.event,onClose:()=>{C(null)},onCreated:r=>{i(r),ee()}}):null]})}import{jsx as se,jsxs as Ke}from"react/jsx-runtime";function Ve(){let e=je(_e.state.activeSessionId);return Ke("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{_e.navigate("/rewind")},title:"Open Session Rewind",children:[se("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}var Oe={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){e.register({id:"page",area:"routes",data:{path:"/rewind"},render:()=>se(we,{ctx:e})}),e.register({id:"nav",area:"sidebarNav",data:{path:"/rewind",label:"Rewind",codicon:"history"}}),e.register({id:"chip",area:"statusBar.right",order:130,render:()=>se(Ve,{})})}},dt=Oe;export{dt as default};
