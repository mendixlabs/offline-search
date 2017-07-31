import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";

import { SearchBar } from "./SearchBar";
import { ValidateConfigs } from "./ValidateConfigs";
import "../ui/OfflineSearch.css";

export type SearchMethodOptions = "equals" | "contains";
export type HybridConstraint = Array<{ attribute: string; operator: string; value: string; path?: string; }>;

export interface WrapperProps {
    defaultQuery: string;
    placeHolder: string;
    searchEntity: string;
    searchAttribute: string;
    showSearchBar: boolean;
    searchMethod: SearchMethodOptions;
}

export interface OfflineSearchProps extends WrapperProps {
    targetGridName: string;
}

export interface OfflineSearchState {
    alertMessage?: string;
    targetGrid?: ListView;
    targetNode?: HTMLElement;
}

export interface ListView extends mxui.widget._WidgetBase {
    _datasource: {
        _constraints: HybridConstraint | string;
        _setSize: number;
        atEnd: () => boolean;
        _pageSize: number;
    };
    _loadMore: () => void;
    _onLoad: () => void;
    _renderData: () => void;
    update: () => void;
}

export default class OfflineSearch extends Component<OfflineSearchProps, OfflineSearchState> {
    constructor(props: OfflineSearchProps) {
        super(props);

        this.state = {
            alertMessage: "",
            targetGrid: undefined,
            targetNode: undefined
        };
    }

    render() {
        return createElement("div", { className: "widget-offline-search" },
            createElement(ValidateConfigs, {
                queryNode: this.state.targetNode,
                targetGrid: this.state.targetGrid,
                targetGridName: this.props.targetGridName
            }),
            createElement(SearchBar, {
                defaultQuery: this.props.defaultQuery,
                listView: this.state.targetGrid,
                placeHolder: this.props.placeHolder,
                searchAttribute: this.props.searchAttribute,
                searchEntity: this.props.searchEntity,
                searchMethod: this.props.searchMethod,
                showSearchBar: this.props.showSearchBar
            })
        );
    }

    componentDidMount() {
        const queryNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(this.props, queryNode);

        if (targetNode) {
            this.setState({ targetNode });
            const targetGrid = dijitRegistry.byNode(targetNode);
            if (targetGrid) {
                this.setState({ targetGrid });
            }
        }
    }
}
