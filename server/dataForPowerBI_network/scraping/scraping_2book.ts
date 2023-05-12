import xlsx from "xlsx"
import { Page, WebKitBrowser, webkit } from 'playwright'
import fs from "fs"

// 網址 名 電話 價錢

const dataPath = './scraping-data/2book_scraping_data.csv'

const workbook = xlsx.readFile('./scraping-data/2book_scraping_party_room_href.xlsx');
const sheet_name_list = workbook.SheetNames;

const worksheet = workbook.Sheets[sheet_name_list[0]];

const paths = xlsx.utils.sheet_to_json<{ path: string }>(worksheet)

async function getData(partyRoomPath: string) {
    const browser: WebKitBrowser = await webkit.launch();
    const page: Page = await browser.newPage();

    await page.goto(partyRoomPath);
    await page.waitForLoadState("networkidle")
    await page.screenshot({ path: `example.png` });

    // 網址
    console.log(partyRoomPath)
    // 名
    let partyRoomName = await page.evaluate(() => document.querySelector(".text-sans-serif.font-size-20.font-weight-bold.mb-0")?.innerHTML);
    console.log(partyRoomName)
    // 電話
    let partyRoomPhone = await page.evaluate(() => document.querySelector(".d-block.text-center.text-secondary span")?.innerHTML);
    console.log(partyRoomPhone)
    // 價錢
    let partyRoomPrice = await page.evaluate(() => (document.querySelectorAll("pre.unstyled")[1]) ? document.querySelectorAll("pre.unstyled")[1].innerHTML.replace(/\n/g, " ").replace(/\r/g, " ") : "");
    console.log(partyRoomPrice)

    let data = partyRoomPath + "," + partyRoomName + "," + partyRoomPhone + "," + partyRoomPrice + "\n"

    fs.writeFileSync(dataPath, data, {
        flag: "a"
    })

    await browser.close();
}

async function main() {
    for (const path of paths) {
        await getData(path.path);
    }
}

main()