const cartSidebarEl = document.querySelector('.cart-sidebar')
function openSidebar () {
  cartSidebarEl.classList.add('cart-sidebar-open')
}
function closeSidebar () {
  cartSidebarEl.classList.remove('cart-sidebar-open')
}
const btnCartEl = document.getElementById('btn-cart')
btnCartEl.addEventListener('click', openSidebar)
const btnCloseCartEl = document.querySelector('#btn-close-cart')
btnCloseCartEl.addEventListener('click', closeSidebar)

const fetchProducts = () => {
  const groupsRootEl = document.querySelector('#groups-root')
  fetch('/servicos.json')
    .then(res => res.json())
    .then(data => {
      groupsRootEl.innerHTML = ''
      data.groups.forEach((group) => {
        const groupSectionEl = getSectionElement(group)
        groupsRootEl.appendChild(groupSectionEl)
      })
    })
    .catch(() => {
      groupsRootEl.innerHTML = '<p class="error-alert">Falha ao buscar produtos. Por favor, tente novamente.</p>'
    })
}
const getSectionElement = (group) => {
  const sectionEl = document.createElement('section')
  const sectionTitleEl = document.createElement('h2')
  sectionTitleEl.textContent = group.name
  sectionEl.appendChild(sectionTitleEl)
  const productsGridEl = document.createElement('div')
  productsGridEl.classList.add('products-grid')
  sectionEl.appendChild(productsGridEl)
  group.products.forEach((product) => {
    const cardWrapEl = document.createElement('article')
    cardWrapEl.classList.add('card')
    cardWrapEl.innerHTML = `
      <img src="${product.image}" alt="${product.name}" width="316" height="193" />
      <div class="card-content">
        <h3>${product.name}</h3>
        <p class="price">R$ ${product.price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</p>
        ${product.description ? `<p>${product.description}</p>` : ''}
        <button class="btn btn-contratar">Contratar</button>
      </div>
    `
    const btnAddCartEl = cardWrapEl.querySelector('button')
    btnAddCartEl.addEventListener('click', () => {
      addToCart(product)
    })
    productsGridEl.appendChild(cardWrapEl)
  })
  return sectionEl
}
fetchProducts()

const productsCart = []
const addToCart = newProduct => {
  const productIndex = productsCart.findIndex(
    item => item.id === newProduct.id
  )
  if (productIndex === -1) {
    productsCart.push({
      ...newProduct,
      qty: 1
    })
  } else {
    productsCart[productIndex].qty++
  }
  handleCartUpdate()
}
const handleCartUpdate = () => {
  if (productsCart.length > 0) {
    const cartBadgeEl = document.querySelector('.btn-cart-badge')
    cartBadgeEl.classList.add('btn-cart-badge-show')
    let total = 0
    productsCart.forEach(product => {
      total = total + product.qty
    })
    cartBadgeEl.textContent = total
  }
}