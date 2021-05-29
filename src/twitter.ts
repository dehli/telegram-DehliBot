import { launchAndEvaluate } from "./chrome";

export const usernameAvailable = async (username: string) => {
  return await launchAndEvaluate(async (page) => {
    await page.goto(`https://twitter.com/${username}`, {
      waitUntil: "networkidle2"
    });

    return await page.evaluate(() => {
      return (window as any).find("This account doesn't exist")
    });
  });
};
