const accessKey = "4V3Db08myHARpW35etsGhzquoyPj1Mc-Z7STF8HiaT4";
const perPage = "20";
const orderBy = "popular";
async function fetchSearch({ queryKey, pageParam = 1 }) {
  const { searchTerm } = queryKey[1];
  const res = searchTerm
    ? await fetch(
        `https://api.unsplash.com/photos?client_id=${accessKey}&page=${pageParam}&per_page=${perPage}&query=${searchTerm}`
      )
    : await fetch(
        `https://api.unsplash.com/photos?client_id=${accessKey}&page=${pageParam}&per_page=${perPage}&order_by=${orderBy}`
      );

  if (!res.ok) throw new Error(`Something went wrong.`);

  return res.json();
}

export default fetchSearch;
