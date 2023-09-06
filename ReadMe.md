
# File Sharing App

The File Sharing App is a web application that allows users to securely upload files and share them with others. It includes features such as virus scanning, download limits, and automatic file cleanup.


## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)
## Features

- Secure file uploads and storage.
- Virus scanning to ensure uploaded files are safe.
- Download limits for shared files.
- Automatic cleanup of files that exceed their download limit.
- QR code generation for easy sharing of file links.
- User-friendly web interface.


## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed.
- MongoDB set up and running.
- API keys for external services (e.g., VirusTotal) if required.

## Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/DeepakKumarVermaRamgarh/file-sharing-app.git
   cd file-sharing-app
   ```

2. Install dependencies:

    `npm install`

    3. Configure environment variables:

Create a .env file in the project root and set the following variables:
```shell
BACKEND_URL=http://localhost:8000 # Your backend server URL
VITE_VIRUS_TOTAL_KEY=your_virustotal_api_key
```

3. Start the server: 

`npm start`




    
## Usage

1. Access the web interface at http://localhost:3000 (or your configured backend URL).

2. Upload a file and set the download limit (optional).

3. The app will scan the file for viruses. If it's clean, the file will be uploaded, and a download link will be generated.

4. Share the download link with others or use the QR code for easy sharing.

5. Users can download the file up to the specified download limit.

## API Endpoints
```shell
/api/v1/file/upload: Endpoint for uploading files.

/api/v1/file/?id=<file_id>&code=<secure_code>: Endpoint for downloading files.
```
## Contributing
Contributions are welcome! If you find any issues or want to add enhancements, feel free to open a pull request. Please ensure you follow the existing code style and guidelines.



## Technologies Used
- Vite
- React
- Node
- Express
- MongoDB
- Multer
- VirusTotal API
- Axios
- QR code

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`BACKEND_URL`

`VITE_VIRUS_TOTAL_KEY`

`MONGODB_URI`



## License
This project is licensed under the [MIT License](LICENSE).


## Authors

*This file sharing app website was developed by* **Deepak Kumar Verma**.
- [@Deepak Kumar Verma](https://github.com/DeepakKumarVermaRamgarh)


## Screenshots


