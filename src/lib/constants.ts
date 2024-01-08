import { ceasarCipher } from "../algorithms";

type Algorithm = {
  name: string;
  title: string;
  description?: string;
  handler: () => Promise<void>;
};

export const algorithms: Algorithm[] = [
  {
    name: "ceasar-cipher",
    title: "Ceasar Cipher",
    description: "Encrypts and decrypts text using the Ceasar Cipher algorithm",
    handler: ceasarCipher,
  },
];
