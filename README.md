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

Install Playwright by following the steps detailed in:
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