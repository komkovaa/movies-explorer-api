# movies-explorer-api
## Бэкенд диплома  
### Описание дипломной работы
Сервис, в котором можно найти фильмы по запросу и сохранить в личном кабинете.  
API для аутентификации пользователей и сохранения фильмов. 

### Функционал:
Роуты для пользователей:

- GET /users/me — возвращает информацию о пользователе (email и имя);
- PATCH /users/me — обновляет информацию о пользователе (email и имя);

Роуты для фильмов:

- GET /movies — возвращает все сохранённые текущим пользователем фильмы;
- POST /movies — создает фильм с переданными данными {country, director, duration, year, description, image, trailer, nameRU, nameEN и thumbnail, movieId};
- DELETE /movies/:cardId — удаляет фильм по _id.

### Стек технологий:
JavaScript:
- Промисы (Promise);
- Асинхронность и оптимизация;
- Rest API;  

Node.js;  
Express;  
MongoDB.


### Ссылка на домен сервиса
(https://api.komkova.diploma.nomoredomains.club)
