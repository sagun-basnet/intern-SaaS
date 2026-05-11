const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🚀 SaaS Job & Internship Portal API',
      version: '1.0.0',
      description:
        'A role-based SaaS platform API for Job Seekers, Companies, and Admins. Built with Node.js, Express, Prisma, and MySQL.',
      contact: {
        name: 'Lunar Intern',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from /api/auth/login',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'array', items: {} },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        // Auth schemas
        RegisterInput: {
          type: 'object',
          required: ['email', 'password', 'role'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', minLength: 6, example: 'password123' },
            role: { type: 'string', enum: ['SEEKER', 'COMPANY'], example: 'SEEKER' },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                token: { type: 'string' },
                user: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer' },
                    email: { type: 'string' },
                    role: { type: 'string' },
                  },
                },
              },
            },
          },
        },
        // Profile schemas
        ProfileInput: {
          type: 'object',
          required: ['fullName'],
          properties: {
            fullName: { type: 'string', example: 'John Doe' },
            bio: { type: 'string', example: 'Passionate developer' },
            skills: { type: 'string', example: 'JavaScript, React, Node.js' },
            phone: { type: 'string', example: '+1234567890' },
            location: { type: 'string', example: 'Kathmandu, Nepal' },
          },
        },
        // Company schemas
        CompanyInput: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'TechCorp Pvt Ltd' },
            description: { type: 'string', example: 'Leading software company' },
            website: { type: 'string', example: 'https://techcorp.com' },
            location: { type: 'string', example: 'Lalitpur, Nepal' },
          },
        },
        // Job schemas
        JobInput: {
          type: 'object',
          required: ['title', 'description', 'location', 'type'],
          properties: {
            title: { type: 'string', example: 'Junior React Developer' },
            description: { type: 'string', example: 'We are looking for...' },
            location: { type: 'string', example: 'Remote' },
            type: { type: 'string', enum: ['INTERNSHIP', 'FULL_TIME', 'PART_TIME', 'CONTRACT'] },
            salary: { type: 'string', example: 'NPR 30,000 - 50,000' },
            skills: { type: 'string', example: 'React, JavaScript, CSS' },
            deadline: { type: 'string', format: 'date-time' },
          },
        },
        // Notification schemas
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            userId: { type: 'integer', example: 5 },
            title: { type: 'string', example: 'New Application Received' },
            message: { type: 'string', example: 'Someone applied for your job.' },
            type: { type: 'string', example: 'NEW_APPLICATION' },
            isRead: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.routes.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
