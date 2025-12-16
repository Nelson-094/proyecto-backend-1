import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// GET /products - Renderizar vista de productos con paginación
router.get('/products', async (req, res) => {
    try {
        const { limit, page, sort, query } = req.query;

        const result = await productManager.getProducts({
            limit: limit || 10,
            page: page || 1,
            sort,
            query
        });

        // Construir URLs para las vistas
        const buildViewLink = (pageNum) => {
            if (!pageNum) return null;
            let link = `/products?page=${pageNum}&limit=${result.payload.length || 10}`;
            if (sort) link += `&sort=${sort}`;
            if (query) link += `&query=${query}`;
            return link;
        };

        res.render('products', {
            products: result.payload,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: buildViewLink(result.prevPage),
            nextLink: buildViewLink(result.nextPage),
            page: result.page,
            totalPages: result.totalPages
        });
    } catch (error) {
        res.status(500).render('products', {
            products: [],
            error: 'Error al cargar los productos'
        });
    }
});

// GET /products/:pid - Renderizar vista de detalle de producto
router.get('/products/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);

        if (!product) {
            return res.status(404).render('productDetail', {
                error: 'Producto no encontrado'
            });
        }

        res.render('productDetail', { product });
    } catch (error) {
        res.status(500).render('productDetail', {
            error: 'Error al cargar el producto'
        });
    }
});

// GET /carts/:cid - Renderizar vista de carrito
router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);

        if (!cart) {
            return res.status(404).render('cart', {
                error: 'Carrito no encontrado'
            });
        }

        // Calcular total
        let total = 0;
        if (cart.products && cart.products.length > 0) {
            total = cart.products.reduce((sum, item) => {
                return sum + (item.product.price * item.quantity);
            }, 0);
        }

        res.render('cart', {
            cart,
            cartId: req.params.cid,
            total: total.toFixed(2)
        });
    } catch (error) {
        res.status(500).render('cart', {
            error: 'Error al cargar el carrito'
        });
    }
});

// GET /realtimeproducts - Renderizar realTimeProducts.handlebars
router.get('/realtimeproducts', async (req, res) => {
    try {
        const result = await productManager.getProducts({ limit: 100 });
        res.render('realTimeProducts', { products: result.payload });
    } catch (error) {
        res.status(500).render('realTimeProducts', {
            products: [],
            error: 'Error al cargar los productos'
        });
    }
});

export default router;
