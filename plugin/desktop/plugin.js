import{host as Rt,KEYBINDS_AREA as Et,PALETTE_AREA as Pt,ROUTES_AREA as Ct,SIDEBAR_NAV_AREA as Tt,STATUSBAR_AREAS as It}from"@hermes/plugin-sdk";import{host as we,useValue as tt}from"@hermes/plugin-sdk";var ee="/rewind";import{jsx as rt,jsxs as nt}from"react/jsx-runtime";function _e(){let e=tt(we.state.activeSessionId);return nt("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{we.navigate(ee)},title:"Open Session Rewind",children:[rt("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as ft,useValue as gt}from"@hermes/plugin-sdk";import{useEffect as V,useRef as xt,useState as x}from"react";function ne(e,t,o){return e.rest(t,{method:"POST",body:o})}var fe=100;async function ke(e){return(await e.rest(`/sessions?limit=${fe}`)).items}async function ge(e,t,o=null){let d=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${d}`)}async function Ne(e,t,o,d){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${d+1}`)).items}function Se(e,t){return e.rest(`/events/${t}`)}function Re(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function Ee(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function Pe(e,t){return ne(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function Ce(e,t,o,d=null){let l=d===null?"":`&before_ts=${d}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${l}`)}function Te(e,t){return ne(e,"/forks/prepare",t)}function Ie(e,t,o){return ne(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function $e(e,t){return ne(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Le(e,t,o){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(o)}`)}function De(e,t){return e.rest(`/forks/${encodeURIComponent(t)}/workspace`)}function xe(e,t){return ne(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function oe(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function se(e){return e.toLocaleString()}function de(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var ot=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function T(e){let t=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",o=ot.exec(t),d=o?.[1];if(o===null||d===void 0)return t;let l=st(d);return l===void 0?t:t.replace(o[0],l)}function st(e){try{let t=JSON.parse(e);return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}catch{return}}function j(e,t=8){return e.length<=t?e:e.slice(0,t)}function L(e,t){return`${e} ${e===1?t:`${t}s`}`}function ve(e){return e===0?"passed":`failed (exit ${e})`}var it={completed:"completed",agent_close:"closed with the app",ws_orphan_reap:"ended with its window",startup_orphan_reap:"ended with its window"};function ce(e){return e===null?"recording":it[e]??e}function Me(e){return e===null?"open at freeze":ce(e)}function Ae(e,t){return e===0?"":e>=t?`${t}+`:`${e}`}function at(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}function Fe(e){return e===null?"recording, nothing captured yet":`recording \xB7 last event ${at(e)}`}function Be(e,t){return t!==null?`The turns could not be loaded: ${t}`:e===0?"No user turns recorded yet for this session.":`The recording holds ${L(e,"event")} but no user turn.`}function qe(e){return e===null?"Git could not read this workspace, so it may hold edits that were never committed. Deleting it would remove them for good.":`This workspace holds ${L(e,"uncommitted file")}. Deleting it removes them for good; the rerun conversation stays in the recording.`}import{host as H}from"@hermes/plugin-sdk";import{useEffect as be,useRef as Oe,useState as G}from"react";function lt(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let d=o.text;return typeof d=="string"?d:""}).join("").trim():""}function ze(e,t){let o=(e??[]).filter(u=>(u.role==="user"||u.role==="assistant")&&lt(u).length>0&&typeof u.row_id=="number"),d=-1;for(let u=0;u<o.length;u+=1){let D=o[u];if(D===void 0)continue;let c=D.timestamp;D.role==="user"&&typeof c=="number"&&c<=t+.5&&(d=u)}if(d<=0)return null;let l=o[d-1]?.row_id;return typeof l=="number"&&l>0?l:null}import{jsx as p,jsxs as N}from"react/jsx-runtime";var ut=["python -m pytest -q","npm test","cargo test","go test ./..."],dt=350;function ie(e,t){return t.catch(o=>{throw new Error(`${e}: ${T(o)}`)})}function ct(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function mt(e,t){let o=ct(e),d=o[0],l=o[o.length-1];if(e===null||d===void 0||l===void 0)return;let u=document.activeElement;if(!e.contains(u)){t.preventDefault(),d.focus();return}t.shiftKey&&u===d?(t.preventDefault(),l.focus()):!t.shiftKey&&u===l&&(t.preventDefault(),d.focus())}var pt=`
.rw-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal-backdrop, 120);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 28px 20px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(0.125rem);
}
.rw-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: min(760px, 100%);
  max-height: calc(100vh - 56px);
  margin: auto 0;
  overflow: hidden;
  color: var(--ui-text-primary);
  background: var(--ui-bg-elevated);
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
}
.rw-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 48px 16px 20px;
  border-bottom: 1px solid var(--ui-stroke-tertiary);
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
  color: var(--ui-text-tertiary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.rw-close {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  padding: 0;
  font: inherit;
  font-size: 16px;
  line-height: 1;
  color: var(--ui-text-tertiary);
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 8px;
  transition: color 120ms ease-out, background-color 120ms ease-out;
}
.rw-close:hover:not(:disabled) {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
}
.rw-panel:focus-visible {
  outline: none;
}
.rw-button:focus-visible,
.rw-close:focus-visible,
.rw-preset:focus-visible {
  outline: 2px solid var(--ui-stroke-primary);
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
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-tertiary);
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
  color: var(--ui-text-tertiary);
}
.rw-badge {
  padding: 2px 8px;
  font-size: 11px;
  line-height: 1.6;
  color: var(--ui-text-secondary);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 999px;
}
.rw-badge-idle {
  color: var(--ui-text-tertiary);
}
.rw-badge-ok {
  color: var(--ui-green);
  background: color-mix(in srgb, var(--ui-green) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-green) 32%, transparent);
}
.rw-badge-warn {
  color: var(--ui-yellow);
  background: color-mix(in srgb, var(--ui-yellow) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-yellow) 32%, transparent);
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
  color: var(--ui-text-secondary);
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 6px;
}
.rw-preset {
  padding: 3px 8px;
  font: inherit;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  color: var(--ui-text-secondary);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-stroke-tertiary);
  border-radius: 6px;
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rw-preset:hover {
  color: var(--ui-text-primary);
  background: var(--ui-control-hover-background);
  border-color: var(--ui-stroke-secondary);
}
.rw-resolved {
  margin-top: 6px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  line-height: 1.5;
  overflow-wrap: anywhere;
  color: var(--ui-text-tertiary);
}
.rw-path {
  margin-top: 10px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  font-size: 11px;
  line-height: 1.5;
  color: var(--ui-text-tertiary);
  word-break: break-all;
}
.rw-note {
  margin-top: 10px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--ui-yellow);
}
.rw-note-muted {
  color: var(--ui-text-tertiary);
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
  color: var(--ui-text-tertiary);
}
.rw-input,
.rw-textarea {
  box-sizing: border-box;
  width: 100%;
  padding: 9px 10px;
  font: inherit;
  font-size: 12px;
  color: var(--ui-text-primary);
  outline: none;
  background: var(--ui-bg-card);
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: 8px;
  transition: border-color 120ms ease-out, box-shadow 120ms ease-out;
}
.rw-input {
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
}
.rw-input:focus,
.rw-textarea:focus {
  border-color: var(--ui-stroke-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ui-stroke-primary) 20%, transparent);
}
.rw-textarea {
  min-height: 170px;
  font-family: var(--dt-font-mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
  line-height: 1.55;
  resize: vertical;
}
.rw-help {
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-text-tertiary);
}
.rw-banner {
  padding: 9px 11px;
  font-size: 12px;
  line-height: 1.5;
  border: 1px solid transparent;
  border-radius: 8px;
}
.rw-banner-warn {
  color: var(--ui-yellow);
  background: color-mix(in srgb, var(--ui-yellow) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-yellow) 30%, transparent);
}
.rw-banner-error {
  color: var(--ui-red);
  background: color-mix(in srgb, var(--ui-red) 10%, transparent);
  border-color: color-mix(in srgb, var(--ui-red) 30%, transparent);
}
.rw-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 20px;
  background: var(--ui-bg-card);
  border-top: 1px solid var(--ui-stroke-tertiary);
}
.rw-hint {
  font-size: 11px;
  line-height: 1.45;
  color: var(--ui-text-tertiary);
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
  color: var(--ui-text-primary);
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--ui-stroke-secondary);
  border-radius: 8px;
  transition: color 120ms ease-out, background-color 120ms ease-out, border-color 120ms ease-out;
}
.rw-button:hover:not(:disabled) {
  background: var(--ui-control-hover-background);
}
.rw-button:disabled {
  cursor: default;
  opacity: 0.5;
}
.rw-primary {
  font-weight: 600;
  color: var(--dt-primary-foreground, #fcfcfc);
  background: var(--dt-primary, var(--ui-accent));
  border-color: transparent;
}
.rw-primary:hover:not(:disabled) {
  background: color-mix(in srgb, var(--dt-primary, var(--ui-accent)) 88%, var(--ui-base));
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
`;function He({ctx:e,session:t,event:o,onClose:d,onCreated:l}){let[u,D]=G(t.model??""),[c,M]=G(""),[b,v]=G(""),[i,I]=G(null),[k,$]=G(null),[q,z]=G(null),[U,A]=G(null),[h,y]=G(null),R=q!==null,J=Oe(null),Y=Oe(()=>{});be(()=>{let a=document.activeElement;return J.current?.focus(),()=>{a?.focus()}},[]),be(()=>{let a=m=>{if(m.key==="Escape"&&!R){d();return}if(m.key==="Tab"){mt(J.current,m);return}m.key==="Enter"&&(m.metaKey||m.ctrlKey)&&!R&&(m.preventDefault(),Y.current())};return window.addEventListener("keydown",a),()=>{window.removeEventListener("keydown",a)}},[R,d]),be(()=>{let a=b.trim();if(i===null||a===""){$(null);return}let m=!1,P=e.setTimeout(()=>{Le(e,i.branch_id,a).then(C=>{m||$(C)}).catch(()=>{m||$(null)})},dt);return()=>{m=!0,P()}},[e,i,b]);let f=async()=>{let a=await H.request("session.active_list",{}),m=Array.isArray(a.sessions)?a.sessions:[],P=m.find(C=>C.session_key===t.session_id)?.id??m.find(C=>C.id===t.session_id)?.id;if(P===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let C=await H.request("session.title",{session_id:P});return{runtimeId:P,storedId:C.session_key??t.stored_session_id}}catch{return{runtimeId:P,storedId:t.stored_session_id}}},S=async()=>{z("prepare"),A(null),y(null);try{let a=await f(),m=await Te(e,{session_id:t.session_id,stored_session_id:a.storedId,event_id:o.id,model:u.trim()||null,provider:null,prompt:c.trim()||null,verify_cmd:b.trim()||null});I(m),M(m.prompt),m.verify_presets.length>0&&b.trim()===""&&v(m.verify_presets[0]??""),m.model!==null&&D(m.model)}catch(a){A(T(a))}finally{z(null)}},F=async()=>{if(i!==null){z("run"),A(null),y(null);try{let a=await f(),m=a.runtimeId,P=`\u21BA ${t.title??j(t.session_id)} \xB7 ${j(i.branch_id)}`,C=null;if(m!==void 0)try{let w=await H.request("session.history",{session_id:m});C=ze(w.messages,i.fork_before_ts)}catch{C=null}let K,Q,ae=!1;if(C!==null&&m!==void 0){let w=await ie("could not branch the session",H.request("session.branch",{session_id:m,through_message_id:C}));K=w.session_id,Q=w.stored_session_id}else{let w={source:"desktop",title:P};i.worktree_path!==null&&(w.cwd=i.worktree_path),a.storedId!==null&&(w.parent_session_id=a.storedId);let X=await ie("could not create the branch session",H.request("session.create",w));K=X.session_id,Q=X.stored_session_id,ae=!0}if(ae&&i.worktree_path!==null){let w=()=>H.request("session.cwd.set",{session_id:K,cwd:i.worktree_path});try{await ie("could not attach the isolated workspace",w())}catch(X){throw X instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${T(X)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(u.trim()&&u.trim()!==(t.model??""))try{let w=await H.request("config.set",{key:"model",value:u.trim(),session_id:K,confirm_expensive_model:!1});w.confirm_required===!0&&y(w.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{y("The branch was created, but the model switch failed; the rerun uses the current model.")}let le=c.trim()||i.prompt;await ie("could not record the branch",Ie(e,i.branch_id,{child_session_id:K,child_stored_session_id:Q,model:u.trim()||null,provider:null,prompt:le,verify_cmd:b.trim()||null})),await ie("could not start the rerun",H.request("prompt.submit",{session_id:K,text:le})),l(i.branch_id),H.openSession(Q,{intent:"tab"}),d()}catch(a){A(T(a))}finally{z(null)}}};Y.current=()=>{i===null?S():F()};let W=i===null?"not prepared":i.fidelity,E=i===null?"rw-badge rw-badge-idle":i.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return N("div",{className:"rw-overlay",onMouseDown:a=>{a.target===a.currentTarget&&!R&&d()},children:[p("style",{children:pt}),N("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:J,children:[N("header",{className:"rw-header",children:[N("div",{className:"rw-heading",children:[p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),N("div",{className:"rw-subtitle",children:[oe(o.ts)," \xB7 ",o.preview||"user turn"]})]}),p("button",{type:"button",className:"rw-close",onClick:d,disabled:R,"aria-label":"Close",children:"\xD7"})]}),N("div",{className:"rw-body",children:[U!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:U}):null,h!==null?p("div",{className:"rw-banner rw-banner-warn",role:"status",children:h}):null,N("section",{className:"rw-card",children:[N("div",{className:"rw-card-head",children:[p("span",{className:"rw-card-title",children:"Checkpoint"}),p("span",{className:E,children:W==="full"?"workspace ready":W})]}),N("div",{className:"rw-chips",children:[p("span",{className:"rw-chip",children:i===null?"carries \u2014":i.fork_row_count>0?`carries ${L(i.fork_row_count,"message")}`:"carries the context pack"}),N("span",{className:"rw-chip",children:["verify timeout ",i===null?"\u2014":`${i.verify_timeout_seconds}s`]}),i?.snapshot_commit?N("span",{className:"rw-chip",children:["snapshot ",i.snapshot_commit.slice(0,8)]}):null]}),i?.worktree_path?p("div",{className:"rw-path",children:i.worktree_path}):p("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),i!==null&&i.fidelity!=="full"?p("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,i!==null&&i.context_rows===null?p("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,i!==null&&t.ended_at!==null?p("div",{className:"rw-note rw-note-muted",children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}):null,i!==null&&i.fork_row_count===0&&t.ended_at===null?p("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),N("div",{className:"rw-grid",children:[N("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Model"}),p("input",{className:"rw-input",value:u,onChange:a=>{D(a.target.value)},placeholder:"provider/model"}),p("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),N("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:b,onChange:a=>{v(a.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(i?.verify_presets.length?i.verify_presets:ut).map(a=>p("button",{type:"button",className:"rw-preset",onClick:()=>{v(a)},disabled:R,children:a},a))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),k!==null&&k.command===b.trim()?p("span",{className:"rw-resolved",children:k.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${k.resolved}`}):null]})]}),N("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),p("textarea",{className:"rw-textarea",value:c,onChange:a=>{M(a.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),p("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),N("footer",{className:"rw-footer",children:[p("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),N("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:d,disabled:R,children:"Cancel"}),i===null?p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{S()},disabled:R,children:q==="prepare"?"Preparing...":"Prepare branch"}):p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{F()},disabled:R,children:q==="run"?"Forking...":"Fork & run"})]})]})]})]})}function he(e,t,o){let d=new Set(t.map(u=>u.id)),l=o.filter(u=>u.session_id===e&&!d.has(u.id));return[...t,...l]}import{Fragment as Ge,jsx as r,jsxs as s}from"react/jsx-runtime";var vt="[data-rw-confirm]";function Ve(){let e=document.activeElement;return e instanceof HTMLElement&&e.closest(vt)!==null}var bt=`
.rw-page :is(button, input, textarea, summary, [tabindex]):focus-visible {
  outline: 2px solid var(--ui-accent, #4f8cff);
  outline-offset: 1px;
}
.rw-page button:not(:disabled) {
  cursor: pointer;
}
.rw-note-warn {
  background: color-mix(in srgb, var(--ui-yellow) 8%, transparent);
  border-color: color-mix(in srgb, var(--ui-yellow) 30%, transparent);
}
.rw-confirm {
  background: color-mix(in srgb, var(--ui-red) 8%, transparent);
  border-color: color-mix(in srgb, var(--ui-red) 32%, transparent);
}
.rw-confirm-delete {
  color: var(--ui-red);
  border-color: color-mix(in srgb, var(--ui-red) 45%, transparent);
}
.rw-page button:disabled {
  cursor: not-allowed;
}
`,ht=new Set(["done","failed","cleaned","discarded"]);function yt(e){return de(Math.max(0,(e.work_ts-e.ts)*1e3))}function wt({event:e,selected:t,onSelect:o}){return s("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[r("span",{title:e.kind,className:`w-20 shrink-0 truncate uppercase ${We(e.kind,e.status)}`,children:Ue(e.kind)}),r("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),r("span",{className:"w-14 shrink-0 text-right font-mono",children:de(e.duration_ms)})]})}var _t=new Set(["api_request","llm_call"]);function kt({turn:e,expanded:t,events:o,loading:d,selectedEventId:l,onToggle:u,onFork:D,onSelectEvent:c}){let M=(o??[]).filter(v=>!_t.has(v.kind)),b=(o??[]).length-M.length;return s("div",{className:"border-b border-(--ui-stroke-tertiary) pb-1",children:[s("div",{className:"flex items-center gap-2",children:[s("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:u,"aria-expanded":t,children:[r("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),r("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:oe(e.ts)}),r("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),r("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:L(e.tool_calls,"tool")}),e.tool_errors>0?r("span",{className:"shrink-0 text-xs text-(--ui-red)",children:L(e.tool_errors,"error")}):null,r("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:yt(e)})]}),r("button",{type:"button",className:"shrink-0 rounded border border-(--ui-stroke-secondary) px-2 py-0.5 text-xs",onClick:D,children:"Rewind"})]}),t?r("div",{className:"flex flex-col gap-0.5 pb-1",children:d?r("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):s(Ge,{children:[M.map(v=>r(wt,{event:v,selected:l===v.id,onSelect:()=>{c(v)}},v.id)),b>0?s("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[L(e.api_requests,"model request")," \xB7",L(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Ue(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function We(e,t){return e==="tool_result"&&t==="error"?"text-(--ui-red)":e==="assistant_response"||e==="tool_result"?"text-(--ui-green)":e==="user_turn"?"text-(--ui-accent)":e==="tool_call"?"text-(--ui-purple)":e==="api_request"||e==="llm_call"?"text-(--ui-orange)":e==="compaction"?"text-(--ui-text-secondary)":"text-(--ui-text-tertiary)"}function Ke(e){return e==="done"?"text-(--ui-green)":e==="failed"?"text-(--ui-red)":e==="running"?"text-(--ui-accent)":"text-(--ui-text-tertiary)"}function Z({label:e,value:t}){return s("div",{className:"flex items-center justify-between gap-2",children:[r("span",{className:"text-(--ui-text-tertiary)",children:e}),r("span",{className:"font-mono tabular-nums",children:t})]})}function Nt({detail:e}){return e===null?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2 text-xs",children:[r("span",{className:`font-medium ${We(e.kind,e.status)}`,children:Ue(e.kind)}),s("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${de(e.duration_ms)}`:""]}),r("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-stroke-tertiary) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function St({ctx:e,branchId:t,refreshTick:o,onClose:d,onRefresh:l}){let[u,D]=x(null),[c,M]=x(null),[b,v]=x(!1),[i,I]=x(null),[k,$]=x(null),q=xt(null);V(()=>{let f=!1,S=null,F=async()=>{try{let E=await Pe(e,t);if(f)return!0;D(E),I(null);let a=E.branch.child_session_id;if(a!==null){let m=await Ce(e,E.branch.parent_session_id,a,E.branch.fork_before_ts);f||M(m)}else M(null);return ht.has(E.branch.state)}catch(E){return f||I(T(E)),!1}},W=async()=>{let E=await F();!f&&!E&&(S=e.setTimeout(()=>{W()},2500))};return W(),()=>{f=!0,S!==null&&S()}},[e,t,o]);let z=async()=>{v(!0),I(null);try{await $e(e,t),l()}catch(f){I(T(f))}finally{v(!1)}},U=async f=>{v(!0),I(null),$(null);try{await xe(e,t),l()}catch(S){I(T(S)),$(f)}finally{v(!1)}},A=async()=>{v(!0),I(null);try{let f=await De(e,t);f.uncommitted===0?(await xe(e,t),l()):$(f)}catch(f){I(T(f))}finally{v(!1)}};if(V(()=>{$(null)},[t]),V(()=>{if(k===null)return;let f=S=>{S.key==="Escape"&&Ve()&&$(null)};return window.addEventListener("keydown",f),()=>{window.removeEventListener("keydown",f)}},[k]),V(()=>{if(k===null)return;let f=document.activeElement;return q.current?.focus(),()=>{f instanceof HTMLElement&&f.focus()}},[k]),u===null)return r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let h=u.branch,y=u.run,R=y?.verify_exit??c?.right?.verify_exit??null,J=h.verify_cmd?h.worktree_path?void 0:"The workspace of this branch was cleaned.":"No verify command was recorded for this branch.",Y=h.worktree_path?void 0:"This branch has no workspace left to remove.";return s("div",{className:"flex flex-col gap-2",children:[s("div",{className:"flex items-center justify-between gap-2",children:[s("div",{className:"flex items-center gap-2 text-xs",children:[s("span",{className:"font-medium",children:["Branch ",j(h.id)]}),r("span",{className:`uppercase ${Ke(h.state)}`,children:h.state}),y!==null&&y.verify_exit!==null?s("span",{className:y.verify_exit===0?"text-(--ui-green)":"text-(--ui-red)",children:["verify ",ve(y.verify_exit)]}):null]}),s("div",{className:"flex items-center gap-2 text-xs",children:[r("button",{type:"button",className:"rounded border border-(--ui-stroke-secondary) px-2 py-1 disabled:opacity-50",title:J,onClick:()=>{z()},disabled:b||!h.verify_cmd||!h.worktree_path,children:"Verify"}),r("button",{type:"button",className:"rounded border border-(--ui-stroke-secondary) px-2 py-1 disabled:opacity-50",title:Y,onClick:()=>{A()},disabled:b||!h.worktree_path,children:"Cleanup"}),r("button",{type:"button",className:"rounded border border-(--ui-stroke-secondary) px-2 py-1",onClick:d,children:"Hide"})]})]}),u.shared_child?r("div",{className:"rw-note-warn rounded border p-2 text-xs text-(--ui-text-primary)",children:"Another branch claims this same rerun session, so the numbers below may describe a different fork. It was recorded before the session-id fix."}):null,i!==null?r("div",{className:"text-xs text-(--ui-red)",children:i}):null,k!==null?s("div",{className:"rw-confirm rounded border p-2 text-xs",ref:q,role:"alertdialog","aria-label":"Confirm workspace cleanup","data-rw-confirm":"true",tabIndex:-1,children:[r("div",{className:"mb-1 text-(--ui-text-primary)",children:qe(k.uncommitted)}),r("div",{className:"mb-2 break-all text-(--ui-text-tertiary)",children:k.worktree_path}),s("div",{className:"flex items-center gap-2",children:[r("button",{type:"button",className:"rw-confirm-delete rounded border px-2 py-1 disabled:opacity-50",onClick:()=>{U(k)},disabled:b,children:"Delete workspace"}),r("button",{type:"button",className:"rounded border border-(--ui-stroke-secondary) px-2 py-1",onClick:()=>{$(null)},children:"Cancel"})]})]}):null,c!==null?s("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[s("div",{className:"rounded border border-(--ui-stroke-tertiary) p-2",children:[s("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",c.left?.frozen_at?` \xB7 frozen ${oe(c.left.frozen_at)}`:""]}),r(Z,{label:"outcome",value:c.left===null?"not recorded":Me(c.left.outcome)}),r(Z,{label:"tokens",value:c.left===null?"n/a":se(c.left.tokens_in+c.left.tokens_out)}),r(Z,{label:"tool errors",value:c.left===null?"n/a":String(c.left.tool_errors)})]}),s("div",{className:"rounded border border-(--ui-stroke-tertiary) p-2",children:[r("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),r(Z,{label:"outcome",value:c.right===null?"not recorded":ce(c.right.outcome)}),r(Z,{label:"verify",value:R===null?"not run":ve(R)}),r(Z,{label:"tokens",value:c.right===null?"n/a":se(c.right.tokens_in+c.right.tokens_out)}),r(Z,{label:"tool errors",value:c.right===null?"n/a":String(c.right.tool_errors)})]}),s("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",c.verdict]})]}):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:h.state==="cleaned"||h.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),y!==null&&y.verify_out?r("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-stroke-tertiary) p-2 font-mono text-xs",children:y.verify_out}):null,u.prompt!==null?s("details",{className:"text-xs text-(--ui-text-tertiary)",children:[r("summary",{children:"Prompt"}),r("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:u.prompt})]}):null]})}function je({ctx:e}){let t=gt(ft.state.activeSessionId),[o,d]=x([]),[l,u]=x(null),[D,c]=x([]),[M,b]=x(!1),[v,i]=x(!1),[I,k]=x(null),[$,q]=x({}),[z,U]=x([]),[A,h]=x([]),[y,R]=x(null),[J,Y]=x(null),[f,S]=x(null),[F,W]=x(null),[E,a]=x(0),[m,P]=x(null),[C,K]=x(0),[Q,ae]=x(!1),[le,w]=x(!1),[X,ue]=x(null);V(()=>{let n=null,g=e.onEvent("*",()=>{n===null&&(n=e.setTimeout(()=>{n=null,K(O=>O+1)},1500))});return()=>{g(),n!==null&&n()}},[e]),V(()=>{if(f===null||F!==null)return;let n=g=>{g.key==="Escape"&&!Ve()&&S(null)};return window.addEventListener("keydown",n),()=>{window.removeEventListener("keydown",n)}},[f,F]),V(()=>{let n=!1,g=async()=>{try{let B=await ke(e);if(n)return;d(B),ae(!0),P(null),u(re=>re!==null&&B.some(pe=>pe.session_id===re)?re:t??B[0]?.session_id??null)}catch(B){n||P(T(B))}};g();let O=e.setInterval(()=>{g()},1e4);return()=>{n=!0,O()}},[e,t,E,C]),V(()=>{if(l===null){c([]),w(!1),b(!1),ue(null),U([]),h([]);return}let n=!1,g=async()=>{try{let[B,re,pe]=await Promise.all([ge(e,l),Re(e,l),Ee(e,l)]);if(n)return;c(et=>he(l,B.items,et)),b(B.has_more),w(!0),U(re),h(pe),ue(null),P(null)}catch(B){n||(w(!0),ue(T(B)))}};g();let O=e.setInterval(()=>{g()},1e4);return()=>{n=!0,O()}},[e,l,E,C]),V(()=>{if(y===null){Y(null);return}let n=!1;return Se(e,y).then(g=>{n||Y(g)}).catch(g=>{n||P(T(g))}),()=>{n=!0}},[e,y]);let _=o.find(n=>n.session_id===l)??null,ye=_!==null&&_.ended_at===null,Ye=ye&&_.session_id===t,te=l===null?[]:D.filter(n=>n.session_id===l),Qe=n=>{u(n.session_id),R(null),S(null),k(null),q({}),c([]),w(!1),b(!1),ue(null),U([]),h([])},me=()=>{a(n=>n+1)},Xe=n=>{if(I===n.id){k(null);return}k(n.id),$[n.id]===void 0&&Ne(e,n.session_id,n.seq,n.seq_to).then(g=>{q(O=>({...O,[n.id]:g}))}).catch(g=>{P(T(g))})},Ze=async()=>{let n=te[te.length-1];if(!(l===null||n===void 0)){i(!0);try{let g=await ge(e,l,n.seq);c(O=>he(l,g.items,O)),b(g.has_more)}catch(g){P(T(g))}finally{i(!1)}}};return s("div",{className:"rw-page flex h-full flex-col gap-3 p-3 text-sm",children:[r("style",{children:bt}),s("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-stroke-tertiary) pb-2",children:[s("div",{children:[r("div",{className:"text-base font-medium",children:"Session Rewind"}),r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),s("div",{className:"flex items-center gap-3 text-xs",children:[_!==null?r("span",{className:"text-(--ui-text-tertiary)",children:_.model??"unknown model"}):null,ye?s("span",{className:"flex items-center gap-1 text-(--ui-green)",children:[r("span",{className:"h-1.5 w-1.5 rounded-full bg-(--ui-green)"}),Ye?"live":"running"]}):null,r("button",{type:"button",className:"rounded border border-(--ui-stroke-secondary) px-2 py-1",onClick:me,children:"Refresh"})]})]}),m!==null?r("div",{className:"text-xs text-(--ui-red)",children:m}):null,s("div",{className:"flex min-h-0 flex-1 gap-3",children:[r("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-stroke-tertiary) pr-2",children:s("div",{className:"flex flex-col gap-1",children:[s("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:["Sessions",Q?r("span",{className:"ml-1",children:Ae(o.length,fe)}):null]}),Q?o.length===0?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):o.map(n=>s("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${l===n.session_id?"border-(--ui-accent)":"border-(--ui-stroke-secondary)"}`,onClick:()=>{Qe(n)},children:[s("span",{className:"flex items-center gap-1.5",children:[r("span",{className:`h-1.5 w-1.5 rounded-full ${n.ended_at===null?"bg-(--ui-green)":"bg-(--ui-text-tertiary)"}`}),r("span",{className:"truncate font-medium",children:n.title??j(n.session_id)})]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[n.model??"unknown model"," \xB7 ",L(n.event_count,"event")]}),s("span",{className:"truncate text-(--ui-text-tertiary)",children:[ce(n.outcome)," \xB7"," ",se(n.tokens_in+n.tokens_out)," tokens"]})]},n.session_id)):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]})}),s("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[_!==null?s("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-stroke-tertiary) pb-2",children:[s("div",{children:[s("div",{className:"flex items-center gap-2",children:[r("span",{className:"text-base font-medium",children:_.title??j(_.session_id)}),z.length>0?r("span",{className:"text-xs text-(--ui-text-tertiary)",children:L(z.length,"snapshot")}):null]}),s("div",{className:"text-xs text-(--ui-text-tertiary)",children:[_.model??"unknown model"," \xB7"," ",L(_.event_count,"event")," \xB7"," ",se(_.tokens_in+_.tokens_out)," tokens",_.ended_at===null?` \xB7 ${Fe(_.last_event_at)}`:""]})]}),r("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,A.length>0?s("div",{className:"flex max-h-24 flex-wrap items-center gap-1 overflow-y-auto",children:[r("span",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),r("span",{className:"text-xs text-(--ui-text-tertiary)",children:A.length}),A.map(n=>s("button",{type:"button",className:`flex items-center gap-2 rounded border px-2 py-1 text-xs ${f===n.id?"border-(--ui-accent)":"border-(--ui-stroke-secondary)"}`,onClick:()=>{S(n.id)},children:[r("span",{className:"font-mono",children:j(n.id)}),r("span",{className:`uppercase ${Ke(n.state)}`,children:n.state}),r("span",{className:"text-(--ui-text-tertiary)",children:n.fork_row_count>0?L(n.fork_row_count,"message"):"context pack"})]},n.id))]}):null,s("div",{className:"flex min-h-0 flex-1 gap-2",children:[r("div",{className:"min-w-0 flex-1 overflow-auto",children:_===null?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):le?te.length===0?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:Be(_.event_count,X)}):s(Ge,{children:[te.map(n=>r(kt,{turn:n,expanded:I===n.id,events:$[n.id]??null,loading:I===n.id&&$[n.id]===void 0,selectedEventId:y,onToggle:()=>{Xe(n)},onFork:()=>{_!==null&&W({session:_,event:n})},onSelectEvent:g=>{R(g.id)}},n.id)),M?r("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-stroke-secondary) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Ze()},disabled:v,children:v?"Loading...":"Load earlier turns"}):s("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[L(te.length,"turn")," \xB7 start of the recording"]})]}):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),r("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-stroke-tertiary) pl-2",children:r(Nt,{detail:J})})]})]})]}),f!==null?r("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-stroke-tertiary) pt-2",children:r(St,{ctx:e,branchId:f,refreshTick:E,onClose:()=>{S(null)},onRefresh:me})}):null,F!==null?r(He,{ctx:e,session:F.session,event:F.event,onClose:()=>{W(null)},onCreated:n=>{S(n),me()}}):null]})}import{jsx as Je}from"react/jsx-runtime";var $t={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{Rt.navigate(ee)};e.registerMany([{id:"page",area:Ct,data:{path:ee},render:()=>Je(je,{ctx:e})},{id:"nav",area:Tt,data:{path:ee,label:"Rewind",codicon:"history"}},{id:"palette-open",area:Pt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:Et,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:It.right,order:130,render:()=>Je(_e,{})}])}},ar=$t;export{ar as default};
