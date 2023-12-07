const { log } = console;

const SELECTOR_CARRITO_ICONO = "#carrito-icono";


// Abrir - Cerrar Carrito
let carritoIcono = document.querySelector("#carrito-icono");
let carrito = document.querySelector(".carrito");
let cerrarCarrito = document.querySelector("#cerrar-carrito");

// Abrir Carrito
carritoIcono.onclick = () => {
  carrito.classList.add("active");
};

// Cerrar Carrito
cerrarCarrito.onclick = () => {
  carrito.classList.remove("active");
};

// Verificar si el documento está cargando
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

// Configurar la funcionalidad de eliminación de artículos del carrito
function ready() {
  // Botones que permiten eliminar elementos del carrito
  let botonesEliminarCarrito = document.getElementsByClassName("carrito-remover");
  for (let i = 0; i < botonesEliminarCarrito.length; i++) {
    let boton = botonesEliminarCarrito[i];
    boton.addEventListener("click", eliminarItemDelCarrito);
  }

  // Modificar la cantidad de un artículo en el carrito
  let entradasCantidad = document.getElementsByClassName("carrito-cantidad");
  // Asignar un listener de evento a cada campo de cantidad para su modificación
  for (let i = 0; i < entradasCantidad.length; i++) {
    let entrada = entradasCantidad[i];
    entrada.addEventListener("change", cantidadModificada);
  }

  // Agregar al carrito
  let agregarAlCarrito = document.getElementsByClassName("agregar-carrito");
  for (let i = 0; i < agregarAlCarrito.length; i++) {
    let boton = agregarAlCarrito[i];
    boton.addEventListener("click", agregarAlCarritoClicando);
  }

  cargarArtículosCarrito();
}

// Eliminar un artículo del carrito
function eliminarItemDelCarrito(evento) {
  let botonClicado = evento.target;
  // Elimina el artículo del carrito
  botonClicado.parentElement.remove();

  actualizarTotal();
  guardarCarritoItems();
  iconoDeActualizarElCarrito();
}

// Modificar la cantidad de un artículo en el carrito
function cantidadModificada(evento) {
  // Obtener el campo de cantidad modificado
  let entrada = evento.target;
  // Verificar si la cantidad ingresada es válida, si no lo es o es menor o igual a cero, se establece como 1
  if (isNaN(entrada.value) || entrada.value <= 0) {
    entrada.value = 1;
  }

  actualizarTotal();
  guardarCarritoItems();
  iconoDeActualizarElCarrito();
}

// Agregar funcionalidad al carrito
function agregarAlCarritoClicando(evento) {
  let boton = evento.target;
  let tiendaProductos = boton.closest(".producto"); // Utilizar closest para encontrar el contenedor del producto
  let titulo = tiendaProductos.querySelector(".producto-titulo").innerText;
  let precio = tiendaProductos.querySelector(".precio").innerText;
  let productoImg = tiendaProductos.querySelector(".producto-imagen").src;

  if (productoYaEnCarrito(titulo)) {
    // Producto ya está en el carrito, muestra un SweetAlert
    Swal.fire({
      title: 'Producto ya en el carrito',
      text: 'Este producto ya ha sido añadido al carrito.',
      icon: 'info',
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'swal-popup-class',
        title: 'swal-title-class',
        content: 'swal-content-class',
        confirmButton: 'swal-confirm-button-class',
        closeButton: 'swal-close-button'
      }
    });
    return;
  }
  // Resto del código para agregar el producto al carrito
  agregarProductoAlCarrito(titulo, precio, productoImg);

   // Mostrar Toastify solo cuando se agrega un producto al carrito
   Toastify({
    text: `${titulo} añadido al carrito`,
    duration: 1000,
  }).showToast();

  actualizarTotal();
  guardarCarritoItems();
  iconoDeActualizarElCarrito();
}

function productoYaEnCarrito(titulo) {
  let carritoItemsNombres = document.querySelectorAll('.carrito-producto-titulo');
  return Array.from(carritoItemsNombres).some(item => item.innerText === titulo);
}

function agregarProductoAlCarrito(titulo, precio, productoImg) {
  let carritoTiendaCaja = document.createElement("div");
  carritoTiendaCaja.classList.add("carrito-caja");
  let carritoItems = document.querySelector(".carrito-contenedor");
  let carritoItemsNombres = carritoItems.querySelectorAll(".carrito-producto-titulo");

  let carritoCajaContenido = `
    <img src="${productoImg}" alt="" class="carrito-imagen" />
    <div class="detalle-caja">
      <div class="carrito-producto-titulo">${titulo}</div>
      <div class="carrito-precio">${precio}</div>
      <input type="number" name="" id="" value="1" class="carrito-cantidad" />
    </div>
    <!-- Remover Items -->
    <i class='bx bx-trash-alt carrito-remover'></i>
  `;

  carritoTiendaCaja.innerHTML = carritoCajaContenido;
  carritoItems.appendChild(carritoTiendaCaja);
  carritoTiendaCaja.querySelector(".carrito-remover").addEventListener("click", eliminarItemDelCarrito);
  carritoTiendaCaja.querySelector(".carrito-cantidad").addEventListener("change", cantidadModificada);

  guardarCarritoItems();
  iconoDeActualizarElCarrito();
}

// Actualizar el total
function actualizarTotal() {
  let contenidoDelCarrito = document.querySelector(".carrito-contenedor");
  let cajasDelCarrito = contenidoDelCarrito.getElementsByClassName("carrito-caja");
  let total = 0;

  for (let i = 0; i < cajasDelCarrito.length; i++) {
    let cajaDelCarrito = cajasDelCarrito[i];
    let precioElemento = cajaDelCarrito.querySelector(".carrito-precio");
    let cantidadElemento = cajaDelCarrito.querySelector(".carrito-cantidad");

    let precio = parseFloat(precioElemento.innerText.replace("$", ""));
    let cantidad = parseFloat(cantidadElemento.value);
    total += precio * cantidad;
  }

  // Redondear el precio
  total = Math.round(total * 100) / 100;
  document.querySelector(".total-precio").innerText = "$" + total;

  // Guardar el total en LocalStorage
  localStorage.setItem('carritoTotal', total);
}

// Mantener el artículo en el carrito al refrescar la página con LocalStorage
function guardarCarritoItems() {
  let carritoContenido = document.querySelector('.carrito-contenedor');
  let carritoCajas = carritoContenido.querySelectorAll('.carrito-caja');
  let carritoItems = Array.from(carritoCajas).map(carritoCaja => {
    let tituloElemento = carritoCaja.querySelector('.carrito-producto-titulo');
    let precioElemento = carritoCaja.querySelector('.carrito-precio');
    let cantidadElemento = carritoCaja.querySelector('.carrito-cantidad');
    let productoImg = carritoCaja.querySelector('.carrito-imagen').src;

    return {
      titulo: tituloElemento.innerText,
      precio: precioElemento.innerText,
      cantidad: cantidadElemento.value,
      productoImg: productoImg,
    };
  });

  localStorage.setItem('carritoItems', JSON.stringify(carritoItems));
}

// Cargar el carrito
function cargarArtículosCarrito() {
  let carritoItems = localStorage.getItem('carritoItems');
  if (carritoItems) {
    carritoItems = JSON.parse(carritoItems);

    for (let i = 0; i < carritoItems.length; i++) {
      let item = carritoItems[i];
      agregarProductoAlCarrito(item.titulo, item.precio, item.productoImg);

      let carritoCajas = document.querySelectorAll('.carrito-caja');
      let carritoCaja = carritoCajas[carritoCajas.length - 1];
      let cantidadElemento = carritoCaja.querySelector('.carrito-cantidad');
      cantidadElemento.value = item.cantidad;
    }
  }

  let carritoTotal = localStorage.getItem('carritoTotal');
  if (carritoTotal) {
    document.querySelector('.total-precio').innerText = "$" + carritoTotal;
  }
}

// Ícono de cantidad en el carrito
function iconoDeActualizarElCarrito() {
  let carritoCajas = document.getElementsByClassName('carrito-caja');
  let cantidad = 0;

  for (let i = 0; i < carritoCajas.length; i++) {
    let carritoCaja = carritoCajas[i];
    let cantidadElemento = carritoCaja.querySelector('.carrito-cantidad');
    cantidad += parseInt(cantidadElemento.value);
  }

  let carritoIcono = document.querySelector('#carrito-icono');
  carritoIcono.setAttribute('data-quantity', cantidad);
}

//JSON

// Cargar productos JSON de manera asíncrona
function cargarProductos() {
  fetch('./js/productos.json')
    .then(response => response.json())
    .then(data => {
      productos = data.productos; 
      mostrarProductos();
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

// Llamada a la función para cargar productos
cargarProductos();

// Función para mostrar los productos en la página
function mostrarProductos() {
  // Obtén el contenedor de productos
  const productosContainer = document.getElementById("productos-container");

  // Limpia cualquier contenido existente en el contenedor
  productosContainer.innerHTML = "";

  // Agrega los productos al contenedor 
  productos.forEach(producto => {
    const productoHTML = `
      <div class="producto">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-imagen" />
        <div class="producto-info">
          <h3 class="producto-titulo">${producto.nombre}</h3>
          <div class="precio-agregar">
            <p class="precio">$${producto.precio.toFixed(2)}</p>
            <button class="agregar-carrito" data-titulo="${producto.nombre}" data-precio="${producto.precio.toFixed(2)}">
              <i class='bx bx-cart'></i> 
            </button>
          </div>
        </div>
      </div>
    `;
    document.getElementById("productos-container").innerHTML += productoHTML;
  });

  // Agregar al carrito
  let agregarAlCarrito = document.getElementsByClassName("agregar-carrito");
  for (let i = 0; i < agregarAlCarrito.length; i++) {
    let boton = agregarAlCarrito[i];
    boton.addEventListener("click", agregarAlCarritoClicando);
  }
}

// Agregar listener de evento al botón de "Vaciar Carrito"
document.getElementById("vaciar-carrito").addEventListener("click", () => {
  Swal.fire({
    title: 'Vaciar Carrito',
    text: '¿Estás seguro de que deseas vaciar todo el carrito?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, vaciar carrito',
    cancelButtonText: 'Cancelar',
    customClass: {
      popup: 'swal-popup-class',
      title: 'swal-title-class',
      content: 'swal-content-class',
      confirmButton: 'swal-confirm-button-class',
      closeButton: 'swal-close-button'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      document.querySelector(".carrito-contenedor").innerHTML = "";
      actualizarTotal();
      guardarCarritoItems();
      iconoDeActualizarElCarrito();

      Swal.fire({
        title: 'Carrito Vacío',
        text: 'El carrito se ha vaciado exitosamente.',
        icon: 'success',
        customClass: {
          popup: 'swal-popup-class',
          title: 'swal-title-class',
          content: 'swal-content-class',
          confirmButton: 'swal-confirm-button-class'
        }
      });
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const pagarAhoraBtn = document.querySelector(".btn-comprar");

  pagarAhoraBtn.addEventListener("click", () => {
    procesarPago();
  });

  // Función para procesar el pago
  async function procesarPago() {
    try {
      await esperar(1000);
      mostrarMensajeExitoso('Compra Exitosa', '¡Gracias por tu compra!');
    } catch (error) {
      manejarError('Error al procesar el pago:', error);
    }
  }

  // Agregar evento de clic al botón "Pagar Ahora"
  document.querySelector(".btn-comprar").addEventListener("click", procesarPago);

  // Función para mostrar un mensaje exitoso con SweetAlert
  function mostrarMensajeExitoso(titulo, mensaje) {
    Swal.fire({
      title: titulo,
      text: mensaje,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      customClass: {
        popup: 'swal-popup-class success', 
        title: 'swal-title-class success', 
        content: 'swal-content-class success', 
        confirmButton: 'swal-confirm-button-class success' 
      }
    });
  }

  // Función para simular una espera con Promesa
  function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
});






 