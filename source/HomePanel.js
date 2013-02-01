enyo.kind({
    name: "HomePanel",
    kind: "FittableRows",
    fit: true,
    events: {
        onPanelChanged: ""
    },
    components:[
        {kind: "PortsHeader",
            title: "QR Decoder",
            //style: "background-color: #ff4e00;",
            taglines: [
                "Quadradinhos por todos os lados!",
                "The Power To Decode!",
                "Cade o QR Code?"
            ]
        },
        {
            kind: "webActivities.PickActivity",
            name: "picker",
            onsuccess: "picksuccess",
            onerror: "pickerror",
            type:["image/png", "image/jpg", "image/jpeg"]
        },
        {tag: "div", fit: true,  style: "text-align:center", components: [
            {name: "scan", content: "Toque Para Escanear"},
            {kind: "enyo.Image", src: "assets/touchbutton.png",  ontap: "scanqrcode", style: "width: 80%; height: auto"}
        ]},
        {kind: "onyx.Button", classes: "onyx-dark", name: "installButton", style: "height: 70px; width: 100%", content: "Toque para instalar", ontap: "installApp"}


    ],
    create: function() {
        this.inherited(arguments);
        this.log("Platform is: " + enyo.platform.firefoxOS);
        this.log("Checking if QR Decoder is installed...");
        if (enyo.WebAppInstaller.check(enyo.bind(this, function(response){
            if (response && response.type == "mozilla" && response.installed) {
                // App Installed.
                this.log("App is installed!");
                this.$.installButton.destroy();
            } else {
                this.log("App is not installed!");
            }
        })));
    },
    installApp: function(inSender, inEvent) {
        this.log("installing app");
        enyo.WebAppInstaller.install();
    },
    scanqrcode: function(inSender, inEvent) {
        this.log(inSender.name);
        this.$.picker.pick();
    },
    picksuccess: function(inResult) {
        this.log("pick success callback!");

        this.$.scan.setContent("Processando... (pode demorar um pouco)");
        this.$.scan.render();
        qrcode.callback = enyo.bind(this, function(data) {
           this.processQRData(data);
        });
        this.imageBlob = inResult.blob;
        this.retried = false;
        qrcode.decode(window.URL.createObjectURL(this.imageBlob));

    },
    pickerror: function(inResult) {
        this.log("pick error callback!");
        console.log(inResult);
    },
    processQRData: function(inData) {
        this.log("QR Code: " + inData);
        this.$.scan.setContent("Toque Para Escanear");
        this.$.scan.render();

        // Check for error!
        if (inData.indexOf("error decoding") != -1) {
            // Sharpen image...
            alert("Não foi possível decodificar o QR code.");
            return true;
        }

        // Check for URL
        if (inData.indexOf("http://") != -1 || inData.indexOf("https://") != -1) {
            // it is a URL!!! View it.
            this.doPanelChanged({panel: "url", url: inData});
            return true;
        }

        // Check for URL
        if (inData.indexOf("www.") != -1) {
            // it is a URL!!! View it.
            this.doPanelChanged({panel: "url", url: "http://" + inData});
            return true;
        }


        // Check for mail
        if (inData.indexOf("mailto:") != -1 || inData.indexOf("@") != -1) {
            this.doPanelChanged({panel: "mail", url: inData});
            return true;
        }

        // Check for telephone
        if (inData.indexOf("tel:") != -1 || inData.indexOf("TEL:") != -1) {
            var number = inData.toUpperCase().replace("TEL:","");
            this.doPanelChanged({panel: "dial", url: number});
            return true;
        }

        // Check for SMS
        if (inData.indexOf("sms:") != -1 || inData.indexOf("SMS:") != -1) {
            var number = inData.toUpperCase().replace("SMS:","");
            this.doPanelChanged({panel: "dial", url: number});
            return true;
        }

        if (inData.indexOf("SMSTO:") != 1) {
            var number = inData.toUpperCase().replace("SMSTO:","");
            this.doPanelChanged({panel: "dial", url: number});
            return true;
        }
    }
});
