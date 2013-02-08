enyo.kind({
    name: "DialPanel",
    kind: "FittableRows",
    fit: true,
    events: {
        onPanelChanged: ""
    },
    published: {
        url: ""
    },
    create: function() {
        this.inherited(arguments);
        this.urlChanged();
    },
    components: [
        {kind: "onyx.Toolbar", components: [
            {kind: "onyx.Button", content: $L("Back"), ontap: "goHome"},
            {content: $L("Phone Number")}

        ]},
        {tag: "div", style: "text-align: center", components: [
            {tag: "br"},
            {kind: "onyx.TextArea", style: "width: 90%", placeholder: $L("your number here"), name: "url"},
            {tag: "br"},
            {tag: "br"},
            {kind: "onyx.Button", style: "width: 90%",content:$L("Dial"), ontap: "dial"},
            {tag: "br"},
            {tag: "br"},
            {kind: "onyx.Button", style: "width: 90%", content:$L("Send SMS"), ontap: "sendSMS"},
            {tag: "br"},
            {tag: "br"},
            {kind: "onyx.Button", style: "width: 90%", content:$L("Add Contact"), ontap: "AddContact"}
        ]}
    ],
    urlChanged: function() {
        this.$.url.setValue(this.url);
        this.$.url.render();
    },
    goHome: function() {
        this.doPanelChanged({panel: "home"});
    },
    dial: function() {
        webActivities.DialActivity.dial(this.$.url.getValue());

    },
    sendSMS: function() {
        webActivities.NewActivity.new({type: "websms/sms", number: this.$.url.getValue()});
    },
    AddContact: function () {
        webActivities.NewActivity.new({type: "webcontacts/contact", params: {tel: this.$.url.getValue()}});
    }
});