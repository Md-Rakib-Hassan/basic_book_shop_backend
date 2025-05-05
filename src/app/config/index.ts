import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_uri: process.env.DATABASE_URI,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expiration: process.env.JWT_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expiration: process.env.JWT_REFRESH_EXPIRES_IN,
  ssl_store_id: process.env.SSL_STORE_ID,
  ssl_store_passwd: process.env.SSL_STORE_PASSWORD,
  base_url: process.env.BASE_URL,
};
