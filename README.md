# API de E-commerce - Backend

Proyecto de servidor Node.js con Express, MongoDB, Handlebars y WebSockets para gestión de productos y carritos de compra.

## Características

- **MongoDB** como sistema de persistencia
- **Handlebars** como motor de plantillas
- **Socket.io** para actualizaciones en tiempo real
- Paginación, filtrado y ordenamiento de productos
- Gestión completa de carritos con referencias a productos
- Vistas interactivas con navegación

## Estructura del Proyecto

```
proyecto/
│
├── src/
│   ├── app.js                    # Archivo principal del servidor
│   ├── config/
│   │   └── database.js           # Configuración de MongoDB
│   ├── models/
│   │   ├── product.model.js      # Modelo de productos
│   │   └── cart.model.js         # Modelo de carritos
│   ├── managers/
│   │   ├── ProductManager.js     # Gestor de productos
│   │   └── CartManager.js        # Gestor de carritos
│   ├── routes/
│   │   ├── products.router.js    # Rutas API de productos
│   │   ├── carts.router.js       # Rutas API de carritos
│   │   └── views.router.js       # Rutas de vistas
│   ├── views/
│   │   ├── layouts/
│   │   │   └── main.handlebars   # Layout principal
│   │   ├── products.handlebars   # Vista de productos con paginación
│   │   ├── productDetail.handlebars
│   │   ├── cart.handlebars       # Vista de carrito
│   │   └── realTimeProducts.handlebars
│   └── public/
│       └── js/
│           └── realTimeProducts.js
│
├── .env.example
├── package.json
└── README.md
```

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar MongoDB:
   - **Opción A - MongoDB Atlas (Recomendado):**
     1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
     2. Crear un cluster gratuito
     3. Obtener la cadena de conexión
     4. Crear archivo `.env` basado en `.env.example`
     5. Reemplazar `MONGODB_URI` con tu cadena de conexión

   - **Opción B - MongoDB Local:**
     1. Instalar MongoDB Community Edition
     2. Iniciar servicio de MongoDB
     3. Usar la URI por defecto: `mongodb://localhost:27017/ecommerce`

4. Crear archivo `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
PORT=8080
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

## Endpoints API

### Productos (`/api/products`)

- **GET** `/api/products/` - Listar productos con paginación
  - Query params: `limit`, `page`, `sort` (asc/desc), `query` (category:value o status:true/false)
  - Ejemplo: `/api/products?limit=5&page=1&sort=asc&query=category:electronics`
  
- **GET** `/api/products/:pid` - Obtener producto por ID
- **POST** `/api/products/` - Crear nuevo producto
- **PUT** `/api/products/:pid` - Actualizar producto
- **DELETE** `/api/products/:pid` - Eliminar producto

#### Ejemplo de producto:
```json
{
  "title": "Laptop",
  "description": "Laptop de alta gama",
  "code": "LAP001",
  "price": 50000,
  "status": true,
  "stock": 10,
  "category": "electronics",
  "thumbnails": ["laptop.jpg"]
}
```

### Carritos (`/api/carts`)

- **POST** `/api/carts/` - Crear nuevo carrito
- **GET** `/api/carts/:cid` - Obtener carrito con productos poblados
- **POST** `/api/carts/:cid/products/:pid` - Agregar producto al carrito
- **PUT** `/api/carts/:cid` - Actualizar todos los productos del carrito
- **PUT** `/api/carts/:cid/products/:pid` - Actualizar cantidad de un producto
- **DELETE** `/api/carts/:cid/products/:pid` - Eliminar producto del carrito
- **DELETE** `/api/carts/:cid` - Vaciar carrito

## Vistas

- `/products` - Lista de productos con paginación y filtros
- `/products/:pid` - Detalle de producto
- `/carts/:cid` - Vista de carrito específico
- `/realtimeproducts` - Productos en tiempo real con WebSockets

## Tecnologías

- Node.js
- Express
- MongoDB + Mongoose
- Handlebars
- Socket.io
- dotenv

## Autor

Nelson Sanchez

## Licencia

ISC