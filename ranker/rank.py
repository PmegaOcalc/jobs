from transformers import AutoModel
from numpy.linalg import norm
import spacy

# Load SpaCy NER model
nlp = spacy.load("en_core_web_sm")


def extract_locations(text):
    doc = nlp(text)
    locations = []
    print(doc.ents)
    for ent in doc.ents:
        # GPE represents geopolitical entities (locations)
        if ent.label_ == "GPE":
            locations.append(ent.text)
    return locations


def cos_sim(a, b):
    return (a @ b.T) / (norm(a) * norm(b))


model = AutoModel.from_pretrained(
    'jina-embeddings-v2-base-en', trust_remote_code=True)

positive_preferences = {
    "traction seed fund distributed early stage senior full-stack engineers fully remote first based in europe timezone typescript python postgres node javascript": 2.0,
}
negative_preferences = {
    'onsite or hybrid in the office go java c++ rust rails ruby mongodb web3 ember crypto angular redux mysql united states timezone only': 2.0,
}

with open('../scraper/december-2023.txt', 'r') as f:
    job_ads = f.readlines()

# iterate through job ads and extract locations
job_ads = [job_ad.strip() for job_ad in job_ads]  # remove trailing whitespace
job_ads = [job_ad for job_ad in job_ads if job_ad]  # remove empty lines


positive_preference_embeddings = [model.encode(
    [preference])[0] for preference in positive_preferences]
job_ad_embeddings = model.encode(job_ads)


positive_similarity_scores = []
for positive_preference, weight in positive_preferences.items():
    positive_preference_embedding = model.encode([positive_preference])[0]
    positive_similarity = [cos_sim(
        positive_preference_embedding, embedding) for embedding in job_ad_embeddings]
    scaled_positive_similarity = [similarity *
                                  weight for similarity in positive_similarity]
    positive_similarity_scores.append(scaled_positive_similarity)

negative_similarity_scores = []
for negative_preference, weight in negative_preferences.items():
    negative_preference_embedding = model.encode([negative_preference])[0]
    negative_similarity = [cos_sim(
        negative_preference_embedding, embedding) for embedding in job_ad_embeddings]
    scaled_negative_similarity = [similarity *
                                  weight for similarity in negative_similarity]
    negative_similarity_scores.append(scaled_negative_similarity)

final_similarity_scores = [sum(positive_scores) - sum(negative_scores) for positive_scores,
                           negative_scores in zip(zip(*positive_similarity_scores), zip(*negative_similarity_scores))]

ranked_job_ads = [job_ad for _, job_ad in sorted(
    zip(final_similarity_scores, job_ads), reverse=True)]

for i, job_ad in enumerate(ranked_job_ads):
    print(f'{i+1}. {job_ad}')
    print(f'Similarity Score: {final_similarity_scores[i]}')
    print()
