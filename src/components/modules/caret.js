/**
 * Codex Editor Caret Module
 *
 * @author CodeX-Team <https://ifmo.su>
 * @version 2.0.0
 */

/**
 * @class
 * @classdesc Can move or change caret position
 *
 * @property {Number} inputIndex - index of input where currently is caret
 * @property {Number} offset - caret offset
 */
export default class Caret extends Module {

    /**
     * @constructor
     */
    constructor(config) {

        super(config);

        this.inputIndex = null;
        this.offset = null;
        this.focusedNodeIndex = null;

    }

    /**
     * Creates Document Range and sets caret to the element.
     *
     * @param {Node} element - Changed Node.
     * @param {Number} index - index of child in Element
     * @param {Number} offset - caret offset relatively Element
     */
    set(element, index, offset) {

        offset = offset || this.offset || 0;
        index  = index  || this.focusedNodeIndex || 0;

        var childs = element.childNodes,
            nodeToSet;

        if ( childs.length === 0 ) {

            nodeToSet = element;

        } else {

            nodeToSet = childs[index];

        }

        /** If Element is INPUT */
        if (element.contentEditable != 'true') {

            element.focus();
            return;

        }

        if (editor.core.isDomNode(nodeToSet)) {

            nodeToSet = editor.content.getDeepestTextNodeFromPosition(nodeToSet, nodeToSet.childNodes.length);

        }

        let range     = document.createRange(),
            selection = window.getSelection();

        window.setTimeout(function () {

            range.setStart(nodeToSet, offset);
            range.setEnd(nodeToSet, offset);

            selection.removeAllRanges();
            selection.addRange(range);

            editor.caret.saveCurrentInputIndex();

        }, 20);

    }

    /**
     * @todo add description
     */
    saveCurrentInputIndex() {

        /** Index of Input that we paste sanitized content */
        var selection   = window.getSelection(),
            inputs      = editor.state.inputs,
            focusedNode = selection.anchorNode,
            focusedNodeHolder;

        if (!focusedNode) {

            return;

        }

        /** Looking for parent contentEditable block */
        while (focusedNode.contentEditable != 'true') {

            focusedNodeHolder = focusedNode.parentNode;
            focusedNode       = focusedNodeHolder;

        }

        /** Input index in DOM level */
        var editableElementIndex = 0;

        while (focusedNode != inputs[editableElementIndex]) {

            editableElementIndex ++;

        }

        caret.inputIndex = editableElementIndex;

    }

    /**
     * Returns current input index (caret object)
     * @returns {Number}
     */
    getInputIndex() {

        return this.inputIndex;

    }

    /**
     *
     * @param index
     */
    setToNextBlock(index) {

        var inputs = editor.state.inputs,
            nextInput = inputs[index + 1];

        if (!nextInput) {

            editor.core.log('We are reached the end');
            return;

        }

        /**
         * When new Block created or deleted content of input
         * We should add some text node to set caret
         */
        if (!nextInput.childNodes.length) {

            var emptyTextElement = document.createTextNode('');

            nextInput.appendChild(emptyTextElement);

        }

        editor.caret.inputIndex = index + 1;
        editor.caret.set(nextInput, 0, 0);
        editor.content.workingNodeChanged(nextInput);

    }

    /**
     * @param {int} index - index of input
     */
    setToPreviousBlock(index) {

        index = index || 0;

        var inputs = editor.state.inputs,
            previousInput = inputs[index - 1],
            lastChildNode,
            lengthOfLastChildNode,
            emptyTextElement;


        if (!previousInput) {

            editor.core.log('We are reached first node');
            return;

        }

        lastChildNode = editor.content.getDeepestTextNodeFromPosition(previousInput, previousInput.childNodes.length);
        lengthOfLastChildNode = lastChildNode.length;

        /**
         * When new Block created or deleted content of input
         * We should add some text node to set caret
         */
        if (!previousInput.childNodes.length) {

            emptyTextElement = document.createTextNode('');
            previousInput.appendChild(emptyTextElement);

        }
        editor.caret.inputIndex = index - 1;
        editor.caret.set(previousInput, previousInput.childNodes.length - 1, lengthOfLastChildNode);
        editor.content.workingNodeChanged(inputs[index - 1]);

    }

    /**
     * Inserts node at the caret location
     * @param {HTMLElement|DocumentFragment} node
     */
    insertNode (node) {

        var selection, range,
            lastNode = node;

        if (node.nodeType == editor.core.nodeTypes.DOCUMENT_FRAGMENT) {

            lastNode = node.lastChild;

        }

        selection = window.getSelection();

        range = selection.getRangeAt(0);
        range.deleteContents();

        range.insertNode(node);

        range.setStartAfter(lastNode);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);


    }

}

module.exports = Caret;

// module.exports = (function (caret) {//
//     /**
//      * @param {int} index - index of first-level block after that we set caret into next input
//      */
//     caret.setToNextBlock = function (index) {
//
//         var inputs = editor.state.inputs,
//             nextInput = inputs[index + 1];
//
//         if (!nextInput) {
//
//             editor.core.log('We are reached the end');
//             return;
//
//         }
//
//         /**
//          * When new Block created or deleted content of input
//          * We should add some text node to set caret
//          */
//         if (!nextInput.childNodes.length) {
//
//             var emptyTextElement = document.createTextNode('');
//
//             nextInput.appendChild(emptyTextElement);
//
//         }
//
//         editor.caret.inputIndex = index + 1;
//         editor.caret.set(nextInput, 0, 0);
//         editor.content.workingNodeChanged(nextInput);
//
//     };
//
//     /**
//      * @param {int} index - index of target input.
//      * Sets caret to input with this index
//      */
//     caret.setToBlock = function (index) {
//
//         var inputs = editor.state.inputs,
//             targetInput = inputs[index];
//
//         if ( !targetInput ) {
//
//             return;
//
//         }
//
//         /**
//          * When new Block created or deleted content of input
//          * We should add some text node to set caret
//          */
//         if (!targetInput.childNodes.length) {
//
//             var emptyTextElement = document.createTextNode('');
//
//             targetInput.appendChild(emptyTextElement);
//
//         }
//
//         editor.caret.inputIndex = index;
//         editor.caret.set(targetInput, 0, 0);
//         editor.content.workingNodeChanged(targetInput);
//
//     };
//
//
//     caret.position = {
//
//         atStart : function () {
//
//             var selection       = window.getSelection(),
//                 anchorOffset    = selection.anchorOffset,
//                 anchorNode      = selection.anchorNode,
//                 firstLevelBlock = editor.content.getFirstLevelBlock(anchorNode),
//                 pluginsRender   = firstLevelBlock.childNodes[0];
//
//             if (!editor.core.isDomNode(anchorNode)) {
//
//                 anchorNode = anchorNode.parentNode;
//
//             }
//
//             var isFirstNode  = anchorNode === pluginsRender.childNodes[0],
//                 isOffsetZero = anchorOffset === 0;
//
//             return isFirstNode && isOffsetZero;
//
//         },
//
//         atTheEnd : function () {
//
//             var selection    = window.getSelection(),
//                 anchorOffset = selection.anchorOffset,
//                 anchorNode   = selection.anchorNode;
//
//             /** Caret is at the end of input */
//             return !anchorNode || !anchorNode.length || anchorOffset === anchorNode.length;
//
//         }
//     };
//
//

//
//     return caret;
//
// })({});