# generate-next-app
_work in progress_

Just a wrapper on top of create-next-app cli to create nextjs applications with my own custom packages and configurations.
This CLI creates a custom nextjs app with the following features:
* Graphql support integrated with react-query and Graphql Codegen
* TailwindCSS with a custom configuration and optimization.
* Nprogress integrated to improve ux in page transitions
* Prettier formatter integrated with eslint
* Jest integrated with @testing-library
* Cypress Setup
* Webpack alias and ts-paths
* Webpack Bundle analyzer

![CLI](img/cli.png)


## Requeriments
* node version > 12.20