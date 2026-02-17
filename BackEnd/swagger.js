import swaggerJsdoc from "swagger-jsdoc";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Parcel Courier Service API",
      version: "1.0.0",
      description: "API documentation for Parcel Courier Service backend",
    },
    servers: [
      {
        url: "http://localhost:5500",
      },
    ],
  },

  // Adjust this path according to your folder structure
  apis: ["./routes/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
