// This video test was created by Fernando Crosa (June 2025) crosafernando@gmail.com 
// as a sample test on videos using Playwright for VideoCall project.


import { test, expect } from '@playwright/test';

//Test Name
test.describe("Test Video Example", () => {

  //Test Case
  test('User opens a video', { tag: '@video' }, async ({ page }) => {
  
    const videoURL= 'https://tekeye.uk/html/images/Joren_Falls_Izu_Jap.webm';
    //Test Step 
    await test.step('User goes to '+ videoURL + ' page', async () => {
      await page.goto(videoURL);
    });

    const videoSelector = 'video';
    const video = page.locator(videoSelector).first();
    //Test Step
    await test.step('User can see that the video is loaded correctly', async () => {
      const isVideoLoaded = await video.evaluate((videoEl: HTMLVideoElement) => videoEl.readyState >= 3);
      expect(isVideoLoaded).toBeTruthy();
    });
   
  });

});
