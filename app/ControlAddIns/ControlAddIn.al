controladdin warehouseMoverControlAddIn
{
    Scripts = 'scripts/index-BnEZXV1M.js';
    StyleSheets = 'scripts/index-D96AF_Jt.css';
    RequestedHeight = 0;
    RequestedWidth = 0;
    VerticalStretch = true;
    HorizontalStretch = true;

    procedure SendDataToReact(messageData: Text);
    event ReceiveDataFromReact(JsonArrayString: Text);
    event GetTable(tableNumber: Integer; maxRecords: Integer; filterField: Integer; filterText: Text);

}