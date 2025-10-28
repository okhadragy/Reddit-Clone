# Reddit API

This is a simple RESTful API built using **Node.js**, **Express**, and **MongoDB** (via Mongoose) to serve a reddit clone.

---

## 🚀 API Routes Summary

## Admin User Routes (`/admin/users`)

| Method | Route                | Description                                                |
|--------|----------------------|------------------------------------------------------------|
| GET    | `/admin/users`       | Get all users                                              |
| POST   | `/admin/users`       | Create a new user (with photo)                             |
| GET    | `/admin/users/:id`   | Get user profile by ID (optional banner and photo)         |
| PATCH  | `/admin/users/:id`   | Update user by ID                                          |
| DELETE | `/admin/users/:id`   | Delete user by ID                                          |

## User Routes (`/users`)

| Method | Route                  | Description                                                 |
|--------|------------------------|-------------------------------------------------------------|
| POST   | `/users/signup`        | User signup (with optional photo)                           |
| POST   | `/users/login`         | User login                                                  |
| POST   | `/users/changePassword`| Change password                                             |
| GET    | `/users`               | Get logged-in user's profile                                |
| PATCH  | `/users`               | Update logged-in user's profile (optional banner and photo) |
| DELETE | `/users`               | Delete logged-in user                                       |
| GET    | `/users/:id/follow`    | Toggle follow or unfollow a user                            |


## Post Routes (`/posts`)

| Method | Route              | Description                                |
|--------|--------------------|--------------------------------------------|
| POST   | `/posts`           | Create a new post (optional up to 5 media) |
| GET    | `/posts`           | Get all posts                              |
| GET    | `/posts/:id`       | Get a post by ID                           |
| PATCH  | `/posts/:id`       | Update a post  (optional up to 5 media)    |
| DELETE | `/posts/:id`       | Delete a post                              |
| POST   | `/posts/vote`      | Vote to post (upvote up or downvote)       |

## Comment Routes (`/comments`)

| Method | Route                        | Description                              |
|--------|------------------------------|------------------------------------------|
| POST   | `/comments/post/:postId`     | Add a new comment to a post              |
| PATCH  | `/comments/:commentId`       | Update a comment                         |
| DELETE | `/comments/:commentId`       | Delete a comment                         |
| POST   | `/comments/:commentId/vote`  | Vote to comment (upvote up or downvote)  |

---

### Data Management Commands

You can manage your data using the following npm scripts:

| Command                                    | Description                                         |
|--------------------------------------------|-----------------------------------------------------|
| `npm run insert -- <modelName> <filePath>` | Insert data into a model from a JSON file           |
| `npm run delete -- <modelName>`            | Delete all data from a model                        |
| `npm run upsert -- <modelName> <filePath>` | Update or insert data into a model from a JSON file |

**Example:**

```bash
npm run insert -- user ./users.json
```

---
## 💻 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/okhadragy/Reddit-Clone
cd "Reddit-Clone\Reddit"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a .env file in the Reddit folder with:

```bash
MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=your_mongodb_db_name
PORT=port_number
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=token_expiration_duration
```

### 4. Add test data

```bash
npm run insert -- user ./users.json
npm run insert -- post ./posts.json
npm run insert -- comment ./comments.json
npm run insert -- community ./communities.json
npm run insert -- achievement ./achievements.json
```

### 5. Run the Project

```bash
npm start
```

Server will run at: http://localhost:PORT

