import {useState, useCallback} from 'react';
import {DatePicker, Popover, TextField, Card, Icon } from '@shopify/polaris';
import {CalendarMinor} from '@shopify/polaris-icons';
import '@shopify/polaris/build/esm/styles.css'

/**
 * An integration of the shopify polaris DatePicker, TextField, and Popover components
 * 
 * @returns {JSX.Element}
 */
function DateSelector() {

    const [selectedDate, setSelectedDate] = useState(new Date('Wed May 22 1985 00:00:00 GMT-0600 (CST)'));
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
     * @returns void
     */
    const handleMonthChange = useCallback((month: number, year: number) => {
            setDate({month, year})
        },[] 
    );

    /**
     * Updates the state of the Popover
     * 
     * @returns void
     */
    const handleOnClose = useCallback(() => { 
            setPopoverActive((popoverActive) => !popoverActive) 
        },[]
    );

    /**
     * Tells the Popover to show itself
     * 
     * @returns void
     */
    const handleOnFocus = useCallback(() => {
            setVisible(true)
        },[]
    );

    /**
     * Updates the state of selectedDate, and tells the Popover to
     * hide itself. It also updates the Textfield with the new date.
     * 
     * @returns void
     */
    const handleDateSelection = useCallback( ({end: newSelectedDate} : {end: Date}) => {
            setSelectedDate(newSelectedDate);
            setVisible(false);
            setValue(formatDate(newSelectedDate))
      },[]
    );
      
    /**
     * Handles changes to the Textfield as the user types.
     * Updates the selectedDate, only when the string matches
     * 
     * @param {string} newDate
     * @returns void
     */
    const handleTextChange = useCallback((newDate: string) =>  {
        setValue(newDate);

        // Constrains the string to ####-##-##
        const dateRegEx = /^\d{4}-\d{2}-\d{2}$/;
        
        // Ensure that the string has the right pattern, and can be parsed as a date,
        if(newDate.match(dateRegEx) && Date.parse(newDate)) {

            //Accounts for polaris datepicker using zero-based days, but no direct way to pass the day value like month and year
            const date = new Date(newDate);
            date.setDate(date.getDate() + 1);

            //Set the date in the polaris datepicker
            setSelectedDate(date);
        }
     },[]
     
    );

    /**
     * Returns a YYYY-MM-DD formatted string based on the given
     * date object.
     * 
     * @param {Date} selectedDate
     * @returns {Date}
     */
    function formatDate(selectedDate: Date) : string {
        return selectedDate.toISOString().slice(0, 10);
    }

    const activator = (
        <TextField
            role="combobox"
            autoComplete="off"
            value={value}
            label={"Select date"}
            onChange={handleTextChange}
            onFocus={handleOnFocus}
            prefix={<Icon source={CalendarMinor} />}
        />
    );

    return (
        <Card>
            <Popover
                activator={activator}
                active={visible}
                onClose={handleOnClose}
                fullWidth={true}
                fullHeight={true}
                sectioned={true}
            >  
                <DatePicker
                    month={month}
                    year={year}
                    selected={selectedDate}
                    onChange={handleDateSelection}
                    onMonthChange={handleMonthChange}
                />     
            </Popover>
        </Card>
    );
  }

export default DateSelector;