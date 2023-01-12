#!/bin/sh

if [ ! -d ./feeds/nodejs ]; then
  echo "error: change the directory" && exit 1
fi

PACKAGES_FEED="./feeds/packages"
PATCH_DIR="./feeds/nodejs/_patches"
PATCH_BUILDROOT="$PATCH_DIR/include-package-ipkg.mk-autofix-exec-path-in-scripts.patch"
PATCH_PACKAGES="$PATCH_DIR/utils-openzwave-add-as-dependency.patch"
STAMP_BUILDROOT="$PATCH_DIR/.buildroot-patched"
STAMP_PACKAGES="$PATCH_DIR/.packages-patched"

NODE_PKG="\
$PACKAGES_FEED/lang/node-arduino-firmata
$PACKAGES_FEED/lang/node-cylon
$PACKAGES_FEED/lang/node-hid
$PACKAGES_FEED/lang/node-homebridge
$PACKAGES_FEED/lang/node-javascript-obfuscator
$PACKAGES_FEED/lang/node-serialport
$PACKAGES_FEED/lang/node-serialport-bindings
$PACKAGES_FEED/lang/node-yarn
"

backup()
{
# package-ipkg.mk
if [ ! -f $STAMP_BUILDROOT ]; then
  patch -p1 -b -d . < $PATCH_BUILDROOT
  touch $STAMP_BUILDROOT
fi
# openzwave
if [ ! -f $STAMP_PACKAGES ]; then
  patch -p1 -b -d $PACKAGES_FEED < $PATCH_PACKAGES
  touch $STAMP_PACKAGES
  # node-*
  for pkg in $NODE_PKG
    do
      if [ ! -f "$pkg"/Makefile.orig ]; then
	mv "$pkg"/Makefile "$pkg"/Makefile.orig
      fi
  done
fi
}

check()
{
# package-ipkg.mk
patch -p1 --dry-run -d . < $PATCH_BUILDROOT
# openzwave
patch -p1 --dry-run -d $PACKAGES_FEED < $PATCH_PACKAGES
}

recovery()
{
# package-ipkg.mk
if [ -f $STAMP_BUILDROOT ]; then
  patch -p1 -R -d . < $PATCH_BUILDROOT
  rm $STAMP_BUILDROOT ./include/package-ipkg.mk.orig
fi
# openzwave 
if [ -f $STAMP_PACKAGES ]; then
  patch -p1 -R -d $PACKAGES_FEED < $PATCH_PACKAGES
  rm $STAMP_PACKAGES $PACKAGES_FEED/utils/openzwave/Makefile.orig
  # node-*
  for pkg in $NODE_PKG
    do
      if [ -f "$pkg"/Makefile.orig ]; then
	mv "$pkg"/Makefile.orig "$pkg"/Makefile
      fi
  done
fi
}

case "$1" in
    backup)
	backup
	[ $? -eq 0 ] && echo "Done"
    ;;
    check)
	check
    ;;
    recovery)
	recovery
	[ $? -eq 0 ] && echo "Done"
    ;;
    *)
	echo "Usage: $0 {backup|check|recovery}"
	exit 1
    ;;
esac

exit 0
