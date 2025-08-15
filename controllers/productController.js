const Product = require("../models/productModel");

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, quantity, categoryId, size, color } = req.body;
        let imageUrl = null;

        if (req.files && req.files.length > 0) {
            if (req.files.length === 1) {
                imageUrl = `uploads/${req.files[0].filename}`;
            } else {
                imageUrl = req.files.map(file => `uploads/${file.filename}`);
            }
        }

        const newProduct = await Product.create({
            name,
            description,
            price,
            quantity,
            imageUrl,
            categoryId,
            size,
            color
        });

        res.status(201).json({
            message: "Tạo sản phẩm thành công",
            data: newProduct
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy tất cả sản phẩm có phân trang
exports.getAllProducts = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find({})
                .select("name description price quantity size color categoryId createdAt imageUrl")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Product.countDocuments()
        ]);

        res.status(200).json({
            message: "Lấy danh sách sản phẩm thành công",
            data: {
                totalProducts: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                products
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy 1 sản phẩm theo ID
exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Lấy sản phẩm theo category
exports.getProductByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const products = await Product.find({ categoryId }).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để xóa" });
        }
        res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity, categoryId, size, color } = req.body;
        let updateData = { name, description, price, quantity, categoryId, size, color };

        if (req.files && req.files.length > 0) {
            if (req.files.length === 1) {
                updateData.imageUrl = `uploads/${req.files[0].filename}`;
            } else {
                updateData.imageUrl = req.files.map(file => `uploads/${file.filename}`);
            }
        }

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm để cập nhật" });
        }

        res.status(200).json({ message: "Cập nhật sản phẩm thành công", data: product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
