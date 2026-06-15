export const mergeSortPython = `def merge_sort(values, start=0, end=None):
    result = list(values)
    if end is None:
        end = len(result) - 1
    if start >= end:
        return result
    mid = (start + end) // 2
    merge_sort(result, start, mid)
    merge_sort(result, mid + 1, end)
    while left_index <= mid and right_index <= end:
        result[write_index] = min(left_value, right_value)
    copy_remaining_values(result, start, end)
    merge(result, start, mid, end)
    return result`;
