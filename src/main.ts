// 날짜 관련
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

let currentDate = new Date();

function renderDate(date: Date) {
  const weekdayEl = document.getElementById('weekdays');
  const monthEl = document.getElementById('month');
  const dayEl = document.getElementById('day');
  const yearEl = document.getElementById('year');

  if (weekdayEl) weekdayEl.textContent = weekdays[date.getDay()];
  if (monthEl) monthEl.textContent = months[date.getMonth()];
  if (dayEl) dayEl.textContent = `${date.getDate()}`;
  if (yearEl) yearEl.textContent = `${date.getFullYear()}`;
}

// Todo 타입
interface TodoItem {
  text: string;
  checked: boolean;
}

// 날짜별로 key 만들기
function getDateKey(date: Date): string {
  return `todos-${date.toISOString().slice(0, 10)}`; // 예: todos-2025-04-24
}

function saveToLocalStorage(date: Date, items: TodoItem[]) {
  const key = getDateKey(date);
  localStorage.setItem(key, JSON.stringify(items));
}

function loadFromLocalStorage(date: Date): TodoItem[] {
  const key = getDateKey(date);
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function renderTodoItems(date: Date) {
  const list = document.querySelector('.list');
  if (!list) return;

  list.innerHTML = '';
  const items = loadFromLocalStorage(date);

  items.forEach((item) => {
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');

    listItem.innerHTML = `
      <div>
        <input type="checkbox" ${item.checked ? 'checked' : ''}>
        <p class="${item.checked ? 'done' : ''}">${item.text}</p>
      </div>
      <button class="close"></button>
    `;
    list.appendChild(listItem);
  });
}

// 날짜 이동 버튼
document.addEventListener('DOMContentLoaded', () => {
  renderDate(currentDate);
  renderTodoItems(currentDate);

  const prevBtn = document.querySelector('.arrow-prev');
  const nextBtn = document.querySelector('.arrow-next');
  // 다음 버튼
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() - 1);
      renderDate(currentDate);
      renderTodoItems(currentDate);
    });
  }
  // 이전 버튼
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentDate.setDate(currentDate.getDate() + 1);
      renderDate(currentDate);
      renderTodoItems(currentDate);
    });
  }

  // 리스트 등록 처리
  const input = document.getElementById('txtSource') as HTMLTextAreaElement;
  const button = document.querySelector('.regist-btn') as HTMLButtonElement;
  const list = document.querySelector('.list') as HTMLDivElement;

  if (button && input && list) {
    button.addEventListener('click', () => {
      const text = input.value.trim();
      if (text === '') return;

      const items = loadFromLocalStorage(currentDate);
      items.push({ text, checked: false });
      saveToLocalStorage(currentDate, items);
      renderTodoItems(currentDate);
      input.value = '';
    });

    // 체크 박스 처리
    list.addEventListener('change', (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.type === 'checkbox') {
        const p = target.nextElementSibling as HTMLParagraphElement;
        const text = p?.textContent;
        if (!text) return;

        let items = loadFromLocalStorage(currentDate);
        items = items.map(item => item.text === text ? { ...item, checked: target.checked } : item);
        saveToLocalStorage(currentDate, items);
        renderTodoItems(currentDate);
      }
    });

    // 리스트 삭제 처리
    list.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('close')) {
        const p = target.closest('.list-item')?.querySelector('p');
        const text = p?.textContent;
        if (!text) return;

        let items = loadFromLocalStorage(currentDate);
        items = items.filter(item => item.text !== text);
        saveToLocalStorage(currentDate, items);
        renderTodoItems(currentDate);
      }
    });
  }
});
