### Автоматизирование создание репозиториев и задач в gitlab для стажировки

API - https://docs.gitlab.com/ee/api/api_resources.html

**Конфигурации**

1. Сгенерировать personal access token в интерфейсе gitlab
2. Создать группу в интерфейсе гитлаб вручную (например '2022_02_front') 
3. Создать файл .env и прописать конфиги (добавить token и GROUP_ID в .env файл)

```
BASE_URL="https://gitlab.com/api/v4"
TOKEN="token"
DEFAULT_BRANCH="main"
GROUP_ID="83749425"
```

**Информация по репозиториям и студентам**

Для создания новых репозиториев в группу необходимо 
заполнить файл `./src/data/students.json`.
Например:
```
[
    {
      "login": "first", // Логин студента
      "repository": "front_petrov_ivan" // наименование репозитория 
    },
    {
      "login": "second",
      "repository": "front_ivanov_petr"
    }
]

```
Заполнить список мейнтейнеров в файле `./src/data/maintainers.json`
```
[{
  "login": "maintainer_first_login"
}, {
  "login": "maintainer_second_login"
}]
```

> Скрипты по созданию репозиториев и созданию задач запускаются отдельно посредством выбора соотвествующего меню после запуска скрипта

Заполнить файл с заданиями `./src/data/issues.json`
```
[
  {
     title: 'issue1',
     description: `<p><b>Задание №1 Верстка</b></p>
                   <p>Сверстать страницу по макету https://www.figma.com/file/EoPfSJWnccKjPwLEvKstgv/Picto---Personal-Portfolio-Free-Template-(Community)-(Community)?type=design&node-id=2-5&mode=design&t=fPtemcZD4QVzIkdh-0
                   </p>
                   <br>
                   <b>Условия:</b><br>
                   <ol>
                   <li>- Обязательно используем препроцессор, любой на выбор (sass, less, stylus и пр.)</li>
                   <li>- Обязательно реализуем адаптивную верстку (либо с брекпоинтами, либо резиновую на выбор)</li>
                   </ol>
                   <p><b>Необязательно, но будет плюсом:</b></p>
                   <ul>
                   <li>* выложить проект в открытый доступ (есть разные варианты, например gitlab pages и подобные подходы)</li>
                   <li>* можно добавить интерактив (слайдеры, анимации и т.п.)</li>
                   </ul>
                   <b>Крайний срок - 8 апреля</b>`
  },
  {
    "title": "second issue",
    "description": "description"
  },
  {
    "title": "third",
    "description": "third_repo"
  }
]
```

### Скрипты

`clean` - удаление директории /dist

`start` - запуск проекта

`build` - сборка и запуск проекта

### Запуск

запускаем скрипт и выбираем необходимое действие:
1. Создание репозиториев
2. Создание задач
3. Удаление всех репозиториев из группы