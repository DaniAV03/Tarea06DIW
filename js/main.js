// carga
document.addEventListener('DOMContentLoaded', () => {
  
  // boton subir
  const toTop = document.getElementById('toTop');
  if(toTop){
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 200);
    });
    toTop.onclick = () => window.scrollTo({top:0, behavior:'smooth'});
  }

  // notificacion simple
  function notify(msg, type='success'){
    const c = document.getElementById('notif');
    if(!c) return;
    const a = document.createElement('div');
    a.className = `alert alert-${type} alert-dismissible fade show`;
    a.innerHTML = `${msg}<button class="btn-close" data-bs-dismiss="alert"></button>`;
    c.appendChild(a);
    setTimeout(() => a.remove(), 4000);
  }

  // carrito con un local storage
  const CART = 'daw_cart';
  const getCart = () => JSON.parse(localStorage.getItem(CART) || '[]');
  const saveCart = (cart) => { localStorage.setItem(CART, JSON.stringify(cart)); updateCount(); };
  
  function updateCount(){
    const c = getCart(), el = document.getElementById('cart-count');
    if(el) el.textContent = `(${c.reduce((s,i)=>s+i.quantity,0)})`;
  }
  
  function addToCart(p){
    let cart = getCart(), ex = cart.find(i=>i.id===p.id);
    if(ex) ex.quantity++; else cart.push({...p, quantity:1});
    saveCart(cart); notify('Añadido al carrito');
    if(location.pathname.includes('carrito')) renderCart();
  }
  
  function removeFromCart(id){
    let cart = getCart().filter(i=>i.id!==id);
    saveCart(cart); notify('Eliminado','info');
    if(location.pathname.includes('carrito')) renderCart();
  }
  
  function renderCart(){
    const list = document.getElementById('cartList'), empty = document.getElementById('cartEmpty');
    if(!list) return;
    const cart = getCart();
    if(!cart.length){ empty?.classList.remove('d-none'); list.classList.add('d-none'); return; }
    empty?.classList.add('d-none'); list.classList.remove('d-none');
    
    list.innerHTML = cart.map(i => `
      <div class="d-flex align-items-center gap-3 py-2 border-bottom">
        <img src="${i.image}" alt="${i.name}" style="width:60px;height:60px;object-fit:cover" class="rounded">
        <div class="flex-grow-1"><strong>${i.name}</strong><br><small>${i.price.toFixed(2)}€ x ${i.quantity}</small></div>
        <strong>${(i.price*i.quantity).toFixed(2)}€</strong>
        <button class="btn btn-sm btn-danger del-btn" data-id="${i.id}">🗑️</button>
      </div>`).join('');
    
    document.getElementById('total').textContent = 
      cart.reduce((t,i)=>t+i.price*i.quantity,0).toFixed(2).replace('.',',') + ' €';
    
    // quitar el modal 
    document.querySelectorAll('.del-btn').forEach(b=>{
      b.onclick = () => {
        const id = +b.dataset.id, item = getCart().find(i=>i.id===id);
        document.getElementById('delMsg').textContent = `¿Eliminar "${item?.name}"?`;
        document.getElementById('delConfirm').onclick = () => { removeFromCart(id); bootstrap.Modal.getInstance(document.getElementById('delModal')).hide(); };
        new bootstrap.Modal(document.getElementById('delModal')).show();
      };
    });
  }

  // añadir al carro
  const addBtn = document.getElementById('addCart');
  if(addBtn){
    addBtn.onclick = () => {
      const p = JSON.parse(addBtn.dataset.product); addToCart(p);
    };
  }

  // contacto 
  const form = document.getElementById('contactForm');
  if(form){
    form.onsubmit = (e) => { e.preventDefault(); notify('Mensaje enviado'); form.reset(); };
  }

  // resumen del carro 
  const cartLink = document.getElementById('cart-link');
  if(cartLink && !location.pathname.includes('carrito')){
    cartLink.onclick = (e) => {
      e.preventDefault();
      const cart = getCart();
      if(!cart.length) { notify('Carrito vacío','warning'); return; }
      notify(`Total: ${cart.reduce((t,i)=>t+i.price*i.quantity,0).toFixed(2)}€`);
    };
  }

  // s para subir
  document.addEventListener('keydown', (e) => {
    if(e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
    if(e.key.toLowerCase()==='s'){ e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); }
  });

  updateCount();
  if(location.pathname.includes('carrito')) renderCart();
});