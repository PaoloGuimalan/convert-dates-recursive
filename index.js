function convertDatesRecursive(obj, keysToConvert, toFormat = "YYYY-MM-DD") {
  function toISO(dateStr) {
    const parts = dateStr.split("T");
    if (parts.length === 2 && parts[1].trim() !== "") {
      // Has time part
      const [datePart, timePart] = parts;
      const dateParts = datePart.split("/");
      if (dateParts.length !== 3) return dateStr;
      const [month, day, year] = dateParts;
      return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}T${timePart}`;
    } else {
      // No time part
      const dateParts = parts[0].split("/");
      if (dateParts.length !== 3) return dateStr;
      const [month, day, year] = dateParts;
      return `${year.padStart(4, "0")}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )}`;
    }
  }

  function toUS(dateStr) {
    const parts = dateStr.split("T");
    if (parts.length === 2 && parts[1].trim() !== "") {
      const [datePart, timePart] = parts;
      const dateParts = datePart.split("-");
      if (dateParts.length !== 3) return dateStr;
      const [year, month, day] = dateParts;
      return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year.padStart(
        4,
        "0"
      )}T${timePart}`;
    } else {
      const dateParts = parts[0].split("-");
      if (dateParts.length !== 3) return dateStr;
      const [year, month, day] = dateParts;
      return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year.padStart(
        4,
        "0"
      )}`;
    }
  }

  function extractDateOnly(dateStr) {
    const match = dateStr.match(/^(\d{4}-\d{2}-\d{2})(T.*)?$/);
    return match
      ? { datePart: match[1], timePart: match[2] || "" }
      : { datePart: dateStr, timePart: "" };
  }

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      convertDatesRecursive(item, keysToConvert, toFormat)
    );
  } else if (obj !== null && typeof obj === "object") {
    const newObj = {};
    for (const [key, value] of Object.entries(obj)) {
      if (keysToConvert.includes(key) && typeof value === "string") {
        if (toFormat === "YYYY-MM-DD") {
          if (value.includes("/")) {
            newObj[key] = toISO(value);
          } else {
            const { datePart, timePart } = extractDateOnly(value);
            newObj[key] = timePart ? `${datePart}${timePart}` : datePart;
          }
        } else {
          // toFormat === 'MM/DD/YYYY'
          if (value.includes("-")) {
            const { datePart /*, timePart*/ } = extractDateOnly(value);
            const usDate = toUS(datePart);
            // Ignore timePart completely to hide time
            newObj[key] = usDate;
          } else {
            newObj[key] = value;
          }
        }
      } else {
        newObj[key] = convertDatesRecursive(value, keysToConvert, toFormat);
      }
    }
    return newObj;
  } else {
    return obj;
  }
}

export default convertDatesRecursive;
