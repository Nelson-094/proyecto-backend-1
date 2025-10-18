# API de E-commerce - Backend

Proyecto de servidor Node.js con Express para gestión de productos y carritos de compra.

## Estructura del Proyecto

```
proyecto/
│
├── src/
│   ├── app.js                    # Archivo principal del servidor
│   ├── managers/
│   │   ├── ProductManager.js     # Gestor de productos
│   │   └── CartManager.js        # Gestor de carritos
│   ├── routes/
│   │   ├── products.router.js    # Rutas de productos
│   │   └── carts.router.js       # Rutas de carritos
│   └── data/
│       ├── products.json         # Persistencia de productos
│       └── carts.json            # Persistencia de carritos
│
├── package.json
├── .gitignore
└── README.md
```

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

## Uso

Iniciar el servidor:
```bash
npm start
```

Modo desarrollo (con nodemon):
```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:8080`

## Endpoints

### Productos (`/api/products`)

- **GET** `/api/products/` - Listar todos los productos
- **GET** `/api/products/:pid` - Obtener producto por ID
- **POST** `/api/products/` - Crear nuevo producto
- **PUT** `/api/products/:pid` - Actualizar producto
- **DELETE** `/api/products/:pid` - Eliminar producto

#### Ejemplo de producto:
```json
{
  "title": "Producto Ejemplo",
  "description": "Descripción del producto",
  "code": "PROD001",
  "price": 1000,
  "status": true,
  "stock": 50,
  "category": "Categoría",
  "thumbnails": ["imagen1.jpg", "imagen2.jpg"]
}
```

### Carritos (`/api/carts`)

- **POST** `/api/carts/` - Crear nuevo carrito
- **GET** `/api/carts/:cid` - Obtener productos de un carrito
- **POST** `/api/carts/:cid/product/:pid` - Agregar producto al carrito

## Pruebas con Postman

### Crear un producto
```
POST http://localhost:8080/api/products/
Content-Type: application/json

{
  "title": "Laptop",
  "description": "Laptop de alta gama",
  "code": "LAP001",
  "price": 50000,
  "stock": 10,
  "category": "Electrónica",
  "thumbnails": ["laptop.jpg"]
}
```

### Crear un carrito
```
POST http://localhost:8080/api/carts/
```

### Agregar producto al carrito
```
POST http://localhost:8080/api/carts/1/product/1
```

## Características

- IDs autogenerados y únicos
- Validación de campos obligatorios
- Persistencia en archivos JSON
- Manejo de errores
- Incremento automático de cantidad si el producto ya existe en el carrito

## Tecnologías

- Node.js
- Express
- FileSystem (persistencia)

## Autor

Nelson Sanchez

## Licencia

ISC