const db = require('./db');

// 插入刺绣数据
db.run(`INSERT INTO heritage (name, type, year, content) VALUES (?, ?, ?, ?)`,
  '哈密维吾尔族刺绣', '国家级非遗', '2008年', '哈密刺绣色彩浓烈、图案饱满，融合多民族文化特色，2008年列入国家级非物质文化遗产。'
);

db.run(`INSERT INTO heritage (name, type, year, content) VALUES (?, ?, ?, ?)`,
  '柯尔克孜族刺绣', '自治区级非遗', '', '草原刺绣风格，多用于服饰、壁挂，充满游牧民族特色。'
);

db.run(`INSERT INTO news (title, content) VALUES (?, ?)`,
  '新疆非遗数字化保护工程正式启动', '数字化让千年刺绣走出新疆、走向全国。'
);

db.run(`INSERT INTO news (title, content) VALUES (?, ?)`,
  '我校大创项目助力新疆非遗传承', '绣缕山河·云展新疆项目正式上线。'
);

console.log('✅ 数据插入完成！');
