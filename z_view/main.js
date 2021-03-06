/**
 * Efforts will not regret.
 * Create time 2018/8/10
 * @jszh
 */

import React,{Component} from 'react';

import ReactNative, {AsyncStorage, BackAndroid, Platform} from 'react-native';
//react native
var {View, StyleSheet, StatusBar,AppState,Clipboard} = ReactNative;

//import SharePopLayer from '../z_model/sharePopLayer'     //分享 QQ好友  QQ空间

import {width, height, widthRatio, heightRatio,isIOS} from '../z_util/device';
import SplashScreen from 'react-native-splash-screen';
var TimerMixin = require('react-timer-mixin');

import {Navigator} from 'react-native-deprecated-custom-components';

//import HotUpdate from '../z_view/hotUpdate';  //下载进度

import {pop, push, setNavigator} from '../z_util/navigator';
//import {setContainerVersion} from '../z_model/version'
import {removeNativeEvent,listen,remove,send} from '../z_util/eventDispatcher';
//import {getContainerVersion,tryUpdate} from '../z_native/version';
//import {checkLogin,userInfo,initUserInfo} from '../z_util/userInfoHelper'

//弹窗部分
import BlackAlert from '../z_model/blackAlert';  // 提示语弹窗 toast
import ModelAlert from '../z_model/modelAlert';  // 多个按钮弹窗
import ImgModalAlter from '../z_model/imgModelAlter'; //图片弹窗
import Loading from '../z_model/loading'; //加载弹窗
import Video from '../z_model/video'; //播放器

//多个按钮弹窗的数据
import {alertData} from "../z_model/modelAlertData";

//主页
import Root from './userComponent';

//登录页
//import Login from "./login";

//获取设备信息
//import DeviceInfo from "react-native-device-info/deviceinfo";


export default class main extends Component {

    static propTypes = {};

    static defaultProps = {};

    constructor(props) {
        super(props);

        this.state = {
            showHotloading:false,
            showLoading:false,
            loadingTitle:null,
            showBlack:false,
            showQR:false,
            shareCallback:null,
            blackTitle:'',
            btntext:[],
            showModelAlertCallback:'',
            allChange:false,
            bg:'',
            bgs:'',

            //播放器
            Video:0,
            indexTF:false,
            url:'',
            paused:false,
        }
    }

    componentWillMount() {
        listen('showHotUpdate',(p)=>{
            this.setState({showHotloading:show})
        })
        listen('loading',(p=>{
            this.setState({showLoading:p.show,loadingTitle:p.title});
        }))
        listen('showSharePop',(p)=>{
            this.setState({shareCallback:p.shareCallback})
        })

        listen('showQRCode',p=>{
            this.setState({showQRCode:p.wxCode});
        })
        //初始化背景 （风格）
        AsyncStorage.getItem("bgColor",function(err,r){
            if (!err) {
                global.colors = JSON.parse(r);
                //alert(global.colors)
                //首次启动存储 默认主题
                if (!global.colors) {
                    AsyncStorage.setItem("bgColor",JSON.stringify("#0882ff"),function(err){
                        if (err) {
                            send('showBlackAlert', {show:true,title:"默认主题设置失败"});
                        }
                    });
                }
            }else{

            }
        });
        // 版本
        // getContainerVersion(()=> {
        //     tryUpdate(() => {
        //
        //     })
        // })
    }

    //获取当前状态
    getCurrentState(appState) {
        if(appState=="inactive"){

        }else if(appState == "background"){

        }
    }


    render() {
        AsyncStorage.getItem("bgColor",function(err,r){
            if (!err) {
                global.colors = JSON.parse(r);
            }
        });
        return (
            <View style = {{width:width ,height:height}}>
                <StatusBar
                    barStyle="light-content"
                />
                {this.renderImgModalAlter()}
                {this.renderMain()}
                {this.renderHotUpdate()}
                {this.renderBlackAlert()}
                {this.renderModelAlert()}
                {this.renderLoading()}
                {this.renderPopLayer()}
                {this.renderVideo()}
            </View>
        )
    }
    // 播放器
    renderVideo(){
        if(this.state.indexTF){
            return(
                <Video indexBtn = {this.state.indexVideo} url = {this.state.url} paused={this.state.paused}/>
            )
        }
    }
    //加载中。。。
    renderLoading(){
        if(this.state.showLoading){
            return(
                <Loading title = {this.state.loadingTitle}/>
            )
        }
    }

    //提示语弹窗
    renderBlackAlert(){
        if(this['state'].showBlack){
            return(
                <BlackAlert  title = {this.state.blackTitle}/>
            )
        }
    }

    //按钮弹窗
    renderModelAlert(){
        if(global.modalVisible){
            return(
                <ModelAlert  btntext = {this.state.btntext} modalVisible={true} showModelAlertCallback={this.state.showModelAlertCallback}/>
            )
        }
    }
    //图片弹窗
    renderImgModalAlter(){
        if(global.alertShow){
            return(
                <ImgModalAlter alertShow={true} />
            )
        }
    }
    renderHotUpdate(){
        if(this.state.showHotloading){
            return(
                <HotUpdate />
            )
        }
    }

    //----****加载Navigator****----
    renderMain(){
        return (
            <Navigator
                style={{flex: 1}}
                ref="navigator"
                //初始化场景
                initialRoute={{name: "root", component: Root, params: {}}}
                //渲染传递
                renderScene={(route, navigator) => {
                    let Component = route.component;
                    return <Component {...route.params} navigator={navigator}/>
                }}>
            </Navigator>
        )
    }

    componentDidMount() {
        //启动页
        if(isIOS){
            AppState.addEventListener('change', this.getCurrentState);
        }else{
            TimerMixin.setTimeout(() => {
                SplashScreen.hide();
            },2000);
        }

        //指定加载场景
        setNavigator(this.refs.navigator);

        //监听播放器 *******控制播放用*******
        listen('startVideo', (param) => {
            if (this.state.indexTF){
                this.setState({indexTF: false});
            }
            setTimeout(() => {
                this.setState({indexTF:param.indexTF,indexVideo: param.index,url:param.url,paused:param.paused});
            }, 10)
        });

        //监听提示语
        listen('showBlackAlert', (param) => {
            if (this.state.showBlack) {
                this.setState({showBlack: false});
            }
            setTimeout(() => {
                this.setState({showBlack: param.show, blackTitle: param.title});
            }, 10)
        });

        //监听
        listen('showModelAlert', (params) => {
            global.modalVisible = true;
            this.setState({btntext: params.btntext, showModelAlertCallback: params.callback});
        })

        //按钮弹窗 data
        global.alertData = alertData;

        //监听
        listen('imgModalAlter', () => {
            global.alertShow = true;
            this.setState({allChange:!this.state.allChange})
            //弹窗复制参数，这里复制固定参数
            Clipboard.setString('copy 参数');
        });

        //初始化背景 （风格）
        AsyncStorage.getItem("bgColor",function(err,r){
            if (!err) {
                global.colors = JSON.parse(r);
            }
        });

        listen('bGcolor',p=>{
            global.colors = p.colors;
            this.setState({bg:p.colors});
            if (p.colors) {
                AsyncStorage.setItem("bgColor",JSON.stringify(p.colors),function(err){
                    if (err) {
                        send('showBlackAlert', {show:true,title:"设置失败"});
                    }
                });
            }
        });

    }

    renderPopLayer(){
        if(this.state.shareCallback){
            return(
                <SharePopLayer shareCallback = {this.state.shareCallback}/>
            )
        }
    }
    componentWillUnmount() {
        //移除监听
        remove('showModelAlert');
        remove('imgModalAlter');
        remove('startVideo');
        remove('showBlackAlert');
        remove("showHotUpdate");
        remove('showQRCode');
        //removeNativeEvent("androidBackSelect");
    }
}

const styles = StyleSheet.create({});
