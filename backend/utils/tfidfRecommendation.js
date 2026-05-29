const natural = require("natural");

const TfIdf = natural.TfIdf;

function calculateSimilarity(doc1, doc2) {
  const tfidf = new TfIdf();

  tfidf.addDocument(doc1);
  tfidf.addDocument(doc2);

  const terms = new Set();

  tfidf.listTerms(0).forEach((t) => terms.add(t.term));
  tfidf.listTerms(1).forEach((t) => terms.add(t.term));

  const vector1 = [];
  const vector2 = [];

  terms.forEach((term) => {
    vector1.push(tfidf.tfidf(term, 0));
    vector2.push(tfidf.tfidf(term, 1));
  });

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < vector1.length; i++) {
    dotProduct += vector1[i] * vector2[i];

    magnitude1 += vector1[i] * vector1[i];
    magnitude2 += vector2[i] * vector2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}

module.exports = calculateSimilarity;