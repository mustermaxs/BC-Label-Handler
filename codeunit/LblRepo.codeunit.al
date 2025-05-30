namespace CSS.HR

codeunit 80150 MyCodeunit
{

    var
        _OpenSuggestionDefinitionOfGoalsLbl2: Label 'Click here to open: Suggestions for the definition of goals', Comment = 'de-AT=Hier klicken um zu öffnen: Anregungen zur Definition von Zielen';
        _OpenSuggestionDefinitionOfGoalsLbl3: Label 'Click here to open: Suggestions for the definition of goals', Comment = 'de-AT=Hier klicken um zu öffnen: Anregungen zur Definition von Zielen';

    procedure OpenSuggestionDefinitionOfGoalsLbl2(): Text
    begin
        _exit(_OpenSuggestionDefinitionOfGoalsLbl2);
    end;

    procedure OpenSuggestionDefinitionOfGoalsLbl3(): Text
    begin
        _exit(_OpenSuggestionDefinitionOfGoalsLbl3);
    end;
}