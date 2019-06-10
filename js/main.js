$(document).ready(function() {
    var addColumnButton = $("#add-col");
    var deleteColumnButton = $("#delete-col");
    var addColumnModal = $("#add-col-modal");
    var selectAllMasterRows = $('#column-master thead tr>th#select-all>input');
    var createError = $('#column-master-container > #create-error.invalid-feedback');
    var deleteError = $('#column-master-container > #delete-error.invalid-feedback');
    var noColNameError = $('#add-col-modal #no-col-name-err.invalid-feedback');

    addColumnButton.on("click", function () {        
        noColNameError.hide();
        addColumnModal.modal('show');
    });

    deleteColumnButton.on("click", (event) => {
        if($('#column-master tbody tr>td>input:checked').length > 0){
            deleteError.hide();
            createError.hide();
            $('#column-master tbody tr>td>input:checked').each(function(index, obj) {
                $(this).parents('tr').remove();
            });
        }else {
            createError.hide();
            deleteError.show();
        }
        $('#column-master thead tr>th#select-all>input')[0].checked = false;
        
    });

    selectAllMasterRows.on('click', (event) =>{
        if(event.currentTarget.checked){
            $('#column-master tbody tr>td>input').each(function () {
                this.checked = true;
            });
        }else {
            $('#column-master tbody tr>td>input').each(function () {
                this.checked = false;
            });
        }
        
    });

    function clearModalData() {
        addColumnModal.find("#colNameTxt").val('');
        addColumnModal.find("#colTypeSelect").prop('selectedIndex',0);
        addColumnModal.find("#editableSelect").prop('selectedIndex',0);
    };

    addColumnModal.on('hide.bs.modal', function () {
        clearModalData();
    });

    //Save column details event from the modal popup
    addColumnModal.find('#saveColumnDetailsBtn').on('click', function () {
        if($('#colNameTxt').val() === '') {
            noColNameError.show();
        }else {
            clearAllErrors();
            var columnDetails = {
                colName: $('#colNameTxt').val(),
                type: $('#colTypeSelect option:selected').text(),
                editable: $('#editableSelect option:selected').text()
            };

            addNewColumn(columnDetails);
            addColumnModal.modal('hide');
        }
    });

    function addNewColumn(columnDetails) {
        var select = "<td><input type='checkbox'></td>";
        var row = '<tr>' + select;
        
        $.each(columnDetails, function(key, value) {
            var td = `<td data-col='${key}'>${value}</td>`;
            row += td;                        
        });
        row += "</tr>";
        $("#column-master tbody").append(row);

    };
    
    //Create the result grid on button click
    $("#create-result").on('click', function() {
        if($('#column-master tbody>tr').length > 0){
            clearAllErrors();
            $('#result-datagrid-container').show();
            createResultGrid();
        }else{
            createError.show();
            deleteError.hide();
            clearResultGrid();
        }
    });

    function createResultGrid() {
        var header = createResultHeader();
        clearResultGrid();
        $('#result-datagrid thead').append(header);
        $('#result-datagrid thead tr>th#select-all>input').on('click', selectAllResultRowsEvent);
    };

    function createResultHeader() {
        var headerRow = "<tr><th id='select-all' data-type='Boolean' data-editable='true'><input type='checkbox'></th>";
        $('#column-master tbody>tr').each(function(index, obj) {
            var colHeader = $(obj).find('[data-col="colName"]')[0].innerText;
            var colType = $(obj).find('[data-col="type"]')[0].innerText;
            var isEditable = $(obj).find('[data-col="editable"]')[0].innerText === 'Yes'? true: false;
            var thead = `<th data-type='${colType}' data-editable='${isEditable}'>${colHeader}</th>`;
            headerRow += thead;
        });
        headerRow += '</tr>';
        return headerRow;
    };

    function createResultDataRow(header) {
        var newResultRow = "<tr>";
        $('#result-datagrid thead tr>th').each(function(index, obj) {
            var type = $(obj).data('type');
            var isEditable = $(obj).data('editable');
            newResultRow += createInputType(type, isEditable);
        });
        return newResultRow;
    };

    function createInputType(type, isEditable) {
        var disabled = isEditable ? '' : 'disabled';
        var inputType = 'String';

        if(type === 'Number') {
            inputType = 'number';
        }else if(type === 'Date') {
            inputType = 'date';
        }else if(type === 'Boolean'){            
           inputType = 'checkbox';
        }

        return `<td><input type="${inputType}" ${disabled}></input></td>`;
    };

    $('#add-row').on('click', function() {
        var dataRow = createResultDataRow();
        $("#result-datagrid tbody").append(dataRow);
    });

    var selectAllResultRowsEvent =  (event) => {
        if(event.currentTarget.checked){
            $('#result-datagrid tbody tr>td>input').each(function () {
                this.checked = true;
            });
        }else {
            $('#result-datagrid tbody tr>td>input').each(function () {
                this.checked = false;
            });
        }
    }; 

    function clearResultGrid() {
        $('#result-datagrid thead tr').remove();
        $('#result-datagrid tbody tr').remove();
    };

    function clearAllErrors(params) {
        noColNameError.hide();
        createError.hide();
        deleteError.hide();
    };

  });