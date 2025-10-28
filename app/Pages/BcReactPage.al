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
                var
                    JsonArray: JsonArray;
                    JsonToken: JsonToken;
                    i: Integer;
                    OutputText: Text;
                begin
                    if not JsonArray.ReadFrom(JsonArrayString) then
                        exit;

                    OutputText := '';
                    for i := 0 to JsonArray.Count() - 1 do begin
                        JsonArray.Get(i, JsonToken);
                        OutputText += ProcessJsonObject(JsonToken.AsObject());
                        if i < JsonArray.Count() - 1 then
                            OutputText += ' | ';
                    end;

                    Message(OutputText);
                end;

                trigger AddLines(JsonArrayString: Text)
                var
                    JsonArray: JsonArray;
                    JsonToken: JsonToken;
                    JsonObject: JsonObject;
                    PurisUsers: Record PurisUsers;
                    i: Integer;
                    RecordLine: Integer;
                    UserName: Text;
                    Data1: Text;
                    Data2: Text;
                begin
                    if not JsonArray.ReadFrom(JsonArrayString) then
                        exit;

                    for i := 0 to JsonArray.Count() - 1 do begin
                        JsonArray.Get(i, JsonToken);
                        JsonObject := JsonToken.AsObject();

                        // Get next RecordLine number
                        PurisUsers.SetCurrentKey(RecordLine);
                        if PurisUsers.FindLast() then
                            RecordLine := PurisUsers.RecordLine + 1
                        else
                            RecordLine := 1;

                        // Parse fields
                        if JsonObject.Get('UserName', JsonToken) then
                            UserName := JsonToken.AsValue().AsText();
                        if JsonObject.Get('data1', JsonToken) then
                            Data1 := JsonToken.AsValue().AsText();
                        if JsonObject.Get('data2', JsonToken) then
                            Data2 := JsonToken.AsValue().AsText();

                        // Insert record
                        PurisUsers.Init();
                        PurisUsers.RecordLine := RecordLine;
                        PurisUsers.UserName := UserName;
                        PurisUsers.data1 := Data1;
                        PurisUsers.data2 := Data2;
                        PurisUsers.Insert();
                    end;

                    Message('Records inserted successfully');
                end;

                trigger GoToPage(i: Integer)
                var

                begin
                    case i of
                        1:
                            Page.Run(Page::"Sales Orders");
                        2:
                            Page.Run(Page::"Released Production Orders");
                        3:
                            Page.Run(Page::"Payment Journal");
                        else
                            exit;
                    end;

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
                    JsonHelper: Codeunit JsonHelper;
                    purisUsers: Record PurisUsers;
                    refRecord: RecordRef;
                    jsonArray: Text;
                begin
                    refRecord.GetTable(purisUsers);
                    jsonArray := JsonHelper.RecordToJsonArray(refRecord);
                    CurrPage.WarehouseMover.SendDataToReact(jsonArray);


                end;
            }
        }
    }

    local procedure ProcessJsonObject(JsonObject: JsonObject): Text
    var
        Keys: List of [Text];
        JsonToken: JsonToken;
        i: Integer;
        ObjectText: Text;
    begin
        Keys := JsonObject.Keys();
        ObjectText := '';

        for i := 1 to Keys.Count() do begin
            JsonObject.Get(Keys.Get(i), JsonToken);
            ObjectText += Keys.Get(i) + ': ' + JsonToken.AsValue().AsText();
            if i < Keys.Count() then
                ObjectText += ', ';
        end;

        exit(ObjectText);
    end;
}