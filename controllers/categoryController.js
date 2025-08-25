const Category = require("../models/categoryModel")

// Tạo category
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // 1. Kiểm tra dữ liệu đầu vào
        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Tên category không được bỏ trống" });
        }

        // 2. Tạo mới category
        const newCategory = await Category.create({ name: name.trim() });

        // 3. Trả về kèm dữ liệu mới tạo
        return res.status(201).json({
            message: "Tạo category thành công",
            data: newCategory
        });
    } catch (error) {
        console.error(error);

        // 4. Bắt lỗi trùng tên
        if (error.code === 11000) {
            return res.status(400).json({ message: "Category đã tồn tại" });
        }

        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// lấy tất cả category
exports.getAllCategories = async(req,res) =>{
    try{
        let{page = 1, limit = 10} = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1)* limit;

        const [categories, total] = await Promise.all([
            Category.find({})
                    .select("name createAt")
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
            Category.countDocuments()
        ])

        return res.status(200).json({
            message: "Lấy danh sách category thành công",
            data: {
                totalCategories: total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                categories
            }
        });

    }catch(error){
        console.error(error);
        return res.status(500).json({message:"Lỗi server", error: error.message})
    }
}
// chỉnh sửa category
exports.updateCategory = async(req,res) =>{
    try{
        const{categoryId} = req.params;
        const {name} = req.body;
        const category = await Category.findByIdAndUpdate(
            categoryId,
            { name },          // 👈 ở đây phải là object
            { new: true, runValidators: true } // new: trả về bản ghi mới, runValidators: chạy validate schema
        );        
        if(!category){
            return res.status(404).json({message:"Không tìm thấy category"})
        }
        res.status(200).json({ message: "Cập nhật category thành công", data: category });
    }catch(error){
        if (error.code === 11000) {
            return res.status(400).json({ message: "Tên category đã tồn tại" });
        }
        console.error(error)
        return res.status(500).json({message:"Lỗi server", error: error.message})
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const category = await Category.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ message: "Không tìm thấy category để xóa" });
        }
        res.status(200).json({ message: "Xóa category thành công" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};