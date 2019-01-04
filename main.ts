/**
* LUMEX LDM 96*8 顯示器的函數
*/

//% weight=0 color=#ff9933 icon="\uf233" block="LDM96*8"
namespace LumexLDM9608 {

    export enum fontSize {
        //% block="5*7"
        smallSize = 0x81,
        //% block="8*16"
        bigSize = 0x83
    }

    export enum filledType {
        //% block="no"
        type1 = 0,
        //% block="yes"
        type2 = 1
    }
    export enum transitionType {
        //% block="upward"
        type1 = 0,
        //% block="downward"
        type2 = 1,
        //% block="leftward"
        type3 = 2,
        //% block="rightward"
        type4 = 3
    }

    export enum colorCode {
        //% block="black"
        color0 = 0,
        //% block="white"
        color111 = 111,
        //% block="red"
        color96 = 96,
        //% block="orange"
        color100 = 100,
        //% block="yellow"
        color108 = 108,
        //% block="green"
        color4 = 4,
        //% block="blue"
        color3 = 3,
        //% block="indigo"
        color66 = 66,
        //% block="purple"
        color99 = 99,
        //% block="dark red"
        color32 = 32,
        //% block="pink"
        color103 = 103,
        //% block="earth yellow"
        color104 = 104,
        //% block="lime"
        color12 = 12
    }

    function convertNumToHexStr(myNum: number, digits: number): string {
        let tempDiv = 0
        let tempMod = 0
        let myStr = ""
        tempDiv = myNum
        while (tempDiv > 0) {
            tempMod = tempDiv % 16
            if (tempMod > 9) {
                myStr = String.fromCharCode(tempMod - 10 + 97) + myStr
            } else {
                myStr = tempMod + myStr
            }
            tempDiv = Math.idiv(tempDiv, 16)
        }
        while (myStr.length != digits) {
            myStr = "0" + myStr
        }
        return myStr
    }

    //% blockId="LDM_setSerial" block="set LDM RX to %pinRX|TX to %pinTX|BaudRate %br"
    //% weight=100 blockGap=2 blockInlineInputs=true
    export function LDM_setSerial(pinRX: SerialPin, pinTX: SerialPin, br: BaudRate): void {
        basic.pause(300)
        serial.redirect(
            pinRX,
            pinTX,
            br
        )
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_getColor" block="color code %myColor"
    //% weight=95 blockGap=2
    export function LDM_getColor(myColor: colorCode): number {
        return myColor
    }

    //% blockId="LDM_clear" block="LDM clear"
    //% weight=90 blockGap=2
    export function LDM_clear(): void {
        serial.writeString("ATd0=()")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_putString" block="LDM put string: %myStr|column: %column|color code(0~111): %color"
    //% weight=85 blockGap=2 blockInlineInputs=true column.min=0 column.max=15 color.min=0 color.max=111
    export function LDM_putString(myStr: string, column: number, color: number): void {
        if (myStr.length > 0) {
            serial.writeString("ATef=(" + color + ")")
            serial.readUntil("E")
            basic.pause(10)
            serial.writeString("AT81=(0," + column + "," + myStr + ")")
            serial.readUntil("E")
            basic.pause(10)
        }
    }

    //% blockId="LDM_setBackColor" block="set LDM background color %backColor"
    //% weight=80 blockGap=2 backColor.min=0 backcolor.max=111 
    export function LDM_setBackColor(backColor: number): void {
        serial.writeString("ATec=(" + backColor + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_display" block="LDM display"
    //% weight=75 blockGap=2
    export function LDM_display(): void {
        serial.writeString("ATd1=()")
        serial.readUntil("E")
        basic.pause(3)
    }


    //% blockId="LDM_on" block="turn LDM on"
    //% weight=70 blockGap=2
    export function LDM_on(): void {
        serial.writeString("ATf1=()")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_off" block="turn LDM off"
    //% weight=65 blockGap=2
    export function LDM_off(): void {
        serial.writeString("ATf0=()")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_setScroll" block="scroll the whole display %transition|shift time(1~200ms) %time"
    //% weight=60 blockGap=2 blockInlineInputs=true time.min=1 time.max=200
    export function LDM_setScroll(transition: transitionType, time: number): void {
        if (time < 1)
            time = 1
        if (time > 200)
            time = 200
        serial.writeString("AT" + convertNumToHexStr(transition + 0xd2, 2) + "=(" + time + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_drawLine" block="draw a line|first point X %x0|first point Y %y0|second point X %x1|second point Y %y1|color code(0~111) %color"
    //% weight=98 blockGap=2 blockInlineInputs=true x0.min=0 x0.max=95 y0.min=0 y0.max=7 x1.min=0 x1.max=95 y1.min=0 y1.max=7 color.min=0 color.max=111 advanced=true
    export function LDM_drawLine(x0: number, y0: number, x1: number, y1: number, color: number): void {
        serial.writeString("AT90=(" + x0 + "," + y0 + "," + x1 + "," + y1 + "," + color + ")")
        serial.readUntil("E")
        basic.pause(3)
    }
    //% blockId="LDM_drawRectangle" block="draw a rectangle|filled %myFilled|up left corner X %x0|up left corner Y %y0|bottom right corner X %x1|bottom right corner Y %y1|color code(0~111) %color"
    //% weight=95 blockGap=2 blockInlineInputs=true x0.min=0 x0.max=95 y0.min=0 y0.max=7 x1.min=0 x1.max=95 y1.min=0 y1.max=7 color.min=0 color.max=111 advanced=true
    export function LDM_drawRectangle(myFilled: filledType, x0: number, y0: number, x1: number, y1: number, color: number): void {
        if (myFilled == 0)
            serial.writeString("AT91=(" + x0 + "," + y0 + "," + x1 + "," + y1 + "," + color + ")")
        else
            serial.writeString("AT92=(" + x0 + "," + y0 + "," + x1 + "," + y1 + "," + color + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_drawSquare" block="draw a square|up left corner X %x0|up left corner Y %y0|width %width|color code(0~111) %color"
    //% weight=85 blockGap=2 blockInlineInputs=true x0.min=0 x0.max=95 y0.min=0 y0.max=7 color.min=0 color.max=111 advanced=true
    export function LDM_drawSquare(x0: number, y0: number, width: number, color: number): void {
        serial.writeString("AT93=(" + x0 + "," + y0 + "," + width + "," + color + ")")
        serial.readUntil("E")
        basic.pause(3)
    }

    //% blockId="LDM_setPixel" block="draw a pixel|X %x0|Y %y0|color code(0~111) %color"
    //% weight=80 blockGap=10 blockInlineInputs=true x0.min=0 x0.max=95 y0.min=0 y0.max=7 color.min=0 color.max=111 advanced=true
    export function LDM_setPixel(x0: number, y0: number, color: number): void {
        serial.writeString("ATef=(" + color + ")")
        serial.readUntil("E")
        basic.pause(3)
        serial.writeString("AT9e=(" + x0 + "," + y0 + ")")
        serial.readUntil("E")
        basic.pause(3)
    }
}   
