import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoLang from "dojo/_base/lang";
import * as dojoOn from "dojo/on";
import * as dojoClass from "dojo/dom-class";
import * as dijitRegistry from "dijit/registry";

// tslint:disable-next-line:max-line-length
type searchMethodParamOptions = "equals" | "lessThan" | "lessThanOrEquals" |"greaterThan" | "greaterThanOrEquals" | "contains";

import "./ui/OfflineSearch.css";

interface Grid extends mxui.widget._WidgetBase {
    _datasource: {
        _constraints: string | null;
    };
    _dataSource: {
        _constraints: string | null;
    };
    update: () => void;
    reload: () => void;
}

class OfflineSearch extends WidgetBase {
    // modeler
    gridEntity: string;
    searchEntity: string;
    searchAttribute: string;
    targetGridName: string;
    searchMethodParam: searchMethodParamOptions;
    buttonNode: HTMLButtonElement;
    // internal variables
    private mxObject: mendix.lib.MxObject;
    private buttonEvent: dojoEvent;
    private searchNodeEvent: dojoEvent;
    private searchNode: HTMLInputElement;
    private targetWidget: Grid;
    private targetNode: HTMLElement | null;

    postCreate() {
        this.setUpWidgetDom();
    }

    update(mxObject: mendix.lib.MxObject, callback?: () => void) {
        this.mxObject = mxObject;
        this.targetNode = this.findTargetNode(this.targetGridName, this.domNode);
        this.setUpEvents();
        if (this.targetNode) {
            this.targetWidget = dijitRegistry.byNode(this.targetNode);
            if (this.targetWidget) {
                this.searchNodeEvent = dojoOn(this.searchNode, "keyup", dojoLang.hitch(this, this.onSearchKeyDown));
            } else {
                this.showError("Found a DOM node but could not find the grid widget.");
            }
        } else {
            this.showError("Could not find the list node.");
        }

        if (callback) {
            callback();
        }
    }

    uninitialize(): boolean {
        this.removeEvents();

        return true;
    }

    private setUpWidgetDom() {
        domConstruct.create("div", {
            class: "widget-offline-search",
            innerHTML: `
                    <div class="search-container">
                        <span class="glyphicon glyphicon-search"> </span>
                        <input type="search" placeholder="Search" class="form-control"value="">
                        <button class="btn-transparent hidden">
                            <span class="glyphicon glyphicon-remove"></span>
                        </button>
                    </div>`
        }, this.domNode);
        this.buttonNode = this.domNode.getElementsByTagName("button")[0] as HTMLButtonElement;
        this.searchNode = this.domNode.getElementsByTagName("input")[0] as HTMLInputElement;
    }

    private findTargetNode(targetName: string, domNode: HTMLElement): HTMLElement | null {
        let queryNode = domNode.parentNode as HTMLElement;
        let targetNode: HTMLElement | null = null;
        while (!targetNode) {
            targetNode = queryNode.querySelector(`.mx-name-${targetName}`) as HTMLElement;
            if (window.document.isEqualNode(queryNode)) break;
            queryNode = queryNode.parentNode as HTMLElement;
        }

        if (!targetNode) {
            this.showError(`Unable to find list view with the name "${targetName}"`);
        }

        return targetNode;
    }

    private showError(message: string) {
        if (message) {
            domConstruct.create("div", {
                class: "alert alert-danger",
                innerHTML: message
            }, this.domNode);
        }
    }

    private setUpEvents() {
        this.buttonEvent = dojoOn(this.buttonNode, "click", dojoLang.hitch(this, this.onClear));
    }

    private removeEvents() {
        if (this.buttonEvent) {
            this.buttonEvent.remove();
        }
        if (this.searchNodeEvent) {
            this.searchNodeEvent.remove();
        }
    }

    private onSearchKeyDown(event: CustomEvent) {
        this.updateButtonVisibility();
        const searchTimeout = setTimeout(this.updateConstraints(this), 500);
        clearTimeout(searchTimeout);
    }

    private updateButtonVisibility() {
        if (this.searchNode.value.trim()) {
            dojoClass.remove(this.buttonNode, "hidden");
        } else {
            dojoClass.add(this.buttonNode, "hidden");
        }
    }

    private updateConstraints(self: OfflineSearch) {
        const grid = self.targetWidget;
        // using datasource variable because in Mendix API `Template grid` uses dataSource for data
        let datasource = grid._datasource;
        if (!grid._datasource) {
            datasource = grid._dataSource;
        }
        const constraints = `[${self.searchMethodParam}(${self.searchAttribute},'${self.searchNode.value}')]`;
        self.searchNode.value.trim() ? datasource._constraints = constraints : datasource._constraints = null;
        if (grid.reload) {
            // data grid and template grid
            grid.reload();
        } else {
            // list view
            grid.update();
        }
    }

    private onClear(event: CustomEvent) {
        this.searchNode.value = "";
        this.updateButtonVisibility();
        this.updateConstraints(this);
    }
}
// tslint:disable : only-arrow-functions
dojoDeclare("OfflineSearch.widget.OfflineSearch", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const property in Source.prototype) {
        if (property !== "constructor" && Source.prototype.hasOwnProperty(property)) {
            result[property] = Source.prototype[property];
        }
    }
    return result;
}(OfflineSearch));
