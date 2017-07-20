import { Component, createElement } from "react";
import OfflineSearch, { OfflineSearchProps } from "./components/OfflineSearch";

declare function require(name: string): string;

// tslint:disable-next-line class-name
export class preview extends Component<OfflineSearchProps, {}> {
    render() {
        return createElement(OfflineSearch, this.transformProps(this.props));
    }

    private transformProps(props: OfflineSearchProps): OfflineSearchProps {
        return {
            defaultQuery: props.defaultQuery,
            searchAttribute: props.searchAttribute,
            searchEntity: props.searchEntity,
            searchMethod: props.searchMethod,
            showSearchBar: props.showSearchBar,
            targetGridName: props.targetGridName
        };
    }
}

export function getPreviewCss() {
    return require("./ui/OfflineSearch.css");
}
