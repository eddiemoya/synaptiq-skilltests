import {useState} from 'react';
import {CalendarMinor} from '@shopify/polaris-icons';
import en from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/build/esm/styles.css'
import {
    DatePicker, 
    AppProvider, 
    Popover, 
    TextField, 
    Text,
    Card, 
    Box,
    Divider, 
    Icon, 
    Form} from '@shopify/polaris';

const variantTypes =[
    'headingXs', 
    'headingSm', 
    'headingMd', 
    'headingLg', 
    'headingXl', 
    'heading2xl',
    'heading3xl', 
    'heading4xl', 
    'bodySm',
    'bodyMd',
    'bodyLg'
] as const

type Props = { 
    yearVariant?: typeof variantTypes[number],
    monthDayVariant?: typeof variantTypes[number]
    monthFormat?: 'long'|'short'
    weekdayFormat?: 'long'|'short'
  };

/**
 * An integration of the shopify polaris DatePicker, TextField, and Popover components
 * 
 * @param {Date} props
 * @returns {JSX.Element}
 */
function DateSelector({
    // selectedDate = new Date(), 
    // setSelectedDate,
    yearVariant = 'heading4xl',
    monthDayVariant = 'headingMd',
    monthFormat = 'short',
    weekdayFormat = 'long'
}: Props) {

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [{ month, year}, setDate] = useState({
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear(),
    });

   
    const [popoverActive, setPopoverActive] = useState(true);
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState(selectedDate.toISOString().slice(0, 10));
  
    /**
     * Uses setDate to update the month when the user clicks an arrow. 
     * The polaris datepicker then uses the month value to control 
     * which month is shown to the user.
     * 
     * @param {number} month
     * @param {number} year
     * 
     * @returns {void}
     */
    const handleMonthChange = (month: number, year: number): void => {
        setDate({month, year})
    };

    /**
     * Updates the close event for the popover
     * 
     * @returns {void}
     */
    const handleOnClose = (): void => setPopoverActive((popoverActive) => !popoverActive);

    /**
     * Tells the Popover to show itself
     * 
     * @returns {void}
     */
    const handleOnFocus = (): void => setVisible(true);

    /**
     * Handles changes to the Textfield as the user types.
     * 
     * @param {string} newDate
     * @returns {void}
     */
    const handleTextChange = (newDate: string): void => setValue(newDate);

    /**
     * Updates the state of selectedDate, and tells the Popover to
     * hide itself. It also updates the Textfield with the new date.
     * 
     * @param {DateSelectProps} props.end
     * @returns {void}
     */
    const handleDateSelection = ({end: newSelectedDate} : DateSelectProps): void => {
        setSelectedDate(newSelectedDate);
        setValue(formatDate(newSelectedDate));
        setVisible(false);
    };

    /**
     * Returns a YYYY-MM-DD formatted string based on the given
     * date object.
     * 
     * @param {Date} selectedDate
     * @returns {string}
     */
    const formatDate = (selectedDate: Date) : string => {
        return selectedDate.toISOString().slice(0, 10);
    };
    
    
    type DateSelectProps = {
        end: Date
    };
    
    /**
     * Handles the submit event from the text field. Updates
     * the Polaris DatePicker component and selectedDate state, only
     * after given date is validated.
     * 
     * @param {any} _event
     * @returns {void}
     */
    const handleSubmit = (_event: any): void => {

        const value = _event.target.dateField.value;

        //Update the textfield as the user types
        setValue(value);

        // Constrains the string to ####-##-##
        const dateRegEx = /^\d{4}-\d{2}-\d{2}$/;

        // Ensure that the string has the right pattern, and 
        // can be parsed as a date,
        if(value.match(dateRegEx) && Date.parse(value)) {

            //Accounts for polaris zero-based dates and absence of "day" in state
            const date = new Date(value);
            date.setDate(date.getDate() + 1);

            //Set the date in the polaris datepicker
            setSelectedDate(date);
            setDate({
                month: date.getMonth(),
                year: date.getFullYear(),
            });

            //Hide the popover
            setVisible(false)
        }
    };

    const activator = (
        <TextField
            name='dateField'
            role='combobox'
            autoComplete="off"
            value={value}
            label={"Select date"}
            onChange={handleTextChange}
            onFocus={handleOnFocus}
            prefix={<Icon source={CalendarMinor} />}
            placeholder='yyyy-dd-mm'
        />
    );

    return (
        <AppProvider i18n={en}>
            <Card>

                <Box>
                    <Text variant={yearVariant} as="h1" alignment='center' numeric>
                        {selectedDate.toLocaleDateString('default', {year: 'numeric'})}
                    </Text>
                </Box>


                <Box paddingBlockEnd='5'>
                    <Text variant={monthDayVariant} as="h1" alignment='center'>
                        <span>{selectedDate.toLocaleDateString('default', {weekday: weekdayFormat})} </span>
                        <span>{selectedDate.toLocaleDateString('default', {month: monthFormat})}, </span>
                        <span>{selectedDate.toLocaleDateString('default', {day: 'numeric'})} </span>
                    </Text>
                </Box>

                <Divider />

                <Box  paddingBlockStart='5'>
                    <Form onSubmit={handleSubmit}>
                        <Popover
                            activator={activator}
                            active={visible}
                            onClose={handleOnClose}
                            sectioned={true}
                        >  
                    
                            <DatePicker
                                id='datePicker'
                                month={month}
                                year={year}
                                selected={selectedDate}
                                onChange={handleDateSelection}
                                onMonthChange={handleMonthChange}
                            />
                            
                        </Popover>
                    </Form>
                </Box>
            </Card>
        </AppProvider>
    );
}

export default DateSelector;


