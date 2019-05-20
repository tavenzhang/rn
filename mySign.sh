#!/bin/sh
rm -rf Payload
rm -rf new.ipa 
rm -rf temp.plist
security cms -D -i embedded.mobileprovision >>temp.plist
unzip rd.ipa 
targetApp=rdMyApp.app
TARGET_APP_PATH=Payload/$targetApp
EXPANDED_CODE_SIGN_IDENTITY="iPhone Distribution: Techno Construction LLC"
TARGET_APP_FRAMEWORKS_PATH="$TARGET_APP_PATH/Frameworks"

# 5.给可执行文件上权限
#添加ipa二进制的执行权限,否则xcode会告知无法运行
#这个操作是要找到第三方app包里的可执行文件名称，因为info.plist的 'Executable file' key对应的是可执行文件的名称
#我们grep 一下,然后取最后一行, 然后以cut 命令分割，取出想要的关键信息。存到APP_BINARY变量里
APP_BINARY=`plutil -convert xml1 -o - $TARGET_APP_PATH/Info.plist|grep -A1 Exec|tail -n1|cut -f2 -d\>|cut -f1 -d\<`

#这个为二进制文件加上可执行权限 +X
chmod +x "$TARGET_APP_PATH/$APP_BINARY"

if [ -d "$TARGET_APP_FRAMEWORKS_PATH" ];
then
#遍历出所有动态库的路径
for FRAMEWORK in "$TARGET_APP_FRAMEWORKS_PATH/"*
do 
#echo "🍺🍺🍺🍺🍺🍺FRAMEWORK : $FRAMEWORK"
	if [ -d "$FRAMEWORK//_CodeSignature" ];
	then
		echo "echo------------==$FRAMEWORK//_CodeSignature"
		rm -rf $FRAMEWORK//_CodeSignature/
		#签名
		#codesign -f -s "iPhone Distribution: Techno Construction LLC" Payload/$targetApp/Frameworks/XCTest.framework/
		codesign -f -s "iPhone Distribution: Techno Construction LLC" $FRAMEWORK
    fi
done
fi
rm -rf $TARGET_APP_PATH/_CodeSignature/
codesign -f -s "iPhone Distribution: Techno Construction LLC" --entitlements entitlements.plist Payload/$targetApp



zip -q -r new.ipa Payload
