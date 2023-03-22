declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALCHEMY_WSS_URL: string;
      ALCHEMY_API_KEY: string;
      ESCROW_DEPLOYMENT_ADDRESS: string;
      NEXT_PUBLIC_BUCKET_NAME: string;
      PRIVATE_KEY: string;
      ADMIN_ADDRESS: string;
      NETWORK: string;
    }
  }
}

export {};
