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

                trigger ReceiveDataFromReact(messageData: Text)
                begin
                    message(messageData);
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
                    binContentData: Record "Bin Content";
                    customerData: Record Customer;
                    refRecord: RecordRef;
                    jsonArray: Text;
                begin
                    binContentData.SetRange("Bin Code", '01-A1');
                    if binContentData.FindSet() then begin
                        refRecord.GetTable(binContentData);
                        jsonArray := JsonHelper.RecordToJsonArray(refRecord);

                        Message('JSON: %1', jsonArray);
                        CurrPage.WarehouseMover.SendDataToReact(jsonArray);


                    end;
                end;
            }
        }
    }
}