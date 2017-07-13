import { Component, Props, createElement } from "react";
import { findDOMNode } from "react-dom";

import * as dijitRegistry from "dijit/registry";

import { Alert } from "./Alert";
import "../ui/OfflineSearch.css";

type searchMethodOptions = "equals" | "lessThan" | "lessThanOrEquals" | "greaterThan" | "greaterThanOrEquals" | "contains";

interface ListView extends mxui.widget._WidgetBase {
    _datasource: {
        _constraints: string | null;
        _setsize: number;
        _setSize: number;
        atEnd: () => boolean;
        _pageSize: number;
    };
    _loadMore: () => void;
    _onLoad: () => void;
    _renderData: () => void;
    update: () => void;
}

interface OfflineSearchProps extends Props<OfflineSearch> {
    defaultQuery: string;
    searchEntity: string;
    searchAttribute: string;
    targetGridName: string;
    searchMethod: searchMethodOptions;
}

interface OfflineSearchState {
    alertMessage?: string;
    buttonVisibility?: string;
}

class OfflineSearch extends Component<OfflineSearchProps, OfflineSearchState> {
    // internal variables
    private searchButton: HTMLButtonElement;
    private searchInput: HTMLInputElement;
    private targetWidget: ListView;

    constructor(props: OfflineSearchProps) {
        super(props);

        this.state = {
            alertMessage: "",
            buttonVisibility: "hidden"
        };
        this.onClear = this.onClear.bind(this);
        this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
    }

    render() {
        return createElement("div", {
            className: "widget-offline-search"
        },
            createElement(Alert, { message: this.state.alertMessage }),
            createElement("div", { className: "search-container" },
                createElement("span", { className: "glyphicon glyphicon-search" }),
                createElement("input", {
                    className: "form-control", placeholder: "Search",
                    ref: input => this.searchInput = input as HTMLInputElement
                }),
                createElement("button", {
                    className: `btn-transparent ${this.state.buttonVisibility}`,
                    ref: button => this.searchButton = button as HTMLButtonElement
                },
                    createElement("span", { className: "glyphicon glyphicon-remove" })
                )
            )
        );
    }

    componentDidMount() {
        this.findTargetNode();
        this.isValidWidget();
        this.setUpEvents();
        this.setDefaultSearch();
    }

    componentWillUnmount() {
        this.searchButton.removeEventListener("click", this.onClear);
        this.searchInput.removeEventListener("keyup", this.onSearchKeyDown);
    }

    private findTargetNode() {
        let queryNode = findDOMNode(this).parentNode as HTMLElement;
        let targetNode: HTMLElement | null = null;
        const targetName = this.props.targetGridName;

        while (!targetNode) {
            targetNode = queryNode.querySelector(`.mx-name-${targetName}`) as HTMLElement;
            if (window.document.isEqualNode(queryNode)) break;
            queryNode = queryNode.parentNode as HTMLElement;
        }

        if (!targetNode) {
            this.setState({ alertMessage: `search offline widget: unable to find grid with the name "${targetName}"` });
        } else {
            this.targetWidget = dijitRegistry.byNode(targetNode);
        }
    }

    private isValidWidget(): boolean {
        if (this.targetWidget && this.targetWidget.declaredClass === "mxui.widget.ListView") {
            if (this.targetWidget._onLoad
                && this.targetWidget._loadMore
                && this.targetWidget._renderData
                && this.targetWidget._datasource
                && this.targetWidget._datasource.atEnd
                && typeof this.targetWidget._datasource._pageSize !== "undefined"
                && (typeof this.targetWidget._datasource._setsize !== "undefined"
                || typeof this.targetWidget._datasource._setSize !== "undefined")) {
                    return true;
            } else {
                this.setState({ alertMessage: "search offline widget: this Mendix version is incompatible with the offline search widget" });
            }
        } else {
            this.setState({ alertMessage: `search offline widget: supplied target name "${this.props.targetGridName}" is not of the type listview` });
        }

        return false;
    }

    private setUpEvents() {
        this.searchButton.addEventListener("click", this.onClear);
        this.searchInput.addEventListener("keyup", this.onSearchKeyDown);
    }

    private setDefaultSearch() {
        if (this.isValidWidget()) {
            this.searchInput.value = this.props.defaultQuery;
            this.updateConstraints(this);
        }
    }

    private onSearchKeyDown(event: CustomEvent) {
        if (this.isValidWidget()) {
            this.updateButtonVisibility();
            const searchTimeout = setTimeout(this.updateConstraints(this), 500);
            clearTimeout(searchTimeout);
        }
    }

    private updateButtonVisibility() {
        if (this.searchInput.value.trim()) {
            this.setState({ buttonVisibility: "visible" });
        } else {
            this.setState({ buttonVisibility: "hidden" });
        }
    }

    private updateConstraints(self: OfflineSearch) {
        const datasource = self.targetWidget._datasource;
        let constraints = `[${self.props.searchMethod}(${self.props.searchAttribute},'${self.searchInput.value}')]`;

        if (this.props.searchEntity) {
            constraints = `[${self.props.searchMethod}(${self.props.searchEntity}/${self.props.searchAttribute},'${self.searchInput.value}')]`;
        }
        self.searchInput.value.trim() ? datasource._constraints = constraints : datasource._constraints = null;
        self.targetWidget.update();
    }

    private onClear(event: CustomEvent) {
        this.searchInput.value = "";
        this.updateButtonVisibility();
        this.updateConstraints(this);
    }
}
export { OfflineSearch as default };
