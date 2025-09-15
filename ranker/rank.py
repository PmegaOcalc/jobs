from transformers import AutoModel
from numpy.linalg import norm
from location import extract_locations


def cos_sim(a, b):
    return (a @ b.T) / (norm(a) * norm(b))


model = AutoModel.from_pretrained(
    'jinaai/jina-embeddings-v2-base-en', trust_remote_code=True)

positive_preferences = {
    "traction seed fund distributed early stage senior full-stack engineers fully remote first typescript python postgres node javascript": 2.0,
    "remote in europe timezone": 10.0,
}
negative_preferences = {
    'onsite or hybrid in the office go java c++ rust rails ruby mongodb web3 ember crypto angular redux mysql': 2.0,
    "united states timezone only ": 10.0,
    "onsite london": 10.0,
}


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

# # extract locations from job ads
# extracted_locations = [extract_locations(job_ad) for job_ad in job_ads]


final_similarity_scores = [sum(positive_scores) - sum(negative_scores) for positive_scores,
                           negative_scores in zip(zip(*positive_similarity_scores), zip(*negative_similarity_scores))]

# Zip scores and ads together, then sort
ranked_pairs = sorted(zip(final_similarity_scores, job_ads), reverse=True)

# Unzip pairs into ranked ads and scores
ranked_job_ads, ranked_scores = zip(*ranked_pairs)

for i, (score, ad) in enumerate(zip(ranked_job_ads, ranked_scores)):
    print(f'{i+1}. {ad}')
    print(f'Similarity Score: {score}')
    print()
