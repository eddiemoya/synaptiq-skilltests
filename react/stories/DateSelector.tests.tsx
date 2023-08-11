import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { composeStories } from '@storybook/react';

import * as stories from './DateSelector.stories';

const { Primary } = composeStories(stories);

test('when the user clicks the textbox, the popover should open', async () => {
    const user = userEvent.setup()
    render(<Primary />);
  
    const DateSelectorEl:any = screen.getAllByPlaceholderText('yyyy-mm-dd');
    const DatePicker:any = screen.getByTestId('datePicker');

    console.log(DatePicker);

    await user.click(DateSelectorEl)

    expect(DatePicker).toBeVisible();
  });


