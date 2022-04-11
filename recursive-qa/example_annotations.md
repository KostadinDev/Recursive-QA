Sentence: If the stored verifier does not match, then an error of NFS4ERR_EXIST is returned.

{
text: If the stored verifier does not match, then an error of NFS4ERR_EXIST is returned.
type: segment
relation: pre2post
children: [
    {
    text: If the stored verifier does not match
    type: segment
    relation: if_else
    children: [
        {
        text: if
        type: if_else
        },
        {
        text: the stored verifier does not match
        type: segment
        relation: argument 
        children:[
            {
            text: does not match
            type: predicate
            },
            {
            text: stored verifier
            type: var_val
            }]
        }]
    },
    {
    text: then an error of NFS4ERR_EXIST is returned
    type: segment
    relation: return_val
    children: [
        {
        text: NFS4ERR_EXIST
        type: const
        },
        {
        text: is returned
        type: function
        }]
    }]
}
Q1: What if the stored verifier does not match?
A1: then an error of NFS4ERR_EXIST is returned.

Q2: What does not match?
A2: the stored verifier

Q3: What is returned?
A3: NFS4ERR_EXIST


--------------------------------------------------------------------------------------------

Sentence: If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned.


{
text: If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned.
type: segment
relation: else_clause
children: [
    {
    text: If it is a directory, NFS4ERR_ISDIR is returned
    type: segment
    relation: pre2post
    children: [
        {
        text: If it is a directory,
        type: segment
        relation: if_clause
        children: [
            {
            text: if
            type: if_else 
            },
            {
            text: it is a directory
            type: segment  
            relation: argument
            children: [
                {
                text: it
                type: var_val
                },
                {
                text: is a directory
                type: predicate
                }]
            }]   
        },
        {
        text: NFS4ERR_ISDIR is returned
        type: segment
        relation: return_val 
        children:[
            {
            text: NFS4ERR_ISDIR
            type: const
            },
            {
            text: is returned
            type: function
            }]
        }]
    },
    {
    text: otherwise, NFS4ERR_SYMLINK is returned
    type: segment
    relation: return_val
    children: [
        {
        text: NFS4ERR_SYMLINK
        type: const
        },
        {
        text: is returned
        type: function
        }]
    }]
}


Q1: What if it is a directory?
A1: NFS4ERR_ISDIR is returned

Q2: What is a directory?
A2: It

Q3: What is returned?
A3: NFS4ERR_ISDIR

Q4: what is returned?
A4: NFS4ERR_SYMLINK


