/*
  This video test was created by Fernando Crosa (June 2025) crosafernando@gmail.com 
  To test the UI video call room  using Playwright for the Basic Video Call project
  To run the this suite of tests execute `npx playwright test --grep @basicUI` using the console.
  To run the regression tests execute `npx playwright test --grep @regression` using the console.
  To run all tests execute `npx playwright test` and `npx playwright show-report` to see the report
*/

import { test, expect} from '@playwright/test';
import * as Helpers from '../../test_support/helpers/helpers';

//Test Name
test.describe("Video Call UI - Basic", () => {

  test('User without credentials cannot join the room', { tag:['@regression','@smoke','@basicUI'] }, async ({ page }) => {
    // USER CANNOT JOIN THE VIDEO CALL
    await Helpers.userOpensVideoCallURL(page);
    await Helpers.userCannotJoinsTheCall(page);
    await Helpers.clickBtnByName(page,'Join')
    await Helpers.validateAlertIsNotPresent(page,'success-alert-with-token')
  });

  test('User joins the room and accesses the video call', { tag: ['@regression','@smoke','@basicUI'] }, 
    async ({ page }) => {
    // USER JOINS VIDEO CALL
    await Helpers.userOpensVideoCallURL(page);
    await Helpers.validUserJoinsTheCall(page);
    // Validate UI Headers elements
    await Helpers.validateUIHeaders(page);
    // Validate that the VideoCall was Launched
    await Helpers.validateVideoCallLaunched(page,'[id^="video_track-cam-"]');  
    await Helpers.validateAlertText(page, 'success-alert-with-token', 'Congratulations! Joined room successfully.'); 
  });

});