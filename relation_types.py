from enum import Enum, unique


@unique
class Relation(Enum):
    if_Clause = 0
    Argument = 1
    Return_val = 2
    else_Clause =3
