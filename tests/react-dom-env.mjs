import {JSDOM} from 'jsdom';
const dom=new JSDOM('<!doctype html><html lang="ko"><head><title>React UI checks</title></head><body></body></html>',{url:'http://localhost',pretendToBeVisual:true});
for(const name of ['window','document','navigator','HTMLElement','HTMLFormElement','HTMLInputElement','HTMLButtonElement','Element','Node','NodeFilter','DocumentFragment','MutationObserver','CustomEvent','Event','MouseEvent','KeyboardEvent','FocusEvent'])Object.defineProperty(globalThis,name,{configurable:true,value:dom.window[name]});
globalThis.getComputedStyle=dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
