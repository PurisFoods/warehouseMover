codeunit 50260 JsonHelper
{
    SingleInstance = true;

    procedure RecordToJsonArray(var Rec: RecordRef): Text
    var
        JsonArray: Text;
        JsonObj: TExt;
        FieldRef: FieldRef;
        FirstRecord: Boolean;
        i: Integer;
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

                    JsonObj += '"' + FieldRef.Name + '":';

                    case FieldRef.Type of
                        FieldType::Integer,
                        FieldType::BigInteger,
                        FieldType::Decimal,
                        FieldType::Boolean:
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

    local procedure EscapeString(Value: Text): Text
    var
        Result: Text;
    begin
        Result := Value;
        Result := StrSubstNo(Result, '\', '\\');
    end;


}