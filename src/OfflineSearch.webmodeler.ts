import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { OfflineSearchProps, OfflineSearchState } from "./components/OfflineSearch";
import { SearchBar, SearchBarProps } from "./components/SearchBar";
import { ValidateConfigs } from "./components/ValidateConfigs";

declare function require(name: string): string;
type VisibilityMap = {
    [P in keyof SearchBarProps]: boolean;
};

// tslint:disable-next-line class-name
export class preview extends Component<OfflineSearchProps, OfflineSearchState> {
    render() {
        return createElement("div", { className: "widget-offline-search" },
            createElement(ValidateConfigs, {
                inWebModeler: true,
                queryNode: this.state.targetNode,
                targetGrid: this.state.targetGrid,
                targetGridName: this.props.targetGridName
            }),
            createElement(SearchBar, this.transformProps(this.props))
        );
    }

    componentDidMount() {
        const queryNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(this.props, queryNode);

        if (targetNode) {
            this.setState({ targetNode });
        }
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

export function getVisibleProperties(valueMap: SearchBarProps, visibilityMap: VisibilityMap) {
    valueMap.showSearchBar = visibilityMap.showSearchBar = false;
    return visibilityMap;
}

export function getPreviewCss() {
    return require("./ui/OfflineSearch.css");
}
