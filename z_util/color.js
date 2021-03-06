/**
 * Efforts will not regret.
 * Create time 2018/8/10
 * @jszh
 */
import {AsyncStorage} from 'react-native';
var bgcolor;
AsyncStorage.getItem("bgColor",function(errs,r){
    if (!errs) {
        bgcolor = JSON.parse(r);
        main = bgcolor;
    }
});

//本地存储颜色
export var main;

//主颜色
// rgb(25,167,255) '#0882ff'
export var theme='#0882ff';

//副颜色
export var blue = '#4990E2';
export var gray = "rgb(240,239,245)";
export var deepGray = "rgb(211,211,211)";
export var wordBlack = "rgb(38,38,38)";
export var wordGray = 'rgb(110,109,113)';
//export var white = 'rgb(250,250,250)';
export var backgroundGray = '#f5f5f7';
export var red = '#FF4F4F';
export var black = '#000000';
export var white = '#ffffff';

export const wholeColor = {
    red: '#FF0000',
    orange: '#FFA500',
    yellow: '#FFFF00',
    green: '#00FF00',
    cyan: '#00FFFF',
    blue: '#0000FF',
    purple: '#800080',
    black: '#000',
    white: '#FFF',
    gray: '#808080',
    drakGray: '#A9A9A9',
    lightGray: '#D3D3D3',
    tomato: '#FF6347',
    PeachPuff: '#FFDAB9',
    clear: 'transparent',  //透明色
};

