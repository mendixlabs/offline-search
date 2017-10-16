import { mount, shallow } from "enzyme";
import { createElement } from "react";

import { SearchBar, SearchBarProps } from "../SearchBar";

describe("SearchBar", () => {
    const renderSearchBar = (props: SearchBarProps) => shallow(createElement(SearchBar, props));
    const mountSearchBar = (props: SearchBarProps) => mount(createElement(SearchBar, props));
    const searchBarProps: SearchBarProps = {
        defaultQuery: "search bar",
        onTextChangeAction:  jasmine.any(Function) as any,
        placeHolder: "Search",
        showSearchBar: true
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
        it("accepts value", (done) => {
            const newValue = "cat";
            const barProps: SearchBarProps = {
                ...searchBarProps,
                onTextChangeAction: value => value
            };
            spyOn(barProps, "onTextChangeAction").and.callThrough();
            const wrapper = renderSearchBar(barProps);
            const input: any = wrapper.find("input");

            input.simulate("change", { currentTarget: { value: newValue } });

            setTimeout(() => {
                expect(barProps.onTextChangeAction).toHaveBeenCalledWith(newValue);
                done();
            }, 1000);
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

        it("updates when the search value changes", (done) => {
            const newValue = "cat";
            const barProps: SearchBarProps = {
                ...searchBarProps,
                onTextChangeAction: value => value
            };
            spyOn(barProps, "onTextChangeAction").and.callThrough();
            const wrapper = renderSearchBar(barProps);
            const input: any = wrapper.find("input");

            input.simulate("change", { currentTarget: { value: barProps.defaultQuery } });

            setTimeout(() => {
                expect(barProps.onTextChangeAction).toHaveBeenCalledWith(barProps.defaultQuery);

                input.simulate("change", { currentTarget: { value: newValue } });

                setTimeout(() => {
                    expect(barProps.onTextChangeAction).toHaveBeenCalledWith(newValue);
                    done();
                }, 1000);
            }, 1000);
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
