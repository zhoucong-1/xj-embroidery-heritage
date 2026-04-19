const db = require('./db');

async function initData() {
  try {
    console.log('开始初始化数据...');

    // 插入刺绣数据
    const heritageData = [
      {
        name: '哈密维吾尔族刺绣',
        type: '国家级非遗',
        year: '2008年',
        content: '哈密刺绣色彩浓烈、图案饱满，融合多民族文化特色，2008年列入国家级非物质文化遗产。哈密刺绣以其独特的艺术风格和精湛的工艺闻名于世。',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=哈密维吾尔族刺绣作品，色彩浓烈，图案饱满，民族特色，高清照片&image_size=square'
      },
      {
        name: '柯尔克孜族刺绣',
        type: '自治区级非遗',
        year: '',
        content: '草原刺绣风格，多用于服饰、壁挂，充满游牧民族特色。柯尔克孜族刺绣图案多为草原动物和几何纹样，反映了游牧民族的生活方式。',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=柯尔克孜族刺绣作品，草原风格，游牧民族特色，高清照片&image_size=square'
      },
      {
        name: '维吾尔族刺绣',
        type: '国家级非遗',
        year: '2011年',
        content: '维吾尔族刺绣历史悠久，技艺精湛，图案丰富多样，是中华民族传统工艺的重要组成部分。维吾尔族刺绣广泛应用于服装、装饰品和日常生活用品。',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=维吾尔族刺绣作品，传统工艺，民族特色，高清照片&image_size=square'
      },
      {
        name: '哈萨克族刺绣',
        type: '自治区级非遗',
        year: '',
        content: '哈萨克族刺绣以几何图案为主，色彩鲜艳，多用于装饰服饰和生活用品。哈萨克族刺绣体现了草原民族对自然的崇拜和对美好生活的向往。',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=哈萨克族刺绣作品，几何图案，色彩鲜艳，高清照片&image_size=square'
      }
    ];

    for (const heritage of heritageData) {
      await db.run(
        'INSERT INTO heritage (name, type, year, content, image) VALUES (?, ?, ?, ?, ?)',
        [heritage.name, heritage.type, heritage.year, heritage.content, heritage.image]
      );
      console.log(`✅ 添加非遗项目: ${heritage.name}`);
    }

    // 插入新闻数据
    const newsData = [
      {
        title: '新疆非遗数字化保护工程正式启动',
        content: '数字化让千年刺绣走出新疆、走向全国，为非遗传承注入新活力。该工程将运用现代科技手段，全方位记录和保护新疆各民族传统刺绣技艺。'
      },
      {
        title: '我校大创项目助力新疆非遗传承',
        content: '绣缕山河·云展新疆项目正式上线，通过数字技术展示新疆刺绣的独特魅力。项目团队致力于将传统刺绣文化与现代科技相结合，推动非遗文化的创新性发展。'
      },
      {
        title: '新疆刺绣技艺走进校园',
        content: '非遗传承人走进高校，开展刺绣技艺 workshops，让更多年轻人了解和传承传统工艺。通过实践教学，激发学生对传统文化的兴趣。'
      },
      {
        title: '2026年新疆非遗刺绣大赛圆满落幕',
        content: '2026年新疆非遗刺绣大赛在乌鲁木齐成功举办，来自全疆各地的刺绣高手齐聚一堂，展示传统技艺。本次大赛以"传承与创新"为主题，吸引了近200名选手参赛，展现了新疆刺绣文化的丰富多样性。'
      },
      {
        title: '新疆刺绣作品首次亮相国际博览会',
        content: '在刚刚结束的2026年国际文化博览会上，新疆刺绣作品惊艳亮相，向世界展示了中华传统文化的独特魅力。多位非遗传承人的作品获得国内外参观者的高度赞誉。'
      },
      {
        title: '数字化技术助力新疆刺绣保护与传承',
        content: '借助3D扫描、虚拟现实等数字化技术，新疆非遗刺绣的保护与传承工作取得突破性进展。数字化的刺绣档案库已收录超过500件珍贵作品，为后世留下了宝贵的文化遗产。'
      },
      {
        title: '哈密刺绣走进上海社区',
        content: '哈密维吾尔族刺绣传承人团队近日在上海多个社区开展刺绣技艺体验活动，让更多内地民众了解和体验新疆传统刺绣工艺，反响热烈。'
      },
      {
        title: '新疆非遗刺绣研学旅行线路正式发布',
        content: '一条以新疆刺绣文化为主题的研学旅行线路正式发布，线路涵盖哈密、吐鲁番、喀什等地，让游客深度体验不同民族的刺绣文化。'
      },
      {
        title: '高校与非遗传承人共建刺绣工作室',
        content: '新疆多所高校与当地非遗刺绣传承人合作，共同建立刺绣工作室，为学生提供实践平台，促进传统技艺与现代教育的融合。'
      },
      {
        title: '新疆刺绣图案数据库建设启动',
        content: '为系统整理和保护新疆各民族刺绣图案，新疆刺绣图案数据库建设正式启动。该数据库将收录超过10000种传统刺绣图案，为刺绣研究和创新提供参考。'
      },
      {
        title: '刺绣文创产品线上销量突破百万',
        content: '依托电商平台，新疆刺绣文创产品线上销量持续增长，今年已突破百万件。这不仅带动了当地绣娘增收，也让新疆刺绣文化走向更广阔的市场。'
      }
    ];

    for (const news of newsData) {
      await db.run(
        'INSERT INTO news (title, content) VALUES (?, ?)',
        [news.title, news.content]
      );
      console.log(`✅ 添加新闻: ${news.title}`);
    }

    // 插入商品数据
    const productsData = [
      {
        name: '哈密刺绣抱枕',
        category: 'daily',
        price: 168,
        description: '手工刺绣抱枕，精选哈密传统图案，适合家居装饰',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=哈密刺绣抱枕，手工刺绣，传统图案，家居装饰，高清照片&image_size=square',
        story: '由哈密本地绣娘手工制作，每一件都是独一无二的艺术品。'
      },
      {
        name: '维吾尔族刺绣围巾',
        category: 'accessories',
        price: 298,
        description: '真丝材质，手工刺绣，民族风格浓郁',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=维吾尔族刺绣围巾，真丝材质，手工刺绣，民族风格，高清照片&image_size=square',
        story: '选用上等真丝，由经验丰富的绣娘耗时数周完成。'
      },
      {
        name: '柯尔克孜族壁挂',
        category: 'embroidery',
        price: 680,
        description: '纯手工制作，草原风情，适合挂于客厅或书房',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=柯尔克孜族刺绣壁挂，草原风情，手工制作，高清照片&image_size=square',
        story: '传承人倾心之作，展现草原民族的独特审美。'
      },
      {
        name: '刺绣材料包（初学者）',
        category: 'materials',
        price: 88,
        description: '包含刺绣针线、布料、图样教程，适合入门学习',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=刺绣材料包，针线布料，入门教程，高清照片&image_size=square',
        story: '专为刺绣爱好者设计，让您在家就能体验传统刺绣技艺。'
      },
      {
        name: '哈萨克族刺绣背包',
        category: 'accessories',
        price: 358,
        description: '民族风格手提包，适合日常出行',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=哈萨克族刺绣背包，民族风格，手工刺绣，高清照片&image_size=square',
        story: '将传统刺绣工艺与现代包袋设计相结合，实用又美观。'
      },
      {
        name: '刺绣桌旗',
        category: 'daily',
        price: 128,
        description: '精致刺绣桌旗，提升餐桌格调',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=刺绣桌旗，精致工艺，餐桌装饰，高清照片&image_size=square',
        story: '每一块桌旗都采用传统刺绣技艺，为您的餐桌增添民族风情。'
      },
      {
        name: '大型刺绣挂画',
        category: 'embroidery',
        price: 1280,
        description: '精美大型挂画，展现新疆刺绣艺术的巅峰之作',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=大型刺绣挂画，精美工艺，新疆风景，高清照片&image_size=square',
        story: '由多位刺绣大师历时数月共同完成，是收藏与装饰的绝佳选择。'
      },
      {
        name: '刺绣材料包（进阶版）',
        category: 'materials',
        price: 168,
        description: '包含高级材料和专业工具，适合有一定基础的学员',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=刺绣材料包进阶版，专业工具，高级材料，高清照片&image_size=square',
        story: '升级版材料包含更多珍稀线材和复杂图样，助您技艺精进。'
      }
    ];

    for (const product of productsData) {
      await db.run(
        'INSERT INTO products (name, category, price, description, image, story) VALUES (?, ?, ?, ?, ?, ?)',
        [product.name, product.category, product.price, product.description, product.image, product.story]
      );
      console.log(`✅ 添加商品: ${product.name}`);
    }

    console.log('\n🎉 数据初始化完成！');
  } catch (error) {
    console.error('数据初始化失败:', error);
  }
}

module.exports = initData;