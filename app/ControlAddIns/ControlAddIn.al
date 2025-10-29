controladdin warehouseMoverControlAddIn
{
    Scripts = 'scripts/index-Br_QINwa.js';
    // StyleSheets = 'scripts/index-Cc4-GnIO.css';
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