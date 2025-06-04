/*
  This video test was created by Fernando Crosa (June 2025) crosafernando@gmail.com 
  to test and collect Video Call Metrics using Playwright for Basic Video Call project
  To run the this suite of tests execute `npx playwright test --grep @metrics` using the console.
  To run the regression tests execute `npx playwright test --grep @regression` using the console.
  To run all tests execute `npx playwright test` and `npx playwright show-report` to see the report
*/
import { test } from '@playwright/test';
import * as Helpers from '../../test_support/helpers/helpers';


// Test Name
test.describe("Video Call Metrics", () => {

  test('User joins the room and we collect video call metrics', { tag: ['@regression','@metrics'] }, 
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

});