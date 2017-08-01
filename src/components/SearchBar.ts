import { Component, createElement } from "react";
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

        this.state = {
            query: ""
        };
        this.updateConstraints = this.updateConstraints.bind(this);
    }

    render() {
        if (this.props.showSearchBar) {
            return createElement("div", { className: "search-container" },
                createElement("span", { className: "glyphicon glyphicon-search" }),
                createElement("input", {
                    className: "form-control",
                    onChange: (event: React.FormEvent<HTMLInputElement>) => this.setState({ query: event.currentTarget.value as string }),
                    placeholder: this.props.placeHolder ? this.props.placeHolder : "Search",
                    value: this.state.query
                }),
                createElement("button", {
                    className: `btn-transparent ${this.state.query ? "visible" : "hidden"}`,
                    onClick: () => this.setState({ query: "" })
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
            setTimeout((done) => {
                this.updateConstraints();
                done();
            }, 500);
        }
    }

    private updateConstraints() {
        let constraints: HybridConstraint | string = [];

        if (this.props.listView && this.props.listView._datasource) {
            const datasource = this.props.listView._datasource;
            if (window.device) {
                if (this.props.searchEntity) {
                    constraints.push({
                        attribute: this.props.searchAttribute,
                        operator: this.props.searchMethod,
                        path: this.props.searchEntity,
                        value: this.state.query
                    });
                } else {
                    constraints.push({
                        attribute: this.props.searchAttribute,
                        operator: this.props.searchMethod,
                        value: this.state.query
                    });
                }
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
