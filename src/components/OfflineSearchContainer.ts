import { Component, createElement } from "react";
import * as classNames from "classnames";

import "../ui/OfflineSearch.css";
import { OfflineSearch } from "./OfflineSearch";
import { CommonProps, SearchMethodOptions, parseStyle } from "../utils/ContainerUtils";

export interface OfflineSearchContainerProps extends CommonProps {
    searchAttribute: string;
    searchEntity: string;
    targetGridName: string;
    searchMethod: SearchMethodOptions;
    style: string;
}

export default class OfflineSearchContainer extends Component<OfflineSearchContainerProps, {}> {

    render() {
        return createElement("div",
            {
                className: classNames("widget-offline-search", this.props.class),
                style: parseStyle(this.props.style)
            },
            createElement(OfflineSearch, {
                ...this.props as OfflineSearchContainerProps
            })
        );
    }
}
