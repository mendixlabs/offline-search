import { Component, ReactElement, createElement } from "react";
import { findDOMNode } from "react-dom";
import * as dijitRegistry from "dijit/registry";
import * as classNames from "classnames";
import * as dojoLang from "dojo/_base/lang";
import * as dojoConnect from "dojo/_base/connect";

import { SearchBar, SearchBarProps } from "./SearchBar";
import { ValidateConfigs } from "./ValidateConfigs";
import { HybridConstraint, ListView, OfflineSearchProps, OfflineSearchState, parseStyle } from "../utils/ContainerUtils";
import "../ui/OfflineSearch.scss";

export default class OfflineSearchContainer extends Component<OfflineSearchProps, OfflineSearchState> {
    private navigationHandler: object;
    constructor(props: OfflineSearchProps) {
        super(props);

        this.state = {
            alertMessage: "",
            listviewAvailable: true
        };
        this.updateConstraints = this.updateConstraints.bind(this);
        this.navigationHandler = dojoConnect.connect(props.mxform, "onNavigation", this, dojoLang.hitch(this, this.initSearch));
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
                targetListView: this.state.targetListView,
                validate: !this.state.listviewAvailable
            }),
            this.renderBar()
        );
    }

    componentWillUnmount() {
        dojoConnect.disconnect(this.navigationHandler);
    }

    private renderBar(): ReactElement<SearchBarProps> {
        if (this.state.validationPassed) {
            return createElement(SearchBar, {
                defaultQuery: this.props.defaultQuery,
                onTextChangeAction: this.updateConstraints,
                placeHolder: this.props.placeHolder,
                showSearchBar: this.props.showSearchBar
            });
        }

        return null;
    }

    private initSearch() {
        if (!this.state.validationPassed) {
            const queryNode = findDOMNode(this).parentNode as HTMLElement;
            const targetNode = ValidateConfigs.findTargetNode(queryNode);
            let targetListView: ListView | null = null;

            if (targetNode) {
                this.setState({ targetNode });
                targetListView = dijitRegistry.byNode(targetNode);
                if (targetListView) {
                    this.setState({ targetListView });
                }
            }
            const validateMessage = ValidateConfigs.validate({
                ...this.props as OfflineSearchProps,
                queryNode: targetNode,
                targetListView,
                validate: true
            });
            this.setState({ listviewAvailable: false, validationPassed: !validateMessage });
        }
    }

    private updateConstraints(query: string) {
        const { targetListView, targetNode } = this.state;
        if (targetListView && targetListView._datasource && this.state.validationPassed) {
            this.showLoader(targetNode);
            const datasource = targetListView._datasource;
            if (window.device && window.mx.isOffline()) {
                const constraints: HybridConstraint = [ {
                    attribute: this.props.searchAttribute,
                    operator: this.props.searchMethod,
                    path: this.props.searchEntity,
                    value: query
                } ];
                datasource._constraints = query ? constraints : [];
            } else {
                let constraints: string;
                const isReference = this.props.searchEntity && ValidateConfigs.itContains(this.props.searchEntity, "/");
                if (isReference) {
                    constraints = `${this.props.searchEntity}[${this.props.searchMethod}(${this.props.searchAttribute},'${query}')]`;
                } else {
                    constraints = `${this.props.searchMethod}(${this.props.searchAttribute},'${query}')`;
                }
                datasource._constraints = query ? "[" + constraints + "]" : "";
            }
            targetListView.update();
            targetListView.update(null, () => {
                this.hideLoader(targetNode);
            });
        }
    }

    private showLoader(node?: HTMLElement) {
        if (node) {
            node.classList.add("widget-offline-search-loading");
        }
    }

    private hideLoader(node?: HTMLElement) {
        if (node) {
            node.classList.remove("widget-offline-search-loading");
        }
    }
}
