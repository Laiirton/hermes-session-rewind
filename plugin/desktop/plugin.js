import{host as pt,KEYBINDS_AREA as ft,PALETTE_AREA as gt,ROUTES_AREA as bt,SIDEBAR_NAV_AREA as xt,STATUSBAR_AREAS as ht}from"@hermes/plugin-sdk";import{host as xe,useValue as Ke}from"@hermes/plugin-sdk";var Z="/rewind";import{jsx as je,jsxs as We}from"react/jsx-runtime";function he(){let e=Ke(xe.state.activeSessionId);return We("button",{type:"button",className:"flex items-center gap-1",onClick:()=>{xe.navigate(Z)},title:"Open Session Rewind",children:[je("span",{className:`h-1.5 w-1.5 rounded-full ${e===null?"bg-(--ui-text-tertiary)":"bg-emerald-500"}`}),"Rewind"]})}import{host as nt,useValue as ot}from"@hermes/plugin-sdk";import{useEffect as ae,useState as f}from"react";function ne(e,t,o){return e.rest(t,{method:"POST",body:o})}async function ve(e){return(await e.rest("/sessions?limit=100")).items}async function pe(e,t,o=null){let a=o===null?"":`&before_seq=${o}`;return e.rest(`/sessions/${encodeURIComponent(t)}/turns?limit=40${a}`)}async function we(e,t,o,a){return(await e.rest(`/sessions/${encodeURIComponent(t)}/events?limit=200&after_seq=${o-1}&before_seq=${a+1}`)).items}function ye(e,t){return e.rest(`/events/${t}`)}function _e(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/snapshots`)}function ke(e,t){return e.rest(`/sessions/${encodeURIComponent(t)}/branches`)}function Ne(e,t){return ne(e,`/branches/${encodeURIComponent(t)}/reconcile`,{})}function Se(e,t,o,a=null){let l=a===null?"":`&before_ts=${a}`;return e.rest(`/compare?left=${encodeURIComponent(t)}&right=${encodeURIComponent(o)}${l}`)}function Re(e,t){return ne(e,"/forks/prepare",t)}function Pe(e,t,o){return ne(e,`/forks/${encodeURIComponent(t)}/commit`,o)}function Te(e,t){return ne(e,`/forks/${encodeURIComponent(t)}/verify`,{})}function Ce(e,t,o){return e.rest(`/branches/${encodeURIComponent(t)}/verify-resolve?cmd=${encodeURIComponent(o)}`)}function Ee(e,t){return ne(e,`/forks/${encodeURIComponent(t)}/cleanup`,{})}function oe(e){return new Date(e*1e3).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",second:"2-digit"})}function se(e){return e.toLocaleString()}function ue(e){return e===null?"":e<1e3?`${Math.round(e)}ms`:`${(e/1e3).toFixed(1)}s`}var Je=/Error invoking remote method '[^']+':\s*Error:\s*\d+:\s*(\{.*\})/s;function P(e){let t=e instanceof Error?e.message:typeof e=="string"?e:"Unexpected error",o=Je.exec(t),a=o?.[1];if(o===null||a===void 0)return t;let l=Ye(a);return l===void 0?t:t.replace(o[0],l)}function Ye(e){try{let t=JSON.parse(e);return typeof t.detail=="string"&&t.detail.length>0?t.detail:void 0}catch{return}}function j(e,t=8){return e.length<=t?e:e.slice(0,t)}function F(e,t){return`${e} ${e===1?t:`${t}s`}`}import{host as B,useTheme as Qe}from"@hermes/plugin-sdk";import{useEffect as fe,useRef as $e,useState as V}from"react";function Ge(e){if(typeof e.text=="string"&&e.text.trim())return e.text.trim();let t=e.content;return typeof t=="string"?t.trim():Array.isArray(t)?t.map(o=>{if(typeof o!="object"||o===null||!("text"in o))return"";let a=o.text;return typeof a=="string"?a:""}).join("").trim():""}function Ie(e,t){let o=(e??[]).filter(c=>(c.role==="user"||c.role==="assistant")&&Ge(c).length>0&&typeof c.row_id=="number"),a=-1;for(let c=0;c<o.length;c+=1){let w=o[c];if(w===void 0)continue;let m=w.timestamp;w.role==="user"&&typeof m=="number"&&m<=t+.5&&(a=c)}if(a<=0)return null;let l=o[a-1]?.row_id;return typeof l=="number"&&l>0?l:null}import{jsx as p,jsxs as x}from"react/jsx-runtime";var Xe=["python -m pytest -q","npm test","cargo test","go test ./..."],Ze=350;function ie(e,t){return t.catch(o=>{throw new Error(`${e}: ${P(o)}`)})}function et(e){if(e===null)return[];let t=e.querySelectorAll('button, input, textarea, [tabindex]:not([tabindex="-1"])');return Array.from(t).filter(o=>!o.hasAttribute("disabled"))}function tt(e,t){let o=et(e),a=o[0],l=o[o.length-1];if(e===null||a===void 0||l===void 0)return;let c=document.activeElement;if(!e.contains(c)){t.preventDefault(),a.focus();return}t.shiftKey&&c===a?(t.preventDefault(),l.focus()):!t.shiftKey&&c===l&&(t.preventDefault(),a.focus())}var rt=`
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
.rw-light {
  background: rgba(24, 26, 30, 0.32);
}
.rw-light .rw-panel {
  color: #1c1f24;
  background: #f6f7f9;
  border-color: rgba(0, 0, 0, 0.14);
  box-shadow: 0 24px 70px rgba(15, 18, 22, 0.24);
}
.rw-light .rw-header {
  border-bottom-color: rgba(0, 0, 0, 0.1);
}
.rw-light .rw-subtitle,
.rw-light .rw-card-title,
.rw-light .rw-chip,
.rw-light .rw-path,
.rw-light .rw-label,
.rw-light .rw-help,
.rw-light .rw-hint,
.rw-light .rw-badge-idle,
.rw-light .rw-resolved {
  color: rgba(28, 31, 36, 0.62);
}
.rw-light .rw-note.rw-note-muted {
  color: rgba(28, 31, 36, 0.62);
}
.rw-light .rw-close {
  color: rgba(28, 31, 36, 0.62);
  border-color: rgba(0, 0, 0, 0.14);
}
.rw-light .rw-close:hover:not(:disabled) {
  color: #1c1f24;
  background: rgba(0, 0, 0, 0.06);
}
.rw-light .rw-card {
  background: rgba(0, 0, 0, 0.035);
  border-color: rgba(0, 0, 0, 0.1);
}
.rw-light .rw-badge {
  border-color: rgba(0, 0, 0, 0.14);
}
.rw-light .rw-badge-ok {
  color: #1a7f37;
  background: rgba(26, 127, 55, 0.08);
  border-color: rgba(26, 127, 55, 0.32);
}
.rw-light .rw-badge-warn,
.rw-light .rw-note,
.rw-light .rw-banner-warn {
  color: #9a6700;
}
.rw-light .rw-banner-warn {
  background: rgba(154, 103, 0, 0.08);
  border-color: rgba(154, 103, 0, 0.3);
}
.rw-light .rw-banner-error {
  color: #cf222e;
  background: rgba(207, 34, 46, 0.07);
  border-color: rgba(207, 34, 46, 0.3);
}
.rw-light .rw-chip {
  border-color: rgba(0, 0, 0, 0.12);
}
.rw-light .rw-preset {
  color: rgba(28, 31, 36, 0.72);
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.14);
}
.rw-light .rw-preset:hover {
  color: #1c1f24;
  background: rgba(0, 0, 0, 0.05);
  border-color: #1f6feb;
}
.rw-light .rw-input,
.rw-light .rw-textarea {
  color: #1c1f24;
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.16);
}
.rw-light .rw-input:focus,
.rw-light .rw-textarea:focus {
  border-color: #1f6feb;
  box-shadow: 0 0 0 3px rgba(31, 111, 235, 0.22);
}
.rw-light .rw-footer {
  background: rgba(0, 0, 0, 0.03);
  border-top-color: rgba(0, 0, 0, 0.1);
}
.rw-light .rw-button {
  color: #1c1f24;
  border-color: rgba(0, 0, 0, 0.16);
}
.rw-light .rw-button:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.05);
}
.rw-light .rw-primary {
  color: #ffffff;
  background: #1f6feb;
}
.rw-light .rw-primary:hover:not(:disabled) {
  background: #1a63d8;
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
`;function De({ctx:e,session:t,event:o,onClose:a,onCreated:l}){let c=Qe().resolvedMode==="light",[w,m]=V(t.model??""),[T,C]=V(""),[g,A]=V(""),[s,U]=V(null),[I,_]=V(null),[N,h]=V(null),[M,L]=V(null),[$,v]=V(null),S=N!==null,z=$e(null),J=$e(()=>{});fe(()=>{let u=document.activeElement;return z.current?.focus(),()=>{u?.focus()}},[]),fe(()=>{let u=d=>{if(d.key==="Escape"&&!S){a();return}if(d.key==="Tab"){tt(z.current,d);return}d.key==="Enter"&&(d.metaKey||d.ctrlKey)&&!S&&(d.preventDefault(),J.current())};return window.addEventListener("keydown",u),()=>{window.removeEventListener("keydown",u)}},[S,a]),fe(()=>{let u=g.trim();if(s===null||u===""){_(null);return}let d=!1,E=e.setTimeout(()=>{Ce(e,s.branch_id,u).then(R=>{d||_(R)}).catch(()=>{d||_(null)})},Ze);return()=>{d=!0,E()}},[e,s,g]);let O=async()=>{let u=await B.request("session.active_list",{}),d=Array.isArray(u.sessions)?u.sessions:[],E=d.find(R=>R.session_key===t.session_id)?.id??d.find(R=>R.id===t.session_id)?.id;if(E===void 0)return{runtimeId:void 0,storedId:t.stored_session_id};try{let R=await B.request("session.title",{session_id:E});return{runtimeId:E,storedId:R.session_key??t.stored_session_id}}catch{return{runtimeId:E,storedId:t.stored_session_id}}},Y=async()=>{h("prepare"),L(null),v(null);try{let u=await O(),d=await Re(e,{session_id:t.session_id,stored_session_id:u.storedId,event_id:o.id,model:w.trim()||null,provider:null,prompt:T.trim()||null,verify_cmd:g.trim()||null});U(d),C(d.prompt),d.verify_presets.length>0&&g.trim()===""&&A(d.verify_presets[0]??""),d.model!==null&&m(d.model)}catch(u){L(P(u))}finally{h(null)}},ee=async()=>{if(s!==null){h("run"),L(null),v(null);try{let u=await O(),d=u.runtimeId,E=`\u21BA ${t.title??j(t.session_id)}`,R=null;if(d!==void 0)try{let k=await B.request("session.history",{session_id:d});R=Ie(k.messages,s.fork_before_ts)}catch{R=null}let H,Q,le=!1;if(R!==null&&d!==void 0){let k=await ie("could not branch the session",B.request("session.branch",{session_id:d,through_message_id:R}));H=k.session_id,Q=k.stored_session_id}else{let k={source:"desktop",title:E};s.worktree_path!==null&&(k.cwd=s.worktree_path),u.storedId!==null&&(k.parent_session_id=u.storedId);let q=await ie("could not create the branch session",B.request("session.create",k));H=q.session_id,Q=q.stored_session_id,le=!0}if(le&&s.worktree_path!==null){let k=()=>B.request("session.cwd.set",{session_id:H,cwd:s.worktree_path});try{await ie("could not attach the isolated workspace",k())}catch(q){throw q instanceof Error?new Error(`The rerun was not started because the isolated workspace could not be attached: ${P(q)}`):new Error("The rerun was not started because the isolated workspace could not be attached.")}}if(w.trim()&&w.trim()!==(t.model??""))try{let k=await B.request("config.set",{key:"model",value:w.trim(),session_id:H,confirm_expensive_model:!1});k.confirm_required===!0&&v(k.confirm_message??"The model switch needs confirmation; the branch continues with the current model.")}catch{v("The branch was created, but the model switch failed; the rerun uses the current model.")}let X=T.trim()||s.prompt;await ie("could not record the branch",Pe(e,s.branch_id,{child_session_id:H,child_stored_session_id:Q,model:w.trim()||null,provider:null,prompt:X,verify_cmd:g.trim()||null})),await ie("could not start the rerun",B.request("prompt.submit",{session_id:H,text:X})),l(s.branch_id),B.openSession(Q,{intent:"tab"}),a()}catch(u){L(P(u))}finally{h(null)}}};J.current=()=>{s===null?Y():ee()};let G=s===null?"not prepared":s.fidelity,de=s===null?"rw-badge rw-badge-idle":s.fidelity==="full"?"rw-badge rw-badge-ok":"rw-badge rw-badge-warn";return x("div",{className:c?"rw-overlay rw-light":"rw-overlay",onMouseDown:u=>{u.target===u.currentTarget&&!S&&a()},children:[p("style",{children:rt}),x("div",{className:"rw-panel",role:"dialog","aria-modal":"true","aria-labelledby":"rw-title",tabIndex:-1,ref:z,children:[x("header",{className:"rw-header",children:[x("div",{className:"rw-heading",children:[p("div",{className:"rw-title",id:"rw-title",children:"Rewind to this turn"}),x("div",{className:"rw-subtitle",children:[oe(o.ts)," \xB7 ",o.preview||"user turn"]})]}),p("button",{type:"button",className:"rw-close",onClick:a,disabled:S,"aria-label":"Close",children:"\xD7"})]}),x("div",{className:"rw-body",children:[M!==null?p("div",{className:"rw-banner rw-banner-error",role:"alert",children:M}):null,$!==null?p("div",{className:"rw-banner rw-banner-warn",role:"status",children:$}):null,x("section",{className:"rw-card",children:[x("div",{className:"rw-card-head",children:[p("span",{className:"rw-card-title",children:"Checkpoint"}),p("span",{className:de,children:G==="full"?"workspace ready":G})]}),x("div",{className:"rw-chips",children:[x("span",{className:"rw-chip",children:["history rows ",s===null?"\u2014":s.fork_row_count]}),x("span",{className:"rw-chip",children:["verify timeout ",s===null?"\u2014":`${s.verify_timeout_seconds}s`]}),s?.snapshot_commit?x("span",{className:"rw-chip",children:["snapshot ",s.snapshot_commit.slice(0,8)]}):null]}),s?.worktree_path?p("div",{className:"rw-path",children:s.worktree_path}):p("div",{className:"rw-note rw-note-muted",children:"Prepares an isolated worktree from the nearest snapshot. The original workspace is not changed."}),s!==null&&s.fidelity!=="full"?p("div",{className:"rw-note",children:"No workspace snapshot matched this turn. The rerun starts from the current workspace."}):null,s!==null&&s.context_rows===null?p("div",{className:"rw-note",children:"The live transcript prefix is unavailable. The context pack is the only context."}):null,s!==null&&t.ended_at!==null?p("div",{className:"rw-note rw-note-muted",children:"This session is closed, so the rerun starts a new chat carrying the recorded context instead of branching the original transcript."}):null,s!==null&&s.fork_row_count===0?p("div",{className:"rw-note rw-note-muted",children:"This is the first turn. The rerun starts a fresh chat in the restored workspace."}):null]}),x("div",{className:"rw-grid",children:[x("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Model"}),p("input",{className:"rw-input",value:w,onChange:u=>{m(u.target.value)},placeholder:"provider/model"}),p("span",{className:"rw-help",children:"Leave unchanged to keep the session model."})]}),x("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Verify command"}),p("input",{className:"rw-input",value:g,onChange:u=>{A(u.target.value)},placeholder:"python -m pytest -q"}),p("div",{className:"rw-chips",children:(s?.verify_presets.length?s.verify_presets:Xe).map(u=>p("button",{type:"button",className:"rw-preset",onClick:()=>{A(u)},disabled:S,children:u},u))}),p("span",{className:"rw-help",children:"Runs in the restored workspace with the gateway environment."}),I!==null&&I.command===g.trim()?p("span",{className:"rw-resolved",children:I.resolved===null?"Not found in the gateway environment. Use the full interpreter path.":`Resolves to ${I.resolved}`}):null]})]}),x("label",{className:"rw-field",children:[p("span",{className:"rw-label",children:"Prompt for the rerun"}),p("textarea",{className:"rw-textarea",value:T,onChange:u=>{C(u.target.value)},placeholder:"Prepare the branch to generate a context prompt, or write your own."}),p("span",{className:"rw-help",children:"Prepared from the recorded context. Edit it before running the fork."})]})]}),x("footer",{className:"rw-footer",children:[p("span",{className:"rw-hint",children:"The original session and workspace stay untouched. Ctrl+Enter runs the primary action."}),x("div",{className:"rw-actions",children:[p("button",{type:"button",className:"rw-button",onClick:a,disabled:S,children:"Cancel"}),s===null?p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{Y()},disabled:S,children:N==="prepare"?"Preparing...":"Prepare branch"}):p("button",{type:"button",className:"rw-button rw-primary",onClick:()=>{ee()},disabled:S,children:N==="run"?"Forking...":"Fork & run"})]})]})]})]})}function ge(e,t,o){let a=new Set(t.map(c=>c.id)),l=o.filter(c=>c.session_id===e&&!a.has(c.id));return[...t,...l]}import{Fragment as qe,jsx as r,jsxs as i}from"react/jsx-runtime";var st=new Set(["done","failed","cleaned","discarded"]);function it(e){return ue(Math.max(0,(e.last_ts-e.ts)*1e3))}function at(e,t){return t!==null?`The turns could not be loaded: ${t}`:e.event_count===0?"No user turns recorded yet for this session.":`The recording holds ${F(e.event_count,"event")} but no user turns came back. Choose Refresh.`}function lt({event:e,selected:t,onSelect:o}){return i("button",{type:"button",className:`flex w-full items-center gap-2 py-0.5 pl-19 text-left text-xs ${t?"bg-white/5":""}`,onClick:o,children:[r("span",{title:e.kind,className:`w-20 shrink-0 truncate uppercase ${Ae(e.kind,e.status)}`,children:Fe(e.kind)}),r("span",{className:"min-w-0 flex-1 truncate text-(--ui-text-tertiary)",children:e.name??e.preview}),r("span",{className:"w-14 shrink-0 text-right font-mono",children:ue(e.duration_ms)})]})}var ut=new Set(["api_request","llm_call"]);function dt({turn:e,expanded:t,events:o,loading:a,selectedEventId:l,onToggle:c,onFork:w,onSelectEvent:m}){let T=(o??[]).filter(g=>!ut.has(g.kind)),C=(o??[]).length-T.length;return i("div",{className:"border-b border-(--ui-border) pb-1",children:[i("div",{className:"flex items-center gap-2",children:[i("button",{type:"button",className:"flex min-w-0 flex-1 items-center gap-2 py-1 text-left",onClick:c,"aria-expanded":t,children:[r("span",{className:"w-3 shrink-0 text-xs text-(--ui-text-tertiary)","aria-hidden":"true",children:t?"\u25BE":"\u25B8"}),r("span",{className:"w-16 shrink-0 font-mono text-xs text-(--ui-text-tertiary)",children:oe(e.ts)}),r("span",{className:"min-w-0 flex-1 truncate",children:e.preview||"User turn"}),r("span",{className:"shrink-0 text-xs text-(--ui-text-tertiary)",children:F(e.tool_calls,"tool")}),e.tool_errors>0?r("span",{className:"shrink-0 text-xs text-red-500",children:F(e.tool_errors,"error")}):null,r("span",{className:"w-14 shrink-0 text-right font-mono text-xs text-(--ui-text-tertiary)",children:it(e)})]}),r("button",{type:"button",className:"shrink-0 rounded border border-(--ui-border) px-2 py-0.5 text-xs",onClick:w,children:"Rewind"})]}),t?r("div",{className:"flex flex-col gap-0.5 pb-1",children:a?r("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:"Loading events..."}):i(qe,{children:[T.map(g=>r(lt,{event:g,selected:l===g.id,onSelect:()=>{m(g)}},g.id)),C>0?i("div",{className:"pl-19 text-xs text-(--ui-text-tertiary)",children:[F(e.api_requests,"model request")," \xB7",F(e.event_count,"event")," ","in this turn"]}):null]})}):null]})}function Fe(e){switch(e){case"user_turn":return"user";case"assistant_response":return"reply";case"tool_call":return"tool";case"tool_result":return"result";case"api_request":return"request";case"llm_call":return"usage";case"session_start":return"start";case"session_end":return"end";case"compaction":return"compact";case"turn_end":return"turn";case"session_finalize":return"finalize";case"capture_dropped":return"dropped";default:return e}}function Ae(e,t){return e==="tool_result"&&t==="error"?"text-red-500":e==="assistant_response"||e==="tool_result"?"text-emerald-500":e==="user_turn"?"text-sky-500":e==="tool_call"?"text-violet-500":e==="api_request"||e==="llm_call"?"text-amber-500":e==="compaction"?"text-fuchsia-500":"text-(--ui-text-tertiary)"}function Me(e){return e==="done"?"text-emerald-500":e==="failed"?"text-red-500":e==="running"?"text-sky-500":"text-(--ui-text-tertiary)"}function W({label:e,value:t}){return i("div",{className:"flex items-center justify-between gap-2",children:[r("span",{className:"text-(--ui-text-tertiary)",children:e}),r("span",{className:"font-mono tabular-nums",children:t})]})}function ct({detail:e}){return e===null?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select an event to inspect its payload."}):i("div",{className:"flex flex-col gap-2",children:[i("div",{className:"flex items-center justify-between gap-2 text-xs",children:[r("span",{className:`font-medium ${Ae(e.kind,e.status)}`,children:Fe(e.kind)}),i("span",{className:"font-mono text-(--ui-text-tertiary)",children:["#",e.id," \xB7 seq ",e.seq]})]}),i("div",{className:"text-xs text-(--ui-text-tertiary)",children:[e.name??"event",e.status!==null?` \xB7 ${e.status}`:"",e.duration_ms!==null?` \xB7 ${ue(e.duration_ms)}`:""]}),r("pre",{className:"max-h-96 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:JSON.stringify(e.payload,null,2)})]})}function mt({ctx:e,branchId:t,refreshTick:o,onClose:a,onRefresh:l}){let[c,w]=f(null),[m,T]=f(null),[C,g]=f(!1),[A,s]=f(null);ae(()=>{let h=!1,M=null,L=async()=>{try{let v=await Ne(e,t);if(h)return!0;w(v),s(null);let S=v.branch.child_session_id;if(S!==null){let z=await Se(e,v.branch.parent_session_id,S,v.branch.fork_before_ts);h||T(z)}else T(null);return st.has(v.branch.state)}catch(v){return h||s(P(v)),!1}},$=async()=>{let v=await L();!h&&!v&&(M=e.setTimeout(()=>{$()},2500))};return $(),()=>{h=!0,M!==null&&M()}},[e,t,o]);let U=async()=>{g(!0),s(null);try{await Te(e,t),l()}catch(h){s(P(h))}finally{g(!1)}},I=async()=>{g(!0),s(null);try{await Ee(e,t),l()}catch(h){s(P(h))}finally{g(!1)}};if(c===null)return r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading branch..."});let _=c.branch,N=c.run;return i("div",{className:"flex flex-col gap-2",children:[i("div",{className:"flex items-center justify-between gap-2",children:[i("div",{className:"flex items-center gap-2 text-xs",children:[i("span",{className:"font-medium",children:["Branch ",j(_.id)]}),r("span",{className:`uppercase ${Me(_.state)}`,children:_.state}),N!==null&&N.verify_exit!==null?i("span",{className:N.verify_exit===0?"text-emerald-500":"text-red-500",children:["verify: ",N.verify_exit]}):null]}),i("div",{className:"flex items-center gap-2 text-xs",children:[r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{U()},disabled:C||!_.verify_cmd||!_.worktree_path,children:"Verify"}),r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1 disabled:opacity-50",onClick:()=>{I()},disabled:C||!_.worktree_path,children:"Cleanup"}),r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:a,children:"Hide"})]})]}),A!==null?r("div",{className:"text-xs text-red-500",children:A}):null,m!==null?i("div",{className:"grid grid-cols-2 gap-2 text-xs",children:[i("div",{className:"rounded border border-(--ui-border) p-2",children:[i("div",{className:"mb-1 text-(--ui-text-tertiary)",children:["Original",m.left?.frozen_at?` \xB7 frozen ${oe(m.left.frozen_at)}`:""]}),r(W,{label:"outcome",value:m.left?.outcome??"unknown"}),r(W,{label:"tokens",value:m.left===null?"n/a":se(m.left.tokens_in+m.left.tokens_out)}),r(W,{label:"tool errors",value:m.left===null?"n/a":String(m.left.tool_errors)})]}),i("div",{className:"rounded border border-(--ui-border) p-2",children:[r("div",{className:"mb-1 text-(--ui-text-tertiary)",children:"Rerun"}),r(W,{label:"outcome",value:m.right?.outcome??"running"}),r(W,{label:"verify",value:m.right?.verify_exit===null||m.right?.verify_exit===void 0?"not run":`exit ${m.right.verify_exit}`}),r(W,{label:"tokens",value:m.right===null?"n/a":se(m.right.tokens_in+m.right.tokens_out)}),r(W,{label:"tool errors",value:m.right===null?"n/a":String(m.right.tool_errors)})]}),i("div",{className:"col-span-2 text-(--ui-text-tertiary)",children:["Verdict: ",m.verdict]})]}):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:_.state==="cleaned"||_.state==="discarded"?"The rerun never started, and its workspace is gone.":"Waiting for the rerun to start."}),N!==null&&N.verify_out?r("pre",{className:"max-h-32 overflow-auto whitespace-pre-wrap break-words rounded border border-(--ui-border) p-2 font-mono text-xs",children:N.verify_out}):null,c.prompt!==null?i("details",{className:"text-xs text-(--ui-text-tertiary)",children:[r("summary",{children:"Prompt"}),r("pre",{className:"mt-1 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-xs",children:c.prompt})]}):null]})}function Le({ctx:e}){let t=ot(nt.state.activeSessionId),[o,a]=f([]),[l,c]=f(null),[w,m]=f([]),[T,C]=f(!1),[g,A]=f(!1),[s,U]=f(null),[I,_]=f({}),[N,h]=f([]),[M,L]=f([]),[$,v]=f(null),[S,z]=f(null),[J,O]=f(null),[Y,ee]=f(null),[G,de]=f(0),[u,d]=f(null),[E,R]=f(0),[H,Q]=f(!1),[le,X]=f(!1),[k,q]=f(null);ae(()=>e.onEvent("*",()=>{R(n=>n+1)}),[e]),ae(()=>{let n=!1,b=async()=>{try{let D=await ve(e);if(n)return;a(D),Q(!0),d(null),c(re=>re!==null&&D.some(me=>me.session_id===re)?re:t??D[0]?.session_id??null)}catch(D){n||d(P(D))}};b();let K=e.setInterval(()=>{b()},1e4);return()=>{n=!0,K()}},[e,t,G,E]),ae(()=>{if(l===null){m([]),X(!1),C(!1),q(null),h([]),L([]);return}let n=!1,b=async()=>{try{let[D,re,me]=await Promise.all([pe(e,l),_e(e,l),ke(e,l)]);if(n)return;m(Oe=>ge(l,D.items,Oe)),C(D.has_more),X(!0),h(re),L(me),q(null),d(null)}catch(D){n||(X(!0),q(P(D)))}};b();let K=e.setInterval(()=>{b()},1e4);return()=>{n=!0,K()}},[e,l,G,E]),ae(()=>{if($===null){z(null);return}let n=!1;return ye(e,$).then(b=>{n||z(b)}).catch(b=>{n||d(P(b))}),()=>{n=!0}},[e,$]);let y=o.find(n=>n.session_id===l)??null,be=y!==null&&y.ended_at===null,ze=be&&y.session_id===t,te=l===null?[]:w.filter(n=>n.session_id===l),He=n=>{c(n.session_id),v(null),O(null),U(null),_({})},ce=()=>{de(n=>n+1)},Ve=n=>{if(s===n.id){U(null);return}U(n.id),I[n.id]===void 0&&we(e,n.session_id,n.seq,n.seq_to).then(b=>{_(K=>({...K,[n.id]:b}))}).catch(b=>{d(P(b))})},Ue=async()=>{let n=te[te.length-1];if(!(l===null||n===void 0)){A(!0);try{let b=await pe(e,l,n.seq);m(K=>ge(l,b.items,K)),C(b.has_more)}catch(b){d(P(b))}finally{A(!1)}}};return i("div",{className:"flex h-full flex-col gap-3 p-3 text-sm",children:[i("header",{className:"flex items-center justify-between gap-3 border-b border-(--ui-border) pb-2",children:[i("div",{children:[r("div",{className:"text-base font-medium",children:"Session Rewind"}),r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Recorded locally. Fork a user turn, rerun it, and compare outcomes."})]}),i("div",{className:"flex items-center gap-3 text-xs",children:[y!==null?r("span",{className:"text-(--ui-text-tertiary)",children:y.model??"unknown model"}):null,be?i("span",{className:"flex items-center gap-1 text-emerald-500",children:[r("span",{className:"h-1.5 w-1.5 rounded-full bg-emerald-500"}),ze?"live":"running"]}):null,r("button",{type:"button",className:"rounded border border-(--ui-border) px-2 py-1",onClick:ce,children:"Refresh"})]})]}),u!==null?r("div",{className:"text-xs text-red-500",children:u}):null,i("div",{className:"flex min-h-0 flex-1 gap-3",children:[r("aside",{className:"flex w-64 shrink-0 flex-col gap-3 overflow-auto border-r border-(--ui-border) pr-2",children:i("div",{className:"flex flex-col gap-1",children:[r("div",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Sessions"}),H?o.length===0?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Start a chat and Rewind will record every turn."}):o.map(n=>i("button",{type:"button",className:`flex flex-col gap-0.5 rounded border px-2 py-1.5 text-left text-xs ${l===n.session_id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{He(n)},children:[i("span",{className:"flex items-center gap-1.5",children:[r("span",{className:`h-1.5 w-1.5 rounded-full ${n.ended_at===null?"bg-emerald-500":"bg-(--ui-text-tertiary)"}`}),r("span",{className:"truncate font-medium",children:n.title??j(n.session_id)})]}),i("span",{className:"truncate text-(--ui-text-tertiary)",children:[n.model??"unknown model"," \xB7 ",F(n.event_count,"event")]}),i("span",{className:"text-(--ui-text-tertiary)",children:[n.outcome??"recording"," \xB7"," ",se(n.tokens_in+n.tokens_out)," tokens"]})]},n.session_id)):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading sessions..."})]})}),i("main",{className:"flex min-w-0 flex-1 flex-col gap-2",children:[y!==null?i("div",{className:"flex items-start justify-between gap-2 border-b border-(--ui-border) pb-2",children:[i("div",{children:[i("div",{className:"flex items-center gap-2",children:[r("span",{className:"text-base font-medium",children:y.title??j(y.session_id)}),N.length>0?r("span",{className:"text-xs text-(--ui-text-tertiary)",children:F(N.length,"snapshot")}):null]}),i("div",{className:"text-xs text-(--ui-text-tertiary)",children:[y.model??"unknown model"," \xB7"," ",F(y.event_count,"event")," \xB7"," ",se(y.tokens_in+y.tokens_out)," tokens"]})]}),r("div",{className:"text-right text-xs text-(--ui-text-tertiary)",children:"Select a user turn and choose Rewind."})]}):null,M.length>0?i("div",{className:"flex max-h-24 flex-wrap items-center gap-1 overflow-y-auto",children:[r("span",{className:"text-xs uppercase text-(--ui-text-tertiary)",children:"Branches"}),M.map(n=>i("button",{type:"button",className:`flex items-center gap-2 rounded border px-2 py-1 text-xs ${J===n.id?"border-(--ui-accent)":"border-(--ui-border)"}`,onClick:()=>{O(n.id)},children:[r("span",{className:"font-mono",children:j(n.id)}),r("span",{className:`uppercase ${Me(n.state)}`,children:n.state}),i("span",{className:"text-(--ui-text-tertiary)",children:[n.fork_row_count," rows"]})]},n.id))]}):null,i("div",{className:"flex min-h-0 flex-1 gap-2",children:[r("div",{className:"min-w-0 flex-1 overflow-auto",children:y===null?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Select a recorded session."}):le?te.length===0?r("div",{className:"text-xs text-(--ui-text-tertiary)",children:at(y,k)}):i(qe,{children:[te.map(n=>r(dt,{turn:n,expanded:s===n.id,events:I[n.id]??null,loading:s===n.id&&I[n.id]===void 0,selectedEventId:$,onToggle:()=>{Ve(n)},onFork:()=>{y!==null&&ee({session:y,event:n})},onSelectEvent:b=>{v(b.id)}},n.id)),T?r("button",{type:"button",className:"mt-2 w-full rounded border border-(--ui-border) py-1 text-xs text-(--ui-text-tertiary)",onClick:()=>{Ue()},disabled:g,children:g?"Loading...":"Load earlier turns"}):i("div",{className:"mt-2 text-xs text-(--ui-text-tertiary)",children:[F(te.length,"turn")," \xB7 start of the recording"]})]}):r("div",{className:"text-xs text-(--ui-text-tertiary)",children:"Loading turns..."})}),r("div",{className:"w-80 shrink-0 overflow-auto border-l border-(--ui-border) pl-2",children:r(ct,{detail:S})})]})]})]}),J!==null?r("div",{className:"max-h-72 shrink-0 overflow-auto border-t border-(--ui-border) pt-2",children:r(mt,{ctx:e,branchId:J,refreshTick:G,onClose:()=>{O(null)},onRefresh:ce})}):null,Y!==null?r(De,{ctx:e,session:Y.session,event:Y.event,onClose:()=>{ee(null)},onCreated:n=>{O(n),ce()}}):null]})}import{jsx as Be}from"react/jsx-runtime";var vt={id:"session-rewind",name:"Rewind",defaultEnabled:!0,register(e){let t=()=>{pt.navigate(Z)};e.registerMany([{id:"page",area:bt,data:{path:Z},render:()=>Be(Le,{ctx:e})},{id:"nav",area:xt,data:{path:Z,label:"Rewind",codicon:"history"}},{id:"palette-open",area:gt,data:{id:"session-rewind.open",label:"Open Session Rewind",keywords:["rewind","checkpoint","time machine","fork"],run:t}},{id:"keybind-open",area:ft,data:{id:"session-rewind.open",label:"Open Session Rewind",category:"Rewind",defaults:["mod+alt+r"],run:t}},{id:"chip",area:ht.right,order:130,render:()=>Be(he,{})}])}},Jt=vt;export{Jt as default};
