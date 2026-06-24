import { cleanEnv } from "envalid";
import { port, str, bool } from "envalid/dist/validators";

const env = cleanEnv(process.env, {
  PORT: port({ default: 5000 }),
  MONGO_URI: str({ default: "mongodb://localhost:27017/medium-clone" }),
  JWT_SECRET: str({ default: "default-secret-do-not-use" }),
  JWT_REFRESH_SECRET: str({ default: "default-refresh-do-not-use" }),
  DEV: bool({ default: true }),
  CLIENT_URL: str({ default: "http://localhost:5173" }),
  email: str({ default: "" }),
  password: str({ default: "" }),
  clientid: str({ default: "" }),
  clientsecret: str({ default: "" }),
  redirect_url: str({ default: "" }),
  SMTP_HOST: str({ default: "" }),
  SMTP_PORT: port({ default: 0 }),
  SMTP_USER: str({ default: "" }),
  SMTP_PASS: str({ default: "" }),
  CLOUDINARY_CLOUD_NAME: str({ default: "" }),
  CLOUDINARY_API_KEY: str({ default: "" }),
  CLOUDINARY_API_SECRET: str({ default: "" }),
});

export default env;
