export interface Action<T> {
  type: string;
  payload?: T;
}

export type ActionType<T> = Action<T>;


export interface AutoSagaArgumentType extends AutoSagaHooks {
  type: string;
  payload: any;
  api: string;
}

export interface AutoActionArgument extends AutoSagaHooks {
  name: string;
  payload?: any;
  query?: object;
  params?: FlatObj;
}
export type strNum = string | number;
export type FlatObj = {[key: string]: strNum, [key: number]: strNum};

export interface AutoSagaHooks {
  onSuccess?: (result: any, payload: any) => void;
  onError?: (error: Error, payload: any) => void;
  getReqHeaders?: (state: any, payload: any) => void;
}
export interface AutoSagaConfig extends AutoSagaHooks {
  path: string;
  method: string;
  name: string;
  mode?: string;
  initialResult: any;
  processResult?: (result: any) => any;
};

export type OptionsType = {
  getReqHeadersDefault?: (state: any) => Object;
  urlParser?: (api: string, params?: FlatObj, query?: Object) => string;
};
