//Fluent UI
import { Button, MenuList } from '@fluentui/react-components';
import { CompoundButton } from '@fluentui/react-components';
import { Menu, MenuButton, MenuItem, MenuPopover, MenuTrigger } from '@fluentui/react-components';
import type React from 'react';

export const ButtonsBox: React.FC = () => {
    
  const handleButton = () => {
    console.log('Clickety Click');
  }

  const handleOptionA = (text: string) => {
    console.log('Option A', text);
    if (Microsoft.Dynamics?.NAV?.InvokeExtensibilityMethod) {
      Microsoft.Dynamics.NAV.InvokeExtensibilityMethod('ReceiveDataFromReact', [text]);
    }
  }

    return (
     <div className='buttonContainer'>

    <Button onClick={handleButton} appearance='outline'
      style={{padding: "0.5em"}}
    >Click Me</Button>

    <CompoundButton onClick={handleButton} 
    secondaryContent='Secondary Content'
    appearance='outline'
    >Compound Button</CompoundButton>

    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <MenuButton>Menu Button</MenuButton>
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem onClick={() => handleOptionA('Option Aaaaaaaaaaaaa')}>Option A</MenuItem>
          <MenuItem>Option B</MenuItem>

        </MenuList>
      </MenuPopover>
    </Menu>
    </div>
    )
}