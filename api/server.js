const { Client } = require("@notionhq/client");

const notion = new Client({ auth: "YOUR_NOTION_API_KEY" });
const databaseId = "YOUR_DATABASE_ID";

module.exports = async (req, res) => {
  if (req.method === "GET") {
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
        return res.status(404).json({ message: "No data found" });
      }

      const randomRow = response.results[Math.floor(Math.random() * response.results.length)];
      const properties = randomRow.properties;

      const result = {
        name: properties["名前"]?.title[0]?.plain_text || "No Name",
        url: properties["URL"]?.url || "No URL",
        text: properties["要約"]?.rich_text[0]?.plain_text || "No Text",
        image: (properties["image"]?.files || []).map(file => ({
          url: file?.file?.url || null,
          name: file?.name || "Unknown",
          type: file?.type || "Unknown"
        })),
      };

      res.status(200).json(result);
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ message: "Error retrieving data" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
