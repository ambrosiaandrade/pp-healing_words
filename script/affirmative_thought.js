let dataJSON = {};
let tipsJSON = {};

const LIST = "affirmative_thought_list";
const THEME = "affirmative_thought_theme";

let listCombined = [];
let listWithoutReligion = [];
let listWithReligion = [];

const infoHTML = document.getElementById('infoContainer');
const tipHTML = document.getElementById('tipsContainer');
const religiousHTML = document.getElementById('religiousContainer');
const nonReligiousHTML = document.getElementById('nonReligiousContainer');

function start() {
  fetch('./resource/data.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar o arquivo data.json.');
      }
      return response.json();
    })
    .then(data => {
      dataJSON = data;
      fillLists(data);
    });

  fetch('./resource/tips.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar o arquivo tips.json.');
      }
      return response.json();
    })
    .then(data => {
      tipsJSON = data;
    });

}

function generateAffirmativeThoughts() {
  let filteredData = {};

  filteredData = dataJSON.filter(item => listCombined.includes(item.name));
  handleInformation(filteredData);

  handleTips(tipsJSON);
}

function generateRandomNumber(limit) {
  return Math.floor(Math.random() * limit);
}

function handleInformation(data) {
  let indexObject = generateRandomNumber(data.length);
  let randomObject = data[indexObject];

  let indexRandomObject = generateRandomNumber(randomObject.input.length);
  writeInHTML(randomObject.input[indexRandomObject], randomObject.name, false);
}

function handleTips(data) {
  let index = generateRandomNumber(data.length);
  let text = data[index].split(" - ");
  console.log();
  writeInHTML(text[1], text[0], true);
  console.log();
}

function fillLists(data) {
  listCombined = [];
  listWithoutReligion = data.filter(item => !item.isReligious).map(item => item.name);
  listWithReligion = data.filter(item => item.isReligious).map(item => item.name);

  if (localStorage.getItem(LIST) == "undefined") {
    localStorage.removeItem(LIST);
  }
  else if (localStorage.getItem(LIST) == null) {
    listCombined.push(...listWithReligion, ...listWithoutReligion);    
    setListInLocalStorage(listCombined);
    console.log(listCombined)
  } else {
    listCombined = getListInLocalStorage();
    console.log("localStorage ", listCombined)
  }
  
}

function setListInLocalStorage(list) {
  let newList = "[";
  list.forEach(item => {
      if (item.includes(",")){
        item = item.replace(",","_");
      }
      newList += `"${item}",`;
      return item;
    })
    newList += `]`;
    newList = newList.replace(",]","]");
  localStorage.setItem(LIST, newList);
}

function getListInLocalStorage() {
  let newList = [];
  let list = JSON.parse(localStorage.getItem(LIST));
  list.forEach(item => {
    if (item.includes("_")){
      item = item.replace("_",",");
    }
    newList.push(item);
  })
  return newList;
}

function writeInHTML(text, name, isTip) {
  if (isTip) {
    tipHTML.innerHTML = `<h3>${text}</h3>
                         <p>[${name.toUpperCase()}]</p>`;
  } else {
    infoHTML.innerHTML = `<h2>${text}</h2>
                         <p>[${name.toUpperCase()}]</p>`;
  }
}

function generateListHTML(isReligious) {
  let filteredData = dataJSON.filter(item => item.isReligious == isReligious).filter(item => item.name != "Padrão");

  filteredData.forEach(item => {
    const label = document.createElement('label');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `show${item.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`;
    checkbox.checked = listCombined.includes(item.name);
    checkbox.value = item.name;

    const labelText = document.createTextNode(item.name);

    label.appendChild(checkbox);
    label.appendChild(labelText);

    if (isReligious) {
      religiousHTML.appendChild(label);
    } else {
      nonReligiousHTML.appendChild(label);
    }
  })

}

function removeAllItensByFlag(isReligious) {
  console.log("removeAllItensByFlag(isReligious) " + isReligious)
  console.log("listCombined ", listCombined)
  if (isReligious){
    listCombined = listCombined.filter(item => listWithReligion.includes(item.replace("_",",")));
  } else {
    listCombined = listCombined.filter(item => listWithoutReligion.includes(item.replace("_",",")));
  }
  console.log("listCombined after", listCombined)
  setListInLocalStorage(listCombined);
}

function updateList(name, isChecked, isReligious) {
  if (typeof name !== "undefined") {
    if (isReligious) {
      if (isChecked)
        listWithReligion.push(name);
      else 
        listWithReligion = listWithReligion.filter(item => item != name);
    } else {
      if (isChecked)
        listWithoutReligion.push(name);
      else
        listWithoutReligion = listWithoutReligion.filter(item => item != name);
    }

    updateListCombined(name, isChecked)
    console.log("[updateList] " + listWithReligion.length)
    console.log(listCombined)
  }
}

function updateListCombined(name, isChecked) {
  if (isChecked) {
    if (!listCombined.includes(name)) {
      listCombined.push(name);
    }
  } else {
    listCombined = listCombined.filter(item => item != name);
  }
  setListInLocalStorage(listCombined);
}

function handleText(text) {
  text = String(text);
  let result = text.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  console.log("result " + result)
}

function resetValues() {
  localStorage.removeItem(LIST);
  localStorage.removeItem(THEME);
  religiousHTML.innerHTML = "";
  nonReligiousHTML.innerHTML = "";
  document.querySelector("#showPropertyNonReligious").checked = true;
  document.querySelector("#showPropertyReligious").checked = true;
  fillLists(dataJSON);
  generateListHTML(true);
  generateListHTML(false);
  generateAffirmativeThoughts();
}

start();