// import Knex from "knex";
// // import xlsx from "xlsx";
// // import path from "path";


// const knexConfig = require('./knexfile');
// const knex = Knex(knexConfig[process.env.NODE_ENV || "development"])


// async function main() {
//     // const districtMapping = await knex('hong_kong_districts')
//     // .select('id', 'district')

// const towerMapping = districtMapping.reduce(
//     (acc, cur) => acc.set(cur.district, cur.id),
//     new Map< string, number>()
//   );

// const creatorMapping = await knex('users')
// .select('id','name')

// const UsersMapping = creatorMapping.reduce(
//     (acc, cur) => acc.set(cur.name, cur.id),
//     new Map< string, number>()
// //   );

// const partySelect =await knex('party')
// .select('id','name')

// const partyMapping = partySelect.reduce(
//     (acc, cur) => acc.set(cur.name, cur.id),
//     new Map< string, number>()
//   );


// // console.log(copartnerMapping)

// console.log(partyMapping)


// const alcoholDataBaseMapping = await knex('alcohols')
//     .select('id', 'name')
// const alcoholNewMapping=alcoholDataBaseMapping.reduce(
//     (acc, cur) =>acc.set(cur.name, cur.id),
//     new Map<string,number>()
// );

// console.log(alcoholNewMapping)





//     // const alcoholDataBaseMapping = await knex('alcohols')
//     //     .select('id', 'name')
//     // const alcoholNewMapping=alcoholDataBaseMapping.reduce(
//     //     (acc, cur) =>acc.set(cur.name, cur.id),
//     //     new Map<string,number>()



// }

// main()


let date = new Date("2021-04-20T18:00:00.000Z")

// date.setUTCHours(1-8)
const reportId = "a55b50f3-ac85-41fc-ab0f-6bc5fe1378f1";
const datasetId = "11b3285c-32ec-496f-8ed1-3c7dd0ad3bd0";

console.log(JSON.stringify({
    datasets: [
        {
            id: datasetId,
        },
    ],
    reports: [
        {
            id: reportId,
        },
    ],
}))