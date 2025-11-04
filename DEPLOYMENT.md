# Deployment Guide

This guide provides detailed instructions for deploying Google Apps Script files from this repository.

## Deployment Method: Copy and Paste

Since Google Apps Script doesn't support direct git integration, we use the copy-and-paste method to deploy code.

## Step-by-Step Deployment Process

### 1. Prepare Your Environment

- Open your web browser
- Navigate to [Google Apps Script](https://script.google.com)
- Sign in with your Google account

### 2. Create a New Project

- Click on **"New Project"** button
- A new project will be created with a default `Code.gs` file

### 3. Copy Source Files

For each `.gs` file in the `src/` directory:

1. Open the file in this repository
2. Select all content (`Ctrl+A` or `Cmd+A`)
3. Copy to clipboard (`Ctrl+C` or `Cmd+C`)

### 4. Paste into GAS Editor

1. In the Google Apps Script editor:
   - If updating `Code.gs`: Select all existing content and replace it
   - If adding new files: Click the **+** next to "Files" and select "Script"
   
2. Paste the copied content (`Ctrl+V` or `Cmd+V`)
3. Save the file (`Ctrl+S` or `Cmd+S`)

### 5. Configure Project Settings

1. Click on the project name (top left) to rename it
2. Enter a descriptive name: "GCalender2CWReport"

### 6. Set Up Triggers (Optional)

If you want the script to run automatically:

1. Click on the **clock icon** (Triggers) in the left sidebar
2. Click **"Add Trigger"**
3. Configure:
   - Choose function to run (e.g., `main`)
   - Select event source (e.g., "Time-driven")
   - Set the frequency (e.g., daily, hourly)
4. Save the trigger

### 7. Grant Permissions

The first time you run the script:

1. Click **"Run"** button in the toolbar
2. A permission dialog will appear
3. Click **"Review permissions"**
4. Select your Google account
5. Click **"Allow"** to grant necessary permissions

### 8. Test Your Deployment

1. Select a function from the dropdown menu (e.g., `main`)
2. Click the **"Run"** button
3. Check the **Execution log** at the bottom for any errors
4. View logs: Click **"View"** > **"Logs"** or press `Ctrl+Enter`

## Updating Existing Scripts

To update an already deployed script:

1. Pull the latest changes from this repository
2. Open your Google Apps Script project
3. Copy and paste the updated content from the repository
4. Save the changes
5. Test to ensure everything works correctly

## Troubleshooting

### Common Issues

**Permission Denied Errors**
- Solution: Review and grant all requested permissions in the authorization flow

**Script Timeout**
- Solution: Break large operations into smaller chunks or use time-based triggers

**Calendar Access Issues**
- Solution: Ensure the script has permission to access Google Calendar and that the calendar ID is correct

### Getting Help

- Check the [Google Apps Script Documentation](https://developers.google.com/apps-script)
- Review error messages in the execution log
- Verify all required permissions are granted

## Best Practices

1. **Version Control**: Always keep this repository as the source of truth
2. **Testing**: Test changes locally before deploying to production
3. **Backup**: Keep a copy of your working script before major updates
4. **Documentation**: Document any custom configurations or changes
5. **Security**: Never commit sensitive data (API keys, passwords) to the repository

## Rollback Procedure

If a deployment causes issues:

1. Open this repository
2. Navigate to the previous working commit
3. Copy the old version of the file(s)
4. Paste into the Google Apps Script editor
5. Save and test

## Automated Deployment (Future Enhancement)

While manual copy-paste is the current method, future enhancements could include:
- Using the [Google Apps Script API](https://developers.google.com/apps-script/api)
- Implementing [clasp](https://github.com/google/clasp) (Command Line Apps Script Projects)
- Creating deployment scripts for automation
