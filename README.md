# microservice-ecommerce-be

# 🛒 Microservice E-Commerce

This project is a microservice-based e-commerce backend system designed for scalability, modularity, and cloud deployment (AWS-ready). It features separate services for product catalog, cart management, order processing, and payments — communicating over REST APIs and asynchronous messaging (RabbitMQ/SQS).

---

## 📌 Architecture Overview

- **Catalog Service**: Manage product listings, categories, and stock levels.
- **Cart Service**: Handle user shopping carts (session-based, using Redis).
- **Order Service**: Manage order creation, history, and status.
- **Payment Service**: Integrate payment gateway (Razorpay).
- **Message Broker**: RabbitMQ or AWS SQS for async order/payment flow.
- **Database per Service**: DynamoDB.

---

## 🚀 Tech Stack

- **Node.js / Express.js**
- **DynamoDB**
- **Redis** (for cart + caching + otp verification)
- **RabbitMQ / AWS SQS**
- **JWT + Bcrypt** (Auth)
- **Postman** (API documentation)

---

🛡 Security
✅ JWT Authentication
✅ Role-Based Access Control (admin, user)
✅ Secure API design best practices

🌐 Deployment Plan
Local: Docker Compose

Cloud: AWS ECS / Fargate or EKS

Use CloudFormation / Terraform for infra-as-code (future enhancement)

✍ Author
Naitik Ramteke

LinkedIn:[https://link](https://www.linkedin.com/in/naitik-ramteke)

📃 License
MIT

---
