import { shallow } from "enzyme";
import { createElement } from "react";
import * as TestUtils from "react-dom/test-utils";

import { SearchBar, SearchBarProps } from "../SearchBar";

describe("SearchBar", () => {
    const renderSearchBar = (props: SearchBarProps) => shallow(createElement(SearchBar, props));

    it("renders structure correctly", () => {
        const searchBarProps: SearchBarProps = {
            defaultQuery: "",
            onTextChangeAction:  jasmine.any(Function) as any,
            placeHolder: "",
            showSearchBar: true,
            style: SearchBar.parseStyle("html{}")
        };
        const searchBar = renderSearchBar(searchBarProps);

        expect(searchBar).toBeElement(
            createElement("div",
                {
                    className: "widget-offline-search",
                    style: SearchBar.parseStyle("{{...}}")
                },
                createElement("div", { className: "search-container" },
                    createElement("span", { className: "glyphicon glyphicon-search" }),
                    createElement("input", { className: "form-control", placeholder: "" }),
                    createElement("button", { className: "btn-transparent" },
                        createElement("span", { className: "glyphicon glyphicon-remove" })
                    )
                )
            )
        );
    });

    it("is not visible when show appearance is set to no", () => {
        const searchBarProps: SearchBarProps = {
            defaultQuery: "search",
            onTextChangeAction:  jasmine.any(Function) as any,
            placeHolder: "",
            showSearchBar: false,
            style: SearchBar.parseStyle("html{}")
        };
        const searchBar = renderSearchBar(searchBarProps);

        expect(searchBar).toBeElement("");
    });

    it("shows place holder when specified", () => {
        const searchBarProps: SearchBarProps = {
            defaultQuery: "",
            onTextChangeAction:  jasmine.any(Function) as any,
            placeHolder: "Search",
            showSearchBar: true,
            style: SearchBar.parseStyle("html{}")
        };
        const searchBar = renderSearchBar(searchBarProps);

        expect(searchBar).toBeElement(
            createElement("div",
                {
                    className: "widget-offline-search",
                    style: SearchBar.parseStyle("{{...}}")
                },
                createElement("div", { className: "search-container" },
                    createElement("span", { className: "glyphicon glyphicon-search" }),
                    createElement("input", { className: "form-control", placeholder: "Search" }),
                    createElement("button", { className: "btn-transparent" },
                        createElement("span", { className: "glyphicon glyphicon-remove" })
                    )
                )
            )
        );
    });

    describe("input", () => {
        it("accepts value", () => {
            const searchBarProps: SearchBarProps = {
                defaultQuery: "search bar",
                onTextChangeAction:  () => { return; },
                placeHolder: "",
                showSearchBar: true,
                style: SearchBar.parseStyle("html{}")
            };

            const searchBarComponent = TestUtils.renderIntoDocument(createElement(SearchBar, searchBarProps));
            const inputField = TestUtils.findRenderedDOMComponentWithTag(searchBarComponent, "input");
            TestUtils.Simulate.change(inputField);

            expect((inputField as HTMLInputElement).value).toBe("search bar");
        });

        it("has input when default query is specified", () => {
            const searchBarProps: SearchBarProps = {
                defaultQuery: "default",
                onTextChangeAction:  jasmine.any(Function) as any,
                placeHolder: "",
                showSearchBar: true,
                style: SearchBar.parseStyle("html{}")
            };
            const searchBar = renderSearchBar(searchBarProps);

            expect(searchBar).toBeElement(
                createElement("div",
                    {
                        className: "widget-offline-search",
                        style: SearchBar.parseStyle("{{...}}")
                    },
                    createElement("div", { className: "search-container" },
                        createElement("span", { className: "glyphicon glyphicon-search" }),
                        createElement("input", { className: "form-control", placeholder: "", value: "default" }),
                        createElement("button", { className: "btn-transparent" },
                            createElement("span", { className: "glyphicon glyphicon-remove" })
                        )
                    )
                )
            );
        });

        it("updates when the search changes", () => {
            const searchBarProps: SearchBarProps = {
                defaultQuery: "search bar",
                onTextChangeAction:  () => { return; },
                placeHolder: "",
                showSearchBar: true,
                style: Object.prototype
            };

            let searchBarComponent = TestUtils.renderIntoDocument(createElement(SearchBar, searchBarProps));
            let inputField = TestUtils.findRenderedDOMComponentWithTag(searchBarComponent, "input");
            TestUtils.Simulate.change(inputField);

            expect((inputField as HTMLInputElement).value).toBe("search bar");

            searchBarProps.style = null;
            searchBarProps.defaultQuery = null;
            searchBarComponent = TestUtils.renderIntoDocument(createElement(SearchBar, searchBarProps));
            inputField = TestUtils.findRenderedDOMComponentWithTag(searchBarComponent, "input");

            searchBarComponent.setState({ query: "new search bar" });

            expect((inputField as HTMLInputElement).value).toBe("new search bar");
        });

        it("is cleared when the remove button is clicked", () => {
            const searchBarProps: SearchBarProps = {
                defaultQuery: "search bar",
                onTextChangeAction:  () => { return; },
                placeHolder: "",
                showSearchBar: true,
                style: SearchBar.parseStyle("html{ width:100%;height:100%;}")
            };

            const searchBarComponent = TestUtils.renderIntoDocument(createElement(SearchBar, searchBarProps));
            const inputField = TestUtils.findRenderedDOMComponentWithTag(searchBarComponent, "input");
            TestUtils.Simulate.change(inputField);

            expect((inputField as HTMLInputElement).value).toBe("search bar");

            const clearButton = TestUtils.findRenderedDOMComponentWithTag(searchBarComponent, "button");
            TestUtils.Simulate.click(clearButton);

            expect((inputField as HTMLInputElement).value).toBe("");
        });
    });
});
