import { StatelessComponent, createElement } from "react";

export const Alert: StatelessComponent<{ className: string, message?: string }> = (props) =>
    props.message
        ? createElement("div", { className: `alert alert-${props.className} widget-offline-search-alert` }, props.message)
        : null;

Alert.displayName = "Alert";
