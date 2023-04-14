import { test, expect } from "@playwright/test";

test.only("germany", async ({ page }) => {
  // await page.goto(
  //   "https://ohdev.westeurope.cloudapp.azure.com/playground/testcases/germany-homepage"
  // );
  await page.goto(
    "https://ohdev.westeurope.cloudapp.azure.com/playground/testcases/germany-homepage"
  );
  // await page.goto(
  //   "https://cd.int.pcom.weu.porsche.com/playground/testcases/germany-homepage"
  // );

  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState("load");

  await page.$$eval('[loading="lazy"]', (elements) => {
    elements.forEach((element) => {
      element.removeAttribute("loading");
    });
  });

  // ------------------------------------------------------------------------------------------
  // hack to force to load all the images
  let retry = 0;
  while (retry < 2) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    console.log("scrolling count:", retry);

    await page.$$eval('[loading="lazy"]', (elements) => {
      elements.forEach((element) => {
        element.removeAttribute("loading");
      });
    });

    await page.evaluate(() => document.fonts.ready);
    await page.waitForLoadState("load");

    retry++;
  }

  // ------------------------------------------------------------------------------------------
  // another hack to force to load all the images
  const sizes = await page.evaluate(() => {
    const browserHeight = window.innerHeight;
    const pageHeight = document.body.scrollHeight;

    return { browserHeight, pageHeight };
  });

  for (let i = 0; i < sizes.pageHeight; i += sizes.browserHeight) {
    await page.mouse.wheel(0, i);
    console.log("scrolled to", i);
    await page.waitForTimeout(1000);
  }

  // --------------------------------
  await page.waitForLoadState("load");

  // ------------------------------------------------------------------------------------------
  // remove normal cookie disclaimer
  // await page
  //   .locator("#uc-categories")
  //   .evaluate((element) => (element.style.display = "none"));

  // ------------------------------------------------------------------------------------------
  // remove US cookie disclaimer
  const isUSCookieDisclaimerVisible = await page.isVisible(
    "#pcom-cookie-usage-notification"
  );
  if (isUSCookieDisclaimerVisible) {
    await page.$eval("#pcom-cookie-usage-notification", (element) =>
      element.remove()
    );
  }
  // await page
  //   .locator("#pcom-cookie-usage-notification")
  //   .evaluate((element) => (element.style.display = "none"));

  // ------------------------------------------------------------------------------------------
  // remove story stream
  const isStoryStreamVisible = await page.isVisible(
    "(//section[@data-module-name='Story-Stream'])[1]"
  );
  if (isStoryStreamVisible) {
    await page.$eval(
      "(//section[@data-module-name='Story-Stream'])[1]",
      (element) => element.remove()
    );
  }

  // await page
  //   .locator("(//section[@data-module-name='Story-Stream'])[1]")
  //   .evaluate((element) => (element.style.display = "none"));

  // ------------------------------------------------------------------------------------------
  // checking count of images
  // const allImages = page.locator("img");
  // const elements = await allImages.elementHandles();
  // console.log("image count:", elements.length);

  // ------------------------------------------------------------------------------------------
  // remove StoryStream
  await expect(page).toHaveScreenshot({
    fullPage: true,
    animations: "disabled",
    mask: [
      // page.locator(".preview-badge"),
      // page.locator("(//section[@data-module-name='Story-Stream'])[1]"),
    ],
  });
});
