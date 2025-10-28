controladdin warehouseMoverControlAddIn
{
    Scripts = 'scripts/index-1dIuaknq.js';
    // StyleSheets = [];
    RequestedHeight = 600;
    RequestedWidth = 800;
    VerticalStretch = true;
    HorizontalStretch = true;

    procedure SendDataToReact(messageData: Text);
    event ReceiveDataFromReact(JsonArrayString: Text);
    event AddLines(JsonArrayString: Text);
    event GoToPage(i: Integer);

}