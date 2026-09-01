const key="libracore-data";
let data=JSON.parse(localStorage.getItem(key)||"null")||{
 books:[
  {id:1,title:"Atomic Habits",author:"James Clear",category:"Self Development",status:"Available"},
  {id:2,title:"Clean Code",author:"Robert C. Martin",category:"Technology",status:"Available"},
  {id:3,title:"The Alchemist",author:"Paulo Coelho",category:"Fiction",status:"Borrowed"}
 ],
 members:[
  {id:1,name:"Ahmed Hassan",email:"ahmed@example.com",phone:"+252 61 0000000",joined:"2026-08-01"},
  {id:2,name:"Amina Ali",email:"amina@example.com",phone:"+252 62 0000000",joined:"2026-08-08"}
 ],
 transactions:[{book:"The Alchemist",member:"Amina Ali",action:"Borrowed",date:"2026-08-30"}]
};
function save(){localStorage.setItem(key,JSON.stringify(data))}
function render(){
 document.getElementById("totalBooks").textContent=data.books.length;
 document.getElementById("totalMembers").textContent=data.members.length;
 document.getElementById("borrowedCount").textContent=data.books.filter(x=>x.status==="Borrowed").length;
 document.getElementById("availableCount").textContent=data.books.filter(x=>x.status==="Available").length;
 const cats=[...new Set(data.books.map(x=>x.category))], cf=document.getElementById("categoryFilter"), old=cf.value;
 cf.innerHTML='<option value="">All categories</option>'+cats.map(c=>`<option>${c}</option>`).join("");cf.value=old;
 renderBooks();renderMembers();renderTransactions();populateSelects();
}
function renderBooks(){
 const q=document.getElementById("bookSearch").value.toLowerCase(), c=document.getElementById("categoryFilter").value;
 const rows=data.books.filter(b=>(!q||`${b.title} ${b.author} ${b.category}`.toLowerCase().includes(q))&&(!c||b.category===c));
 document.getElementById("booksBody").innerHTML=rows.map(b=>`<tr><td><b>${b.title}</b></td><td>${b.author}</td><td>${b.category}</td><td><span class="badge ${b.status.toLowerCase()}">${b.status}</span></td><td><button class="action" onclick="toggleBook(${b.id})">${b.status==="Available"?"Mark Borrowed":"Mark Available"}</button> <button class="action" onclick="deleteBook(${b.id})">Delete</button></td></tr>`).join("")||'<tr><td colspan="5">No books found.</td></tr>';
}
function renderMembers(){document.getElementById("membersBody").innerHTML=data.members.map(m=>`<tr><td><b>${m.name}</b></td><td>${m.email}</td><td>${m.phone}</td><td>${m.joined}</td><td><button class="action" onclick="deleteMember(${m.id})">Delete</button></td></tr>`).join("")}
function renderTransactions(){document.getElementById("transactionList").innerHTML=data.transactions.slice().reverse().map(t=>`<div class="tx"><b>${t.action}</b> — ${t.book} / ${t.member}<br><small>${t.date}</small></div>`).join("")||"No transactions yet."}
function populateSelects(){borrowBook.innerHTML=data.books.filter(b=>b.status==="Available").map(b=>`<option value="${b.id}">${b.title}</option>`).join("")||"<option>No available books</option>";borrowMember.innerHTML=data.members.map(m=>`<option value="${m.id}">${m.name}</option>`).join("")}
function openBookModal(){showForm("Add Book",[["title","Book title"],["author","Author"],["category","Category"]],vals=>{data.books.push({id:Date.now(),...vals,status:"Available"});save();render()})}
function openMemberModal(){showForm("Add Member",[["name","Full name"],["email","Email"],["phone","Phone"]],vals=>{data.members.push({id:Date.now(),...vals,joined:new Date().toISOString().slice(0,10)});save();render()})}
function showForm(title,fields,done){modal.classList.remove("hidden");modalTitle.textContent=title;entityForm.innerHTML=fields.map(f=>`<input name="${f[0]}" placeholder="${f[1]}" required>`).join("")+'<button class="primary">Save</button>';entityForm.onsubmit=e=>{e.preventDefault();const o=Object.fromEntries(new FormData(entityForm));done(o);closeModal()}}
function closeModal(){modal.classList.add("hidden")}
function toggleBook(id){const b=data.books.find(x=>x.id===id);b.status=b.status==="Available"?"Borrowed":"Available";save();render()}
function deleteBook(id){if(confirm("Delete this book?")){data.books=data.books.filter(x=>x.id!==id);save();render()}}
function deleteMember(id){if(confirm("Delete this member?")){data.members=data.members.filter(x=>x.id!==id);save();render()}}
function borrowBook(){const b=data.books.find(x=>x.id==borrowBook.value),m=data.members.find(x=>x.id==borrowMember.value);if(!b||!m)return;b.status="Borrowed";data.transactions.push({book:b.title,member:m.name,action:"Borrowed",date:new Date().toISOString().slice(0,10)});save();render()}
document.querySelectorAll(".sidebar nav a").forEach(a=>a.onclick=()=>{document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));document.querySelector(a.getAttribute("href")).classList.remove("hidden")});
resetData.onclick=()=>{localStorage.removeItem(key);location.reload()};render();
