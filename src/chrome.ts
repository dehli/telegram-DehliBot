import chromium from "chrome-aws-lambda";
import { Page } from "puppeteer-core";

const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36";

const launch = async () => {
  return await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  });
};

export const launchAndEvaluate = async (command: (_: Page) => any) => {
  let browser = null;
  let result = null;

  try {
    browser = await launch();

    const page = await browser.newPage();
    page.setUserAgent(userAgent);

    result = await command(page);

  } catch (error) {
    throw error;

  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }

  return result;
};
