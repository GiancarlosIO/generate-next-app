export default `
import type { NextPage } from 'next';

const Home: NextPage = () => {
  return (
    <div className="w-screen h-screen">
      <div
        className="mx-auto pt-20"
        style={{
          width: 800,
        }}
      >
        <h1 className="text-center font-bold text-4xl text-green-600 mb-8">
          Welcome to your custom Nextjs App!
        </h1>
        <p className="text-xl mb-4">
          This Custom Nextjs App has the follows features:
        </p>
        <ul className="text-xl list-disc list-inside mb-4">
          <li>Graphql support integration with react-query</li>
          <li>TailwindCSS with a custom configuration and optimization.</li>
          <li>Nprogress integrated to improve ux in page transitions</li>
          <li>Prettier formatter integrated with eslint</li>
          <li>Jest integrated with @testing-library</li>
          <li>Cypress Setup</li>
          <li>Webpack alias and ts-paths</li>
          <li>Webpack Bundle analyzer</li>
        </ul>
        <p className="text-xl">Read the full documentation in:</p>
        <a
          href="https://github.com/GiancarlosIO/create-next-app-nexus"
          className="text-xl text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          https://github.com/GiancarlosIO/create-next-app-nexus
        </a>
      </div>
    </div>
  );
};

export default Home;

`