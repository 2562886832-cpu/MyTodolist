import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, provide, shallowRef, toValue, watch, watchEffect } from "vue";
import { onPageHide, onPageShow } from "@dcloudio/uni-app";

//#region src/composables/useAutoresize.ts
function useAutoresize(chart, { echarts, autoresize, root }) {
	watch([
		chart,
		autoresize,
		root
	], (values, _, onCleanup) => {
		const _chart = values[0];
		const _autoresize = values[1];
		const _root = values[2];
		let observer = null;
		if (_chart != null && _root != null && _autoresize) {
			const { offsetWidth, offsetHeight } = _root.$el;
			const { throttle: wait = 100, onResize } = _autoresize === true ? {} : _autoresize;
			let triggered = false;
			const callback = () => {
				_chart.resize({
					width: _root.$el.offsetWidth,
					height: _root.$el.offsetHeight
				});
				if (onResize != null) onResize();
			};
			const resizeCallback = wait ? echarts.throttle(callback, wait) : callback;
			observer = new ResizeObserver(() => {
				if (!triggered) {
					triggered = true;
					if (_root.$el.offsetWidth === offsetWidth && _root.$el.offsetHeight === offsetHeight) return;
				}
				if (_root.$el.offsetWidth === 0 || _root.$el.offsetHeight === 0) return;
				resizeCallback();
			});
			observer.observe(_root.$el);
		}
		onCleanup(() => {
			if (observer == null) return;
			observer.disconnect();
			observer = null;
		});
	});
}

//#endregion
//#region src/composables/useEcharts.ts
const ECHARTS_KEY = Symbol("UniEcharts.echarts");
function provideEcharts(echarts) {
	provide(ECHARTS_KEY, echarts);
}
function useEcharts() {
	return inject(ECHARTS_KEY);
}

//#endregion
//#region src/utils/helpers.ts
function isEmpty(value) {
	if (value == null) return true;
	if (typeof value === "string" || Array.isArray(value)) return value.length === 0;
	if (typeof value === "object") return Object.keys(value).length === 0;
	return false;
}
function defaultTo(value, ...defaultValues) {
	if (defaultValues.length === 0) return value;
	if (value == null || value !== value) return defaultTo(defaultValues[0], ...defaultValues.slice(1));
	return value;
}
function sleep(timeout) {
	return new Promise((resolve) => {
		setTimeout(resolve, timeout);
	});
}
function upperFirst(value) {
	return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
function lowerFirst(value) {
	return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

//#endregion
//#region src/utils/mitt.ts
function mitt(events) {
	const _events = defaultTo(events, /* @__PURE__ */ new Map());
	return {
		events: _events,
		on(topic, handler) {
			const handlers = _events.get(topic);
			if (handlers) handlers.push(handler);
			else _events.set(topic, [handler]);
		},
		off(topic, handler) {
			const handlers = _events.get(topic);
			if (handlers) if (handler) handlers.splice(handlers.indexOf(handler) >>> 0, 1);
			else _events.set(topic, []);
		},
		emit(topic, event) {
			const handlers = _events.get(topic);
			if (handlers) for (const handler of handlers.slice()) handler(event);
			const hdlrs = _events.get("*");
			if (hdlrs) for (const handler of hdlrs.slice()) handler(topic, event);
		}
	};
}

//#endregion
//#region src/utils/env.ts
const platform = process.env.UNI_PLATFORM;
const appPlatform = (function() {
	let plat = void 0;
	// #ifdef APP-ANDROID
	plat = "android";
	// #endif
	// #ifdef APP-IOS
	plat = "ios";
	// #endif
	// #ifdef APP-HARMONY
	plat = "harmony";
	// #endif
	return plat;
})();
/** App */
const isApp = platform === "app";
/** Web */
const isWeb = platform === "web" || platform === "h5";
/** 小程序 */
const isMp = /^mp-/i.test(platform);
/** 快应用 */
const isQuickapp = /^quickapp-webview/i.test(platform);
/** App Android */
const isAppAndroid = appPlatform === "android";
/** App iOS */
const isAppIos = appPlatform === "ios";
/** App HarmonyOS Next */
const isAppHarmony = appPlatform === "harmony";
/** 360 小程序 */
const isMp360 = platform === "mp-360";
/** 支付宝小程序 */
const isMpAlipay = platform === "mp-alipay";
/** 百度小程序 */
const isMpBaidu = platform === "mp-baidu";
/** 鸿蒙元服务 */
const isMpHarmony = platform === "mp-harmony";
/** 京东小程序 */
const isMpJd = platform === "mp-jd";
/** 快手小程序 */
const isMpKuaishou = platform === "mp-kuaishou";
/** 飞书小程序 */
const isMpLark = platform === "mp-lark";
/** QQ 小程序 */
const isMpQq = platform === "mp-qq";
/** 头条小程序 */
const isMpToutiao = platform === "mp-toutiao";
/** 微信小程序 */
const isMpWeixin = platform === "mp-weixin";
/** 小红书小程序 */
const isMpXhs = platform === "mp-xhs";
/** 华为快应用 */
const isQuickappHuawei = platform === "quickapp-webview-huawei";
/** 快应用联盟 */
const isQuickappUnion = platform === "quickapp-webview-union";

//#endregion
//#region src/utils/uni.ts
function getDeviceInfo() {
	if (uni.canIUse("getDeviceInfo") || uni.getDeviceInfo) return uni.getDeviceInfo();
	else return uni.getSystemInfoSync();
}
function getWindowInfo() {
	if (uni.canIUse("getWindowInfo") || uni.getWindowInfo) return uni.getWindowInfo();
	else return uni.getSystemInfoSync();
}
function getAppBaseInfo() {
	if (uni.canIUse("getAppBaseInfo") || uni.getAppBaseInfo) return uni.getAppBaseInfo();
	else return uni.getSystemInfoSync();
}
function getVersion() {
	if (isMpAlipay) return my.SDKVersion;
	return getAppBaseInfo().SDKVersion;
}
function compareVersion(v1, v2) {
	const s1 = v1.split(".");
	const s2 = v2.split(".");
	for (let i = 0; i < Math.max(s1.length, s2.length); i += 1) {
		const num1 = Number.parseInt(defaultTo(s1[i], "0"));
		const num2 = Number.parseInt(defaultTo(s2[i], "0"));
		if (num1 > num2) return 1;
		else if (num1 < num2) return -1;
	}
	return 0;
}
function gte(version) {
	return compareVersion(getVersion(), version) >= 0;
}
function canIUseCanvas2d() {
	if (isMpWeixin) {
		if (getDeviceInfo().platform === "mac") return false;
		return gte("2.9.0");
	}
	if (isMpAlipay) return gte("2.7.0");
	if (isMpToutiao) return gte("1.78.0");
	return false;
}
function querySelect(component, selector, fields) {
	return new Promise((resolve, reject) => {
		uni.createSelectorQuery().in(component).select(selector).fields(fields, () => {}).exec(([node]) => {
			if (node) resolve(node);
			else reject();
		});
	});
}

//#endregion
//#region src/utils/canvas.ts
const SHORT_HEX_REGEX = /#([0-9a-f])([0-9a-f])([0-9a-f])\b/gi;
var UniCanvas = class UniCanvas {
	constructor(canvasId, context, canvasNode) {
		this.tagName = "canvas";
		this.attrs = {};
		this.canvasId = canvasId;
		this.context = context;
		this.canvasNode = canvasNode;
		if (canvasNode == null) this._setupContext(context);
		this._emitter = mitt();
	}
	_setupContext(context) {
		const styles = [
			"fillStyle",
			"fontSize",
			"globalAlpha",
			"lineCap",
			"lineDash",
			"lineJoin",
			"lineWidth",
			"miterLimit",
			"strokeStyle",
			"textAlign",
			"textBaseline",
			"opacity",
			"shadowOffsetX",
			"shadowOffsetY",
			"shadowBlur",
			"shadowColor",
			"font"
		];
		const shadow = {
			offsetX: 0,
			offsetY: 0,
			blur: 0,
			color: "#000000"
		};
		for (const key of styles) Object.defineProperty(context, key, { set(value) {
			if (key === "opacity") {
				context.setGlobalAlpha(value);
				return;
			}
			if (key === "font") {
				const fontSize = UniCanvas.parseFontSize(value);
				if (fontSize) context.setFontSize(fontSize);
				return;
			}
			if (key.indexOf("shadow") === 0) {
				if (key !== "shadowColor") shadow[lowerFirst(key.slice(6))] = value;
				else {
					shadow.color = UniCanvas.normalizeColor(context, value);
					context.setShadow(shadow.offsetX, shadow.offsetY, shadow.blur, shadow.color);
				}
				return;
			}
			if (key === "fillStyle" || key === "strokeStyle") value = UniCanvas.normalizeColor(context, value);
			context[`set${upperFirst(key)}`](value);
		} });
		const _drawImage = context.drawImage.bind(context);
		context.drawImage = (...args) => {
			_drawImage(args[0].src, ...args.slice(1));
		};
		if (context.strokeText == null) context.strokeText = (...args) => {
			context.fillText(...args);
		};
		if (context.createRadialGradient == null) context.createRadialGradient = (...args) => {
			return context.createCircularGradient(...args.slice(-3));
		};
		if (context.measureText == null || getDeviceInfo().osName === "harmonyos") {
			const strlen = (str) => {
				let len = 0;
				for (let i = 0; i < str.length; i += 1) {
					const unicode = str.charCodeAt(i);
					if (unicode > 0 && unicode < 128) len += 1;
					else len += 2;
				}
				return len;
			};
			context.measureText = (text, font) => {
				const fontSize = defaultTo(context.state && context.state.fontSize, UniCanvas.parseFontSize(font) || 12) / 2;
				const factor = fontSize >= 16 ? 1.3 : 1;
				return { width: strlen(text) * fontSize * factor };
			};
		}
	}
	get width() {
		if (this.canvasNode == null) return this.getAttribute("width");
		return this.canvasNode.width;
	}
	set width(value) {
		if (this.canvasNode == null) {
			this.setAttribute("width", value);
			return;
		}
		this.canvasNode.width = value;
	}
	get height() {
		if (this.canvasNode == null) return this.getAttribute("height");
		return this.canvasNode.height;
	}
	set height(value) {
		if (this.canvasNode == null) {
			this.setAttribute("height", value);
			return;
		}
		this.canvasNode.height = value;
	}
	getContext(type) {
		if (type === "2d") return this.context;
	}
	setAttribute(key, value) {
		this.attrs[key] = value;
	}
	getAttribute(key) {
		return this.attrs[key];
	}
	addEventListener(type, listener) {
		this._emitter.on(type, listener);
	}
	removeEventListener(type, listener) {
		this._emitter.off(type, listener);
	}
	dispatchEvent(type, event) {
		if (typeof type === "object") this._emitter.emit(type.type, type);
		else this._emitter.emit(type, event);
		return true;
	}
	attachEvent() {}
	detachEvent() {}
	requestAnimationFrame(callback) {
		if (this.canvasNode != null && typeof this.canvasNode.requestAnimationFrame === "function") return this.canvasNode.requestAnimationFrame(callback);
		if (typeof requestAnimationFrame === "function") return requestAnimationFrame(callback);
		return setTimeout(callback, 1e3 / 60);
	}
	cancelAnimationFrame(id) {
		if (this.canvasNode != null && typeof this.canvasNode.cancelAnimationFrame === "function") {
			this.canvasNode.cancelAnimationFrame(id);
			return;
		}
		if (typeof cancelAnimationFrame === "function") {
			cancelAnimationFrame(id);
			return;
		}
		clearTimeout(id);
	}
	toTempFilePath(options = {}) {
		const opts = {};
		if (this.canvasNode != null) opts.canvas = this.canvasNode;
		else opts.canvasId = this.canvasId;
		return uni.canvasToTempFilePath({
			...opts,
			...options
		});
	}
	static parseFontSize(font) {
		if (!font) return 0;
		const match = font.match(/([\d.]+)px/);
		if (match == null) return 0;
		return Number.parseFloat(match[1]);
	}
	static normalizeColor(context, color) {
		// #ifdef MP-TOUTIAO
		if (typeof color === "string") {
			SHORT_HEX_REGEX.lastIndex = 0;
			if (SHORT_HEX_REGEX.test(color)) return color.replace(SHORT_HEX_REGEX, "#$1$1$2$2$3$3");
		}
		// #endif
		return color;
	}
	static dispatch(handler, event, touch) {
		handler.dispatch(event, {
			zrX: touch.x,
			zrY: touch.y,
			zrDelta: touch.wheelDelta,
			preventDefault: () => {},
			stopImmediatePropagation: () => {},
			stopPropagation: () => {}
		});
	}
};
var UniImage = class {
	constructor() {
		this.tagName = "img";
		this._src = null;
		this.width = 0;
		this.height = 0;
	}
	get src() {
		return this._src;
	}
	set src(value) {
		uni.getImageInfo({
			src: value,
			success: (res) => {
				this._src = res.path;
				this.width = res.width;
				this.height = res.height;
				if (this.onload) this.onload(res);
			},
			fail: (err) => {
				if (this.onerror) this.onerror(err);
			}
		});
	}
};
function setupEchartsCanvas(echarts, { canvas, node }) {
	echarts.registerPreprocessor((option) => {
		if (option == null) return;
		if (option.series != null) {
			if (Array.isArray(option.series)) {
				if (!isEmpty(option.series)) for (const item of option.series) item.progressive = 0;
			} else if (typeof option.series === "object") option.series.progressive = 0;
		}
	});
	echarts.setPlatformAPI({
		createCanvas() {
			return canvas;
		},
		loadImage(src, onload, onerror) {
			if (node != null && node.createImage) {
				const image$1 = node.createImage();
				image$1.onload = onload;
				image$1.onerror = onerror;
				image$1.src = src;
				return image$1;
			}
			const image = new UniImage();
			image.onload = onload;
			image.onerror = onerror;
			image.src = src;
			return image;
		}
	});
}

//#endregion
//#region src/utils/device.ts
function getIsPc() {
	// #ifdef WEB
	if (!("ontouchstart" in window)) return true;
	// #endif
	if (isMpWeixin || isMpToutiao || isMpAlipay) return /windows/i.test(getDeviceInfo().platform);
	return false;
}

//#endregion
//#region src/composables/useEchartsInitOptions.ts
const INIT_OPTIONS_KEY = Symbol("UniEcharts.initOptions");
function provideEchartsInitOptions(value) {
	provide(INIT_OPTIONS_KEY, value);
}
function useEchartsInitOptions(value) {
	const injectInitOptions = inject(INIT_OPTIONS_KEY, null);
	const unwrapInjectInitOptions = computed(() => {
		return toValue(injectInitOptions);
	});
	return {
		injectInitOptions: unwrapInjectInitOptions,
		innerInitOptions: computed(() => {
			return defaultTo(toValue(value), unwrapInjectInitOptions.value, {});
		})
	};
}

//#endregion
//#region src/composables/useEchartsMouseWheel.ts
function useEchartsMouseWheel({ isPc, chart, getTouch }) {
	function mouseWheelHandler(event) {
		if (chart.value == null) return;
		const { handler } = chart.value.getZr();
		UniCanvas.dispatch(handler, "mousewheel", getTouch(event));
	}
	onMounted(() => {
		if (isPc) document.addEventListener("wheel", mouseWheelHandler);
	});
	onBeforeUnmount(() => {
		if (isPc) document.removeEventListener("wheel", mouseWheelHandler);
	});
}

//#endregion
//#region src/composables/useEchartsOption.ts
const OPTION_KEY = "UniEcharts.option";
function getEchartsOptionKey(key) {
	if (isEmpty(key)) return OPTION_KEY;
	return `${OPTION_KEY}_${key}`;
}
function provideEchartsOption(keyOrValue, value) {
	if (typeof keyOrValue === "string") {
		provide(getEchartsOptionKey(keyOrValue), value);
		return;
	}
	provide(getEchartsOptionKey(), keyOrValue);
}
function useEchartsOption(key, value) {
	const injectOption = inject(getEchartsOptionKey(key), null);
	const unwrapInjectOption = computed(() => {
		return toValue(injectOption);
	});
	return {
		injectOption: unwrapInjectOption,
		innerOption: computed(() => {
			return defaultTo(toValue(value), unwrapInjectOption.value);
		})
	};
}

//#endregion
//#region src/composables/useEchartsTheme.ts
const THEME_KEY = Symbol("UniEcharts.theme");
function provideEchartsTheme(value) {
	provide(THEME_KEY, value);
}
function useEchartsTheme(value) {
	const injectTheme = inject(THEME_KEY, null);
	const unwrapInjectTheme = computed(() => {
		return toValue(injectTheme);
	});
	return {
		injectTheme: unwrapInjectTheme,
		innerTheme: computed(() => {
			return defaultTo(toValue(value), unwrapInjectTheme.value, {});
		})
	};
}

//#endregion
//#region src/composables/useEchartsTouch.ts
function useEchartsTouch({ vueThis, supportHover, isPc, canvasId, chart, canvasRect, getTouch }) {
	const touching = shallowRef(false);
	const state = {
		x: 0,
		y: 0,
		t: 0
	};
	let timer = 0;
	let ticking = false;
	let rafId = 0;
	let lastMoveEvent = null;
	function destroyTimer() {
		if (timer === 0) return;
		clearTimeout(timer);
		timer = 0;
	}
	function getCanvas() {
		if (chart.value == null) return null;
		return chart.value.getDom();
	}
	function normalizeTouches(touches) {
		if (Array.isArray(touches)) return touches;
		if (typeof touches === "object" && touches != null) return Object.values(touches);
		return touches;
	}
	function transformTouchesEvent(event) {
		for (let i = 0; i < event.touches.length; i += 1) {
			const item = event.touches[i];
			item.offsetX = item.x;
			item.offsetY = item.y;
		}
		return event;
	}
	function onStart(event) {
		touching.value = true;
		state.t = Date.now();
		const next = () => {
			if (chart.value == null) return;
			const touch = getTouch(event, normalizeTouches(event.touches));
			state.x = touch.x;
			state.y = touch.y;
			const { handler } = chart.value.getZr();
			UniCanvas.dispatch(handler, "mousedown", touch);
			UniCanvas.dispatch(handler, "mousemove", touch);
			handler.processGesture(transformTouchesEvent(event), "start");
			destroyTimer();
		};
		querySelect(vueThis, `#${canvasId}`, { rect: true }).then(({ top, left }) => {
			canvasRect.top = top;
			canvasRect.left = left;
		}).finally(() => {
			next();
		});
	}
	function _onMove(event) {
		if (isPc && toValue(supportHover) && !touching.value) touching.value = true;
		if (chart.value == null || !touching.value) return;
		const { handler } = chart.value.getZr();
		UniCanvas.dispatch(handler, "mousemove", getTouch(event, normalizeTouches(event.touches)));
		handler.processGesture(transformTouchesEvent(event), "change");
	}
	function onMove(event) {
		const canvas = getCanvas();
		if (canvas == null) return;
		lastMoveEvent = event;
		if (ticking) return;
		ticking = true;
		rafId = canvas.requestAnimationFrame(() => {
			try {
				if (lastMoveEvent != null) _onMove(lastMoveEvent);
			} finally {
				lastMoveEvent = null;
				ticking = false;
			}
		});
	}
	function onEnd(event) {
		touching.value = false;
		if (chart.value == null) return;
		const touch = getTouch(event, normalizeTouches(event.changedTouches));
		const { handler } = chart.value.getZr();
		UniCanvas.dispatch(handler, "mouseup", touch);
		handler.processGesture(transformTouchesEvent(event), "end");
		if (Math.abs(touch.x - state.x) < 10 && Date.now() - state.t < 200) UniCanvas.dispatch(handler, "click", touch);
		else {
			if (timer > 0) destroyTimer();
			timer = setTimeout(() => {
				UniCanvas.dispatch(handler, "mousemove", {
					x: 999999999,
					y: 999999999
				});
				UniCanvas.dispatch(handler, "mouseup", {
					x: 999999999,
					y: 999999999
				});
			}, 50);
		}
	}
	function cleanup() {
		destroyTimer();
		if (rafId !== 0) {
			const canvas = getCanvas();
			if (canvas != null) canvas.cancelAnimationFrame(rafId);
			rafId = 0;
		}
		lastMoveEvent = null;
		ticking = false;
	}
	return {
		onStart,
		onMove,
		onEnd,
		cleanup
	};
}

//#endregion
//#region src/composables/useEchartsUpdateOptions.ts
const UPDATE_OPTIONS_KEY = Symbol("UniEcharts.updateOptions");
function provideEchartsUpdateOptions(value) {
	provide(UPDATE_OPTIONS_KEY, value);
}
function useEchartsUpdateOptions(value) {
	const injectUpdateOptions = inject(UPDATE_OPTIONS_KEY, null);
	const unwrapInjectUpdateOptions = computed(() => {
		return toValue(injectUpdateOptions);
	});
	return {
		injectUpdateOptions: unwrapInjectUpdateOptions,
		innerUpdateOptions: computed(() => {
			return defaultTo(toValue(value), unwrapInjectUpdateOptions.value, {});
		})
	};
}

//#endregion
//#region src/composables/useLoading.ts
const LOADING_OPTIONS_KEY = Symbol("UniEcharts.loadingOptions");
function provideEchartsLoadingOptions(value) {
	provide(LOADING_OPTIONS_KEY, value);
}
function useLoading(chart, { loading, loadingOptions }) {
	const injectLoadingOptions = inject(LOADING_OPTIONS_KEY, null);
	const unwrapInjectLoadingOptions = computed(() => {
		return toValue(injectLoadingOptions);
	});
	const innerLoadingOptions = computed(() => {
		return {
			...defaultTo(unwrapInjectLoadingOptions.value, {}),
			...defaultTo(toValue(loadingOptions), {})
		};
	});
	watchEffect(() => {
		const instance = chart.value;
		if (instance == null) return;
		if (toValue(loading)) instance.showLoading(innerLoadingOptions.value);
		else instance.hideLoading();
	});
}

//#endregion
//#region src/composables/usePageVisible.ts
function usePageVisible() {
	const visible = shallowRef(true);
	onPageShow(() => {
		visible.value = true;
	});
	onPageHide(() => {
		visible.value = false;
	});
	return { visible };
}

//#endregion
//#region src/composables/usePublicApi.ts
const ECHARTS_APIS = [
	"getWidth",
	"getHeight",
	"getDom",
	"getOption",
	"dispatchAction",
	"convertToPixel",
	"convertFromPixel",
	"containPixel",
	"getDataURL",
	"getConnectedDataURL",
	"appendData",
	"clear",
	"isDisposed",
	"dispose"
];
function usePublicApi(chart) {
	function makePublicMethod(name) {
		return (...args) => {
			if (chart.value == null) throw new Error("ECharts is not initialized yet.");
			return chart.value[name].apply(chart.value, args);
		};
	}
	function makePublicMethods() {
		const methods = Object.create(null);
		for (const name of ECHARTS_APIS) methods[name] = makePublicMethod(name);
		return methods;
	}
	return makePublicMethods();
}

//#endregion
//#region src/composables/useUid.ts
let uid = 0;
function useUid() {
	uid += 1;
	return uid;
}

//#endregion
//#region src/composables/useVueThis.ts
function useVueThis() {
	return getCurrentInstance().proxy;
}

//#endregion
export { ECHARTS_KEY, INIT_OPTIONS_KEY, LOADING_OPTIONS_KEY, OPTION_KEY, THEME_KEY, UPDATE_OPTIONS_KEY, UniCanvas, UniImage, appPlatform, canIUseCanvas2d, compareVersion, defaultTo, getAppBaseInfo, getDeviceInfo, getEchartsOptionKey, getIsPc, getVersion, getWindowInfo, isApp, isAppAndroid, isAppHarmony, isAppIos, isEmpty, isMp, isMp360, isMpAlipay, isMpBaidu, isMpHarmony, isMpJd, isMpKuaishou, isMpLark, isMpQq, isMpToutiao, isMpWeixin, isMpXhs, isQuickapp, isQuickappHuawei, isQuickappUnion, isWeb, lowerFirst, mitt, platform, provideEcharts, provideEchartsInitOptions, provideEchartsLoadingOptions, provideEchartsOption, provideEchartsTheme, provideEchartsUpdateOptions, querySelect, setupEchartsCanvas, sleep, upperFirst, useAutoresize, useEcharts, useEchartsInitOptions, useEchartsMouseWheel, useEchartsOption, useEchartsTheme, useEchartsTouch, useEchartsUpdateOptions, useLoading, usePageVisible, usePublicApi, useUid, useVueThis };