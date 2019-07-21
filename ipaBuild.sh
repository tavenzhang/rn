#!/bin/sh
scriptPath=$(cd `dirname $0`; pwd)
#工程根目录 需要替换成自己本机的工程根目录
workRoot=${scriptPath}
#ios工程目录
iosRoot=${workRoot}/ios
#scriptPath=$(cd `dirname $0`; pwd)
androidRoot=${workRoot}/android
#工程名
targetName="rdMyAPP"
#时间
buildTime=`date "+%Y%m%d"`
ipaName=rd.ipa

#产品输出目录
#outPutDir=${scriptPath}/out

   cd ${iosRoot}

   buildPath=build/build
   payloadPath=build/temp/Payload
   appFileFullPath=${buildPath}/Build/Products/Release-iphoneos/${targetName}.app

   rm -rf ${buildPath}
   mkdir -p ${buildPath} ${payloadPath} ${buildPath}

   xcodebuild  -scheme ${targetName}  -sdk iphoneos -derivedDataPath  ${buildPath}  -project ${iosRoot}/rdMyAPP.xcodeproj  -configuration Release  CODE_SIGN_IDENTITY="" CODE_SIGNING_REQUIRED=NO -UseModernBuildSystem=NO
   if [ $? -eq 0 ];then
      echo ${app} '编译成功'
   else
     echo '编译失败'  
     exit -1;
   fi
   cp -r ${appFileFullPath} ${payloadPath}
    # 打包并生成 .ipa 文件
    cd build/temp
    zip -q -r ${ipaName} Payload

  if [ $? -eq 0 ];then	
      echo '打包签名成功'
  else
      echo "打包失败 签名错误" 
      exit -1;
  fi
  rm -rf ${workRoot}/shell/source.ipa
  cp -rf  ${ipaName}  ${workRoot}/shell/source.ipa

echo "ipa包在 目录下,上传 deploy成功！"




