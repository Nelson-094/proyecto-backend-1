import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

class CartManager {
    async createCart() {
        try {
            const cart = new Cart({ products: [] });
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al crear carrito:', error);
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const cart = await Cart.findById(id).populate('products.product');
            return cart;
        } catch (error) {
            console.error('Error al obtener carrito:', error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            // Verificar que el producto existe
            const product = await Product.findById(productId);
            if (!product) {
                throw new Error(`Producto con id ${productId} no encontrado`);
            }

            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            // Buscar si el producto ya existe en el carrito
            const productIndex = cart.products.findIndex(
                p => p.product.toString() === productId
            );

            if (productIndex !== -1) {
                // El producto ya existe, incrementar quantity
                cart.products[productIndex].quantity += quantity;
            } else {
                // El producto no existe, agregarlo
                cart.products.push({
                    product: productId,
                    quantity
                });
            }

            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            throw error;
        }
    }

    async removeProductFromCart(cartId, productId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            cart.products = cart.products.filter(
                p => p.product.toString() !== productId
            );

            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            throw error;
        }
    }

    async updateCart(cartId, products) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            // Validar que todos los productos existen
            for (const item of products) {
                const product = await Product.findById(item.product);
                if (!product) {
                    throw new Error(`Producto con id ${item.product} no encontrado`);
                }
            }

            cart.products = products;
            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            console.error('Error al actualizar carrito:', error);
            throw error;
        }
    }

    async updateProductQuantity(cartId, productId, quantity) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            const productIndex = cart.products.findIndex(
                p => p.product.toString() === productId
            );

            if (productIndex === -1) {
                throw new Error(`Producto con id ${productId} no encontrado en el carrito`);
            }

            cart.products[productIndex].quantity = quantity;
            await cart.save();
            return await this.getCartById(cartId);
        } catch (error) {
            console.error('Error al actualizar cantidad del producto:', error);
            throw error;
        }
    }

    async clearCart(cartId) {
        try {
            const cart = await Cart.findById(cartId);
            if (!cart) {
                throw new Error(`Carrito con id ${cartId} no encontrado`);
            }

            cart.products = [];
            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al limpiar carrito:', error);
            throw error;
        }
    }
}

export default CartManager;