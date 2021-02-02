export default function Regex() {

    //  Input validation
    this.input_validation = (value, type) => {
        switch (type) {
            case 'text':                    
                return regex_text(value);
            case 'phone_number':            
                return regex_phone(value);
            case 'email':                   
                return regex_email(value);
            case 'address':                 
                return regex_address(value);
        }
    } 

    //  Text
    function regex_text(value) {
        let reg = /^[\u00C0-\u017Fa-zA-Z'’‘’][\u00C0-\u017Fa-zA-Z’‘’' -]+[\u00C0-\u017Fa-zA-Z'’‘’]?$/;
        let res = reg.test(value);
        return (res) ? {result: true} : {result: false, msg: 'Please enter text only'}
    }

    //  Phone
    function regex_phone(value) {
        let reg = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
        let res = reg.test(value);
        return (res) ? {result: true} : {result: false, msg: 'Please enter phone number only'}
    }

    //  Email
    function regex_email(value) {
        let reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        let res = reg.test(value);
        return (res) ? {result: true} : {result: false, msg: 'Please enter correct email format'}
    }

    //  Address
    function regex_address(value) {
        let reg = /^[a-zA-Z0-9\s,'-.#]*$/;
        let res = reg.test(value);
        return (res) ? {result: true} : {result: false, msg: 'Please enter address only, no special characters'}
    }
}