import { test, expect } from "@playwright/test";

// https://ohtest.westeurope.cloudapp.azure.com/playground/testcases/swiss-homepage
test("home-stage", async ({ page }) => {
  await page.goto("http://localhost:9000/modules/HomeStage/home-stage");

  // ------------------------------------------------------------------------------------------
  // hack to force to load all the images
  let retry = 0;
  while (retry < 2) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(3000);
    console.log("scrolling count:", retry);
    retry++;
  }

  // ------------------------------------------------------------------------------------------
  // remove normal cookie disclaimer
  await page
    .locator("#uc-categories")
    .evaluate((element) => (element.style.display = "none"));

  // ------------------------------------------------------------------------------------------
  // checking count of images - no
  // const allImages = page.locator("img");
  // const elements = await allImages.elementHandles();
  // console.log("image count:", elements.length);

  // ------------------------------------------------------------------------------------------
  // remove StoryStream
  await expect(page).toHaveScreenshot({
    fullPage: true,
    animations: "disabled",
    mask: [
      page.locator(".preview-badge"),
      page.locator("(//section[@data-module-name='Story-Stream'])[1]"),
    ],
  });
});
