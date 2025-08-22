db = db.getSiblingDB('fashion_shop');  

db.createCollection("users");         
db.createCollection("categories");         

// Tạo user admin
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "$2b$10$IUQh/mI0o1HmzGsSPREc1elCk2TjSlXdzJdTii277a.2v9ha4Xt3y",
  role: "admin",
  status: "active"
});

// Tạo dữ liệu mẫu cho categories
db.categories.insertMany([
  { name: "Quần áo nam" },
  { name: "Quần áo nữ" },
  { name: "Giày dép" },
  { name: "Phụ kiện" }
]);