# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=npm-check-updates
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=16.6.2
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=7a82a227a6f1647353b3ae305cf91a952f00ade6f1ada0c0257e9a457e61843a

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>, Patrik Laszlo <alabard@gmail.com>
PKG_LICENSE:=Apache-2.0
PKG_LICENSE_FILES:=LICENSE

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_USE_MIPS16:=0

include $(INCLUDE_DIR)/package.mk

define Package/node-npm-check-updates
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=Upgrade your NPM/Bower dependencies
  URL:=https://www.npmjs.com/package/npm-check-updates/
  DEPENDS:=+node +git
endef

define Package/node-npm-check-updates/description
 The npm-check-updates program is a command-line tool that allows you to upgrade your package.json or bower.json dependencies to the latest versions, regardless of existing version constraints
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)

TARGET_CFLAGS+=$(FPIC)
TARGET_CPPFLAGS+=$(FPIC)

define Build/Compile
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/opt/ \
	npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM) \
	npm_config_tmp=$(TMP_DIR)/npm-tmp-$(TMPNPM) \
	npm install --no-save --no-package-lock --legacy-peer-deps --ignore-scripts
	# npm install --production --global-style --no-save --omit=dev --no-package-lock --legacy-peer-deps
	rm -rf $(TMP_DIR)/npm-tmp-$(TMPNPM)
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -delete || true
endef

define Package/node-npm-check-updates/install
	$(INSTALL_DIR) $(1)/opt/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,*.md} \
		$(1)/opt/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/LICENSE \
		$(1)/opt/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,build} \
		$(1)/opt/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/opt/bin
	$(LN) ../lib/node/$(PKG_NPM_NAME)/build/src/bin/cli.js $(1)/opt/bin/npm-check-updates
	$(LN) ../lib/node/$(PKG_NPM_NAME)/build/src/bin/cli.js $(1)/opt/bin/ncu
	$(INSTALL_DIR) $(1)/opt/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/opt/lib/node_modules/$(PKG_NPM_NAME)
endef

define Package/node-npm-check-updates/postrm
#!/bin/sh
rm /opt/lib/node_modules/npm-check-updates || true
rm -rf /opt/lib/node/npm-check-updates || true
endef

$(eval $(call BuildPackage,node-npm-check-updates))
