# This is free software, licensed under the GNU General Public License v2.
# See /LICENSE for more information.
#

include $(TOPDIR)/rules.mk

PKG_NPM_NAME:=mqtt
PKG_NAME:=node-$(PKG_NPM_NAME)
PKG_VERSION:=5.1.2
PKG_RELEASE:=1

PKG_SOURCE:=$(PKG_NPM_NAME)-$(PKG_VERSION).tgz
PKG_SOURCE_URL:=https://registry.npmjs.org/$(PKG_NPM_NAME)/-/
PKG_HASH:=d7c79e5abfa8065d781259a868a77f0e726183fb146c630ec86fe09bc59c5a60

PKG_MAINTAINER:=Hirokazu MORIKAWA <morikw2@gmail.com>
PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE.md

PKG_BUILD_DEPENDS:=node/host
PKG_BUILD_PARALLEL:=1
PKG_BUILD_FLAGS:=no-mips16

include $(INCLUDE_DIR)/package.mk

define Package/node-mqtt
  SUBMENU:=Node.js
  SECTION:=lang
  CATEGORY:=Languages
  TITLE:=A library for the MQTT protocol
  URL:=https://www.npmjs.org/package/mqtt
  DEPENDS:=+node +node-ws
endef

define Package/node-mqtt/description
 MQTT.js is a client library for the MQTT protocol, written in JavaScript for node.js and the browser
endef

TAR_OPTIONS+= --strip-components 1
TAR_CMD=$(HOST_TAR) -C $(1) $(TAR_OPTIONS)

NODEJS_CPU:=$(subst powerpc,ppc,$(subst aarch64,arm64,$(subst x86_64,x64,$(subst i386,ia32,$(ARCH)))))
TMPNPM:=$(shell mktemp -u XXXXXXXXXX)
NPM_CACHE_DIR:=$(if $(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(call qstrip,$(CONFIG_NODEJS_NPM_CACHE_DIR)),$(TMP_DIR))

TARGET_CFLAGS+=$(FPIC)
TARGET_CPPFLAGS+=$(FPIC)

define Build/Compile
	cd $(PKG_BUILD_DIR); \
	$(MAKE_VARS) \
	$(MAKE_FLAGS) \
	npm_config_nodedir=$(STAGING_DIR)/opt/ \
	$(if $(CONFIG_NODEJS_NPM_KEEP_CACHE), npm_config_cache=$(NPM_CACHE_DIR)/npm-cache-$(PKG_NPM_NAME),npm_config_cache=$(TMP_DIR)/npm-cache-$(TMPNPM)) \
	npm install --prefer-offline --no-audit --global-style --install-strategy=shallow --no-save --omit=dev --no-package-lock --ignore-scripts
	rm -rf $(TMP_DIR)/npm-cache-$(TMPNPM)
	rm -f $(PKG_BUILD_DIR)/node_modules/.package-lock.json
	find $(PKG_BUILD_DIR)/node_modules -type d -empty -delete || true
endef

define Package/node-mqtt/install
	$(INSTALL_DIR) $(1)/opt/lib/node/$(PKG_NPM_NAME)
	$(CP) $(PKG_BUILD_DIR)/{package.json,*.md} \
		$(1)/opt/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{node_modules,build} \
		$(1)/opt/lib/node/$(PKG_NPM_NAME)/
	$(CP) $(PKG_BUILD_DIR)/{build,dist,help} \
		$(1)/opt/lib/node/$(PKG_NPM_NAME)/
	$(INSTALL_DIR) $(1)/opt/bin
	$(LN) ../lib/node/$(PKG_NPM_NAME)/build/bin/mqtt.js $(1)/opt/bin/mqtt
	$(LN) ../lib/node/$(PKG_NPM_NAME)/build/bin/pub.js $(1)/opt/bin/mqtt_pub
	$(LN) ../lib/node/$(PKG_NPM_NAME)/build/bin/sub.js $(1)/opt/bin/mqtt_sub
	$(INSTALL_DIR) $(1)/opt/lib/node_modules
	$(LN) ../node/$(PKG_NPM_NAME) $(1)/opt/lib/node_modules/$(PKG_NPM_NAME)
	chmod +x $(1)/opt/lib/node/$(PKG_NPM_NAME)/build/bin/mqtt.js
	chmod +x $(1)/opt/lib/node/$(PKG_NPM_NAME)/build/bin/pub.js
	chmod +x $(1)/opt/lib/node/$(PKG_NPM_NAME)/build/bin/sub.js
endef

define Package/node-mqtt/postrm
#!/bin/sh
rm /opt/lib/node_modules/mqtt || true
rm -rf /opt/lib/node/mqtt || true
endef

$(eval $(call BuildPackage,node-mqtt))
