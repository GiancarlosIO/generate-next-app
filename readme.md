# create-next-app-nexus
_work in progress_

Just a wrapper on top of create-next-app cli to create nextjs applications with my own custom packages and configurations.
This CLI creates a custom nextjs app with the following features:
* Graphql support integration with react-query
* TailwindCSS with a custom configuration and optimization.
* Nprogress integrated to improve ux in page transitions
* Prettier formatter integrated with eslint
* Jest integrated with @testing-library
* Cypress Setup
* Sentry integration
* Github actions to run linters, typecheck and jest and cypress tests
