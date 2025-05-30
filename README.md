# (WIP) bc-lbl-handler README
This extension lets you maintain a single, central label repository for your Business Central solutions.
Add any new label variables to the designated codeunit.
Run the `BC Label: Update label getters` command to automatically generate (or refresh) each corresponding getter procedure.
Remove a label getter by deleting the label variable itself and running the `BC Label: Update label getters` command.

## Instructions
### Installation
1. `code --force --install-extension <path to vsix file>`

### Usage
1. Create a codeunit
2. Open the extension settings
3. Insert the file name of the codeunit into the input box 'Target File'
4. Add labels variables to the codeunit you created. **The variable name needs to start with an underscore** (e.g. `_SomeLabel: Label 'Example label', Locked = true;`)
5. Press `ctr+shift+p`
6. Execute the command `BC Label: Update label getters`
