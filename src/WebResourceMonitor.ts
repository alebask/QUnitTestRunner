/// <reference path="xrmquery.ts" />

namespace QUnitTestRunner {
    /**
    * Enables monitoring of modifications of web resourses on crm form and executes a callback when modification detected
    */
    export class WebResourceMonitor {
        private clientTimeStamp = new Date();
        private timer = null; // for setInterval/clearInterval
        private started = false;
        private interval: number = 1000; // 1 sec
        private enabled: boolean = true;

        private webResources = new Array<string>();
        private xrmQuery = new XrmQuery();

        public onChange: Function;
        public includeCurrentFormResources: boolean = false;
        
        constructor(interval: number, enabled: boolean, onChange?: Function) {
            this.interval = interval;
            this.enabled = enabled;
            if (onChange) {
                this.onChange = onChange;
            }
        }

        public addResources(urls: Array<string>) {
            urls.forEach((url: string) => {
                url = url.substring(url.lastIndexOf("/") + 1);
                if (this.webResources.indexOf(url) === -1) {
                    this.webResources.push(url);
                }
            });
        }

        /**
         * starts monitoring modifications of web resources
         */
        public start() {
            if (!this.xrmQuery.getXrmPage()) {
                console.warn("WebResourceMonitor.start(): no Xrm.Page found");
                return;
            }
            if (!this.enabled) {
                console.warn("WebResourceMonitor.start(): WebResourceChangeMonitor disabled");
                return;
            }
            if (this.started) {
                console.warn("WebResourceeMonitor.start(): already started");
                return;
            }

            if (this.includeCurrentFormResources) {
                var formResources = this.xrmQuery.retrieveCurrentFormWebResources();
                this.webResources = this.webResources.concat(formResources);
            }
            if (this.webResources.length < 1) {
                console.warn("WebResourceMonitor.start(): no resources to monitor");
                return;
            }

            this.timer = setInterval(() => this.timerElapsed(), this.interval);

            console.log("WebResourceMonitor started on resources " + this.webResources.join(", "));

            this.started = true;
        }

        /**
         * stops monitoring modifications of web resources
         */
        public stop() {
            if (this.timer) {
                clearInterval(this.timer);
            }
            this.started = false;
            console.log("WebResourceMonitor stopped on resources " + this.webResources.join(", "));
        }

        private timerElapsed() {
            this.xrmQuery.retrieveWebResourceChangeDates(this.webResources,
                (dates: Date[]) => {
                    var serverTimeStamp = dates.reduce((d1: Date, d2: Date) => { return d1 > d2 ? d1 : d2; }); // max date in array
                    if (serverTimeStamp > this.clientTimeStamp) {
                        this.clientTimeStamp = serverTimeStamp;
                        if (this.onChange) {
                            this.onChange(serverTimeStamp);
                        }
                    }
                },
                () => this.stop());
        }
    }
}