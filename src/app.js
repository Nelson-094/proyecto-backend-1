import 'dotenv/config';
import express from 'express';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/database.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

// Crear servidor HTTP
const httpServer = createServer(app);

// Configurar Socket.io
const io = new Server(httpServer);

// Configurar Handlebars
app.engine('handlebars', engine({
    helpers: {
        multiply: (a, b) => a * b
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para hacer io accesible en las rutas
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Socket.io - Conexión
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Conectar a MongoDB y luego iniciar servidor
connectDB().then(() => {
    httpServer.listen(PORT, () => {
        console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
});