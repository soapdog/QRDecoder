
// minifier: path aliases

enyo.path.addPaths({layout: "/Users/soapdog/PhpstormProjects/QRDecoder/enyo/../lib/layout/", onyx: "/Users/soapdog/PhpstormProjects/QRDecoder/enyo/../lib/onyx/", onyx: "/Users/soapdog/PhpstormProjects/QRDecoder/enyo/../lib/onyx/source/", jsqrcode: "/Users/soapdog/PhpstormProjects/QRDecoder/enyo/../lib/jsqrcode/", webapi: "/Users/soapdog/PhpstormProjects/QRDecoder/enyo/../lib/webapi/", webappinstaller: "/Users/soapdog/PhpstormProjects/QRDecoder/enyo/../lib/webappinstaller/", pixastic: "/Users/soapdog/PhpstormProjects/QRDecoder/enyo/../lib/pixastic/"});

// FittableLayout.js

enyo.kind({
name: "enyo.FittableLayout",
kind: "Layout",
calcFitIndex: function() {
for (var e = 0, t = this.container.children, n; n = t[e]; e++) if (n.fit && n.showing) return e;
},
getFitControl: function() {
var e = this.container.children, t = e[this.fitIndex];
return t && t.fit && t.showing || (this.fitIndex = this.calcFitIndex(), t = e[this.fitIndex]), t;
},
getLastControl: function() {
var e = this.container.children, t = e.length - 1, n = e[t];
while ((n = e[t]) && !n.showing) t--;
return n;
},
_reflow: function(e, t, n, r) {
this.container.addRemoveClass("enyo-stretch", !this.container.noStretch);
var i = this.getFitControl();
if (!i) return;
var s = 0, o = 0, u = 0, a, f = this.container.hasNode();
f && (a = enyo.dom.calcPaddingExtents(f), s = f[t] - (a[n] + a[r]));
var l = i.getBounds();
o = l[n] - (a && a[n] || 0);
var c = this.getLastControl();
if (c) {
var h = enyo.dom.getComputedBoxValue(c.hasNode(), "margin", r) || 0;
if (c != i) {
var p = c.getBounds(), d = l[n] + l[e], v = p[n] + p[e] + h;
u = v - d;
} else u = h;
}
var m = s - (o + u);
i.applyStyle(e, m + "px");
},
reflow: function() {
this.orient == "h" ? this._reflow("width", "clientWidth", "left", "right") : this._reflow("height", "clientHeight", "top", "bottom");
}
}), enyo.kind({
name: "enyo.FittableColumnsLayout",
kind: "FittableLayout",
orient: "h",
layoutClass: "enyo-fittable-columns-layout"
}), enyo.kind({
name: "enyo.FittableRowsLayout",
kind: "FittableLayout",
layoutClass: "enyo-fittable-rows-layout",
orient: "v"
});

// FittableRows.js

enyo.kind({
name: "enyo.FittableRows",
layoutKind: "FittableRowsLayout",
noStretch: !1
});

// FittableColumns.js

enyo.kind({
name: "enyo.FittableColumns",
layoutKind: "FittableColumnsLayout",
noStretch: !1
});

// FlyweightRepeater.js

enyo.kind({
name: "enyo.FlyweightRepeater",
published: {
count: 0,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
clientClasses: "",
clientStyle: ""
},
events: {
onSetupItem: ""
},
bottomUp: !1,
components: [ {
kind: "Selection",
onSelect: "selectDeselect",
onDeselect: "selectDeselect"
}, {
name: "client"
} ],
rowOffset: 0,
create: function() {
this.inherited(arguments), this.noSelectChanged(), this.multiSelectChanged(), this.clientClassesChanged(), this.clientStyleChanged();
},
noSelectChanged: function() {
this.noSelect && this.$.selection.clear();
},
multiSelectChanged: function() {
this.$.selection.setMulti(this.multiSelect);
},
clientClassesChanged: function() {
this.$.client.setClasses(this.clientClasses);
},
clientStyleChanged: function() {
this.$.client.setStyle(this.clientStyle);
},
setupItem: function(e) {
this.doSetupItem({
index: e,
selected: this.isSelected(e)
});
},
generateChildHtml: function() {
var e = "";
this.index = null;
for (var t = 0, n = 0; t < this.count; t++) n = this.rowOffset + (this.bottomUp ? this.count - t - 1 : t), this.setupItem(n), this.$.client.setAttribute("data-enyo-index", n), e += this.inherited(arguments), this.$.client.teardownRender();
return e;
},
previewDomEvent: function(e) {
var t = this.index = this.rowForEvent(e);
e.rowIndex = e.index = t, e.flyweight = this;
},
decorateEvent: function(e, t, n) {
var r = t && t.index != null ? t.index : this.index;
t && r != null && (t.index = r, t.flyweight = this), this.inherited(arguments);
},
tap: function(e, t) {
if (this.noSelect) return;
this.toggleSelected ? this.$.selection.toggle(t.index) : this.$.selection.select(t.index);
},
selectDeselect: function(e, t) {
this.renderRow(t.key);
},
getSelection: function() {
return this.$.selection;
},
isSelected: function(e) {
return this.getSelection().isSelected(e);
},
renderRow: function(e) {
var t = this.fetchRowNode(e);
t && (this.setupItem(e), t.innerHTML = this.$.client.generateChildHtml(), this.$.client.teardownChildren());
},
fetchRowNode: function(e) {
if (this.hasNode()) {
var t = this.node.querySelectorAll('[data-enyo-index="' + e + '"]');
return t && t[0];
}
},
rowForEvent: function(e) {
var t = e.target, n = this.hasNode().id;
while (t && t.parentNode && t.id != n) {
var r = t.getAttribute && t.getAttribute("data-enyo-index");
if (r !== null) return Number(r);
t = t.parentNode;
}
return -1;
},
prepareRow: function(e) {
var t = this.fetchRowNode(e);
enyo.FlyweightRepeater.claimNode(this.$.client, t);
},
lockRow: function() {
this.$.client.teardownChildren();
},
performOnRow: function(e, t, n) {
t && (this.prepareRow(e), enyo.call(n || null, t), this.lockRow());
},
statics: {
claimNode: function(e, t) {
var n = t && t.querySelectorAll("#" + e.id);
n = n && n[0], e.generated = Boolean(n || !e.tag), e.node = n, e.node && e.rendered();
for (var r = 0, i = e.children, s; s = i[r]; r++) this.claimNode(s, t);
}
}
});

// List.js

enyo.kind({
name: "enyo.List",
kind: "Scroller",
classes: "enyo-list",
published: {
count: 0,
rowsPerPage: 50,
bottomUp: !1,
noSelect: !1,
multiSelect: !1,
toggleSelected: !1,
fixedHeight: !1
},
events: {
onSetupItem: ""
},
handlers: {
onAnimateFinish: "animateFinish"
},
rowHeight: 0,
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "generator",
kind: "FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
} ]
} ],
create: function() {
this.pageHeights = [], this.inherited(arguments), this.getStrategy().translateOptimized = !0, this.bottomUpChanged(), this.noSelectChanged(), this.multiSelectChanged(), this.toggleSelectedChanged();
},
createStrategy: function() {
this.controlParentName = "strategy", this.inherited(arguments), this.createChrome(this.listTools), this.controlParentName = "client", this.discoverControlParent();
},
rendered: function() {
this.inherited(arguments), this.$.generator.node = this.$.port.hasNode(), this.$.generator.generated = !0, this.reset();
},
resizeHandler: function() {
this.inherited(arguments), this.refresh();
},
bottomUpChanged: function() {
this.$.generator.bottomUp = this.bottomUp, this.$.page0.applyStyle(this.pageBound, null), this.$.page1.applyStyle(this.pageBound, null), this.pageBound = this.bottomUp ? "bottom" : "top", this.hasNode() && this.reset();
},
noSelectChanged: function() {
this.$.generator.setNoSelect(this.noSelect);
},
multiSelectChanged: function() {
this.$.generator.setMultiSelect(this.multiSelect);
},
toggleSelectedChanged: function() {
this.$.generator.setToggleSelected(this.toggleSelected);
},
countChanged: function() {
this.hasNode() && this.updateMetrics();
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.portSize = 0;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
generatePage: function(e, t) {
this.page = e;
var n = this.$.generator.rowOffset = this.rowsPerPage * this.page, r = this.$.generator.count = Math.min(this.count - n, this.rowsPerPage), i = this.$.generator.generateChildHtml();
t.setContent(i);
var s = t.getBounds().height;
!this.rowHeight && s > 0 && (this.rowHeight = Math.floor(s / r), this.updateMetrics());
if (!this.fixedHeight) {
var o = this.getPageHeight(e);
o != s && s > 0 && (this.pageHeights[e] = s, this.portSize += s - o);
}
},
update: function(e) {
var t = !1, n = this.positionToPageInfo(e), r = n.pos + this.scrollerHeight / 2, i = Math.floor(r / Math.max(n.height, this.scrollerHeight) + .5) + n.no, s = i % 2 === 0 ? i : i - 1;
this.p0 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page0), this.positionPage(s, this.$.page0), this.p0 = s, t = !0), s = i % 2 === 0 ? Math.max(1, i - 1) : i, this.p1 != s && this.isPageInRange(s) && (this.generatePage(s, this.$.page1), this.positionPage(s, this.$.page1), this.p1 = s, t = !0), t && !this.fixedHeight && (this.adjustBottomPage(), this.adjustPortSize());
},
updateForPosition: function(e) {
this.update(this.calcPos(e));
},
calcPos: function(e) {
return this.bottomUp ? this.portSize - this.scrollerHeight - e : e;
},
adjustBottomPage: function() {
var e = this.p0 >= this.p1 ? this.$.page0 : this.$.page1;
this.positionPage(e.pageNo, e);
},
adjustPortSize: function() {
this.scrollerHeight = this.getBounds().height;
var e = Math.max(this.scrollerHeight, this.portSize);
this.$.port.applyStyle("height", e + "px");
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e);
t.applyStyle(this.pageBound, n + "px");
},
pageToPosition: function(e) {
var t = 0, n = e;
while (n > 0) n--, t += this.getPageHeight(n);
return t;
},
positionToPageInfo: function(e) {
var t = -1, n = this.calcPos(e), r = this.defaultPageHeight;
while (n >= 0) t++, r = this.getPageHeight(t), n -= r;
return {
no: t,
height: r,
pos: n + r
};
},
isPageInRange: function(e) {
return e == Math.max(0, Math.min(this.pageCount - 1, e));
},
getPageHeight: function(e) {
return this.pageHeights[e] || this.defaultPageHeight;
},
invalidatePages: function() {
this.p0 = this.p1 = null, this.$.page0.setContent(""), this.$.page1.setContent("");
},
invalidateMetrics: function() {
this.pageHeights = [], this.rowHeight = 0, this.updateMetrics();
},
scroll: function(e, t) {
var n = this.inherited(arguments);
return this.update(this.getScrollTop()), n;
},
scrollToBottom: function() {
this.update(this.getScrollBounds().maxTop), this.inherited(arguments);
},
setScrollTop: function(e) {
this.update(e), this.inherited(arguments), this.twiddle();
},
getScrollPosition: function() {
return this.calcPos(this.getScrollTop());
},
setScrollPosition: function(e) {
this.setScrollTop(this.calcPos(e));
},
scrollToRow: function(e) {
var t = Math.floor(e / this.rowsPerPage), n = e % this.rowsPerPage, r = this.pageToPosition(t);
this.updateForPosition(r), r = this.pageToPosition(t), this.setScrollPosition(r);
if (t == this.p0 || t == this.p1) {
var i = this.$.generator.fetchRowNode(e);
if (i) {
var s = i.offsetTop;
this.bottomUp && (s = this.getPageHeight(t) - i.offsetHeight - s);
var o = this.getScrollPosition() + s;
this.setScrollPosition(o);
}
}
},
scrollToStart: function() {
this[this.bottomUp ? "scrollToBottom" : "scrollToTop"]();
},
scrollToEnd: function() {
this[this.bottomUp ? "scrollToTop" : "scrollToBottom"]();
},
refresh: function() {
this.invalidatePages(), this.update(this.getScrollTop()), this.stabilize(), enyo.platform.android === 4 && this.twiddle();
},
reset: function() {
this.getSelection().clear(), this.invalidateMetrics(), this.invalidatePages(), this.stabilize(), this.scrollToStart();
},
getSelection: function() {
return this.$.generator.getSelection();
},
select: function(e, t) {
return this.getSelection().select(e, t);
},
deselect: function(e) {
return this.getSelection().deselect(e);
},
isSelected: function(e) {
return this.$.generator.isSelected(e);
},
renderRow: function(e) {
this.$.generator.renderRow(e);
},
prepareRow: function(e) {
this.$.generator.prepareRow(e);
},
lockRow: function() {
this.$.generator.lockRow();
},
performOnRow: function(e, t, n) {
this.$.generator.performOnRow(e, t, n);
},
animateFinish: function(e) {
return this.twiddle(), !0;
},
twiddle: function() {
var e = this.getStrategy();
enyo.call(e, "twiddle");
}
});

// PulldownList.js

enyo.kind({
name: "enyo.PulldownList",
kind: "List",
touch: !0,
pully: null,
pulldownTools: [ {
name: "pulldown",
classes: "enyo-list-pulldown",
components: [ {
name: "puller",
kind: "Puller"
} ]
} ],
events: {
onPullStart: "",
onPullCancel: "",
onPull: "",
onPullRelease: "",
onPullComplete: ""
},
handlers: {
onScrollStart: "scrollStartHandler",
onScrollStop: "scrollStopHandler",
ondragfinish: "dragfinish"
},
pullingMessage: "Pull down to refresh...",
pulledMessage: "Release to refresh...",
loadingMessage: "Loading...",
pullingIconClass: "enyo-puller-arrow enyo-puller-arrow-down",
pulledIconClass: "enyo-puller-arrow enyo-puller-arrow-up",
loadingIconClass: "",
create: function() {
var e = {
kind: "Puller",
showing: !1,
text: this.loadingMessage,
iconClass: this.loadingIconClass,
onCreate: "setPully"
};
this.listTools.splice(0, 0, e), this.inherited(arguments), this.setPulling();
},
initComponents: function() {
this.createChrome(this.pulldownTools), this.accel = enyo.dom.canAccelerate(), this.translation = this.accel ? "translate3d" : "translate", this.inherited(arguments);
},
setPully: function(e, t) {
this.pully = t.originator;
},
scrollStartHandler: function() {
this.firedPullStart = !1, this.firedPull = !1, this.firedPullCancel = !1;
},
scroll: function(e, t) {
var n = this.inherited(arguments);
this.completingPull && this.pully.setShowing(!1);
var r = this.getStrategy().$.scrollMath, i = r.y;
return r.isInOverScroll() && i > 0 && (enyo.dom.transformValue(this.$.pulldown, this.translation, "0," + i + "px" + (this.accel ? ",0" : "")), this.firedPullStart || (this.firedPullStart = !0, this.pullStart(), this.pullHeight = this.$.pulldown.getBounds().height), i > this.pullHeight && !this.firedPull && (this.firedPull = !0, this.firedPullCancel = !1, this.pull()), this.firedPull && !this.firedPullCancel && i < this.pullHeight && (this.firedPullCancel = !0, this.firedPull = !1, this.pullCancel())), n;
},
scrollStopHandler: function() {
this.completingPull && (this.completingPull = !1, this.doPullComplete());
},
dragfinish: function() {
if (this.firedPull) {
var e = this.getStrategy().$.scrollMath;
e.setScrollY(e.y - this.pullHeight), this.pullRelease();
}
},
completePull: function() {
this.completingPull = !0, this.$.strategy.$.scrollMath.setScrollY(this.pullHeight), this.$.strategy.$.scrollMath.start();
},
pullStart: function() {
this.setPulling(), this.pully.setShowing(!1), this.$.puller.setShowing(!0), this.doPullStart();
},
pull: function() {
this.setPulled(), this.doPull();
},
pullCancel: function() {
this.setPulling(), this.doPullCancel();
},
pullRelease: function() {
this.$.puller.setShowing(!1), this.pully.setShowing(!0), this.doPullRelease();
},
setPulling: function() {
this.$.puller.setText(this.pullingMessage), this.$.puller.setIconClass(this.pullingIconClass);
},
setPulled: function() {
this.$.puller.setText(this.pulledMessage), this.$.puller.setIconClass(this.pulledIconClass);
}
}), enyo.kind({
name: "enyo.Puller",
classes: "enyo-puller",
published: {
text: "",
iconClass: ""
},
events: {
onCreate: ""
},
components: [ {
name: "icon"
}, {
name: "text",
tag: "span",
classes: "enyo-puller-text"
} ],
create: function() {
this.inherited(arguments), this.doCreate(), this.textChanged(), this.iconClassChanged();
},
textChanged: function() {
this.$.text.setContent(this.text);
},
iconClassChanged: function() {
this.$.icon.setClasses(this.iconClass);
}
});

// AroundList.js

enyo.kind({
name: "enyo.AroundList",
kind: "enyo.List",
listTools: [ {
name: "port",
classes: "enyo-list-port enyo-border-box",
components: [ {
name: "aboveClient"
}, {
name: "generator",
kind: "enyo.FlyweightRepeater",
canGenerate: !1,
components: [ {
tag: null,
name: "client"
} ]
}, {
name: "page0",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "page1",
allowHtml: !0,
classes: "enyo-list-page"
}, {
name: "belowClient"
} ]
} ],
aboveComponents: null,
initComponents: function() {
this.inherited(arguments), this.aboveComponents && this.$.aboveClient.createComponents(this.aboveComponents, {
owner: this.owner
}), this.belowComponents && this.$.belowClient.createComponents(this.belowComponents, {
owner: this.owner
});
},
updateMetrics: function() {
this.defaultPageHeight = this.rowsPerPage * (this.rowHeight || 100), this.pageCount = Math.ceil(this.count / this.rowsPerPage), this.aboveHeight = this.$.aboveClient.getBounds().height, this.belowHeight = this.$.belowClient.getBounds().height, this.portSize = this.aboveHeight + this.belowHeight;
for (var e = 0; e < this.pageCount; e++) this.portSize += this.getPageHeight(e);
this.adjustPortSize();
},
positionPage: function(e, t) {
t.pageNo = e;
var n = this.pageToPosition(e), r = this.bottomUp ? this.belowHeight : this.aboveHeight;
n += r, t.applyStyle(this.pageBound, n + "px");
},
scrollToContentStart: function() {
var e = this.bottomUp ? this.belowHeight : this.aboveHeight;
this.setScrollPosition(e);
}
});

// Slideable.js

enyo.kind({
name: "enyo.Slideable",
kind: "Control",
published: {
axis: "h",
value: 0,
unit: "px",
min: 0,
max: 0,
accelerated: "auto",
overMoving: !0,
draggable: !0
},
events: {
onAnimateFinish: "",
onChange: ""
},
preventDragPropagation: !1,
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
} ],
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
kDragScalar: 1,
dragEventProp: "dx",
unitModifier: !1,
canTransform: !1,
create: function() {
this.inherited(arguments), this.acceleratedChanged(), this.transformChanged(), this.axisChanged(), this.valueChanged(), this.addClass("enyo-slideable");
},
initComponents: function() {
this.createComponents(this.tools), this.inherited(arguments);
},
rendered: function() {
this.inherited(arguments), this.canModifyUnit(), this.updateDragScalar();
},
resizeHandler: function() {
this.inherited(arguments), this.updateDragScalar();
},
canModifyUnit: function() {
if (!this.canTransform) {
var e = this.getInitialStyleValue(this.hasNode(), this.boundary);
e.match(/px/i) && this.unit === "%" && (this.unitModifier = this.getBounds()[this.dimension]);
}
},
getInitialStyleValue: function(e, t) {
var n = enyo.dom.getComputedStyle(e);
return n ? n.getPropertyValue(t) : e && e.currentStyle ? e.currentStyle[t] : "0";
},
updateBounds: function(e, t) {
var n = {};
n[this.boundary] = e, this.setBounds(n, this.unit), this.setInlineStyles(e, t);
},
updateDragScalar: function() {
if (this.unit == "%") {
var e = this.getBounds()[this.dimension];
this.kDragScalar = e ? 100 / e : 1, this.canTransform || this.updateBounds(this.value, 100);
}
},
transformChanged: function() {
this.canTransform = enyo.dom.canTransform();
},
acceleratedChanged: function() {
enyo.platform.android > 2 || enyo.dom.accelerate(this, this.accelerated);
},
axisChanged: function() {
var e = this.axis == "h";
this.dragMoveProp = e ? "dx" : "dy", this.shouldDragProp = e ? "horizontal" : "vertical", this.transform = e ? "translateX" : "translateY", this.dimension = e ? "width" : "height", this.boundary = e ? "left" : "top";
},
setInlineStyles: function(e, t) {
var n = {};
this.unitModifier ? (n[this.boundary] = this.percentToPixels(e, this.unitModifier), n[this.dimension] = this.unitModifier, this.setBounds(n)) : (t ? n[this.dimension] = t : n[this.boundary] = e, this.setBounds(n, this.unit));
},
valueChanged: function(e) {
var t = this.value;
this.isOob(t) && !this.isAnimating() && (this.value = this.overMoving ? this.dampValue(t) : this.clampValue(t)), enyo.platform.android > 2 && (this.value ? (e === 0 || e === undefined) && enyo.dom.accelerate(this, this.accelerated) : enyo.dom.accelerate(this, !1)), this.canTransform ? enyo.dom.transformValue(this, this.transform, this.value + this.unit) : this.setInlineStyles(this.value, !1), this.doChange();
},
getAnimator: function() {
return this.$.animator;
},
isAtMin: function() {
return this.value <= this.calcMin();
},
isAtMax: function() {
return this.value >= this.calcMax();
},
calcMin: function() {
return this.min;
},
calcMax: function() {
return this.max;
},
clampValue: function(e) {
var t = this.calcMin(), n = this.calcMax();
return Math.max(t, Math.min(e, n));
},
dampValue: function(e) {
return this.dampBound(this.dampBound(e, this.min, 1), this.max, -1);
},
dampBound: function(e, t, n) {
var r = e;
return r * n < t * n && (r = t + (r - t) / 4), r;
},
percentToPixels: function(e, t) {
return Math.floor(t / 100 * e);
},
pixelsToPercent: function(e) {
var t = this.unitModifier ? this.getBounds()[this.dimension] : this.container.getBounds()[this.dimension];
return e / t * 100;
},
shouldDrag: function(e) {
return this.draggable && e[this.shouldDragProp];
},
isOob: function(e) {
return e > this.calcMax() || e < this.calcMin();
},
dragstart: function(e, t) {
if (this.shouldDrag(t)) return t.preventDefault(), this.$.animator.stop(), t.dragInfo = {}, this.dragging = !0, this.drag0 = this.value, this.dragd0 = 0, this.preventDragPropagation;
},
drag: function(e, t) {
if (this.dragging) {
t.preventDefault();
var n = this.canTransform ? t[this.dragMoveProp] * this.kDragScalar : this.pixelsToPercent(t[this.dragMoveProp]), r = this.drag0 + n, i = n - this.dragd0;
return this.dragd0 = n, i && (t.dragInfo.minimizing = i < 0), this.setValue(r), this.preventDragPropagation;
}
},
dragfinish: function(e, t) {
if (this.dragging) return this.dragging = !1, this.completeDrag(t), t.preventTap(), this.preventDragPropagation;
},
completeDrag: function(e) {
this.value !== this.calcMax() && this.value != this.calcMin() && this.animateToMinMax(e.dragInfo.minimizing);
},
isAnimating: function() {
return this.$.animator.isAnimating();
},
play: function(e, t) {
this.$.animator.play({
startValue: e,
endValue: t,
node: this.hasNode()
});
},
animateTo: function(e) {
this.play(this.value, e);
},
animateToMin: function() {
this.animateTo(this.calcMin());
},
animateToMax: function() {
this.animateTo(this.calcMax());
},
animateToMinMax: function(e) {
e ? this.animateToMin() : this.animateToMax();
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.doAnimateFinish(e), !0;
},
toggleMinMax: function() {
this.animateToMinMax(!this.isAtMin());
}
});

// Arranger.js

enyo.kind({
name: "enyo.Arranger",
kind: "Layout",
layoutClass: "enyo-arranger",
accelerated: "auto",
dragProp: "ddx",
dragDirectionProp: "xDirection",
canDragProp: "horizontal",
incrementalPoints: !1,
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n._arranger = null;
this.inherited(arguments);
},
arrange: function(e, t) {},
size: function() {},
start: function() {
var e = this.container.fromIndex, t = this.container.toIndex, n = this.container.transitionPoints = [ e ];
if (this.incrementalPoints) {
var r = Math.abs(t - e) - 2, i = e;
while (r >= 0) i += t < e ? -1 : 1, n.push(i), r--;
}
n.push(this.container.toIndex);
},
finish: function() {},
calcArrangementDifference: function(e, t, n, r) {},
canDragEvent: function(e) {
return e[this.canDragProp];
},
calcDragDirection: function(e) {
return e[this.dragDirectionProp];
},
calcDrag: function(e) {
return e[this.dragProp];
},
drag: function(e, t, n, r, i) {
var s = this.measureArrangementDelta(-e, t, n, r, i);
return s;
},
measureArrangementDelta: function(e, t, n, r, i) {
var s = this.calcArrangementDifference(t, n, r, i), o = s ? e / Math.abs(s) : 0;
return o *= this.container.fromIndex > this.container.toIndex ? -1 : 1, o;
},
_arrange: function(e) {
this.containerBounds || this.reflow();
var t = this.getOrderedControls(e);
this.arrange(t, e);
},
arrangeControl: function(e, t) {
e._arranger = enyo.mixin(e._arranger || {}, t);
},
flow: function() {
this.c$ = [].concat(this.container.getPanels()), this.controlsIndex = 0;
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) {
enyo.dom.accelerate(n, this.accelerated);
if (enyo.platform.safari) {
var r = n.children;
for (var i = 0, s; s = r[i]; i++) enyo.dom.accelerate(s, this.accelerated);
}
}
},
reflow: function() {
var e = this.container.hasNode();
this.containerBounds = e ? {
width: e.clientWidth,
height: e.clientHeight
} : {}, this.size();
},
flowArrangement: function() {
var e = this.container.arrangement;
if (e) for (var t = 0, n = this.container.getPanels(), r; r = n[t]; t++) this.flowControl(r, e[t]);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.opacity;
n != null && enyo.Arranger.opacifyControl(e, n);
},
getOrderedControls: function(e) {
var t = Math.floor(e), n = t - this.controlsIndex, r = n > 0, i = this.c$ || [];
for (var s = 0; s < Math.abs(n); s++) r ? i.push(i.shift()) : i.unshift(i.pop());
return this.controlsIndex = t, i;
},
statics: {
positionControl: function(e, t, n) {
var r = n || "px";
if (!this.updating) if (enyo.dom.canTransform() && !enyo.platform.android && enyo.platform.ie !== 10) {
var i = t.left, s = t.top;
i = enyo.isString(i) ? i : i && i + r, s = enyo.isString(s) ? s : s && s + r, enyo.dom.transform(e, {
translateX: i || null,
translateY: s || null
});
} else e.setBounds(t, n);
},
opacifyControl: function(e, t) {
var n = t;
n = n > .99 ? 1 : n < .01 ? 0 : n, enyo.platform.ie < 9 ? e.applyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + n * 100 + ")") : e.applyStyle("opacity", n);
}
}
});

// CardArranger.js

enyo.kind({
name: "enyo.CardArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width;
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) s = n === 0 ? 1 : 0, this.arrangeControl(r, {
opacity: s
});
},
start: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.opacifyControl(n, 1), n.showing || n.setShowing(!0);
this.inherited(arguments);
}
});

// CardSlideInArranger.js

enyo.kind({
name: "enyo.CardSlideInArranger",
kind: "CardArranger",
start: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) {
var r = n.showing;
n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && !r && n.resized();
}
var i = this.container.fromIndex;
t = this.container.toIndex, this.container.transitionPoints = [ t + "." + i + ".s", t + "." + i + ".f" ];
},
finish: function() {
this.inherited(arguments);
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
arrange: function(e, t) {
var n = t.split("."), r = n[0], i = n[1], s = n[2] == "s", o = this.containerBounds.width;
for (var u = 0, a = this.container.getPanels(), f, l; f = a[u]; u++) l = o, i == u && (l = s ? 0 : -o), r == u && (l = s ? o : 0), i == u && i == r && (l = 0), this.arrangeControl(f, {
left: l
});
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null
});
this.inherited(arguments);
}
});

// CarouselArranger.js

enyo.kind({
name: "enyo.CarouselArranger",
kind: "Arranger",
size: function() {
var e = this.container.getPanels(), t = this.containerPadding = this.container.hasNode() ? enyo.dom.calcPaddingExtents(this.container.node) : {}, n = this.containerBounds, r, i, s, o, u;
n.height -= t.top + t.bottom, n.width -= t.left + t.right;
var a;
for (r = 0, s = 0; u = e[r]; r++) o = enyo.dom.calcMarginExtents(u.hasNode()), u.width = u.getBounds().width, u.marginWidth = o.right + o.left, s += (u.fit ? 0 : u.width) + u.marginWidth, u.fit && (a = u);
if (a) {
var f = n.width - s;
a.width = f >= 0 ? f : a.width;
}
for (r = 0, i = t.left; u = e[r]; r++) u.setBounds({
top: t.top,
bottom: t.bottom,
width: u.fit ? u.width : null
});
},
arrange: function(e, t) {
this.container.wrap ? this.arrangeWrap(e, t) : this.arrangeNoWrap(e, t);
},
arrangeNoWrap: function(e, t) {
var n, r, i, s, o = this.container.getPanels(), u = this.container.clamp(t), a = this.containerBounds.width;
for (n = u, i = 0; s = o[n]; n++) {
i += s.width + s.marginWidth;
if (i > a) break;
}
var f = a - i, l = 0;
if (f > 0) {
var c = u;
for (n = u - 1, r = 0; s = o[n]; n--) {
r += s.width + s.marginWidth;
if (f - r <= 0) {
l = f - r, u = n;
break;
}
}
}
var h, p;
for (n = 0, p = this.containerPadding.left + l; s = o[n]; n++) h = s.width + s.marginWidth, n < u ? this.arrangeControl(s, {
left: -h
}) : (this.arrangeControl(s, {
left: Math.floor(p)
}), p += h);
},
arrangeWrap: function(e, t) {
for (var n = 0, r = this.containerPadding.left, i, s; s = e[n]; n++) this.arrangeControl(s, {
left: r
}), r += s.width + s.marginWidth;
},
calcArrangementDifference: function(e, t, n, r) {
var i = Math.abs(e % this.c$.length);
return t[i].left - r[i].left;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("top", null), n.applyStyle("bottom", null), n.applyStyle("left", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// CollapsingArranger.js

enyo.kind({
name: "enyo.CollapsingArranger",
kind: "CarouselArranger",
size: function() {
this.clearLastSize(), this.inherited(arguments);
},
clearLastSize: function() {
for (var e = 0, t = this.container.getPanels(), n; n = t[e]; e++) n._fit && e != t.length - 1 && (n.applyStyle("width", null), n._fit = null);
},
arrange: function(e, t) {
var n = this.container.getPanels();
for (var r = 0, i = this.containerPadding.left, s, o; o = n[r]; r++) this.arrangeControl(o, {
left: i
}), r >= t && (i += o.width + o.marginWidth), r == n.length - 1 && t < 0 && this.arrangeControl(o, {
left: i - t
});
},
calcArrangementDifference: function(e, t, n, r) {
var i = this.container.getPanels().length - 1;
return Math.abs(r[i].left - t[i].left);
},
flowControl: function(e, t) {
this.inherited(arguments);
if (this.container.realtimeFit) {
var n = this.container.getPanels(), r = n.length - 1, i = n[r];
e == i && this.fitControl(e, t.left);
}
},
finish: function() {
this.inherited(arguments);
if (!this.container.realtimeFit && this.containerBounds) {
var e = this.container.getPanels(), t = this.container.arrangement, n = e.length - 1, r = e[n];
this.fitControl(r, t[n].left);
}
},
fitControl: function(e, t) {
e._fit = !0, e.applyStyle("width", this.containerBounds.width - t + "px"), e.resized();
}
});

// OtherArrangers.js

enyo.kind({
name: "enyo.LeftRightArranger",
kind: "Arranger",
margin: 40,
axisSize: "width",
offAxisSize: "height",
axisPosition: "left",
constructor: function() {
this.inherited(arguments), this.margin = this.container.margin != null ? this.container.margin : this.margin;
},
size: function() {
var e = this.container.getPanels(), t = this.containerBounds[this.axisSize], n = t - this.margin - this.margin;
for (var r = 0, i, s; s = e[r]; r++) i = {}, i[this.axisSize] = n, i[this.offAxisSize] = "100%", s.setBounds(i);
},
start: function() {
this.inherited(arguments);
var e = this.container.fromIndex, t = this.container.toIndex, n = this.getOrderedControls(t), r = Math.floor(n.length / 2);
for (var i = 0, s; s = n[i]; i++) e > t ? i == n.length - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1) : i == n.length - 1 - r ? s.applyStyle("z-index", 0) : s.applyStyle("z-index", 1);
},
arrange: function(e, t) {
var n, r, i, s;
if (this.container.getPanels().length == 1) {
s = {}, s[this.axisPosition] = this.margin, this.arrangeControl(this.container.getPanels()[0], s);
return;
}
var o = Math.floor(this.container.getPanels().length / 2), u = this.getOrderedControls(Math.floor(t) - o), a = this.containerBounds[this.axisSize] - this.margin - this.margin, f = this.margin - a * o;
for (n = 0; r = u[n]; n++) s = {}, s[this.axisPosition] = f, this.arrangeControl(r, s), f += a;
},
calcArrangementDifference: function(e, t, n, r) {
if (this.container.getPanels().length == 1) return 0;
var i = Math.abs(e % this.c$.length);
return t[i][this.axisPosition] - r[i][this.axisPosition];
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), enyo.Arranger.opacifyControl(n, 1), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.TopBottomArranger",
kind: "LeftRightArranger",
dragProp: "ddy",
dragDirectionProp: "yDirection",
canDragProp: "vertical",
axisSize: "height",
offAxisSize: "width",
axisPosition: "top"
}), enyo.kind({
name: "enyo.SpiralArranger",
kind: "Arranger",
incrementalPoints: !0,
inc: 20,
size: function() {
var e = this.container.getPanels(), t = this.containerBounds, n = this.controlWidth = t.width / 3, r = this.controlHeight = t.height / 3;
for (var i = 0, s; s = e[i]; i++) s.setBounds({
width: n,
height: r
});
},
arrange: function(e, t) {
var n = this.inc;
for (var r = 0, i = e.length, s; s = e[r]; r++) {
var o = Math.cos(r / i * 2 * Math.PI) * r * n + this.controlWidth, u = Math.sin(r / i * 2 * Math.PI) * r * n + this.controlHeight;
this.arrangeControl(s, {
left: o,
top: u
});
}
},
start: function() {
this.inherited(arguments);
var e = this.getOrderedControls(this.container.toIndex);
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", e.length - t);
},
calcArrangementDifference: function(e, t, n, r) {
return this.controlWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) n.applyStyle("z-index", null), enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
}), enyo.kind({
name: "enyo.GridArranger",
kind: "Arranger",
incrementalPoints: !0,
colWidth: 100,
colHeight: 100,
size: function() {
var e = this.container.getPanels(), t = this.colWidth, n = this.colHeight;
for (var r = 0, i; i = e[r]; r++) i.setBounds({
width: t,
height: n
});
},
arrange: function(e, t) {
var n = this.colWidth, r = this.colHeight, i = Math.max(1, Math.floor(this.containerBounds.width / n)), s;
for (var o = 0, u = 0; u < e.length; o++) for (var a = 0; a < i && (s = e[u]); a++, u++) this.arrangeControl(s, {
left: n * a,
top: r * o
});
},
flowControl: function(e, t) {
this.inherited(arguments), enyo.Arranger.opacifyControl(e, t.top % this.colHeight !== 0 ? .25 : 1);
},
calcArrangementDifference: function(e, t, n, r) {
return this.colWidth;
},
destroy: function() {
var e = this.container.getPanels();
for (var t = 0, n; n = e[t]; t++) enyo.Arranger.positionControl(n, {
left: null,
top: null
}), n.applyStyle("left", null), n.applyStyle("top", null), n.applyStyle("height", null), n.applyStyle("width", null);
this.inherited(arguments);
}
});

// Panels.js

enyo.kind({
name: "enyo.Panels",
classes: "enyo-panels",
published: {
index: 0,
draggable: !0,
animate: !0,
wrap: !1,
arrangerKind: "CardArranger",
narrowFit: !0
},
events: {
onTransitionStart: "",
onTransitionFinish: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
onscroll: "domScroll"
},
tools: [ {
kind: "Animator",
onStep: "step",
onEnd: "completed"
} ],
fraction: 0,
create: function() {
this.transitionPoints = [], this.inherited(arguments), this.arrangerKindChanged(), this.narrowFitChanged(), this.indexChanged(), this.setAttribute("onscroll", enyo.bubbler);
},
domScroll: function(e, t) {
this.hasNode() && this.node.scrollLeft > 0 && (this.node.scrollLeft = 0);
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
arrangerKindChanged: function() {
this.setLayoutKind(this.arrangerKind);
},
narrowFitChanged: function() {
this.addRemoveClass("enyo-panels-fit-narrow", this.narrowFit);
},
destroy: function() {
this.destroying = !0, this.inherited(arguments);
},
removeControl: function(e) {
this.inherited(arguments), this.destroying && this.controls.length > 0 && this.isPanel(e) && (this.setIndex(Math.max(this.index - 1, 0)), this.flow(), this.reflow());
},
isPanel: function() {
return !0;
},
flow: function() {
this.arrangements = [], this.inherited(arguments);
},
reflow: function() {
this.arrangements = [], this.inherited(arguments), this.refresh();
},
getPanels: function() {
var e = this.controlParent || this;
return e.children;
},
getActive: function() {
var e = this.getPanels(), t = this.index % e.length;
return t < 0 ? t += e.length : enyo.nop, e[t];
},
getAnimator: function() {
return this.$.animator;
},
setIndex: function(e) {
this.setPropertyValue("index", e, "indexChanged");
},
setIndexDirect: function(e) {
this.setIndex(e), this.completed();
},
previous: function() {
this.setIndex(this.index - 1);
},
next: function() {
this.setIndex(this.index + 1);
},
clamp: function(e) {
var t = this.getPanels().length - 1;
return this.wrap ? e : Math.max(0, Math.min(e, t));
},
indexChanged: function(e) {
this.lastIndex = e, this.index = this.clamp(this.index), !this.dragging && this.$.animator && (this.$.animator.isAnimating() && this.completed(), this.$.animator.stop(), this.hasNode() && (this.animate ? (this.startTransition(), this.$.animator.play({
startValue: this.fraction
})) : this.refresh()));
},
step: function(e) {
this.fraction = e.value, this.stepTransition();
},
completed: function() {
this.$.animator.isAnimating() && this.$.animator.stop(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
dragstart: function(e, t) {
if (this.draggable && this.layout && this.layout.canDragEvent(t)) return t.preventDefault(), this.dragstartTransition(t), this.dragging = !0, this.$.animator.stop(), !0;
},
drag: function(e, t) {
this.dragging && (t.preventDefault(), this.dragTransition(t));
},
dragfinish: function(e, t) {
this.dragging && (this.dragging = !1, t.preventTap(), this.dragfinishTransition(t));
},
dragstartTransition: function(e) {
if (!this.$.animator.isAnimating()) {
var t = this.fromIndex = this.index;
this.toIndex = t - (this.layout ? this.layout.calcDragDirection(e) : 0);
} else this.verifyDragTransition(e);
this.fromIndex = this.clamp(this.fromIndex), this.toIndex = this.clamp(this.toIndex), this.fireTransitionStart(), this.layout && this.layout.start();
},
dragTransition: function(e) {
var t = this.layout ? this.layout.calcDrag(e) : 0, n = this.transitionPoints, r = n[0], i = n[n.length - 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i), u = this.layout ? this.layout.drag(t, r, s, i, o) : 0, a = t && !u;
a, this.fraction += u;
var f = this.fraction;
if (f > 1 || f < 0 || a) (f > 0 || a) && this.dragfinishTransition(e), this.dragstartTransition(e), this.fraction = 0;
this.stepTransition();
},
dragfinishTransition: function(e) {
this.verifyDragTransition(e), this.setIndex(this.toIndex), this.dragging && this.fireTransitionFinish();
},
verifyDragTransition: function(e) {
var t = this.layout ? this.layout.calcDragDirection(e) : 0, n = Math.min(this.fromIndex, this.toIndex), r = Math.max(this.fromIndex, this.toIndex);
if (t > 0) {
var i = n;
n = r, r = i;
}
n != this.fromIndex && (this.fraction = 1 - this.fraction), this.fromIndex = n, this.toIndex = r;
},
refresh: function() {
this.$.animator && this.$.animator.isAnimating() && this.$.animator.stop(), this.startTransition(), this.fraction = 1, this.stepTransition(), this.finishTransition();
},
startTransition: function() {
this.fromIndex = this.fromIndex != null ? this.fromIndex : this.lastIndex || 0, this.toIndex = this.toIndex != null ? this.toIndex : this.index, this.layout && this.layout.start(), this.fireTransitionStart();
},
finishTransition: function() {
this.layout && this.layout.finish(), this.transitionPoints = [], this.fraction = 0, this.fromIndex = this.toIndex = null, this.fireTransitionFinish();
},
fireTransitionStart: function() {
var e = this.startTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.fromIndex || e.toIndex != this.toIndex) && (this.startTransitionInfo = {
fromIndex: this.fromIndex,
toIndex: this.toIndex
}, this.doTransitionStart(enyo.clone(this.startTransitionInfo)));
},
fireTransitionFinish: function() {
var e = this.finishTransitionInfo;
this.hasNode() && (!e || e.fromIndex != this.lastIndex || e.toIndex != this.index) && (this.finishTransitionInfo = {
fromIndex: this.lastIndex,
toIndex: this.index
}, this.doTransitionFinish(enyo.clone(this.finishTransitionInfo))), this.lastIndex = this.index;
},
stepTransition: function() {
if (this.hasNode()) {
var e = this.transitionPoints, t = (this.fraction || 0) * (e.length - 1), n = Math.floor(t);
t -= n;
var r = e[n], i = e[n + 1], s = this.fetchArrangement(r), o = this.fetchArrangement(i);
this.arrangement = s && o ? enyo.Panels.lerp(s, o, t) : s || o, this.arrangement && this.layout && this.layout.flowArrangement();
}
},
fetchArrangement: function(e) {
return e != null && !this.arrangements[e] && this.layout && (this.layout._arrange(e), this.arrangements[e] = this.readArrangement(this.getPanels())), this.arrangements[e];
},
readArrangement: function(e) {
var t = [];
for (var n = 0, r = e, i; i = r[n]; n++) t.push(enyo.clone(i._arranger));
return t;
},
statics: {
isScreenNarrow: function() {
return enyo.dom.getWindowWidth() <= 800;
},
lerp: function(e, t, n) {
var r = [];
for (var i = 0, s = enyo.keys(e), o; o = s[i]; i++) r.push(this.lerpObject(e[o], t[o], n));
return r;
},
lerpObject: function(e, t, n) {
var r = enyo.clone(e), i, s;
if (t) for (var o in e) i = e[o], s = t[o], i != s && (r[o] = i - (i - s) * n);
return r;
}
}
});

// Node.js

enyo.kind({
name: "enyo.Node",
published: {
expandable: !1,
expanded: !1,
icon: "",
onlyIconExpands: !1,
selected: !1
},
style: "padding: 0 0 0 16px;",
content: "Node",
defaultKind: "Node",
classes: "enyo-node",
components: [ {
name: "icon",
kind: "Image",
showing: !1
}, {
kind: "Control",
name: "caption",
Xtag: "span",
style: "display: inline-block; padding: 4px;",
allowHtml: !0
}, {
kind: "Control",
name: "extra",
tag: "span",
allowHtml: !0
} ],
childClient: [ {
kind: "Control",
name: "box",
classes: "enyo-node-box",
Xstyle: "border: 1px solid orange;",
components: [ {
kind: "Control",
name: "client",
classes: "enyo-node-client",
Xstyle: "border: 1px solid lightblue;"
} ]
} ],
handlers: {
ondblclick: "dblclick"
},
events: {
onNodeTap: "nodeTap",
onNodeDblClick: "nodeDblClick",
onExpand: "nodeExpand",
onDestroyed: "nodeDestroyed"
},
create: function() {
this.inherited(arguments), this.selectedChanged(), this.iconChanged();
},
destroy: function() {
this.doDestroyed(), this.inherited(arguments);
},
initComponents: function() {
this.expandable && (this.kindComponents = this.kindComponents.concat(this.childClient)), this.inherited(arguments);
},
contentChanged: function() {
this.$.caption.setContent(this.content);
},
iconChanged: function() {
this.$.icon.setSrc(this.icon), this.$.icon.setShowing(Boolean(this.icon));
},
selectedChanged: function() {
this.addRemoveClass("enyo-selected", this.selected);
},
rendered: function() {
this.inherited(arguments), this.expandable && !this.expanded && this.quickCollapse();
},
addNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent(n);
this.$.client.render();
},
addTextNodes: function(e) {
this.destroyClientControls();
for (var t = 0, n; n = e[t]; t++) this.createComponent({
content: n
});
this.$.client.render();
},
tap: function(e, t) {
return this.onlyIconExpands ? t.target == this.$.icon.hasNode() ? this.toggleExpanded() : this.doNodeTap() : (this.toggleExpanded(), this.doNodeTap()), !0;
},
dblclick: function(e, t) {
return this.doNodeDblClick(), !0;
},
toggleExpanded: function() {
this.setExpanded(!this.expanded);
},
quickCollapse: function() {
this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "0");
var e = this.$.client.getBounds().height;
this.$.client.setBounds({
top: -e
});
},
_expand: function() {
this.addClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), this.$.client.setBounds({
top: 0
}), setTimeout(enyo.bind(this, function() {
this.expanded && (this.removeClass("enyo-animate"), this.$.box.applyStyle("height", "auto"));
}), 225);
},
_collapse: function() {
this.removeClass("enyo-animate");
var e = this.$.client.getBounds().height;
this.$.box.setBounds({
height: e
}), setTimeout(enyo.bind(this, function() {
this.addClass("enyo-animate"), this.$.box.applyStyle("height", "0"), this.$.client.setBounds({
top: -e
});
}), 25);
},
expandedChanged: function(e) {
if (!this.expandable) this.expanded = !1; else {
var t = {
expanded: this.expanded
};
this.doExpand(t), t.wait || this.effectExpanded();
}
},
effectExpanded: function() {
this.$.client && (this.expanded ? this._expand() : this._collapse());
}
});

// ImageViewPin.js

enyo.kind({
name: "enyo.ImageViewPin",
kind: "enyo.Control",
published: {
highlightAnchorPoint: !1,
anchor: {
top: 0,
left: 0
},
position: {
top: 0,
left: 0
}
},
style: "position:absolute;z-index:1000;width:0px;height:0px;",
handlers: {
onPositionPin: "reAnchor"
},
create: function() {
this.inherited(arguments), this.styleClientControls(), this.positionClientControls(), this.highlightAnchorPointChanged(), this.anchorChanged();
},
styleClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) e[t].applyStyle("position", "absolute");
},
positionClientControls: function() {
var e = this.getClientControls();
for (var t = 0; t < e.length; t++) for (p in this.position) e[t].applyStyle(p, this.position[p] + "px");
},
highlightAnchorPointChanged: function() {
this.highlightAnchorPoint ? this.addClass("pinDebug") : this.removeClass("pinDebug");
},
anchorChanged: function() {
var e = null, t = null;
for (t in this.anchor) {
e = this.anchor[t].toString().match(/^(\d+(?:\.\d+)?)(.*)$/);
if (!e) continue;
this.anchor[t + "Coords"] = {
value: e[1],
units: e[2] || "px"
};
}
},
reAnchor: function(e, t) {
var n = t.scale, r = t.bounds, i = this.anchor.right ? this.anchor.rightCoords.units == "px" ? r.width + r.x - this.anchor.rightCoords.value * n : r.width * (100 - this.anchor.rightCoords.value) / 100 + r.x : this.anchor.leftCoords.units == "px" ? this.anchor.leftCoords.value * n + r.x : r.width * this.anchor.leftCoords.value / 100 + r.x, s = this.anchor.bottom ? this.anchor.bottomCoords.units == "px" ? r.height + r.y - this.anchor.bottomCoords.value * n : r.height * (100 - this.anchor.bottomCoords.value) / 100 + r.y : this.anchor.topCoords.units == "px" ? this.anchor.topCoords.value * n + r.y : r.height * this.anchor.topCoords.value / 100 + r.y;
this.applyStyle("left", i + "px"), this.applyStyle("top", s + "px");
}
});

// ImageView.js

enyo.kind({
name: "enyo.ImageView",
kind: enyo.Scroller,
touchOverscroll: !1,
thumb: !1,
animate: !0,
verticalDragPropagation: !0,
horizontalDragPropagation: !0,
published: {
scale: "auto",
disableZoom: !1,
src: undefined
},
events: {
onZoom: ""
},
touch: !0,
preventDragPropagation: !1,
handlers: {
ondragstart: "dragPropagation"
},
components: [ {
name: "animator",
kind: "Animator",
onStep: "zoomAnimationStep",
onEnd: "zoomAnimationEnd"
}, {
name: "viewport",
style: "overflow:hidden;min-height:100%;min-width:100%;",
classes: "enyo-fit",
ongesturechange: "gestureTransform",
ongestureend: "saveState",
ontap: "singleTap",
ondblclick: "doubleClick",
onmousewheel: "mousewheel",
components: [ {
kind: "Image",
ondown: "down"
} ]
} ],
create: function() {
this.inherited(arguments), this.canTransform = enyo.dom.canTransform(), this.canTransform || this.$.image.applyStyle("position", "relative"), this.canAccelerate = enyo.dom.canAccelerate(), this.bufferImage = new Image, this.bufferImage.onload = enyo.bind(this, "imageLoaded"), this.bufferImage.onerror = enyo.bind(this, "imageError"), this.srcChanged(), this.getStrategy().setDragDuringGesture(!1), this.getStrategy().$.scrollMath.start();
},
down: function(e, t) {
t.preventDefault();
},
dragPropagation: function(e, t) {
var n = this.getStrategy().getScrollBounds(), r = n.top === 0 && t.dy > 0 || n.top >= n.maxTop - 2 && t.dy < 0, i = n.left === 0 && t.dx > 0 || n.left >= n.maxLeft - 2 && t.dx < 0;
return !(r && this.verticalDragPropagation || i && this.horizontalDragPropagation);
},
mousewheel: function(e, t) {
t.pageX |= t.clientX + t.target.scrollLeft, t.pageY |= t.clientY + t.target.scrollTop;
var n = (this.maxScale - this.minScale) / 10, r = this.scale;
if (t.wheelDelta > 0 || t.detail < 0) this.scale = this.limitScale(this.scale + n); else if (t.wheelDelta < 0 || t.detail > 0) this.scale = this.limitScale(this.scale - n);
return this.eventPt = this.calcEventLocation(t), this.transformImage(this.scale), r != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null, t.preventDefault(), !0;
},
srcChanged: function() {
this.src && this.src.length > 0 && this.bufferImage && this.src != this.bufferImage.src && (this.bufferImage.src = this.src);
},
imageLoaded: function(e) {
this.originalWidth = this.bufferImage.width, this.originalHeight = this.bufferImage.height, this.scaleChanged(), this.$.image.setSrc(this.bufferImage.src), enyo.dom.transformValue(this.getStrategy().$.client, "translate3d", "0px, 0px, 0"), this.positionClientControls(this.scale);
},
resizeHandler: function() {
this.inherited(arguments), this.$.image.src && this.scaleChanged();
},
scaleChanged: function() {
var e = this.hasNode();
if (e) {
this.containerWidth = e.clientWidth, this.containerHeight = e.clientHeight;
var t = this.containerWidth / this.originalWidth, n = this.containerHeight / this.originalHeight;
this.minScale = Math.min(t, n), this.maxScale = this.minScale * 3 < 1 ? 1 : this.minScale * 3, this.scale == "auto" ? this.scale = this.minScale : this.scale == "width" ? this.scale = t : this.scale == "height" ? this.scale = n : (this.maxScale = Math.max(this.maxScale, this.scale), this.scale = this.limitScale(this.scale));
}
this.eventPt = this.calcEventLocation(), this.transformImage(this.scale);
},
imageError: function(e) {
enyo.error("Error loading image: " + this.src), this.bubble("onerror", e);
},
gestureTransform: function(e, t) {
this.eventPt = this.calcEventLocation(t), this.transformImage(this.limitScale(this.scale * t.scale));
},
calcEventLocation: function(e) {
var t = {
x: 0,
y: 0
};
if (e && this.hasNode()) {
var n = this.node.getBoundingClientRect();
t.x = Math.round(e.pageX - n.left - this.imageBounds.x), t.x = Math.max(0, Math.min(this.imageBounds.width, t.x)), t.y = Math.round(e.pageY - n.top - this.imageBounds.y), t.y = Math.max(0, Math.min(this.imageBounds.height, t.y));
}
return t;
},
transformImage: function(e) {
this.tapped = !1;
var t = this.imageBounds || this.innerImageBounds(e);
this.imageBounds = this.innerImageBounds(e), this.scale > this.minScale ? this.$.viewport.applyStyle("cursor", "move") : this.$.viewport.applyStyle("cursor", null), this.$.viewport.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px"
}), this.ratioX = this.ratioX || (this.eventPt.x + this.getScrollLeft()) / t.width, this.ratioY = this.ratioY || (this.eventPt.y + this.getScrollTop()) / t.height;
var n, r;
this.$.animator.ratioLock ? (n = this.$.animator.ratioLock.x * this.imageBounds.width - this.containerWidth / 2, r = this.$.animator.ratioLock.y * this.imageBounds.height - this.containerHeight / 2) : (n = this.ratioX * this.imageBounds.width - this.eventPt.x, r = this.ratioY * this.imageBounds.height - this.eventPt.y), n = Math.max(0, Math.min(this.imageBounds.width - this.containerWidth, n)), r = Math.max(0, Math.min(this.imageBounds.height - this.containerHeight, r));
if (this.canTransform) {
var i = {
scale: e
};
this.canAccelerate ? i = enyo.mixin({
translate3d: Math.round(this.imageBounds.left) + "px, " + Math.round(this.imageBounds.top) + "px, 0px"
}, i) : i = enyo.mixin({
translate: this.imageBounds.left + "px, " + this.imageBounds.top + "px"
}, i), enyo.dom.transform(this.$.image, i);
} else this.$.image.setBounds({
width: this.imageBounds.width + "px",
height: this.imageBounds.height + "px",
left: this.imageBounds.left + "px",
top: this.imageBounds.top + "px"
});
this.setScrollLeft(n), this.setScrollTop(r), this.positionClientControls(e);
},
limitScale: function(e) {
return this.disableZoom ? e = this.scale : e > this.maxScale ? e = this.maxScale : e < this.minScale && (e = this.minScale), e;
},
innerImageBounds: function(e) {
var t = this.originalWidth * e, n = this.originalHeight * e, r = {
x: 0,
y: 0,
transX: 0,
transY: 0
};
return t < this.containerWidth && (r.x += (this.containerWidth - t) / 2), n < this.containerHeight && (r.y += (this.containerHeight - n) / 2), this.canTransform && (r.transX -= (this.originalWidth - t) / 2, r.transY -= (this.originalHeight - n) / 2), {
left: r.x + r.transX,
top: r.y + r.transY,
width: t,
height: n,
x: r.x,
y: r.y
};
},
saveState: function(e, t) {
var n = this.scale;
this.scale *= t.scale, this.scale = this.limitScale(this.scale), n != this.scale && this.doZoom({
scale: this.scale
}), this.ratioX = this.ratioY = null;
},
doubleClick: function(e, t) {
enyo.platform.ie == 8 && (this.tapped = !0, t.pageX = t.clientX + t.target.scrollLeft, t.pageY = t.clientY + t.target.scrollTop, this.singleTap(e, t), t.preventDefault());
},
singleTap: function(e, t) {
setTimeout(enyo.bind(this, function() {
this.tapped = !1;
}), 300), this.tapped ? (this.tapped = !1, this.smartZoom(e, t)) : this.tapped = !0;
},
smartZoom: function(e, t) {
var n = this.hasNode(), r = this.$.image.hasNode();
if (n && r && this.hasNode() && !this.disableZoom) {
var i = this.scale;
this.scale != this.minScale ? this.scale = this.minScale : this.scale = this.maxScale, this.eventPt = this.calcEventLocation(t);
if (this.animate) {
var s = {
x: (this.eventPt.x + this.getScrollLeft()) / this.imageBounds.width,
y: (this.eventPt.y + this.getScrollTop()) / this.imageBounds.height
};
this.$.animator.play({
duration: 350,
ratioLock: s,
baseScale: i,
deltaScale: this.scale - i
});
} else this.transformImage(this.scale), this.doZoom({
scale: this.scale
});
}
},
zoomAnimationStep: function(e, t) {
var n = this.$.animator.baseScale + this.$.animator.deltaScale * this.$.animator.value;
this.transformImage(n);
},
zoomAnimationEnd: function(e, t) {
this.doZoom({
scale: this.scale
}), this.$.animator.ratioLock = undefined;
},
positionClientControls: function(e) {
this.waterfallDown("onPositionPin", {
scale: e,
bounds: this.imageBounds
});
}
});

// ImageCarousel.js

enyo.kind({
name: "enyo.ImageCarousel",
kind: enyo.Panels,
arrangerKind: "enyo.CarouselArranger",
defaultScale: "auto",
disableZoom: !1,
lowMemory: !1,
published: {
images: []
},
handlers: {
onTransitionStart: "transitionStart",
onTransitionFinish: "transitionFinish"
},
create: function() {
this.inherited(arguments), this.imageCount = this.images.length, this.images.length > 0 && (this.initContainers(), this.loadNearby());
},
initContainers: function() {
for (var e = 0; e < this.images.length; e++) this.$["container" + e] || (this.createComponent({
name: "container" + e,
style: "height:100%; width:100%;"
}), this.$["container" + e].render());
for (e = this.images.length; e < this.imageCount; e++) this.$["image" + e] && this.$["image" + e].destroy(), this.$["container" + e].destroy();
this.imageCount = this.images.length;
},
loadNearby: function() {
this.images.length > 0 && (this.loadImageView(this.index - 1), this.loadImageView(this.index), this.loadImageView(this.index + 1));
},
loadImageView: function(e) {
return this.wrap && (e = (e % this.images.length + this.images.length) % this.images.length), e >= 0 && e <= this.images.length - 1 && (this.$["image" + e] ? (this.$["image" + e].src != this.images[e] && this.$["image" + e].setSrc(this.images[e]), this.$["image" + e].setScale(this.defaultScale), this.$["image" + e].setDisableZoom(this.disableZoom)) : (this.$["container" + e].createComponent({
name: "image" + e,
kind: "ImageView",
scale: this.defaultScale,
disableZoom: this.disableZoom,
src: this.images[e],
verticalDragPropagation: !1,
style: "height:100%; width:100%;"
}, {
owner: this
}), this.$["image" + e].render())), this.$["image" + e];
},
setImages: function(e) {
this.setPropertyValue("images", e, "imagesChanged");
},
imagesChanged: function() {
this.initContainers(), this.loadNearby();
},
indexChanged: function() {
this.loadNearby(), this.lowMemory && this.cleanupMemory(), this.inherited(arguments);
},
transitionStart: function(e, t) {
if (t.fromIndex == t.toIndex) return !0;
},
transitionFinish: function(e, t) {
this.loadImageView(this.index - 1), this.loadImageView(this.index + 1), this.lowMemory && this.cleanupMemory();
},
getActiveImage: function() {
return this.getImageByIndex(this.index);
},
getImageByIndex: function(e) {
return this.$["image" + e] || this.loadImageView(e);
},
cleanupMemory: function() {
for (var e = 0; e < this.images.length; e++) (e < this.index - 1 || e > this.index + 1) && this.$["image" + e] && this.$["image" + e].destroy();
}
});

// Icon.js

enyo.kind({
name: "onyx.Icon",
published: {
src: "",
disabled: !1
},
classes: "onyx-icon",
create: function() {
this.inherited(arguments), this.src && this.srcChanged(), this.disabledChanged();
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
srcChanged: function() {
this.applyStyle("background-image", "url(" + enyo.path.rewrite(this.src) + ")");
}
});

// Button.js

enyo.kind({
name: "onyx.Button",
kind: "enyo.Button",
classes: "onyx-button enyo-unselectable",
create: function() {
enyo.platform.firefoxOS && (this.handlers.ondown = "down", this.handlers.onleave = "leave"), this.inherited(arguments);
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
}
});

// IconButton.js

enyo.kind({
name: "onyx.IconButton",
kind: "onyx.Icon",
published: {
active: !1
},
classes: "onyx-icon-button",
create: function() {
enyo.platform.firefoxOS && (this.handlers.ondown = "down", this.handlers.onleave = "leave"), this.inherited(arguments);
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
},
rendered: function() {
this.inherited(arguments), this.activeChanged();
},
tap: function() {
if (this.disabled) return !0;
this.setActive(!0);
},
activeChanged: function() {
this.bubble("onActivate");
}
});

// Checkbox.js

enyo.kind({
name: "onyx.Checkbox",
classes: "onyx-checkbox",
kind: enyo.Checkbox,
tag: "div",
handlers: {
onclick: ""
},
tap: function(e, t) {
return this.disabled || (this.setChecked(!this.getChecked()), this.bubble("onchange")), !this.disabled;
},
dragstart: function() {}
});

// Drawer.js

enyo.kind({
name: "onyx.Drawer",
published: {
open: !0,
orient: "v",
animated: !0
},
style: "overflow: hidden; position: relative;",
tools: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorEnd"
}, {
name: "client",
style: "position: relative;",
classes: "enyo-border-box"
} ],
create: function() {
this.inherited(arguments), this.animatedChanged(), this.openChanged();
},
initComponents: function() {
this.createChrome(this.tools), this.inherited(arguments);
},
animatedChanged: function() {
!this.animated && this.hasNode() && this.$.animator.isAnimating() && (this.$.animator.stop(), this.animatorEnd());
},
openChanged: function() {
this.$.client.show();
if (this.hasNode()) if (this.$.animator.isAnimating()) this.$.animator.reverse(); else {
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left";
this.applyStyle(t, null);
var r = this.hasNode()[e ? "scrollHeight" : "scrollWidth"];
this.animated ? this.$.animator.play({
startValue: this.open ? 0 : r,
endValue: this.open ? r : 0,
dimension: t,
position: n
}) : this.animatorEnd();
} else this.$.client.setShowing(this.open);
},
animatorStep: function(e) {
if (this.hasNode()) {
var t = e.dimension;
this.node.style[t] = this.domStyles[t] = e.value + "px";
}
var n = this.$.client.hasNode();
if (n) {
var r = e.position, i = this.open ? e.endValue : e.startValue;
n.style[r] = this.$.client.domStyles[r] = e.value - i + "px";
}
this.container && this.container.resized();
},
animatorEnd: function() {
if (!this.open) this.$.client.hide(); else {
this.$.client.domCssText = enyo.Control.domStylesToCssText(this.$.client.domStyles);
var e = this.orient == "v", t = e ? "height" : "width", n = e ? "top" : "left", r = this.$.client.hasNode();
r && (r.style[n] = this.$.client.domStyles[n] = null), this.node && (this.node.style[t] = this.domStyles[t] = null);
}
this.container && this.container.resized();
}
});

// Grabber.js

enyo.kind({
name: "onyx.Grabber",
classes: "onyx-grabber"
});

// Groupbox.js

enyo.kind({
name: "onyx.Groupbox",
classes: "onyx-groupbox"
}), enyo.kind({
name: "onyx.GroupboxHeader",
classes: "onyx-groupbox-header"
});

// Input.js

enyo.kind({
name: "onyx.Input",
kind: "enyo.Input",
classes: "onyx-input"
});

// Popup.js

enyo.kind({
name: "onyx.Popup",
kind: "Popup",
classes: "onyx-popup",
published: {
scrimWhenModal: !0,
scrim: !1,
scrimClassName: ""
},
statics: {
count: 0
},
defaultZ: 120,
showingChanged: function() {
this.showing ? (onyx.Popup.count++, this.applyZIndex()) : onyx.Popup.count > 0 && onyx.Popup.count--, this.showHideScrim(this.showing), this.inherited(arguments);
},
showHideScrim: function(e) {
if (this.floating && (this.scrim || this.modal && this.scrimWhenModal)) {
var t = this.getScrim();
if (e) {
var n = this.getScrimZIndex();
this._scrimZ = n, t.showAtZIndex(n);
} else t.hideAtZIndex(this._scrimZ);
enyo.call(t, "addRemoveClass", [ this.scrimClassName, t.showing ]);
}
},
getScrimZIndex: function() {
return this.findZIndex() - 1;
},
getScrim: function() {
return this.modal && this.scrimWhenModal && !this.scrim ? onyx.scrimTransparent.make() : onyx.scrim.make();
},
applyZIndex: function() {
this._zIndex = onyx.Popup.count * 2 + this.findZIndex() + 1, this.applyStyle("z-index", this._zIndex);
},
findZIndex: function() {
var e = this.defaultZ;
return this._zIndex ? e = this._zIndex : this.hasNode() && (e = Number(enyo.dom.getComputedStyleValue(this.node, "z-index")) || e), this._zIndex = e;
}
});

// TextArea.js

enyo.kind({
name: "onyx.TextArea",
kind: "enyo.TextArea",
classes: "onyx-textarea"
});

// RichText.js

enyo.kind({
name: "onyx.RichText",
kind: "enyo.RichText",
classes: "onyx-richtext"
});

// InputDecorator.js

enyo.kind({
name: "onyx.InputDecorator",
kind: "enyo.ToolDecorator",
tag: "label",
classes: "onyx-input-decorator",
published: {
alwaysLooksFocused: !1
},
handlers: {
onDisabledChange: "disabledChange",
onfocus: "receiveFocus",
onblur: "receiveBlur"
},
create: function() {
this.inherited(arguments), this.updateFocus(!1);
},
alwaysLooksFocusedChanged: function(e) {
this.updateFocus(this.focus);
},
updateFocus: function(e) {
this.focused = e, this.addRemoveClass("onyx-focused", this.alwaysLooksFocused || this.focused);
},
receiveFocus: function() {
this.updateFocus(!0);
},
receiveBlur: function() {
this.updateFocus(!1);
},
disabledChange: function(e, t) {
this.addRemoveClass("onyx-disabled", t.originator.disabled);
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// MenuDecorator.js

enyo.kind({
name: "onyx.MenuDecorator",
kind: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator enyo-unselectable",
handlers: {
onActivate: "activated",
onHide: "menuHidden"
},
activated: function(e, t) {
this.requestHideTooltip(), t.originator.active && (this.menuActive = !0, this.activator = t.originator, this.activator.addClass("active"), this.requestShowMenu());
},
requestShowMenu: function() {
this.waterfallDown("onRequestShowMenu", {
activator: this.activator
});
},
requestHideMenu: function() {
this.waterfallDown("onRequestHideMenu");
},
menuHidden: function() {
this.menuActive = !1, this.activator && (this.activator.setActive(!1), this.activator.removeClass("active"));
},
enter: function(e) {
this.menuActive || this.inherited(arguments);
},
leave: function(e, t) {
this.menuActive || this.inherited(arguments);
}
});

// Menu.js

enyo.kind({
name: "onyx.Menu",
kind: "onyx.Popup",
modal: !0,
defaultKind: "onyx.MenuItem",
classes: "onyx-menu",
published: {
maxHeight: 200,
scrolling: !0
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestMenuShow",
onRequestHideMenu: "requestHide"
},
childComponents: [ {
name: "client",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy"
} ],
showOnTop: !1,
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged();
},
initComponents: function() {
this.scrolling && this.createComponents(this.childComponents, {
isChrome: !0
}), this.inherited(arguments);
},
getScroller: function() {
return this.$[this.scrollerName];
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition(!0);
},
requestMenuShow: function(e, t) {
if (this.floating) {
var n = t.activator.hasNode();
if (n) {
var r = this.activatorOffset = this.getPageOffset(n);
this.applyPosition({
top: r.top + (this.showOnTop ? 0 : r.height),
left: r.left,
width: r.width
});
}
}
return this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = e.getBoundingClientRect(), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.scrolling && !this.showOnTop && this.getScroller().setMaxHeight(this.maxHeight + "px"), this.removeClass("onyx-menu-up"), this.floating || this.applyPosition({
left: "auto"
});
var e = this.node.getBoundingClientRect(), t = e.height === undefined ? e.bottom - e.top : e.height, n = window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight, r = window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
this.menuUp = e.top + t > n && n - e.bottom < e.top - t, this.addRemoveClass("onyx-menu-up", this.menuUp);
if (this.floating) {
var i = this.activatorOffset;
this.menuUp ? this.applyPosition({
top: i.top - t + (this.showOnTop ? i.height : 0),
bottom: "auto"
}) : e.top < i.top && i.top + (this.showOnTop ? 0 : i.height) + t < n && this.applyPosition({
top: i.top + (this.showOnTop ? 0 : i.height),
bottom: "auto"
});
}
e.right > r && (this.floating ? this.applyPosition({
left: r - e.width
}) : this.applyPosition({
left: -(e.right - r)
})), e.left < 0 && (this.floating ? this.applyPosition({
left: 0,
right: "auto"
}) : this.getComputedStyleValue("right") == "auto" ? this.applyPosition({
left: -e.left
}) : this.applyPosition({
right: e.left
}));
if (this.scrolling && !this.showOnTop) {
e = this.node.getBoundingClientRect();
var s;
this.menuUp ? s = this.maxHeight < e.bottom ? this.maxHeight : e.bottom : s = e.top + this.maxHeight < n ? this.maxHeight : n - e.top, this.getScroller().setMaxHeight(s + "px");
}
}
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// MenuItem.js

enyo.kind({
name: "onyx.MenuItem",
kind: "enyo.Button",
events: {
onSelect: "",
onItemContentChange: ""
},
classes: "onyx-menu-item",
tag: "div",
create: function() {
this.inherited(arguments), this.active && this.bubble("onActivate");
},
tap: function(e) {
this.inherited(arguments), this.bubble("onRequestHideMenu"), this.doSelect({
selected: this,
content: this.content
});
},
contentChanged: function(e) {
this.inherited(arguments), this.doItemContentChange({
content: this.content
});
}
});

// PickerDecorator.js

enyo.kind({
name: "onyx.PickerDecorator",
kind: "onyx.MenuDecorator",
classes: "onyx-picker-decorator",
defaultKind: "onyx.PickerButton",
handlers: {
onChange: "change"
},
change: function(e, t) {
this.waterfallDown("onChange", t);
}
});

// PickerButton.js

enyo.kind({
name: "onyx.PickerButton",
kind: "onyx.Button",
handlers: {
onChange: "change"
},
change: function(e, t) {
t.content !== undefined && this.setContent(t.content);
}
});

// Picker.js

enyo.kind({
name: "onyx.Picker",
kind: "onyx.Menu",
classes: "onyx-picker enyo-unselectable",
published: {
selected: null
},
events: {
onChange: ""
},
handlers: {
onItemContentChange: "itemContentChange"
},
floating: !0,
showOnTop: !0,
initComponents: function() {
this.setScrolling(!0), this.inherited(arguments);
},
showingChanged: function() {
this.getScroller().setShowing(this.showing), this.inherited(arguments), this.showing && this.selected && this.scrollToSelected();
},
scrollToSelected: function() {
this.getScroller().scrollToControl(this.selected, !this.menuUp);
},
itemActivated: function(e, t) {
return this.processActivatedItem(t.originator), this.inherited(arguments);
},
processActivatedItem: function(e) {
e.active && this.setSelected(e);
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
}));
},
itemContentChange: function(e, t) {
t.originator == this.selected && this.doChange({
selected: this.selected,
content: this.selected.content
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
}
});

// FlyweightPicker.js

enyo.kind({
name: "onyx.FlyweightPicker",
kind: "onyx.Picker",
classes: "onyx-flyweight-picker",
published: {
count: 0
},
events: {
onSetupItem: "",
onSelect: ""
},
handlers: {
onSelect: "itemSelect"
},
components: [ {
name: "scroller",
kind: "enyo.Scroller",
strategyKind: "TouchScrollStrategy",
components: [ {
name: "flyweight",
kind: "FlyweightRepeater",
ontap: "itemTap"
} ]
} ],
scrollerName: "scroller",
initComponents: function() {
this.controlParentName = "flyweight", this.inherited(arguments), this.$.flyweight.$.client.children[0].setActive(!0);
},
create: function() {
this.inherited(arguments), this.countChanged();
},
rendered: function() {
this.inherited(arguments), this.selectedChanged();
},
scrollToSelected: function() {
var e = this.$.flyweight.fetchRowNode(this.selected);
this.getScroller().scrollToNode(e, !this.menuUp);
},
countChanged: function() {
this.$.flyweight.count = this.count;
},
processActivatedItem: function(e) {
this.item = e;
},
selectedChanged: function(e) {
if (!this.item) return;
e !== undefined && (this.item.removeClass("selected"), this.$.flyweight.renderRow(e)), this.item.addClass("selected"), this.$.flyweight.renderRow(this.selected), this.item.removeClass("selected");
var t = this.$.flyweight.fetchRowNode(this.selected);
this.doChange({
selected: this.selected,
content: t && t.textContent || this.item.content
});
},
itemTap: function(e, t) {
this.setSelected(t.rowIndex), this.doSelect({
selected: this.item,
content: this.item.content
});
},
itemSelect: function(e, t) {
if (t.originator != this) return !0;
}
});

// DatePicker.js

enyo.kind({
name: "onyx.DatePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
dayHidden: !1,
monthHidden: !1,
yearHidden: !1,
minYear: 1900,
maxYear: 2099,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" ];
enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getMonthFields()), this.setupPickers(this._tf ? this._tf.getDateFieldOrder() : "mdy"), this.dayHiddenChanged(), this.monthHiddenChanged(), this.yearHiddenChanged();
var t = this.value = this.value || new Date;
for (var n = 0, r; r = e[n]; n++) this.$.monthPicker.createComponent({
content: r,
value: n,
active: n == t.getMonth()
});
var i = t.getFullYear();
this.$.yearPicker.setSelected(i - this.minYear);
for (n = 1; n <= this.monthLength(t.getYear(), t.getMonth()); n++) this.$.dayPicker.createComponent({
content: n,
value: n,
active: n == t.getDate()
});
},
monthLength: function(e, t) {
return 32 - (new Date(e, t, 32)).getDate();
},
setupYear: function(e, t) {
this.$.year.setContent(this.minYear + t.index);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "d":
this.createDay();
break;
case "m":
this.createMonth();
break;
case "y":
this.createYear();
break;
default:
}
}
},
createYear: function() {
var e = this.maxYear - this.minYear;
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateYear",
components: [ {
classes: "onyx-datepicker-year",
name: "yearPickerButton",
disabled: this.disabled
}, {
name: "yearPicker",
kind: "onyx.FlyweightPicker",
count: ++e,
onSetupItem: "setupYear",
components: [ {
name: "year"
} ]
} ]
});
},
createMonth: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMonth",
components: [ {
classes: "onyx-datepicker-month",
name: "monthPickerButton",
disabled: this.disabled
}, {
name: "monthPicker",
kind: "onyx.Picker"
} ]
});
},
createDay: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateDay",
components: [ {
classes: "onyx-datepicker-day",
name: "dayPickerButton",
disabled: this.disabled
}, {
name: "dayPicker",
kind: "onyx.Picker"
} ]
});
},
localeChanged: function() {
this.refresh();
},
dayHiddenChanged: function() {
this.$.dayPicker.getParent().setShowing(this.dayHidden ? !1 : !0);
},
monthHiddenChanged: function() {
this.$.monthPicker.getParent().setShowing(this.monthHidden ? !1 : !0);
},
yearHiddenChanged: function() {
this.$.yearPicker.getParent().setShowing(this.yearHidden ? !1 : !0);
},
minYearChanged: function() {
this.refresh();
},
maxYearChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
disabledChanged: function() {
this.$.yearPickerButton.setDisabled(this.disabled), this.$.monthPickerButton.setDisabled(this.disabled), this.$.dayPickerButton.setDisabled(this.disabled);
},
updateDay: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), this.value.getMonth(), t.selected.value);
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateMonth: function(e, t) {
var n = this.calcDate(this.value.getFullYear(), t.selected.value, this.value.getDate());
return this.doSelect({
name: this.name,
value: n
}), this.setValue(n), !0;
},
updateYear: function(e, t) {
if (t.originator.selected != -1) {
var n = this.calcDate(this.minYear + t.originator.selected, this.value.getMonth(), this.value.getDate());
this.doSelect({
name: this.name,
value: n
}), this.setValue(n);
}
return !0;
},
calcDate: function(e, t, n) {
return new Date(e, t, n, this.value.getHours(), this.value.getMinutes(), this.value.getSeconds(), this.value.getMilliseconds());
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// TimePicker.js

enyo.kind({
name: "onyx.TimePicker",
classes: "onyx-toolbar-inline",
published: {
disabled: !1,
locale: "en_us",
is24HrMode: null,
value: null
},
events: {
onSelect: ""
},
create: function() {
this.inherited(arguments), enyo.g11n && (this.locale = enyo.g11n.currentLocale().getLocale()), this.initDefaults();
},
initDefaults: function() {
var e = "AM", t = "PM";
this.is24HrMode == null && (this.is24HrMode = !1), enyo.g11n && (this._tf = new enyo.g11n.Fmts({
locale: this.locale
}), e = this._tf.getAmCaption(), t = this._tf.getPmCaption(), this.is24HrMode == null && (this.is24HrMode = !this._tf.isAmPm())), this.setupPickers(this._tf ? this._tf.getTimeFieldOrder() : "hma");
var n = this.value = this.value || new Date, r;
if (!this.is24HrMode) {
var i = n.getHours();
i = i === 0 ? 12 : i;
for (r = 1; r <= 12; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == (i > 12 ? i % 12 : i)
});
} else for (r = 0; r < 24; r++) this.$.hourPicker.createComponent({
content: r,
value: r,
active: r == n.getHours()
});
for (r = 0; r <= 59; r++) this.$.minutePicker.createComponent({
content: r < 10 ? "0" + r : r,
value: r,
active: r == n.getMinutes()
});
n.getHours() >= 12 ? this.$.ampmPicker.createComponents([ {
content: e
}, {
content: t,
active: !0
} ]) : this.$.ampmPicker.createComponents([ {
content: e,
active: !0
}, {
content: t
} ]), this.$.ampmPicker.getParent().setShowing(!this.is24HrMode);
},
setupPickers: function(e) {
var t = e.split(""), n, r, i;
for (r = 0, i = t.length; r < i; r++) {
n = t[r];
switch (n) {
case "h":
this.createHour();
break;
case "m":
this.createMinute();
break;
case "a":
this.createAmPm();
break;
default:
}
}
},
createHour: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateHour",
components: [ {
classes: "onyx-timepicker-hour",
name: "hourPickerButton",
disabled: this.disabled
}, {
name: "hourPicker",
kind: "onyx.Picker"
} ]
});
},
createMinute: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateMinute",
components: [ {
classes: "onyx-timepicker-minute",
name: "minutePickerButton",
disabled: this.disabled
}, {
name: "minutePicker",
kind: "onyx.Picker"
} ]
});
},
createAmPm: function() {
this.createComponent({
kind: "onyx.PickerDecorator",
onSelect: "updateAmPm",
components: [ {
classes: "onyx-timepicker-ampm",
name: "ampmPickerButton",
disabled: this.disabled
}, {
name: "ampmPicker",
kind: "onyx.Picker"
} ]
});
},
disabledChanged: function() {
this.$.hourPickerButton.setDisabled(this.disabled), this.$.minutePickerButton.setDisabled(this.disabled), this.$.ampmPickerButton.setDisabled(this.disabled);
},
localeChanged: function() {
this.is24HrMode = null, this.refresh();
},
is24HrModeChanged: function() {
this.refresh();
},
valueChanged: function() {
this.refresh();
},
updateHour: function(e, t) {
var n = t.selected.value;
if (!this.is24HrMode) {
var r = this.$.ampmPicker.getParent().controlAtIndex(0).content;
n = n + (n == 12 ? -12 : 0) + (this.isAm(r) ? 0 : 12);
}
return this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateMinute: function(e, t) {
return this.value = this.calcTime(this.value.getHours(), t.selected.value), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
updateAmPm: function(e, t) {
var n = this.value.getHours();
return this.is24HrMode || (n += n > 11 ? this.isAm(t.content) ? -12 : 0 : this.isAm(t.content) ? 0 : 12), this.value = this.calcTime(n, this.value.getMinutes()), this.doSelect({
name: this.name,
value: this.value
}), !0;
},
calcTime: function(e, t) {
return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), e, t, this.value.getSeconds(), this.value.getMilliseconds());
},
isAm: function(e) {
var t, n, r;
try {
t = this._tf.getAmCaption(), n = this._tf.getPmCaption();
} catch (i) {
t = "AM", n = "PM";
}
return e == t ? !0 : !1;
},
refresh: function() {
this.destroyClientControls(), this.initDefaults(), this.render();
}
});

// RadioButton.js

enyo.kind({
name: "onyx.RadioButton",
kind: "Button",
classes: "onyx-radiobutton"
});

// RadioGroup.js

enyo.kind({
name: "onyx.RadioGroup",
kind: "Group",
defaultKind: "onyx.RadioButton",
highlander: !0
});

// ToggleButton.js

enyo.kind({
name: "onyx.ToggleButton",
classes: "onyx-toggle-button",
published: {
active: !1,
value: !1,
onContent: "On",
offContent: "Off",
disabled: !1
},
events: {
onChange: ""
},
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
components: [ {
name: "contentOn",
classes: "onyx-toggle-content on"
}, {
name: "contentOff",
classes: "onyx-toggle-content off"
}, {
classes: "onyx-toggle-button-knob"
} ],
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active), this.onContentChanged(), this.offContentChanged(), this.disabledChanged();
},
rendered: function() {
this.inherited(arguments), this.updateVisualState();
},
updateVisualState: function() {
this.addRemoveClass("off", !this.value), this.$.contentOn.setShowing(this.value), this.$.contentOff.setShowing(!this.value), this.setActive(this.value);
},
valueChanged: function() {
this.updateVisualState(), this.doChange({
value: this.value
});
},
activeChanged: function() {
this.setValue(this.active), this.bubble("onActivate");
},
onContentChanged: function() {
this.$.contentOn.setContent(this.onContent || ""), this.$.contentOn.addRemoveClass("empty", !this.onContent);
},
offContentChanged: function() {
this.$.contentOff.setContent(this.offContent || ""), this.$.contentOff.addRemoveClass("empty", !this.onContent);
},
disabledChanged: function() {
this.addRemoveClass("disabled", this.disabled);
},
updateValue: function(e) {
this.disabled || this.setValue(e);
},
tap: function() {
this.updateValue(!this.value);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, this.dragged = !1, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = t.dx;
return Math.abs(n) > 10 && (this.updateValue(n > 0), this.dragged = !0), !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, this.dragged && t.preventTap();
}
});

// ToggleIconButton.js

enyo.kind({
name: "onyx.ToggleIconButton",
kind: "onyx.Icon",
published: {
active: !1,
value: !1
},
events: {
onChange: ""
},
classes: "onyx-icon-button onyx-icon-toggle",
activeChanged: function() {
this.addRemoveClass("active", this.value), this.bubble("onActivate");
},
updateValue: function(e) {
this.disabled || (this.setValue(e), this.doChange({
value: this.value
}));
},
tap: function() {
this.updateValue(!this.value);
},
valueChanged: function() {
this.setActive(this.value);
},
create: function() {
this.inherited(arguments), this.value = Boolean(this.value || this.active);
},
rendered: function() {
this.inherited(arguments), this.valueChanged(), this.removeClass("onyx-icon");
}
});

// Toolbar.js

enyo.kind({
name: "onyx.Toolbar",
classes: "onyx onyx-toolbar onyx-toolbar-inline",
create: function() {
this.inherited(arguments), this.hasClass("onyx-menu-toolbar") && enyo.platform.android >= 4 && this.applyStyle("position", "static");
}
});

// Tooltip.js

enyo.kind({
name: "onyx.Tooltip",
kind: "onyx.Popup",
classes: "onyx-tooltip below left-arrow",
autoDismiss: !1,
showDelay: 500,
defaultLeft: -6,
handlers: {
onRequestShowTooltip: "requestShow",
onRequestHideTooltip: "requestHide"
},
requestShow: function() {
return this.showJob = setTimeout(enyo.bind(this, "show"), this.showDelay), !0;
},
cancelShow: function() {
clearTimeout(this.showJob);
},
requestHide: function() {
return this.cancelShow(), this.inherited(arguments);
},
showingChanged: function() {
this.cancelShow(), this.adjustPosition(!0), this.inherited(arguments);
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
adjustPosition: function(e) {
if (this.showing && this.hasNode()) {
var t = this.node.getBoundingClientRect();
t.top + t.height > window.innerHeight ? (this.addRemoveClass("below", !1), this.addRemoveClass("above", !0)) : (this.addRemoveClass("above", !1), this.addRemoveClass("below", !0)), t.left + t.width > window.innerWidth && (this.applyPosition({
"margin-left": -t.width,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !1), this.addRemoveClass("right-arrow", !0));
}
},
resizeHandler: function() {
this.applyPosition({
"margin-left": this.defaultLeft,
bottom: "auto"
}), this.addRemoveClass("left-arrow", !0), this.addRemoveClass("right-arrow", !1), this.adjustPosition(!0), this.inherited(arguments);
}
});

// TooltipDecorator.js

enyo.kind({
name: "onyx.TooltipDecorator",
defaultKind: "onyx.Button",
classes: "onyx-popup-decorator",
handlers: {
onenter: "enter",
onleave: "leave"
},
enter: function() {
this.requestShowTooltip();
},
leave: function() {
this.requestHideTooltip();
},
tap: function() {
this.requestHideTooltip();
},
requestShowTooltip: function() {
this.waterfallDown("onRequestShowTooltip");
},
requestHideTooltip: function() {
this.waterfallDown("onRequestHideTooltip");
}
});

// ProgressBar.js

enyo.kind({
name: "onyx.ProgressBar",
classes: "onyx-progress-bar",
published: {
progress: 0,
min: 0,
max: 100,
barClasses: "",
showStripes: !0,
animateStripes: !0,
increment: 0
},
events: {
onAnimateProgressFinish: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar"
} ],
create: function() {
this.inherited(arguments), this.progressChanged(), this.barClassesChanged(), this.showStripesChanged(), this.animateStripesChanged();
},
barClassesChanged: function(e) {
this.$.bar.removeClass(e), this.$.bar.addClass(this.barClasses);
},
showStripesChanged: function() {
this.$.bar.addRemoveClass("striped", this.showStripes);
},
animateStripesChanged: function() {
this.$.bar.addRemoveClass("animated", this.animateStripes);
},
progressChanged: function() {
this.progress = this.clampValue(this.min, this.max, this.progress);
var e = this.calcPercent(this.progress);
this.updateBarPosition(e);
},
calcIncrement: function(e) {
return Math.round(e / this.increment) * this.increment;
},
clampValue: function(e, t, n) {
return Math.max(e, Math.min(n, t));
},
calcRatio: function(e) {
return (e - this.min) / (this.max - this.min);
},
calcPercent: function(e) {
return this.calcRatio(e) * 100;
},
updateBarPosition: function(e) {
this.$.bar.applyStyle("width", e + "%");
},
animateProgressTo: function(e) {
this.$.progressAnimator.play({
startValue: this.progress,
endValue: e,
node: this.hasNode()
});
},
progressAnimatorStep: function(e) {
return this.setProgress(e.value), !0;
},
progressAnimatorComplete: function(e) {
return this.doAnimateProgressFinish(e), !0;
}
});

// ProgressButton.js

enyo.kind({
name: "onyx.ProgressButton",
kind: "onyx.ProgressBar",
classes: "onyx-progress-button",
events: {
onCancel: ""
},
components: [ {
name: "progressAnimator",
kind: "Animator",
onStep: "progressAnimatorStep",
onEnd: "progressAnimatorComplete"
}, {
name: "bar",
classes: "onyx-progress-bar-bar onyx-progress-button-bar"
}, {
name: "client",
classes: "onyx-progress-button-client"
}, {
kind: "onyx.Icon",
src: "$lib/onyx/images/progress-button-cancel.png",
classes: "onyx-progress-button-icon",
ontap: "cancelTap"
} ],
cancelTap: function() {
this.doCancel();
}
});

// Scrim.js

enyo.kind({
name: "onyx.Scrim",
showing: !1,
classes: "onyx-scrim enyo-fit",
floating: !1,
create: function() {
this.inherited(arguments), this.zStack = [], this.floating && this.setParent(enyo.floatingLayer);
},
showingChanged: function() {
this.floating && this.showing && !this.hasNode() && this.render(), this.inherited(arguments);
},
addZIndex: function(e) {
enyo.indexOf(e, this.zStack) < 0 && this.zStack.push(e);
},
removeZIndex: function(e) {
enyo.remove(e, this.zStack);
},
showAtZIndex: function(e) {
this.addZIndex(e), e !== undefined && this.setZIndex(e), this.show();
},
hideAtZIndex: function(e) {
this.removeZIndex(e);
if (!this.zStack.length) this.hide(); else {
var t = this.zStack[this.zStack.length - 1];
this.setZIndex(t);
}
},
setZIndex: function(e) {
this.zIndex = e, this.applyStyle("z-index", e);
},
make: function() {
return this;
}
}), enyo.kind({
name: "onyx.scrimSingleton",
kind: null,
constructor: function(e, t) {
this.instanceName = e, enyo.setObject(this.instanceName, this), this.props = t || {};
},
make: function() {
var e = new onyx.Scrim(this.props);
return enyo.setObject(this.instanceName, e), e;
},
showAtZIndex: function(e) {
var t = this.make();
t.showAtZIndex(e);
},
hideAtZIndex: enyo.nop,
show: function() {
var e = this.make();
e.show();
}
}), new onyx.scrimSingleton("onyx.scrim", {
floating: !0,
classes: "onyx-scrim-translucent"
}), new onyx.scrimSingleton("onyx.scrimTransparent", {
floating: !0,
classes: "onyx-scrim-transparent"
});

// Slider.js

enyo.kind({
name: "onyx.Slider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
value: 0,
lockBar: !0,
tappable: !0
},
events: {
onChange: "",
onChanging: "",
onAnimateFinish: ""
},
showStripes: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish"
},
moreComponents: [ {
kind: "Animator",
onStep: "animatorStep",
onEnd: "animatorComplete"
}, {
classes: "onyx-slider-taparea"
}, {
name: "knob",
classes: "onyx-slider-knob"
} ],
create: function() {
this.inherited(arguments), enyo.platform.firefoxOS && (this.moreComponents[2].ondown = "down", this.moreComponents[2].onleave = "leave"), this.createComponents(this.moreComponents), this.valueChanged();
},
valueChanged: function() {
this.value = this.clampValue(this.min, this.max, this.value);
var e = this.calcPercent(this.value);
this.updateKnobPosition(e), this.lockBar && this.setProgress(this.value);
},
updateKnobPosition: function(e) {
this.$.knob.applyStyle("left", e + "%");
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.setValue(n), this.doChanging({
value: this.value
}), !0;
}
},
dragfinish: function(e, t) {
return this.dragging = !1, t.preventTap(), this.doChange({
value: this.value
}), !0;
},
tap: function(e, t) {
if (this.tappable) {
var n = this.calcKnobPosition(t);
return n = this.increment ? this.calcIncrement(n) : n, this.tapped = !0, this.animateTo(n), !0;
}
},
down: function(e, t) {
this.addClass("pressed");
},
leave: function(e, t) {
this.removeClass("pressed");
},
animateTo: function(e) {
this.$.animator.play({
startValue: this.value,
endValue: e,
node: this.hasNode()
});
},
animatorStep: function(e) {
return this.setValue(e.value), !0;
},
animatorComplete: function(e) {
return this.tapped && (this.tapped = !1, this.doChange({
value: this.value
})), this.doAnimateFinish(e), !0;
}
});

// RangeSlider.js

enyo.kind({
name: "onyx.RangeSlider",
kind: "onyx.ProgressBar",
classes: "onyx-slider",
published: {
rangeMin: 0,
rangeMax: 100,
rangeStart: 0,
rangeEnd: 100,
beginValue: 0,
endValue: 0
},
events: {
onChange: "",
onChanging: ""
},
showStripes: !1,
showLabels: !1,
handlers: {
ondragstart: "dragstart",
ondrag: "drag",
ondragfinish: "dragfinish",
ondown: "down"
},
moreComponents: [ {
name: "startKnob",
classes: "onyx-slider-knob"
}, {
name: "endKnob",
classes: "onyx-slider-knob onyx-range-slider-knob"
} ],
create: function() {
this.inherited(arguments), this.createComponents(this.moreComponents), this.initControls();
},
rendered: function() {
this.inherited(arguments);
var e = this.calcPercent(this.beginValue);
this.updateBarPosition(e);
},
initControls: function() {
this.$.bar.applyStyle("position", "relative"), this.refreshRangeSlider(), this.showLabels && (this.$.startKnob.createComponent({
name: "startLabel",
kind: "onyx.RangeSliderKnobLabel"
}), this.$.endKnob.createComponent({
name: "endLabel",
kind: "onyx.RangeSliderKnobLabel"
}));
},
refreshRangeSlider: function() {
this.beginValue = this.calcKnobPercent(this.rangeStart), this.endValue = this.calcKnobPercent(this.rangeEnd), this.beginValueChanged(), this.endValueChanged();
},
calcKnobRatio: function(e) {
return (e - this.rangeMin) / (this.rangeMax - this.rangeMin);
},
calcKnobPercent: function(e) {
return this.calcKnobRatio(e) * 100;
},
beginValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.beginValue);
this.updateKnobPosition(t, this.$.startKnob);
}
},
endValueChanged: function(e) {
if (e === undefined) {
var t = this.calcPercent(this.endValue);
this.updateKnobPosition(t, this.$.endKnob);
}
},
calcKnobPosition: function(e) {
var t = e.clientX - this.hasNode().getBoundingClientRect().left;
return t / this.getBounds().width * (this.max - this.min) + this.min;
},
updateKnobPosition: function(e, t) {
t.applyStyle("left", e + "%"), this.updateBarPosition();
},
updateBarPosition: function() {
if (this.$.startKnob !== undefined && this.$.endKnob !== undefined) {
var e = this.calcKnobPercent(this.rangeStart), t = this.calcKnobPercent(this.rangeEnd) - e;
this.$.bar.applyStyle("left", e + "%"), this.$.bar.applyStyle("width", t + "%");
}
},
calcRangeRatio: function(e) {
return e / 100 * (this.rangeMax - this.rangeMin) + this.rangeMin - this.increment / 2;
},
swapZIndex: function(e) {
e === "startKnob" ? (this.$.startKnob.applyStyle("z-index", 1), this.$.endKnob.applyStyle("z-index", 0)) : e === "endKnob" && (this.$.startKnob.applyStyle("z-index", 0), this.$.endKnob.applyStyle("z-index", 1));
},
down: function(e, t) {
this.swapZIndex(e.name);
},
dragstart: function(e, t) {
if (t.horizontal) return t.preventDefault(), this.dragging = !0, !0;
},
drag: function(e, t) {
if (this.dragging) {
var n = this.calcKnobPosition(t), r, i, s;
if (e.name === "startKnob" && n >= 0) {
if (!(n <= this.endValue && t.xDirection === -1 || n <= this.endValue)) return this.drag(this.$.endKnob, t);
this.setBeginValue(n), r = this.calcRangeRatio(this.beginValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.startKnob), this.setRangeStart(i), this.doChanging({
value: i
});
} else if (e.name === "endKnob" && n <= 100) {
if (!(n >= this.beginValue && t.xDirection === 1 || n >= this.beginValue)) return this.drag(this.$.startKnob, t);
this.setEndValue(n), r = this.calcRangeRatio(this.endValue), i = this.increment ? this.calcIncrement(r + .5 * this.increment) : r, s = this.calcKnobPercent(i), this.updateKnobPosition(s, this.$.endKnob), this.setRangeEnd(i), this.doChanging({
value: i
});
}
return !0;
}
},
dragfinish: function(e, t) {
this.dragging = !1, t.preventTap();
var n;
return e.name === "startKnob" ? (n = this.calcRangeRatio(this.beginValue), this.doChange({
value: n,
startChanged: !0
})) : e.name === "endKnob" && (n = this.calcRangeRatio(this.endValue), this.doChange({
value: n,
startChanged: !1
})), !0;
},
rangeMinChanged: function() {
this.refreshRangeSlider();
},
rangeMaxChanged: function() {
this.refreshRangeSlider();
},
rangeStartChanged: function() {
this.refreshRangeSlider();
},
rangeEndChanged: function() {
this.refreshRangeSlider();
},
setStartLabel: function(e) {
this.$.startKnob.waterfallDown("onSetLabel", e);
},
setEndLabel: function(e) {
this.$.endKnob.waterfallDown("onSetLabel", e);
}
}), enyo.kind({
name: "onyx.RangeSliderKnobLabel",
classes: "onyx-range-slider-label",
handlers: {
onSetLabel: "setLabel"
},
setLabel: function(e, t) {
this.setContent(t);
}
});

// Item.js

enyo.kind({
name: "onyx.Item",
classes: "onyx-item",
tapHighlight: !0,
handlers: {
onhold: "hold",
onrelease: "release"
},
hold: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !0, t);
},
release: function(e, t) {
this.tapHighlight && onyx.Item.addRemoveFlyweightClass(this.controlParent || this, "onyx-highlight", !1, t);
},
statics: {
addRemoveFlyweightClass: function(e, t, n, r, i) {
var s = r.flyweight;
if (s) {
var o = i !== undefined ? i : r.index;
s.performOnRow(o, function() {
e.addRemoveClass(t, n);
});
}
}
}
});

// Spinner.js

enyo.kind({
name: "onyx.Spinner",
classes: "onyx-spinner",
stop: function() {
this.setShowing(!1);
},
start: function() {
this.setShowing(!0);
},
toggle: function() {
this.setShowing(!this.getShowing());
}
});

// MoreToolbar.js

enyo.kind({
name: "onyx.MoreToolbar",
classes: "onyx-toolbar onyx-more-toolbar",
menuClass: "",
movedClass: "",
layoutKind: "FittableColumnsLayout",
noStretch: !0,
handlers: {
onHide: "reflow"
},
published: {
clientLayoutKind: "FittableColumnsLayout"
},
tools: [ {
name: "client",
noStretch: !0,
fit: !0,
classes: "onyx-toolbar-inline"
}, {
name: "nard",
kind: "onyx.MenuDecorator",
showing: !1,
onActivate: "activated",
components: [ {
kind: "onyx.IconButton",
classes: "onyx-more-button"
}, {
name: "menu",
kind: "onyx.Menu",
scrolling: !1,
classes: "onyx-more-menu"
} ]
} ],
initComponents: function() {
this.menuClass && this.menuClass.length > 0 && !this.$.menu.hasClass(this.menuClass) && this.$.menu.addClass(this.menuClass), this.createChrome(this.tools), this.inherited(arguments), this.$.client.setLayoutKind(this.clientLayoutKind);
},
clientLayoutKindChanged: function() {
this.$.client.setLayoutKind(this.clientLayoutKind);
},
reflow: function() {
this.inherited(arguments), this.isContentOverflowing() ? (this.$.nard.show(), this.popItem() && this.reflow()) : this.tryPushItem() ? this.reflow() : this.$.menu.children.length || (this.$.nard.hide(), this.$.menu.hide());
},
activated: function(e, t) {
this.addRemoveClass("active", t.originator.active);
},
popItem: function() {
var e = this.findCollapsibleItem();
if (e) {
this.movedClass && this.movedClass.length > 0 && !e.hasClass(this.movedClass) && e.addClass(this.movedClass), this.$.menu.addChild(e, null);
var t = this.$.menu.hasNode();
return t && e.hasNode() && e.insertNodeInParent(t), !0;
}
},
pushItem: function() {
var e = this.$.menu.children, t = e[0];
if (t) {
this.movedClass && this.movedClass.length > 0 && t.hasClass(this.movedClass) && t.removeClass(this.movedClass), this.$.client.addChild(t);
var n = this.$.client.hasNode();
if (n && t.hasNode()) {
var r, i;
for (var s = 0; s < this.$.client.children.length; s++) {
var o = this.$.client.children[s];
if (o.toolbarIndex !== undefined && o.toolbarIndex != s) {
r = o, i = s;
break;
}
}
if (r && r.hasNode()) {
t.insertNodeInParent(n, r.node);
var u = this.$.client.children.pop();
this.$.client.children.splice(i, 0, u);
} else t.appendNodeToParent(n);
}
return !0;
}
},
tryPushItem: function() {
if (this.pushItem()) {
if (!this.isContentOverflowing()) return !0;
this.popItem();
}
},
isContentOverflowing: function() {
if (this.$.client.hasNode()) {
var e = this.$.client.children, t = e[e.length - 1].hasNode();
if (t) return this.$.client.reflow(), t.offsetLeft + t.offsetWidth > this.$.client.node.clientWidth;
}
},
findCollapsibleItem: function() {
var e = this.$.client.children;
for (var t = e.length - 1; c = e[t]; t--) {
if (!c.unmoveable) return c;
c.toolbarIndex === undefined && (c.toolbarIndex = t);
}
}
});

// IntegerPicker.js

enyo.kind({
name: "onyx.IntegerPicker",
kind: "onyx.Picker",
published: {
value: 0,
min: 0,
max: 9
},
create: function() {
this.inherited(arguments), this.rangeChanged();
},
minChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
maxChanged: function() {
this.destroyClientControls(), this.rangeChanged(), this.render();
},
rangeChanged: function() {
for (var e = this.min; e <= this.max; e++) this.createComponent({
content: e,
active: e === this.value ? !0 : !1
});
},
valueChanged: function(e) {
var t = this.getClientControls(), n = t.length;
this.value = this.value >= this.min && this.value <= this.max ? this.value : this.min;
for (var r = 0; r < n; r++) if (this.value === parseInt(t[r].content)) {
this.setSelected(t[r]);
break;
}
},
selectedChanged: function(e) {
e && e.removeClass("selected"), this.selected && (this.selected.addClass("selected"), this.doChange({
selected: this.selected,
content: this.selected.content
})), this.value = parseInt(this.selected.content);
}
});

// ContextualPopup.js

enyo.kind({
name: "onyx.ContextualPopup",
kind: "enyo.Popup",
modal: !0,
autoDismiss: !0,
floating: !1,
classes: "onyx-contextual-popup enyo-unselectable",
published: {
maxHeight: 100,
scrolling: !0,
title: undefined,
actionButtons: []
},
vertFlushMargin: 60,
horizFlushMargin: 50,
widePopup: 200,
longPopup: 200,
horizBuffer: 16,
events: {
onTap: ""
},
handlers: {
onActivate: "itemActivated",
onRequestShowMenu: "requestShow",
onRequestHideMenu: "requestHide"
},
components: [ {
name: "title",
classes: "onyx-contextual-popup-title"
}, {
classes: "onyx-contextual-popup-scroller",
components: [ {
name: "client",
kind: "enyo.Scroller",
vertical: "auto",
classes: "enyo-unselectable",
thumb: !1,
strategyKind: "TouchScrollStrategy"
} ]
}, {
name: "actionButtons",
classes: "onyx-contextual-popup-action-buttons"
} ],
scrollerName: "client",
create: function() {
this.inherited(arguments), this.maxHeightChanged(), this.titleChanged(), this.actionButtonsChanged();
},
getScroller: function() {
return this.$[this.scrollerName];
},
titleChanged: function() {
this.$.title.setContent(this.title);
},
actionButtonsChanged: function() {
for (var e = 0; e < this.actionButtons.length; e++) this.$.actionButtons.createComponent({
kind: "onyx.Button",
content: this.actionButtons[e].content,
classes: this.actionButtons[e].classes + " onyx-contextual-popup-action-button",
name: this.actionButtons[e].name ? this.actionButtons[e].name : "ActionButton" + e,
index: e,
tap: enyo.bind(this, this.tapHandler)
});
},
tapHandler: function(e, t) {
return t.actionButton = !0, t.popup = this, this.bubble("ontap", t), !0;
},
maxHeightChanged: function() {
this.scrolling && this.getScroller().setMaxHeight(this.maxHeight + "px");
},
itemActivated: function(e, t) {
return t.originator.setActive(!1), !0;
},
showingChanged: function() {
this.inherited(arguments), this.scrolling && this.getScroller().setShowing(this.showing), this.adjustPosition();
},
requestShow: function(e, t) {
var n = t.activator.hasNode();
return n && (this.activatorOffset = this.getPageOffset(n)), this.show(), !0;
},
applyPosition: function(e) {
var t = "";
for (var n in e) t += n + ":" + e[n] + (isNaN(e[n]) ? "; " : "px; ");
this.addStyles(t);
},
getPageOffset: function(e) {
var t = this.getBoundingRect(e), n = window.pageYOffset === undefined ? document.documentElement.scrollTop : window.pageYOffset, r = window.pageXOffset === undefined ? document.documentElement.scrollLeft : window.pageXOffset, i = t.height === undefined ? t.bottom - t.top : t.height, s = t.width === undefined ? t.right - t.left : t.width;
return {
top: t.top + n,
left: t.left + r,
height: i,
width: s
};
},
adjustPosition: function() {
if (this.showing && this.hasNode()) {
this.resetPositioning();
var e = this.getViewWidth(), t = this.getViewHeight(), n = this.vertFlushMargin, r = t - this.vertFlushMargin, i = this.horizFlushMargin, s = e - this.horizFlushMargin;
if (this.activatorOffset.top + this.activatorOffset.height < n || this.activatorOffset.top > r) {
if (this.applyVerticalFlushPositioning(i, s)) return;
if (this.applyHorizontalFlushPositioning(i, s)) return;
if (this.applyVerticalPositioning()) return;
} else if (this.activatorOffset.left + this.activatorOffset.width < i || this.activatorOffset.left > s) if (this.applyHorizontalPositioning()) return;
var o = this.getBoundingRect(this.node);
if (o.width > this.widePopup) {
if (this.applyVerticalPositioning()) return;
} else if (o.height > this.longPopup && this.applyHorizontalPositioning()) return;
if (this.applyVerticalPositioning()) return;
if (this.applyHorizontalPositioning()) return;
}
},
initVerticalPositioning: function() {
this.resetPositioning(), this.addClass("vertical");
var e = this.getBoundingRect(this.node), t = this.getViewHeight();
return this.floating ? this.activatorOffset.top < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height,
bottom: "auto"
}), this.addClass("below")) : (this.applyPosition({
top: this.activatorOffset.top - e.height,
bottom: "auto"
}), this.addClass("above")) : e.top + e.height > t && t - e.bottom < e.top - e.height ? this.addClass("above") : this.addClass("below"), e = this.getBoundingRect(this.node), e.top + e.height > t || e.top < 0 ? !1 : !0;
},
applyVerticalPositioning: function() {
if (!this.initVerticalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
if (this.floating) {
var n = this.activatorOffset.left + this.activatorOffset.width / 2 - e.width / 2;
n + e.width > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.width
}), this.addClass("left")) : n < 0 ? (this.applyPosition({
left: this.activatorOffset.left
}), this.addClass("right")) : this.applyPosition({
left: n
});
} else {
var r = this.activatorOffset.left + this.activatorOffset.width / 2 - e.left - e.width / 2;
e.right + r > t ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width - e.right
}), this.addRemoveClass("left", !0)) : e.left + r < 0 ? this.addRemoveClass("right", !0) : this.applyPosition({
left: r
});
}
return !0;
},
applyVerticalFlushPositioning: function(e, t) {
if (!this.initVerticalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.activatorOffset.left + this.activatorOffset.width / 2 < e ? (this.activatorOffset.left + this.activatorOffset.width / 2 < this.horizBuffer ? this.applyPosition({
left: this.horizBuffer + (this.floating ? 0 : -n.left)
}) : this.applyPosition({
left: this.activatorOffset.width / 2 + (this.floating ? this.activatorOffset.left : 0)
}), this.addClass("right"), this.addClass("corner"), !0) : this.activatorOffset.left + this.activatorOffset.width / 2 > t ? (this.activatorOffset.left + this.activatorOffset.width / 2 > r - this.horizBuffer ? this.applyPosition({
left: r - this.horizBuffer - n.right
}) : this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width / 2 - n.right
}), this.addClass("left"), this.addClass("corner"), !0) : !1;
},
initHorizontalPositioning: function() {
this.resetPositioning();
var e = this.getBoundingRect(this.node), t = this.getViewWidth();
return this.floating ? this.activatorOffset.left + this.activatorOffset.width < t / 2 ? (this.applyPosition({
left: this.activatorOffset.left + this.activatorOffset.width
}), this.addRemoveClass("left", !0)) : (this.applyPosition({
left: this.activatorOffset.left - e.width
}), this.addRemoveClass("right", !0)) : this.activatorOffset.left - e.width > 0 ? (this.applyPosition({
left: this.activatorOffset.left - e.left - e.width
}), this.addRemoveClass("right", !0)) : (this.applyPosition({
left: this.activatorOffset.width
}), this.addRemoveClass("left", !0)), this.addRemoveClass("horizontal", !0), e = this.getBoundingRect(this.node), e.left < 0 || e.left + e.width > t ? !1 : !0;
},
applyHorizontalPositioning: function() {
if (!this.initHorizontalPositioning()) return !1;
var e = this.getBoundingRect(this.node), t = this.getViewHeight(), n = this.activatorOffset.top + this.activatorOffset.height / 2;
return this.floating ? n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - e.height / 2,
bottom: "auto"
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: this.activatorOffset.top - this.activatorOffset.height,
bottom: "auto"
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top - e.height + this.activatorOffset.height * 2,
bottom: "auto"
}), this.addRemoveClass("low", !0)) : n >= t / 2 - .05 * t && n <= t / 2 + .05 * t ? this.applyPosition({
top: (this.activatorOffset.height - e.height) / 2
}) : this.activatorOffset.top + this.activatorOffset.height < t / 2 ? (this.applyPosition({
top: -this.activatorOffset.height
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: e.top - e.height - this.activatorOffset.top + this.activatorOffset.height
}), this.addRemoveClass("low", !0)), !0;
},
applyHorizontalFlushPositioning: function(e, t) {
if (!this.initHorizontalPositioning()) return !1;
var n = this.getBoundingRect(this.node), r = this.getViewWidth();
return this.floating ? this.activatorOffset.top < innerHeight / 2 ? (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)) : (this.applyPosition({
top: this.activatorOffset.top + this.activatorOffset.height / 2 - n.height
}), this.addRemoveClass("low", !0)) : n.top + n.height > innerHeight && innerHeight - n.bottom < n.top - n.height ? (this.applyPosition({
top: n.top - n.height - this.activatorOffset.top - this.activatorOffset.height / 2
}), this.addRemoveClass("low", !0)) : (this.applyPosition({
top: this.activatorOffset.height / 2
}), this.addRemoveClass("high", !0)), this.activatorOffset.left + this.activatorOffset.width < e ? (this.addClass("left"), this.addClass("corner"), !0) : this.activatorOffset.left > t ? (this.addClass("right"), this.addClass("corner"), !0) : !1;
},
getBoundingRect: function(e) {
var t = e.getBoundingClientRect();
return !t.width || !t.height ? {
left: t.left,
right: t.right,
top: t.top,
bottom: t.bottom,
width: t.right - t.left,
height: t.bottom - t.top
} : t;
},
getViewHeight: function() {
return window.innerHeight === undefined ? document.documentElement.clientHeight : window.innerHeight;
},
getViewWidth: function() {
return window.innerWidth === undefined ? document.documentElement.clientWidth : window.innerWidth;
},
resetPositioning: function() {
this.removeClass("right"), this.removeClass("left"), this.removeClass("high"), this.removeClass("low"), this.removeClass("corner"), this.removeClass("below"), this.removeClass("above"), this.removeClass("vertical"), this.removeClass("horizontal"), this.applyPosition({
left: "auto"
}), this.applyPosition({
top: "auto"
});
},
resizeHandler: function() {
this.inherited(arguments), this.adjustPosition();
},
requestHide: function() {
this.setShowing(!1);
}
});

// PortsHeader.js

enyo.kind({
name: "PortsHeader",
kind: "onyx.Toolbar",
classes: "ports-header",
title: "WebOS Ports Header",
taglines: [ "Random Tagline Here." ],
components: [ {
kind: "Image",
src: "icon.png",
style: "height: 100%; margin: 0;"
}, {
tag: "div",
style: "height: 100%; margin: 0 0 0 8px;",
components: [ {
name: "Title",
content: "",
style: "vertical-align: top; margin: 0; font-size: 21px;"
}, {
name: "Tagline",
content: "",
style: "display: block; margin: 0; font-size: 13px;"
} ]
} ],
rendered: function() {
this.inherited(arguments), this.$.Title.setContent(this.title), this.$.Tagline.setContent(this.taglines[Math.floor(Math.random() * this.taglines.length)]);
}
});

// PortsSearch.js

enyo.kind({
name: "PortsSearch",
kind: "PortsHeader",
title: "WebOS Ports Search",
taglines: [ "Shiny search button, PRESS IT!" ],
events: {
onSearch: ""
},
components: [ {
name: "SearchAnimator",
kind: "Animator",
onStep: "animatorStep",
onStop: "animatorStop"
}, {
name: "Icon",
kind: "Image",
src: "icon.png",
style: "height: 100%; margin: 0;"
}, {
name: "TextDiv",
tag: "div",
style: "height: 100%; margin: 0;",
components: [ {
name: "Title",
content: "",
style: "vertical-align: top; margin: 0; font-size: 21px;"
}, {
name: "Tagline",
content: "",
style: "display: block; margin: 0; font-size: 13px;"
} ]
}, {
name: "SearchDecorator",
kind: "onyx.InputDecorator",
style: "position: absolute; top: 10px; right: 8px; width: 32px; padding: 2px 4px 3px 3px; max-width: 100%; float: right",
components: [ {
name: "SearchInput",
id: "searchBox",
kind: "onyx.Input",
selectOnFocus: !1,
style: "width: 0;",
oninput: "inputChanged",
onblur: "closeSearch"
}, {
kind: "Image",
src: "$lib/webos-ports-lib/assets/search-input-search.png",
style: "width: 24px; height: 24px;",
onmousedown: "openSearch"
} ]
} ],
openSearch: function(e, t) {
this.$.SearchAnimator.setStartValue(0), this.$.SearchAnimator.setEndValue(1), this.$.SearchAnimator.play();
},
closeSearch: function(e, t) {
this.$.SearchInput.selectOnFocus = !0, this.$.SearchAnimator.setStartValue(1), this.$.SearchAnimator.setEndValue(0), this.$.SearchAnimator.play();
},
animatorStep: function(e, t) {
if (1 - e.value < 25e-5) return;
this.$.SearchInput.applyStyle("width", this.hasNode().offsetWidth * e.value - 52 + "px"), this.$.SearchDecorator.applyStyle("width", this.$.SearchInput.hasNode().offsetWidth + 32 + "px"), this.$.Icon.applyStyle("opacity", 1 - e.value), this.$.TextDiv.applyStyle("opacity", 1 - e.value), this.$.SearchAnimator.getStartValue() == 0 && this.$.SearchInput.focus();
},
animatorStop: function(e, t) {},
inputChanged: function(e, t) {
this.doSearch({
value: this.$.SearchInput.getValue()
});
},
searchActive: function() {
return this.$.SearchInput.getValue() != "";
}
});

// BackGesture.js

(function() {
document.addEventListener("keyup", function(e) {
(e.keyIdentifier == "U+1200001" || e.keyIdentifier == "U+001B") && enyo.Signals && enyo.Signals.send && enyo.Signals.send("onbackbutton");
}, !1);
})();

// CoreNavi.js

enyo.kind({
name: "CoreNavi",
style: "background-color: black;",
layoutKind: "FittableColumnsLayout",
fingerTracking: !1,
components: [ {
style: "width: 33%;"
}, {
kind: "Image",
src: "$lib/webos-ports-lib/assets/lightbar.png",
fit: !0,
style: "width: 33%; height: 24px; padding-top: 2px;",
ondragstart: "handleDragStart",
ondrag: "handleDrag",
ondragfinish: "handleDragFinish"
}, {
style: "width: 33%;"
} ],
create: function() {
this.inherited(arguments), window.PalmSystem && this.addStyles("display: none;");
},
handleDragStart: function(e, t) {
this.fingerTracking == 0 ? t.xDirection == -1 && (evB = document.createEvent("HTMLEvents"), evB.initEvent("keyup", "true", "true"), evB.keyIdentifier = "U+1200001", document.dispatchEvent(evB)) : enyo.Signals && enyo.Signals.send && enyo.Signals.send("onCoreNaviDragStart", t);
},
handleDrag: function(e, t) {
this.fingerTracking == 1 && enyo.Signals && enyo.Signals.send && enyo.Signals.send("onCoreNaviDrag", t);
},
handleDragFinish: function(e, t) {
this.fingerTracking == 1 && enyo.Signals && enyo.Signals.send && enyo.Signals.send("onCoreNaviDragFinish", t);
}
});

// CoreNaviArranger.js

enyo.kind({
name: "enyo.CoreNaviArranger",
kind: "Arranger",
layoutClass: "enyo-arranger enyo-arranger-fit",
calcArrangementDifference: function(e, t, n, r) {
return this.containerBounds.width * .5;
},
destroy: function() {
var e = this.container.children;
for (var t = 0, n; n = e[t]; t++) this.pushPopControl(n, 0, 1), n.setShowing(!0), n.resized();
this.inherited(arguments);
},
arrange: function(e, t) {
for (var n = 0, r, i, s; r = e[n]; n++) {
s = n == 0 ? 1 : 0;
switch (n) {
case 0:
i = 1;
break;
case 1:
i = .66;
break;
case e.length - 1:
i = 1.33;
}
this.arrangeControl(r, {
scale: i,
opacity: s
});
}
},
start: function() {
this.inherited(arguments);
var e = this.container.children;
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.fromIndex || t == this.container.toIndex), n.showing && n.resized();
this.vendor || (this.vendor = this.getVendor());
},
finish: function() {
this.inherited(arguments);
var e = this.container.children;
for (var t = 0, n; n = e[t]; t++) n.setShowing(t == this.container.toIndex);
},
flowControl: function(e, t) {
enyo.Arranger.positionControl(e, t);
var n = t.scale, r = t.opacity;
n != null && r != null && this.pushPopControl(e, n, r);
},
pushPopControl: function(e, t, n) {
var r = t, i = n;
enyo.dom.canAccelerate ? e.applyStyle(this.vendor + "transform", "scale3d(" + r + "," + r + ",1)") : e.applyStyle(this.vendor + "transform", "scale(" + r + "," + r + ")"), enyo.Arranger.opacifyControl(e, n);
},
getVendor: function() {
var e = "", t = [ "transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform" ], n = document.createElement("div");
for (i = 0; i < t.length; i++) {
if (typeof n.style[t[i]] != "undefined") {
e = t[i];
break;
}
e = null;
}
switch (e) {
case "transform":
e = "";
break;
case "WebkitTransform":
e = "-webkit-";
break;
case "MozTransform":
e = "-moz-";
break;
case "OTransform":
e = "-o-";
break;
case "msTransform":
e = "-ms-";
}
return e;
}
});

// ProgressOrb.js

enyo.kind({
name: "Pie",
published: {
angle: 0
},
style: "width: 90%; height: 90%;",
components: [ {
name: "PieBackground",
tag: "div",
classes: "pie pie-background"
}, {
name: "LeftMask",
classes: "pie",
components: [ {
name: "PieLeftHalf",
classes: "pie pie-foreground"
} ]
}, {
name: "RightMask",
classes: "pie",
components: [ {
name: "PieRightHalf",
classes: "pie pie-foreground"
} ]
} ],
rendered: function() {
this.setupClipping(), this.applyRotation();
},
angleChanged: function() {
this.applyRotation();
},
setupClipping: function() {
var e = this.hasNode().clientWidth;
this.$.LeftMask.addStyles("clip: rect(0, " + e / 2 + "px, " + e + "px, 0);"), this.$.PieLeftHalf.addStyles("clip: rect(0," + e / 2 + "px" + "," + e + "px" + ",0);"), this.$.RightMask.addStyles("clip: rect(0," + e + "px" + "," + e + "px" + "," + e / 2 + "px" + ");"), this.$.PieRightHalf.addStyles("clip: rect(0," + e + "px" + "," + e + "px" + "," + e / 2 + "px" + ");");
},
applyRotation: function() {
this.$.PieRightHalf.addStyles("-webkit-transform: rotateZ(" + Math.min(this.angle - 180, 0) + "deg);"), this.$.PieLeftHalf.addStyles("-webkit-transform: rotateZ(" + Math.max(this.angle, 180) + "deg);");
}
}), enyo.kind({
name: "ProgressOrb",
fit: !0,
published: {
value: 0,
min: 0,
max: 1e3
},
style: "position: absolute; width: 48px; height: 48px;",
events: {
onButtonTap: ""
},
components: [ {
name: "ProgressAnimator",
kind: "Animator",
duration: 500,
onStep: "animatorStep"
}, {
name: "OuterRing",
style: "width: 90%; height: 90%; padding: 5%; background-color: #000; border-radius: 50%;",
components: [ {
name: "Pie",
kind: "Pie",
style: "position: absolute;"
}, {
name: "CenterButton",
kind: "onyx.Button",
classes: "onyx-toolbar",
style: "position: absolute; width:65%; height: 65%; margin: 12.5%; padding: 0; border-radius: 50%;",
ontap: "buttonTapped"
} ]
} ],
rendered: function() {
this.inherited(arguments), this.$.CenterButton.applyStyle("font-size", this.$.CenterButton.hasNode().clientHeight / 2 + "px"), this.$.CenterButton.setContent(this.content);
},
buttonTapped: function() {
this.doButtonTap();
},
valueChanged: function() {
var e = this.$.ProgressAnimator.value;
this.$.ProgressAnimator.setStartValue(e != undefined ? e : 0), this.$.ProgressAnimator.setEndValue(this.value), this.$.ProgressAnimator.play();
},
animatorStep: function(e) {
var t = 0, n = 1, r = this.max, i = this.min, s = r - i, o = n - t, u = o * (e.value - i) / s + t, u = Math.max(Math.min(u, n), t), a = 360 * u;
this.$.Pie.setAngle(a);
}
});

// src/grid.js

GridSampler = {}, GridSampler.checkAndNudgePoints = function(e, t) {
var n = qrcode.width, r = qrcode.height, i = !0;
for (var s = 0; s < t.Length && i; s += 2) {
var o = Math.floor(t[s]), u = Math.floor(t[s + 1]);
if (o < -1 || o > n || u < -1 || u > r) throw "Error.checkAndNudgePoints ";
i = !1, o == -1 ? (t[s] = 0, i = !0) : o == n && (t[s] = n - 1, i = !0), u == -1 ? (t[s + 1] = 0, i = !0) : u == r && (t[s + 1] = r - 1, i = !0);
}
i = !0;
for (var s = t.Length - 2; s >= 0 && i; s -= 2) {
var o = Math.floor(t[s]), u = Math.floor(t[s + 1]);
if (o < -1 || o > n || u < -1 || u > r) throw "Error.checkAndNudgePoints ";
i = !1, o == -1 ? (t[s] = 0, i = !0) : o == n && (t[s] = n - 1, i = !0), u == -1 ? (t[s + 1] = 0, i = !0) : u == r && (t[s + 1] = r - 1, i = !0);
}
}, GridSampler.sampleGrid3 = function(e, t, n) {
var r = new BitMatrix(t), i = new Array(t << 1);
for (var s = 0; s < t; s++) {
var o = i.length, u = s + .5;
for (var a = 0; a < o; a += 2) i[a] = (a >> 1) + .5, i[a + 1] = u;
n.transformPoints1(i), GridSampler.checkAndNudgePoints(e, i);
try {
for (var a = 0; a < o; a += 2) {
var f = Math.floor(i[a]) * 4 + Math.floor(i[a + 1]) * qrcode.width * 4, l = e[Math.floor(i[a]) + qrcode.width * Math.floor(i[a + 1])];
qrcode.imagedata.data[f] = l ? 255 : 0, qrcode.imagedata.data[f + 1] = l ? 255 : 0, qrcode.imagedata.data[f + 2] = 0, qrcode.imagedata.data[f + 3] = 255, l && r.set_Renamed(a >> 1, s);
}
} catch (c) {
throw "Error.checkAndNudgePoints";
}
}
return r;
}, GridSampler.sampleGridx = function(e, t, n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g) {
var y = PerspectiveTransform.quadrilateralToQuadrilateral(n, r, i, s, o, u, a, f, l, c, h, p, d, v, m, g);
return GridSampler.sampleGrid3(e, t, y);
};

// src/version.js

function ECB(e, t) {
this.count = e, this.dataCodewords = t, this.__defineGetter__("Count", function() {
return this.count;
}), this.__defineGetter__("DataCodewords", function() {
return this.dataCodewords;
});
}

function ECBlocks(e, t, n) {
this.ecCodewordsPerBlock = e, n ? this.ecBlocks = new Array(t, n) : this.ecBlocks = new Array(t), this.__defineGetter__("ECCodewordsPerBlock", function() {
return this.ecCodewordsPerBlock;
}), this.__defineGetter__("TotalECCodewords", function() {
return this.ecCodewordsPerBlock * this.NumBlocks;
}), this.__defineGetter__("NumBlocks", function() {
var e = 0;
for (var t = 0; t < this.ecBlocks.length; t++) e += this.ecBlocks[t].length;
return e;
}), this.getECBlocks = function() {
return this.ecBlocks;
};
}

function Version(e, t, n, r, i, s) {
this.versionNumber = e, this.alignmentPatternCenters = t, this.ecBlocks = new Array(n, r, i, s);
var o = 0, u = n.ECCodewordsPerBlock, a = n.getECBlocks();
for (var f = 0; f < a.length; f++) {
var l = a[f];
o += l.Count * (l.DataCodewords + u);
}
this.totalCodewords = o, this.__defineGetter__("VersionNumber", function() {
return this.versionNumber;
}), this.__defineGetter__("AlignmentPatternCenters", function() {
return this.alignmentPatternCenters;
}), this.__defineGetter__("TotalCodewords", function() {
return this.totalCodewords;
}), this.__defineGetter__("DimensionForVersion", function() {
return 17 + 4 * this.versionNumber;
}), this.buildFunctionPattern = function() {
var e = this.DimensionForVersion, t = new BitMatrix(e);
t.setRegion(0, 0, 9, 9), t.setRegion(e - 8, 0, 8, 9), t.setRegion(0, e - 8, 9, 8);
var n = this.alignmentPatternCenters.length;
for (var r = 0; r < n; r++) {
var i = this.alignmentPatternCenters[r] - 2;
for (var s = 0; s < n; s++) {
if (r == 0 && (s == 0 || s == n - 1) || r == n - 1 && s == 0) continue;
t.setRegion(this.alignmentPatternCenters[s] - 2, i, 5, 5);
}
}
return t.setRegion(6, 9, 1, e - 17), t.setRegion(9, 6, e - 17, 1), this.versionNumber > 6 && (t.setRegion(e - 11, 0, 3, 6), t.setRegion(0, e - 11, 6, 3)), t;
}, this.getECBlocksForLevel = function(e) {
return this.ecBlocks[e.ordinal()];
};
}

function buildVersions() {
return new Array(new Version(1, new Array, new ECBlocks(7, new ECB(1, 19)), new ECBlocks(10, new ECB(1, 16)), new ECBlocks(13, new ECB(1, 13)), new ECBlocks(17, new ECB(1, 9))), new Version(2, new Array(6, 18), new ECBlocks(10, new ECB(1, 34)), new ECBlocks(16, new ECB(1, 28)), new ECBlocks(22, new ECB(1, 22)), new ECBlocks(28, new ECB(1, 16))), new Version(3, new Array(6, 22), new ECBlocks(15, new ECB(1, 55)), new ECBlocks(26, new ECB(1, 44)), new ECBlocks(18, new ECB(2, 17)), new ECBlocks(22, new ECB(2, 13))), new Version(4, new Array(6, 26), new ECBlocks(20, new ECB(1, 80)), new ECBlocks(18, new ECB(2, 32)), new ECBlocks(26, new ECB(2, 24)), new ECBlocks(16, new ECB(4, 9))), new Version(5, new Array(6, 30), new ECBlocks(26, new ECB(1, 108)), new ECBlocks(24, new ECB(2, 43)), new ECBlocks(18, new ECB(2, 15), new ECB(2, 16)), new ECBlocks(22, new ECB(2, 11), new ECB(2, 12))), new Version(6, new Array(6, 34), new ECBlocks(18, new ECB(2, 68)), new ECBlocks(16, new ECB(4, 27)), new ECBlocks(24, new ECB(4, 19)), new ECBlocks(28, new ECB(4, 15))), new Version(7, new Array(6, 22, 38), new ECBlocks(20, new ECB(2, 78)), new ECBlocks(18, new ECB(4, 31)), new ECBlocks(18, new ECB(2, 14), new ECB(4, 15)), new ECBlocks(26, new ECB(4, 13), new ECB(1, 14))), new Version(8, new Array(6, 24, 42), new ECBlocks(24, new ECB(2, 97)), new ECBlocks(22, new ECB(2, 38), new ECB(2, 39)), new ECBlocks(22, new ECB(4, 18), new ECB(2, 19)), new ECBlocks(26, new ECB(4, 14), new ECB(2, 15))), new Version(9, new Array(6, 26, 46), new ECBlocks(30, new ECB(2, 116)), new ECBlocks(22, new ECB(3, 36), new ECB(2, 37)), new ECBlocks(20, new ECB(4, 16), new ECB(4, 17)), new ECBlocks(24, new ECB(4, 12), new ECB(4, 13))), new Version(10, new Array(6, 28, 50), new ECBlocks(18, new ECB(2, 68), new ECB(2, 69)), new ECBlocks(26, new ECB(4, 43), new ECB(1, 44)), new ECBlocks(24, new ECB(6, 19), new ECB(2, 20)), new ECBlocks(28, new ECB(6, 15), new ECB(2, 16))), new Version(11, new Array(6, 30, 54), new ECBlocks(20, new ECB(4, 81)), new ECBlocks(30, new ECB(1, 50), new ECB(4, 51)), new ECBlocks(28, new ECB(4, 22), new ECB(4, 23)), new ECBlocks(24, new ECB(3, 12), new ECB(8, 13))), new Version(12, new Array(6, 32, 58), new ECBlocks(24, new ECB(2, 92), new ECB(2, 93)), new ECBlocks(22, new ECB(6, 36), new ECB(2, 37)), new ECBlocks(26, new ECB(4, 20), new ECB(6, 21)), new ECBlocks(28, new ECB(7, 14), new ECB(4, 15))), new Version(13, new Array(6, 34, 62), new ECBlocks(26, new ECB(4, 107)), new ECBlocks(22, new ECB(8, 37), new ECB(1, 38)), new ECBlocks(24, new ECB(8, 20), new ECB(4, 21)), new ECBlocks(22, new ECB(12, 11), new ECB(4, 12))), new Version(14, new Array(6, 26, 46, 66), new ECBlocks(30, new ECB(3, 115), new ECB(1, 116)), new ECBlocks(24, new ECB(4, 40), new ECB(5, 41)), new ECBlocks(20, new ECB(11, 16), new ECB(5, 17)), new ECBlocks(24, new ECB(11, 12), new ECB(5, 13))), new Version(15, new Array(6, 26, 48, 70), new ECBlocks(22, new ECB(5, 87), new ECB(1, 88)), new ECBlocks(24, new ECB(5, 41), new ECB(5, 42)), new ECBlocks(30, new ECB(5, 24), new ECB(7, 25)), new ECBlocks(24, new ECB(11, 12), new ECB(7, 13))), new Version(16, new Array(6, 26, 50, 74), new ECBlocks(24, new ECB(5, 98), new ECB(1, 99)), new ECBlocks(28, new ECB(7, 45), new ECB(3, 46)), new ECBlocks(24, new ECB(15, 19), new ECB(2, 20)), new ECBlocks(30, new ECB(3, 15), new ECB(13, 16))), new Version(17, new Array(6, 30, 54, 78), new ECBlocks(28, new ECB(1, 107), new ECB(5, 108)), new ECBlocks(28, new ECB(10, 46), new ECB(1, 47)), new ECBlocks(28, new ECB(1, 22), new ECB(15, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(17, 15))), new Version(18, new Array(6, 30, 56, 82), new ECBlocks(30, new ECB(5, 120), new ECB(1, 121)), new ECBlocks(26, new ECB(9, 43), new ECB(4, 44)), new ECBlocks(28, new ECB(17, 22), new ECB(1, 23)), new ECBlocks(28, new ECB(2, 14), new ECB(19, 15))), new Version(19, new Array(6, 30, 58, 86), new ECBlocks(28, new ECB(3, 113), new ECB(4, 114)), new ECBlocks(26, new ECB(3, 44), new ECB(11, 45)), new ECBlocks(26, new ECB(17, 21), new ECB(4, 22)), new ECBlocks(26, new ECB(9, 13), new ECB(16, 14))), new Version(20, new Array(6, 34, 62, 90), new ECBlocks(28, new ECB(3, 107), new ECB(5, 108)), new ECBlocks(26, new ECB(3, 41), new ECB(13, 42)), new ECBlocks(30, new ECB(15, 24), new ECB(5, 25)), new ECBlocks(28, new ECB(15, 15), new ECB(10, 16))), new Version(21, new Array(6, 28, 50, 72, 94), new ECBlocks(28, new ECB(4, 116), new ECB(4, 117)), new ECBlocks(26, new ECB(17, 42)), new ECBlocks(28, new ECB(17, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(19, 16), new ECB(6, 17))), new Version(22, new Array(6, 26, 50, 74, 98), new ECBlocks(28, new ECB(2, 111), new ECB(7, 112)), new ECBlocks(28, new ECB(17, 46)), new ECBlocks(30, new ECB(7, 24), new ECB(16, 25)), new ECBlocks(24, new ECB(34, 13))), new Version(23, new Array(6, 30, 54, 74, 102), new ECBlocks(30, new ECB(4, 121), new ECB(5, 122)), new ECBlocks(28, new ECB(4, 47), new ECB(14, 48)), new ECBlocks(30, new ECB(11, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(16, 15), new ECB(14, 16))), new Version(24, new Array(6, 28, 54, 80, 106), new ECBlocks(30, new ECB(6, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(6, 45), new ECB(14, 46)), new ECBlocks(30, new ECB(11, 24), new ECB(16, 25)), new ECBlocks(30, new ECB(30, 16), new ECB(2, 17))), new Version(25, new Array(6, 32, 58, 84, 110), new ECBlocks(26, new ECB(8, 106), new ECB(4, 107)), new ECBlocks(28, new ECB(8, 47), new ECB(13, 48)), new ECBlocks(30, new ECB(7, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(13, 16))), new Version(26, new Array(6, 30, 58, 86, 114), new ECBlocks(28, new ECB(10, 114), new ECB(2, 115)), new ECBlocks(28, new ECB(19, 46), new ECB(4, 47)), new ECBlocks(28, new ECB(28, 22), new ECB(6, 23)), new ECBlocks(30, new ECB(33, 16), new ECB(4, 17))), new Version(27, new Array(6, 34, 62, 90, 118), new ECBlocks(30, new ECB(8, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(22, 45), new ECB(3, 46)), new ECBlocks(30, new ECB(8, 23), new ECB(26, 24)), new ECBlocks(30, new ECB(12, 15), new ECB(28, 16))), new Version(28, new Array(6, 26, 50, 74, 98, 122), new ECBlocks(30, new ECB(3, 117), new ECB(10, 118)), new ECBlocks(28, new ECB(3, 45), new ECB(23, 46)), new ECBlocks(30, new ECB(4, 24), new ECB(31, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(31, 16))), new Version(29, new Array(6, 30, 54, 78, 102, 126), new ECBlocks(30, new ECB(7, 116), new ECB(7, 117)), new ECBlocks(28, new ECB(21, 45), new ECB(7, 46)), new ECBlocks(30, new ECB(1, 23), new ECB(37, 24)), new ECBlocks(30, new ECB(19, 15), new ECB(26, 16))), new Version(30, new Array(6, 26, 52, 78, 104, 130), new ECBlocks(30, new ECB(5, 115), new ECB(10, 116)), new ECBlocks(28, new ECB(19, 47), new ECB(10, 48)), new ECBlocks(30, new ECB(15, 24), new ECB(25, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(25, 16))), new Version(31, new Array(6, 30, 56, 82, 108, 134), new ECBlocks(30, new ECB(13, 115), new ECB(3, 116)), new ECBlocks(28, new ECB(2, 46), new ECB(29, 47)), new ECBlocks(30, new ECB(42, 24), new ECB(1, 25)), new ECBlocks(30, new ECB(23, 15), new ECB(28, 16))), new Version(32, new Array(6, 34, 60, 86, 112, 138), new ECBlocks(30, new ECB(17, 115)), new ECBlocks(28, new ECB(10, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(10, 24), new ECB(35, 25)), new ECBlocks(30, new ECB(19, 15), new ECB(35, 16))), new Version(33, new Array(6, 30, 58, 86, 114, 142), new ECBlocks(30, new ECB(17, 115), new ECB(1, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(21, 47)), new ECBlocks(30, new ECB(29, 24), new ECB(19, 25)), new ECBlocks(30, new ECB(11, 15), new ECB(46, 16))), new Version(34, new Array(6, 34, 62, 90, 118, 146), new ECBlocks(30, new ECB(13, 115), new ECB(6, 116)), new ECBlocks(28, new ECB(14, 46), new ECB(23, 47)), new ECBlocks(30, new ECB(44, 24), new ECB(7, 25)), new ECBlocks(30, new ECB(59, 16), new ECB(1, 17))), new Version(35, new Array(6, 30, 54, 78, 102, 126, 150), new ECBlocks(30, new ECB(12, 121), new ECB(7, 122)), new ECBlocks(28, new ECB(12, 47), new ECB(26, 48)), new ECBlocks(30, new ECB(39, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(22, 15), new ECB(41, 16))), new Version(36, new Array(6, 24, 50, 76, 102, 128, 154), new ECBlocks(30, new ECB(6, 121), new ECB(14, 122)), new ECBlocks(28, new ECB(6, 47), new ECB(34, 48)), new ECBlocks(30, new ECB(46, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(2, 15), new ECB(64, 16))), new Version(37, new Array(6, 28, 54, 80, 106, 132, 158), new ECBlocks(30, new ECB(17, 122), new ECB(4, 123)), new ECBlocks(28, new ECB(29, 46), new ECB(14, 47)), new ECBlocks(30, new ECB(49, 24), new ECB(10, 25)), new ECBlocks(30, new ECB(24, 15), new ECB(46, 16))), new Version(38, new Array(6, 32, 58, 84, 110, 136, 162), new ECBlocks(30, new ECB(4, 122), new ECB(18, 123)), new ECBlocks(28, new ECB(13, 46), new ECB(32, 47)), new ECBlocks(30, new ECB(48, 24), new ECB(14, 25)), new ECBlocks(30, new ECB(42, 15), new ECB(32, 16))), new Version(39, new Array(6, 26, 54, 82, 110, 138, 166), new ECBlocks(30, new ECB(20, 117), new ECB(4, 118)), new ECBlocks(28, new ECB(40, 47), new ECB(7, 48)), new ECBlocks(30, new ECB(43, 24), new ECB(22, 25)), new ECBlocks(30, new ECB(10, 15), new ECB(67, 16))), new Version(40, new Array(6, 30, 58, 86, 114, 142, 170), new ECBlocks(30, new ECB(19, 118), new ECB(6, 119)), new ECBlocks(28, new ECB(18, 47), new ECB(31, 48)), new ECBlocks(30, new ECB(34, 24), new ECB(34, 25)), new ECBlocks(30, new ECB(20, 15), new ECB(61, 16))));
}

Version.VERSION_DECODE_INFO = new Array(31892, 34236, 39577, 42195, 48118, 51042, 55367, 58893, 63784, 68472, 70749, 76311, 79154, 84390, 87683, 92361, 96236, 102084, 102881, 110507, 110734, 117786, 119615, 126325, 127568, 133589, 136944, 141498, 145311, 150283, 152622, 158308, 161089, 167017), Version.VERSIONS = buildVersions(), Version.getVersionForNumber = function(e) {
if (e < 1 || e > 40) throw "ArgumentException";
return Version.VERSIONS[e - 1];
}, Version.getProvisionalVersionForDimension = function(e) {
if (e % 4 != 1) throw "Error getProvisionalVersionForDimension";
try {
return Version.getVersionForNumber(e - 17 >> 2);
} catch (t) {
throw "Error getVersionForNumber";
}
}, Version.decodeVersionInformation = function(e) {
var t = 4294967295, n = 0;
for (var r = 0; r < Version.VERSION_DECODE_INFO.length; r++) {
var i = Version.VERSION_DECODE_INFO[r];
if (i == e) return this.getVersionForNumber(r + 7);
var s = FormatInformation.numBitsDiffering(e, i);
s < t && (n = r + 7, t = s);
}
return t <= 3 ? this.getVersionForNumber(n) : null;
};

// src/detector.js

function PerspectiveTransform(e, t, n, r, i, s, o, u, a) {
this.a11 = e, this.a12 = r, this.a13 = o, this.a21 = t, this.a22 = i, this.a23 = u, this.a31 = n, this.a32 = s, this.a33 = a, this.transformPoints1 = function(e) {
var t = e.length, n = this.a11, r = this.a12, i = this.a13, s = this.a21, o = this.a22, u = this.a23, a = this.a31, f = this.a32, l = this.a33;
for (var c = 0; c < t; c += 2) {
var h = e[c], p = e[c + 1], d = i * h + u * p + l;
e[c] = (n * h + s * p + a) / d, e[c + 1] = (r * h + o * p + f) / d;
}
}, this.transformPoints2 = function(e, t) {
var n = e.length;
for (var r = 0; r < n; r++) {
var i = e[r], s = t[r], o = this.a13 * i + this.a23 * s + this.a33;
e[r] = (this.a11 * i + this.a21 * s + this.a31) / o, t[r] = (this.a12 * i + this.a22 * s + this.a32) / o;
}
}, this.buildAdjoint = function() {
return new PerspectiveTransform(this.a22 * this.a33 - this.a23 * this.a32, this.a23 * this.a31 - this.a21 * this.a33, this.a21 * this.a32 - this.a22 * this.a31, this.a13 * this.a32 - this.a12 * this.a33, this.a11 * this.a33 - this.a13 * this.a31, this.a12 * this.a31 - this.a11 * this.a32, this.a12 * this.a23 - this.a13 * this.a22, this.a13 * this.a21 - this.a11 * this.a23, this.a11 * this.a22 - this.a12 * this.a21);
}, this.times = function(e) {
return new PerspectiveTransform(this.a11 * e.a11 + this.a21 * e.a12 + this.a31 * e.a13, this.a11 * e.a21 + this.a21 * e.a22 + this.a31 * e.a23, this.a11 * e.a31 + this.a21 * e.a32 + this.a31 * e.a33, this.a12 * e.a11 + this.a22 * e.a12 + this.a32 * e.a13, this.a12 * e.a21 + this.a22 * e.a22 + this.a32 * e.a23, this.a12 * e.a31 + this.a22 * e.a32 + this.a32 * e.a33, this.a13 * e.a11 + this.a23 * e.a12 + this.a33 * e.a13, this.a13 * e.a21 + this.a23 * e.a22 + this.a33 * e.a23, this.a13 * e.a31 + this.a23 * e.a32 + this.a33 * e.a33);
};
}

function DetectorResult(e, t) {
this.bits = e, this.points = t;
}

function Detector(e) {
this.image = e, this.resultPointCallback = null, this.sizeOfBlackWhiteBlackRun = function(e, t, n, r) {
var i = Math.abs(r - t) > Math.abs(n - e);
if (i) {
var s = e;
e = t, t = s, s = n, n = r, r = s;
}
var o = Math.abs(n - e), u = Math.abs(r - t), a = -o >> 1, f = t < r ? 1 : -1, l = e < n ? 1 : -1, c = 0;
for (var h = e, p = t; h != n; h += l) {
var d = i ? p : h, v = i ? h : p;
c == 1 ? this.image[d + v * qrcode.width] && c++ : this.image[d + v * qrcode.width] || c++;
if (c == 3) {
var m = h - e, g = p - t;
return Math.sqrt(m * m + g * g);
}
a += u;
if (a > 0) {
if (p == r) break;
p += f, a -= o;
}
}
var y = n - e, b = r - t;
return Math.sqrt(y * y + b * b);
}, this.sizeOfBlackWhiteBlackRunBothWays = function(e, t, n, r) {
var i = this.sizeOfBlackWhiteBlackRun(e, t, n, r), s = 1, o = e - (n - e);
o < 0 ? (s = e / (e - o), o = 0) : o >= qrcode.width && (s = (qrcode.width - 1 - e) / (o - e), o = qrcode.width - 1);
var u = Math.floor(t - (r - t) * s);
return s = 1, u < 0 ? (s = t / (t - u), u = 0) : u >= qrcode.height && (s = (qrcode.height - 1 - t) / (u - t), u = qrcode.height - 1), o = Math.floor(e + (o - e) * s), i += this.sizeOfBlackWhiteBlackRun(e, t, o, u), i - 1;
}, this.calculateModuleSizeOneWay = function(e, t) {
var n = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(e.X), Math.floor(e.Y), Math.floor(t.X), Math.floor(t.Y)), r = this.sizeOfBlackWhiteBlackRunBothWays(Math.floor(t.X), Math.floor(t.Y), Math.floor(e.X), Math.floor(e.Y));
return isNaN(n) ? r / 7 : isNaN(r) ? n / 7 : (n + r) / 14;
}, this.calculateModuleSize = function(e, t, n) {
return (this.calculateModuleSizeOneWay(e, t) + this.calculateModuleSizeOneWay(e, n)) / 2;
}, this.distance = function(e, t) {
return xDiff = e.X - t.X, yDiff = e.Y - t.Y, Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}, this.computeDimension = function(e, t, n, r) {
var i = Math.round(this.distance(e, t) / r), s = Math.round(this.distance(e, n) / r), o = (i + s >> 1) + 7;
switch (o & 3) {
case 0:
o++;
break;
case 2:
o--;
break;
case 3:
throw "Error";
}
return o;
}, this.findAlignmentInRegion = function(e, t, n, r) {
var i = Math.floor(r * e), s = Math.max(0, t - i), o = Math.min(qrcode.width - 1, t + i);
if (o - s < e * 3) throw "Error";
var u = Math.max(0, n - i), a = Math.min(qrcode.height - 1, n + i), f = new AlignmentPatternFinder(this.image, s, u, o - s, a - u, e, this.resultPointCallback);
return f.find();
}, this.createTransform = function(e, t, n, r, i) {
var s = i - 3.5, o, u, a, f;
r != null ? (o = r.X, u = r.Y, a = f = s - 3) : (o = t.X - e.X + n.X, u = t.Y - e.Y + n.Y, a = f = s);
var l = PerspectiveTransform.quadrilateralToQuadrilateral(3.5, 3.5, s, 3.5, a, f, 3.5, s, e.X, e.Y, t.X, t.Y, o, u, n.X, n.Y);
return l;
}, this.sampleGrid = function(e, t, n) {
var r = GridSampler;
return r.sampleGrid3(e, n, t);
}, this.processFinderPatternInfo = function(e) {
var t = e.TopLeft, n = e.TopRight, r = e.BottomLeft, i = this.calculateModuleSize(t, n, r);
if (i < 1) throw "Error";
var s = this.computeDimension(t, n, r, i), o = Version.getProvisionalVersionForDimension(s), u = o.DimensionForVersion - 7, a = null;
if (o.AlignmentPatternCenters.length > 0) {
var f = n.X - t.X + r.X, l = n.Y - t.Y + r.Y, c = 1 - 3 / u, h = Math.floor(t.X + c * (f - t.X)), p = Math.floor(t.Y + c * (l - t.Y));
for (var d = 4; d <= 16; d <<= 1) {
a = this.findAlignmentInRegion(i, h, p, d);
break;
}
}
var v = this.createTransform(t, n, r, a, s), m = this.sampleGrid(this.image, v, s), g;
return a == null ? g = new Array(r, t, n) : g = new Array(r, t, n, a), new DetectorResult(m, g);
}, this.detect = function() {
var e = (new FinderPatternFinder).findFinderPattern(this.image);
return this.processFinderPatternInfo(e);
};
}

PerspectiveTransform.quadrilateralToQuadrilateral = function(e, t, n, r, i, s, o, u, a, f, l, c, h, p, d, v) {
var m = this.quadrilateralToSquare(e, t, n, r, i, s, o, u), g = this.squareToQuadrilateral(a, f, l, c, h, p, d, v);
return g.times(m);
}, PerspectiveTransform.squareToQuadrilateral = function(e, t, n, r, i, s, o, u) {
return dy2 = u - s, dy3 = t - r + s - u, dy2 == 0 && dy3 == 0 ? new PerspectiveTransform(n - e, i - n, e, r - t, s - r, t, 0, 0, 1) : (dx1 = n - i, dx2 = o - i, dx3 = e - n + i - o, dy1 = r - s, denominator = dx1 * dy2 - dx2 * dy1, a13 = (dx3 * dy2 - dx2 * dy3) / denominator, a23 = (dx1 * dy3 - dx3 * dy1) / denominator, new PerspectiveTransform(n - e + a13 * n, o - e + a23 * o, e, r - t + a13 * r, u - t + a23 * u, t, a13, a23, 1));
}, PerspectiveTransform.quadrilateralToSquare = function(e, t, n, r, i, s, o, u) {
return this.squareToQuadrilateral(e, t, n, r, i, s, o, u).buildAdjoint();
};

// src/formatinf.js

function FormatInformation(e) {
this.errorCorrectionLevel = ErrorCorrectionLevel.forBits(e >> 3 & 3), this.dataMask = e & 7, this.__defineGetter__("ErrorCorrectionLevel", function() {
return this.errorCorrectionLevel;
}), this.__defineGetter__("DataMask", function() {
return this.dataMask;
}), this.GetHashCode = function() {
return this.errorCorrectionLevel.ordinal() << 3 | dataMask;
}, this.Equals = function(e) {
var t = e;
return this.errorCorrectionLevel == t.errorCorrectionLevel && this.dataMask == t.dataMask;
};
}

var FORMAT_INFO_MASK_QR = 21522, FORMAT_INFO_DECODE_LOOKUP = new Array(new Array(21522, 0), new Array(20773, 1), new Array(24188, 2), new Array(23371, 3), new Array(17913, 4), new Array(16590, 5), new Array(20375, 6), new Array(19104, 7), new Array(30660, 8), new Array(29427, 9), new Array(32170, 10), new Array(30877, 11), new Array(26159, 12), new Array(25368, 13), new Array(27713, 14), new Array(26998, 15), new Array(5769, 16), new Array(5054, 17), new Array(7399, 18), new Array(6608, 19), new Array(1890, 20), new Array(597, 21), new Array(3340, 22), new Array(2107, 23), new Array(13663, 24), new Array(12392, 25), new Array(16177, 26), new Array(14854, 27), new Array(9396, 28), new Array(8579, 29), new Array(11994, 30), new Array(11245, 31)), BITS_SET_IN_HALF_BYTE = new Array(0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4);

FormatInformation.numBitsDiffering = function(e, t) {
return e ^= t, BITS_SET_IN_HALF_BYTE[e & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 4) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 8) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 12) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 16) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 20) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 24) & 15] + BITS_SET_IN_HALF_BYTE[URShift(e, 28) & 15];
}, FormatInformation.decodeFormatInformation = function(e) {
var t = FormatInformation.doDecodeFormatInformation(e);
return t != null ? t : FormatInformation.doDecodeFormatInformation(e ^ FORMAT_INFO_MASK_QR);
}, FormatInformation.doDecodeFormatInformation = function(e) {
var t = 4294967295, n = 0;
for (var r = 0; r < FORMAT_INFO_DECODE_LOOKUP.length; r++) {
var i = FORMAT_INFO_DECODE_LOOKUP[r], s = i[0];
if (s == e) return new FormatInformation(i[1]);
var o = this.numBitsDiffering(e, s);
o < t && (n = i[1], t = o);
}
return t <= 3 ? new FormatInformation(n) : null;
};

// src/errorlevel.js

function ErrorCorrectionLevel(e, t, n) {
this.ordinal_Renamed_Field = e, this.bits = t, this.name = n, this.__defineGetter__("Bits", function() {
return this.bits;
}), this.__defineGetter__("Name", function() {
return this.name;
}), this.ordinal = function() {
return this.ordinal_Renamed_Field;
};
}

ErrorCorrectionLevel.forBits = function(e) {
if (e < 0 || e >= FOR_BITS.Length) throw "ArgumentException";
return FOR_BITS[e];
};

var L = new ErrorCorrectionLevel(0, 1, "L"), M = new ErrorCorrectionLevel(1, 0, "M"), Q = new ErrorCorrectionLevel(2, 3, "Q"), H = new ErrorCorrectionLevel(3, 2, "H"), FOR_BITS = new Array(M, L, H, Q);

// src/bitmat.js

function BitMatrix(e, t) {
t || (t = e);
if (e < 1 || t < 1) throw "Both dimensions must be greater than 0";
this.width = e, this.height = t;
var n = e >> 5;
(e & 31) != 0 && n++, this.rowSize = n, this.bits = new Array(n * t);
for (var r = 0; r < this.bits.length; r++) this.bits[r] = 0;
this.__defineGetter__("Width", function() {
return this.width;
}), this.__defineGetter__("Height", function() {
return this.height;
}), this.__defineGetter__("Dimension", function() {
if (this.width != this.height) throw "Can't call getDimension() on a non-square matrix";
return this.width;
}), this.get_Renamed = function(e, t) {
var n = t * this.rowSize + (e >> 5);
return (URShift(this.bits[n], e & 31) & 1) != 0;
}, this.set_Renamed = function(e, t) {
var n = t * this.rowSize + (e >> 5);
this.bits[n] |= 1 << (e & 31);
}, this.flip = function(e, t) {
var n = t * this.rowSize + (e >> 5);
this.bits[n] ^= 1 << (e & 31);
}, this.clear = function() {
var e = this.bits.length;
for (var t = 0; t < e; t++) this.bits[t] = 0;
}, this.setRegion = function(e, t, n, r) {
if (t < 0 || e < 0) throw "Left and top must be nonnegative";
if (r < 1 || n < 1) throw "Height and width must be at least 1";
var i = e + n, s = t + r;
if (s > this.height || i > this.width) throw "The region must fit inside the matrix";
for (var o = t; o < s; o++) {
var u = o * this.rowSize;
for (var a = e; a < i; a++) this.bits[u + (a >> 5)] |= 1 << (a & 31);
}
};
}

// src/datablock.js

function DataBlock(e, t) {
this.numDataCodewords = e, this.codewords = t, this.__defineGetter__("NumDataCodewords", function() {
return this.numDataCodewords;
}), this.__defineGetter__("Codewords", function() {
return this.codewords;
});
}

DataBlock.getDataBlocks = function(e, t, n) {
if (e.length != t.TotalCodewords) throw "ArgumentException";
var r = t.getECBlocksForLevel(n), i = 0, s = r.getECBlocks();
for (var o = 0; o < s.length; o++) i += s[o].Count;
var u = new Array(i), a = 0;
for (var f = 0; f < s.length; f++) {
var l = s[f];
for (var o = 0; o < l.Count; o++) {
var c = l.DataCodewords, h = r.ECCodewordsPerBlock + c;
u[a++] = new DataBlock(c, new Array(h));
}
}
var p = u[0].codewords.length, d = u.length - 1;
while (d >= 0) {
var v = u[d].codewords.length;
if (v == p) break;
d--;
}
d++;
var m = p - r.ECCodewordsPerBlock, g = 0;
for (var o = 0; o < m; o++) for (var f = 0; f < a; f++) u[f].codewords[o] = e[g++];
for (var f = d; f < a; f++) u[f].codewords[m] = e[g++];
var y = u[0].codewords.length;
for (var o = m; o < y; o++) for (var f = 0; f < a; f++) {
var b = f < d ? o : o + 1;
u[f].codewords[b] = e[g++];
}
return u;
};

// src/bmparser.js

function BitMatrixParser(e) {
var t = e.Dimension;
if (t < 21 || (t & 3) != 1) throw "Error BitMatrixParser";
this.bitMatrix = e, this.parsedVersion = null, this.parsedFormatInfo = null, this.copyBit = function(e, t, n) {
return this.bitMatrix.get_Renamed(e, t) ? n << 1 | 1 : n << 1;
}, this.readFormatInformation = function() {
if (this.parsedFormatInfo != null) return this.parsedFormatInfo;
var e = 0;
for (var t = 0; t < 6; t++) e = this.copyBit(t, 8, e);
e = this.copyBit(7, 8, e), e = this.copyBit(8, 8, e), e = this.copyBit(8, 7, e);
for (var n = 5; n >= 0; n--) e = this.copyBit(8, n, e);
this.parsedFormatInfo = FormatInformation.decodeFormatInformation(e);
if (this.parsedFormatInfo != null) return this.parsedFormatInfo;
var r = this.bitMatrix.Dimension;
e = 0;
var i = r - 8;
for (var t = r - 1; t >= i; t--) e = this.copyBit(t, 8, e);
for (var n = r - 7; n < r; n++) e = this.copyBit(8, n, e);
this.parsedFormatInfo = FormatInformation.decodeFormatInformation(e);
if (this.parsedFormatInfo != null) return this.parsedFormatInfo;
throw "Error readFormatInformation";
}, this.readVersion = function() {
if (this.parsedVersion != null) return this.parsedVersion;
var e = this.bitMatrix.Dimension, t = e - 17 >> 2;
if (t <= 6) return Version.getVersionForNumber(t);
var n = 0, r = e - 11;
for (var i = 5; i >= 0; i--) for (var s = e - 9; s >= r; s--) n = this.copyBit(s, i, n);
this.parsedVersion = Version.decodeVersionInformation(n);
if (this.parsedVersion != null && this.parsedVersion.DimensionForVersion == e) return this.parsedVersion;
n = 0;
for (var s = 5; s >= 0; s--) for (var i = e - 9; i >= r; i--) n = this.copyBit(s, i, n);
this.parsedVersion = Version.decodeVersionInformation(n);
if (this.parsedVersion != null && this.parsedVersion.DimensionForVersion == e) return this.parsedVersion;
throw "Error readVersion";
}, this.readCodewords = function() {
var e = this.readFormatInformation(), t = this.readVersion(), n = DataMask.forReference(e.DataMask), r = this.bitMatrix.Dimension;
n.unmaskBitMatrix(this.bitMatrix, r);
var i = t.buildFunctionPattern(), s = !0, o = new Array(t.TotalCodewords), u = 0, a = 0, f = 0;
for (var l = r - 1; l > 0; l -= 2) {
l == 6 && l--;
for (var c = 0; c < r; c++) {
var h = s ? r - 1 - c : c;
for (var p = 0; p < 2; p++) i.get_Renamed(l - p, h) || (f++, a <<= 1, this.bitMatrix.get_Renamed(l - p, h) && (a |= 1), f == 8 && (o[u++] = a, f = 0, a = 0));
}
s ^= !0;
}
if (u != t.TotalCodewords) throw "Error readCodewords";
return o;
};
}

// src/datamask.js

function DataMask000() {
this.unmaskBitMatrix = function(e, t) {
for (var n = 0; n < t; n++) for (var r = 0; r < t; r++) this.isMasked(n, r) && e.flip(r, n);
}, this.isMasked = function(e, t) {
return (e + t & 1) == 0;
};
}

function DataMask001() {
this.unmaskBitMatrix = function(e, t) {
for (var n = 0; n < t; n++) for (var r = 0; r < t; r++) this.isMasked(n, r) && e.flip(r, n);
}, this.isMasked = function(e, t) {
return (e & 1) == 0;
};
}

function DataMask010() {
this.unmaskBitMatrix = function(e, t) {
for (var n = 0; n < t; n++) for (var r = 0; r < t; r++) this.isMasked(n, r) && e.flip(r, n);
}, this.isMasked = function(e, t) {
return t % 3 == 0;
};
}

function DataMask011() {
this.unmaskBitMatrix = function(e, t) {
for (var n = 0; n < t; n++) for (var r = 0; r < t; r++) this.isMasked(n, r) && e.flip(r, n);
}, this.isMasked = function(e, t) {
return (e + t) % 3 == 0;
};
}

function DataMask100() {
this.unmaskBitMatrix = function(e, t) {
for (var n = 0; n < t; n++) for (var r = 0; r < t; r++) this.isMasked(n, r) && e.flip(r, n);
}, this.isMasked = function(e, t) {
return (URShift(e, 1) + t / 3 & 1) == 0;
};
}

function DataMask101() {
this.unmaskBitMatrix = function(e, t) {
for (var n = 0; n < t; n++) for (var r = 0; r < t; r++) this.isMasked(n, r) && e.flip(r, n);
}, this.isMasked = function(e, t) {
var n = e * t;
return (n & 1) + n % 3 == 0;
};
}

function DataMask110() {
this.unmaskBitMatrix = function(e, t) {
for (var n = 0; n < t; n++) for (var r = 0; r < t; r++) this.isMasked(n, r) && e.flip(r, n);
}, this.isMasked = function(e, t) {
var n = e * t;
return ((n & 1) + n % 3 & 1) == 0;
};
}

function DataMask111() {
this.unmaskBitMatrix = function(e, t) {
for (var n = 0; n < t; n++) for (var r = 0; r < t; r++) this.isMasked(n, r) && e.flip(r, n);
}, this.isMasked = function(e, t) {
return ((e + t & 1) + e * t % 3 & 1) == 0;
};
}

DataMask = {}, DataMask.forReference = function(e) {
if (e < 0 || e > 7) throw "System.ArgumentException";
return DataMask.DATA_MASKS[e];
}, DataMask.DATA_MASKS = new Array(new DataMask000, new DataMask001, new DataMask010, new DataMask011, new DataMask100, new DataMask101, new DataMask110, new DataMask111);

// src/rsdecoder.js

function ReedSolomonDecoder(e) {
this.field = e, this.decode = function(e, t) {
var n = new GF256Poly(this.field, e), r = new Array(t);
for (var i = 0; i < r.length; i++) r[i] = 0;
var s = !1, o = !0;
for (var i = 0; i < t; i++) {
var u = n.evaluateAt(this.field.exp(s ? i + 1 : i));
r[r.length - 1 - i] = u, u != 0 && (o = !1);
}
if (o) return;
var a = new GF256Poly(this.field, r), f = this.runEuclideanAlgorithm(this.field.buildMonomial(t, 1), a, t), l = f[0], c = f[1], h = this.findErrorLocations(l), p = this.findErrorMagnitudes(c, h, s);
for (var i = 0; i < h.length; i++) {
var d = e.length - 1 - this.field.log(h[i]);
if (d < 0) throw "ReedSolomonException Bad error location";
e[d] = GF256.addOrSubtract(e[d], p[i]);
}
}, this.runEuclideanAlgorithm = function(e, t, n) {
if (e.Degree < t.Degree) {
var r = e;
e = t, t = r;
}
var i = e, s = t, o = this.field.One, u = this.field.Zero, a = this.field.Zero, f = this.field.One;
while (s.Degree >= Math.floor(n / 2)) {
var l = i, c = o, h = a;
i = s, o = u, a = f;
if (i.Zero) throw "r_{i-1} was zero";
s = l;
var p = this.field.Zero, d = i.getCoefficient(i.Degree), v = this.field.inverse(d);
while (s.Degree >= i.Degree && !s.Zero) {
var m = s.Degree - i.Degree, g = this.field.multiply(s.getCoefficient(s.Degree), v);
p = p.addOrSubtract(this.field.buildMonomial(m, g)), s = s.addOrSubtract(i.multiplyByMonomial(m, g));
}
u = p.multiply1(o).addOrSubtract(c), f = p.multiply1(a).addOrSubtract(h);
}
var y = f.getCoefficient(0);
if (y == 0) throw "ReedSolomonException sigmaTilde(0) was zero";
var b = this.field.inverse(y), w = f.multiply2(b), E = s.multiply2(b);
return new Array(w, E);
}, this.findErrorLocations = function(e) {
var t = e.Degree;
if (t == 1) return new Array(e.getCoefficient(1));
var n = new Array(t), r = 0;
for (var i = 1; i < 256 && r < t; i++) e.evaluateAt(i) == 0 && (n[r] = this.field.inverse(i), r++);
if (r != t) throw "Error locator degree does not match number of roots";
return n;
}, this.findErrorMagnitudes = function(e, t, n) {
var r = t.length, i = new Array(r);
for (var s = 0; s < r; s++) {
var o = this.field.inverse(t[s]), u = 1;
for (var a = 0; a < r; a++) s != a && (u = this.field.multiply(u, GF256.addOrSubtract(1, this.field.multiply(t[a], o))));
i[s] = this.field.multiply(e.evaluateAt(o), this.field.inverse(u)), n && (i[s] = this.field.multiply(i[s], o));
}
return i;
};
}

// src/gf256poly.js

function GF256Poly(e, t) {
if (t == null || t.length == 0) throw "System.ArgumentException";
this.field = e;
var n = t.length;
if (n > 1 && t[0] == 0) {
var r = 1;
while (r < n && t[r] == 0) r++;
if (r == n) this.coefficients = e.Zero.coefficients; else {
this.coefficients = new Array(n - r);
for (var i = 0; i < this.coefficients.length; i++) this.coefficients[i] = 0;
for (var s = 0; s < this.coefficients.length; s++) this.coefficients[s] = t[r + s];
}
} else this.coefficients = t;
this.__defineGetter__("Zero", function() {
return this.coefficients[0] == 0;
}), this.__defineGetter__("Degree", function() {
return this.coefficients.length - 1;
}), this.__defineGetter__("Coefficients", function() {
return this.coefficients;
}), this.getCoefficient = function(e) {
return this.coefficients[this.coefficients.length - 1 - e];
}, this.evaluateAt = function(e) {
if (e == 0) return this.getCoefficient(0);
var t = this.coefficients.length;
if (e == 1) {
var n = 0;
for (var r = 0; r < t; r++) n = GF256.addOrSubtract(n, this.coefficients[r]);
return n;
}
var i = this.coefficients[0];
for (var r = 1; r < t; r++) i = GF256.addOrSubtract(this.field.multiply(e, i), this.coefficients[r]);
return i;
}, this.addOrSubtract = function(t) {
if (this.field != t.field) throw "GF256Polys do not have same GF256 field";
if (this.Zero) return t;
if (t.Zero) return this;
var n = this.coefficients, r = t.coefficients;
if (n.length > r.length) {
var i = n;
n = r, r = i;
}
var s = new Array(r.length), o = r.length - n.length;
for (var u = 0; u < o; u++) s[u] = r[u];
for (var a = o; a < r.length; a++) s[a] = GF256.addOrSubtract(n[a - o], r[a]);
return new GF256Poly(e, s);
}, this.multiply1 = function(e) {
if (this.field != e.field) throw "GF256Polys do not have same GF256 field";
if (this.Zero || e.Zero) return this.field.Zero;
var t = this.coefficients, n = t.length, r = e.coefficients, i = r.length, s = new Array(n + i - 1);
for (var o = 0; o < n; o++) {
var u = t[o];
for (var a = 0; a < i; a++) s[o + a] = GF256.addOrSubtract(s[o + a], this.field.multiply(u, r[a]));
}
return new GF256Poly(this.field, s);
}, this.multiply2 = function(e) {
if (e == 0) return this.field.Zero;
if (e == 1) return this;
var t = this.coefficients.length, n = new Array(t);
for (var r = 0; r < t; r++) n[r] = this.field.multiply(this.coefficients[r], e);
return new GF256Poly(this.field, n);
}, this.multiplyByMonomial = function(e, t) {
if (e < 0) throw "System.ArgumentException";
if (t == 0) return this.field.Zero;
var n = this.coefficients.length, r = new Array(n + e);
for (var i = 0; i < r.length; i++) r[i] = 0;
for (var i = 0; i < n; i++) r[i] = this.field.multiply(this.coefficients[i], t);
return new GF256Poly(this.field, r);
}, this.divide = function(e) {
if (this.field != e.field) throw "GF256Polys do not have same GF256 field";
if (e.Zero) throw "Divide by 0";
var t = this.field.Zero, n = this, r = e.getCoefficient(e.Degree), i = this.field.inverse(r);
while (n.Degree >= e.Degree && !n.Zero) {
var s = n.Degree - e.Degree, o = this.field.multiply(n.getCoefficient(n.Degree), i), u = e.multiplyByMonomial(s, o), a = this.field.buildMonomial(s, o);
t = t.addOrSubtract(a), n = n.addOrSubtract(u);
}
return new Array(t, n);
};
}

// src/gf256.js

function GF256(e) {
this.expTable = new Array(256), this.logTable = new Array(256);
var t = 1;
for (var n = 0; n < 256; n++) this.expTable[n] = t, t <<= 1, t >= 256 && (t ^= e);
for (var n = 0; n < 255; n++) this.logTable[this.expTable[n]] = n;
var r = new Array(1);
r[0] = 0, this.zero = new GF256Poly(this, new Array(r));
var i = new Array(1);
i[0] = 1, this.one = new GF256Poly(this, new Array(i)), this.__defineGetter__("Zero", function() {
return this.zero;
}), this.__defineGetter__("One", function() {
return this.one;
}), this.buildMonomial = function(e, t) {
if (e < 0) throw "System.ArgumentException";
if (t == 0) return zero;
var n = new Array(e + 1);
for (var r = 0; r < n.length; r++) n[r] = 0;
return n[0] = t, new GF256Poly(this, n);
}, this.exp = function(e) {
return this.expTable[e];
}, this.log = function(e) {
if (e == 0) throw "System.ArgumentException";
return this.logTable[e];
}, this.inverse = function(e) {
if (e == 0) throw "System.ArithmeticException";
return this.expTable[255 - this.logTable[e]];
}, this.multiply = function(e, t) {
return e == 0 || t == 0 ? 0 : e == 1 ? t : t == 1 ? e : this.expTable[(this.logTable[e] + this.logTable[t]) % 255];
};
}

GF256.QR_CODE_FIELD = new GF256(285), GF256.DATA_MATRIX_FIELD = new GF256(301), GF256.addOrSubtract = function(e, t) {
return e ^ t;
};

// src/decoder.js

Decoder = {}, Decoder.rsDecoder = new ReedSolomonDecoder(GF256.QR_CODE_FIELD), Decoder.correctErrors = function(e, t) {
var n = e.length, r = new Array(n);
for (var i = 0; i < n; i++) r[i] = e[i] & 255;
var s = e.length - t;
try {
Decoder.rsDecoder.decode(r, s);
} catch (o) {
throw o;
}
for (var i = 0; i < t; i++) e[i] = r[i];
}, Decoder.decode = function(e) {
var t = new BitMatrixParser(e), n = t.readVersion(), r = t.readFormatInformation().ErrorCorrectionLevel, i = t.readCodewords(), s = DataBlock.getDataBlocks(i, n, r), o = 0;
for (var u = 0; u < s.Length; u++) o += s[u].NumDataCodewords;
var a = new Array(o), f = 0;
for (var l = 0; l < s.length; l++) {
var c = s[l], h = c.Codewords, p = c.NumDataCodewords;
Decoder.correctErrors(h, p);
for (var u = 0; u < p; u++) a[f++] = h[u];
}
var d = new QRCodeDataBlockReader(a, n.VersionNumber, r.Bits);
return d;
};

// src/qrcode.js

function URShift(e, t) {
return e >= 0 ? e >> t : (e >> t) + (2 << ~t);
}

qrcode = {}, qrcode.imagedata = null, qrcode.width = 0, qrcode.height = 0, qrcode.qrCodeSymbol = null, qrcode.debug = !1, qrcode.sizeOfDataLengthInfo = [ [ 10, 9, 8, 8 ], [ 12, 11, 16, 10 ], [ 14, 13, 16, 12 ] ], qrcode.callback = null, qrcode.decode = function(e) {
if (arguments.length == 0) {
var t = document.getElementById("qr-canvas"), n = t.getContext("2d");
return qrcode.width = t.width, qrcode.height = t.height, qrcode.imagedata = n.getImageData(0, 0, qrcode.width, qrcode.height), qrcode.result = qrcode.process(n), qrcode.callback != null && qrcode.callback(qrcode.result), qrcode.result;
}
var r = new Image;
r.onload = function() {
var e = document.createElement("canvas"), t = e.getContext("2d"), n = document.getElementById("out-canvas");
if (n != null) {
var i = n.getContext("2d");
i.clearRect(0, 0, 320, 240), i.drawImage(r, 0, 0, 320, 240);
}
e.width = r.width, e.height = r.height, t.drawImage(r, 0, 0), qrcode.width = r.width, qrcode.height = r.height;
try {
qrcode.imagedata = t.getImageData(0, 0, r.width, r.height);
} catch (s) {
qrcode.result = "Cross domain image reading not supported in your browser! Save it to your computer then drag and drop the file!", qrcode.callback != null && qrcode.callback(qrcode.result);
return;
}
try {
qrcode.result = qrcode.process(t);
} catch (s) {
console.log(s), qrcode.result = "error decoding QR Code";
}
qrcode.callback != null && qrcode.callback(qrcode.result);
}, r.src = e;
}, qrcode.decode_utf8 = function(e) {
return decodeURIComponent(escape(e));
}, qrcode.process = function(e) {
var t = (new Date).getTime(), n = qrcode.grayScaleToBitmap(qrcode.grayscale());
if (qrcode.debug) {
for (var r = 0; r < qrcode.height; r++) for (var i = 0; i < qrcode.width; i++) {
var s = i * 4 + r * qrcode.width * 4;
qrcode.imagedata.data[s] = n[i + r * qrcode.width] ? 0 : 0, qrcode.imagedata.data[s + 1] = n[i + r * qrcode.width] ? 0 : 0, qrcode.imagedata.data[s + 2] = n[i + r * qrcode.width] ? 255 : 0;
}
e.putImageData(qrcode.imagedata, 0, 0);
}
var o = new Detector(n), u = o.detect();
qrcode.debug && e.putImageData(qrcode.imagedata, 0, 0);
var a = Decoder.decode(u.bits), f = a.DataByte, l = "";
for (var c = 0; c < f.length; c++) for (var h = 0; h < f[c].length; h++) l += String.fromCharCode(f[c][h]);
var p = (new Date).getTime(), d = p - t;
return console.log(d), qrcode.decode_utf8(l);
}, qrcode.getPixel = function(e, t) {
if (qrcode.width < e) throw "point error";
if (qrcode.height < t) throw "point error";
return point = e * 4 + t * qrcode.width * 4, p = (qrcode.imagedata.data[point] * 33 + qrcode.imagedata.data[point + 1] * 34 + qrcode.imagedata.data[point + 2] * 33) / 100, p;
}, qrcode.binarize = function(e) {
var t = new Array(qrcode.width * qrcode.height);
for (var n = 0; n < qrcode.height; n++) for (var r = 0; r < qrcode.width; r++) {
var i = qrcode.getPixel(r, n);
t[r + n * qrcode.width] = i <= e ? !0 : !1;
}
return t;
}, qrcode.getMiddleBrightnessPerArea = function(e) {
var t = 4, n = Math.floor(qrcode.width / t), r = Math.floor(qrcode.height / t), i = new Array(t);
for (var s = 0; s < t; s++) {
i[s] = new Array(t);
for (var o = 0; o < t; o++) i[s][o] = new Array(0, 0);
}
for (var u = 0; u < t; u++) for (var a = 0; a < t; a++) {
i[a][u][0] = 255;
for (var f = 0; f < r; f++) for (var l = 0; l < n; l++) {
var c = e[n * a + l + (r * u + f) * qrcode.width];
c < i[a][u][0] && (i[a][u][0] = c), c > i[a][u][1] && (i[a][u][1] = c);
}
}
var h = new Array(t);
for (var p = 0; p < t; p++) h[p] = new Array(t);
for (var u = 0; u < t; u++) for (var a = 0; a < t; a++) h[a][u] = Math.floor((i[a][u][0] + i[a][u][1]) / 2);
return h;
}, qrcode.grayScaleToBitmap = function(e) {
var t = qrcode.getMiddleBrightnessPerArea(e), n = t.length, r = Math.floor(qrcode.width / n), i = Math.floor(qrcode.height / n), s = new Array(qrcode.height * qrcode.width);
for (var o = 0; o < n; o++) for (var u = 0; u < n; u++) for (var a = 0; a < i; a++) for (var f = 0; f < r; f++) s[r * u + f + (i * o + a) * qrcode.width] = e[r * u + f + (i * o + a) * qrcode.width] < t[u][o] ? !0 : !1;
return s;
}, qrcode.grayscale = function() {
var e = new Array(qrcode.width * qrcode.height);
for (var t = 0; t < qrcode.height; t++) for (var n = 0; n < qrcode.width; n++) {
var r = qrcode.getPixel(n, t);
e[n + t * qrcode.width] = r;
}
return e;
}, Array.prototype.remove = function(e, t) {
var n = this.slice((t || e) + 1 || this.length);
return this.length = e < 0 ? this.length + e : e, this.push.apply(this, n);
};

// src/findpat.js

function FinderPattern(e, t, n) {
this.x = e, this.y = t, this.count = 1, this.estimatedModuleSize = n, this.__defineGetter__("EstimatedModuleSize", function() {
return this.estimatedModuleSize;
}), this.__defineGetter__("Count", function() {
return this.count;
}), this.__defineGetter__("X", function() {
return this.x;
}), this.__defineGetter__("Y", function() {
return this.y;
}), this.incrementCount = function() {
this.count++;
}, this.aboutEquals = function(e, t, n) {
if (Math.abs(t - this.y) <= e && Math.abs(n - this.x) <= e) {
var r = Math.abs(e - this.estimatedModuleSize);
return r <= 1 || r / this.estimatedModuleSize <= 1;
}
return !1;
};
}

function FinderPatternInfo(e) {
this.bottomLeft = e[0], this.topLeft = e[1], this.topRight = e[2], this.__defineGetter__("BottomLeft", function() {
return this.bottomLeft;
}), this.__defineGetter__("TopLeft", function() {
return this.topLeft;
}), this.__defineGetter__("TopRight", function() {
return this.topRight;
});
}

function FinderPatternFinder() {
this.image = null, this.possibleCenters = [], this.hasSkipped = !1, this.crossCheckStateCount = new Array(0, 0, 0, 0, 0), this.resultPointCallback = null, this.__defineGetter__("CrossCheckStateCount", function() {
return this.crossCheckStateCount[0] = 0, this.crossCheckStateCount[1] = 0, this.crossCheckStateCount[2] = 0, this.crossCheckStateCount[3] = 0, this.crossCheckStateCount[4] = 0, this.crossCheckStateCount;
}), this.foundPatternCross = function(e) {
var t = 0;
for (var n = 0; n < 5; n++) {
var r = e[n];
if (r == 0) return !1;
t += r;
}
if (t < 7) return !1;
var i = Math.floor((t << INTEGER_MATH_SHIFT) / 7), s = Math.floor(i / 2);
return Math.abs(i - (e[0] << INTEGER_MATH_SHIFT)) < s && Math.abs(i - (e[1] << INTEGER_MATH_SHIFT)) < s && Math.abs(3 * i - (e[2] << INTEGER_MATH_SHIFT)) < 3 * s && Math.abs(i - (e[3] << INTEGER_MATH_SHIFT)) < s && Math.abs(i - (e[4] << INTEGER_MATH_SHIFT)) < s;
}, this.centerFromEnd = function(e, t) {
return t - e[4] - e[3] - e[2] / 2;
}, this.crossCheckVertical = function(e, t, n, r) {
var i = this.image, s = qrcode.height, o = this.CrossCheckStateCount, u = e;
while (u >= 0 && i[t + u * qrcode.width]) o[2]++, u--;
if (u < 0) return NaN;
while (u >= 0 && !i[t + u * qrcode.width] && o[1] <= n) o[1]++, u--;
if (u < 0 || o[1] > n) return NaN;
while (u >= 0 && i[t + u * qrcode.width] && o[0] <= n) o[0]++, u--;
if (o[0] > n) return NaN;
u = e + 1;
while (u < s && i[t + u * qrcode.width]) o[2]++, u++;
if (u == s) return NaN;
while (u < s && !i[t + u * qrcode.width] && o[3] < n) o[3]++, u++;
if (u == s || o[3] >= n) return NaN;
while (u < s && i[t + u * qrcode.width] && o[4] < n) o[4]++, u++;
if (o[4] >= n) return NaN;
var a = o[0] + o[1] + o[2] + o[3] + o[4];
return 5 * Math.abs(a - r) >= 2 * r ? NaN : this.foundPatternCross(o) ? this.centerFromEnd(o, u) : NaN;
}, this.crossCheckHorizontal = function(e, t, n, r) {
var i = this.image, s = qrcode.width, o = this.CrossCheckStateCount, u = e;
while (u >= 0 && i[u + t * qrcode.width]) o[2]++, u--;
if (u < 0) return NaN;
while (u >= 0 && !i[u + t * qrcode.width] && o[1] <= n) o[1]++, u--;
if (u < 0 || o[1] > n) return NaN;
while (u >= 0 && i[u + t * qrcode.width] && o[0] <= n) o[0]++, u--;
if (o[0] > n) return NaN;
u = e + 1;
while (u < s && i[u + t * qrcode.width]) o[2]++, u++;
if (u == s) return NaN;
while (u < s && !i[u + t * qrcode.width] && o[3] < n) o[3]++, u++;
if (u == s || o[3] >= n) return NaN;
while (u < s && i[u + t * qrcode.width] && o[4] < n) o[4]++, u++;
if (o[4] >= n) return NaN;
var a = o[0] + o[1] + o[2] + o[3] + o[4];
return 5 * Math.abs(a - r) >= r ? NaN : this.foundPatternCross(o) ? this.centerFromEnd(o, u) : NaN;
}, this.handlePossibleCenter = function(e, t, n) {
var r = e[0] + e[1] + e[2] + e[3] + e[4], i = this.centerFromEnd(e, n), s = this.crossCheckVertical(t, Math.floor(i), e[2], r);
if (!isNaN(s)) {
i = this.crossCheckHorizontal(Math.floor(i), Math.floor(s), e[2], r);
if (!isNaN(i)) {
var o = r / 7, u = !1, a = this.possibleCenters.length;
for (var f = 0; f < a; f++) {
var l = this.possibleCenters[f];
if (l.aboutEquals(o, s, i)) {
l.incrementCount(), u = !0;
break;
}
}
if (!u) {
var c = new FinderPattern(i, s, o);
this.possibleCenters.push(c), this.resultPointCallback != null && this.resultPointCallback.foundPossibleResultPoint(c);
}
return !0;
}
}
return !1;
}, this.selectBestPatterns = function() {
var e = this.possibleCenters.length;
if (e < 3) throw "Couldn't find enough finder patterns";
if (e > 3) {
var t = 0;
for (var n = 0; n < e; n++) t += this.possibleCenters[n].EstimatedModuleSize;
var r = t / e;
for (var n = 0; n < this.possibleCenters.length && this.possibleCenters.length > 3; n++) {
var i = this.possibleCenters[n];
Math.abs(i.EstimatedModuleSize - r) > .2 * r && (this.possibleCenters.remove(n), n--);
}
}
return this.possibleCenters.Count > 3, new Array(this.possibleCenters[0], this.possibleCenters[1], this.possibleCenters[2]);
}, this.findRowSkip = function() {
var e = this.possibleCenters.length;
if (e <= 1) return 0;
var t = null;
for (var n = 0; n < e; n++) {
var r = this.possibleCenters[n];
if (r.Count >= CENTER_QUORUM) {
if (t != null) return this.hasSkipped = !0, Math.floor((Math.abs(t.X - r.X) - Math.abs(t.Y - r.Y)) / 2);
t = r;
}
}
return 0;
}, this.haveMultiplyConfirmedCenters = function() {
var e = 0, t = 0, n = this.possibleCenters.length;
for (var r = 0; r < n; r++) {
var i = this.possibleCenters[r];
i.Count >= CENTER_QUORUM && (e++, t += i.EstimatedModuleSize);
}
if (e < 3) return !1;
var s = t / n, o = 0;
for (var r = 0; r < n; r++) i = this.possibleCenters[r], o += Math.abs(i.EstimatedModuleSize - s);
return o <= .05 * t;
}, this.findFinderPattern = function(e) {
var t = !1;
this.image = e;
var n = qrcode.height, r = qrcode.width, i = Math.floor(3 * n / (4 * MAX_MODULES));
if (i < MIN_SKIP || t) i = MIN_SKIP;
var s = !1, o = new Array(5);
for (var u = i - 1; u < n && !s; u += i) {
o[0] = 0, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0;
var a = 0;
for (var f = 0; f < r; f++) if (e[f + u * qrcode.width]) (a & 1) == 1 && a++, o[a]++; else if ((a & 1) == 0) if (a == 4) if (this.foundPatternCross(o)) {
var l = this.handlePossibleCenter(o, u, f);
if (l) {
i = 2;
if (this.hasSkipped) s = this.haveMultiplyConfirmedCenters(); else {
var c = this.findRowSkip();
c > o[2] && (u += c - o[2] - i, f = r - 1);
}
} else {
do f++; while (f < r && !e[f + u * qrcode.width]);
f--;
}
a = 0, o[0] = 0, o[1] = 0, o[2] = 0, o[3] = 0, o[4] = 0;
} else o[0] = o[2], o[1] = o[3], o[2] = o[4], o[3] = 1, o[4] = 0, a = 3; else o[++a]++; else o[a]++;
if (this.foundPatternCross(o)) {
var l = this.handlePossibleCenter(o, u, r);
l && (i = o[0], this.hasSkipped && (s = haveMultiplyConfirmedCenters()));
}
}
var h = this.selectBestPatterns();
return qrcode.orderBestPatterns(h), new FinderPatternInfo(h);
};
}

var MIN_SKIP = 3, MAX_MODULES = 57, INTEGER_MATH_SHIFT = 8, CENTER_QUORUM = 2;

qrcode.orderBestPatterns = function(e) {
function t(e, t) {
return xDiff = e.X - t.X, yDiff = e.Y - t.Y, Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
function n(e, t, n) {
var r = t.x, i = t.y;
return (n.x - r) * (e.y - i) - (n.y - i) * (e.x - r);
}
var r = t(e[0], e[1]), i = t(e[1], e[2]), s = t(e[0], e[2]), o, u, a;
i >= r && i >= s ? (u = e[0], o = e[1], a = e[2]) : s >= i && s >= r ? (u = e[1], o = e[0], a = e[2]) : (u = e[2], o = e[0], a = e[1]);
if (n(o, u, a) < 0) {
var f = o;
o = a, a = f;
}
e[0] = o, e[1] = u, e[2] = a;
};

// src/alignpat.js

function AlignmentPattern(e, t, n) {
this.x = e, this.y = t, this.count = 1, this.estimatedModuleSize = n, this.__defineGetter__("EstimatedModuleSize", function() {
return this.estimatedModuleSize;
}), this.__defineGetter__("Count", function() {
return this.count;
}), this.__defineGetter__("X", function() {
return Math.floor(this.x);
}), this.__defineGetter__("Y", function() {
return Math.floor(this.y);
}), this.incrementCount = function() {
this.count++;
}, this.aboutEquals = function(e, t, n) {
if (Math.abs(t - this.y) <= e && Math.abs(n - this.x) <= e) {
var r = Math.abs(e - this.estimatedModuleSize);
return r <= 1 || r / this.estimatedModuleSize <= 1;
}
return !1;
};
}

function AlignmentPatternFinder(e, t, n, r, i, s, o) {
this.image = e, this.possibleCenters = new Array, this.startX = t, this.startY = n, this.width = r, this.height = i, this.moduleSize = s, this.crossCheckStateCount = new Array(0, 0, 0), this.resultPointCallback = o, this.centerFromEnd = function(e, t) {
return t - e[2] - e[1] / 2;
}, this.foundPatternCross = function(e) {
var t = this.moduleSize, n = t / 2;
for (var r = 0; r < 3; r++) if (Math.abs(t - e[r]) >= n) return !1;
return !0;
}, this.crossCheckVertical = function(e, t, n, r) {
var i = this.image, s = qrcode.height, o = this.crossCheckStateCount;
o[0] = 0, o[1] = 0, o[2] = 0;
var u = e;
while (u >= 0 && i[t + u * qrcode.width] && o[1] <= n) o[1]++, u--;
if (u < 0 || o[1] > n) return NaN;
while (u >= 0 && !i[t + u * qrcode.width] && o[0] <= n) o[0]++, u--;
if (o[0] > n) return NaN;
u = e + 1;
while (u < s && i[t + u * qrcode.width] && o[1] <= n) o[1]++, u++;
if (u == s || o[1] > n) return NaN;
while (u < s && !i[t + u * qrcode.width] && o[2] <= n) o[2]++, u++;
if (o[2] > n) return NaN;
var a = o[0] + o[1] + o[2];
return 5 * Math.abs(a - r) >= 2 * r ? NaN : this.foundPatternCross(o) ? this.centerFromEnd(o, u) : NaN;
}, this.handlePossibleCenter = function(e, t, n) {
var r = e[0] + e[1] + e[2], i = this.centerFromEnd(e, n), s = this.crossCheckVertical(t, Math.floor(i), 2 * e[1], r);
if (!isNaN(s)) {
var o = (e[0] + e[1] + e[2]) / 3, u = this.possibleCenters.length;
for (var a = 0; a < u; a++) {
var f = this.possibleCenters[a];
if (f.aboutEquals(o, s, i)) return new AlignmentPattern(i, s, o);
}
var l = new AlignmentPattern(i, s, o);
this.possibleCenters.push(l), this.resultPointCallback != null && this.resultPointCallback.foundPossibleResultPoint(l);
}
return null;
}, this.find = function() {
var t = this.startX, i = this.height, s = t + r, o = n + (i >> 1), u = new Array(0, 0, 0);
for (var a = 0; a < i; a++) {
var f = o + ((a & 1) == 0 ? a + 1 >> 1 : -(a + 1 >> 1));
u[0] = 0, u[1] = 0, u[2] = 0;
var l = t;
while (l < s && !e[l + qrcode.width * f]) l++;
var c = 0;
while (l < s) {
if (e[l + f * qrcode.width]) if (c == 1) u[c]++; else if (c == 2) {
if (this.foundPatternCross(u)) {
var h = this.handlePossibleCenter(u, f, l);
if (h != null) return h;
}
u[0] = u[2], u[1] = 1, u[2] = 0, c = 1;
} else u[++c]++; else c == 1 && c++, u[c]++;
l++;
}
if (this.foundPatternCross(u)) {
var h = this.handlePossibleCenter(u, f, s);
if (h != null) return h;
}
}
if (this.possibleCenters.length != 0) return this.possibleCenters[0];
throw "Couldn't find enough alignment patterns";
};
}

// src/databr.js

function QRCodeDataBlockReader(e, t, n) {
this.blockPointer = 0, this.bitPointer = 7, this.dataLength = 0, this.blocks = e, this.numErrorCorrectionCode = n, t <= 9 ? this.dataLengthMode = 0 : t >= 10 && t <= 26 ? this.dataLengthMode = 1 : t >= 27 && t <= 40 && (this.dataLengthMode = 2), this.getNextBits = function(e) {
var t = 0;
if (e < this.bitPointer + 1) {
var n = 0;
for (var r = 0; r < e; r++) n += 1 << r;
return n <<= this.bitPointer - e + 1, t = (this.blocks[this.blockPointer] & n) >> this.bitPointer - e + 1, this.bitPointer -= e, t;
}
if (e < this.bitPointer + 1 + 8) {
var i = 0;
for (var r = 0; r < this.bitPointer + 1; r++) i += 1 << r;
return t = (this.blocks[this.blockPointer] & i) << e - (this.bitPointer + 1), this.blockPointer++, t += this.blocks[this.blockPointer] >> 8 - (e - (this.bitPointer + 1)), this.bitPointer = this.bitPointer - e % 8, this.bitPointer < 0 && (this.bitPointer = 8 + this.bitPointer), t;
}
if (e < this.bitPointer + 1 + 16) {
var i = 0, s = 0;
for (var r = 0; r < this.bitPointer + 1; r++) i += 1 << r;
var o = (this.blocks[this.blockPointer] & i) << e - (this.bitPointer + 1);
this.blockPointer++;
var u = this.blocks[this.blockPointer] << e - (this.bitPointer + 1 + 8);
this.blockPointer++;
for (var r = 0; r < e - (this.bitPointer + 1 + 8); r++) s += 1 << r;
s <<= 8 - (e - (this.bitPointer + 1 + 8));
var a = (this.blocks[this.blockPointer] & s) >> 8 - (e - (this.bitPointer + 1 + 8));
return t = o + u + a, this.bitPointer = this.bitPointer - (e - 8) % 8, this.bitPointer < 0 && (this.bitPointer = 8 + this.bitPointer), t;
}
return 0;
}, this.NextMode = function() {
return this.blockPointer > this.blocks.length - this.numErrorCorrectionCode - 2 ? 0 : this.getNextBits(4);
}, this.getDataLength = function(e) {
var t = 0;
for (;;) {
if (e >> t == 1) break;
t++;
}
return this.getNextBits(qrcode.sizeOfDataLengthInfo[this.dataLengthMode][t]);
}, this.getRomanAndFigureString = function(e) {
var t = e, n = 0, r = "", i = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", " ", "$", "%", "*", "+", "-", ".", "/", ":");
do if (t > 1) {
n = this.getNextBits(11);
var s = Math.floor(n / 45), o = n % 45;
r += i[s], r += i[o], t -= 2;
} else t == 1 && (n = this.getNextBits(6), r += i[n], t -= 1); while (t > 0);
return r;
}, this.getFigureString = function(e) {
var t = e, n = 0, r = "";
do t >= 3 ? (n = this.getNextBits(10), n < 100 && (r += "0"), n < 10 && (r += "0"), t -= 3) : t == 2 ? (n = this.getNextBits(7), n < 10 && (r += "0"), t -= 2) : t == 1 && (n = this.getNextBits(4), t -= 1), r += n; while (t > 0);
return r;
}, this.get8bitByteArray = function(e) {
var t = e, n = 0, r = new Array;
do n = this.getNextBits(8), r.push(n), t--; while (t > 0);
return r;
}, this.getKanjiString = function(e) {
var t = e, n = 0, r = "";
do {
n = getNextBits(13);
var i = n % 192, s = n / 192, o = (s << 8) + i, u = 0;
o + 33088 <= 40956 ? u = o + 33088 : u = o + 49472, r += String.fromCharCode(u), t--;
} while (t > 0);
return r;
}, this.__defineGetter__("DataByte", function() {
var e = new Array, t = 1, n = 2, r = 4, i = 8;
do {
var s = this.NextMode();
if (s == 0) {
if (e.length > 0) break;
throw "Empty data block";
}
if (s != t && s != n && s != r && s != i) throw "Invalid mode: " + s + " in (block:" + this.blockPointer + " bit:" + this.bitPointer + ")";
dataLength = this.getDataLength(s);
if (dataLength < 1) throw "Invalid data length: " + dataLength;
switch (s) {
case t:
var o = this.getFigureString(dataLength), u = new Array(o.length);
for (var a = 0; a < o.length; a++) u[a] = o.charCodeAt(a);
e.push(u);
break;
case n:
var o = this.getRomanAndFigureString(dataLength), u = new Array(o.length);
for (var a = 0; a < o.length; a++) u[a] = o.charCodeAt(a);
e.push(u);
break;
case r:
var f = this.get8bitByteArray(dataLength);
e.push(f);
break;
case i:
var o = this.getKanjiString(dataLength);
e.push(o);
}
} while (!0);
return e;
});
}

// webActivities/PickActivity.js

enyo.kind({
name: "webActivities.PickActivity",
kind: "enyo.Component",
published: {
onsuccess: "",
onerror: "",
type: ""
},
pick: function(e, t) {
var n = new MozActivity({
name: "pick",
data: {
type: this.type
}
}), r = this;
n.onsuccess = function() {
console.log("pick success!! calling " + r.onsuccess);
var e = this.result;
enyo.call(r.owner, r.onsuccess, [ this.result ]);
}, n.onerror = function() {
console.log("error on pick !!! calling " + r.onerror), enyo.call(r.owner, r.onerror, [ this.result ]);
};
}
});

// webActivities/ViewActivity.js

enyo.kind({
name: "webActivities.ViewActivity",
kind: "enyo.Component",
statics: {
viewURL: function(e) {
var t = new MozActivity({
name: "view",
data: {
type: "url",
url: e
}
});
}
}
});

// webActivities/NewActivity.js

enyo.kind({
name: "webActivities.NewActivity",
kind: "enyo.Component",
statics: {
"new": function(e) {
var t = new MozActivity({
name: "new",
data: e
});
}
}
});

// webActivities/DialActivity.js

enyo.kind({
name: "webActivities.DialActivity",
kind: "enyo.Component",
statics: {
dial: function(e) {
var t = new MozActivity({
name: "dial",
data: {
number: e
}
});
}
}
});

// webActivities/ShareActivity.js

enyo.kind({
name: "webActivities.ShareActivity",
kind: "enyo.Component",
statics: {
shareURL: function(e) {
var t = new MozActivity({
name: "share",
data: {
number: 1,
url: e
}
});
},
shareBlob: function(e, t) {
var n = new Blob([ e ], {
type: t
}), r = new MozActivity({
name: "share",
data: {
number: 1,
blobs: n
}
});
}
}
});

// webActivities/SaveBookmarkActivity.js

enyo.kind({
name: "webActivities.SaveBookmarkActivity",
kind: "enyo.Component",
statics: {
save: function(e) {
var t = new MozActivity({
name: "save-bookmark",
data: e
});
}
}
});

// WebAppInstaller.js

enyo.WebAppInstaller = {
check: function(e) {
var t = {
type: "unsupported",
installed: !1
};
if (navigator.mozApps) {
var n = navigator.mozApps.getSelf();
n.onsuccess = function(r) {
t.type = "mozilla", t.installed = n.result ? !0 : !1, e(t);
}, n.onerror = function(n) {
enyo.error("Error checking Mozilla app status"), e(t);
};
} else typeof chrome != "undefined" && chrome.webstore && chrome.app ? (t.type = "chromeStore", t.installed = chrome.app.isInstalled ? !0 : !1, e(t)) : typeof window.navigator.standalone != "undefined" ? (t.type = "ios", t.installed = window.navigator.standalone ? !0 : !1, e(t)) : e(t);
},
install: function(e, t, n) {
arguments.length == 2 && (n = t || undefined, t = e || undefined, e = undefined);
if (navigator.mozApps) {
if (!e) {
var r = window.location.href.lastIndexOf("/");
r > window.location.href.indexOf("://") + 2 ? e = window.location.href.substring(0, r + 1) + "manifest.webapp" : e = window.location.href + "/manifest.webapp";
}
var i = navigator.mozApps.install(e);
i.onsuccess = t, i.onerror = n;
} else typeof chrome != "undefined" && chrome.webstore && chrome.app ? chrome.webstore.install(e, t, n) : enyo.platform.ios && alert('To install, press the share button in Safari and tap "Add to Home Screen"');
}
};

// WebAppButton.js

enyo.kind({
name: "onyx.WebAppButton",
kind: "onyx.Button",
installLabel: "Install",
updateLabel: "Update",
webAppUrl: undefined,
alwaysShow: !1,
events: {
onInstallSuccess: "",
onInstallError: ""
},
handlers: {
ontap: "install"
},
showing: !1,
checked: !1,
rendered: function() {
this.inherited(arguments), this.checked || (this.checked = !0, enyo.WebAppInstaller.check(enyo.bind(this, function(e) {
e.type != "unsupported" && (this.setShowing(!e.installed || this.alwaysShow), this.setContent(e.installed ? this.updateLabel : this.installLabel));
})));
},
install: function() {
enyo.WebAppInstaller.install(enyo.bind(this, function(e) {
this.alwaysShow || this.hide(), this.setContent(this.updateLabel), this.doInstallSuccess(e);
}), enyo.bind(this, function(e) {
this.doInstallError(e);
}));
}
});

// pixastic.custom.js

var Pixastic = function() {
function e(e, t, n) {
e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent && e.attachEvent("on" + t, n);
}
function t(t) {
var n = !1, r = function() {
n || (n = !0, t());
};
document.write('<script defer src="//:" id="__onload_ie_pixastic__"></script>');
var i = document.getElementById("__onload_ie_pixastic__");
i.onreadystatechange = function() {
i.readyState == "complete" && (i.parentNode.removeChild(i), r());
}, document.addEventListener && document.addEventListener("DOMContentLoaded", r, !1), e(window, "load", r);
}
function n() {
var e = r("pixastic", null, "img"), t = r("pixastic", null, "canvas"), n = e.concat(t);
for (var i = 0; i < n.length; i++) (function() {
var e = n[i], t = [], r = e.className.split(" ");
for (var s = 0; s < r.length; s++) {
var o = r[s];
if (o.substring(0, 9) == "pixastic-") {
var u = o.substring(9);
u != "" && t.push(u);
}
}
if (t.length) if (e.tagName.toLowerCase() == "img") {
var a = new Image;
a.src = e.src;
if (a.complete) for (var f = 0; f < t.length; f++) {
var l = Pixastic.applyAction(e, e, t[f], null);
l && (e = l);
} else a.onload = function() {
for (var n = 0; n < t.length; n++) {
var r = Pixastic.applyAction(e, e, t[n], null);
r && (e = r);
}
};
} else setTimeout(function() {
for (var n = 0; n < t.length; n++) {
var r = Pixastic.applyAction(e, e, t[n], null);
r && (e = r);
}
}, 1);
})();
}
function r(e, t, n) {
var r = new Array;
t == null && (t = document), n == null && (n = "*");
var s = t.getElementsByTagName(n), o = s.length, u = new RegExp("(^|\\s)" + e + "(\\s|$)");
for (i = 0, j = 0; i < o; i++) u.test(s[i].className) && (r[j] = s[i], j++);
return r;
}
function o(e, t) {
if (!Pixastic.debug) return;
try {
switch (t) {
case "warn":
console.warn("Pixastic:", e);
break;
case "error":
console.error("Pixastic:", e);
break;
default:
console.log("Pixastic:", e);
}
} catch (n) {}
!s;
}
typeof pixastic_parseonload != "undefined" && pixastic_parseonload && t(n);
var s, u = function() {
var e = document.createElement("canvas"), t = !1;
try {
t = typeof e.getContext == "function" && !!e.getContext("2d");
} catch (n) {}
return function() {
return t;
};
}(), a = function() {
var e = document.createElement("canvas"), t = !1, n;
try {
typeof e.getContext == "function" && (n = e.getContext("2d")) && (t = typeof n.getImageData == "function");
} catch (r) {}
return function() {
return t;
};
}(), f = function() {
var e = !1, t = document.createElement("canvas");
if (u() && a()) {
t.width = t.height = 1;
var n = t.getContext("2d");
n.fillStyle = "rgb(255,0,0)", n.fillRect(0, 0, 1, 1);
var r = document.createElement("canvas");
r.width = r.height = 1;
var i = r.getContext("2d");
i.fillStyle = "rgb(0,0,255)", i.fillRect(0, 0, 1, 1), n.globalAlpha = .5, n.drawImage(r, 0, 0);
var s = n.getImageData(0, 0, 1, 1).data;
e = s[2] != 255;
}
return function() {
return e;
};
}();
return {
parseOnLoad: !1,
debug: !1,
applyAction: function(e, t, n, r) {
r = r || {};
var i = e.tagName.toLowerCase() == "canvas";
if (i && Pixastic.Client.isIE()) return Pixastic.debug && o("Tried to process a canvas element but browser is IE."), !1;
var s, u, a = !1;
Pixastic.Client.hasCanvas() && (a = !!r.resultCanvas, s = r.resultCanvas || document.createElement("canvas"), u = s.getContext("2d"));
var f = e.offsetWidth, l = e.offsetHeight;
i && (f = e.width, l = e.height);
if (f == 0 || l == 0) {
if (e.parentNode != null) {
Pixastic.debug && o("Image has 0 width and/or height.");
return;
}
var c = e.style.position, h = e.style.left;
e.style.position = "absolute", e.style.left = "-9999px", document.body.appendChild(e), f = e.offsetWidth, l = e.offsetHeight, document.body.removeChild(e), e.style.position = c, e.style.left = h;
}
if (n.indexOf("(") > -1) {
var p = n;
n = p.substr(0, p.indexOf("("));
var d = p.match(/\((.*?)\)/);
if (d[1]) {
d = d[1].split(";");
for (var v = 0; v < d.length; v++) {
thisArg = d[v].split("=");
if (thisArg.length == 2) if (thisArg[0] == "rect") {
var m = thisArg[1].split(",");
r[thisArg[0]] = {
left: parseInt(m[0], 10) || 0,
top: parseInt(m[1], 10) || 0,
width: parseInt(m[2], 10) || 0,
height: parseInt(m[3], 10) || 0
};
} else r[thisArg[0]] = thisArg[1];
}
}
}
r.rect ? (r.rect.left = Math.round(r.rect.left), r.rect.top = Math.round(r.rect.top), r.rect.width = Math.round(r.rect.width), r.rect.height = Math.round(r.rect.height)) : r.rect = {
left: 0,
top: 0,
width: f,
height: l
};
var g = !1;
Pixastic.Actions[n] && typeof Pixastic.Actions[n].process == "function" && (g = !0);
if (!g) return Pixastic.debug && o('Invalid action "' + n + '". Maybe file not included?'), !1;
if (!Pixastic.Actions[n].checkSupport()) return Pixastic.debug && o('Action "' + n + '" not supported by this browser.'), !1;
Pixastic.Client.hasCanvas() ? (s !== e && (s.width = f, s.height = l), a || (s.style.width = f + "px", s.style.height = l + "px"), u.drawImage(t, 0, 0, f, l), e.__pixastic_org_image ? (s.__pixastic_org_image = e.__pixastic_org_image, s.__pixastic_org_width = e.__pixastic_org_width, s.__pixastic_org_height = e.__pixastic_org_height) : (s.__pixastic_org_image = e, s.__pixastic_org_width = f, s.__pixastic_org_height = l)) : Pixastic.Client.isIE() && typeof e.__pixastic_org_style == "undefined" && (e.__pixastic_org_style = e.style.cssText);
var y = {
image: e,
canvas: s,
width: f,
height: l,
useData: !0,
options: r
}, b = Pixastic.Actions[n].process(y);
return b ? Pixastic.Client.hasCanvas() ? (y.useData && Pixastic.Client.hasCanvasImageData() && (s.getContext("2d").putImageData(y.canvasData, r.rect.left, r.rect.top), s.getContext("2d").fillRect(0, 0, 0, 0)), r.leaveDOM || (s.title = e.title, s.imgsrc = e.imgsrc, i || (s.alt = e.alt), i || (s.imgsrc = e.src), s.className = e.className, s.style.cssText = e.style.cssText, s.name = e.name, s.tabIndex = e.tabIndex, s.id = e.id, e.parentNode && e.parentNode.replaceChild && e.parentNode.replaceChild(s, e)), r.resultCanvas = s, s) : e : !1;
},
prepareData: function(e, t) {
var n = e.canvas.getContext("2d"), r = e.options.rect, i = n.getImageData(r.left, r.top, r.width, r.height), s = i.data;
return t || (e.canvasData = i), s;
},
process: function(e, t, n, r) {
if (e.tagName.toLowerCase() == "img") {
var i = new Image;
i.src = e.src;
if (i.complete) {
var s = Pixastic.applyAction(e, i, t, n);
return r && r(s), s;
}
i.onload = function() {
var s = Pixastic.applyAction(e, i, t, n);
r && r(s);
};
}
if (e.tagName.toLowerCase() == "canvas") {
var s = Pixastic.applyAction(e, e, t, n);
return r && r(s), s;
}
},
revert: function(e) {
if (Pixastic.Client.hasCanvas()) {
if (e.tagName.toLowerCase() == "canvas" && e.__pixastic_org_image) return e.width = e.__pixastic_org_width, e.height = e.__pixastic_org_height, e.getContext("2d").drawImage(e.__pixastic_org_image, 0, 0), e.parentNode && e.parentNode.replaceChild && e.parentNode.replaceChild(e.__pixastic_org_image, e), e;
} else Pixastic.Client.isIE() && typeof e.__pixastic_org_style != "undefined" && (e.style.cssText = e.__pixastic_org_style);
},
Client: {
hasCanvas: u,
hasCanvasImageData: a,
hasGlobalAlpha: f,
isIE: function() {
return !!document.all && !!window.attachEvent && !window.opera;
}
},
Actions: {}
};
}();

Pixastic.Actions.sharpen = {
process: function(e) {
var t = 0;
typeof e.options.amount != "undefined" && (t = parseFloat(e.options.amount) || 0), t < 0 && (t = 0), t > 1 && (t = 1);
if (Pixastic.Client.hasCanvasImageData()) {
var n = Pixastic.prepareData(e), r = Pixastic.prepareData(e, !0), i = 15, s = 1 + 3 * t, o = [ [ 0, -s, 0 ], [ -s, i, -s ], [ 0, -s, 0 ] ], u = 0;
for (var a = 0; a < 3; a++) for (var f = 0; f < 3; f++) u += o[a][f];
u = 1 / u;
var l = e.options.rect, c = l.width, h = l.height;
i *= u, s *= u;
var p = c * 4, d = h;
do {
var v = (d - 1) * p, m = d == h ? d - 1 : d, g = d == 1 ? 0 : d - 2, y = g * p, b = m * p, w = c;
do {
var E = v + (w * 4 - 4), S = y + (w == 1 ? 0 : w - 2) * 4, x = b + (w == c ? w - 1 : w) * 4, T = (-r[S] - r[E - 4] - r[E + 4] - r[x]) * s + r[E] * i, N = (-r[S + 1] - r[E - 3] - r[E + 5] - r[x + 1]) * s + r[E + 1] * i, C = (-r[S + 2] - r[E - 2] - r[E + 6] - r[x + 2]) * s + r[E + 2] * i;
T < 0 && (T = 0), N < 0 && (N = 0), C < 0 && (C = 0), T > 255 && (T = 255), N > 255 && (N = 255), C > 255 && (C = 255), n[E] = T, n[E + 1] = N, n[E + 2] = C;
} while (--w);
} while (--d);
return !0;
}
},
checkSupport: function() {
return Pixastic.Client.hasCanvasImageData();
}
};

// URLPanel.js

enyo.kind({
name: "URLPanel",
kind: "FittableRows",
fit: !0,
events: {
onPanelChanged: ""
},
published: {
url: ""
},
create: function() {
this.inherited(arguments), this.urlChanged(), navigator.onLine || this.$.facebookButton.destroy();
},
components: [ {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Button",
content: "Voltar",
ontap: "goHome"
}, {
content: "Endere\u00e7o Web"
} ]
}, {
tag: "div",
style: "text-align: center",
components: [ {
tag: "br"
}, {
kind: "onyx.TextArea",
style: "width: 90%",
placeholder: "sua url aqui",
name: "url"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Button",
style: "width: 90%",
content: "Abrir URL",
ontap: "viewURL"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Button",
style: "width: 90%",
content: "Compartilhar URL",
ontap: "shareURL"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Button",
style: "width: 90%",
content: "Adicionar URL aos favoritos",
ontap: "AddBookmark"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Button",
name: "facebookButton",
style: "width: 90%",
content: "Compartilhar no Facebook",
ontap: "shareFacebook"
} ]
} ],
urlChanged: function() {
this.$.url.setValue(this.url), this.$.url.render();
},
goHome: function() {
this.doPanelChanged({
panel: "home"
});
},
viewURL: function() {
webActivities.ViewActivity.viewURL(this.$.url.getValue());
},
shareURL: function() {
webActivities.ShareActivity.shareURL(this.$.url.getValue());
},
emailURL: function() {
webActivities.NewActivity.new({
url: "mailto:" + this.$.url.getValue() + "?body=teste"
});
},
AddBookmark: function() {
webActivities.SaveBookmarkActivity.save({
type: "url",
url: this.$.url.getValue()
});
},
shareFacebook: function() {
var e = this.$.url.getValue();
FB.ui({
method: "feed",
link: e
}, function(e) {
e && e.post_id ? alert("Compartilhado com sucesso!") : alert("N\u00e3o foi poss\u00edvel compartilhar.");
});
}
});

// MailtoPanel.js

enyo.kind({
name: "MailtoPanel",
kind: "FittableRows",
fit: !0,
events: {
onPanelChanged: ""
},
published: {
url: ""
},
create: function() {
this.inherited(arguments), this.urlChanged();
},
components: [ {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Button",
content: "Voltar",
ontap: "goHome"
}, {
content: "Endere\u00e7o de Email"
} ]
}, {
tag: "div",
style: "text-align: center",
components: [ {
tag: "br"
}, {
kind: "onyx.TextArea",
style: "width: 90%",
placeholder: "your email here",
name: "url"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Button",
style: "width: 90%",
content: "Enviar Email",
ontap: "sendMail"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Button",
style: "width: 90%",
content: "Compartilhar Email",
ontap: "shareURL"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Button",
style: "width: 90%",
content: "Adicionar Contato",
ontap: "AddContact"
} ]
} ],
urlChanged: function() {
this.$.url.setValue(this.url), this.$.url.render();
},
goHome: function() {
this.doPanelChanged({
panel: "home"
});
},
shareURL: function() {
webActivities.ShareActivity.shareURL(this.$.url.getValue());
},
sendMail: function() {
webActivities.NewActivity.new({
url: "mailto:" + this.$.url.getValue()
});
},
AddContact: function() {
webActivities.NewActivity.new({
type: "webcontacts/contact",
params: {
email: this.$.url.getValue()
}
});
}
});

// HomePanel.js

enyo.kind({
name: "HomePanel",
kind: "FittableRows",
fit: !0,
events: {
onPanelChanged: ""
},
components: [ {
kind: "PortsHeader",
title: "QR Decoder",
taglines: [ "Quadradinhos por todos os lados!", "The Power To Decode!", "Cade o QR Code?" ]
}, {
kind: "webActivities.PickActivity",
name: "picker",
onsuccess: "picksuccess",
onerror: "pickerror",
type: [ "image/png", "image/jpg", "image/jpeg" ]
}, {
tag: "div",
fit: !0,
style: "text-align:center",
components: [ {
name: "scan",
content: "Toque Para Escanear"
}, {
kind: "enyo.Image",
src: "assets/touchbutton.png",
ontap: "scanqrcode",
style: "width: 80%; height: auto"
} ]
}, {
kind: "onyx.Button",
classes: "onyx-dark",
name: "installButton",
style: "height: 70px; width: 100%",
content: "Toque para instalar",
ontap: "installApp"
} ],
create: function() {
this.inherited(arguments), this.log("Platform is: " + enyo.platform.firefoxOS), this.log("Checking if QR Decoder is installed..."), enyo.WebAppInstaller.check(enyo.bind(this, function(e) {
e && e.type == "mozilla" && e.installed ? (this.log("App is installed!"), this.$.installButton.destroy()) : this.log("App is not installed!");
}));
},
installApp: function(e, t) {
this.log("installing app"), enyo.WebAppInstaller.install();
},
scanqrcode: function(e, t) {
this.log(e.name), this.$.picker.pick();
},
picksuccess: function(e) {
this.log("pick success callback!"), this.$.scan.setContent("Processando... (pode demorar um pouco)"), this.$.scan.render(), qrcode.callback = enyo.bind(this, function(e) {
this.processQRData(e);
}), this.imageBlob = e.blob, this.retried = !1, qrcode.decode(window.URL.createObjectURL(this.imageBlob));
},
pickerror: function(e) {
this.log("pick error callback!"), console.log(e);
},
processQRData: function(e) {
this.log("QR Code: " + e), this.$.scan.setContent("Toque Para Escanear"), this.$.scan.render();
if (e.indexOf("error decoding") != -1) return alert("N\u00e3o foi poss\u00edvel decodificar o QR code."), !0;
if (e.indexOf("http://") != -1 || e.indexOf("https://") != -1) return this.doPanelChanged({
panel: "url",
url: e
}), !0;
if (e.indexOf("www.") != -1) return this.doPanelChanged({
panel: "url",
url: "http://" + e
}), !0;
if (e.indexOf("mailto:") != -1 || e.indexOf("@") != -1) return this.doPanelChanged({
panel: "mail",
url: e
}), !0;
if (e.indexOf("tel:") != -1 || e.indexOf("TEL:") != -1) {
var t = e.toUpperCase().replace("TEL:", "");
return this.doPanelChanged({
panel: "dial",
url: t
}), !0;
}
if (e.indexOf("sms:") != -1 || e.indexOf("SMS:") != -1) {
var t = e.toUpperCase().replace("SMS:", "");
return this.doPanelChanged({
panel: "dial",
url: t
}), !0;
}
if (e.indexOf("SMSTO:") != 1) {
var t = e.toUpperCase().replace("SMSTO:", "");
return this.doPanelChanged({
panel: "dial",
url: t
}), !0;
}
}
});

// DialPanel.js

enyo.kind({
name: "DialPanel",
kind: "FittableRows",
fit: !0,
events: {
onPanelChanged: ""
},
published: {
url: ""
},
create: function() {
this.inherited(arguments), this.urlChanged();
},
components: [ {
kind: "onyx.Toolbar",
components: [ {
kind: "onyx.Button",
content: "Voltar",
ontap: "goHome"
}, {
content: "N\u00famero de Telefone"
} ]
}, {
tag: "div",
style: "text-align: center",
components: [ {
tag: "br"
}, {
kind: "onyx.TextArea",
style: "width: 90%",
placeholder: "seu n\u00famero aqui",
name: "url"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Button",
style: "width: 90%",
content: "Discar",
ontap: "dial"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Button",
style: "width: 90%",
content: "Enviar SMS",
ontap: "sendSMS"
}, {
tag: "br"
}, {
tag: "br"
}, {
kind: "onyx.Button",
style: "width: 90%",
content: "Adicionar Contato",
ontap: "AddContact"
} ]
} ],
urlChanged: function() {
this.$.url.setValue(this.url), this.$.url.render();
},
goHome: function() {
this.doPanelChanged({
panel: "home"
});
},
dial: function() {
webActivities.DialActivity.dial(this.$.url.getValue());
},
sendSMS: function() {
webActivities.NewActivity.new({
type: "websms/sms",
number: this.$.url.getValue()
});
},
AddContact: function() {
webActivities.NewActivity.new({
type: "webcontacts/contact",
params: {
tel: this.$.url.getValue()
}
});
}
});

// App.js

enyo.kind({
name: "App",
kind: "Panels",
fit: !0,
draggable: !1,
arrangerKind: "CardArranger",
handlers: {
onPanelChanged: "panelChanged"
},
components: [ {
kind: "HomePanel",
name: "home"
}, {
kind: "URLPanel",
name: "url"
}, {
kind: "MailtoPanel",
name: "mail"
}, {
kind: "DialPanel",
name: "dial"
} ],
panelChanged: function(e, t) {
t.url && t.panel == "url" && (console.log("found url: " + t.url), this.$.url.setUrl(t.url)), t.url && t.panel == "mail" && (console.log("found mail: " + t.url), this.$.mail.setUrl(t.url)), t.url && t.panel == "dial" && (console.log("found number: " + t.url), this.$.dial.setUrl(t.url));
var n = {
home: 0,
url: 1,
mail: 2,
dial: 3
};
this.log("changing panel to " + t.panel), this.setIndex(n[t.panel]);
}
});
