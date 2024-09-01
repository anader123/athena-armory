const HERMES_ADDRESS = "0x3DDfCf8a5caA6a65451CDc092172911885fBf1B0";
const HEPHAESTUS_ADDRESS = "0x870973bfA656e58373931b6FE2D853cc80d7f2B9";
const ATHENA_ADDRESS = "0x2b54EB55b797554dA7e3026EB9B7f4506040B5c3";

export const GOD_DATA = [
  {
    godName: "Hermes",
    address: HERMES_ADDRESS,
    imgLink: `${process.env.NEXT_PUBLIC_BASE_URL}/hermes-pfp.png`,
  },
  {
    godName: "Hephaestus",
    address: HEPHAESTUS_ADDRESS,
    imgLink: `${process.env.NEXT_PUBLIC_BASE_URL}/hephaestus-pfp.png`,
  },
  {
    godName: "Athena",
    address: ATHENA_ADDRESS,
    imgLink: `${process.env.NEXT_PUBLIC_BASE_URL}/athena-pfp.png`,
  },
];
