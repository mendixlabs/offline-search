import { Component, createElement } from "react";
import { HybridConstraint, ListView, WrapperProps } from "./OfflineSearch";

export interface SearchBarProps extends WrapperProps {
    listView?: ListView;
}

interface SearchBarState {
    buttonVisibility?: string;
}

export class SearchBar extends Component<SearchBarProps, SearchBarState> {
    // internal variables
    private searchButton: HTMLButtonElement;
    private searchInput: HTMLInputElement;

    constructor(props: SearchBarProps) {
        super(props);

        this.state = {
            buttonVisibility: "hidden"
        };
        this.onClear = this.onClear.bind(this);
        this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
    }

    render() {
        return this.props.showSearchBar
            ?
            createElement("div", { className: "search-container" },
                createElement("span", { className: "glyphicon glyphicon-search" }),
                createElement("input", {
                    className: "form-control", placeholder: this.props.placeHolder ? this.props.placeHolder : "Search",
                    ref: input => this.searchInput = input as HTMLInputElement
                }),
                createElement("button", {
                    className: `btn-transparent ${this.state.buttonVisibility}`,
                    ref: button => this.searchButton = button as HTMLButtonElement
                },
                    createElement("span", { className: "glyphicon glyphicon-remove" })
                )
            )
            : createElement("div", { className: "search-container-hidden" });
    }

    componentWillReceiveProps(nextProps: SearchBarProps) {
        if (this.props.showSearchBar && this.props.listView) {
            this.setUpEvents();
            this.setDefaultSearch(this.props.defaultQuery);
        }
    }

    componentWillUnmount() {
        if (this.props.showSearchBar && this.props.listView) {
            this.searchButton.removeEventListener("click", this.onClear);
            this.searchInput.removeEventListener("keyup", this.onSearchKeyDown);
        }
    }

    private setUpEvents() {
        this.searchButton.addEventListener("click", this.onClear);
        this.searchInput.addEventListener("keyup", this.onSearchKeyDown);
    }

    private setDefaultSearch(query: string) {
        this.searchInput.value = query;
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

    private updateConstraints(self: SearchBar) {
        if (self.props.listView) {
            const datasource = self.props.listView._datasource;
            if (window.device) {
                const constraints: HybridConstraint = [];
                if (this.props.searchEntity) {
                    constraints.push({
                        attribute: self.props.searchAttribute,
                        operator: self.props.searchMethod,
                        path: self.props.searchEntity,
                        value: self.searchInput.value
                    });
                } else {
                    constraints.push({
                        attribute: self.props.searchAttribute,
                        operator: self.props.searchMethod,
                        value: self.searchInput.value
                    });
                }
                self.searchInput.value.trim() ? datasource._constraints = constraints : datasource._constraints = [];
            } else {
                const constraints: string[] = [];
                this.props.searchEntity
                    ?
                    constraints.push(`${self.props.searchEntity}[${self.props.searchMethod}(${self.props.searchAttribute},'${self.searchInput.value}')]`)
                    :
                    constraints.push(`${self.props.searchMethod}(${self.props.searchAttribute},'${self.searchInput.value}')`);
                self.searchInput.value.trim() ? datasource._constraints = "[" + constraints.join(" or ") + "]" : datasource._constraints = "";
            }

            self.props.listView.update();
        }
    }

    private onClear(event: CustomEvent) {
        this.searchInput.value = "";
        this.updateButtonVisibility();
        this.updateConstraints(this);
    }
}
