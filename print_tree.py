def build_tree(root):
    return '\n'.join(_build_tree(root))


def _build_tree(node):
    if not isinstance(node, tuple):
        yield str(node)
        return

    values = [_build_tree(n) for n in node[:-1]]
    if len(values) == 1:
        yield from build_lines('──', '  ', values[0])
        return

    start, *mid, end = values
    # ┬─
    #yield from build_lines(f'{node[-1].value}─', f'│ ', start)
    yield from build_lines(f'{node[-1].value}─', f'│ ', start)
    for value in mid:
        yield from build_lines('├─', '│ ', value)
    yield from build_lines('└─', '  ', end)


def build_lines(first, other, values):
    yield first + next(values)
    for value in values:
        yield other + value

