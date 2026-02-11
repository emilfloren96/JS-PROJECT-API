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


Frontend: https://js-project-happy-thoughts.pages.dev/

Backend: https://js-project-api-o624.onrender.com/

