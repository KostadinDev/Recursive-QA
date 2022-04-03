
Sentence: If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned.

Identify spans: [it, is a directory, NFS4ERR_ISDIR, is returned, NFS4ERR_SYMLINK, is returned]
Identify relations between spans: (it, is a directory), (NFS4ERR_ISDIR, is returned), (NFS4ERR_SYMLINK, is returned)
For each relation ask a question on the verb phrase whose answer is the noun phrase
    Q: What is a directory?  A:, it
    Q: What is returned? A: NFS4ERR_ISDIR
    Q: What is returned? A: NFS4ERR_SYMLINK
Think of each pair as a segment: ["it is a directory", "NFS4ERR_ISDIR is returned",  "otherwise, NFS4ERR_SYMLINK is returned"]
Identify relations between spans: (it is a directory, NFS4ERR_ISDIR is returned)
    For each relation ask a question on the verb phrase whose answer is the noun phrase
    Q: What if it is a directory? A: NFS4ERR_ISDIR is returned // happens automatically
    Q: What otherwise? A: NFS4ERR_SYMLINK is returned. // automatically

Repeat until every component is connected
NOTE: Assume If - then - else - otherwise - when relationships are automatically handled
------
Sentence: If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned.

Q2: What is a directory?
A2: It

Q3: What is returned?
A3: NFS4ERR_ISDIR

Q4: what is returned?
A4: NFS4ERR_SYMLINK


