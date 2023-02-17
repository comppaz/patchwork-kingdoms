declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALCHEMY_WSS_URL: string;
      ALCHEMY_API_KEY: string;
      ESCROW_DEPLOYMENT_ADDRESS: string;
    }
  }
}

export {};
