# Template and Contract Management System

This project is a **Template and Contract Management System**, built using Node.js, Express, and MongoDB. It allows users to create, manage, and utilize templates and contracts efficiently. The system includes features such as versioning, suggestions, and collaboration between viewers and editors.

---

## Features

### Templates
- **Create Template**: Allows users to create reusable templates for contracts.
- **View Templates**: Fetch all templates or a specific template by ID.
- **Use Template**: Apply a template's content to create or modify contracts.

### Contracts
- **Create Contracts**: Create new contracts from scratch or using templates.
- **View Contracts**: Fetch all contracts, or filter by status (pending, approved, rejected, etc.).
- **Update Contracts**: Edit contracts and save as new versions.
- **Delete Contracts**: Remove contracts permanently.
- **Version Tracking**: Track changes across contract versions.
- **Suggestions**: Allow viewers to provide suggestions for contract modifications.

---

## Installation

### Prerequisites
- **Node.js**: Ensure Node.js is installed (v16 or higher recommended).
- **MongoDB**: Set up a MongoDB instance (local or cloud).

### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/template-contract-management.git
    cd template-contract-management
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/contract-management
     ```

4. Start the server:
    ```bash
    npm start
    ```

5. The API will be available at `http://localhost:5000`.

---

## API Endpoints

### Templates
| Method | Endpoint                 | Description                    |
|--------|--------------------------|--------------------------------|
| POST   | `/api/templates`         | Create a new template          |
| GET    | `/api/templates`         | Fetch all templates            |
| GET    | `/api/templates/:id`     | Fetch a template by ID         |
| GET    | `/api/templates/:id/use` | Apply a template for contracts |

### Contracts
| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | `/api/contracts`          | Create a new contract           |
| GET    | `/api/contracts`          | Fetch all contracts             |
| GET    | `/api/contracts/:id`      | Fetch a contract by ID          |
| PUT    | `/api/contracts/:id`      | Update a contract               |
| DELETE | `/api/contracts/:id`      | Delete a contract               |
| GET    | `/api/contracts/status/:status` | Fetch contracts by status (e.g., pending, approved) |

---

## Folder Structure

```
.
├── src
│   ├── controllers
│   │   ├── contract.controller.ts
│   │   ├── template.controller.ts
│   ├── models
│   │   ├── Contract.ts
│   │   ├── Template.ts
│   ├── routes
│   │   ├── contract.routes.ts
│   │   ├── template.routes.ts
│   ├── utils
│   │   ├── app-err.ts
│   ├── index.ts
├── package.json
├── README.md
```

---

## How to Use

1. Start the server as described in the **Installation** section.
2. Use tools like **Postman** or **cURL** to test API endpoints.
3. Integrate the API with a frontend for a complete application experience.

---

## Future Enhancements
- Add authentication and role-based access control.
- Enable file attachments for contracts.
- Implement real-time notifications for suggestions and updates.
- Add analytics for contract usage and activity tracking.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`.
3. Commit your changes: `git commit -m 'Add feature'`.
4. Push to the branch: `git push origin feature-name`.
5. Open a pull request.

---

## Contact

For queries or support, please contact:

**Emmanuel Arokiaraj**  
Email: [aemmanuel685210@gmail.com](mailto:aemmanuel685210@gmail.com)  
Phone: +91 7397336625  

--- 

Happy coding! 🎉