
from parser import Parser
from print_tree import build_tree
from relation_types import Relation


#sentence = "If the underlying file system at the server is only accessible in a read-only mode and the OPEN request has specified OPEN4_SHARE_ACCESS_WRITE or OPEN4_SHARE_ACCESS_BOTH, the server will return NFS4ERR_ROFS to indicate a read-only file system,"
#sentence  = "If the object does not exist, the server creates the object and stores the verifier in a stable storage."
#sentence = "If the stored verifier does not match, then an error of NFS4ERR_EXIST is returned."
#sentence = "If the server cannot support these exclusive create semantics, possibly because of the requirement to commit the verifier to stable storage, it should fail the OPEN request with the error NFS4ERR_NOTSUPP."
#sentence = "If the verifier do not match, the request is rejected with the status NFS4ERR_EXIST."
#sentence = "If the requester is not authorized to READ or WRITE(depending on the share_access value), the server must return NFS4ERR_ACCESS."
#sentence = "If the component provided to OPEN resolves to something other than a regular file (or a named attribute), an error will be returned to the client."
sentence = "If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned."

spans, tree = Parser.get_spans(sentence, show_prints = True)
print(f"all spans: {spans}")
print(f"annotation: {tree}")
print()
print(f"sentence: {sentence}")
print(build_tree(tree))
print()
print(f"Relation codes: {list(Relation)}")

Parser.visualize(tree)
