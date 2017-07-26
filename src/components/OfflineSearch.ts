import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import { SearchBar } from "./SearchBar";
import { Alert } from "./Alert";
import "../ui/OfflineSearch.css";

export type SearchMethodOptions = "equals" | "contains";
export type HybridConstraint = Array<{ attribute: string; operator: string; value: string; path?: string; }>;

export interface WrapperProps {
    defaultQuery: string;
    searchEntity: string;
    searchAttributes: Array<{ name: string }>;
    showSearchBar: boolean;
    searchMethod: SearchMethodOptions;
}

interface OfflineSearchProps extends WrapperProps {
    targetGridName: string;
}

interface OfflineSearchState {
    alertMessage?: string;
    targetWidget?: ListView;
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
            targetWidget: undefined
        };
    }

    render() {
        return (
            createElement("div", { className: "widget-offline-search" },
                createElement(Alert, { className: "danger", message: this.state.alertMessage }),
                createElement(SearchBar, {
                    defaultQuery: this.props.defaultQuery,
                    listView: this.state.targetWidget,
                    searchAttributes: this.props.searchAttributes,
                    searchEntity: this.props.searchEntity,
                    searchMethod: this.props.searchMethod,
                    showSearchBar: this.props.showSearchBar
                })
            )
        );
    }

    componentDidMount() {
        if (this.props.showSearchBar) {
            this.findListView();
        }
    }

    private findListView() {
        let queryNode = findDOMNode(this).parentNode as HTMLElement;
        let targetNode: HTMLElement | null = null;
        let targetWidget: ListView;

        while (!targetNode) {
            this.props.targetGridName
                ?
                targetNode = queryNode.querySelector(`.mx-name-${this.props.targetGridName}`) as HTMLElement
                :
                targetNode = queryNode.querySelectorAll(`.mx-listview`)[0] as HTMLElement;

            if (window.document.isEqualNode(queryNode)) break;
            queryNode = queryNode.parentNode as HTMLElement;
        }

        if (!targetNode) {
            this.setState({ alertMessage: `search offline widget: unable to find grid with the name "${this.props.targetGridName}"` });
        } else {
            targetWidget = dijitRegistry.byNode(targetNode);

            if (targetWidget && targetWidget.declaredClass === "mxui.widget.ListView") {
                if (
                    targetWidget._onLoad &&
                    targetWidget._loadMore &&
                    targetWidget._renderData &&
                    targetWidget._datasource &&
                    targetWidget._datasource.atEnd &&
                    typeof targetWidget._datasource._pageSize !== "undefined" &&
                    typeof targetWidget._datasource._setSize !== "undefined"
                ) {
                    this.setState({ targetWidget: dijitRegistry.byNode(targetNode) });
                } else {
                    this.setState({ alertMessage: "search offline widget: this Mendix version is incompatible with the offline search widget" });
                }
            } else {
                this.setState({ alertMessage: `search offline widget: supplied target name "${this.props.targetGridName}" is not of the type list view` });
            }
        }
    }
}
