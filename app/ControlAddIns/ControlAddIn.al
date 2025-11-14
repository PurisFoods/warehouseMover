controladdin warehouseMoverControlAddIn
{
    Scripts = 'scripts/index-BMJPwhKa.js';
    StyleSheets = 'scripts/index-Dp1WeHtW.css';
    RequestedHeight = 0;
    RequestedWidth = 0;
    VerticalStretch = true;
    HorizontalStretch = true;

    procedure SendDataToReact(messageData: Text);
    event ReceiveDataFromReact(JsonArrayString: Text);
    event AddLines(JsonArrayString: Text);
    event GoToPage(i: Integer);
    event GetTable(tableNumber: Integer; filterField: Integer; filterText: Text);

}