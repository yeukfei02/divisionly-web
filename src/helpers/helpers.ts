export const getRootUrl = (): string => {
  let rootUrl = "";

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    rootUrl = `localhost:3000/api`;
  } else {
    rootUrl = `https://divisionly-api.herokuapp.com/api`;
  }

  return rootUrl;
};
