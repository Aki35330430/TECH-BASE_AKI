import express from 'express';
import { Client } from '@notionhq/client';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

app.get("/get-random-row", async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "タグ",
        multi_select: {
          contains: "English",
        },
      },
    });

    if (response.results.length === 0) {
      return res.status(404).send({ message: "No data found" });
    }

    const randomRow = response.results[Math.floor(Math.random() * response.results.length)];
    const properties = randomRow.properties;

    const result = {
      name: properties["名前"]?.title[0]?.plain_text || "No Name",
      url: properties["URL"]?.url || "No URL",
      text: properties["テキスト"]?.rich_text[0]?.plain_text || "No Text",
      image: (properties["image"]?.files || []).map(file => ({
        url: file?.file?.url || null,
        name: file?.name || "Unknown",
        type: file?.type || "Unknown"
      })),
    };

    res.json(result);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send({ message: "Error retrieving data" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});