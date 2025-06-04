# video_call
This repository offers a space to experiment with videos and Playwright. 
It includes end-to-end automated tests to verify the core functionality of a video calling app.


| Author:       | Fernando Crosa            |
| ------------- |:-------------:            |
| Date          | Jun 2025                  |
| Email         | crosafernando@gmail.com   |


## 1. Clone the Repository

Follow these steps to clone the repository and set up the project locally:

1. Open a terminal on your system.
2. Run the following command to clone the repository:

    ```
    git clone https://github.com/fcrosa/video_call.git
    ```

3. Navigate to the project directory:

    ```
    cd video_call
    ```

## 2. Install Dependencies

### Node and NPM

Ensure you have Node.js and npm installed:
```
node -v
npm -v
``` 

How to install:

_Ubuntu/Debian (Linux)_
```
sudo apt update
sudo apt install nodejs npm
```
_MacOs_
``` 
brew install nodejs
brew install npm
```

## 3. Install Playwright
_Playwright Test was created specifically to accommodate the needs of end-to-end testing. Playwright supports all modern rendering engines including Chromium, WebKit, and Firefox. Test on Windows, Linux, and macOS, locally or on CI, headless or headed with native mobile emulation of Google Chrome for Android and Mobile Safari._

Install Playwright with the following command:
```
npm init playwright@latest
```

_During installation, you must select the following options : 
* ~/src/video_call$ npm init playwright@latest
Getting started with writing end-to-end tests with Playwright:
Initializing project in '.'
* Do you want to use TypeScript or JavaScript? · TypeScript
* Where to put your end-to-end tests? · test_e2e
* Add a GitHub Actions workflow? (y/N) · true
* Install Playwright browsers (can be done manually via 'npx playwright install')? (Y/n) · true
* Install Playwright operating system dependencies (requires sudo / root - can be done manually via 'sudo npx playwright install-deps')? (y/N) · true

Installing Playwright Test (npm install --save-dev @playwright/test)…

added 5 packages, and audited 6 packages in 969ms

found 0 vulnerabilities
* ~/src/video_call/playwright.config.ts already exists. Override it? (y/N) · false
* ~/src/video_call/.github/workflows/playwright.yml already exists. Override it? (y/N) · false

> If you have any questions you can follow the steps detailed in
https://playwright.dev/docs/intro

### Run Tests
You can execute the all tests with the following command:
```
npx playwright test
```

You can execute a subset of tests (by adding the test group tag) with the following command:
```
npx playwright test --grep @regression
```

## 4. Happy Testing!
If you have questions or encounter any issues, feel free to open an Issue in this repository.