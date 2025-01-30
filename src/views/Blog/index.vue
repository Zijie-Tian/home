<template>
  <div class="blog cards">
    <div class="blog-container">
      <h2 class="title">博客</h2>
      <div class="blog-content">
        <div v-if="loading" class="loading">加载中...</div>
        <div v-else-if="error" class="error">{{ error }}</div>
        <div v-else class="notion-content">
          <div v-for="(block, index) in content" :key="index" class="notion-block">
            <div :class="block.type">
              {{ renderBlock(block) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getNotionPage, renderNotionBlock } from '@/api/notion';

const loading = ref(true);
const error = ref(null);
const content = ref([]);

const renderBlock = (block) => {
  return renderNotionBlock(block);
};

onMounted(async () => {
  try {
    const pageId = import.meta.env.VITE_NOTION_PAGE_ID;
    const data = await getNotionPage(pageId);
    if (data) {
      content.value = data.content;
    } else {
      error.value = '无法加载内容';
    }
  } catch (err) {
    error.value = '加载失败';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style lang="scss" scoped>
.blog {
  padding: 20px;
  height: 100%;
  animation: fade 0.5s;

  .blog-container {
    height: 100%;
    display: flex;
    flex-direction: column;

    .title {
      font-size: 1.5rem;
      margin-bottom: 20px;
      text-align: center;
    }

    .blog-content {
      flex: 1;
      overflow-y: auto;

      .loading, .error {
        text-align: center;
        padding: 20px;
        color: rgba(255, 255, 255, 0.7);
      }

      .notion-content {
        .notion-block {
          margin-bottom: 1rem;
          color: rgba(255, 255, 255, 0.9);
          padding: 15px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);

          .heading_1 {
            font-size: 2rem;
            font-weight: bold;
            margin: 1.5rem 0;
          }

          .heading_2 {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 1.2rem 0;
          }

          .heading_3 {
            font-size: 1.2rem;
            font-weight: bold;
            margin: 1rem 0;
          }

          .paragraph {
            line-height: 1.6;
          }

          .bulleted_list_item, .numbered_list_item {
            margin-left: 1.5rem;
            line-height: 1.6;
          }
        }
      }
    }
  }
}
</style>
