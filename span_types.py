from enum import Enum, unique


@unique
class Span(Enum):
    if_else = "if"
    var_val = "var"
    Pred_Name = "predicate"
    Const = "const"
    Def_Fun_name = "func"
