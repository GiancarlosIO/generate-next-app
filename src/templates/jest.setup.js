import path from 'path';
import '@testing-library/jest-dom/extend-expect';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
}

jest.setTimeout(10000); // in milliseconds

// copied from https://github.com/vercel/next.js/issues/26749#issuecomment-885431747
jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'Next image stub'; // whatever
  },
}));

// https://stackoverflow.com/questions/57008341/jest-testing-react-component-with-react-intersection-observer
// const intersectionObserverMock = () => ({
//   observe: () => null,
//   disconnect: () => null,
//   unobserve: () => null,
// });
