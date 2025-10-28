table 50260 PurisUsers
{
    DataClassification = ToBeClassified;

    fields
    {
        field(1; RecordLine; BigInteger) { }
        field(2; UserName; Code[20]) { }
        field(3; data1; Text[250]) { }
        field(4; data2; Text[250]) { }
    }

    keys
    {
        key(PK; RecordLine)
        {
            Clustered = true;
        }
    }
}