# GCalender2CWReport

A repository for Google Apps Script (GAS) scripts that process Google Calendar events and generate reports.

## Overview

This repository stores Google Apps Script files written in plain JavaScript. The scripts are designed to work with Google Calendar and generate customized reports based on calendar events.

## Repository Structure

```
GCalender2CWReport/
├── src/
│   └── Code.gs          # Main GAS script file
├── README.md            # This file
├── LICENSE              # MIT License
└── .gitignore          # Git ignore rules
```

## Deployment Instructions

Since this is a Google Apps Script project, deployment is done by copying and pasting the code into the Google Apps Script editor:

### Steps to Deploy:

1. **Open Google Apps Script Editor**
   - Go to [script.google.com](https://script.google.com)
   - Click on "New Project"

2. **Copy the Script Files**
   - Open the `src/Code.gs` file from this repository
   - Copy the entire contents

3. **Paste into GAS Editor**
   - In the Google Apps Script editor, select the default `Code.gs` file
   - Delete any existing content
   - Paste the copied code

4. **Save and Name Your Project**
   - Click the disk icon or press `Ctrl+S` (or `Cmd+S` on Mac) to save
   - Give your project a meaningful name (e.g., "GCalendar2CWReport")

5. **Set Up Permissions**
   - The first time you run the script, Google will ask for permissions
   - Review and grant the necessary permissions for Calendar access

6. **Run the Script**
   - Select the function you want to run from the dropdown menu
   - Click the "Run" button

## Usage

The main script provides the following functions:

- `main()` - Main entry point for the script
- `getCalendarEvents(calendarId, startDate, endDate)` - Fetches calendar events within a date range
- `generateReport(events)` - Generates a formatted report from calendar events

## Development

### Adding New Features

1. Create or modify `.gs` files in the `src/` directory
2. Follow Google Apps Script conventions for JavaScript
3. Test your changes in the Google Apps Script editor
4. Commit your changes to this repository

### Best Practices

- Keep functions focused and modular
- Add JSDoc comments for better documentation
- Use clear and descriptive function names
- Handle errors appropriately with try-catch blocks
- Log important information using `Logger.log()`

## Requirements

- A Google account
- Access to Google Apps Script (script.google.com)
- Permissions to access Google Calendar data

## Contributing

Feel free to contribute improvements or additional scripts. Make sure to:
- Follow the existing code style
- Add appropriate comments and documentation
- Test your changes before committing

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.