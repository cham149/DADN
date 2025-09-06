import { Category } from "../database/database.js";

// Lấy danh sách danh mục
export const getCategories = async (req, res) => {
  try {
    const danhMucList = await Category.find({});
    res.json(danhMucList);
  } catch (err) {
    console.error(" Lỗi lấy danh mục:", err);
    res.status(500).json({ message: "Lỗi server khi lấy danh mục" });
  }
};

// Thêm danh mục
export const createCategory = async (req, res) => {
  try {
    const { tenDanhMuc, moTa } = req.body;

    const newCategory = new Category({ tenDanhMuc, moTa });
    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Lỗi tạo danh mục:", err);

    // Trả chi tiết lỗi validation
    if (err.name === "ValidationError") {
      const details = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: "Validation Error", details });
    }

    // Trường hợp trùng unique key
    if (err.code === 11000) {
      return res.status(400).json({ message: `Danh mục "${err.keyValue.tenDanhMuc}" đã tồn tại` });
    }

    res.status(500).json({ message: "Lỗi server khi tạo danh mục" });
  }
};

// Xóa danh mục
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy danh mục" });
    res.json({ message: "Xóa thành công", category: deleted });
  } catch (err) {
    console.error(" Lỗi xóa danh mục:", err);
    res.status(500).json({ message: "Lỗi server khi xóa danh mục" });
  }
};
