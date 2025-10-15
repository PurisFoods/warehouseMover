controladdin warehouseMoverControlAddIn
{
    Scripts = 'scripts/index-Chknlm-r.js';
    StyleSheets = 'scripts/index-BxEope7X.css';
    RequestedHeight = 600;
    RequestedWidth = 800;
    VerticalStretch = true;
    HorizontalStretch = true;

    procedure SendDataToReact(messageData: Text);
    event ReceiveDataFromReact(messageData: Text)

}