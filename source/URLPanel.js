enyo.kind({
   name: "URLPanel",
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
        if (!navigator.onLine) {
            this.$.facebookButton.destroy();
        }
    },
   components: [
       {kind: "onyx.Toolbar", components: [
           {kind: "onyx.Button", content: $L("Back"), ontap: "goHome"},
           {content: $L("Web Address")}

       ]},
       {tag: "div", style: "text-align: center", components: [
           {tag: "br"},
            {kind: "onyx.TextArea", style: "width: 90%", placeholder: $L("your url here"), name: "url"},
           {tag: "br"},
           {tag: "br"},
           {kind: "onyx.Button", style: "width: 90%",content:$L("View URL"), ontap: "viewURL"},
           {tag: "br"},
           {tag: "br"},
           {kind: "onyx.Button", style: "width: 90%", content:$L("Share URL"), ontap: "shareURL"},
           {tag: "br"},
           {tag: "br"},
           {kind: "onyx.Button", style: "width: 90%", content:$L("Bookmark URL"), ontap: "AddBookmark"},
           {tag: "br"},
           {tag: "br"},
           {kind: "onyx.Button", name: "facebookButton", style: "width: 90%", content:$L("Share on Facebook"), ontap: "shareFacebook"}
       ]}
   ],
    urlChanged: function() {
        this.$.url.setValue(this.url);
        this.$.url.render();
    },
    goHome: function() {
        this.doPanelChanged({panel: "home"});
    },
    viewURL: function() {
        webActivities.ViewActivity.viewURL(this.$.url.getValue());
    },
    shareURL: function() {
        webActivities.ShareActivity.shareURL(this.$.url.getValue());
    },
    emailURL: function() {
        webActivities.NewActivity.new({url: "mailto:" + this.$.url.getValue() + "?body=teste"})
    },
    AddBookmark: function () {
        webActivities.SaveBookmarkActivity.save({type: "url", url: this.$.url.getValue()})
    },
    shareFacebook: function() {
        var theUrl = this.$.url.getValue();
        FB.ui(
            {
                method: 'feed',
                link: theUrl
            },
            function(response) {
                if (response && response.post_id) {
                    alert($L('Post Succeeded!'));
                } else {
                    alert($L('Post Failed :-('));
                }
            }
        );
    }
});