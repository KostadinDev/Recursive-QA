from enum import Enum, unique

@unique
class Template(Enum):
    UNKNOWN = 0
    IF_THEN = 1
    IF = 2
    THEN = 3
