# Сервис для создания подписей для ЕСИА на nodejs с КриптоПро 5.0 в докер контейнере
https://github.com/waves-enterprise/cryptopro-sign  
Основан на https://github.com/dbfun/cryptopro

## Принцип работы
* Устанавливает КриптоПро из установщика `cryptopro/install/linux-amd64_deb.tgz`
* При старте контейнера:
  * Устанавливает лицензию КриптоПро
  * Загружает корневой сертификат есиа
  * Загружает пользовательский сертификат
  * Запускает рест сервер со swagger и методом создания подписей

### Установка лицензии
Лицензия устанавливается из переменной окружения `LICENSE`, если не указана используется триал версия (работает 3 месяца).

### Загрузка корневого сертификата 
В зависимости от переменной окружения `ESIA_ENVIRONMENT`, загружается сертификат нужного окружения ЕСИА:
* Если не указан или указан `test` - сертификат тестового контура ЕСИА (https://esia-portal1.test.gosuslugi.ru)
* Если указан `prod` - сертификат от основного ЕСИА (https://esia.gosuslugi.ru)

Корневые сертификаты ЕСИА лежат в папке `cryptopro/esia`

### Загрузка пользовательского сертификата
Необходимо специальным образом сформировать zip-архив `certificate_bundle.zip` и положить его в папку `/cryptopro/certificates`.
Пример такого zip-файла лежит в той же директории под названием `certificate_bundle_example.zip`
Содержимое zip файла:
```
├── certificate.cer - файл сертификата
└── le-09650.000 - каталог с файлами закрытого ключа
    ├── header.key
    ├── masks2.key
    ├── masks.key
    ├── name.key
    ├── primary2.key
    └── primary.key
```
Первый найденный файл в корне архива будет воспринят как сертификат, а первый найденный каталог - как связка файлов закрытого ключа. Пароль от контейнера, если есть, передается переменной окружения `CERTIFICATE_PIN`.
Пароль от архива, если есть, передаётся переменной окружения при запуске 

### Как запустить
1. Скачать [КриптоПро CSP 5.0 для Linux (x64, deb)](https://www.cryptopro.ru/products/csp/downloads) и положить по пути `install/linux-amd64_deb.tgz`
2. Подготовить архив с сертификатом на хосте и назвать его `certificate_bundle.zip`
3. Создаем образ `docker build --tag cryptopro-sign .`
4. Запускаем `docker run -p 3037:3037 -v <Путь к директории на хосте с certificate_bundle.zip>:/cryptopro/certificates/:ro --env BUNDLE_PASSWORD=<Пароль от zip архива> --env LICENCE=<Лицензия CryptoPro> --env CERTIFICATE_PIN=<Пароль от контейнера> --env ESIA_ENVIRONMENT=<test/prod> --name cryptopro-sign cryptopro-sign`

### Рест сервер
Если следовать инструкции выше, то свагер будет находиться по адресу `http://localhost:3037/docs/#/`
Там же есть примеры вызова методов.
Доступные методы:
* `POST /cryptopro/sign` - подписать текст

### Как по быстрому выпустить тестовый сертификат:
* Запустить докер контейнер по инструкции выше
* Заходим в запущенный контейнер `docker exec -ti cryptopro-sign sh`
* Создаем запрос на сертификат `cryptcp -creatrqst -dn 'cn=test' -cont '\\.\hdimage\test2' -pin 12345678 tmp/test.csr` (попросит понажимать разные клавиши)
* Выводим результат `cat /tmp/test.csr`
* Заходим на `http://www.cryptopro.ru/certsrv/certrqxt.asp` и вставляем вывод
* В следующем окне выбираем `Base64-шифрование` и `Скачать сертификат`
* Качаем и сохраняем `certnew.cer` файл в проекте по пути `cryptopro/certificates/certnew.cer`
* В отдельном терминале переносим файл в запущенный контейнер `docker cp cryptopro/certificates/certnew.cer cryptopro-sign:tmp/test.cer`
* Возвращаемся в первый терминал и загружаем сертификат в КриптоПро `cryptcp -instcert -cont '\\.\hdimage\test2' tmp/test.cer`
* Попросит ввести пароль. Вводим `12345678`
* Переносим на нашу машину приватные ключи `docker cp cryptopro-sign:var/opt/cprocsp/keys/root/test2.000 cryptopro/certificates/test2.000`
* В папке проекта `cryptopro/certificates` создаем архив. В архив кладем папку `test2.000` и файл `certnew.cer`
* Архив называем `certificate_bundle.zip`, пересобираем докер образ и запускаем. 

### Авторизация
Для использования в продакшене лучше, чтобы сервис был не доступен снаружи инфраструктуры, т.к тут через рест можно что угодно подписать зашитым сертификатом. Если все же инфраструктура открытая, то в сервис следует встроить проверку авторизации.

### Возможные проблемы:
Если получаете код ошибки `0x80090010` при вызове метода sign - вероятно срок действия вашего сертификата истек. Попробуйте создать новый по инструкции.