const envMode = process.env.NODE_ENV || "PRODUCTION";
const dbName = process.env.DB_NAME;
const dbUrl = process.env.MONGO_URI;
const clientUrl = process.env.CLIENT_URL;
const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT;

export {envMode, dbName, dbUrl, clientUrl, jwtSecret, PORT};