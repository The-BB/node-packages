# node-packages
based on https://github.com/nxhack/openwrt-node-packages
(see README.md.orig)

0. Читаем и выполняем [Compile packages from sources](https://github.com/Entware/Entware/wiki/Compile-packages-from-sources)

1. Добавляем:
```
echo 'src-git-full nodejs https://github.com/The-BB/node-packages.git' >> feeds.conf
```
2. Удаляем:
```
rm -rf ./feeds/packages/lang/node-*
```
3. Обновляем:
```
./scripts/feeds update nodejs

./scripts/feeds install -a -p nodejs
```
4. Патчим:

лень победила разум ;)
```
patch -p1 -d . < ./feeds/nodejs/fix-interpreters.patch
```
зависимость
```
patch -p1 -d ./feeds/packages < ./feeds/nodejs/openzwave.patch
```
5. Запускаем:
```
make menuconfig
```
...
