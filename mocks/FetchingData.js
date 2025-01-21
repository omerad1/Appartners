import { appartmentView } from "../data/mockData/appartmentView";
export const fetchMockApartments = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(appartmentView);
    }, 500); // Simulate a delay for fetching data
  });
};
