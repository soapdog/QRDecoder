enyo.kind({
    name: "App",
    kind: "Panels",
    fit: true,
    draggable: false,
    arrangerKind: "CardArranger",
    handlers: {
        onPanelChanged: "panelChanged"
    },
    components: [
        {kind: "HomePanel", name: "home"},
        {kind: "URLPanel", name: "url"},
        {kind: "MailtoPanel", name: "mail"},
        {kind: "DialPanel", name: "dial"}

    ],
    create: function() {
        this.inherited(arguments);
        this.log("Setting Locale to: "+enyo.g11n.currentLocale());
        var localizedResources;
        localizedResources = new enyo.g11n.Resources(enyo.g11n.currentLocale());
        console.log(localizedResources);
        this.log("Testing locale 'Back' = " +$L("Back"));


    },
    panelChanged: function(inSender, inEvent) {
        if (inEvent.url && inEvent.panel == "url") {
            console.log("found url: "+inEvent.url);
            this.$.url.setUrl(inEvent.url);
        }
        if (inEvent.url && inEvent.panel == "mail") {
            console.log("found mail: "+inEvent.url);
            this.$.mail.setUrl(inEvent.url);
        }
        if (inEvent.url && inEvent.panel == "dial") {
            console.log("found number: "+inEvent.url);
            this.$.dial.setUrl(inEvent.url);
        }

        var p = {home: 0, url: 1, mail: 2, dial: 3 };
        this.log("changing panel to " + inEvent.panel);
        this.setIndex(p[inEvent.panel]);
    }
});