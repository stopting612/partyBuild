import { Page, WebKitBrowser, webkit } from 'playwright'
import fs from "fs"

const dataPath = './scraping-data/venuehub_scraping_party_room_href.csv'

async function main() {
  // Open a Chromium browser. We use headless: false
  // to be able to watch what's going on.
  const browser: WebKitBrowser = await webkit.launch();
  const page: Page = await browser.newPage();
  // Open a new page / tab in the browser.
  // Tell the tab to navigate to the GitHub Topics page.
  await page.goto('https://www.venuehub.hk/zh/search?venueTypes=%E6%B4%BE%E5%B0%8D%E5%A0%B4%E5%9C%B0');
  // Click and tell Playwright to keep watching for more than
  // 30 repository cards to appear in the page.
  await page.waitForLoadState("networkidle")
  let arr: (string | undefined)[] = await page.evaluate(() => {
    const partyRoomCards = document.querySelectorAll(".thumbnail") as any as Element[]
    const arr = []
    for (const partyRoomCard of partyRoomCards) {
      const path = partyRoomCard.querySelector("a")
      if (path) {
        arr.push(path.href)
      }
    }
    return arr
  });
  if (arr) {
    for (const href of arr) {
      fs.writeFileSync(dataPath, href + "\n", {
        flag: "a"
      })
    }
  }

  console.log(arr)
  while (arr.length > 0) {
    await page.click('css=li.ais-pagination--item.ais-pagination--item__next')
    await page.waitForLoadState("networkidle")
    await page.waitForTimeout(5000)
    await page.screenshot({ path: `example.png` });
    arr = await page.evaluate(() => {
      const partyRoomCards = document.querySelectorAll(".thumbnail") as any as Element[]
      const arr = []
      for (const partyRoomCard of partyRoomCards) {
        arr.push(partyRoomCard.querySelector("a")?.href)
      }
      return arr
    });
    if (arr) {
      for (const href of arr) {
        fs.writeFileSync(dataPath, href + "\n", {
          flag: "a"
        })
      }
    }
  }

  console.log(arr)
  // await page.click('text=Load more');
  // await page.waitForFunction(() => {
  //     const repoCards = document.querySelectorAll('article.border');
  //     return repoCards.length > 30;
  // });
  // Pause for 10 seconds, to see what's going on.
  // await page.waitForTimeout(10000);
  // Turn off the browser to clean up after ourselves.
  await browser.close();
}

main();

// const { webkit } = require("playwright");

// (async () => {
//   const browser = await webkit.launch({
//     headless: false,
//   });
//   const page = await browser.newPage();
//   await page.goto(
//     "https://www.venuehub.hk/zh/search?venueTypes=%E6%B4%BE%E5%B0%8D%E5%A0%B4%E5%9C%B0"
//   );
//   await page.waitForLoadState("networkidle");
//   const partyRooms = await page.evaluate(() => {
//     const partyRoomCards = document.querySelectorAll(".thumbnail");
//     for (const partyRoomCard of partyRoomCards) {
//       {
//         console.log(partyRoomCard.innerHTML);
//       }
//       return
//     }
//   });
//   console.log(partyRooms);
//   await browser.close();
// })();
