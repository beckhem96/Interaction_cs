export const bubbleSortPython = `def bubble_sort(values):
    result = values[:]

    for end in range(len(result) - 1, 0, -1):
        for index in range(end):
            if result[index] > result[index + 1]:
                result[index], result[index + 1] = result[index + 1], result[index]

    return result`;
