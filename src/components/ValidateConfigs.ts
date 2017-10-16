import { Component, createElement } from "react";

import { Alert } from "./Alert";
import { ListView, OfflineSearchProps } from "../utils/ContainerUtils";

export interface ValidateConfigProps extends OfflineSearchProps {
    inWebModeler?: boolean;
    queryNode?: HTMLElement;
    targetListView?: ListView;
    validate: boolean;
}

const widgetName = "search offline widget";

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
            return `${widgetName}: this Mendix version is incompatible with the offline search widget`;
        }
        if (!props.searchEntity && !ValidateConfigs.isValidAttribute(props.targetListView._datasource._entity, props)) {
            return `${widgetName}: supplied attribute name "${props.searchAttribute}" does not belong to list view`;
        }
        if (props.searchEntity && !ValidateConfigs.itContains(props.searchEntity, "/")) {
            if (props.searchEntity !== props.targetListView._datasource._entity) {
                return `${widgetName}: supplied entity "${props.searchEntity}" does not belong to list view data source`;
            }
        }
        if (props.searchEntity && ValidateConfigs.itContains(props.searchEntity, "/") && !ValidateConfigs.getRelatedEntity(props)) {
            return `${widgetName}: supplied entity "${props.searchEntity}" does not belong to list view data source reference`;
        }
        if (props.searchEntity && ValidateConfigs.itContains(props.searchEntity, "/")) {
            const entityPath = ValidateConfigs.getRelatedEntity(props);
            if (props.searchEntity && !ValidateConfigs.isValidAttribute(entityPath, props)) {
                return `${widgetName}: supplied attribute name "${props.searchAttribute}" does not belong to list view data source reference`;
            }
        }

        return "";
    }

    static getRelatedEntity(props: ValidateConfigProps): string {
        if (props.targetListView) {
            const dataSourceEntity = window.mx.meta.getEntity(props.targetListView._datasource._entity);
            const referenceAttributes: string[] = dataSourceEntity.getReferenceAttributes();
            for (const referenceAttribute of referenceAttributes) {
                if (ValidateConfigs.itContains(props.searchEntity, referenceAttribute)) {
                    const selectorEntity = dataSourceEntity.getSelectorEntity(referenceAttribute);
                    if (ValidateConfigs.itContains(props.searchEntity, selectorEntity)) {
                        return selectorEntity;
                    }
                }
            }
        }

        return "";
    }

    static isValidAttribute(entity: string, props: ValidateConfigProps): boolean {
        if (props.targetListView) {
            const dataSourceEntity: mendix.lib.MxMetaObject = window.mx.meta.getEntity(entity);
            const dataAttributes: string[] = dataSourceEntity.getAttributes();
            if (ValidateConfigs.itContains(dataAttributes, props.searchAttribute)) {
                return true;
            }
        }

        return false;
    }

    static isCompatible(targetListView: ListView): boolean {
        return !!(targetListView &&
            targetListView._onLoad &&
            targetListView._loadMore &&
            targetListView._renderData &&
            targetListView._datasource &&
            targetListView._datasource.atEnd &&
            typeof targetListView._datasource._pageSize !== "undefined" &&
            typeof targetListView._datasource._setSize !== "undefined");
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
