import { mount, shallow } from "enzyme";
import { createElement } from "react";

import { SearchBar, SearchBarProps } from "../SearchBar";
import { parseStyle } from "../../utils/ContainerUtils";

describe("SearchBar", () => {
    const renderSearchBar = (props: SearchBarProps) => shallow(createElement(SearchBar, props));
    const mountSearchBar = (props: SearchBarProps) => mount(createElement(SearchBar, props));
    const searchBarProps: SearchBarProps = {
        defaultQuery: "search bar",
        onTextChangeAction:  jasmine.any(Function) as any,
        placeHolder: "Search",
        showSearchBar: true,
        style: parseStyle("html{}")
    };

    it("renders the structure correctly", () => {
        const searchBar = renderSearchBar(searchBarProps);

        expect(searchBar).toBeElement(
            createElement("div", { className: "search-bar" },
                createElement("span", { className: "glyphicon glyphicon-search" }),
                createElement("input", { className: "form-control", placeholder: "" }),
                createElement("button", { className: "btn-transparent" },
                    createElement("span", { className: "glyphicon glyphicon-remove" })
                )
            )
        );
    });

    it("does not render when show appearance is set to no", () => {
        const barProps: SearchBarProps = {
            ...searchBarProps,
            showSearchBar: false
        };

        const searchBar = renderSearchBar(barProps);

        expect(searchBar).toBeElement("");
    });

    it("renders with the specified placeholder", () => {
        const searchBar = renderSearchBar(searchBarProps);

        expect(searchBar).toBeElement(
            createElement("div", { className: "search-bar" },
                createElement("span", { className: "glyphicon glyphicon-search" }),
                createElement("input", { className: "form-control", placeholder: "Search" }),
                createElement("button", { className: "btn-transparent" },
                    createElement("span", { className: "glyphicon glyphicon-remove" })
                )
            )
        );
    });

    describe("input", () => {
        it("accepts value", () => {
            const wrapper = mountSearchBar(searchBarProps);
            const input: any = wrapper.find("input");

            input.node.value = "Change";
            input.simulate("change");

            expect(input.get(0).value).toBe("Change");
        });

        it("renders with specified default query", () => {
            const searchBar = renderSearchBar(searchBarProps);

            expect(searchBar).toBeElement(
                createElement("div", { className: "search-bar" },
                    createElement("span", { className: "glyphicon glyphicon-search" }),
                    createElement("input", { className: "form-control", placeholder: "", value: "search bar" }),
                    createElement("button", { className: "btn-transparent" },
                        createElement("span", { className: "glyphicon glyphicon-remove" })
                    )
                )
            );
        });

        it("updates when the search value changes", () => {
            const barProps: SearchBarProps = {
                ...searchBarProps,
                onTextChangeAction:  () => { return; }
            };
            const newValue = "new search bar";
            const wrapper = mountSearchBar(barProps);
            const input: any = wrapper.find("input");

            input.node.value = "Change";
            input.simulate("change");

            expect(input.get(0).value).toBe("Change");

            wrapper.setState({ query: newValue });

            expect(input.get(0).value).toBe(newValue);
        });

        it("is cleared when the remove button is clicked", () => {
            const wrapper = mountSearchBar(searchBarProps);
            const input: any = wrapper.find("input");
            const button: any = wrapper.find("button");

            input.node.value = "Change";
            input.simulate("change");

            expect(input.get(0).value).toBe("Change");

            button.simulate("click");

            expect(input.get(0).value).toBe("");
        });
    });
});
