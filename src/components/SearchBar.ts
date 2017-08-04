import { Component, FormEvent, createElement } from "react";

import { HybridConstraint, ListView, WrapperProps } from "./OfflineSearch";

export interface SearchBarProps extends WrapperProps {
    listView?: ListView;
}

interface SearchBarState {
    query: string;
}

export class SearchBar extends Component<SearchBarProps, SearchBarState> {

    constructor(props: SearchBarProps) {
        super(props);

        this.state = { query: "" };
        this.updateConstraints = this.updateConstraints.bind(this);
        this.updateQuery = this.updateQuery.bind(this);
        this.resetQuery = this.resetQuery.bind(this);
    }

    render() {
        if (this.props.showSearchBar) {
            return createElement("div", { className: "search-container" },
                createElement("span", { className: "glyphicon glyphicon-search" }),
                createElement("input", {
                    className: "form-control",
                    onChange: this.updateQuery,
                    placeholder: this.props.placeHolder,
                    value: this.state.query
                }),
                createElement("button",
                    {
                        className: `btn-transparent ${this.state.query ? "visible" : "hidden"}`,
                        onClick: this.resetQuery
                    },
                    createElement("span", { className: "glyphicon glyphicon-remove" })
                )
            );
        } else {
            return null;
        }
    }

    componentDidMount() {
        this.setState({ query: this.props.defaultQuery });
    }

    componentDidUpdate(_prevProps: SearchBarProps, prevState: SearchBarState) {
        if (this.state.query !== prevState.query) {
            setTimeout(() => {
                this.updateConstraints();
            }, this.geTimeOut());
        }
    }

    private geTimeOut(): number {
        return this.props.showSearchBar || this.props.defaultQuery ? 0 : 500;
    }

    private updateQuery(event: FormEvent<HTMLInputElement>) {
        this.setState({ query: event.currentTarget.value });
    }

    private resetQuery() {
        this.setState({ query: "" });
    }

    private updateConstraints() {
        let constraints: HybridConstraint | string = [];

        if (this.props.listView && this.props.listView._datasource) {
            const datasource = this.props.listView._datasource;
            if (window.device) {
                constraints.push({
                    attribute: this.props.searchAttribute,
                    operator: this.props.searchMethod,
                    path: this.props.searchEntity,
                    value: this.state.query
                });
                datasource._constraints = this.state.query ? constraints : [];
            } else {
                constraints = this.props.searchEntity
                    ? `${this.props.searchEntity}[${this.props.searchMethod}(${this.props.searchAttribute},'${this.state.query}')]`
                    : `${this.props.searchMethod}(${this.props.searchAttribute},'${this.state.query}')`;
                datasource._constraints = this.state.query ? "[" + constraints + "]" : "";
            }

            this.props.listView.update();
        }
    }
}
