import axios from "axios";
import FormData from "form-data";

// Function to upload a file to the backend server
export const uploadFile = async (fileData) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/upload`,
      fileData
    );
    return data;
  } catch (error) {
    console.log(`Error in uploading image : ${error.message}`);
  }
};

// Function to scan a file for viruses using VirusTotal API
export const scanVirus = async (file) => {
  let url = "https://www.virustotal.com/api/v3/files";

  // Check if the file size exceeds 30 mb before uploading
  if (file.size > 30000000) {
    const urlOptions = {
      method: "GET",
      url: "https://www.virustotal.com/api/v3/files/upload_url",
      headers: {
        "x-apikey": import.meta.env.VITE_VIRUS_TOTAL_KEY,
        accept: "application/json",
      },
    };
    const { data } = await axios.request(urlOptions);
    url = data.data;
  }

  const form = new FormData();
  form.append("file", file);

  try {
    const scanOptions = {
      method: "POST",
      headers: {
        "x-apikey": import.meta.env.VITE_VIRUS_TOTAL_KEY,
        accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      data: form,
    };
    const { data } = await axios.request(url, scanOptions);

    const reportOptions = {
      method: "GET",
      url: `https://www.virustotal.com/api/v3/analyses/${data.data.id}`,
      headers: {
        accept: "application/json",
        "x-apikey": import.meta.env.VITE_VIRUS_TOTAL_KEY,
      },
    };

    const res = await axios.request(reportOptions);

    if (res.data.data.attributes.stats.malicious > 0) {
      return "infected";
    } else {
      return "clean";
    }
  } catch (error) {
    console.error("Error scanning file:", error);
    return "error";
  }
};
