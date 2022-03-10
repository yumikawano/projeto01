const cartSidebarEl = document.querySelector(".cart-sidebar");
function openSidebar() {
  cartSidebarEl.classList.add("cart-sidebar-open");
}

function closeSidebar() {
  cartSidebarEl.classList.remove("cart-sidebar-open");
}

const btnCartEl = document.getElementById("btn-cart");
btnCartEl.addEventListener("click", openSidebar);
const btnCloseCartEl = document.querySelector("#btn-close-cart");
btnCloseCartEl.addEventListener("click", closeSidebar);

/* CHAMEI O JSON */

const fetchServices = () => {
  const servicesRoot = document.querySelector("#services");
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
    .catch((e) => console.log(e));
};

/* CRIEI O HTML */

const html = (service) => {
  const sectionEl = document.createElement("section");
  sectionEl.classList.add("services");
  sectionEl.innerHTML = `<img class="item12" src="${service.image}"/>
    <h3 class="name" style="  margin-bottom: 8px;
    margin-left: 15px;
    margin-right: 15px;">${service.name}</h3>
    <p class="description">${service.description ? `<p class="description" style="  margin-bottom: 8px;
    margin-left: 15px;
    margin-right: 15px;">${service.description}</p>
    <p class="price" style="  margin-bottom: 8px;
    margin-left: 15px;
    margin-right: 15px;">R$ ${service.price.toLocaleString('pt-br', { minimumFractionDigits: 2 })}</p>` : ''}
    <button class="btn btn-contratar" style="  margin-bottom: 8px;
    margin-left: 15px;
    margin-right: 15px;">Contratar</button>`;

  return sectionEl;
}
fetchServices()
