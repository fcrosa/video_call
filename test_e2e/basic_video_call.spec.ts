/*
  This video test was created by Fernando Crosa (June 2025) crosafernando@gmail.com 
  as a sample test on videos using Playwright for Basic Video Call project
  To run the regression tests execute `npx playwright test --grep @regression` using the console.
  To run all tests execute `npx playwright test` and `npx playwright show-report` to see the report
*/

import { test, expect} from '@playwright/test';
import * as Helpers from '../test_support/helpers/helpers';
import testUserData from '../test_support/test_data/login_data_valid.json';
import testInvalidUserData from '../test_support/test_data/login_data_example.json';

const videoCallURL = 'https://webdemo.agora.io/basicVideoCall/index.html';
const user: TestUser = testUserData;
const invalidUser: TestUser = testInvalidUserData;

type TestUser = {
  description: string;
  appToken: string;
  appId: string;
  channelName: string;
  userId: string;
};

//Test Name
test.describe("Basic Video Call", () => {

  //Test CaseID 00001 
  test('TC00001 User without credentials cannot join the room', { tag:['@smoke', '@regression'] }, async ({ page }) => {
    
    await Helpers.gotToURL(page,videoCallURL)

    await Helpers.fillInputTextByName(page,'Enter the appid', 'APPLICATION ID', invalidUser.appId)
 
    await Helpers.fillInputTextByName(page,'Enter the app token', 'TOKEN ID', invalidUser.appToken)

    await Helpers.fillInputTextByName(page,'Enter the channel name', 'CANNEL NAME', invalidUser.channelName)

    await Helpers.fillInputTextByName(page,'Enter the user ID', 'USER ID', invalidUser.userId)

    await Helpers.clickBtnByName(page,'Join')

    await Helpers.validateAlertIsNotPresent(page,'success-alert-with-token')

  });

  //Test CaseID 00002
  test('TC00002 User joins and leaves the room', { tag: ['@smoke', '@regression'] }, async ({ page }) => {

    // Listen to the api call response and check CNAME attribute
    let cNameVerified = false;
    await test.step(`Listen to the api call response and check CNAME attribute`, async () => {      
      await page.on('response', async (response) => {
        if (response.url().includes('/webrtc2-ap-web-1.agora.io/api/v2/'))  {
          const body = await response.json();
          const cname = body.response_body[0]?.buffer?.cname;
        if (cname === user.channelName) {
          cNameVerified = true;          
        }
      }
    });
    cNameVerified});

    await Helpers.gotToURL(page,videoCallURL);

    await test.step(`User can see the text located below APP ID`, async () => {
      await expect(page.locator('#join-form')).toContainText('You find your APP ID in the Agora Console');
    });

    await test.step(`User can see the text located below TOKEN (optional)`, async () => {
      await expect(page.locator('#join-form')).toContainText('To create a temporary token, edit your project in Agora Console.');
    });

    await test.step(`User can see the text located below CHANNEL NAME)`, async () => {
      await expect(page.locator('#join-form')).toContainText('You create a channel when you create a temporary token. You guessed it, in Agora Console');
    });

    await Helpers.userJoinsTheCall(page, user);

    await Helpers.validateVideoCallLaunched(page,'[id^="video_track-cam-"]');
  
    await Helpers.validateAlertText(page, 'success-alert-with-token', 'Congratulations! Joined room successfully.'); 

    await test.step("User closes the Alert", async () => {
      await page.getByRole('button', { name: 'Close' }).click();
    });
    
    await Helpers.validateAlertIsNotPresent(page,'success-alert-with-token');
   
    await Helpers.clickBtnByName(page,'Leave');
    
    await test.step('CNAME must be present in api call response', async () => {
      expect(cNameVerified).toBeTruthy();
    });

  });
  
  //Test CaseID 00003
  test('TC00003 User joins the room and accesses the video call', { tag: ['@regression']}, async ({ page }) => {

    await Helpers.gotToURL(page,videoCallURL);

    await Helpers.userJoinsTheCall(page, user);

    await test.step("Verify the video call properties", async () => {
      await Helpers.inspectVideoProperties(page,'[id^="video_track-cam-"]')
    });
  });

  //Test CaseID 00004
  test('TC00004 User joins the room and accesses the video call with a low-speed connection', { tag: ['@regression','@network']}, async ({ browser }) => {

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

    await Helpers.gotToURL(page,videoCallURL);

    await Helpers.userJoinsTheCall(page, user);

    await test.step("Verify the video call properties", async () => {
      await Helpers.inspectVideoProperties(page,'[id^="video_track-cam-"]')
    });

  });

  //Test CaseID 00005
  test('TC00005 User joins the room and configures the ADVANCED SETTINGS', { tag: '@regression' }, async ({ page }) => {
        
    await Helpers.gotToURL(page,videoCallURL);

    await Helpers.userJoinsTheCall(page, user);
    
    await Helpers.validateAlertText(page, 'success-alert-with-token', 'Congratulations! Joined room successfully.'); 

    // ADVANCED SETTINGS
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