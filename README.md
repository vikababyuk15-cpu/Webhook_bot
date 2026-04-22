# Webhook_bot

# Google Sheets to Slack: Pre-Release Notifier

A Google Apps Script (GAS) automation designed to monitor game release schedules and send real-time notifications to Slack. It specifically targets items marked as "Pre-Release" and ensures team members are notified as soon as the release date matches today's date.

## 🚀 Overview
The script scans a Google Spreadsheet containing monthly release data. If a row matches the current date and is marked with a "Pre-Release" status, it triggers a Slack Webhook with a formatted message for the Operations and Development teams.

## ✨ Key Features
* **Automated Date Matching:** Dynamically identifies the correct sheet based on the current month and year (formatted as `Month_Year`).
* **Smart Date Parsing:** Handles both JavaScript Date objects and string-based date formats.
* **Duplicate Prevention:** Checks for an "already_notified" flag in the spreadsheet to prevent spamming the Slack channel.
* **Team Tagging:** Automatically pings specific Slack subteams and users to ensure high visibility.
* **Status Tracking:** Updates the spreadsheet immediately after a successful Slack delivery.

## 🛠 Tech Stack
* **Language:** JavaScript (Google Apps Script)
* **Integration:** Slack Webhooks API
* **Platform:** Google Workspace

## ⚙️ Configuration

### Spreadsheet Structure
The script expects specific columns to function correctly:
* **Column A (1):** Date of the release.
* **Column C (3):** Game Provider.
* **Column D (4):** Status (triggers only on "pre-release").
* **Column G (7):** Key/Identifier.
* **Column J (10):** Game Name.
* **Column M (13):** Notification status (used by the script to write `already_notified`).

### Setup
1.  Open your Google Spreadsheet.
2.  Navigate to **Extensions** > **Apps Script**.
3.  Paste the code from `sendSlackNotifications.js` into the editor.
4.  Replace the `slackWebhookUrl` variable with your actual Slack Incoming Webhook URL.
5.  Set up a **Trigger** in Apps Script (clock icon) to run the function `sendSlackNotifications` on a daily schedule (e.g., every morning at 8:00 AM).

## 📝 License
This project is for internal automation and workflow optimization.
