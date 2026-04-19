// 加载非遗列表
async function loadHeritage() {
  try {
    const res = await fetch('data/heritage.json');
    const list = await res.json();
    const box = document.getElementById('heritage-list');
    if (!box) return;

    box.innerHTML = '';
    list.forEach(item => {
      box.innerHTML += `
        <div class="card">
          <img src="${item.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'}" alt="${item.name}">
          <h3>${item.name}</h3>
          <p><strong>${item.type || ''}</strong> ${item.year || ''}</p>
          <p>${item.content || ''}</p>
        </div>
      `;
    });
  } catch (e) {
    console.log('加载非遗数据失败:', e);
  }
}

// 加载新闻
async function loadNews() {
  try {
    const res = await fetch('data/news.json');
    const list = await res.json();
    const box = document.getElementById('news-list');
    if (!box) return;

    box.innerHTML = '';
    list.forEach(n => {
      box.innerHTML += `
        <div class="card">
          <h3>${n.title}</h3>
          <p>${n.content}</p>
        </div>
      `;
    });
  } catch (e) {
    console.log('加载新闻数据失败:', e);
  }
}

// 加载新闻预览（首页）
async function loadNewsPreview() {
  try {
    const res = await fetch('data/news.json');
    const list = await res.json();
    const box = document.getElementById('news-preview');
    if (!box) return;

    box.innerHTML = '';
    const previewList = list.slice(0, 3);
    previewList.forEach(n => {
      box.innerHTML += `
        <div class="card">
          <h3>${n.title}</h3>
          <p>${n.content.substring(0, 100)}${n.content.length > 100 ? '...' : ''}</p>
        </div>
      `;
    });
  } catch (e) {
    console.log('加载新闻预览失败:', e);
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
      messageDiv.textContent = '留言提交成功！我们会尽快回复您。';
      messageDiv.className = 'form-message success';
      form.reset();

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