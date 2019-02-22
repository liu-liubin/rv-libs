interface IAnyObject {
    [propName: string]: any;
}
interface IgetQuery {
    (key?: string, str?: string): IAnyObject;
}
export declare let getQuery: IgetQuery;
export declare let deepAssgin: (obj1: IAnyObject, obj2: IAnyObject) => IAnyObject;
interface formatStr {
    (str: string, args: string | IAnyObject): string;
}
export declare let formatTemplate: formatStr;
interface getDevice {
    (key?: string): any;
}
export declare let getDevice: getDevice;
export declare let dropDown: any;
export declare function axios(def: any): void;
import "./styles/dialog.scss";
export declare function tips(text?: string, time?: number): void;
export declare function loading(): void;
export declare function content(str: any): void;
export {};
