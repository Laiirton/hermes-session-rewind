import{host as lt,KEYBINDS_AREA as ut,PALETTE_AREA as dt,ROUTES_AREA as ct,SIDEBAR_NAV_AREA as mt,STATUSBAR_AREAS as pt}from"@hermes/plugin-sdk";import{host as pe,useValue as je}from"@hermes/plugin-sdk";var G="/rewind";import{jsx as Ke,jsxs as We}from"react/jsx-runtime";function fe(){let e=je(pe.state.activeSessionId);return We("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{pe.navigate(G)},title:"Open Session Rewind",children:[Ke("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as Ee,useValue as Ie}from"@hermes/plugin-sdk";import{useEffect as re,useState as f}from"react";function Z(e,t,o){return e.rest(t,{method:"POST",body:o})}async function ge(e){return(await e.rest("/sessions?limit=100")).items}async function de(e,t,o=null){let d=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${d}`)}async function xe(e,t,o,d){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${d+1}`)).items}function be(e,t){return e.rest(`/events/${t}`)}function ve(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function he(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function we(e,t){return Z(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function ye(e,t,o,d=null){let b=d===null?"":`&before_ts=${d}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${b}`)}function _e(e,t){return Z(e,"/forks/prepare",t)}function ke(e,t,o){return Z(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function Ne(e,t){return Z(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Se(e,t,o){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(o)}`)}function Re(e,t){return Z(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function ee(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function te(e){return e.toLocaleString()}function ie(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}function R(e){return e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error"}function O(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as L}from"@hermes/plugin-sdk";import{useEffect as ce,useRef as Ce,useState as B}from"react";function Ye(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let d=o.text;return typeof d=="string"?d:""}).join("").trim():""}function Pe(e,t){let o=(e??[]).filter(l=>(l.role==="user"||l.role==="assistant")&&Ye(l).length>0&&typeof l.row_id=="number"),d=-1;for(let l=0;l<o.length;l+=1){let P=o[l];if(P===void 0)continue;let u=P.timestamp;P.role==="user"&&typeof u=="number"&&u<=t+.5&&(d=l)}if(d<=0)return null;let b=o[d-1]?.row_id;return typeof b=="number"&&b>0?b:null}import{jsx as c,jsxs as h}from"react/jsx-runtime";var Ge=["python -m pytest -q","npm test","cargo test","go test ./..."],Je=350;function J(e,t){return t.catch(o=>{throw new Error(`${e}: ${R(o)}`)})}function Qe(e){return new Promise(t=>{window.setTimeout(t,e)})}function Xe(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function Ze(e,t){let o=Xe(e),d=o[0],b=o[o.length-1];if(e===null||d===void 0||b===void 0)return;let l=document.activeElement;if(!e.contains(l)){t.preventDefault(),d.focus();return}t.shiftKey&&l===d?(t.preventDefault(),b.focus()):!t.shiftKey&&l===b&&(t.preventDefault(),d.focus())}var et=`
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
`;function Te({ctx:e,session:t,event:o,onClose:d,onCreated:b}){let[l,P]=B(t.model??""),[u,T]=B(""),[N,v]=B(""),[i,E]=B(null),[$,A]=B(null),[C,_]=B(null),[k,I]=B(null),[z,F]=B(null),p=C!==null,q=Ce(null),K=Ce(()=>{});ce(()=>{let a=document.activeElement;return q.current?.focus(),()=>{a?.focus()}},[]),ce(()=>{let a=m=>{if(m.key==="Escape"&&!p){d();return}if(m.key==="Tab"){Ze(q.current,m);return}m.key==="Enter"&&(m.metaKey||m.ctrlKey)&&!p&&(m.preventDefault(),K.current())};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[p,d]),ce(()=>{let a=N.trim();if(i===null||a===""){A(null);return}let m=!1,S=e.setTimeout(()=>{Se(e,i.branch_id,a).then(g=>{m||A(g)}).catch(()=>{m||A(null)})},Je);return()=>{m=!0,S()}},[e,i,N]);let Q=async()=>{let a=await L.request("session.active_list",{}),m=Array.isArray(a.sessions)?a.sessions:[],S=m.find(g=>g.session_key===t.session_id)?.id??m.find(g=>g.id===t.session_id)?.id;if(S===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let g=await L.request("session.title",{session_id:S});return{runtimeId:S,storedId:g.session_key??t.stored_session_id}}catch{return{runtimeId:S,storedId:t.stored_session_id}}},W=async()=>{_("prepare"),I(null),F(null);try{let a=await Q(),m=await _e(e,{session_id:t.session_id,stored_session_id:a.storedId,event_id:o.id,model:l.trim()||null,provider:null,prompt:u.trim()||null,verify_cmd:N.trim()||null});E(m),T(m.prompt),m.verify_presets.length>0&&N.trim()===""&&v(m.verify_presets[0]??""),m.model!==null&&P(m.model)}catch(a){I(R(a))}finally{_(null)}},H=async()=>{if(i!==null){_("run"),I(null),F(null);try{let a=await Q();if(a.runtimeId===void 0)throw new Error("The session is not live. Open it in Hermes Desktop and try again.");let m=`\u21BA ${t.title??O(t.session_id)}`,S=null;try{let w=await L.request("session.history",{session_id:a.runtimeId});S=Pe(w.messages,i.fork_before_ts)}catch{S=null}let g,M,se=!1;if(S!==null){let w=await J("could not branch the session",L.request("session.branch",{session_id:a.runtimeId,through_message_id:S}));g=w.session_id,M=w.stored_session_id}else{let w={source:"desktop",title:m};i.worktree_path!==null&&(w.cwd=i.worktree_path),a.storedId!==null&&(w.parent_session_id=a.storedId);let V=await J("could not create the branch session",L.request("session.create",w));g=V.session_id,M=V.stored_session_id,se=!0}if(!se&&i.worktree_path!==null){let w=()=>L.request("session.cwd.set",{session_id:g,cwd:i.worktree_path});try{await J("could not attach the isolated workspace",w())}catch{await Qe(400);try{await J("could not attach the isolated workspace",w())}catch(V){throw V instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${R(V)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}}if(l.trim()&&l.trim()!==(t.model??""))try{let w=await L.request("config.set",{key:"model",value:l.trim(),session_id:g,confirm_expensive_model:!1});w.confirm_required===!0&&F(w.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{F("The branch was created, but the model switch failed; the rerun uses the current model.")}let oe=u.trim()||i.prompt;await J("could not start the rerun",L.request("prompt.submit",{session_id:g,text:oe})),await J("could not record the branch",ke(e,i.branch_id,{child_session_id:M,child_stored_session_id:M,model:l.trim()||null,provider:null,prompt:oe,verify_cmd:N.trim()||null})),b(i.branch_id),L.openSession(M,{intent:"tab"}),d()}catch(a){I(R(a))}finally{_(null)}}};K.current=()=>{i===null?W():H()};let Y=i===null?"not prepared":i.fidelity,ne=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return h("div",{className:"rw-overlay",onMouseDown:a=>{a.target===a.currentTarget&&!p&&d()},children:[c("style",{children:et}),h("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:q,children:[h("header",{className:"rw-header",children:[h("div",{className:"rw-heading",children:[c("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),h("div",{className:"rw-subtitle",children:[ee(o.ts)," \xB7 ",o.preview||"user turn"]})]}),c("button",{type:"button",className:"rw-close",onClick:d,disabled:p,"aria-label":"Close",children:"\xD7"})]}),h("div",{className:"rw-body",children:[h("section",{className:"rw-card",children:[h("div",{className:"rw-card-head",children:[c("span",{className:"rw-card-title",children:"Checkpoint"}),c("span",{className:ne,children:Y==="full"?"workspace ready":Y})]}),h("div",{className:"rw-chips",children:[h("span",{className:"rw-chip",children:["history rows ",i===null?"\u2014":i.fork_row_count]}),h("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?h("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?c("div",{className:"rw-path",children:i.worktree_path}):c("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?c("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?c("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&i.fork_row_count===0?c("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),h("div",{className:"rw-grid",children:[h("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Model"}),c("input",{className:"rw-input",value:l,onChange:a=>{P(a.target.value)},placeholder:"provider/model"}),c("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),h("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Verify command"}),c("input",{className:"rw-input",value:N,onChange:a=>{v(a.target.value)},placeholder:"python -m pytest -q"}),c("div",{className:"rw-chips",children:(i?.verify_presets.length?i.verify_presets:Ge).map(a=>c("button",{type:"button",className:"rw-preset",onClick:()=>{v(a)},disabled:p,children:a},a))}),c("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),$!==null&&$.command===N.trim()?c("span",{className:"rw-resolved",children:$.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${$.resolved}`}):null]})]}),h("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Prompt for the rerun"}),c("textarea",{className:"rw-textarea",value:u,onChange:a=>{T(a.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),c("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]}),z!==null?c("div",{className:"rw-banner rw-banner-warn",role:"status",children:z}):null,k!==null?c("div",{className:"rw-banner rw-banner-error",role:"alert",children:k}):null]}),h("footer",{className:"rw-footer",children:[c("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),h("div",{className:"rw-actions",children:[c("button",{type:"button",className:"rw-button",onClick:d,disabled:p,children:"Cancel"}),i===null?c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{W()},disabled:p,children:C==="prepare"?"Preparing...":"Prepare branch"}):c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{H()},disabled:p,children:C==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{Fragment as qe,jsx as n,jsxs as s}from"react/jsx-runtime";var tt=new Set(["done","failed","cleaned","discarded"]);function rt(e){return ie(Math.max(0,(e.last_ts-e.ts)*1e3))}function nt({event:e,selected:t,onSelect:o}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[n("span",{className:`w-16 shrink-0 uppercase ${$e(e.kind,e.status)}`,children:De(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:ie(e.duration_ms)})]})}var st=new Set(["api_request","llm_call"]);function ot({turn:e,expanded:t,events:o,loading:d,selectedEventId:b,onToggle:l,onFork:P,onSelectEvent:u}){let T=(o??[]).filter(v=>!st.has(v.kind)),N=(o??[]).length-T.length;return s("div",{className:"border-b border-(--ui-border) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:l,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:ee(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),s("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?s("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:rt(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:P,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:d?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s(qe,{children:[T.map(v=>n(nt,{event:v,selected:b===v.id,onSelect:()=>{u(v)}},v.id)),N>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function De(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function $e(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Fe(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function j({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function it({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${$e(e.kind,e.status)}`,children:De(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${ie(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function at({ctx:e,branchId:t,refreshTick:o,onClose:d,onRefresh:b}){let[l,P]=f(null),[u,T]=f(null),[N,v]=f(!1),[i,E]=f(null);re(()=>{let k=!1,I=null,z=async()=>{try{let p=await we(e,t);if(k)return!0;P(p),E(null);let q=p.branch.child_session_id;if(q!==null){let K=await ye(e,p.branch.parent_session_id,q,p.branch.fork_before_ts);k||T(K)}else T(null);return tt.has(p.branch.state)}catch(p){return k||E(R(p)),!1}},F=async()=>{let p=await z();!k&&!p&&(I=e.setTimeout(()=>{F()},2500))};return F(),()=>{k=!0,I!==null&&I()}},[e,t,o]);let $=async()=>{v(!0),E(null);try{await Ne(e,t),b()}catch(k){E(R(k))}finally{v(!1)}},A=async()=>{v(!0),E(null);try{await Re(e,t),b()}catch(k){E(R(k))}finally{v(!1)}};if(l===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let C=l.branch,_=l.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",O(C.id)]}),n("span",{className:`uppercase ${Fe(C.state)}`,children:C.state}),_!==null&&_.verify_exit!==null?s("span",{className:_.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",_.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{$()},disabled:N||!C.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{A()},disabled:N||C.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:d,children:"Hide"})]})]}),i!==null?n("div",{className:"text-xs text-red-500",children:i}):null,u!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[s("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",u.left?.frozen_at?` \xB7 frozen ${ee(u.left.frozen_at)}`:""]}),n(j,{label:"outcome",value:u.left?.outcome??"unknown"}),n(j,{label:"tokens",value:u.left===null?"n/a":te(u.left.tokens_in+u.left.tokens_out)}),n(j,{label:"tool errors",value:u.left===null?"n/a":String(u.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(j,{label:"outcome",value:u.right?.outcome??"running"}),n(j,{label:"verify",value:u.right?.verify_exit===null||u.right?.verify_exit===void 0?"not run":`exit ${u.right.verify_exit}`}),n(j,{label:"tokens",value:u.right===null?"n/a":te(u.right.tokens_in+u.right.tokens_out)}),n(j,{label:"tool errors",value:u.right===null?"n/a":String(u.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",u.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),_!==null&&_.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:_.verify_out}):null,l.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:l.prompt})]}):null]})}function Ae({ctx:e}){let t=Ie(Ee.state.activeSessionId),o=Ie(Ee.state.focusedStoredSessionId),[d,b]=f([]),[l,P]=f(null),[u,T]=f([]),[N,v]=f(!1),[i,E]=f(!1),[$,A]=f(null),[C,_]=f({}),[k,I]=f([]),[z,F]=f([]),[p,q]=f(null),[K,Q]=f(null),[W,H]=f(null),[Y,ne]=f(null),[a,m]=f(0),[S,g]=f(null),[M,se]=f(0),[oe,w]=f(!1),[V,me]=f(!1);re(()=>e.onEvent("*",()=>{se(r=>r+1)}),[e]),re(()=>{let r=!1,x=async()=>{try{let D=await ge(e);if(r)return;b(D),w(!0),g(null),P(X=>X!==null&&D.some(le=>le.session_id===X)?X:t??D[0]?.session_id??null)}catch(D){r||g(R(D))}};x();let U=e.setInterval(()=>{x()},1e4);return()=>{r=!0,U()}},[e,t,a,M]),re(()=>{if(l===null){T([]),me(!1),v(!1),I([]),F([]);return}let r=!1,x=async()=>{try{let[D,X,le]=await Promise.all([de(e,l),ve(e,l),he(e,l)]);if(r)return;T(Ve=>{let Ue=new Set(D.items.map(ue=>ue.seq)),Oe=Ve.filter(ue=>!Ue.has(ue.seq));return[...D.items,...Oe]}),v(D.has_more),me(!0),I(X),F(le),g(null)}catch(D){r||g(R(D))}};x();let U=e.setInterval(()=>{x()},1e4);return()=>{r=!0,U()}},[e,l,a,M]),re(()=>{if(p===null){Q(null);return}let r=!1;return be(e,p).then(x=>{r||Q(x)}).catch(x=>{r||g(R(x))}),()=>{r=!0}},[e,p]);let y=d.find(r=>r.session_id===l)??null,Me=y!==null&&y.ended_at===null&&(y.session_id===t||y.session_id===o),Be=r=>{P(r.session_id),q(null),H(null),A(null),_({})},ae=()=>{m(r=>r+1)},ze=r=>{if($===r.id){A(null);return}A(r.id),C[r.id]===void 0&&xe(e,r.session_id,r.seq,r.seq_to).then(x=>{_(U=>({...U,[r.id]:x}))}).catch(x=>{g(R(x))})},He=async()=>{let r=u[u.length-1];if(!(l===null||r===void 0)){E(!0);try{let x=await de(e,l,r.seq);T(U=>[...U,...x.items]),v(x.has_more)}catch(x){g(R(x))}finally{E(!1)}}};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[y!==null?n("span",{className:"text-(--ui-text-tertiary)",children:y.model??"unknown model"}):null,Me?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"live"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:ae,children:"Refresh"})]})]}),S!==null?n("div",{className:"text-xs text-red-500",children:S}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),oe?d.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):d.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${l===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Be(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??O(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",te(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id)):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]}),z.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),z.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${W===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{H(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:O(r.id)}),n("span",{className:`uppercase ${Fe(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[y!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:y.title??O(y.session_id)}),k.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[k.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[y.model??"unknown model"," \xB7 ",y.event_count," events \xB7 ",te(y.tokens_in+y.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:y===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):V?u.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):s(qe,{children:[u.map(r=>n(ot,{turn:r,expanded:$===r.id,events:C[r.id]??null,loading:$===r.id&&C[r.id]===void 0,selectedEventId:p,onToggle:()=>{ze(r)},onFork:()=>{y!==null&&ne({session:y,event:r})},onSelectEvent:x=>{q(x.id)}},r.id)),N?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{He()},disabled:i,children:i?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[u.length," turns \xB7 start of the recording"]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(it,{detail:K})})]})]})]}),W!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(at,{ctx:e,branchId:W,refreshTick:a,onClose:()=>{H(null)},onRefresh:ae})}):null,Y!==null?n(Te,{ctx:e,session:Y.session,event:Y.event,onClose:()=>{ne(null)},onCreated:r=>{H(r),ae()}}):null]})}import{jsx as Le}from"react/jsx-runtime";var ft={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{lt.navigate(G)};e.registerMany([{id:"page",area:ct,data:{path:G},render:()=>Le(Ae,{ctx:e})},{id:"nav",area:mt,data:{path:G,label:"Rewind",codicon:"history"}},{id:"palette-open",area:dt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:ut,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:pt.right,order:130,render:()=>Le(fe,{})}])}},Ht=ft;export{Ht as default};
