enyo.kind({
    name: "MailtoPanel",
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
            {content: "Endereço de Email"}

        ]},
        {tag: "div", style: "text-align: center", components: [
            {tag: "br"},
            {kind: "onyx.TextArea", style: "width: 90%", placeholder: "your email here", name: "url"},
            {tag: "br"},
            {tag: "br"},
            {kind: "onyx.Button", style: "width: 90%",content:"Enviar Email", ontap: "sendMail"},
            {tag: "br"},
            {tag: "br"},
            {kind: "onyx.Button", style: "width: 90%", content:"Compartilhar Email", ontap: "shareURL"},
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
    shareURL: function() {
        webActivities.ShareActivity.shareURL(this.$.url.getValue());
    },
    sendMail: function() {
        webActivities.NewActivity.new({url: "mailto:" + this.$.url.getValue()})
    },
    AddContact: function () {
        webActivities.NewActivity.new({type: "webcontacts/contact", params: {email: this.$.url.getValue()}});
    }
});