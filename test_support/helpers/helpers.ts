import { expect, test, Page } from '@playwright/test';
import videoAttributes from './videoAttributtes.ts';
import testUserData from '../test_data/login_data_valid.json';
import testInvalidUserData from '../../test_support/test_data/login_data_example.json';

const user: TestUser = testUserData;
const invalidUser: TestUser = testInvalidUserData;

type TestUser = {
  description: string;
  appToken: string;
  appId: string;
  channelName: string;
  userId: string;
};

// Go to URL
export async function gotToURL(page: Page, baseURL: string): Promise<void> {
  await test.step('User goes to '+ baseURL, async () => {
    await page.goto(baseURL);
  });
}

// User open the Video Call URL
export async function userOpensVideoCallURL(page: Page): Promise<void> {
  const videoCallURL = 'https://webdemo.agora.io/basicVideoCall/index.html';
  await gotToURL(page, videoCallURL);
}

// User Joins the video call
export async function userJoinsTheCall(page: Page, user: TestUser): Promise<void> {
  await fillInputTextByName(page,'Enter the appid', 'APPLICATION ID', user.appId);
  await fillInputTextByName(page,'Enter the app token', 'TOKEN ID', user.appToken);
  await fillInputTextByName(page,'Enter the channel name', 'CANNEL NAME', user.channelName);
  await fillInputTextByName(page,'Enter the user ID', 'USER ID', user.userId);
  await clickBtnByName(page,'Join');
}

// Unauthorized User cannot joins the video call
export async function userCannotJoinsTheCall(page: Page): Promise<void> {
  await fillInputTextByName(page,'Enter the appid', 'APPLICATION ID', invalidUser.appId);
  await fillInputTextByName(page,'Enter the app token', 'TOKEN ID', invalidUser.appToken);
  await fillInputTextByName(page,'Enter the channel name', 'CANNEL NAME', invalidUser.channelName);
  await fillInputTextByName(page,'Enter the user ID', 'USER ID', invalidUser.userId);
}

// Valid User Joins the video call
export async function validUserJoinsTheCall(page: Page): Promise<void> {
  await fillInputTextByName(page,'Enter the appid', 'APPLICATION ID', user.appId);
  await fillInputTextByName(page,'Enter the app token', 'TOKEN ID', user.appToken);
  await fillInputTextByName(page,'Enter the channel name', 'CANNEL NAME', user.channelName);
  await fillInputTextByName(page,'Enter the user ID', 'USER ID', user.userId);
  await clickBtnByName(page,'Join');
}

// Validate a text alert
export async function validateAlertText(page: Page, alertId: string, expectedText: string): Promise<void> {
  await test.step("User should see an Alert", async () => {
    const alertLocator = page.locator(`#${alertId}`).first(); 
    await alertLocator.waitFor({ state: 'visible' }); 
    await expect(alertLocator).toBeVisible(); 
    await expect(alertLocator).toContainText(expectedText);
  });
}

// Validate a text alert is not present
export async function validateAlertIsNotPresent(page: Page, alertId: string): Promise<void> {
  await test.step("User should not see the Alert", async () => {
    const alertLocator = page.locator(`#${alertId}`).first();
    await expect(alertLocator).toBeHidden();
  });
}

// Validate the user joined the video call
export async function validateVideoCallLaunched(page: Page, videoId: string): Promise<void> {
  await test.step("User joined the video call", async () => {
    const videoElement = await page.waitForSelector(`${videoId}`);
    if (videoElement) {
      // get video_element_id
      const video_element_id = await videoElement.getAttribute('id');
      const videoLocator = page.locator(`#${video_element_id}`);
      await expect(videoLocator).toBeVisible();
    }
  });
}

//Inspect Basic Video Properties
export async function inspectVideoProperties(page: Page, videoId: string): Promise<void> {
  const videoElement = await page.waitForSelector(`${videoId}`);
  if (videoElement) {
    // Click
    await videoElement.click();

    // get video_element_id
    const video_element_id = await videoElement.getAttribute('id');
    console.log('Element ID: ', video_element_id);

    const videoLocator = page.locator(`#${video_element_id}`);
    await expect(videoLocator).toBeVisible();

    // Locate video element
    const e = await page.locator(`#${video_element_id}`);

    await expect(e).toBeVisible();

    const videoProperties = await e.evaluate((el, keys) => {
      const props: Record<string, any> = {};
        for (const key of keys) {
          if (key in el) {
            props[key] = (el as any)[key];
          }
        }
      return props;
    }, videoAttributes);

    // Print console logs
    console.log("videoProperties: ", videoProperties);
  }
}

// Fill Input Text by Name
export async function fillInputTextByName(page: Page, name: string, description: string, inputText: string): Promise<void> {
  await test.step(`User fills '${description}' text-box`, async () => {
    await page.getByRole('textbox', { name: name }).fill(inputText);
  });
}

// Click button by Name
export async function clickBtnByName(page: Page, name: string): Promise<void> {
  await test.step(`User clicks on '${name}' button`, async () => {
    await page.getByRole('button', { name: name }).click();
  });
}

// Click Link by Name
export async function clickLinkByName(page: Page, name: string): Promise<void> {
  await test.step(`User selects '${name}'`, async () => {
    await page.getByRole('link', { name: name }).click();
  });
}

// Check Radio by Name
export async function checkRadioByName(page: Page, name: string): Promise<void> {
  await test.step(`User selects '${name}' CODEC`, async () => {
    await page.getByRole('radio', { name: name }).check();
  });
}

// Validate UI Headers elements
export async function validateUIHeaders(page: Page,): Promise<void> {
  await test.step("User should see headers text elements", async () => {
    await expect(page.locator('#join-form')).toContainText('You find your APP ID in the Agora Console');
    await expect(page.locator('#join-form')).toContainText('To create a temporary token, edit your project in Agora Console.');
    await expect(page.locator('#join-form')).toContainText('You create a channel when you create a temporary token. You guessed it, in Agora Console');
  });
}
