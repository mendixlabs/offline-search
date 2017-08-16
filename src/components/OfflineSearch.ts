import { Component, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";

import { SearchBar } from "./SearchBar";
import { ValidateConfigs } from "./ValidateConfigs";
import { CommonProps, HybridConstraint, ListView, OfflineSearchProps, OfflineSearchState, parseStyle } from "../utils/ContainerUtils";
import "../ui/OfflineSearch.css";

export default class OfflineSearch extends Component<OfflineSearchProps, OfflineSearchState> {
    constructor(props: OfflineSearchProps) {
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
                style: parseStyle(this.props.style)
            },
            createElement(ValidateConfigs, {
                ...this.props as OfflineSearchProps,
                queryNode: this.state.targetNode,
                targetGrid: this.state.targetGrid,
                targetGridName: this.props.targetGridName,
                validate: !this.state.findingWidget
            }),
            createElement(SearchBar, {
                ...this.props as CommonProps,
                onTextChangeAction: this.updateConstraints,
                style: parseStyle(this.props.style)
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
        const validateMessage = ValidateConfigs.validate({
            ...this.props as OfflineSearchProps,
            queryNode: targetNode,
            targetGrid,
            targetGridName: this.props.targetGridName,
            validate: true
        });
        this.setState({ findingWidget: false, validationPassed: !validateMessage });
    }

    private updateConstraints(query: string) {
        let constraints: HybridConstraint | string = [];

        if (this.state.targetGrid && this.state.targetGrid._datasource && this.state.validationPassed) {
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
                constraints = this.props.searchEntity && ValidateConfigs.itContains(this.props.searchEntity, "/")
                    ? `${this.props.searchEntity}[${this.props.searchMethod}(${this.props.searchAttribute},'${query}')]`
                    : `${this.props.searchMethod}(${this.props.searchAttribute},'${query}')`;
                datasource._constraints = query ? "[" + constraints + "]" : "";
            }

            this.state.targetGrid.update();
        }
    }
}
