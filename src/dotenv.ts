import dotenv from 'dotenv';

let isSetup = false;
export function setup() {
  if (isSetup) return;

  let path = '';

  if (process.env.NODE_ENV) {
    path += `.env.${process.env.NODE_ENV.toLowerCase()}`;
  } else {
    path += '.env';
  }

  dotenv.config({ path });

  isSetup = true;
}

setup();

export default {
  setup,
}
