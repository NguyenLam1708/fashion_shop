db = db.getSiblingDB('fashion_shop');  

db.createCollection("users");         

db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "$2b$10$IUQh/mI0o1HmzGsSPREc1elCk2TjSlXdzJdTii277a.2v9ha4Xt3y",
  role: "admin",
  status: "active"
});
