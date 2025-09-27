# Vanilla JS Theme ( LoftVision ) App

# WEB103 Project 1 - *LoftVision*

Submitted by: **Jesse Rosenthal**

About this web app: **This project is a simple web application built using vanilla JavaScript. It features a themed interface that displays a list of items, each with detailed views accessible via unique endpoints. The application also includes a 404 page for unmatched routes.**

Time spent: **10** hours

## Required Features

The following **required** functionality is completed:

<!-- Make sure to check off completed functionality below -->
- [X] **The web app uses only HTML, CSS, and JavaScript without a frontend framework**
- [X] **The web app displays a title**
- [ ] **The web app displays at least five unique list items, each with at least three displayed attributes (such as title, text, and image)**
- [ ] **The user can click on each item in the list to see a detailed view of it, including all database fields**
  - [ ] **Each detail view should be a unique endpoint, such as as `localhost:3000/bosses/crystalguardian` and `localhost:3000/mantislords`**
  - [ ] *Note: When showing this feature in the video walkthrough, please show the unique URL for each detailed view. We will not be able to give points if we cannot see the implementation* 
- [X] **The web app serves an appropriate 404 page when no matching route is defined**
- [X] **The web app is styled using Picocss**

The following **optional** features are implemented:

- [ ] The web app displays items in a unique format, such as cards rather than lists or animated list items

The following **additional** features are implemented:

- [ ] List anything else that you added to improve the site's functionality!

## Video Walkthrough

**Note: please be sure to 

Here's a walkthrough of implemented required features:

<img src='http://i.imgur.com/link/to/your/gif/file.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

<!-- Replace this with whatever GIF tool you used! -->
GIF created with ...  Add GIF tool here
<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

Describe any challenges encountered while building the app or any additional context you'd like to add.

## License

Copyright [2025] [Jesse Rosenthal]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
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
