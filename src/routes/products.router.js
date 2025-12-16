import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// GET / - Listar productos con paginación, filtrado y ordenamiento
router.get('/', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;

        const result = await productManager.getProducts({
            limit,
            page,
            sort,
            query
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET /:pid - Obtener producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: `Producto con id ${req.params.pid} no encontrado`
            });
        }

        res.json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// POST / - Agregar nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);

        // Emitir evento de socket para actualizar en tiempo real
        const result = await productManager.getProducts({ limit: 100 });
        req.io.emit('updateProducts', result.payload);

        res.status(201).json({
            status: 'success',
            payload: newProduct
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// PUT /:pid - Actualizar producto
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);

        res.json({
            status: 'success',
            payload: updatedProduct
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// DELETE /:pid - Eliminar producto
router.delete('/:pid', async (req, res) => {
    try {
        const deletedProduct = await productManager.deleteProduct(req.params.pid);

        // Emitir evento de socket para actualizar en tiempo real
        const result = await productManager.getProducts({ limit: 100 });
        req.io.emit('updateProducts', result.payload);

        res.json({
            status: 'success',
            message: 'Producto eliminado correctamente',
            payload: deletedProduct
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;