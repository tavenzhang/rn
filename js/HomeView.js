/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform, StyleSheet, Text,
    WebView, SafeAreaView, View, Linking, Dimensions,
    Clipboard,
    Alert
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import * as WeChat from 'react-native-wechat';

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
});
import Toast from 'react-native-root-toast';
import CodePush from "react-native-code-push";


export default class HomeView extends Component {

    constructor(props){
        super(props);
        this.state={
            url: "https://www.zxgybj.com/loan/index.html#/main" + "?isApp=1&random=" + Math.random() * 10000
        }
    }

    componentWillMount() {
        // SplashScreen.hide();
        // let keyStr = "ZY6Xf3QYBFyg2OWEJUapMKOPW35Jdc540826-6d54-406c-931b-902fc9ad92af";
        // WeChat.registerApp('wx5efd2682a51751f6');
        // CodePush.sync({
        //     deploymentKey: keyStr,
        //     updateDialog: {
        //         optionalIgnoreButtonLabel: '稍后',
        //         optionalInstallButtonLabel: '自动更新',
        //         optionalUpdateMessage: '网站升级，请尽快点击自动更新升级体验吧!',
        //         title: '更新提示'
        //     },
        //     installMode: CodePush.InstallMode.IMMEDIATE
        // })
        // setTimeout(()=>{
        //     this.onMsgHandle({action: "appLink", data: "https://www.hao123.com/"})
        // },3000)
    }

    componentDidMount() {
        //  Toast.show(this.state.url);
        setTimeout(()=>{
            SplashScreen.hide();
        },2000)

    }


    render() {
        const {width, height, scale} = Dimensions.get('window');
        return (

            <View style={styles.container}>
                <WebView ref="myWebView" onMessage={this.onMessage}
                         style={{width: width, height: height}}
                         source={{uri: this.state.url}}
                         onLoadEnd={this.onLoadEnd}

                />
            </View>

        );
    }

    onLoadEnd =(ret)=> {
        SplashScreen.hide();
    }

    onMessage = (event) => {

        let message = JSON.parse(event.nativeEvent.data);
        this.onMsgHandle(message);
    }

    onMsgHandle = (message) => {
        // TW_Log("onMessage===========>>" + this.constructor.name + "\n", message);
        if (message && message.action) {
            //this.onEvaleJS(message);
            console.log("event.nativeEvent---", message)
            switch (message.action) {
                case "shareToTimeline":
                    // Clipboard.setString(message.data);
                    //  this.linkingApp('weixin://', '微信');
                    this.onCheckWeiXin(() => {
                        WeChat.shareToTimeline(message.data).then(() => {
                                this.onEvaleJS({action: "shareToTimeline", data: "success"})
                            }
                        ).catch(err=>{
                            this.onEvaleJS({action: "shareToTimeline", err: err})
                            //Toast.show('shareToTimeline 错误：message='+err.message);
                        })
                    })
                    break
                case "shareToSession":
                    this.onCheckWeiXin(() => {
                        // Alert.alert("shareToSession",message.data);
                        //Toast.show("shareToSession---start");
                        WeChat.shareToSession(message.data).then(()=>{
                            this.onEvaleJS({action:"shareToSession",data:"success"})
                        }).catch(err=>{
                            this.onEvaleJS({action: "shareToSession", err: err})
                            // Toast.show('shareToSession 错误：message='+err.message);
                        })
                    })
                    break;
                case "pay":
                    this.onCheckWeiXin(() => {
                        WeChat.pay(message.data).then((ret) => {
                            this.onEvaleJS({action: "pay", data: ret});
                        }).catch(err=>{
                            // Toast.show('pay 错误：message='+err.message);
                            this.onEvaleJS({action: "pay", err: err})
                        })
                    })
                    break;
                case "sendAuthRequest":
                    this.onCheckWeiXin(() => {
                        let scope = 'snsapi_userinfo';
                        let state = 'wechat_rd';
                        WeChat.sendAuthRequest(scope,state)
                            .then(this.onAuth)
                            .catch(err => {
                                //Toast.show('登录授权发生错误：message='+err.message);
                                this.onEvaleJS({action: "sendAuthRequest", err: err})
                            })

                    })
                    break;
                case "httpLink":
                    this.linkingApp(message.data,"");
                    break;
                case "appLink":
                    this.props.navigation.navigate('subWeb',{url:message.data});
                    break;
                default:
                    if(WeChat[`${message.action}`]){
                        this.onCheckWeiXin(()=>{
                            WeChat[`${message.action}`](message.data);
                        })
                    }
            }

        }
    }

    onAuth=(responseCode)=>{
        this.onEvaleJS({action: "sendAuthRequest", data: responseCode})
    }

    onCheckWeiXin = (callBack) => {
        WeChat.isWXAppInstalled()
            .then((isInstalled) => {
                console.log("event.nativeEvent-onCheckWeiXin--isInstalled==" + isInstalled);
                if (isInstalled) {

                    if (callBack) {
                        callBack();
                    }
                } else {
                    Toast.show('没有安装微信软件，请您安装微信之后再试');
                }
            });
    }


    linkingApp = (url, payType) => {

        Linking.openURL(url).catch(err => {
            Toast.show('请您先安装' + payType + '应用！');
        })
    }

    onEvaleJS = (data) => {
        let dataStr = JSON.stringify(data);
        dataStr = dataStr ? dataStr : "";
        console.log("event.nativeEvent- this.refs.myWebView--" + dataStr, data);
        this.refs.myWebView.postMessage(dataStr, "*");
        //this.refs.myWebView.evaluateJavaScript(`receivedMessageFromRN(${dataStr})`);
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
