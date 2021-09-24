#!/usr/bin/env node
var gt=Object.create;var $=Object.defineProperty,ut=Object.defineProperties,yt=Object.getOwnPropertyDescriptor,wt=Object.getOwnPropertyDescriptors,Dt=Object.getOwnPropertyNames,Me=Object.getOwnPropertySymbols,xt=Object.getPrototypeOf,Ae=Object.prototype.hasOwnProperty,Ct=Object.prototype.propertyIsEnumerable;var Re=(e,t,r)=>t in e?$(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,s=(e,t)=>{for(var r in t||(t={}))Ae.call(t,r)&&Re(e,r,t[r]);if(Me)for(var r of Me(t))Ct.call(t,r)&&Re(e,r,t[r]);return e},c=(e,t)=>ut(e,wt(t)),Et=e=>$(e,"__esModule",{value:!0});var Pt=(e,t,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Dt(t))!Ae.call(e,o)&&o!=="default"&&$(e,o,{get:()=>t[o],enumerable:!(r=yt(t,o))||r.enumerable});return e},i=e=>Pt(Et($(e!=null?gt(xt(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var mt=i(require("prompts")),dt=i(require("yargs"));var x=i(require("chalk")),st=i(require("path")),te=i(require("prompts")),f=i(require("tasuku")),C=i(require("typescript"));var ce=i(require("path")),Ge=i(require("esbuild"));var P=i(require("path")),F=i(require("fs-extra")),I=i(require("dotenv"));var $e=i(require("fs-extra"));async function T(e){try{return(await $e.default.stat(e)).isFile()}catch(t){return!1}}var vt=".env",ht=".env.production",Tt=".env.development";async function re(e){let t=process.cwd();if(e){let o=P.default.resolve(P.default.join(t,ht));if(await T(o))return I.default.parse(await F.default.readFile(o))}else{let o=P.default.resolve(P.default.join(t,Tt));if(await T(o))return I.default.parse(await F.default.readFile(o))}let r=P.default.resolve(P.default.join(t,vt));return await F.default.pathExists(r)?I.default.parse(await F.default.readFile(r)):{}}async function Ie(e){let t=await re(e),r={};return Object.keys(t).forEach(o=>{r[`process.env.${o}`]=JSON.stringify(t[o])}),r}var L=Ie(!0),J=Ie(!1);var _=i(require("path")),Le=i(require("fs-extra"));var bt={srcFile:"src/index.ts",target:"es2017",tsconfig:"tsconfig.json"},y=bt;function oe(e){return delete require.cache[e],require(e)}var Je=[".pridepackrc",".pridepack.json","pridepack.json","pridepack.config.json",".pridepack.config.json"],Ue=["pridepack.config.js","pridepack.js",".pridepack.config.js",".pridepack.js"],w;async function p(){if(w)return w;let e=process.cwd();for(let t=0;t<Je.length;t+=1){let r=_.default.resolve(_.default.join(e,Je[t]));if(await T(r)){let o=await Le.default.readJson(r);return w=c(s({},o),{srcFile:o.srcFile||y.srcFile,tsconfig:o.tsconfig||y.tsconfig,target:o.target||y.target}),w}}for(let t=0;t<Ue.length;t+=1){let r=_.default.resolve(_.default.join(e,Ue[t]));if(await T(r)){let o=oe(r);return w=c(s({},o),{srcFile:o.srcFile||y.srcFile,tsconfig:o.tsconfig||y.tsconfig,target:o.target||y.target}),w}}return w=y,w}var N=i(require("path"));var U;async function d(){if(U)return U;let e=process.cwd(),t=await p();return U={srcFile:N.default.resolve(N.default.join(e,t.srcFile)),tsconfig:N.default.resolve(N.default.join(e,t.tsconfig))},U}var Ve=i(require("module"));var Be=i(require("fs-extra"));var ie=i(require("path"));function O(e="."){return ie.default.resolve(ie.default.join(process.cwd(),e,"package.json"))}function l(e="."){return Be.default.readJson(O(e))}var B;async function u(){if(B)return B;let{dependencies:e,devDependencies:t,peerDependencies:r,optionalDependencies:o}=await l(),a=new Set;return Object.keys(e||{}).forEach(n=>{a.add(n)}),Object.keys(t||{}).forEach(n=>{a.add(n)}),Object.keys(r||{}).forEach(n=>{a.add(n)}),Object.keys(o||{}).forEach(n=>{a.add(n)}),B=[...Ve.builtinModules,...Array.from(a)],B}var We=i(require("path")),V=i(require("resolve.exports"));var Ye="dist/cjs",ae="production/index.js",ne="development/index.js",W=`${Ye}/${ae}`,se=`${Ye}/${ne}`;async function kt(e){var a;let t=await l(),r;try{r=(a=(0,V.resolve)(t,e?"./dev":".",{require:!0}))!=null?a:void 0}catch(n){r=void 0}if(r)return r;let o=(0,V.legacy)(t,{browser:!1,fields:["main"]});return o||(e?se:W)}async function b(e){let t=await kt(e);return We.default.dirname(t)}async function pe(){let e=await p(),t=await d(),r=await u(),o=ce.default.resolve(ce.default.join(process.cwd(),await b(!0),ne));return(0,Ge.build)({entryPoints:[t.srcFile],outfile:`${o}${e.jsx==="preserve"?"x":""}`,bundle:!0,minify:!1,platform:"node",sourcemap:!0,define:c(s({},await J),{"process.env.NODE_ENV":'"development"'}),external:r,target:e.target,tsconfig:t.tsconfig,jsx:e.jsx,jsxFactory:e.jsxFactory,jsxFragment:e.jsxFragment,logLevel:"silent",banner:{js:'"use strict";'},charset:"utf8",plugins:e.plugins,legalComments:"eof"})}var le=i(require("path")),qe=i(require("esbuild"));async function me(){let e=await p(),t=await d(),r=await u(),o=le.default.resolve(le.default.join(process.cwd(),await b(!1),ae));return(0,qe.build)({entryPoints:[t.srcFile],outfile:`${o}${e.jsx==="preserve"?"x":""}`,bundle:!0,minify:!0,platform:"node",sourcemap:!0,define:c(s({},await L),{"process.env.NODE_ENV":'"production"'}),external:r,target:e.target,tsconfig:t.tsconfig,jsx:e.jsx,jsxFactory:e.jsxFactory,jsxFragment:e.jsxFragment,logLevel:"silent",banner:{js:'"use strict";'},charset:"utf8",plugins:e.plugins,legalComments:"eof"})}var ue=i(require("path")),He=i(require("esbuild"));var ze=i(require("path")),Y=i(require("resolve.exports"));var Ke="dist/esm",de="production/index.js",fe="development/index.js",G=`${Ke}/${de}`,ge=`${Ke}/${fe}`;async function jt(e){var a;let t=await l(),r;try{r=(a=(0,Y.resolve)(t,e?"./dev":"."))!=null?a:void 0}catch(n){r=void 0}if(r)return r;let o=(0,Y.legacy)(t,{browser:!1,fields:["module"]});return o||(e?ge:G)}async function k(e){let t=await jt(e);return ze.default.dirname(t)}async function ye(){let e=await p(),t=await d(),r=await u(),o=ue.default.resolve(ue.default.join(process.cwd(),await k(!0),fe));return(0,He.build)({entryPoints:[t.srcFile],outfile:`${o}${e.jsx==="preserve"?"x":""}`,bundle:!0,minify:!1,platform:"node",format:"esm",sourcemap:!0,define:c(s({},await J),{"process.env.NODE_ENV":'"development"'}),external:r,target:e.target,tsconfig:t.tsconfig,jsx:e.jsx,jsxFactory:e.jsxFactory,jsxFragment:e.jsxFragment,logLevel:"silent",charset:"utf8",plugins:e.plugins,legalComments:"eof"})}var we=i(require("path")),Ze=i(require("esbuild"));async function De(){let e=await p(),t=await d(),r=await u(),o=we.default.resolve(we.default.join(process.cwd(),await k(!1),de));return(0,Ze.build)({entryPoints:[t.srcFile],outfile:`${o}${e.jsx==="preserve"?"x":""}`,bundle:!0,minify:!0,platform:"node",format:"esm",sourcemap:!0,define:c(s({},await L),{"process.env.NODE_ENV":'"production"'}),external:r,target:e.target,tsconfig:t.tsconfig,jsx:e.jsx,jsxFactory:e.jsxFactory,jsxFragment:e.jsxFragment,logLevel:"silent",charset:"utf8",plugins:e.plugins,legalComments:"eof"})}var D=i(require("path")),q=i(require("fs-extra"));var xe=i(require("path")),Xe=i(require("fs-extra"));var Qe={prepublish:"pridepack clean && pridepack build",build:"pridepack build","type-check":"pridepack check",lint:"pridepack lint",test:"pridepack test --passWithNoTests",clean:"pridepack clean",watch:"pridepack watch"},S={version:"0.0.0",types:"dist/types/index.d.ts",main:W,module:G,exports:{"./":{require:`./${W}`,import:`./${G}`},"./dev":{require:`./${se}`,import:`./${ge}`}},files:["dist","src"],engines:{node:">=10"},license:"MIT",keywords:["pridepack"]};async function Ce(e,t){let r=s({name:e},S),o=xe.default.resolve(xe.default.join(process.cwd(),t,"package.json"));await Xe.default.outputJSON(o,r,{spaces:2})}async function Ee(){var t,r;await q.default.remove(D.default.resolve(D.default.join(process.cwd(),await b()))),await q.default.remove(D.default.resolve(D.default.join(process.cwd(),await k())));let e=await l();await q.default.remove(D.default.resolve(D.default.join(process.cwd(),D.default.dirname((r=(t=e.types)!=null?t:S.types)!=null?r:""))))}var K=i(require("path")),rt=i(require("fs-extra")),H=i(require("typescript"));var tt=i(require("typescript"));var Pe=i(require("path")),et=i(require("fs-extra"));var z;async function Ft(){let e=await p();return Pe.default.resolve(Pe.default.join(process.cwd(),e.tsconfig))}async function ve(){if(z)return z;let e=await Ft();return z=await et.default.readJson(e),z}async function he(){let e=await ve();return tt.default.convertCompilerOptionsFromJson(e.compilerOptions,process.cwd()).options}async function Z(e=!0){var Oe,Se;let t=await l(),r=await he(),o=c(s({},r),{outDir:K.default.resolve(K.default.join(process.cwd(),K.default.dirname((Se=(Oe=t.types)!=null?Oe:S.types)!=null?Se:""))),emitDeclarationOnly:!e,moduleResolution:2,noEmit:e}),a=H.default.createCompilerHost(o),n=[];a.writeFile=(R,ft)=>{n.push({name:R,data:ft})};let g=await d(),m=H.default.createProgram([g.srcFile],o,a),h=m.emit();return await Promise.all(n.map(R=>rt.default.outputFile(R.name,R.data))),H.default.getPreEmitDiagnostics(m).concat(h.diagnostics)}var ot=i(require("path")),it=i(require("degit"));var _t="github:LyonInc/pridepack";async function X(e,t){let r=ot.default.resolve(process.cwd(),t);await(0,it.default)(`${_t}/templates/${e}`).clone(r)}var Te=i(require("path"));function be(){return Te.default.basename(Te.default.resolve(process.cwd()))}function ke(e){return e.toLowerCase().replace(/(^@.*\/)|((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g,"")}var A=i(require("path")),_e=i(require("execa"));var at=i(require("execa"));var M;async function je(){if(M)return M;try{await(0,at.default)("yarnpkg",["--version"]),M="yarn"}catch(e){M="npm"}return M}var j=["@types/jest","@types/node","eslint","eslint-config-lxsmnsyc","tslib","typescript","pridepack"],Nt={basic:{name:"basic",dependencies:[],peerDependencies:[],devDependencies:[...j]},"bot-discord":{name:"bot-discord",dependencies:["discord.js","dotenv"],peerDependencies:[],devDependencies:[...j]},react:{name:"react",dependencies:[],peerDependencies:[{name:"react",dev:"latest",peer:"^16.8.0 || ^17.0.0"},{name:"react-dom",dev:"latest",peer:"^16.8.0 || ^17.0.0"}],devDependencies:[...j,"@types/react","@testing-library/react","@testing-library/jest-dom","@testing-library/react-hooks","react-test-renderer"]},preact:{name:"preact",dependencies:[],peerDependencies:[{name:"preact",dev:"latest",peer:"^10.0.0"}],devDependencies:[...j,"@testing-library/preact","@testing-library/jest-dom","@testing-library/preact-hooks"]},vue:{name:"vue",dependencies:[],peerDependencies:[{name:"vue",dev:"next",peer:"^3.0.0"}],devDependencies:[...j,"@testing-library/vue@next","@testing-library/jest-dom"]},fastify:{name:"fastify",dependencies:["fastify"],peerDependencies:[],devDependencies:[...j]}},v=Nt;function Q(e){return new Promise(t=>{setTimeout(t,e,!0)})}var nt=i(require("fs-extra"));async function Fe(e,t="."){let r=await l(t),o={};if(r.devDependencies){let n=v[e].peerDependencies;Object.entries(r.devDependencies).forEach(([g,m])=>{n.forEach(h=>{typeof h=="object"?h.name===g&&(o[g]=h.peer):h===g&&(o[g]=m)})})}let a=c(s({},r),{peerDependencies:o,scripts:Qe});await nt.default.outputJson(O(t),a,{spaces:2})}function Ot(e,t){switch(e){case"npm":return["install",...t,"--save"];case"yarn":return["add",...t];default:return[]}}function St(e,t){switch(e){case"npm":return["install",...t,"--save-dev"];case"yarn":return["add",...t,"--dev"];default:return[]}}async function ee(e,t="."){await Q(100);let r=await je(),{dependencies:o}=v[e];o.length>0&&await(0,_e.default)(r,Ot(r,o),{cwd:A.default.resolve(A.default.join(process.cwd(),t))}),await Q(100);let{devDependencies:a,peerDependencies:n}=v[e],g=[...n.map(m=>typeof m=="object"?`${m.name}@${m.dev}`:m),...a];await(0,_e.default)(r,St(r,g),{cwd:A.default.resolve(A.default.join(process.cwd(),t))}),await Fe(e,t)}var Mt={[C.default.DiagnosticCategory.Error]:{symbol:"\u2716",color:"red"},[C.default.DiagnosticCategory.Message]:{symbol:"\u2714",color:"green"},[C.default.DiagnosticCategory.Suggestion]:{symbol:"\u2139",color:"cyan"},[C.default.DiagnosticCategory.Warning]:{symbol:"\u26A0",color:"yellow"}};function ct(e,t){let r=Mt[e];console.log(`${x.default.keyword(r.color)(r.symbol)} ${t}`)}function At(e){let t=e.text;if(e.location){let{location:r}=e,o=x.default.blue(r.file),a=x.default.yellow(r.line),n=x.default.yellow(r.column+1);return`${o} (${a}, ${n}): ${t}`}return t}function E(e,t){for(let r=0,o=t.length;r<o;r+=1)ct(e?C.default.DiagnosticCategory.Warning:C.default.DiagnosticCategory.Error,At(t[r]))}function Rt(e){let t=C.default.flattenDiagnosticMessageText(e.messageText,`
`);if(e.file&&e.start){let{line:r,character:o}=e.file.getLineAndCharacterOfPosition(e.start),a=st.default.relative(process.cwd(),e.file.fileName),n=x.default.blue(a),g=x.default.yellow(r+1),m=x.default.yellow(o+1);return`${n} (${g}, ${m}): ${t}`}return t}function pt(e){for(let t=0,r=e.length;t<r;t+=1)ct(e[t].category,Rt(e[t]))}async function lt(){return(0,te.default)({type:"select",name:"template",message:"Choose your template",choices:Object.keys(v).map(e=>({title:e,value:e})),initial:0})}async function $t(){let e=await(0,te.default)({type:"text",name:"name",message:"What's your package name?"}),t=ke(e.name),r=await lt();await(0,f.default)(`Copying from template '${r.template}'...`,async o=>{await X(r.template,t),o.setTitle(`Copied from template '${r.template}'!`)}),await(0,f.default)(`Installing dependencies from '${r.template}'...`,async o=>{await ee(r.template,t),o.setTitle(`Installed dependencies from '${r.template}'!`)})}async function It(){await(0,f.default)("Generating package.json...",async t=>{await Ce(be(),"."),t.setTitle("Generated package.json!")});let e=await lt();await(0,f.default)(`Copying from template '${e.template}'...`,async t=>{await X(e.template,"."),t.setTitle(`Copied from template '${e.template}'!`)}),await(0,f.default)(`Installing dependencies from '${e.template}'...`,async t=>{await ee(e.template),t.setTitle(`Installed dependencies from '${e.template}'!`)})}async function Lt(){await(0,f.default)("Cleaning build directory...",async e=>{await Ee(),e.setTitle("Cleaned!")})}async function Jt(){await(0,f.default)("Building CJS files...",async e=>{await e.task("Building development...",async({setTitle:t})=>{let r=await pe();E(!1,r.errors),E(!0,r.warnings),t("Built development!")}),await e.task("Building production...",async({setTitle:t})=>{let r=await me();E(!1,r.errors),E(!0,r.warnings),t("Built production!")}),e.setTitle("Built CJS files!")}),await(0,f.default)("Building ESM files...",async e=>{await e.task("Building development...",async({setTitle:t})=>{let r=await ye();E(!1,r.errors),E(!0,r.warnings),t("Built development!")}),await e.task("Building production...",async({setTitle:t})=>{let r=await De();E(!1,r.errors),E(!0,r.warnings),t("Built production!")}),e.setTitle("Built ESM files!")}),await(0,f.default)("Compiling types...",async e=>{let t=await Z(!1);pt(t),e.setTitle("Compiled types!")})}async function Ut(){await(0,f.default)("Compiling types...",async e=>{let t=await Z(!0);pt(t),e.setTitle("Compiled types!")})}async function Bt(){switch((await(0,te.default)({type:"select",name:"_",message:"Which command?",choices:[{title:"build",value:"build"},{title:"clean",value:"clean"},{title:"check",value:"check"},{title:"create",value:"create"},{title:"init",value:"init"},{title:"lint",value:"lint"},{title:"watch",value:"watch"}],initial:0}))._[0]){case"create":await $t();break;case"init":await It();break;case"clean":await Lt();break;case"build":await Jt();break;case"check":await Ut();break}}function Ne(){Bt().catch(e=>{console.error(e)})}var{argv:Vt}=dt.default.scriptName("pridepack").usage("Usage: $0 <command> [options]").command("build","Build the project directory.").command("create <name> [template]","Creates a Typescript package project.",e=>e.positional("name",{describe:"Name of the package",type:"string"}).positional("template",{describe:"Project template to be used",default:"basic",type:"string"})).command("init [template]","Initializes current directory as a Typescript package project.",e=>e.positional("template",{describe:"Project template to be used",default:"basic",type:"string"})).command("check","Performs typechecking").command("watch","Opts-in to watch mode for building.").command("clean","Cleans output directory.").command("test","Performs testing").command("lint","Performs linting",e=>e.option("files",{type:"array",description:"Pattern of files to lint"}).option("fix",{type:"boolean",description:"Automatically fix problems."}).option("cache",{type:"boolean",description:"Only check changed files."})).demandCommand(1).help();mt.default.override(Vt);Ne();
/**
 * @license
 * MIT License
 *
 * Copyright (c) 2021 Lyon Software Technologies, Inc.
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */