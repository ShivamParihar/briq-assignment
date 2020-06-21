function termFreqMap(str) {
  var words = str.split(" ");
  var termFreq = {};
  words.forEach(function (w) {
    termFreq[w] = (termFreq[w] || 0) + 1;
  });
  return termFreq;
}

function addKeysToDict(map, dict) {
  for (var key in map) {
    dict[key] = true;
  }
}

function termFreqMapToVector(map, dict) {
  var termFreqVector = [];
  for (var term in dict) {
    termFreqVector.push(map[term] || 0);
  }
  return termFreqVector;
}

function vecDotProduct(vecA, vecB) {
  var product = 0;
  for (var i = 0; i < vecA.length; i++) {
    product += vecA[i] * vecB[i];
  }
  return product;
}

function vecMagnitude(vec) {
  var sum = 0;
  for (var i = 0; i < vec.length; i++) {
    sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

function CosineSimilarity(vecA, vecB) {
  return vecDotProduct(vecA, vecB) / (vecMagnitude(vecA) * vecMagnitude(vecB));
}

function cosineSimilarity(strA, strB) {
  var termFreqA = termFreqMap(strA);
  var termFreqB = termFreqMap(strB);

  var dict = {};
  addKeysToDict(termFreqA, dict);
  addKeysToDict(termFreqB, dict);

  var termFreqVecA = termFreqMapToVector(termFreqA, dict);
  var termFreqVecB = termFreqMapToVector(termFreqB, dict);

  return CosineSimilarity(termFreqVecA, termFreqVecB);
}

function getSimilarQuote(currentQuote, allQuoteArray, history) {
  const prevQuotes = history.map((quote) => quote["id"]);

  let mostSimilarQuote = {};
  let mostSimilarQuoteSimilarity = 0;
  for (let i = 0; i < allQuoteArray.length; i++) {
    const currentSimilarity = cosineSimilarity(
      currentQuote["en"],
      allQuoteArray[i]["en"]
    );
    if (
      !prevQuotes.includes(allQuoteArray[i]["_id"]) &&
      currentSimilarity > mostSimilarQuoteSimilarity
    ) {
      mostSimilarQuote = allQuoteArray[i];
      mostSimilarQuoteSimilarity = currentSimilarity;
    }
  }
  return mostSimilarQuote;
}

function getDissimilarQuote(currentQuote, allQuoteArray, history) {
  const prevQuotes = history.map((quote) => quote["id"]);

  let mostDissimilarQuote = {};
  let mostDissimilarQuoteSimilarity = 1;
  for (let i = 0; i < allQuoteArray.length; i++) {
    const currentSimilarity = cosineSimilarity(
      currentQuote["en"],
      allQuoteArray[i]["en"]
    );
    if (
      !prevQuotes.includes(allQuoteArray[i]["_id"]) &&
      currentSimilarity < mostDissimilarQuoteSimilarity
    ) {
      mostDissimilarQuote = allQuoteArray[i];
      mostDissimilarQuoteSimilarity = currentSimilarity;
    }
  }
  return mostDissimilarQuote;
}

export { getSimilarQuote, getDissimilarQuote };
