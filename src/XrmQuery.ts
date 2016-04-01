﻿namespace QUnitTestRunner {
    export class XrmQuery {
        
        public getXrmPage(): any {
            if (window.Xrm && window.Xrm.Page) {
                return window.Xrm.Page;
            }
            return undefined;
        }

        public getClientUrl(): string {
            return this.getXrmPage().context.getClientUrl();
        }
        public getOrganizationServiceUrl(): string {
            return this.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/";
        }
        public getCurrentFormId(): string {
            return this.getXrmPage().ui.formSelector.getCurrentItem().getId();
        }

        public retrieveCurrentFormWebResources(): string[] {
            var names = new Array<string>();

            var query = "SystemFormSet(guid'" + this.getCurrentFormId() + "')?$select=FormXml";

            this.sendRequest(query, false,
                (response: any) => {
                    var formXml = response.FormXml;
                    var parser = new DOMParser();
                    var xmlDoc = parser.parseFromString(formXml, "text/xml");
                    var nodes = xmlDoc.getElementsByTagName("Library");
                    for (var i = 0; i < nodes.length; i++) {
                        names.push(nodes[i].getAttribute("name"));
                    }
                });

            return names;
        }
        public retrieveWebResourceChangeDates(resourceNames: string[], callback: (dates: Date[]) => any, onError?: Function): void {
            var filter = this.createNameEndWithFilter(resourceNames);
            var query = "WebResourceSet?$select=ModifiedOn&" + filter;

            this.sendRequest(query, true,
                (response: any) => {
                    var results = response.results;
                    var dates = new Array<Date>();
                    for (var i = 0; i < results.length; i++) {
                        var ms = parseInt(results[i].ModifiedOn.replace("/Date(", "").replace(")/", ""), 10);
                        var modifiedOn = new Date(ms);
                        dates.push(modifiedOn);
                    }
                    if (callback) {
                        callback(dates);
                    }
                },
                onError
            );
        }

        private sendRequest(query: string, async: boolean, onSuccess: (response: any) => any, onError?: Function) {
            // generated by CRM REST Builder
            var req = new XMLHttpRequest();
            req.open("GET", this.getOrganizationServiceUrl() + query, async);
            req.setRequestHeader("Accept", "application/json");
            req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            req.onreadystatechange = function () {
                if (this.readyState === 4) {
                    this.onreadystatechange = null;
                    if (this.status === 200) {
                        var response = JSON.parse(this.responseText).d;
                        if (onSuccess) {
                            onSuccess(response);
                        }
                    } else {
                        console.log("XrmQuery failed with status " + this.statusText + ". Query: " + query);
                        if (onError) {
                            onError(this.statusText);
                        }
                    }
                }
            };
            req.send();
        }

        private createNameEndWithFilter(resourceNames: string[]): string {
            var nameFilters = [];
            resourceNames.forEach((name: string) => {
                nameFilters.push("endswith(Name, '" + name + "')");
            });
            var filter = "$filter = " + nameFilters.join(" or ");
            return filter;
        }
    }
}