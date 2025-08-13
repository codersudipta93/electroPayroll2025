import axios from "axios";
import { useSelector } from "react-redux";

// const { companyApiUrl,employeeApiUrl } = useSelector(state => state.common);

//== Get without token API
const getDataWithOutToken = (ApiURL, endpoint) => {
  console.log("end point : ", endpoint);
  return new Promise((resolve, reject) => {
    axios.get(ApiURL + endpoint, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      console.error(error);
      reject(error);
    });
  });
};

//== Get with token API
const getDataWithToken = (ApiURL, endpoint, token) => {
  // console.log("end point : ", endpoint);
  axios.get(ApiURL + endpoint, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    }
  })
    // .then(response => response.json())
    .then((response) => {
      resolve(response.data);
    })
    .catch((error) => {
      console.error(error);
      reject(error);
    });
};

// == Post with token API
const postWithToken = (ApiURL,endpoint, data) => {
  console.log("post with token URL ===>",ApiURL + endpoint);
   console.log(data);
  const config = {
    headers: { 
      'Accept': "application/json",
      "Content-Type": "application/json",
      // 'Authorization': `Bearer ${token}` 
    }
};
  return new Promise((resolve, reject) => {
    try{
      axios.post(ApiURL + endpoint, data, config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });

    }catch (error) {
      reject("catch error found");
    }
  });
  
};






// == upload ===
const uploadFile = (ApiURL,endpoint, data) => {
  console.log("post with token URL ===>",ApiURL + endpoint);
   console.log(data);
    let formData = new FormData();
     formData.append('EmployeeId', data?.EmployeeId);
     formData.append('ExpenseDate', data?.ExpenseDate);
     formData.append('Amount', data?.Amount);
     formData.append('Purpose', data?.Purpose);
     formData.append('Remarks', data?.Remarks);
     formData.append('Image1', data?.Image1);
     formData.append('Image2', data?.Image2);
     formData.append('Image3', data?.Image3);
     formData.append('Image4', data?.Image4);

  const config = {
    headers: { 
      'Accept': "application/json",
      //"Content-Type": "application/json",
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}` 
    }
};
  return new Promise((resolve, reject) => {
    try{
      axios.post(ApiURL + endpoint, formData, config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });

    }catch (error) {
      reject("catch error found");
    }
  });
  
};

//== Post without token API
const postWithOutToken = (ApiURL, endpoint, data) => {
  console.log(ApiURL+endpoint, data);
  return new Promise((resolve, reject) => {
    axios.post(ApiURL + endpoint, data, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};



export {
  getDataWithOutToken,
  getDataWithToken,
  postWithOutToken,
  postWithToken,
  uploadFile
};
