if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(i[c])return;let o={};const d=e=>n(e,c),t={module:{uri:c},exports:o,require:d};i[c]=Promise.all(s.map((e=>t[e]||d(e)))).then((e=>(r(...e),o)))}}define(["./workbox-5ffe50d4"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-DrLF21pA.js",revision:null},{url:"assets/index-WIkHTjlx.css",revision:null},{url:"index.html",revision:"10b501e0a7a28675a5bfceb36622e189"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"icons/16.png",revision:"a576b8d6b7cdb38f5528a691dc2e0670"},{url:"icons/180.png",revision:"5bbfcb9ecc97e0401eb188a3a1f25cfc"},{url:"icons/192.png",revision:"b8b7845998fa458d47da16f742b84b45"},{url:"icons/32.png",revision:"8a0734da33ed7e409493cd70dc3894e7"},{url:"icons/512.png",revision:"c87c5c38dbca2668a21545e8f39d8791"},{url:"manifest.webmanifest",revision:"1bd4884c4d22a7d698e05f99bac46200"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
