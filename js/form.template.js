export default function FormTemplate() {
    
    //  Each row
    this.rows = (props) => {
        let {child} = props;
        return `<div class="row">${child}</div>`;
    }

    //  Error msg
    this.error_msg = (props) => {
        let {msg} = props;
        return `<div class="error">${msg}</div>`;
    }

    //  Input template
    this.input_template = (props) => {
        
        let { input_id, input_label, input_type, input_name, input_placeholder, input_size, is_required, autocomplete, error_id } = props;

        //  Other attr  
        let require_tag =   (is_required) ? ' required' : '';
        let require_icon =  (is_required) ? '<span class="required">*</span>' : '';
        let is_auto =       (autocomplete) ? 'true' : 'false';

        return `
            <div class="form_element">
                <div class="input_label">
                    <label for="${input_id}">${input_label}${require_icon}</label>
                </div>
                <div class="input_element">
                    <input type="${input_type}" name="${input_name}" id="${input_id}" placeholder="${input_placeholder}" autocomplete="${is_auto}" size="${input_size}"${require_tag}/>
                </div>
                <div id="${error_id}"></div>
            </div>
        `;
    }

    //  Select template
    this.select_template = (props) => {

        let {select_label, select_id, select_name, select_options, placeholder, error_id, is_required} = props;
        
        //  Other attr  
        let require_tag =   (is_required) ? ' required' : '';
        let require_icon =  (is_required) ? '<span class="required">*</span>' : '';

        //  Render options
        let options = '';
        if(select_options.length !== 0) {
            select_options.forEach( option => {
                let {value, text} = option;
                options += `<option value="${value}">${text}</option>`;
            });
        }

        return `
            <div class="form_element">
                <div class="select_label">
                    <label for="${select_id}">${select_label}${require_icon}</label>
                </div>
                <div class="select_element">
                    <select id="${select_id}" name="${select_name}"${require_tag}>
                        <option value="" selected>${placeholder}</option>
                        ${options}
                    </select>
                </div>
                <div id="${error_id}"></div>
            </div>
        `;
    }

    //  Textarea template
    this.textarea_template = (props) => {
        let {textarea_label, textarea_remark, textarea_id, textarea_name, textarea_max, textarea_count, placeholder, error_id, is_required } = props;

        //  Other attr  
        let require_tag =   (is_required) ? ' required' : '';
        let require_icon =  (is_required) ? '<span class="required">*</span>' : '';
            textarea_remark = (typeof textarea_remark !== 'undefined') 
                ? `<div class="textarea_remark">${textarea_remark}</div>`
                : '';

        //  Word counter
        let text_counter = (textarea_count) 
                ? `<div class="text_counter" id="${textarea_id}_counter">${textarea_max}</div>`
                : '';

        return `
            <div class="form_element">
                <div class="textarea_label">
                    <label for="${textarea_id}">${textarea_label}${require_icon}</label>
                </div>
                ${textarea_remark}
                ${text_counter}
                <div class="textarea_element">
                    <textarea id="${textarea_id}" name="${textarea_name}" maxlength="${textarea_max}" placeholder="${placeholder}"${require_tag}></textarea>
                </div>
                <div id="${error_id}"></div>
            </div>
        `;
    }

    //  Button template
    this.button_template = (props) => {
        let { button_type, button_text, button_id } = props;
        switch (button_type) {
            case 'submit':
                return `<button class="form_sumbit" id="${button_id}">${button_text}</button>`;
        }
    }
}