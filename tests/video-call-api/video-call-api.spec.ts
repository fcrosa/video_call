/*
  This video test was created by Fernando Crosa (June 2025) crosafernando@gmail.com 
  To test the video call UI & api using Playwright for the Basic Video Call project
  To run the this suite of tests execute `npx playwright test --grep @api` using the console.
  To run the regression tests execute `npx playwright test --grep @regression` using the console.
  To run all tests execute `npx playwright test` and `npx playwright show-report` to see the report
*/

import { test, expect} from '@playwright/test';
import * as Helpers from '../../test_support/helpers/helpers';
import testUserData from '../../test_support/test_data/login_data_valid.json';

const videoCallURL = 'https://webdemo.agora.io/basicVideoCall/index.html';
const user: TestUser = testUserData;

type TestUser = {
  description: string;
  appToken: string;
  appId: string;
  channelName: string;
  userId: string;
};

//Test Name
test.describe("Video Call API", () => {

   test('User joins the room', { tag: ['@api', '@regression'] }, async ({ page }) => {

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
    
    // User joins video call        
    await Helpers.userOpensVideoCallURL(page);
    await Helpers.userJoinsTheCall(page, user);
    // Validate that the VideoCall was Launched
    await Helpers.validateVideoCallLaunched(page,'[id^="video_track-cam-"]');  
    await Helpers.validateAlertText(page, 'success-alert-with-token', 'Congratulations! Joined room successfully.'); 
    // User leaves the room
    await Helpers.clickBtnByName(page,'Leave');
    // Validate CNAME must be present in api call response
    await test.step('CNAME must be present in api call response', async () => {
      expect(cNameVerified).toBeTruthy();
    });

  });

});