from enum import Enum, unique


@unique
class Relation(Enum):
    if_Clause = "(condition)"
    Argument = "(arg)"
    Return_val = "(value)"
    else_Clause = "(else)"
    then = "(then)"
