export const selectionSortPython = `def selection_sort(values):
    result = values[:]

    for current in range(len(result) - 1):
        min_index = current
        for scan in range(current + 1, len(result)):
            if result[scan] < result[min_index]:
                min_index = scan

        if min_index != current:
            result[current], result[min_index] = result[min_index], result[current]

    return result`;
