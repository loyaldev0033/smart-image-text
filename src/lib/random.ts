export function getRandomArrayElements(arr: Array<any>, count: number) {
  // Shuffle the array
  const shuffled = arr.sort(() => 0.5 - Math.random());
  // Get sub-array of first n elements after shuffle
  return shuffled.slice(0, count);
}
