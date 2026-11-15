import {performanceGuide} from './performance-guide.mjs?v=7';
import {TYPES,nextStep,VERSION} from './simple-flow.mjs?v=7';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let type=null,topic='termination',answers={},history=[];
const activeType=()=>type==='business'&&topic==='space'?'space':type;
function evidence(g){return `<section class="evidence"><span class="section-label">${esc(g.label||'실적 인정과 받아둘 자료')}</span><h3>${esc(g.title)}</h3><p>${esc(g.scope)}</p><dl>${g.tasks.map(t=>`<div><dt>${esc(t.when)}</dt><dd>${esc(t.text)}</dd></div>`).join('')}</dl><details><summary>${g.label?'공통 지급대상·다른 지원금과의 관계':'실적에서 놓치기 쉬운 점'}</summary><p>${esc(g.caution)}</p><p>${esc(g.common)}</p></details>${(g.checks||[]).map(c=>`<details class="audit-check"><summary>${esc(c.title)}</summary><ul>${c.lines.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p class="evidence-source">근거: ${esc(c.source)}</p></details>`).join('')}<p class="evidence-source">근거: ${esc(g.source)}</p></section>`;}
const labels={yes:'취업·창업 종료 가능',conditional:'본인 요청 등 조건 확인',no:'해당 사유로 취업종료 아님',check:'확인 후 처리'};
function comparison(rows,title='세 경우를 구분하세요'){return `<section class="case-compare"><h3>${esc(title)}</h3><div class="table-wrap"><table><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>i===0?`<th scope="row">${esc(cell)}</th>`:`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></section>`;}
function render(){
 $('types').innerHTML=TYPES.map(t=>`<button type="button" class="type ${type===t.id?'active':''}" data-type="${t.id}" aria-pressed="${type===t.id}"><span>${t.icon}</span><div><b>${t.name}</b><small>${t.desc}</small></div><i>›</i></button>`).join('');
 const flow=nextStep(activeType(),answers),current=TYPES.find(t=>t.id===type);
 $('content').classList.toggle('selected',!!type);
 if(!type){$('content').innerHTML='<div class="start"><span class="start-mark">→</span><h2>유형을 선택하세요</h2><p>해당 유형에 필요한 질문만 확인하고<br>처리 가능 여부와 방법을 바로 안내합니다.</p><div class="start-tags"><span>유형 선택</span><span>필요한 질문</span><span>처리 안내</span></div></div>';return;}
 const tabs=type==='business'?`<div class="topic-tabs"><button id="terminationTopic" class="${topic==='termination'?'on':''}">창업종료 처리</button><button id="spaceTopic" class="${topic==='space'?'on':''}">창업공간 기준</button></div>`:'';
 const trail=history.map(h=>`<span>${esc(h.label)}</span>`).join('<i>›</i>');
 let main=`<div class="content-top"><span class="section-label">${esc(current.name)}</span><button type="button" id="restart">처음부터</button></div>${tabs}${trail?`<div class="trail">${trail}</div>`:''}`;
 if(flow.question){const q=flow.question;
  main+=`<div class="question"><p class="small-label">필요한 것만 확인할게요</p><h2>${esc(q.title)}</h2>${q.hint?`<p class="hint">${esc(q.hint)}</p>`:''}${q.comparison?comparison(q.comparison):''}${q.error?`<p class="input-error">${esc(q.error)}</p>`:''}${q.input?`<form id="amountForm" class="amount-form"><label for="grossAmount">월 세전 수입</label><div><input id="grossAmount" name="grossAmount" type="number" min="0" step="1" inputmode="numeric" placeholder="예: 2750000" value="${esc(answers.grossAmount??'')}"><span>원</span></div><button type="submit">90% 환산하고 처리방법 확인 →</button></form>`:''}<div class="choices">${q.options.map(o=>`<button type="button" data-answer="${esc(o.value)}" data-question="${q.id}"><span>${esc(o.label)}</span><b>→</b></button>`).join('')}</div></div>`;
 }else if(flow.result){const r=flow.result;
  main+=`<div class="decision ${r.status}"><div class="decision-label"><span class="status-dot"></span>${esc(r.scope||'처리 가능 여부')}</div>${r.calculation?`<p class="calculation">${esc(r.calculation)}</p>`:''}<h2>${esc(r.title)}</h2><p>${esc(r.why)}</p></div>${r.example?comparison(r.example.rows,r.example.title):''}<section class="method"><h3>이렇게 처리하세요</h3><ol>${r.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></section>${evidence(performanceGuide(activeType(),answers,r))}${type==='success'?'':`<details class="note"><summary>실제 종료할 때 공통 절차</summary><p>종료 근거·기준일·현재 단계(서비스/사후관리)를 확인하고 고용센터 결정 및 필요한 결재를 거칩니다. 수당만 종료되는 경우에는 서비스 전체를 마감하지 않습니다.</p><p>종료 결정 시 사실과 이유를 적은 서식 16 서면통지와 불복절차를 안내합니다. 불이익 처분은 사전통지·의견청취가 원칙이며, 기간만료·취창업·본인희망 등도 법정 예외와 분쟁 가능성을 개별 확인하여 생략 여부를 판단합니다.</p><p>유효한 고용24 구직신청은 전담상담사가 실제 취업경위에 맞게 처리합니다. 알선취업·외부구인정보 소개·컨설팅 후 취업·본인취업을 혼동하지 말고 사전 알선과 채용 근거를 대조합니다. 근거: 매뉴얼 115~117쪽.</p></details>`}${r.note?`<details class="note"><summary>이 경우에 알아둘 점</summary><p>${esc(r.note)}</p></details>`:''}<details class="source"><summary>근거 보기</summary><p>${esc(r.source)}</p>${r.sourceUrl?`<p><a href="${esc(r.sourceUrl)}" target="_blank" rel="noopener">공식 근거 확인 ↗</a></p>`:''}<p>제공된 2026년 업무매뉴얼과 확인한 현행 근거를 대조했습니다. 표시한 판단 범위의 처리방법을 안내합니다.</p></details>${type==='return'?'<button type="button" id="moveGuide" class="print">취성수 이직·전직 기준 확인 →</button>':''}${r.related==='return'?'<button type="button" id="continueGuide" class="print">단기퇴사 지속참여 방법 확인 →</button>':''}<button type="button" id="print" class="print">이 처리방법 인쇄</button>`;
 }
 if(history.length)main+='<button type="button" id="back" class="back">← 이전 질문으로</button>';
 $('content').innerHTML=main;
}
$('types').onclick=e=>{const b=e.target.closest('[data-type]');if(!b)return;type=b.dataset.type;topic='termination';answers={};history=[];render();};
$('content').onclick=e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.question){const q=nextStep(activeType(),answers).question;history.push({id:q.id,label:q.options.find(o=>o.value===b.dataset.answer).label});answers[q.id]=b.dataset.answer;render();}
 else if(b.id==='terminationTopic'||b.id==='spaceTopic'){topic=b.id==='spaceTopic'?'space':'termination';answers={};history=[];render();}
 else if(b.id==='moveGuide'){type='success';topic='termination';answers={successTopic:'move'};history=[{id:'successTopic',label:'이직·전직과 취성수'}];render();}
 else if(b.id==='continueGuide'){type='return';topic='termination';answers={};history=[];render();}
 else if(b.id==='restart'){type=null;topic='termination';answers={};history=[];render();}
 else if(b.id==='back'){const h=history.pop();delete answers[h.id];render();}
 else if(b.id==='print'){document.querySelectorAll('#content details').forEach(d=>d.open=true);window.print();}
};
$('content').addEventListener('submit',e=>{if(e.target.id!=='amountForm')return;e.preventDefault();const value=new FormData(e.target).get('grossAmount');const candidate={...answers,grossAmount:value};const f=nextStep(activeType(),candidate);answers=candidate;if(!f.question||f.question.id!=='grossAmount')history.push({id:'grossAmount',label:'세전 수입 '+Number(value).toLocaleString('ko-KR')+'원'});render();});
$('version').textContent=VERSION;
render();


