document.addEventListener("DOMContentLoaded", () => {
  const productosContainer = document.getElementById("productos");
  const carritoLista = document.getElementById("carrito");
  const totalSpan = document.getElementById("total");
  const form = document.getElementById("form-compra");

  let productos = [];
  let carrito = [];

  // Cargar productos JSON
  fetch("data/productos.json")
    .then((res) => res.json())
    .then((data) => {
      productos = data;
      mostrarProductos(productos);
    });

  // Mostrar productos
  function mostrarProductos(productos) {
    productosContainer.innerHTML = "";
    productos.forEach((producto) => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}" />
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio} ARS</p>
        <p>Categoría: ${producto.categoria}</p>
        <button class="add-to-cart">Agregar al carrito</button>
      `;
      productosContainer.appendChild(card);

      card.querySelector(".add-to-cart").addEventListener("click", () => {
        agregarAlCarrito({ ...producto });
      });
    });
  }

  // Agregar al carrito
  function agregarAlCarrito(producto) {
    const itemExistente = carrito.find((item) => item.id === producto.id);
    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }
    actualizarCarrito();
  }

  // Actualizar carrito
  function actualizarCarrito() {
    carritoLista.innerHTML = "";
    if (carrito.length === 0) {
      carritoLista.innerHTML = "<p>Selecciona productos del catálogo</p>";
      totalSpan.textContent = "0 $ARS";
      return;
    }

    let total = 0;

    carrito.forEach((item, index) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "carrito-item";
      itemDiv.innerHTML = `
        <h4>${item.nombre} <span class="cantidad">(x${item.cantidad})</span></h4>
        <button class="eliminar" data-index="${index}">×</button>
      `;
      carritoLista.appendChild(itemDiv);

      itemDiv.querySelector(".eliminar").addEventListener("click", () => {
        carrito.splice(index, 1);
        actualizarCarrito();
      });

      total += item.precio * item.cantidad;
    });

    totalSpan.textContent = `${total} $ARS`;
  }

  // Confirmar compra
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita recargar la página

    // Validar carrito vacío
    if (carrito.length === 0) {
      swal("Error", "Por favor, agrega productos antes de finalizar la compra.", "error");
      return;
    }

    // Validar formulario
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const direccion = document.getElementById("direccion").value.trim();

    if (!nombre || !email || !direccion) {
      swal("Advertencia", "Por favor, completa todos los campos del formulario.", "warning");
      return;
    }

    // Calcular total y mostrar mensaje
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const detalle = carrito
      .map((item) => `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad} ARS`)
      .join("\n");

    //sweetalert clásico
    swal({
      title: "Compra realizada",
      text: `¡Gracias por tu compra, ${nombre}!\n\nDetalles:\n${detalle}\n\nTotal: $${total} ARS\n\nPronto recibirás un correo a ${email}`,
      icon: "success",
      button: "Aceptar",
    });

    //Limpia formulario y carrito
    form.reset();
    carrito = [];
    actualizarCarrito();
  });
});