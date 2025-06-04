/*
  This video test was created by Fernando Crosa (June 2025) crosafernando@gmail.com 
  To test video calling by simulating different network scenarios using Playwright for Basic Video Call Project  
  To run the this suite of tests execute `npx playwright test --grep @network` using the console.
  To run the regression tests execute `npx playwright test --grep @regression` using the console.
  To run all tests execute `npx playwright test` and `npx playwright show-report` to see the report
*/

import { test, expect} from '@playwright/test';
import * as Helpers from '../../test_support/helpers/helpers';

test.beforeEach(async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ['camera', 'microphone'], 
  });

  const page = await context.newPage();
  // Intercept requests and degrade the network
  await test.step("Intercept requests and degrade the network", async () => {
    await context.route('**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.continue();
    });
  });
});

//Test Name
test.describe("Video Call UI - Network Scenarios", () => {

  test('User without credentials cannot join the room with a low-speed connection', { tag:['@regression','@network'] }, 
    async ({ page }) => {
    // User cannot join the video call
    await Helpers.userOpensVideoCallURL(page);
    await Helpers.userCannotJoinsTheCall(page);
    await Helpers.clickBtnByName(page,'Join');
    await Helpers.validateAlertIsNotPresent(page,'success-alert-with-token');
  });

  test('User joins the room and accesses the video call with a low-speed connection', { tag: ['@regression','@network'] }, 
    async ({ page }) => {
    // User joins video call        
    await Helpers.userOpensVideoCallURL(page);
    await Helpers.validUserJoinsTheCall(page);
    // Validate that the VideoCall was Launched
    await Helpers.validateVideoCallLaunched(page,'[id^="video_track-cam-"]'); 
    // Verify the video call properties
    await test.step("Verify the video call properties", async () => {
      await Helpers.inspectVideoProperties(page,'[id^="video_track-cam-"]')
    });

  });

  test('User joins the room and configures the ADVANCED SETTINGS with a low-speed connection', 
    { tag: ['@regression','@network'] }, async ({ page }) => {
    // User joins video call
    await Helpers.userOpensVideoCallURL(page);
    await Helpers.validUserJoinsTheCall(page);
    await Helpers.validateAlertText(page, 'success-alert-with-token', 'Congratulations! Joined room successfully.'); 
    // Validate that the VideoCall was Launched
    await Helpers.validateVideoCallLaunched(page,'[id^="video_track-cam-"]');
    // Verify the video call properties
    await test.step("Verify the video call properties", async () => {
      await Helpers.inspectVideoProperties(page,'[id^="video_track-cam-"]')
    });
    // Validate UI Headers elements
    await Helpers.validateUIHeaders(page);
    // Advanced Settings
    await Helpers.clickBtnByName(page,'ADVANCED SETTINGS');
    // Mic
    await Helpers.clickBtnByName(page,'Mics');
    await Helpers.clickLinkByName(page,'Fake Audio Input 2');
    // Cams
    await Helpers.clickBtnByName(page,'Cams');
    await Helpers.clickLinkByName(page,'fake_device_0');
    // Check Radios 
    await Helpers.checkRadioByName(page,'vp9');
    await Helpers.checkRadioByName(page,'vp8');
    await Helpers.checkRadioByName(page,'h264');
    // Profiles    
    await Helpers.clickBtnByName(page,'Profiles');
    await Helpers.clickLinkByName(page,'720p_1: 1280×720, 15fps,');
    await Helpers.clickBtnByName(page,'Profiles');
    await Helpers.clickLinkByName(page,'1080p_1: 1920×1080, 15fps,');
    // Close ADVANCED SETTINGS
    await Helpers.clickBtnByName(page,'ADVANCED SETTINGS');
    await test.step("ADVANCED SETTINGS menu must have been closed", async () => {
      await expect(page.locator('Profiles')).toHaveCount(0);
    })
    // Leave Room
    await Helpers.clickBtnByName(page,'Leave');
  });
});