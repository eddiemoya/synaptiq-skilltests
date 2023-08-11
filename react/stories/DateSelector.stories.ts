
import type { Meta, StoryObj } from '@storybook/react';
import DateSelector from '../app/components/DateSelector';

const meta = {
  title: 'Components/Date Selector',
  component: DateSelector,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DateSelector>;

export default meta;
type Story = StoryObj<typeof meta>;


export const Primary: Story = {
    args: {
        yearVariant: 'heading4xl',
        monthDayVariant: 'headingMd',
        weekdayFormat: 'long',
        monthFormat: 'short'
    },
};

