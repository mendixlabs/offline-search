import { Component, createElement } from "react";
import { Alert } from "./Alert";
import { ListView, OfflineSearchProps } from "./OfflineSearch";

export interface ValidateConfigProps extends OfflineSearchProps {
    inWebModeler?: boolean;
    queryNode?: HTMLElement;
    targetGrid?: ListView;
    targetGridName: string;
    validate: boolean;
}

export class ValidateConfigs extends Component<ValidateConfigProps, {}> {
    render() {
        return createElement(Alert, {
            bootstrapStyle: "danger",
            className: "widget-offline-search-alert",
            message: this.props.validate ? ValidateConfigs.validate(this.props) : ""
        });
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
        return !!(targetGrid &&
            targetGrid._onLoad &&
            targetGrid._loadMore &&
            targetGrid._renderData &&
            targetGrid._datasource &&
            targetGrid._datasource.atEnd &&
            typeof targetGrid._datasource._pageSize !== "undefined" &&
            typeof targetGrid._datasource._setSize !== "undefined");
    }

    static findTargetNode(props: OfflineSearchProps, queryNode: HTMLElement): HTMLElement | null {
        let targetNode: HTMLElement | null = null ;

        while (!targetNode && queryNode) {
            targetNode = props.targetGridName
                ? queryNode.querySelector(`.mx-name-${props.targetGridName}`) as HTMLElement
                : queryNode.querySelectorAll(`.mx-listview`)[0] as HTMLElement;

            if (targetNode) break;
            queryNode = queryNode.parentNode as HTMLElement;
        }

        return targetNode;
    }
}
