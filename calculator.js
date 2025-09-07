const exprEl = document.getElementById('expr');
const resultEl = document.getElementById('result');
const keysEl = document.getElementById('keys');
const angleBadge = document.querySelector('.badge.mode');
const statusAngle = document.getElementById('status-angle');

let state = {
  expr: '',
  result: '0',
  angleMode: 'DEG',
  ans: 0,
  memory: 0,
  shift: false,
  alpha: false
};

function render(){
  exprEl.textContent = state.expr || '';
  resultEl.textContent = state.result;
  angleBadge.textContent = state.angleMode;
  statusAngle.textContent = "Angle: " + state.angleMode;
}

function insertToken(t){
  state.expr += t;
  render();
}
function backspace(){ state.expr = state.expr.slice(0,-1); render(); }
function clearAll(){ state.expr=''; state.result='0'; render(); }
function toggleAngle(){ state.angleMode = (state.angleMode==='DEG')?'RAD':'DEG'; render(); }

function factorial(n){ return n<=1?1:n*factorial(n-1); }
function nCr(n,r){ return factorial(n)/(factorial(r)*factorial(n-r)); }
function nPr(n,r){ return factorial(n)/factorial(n-r); }

function evaluateExpression(expr){
  let jsExpr = expr
    .replace(/÷/g,'/')
    .replace(/×/g,'*')
    .replace(/−/g,'-')
    .replace(/\^/g,'**')
    .replace(/π/g,'Math.PI')
    .replace(/\be\b/g,'Math.E')
    .replace(/Ans/g,state.ans)
    .replace(/√\(/g,'Math.sqrt(')
    .replace(/log\(/g,'Math.log10(')
    .replace(/ln\(/g,'Math.log(')
    .replace(/10\^\(/g,'Math.pow(10,')
    .replace(/e\^\(/g,'Math.exp(')
    .replace(/\|(.+?)\|/g,'Math.abs($1)')
    .replace(/Ran#/g,'Math.random()')
    .replace(/nCr\((\d+),(\d+)\)/g,(m,n,r)=>nCr(+n,+r))
    .replace(/nPr\((\d+),(\d+)\)/g,(m,n,r)=>nPr(+n,+r))
    .replace(/(\d+)!/g,(m,n)=>factorial(+n));

  if(state.angleMode==='DEG'){
    jsExpr = jsExpr
      .replace(/sin\(/g,'Math.sin(Math.PI/180*')
      .replace(/cos\(/g,'Math.cos(Math.PI/180*')
      .replace(/tan\(/g,'Math.tan(Math.PI/180*');
  }
  try{
    let val = Function('"use strict";return ('+jsExpr+')')();
    if(Number.isFinite(val)){
      state.ans = val;
      return val;
    }
    return "Error";
  }catch(e){ return "Error"; }
}

function calculate(){
  if(!state.expr) return;
  state.result = evaluateExpression(state.expr).toString();
  render();
}

// Memory functions
function memoryClear(){ state.memory=0; render(); }
function memoryRecall(){ insertToken(state.memory); }
function memoryAdd(){ state.memory += Number(state.result)||0; render(); }
function memorySubtract(){ state.memory -= Number(state.result)||0; render(); }

// Button handling
keysEl.addEventListener('click', e=>{
  const key = e.target.closest('button.key');
  if(!key) return;
  const text = key.dataset.text;
  const action = key.dataset.action;

  if(action==='shift'){ state.shift=!state.shift; return; }
  if(action==='alpha'){ state.alpha=!state.alpha; return; }
  if(action==='ac'){ clearAll(); return; }
  if(action==='del'){ backspace(); return; }
  if(action==='angle'){ toggleAngle(); return; }
  if(action==='equals'){ calculate(); return; }
  if(action==='mc'){ memoryClear(); return; }
  if(action==='mr'){ memoryRecall(); return; }
  if(action==='mplus'){ memoryAdd(); return; }
  if(action==='mminus'){ memorySubtract(); return; }

  let insert = text;
  if(state.shift && key.dataset.shift){
    insert = key.dataset.shift;
    state.shift=false;
  }else if(state.alpha && key.dataset.alpha){
    insert = key.dataset.alpha;
    state.alpha=false;
  }
  if(insert){ insertToken(insert); }
});

render();
