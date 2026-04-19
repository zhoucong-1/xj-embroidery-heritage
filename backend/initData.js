const db = require('./db');

// 插入刺绣数据
async function initData() {
  try {
    // 插入刺绣数据
    await db.run(`INSERT INTO heritage (name, type, year, content, image) VALUES (?, ?, ?, ?, ?)`,
      '哈密维吾尔族刺绣', '国家级非遗', '2008年', '哈密刺绣色彩浓烈、图案饱满，融合多民族文化特色，2008年列入国家级非物质文化遗产。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=哈密维吾尔族刺绣作品，色彩浓烈，图案饱满，民族特色，高清照片&image_size=square'
    );

    await db.run(`INSERT INTO heritage (name, type, year, content, image) VALUES (?, ?, ?, ?, ?)`,
      '柯尔克孜族刺绣', '自治区级非遗', '', '草原刺绣风格，多用于服饰、壁挂，充满游牧民族特色。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=柯尔克孜族刺绣作品，草原风格，游牧民族特色，高清照片&image_size=square'
    );

    await db.run(`INSERT INTO heritage (name, type, year, content, image) VALUES (?, ?, ?, ?, ?)`,
      '维吾尔族刺绣', '国家级非遗', '2011年', '维吾尔族刺绣历史悠久，技艺精湛，图案丰富多样，是中华民族传统工艺的重要组成部分。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=维吾尔族刺绣作品，传统工艺，民族特色，高清照片&image_size=square'
    );

    await db.run(`INSERT INTO heritage (name, type, year, content, image) VALUES (?, ?, ?, ?, ?)`,
      '哈萨克族刺绣', '自治区级非遗', '', '哈萨克族刺绣以几何图案为主，色彩鲜艳，多用于装饰服饰和生活用品。', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=哈萨克族刺绣作品，几何图案，色彩鲜艳，高清照片&image_size=square'
    );

    // 插入新闻数据
    await db.run(`INSERT INTO news (title, content) VALUES (?, ?)`,
      '新疆非遗数字化保护工程正式启动', '数字化让千年刺绣走出新疆、走向全国，为非遗传承注入新活力。'
    );

    await db.run(`INSERT INTO news (title, content) VALUES (?, ?)`,
      '我校大创项目助力新疆非遗传承', '绣缕山河·云展新疆项目正式上线，通过数字技术展示新疆刺绣的独特魅力。'
    );

    await db.run(`INSERT INTO news (title, content) VALUES (?, ?)`,
      '新疆刺绣技艺走进校园', '非遗传承人走进高校，开展刺绣技艺 workshops，让更多年轻人了解和传承传统工艺。'
    );

    console.log('✅ 数据插入完成！');
  } catch (error) {
    console.error('数据插入失败:', error);
  }
}

// 执行初始化
initData();
