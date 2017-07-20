import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import * as dijitRegistry from "dijit/registry";

import { Alert } from "./Alert";
import "../ui/OfflineSearch.css";

type SearchMethodOptions = "equals" | "contains";

interface ListView extends mxui.widget._WidgetBase {
    _datasource: {
        _constraints: Array<{
            attribute: string;
            operator: string;
        }>;
        _setSize: number;
        atEnd: () => boolean;
        _pageSize: number;
    };
    _loadMore: () => void;
    _onLoad: () => void;
    _renderData: () => void;
    update: () => void;
}

export interface OfflineSearchProps {
    defaultQuery: string;
    searchEntity: string;
    searchAttribute: string;
    showSearchBar: boolean;
    targetGridName: string;
    searchMethod: SearchMethodOptions;
}

interface OfflineSearchState {
    alertMessage?: string;
    buttonVisibility?: string;
}

export default class OfflineSearch extends Component<OfflineSearchProps, OfflineSearchState> {
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
        return (
            createElement("div", { className: "widget-offline-search" },
                createElement(Alert, { className: "danger", message: this.state.alertMessage }),
                this.props.showSearchBar
                    ?
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
                    : createElement("div", { className: "search-container-hidden" })
            ));
    }

    componentDidMount() {
        if (this.props.showSearchBar) {
            this.findListView();
            if (this.isValidWidget(this.targetWidget)) {
                this.setUpEvents();
                this.setDefaultSearch();
            }
        }
    }

    componentWillUnmount() {
        if (this.props.showSearchBar) {
            this.searchButton.removeEventListener("click", this.onClear);
            this.searchInput.removeEventListener("keyup", this.onSearchKeyDown);
        }
    }

    private findListView() {
        let queryNode = findDOMNode(this).parentNode as HTMLElement;
        let targetNode: HTMLElement | null = null;

        while (!targetNode) {
            targetNode = queryNode.querySelector(`.mx-name-${this.props.targetGridName}`) as HTMLElement;
            if (window.document.isEqualNode(queryNode)) break;
            queryNode = queryNode.parentNode as HTMLElement;
        }

        if (!targetNode) {
            this.setState({ alertMessage: `search offline widget: unable to find grid with the name "${this.props.targetGridName}"` });
        }

        this.targetWidget = targetNode ? dijitRegistry.byNode(targetNode) : null;
    }

    private isValidWidget(targetWidget: ListView): boolean {
        if (targetWidget && targetWidget.declaredClass === "mxui.widget.ListView") {
            if (
                targetWidget._onLoad &&
                targetWidget._loadMore &&
                targetWidget._renderData &&
                targetWidget._datasource &&
                targetWidget._datasource.atEnd &&
                typeof targetWidget._datasource._pageSize !== "undefined" &&
                typeof targetWidget._datasource._setSize !== "undefined"
            ) {
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
        this.searchInput.value = this.props.defaultQuery;
        this.updateConstraints(this);
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
        const datasource = self.targetWidget._datasource;
        let constraints = [ {
            attribute: self.props.searchAttribute,
            operator: self.props.searchMethod, value: self.searchInput.value
        } ];

        if (this.props.searchEntity) {
            constraints = [ {
                attribute: `${self.props.searchEntity}/${self.props.searchAttribute}`,
                operator: self.props.searchMethod, value: self.searchInput.value
            } ];
        }
        self.searchInput.value.trim() ? datasource._constraints = constraints : datasource._constraints = [];
        self.targetWidget.update();
    }

    private onClear(event: CustomEvent) {
        this.searchInput.value = "";
        this.updateButtonVisibility();
        this.updateConstraints(this);
    }
}
