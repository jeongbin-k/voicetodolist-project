"use strict";
// ��¥ ����
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let currentDate = new Date();
function renderDate(date) {
    const weekdayEl = document.getElementById('weekdays');
    const monthEl = document.getElementById('month');
    const dayEl = document.getElementById('day');
    const yearEl = document.getElementById('year');
    if (weekdayEl)
        weekdayEl.textContent = weekdays[date.getDay()];
    if (monthEl)
        monthEl.textContent = months[date.getMonth()];
    if (dayEl)
        dayEl.textContent = `${date.getDate()}`;
    if (yearEl)
        yearEl.textContent = `${date.getFullYear()}`;
}
// ��¥���� key �����
function getDateKey(date) {
    return `todos-${date.toISOString().slice(0, 10)}`; // ��: todos-2025-04-24
}
function saveToLocalStorage(date, items) {
    const key = getDateKey(date);
    localStorage.setItem(key, JSON.stringify(items));
}
function loadFromLocalStorage(date) {
    const key = getDateKey(date);
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}
function renderTodoItems(date) {
    const list = document.querySelector('.list');
    if (!list)
        return;
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
// ��¥ �̵� ��ư
document.addEventListener('DOMContentLoaded', () => {
    renderDate(currentDate);
    renderTodoItems(currentDate);
    const prevBtn = document.querySelector('.arrow-prev');
    const nextBtn = document.querySelector('.arrow-next');
    // ���� ��ư
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() - 1);
            renderDate(currentDate);
            renderTodoItems(currentDate);
        });
    }
    // ���� ��ư
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setDate(currentDate.getDate() + 1);
            renderDate(currentDate);
            renderTodoItems(currentDate);
        });
    }
    // ����Ʈ ��� ó��
    const input = document.getElementById('txtSource');
    const button = document.querySelector('.regist-btn');
    const list = document.querySelector('.list');
    if (button && input && list) {
        button.addEventListener('click', () => {
            const text = input.value.trim();
            if (text === '')
                return;
            const items = loadFromLocalStorage(currentDate);
            items.push({ text, checked: false });
            saveToLocalStorage(currentDate, items);
            renderTodoItems(currentDate);
            input.value = '';
        });
        // üũ �ڽ� ó��
        list.addEventListener('change', (e) => {
            const target = e.target;
            if (target.type === 'checkbox') {
                const p = target.nextElementSibling;
                const text = p === null || p === void 0 ? void 0 : p.textContent;
                if (!text)
                    return;
                let items = loadFromLocalStorage(currentDate);
                items = items.map(item => item.text === text ? Object.assign(Object.assign({}, item), { checked: target.checked }) : item);
                saveToLocalStorage(currentDate, items);
                renderTodoItems(currentDate);
            }
        });
        // ����Ʈ ���� ó��
        list.addEventListener('click', (e) => {
            var _a;
            const target = e.target;
            if (target.classList.contains('close')) {
                const p = (_a = target.closest('.list-item')) === null || _a === void 0 ? void 0 : _a.querySelector('p');
                const text = p === null || p === void 0 ? void 0 : p.textContent;
                if (!text)
                    return;
                let items = loadFromLocalStorage(currentDate);
                items = items.filter(item => item.text !== text);
                saveToLocalStorage(currentDate, items);
                renderTodoItems(currentDate);
            }
        });
    }
});
