import{mkdirSync,readdirSync,readFileSync,writeFileSync}from"node:fs";
import{join}from"node:path";
const I=process.env.MAKEFUN_INPUT_DIR??"/input",O=process.env.MAKEFUN_OUTPUT_DIR??"/output";
function run(p:Uint8Array,u:Uint8Array):{c:number,o:number[]}{
let D:number[]=[],C:number[]=[],M=new Int32Array(256),o:number[]=[],pc=0,ip=0,s=0;
for(;;){
if(s>=1e6)return{c:10,o};
if(pc<0||pc>=p.length)return{c:9,o};
let t=p[pc];
let ok=t==0||t==1||t==2||t==3||t==4||t==5||t==6||t==7||(t>=0x10&&t<=0x22)||(t>=0x30&&t<=0x34)||t==0x40||t==0x41||(t>=0x50&&t<=0x53);
if(!ok)return{c:5,o};
let L=t==1?1:t==2?4:(t==0x30||t==0x31||t==0x32||t==0x33)?2:0;
if(pc+1+L>p.length)return{c:9,o};
let a=0,b=0;
if(t==0x40){a=1;b=1}else if(t==0x41)a=2;
else if(t==3||t==0x31||t==0x32||t==0x50||t==0x51||t==0x53)a=1;
else if(t==4){a=1;b=2}else if(t==5){a=2;b=2}else if(t==6){a=2;b=3}else if(t==7){a=3;b=3}
else if(t>=0x10&&t<=0x22){a=t==0x17||t==0x1b?1:2;b=1}
else if(t==1||t==2||t==0x52)b=1;
if(D.length<a)return{c:2,o};
if(D.length-a+b>256)return{c:3,o};
let n=pc+1+L;
if(t==0)return{c:0,o};
if(t==1){D.push(p[pc+1]>127?p[pc+1]-256:p[pc+1]);pc=n;s++;continue}
if(t==2){D.push((p[pc+1]|p[pc+2]<<8|p[pc+3]<<16|p[pc+4]<<24)|0);pc=n;s++;continue}
if(t==3){D.pop();pc=n;s++;continue}
if(t==4){D.push(D[D.length-1]);pc=n;s++;continue}
if(t==5){let x=D[D.length-1];D[D.length-1]=D[D.length-2];D[D.length-2]=x;pc=n;s++;continue}
if(t==6){D.push(D[D.length-2]);pc=n;s++;continue}
if(t==7){let x=D[D.length-3],y=D[D.length-2],z=D[D.length-1];D[D.length-3]=y;D[D.length-2]=z;D[D.length-1]=x;pc=n;s++;continue}
if(t==0x17||t==0x1b){let x=D.pop()!;D.push(t==0x17?(-x)|0:~x);pc=n;s++;continue}
if(t>=0x10&&t<=0x22){
let y=D.pop()!,x=D.pop()!,r=0;
if((t==0x13||t==0x14||t==0x15||t==0x16)&&y==0)return{c:4,o};
if(t==0x10)r=(x+y)|0;else if(t==0x11)r=(x-y)|0;else if(t==0x12)r=Math.imul(x,y);
else if(t==0x13)r=x==-2147483648&&y==-1?-2147483648:Math.trunc(x/y)|0;
else if(t==0x14)r=(x%y)|0;
else if(t==0x15)r=Math.trunc((x>>>0)/(y>>>0))|0;
else if(t==0x16)r=((x>>>0)%(y>>>0))|0;
else if(t==0x18)r=x&y;else if(t==0x19)r=x|y;else if(t==0x1a)r=x^y;
else if(t==0x1c)r=x<<(y&31);else if(t==0x1d)r=x>>(y&31);else if(t==0x1e)r=(x>>>(y&31))|0;
else if(t==0x20)r=x==y?1:0;else if(t==0x21)r=x<y?1:0;else if(t==0x22)r=(x>>>0)<(y>>>0)?1:0;
D.push(r|0);pc=n;s++;continue}
if(t==0x30||t==0x31||t==0x32){
let f=(p[pc+1]|p[pc+2]<<8);f=f>=32768?f-65536:f;
if(t==0x30){pc=n+f;s++;continue}
let v=D.pop()!;
if((t==0x31&&v==0)||(t==0x32&&v!=0))pc=n+f;else pc=n;s++;continue}
if(t==0x33){if(C.length>=64)return{c:7,o};C.push(n);pc=p[pc+1]|p[pc+2]<<8;s++;continue}
if(t==0x34){if(C.length==0)return{c:8,o};pc=C.pop()!;s++;continue}
if(t==0x40){let d=D.pop()!;if(d<0||d>255)return{c:6,o};D.push(M[d]);pc=n;s++;continue}
if(t==0x41){let d=D.pop()!,v=D.pop()!;if(d<0||d>255)return{c:6,o};M[d]=v;pc=n;s++;continue}
if(t==0x50){let v=D.pop()!,q=String(v);if(o.length+q.length>65536)return{c:11,o};for(let i=0;i<q.length;i++)o.push(q.charCodeAt(i));pc=n;s++;continue}
if(t==0x51){let v=D.pop()!;if(o.length+1>65536)return{c:11,o};o.push(v&255);pc=n;s++;continue}
if(t==0x52){D.push(ip<u.length?u[ip++]:-1);pc=n;s++;continue}
if(t==0x53){let v=D.pop()!;return{c:v&255,o}}
return{c:5,o};
}}
for(let d of readdirSync(I).sort()){
let r=run(readFileSync(join(I,d,"program.bin")),readFileSync(join(I,d,"input.bin")));
mkdirSync(join(O,d),{recursive:true});
writeFileSync(join(O,d,"stdout.bin"),Buffer.from(r.o));
writeFileSync(join(O,d,"exit.txt"),String(r.c)+"\n");
}
