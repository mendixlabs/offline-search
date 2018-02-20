import page from "./pages/home.page";
import { Element } from "webdriverio";

const testValue = "yellow";

describe("OfflineSearch", () => {
    it("when query is entered in the search input the list view should be filtered", () => {
        page.open();
        page.searchInput.waitForVisible();
        page.searchInput.click();
        page.searchInput.setValue(testValue);
        page.listViewList.waitForVisible();

        const listviewItems: Element[] = page.listViewList.value;
        if (listviewItems) {
            expect(listviewItems.length).toBe(1);
        }
    });

    it("when query is entered in the search input and clear button clicked the list view should be filtered with new query", () => {
        page.open();
        page.searchInput.waitForVisible();
        page.searchInput.click();
        page.searchInput.setValue(testValue);
        page.listViewList.waitForVisible();

        let listviewItems: Element[] = page.listViewList.value;
        if (listviewItems) {
            expect(listviewItems.length).toBe(1);
        }

        page.searchButton.click();

        setTimeout(() => {
            listviewItems = page.listViewList.value;
            expect(listviewItems.length).toBeGreaterThan(1);
        }, 3000);

        page.searchInput.setValue("c");

        setTimeout(() => {
            listviewItems = page.listViewList.value;
            expect(listviewItems.length).toBeGreaterThan(2);
        }, 3000);
    });
});
