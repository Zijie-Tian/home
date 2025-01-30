import { Client } from '@notionhq/client';

const notion = new Client({ 
  auth: import.meta.env.VITE_NOTION_TOKEN 
});

export async function getNotionPage(pageId) {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    const blocks = await notion.blocks.children.list({ block_id: pageId });
    return {
      metadata: page,
      content: blocks.results
    };
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    return null;
  }
}

export function renderNotionBlock(block) {
  switch (block.type) {
    case 'paragraph':
      return block.paragraph.rich_text.map(text => text.plain_text).join('');
    case 'heading_1':
      return block.heading_1.rich_text.map(text => text.plain_text).join('');
    case 'heading_2':
      return block.heading_2.rich_text.map(text => text.plain_text).join('');
    case 'heading_3':
      return block.heading_3.rich_text.map(text => text.plain_text).join('');
    case 'bulleted_list_item':
      return block.bulleted_list_item.rich_text.map(text => text.plain_text).join('');
    case 'numbered_list_item':
      return block.numbered_list_item.rich_text.map(text => text.plain_text).join('');
    default:
      return '';
  }
}
