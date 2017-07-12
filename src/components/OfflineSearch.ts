import { Component, DOM, Props, createElement } from "react";
import { Alert } from "./Alert";

import * as dijitRegistry from "dijit/registry";

import "../ui/OfflineSearch.css";

// tslint:disable-next-line:max-line-length
type searchMethodOptions = "equals" |"lessThan" | "lessThanOrEquals" |"greaterThan" | "greaterThanOrEquals" | "contains";

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

export interface OfflineSearchProps extends Props<OfflineSearch> {
    searchEntity: string;
    searchAttribute: string;
    targetGridName: string;
    searchMethod: searchMethodOptions;
}

export interface OfflineSearchState {
    alertMessage?: string;
    buttonVisibility?: string;
}

class OfflineSearch extends Component<OfflineSearchProps, OfflineSearchState> {
    // internal variables
    SearchButton: HTMLButtonElement;
    private searchInput: HTMLInputElement;
    private targetWidget: Grid;
    private targetNode: HTMLElement | null;
    private widgetSearchOffline: HTMLElement;

    constructor(props: OfflineSearchProps) {
        super(props);

        this.state = {
            alertMessage: "",
            buttonVisibility: "hidden"
        };
        this.onClear = this.onClear.bind(this);
        this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
    }

    // tslint:disable:max-line-length
    render() {
        return DOM.div({ className: "widget-offline-search", ref: div => this.widgetSearchOffline = div ? div : HTMLElement.prototype },
            createElement(Alert, { message: this.state.alertMessage }),
            DOM.div({ className: "search-container" },
                DOM.span({ className: "glyphicon glyphicon-search" }),
                DOM.input({ className: "form-control", placeholder: "Search", ref: input => this.searchInput = input ? input : HTMLInputElement.prototype }),
                DOM.button({ className: `btn-transparent ${this.state.buttonVisibility}`, ref: button => this.SearchButton = button ? button : HTMLButtonElement.prototype },
                    DOM.span({ className: "glyphicon glyphicon-remove" })
                )
            )
        );
    }

    componentDidMount() {
        this.setUpEvents();
        this.targetNode = this.findTargetNode(this.props.targetGridName);
        if (this.targetNode) {
            this.targetWidget = dijitRegistry.byNode(this.targetNode);
            if (!this.targetWidget) {
                this.setState({ alertMessage: "Found a DOM node but could not find the grid widget." });
            }
        } else {
            this.setState({ alertMessage: "Could not find the list node." });
        }
    }

    componentWillUnmount() {
        this.SearchButton.removeEventListener("click", this.onClear);
        this.searchInput.removeEventListener("keyup", this.onSearchKeyDown);
    }

    private findTargetNode(targetName: string): HTMLElement | null {
        let queryNode = this.widgetSearchOffline.parentNode as HTMLElement;
        let targetNode: HTMLElement | null = null;
        while (!targetNode) {
            targetNode = queryNode.querySelector(`.mx-name-${targetName}`) as HTMLElement;
            if (window.document.isEqualNode(queryNode)) break;
            queryNode = queryNode.parentNode as HTMLElement;
        }

        if (!targetNode) {
            this.setState({ alertMessage: `Unable to find grid with the name "${targetName}"` });
        }

        return targetNode;
    }

    private setUpEvents() {
        this.SearchButton.addEventListener("click", this.onClear);
        this.searchInput.addEventListener("keyup", this.onSearchKeyDown);
    }

    private onSearchKeyDown(event: CustomEvent) {
        this.updateButtonVisibility();
        const searchTimeout = setTimeout(this.updateConstraints(this), 500);
        clearTimeout(searchTimeout);
    }

    private updateButtonVisibility() {
        if (this.searchInput.value.trim()) {
            this.setState({ buttonVisibility: "visible" });
        } else {
            this.setState({ buttonVisibility: "hidden" });
        }
    }

    private updateConstraints(self: OfflineSearch) {
        const grid = self.targetWidget;
        // using datasource variable because in Mendix API `Template grid` uses dataSource for data
        let datasource = grid._datasource;
        let constraints = `[${self.props.searchMethod}(${self.props.searchAttribute},'${self.searchInput.value}')]`;

        if (!grid._datasource) {
            datasource = grid._dataSource;
        }
        if (this.props.searchEntity) {
            constraints = `${self.props.searchEntity} [${self.props.searchMethod}(${self.props.searchAttribute},'${self.searchInput.value}')]`;
        }
        self.searchInput.value.trim() ? datasource._constraints = constraints : datasource._constraints = null;
        if (grid.reload) {
            // data grid and template grid
            grid.reload();
        } else {
            // list view
            grid.update();
        }
    }

    private onClear(event: CustomEvent) {
        this.searchInput.value = "";
        this.updateButtonVisibility();
        this.updateConstraints(this);
    }
}
export { OfflineSearch as default };
