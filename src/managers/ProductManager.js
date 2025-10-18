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
            if (!productData[field] && productData[field] !== 0) {
                throw new Error(`El campo ${field} es obligatorio`);
            }
        }

        // Validar tipos de datos
        if (typeof productData.title !== 'string' || productData.title.trim() === '') {
            throw new Error('El título debe ser un texto no vacío');
        }
        if (typeof productData.description !== 'string' || productData.description.trim() === '') {
            throw new Error('La descripción debe ser un texto no vacío');
        }
        if (typeof productData.code !== 'string' || productData.code.trim() === '') {
            throw new Error('El código debe ser un texto no vacío');
        }
        if (typeof productData.category !== 'string' || productData.category.trim() === '') {
            throw new Error('La categoría debe ser un texto no vacío');
        }

        // Validar price
        if (typeof productData.price !== 'number' || productData.price <= 0) {
            throw new Error('El precio debe ser un número mayor a 0');
        }

        // Validar stock
        if (typeof productData.stock !== 'number' || productData.stock < 0 || !Number.isInteger(productData.stock)) {
            throw new Error('El stock debe ser un número entero mayor o igual a 0');
        }

        // Validar thumbnails si existe
        if (productData.thumbnails && !Array.isArray(productData.thumbnails)) {
            throw new Error('Las thumbnails deben ser un array');
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
            title: productData.title.trim(),
            description: productData.description.trim(),
            code: productData.code.trim().toUpperCase(),
            price: productData.price,
            status: productData.status !== undefined ? productData.status : true,
            stock: productData.stock,
            category: productData.category.trim(),
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

        // Validar tipos si se proporcionan
        if (updateData.title !== undefined) {
            if (typeof updateData.title !== 'string' || updateData.title.trim() === '') {
                throw new Error('El título debe ser un texto no vacío');
            }
            updateData.title = updateData.title.trim();
        }

        if (updateData.description !== undefined) {
            if (typeof updateData.description !== 'string' || updateData.description.trim() === '') {
                throw new Error('La descripción debe ser un texto no vacío');
            }
            updateData.description = updateData.description.trim();
        }

        if (updateData.category !== undefined) {
            if (typeof updateData.category !== 'string' || updateData.category.trim() === '') {
                throw new Error('La categoría debe ser un texto no vacío');
            }
            updateData.category = updateData.category.trim();
        }

        if (updateData.price !== undefined) {
            if (typeof updateData.price !== 'number' || updateData.price <= 0) {
                throw new Error('El precio debe ser un número mayor a 0');
            }
        }

        if (updateData.stock !== undefined) {
            if (typeof updateData.stock !== 'number' || updateData.stock < 0 || !Number.isInteger(updateData.stock)) {
                throw new Error('El stock debe ser un número entero mayor o igual a 0');
            }
        }

        if (updateData.thumbnails !== undefined && !Array.isArray(updateData.thumbnails)) {
            throw new Error('Las thumbnails deben ser un array');
        }

        // Si se intenta actualizar el código, validar que no esté repetido
        if (updateData.code && updateData.code !== this.products[index].code) {
            if (typeof updateData.code !== 'string' || updateData.code.trim() === '') {
                throw new Error('El código debe ser un texto no vacío');
            }
            updateData.code = updateData.code.trim().toUpperCase();
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