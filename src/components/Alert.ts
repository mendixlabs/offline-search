import { SFC, createElement } from "react";

type bootstrapStyle = "danger" | "info" | "success" | "inverse" | "warning";
export const Alert: SFC<{ bootstrapStyle: bootstrapStyle, message?: string }> = (props) =>
    props.message
        ? createElement("div", { className: `alert alert-${props.bootstrapStyle}` }, props.message)
        : null;

Alert.displayName = "Alert";
