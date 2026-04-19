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
          <h3>${item.name}</h3>
          <p>${item.type || ''} ${item.year || ''}</p>
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
        </div>
      `;
    });
  } catch (e) {
    console.log(e);
  }
}

// 初始化
loadHeritage();
loadNews();

