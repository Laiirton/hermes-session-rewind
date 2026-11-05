import{host as me,useValue as ke}from"@hermes/plugin-sdk";import{host as ve,useValue as he}from"@hermes/plugin-sdk";import{useEffect as G,useState as h}from"react";function O(e,t,a){return e.rest(t,{method:"POST",body:a})}async function Q(e){return(await e.rest("/sessions?limit=100")).items}async function X(e,t){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=500`)).items}function Y(e,t){return e.rest(`/events/${t}`)}function Z(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function ee(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function te(e,t){return e.rest(`/branches/${encodeURIComponent(t)}`)}function re(e,t,a){return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(a)}`)}function ne(e,t){return O(e,"/forks/prepare",t)}function se(e,t,a){return O(e,`/forks/${encodeURIComponent(t)}/commit`,a)}function ie(e,t){return O(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function oe(e,t){return O(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function K(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function H(e){return e.toLocaleString()}function J(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}function I(e){return e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error"}function M(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as E}from"@hermes/plugin-sdk";import{useEffect as pe,useState as z}from"react";import{jsx as u,jsxs as m}from"react/jsx-runtime";function fe(e){return new Promise(t=>{window.setTimeout(t,e)})}function ge(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(a=>{if(typeof a!="object"||a===null||!("text"in a))return"";let c=a.text;return typeof c=="string"?c:""}).join("").trim():""}function xe(e,t){let a=(e??[]).filter(l=>(l.role==="user"||l.role==="assistant")&&ge(l).length>0&&typeof l.row_id=="number"),c=-1;for(let l=0;l<a.length;l+=1){let k=a[l];if(k===void 0)continue;let d=k.timestamp;k.role==="user"&&typeof d=="number"&&d<=t+.5&&(c=l)}if(c<=0)return null;let f=a[c-1]?.row_id;return typeof f=="number"&&f>0?f:null}var be=`
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
`;function ae({ctx:e,session:t,event:a,onClose:c,onCreated:f}){let[l,k]=z(t.model??""),[d,B]=z(""),[T,F]=z(""),[i,w]=z(null),[D,$]=z(null),[R,g]=z(null),[x,N]=z(null),S=D!==null;pe(()=>{let o=y=>{y.key==="Escape"&&!S&&c()};return window.addEventListener("keydown",o),()=>{window.removeEventListener("keydown",o)}},[S,c]);let P=async()=>{let o=await E.request("session.active_list",{}),y=Array.isArray(o.sessions)?o.sessions:[],_=y.find(r=>r.session_key===t.session_id)?.id??y.find(r=>r.id===t.session_id)?.id;if(_===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let r=await E.request("session.title",{session_id:_});return{runtimeId:_,storedId:r.session_key??t.stored_session_id}}catch{return{runtimeId:_,storedId:t.stored_session_id}}},A=async()=>{$("prepare"),g(null),N(null);try{let o=await P(),y=await ne(e,{session_id:t.session_id,stored_session_id:o.storedId,event_id:a.id,model:l.trim()||null,provider:null,prompt:d.trim()||null,verify_cmd:T.trim()||null});w(y),B(y.prompt),y.model!==null&&k(y.model)}catch(o){g(I(o))}finally{$(null)}},L=async()=>{if(i!==null){$("run"),g(null),N(null);try{let o=await P();if(o.runtimeId===void 0)throw new Error("The session is not live. Open it in Hermes Desktop and try again.");let y=`\u21BA ${t.title??M(t.session_id)}`,_=null;try{let p=await E.request("session.history",{session_id:o.runtimeId});_=xe(p.messages,i.fork_before_ts)}catch{_=null}let r,v,U=!1;if(_!==null){let p=await E.request("session.branch",{session_id:o.runtimeId,through_message_id:_});r=p.session_id,v=p.stored_session_id}else{let p={source:"desktop",title:y};i.worktree_path!==null&&(p.cwd=i.worktree_path),o.storedId!==null&&(p.parent_session_id=o.storedId);let j=await E.request("session.create",p);r=j.session_id,v=j.stored_session_id,U=!0}if(!U&&i.worktree_path!==null)try{await E.request("session.cwd.set",{session_id:r,cwd:i.worktree_path})}catch{await fe(400);try{await E.request("session.cwd.set",{session_id:r,cwd:i.worktree_path})}catch{N("The branch was created, but the isolated workspace could not be attached. The rerun will use the original workspace.")}}if(l.trim()&&l.trim()!==(t.model??""))try{let p=await E.request("config.set",{key:"model",value:l.trim(),session_id:r,confirm_expensive_model:!1});p.confirm_required===!0&&N(p.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{N("The branch was created, but the model switch failed; the rerun uses the current model.")}let C=d.trim()||i.prompt;await E.request("prompt.submit",{session_id:r,text:C}),await se(e,i.branch_id,{child_session_id:v,child_stored_session_id:v,model:l.trim()||null,provider:null,prompt:C,verify_cmd:T.trim()||null}),f(i.branch_id),E.openSession(v,{intent:"tab"}),c()}catch(o){g(I(o))}finally{$(null)}}},q=i===null?"not prepared":i.fidelity,b=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return m("div",{className:"rw-overlay",onMouseDown:o=>{o.target===o.currentTarget&&!S&&c()},children:[u("style",{children:be}),m("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",children:[m("header",{className:"rw-header",children:[m("div",{className:"rw-heading",children:[u("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),m("div",{className:"rw-subtitle",children:[K(a.ts)," \xB7 ",a.preview||"user turn"]})]}),u("button",{type:"button",className:"rw-close",onClick:c,disabled:S,"aria-label":"Close",children:"\xD7"})]}),m("div",{className:"rw-body",children:[m("section",{className:"rw-card",children:[m("div",{className:"rw-card-head",children:[u("span",{className:"rw-card-title",children:"Checkpoint"}),u("span",{className:b,children:q==="full"?"workspace ready":q})]}),m("div",{className:"rw-chips",children:[m("span",{className:"rw-chip",children:["history rows ",i===null?"\u2014":i.fork_row_count]}),m("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?m("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?u("div",{className:"rw-path",children:i.worktree_path}):u("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?u("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?u("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&i.fork_row_count===0?u("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),m("div",{className:"rw-grid",children:[m("label",{className:"rw-field",children:[u("span",{className:"rw-label",children:"Model"}),u("input",{className:"rw-input",value:l,onChange:o=>{k(o.target.value)},placeholder:"provider/model"}),u("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),m("label",{className:"rw-field",children:[u("span",{className:"rw-label",children:"Verify command"}),u("input",{className:"rw-input",value:T,onChange:o=>{F(o.target.value)},placeholder:"python -m pytest -q"}),u("span",{className:"rw-help",children:"Runs in the restored workspace. Use the full interpreter path when needed."})]})]}),m("label",{className:"rw-field",children:[u("span",{className:"rw-label",children:"Prompt for the rerun"}),u("textarea",{className:"rw-textarea",value:d,onChange:o=>{B(o.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),u("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]}),x!==null?u("div",{className:"rw-banner rw-banner-warn",role:"status",children:x}):null,R!==null?u("div",{className:"rw-banner rw-banner-error",role:"alert",children:R}):null]}),m("footer",{className:"rw-footer",children:[u("span",{className:"rw-hint",children:"The original session and workspace stay untouched."}),m("div",{className:"rw-actions",children:[u("button",{type:"button",className:"rw-button",onClick:c,disabled:S,children:"Cancel"}),i===null?u("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{A()},disabled:S,children:D==="prepare"?"Preparing...":"Prepare branch"}):u("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{L()},disabled:S,children:D==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{jsx as n,jsxs as s}from"react/jsx-runtime";function le(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function ue(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function de(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function V({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function we({event:e,selected:t,onSelect:a,onFork:c}){return s("div",{className:`flex items-start gap-2 border-b border-(--ui-border) px-2 py-1.5 ${t?"bg-white/5":""}`,children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-start gap-2 text-left",onClick:a,children:[n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:K(e.ts)}),n("span",{className:`w-20 shrink-0 text-xs uppercase ${ue(e.kind,e.status)}`,children:le(e.kind)}),s("span",{className:"min-w-0 flex-1",children:[n("span",{className:"block truncate",children:e.name??(e.preview||e.kind)}),e.name!==null&&e.preview?n("span",{className:"block truncate text-xs text-(--ui-text-tertiary)",children:e.preview}):null]}),n("span",{className:"w-16 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:J(e.duration_ms)})]}),e.kind==="user_turn"?n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:c,children:"Rewind"}):null]})}function ye({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${ue(e.kind,e.status)}`,children:le(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${J(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function _e({ctx:e,branchId:t,refreshTick:a,onClose:c,onRefresh:f}){let[l,k]=h(null),[d,B]=h(null),[T,F]=h(!1),[i,w]=h(null);G(()=>{let x=!1,N=async()=>{try{let P=await te(e,t);if(x)return;k(P),w(null);let A=P.branch.child_session_id;if(A!==null){let L=await re(e,P.branch.parent_session_id,A);x||B(L)}else B(null)}catch(P){x||w(I(P))}};N();let S=window.setInterval(()=>{N()},2500);return()=>{x=!0,window.clearInterval(S)}},[e,t,a]);let D=async()=>{F(!0),w(null);try{await ie(e,t),f()}catch(x){w(I(x))}finally{F(!1)}},$=async()=>{F(!0),w(null);try{await oe(e,t),f()}catch(x){w(I(x))}finally{F(!1)}};if(l===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let R=l.branch,g=l.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",M(R.id)]}),n("span",{className:`uppercase ${de(R.state)}`,children:R.state}),g!==null&&g.verify_exit!==null?s("span",{className:g.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",g.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{D()},disabled:T||!R.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{$()},disabled:T||R.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:c,children:"Hide"})]})]}),i!==null?n("div",{className:"text-xs text-red-500",children:i}):null,d!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Original"}),n(V,{label:"outcome",value:d.left?.outcome??"unknown"}),n(V,{label:"tokens",value:d.left===null?"n/a":H(d.left.tokens_in+d.left.tokens_out)}),n(V,{label:"tool errors",value:d.left===null?"n/a":String(d.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(V,{label:"outcome",value:d.right?.outcome??"running"}),n(V,{label:"tokens",value:d.right===null?"n/a":H(d.right.tokens_in+d.right.tokens_out)}),n(V,{label:"tool errors",value:d.right===null?"n/a":String(d.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",d.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),g!==null&&g.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:g.verify_out}):null,l.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:l.prompt})]}):null]})}function ce({ctx:e}){let t=he(ve.state.activeSessionId),[a,c]=h([]),[f,l]=h(null),[k,d]=h([]),[B,T]=h([]),[F,i]=h([]),[w,D]=h(null),[$,R]=h(null),[g,x]=h(null),[N,S]=h(null),[P,A]=h(0),[L,q]=h(null);G(()=>{let r=!1,v=async()=>{try{let C=await Q(e);if(r)return;c(C),q(null),l(p=>p!==null&&C.some(j=>j.session_id===p)?p:t??C[0]?.session_id??null)}catch(C){r||q(I(C))}};v();let U=window.setInterval(()=>{v()},4e3);return()=>{r=!0,window.clearInterval(U)}},[e,t,P]),G(()=>{if(f===null){d([]),T([]),i([]);return}let r=!1,v=async()=>{try{let[C,p,j]=await Promise.all([X(e,f),Z(e,f),ee(e,f)]);if(r)return;d(C),T(p),i(j),q(null)}catch(C){r||q(I(C))}};v();let U=window.setInterval(()=>{v()},2500);return()=>{r=!0,window.clearInterval(U)}},[e,f,P]),G(()=>{if(w===null){R(null);return}let r=!1;return Y(e,w).then(v=>{r||R(v)}).catch(v=>{r||q(I(v))}),()=>{r=!0}},[e,w]);let b=a.find(r=>r.session_id===f)??null,o=b!==null&&b.ended_at===null&&b.session_id===t,y=r=>{l(r.session_id),D(null),x(null)},_=()=>{A(r=>r+1)};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[b!==null?n("span",{className:"text-(--ui-text-tertiary)",children:b.model??"unknown model"}):null,o?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"live"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:_,children:"Refresh"})]})]}),L!==null?n("div",{className:"text-xs text-red-500",children:L}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),a.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):a.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${f===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{y(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??M(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",H(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id))]}),F.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),F.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${g===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{x(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:M(r.id)}),n("span",{className:`uppercase ${de(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[b!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:b.title??M(b.session_id)}),B.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[B.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[b.model??"unknown model"," \xB7 ",k.length," events \xB7"," ",H(b.tokens_in+b.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:b===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):k.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No events recorded yet."}):k.map(r=>n(we,{event:r,selected:w===r.id,onSelect:()=>{D(r.id)},onFork:()=>{b!==null&&S({session:b,event:r})}},r.id))}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(ye,{detail:$})})]})]})]}),g!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(_e,{ctx:e,branchId:g,refreshTick:P,onClose:()=>{x(null)},onRefresh:_})}):null,N!==null?n(ae,{ctx:e,session:N.session,event:N.event,onClose:()=>{S(null)},onCreated:r=>{x(r),_()}}):null]})}import{jsx as W,jsxs as Pe}from"react/jsx-runtime";function Ne(){let e=ke(me.state.activeSessionId);return Pe("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{me.navigate("/rewind")},title:"Open Session Rewind",children:[W("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}var Se={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){e.register({id:"page",area:"routes",data:{path:"/rewind"},render:()=>W(ce,{ctx:e})}),e.register({id:"nav",area:"sidebarNav",data:{path:"/rewind",label:"Rewind",codicon:"history"}}),e.register({id:"chip",area:"statusBar.right",order:130,render:()=>W(Ne,{})})}},He=Se;export{He as default};
