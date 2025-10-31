controladdin warehouseMoverControlAddIn
{
    Scripts = 'scripts/index-CklJG57_.js';
    StyleSheets = 'scripts/index-CNUFk7z0.css';
    RequestedHeight = 600;
    RequestedWidth = 800;
    VerticalStretch = true;
    HorizontalStretch = true;

    procedure SendDataToReact(messageData: Text);
    event ReceiveDataFromReact(JsonArrayString: Text);
    event AddLines(JsonArrayString: Text);
    event GoToPage(i: Integer);
    event GetTable(tableNumber: Integer);

}