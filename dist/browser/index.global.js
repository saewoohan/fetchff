(()=>{async function P(o,e){if(!e)return o;let s=Array.isArray(e)?e:[e],t={...o};for(let n of s)t=await n(t);return t}async function C(o,e){if(!e)return o;let s=Array.isArray(e)?e:[e],t=o;for(let n of s)t=await n(t);return t}var b=class extends Error{response;request;config;status;statusText;constructor(e,s,t){super(e),this.name="ResponseError",this.message=e,this.status=t.status,this.statusText=t.statusText,this.request=s,this.config=s,this.response=t}};function F(o,e){if(!e)return o;if(e instanceof URLSearchParams){let r=e.toString();return o.includes("?")?`${o}&${r}`:r?`${o}?${r}`:o}let s=[],t=function(r,a){a=typeof a=="function"?a():a,a=a===null||a===void 0?"":a,s[s.length]=encodeURIComponent(r)+"="+encodeURIComponent(a)},n=(r,a)=>{let l,c,d;if(r)if(Array.isArray(a))for(l=0,c=a.length;l<c;l++)n(r+"["+(typeof a[l]=="object"&&a[l]?l:"")+"]",a[l]);else if(typeof a=="object"&&a!==null)for(d in a)n(r+"["+d+"]",a[d]);else t(r,a);else if(Array.isArray(a))for(l=0,c=a.length;l<c;l++)t(a[l].name,a[l].value);else for(d in a)n(d,a[d]);return s},i=n("",e).join("&").replace(/%5B%5D/g,"[]");return o.includes("?")?`${o}&${i}`:i?`${o}?${i}`:o}function E(o,e){return e?o.replace(/:[a-zA-Z]+/gi,s=>{let t=s.substring(1);return String(e[t]?e[t]:s)}):o}function x(o){if(o==null)return!1;let e=typeof o;if(e==="string"||e==="number"||e==="boolean")return!0;if(e!=="object")return!1;if(Array.isArray(o))return!0;if(Buffer.isBuffer(o)||o instanceof Date)return!1;let s=Object.getPrototypeOf(o);return s===Object.prototype||s===null||typeof o.toJSON=="function"}async function H(o){return new Promise(e=>setTimeout(()=>e(!0),o))}var w="application/json",f=class{requestInstance;baseURL="";timeout=3e4;rejectCancelled=!1;strategy="reject";method="get";flattenResponse=!1;defaultResponse=null;fetcher;logger;requestsQueue;retry={retries:0,delay:1e3,maxDelay:3e4,resetTimeout:!0,backoff:1.5,retryOn:[408,409,425,429,500,502,503,504],shouldRetry:async()=>!0};config={};constructor({fetcher:e=null,timeout:s=null,rejectCancelled:t=!1,strategy:n=null,flattenResponse:u=null,defaultResponse:i={},logger:r=null,...a}){this.fetcher=e,this.timeout=s??this.timeout,this.strategy=n||this.strategy,this.rejectCancelled=t||this.rejectCancelled,this.flattenResponse=u||this.flattenResponse,this.defaultResponse=i,this.logger=r||null,this.requestsQueue=new WeakMap,this.baseURL=a.baseURL||a.apiUrl||"",this.method=a.method||this.method,this.config=a,this.retry={...this.retry,...a.retry||{}},this.requestInstance=this.isCustomFetcher()?e.create({...a,baseURL:this.baseURL,timeout:this.timeout}):null}getInstance(){return this.requestInstance}buildConfig(e,s,t){let n=(t.method||this.method).toUpperCase(),u=n==="GET"||n==="HEAD",i=E(e,t.urlPathParams||this.config.urlPathParams),r=t.params||this.config.params,a=t.body||t.data||this.config.body||this.config.data,l=!!(s&&(u||a)),c;if(u||(c=a||s),this.isCustomFetcher())return{...t,method:n,url:i,params:l?s:r,data:c};let d=t.withCredentials||this.config.withCredentials?"include":t.credentials;delete t.data,delete t.withCredentials;let h=r||l?F(i,r||s):i,g=h.includes("://")?"":t.baseURL||this.baseURL;return c&&typeof c!="string"&&!(c instanceof URLSearchParams)&&x(c)&&(c=JSON.stringify(c)),{...t,credentials:d,body:c,method:n,url:g+h,headers:{Accept:w+", text/plain, */*","Content-Type":w+";charset=utf-8",...t.headers||this.config.headers||{}}}}processError(e,s){var t;this.isRequestCancelled(e)||((t=this.logger)!=null&&t.warn&&this.logger.warn("API ERROR",e),s.onError&&s.onError(e),this.config.onError&&this.config.onError(e))}async outputErrorResponse(e,s){let t=this.isRequestCancelled(e),n=s.strategy||this.strategy,u=typeof s.rejectCancelled<"u"?s.rejectCancelled:this.rejectCancelled,i=typeof s.defaultResponse<"u"?s.defaultResponse:this.defaultResponse;return n==="softFail"?this.outputResponse(e.response,s,e):t&&!u?i:n==="silent"?(await new Promise(()=>null),i):n==="reject"?Promise.reject(e):i}isRequestCancelled(e){return e.name==="AbortError"||e.name==="CanceledError"}isCustomFetcher(){return this.fetcher!==null}addCancelToken(e){if(typeof AbortController>"u")return console.error("AbortController unavailable."),{};let s=typeof e.cancellable<"u"?e.cancellable:this.config.cancellable;if(s){let n=this.requestsQueue.get(e);n&&n.controller.abort()}let t=new AbortController;return s&&this.requestsQueue.set(e,{controller:t}),{signal:t.signal}}setupTimeout(e,s){let t=typeof e.timeout<"u"?e.timeout:this.timeout;if(t>0){let n=this.requestsQueue.get(e)||{};if(n!=null&&n.timeoutId){if(!s)return;clearTimeout(n.timeoutId)}let u=setTimeout(()=>{var a;let i=this.requestsQueue.get(e);if(!i)return;let r=new Error(`${e.url} aborted due to timeout`);throw r.name="TimeoutError",r.code=23,(a=i==null?void 0:i.controller)==null||a.abort(r),this.requestsQueue.delete(e),r},t);this.requestsQueue.set(e,{...n,timeoutId:u})}}async request(e,s=null,t=null){var q,D,I,A;let n=null,u=t||{},i=this.buildConfig(e,s,u),r={...this.addCancelToken(i),...i},{retries:a,delay:l,backoff:c,retryOn:d,shouldRetry:h,maxDelay:R,resetTimeout:g}={...this.retry,...(r==null?void 0:r.retry)||{}},y=0,m=l;for(;y<=a;)try{if(this.setupTimeout(i,g),r=await P(r,r==null?void 0:r.onRequest),r=await P(r,(q=this.config)==null?void 0:q.onRequest),this.isCustomFetcher())n=await this.requestInstance.request(r);else if(n=await globalThis.fetch(r.url,r),n.config=r,n.data=await this.parseData(n),!n.ok)throw new b(`${r.url} failed! Status: ${n.status||null}`,r,n);return n=await C(n,r==null?void 0:r.onResponse),n=await C(n,(D=this.config)==null?void 0:D.onResponse),this.outputResponse(n,r)}catch(p){if(y===a||!await h(p,y)||!(d!=null&&d.includes(((I=p==null?void 0:p.response)==null?void 0:I.status)||(p==null?void 0:p.status))))return this.processError(p,r),this.outputErrorResponse(p,r);(A=this.logger)!=null&&A.warn&&this.logger.warn(`Attempt ${y+1} failed. Retrying in ${m}ms...`),await H(m),m*=c,m=Math.min(m,R),y++}return this.outputResponse(n,r)}async parseData(e){var n;if(!e.body)return null;let s=String(((n=e.headers)==null?void 0:n.get("Content-Type"))||"").split(";")[0],t;try{if(s.includes(w)||s.includes("+json"))t=await e.json();else if(s.includes("multipart/form-data"))t=await e.formData();else if(s.includes("application/octet-stream"))t=await e.blob();else if(s.includes("application/x-www-form-urlencoded"))t=await e.formData();else if(s.includes("text/"))t=await e.text();else try{t=await e.clone().json()}catch{t=await e.text()}}catch{t=null}return t}processHeaders(e){let s=e.headers;if(!s)return{};let t={};if(s instanceof Headers)s.forEach((n,u)=>{t[u]=n});else if(typeof s=="object"&&s!==null)for(let[n,u]of Object.entries(s))t[n.toLowerCase()]=u;return t}outputResponse(e,s,t=null){let n=typeof s.defaultResponse<"u"?s.defaultResponse:this.defaultResponse;return e?(s.flattenResponse||this.flattenResponse)&&typeof e.data<"u"?e.data!==null&&typeof e.data=="object"&&typeof e.data.data<"u"&&Object.keys(e.data).length===1?e.data.data:e.data:e!==null&&typeof e=="object"&&e.constructor===Object&&Object.keys(e).length===0?n:this.isCustomFetcher()?e:(t!==null&&(t==null||delete t.response,t==null||delete t.request,t==null||delete t.config),{body:e.body,blob:e.blob,json:e.json,text:e.text,clone:e.clone,bodyUsed:e.bodyUsed,arrayBuffer:e.arrayBuffer,formData:e.formData,ok:e.ok,redirected:e.redirected,type:e.type,url:e.url,status:e.status,statusText:e.statusText,error:t,data:e.data,headers:this.processHeaders(e),config:s}):n}};function M(o){let e=o.endpoints,s=new f(o);function t(){return s.getInstance()}function n(a){return console.error(`${a} endpoint must be added to 'endpoints'.`),Promise.resolve(null)}async function u(a,l={},c={},d={}){let R={...e[a]};return await s.request(R.url,l,{...R,...d,urlPathParams:c})}function i(a){return a in r?r[a]:e[a]?r.request.bind(null,a):n.bind(null,a)}let r={config:o,endpoints:e,requestHandler:s,getInstance:t,request:u};return new Proxy(r,{get:(a,l)=>i(l)})}async function _(o,e={}){return new f(e).request(o,null,e)}})();
//# sourceMappingURL=index.global.js.map