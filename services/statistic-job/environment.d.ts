declare global {
  namespace NodeJS {
    interface ProcessEnv {
      OPENSEA_API_KEY: string;
      ETHERSCAN_API_KEY: string;
      DATABASE_URL: string;
    }
  }
}

export {};
