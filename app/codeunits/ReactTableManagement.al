codeunit 50261 ReactTableManagement
{
    procedure runUpdatesFromReact(tableNumber: Integer; JsonArrayString: Text)
    var
        RecRef: RecordRef;
        jsonArray: JsonArray;
        jsonToken: JsonToken;
        headerObject: JsonObject;
        primaryKeyFields: JsonArray;
        i: Integer;
    begin
        if not jsonArray.ReadFrom(JsonArrayString) then begin
            Error('Failed to parse JSON from React');
        end;
        if jsonArray.Count() = 0 then begin
            Error('No records to update');
        end;

        // Get header (metadata) from first object
        jsonArray.Get(0, jsonToken);
        headerObject := jsonToken.AsObject();

        // Extract primaryKeyFields from header
        if not headerObject.Get('primaryKeyFields', jsonToken) then begin
            Error('primaryKeyFields not found in header');
        end;
        primaryKeyFields := jsonToken.AsArray();

        RecRef.Open(tableNumber);

        // Process data records (starting at index 1)
        for i := 1 to jsonArray.Count() - 1 do begin
            jsonArray.Get(i, jsonToken);
            UpdateOrInsertRecord(RecRef, jsonToken.AsObject(), primaryKeyFields);
        end;

        RecRef.Close();
        Message('Records updated successfully');
    end;

    local procedure UpdateOrInsertRecord(var RecRef: RecordRef; jsonObject: JsonObject; primaryKeyFields: JsonArray)
    var
        jsonToken: JsonToken;
        valueToken: JsonValue;
        fieldRef: FieldRef;
        cleanedFieldName: Text;
        originalFieldName: Text;
        primaryKeyValue: Text;
    begin
        // Get first primary key field name from the passed array
        primaryKeyFields.Get(0, jsonToken);
        cleanedFieldName := jsonToken.AsValue().AsText();

        // Find the original BC field name
        originalFieldName := FindOriginalFieldName(RecRef, cleanedFieldName);
        if originalFieldName = '' then
            Error('Could not find original field name for: ' + cleanedFieldName);

        // Get the value using the cleaned field name from JSON
        if not jsonObject.Get(cleanedFieldName, jsonToken) then
            Error('Primary key field ' + cleanedFieldName + ' not found in data');

        valueToken := jsonToken.AsValue();
        primaryKeyValue := valueToken.AsText();

        // Find the field by original name and set the range
        fieldRef := RecRef.Field(RecRef.FieldIndex(1).Number());
        fieldRef.SetRange(primaryKeyValue);

        if RecRef.FindFirst() then begin
            // Update existing record
            UpdateRecordFromJson(RecRef, jsonObject);
            if not RecRef.Modify(true) then
                Error('Failed to modify record');
        end else begin
            // Insert new record
            RecRef.Init();
            fieldRef.Value := primaryKeyValue;
            UpdateRecordFromJson(RecRef, jsonObject);
            if not RecRef.Insert(true) then
                Error('Failed to insert record');
        end;
    end;

    local procedure UpdateRecordFromJson(var RecRef: RecordRef; jsonObject: JsonObject)
    var
        i: Integer;
        fieldRef: FieldRef;
        jsonToken: JsonToken;
        cleanedFieldName: Text;
        originalFieldName: Text;
    begin
        // Iterate through all fields in the record
        for i := 1 to RecRef.FieldCount do begin
            fieldRef := RecRef.FieldIndex(i);

            // Skip system fields
            if fieldRef.Class() <> FieldClass::Normal then
                continue;

            // Create cleaned version of the BC field name to match React's naming
            cleanedFieldName := DelChr(fieldRef.Name(), '=', ' /.-*+');

            // Try to get the value from JSON using the cleaned name
            if jsonObject.Get(cleanedFieldName, jsonToken) then begin
                if not jsonToken.AsValue().IsNull() then begin
                    SetFieldValue(fieldRef, jsonToken.AsValue());
                end;
            end;
        end;
    end;

    local procedure FindOriginalFieldName(RecRef: RecordRef; CleanedName: Text): Text
    var
        i: Integer;
        fieldRef: FieldRef;
        cleanedFieldName: Text;
    begin
        for i := 1 to RecRef.FieldCount do begin
            fieldRef := RecRef.FieldIndex(i);
            cleanedFieldName := DelChr(fieldRef.Name(), '=', ' /.-*+');
            if cleanedFieldName = CleanedName then
                exit(fieldRef.Name());
        end;
        exit('');
    end;

    local procedure UpdateRecordFields(var RecRef: RecordRef; jsonObject: JsonObject)
    var
        fieldRef: FieldRef;
        fieldsArray: JsonArray;
        fieldToken: JsonToken;
        fieldObjToken: JsonToken;
        valueToken: JsonToken;
        nameToken: JsonToken;
        fieldName: Text;
        i: Integer;
    begin
        if not jsonObject.Get('fields', fieldToken) then
            exit;

        fieldsArray := fieldToken.AsArray();

        foreach fieldObjToken in fieldsArray do begin
            if fieldObjToken.AsObject().Get('name', nameToken) then begin
                fieldName := nameToken.AsValue().AsText();

                // Try to find field by name by iterating through fields
                for i := 1 to RecRef.FieldCount do begin
                    fieldRef := RecRef.FieldIndex(i);
                    if fieldRef.Name = fieldName then begin
                        if fieldObjToken.AsObject().Get('value', valueToken) then begin
                            if not valueToken.AsValue().IsNull() then
                                SetFieldValue(fieldRef, valueToken.AsValue());
                        end;
                        break;
                    end;
                end;
            end;
        end;

        if not RecRef.Modify(true) then
            Error('Failed to modify record %1', RecRef.RecordId);
    end;

    local procedure SetRecordFields(var RecRef: RecordRef; jsonObject: JsonObject)
    var
        fieldRef: FieldRef;
        fieldCount: Integer;
        i: Integer;
        fieldName: Text;
        fieldsArray: JsonArray;
        fieldToken: JsonToken;
        fieldObjToken: JsonToken;
        valueToken: JsonToken;
        j: Integer;
    begin
        // Get fields array from JSON
        if not jsonObject.Contains('fields') then begin
            exit;
        end;

        jsonObject.Get('fields', fieldToken);
        fieldsArray := fieldToken.AsArray();

        // Loop through fields array and set record
        for j := 0 to fieldsArray.Count() - 1 do begin
            fieldsArray.Get(j, fieldObjToken);
            fieldObjToken.AsObject().Get('name', fieldToken);
            fieldName := fieldToken.AsValue().AsText();

            // Find matching field in record and set
            fieldCount := RecRef.FieldCount();
            for i := 1 to fieldCount do begin
                fieldRef := RecRef.FieldIndex(i);
                if fieldRef.Name = fieldName then begin
                    fieldObjToken.AsObject().Get('value', valueToken);
                    if not valueToken.AsValue().IsNull() then begin
                        SetFieldValue(fieldRef, valueToken.AsValue());
                    end;
                end;
            end;
        end;
    end;

    local procedure SetFieldValue(var fieldRef: FieldRef; jsonValue: JsonValue)
    var
        optionValue: Integer;
        success: Boolean;
    begin
        case fieldRef.Type() of
            FieldType::Integer:
                fieldRef.Value := jsonValue.AsInteger();
            FieldType::BigInteger:
                fieldRef.Value := jsonValue.AsBigInteger();
            FieldType::Decimal:
                fieldRef.Value := jsonValue.AsDecimal();
            FieldType::Boolean:
                fieldRef.Value := jsonValue.AsBoolean();
            FieldType::Code:
                fieldRef.Value := jsonValue.AsCode();
            FieldType::Date:
                begin
                end;
            //     fieldRef.Value := jsonValue.AsDate();
            FieldType::DateTime:
                begin
                end;
            //     fieldRef.Value := jsonValue.AsDateTime();
            FieldType::Option:
                begin
                    // Message(format(fieldRef.Value));
                    if Evaluate(optionValue, jsonValue.AsText()) then
                        fieldRef.Value := optionValue
                end;
            else
                fieldRef.Value := jsonValue.AsText();
        end;
    end;

    local procedure GetJsonFieldValue(jsonObject: JsonObject; fieldName: Text): Text
    var
        jsonToken: JsonToken;
    begin
        if jsonObject.Get(fieldName, jsonToken) then begin
            if not jsonToken.AsValue().IsNull() then begin
                exit(Format(jsonToken.AsValue()));
            end;
        end;
        exit('');
    end;

    local procedure GetTableNumberFromName(tableName: Text): Integer
    begin
        // Map table names to numbers - extend as needed
        case tableName of
            'PurisUsers':
                exit(50260);
            'Item':
                exit(27);
            else
                Error('Unknown table: ' + tableName);
        end;
    end;
}