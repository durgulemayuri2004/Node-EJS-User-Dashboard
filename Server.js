const express = require("express");
const path = require("path");

const app = express();
const PORT = 5000;

const users = []; 

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Form.html"));
});

app.get("/users", (req, res) => {
  res.render("users", { allUsers: users });
});

app.post("/submit", (req, res) => {
  const userData = req.body; 
  const errors = [];

  if (!userData.fullname || userData.fullname.trim().length < 3) {
    errors.push("Name is required and must be at least 3 characters.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userData.email || !emailRegex.test(userData.email)) {
    errors.push("Please provide a valid email address.");
  }
  const age = parseInt(userData.age);
  if (!userData.age || isNaN(age) || age < 18 || age > 99) {
    errors.push("Age must be a number between 18 and 99.");
  }
  if (!userData.city || userData.city.trim() === "") {
    errors.push("City is required.");
  }
  if (!userData.gender) {
    errors.push("Please select a gender.");
  }
  if (!userData.skills) {
    errors.push("Please select at least one skill.");
  }
  if (!userData.bio || userData.bio.trim().length < 10) {
    errors.push("Bio must be at least 10 characters long.");
  }

  if (errors.length > 0) {
    return res.render("error", { errors: errors }); 
  }

  const newUser = {
    id: Date.now(), 
    ...userData     
  };
  users.push(newUser); 
  console.log("New user added. Total users:", users.length);

  res.render("result", { user: newUser });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.stdin.resume();
