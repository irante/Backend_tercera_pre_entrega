const socket = io();
const contenedor = document.getElementById("contenedor");
const cardsData = [];

function renderCards(data) {
  data.forEach((el) => {
    const div = document.createElement("div");
    div.className = "cards";
    div.innerHTML = `<h1>${el.title}</h1>
                    <h2>$ ${el.price}</h2> 
                    <h3>${el.descripcion}</h3>`;
    contenedor.appendChild(div);
  });
}

socket.on('event', (data) => {
  cardsData.push(...data); // Agregar los nuevos datos al arreglo

  // Renderizar todas las cards nuevamente con los datos actualizados
  
  contenedor.innerHTML = '';
  renderCards(cardsData);
});

// Al cargar la página, renderizar las cards existentes (si las hay)

renderCards(cardsData);




