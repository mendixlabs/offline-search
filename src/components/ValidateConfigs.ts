import { Component, createElement } from "react";

import { Alert } from "./Alert";
import { ListView, OfflineSearchProps } from "../utils/ContainerUtils";

export interface ValidateConfigProps extends OfflineSearchProps {
    inWebModeler?: boolean;
    queryNode?: HTMLElement;
    targetListView?: ListView;
    validate: boolean;
}

const getAlertMessage = (friendlyId: string, message: string) => `Custom widget ${friendlyId} error in configuration" ${message}`;

export class ValidateConfigs extends Component<ValidateConfigProps, {}> {
    render() {
        return createElement(Alert, {
            bootstrapStyle: "danger",
            className: "widget-offline-search-alert",
            message: this.props.validate ? ValidateConfigs.validate(this.props) : ""
        });
    }

    static validate(props: ValidateConfigProps): string {
        if (props.inWebModeler) {
            return "";
        }
        if (!ValidateConfigs.isCompatible(props.targetListView)) {
            return getAlertMessage(props.friendlyId, "this Mendix version is incompatible with the offline search widget");
        }
        if (props.searchEntity && !ValidateConfigs.itContains(props.searchEntity, "/")) {
            if (props.searchEntity !== props.targetListView._datasource._entity) {
                return getAlertMessage(props.friendlyId, `supplied entity ${props.searchEntity} does not belong to list view data source`);
            }
        }

        return "";
    }

    static isCompatible(targetListView: ListView): boolean {
        return !!(targetListView
            && targetListView._onLoad
            && targetListView._loadMore
            && targetListView._renderData
            && targetListView._datasource
            && targetListView.update
            && typeof targetListView._datasource._pageSize !== "undefined"
            && typeof targetListView._datasource._setSize !== "undefined");
    }

    static findTargetNode(filterNode: HTMLElement): HTMLElement | null {
        let targetNode: HTMLElement | null = null ;

        while (!targetNode && filterNode) {
            targetNode = filterNode.querySelectorAll(`.mx-listview`)[0] as HTMLElement;
            if (targetNode || filterNode.isEqualNode(document) || filterNode.classList.contains("mx-incubator")
                || filterNode.classList.contains("mx-offscreen")) {
                break;
            }

            filterNode = filterNode.parentNode as HTMLElement;
        }

        return targetNode;
    }

    static itContains(array: string[] | string, element: string) {
        return array.indexOf(element) > -1;
    }
}
