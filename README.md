
# SSV Web

# Development

### Running application

<div align="center">

[comment]: <> (download)
![Downloads][github-releases-download]
[![Build Status][github-actions-status]][github-actions-url]
[![Github Tag][github-tag-image]][github-tag-url]
[![Discord](https://discord.com/api/guilds/723834989506068561/widget.png?style=shield)](http://bit.ly/30HwvsC)
</div>




`yarn start`

Runs the app in the development mode<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### Testing

`yarn test` - no watching mode

`yarn test:dev` - run tests in watch mode

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Building

`yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Linting

`yarn lint`

Lint checks works on every change of source code.

Also, lint happens before developer tries to commit (husky package).

### Git Commits

As said upper, on every commit attempt husky runs linter to check source code.

### Git Pushes

On every push attempt tests are running to check that changes are not break anything.
## Tech Stack

- <a href="https://reactjs.org/">React 16.8</a> - To handle front end tasks in scale
- <a href="https://reacttraining.com/react-router/web/guides/quick-start">React Router</a> - For application navigation and routing
- <a href="https://mobx.js.org/README.html">Mobx</a> - A UI state management and middleware to handle async operations
- <a href="https://material-ui.com/">Material UI</a> - A React library to make styling more dynamic and easy
- <a href="https://www.typescriptlang.org/">TypeScript</a> and <a href="https://eslint.org/">ESlint</a> - For better development experience, linting errors, type checking, auto complete and more
- <a href="https://jestjs.io/">Jest JS</a> and <a href="https://reactjs.org/docs/test-renderer.html">React Test Renderer</a> - Testing tools for React applications

## Docs (TBD)

See our [docs and guides here](https://www.bloxstaking.com/blox-blog/)

## Maintainers
- [Demitri Meshin](https://github.com/meshin-blox)
- [Guy Muroch](https://github.com/guym-blox)
- [Lior Rutenberg](https://github.com/lior-blox)

## License

GPL © [Blox SSV](https://github.com/bloxapp/ssv-web)

[github-actions-status]: https://github.com/bloxapp/ssv-web/workflows/Test/badge.svg?branch=stage
[github-releases-download]: https://img.shields.io/github/downloads/guym-blox/ssv-web/total
[github-actions-url]: https://github.com/bloxapp/ssv-web/actions
[github-tag-image]: https://img.shields.io/github/v/tag/bloxapp/ssv-web.svg?label=version
[github-tag-url]: https://github.com/bloxapp/blox-live.svg/releases/latest
[david-dev-image]: https://david-dm.org/bloxapp/blox-live/stage/dev-status.svg
[david-dev-url]: https://david-dm.org/bloxapp/blox-live/stage?type=dev	
