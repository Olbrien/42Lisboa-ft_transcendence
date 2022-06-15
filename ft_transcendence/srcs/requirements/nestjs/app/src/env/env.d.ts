declare global {
  namespace NodeJS {
    interface ProcessEnv {
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_DB: string;
      POSTGRES_HOST_PORT: string;

      ENVIRONMENT: string;
      DEBUG: string;
    }
  }
}

export {};
