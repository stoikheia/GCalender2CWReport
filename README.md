# GCalender2CWReport

A repository for Google Apps Script (GAS) scripts that process Google Calendar events and generate reports.

## Overview

This repository stores Google Apps Script files written in plain JavaScript. The scripts are designed to work with Google Calendar and generate customized reports based on calendar events.

## Repository Structure

```
GCalender2CWReport/
├── DEPLOYMENT.md
├── LICENSE
├── README.md
├── ai
│   ├── Context.md
│   └── Prompt.md
└── src
    ├── Code.gs
    ├── Develop.gs
    ├── ExportJSON.gs
    ├── GenerateText.gs
    ├── TestDataExpected.gs
    ├── TestDataJSON.gs
    └── Tests.gs

```

## Deployment Instructions

Since this is a Google Apps Script project, deployment is done by copying and pasting the code into the Google Apps Script editor:

### Steps to Deploy:

1. **Open Google Apps Script Editor**
   - Go to [script.google.com](https://script.google.com)
   - Click on "New Project"

2. **Copy the Script Files**
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

## Development

## Requirements

- A Google account
- Access to Google Apps Script (script.google.com)
- Permissions to access Google Calendar data

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.