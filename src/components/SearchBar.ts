import { Component, FormEvent, createElement } from "react";
import * as classNames from "classnames";

export interface CommonProps {
    class?: string;
    defaultQuery: string;
    placeHolder: string;
    showSearchBar: boolean;
}

export interface SearchBarProps extends CommonProps {
    style: object;
    onTextChangeAction?: (query: string) => void;
}

export interface SearchBarState {
    query: string;
}

export class SearchBar extends Component<SearchBarProps, SearchBarState> {

    constructor(props: SearchBarProps) {
        super(props);

        this.state = { query: "" };
        this.updateQuery = this.updateQuery.bind(this);
        this.resetQuery = this.resetQuery.bind(this);
    }

    render() {
        if (this.props.showSearchBar) {
            return createElement("div",
                {
                    className: classNames("widget-offline-search", this.props.class),
                    style: this.props.style
                },
                createElement("div", { className: "search-container" },
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
                this.props.onTextChangeAction(this.state.query);
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

    public static parseStyle = (style = ""): {[key: string]: string} => {
        try {
            return style.split(";").reduce<{[key: string]: string}>((styleObject, line) => {
                const pair = line.split(":");
                if (pair.length === 2) {
                    const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                    styleObject[name] = pair[1].trim();
                }
                return styleObject;
            }, {});
        } catch (error) {
            // tslint:disable-next-line no-console
            window.console.log("Failed to parse style", style, error);
        }

        return {};
    }
}
