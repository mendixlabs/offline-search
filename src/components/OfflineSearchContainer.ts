import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";

import { CommonProps, SearchBar } from "./SearchBar";
import { ValidateConfigs } from "./ValidateConfigs";
import "../ui/OfflineSearch.css";

export type SearchMethodOptions = "equals" | "contains";
export type HybridConstraint = Array<{ attribute: string; operator: string; value: string; path?: string; }>;

export interface OfflineSearchContainerProps extends CommonProps {
    class?: string;
    searchAttribute: string;
    searchEntity: string;
    targetGridName: string;
    searchMethod: SearchMethodOptions;
    style: string;
}

export interface OfflineSearchContainerState {
    alertMessage?: string;
    targetGrid?: ListView;
    targetNode?: HTMLElement;
    findingWidget: boolean;
}

export interface ListView extends mxui.widget._WidgetBase {
    _datasource: {
        _constraints: HybridConstraint | string;
        _entity: string;
        _setSize: number;
        atEnd: () => boolean;
        _pageSize: number;
    };
    _loadMore: () => void;
    _onLoad: () => void;
    _renderData: () => void;
    update: () => void;
}

export default class OfflineSearch extends Component<OfflineSearchContainerProps, OfflineSearchContainerState> {
    constructor(props: OfflineSearchContainerProps) {
        super(props);

        this.state = {
            alertMessage: "",
            findingWidget: true
        };

        this.updateConstraints = this.updateConstraints.bind(this);
    }

    render() {
        return createElement("div",
            {
                className: classNames("widget-offline-search", this.props.class),
                style: this.parseStyle(this.props.style)
            },
            createElement(ValidateConfigs, {
                ...this.props as OfflineSearchContainerProps,
                queryNode: this.state.targetNode,
                targetGrid: this.state.targetGrid,
                targetGridName: this.props.targetGridName,
                validate: !this.state.findingWidget
            }),
            createElement(SearchBar, {
                ...this.props as CommonProps,
                onTextChangeAction: this.updateConstraints
            })
        );
    }

    componentDidMount() {
        const queryNode = findDOMNode(this).parentNode as HTMLElement;
        const targetNode = ValidateConfigs.findTargetNode(this.props, queryNode);
        let targetGrid: ListView | null = null;

        if (targetNode) {
            this.setState({ targetNode });
            targetGrid = dijitRegistry.byNode(targetNode);
            if (targetGrid) {
                this.setState({ targetGrid });
            }
        }

        this.setState({ findingWidget: false });
    }

    private updateConstraints(query: string) {
        let constraints: HybridConstraint | string = [];

        if (this.state.targetGrid && this.state.targetGrid._datasource) {
            const datasource = this.state.targetGrid._datasource;
            if (window.device) {
                constraints.push({
                    attribute: this.props.searchAttribute,
                    operator: this.props.searchMethod,
                    path: this.props.searchEntity,
                    value: query
                });
                datasource._constraints = query ? constraints : [];
            } else {
                constraints = this.props.searchEntity
                    ? `${this.props.searchEntity}[${this.props.searchMethod}(${this.props.searchAttribute},'${query}')]`
                    : `${this.props.searchMethod}(${this.props.searchAttribute},'${query}')`;
                datasource._constraints = query ? "[" + constraints + "]" : "";
            }

            this.state.targetGrid.update();
        }
    }

    private parseStyle = (style = ""): {[key: string]: string} => {
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
