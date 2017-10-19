import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";

import { SearchBar, SearchBarProps } from "./components/SearchBar";
import { ValidateConfigs } from "./components/ValidateConfigs";
import { OfflineSearchProps, OfflineSearchState } from "./utils/ContainerUtils";

declare function require(name: string): string;
type VisibilityMap = {
    [ P in keyof SearchBarProps ]: boolean;
};

// tslint:disable-next-line class-name
export class preview extends Component<OfflineSearchProps, OfflineSearchState> {
    constructor(props: OfflineSearchProps) {
        super(props);

        this.state = { listviewAvailable: true };
    }

    render() {
        return createElement("div", { className: "widget-offline-search" },
            createElement(ValidateConfigs, {
                ...this.props as OfflineSearchProps,
                inWebModeler: true,
                queryNode: this.state.targetNode,
                targetListView: this.state.targetListView,
                validate: !this.state.listviewAvailable
            }),
            createElement(SearchBar, {
                defaultQuery: "",
                onTextChangeAction: () => { return; },
                placeHolder: this.props.placeHolder,
                showSearchBar: true
            })
        );
    }

    componentDidMount() {
        this.validateConfigs();
    }

    componentWillReceiveProps(_newProps: OfflineSearchProps) {
        this.validateConfigs();
    }

    private validateConfigs() {
        const routeNode = findDOMNode(this) as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(routeNode);

        if (targetNode) {
            this.setState({ targetNode });
        }
        this.setState({ listviewAvailable: true });
    }
}

export function getVisibleProperties(valueMap: SearchBarProps, visibilityMap: VisibilityMap) {
    valueMap.showSearchBar = visibilityMap.showSearchBar = false;

    return visibilityMap;
}

export function getPreviewCss() {
    return require("./ui/OfflineSearch.css");
}
