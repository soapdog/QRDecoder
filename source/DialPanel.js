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
            {kind: "onyx.Button", content: $L("Voltar"), ontap: "goHome"},
            {content: $L("Numero de Telefone")}

        ]},
        {tag: "div", style: "text-align: center", components: [
            {tag: "br"},
            {kind: "onyx.TextArea", style: "width: 90%", placeholder: $L("seu número aqui"), name: "url"},
            {tag: "br"},
            {tag: "br"},
            {kind: "onyx.Button", style: "width: 90%",content:$L("Discar"), ontap: "dial"},
            {tag: "br"},
            {tag: "br"},
            {kind: "onyx.Button", style: "width: 90%", content:$L("Enviar SMS"), ontap: "sendSMS"},
            {tag: "br"},
            {tag: "br"},
            {kind: "onyx.Button", style: "width: 90%", content:$L("Adicionar Contato"), ontap: "AddContact"}
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