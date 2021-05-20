
<div align="center">


[comment]: <> (download)
![Downloads][github-releases-download]
[![Build Status][github-actions-status]][github-actions-url]
[![Github Tag][github-tag-image]][github-tag-url]
[![Discord](https://discord.com/api/guilds/723834989506068561/widget.png?style=shield)](http://bit.ly/30HwvsC)
</div>
<br>


# SSV - Secret Shared Validator

The underlying design of the Ethereum 2.0 blockchain, requires validators to operate using a validation key that is stored on a hot wallet, which is risky due to its security and performance properties and serves as a single point of failure.
Distributing validators’s validation key through secret sharing between multiple operators mitigates this risk and helps make the blockchain more decentralized.

### Add Validator

### Add Operator

### Cli
Another option we support is a CLI, all you need to do is to run the following command with the relevant arguments, and you receive a full translation data
```
ssv-cli --filePath=<keyStore> --password=<ketStore password> --operators=[<base64 operator key>] (4 operators require)
```

### Testing

## Tech Stack
- <a href="https://web3js.readthedocs.io/en/v1.3.4/">Web3.js</a> - BlockChain integration for Web2
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

GPLv3 © [Blox SSV](https://github.com/bloxapp/ssv-web)

[github-actions-status]: https://github.com/bloxapp/ssv-web/workflows/Test/badge.svg?branch=stage
[github-releases-download]: https://img.shields.io/github/downloads/guym-blox/ssv-web/total
[github-actions-url]: https://github.com/bloxapp/ssv-web/actions
[github-tag-image]: https://img.shields.io/github/v/tag/bloxapp/ssv-web.svg?label=version
[github-tag-url]: https://github.com/bloxapp/blox-live.svg/releases/latest
[david-dev-image]: https://david-dm.org/bloxapp/blox-live/stage/dev-status.svg
[david-dev-url]: https://david-dm.org/bloxapp/blox-live/stage?type=dev	
