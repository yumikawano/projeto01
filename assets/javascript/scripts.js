const cartSidebarEl = document.querySelector(".cart-sidebar");
function openSidebar (event) {
  event.stopPropagation();
  cartSidebarEl.classList.add("cart-sidebar-open");
}
function closeSidebar() {
  cartSidebarEl.classList.remove("cart-sidebar-open");
}
const btnCartEl = document.getElementById("btn-cart");
btnCartEl.addEventListener("click", openSidebar);
const btnCloseCartEl = document.querySelector("#btn-close-cart");
btnCloseCartEl.addEventListener("click", closeSidebar);
document.addEventListener('click', closeSidebar)
cartSidebarEl.addEventListener('click', (event) => {
  event.stopPropagation();
})
const btnAddMore = document.querySelector('#btn-add-more')
btnAddMore?.addEventListener('click', closeSidebar)
/* CHAMEI O JSON */
const servicesRoot = document.querySelector("#services");
const fetchServices = () => {
  const responseJson = fetch("/services.json");
  console.log(responseJson);
  responseJson
    .then((data) => {
      const dataJson = data.json();
      console.log(data, "acabou os dados");
      dataJson.then((object) => {
        console.log(object, "acabou");
        servicesRoot.innerHTML = ''
        object.services.forEach((service) => {
          const functionHtml = html(service);
          servicesRoot.appendChild(functionHtml);
          console.log(service.image);
        });
      });
    })
    .catch(() => {
      servicesRoot.innerHTML = '<p class="error-alert">Falha ao buscar produtos. Por favor, tente novamente.</p>'
    });
};

/* CRIEI O HTML */
const html = (service) => {
  const sectionEl = document.createElement("section");
  sectionEl.classList.add("services");
  sectionEl.innerHTML = `<img class="item12" src="${service.image}"/>
    <h3 class="name">${service.name}</h3>
    ${service.description ? `<p class="description">${service.description}</p>`:''}
    <p class="price">R$ ${service.price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</p>
    <button class="btn btn-contratar" value="${service.name}">Contratar</button>`;


    const btnAddCartEl = sectionEl.querySelector('button');
    btnAddCartEl.addEventListener('click', () => {
      addToCart(service)
    })
    btnAddCartEl.addEventListener('click', openSidebar);
    


  return sectionEl;
}
if (servicesRoot) {
  fetchServices()
}

let servicesCart = []
const savedServices = localStorage.getItem('servicesCart')
if (savedServices) {
servicesCart = JSON.parse(savedServices)
}
const addToCart = newService => {
  const servicesIndex = servicesCart.findIndex(
    item => item.id === newService.id
  ) 
  if (servicesIndex === -1) {
    servicesCart.push({
      ...newService,
      qty: 1
    })
  } else {
    servicesCart[servicesIndex].qty++
  }
  handleCartUpdate();
} 
const removeOfCart = id => {
  servicesCart = servicesCart.filter((service) => {
    if (service.id === id) {
      return false
    }
    return true
  })
  handleCartUpdate();
  if (servicesCart.length === 0) {
    closeSidebar();
  }
}
const updateItemQty = (id, newQty) => {
  const newQtyNumber = parseInt(newQty)
  if (isNaN(newQtyNumber)) {
    return
  }
  if (newQtyNumber > 0) {
    const serviceIndex = servicesCart.findIndex((service) => {
      if (service.id === id) {
        return true
      }
      return false
    })
    servicesCart[serviceIndex].qty = newQtyNumber
    handleCartUpdate(false)
  } else {
    removeOfCart(id)
  }
}

const handleCartUpdate = (renderItens = true) => {
  // Salva carrinho no localstorage
  const servicesCartString = JSON.stringify(servicesCart)
  localStorage.setItem('servicesCart', servicesCartString)
  const emptyCartEl = document.querySelector('#empty-cart');
  const cartWithServicesEl = document.querySelector('#cart-with-services');
  const cartServicesListEl = cartWithServicesEl.querySelector('ul');
  const cartBadgeEl = document.querySelector('.btn-cart-badge');
  console.log(servicesCart)
  if (servicesCart.length > 0) {
     // Calcula totais
     var total = 0
     var totalPrice = 0
     servicesCart.forEach(service => {
       total = total + service.qty
       totalPrice = totalPrice + service.price * service.qty
     })
    // Atualizar a badge
    cartBadgeEl.classList.add('btn-cart-badge-show');
    cartBadgeEl.textContent = total
     // Atualizo o total do carrinho
     const cartTotalEl = document.querySelector('.cart-total p:last-child');
     cartTotalEl.textContent = totalPrice.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' });
     // Exibir carrinho com produtos
     cartWithServicesEl.classList.add('cart-with-services-show');
     emptyCartEl.classList.remove('empty-cart-show');
      // Exibir produtos do carrinho na tela
      if (renderItens) {
        cartServicesListEl.innerHTML = ''
        servicesCart.forEach((service) => {
          const listItemEl = document.createElement('li')
          listItemEl.innerHTML = `
            <img src="${service.image}" alt="${service.name}" width="70" height="70" />
            <div>
              <p class="h3">${service.name}</p>
              <p class="price">R$ ${service.price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</p>
            </div>
            <input class="form-input" type="number" value="${service.qty}" />
            <button>
              <i class="fa-solid fa-trash-can"></i>
            </button>
          `
          const btnRemoveEl = listItemEl.querySelector('button')
          btnRemoveEl.addEventListener('click', () => {
            removeOfCart(service.id)
          })
          const inputQtyEl = listItemEl.querySelector('input')
          inputQtyEl.addEventListener('keyup', (event) => {
            updateItemQty(service.id, event.target.value)
          })
          inputQtyEl.addEventListener('keydown', (event) => {
            if (event.key === '-' || event.key === '.' || event.key === ',') {
              event.preventDefault()
            }
          })
          inputQtyEl.addEventListener('change', (event) => {
            updateItemQty(service.id, event.target.value)
          })
          cartServicesListEl.appendChild(listItemEl)
    })
  } 
} else {
    // Esconder badge
    cartBadgeEl.classList.remove('btn-cart-badge-show');
    // Exibir carrinho vazio
    emptyCartEl.classList.add('empty-cart-show');
    cartWithServicesEl.classList.remove('cart-with-services-show');
  }
}
handleCartUpdate();
// Atualiza carrinho se outra aba
window.addEventListener('storage', (event) => {
  if (event.key === 'servicesCart') {
    servicesCart = JSON.parse(event.newValue)
    handleCartUpdate()
  }
})
const formCheckoutEl = document.querySelector('.form-checkout')
formCheckoutEl?.addEventListener('submit', (event) => {
  event.preventDefault()
  if (servicesCart.length == 0) {
    alert('Nenhum produto no carrinho.')
    return
  }
  let text = 'Confira o pedido abaixo:\n---------------------------------------\n\n'
  let total = 0
  productsCart.forEach(service => {
    text += `*${service.qty}x ${service.name}* - ${service.price.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}\n`
    total += service.price * service.qty
  })
  text += '\n*Taxa de entrega:* A combinar\n'
  text += `*Total: ${total.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}*`
  text += '\n---------------------------------------\n\n'
  text += `*${formCheckoutEl.elements['input-name'].value}*\n`
  text += `${formCheckoutEl.elements['input-phone'].value}\n\n`
  text += `${formCheckoutEl.elements['input-address'].value}, ${formCheckoutEl.elements['input-number'].value}`
  const complement = formCheckoutEl.elements['input-complement'].value
  if (complement) {
    text+= ` - ${complement}`
  }
  text += `\n${formCheckoutEl.elements['input-neighborhood'].value}, ${formCheckoutEl.elements['input-city'].value}\n`
  text += formCheckoutEl.elements['input-cep'].value
  const subdomain = window.innerWidth > 768 ? 'web' : 'api'
  window.open(`https://${subdomain}.whatsapp.com/send?phone=5544988251854&text=${encodeURI(text)}`, '_blank')
})
if (typeof IMask !== 'undefined') {
  const inputPhoneEl = document.querySelector('#input-phone')
  IMask(inputPhoneEl, {
    mask: '(00) 00000-0000'
  })
  const inputCepEl = document.querySelector('#input-cep')
  IMask(inputCepEl, {
    mask: '00000-000'
  })
}
