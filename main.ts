//% weight=100 color=#DC22E1 block="MINTspark Inventor V2" blockId="MINTspark Inventor V2" icon="\uf0e7"
//% subcategories='["Motor / Servo", "Robot Tank Drive", "Sensor / Input", "Light / Display", "IOT"]'
//% groups='["Motor Functions", "Servo Functions", "Information", "Setup", "Movement", "Movement MPU6050", "Sensor", "Input", "Light", "Display"]'
namespace ms_nezhaV2 {
    /*
     * PlanetX Sensors
     */

    //% weight=110
    //% subcategory="Sensor / Input"
    //% group="Sensor"
    //% block="Soil moisture sensor %Rjpin value(0~100)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% color=#ffcc66
    export function soilHumidity(Rjpin: PlanetX_Basic.AnalogRJPin): number {
        return PlanetX_Basic.soilHumidity(Rjpin);
    }

    //% weight=105
    //% subcategory="Sensor / Input"
    //% group="Input"
    //% block="Trimpot %Rjpin analog value"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% color=#ffcc66
    export function trimpot(Rjpin: PlanetX_Display.AnalogRJPin): number {
        return PlanetX_Basic.trimpot(Rjpin);
    }

    //% weight=100
    //% subcategory="Sensor / Input"
    //% group="Input"
    //% block="Crash Sensor %Rjpin is pressed"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% color=#EA5532 
    export function Crash(Rjpin: PlanetX_Display.DigitalRJPin): boolean {
        return PlanetX_Basic.Crash(Rjpin);
    }

    const crashSensorEventId = 54119;
    //% weight=95
    //% subcategory="Sensor / Input"
    //% group="Input"
    //% block="Crash Sensor %Rjpin pressed"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% color=#EA5532 
    export function onCrashSensorPressed(Rjpin: PlanetX_Display.DigitalRJPin, handler: () => void) {
        control.onEvent(crashSensorEventId, 0, handler);
        control.inBackground(() => {
            let lastState = PlanetX_Basic.Crash(Rjpin);
            while (true) {
                let isPressed = PlanetX_Basic.Crash(Rjpin);

                if (isPressed && !lastState) {

                    control.raiseEvent(crashSensorEventId, 0);
                }
                lastState = isPressed;
                basic.pause(200);
            }
        })
    }

    let lastUltrasoundSensorReading = 50;

    //% weight=80
    //% block="Ultrasonic sensor %Rjpin distance %distance_unit"
    //% subcategory="Sensor / Input"
    //% group="Sensor"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% distance_unit.fieldEditor="gridpicker"
    //% distance_unit.fieldOptions.columns=2
    //% color=#EA5532
    export function ultrasoundSensor(Rjpin: PlanetX_Basic.DigitalRJPin, distance_unit: PlanetX_Basic.Distance_Unit_List): number {
        let distance = PlanetX_Basic.ultrasoundSensor(Rjpin, distance_unit);

        if (distance <= 0)
        {
            distance = lastUltrasoundSensorReading;
        }

        lastUltrasoundSensorReading = distance;
        return lastUltrasoundSensorReading;
    }

    const ultrasonicSensorEventId = 54121;
    //% weight=78
    //% subcategory="Sensor / Input"
    //% group="Sensor"
    //% block="Ultrasonic Sensor %Rjpin triggered distance %triggerDistance %distanceUnit"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% triggerDistance.defl=10
    //% color=#EA5532
    export function onUltrasonicSensorTriggered(Rjpin: PlanetX_Display.DigitalRJPin, triggerDistance: number, distanceUnit: PlanetX_Basic.Distance_Unit_List, handler: () => void) {
        control.onEvent(ultrasonicSensorEventId, 0, handler);
        control.inBackground(() => {
            let lastState = false;
            while (true) {
                let distance = PlanetX_Basic.ultrasoundSensor(Rjpin, distanceUnit);
                let detected = distance > 0 && distance <= triggerDistance;

                if (detected && !lastState) {
                    control.raiseEvent(ultrasonicSensorEventId, 0);
                }

                lastState = detected;
                basic.pause(200);
            }
        })
    }
    
    //% weight=75
    //% subcategory="Sensor / Input"
    //% group="Sensor"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% color=#EA5532
    //% block="Line-tracking sensor %Rjpin is %state"
    export function trackingSensor(Rjpin: PlanetX_Basic.DigitalRJPin, state: PlanetX_Basic.TrackingStateType): boolean {
        return PlanetX_Basic.trackingSensor(Rjpin, state);
    }

    //% weight=55
    //% subcategory="Sensor / Input"
    //% group="Sensor"
    //% block="Color sensor IIC port detects %color"
    //% color=#00B1ED
    //% color.fieldEditor="gridpicker" color.fieldOptions.columns=3
    export function checkColor(color: PlanetX_Basic.ColorList): boolean {
        return PlanetX_Basic.checkColor(color);
    }

    //% weight=50
    //% subcategory="Sensor / Input"
    //% group="Sensor"
    //% block="Color sensor IIC port color HUE(0~360)"
    //% color=#00B1ED
    //%export function readColor(): number {
    //%    return PlanetX_Basic.readColor();
    //%}

    const colorSensorEventId = 54120;
    //% weight=45
    //% subcategory="Sensor / Input"
    //% group="Sensor"
    //% block="Color sensor detects %color"
    //% color=#00B1ED
    //% color.fieldEditor="gridpicker" color.fieldOptions.columns=3
    export function onColorSensorDetectsColor(color: PlanetX_Basic.ColorList, handler: () => void) {
        control.onEvent(colorSensorEventId, 0, handler);
        control.inBackground(() => {
            let lastIsMatch = PlanetX_Basic.checkColor(color);
            while (true) {
                let isMatch = PlanetX_Basic.checkColor(color);

                if (isMatch && !lastIsMatch) {
                    control.raiseEvent(colorSensorEventId, 0);
                }
                lastIsMatch = isMatch;
                basic.pause(200);
            }
        })
    }

    //% weight=40
    //% subcategory="Sensor / Input"
    //% group="Sensor"
    //% block="UV sensor %Rjpin level(0~15)"
    //% Rjpin.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2
    //% color=#ffcc66
    export function UVLevel(Rjpin: PlanetX_Basic.AnalogRJPin): number {
        return PlanetX_Basic.UVLevel(Rjpin);
    }

    //% weight=35
    //% subcategory="Sensor / Input"
    //% group="Sensor"
    //% block="DHT11 sensor %Rjpin %dht11state value"
    //% Rjpin.fieldEditor="gridpicker" dht11state.fieldEditor="gridpicker"
    //% Rjpin.fieldOptions.columns=2 dht11state.fieldOptions.columns=1
    //% color=#EA5532
    export function dht11Sensor(Rjpin: PlanetX_Basic.DigitalRJPin, dht11state: PlanetX_Basic.DHT11_state): number {
        return PlanetX_Basic.dht11Sensor(Rjpin, dht11state);
    }
    
    /*
     * PlanetX Output
     */

    //% subcategory="Light / Display"
    //% group="Light"
    //% block="LED %Rjpin toggle to $ledstate || brightness %brightness \\%"
    //% Rjpin.fieldEditor="gridpicker" Rjpin.fieldOptions.columns=2
    //% brightness.min=0 brightness.max=100
    //% ledstate.shadow="toggleOnOff"
    //% color=#EA5532 
    //% expandableArgumentMode="toggle"
    export function ledBrightness(Rjpin: PlanetX_Display.DigitalRJPin, ledstate: boolean, brightness: number = 100): void {
        PlanetX_Display.ledBrightness(Rjpin, ledstate, brightness);
    }

    //% subcategory="Light / Display"
    //% group="Display"
    //% line.min=1 line.max=8 line.defl=1
    //% text.defl="Hello!"
    //% block="Display: Show text %text on line %line"
    //% color=#00B1ED
    export function oledShowText(text: string, line: number) {
        PlanetX_Display.showUserText(line, text);
    }

    //% subcategory="Light / Display"
    //% group="Display"
    //% line.min=1 line.max=8 line.defl=1 
    //% n.defl=1234
    //% block="Display: Show number %n on line %line"
    //% color=#00B1ED
    export function oledShowNumber(n: number, line: number) {
        PlanetX_Display.showUserNumber(line, n);
    }

    //% subcategory="Light / Display"
    //% group="Display"
    //% block="clear display" color=#00B1ED
    export function oledClear() {
        PlanetX_Display.oledClear();
    }

    // Tank Drive

    //% subcategory="Robot Tank Drive"
    //% group="Line Sensor"
    //% speed.min=1 speed.max=100 speed.defl=30
    //% block="Follow line with speed %speed sensor %Rjpin"
    //% color=#00B1ED
    export function tankDriveFollowLine(speed: number, Rjpin: PlanetX_Basic.DigitalRJPin) {
        robotTankModeMovementChange = false;
        ms_nezhaV2.runMotor(tankMotorLeft, speed);
        ms_nezhaV2.runMotor(tankMotorRight, speed);
        while (true) {
            if (ms_nezhaV2.trackingSensor(Rjpin, PlanetX_Basic.TrackingStateType.Tracking_State_0)) {
                ms_nezhaV2.runMotor(tankMotorLeft, speed);
                ms_nezhaV2.runMotor(tankMotorRight, speed);
            } else if (ms_nezhaV2.trackingSensor(Rjpin, PlanetX_Basic.TrackingStateType.Tracking_State_2)) {
                ms_nezhaV2.runMotor(tankMotorLeft, speed);
                ms_nezhaV2.runMotor(tankMotorRight, 0);
            } else if (ms_nezhaV2.trackingSensor(Rjpin, PlanetX_Basic.TrackingStateType.Tracking_State_1)) {
                ms_nezhaV2.runMotor(tankMotorLeft, 0);
                ms_nezhaV2.runMotor(tankMotorRight, speed);
            } else if (robotTankModeMovementChange) {
                break;
            }
            basic.pause(100)
        }
    }

    // IOT  
    /**
    * Initialize wifi module
    */
    //% subcategory="IOT"
    //% group="Setup"
    //% block="Set wifi module %Rjpin Baud rate %baudrate"
    //% color=#EA5532
    //% weight=100
    export function initWIFI(Rjpin: PlanetX_IOT.DigitalRJPin, baudrate: BaudRate) : void {
        PlanetX_IOT.initWIFI(Rjpin, baudrate);
    }

    /**
    * connect to Wifi router
    */
    //% block="Connect Wifi SSID = %ssid|KEY = %pw"
    //% ssid.defl=your_ssid
    //% pw.defl=your_pw
    //% subcategory="IOT"
    //% group="Setup"
    //% color=#EA5532
    //% weight=95
    export function connectWifi(ssid: string, pw: string) : void {
        PlanetX_IOT.connectWifi(ssid, pw);
    }
    /**
    * Check if ESP8266 successfully connected to Wifi
    */
    //% block="Wifi connected %State"
    //% color=#EA5532
    //% subcategory="IOT"
    //% group="Setup"
    //% color=#EA5532
    //% weight=90
    export function wifiState(state: boolean): boolean{
        return PlanetX_IOT.wifiState(state);
    }
}