// 실제 대조한 문서의 위치. 문서 원본·참여자 정보는 배포하지 않습니다.
export const REVIEW_DATE='2026.11.21';
const law='https://www.law.go.kr/lsInfoP.do?lsiSeq=253641';
const rule='https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lspttninfSeq=163309';
const directive='https://www.law.go.kr/LSW/flDownload.do?flSeq=164626763';
const S=(kind,text,url)=>({kind,text,url});
const manual=pages=>S('업무매뉴얼','2026.1 일반 업무매뉴얼 '+pages+'쪽');
const evaluation=items=>S('성과평가','2026 지표정의서 v2 '+items+' / 후속 수기검증 안내');
export function basisFor(type,a={}){
 if(type==='space'||type==='success'&&a.successTopic==='space')return {id:'space',items:[manual('224~226·232'),S('법령','법 제17조·시행규칙 제13조',law)],limit:'공간 조건의 확인입니다. 지급대상·업종·실제 운영·기간은 별도입니다.'};
 if(type==='success'){
  const topic=a.successTopic;
  const pages=topic==='target'?'220':topic==='move'||['continuous','firstMove'].includes(a.successChange)?'107~108·222~224·227~230':topic==='wage'?'221~223·230·232':topic==='freelance'?'227·230~232':topic==='business'?'224~226·232':topic==='change'?'221~223·227~230':'220·230~232';
  return {id:'success:'+topic,items:[manual(pages),S('법령','법 제17조·제24조, 시행규칙 제13조',law)],limit:'공통 지급대상과 취업 시점도 맞아야 합니다. 표시된 조건만으로 지급결정이 완료되는 것은 아닙니다.'};
 }
 const pages={wage:'104~108·201',daily:'104·201',freelance:'44·105~108·201',business:'105·107·201',civil:'109·221~222',expiry:'90·103~104',direct:'17~18·109·166~167',pause:'95~101·202',return:'107~108'};
 if(type==='stop'){
  const byReason={welfare:'110·202',unemployment:'114',otherAllowance:'113·201',eligibility:'112~113',iap:'111·115~117',missing:'114~117',fraud:'113·115~117',voluntary:'114~117·202',transfer:'92~94',other:'115~117'};
  return {id:'stop:'+a.stopReason,items:[manual(byReason[a.stopReason]||'102~117'),S('법령','법 제11조·제12조·제27조·제29조 중 해당 사유, 시행규칙 제20조',rule)],limit:a.stopReason==='otherAllowance'?'지급기간 첫날 기준은 2026.10.14 시행 조문입니다. 이전 사건은 당시 법령을 확인합니다.':'사실확인·결정·서면통지는 고용센터 권한과 절차를 확인합니다.'};
 }
 if(type==='cash')return {id:'cash:'+a.cashReason,items:[manual('111~113·207~210'),S('법령','법 제21조·제26조·제29조 / 시행령 제9조의2·제11조',law)],limit:'활동 미이행 중단과 소득초과 정지는 합산하지 않습니다. 수당만 종료인지 서비스까지 종료인지 구분합니다.'};
 const items=[manual(pages[type]||'102~117')];
 if(type==='freelance')items.push(S('운영규정','제3조제3항(조정률). 특고·프리랜서 90% 적용은 매뉴얼 44쪽 실무기준',directive),evaluation('A3 / 수기검증 4-1·4-2'),S('위탁기관 인센티브','2026 민간위탁사업 업무매뉴얼 37쪽'));
 else if(type==='direct')items.push(S('운영규정','제8조(일경험 등 예외)',directive),S('직접일자리 지침','2026 중앙부처·자치단체 합동지침 4~6·32~33쪽','https://www.moel.go.kr/policy/policydata/view.do?bbs_seq=20260100470'));
 else if(type==='pause')items.push(S('법령','법 제11조·제29조제1항제5호 / 시행규칙 제6조',law));
 else if(type!=='return')items.push(S('법령','법 제29조 / 시행규칙 제20조',rule));
 if(['wage','business','civil','expiry'].includes(type))items.push(evaluation(type==='business'?'A2·A4·C1·F1':'A2·A3·B1~B4·C1·D1·F1'));
 return {id:type,items,limit:type==='return'?'서식23의 종료취소와 서식45의 이직통지는 서로 다른 절차입니다.':'행정상 종료·성과평가·기관 인센티브·참여자 취성수는 각각 확인합니다.'};
}

export function activityReminder(type,a={},r={}){
 if(type==='wage'&&a.hours==='full'||type==='freelance'&&r.status==='yes'||type==='business')return '해당 취·창업으로 적정하게 종료하면 그 취·창업이 포함된 회차의 구직활동 이행을 인정하는 기준이 있습니다. 소득·다른 지급조건도 확인하세요.';
 if(['wage','freelance'].includes(type)&&a.wish==='yes')return '본인 요청으로 불완전취업 종료를 하면, 이 취업만으로 구직활동을 모두 했다고 보지 않습니다. 해당 회차의 별도 활동을 확인하세요.';
 if(type==='civil'&&a.civilKind==='exam'&&a.finalPass==='yes')return '전일제 국가·지방직 최종합격은 발표일이 속한 회차의 구직활동 2회로 인정하는 특례입니다. 취성수 지급과는 별개입니다.';
 return '';
}

export function reentryReminder(type,a,r){
 if(r.status!=='yes'&&r.status!=='conditional')return null;
 if(type==='stop'&&a.stopReason==='fraud')return '부정행위 지급결정 취소 처분은 처분일부터 5년의 신청 제한을 확인합니다.';
 if(type==='stop'&&!['transfer','other'].includes(a.stopReason)&&!(a.stopReason==='welfare'&&a.welfare==='referred')&&!(a.stopReason==='eligibility'&&a.eligibility==='cash')||type==='pause'&&a.returnState==='late'||type==='cash'&&a.cashReason==='income')return '서비스가 실제로 종료되면 원칙적으로 종료일부터 3년간 재신청이 제한됩니다. 수당만 끝난 경우와 구분하세요.';
 if(type==='expiry')return '기간만료 종료는 원칙적으로 종료일부터 3년입니다. 종료 후 1년 경과 뒤 운영위원회 심의로 제한기간을 정하는 예외는 자동 적용되지 않습니다.';
 if(['wage','freelance','business','civil'].includes(type)||type==='direct'&&a.directContext==='joining'&&r.title.includes('중단·종료'))return a.wish==='yes'?'불완전취업 본인 희망종료는 근무기간에 따른 신청 제한 단축에서 제외하며 원칙적으로 종료일부터 3년입니다.':'취업·창업 또는 직접일자리 선정 종료는 인정기간이 6개월 미만이면 종료일부터 2년, 6개월 이상~1년 미만이면 1년6개월, 1년 이상이면 1년입니다. 취성수의 이직 합산 기준과 다르므로 실제 인정기간을 따로 확인하세요.';
 return null;
}
