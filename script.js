'use strict';

const storage = localStorage;

const table = document.querySelector('table'); //表
const todo = document.getElementById('todo'); //todo
const deadline = document.querySelector('input[type="date"]'); //〆切
const submit = document.getElementById('submit'); //登録ボタン

let list = [];

document.addEventListener('DOMContentLoaded', () => {
  const json = storage.todoList;
  if (json == undefined) {
    return;
  }
  list = JSON.parse(json);
  for (const item of list) {
    addItem(item);
  }
});

const addItem = (item) => {
  const tr = document.createElement('tr'); //tr要素を作成
    //繰り返しはfor-in文
  for (const prop in item) {
    const td = document.createElement('td'); //td要素を生成
    if (prop == 'done') { //完了欄の場合
        //完了ちぇっぅボックスを追加
      const checkbox = document.createElement('input'); //要素生成
      checkbox.type = 'checkbox'; //tyoe属をcheckboxに
      checkbox.checked = item[prop]; //check属性を設定
      td.appendChild(checkbox); //td要素の子要素に
      checkbox.addEventListener('change', checkBoxListener);
    } else {
      td.textContent = item[prop]; //ブラケット記法(その他の欄)
    }
    tr.appendChild(td); //生成したtd要素をtr要素に追加
  }

  table.append(tr); //trエレメントをtable要素に追加
};

const checkBoxListener = (ev) => {
  const trList = Array.from(document.getElementsByTagName('tr'));
  const currentTr = ev.currentTarget.parentElement.parentElement;
  const idx = trList.indexOf(currentTr) - 1;
  list[idx].done = ev.currentTarget.checked;
  storage.todoList = JSON.stringify(list);
};

//todo登録ボタン
submit.addEventListener('click', () => {
  const item = {}; //入力値を一時的に格納するオブジェクト

  if (todo.value != '') {
    item.todo = todo.value;
  } else {
    item.todo = ' ';
  }
  if (deadline.value != '') {
    item.deadline = deadline.value;
  } else {
    const date = new Date(); //本日の日付情報を取得
    item.deadline = date.toLocaleDateString().replace(/\//g, '-'); //日本の体裁を変更
  }
  item.done = false;  //完了はひとまずboolean

  todo.value = '';
  deadline.value = '';

  addItem(item);

  list.push(item);
  storage.todoList = JSON.stringify(list);
});

const filterButton = document.createElement('button'); //ボタン要素を生成
//filterButton.textContent = '優先度（高）で絞り込み';
//filterButton.id = 'priority'; //cssでの装飾用

const main = document.querySelector('main');
//main.appendChild(filterButton);

filterButton.addEventListener('click', () => {
  clearTable();
  /*
  for (const item of list) {
    if (item.priority == '高') {
      addItem(item);
    }
  }
  */
});

const clearTable = () => {
  const trList = Array.from(document.getElementsByTagName('tr'));
  trList.shift();
  for (const tr of trList) {
    tr.remove();
  }
};

const remove = document.createElement('button');
remove.textContent = '完了したTODOを削除する';
remove.id = 'remove';
const br = document.createElement('br');
main.appendChild(br);
main.appendChild(remove);

remove.addEventListener('click', () => {
  clearTable();
  list = list.filter((item) => item.done == false);
  for (const item of list) {
    addItem(item);
  }
  storage.todoList = JSON.stringify(list);
});