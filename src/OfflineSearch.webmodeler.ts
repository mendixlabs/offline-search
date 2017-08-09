import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { SearchBar, SearchBarProps } from "./components/SearchBar";
import { ValidateConfigs } from "./components/ValidateConfigs";
import { OfflineSearchProps, OfflineSearchState, parseStyle } from "./utils/ContainerUtils";

declare function require(name: string): string;
type VisibilityMap = {
    [P in keyof SearchBarProps]: boolean;
};

// tslint:disable-next-line class-name
export class preview extends Component<OfflineSearchProps, OfflineSearchState> {
    constructor(props: OfflineSearchProps) {
        super(props);

        this.state = { findingWidget: true };
    }
    render() {
        return createElement("div", { className: "widget-offline-search" },
            createElement(ValidateConfigs, {
                ...this.props as OfflineSearchProps,
                queryNode: this.state.targetNode,
                targetGrid: this.state.targetGrid,
                validate: !this.state.findingWidget
            }),
            createElement(SearchBar, {
                defaultQuery: "",
                placeHolder: "",
                showSearchBar: true,
                style: parseStyle(this.props.style)
            })
        );
    }

    componentDidMount() {
        const routeNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(this.props, routeNode);
        if (targetNode) {
            this.setState({ targetNode });
        }

        this.setState({ findingWidget: false });
    }
}

export function getVisibleProperties(valueMap: SearchBarProps, visibilityMap: VisibilityMap) {
    valueMap.showSearchBar = visibilityMap.showSearchBar = false;

    return visibilityMap;
}

export function getPreviewCss() {
    return require("./ui/OfflineSearch.css");
}
