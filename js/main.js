import { data, state } from '../store/fake-data.js';

/**
 * Рендер генерирумой части страницы после полной загрузки DOM
 */
document.addEventListener('DOMContentLoaded', render);

/**
 * Функция перерисовывает генерируемные программно части HTML-документа
 */
function render() {
	createTree('.file-tree', data);
	hideOrShowMenu();
	changeDescription();
}

/**
 * Функция создания дерева папок
 * @param {HTMLElement} container HTML-элемент, в который будет вставлено дерево
 * @param {object} obj Получаемый объект дерева с иерархической вложенностью 
 */
function createTree(container, obj) {
	document.querySelector(container).append(createUl(obj));
}

/**
 * Функция строит вложенный список `<ul></ul>` и классово разделяет папки и файлы
 * @param {object} obj Получаемый объект дерева с иерархической вложенностью 
 * @returns {HTMLUListElement} Вложенный ul-список
 */
function createUl(obj) {
	if (typeof obj !== 'object')
		return;
	let ul = document.createElement('ul');
	for (let key in obj) {
		let li = document.createElement('li');
		li.textContent = key;
		let childrenUl = createUl(obj[key]);
		if (childrenUl) {
			li.append(childrenUl)
		} else {
			li.className = 'file';
		}
		ul.append(li);
	}
	return ul;
}

/**
 * Функция отвечает за сворачивание и разворачивание папок
 */
function hideOrShowMenu() {
	let tree = document.querySelector('.file-tree');
	for (let li of document.querySelectorAll('li')) {
		if (li.hasChildNodes()) {
			let span = document.createElement('span');
			let spanForFolder = document.createElement('span');
			span.classList.add('show');
			spanForFolder.className = 'folder';
			if (!li.classList.contains('file')) {
				span.prepend(spanForFolder);
			}
			li.prepend(span);
			span.append(span.nextSibling)
		}
	}
	for (let li of document.querySelectorAll('li')) {
		if (li.classList.contains('file')) {
			li.lastChild.classList.remove('show');
		}
	}
	tree.onclick = (e) => {
		if (e.target.tagName != 'SPAN') {
			return;
		}
		let childrenContainer = e.target.parentNode.querySelector('ul');
		if (!childrenContainer) {
			return;
		}
		childrenContainer.hidden = !childrenContainer.hidden;
		if (childrenContainer.hidden) {
			e.target.classList.add('hide');
			e.target.children[0].className = 'close-folder';
			e.target.classList.remove('show');
		} else {
			e.target.classList.add('show');
			e.target.children[0].className = 'folder';
			e.target.classList.remove('hide');
		}
	}
};

/**
 * Функция, анимирующая появление красной границы вокруг дерева, если не выбран элемент, но это требуется
 */
function setWarning() {
	let tree = document.querySelector('.file-tree');
	tree.classList.add('warning');
	setTimeout(() => tree.classList.remove('warning'), 300);
};


/**
 * Обработчик события добавления новой папки
 */
document.getElementById('createFolder').addEventListener('click', () => {
	if (state.currentTarget == '') {
		let folderName = prompt('Введите название папки');
		if (!folderName) {
			return;
		}
		data[`${folderName}`] = {};
		document.querySelector('.file-tree').innerHTML = '';
		render();
	} else {
		let folderName = prompt('Введите название папки');
		if (!folderName) {
			return;
		}
		document.querySelector('.file-tree').innerHTML = '';
		putNewPositionInTree('folder', state.currentTarget, data, folderName);
		render();
	}
});

/**
 * Обработчик события удаления папки
 */
document.getElementById('deleteFolder').addEventListener('click', () => {
	deleteElem();
});

/**
 * Обработчик события удаления файла
 */
document.getElementById('deleteFile').addEventListener('click', () => {
	deleteElem();
});

/**
 * Обработчик события выбора элемента дерева, который сохраняется в state приложения, с последующим открытием файла
 */
document.querySelector('.file-tree').addEventListener('click', (e) => {
	window.getSelection().selectAllChildren(e.target);
	state.currentTarget = e.target.innerHTML.replace(/(\<(\/?[^>]+)>)/g, '');
	if (checkSameTabs(state.currentTarget)) {
		return;
	} else {
		readAndWriteText(data, state.currentTarget);
	}
});

/**
 * Обработчик события переименования папки или файла
 */
document.getElementById('rename').addEventListener('click', () => {
	if (state.currentTarget == '') {
		setWarning();
	} else {
		let newName = prompt('Введите новое название');
		if (newName) {
			findAndRenameFileOrFolder(data, state.currentTarget, newName);
			let tabs = document.querySelectorAll('.file-title');
			if (tabs.length > 0) {
				for (let i of tabs) {
					if (i.innerText === state.currentTarget) {
						i.innerText = newName;
					}
				}
				let areas = document.querySelectorAll('.file-body');
				for (let i of areas) {
					if (i.id === state.currentTarget) {
						i.id = newName;
					}
				}
			}
			document.querySelector('.file-tree').innerHTML = '';
			render();
		}
	}
});

/**
 * Обработчик события вывода тултипа
 */
document.onmouseover = (e) => {
	let target = e.target;
	if (target.tagName === 'SPAN') {
		let content = findDescription(target.textContent);
		if (!content) {
			return;
		} else {
			let tooltip = document.createElement('div');
			tooltip.classList.add('tooltip');
			tooltip.innerHTML = content;
			document.body.append(tooltip);

			let coords = target.getBoundingClientRect();
			let left = coords.left + (target.offsetWidth - tooltip.offsetWidth) + 80;
			if (left < 0) left = 0;

			let top = coords.top - tooltip.offsetHeight + 80;
			if (top < 0) {
				top = coords.top + target.offsetHeight + 5;
			}

			tooltip.style.left = left + 'px';
			tooltip.style.top = top + 'px';

			document.onmouseout = function (e) {
				if (tooltip) {
					tooltip.remove();
					tooltip = null;
				}
			}
		}
	}
};

/**
 * Функция, получающая описание файла из state для вывода тултипа
 * @param {string} file Название файла
 * @returns {string} Описание файла
 */
function findDescription(file) {
	let descs = state.descriptions;
	for (let i of Object.keys(descs)) {
		if (i === file) {
			return state.descriptions[i];
		}
	}
}

/**
 * Функция изменения описания файла при сохранении файла
 */
function changeDescription(file, newText) {
	let descs = state.descriptions;
	for (let i in descs) {
		if (i === file) {
			descs[i] = newText;
		}
	}
};

/**
 * Функция создания вкладок открытых файлов, а также их переключение
 */
function createTabs() {
	let tabs = document.querySelectorAll('.file-title');
	tabs.forEach((item) => {
		item.addEventListener('click', (e) => {
			let areas = document.querySelectorAll('.file-body');
			areas.forEach((item) => {
				item.style.display = 'none';
			})
			let currentTab = item;
			tabs.forEach((item) => {
				item.classList.remove('active');
			})
			currentTab.classList.add('active');
			state.currentTarget = e.target.textContent;
			let area = document.getElementById(state.currentTarget);
			area.style.display = 'block';
		})
	})
};

/**
 * Функция проверяет, не открыт ли уже выбранный файл, чтобы не дублировать вкладку
 * @param {string} name Название файла из state
 * @returns {boolean} Найден ли уже открытый файл
 */
function checkSameTabs(name) {
	let tabs = document.querySelectorAll('.file-title');
	for (let item of tabs) {
		if (item.textContent == name) {
			return true;
		}
	}
	return false;
};

/**
 * Фунция проверяет наличие файла и открывает его при нахождении, а также содержит обработчик события сохранения текста
 * @param {object} tree Получаемый объект дерева с иерархической вложенностью
 * @param {string} name Название файла, который нужно прочесть
 */
function readAndWriteText(tree, name) {
	if (typeof tree !== 'object') {
		return;
	}
	for (let i in tree) {
		if (typeof tree[i] === 'string' && i === name) {
			let fileTitle = state.currentTarget;
			let file = document.createElement('div');
			file.innerHTML = fileTitle;
			file.classList.add('file-title');
			if (!document.querySelector('.nav-bar-files').hasChildNodes()) {
				file.classList.add('active');
			}
			document.querySelector('.nav-bar-files').append(file);

			let textArea = document.querySelector('.text');
			let bodyFile = document.createElement('textarea');
			bodyFile.classList.add('file-body');
			bodyFile.setAttribute('id', fileTitle);
			bodyFile.style.resize = 'none';
			bodyFile.innerHTML = tree[i];
			bodyFile.addEventListener('keydown', (e) => {
				if (e.code == 'KeyS' && (e.ctrlKey || e.metaKey)) {
					e.preventDefault();
					overrideFile(bodyFile.id, e.target.value, data);

					let text = e.target.value;
					let necessaryText = text.match(/<summary\b[^>]*>((?:(?!<\/summary\s*>).)*)/gm);
					let result = necessaryText[0].slice(9);

					changeDescription(bodyFile.id, result);

				}
			});
			if (document.querySelectorAll('.file-body').length > 0) {
				bodyFile.style.display = 'none';
			}
			textArea.append(bodyFile);
			createTabs();
		} else {
			readAndWriteText(tree[i], name);
		}
	}
};

/**
 * Функция удаляет из дерева выбранную папку или файл
 */
function deleteElem() {
	if (state.currentTarget == '') {
		setWarning();
	} else {
		findAndDeleteFileOrFolder(data, state.currentTarget);
		document.querySelector('.file-tree').innerHTML = '';
		render();
		let tabs = document.querySelectorAll('.file-title');
		for (let i of tabs) {
			if (i.textContent === state.currentTarget) {
				i.remove();
				let area = document.getElementById(i.textContent);
				area.remove();
			}
		}
		state.currentTarget = '';
	}
};

/**
 * Функция обхода дерева и удаления элемента
 * @param {object} tree Получаемый объект дерева с иерархической вложенностью
 * @param {string} file Выбранный файл или папка
 */
function findAndDeleteFileOrFolder(tree, file) {
	if (typeof tree !== 'object')
		return false;
	for (let i in tree) {
		if (file == i) {
			delete tree[i]
			return;
		} else {
			findAndDeleteFileOrFolder(tree[i], file)
		}
	}
};

/**
 * Функция обхода дерева и переименования элемента
 * @param {object} tree Получаемый объект дерева с иерархической вложенностью
 * @param {string} file Выбранный файл или папка
 * @param {string} name Новое название
 */
function findAndRenameFileOrFolder(tree, file, name) {
	if (typeof tree !== 'object')
		return false;
	for (let i in tree) {
		if (file == i) {
			if (i != name) {
				Object.defineProperty(tree, name,
					Object.getOwnPropertyDescriptor(tree, i));
				delete tree[i];
			}
			return;
		} else {
			findAndRenameFileOrFolder(tree[i], file, name)
		}
	}
}

/**
 * Функция вставки нового элемента в дерево
 * @param {string} type Тип вставляемого элемента: 'folder' | 'file'
 * @param {string} nodeName Название узла, в которое будет вставлен элемент
 * @param {object} tree Получаемый объект дерева с иерархической вложенностью
 * @param {string} title Название новой папки или файла
 * @param {string} content Содержание файла
 */
function putNewPositionInTree(type, nodeName, tree, title, content = '') {
	if (type === 'folder') {
		if (typeof tree !== 'object')
			return false;
		for (let i in tree) {
			if (i === nodeName) {
				tree[nodeName][title] = {}
				return true;
			} else {
				putNewPositionInTree('folder', nodeName, tree[i], title);
			}
		}
	}
	if (type === 'file') {
		if (typeof tree !== 'object')
			return false;
		for (let i in tree) {
			if (i === nodeName) {
				tree[nodeName][title] = content;
				return true;
			} else {
				putNewPositionInTree('file', nodeName, tree[i], title, content);
			}
		}
		return true;
	}
}

/**
 * Обработчик клика на загрузку файла и работа с модальным окном
 */
let modal = document.getElementById("myModal");
let span = document.getElementsByClassName("close-modal")[0];

document.getElementById('loadFile').addEventListener('click', () => {
	if (state.currentTarget == '') {
		setWarning();
	} else {
		modal.style.display = 'block';
	}
});

span.onclick = () => {
	modal.style.display = 'none';
};

window.onclick = (e) => {
	if (e.target == modal) {
		modal.style.display = 'none';
	}
};

/**
 * Обработчик при загрузке файла. Считывает содержимое и сохраняет как текст в новом файле дерева
 */
document.getElementById('file-input').addEventListener('change', (e) => {
	let file = e.target.files[0];
	let reader = new FileReader();
	reader.readAsText(file);
	reader.onload = () => {
		let result = putNewPositionInTree('file', state.currentTarget, data, file.name, reader.result);
		if (result) {
			document.querySelector('.file-tree').innerHTML = '';
			document.querySelector('#file-input').value = '';
			render();
		}
		modal.style.display = 'none';
	}
	reader.onerror = () => {
		console.log('Error: ' + reader.error);
	}
});

/**
 * Обработчик при выгрузке файла. Получает содержимое и инициирует загрузку в браузере
 */
document.getElementById('downloadFile').addEventListener('click', (e) => {
	if (state.currentTarget == '') {
		setWarning();
	} else {
		getFileContent(state.currentTarget, data);
		e.target.setAttribute('href', 'data:text/plain;charset=utf-8,' + fileContent);
		e.target.setAttribute('download', `${state.currentTarget}`);
	}
});

/**
 * Внешняя переменная для хранения содержимого файла
 */
let fileContent;
/**
 * Функция достает контент файла для последующей скачки на устройство
 * @param {string} fileName Название выгружаемого файла
 * @param {object} tree Получаемый объект дерева с иерархической вложенностью
 */
function getFileContent(fileName, tree) {
	if (typeof tree !== 'object')
		return false;
	for (let i in tree) {
		if (fileName == i && typeof i !== 'object') {
			fileContent = tree[i]
			return;
		} else {
			getFileContent(fileName, tree[i]);
		}
	}
};

/**
 * Функция перезаписывает файл при сохранении
 * @param {string} title Название файла, которое перезаписывается
 * @param {string} text Новый текст
 * @param {object} tree Получаемый объект дерева с иерархической вложенностью
 */
function overrideFile(title, text, tree) {
	if (typeof tree !== 'object')
		return false;
	for (let i in tree) {
		if (title == i && typeof i !== 'object') {
			tree[i] = text;
			return;
		} else {
			overrideFile(title, text, tree[i]);
		}
	}
}