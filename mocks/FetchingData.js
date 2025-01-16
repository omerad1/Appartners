// fetchingMock.js
import apartmentData from "../data/mockData/appartmentView"; // Import the JSON file

export const fetchApartmentData = async () => {
  // Simulate fetching with a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Dynamically handle `require` for local images in the mock
  const dataWithImages = {
    ...apartmentData,
    apartment: {
      ...apartmentData.apartment,
      images: apartmentData.apartment.images.map((image) => require(image)),
      user: {
        ...apartmentData.apartment.user,
        image: require(apartmentData.apartment.user.image),
      },
    },
  };

  return dataWithImages;
};
