import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

// POST / - Crear nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({
            status: 'success',
            payload: newCart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// GET /:cid - Obtener carrito por ID con productos poblados
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: `Carrito con id ${req.params.cid} no encontrado`
            });
        }

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// POST /:cid/products/:pid - Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await cartManager.addProductToCart(
            req.params.cid,
            req.params.pid,
            quantity || 1
        );

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// DELETE /:cid/products/:pid - Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartManager.removeProductFromCart(
            req.params.cid,
            req.params.pid
        );

        res.json({
            status: 'success',
            message: 'Producto eliminado del carrito',
            payload: cart
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// PUT /:cid - Actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
    try {
        const { products } = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({
                status: 'error',
                message: 'El campo products debe ser un array'
            });
        }

        const cart = await cartManager.updateCart(req.params.cid, products);

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// PUT /:cid/products/:pid - Actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).json({
                status: 'error',
                message: 'La cantidad debe ser un número mayor a 0'
            });
        }

        const cart = await cartManager.updateProductQuantity(
            req.params.cid,
            req.params.pid,
            quantity
        );

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

// DELETE /:cid - Eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.clearCart(req.params.cid);

        res.json({
            status: 'success',
            message: 'Carrito vaciado correctamente',
            payload: cart
        });
    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error.message
        });
    }
});

export default router;