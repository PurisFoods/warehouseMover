controladdin warehouseMoverControlAddIn
{
    Scripts = 'scripts/index-BJikp9zm.js';
    StyleSheets = 'scripts/index-DdgvXn9G.css';
    RequestedHeight = 0;
    RequestedWidth = 0;
    VerticalStretch = true;
    HorizontalStretch = true;

    procedure SendDataToReact(messageData: Text);
    event ReceiveDataFromReact(JsonArrayString: Text);
    event GetTable(tableNumber: Integer; maxRecords: Integer; filterField: Integer; filterText: Text);
    event UpdateRow(tableNumber: Integer; rowData: Text);

}