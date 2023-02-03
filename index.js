const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
require("dotenv").config();
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const NOTES_DATABASE_ID = process.env.NOTION_API_NOTES_DATABASE;
const HABITS_DATABASE_ID = process.env.NOTION_API_HABITS_DATABASE;

dayjs.extend(utc);
dayjs.extend(timezone);

const now = dayjs().tz("Europe/London");
const YYYYMMDD = now.format("YYYY-MM-DD");
const ddd = now.format("ddd");

// Create daily notes
; (async () => {
  const pageExists = await notion.databases.query({
    database_id: NOTES_DATABASE_ID,
    filter: {
      property: "Name",
      title: {
        equals: YYYYMMDD,
      },
    },
  });
  if (pageExists.results.length !== 0) {
    console.log("Page already exists");
    return;
  }

  await notion.pages.create({
    parent: {
      database_id: NOTES_DATABASE_ID,
    },
    properties: {
      'Name': {
        title: [
          {
            text: {
              content: YYYYMMDD,
            },
          },
        ],
      },
      'Tags': {
        type: 'multi_select',
        multi_select: [
          {
            name: 'DailyNote',
            color: 'default'
          }
        ]
      },
      'Date Created': {
        type: 'date',
        date: { start: YYYYMMDD, end: null, time_zone: null }
      },
    }
  });
})();


// Create a habit entry
; (async () => {
  const pageExists = await notion.databases.query({
    database_id: HABITS_DATABASE_ID,
    filter: {
      // "timestamp": "created_time",
      property: "Created time",
      "date": {
        equals: YYYYMMDD,
      },
    },
  });
  if (pageExists.results.length !== 0) {
    console.log("Page already exists");
    return;
  }

  await notion.pages.create({
    parent: {
      database_id: HABITS_DATABASE_ID,
    },
    properties: {
      'Name': {
        title: [
          {
            text: {
              content: ddd,
            },
          },
        ],
      },
    }
  });
})()
