import { useQuery } from "@tanstack/react-query";
import { apiWithAuth } from "@/utils/api";
import { portfolioCompaniesApiPaths } from "@/constant/apiPaths";

const sortKeyMap = {
};

const fetchPortfolioCompanies = async ({
    search = "",
    pageIndex,
    pageSize,
    sortBy = [],
    filters = [],
    searchType = "query"
}) => {
    try {
        let sortByParams = null;
        if (sortBy && sortBy.length) {
            const sortValue = sortBy.split("_");
            const sortKey = sortValue[0];
            const sortOrder = sortValue[sortValue.length - 1];
            const mappedSortBy = sortKeyMap[sortKey]
                ? `${sortKeyMap[sortKey]}_${sortOrder}`
                : null;
            sortByParams = mappedSortBy ? mappedSortBy : null;
        }

        const params = {
            limit: pageSize,
            skip: pageIndex * pageSize,
            ...(sortByParams && { sort: sortByParams }),
            ...filters.reduce((acc, filter) => {
                acc[filter.filterid] = filter.optionid;
                return acc;
            }, {}),
        };

        if (search && search.length > 0) {
            params[searchType] = search;
        }

        const url = search && search.length > 0
            ? portfolioCompaniesApiPaths.search
            : portfolioCompaniesApiPaths.get;

        const response = await apiWithAuth.get(url, { params });
        const { data, total } = response.data;
        return { data: data || [], totalCount: total };
    } catch (error) {
        console.error("Error fetching portfolio companies:", error);
        let message = "Failed to fetch portfolio companies";
        if (
            error.response?.data?.detail &&
            typeof error.response.data.detail === "string"
        ) {
            message = error.response.data.detail;
        }
        throw new Error(message);
    }
};

export const useGETPortfolioCompanies = ({
    search = "",
    pageIndex = 0,
    pageSize = 10,
    sortBy = [],
    filters = [],
    searchType = "company_name"
}) => {
    const first_sort = sortBy.at(0);
    const sort = first_sort
        ? `${first_sort.id}_${first_sort.desc ? "desc" : "asc"}`
        : "";

    return useQuery({
        queryKey: [
            "portfolio-companies-query",
            search,
            pageIndex,
            pageSize,
            sort,
            filters,
            searchType
        ],
        queryFn: () =>
            fetchPortfolioCompanies({
                search,
                pageIndex,
                pageSize,
                sortBy: sort,
                filters,
                searchType
            }),
        placeholderData: (keepPreviousData) => keepPreviousData,
    });
};
