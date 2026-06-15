export const insertionSortPython = `def insertion_sort(values):
    result = values[:]

    for current in range(1, len(result)):
        key = result[current]
        scan = current - 1
        while scan >= 0 and result[scan] > key:
            result[scan + 1] = result[scan]
            scan -= 1

        result[scan + 1] = key

    return result`;
