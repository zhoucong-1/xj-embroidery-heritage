// 加载非遗列表
async function loadHeritage() {
  try {
    const res = await fetch('/api/heritage');
    const list = await res.json();
    const box = document.getElementById('heritage-list');
    if (!box) return;

    box.innerHTML = '';
    list.forEach(item => {
      box.innerHTML += `
        <div class="card">
          <img src="${item.image || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=新疆刺绣作品展示，传统工艺，民族特色，高清照片&image_size=square'}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p><strong>${item.type || ''}</strong> ${item.year || ''}</p>
          <p>${item.content || ''}</p>
        </div>
      `;
    });
  } catch (e) {
    console.log(e);
  }
}

// 加载新闻
async function loadNews() {
  try {
    const res = await fetch('/api/news');
    const list = await res.json();
    const box = document.getElementById('news-list');
    if (!box) return;

    box.innerHTML = '';
    list.forEach(n => {
      box.innerHTML += `
        <div class="card">
          <h3>${n.title}</h3>
          <p>${n.content}</p>
          ${n.create_time ? `<p class="news-time">${n.create_time}</p>` : ''}
        </div>
      `;
    });
  } catch (e) {
    console.log(e);
  }
}

// 加载新闻预览（首页）
async function loadNewsPreview() {
  try {
    const res = await fetch('/api/news');
    const list = await res.json();
    const box = document.getElementById('news-preview');
    if (!box) return;

    box.innerHTML = '';
    const previewList = list.slice(0, 3); // 只显示最新的3条
    previewList.forEach(n => {
      box.innerHTML += `
        <div class="card">
          <h3>${n.title}</h3>
          <p>${n.content.substring(0, 100)}${n.content.length > 100 ? '...' : ''}</p>
          ${n.create_time ? `<p class="news-time">${n.create_time}</p>` : ''}
        </div>
      `;
    });
  } catch (e) {
    console.log(e);
  }
}

// 处理联系表单提交
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    const messageDiv = document.getElementById('form-message');

    try {
      // 模拟提交成功
      messageDiv.textContent = '留言提交成功！我们会尽快回复您。';
      messageDiv.className = 'form-message success';
      form.reset();
      
      // 3秒后清除消息
      setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'form-message';
      }, 3000);
    } catch (error) {
      messageDiv.textContent = '提交失败，请稍后重试。';
      messageDiv.className = 'form-message error';
    }
  });
}

// 初始化
loadHeritage();
loadNews();
loadNewsPreview();
setupContactForm();

