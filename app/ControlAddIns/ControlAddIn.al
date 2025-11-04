controladdin warehouseMoverControlAddIn
{
    Scripts = 'scripts/index-YDkX92h7.js';
    StyleSheets = 'scripts/index-DXxlz2np.css';
    RequestedHeight = 0;
    RequestedWidth = 0;
    VerticalStretch = true;
    HorizontalStretch = true;

    procedure SendDataToReact(messageData: Text);
    event ReceiveDataFromReact(JsonArrayString: Text);
    event AddLines(JsonArrayString: Text);
    event GoToPage(i: Integer);
    event GetTable(tableNumber: Integer);

}