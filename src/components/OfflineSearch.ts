import { Component, DOM, Props, createElement } from "react";
import { Alert } from "./Alert";

import * as dijitRegistry from "dijit/registry";

import "../ui/OfflineSearch.css";

// tslint:disable-next-line:max-line-length
type searchMethodOptions = "equals" | "lessThan" | "lessThanOrEquals" | "greaterThan" | "greaterThanOrEquals" | "contains";
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
interface OfflineSearchProps extends Props<OfflineSearch> {
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
    SearchButton: HTMLButtonElement;
    private searchInput: HTMLInputElement;
    private targetWidget: Grid;
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

    render() {
        return DOM.div({
            className: "widget-offline-search",
            ref: div => this.widgetSearchOffline = div ? div : HTMLElement.prototype
        },
            createElement(Alert, { message: this.state.alertMessage }),
            DOM.div({ className: "search-container" },
                DOM.span({ className: "glyphicon glyphicon-search" }),
                DOM.input({
                    className: "form-control", placeholder: "Search",
                    ref: input => this.searchInput = input ? input : HTMLInputElement.prototype
                }),
                DOM.button({
                    className: `btn-transparent ${this.state.buttonVisibility}`,
                    ref: button => this.SearchButton = button ? button : HTMLButtonElement.prototype
                },
                    DOM.span({ className: "glyphicon glyphicon-remove" })
                )
            )
        );
    }

    componentDidMount() {
        this.setUpEvents();
        this.findTargetNode();
    }

    componentWillUnmount() {
        this.SearchButton.removeEventListener("click", this.onClear);
        this.searchInput.removeEventListener("keyup", this.onSearchKeyDown);
    }

    private findTargetNode() {
        let queryNode = this.widgetSearchOffline.parentNode as HTMLElement;
        let targetNode: HTMLElement | null = null;
        const targetName = this.props.targetGridName;

        while (!targetNode) {
            targetNode = queryNode.querySelector(`.mx-name-${targetName}`) as HTMLElement;
            if (window.document.isEqualNode(queryNode)) break;
            queryNode = queryNode.parentNode as HTMLElement;
        }

        if (!targetNode) {
            this.setState({ alertMessage: `Unable to find grid with the name "${targetName}"` });
        } else {
            this.targetWidget = dijitRegistry.byNode(targetNode);
            if (!this.targetWidget) {
                this.setState({ alertMessage: "Found a DOM node but could not find the grid widget." });
            }
        }
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
        const datasource = grid._datasource ? grid._datasource : grid._dataSource;
        let constraints = `[${self.props.searchMethod}(${self.props.searchAttribute},'${self.searchInput.value}')]`;

        if (this.props.searchEntity) {
            // tslint:disable-next-line:max-line-length
            constraints = `${self.props.searchEntity}[${self.props.searchMethod}(${self.props.searchAttribute},'${self.searchInput.value}')]`;
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
