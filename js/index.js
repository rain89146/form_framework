import Form from './form.js';

let form_json = {
    content: [
        [
            {
                element_type:       'input',
                input_label:        'Enter your name',
                input_id:           'input_example',
                input_name:         'input_example',
                input_size:         '10',
                input_type:         'text',
                data_type:          'text', 
                input_placeholder:  'Your name',
                autocomplete:       true,
                is_required:        true,
                error_id:           'imput_example_error',
                error_msg:          'please enter your name'
            },
            {
                element_type:       'input',
                input_label:        'Enter your phone',
                input_id:           'input_example_two',
                input_name:         'input_example_two',
                input_size:         '10',
                input_type:         'text',
                data_type:          'phone_number', 
                input_placeholder:  'Your phone number',
                autocomplete:       false,
                is_required:        false,
                error_id:           'imput_example_error_two',
                error_msg:          'please enter your phone number'
            }
        ],
        [
            {
                element_type:       'select',
                select_label:       'Select your option',
                select_id:          'select_example',
                select_name:        'select_example',
                select_dynamic:     false, 
                select_options: [
                    {
                        value: '1',
                        text:  'Hello'
                    },
                    {
                        value: '0',
                        text:  'Bye'
                    }
                ],
                placeholder:        'Select',
                is_required:        true,
                error_id:           'select_example_error',
                error_msg:          'make your selection'
            },
            {
                element_type:       'select',
                select_label:       'Select your option',
                select_id:          'select_example_two',
                select_name:        'select_example_two',
                select_dynamic:     false, 
                select_options: [
                    {
                        value: '1',
                        text:  'Hello'
                    },
                    {
                        value: '0',
                        text:  'Bye'
                    }
                ],
                placeholder:        'Select',
                is_required:        false,
                error_id:           'select_example_error_two',
                error_msg:          'make your selection'
            }
        ],
        [
            {
                element_type:       'textarea',
                textarea_label:     'Enter something in this text area',
                textarea_remark:    'this is remark',     
                textarea_id:        'textarea_example',
                textarea_name:      'textarea_example',
                textarea_max:       '1000',
                textarea_count:     true,
                placeholder:        'Type something you like',
                is_required:        true,
                error_id:           'textarea_example_error',
                error_msg:          'please enter your name'
            }
        ],
        [
            {
                element_type:       'button',
                button_id:          'form_submit',
                button_type:        'submit',
                button_action:      'submit',
                button_text:        'Submit'
            }
        ]
    ]
}

let container = $("#form");
let form = new Form({form_json, container});
    form.add_button_callback('submit', (data) => {
        console.log(data);
    })