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
export {};
