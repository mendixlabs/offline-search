import { SFC, createElement } from "react";

export const Alert: SFC<{ className: string, message?: string }> = (props) =>
    props.message
        ? createElement("div", { className: `alert alert-${props.className} widget-offline-search-alert` }, props.message)
        : null;

Alert.displayName = "Alert";
