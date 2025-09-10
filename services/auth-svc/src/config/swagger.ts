import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Citation System - Auth Service API',
      version: '1.0.0',
      description: 'Authentication and user management API for citation management system',
      contact: {
        name: 'Citation System Team'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'http://localhost:8080/auth',
        description: 'Development server via proxy'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'officer', 'user'] },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            phone: { type: 'string' },
            badgeNumber: { type: 'string' },
            department: { type: 'string' },
            isActive: { type: 'boolean' },
            emailVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            user: { $ref: '#/components/schemas/User' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts']
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }'
  }));
};