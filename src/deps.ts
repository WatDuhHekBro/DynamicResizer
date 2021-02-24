const React = require("react");
window.React = React;
(window as any).Component = React.Component;
window.ReactDOM = require("react-dom");
window.browser = require("webextension-polyfill-ts").browser;
import {Component as ReactComponent} from "react";
import {Browser} from "webextension-polyfill-ts";

declare global {
	var React: any;
	class Component<P = {}, S = {}, SS = any> extends ReactComponent<P, S, SS> {}
	var browser: Browser;
}
