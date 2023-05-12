import { Page, WebKitBrowser, webkit } from 'playwright'
import fs from "fs"

const dataPath = './scraping-data/2book_scraping_party_room_href.csv'

async function main() {
    const browser: WebKitBrowser = await webkit.launch();
    const page: Page = await browser.newPage();

    await page.goto('https://www.2book.co/zh/venue/main/page/1/category/party-room/');
    await page.waitForLoadState("networkidle")
    let arr: (string | undefined)[] = await page.evaluate(() => {
        const partyRoomCards = document.querySelectorAll(".venue-row-item.section") as any as Element[]
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

    while (arr.length > 0) {
        await page.click('css=li.page-item.next')
        await page.waitForLoadState("networkidle")
        await page.waitForTimeout(5000)
        await page.screenshot({ path: `example.png` });
        arr = await page.evaluate(() => {
            const partyRoomCards = document.querySelectorAll(".venue-row-item.section") as any as Element[]
            const arr = []
            for (const partyRoomCard of partyRoomCards) {
                arr.push(partyRoomCard.querySelector("a")?.href)
            }
            return arr
        });
        if (arr && arr.length > 0) {
            for (const href of arr) {
                fs.writeFileSync(dataPath, href + "\n", {
                    flag: "a"
                })
            }
        }
    }

    await browser.close();
}

main();
