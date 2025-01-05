const express = require("express");
const { Client } = require("@notionhq/client");
const cors = require("cors");

const app = express();
app.use(cors());

const notion = new Client({ auth: "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" });
const databaseId = "13089f1af0ff81d395c6c7596a2c78ca";

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
      text: properties["要約"]?.rich_text[0]?.plain_text || "No Text",
      image: (properties["image"]?.files || []).map(file => ({
        url: file?.file?.url || null, // ファイルのURLが存在する場合のみ取得
        name: file?.name || "Unknown",
        type: file?.type || "Unknown"
      })),
    };

    console.log("Fetched data:", result); // デバッグ用ログ
    res.json(result);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send({ message: "Error retrieving data" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
