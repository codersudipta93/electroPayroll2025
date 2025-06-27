
import { Alert, Animated, Easing } from "react-native";
import Snackbar from 'react-native-snackbar';

const HelperFunctions = {

  sampleFunction: (data) => {
    return alert(data)
  },

  calculateDateDifference (startDate, endDate) {
    const parseDate = (dateStr) => {
      const [year, month, day] = dateStr.split('/').map(Number);
      return new Date(year, month - 1, day); // month is 0-based in Date
    };
  
    const start = parseDate(startDate);
    const end = parseDate(endDate);
  
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Invalid date(s) provided';
    }
  
    const differenceInMillis = end - start;
    const differenceInDays = differenceInMillis / (1000 * 60 * 60 * 24);
  
    return Math.floor(differenceInDays);
  },

  formatStringDateToYYYYMMDD(dateString) {
    const date = new Date(dateString); // Parse the date string
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0'); // Pad day with leading zero if needed
  
    // Return the formatted string
    return `${year}-${month}-${day}`;
  },
  formatDateToYYYYMMDD (date){
    // Extract year, month, and day from the Date object
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0'); // Pad day with leading zero if needed
  
    // Return the formatted string
    return `${year}-${month}-${day}`;
  },

  

}

export default HelperFunctions;