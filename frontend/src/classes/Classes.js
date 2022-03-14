class Segment {
    constructor(text, startingIndex, parent) {
        this.text = text;
        this.type = null;
        this.children = [];
        this.childrenRelations = [];
        this.startingIndex = startingIndex;
        this.endingIndex = startingIndex + text.length;
        this.parent = parent;
    }
}

class Relation {
    constructor(qnode, anode, type) {
        this.qnode = qnode;
        this.anode = anode;
        this.type = type;
    }
}

class Tree {
    constructor(root) {
        this.root = root;
        this.current = root;
        this.ordering = [root];
    }

    get next() {
        return this.ordering.shift();
    }

    insert(children) {
        this.ordering = children.concat(this.ordering);
    }
}


let sentence = "If it is a directory, NFS4ERR_ISDIR is returned; otherwise, NFS4ERR_SYMLINK is returned.";
let root = new Segment(sentence, 0, null);
let tree = new Tree(root)
console.log(root)