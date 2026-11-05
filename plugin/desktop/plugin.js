import{host as it,KEYBINDS_AREA as at,PALETTE_AREA as lt,ROUTES_AREA as ut,SIDEBAR_NAV_AREA as dt,STATUSBAR_AREAS as ct}from"@hermes/plugin-sdk";import{host as de,useValue as Oe}from"@hermes/plugin-sdk";var G="/rewind";import{jsx as je,jsxs as Ke}from"react/jsx-runtime";function ce(){let e=Oe(de.state.activeSessionId);return Ke("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{de.navigate(G)},title:"Open Session Rewind",children:[je("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as Pe,useValue as Ce}from"@hermes/plugin-sdk";import{useEffect as ne,useState as p}from"react";function ee(e,t,o){return e.rest(t,{method:"POST",body:o})}async function me(e){return(await e.rest("/sessions?limit=100")).items}async function le(e,t,o=null){let d=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${d}`)}async function pe(e,t,o,d){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${d+1}`)).items}function fe(e,t){return e.rest(`/events/${t}`)}function xe(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function ge(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function be(e,t){return ee(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function ve(e,t,o,d=null){let x=d===null?"":`&before_ts=${d}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${x}`)}function he(e,t){return ee(e,"/forks/prepare",t)}function we(e,t,o){return ee(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function ye(e,t){return ee(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function _e(e,t){return ee(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function te(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function re(e){return e.toLocaleString()}function se(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}function N(e){return e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error"}function V(e,t=8){return e.length<=t?e:e.slice(0,t)}import{host as M}from"@hermes/plugin-sdk";import{useEffect as Ne,useRef as Se,useState as O}from"react";function We(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let d=o.text;return typeof d=="string"?d:""}).join("").trim():""}function ke(e,t){let o=(e??[]).filter(a=>(a.role==="user"||a.role==="assistant")&&We(a).length>0&&typeof a.row_id=="number"),d=-1;for(let a=0;a<o.length;a+=1){let S=o[a];if(S===void 0)continue;let u=S.timestamp;S.role==="user"&&typeof u=="number"&&u<=t+.5&&(d=a)}if(d<=0)return null;let x=o[d-1]?.row_id;return typeof x=="number"&&x>0?x:null}import{jsx as c,jsxs as b}from"react/jsx-runtime";var Ye=["python -m pytest -q","npm test","cargo test","go test ./..."];function J(e,t){return t.catch(o=>{throw new Error(`${e}: ${N(o)}`)})}function Ge(e){return new Promise(t=>{window.setTimeout(t,e)})}function Je(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function Qe(e,t){let o=Je(e),d=o[0],x=o[o.length-1];if(e===null||d===void 0||x===void 0)return;let a=document.activeElement;if(!e.contains(a)){t.preventDefault(),d.focus();return}t.shiftKey&&a===d?(t.preventDefault(),x.focus()):!t.shiftKey&&a===x&&(t.preventDefault(),d.focus())}var Xe=`
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
`;function Re({ctx:e,session:t,event:o,onClose:d,onCreated:x}){let[a,S]=O(t.model??""),[u,C]=O(""),[T,g]=O(""),[i,I]=O(null),[q,A]=O(null),[E,y]=O(null),[_,D]=O(null),k=q!==null,L=Se(null),v=Se(()=>{});Ne(()=>{let l=document.activeElement;return L.current?.focus(),()=>{l?.focus()}},[]),Ne(()=>{let l=m=>{if(m.key==="Escape"&&!k){d();return}if(m.key==="Tab"){Qe(L.current,m);return}m.key==="Enter"&&(m.metaKey||m.ctrlKey)&&!k&&(m.preventDefault(),v.current())};return window.addEventListener("keydown",l),()=>{window.removeEventListener("keydown",l)}},[k,d]);let B=async()=>{let l=await M.request("session.active_list",{}),m=Array.isArray(l.sessions)?l.sessions:[],R=m.find(P=>P.session_key===t.session_id)?.id??m.find(P=>P.id===t.session_id)?.id;if(R===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let P=await M.request("session.title",{session_id:R});return{runtimeId:R,storedId:P.session_key??t.stored_session_id}}catch{return{runtimeId:R,storedId:t.stored_session_id}}},K=async()=>{A("prepare"),y(null),D(null);try{let l=await B(),m=await he(e,{session_id:t.session_id,stored_session_id:l.storedId,event_id:o.id,model:a.trim()||null,provider:null,prompt:u.trim()||null,verify_cmd:T.trim()||null});I(m),C(m.prompt),m.verify_presets.length>0&&T.trim()===""&&g(m.verify_presets[0]??""),m.model!==null&&S(m.model)}catch(l){y(N(l))}finally{A(null)}},Q=async()=>{if(i!==null){A("run"),y(null),D(null);try{let l=await B();if(l.runtimeId===void 0)throw new Error("The session is not live. Open it in Hermes Desktop and try again.");let m=`\u21BA ${t.title??V(t.session_id)}`,R=null;try{let h=await M.request("session.history",{session_id:l.runtimeId});R=ke(h.messages,i.fork_before_ts)}catch{R=null}let P,z,F=!1;if(R!==null){let h=await J("could not branch the session",M.request("session.branch",{session_id:l.runtimeId,through_message_id:R}));P=h.session_id,z=h.stored_session_id}else{let h={source:"desktop",title:m};i.worktree_path!==null&&(h.cwd=i.worktree_path),l.storedId!==null&&(h.parent_session_id=l.storedId);let H=await J("could not create the branch session",M.request("session.create",h));P=H.session_id,z=H.stored_session_id,F=!0}if(!F&&i.worktree_path!==null){let h=()=>M.request("session.cwd.set",{session_id:P,cwd:i.worktree_path});try{await J("could not attach the isolated workspace",h())}catch{await Ge(400);try{await J("could not attach the isolated workspace",h())}catch(H){throw H instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${N(H)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}}if(a.trim()&&a.trim()!==(t.model??""))try{let h=await M.request("config.set",{key:"model",value:a.trim(),session_id:P,confirm_expensive_model:!1});h.confirm_required===!0&&D(h.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{D("The branch was created, but the model switch failed; the rerun uses the current model.")}let X=u.trim()||i.prompt;await J("could not start the rerun",M.request("prompt.submit",{session_id:P,text:X})),await J("could not record the branch",we(e,i.branch_id,{child_session_id:z,child_stored_session_id:z,model:a.trim()||null,provider:null,prompt:X,verify_cmd:T.trim()||null})),x(i.branch_id),M.openSession(z,{intent:"tab"}),d()}catch(l){y(N(l))}finally{A(null)}}};v.current=()=>{i===null?K():Q()};let W=i===null?"not prepared":i.fidelity,Y=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return b("div",{className:"rw-overlay",onMouseDown:l=>{l.target===l.currentTarget&&!k&&d()},children:[c("style",{children:Xe}),b("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:L,children:[b("header",{className:"rw-header",children:[b("div",{className:"rw-heading",children:[c("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),b("div",{className:"rw-subtitle",children:[te(o.ts)," \xB7 ",o.preview||"user turn"]})]}),c("button",{type:"button",className:"rw-close",onClick:d,disabled:k,"aria-label":"Close",children:"\xD7"})]}),b("div",{className:"rw-body",children:[b("section",{className:"rw-card",children:[b("div",{className:"rw-card-head",children:[c("span",{className:"rw-card-title",children:"Checkpoint"}),c("span",{className:Y,children:W==="full"?"workspace ready":W})]}),b("div",{className:"rw-chips",children:[b("span",{className:"rw-chip",children:["history rows ",i===null?"\u2014":i.fork_row_count]}),b("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?b("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?c("div",{className:"rw-path",children:i.worktree_path}):c("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?c("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?c("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&i.fork_row_count===0?c("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),b("div",{className:"rw-grid",children:[b("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Model"}),c("input",{className:"rw-input",value:a,onChange:l=>{S(l.target.value)},placeholder:"provider/model"}),c("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),b("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Verify command"}),c("input",{className:"rw-input",value:T,onChange:l=>{g(l.target.value)},placeholder:"python -m pytest -q"}),c("div",{className:"rw-chips",children:(i?.verify_presets.length?i.verify_presets:Ye).map(l=>c("button",{type:"button",className:"rw-preset",onClick:()=>{g(l)},disabled:k,children:l},l))}),c("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),i!==null&&T.trim()!==""?c("span",{className:"rw-resolved",children:i.verify_resolved===null?"Not found on the gateway PATH. Use the full interpreter path.":`Resolves to ${i.verify_resolved}`}):null]})]}),b("label",{className:"rw-field",children:[c("span",{className:"rw-label",children:"Prompt for the rerun"}),c("textarea",{className:"rw-textarea",value:u,onChange:l=>{C(l.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),c("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]}),_!==null?c("div",{className:"rw-banner rw-banner-warn",role:"status",children:_}):null,E!==null?c("div",{className:"rw-banner rw-banner-error",role:"alert",children:E}):null]}),b("footer",{className:"rw-footer",children:[c("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),b("div",{className:"rw-actions",children:[c("button",{type:"button",className:"rw-button",onClick:d,disabled:k,children:"Cancel"}),i===null?c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{K()},disabled:k,children:q==="prepare"?"Preparing...":"Prepare branch"}):c("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{Q()},disabled:k,children:q==="run"?"Forking...":"Fork & run"})]})]})]})]})}import{Fragment as $e,jsx as n,jsxs as s}from"react/jsx-runtime";var Ze=new Set(["done","failed","cleaned","discarded"]);function et(e){return se(Math.max(0,(e.last_ts-e.ts)*1e3))}function tt({event:e,selected:t,onSelect:o}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[n("span",{className:`w-16 shrink-0 uppercase ${Ee(e.kind,e.status)}`,children:Te(e.kind)}),n("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),n("span",{className:"w-14 shrink-0 text-right font-mono",children:se(e.duration_ms)})]})}var rt=new Set(["api_request","llm_call"]);function nt({turn:e,expanded:t,events:o,loading:d,selectedEventId:x,onToggle:a,onFork:S,onSelectEvent:u}){let C=(o??[]).filter(g=>!rt.has(g.kind)),T=(o??[]).length-C.length;return s("div",{className:"border-b border-(--ui-border) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:a,"aria-expanded":t,children:[n("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),n("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:te(e.ts)}),n("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),s("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:[e.tool_calls," ",e.tool_calls===1?"tool":"tools"]}),e.tool_errors>0?s("span",{className:"shrink-0 text-xs text-red-500",children:[e.tool_errors," ",e.tool_errors===1?"error":"errors"]}):null,n("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:et(e)})]}),n("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:S,children:"Rewind"})]}),t?n("div",{className:"flex flex-col gap-0.5 pb-1",children:d?n("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s($e,{children:[C.map(g=>n(tt,{event:g,selected:x===g.id,onSelect:()=>{u(g)}},g.id)),T>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[e.api_requests," model requests \xB7 ",e.event_count," events in this turn"]}):null]})}):null]})}function Te(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"capture_dropped":return"dropped";default:return e}}function Ee(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Ie(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function j({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"text-(--ui-text-tertiary)",children:e}),n("span",{className:"font-mono tabular-nums",children:t})]})}function st({detail:e}){return e===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[n("span",{className:`font-medium ${Ee(e.kind,e.status)}`,children:Te(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${se(e.duration_ms)}`:""]}),n("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function ot({ctx:e,branchId:t,refreshTick:o,onClose:d,onRefresh:x}){let[a,S]=p(null),[u,C]=p(null),[T,g]=p(!1),[i,I]=p(null);ne(()=>{let _=!1,D=null,k=async()=>{try{let v=await be(e,t);if(_)return!0;S(v),I(null);let B=v.branch.child_session_id;if(B!==null){let K=await ve(e,v.branch.parent_session_id,B,v.branch.fork_before_ts);_||C(K)}else C(null);return Ze.has(v.branch.state)}catch(v){return _||I(N(v)),!1}},L=async()=>{let v=await k();!_&&!v&&(D=e.setTimeout(()=>{L()},2500))};return L(),()=>{_=!0,D!==null&&D()}},[e,t,o]);let q=async()=>{g(!0),I(null);try{await ye(e,t),x()}catch(_){I(N(_))}finally{g(!1)}},A=async()=>{g(!0),I(null);try{await _e(e,t),x()}catch(_){I(N(_))}finally{g(!1)}};if(a===null)return n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let E=a.branch,y=a.run;return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",V(E.id)]}),n("span",{className:`uppercase ${Ie(E.state)}`,children:E.state}),y!==null&&y.verify_exit!==null?s("span",{className:y.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",y.verify_exit]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{q()},disabled:T||!E.verify_cmd,children:"Verify"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{A()},disabled:T||E.state==="cleaned",children:"Cleanup"}),n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:d,children:"Hide"})]})]}),i!==null?n("div",{className:"text-xs text-red-500",children:i}):null,u!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-border) p-2",children:[s("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",u.left?.frozen_at?` \xB7 frozen ${te(u.left.frozen_at)}`:""]}),n(j,{label:"outcome",value:u.left?.outcome??"unknown"}),n(j,{label:"tokens",value:u.left===null?"n/a":re(u.left.tokens_in+u.left.tokens_out)}),n(j,{label:"tool errors",value:u.left===null?"n/a":String(u.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-border) p-2",children:[n("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),n(j,{label:"outcome",value:u.right?.outcome??"running"}),n(j,{label:"verify",value:u.right?.verify_exit===null||u.right?.verify_exit===void 0?"not run":`exit ${u.right.verify_exit}`}),n(j,{label:"tokens",value:u.right===null?"n/a":re(u.right.tokens_in+u.right.tokens_out)}),n(j,{label:"tool errors",value:u.right===null?"n/a":String(u.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",u.verdict]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Waiting for the rerun to start."}),y!==null&&y.verify_out?n("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:y.verify_out}):null,a.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[n("summary",{children:"Prompt"}),n("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:a.prompt})]}):null]})}function De({ctx:e}){let t=Ce(Pe.state.activeSessionId),o=Ce(Pe.state.focusedStoredSessionId),[d,x]=p([]),[a,S]=p(null),[u,C]=p([]),[T,g]=p(!1),[i,I]=p(!1),[q,A]=p(null),[E,y]=p({}),[_,D]=p([]),[k,L]=p([]),[v,B]=p(null),[K,Q]=p(null),[W,Y]=p(null),[l,m]=p(null),[R,P]=p(0),[z,F]=p(null),[X,h]=p(0),[H,Fe]=p(!1),[qe,ue]=p(!1);ne(()=>e.onEvent("*",()=>{h(r=>r+1)}),[e]),ne(()=>{let r=!1,f=async()=>{try{let $=await me(e);if(r)return;x($),Fe(!0),F(null),S(Z=>Z!==null&&$.some(ie=>ie.session_id===Z)?Z:t??$[0]?.session_id??null)}catch($){r||F(N($))}};f();let U=e.setInterval(()=>{f()},1e4);return()=>{r=!0,U()}},[e,t,R,X]),ne(()=>{if(a===null){C([]),ue(!1),g(!1),D([]),L([]);return}let r=!1,f=async()=>{try{let[$,Z,ie]=await Promise.all([le(e,a),xe(e,a),ge(e,a)]);if(r)return;C(He=>{let Ue=new Set($.items.map(ae=>ae.seq)),Ve=He.filter(ae=>!Ue.has(ae.seq));return[...$.items,...Ve]}),g($.has_more),ue(!0),D(Z),L(ie),F(null)}catch($){r||F(N($))}};f();let U=e.setInterval(()=>{f()},1e4);return()=>{r=!0,U()}},[e,a,R,X]),ne(()=>{if(v===null){Q(null);return}let r=!1;return fe(e,v).then(f=>{r||Q(f)}).catch(f=>{r||F(N(f))}),()=>{r=!0}},[e,v]);let w=d.find(r=>r.session_id===a)??null,Le=w!==null&&w.ended_at===null&&(w.session_id===t||w.session_id===o),Me=r=>{S(r.session_id),B(null),Y(null),A(null),y({})},oe=()=>{P(r=>r+1)},Be=r=>{if(q===r.id){A(null);return}A(r.id),E[r.id]===void 0&&pe(e,r.session_id,r.seq,r.seq_to).then(f=>{y(U=>({...U,[r.id]:f}))}).catch(f=>{F(N(f))})},ze=async()=>{let r=u[u.length-1];if(!(a===null||r===void 0)){I(!0);try{let f=await le(e,a,r.seq);C(U=>[...U,...f.items]),g(f.has_more)}catch(f){F(N(f))}finally{I(!1)}}};return s("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[s("div",{children:[n("div",{className:"text-base font-medium",children:"Session Rewind"}),n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[w!==null?n("span",{className:"text-(--ui-text-tertiary)",children:w.model??"unknown model"}):null,Le?s("span",{className:"flex items-center gap-1 text-emerald-500",children:[n("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),"live"]}):null,n("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:oe,children:"Refresh"})]})]}),z!==null?n("div",{className:"text-xs text-red-500",children:z}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[s("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:[s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),H?d.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):d.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${a===r.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Me(r)},children:[s("span",{className:"flex items-center gap-1.5",children:[n("span",{className:`h-1.5 w-1.5 rounded-full ${r.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),n("span",{className:"truncate font-medium",children:r.title??V(r.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"unknown model"," \xB7 ",r.event_count," events"]}),s("span",{className:"text-(--ui-text-tertiary)",children:[r.outcome??"recording"," \xB7"," ",re(r.tokens_in+r.tokens_out)," tokens"]})]},r.session_id)):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]}),k.length>0?s("div",{className:"flex flex-col gap-1",children:[n("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),k.map(r=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${W===r.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{Y(r.id)},children:[s("span",{className:"flex items-center justify-between gap-2",children:[n("span",{className:"font-mono",children:V(r.id)}),n("span",{className:`uppercase ${Ie(r.state)}`,children:r.state})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[r.model??"same model"," \xB7 ",r.fork_row_count," rows"]})]},r.id))]}):null]}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[w!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[n("span",{className:"text-base font-medium",children:w.title??V(w.session_id)}),_.length>0?s("span",{className:"text-xs text-(--ui-text-tertiary)",children:[_.length," snapshots"]}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[w.model??"unknown model"," \xB7 ",w.event_count," events \xB7 ",re(w.tokens_in+w.tokens_out)," tokens"]})]}),n("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[n("div",{className:"min-w-0 flex-1 overflow-auto",children:w===null?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):qe?u.length===0?n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"No user turns recorded yet for this session."}):s($e,{children:[u.map(r=>n(nt,{turn:r,expanded:q===r.id,events:E[r.id]??null,loading:q===r.id&&E[r.id]===void 0,selectedEventId:v,onToggle:()=>{Be(r)},onFork:()=>{w!==null&&m({session:w,event:r})},onSelectEvent:f=>{B(f.id)}},r.id)),T?n("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{ze()},disabled:i,children:i?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[u.length," turns \xB7 start of the recording"]})]}):n("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),n("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:n(st,{detail:K})})]})]})]}),W!==null?n("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:n(ot,{ctx:e,branchId:W,refreshTick:R,onClose:()=>{Y(null)},onRefresh:oe})}):null,l!==null?n(Re,{ctx:e,session:l.session,event:l.event,onClose:()=>{m(null)},onCreated:r=>{Y(r),oe()}}):null]})}import{jsx as Ae}from"react/jsx-runtime";var mt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{it.navigate(G)};e.registerMany([{id:"page",area:ut,data:{path:G},render:()=>Ae(De,{ctx:e})},{id:"nav",area:dt,data:{path:G,label:"Rewind",codicon:"history"}},{id:"palette-open",area:lt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:at,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:ct.right,order:130,render:()=>Ae(ce,{})}])}},Bt=mt;export{Bt as default};
