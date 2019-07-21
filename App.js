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

import CodePush from "react-native-code-push";
import RoutStack from "./js/rout";

export default class App extends Component {

    constructor(props){
        super(props);

    }

    componentWillMount() {
        //SplashScreen.hide();
        let keyStr = "R_KS7IuRftBJPcG3nDgLVLTuqDmfdc540826-6d54-406c-931b-902fc9ad92af";
        WeChat.registerApp('wx5efd2682a51751f6');
        CodePush.sync({
            deploymentKey: keyStr,
            updateDialog: {
                optionalIgnoreButtonLabel: '稍后',
                optionalInstallButtonLabel: '自动更新',
                optionalUpdateMessage: '网站升级，请尽快点击自动更新升级体验吧!',
                title: '更新提示'
            },
            installMode: CodePush.InstallMode.IMMEDIATE
        })
    }


    render() {
        const {width, height, scale} = Dimensions.get('window');
        return (<RoutStack/>);
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
