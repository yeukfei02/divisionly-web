export const getRootUrl = (): string => {
  let rootUrl = "";

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    rootUrl = `http://localhost:3000/api`;
  } else {
    rootUrl = `https://divisionly-api.herokuapp.com/api`;
  }

  return rootUrl;
};

export const capitalizeFirstLetter = (text: string): string => {
  let result = "";

  if (text) {
    result = text.charAt(0).toUpperCase() + text.slice(1);
  }

  return result;
};
