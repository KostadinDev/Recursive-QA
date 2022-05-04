/** MultilineChart.js */
import React from "react";
import {Tree} from 'react-tree-graph';
// import 'react-tree-graph/dist/style.css';
import './data.styles.css';
import {isMobile} from "react-device-detect";

export default function TreeGraph(props) {
    let treeData = {
        name: 'Parent',
        children: [{
            name: 'Child One'
        }, {
            name: 'Child Two'
        }]
    };

    function getTreeData(data) {
        console.log(data)
    }

    return (
        <div className={!isMobile?"tree-graph":"mobile-tree-graph"}>
            {
                props.treeData ? <Tree
                    data={props.treeData}
                    height={275}
                    width={600}
                    animated
                    textProps={{className: 'tree-graph'}}/> : <div style={{height:275}}></div>
            }
        </div>
    )
}