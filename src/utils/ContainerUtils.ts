export type SearchMethodOptions = "equals" | "contains";

export interface WrapperProps {
    class?: string;
    friendlyId: string;
    mxform: mxui.lib.form._FormBase;
    mxObject: mendix.lib.MxObject;
    style: string;
}

export interface OfflineSearchProps extends WrapperProps {
    defaultQuery: string;
    placeHolder: string;
    searchAttribute: string;
    searchEntity: string;
    searchMethod: SearchMethodOptions;
    showSearchBar: boolean;
}
export interface OfflineSearchState {
    alertMessage?: string;
    targetListView?: ListView;
    targetNode?: HTMLElement;
    listviewAvailable: boolean;
    validationPassed?: boolean;
}

export type HybridConstraint = Array<{ attribute: string; operator: string; value: string; path?: string; }>;

export interface ListView extends mxui.widget._WidgetBase {
    _datasource: {
        _constraints: HybridConstraint | string;
        _entity: string;
        _setSize: number;
        atEnd: () => boolean;
        _pageSize: number;
    };
    _loadMore: () => void;
    _onLoad: () => void;
    _renderData: () => void;
    update: (obj?: mendix.lib.MxObject | null, callback?: () => void) => void;
}

export const parseStyle = (style = ""): {[key: string]: string} => {
    try {
        return style.split(";").reduce<{[key: string]: string}>((styleObject, line) => {
            const pair = line.split(":");
            if (pair.length === 2) {
                const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                styleObject[name] = pair[1].trim();
            }
            return styleObject;
        }, {});
    } catch (error) {
        // tslint:disable-next-line no-console
        window.console.log("Failed to parse style", style, error);
    }

    return {};
};
