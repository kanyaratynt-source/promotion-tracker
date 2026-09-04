
let rows=[];

const file=document.getElementById("file");
const search=document.getElementById("search");
const status=document.getElementById("status");
const table=document.getElementById("tableBody");

file.addEventListener("change",async(e)=>{

const workbook=XLSX.read(await e.target.files[0].arrayBuffer());

const sheet=workbook.Sheets[workbook.SheetNames[0]];

rows=XLSX.utils.sheet_to_json(sheet,{defval:""});

render();

});

search.oninput=render;
status.onchange=render;

function getAmount(r){

return Number(
r["ยอดจ่าย"]||
r["Amount"]||
r["Incentive"]||
0
)||0;

}

function render(){

let data=[...rows];

if(search.value){

data=data.filter(r=>
(r["Customer Name"]||"")
.toLowerCase()
.includes(search.value.toLowerCase())
);

}

if(status.value){

data=data.filter(r=>
(r["Status"]||"Pending")==status.value
);

}

table.innerHTML="";

let total=0;
let paid=0;
const stores=new Set();

data.forEach(r=>{

const amount=getAmount(r);

total+=amount;

stores.add(r["Customer Name"]);

const st=(r["Status"]||"Pending");

if(st=="Finish") paid++;

table.innerHTML+=`
<tr>
<td>${r["Customer Name"]||"-"}</td>
<td>${r["ASM"]||"-"}</td>
<td>${r["Period"]||"-"}</td>
<td>฿${amount.toLocaleString()}</td>
<td>
<span class="badge ${
st=="Finish"?"finish":
st=="Pending"?"pending":
"processing"}">
${st}
</span>
</td>
</tr>`;

});

document.getElementById("amount").innerHTML="฿"+total.toLocaleString();

document.getElementById("paid").innerHTML=paid;

document.getElementById("pending").innerHTML=data.length-paid;

document.getElementById("shops").innerHTML=stores.size;

}
