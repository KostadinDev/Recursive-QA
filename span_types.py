from enum import Enum, unique

@unique
class Span(Enum):
    if_else = 0
    var_val = 1
    Pred_Name = 3
    Const = 4
    Def_Fun_name = 5


