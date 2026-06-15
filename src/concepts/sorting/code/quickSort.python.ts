export const quickSortPython = `def quick_sort(values):
    result = list(values)

    def sort_range(start, end):
        if start >= end:
            return
        pivot = result[end]
        store_index = start
        for scan in range(start, end):
            if result[scan] <= pivot:
                result[store_index], result[scan] = result[scan], result[store_index]
                store_index += 1
        result[store_index], result[end] = result[end], result[store_index]
        sort_range(start, store_index - 1)
        sort_range(store_index + 1, end)

    sort_range(0, len(result) - 1)
    return result`;
