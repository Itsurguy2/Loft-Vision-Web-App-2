# Vanilla JS Theme App

## Overview
This project is a simple web application built using vanilla JavaScript. It features a themed interface that displays a list of items, each with detailed views accessible via unique endpoints. The application also includes a 404 page for unmatched routes.

## Features
- Main entry point at `index.html`
- Detailed views for five unique items located in the `items` directory
- 404 error page for unmatched routes
- Themed styling using Picocss
- JavaScript files for app functionality, routing, data handling, and utility functions

## Project Structure
```
vanilla-js-theme-app
├── index.html
├── items
│   ├── item-1.html
│   ├── item-2.html
│   ├── item-3.html
│   ├── item-4.html
│   └── item-5.html
├── 404.html
├── css
│   ├── styles.css
│   └── theme.css
├── js
│   ├── app.js
│   ├── router.js
│   ├── data.js
│   └── utils.js
├── data
│   └── items.json
├── package.json
└── README.md
```

## Setup Instructions
1. Clone the repository to your local machine.
2. Open the `index.html` file in your web browser to view the application.
3. Ensure that you have a local server running if you want to test routing and dynamic content loading.

## Usage
- Navigate through the list of items on the main page.
- Click on an item to view its detailed information.
- If you navigate to an unmatched route, you will be redirected to the 404 error page.

## Technologies Used
- HTML
- CSS (Picocss)
- JavaScript (Vanilla)

## Contribution
Feel free to fork the repository and submit pull requests for any improvements or features you would like to add.