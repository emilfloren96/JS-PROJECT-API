Key Features
Full CRUD operations: Create, Read, Update, and Delete thoughts
Like (heart) a thought
Data stored in MongoDB with Mongoose models
Input validation (message must be 5-140 characters)
Error handling with proper HTTP status codes
Database seeding with sample data

Tech Stack
Node.js
Express.js
MongoDB + Mongoose
dotenv
API Endpoints

Method	Path	Description
GET	/	API documentation
GET	/thoughts	Get all thoughts (newest first, limit 20)
GET	/thoughts/:id	Get a single thought by ID
POST	/thoughts	Create a new thought
PATCH	/thoughts/:id	Update a thought
DELETE	/thoughts/:id	Delete a thought
POST	/thoughts/:id/like	Like a thought (+1 heart)

Getting Started
Install dependencies: npm install
Create a .env file with your MongoDB connection string:
MONGO_URL=mongodb+srv://your-connection-string
RESET_DB=true
Start the server: npm run dev
After seeding, set RESET_DB=false in .env
View it live
Backend: https://js-project-api-o624.onrender.com/
