# Explanation of Scripts:

fetch-openapi: Uses curl to download the latest openapi.json from your FastAPI backend. Ensure your backend is running and accessible at http://localhost:8000/openapi.json. Adjust the URL if your API is hosted elsewhere or on a different port.

generate:models: Invokes openapi-generator-cli to generate TypeScript Axios client code based on the downloaded openapi.json. The generated code will be placed in the ./src/generated directory.

generate: A combined script that first fetches the OpenAPI schema and then generates the models.

prebuild & predev: These are lifecycle scripts that run automatically before npm run build and npm run dev, respectively. This ensures that models are always up-to-date before building or starting the development server.
