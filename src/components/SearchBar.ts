import { Component, createElement } from "react";
import { HybridConstraint, ListView, WrapperProps } from "./OfflineSearch";

export interface SearchBarProps extends WrapperProps {
    listView?: ListView;
}

interface SearchBarState {
    hasQuery?: boolean;
}

export class SearchBar extends Component<SearchBarProps, SearchBarState> {
    private searchButton: HTMLButtonElement;
    private searchInput: HTMLInputElement;

    constructor(props: SearchBarProps) {
        super(props);

        this.state = {
            hasQuery: props.defaultQuery ? true : false
        };
        this.onClear = this.onClear.bind(this);
        this.onSearchKeyDown = this.onSearchKeyDown.bind(this);
        this.updateConstraints = this.updateConstraints.bind(this);
    }

    render() {
        if (this.props.showSearchBar) {
            return createElement("div", { className: "search-container" },
                createElement("span", { className: "glyphicon glyphicon-search" }),
                createElement("input", {
                    className: "form-control", placeholder: this.props.placeHolder ? this.props.placeHolder : "Search",
                    ref: input => this.searchInput = input as HTMLInputElement
                }),
                createElement("button", {
                    className: `btn-transparent ${this.state.hasQuery ? "visible" : "hidden"}`,
                    ref: button => this.searchButton = button as HTMLButtonElement
                },
                    createElement("span", { className: "glyphicon glyphicon-remove" })
                )
            );
        } else {
            return null;
        }
    }

    componentWillReceiveProps(nextProps: SearchBarProps) {
        if (nextProps.showSearchBar && nextProps.listView) {
            this.setUpEvents();
            this.setDefaultSearch(nextProps.defaultQuery);
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
        this.updateConstraints(this.props);
    }

    private onSearchKeyDown() {
        this.updateButtonVisibility();
        setTimeout((done) => {
            this.updateConstraints(this.props);
            done();
        }, 500);
    }

    private updateButtonVisibility() {
        if (this.searchInput.value.trim()) {
            this.setState({ hasQuery: true });
        } else {
            this.setState({ hasQuery: false });
        }
    }

    private updateConstraints(props: SearchBarProps) {
        if (props.listView && props.listView._datasource) {
            const datasource = props.listView._datasource;
            if (window.device) {
                const constraints: HybridConstraint = [];
                if (props.searchEntity) {
                    constraints.push({
                        attribute: props.searchAttribute,
                        operator: props.searchMethod,
                        path: props.searchEntity,
                        value: this.searchInput.value
                    });
                } else {
                    constraints.push({
                        attribute: props.searchAttribute,
                        operator: props.searchMethod,
                        value: this.searchInput.value
                    });
                }
                datasource._constraints = this.searchInput.value.trim() ? constraints : [];
            } else {
                const constraints: string[] = [];
                props.searchEntity
                    ?
                    constraints.push(`${props.searchEntity}[${props.searchMethod}(${props.searchAttribute},'${this.searchInput.value}')]`)
                    :
                    constraints.push(`${props.searchMethod}(${props.searchAttribute},'${this.searchInput.value}')`);
                datasource._constraints = this.searchInput.value.trim() ? "[" + constraints.join(" or ") + "]" : "";
            }

            props.listView.update();
        }
    }

    private onClear() {
        this.searchInput.value = "";
        this.updateButtonVisibility();
        this.updateConstraints(this.props);
    }
}
