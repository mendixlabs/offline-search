import { Component, createElement } from "react";
import { SearchBar, SearchBarProps } from "./components/SearchBar";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<SearchBarProps, {}> {
    render() {
        return (
            createElement("div", { className: "widget-offline-search" },
                createElement(SearchBar, this.transformProps(this.props))
            )
        );
    }

    private transformProps(props: SearchBarProps): SearchBarProps {
        return {
            defaultQuery: props.defaultQuery,
            placeHolder: props.placeHolder,
            searchAttribute: props.searchAttribute,
            searchEntity: props.searchEntity,
            searchMethod: props.searchMethod,
            showSearchBar: props.showSearchBar
        };
    }
}

export function getPreviewCss() {
    return require("./ui/OfflineSearch.css");
}
