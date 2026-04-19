const db = require('./db');

async function checkNews() {
  try {
    const news = await db.all('SELECT * FROM news ORDER BY id DESC');
    console.log('\n当前数据库中的新闻：');
    console.log('=' .repeat(60));
    news.forEach((n, index) => {
      console.log(`\n${index + 1}. ${n.title}`);
      console.log(`   ${n.content.substring(0, 50)}...`);
    });
    console.log('\n' + '=' .repeat(60));
    console.log(`共 ${news.length} 条新闻`);
  } catch (error) {
    console.error('查询失败:', error);
  }
}

checkNews();