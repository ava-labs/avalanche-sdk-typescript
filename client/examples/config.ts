import { config } from "dotenv";
import path from "path";

// Loads environment variables from .env.example file
// change this to .env when running locally for your
// own private keys
config({ path: path.resolve(__dirname, ".env.example") });

export type Config = {
  privateKeyAccount1: string;
  privateKeyAccount2: string;
};

export const loadConfig = (): Config => {
  const privateKeyAccount1 = process.env.PRIVATE_KEY_ACCOUNT_1;
  const privateKeyAccount2 = process.env.PRIVATE_KEY_ACCOUNT_2;

  if (!privateKeyAccount1 || !privateKeyAccount2) {
    throw new Error(
      "PRIVATE_KEY_ACCOUNT_1 or PRIVATE_KEY_ACCOUNT_2 is not found in env"
    );
  }

  return {
    privateKeyAccount1,
    privateKeyAccount2,
  };
};
