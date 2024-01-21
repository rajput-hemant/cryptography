import {
  ceasarCipher,
  multiplicativeCipher,
  autoKeyCipher,
} from "../algorithms";

type Algorithm = {
  name: string;
  title: string;
  description?: string;
  handler: () => Promise<void>;
};

export const algorithms: Algorithm[] = [
  {
    name: "autokey-cipher",
    title: "Auto Key Cipher",
    description:
      "\nIt is a polyalphabetic substitution cipher closely related to the Vigenere cipher. It uses a different method of generating the key. In this cipher, the key is extended by appending the plaintext to it. It was invented by Blaise de Vigenère in 1586 and is generally considered more secure than the Vigenere cipher.\n",
    handler: autoKeyCipher,
  },
  {
    name: "ceasar-cipher",
    title: "Ceasar Cipher (Additive Cipher)",
    description:
      "\nAlso known as the Additive Cipher, is a simple encryption technique where each letter in the plaintext is shifted a certain number of places down or up the alphabet. It is named after Julius Caesar, who is historically known to have used this cipher.\n",
    handler: ceasarCipher,
  },
  {
    name: "multiplicative-cipher",
    title: "Multiplicative Cipher",
    description:
      "\nIt is an encryption algorithm that uses multiplication to transform the plaintext. It is a type of substitution cipher where each letter in the plaintext is replaced with a letter obtained by multiplying its numerical equivalent by a constant factor.\n",
    handler: multiplicativeCipher,
  },
];
