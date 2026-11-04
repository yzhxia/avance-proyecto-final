const btnLogin = document.getElementById('btnLogin');
if (btnLogin) {
    btnLogin.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const mensaje = document.getElementById('mensaje');
        if (!username || !password) {
            mensaje.textContent = 'Completa los campos';
            return;
        }
        try {
            const respuesta = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const datos = await respuesta.json();
            if (respuesta.ok) {
                localStorage.setItem('token', datos.token);
                window.location.href = '/productos.html';
            } else {
                mensaje.textContent = datos.error;
            }
        } catch (error) {
            mensaje.textContent = 'No se pudo conectar con el servidor';
        }
    });
}
const listaProductos = document.getElementById('listaProductos');
if (listaProductos) {
    const token = localStorage.getItem('token');
    const mensaje = document.getElementById('mensaje');
    if (!token) {
        window.location.href = '/';
    }
    document.getElementById('btnCerrarSesion').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    });
    async function cargarProductos() {
        try {
            const respuesta = await fetch('/api/productos');
            const productos = await respuesta.json();
            listaProductos.innerHTML = '';
            productos.forEach(producto => {
                const fila = document.createElement('tr');
                const nombre = document.createElement('td');
                nombre.textContent = producto.nombre;
                const descripcion = document.createElement('td');
                descripcion.textContent = producto.descripcion || '';
                const precio = document.createElement('td');
                precio.textContent = '$' + producto.precio;
                const cantidad = document.createElement('td');
                cantidad.textContent = producto.cantidad;
                const acciones = document.createElement('td');
                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.className = 'btn-editar';
                btnEditar.addEventListener('click', () => {
                    editarProducto(producto);
                });
                const btnEliminar = document.createElement('button');
                btnEliminar.textContent = 'Eliminar';
                btnEliminar.className = 'btn-eliminar';
                btnEliminar.addEventListener('click', () => {
                    eliminarProducto(producto._id);
                });
                acciones.appendChild(btnEditar);
                acciones.appendChild(btnEliminar);
                fila.appendChild(nombre);
                fila.appendChild(descripcion);
                fila.appendChild(precio);
                fila.appendChild(cantidad);
                fila.appendChild(acciones);
                listaProductos.appendChild(fila);
            });
        } catch (error) {
            mensaje.textContent = 'Error al cargar productos';
        }
    }
    document.getElementById('btnAgregar').addEventListener('click', async () => {
        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = Number(document.getElementById('precio').value);
        const cantidad = Number(document.getElementById('cantidad').value);
        if (!nombre || !document.getElementById('precio').value ||
            !document.getElementById('cantidad').value) {
            mensaje.textContent = 'Completa los campos obligatorios';
            return;
        }
        const producto = {
            nombre,
            descripcion,
            precio,
            cantidad
        };
        try {
            const respuesta = await fetch('/api/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(producto)
            });
            const datos = await respuesta.json();
            if (respuesta.ok) {
                mensaje.textContent = 'Producto agregado correctamente';
                document.getElementById('nombre').value = '';
                document.getElementById('descripcion').value = '';
                document.getElementById('precio').value = '';
                document.getElementById('cantidad').value = '';
                cargarProductos();
            } else {
                mensaje.textContent = datos.error;
            }
        } catch (error) {
            mensaje.textContent = 'No se pudo agregar el producto';
        }
    });
    async function editarProducto(producto) {
        const nombre = prompt('Nuevo nombre:', producto.nombre);
        if (nombre === null) return;
        const descripcion = prompt('Nueva descripcion:', producto.descripcion || '');
        if (descripcion === null) return;
        const precioTexto = prompt('Nuevo precio:', producto.precio);
        if (precioTexto === null) return;
        const cantidadTexto = prompt('Nueva cantidad:', producto.cantidad);
        if (cantidadTexto === null) return;
        const datos = {
            nombre: nombre,
            descripcion: descripcion,
            precio: Number(precioTexto),
            cantidad: Number(cantidadTexto)
        };
        try {
            const respuesta = await fetch('/api/productos/' + producto._id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(datos)
            });
            const resultado = await respuesta.json();
            if (respuesta.ok) {
                mensaje.textContent = 'Producto actualizado correctamente';
                cargarProductos();
            } else {
                mensaje.textContent = resultado.error;
            }
        } catch (error) {
            mensaje.textContent = 'No se pudo actualizar el producto';
        }
    }
    async function eliminarProducto(id) {
        const confirmar = confirm('¿Deseas eliminar este producto?');
        if (!confirmar) return;
        try {
            const respuesta = await fetch('/api/productos/' + id, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            const datos = await respuesta.json();
            if (respuesta.ok) {
                mensaje.textContent = datos.mensaje;
                cargarProductos();
            } else {
                mensaje.textContent = datos.error;
            }
        } catch (error) {
            mensaje.textContent = 'No se pudo eliminar el producto';
        }
    }
    cargarProductos();
}