/**
 * Фейковые данные для представления дерева папок и контента файлов
 */
let data = {
	project_1: {
		bin: {
			Debug: {
				'error.txt': `<summary>Репорт различных ошибок за прошедшие сутки</summary>\nDec 3 14:31:05 pegasus splogger[32100]: 1VnnFx-0008Lk-Gt X-PHP-Originating-Script: "2673: script_name"\n# Cтрока содержит информацию об X-PHP-Originating-Script — источнике отправляемого сообщения. В этой строчке будет имя скрипта, который был использован для отправки.\nDec 3 14:31:05 pegasus splogger[32100]: 1VnnFx-0008Lk-Gt <= mail@имядомена.ru U=имя_аккаунта P=local S=380\n# Строка содержит информацию об адресе отправителя (mail@имядомена.ru) и имени пользователя отправителя (U=имя_аккаунта). Эту строчку можно найти по наличию в ней знака <=. Строка с <= в логе отправки сообщения может быть только одна.\nDec 3 14:31:07 pegasus splogger[32130]: 1VnnFx-0008Lk-Gt => user@gmail.com R=dnslookup T=remote_smtp H=gmail-smtp-in.l.google.com [2a00:1450:4008:c01::1b] X=TLSv1:RC4-SHA:128\n# Строка содержит информацию о том, что письмо было успешно доставлено на адрес user@gmail.com, что доставка была произведена на сервер gmail-smtp-in.l.google.com с адресом 2a00:1450:4008:c01::1b.\nВ конце этой строки может быть строка ответа стороннего сервера с кодом, который присвоен сообщению. По наличию в строке символа => можно понять, что письмо было успешно доставлено.\nDec 3 14:31:07 pegasus splogger[32130]: 1VnnFx-0008Lk-Gt Complete \n# Строка содержит запись Completed, что означает, что сервер прекратил обработку данного сообщения. Эта запись не означает, что письма были успешно доставлены.`
			}
		},
		resources: {
			'images.svg': `<summary>Вставить эту картинку</summary>\n<?xml version="1.0" encoding="UTF-8"?>
				< svg xmlns="http://www.w3.org/2000/svg" xmlns: xlink = "http://www.w3.org/1999/xlink" width="10px" height="10px" viewBox="0 0 10 10" version="1.1" >
				<g id="surface1">
					<path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 10 9.683594 L 0 9.683594 L 5 0.316406 Z M 10 9.683594 " />
				</g>n
</svg >
`
		},
		'App.txt': '<summary>Читать описание проекта</summary>\nLorem ipsum dolor sit amet consectetur adipisicing elit. \nError cupiditate deleniti esse eum tenetur quam fugiat porro necessitatibus nemo iste! Accusantium, nisi cupiditate animi eaque voluptate est vero aperiam similique! Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora earum dolore eius rem sed sint, id laboriosam culpa numquam quae vero quod laborum laudantium reprehenderit officiis recusandae natus nostrum tenetur odio molestias veritatis delectus beatae alias! Facere ea nulla enim quas cumque, explicabo ratione in veniam ipsam accusantium labore molestias! Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora earum dolore eius rem sed sint, id laboriosam culpa numquam quae vero quod laborum laudantium reprehenderit officiis recusandae natus nostrum tenetur odio molestias veritatis delectus beatae alias! Facere ea nulla enim quas cumque, explicabo ratione in veniam ipsam accusantium labore molestias! Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora earum dolore eius rem sed sint, id laboriosam culpa numquam quae vero quod laborum laudantium reprehenderit officiis recusandae natus nostrum tenetur odio molestias veritatis delectus beatae alias! Facere ea nulla enim quas cumque, explicabo ratione in veniam ipsam accusantium labore molestias! Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora earum dolore eius rem sed sint, id laboriosam culpa numquam quae vero quod laborum laudantium reprehenderit officiis recusandae natus nostrum tenetur odio molestias veritatis delectus beatae alias! Facere ea nulla enim quas cumque, explicabo ratione  in veniam ipsam accusantium labore molestias! Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora earum dolore eius rem sed sint, id laboriosam culpa numquam quae vero quod laborum laudantium reprehenderit officiis recusandae natus nostrum tenetur odio molestias veritatis delectus beatae alias! Facere ea nulla enim quas cumque, explicabo ratione in veniam ipsam accusantium labore molestias! Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora earum dolore eius rem sed sint, id laboriosam culpa numquam quae vero quod laborum laudantium reprehenderit officiis recusandae natus nostrum tenetur odio molestias veritatis delectus beatae alias! Facere ea nulla enim quas cumque, explicabo ratione in veniam ipsam accusantium labore molestias!vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvLorem ipsum dolor sit amet consectetur adipisicing elit. Tempora earum dolore eius rem sed sint, id laboriosam culpa numquam quae vero quod laborum laudantium reprehenderit officiis recusandae natus nostrum tenetur odio molestias veritatis delectus beatae alias! Facere ea nulla enim quas cumque, explicabo ratione in veniam ipsam accusantium labore molestias!Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora earum dolore eius rem sed sint, id laboriosam culpa numquam quae vero quod laborum laudantium reprehenderit officiis recusandae natus nostrum tenetur odio molestias veritatis delectus beatae alias! Facere ea nulla enim quas cumque, explicabo ratione in veniam ipsam accusantium labore molestias!',
		'Demo.js': '<summary>Пример чего-то</summary>\nfunction sayBye(user) \n{alert(`Bye, ${user}!`)};\n'
	}
};

/**
 * Глобальный стейт для хранения текущего выбранного элемента и описания файлов
 */
let state = {
	currentTarget: '',
	descriptions: {
		'error.txt': 'Репорт различных ошибок за прошедшие сутки',
		'images.svg': 'Вставить эту картинку',
		'Demo.js': 'Пример чего-то',
		'App.txt': 'Читать описание проекта'
	},
};

export { data, state };