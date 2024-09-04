var P=Object.defineProperty;var U=Object.getOwnPropertyDescriptor;var O=Object.getOwnPropertyNames;var Q=Object.prototype.hasOwnProperty;var S=(o,e)=>{for(var s in e)P(o,s,{get:e[s],enumerable:!0})},j=(o,e,s,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of O(e))!Q.call(o,n)&&n!==s&&P(o,n,{get:()=>e[n],enumerable:!(t=U(e,n))||t.enumerable});return o};var k=o=>j(P({},"__esModule",{value:!0}),o);var B={};S(B,{createApiFetcher:()=>L,fetchf:()=>$});module.exports=k(B);async function C(o,e){if(!e)return o;let s=Array.isArray(e)?e:[e],t={...o};for(let n of s)t=await n(t);return t}async function w(o,e){if(!e)return o;let s=Array.isArray(e)?e:[e],t=o;for(let n of s)t=await n(t);return t}var b=class extends Error{response;request;config;status;statusText;constructor(e,s,t){super(e),this.name="ResponseError",this.message=e,this.status=t.status,this.statusText=t.statusText,this.request=s,this.config=s,this.response=t}};function E(o,e){if(!e)return o;if(e instanceof URLSearchParams){let a=e.toString();return o.includes("?")?`${o}&${a}`:a?`${o}?${a}`:o}let s=[],t=function(a,r){r=typeof r=="function"?r():r,r=r===null||r===void 0?"":r,s[s.length]=encodeURIComponent(a)+"="+encodeURIComponent(r)},n=(a,r)=>{let u,c,p;if(a)if(Array.isArray(r))for(u=0,c=r.length;u<c;u++)n(a+"["+(typeof r[u]=="object"&&r[u]?u:"")+"]",r[u]);else if(typeof r=="object"&&r!==null)for(p in r)n(a+"["+p+"]",r[p]);else t(a,r);else if(Array.isArray(r))for(u=0,c=r.length;u<c;u++)t(r[u].name,r[u].value);else for(p in r)n(p,r[p]);return s},i=n("",e).join("&").replace(/%5B%5D/g,"[]");return o.includes("?")?`${o}&${i}`:i?`${o}?${i}`:o}function x(o,e){return e?o.replace(/:[a-zA-Z]+/gi,s=>{let t=s.substring(1);return String(e[t]?e[t]:s)}):o}function H(o){if(o==null)return!1;let e=typeof o;if(e==="string"||e==="number"||e==="boolean")return!0;if(e!=="object")return!1;if(Array.isArray(o))return!0;if(Buffer.isBuffer(o)||o instanceof Date)return!1;let s=Object.getPrototypeOf(o);return s===Object.prototype||s===null||typeof o.toJSON=="function"}async function T(o){return new Promise(e=>setTimeout(()=>e(!0),o))}var D="application/json",f=class{requestInstance;baseURL="";timeout=3e4;rejectCancelled=!1;strategy="reject";method="get";flattenResponse=!1;defaultResponse=null;fetcher;logger;requestsQueue;retry={retries:0,delay:1e3,maxDelay:3e4,resetTimeout:!0,backoff:1.5,retryOn:[408,409,425,429,500,502,503,504],shouldRetry:async()=>!0};config={};constructor({fetcher:e=null,timeout:s=null,rejectCancelled:t=!1,strategy:n=null,flattenResponse:l=null,defaultResponse:i={},logger:a=null,...r}){this.fetcher=e,this.timeout=s??this.timeout,this.strategy=n||this.strategy,this.rejectCancelled=t||this.rejectCancelled,this.flattenResponse=l||this.flattenResponse,this.defaultResponse=i,this.logger=a||null,this.requestsQueue=new WeakMap,this.baseURL=r.baseURL||r.apiUrl||"",this.method=r.method||this.method,this.config=r,this.retry={...this.retry,...r.retry||{}},this.requestInstance=this.isCustomFetcher()?e.create({...r,baseURL:this.baseURL,timeout:this.timeout}):null}getInstance(){return this.requestInstance}buildConfig(e,s,t){let n=(t.method||this.method).toUpperCase(),l=n==="GET"||n==="HEAD",i=x(e,t.urlPathParams||this.config.urlPathParams),a=t.params||this.config.params,r=t.body||t.data||this.config.body||this.config.data,u=!!(s&&(l||r)),c;if(l||(c=r||s),this.isCustomFetcher())return{...t,method:n,url:i,params:u?s:a,data:c};let p=t.withCredentials||this.config.withCredentials?"include":t.credentials;delete t.data,delete t.withCredentials;let h=a||u?E(i,a||s):i,g=h.includes("://")?"":t.baseURL||this.baseURL;return c&&typeof c!="string"&&!(c instanceof URLSearchParams)&&H(c)&&(c=JSON.stringify(c)),{...t,credentials:p,body:c,method:n,url:g+h,headers:{Accept:D+", text/plain, */*","Content-Type":D+";charset=utf-8",...t.headers||this.config.headers||{}}}}processError(e,s){var t;this.isRequestCancelled(e)||((t=this.logger)!=null&&t.warn&&this.logger.warn("API ERROR",e),s.onError&&s.onError(e),this.config.onError&&this.config.onError(e))}async outputErrorResponse(e,s,t){let n=this.isRequestCancelled(e),l=t.strategy||this.strategy,i=typeof t.rejectCancelled<"u"?t.rejectCancelled:this.rejectCancelled;if(!(n&&!i)){if(l==="silent")await new Promise(()=>null);else if(l==="reject")return Promise.reject(e)}return this.outputResponse(s,t,e)}isRequestCancelled(e){return e.name==="AbortError"||e.name==="CanceledError"}isCustomFetcher(){return this.fetcher!==null}addCancelToken(e){if(typeof AbortController>"u")return console.error("AbortController unavailable."),{};if(typeof e.cancellable<"u"?e.cancellable:this.config.cancellable){let n=this.requestsQueue.get(e);n&&n.controller.abort()}let t=new AbortController;return this.requestsQueue.set(e,{controller:t}),{signal:t.signal}}setupTimeout(e,s){let t=typeof e.timeout<"u"?e.timeout:this.timeout;if(t>0){let n=this.requestsQueue.get(e)||{};if(n!=null&&n.timeoutId){if(!s)return;clearTimeout(n.timeoutId)}let l=setTimeout(()=>{var r;let i=this.requestsQueue.get(e);if(!i)return;let a=new Error(`${e.url} aborted due to timeout`);a.name="TimeoutError",a.code=23,(r=i==null?void 0:i.controller)==null||r.abort(a)},t);this.requestsQueue.set(e,{...n,timeoutId:l})}}async request(e,s=null,t=null){var q,I,A,F;let n=null,l=t||{},i=this.buildConfig(e,s,l),a={...this.addCancelToken(i),...i},{retries:r,delay:u,backoff:c,retryOn:p,shouldRetry:h,maxDelay:R,resetTimeout:g}={...this.retry,...(a==null?void 0:a.retry)||{}},y=0,m=u;for(;y<=r;)try{if(this.setupTimeout(i,g),a=await C(a,a==null?void 0:a.onRequest),a=await C(a,(q=this.config)==null?void 0:q.onRequest),this.isCustomFetcher())n=await this.requestInstance.request(a);else if(n=await globalThis.fetch(a.url,a),n.config=a,n.data=await this.parseData(n),!n.ok)throw new b(`${a.url} failed! Status: ${n.status||null}`,a,n);return n=await w(n,a==null?void 0:a.onResponse),n=await w(n,(I=this.config)==null?void 0:I.onResponse),this.outputResponse(n,a)}catch(d){if(y===r||!await h(d,y)||!(p!=null&&p.includes(((A=d==null?void 0:d.response)==null?void 0:A.status)||(d==null?void 0:d.status))))return this.processError(d,a),this.outputErrorResponse(d,n,a);(F=this.logger)!=null&&F.warn&&this.logger.warn(`Attempt ${y+1} failed. Retrying in ${m}ms...`),await T(m),m*=c,m=Math.min(m,R),y++}return this.outputResponse(n,a)}async parseData(e){var n;if(!(e!=null&&e.body))return null;let s=String(((n=e.headers)==null?void 0:n.get("Content-Type"))||"").split(";")[0],t;try{if(s.includes(D)||s.includes("+json"))t=await e.json();else if(s.includes("multipart/form-data"))t=await e.formData();else if(s.includes("application/octet-stream"))t=await e.blob();else if(s.includes("application/x-www-form-urlencoded"))t=await e.formData();else if(s.includes("text/"))t=await e.text();else try{t=await e.clone().json()}catch{t=await e.text()}}catch{t=null}return t}processHeaders(e){let s=e.headers;if(!s)return{};let t={};if(s instanceof Headers)s.forEach((n,l)=>{t[l]=n});else if(typeof s=="object"&&s!==null)for(let[n,l]of Object.entries(s))t[n.toLowerCase()]=l;return t}flattenData(e){return e&&typeof e=="object"&&typeof e.data<"u"&&Object.keys(e).length===1?this.flattenData(e.data):e}outputResponse(e,s,t=null){let n=typeof s.defaultResponse<"u"?s.defaultResponse:this.defaultResponse,l=typeof s.flattenResponse<"u"?s.flattenResponse:this.flattenResponse;if(!e)return l?n:{error:t,headers:null,data:n,config:s};t!==null&&(t==null||delete t.response,t==null||delete t.request,t==null||delete t.config);let i=e==null?void 0:e.data;return(i==null||typeof i=="object"&&Object.keys(i).length===0)&&(i=n),l?this.flattenData(i):this.isCustomFetcher()?e:{body:e.body,blob:e.blob,json:e.json,text:e.text,clone:e.clone,bodyUsed:e.bodyUsed,arrayBuffer:e.arrayBuffer,formData:e.formData,ok:e.ok,redirected:e.redirected,type:e.type,url:e.url,status:e.status,statusText:e.statusText,error:t,data:i,headers:this.processHeaders(e),config:s}}};function L(o){let e=o.endpoints,s=new f(o);function t(){return s.getInstance()}function n(r){return console.error(`${r} endpoint must be added to 'endpoints'.`),Promise.resolve(null)}async function l(r,u={},c={},p={}){let R={...e[r]};return await s.request(R.url,u,{...R,...p,urlPathParams:c})}function i(r){return r in a?a[r]:e[r]?a.request.bind(null,r):n.bind(null,r)}let a={config:o,endpoints:e,requestHandler:s,getInstance:t,request:l};return new Proxy(a,{get:(r,u)=>i(u)})}async function $(o,e={}){return new f(e).request(o,null,e)}0&&(module.exports={createApiFetcher,fetchf});
//# sourceMappingURL=index.js.map