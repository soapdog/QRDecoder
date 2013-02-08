enyo.depends(
	"$lib/layout",
	"$lib/onyx",	// To theme Onyx using Theme.less, change this line to $lib/onyx/source,
	//"Theme.less",	// uncomment this line, and follow the steps described in Theme.less
    "$lib/g11n",
    "$lib/webos-ports-lib",
    "$lib/jsqrcode",
    "$lib/webapi",
    "$lib/webappinstaller",
    "$lib/pixastic",
    // Models
    // Components
    "URLPanel.js",
    "MailtoPanel.js",
    "HomePanel.js",
    "DialPanel.js",
    // App
	"App.css",
	"App.js"
);
