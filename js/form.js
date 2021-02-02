import Template from './form.template.js';
import Regex from './regex.js';
export default function Form(props) {

    //  Template
    let template = new Template();
    let regex = new Regex();
    
    //  Properties
    let { form_json, container } = props;
    render();

    //  Render the form
    function render() {

        let {content} = form_json;

        //  Rows
        //  Each form content has different rows, and each row contains element(s)
        content.forEach( rows => {

            //  Within the rows
            let child = '';
            rows.forEach( element => {
                let {element_type} = element;
                switch(element_type){
                    case 'input':       child += template.input_template(element); break;
                    case 'select':      child += template.select_template(element); break;
                    case 'textarea':    child += template.textarea_template(element); break;
                    case 'button':      child += template.button_template(element); break;
                }
            });

            //  insert child to each row
            let row = template.rows({child});

            //  Insert row into container
            container.append(row);
        });

        //  Bind event with the elements
        bind_event_handeling(content);
    }

    /**
     * Bind event handlers to the DOM
     * @param {Array} content 
     */
    function bind_event_handeling( content ) {
        content.forEach( rows => {
            rows.forEach(element => {
                let {element_type} = element;
                switch(element_type){
                    case 'input':       input_handle(element); break;
                    case 'select':      select_handle(element); break;
                    case 'textarea':    textarea_handle(element); break;
                }
            })
        })
    }

    /**
     * Input element handling
     * @param {Object}      input_element 
     */
    function input_handle( input_element ) {
        let { input_id, data_type, error_id, error_msg, is_required } = input_element;
        
        //  Get input, and error
        let input = $("#" + input_id);
        let error = $("#" + error_id);
        
        //  When blur, validates
        input.on('blur', () => {
            let input_value = input.val();
            if(is_required){
                if(input_value === ''){
                    add_error(error, error_msg)
                }else{
                    validate_input({error, input_value, data_type})
                }
            }else{
                (input_value !== '') && validate_input({error, input_value, data_type})
            };
        });

        //  When focus, remove error
        input.on('focus', () => remove_error(error));
    }

    /**
     * Select element handling
     * @param {Object}      select_element 
     */
    function select_handle( select_element ) {
        let { select_id, error_id, error_msg, is_required } = select_element;

        //  Get select, and error
        let select = $("#" + select_id);
        let error = $("#" + error_id);

        //  When blur, check if is requried
        select.on('blur', () => {
            if(is_required && select[0].selectedIndex === 0) {
                add_error(error, error_msg);
            }
        })

        //  When focus, remove error
        select.on('focus', () => remove_error(error));
    }

    /**
     * Textarea handling
     * @param {Object}      textarea_element 
     */
    function textarea_handle( textarea_element ) {
        let {textarea_id, textarea_max, textarea_count, error_id, error_msg, is_required } = textarea_element;

        //  Get select, and error
        let textarea =      $(`#${textarea_id}`);
        let textcounter =   $(`#${textarea_id}_counter`);
        let error =         $(`#${error_id}`);

        //  When keyup, adjust textcounter
        textarea.on('keyup', () => {
            if(textarea_count){
                let value = textarea.val();
                let count = word_count(value);
                let { characters } = count;
                let remain = Math.floor(textarea_max) - characters;
                textcounter.html(remain);
            }
        });

        //  When blur, 
        textarea.on('blur', () => {
            let value = textarea.val();
            if(is_required && value === ''){
                add_error(error, error_msg);
            }
        });

        //  When focus remove textarea error
        textarea.on('focus', () => remove_error(error));
    }


    /**
     * Add callback function
     * @param {String}      cmd         Target button id
     * @param {Function}    callback    Callback function to get the validated data
     */
    function add_button_callback( cmd, callback ) {

        //  Get form content
        let {content} = form_json;
        content.forEach(rows => {
            rows.forEach( element => {

                let { element_type, button_id } = element;
                if(element_type === 'button'){

                    //  Get button
                    let button = $(`#${button_id}`);
                    button.on('click', () => {

                        switch (cmd) {
                            case 'submit':
                                let validated = validation(content);
                                let {errors, data} = validated
                                if(errors === 0){ callback(data) }
                            break;
                        }
                    });
                }
            });
        });
    }

    /**
     * Data validation
     * @param {Object}      content     Current form content
     */
    function validation ( content ) {
        let res = {
            errors: 0,
            data: []
        };
        content.forEach( rows => {
            rows.forEach(element => {
                let {element_type} = element;
                switch(element_type){
                    case 'input':       
                        test_input(element, ( err, cleanedData ) => {
                            res = updatev_validate_counter_value(err, cleanedData, res);
                        }); 
                    break;
                    case 'select':      
                        test_select(element, ( err, cleanedData ) => {
                            res = updatev_validate_counter_value(err, cleanedData, res);
                        }); 
                    break;
                    case 'textarea': 
                        test_textarea(element, ( err, cleanedData ) => {
                            res = updatev_validate_counter_value(err, cleanedData, res);
                        });
                    break;
                }
            })
        });
        return res;
    }

    /**
     * Update validate counter value
     * @param {*} err 
     * @param {*} cleanedData 
     * @param {*} res 
     */
    function updatev_validate_counter_value(err, cleanedData, res) {
        let {errors, data} = res;
        errors += err;
        data = [...data, cleanedData];
        res = {...res, errors, data };
        return res;
    }

    /**
     * Validate the textarea element
     * @param {Object}      element     Textarea element
     * @param {Function}    callback    Update callback
     */
    function test_textarea ( element, callback ) {

        let errors = 0, obj = {};
        let {textarea_id, textarea_name, error_id, error_msg, is_required } = element;

        //  Get select, and error
        let textarea =      $(`#${textarea_id}`);
        let error =         $(`#${error_id}`);
        let textarea_value = textarea.val();

        //
        if(is_required){
            if(textarea_value === ''){
                add_error(error, error_msg);
                errors++;
            }else{
                obj[textarea_name] = strip_me(textarea_value);
            }
        }else{
            if( textarea_value !== ''){ obj[textarea_name] = strip_me(textarea_value) }
        }
        callback(errors, obj);
    }

    /**
     * Validate the select element
     * @param {Object}      element     Textarea element
     * @param {Function}    callback    Update callback
     */
    function test_select ( element, callback ) {

        let errors = 0, obj = {};
        let { select_id, select_name, error_id, error_msg, is_required } = element;

        //  Get select, and error
        let select = $("#" + select_id);
        let error = $("#" + error_id);
        let select_value = select.val();

        //  
        if(is_required){
            if( select[0].selectedIndex === 0) {
                add_error(error, error_msg);
                errors++;
            }else{
                obj[select_name] = strip_me(select_value);
            }
        }else{
            if( select[0].selectedIndex !== 0){ obj[select_name] = strip_me(select_value) }
        }
        callback(errors, obj);
    }

    /**
     * Validate the input element during validation process
     * @param {Object}      element 
     * @param {Function}    callback 
     */
    function test_input ( element, callback ){

        let errors = 0, obj = {};
        let { data_type, error_id, error_msg, input_id, input_name, is_required } = element;
        
        let input = $(`#${input_id}`);
        let error = $(`#${error_id}`);
        let input_value = input.val();

        if(is_required){
            if( input_value === '' ){
                add_error(error, error_msg); 
                errors++;
            }else{
                let validate_res = regex.input_validation( input_value, data_type );
                let { result, msg } = validate_res;
                if ( result === false ) {
                    add_error( error, msg ); 
                    errors++;
                }else{
                    obj[input_name] = strip_me(input_value);
                }
            }
        }else{
            let validate_res = regex.input_validation( input_value, data_type );
            let { result, msg } = validate_res;
            if ( result === false ) {
                add_error( error, msg ); 
                errors++;
            }else{
                obj[input_name] = strip_me(input_value);
            }
        }
        callback(errors, obj);
    }

    /**
     * Validate the input element during entry process
     * @param {Object}      props 
     */
    function validate_input ( props ) {
        let { error, input_value, data_type } = props;
        let validate_res = regex.input_validation( input_value, data_type );
        let { result, msg } = validate_res;
            ( result === false ) && add_error( error, msg );
    }
    
    /**
     * Add error to DOM
     * @param {Object}      error 
     * @param {String}      msg 
     */
    function add_error ( error, msg ) {
        error.addClass('error_box');
        error.html(msg);
    }

    /**
     * Remove error from DOM
     * @param {Object}      error 
     */
    function remove_error ( error ) {
        error.removeClass('error_box');
        error.empty();
    }

    /**
     * Word count function for textarea
     * @param {String} val 
     */
    function word_count ( val ) {
        let reg = /\s+/g;
        let wom = val.match(reg);
        return {
            charactersNoSpaces: val.replace(reg, '').length,
            characters: val.length,
            words: wom ? wom.length : 0,
            lines: val.split(/\r*\n/).length
        };
    }

    /**
     * Strip the tags and return pure string, prevent front end injection
     * @param {*} value 
     */
    function strip_me ( value ) {
        let str = value.toString();
        return str.replace(/<\/?[^>]+>/gi, '');
    }

    //  Submit handle API
    this.add_button_callback = add_button_callback;
}