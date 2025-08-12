export const truncateString = (
  address: string,
  startCharacters: number = 6,
  endCharacters: number = 4,
  lastShow: boolean = false,
) => {
  if (!address || address.length <= startCharacters + endCharacters) {
    return address; // Return the original string if it has 10 or fewer characters
  }

  const firstSixLetters = address.slice(0, startCharacters);
  const lastFourLetters = address.slice(-endCharacters);

  return lastShow
    ? `${firstSixLetters}...${lastFourLetters}`
    : `${firstSixLetters}...`;
};
