from enum import Enum, unique, auto


@unique
class Relation(Enum):
    # if_Clause = "(condition)"
    # Argument = "(arg)"
    # Return_val = "(value)"
    # else_Clause = "(else)"
    # then = "(then)"
    if_Clause = auto()
    Argument = auto()
    Return_val = auto()
    else_Clause = auto()
    then = auto()