import Product from '../models/product.model.js';

class ProductManager {
    /**
     * Obtener productos con paginación, filtrado y ordenamiento
     * @param {Object} options - Opciones de consulta
     * @param {Number} options.limit - Límite de productos por página (default: 10)
     * @param {Number} options.page - Número de página (default: 1)
     * @param {String} options.sort - Ordenamiento por precio: 'asc' o 'desc'
     * @param {String} options.query - Filtro de búsqueda (ej: 'category:electronics' o 'status:true')
     */
    async getProducts(options = {}) {
        try {
            const limit = parseInt(options.limit) || 10;
            const page = parseInt(options.page) || 1;
            const sort = options.sort;
            const query = options.query;

            // Construir filtro
            let filter = {};
            if (query) {
                // Parsear query: "category:electronics" o "status:true"
                const [field, value] = query.split(':');
                if (field && value) {
                    if (field === 'status') {
                        filter[field] = value === 'true';
                    } else if (field === 'category') {
                        filter[field] = value;
                    }
                }
            }

            // Construir opciones de ordenamiento
            let sortOptions = {};
            if (sort === 'asc') {
                sortOptions.price = 1;
            } else if (sort === 'desc') {
                sortOptions.price = -1;
            }

            // Calcular skip
            const skip = (page - 1) * limit;

            // Ejecutar consulta con paginación
            const products = await Product.find(filter)
                .sort(sortOptions)
                .limit(limit)
                .skip(skip)
                .lean();

            // Contar total de documentos
            const totalDocs = await Product.countDocuments(filter);
            const totalPages = Math.ceil(totalDocs / limit);

            // Construir respuesta con metadata de paginación
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            // Construir links de navegación
            const baseUrl = '/api/products';
            const buildLink = (pageNum) => {
                if (!pageNum) return null;
                let link = `${baseUrl}?page=${pageNum}&limit=${limit}`;
                if (sort) link += `&sort=${sort}`;
                if (query) link += `&query=${query}`;
                return link;
            };

            return {
                status: 'success',
                payload: products,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: buildLink(hasPrevPage ? page - 1 : null),
                nextLink: buildLink(hasNextPage ? page + 1 : null)
            };
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            return product;
        } catch (error) {
            console.error('Error al obtener producto:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            const product = new Product(productData);
            await product.save();
            return product;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error(`El código ${productData.code} ya existe`);
            }
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updateData) {
        try {
            // No permitir actualizar el _id
            delete updateData._id;

            const product = await Product.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!product) {
                throw new Error(`Producto con id ${id} no encontrado`);
            }

            return product;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error(`El código ya existe`);
            }
            console.error('Error al actualizar producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const product = await Product.findByIdAndDelete(id);

            if (!product) {
                throw new Error(`Producto con id ${id} no encontrado`);
            }

            return product;
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            throw error;
        }
    }
}

export default ProductManager;