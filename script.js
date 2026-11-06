const products = [
 {id:1,name:"İç Saha Forması",category:"Forma",price:899,description:"Alaçatı'nın sarı lacivert renklerini taşıyan iç saha forması. Hafif ve rahat kumaşıyla maç gününde ve günlük kullanımda yanında.",images:["assets/forma-sari.png"],sizes:["S","M","L","XL","XXL"]},
 {id:2,name:"Deplasman Forması",category:"Forma",price:949,description:"Sarı lacivert çubuklu özel deplasman tasarımı. Ön ve arka görünümünü inceleyebilir, sana uygun bedeni seçebilirsin.",images:["assets/forma-cizgili.png","assets/forma-arka.png"],sizes:["S","M","L","XL","XXL"]},
 {id:3,name:"Sarı Taraftar Tişörtü",category:"Tişört",price:499,description:"Kulüp armasını günlük stiline taşı. Yumuşak dokulu, rahat kesimli sarı taraftar tişörtü.",images:["assets/tisort-sari.png"],sizes:["S","M","L","XL","XXL"]},
 {id:4,name:"Siyah Antrenman Tişörtü",category:"Tişört",price:549,description:"Antrenmanda ve günlük kullanımda tercih edebileceğin siyah tasarım. Sarı arma ve omuz detaylarıyla.",images:["assets/tisort-siyah.png"],sizes:["S","M","L","XL","XXL"]},
 {id:5,name:"Kapüşonlu Sweatshirt",category:"Sweatshirt",price:1099,description:"Lacivert gövde, sarı omuz şeritleri ve kulüp arması. Serin havalarda Alaçatı renkleri hep üzerinde.",images:["assets/hoodie.png"],sizes:["S","M","L","XL","XXL"]},
 {id:6,name:"Lacivert Taraftar Beresi",category:"Aksesuar",price:349,description:"Lacivert örgü dokusu ve ön bölümündeki Alaçatıspor armasıyla soğuk günlerde sarı lacivert ruhunu yanında taşı.",images:["assets/bere-lacivert.jpg"],sizes:["Standart"]},
 {id:7,name:"Lacivert Taraftar Şortu",category:"Aksesuar",price:499,description:"Lacivert zemin, sarı yan şeritler ve kulüp armasıyla günlük kullanım ve antrenman için taraftar şortu.",images:["assets/sort-lacivert.jpg"],sizes:["S","M","L","XL","XXL"]},
 {id:8,name:"Fermuarlı Taraftar Ceketi",category:"Sweatshirt",price:1299,description:"Lacivert fermuarlı ceket, sarı omuz şeritleri ve Alaçatıspor armasıyla tamamlandı. Serin havalar için sportif bir parça.",images:["assets/ceket-fermuar.jpg"],sizes:["S","M","L","XL","XXL"]}
];
const FREE_SHIPPING=1500;
let cart=[], selectedProduct=null, selectedSize=null;
const $=s=>document.querySelector(s);
const money=n=>n.toLocaleString("tr-TR")+" TL";
function showToast(message){const t=$("#toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1700)}
function openProduct(id){
 selectedProduct=products.find(p=>p.id===Number(id));selectedSize=null;
 $("#modalCategory").textContent=selectedProduct.category.toLocaleUpperCase("tr-TR")+" · ALAÇATI STORE";
 $("#modalName").textContent=selectedProduct.name;$("#modalPrice").textContent=money(selectedProduct.price);
 $("#modalDescription").textContent=selectedProduct.description;
 $("#sizeHint").textContent="Lütfen beden seç";$("#sizeOptions").querySelectorAll("button").forEach(b=>b.classList.remove("selected"));
 const main=$("#modalImage");main.src=selectedProduct.images[0];main.alt=selectedProduct.name;
 $("#modalThumbs").innerHTML=selectedProduct.images.length>1?selectedProduct.images.map((src,i)=>`<button type="button" class="${i===0?"active":""}" data-image-index="${i}" aria-label="${i===0?"Ön görünüm":"Arka görünüm"}"><img src="${src}" alt=""></button>`).join(""):"";
 $("#productModal").classList.add("open");$("#productModalBackdrop").classList.add("open");$("#productModal").setAttribute("aria-hidden","false");
}
function closeProduct(){ $("#productModal").classList.remove("open");$("#productModalBackdrop").classList.remove("open");$("#productModal").setAttribute("aria-hidden","true");}
$("#productGrid").addEventListener("click",e=>{const card=e.target.closest(".product-card");if(card)openProduct(card.dataset.id)});
$("#closeProductModal").addEventListener("click",closeProduct);$("#productModalBackdrop").addEventListener("click",closeProduct);
$("#sizeOptions").addEventListener("click",e=>{const b=e.target.closest("button[data-size]");if(!b)return;selectedSize=b.dataset.size;$("#sizeOptions").querySelectorAll("button").forEach(x=>x.classList.toggle("selected",x===b));$("#sizeHint").textContent="Seçilen beden: "+selectedSize});
$("#modalThumbs").addEventListener("click",e=>{const b=e.target.closest("button[data-image-index]");if(!b)return;const i=Number(b.dataset.imageIndex);$("#modalImage").src=selectedProduct.images[i];$("#modalThumbs").querySelectorAll("button").forEach(x=>x.classList.toggle("active",x===b))});
$("#modalAdd").addEventListener("click",()=>{if(!selectedSize){$("#sizeHint").textContent="Sepete eklemek için önce beden seçmelisin";return;}addToCart(selectedProduct.id,selectedSize);closeProduct();setCart(true)});
function addToCart(id,size){const p=products.find(x=>x.id===Number(id));const found=cart.find(x=>x.id===p.id&&x.size===size);if(found)found.qty++;else cart.push({...p,size,qty:1});renderCart();showToast(p.name+" sepete eklendi")}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+x.price*x.qty,0);
 $("#cartCount").textContent=count;$("#cartTotal").textContent=money(total);
 $("#cartItems").innerHTML=cart.length?cart.map(x=>`<div class="cart-row"><div class="cart-row-main"><img src="${x.images[0]}" alt=""><div><div class="cart-row-title">${x.name}</div><div class="cart-row-size">Beden: ${x.size} · ${money(x.price)}</div><div class="cart-row-controls"><button data-qty="-1" data-id="${x.id}" data-size="${x.size}" aria-label="Adedi azalt">−</button><b>${x.qty}</b><button data-qty="1" data-id="${x.id}" data-size="${x.size}" aria-label="Adedi artır">+</button><button class="remove-item" data-remove="1" data-id="${x.id}" data-size="${x.size}">Kaldır</button></div></div></div><strong>${money(x.price*x.qty)}</strong></div>`).join(""):'<p class="empty-cart">Sepetin şimdilik boş. Hadi renklerini seç!</p>';
 const remaining=Math.max(0,FREE_SHIPPING-total),percent=Math.min(100,total/FREE_SHIPPING*100);
 $("#shippingMessage").textContent=remaining?`Ücretsiz kargo için ${money(remaining)} kaldı`:"Ücretsiz kargo kazandın!";
 $("#shippingPercent").textContent=Math.round(percent)+"%";$("#shippingBar").style.width=percent+"%";
}
$("#cartItems").addEventListener("click",e=>{
 const qty=e.target.closest("[data-qty]"),remove=e.target.closest("[data-remove]");
 if(qty){const item=cart.find(x=>x.id===Number(qty.dataset.id)&&x.size===qty.dataset.size);item.qty+=Number(qty.dataset.qty);if(item.qty<=0)cart=cart.filter(x=>x!==item);renderCart()}
 if(remove){cart=cart.filter(x=>!(x.id===Number(remove.dataset.id)&&x.size===remove.dataset.size));renderCart()}
});
function setCart(open){$("#cartDrawer").classList.toggle("open",open);$("#cartOverlay").classList.toggle("open",open);$("#cartDrawer").setAttribute("aria-hidden",String(!open))}
$("#cartButton").addEventListener("click",()=>setCart(true));$("#closeCart").addEventListener("click",()=>setCart(false));$("#cartOverlay").addEventListener("click",()=>setCart(false));
$("#checkoutButton").addEventListener("click",()=>showToast(cart.length?"Bu demo mağazada gerçek sipariş alınmıyor":"Önce sepetine ürün ekle"));
$("#menuToggle").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));
$("#mainNav").addEventListener("click",e=>{if(e.target.tagName==="A")$("#mainNav").classList.remove("open")});
let activeCategory="Tümü";
function filterProducts(){const q=$("#searchInput").value.trim().toLocaleLowerCase("tr-TR");let visible=0;document.querySelectorAll(".product-card").forEach(card=>{const ok=(activeCategory==="Tümü"||card.dataset.category===activeCategory)&&card.dataset.name.toLocaleLowerCase("tr-TR").includes(q);card.hidden=!ok;if(ok)visible++});$("#noResults").hidden=visible!==0}
$("#filters").addEventListener("click",e=>{const btn=e.target.closest(".filter");if(!btn)return;activeCategory=btn.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===btn));filterProducts()});
$("#searchInput").addEventListener("input",filterProducts);
$("#themeToggle").addEventListener("click",()=>{document.body.classList.toggle("dark-mode");localStorage.setItem("alacati-theme",document.body.classList.contains("dark-mode")?"dark":"light")});
if(localStorage.getItem("alacati-theme")==="dark")document.body.classList.add("dark-mode");
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeProduct();setCart(false)}});
renderCart();
