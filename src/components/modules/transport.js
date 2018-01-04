/**
 * Codex.Editor Transport Module
 *
 * @copyright 2017 CodeX Team
 * @version 2.0
 */

/**
 * @typedef {Transport} Transport
 * @property {Object} currentRequest - current XmlHttpRequest instance
 * @property {Element|null} input - keeps input element in memory
 * @property {Object} arguments - keep plugin settings and defined callbacks
 */
export default class Transport extends Module {

    /**
     * @constructor
     * @param {EditorConfig} config
     */
    constructor({config}) {

        super({config});

        this.currentRequest = null;
        this.input = null;
        this.arguments = null;

    }

    /**
     * Prepares input element where will be files
     */
    prepare() {

        let input = $.make('input', [], {
            type: 'file'
        });

        /**
         * @todo Use listener module
         */
        input.addEventListener('change', this.fileSelected);
        this.input = input;

    }

    /**
     * Clear input when files is uploaded
     */
    clear() {

        /** Remove old input */
        this.input = null;

        /** Prepare new one */
        this.prepare();

    }

    /**
     * Callback for file selection
     */
    fileSelected() {

        let input       = this,
            i,
            files       = input.files,
            formData   = new FormData();

        if (editor.transport.arguments.multiple === true) {

            for ( i = 0; i < files.length; i++) {

                formData.append('files[]', files[i], files[i].name);

            }

        } else {

            formData.append('files', files[0], files[0].name);

        }

        // this.currentRequest = editor.core.ajax({
        //     type : 'POST',
        //     data : formData,
        //     url        : editor.transport.arguments.url,
        //     beforeSend : editor.transport.arguments.beforeSend,
        //     success    : editor.transport.arguments.success,
        //     error      : editor.transport.arguments.error,
        //     progress   : editor.transport.arguments.progress
        // });

        this.clear();


    }

    /**
     * Use plugin callbacks
     * @param {Object} args - can have :
     * @param {String} args.url - fetch URL
     * @param {Function} args.beforeSend - function calls before sending ajax
     * @param {Function} args.success - success callback
     * @param {Function} args.error - on error handler
     * @param {Function} args.progress - xhr onprogress handler
     * @param {Boolean} args.multiple - allow select several files
     * @param {String} args.accept - adds accept attribute
     */
    selectAndUpload(args) {

        this.arguments = args;

        if ( args.multiple === true) {

            this.input.setAttribute('multiple', 'multiple');

        }

        if ( args.accept ) {

            this.input.setAttribute('accept', args.accept);

        }

        this.input.click();

    }

    /**
     * Aborts started XMLHTTP request
     */
    abort() {

        this.currentRequest.abort();
        this.currentRequest = null;

    }

}

