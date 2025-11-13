controladdin warehouseMoverControlAddIn
{
    Scripts = 'scripts/index-uoh19SQS.js';
    StyleSheets = 'scripts/index-DXxlz2np.css';
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