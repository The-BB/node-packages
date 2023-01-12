# node-packages
based on https://github.com/nxhack/openwrt-node-packages (see README.md.orig)

0. Читаем и выполняем [Compile packages from sources](https://github.com/Entware/Entware/wiki/Compile-packages-from-sources). 

1. Добавляем фид в конфиг:
```
echo 'src-git-full nodejs https://github.com/The-BB/node-packages.git' >> feeds.conf
```
2. Обновляем фид:
```
./scripts/feeds update nodejs
```
3. Подготавливаем к работе (создаём копии и патчим):
```
sh ./feeds/nodejs/backup-recover.sh backup
```
4. Добавляем пакеты из фида:
```
./scripts/feeds install -a -p nodejs
```
5. Собираем пакеты...

6. Перед обновлением фидов восстанавливаем:
```
sh ./feeds/nodejs/backup-recover.sh recovery
```
