import swaggerJSDoc, { OAS3Options } from "swagger-jsdoc";

const swaggerOptions: OAS3Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "A simple Express API",
    },
  },
  apis: ["./routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
