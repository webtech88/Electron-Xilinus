# AngularElectron

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.2.7.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## To Run Electron Application in Development Mode

### Development Mode ( auto build )

You can edit source code and see the changes if you refresh the page `cmd+r`

1. Build the application: `npm run build`
2. Open another terminal and run electron app: `npm run electron:hmr`

### Production Mode

1. Build the application: `npm run build:prod`
2. Run electron app: `npm run electron:prod`

1. Get a signing certificate.
2. Place

## To package the application

Before package the application, you should first set `CSC_LINK` and `CSC_KEY_PASSWORD` for code signing. Please refer to this [page](https://github.com/electron-userland/electron-builder/wiki/Code-Signing)

For Windows: `npm run release:win`
For Mac: `npm run release:mac`
For Linux: `npm run release:linux`
To build for all platforms: `npm run release:all`

To clean the built packages: `npm run clean`

## Testing auto-update in localhost

### Prerequisites
Install `http-server` npm module globally: `npm install -g http-server`

1. In `src/electron/package.json`, increase the version number.
2. Package the application: `npm run release:all`
3. Server the `release` folder: `http-server release`
4. In browser, go to `localhost:8080` and download the app.
5. Install the application.
6. Repeat from step 1 & 2 in other terminal.
7. Open the installed app.

Note: When you open a new terminal, please make sure the `CSC_LINK` and `CSC_KEY_PASSWORD` variables are set correctly in order to avoid code signing errors & warnings.