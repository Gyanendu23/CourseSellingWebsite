# 🎓 Course Selling Platform (Admin & User)

This is a full-stack **Course Selling Website** project featuring two separate interfaces:

- ✅ **User Interface:** Sign up, sign in, view & purchase courses
- ✅ **Admin Dashboard:** Sign up, sign in, create, update & view own courses

Built using **Node.js**, **MongoDB**, and **HTML/CSS/JS** with `Axios` for frontend-backend communication.

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript, Axios
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, Bcrypt, JWT
- **Validation:** Zod

---

## 📁 Project Structure

project-root/
│
├── routes/
│   ├── user.js              # User-specific APIs (signup, signin, purchase)
│   ├── admin.js             # Admin APIs (signup, signin, add/update courses)
│   └── course.js            # Course-related logic (purchase & preview)
│
├── middlewares/
│   └── admin.js             # JWT middleware for admin access
│
├── db.js                    # Mongoose models (User, Admin, Course)
├── config.js                # JWT secret constants
├── server.js                # Entry point for Express server
│
├── admin_index.html         # Admin Dashboard UI
├── user_index.html          # User Website UI
├── .env                     # Env variables (MongoDB, JWT secrets)
└── README.md                # 📄 You're here!


# 1. Clone the repository
git clone https://github.com/Gyanendu23/CourseSellingWebsite
.git
cd your-repo-name

# 2. Install dependencies
npm install

# 3. Set up your environment variables
# Create a .env file in the root directory with the following content:

MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbName>
JWT_SECRET=your_jwt_user_secret
JWT_ADMIN_PASSWORD=your_jwt_admin_secret

# 4. Start the server
node server.js
# The backend will run on http://localhost:3000

#5. Run Frontends
  Open these files in a browser:
  
  user_index.html → for Users
  
  
  admin_index.html → for Admins
