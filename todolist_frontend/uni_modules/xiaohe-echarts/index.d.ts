import * as Echarts from "echarts/core";
import { ECElementEvent, ElementEvent } from "echarts/core";
import * as vue0 from "vue";
import { ComponentPublicInstance, ComputedRef, InjectionKey, MaybeRefOrGetter, Reactive, Ref, StyleValue } from "vue";

//#region src/shared-core.d.ts
//#region src/types/helpers.d.ts
type OptionalValue<T> = T | undefined;
type NullableValue<T> = T | null;
type ExtractValue<T> = T[keyof T];
//#endregion
//#region src/types/vue.d.ts
interface AllowedComponentProps {
  class?: any;
  style?: StyleValue;
}
type Injection<T> = MaybeRefOrGetter<NullableValue<T>>;
//#endregion
//#region src/types/echarts.d.ts
type InitType = typeof Echarts["init"];
type InitParameters = Parameters<InitType>;
type ChartTheme = NonNullable<InitParameters[1]>;
type ChartThemeInjection = Injection<ChartTheme>;
type InitOptions = NonNullable<InitParameters[2]>;
type InitOptionsInjection = Injection<InitOptions>;
type UpdateOptions = Echarts.SetOptionOpts;
type UpdateOptionsInjection = Injection<UpdateOptions>;
type EChartsType = ReturnType<InitType>;
type ZRenderType = ReturnType<EChartsType["getZr"]>;
type ZRenderHandler = ZRenderType["handler"];
type SetOptionType = EChartsType["setOption"];
type ChartOption = Parameters<SetOptionType>[0];
type ChartOptionInjection = Injection<ChartOption>;
interface LoadingOptions {
  text?: string;
  textColor?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontStyle?: string;
  fontFamily?: string;
  maskColor?: string;
  showSpinner?: boolean;
  color?: string;
  spinnerRadius?: number;
  lineWidth?: number;
  zlevel?: number;
}
type LoadingOptionsInjection = Injection<LoadingOptions>;
//#endregion
//#region src/composables/useEcharts.d.ts
type CoreEcharts = typeof Echarts;
declare const ECHARTS_KEY: InjectionKey<CoreEcharts>;
declare function provideEcharts(echarts: CoreEcharts): void;
declare function useEcharts(): CoreEcharts;
//#endregion
//#region src/composables/useAutoresize.d.ts
type AutoResize = boolean | {
  throttle?: number;
  onResize?: () => void;
};
declare function useAutoresize(chart: Ref<NullableValue<EChartsType>>, {
  echarts,
  autoresize,
  root
}: {
  echarts: CoreEcharts;
  autoresize: MaybeRefOrGetter<AutoResize>;
  root: Ref<NullableValue<ComponentPublicInstance>>;
}): void;
//#endregion
//#region src/composables/useEchartsInitOptions.d.ts
declare const INIT_OPTIONS_KEY: InjectionKey<InitOptionsInjection>;
declare function provideEchartsInitOptions(value: InitOptionsInjection): void;
declare function useEchartsInitOptions(value: MaybeRefOrGetter<OptionalValue<InitOptions>>): {
  injectInitOptions: ComputedRef<NullableValue<InitOptions>>;
  innerInitOptions: ComputedRef<InitOptions>;
};
//#endregion
//#region src/composables/useVueThis.d.ts
type VueThis = ComponentPublicInstance;
declare function useVueThis(): VueThis;
//#endregion
//#region src/composables/useEchartsTouch.d.ts
interface CanvasRect {
  top: number;
  left: number;
  width: number;
  height: number;
}
interface NormalizedTouch {
  x: number;
  y: number;
  wheelDelta: number;
}
interface GetTouchFuc {
  (event: TouchEvent, touches: Touch[]): NormalizedTouch;
  (event: MouseEvent): NormalizedTouch;
  (event: TouchEvent | MouseEvent, touches?: Touch[]): NormalizedTouch;
}
declare function useEchartsTouch({
  vueThis,
  supportHover,
  isPc,
  canvasId,
  chart,
  canvasRect,
  getTouch
}: {
  vueThis: VueThis;
  supportHover: MaybeRefOrGetter<boolean>;
  isPc: boolean;
  canvasId: string;
  chart: Ref<NullableValue<EChartsType>>;
  canvasRect: Reactive<CanvasRect>;
  getTouch: GetTouchFuc;
}): {
  onStart: (event: TouchEvent) => void;
  onMove: (event: TouchEvent) => void;
  onEnd: (event: TouchEvent) => void;
  cleanup: () => void;
};
//#endregion
//#region src/composables/useEchartsMouseWheel.d.ts
declare function useEchartsMouseWheel({
  isPc,
  chart,
  getTouch
}: {
  isPc: boolean;
  chart: Ref<NullableValue<EChartsType>>;
  getTouch: GetTouchFuc;
}): void;
//#endregion
//#region src/composables/useEchartsOption.d.ts
declare const OPTION_KEY = "UniEcharts.option";
declare function getEchartsOptionKey(key?: string): string;
declare function provideEchartsOption(value: ChartOptionInjection): void;
declare function provideEchartsOption(key: string, value: ChartOptionInjection): void;
declare function useEchartsOption(key: OptionalValue<string>, value: MaybeRefOrGetter<OptionalValue<ChartOption>>): {
  injectOption: ComputedRef<NullableValue<ChartOption>>;
  innerOption: ComputedRef<NullableValue<ChartOption>>;
};
//#endregion
//#region src/composables/useEchartsTheme.d.ts
declare const THEME_KEY: InjectionKey<ChartThemeInjection>;
declare function provideEchartsTheme(value: ChartThemeInjection): void;
declare function useEchartsTheme(value: MaybeRefOrGetter<OptionalValue<ChartTheme>>): {
  injectTheme: ComputedRef<NullableValue<ChartTheme>>;
  innerTheme: ComputedRef<ChartTheme>;
};
//#endregion
//#region src/composables/useEchartsUpdateOptions.d.ts
declare const UPDATE_OPTIONS_KEY: InjectionKey<UpdateOptionsInjection>;
declare function provideEchartsUpdateOptions(value: UpdateOptionsInjection): void;
declare function useEchartsUpdateOptions(value: MaybeRefOrGetter<OptionalValue<UpdateOptions>>): {
  injectUpdateOptions: ComputedRef<NullableValue<UpdateOptions>>;
  innerUpdateOptions: ComputedRef<UpdateOptions>;
};
//#endregion
//#region src/composables/useLoading.d.ts
declare const LOADING_OPTIONS_KEY: InjectionKey<LoadingOptionsInjection>;
declare function provideEchartsLoadingOptions(value: LoadingOptionsInjection): void;
declare function useLoading(chart: Ref<NullableValue<EChartsType>>, {
  loading,
  loadingOptions
}: {
  loading: MaybeRefOrGetter<boolean>;
  loadingOptions: MaybeRefOrGetter<OptionalValue<LoadingOptions>>;
}): void;
//#endregion
//#region src/composables/usePageVisible.d.ts
declare function usePageVisible(): {
  visible: vue0.ShallowRef<boolean>;
};
//#endregion
//#region src/composables/usePublicApi.d.ts
declare const ECHARTS_APIS: readonly ["getWidth", "getHeight", "getDom", "getOption", "dispatchAction", "convertToPixel", "convertFromPixel", "containPixel", "getDataURL", "getConnectedDataURL", "appendData", "clear", "isDisposed", "dispose"];
type EChartsApi = (typeof ECHARTS_APIS)[number];
type PublicApi = Pick<EChartsType, EChartsApi>;
declare function usePublicApi(chart: Ref<NullableValue<EChartsType>>): PublicApi;
//#endregion
//#region src/composables/useUid.d.ts
declare function useUid(): number;
//#endregion
//#region src/utils/canvas.d.ts
type CanvasNode = UniApp.NodeCallbackResult["node"];
type CanvasContext = UniApp.CanvasContext;
declare class UniCanvas {
  tagName: "canvas";
  attrs: Record<string, any>;
  canvasId: string;
  context: CanvasContext;
  canvasNode: NullableValue<CanvasNode>;
  private _emitter;
  constructor(canvasId: string, context: CanvasContext, canvasNode: NullableValue<CanvasNode>);
  private _setupContext;
  get width(): number;
  set width(value: number);
  get height(): number;
  set height(value: number);
  getContext(type: "2d"): OptionalValue<CanvasContext>;
  setAttribute(key: string, value: any): void;
  getAttribute(key: string): any;
  addEventListener(type: string, listener: (event: Event) => void): void;
  removeEventListener(type: string, listener: (event: Event) => void): void;
  dispatchEvent(type: string | Event, event?: Event): boolean;
  attachEvent(): void;
  detachEvent(): void;
  requestAnimationFrame(callback: () => void): number;
  cancelAnimationFrame(id: number): void;
  toTempFilePath(options?: Omit<UniApp.CanvasToTempFilePathOptions, "canvasId" | "canvas">): Promise<UniApp.CanvasToTempFilePathRes>;
  static parseFontSize(font: OptionalValue<string>): number;
  static normalizeColor(context: CanvasContext, color: string): string;
  static normalizeColor(context: CanvasContext, color: object): object;
  static dispatch(handler: ZRenderHandler, event: Parameters<ZRenderHandler["dispatch"]>[0], touch: Parameters<ZRenderHandler["dispatch"]>[1]): void;
}
declare class UniImage {
  tagName: "img";
  width: number;
  height: number;
  onload?: (res: UniApp.GetImageInfoSuccessData) => void;
  onerror?: (err: any) => void;
  private _src;
  constructor();
  get src(): NullableValue<string>;
  set src(value: string);
}
declare function setupEchartsCanvas(echarts: CoreEcharts, {
  canvas,
  node
}: {
  canvas: UniCanvas;
  node: NullableValue<CanvasNode>;
}): void;
//#endregion
//#region src/utils/device.d.ts
declare function getIsPc(): boolean;
//#endregion
//#region src/utils/env.d.ts
type BuiltInPlatform = "app" | "app-harmony" | "app-plus" | "h5" | "web" | "mp-360" | "mp-alipay" | "mp-baidu" | "mp-harmony" | "mp-jd" | "mp-kuaishou" | "mp-lark" | "mp-qq" | "mp-toutiao" | "mp-weixin" | "mp-xhs" | "quickapp-webview" | "quickapp-webview-huawei" | "quickapp-webview-union";
type AppPlatform = "android" | "ios" | "harmony" | undefined;
declare const platform: BuiltInPlatform;
declare const appPlatform: AppPlatform;
/** App */
declare const isApp: boolean;
/** Web */
declare const isWeb: boolean;
/** 小程序 */
declare const isMp: boolean;
/** 快应用 */
declare const isQuickapp: boolean;
/** App Android */
declare const isAppAndroid: boolean;
/** App iOS */
declare const isAppIos: boolean;
/** App HarmonyOS Next */
declare const isAppHarmony: boolean;
/** 360 小程序 */
declare const isMp360: boolean;
/** 支付宝小程序 */
declare const isMpAlipay: boolean;
/** 百度小程序 */
declare const isMpBaidu: boolean;
/** 鸿蒙元服务 */
declare const isMpHarmony: boolean;
/** 京东小程序 */
declare const isMpJd: boolean;
/** 快手小程序 */
declare const isMpKuaishou: boolean;
/** 飞书小程序 */
declare const isMpLark: boolean;
/** QQ 小程序 */
declare const isMpQq: boolean;
/** 头条小程序 */
declare const isMpToutiao: boolean;
/** 微信小程序 */
declare const isMpWeixin: boolean;
/** 小红书小程序 */
declare const isMpXhs: boolean;
/** 华为快应用 */
declare const isQuickappHuawei: boolean;
/** 快应用联盟 */
declare const isQuickappUnion: boolean;
//#endregion
//#region src/utils/helpers.d.ts
declare function isEmpty(value: unknown): boolean;
declare function defaultTo<T = any>(value: unknown, ...defaultValues: unknown[]): T;
declare function sleep(timeout?: number): Promise<void>;
declare function upperFirst(value: string): string;
declare function lowerFirst(value: string): string;
//#endregion
//#region src/utils/mitt.d.ts
type EventType = string | symbol;
type Handler<T = unknown> = (event: T) => void;
type WildcardHandler<T = Record<string, unknown>> = (topic: keyof T, event: T[keyof T]) => void;
type EventHandlerList<T = unknown> = Array<Handler<T>>;
type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>;
type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<keyof Events | "*", EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>>;
interface Emitter<Events extends Record<EventType, unknown>> {
  events: EventHandlerMap<Events>;
  on<Topic extends keyof Events>(topic: Topic, handler: Handler<Events[Topic]>): void;
  on(topic: "*", handler: WildcardHandler<Events>): void;
  off<Topic extends keyof Events>(topic: Topic, handler?: Handler<Events[Topic]>): void;
  off(topic: "*", handler: WildcardHandler<Events>): void;
  emit<Topic extends keyof Events>(topic: Topic, event: Events[Topic]): void;
  emit<Topic extends keyof Events>(topic: undefined extends Events[Topic] ? Topic : never): void;
}
declare function mitt<Events extends Record<EventType, unknown>>(events?: EventHandlerMap<Events>): Emitter<Events>;
//#endregion
//#region src/utils/uni.d.ts
declare function getDeviceInfo(): UniApp.GetDeviceInfoResult | UniApp.GetSystemInfoResult;
declare function getWindowInfo(): UniApp.GetWindowInfoResult | UniApp.GetSystemInfoResult;
declare function getAppBaseInfo(): UniApp.GetAppBaseInfoResult | UniApp.GetSystemInfoResult;
declare function getVersion(): string;
declare function compareVersion(v1: string, v2: string): 0 | 1 | -1;
declare function canIUseCanvas2d(): boolean;
declare function querySelect(component: VueThis, selector: string, fields: UniApp.NodeField): Promise<UniApp.NodeInfo>;
//#endregion
//#endregion
//#region src/components/uni-echarts/types.d.ts
interface UniEchartsProps {
  /**
   * Custom root el class.
   */
  customClass?: any;
  /**
   * Custom root el style.
   */
  customStyle?: StyleValue;
  /**
   * Whether the chart is visible.
   */
  visible?: boolean;
  /**
   * Same as the option of echarts.
   */
  option?: ChartOption;
  /**
   * Option inject key.
   */
  optionKey?: string;
  /**
   * Theme to be applied.
   */
  theme?: ChartTheme;
  /**
   * Optional chart init configurations.
   */
  initOptions?: InitOptions;
  /**
   * Options for updating chart option.
   */
  updateOptions?: UpdateOptions;
  /**
   * Group name to be used in chart connection.
   */
  group?: string;
  /**
   * For performance critical scenarios (having a large dataset) we'd better bypass Vue's reactivity system for `option` prop.
   */
  manualUpdate?: boolean;
  /**
   * Whether the chart should be resized automatically whenever its root is resized.
   */
  autoresize?: AutoResize;
  /**
   * Whether the chart is in loading state.
   */
  loading?: boolean;
  /**
   * Configuration item of loading animation.
   */
  loadingOptions?: LoadingOptions;
  /**
   * Canvas type.
   */
  canvasType?: "2d" | "legacy";
  /**
   * Prevent screen scroll when touching the canvas.
   */
  disableScroll?: boolean;
  /**
   * Support mouse hover behavior in PC.
   */
  supportHover?: boolean;
  /**
   * Init delay time(ms).
   */
  initDelay?: number;
}
type MouseEventName = "click" | "dblclick" | "mouseout" | "mouseover" | "mouseup" | "mousedown" | "mousemove" | "contextmenu" | "globalout";
type ElementEventName = MouseEventName | "mousewheel" | "drag" | "dragstart" | "dragend" | "dragenter" | "dragleave" | "dragover" | "drop";
type ZRenderEventName = `zr:${ElementEventName}`;
type OtherEventName = "highlight" | "downplay" | "selectchanged" | "legendselectchanged" | "legendselected" | "legendunselected" | "legendselectall" | "legendinverseselect" | "legendscroll" | "datazoom" | "datarangeselected" | "graphroam" | "georoam" | "treeroam" | "timelinechanged" | "timelineplaychanged" | "restore" | "dataviewchanged" | "magictypechanged" | "geoselectchanged" | "geoselected" | "geounselected" | "axisareaselected" | "brush" | "brushEnd" | "brushselected" | "globalcursortaken" | "showtip" | "hidetip";
type UniEventName = "touchstart" | "touchmove" | "touchcancel" | "touchend" | "tap" | "longpress" | "longtap" | "transitionend" | "animationstart" | "animationiteration" | "animationend" | "touchforcechange";
type NativeEventName = `native:${ElementEventName}` | `native:${UniEventName}`;
type MouseEmits = { [key in MouseEventName]: (params: ECElementEvent) => void };
type ZRenderEmits = { [key in ZRenderEventName]: (params: ElementEvent) => void };
type OtherEmits = { [key in OtherEventName]: (params: any) => void };
type NativeEmits = { [key in NativeEventName]: (params: any) => void };
type UniEchartsEmits = MouseEmits & ZRenderEmits & OtherEmits & NativeEmits & {
  rendered: (params: {
    elapsedTime: number;
  }) => void;
  finished: () => void;
  inited: () => void;
};
interface UniEchartsInst extends PublicApi, Pick<EChartsType, "setOption" | "resize"> {
  root: NullableValue<HTMLElement>;
  canvasId: string;
  chart: NullableValue<EChartsType>;
  toTempFilePath: (options?: Omit<UniApp.CanvasToTempFilePathOptions, "canvasId" | "canvas">) => Promise<UniApp.CanvasToTempFilePathRes>;
}
//#endregion
export { AllowedComponentProps, AppPlatform, AutoResize, BuiltInPlatform, CanvasContext, CanvasNode, CanvasRect, ChartOption, ChartOptionInjection, ChartTheme, ChartThemeInjection, CoreEcharts, ECHARTS_KEY, EChartsType, Emitter, EventHandlerList, EventHandlerMap, EventType, ExtractValue, GetTouchFuc, Handler, INIT_OPTIONS_KEY, InitOptions, InitOptionsInjection, InitParameters, Injection, LOADING_OPTIONS_KEY, LoadingOptions, LoadingOptionsInjection, NormalizedTouch, NullableValue, OPTION_KEY, OptionalValue, PublicApi, THEME_KEY, UPDATE_OPTIONS_KEY, UniCanvas, UniEchartsEmits, UniEchartsInst, UniEchartsProps, UniImage, UpdateOptions, UpdateOptionsInjection, VueThis, WildCardEventHandlerList, WildcardHandler, ZRenderHandler, ZRenderType, appPlatform, canIUseCanvas2d, compareVersion, defaultTo, getAppBaseInfo, getDeviceInfo, getEchartsOptionKey, getIsPc, getVersion, getWindowInfo, isApp, isAppAndroid, isAppHarmony, isAppIos, isEmpty, isMp, isMp360, isMpAlipay, isMpBaidu, isMpHarmony, isMpJd, isMpKuaishou, isMpLark, isMpQq, isMpToutiao, isMpWeixin, isMpXhs, isQuickapp, isQuickappHuawei, isQuickappUnion, isWeb, lowerFirst, mitt, platform, provideEcharts, provideEchartsInitOptions, provideEchartsLoadingOptions, provideEchartsOption, provideEchartsTheme, provideEchartsUpdateOptions, querySelect, setupEchartsCanvas, sleep, upperFirst, useAutoresize, useEcharts, useEchartsInitOptions, useEchartsMouseWheel, useEchartsOption, useEchartsTheme, useEchartsTouch, useEchartsUpdateOptions, useLoading, usePageVisible, usePublicApi, useUid, useVueThis };