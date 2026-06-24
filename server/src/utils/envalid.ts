import { cleanEnv } from "envalid";
import { port, str, bool } from "envalid/dist/validators";

const env = cleanEnv(process.env, {
  PORT: port(),
  MONGO_URI: str(),
  JWT_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
  DEV: bool(),
  CLIENT_URL: str(),
  email: str(),
  password: str(),
  clientid: str(),
  clientsecret: str(),
  redirect_url: str(),
  SMTP_HOST: str({ default: "" }),
  SMTP_PORT: port({ default: 0 }),
  SMTP_USER: str({ default: "" }),
  SMTP_PASS: str({ default: "" }),
});

export default env;
