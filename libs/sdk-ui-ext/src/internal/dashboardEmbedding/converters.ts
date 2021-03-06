// (C) 2020 GoodData Corporation
import {
    IFilterContext,
    isDashboardAttributeFilter,
    ITempFilterContext,
    IWidgetDefinition,
} from "@gooddata/sdk-backend-spi";
import {
    IFilter,
    newNegativeAttributeFilter,
    isUriRef,
    objRefToString,
    newPositiveAttributeFilter,
    newRelativeDateFilter,
    newAbsoluteDateFilter,
    IAttributeElements,
    ObjRef,
} from "@gooddata/sdk-model";
import isString from "lodash/isString";

/**
 * Gets {@link IFilter} items for filters specified in given filterContext in relation to the given widget.
 *
 * @param filterContext - filter context to get filters for
 * @param widget - widget to use to get dateDataSet for date filters
 * @internal
 */
export function filterContextToFiltersForWidget(
    filterContext: IFilterContext | ITempFilterContext | undefined,
    widget: IWidgetDefinition,
): IFilter[] {
    if (!filterContext) {
        return [];
    }

    return filterContext.filters.map((filter) => {
        if (isDashboardAttributeFilter(filter)) {
            if (filter.attributeFilter.negativeSelection) {
                return newNegativeAttributeFilter(
                    filter.attributeFilter.displayForm,
                    filterContextAttributeElementsToElements(filter.attributeFilter.attributeElements),
                );
            } else {
                return newPositiveAttributeFilter(
                    filter.attributeFilter.displayForm,
                    filterContextAttributeElementsToElements(filter.attributeFilter.attributeElements),
                );
            }
        } else {
            if (filter.dateFilter.type === "relative") {
                return newRelativeDateFilter(
                    widget.dateDataSet,
                    filter.dateFilter.granularity,
                    numberOrStringToNumber(filter.dateFilter.from),
                    numberOrStringToNumber(filter.dateFilter.to),
                );
            } else {
                return newAbsoluteDateFilter(
                    widget.dateDataSet,
                    filter.dateFilter.from!.toString(),
                    filter.dateFilter.to!.toString(),
                );
            }
        }
    });
}

function numberOrStringToNumber(input: number | string): number {
    return isString(input) ? Number.parseInt(input) : input;
}

function filterContextAttributeElementsToElements(attributeElements: ObjRef[]): IAttributeElements {
    return attributeElements.length
        ? isUriRef(attributeElements[0])
            ? { uris: attributeElements.map(objRefToString) }
            : { values: attributeElements.map(objRefToString) }
        : { values: [] };
}
