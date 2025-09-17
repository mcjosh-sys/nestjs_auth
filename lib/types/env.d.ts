namespace NodeJS {
  interface ProcessEnv {
    APP_LISTEN_PORT: string;
    APP_LISTEN_HOST: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    JWT_REFRESH_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GOOGLE_CALBACK_URL: string;
  }
}
