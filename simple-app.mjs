import {performanceGuide} from './performance-guide.mjs?v=9';
import {TYPES,nextStep} from './simple-flow.mjs?v=9';
import {EASY_TYPES,easyFlow,shortEvidence} from './easy-guide.mjs?v=9';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let type=null,topic='termination',answers={},history=[];
const activeType=()=>type==='business'&&topic==='space'?'space':type;
const currentFlow=()=>easyFlow(activeType(),answers,nextStep(activeType(),answers));
const list=items=>`<ul>${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
function comparison(rows,title){return `<section class="case-compare"><h3>${esc(title)}</h3><div class="table-wrap"><table><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>i===0?`<th scope="row">${esc(cell)}</th>`:`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;}
function detailsFor(r){
 const raw=r.original,g=performanceGuide(activeType(),answers,raw);
 const title=type==='freelance'?'특고 종료일을 정하는 방법·예외 확인':type==='success'?'수당을 받기 전에 확인할 조건·예외':'처리 전에 확인할 조건·예외';
 return `${g.comparison?comparison(g.comparison.rows,g.comparison.title):''}<section class="support"><h3>${type==='success'?'신청할 때 놓치지 마세요':'실적·자료에서 놓치지 마세요'}</h3>${list(shortEvidence(activeType(),answers,r))}</section>
 <details class="note"><summary>${title}</summary><p>${esc(raw.why)}</p>${list(raw.steps)}${raw.note?`<p>${esc(raw.note)}</p>`:''}${type!=='success'?'<p>실제 종료는 고용센터 결정과 필요한 결재를 확인하세요. 불이익 처분은 사전통지·의견청취가 원칙입니다. 종료 사실·이유를 적은 서면통지와 불복 안내도 필요합니다. 매뉴얼 115~117쪽의 예외·절차를 함께 확인하세요.</p>':''}</details>
 <details class="note"><summary>${type==='success'?'신청서류·공통 지급조건 자세히':'실적 인정·증빙자료 자세히'}</summary><h3>${esc(g.title)}</h3><p>${esc(g.scope)}</p><dl>${g.tasks.map(t=>`<dt>${esc(t.when)}</dt><dd>${esc(t.text)}</dd>`).join('')}</dl><p>${esc(g.caution)}</p><p>${esc(g.common)}</p>${(g.checks||[]).map(c=>`<details class="audit-check"><summary>${esc(c.title)}</summary>${list(c.lines)}<p>근거: ${esc(c.source)}</p></details>`).join('')}<p>근거: ${esc(g.source)}</p></details>
 <details class="source"><summary>매뉴얼·공식 근거 보기</summary><p>${esc(raw.source)}</p>${raw.sourceUrl?`<a href="${esc(raw.sourceUrl)}" target="_blank" rel="noopener">공식 자료 열기 ↗</a>`:''}</details>`;
}
function render(){
 $('types').innerHTML=TYPES.map(t=>{const [name,desc]=EASY_TYPES[t.id]||[t.name,t.desc];return `<button type="button" class="type ${type===t.id?'active':''}" data-type="${t.id}" aria-pressed="${type===t.id}"><span>${t.icon}</span><div><b>${esc(name)}</b><small>${esc(desc)}</small></div><i>›</i></button>`;}).join('');
 const flow=currentFlow();
 $('content').classList.toggle('selected',!!type);
 if(!type){$('content').innerHTML='<div class="start"><span class="start-mark">→</span><h2>지금 상담 중인 상황을 고르세요.</h2><p>필요한 것만 물어보고,<br>처리방법·날짜·받을 자료를 알려드립니다.</p><div class="start-tags"><span>상황 선택</span><span>짧은 질문</span><span>바로 처리 안내</span></div></div>';return;}
 const tabs=type==='business'?`<div class="topic-tabs"><button id="terminationTopic" class="${topic==='termination'?'on':''}">창업으로 끝내도 되나요?</button><button id="spaceTopic" class="${topic==='space'?'on':''}">취성수 받을 사업공간인가요?</button></div>`:'';
 const trail=history.map(h=>`<span>${esc(h.label)}</span>`).join('<i>›</i>');
 let main=`<div class="content-top"><span class="section-label">${esc(EASY_TYPES[type][0])}</span><button type="button" id="restart">다른 상황 보기</button></div>${tabs}${trail?`<div class="trail">${trail}</div>`:''}`;
 if(flow.question){
  const q=flow.question;
  main+=`<div class="question"><p class="small-label">이것만 확인해 주세요.</p><h2>${esc(q.title)}</h2>${q.hint?`<p class="hint">${esc(q.hint)}</p>`:''}${q.error?`<p class="input-error">${esc(q.error)}</p>`:''}${q.input?`<form id="amountForm" class="amount-form"><label for="grossAmount">세금·경비를 빼기 전 수입</label><div><input id="grossAmount" name="grossAmount" type="number" min="0" step="1" inputmode="numeric" placeholder="예: 2750000" value="${esc(answers.grossAmount??'')}"><span>원</span></div><button type="submit">계산하고 처리방법 보기 →</button></form>`:''}<div class="choices">${q.options.map(o=>`<button type="button" data-answer="${esc(o.value)}" data-question="${q.id}"><span>${esc(o.label)}</span><b>→</b></button>`).join('')}</div>${q.comparison?`<details class="question-extra"><summary>이직한 경우, 왜 처리방법이 다른가요?</summary>${comparison(q.comparison,'기간을 합치는 경우와 다시 세는 경우')}</details>`:''}</div>`;
 }else if(flow.result){
  const r=flow.result;
  main+=`<div class="decision ${r.status}"><div class="decision-label"><span class="status-dot"></span>이 경우에는 이렇게 하세요</div>${r.calculation?`<p class="calculation">${esc(r.calculation)}</p>`:''}<h2>${esc(r.title)}</h2><p>${esc(r.why)}</p></div>
  ${r.warning?`<p class="essential"><b>꼭 확인</b> ${esc(r.warning)}</p>`:''}
  <section class="quick-facts"><div><h3>${type==='success'?'언제부터 세나요?':'날짜는 어떻게 넣나요?'}</h3><p>${esc(r.date)}</p></div><div><h3>무엇을 받아두나요?</h3><p>${esc(r.papers)}</p></div></section>
  ${r.example?`<p class="hint">${r.example.title.startsWith('매뉴얼')?'매뉴얼 사례를 쉽게 풀어 쓴 예시입니다.':'이해를 돕기 위해 만든 예시입니다. 공식 판정 사례가 아닙니다.'}</p>${comparison(r.example.rows,r.example.title)}`:''}
  <section class="method"><h3>지금 할 일</h3><ol>${r.steps.slice(0,3).map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section>
  ${type==='return'?'<button type="button" id="moveGuide" class="next-guide">직장을 옮긴 뒤 취성수는 어떻게 되나요? →</button>':''}
  ${r.related==='return'?'<button type="button" id="continueGuide" class="next-guide">국취에 다시 참여하는 방법 보기 →</button>':''}
  ${detailsFor(r)}<button type="button" id="print" class="print">이 안내 인쇄</button>`;
 }
 if(history.length)main+='<button type="button" id="back" class="back">← 이전 질문으로</button>';
 $('content').innerHTML=main;
}
$('types').onclick=e=>{const b=e.target.closest('[data-type]');if(!b)return;type=b.dataset.type;topic='termination';answers={};history=[];render();};
$('content').onclick=e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.question){const q=currentFlow().question;history.push({id:q.id,label:q.options.find(o=>o.value===b.dataset.answer).label});answers[q.id]=b.dataset.answer;render();}
 else if(b.id==='terminationTopic'||b.id==='spaceTopic'){topic=b.id==='spaceTopic'?'space':'termination';answers={};history=[];render();}
 else if(b.id==='moveGuide'){type='success';topic='termination';answers={successTopic:'move'};history=[{id:'successTopic',label:'직장을 옮긴 경우'}];render();}
 else if(b.id==='continueGuide'){type='return';topic='termination';answers={};history=[];render();}
 else if(b.id==='restart'){type=null;topic='termination';answers={};history=[];render();}
 else if(b.id==='back'){const h=history.pop();delete answers[h.id];render();}
 else if(b.id==='print'){document.querySelectorAll('#content details').forEach(d=>d.open=true);window.print();}
};
$('content').addEventListener('submit',e=>{if(e.target.id!=='amountForm')return;e.preventDefault();const value=new FormData(e.target).get('grossAmount');const candidate={...answers,grossAmount:value};const f=nextStep(activeType(),candidate);answers=candidate;if(!f.question||f.question.id!=='grossAmount')history.push({id:'grossAmount',label:'세전 수입 '+Number(value).toLocaleString('ko-KR')+'원'});render();});
$('version').textContent='2026년 기준 · 2026.11.21 특고 소득·실적 구분 보완';
render();

