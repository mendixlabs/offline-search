import { Component, createElement } from "react";
import { ListView, OfflineSearchProps } from "./OfflineSearch";
import { Alert } from "./Alert";

export interface ValidateConfigProps {
    inWebModeler?: boolean;
    queryNode?: HTMLElement;
    targetGrid?: ListView;
    targetGridName: string;
}

export class ValidateConfigs extends Component<ValidateConfigProps, {}> {
    render() {
        const message = ValidateConfigs.validate(this.props);

        if (message) {
            const alertClassName = "widget-offline-search-alert";
            return createElement(Alert, { bootstrapStyle: "danger", className: alertClassName, message });
        }

        return null;
    }

    static validate(props: ValidateConfigProps): string {
        if (!props.queryNode) {
            return `search offline widget: unable to find grid with the name "${props.targetGridName}"`;
        } else if (props.inWebModeler) {
            return "";
        } else if (!(props.targetGrid && props.targetGrid.declaredClass === "mxui.widget.ListView")) {
            return `search offline widget: supplied target name "${props.targetGridName}" is not of the type list view`;
        } else if (!ValidateConfigs.isCompatible(props.targetGrid)) {
            return "search offline widget: this Mendix version is incompatible with the offline search widget";
        }

        return "";
    }

    static isCompatible(targetGrid: ListView): boolean {
        if (targetGrid &&
            targetGrid._onLoad &&
            targetGrid._loadMore &&
            targetGrid._renderData &&
            targetGrid._datasource &&
            targetGrid._datasource.atEnd &&
            typeof targetGrid._datasource._pageSize !== "undefined" &&
            typeof targetGrid._datasource._setSize !== "undefined") {
            return true;
        }

        return false;
    }

    static findTargetNode(props: OfflineSearchProps, queryNode: HTMLElement): HTMLElement {
        let targetNode: HTMLElement | null = null;

        while (!targetNode) {
            targetNode = props.targetGridName
                ? queryNode.querySelector(`.mx-name-${props.targetGridName}`) as HTMLElement
                : queryNode.querySelectorAll(`.mx-listview`)[0] as HTMLElement;

            if (window.document.isEqualNode(queryNode)) break;
            queryNode = queryNode.parentNode as HTMLElement;
        }
        return targetNode;
    }
}
