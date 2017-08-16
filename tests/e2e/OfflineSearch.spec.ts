import page from "./pages/home.page";
import { Element } from "webdriverio";

const testValue = "yellow";

describe("OfflineSearch", () => {
    it("when query is entered list view should be filtered", () => {
        page.open();
        page.searchInput.waitForVisible();
        page.searchInput.click();
        page.searchInput.setValue(testValue);

        const listviewItems: Element[] = page.listViewList.value;
        expect(listviewItems.length).toBe(1);
    });

    it("when query is entered and cleared list view should be filtered", () => {
        page.open();
        page.searchInput.waitForVisible();
        page.searchInput.click();
        page.searchInput.setValue(testValue);

        let listviewItems: Element[] = page.listViewList.value;
        expect(listviewItems.length).toBe(1);

        page.searchButton.click();

        setTimeout(() => {
            listviewItems = page.listViewList.value;
            expect(listviewItems.length).toBeGreaterThan(1);
        }, 3000);

        page.searchInput.setValue("e");

        setTimeout(() => {
            listviewItems = page.listViewList.value;
            expect(listviewItems.length).toBeGreaterThan(2);
        }, 3000);
    });
});
