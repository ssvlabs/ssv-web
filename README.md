
# SSV Web

# Development

### Running application

`yarn start`

Runs the app in the development mode<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### Testing

#### Functional Tests

`yarn test` - no watching mode

`yarn test:dev` - run tests in watch mode

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### E2E Tests

##### Unzip dependencies

```
unzip cypress/plugins/MetaMask/metamask-chrome-9.5.0.zip
```

```
unzip cypress/integration/ssv/cli/eth2.0-deposit-cli-master.zip
```

##### Install deposit CLI dependencies

For the virtualenv users, you can create a new venv:

```
cd cypress/integration/ssv/cli/eth2.0-deposit-cli-master
pip3 install virtualenv
virtualenv .venv
source .venv/bin/activate
```

and install the dependencies:

```
python3 setup.py install
pip3 install -r requirements.txt
pip3 install pytest
```

Check that tests are passing before starting using deposit CLI for auto-generation of keystore files during running cypress:

```
cd cypress/integration/ssv/cli/eth2.0-deposit-cli-master
source .venv/bin/activate
python3 -m pytest .
```

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

# Documentation

# LICENCE
