// Conectar con Socket.io
const socket = io();

// Escuchar evento de actualización de productos
socket.on('updateProducts', (products) => {
    console.log('Productos actualizados:', products);
    updateProductsTable(products);
});

// Función para actualizar la tabla de productos
function updateProductsTable(products) {
    const container = document.getElementById('products-container');

    if (products.length === 0) {
        container.innerHTML = '<div class="empty">No hay productos disponibles</div>';
        return;
    }

    let tableHTML = `
        <table id="products-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Código</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody id="products-body">
    `;

    products.forEach(product => {
        tableHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.code}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.category}</td>
                <td>${product.status ? 'Activo' : 'Inactivo'}</td>
            </tr>
        `;
    });

    tableHTML += `
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
}

// Mensaje de conexión
socket.on('connect', () => {
    console.log('Conectado al servidor de WebSocket');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor de WebSocket');
});
