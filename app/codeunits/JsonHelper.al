codeunit 50260 JsonHelper
{
    SingleInstance = true;
    procedure RecordToJsonArray(var Rec: RecordRef): Text
    var
        JsonArray: Text;
        JsonObj: Text;
        FieldRef: FieldRef;
        FirstRecord: Boolean;
        i: Integer;
        FieldName: Text;
    begin
        JsonArray := '[';
        FirstRecord := true;
        if Rec.FindSet() then
            repeat
                if not FirstRecord then
                    JsonArray += ',';
                JsonObj := '{';
                for i := 1 to Rec.FieldCount() do begin
                    FieldRef := Rec.FieldIndex(i);
                    if i > 1 then
                        JsonObj += ',';
                    // Remove spaces from field name
                    FieldName := FieldRef.Name;
                    FieldName := FieldName.Replace(' ', '');
                    FieldName := FieldName.Replace('.', '');
                    FieldName := FieldName.Replace('-', '_');
                    JsonObj += '"' + FieldName + '":';
                    case FieldRef.Type of
                        FieldType::Boolean:
                            if FieldRef.Value then
                                JsonObj += 'true'
                            else
                                JsonObj += 'false';
                        FieldType::Integer,
                        FieldType::BigInteger,
                        FieldType::Decimal:
                            JsonObj += Format(FieldRef.Value);
                        else
                            JsonObj += '"' + EscapeString(Format(FieldRef.Value)) + '"';
                    end;
                end;
                JsonObj += '}';
                JsonArray += JsonObj;
                FirstRecord := False;
            until Rec.Next() = 0;
        JsonArray += ']';
        exit(JsonArray);
    end;

    procedure JsonToRecord(JsonString: Text; var Rec: RecordRef): RecordRef
    var
        JsonObject: JsonObject;
        JsonToken: JsonToken;
        FieldRef: FieldRef;
        i: Integer;
        FieldName: Text;
        FieldValue: Text;
    begin
        if not JsonObject.ReadFrom(JsonString) then
            exit(Rec);

        for i := 1 to Rec.FieldCount() do begin
            FieldRef := Rec.FieldIndex(i);
            FieldName := FieldRef.Name;
            FieldName := FieldName.Replace(' ', '');

            if JsonObject.Get(FieldName, JsonToken) then begin
                FieldValue := JsonToken.AsValue().AsText();

                case FieldRef.Type of
                    FieldType::Boolean:
                        FieldRef.Value := (FieldValue = 'true') or (FieldValue = '1');
                    else
                        FieldRef.Value := FieldValue;
                end;
            end;
        end;

        exit(Rec);
    end;

    local procedure EscapeString(Value: Text): Text
    begin
        Value := StrSubstNo(Value, '\', '\\');   // escape backslash first
        Value := StrSubstNo(Value, '"', '\"');   // escape double quotes
        Value := StrSubstNo(Value, '\n', '\\n'); // escape newlines
        Value := StrSubstNo(Value, '\r', '\\r'); // escape carriage returns
        Value := StrSubstNo(Value, '\t', '\\t'); // escape tabs
        exit(Value);
    end;

    procedure WriteJsonToRecord(RecordRef: RecordRef; data: text): Boolean
    var
        json: Codeunit Json;
        json2: Codeunit "Json Text Reader/Writer";
        FieldRef: FieldRef;
    begin

    end;

    procedure ProcessJsonArray(JsonArrayString: Text; var Rec: RecordRef): RecordRef
    var
        JsonArray: JsonArray;
        JsonToken: JsonToken;
        i: Integer;
    begin
        if not JsonArray.ReadFrom(JsonArrayString) then
            exit(Rec);

        for i := 0 to JsonArray.Count() - 1 do begin
            JsonArray.Get(i, JsonToken);
            Rec := ProcessJsonObject(JsonToken.AsObject(), Rec);
        end;

        exit(Rec);
    end;

    procedure ProcessJsonObject(JsonObject: JsonObject; var Rec: RecordRef): RecordRef
    var
        Keys: List of [Text];
        JsonToken: JsonToken;
        FieldRef: FieldRef;
        i: Integer;
        FieldName: Text;
        FieldValue: Text;
    begin
        Keys := JsonObject.Keys();

        for i := 1 to Keys.Count() do begin
            JsonObject.Get(Keys.Get(i), JsonToken);
            FieldName := Keys.Get(i).Replace(' ', '');
            FieldValue := JsonToken.AsValue().AsText();

            // Find field by name and set value
            FieldRef := Rec.Field(i);
            FieldRef.Value := FieldValue;
        end;

        exit(Rec);
    end;

}