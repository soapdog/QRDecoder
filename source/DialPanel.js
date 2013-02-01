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
            {kind: "onyx.Button", content: "Voltar", ontap: "goHome"},
            {content: "Número de Telefone"}

        ]},
        {tag: "div", style: "text-align: center", components: [
            {tag: "br"},
            {kind: "onyx.TextArea", style: "width: 90%", placeholder: "seu número aqui", name: "url"},
            {tag: "br"},
            {tag: "br"},
            {kind: "onyx.Button", style: "width: 90%",content:"Discar", ontap: "dial"},
            {tag: "br"},
            {tag: "br"},
            {kind: "onyx.Button", style: "width: 90%", content:"Enviar SMS", ontap: "sendSMS"},
            {tag: "br"},
            {tag: "br"},
            {kind: "onyx.Button", style: "width: 90%", content:"Adicionar Contato", ontap: "AddContact"}
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