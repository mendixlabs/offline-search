import { createElement } from "react";
import { shallow } from "enzyme";
import { Alert } from "../Alert";

describe("Alert", () => {

    it("renders structure correctly", () => {
        const message = "This is an error";
        const alert = shallow(createElement(Alert, { bootstrapStyle: "danger", message }));

        expect(alert).toBeElement(
            createElement("div", { className: "alert alert-danger" }, message)
        );
    });

    it("renders no structure when the alert message is not specified", () => {
        const alert = shallow(createElement(Alert, { bootstrapStyle: "danger" }));

        expect(alert).toBeElement(null);
    });

    it("shows green when bootstrap style is success", () => {
        const message = "This is an error";
        const alert = shallow(createElement(Alert, { bootstrapStyle: "success", message }));

        expect(alert).toBeElement(
            createElement("div", { className: "alert alert-success" }, message)
        );
    });

    it("renders class name correctly", () => {
        const message = "This is an error";
        const className = "widget-offline-search";
        const alert = shallow(createElement(Alert, { bootstrapStyle: "danger", message, className }));

        expect(alert).toBeElement(
            createElement("div", { className: "alert alert-danger widget-offline-search" }, message)
        );
    });
});
