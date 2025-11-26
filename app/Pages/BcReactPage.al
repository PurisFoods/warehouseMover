page 50260 "WarehouseMover"
{
    PageType = Card;
    ApplicationArea = All;
    UsageCategory = ReportsAndAnalysis;

    layout
    {
        area(Content)
        {
            usercontrol("WarehouseMover"; warehouseMoverControlAddIn)
            {
                trigger ReceiveDataFromReact(JsonArrayString: Text)
                begin
                    Message('Receive Data from React - %1', JsonArrayString);
                    // ReactTableManagement.runUpdatesFromReact(JsonArrayString);
                end;

                trigger UpdateRow(tableNumber: Integer; rowData: Text)
                begin
                    Message('Table number %1 - rowData %2', tableNumber, rowData);
                    ReactTableManagement.runUpdatesFromReact(tableNumber, rowData);
                end;

                trigger GetTable(tableNumber: Integer; maxRecords: Integer; filterField: Integer; filterText: Text)
                var
                    RecRef: RecordRef;
                    filterRef: FieldRef;
                    filterString: Text;
                    jsonHelper: Codeunit JsonHelper;
                    json: Codeunit Json;
                    rec: Variant;
                    data: Text;
                    jsonArray: JsonArray;
                    recordCounter: Integer;
                begin
                    RecRef.Open(tableNumber);
                    recordCounter := 0;
                    // Only apply filter if both filterField and filterText are provided
                    if (filterField > 0) and (filterText <> '') then begin
                        filterRef := RecRef.Field(filterField);
                        filterString := StrSubstNo('WHERE(%1=1(%2))', filterRef.Name, filterText);
                        RecRef.SetView(filterString);
                    end;
                    if RecRef.FindSet() then begin
                        jsonArray.Add(jsonHelper.RecordsToJsonArrayWithHeader(RecRef, maxRecords));
                    end;
                    jsonArray.WriteTo(data);
                    CurrPage.WarehouseMover.SendDataToReact(data);
                end;


            }
        }

    }

    actions
    {
        area(Navigation)
        {
            action(SendDataToReact)
            {
                ApplicationArea = All;

                trigger OnAction();
                var
                    purisUsers: Record PurisUsers;
                    tableSelection: RecordRef;
                    RecRef: RecordRef;
                    jsonArray: JsonArray;
                    data: Text;
                    jsonHelper: Codeunit JsonHelper;
                begin
                    tableSelection.Open(Database::PurisUsers);
                    RecRef.Open(Database::PurisUsers);
                    jsonArray.Add(jsonHelper.RecordsToJsonArrayWithHeader(RecRef, 0));
                    jsonArray.WriteTo(data);
                    CurrPage.WarehouseMover.SendDataToReact(data);
                end;
            }
            action(DeleteRecords)
            {
                ApplicationArea = All;

                trigger OnAction()
                var
                    RecRef: RecordRef;
                begin
                    RecRef.Open(Database::PurisUsers);
                    if RecRef.FindSet() then begin
                        RecRef.DeleteAll();
                    end;
                end;
            }
        }
    }
    var
        ReactTableManagement: Codeunit ReactTableManagement;

    // local procedure ProcessJsonObject(JsonObject: JsonObject): Text
    // var
    //     Keys: List of [Text];
    //     JsonToken: JsonToken;
    //     i: Integer;
    //     ObjectText: Text;
    // begin
    //     Keys := JsonObject.Keys();
    //     ObjectText := '';

    //     for i := 1 to Keys.Count() do begin
    //         JsonObject.Get(Keys.Get(i), JsonToken);
    //         ObjectText += Keys.Get(i) + ': ' + JsonToken.AsValue().AsText();
    //         if i < Keys.Count() then
    //             ObjectText += ', ';
    //     end;

    //     exit(ObjectText);
    // end;
}