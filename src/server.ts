import { app } from "./app.ts";
import swaggerDocs from './docs.ts';
import { disconnectDB } from "./db/db.ts";

const port = 8080;

const server = app.listen(port,  () => {
    console.log(`Server running at localhost:${port}`);
    swaggerDocs(app, port)
});

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
    console.error("Uncaught Exception:", err);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down gracefully");
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
  });
});