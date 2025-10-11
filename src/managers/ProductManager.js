import fs from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.init();
    }

    async init() {
        try {
            if (fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                this.products = JSON.parse(data);
            } else {
                await this.saveToFile();
            }
        } catch (error) {
            console.error('Error al inicializar ProductManager:', error);
            this.products = [];
        }
    }

    async saveToFile() {
        try {
            await fs.promises.writeFile(
                this.path,
                JSON.stringify(this.products, null, 2),
                'utf-8'
            );
        } catch (error) {
            console.error('Error al guardar productos:', error);
            throw error;
        }
    }

    async getProducts() {
        await this.init();
        return this.products;
    }

    async getProductById(id) {
        await this.init();
        const product = this.products.find(p => p.id === id);
        return product || null;
    }

    async addProduct(productData) {
        await this.init();

        // Validar campos obligatorios
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        for (const field of requiredFields) {
            if (!productData[field]) {
                throw new Error(`El campo ${field} es obligatorio`);
            }
        }

        // Validar que el código no esté repetido
        const codeExists = this.products.some(p => p.code === productData.code);
        if (codeExists) {
            throw new Error(`El código ${productData.code} ya existe`);
        }

        // Generar ID único
        const newId = this.products.length > 0
            ? Math.max(...this.products.map(p => p.id)) + 1
            : 1;

        const newProduct = {
            id: newId,
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: productData.price,
            status: productData.status !== undefined ? productData.status : true,
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails || []
        };

        this.products.push(newProduct);
        await this.saveToFile();
        return newProduct;
    }

    async updateProduct(id, updateData) {
        await this.init();

        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }

        // No permitir actualizar el id
        if (updateData.id) {
            delete updateData.id;
        }

        // Si se intenta actualizar el código, validar que no esté repetido
        if (updateData.code && updateData.code !== this.products[index].code) {
            const codeExists = this.products.some(p => p.code === updateData.code);
            if (codeExists) {
                throw new Error(`El código ${updateData.code} ya existe`);
            }
        }

        this.products[index] = {
            ...this.products[index],
            ...updateData
        };

        await this.saveToFile();
        return this.products[index];
    }

    async deleteProduct(id) {
        await this.init();

        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Producto con id ${id} no encontrado`);
        }

        const deletedProduct = this.products.splice(index, 1);
        await this.saveToFile();
        return deletedProduct[0];
    }
}

export default ProductManager;