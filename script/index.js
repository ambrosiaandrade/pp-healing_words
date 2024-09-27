function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
  let iconTheme = document.getElementById("toggleThemeBtn");
  if (theme == 'dark') {
    iconTheme.classList.add("fa-sun");
    iconTheme.classList.remove("fa-moon");
  } else {
    iconTheme.classList.add("fa-moon");
    iconTheme.classList.remove("fa-sun");
  }
  localStorage.setItem(THEME, theme);
}

function toggleSettings() {
  const settingsPanel = document.getElementById('settingsPanel');
  settingsPanel.classList.toggle('active');
  if (document.getElementById('religiousContainer').children.length == 0) {
    generateListHTML(true);
    generateListHTML(false);
  }
}

function toggleReset() {
  resetValues();
}

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  setTimeout(function() {
    generateAffirmativeThoughts();
  }, 200); // 500 milissegundos = 0.5 segundo
});

document.getElementById('generateAffirmativeThoughtsBtn').addEventListener('click', () => {
  generateAffirmativeThoughts();
});

document.getElementById('generateHolisticInfoBtn').addEventListener('click', () => {
  //generateAffirmativeThoughts();
});

document.getElementById('showPropertyNonReligious').addEventListener('click', (event) => {
  if (event.target.checked) {
    generateListHTML(false);
  } else {
    document.getElementById('nonReligiousContainer').innerHTML = "";
  }
});

document.getElementById('showPropertyReligious').addEventListener('click', (event) => {
  if (event.target.checked) {
    generateListHTML(true);
  } else {
    document.getElementById('religiousContainer').innerHTML = "";
  }
  removeAllItensByFlag(event.target.checked)
});

document.getElementById('nonReligiousContainer').addEventListener('click', (event) => {
  if (event.target.type === 'checkbox') {
    updateList(event.target.value, event.target.checked, false);
  }
});

document.getElementById('religiousContainer').addEventListener('click', (event) => {
  if (event.target.type === 'checkbox') {
    updateList(event.target.value, event.target.checked, true);
  }
});
