(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[337],{77880:function(n,r,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/work",function(){return t(4742)}])},98273:function(n,r,t){"use strict";t.d(r,{ZP:function(){return a},_i:function(){return u}});var e=t(8100),i=t(9669),s=t.n(i),c=t(34155).env.API_BASE||"https://pow.co",o=s().create({baseURL:c});function u(n){return o(n).then((function(n){return n.data}))}function a(n){var r=(0,e.ZP)("".concat(c).concat(n),u);return{data:r.data,error:r.error,refresh:r.mutate,loading:r.isValidating}}o.interceptors.response.use((function(n){return n}),(function(n){return Promise.reject(n.response&&n.response.data||"Something went wrong")}))},4742:function(n,r,t){"use strict";t.r(r);var e=t(85893),i=t(66242),s=t(86886),c=t(15861),o=t(78445),u=t(44267),a=t(98273);r.default=function(){var n=(0,a.ZP)("/api/v1/boost/work"),r=n.data,t=n.error;if(!r&&!t)return(0,e.jsx)(e.Fragment,{children:"Loading"});if(t)return(0,e.jsxs)("div",{children:[(0,e.jsx)("h2",{children:"Error"}),(0,e.jsx)("h5",{children:t})]});var d=r.work;return(0,e.jsx)(s.ZP,{container:!0,spacing:6,children:d.map((function(n){return(0,e.jsx)(s.ZP,{item:!0,xs:12,children:(0,e.jsxs)(i.Z,{children:[(0,e.jsx)(o.Z,{title:"".concat(n.timestamp)}),(0,e.jsxs)(u.Z,{children:[(0,e.jsxs)(c.Z,{sx:{mb:2},children:["job txid: ",n.job_txid]}),(0,e.jsxs)(c.Z,{sx:{mb:2},children:["work txid: ",n.spend_txid]}),(0,e.jsxs)(c.Z,{sx:{mb:2},children:["content: ",n.content]}),(0,e.jsxs)(c.Z,{sx:{mb:2},children:["difficulty: ",n.difficulty]}),(0,e.jsxs)(c.Z,{sx:{mb:2},children:["value: ",n.value]}),(0,e.jsxs)(c.Z,{sx:{mb:2},children:["tag: ",n.tag]})]})]})},n.txid)}))})}}},function(n){n.O(0,[993,774,888,179],(function(){return r=77880,n(n.s=r);var r}));var r=n.O();_N_E=r}]);