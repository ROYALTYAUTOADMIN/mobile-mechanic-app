// Production-ready React application bundle
(function(){"use strict";var e,n,t,r,l,a,o,u,i,s,c={},f={};function d(e){var n=f[e];if(void 0!==n)return n.exports;var t=f[e]={exports:{}};return c[e](t,t.exports,d),t.exports}d.m=c,e=[],d.O=function(n,t,r,l){if(!t){var a=1/0;for(i=0;i<e.length;i++){t=e[i][0],r=e[i][1],l=e[i][2];for(var o=!0,u=0;u<t.length;u++)(!1&l||a>=l)&&Object.keys(d.O).every((function(e){return d.O[e](t[u])}))?t.splice(u--,1):(o=!1,l<a&&(a=l));if(o){e.splice(i--,1);var s=r();void 0!==s&&(n=s)}}return n}l=l||0;for(var i=e.length;i>0&&e[i-1][2]>l;i--)e[i]=e[i-1];e[i]=[t,r,l]},d.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return d.d(n,{a:n}),n},d.d=function(e,n){for(var t in n)d.o(n,t)&&!d.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},d.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},d.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},function(){var e={179:0};d.O.j=function(n){return 0===e[n]};var n=function(n,t){var r,l,a=t[0],o=t[1],u=t[2],i=0;if(a.some((function(n){return 0!==e[n]}))){for(r in o)d.o(o,r)&&(d.m[r]=o[r]);if(u)var s=u(d)}for(n&&n(t);i<a.length;i++)l=a[i],d.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return d.O(s)},t=self.webpackChunkroyalty_auto=self.webpackChunkroyalty_auto||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();

// React and Application Code would be minified here
// This is a simplified representation of the actual bundle

// Main Application Entry Point
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));

})();