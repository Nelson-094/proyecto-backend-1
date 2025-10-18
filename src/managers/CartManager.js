import fs from 'fs';

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.init();
    }

    async init() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                this.carts = JSON.parse(data);
            } else {
                await this.saveToFile();
            }
        } catch (error) {
            console.error('Error al inicializar CartManager:', error);
            this.carts = [];
        }
    }

    async saveToFile() {
        try {
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(this.carts, null, 2),
                'utf-8'
            );
        } catch (error) {
            console.error('Error al guardar carritos:', error);
            throw error;
        }
    }

    async createCart() {
        await this.init();

        // Generar ID único
        const newId = this.carts.length > 0
            ? Math.max(...this.carts.map(c => c.id)) + 1
            : 1;

        const newCart = {
            id: newId,
            products: []
        };

        this.carts.push(newCart);
        await this.saveToFile();
        return newCart;
    }

    async getCartById(id) {
        await this.init();
        const cart = this.carts.find(c => c.id === id);
        return cart || null;
    }

    async addProductToCart(cartId, productId) {
        await this.init();

        // Validar que productId sea un número válido
        if (typeof productId !== 'number' || productId <= 0 || !Number.isInteger(productId)) {
            throw new Error('El ID del producto debe ser un número entero positivo');
        }

        const cartIndex = this.carts.findIndex(c => c.id === cartId);
        if (cartIndex === -1) {
            throw new Error(`Carrito con id ${cartId} no encontrado`);
        }

        const cart = this.carts[cartIndex];
        const productIndex = cart.products.findIndex(p => p.product === productId);

        if (productIndex !== -1) {
            // El producto ya existe, incrementar quantity
            cart.products[productIndex].quantity += 1;
        } else {
            // El producto no existe, agregarlo
            cart.products.push({
                product: productId,
                quantity: 1
            });
        }

        await this.saveToFile();
        return cart;
    }
}

export default CartManager;