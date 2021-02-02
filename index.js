/*  Copyright (C) 2020 Advanced Legal Intake Systems - All Rights Reserved
 * 
 *  ATTENTION. This Source Code (the "Code") is protected by Copyright law
 *  and is owned by Advanced Legal Intake Systems.  Any attempt to modify,
 *  copy, duplicate, share,  disassemble, reverse engineer, circumvent, or
 *  otherwise change, or use the Code, in whole or in part, is a violation
 *  of law and a material breach of agreement.
 *
 *  If you are reading this, you are hereby advised to exit and close this
 *  program immediately.  All data received, including your access, views,
 *  copies, shares, modifications, dates, times, device information and IP
 *  address may be used and reported, as may be appropriate to enforce our
 *  legal rights.
 * 
 */


//check if the browser get reloaded or not
if (window.performance) {

    //if the browser get reloaded, empty the entire localstorage
    if (performance.navigation.type == 1) {

        //get the current state
        let currentState = history.state;

        //see if user was on other state
        if(currentState == null){
            window.localStorage.clear();
        }
    }else{
        window.localStorage.clear();
    }
}

//get the current year, month, date
const todayDate = new Date();
const currentyr = todayDate.getFullYear();
const currentmn = todayDate.getMonth() + 1;
const currentdy = todayDate.getDate();

//The id that links form and survey
let sid;

//Number of total pass
let totalElements, totalError = 0;

//The form holder in declear in config.js
const content_holder = 'form_holders';



/*	===========================================================================================
    Content deployment
	===========================================================================================	*/

    //  Deploy the page content by index number
    function deployPageContent(index) {
        let data = formcontent;

        //Sections
        let sections = data.sections;

        //extract the sections
        sections.forEach((sect, si) => {
            renderFormContent(sect, si)
        });

        //Render the title and desc
        let section_title = sections[index].section_title;
        let section_desc = sections[index].section_description;
        $("#main_page_title").html(section_title);
        $("#main_page_desc").html(section_desc);

        //always shows the first section
        $("#section_" + index).show();
    }



/*	===========================================================================================
    Select logic callback
	===========================================================================================	*/

    //  Logical callback
    function logicCallback(id, si, ti, fi, ii, conid, column_id) {
        //hide the container
        $("#" + conid).hide();

        //Show the container
        $("#" + conid).empty();
        $("#" + conid).addClass('mar15around');
        $("#" + column_id).addClass('flexToBlock');

        //get select value
        let value = $("#" + id).val();

        if (value != '') {

            //get the element
            // pageContentPromise.done(data => {
                let data = formcontent;

                //get the logic content
                let sections = data.sections;
                
                //
                let logicContent = sections[si].section_content[ti].form_content[fi][ii].logicChild[value];

                //
                if(typeof logicContent != 'undefined'){
                    logicContent.forEach((lData, li) => {

                        //create rows for items
                        let column_id = `logicCol_${generateId()}`;
                        let column = acluColumnTemplate(column_id);
                        $("#" + conid).append(column);

                        //
                        lData.forEach((eData, ei) => {

                            //get the logic content data 
                            let elementtype = eData.elementtype;
                            let errorid = eData.errorid;
                            let id = eData.id;
                            let maxlength = eData.maxlength;
                            let placeholder = '';
                            let required = eData.required;
                            let size = eData.size;
                            let title = eData.title;
                            let type = eData.type;
                            let cols = eData.cols;
                            let rows = eData.rows;
                            let options = eData.options;
                            let childholder = `child_${generateId()}`;
                            let othercheckconid = `otherconid_${generateId()}`;
                            let elementid = `checkbox_${generateId()}`;
                            let itemtype = eData.itemtype;
                            let isDynamic = eData.isDynamic;

                            let element = '';
                            switch (elementtype) {

                                //checkbox
                                case 'checkbox':
                                    switch (required) {
                                        case 'Y':
                                            element = acluCheckboxTemplateRequired(elementid, id, title, childholder, othercheckconid, errorid);
                                            break;
                                        case 'N':
                                            element = acluCheckboxTemplateOptional(elementid, id, title, childholder, othercheckconid);
                                            break;
                                    }
                                    $("#" + column_id).append(element);

                                    //render the options of checkbox
                                    options.forEach(rows => {

                                        //render the row of each item
                                        let rowsid = `checkrows_${generateId()}`;
                                        $("#" + childholder).append(`<div class="columns" id="${rowsid}"></div>`);

                                        //render the element in each row
                                        rows.forEach(op => {
                                            let text = op.text;
                                            let logicCheckboxCallback = `logicCheckboxCallback('${elementid}','${si}','${ti}','${fi}','${ii}','${value}','${li}','${ei}','${op.value}','${othercheckconid}', '${errorid}')`;
                                            let checkelement = acluCheckboxElement(id, op.value, text, logicCheckboxCallback);
                                            $("#" + rowsid).append(checkelement);
                                        })
                                    });
                                    break;

                                //input
                                case 'input':
                                    //
                                    switch (required) {
                                        case 'Y':
                                            element = acluInputTemplateRequired(id, title, type, placeholder, size, maxlength, errorid);
                                            break;
                                        case 'N':
                                            element = acluInputTemplateOptional(id, title, type, placeholder, size, maxlength, errorid);
                                            break;
                                    }
                                    $("#" + column_id).append(element);

                                    //implement input element handling
                                    inputElementHandling(id, errorid, itemtype, size, maxlength, required);
                                    break;

                                //textarea
                                case 'textarea':
                                    //textarea callback
                                    let textareacallback = `textareaHandling(${id}, ${maxlength})`;

                                    placeholder = eData.placeholder;
                                    switch (required) {
                                        case 'Y':
                                            element = acluTextareaTemplateRequired(id, title, placeholder, cols, rows, maxlength, errorid, textareacallback);
                                            break;
                                        case 'N':
                                            element = acluTextareaTemplateOptional(id, title, placeholder, cols, rows, maxlength, textareacallback);
                                            break;
                                    }
                                    $("#" + column_id).append(element);
                                    break;

                                //select
                                case 'select':
                                    placeholder = eData.placeholder;
                                    switch (required) {
                                        case 'Y':
                                            element = acluSelectTemplateRequired(id, title, placeholder, errorid);
                                            break;
                                        case 'N':
                                            element = acluSelectTemplateOptional(id, title, placeholder);
                                            break;
                                    }
                                    $("#" + column_id).append(element);

                                    if(isDynamic != '' && typeof isDynamic != 'undefined'){
                                        appendDynamicData(isDynamic, id);
                                    }else{
                                        options.forEach(opt => {
                                            $("#" + id).append(`<option value="${opt.value}">${opt.text}</option>`);
                                        });
                                    }
                                    break;

                                //datepick
                                case 'datepick':
                                    placeholder = eData.placeholder;
                                    switch (required) {
                                        case 'Y':
                                            element = acluDatepickerTemplateRequire(id, title, placeholder, errorid);
                                            break;
                                        case 'N':
                                            element = acluDatepickerTemplateOptional(id, title, placeholder);
                                            break;
                                    }
                                    $("#" + column_id).append(element);
                                    break;

                                //remark
                                case 'remark':
                                    $("#" + column_id).append(acluRemarkTemplate(eData.remark_desc));
                                    break;

                                //submit
                                case 'button':
                                    let buttontext = eData.button_text;
                                    let eventtype = eData.eventtype;
                                    let buttonCallback;
                                    let btnid = (id != null) ? id : '';
                                    if (eventtype != 'leave') {
                                        buttonCallback = `callbackbutton('${eventtype}','${si}','${parseInt(si) + 1}','${btnid}')`;
                                    } else {
                                        let redirectUrl = eData.url;
                                        buttonCallback = `reDirectMe(&quot;${redirectUrl}&quot;)`;
                                    }
                                    element = acluButton(buttonCallback, btnid, themecolor, textcolor, buttontext);
                                    $("#" + column_id).append(element);
                                    break;
                            }
                        });

                        //Show the container
                        $("#" + conid).show();
                    });
                }
            // })
        }else{
            $("#" + conid).removeClass('mar15around');
            $("#" + column_id).removeClass('flexToBlock');
        }
    }



/*	===========================================================================================
    Check box
	===========================================================================================	*/

    //  Logic of the checkbox callback
    function logicCheckboxCallback(mainelementid, si, ti, fi, ii, indexkey, li, ei, checkedValue, othercheckconid, errorid) {
        // pageContentPromise.done(data => {
            let data = formcontent;

            //get the check box content
            let sections = data.sections;
            let logicContent = sections[si].section_content[ti].form_content[fi][ii].logicChild[indexkey][li][ei];

            //get the id of the main checkbox
            let id = logicContent.id;

            //Get the existing value that already stored
            let existvalue = $("#" + id).val();

            //if the value is not empty or empty
            let existarr = (existvalue != '') ? existvalue.split(',') : [];

            //get the elements of all the checkboxes
            let checkElements = document.getElementsByName(id);

            //create the id
            let checkedId = `check_element_${id}_${checkedValue}`;

            //see get the box check event
            if ($("#" + checkedId).is(':checked')) {
                //if the box is checked

                //if the item is not found in the exist array then push it
                if (existarr.indexOf(checkedValue) != -1) {
                    //found do something
                } else {
                    //not found, push the checked value
                    existarr.push(checkedValue);
                }

                //save the valaue
                $("#" + id).val(existarr.toString());

                //hanlding the three methods, when checked
                switch (checkedValue) {
                    case 'na':
                        nontheabove(true, checkedId, checkedValue, checkElements, id);
                        break;

                    case 'all':
                        allthatapply(true, checkedId, checkElements, id);
                        break;

                    case 'other':
                        otheroption(true, checkedValue, logicContent, othercheckconid, id);
                        break;
                }

                //remove the error message
                $("#" + mainelementid).removeClass('errorbox');
                $("#" + errorid).removeClass('errormsg');
                $("#" + errorid).empty();

            } else if ($("#" + checkedId).is(":not(:checked)")) {

                //if the box is unchecked
                if (existarr.indexOf(checkedValue) != -1) {
                    //get the index of the element
                    let elIndex = existarr.indexOf(checkedValue);

                    //remove the element from the array
                    existarr.splice(elIndex, 1);

                    //save the value
                    $("#" + id).val(existarr.toString());
                }

                //hanlding the three methods, when uncheck
                switch (checkedValue) {
                    case 'na':
                        nontheabove(false, checkedId, checkedValue, checkElements, id);
                        break;

                    case 'all':
                        allthatapply(false, checkedId, checkElements, id);
                        break;

                    case 'other':
                        otheroption(false, checkedValue, logicContent, othercheckconid, id);
                        break;
                }
            }
        // });
    }

    //  Checkbox callback
    function checkBoxCallback(mainelementid, id, checkedValue, othercheckconid, si, ti, fi, ii, errorid) {
        //get the logic content
        let logicContent = getLogicChildElement(si, ti, fi, ii);

        //Get the existing value that already stored
        let existvalue = $("#" + id).val();

        //if the value is not empty or empty
        let existarr;
        if (existvalue != '') {
            //is not empty, then convert to array
            existarr = existvalue.split(',');

        } else {
            //is empty, then create new array
            existarr = [];
        }

        //get the elements of all the checkboxes
        let checkElements = document.getElementsByName(id);

        //checked boxes id
        let checkedId = `check_element_${id}_${checkedValue}`;

        //see get the box check event
        if ($("#" + checkedId).is(':checked')) {
            //if the box is checked

            //if the item is not found in the exist array then push it
            if (existarr.indexOf(checkedValue) != -1) {
                //found do something
            } else {
                //not found, push the checked value
                existarr.push(checkedValue);
            }

            //save the valaue
            $("#" + id).val(existarr.toString());

            //hanlding the three methods, when checked
            switch (checkedValue) {
                case 'na':
                    nontheabove(true, checkedId, checkedValue, checkElements, id);
                    break;

                case 'all':
                    allthatapply(true, checkedId, checkElements, id);
                    break;

                case 'other':
                    otheroption(true, checkedValue, logicContent, othercheckconid, id);
                    break;
            }

            //remove the error message
            $("#" + mainelementid).removeClass('errorbox');
            $("#" + errorid).removeClass('errormsg');
            $("#" + errorid).empty();

        } else if ($("#" + checkedId).is(":not(:checked)")) {

            //if the box is unchecked
            if (existarr.indexOf(checkedValue) != -1) {
                //get the index of the element
                let elIndex = existarr.indexOf(checkedValue);

                //remove the element from the array
                existarr.splice(elIndex, 1);

                //save the value
                $("#" + id).val(existarr.toString());
            }

            //hanlding the three methods, when uncheck
            switch (checkedValue) {
                case 'na':
                    nontheabove(false, checkedId, checkedValue, checkElements, id);
                    break;

                case 'all':
                    allthatapply(false, checkedId, checkElements, id);
                    break;

                case 'other':
                    otheroption(false, checkedValue, logicContent, othercheckconid, id);
                    break;
            }
        }
    }

    //  Other check box handler
    function otheroption(status, checkedValue, logicContent, othercheckconid, valueHolder) {
        //checkedId -> the checkbox itself;
        //checkElements -> all the other element of this checkbox group
        //valueHolder -> the value holder of the checkbox group

        //the other cases
        let noneTheAboveOptionId = `check_element_${valueHolder}_na`;
        let AllOptionId = `check_element_${valueHolder}_all`;

        if (status) {
            //if is checked

            //get the elements
            let logicElement = logicContent.logicChild[checkedValue];

            //render the logicChild
            logicElement.forEach(lgc => {

                //the access rows
                lgc.forEach(lge => {
                    let elementtype = lge.elementtype;
                    let errorid = lge.errorid;
                    let id = lge.id;
                    let maxlength = lge.maxlength;
                    let placeholder = lge.placeholder;
                    let required = lge.required;
                    let size = lge.size;
                    let title = lge.title;
                    let type = lge.type;
                    let itemtype = lge.itemtype;

                    //render the logic child
                    let lcElement = '';
                    switch (elementtype) {
                        case 'input':
                            switch (required) {
                                case 'Y':
                                    lcElement = acluInputTemplateRequired(id, title, type, placeholder, size, maxlength, errorid);
                                    break;
                                case 'N':
                                    lcElement = acluInputTemplateOptional(id, title, type, placeholder, size, maxlength, errorid);
                                    break;
                            }
                            break;

                        case 'textbox':
                            break;

                        case 'select':
                            break;
                    }
                    $("#" + othercheckconid).append(lcElement);

                    switch (elementtype) {
                        //input handling

                        case 'input':
                            //implement input element handling
                            inputElementHandling(id, errorid, itemtype, size, maxlength, required);
                            break;
                    }
                });
            });

            //disable the special case options
            $("#" + noneTheAboveOptionId).attr('disabled', true);
            $("#" + AllOptionId).attr('disabled', true);

            //show the content
            $("#" + othercheckconid).show();

        } else {
            //if is uncheck

            //remove the disable for the special cases options
            $("#" + noneTheAboveOptionId).removeAttr('disabled');
            $("#" + AllOptionId).removeAttr('disabled');

            //clear the content
            $("#" + othercheckconid).empty();

            //hide the content
            $("#" + othercheckconid).hide();
        }
    }

    //  All that apply check box handler
    function allthatapply(status, checkedId, checkElements, valueHolder) {
        //checkedId -> the checkbox itself;
        //checkElements -> all the other element of this checkbox group
        //valueHolder -> the value holder of the checkbox group

        //the other cases
        let noneTheAboveOptionId = `check_element_${valueHolder}_na`;
        let otherOptionId = `check_element_${valueHolder}_other`;

        if (status) {
            //if is checked

            //check all the boxes
            checkAll(checkElements);

            //disable the all cases options
            let allvalues = [];

            for(let i = 0; i<checkElements.length; i++){
                let els = checkElements[i];

                let elsId = els.id;

                if (elsId != checkedId) {
                    //diable the 
                    $("#" + elsId).attr('disabled', true);
                }

                //get the value of all the checkboxes
                if (elsId != checkedId && elsId != noneTheAboveOptionId && elsId != otherOptionId) {
                    allvalues.push(els.value);
                }

            }

            //uncheck the special cases
            $("#" + noneTheAboveOptionId).prop('checked', false);
            $("#" + otherOptionId).prop('checked', false);

            //save the value in this
            $("#" + valueHolder).val(allvalues.toString());
        } else {
            //if the box is uncheck then set all element disable to false 
            for(let i = 0; i<checkElements.length; i++){
                let els = checkElements[i];

                let elsId = els.id;
                $("#" + elsId).removeAttr('disabled');
            }

            //unckecked everything
            unCheckedAll(checkElements);

            //clear the value
            $("#" + valueHolder).val("");
        }

    }

    //  Non the above check box handler
    function nontheabove(status, checkedId, checkedValue, checkElements, valueHolder) {
        //checkedId -> the checkbox itself;
        //checkedValue -> the value of the check box;
        //checkElements -> all the other element of this checkbox group
        //valueHolder -> the value holder of the checkbox group

        //unckecked everything
        unCheckedAll(checkElements);

        //if the status is checked or uncheck
        if (status) {

            //if the box is checked then other element expect this set to disable 
            for(let i = 0; i<checkElements.length; i++){
                let els = checkElements[i];
                let elsId = els.id;

                if (elsId != checkedId) {
                    $("#" + elsId).attr('disabled', true);
                }            
            }

            //set the checked box to checked
            $("#" + checkedId).prop('checked', true);

            //store this value
            $("#" + valueHolder).val(checkedValue);
        } else {

            //if the box is checked then other element expect this set to disable 
            for(let i = 0; i<checkElements.length; i++){
                let els = checkElements[i];
                let elsId = els.id;

                if (elsId != checkedId) {
                    $("#" + elsId).removeAttr('disabled');
                }            
            }

            //uncheded
            $("#" + valueHolder).val("");
        }
    }

    //  Check all the boxes
    function checkAll(elements) {
        for(let i = 0; i<elements.length; i++){
            let els = elements[i];
            els.checked = true;
        }
    }

    //  Unchecked all the check boxes
    function unCheckedAll(elements) {
        for(let i = 0; i<elements.length; i++){
            let els = elements[i];
            els.checked = false;
        }
    }



/*	===========================================================================================
    Form validation
	===========================================================================================	*/

    //  Get all the errors
    function getAllErrors(){
        let allerrors = document.getElementsByClassName('errorbox');
        return allerrors;
    }



/*	===========================================================================================
    Form submittion
	===========================================================================================	*/

    //  Callback button that takes an event var, and let the event var to direct button what to do
    function callbackbutton(evnt, curIndex, nexIndex, btnid) {
        
        //get the pass value
        let pass = elementValidation(curIndex);

        //get the total pass of this
        totalError = getAllErrors().length;

        //if the user pass the validation
        if (pass) {
            
            //make sure all the field is correct
            if(totalError == 0){

                //Change the stage title
                let data = formcontent;
                let section = data.sections;

                //render the title
                let section_title = section[nexIndex].section_title;
                $("#main_page_title").html(section_title);

                //render the desc
                let section_desc = section[nexIndex].section_description;
                $("#main_page_desc").html(section_desc);

                //perform rask by the type of event
                switch (evnt) {
                    case 'next':
                        //Save the content to local storage
                        saveToLocalStorage(curIndex);
                        nextSection(curIndex, nexIndex);
                        break;

                    case 'submitForm':
                        //when user submit, validates the form, save it to Form API and move on to next
                        formSubmission(curIndex, nexIndex, btnid);
                        break;

                    case 'submitSurvey':
                        //when user submit validates the form, save it to Survey API and move on to next
                        surveySubmission(curIndex);
                        nextSection(curIndex, nexIndex);
                        break;

                    case 'leave':
                        //When user leave the sectopm
                        break;
                }
            }else{
                let firstElements = getAllErrors()[0];
                $("#"+firstElements.id).focus();
            }
        }
    }

    //  Form Submission
    function formSubmission(curIndex, nextIndex, btnid) {

        //  Disable the btn
        $("#"+btnid).prop('disabled', true);
        
        let data = formcontent;

        //get the section content
        let section = (data.sections)[curIndex];

        //get the content of form
        let content = section.section_content;

        //extract the content data and store into array
        let paramArr = extractContentData(content);

        //store to local array
        let key = `_fe_${curIndex}`;
        storage.setItem(key, JSON.stringify(paramArr));

        //create empty array
        let itemArr = [];

        //extract all the content before this section and store it in an array
        for (let i = Number(curIndex); i >= 0; i--) {

            //get the storage key
            let storageKey = `_fe_${i}`;

            //get the storage item
            let item = storage.getItem(storageKey);

            //if there's something inside
            if (typeof item != 'undefined' && item != null && item != '') {
                let itemObj = JSON.parse(item);

                itemObj.forEach(itemData => {
                    itemArr.push(itemData);
                });
            }
        }

        //get the url of API
        let submitformAPi = page_configuration.submit_form_url;

        //post promise
        postDataParam(submitformAPi, itemArr).done(rep => {

            successCallback(rep, curIndex, nextIndex, btnid);

        }).fail(rej => {

            failCallback(rej, btnid);
        });
    }

    //  Success callback
    function successCallback(resp, curIndex, nextIndex, btnid){

        if(resp.success)
        {
            //set the sid
            sid = resp.contact_id;
            window.localStorage.clear();
            nextSection(curIndex, nextIndex);

        }else{

            alert('Network issue occured, please refresh the page and try again');

        }

        $("#"+btnid).prop('disabled', false);
    }

    //  Fail callback
    function failCallback(rej, btnid){

        //alert the user
        alert('Network issue occured, please refresh the page and try again');

        //  enable it
        $("#"+btnid).prop('disabled', false);
    }

    //  next section
    function nextSection(curIndex, nexIndex) {

        //restore the form content
        contentResurrection(nexIndex);

        //hide the current stage
        $("#section_" + curIndex).fadeOut();

        //show the next stage
        $("#section_" + nexIndex).fadeIn();

        //set the view to 0
        window.scrollTo(0, 0);

        //get the stage
        let stage = $("#section_" + nexIndex).attr('data-stage');

        //build the stage url
        let stageurl = `?step=${stage}`;

        //push the url to the state
        history.pushState(stage, null, stageurl);
    }

    //  Save to local storage
    function saveToLocalStorage(curIndex) {

        let data = formcontent;

        //storage key
        let storageKey = `_fe_${curIndex}`;

        //get the section content
        let section = (data.sections)[curIndex];

        //get the content of form
        let content = section.section_content;

        //form element array
        let formElementArr = extractContentData(content);

        //store this into localstorage
        let storJson = JSON.stringify(formElementArr);
        storage.setItem(storageKey, storJson);
    }

    //  Extract the data from content object
    function extractContentData(content) {
        //create empty array to store the object
        let paramArr = [];

        //extracting the data
        content.forEach(cData => {

            //get the form content data
            let formContent = cData.form_content;

            //extract the form data
            formContent.forEach(fData => {

                //get teh form element data
                fData.forEach(eData => {
                    let id = eData.id;
                    let value = (typeof id == 'undefined') ?  "" : replaceApostrophe($("#" + id).val());
                    let elementtype = eData.elementtype;
                    let formElement = eData.formElement;
                    let title = eData.title;
                    let logicChildElements = eData.logicChild;

                    let obj = {};
                    switch (elementtype) {
                        case 'input':
                        case 'textarea':
                        case 'select':
                        case 'datepick':
                            obj['name'] = id;
                            obj['title'] = title;
                            obj['type'] = elementtype;
                            obj['value'] = value;
                            paramArr.push(obj);
                            break;

                        //child element
                        case 'selectchild':
                            if (formElement == 'Y') {
                                obj['name'] = id;
                                obj['title'] = title;
                                obj['type'] = elementtype;
                                obj['value'] = value;
                                paramArr.push(obj);

                                //
                                if (value != '2') {
                                    let childElement = eData.childElement;
                                    childElement.forEach(cData => {
                                        cData.forEach(ceData => {
                                            let cetype = ceData.elementtype;
                                            if (cetype != 'remark' && cetype != 'button') {
                                                let cobj = {};
                                                switch (cetype) {
                                                    case 'input':
                                                    case 'textarea':
                                                    case 'select':
                                                    case 'datepick':
                                                        cobj['name'] = ceData.id;
                                                        cobj['title'] = ceData.title;
                                                        cobj['type'] = ceData.elementtype;
                                                        cobj['value'] = replaceApostrophe($("#" + ceData.id).val());
                                                        paramArr.push(cobj);
                                                        break;
                                                }

                                            }
                                        })
                                    });
                                }
                            }
                            break;

                        //logic element
                        case 'selectlogic':
                            if (formElement == 'Y') {
                                obj['name'] = id;
                                obj['title'] = title;
                                obj['type'] = elementtype;
                                obj['value'] = replaceApostrophe($("#" + id).val());
                                paramArr.push(obj);

                                //access the logic element
                                if (value != '') {

                                    let logicElement = (eData.logicChild)[value];

                                    //if it is not undefined
                                    if (typeof logicElement != 'undefined') {

                                        //for through the logic element
                                        logicElement.forEach(lData => {
                                            lData.forEach(llData => {

                                                //push all the element into param except renark and button
                                                let lltype = llData.elementtype;
                                                if (lltype != 'remark' && lltype != 'button') {
                                                    let lobj = {};
                                                    lobj['name'] = llData.id;
                                                    lobj['title'] = llData.title;
                                                    lobj['type'] = llData.elementtype;
                                                    lobj['value'] = replaceApostrophe($("#" + llData.id).val());
                                                    paramArr.push(lobj);
                                                }

                                                //push the checkbox element into array
                                                if (lltype = 'checkbox') {
                                                    //get the check box elements
                                                    let checkboxElements = document.getElementsByName(llData.id);

                                                    //map through the check box elements
                                                    for(let i=0; i< checkboxElements.length; i++){
                                                        let els = checkboxElements[i];

                                                        //see if user make a check
                                                        if (els.checked) {

                                                            //get the checked value
                                                            let elsValue = $("#" + els.id).val();

                                                            //if the other checked
                                                            if (elsValue == 'other') {

                                                                //get the logic element
                                                                let logicEls = llData.logicChild[elsValue];

                                                                logicEls.forEach(ldata => {
                                                                    ldata.forEach(odata => {
                                                                        let oObj = {};
                                                                        let oRequired = odata.required;
                                                                        let oElementtype = odata.elementtype;
                                                                        let oId = odata.id;
                                                                        let oTitle = odata.title;

                                                                        if (oRequired == 'Y') {
                                                                            oObj['name'] = oId;
                                                                            oObj['title'] = oTitle;
                                                                            oObj['type'] = oElementtype;
                                                                            oObj['value'] = replaceApostrophe($("#" + oId).val());
                                                                            paramArr.push(oObj);
                                                                        }
                                                                    })
                                                                });
                                                            }
                                                        }

                                                    }
                                                }
                                            })
                                        });

                                    }
                                }
                            }
                            break;

                        case 'checkbox':
                            if (formElement == 'Y') {
                                obj['name'] = id;
                                obj['title'] = title;
                                obj['type'] = elementtype;
                                obj['value'] = replaceApostrophe($("#" + id).val());
                                paramArr.push(obj);
                            }

                            let checkboxElements = document.getElementsByName(id);

                            for(let i = 0; i< checkboxElements.length; i++){
                                //
                                let els = checkboxElements[i];
                                //see if user make a check
                                if (els.checked) {
                                    let elsValue = $("#" + els.id).val();
                                    if (elsValue == 'other') {

                                        //get the logic element
                                        let logicEls = logicChildElements[elsValue];

                                        logicEls.forEach(ldata => {
                                            ldata.forEach(odata => {
                                                let oObj = {};
                                                let oRequired = odata.required;
                                                let oElementtype = odata.elementtype;
                                                let oId = odata.id;
                                                let otitle = odata.title;

                                                if (oRequired == 'Y') {
                                                    oObj['name'] = oId;
                                                    oObj['title'] = otitle;
                                                    oObj['type'] = oElementtype;
                                                    oObj['value'] = replaceApostrophe($("#" + oId).val());
                                                    paramArr.push(oObj);
                                                }
                                            })
                                        });
                                    }
                                }
                            }
                            break;
                    }
                });
            });
        });
        return paramArr;
    }



/*	===========================================================================================
    Survey validation
	===========================================================================================	*/

    //  Survey Submission 
    function surveySubmission(curIndex) {
        //
        let data = formcontent;

        //storage key
        let storageKey = `_fe_${curIndex}`;

        //get the section content
        let section = (data.sections)[curIndex];

        //get the content of form
        let content = section.section_content;

        //form element array
        let formElementArr = extractContentData(content);

        //store this into localstorage
        let storJson = JSON.stringify(formElementArr);
        storage.setItem(storageKey, storJson);

        //get the url of API
        let submitformAPi = page_configuration.submit_survey_url;

        //create first object
        let firstObj = {};
        firstObj['name'] = 'contact_id';
        firstObj['title'] = 'contact_id';
        firstObj['type'] = 'input';
        firstObj['value'] = sid;

        //insert the first object into array
        formElementArr.unshift(firstObj);

        //post promise
        let postPromise = postDataParam(submitformAPi, formElementArr);

        //when the promise is done
        postPromise.done(rep => {

            //clear the localStorage
            window.localStorage.clear();
        });

        //when the promise failed
        postPromise.fail(rej => {

            //clear the localStorage
            window.localStorage.clear();
        })
    }



/*	===========================================================================================
    Data validation
	===========================================================================================	*/

    //  Validates the form
    function elementValidation(curIndex) {

        //validation result
        let result = true;

        //element that require validation before submit
        let requiredArr = [];

        //validates the current index elements
        let data = formcontent;

        //get the section content
        let section = (data.sections)[curIndex];

        //get the content of form
        let content = section.section_content;

        //extract the content data
        content.forEach(cData => {

            //get the form content data
            let formContent = cData.form_content;

            //extract the form data
            formContent.forEach(fData => {

                //get the form element data
                fData.forEach(eData => {

                    let elementtype = eData.elementtype;
                    let required = eData.required;
                    let errorid = eData.errorid;
                    let id = eData.id;
                    let msg = eData.errormsg;
                    let childrenElements = eData.childElement;
                    let logicChildElements = eData.logicChild;
                    let value = $("#" + id).val();
                    let size = eData.size;
                    let maxlength = eData.maxlength;
                    let type = eData.itemtype;

                    //if this item is required to validate
                    switch (elementtype) {
                        case 'input':
                        case 'textarea':
                        case 'select':
                        case 'datepick':
                            requiredArr.push(returnItemObject(elementtype, type, id, errorid, msg, size, maxlength, required));
                            break;

                        case 'checkbox':
                            requiredArr.push(returnItemObject(elementtype, type, id, errorid, msg, size, maxlength, required));

                            let checkboxElements = document.getElementsByName(id);
                            for(let i = 0; i< checkboxElements.length; i++){

                                let els = checkboxElements[i];
                                if (els.checked) {

                                    let elsValue = $("#" + els.id).val();

                                    if (elsValue == 'other') {

                                        //get the logic element
                                        let logicEls = logicChildElements[elsValue];

                                        logicEls.forEach(ldata => {
                                            ldata.forEach(odata => {
                                                let oRequired = odata.required;
                                                let oElementtype = odata.elementtype;
                                                let oId = odata.id;
                                                let oErrorid = odata.errorid;
                                                let oErrormsg = odata.errormsg;
                                                let oSize = odata.size;
                                                let oMaxlength = odata.maxlength;
                                                let oType = odata.itemtype;

                                                requiredArr.push(returnItemObject(oElementtype, oType, oId, oErrorid, oErrormsg, oSize, oMaxlength, oRequired));
                                            })
                                        });
                                    }
                                }
                            }
                            break;

                        case 'selectchild':

                            if (value == '1') {

                                //if user selected 1 means yes
                                childrenElements.forEach(child => {
                                    child.forEach(ccdata => {
                                        let cId = ccdata.id;
                                        let cElementtype = ccdata.elementtype;
                                        let cRequired = ccdata.required;
                                        let cErrorid = ccdata.errorid;
                                        let cErrormsg = ccdata.errormsg;
                                        let cSize = ccdata.size;
                                        let cMaxlength = ccdata.maxlength;
                                        let cType = ccdata.itemtype;

                                        //if user has selected and its required to filled out
                                        requiredArr.push(returnItemObject(cElementtype, cType, cId, cErrorid, cErrormsg, cSize, cMaxlength, cRequired));
                                    })
                                });

                            } else {

                                //if user selected non or 2 means no
                                requiredArr.push(returnItemObject(elementtype, type, id, errorid, msg, size, maxlength, required));
                            }
                            break;

                        case 'selectlogic':

                            if (value != '' && value != '- Select -' && value != 'Select') {

                                //if user selected anything
                                let lcontent = logicChildElements[value];

                                //if it is not undefined
                                if (typeof lcontent != 'undefined') {

                                    lcontent.forEach(ldata => {
                                        ldata.forEach(odata => {

                                            let oRequired = odata.required;
                                            let oElementtype = odata.elementtype;
                                            let oId = odata.id;
                                            let oErrorid = odata.errorid;
                                            let oErrormsg = odata.errormsg;
                                            let oSize = odata.size;
                                            let oMaxlength = odata.maxlength;
                                            let oType = odata.itemtype;

                                            switch (oElementtype) {
                                                case 'input':
                                                case 'select':
                                                case 'textarea':
                                            
                                                    requiredArr.push(returnItemObject(oElementtype, oType, oId, oErrorid, oErrormsg, oSize, oMaxlength, oRequired));
                                                    
                                                    break;

                                                case 'checkbox':

                                                    requiredArr.push(returnItemObject(oElementtype, oType, oId, oErrorid, oErrormsg, oSize, oMaxlength, oRequired));
                                                    
                                                    //get the check box elements
                                                    let checkboxElements = document.getElementsByName(oId);

                                                    // //map through the check box elements
                                                    for(let i = 0; i< checkboxElements.length; i++){

                                                        //
                                                        let els = checkboxElements[i];
                                                        
                                                        //
                                                        if (els.checked) {

                                                            //get the checked value
                                                            let elsValue = $("#" + els.id).val();

                                                            //if the other checked
                                                            if (elsValue == 'other') {

                                                                //get the logic element
                                                                let logicEls = odata.logicChild[elsValue];

                                                                logicEls.forEach(ldata => {

                                                                    ldata.forEach(odata => {

                                                                        let oRequired = odata.required;
                                                                        let oElementtype = odata.elementtype;
                                                                        let oId = odata.id;
                                                                        let oErrorid = odata.errorid;
                                                                        let oErrormsg = odata.errormsg;
                                                                        let oSize = odata.size;
                                                                        let oMaxlength = odata.maxlength;
                                                                        let oType = odata.itemtype;

                                                                        requiredArr.push(returnItemObject(oElementtype, oType, oId, oErrorid, oErrormsg, oSize, oMaxlength, oRequired));
                                                                        
                                                                    })
                                                                });
                                                            }
                                                        }
                                                    }
                                                    break;
                                            }

                                        });
                                    });
                                
                                }

                            } else {

                                //if user hasn't select anything
                                requiredArr.push(returnItemObject(elementtype, type, id, errorid, msg, size, maxlength, required));

                            }
                            break;
                    }
                });
            });
        });

        //get all the validate elements
        let validateElement = requiredArr.reverse();

        //data validation
        result = dataValidation(validateElement);

        //
        return result;
    }

    //  Data validation
    function dataValidation(arr){

        //
        let length = arr.length;

        //set the result
        let result = true;

        //
        if(length != 0){
            
            //get the array
            arr.forEach(data => {

                //extract all the form element
                let type = data.type;
                let id = data.id;
                let eid = data.errorid;
                let error = data.errormsg;
                let element = $("#" + id);
                let errorid = $("#" + eid);
                let itemtype = data.itemtype;
                let maxlength = data.maxlength;
                let require = data.require;

                //
                switch (type) {

                    //
                    case 'input':

                        //if the item is required
                        if(require == 'Y'){

                            //verify starts here
                            element.blur(() => {

                                //check if is blank or not
                                if (element.val() == "") {

                                    //if it is blank
                                    addErrorBox(errorid, error);
                                    result = false;
                                }

                                //
                                inputVerifyFunction(element, errorid, itemtype, maxlength, require);
                                result = true;
                            });

                            //check if is blank or not
                            if (element.val() == "") {

                                //if it is blank
                                testifyFunction(element, errorid, error);
                                result = false;
                            }
                        }

                        break;

                    //
                    case 'textarea':
                    case 'datepick':

                        //if the item is required
                        if(require == 'Y'){

                            element.blur(() => {
                                verifyFunction(element, errorid);
                                result = true;
                            });

                            if (element.val() == "") {
                                testifyFunction(element, errorid, error);
                                result = false;
                            }
                        }

                        break;

                    //
                    case 'select':
                    case 'selectchild':
                    case 'selectlogic':

                        //if the item is required
                        if(require == 'Y'){
                            element.blur(() => {
                                selectVerifyFunction(element, errorid);
                                result = true;
                            });

                            if (element[0].selectedIndex == 0) {
                                testifyFunction(element, errorid, error);
                                result = false;
                            }
                        }
                        break;

                    //
                    case 'checkbox':

                        //if the item is required
                        if(require == 'Y'){
                            if (element.val() == "") {
                                testifyFunction(element, errorid, error);
                                result = false;
                            }
                        }
                        break;
                }
            });

        }else{

            result = true;
        }

        //
        return result;
    }

    //  Return the item object
    function returnItemObject(elementtype, type, id, errorid, msg, size, maxlength, required){

        //creat empty object
        let itemObj = {};

        //if user hasn't select anything
        itemObj['type'] = elementtype;
        itemObj['itemtype'] = type;
        itemObj['id'] = id;
        itemObj['errorid'] = errorid;
        itemObj['errormsg'] = msg;
        itemObj['size'] = size;
        itemObj['maxlength'] = maxlength;
        itemObj['require'] = required;

        //return the object
        return itemObj;
    }

    //  Form Input element validation
    function inputVerifyFunction(item, ermsg, type, maxlength, require) {

        //when its not empty
        if (item.val().trim() != "") {

            //get the response object
            let repObj = inputVerification(item, type, maxlength);

            //get the result
            let repRes = repObj.result;

            //if the resutlt is true
            if (repRes) {
                
                //
                ermsg.prev().removeClass('errorbox');
                ermsg.removeClass('errormsg');
                ermsg.html("");
                return true;

            }else{

                //
                return false;
            }

        }
    }

    //  Input verification
    function inputVerification(element, type, maxlength) {

        //get the length of the element
        let length = element.val().toString().length;

        //declear error message
        let error, result;

        //see if the length is exceeding maxlength or not
        if (length <= maxlength) {
            //not exceeded yet, then continue validation
            switch (type) {
                //if the item is text
                case 'text':
                    result = textValidation(element.val());
                    if (!result) {
                        error = 'Please enter text only';
                    }
                    break;
                
                case 'numTxt':
                    result = textAndNumber(element.val());
                    if(!result){
                        error = 'Format incorrect';
                    }
                    break;

                //if the item is address only
                case 'address':
                    result = addressValidation(element.val());
                    if (!result) {
                        error = 'Please enter address only, no special characters';
                    }
                    break;

                //if the item is address only
                case 'nospecial':
                    result = addressValidation(element.val());
                    if (!result) {
                        error = 'Please do not enter any special characters';
                    }
                    break;

                //if the item is number only
                case 'number':
                    result = numberValidation(element.val());
                    if (!result) {
                        error = 'Please enter number only';
                    }
                    break;

                //if the item is email
                case 'email':
                    result = emailAddressValidation(element.val());
                    if (!result) {
                        error = 'Please enter correct email format';
                    }
                    break;

                //if the item is phone
                case 'phone':
                    result = phoneNumberValidation(element.val());
                    if (!result) {
                        error = 'Please enter phone number only';
                    }
                    break;
            }
        } else {
            //exceeded the maxlength
            //create the error message
            error = 'The value you entered exceeded the length requirement';
            result = false;
        }

        let obj = {};
        obj['result'] = result;
        obj['error'] = error;

        //return the object
        return obj;
    }

    //  Address valiation
    function addressValidation(value) {
        let reg = /^[a-zA-Z0-9\s,'-.#]*$/;
        return reg.test(value);
    }

    //  The text val
    function textValidation(value) {
        let reg = /^[\u00C0-\u017Fa-zA-Z'’‘’][\u00C0-\u017Fa-zA-Z’‘’' -]+[\u00C0-\u017Fa-zA-Z'’‘’]?$/;
        return reg.test(value);
    }

    //  The text and number only validation
    function textAndNumber(value){
        let reg = /^[a-zA-Z0-9\s,'-.#]*$/;
        return reg.test(value);
    }

    //  The number only validation
    function numberValidation(value) {
        let reg = /^\d+$/;
        return reg.test(value);
    }

    //  Phone number validation
    function phoneNumberValidation(value) {
        let reg = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
        return reg.test(value);
    }

    //  Email address validation
    function emailAddressValidation(value) {
        let reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return reg.test(value);
    }

    //  Replace apostrophe
    function replaceApostrophe(str){
        let newstr = str.replace(/'/g, '&apos;');
        return newstr;
    }



/*	===========================================================================================
    Form render
	===========================================================================================	*/

    //  Render the form content
    function renderFormContent(sect, si) {

        //Section content
        let section_cont = sect.section_content;

        //Create a section holder
        let section_holder_id = `section_${si}`;
        let section_holder = `<div id="${section_holder_id}" style="display:none;" data-stage="${si}"></div>`;
        $("#" + content_holder).append(section_holder);

        //Extract the content data
        section_cont.forEach((tData, ti) => {

            //create the section
            let section_remark = tData.form_section_remark;
            let section_title = tData.form_section_title;
            let conid = `section_${generateId()}`;
            let section = acluSectionTemplate(themecolor, textcolor, section_title, section_remark, conid);
            $("#" + section_holder_id).append(section);

            //render everything to the holder
            let formContent = tData.form_content;
            formContent.forEach((fData, fi) => {

                //create rows for items
                let column_id = `col_${generateId()}`;
                let column = acluColumnTemplate(column_id);
                $("#" + conid).append(column);

                fData.forEach((iData, ii) => {

                    let elementtype = iData.elementtype;
                    let errorid = iData.errorid;
                    let id = iData.id;
                    let maxlength = iData.maxlength;
                    let placeholder = '';
                    let required = iData.required;
                    let size = iData.size;
                    let title = iData.title;
                    let type = iData.type;
                    let cols = iData.cols;
                    let rows = iData.rows;
                    let options = iData.options;
                    let itemtype = iData.itemtype;
                    let isDynamic = iData.isDynamic;

                    //logic child
                    let childholder = `child_${generateId()}`;
                    let childCallback = `childOnChange('${id}','${childholder}', '${column_id}')`;
                    let childrenElements = iData.childElement;

                    //check box
                    let othercheckconid = `otherconid_${generateId()}`;
                    let elementid = `checkbox_${generateId()}`;

                    let element = '';
                    switch (elementtype) {
                        //checkbox
                        case 'checkbox':
                            switch (required) {
                                case 'Y':
                                    element = acluCheckboxTemplateRequired(elementid, id, title, childholder, othercheckconid, errorid);
                                    break;
                                case 'N':
                                    element = acluCheckboxTemplateOptional(elementid, id, title, childholder, othercheckconid);
                                    break;
                            }
                            $("#" + column_id).append(element);
                            break;

                        //input
                        case 'input':
                            switch (required) {
                                case 'Y':
                                    element = acluInputTemplateRequired(id, title, type, placeholder, size, maxlength, errorid);
                                    break;
                                case 'N':
                                    element = acluInputTemplateOptional(id, title, type, placeholder, size, maxlength, errorid);
                                    break;
                            }
                            $("#" + column_id).append(element);
                            break;

                        //textarea
                        case 'textarea':
                            //textarea callback
                            let textareacallback = `textareaHandling(${id}, ${maxlength})`;

                            placeholder = iData.placeholder;
                            switch (required) {
                                case 'Y':
                                    element = acluTextareaTemplateRequired(id, title, placeholder, cols, rows, maxlength, errorid, textareacallback);
                                    break;
                                case 'N':
                                    element = acluTextareaTemplateOptional(id, title, placeholder, cols, rows, maxlength, textareacallback);
                                    break;
                            }
                            $("#" + column_id).append(element);
                            break;

                        //select
                        case 'select':
                            placeholder = iData.placeholder;
                            switch (required) {
                                case 'Y':
                                    element = acluSelectTemplateRequired(id, title, placeholder, errorid);
                                    break;
                                case 'N':
                                    element = acluSelectTemplateOptional(id, title, placeholder);
                                    break;
                            }
                            $("#" + column_id).append(element);
                            break;

                        //select child
                        case 'selectchild':
                            placeholder = iData.placeholder;
                            switch (required) {
                                case 'Y':
                                    element = acluSelectChildTemplateRequired(id, title, placeholder, errorid, childholder, childCallback);
                                    break;
                                case 'N':
                                    element = acluSelectChildTemplateOptional(id, title, placeholder, childholder, childCallback)
                                    break;
                            }
                            $("#" + column_id).append(element);
                            break;

                        //select logic
                        case 'selectlogic':
                            placeholder = iData.placeholder;

                            //logic call back
                            let logiccallback = `logicCallback('${id}','${si}','${ti}','${fi}','${ii}','${childholder}', '${column_id}')`;

                            switch (required) {
                                case 'Y':
                                    element = acluSelectChildTemplateRequired(id, title, placeholder, errorid, childholder, logiccallback);
                                    break;
                                case 'N':
                                    element = acluSelectChildTemplateOptional(id, title, placeholder, childholder, logiccallback);
                                    break;
                            }
                            $("#" + column_id).append(element);
                            break;

                        //datepic
                        case 'datepick':
                            placeholder = iData.placeholder;
                            switch (required) {
                                case 'Y':
                                    element = acluDatepickerTemplateRequire(id, title, placeholder, errorid);
                                    break;
                                case 'N':
                                    element = acluDatepickerTemplateOptional(id, title, placeholder);
                                    break;
                            }
                            $("#" + column_id).append(element);
                            break;

                        //remark
                        case 'remark':
                            $("#" + column_id).append(acluRemarkTemplate(iData.remark_desc));
                            break;

                        //submit
                        case 'button':
                            let buttontext = iData.button_text;
                            let eventtype = iData.eventtype;
                            let buttonCallback;
                            let btnid = (id != null) ? id : '';
                            if (eventtype != 'leave') {
                                buttonCallback = `callbackbutton('${eventtype}','${si}','${parseInt(si) + 1}', '${btnid}')`;
                            } else {
                                let redirectUrl = iData.url;
                                buttonCallback = `reDirectMe(&quot;${redirectUrl}&quot;)`;
                            }
                            element = acluButton(buttonCallback, btnid, themecolor, '#fff', buttontext);
                            $("#" + column_id).append(element);
                            break;
                    }

                    //render the options or dates inside of it
                    switch (elementtype) {

                        //input handling
                        case 'input':
                            //implement input element handling
                            inputElementHandling(id, errorid, itemtype, size, maxlength, required);
                            break;

                        //checkbox type
                        case 'checkbox':
                            options.forEach(rows => {
                                let rowsid = `checkrows_${generateId()}`;
                                let rowsContainer = `<div class="columns" id="${rowsid}"></div>`;
                                $("#" + childholder).append(rowsContainer);

                                rows.forEach(op => {
                                    let value = op.value;
                                    let text = op.text;
                                    let checkboxCallback = `checkBoxCallback('${elementid}','${id}', '${value}', '${othercheckconid}','${si}','${ti}','${fi}','${ii}', '${errorid}')`;
                                    let checkelement = acluCheckboxElement(id, value, text, checkboxCallback);
                                    $("#" + rowsid).append(checkelement);
                                })
                            });
                            break;

                        //Select type
                        case 'select':
                            if(isDynamic != '' && typeof isDynamic != 'undefined'){
                                appendDynamicData(isDynamic ,id);
                            }else{
                                options.forEach(op => {
                                    let option = `<option value="${op.value}">${op.text}</option>`;
                                    $("#" + id).append(option);
                                });
                            }
                            break;

                        //Datepick type
                        case 'datepick':
                            $('[data-toggle="datepicker"]').datepicker({
                                autoHide: true,
                                pick: function (e) {
                                    $("#" + errorid).prev().removeClass('errorbox');
                                    $("#" + errorid).empty();
                                    $("#" + errorid).removeClass('errormsg');
                                }
                            });
                            break;

                        //Select child type
                        case 'selectchild':
                            options.forEach(op => {
                                let option = `<option value="${op.value}">${op.text}</option>`;
                                $("#" + id).append(option);
                            });

                            //get the children element
                            childrenElements.forEach(child => {

                                //get the child container
                                let childColId = `child_col_${generateId()}`;
                                let childCol = acluColumnTemplate(childColId);
                                $("#" + childholder).append(childCol);

                                //extract child element
                                child.forEach(cData => {

                                    //get the child data 
                                    let celementtype = cData.elementtype;
                                    let cerrorid = cData.errorid;
                                    let cid = cData.id;
                                    let cmaxlength = cData.maxlength;
                                    let cplaceholder = '';
                                    let crequired = cData.required;
                                    let csize = cData.size;
                                    let ctitle = cData.title;
                                    let ctype = cData.type;
                                    let ccols = cData.cols;
                                    let crows = cData.rows;
                                    let coptions = cData.options;
                                    let citemtype = cData.itemtype;
                                    let cisDynamic = cData.isDynamic;

                                    //render the children element
                                    let celement = '';
                                    switch (celementtype) {
                                        case 'input':
                                            switch (crequired) {
                                                case 'Y':
                                                    celement = acluInputTemplateRequired(cid, ctitle, ctype, cplaceholder, csize, cmaxlength, cerrorid);
                                                    break;
                                                case 'N':
                                                    celement = acluInputTemplateOptional(cid, ctitle, ctype, cplaceholder, csize, cmaxlength, cerrorid);
                                                    break;
                                            }
                                            break;

                                        case 'select':
                                            cplaceholder = cData.placeholder;
                                            switch (crequired) {
                                                case 'Y':
                                                    celement = acluSelectTemplateRequired(cid, ctitle, cplaceholder, cerrorid);
                                                    break;
                                                case 'N':
                                                    celement = acluSelectTemplateOptional(cid, ctitle, cplaceholder);
                                                    break;
                                            }
                                            break;

                                        case 'textarea':
                                            //textarea callback
                                            let textareacallback = `textareaHandling(${cid}, ${cmaxlength})`;

                                            cplaceholder = cData.placeholder;
                                            switch (crequired) {
                                                case 'Y':
                                                    celement = acluTextareaTemplateRequired(cid, ctitle, cplaceholder, ccols, crows, cmaxlength, cerrorid, textareacallback);
                                                    break;
                                                case 'N':
                                                    celement = acluTextareaTemplateOptional(cid, ctitle, cplaceholder, ccols, crows, cmaxlength, textareacallback);
                                                    break;
                                            }
                                            break;

                                        case 'datepick':
                                            cplaceholder = cData.placeholder;
                                            switch (crequired) {
                                                case 'Y':
                                                    celement = acluDatepickerTemplateRequire(cid, ctitle, cplaceholder, cerrorid);
                                                    break;
                                                case 'N':
                                                    celement = acluDatepickerTemplateOptional(cid, ctitle, cplaceholder);
                                                    break;
                                            }
                                            break;

                                    }
                                    $("#" + childColId).append(celement);

                                    //Children element
                                    switch (celementtype) {

                                        //implement input element handling
                                        case 'input':
                                            inputElementHandling(cid, cerrorid, citemtype, csize, cmaxlength, crequired);
                                            break;

                                        //  Dynamic data
                                        case 'select':
                                            if(cisDynamic != '' && typeof cisDynamic != 'undefined'){
                                                appendDynamicData(cisDynamic, cid);
                                            }else{
                                                coptions.forEach(cop => {
                                                    let coption = `<option value="${cop.value}">${cop.text}</option>`;
                                                    $("#" + cid).append(coption);
                                                });
                                            }
                                            break;

                                        //  Datepick
                                        case 'datepick':
                                            $('[data-toggle="datepicker"]').datepicker({
                                                autoHide: true,
                                                pick: function (e) {
                                                    $("#" + cerrorid).prev().removeClass('errorbox');
                                                    $("#" + cerrorid).empty();
                                                    $("#" + cerrorid).removeClass('errormsg');
                                                }
                                            });
                                            break;
                                    }

                                })
                            })
                            break;

                        case 'selectlogic':
                            options.forEach(op => {
                                let option = `<option value="${op.value}">${op.text}</option>`;
                                $("#" + id).append(option);
                            });
                            break;
                    }
                })
            });
        });
    }

    //  Child on change
    function childOnChange(id, conid, column_id) {
        let value = $("#" + id).val();
     
        if(value != ''){
            switch (value) {
                case '1':
                    $("#" + conid).show();
                    $("#" + conid).addClass('mar15around');
                    $("#" + column_id).addClass('flexToBlock');
                    break;
                case '0':
                    $("#" + conid).hide();
                    $("#" + conid).removeClass('mar15around');
                    $("#" + column_id).removeClass('flexToBlock');
                    break;
            }
        }else{
            $("#" + conid).hide();
            $("#" + conid).removeClass('mar15around');
            $("#" + column_id).removeClass('flexToBlock');
        }
    }

    //  Render dynamic data
    function appendDynamicData(cmd, conid){
        let url = `${hostUrl}/api/getData.php`;
        getPromiseDataParamSync(url, cmd,'').done(resp=>{
            if(resp.success){
                let dataset = resp.data;
                dataset.forEach(data=>{
                    $("#"+conid).append(`<option value="${data.value}">${data.text}</option>`);
                });
            }
        })
    }



/*	===========================================================================================
    Input element handling
	===========================================================================================	*/

    //  Input Element Handling
    function inputElementHandling(id, errorid, itemtype, size, maxlength, required) {

        //get the element and error box that associated with it
        let inputElement = $("#" + id);
        let inputMsgCon = $("#" + errorid);

        //if the input get blur
        inputElement.blur(() => {

            //check if the value is not empty
            if (inputElement.val() != '') {

                //get the response object
                let responesObj = inputVerification(inputElement, itemtype, maxlength);

                //get the response result
                let responseResult = responesObj.result;

                //if the result is not true
                if (!responseResult) {

                    //get the error message
                    let errorMessage = responesObj.error;

                    //add error box
                    addErrorBox(inputMsgCon, errorMessage);

                } else {
                    //error box removal
                    errorBoxRemoval(inputMsgCon)
                }

            }else {
                
                //error box removal
                errorBoxRemoval(inputMsgCon)
            }

        })
    }



/*	===========================================================================================
    Textarea validation
	===========================================================================================	*/

    //  textarea handling
    function textareaHandling(element, maxlength) {
        //Get the remaining con id
        let remaingCon = `${element.id}_remaing`;

        //Get the value of the textarea
        let value = $("#" + element.id).val();

        //Get the word count
        let wordRes = wordCount(value);

        //Get the remaining character
        let remainChar = Number(maxlength) - wordRes.characters;

        //render it to the counter
        $("#" + remaingCon).html(remainChar);
    }

    //  Word Count function
    function wordCount(val) {
        let reg = /\s+/g;
        let wom = val.match(reg);
        return {
            charactersNoSpaces: val.replace(reg, '').length,
            characters: val.length,
            words: wom ? wom.length : 0,
            lines: val.split(/\r*\n/).length
        };
    }



/*	===========================================================================================
    Logic child element
	===========================================================================================	*/

    //  Get logic child element
    function getLogicChildElement(si, ti, fi, ii) {
        let data = formcontent;
        let sections = data.sections;
        let elements = sections[si].section_content[ti].form_content[fi][ii];
        return elements;
    }



/*	===========================================================================================
    Popstate handling
	===========================================================================================	*/

    //  Listen to the postate event
    window.addEventListener('popstate', function (e) {
        window.scrollTo(0, 0);

        //get the state value
        let character = e.state;

        //if state value is null or undefined the index is 0 else index is state value
        let index = (character == null || typeof character == 'undefined') ? 0 : character;

        //clear the content
        $("#" + content_holder).empty();

        //deploy the page content by index number
        deployPageContent(index);

        //restore the form content
        contentResurrection(index)
    });

    //  Monitor mouse click event 
    $(window).click(e => {
        let lang_option_status = $("#language_option_holder").css('display');
        if (lang_option_status == 'block') {
            $("#language_option_holder").hide();
        }
    });




/*	===========================================================================================
    Public tool
	===========================================================================================	*/

    //  Resurrect the form content
    function contentResurrection(index) {
        //creeate storage key
        let storageKey = `_fe_${index}`;

        //get the storage item
        let storageItem = storage.getItem(storageKey);

        //see if there is storage that match to this
        if (typeof storageItem != 'undefined' && storageItem != null && storageItem != '') {
            let itemObj = JSON.parse(storageItem);

            if (itemObj.length != 0) {
                itemObj.forEach(data => {
                    let id = data.name;
                    let value = data.value;
                    let type = data.type;
                    switch (type) {
                        case 'input':
                        case 'textarea':
                        case 'datepick':
                        case 'select':
                            //strip the content
                            let strippedStr = stripMe(value);
                            $("#" + id).val(strippedStr);
                            break;
                    }
                })
            }
        }
    }

    //  Strip the tags and return pure string
    function stripMe(value) {
        let str = value.toString();
        return str.replace(/<\/?[^>]+>/gi, '');
    }

    //  Redirect user to this url
    function reDirectMe(url) {
        window.location.href = url;
    }

    //  Error box removal
    function errorBoxRemoval(element) {
        element.prev().removeClass('errorbox');
        element.empty();
        element.removeClass('errormsg');
    }

    //  Add Error box
    function addErrorBox(errorElement, message) {
        errorElement.html(message);
        errorElement.addClass('errormsg');
        errorElement.prev().addClass('errorbox');
    }

    //  Get checked by name
    function getCheckedByName(name){
        var chks = document.getElementsByName(name);
        var results = [];
        for(var i = 0; i < chks.length; i++){
            chks[i].checked ? results.push(chks[i]):"";
        }
        return results;
    }